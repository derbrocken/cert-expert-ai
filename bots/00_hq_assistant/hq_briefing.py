"""Freitext-Kunden-Updates: mehrere To-dos, EINGANG, Backlog-Pflege, Status-Notiz."""

from __future__ import annotations

import hashlib
import json
import re
from dataclasses import dataclass, field
from datetime import datetime
from zoneinfo import ZoneInfo

from .hq_context import BACKLOG, DASH, HQ, KP, REPO_ROOT, refresh_briefing
from .hq_todos import (
    CATEGORIES,
    TodoDraft,
    append_todo,
    guess_category,
    guess_priority,
    load_registry,
    parse_frist,
    resolve_slug,
)

TZ = ZoneInfo("Europe/Berlin")
EINGANG = DASH / "EINGANG.md"
BACKLOG_PFLEGE_START = "<!-- hq:pflege -->"
BACKLOG_PFLEGE_END = "<!-- /hq:pflege -->"

BRIEFING_HINTS = re.compile(
    r"(?:"
    r"information (?:about|zu|über|ueber)|"
    r"infos? (?:zu|über|ueber)|"
    r"folgende\s+(?:to-?dos|aufgaben)|"
    r"neue\s+(?:to-?dos|aufgaben)|"
    r"following\s+todos?|"
    r"i(?:'m| am) giving you|"
    r"hier (?:sind|die)|"
    r"update (?:für|zu)|"
    r"notier(?:e|en)? (?:bitte|folgendes)"
    r")",
    re.I,
)

NUMBERED_LINE = re.compile(r"^\s*(\d+)[\.\):\-]\s+(.+)$", re.M)
NUMBERED_INLINE = re.compile(r"(?:^|\s)(\d+)[\.\):\-]\s+")

BRIEFING_PROMPT = """Du extrahierst aus einer freien HQ-Nachricht ein JSON-Objekt.

**Kunden-Slugs:** TeamFlex, Wolf_Street, SecuGuard, Schutzritter, Checkpoint_Regional, ZT_Security, LC_Security
(Wolf Street → Wolf_Street, ELC → LC_Security)

**Wenn mehrere Aufgaben / Update / nummerierte Liste (1. 2. 3. …):**
{
  "action": "customer_briefing",
  "slug": "Wolf_Street",
  "summary": "Kurznotiz 1–4 Sätze (Kontext, Gespräch, allgemein)",
  "todos": [
    {
      "aufgabe": "Imperativ, ein Satz",
      "kategorie": "eine aus der Liste unten",
      "prioritaet": "low|normal|high|urgent",
      "frist": "YYYY-MM-DD oder leer",
      "naechster_schritt": "optional"
    }
  ],
  "backlog_lines": [
    {"section": "Geparkt / später", "text": "nur wenn Querschnitt/Idee, nicht Kunden-ToDo"}
  ]
}

**Kategorien (exakt):**
Nachweis / Dokumentation | Kundenkommunikation | Vertrieb / Angebot | Software | Forderung / Finance | Audit / Zertifizierung | Einsatz / Operativ | Intern / Allgemein

**Eine einzelne Aufgabe:** {"action": "add_todo", "slug": "...", "aufgabe": "...", ...}

**Nur Frage, nichts Neues:** {"action": "question"}

Regeln:
- Jede nummerierte Zeile (1. … 7. …) = ein Eintrag in todos (nicht zusammenfassen).
- summary = Fließtext ohne die nummerierten Aufgaben.
- backlog_lines sparsam; Kundenarbeit gehört in todos.
Antwort NUR JSON, kein Markdown.
"""


@dataclass
class BriefingTodo:
    aufgabe: str
    kategorie: str = "Intern / Allgemein"
    prioritaet: str = "normal"
    frist: str = ""
    naechster_schritt: str = ""


@dataclass
class BacklogLine:
    section: str
    text: str


