"""
shared/output_modes.py — Reviewer vs. customer rendering of bot output.

The Bot always produces ONE reviewer-canonical dict (the JSON we persist
to outputs/*.json). That dict contains:
  - every inline `[OFFENER PUNKT] …` substring inside placeholder values,
  - the full deduped `open_points` array,
  - `qa_status`.

For the customer-facing DOCX we render a derived view in which every
inline `[OFFENER PUNKT] …` substring is removed from each placeholder
value. The JSON is never overwritten.

Design constraints:
  - Pure function. No I/O, no logging.
  - Does NOT mutate its input.
  - Reviewer JSON remains the single source of truth — `open_points` is
    cleared on the *returned copy* only so the customer DOCX doesn't show
    a consolidated list of issues that have already been redacted from the
    body. The caller is responsible for warning when `open_points` was
    non-empty before stripping.

Stripping rules for inline OPs:
  - Match the literal token `[OFFENER PUNKT]` (Versalien, eckige Klammern)
    followed by everything up to the first sentence boundary — defined as
    `.`, `!`, `?`, newline, or end-of-string.
  - Remove any leading list-marker / whitespace on the same line so we
    don't leave dangling `- ` bullets.
  - Collapse the resulting double blank lines to single blank lines so the
    customer DOCX stays clean.
"""

from __future__ import annotations

import re
from typing import Any

OPEN_POINT_MARKER = "[OFFENER PUNKT]"

# Match the marker plus its sentence body. The body ends at the first
# `.`, `!`, `?`, hard newline, or end-of-string. We also swallow the
# sentence-final punctuation so the resulting prose reads cleanly.
#
# Greedy-but-bounded: `[^.\n!?]*` only matches inside one sentence.
_INLINE_OP_PATTERN = re.compile(
    r"\[OFFENER PUNKT\][^.\n!?]*[.!?]?",
    flags=re.UNICODE,
)

# After stripping an OP we sometimes leave behind a dangling list marker
# at the start of a line (e.g. `- ` or `* ` or `1. `). Match those when
# they sit on a line where nothing else is left.
_EMPTY_BULLET_LINE = re.compile(
    r"^[ \t]*(?:[-*•]|\d+\.)[ \t]*$",
    flags=re.MULTILINE,
)

_MULTIPLE_BLANKS = re.compile(r"\n[ \t]*\n[ \t]*\n+")
_TRAILING_WS = re.compile(r"[ \t]+$", flags=re.MULTILINE)


def strip_inline_open_points(text: str) -> str:
    """
    Remove every `[OFFENER PUNKT] …` substring from `text`.

    Preserves paragraph structure as far as possible; collapses leftover
    empty bullets and stray double-blank lines so the customer DOCX stays
    readable.
    """
    if not isinstance(text, str) or not text:
        return text

    out = _INLINE_OP_PATTERN.sub("", text)
    out = _EMPTY_BULLET_LINE.sub("", out)
    out = _TRAILING_WS.sub("", out)
    out = _MULTIPLE_BLANKS.sub("\n\n", out)
    return out.strip("\n")


def to_final_mode(reviewer_output: dict[str, Any]) -> dict[str, Any]:
    """
    Derive a customer-facing copy of `reviewer_output`.

    Behavior:
      - Returns a NEW dict; never mutates the input.
      - Every placeholder string is run through `strip_inline_open_points`.
      - `open_points` on the returned copy is cleared (the reviewer JSON
        keeps its full list — only the derived view drops them, because
        the customer DOCX should not display them).
      - `qa_status` on the returned copy is NOT changed. The renderer can
        still see `review_required` and the caller (gb_bot) is responsible
        for emitting a stderr warning if a final-mode render is requested
        while `open_points` was non-empty.
      - `meta` and `document_type` pass through unchanged.

    Args:
        reviewer_output: The enriched dict produced by `quality_checker`.

    Returns:
        Customer-facing dict, safe to pass to `shared/docx_builder.render_docx`.
    """
    final = dict(reviewer_output)

    raw_placeholders = final.get("placeholders") or {}
    stripped: dict[str, Any] = {}
    for key, value in raw_placeholders.items():
        if isinstance(value, str):
            stripped[key] = strip_inline_open_points(value)
        else:
            stripped[key] = value
    final["placeholders"] = stripped

    final["open_points"] = []
    return final


def open_points_count(reviewer_output: dict[str, Any]) -> int:
    """Convenience helper: how many open points does the reviewer view carry?"""
    points = reviewer_output.get("open_points") or []
    return len(points) if isinstance(points, list) else 0
