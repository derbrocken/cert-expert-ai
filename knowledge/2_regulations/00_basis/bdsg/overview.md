---
type: regulation
subtype: gesetz
number: "DSGVO / BDSG"
title: "DSGVO (EU 2016/679) + BDSG — Datenschutz-Grundverordnung und Bundesdatenschutzgesetz"
publisher: "Europäisches Parlament / Bundesministerium der Justiz"
year: 2026
pages: 45
scope: all-sectors
relevance:
  - Personalakte Datenschutz
  - Beschäftigtendatenschutz §26 BDSG
  - Videoüberwachung §4 BDSG
  - Aufbewahrungsfristen Personalunterlagen
  - Datenschutzbeauftragter
  - Einwilligung Mitarbeiterdaten
norm_anchors: []
bot_may_cite: false
source_file: "inputs/raw_standards/BDSG/BDSG.pdf"
note: "BDSG vom 30.6.2017, zuletzt geändert Art. 3 G v. 12.5.2026 (BGBl. 2026 I Nr. 139). Ergänzt und konkretisiert die DSGVO für Deutschland. Die DSGVO selbst (EU 2016/679) ist nicht als separate PDF vorhanden — BDSG enthält die nationalen Durchführungsbestimmungen. Für Personalakten ist §26 BDSG zentral."
last_reviewed: 2026-06-11
status: aus PDF
---

## Zweck

Das BDSG ergänzt und konkretisiert die DSGVO (EU 2016/679) für Deutschland. Es regelt Datenschutz bei öffentlichen und nichtöffentlichen Stellen. Für Arbeitgeber besonders relevant: **§26 BDSG** (Beschäftigtendatenschutz) und **§4 BDSG** (Videoüberwachung). Die DSGVO selbst gilt unmittelbar in allen EU-Staaten; das BDSG füllt nationale Öffnungsklauseln aus.

## Inhaltsstruktur BDSG (45 Seiten)

| Teil / § | Inhalt |
|----------|--------|
| Teil 1 | Gemeinsame Bestimmungen (§§1–21): Anwendungsbereich, Videoüberwachung, Datenschutzbeauftragter öffentlich, BfDI |
| **§4** | **Videoüberwachung öffentlich zugänglicher Räume** — Voraussetzungen, Kennzeichnungspflicht |
| Teil 2 | Durchführungsbestimmungen für DSGVO-Verarbeitungen (§§22–44) |
| **§26** | **Datenverarbeitung Beschäftigungsverhältnis** — Zweck, Einwilligung, besondere Kategorien |
| §27–29 | Forschung, Archivzwecke, Geheimhaltungspflichten |
| Teil 3 | Durchführungsbestimmungen Strafverfolgung (§§45–84) |
| Teil 4 | Nationale Sicherheit (§§85–) |

## Kernaussagen für den Bot

- **§26 BDSG — Beschäftigtendatenschutz:** Verarbeitung personenbezogener Daten im Beschäftigungsverhältnis ist zulässig für Begründung, Durchführung und Beendigung des Arbeitsverhältnisses. Straftatverdacht erfordert erhöhte Anforderungen.
- **Einwilligung §26 Abs. 2:** Einwilligung von Beschäftigten muss freiwillig und schriftlich sein; Freiwilligkeit besonders zu prüfen wegen Abhängigkeitsverhältnis.
- **Besondere Kategorien §26 Abs. 3:** Gesundheitsdaten, Nationalität, Gewerkschaftszugehörigkeit — erhöhte Anforderungen; Einwilligung oder Tarifvertrag/Betriebsvereinbarung.
- **§4 Videoüberwachung:** Öffentlich zugängliche Räume dürfen unter bestimmten Voraussetzungen überwacht werden; Kennzeichnungspflicht, Zweckbindung, Löschfristen.
- **Aufbewahrungsfristen:** Personalunterlagen folgen steuer-/handelsrechtlichen Fristen (6/10 Jahre); DSGVO-Grundsatz der Datensparsamkeit und Speicherbegrenzung.
- **Datenschutzbeauftragter:** Ab 20 Personen mit ständig automatisierter Datenverarbeitung oder bei bestimmten Verarbeitungen Pflicht (§38 BDSG).

## Relevanz für Cert-Expert / DIN 77200-2

- **Personalakte / Certification OS:** Jede Mitarbeiterakte enthält personenbezogene Daten → §26 BDSG greift; Zweckbindung (nur für Arbeitsverhältnis), Datensparsamkeit, Löschkonzept erforderlich
- **Videoüberwachung SDL:** Wachunternehmen überwachen oft Objekte per Kamera → §4 BDSG + ggf. DSGVO Art. 13/14 Informationspflichten
- **Zertifizierungsaudit:** Datenschutzkonzept für Personalakten ist Audit-Nachweis (ISO 9001 Kap. 7.5 dokumentierte Information + DSGVO)
- **Certification OS DSGVO-Guardrail:** `prisma/**/*.db` enthält Personendaten → nie committen; Löschkonzept für ausgeschiedene Mitarbeiter offen
- **Besondere Kategorie:** Nationalität in Mitarbeiterakte (SDL-Kontext Flüchtlingsunterkunft) = §26 Abs. 3 BDSG — erhöhte Anforderungen

## Was der Bot nicht darf

Keine Paragrafentexte wörtlich zitieren. Keine Rechtsberatung zu Einzelfällen. Nicht behaupten, ob ein spezifischer Verarbeitungsvorgang zulässig ist (Einzelfallprüfung). Keine Auditfähigkeitsaussage (EC-10). Datenschutzrechtliche Fragen immer an Datenschutzbeauftragten/Rechtsanwalt verweisen.
