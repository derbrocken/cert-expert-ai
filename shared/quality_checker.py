"""
shared/quality_checker.py — Standalone-QA für Bot-Output.

Phase 1 — verarbeitet:
- pre_open_points aus dem Input-Loader
- explizite open_points aus dem Bot-Output
- leere oder mit [OFFENER PUNKT] markierte Platzhalterwerte
- inline `[OFFENER PUNKT] …` Substrings innerhalb von Platzhalterwerten:
  jeder einzelne Befund wird extrahiert und in `open_points` gemerged
  (Quelle der Wahrheit für die JSON-Persistenz)
- fehlende Pflicht-Platzhalter (ai_blocks) gemäß Blueprint
- Vollständigkeits-Check: jede in `GB_GEFAEHRDUNGEN` namentlich aufgeführte
  Gefährdung muss in `GB_RISIKOBEWERTUNG` mit derselben Bezeichnung
  bewertet sein. Fehlt sie, wird ein `[OFFENER PUNKT]` ergänzt.
- Konsolidierung und Dedup aller Befunde
- qa_status: 'ok' nur wenn 0 offene Punkte
"""

from __future__ import annotations

import re
from typing import Any

OPEN_POINT_MARKER = "[OFFENER PUNKT]"

# Match `[OFFENER PUNKT] …` substrings inside a placeholder body up to the
# next sentence boundary (., !, ?, newline) or end-of-string. We keep the
# punctuation off the captured group so the canonical open_point string
# reads cleanly when shown in the JSON or in a UI.
_INLINE_OP_EXTRACT = re.compile(
    r"\[OFFENER PUNKT\][^.\n!?]*",
    flags=re.UNICODE,
)

# Recognize lines from `GB_RISIKOBEWERTUNG` that name a Gefährdung. The
# guide enforces "Gefährdung: <name>" as the first line per entry; we
# match that key explicitly so we don't confuse it with prose.
_RISK_GEFAEHRDUNG_LINE = re.compile(
    r"^\s*Gefährdung\s*:\s*(.+?)\s*$",
    flags=re.MULTILINE | re.UNICODE,
)


def check(
    bot_output: dict[str, Any],
    pre_open_points: list[str],
    blueprint=None,
) -> dict[str, Any]:
    """
    Validate and enrich bot output with QA findings.

    Args:
        bot_output:      Parsed JSON dict the LLM returned.
        pre_open_points: Open points detected by the input loader before
                         the LLM was called.
        blueprint:       Optional Blueprint instance. If provided, all
                         `ai_blocks` are required to be present (non-empty)
                         in `placeholders`. Missing ones become open points.

    Returns:
        Enriched copy of bot_output. Fields added/overwritten:
            placeholders : ensured-dict-of-strings
            open_points  : deduped list of OFFENER PUNKT strings
            qa_status    : 'ok' if no open points, else 'review_required'
    """
    result = dict(bot_output)
    placeholders = dict(result.get("placeholders") or {})

    if blueprint is not None:
        for key in blueprint.ai_blocks:
            placeholders.setdefault(key, "")

    result["placeholders"] = placeholders

    existing_open_points = list(result.get("open_points") or [])
    placeholder_findings: list[str] = []
    inline_findings: list[str] = []

    for key, value in placeholders.items():
        text = _coerce_str(value)
        stripped = text.strip()
        if stripped == "":
            placeholder_findings.append(
                f"{OPEN_POINT_MARKER} Platzhalter '{key}' nicht befüllt"
            )
            continue

        for match in _INLINE_OP_EXTRACT.findall(text):
            canonical = _canonicalize_open_point(match)
            if canonical:
                inline_findings.append(canonical)

    coverage_findings = _coverage_findings(placeholders)

    all_points = (
        existing_open_points
        + placeholder_findings
        + inline_findings
        + coverage_findings
        + list(pre_open_points)
    )

    result["open_points"] = _dedup_preserve_order(all_points)
    result["qa_status"] = "ok" if not result["open_points"] else "review_required"

    if blueprint is not None:
        result["document_type"] = blueprint.document_type

    return result


