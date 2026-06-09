#!/usr/bin/env python3
"""Erwartete Geschäftseinnahmen — JSON (Dashboard) + Sync Finanz_Arbeitsgrundlage.md §1."""

from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path
from typing import Any

HQ = Path(__file__).resolve().parents[1]
FINANCE_MD = HQ / "05_Forderungen" / "Finanz_Arbeitsgrundlage.md"
EINNAHMEN_JSON = HQ / "05_Forderungen" / "Cert_Expert_Einnahmen.json"

SECTION_MARK = "## 1 — Geschäft: erwartete Zahlungen (Pipeline)"
TABLE_SEP = re.compile(r"^\|\s*[-:]+\s*\|")

STATUSES = (
    "Warten",
    "Erwartet",
    "Offen",
    "Rechnung noch anlegen",
    "Nicht erwartet",
    "Sonstiges",
)


def _parse_amount_cell(raw: str) -> tuple[float | None, str, bool]:
    display = (raw or "").strip()
    is_estimate = display.startswith("~") or "ca." in display.lower()
    if not display or display == "—":
        return None, display, is_estimate
    work = display.lstrip("~").strip()
    for prefix in ("ab ", "ca. "):
        if work.lower().startswith(prefix):
            work = work[len(prefix) :].strip()
    work = work.rstrip("+").strip().replace("€", "").strip()
    if not work:
        return None, display, is_estimate
    if "," in work:
        work = work.replace(".", "").replace(",", ".")
    try:
        return float(work), display, is_estimate
    except ValueError:
        return None, display, is_estimate


def _format_eur_de(total: float, approximate: bool = False) -> str:
    whole = int(round(abs(total) * 100))
    euros = whole // 100
    cents = whole % 100
    euros_s = f"{euros:,}".replace(",", ".")
    s = f"{euros_s},{cents:02d}"
    if approximate:
        return f"~{s}"
    return s


def _format_amount_cell(amount: str | float, estimate: bool = False) -> str:
    if isinstance(amount, (int, float)):
        s = f"{amount:.2f}".replace(".", ",")
        if "," in s:
            left, right = s.split(",", 1)
            left = f"{int(left):,}".replace(",", ".")
            disp = f"{left},{right}"
        else:
            disp = s
        if estimate and not disp.startswith("~"):
            return f"~{disp}"
        return disp
    raw = str(amount).strip()
    return raw


def _split_table_row(line: str) -> list[str] | None:
    line = line.strip()
    if not line.startswith("|"):
        return None
    parts = [p.strip() for p in line.split("|")[1:-1]]
    return parts if len(parts) >= 3 else None


def _normalize_status(raw: str) -> str:
    s = (raw or "").strip()
    if s in STATUSES:
        return s
    low = s.lower()
    if "rechnung" in low and "anlegen" in low:
        return "Rechnung noch anlegen"
    if "nicht erwartet" in low:
        return "Nicht erwartet"
    if s:
        return "Sonstiges"
    return "Offen"


