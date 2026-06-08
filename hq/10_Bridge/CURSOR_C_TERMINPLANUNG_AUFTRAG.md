# CURSOR_C_TERMINPLANUNG_AUFTRAG — Termin-Planung Schulungen (lücken-getrieben / „gap-driven")

> **Status:** baufertig (Planer, 2026-06-08). **Bau via Subagent/Bot** im neuen Arbeitsmodus (1 Chat plant/steuert, Bot baut autonom). Rollen-Kontrakt: Bot baut **nur**, was hier steht; bei Norm-/Scope-Zweifel **parken** + Frage in HANDOFF, nichts erfinden.
> **Queue-Punkt:** C aus `CURSOR_NAECHSTE_QUEUE.md`. A (Norm-Cross-Check) ✅ liegt vor (`NORM_CROSSCHECK_SCHULUNGSKATALOG.md`), B (read-only Übersicht) ✅ `ae477e8`. **Geschäftslogik = `CURSOR_SCHULUNGSKATALOG_PLANUNG.md` §9** (Mark-Input). HEAD-Basis = `e1899dd` (EK/FK-Refinement).
> **Kern (§9):** C ist **nicht** „nur Datum setzen", sondern **Soll/Ist/Lücke je Person sichtbar machen + gezielte Modul-/Schulungs-Zuweisung zum Schließen der Lücke**, je mit geplantem Datum (Bulk + Override). Speist die Ampel: geplant = gelb, Nachweis da = grün, überfällig = rot.

---

