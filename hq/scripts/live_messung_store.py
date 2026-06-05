"""Parallele DFSS Live-Messung (O2C/Forms) — pro Kundenordner live_messung.json."""

from __future__ import annotations

import json
from datetime import date, datetime
from pathlib import Path
from typing import Any

HQ = Path(__file__).resolve().parents[1]
KP = HQ / "03_Kundenprojekte"

LIVE_MESSUNG_SLUGS = frozenset({"Schutzritter", "Checkpoint_Regional"})

FIELD_KEYS = (
    "willkommens_mail",
    "unternehmensunterlagen_link",
    "formular_begonnen",
    "blockiert_seit",
    "fehlender_nachweis",
    "rueckfragen_anzahl",
)


def _path(slug: str) -> Path:
    return KP / slug / "live_messung.json"


def _empty_date_field() -> dict[str, str]:
    return {"date": "", "note": ""}


def default_record(slug: str, *, legal_name: str, project_id: str) -> dict[str, Any]:
    return {
        "schema": "live-messung-o2c-v1",
        "project_id": project_id,
        "slug": slug,
        "legal_name": legal_name,
        "active": True,
        "parallel_only": True,
        "blocks_design": False,
        "milestone_1_label": "Meilenstein 1 — erstes vollständiges Formular-/Unterlagenpaket",
        "started_at": "",
        "milestone_1_at": "",
        "fields": {
            "willkommens_mail": _empty_date_field(),
            "unternehmensunterlagen_link": _empty_date_field(),
            "formular_begonnen": _empty_date_field(),
            "blockiert_seit": {"date": "", "grund": ""},
            "fehlender_nachweis": {"text": "", "updated": ""},
            "rueckfragen_anzahl": 0,
            "rueckfragen_notiz": "",
        },
        "updated_at": "",
    }


def _parse_iso(raw: str) -> date | None:
    raw = (raw or "").strip()
    if not raw:
        return None
    try:
        return date.fromisoformat(raw[:10])
    except ValueError:
        return None


def _days_between(start: str, end: str | None = None) -> int | None:
    d0 = _parse_iso(start)
    if not d0:
        return None
    d1 = _parse_iso(end) if end else date.today()
    if not d1:
        d1 = date.today()
    return (d1 - d0).days


def load(slug: str) -> dict[str, Any] | None:
    if slug not in LIVE_MESSUNG_SLUGS:
        return None
    p = _path(slug)
    if not p.is_file():
        return None
    return json.loads(p.read_text(encoding="utf-8"))


def save(slug: str, data: dict[str, Any]) -> Path:
    if slug not in LIVE_MESSUNG_SLUGS:
        raise ValueError(f"Live-Messung nicht aktiv für {slug}")
    p = _path(slug)
    data["updated_at"] = datetime.now().isoformat(timespec="seconds")
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return p


def ensure_defaults() -> None:
    defaults = {
        "Schutzritter": (
            "Schutzritter Security Services GmbH",
            "P-LIVE-SR-01",
        ),
        "Checkpoint_Regional": (
            "Checkpoint Regional GmbH",
            "P-LIVE-CR-01",
        ),
    }
    for slug, (legal, pid) in defaults.items():
        if not _path(slug).is_file():
            save(slug, default_record(slug, legal_name=legal, project_id=pid))


def summary_line(data: dict[str, Any]) -> str:
    f = data.get("fields") or {}
    blocked = (f.get("blockiert_seit") or {}).get("date", "").strip()
    if blocked:
        grund = (f.get("blockiert_seit") or {}).get("grund", "").strip()
        return f"blockiert{': ' + grund if grund else ''}"
    missing = (f.get("fehlender_nachweis") or {}).get("text", "").strip()
    if missing:
        short = missing[:48] + ("…" if len(missing) > 48 else "")
        return f"Nachweis: {short}"
    rq = int(f.get("rueckfragen_anzahl") or 0)
    if rq:
        return f"{rq} Rückfrage{'n' if rq != 1 else ''}"
    if not (f.get("willkommens_mail") or {}).get("date"):
        return "Willkommens-Mail offen"
    if not (f.get("unternehmensunterlagen_link") or {}).get("date"):
        return "Unterlagen-Link offen"
    if not (f.get("formular_begonnen") or {}).get("date"):
        return "Formular noch nicht begonnen"
    return "läuft"


def enrich(data: dict[str, Any]) -> dict[str, Any]:
    out = dict(data)
    started = (data.get("started_at") or "").strip()
    m1 = (data.get("milestone_1_at") or "").strip()
    out["summary"] = summary_line(data)
    out["days_to_milestone_1"] = _days_between(started, m1 or None)
    out["days_since_start"] = _days_between(started, None)
    out["link_md"] = f"../../03_Kundenprojekte/{data.get('slug')}/Live_Messung.md"
    return out


