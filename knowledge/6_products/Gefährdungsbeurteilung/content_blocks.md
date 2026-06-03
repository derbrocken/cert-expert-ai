# Produkt: GB — Inhaltsblöcke (`GB_*`-Platzhalter)

Welcher GB-Blueprint welche Blöcke verwendet, steht im jeweiligen Blueprint
(`knowledge/7_blueprint/*.json` → `ai_blocks`). Hier ist beschrieben, was
**jeder** dieser Blöcke enthalten muss, wenn er aktiv ist.

---

## `{GB_TAETIGKEIT}` — Tätigkeit / Einsatzbeschreibung

**Was**: Beschreibt sachlich, was abgesichert wird.
**Inhalt**:
- Art der Tätigkeit oder Veranstaltung (aus Input).
- Datum, Ort, Dauer (sofern im Input).
- Auftragnehmer (Cert-Expert) und Auftraggeber (aus Input).
- Anzahl und Aufgabenbereiche der eingesetzten Sicherheitskräfte
  (Einlass, Streife, Ringbereich, Notfall, …).
- Abgrenzung des Einsatzbereichs (was ist abgedeckt, was nicht).

**Stil**: 3–6 Sätze oder strukturierter Kurzabsatz. Keine Bewertung.

**Pflicht**: `event_name`, `event_location`, `security_staff_count` und
`client_name` müssen sichtbar im Text erscheinen, sofern im Input vorhanden.

---

## `{GB_GEFAEHRDUNGEN}` — Identifizierte Gefährdungen

**Was**: Systematische Auflistung der Gefährdungen für diesen konkreten Fall.
**Inhalt**:
- Gegliedert nach Kategorien (z. B. Publikum, Örtlichkeit, Personal,
  besondere Umstände — je nach Blueprint).
- Nur Gefährdungen nennen, die für den Input plausibel sind.
- Quellenhinweise nur, wenn sie aus dem Input stammen
  („laut Auftraggeber", „in `special_risks` angegeben").
- Lücken in den Eingangsinformationen → `[OFFENER PUNKT]`.

**Stil**: Aufzählungen oder kurze Absätze je Kategorie. Keine Relativierungen.

---

## `{GB_RISIKOBEWERTUNG}` — Risikobewertung

**Was**: Bewertung jeder benannten Gefährdung nach Eintrittwahrscheinlichkeit
und Schadensschwere.
**Inhalt**:
- 3-stufige Matrix: Wahrscheinlichkeit (gering/mittel/hoch) × Schwere
  (gering/mittel/hoch) → Gesamtrisiko (niedrig/mittel/hoch).
- Pro Gefährdung: Kategorie + Wahrscheinlichkeit + Schwere + Gesamtrisiko +
  einsatz-spezifische Begründung (1–2 Sätze).
- Keine erfundenen numerischen Werte (RPZ, Prozent).

**Stil**: Strukturierte Absätze oder Plain-Text-Liste. Keine Markdown-Tabellen
in Pipe-Form (das renderte oft schlecht in DOCX).

---

## `{GB_SCHUTZMASSNAHMEN}` — Schutzmaßnahmen

**Was**: Konkrete Maßnahmen, gegliedert nach STOP-Prinzip.
**Inhalt**:
- **S — Substitution**: nur wenn realistisch (entfällt bei Veranstaltungen
  meist; nicht erzwingen).
- **T — Technisch**: Absperrungen, Beleuchtung, Funktechnik, Sichtachsen,
  bauliche Lösungen — **nur wenn im Input belegt**.
- **O — Organisatorisch**: Positionierung, Briefings, Eskalationsstufen,
  Kommunikationswege, Schichtplanung.
- **P — Persönlich**: PSA (falls einschlägig), individuelle Qualifikation,
  Schulungsnachweise.

**Stil**: Verbindliche Formulierungen. Kein „sollte", „könnte", „wäre
sinnvoll". Stattdessen „wird durchgeführt", „ist vorgesehen",
„ist verbindlich geregelt".

---

## `{GB_VERANTWORTLICHKEITEN}` — Verantwortlichkeiten

**Was**: Wer ist für was zuständig.
**Inhalt**:
- Auftraggeber (Veranstalter / Betreiber).
- Auftragnehmer (Cert-Expert) und konkrete Rolle (Einsatzleitung,
  Gruppenleitung, ggf. Funkstelle).
- Sanitätsdienst (Schnittstelle, sofern im Input bekannt).
- Behörden (Ordnungsamt, Feuerwehr, Polizei — **nur** als allgemeine
  Schnittstelle, keine konkrete Behörde erfinden).
- Verantwortliche/r für die Aktualisierung dieser GB.

**Stil**: Klare Rollen-Zuordnungen. Konkrete Personennamen nur, wenn aus
Input. Sonst Rollenbezeichnungen.

---

## `{GB_OFFENE_PUNKTE}` — Offene Punkte (Dokumentabschnitt)

**Was**: Lesbare Konsolidierung aller offenen Punkte.
**Inhalt**:
- Nummerierte Liste.
- Jeder Punkt mit Begründung der Relevanz.
- Keine Duplikate.
- Pre-open-points aus dem Input-Loader + bot-eigene Befunde + ggf. Trigger.

**Stil**: „1. [OFFENER PUNKT] …" pro Zeile.

**Pflicht**: Wenn `approved_by` leer ist, immer `[OFFENER PUNKT] Freigabe
durch Verantwortlichen ausstehend.` enthalten.

---

## Nicht in jedem Blueprint vorhanden

Blueprints für Objekte oder mobile Dienste haben **andere** Blöcke
(z. B. `GB_OBJEKTBESCHREIBUNG`, `GB_STRECKENBESCHREIBUNG`,
`GB_ZUGANG`, `GB_WIRKSAMKEITSKONTROLLE`). Welche Blöcke aktiv sind, sagt
ausschließlich der Blueprint.
