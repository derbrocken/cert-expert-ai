#!/usr/bin/env python3
"""
HQ Assistant — Fragen & To-dos für hq/ (getrennt von GB/SK/EK).

Fragen:
  python -m bots.00_hq_assistant.hq_bot "Was steht bei TeamFlex an?"

To-dos (ohne LLM):
  python -m bots.00_hq_assistant.hq_bot --add -c TeamFlex --task "Wachbuch nachfassen"
  python -m bots.00_hq_assistant.hq_bot "todo TeamFlex: Monatsplan bis 11.06. dringend"

To-dos (Freitext + LM Studio):
  python -m bots.00_hq_assistant.hq_bot "Schutzritter soll VK bis Freitag liefern urgent"
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from .hq_context import (
    REPO_ROOT,
    SYSTEM_PROMPT,
    TERMINAL_HINT,
    build_context_pack,
    is_terminal_command,
    refresh_briefing,
)
from .hq_briefing import format_result_report, is_briefing_intent, run_briefing_ingest
from .hq_todos import CATEGORIES, ingest_todo_text, is_todo_intent

LOG = "[HQ-Assistant]"


def _reject_terminal_command() -> None:
    print(TERMINAL_HINT)


def _answer(question: str, context: str, sources: list[str], mode: str, *, temperature: float) -> str:
    from shared.api_client import ask_qwen

    user = (
        f"## HQ-KONTEXT\n\n{context}\n\n"
        f"---\n\n## Frage\n\n{question}\n\n"
        f"_(Modus: {mode}; Quellen: {', '.join(sources[:10])}"
        f"{'…' if len(sources) > 10 else ''})_"
    )
    return ask_qwen(
        SYSTEM_PROMPT,
        user,
        temperature=temperature,
        debug_meta={"bot": "hq_assistant", "sources": sources},
    )


def _run_briefing(
    text: str,
    *,
    slug: str | None,
    use_llm: bool,
    dry_run: bool,
    refresh: bool,
) -> None:
    try:
        result = run_briefing_ingest(
            text,
            slug=slug,
            use_llm=use_llm,
            dry_run=dry_run,
            refresh=refresh,
        )
    except ValueError as e:
        print(f"{LOG} {e}", file=sys.stderr)
        sys.exit(2)
    except FileNotFoundError as e:
        print(f"{LOG} {e}", file=sys.stderr)
        sys.exit(2)
    print(format_result_report(result, dry_run=dry_run))


def _run_add(
    text: str,
    *,
    slug: str | None,
    task: str | None,
    kategorie: str | None,
    frist: str | None,
    prioritaet: str | None,
    use_llm: bool,
    dry_run: bool,
    refresh: bool,
) -> None:
    try:
        draft, todo_id, path = ingest_todo_text(
            text,
            slug=slug,
            kategorie=kategorie,
            frist=frist,
            prioritaet=prioritaet,
            aufgabe=task,
            use_llm=use_llm,
            dry_run=dry_run,
        )
    except ValueError as e:
        print(f"{LOG} {e}", file=sys.stderr)
        sys.exit(2)
    except FileNotFoundError as e:
        print(f"{LOG} {e}", file=sys.stderr)
        sys.exit(2)

    rel = path.relative_to(REPO_ROOT)

    mode = "DRY-RUN — würde schreiben" if dry_run else "geschrieben"
    print(
        f"{LOG} To-do {mode}:\n"
        f"  ID:        {todo_id}\n"
        f"  Datei:     {rel}\n"
        f"  Aufgabe:   {draft.aufgabe}\n"
        f"  Priorität: {draft.prioritaet}\n"
        f"  Frist:     {draft.frist or '—'}\n"
        f"  Kategorie: {draft.kategorie}"
    )
    if not dry_run:
        if refresh:
            print(f"{LOG} Aktualisiere Briefing …")
            refresh_briefing()
        else:
            print(f"{LOG} Tipp: python3 hq/scripts/build_dashboard.py")


def main() -> None:
    parser = argparse.ArgumentParser(description="HQ Assistant — Fragen & To-dos (hq/)")
    parser.add_argument("question", nargs="?", help="Frage oder To-do-Text")
    parser.add_argument("--customer", "-c", metavar="SLUG", help="Kunden-Slug erzwingen")
    parser.add_argument("--add", action="store_true", help="Als To-do erfassen (nicht fragen)")
    parser.add_argument("--task", "-t", help="Aufgabe (mit --add)")
    parser.add_argument("--kategorie", choices=CATEGORIES, help="Kategorie")
    parser.add_argument("--frist", help="YYYY-MM-DD")
    parser.add_argument("--prioritaet", choices=["low", "normal", "high", "urgent"])
    parser.add_argument("--no-llm", action="store_true", help="Nur Regel-Parser, kein JSON-Extract")
    parser.add_argument("--refresh", action="store_true", help="Nach To-do: Briefing neu bauen")
    parser.add_argument("--full-briefing", action="store_true")
    parser.add_argument("--cross", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--interactive", "-i", action="store_true")
    parser.add_argument(
        "--no-refresh",
        action="store_true",
        help="Nach To-do/Briefing kein build_dashboard.py",
    )
    parser.add_argument("--temperature", type=float, default=0.2)
    args = parser.parse_args()
    auto_refresh = not args.no_refresh

    slug = args.customer

    def handle(text: str) -> None:
        t = text.strip()
        if not t:
            return

        if is_terminal_command(t):
            _reject_terminal_command()
            return

        if is_briefing_intent(t):
            _run_briefing(
                t,
                slug=slug,
                use_llm=not args.no_llm,
                dry_run=args.dry_run,
                refresh=auto_refresh,
            )
            return

        is_add = args.add or is_todo_intent(t) or (args.task and slug)
        if is_add and not args.task:
            _run_add(
                t,
                slug=slug,
                task=args.task,
                kategorie=args.kategorie,
                frist=args.frist,
                prioritaet=args.prioritaet,
                use_llm=not args.no_llm,
                dry_run=args.dry_run,
                refresh=args.refresh or auto_refresh,
            )
            return
        if args.add or args.task:
            _run_add(
                t or args.task or "",
                slug=slug,
                task=args.task,
                kategorie=args.kategorie,
                frist=args.frist,
                prioritaet=args.prioritaet,
                use_llm=not args.no_llm,
                dry_run=args.dry_run,
                refresh=args.refresh or auto_refresh,
            )
            return

        context, sources, mode = build_context_pack(
            question=t,
            extra_slugs=[slug] if slug else [],
            include_full_briefing=args.full_briefing,
            include_cross=args.cross,
        )
        print(f"{LOG} Modus: {mode} | Kontext: {len(context)} Zeichen, {len(sources)} Dateien")
        if args.dry_run:
            print(context[:5000])
            if len(context) > 5000:
                print(f"\n… ({len(context) - 5000} weitere Zeichen)")
            return
        try:
            reply = _answer(t, context, sources, mode, temperature=args.temperature)
        except Exception as e:
            print(f"{LOG} LLM nicht erreichbar ({e}).", file=sys.stderr)
            sys.exit(1)
        print(f"\n{reply}\n")

    if args.interactive:
        print(
            f"{LOG} Chat — Kunde + nummerierte Liste = Update (ToDos, EINGANG, Build); "
            f"todo TeamFlex: … = ein To-do; sonst Frage (quit = Ende)"
        )
        while True:
            try:
                q = input("\n> ").strip()
            except (EOFError, KeyboardInterrupt):
                print()
                break
            if q.lower() in ("quit", "exit", "q"):
                break
            if not q:
                continue
            handle(q)
        return

    if not args.question and not (args.add and args.task):
        parser.print_help()
        sys.exit(0)

    handle(args.question or args.task or "")


if __name__ == "__main__":
    main()