# ── Internal helpers ─────────────────────────────────────────────────────────

def _coerce_str(value: Any) -> str:
    if isinstance(value, str):
        return value
    if value is None:
        return ""
    return str(value)


def _canonicalize_open_point(raw: str) -> str:
    """
    Normalize a captured `[OFFENER PUNKT] …` substring so duplicates can
    be detected reliably:
      - collapse internal whitespace,
      - trim trailing punctuation/whitespace,
      - keep the marker intact.
    """
    text = re.sub(r"\s+", " ", raw).strip()
    text = text.rstrip(" ,;:—–-")
    if not text.startswith(OPEN_POINT_MARKER):
        return ""
    return text


def _coverage_findings(placeholders: dict[str, str]) -> list[str]:
    """
    Best-effort coverage check: every Gefährdung named in
    `GB_GEFAEHRDUNGEN` must appear as a `Gefährdung: …` line in
    `GB_RISIKOBEWERTUNG`. Missing entries are emitted as open points.

    The check is heuristic by design — the LLM is the primary author and
    `quality_checker` is the safety net. We deliberately:
      - only fire when both placeholders are non-empty,
      - compare on a normalized key (lowercased, punctuation-stripped,
        whitespace-collapsed) so minor wording differences in bullets vs.
        bewertungs-headers don't cause false positives.
    """
    findings: list[str] = []

    geff_text = _coerce_str(placeholders.get("GB_GEFAEHRDUNGEN"))
    risk_text = _coerce_str(placeholders.get("GB_RISIKOBEWERTUNG"))
    if not geff_text.strip() or not risk_text.strip():
        return findings

    geff_items = _extract_gefaehrdungs_items(geff_text)
    risk_items = {
        _normalize_key(m.group(1)): m.group(1).strip()
        for m in _RISK_GEFAEHRDUNG_LINE.finditer(risk_text)
    }
    risk_keys = set(risk_items.keys())

    for original in geff_items:
        key = _normalize_key(original)
        if not key:
            continue
        if not any(key in rk or rk in key for rk in risk_keys):
            findings.append(
                f"{OPEN_POINT_MARKER} Gefährdung '{original.strip()}' nicht "
                f"in GB_RISIKOBEWERTUNG bewertet"
            )

    return findings


def _extract_gefaehrdungs_items(text: str) -> list[str]:
    """
    Pull plausible Gefährdungs-Kurznamen out of `GB_GEFAEHRDUNGEN`.

    Strategy: take every non-empty bullet line (`- …` / `* …` / `• …`)
    that is NOT itself an `[OFFENER PUNKT]` line, strip the leading
    marker, and take everything up to the first `,` `;` `(` `:` `.` `—`
    or end-of-line as the Bezeichnung. We do this on a stripped copy
    of the text so the `[OFFENER PUNKT]` inline substrings do not
    contaminate the comparison.
    """
    items: list[str] = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if line.startswith(OPEN_POINT_MARKER):
            continue
        m = re.match(r"^[-*•]\s+(.*)$", line)
        if not m:
            continue
        body = m.group(1).strip()
        if OPEN_POINT_MARKER in body:
            continue
        head = re.split(r"[,;:(—\.]", body, maxsplit=1)[0].strip()
        if head:
            items.append(head)
    return items


def _normalize_key(text: str) -> str:
    """Lowercase, drop punctuation, collapse whitespace — for fuzzy matching."""
    t = text.lower()
    t = re.sub(r"[^\wäöüß ]+", " ", t, flags=re.UNICODE)
    t = re.sub(r"\s+", " ", t).strip()
    return t


def _dedup_preserve_order(points: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for p in points:
        normalized = p.strip() if isinstance(p, str) else str(p).strip()
        if normalized and normalized not in seen:
            seen.add(normalized)
            out.append(normalized)
    return out
