#!/usr/bin/env python3
"""Cert-Expert Fixkosten — JSON (Dashboard) + Sync nach Finanz_Arbeitsgrundlage.md §3."""

from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path
from typing import Any

HQ = Path(__file__).resolve().parents[1]
FINANCE_MD = HQ / "05_Forderungen" / "Finanz_Arbeitsgrundlage.md"
KOSTEN_JSON = HQ / "05_Forderungen" / "Cert_Expert_Kosten.json"

SECTION_MARK = "## 3 — Geschäft: Tools & laufende Kosten (monatlich)"
TABLE_SEP = re.compile(r"^\|\s*[-:]+\s*\|")

KATEGORIEN = (
    "Tools",
    "Büro",
    "Telekommunikation",
    "Personal",
    "Hardware",
    "Buchhaltung",
    "Sonstiges",
)


def _parse_amount_cell(raw: str) -> tuple[float | None, str]:
    display = (raw or "").strip()
    if not display or display == "—":
        return None, display
    work = display
    for prefix in ("ab ", "AB ", "~"):
        if work.lower().startswith(prefix.lower()):
            work = work[len(prefix) :].strip()
    work = work.rstrip("+").strip().replace("€", "").strip()
    if not work:
        return None, display
    if "," in work:
        work = work.replace(".", "").replace(",", ".")
    try:
        return float(work), display
    except ValueError:
        return None, display


def _format_sum_de(total: float) -> str:
    whole = int(round(total * 100))
    euros = whole // 100
    cents = whole % 100
    euros_s = f"{euros:,}".replace(",", ".")
    return f"~{euros_s},{cents:02d}+"


def _format_amount_cell(amount: str | float) -> str:
    if isinstance(amount, (int, float)):
        s = f"{amount:.2f}".replace(".", ",")
        if "," in s:
            left, right = s.split(",", 1)
            left = f"{int(left):,}".replace(",", ".")
            return f"{left},{right}"
        return s
    return str(amount).strip().replace(".", ",")


def _split_table_row(line: str) -> list[str] | None:
    line = line.strip()
    if not line.startswith("|"):
        return None
    parts = [p.strip() for p in line.split("|")[1:-1]]
    return parts if len(parts) >= 4 else None


def _normalize_kategorie(raw: str, posten: str = "", anbieter: str = "") -> str:
    kat = (raw or "").strip()
    if kat in KATEGORIEN:
        return kat
    if kat:
        return "Sonstiges"
    return _infer_kategorie(posten, anbieter)


def _infer_kategorie(posten: str, anbieter: str) -> str:
    p = posten.lower()
    a = anbieter.lower()
    if "mitarbeiter" in p:
        return "Personal"
    if any(x in p for x in ("coworking", "büro", "buero", "office")):
        return "Büro"
    if any(
        x in p or x in a
        for x in (
            "mobilfunk",
            "congstar",
            "domain",
            "ionos",
            "telefon",
            "handy",
            "internet",
        )
    ):
        return "Telekommunikation"
    if any(x in p for x in ("macbook", "laptop", "hardware")):
        return "Hardware"
    if any(x in p for x in ("lexware", "buchhaltung", "steuer")):
        return "Buchhaltung"
    if any(
        x in p or x in a
        for x in (
            "adobe",
            "microsoft",
            "cursor",
            "chatgpt",
            "claude",
            "oneflow",
            "wordpress",
            "endel",
            "software",
        )
    ):
        return "Tools"
    return "Sonstiges"


