# CURSOR_UEBERSICHT_READONLY_AUFTRAG — Read-only Akte-/Vorzeige-Übersicht (Queue B / Pt 1)

> **Status:** baufertig (Planer, 2026-06-08). Bau via Subagent im neuen Modus (1 Planer-Chat steuert + Subagent baut). **Mark hat „los, keine Hindernisse" gegeben.**
> **Quelle:** `CURSOR_NAECHSTE_QUEUE.md` B + `CURSOR_SCHULUNGSKATALOG_PLANUNG.md` §5 Pt 1.
> **Rollen-Kontrakt:** Baue nur, was hier steht. Bei Norm-/Scope-Zweifel parken + Frage in HANDOFF (nicht erfinden, nicht umplanen).

## 1. Was kann Mark am Ende (Nutzerergebnis)
- Pro Person eine **read-only Abschluss-/Vorzeige-Ansicht** — eine saubere Sicht **ohne** Bearbeiten-Stifte, Edit-Tabellen oder Upload-Knöpfe.
- Zeigt aggregiert die **bereits berechneten** Daten: Kopf (Name/Rolle/Norm-Klassen), Ampel/Pflicht-Status (Slice 4), Pflicht-Set mit CL-Badges, Pflichtnachweise (Status, read-only), Schulung/Unterweisung, UE-Soll/Ist-Übersicht (read-only), Fristen, offene Punkte.
- **Umschaltbar** zwischen „Bearbeiten" (bestehende `EmployeeFileDossierView`) und „Übersicht" (neue Ansicht) — Toggle/Tab pro Akte.
- EC-10-Disclaimer prominent: „rechnerischer Stand · kein Freigabe-/Auditfähigkeits-/Zertifizierungsstatus".

## 2. 🔴 Harte Leitplanken
- **KEINE Engine-/Norm-Änderung, KEINE UE-Werte anfassen.** Reine Präsentation der vorhandenen `getEmployeeFileSummary`-Ausgabe (`employee-file-requirements.ts`). **Single Source of Truth:** dieselbe Summary wie `DossierView` benutzen — **nicht** neu/parallel berechnen.
- **EC-09 unberührt:** Generator/ZIP nicht anfassen.
- **EC-10:** kein „erfüllt/auditfähig/freigegeben"; Status bleibt rechnerisch. Eingehende Nachweise `unchecked`.
- **Keine neue CL.** Badges/Werte 1:1 aus der Summary übernehmen.

## 3. Bau (Scope)
- **Neue Komponente** `EmployeeFileOverview.tsx` (read-only) im selben Ordner (`modules/03-mitarbeiterakte-tool-2/employee-file/`).
  - Props: `employee`, `roles`, `appointments`, `companyName` (analog `DossierView`, aber **ohne** `onSave*`/`onEvidence*`/`onToggleEvidenceEdit`).
  - Ruft `getEmployeeFileSummary(...)` exakt wie `DossierView` (Z. 238–243) auf.
  - Rendert **read-only**:
    - Kopf: Name, Org-Titel (`roleType`), Norm-Klassen (`roleClasses` als Labels — `BEWACHUNG_CLASS_OPTIONS`/`NICHT_BEWACHUNG_CLASS_OPTIONS` für Anzeige), Kennzahlen (fehlende Pflichtangaben / offene Nachweise / fachlich prüfen) wie im Dossier-Header.
    - `EmployeeFilePflichtStatusPanel` (Ampel) — **unverändert wiederverwenden** (ist schon read-only).
    - Pflicht-Set: bestehende `RequirementTable`-Darstellung (Label + `ClauseBadge` + Status) — als read-only Liste. (Falls `RequirementTable`/`ClauseBadge` aus `DossierView` nicht exportiert sind: in eine kleine geteilte Datei extrahieren **oder** lokal duplizieren — keine Logikänderung.)
    - Pflichtnachweise: Status-Anzeige read-only (`EmployeeFileEvidenceRow` mit `editMode={false}` ohne Upload-Callbacks, oder schlichte Status-Liste).
    - Schulung/Unterweisung + Geltungsbereich: read-only `RequirementTable`.
    - UE-Soll/Ist: `EmployeeFileTrainingTargets` **read-only** (ohne `onSave` → die Ist-Eingabefelder dürfen nicht editierbar sein; falls die Komponente das nicht kann, eine read-only Darstellung der `targets` zeigen — Soll/Ist/Rest + Status-Pill, **keine** Werte ändern).
    - Fristen + Engine-Hinweise + offene Punkte: read-only.
    - Footer: EC-10-Disclaimer.
