"""
Gefährdungsbeurteilungs-Bot

Pipeline:
  1. Load and validate structured JSON input
  2. Build system + user prompt from input data
  3. Call LM Studio via api_client (retry up to 3x on parse failure)
  4. Run QA check on parsed output
  5. Save Tool-1-compatible JSON output
  6. Save test DOCX (prefixed [DRAFT] if qa_status != 'ok')

Usage:
    python -m bots.01_gefaehrdungsbeurteilung.gb_bot
    python -m bots.01_gefaehrdungsbeurteilung.gb_bot inputs/my_input.json
"""

import json
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from shared.api_client import ask_qwen
from shared.docx_writer import save_structured_docx
from shared.input_loader import load_input
from shared.quality_checker import check as qa_check

DEFAULT_INPUT = "inputs/gefaehrdungsbeurteilung_example.json"
MAX_RETRIES = 3

SYSTEM_PROMPT = """Du bist ein Fachassistent für Gefährdungsbeurteilungen im Sicherheits- und Veranstaltungsdienst.

STRENGE REGELN — diese gelten absolut:
- Erfinde KEINE Informationen, Orte, Daten, Verbände, Regelwerke oder Zahlen.
- Fülle KEINE fehlenden Felder mit Annahmen oder Schätzungen auf.
- Wenn eine Information fehlt, schreibe exakt: [OFFENER PUNKT] <Beschreibung was fehlt>
- Schreibe sachlich, präzise und auditnah — kein Werbeton, keine Relativierungen.
- Keine finale rechtliche oder sicherheitstechnische Freigabe vortäuschen.
- Halte dich ausschließlich an die im Input angegebenen Fakten.

AUSGABEFORMAT — du gibst NUR valides JSON zurück, ohne Markdown-Blöcke, ohne Erklärungen:

{
  "document_type": "gefaehrdungsbeurteilung",
  "placeholders": {
    "GB_TAETIGKEIT": "...",
    "GB_GEFAEHRDUNGEN": "...",
    "GB_RISIKOBEWERTUNG": "...",
    "GB_SCHUTZMASSNAHMEN": "...",
    "GB_OFFENE_PUNKTE": "..."
  },
  "open_points": ["[OFFENER PUNKT] ..."],
  "qa_status": "ok"
}

Wenn es offene Punkte gibt, setze qa_status auf "review_required" und trage jeden Punkt in open_points ein.
Trage in GB_OFFENE_PUNKTE eine lesbare Zusammenfassung aller offenen Punkte ein.
Wenn es keine offenen Punkte gibt, setze qa_status auf "ok" und open_points auf [].
"""


def _build_user_prompt(data: dict) -> str:
    special_risks = data.get("special_risks", [])
    risks_text = (
        "\n".join(f"  - {r}" for r in special_risks)
        if special_risks
        else "  [OFFENER PUNKT] Keine besonderen Risiken angegeben"
    )

    approved_by = data.get("approved_by", "").strip()
    approved_line = approved_by if approved_by else "[OFFENER PUNKT] Nicht angegeben"

    notes = data.get("notes", "").strip()
    notes_line = notes if notes else "Keine"

    return f"""Erstelle eine Gefährdungsbeurteilung auf Basis der folgenden Projektdaten.
Erfinde keine fehlenden Informationen. Markiere alles Fehlende als [OFFENER PUNKT].

PROJEKTDATEN:
  Veranstaltungsname:        {data.get('event_name', '[OFFENER PUNKT]')}
  Veranstaltungstyp:         {data.get('event_type', '[OFFENER PUNKT]')}
  Datum:                     {data.get('event_date', '[OFFENER PUNKT]')}
  Ort:                       {data.get('event_location', '[OFFENER PUNKT]')}
  Erwartete Zuschauer:       {data.get('expected_attendees', '[OFFENER PUNKT]')}
  Sicherheitsmitarbeiter:    {data.get('security_staff_count', '[OFFENER PUNKT]')}
  Hallenkapazität:           {data.get('venue_capacity', '[OFFENER PUNKT]')}
  Notausgänge:               {data.get('venue_exits', '[OFFENER PUNKT]')}
  Auftraggeber:              {data.get('client_name', '[OFFENER PUNKT]')}
  Erstellt von:              {data.get('created_by', '[OFFENER PUNKT]')}
  Freigegeben von:           {approved_line}
  Besondere Risiken:
{risks_text}
  Hinweise:                  {notes_line}

Erstelle jetzt die Gefährdungsbeurteilung im vorgegebenen JSON-Format.
"""


def _parse_with_retry(prompt_system: str, prompt_user: str, output_dir: Path) -> dict:
    last_raw = ""
    for attempt in range(1, MAX_RETRIES + 1):
        raw = ask_qwen(prompt_system, prompt_user, temperature=0.3)
        last_raw = raw

        cleaned = raw.strip()
        if cleaned.startswith("```"):
            lines = cleaned.splitlines()
            cleaned = "\n".join(
                line for line in lines if not line.strip().startswith("```")
            ).strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            print(f"[WARNUNG] JSON-Parse fehlgeschlagen (Versuch {attempt}/{MAX_RETRIES})")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    error_path = output_dir / f"raw_error_{timestamp}.txt"
    error_path.write_text(last_raw, encoding="utf-8")
    raise RuntimeError(
        f"LLM hat nach {MAX_RETRIES} Versuchen kein valides JSON geliefert. "
        f"Rohausgabe gespeichert: {error_path}"
    )


def run(input_path: str = DEFAULT_INPUT) -> dict:
    print(f"\n[GB-Bot] Lade Input: {input_path}")
    loaded = load_input(input_path)
    data = loaded["data"]
    pre_open_points = loaded["pre_open_points"]

    if pre_open_points:
        print(f"[GB-Bot] {len(pre_open_points)} offene Punkte aus Input erkannt:")
        for p in pre_open_points:
            print(f"  {p}")

    print("[GB-Bot] Sende Anfrage an LM Studio ...")
    output_dir = Path("outputs")
    output_dir.mkdir(exist_ok=True)

    bot_output = _parse_with_retry(SYSTEM_PROMPT, _build_user_prompt(data), output_dir)

    print("[GB-Bot] QA-Prüfung ...")
    final_output = qa_check(bot_output, pre_open_points)

    event_slug = (
        data.get("event_name", "dokument")
        .lower()
        .replace(" ", "_")
        .replace("/", "-")[:40]
    )
    date_slug = datetime.now().strftime("%Y%m%d_%H%M%S")

    final_output["meta"] = {
        "created_at": datetime.now().isoformat(timespec="seconds"),
        "input_file": str(input_path),
        "event_name": data.get("event_name", ""),
        "created_by": data.get("created_by", ""),
        "pipeline_version": "1.0",
    }

    json_path = output_dir / f"gb_{event_slug}_{date_slug}.json"
    json_path.write_text(
        json.dumps(final_output, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"[GB-Bot] JSON gespeichert: {json_path}")

    docx_path = output_dir / f"gb_{event_slug}_{date_slug}.docx"
    save_structured_docx(final_output, str(docx_path))

    qa_status = final_output.get("qa_status", "review_required")
    open_count = len(final_output.get("open_points", []))
    print(f"\n[GB-Bot] Fertig — QA-Status: {qa_status.upper()} | Offene Punkte: {open_count}")

    return final_output


if __name__ == "__main__":
    input_file = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_INPUT
    run(input_file)
