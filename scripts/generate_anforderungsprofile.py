#!/usr/bin/env python3
"""Generate Anforderungsprofil SDL templates from DIN 77200-1 Anhang A / 77200-2 Anhang C."""

from __future__ import annotations

from pathlib import Path

KNOWLEDGE_ROOT = Path(__file__).resolve().parents[1] / "knowledge"
OUTPUT_DIR_77200_1 = KNOWLEDGE_ROOT / "1_standards" / "DIN 77200-1" / "anforderungsprofile"
OUTPUT_DIR_77200_2 = KNOWLEDGE_ROOT / "1_standards" / "DIN 77200-2" / "anforderungsprofile"

PURPOSE_NOTE = (
    "Dieses Dokument dient der gemeinsamen AG/AN-Festlegung der tatsächlich zu "
    "erbringenden Tätigkeiten und der daraus resultierenden Mindestqualifikation."
)

VERIFICATION_NOTE = (
    "Vor produktiver Nutzung sind Tätigkeitstexte und Stufen A/B/C gegen die "
    "gültige Primärquelle der DIN 77200 zu verifizieren."
)

QUALIFIKATIONSSTUFEN_77200_1 = """QUALIFIKATIONSSTUFEN

A = Grundqualifikation
(z. B. Sachkundeprüfung §34a GewO)

B = Erhöhte Qualifikation
(z. B. FSSK, GSSK oder gleichwertig)

C = Höhere Qualifikation / Leitungsqualifikation

(z. B. Meister für Schutz und Sicherheit
oder gleichwertige Qualifikation gemäß
Norm- und Nachweislogik)

Hinweis:
Die tatsächlich geforderte Qualifikationsstufe ergibt sich ausschließlich aus der jeweils gültigen Tabelle des Anhangs A."""

QUALIFIKATIONSSTUFEN_77200_2 = """QUALIFIKATIONSSTUFEN

A = Grundqualifikation
(z. B. Sachkundeprüfung §34a GewO)

B = Erhöhte Qualifikation
(z. B. FSSK, GSSK oder gleichwertig)

C = Höhere Qualifikation / Leitungsqualifikation

(z. B. Meister für Schutz und Sicherheit
oder gleichwertige Qualifikation gemäß
Norm- und Nachweislogik)

Hinweis:
Die tatsächlich geforderte Qualifikationsstufe ergibt sich ausschließlich aus der jeweils gültigen Tabelle des Anhangs C."""

# Sub-line labels (Anhang A)
SUB_EINFACH = "— Einfache Aufgabenverrichtung nach schriftlichen Anweisungen"
SUB_ERWEITERT = "— Erweiterte Aufgabenverrichtung mit strukturierten Ermessensentscheidungen"
SUB_KOMPLEX = "— Komplexe Aufgabenverrichtung mit hoher Problemlösungskompetenz"
SUB_EINF_ERW = (
    "— Einfache und erweiterte Aufgabenverrichtung mit strukturierten Ermessensentscheidungen"
)
SUB_ERW_KOMPLEX = (
    "— Erweiterte und komplexe Aufgabenverrichtung mit hoher Problemlösungskompetenz"
)

