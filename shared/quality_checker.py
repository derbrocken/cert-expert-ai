OPEN_POINT_MARKER = "[OFFENER PUNKT]"


def check(bot_output: dict, pre_open_points: list) -> dict:
    """
    Run QA on structured bot output and return an enriched result dict.

    Steps:
    1. Collect any open points already found by the bot in its output.
    2. Scan all placeholder values for empty strings or OFFENER PUNKT markers.
    3. Merge pre_open_points from input_loader (missing input fields).
    4. Deduplicate the combined open_points list.
    5. Set qa_status: "ok" if no open points, "review_required" otherwise.

    Args:
        bot_output:      Parsed JSON dict returned by the LLM bot.
        pre_open_points: List of open points detected by input_loader before
                         the LLM was called (missing required input fields).

    Returns:
        Enriched copy of bot_output with updated open_points and qa_status.
    """
    result = dict(bot_output)

    existing_open_points = list(result.get("open_points", []))

    placeholder_open_points = []
    placeholders = result.get("placeholders", {})
    for key, value in placeholders.items():
        if not isinstance(value, str):
            continue
        stripped = value.strip()
        if stripped == "" or OPEN_POINT_MARKER in stripped:
            placeholder_open_points.append(
                f"{OPEN_POINT_MARKER} Platzhalter '{key}' nicht befüllt"
            )

    all_points = existing_open_points + placeholder_open_points + list(pre_open_points)

    seen = set()
    deduped = []
    for point in all_points:
        normalized = point.strip()
        if normalized and normalized not in seen:
            seen.add(normalized)
            deduped.append(normalized)

    result["open_points"] = deduped
    result["qa_status"] = "ok" if len(deduped) == 0 else "review_required"

    return result