def status_breakdown(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    buckets: dict[str, float] = {}
    for it in items:
        val = it.get("amount")
        if val is None:
            val, _, _ = _parse_amount_cell(it.get("amount_display") or "")
        if val is None or val <= 0:
            continue
        st = _normalize_status(str(it.get("status") or ""))
        buckets[st] = buckets.get(st, 0.0) + val
    total = sum(buckets.values()) or 1.0
    out: list[dict[str, Any]] = []
    for st in STATUSES:
        amount = round(buckets.get(st, 0.0), 2)
        if amount <= 0:
            continue
        out.append(
            {
                "status": st,
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
        raise ValueError("Abschnitt §1 Pipeline nicht in Finanz_Arbeitsgrundlage.md")

    table_start = -1
    for i in range(start + 1, len(lines)):
        if lines[i].strip().startswith("| Kunde"):
            table_start = i
            break
    if table_start < 0:
        raise ValueError("Einnahmentabelle §1 nicht gefunden")

    table_end = table_start + 1
    while table_end < len(lines):
        row = lines[table_end].strip()
        if row.startswith("## "):
            break
        if row.startswith("| Summe") or (
            row.startswith("|") and "Summe" in row and table_end > table_start + 2
        ):
            break
        if row.startswith("|"):
            table_end += 1
            continue
        if not row:
            table_end += 1
            break
        break
    return start, table_start, table_end


def _find_summary_bounds(lines: list[str], after: int) -> tuple[int, int]:
    start = -1
    for i in range(after, len(lines)):
        if lines[i].strip().startswith("| Summe |"):
            start = i
            break
    if start < 0:
        return -1, -1
    end = start + 1
    while end < len(lines):
        row = lines[end].strip()
        if not row.startswith("|"):
            break
        end += 1
    return start, end


def _next_item_id(items: list[dict[str, Any]]) -> str:
    n = 0
    for it in items:
        m = re.match(r"^inc-(\d+)$", str(it.get("id") or ""))
        if m:
            n = max(n, int(m.group(1)))
    return f"inc-{n + 1:03d}"


def _ensure_item_ids(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for i, raw in enumerate(items):
        it = _enrich_item(raw)
        if not it.get("id"):
            it["id"] = f"inc-{i + 1:03d}"
        out.append(it)
    return out


def _enrich_item(raw: dict[str, Any]) -> dict[str, Any]:
    display = raw.get("amount_display") or ""
    val = raw.get("amount")
    is_estimate = bool(raw.get("is_estimate"))
    if val is None and display:
        val, display, parsed_est = _parse_amount_cell(display)
        if parsed_est:
            is_estimate = True
    kunde = str(raw.get("kunde", "")).strip()
    item: dict[str, Any] = {
        "kunde": kunde,
        "amount": val,
        "amount_display": display or (_format_amount_cell(val or 0, is_estimate) if val is not None else ""),
        "status": _normalize_status(str(raw.get("status") or "")),
        "hq_ref": str(raw.get("hq_ref") or "").strip(),
        "is_estimate": is_estimate,
    }
    if raw.get("id"):
        item["id"] = str(raw["id"])
    return item


def _compute_totals(items: list[dict[str, Any]]) -> dict[str, Any]:
    confirmed = 0.0
    estimate = 0.0
    for it in items:
        val = it.get("amount")
        if val is None:
            val, _, _ = _parse_amount_cell(it.get("amount_display") or "")
        if val is None or val <= 0:
            continue
        if it.get("is_estimate"):
            estimate += val
        else:
            confirmed += val
    confirmed = round(confirmed, 2)
    estimate = round(estimate, 2)
    maximum = round(confirmed + estimate, 2)
    return {
        "total_confirmed": confirmed,
        "total_confirmed_display": _format_eur_de(confirmed),
        "total_estimate": estimate,
        "total_estimate_display": _format_eur_de(estimate, approximate=True),
        "total_maximum": maximum,
        "total_maximum_display": _format_eur_de(maximum, approximate=True),
    }


def _load_from_md_table() -> dict[str, Any]:
    text = FINANCE_MD.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)
    _, table_start, table_end = _find_section_bounds(lines)

    items: list[dict[str, Any]] = []
    for i in range(table_start + 2, table_end):
        line = lines[i]
        if TABLE_SEP.match(line.strip()):
            continue
        cells = _split_table_row(line)
        if not cells or len(cells) < 4:
            continue
        kunde, amount_raw, status, hq_ref = cells[0], cells[1], cells[2], cells[3]
        kunde = re.sub(r"\*\*([^*]+)\*\*", r"\1", kunde).strip()
        val, display, is_estimate = _parse_amount_cell(amount_raw)
        items.append(
            _enrich_item(
                {
                    "kunde": kunde,
                    "amount": val,
                    "amount_display": display or amount_raw,
                    "status": status,
                    "hq_ref": hq_ref,
                    "is_estimate": is_estimate,
                }
            )
        )

    return {
        "version": 1,
        "updated": datetime.now().strftime("%Y-%m-%d"),
        "items": items,
    }


def _render_table_lines(items: list[dict[str, Any]]) -> list[str]:
    header = "| Kunde / Debitor | Betrag (EUR) | Status | HQ / Lexware |\n"
    sep = "|-----------------|-------------:|--------|----------------|\n"
    rows: list[str] = [header, sep]
    for it in items:
        amt = it.get("amount_display") or "—"
        kunde = it["kunde"]
        if it.get("kunde") in ("AFAS",) or "AFAS" in kunde:
            pass
        rows.append(
            f"| {kunde} | {amt} | {it.get('status', 'Offen')} | {it.get('hq_ref') or ''} |\n"
        )
    return rows


def _render_summary_lines(totals: dict[str, Any]) -> list[str]:
    c = totals["total_confirmed_display"]
    e = totals["total_estimate_display"]
    m = totals["total_maximum_display"]
    return [
        "| Summe | EUR |\n",
        "|-------|----:|\n",
        f"| Offen / warten / erwartet (ohne Schätzungen) | **{c}** |\n",
        f"| Noch zu fakturieren (Schätzung) | **{e}** |\n",
        f"| Maximum wenn alles kommt | **{m}** |\n",
        "\n",
    ]


def _sync_finance_md(items: list[dict[str, Any]]) -> None:
    text = FINANCE_MD.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)
    _, table_start, table_end = _find_section_bounds(lines)
    lines[table_start:table_end] = _render_table_lines(items)

    totals = _compute_totals(items)
    sum_start, sum_end = _find_summary_bounds(lines, table_end)
    if sum_start >= 0:
        lines[sum_start:sum_end] = _render_summary_lines(totals)

    body = "".join(lines)
    body = re.sub(
        r"(Offene Forderungen \(Liste §1\) \| )[\d.~,]+",
        rf"\g<1>{totals['total_confirmed_display']}",
        body,
    )
    body = re.sub(
        r"(Noch zu fakturieren \(Schätzung\) \| )[~\d.,]+",
        rf"\g<1>{totals['total_estimate_display']}",
        body,
    )
    FINANCE_MD.write_text(body, encoding="utf-8")


def save_einnahmen(data: dict[str, Any]) -> dict[str, Any]:
    items = _ensure_item_ids([_enrich_item(x) for x in data.get("items") or []])
    out = {
        "version": 1,
        "updated": datetime.now().strftime("%Y-%m-%d"),
        "items": items,
    }
    EINNAHMEN_JSON.parent.mkdir(parents=True, exist_ok=True)
    EINNAHMEN_JSON.write_text(
        json.dumps(out, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    _sync_finance_md(items)
    return load_business_income()


def load_einnahmen_raw() -> dict[str, Any]:
    if EINNAHMEN_JSON.is_file():
        data = json.loads(EINNAHMEN_JSON.read_text(encoding="utf-8"))
        if isinstance(data, dict) and data.get("items"):
            data["items"] = _ensure_item_ids([_enrich_item(x) for x in data["items"]])
            return data
    migrated = _load_from_md_table()
    save_einnahmen(migrated)
    return migrated


def load_business_income() -> dict[str, Any]:
    data = load_einnahmen_raw()
    items = data.get("items") or []
    totals = _compute_totals(items)
    return {
        "items": items,
        "by_status": status_breakdown(items),
        "statuses": list(STATUSES),
        **totals,
        "source_json": "hq/05_Forderungen/Cert_Expert_Einnahmen.json",
        "source_md": "hq/05_Forderungen/Finanz_Arbeitsgrundlage.md",
        "section": SECTION_MARK,
    }


def add_business_income(
    kunde: str,
    amount: str,
    status: str = "Offen",
    hq_ref: str = "",
    is_estimate: bool = False,
) -> dict[str, Any]:
    kunde = kunde.strip()
    amount_s = _format_amount_cell(amount, is_estimate)
    status = _normalize_status(status)
    hq_ref = hq_ref.strip()
    if not kunde or not amount_s:
        raise ValueError("Kunde und Betrag sind Pflicht")

    data = load_einnahmen_raw()
    val, display, parsed_est = _parse_amount_cell(amount_s)
    if parsed_est:
        is_estimate = True
    data["items"].append(
        _enrich_item(
            {
                "id": _next_item_id(data["items"]),
                "kunde": kunde,
                "amount": val,
                "amount_display": display or amount_s,
                "status": status,
                "hq_ref": hq_ref,
                "is_estimate": is_estimate,
            }
        )
    )
    return save_einnahmen(data)


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
        raise ValueError("Keine Einnahmen übermittelt")

    data = load_einnahmen_raw()
    old_items = _ensure_item_ids(data.get("items") or [])
    new_items: list[dict[str, Any]] = []

    for i, raw in enumerate(items_payload):
        kunde = str(raw.get("kunde", "")).strip()
        amount_s = _format_amount_cell(
            str(raw.get("amount", "")).strip(),
            bool(raw.get("is_estimate")),
        )
        status = _normalize_status(str(raw.get("status", "")))
        hq_ref = str(raw.get("hq_ref", "")).strip()
        item_id = str(raw.get("id", "")).strip()
        is_estimate = bool(raw.get("is_estimate"))

        if not kunde or not amount_s:
            raise ValueError(f"Zeile {i + 1}: Kunde und Betrag sind Pflicht")

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

        val, display, parsed_est = _parse_amount_cell(amount_s)
        if parsed_est:
            is_estimate = True
        new_items.append(
            _enrich_item(
                {
                    "id": item_id,
                    "kunde": kunde,
                    "amount": val,
                    "amount_display": display or amount_s,
                    "status": status,
                    "hq_ref": hq_ref,
                    "is_estimate": is_estimate,
                }
            )
        )

    data["items"] = new_items
    return save_einnahmen(data)
