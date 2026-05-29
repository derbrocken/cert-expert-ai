# Control Measures (`control_measures/`)

Dieser Ordner enthält **kuratierte Steuerungs- und Schutzmaßnahmen** für die **generierungsunterstützte Erstellung** von Veranstaltungsunterlagen — insbesondere Gefährdungsbeurteilungen, Sicherheits-, Einsatzkonzepten und bausteinhaltigen Dienstanweisungen im Kontext von Veranstaltungsschutz und professionellen Sicherheitsdiensten.

Die Markdown-Dateien sind **keine allgemeinen Erklärtexte**, sondern **strukturierte Eingabewissensschichten** für ein KI-gestütztes Tool: Sie liefern Aktivierungslogik, Klärungsfragen, Risikoindikatoren, präventive und dynamische Maßnahmenoptionen sowie formulationsnahe Bausteine — immer unter Berücksichtigung von **Verhältnismäßigkeit** und **Sekundärgefahren** durch die Maßnahmen selbst.

Konzeptionell können die Inhalte an etablierte Grundlagen zur Veranstaltungs- und Crowd-Sicherheit anknüpfen (u. a. DGUV Information 215-310; international übliche Crowd-Management-Leitlinien wie HSE Event Safety; SGSA „Green Guide“ und Stewarding-Orientierungen; Konfliktmanagementprinzipien aus Polizei- und Sicherheitswissenschaften). **Konkrete DIN-/Norm-Zitate** oder Behauptungen zur Normkonformität gehören nur ins Dokument, wenn sie **projektseitig belegt** sind.

---

## Bezug zu `risk_patterns/`

Unter `knowledge/7_guides/risk_patterns/` werden typische **Risiko- und Gefährdungsmuster** geführt (z. B. aggressive Gruppen, Gedränge). Die Dateien hier beschreiben **geeignete Maßnahmenlogiken und Umsetzungsdimensionen**, die zu diesen Mustern passen können.

**Kombinationslogik für das Tool:**

1. Zuerst passende **Risikomuster** aus `risk_patterns/` aktivieren (Trigger, Frühindikatoren, Treiber).
2. Dann **passende Control-Measure-Dateien** aus diesem Ordner wählen, deren Abschnitt **„When this file should be activated“** zur Situation passt.
3. Maßnahmen **nicht isoliert** ausgeben: immer Schnittstellen (Einlass, Zonen, Funk, Evakuierung, Behörden) und **Nebenwirkungen** der Maßnahme prüfen (z. B. Einlasskontrolle → Schlange vor Rettungsweg).
4. Die Abschnitte **„Tool logic / generation rules“** und **„Example wording“** sind bei der Textgenerierung verbindlicher Orientierungsrahmen als die narrativen Mittelteile allein.

---

## Index der Maßnahmen-Leitdateien

| Datei | Schwerpunkt |
|-------|-------------|
| [access_control.md](access_control.md) | Zutritt, Kontrollen, Einlasslogik, Schlange vs. Sicherheit vs. Rettungswege |
| [deescalation.md](deescalation.md) | Konfliktgespräch, Abstand, Eskalationsgrenzen, Hausrecht vs. Polizei |
| [visitor_separation.md](visitor_separation.md) | Zonen, rivalisierende Gruppen, statische/dynamische Trennung, Schnittstellen |
| [evacuation_management.md](evacuation_management.md) | Evakuierung vs. Ausgang, Alarmketten, Kommunikation, Wegefreihaltung |
| [radio_communication.md](radio_communication.md) | Funkkommunikation, Meldewesen, Funkdisziplin, Eskalationskommunikation, Backup-Kommunikation, Protokollierung, kleine/große Teams |

---

## Hinweis zur Pflege

Neue Maßnahmenkapitel sollten dieselbe **elfteilige Gliederung** wie die bestehenden Dateien verwenden, damit das Tool zuverlässig parsen und kombinieren kann.
