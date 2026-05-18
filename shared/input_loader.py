import json
from pathlib import Path

REQUIRED_FIELDS = [
    "event_name",
    "event_type",
    "event_date",
    "event_location",
    "expected_attendees",
    "security_staff_count",
    "venue_capacity",
    "venue_exits",
    "special_risks",
    "client_name",
    "created_by",
    "doc_version",
]

FIELD_LABELS = {
    "event_name": "Veranstaltungsname",
    "event_type": "Veranstaltungstyp",
    "event_date": "Veranstaltungsdatum",
    "event_location": "Veranstaltungsort",
    "expected_attendees": "Erwartete Zuschauerzahl",
    "security_staff_count": "Anzahl Sicherheitsmitarbeiter",
    "venue_capacity": "Hallenkapazität",
    "venue_exits": "Anzahl Notausgänge",
    "special_risks": "Besondere Risiken",
    "client_name": "Auftraggeber",
    "created_by": "Erstellt von",
    "doc_version": "Dokumentversion",
}


def _is_empty(value) -> bool:
    if value is None:
        return True
    if isinstance(value, str) and value.strip() == "":
        return True
    if isinstance(value, list) and len(value) == 0:
        return False
    return False


def load_input(path: str) -> dict:
    """
    Load and validate a Gefährdungsbeurteilung input JSON file.

    Returns:
        {
            "data": { ...all fields from JSON... },
            "pre_open_points": [ "[OFFENER PUNKT] ..." ]
        }

    Missing or empty required fields are recorded as pre_open_points.
    The pipeline continues even when open points exist — they are carried
    forward to quality_checker and appear in the final document.
    """
    input_path = Path(path)
    if not input_path.exists():
        raise FileNotFoundError(f"Input-Datei nicht gefunden: {path}")

    with open(input_path, encoding="utf-8") as f:
        raw = json.load(f)

    data = {k: v for k, v in raw.items() if not k.startswith("_")}

    pre_open_points = []
    for field in REQUIRED_FIELDS:
        if field not in data or _is_empty(data[field]):
            label = FIELD_LABELS.get(field, field)
            pre_open_points.append(f"[OFFENER PUNKT] {label} nicht angegeben")

    return {
        "data": data,
        "pre_open_points": pre_open_points,
    }
