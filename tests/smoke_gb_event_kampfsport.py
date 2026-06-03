"""
End-to-end smoke test for the gb_event_kampfsport pipeline — without LLM.

What this test covers (Phase 1 minimum):
  1. Blueprint loads cleanly from knowledge/7_blueprint/gb_event_kampfsport.json
  2. All referenced knowledge modules exist on disk
  3. Input file inputs/gb_event_kampfsport.json loads cleanly via input_loader
  4. context_builder produces a non-empty system_prompt with the expected sections
  5. context_builder produces a user_prompt with project data substituted
  6. quality_checker enriches a stub bot output and tags missing ai_blocks /
     pre_open_points correctly
  7. docx_builder.render_docx() can render the final DOCX from a stub bot output
     using templates/gb_event_kampfsport.docx (requires Node.js renderer)

This test is intentionally non-mocking and idempotent: it writes its outputs
into outputs/ with a `_smoke_` prefix and exits non-zero on the first failure.

Run from project root:
    python3 tests/smoke_gb_event_kampfsport.py
"""

from __future__ import annotations

import json
import sys
from datetime import datetime
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from shared.blueprint_loader import load_blueprint
from shared.context_builder import build_system_prompt, build_user_prompt
from shared.docx_builder import DocxRenderError, render_docx
from shared.input_loader import load_input
from shared.quality_checker import check as qa_check

BLUEPRINT_ID = "gb_event_kampfsport"
INPUT_FILE = PROJECT_ROOT / "inputs" / "gb_event_kampfsport.json"
OUTPUT_DIR = PROJECT_ROOT / "outputs"


def _assert(cond: bool, msg: str) -> None:
    if not cond:
        print(f"  FAIL: {msg}")
        sys.exit(1)
    print(f"  ok  : {msg}")


def _stub_bot_output(ai_blocks: tuple[str, ...]) -> dict:
    """A deterministic stub that mimics a Qwen response shape."""
    return {
        "document_type": BLUEPRINT_ID,
        "placeholders": {
            "GB_TAETIGKEIT": (
                "Die Maßnahme betrifft die Absicherung des K1-Kampfturniers "
                "\u201eBerlin Open 2026\u201c am 14.06.2026 in der Sporthalle "
                "Musterstraße 12, 10115 Berlin. Eingesetzt werden 6 "
                "Sicherheitsmitarbeiter im Auftrag des Sportclub Musterhausen e.V."
            ),
            "GB_GEFAEHRDUNGEN": (
                "Publikum: erhöhtes Aggressionspotenzial bei intensiven Kämpfen; "
                "alkoholbedingte Konflikte (Ausschank vorgesehen). "
                "Sport: Verletzungen durch Vollkontakttechniken; Übergriffe "
                "auf Schiedsrichter. "
                "Örtlichkeit: 4 Notausgänge bei 350 erwarteten Personen — "
                "Beschilderung vor Veranstaltungsbeginn prüfen. "
                "[OFFENER PUNKT] Vorhandensein eines Fluchtwegplans nicht belegt."
            ),
            "GB_RISIKOBEWERTUNG": (
                "Aggression Zuschauer: Wahrscheinlichkeit mittel, Schwere mittel, "
                "Gesamtrisiko mittel. "
                "Sportverletzungen: Wahrscheinlichkeit mittel, Schwere hoch, "
                "Gesamtrisiko hoch. "
                "Crowd am Einlass: Wahrscheinlichkeit hoch, Schwere gering, "
                "Gesamtrisiko mittel."
            ),
            "GB_SCHUTZMASSNAHMEN": (
                "S — Substitution: nicht anwendbar. "
                "T — Technisch: Funkkommunikation mit getrennten Kanälen; "
                "mobile Absperrungen am Einlass. "
                "O — Organisatorisch: Pre-Briefing 60 Minuten vor Einlass; "
                "definierte Eskalationsstufen Ansprache → Aufforderung → "
                "Hausrecht → Polizei. "
                "P — Persönlich: Sachkundenachweis nach §34a GewO bei allen "
                "Kräften; einheitliche Dienstkleidung."
            ),
            "GB_VERANTWORTLICHKEITEN": (
                "Auftraggeber: Sportclub Musterhausen e.V. "
                "Auftragnehmer: Cert-Expert GmbH, mit Einsatzleitung und 6 "
                "Sicherheitskräften. "
                "Erstellung dieser GB: M. Mahra. "
                "[OFFENER PUNKT] Sanitätsdienst und Ringarzt nicht im Input."
            ),
            "GB_OFFENE_PUNKTE": (
                "1. [OFFENER PUNKT] Freigabe durch Auftraggeber ausstehend.\n"
                "2. [OFFENER PUNKT] Sanitätsdienst nicht im Input.\n"
                "3. [OFFENER PUNKT] Fluchtwegplan nicht belegt."
            ),
        },
        "open_points": [
            "[OFFENER PUNKT] Freigabe durch Auftraggeber ausstehend.",
            "[OFFENER PUNKT] Sanitätsdienst nicht im Input.",
            "[OFFENER PUNKT] Fluchtwegplan nicht belegt.",
        ],
        "qa_status": "review_required",
    }


