# CURSOR_EKFK_REFINEMENT_AUFTRAG — Norm-Klasse: EK + FK frei kombinierbar (Doppelrolle-Niveau zusammengeführt)

> **Status:** baufertig (Planer, 2026-06-08, auf Mark-Entscheid). **Bau via Hintergrund-Subagent** im neuen Arbeitsmodus (1 Chat plant/steuert, Subagent baut). Rollen-Kontrakt: Subagent baut nur, was hier steht; bei Norm-/Scope-Zweifel parken + Frage in HANDOFF.
> **Auslöser (Mark, Browser-Demo):** „Führungskraft heißt nicht zwingend Bewachung+Führung; FK kann auch operativ (EK) sein. Es müsste eine Doppelauswahl sein — EK **und** FK frei kombinierbar." Mark: „entscheide du als Planer, was sauberer ist." → **Planer-Entscheid: ZUSAMMENFÜHREN.**

---

## 1. Was kann Mark am Ende (Nutzerergebnis)
- In Anlege-Formular **und** Akte: die **Norm-Klasse als Mehrfachauswahl** — eine Person kann gleichzeitig **Einsatzkraft (EK)** und **Führungskraft (FK)** sein; oder Verwaltung; oder **Verwaltung + Bewachung** (der heutige Doppelrolle-Fall).
- Das bisherige separate Feld **„Zusätzliche Bewachung (Doppelrolle, EK/FK-Niveau)"** **entfällt** — es geht in der Mehrfachauswahl auf (EIN klarer Mechanismus statt zwei Wege).
- Pflicht-Set + Ampel + Schulungs-Soll rechnen live aus der kombinierten Auswahl, CL-belegt.
- **Generator/ZIP unverändert (EC-09).**

## 2. 🔴 Norm-Grundlage (keine erfundene Pflicht)
- **EK** = §3.10 Einsatzkraft (Bewachung): §34a-Set Stufe A (CL-01/03/04/05/06/07/08), SDL 16/40 UE (CL-21/24).
- **FK** = §3.11 / §4.19.1 Führungskraft: **baut auf EK-Basis auf** + FK-Quali **CL-10 (nur bei DIN-SDL)**, SDL 24/64 UE (CL-20/25).
- **Pflicht-Set = Vereinigung der gewählten Klassen.** Da **FK ⊇ EK**, ergibt „EK+FK" exakt das FK-Set → **keine neue CL/UE, keine erfundene Pflicht.** Die Auswahl wird nur ehrlicher abgebildet.
- Verwaltung (§4.1 b) = keine Bewachung (nur CL-04/05); Praktikant = reduziert; Subunternehmer (§4.13/CL-42) = Bewachung + „fachlich prüfen".
- **EC-10 hart:** kein Freigabe-/Auditfähigkeitsstatus; eingehende Nachweise `unchecked`.

## 3. Datenmodell — `roleClasses` (Set) ersetzt Einfachauswahl + Doppelrolle-Niveau
- **Neu:** `roleClasses: RoleClass[]` mit `RoleClass = "ek" | "fk" | "verwaltung" | "praktikant" | "subunternehmer"`. `Employee` + Prisma als **`Json?` nach dem `sdlScopes`-Muster** (kein `@default` → SQLite-P2023-sicher; Repository schreibt immer `[]` als Fallback). Repository: **alle Mapping-Stellen** + Read-Normalisierung.
- **`zusatzBewachungNiveau`** (Slice-3-Feld): **nicht mehr schreiben**; Spalte bleibt für Back-Compat-Read/Migration erhalten (nicht droppen).
- **`roleClass`** (G4-Einfachfeld): wird durch `roleClasses` abgelöst; für Migration/Read weiter lesen, nicht mehr als Primärquelle schreiben.

### 3.1 Migration (idempotent, kritisch — DoD)
Beim Read, einmalige Ableitung wenn `roleClasses` leer/fehlt:
- `roleClass="ek"` → `["ek"]`; `"fk"` → `["fk"]`; `"verwaltung"` → `["verwaltung"]`; `"praktikant"` → `["praktikant"]`; `"subunternehmer"` → `["subunternehmer"]`.
- **Plus altes `zusatzBewachungNiveau` einmischen:** `="ek"` → `"ek"` zur Liste; `="fk"` → `"fk"` zur Liste (Dedup). Beispiel: `roleClass="verwaltung"` + `zusatz="ek"` → `["verwaltung","ek"]`; `roleClass="ek"` + `zusatz="fk"` → `["ek","fk"]`.
- Idempotent: erneuter Read verändert ein bereits gefülltes `roleClasses` nicht.

## 4. Engine (`requirement-engine.ts`) — liest das Set
- `hasEK = set.includes("ek")`, `hasFK = set.includes("fk")`. **`bewachung = hasEK || hasFK`**; **`fuehrung = hasFK`**; effektives Niveau = `fk` wenn `hasFK` sonst `ek` (für SDL-UE-Soll). Verwaltung/Praktikant/Sub aus dem Set ableiten.
- Bestehende Slice-3-Niveau-Logik bleibt, **Quelle = Set** statt `zusatzBewachungNiveau`. CL-10 weiter nur bei DIN-SDL. **Keine neue CL/UE.**
- Verwaltungs-/Praktikanten-Reduktion bei zusätzlicher Bewachung (Set enthält ek/fk) unterdrücken — wie heute bei Doppelrolle.
- `buildRequirementContext` (`employee-file-requirements.ts`) reicht `roleClasses` durch; `isSecurityRole` set-aware.