# Activity titles Anhang A (77200-1)
A_TITLES = {
    1: (
        "Bedienung von sicherheitstechnischen Einrichtungen und/oder Gefahrenmeldeanlagen "
        "sowie Einleitung und Koordination festgelegter Maßnahmen"
    ),
    2: "Überwachung und/oder Kontrolle von sicherheitsrelevanten Vorgängen",
    3: (
        "Ein- und Ausschalten bzw. Bedienen sicherheitstechnischer Einrichtungen "
        "einschließlich Durchführung von Notschalthandlungen"
    ),
    4: "Öffnungs- und Schließtätigkeiten",
    5: "Überwachung und/oder Kontrolle der Einhaltung von erteilten Auflagen bei Erlaubnissen",
    6: (
        "Überwachung und/oder Kontrolle von Gefahrstellen im Sinne des Arbeits- "
        "und Gesundheitsschutzes"
    ),
    7: "Überwachung und/oder Kontrolle der Einhaltung der Arbeitsstättenverordnung",
    8: (
        "Verifizierung von Gefahrenmeldungen (Alarmen, die von Personen oder "
        "durch Überwachungstechnik ausgelöst wurden)"
    ),
    9: (
        "Prüfung und Erteilung von Zugangsberechtigungen und Ein- und "
        "Ausfahrberechtigungen"
    ),
    10: "Durchführung von Zu- und Ausgangskontrollen",
    11: "Lenkung, Weiterleitung und Begleitung von Besuchern",
    12: "Schließmittelausgaben und –rücknahmen",
    13: "Schließmittelverwaltung und Vollständigkeitsprüfung",
    14: "Überprüfung von Fahrzeugen auf Einhaltung der Betriebsordnung",
    15: (
        "Fahrzeugkontrollen hinsichtlich der Ein- oder Ausfuhr von Gegenständen ggf. "
        "unter gleichzeitiger Überprüfung der Ladungssicherheit und/oder der Gefahrgutkontrolle"
    ),
    16: "Fahrzeugbegleitung im Objekt",
    17: "Sicherheitstechnische Prüfung von Waren-, Post und Paketsendungen",
    18: (
        "Durchführung von Personen- und Gepäckkontrollen mittels Gepäckprüfanlagen "
        "und/oder Durchgangsmetalldetektor bzw. Ganzkörperscanner"
    ),
    19: "Durchführung von Wägearbeiten",
    20: "Verkehrslenkung und Verkehrskontrolle im Objekt",
    21: (
        "Aufnahme und Weiterleitung von Schadensmeldungen, Verkehrsunfällen und "
        "Meldungen mit erweiterten Sachverhalten"
    ),
}

