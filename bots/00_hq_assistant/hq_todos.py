"""Append structured TODO blocks to hq/ markdown files."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

from .hq_context import HQ, KP, REGISTRY, load_registry

TZ = ZoneInfo("Europe/Berlin")

CATEGORIES = (
    "Nachweis / Dokumentation",
    "Kundenkommunikation",
    "Vertrieb / Angebot",
    "Software",
    "Forderung / Finance",
    "Audit / Zertifizierung",
    "Einsatz / Operativ",
    "Intern / Allgemein",
)

CATEGORY_BY_KEYWORD: list[tuple[str, str]] = [
    (r"wachbuch|nachweis|dokument|unterlage|ordner|upload", "Nachweis / Dokumentation"),
    (r"kunde|anruf|mail|rückmeldung|gespräch", "Kundenkommunikation"),
    (r"angebot|vertrieb|preis|lv\b", "Vertrieb / Angebot"),
    (r"\b(portal|software|hetzner|tool-?2)\b", "Software"),
    (r"rechnung|forderung|mahnung|zahlung|€|euro", "Forderung / Finance"),
    (r"audit|din\b|dekra|zertif|nc\b|abweichung", "Audit / Zertifizierung"),
    (r"einsatz|veranstaltung|sk\b|ek\b", "Einsatz / Operativ"),
]

CROSS_FILE_BY_CATEGORY: dict[str, Path] = {
    "Vertrieb / Angebot": HQ / "04_Vertrieb" / "Angebote_Juni_2026.md",
    "Forderung / Finance": HQ / "05_Forderungen" / "Offene_Juni_2026.md",
    "Software": HQ / "06_Software" / "Software_Backlog_Juni_2026.md",
}

SLUG_ID_PREFIX: dict[str, str] = {
    "TeamFlex": "tf",
    "Wolf_Street": "ws",
    "SecuGuard": "sg",
    "Schutzritter": "sr",
    "Checkpoint_Regional": "cp",
    "ZT_Security": "zt",
    "LC_Security": "lc",
}

TODO_INTENT_RE = re.compile(
    r"^(?:todo|aufgabe|task|\+)\s+(.+)$",
    re.I,
)
PREFIX_PROJECT_RE = re.compile(r"^([^:]{2,80}):\s*(.+)$", re.S)


@dataclass
class TodoDraft:
    aufgabe: str
    projekt_slug: str | None
    projekt_label: str
    kategorie: str
    frist: str
    prioritaet: str
    naechster_schritt: str
    rohinput: str
    quelle: str = "hq_assistant"


def _today() -> date:
    return datetime.now(TZ).date()


def resolve_slug(text: str, registry: dict) -> str | None:
    t = text.lower().strip()
    for p in registry.get("projects", []):
        slug = p["slug"]
        names = {slug.lower(), slug.replace("_", " ").lower(), p["display_name"].lower()}
        names.update(a.lower() for a in p.get("aliases", []))
        for n in sorted(names, key=len, reverse=True):
            if len(n) >= 3 and n in t:
                return slug
    return None


def guess_category(text: str) -> str:
    low = text.lower()
    for pattern, cat in CATEGORY_BY_KEYWORD:
        if re.search(pattern, low):
            return cat
    return "Intern / Allgemein"


def guess_priority(text: str) -> str:
    low = text.lower()
    if re.search(r"\b(dringend|urgent|asap|sofort|kritisch)\b", low):
        return "urgent"
    if re.search(r"\b(wichtig|high|bald)\b", low):
        return "high"
    return "normal"


def parse_frist(text: str, *, base: date | None = None) -> str:
    base = base or _today()
    low = text.lower()
    if re.search(r"\b(morgen)\b", low):
        return (base + timedelta(days=1)).isoformat()
    if re.search(r"\b(übermorgen|uebermorgen)\b", low):
        return (base + timedelta(days=2)).isoformat()
    m = re.search(r"\b(\d{4})-(\d{2})-(\d{2})\b", text)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
    m = re.search(r"\b(\d{1,2})\.(\d{1,2})\.(\d{4})\b", text)
    if m:
        d, mo, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
        try:
            return date(y, mo, d).isoformat()
        except ValueError:
            return ""
    m = re.search(r"\bbis\s+(\d{1,2})\.(\d{1,2})\b", low)
    if m:
        d, mo = int(m.group(1)), int(m.group(2))
        y = base.year
        try:
            return date(y, mo, d).isoformat()
        except ValueError:
            return ""
    return ""


def is_todo_intent(text: str) -> bool:
    t = text.strip()
    if TODO_INTENT_RE.match(t):
        return True
    if re.search(r"\b(todo|aufgabe)\s*:", t, re.I):
        return True
    m = PREFIX_PROJECT_RE.match(t)
    if m:
        tail = m.group(2).strip().lower()
        if "?" in tail or re.match(
            r"^(was|wie|welche|wann|wo|wer|status|überblick|ueberblick|zeig|liste)\b",
            tail,
        ):
            return False
        return resolve_slug(m.group(1), load_registry()) is not None
    return False


def normalize_input(text: str) -> str:
    t = text.strip()
    m = TODO_INTENT_RE.match(t)
    if m:
        return m.group(1).strip()
    m = re.match(r"^(?:todo|aufgabe)\s*:\s*(.+)$", t, re.I)
    if m:
        return m.group(1).strip()
    return t


def parse_todo_quick(text: str, registry: dict | None = None) -> TodoDraft | None:
    registry = registry or load_registry()
    raw = text.strip()
    body = normalize_input(raw)
    slug: str | None = None
    aufgabe = body

    m = PREFIX_PROJECT_RE.match(body)
    if m:
        head, tail = m.group(1).strip(), m.group(2).strip()
        slug = resolve_slug(head, registry) or resolve_slug(body, registry)
        if slug:
            aufgabe = tail
        else:
            slug = resolve_slug(body, registry)

    if not slug:
        slug = resolve_slug(body, registry)

    if not slug and not any(
        cat in body for cat in ("Vertrieb", "Forderung", "Software", "Intern")
    ):
        return None

    aufgabe = re.sub(
        r"\s*[\(\[]?\s*(dringend|urgent|bis\s+[^.\n]+)\s*[\)\]]?\s*$",
        "",
        aufgabe,
        flags=re.I,
    ).strip()
    if not aufgabe:
        return None

    kategorie = guess_category(body)
    if slug:
        display = next(
            (p["display_name"] for p in registry["projects"] if p["slug"] == slug),
            slug,
        )
        projekt_label = display
    else:
        projekt_label = "(Querschnitt)"
        slug = None

    return TodoDraft(
        aufgabe=aufgabe,
        projekt_slug=slug,
        projekt_label=projekt_label,
        kategorie=kategorie,
        frist=parse_frist(body),
        prioritaet=guess_priority(body),
        naechster_schritt="",
        rohinput=raw,
    )


STRUCTURE_PROMPT = """Du extrahierst aus einer Nutzer-Nachricht genau ein JSON-Objekt für einen HQ-To-do-Eintrag.

