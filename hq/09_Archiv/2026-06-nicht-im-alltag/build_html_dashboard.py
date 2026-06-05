#!/usr/bin/env python3
"""
Generate html_dashboard/index.html from MASTER_COMMAND_CENTER.md — V2 layout.

PAUSED (Option A, 2026-06-04): HTML dashboard frozen; use build_dashboard.py + Tagesbriefing.md.

Reads markdown only — does not modify MASTER_COMMAND_CENTER.md or customer files.
"""

from __future__ import annotations

import hashlib
import html
import re
from pathlib import Path

HQ = Path(__file__).resolve().parent
MD_PATH = HQ / "MASTER_COMMAND_CENTER.md"
OUT_PATH = HQ / "html_dashboard" / "index.html"
BACKUP_PARKED = HQ / "MASTER_COMMAND_CENTER_BACKUP_BEFORE_UX_V1.md"


def slug(s: str) -> str:
    h = hashlib.md5(s.encode()).hexdigest()[:8]
    clean = re.sub(r"[^a-zA-Z0-9]+", "-", s.lower()).strip("-")[:40]
    return f"{clean}-{h}"


def esc(s: str) -> str:
    return html.escape(s.strip())


def parse_checkbox(line: str) -> tuple[bool, str] | None:
    m = re.match(r"^- \[([ xX])\]\s*(.*)$", line.strip())
    if not m:
        return None
    checked = m.group(1).lower() == "x"
    text = m.group(2).strip()
    return checked, text


def checkbox_html(
    text: str,
    prefix: str,
    checked: bool = False,
    extra_class: str = "",
    data_attrs: str = "",
) -> str:
    if not text:
        cls = "task-item task-item--empty"
    else:
        cls = f"task-item {extra_class}".strip()
    tid = slug(f"{prefix}:{text}")
    chk = " checked" if checked else ""
    label = esc(text) if text else "(leer)"
    return (
        f'<label class="{cls}"{data_attrs}>'
        f'<input type="checkbox" data-task-id="{tid}"{chk} />'
        f"<span>{label}</span></label>"
    )


def checkbox_list(
    lines: list[str],
    prefix: str,
    as_ul: bool = True,
    data_attrs: str = "",
    large: bool = False,
) -> str:
    items = []
    extra = "task-item--large" if large else ""
    for i, line in enumerate(lines):
        parsed = parse_checkbox(line)
        if parsed:
            checked, text = parsed
            items.append(
                checkbox_html(text, f"{prefix}-{i}", checked, extra, data_attrs)
            )
    if not items:
        return ""
    inner = "\n".join(items)
    if as_ul:
        return f'<div class="task-list">{inner}</div>'
    return inner


def count_tasks(lines: list[str]) -> tuple[int, int]:
    """Return (open, done) counts."""
    open_c = done_c = 0
    for line in lines:
        parsed = parse_checkbox(line)
        if parsed:
            checked, text = parsed
            if not text:
                continue
            if checked:
                done_c += 1
            else:
                open_c += 1
    return open_c, done_c


def parse_table_block(text: str) -> list[dict[str, str]]:
    rows = []
    lines = [ln for ln in text.strip().splitlines() if ln.strip().startswith("|")]
    if len(lines) < 2:
        return rows
    headers = [c.strip() for c in lines[0].split("|")[1:-1]]
    for line in lines[2:]:
        cells = [c.strip() for c in line.split("|")[1:-1]]
        if len(cells) == len(headers):
            rows.append(dict(zip(headers, cells)))
    return rows


def parse_meta_table(text: str) -> dict[str, str]:
    rows = parse_table_block(text)
    return {r.get("Feld", ""): r.get("Wert", "") for r in rows if "Feld" in r}