- **Umschalter:** an der Stelle, wo `DossierView` gerendert wird (vermutlich `EmployeeAutomationPage.tsx`/`EmployeeFileIndex.tsx`), einen einfachen Toggle „Bearbeiten ↔ Übersicht" ergänzen. Default = bestehende Bearbeiten-Ansicht (kein Verhaltensbruch). Zustand lokal (`useState`), SSR-stabil (kein localStorage im ersten Render — Hydration-Lehre aus `01f720b` beachten).

## 4. DoD (Subagent)
- `tsc --noEmit` = **0**.
- **EC-09-Smoke** (echter Browser :3001): Person → Generator → ZIP `POST /employee-automation` **200 + ZIP-Magic** (Generator unberührt).
- **Browser-Akzeptanz:** Toggle schaltet zwischen Bearbeiten und Übersicht; Übersicht zeigt für eine Bewachungsrolle (EK/FK) Ampel + Pflicht-Set + UE-Übersicht korrekt; **keine** Stifte/Upload/Edit-Felder in der Übersicht; Werte identisch zur Bearbeiten-Ansicht (gleiche Summary).
- **EC-10-Disclaimer** sichtbar. **Engine-Suite weiterhin grün** (keine Engine-Datei geändert — nur Präsentation).
- Falls bestehende Tests laufen: `tsc` + Engine-Suite (`tsx --test …/requirement-engine.test.ts`) grün.
- **Commit** mit engen Pathspecs (nur die berührten Code-Dateien; **kein** `.env`/`.db`/`hq/03_Kundenprojekte/**`), conventional: `feat(uebersicht): read-only Akte-/Vorzeige-Ansicht (Pt 1)`. Danach **HANDOFF-Abschluss-Eintrag** unter „Von Cursor an Claude" + HIER-STARTEN-Status kippen.

## 5. Parken-statt-raten
- `RequirementTable`/`ClauseBadge`-Extraktion unklar → lokal duplizieren (kein Refactor-Risiko), kurz im Abschluss-Eintrag vermerken.
- `EmployeeFileTrainingTargets` nicht read-only schaltbar → read-only Darstellung der `targets` selbst rendern (Soll/Ist/Rest/Status), **keine** Wertänderung.
- EC-09 nicht grün → Change zurücknehmen, parken, nicht committen.
- Scope-/Norm-Zweifel → Frage in HANDOFF, nicht selbst entscheiden.

## ▶ Kickoff-Prompt für den Subagenten
> Du baust die read-only Akte-/Vorzeige-Übersicht nach `hq/10_Bridge/CURSOR_UEBERSICHT_READONLY_AUFTRAG.md`. Lies zuerst `CLAUDE.md` + `hq/10_Bridge/HANDOFF.md` (HIER STARTEN) + diesen Auftrag. Reine Präsentation über `getEmployeeFileSummary` — **keine** Engine-/UE-/Norm-Änderung, **keine** Generator-Berührung (EC-09), EC-10-Disclaimer. Halte §4-DoD (tsc 0 · EC-09-ZIP 200 · Browser-Akzeptanz · keine Engine-Datei geändert), committe autonom mit engen Pathspecs, schreib einen Abschluss-Eintrag ins HANDOFF. Bei Zweifel parken (§5), nicht erfinden. Verifiziere im echten Browser :3001.
