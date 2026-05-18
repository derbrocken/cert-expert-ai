"""
Smoke / audit: K1 kleines Turnier, 2 Security — ohne LLM.

Prüft:
  - Blueprint lädt die neu verkabelten risk_patterns-, control_measures-
    und event_phases-Module (guides/).
  - System-Prompt enthält die erwarteten ### [guides/...] Marker.
  - Input gb_event_kampfsport_k1_two_staff.json lädt ohne kritische
    Vorab-offene Punkte (falls QA-Felder vollständig).

LM-End-to-End: siehe `python -m bots...gb_bot` (benötigt LM Studio).

Ausführung von Projektroot:
  python3 tests/smoke_gb_k1_two_staff_knowledge.py
  # oder mit Projekt-venv:
  .venv/bin/python tests/smoke_gb_k1_two_staff_knowledge.py
"""

from __future__ import annotations

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from shared.blueprint_loader import load_blueprint
from shared.context_builder import build_system_prompt, build_user_prompt
from shared.input_loader import load_input

BLUEPRINT_ID = "gb_event_kampfsport"
INPUT_REL = "inputs/gb_event_kampfsport_k1_two_staff.json"

EXPECTED_GUIDE_MARKERS = (
    "### [guides/risk_patterns/aggressive_groups.md]",
    "### [guides/risk_patterns/crowd_dynamics.md]",
    "### [guides/risk_patterns/bottlenecks.md]",
    "### [guides/risk_patterns/alcohol_related_conflicts.md]",
    "### [guides/control_measures/access_control.md]",
    "### [guides/control_measures/deescalation.md]",
    "### [guides/control_measures/visitor_separation.md]",
    "### [guides/control_measures/evacuation_management.md]",
    "### [guides/control_measures/radio_communication.md]",
    "### [guides/event_phases/ingress_egress.md]",
)


def main() -> None:
    inp = PROJECT_ROOT / INPUT_REL
    print(f"[audit] Blueprint: {BLUEPRINT_ID}")
    print(f"[audit] Input:     {inp.relative_to(PROJECT_ROOT)}")
    bp = load_blueprint(BLUEPRINT_ID)
    loaded = load_input(str(inp), blueprint=bp)
    data = loaded["data"]
    pre = loaded["pre_open_points"]

    print(f"[audit] security_staff_count={data.get('security_staff_count')} "
          f"expected_attendees={data.get('expected_attendees')}")
    print(f"[audit] pre_open_points ({len(pre)}):")
    for p in pre:
        print(f"    - {p}")

    sys_prompt = build_system_prompt(bp)
    user_prompt = build_user_prompt(bp, data, pre)
    print(f"[audit] system_prompt_chars={len(sys_prompt)} "
          f"user_prompt_chars={len(user_prompt)}")

    missing = [m for m in EXPECTED_GUIDE_MARKERS if m not in sys_prompt]
    if missing:
        print("[audit] FAIL — fehlende Modul-Marker:")
        for m in missing:
            print(f"    {m}")
        sys.exit(1)

    print("[audit] OK — alle erwarteten Kuratierungsmodule im System-Prompt eingebunden.")

    # Sanity: SDL Kampfsport noch vorhanden
    if "### [sdls/veranstaltungsschutz/subtypes/kampfsport.md]" not in sys_prompt:
        print("[audit] WARN — kampfsport subtype marker fehlt")
    else:
        print("[audit] OK — SDL kampfsport.md eingebunden.")

    sys.exit(0)


if __name__ == "__main__":
    main()
