"""Assemble read-only context from hq/ for the HQ Assistant."""

from __future__ import annotations

import json
import re
import subprocess
import sys
from datetime import date, timedelta
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
HQ = REPO_ROOT / "hq"
DASH = HQ / "00_Dashboard"
KP = HQ / "03_Kundenprojekte"
REGISTRY = KP / "_registry.json"
BOARD = HQ / "02_Operations_Board" / "Operations_Board_Juni_2026.md"
ARBEITS = DASH / "ARBEITSUEBERSICHT.md"
KUNDEN_UEBERSICHT = DASH / "Kunden_Uebersicht.md"
BACKLOG = DASH / "BACKLOG.md"
DFSS_DIR = HQ / "07_DFSS"
DFSS_MEASUREMENT_STATUS = DFSS_DIR / "DFSS_MEASUREMENT_STATUS.md"
DFSS_README = DFSS_DIR / "README.md"

MAX_FILE_CHARS = 12_000
MAX_TOTAL_CHARS = 90_000

PORTFOLIO_INTENT_RE = re.compile(
    r"\b("
    r"blockiert|blocker|portfolio|alle kunden|welche kunden|"
    r"audits?\s+(stehen|in den|nächsten|naechsten|30)|"
    r"überfällig|ueberfaellig|overdue|"
    r"urgent|dringend|priorität|prioritaet|"
    r"forderung|forderungen|rechnung|"
    r"rote ampel|rote kunden|🔴|"
    r"wartet auf (kunde|dekra|auditor)|"
    r"wichtigste aufgaben|heute fokus|heute dringend|"
    r"morgen früh|morgen frueh|erstes machen|"
    r"was blockiert|geschäft|geschaeft|was ist heute"
    r")\b",
    re.I,
)

CROSS_INTENT_RE = re.compile(
    r"\b(forderung|forderungen|rechnung|mahnung|angebot|vertrieb|software|afas)\b",
    re.I,
)

DFSS_INTENT_RE = re.compile(
    r"\b("
    r"dfss|"
    r"s0[\s-]?blocker|"
    r"evidence[\s-]?ids?|"
    r"ev-(tf|ws|sr|sg)-|"
    r"pilot[\s-]?(measurement|daten|data|status)|"
    r"measurement[\s-]?activation|"
    r"missing[\s-]?pilot|"
    r"p-id|p0[1-5]"
    r")\b",
    re.I,
)

TERMINAL_CMD_RE = re.compile(
    r"^(?:"
    r"git\s+"
    r"|source\s+"
    r"|\.venv/"
    r"|/usr/"
    r"|/bin/"
    r"|export\s+"
    r"|cd\s+"
    r"|pip3?\s+"
    r"|npm\s+"
    r"|yarn\s+"
    r"|make\s+"
    r"|sudo\s+"
    r"|python3?\s+(-m\s+)?"
    r"|\.venv/bin/python"
    r")",
    re.I,
)

CROSS_FILES = [
    ("Forderungen", HQ / "05_Forderungen" / "Offene_Juni_2026.md"),
    ("Vertrieb", HQ / "04_Vertrieb" / "Angebote_Juni_2026.md"),
    ("Software", HQ / "06_Software" / "Software_Backlog_Juni_2026.md"),
    ("DFSS", HQ / "07_DFSS" / "Pilot_Measurement_Juni_2026.md"),
]

TERMINAL_HINT = (
    "Das sieht nach einem Terminalbefehl aus. Ich führe ihn nicht als HQ-Abfrage aus. "
    "Bitte im Terminal ausführen."
)


def is_terminal_command(text: str) -> bool:
    t = text.strip()
    if not t:
        return False
    if TERMINAL_CMD_RE.match(t):
        return True
    if re.match(r"^(git|source|pip3?|npm|cd|export|sudo)\s+\S", t, re.I):
        return True
    if re.match(r"^\.venv/bin/", t, re.I):
        return True
    if re.match(r"^\./", t):
        return True
    if re.match(r"^python3?\s+\S+\.py\b", t, re.I):
        return True
    if re.match(r"^python3?\s+-m\s+", t, re.I):
        return True
    if "build_dashboard.py" in t and "?" not in t:
        return True
    return False


def _date_context_block(today: date | None = None) -> str:
    today = today or date.today()
    tomorrow = today + timedelta(days=1)
    return (
        "### Datumskontext (für Antworten)\n\n"
        f"- **Heute:** {today.isoformat()} ({today.strftime('%d.%m.%Y')})\n"
        f"- **Morgen:** {tomorrow.isoformat()} ({tomorrow.strftime('%d.%m.%Y')})\n"
        "- Relative Begriffe in Antworten: „heute“ = Heute oben; „morgen“ = Morgen oben.\n"
        "- Abschnitt **„Morgen früh“** im Operations Board = historische Import-Überschrift "
        "(Stand Juni 2026), **nicht** automatisch der Kalendertag „Morgen“.\n"
        "- To-dos mit Wort „heute“ im Aufgabentext = Formulierung beim Anlegen; "
        "nur als **heute fällig** werten, wenn Frist = Heute oder explizit so vermerkt."
    )


