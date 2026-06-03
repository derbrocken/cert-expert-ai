"""
Smoke test for gb_event_kampfsport_lean — production-sized context + DGUV extract.

Run: python3 tests/smoke_gb_event_kampfsport_lean.py
"""

from __future__ import annotations

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from shared.blueprint_loader import load_blueprint
from shared.context_builder import build_system_prompt, knowledge_modules_considered
from shared.input_loader import load_input

BLUEPRINT_ID = "gb_event_kampfsport_lean"
INPUT_FILE = PROJECT_ROOT / "inputs" / "gb_event_kampfsport.json"
PROMPT_BUDGET = 80_000


def _assert(cond: bool, msg: str) -> None:
    if not cond:
        print(f"  FAIL: {msg}")
        sys.exit(1)
    print(f"  ok  : {msg}")


def main() -> None:
    print(f"[smoke-lean] Blueprint: {BLUEPRINT_ID}")
    bp = load_blueprint(BLUEPRINT_ID)
    _assert(bp.blueprint_id == BLUEPRINT_ID, "blueprint id match")

    mods = knowledge_modules_considered(bp)
    _assert(
        any("practice_sources/dguv/crowd_veranstaltung.md" in m for m in mods),
        "DGUV crowd extract in allowlist",
    )

    sys_prompt = build_system_prompt(bp)
    _assert("Sicherheitskonzept" in sys_prompt or "Ordnungsdienst" in sys_prompt,
            "system prompt includes DGUV crowd themes")
    _assert(len(sys_prompt) <= PROMPT_BUDGET,
            f"system prompt within budget ({len(sys_prompt):,} <= {PROMPT_BUDGET:,})")

    loaded = load_input(str(INPUT_FILE))
    _assert(loaded["blueprint"].blueprint_id == "gb_event_kampfsport",
            "input still targets full blueprint id in file (ok for lean smoke)")

    print(f"[smoke-lean] PASS — prompt size {len(sys_prompt):,} chars")


if __name__ == "__main__":
    main()