def categories_breakdown(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    buckets: dict[str, float] = {k: 0.0 for k in KATEGORIEN}
    for it in items:
        cat = _normalize_kategorie(
            str(it.get("kategorie") or ""),
            str(it.get("posten") or ""),
            str(it.get("anbieter") or ""),
        )
        val = it.get("amount")
        if val is None:
            val, _ = _parse_amount_cell(it.get("amount_display") or "")
        if val is None:
            continue
        buckets[cat] = buckets.get(cat, 0.0) + val
    total = sum(buckets.values()) or 1.0
    out: list[dict[str, Any]] = []
    for cat in KATEGORIEN:
        amount = round(buckets.get(cat, 0.0), 2)
        if amount <= 0:
            continue
        out.append(
            {
                "kategorie": cat,
                "amount": amount,
                "percent": round(100.0 * amount / total, 1),
            }
        )
    out.sort(key=lambda x: x["amount"], reverse=True)
    return out


def _find_section_bounds(lines: list[str]) -> tuple[int, int, int]:
    start = -1
    for i, line in enumerate(lines):
        if line.strip() == SECTION_MARK:
            start = i
            break
    if start < 0:
        raise ValueError("Abschnitt §3 Geschäftskosten nicht in Finanz_Arbeitsgrundlage.md")

    table_start = -1
    for i in range(start + 1, len(lines)):
        if lines[i].strip().startswith("| Posten |"):
            table_start = i
            break
    if table_start < 0:
        raise ValueError("Kostentabelle §3 nicht gefunden")

    table_end = table_start + 1
    while table_end < len(lines):
        row = lines[table_end].strip()
        if row.startswith("### ") or row.startswith("## "):
            break
        if row.startswith("|"):
            table_end += 1
            continue
        if not row:
            table_end += 1
            break
        break
    return start, table_start, table_end


def _next_item_id(items: list[dict[str, Any]]) -> str:
    n = 0
    for it in items:
        m = re.match(r"^ce-(\d+)$", str(it.get("id") or ""))
        if m:
            n = max(n, int(m.group(1)))
    return f"ce-{n + 1:03d}"


def _ensure_item_ids(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for i, raw in enumerate(items):
        it = _enrich_item(raw)
        if not it.get("id"):
            it["id"] = f"ce-{i + 1:03d}"
        out.append(it)
    return out


def _enrich_item(raw: dict[str, Any]) -> dict[str, Any]:
    display = raw.get("amount_display") or ""
    val = raw.get("amount")
    if val is None and display:
        val, display = _parse_amount_cell(display)
    posten = str(raw.get("posten", "")).strip()
    anbieter = str(raw.get("anbieter") or "—").strip()
    item: dict[str, Any] = {
        "posten": posten,
        "kategorie": _normalize_kategorie(
            str(raw.get("kategorie") or ""), posten, anbieter
        ),
        "anbieter": anbieter,
        "amount": val,
        "amount_display": display or _format_amount_cell(val or ""),
        "note": str(raw.get("note") or "").strip(),
    }
    if raw.get("id"):
        item["id"] = str(raw["id"])
    return item


def _load_from_md_table() -> dict[str, Any]:
    text = FINANCE_MD.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)
    _, table_start, table_end = _find_section_bounds(lines)

    header = lines[table_start].strip()
    has_kategorie = "Kategorie" in header

    items: list[dict[str, Any]] = []
    for i in range(table_start + 2, table_end):
        line = lines[i]
        if TABLE_SEP.match(line.strip()):
            continue
        cells = _split_table_row(line)
        if not cells:
            continue
        if has_kategorie and len(cells) >= 5:
            posten, kategorie, anbieter, amount_raw, note = (
                cells[0],
                cells[1],
                cells[2],
                cells[3],
                cells[4],
            )
        else:
            posten, anbieter, amount_raw, note = cells[0], cells[1], cells[2], cells[3]
            kategorie = ""
        anbieter = re.sub(r"\*\*([^*]+)\*\*", r"\1", anbieter).strip()
        posten = re.sub(r"\*\*([^*]+)\*\*", r"\1", posten).strip()
        kategorie = re.sub(r"\*\*([^*]+)\*\*", r"\1", kategorie).strip()
        note = re.sub(r"\*\*([^*]+)\*\*", r"\1", note).strip()
        if "Summe bekannt" in posten:
            continue
        val, display = _parse_amount_cell(amount_raw)
        items.append(
            _enrich_item(
                {
                    "posten": posten,
                    "kategorie": kategorie,
                    "anbieter": anbieter,
                    "amount": val,
                    "amount_display": display or amount_raw,
                    "note": note,
                }
            )
        )

    pending = [
        {"posten": "WordPress", "anbieter": "", "note": "Betrag noch offen"},
        {"posten": "StudyFetch", "anbieter": "", "note": "kündigen"},
    ]
    return {
        "version": 1,
        "updated": datetime.now().strftime("%Y-%m-%d"),
        "items": items,
        "pending": pending,
    }


def _compute_total(items: list[dict[str, Any]]) -> tuple[float, str]:
    total = 0.0
    for it in items:
        val = it.get("amount")
        if val is None:
            val, _ = _parse_amount_cell(it.get("amount_display") or "")
        if val is not None:
            total += val
    return round(total, 2), _format_sum_de(total)


def _render_table_lines(items: list[dict[str, Any]]) -> list[str]:
    header = "| Posten | Kategorie | Anbieter | EUR/Monat | Notiz |\n"
    sep = "|--------|-----------|----------|----------:|-------|\n"
    rows: list[str] = [header, sep]
    total = 0.0
    for it in items:
        amt_cell = it.get("amount_display") or "—"
        val = it.get("amount")
        if val is None:
            val, _ = _parse_amount_cell(amt_cell)
        if val is not None:
            total += val
        anbieter = it.get("anbieter") or "—"
        if anbieter not in ("—", "-"):
            anbieter = f"**{anbieter}**" if anbieter in (
                "Congstar",
                "IONOS",
                "Lexware",
            ) else anbieter
        rows.append(
            f"| {it['posten']} | {it.get('kategorie', 'Sonstiges')} | {anbieter} | {amt_cell} | {it.get('note') or ''} |\n"
        )
    rows.append(
        f"| **Summe bekannt (monatlich)** | | | **{_format_sum_de(total)}** | |\n"
    )
    return rows


def _sync_finance_md(items: list[dict[str, Any]]) -> None:
    text = FINANCE_MD.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)
    _, table_start, table_end = _find_section_bounds(lines)
    lines[table_start:table_end] = _render_table_lines(items)
    total, sum_display = _compute_total(items)
    body = "".join(lines)
    body = re.sub(
        r"(Geschäft Tools\+Fix / Monat \(bekannt\) \| )~[\d.,+]+\+?",
        rf"\g<1>{sum_display}",
        body,
    )
    FINANCE_MD.write_text(body, encoding="utf-8")