## 1. Was kann Mark am Ende (Nutzerergebnis)
Je Person, im Akte-/Dossier-Planungsbereich:
1. **Lücke auf einen Blick:** pro laufendem/einmaligem Schulungs-Soll-Posten **Soll − Ist = Rest (Lücke)** — Soll aus der Engine (CL-belegt), Ist = das bereits vorhandene manuelle Feld (`weiterbildungIstUE`/`einmaligIstUE`). Plus **Gesamt-Lücke Jahres-Weiterbildung** (CL-11).
2. **Gezielte Zuweisung (gap-fill):** Mark wählt aus dem **Schulungskatalog (§3, DIN-1-Module 9×4 UE + FK 8 UE)** konkrete Module/Teile, um die Lücke zu schließen — jede Zuweisung ist ein **Plan-Eintrag** mit **geplantem Datum** und optional Gültigkeit.
3. **Termin pro Posten + Bulk:** geplantes Datum **für alle Plan-Einträge der Person auf einmal setzen** (Sammel-Datum) **und einzeln überschreibbar** (Per-Item-Override).
4. **Eigener Nachweis-Slot je Zuweisung:** pro Plan-Eintrag ein eigener Upload-/Nachweis-Slot mit Datum (schließt die §7-Lücke „heute nur Sammel-Slot Schulungsnachweise").
5. **Ampel reagiert:** geplant (Datum in der Zukunft, kein Nachweis) = **gelb**; Nachweis hochgeladen = **grün**; geplantes Datum überschritten ohne Nachweis = **rot/überfällig**. Speist `EmployeeFilePflichtStatusPanel` (Slice-4-Ampel) **operativ**, ohne die Engine zu ändern.
6. **Generator/ZIP unverändert (EC-09).** Read-only Übersicht (`EmployeeFileOverview`, B) zeigt den Plan read-only mit an.

---

## 2. 🔴 Norm-Grundlage & Leitplanken (keine erfundene Pflicht — Quelle: `NORM_CROSSCHECK_SCHULUNGSKATALOG.md`)
**C ist operativ (Datums-/Planungsschicht) und norm-neutral.** Es werden **keine** UE-Werte/Pflichten geändert oder erfunden. Verbindlich:
- **Soll bleibt CL-11 (40 Vollzeit / 24 Teilzeit).** Die **modularen Schulungen (§3, 9×4 UE + FK 8 UE) sind Lehrbausteine, KEIN Norm-Soll** (Cross-Check §2.1). Modul-UE **niemals** automatisch zum Jahres-Soll aufsummieren oder als neue Pflicht setzen.
- **Kein Auto-Ist:** Ein zugewiesenes/abgeschlossenes Modul erhöht **NICHT** automatisch `weiterbildungIstUE`. Ist-UE bleibt **manuell** (das „Ist-UE-Auto-Summe / Nachweis-mit-UE-Datenmodell" ist ein **separater, geparkter** Slice — Queue E). Plan-Status (geplant/Nachweis/überfällig) und Ist-UE sind **entkoppelt**.
- **Lücke = Soll(Engine, CL-11/CL-20..25) − Ist(manuell).** Rein rechnerische Anzeige, kein neuer Normwert.
- **Anrechnung Einmalschulung → Jahres-Soll = CL-27** bleibt ein Engine-Hinweis (nicht in C neu implementieren).
- **Veranstaltung-FK (Katalog 16 vs. Norm 24) & ÖPV (keine CL):** offene Norm-Fragen (Cross-Check §2.3/§2.4) — **blockieren C nicht**, weil C keine UE-Werte anfasst. Module/Kurse dürfen als planbare Termine erscheinen, **ohne** UE-Soll zu verändern. ÖPV-/Veranstaltungs-UE **nicht** anpassen.
- **EC-10 (hart):** alles **rechnerisch/Planungsstand**, **kein** Freigabe-/Auditfähigkeits-/Zertifizierungsstatus. Hochgeladene Nachweise bleiben `unchecked`. Plan-Labels: „geplant" / „Nachweis vorhanden (ungeprüft)" / „überfällig" — **nie** „erfüllt/auditfähig/freigegeben".
- **EC-09:** Generator/ZIP (`/employee-automation`-Action) nicht anfassen.

---

## 3. Datenmodell — `trainingPlan` (Json, SQLite-sicher nach `einmaligIstUE`-Muster)
**Neues Feld** `Employee.trainingPlan?: TrainingPlanItem[]` + Prisma `EmployeeFile.trainingPlan Json?` (**kein `@default`** → SQLite-P2023-sicher; Repository schreibt immer `[]` als Fallback, analog `sdlScopes`/`einmaligIstUE`).

```ts
export interface TrainingPlanItem {
  /** Stabile UID (z. B. crypto.randomUUID() oder `tp-${Date.now()}-${i}`). */
  id: string;
  /** Herkunft: Katalog-Modul (Gap-Filler) oder Referenz auf einen Engine-Soll-Posten. */
  source: "katalog" | "soll-posten";
  /** Katalog-Modul-ID (bei "katalog") bzw. Soll-Posten-ID (bei "soll-posten", z. B. "jahres-weiterbildung", "sdl-asyl-base"). */
  refId: string;
  /** Snapshot-Label für Anzeige (vom Katalog/Posten übernommen). */
  label: string;
  /** Informativer UE-Wert (Katalog-Lehrbaustein oder Soll-Posten) — KEIN Norm-Soll, nur Anzeige. `null` erlaubt. */
  ue: number | null;
  /** Snapshot der CL (CL-11 = Curriculum-Bezug bei Modulen; Soll-Posten-CL bei "soll-posten") — informativ. */
  clauseId: string | null;
  /** Geplantes Datum (ISO YYYY-MM-DD). */
  plannedDate?: string;
  /** Optionale Gültigkeit (ISO) — Zukunfts-Hook (Brandschutz/EH-Muster); in C optional, kein Pflichtfeld. */
  validUntil?: string;
  /** Freitext-Notiz (optional). */
  note?: string;
}
```

### 3.1 Repository (alle Mapping-Stellen + Read-Normalisierung)
- `employee-file-repository.ts`: Helper `asTrainingPlan(value: unknown): TrainingPlanItem[]` (robust gegen Müll: nur valide Items übernehmen, unbekannte Felder verwerfen, `source` auf Enum prüfen). Im Read (`employeeFileToEmployee`) setzen.
- **Schreibe-Mapping in ALLEN Stellen** (wie bei `einmaligIstUE`): `employeeToUpsertData`, `upsertEmployeeFile` (update-Block), `replaceEmployeeFilesForCompany` (update-Block), `migrateFromLocalStoragePayload` (update-Block) → jeweils `trainingPlan: employee.trainingPlan ?? []`.
- Read robust gegen Legacy (`null`/fehlend → `[]`). **Idempotent**: erneuter Read verändert ein vorhandenes Plan-Array nicht.
- **Schema-Migration:** `prisma generate` + `db push` (gegen `prisma/prisma/dev.db` via `DATABASE_URL=file:./prisma/dev.db`); DB selbst **nicht** committen (gitignored). Bestandsakten ohne Feld → `[]` (kein P2023; analog `sdlScopes`/`einmaligIstUE`).

---

## 4. Schulungskatalog (neue Konstante) — `training-catalog.ts`
Neue Datei (z. B. neben `requirement-engine.ts`): exportiert den **DIN-1-Modul-Katalog (§3)** als planbare **Lehrbausteine** — **kein** Norm-Soll (Cross-Check §2.1). Quelle: `CURSOR_SCHULUNGSKATALOG_PLANUNG.md §3`.

```ts
export interface TrainingCatalogModule {
  id: string;          // z. B. "din1-modul-1"
  label: string;       // "Dokumentation/Wachbuch/Meldewesen"
  ue: number;          // informativ (4, FK 8) — KEIN Norm-Soll
  clauseId: "CL-11";   // Curriculum-Bezug (füllt CL-11, ändert es nicht)
  group: "din1-modul"; // Erweiterbar
  hinweis?: string;    // z. B. "Lehrbaustein — kein eigener Norm-UE-Wert"
}
```
- Module 1–8 (je 4 UE) + Modul 9 „Führungskraft Sicherheitsdienst DIN 77200-1" (8 UE) exakt aus §3.
- **Jeder** Eintrag trägt `hinweis: "Lehrbaustein zur Füllung des CL-11-Jahres-Solls — kein eigener Norm-UE-Wert"` (Cross-Check §2.1).
- **Nicht** aufnehmen: ÖPV-Werte (keine CL, §2.4) und Veranstaltungs-FK-16 (Norm-Konflikt, §2.3) — diese sind Soll-/Norm-Fragen, nicht Katalog-Lehrbausteine. DIN-2-Scope-Schulungen werden **nicht** als Katalog-Module dupliziert; sie sind bereits Engine-Soll-Posten und über `source:"soll-posten"` planbar.

---

## 5. Gap-Logik (reine Funktion, testbar) — `training-plan.ts`
Neue reine Datei (React-frei, wie `compliance-status.ts`):
- `computeTrainingGaps(targets: TrainingTarget[], employee: Employee): TrainingGap[]` → je Soll-Posten `{ id, label, clauseId, soll: number|null, ist: number, rest: number|null }`. Ist-Quelle exakt wie `EmployeeFileTrainingTargets` (`jahres-weiterbildung` → `weiterbildungIstUE`, sonst `einmaligIstUE[id]`). `rest = soll===null ? null : max(soll−ist, 0)`.
- `derivePlanItemStatus(item: TrainingPlanItem, hasProof: boolean, referenceDate?: string): PlanItemStatus` mit `PlanItemStatus = "geplant" | "ueberfaellig" | "nachweis-vorhanden" | "ohne-datum"`:
  - `hasProof` → `"nachweis-vorhanden"`.
  - kein `plannedDate` → `"ohne-datum"`.
  - `plannedDate` < heute (bzw. `referenceDate`) → `"ueberfaellig"`.
  - sonst → `"geplant"`.
  - `referenceDate`-Param für deterministische Tests (wie Engine-`referenceDate`).
- Mapping Plan-Status → `WorkingItemStatus` (für die Ampel, §6): `geplant`→`"beantragt"`, `ueberfaellig`→`"abgelaufen"`, `nachweis-vorhanden`→`"vorhanden"`, `ohne-datum`→`"offen"`. (Keine neuen Stati; nutzt bestehende `severityOf`-Buckets: abgelaufen=kritisch, beantragt/offen=offen, vorhanden=erfüllt.)
- **Tests** (`training-plan.test.ts`, `node --test`/`tsx --test`): Gap-Rechnung (Soll−Ist, Rest≥0, `soll===null`→`rest===null`), Status-Ableitung (alle vier Fälle, deterministisch via `referenceDate`), Status→WorkingItemStatus-Mapping.

---

## 6. Plan → Ampel (operativ, Engine unberührt)
- `EmployeeFilePflichtStatusPanel` bekommt eine **optionale** zusätzliche Eingabe für Plan-Fristen (z. B. neuer Prop `terminPlan?: ComplianceDeadline[]` ODER die Plan-Deadlines werden an der **Aufrufstelle** den `fristen` beigemischt). **Empfehlung:** an der Aufrufstelle in `EmployeeFileDossierView` (und `EmployeeFileOverview`) die Plan-Einträge via §5-Mapping zu `RequirementRow`/`ComplianceDeadline` umwandeln und in die vorhandene `fristen`-Liste mergen — dann bleibt `compliance-status.ts` unverändert (nur Daten, keine Logikänderung). Label je Plan-Frist z. B. „Schulung geplant: {label}".
- **Engine (`requirement-engine.ts`) NICHT anfassen.** Plan-Status ist operativ; `computeComplianceStatus` aggregiert weiterhin nur übergebene Stati.
- EC-10: Plan-Beiträge dürfen den Gesamtzustand höchstens auf „in Arbeit"/„offen" heben; „rechnerisch vollständig" bleibt die obere Grenze (kein „freigegeben").

---

## 7. UI — gap-getriebener Planungsbereich (Planer-Defaults, überschreibbar)
**Platzierung (Default):** neue Komponente `EmployeeFileTrainingPlan.tsx`, gerendert im **Dossier (Akte, Edit-Modus)** direkt unter `EmployeeFileTrainingTargets` (dort, wo heute `summary.schulungsSoll` rendert, `EmployeeFileDossierView.tsx` ~Z. 462). Edit nur bei vorhandenem `onSavePerson` (wie TrainingTargets). In `EmployeeFileOverview` (read-only, B) **read-only** mitrendern (kein Add/Edit/Upload).
- **Lücke-Anzeige:** je Soll-Posten `Soll / Ist / Rest (Lücke)` aus §5 `computeTrainingGaps` (Ist read-only hier — die Ist-Eingabe bleibt in `EmployeeFileTrainingTargets`, nicht duplizieren). EC-10-Badge „rechnerisch · kein Freigabestatus".
- **Plan-Liste:** je `TrainingPlanItem`: Label + UE (informativ, mit „Lehrbaustein"-Hinweis bei Modulen) + `plannedDate`-Datepicker + Status-Pill (geplant/überfällig/Nachweis vorhanden/ohne Datum) + **Nachweis-Slot** (Upload, siehe unten) + Entfernen-Button.
- **Hinzufügen (gap-fill):** Auswahl aus `training-catalog.ts` (DIN-1-Module) **und** aus den vorhandenen Engine-Soll-Posten (`summary.schulungsSoll`, als `source:"soll-posten"`) → erzeugt `TrainingPlanItem` mit Snapshot von `label`/`ue`/`clauseId`. Schreibt via `onSavePerson({ ...employee, trainingPlan: [...] })`.
- **Bulk-Datum:** ein „Datum für alle setzen"-Control (ein Datepicker + Button) → setzt `plannedDate` auf **allen** Plan-Einträgen der Person; danach pro Eintrag einzeln überschreibbar.
- **Nachweis-Slot je Eintrag (§7-Lücke schließen):** Upload reuse der **bestehenden Evidence-Infrastruktur** — `evidenceId`-Konvention **`training-plan:{item.id}`** über die vorhandenen `onEvidenceUpload`/`onEvidenceRemove`/`evidenceFiles`-Callbacks des Dossiers (kein neues Storage-Modell, kein Schema-Change an `EvidenceItem`). `hasProof` = `evidenceFiles["training-plan:"+item.id]` vorhanden. Dateien landen automatisch im S3-Pfad `cea/companies/{Firma}/evidence/{Person}/{Slot}/…` (bestehende `buildEvidenceKey`). Status bleibt `unchecked` (EC-10).
- **Persistenz:** `trainingPlan` über `onSavePerson` → debounced Save → Repository (über Reload erhalten). Nachweise über bestehende Evidence-Save-Action.
- **SSR/Hydration:** keine `localStorage`-Lesezugriffe im ersten Render (Lehre `01f720b`).

---

## 8. DoD (Bot)
- `tsc --noEmit` = **0**.
- **Neue Tests grün:** `training-plan.test.ts` (Gap-Rechnung + Status-Ableitung + Mapping). **Bestehende Suiten unverändert grün:** `requirement-engine.test.ts` (27/27, **Engine darf sich nicht ändern**) + `compliance-status.test.ts` (10/10).
- **Persistenz verifiziert (echter Browser :3001):** Plan-Eintrag anlegen (Katalog-Modul + Soll-Posten), Bulk-Datum setzen, Einzel-Override, Nachweis hochladen → **über Reload erhalten**; `trainingPlan` in DB persistiert; Bestandsakten ohne Feld laden fehlerfrei (kein P2023).
- **Ampel reagiert:** geplant (Zukunft) → gelb/in-Arbeit; Datum in Vergangenheit ohne Nachweis → rot/überfällig (nextDeadline zeigt es); Nachweis hochgeladen → Eintrag grün. **Engine-Pflicht-Set/Soll unverändert.**
- **EC-09-Smoke:** Person → Akte → Doc-Chips → ZIP `POST /employee-automation` **200 + ZIP-Magic** (`UEsDBA`/`PK`), kein 5xx.
- **EC-10:** keine „erfüllt/auditfähig/freigegeben"-Aussage; Nachweise `unchecked`; Disclaimer sichtbar.
- **Keine Norm-Datei geändert:** `requirement-engine.ts` + UE-Werte unangetastet; keine neue CL/UE; Module als Lehrbausteine markiert.
- **Read-only (B):** `EmployeeFileOverview` zeigt den Plan read-only (kein Add/Edit/Upload).
- **Commit** mit expliziten Pathspecs (kein `.env`/`.db`/`hq/03_Kundenprojekte/**`), conventional message z. B. `feat(tool2): Queue C — lücken-getriebene Termin-Planung Schulungen (Plan + Nachweis-Slot + Ampel)`. Danach **HANDOFF-Abschluss-Eintrag** + HIER-STARTEN-Status kippen.

---

## 9. Betroffene Dateien (Erwartung)
- **Neu:** `training-catalog.ts`, `training-plan.ts` (+ `training-plan.test.ts`), `EmployeeFileTrainingPlan.tsx`.
- **Geändert:** `types/employee.ts` (`trainingPlan` + `TrainingPlanItem`), `prisma/schema.prisma` (`trainingPlan Json?`), `lib/employee-file-repository.ts` (Read-Normalisierung + 4 Schreibe-Mapping-Stellen), `EmployeeFileDossierView.tsx` (Plan-Komponente einhängen + Plan-Deadlines in `fristen` mergen + `training-plan:`-Evidence-Slots durchreichen), `EmployeeFileOverview.tsx` (read-only Plan + gemergte Plan-Deadlines), ggf. `EmployeeFilePflichtStatusPanel.tsx` (nur falls optionaler Prop statt Merge an Aufrufstelle gewählt wird).
- **NICHT ändern:** `requirement-engine.ts`, `compliance-status.ts` (Logik), `employee-file-requirements.ts` (Engine-/Presenter-Kern), Generator/ZIP-Action.

---

## 10. Parken-statt-raten
- Norm-Zweifel / fehlende CL (z. B. ÖPV, Veranstaltung-FK) → **nicht** anfassen; bleibt offene Frage (Cross-Check §4). C ändert keine UE.
- EC-09 nicht grün → Change zurücknehmen, nicht committen, parken + Frage in HANDOFF.
- UX-Detail unklar (Platzierung Bulk-Control, Datepicker-Variante) → sinnvollen Default (oben) nehmen, im Abschluss-Eintrag vermerken; nicht blockieren.
- Soll Ist-UE doch auto aus Nachweisen summiert werden? → **NEIN** in C (separater geparkter Slice, Queue E) — als Frage notieren, nicht bauen.

---

**Guardrails:** EC-09 (Generator/ZIP nie brechen), EC-10 (kein Freigabe-/Auditstatus, Nachweise `unchecked`), keine erfundene Normpflicht (jede UE/Pflicht CL-belegt; Module = Lehrbausteine ohne Norm-Soll), kein Commit von `.env`/`.db`/`hq/03_Kundenprojekte/**`. Verifikation im echten Browser :3001, nicht per Skript.

## ▶ Kickoff-Prompt für den Bot/Subagenten
> Du baust **Queue C — die lücken-getriebene Termin-Planung** nach `hq/10_Bridge/CURSOR_C_TERMINPLANUNG_AUFTRAG.md`. Lies zuerst `CLAUDE.md` + `hq/10_Bridge/HANDOFF.md` (Box „HIER STARTEN") + diesen Auftrag + `hq/10_Bridge/CURSOR_SCHULUNGSKATALOG_PLANUNG.md` (§3, §7, §9) + `hq/10_Bridge/NORM_CROSSCHECK_SCHULUNGSKATALOG.md` + `knowledge/NORM_MATRIX_Mitarbeiternachweise_v2.md` + `knowledge/NORM_KLAUSEL_REGISTER_v1.md`. App = `cert-expert-certification-os/apps/certification-os/` (Module unter `modules/03-mitarbeiterakte-tool-2/employee-file/`, Repository unter `lib/`), Branch `main`, Dev-Port 3001. Baue exakt §3–§7, halte §8-DoD (tsc 0 / neue + bestehende Test-Suiten grün / EC-09-ZIP 200 / Persistenz + Ampel im echten Browser verifiziert / Engine & UE unverändert), committe autonom mit expliziten Pathspecs, schreib einen Abschluss-Eintrag ins HANDOFF + kippe den HIER-STARTEN-Status. **Harte Grenzen:** keine Norm/UE-Werte erfinden oder ändern (Module = Lehrbausteine, Soll bleibt CL-11; kein Auto-Ist), EC-09/EC-10 wahren, kein `.env`/`.db`/Kundendaten committen. Bei Norm-/Scope-Zweifel: **parken** (§10), nicht raten. Verifiziere im echten Browser :3001.
