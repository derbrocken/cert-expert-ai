"""
Validate blueprint Pflichten: Lektüre, Form, Angaben.

Usage:
    python3 -m shared.pflichten_validator sk_event_kampfsport
"""

from __future__ import annotations

import sys

from shared.blueprint_loader import BlueprintError, load_blueprint
from shared.knowledge_paths import KNOWLEDGE_CATEGORY_DIRS, PROJECT_ROOT

_PROJECT_ROOT = PROJECT_ROOT


def _flatten_modules(context_modules: dict) -> set[str]:
    out: set[str] = set()
    for category, entries in context_modules.items():
        if not isinstance(entries, list):
            continue
        for rel in entries:
            out.add(f"{category}/{rel}")
    return out


def _loaded_module_keys(blueprint) -> set[str]:
    actual: set[str] = set()
    for cat, paths in blueprint.context_module_paths.items():
        cat_dir = KNOWLEDGE_CATEGORY_DIRS[cat]
        for p in paths:
            actual.add(f"{cat}/{p.relative_to(cat_dir).as_posix()}")
    return actual


def validate_pflichten(blueprint_id: str) -> list[str]:
    errors: list[str] = []
    try:
        bp = load_blueprint(blueprint_id)
    except BlueprintError as e:
        return [str(e)]

    raw = bp.raw
    pflichten = raw.get("pflichten")
    if not pflichten:
        errors.append(f"Blueprint {blueprint_id}: fehlender Block 'pflichten'")
        return errors

    lektuere = pflichten.get("lektuere", {})
    if not lektuere:
        errors.append("pflichten.lektuere fehlt oder ist leer")
    else:
        required = _flatten_modules(lektuere)
        actual = _loaded_module_keys(bp)
        missing = sorted(required - actual)
        if missing:
            errors.append(
                "Pflichtlektüre nicht im context_modules geladen:\n  - "
                + "\n  - ".join(missing)
            )

    form = pflichten.get("form", {})
    tpl = form.get("template_file") or raw.get("template_file")
    if not tpl:
        errors.append("pflichten.form.template_file fehlt")
    else:
        tpl_path = (_PROJECT_ROOT / tpl).resolve()
        if not tpl_path.exists():
            errors.append(
                f"Pflichtform Template fehlt: {tpl_path.relative_to(_PROJECT_ROOT)}"
            )

    form_blocks = tuple(form.get("ai_blocks") or ())
    if form_blocks and form_blocks != bp.ai_blocks:
        errors.append(
            f"ai_blocks weichen von pflichten.form.ai_blocks ab: "
            f"blueprint={list(bp.ai_blocks)} pflichten={list(form_blocks)}"
        )

    angaben = pflichten.get("angaben", {})
    for field in angaben.get("required", []):
        if field not in bp.required_fields:
            errors.append(
                f"Pflichtangabe '{field}' in pflichten.angaben, "
                f"aber nicht in input_schema.required"
            )

    return errors


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python3 -m shared.pflichten_validator <blueprint_id>")
        sys.exit(1)

    bid = sys.argv[1]
    errors = validate_pflichten(bid)
    if errors:
        print(f"PFICHTEN FAIL — {bid}")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    print(f"PFICHTEN OK — {bid}")


if __name__ == "__main__":
    main()
