"""
shared/context_builder.py — Assembliert System- und User-Prompt aus Blueprint.

Phase 1 — manuell, dateibasiert:
- Lädt referenzierte Knowledge-Module aus dem Blueprint
- Konkateniert sie in fester, dokumentierter Reihenfolge zu einem
  System-Prompt
- Rendert das User-Prompt-Template aus prompts/products/ mit den Inputfeldern
- Kein Retrieval, kein Vektor-Index, kein Caching

Reihenfolge des System-Prompts (höchste Priorität zuerst):
  1. prompts/base/system_base.md
  2. rules/base/*           (Hallucination, Open-Points, Citations, Output, Reviewer-Handoff)
  3. rules/products/*       (z. B. gb_rules.md)
  4. rules/blueprints/*     (Blueprint-Sonderregeln)
  5. products/*             (Produktwissen)
  6. standards/*            (Normüberblicke)
  7. sdls/*                 (Domänenwissen base + subtype)
  8. guides/*               (Schreibanleitungen)
  9. examples/*             (Stilbeispiele)
 10. prompts/base/hallucination_guard.md
 11. prompts/base/open_point_instruction.md
 12. abschließender JSON-Schema-Block, gerendert aus den ai_blocks des
     Blueprints (überschreibt jeden generischen Output-Schema-Hinweis)
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from shared.blueprint_loader import Blueprint

# Reihenfolge der Kategorien im System-Prompt. Innerhalb einer Kategorie
# bleibt die Reihenfolge erhalten, wie sie im Blueprint-Config steht.
_SYSTEM_PROMPT_ORDER = (
    ("prompts", ("base/system_base.md",)),
    ("rules", None),
    ("products", None),
    ("standards", None),
    ("sdls", None),
    ("guides", None),
    ("examples", None),
    ("prompts", ("base/hallucination_guard.md", "base/open_point_instruction.md")),
)

# Stable ordering for audit metadata (matches assembly order groups).
_KNOWLEDGE_MODULE_META_ORDER = (
    "prompts",
    "rules",
    "products",
    "standards",
    "sdls",
    "guides",
    "examples",
)


def knowledge_modules_considered(blueprint: Blueprint) -> list[str]:
    """
    Return every loaded knowledge file as ``category/relative_path_under_category``
    (e.g. ``guides/risk_patterns/aggressive_groups.md``), in deterministic order.
    Used for review JSON (`knowledge_modules_considered`) without relying on
    the LLM to self-report sources.
    """
    lines: list[str] = []
    for cat in _KNOWLEDGE_MODULE_META_ORDER:
        for path in blueprint.context_module_paths.get(cat, ()):
            rel = _category_relative_name(cat, path)
            lines.append(f"{cat}/{rel}")
    return lines


def build_system_prompt(blueprint: Blueprint) -> str:
    """
    Assemble the full system prompt by concatenating referenced knowledge
    files in the order defined by `_SYSTEM_PROMPT_ORDER`, then appending a
    blueprint-specific JSON output schema block.
    """
    parts: list[str] = []

    consumed_prompts: set[Path] = set()

    for category, only_filenames in _SYSTEM_PROMPT_ORDER:
        paths = blueprint.context_module_paths.get(category, ())
        if only_filenames is not None:
            wanted_suffixes = set(only_filenames)
            paths = tuple(
                p for p in paths
                if _category_relative_name(category, p) in wanted_suffixes
            )
            consumed_prompts.update(paths)
        elif category == "prompts":
            # Skip the catch-all prompts pass; we slice prompts explicitly above.
            continue

        for path in paths:
            parts.append(_render_module(category, path))

    parts.append(_render_output_schema_block(blueprint))

    return "\n\n".join(parts).strip() + "\n"


def build_user_prompt(
    blueprint: Blueprint,
    input_data: dict[str, Any],
    pre_open_points: list[str],
) -> str:
    """
    Render the GB user prompt template with input field values.
    Returns the substituted text. Missing fields are rendered as
    `[OFFENER PUNKT]`, never as the literal `None`.
    """
    template_path = _find_user_prompt_template(blueprint)
    template = template_path.read_text(encoding="utf-8")

    labels = blueprint.field_labels
    variables = _input_variables(blueprint, input_data, labels)
    variables["blueprint_id"] = blueprint.blueprint_id
    variables["display_name"] = blueprint.display_name
    variables["ai_blocks_csv"] = ", ".join(blueprint.ai_blocks)
    variables["special_risks_block"] = _format_special_risks(
        input_data.get("special_risks")
    )
    variables["pre_open_points_block"] = _format_pre_open_points(pre_open_points)
    variables["placeholder_keys_block"] = _format_placeholder_keys(
        blueprint.ai_blocks
    )

    return _substitute_double_braces(template, variables)


# ── Internal helpers ─────────────────────────────────────────────────────────


def _category_relative_name(category: str, path: Path) -> str:
    """Return the relative POSIX-style name under the logical category root."""
    parts = list(path.parts)
    if category == "prompts" and "prompts" in parts:
        idx = parts.index("prompts")
        return "/".join(parts[idx + 1:])
    if "knowledge" in parts:
        idx = parts.index("knowledge")
        sub = parts[idx + 1:]
        if sub:
            sub = sub[1:]  # skip numbered layer (2_regulations, 5_products, …)
        return "/".join(sub)
    return path.name


def _render_module(category: str, path: Path) -> str:
    body = path.read_text(encoding="utf-8").strip()
    rel = _category_relative_name(category, path)
    return f"### [{category}/{rel}]\n{body}"


def _render_output_schema_block(blueprint: Blueprint) -> str:
    schema = {
        "document_type": blueprint.document_type,
        "placeholders": {key: "..." for key in blueprint.ai_blocks},
        "open_points": ["[OFFENER PUNKT] ..."],
        "qa_status": "ok | review_required",
    }
    pretty = json.dumps(schema, ensure_ascii=False, indent=2)
    return (
        "### [output_schema]\n"
        f"Aktiver Blueprint: {blueprint.blueprint_id}\n"
        f"Pflicht-AI-Blöcke (alle als Strings, alle Pflicht): "
        f"{list(blueprint.ai_blocks)}\n"
        "Du gibst ausschließlich ein JSON-Objekt in genau dieser Form zurück. "
        "Keine Markdown-Codefences, kein Vor-/Nachtext:\n"
        f"```\n{pretty}\n```"
    )


def _find_user_prompt_template(blueprint: Blueprint) -> Path:
    prompts = blueprint.context_module_paths.get("prompts", ())
    for path in prompts:
        if "products/" in path.as_posix() and path.name.endswith("_user_prompt_template.md"):
            return path
    raise RuntimeError(
        f"Blueprint {blueprint.blueprint_id} referenziert kein "
        f"User-Prompt-Template (erwartet unter prompts/products/*.md)."
    )


def _input_variables(
    blueprint: Blueprint,
    input_data: dict[str, Any],
    labels: dict[str, str],
) -> dict[str, str]:
    """Build a flat dict of stringified input values for placeholder substitution."""
    variables: dict[str, str] = {}
    keys = set(blueprint.required_fields) | set(blueprint.optional_fields)
    keys |= set(labels.keys())

    for key in keys:
        value = input_data.get(key)
        variables[key] = _format_value(value)
    return variables


def _format_value(value: Any) -> str:
    if value is None:
        return "[OFFENER PUNKT]"
    if isinstance(value, bool):
        return "ja" if value else "nein"
    if isinstance(value, str):
        return value.strip() if value.strip() else "[OFFENER PUNKT]"
    if isinstance(value, list):
        if not value:
            return "[OFFENER PUNKT]"
        return ", ".join(str(v) for v in value)
    return str(value)


def _format_special_risks(risks: Any) -> str:
    if not risks:
        return "  - [OFFENER PUNKT] Keine besonderen Risiken angegeben"
    if isinstance(risks, list):
        return "\n".join(f"  - {r}" for r in risks)
    return f"  - {risks}"


def _format_pre_open_points(points: list[str]) -> str:
    if not points:
        return "  - (keine)"
    return "\n".join(f"  - {p}" for p in points)


def _format_placeholder_keys(ai_blocks: tuple[str, ...]) -> str:
    return "\n".join(f'    "{key}": "..."' + ("," if i < len(ai_blocks) - 1 else "")
                     for i, key in enumerate(ai_blocks))


def _substitute_double_braces(template: str, variables: dict[str, str]) -> str:
    """
    Minimal {{var}} substitution. Unknown variables remain as `{{var}}`
    so they are visible to a human reviewer of the rendered prompt.
    """
    out = template
    for key, value in variables.items():
        out = out.replace("{{" + key + "}}", value)
    return out


# ── CLI für schnelle Inspektion ──────────────────────────────────────────────

if __name__ == "__main__":
    import sys

    from shared.blueprint_loader import load_blueprint

    if len(sys.argv) < 2:
        print("Usage: python -m shared.context_builder <blueprint_id> [input.json]")
        sys.exit(1)

    bp = load_blueprint(sys.argv[1])
    sys_prompt = build_system_prompt(bp)
    print(f"=== System-Prompt ({len(sys_prompt)} chars) ===")
    print(sys_prompt)

    if len(sys.argv) >= 3:
        envelope = json.loads(Path(sys.argv[2]).read_text(encoding="utf-8"))
        user_prompt = build_user_prompt(bp, envelope.get("input_data", envelope), [])
        print()
        print(f"=== User-Prompt ({len(user_prompt)} chars) ===")
        print(user_prompt)