def load_all() -> dict[str, dict[str, Any]]:
    ensure_defaults()
    out: dict[str, dict[str, Any]] = {}
    for slug in sorted(LIVE_MESSUNG_SLUGS):
        raw = load(slug)
        if raw:
            out[slug] = enrich(raw)
    return out


def _fmt_date_field(label: str, block: dict) -> str:
    d = (block or {}).get("date", "").strip() or "—"
    note = (block or {}).get("note", "").strip() or "—"
    return f"| {label} | {d} | {note} |"


def write_markdown_mirror(data: dict[str, Any]) -> Path:
    slug = data.get("slug", "")
    f = data.get("fields") or {}
    blocked = f.get("blockiert_seit") or {}
    missing = f.get("fehlender_nachweis") or {}
    lines = [
        f"# Live-Messung — {data.get('legal_name', slug)}",
        "",
        f"**P-ID:** `{data.get('project_id')}` · **Slug:** `{slug}`",
        "**Modus:** Parallele Live-Messung (O2C) — blockiert Design nicht.",
        f"**Stand JSON:** {data.get('updated_at') or '—'}",
        "",
        "> Pflege bevorzugt im Dashboard (Projekt aufklappen → Live-Messung) oder direkt in `live_messung.json`.",
        "",
        "## Meilensteine",
        "",
        f"- **Start:** {data.get('started_at') or '—'}",
        f"- **Meilenstein 1:** {data.get('milestone_1_at') or '—'} — {data.get('milestone_1_label', '')}",
        f"- **Tage bis M1:** {enrich(data).get('days_to_milestone_1', '—')}",
        "",
        "## O2C-Tracker",
        "",
        "| Feld | Datum | Notiz |",
        "|------|-------|-------|",
        _fmt_date_field("Willkommens-Mail", f.get("willkommens_mail")),
        _fmt_date_field("Unternehmensunterlagen-Link", f.get("unternehmensunterlagen_link")),
        _fmt_date_field("Formular begonnen", f.get("formular_begonnen")),
        f"| Blockiert seit | {(blocked.get('date') or '—')} | {(blocked.get('grund') or '—')} |",
        f"| Fehlender Nachweis | — | {(missing.get('text') or '—')} |",
        f"| Rückfragen (Anzahl) | — | {f.get('rueckfragen_anzahl', 0)} |",
        "",
        f"**Kurzstatus:** {summary_line(data)}",
        "",
        "## Verknüpfung",
        "",
        f"- Status: [`Status.md`](Status.md)",
        f"- Index: [`../../07_DFSS/LIVE_MESSUNG_INDEX.md`](../../07_DFSS/LIVE_MESSUNG_INDEX.md)",
        "",
    ]
    p = KP / slug / "Live_Messung.md"
    p.write_text("\n".join(lines), encoding="utf-8")
    return p


def sync_all_markdown() -> None:
    ensure_defaults()
    for slug in LIVE_MESSUNG_SLUGS:
        raw = load(slug)
        if raw:
            write_markdown_mirror(raw)


def update_fields(slug: str, patch: dict[str, Any]) -> dict[str, Any]:
    ensure_defaults()
    data = load(slug)
    if not data:
        raise FileNotFoundError(slug)
    for key in ("started_at", "milestone_1_at", "milestone_1_label"):
        if key in patch:
            data[key] = str(patch[key] or "").strip()
    fields = data.setdefault("fields", {})
    fp = patch.get("fields") or {}
    for fk in FIELD_KEYS:
        if fk not in fp:
            continue
        val = fp[fk]
        if fk == "rueckfragen_anzahl":
            try:
                fields[fk] = max(0, int(val))
            except (TypeError, ValueError):
                fields[fk] = 0
        elif fk == "fehlender_nachweis":
            fields[fk] = {
                "text": str((val or {}).get("text", "")).strip(),
                "updated": date.today().isoformat(),
            }
        elif fk == "blockiert_seit":
            fields[fk] = {
                "date": str((val or {}).get("date", "")).strip()[:10],
                "grund": str((val or {}).get("grund", "")).strip(),
            }
        else:
            fields[fk] = {
                "date": str((val or {}).get("date", "")).strip()[:10],
                "note": str((val or {}).get("note", "")).strip(),
            }
    if "rueckfragen_notiz" in fp:
        fields["rueckfragen_notiz"] = str(fp.get("rueckfragen_notiz") or "").strip()
    save(slug, data)
    enriched = enrich(data)
    write_markdown_mirror(data)
    return enriched
