# Dashboard UX Changelog V1

**Stand:** 2026-06-03  
**Betroffene Datei:** `hq/00_Dashboard/MASTER_COMMAND_CENTER.md`  
**Backup:** `hq/00_Dashboard/MASTER_COMMAND_CENTER_BACKUP_BEFORE_UX_V1.md`

---

## Was wurde visuell/strukturell geändert?

- **Neue Abschnittslogik 0–12** statt alter Command Strip / Today Run / nummerierter Querschnittsblöcke.
- **Sofortblick (Abschnitt 0)** als kompakte Tabelle ganz oben — brennt / Audits / Forderungen / Waiting / DFSS auf einen Blick.
- **Audit-Countdown (Abschnitt 2)** als sortierte Tabelle aller Kunden mit eindeutigem Auditdatum oder harter Frist.
- **Rote Kunden (Abschnitt 3)** als Kurzliste mit Warum + max. 3 Aufgaben je 🔴-Kunde.
- **Kundenkarten (Abschnitt 4)** vereinheitlicht: Metadaten als Tabelle, Checkbox-Listen darunter unverändert.
- **Rollups (Abschnitt 5 + 6)** — „Wartet auf Kunde / Extern“ und „Intern offen“ querschnittlich mit Kundenprefix.
- **Querschnitt getrennt** — Forderungen, Vertrieb, Intern, Privat, Quick Capture, Parked mit `---` und Zweck-Hinweisen (`>`).
- **Today Run** als optionaler Unterblock unter Abschnitt 1 erhalten (keine To-dos entfernt).
- **Morgens-Hinweis** unter dem Titel: 0–3 lesen → 1 abarbeiten → 4+ Details.

---

## Welche Daten wurden nicht verändert?

- Keine neuen Kunden, Auditdaten, Fristen oder Beträge.
- Keine Kundendateien unter `hq/03_Kundenprojekte/` geändert.
- Alle **bestehenden Checkbox-Texte** in Kundenkarten und Querschnittsblöcken übernommen.
- **2 erledigte Standardpunkte** unverändert: `[x]` LC_Security Abweichungen · `[x]` SecuGuard Audit durchgeführt.
- Keine offenen Aufgaben abgehakt, keine erledigten wieder geöffnet.

---

## Regeln für die Nutzung

1. **Markdown bleibt Arbeitsfläche** — Aufgaben direkt in dieser Datei abhaken (`- [ ]` → `- [x]`).
2. **Morgens:** Abschnitt 0 → 1 → bei Bedarf 2–3; Details und Pflichtlisten in Abschnitt 4.
3. **Rollups (5/6)** sind Übersicht — bei Abhaken idealerweise auch die zugehörige Zeile in Abschnitt 4 pflegen (kein Sync, manuell).
4. **Quick Capture (11)** für unsortierte Eingaben; **Parked (12)** bewusst nicht jetzt.
5. **Backup** vor größeren Strukturänderungen: `MASTER_COMMAND_CENTER_BACKUP_BEFORE_UX_V1.md`.

---

## Hinweis

Das Dashboard ist bewusst **keine HTML-App** und **keine Automatisierung** — eine große, ADHS-/ADS-freundliche Markdown-Fläche mit Tabellen für Überblick und Checkboxen für Arbeit.
