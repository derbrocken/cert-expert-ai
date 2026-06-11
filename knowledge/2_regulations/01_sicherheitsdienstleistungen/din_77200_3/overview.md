---
type: norm
subtype: din
number: "77200-3"
title: "Sicherungsdienstleistungen – Teil 3: Zertifizierungsverfahren zur Konformitätsbewertung"
publisher: DIN Deutsches Institut für Normung e.V.
year: 2020
edition: "2020-07"
pages: 24
scope: sicherheitsdienstleistungen
relevance: [zertifizierung, audit, konformitaetsbewertung, zertifizierungsstelle, ueberwachungsaudit, rezertifizierung, cert-expert]
norm_anchors: []
bot_may_cite: false
source_file: "inputs/raw_standards/DIN/DIN 77200-3.pdf"
last_reviewed: 2026-06-10
status: reviewed
---

# DIN 77200-3:2020-07 — Zertifizierungsverfahren

**Vollständiger Titel:** Sicherungsdienstleistungen – Teil 3: Zertifizierungsverfahren zur Konformitätsbewertung von Sicherungsdienstleistungen nach DIN 77200-1 und DIN 77200-2
**Stand:** Juli 2020 · **Seiten:** 24 · **In Kraft:** 2020-07-01 · **Ersetzt:** DIN 77200-3:2017-11

---

## Zweck

Beschreibt das **Prüfverfahren** für die Konformitätsbewertung (Zertifizierung) von SDL nach DIN 77200-1 und/oder DIN 77200-2. Richtet sich an Zertifizierungsstellen (akkreditiert nach DIN EN ISO/IEC 17065) und Sicherheitsdienstleister als Kunden. Ist für **Cert-Expert direkt relevant**: Die Norm definiert, was im Audit geprüft wird — und damit, worauf Kunden vorbereitet sein müssen.

---

## Inhaltsstruktur

| Abschnitt | Titel |
|-----------|-------|
| 4.2 | Allgemeine Anforderungen (Akkreditierung, Qualifikationsquoten) |
| 4.3 | Zertifizierungsstelle + öffentliches Verzeichnis |
| 4.4.1 | Zertifizierungsdauer und -gültigkeit |
| 4.4.2 | Auditierung (Erst-, Überwachungs-, Rezertifizierungsaudit) |
| 4.4.5 | Zertifikat (Pflichtinhalt) |
| 4.4.6 | Überwachungsaudit |
| 4.4.7 | Rezertifizierungsaudit |
| 4.4.11 | Widerruf |
| Anhang A (normativ) | Stichprobenumfänge je DIN-77200-1-Abschnitt |
| Anhang B (normativ) | Unterlagenübersicht zur Zertifizierung |
| Anhang C (normativ) | Zertifikatsgestaltung |

---

## Kernaussagen für den Bot

**Zertifizierungsdauer (4.4.1):**
- Zertifikat gilt **3 Jahre**
- Erteilung nur nach vollständiger Mängelbehebung
- Subunternehmer-Grenze: Zertifizierung unzulässig, wenn SDL > 50 % durch Subunternehmer erbracht wird
- Frist Zertifizierungsabschluss: innerhalb **12 Monate** nach Auftragserteilung

**Qualifikationsquoten für Zertifizierung (Tabelle 1):**
- Erstzertifizierung: 35 % der SMA je SDL müssen qualifiziert sein (20 % für Veranstaltungen, 30 % für ÖPV/Objekte/Flüchtlingsunterkünfte)
- Rezertifizierung: 60 % (40 % Veranstaltungen)

**Auditstruktur:**
- **Erstaudit:** alle DIN-77200-Anforderungen, min. 1 Auftrag vor Ort je SDL
- Mindestauditzeit je Unternehmensgröße: 1–100 SMA = **8 h**, 101–200 SMA = **12 h**, > 200 SMA = **16 h**; Niederlassungen × 0,5
- **Überwachungsaudit:** jährlich, Mindestumfang = 0,5 × Erstaudit-Zeit
- **Rezertifizierungsaudit:** im letzten Zertifizierungsjahr, spätestens 3 Monate vor Ablauf

**Was im Audit geprüft wird (Anhang A — stichprobenartig):**
- 4.1 b) Mitarbeiter-Nachweise (Unterrichtung, Sachkunde, Einweisung, Datenschutz-VE) → Stichprobe: S = 1 + (ln(Mmin))², max. 45
- 4.8 Gefährdungsbeurteilungen pro Leistungsort → S = √(G/0,5), max. 36
- 4.10 Verträge, 4.11 Anforderungsprofile, 4.12 Dienstanweisungen → jeweils S = √(x/0,5), max. 36
- 4.14.1–4.14.5 Personal/Unterweisung → innerhalb SMA-Stichprobe
- 4.19 Qualifikation/Weiterbildung → innerhalb SMA-Stichprobe
- 4.24 Führungskräfte, 4.25 Einsatzkräfte → vor Ort am Leistungsort

**Öffentliches Zertifizierungsverzeichnis (4.3.2):**
- Zertifizierungsstelle veröffentlicht kostenlos: Kunde, SDL, Norm, Gültigkeitszeit
- Zertifikat darf für Werbung verwendet werden — nur im zutreffenden Geltungsbereich

---

## Relevanz für Cert-Expert

- **Cert-Expert als Zertifizierungsdienstleister** muss diesen Prozess kennen und Kunden darauf vorbereiten
- Qualifikationsquoten (35/60 %) = Zielmarken für das Certification OS: wie viele SMA müssen auf welchem Stand sein
- Stichprobentabelle Anhang A = direkte Ableitung, welche Dokumente im Audit vorgelegt werden müssen (Nachweisliste im Tool)
- Überwachungsaudit jährlich + Rezertifizierung alle 3 Jahre = Fristen für Kundenerinnerungen
- Subunternehmer-Grenze 50 % = Risikohinweis für Kunden mit hohem Fremdpersonalanteil
- Führt DAkkS-akkreditierte Zertifizierungsstellen als Pflichtpartner ein → Kooperationspartner-Recherche für Cert-Expert sinnvoll

---

## Was der Bot NICHT darf

- Keine wörtlichen Normtextzitate (Copyright DIN e.V.)
- Nicht behaupten, Cert-Expert selbst sei Zertifizierungsstelle — das erfordert DAkkS-Akkreditierung nach ISO/IEC 17065
- Stichprobenformeln (S = √(x/0,5) etc.) nicht ohne Kontext verwenden — sie gelten nur für akkreditierte Auditoren
- Keine Aussage zur Zertifizierungsfähigkeit eines Unternehmens (EC-10)
- Zertifizierungsdauer 3 Jahre ≠ Norm-Gültigkeit — die Norm selbst kann früher geändert werden