# (activity_nr, sub_label_or_None, grades_per_column) — 7 columns, None = n.a.
# Parsed from DIN 77200-1:2022-10 Anhang A Tabelle A.1
ANHANG_A_MATRIX: list[tuple[int, str | None, list[str | None]]] = [
    (1, SUB_EINFACH, ["A", "A", "A", None, None, None, None]),
    (1, SUB_ERWEITERT, ["A", "A", "A", None, None, None, None]),
    (1, SUB_KOMPLEX, ["B", None, "B", None, None, None, "B"]),
    (2, SUB_EINFACH, ["A"] * 7),
    (2, SUB_ERWEITERT, ["B", "A", "B", "A", "A", "B", "A"]),
    (2, SUB_KOMPLEX, ["C", "B", "C", "B", "B", "C", "B"]),
    (3, SUB_EINFACH, ["A"] * 7),
    (3, SUB_ERWEITERT, ["B", "A", "B", "A", "A", "B", "A"]),
    (3, SUB_KOMPLEX, ["C", "B", "C", "B", "B", "C", "B"]),
    (4, SUB_EINFACH, ["A"] * 7),
    (4, SUB_ERWEITERT, ["A"] * 7),
    (4, SUB_KOMPLEX, ["B"] * 7),
    (5, SUB_EINFACH, ["A"] * 7),
    (5, SUB_ERWEITERT, ["A"] * 7),
    (5, SUB_KOMPLEX, ["B"] * 7),
    (6, SUB_EINFACH, ["A", "A", "A", "A", "A", None, None]),
    (7, SUB_ERWEITERT, ["B", "B", "B", "B", "B", None, None]),
    (7, SUB_KOMPLEX, ["C", None, "C", "C", "C", "C", None]),
    (8, SUB_EINFACH, ["A", "A", "A", "A", "A", "A", None]),
    (8, SUB_ERWEITERT, ["B", "A", "A", "A", "A", "A", None]),
    (8, SUB_KOMPLEX, ["C", None, "B", "B", "B", "B", "B"]),
    (9, SUB_EINFACH, ["A"] * 7),
    (9, SUB_ERWEITERT, ["B", "A", "B", "A", "A", "B", "A"]),
    (9, SUB_KOMPLEX, ["C", "B", "C", "B", "B", "C", "B"]),
    (10, SUB_EINFACH, ["A", "A", "A", "A", "A", "A", None]),
    (10, SUB_ERWEITERT, ["A", "A", "A", "A", "A", "A", None]),
    (10, SUB_KOMPLEX, ["B", "B", "B", "B", None, "B", "B"]),
    (11, SUB_EINFACH, ["A", "A", "A", "A", None, None, None]),
    (11, SUB_ERWEITERT, ["A", "A", "A", "A", None, None, None]),
    (11, SUB_KOMPLEX, [None, "B", "B", None, None, "B", "B"]),
    (12, SUB_EINF_ERW, ["A", "A", "A", "A", "A", "A", None]),
    (12, SUB_KOMPLEX, [None, "B", "B", "B", "B", "B", "B"]),
    (13, SUB_EINFACH, ["A", "A", "A", "A", "A", "A", None]),
    (13, SUB_ERW_KOMPLEX, [None, "B", "B", "B", "B", "B", "B"]),
    (14, SUB_EINFACH, ["A", "A", "A", None, None, None, None]),
    (14, SUB_ERWEITERT, ["A", "A", "A", None, None, None, None]),
    (14, SUB_KOMPLEX, [None, None, "B", None, None, "B", "B"]),
    (15, SUB_EINFACH, ["A", "A", "A", None, None, None, None]),
    (15, SUB_ERWEITERT, ["A", "A", "A", None, None, None, None]),
    (15, SUB_KOMPLEX, [None, None, "B", None, None, "B", "B"]),
    (16, SUB_EINFACH, ["A", None, None, None, None, None, None]),
    (16, SUB_ERWEITERT, ["B", None, None, None, None, None, None]),
    (16, SUB_KOMPLEX, [None, None, None, None, None, "B", None]),
    (17, None, [None, None, "A", None, None, None, None]),
    (18, SUB_EINFACH, ["A", "A", "A", None, None, None, None]),
    (18, SUB_KOMPLEX, [None, "B", "B", None, None, None, "B"]),
    (19, SUB_EINFACH, ["A", None, None, None, None, None, None]),
    (19, SUB_ERWEITERT, [None, "B", None, None, None, None, None]),
    (19, SUB_KOMPLEX, [None, None, "B", None, None, None, None]),
    (20, SUB_EINFACH, ["A"] * 7),
    (20, SUB_ERWEITERT, ["A"] * 7),
    (20, SUB_KOMPLEX, ["B"] * 7),
    (21, SUB_EINFACH, ["A"] * 7),
    (21, SUB_ERWEITERT, ["B"] * 7),
    (21, SUB_KOMPLEX, ["B"] * 7),
]

SDL_77200_1 = [
    {
        "file": "77200-1_alarmdienst.md",
        "title": "Alarmdienst",
        "norm_sdl": "Alarmdienst",
        "column": 0,
        "spalte": 1,
    },
    {
        "file": "77200-1_stationaerer_empfangsdienst.md",
        "title": "Empfangsdienst",
        "norm_sdl": "Empfangsdienst",
        "column": 1,
        "spalte": 2,
    },
    {
        "file": "77200-1_stationaerer_kontrolldienst.md",
        "title": "Kontrolldienst (stationär)",
        "norm_sdl": "Kontrolldienst (stationär)",
        "column": 2,
        "spalte": 3,
    },
    {
        "file": "77200-1_revierdienst.md",
        "title": "Revierdienst",
        "norm_sdl": "Revierdienst",
        "column": 3,
        "spalte": 4,
    },
    {
        "file": "77200-1_interventionsdienst.md",
        "title": "Interventionsdienst",
        "norm_sdl": "Interventionsdienst",
        "column": 4,
        "spalte": 5,
    },
    {
        "file": "77200-1_mobiler_kontrolldienst.md",
        "title": "Kontrolldienst (mobil)",
        "norm_sdl": "Kontrolldienst (mobil)",
        "column": 5,
        "spalte": 6,
    },
    {
        "file": "77200-1_veranstaltungsdienst.md",
        "title": "Veranstaltungssicherungsdienst",
        "norm_sdl": "Veranstaltungssicherungsdienst",
        "column": 6,
        "spalte": 7,
    },
]

