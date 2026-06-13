#!/usr/bin/env python3
"""Generate HQ dashboard files from hq/ markdown sources.

- ARBEITSUEBERSICHT.md — daily work (subset + Mein Tag)
- BACKLOG.md — full mirror of all open todos (generated)
- 00_Dashboard/BACKLOG.md — Pflege-Block (user-edited) + Build-Spiegel Kunden/Querschnitt
- 00_Dashboard/EINGANG.md — Rohnotizen (nicht im Build, Transfer per Chat)
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import date, datetime, timedelta
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
    evidence_id: str = ""
    rohinput: str = ""


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
        if status in ("done", "cancelled", "merged"):
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
                evidence_id=fields.get("Evidence ID", "").strip(),
                rohinput=fields.get("Rohinput", "").strip(),
            )
        )
    return items


def _parse_todos_all(path: Path) -> list[TodoItem]:
    """Alle Blöcke inkl. erledigt — für BACKLOG-Spiegel mit [x]."""
    text = path.read_text(encoding="utf-8")
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
                naechster_schritt=fields.get(
                    "Nächster Schritt", fields.get("Naechster Schritt", "")
                ),
                file_path=str(path.relative_to(HQ.parent)),
                section="Offen",
                evidence_id=fields.get("Evidence ID", "").strip(),
                rohinput=fields.get("Rohinput", "").strip(),
            )
        )
    return items


def _collect_todos_glob(pattern: str) -> list[TodoItem]:
    out: list[TodoItem] = []
    for p in sorted(HQ.glob(pattern)):
        if p.is_file() and p.suffix == ".md":
            out.extend(_parse_todos(p))
    return out


def _collect_todos_glob_all(pattern: str) -> list[TodoItem]:
    out: list[TodoItem] = []
    for p in sorted(HQ.glob(pattern)):
        if p.is_file() and p.suffix == ".md":
            out.extend(_parse_todos_all(p))
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
    tomorrow = today + timedelta(days=1)
    lines = [
        f"# Tagesbriefing{' — Vollständig' if variant == 'full' else ''} — Cert-Expert HQ",
        "",
        f"**Generiert:** {today.isoformat()} {datetime.now().strftime('%H:%M')} (lokal)  ",
        f"**Heute:** {today.strftime('%d.%m.%Y')} · **Morgen:** {tomorrow.strftime('%d.%m.%Y')}  ",
        "**Obsidian:** Leseansicht (siehe `WIE_NUTZEN.md`) — Buch-Symbol oder **Cmd+E**.",
        "",
    ]
    if variant == "compact":
        lines.extend(
            [
                "> **Morgens:** [ARBEITSUEBERSICHT.md](ARBEITSUEBERSICHT.md) · Ampeln: [Kunden_Uebersicht.md](Kunden_Uebersicht.md)",
                "> **Wöchentlich / Planung:** [Tagesbriefing_VOLL.md](Tagesbriefing_VOLL.md)",
                "> **Eingang:** [EINGANG.md](EINGANG.md)",
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


ARBEITS_PATH = DASH / "ARBEITSUEBERSICHT.md"
BACKLOG_MASTER_PATH = DASH / "BACKLOG.md"
EINGANG_PATH = DASH / "EINGANG.md"
BACKLOG_PFLEGE_START = "<!-- hq:pflege -->"
BACKLOG_PFLEGE_END = "<!-- /hq:pflege -->"
BACKLOG_AUTO_START = "<!-- hq:auto -->"
BACKLOG_AUTO_END = "<!-- /hq:auto -->"
LEGACY_NOTIZEN_PATHS = (
    HQ / "01_Notizblock" / "NOTIZEN.md",
    HQ / "01_Notizblock" / "EINGANG.md",
    HQ / "01_Master_Dump" / "NOTIZEN.md",
    HQ / "01_Master_Dump" / "BACKLOG_MANUAL.md",
)
# Nicht in der Arbeitsübersicht (Bot-Pipeline — stehen im Inventar)
ARBEITS_SKIP_SHORT_IDS = frozenset({"sr01", "sr02", "sr03"})
# Evidence-Nachweise aus Ops-Board/Migration → Abschnitt „DFSS / Pilot“ (nicht Tagesliste)
ARBEITS_DFSS_SHORT_IDS = frozenset({"ws04", "ws05"})
COMM_KATEGORIEN = frozenset({"kundenkommunikation", "kommunikation"})
BACKLOG_INVENTAR_ORDER = (
    "Privat / Life Admin",
    "Cert-Expert — Prozess & QM (mit Hajar)",
    "Vertrieb · Angebote · Kunden",
    "Dokumentation · ISO · Vorlagen · Website",
    "Intern · Software · Cloud",
    "Geparkt — not now",
)
BACKLOG_SKIP_SECTIONS = frozenset({"Backlog 44 — Nummern-Referenz (Original)"})
BACKLOG_ARBEITS_SECTIONS = tuple(s for s in BACKLOG_INVENTAR_ORDER if s != "Geparkt — not now")
# Vollliste nur in BACKLOG.md — später Dashboard mit Pins; nicht in ARBEITSUEBERSICHT
ARBEITS_INCLUDE_PFLEGE_BACKLOG = False
CHECKBOX_LINE = re.compile(
    r"^- \[( |x)\] (.+?)(?:\s+<!--\s*([a-zA-Z0-9_-]+)\s*-->)?\s*$",
    re.I,
)
TASK_TABLE_ROW = re.compile(
    r"^\|\s*\[( |x)\]\s*\|\s*([^|]*?)\s*\|\s*([^|]+?)\s*(?:<!--\s*([a-zA-Z0-9_-]+)\s*-->)?\s*\|\s*$",
    re.I,
)
CUSTOMER_TASK_TABLE_ROW = re.compile(
    r"^\|\s*\[( |x)\]\s*\|\s*([^|]*?)\s*\|\s*([^|]+?)\s*(?:<!--\s*([a-zA-Z0-9_-]+)\s*-->)?\s*\|\s*([^|]*)\|\s*$",
    re.I,
)


def _todo_short_id(todo_id: str) -> str:
    if todo_id.startswith("TODO-"):
        return todo_id.split("-")[-1]
    return todo_id


def _backlog_line_id(text: str, existing_id: str | None = None) -> str:
    if existing_id:
        return existing_id
    import hashlib

    return "bk-" + hashlib.md5(text.encode()).hexdigest()[:8]


def _ensure_eingang() -> None:
    if EINGANG_PATH.exists():
        return
    legacy_eingang = HQ / "01_Notizblock" / "EINGANG.md"
    if legacy_eingang.exists():
        EINGANG_PATH.write_text(legacy_eingang.read_text(encoding="utf-8"), encoding="utf-8")
        return
    EINGANG_PATH.write_text(
        "\n".join(
            [
                "# Eingang — Rohnotizen",
                "",
                "Kurz parken. Erst ins [BACKLOG.md](BACKLOG.md) (**Pflege — Backlog**),",
                "oder im HQ-Chat: „Bitte Zeile X ins Backlog.“",
                "",
                "- ",
                "",
            ]
        ),
        encoding="utf-8",
    )


def _extract_pflege_from_legacy_backlog(text: str) -> str:
    lines = text.splitlines()
    start: int | None = None
    end: int | None = None
    for i, line in enumerate(lines):
        if re.match(r"^## [4-9]\.\s+", line):
            if start is None:
                start = i
        if start is not None and re.match(r"^## 10\.\s+DFSS", line):
            end = i
            break
        if (
            start is not None
            and line.strip() == "---"
            and i + 1 < len(lines)
            and lines[i + 1].strip().startswith("**Summe")
        ):
            end = i
            break
    if start is None:
        return ""
    chunk = lines[start : end if end is not None else len(lines)]
    out: list[str] = []
    for line in chunk:
        m = re.match(r"^## \d+\.\s+(.+)$", line)
        out.append(f"## {m.group(1)}" if m else line)
    return "\n".join(out).strip()


def _load_legacy_notizen_body() -> str:
    for path in LEGACY_NOTIZEN_PATHS:
        if not path.exists():
            continue
        lines: list[str] = []
        in_body = False
        for line in path.read_text(encoding="utf-8").splitlines():
            if line.startswith("## "):
                in_body = True
            if in_body:
                lines.append(line)
        body = "\n".join(lines).strip()
        if body:
            return body
    return ""


def _load_backlog_pflege_body() -> str:
    if BACKLOG_MASTER_PATH.exists():
        text = BACKLOG_MASTER_PATH.read_text(encoding="utf-8")
        if BACKLOG_PFLEGE_START in text and BACKLOG_PFLEGE_END in text:
            s = text.index(BACKLOG_PFLEGE_START) + len(BACKLOG_PFLEGE_START)
            e = text.index(BACKLOG_PFLEGE_END)
            body = text[s:e].strip()
            if body.startswith("## Pflege — Backlog"):
                body = "\n".join(body.splitlines()[2:]).strip()
            return body
        legacy = _extract_pflege_from_legacy_backlog(text)
        if legacy:
            return legacy
    notizen = _load_legacy_notizen_body()
    if notizen:
        return notizen
    return "## Privat / Life Admin\n\n- [ ] \n"


def _wrap_backlog_pflege(body: str) -> str:
    body = body.strip()
    if body.startswith("## Pflege — Backlog"):
        inner = "\n".join(body.splitlines()[2:]).strip()
    else:
        inner = body
    return "\n".join(
        [
            BACKLOG_PFLEGE_START,
            "## Pflege — Backlog",
            "",
            inner,
            "",
            BACKLOG_PFLEGE_END,
        ]
    )


def _parse_checkbox_state(text: str) -> dict[str, bool]:
    checked: dict[str, bool] = {}
    for line in text.splitlines():
        stripped = line.strip()
        m = CHECKBOX_LINE.match(stripped)
        if m and m.group(3):
            checked[m.group(3)] = m.group(1).lower() == "x"
            continue
        tm = TASK_TABLE_ROW.match(stripped)
        if tm and tm.group(4):
            checked[tm.group(4)] = tm.group(1).lower() == "x"
            continue
        cm = CUSTOMER_TASK_TABLE_ROW.match(stripped)
        if cm and cm.group(4):
            checked[cm.group(4)] = cm.group(1).lower() == "x"
    return checked


def _merge_checked(*parts: dict[str, bool]) -> dict[str, bool]:
    out: dict[str, bool] = {}
    for d in parts:
        for k, v in d.items():
            if v:
                out[k] = True
            elif k not in out:
                out[k] = v
    return out


def _checked_from_done_sources() -> dict[str, bool]:
    """Erledigt in ToDos.md / Querschnitt → [x] im Spiegel auch ohne gespeicherte Arbeitsliste."""
    out: dict[str, bool] = {}
    for path in _collect_todo_source_files():
        for t in _parse_todos_all(path):
            if t.status.lower() in ("done", "cancelled", "merged"):
                out[_todo_short_id(t.todo_id)] = True
    return out


def _merged_checked_states() -> dict[str, bool]:
    """Nur Arbeitsübersicht + Pflege-Backlog → ToDos (Spiegel ist Ausgabe, kein Sync-Eingang)."""
    parts: list[dict[str, bool]] = []
    if ARBEITS_PATH.exists():
        c, _, _, _ = _parse_arbeitsuebersicht_state(
            ARBEITS_PATH.read_text(encoding="utf-8")
        )
        parts.append(c)
    if BACKLOG_MASTER_PATH.exists():
        parts.append(_parse_checkbox_state(_load_backlog_pflege_body()))
    return _merge_checked(*parts) if parts else {}


def _collect_todo_source_files() -> list[Path]:
    paths: list[Path] = []
    for p in KP.iterdir():
        if p.is_dir() and not p.name.startswith("_"):
            tf = p / "ToDos.md"
            if tf.exists():
                paths.append(tf)
    for pattern in ("04_Vertrieb/*.md", "05_Forderungen/*.md", "06_Software/*.md", "07_DFSS/*.md"):
        paths.extend(sorted(HQ.glob(pattern)))
    return [p for p in paths if p.is_file()]


def _mark_todo_done_by_short_id(short_id: str) -> bool:
    for path in _collect_todo_source_files():
        text = path.read_text(encoding="utf-8")
        blocks = re.split(r"(?=^## TODO-)", text, flags=re.M)
        new_blocks: list[str] = []
        changed = False
        for block in blocks:
            if not block.strip().startswith("## TODO-"):
                new_blocks.append(block)
                continue
            m = TODO_BLOCK.search(block)
            if not m or _todo_short_id(m.group(1)) != short_id:
                new_blocks.append(block)
                continue
            if re.search(r"^- \*\*Status:\*\*\s*done\b", block, re.M | re.I):
                new_blocks.append(block)
                continue
            block = re.sub(
                r"(^- \*\*Status:\*\*\s*).*$",
                r"\1done",
                block,
                count=1,
                flags=re.M,
            )
            changed = True
            new_blocks.append(block)
        if changed:
            path.write_text("".join(new_blocks), encoding="utf-8")
            return True
    return False


def _parse_backlog_spiegel_checked(text: str) -> dict[str, bool]:
    if BACKLOG_AUTO_START not in text or BACKLOG_AUTO_END not in text:
        return {}
    s = text.index(BACKLOG_AUTO_START) + len(BACKLOG_AUTO_START)
    e = text.index(BACKLOG_AUTO_END)
    return _parse_checkbox_state(text[s:e])


def _rewrite_checkbox_mark_in_text(text: str, short_id: str, done: bool) -> tuple[str, bool]:
    """Spiegel-Zeilen in Arbeitsübersicht / Backlog ([x] vs [ ]) an ToDo-Status koppeln."""
    want = "x" if done else " "
    changed = False
    lines_out: list[str] = []
    for line in text.splitlines():
        stripped = line.strip()
        new_line = line
        m = CHECKBOX_LINE.match(stripped)
        if m and m.group(3) == short_id:
            if m.group(1).lower() != want:
                changed = True
            new_line = f"- [{want}] {m.group(2).strip()} <!-- {short_id} -->"
        else:
            tm = TASK_TABLE_ROW.match(stripped)
            if tm and tm.group(4) == short_id:
                if tm.group(1).lower() != want:
                    changed = True
                new_line = re.sub(
                    r"^\|\s*\[( |x)\]",
                    f"| [{want}]",
                    stripped,
                    count=1,
                    flags=re.I,
                )
            else:
                cm = CUSTOMER_TASK_TABLE_ROW.match(stripped)
                if cm and cm.group(4) == short_id:
                    if cm.group(1).lower() != want:
                        changed = True
                    new_line = re.sub(
                        r"^\|\s*\[( |x)\]",
                        f"| [{want}]",
                        stripped,
                        count=1,
                        flags=re.I,
                    )
        lines_out.append(new_line)
    return "\n".join(lines_out), changed


def _set_dashboard_checkbox_mirrors(short_id: str, done: bool) -> None:
    if ARBEITS_PATH.exists():
        text = ARBEITS_PATH.read_text(encoding="utf-8")
        new_text, changed = _rewrite_checkbox_mark_in_text(text, short_id, done)
        if changed:
            ARBEITS_PATH.write_text(new_text, encoding="utf-8")
    if BACKLOG_MASTER_PATH.exists():
        text = BACKLOG_MASTER_PATH.read_text(encoding="utf-8")
        if BACKLOG_AUTO_START in text and BACKLOG_AUTO_END in text:
            s = text.index(BACKLOG_AUTO_START) + len(BACKLOG_AUTO_START)
            e = text.index(BACKLOG_AUTO_END)
            mid = text[s:e]
            new_mid, changed = _rewrite_checkbox_mark_in_text(mid, short_id, done)
            if changed:
                BACKLOG_MASTER_PATH.write_text(
                    text[:s] + new_mid + text[e:],
                    encoding="utf-8",
                )


SLUG_SHORT_PREFIX: dict[str, str] = {
    "TeamFlex": "tf",
    "Wolf_Street": "ws",
    "Schutzritter": "sr",
    "LC_Security": "lc",
    "Checkpoint_Regional": "cr",
    "ZT_Security": "zt",
    "SecuGuard": "sg",
}


def _slug_short_prefix(slug: str) -> str:
    if slug in SLUG_SHORT_PREFIX:
        return SLUG_SHORT_PREFIX[slug]
    parts = [p for p in re.split(r"[_\s]+", slug) if p]
    return "".join(p[0].lower() for p in parts[:2]) or "td"


def _next_todo_block_id(todos_path: Path, slug: str) -> str:
    prefix = _slug_short_prefix(slug)
    max_n = 0
    text = todos_path.read_text(encoding="utf-8")
    for m in TODO_BLOCK.finditer(text):
        sid = _todo_short_id(m.group(1))
        rm = re.fullmatch(re.escape(prefix) + r"(\d+)", sid, re.I)
        if rm:
            max_n = max(max_n, int(rm.group(1)))
    today = date.today().strftime("%Y%m%d")
    return f"TODO-{today}-{prefix}{max_n + 1:02d}"


def _insert_todo_block_after_offen(text: str, block: str) -> str:
    m = re.search(r"(^## Offen\s*\n)(?:---\s*\n)?", text, re.M)
    if m:
        pos = m.end()
        return text[:pos] + block.rstrip() + "\n\n" + text[pos:].lstrip("\n")
    if "## Offen" in text:
        pos = text.index("## Offen") + len("## Offen")
        return text[:pos] + "\n\n" + block.rstrip() + "\n\n" + text[pos:].lstrip("\n")
    return text.rstrip() + "\n\n" + block.rstrip() + "\n"


def _format_new_todo_block(
    todo_id: str,
    slug: str,
    aufgabe: str,
    *,
    frist: str = "",
    kategorie: str = "Intern / Allgemein",
    prioritaet: str = "normal",
) -> str:
    parsed = _parse_date(frist.strip()) if frist and frist.strip() else None
    iso_frist = parsed.isoformat() if parsed else ""
    if not parsed and not frist.strip():
        iso_frist = _default_provisional_frist(date.today())
    created = datetime.now().astimezone().isoformat(timespec="seconds")
    lines = [
        f"## {todo_id}",
        "",
        f"- **Aufgabe:** {aufgabe.strip()}",
        f"- **Projekt:** {slug}",
        f"- **Kategorie:** {kategorie}",
        "- **Verantwortlich:** (unassigned)",
        f"- **Frist:** {iso_frist}",
        "- **Status:** open",
        f"- **Priorität:** {prioritaet}",
        "- **Quelle:** dashboard",
        "- **Nächster Schritt:** (eintragen)",
        f"- **Erstellt:** {created}",
        "- **Rohinput:** Dashboard — manuell angelegt",
    ]
    if iso_frist:
        lines.append(f"- **Due date:** {iso_frist}")
    return "\n".join(lines)


def add_customer_todo(
    slug: str,
    aufgabe: str,
    *,
    frist: str = "",
    kategorie: str = "Intern / Allgemein",
    prioritaet: str = "normal",
    add_to_overview: bool = True,
) -> dict[str, str]:
    """Neues To-do in ToDos.md; optional direkt in PINS-Übersicht."""
    aufgabe = aufgabe.strip()
    if not aufgabe:
        raise ValueError("Aufgabe fehlt")
    todos_path = KP / slug / "ToDos.md"
    if not todos_path.is_file():
        raise FileNotFoundError(f"Kein ToDos.md für {slug}")
    todo_id = _next_todo_block_id(todos_path, slug)
    block = _format_new_todo_block(
        todo_id,
        slug,
        aufgabe,
        frist=frist,
        kategorie=kategorie,
        prioritaet=prioritaet,
    )
    text = todos_path.read_text(encoding="utf-8")
    todos_path.write_text(_insert_todo_block_after_offen(text, block), encoding="utf-8")
    short_id = _todo_short_id(todo_id)
    if add_to_overview:
        from pins_store import toggle_selected  # noqa: PLC0415

        toggle_selected(short_id, on=True)
    return {"id": short_id, "todo_id": todo_id, "slug": slug}


def _mark_todo_open_by_short_id(short_id: str) -> bool:
    for path in _collect_todo_source_files():
        text = path.read_text(encoding="utf-8")
        blocks = re.split(r"(?=^## TODO-)", text, flags=re.M)
        new_blocks: list[str] = []
        changed = False
        for block in blocks:
            if not block.strip().startswith("## TODO-"):
                new_blocks.append(block)
                continue
            m = TODO_BLOCK.search(block)
            if not m or _todo_short_id(m.group(1)) != short_id:
                new_blocks.append(block)
                continue
            if re.search(
                r"^- \*\*Status:\*\*\s*(?:open|merged|cancelled)\b",
                block,
                re.M | re.I,
            ):
                new_blocks.append(block)
                continue
            block = re.sub(
                r"(^- \*\*Status:\*\*\s*).*$",
                r"\1open",
                block,
                count=1,
                flags=re.M,
            )
            changed = True
            new_blocks.append(block)
        if changed:
            path.write_text("".join(new_blocks), encoding="utf-8")
            return True
    return False


def _sync_spiegel_unchecks_to_sources(spiegel: dict[str, bool]) -> None:
    """[ ] im Backlog-Spiegel → Status wieder open (nicht bei merged)."""
    for sid, is_done in spiegel.items():
        if is_done or sid.startswith("bk-"):
            continue
        _mark_todo_open_by_short_id(sid)


def _apply_spiegel_to_checked(
    checked: dict[str, bool], spiegel: dict[str, bool]
) -> dict[str, bool]:
    """Spiegel-[ ] überschreibt noch gespeicherte [x] in der Arbeitsübersicht."""
    out = dict(checked)
    for sid, is_done in spiegel.items():
        if sid.startswith("bk-"):
            continue
        if not is_done:
            out[sid] = False
    return out


def _sync_checked_to_sources(
    checked: dict[str, bool], *, spiegel: dict[str, bool] | None = None
) -> None:
    for sid, is_done in checked.items():
        if not is_done or sid.startswith("bk-"):
            continue
        if spiegel is not None and sid in spiegel and not spiegel[sid]:
            continue
        _mark_todo_done_by_short_id(sid)


def _apply_checked_to_pflege_body(pflege_body: str, checked: dict[str, bool]) -> str:
    lines: list[str] = []
    for line in pflege_body.splitlines():
        m = CHECKBOX_LINE.match(line.strip())
        if not m:
            lines.append(line)
            continue
        bid = m.group(3) or _backlog_line_id(m.group(2).strip(), None)
        if checked.get(bid) and m.group(1).lower() != "x":
            lines.append(f"- [x] {m.group(2).strip()} <!-- {bid} -->")
        elif not m.group(3):
            lines.append(f"- [{m.group(1)}] {m.group(2).strip()} <!-- {bid} -->")
        else:
            lines.append(line)
    return "\n".join(lines)


def _parse_backlog_sections() -> dict[str, list[tuple[str, str]]]:
    """section title -> [(checkbox text, id)] open only (Pflege-Block in BACKLOG.md)."""
    out: dict[str, list[tuple[str, str]]] = {}
    section = "_"
    for line in _load_backlog_pflege_body().splitlines():
        if line.startswith("## "):
            section = line[3:].strip()
            out.setdefault(section, [])
            continue
        m = CHECKBOX_LINE.match(line.strip())
        if not m or m.group(1).lower() == "x":
            continue
        text = m.group(2).strip()
        if not text:
            continue
        out.setdefault(section, []).append((text, _backlog_line_id(text, m.group(3))))
    return out


def _parse_arbeitsuebersicht_state(
    text: str,
) -> tuple[dict[str, bool], list[str], list[str], list[str]]:
    checked: dict[str, bool] = {}
    mein_tag: list[str] = []
    manual: list[str] = []
    privat_backlog: list[str] = []
    section: str | None = None
    for line in text.splitlines():
        if line.startswith("## Mein Tag"):
            section = "mein_tag"
            continue
        if line.startswith("## Kunden"):
            section = "kunden"
            continue
        if line.startswith("## Privat"):
            section = "privat"
            continue
        if line.startswith("### Manuell") or line.startswith("## Manuell"):
            section = "manuell"
            continue
        if line.startswith("## "):
            section = "sonstiges"
            continue
        if line.startswith("### "):
            section = "sonstiges"
            continue
        stripped = line.strip()
        m = CHECKBOX_LINE.match(stripped)
        if m:
            cid = m.group(3)
            if cid:
                checked[cid] = m.group(1).lower() == "x"
            elif section == "mein_tag":
                mein_tag.append(line)
            elif section in ("manuell", "privat"):
                privat_backlog.append(line)
            continue
        tm = TASK_TABLE_ROW.match(stripped)
        if tm and tm.group(4):
            checked[tm.group(4)] = tm.group(1).lower() == "x"
            continue
        cm = CUSTOMER_TASK_TABLE_ROW.match(stripped)
        if cm and cm.group(4):
            checked[cm.group(4)] = cm.group(1).lower() == "x"
            continue
        if section == "mein_tag" and line.strip() and not line.startswith("#"):
            mein_tag.append(line)
    return checked, mein_tag, manual, privat_backlog


def _is_kommunikation_todo(t: TodoItem) -> bool:
    return t.kategorie.strip().lower() in COMM_KATEGORIEN


def _todo_is_done(t: TodoItem, checked: dict[str, bool], short_id: str) -> bool:
    if checked.get(short_id):
        return True
    return t.status.lower() in ("done", "cancelled", "merged")


def _checkbox_line(
    aufgabe: str,
    short_id: str,
    checked: dict[str, bool],
    *,
    frist: str = "",
    todo_status: str = "open",
) -> str:
    mark = (
        "x"
        if checked.get(short_id) or todo_status.lower() in ("done", "cancelled", "merged")
        else " "
    )
    suffix = ""
    if frist and frist.strip() and "**" not in frist:
        suffix = f" _(bis {frist.strip()})_"
    return f"- [{mark}] {aufgabe.strip()}{suffix} <!-- {short_id} -->"


def _format_bis_cell(frist: str, today: date, *, with_horizon: bool = False) -> str:
    raw = (frist or "").strip()
    if not raw or "**" in raw:
        return "—"
    d = _parse_date(raw)
    if d:
        label = d.strftime("%d.%m.")
        delta = (d - today).days
        if with_horizon:
            horizon = _days_until_label(d, today)
            if delta < 0:
                return f"**{label}** · {horizon}"
            return f"{label} · {horizon}"
        if delta < 0:
            return f"**{label}**"
        return label
    return raw[:12]


def _checkable_task_line(
    t: TodoItem,
    checked: dict[str, bool],
    today: date,
    *,
    with_horizon: bool = False,
    show_bis: bool = True,
    show_evidence: bool = False,
) -> str:
    """Obsidian-Checkbox-Liste (Tabellen-[ ] sind in der Leseansicht oft nur Klammern)."""
    sid = _todo_short_id(t.todo_id)
    mark = (
        "x"
        if checked.get(sid) or t.status.lower() in ("done", "cancelled", "merged")
        else " "
    )
    aufgabe = t.aufgabe.strip()
    if show_evidence and t.evidence_id:
        aufgabe = f"{aufgabe} `{t.evidence_id}`"
    if not show_bis:
        return f"- [{mark}] {aufgabe} <!-- {sid} -->"
    bis = _format_bis_cell(t.frist, today, with_horizon=with_horizon)
    if bis == "—":
        return f"- [{mark}] {aufgabe} <!-- {sid} -->"
    if "**" not in bis:
        bis = f"**{bis}**"
    return f"- [{mark}] {bis} — {aufgabe} <!-- {sid} -->"


def _render_checkable_list(
    items: list[TodoItem],
    checked: dict[str, bool],
    today: date,
    *,
    with_horizon: bool = False,
    show_bis: bool = True,
    show_evidence: bool = False,
    empty_label: str = "_(leer)_",
) -> list[str]:
    if not items:
        return [f"- [ ] {empty_label}"]
    return [
        _checkable_task_line(
            t,
            checked,
            today,
            with_horizon=with_horizon,
            show_bis=show_bis,
            show_evidence=show_evidence,
        )
        for t in items
    ]


def _todo_goes_dfss_arbeits(t: TodoItem) -> bool:
    return _todo_short_id(t.todo_id) in ARBEITS_DFSS_SHORT_IDS


def _split_tages_dfss(
    todos: list[TodoItem],
) -> tuple[list[TodoItem], list[TodoItem]]:
    tages: list[TodoItem] = []
    dfss: list[TodoItem] = []
    for t in todos:
        sid = _todo_short_id(t.todo_id)
        if sid in ARBEITS_SKIP_SHORT_IDS:
            continue
        if _todo_goes_dfss_arbeits(t):
            dfss.append(t)
        else:
            tages.append(t)
    return tages, dfss


def _clean_mein_tag_lines(lines: list[str]) -> list[str]:
    """Alte Build-Artefakte (leere ---) nicht in Mein Tag zurückschreiben."""
    out: list[str] = []
    for line in lines:
        if line.strip() == "---":
            continue
        out.append(line)
    return out


def _default_mein_tag_block() -> list[str]:
    return [
        "<!-- Pins: - [ ] **Bis** — Aufgabe <!-- ws09 --> · Vollliste → BACKLOG.md -->",
        "",
        "- [ ] ",
        "",
    ]


def _mein_tag_has_legacy_table(lines: list[str]) -> bool:
    """Tabellen-| [ ]| rendern in Obsidian keine echten Checkboxen."""
    for ln in lines:
        s = ln.strip()
        if s.startswith("|") and ("[ ]" in s or "[x]" in s.lower()):
            return True
    return False


def _mein_tag_is_placeholder(lines: list[str]) -> bool:
    """Nur leerer Stub aus altem Build → durch Checkbox-Liste ersetzen."""
    substantive = [
        ln
        for ln in lines
        if ln.strip() and not ln.strip().startswith("<!--")
    ]
    if not substantive:
        return True
    if len(substantive) > 2:
        return False
    for ln in substantive:
        stripped = ln.strip()
        if stripped in ("- [ ]", "- [x]"):
            continue
        m = CHECKBOX_LINE.match(stripped)
        if m and not m.group(3) and not m.group(2).strip():
            continue
        tm = TASK_TABLE_ROW.match(stripped)
        if tm and not tm.group(4) and not tm.group(3).strip():
            continue
        if stripped.startswith("| [") and "|" in stripped[2:]:
            continue
        return False
    return True


def _sort_todos(items: list[TodoItem]) -> list[TodoItem]:
    return sorted(items, key=lambda t: (_prio_rank(t.prioritaet), _frist_sort_key(t)))


def _sort_todos_backlog(items: list[TodoItem]) -> list[TodoItem]:
    """Offen zuerst, erledigt unten."""
    return sorted(
        items,
        key=lambda t: (
            1 if t.status.lower() in ("done", "cancelled", "merged") else 0,
            _prio_rank(t.prioritaet),
            _frist_sort_key(t),
        ),
    )


def _cross_bucket(t: TodoItem) -> str:
    fp = t.file_path.replace("\\", "/")
    if "05_Forderungen" in fp:
        return "forderungen"
    if "04_Vertrieb" in fp:
        return "vertrieb"
    return "intern"


def _customer_board_sort(customers: list[dict]) -> list[dict]:
    def key(c: dict) -> tuple:
        dates = [_parse_date(ds) for ds in c["meta"]["audit_dates"]]
        dates = [d for d in dates if d]
        return (min(dates) if dates else date(2099, 12, 31), c["display_name"])

    return sorted(customers, key=key)


def _days_until_label(d: date, today: date) -> str:
    delta = (d - today).days
    if delta < 0:
        return f"vor {abs(delta)} Tagen"
    if delta == 0:
        return "heute"
    if delta == 1:
        return "noch 1 Tag"
    return f"noch {delta} Tagen"


def _format_customer_audit_terms(meta: dict, today: date) -> str:
    parts: list[str] = []
    for ds in meta.get("audit_dates", [])[:3]:
        raw = (ds or "").strip()
        if not raw or raw.lower() in ("—", "tbd", "nicht erfasst"):
            continue
        d = _parse_date(raw)
        if d:
            parts.append(f"{raw} ({_days_until_label(d, today)})")
        else:
            parts.append(raw)
    return ", ".join(parts) if parts else "—"


def _build_arbeitsuebersicht(
    customers: list[dict],
    customer_todos: list[TodoItem],
    cross_todos: list[TodoItem],
    today: date,
    checked: dict[str, bool],
) -> str:
    existing = ARBEITS_PATH.read_text(encoding="utf-8") if ARBEITS_PATH.exists() else ""
    _, mein_tag, manual, privat_saved = _parse_arbeitsuebersicht_state(existing)
    mein_tag = _clean_mein_tag_lines(mein_tag)
    backlog_secs = _parse_backlog_sections()

    lines = [
        "# Arbeitsübersicht — Cert-Expert HQ",
        "",
        f"**Stand:** {today.isoformat()} · **Tagesarbeit = Mein Tag** (Pins).",
        "",
        "Vollliste & Ideen: [BACKLOG.md](BACKLOG.md) · Ampeln: [Kunden_Uebersicht.md](Kunden_Uebersicht.md) · Rohnotiz: [EINGANG.md](EINGANG.md)",
        "",
        "> **Abhaken:** **Mein Tag**, **Kunden** (volle Liste), **Sonstiges** → speichern → Build (sync per ID).",
        "> **Format:** Obsidian-Checkboxen (`- [ ]`). **Kunden:** Resttage nur in der **Überschrift** (Audit-Termin), darunter nur Aufgaben.",
        "> **Sonstiges:** **Bis** + Aufgabe. Vollliste: [BACKLOG.md](BACKLOG.md).",
        "",
        "---",
        "",
        "## Mein Tag",
        "",
    ]
    if (
        mein_tag
        and not _mein_tag_is_placeholder(mein_tag)
        and not _mein_tag_has_legacy_table(mein_tag)
    ):
        lines.extend(mein_tag)
        if not mein_tag[-1].endswith("\n") and mein_tag:
            lines.append("")
    else:
        lines.extend(_default_mein_tag_block())
    if manual:
        lines.append("<!-- Aus früherem Block Manuell — bitte nach oben in Mein Tag verschieben -->")
        lines.extend(_clean_mein_tag_lines(manual))
        lines.append("")

    lines.extend(
        [
            "---",
            "",
            "## Kunden — Projekte",
            "",
            "> Volle Liste — `- [ ]` Aufgabe (Frist/Countdown nur in der Überschrift darüber)",
            "",
        ]
    )
    dfss_by_slug: dict[str, list[TodoItem]] = {}
    for c in _customer_board_sort(customers):
        slug = c["slug"]
        todos = _sort_todos(_todos_for_slug(customer_todos, slug))
        tages, dfss = _split_tages_dfss(todos)
        if dfss:
            dfss_by_slug[slug] = dfss
        terms = _format_customer_audit_terms(c["meta"], today)
        amp = c["meta"]["ampel"].strip() or "—"
        n_open = len(tages)
        todos_link = c["meta"]["todos_link"]
        status_link = c["meta"]["status_link"]
        lines.append(f"### {c['display_name']} · {amp} · {terms}")
        lines.append("")
        lines.append(
            f"**{n_open} offen** · [Status]({status_link}) · [To-dos]({todos_link})"
        )
        lines.append("")
        if tages:
            lines.extend(
                _render_checkable_list(
                    tages,
                    checked,
                    today,
                    show_bis=False,
                    empty_label="_(keine offenen To-dos)_",
                )
            )
        elif dfss:
            lines.append("_Nur DFSS-Nachweise offen — siehe Abschnitt DFSS unten._")
        else:
            lines.extend(
                _render_checkable_list(
                    [],
                    checked,
                    today,
                    show_bis=False,
                    empty_label="_(keine offenen To-dos)_",
                )
            )
        lines.append("")

    lines.extend(
        [
            "---",
            "",
            "## DFSS / Pilot — Evidence & laufende Arbeit",
            "",
            "> **ws04** u. ä. stammen aus Ops-Board/Migration (`Evidence ID` in `ToDos.md`), nicht aus der Tagesliste.",
            "> Pflege & Kontext: [`../07_DFSS/DFSS_ARBEIT.md`](../07_DFSS/DFSS_ARBEIT.md) · Lookup: [`DFSS_MEASUREMENT_STATUS.md`](../07_DFSS/DFSS_MEASUREMENT_STATUS.md)",
            "",
        ]
    )
    dfss_cross = _sort_todos(_collect_todos_glob("07_DFSS/*.md"))
    if dfss_cross:
        lines.append("### Intern (07_DFSS)")
        lines.append("")
        lines.extend(
            _render_checkable_list(
                dfss_cross, checked, today, show_evidence=True, empty_label="_(leer)_"
            )
        )
        lines.append("")
    rollout_slugs = ("TeamFlex", "Wolf_Street", "Schutzritter", "SecuGuard")
    had_dfss_customer = False
    for slug in rollout_slugs:
        dfss_items = dfss_by_slug.get(slug, [])
        if not dfss_items:
            continue
        had_dfss_customer = True
        c = customers_by_slug(customers, slug)
        lines.append(f"### {c['display_name']} — Nachweise (Evidence)")
        lines.append("")
        lines.extend(
            _render_checkable_list(
                dfss_items, checked, today, show_evidence=True, empty_label="_(leer)_"
            )
        )
        lines.append("")
    if not had_dfss_customer and not dfss_cross:
        lines.append("_Keine DFSS-Nachweise in der Arbeitsliste (IDs siehe `ARBEITS_DFSS_SHORT_IDS` im Build-Skript)._")
        lines.append("")

    buckets: dict[str, list[TodoItem]] = {
        "vertrieb": [],
        "forderungen": [],
        "intern": [],
    }
    for t in cross_todos:
        if "07_DFSS" in t.file_path.replace("\\", "/"):
            continue
        buckets[_cross_bucket(t)].append(t)

    lines.extend(
        [
            "---",
            "",
            "## Sonstiges",
            "",
            "> `- [ ]` **Bis** — Aufgabe (ohne Nächster Schritt).",
            "",
        ]
    )
    section_titles = [
        ("vertrieb", "Vertrieb · Angebote · Marketing"),
        ("forderungen", "Forderungen"),
        ("intern", "Intern · Website · Software"),
    ]
    for key, title in section_titles:
        items = _sort_todos(buckets[key])
        lines.append(f"### {title}")
        lines.append("")
        filtered = [
            t
            for t in items
            if _todo_short_id(t.todo_id) not in ARBEITS_SKIP_SHORT_IDS
        ]
        if filtered:
            lines.extend(_render_checkable_list(filtered, checked, today))
        else:
            lines.extend(_render_checkable_list([], checked, today))
        lines.append("")

    if ARBEITS_INCLUDE_PFLEGE_BACKLOG:
        lines.extend(["---", "", "## Aus Backlog (Pflege)", ""])
        for title in BACKLOG_ARBEITS_SECTIONS:
            items = backlog_secs.get(title, [])
            if not items:
                continue
            lines.append(f"### {title}")
            lines.append("")
            for text, bid in items:
                lines.append(_checkbox_line(text, bid, checked))
            lines.append("")
        if privat_saved:
            lines.extend(privat_saved)
            lines.append("")

    lines.extend(
        [
            "---",
            "",
            "## Vollliste",
            "",
            f"Alle offenen Punkte (Privat, Ideen, Kunden-Spiegel): **[BACKLOG.md](BACKLOG.md)** "
            f"({_count_open_in_pflege(_load_backlog_pflege_body())} in Pflege + Build-Spiegel).",
            "",
            "_Pins per Drag-&-Drop kommen später im Dashboard — bis dahin Zeilen aus BACKLOG "
            "in **Mein Tag** kopieren (`<!-- bk-… -->` oder `ws09`)._",
            "",
        ]
    )
    lines.append("")

    return "\n".join(lines)


def _count_open_in_pflege(pflege_body: str) -> int:
    n = 0
    for line in pflege_body.splitlines():
        m = CHECKBOX_LINE.match(line.strip())
        if m and m.group(1).lower() != "x":
            n += 1
    return n


def _build_backlog_master(
    customers: list[dict],
    customer_todos_all: list[TodoItem],
    cross_todos_all: list[TodoItem],
    cross_dfss_all: list[TodoItem],
    today: date,
    checked: dict[str, bool],
) -> str:
    pflege_body = _apply_checked_to_pflege_body(_load_backlog_pflege_body(), checked)
    eingang_rel = "EINGANG.md"
    lines = [
        "# Backlog — alle offenen To-dos",
        "",
        f"**Stand:** {today.isoformat()}",
        "",
        "> **Pflege — Backlog:** Abschnitt unten **direkt hier** bearbeiten (Privat, Ideen, Geparkt).",
        "> **Kunden/Querschnitt:** Spiegel aus `ToDos.md` — erledigt = `[x]` (wie Arbeitsübersicht).",
        f"> **Rohnotizen:** [`EINGANG.md`]({eingang_rel}) — parken, dann mit HQ-Chat ins Pflege-Backlog übernehmen.",
        "> **Täglich:** [ARBEITSUEBERSICHT.md](ARBEITSUEBERSICHT.md)",
        "",
        "---",
        "",
        _wrap_backlog_pflege(pflege_body),
        "",
        "---",
        "",
        BACKLOG_AUTO_START,
        "",
        "## Spiegel — Kunden & Querschnitt (Build)",
        "",
        "### 1. Kunden — Projektarbeit",
        "",
    ]
    total = _count_open_in_pflege(pflege_body)
    for c in _customer_board_sort(customers):
        slug = c["slug"]
        todos = _sort_todos_backlog(
            [
                t
                for t in _todos_for_slug(customer_todos_all, slug)
                if not _is_kommunikation_todo(t)
                and t.status.lower() != "merged"
            ]
        )
        comm = _sort_todos_backlog(
            [
                t
                for t in _todos_for_slug(customer_todos_all, slug)
                if _is_kommunikation_todo(t) and t.status.lower() != "merged"
            ]
        )
        if not todos and not comm:
            continue
        rel = f"../03_Kundenprojekte/{slug}/ToDos.md"
        n_open = 0
        lines.append(
            f"### {c['display_name']} — [`ToDos.md`]({rel})"
        )
        lines.append("")
        for t in todos:
            sid = _todo_short_id(t.todo_id)
            lines.append(
                _checkbox_line(t.aufgabe, sid, checked, frist=t.frist, todo_status=t.status)
            )
            if not _todo_is_done(t, checked, sid):
                n_open += 1
                total += 1
        if comm:
            lines.append("**Kommunikation (in ToDos):**")
            lines.append("")
            for t in comm:
                sid = _todo_short_id(t.todo_id)
                lines.append(
                    _checkbox_line(t.aufgabe, sid, checked, frist=t.frist, todo_status=t.status)
                )
                if not _todo_is_done(t, checked, sid):
                    n_open += 1
                    total += 1
            lines.append("")
        lines.append("")

    lines.extend(["### 2. Sonstiges (Vertrieb · Forderungen · Intern)", ""])
    for key, title in [
        ("vertrieb", "Vertrieb · Angebote"),
        ("forderungen", "Forderungen"),
        ("intern", "Intern · Website · Software"),
    ]:
        items = _sort_todos_backlog(
            [t for t in cross_todos_all if _cross_bucket(t) == key]
        )
        if not items:
            continue
        n_open = sum(1 for t in items if not _todo_is_done(t, checked, _todo_short_id(t.todo_id)))
        lines.append(f"### {title} ({n_open} offen)")
        lines.append("")
        for t in items:
            sid = _todo_short_id(t.todo_id)
            lines.append(
                _checkbox_line(t.aufgabe, sid, checked, frist=t.frist, todo_status=t.status)
            )
            if not _todo_is_done(t, checked, sid):
                total += 1
        lines.append("")

    if cross_dfss_all:
        lines.extend(["### 4. DFSS / Pilot", ""])
        for t in _sort_todos_backlog(cross_dfss_all):
            sid = _todo_short_id(t.todo_id)
            lines.append(
                _checkbox_line(t.aufgabe, sid, checked, frist=t.frist, todo_status=t.status)
            )
            if not _todo_is_done(t, checked, sid):
                total += 1
        lines.append("")

    lines.extend(
        [
            "",
            BACKLOG_AUTO_END,
            "",
            "---",
            "",
            f"**Summe offen:** {total}",
            "",
            "Aktualisieren: `python3 hq/scripts/build_dashboard.py`",
            "",
        ]
    )
    return "\n".join(lines)


def _build_overview(
    customers: list[dict],
    customer_todos: list[TodoItem],
    live_messung: dict[str, dict] | None = None,
) -> str:
    live_messung = live_messung or {}
    lines = [
        "# Kundenübersicht — HQ",
        "",
        f"**Stand:** {date.today().isoformat()} (auto)",
        "",
        "Visuelle Einstiegsseite — springe in Status (1 Seite) statt in Roh-To-dos.",
        "",
        "| Kunde | Ampel | Nächste Termine | Offen | Live-Messung | |",
        "|-------|-------|-----------------|-------|--------------|---|",
    ]
    for c in customers:
        slug = c["slug"]
        n = len([t for t in customer_todos if f"/{slug}/" in t.file_path.replace("\\", "/")])
        terms = ", ".join(c["meta"]["audit_dates"][:2]) or "—"
        s = c["meta"]["status_link"]
        a = f"../03_Kundenprojekte/{slug}/Audit_2026.md"
        live = live_messung.get(slug)
        if live:
            lm = f"📊 {live.get('summary', '—')}"
            lm_link = f"../03_Kundenprojekte/{slug}/Live_Messung.md"
            live_cell = f"[{lm}]({lm_link})"
        else:
            live_cell = "—"
        lines.append(
            f"| **{c['display_name']}** | {c['meta']['ampel']} | {terms} | {n} | {live_cell} | "
            f"[Status]({s}) · [Audit]({a}) |"
        )
    lines.extend(
        [
            "",
            "---",
            "",
            "→ Arbeitsliste: [ARBEITSUEBERSICHT.md](ARBEITSUEBERSICHT.md)",
            "",
        ]
    )
    return "\n".join(lines)


DASHBOARD_JSON_PATH = DASH / "html" / "dashboard_data.json"
HTML_DIR = DASH / "html"


def _default_provisional_frist(today: date) -> str:
    return (today + timedelta(days=7)).isoformat()


def _frist_fields_for_item(raw_frist: str, today: date) -> dict[str, str | bool]:
    raw = (raw_frist or "").strip()
    parsed = _parse_date(raw) if raw and "**" not in raw else None
    if parsed:
        iso = parsed.isoformat()
        return {
            "frist": iso,
            "frist_display": iso,
            "frist_provisional": False,
            "frist_label": _format_bis_cell(iso, today, with_horizon=False),
        }
    provisional = _default_provisional_frist(today)
    return {
        "frist": "",
        "frist_display": provisional,
        "frist_provisional": True,
        "frist_label": _format_bis_cell(provisional, today, with_horizon=False),
    }


def _set_todo_frist_by_short_id(short_id: str, frist: str) -> bool:
    d = _parse_date(frist.strip())
    if not d:
        return False
    iso = d.isoformat()
    for path in _collect_todo_source_files():
        text = path.read_text(encoding="utf-8")
        blocks = re.split(r"(?=^## TODO-)", text, flags=re.M)
        new_blocks: list[str] = []
        changed = False
        for block in blocks:
            if not block.strip().startswith("## TODO-"):
                new_blocks.append(block)
                continue
            m = TODO_BLOCK.search(block)
            if not m or _todo_short_id(m.group(1)) != short_id:
                new_blocks.append(block)
                continue
            if re.search(r"^- \*\*Frist:\*\*", block, re.M):
                block = re.sub(
                    r"(^- \*\*Frist:\*\*\s*).*$",
                    rf"\g<1>{iso}",
                    block,
                    count=1,
                    flags=re.M,
                )
            else:
                block = re.sub(
                    r"(^- \*\*Aufgabe:\*\*.*\n)",
                    r"\g<1>- **Frist:** " + iso + "\n",
                    block,
                    count=1,
                    flags=re.M,
                )
            if re.search(r"^- \*\*Due date:\*\*", block, re.M):
                block = re.sub(
                    r"(^- \*\*Due date:\*\*\s*).*$",
                    rf"\g<1>{iso}",
                    block,
                    count=1,
                    flags=re.M,
                )
            changed = True
            new_blocks.append(block)
        if changed:
            path.write_text("".join(new_blocks), encoding="utf-8")
            return True
    return False


def _todo_item_dict(
    t: TodoItem,
    checked: dict[str, bool],
    today: date,
    *,
    slug: str | None = None,
    theme: str | None = None,
) -> dict:
    sid = _todo_short_id(t.todo_id)
    done = _todo_is_done(t, checked, sid)
    return {
        "id": sid,
        "aufgabe": t.aufgabe,
        **_frist_fields_for_item(t.frist, today),
        "done": done,
        "prioritaet": t.prioritaet,
        "slug": slug,
        "theme": theme,
        "evidence_id": t.evidence_id or "",
        "source": t.file_path.replace("\\", "/"),
    }


PFLEGE_SECTION_THEME: dict[str, str] = {
    "Privat / Life Admin": "privat",
    "Cert-Expert — Prozess & QM (mit Hajar)": "intern",
    "Vertrieb · Angebote · Kunden": "vertrieb",
    "Dokumentation · ISO · Vorlagen · Website": "intern",
    "Intern · Software · Cloud": "intern",
}


def _backlog_item_dict(
    item_id: str,
    aufgabe: str,
    checked: dict[str, bool],
    *,
    theme: str | None = None,
    slug: str | None = None,
    frist: str = "",
    today: date | None = None,
) -> dict:
    today = today or date.today()
    return {
        "id": item_id,
        "aufgabe": aufgabe,
        **_frist_fields_for_item(frist, today),
        "done": checked.get(item_id, False),
        "prioritaet": "normal",
        "slug": slug,
        "theme": theme,
        "evidence_id": "",
        "source": "00_Dashboard/BACKLOG.md",
    }


def _backlog_privat_items(checked: dict[str, bool]) -> list[dict]:
    out: list[dict] = []
    for text, bid in _parse_backlog_sections().get("Privat / Life Admin", []):
        out.append(
            {
                "id": bid,
                "aufgabe": text,
                "frist": "",
                "frist_label": "—",
                "done": checked.get(bid, False),
                "prioritaet": "normal",
                "slug": None,
                "theme": "privat",
                "evidence_id": "",
                "source": "00_Dashboard/BACKLOG.md",
            }
        )
    return out


THEME_DISPLAY = {
    "vertrieb": "Vertrieb",
    "forderungen": "Forderungen",
    "intern": "Intern",
    "privat": "Privat",
    "dfss": "DFSS",
}


def _build_overview_groups(
    selected_ids: list[str],
    items_index: dict[str, dict],
    customers_by_slug_map: dict[str, dict],
) -> list[dict]:
    """Nur explizit gewählte IDs, gruppiert zur Anzeige."""
    buckets: dict[tuple[str, str], list[dict]] = {}
    order: list[tuple[str, str]] = []
    for sid in selected_ids:
        it = items_index.get(str(sid))
        if not it:
            continue
        slug = it.get("slug")
        theme = it.get("theme")
        if slug:
            key = ("project", str(slug))
            title = customers_by_slug_map.get(slug, {}).get("display_name") or slug
        elif theme:
            key = ("theme", str(theme))
            title = THEME_DISPLAY.get(str(theme), str(theme))
        else:
            key = ("other", "sonstiges")
            title = "Sonstiges"
        if key not in buckets:
            buckets[key] = []
            order.append(key)
        buckets[key].append(dict(it))
    out: list[dict] = []
    for key in order:
        gtype, ident = key
        items = buckets[key]
        header_extra = ""
        title = "Sonstiges"
        slug_val: str | None = None
        theme_val: str | None = None
        if gtype == "project":
            slug_val = ident
            title = customers_by_slug_map.get(ident, {}).get("display_name") or ident
            meta = customers_by_slug_map.get(ident, {}).get("meta") or {}
            header_extra = _format_customer_audit_terms(meta, date.today())
        elif gtype == "theme":
            theme_val = ident
            title = THEME_DISPLAY.get(ident, ident)
        out.append(
            {
                "type": gtype,
                "slug": slug_val,
                "theme": theme_val,
                "title": title,
                "header_extra": header_extra,
                "items": items,
            }
        )
    return out


def _export_backlog_sections(
    customers: list[dict],
    customer_todos: list[TodoItem],
    customer_todos_all: list[TodoItem],
    checked: dict[str, bool],
    today: date,
    themes: dict[str, dict],
) -> list[dict]:
    sections: list[dict] = []
    pflege = _parse_backlog_sections()

    for title in BACKLOG_INVENTAR_ORDER:
        rows = pflege.get(title, [])
        if not rows:
            continue
        items = []
        for text, bid in rows:
            items.append(
                _backlog_item_dict(
                    bid, text, checked, theme=PFLEGE_SECTION_THEME.get(title)
                )
            )
        sections.append(
            {
                "id": "pflege-" + re.sub(r"[^a-z0-9]+", "-", title.lower())[:40].strip("-"),
                "kind": "pflege",
                "title": title,
                "theme": PFLEGE_SECTION_THEME.get(title),
                "slug": None,
                "open_count": len([i for i in items if not i["done"]]),
                "items": items,
            }
        )

    for c in _customer_board_sort(customers):
        slug = c["slug"]
        pool = _sort_todos(_todos_for_slug(customer_todos_all, slug))
        tages, _dfss = _split_tages_dfss(pool)
        items = []
        for t in tages:
            sid = _todo_short_id(t.todo_id)
            items.append(
                {
                    **_todo_item_dict(t, checked, today, slug=slug),
                    "id": sid,
                }
            )
        comm = _sort_todos(
            [
                t
                for t in customer_todos_all
                if _slug_in_path(slug, t.file_path) and _is_kommunikation_todo(t)
            ]
        )
        for t in comm:
            sid = _todo_short_id(t.todo_id)
            row = {
                **_todo_item_dict(t, checked, today, slug=slug),
                "id": sid,
                "kommunikation": True,
            }
            items.append(row)
        if not items:
            continue
        sections.append(
            {
                "id": f"customer-{slug}",
                "kind": "customer",
                "title": c["display_name"],
                "theme": None,
                "slug": slug,
                "open_count": len([i for i in items if not i["done"]]),
                "items": items,
            }
        )

    for key, tdata in themes.items():
        items = list(tdata.get("todos") or [])
        sections.append(
            {
                "id": f"theme-{key}",
                "kind": "theme",
                "title": tdata.get("title", key),
                "theme": key,
                "slug": None,
                "open_count": tdata.get("open_count", 0),
                "items": items,
            }
        )

    return sections


def export_dashboard_json(
    customers: list[dict],
    customer_todos: list[TodoItem],
    cross_todos: list[TodoItem],
    cross_dfss: list[TodoItem],
    checked: dict[str, bool],
    today: date,
    *,
    customer_todos_all: list[TodoItem] | None = None,
    cross_todos_all: list[TodoItem] | None = None,
) -> Path:
    from live_messung_store import load_all as load_live_messung  # noqa: PLC0415
    from pins_store import load_pins  # noqa: PLC0415

    live_messung = load_live_messung()
    items_index: dict[str, dict] = {}
    customer_cards: list[dict] = []
    customers_map = {c["slug"]: c for c in customers}
    all_cust = customer_todos_all if customer_todos_all is not None else customer_todos
    cross_pool = cross_todos_all if cross_todos_all is not None else cross_todos

    for c in _customer_board_sort(customers):
        slug = c["slug"]
        for t in _sort_todos(_todos_for_slug(all_cust, slug)):
            d = _todo_item_dict(t, checked, today, slug=slug)
            items_index[d["id"]] = d
        todos = _sort_todos(_todos_for_slug(customer_todos, slug))
        tages, _dfss = _split_tages_dfss(todos)
        card_todos = []
        for t in tages:
            d = items_index.get(_todo_short_id(t.todo_id))
            if d:
                card_todos.append(d)
        customer_cards.append(
            {
                "slug": slug,
                "display_name": c["display_name"],
                "ampel": (c["meta"].get("ampel") or "—").strip()[:20],
                "audit_label": _format_customer_audit_terms(c["meta"], today),
                "open_count": len(card_todos),
                "status_link": f"../../03_Kundenprojekte/{slug}/Status.md",
                "todos_link": f"../../03_Kundenprojekte/{slug}/ToDos.md",
                "todos": card_todos,
                "live_messung": live_messung.get(slug),
            }
        )

    themes: dict[str, dict] = {}
    theme_meta = [
        ("vertrieb", "Vertrieb · Angebote", "04_Vertrieb/Angebote_Juni_2026.md"),
        ("forderungen", "Forderungen", "05_Forderungen/Offene_Juni_2026.md"),
        ("intern", "Intern · Software", "06_Software/Software_Backlog_Juni_2026.md"),
    ]
    for key, title, src in theme_meta:
        pool = [
            t
            for t in cross_pool
            if _cross_bucket(t) == key
            and _todo_short_id(t.todo_id) not in ARBEITS_SKIP_SHORT_IDS
        ]
        theme_todos = []
        for t in _sort_todos(pool):
            d = _todo_item_dict(t, checked, today, theme=key)
            items_index[d["id"]] = d
            theme_todos.append(d)
        themes[key] = {
            "title": title,
            "source": f"../../{src}",
            "open_count": len([x for x in theme_todos if not x["done"]]),
            "todos": theme_todos,
        }

    privat_todos = _backlog_privat_items(checked)
    for d in privat_todos:
        items_index[d["id"]] = d
    themes["privat"] = {
        "title": "Privat · Life Admin",
        "source": "../../00_Dashboard/BACKLOG.md",
        "open_count": len([x for x in privat_todos if not x["done"]]),
        "todos": privat_todos,
    }

    dfss_todos = []
    for t in _sort_todos(cross_dfss):
        d = _todo_item_dict(t, checked, today, theme="dfss")
        items_index[d["id"]] = d
        dfss_todos.append(d)
    for c in customers:
        slug = c["slug"]
        for t in _sort_todos(_todos_for_slug(all_cust, slug)):
            if _todo_goes_dfss_arbeits(t):
                d = _todo_item_dict(t, checked, today, slug=slug, theme="dfss")
                if d["id"] not in items_index:
                    items_index[d["id"]] = d
                    dfss_todos.append(d)
    themes["dfss"] = {
        "title": "DFSS / Pilot",
        "source": "../../07_DFSS/DFSS_ARBEIT.md",
        "open_count": len([x for x in dfss_todos if not x["done"]]),
        "todos": dfss_todos,
        "gate": "NOT READY — Pilot Measurement (siehe DFSS_MEASUREMENT_STATUS.md)",
    }

    pins_raw = load_pins()
    selected_ids = pins_raw.get("selected") or []
    selected_set = {str(x) for x in selected_ids}

    backlog_sections = _export_backlog_sections(
        customers, customer_todos, all_cust, checked, today, themes
    )
    for sec in backlog_sections:
        for it in sec.get("items") or []:
            it["in_overview"] = it.get("id") in selected_set

    payload = {
        "version": 1,
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "today": today.isoformat(),
        "links": {
            "backlog": "../../00_Dashboard/BACKLOG.md",
            "eingang": "../../00_Dashboard/EINGANG.md",
            "arbeitsuebersicht": "../../00_Dashboard/ARBEITSUEBERSICHT.md",
            "kunden_uebersicht": "../../00_Dashboard/Kunden_Uebersicht.md",
        },
        "pins": {
            "selected": selected_ids,
            "groups": _build_overview_groups(selected_ids, items_index, customers_map),
        },
        "customers": customer_cards,
        "themes": themes,
        "backlog": {"sections": backlog_sections},
        "items_index": items_index,
        "live_messung": live_messung,
    }

    HTML_DIR.mkdir(parents=True, exist_ok=True)
    DASHBOARD_JSON_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return DASHBOARD_JSON_PATH


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

    today = date.today()
    _ensure_eingang()
    DASH.mkdir(parents=True, exist_ok=True)
    backlog_raw = (
        BACKLOG_MASTER_PATH.read_text(encoding="utf-8")
        if BACKLOG_MASTER_PATH.exists()
        else ""
    )
    spiegel = _parse_backlog_spiegel_checked(backlog_raw)
    _sync_spiegel_unchecks_to_sources(spiegel)
    checked = _merged_checked_states()
    _sync_checked_to_sources(checked, spiegel=spiegel)
    checked = _apply_spiegel_to_checked(checked, spiegel)
    checked = _merge_checked(checked, _checked_from_done_sources())

    customer_todos: list[TodoItem] = []
    for p in KP.iterdir():
        if p.is_dir() and not p.name.startswith("_"):
            tf = p / "ToDos.md"
            if tf.exists():
                customer_todos.extend(_parse_todos(tf))

    cross_todos = _collect_todos_glob("04_Vertrieb/*.md")
    cross_todos += _collect_todos_glob("05_Forderungen/*.md")
    cross_todos += _collect_todos_glob("06_Software/*.md")
    cross_todos_all = _collect_todos_glob_all("04_Vertrieb/*.md")
    cross_todos_all += _collect_todos_glob_all("05_Forderungen/*.md")
    cross_todos_all += _collect_todos_glob_all("06_Software/*.md")
    cross_dfss_all = _collect_todos_glob_all("07_DFSS/*.md")

    customer_todos_all: list[TodoItem] = []
    for p in KP.iterdir():
        if p.is_dir() and not p.name.startswith("_"):
            tf = p / "ToDos.md"
            if tf.exists():
                customer_todos_all.extend(_parse_todos_all(tf))

    arbeits = _build_arbeitsuebersicht(
        customers, customer_todos, cross_todos, today, checked
    )
    ARBEITS_PATH.write_text(arbeits, encoding="utf-8")

    backlog = _build_backlog_master(
        customers, customer_todos_all, cross_todos_all, cross_dfss_all, today, checked
    )
    BACKLOG_MASTER_PATH.write_text(backlog, encoding="utf-8")
    for legacy in LEGACY_NOTIZEN_PATHS:
        if legacy.exists() and legacy.name == "NOTIZEN.md":
            legacy.unlink()

    from live_messung_store import load_all as load_live_messung, sync_all_markdown  # noqa: PLC0415

    sync_all_markdown()
    # Kunden_Uebersicht.md wird hier NICHT mehr geschrieben — Eigentuemer ist das
    # Tagesbriefing (build_dashboard.py, Quelle Airtable). Verhindert die Datei-
    # Kollision zwischen den beiden Engines. (HTML-Dashboard liest dashboard_data.json.)
    print(f"Wrote {ARBEITS_PATH}")
    print(f"Wrote {BACKLOG_MASTER_PATH}")
    n_cross = len([t for t in cross_todos if "07_DFSS" not in t.file_path])
    print(f"Open todos: {len(customer_todos)} customer + {n_cross} sonstiges (ohne DFSS)")

    json_path = export_dashboard_json(
        customers,
        customer_todos,
        cross_todos,
        cross_dfss_all,
        checked,
        today,
        customer_todos_all=customer_todos_all,
        cross_todos_all=cross_todos_all,
    )
    print(f"Wrote {json_path}")


if __name__ == "__main__":
    main()