## 5. UI — Mehrfachauswahl (Planer-Defaults, überschreibbar)
- **Bewachung:** zwei Checkboxen **„Einsatzkraft (EK)"** + **„Führungskraft (FK)"** (beide unabhängig wählbar). Hinweistext: „FK baut auf EK auf; EK+FK = FK-Pflichtset."
- **Nicht-Bewachung:** Verwaltung / Praktikant / Subunternehmer wählbar (untereinander exklusiv genügt; kombinierbar mit EK/FK für den „Verwaltung, geht mit auf Schicht"-Fall).
- **Feld „Zusätzliche Bewachung (Doppelrolle)" entfernen** (in die Checkboxen aufgegangen).
- **Org-Titel** bleibt reine Anzeige; Default-Mapping setzt eine sinnvolle Vorauswahl der Norm-Klassen (überschreibbar): SMA→[ek], Einsatzleitung→[fk], Objekt-/Schichtleitung→[ek], GF/Bürokraft→[verwaltung], …
- Stellen: `EmployeeForm.tsx` (schlankes Formular) + `EmployeeFilePersonRolleEditTable.tsx` / `EmployeeFileAkteInlineEdit.tsx` (Akte) + Options in `employee-stammdaten-options.ts` + Zod `validations/employee-form.ts`.

## 6. DoD (Subagent)
- `tsc --noEmit` = 0.
- **Engine-Suite grün + erweitert:** Szenarien ek-only, fk-only, **ek+fk (= FK-Set)**, **verwaltung+ek** (alter Doppelrolle-Fall), verwaltung+fk, verwaltung-only, praktikant, subunternehmer + **Migration-Mapping-Tests** (inkl. `zusatzBewachungNiveau`→Set) + Invariante (keine erfundene Pflicht).
- **EC-09-Smoke** (echter Browser :3001): Person über Formular → ZIP `POST /employee-automation` **200 + ZIP-Magic**.
- **Migration verifiziert:** bestehende Akten behalten korrekte Klassifikation (blubermann→`["verwaltung"]`; eine Doppelrolle-Akte falls vorhanden → korrekt gemerged); Persistenz über Reload.
- **Browser-Akzeptanz:** EK, FK, EK+FK, Verwaltung+EK je ein Durchlauf — Pflicht-Set/Ampel rechnen erwartet + CL-belegt.
- **EC-10** gewahrt; **Org-Titel** weiter reine Anzeige; **Generator unberührt**.
- **Commit** mit expliziten Pathspecs (kein `.env`/`.db`/`hq/03_Kundenprojekte/**`), conventional message `feat(ekfk): Norm-Klasse EK+FK kombinierbar (Doppelrolle-Niveau zusammengeführt)`. Danach HANDOFF-Abschluss-Eintrag + HIER-STARTEN-Status kippen.

## 7. Betroffene Dateien (Erwartung)
`requirement-engine.ts` (+`requirement-engine.test.ts`), `types/employee.ts`, `prisma/schema.prisma`, `lib/employee-file-repository.ts` (Mapping + Migration + Read-Normalisierung), `employee-file-requirements.ts`, `employee-stammdaten-options.ts`, `validations/employee-form.ts`, `EmployeeForm.tsx`, `EmployeeFilePersonRolleEditTable.tsx`, `EmployeeFileAkteInlineEdit.tsx`. (Ampel `EmployeeFilePflichtStatusPanel.tsx` nur, falls Klassen-Label angezeigt wird.)

## 8. Parken-statt-raten
- Norm-Zweifel / fehlende CL → „fachlich prüfen" + Frage in HANDOFF, nicht erfinden.
- EC-09 nicht grün → Change zurücknehmen, nicht committen, parken.
- UX-Detail unklar → sinnvollen Default nehmen (oben), kurz im Abschluss-Eintrag vermerken; nicht blockieren.

---

**Guardrails:** EC-09 (Generator/ZIP nie brechen), EC-10 (kein Freigabe-/Auditstatus), keine erfundene Normpflicht (jede Regel `clauseId`), kein Commit von `.env`/`.db`/Kundendaten. Verifikation im echten Browser, nicht per Skript.

## ▶ Kickoff-Prompt für den Subagenten
> Du baust den EK/FK-Refinement-Slice nach `hq/10_Bridge/CURSOR_EKFK_REFINEMENT_AUFTRAG.md`. Lies zuerst `CLAUDE.md` + `hq/10_Bridge/HANDOFF.md` (HIER STARTEN) + diesen Auftrag + `hq/10_Bridge/CURSOR_AUTONOMOUS_RUN_ORDER.md` (Loop/Gate/harte Grenzen) + `knowledge/NORM_MATRIX_Mitarbeiternachweise_v2.md` + `knowledge/NORM_KLAUSEL_REGISTER_v1.md`. Baue exakt §3–§5, halte §6-DoD (tsc 0 / Engine-Suite grün+erweitert / EC-09-ZIP 200 / Migration verifiziert), committe autonom mit expliziten Pathspecs, schreib einen Abschluss-Eintrag ins HANDOFF. Bei Norm-/Scope-Zweifel: parken (§8), nicht erfinden. Verifiziere im echten Browser :3001.