# Anhang C sub-lines (77200-2 uses slightly different wording in places)
SUB_C_EINFACH = SUB_EINFACH
SUB_C_ERWEITERT = SUB_ERWEITERT
SUB_C_KOMPLEX = SUB_KOMPLEX
SUB_C_AUFGABEN = "— Aufgabenverrichtung nach schriftlichen Anweisungen"
SUB_C_EINF_ERW = SUB_EINF_ERW
SUB_C_ERW_KOMPLEX = SUB_ERW_KOMPLEX

# Titles Anhang C (77200-2) — Video/Gefahrenmeldeanlagen wording
C_TITLES = {
    1: (
        "Bedienung von Video- und/oder Gefahrenmeldeanlagen sowie Einleitung "
        "und Koordination festgelegter Maßnahmen"
    ),
    2: "Überwachung und/oder Kontrolle von sicherheitsrelevanten Vorgängen",
    3: (
        "Ein- und Ausschalten bzw. Bedienen sicherheitstechnischer Einrichtungen "
        "einschließlich Durchführung von Notschalthandlungen"
    ),
    4: "Öffnungs- und Schließtätigkeiten",
    5: "Überwachung und/oder Kontrolle der Einhaltung von erteilten Auflagen bei Erlaubnissen",
    6: (
        "Verifizierung von Gefahrenmeldungen (Alarmen, die von Personen oder "
        "durch Überwachungstechnik ausgelöst wurden)"
    ),
    7: (
        "Prüfung und Erteilung von Zugangsberechtigungen und Ein- und "
        "Ausfahrberechtigungen"
    ),
    8: "Durchführung von Zu- und Ausgangskontrollen",
    9: "Lenkung, Weiterleitung und Begleitung von Besuchern",
    10: "Schließmittelausgaben und -rücknahmen",
    11: "Schließmittelverwaltung und Vollständigkeitsprüfung",
    12: "Überprüfung von Fahrzeugen auf Einhaltung der Betriebsordnung",
    13: (
        "Fahrzeugkontrollen hinsichtlich der Ein- oder Ausfuhr von Gegenständen "
        "ggf. unter gleichzeitiger Überprüfung der Ladungssicherheit und/oder der "
        "Gefahrgutkontrolle"
    ),
    14: "Fahrzeugbegleitung im Objekt",
    15: "Sicherheitstechnische Prüfung von Waren-, Post und Paketsendungen",
    16: (
        "Durchführung von Personen- und Gepäckkontrollen mittels Gepäckprüfanlagen "
        "und/oder Durchgangsmetalldetektor bzw. Ganzkörperscanner"
    ),
    17: "Durchführung von Wägearbeiten",
    18: "Verkehrslenkung und Verkehrskontrolle im Objekt",
    19: (
        "Aufnahme und Weiterleitung von Schadensmeldungen, Verkehrsunfällen "
        "und Meldungen mit erweiterten Sachverhalten"
    ),
}

# (activity_nr, sub_label_or_None, stufe) — all rows included (77200-2 has no n.a. within table)
def c_rows(*entries: tuple[int, str | None, str]) -> list[tuple[int, str | None, str]]:
    return list(entries)


