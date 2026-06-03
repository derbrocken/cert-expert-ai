from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import requests

LM_STUDIO_URL = "http://127.0.0.1:1234/v1/chat/completions"
MODEL_NAME = "qwen/qwen3-30b-a3b-2507"

_PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEBUG_PROMPT_PATH = _PROJECT_ROOT / "outputs" / "debug_last_prompt.json"
CEKS_CANARY = "CEKS_ACCESS_CANARY_20260602_BEDUIN_GREEN_47291"


def write_debug_prompt(
    messages: list[dict[str, str]],
    *,
    meta: dict[str, Any] | None = None,
) -> Path:
    """Persist final LM Studio messages before the HTTP request (diagnostic)."""
    combined = "\n\n".join(m["content"] for m in messages)
    payload: dict[str, Any] = {
        "written_at": datetime.now(timezone.utc).isoformat(),
        "lm_studio_url": LM_STUDIO_URL,
        "model": MODEL_NAME,
        "messages": messages,
        "system_chars": len(messages[0]["content"]) if messages else 0,
        "user_chars": len(messages[1]["content"]) if len(messages) > 1 else 0,
        "combined_chars": len(combined),
        "canary": {
            "needle": CEKS_CANARY,
            "found_in_prompt": CEKS_CANARY in combined,
        },
        "meta": meta or {},
    }
    DEBUG_PROMPT_PATH.parent.mkdir(parents=True, exist_ok=True)
    DEBUG_PROMPT_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    return DEBUG_PROMPT_PATH


def ask_qwen(
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.3,
    *,
    debug_meta: dict[str, Any] | None = None,
) -> str:
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]
    write_debug_prompt(messages, meta=debug_meta)

    payload = {
        "model": MODEL_NAME,
        "messages": messages,
        "temperature": temperature,
    }

    response = requests.post(LM_STUDIO_URL, json=payload, timeout=300)
    response.raise_for_status()

    result = response.json()
    return result["choices"][0]["message"]["content"]