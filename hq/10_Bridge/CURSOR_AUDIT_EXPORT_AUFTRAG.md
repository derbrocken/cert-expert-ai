# CURSOR_AUDIT_EXPORT_AUFTRAG — Druck-/PDF-fähige Vorzeige-/Audit-Ansicht (Lane B)

> **Lane B (Präsentation) — parallel-safe.** Berührt **KEINE** Engine-Datei (`requirement-engine.ts`), **NICHT** `EmployeeForm.tsx` und **NICHT** den EC-09-ZIP-Generator. Kann gleichzeitig mit Lane A (ÖPV-Engine) laufen, ohne zu kollidieren.
> **Rollen-Kontrakt:** Bot baut nur diesen Auftrag, committet, hängt EINEN Ergebnis-Eintrag in HANDOFF an, parkt Zweifel als Frage.

## 1. Was kann Mark am Ende
Pro Person eine **druck-/PDF-fähige Vorzeige-Ansicht** der bestehenden read-only Übersicht — eine saubere Seite, die er beim Audit zeigen/als PDF „drucken" kann (Browser → Druck → „Als PDF sichern"). Inhalt = die bereits berechnete Akte-Übersicht (Pflicht-Set + CL-Badges, Ampel, UE-Soll/Ist, Fristen, offene Punkte) mit EC-10-Disclaimer.

## 2. Default-Entscheid (Planer, überschreibbar von Mark)
**Standalone Druck-/PDF-Ansicht, NICHT in den EC-09-ZIP integriert.** Begründung: EC-09 (ZIP-Generator) ist der kritischste Pfad — ihn nicht anfassen hält Lane B risikolos + parallel-safe. Falls Mark stattdessen den Export **im ZIP** will, ist das ein eigener Lane-A-naher Slice (EC-09-kritisch) → dann hier parken und Mark fragen.

## 3. Scope / Dateien
- **Wiederverwenden:** `EmployeeFileOverview.tsx` (read-only, rendert `getEmployeeFileSummary`) — **Single Source of Truth, nicht neu berechnen.** Props: `{ employee, roles, appointments, companyName, evidenceFiles }`.
- **Neu:** eine print-optimierte Hülle/Route, z. B. `EmployeeFileAuditPrint.tsx` + ein „Drucken / Als PDF"-Knopf an der Übersicht (oder eine eigene `?print=1`/Route, die nur die Übersicht + Print-CSS rendert: A4, Seitenumbrüche, keine App-Chrome/Nav).
- **Print-CSS:** `@media print` — Header/Footer mit Firma + Person + Datum, EC-10-Disclaimer sichtbar, keine interaktiven Affordances.
- **KEINE** Änderung an: `requirement-engine.ts`, `employee-file-requirements.ts` (nur lesen), `EmployeeForm.tsx`, Generator/ZIP-Action.

## 4. DoD (alle grün)
- `tsc --noEmit` = 0.
- **EC-09-ZIP** `POST /employee-automation` **200** unberührt (Generator nicht angefasst — nur gegenprüfen, dass nichts kaputt ist).
- **Browser :3001:** Druck-/PDF-Ansicht rendert je Person korrekt (Bewachung + Verwaltung), Werte identisch zur Übersicht (gleiche Summary), Print-Layout sauber (A4, kein abgeschnittener Inhalt), EC-10-Disclaimer prominent.
- **Keine** Engine-/Norm-/UE-Datei geändert. `.env`/`.db`/`hq/03_Kundenprojekte/**` nicht committen.

## 5. Offen für Mark (nicht raten)
- **Format-Bestätigung:** Standalone-Druck (Default) **oder** Export-Datei im ZIP? (Default = standalone, EC-09-frei.)
- **Inhaltsumfang:** genau die Übersicht 1:1, oder zusätzliche Felder (z. B. Stammdaten-Kopf erweitern)? → bis zur Antwort: Übersicht 1:1.

## 6. Kickoff-Prompt (neuer Bot, `main`)
> Du bist Executor (Spur E). Lies `CLAUDE.md` + `hq/10_Bridge/HANDOFF.md` (HIER STARTEN) + **diesen Auftrag**. Baue eine **druck-/PDF-fähige Vorzeige-Ansicht**, die `EmployeeFileOverview` wiederverwendet (§3, Default standalone, EC-09 nicht anfassen). Halte §4-DoD grün (tsc 0 / EC-09-ZIP 200 unberührt / Browser-Print sauber / EC-10). Committe mit Marks OK, hänge EINEN Ergebnis-Eintrag in HANDOFF an. Bei Format-Zweifel (§5) parken + Frage an Mark/Planer; plan nicht umschreiben.