def main() -> None:
    print(f"[smoke] Blueprint: {BLUEPRINT_ID}")

    print("[smoke] (1) load_blueprint")
    bp = load_blueprint(BLUEPRINT_ID)
    _assert(bp.blueprint_id == BLUEPRINT_ID, "blueprint id match")
    _assert(bp.template_path.exists(), f"template file exists at {bp.template_path}")
    _assert(len(bp.ai_blocks) == 6, "blueprint defines 6 ai_blocks")
    _assert("GB_VERANTWORTLICHKEITEN" in bp.ai_blocks,
            "ai_blocks includes GB_VERANTWORTLICHKEITEN")
    for cat, paths in bp.context_module_paths.items():
        _assert(all(p.exists() for p in paths), f"all {cat} modules exist")

    print("[smoke] (2) load_input")
    loaded = load_input(str(INPUT_FILE))
    data = loaded["data"]
    pre = loaded["pre_open_points"]
    _assert(loaded["blueprint"].blueprint_id == BLUEPRINT_ID,
            "envelope blueprint_id resolved")
    _assert(data["event_name"].startswith("K1"), "event_name in data")
    _assert(any("Freigegeben" in p for p in pre),
            "approval_missing trigger fired")
    _assert(any("Sanitätsdienst" in p for p in pre),
            "medical_service_missing trigger fired")

    print("[smoke] (3) build_system_prompt")
    sys_prompt = build_system_prompt(bp)
    _assert("# Halluzinationsgrenzen" in sys_prompt,
            "system prompt includes base hallucination rules")
    _assert("STOP-Prinzip" in sys_prompt,
            "system prompt includes STOP-Prinzip guidance")
    _assert("Kampfsport" in sys_prompt,
            "system prompt includes kampfsport subtype")
    _assert("GB_VERANTWORTLICHKEITEN" in sys_prompt,
            "system prompt embeds output_schema with all ai_blocks")
    # Full GB prompt is large (~146k chars) until guides are trimmed; cap is sanity-only.
    # Token budget enforcement: see docs/CONTEXT_ASSEMBLY_POLICY.md and BOT_CONTEXT_MAP.md.
    _assert(len(sys_prompt) < 160_000,
            f"system prompt under sanity size guard ({len(sys_prompt)} chars)")

    print("[smoke] (4) build_user_prompt")
    user_prompt = build_user_prompt(bp, data, pre)
    _assert("K1-Kampfturnier Berlin Open 2026" in user_prompt,
            "user prompt embeds event_name")
    _assert("Sportclub Musterhausen" in user_prompt,
            "user prompt embeds client_name")
    import re as _re
    leftover = [
        m.group(0)
        for m in _re.finditer(r"\{\{([A-Za-z_][A-Za-z0-9_]*)\}\}", user_prompt)
    ]
    _assert(
        not leftover,
        f"user prompt has no unsubstituted real variables (leftover={leftover})",
    )

    print("[smoke] (5) quality_checker on stub")
    stub = _stub_bot_output(bp.ai_blocks)
    enriched = qa_check(stub, pre, blueprint=bp)
    _assert(enriched["qa_status"] == "review_required",
            "stub with open points → review_required")
    _assert(enriched["document_type"] == BLUEPRINT_ID,
            "document_type set from blueprint")
    _assert(len(enriched["open_points"]) >= 3,
            "open_points consolidated (≥3)")
    _assert(all(k in enriched["placeholders"] for k in bp.ai_blocks),
            "all ai_blocks present in placeholders after QA")

    print("[smoke] (6) render_docx with template")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    docx_path = OUTPUT_DIR / f"_smoke_{BLUEPRINT_ID}_{ts}.docx"
    enriched_for_render = dict(enriched)
    enriched_for_render["meta"] = {
        "created_at":   datetime.now().isoformat(timespec="seconds"),
        "input_file":   str(INPUT_FILE),
        "blueprint_id": BLUEPRINT_ID,
        "event_name":   data.get("event_name", ""),
        "created_by":   data.get("created_by", ""),
        "pipeline_version": "smoke-1.0",
    }

    try:
        render_docx(bot_output=enriched_for_render, output_path=str(docx_path))
        _assert(docx_path.exists() and docx_path.stat().st_size > 1000,
                f"DOCX rendered at {docx_path.relative_to(PROJECT_ROOT)}")
    except (DocxRenderError, FileNotFoundError) as e:
        print(f"  SKIP: render_docx failed (likely no Node renderer): {e}")
        sys.exit(2)

    json_path = OUTPUT_DIR / f"_smoke_{BLUEPRINT_ID}_{ts}.json"
    json_path.write_text(
        json.dumps(enriched_for_render, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print()
    print(f"[smoke] PASS — outputs:")
    print(f"  - {json_path.relative_to(PROJECT_ROOT)}")
    print(f"  - {docx_path.relative_to(PROJECT_ROOT)}")


if __name__ == "__main__":
    main()
