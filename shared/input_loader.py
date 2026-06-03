"""
shared/input_loader.py — Blueprint-aware Input-Validierung.

Akzeptiert zwei Eingangsformate (siehe docs/INPUT_ARCHITECTURE.md):

1. Envelope-Format (Phase ≥1):
   {
     "blueprint_id": "gb_event_kampfsport",
     "input_data":   { ... blueprint-spezifische Felder ... }
   }

2. Legacy-Flat-Format (Phase 1, alte gb_bot-Pipeline):
   { "event_name": ..., "event_type": ..., ... }
   In dem Fall muss der Aufrufer den Blueprint explizit übergeben.

Pflichtfelder und Field-Labels stammen ausschließlich aus dem Blueprint —
nicht mehr aus einer harten Liste im Loader. Damit wird der Loader für
beliebige Blueprints wiederverwendbar.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from shared.blueprint_loader import Blueprint, BlueprintError, load_blueprint

_DEFAULT_BLUEPRINT_FOR_LEGACY = "gb_event_kampfsport"


class InputLoaderError(RuntimeError):
    """Raised when input file is missing, malformed, or inconsistent with blueprint."""


def _is_empty(value: Any) -> bool:
    """Empty-detection consistent across types. Lists with elements are NOT empty."""
    if value is None:
        return True
    if isinstance(value, str) and value.strip() == "":
        return True
    if isinstance(value, list) and len(value) == 0:
        return True
    return False


def _evaluate_trigger(trigger: dict[str, Any], data: dict[str, Any]) -> bool:
    """
    Evaluate a critical_trigger from the blueprint against input data.

    Triggers are interpreted from a structured rule expressed in the
    `condition` string (documentation-only) AND a `id` we map to a small
    set of supported predicates below. The string `condition` field is for
    humans/Qwen — the engine uses `id` to decide which predicate to run.
    """
    trigger_id = trigger.get("id", "")

    # Generic: "missing:<field>" → fire when the field is empty/missing.
    if isinstance(trigger_id, str) and trigger_id.startswith("missing:"):
        field = trigger_id.split("missing:", 1)[1].strip()
        if not field:
            return False
        return _is_empty(data.get(field))

    # Generic: "requires:<flag_field>:<required_field>" → if flag is truthy,
    # required_field must be non-empty.
    if isinstance(trigger_id, str) and trigger_id.startswith("requires:"):
        rest = trigger_id.split("requires:", 1)[1]
        parts = [p.strip() for p in rest.split(":", 1)]
        if len(parts) != 2:
            return False
        flag_field, required_field = parts
        flag_val = data.get(flag_field)
        if bool(flag_val):
            return _is_empty(data.get(required_field))
        return False

    if trigger_id == "venue_exits_missing_or_zero":
        ve = data.get("venue_exits")
        return ve is None or (isinstance(ve, (int, float)) and ve == 0)

    if trigger_id == "overbooking":
        att = data.get("expected_attendees")
        cap = data.get("venue_capacity")
        if isinstance(att, (int, float)) and isinstance(cap, (int, float)):
            return att > cap
        return False

    if trigger_id == "no_security_staff":
        ss = data.get("security_staff_count")
        if isinstance(ss, (int, float)):
            return ss < 1
        return ss is None

    if trigger_id == "approval_missing":
        return _is_empty(data.get("approved_by"))

    if trigger_id == "combat_sports_type_missing":
        return _is_empty(data.get("combat_sports_type"))

    if trigger_id == "medical_service_missing":
        return _is_empty(data.get("medical_service"))

    # Unknown trigger → do not fire. The Qwen prompt still receives the
    # human-readable condition, so the bot itself remains free to act on it.
    return False


def load_input(
    path: str,
    blueprint: Blueprint | None = None,
) -> dict[str, Any]:
    """
    Load and validate an input JSON file against a blueprint.

    Args:
        path:      File path to the input JSON.
        blueprint: Pre-loaded Blueprint. If None and the file is in envelope
                   format, the blueprint_id from the file is used. If None
                   and the file is in legacy flat format, a default blueprint
                   (gb_event_kampfsport) is loaded — same behavior as the
                   pre-blueprint pipeline.

    Returns:
        {
          "blueprint":      <Blueprint>,
          "data":           <flat dict of input fields>,
          "pre_open_points":<list[str]>,
        }
    """
    input_path = Path(path)
    if not input_path.exists():
        raise InputLoaderError(f"Input-Datei nicht gefunden: {path}")

    try:
        raw = json.loads(input_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise InputLoaderError(f"Input-Datei ist kein valides JSON ({path}): {e}") from e

    blueprint, data = _normalize_envelope(raw, blueprint)

    pre_open_points: list[str] = []

    pre_open_points.extend(_check_required_fields(blueprint, data))
    pre_open_points.extend(_check_critical_triggers(blueprint, data))

    seen: set[str] = set()
    deduped: list[str] = []
    for p in pre_open_points:
        if p not in seen:
            seen.add(p)
            deduped.append(p)

    return {
        "blueprint":       blueprint,
        "data":            data,
        "pre_open_points": deduped,
    }


def _normalize_envelope(
    raw: dict,
    blueprint: Blueprint | None,
) -> tuple[Blueprint, dict[str, Any]]:
    """
    Accept both envelope and legacy formats. Comments (keys starting with
    underscore) are dropped.
    """
    raw = {k: v for k, v in raw.items() if not k.startswith("_")}

    if "blueprint_id" in raw or "input_data" in raw:
        if "blueprint_id" not in raw or "input_data" not in raw:
            raise InputLoaderError(
                "Envelope-Format ist unvollständig: erwartet werden "
                "'blueprint_id' und 'input_data'."
            )
        if blueprint is None:
            try:
                blueprint = load_blueprint(raw["blueprint_id"])
            except BlueprintError as e:
                raise InputLoaderError(str(e)) from e
        elif blueprint.blueprint_id != raw["blueprint_id"]:
            raise InputLoaderError(
                f"Mismatch: Datei nennt blueprint_id='{raw['blueprint_id']}', "
                f"übergeben wurde '{blueprint.blueprint_id}'."
            )

        data = dict(raw["input_data"])
        return blueprint, data

    if blueprint is None:
        blueprint = load_blueprint(_DEFAULT_BLUEPRINT_FOR_LEGACY)
    return blueprint, raw


def _check_required_fields(blueprint: Blueprint, data: dict) -> list[str]:
    labels = blueprint.field_labels
    out: list[str] = []
    for field in blueprint.required_fields:
        if field not in data or _is_empty(data.get(field)):
            label = labels.get(field, field)
            out.append(f"[OFFENER PUNKT] {label} nicht angegeben")
    return out


def _check_critical_triggers(blueprint: Blueprint, data: dict) -> list[str]:
    out: list[str] = []
    for trigger in blueprint.critical_triggers:
        if _evaluate_trigger(trigger, data):
            msg = trigger.get("open_point") or trigger.get("condition", "")
            if msg:
                out.append(f"[OFFENER PUNKT] {msg}")
    return out