def split_sections(content: str) -> dict[str, str]:
    sections: dict[str, str] = {}
    current = "_preamble"
    buf: list[str] = []
    for line in content.splitlines():
        if line.startswith("## "):
            sections[current] = "\n".join(buf)
            current = line[3:].strip()
            buf = []
        else:
            buf.append(line)
    sections[current] = "\n".join(buf)
    return sections


def extract_customer_cards(text: str) -> list[dict]:
    cards = []
    parts = re.split(r"(?=### Kunde: )", text)
    for part in parts:
        if not part.startswith("### Kunde:"):
            continue
        name_m = re.match(r"### Kunde: (\S+)", part)
        if not name_m:
            continue
        name = name_m.group(1)

        def section(title: str) -> str:
            sm = re.search(
                rf"#### {re.escape(title)}\n(.*?)(?=\n#### |\Z)", part, re.DOTALL
            )
            return sm.group(1).strip() if sm else ""

        meta = parse_meta_table(part)
        links_raw = section("Links")
        links = []
        for ln in links_raw.splitlines():
            lm = re.match(r"- (\w[^:]*): `([^`]+)`", ln.strip())
            if lm:
                links.append((lm.group(1).strip(), lm.group(2).strip()))

        cards.append({
            "name": name,
            "meta": meta,
            "top": section("Top-To-dos"),
            "wartet": section("Wartet auf Kunde / Extern"),
            "kommunikation": section("Kommunikation"),
            "intern": section("Intern offen"),
            "standard": section("Standardpunkte Projekt / Audit"),
            "readiness": section("Audit- / Readiness-Punkte"),
            "links": links,
        })
    return cards


def status_class(status: str) -> str:
    if "🔴" in status:
        return "red"
    if "🟡" in status:
        return "yellow"
    return "green"


def badge_html(status: str) -> str:
    sc = status_class(status)
    if sc == "red":
        return '<span class="badge badge--red">🔴 kritisch</span>'
    if sc == "yellow":
        return '<span class="badge badge--yellow">🟡 Risiko</span>'
    return '<span class="badge badge--green">🟢 stabil</span>'


def lines_from_section(content: str) -> list[str]:
    return [ln for ln in content.splitlines() if ln.strip().startswith("- [")]


def sort_customers(cards: list[dict]) -> list[dict]:
    def sort_key(c: dict) -> tuple:
        st = c["meta"].get("Status", "")
        is_red = 0 if "🔴" in st else 1
        tage_raw = c["meta"].get("Tage bis Audit", "9999")
        tage = int(tage_raw) if tage_raw.isdigit() else 9999
        return (is_red, tage, c["name"])

    return sorted(cards, key=sort_key)


def dfss_hint(name: str, intern_hq_text: str) -> str:
    """Small DFSS line for customers with Prio-1 EV references."""
    ev_map = {
        "TeamFlex": "EV-TF-003",
        "Schutzritter": "EV-SR-001",
        "Wolf_Street": "EV-WS-001",
        "SecuGuard": "EV-SG-001",
    }
    ev_id = ev_map.get(name)
    if not ev_id:
        return ""
    if ev_id not in intern_hq_text:
        return ""
    return (
        f'<p class="kanban-card__dfss">'
        f"DFSS/Evidence: 1 kritisch ({esc(ev_id)})"
        f"</p>"
    )


