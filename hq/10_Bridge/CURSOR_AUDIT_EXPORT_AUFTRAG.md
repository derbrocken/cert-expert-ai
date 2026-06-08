# CURSOR_AUDIT_EXPORT_AUFTRAG — Druck-/PDF-fähige Vorzeige-/Audit-Ansicht (Lane B)

> **Lane B (Präsentation) — parallel-safe.** Berührt **KEINE** Engine-Datei (`requirement-engine.ts`), **NICHT** `EmployeeForm.tsx` und **NICHT** den EC-09-ZIP-Generator. Kann gleichzeitig mit Lane A (ÖPV-Engine) laufen, ohne zu kollidieren.
> **Rollen-Kontrakt:** Bot baut nur diesen Auftrag, committet, hängt EINEN Ergebnis-Eintrag in HANDOFF an, parkt Zweifel als Frage.

## 1. Was kann Mark am Ende (Spec Mark, 2026-06-08)
**Zwei Funktionen über der bestehenden read-only Übersicht:**
1. **Auswahl, welche Mitarbeiterakten exportiert werden** — in der fertigen Personalakte/Liste: **„alle auswählen", einzelne abwählen, oder einzeln anwählen** (Mehrfach-/Batch-Auswahl, wie die bestehende ZIP-Batch-Auswahl). Export = read-only Übersicht je gewählter Person.
2. **Pro Feld 1-Klick-Kopieren** — neben jedem Feld/Wert ein **Copy-to-Clipboard-Button** (wie die Kopier-Buttons an Code-Blöcken / Admin-Server-Seiten), damit Mark einzelne Felder mit einem Klick herauskopieren kann. Inkl. „alles kopieren" je Akte optional.

Inhalt der Ansicht = die bereits berechnete Akte-Übersicht (Pflicht-Set + CL-Badges, Ampel, UE-Soll/Ist, Fristen, offene Punkte) mit EC-10-Disclaimer.

## 2. Default-Entscheid (Planer, überschreibbar von Mark)
**Read-only Export-/Vorzeige-Ansicht, NICHT in den EC-09-ZIP integriert.** EC-09 (ZIP-Generator) bleibt unangetastet → Lane B parallel-safe. Druck/„Als PDF" zusätzlich möglich, aber Kern ist **Batch-Auswahl + Feld-Kopieren**. Die Batch-Auswahl der Personen **wiederverwendet** das bestehende Auswahl-Muster der Liste (nicht den ZIP-Generator-Action umbauen).

## 3. Scope / Dateien
- **Wiederverwenden:** `EmployeeFileOverview.tsx` (read-only, rendert `getEmployeeFileSummary`) — **Single Source of Truth, nicht neu berechnen.** Props: `{ employee, roles, appointments, companyName, evidenceFiles }`.
- **Batch-Auswahl:** bestehende Mehrfach-Auswahl der Mitarbeiter-Liste wiederverwenden (Checkbox je Person + „alle auswählen/abwählen"). **NICHT** die ZIP-Generator-Action (`handleGenerate`/`generateBar`) verändern — nur die Auswahl-Menge lesen, um die Übersichten der gewählten Personen zu rendern.
- **Feld-Kopieren:** kleine wiederverwendbare `CopyButton`-Komponente (Clipboard-API, „kopiert"-Feedback) neben Feldern/Werten in `EmployeeFileOverview` (bzw. einer dünnen Export-Hülle). Reine UI, kein Datenfluss-Eingriff.
- **Optional (kein Muss):** print-optimierte Hülle/Route (`@media print`, A4) für „Als PDF".
- **KEINE** Änderung an: `requirement-engine.ts`, `employee-file-requirements.ts` (nur lesen), `EmployeeForm.tsx`, Generator/ZIP-Action.

## 4. DoD (alle grün)
- `tsc --noEmit` = 0.
- **EC-09-ZIP** `POST /employee-automation` **200** unberührt (Generator nicht angefasst — nur gegenprüfen, dass nichts kaputt ist).
- **Browser :3001:** (a) Batch-Auswahl funktioniert (alle auswählen / einzeln ab-/anwählen) und rendert die Übersicht je gewählter Person; (b) **Feld-Kopieren** je Feld mit 1 Klick (Clipboard enthält den Feldwert, sichtbares „kopiert"-Feedback). Werte identisch zur Übersicht (gleiche Summary), EC-10-Disclaimer prominent.
- **Keine** Engine-/Norm-/UE-Datei geändert. `.env`/`.db`/`hq/03_Kundenprojekte/**` nicht committen.

## 5. Offen für Mark (nicht raten)
- **Kopier-Granularität:** pro Einzelfeld (Default) — zusätzlich „ganze Akte als Text kopieren"? (Default: beides, Einzelfeld + „alles kopieren".)
- **Kopier-Format:** nur der Wert (Default) oder „Label: Wert"? (Default: nur Wert; bei „alles kopieren" → „Label: Wert"-Liste.)
- **PDF/Druck:** als Zusatz gewünscht oder reicht Batch-Ansicht + Kopieren? (Default: Druck-CSS als Bonus, kein Blocker.)

## 6. Kickoff-Prompt (neuer Bot, `main`)
> Du bist Executor (Spur E). Lies `CLAUDE.md` + `hq/10_Bridge/HANDOFF.md` (HIER STARTEN) + **diesen Auftrag**. Baue eine **druck-/PDF-fähige Vorzeige-Ansicht**, die `EmployeeFileOverview` wiederverwendet (§3, Default standalone, EC-09 nicht anfassen). Halte §4-DoD grün (tsc 0 / EC-09-ZIP 200 unberührt / Browser-Print sauber / EC-10). Committe mit Marks OK, hänge EINEN Ergebnis-Eintrag in HANDOFF an. Bei Format-Zweifel (§5) parken + Frage an Mark/Planer; plan nicht umschreiben.