def refresh_briefing() -> None:
    script = HQ / "scripts" / "build_dashboard.py"
    subprocess.run(
        [sys.executable, str(script)],
        cwd=REPO_ROOT,
        check=True,
    )


def load_registry() -> dict:
    return json.loads(REGISTRY.read_text(encoding="utf-8"))


def _truncate(text: str, limit: int = MAX_FILE_CHARS) -> str:
    if len(text) <= limit:
        return text
    return text[: limit - 80] + "\n\n… [gekürzt für Kontextlimit]\n"


def detect_customer_slugs(question: str, registry: dict) -> list[str]:
    q = question.lower()
    found: list[str] = []
    for p in registry.get("projects", []):
        slug = p["slug"]
        names = {slug.lower(), slug.replace("_", " ").lower(), p["display_name"].lower()}
        names.update(a.lower() for a in p.get("aliases", []))
        if any(n in q for n in names if len(n) >= 4):
            found.append(slug)
    return found


def _read_block(label: str, path: Path) -> str | None:
    if not path.exists():
        return None
    body = _truncate(path.read_text(encoding="utf-8"))
    return f"### {label}\nPfad: `{path.relative_to(REPO_ROOT)}`\n\n{body}"


def is_dfss_question(question: str) -> bool:
    q = question.strip()
    if not q:
        return False
    if DFSS_INTENT_RE.search(q):
        return True
    return bool(
        re.search(
            r"dfss\s+status|pilot\s+daten|measurement\s+activation|pilot\s+measurement\s+status",
            q,
            re.I,
        )
    )


def build_dfss_context_pack() -> tuple[str, list[str], str]:
    """DFSS status / evidence / S0 — primary source: DFSS_MEASUREMENT_STATUS.md."""
    blocks: list[str] = [_date_context_block()]
    sources: list[str] = []

    def add(label: str, path: Path) -> None:
        chunk = _read_block(label, path)
        if chunk:
            blocks.append(chunk)
            sources.append(str(path.relative_to(REPO_ROOT)))

    add("DFSS Measurement Status", DFSS_MEASUREMENT_STATUS)
    if DFSS_README.exists():
        add("DFSS README", DFSS_README)

    blocks.append(
        "### Modus\n"
        "**DFSS-Frage** — antworte primär aus `DFSS_MEASUREMENT_STATUS.md`.\n"
        "- §1 Portfolio Quick Status\n"
        "- §2 S0 Blocker Overview\n"
        "- §3 Evidence Lookup (**EV-TF/WS/SR/SG-…**, nicht TODO-*-IDs)\n"
        "- §4 Missing Pilot Data\n"
        "- §5 Next DFSS Actions\n"
        "Gate: NOT READY FOR PILOT VALIDATION REPORT — DATA COLLECTION REQUIRED.\n"
        "Keine Pilotdaten oder Zielwerte erfinden; fehlende Werte: **TBD / nicht gepflegt**."
    )

    text = "\n\n---\n\n".join(blocks)
    if len(text) > MAX_TOTAL_CHARS:
        text = text[: MAX_TOTAL_CHARS - 120] + "\n\n… [Gesamtkontext gekürzt]\n"
    return text, sources, "dfss"


def is_portfolio_question(question: str, slugs: list[str]) -> bool:
    """Portfolio = keine Kundenerkennung oder explizite Übersichtsfrage."""
    if not question.strip():
        return True
    if PORTFOLIO_INTENT_RE.search(question):
        return True
    if slugs and not PORTFOLIO_INTENT_RE.search(question):
        return False
    return len(slugs) == 0