ANHANG_C_TABLES: dict[str, list[tuple[int, str | None, str]]] = {
    "C.1": c_rows(
        (1, SUB_C_EINFACH, "A"),
        (1, SUB_C_ERWEITERT, "B"),
        (1, SUB_C_KOMPLEX, "B"),
        (2, SUB_C_EINFACH, "A"),
        (2, SUB_C_ERWEITERT, "A"),
        (2, SUB_C_KOMPLEX, "B"),
        (3, SUB_C_EINFACH, "A"),
        (3, SUB_C_ERWEITERT, "A"),
        (3, SUB_C_KOMPLEX, "B"),
        (4, SUB_C_EINFACH, "A"),
        (4, SUB_C_ERWEITERT, "A"),
        (4, SUB_C_KOMPLEX, "B"),
        (5, SUB_C_EINFACH, "A"),
        (5, SUB_C_ERWEITERT, "A"),
        (5, SUB_C_KOMPLEX, "B"),
        (6, SUB_C_EINFACH, "A"),
        (6, SUB_C_ERWEITERT, "A"),
        (6, SUB_C_KOMPLEX, "B"),
        (7, SUB_C_EINFACH, "A"),
        (7, SUB_C_ERWEITERT, "A"),
        (7, SUB_C_KOMPLEX, "B"),
        (8, SUB_C_EINFACH, "A"),
        (8, SUB_C_ERWEITERT, "A"),
        (8, SUB_C_KOMPLEX, "B"),
        (9, SUB_C_EINFACH, "A"),
        (9, SUB_C_ERWEITERT, "A"),
        (9, SUB_C_KOMPLEX, "B"),
        (10, SUB_C_EINF_ERW, "A"),
        (10, SUB_C_KOMPLEX, "B"),
        (11, SUB_C_AUFGABEN, "A"),
        (11, SUB_C_ERW_KOMPLEX, "B"),
        (12, SUB_C_EINFACH, "A"),
        (12, SUB_C_ERWEITERT, "A"),
        (12, SUB_C_KOMPLEX, "B"),
        (13, SUB_C_EINFACH, "A"),
        (13, SUB_C_ERWEITERT, "A"),
        (13, SUB_C_KOMPLEX, "B"),
        (14, SUB_C_AUFGABEN, "A"),
        (14, SUB_C_KOMPLEX, "B"),
        (15, SUB_C_EINFACH, "A"),
        (15, SUB_C_ERWEITERT, "A"),
        (15, SUB_C_KOMPLEX, "B"),
        (16, SUB_C_EINFACH, "A"),
        (16, SUB_C_ERWEITERT, "B"),
        (16, SUB_C_KOMPLEX, "C"),
    ),
    "C.2": c_rows(
        (1, SUB_C_EINFACH, "A"),
        (1, SUB_C_ERWEITERT, "B"),
        (1, SUB_C_KOMPLEX, "B"),
        (2, SUB_C_EINFACH, "A"),
        (2, SUB_C_ERWEITERT, "A"),
        (2, SUB_C_KOMPLEX, "B"),
        (3, SUB_C_EINFACH, "A"),
        (3, SUB_C_ERWEITERT, "B"),
        (3, SUB_C_KOMPLEX, "B"),
        (4, SUB_C_EINFACH, "A"),
        (4, SUB_C_ERWEITERT, "A"),
        (4, SUB_C_KOMPLEX, "B"),
        (5, SUB_C_EINFACH, "A"),
        (5, SUB_C_ERWEITERT, "B"),
        (5, SUB_C_KOMPLEX, "C"),
        (6, SUB_C_EINFACH, "A"),
        (6, SUB_C_ERWEITERT, "B"),
        (6, SUB_C_KOMPLEX, "C"),
        (7, SUB_C_EINFACH, "A"),
        (7, SUB_C_ERWEITERT, "B"),
        (7, SUB_C_KOMPLEX, "C"),
        (8, SUB_C_EINFACH, "A"),
        (8, SUB_C_ERWEITERT, "A"),
        (8, SUB_C_KOMPLEX, "B"),
        (9, SUB_C_EINFACH, "A"),
        (9, SUB_C_ERWEITERT, "A"),
        (9, SUB_C_KOMPLEX, "B"),
        (10, SUB_C_EINF_ERW, "A"),
        (10, SUB_C_KOMPLEX, "B"),
        (11, SUB_C_AUFGABEN, "A"),
        (11, SUB_C_ERW_KOMPLEX, "B"),
        (12, SUB_C_EINFACH, "A"),
        (12, SUB_C_ERWEITERT, "B"),
        (12, SUB_C_KOMPLEX, "B"),
        (13, SUB_C_EINFACH, "A"),
        (13, SUB_C_ERWEITERT, "B"),
        (13, SUB_C_KOMPLEX, "C"),
        (14, SUB_C_EINFACH, "A"),
        (14, SUB_C_ERWEITERT, "B"),
        (14, SUB_C_KOMPLEX, "C"),
        (15, None, "A"),
        (16, SUB_C_AUFGABEN, "A"),
        (16, SUB_C_KOMPLEX, "B"),
        (17, SUB_C_EINFACH, "A"),
        (17, SUB_C_ERWEITERT, "A"),
        (17, SUB_C_KOMPLEX, "B"),
        (18, SUB_C_EINFACH, "A"),
        (18, SUB_C_ERWEITERT, "B"),
        (18, SUB_C_KOMPLEX, "C"),
    ),
    "C.3": c_rows(
        (1, SUB_C_EINFACH, "B"),
        (1, SUB_C_ERWEITERT, "B"),
        (1, SUB_C_KOMPLEX, "C"),
        (2, SUB_C_EINFACH, "A"),
        (2, SUB_C_ERWEITERT, "B"),
        (2, SUB_C_KOMPLEX, "C"),
        (3, SUB_C_EINFACH, "A"),
        (3, SUB_C_ERWEITERT, "B"),
        (3, SUB_C_KOMPLEX, "C"),
        (4, SUB_C_EINFACH, "A"),
        (4, SUB_C_ERWEITERT, "B"),
        (4, SUB_C_KOMPLEX, "C"),
        (5, SUB_C_EINFACH, "A"),
        (5, SUB_C_ERWEITERT, "B"),
        (5, SUB_C_KOMPLEX, "C"),
        (6, SUB_C_EINFACH, "A"),
        (6, SUB_C_ERWEITERT, "B"),
        (6, SUB_C_KOMPLEX, "C"),
        (7, SUB_C_EINFACH, "A"),
        (7, SUB_C_ERWEITERT, "B"),
        (7, SUB_C_KOMPLEX, "C"),
        (8, SUB_C_EINFACH, "A"),
        (8, SUB_C_ERWEITERT, "B"),
        (8, SUB_C_KOMPLEX, "C"),
        (9, SUB_C_EINFACH, "A"),
        (9, SUB_C_ERWEITERT, "B"),
        (9, SUB_C_KOMPLEX, "C"),
        (10, SUB_C_EINFACH, "A"),
        (10, SUB_C_ERWEITERT, "B"),
        (10, SUB_C_KOMPLEX, "C"),
        (11, SUB_C_AUFGABEN, "A"),
        (11, SUB_C_ERWEITERT, "B"),
        (11, SUB_C_KOMPLEX, "C"),
        (12, SUB_C_EINFACH, "A"),
        (12, SUB_C_ERWEITERT, "B"),
        (12, SUB_C_KOMPLEX, "C"),
        (13, SUB_C_EINFACH, "A"),
        (13, SUB_C_ERWEITERT, "B"),
        (13, SUB_C_KOMPLEX, "C"),
        (14, SUB_C_EINFACH, "A"),
        (14, SUB_C_ERWEITERT, "B"),
        (14, SUB_C_KOMPLEX, "C"),
        (15, None, "A"),
        (16, SUB_C_AUFGABEN, "A"),
        (16, SUB_C_KOMPLEX, "B"),
        (17, SUB_C_EINFACH, "A"),
        (17, SUB_C_ERWEITERT, "B"),
        (17, SUB_C_KOMPLEX, "C"),
        (18, SUB_C_EINFACH, "A"),
        (18, SUB_C_ERWEITERT, "B"),
        (18, SUB_C_KOMPLEX, "C"),
        (19, SUB_C_EINFACH, "A"),
        (19, SUB_C_ERWEITERT, "B"),
        (19, SUB_C_KOMPLEX, "C"),
    ),
    "C.4": c_rows(
        (1, SUB_C_EINFACH, "A"),
        (1, SUB_C_ERWEITERT, "A"),
        (1, SUB_C_KOMPLEX, "B"),
        (2, SUB_C_EINFACH, "A"),
        (2, SUB_C_ERWEITERT, "B"),
        (2, SUB_C_KOMPLEX, "B"),
        (3, SUB_C_EINFACH, "A"),
        (3, SUB_C_ERWEITERT, "A"),
        (3, SUB_C_KOMPLEX, "B"),
        (4, SUB_C_EINFACH, "A"),
        (4, SUB_C_ERWEITERT, "A"),
        (4, SUB_C_KOMPLEX, "B"),
        (5, SUB_C_EINFACH, "A"),
        (5, SUB_C_ERWEITERT, "A"),
        (5, SUB_C_KOMPLEX, "B"),
        (6, SUB_C_EINFACH, "A"),
        (6, SUB_C_ERWEITERT, "A"),
        (6, SUB_C_KOMPLEX, "B"),
        (7, SUB_C_EINFACH, "A"),
        (7, SUB_C_ERWEITERT, "A"),
        (7, SUB_C_KOMPLEX, "B"),
        (8, SUB_C_EINFACH, "A"),
        (8, SUB_C_ERWEITERT, "A"),
        (8, SUB_C_KOMPLEX, "B"),
        (9, SUB_C_EINFACH, "A"),
        (9, SUB_C_ERWEITERT, "A"),
        (9, SUB_C_KOMPLEX, "B"),
        (10, SUB_C_EINFACH, "A"),
        (10, SUB_C_ERWEITERT, "A"),
        (10, SUB_C_KOMPLEX, "B"),
        (11, SUB_C_EINFACH, "A"),
        (11, SUB_C_ERWEITERT, "A"),
        (11, SUB_C_KOMPLEX, "B"),
        (12, SUB_C_EINFACH, "A"),
        (12, SUB_C_ERWEITERT, "A"),
        (12, SUB_C_KOMPLEX, "B"),
        (14, SUB_C_EINFACH, "A"),
        (14, SUB_C_ERWEITERT, "A"),
        (14, SUB_C_KOMPLEX, "B"),
        (15, None, "A"),
        (16, SUB_C_EINFACH, "A"),
        (16, SUB_C_ERWEITERT, "A"),
        (16, SUB_C_KOMPLEX, "B"),
        (17, SUB_C_EINFACH, "A"),
        (17, SUB_C_ERWEITERT, "A"),
        (17, SUB_C_KOMPLEX, "B"),
        (18, SUB_C_EINFACH, "A"),
        (18, SUB_C_ERWEITERT, "A"),
        (18, SUB_C_KOMPLEX, "B"),
    ),
}

