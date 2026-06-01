"""
Smoke: Blueprint `gb_event_kampfsport_micro` gegen Full/Lean.

- Full vs Lean vs MICRO system_prompt_chars
- Runtime-summary Marker (RUNTIME_SUMMARY_MICRO_K1_SMALL_EVENT Vielfaches)
- Vollständige Guides/Standards/Examples/full event rules NICHT eingebunden
- visitor_separation NICHT eingebunden
- knowledge_modules_considered exakter Erwartungslistenabgleich
- Verhältnismäßigkeit & Sekundärgefahren Pflichtwortlaut Mikro-blueprint-rules
- Kein Vollpreis-„immer adressieren“-Snippet und kein Hochrisiko-Annahmeanweis-Stilmarker

Ausführung:
  python3 tests/smoke_gb_k1_two_staff_micro.py
"""

from __future__ import annotations

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from shared.blueprint_loader import load_blueprint  # noqa: E402
from shared.context_builder import (  # noqa: E402
    build_system_prompt,
    knowledge_modules_considered,
)
from shared.input_loader import load_input  # noqa: E402

BLUEPRINT_FULL = "gb_event_kampfsport"
BLUEPRINT_LEAN = "gb_event_kampfsport_lean"
BLUEPRINT_MICRO = "gb_event_kampfsport_micro"

INPUT_MICRO = PROJECT_ROOT / "inputs" / "gb_event_kampfsport_k1_two_staff_micro.json"

MARKER_RUNTIME_SUMMARY = "RUNTIME_SUMMARY_MICRO_K1_SMALL_EVENT"

MICRO_EXPECTED_MODULES = (
    "prompts/base/system_base.md",
    "prompts/base/hallucination_guard.md",
    "prompts/base/open_point_instruction.md",
    "prompts/products/gb_user_prompt_template.md",
    "rules/base/hallucination_boundaries.md",
    "rules/base/open_points_rules.md",
    "rules/base/citation_rules.md",
    "rules/base/output_format_rules.md",
    "rules/base/reviewer_handoff.md",
    "rules/products/gb_rules.md",
    "rules/blueprints/gb_event_kampfsport_micro.md",
    "products/Gefährdungsbeurteilung/purpose.md",
    "products/Gefährdungsbeurteilung/content_blocks.md",
    "guides/content_blocks/risikobewertung.md",
    "guides/content_blocks/schutzmassnahmen.md",
    "guides/runtime_summaries/risk_patterns_k1_small_event_summary.md",
    "guides/runtime_summaries/control_measures_k1_small_event_summary.md",
    "guides/runtime_summaries/ingress_egress_k1_small_event_summary.md",
    "guides/runtime_summaries/kampfsport_sdl_small_event_summary.md",
)

FORBIDDEN_MARKERS = (
    "### [standards/",
    "### [examples/",
    "### [sdls/",
    "### [guides/risk_patterns/aggressive_groups.md]",
    "### [guides/risk_patterns/crowd_dynamics.md]",
    "### [guides/risk_patterns/bottlenecks.md]",
    "### [guides/risk_patterns/alcohol_related_conflicts.md]",
    "### [guides/control_measures/access_control.md]",
    "### [guides/control_measures/deescalation.md]",
    "### [guides/control_measures/evacuation_management.md]",
    "### [guides/control_measures/radio_communication.md]",
    "### [guides/event_phases/ingress_egress.md]",
    "### [guides/control_measures/visitor_separation.md]",
    "### [rules/blueprints/gb_event_kampfsport.md]",
)

MICRO_GUIDE_MARKERS = (
    "### [guides/runtime_summaries/risk_patterns_k1_small_event_summary.md]",
    "### [guides/runtime_summaries/control_measures_k1_small_event_summary.md]",
    "### [guides/runtime_summaries/ingress_egress_k1_small_event_summary.md]",
    "### [guides/runtime_summaries/kampfsport_sdl_small_event_summary.md]",
)

# Aus `knowledge/10_rules/blueprints/gb_event_kampfsport.md` — darf im Micro-Prompt nicht vorkommen.
FULL_ONLY_RISIKO_HEADING = "## Risikoschwerpunkte (immer adressieren)"

# Explizite „Annahme von Hochrisiko“-Imperative (keine negierenden VERBOT-Formulierungen testen)
HIGH_RISK_ASSUMPTION_PHRASES = (
    "unterstelle hochrisiko",
    "unterstellen sie hochrisiko",
    "worst case",
    "worst-case",
    "gehe von einer großlage aus",
)

MICRO_MAX_SYSTEM_PROMPT_CHARS = 60_000