def build_context_pack(
    *,
    question: str = "",
    extra_slugs: list[str] | None = None,
    include_full_briefing: bool = False,
    include_cross: bool = False,
    force_portfolio: bool = False,
) -> tuple[str, list[str], str]:
    """Return (context_text, source_paths, mode) where mode is dfss|portfolio|customer."""
    if is_dfss_question(question):
        return build_dfss_context_pack()

    registry = load_registry()
    slugs = list(dict.fromkeys((extra_slugs or []) + detect_customer_slugs(question, registry)))
    portfolio = force_portfolio or is_portfolio_question(question, slugs)

    blocks: list[str] = [_date_context_block()]
    sources: list[str] = []

    def add(label: str, path: Path) -> None:
        chunk = _read_block(label, path)
        if chunk:
            blocks.append(chunk)
            sources.append(str(path.relative_to(REPO_ROOT)))

    add("Kundenübersicht", KUNDEN_UEBERSICHT)
    add("Arbeitsübersicht", ARBEITS)

    if portfolio:
        add("Backlog (Spiegel)", BACKLOG)
        if include_cross or CROSS_INTENT_RE.search(question or ""):
            for label, path in CROSS_FILES:
                add(f"Querschnitt {label}", path)
        modus_hint = (
            "**Portfolio-Frage** — primär `Kunden_Uebersicht.md` (Ampeln, Termine), "
            "dann `ARBEITSUEBERSICHT.md` (offene Aufgaben). "
            "Details/Blocker: jeweilige `Status.md` nur bei Bedarf."
        )
        if re.search(r"morgen früh|morgen frueh|erstes machen|heute dringend|was ist heute", question, re.I):
            modus_hint += (
                " Priorität: urgent-Zeilen in Arbeitsübersicht, Audit-Termine in Kundenübersicht."
            )
        blocks.append(f"### Modus\n{modus_hint}")
    else:
        for slug in slugs:
            base = KP / slug
            display = next(
                (p["display_name"] for p in registry["projects"] if p["slug"] == slug),
                slug,
            )
            add(f"{display} — Status", base / "Status.md")
            add(f"{display} — ToDos", base / "ToDos.md")
            if (base / "Audit_2026.md").exists():
                add(f"{display} — Audit 2026", base / "Audit_2026.md")
        blocks.append(
            "### Modus\n"
            f"**Kunden-Frage** ({', '.join(slugs)}) — Kundenübersicht + Status/ToDos/Audit."
        )

    if include_cross and not portfolio:
        for label, path in CROSS_FILES:
            add(f"Querschnitt {label}", path)

    text = "\n\n---\n\n".join(blocks)
    if len(text) > MAX_TOTAL_CHARS:
        text = text[: MAX_TOTAL_CHARS - 120] + "\n\n… [Gesamtkontext gekürzt]\n"
    mode = "portfolio" if portfolio else "customer"
    return text, sources, mode


SYSTEM_PROMPT = """Du bist der **Cert-Expert HQ Assistant** — Organisation, Steuerung, To-dos.

## Quellen
- Antworte **nur** aus **HQ-KONTEXT** (`Kunden_Uebersicht.md`, `ARBEITSUEBERSICHT.md`, Kundenordner).
- Felder mit `(inferred)` oder `TBD`/`unbekannt` nicht als harte Fakten darstellen.
- Nichts erfinden. Fehlende Daten benennen.

## Datum
- Nutze **Datumskontext** am Anfang des HQ-KONTEXT (Heute/Morgen).
- Nenne in Antworten das konkrete Datum (DD.MM.YYYY), nicht nur „heute“, wenn es Missverständnisse vermeidet.
- „Morgen früh“ im Operations Board ≠ Kalender-Morgen.

## Antwortschablone — Portfolio-Fragen
1. **Kurzantwort** (1–3 Sätze)
2. **Tabelle oder Liste** (aus Kundenübersicht + Arbeitsübersicht)
3. **Kritischste 3 Punkte**
4. **Nächste empfohlene Aktion**

## Antwortschablone — Kundenfragen
1. **Ampel**
2. **Auditdatum / Frist**
3. **Hauptblocker**
4. **Offene urgent To-dos** (kurz)
5. **Nächste Aktion**
6. **Quellen** (Dateipfade aus Übersicht/Kundenordner)

## To-dos schreiben
Terminal: `python -m bots.00_hq_assistant.hq_bot "todo TeamFlex: …"` — im Chat nur auf explizite Bitte in `ToDos.md` schreiben.

## Antwortschablone — DFSS-Fragen
1. **Kurzantwort** (Gate + Stand aus Measurement Status)
2. **Portfolio Quick Status** (Tabelle/Kurzliste der vier Rollout-Kunden)
3. **S0 Blocker Overview** (S0-01 … S0-08 mit EV-*-Bezug)
4. **Evidence Lookup** — IDs als **EV-TF-001**, **EV-WS-001**, **EV-SR-001**, **EV-SG-001** (nicht TODO-*)
5. **Missing Pilot Data** — explizit als fehlend / TBD
6. **Next DFSS Actions** (dfss01–dfss04)

## Verboten
Keine GB/SK/EK-Dokumente, kein `knowledge/` für Normen, nichts als erledigt markieren ohne Beleg.
Keine Pilot Validation Reports behaupten; keine Zielwerte erfinden.
"""