def save_kosten(data: dict[str, Any]) -> dict[str, Any]:
    items = _ensure_item_ids([_enrich_item(x) for x in data.get("items") or []])
    pending = list(data.get("pending") or [])
    total, sum_display = _compute_total(items)
    out = {
        "version": 1,
        "updated": datetime.now().strftime("%Y-%m-%d"),
        "items": items,
        "pending": pending,
        "total": total,
        "total_display": sum_display,
    }
    KOSTEN_JSON.parent.mkdir(parents=True, exist_ok=True)
    KOSTEN_JSON.write_text(
        json.dumps(
            {
                "version": out["version"],
                "updated": out["updated"],
                "items": items,
                "pending": pending,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    _sync_finance_md(items)
    return load_business_costs()


def load_kosten_raw() -> dict[str, Any]:
    if KOSTEN_JSON.is_file():
        data = json.loads(KOSTEN_JSON.read_text(encoding="utf-8"))
        if isinstance(data, dict) and data.get("items"):
            raw_items = data["items"]
            needs_ids = any(not x.get("id") for x in raw_items)
            needs_kat = any(not x.get("kategorie") for x in raw_items)
            data["items"] = _ensure_item_ids([_enrich_item(x) for x in raw_items])
            if "pending" not in data:
                data["pending"] = []
            if needs_ids or needs_kat:
                save_kosten(data)
            return data
    migrated = _load_from_md_table()
    save_kosten(migrated)
    return migrated


def load_business_costs() -> dict[str, Any]:
    data = load_kosten_raw()
    items = data.get("items") or []
    total, sum_display = _compute_total(items)
    return {
        "items": items,
        "pending": data.get("pending") or [],
        "categories": categories_breakdown(items),
        "kategorien": list(KATEGORIEN),
        "total": total,
        "total_display": sum_display,
        "source_json": "hq/05_Forderungen/Cert_Expert_Kosten.json",
        "source_md": "hq/05_Forderungen/Finanz_Arbeitsgrundlage.md",
        "section": SECTION_MARK,
    }


def add_business_cost(
    posten: str,
    anbieter: str,
    amount: str,
    note: str = "",
    kategorie: str = "",
) -> dict[str, Any]:
    posten = posten.strip()
    anbieter = anbieter.strip()
    amount_s = _format_amount_cell(amount)
    note = note.strip()
    if not posten or not amount_s:
        raise ValueError("Posten und Betrag sind Pflicht")

    data = load_kosten_raw()
    val, display = _parse_amount_cell(amount_s)
    data["items"].append(
        _enrich_item(
            {
                "id": _next_item_id(data["items"]),
                "posten": posten,
                "kategorie": kategorie,
                "anbieter": anbieter or "—",
                "amount": val,
                "amount_display": display or amount_s,
                "note": note,
            }
        )
    )
    return save_kosten(data)


def _resolve_item_index(items: list[dict[str, Any]], item_id: str) -> int:
    item_id = str(item_id).strip()
    if item_id.startswith("idx-"):
        try:
            return int(item_id.split("-", 1)[1])
        except ValueError:
            return -1
    return next((i for i, it in enumerate(items) if it.get("id") == item_id), -1)


def save_all_items(items_payload: list[dict[str, Any]]) -> dict[str, Any]:
    if not items_payload:
        raise ValueError("Keine Kostenposten übermittelt")

    data = load_kosten_raw()
    old_items = _ensure_item_ids(data.get("items") or [])
    new_items: list[dict[str, Any]] = []

    for i, raw in enumerate(items_payload):
        posten = str(raw.get("posten", "")).strip()
        anbieter = str(raw.get("anbieter", "")).strip()
        amount_s = _format_amount_cell(str(raw.get("amount", "")).strip())
        note = str(raw.get("note", "")).strip()
        kategorie = str(raw.get("kategorie", "")).strip()
        item_id = str(raw.get("id", "")).strip()

        if not posten or not amount_s:
            raise ValueError(f"Zeile {i + 1}: Posten und Betrag sind Pflicht")

        if item_id.startswith("idx-"):
            try:
                idx = int(item_id.split("-", 1)[1])
                item_id = str(old_items[idx].get("id") or "")
            except (ValueError, IndexError):
                item_id = ""
        if not item_id and i < len(old_items):
            item_id = str(old_items[i].get("id") or "")
        if not item_id:
            item_id = _next_item_id(new_items)

        val, display = _parse_amount_cell(amount_s)
        new_items.append(
            _enrich_item(
                {
                    "id": item_id,
                    "posten": posten,
                    "kategorie": kategorie,
                    "anbieter": anbieter or "—",
                    "amount": val,
                    "amount_display": display or amount_s,
                    "note": note,
                }
            )
        )

    data["items"] = new_items
    return save_kosten(data)


def update_business_cost(
    item_id: str,
    posten: str,
    anbieter: str,
    amount: str,
    note: str = "",
) -> dict[str, Any]:
    item_id = str(item_id).strip()
    posten = posten.strip()
    anbieter = anbieter.strip()
    amount_s = _format_amount_cell(amount)
    note = note.strip()
    if not item_id or not posten or not amount_s:
        raise ValueError("id, posten und amount sind Pflicht")

    data = load_kosten_raw()
    items = _ensure_item_ids(data.get("items") or [])
    idx = _resolve_item_index(items, item_id)
    if idx < 0:
        raise ValueError("Kostenposten nicht gefunden")
    item_id = str(items[idx].get("id") or item_id)

    val, display = _parse_amount_cell(amount_s)
    items[idx] = _enrich_item(
        {
            "id": item_id,
            "posten": posten,
            "anbieter": anbieter or "—",
            "amount": val,
            "amount_display": display or amount_s,
            "note": note,
        }
    )
    data["items"] = items
    return save_kosten(data)