@dataclass
class BriefingPlan:
    slug: str
    display_name: str
    summary: str
    todos: list[BriefingTodo] = field(default_factory=list)
    backlog_lines: list[BacklogLine] = field(default_factory=list)
    rohinput: str = ""


@dataclass
class BriefingResult:
    plan: BriefingPlan
    todo_ids: list[str] = field(default_factory=list)
    paths_written: list[str] = field(default_factory=list)


def is_briefing_intent(text: str) -> bool:
    t = text.strip()
    if len(t) < 35:
        return False
    registry = load_registry()
    if not resolve_slug(t, registry):
        return False
    if BRIEFING_HINTS.search(t):
        return True
    if len(_extract_numbered_bodies(t)) >= 2:
        return True
    return False


def _backlog_line_id(text: str) -> str:
    h = hashlib.sha256(text.strip().encode()).hexdigest()[:8]
    return f"bk-{h}"


def _display_for_slug(slug: str, registry: dict) -> str:
    return next(
        (p["display_name"] for p in registry["projects"] if p["slug"] == slug),
        slug,
    )


def _extract_numbered_bodies(text: str) -> list[str]:
    bodies = [m.group(2).strip() for m in NUMBERED_LINE.finditer(text)]
    if len(bodies) >= 2:
        return bodies
    if not NUMBERED_INLINE.search(text):
        return bodies
    chunks = NUMBERED_INLINE.split(text)
    if len(chunks) < 2:
        return bodies
    inline: list[str] = []
    for chunk in chunks[1:]:
        chunk = chunk.strip()
        if not chunk:
            continue
        inline.append(chunk)
    return inline if len(inline) >= 2 else bodies


def parse_briefing_quick(text: str, registry: dict | None = None) -> BriefingPlan | None:
    registry = registry or load_registry()
    slug = resolve_slug(text, registry)
    if not slug:
        return None
    bodies = _extract_numbered_bodies(text)
    if len(bodies) < 2 and not BRIEFING_HINTS.search(text):
        return None
    todos: list[BriefingTodo] = []
    for body in bodies:
        body = body.strip().rstrip(".")
        if not body or len(body) < 4:
            continue
        todos.append(
            BriefingTodo(
                aufgabe=body,
                kategorie=guess_category(body),
                prioritaet=guess_priority(body),
                frist=parse_frist(body),
            )
        )
    if not todos:
        return None
    summary = NUMBERED_INLINE.sub(" ", text)
    summary = NUMBERED_LINE.sub("", summary).strip()
    summary = re.sub(r"\s+", " ", summary)[:2000]
    return BriefingPlan(
        slug=slug,
        display_name=_display_for_slug(slug, registry),
        summary=summary,
        todos=todos,
        rohinput=text.strip(),
    )


