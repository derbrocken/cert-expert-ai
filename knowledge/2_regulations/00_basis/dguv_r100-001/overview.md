---
type: regulation
subtype: dguv-regel
number: "100-001"
title: "Grundsätze der Prävention"
publisher: DGUV
year: 2025
pages: 116
scope: all-sectors
relevance: [gbu, unterweisung, organisation, sicherheitsbeauftragte, erste-hilfe, psa, audit]
norm_anchors: [CL-75]
bot_may_cite: false
source_file: inputs/raw_standards/dguv/100-001.pdf
last_reviewed: 2026-06-10
status: reviewed
---

# DGUV Regel 100-001 — Grundsätze der Prävention

**Vollständiger Titel:** Grundsätze der Prävention — Regel zur Konkretisierung der DGUV Vorschrift 1
**Herausgeber:** DGUV · **Stand:** Juni 2025 · **Seiten:** 116

---

## Zweck

DGUV Regel 100-001 konkretisiert und erläutert die **DGUV Vorschrift 1 „Grundsätze der Prävention"**. Sie ist die Basisregel für alle UV-Träger-Mitglieder und gilt branchenübergreifend. Sie ist keine Vorschrift mit Vermutungswirkung, aber eine anerkannte fachliche Richtschnur.

---

## Inhaltsstruktur (Kapitel)

| Nr. | Titel | Schlüsselthemen |
|-----|-------|-----------------|
| 1 | Allgemeine Vorschriften | Geltungsbereich UVV |
| 2.1 | Grundpflichten des Unternehmers | GBU, Schutzmaßnahmen |
| 2.2 | Beurteilung der Arbeitsbedingungen, Dokumentation | GBU-Pflicht, Dokumentation |
| 2.3 | Unterweisung der Versicherten | Unterweisungspflicht |
| 2.4 | Vergabe von Aufträgen | Auftragnehmer-Pflichten |
| 2.6 | Befähigung für Tätigkeiten | Qualifikationsnachweis |
| 3 | Pflichten der Versicherten | Mitwirkungspflichten |
| 4A | Sicherheitstechnische/betriebsärztliche Betreuung + **Sicherheitsbeauftragte** | §20, Schwellenwerte |
| 4B | Maßnahmen bei besonderen Gefahren | Notfallorganisation |
| 4C | Erste Hilfe | Ersthelfer, Anzahl, Ausbildung |
| 4D | Persönliche Schutzausrüstungen | Bereitstellung, Benutzung |
| 6 | Glossar | Begriffsdefinitionen |

---

## Kernaussagen für den Bot

**Gefährdungsbeurteilung (§3 DGUV V1 / Kap. 2.2):**
- Pflicht für alle Arbeitsplätze und Tätigkeiten — auch außerhalb des Betriebsgeländes
- Dokumentationspflicht: Ergebnis, Maßnahmen, Termine, Verantwortliche, Wirksamkeitskontrolle
- Muss von fachkundigen Personen durchgeführt werden

**Unterweisung (Kap. 2.3):**
- Vor Tätigkeitsaufnahme + in angemessenen Abständen (mind. jährlich)
- Themen aus der GBU ableiten
- Mit Nachweis dokumentieren

**Sicherheitsbeauftragte (Kap. 4A, §20):**
- **Seit 29.05.2026: Bestellpflicht ab 50 Beschäftigten** (bisher 20) — Ausnahmen bei besonderer Gefährdung möglich
- Aufgaben: Beobachten, Melden, Unterstützen — keine Weisungsbefugnis

**Erste Hilfe (Kap. 4C):**
- Ersthelfer-Anzahl: mind. 10 % der Beschäftigten (≥ 2 Personen immer)
- Ausbildung: 9 UE (Erste-Hilfe-Grundausbildung) + Auffrischung alle 2 Jahre
- Dokumentationspflicht für Ersthelfer-Nachweis

**Pflichtenübertragung (Kap. 2.12):**
- Schriftliche Übertragung erforderlich
- Unternehmer bleibt in der Auswahlverantwortung

---

## Relevanz für Cert-Expert

- **Basis-Norm** für alle Kunden — jeder Sicherheitsdienstleister ist VBG-Mitglied und damit gebunden
- Definiert Grundgerüst für GBU, Unterweisung, Ersthelfer und Sicherheitsbeauftragte → direkte Inputs für Requirement Engine (Slice 2)
- **Sicherheitsbeauftragte-Schwellenwert 50** (seit 29.05.2026) muss in Compliance-Check korrekt hinterlegt sein
- Ersthelfer-Quoten (10 %) + Auffrischungs-Takt (2 Jahre) = konkrete Prüfparameter im Tool
- Verknüpft mit CL-75 (Unterweisungspflicht), ggf. eigene CL-ID für Sicherheitsbeauftragte nötig → fachlich prüfen

---

## Was der Bot NICHT darf

- Keine Paragrafenzitate wörtlich ohne Input-Beleg (Copyright DGUV)
- Nicht behaupten, dass Sicherheitsbeauftragte ab 20 MA bestellt werden müssen — Schwellenwert ist seit 29.05.2026 auf 50 erhöht
- Keine automatische Auditfähigkeitsaussage (EC-10)
- Keine CL-ID verwenden, die nicht im Klausel-Register belegt ist
