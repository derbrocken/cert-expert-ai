"""Assemble read-only context from hq/ for the HQ Assistant."""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
HQ = REPO_ROOT / "hq"
DASH = HQ / "00_Dashboard"
KP = HQ / "03_Kundenprojekte"
REGISTRY = KP / "_registry.json"
BOARD = HQ / "02_Operations_Board" / "Operations_Board_Juni_2026.md"
SNAPSHOT = DASH / "operations_snapshot.md"

MAX_FILE_CHARS = 12_000
MAX_TOTAL_CHARS = 90_000

PORTFOLIO_INTENT_RE = re.compile(
    r"\b("
    r"blockiert|blocker|portfolio|alle kunden|welche kunden|"
    r"audits?\s+(stehen|in den|nächsten|naechsten|30)|"
    r"überfällig|ueberfaellig|overdue|"
    r"urgent|dringend|priorität|prioritaet|"
    r"forderung|forderungen|rechnung|"
    r"rote ampel|rote kunden|🔴|"
    r"wartet auf (kunde|dekra|auditor)|"
    r"wichtigste aufgaben|heute fokus|"
    r"was blockiert|geschäft|geschaeft"
    r")\b",
    re.I,
)

CROSS_FILES = [
    ("Forderungen", HQ / "05_Forderungen" / "Offene_Juni_2026.md"),
    ("Vertrieb", HQ / "04_Vertrieb" / "Angebote_Juni_2026.md"),
    ("Software", HQ / "06_Software" / "Software_Backlog_Juni_2026.md"),
    ("DFSS", HQ / "07_DFSS" / "Pilot_Measurement_Juni_2026.md"),
]


def refresh_briefing() -> None:
    script = HQ / "scripts" / "build_dashboard.py"
    subprocess.run(
        [sys.executable, str(script)],
        cwd=REPO_ROOT,
        check=True,
    )


def load_registry() -> dict:
    return json.loads(REGISTRY.read_text(encoding="utf-8"))


def _truncate(text: str, limit: int = MAX_FILE_CHARS) -> str:
    if len(text) <= limit:
        return text
    return text[: limit - 80] + "\n\n… [gekürzt für Kontextlimit]\n"


def detect_customer_slugs(question: str, registry: dict) -> list[str]:
    q = question.lower()
    found: list[str] = []
    for p in registry.get("projects", []):
        slug = p["slug"]
        names = {slug.lower(), slug.replace("_", " ").lower(), p["display_name"].lower()}
        names.update(a.lower() for a in p.get("aliases", []))
        if any(n in q for n in names if len(n) >= 4):
            found.append(slug)
    return found


def _read_block(label: str, path: Path) -> str | None:
    if not path.exists():
        return None
    body = _truncate(path.read_text(encoding="utf-8"))
    return f"### {label}\nPfad: `{path.relative_to(REPO_ROOT)}`\n\n{body}"


def is_portfolio_question(question: str, slugs: list[str]) -> bool:
    """Portfolio = keine Kundenerkennung oder explizite Übersichtsfrage."""
    if not question.strip():
        return True
    if PORTFOLIO_INTENT_RE.search(question):
        return True
    if slugs and not PORTFOLIO_INTENT_RE.search(question):
        return False
    return len(slugs) == 0


def build_context_pack(
    *,
    question: str = "",
    extra_slugs: list[str] | None = None,
    include_full_briefing: bool = False,
    include_cross: bool = False,
    force_portfolio: bool = False,
) -> tuple[str, list[str], str]:
    """Return (context_text, source_paths, mode) where mode is portfolio|customer."""
    registry = load_registry()
    slugs = list(dict.fromkeys((extra_slugs or []) + detect_customer_slugs(question, registry)))
    portfolio = force_portfolio or is_portfolio_question(question, slugs)

    blocks: list[str] = []
    sources: list[str] = []

    def add(label: str, path: Path) -> None:
        chunk = _read_block(label, path)
        if chunk:
            blocks.append(chunk)
            sources.append(str(path.relative_to(REPO_ROOT)))

    # Always: operations snapshot first (Phase 1)
    add("Operations Snapshot", SNAPSHOT)
    add("Tagesbriefing (Kurz)", DASH / "Tagesbriefing.md")
    add("Kundenübersicht", DASH / "Kunden_Uebersicht.md")

    if include_full_briefing:
        add("Tagesbriefing VOLL", DASH / "Tagesbriefing_VOLL.md")

    if portfolio:
        if include_cross or PORTFOLIO_INTENT_RE.search(question or ""):
            for label, path in CROSS_FILES:
                add(f"Querschnitt {label}", path)
        blocks.append(
            "### Modus\n"
            "**Portfolio-Frage** — antworte primär aus Operations Snapshot "
            "(Abschnitt Portfolio-Auswertungen). Keine vollständigen Kundenordner nötig."
        )
    else:
        for slug in slugs:
            base = KP / slug
            display = next(
                (p["display_name"] for p in registry["projects"] if p["slug"] == slug),
                slug,
            )
            add(f"{display} — Status", base / "Status.md")
            add(f"{display} — ToDos", base / "ToDos.md")
            if (base / "Audit_2026.md").exists():
                add(f"{display} — Audit 2026", base / "Audit_2026.md")
        blocks.append(
            "### Modus\n"
            f"**Kunden-Frage** ({', '.join(slugs)}) — Snapshot + Kundenordner kombinieren."
        )

    if include_cross and not portfolio:
        for label, path in CROSS_FILES:
            add(f"Querschnitt {label}", path)

    text = "\n\n---\n\n".join(blocks)
    if len(text) > MAX_TOTAL_CHARS:
        text = text[: MAX_TOTAL_CHARS - 120] + "\n\n… [Gesamtkontext gekürzt]\n"
    mode = "portfolio" if portfolio else "customer"
    return text, sources, mode


SYSTEM_PROMPT = """Du bist der **Cert-Expert HQ Assistant** — Organisation, Steuerung, To-dos.

## Quellen
- Antworte **nur** aus **HQ-KONTEXT** (primär `operations_snapshot.md`).
- Felder mit `(inferred)` oder `TBD`/`unbekannt` nicht als harte Fakten darstellen.
- Nichts erfinden. Fehlende Daten benennen.

## Antwortschablone — Portfolio-Fragen
1. **Kurzantwort** (1–3 Sätze)
2. **Tabelle oder Liste** (aus Snapshot § Portfolio-Auswertungen)
3. **Kritischste 3 Punkte**
4. **Nächste empfohlene Aktion**

## Antwortschablone — Kundenfragen
1. **Ampel**
2. **Auditdatum / Frist**
3. **Hauptblocker**
4. **Offene urgent To-dos** (kurz)
5. **Nächste Aktion**
6. **Quellen** (Dateipfade aus Snapshot/Kundenordner)

## To-dos schreiben
Terminal: `python -m bots.00_hq_assistant.hq_bot "todo TeamFlex: …"` — im Chat nur auf explizite Bitte in `ToDos.md` schreiben.

## Verboten
Keine GB/SK/EK-Dokumente, kein `knowledge/` für Normen, nichts als erledigt markieren ohne Beleg.
"""