def structure_briefing_with_llm(text: str, registry: dict) -> BriefingPlan | None:
    from shared.api_client import ask_qwen

    raw = ask_qwen(
        BRIEFING_PROMPT,
        text,
        temperature=0.1,
        debug_meta={"bot": "hq_assistant", "mode": "briefing_extract"},
    )
    m = re.search(r"\{.*\}", raw, re.S)
    if not m:
        return None
    data = json.loads(m.group(0))
    action = data.get("action")
    if action == "question":
        return None
    if action == "add_todo":
        slug = data.get("slug")
        if slug:
            slug = resolve_slug(str(slug), registry) or slug
        if not slug:
            return None
        cat = data.get("kategorie") or guess_category(text)
        if cat not in CATEGORIES:
            cat = guess_category(text)
        return BriefingPlan(
            slug=slug,
            display_name=_display_for_slug(slug, registry),
            summary="",
            todos=[
                BriefingTodo(
                    aufgabe=data.get("aufgabe", "").strip(),
                    kategorie=cat,
                    prioritaet=data.get("prioritaet") or "normal",
                    frist=(data.get("frist") or "").strip(),
                    naechster_schritt=(data.get("naechster_schritt") or "").strip(),
                )
            ],
            rohinput=text.strip(),
        )
    if action != "customer_briefing":
        return None
    slug = data.get("slug")
    if slug:
        slug = resolve_slug(str(slug), registry) or slug
    if not slug or not (KP / slug).is_dir():
        return None
    todos: list[BriefingTodo] = []
    for item in data.get("todos") or []:
        if not isinstance(item, dict):
            continue
        aufgabe = (item.get("aufgabe") or "").strip()
        if not aufgabe:
            continue
        cat = item.get("kategorie") or guess_category(aufgabe)
        if cat not in CATEGORIES:
            cat = guess_category(aufgabe)
        todos.append(
            BriefingTodo(
                aufgabe=aufgabe,
                kategorie=cat,
                prioritaet=item.get("prioritaet") or guess_priority(aufgabe),
                frist=(item.get("frist") or "").strip(),
                naechster_schritt=(item.get("naechster_schritt") or "").strip(),
            )
        )
    backlog_lines: list[BacklogLine] = []
    for bl in data.get("backlog_lines") or []:
        if isinstance(bl, dict) and bl.get("text"):
            backlog_lines.append(
                BacklogLine(
                    section=(bl.get("section") or "Geparkt / später").strip(),
                    text=bl["text"].strip(),
                )
            )
    return BriefingPlan(
        slug=slug,
        display_name=_display_for_slug(slug, registry),
        summary=(data.get("summary") or "").strip(),
        todos=todos,
        backlog_lines=backlog_lines,
        rohinput=text.strip(),
    )


def plan_from_text(
    text: str, *, slug: str | None = None, use_llm: bool = True
) -> BriefingPlan | None:
    registry = load_registry()
    plan = parse_briefing_quick(text, registry)
    if plan is None and use_llm:
        try:
            plan = structure_briefing_with_llm(text, registry)
        except Exception:
            plan = None
    if plan and slug:
        plan.slug = slug
        plan.display_name = _display_for_slug(slug, registry)
    if plan and not plan.todos:
        return None
    return plan


def _append_eingang(plan: BriefingPlan, *, dry_run: bool) -> Path | None:
    if not plan.summary.strip():
        return None
    now = datetime.now(TZ).strftime("%Y-%m-%d %H:%M")
    block = (
        f"\n\n### {now} — {plan.display_name}\n\n"
        f"{plan.summary.strip()}\n\n"
        f"_Rohinput (Auszug):_ {plan.rohinput[:500]}{'…' if len(plan.rohinput) > 500 else ''}\n"
    )
    if dry_run:
        return EINGANG
    if not EINGANG.exists():
        EINGANG.write_text(
            "# Eingang — Rohnotizen\n\n"
            "Kurz parken. Erst ins BACKLOG (Pflege), oder HQ-Chat.\n\n- \n",
            encoding="utf-8",
        )
    content = EINGANG.read_text(encoding="utf-8").rstrip()
    EINGANG.write_text(content + block, encoding="utf-8")
    return EINGANG


def _append_status_note(plan: BriefingPlan, *, dry_run: bool) -> Path | None:
    if not plan.summary.strip():
        return None
    path = KP / plan.slug / "Status.md"
    if not path.exists():
        return None
    now = datetime.now(TZ).date().isoformat()
    block = f"\n\n### HQ-Notiz {now}\n\n{plan.summary.strip()}\n"
    if dry_run:
        return path
    content = path.read_text(encoding="utf-8").rstrip()
    if "## HQ-Notizen" not in content:
        content += "\n\n## HQ-Notizen (Assistant)\n"
    path.write_text(content + block, encoding="utf-8")
    return path


