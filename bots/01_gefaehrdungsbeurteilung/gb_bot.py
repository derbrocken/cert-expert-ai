"""
Gefährdungsbeurteilungs-Bot — Blueprint-driven Phase-1-Pipeline.

Pipeline:
  1. load_input(path) → Blueprint + data + pre_open_points
  2. context_builder.build_system_prompt(blueprint)
  3. context_builder.build_user_prompt(blueprint, data, pre_open_points)
  4. ask_qwen() with up to MAX_RETRIES JSON-parse retries  (ONE LLM call)
  5. quality_checker.check() with blueprint → reviewer-canonical dict
  6. Persist outputs/gb_{event}_{ts}.json (reviewer-canonical, no suffix)
  7. Render DOCX according to --output-mode:
       review : outputs/…_review.docx (reviewer view, inline OPs visible)
       final  : outputs/…_final.docx  (customer view, inline OPs stripped)
       both   : both files, ONE LLM call, two DOCX renders.
     If the renderer or template is unavailable, fall back to the legacy
     docx_writer so a draft document is still produced.

CLI:
    python -m bots.01_gefaehrdungsbeurteilung.gb_bot
    python -m bots.01_gefaehrdungsbeurteilung.gb_bot inputs/gb_event_kampfsport.json
    python -m bots.01_gefaehrdungsbeurteilung.gb_bot inputs/foo.json --blueprint gb_event_kampfsport
    python -m bots.01_gefaehrdungsbeurteilung.gb_bot inputs/foo.json --output-mode both
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

DEFAULT_INPUT = "inputs/gb_event_kampfsport.json"
DEFAULT_BLUEPRINT_ID = "gb_event_kampfsport"
MAX_RETRIES = 3
PIPELINE_VERSION = "1.3"

VALID_OUTPUT_MODES = ("review", "final", "both")
DEFAULT_OUTPUT_MODE = "review"


# ── LLM call + JSON parsing with retry ──────────────────────────────────────

def _strip_codefence(text: str) -> str:
    """Remove a leading/trailing ```...``` block if present."""
    cleaned = text.strip()
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()
        cleaned = "\n".join(
            line for line in lines if not line.strip().startswith("```")
        ).strip()
    return cleaned


def _extract_json_object(text: str) -> str | None:
    """
    Best-effort: extract the first top-level JSON object from `text`.
    Used as a fallback if the model wraps the JSON in prose.
    """
    match = re.search(r"\{.*\}", text, flags=re.DOTALL)
    return match.group(0) if match else None


def _parse_with_retry(
    system_prompt: str,
    user_prompt: str,
    output_dir: Path,
) -> dict[str, Any]:
    last_raw = ""
    for attempt in range(1, MAX_RETRIES + 1):
        raw = ask_qwen(system_prompt, user_prompt, temperature=0.3)
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
    error_path = output_dir / f"raw_error_{timestamp}.txt"
    error_path.write_text(last_raw, encoding="utf-8")
    raise RuntimeError(
        f"LLM hat nach {MAX_RETRIES} Versuchen kein valides JSON geliefert. "
        f"Rohausgabe gespeichert: {error_path}"
    )


# ── Filename helpers ────────────────────────────────────────────────────────

def _event_slug(data: dict[str, Any]) -> str:
    raw = data.get("event_name") or "dokument"
    slug = re.sub(r"[^a-z0-9]+", "_", raw.lower()).strip("_")
    return slug[:40] or "dokument"


# ── Public entry point ─────────────────────────────────────────────────────

def run(
    input_path: str = DEFAULT_INPUT,
    blueprint_id: str | None = None,
    output_mode: str = DEFAULT_OUTPUT_MODE,
) -> dict[str, Any]:
    """
    Execute the full Phase-1 GB pipeline for one input file.

    Args:
        input_path:   Path to the input JSON (envelope or legacy flat).
        blueprint_id: Override blueprint. None → loader picks from envelope.
        output_mode:  "review" | "final" | "both".

    Returns:
        Reviewer-canonical dict (same shape as the persisted JSON).
    """
    if output_mode not in VALID_OUTPUT_MODES:
        raise SystemExit(
            f"[GB-Bot] Ungültiger output_mode '{output_mode}'. "
            f"Erlaubt: {', '.join(VALID_OUTPUT_MODES)}"
        )

    blueprint: Blueprint | None = None
    if blueprint_id:
        try:
            blueprint = load_blueprint(blueprint_id)
        except BlueprintError as e:
            raise SystemExit(f"[GB-Bot] {e}") from e

    print(f"\n[GB-Bot] Lade Input: {input_path}")
    loaded = load_input(input_path, blueprint=blueprint)
    blueprint = loaded["blueprint"]
    data: dict[str, Any] = loaded["data"]
    pre_open_points: list[str] = loaded["pre_open_points"]

    print(f"[GB-Bot] Aktiver Blueprint: {blueprint.blueprint_id} v{blueprint.version}")
    print(f"[GB-Bot] Output-Modus: {output_mode}")
    if pre_open_points:
        print(f"[GB-Bot] {len(pre_open_points)} offene Punkte aus Input erkannt:")
        for p in pre_open_points:
            print(f"  {p}")

    output_dir = Path("outputs")
    output_dir.mkdir(exist_ok=True)

    print("[GB-Bot] Baue Kontext aus Blueprint-Wissensmodulen ...")
    system_prompt = build_system_prompt(blueprint)
    user_prompt = build_user_prompt(blueprint, data, pre_open_points)
    print(f"[GB-Bot]   System-Prompt: {len(system_prompt):>6} Zeichen | "
          f"User-Prompt: {len(user_prompt)} Zeichen")

    print("[GB-Bot] Sende Anfrage an LM Studio (1 LLM-Call) ...")
    bot_output = _parse_with_retry(system_prompt, user_prompt, output_dir)

    print("[GB-Bot] QA-Prüfung ...")
    reviewer_output = qa_check(bot_output, pre_open_points, blueprint=blueprint)

    event_slug = _event_slug(data)
    date_slug = datetime.now().strftime("%Y%m%d_%H%M%S")

    kmods = knowledge_modules_considered(blueprint)
    reviewer_output["knowledge_modules_considered"] = kmods

    reviewer_output["meta"] = {
        "created_at":        datetime.now().isoformat(timespec="seconds"),
        "input_file":        str(input_path),
        "blueprint_id":      blueprint.blueprint_id,
        "blueprint_version": blueprint.version,
        "event_name":        data.get("event_name", ""),
        "created_by":        data.get("created_by", ""),
        "pipeline_version":  PIPELINE_VERSION,
        "output_mode":       output_mode,
        "knowledge_modules_considered": kmods,
    }

    json_name = f"{blueprint.blueprint_id}_{event_slug}_{date_slug}.json"
    json_path = output_dir / json_name
    json_path.write_text(
        json.dumps(reviewer_output, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"[GB-Bot] JSON (reviewer-canonical) gespeichert: {json_path}")

    base_stem = f"{blueprint.blueprint_id}_{event_slug}_{date_slug}"

    if output_mode in ("review", "both"):
        review_path = output_dir / f"{base_stem}_review.docx"
        print(f"[GB-Bot] Rendere Reviewer-DOCX: {review_path.name}")
        _render_docx_with_fallback(reviewer_output, review_path, blueprint)

    if output_mode in ("final", "both"):
        op_count = open_points_count(reviewer_output)
        if op_count > 0:
            first_three = reviewer_output.get("open_points", [])[:3]
            print(
                f"[GB-Bot] WARNUNG (final): {op_count} offene Punkte werden "
                f"NICHT im Kundendokument erscheinen. Erste 3: {first_three}",
                file=sys.stderr,
            )
        final_view = to_final_mode(reviewer_output)
        final_path = output_dir / f"{base_stem}_final.docx"
        print(f"[GB-Bot] Rendere Kunden-DOCX:  {final_path.name}")
        _render_docx_with_fallback(final_view, final_path, blueprint)

    qa_status = reviewer_output.get("qa_status", "review_required")
    open_count = len(reviewer_output.get("open_points", []))
    print(
        f"\n[GB-Bot] Fertig — QA-Status: {qa_status.upper()} | "
        f"Offene Punkte: {open_count} | Blueprint: {blueprint.blueprint_id} | "
        f"Modus: {output_mode}"
    )

    return reviewer_output


def _render_docx_with_fallback(
    final_output: dict[str, Any],
    docx_path: Path,
    blueprint: Blueprint,
) -> None:
    """
    Try the production renderer first (uses the blueprint's .docx template).
    Fall back to the legacy docx_writer so a draft document is always produced.
    """
    try:
        render_docx(bot_output=final_output, output_path=str(docx_path))
        return
    except (DocxRenderError, FileNotFoundError) as e:
        print(
            f"[GB-Bot] WARNUNG: Render via docx_builder fehlgeschlagen "
            f"({type(e).__name__}: {e}). "
            f"Fallback auf docx_writer (Entwurfsdokument)."
        )
    except Exception as e:  # noqa: BLE001
        print(
            f"[GB-Bot] WARNUNG: Unerwarteter Render-Fehler "
            f"({type(e).__name__}: {e}). Fallback auf docx_writer."
        )

    fallback_path = docx_path.with_name(docx_path.stem + "_draft.docx")
    save_structured_docx(final_output, str(fallback_path))


# ── CLI ─────────────────────────────────────────────────────────────────────

def _parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog="gb_bot",
        description=(
            "Blueprint-driven Gefährdungsbeurteilungs-Bot. "
            "Ein LLM-Call; renders one or two DOCX variants from the same "
            "reviewer-canonical JSON."
        ),
    )
    parser.add_argument(
        "input_path",
        nargs="?",
        default=DEFAULT_INPUT,
        help=f"Pfad zur Input-JSON (default: {DEFAULT_INPUT}).",
    )
    parser.add_argument(
        "--blueprint",
        dest="blueprint_id",
        default=None,
        help=(
            "Optionaler Blueprint-Override. Ohne Angabe wird der Blueprint "
            "aus dem Envelope oder dem Default ermittelt."
        ),
    )
    parser.add_argument(
        "--output-mode",
        dest="output_mode",
        choices=VALID_OUTPUT_MODES,
        default=DEFAULT_OUTPUT_MODE,
        help=(
            "review = reviewer DOCX mit inline [OFFENER PUNKT]; "
            "final = Kunden-DOCX ohne inline OPs; "
            "both = beide DOCX, ein LLM-Call. JSON bleibt immer reviewer-canonical."
        ),
    )
    return parser.parse_args(argv)


if __name__ == "__main__":
    ns = _parse_args(sys.argv[1:])
    run(
        input_path=ns.input_path,
        blueprint_id=ns.blueprint_id,
        output_mode=ns.output_mode,
    )