def build_kanban_card(c: dict, today_customer_tasks: dict[str, list[str]], dfss_text: str) -> str:
    name = c["name"]
    meta = c["meta"]
    st = meta.get("Status", "nicht erfasst")
    sc = status_class(st)

    auditdatum = meta.get("Auditdatum", "nicht erfasst")
    tage = meta.get("Tage bis Audit", "nicht erfasst")
    naechste = meta.get("Nächste Aktion", "nicht erfasst")

    top_lines = lines_from_section(c["top"])
    wartet_lines = lines_from_section(c["wartet"])
    komm_lines = lines_from_section(c["kommunikation"])
    intern_lines = lines_from_section(c["intern"])
    std_lines = lines_from_section(c["standard"])
    ready_lines = lines_from_section(c["readiness"])

    offen_open, _ = count_tasks(top_lines)
    w_o, _ = count_tasks(wartet_lines)
    k_o, _ = count_tasks(komm_lines)
    wartet_open = w_o + k_o
    intern_open, _ = count_tasks(intern_lines)
    total_open = offen_open + wartet_open + intern_open

    today_lines = today_customer_tasks.get(name, [])
    today_open, _ = count_tasks(today_lines)

    done_std = [ln for ln in std_lines if parse_checkbox(ln) and parse_checkbox(ln)[0]]
    done_ready = [ln for ln in ready_lines if parse_checkbox(ln) and parse_checkbox(ln)[0]]
    done_lines = done_std + done_ready

    prefix = f"kanban-{name}"

    offen_html = checkbox_list(top_lines, f"{prefix}-offen", data_attrs=f' data-project="{esc(name)}"')
    wartet_all = wartet_lines + komm_lines
    wartet_html = checkbox_list(wartet_all, f"{prefix}-wartet", data_attrs=f' data-project="{esc(name)}"')
    intern_html = checkbox_list(intern_lines, f"{prefix}-intern", data_attrs=f' data-project="{esc(name)}"')
    done_html = checkbox_list(done_lines, f"{prefix}-done", data_attrs=f' data-project="{esc(name)}"') if done_lines else ""

    std_open = [ln for ln in std_lines if parse_checkbox(ln) and not parse_checkbox(ln)[0]]
    ready_open = [ln for ln in ready_lines if parse_checkbox(ln) and not parse_checkbox(ln)[0]]

    details_parts = []
    if std_open or std_lines:
        inner = checkbox_list(std_lines, f"{prefix}-standard")
        details_parts.append(f"<details><summary>Standardpunkte ({len(std_open)} offen)</summary>{inner}</details>")
    if ready_open or ready_lines:
        inner = checkbox_list(ready_lines, f"{prefix}-readiness")
        details_parts.append(f"<details><summary>Readiness ({len(ready_open)} offen)</summary>{inner}</details>")
    if c["links"]:
        links_html = '<ul class="links-list">'
        for label, path in c["links"]:
            links_html += f"<li><span>{esc(label)}:</span> {esc(path)}</li>"
        links_html += "</ul>"
        details_parts.append(f"<details><summary>Links</summary>{links_html}</details>")

    dfss = dfss_hint(name, dfss_text)

    card_cls = f"kanban-card kanban-card--{sc}" if sc else "kanban-card"

    return f"""<article class="{card_cls}" data-status="{sc}" data-customer="{esc(name)}">
  <header class="kanban-card__header">
    <div class="kanban-card__title-row">
      <h3 class="kanban-card__name">{esc(name)}</h3>
      {badge_html(st)}
    </div>
    <div class="kanban-card__audit">
      <span class="kanban-card__audit-date">{esc(auditdatum)}</span>
      <span class="kanban-card__audit-days">{esc(tage)} Tage</span>
    </div>
    <p class="kanban-card__next">{esc(naechste)}</p>
    <dl class="kanban-card__stats">
      <div><dt>Heute</dt><dd data-stat="heute">{today_open}</dd></div>
      <div><dt>Offen</dt><dd data-stat="offen">{total_open}</dd></div>
      <div><dt>Wartet</dt><dd data-stat="wartet">{wartet_open}</dd></div>
      <div><dt>Intern</dt><dd data-stat="intern">{intern_open}</dd></div>
    </dl>
    {dfss}
  </header>
  <div class="kanban-card__columns">
    <div class="kanban-col kanban-col--open">
      <h4 class="kanban-col__title">Offen <span class="kanban-col__count">{offen_open}</span></h4>
      {offen_html or '<p class="kanban-col__empty">—</p>'}
    </div>
    <div class="kanban-col kanban-col--wait">
      <h4 class="kanban-col__title">Wartet <span class="kanban-col__count">{wartet_open}</span></h4>
      {wartet_html or '<p class="kanban-col__empty">—</p>'}
    </div>
    <div class="kanban-col kanban-col--intern">
      <h4 class="kanban-col__title">Intern <span class="kanban-col__count">{intern_open}</span></h4>
      {intern_html or '<p class="kanban-col__empty">—</p>'}
    </div>
  </div>
  {f'<details class="kanban-card__done"><summary>Erledigt ({len(done_lines)})</summary>{done_html}</details>' if done_html else ''}
  <div class="kanban-card__details">{''.join(details_parts)}</div>
</article>"""