Erlaubte Projekte (slug): TeamFlex, Wolf_Street, SecuGuard, Schutzritter, Checkpoint_Regional, ZT_Security, LC_Security.
Wenn kein Kundenprojekt passt: slug null und passende Querschnitt-Kategorie.

Kategorien (exakt einer):
Nachweis / Dokumentation | Kundenkommunikation | Vertrieb / Angebot | Software | Forderung / Finance | Audit / Zertifizierung | Einsatz / Operativ | Intern / Allgemein

Antwort NUR als JSON, kein Markdown:
{
  "action": "add_todo",
  "slug": "TeamFlex oder null",
  "aufgabe": "Imperativ, ein Satz",
  "kategorie": "...",
  "prioritaet": "low|normal|high|urgent",
  "frist": "YYYY-MM-DD oder leerer String",
  "naechster_schritt": "konkrete Handlung oder leer"
}

Wenn die Nachricht keine neue Aufgabe ist: {"action": "question"}
"""


def structure_todo_with_llm(text: str, registry: dict) -> TodoDraft | None:
    from shared.api_client import ask_qwen

    raw = ask_qwen(
        STRUCTURE_PROMPT,
        text,
        temperature=0.1,
        debug_meta={"bot": "hq_assistant", "mode": "todo_extract"},
    )
    m = re.search(r"\{.*\}", raw, re.S)
    if not m:
        return None
    data = json.loads(m.group(0))
    if data.get("action") != "add_todo":
        return None
    slug = data.get("slug")
    if slug and not (KP / slug).is_dir():
        slug = resolve_slug(str(slug), registry) or slug
    kategorie = data.get("kategorie") or guess_category(text)
    if kategorie not in CATEGORIES:
        kategorie = guess_category(text)
    label = (
        next((p["display_name"] for p in registry["projects"] if p["slug"] == slug), slug)
        if slug
        else "(Querschnitt)"
    )
    return TodoDraft(
        aufgabe=data.get("aufgabe", "").strip(),
        projekt_slug=slug,
        projekt_label=label or "(Querschnitt)",
        kategorie=kategorie,
        frist=(data.get("frist") or "").strip(),
        prioritaet=data.get("prioritaet") or "normal",
        naechster_schritt=(data.get("naechster_schritt") or "").strip(),
        rohinput=text.strip(),
    )


def target_path(draft: TodoDraft) -> Path:
    if draft.projekt_slug:
        path = KP / draft.projekt_slug / "ToDos.md"
        if path.exists():
            return path
    if draft.kategorie in CROSS_FILE_BY_CATEGORY:
        cross = CROSS_FILE_BY_CATEGORY[draft.kategorie]
        if cross.exists():
            return cross
    raise FileNotFoundError(
        "Kein Ziel: Kunde unbekannt und keine Querschnitt-Datei. "
        "Nutze Präfix „TeamFlex:“ oder -c SLUG."
    )


def new_todo_id(path: Path, slug: str | None) -> str:
    day = datetime.now(TZ).strftime("%Y%m%d")
    prefix = SLUG_ID_PREFIX.get(slug or "", "hq")
    text = path.read_text(encoding="utf-8") if path.exists() else ""
    nums = [int(x) for x in re.findall(rf"TODO-{day}-{prefix}(\d+)", text)]
    n = (max(nums) if nums else 0) + 1
    return f"TODO-{day}-{prefix}{n:02d}"


def format_block(todo_id: str, draft: TodoDraft) -> str:
    now = datetime.now(TZ).isoformat(timespec="seconds")
    projekt_field = draft.projekt_slug or draft.projekt_label
    if draft.projekt_slug:
        projekt_field = draft.projekt_slug
    elif draft.projekt_label != "(Querschnitt)":
        projekt_field = draft.projekt_label
    else:
        projekt_field = "(Querschnitt)"

    lines = [
        f"## {todo_id}",
        "",
        f"- **Aufgabe:** {draft.aufgabe}",
        f"- **Projekt:** {projekt_field}",
        f"- **Kategorie:** {draft.kategorie}",
        "- **Verantwortlich:** (unassigned)",
        f"- **Frist:** {draft.frist}",
        "- **Status:** open",
        f"- **Priorität:** {draft.prioritaet}",
        f"- **Quelle:** {draft.quelle}",
        f"- **Nächster Schritt:** {draft.naechster_schritt or '(festlegen)'}",
        f"- **Erstellt:** {now}",
        f"- **Rohinput:** {draft.rohinput}",
    ]
    return "\n".join(lines)


def _insert_under_offen(content: str, block: str) -> str:
    marker = "## Offen"
    idx = content.find(marker)
    if idx == -1:
        raise ValueError(f"Abschnitt {marker} fehlt in ToDos-Datei")
    start = idx + len(marker)
    rest = content[start:]
    next_h2 = re.search(r"\n## ", rest)
    insert_at = start + (next_h2.start() if next_h2 else len(rest))
    before = content[:insert_at].rstrip()
    after = content[insert_at:]
    if not after.startswith("\n"):
        after = "\n" + after
    return f"{before}\n\n{block}\n{after}"


def _touch_updated_line(content: str) -> str:
    today = _today().isoformat()
    if "**Letzte Aktualisierung:**" in content:
        return re.sub(
            r"\*\*Letzte Aktualisierung:\*\*[^\n]*",
            f"**Letzte Aktualisierung:** {today} (HQ Assistant)",
            content,
            count=1,
        )
    return content


def append_todo(draft: TodoDraft, *, dry_run: bool = False) -> tuple[str, Path]:
    path = target_path(draft)
    if not path.exists():
        raise FileNotFoundError(f"Zieldatei fehlt: {path}")

    todo_id = new_todo_id(path, draft.projekt_slug)
    block = format_block(todo_id, draft)

    if dry_run:
        return todo_id, path

    content = path.read_text(encoding="utf-8")
    content = _insert_under_offen(content, block)
    content = _touch_updated_line(content)
    path.write_text(content, encoding="utf-8")
    return todo_id, path


def ingest_todo_text(
    text: str,
    *,
    slug: str | None = None,
    kategorie: str | None = None,
    frist: str | None = None,
    prioritaet: str | None = None,
    aufgabe: str | None = None,
    use_llm: bool = True,
    dry_run: bool = False,
) -> tuple[TodoDraft, str, Path]:
    registry = load_registry()
    draft: TodoDraft | None = None

    if aufgabe:
        draft = TodoDraft(
            aufgabe=aufgabe.strip(),
            projekt_slug=slug,
            projekt_label=next(
                (p["display_name"] for p in registry["projects"] if p["slug"] == slug),
                slug or "(Querschnitt)",
            ),
            kategorie=kategorie or guess_category(aufgabe),
            frist=frist or "",
            prioritaet=prioritaet or "normal",
            naechster_schritt="",
            rohinput=text or aufgabe,
        )
    else:
        draft = parse_todo_quick(text, registry)
        if draft is None and use_llm:
            try:
                draft = structure_todo_with_llm(text, registry)
            except Exception:
                draft = None
        if draft and slug:
            draft.projekt_slug = slug
            draft.projekt_label = next(
                (p["display_name"] for p in registry["projects"] if p["slug"] == slug),
                slug,
            )

    if not draft or not draft.aufgabe:
        raise ValueError(
            "To-do nicht erkannt. Formate:\n"
            "  todo TeamFlex: Wachbuch bis morgen\n"
            "  TeamFlex: Kunde anrufen dringend\n"
            "  --add -c TeamFlex --task \"...\""
        )

    if slug and not draft.projekt_slug:
        draft.projekt_slug = slug
    if kategorie:
        draft.kategorie = kategorie
    if frist is not None:
        draft.frist = frist
    if prioritaet:
        draft.prioritaet = prioritaet

    todo_id, path = append_todo(draft, dry_run=dry_run)
    return draft, todo_id, path
