#!/usr/bin/env python3
"""
Report assembled system-prompt size per blueprint (no LLM).

Usage (from repo root):
  python3 scripts/context_size_report.py
  python3 scripts/context_size_report.py gb_event_kampfsport_lean
"""

from __future__ import annotations

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from shared.blueprint_loader import load_blueprint
from shared.context_builder import build_system_prompt

DEFAULT_BUDGET = 80_000
DEFAULT_BLUEPRINTS = (
    "gb_event_kampfsport",
    "gb_event_kampfsport_lean",
    "gb_event_kampfsport_micro",
)


def report(blueprint_id: str, budget: int = DEFAULT_BUDGET) -> int:
    bp = load_blueprint(blueprint_id)
    sys_prompt = build_system_prompt(bp)
    n_files = sum(len(v) for v in bp.context_module_paths.values())
    raw = sum(
        len(p.read_text(encoding="utf-8"))
        for paths in bp.context_module_paths.values()
        for p in paths
    )
    size = len(sys_prompt)
    status = "OK" if size <= budget else "OVER"
    print(
        f"{blueprint_id:30}  files={n_files:2}  raw={raw:7,}  prompt={size:7,}  [{status} vs {budget:,}]"
    )
    return 0 if size <= budget else 1


def main() -> None:
    ids = sys.argv[1:] if len(sys.argv) > 1 else list(DEFAULT_BLUEPRINTS)
    budget = DEFAULT_BUDGET
    exit_code = 0
    print(f"Context size report (budget {budget:,} chars)\n")
    for bid in ids:
        try:
            exit_code |= report(bid, budget)
        except Exception as e:
            print(f"{bid:30}  ERROR: {e}")
            exit_code = 1
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
