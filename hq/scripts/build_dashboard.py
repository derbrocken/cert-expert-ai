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
    if not m:
        return None
    d, mo, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
    try:
        return date(y, mo, d)
    except ValueError:
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
    if audit_path.exists() and not meta["audit_dates"]:
        t = audit_path.read_text(encoding="utf-8")
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


def _prio_rank(p: str) -> int:
    return {"urgent": 0, "high": 1, "normal": 2, "low": 3}.get(p.lower(), 4)


def _build_briefing(
    customers: list[dict],
    customer_todos: list[TodoItem],
    cross_todos: list[TodoItem],
    today: date,
) -> str:
    lines = [
        "# Tagesbriefing — Cert-Expert HQ",
        "",
        f"**Generiert:** {today.isoformat()} {datetime.now().strftime('%H:%M')} (lokal)  ",
        "**Obsidian:** Leseansicht (siehe `WIE_NUTZEN.md` § Leseansicht) — nicht Bearbeiten-Modus.",
        "",
        "> **Dein Einstieg:** Nur diese Datei morgens öffnen.",
        "> Details pro Kunde über die Links — nicht alle ToDos.md durchsuchen.",
        "",
        "---",
        "",
        "## Heute im Fokus",
        "",
    ]

    # Audits in next 14 days
    horizon = []
    for c in customers:
        for ds in c["meta"]["audit_dates"]:
            d = _parse_date(ds)
            if d and (d - today).days <= 14 and (d - today).days >= -3:
                horizon.append((d, c["display_name"], ds, c["slug"]))
    # Dedupe same day/customer
    seen = set()
    deduped = []
    for item in sorted(horizon, key=lambda x: x[0]):
        key = (item[0], item[3])
        if key not in seen:
            seen.add(key)
            deduped.append(item)
    horizon = deduped
    if horizon:
        lines.append("### Audits & Fristen (nächste 14 Tage)")
        lines.append("")
        lines.append("| Datum | Kunde | Hinweis | Status |")
        lines.append("|-------|-------|---------|--------|")
        for d, name, ds, slug in horizon:
            rel = f"../03_Kundenprojekte/{slug}/Status.md"
            lines.append(f"| **{ds}** | [{name}]({rel}) | Audit/Termin | {customers_by_slug(customers, slug)['meta']['ampel']} |")
        lines.append("")
    else:
        lines.append("*Keine Audit-Termine in den Status-Dateien in den nächsten 14 Tagen gefunden.*")
        lines.append("")

    # Urgent todos
    urgent = [t for t in customer_todos + cross_todos if t.prioritaet.lower() == "urgent"]
    urgent.sort(key=lambda t: (_parse_date(t.frist) or date(2099, 1, 1), t.projekt))
    lines.append("### Dringend (Priorität urgent)")
    lines.append("")
    if urgent:
        for t in urgent[:15]:
            frist = t.frist.strip() if t.frist and "**" not in t.frist else "—"
            lines.append(f"- **{t.projekt or 'Querschnitt'}** — {t.aufgabe} _(Frist: {frist})_")
    else:
        lines.append("*Keine urgent-To-dos.*")
    lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("## Welle 1 — Kunden (Kurz)")
    lines.append("")
    wave1 = ["TeamFlex", "Wolf_Street", "SecuGuard"]
    for slug in wave1:
        c = customers_by_slug(customers, slug)
        open_n = len([t for t in customer_todos if t.projekt.replace(" ", "_") == slug or slug in t.file_path])
        lines.append(f"### {c['display_name']} {c['meta']['ampel']}")
        lines.append("")
        if c["meta"]["blocker"]:
            lines.append(f"**Blocker:** {c['meta']['blocker']}")
        if c["meta"]["audit_dates"]:
            lines.append(f"**Termine:** {', '.join(c['meta']['audit_dates'][:4])}")
        lines.append("")
        lines.append(f"- [Status]({c['meta']['status_link']}) · [To-dos]({c['meta']['todos_link']})")
        todos = [t for t in customer_todos if slug in t.file_path]
        todos.sort(key=lambda t: _prio_rank(t.prioritaet))
        for t in todos[:5]:
            lines.append(f"  - [{t.prioritaet}] {t.aufgabe[:90]}")
        if len(todos) > 5:
            lines.append(f"  - _+{len(todos) - 5} weitere in ToDos.md_")
        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("## Alle Kunden — Radar")
    lines.append("")
    lines.append("| Ampel | Kunde | Termine | Offene To-dos | Link |")
    lines.append("|-------|-------|---------|---------------|------|")
    for c in customers:
        slug = c["slug"]
        n = len([t for t in customer_todos if f"/{slug}/" in t.file_path.replace("\\", "/")])
        terms = ", ".join(c["meta"]["audit_dates"][:3]) or "—"
        lines.append(
            f"| {c['meta']['ampel']} | **{c['display_name']}** | {terms} | {n} | "
            f"[Status]({c['meta']['status_link']}) |"
        )
    lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("## Querschnitt")
    lines.append("")
    for label, pattern in [
        ("Forderungen", "05_Forderungen/*.md"),
        ("Vertrieb", "04_Vertrieb/*.md"),
        ("Software", "06_Software/*.md"),
        ("DFSS", "07_DFSS/*.md"),
    ]:
        todos = [t for t in cross_todos if pattern.split("/")[0] in t.file_path]
        if not todos:
            continue
        lines.append(f"### {label} ({len(todos)} offen)")
        for t in todos[:8]:
            lines.append(f"- {t.aufgabe[:100]}")
        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("## Aktion")
    lines.append("")
    lines.append("```bash")
    lines.append("# Briefing neu erzeugen (nach Updates in hq/):")
    lines.append("python3 hq/scripts/build_dashboard.py")
    lines.append("```")
    lines.append("")
    lines.append("Später: Sprachnotiz → Telegram → gleiche To-do-Dateien → Briefing neu bauen.")
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
    briefing = _build_briefing(customers, customer_todos, cross_todos, today)
    overview = _build_overview(customers, customer_todos)
    (DASH / "Tagesbriefing.md").write_text(briefing, encoding="utf-8")
    (DASH / "Kunden_Uebersicht.md").write_text(overview, encoding="utf-8")
    print(f"Wrote {DASH / 'Tagesbriefing.md'}")
    print(f"Wrote {DASH / 'Kunden_Uebersicht.md'}")
    print(f"Open todos: {len(customer_todos)} customer + {len(cross_todos)} cross")


if __name__ == "__main__":
    main()
