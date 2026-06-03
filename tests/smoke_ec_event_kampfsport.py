"""
Smoke test for ec_event_kampfsport — no LLM.

Run: python3 tests/smoke_ec_event_kampfsport.py
"""

from __future__ import annotations

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from shared.blueprint_loader import load_blueprint
from shared.context_builder import build_system_prompt, build_user_prompt, knowledge_modules_considered
from shared.input_loader import load_input
from shared.pflichten_validator import validate_pflichten

BLUEPRINT_ID = "ec_event_kampfsport"
INPUT_FILE = PROJECT_ROOT / "inputs" / "ec_event_kampfsport.json"
PROMPT_BUDGET = 80_000


def _assert(cond: bool, msg: str) -> None:
    if not cond:
        print(f"  FAIL: {msg}")
        sys.exit(1)
    print(f"  ok  : {msg}")


def main() -> None:
    print(f"[smoke-ec] Blueprint: {BLUEPRINT_ID}")

    pf_errors = validate_pflichten(BLUEPRINT_ID)
    _assert(not pf_errors, f"pflichten ({'; '.join(pf_errors) if pf_errors else 'ok'})")

    bp = load_blueprint(BLUEPRINT_ID)
    _assert(bp.blueprint_id == BLUEPRINT_ID, "blueprint id")

    mods = knowledge_modules_considered(bp)
    _assert(any("practice_sources/dguv/crowd_veranstaltung" in m for m in mods), "DGUV crowd")
    _assert(any("einsatzkonzept/" in m for m in mods), "EC product")
    _assert(any("products/ec_rules" in m for m in mods), "EC rules")

    paths = [str(p) for cat in bp.context_module_paths.values() for p in cat]
    _assert(
        not any("/1_standards/" in p.replace("\\", "/") for p in paths),
        "no knowledge/1_standards loaded",
    )

    loaded = load_input(str(INPUT_FILE))
    _assert(loaded["blueprint"].blueprint_id == BLUEPRINT_ID, "input envelope")

    sp = build_system_prompt(bp)
    up = build_user_prompt(bp, loaded["data"], loaded["pre_open_points"])
    _assert("EC_EINSATZBESCHREIBUNG" in sp, "output schema lists EC blocks")
    _assert("Einsatzkonzept" in sp or "operativ" in sp.lower(), "EC themes")
    _assert(len(sp) <= PROMPT_BUDGET, f"prompt budget ({len(sp):,} <= {PROMPT_BUDGET:,})")
    _assert("EC_OFFENE_PUNKTE" in up, "user prompt references EC blocks")

    print(f"[smoke-ec] PASS — {len(mods)} modules, prompt {len(sp):,} chars")


if __name__ == "__main__":
    main()

