"""
Einsatzkonzept-Bot — Blueprint-driven Phase-1-Pipeline (EC).

Gleiche Pipeline wie gb_bot.py / sk_bot.py; anderer Blueprint, EC_*-Platzhalter,
EK-Wissen (einsatzkonzept/).

CLI:
    python -m bots.03_einsatzkonzept.ek_bot
    python -m bots.03_einsatzkonzept.ek_bot inputs/ec_event_kampfsport.json
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

LOG = "[EK-Bot]"
DEFAULT_INPUT = "inputs/ec_event_kampfsport.json"
DEFAULT_BLUEPRINT_ID = "ec_event_kampfsport"
MAX_RETRIES = 3
PIPELINE_VERSION = "1.0-ec-mvp"

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
        raw = ask_qwen(system_prompt, user_prompt, temperature=0.3, debug_meta=debug_meta)
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


def _slugify(text: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "_", text).strip("_").lower()
    return slug[:80] or "document"


def _build_output_paths(output_dir: Path, blueprint: Blueprint, data: dict[str, Any]) -> tuple[Path, Path]:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    name = _slugify(str(data.get("event_name") or blueprint.blueprint_id))
    base = f"{blueprint.blueprint_id}_{name}_{timestamp}"
    return output_dir / f"{base}.json", output_dir / f"{base}"


def _load_upstream_sk(data: dict[str, Any]) -> None:
    """
    Flow-ready behavior (MVP): if the caller provides a SK JSON path, import
    a minimal subset into the EK input fields.

    We intentionally keep this permissive and non-breaking:
    - Only runs when upstream_sk_available is truthy AND upstream_sk_path is non-empty.
    - Only fills sk_protection_goals / sk_key_measures if those fields are empty.
    - Never overwrites user-provided EK fields.
    """
    if not bool(data.get("upstream_sk_available")):
        return
    path = data.get("upstream_sk_path")
    if not isinstance(path, str) or not path.strip():
        return

    sk_path = (Path(path).expanduser() if path.startswith("~") else Path(path))
    if not sk_path.is_absolute():
        sk_path = Path.cwd() / sk_path
    if not sk_path.exists():
        return

    try:
        sk_raw = json.loads(sk_path.read_text(encoding="utf-8"))
    except Exception:
        return

    placeholders = sk_raw.get("placeholders") if isinstance(sk_raw, dict) else None
    if not isinstance(placeholders, dict):
        return

    if not data.get("sk_protection_goals"):
        sg = placeholders.get("SK_SCHUTZZIEL")
        if isinstance(sg, str) and sg.strip():
            data["sk_protection_goals"] = [sg.strip()]

    if not data.get("sk_key_measures"):
        sm = placeholders.get("SK_SCHUTZMASSNAHMEN")
        if isinstance(sm, str) and sm.strip():
            data["sk_key_measures"] = [sm.strip()]


def run(input_path: str, blueprint_id: str, output_mode: str) -> None:
    output_dir = Path("outputs")
    output_dir.mkdir(parents=True, exist_ok=True)

    try:
        blueprint = load_blueprint(blueprint_id)
    except BlueprintError as e:
        raise SystemExit(str(e))

    loaded = load_input(input_path, blueprint=blueprint)
    data: dict[str, Any] = loaded["data"]
    pre_open_points: list[str] = loaded["pre_open_points"]

    # Optional flow-ready import before prompt building.
    _load_upstream_sk(data)

    mods = knowledge_modules_considered(blueprint)
    print(f"{LOG} modules: {len(mods)}")

    system_prompt = build_system_prompt(blueprint)
    user_prompt = build_user_prompt(blueprint, data, pre_open_points)

    debug_meta = {
        "pipeline": PIPELINE_VERSION,
        "blueprint_id": blueprint.blueprint_id,
        "input_path": input_path,
    }

    model_json = _parse_with_retry(
        system_prompt=system_prompt,
        user_prompt=user_prompt,
        output_dir=output_dir,
        debug_meta=debug_meta,
    )

    reviewer_canonical = qa_check(model_json, pre_open_points, blueprint=blueprint)

    json_path, base_path = _build_output_paths(output_dir, blueprint, data)
    json_path.write_text(json.dumps(reviewer_canonical, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{LOG} wrote {json_path}")

    def _render(out_dict: dict[str, Any], suffix: str) -> None:
        out_path = f"{base_path}_{suffix}.docx"
        try:
            render_docx(bot_output=out_dict, output_path=out_path)
        except (DocxRenderError, Exception) as e:
            print(f"{LOG} WARN: DOCX renderer failed, falling back to draft writer: {e}")
            save_structured_docx(out_dict, out_path.replace(".docx", "_draft.docx"))

    if output_mode == "review":
        _render(reviewer_canonical, "review")
    elif output_mode == "final":
        if open_points_count(reviewer_canonical) > 0:
            print(f"{LOG} WARN: final mode requested but open_points present")
        _render(to_final_mode(reviewer_canonical), "final")
    elif output_mode == "both":
        _render(reviewer_canonical, "review")
        if open_points_count(reviewer_canonical) > 0:
            print(f"{LOG} WARN: final mode requested but open_points present")
        _render(to_final_mode(reviewer_canonical), "final")
    else:
        raise SystemExit(f"Unknown output_mode: {output_mode}")


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("input", nargs="?", default=DEFAULT_INPUT)
    p.add_argument("--blueprint", default=DEFAULT_BLUEPRINT_ID)
    p.add_argument("--output-mode", default=DEFAULT_OUTPUT_MODE, choices=VALID_OUTPUT_MODES)
    args = p.parse_args()

    run(args.input, args.blueprint, args.output_mode)


if __name__ == "__main__":
    main()