def _append_backlog_pflege_lines(
    lines: list[BacklogLine], *, dry_run: bool
) -> Path | None:
    if not lines or not BACKLOG.exists():
        return None
    text = BACKLOG.read_text(encoding="utf-8")
    if BACKLOG_PFLEGE_START not in text or BACKLOG_PFLEGE_END not in text:
        return None
    s = text.index(BACKLOG_PFLEGE_START)
    e = text.index(BACKLOG_PFLEGE_END)
    before, body, after = text[:s], text[s:e], text[e:]
    out_lines = body.splitlines()
    for item in lines:
        sec = item.section
        bid = _backlog_line_id(item.text)
        row = f"- [ ] {item.text} <!-- {bid} -->"
        inserted = False
        for i, ln in enumerate(out_lines):
            if ln.strip() == f"## {sec}":
                j = i + 1
                while j < len(out_lines) and not out_lines[j].startswith("## "):
                    j += 1
                out_lines.insert(j, row)
                inserted = True
                break
        if not inserted:
            out_lines.extend(["", f"## {sec}", "", row])
    new_body = "\n".join(out_lines)
    if dry_run:
        return BACKLOG
    BACKLOG.write_text(before + new_body + after, encoding="utf-8")
    return BACKLOG


def apply_briefing(
    plan: BriefingPlan, *, dry_run: bool = False, refresh: bool = True
) -> BriefingResult:
    registry = load_registry()
    result = BriefingResult(plan=plan)
    roh = plan.rohinput or plan.summary

    for item in plan.todos:
        draft = TodoDraft(
            aufgabe=item.aufgabe,
            projekt_slug=plan.slug,
            projekt_label=plan.display_name,
            kategorie=item.kategorie,
            frist=item.frist,
            prioritaet=item.prioritaet,
            naechster_schritt=item.naechster_schritt,
            rohinput=roh,
            quelle="hq_assistant_briefing",
        )
        todo_id, path = append_todo(draft, dry_run=dry_run)
        result.todo_ids.append(todo_id)
        rel = str(path.relative_to(REPO_ROOT))
        if rel not in result.paths_written:
            result.paths_written.append(rel)

    for extra in (
        _append_eingang(plan, dry_run=dry_run),
        _append_status_note(plan, dry_run=dry_run),
        _append_backlog_pflege_lines(plan.backlog_lines, dry_run=dry_run),
    ):
        if extra:
            rel = str(extra.relative_to(REPO_ROOT))
            if rel not in result.paths_written:
                result.paths_written.append(rel)

    if not dry_run and refresh:
        refresh_briefing()
        result.paths_written.extend(
            [
                "hq/00_Dashboard/ARBEITSUEBERSICHT.md",
                "hq/00_Dashboard/BACKLOG.md",
                "hq/00_Dashboard/Kunden_Uebersicht.md",
            ]
        )

    return result


def run_briefing_ingest(
    text: str,
    *,
    slug: str | None = None,
    use_llm: bool = True,
    dry_run: bool = False,
    refresh: bool = True,
) -> BriefingResult:
    plan = plan_from_text(text, slug=slug, use_llm=use_llm)
    if not plan:
        raise ValueError(
            "Kunden-Update nicht erkannt. Nenne den Kunden (z. B. Wolf Street) "
            "und nummeriere Aufgaben: 1. … 2. … — oder nutze den Chat in Cursor mit HQ Assistant."
        )
    return apply_briefing(plan, dry_run=dry_run, refresh=refresh and not dry_run)


def format_result_report(result: BriefingResult, *, dry_run: bool) -> str:
    p = result.plan
    mode = "DRY-RUN — würde schreiben" if dry_run else "geschrieben"
    lines = [
        f"[HQ-Assistant] Kunden-Update {mode}: **{p.display_name}** (`{p.slug}`)",
        f"  To-dos:    {len(result.todo_ids)} → {', '.join(result.todo_ids) or '—'}",
        f"  Notiz:     {'ja' if p.summary.strip() else '—'}",
        f"  Backlog:   {len(p.backlog_lines)} Pflege-Zeile(n)",
        "  Dateien:",
    ]
    for path in result.paths_written:
        lines.append(f"    - {path}")
    if not dry_run and "ARBEITSUEBERSICHT" in " ".join(result.paths_written):
        lines.append("  → Arbeitsübersicht & Backlog-Spiegel aktualisiert (Build).")
    return "\n".join(lines)