def build() -> str:
    md = MD_PATH.read_text(encoding="utf-8")
    sections = split_sections(md)

    stand = "2026-06-03"
    sm = re.search(r"Stand:\s*(.+)", sections.get("_preamble", ""))
    if sm:
        stand = sm.group(1).strip()

    sofort = parse_meta_table(sections.get("0. Sofortblick — Heute kritisch", ""))
    heute_modus = sofort.get("Heute Modus", sofort.get("Heute Modus", "nicht erfasst"))
    if heute_modus == "nicht erfasst":
        mm = re.search(r"Arbeitsmodus:\s*(.+)", sections.get("_preamble", ""))
        if mm:
            heute_modus = mm.group(1).strip()

    naechster_audit = sofort.get("Nächster Audit", "nicht erfasst")
    tage_audit = sofort.get("Tage bis nächster Audit", "nicht erfasst")
    audit_header = naechster_audit
    if tage_audit != "nicht erfasst":
        audit_header = f"{naechster_audit} · {tage_audit} Tage"

    # Section 1 — top 3 + today run
    sec1 = sections.get("1. Heute wichtigste 3 Aktionen", "")
    sec1_parts = sec1.split("### Today Run", 1)
    top3_block = sec1_parts[0]
    today_sec = sec1_parts[1] if len(sec1_parts) > 1 else ""
    top3_lines = [ln for ln in top3_block.splitlines() if ln.strip().startswith("- [")]

    today_groups: dict[str, list[str]] = {}
    current_group = None
    for line in today_sec.splitlines():
        hm = re.match(r"#### \d+\.\s*(.+)", line.strip())
        if hm:
            current_group = hm.group(1).strip()
            today_groups[current_group] = []
        elif current_group and line.strip().startswith("- ["):
            today_groups[current_group].append(line.strip())

    all_today_lines: list[str] = []
    for glines in today_groups.values():
        all_today_lines.extend(glines)

    # Map today tasks to customers for kanban stats
    customers = extract_customer_cards(sections.get("4. Alle Kundenprojekte — Panorama", ""))
    customer_names = [c["name"] for c in customers]
    today_by_customer: dict[str, list[str]] = {n: [] for n in customer_names}
    for line in all_today_lines:
        parsed = parse_checkbox(line)
        if not parsed:
            continue
        _, text = parsed
        for cn in customer_names:
            if cn.replace("_", " ") in text or cn in text:
                today_by_customer[cn].append(line)
                break

    is_critical_group = lambda g: "kritisch" in g.lower() or "audit" in g.lower()

    today_html_parts = []
    for gname, glines in today_groups.items():
        crit = is_critical_group(gname)
        crit_attr = ' data-today-critical="true"' if crit else ""
        group_cls = "today-group"
        if crit:
            group_cls += " today-group--critical"
        items = checkbox_list(
            glines,
            f"today-{gname}",
            data_attrs=f' data-today-task="true"{crit_attr}',
            large=True,
        )
        today_html_parts.append(
            f'<div class="{group_cls}">'
            f'<h4 class="today-group__title">{esc(gname)}</h4>{items}</div>'
        )
    today_grid = f'<div class="today-grid">{"".join(today_html_parts)}</div>'

    # Small top-3 hint (not dominant)
    top3_hint_items = []
    for i, line in enumerate(top3_lines[:3]):
        parsed = parse_checkbox(line)
        if parsed:
            checked, text = parsed
            chk_mark = "✓" if checked else "○"
            top3_hint_items.append(f"<li>{chk_mark} {esc(text)}</li>")
    top3_hint = ""
    if top3_hint_items:
        top3_hint = (
            '<details class="today-top3-hint">'
            '<summary>Top-3 Referenz (Markdown)</summary>'
            f'<ul>{"".join(top3_hint_items)}</ul></details>'
        )

    intern_hq_text = sections.get("9. Cert-Expert intern / Software / DFSS", "")
    sorted_customers = sort_customers(customers)
    kanban_cards = "".join(
        build_kanban_card(c, today_by_customer, intern_hq_text) for c in sorted_customers
    )

    def section_checkboxes(sec_key: str, prefix: str) -> str:
        text = sections.get(sec_key, "")
        lines = [ln for ln in text.splitlines() if ln.strip().startswith("- [")]
        return checkbox_list(lines, prefix)

    def subsections_html(sec_key: str, prefix: str, collapsed: bool = False) -> str:
        text = sections.get(sec_key, "")
        parts = re.split(r"\n### ", text)
        html_parts = []
        for part in parts[1:]:
            lines = part.strip().splitlines()
            title = lines[0].strip()
            clines = [ln for ln in lines[1:] if ln.strip().startswith("- [")]
            if not clines:
                continue
            inner = checkbox_list(clines, f"{prefix}-{title}")
            if collapsed and title not in ("DFSS / Evidence",):
                html_parts.append(
                    f'<details class="support-sub"><summary>{esc(title)}</summary>{inner}</details>'
                )
            else:
                html_parts.append(
                    f'<h4 class="subsection-title">{esc(title)}</h4>{inner}'
                )
        return "".join(html_parts)

    forderungen = subsections_html("7. Forderungen / Zahlungen", "finance")
    vertrieb = subsections_html("8. Vertrieb / Angebote / Website", "vertrieb", collapsed=True)
    intern_hq = subsections_html("9. Cert-Expert intern / Software / DFSS", "intern-hq", collapsed=True)
    privat = subsections_html("10. Privat / Life Admin", "privat")
    quick_items = section_checkboxes("11. Quick Capture / Rohinput", "quick-md")

    parked_text = sections.get("12. Parked / Not Now", "")
    parked_lines = [ln for ln in parked_text.splitlines() if ln.strip().startswith("- [")]
    if not parked_lines and BACKUP_PARKED.exists():
        backup_secs = split_sections(BACKUP_PARKED.read_text(encoding="utf-8"))
        for key, val in backup_secs.items():
            if "Parked" in key:
                parked_lines = [ln for ln in val.splitlines() if ln.strip().startswith("- [")]
                break
    parked = checkbox_list(parked_lines, "parked")

    notice = (
        "Checkboxen und Quick Capture werden lokal im Browser gespeichert — "
        "kein Sync zurück nach Markdown in dieser Version."
    )

    return f"""<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cert-Expert Command Center</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="topbar" id="topbar">
    <div class="topbar__main">
      <div class="topbar__brand">
        <div class="topbar__title">Cert-Expert Command Center</div>
        <div class="topbar__stand">Stand: {esc(stand)}</div>
      </div>
      <div class="topbar__metrics">
        <div class="metric">
          <span class="metric__label">Heute-Modus</span>
          <span class="metric__value">{esc(heute_modus)}</span>
        </div>
        <div class="metric metric--accent">
          <span class="metric__label">Heute offen</span>
          <span class="metric__value" id="stat-today-open">—</span>
        </div>
        <div class="metric">
          <span class="metric__label">Heute erledigt</span>
          <span class="metric__value" id="stat-today-done">—</span>
        </div>
        <div class="metric metric--audit">
          <span class="metric__label">Nächster Audit</span>
          <span class="metric__value metric__value--small">{esc(audit_header)}</span>
        </div>
      </div>
    </div>
    <div class="topbar__actions">
      <button type="button" class="btn btn--ghost" id="btn-show-all">Alle</button>
      <button type="button" class="btn btn--ghost" id="btn-critical-only">Nur kritisch</button>
      <button type="button" class="btn btn--ghost" id="btn-highlight-open">Offene markieren</button>
    </div>
  </header>

  <main class="dashboard">
    <!-- ZONE 1: HEUTE -->
    <section id="zone-today" class="zone zone--today">
      <div class="zone__header">
        <h2 class="zone__title">Heute — Today Run</h2>
        <div class="zone__stats" id="today-zone-stats">
          <span class="pill pill--open"><strong id="pill-today-open">—</strong> offen</span>
          <span class="pill pill--done"><strong id="pill-today-done">—</strong> erledigt</span>
          <span class="pill pill--critical"><strong id="pill-today-critical">—</strong> kritisch</span>
        </div>
      </div>
      {top3_hint}
      <div class="today-panel">{today_grid}</div>
    </section>

    <!-- ZONE 2: PROJEKTE -->
    <section id="zone-projects" class="zone zone--projects">
      <div class="zone__header">
        <h2 class="zone__title">Laufende Projekte</h2>
        <p class="zone__hint">7 Kunden · horizontal scrollen</p>
      </div>
      <div class="kanban-scroll">
        <div class="kanban-board">{kanban_cards}</div>
      </div>
    </section>

    <!-- ZONE 3: SUPPORT -->
    <section id="zone-support" class="zone zone--support">
      <div class="zone__header">
        <h2 class="zone__title">Support / Rest</h2>
      </div>
      <div class="support-grid">
        <article class="support-card" id="privat">
          <h3 class="support-card__title">Privat / Life Admin</h3>
          <div class="support-card__body panel--private">{privat or '<p class="support-empty">(leer)</p>'}</div>
        </article>
        <article class="support-card" id="vertrieb">
          <h3 class="support-card__title">Vertrieb / Angebote / Website</h3>
          <div class="support-card__body">{vertrieb}</div>
        </article>
        <article class="support-card support-card--warn" id="finance">
          <h3 class="support-card__title">Forderungen / Zahlungen</h3>
          <div class="support-card__body">{forderungen}</div>
        </article>
        <article class="support-card" id="intern-hq">
          <h3 class="support-card__title">Intern / Software / HQ</h3>
          <div class="support-card__body">{intern_hq}</div>
        </article>
        <article class="support-card support-card--capture" id="quick">
          <h3 class="support-card__title">Quick Capture</h3>
          <p class="support-card__hint">Schreibt nicht zurück nach Markdown.</p>
          <div class="support-card__body quick-capture">
            <textarea id="quick-capture-text" placeholder="Schnell notieren…"></textarea>
            <div class="quick-capture__items">{quick_items}</div>
          </div>
        </article>
        <article class="support-card support-card--parked" id="parked">
          <h3 class="support-card__title">Parked / Not Now</h3>
          <div class="support-card__body panel--parked">{parked}</div>
        </article>
      </div>
    </section>
  </main>

  <footer class="footer-notice">{esc(notice)}</footer>

  <script src="app.js"></script>
</body>
</html>
"""


def main() -> None:
    if MD_PATH.exists():
        head = MD_PATH.read_text(encoding="utf-8")[:800]
        if "eingefroren" in head.lower() or "pausiert" in head.lower():
            print(
                "HTML-Dashboard pausiert (Option A).\n"
                "  Morgens: python3 hq/scripts/build_dashboard.py\n"
                "  Dann: hq/00_Dashboard/Tagesbriefing.md\n"
                "  Archiv-MCC: hq/09_Archiv/2026-06-dashboard-experiment/"
            )
            raise SystemExit(0)
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(build(), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