SDL_77200_2 = [
    {
        "file": "77200-2_veranstaltung_besondere_sicherheitsrelevanz.md",
        "title": "Veranstaltungen mit besonderer Sicherheitsrelevanz",
        "norm_sdl": "Veranstaltungen mit besonderer Sicherheitsrelevanz",
        "table": "C.1",
        "referenz": "Anhang C Tabelle C.1",
    },
    {
        "file": "77200-2_oepnv.md",
        "title": "Sicherungsdienstleistungen im öffentlichen Personenverkehr (ÖPNV)",
        "norm_sdl": "Sicherungsdienstleistungen im öffentlichen Personenverkehr (ÖPNV)",
        "table": "C.2",
        "referenz": "Anhang C Tabelle C.2",
    },
    {
        "file": "77200-2_gebaeude_besondere_sicherheitsrelevanz.md",
        "title": "Objekte mit besonderer Sicherheitsrelevanz",
        "norm_sdl": "Objekte mit besonderer Sicherheitsrelevanz",
        "table": "C.3",
        "referenz": "Anhang C Tabelle C.3",
    },
    {
        "file": "77200-2_fluechtlings_asylunterkuenfte.md",
        "title": "Flüchtlings- und Asylunterkünfte",
        "norm_sdl": "Flüchtlings- und Asylunterkünfte",
        "table": "C.4",
        "referenz": "Anhang C Tabelle C.4",
    },
]


