"""
shared/blueprint_loader.py — Lädt und validiert eine Blueprint-Konfiguration
aus `knowledge/blueprints/{blueprint_id}.json`.

Verantwortlichkeit:
- Blueprint-JSON laden
- Pflichtfelder prüfen
- Pfade zu Wissensmodulen (relativ zu knowledge/{kategorie}/) ermitteln
- Auflösung aller referenzierten Knowledge-Dateien auf absolute Pfade
- KEINE Datei-Inhalte lesen — das ist Aufgabe des context_builder

Phase 1 — minimal. Kein Caching, kein Schema-Validator, keine Vererbung.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

_PROJECT_ROOT = Path(__file__).resolve().parent.parent
_BLUEPRINTS_DIR = _PROJECT_ROOT / "knowledge" / "blueprints"

REQUIRED_BLUEPRINT_FIELDS = (
    "blueprint_id",
    "display_name",
    "version",
    "template_file",
    "context_modules",
    "input_schema",
    "ai_blocks",
)


class BlueprintError(RuntimeError):
    """Raised on missing, malformed, or inconsistent blueprint configuration."""


@dataclass(frozen=True)
class Blueprint:
    """Resolved, immutable representation of one blueprint configuration."""

    blueprint_id: str
    display_name: str
    version: str
    document_type: str
    template_path: Path
    modes: tuple[str, ...]
    ai_blocks: tuple[str, ...]
    static_blocks: tuple[str, ...]
    input_schema: dict[str, Any]
    qa_rules: dict[str, Any]
    context_module_paths: dict[str, tuple[Path, ...]]
    raw: dict[str, Any] = field(repr=False)

    @property
    def required_fields(self) -> tuple[str, ...]:
        return tuple(self.input_schema.get("required", []))

    @property
    def optional_fields(self) -> tuple[str, ...]:
        return tuple(self.input_schema.get("optional", []))

    @property
    def field_labels(self) -> dict[str, str]:
        return dict(self.input_schema.get("field_labels", {}))

    @property
    def critical_triggers(self) -> tuple[dict[str, Any], ...]:
        return tuple(self.input_schema.get("critical_triggers", []))


# ── Public API ───────────────────────────────────────────────────────────────


def load_blueprint(blueprint_id: str) -> Blueprint:
    """
    Load a blueprint config by ID and resolve all referenced knowledge paths.

    Args:
        blueprint_id: e.g. "gb_event_kampfsport".

    Returns:
        Blueprint dataclass with absolute, validated paths.

    Raises:
        BlueprintError: if the file is missing, malformed, or references
                        knowledge files that do not exist.
    """
    if not blueprint_id or not isinstance(blueprint_id, str):
        raise BlueprintError("blueprint_id must be a non-empty string")

    config_path = _BLUEPRINTS_DIR / f"{blueprint_id}.json"
    if not config_path.exists():
        raise BlueprintError(
            f"Blueprint-Config nicht gefunden: {config_path}\n"
            f"Verfügbare Blueprints siehe knowledge/blueprints/."
        )

    try:
        raw = json.loads(config_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise BlueprintError(
            f"Blueprint-Config ist kein valides JSON ({config_path}): {e}"
        ) from e

    _validate_required_fields(raw, config_path)

    if raw["blueprint_id"] != blueprint_id:
        raise BlueprintError(
            f"blueprint_id-Mismatch: Datei heißt '{blueprint_id}.json', "
            f"enthält aber blueprint_id='{raw['blueprint_id']}'."
        )

    template_path = (_PROJECT_ROOT / raw["template_file"]).resolve()
    document_type = raw.get("document_type", raw["blueprint_id"])

    context_module_paths = _resolve_context_modules(
        raw.get("context_modules", {}), blueprint_id
    )

    return Blueprint(
        blueprint_id=raw["blueprint_id"],
        display_name=raw["display_name"],
        version=raw["version"],
        document_type=document_type,
        template_path=template_path,
        modes=tuple(raw.get("modes", ["standalone"])),
        ai_blocks=tuple(raw["ai_blocks"]),
        static_blocks=tuple(raw.get("static_blocks", [])),
        input_schema=dict(raw["input_schema"]),
        qa_rules=dict(raw.get("qa_rules", {})),
        context_module_paths=context_module_paths,
        raw=raw,
    )


# ── Internal helpers ─────────────────────────────────────────────────────────


def _validate_required_fields(raw: dict, config_path: Path) -> None:
    missing = [k for k in REQUIRED_BLUEPRINT_FIELDS if k not in raw]
    if missing:
        raise BlueprintError(
            f"Blueprint-Config {config_path} ist unvollständig. "
            f"Fehlende Pflichtfelder: {missing}"
        )

    if not isinstance(raw["ai_blocks"], list) or not raw["ai_blocks"]:
        raise BlueprintError(
            f"Blueprint {raw.get('blueprint_id')} hat keine ai_blocks definiert."
        )

    schema = raw.get("input_schema", {})
    if not isinstance(schema, dict):
        raise BlueprintError("input_schema muss ein Objekt sein.")
    if "required" not in schema or not isinstance(schema["required"], list):
        raise BlueprintError("input_schema.required (Liste) ist Pflicht.")


_KNOWLEDGE_CATEGORY_DIRS = {
    "standards": "standards",
    "sdls":      "sdls",
    "products":  "products",
    "rules":     "rules",
    "guides":    "guides",
    "examples":  "examples",
    "prompts":   "prompts",
}


def _resolve_context_modules(
    context_modules: dict[str, list[str]],
    blueprint_id: str,
) -> dict[str, tuple[Path, ...]]:
    """
    Resolve each category's relative module paths to absolute Paths
    rooted under knowledge/{category}/. Missing files raise BlueprintError —
    we never silently skip referenced knowledge.
    """
    knowledge_root = _PROJECT_ROOT / "knowledge"
    resolved: dict[str, tuple[Path, ...]] = {}

    for category, entries in context_modules.items():
        if category not in _KNOWLEDGE_CATEGORY_DIRS:
            raise BlueprintError(
                f"Blueprint {blueprint_id} referenziert unbekannte "
                f"Wissenskategorie '{category}'. Erlaubt: "
                f"{sorted(_KNOWLEDGE_CATEGORY_DIRS)}"
            )

        if not isinstance(entries, list):
            raise BlueprintError(
                f"context_modules.{category} muss eine Liste sein "
                f"(Blueprint {blueprint_id})."
            )

        category_dir = knowledge_root / _KNOWLEDGE_CATEGORY_DIRS[category]
        paths: list[Path] = []
        missing: list[str] = []
        for rel in entries:
            abs_path = (category_dir / rel).resolve()
            if not abs_path.exists():
                missing.append(str(abs_path.relative_to(_PROJECT_ROOT)))
                continue
            paths.append(abs_path)

        if missing:
            raise BlueprintError(
                f"Blueprint {blueprint_id} referenziert fehlende Knowledge-"
                f"Module in Kategorie '{category}':\n  - "
                + "\n  - ".join(missing)
            )

        resolved[category] = tuple(paths)

    return resolved


# ── CLI für schnelle Inspektion ──────────────────────────────────────────────

if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python -m shared.blueprint_loader <blueprint_id>")
        sys.exit(1)

    bp = load_blueprint(sys.argv[1])
    print(f"Blueprint: {bp.blueprint_id} ({bp.display_name}) v{bp.version}")
    print(f"Template:  {bp.template_path}")
    print(f"ai_blocks: {list(bp.ai_blocks)}")
    print(f"Pflichtfelder: {list(bp.required_fields)}")
    print("Kontextmodule:")
    for cat, paths in bp.context_module_paths.items():
        print(f"  {cat}: {len(paths)} Datei(en)")
        for p in paths:
            print(f"    - {p.relative_to(_PROJECT_ROOT)}")
