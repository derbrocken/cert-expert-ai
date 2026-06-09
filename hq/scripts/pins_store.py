#!/usr/bin/env python3
"""Auswahl für die Dashboard-Übersicht (nur explizit gewählte IDs)."""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

HQ = Path(__file__).resolve().parents[1]
PINS_JSON = HQ / "00_Dashboard" / "PINS.json"
PINS_MD = HQ / "00_Dashboard" / "PINS.md"


def _default_data() -> dict[str, Any]:
    return {"version": 2, "selected": []}


def _migrate_legacy(data: dict[str, Any]) -> dict[str, Any]:
    if data.get("version") == 2 and "selected" in data:
        return data
    selected: list[str] = list(data.get("selected") or [])
    for g in data.get("groups") or []:
        for iid in g.get("items") or []:
            sid = str(iid)
            if sid not in selected:
                selected.append(sid)
    return {"version": 2, "selected": selected}


def load_pins() -> dict[str, Any]:
    if PINS_JSON.exists():
        try:
            data = json.loads(PINS_JSON.read_text(encoding="utf-8"))
            if isinstance(data, dict):
                return _migrate_legacy(data)
        except json.JSONDecodeError:
            pass
    if PINS_MD.exists():
        text = PINS_MD.read_text(encoding="utf-8")
        m = re.search(r"```json\s*(\{.*?\})\s*```", text, re.S)
        if m:
            try:
                data = json.loads(m.group(1))
                if isinstance(data, dict):
                    data = _migrate_legacy(data)
                    save_pins(data)
                    return data
            except json.JSONDecodeError:
                pass
    return _default_data()


def save_pins(data: dict[str, Any]) -> None:
    out = {"version": 2, "selected": list(dict.fromkeys(str(x) for x in data.get("selected") or []))}
    PINS_JSON.parent.mkdir(parents=True, exist_ok=True)
    PINS_JSON.write_text(
        json.dumps(out, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    _sync_pins_md(out)


def _sync_pins_md(data: dict[str, Any]) -> None:
    body = json.dumps(data, ensure_ascii=False, indent=2)
    md = "\n".join(
        [
            "# Pins — HQ Dashboard",
            "",
            "Übersicht = `selected` (IDs), gewählt im Backlog-Modal.",
            "",
            "```json",
            body,
            "```",
            "",
        ]
    )
    PINS_MD.write_text(md, encoding="utf-8")


def get_selected(data: dict[str, Any] | None = None) -> list[str]:
    data = data or load_pins()
    return list(data.get("selected") or [])


def is_selected(item_id: str, data: dict[str, Any] | None = None) -> bool:
    return str(item_id) in get_selected(data)


def set_selected(item_ids: list[str], data: dict[str, Any] | None = None) -> dict[str, Any]:
    data = dict(data or load_pins())
    data["version"] = 2
    data["selected"] = list(dict.fromkeys(str(x) for x in item_ids))
    save_pins(data)
    return data


def toggle_selected(item_id: str, *, on: bool | None = None) -> dict[str, Any]:
    data = load_pins()
    selected = get_selected(data)
    sid = str(item_id)
    if on is None:
        on = sid not in selected
    if on and sid not in selected:
        selected.append(sid)
    elif not on and sid in selected:
        selected.remove(sid)
    return set_selected(selected, data)


def toggle_section(item_ids: list[str], *, select: bool) -> dict[str, Any]:
    data = load_pins()
    selected = set(get_selected(data))
    for iid in item_ids:
        sid = str(iid)
        if select:
            selected.add(sid)
        else:
            selected.discard(sid)
    return set_selected(list(selected), data)