def format_taetigkeit(title: str, sub: str | None) -> str:
    if sub:
        return f"{title} {sub}"
    return title


def matrix_row(nr: int, taetigkeit: str, stufe: str) -> str:
    return f"| {nr} | {taetigkeit} | ☐ | {stufe} | ☐ | |"


def build_header(title: str, norm_sdl: str, referenz: str) -> str:
    return f"""# Anforderungsprofil — {title}

---

ANFORDERUNGSPROFIL

Auftraggeber:
[ ]

Auftragnehmer:
[ ]

Objekt / Veranstaltung:
[ ]

Vertrag / Beauftragung:
Nr. [ ] vom [ ]

Norm-SDL:
{norm_sdl}

Referenz Anhang:
{referenz}

Erstellt am:
[ ]

AG/AN abgestimmt am:
[ ]

Nächste Prüfung:
[ ]


---"""


def build_77200_1_rows(column: int) -> list[str]:
    rows: list[str] = []
    for nr, sub, grades in ANHANG_A_MATRIX:
        stufe = grades[column]
        if stufe is None:
            continue
        title = A_TITLES[nr]
        rows.append(matrix_row(nr, format_taetigkeit(title, sub), stufe))
    return rows


def build_77200_2_rows(table_key: str) -> list[str]:
    rows: list[str] = []
    for nr, sub, stufe in ANHANG_C_TABLES[table_key]:
        title = C_TITLES[nr]
        rows.append(matrix_row(nr, format_taetigkeit(title, sub), stufe))
    return rows


