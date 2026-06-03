"""
Sicherheitskonzept-Bot — Blueprint-driven Phase-1-Pipeline.

Gleiche Pipeline wie gb_bot.py; anderer Blueprint, SK_*-Platzhalter, SK-Wissen.

CLI:
    python -m bots.02_sicherheitskonzept.sk_bot
    python -m bots.02_sicherheitskonzept.sk_bot inputs/sk_event_kampfsport.json
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from shared.api_client import ask_qwen
from shared.blueprint_loader import Blueprint, BlueprintError, load_blueprint
from shared.context_builder import (
    build_system_prompt,
    build_user_prompt,
    knowledge_modules_considered,
)
from shared.docx_builder import DocxRenderError, render_docx
from shared.docx_writer import save_structured_docx
from shared.input_loader import load_input
from shared.output_modes import open_points_count, to_final_mode
from shared.quality_checker import check as qa_check

LOG = "[SK-Bot]"
DEFAULT_INPUT = "inputs/sk_event_kampfsport.json"
DEFAULT_BLUEPRINT_ID = "sk_event_kampfsport"
MAX_RETRIES = 3
PIPELINE_VERSION = "1.0-sk-mvp"

VALID_OUTPUT_MODES = ("review", "final", "both")
DEFAULT_OUTPUT_MODE = "review"


def _strip_codefence(text: str) -> str:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()
        cleaned = "\n".join(
            line for line in lines if not line.strip().startswith("```")
        ).strip()
    return cleaned


def _extract_json_object(text: str) -> str | None:
    match = re.search(r"\{.*\}", text, flags=re.DOTALL)
    return match.group(0) if match else None


def _parse_with_retry(
    system_prompt: str,
    user_prompt: str,
    output_dir: Path,
    *,
    debug_meta: dict[str, Any] | None = None,
) -> dict[str, Any]:
    last_raw = ""
    for attempt in range(1, MAX_RETRIES + 1):
        raw = ask_qwen(
            system_prompt,
            user_prompt,
            temperature=0.3,
            debug_meta=debug_meta,
        )
        last_raw = raw
        cleaned = _strip_codefence(raw)
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            pass
        extracted = _extract_json_object(cleaned)
        if extracted is not None:
            try:
                return json.loads(extracted)
            except json.JSONDecodeError:
                pass
        print(f"[WARNUNG] JSON-Parse fehlgeschlagen (Versuch {attempt}/{MAX_RETRIES})")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    error_path = output_dir / f"raw_error_sk_{timestamp}.txt"
    error_path.write_text(last_raw, encoding="utf-8")
    raise RuntimeError(
        f"LLM hat nach {MAX_RETRIES} Versuchen kein valides JSON geliefert. "
        f"Rohausgabe: {error_path}"
    )


def _event_slug(data: dict[str, Any]) -> str:
    raw = data.get("event_name") or "dokument"
    slug = re.sub(r"[^a-z0-9]+", "_", raw.lower()).strip("_")
    return slug[:40] or "dokument"


def run(
    input_path: str = DEFAULT_INPUT,
    blueprint_id: str | None = None,
    output_mode: str = DEFAULT_OUTPUT_MODE,
) -> dict[str, Any]:
    if output_mode not in VALID_OUTPUT_MODES:
        raise SystemExit(
            f"{LOG} Ungültiger output_mode '{output_mode}'. "
            f"Erlaubt: {', '.join(VALID_OUTPUT_MODES)}"
        )

    blueprint: Blueprint | None = None
    if blueprint_id:
        try:
            blueprint = load_blueprint(blueprint_id)
        except BlueprintError as e:
            raise SystemExit(f"{LOG} {e}") from e

    print(f"\n{LOG} Lade Input: {input_path}")
    loaded = load_input(input_path, blueprint=blueprint)
    blueprint = loaded["blueprint"]
    data = loaded["data"]
    pre_open_points = loaded["pre_open_points"]

    print(f"{LOG} Aktiver Blueprint: {blueprint.blueprint_id} v{blueprint.version}")
    print(f"{LOG} Output-Modus: {output_mode}")
    if pre_open_points:
        print(f"{LOG} {len(pre_open_points)} offene Punkte aus Input:")
        for p in pre_open_points:
            print(f"  {p}")

    output_dir = Path("outputs")
    output_dir.mkdir(exist_ok=True)

    print(f"{LOG} Baue Kontext aus Blueprint-Wissensmodulen ...")
    system_prompt = build_system_prompt(blueprint)
    user_prompt = build_user_prompt(blueprint, data, pre_open_points)
    print(
        f"{LOG}   System-Prompt: {len(system_prompt):>6} Zeichen | "
        f"User-Prompt: {len(user_prompt)} Zeichen"
    )

    kmods = knowledge_modules_considered(blueprint)
    loaded_paths = [
        str(p) for paths in blueprint.context_module_paths.values() for p in paths
    ]
    debug_meta = {
        "blueprint_id": blueprint.blueprint_id,
        "bot": "sk_bot",
        "input_path": str(input_path),
        "knowledge_modules_considered": kmods,
        "knowledge_files_absolute": loaded_paths,
        "loads_knowledge_1_standards": any(
            "/1_standards/" in p.replace("\\", "/") for p in loaded_paths
        ),
    }
    print(
        f"{LOG}   Wissensmodule: {len(kmods)} | "
        f"1_standards: {debug_meta['loads_knowledge_1_standards']}"
    )
    print(f"{LOG} Sende Anfrage an LM Studio ...")
    print(f"{LOG}   Debug: outputs/debug_last_prompt.json")
    bot_output = _parse_with_retry(
        system_prompt, user_prompt, output_dir, debug_meta=debug_meta
    )

    print(f"{LOG} QA-Prüfung ...")
    reviewer_output = qa_check(bot_output, pre_open_points, blueprint=blueprint)

    event_slug = _event_slug(data)
    date_slug = datetime.now().strftime("%Y%m%d_%H%M%S")
    reviewer_output["knowledge_modules_considered"] = kmods
    reviewer_output["meta"] = {
        "created_at": datetime.now().isoformat(timespec="seconds"),
        "input_file": str(input_path),
        "blueprint_id": blueprint.blueprint_id,
        "blueprint_version": blueprint.version,
        "event_name": data.get("event_name", ""),
        "created_by": data.get("created_by", ""),
        "pipeline_version": PIPELINE_VERSION,
        "output_mode": output_mode,
        "knowledge_modules_considered": kmods,
    }

    json_path = output_dir / f"{blueprint.blueprint_id}_{event_slug}_{date_slug}.json"
    json_path.write_text(
        json.dumps(reviewer_output, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"{LOG} JSON gespeichert: {json_path}")

    base_stem = f"{blueprint.blueprint_id}_{event_slug}_{date_slug}"
    if output_mode in ("review", "both"):
        review_path = output_dir / f"{base_stem}_review.docx"
        print(f"{LOG} Rendere DOCX: {review_path.name}")
        _render_docx_with_fallback(reviewer_output, review_path)

    if output_mode in ("final", "both"):
        final_view = to_final_mode(reviewer_output)
        final_path = output_dir / f"{base_stem}_final.docx"
        print(f"{LOG} Rendere Final-DOCX: {final_path.name}")
        _render_docx_with_fallback(final_view, final_path)

    print(
        f"\n{LOG} Fertig — {reviewer_output.get('qa_status', 'review_required').upper()} | "
        f"OP: {len(reviewer_output.get('open_points', []))}"
    )
    return reviewer_output


def _render_docx_with_fallback(final_output: dict[str, Any], docx_path: Path) -> None:
    try:
        render_docx(bot_output=final_output, output_path=str(docx_path))
        return
    except (DocxRenderError, FileNotFoundError) as e:
        print(f"{LOG} WARNUNG: docx_builder — {e}; Fallback docx_writer.")
    except Exception as e:  # noqa: BLE001
        print(f"{LOG} WARNUNG: Render — {e}; Fallback docx_writer.")

    fallback_path = docx_path.with_name(docx_path.stem + "_draft.docx")
    save_structured_docx(final_output, str(fallback_path))


def _parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(prog="sk_bot", description="SK-Bot (Sicherheitskonzept)")
    parser.add_argument("input_path", nargs="?", default=DEFAULT_INPUT)
    parser.add_argument("--blueprint", dest="blueprint_id", default=None)
    parser.add_argument(
        "--output-mode",
        dest="output_mode",
        choices=VALID_OUTPUT_MODES,
        default=DEFAULT_OUTPUT_MODE,
    )
    return parser.parse_args(argv)


if __name__ == "__main__":
    ns = _parse_args(sys.argv[1:])
    run(
        input_path=ns.input_path,
        blueprint_id=ns.blueprint_id,
        output_mode=ns.output_mode,
    )
