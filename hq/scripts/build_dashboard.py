#!/usr/bin/env python3
"""Generate Obsidian-readable HQ briefing files from hq/ markdown sources."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path

HQ = Path(__file__).resolve().parents[1]
DASH = HQ / "00_Dashboard"
KP = HQ / "03_Kundenprojekte"
REGISTRY = KP / "_registry.json"

TODO_BLOCK = re.compile(r"^## (TODO-[^\s]+)\s*$", re.M)
FIELD = re.compile(r"^- \*\*([^*]+):\*\*\s*(.*)$", re.M)

DATE_PAT = re.compile(r"\b(\d{1,2})\.(\d{1,2})\.(\d{4})\b")
AMPEL = re.compile(r"\*\*Ampel:\*\*\s*([🔴🟡🟢]|[^\n]+)")
ISO_DATE = re.compile(r"\b(\d{4})-(\d{2})-(\d{2})\b")
SNAPSHOT_AUDIT_DAYS = 30


@dataclass
class TodoItem:
    todo_id: str
    aufgabe: str
    projekt: str
    kategorie: str
    frist: str
    status: str
    prioritaet: str
    quelle: str
    naechster_schritt: str
    file_path: str
    section: str  # Offen | In Bearbeitung | Erledigt


def _parse_todos(path: Path) -> list[TodoItem]:
    text = path.read_text(encoding="utf-8")
    section = "Offen"
    items: list[TodoItem] = []
    blocks = re.split(r"(?=^## TODO-)", text, flags=re.M)
    for block in blocks:
        if not block.strip().startswith("## TODO-"):
            continue
        m = TODO_BLOCK.search(block)
        if not m:
            continue
        fields: dict[str, str] = {}
        for line in block.splitlines():
            fm = FIELD.match(line.strip())
            if fm:
                fields[fm.group(1).strip()] = fm.group(2).strip()
        status = fields.get("Status", "open").lower()
        if status in ("done", "cancelled"):
            continue
        if status not in ("open", "in_progress"):
            if "erledigt" in block.lower()[:200]:
                continue
        items.append(
            TodoItem(
                todo_id=m.group(1),
                aufgabe=fields.get("Aufgabe", "—"),
                projekt=fields.get("Projekt", path.parent.name),
                kategorie=fields.get("Kategorie", "—"),
                frist=fields.get("Frist", ""),
                status=status,
                prioritaet=fields.get("Priorität", fields.get("Prioritaet", "normal")),
                quelle=fields.get("Quelle", "—"),
                naechster_schritt=fields.get("Nächster Schritt", fields.get("Naechster Schritt", "")),
                file_path=str(path.relative_to(HQ.parent)),
                section=section,
            )
        )
    return items


def _collect_todos_glob(pattern: str) -> list[TodoItem]:
    out: list[TodoItem] = []
    for p in sorted(HQ.glob(pattern)):
        if p.is_file() and p.suffix == ".md":
            out.extend(_parse_todos(p))
    return out


def _parse_date(s: str) -> date | None:
    m = DATE_PAT.search(s)
    if m:
        d, mo, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
        try:
            return date(y, mo, d)
        except ValueError:
            return None
    m = ISO_DATE.search(s)
    if m:
        try:
            return date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
        except ValueError:
            return None
    return None


def _customer_meta(slug: str) -> dict:
    status_path = KP / slug / "Status.md"
    audit_path = KP / slug / "Audit_2026.md"
    meta = {
        "slug": slug,
        "ampel": "—",
        "blocker": "",
        "audit_dates": [],
        "status_link": f"../03_Kundenprojekte/{slug}/Status.md",
        "todos_link": f"../03_Kundenprojekte/{slug}/ToDos.md",
    }
    if status_path.exists():
        t = status_path.read_text(encoding="utf-8")
        am = AMPEL.search(t)
        if am:
            meta["ampel"] = am.group(1).strip()[:20]
        bm = re.search(r"\*\*Blocker:\*\*\s*([^\n]+)", t)
        if bm:
            meta["blocker"] = bm.group(1).strip()[:120]
        # Only dates under "## Audit-Termin" / "## Audit-Termine" (not Vorbereitung/Zeitplan)
        sec = re.search(
            r"## Audit-Termin[^\n]*\n(.*?)(?=\n## |\Z)",
            t,
            re.S | re.I,
        )
        if sec:
            for line in sec.group(1).splitlines():
                if "schriftverkehr" in line.lower() or "offiziell" in line.lower():
                    continue
                if "**" not in line and "Überwachung" not in line:
                    # prefer bold audit rows
                    if not re.search(r"\*\*\d{1,2}\.\d{1,2}", line):
                        continue
                for d in DATE_PAT.findall(line):
                    ds = f"{d[0]}.{d[1]}.{d[2]}"
                    if ds not in meta["audit_dates"]:
                        meta["audit_dates"].append(ds)
    if audit_path.exists():
        t = audit_path.read_text(encoding="utf-8")
        tm = re.search(r"\*\*Audit-Termin:\*\*\s*\*\*(\d{1,2}\.\d{1,2}\.\d{4})\*\*", t)
        if tm and tm.group(1) not in meta["audit_dates"]:
            meta["audit_dates"].append(tm.group(1))
        if not meta["audit_dates"]:
            overview = re.search(r"## Audit-Übersicht(.*?)(?=\n## |\Z)", t, re.S | re.I)
            if overview:
                for line in overview.group(1).splitlines():
                    if re.search(r"\*\*Audit-Termin\*\*|\*\*Termin\*\*", line) or (
                        "**" in line and "Phase" in line
                    ):
                        for d in DATE_PAT.findall(line):
                            if "offiziell" in line.lower() or "unterlagen" in line.lower():
                                continue
                            ds = f"{d[0]}.{d[1]}.{d[2]}"
                            if ds not in meta["audit_dates"]:
                                meta["audit_dates"].append(ds)
            for line in t.splitlines()[:20]:
                if "| **" in line and DATE_PAT.search(line) and "Phase" in line:
                    for d in DATE_PAT.findall(line):
                        ds = f"{d[0]}.{d[1]}.{d[2]}"
                        if ds not in meta["audit_dates"]:
                            meta["audit_dates"].append(ds)
    return meta


def _read_status_text(slug: str) -> str:
    p = KP / slug / "Status.md"
    return p.read_text(encoding="utf-8") if p.exists() else ""


def _todo_stats(todos: list[TodoItem], today: date) -> dict:
    urgent_items = [t for t in todos if t.prioritaet.lower() == "urgent"]
    overdue_items = [t for t in todos if (d := _parse_date(t.frist)) and d < today]
    return {
        "open": len(todos),
        "urgent": len(urgent_items),
        "overdue": len(overdue_items),
        "urgent_items": urgent_items,
        "overdue_items": overdue_items,
    }


def _infer_wartet_auf(status_text: str, todos: list[TodoItem]) -> tuple[str, str]:
    combined = status_text + "\n" + "\n".join(f"{t.aufgabe} {t.naechster_schritt}" for t in todos)
    low = combined.lower()
    explicit = re.search(
        r"wartet auf\s+([^/\n|*]+?)(?:\s*/|\s*\||\s*$|\s*\*\*)",
        low,
    )
    if explicit:
        val = explicit.group(1).strip().rstrip(".")
        if val:
            return val[:80].title() if val.islower() else val[:80], "explizit"
    if re.search(r"wartet auf kunde|kunde-?upload|vom kunden|kunde lädt|durch kunden", low):
        return "Kunde", "inferred"
    if re.search(r"dekra.*bestätigt|termine bestätigt", low):
        pass
    elif re.search(r"dekra", low) and re.search(
        r"angebot|portal|ordner|unterschr|zertifizierungsstelle", low
    ):
        return "DEKRA", "inferred"
    if re.search(r"auditor|bestätigung auditor|freigabe auditor", low):
        return "Auditor", "inferred"
    return "TBD", "unbekannt"


def _parse_naechste_aktion(status_text: str, todos: list[TodoItem]) -> str:
    for pattern in (
        r"## Nächste Schritte[^\n]*\n\n1\.\s*([^\n]+)",
        r"## Schwerpunkte[^\n]*\n\n1\.\s*([^\n]+)",
    ):
        m = re.search(pattern, status_text, re.S | re.I)
        if m:
            return m.group(1).strip()[:160]
    urgent = sorted(todos, key=lambda t: _prio_rank(t.prioritaet))
    for t in urgent:
        step = (t.naechster_schritt or "").strip()
        if step and step not in ("(festlegen)", "—"):
            return step[:160]
    if urgent:
        return urgent[0].aufgabe[:160]
    return "TBD"


def _customer_snapshot_row(
    c: dict,
    customer_todos: list[TodoItem],
    today: date,
) -> dict:
    slug = c["slug"]
    status_text = _read_status_text(slug)
    todos = _todos_for_slug(customer_todos, slug)
    stats = _todo_stats(todos, today)
    wartet_auf, wartet_src = _infer_wartet_auf(status_text, todos)

    projekttyp = "TBD"
    pm = re.search(r"\*\*Projekttyp:\*\*\s*([^\n]+)", status_text)
    if pm:
        projekttyp = pm.group(1).strip()[:100]

    frist = "TBD"
    fm = re.search(r"\*\*Frist:\*\*\s*([^\n]+)", status_text)
    if fm:
        frist = fm.group(1).strip()[:80]
    elif c["meta"]["audit_dates"]:
        frist = c["meta"]["audit_dates"][0]

    audit_next = "TBD"
    audit_dates_parsed: list[tuple[date, str]] = []
    for ds in c["meta"]["audit_dates"]:
        d = _parse_date(ds)
        if d:
            audit_dates_parsed.append((d, ds))
    if audit_dates_parsed:
        audit_dates_parsed.sort()
        future = [x for x in audit_dates_parsed if x[0] >= today]
        audit_next = (future or audit_dates_parsed)[0][1]

    wartet_label = wartet_auf
    if wartet_src == "inferred":
        wartet_label = f"{wartet_auf} (inferred)"
    elif wartet_src == "unbekannt":
        wartet_label = "TBD"

    base = KP / slug
    files = []
    for name in ("Status.md", "ToDos.md", "Audit_2026.md", "Kommunikation.md"):
        if (base / name).exists():
            files.append(f"03_Kundenprojekte/{slug}/{name}")

    return {
        "slug": slug,
        "display_name": c["display_name"],
        "ampel": c["meta"]["ampel"],
        "audit_next": audit_next,
        "audit_dates": c["meta"]["audit_dates"],
        "frist": frist,
        "projekttyp": projekttyp,
        "open_todos": stats["open"],
        "urgent_todos": stats["urgent"],
        "overdue_todos": stats["overdue"],
        "blocker": c["meta"]["blocker"] or "TBD",
        "wartet_auf": wartet_label,
        "wartet_src": wartet_src,
        "naechste_aktion": _parse_naechste_aktion(status_text, todos),
        "files": files,
        "urgent_items": stats["urgent_items"],
        "overdue_items": stats["overdue_items"],
    }


def _fmt_todo_line(t: TodoItem, slug: str = "") -> str:
    frist = t.frist.strip() if t.frist else "—"
    proj = t.projekt or slug or "—"
    return f"- **{proj}** · [{t.prioritaet}] {t.aufgabe[:100]} _(Frist: {frist}, ID: {t.todo_id})_"


def _cross_by_folder(cross_todos: list[TodoItem], folder: str) -> list[TodoItem]:
    return [t for t in cross_todos if folder in t.file_path.replace("\\", "/")]


def _build_operations_snapshot(
    customers: list[dict],
    customer_todos: list[TodoItem],
    cross_todos: list[TodoItem],
    today: date,
) -> str:
    ts = datetime.now().strftime("%Y-%m-%d %H:%M")
    rows = [_customer_snapshot_row(c, customer_todos, today) for c in customers]

    all_urgent: list[tuple[str, TodoItem]] = []
    all_overdue: list[tuple[str, TodoItem]] = []
    for r in rows:
        for t in r["urgent_items"]:
            all_urgent.append((r["display_name"], t))
        for t in r["overdue_items"]:
            all_overdue.append((r["display_name"], t))

    red = [r for r in rows if "🔴" in r["ampel"]]
    audits_30: list[tuple[date, dict]] = []
    for r in rows:
        for ds in r["audit_dates"]:
            d = _parse_date(ds)
            if d and 0 <= (d - today).days <= SNAPSHOT_AUDIT_DAYS:
                audits_30.append((d, r))
    audits_30.sort(key=lambda x: x[0])
    seen_audit: set[tuple[str, str]] = set()
    audits_unique: list[tuple[date, dict]] = []
    for item in audits_30:
        key = (item[1]["slug"], item[0].isoformat())
        if key not in seen_audit:
            seen_audit.add(key)
            audits_unique.append(item)

    wait_kunde = [r for r in rows if r["wartet_src"] != "unbekannt" and "kunde" in r["wartet_auf"].lower()]
    wait_dekra = [r for r in rows if "dekra" in r["wartet_auf"].lower()]
    wait_auditor = [r for r in rows if "auditor" in r["wartet_auf"].lower()]

    ford = _cross_by_folder(cross_todos, "05_Forderungen")
    vert = _cross_by_folder(cross_todos, "04_Vertrieb")
    sw = _cross_by_folder(cross_todos, "06_Software")
    dfss = _cross_by_folder(cross_todos, "07_DFSS")

    lines = [
        "# Operations Snapshot — Cert-Expert HQ",
        "",
        f"**Generiert:** {ts} (lokal)  ",
        f"**Basis:** `hq/03_Kundenprojekte/`, Querschnitt-ToDos, Status/Audit  ",
        "**Nutzen:** Portfolio-Fragen für HQ Assistant — vor Kunden-Detailkontext laden.",
        "",
        "---",
        "",
        "## Meta",
        "",
        f"- snapshot_at: `{ts}`",
        f"- active_customers: {len(rows)}",
        f"- red_ampel: {len(red)}",
        f"- audits_next_{SNAPSHOT_AUDIT_DAYS}d: {len(audits_unique)}",
        f"- overdue_todos: {len(all_overdue)}",
        f"- urgent_todos: {len(all_urgent)}",
        f"- open_receivables: {len(ford)}",
        "",
        "---",
        "",
        "## Kunden (Detail)",
        "",
    ]

    for r in rows:
        lines.extend(
            [
                f"### {r['display_name']} (`{r['slug']}`)",
                "",
                "| Feld | Wert |",
                "|------|------|",
                f"| Ampel | {r['ampel']} |",
                f"| Audit / Frist | {r['audit_next']} / {r['frist']} |",
                f"| Projekttyp | {r['projekttyp']} |",
                f"| Offene To-dos | {r['open_todos']} |",
                f"| urgent | {r['urgent_todos']} |",
                f"| überfällig | {r['overdue_todos']} |",
                f"| Hauptblocker | {r['blocker'][:120]} |",
                f"| Wartet auf | {r['wartet_auf']} |",
                f"| Nächste Aktion | {r['naechste_aktion']} |",
                f"| Dateien | {', '.join(r['files']) or 'TBD'} |",
                "",
            ]
        )

    lines.extend(["---", "", "## Querschnitt", ""])
    for label, items, folder in [
        ("Forderungen", ford, "05_Forderungen/Offene_Juni_2026.md"),
        ("Angebote", vert, "04_Vertrieb/Angebote_Juni_2026.md"),
        ("Software", sw, "06_Software/Software_Backlog_Juni_2026.md"),
        ("DFSS", dfss, "07_DFSS/Pilot_Measurement_Juni_2026.md"),
    ]:
        lines.append(f"### {label} ({len(items)} offen)")
        lines.append("")
        if items:
            for t in items:
                lines.append(_fmt_todo_line(t, "Querschnitt"))
        else:
            lines.append("*keine offenen Einträge*")
        lines.append("")
        lines.append(f"_Quelle: `{folder}`_")
        lines.append("")

    lines.extend(["---", "", "## Portfolio-Auswertungen", ""])

    lines.append("### Rote Kunden (🔴)")
    lines.append("")
    if red:
        lines.append("| Kunde | Blocker | Wartet auf | Nächste Aktion |")
        lines.append("|-------|---------|------------|----------------|")
        for r in red:
            lines.append(
                f"| **{r['display_name']}** | {r['blocker'][:60]} | {r['wartet_auf']} | {r['naechste_aktion'][:50]} |"
            )
    else:
        lines.append("*keine*")
    lines.append("")

    lines.append(f"### Audits nächste {SNAPSHOT_AUDIT_DAYS} Tage")
    lines.append("")
    if audits_unique:
        lines.append("| Datum | Kunde | Ampel |")
        lines.append("|-------|-------|-------|")
        for d, r in audits_unique:
            lines.append(f"| **{d.strftime('%d.%m.%Y')}** | {r['display_name']} | {r['ampel']} |")
    else:
        lines.append("*keine Termine im Horizont*")
    lines.append("")

    lines.append("### Überfällige Aufgaben")
    lines.append("")
    if all_overdue:
        for name, t in sorted(all_overdue, key=lambda x: _parse_date(x[1].frist) or date.min):
            lines.append(_fmt_todo_line(t, name))
    else:
        lines.append("*keine mit ISO-Frist in der Vergangenheit*")
    lines.append("")

    lines.append("### Urgent Aufgaben")
    lines.append("")
    if all_urgent:
        for name, t in sorted(all_urgent, key=lambda x: _prio_rank(x[1].prioritaet)):
            lines.append(_fmt_todo_line(t, name))
    else:
        lines.append("*keine*")
    lines.append("")

    for title, subset in [
        ("Wartet auf Kunde", wait_kunde),
        ("Wartet auf DEKRA", wait_dekra),
        ("Wartet auf Auditor", wait_auditor),
    ]:
        lines.append(f"### {title}")
        lines.append("")
        if subset:
            for r in subset:
                lines.append(
                    f"- **{r['display_name']}** — {r['wartet_auf']} · Blocker: {r['blocker'][:70]}"
                )
        else:
            lines.append("*keine (explizit/inferred)*")
        lines.append("")

    lines.append("### Offene Forderungen")
    lines.append("")
    if ford:
        for t in ford:
            lines.append(_fmt_todo_line(t, "Forderung"))
    else:
        lines.append("*keine*")
    lines.append("")

    lines.extend(
        [
            "---",
            "",
            "## Erzeugen",
            "",
            "```bash",
            "python3 hq/scripts/build_dashboard.py",
            "```",
            "",
        ]
    )
    return "\n".join(lines)


def _prio_rank(p: str) -> int:
    return {"urgent": 0, "high": 1, "normal": 2, "low": 3}.get(p.lower(), 4)


WAVE1_SLUGS = ("TeamFlex", "Wolf_Street", "SecuGuard")
TOP_ACTIONS_MAX = 7


def _slug_in_path(slug: str, path: str) -> bool:
    norm = path.replace("\\", "/")
    return f"/{slug}/" in norm or slug.replace("_", " ") in path


def _todos_for_slug(customer_todos: list[TodoItem], slug: str) -> list[TodoItem]:
    return [t for t in customer_todos if _slug_in_path(slug, t.file_path)]


def _frist_sort_key(t: TodoItem) -> tuple:
    d = _parse_date(t.frist)
    return (d or date(2099, 1, 1), _prio_rank(t.prioritaet), t.projekt)


def _top_actions(
    customer_todos: list[TodoItem],
    cross_todos: list[TodoItem],
    today: date,
) -> list[TodoItem]:
    """Handlungen außerhalb Welle-1-Kurzblock — max TOP_ACTIONS_MAX."""
    pool: list[TodoItem] = []
    for t in customer_todos + cross_todos:
        if any(_slug_in_path(s, t.file_path) for s in WAVE1_SLUGS):
            continue
        if t.prioritaet.lower() not in ("urgent", "high"):
            continue
        pool.append(t)
    pool.sort(key=_frist_sort_key)
    return pool[:TOP_ACTIONS_MAX]


def _audit_horizon(
    customers: list[dict], today: date
) -> list[tuple[date, str, str, str]]:
    horizon: list[tuple[date, str, str, str]] = []
    for c in customers:
        for ds in c["meta"]["audit_dates"]:
            d = _parse_date(ds)
            if d and (d - today).days <= 14 and (d - today).days >= -3:
                horizon.append((d, c["display_name"], ds, c["slug"]))
    seen: set[tuple[date, str]] = set()
    deduped: list[tuple[date, str, str, str]] = []
    for item in sorted(horizon, key=lambda x: x[0]):
        key = (item[0], item[3])
        if key not in seen:
            seen.add(key)
            deduped.append(item)
    return deduped


def _briefing_header(today: date, *, variant: str) -> list[str]:
    lines = [
        f"# Tagesbriefing{' — Vollständig' if variant == 'full' else ''} — Cert-Expert HQ",
        "",
        f"**Generiert:** {today.isoformat()} {datetime.now().strftime('%H:%M')} (lokal)  ",
        "**Obsidian:** Leseansicht (siehe `WIE_NUTZEN.md`) — Buch-Symbol oder **Cmd+E**.",
        "",
    ]
    if variant == "compact":
        lines.extend(
            [
                "> **Morgens:** Nur diese Seite. Welle-1-Details → Status/ToDos.",
                "> **Wöchentlich / Planung:** [Tagesbriefing_VOLL.md](Tagesbriefing_VOLL.md)",
                "> **Master Dump:** Referenz & Restliste — [MIGRATION_STATUS.md](../01_Master_Dump/MIGRATION_STATUS.md)",
                "",
            ]
        )
    else:
        lines.extend(
            [
                "> Alle urgent-To-dos und Welle-1-Aufzählungen — für Wochenplanung, nicht jeden Morgen.",
                "> Täglich: [Tagesbriefing.md](Tagesbriefing.md)",
                "",
            ]
        )
    lines.append("---")
    lines.append("")
    return lines


def _build_briefing(
    customers: list[dict],
    customer_todos: list[TodoItem],
    cross_todos: list[TodoItem],
    today: date,
    *,
    variant: str = "compact",
) -> str:
    lines = _briefing_header(today, variant=variant)

    horizon = _audit_horizon(customers, today)
    lines.append("## Diese Woche")
    lines.append("")
    if horizon:
        lines.append("| Datum | Kunde | Ampel |")
        lines.append("|-------|-------|-------|")
        for _d, name, ds, slug in horizon:
            rel = f"../03_Kundenprojekte/{slug}/Status.md"
            amp = customers_by_slug(customers, slug)["meta"]["ampel"]
            lines.append(f"| **{ds}** | [{name}]({rel}) | {amp} |")
        lines.append("")
    else:
        lines.append("*Keine Audit-Termine in den nächsten 14 Tagen (Status/Audit-Übersicht).*")
        lines.append("")

    if variant == "compact":
        top = _top_actions(customer_todos, cross_todos, today)
        lines.append("## Top-Aktionen (außerhalb Welle 1)")
        lines.append("")
        if top:
            for t in top:
                frist = t.frist.strip() if t.frist and "**" not in t.frist else "—"
                lines.append(f"- **{t.projekt or 'Querschnitt'}** — {t.aufgabe[:95]} _(Frist: {frist})_")
        else:
            lines.append("*Keine dringenden Punkte außerhalb Welle 1 — Fokus auf TeamFlex / Wolf Street / SecuGuard.*")
        lines.append("")
        lines.append("---")
        lines.append("")
        lines.append("## Welle 1 — eine Zeile pro Kunde")
        lines.append("")
        lines.append("| Kunde | Blocker (Kurz) | Termin | Offen |")
        lines.append("|-------|------------------|--------|-------|")
        for slug in WAVE1_SLUGS:
            c = customers_by_slug(customers, slug)
            todos = _todos_for_slug(customer_todos, slug)
            urgent_n = len([t for t in todos if t.prioritaet.lower() == "urgent"])
            blocker = (c["meta"]["blocker"] or "—")[:70]
            terms = ", ".join(c["meta"]["audit_dates"][:2]) or "—"
            lines.append(
                f"| {c['meta']['ampel']} **[{c['display_name']}]({c['meta']['status_link']})** "
                f"| {blocker} | {terms} | {len(todos)} ({urgent_n} urgent) · "
                f"[ToDos]({c['meta']['todos_link']}) |"
            )
        lines.append("")
    else:
        urgent = [t for t in customer_todos + cross_todos if t.prioritaet.lower() == "urgent"]
        urgent.sort(key=_frist_sort_key)
        lines.append("## Alle urgent-To-dos")
        lines.append("")
        if urgent:
            for t in urgent:
                frist = t.frist.strip() if t.frist and "**" not in t.frist else "—"
                lines.append(f"- **{t.projekt or 'Querschnitt'}** — {t.aufgabe} _(Frist: {frist})_")
        else:
            lines.append("*Keine urgent-To-dos.*")
        lines.append("")
        lines.append("---")
        lines.append("")
        lines.append("## Welle 1 — Detail")
        lines.append("")
        for slug in WAVE1_SLUGS:
            c = customers_by_slug(customers, slug)
            lines.append(f"### {c['display_name']} {c['meta']['ampel']}")
            lines.append("")
            if c["meta"]["blocker"]:
                lines.append(f"**Blocker:** {c['meta']['blocker']}")
            if c["meta"]["audit_dates"]:
                lines.append(f"**Termine:** {', '.join(c['meta']['audit_dates'][:4])}")
            lines.append("")
            lines.append(f"- [Status]({c['meta']['status_link']}) · [To-dos]({c['meta']['todos_link']})")
            todos = _todos_for_slug(customer_todos, slug)
            todos.sort(key=lambda t: _prio_rank(t.prioritaet))
            for t in todos:
                lines.append(f"  - [{t.prioritaet}] {t.aufgabe[:100]}")
            lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("## Kunden-Radar")
    lines.append("")
    lines.append("| Ampel | Kunde | Termine | Offen |")
    lines.append("|-------|-------|---------|-------|")
    for c in customers:
        slug = c["slug"]
        n = len(_todos_for_slug(customer_todos, slug))
        terms = ", ".join(c["meta"]["audit_dates"][:3]) or "—"
        lines.append(
            f"| {c['meta']['ampel']} | **[{c['display_name']}]({c['meta']['status_link']})** "
            f"| {terms} | {n} |"
        )
    lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("## Querschnitt (nur Zähler)")
    lines.append("")
    cross_links = [
        ("Forderungen", "05_Forderungen", "Offene_Juni_2026.md"),
        ("Vertrieb", "04_Vertrieb", "Angebote_Juni_2026.md"),
        ("Software", "06_Software", "Software_Backlog_Juni_2026.md"),
        ("DFSS", "07_DFSS", "Pilot_Measurement_Juni_2026.md"),
    ]
    lines.append("| Bereich | Offen | Datei |")
    lines.append("|---------|-------|-------|")
    for label, folder, fname in cross_links:
        todos = [t for t in cross_todos if folder in t.file_path.replace("\\", "/")]
        if not todos and variant == "compact":
            continue
        link = f"../{folder}/{fname}"
        lines.append(f"| {label} | {len(todos)} | [{fname}]({link}) |")
    lines.append("")
    if variant == "full":
        for label, folder, _fname in cross_links:
            todos = [t for t in cross_todos if folder in t.file_path.replace("\\", "/")]
            if not todos:
                continue
            lines.append(f"### {label}")
            lines.append("")
            for t in todos:
                lines.append(f"- {t.aufgabe[:110]}")
            lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("## Briefing neu bauen")
    lines.append("")
    lines.append("```bash")
    lines.append("cd /Users/marwanmahra/cert-expert-ai")
    lines.append("python3 hq/scripts/build_dashboard.py")
    lines.append("```")
    lines.append("")
    if variant == "compact":
        lines.append("Später: Sprachnotiz → Telegram → HQ-Dateien → Script erneut.")
    lines.append("")
    return "\n".join(lines)


def customers_by_slug(customers: list[dict], slug: str) -> dict:
    for c in customers:
        if c["slug"] == slug:
            return c
    return {"display_name": slug, "slug": slug, "meta": _customer_meta(slug)}


def _build_overview(customers: list[dict], customer_todos: list[TodoItem]) -> str:
    lines = [
        "# Kundenübersicht — HQ",
        "",
        f"**Stand:** {date.today().isoformat()} (auto)",
        "",
        "Visuelle Einstiegsseite — springe in Status (1 Seite) statt in Roh-To-dos.",
        "",
        "| Kunde | Ampel | Nächste Termine | Offen | |",
        "|-------|-------|-----------------|-------|---|",
    ]
    for c in customers:
        slug = c["slug"]
        n = len([t for t in customer_todos if f"/{slug}/" in t.file_path.replace("\\", "/")])
        terms = ", ".join(c["meta"]["audit_dates"][:2]) or "—"
        s = c["meta"]["status_link"]
        a = f"../03_Kundenprojekte/{slug}/Audit_2026.md"
        lines.append(
            f"| **{c['display_name']}** | {c['meta']['ampel']} | {terms} | {n} | "
            f"[Status]({s}) · [Audit]({a}) |"
        )
    lines.extend(
        [
            "",
            "---",
            "",
            "→ Tagesfokus: [Tagesbriefing.md](Tagesbriefing.md)",
            "",
        ]
    )
    return "\n".join(lines)


def main() -> None:
    reg = json.loads(REGISTRY.read_text(encoding="utf-8"))
    customers = []
    for p in reg["projects"]:
        customers.append(
            {
                "slug": p["slug"],
                "display_name": p["display_name"],
                "meta": _customer_meta(p["slug"]),
            }
        )

    customer_todos: list[TodoItem] = []
    for p in KP.iterdir():
        if p.is_dir() and not p.name.startswith("_"):
            tf = p / "ToDos.md"
            if tf.exists():
                customer_todos.extend(_parse_todos(tf))

    cross_todos = _collect_todos_glob("04_Vertrieb/*.md")
    cross_todos += _collect_todos_glob("05_Forderungen/*.md")
    cross_todos += _collect_todos_glob("06_Software/*.md")
    cross_todos += _collect_todos_glob("07_DFSS/*.md")

    today = date.today()
    DASH.mkdir(parents=True, exist_ok=True)
    briefing = _build_briefing(
        customers, customer_todos, cross_todos, today, variant="compact"
    )
    briefing_full = _build_briefing(
        customers, customer_todos, cross_todos, today, variant="full"
    )
    overview = _build_overview(customers, customer_todos)
    snapshot = _build_operations_snapshot(customers, customer_todos, cross_todos, today)
    (DASH / "Tagesbriefing.md").write_text(briefing, encoding="utf-8")
    (DASH / "Tagesbriefing_VOLL.md").write_text(briefing_full, encoding="utf-8")
    (DASH / "Kunden_Uebersicht.md").write_text(overview, encoding="utf-8")
    (DASH / "operations_snapshot.md").write_text(snapshot, encoding="utf-8")
    print(f"Wrote {DASH / 'Tagesbriefing.md'}")
    print(f"Wrote {DASH / 'Tagesbriefing_VOLL.md'}")
    print(f"Wrote {DASH / 'Kunden_Uebersicht.md'}")
    print(f"Wrote {DASH / 'operations_snapshot.md'}")
    print(f"Open todos: {len(customer_todos)} customer + {len(cross_todos)} cross")


if __name__ == "__main__":
    main()