def generate_77200_1_template(meta: dict) -> str:
    rows = build_77200_1_rows(meta["column"])
    referenz = f"Anhang A Tabelle A.1 Spalte {meta['spalte']}"
    parts = [
        build_header(meta["title"], meta["norm_sdl"], referenz),
        "",
        QUALIFIKATIONSSTUFEN_77200_1,
        "",
        "---",
        "",
        "## Tätigkeitsmatrix",
        "",
        "| Nr | Tätigkeit | Erbringen Ja/Nein | Stufe A/B/C | AG-Erhöhung | Bemerkung |",
        "|----|-----------|-------------------|-------------|-------------|-----------|",
        *rows,
        "",
        "---",
        "",
        PURPOSE_NOTE,
        "",
        VERIFICATION_NOTE,
        "",
    ]
    return "\n".join(parts)


def generate_77200_2_template(meta: dict) -> str:
    rows = build_77200_2_rows(meta["table"])
    parts = [
        build_header(meta["title"], meta["norm_sdl"], meta["referenz"]),
        "",
        QUALIFIKATIONSSTUFEN_77200_2,
        "",
        "---",
        "",
        "## Tätigkeitsmatrix",
        "",
        "| Nr | Tätigkeit | Erbringen Ja/Nein | Stufe A/B/C | AG-Erhöhung | Bemerkung |",
        "|----|-----------|-------------------|-------------|-------------|-----------|",
        *rows,
        "",
        "---",
        "",
        PURPOSE_NOTE,
        "",
        VERIFICATION_NOTE,
        "",
    ]
    return "\n".join(parts)


def main() -> None:
    counts: dict[str, int] = {}

    for meta in SDL_77200_1:
        content = generate_77200_1_template(meta)
        path = OUTPUT_DIR_77200_1 / meta["file"]
        path.write_text(content, encoding="utf-8")
        counts[meta["file"]] = len(build_77200_1_rows(meta["column"]))

    for meta in SDL_77200_2:
        content = generate_77200_2_template(meta)
        path = OUTPUT_DIR_77200_2 / meta["file"]
        path.write_text(content, encoding="utf-8")
        counts[meta["file"]] = len(build_77200_2_rows(meta["table"]))

    print("Generated Anforderungsprofil templates:")
    for name, count in sorted(counts.items()):
        print(f"  {name}: {count} matrix rows")


if __name__ == "__main__":
    main()