def main() -> None:
    bp_full = load_blueprint(BLUEPRINT_FULL)
    bp_lean = load_blueprint(BLUEPRINT_LEAN)
    bp_micro = load_blueprint(BLUEPRINT_MICRO)

    sys_full = build_system_prompt(bp_full)
    sys_lean = build_system_prompt(bp_lean)
    sys_micro = build_system_prompt(bp_micro)

    n_full, n_lean, n_micro = len(sys_full), len(sys_lean), len(sys_micro)
    print(f"[smoke-micro] system_prompt_chars FULL  = {n_full}")
    print(f"[smoke-micro] system_prompt_chars LEAN  = {n_lean}")
    print(f"[smoke-micro] system_prompt_chars MICRO = {n_micro}")

    rec_lean_vs_full_pct = 100.0 * (1 - n_lean / max(n_full, 1))
    rec_micro_vs_full_pct = 100.0 * (1 - n_micro / max(n_full, 1))
    print(f"[smoke-micro] reduction lean vs full  ≈ {rec_lean_vs_full_pct:.1f}%")
    print(f"[smoke-micro] reduction micro vs full ≈ {rec_micro_vs_full_pct:.1f}%")

    # 1) Größenlimit Micro
    if n_micro > MICRO_MAX_SYSTEM_PROMPT_CHARS:
        print(
            f"[smoke-micro] FAIL MICRO exceeds {MICRO_MAX_SYSTEM_PROMPT_CHARS} chars ({n_micro})"
        )
        sys.exit(1)
    print(f"[smoke-micro] OK micro system_prompt_chars <= {MICRO_MAX_SYSTEM_PROMPT_CHARS}")

    # 2) Runtime summary markers
    count_rst = sys_micro.count(MARKER_RUNTIME_SUMMARY)
    if count_rst < 4:
        print(
            f"[smoke-micro] FAIL expected >=4 occurrences of "
            f"{MARKER_RUNTIME_SUMMARY!r}, got {count_rst}"
        )
        sys.exit(1)

    missing_g = [m for m in MICRO_GUIDE_MARKERS if m not in sys_micro]
    if missing_g:
        print("[smoke-micro] FAIL missing runtime summary guide markers:")
        for m in missing_g:
            print(f"    {m}")
        sys.exit(1)
    print("[smoke-micro] OK runtime summary markers present.")

    # 3+4 keine Voll-Guides / Standards / Examples / Visitor separation / SDL-original
    for bad in FORBIDDEN_MARKERS:
        if bad in sys_micro:
            print(f"[smoke-micro] FAIL forbidden marker leakage: {bad}")
            sys.exit(1)
    print("[smoke-micro] OK no full-guide/standards/examples/sdls/forbidden-rules markers.")

    kmods_list = knowledge_modules_considered(bp_micro)
    # 5 knowledge_modules_considered
    if tuple(kmods_list) != MICRO_EXPECTED_MODULES:
        print("[smoke-micro] FAIL knowledge_modules_considered mismatch")
        print(f" got ({len(kmods_list)}): {kmods_list!r}")
        print(f" exp ({len(MICRO_EXPECTED_MODULES)}): {list(MICRO_EXPECTED_MODULES)!r}")
        sys.exit(1)
    print("[smoke-micro] OK knowledge_modules_considered matches micro blueprint.")

    loaded = load_input(str(INPUT_MICRO))
    if loaded["blueprint"].blueprint_id != BLUEPRINT_MICRO:
        print("[smoke-micro] FAIL input envelope blueprint mismatch")
        sys.exit(1)
    print("[smoke-micro] OK micro input envelope loads.")

    # 6 Proportionality + Pflichtbezug Sekundärgefahren aus Micro-rules
    if "Verhältnismäßigkeit" not in sys_micro:
        print("[smoke-micro] FAIL proportionality wording not in micro system prompt")
        sys.exit(1)
    if "Sekundärgefahren" not in sys_micro:
        print("[smoke-micro] FAIL secondary-risk wording missing from micro system prompt")
        sys.exit(1)
    print("[smoke-micro] OK proportionality / secondary-risk wording present.")

    # 7 keine Hochrisiko-Annahme-Anweisung (Vollpreis-Heading + gefährliche Imperative)
    if FULL_ONLY_RISIKO_HEADING.lower() in sys_micro.lower():
        print("[smoke-micro] FAIL full-blueprint imperative risk heading leaked into micro")
        sys.exit(1)

    lc_micro = sys_micro.lower()
    for phrase in HIGH_RISK_ASSUMPTION_PHRASES:
        if phrase in lc_micro:
            print(f"[smoke-micro] FAIL high-risk assumption phrase found: {phrase!r}")
            sys.exit(1)
    print("[smoke-micro] OK no high-risk assumption instructional phrases.")

    print("\n[smoke-micro] PASS")


if __name__ == "__main__":
    main()
