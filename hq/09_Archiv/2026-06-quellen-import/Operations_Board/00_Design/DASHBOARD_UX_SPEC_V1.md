# Dashboard UX Spec V1 — Cert-Expert Command Center

> **Status 2026-06-04:** Experiment eingefroren (Option A). Spec bleibt als Referenz; Tagesbetrieb: `Tagesbriefing.md` + `03_Kundenprojekte/*/ToDos.md`. Archiv: `hq/09_Archiv/2026-06-dashboard-experiment/`.

## Ziel des Dashboards

Das Command Center ist die zentrale Arbeitsfläche für Cert-Expert. Morgens öffnet der Nutzer eine einzige Markdown-Datei und sieht berufliche und private Aufgaben, Kundenprojekte, Standardpunkte und geparkte Themen auf einer Fläche — ohne zwischen vielen Tools wechseln zu müssen.

## Arbeits-Dashboard, kein reines Anzeige-Dashboard

V1 ist bewusst editierbar. Aufgaben werden direkt in der Datei ergänzt, umgeschrieben und abgehakt. Es gibt keine separate „View“- und „Edit“-Schicht. Was auf dem Whiteboard steht, ist gleichzeitig die Arbeitsliste.

## Markdown-Checkboxen sind Pflicht

Alle Aufgaben nutzen echte Markdown-Checkboxen:

```markdown
- [ ] offene Aufgabe
- [x] erledigte Aufgabe
```

Checkboxen funktionieren in Obsidian, VS Code, Cursor und anderen Markdown-Editoren mit Checkbox-Support. Abhaken passiert lokal in der Datei — ohne Backend, ohne Sync, ohne zusätzliche UI.

## ADHS-/ADS-freundlich

- Eine Datei, ein Einstieg — kein Kontextwechsel am Morgen
- Klare visuelle Blöcke mit nummerierten Hauptsektionen
- Command Strip mit maximal drei „heute wichtigsten“ Aktionen
- Today Run als chronologischer Tageslauf statt unendlicher Flatlist
- Quick Capture für impulsive Eingaben ohne sofortige Sortierung
- Parked / Not Now trennt bewusst zurückgestellte Themen vom aktiven Arbeitsfeld
- Kundenkarten wiederholen dieselbe Struktur — weniger Entscheidungslast pro Projekt

## Große Whiteboard-Logik

Das Dashboard folgt der Logik eines physischen Whiteboards: alles Relevante ist sichtbar, nichts ist in versteckten Tabs. Panorama (Kunden, Vertrieb, Forderungen, Intern, Privat) und Tagessteuerung (Command Strip, Today Run) leben in einer Datei. Später können Unterordner (`00_Morning`, `01_Today_Run` usw.) ergänzende Ansichten aufnehmen — V1 startet zentral in `MASTER_COMMAND_CENTER.md`.

## Klare Trennung der Bereiche

| Bereich | Funktion |
|---------|----------|
| **Panorama** | Alles sehen und sammeln — Kundenkarten, Vertrieb, Forderungen, Intern, Privat |
| **Today Run** | Konkrete Abarbeitung — Morgenstart, Kommunikation, Deep Work, Admin, Tagesabschluss |
| **Quick Capture** | Schnelle Eingabe ohne Sortierung |
| **Kundenkarten** | Projektsteuerung je Kunde mit Top-To-dos, Warteschlangen und Standardpunkten |
| **Standardpunkte** | Wiederkehrende Pflichtpunkte (Angebot, DEKRA, KSA, Audit, Rechnung) als Checkbox-Listen |

## Grenzen V1

- **Keine Automatisierung** — keine Sync-Skripte, kein Bot, kein Pull aus Kunden-Statusdateien
- **Keine HTML-App** — reines Markdown
- **Keine Daten erfinden** — fehlende Fakten bleiben `nicht erfasst`; Befüllung erfolgt manuell oder in späteren Phasen mit expliziter Datenquelle
- **Keine Kundendateien verändern** — Kundenakten unter `03_Kundenprojekte/` bleiben Quelle; das Dashboard verlinkt nur

## Referenzdateien

- Arbeitsfläche: `hq/00_Dashboard/MASTER_COMMAND_CENTER.md`
- Kundenkarte: `hq/08_Vorlagen/04_Board_Templates/KUNDENKARTE_DASHBOARD_TEMPLATE.md`
- Privat: `hq/08_Vorlagen/04_Board_Templates/PRIVATE_LIFE_ADMIN_TEMPLATE.md`
- Vertrieb/Forderungen: `hq/08_Vorlagen/04_Board_Templates/VERTRIEB_FORDERUNGEN_TEMPLATE.md`
