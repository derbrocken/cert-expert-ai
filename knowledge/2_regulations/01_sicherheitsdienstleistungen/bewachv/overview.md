---
type: regulation
subtype: verordnung
number: "BewachV 2019"
title: "Verordnung über das Bewachungsgewerbe (Bewachungsverordnung)"
publisher: Bundesministerium für Wirtschaft und Energie
year: 2019
pages: 15
scope: sicherheitsdienstleistungen
relevance: [qualifikation, unterrichtung, sachkundeprüfung, bewacherregister, dienstanweisung, aufzeichnung, buchfuehrung, audit]
norm_anchors: []
bot_may_cite: false
source_file: inputs/raw_standards/BewachV.pdf
last_reviewed: 2026-06-10
status: reviewed
---

# BewachV — Bewachungsverordnung (2019)

**Vollständiger Titel:** Verordnung über das Bewachungsgewerbe (Bewachungsverordnung — BewachV)
**Rechtsgrundlage:** § 34a GewO · **Ausfertigungsdatum:** 03.05.2019 · **In Kraft:** 01.06.2019 · **Seiten:** 15
**Ersetzt:** BewachV 1995 (v. 7.12.1995)

---

## Zweck

Die BewachV konkretisiert die Anforderungen aus § 34a GewO für das Bewachungsgewerbe. Sie regelt Qualifikationspflichten (Unterrichtung + Sachkundeprüfung), das Bewacherregister, Dienstanweisungs- und Aufzeichnungspflichten sowie Buchführung. Gilt für alle Gewerbetreibenden nach § 34a GewO und ihre Wachpersonen.

---

## Inhaltsstruktur

| Abschnitt | §§ | Titel |
|-----------|----|-------|
| 1 | §§ 1–3 | Zuständigkeit, Unterrichtung in Strafsachen, Antragstellung |
| 2 | §§ 4–8 | Unterrichtungsverfahren |
| 3 | §§ 9–12 | Sachkundeprüfung |
| 4 | § 13 | Anerkennung ausländischer Befähigungsnachweise |
| 5 | §§ 14–15 | Haftpflichtversicherung |
| 6 | §§ 16–21 | Verpflichtungen bei der Ausübung des Gewerbes |
| 7 | § 22 | Ordnungswidrigkeiten |
| 8 | §§ 23–24 | Schlussvorschriften |
| Anl. 1 | | Muster: IHK-Unterrichtungsbescheinigung |
| Anl. 2 | | Sachgebiete der Unterrichtung (Lehrplan) |
| Anl. 3 | | Muster: IHK-Sachkundeprüfungszeugnis |

---

## Kernaussagen für den Bot

**Unterrichtung (§§ 4–7):**
- Mindestdauer: **40 Unterrichtsstunden** (à 45 Min.) — mündlich, bei IHK
- Sprachkenntnisse mind. **B1** (Gemeinsamer Europäischer Referenzrahmen) Pflicht
- Teilnehmerzahl max. 20 Personen pro Unterrichtung
- Nachweis: IHK-Bescheinigung (Muster Anlage 1) — mit Empfangsbescheinigung beim Arbeitgeber
- Sachgebiete (§ 7 + Anlage 2): Öff. Sicherheit/Gewerberecht, Datenschutz, BGB, Straf-/Waffenrecht, UVV Wachgewerbe, Umgang mit Menschen/Deeskalation, Sicherheitstechnik

**Anerkennungsfähige Nachweise statt Unterrichtung (§ 8):**
- Geprüfte Schutz- und Sicherheitskraft, Fachkraft für Schutz und Sicherheit, Servicekraft für Schutz und Sicherheit, Geprüfter Meister für Schutz und Sicherheit u.a.
- IHK-Abschluss = Unterrichtungspflicht entfällt

**Sachkundeprüfung (§§ 9–11):**
- Erforderlich für Tätigkeiten nach § 34a Abs. 1a Satz 2 GewO: Bewachung in Flüchtlingsunterkünften, Veranstaltungssicherheit, Einkaufszentren, ÖPNV
- Schriftlich + mündlich, bei IHK
- Prüfungsgebiete = §7-Sachgebiete

**Bewacherregister / Personal-Anmeldung (§ 16):**
- Vor Beschäftigungsbeginn Anmeldung über Bewacherregister Pflicht
- Voraussetzungen: Zuverlässigkeit + mind. 18 Jahre + erforderliche Befähigung
- Anmeldedaten: Personalien, Qualifikationsnachweise (Art, Datum, IHK-ID, Kopie)
- Behörde bestätigt **zulässige Einsatzmöglichkeiten** → Auditbeleg

**Dienstanweisung (§ 17):**
- Schriftlich, vor erster Bewachungstätigkeit, **mit Empfangsbescheinigung** der Wachperson
- Pflichtinhalt: Hinweis auf fehlende Polizeibefugnisse, Regelung Waffenführung, Meldepflicht bei Waffengebrauch
- Schriftliche Verpflichtung zur Verschwiegenheit (Geschäftsgeheimnisse Dritter)

**Buchführung und Aufbewahrung (§ 21):**
- Aufzeichnungspflicht: Bewachungsverträge (Auftraggeber, Inhalt, Datum), Personalien Wachpersonen, Belehrungen, Waffenüberlassung
- Sammelbelege: Versicherungsvertrag, Zuverlässigkeits-/Befähigungsnachweise, Dienstanweisung + Empfangsbestätigung, Verpflichtungserklärung, Ausweis-Vordrucke
- Aufbewahrungsfrist: **3 Jahre** nach Ablauf des Kalenderjahs, in dem Vertrag/Beschäftigung endete

---

## Relevanz für Cert-Expert / DIN 77200-2

- **Pflichtgrundlage** für alle DIN 77200-2-Kunden mit § 34a-Betrieb
- §16 Bewacherregister + Qualifikationsnachweis = Auditbeleg-Chip in der Mitarbeiterakte
- §17 Dienstanweisung + Empfangsbescheinigung = eigener Nachweis-Typ (fehlt bei vielen Kunden)
- §21 Aufbewahrungsfrist 3 Jahre = Einstellungsparameter für die Requirement Engine (Slice 2)
- Sachkundeprüfungspflicht für Flüchtlingsunterkünfte, Veranstaltungen, ÖPNV → DIN 77200-2-Hochrisikobereiche direkt adressiert
- Qualifikationsstufen (Unterrichtung / Sachkunde / IHK-Abschluss) = Grundlage für A/B/C-Qualifikationstabelle der Norm-Matrix

---

## Was der Bot NICHT darf

- Keine wörtlichen Paragrafenzitate (Quelle: juris/BMJ — öffentl. Recht, aber keine wörtl. Reproduktion)
- Unterrichtung ≠ Sachkundeprüfung — nicht gleichsetzen; Einsatzbereich entscheidet
- Aufbewahrungsfristen nie pauschal „ab Ausstellung" rechnen — Fristbeginn ist Ende des Vertrags/Beschäftigung
- Keine Aussage zur Auditfähigkeit ohne Nachweisprüfung (EC-10)
- CL-IDs für BewachV-Pflichten noch nicht vergeben → als „fachlich prüfen" markieren bis Klausel-Register ergänzt
