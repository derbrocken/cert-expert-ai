"""
Smoke: Lean Blueprint `gb_event_kampfsport_lean` vs. voller Blueprint.

- Vergleicht System-Prompt-Längen (Zeichen).
- Prüft erwartete ### [guides/...] Marker im Lean-Prompt.
- Stellt sicher, dass visitor_separation NICHT geladen ist.
- Ruft knowledge_modules_considered() für Audit-Liste auf.

Kein LLM nötig.

  python3 tests/smoke_gb_k1_two_staff_lean.py
"""

from __future__ import annotations

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from shared.blueprint_loader import load_blueprint
from shared.context_builder import (
    build_system_prompt,
    knowledge_modules_considered,
)
from shared.input_loader import load_input

LEAN_BLUEPRINT = "gb_event_kampfsport_lean"
FULL_BLUEPRINT = "gb_event_kampfsport"
INPUT_LEAN = PROJECT_ROOT / "inputs" / "gb_event_kampfsport_k1_two_staff_lean.json"

EXPECTED_LEAN_MARKERS = (
    "### [sdls/veranstaltungsschutz/base.md]",
    "### [sdls/veranstaltungsschutz/subtypes/kampfsport.md]",
    "### [guides/risk_patterns/aggressive_groups.md]",
    "### [guides/risk_patterns/crowd_dynamics.md]",
    "### [guides/risk_patterns/bottlenecks.md]",
    "### [guides/risk_patterns/alcohol_related_conflicts.md]",
    "### [guides/control_measures/access_control.md]",
    "### [guides/control_measures/deescalation.md]",
    "### [guides/control_measures/evacuation_management.md]",
    "### [guides/control_measures/radio_communication.md]",
    "### [guides/event_phases/ingress_egress.md]",
    "### [rules/blueprints/gb_event_kampfsport_lean.md]",
)

FORBIDDEN_LEAN = "### [guides/control_measures/visitor_separation.md]"


def main() -> None:
    bp_full = load_blueprint(FULL_BLUEPRINT)
    bp_lean = load_blueprint(LEAN_BLUEPRINT)

    sys_full = build_system_prompt(bp_full)
    sys_lean = build_system_prompt(bp_lean)

    print(f"[smoke-lean] system_prompt_chars FULL = {len(sys_full)}")
    print(f"[smoke-lean] system_prompt_chars LEAN = {len(sys_lean)}")
    reduction = 100.0 * (1 - len(sys_lean) / max(len(sys_full), 1))
    print(f"[smoke-lean] reduction vs full ≈ {reduction:.1f}%")

    # Heuristic guidance for local LM Studio (typical small contexts 8k–16k tokens):
    approx_tokens_lean = len(sys_lean) // 4
    print(
        f"[smoke-lean] rough token estimate (chars/4): ~{approx_tokens_lean} "
        "(only heuristic; model limit varies)"
    )

    missing = [m for m in EXPECTED_LEAN_MARKERS if m not in sys_lean]
    if missing:
        print("[smoke-lean] FAIL missing markers:")
        for m in missing:
            print(f"    {m}")
        sys.exit(1)
    print("[smoke-lean] OK all expected module markers present (lean).")

    if FORBIDDEN_LEAN in sys_lean:
        print("[smoke-lean] FAIL visitor_separation should not be in lean blueprint")
        sys.exit(1)
    print("[smoke-lean] OK visitor_separation excluded.")

    kmods = knowledge_modules_considered(bp_lean)
    print(f"[smoke-lean] knowledge_modules_considered count = {len(kmods)}")
    if "guides/control_measures/visitor_separation.md" in kmods:
        print("[smoke-lean] FAIL visitor_separation in knowledge_modules_considered")
        sys.exit(1)

    loaded = load_input(str(INPUT_LEAN))
    if loaded["blueprint"].blueprint_id != LEAN_BLUEPRINT:
        print("[smoke-lean] FAIL input envelope blueprint mismatch")
        sys.exit(1)
    print("[smoke-lean] OK lean input envelope loads.")

    print("\n[smoke-lean] PASS")


if __name__ == "__main__":
    main()
