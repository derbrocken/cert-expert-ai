# CODE_REVIEW — Claude reviewt Cursor-Code

**Zweck:** Hier protokolliert Claude Reviews von Dashboard- / Certification-OS-Änderungen.

---

## 2026-06-07 — UE-Anzeige Schulungs-Soll (Variante C, `EmployeeFileTrainingTargets.tsx`) — Pre-Commit-Review (Planer 2)

**Methode:** Statisches Review des **uncommitteten** Working Trees (neue Datei `EmployeeFileTrainingTargets.tsx` + Diffs an `EmployeeFileDossierView.tsx`, `types/employee.ts`, `lib/employee-file-repository.ts`, `prisma/schema.prisma`) gegen die Variante-C-Spez (`CURSOR_SLICE2_AUFTRAG.md` §E.1). `tsc --noEmit` = **0 Fehler**, ReadLints der 4 Dateien = **0**. Engine-Logik unverändert (nur Typ-Felder + Anzeige-Komponente ergänzt). **Engine-Test-Suite hier nicht re-run** (kein `tsx` im Planer-Environment) → Executor bestätigt 10/10 + Browser.

### Verdict
**Statisches Review besteht** — Variante C korrekt umgesetzt, EC-10-Wording gewahrt, Persistenz vollständig. **Browser-Abnahme + Commit stehen noch aus** (Executor/Mark-Gate); danach schließe ich das Review final.

### Stark (behalten)
- **Zwei-Block-Karte** laufend/einmalig; **Balken nur** beim laufenden Jahres-UE (`renderRow(t, true)` vs. `false`) — exakt Variante C.
- **Wording-Baustein verbindlich erfüllt:** Soll/Ist/Rest; Status-Union `offen · unvollständig · rechnerisch erreicht · fachlich prüfen`; **kein** „erfüllt/einsatzbereit/auditfähig". Karten-Header trägt dauerhaft „rechnerisch · kein Freigabestatus" (**EC-10**).
- **Ist = „manuell erfasst"** gekennzeichnet (kein Auto-Nachweis-Beleg) — Slice-2-konform.
- **`soll === null` → „fachlich prüfen"** + „Kein belegter UE-Wert" statt erfundener Zahl. Korrekt.
- **Persistenz vollständig:** `weiterbildungIstUE Int?` + `einmaligIstUE Json?` in Schema; Repository mappt beide in `fromRecord` **und allen vier** Upsert-Pfaden (Z. 65–70/95–100/208–213/256–261/586–591); `onSave={onSavePerson}` schreibt zurück.
- **ClausePill** zeigt `CL-xx` bzw. „ohne CL" für `null`.

### Findings (Anzeige, klein — kein Blocker, an Executor)
1. **`t.hint` wird nie gerendert.** `renderRow` zeigt label/CL/trigger/dlCap/Soll/Ist/Rest, aber **nicht** `t.hint`. Dadurch fehlen: der **Anrechnungs-Hinweis CL-27** („Einmalschulung im Erwerbsjahr anrechenbar") **und** der Asyl-FK-Hinweis „Gesamt 64 UE". Die Variante-C-Vorlage zeigt die **Anrechnungs-Zeile CL-27** explizit. → Hint rendern (mind. die Anrechnungs-Fußzeile im Einmalig-Block). *(Executor, klein.)*
2. **Feldname-Abweichung:** Auftrag §E.1 nannte `einmalSchulungIstUE`, Code nutzt durchgängig `einmaligIstUE` (Type/Schema/Repo/Komponente konsistent). **Kein Handlungsbedarf** — nur dokumentiert.
3. **`einmaligIstUE Json?` ohne `@default("{}")`** (Auftrag schlug Default vor). Repo schreibt `?? {}`, `null` wird abgefangen → unkritisch. *(optional.)*

### Pending vor Final-Abnahme
- **Browser-Akzeptanz** (live :3001): Schulungs-Soll-Karte rendert pro Akte, Ist-Eingabe **persistiert über Reload**, Balken nur laufend, EC-09-Smoke (Person → Generator → ZIP) grün.
- **Commit** (alles uncommitted). Danach Final-Eintrag hier.

---

## 2026-06-07 — Slice 2 Requirement-Engine (`requirement-engine.ts`, Commit `22e0c7c`) — Code-Review

**Methode:** Statische Prüfung der committeten Engine gegen `NORM_KLAUSEL_REGISTER_v1.md` (jede `clauseId`) + `NORM_MATRIX_Mitarbeiternachweise_v2.md` (UE-Werte, Ebenen-Trennung). UI-Display + DB-Pfad nicht Teil dieses Reviews (Executor in Arbeit).

### Verdict
**Engine abgenommen (fachlich) — die normative Kern-Lücke aus dem 2026-06-06-Review ist geschlossen.** Bedingung → Pflicht-Set wird jetzt deterministisch abgeleitet, jede aktive Pflicht ist CL-rückführbar. Findings sind Verfeinerungen, kein Blocker.

### Stark (behalten)
- **clauseId-Treue:** CL-01/03/04/05 (§4.1b), CL-06/07 (Profil A), CL-08 (EH 2 J.), CL-09 (Intervention), CL-10 (FK), CL-11 (40/24 WB), CL-20/21 (Veranstaltung 24/16), CL-22 (Objekt +20/J), CL-23 (Brandschutz 3 J.), CL-24/25 (Asyl 40/64), CL-02 (6-Monats-Frist) — **alle korrekt gegen Register + Matrix.**
- **Invariante hält:** ohne belegte CL → `clauseId: null` **und** `status "fachlich prüfen"` (ÖPV, NON-DIN, SiBe, Fahrer/UVV CL-73, Praktikant). Keine erfundene Pflicht.
- **Ebenen sauber getrennt (Matrix §9):** Firmen-Quote (CL-41/42) + Personalschlüssel (CL-26) landen als **Hinweis**, nicht als Einzelakten-Pflicht. Korrekt.
- **EC-10 gewahrt:** nur konservative `WorkingItemStatus`-Union; kein „auditfähig/freigegeben/zertifiziert".
- **Reine Funktion:** kein DB-/React-Import; deterministische Fristen via `referenceDate`. Testbar.

### Findings (Verfeinerung — kein Blocker, an Executor/Mark)
1. **`q-34a` bei reiner Unterrichtung = `vorhanden` (grün).** Matrix §2 sieht hier „gelb + Frist" vor. Die separate `frist-sachkunde` (CL-02) fängt es ab, aber die Zeile allein wirkt zu optimistisch. **Vorschlag:** Status `vorbereitet`/`unvollständig` statt `vorhanden`, solange nur Unterrichtung. *(Executor, klein.)*
2. **Doppelzeilen möglich:** Erste Hilfe (`q-ersthilfe` + `appt-ersthelfer`, beide CL-08) und Brandschutz (`sdl-objekt-brandschutz` + `appt-brandschutz`, beide CL-23) erscheinen bei Bewachung **und** passender Beauftragung doppelt. **Vorschlag:** im Presenter nach `clauseId`+Thema dedupen. *(Executor, klein.)*
3. **Teil-2-Schulung ohne Bewachungs-Guard:** Veranstaltung/Asyl/Objekt-Schulungssoll wird allein aus `sdlScopes` gepusht — eine Verwaltungsrolle mit SDL-Scope bekäme ein UE-Soll ohne Basis-Set. Real unwahrscheinlich; ggf. mit `bewachung` gaten. *(fachlich, optional.)*
4. **Leitungsrollen = Führungskraft (FK):** `Einsatz-/Objekt-/Schichtleitung` lösen die FK-Werte aus (§5.3 24 UE statt §5.4 16 UE). Plausibel, aber **fachlich bestätigen** (ist Schichtleitung normativ FK?). *(Mark/Experten-Review CROSS-CONTROL-05.)*
5. **Asyl-FK-Label:** Basiszeile sagt „EK/SMA: 40 UE", wird aber auch für FK als Basis gepusht (+24). Label kosmetisch anpassen („Basis 40 UE"). *(Executor, kosmetisch.)*

### Nächster Schritt
Findings 1+2 sind die einzigen, die ich vor dem nächsten Commit empfehle (kleiner Presenter-Fix). 3–5 = fachliche Bestätigung durch Mark bzw. kosmetisch. UI-Display-Review folgt, sobald die UE-Anzeige verdrahtet + die Liste wieder lädt.

---

## 2026-06-06 — Mitarbeiterakte (Tool 2) `/employee-automation` — Live-Review

**Methode:** Live im Browser (Dev-Server :3001), Dummy „Max Mustermann" angelegt → Akte-Ansicht + Generator-Hinweis erfasst. Code nicht gelesen (außerhalb `hq/`-Scope) — Review auf UI/Verhaltensebene.

### Verdict
**~80 % nutzbar.** Das Gerüst ist stark und norm-verankert. Es fehlt **eine** Kernkomponente. Nicht wegwerfen — vervollständigen.

### Was stark ist (behalten)
- **Denkmodell „Bedingung → Anforderung → Nachweis"** — sauber, alles an einem Ort.
- **Grundrollen-Taxonomie** (9 Rollen: SMA, Führungskraft, Einsatzleitung, Objektleitung, Schichtleitung, Bürokraft/Verwaltung, Geschäftsführung, Subunternehmer-SMA, Praktikant/Azubi).
- **Pflichtnachweise mit Normbezug:** §34a Unterrichtung, Sachkundeprüfung, Bundesauszug Bewacherregister, Datenschutz, Verschwiegenheit, Dienstausweis, Erste Hilfe, Brandschutzhelfer (Bedingung DIN 77200-2/SDL), Stellenbeschreibung, projektbezogene Nachweise, Schulungs-/Unterweisungsnachweise.
- **Anforderungsebene Schulung & Unterweisung** (allgemeine/objektbezogene/SDL-bezogene/Wiederholungs-Unterweisung).
- **Geltungsbereich/Einsatzkontext** als Auslöser (DIN 77200-1/-2 Relevanz, SDL, Objekt, Qualifikationsniveau).
- **Platzhalter-Bindung** aller Felder ({FullName}, {Birthday}, {RoleType}, {TrainingHours}, {GuardIDNumber}, {EmployeeIDNumber}).
- **Saubere fachliche Trennung:** Bewacher-ID (Stammdaten) ≠ Bundesauszug Bewacherregister (Nachweis).
- **Generator-Disziplin:** „X Dokumente vorgemerkt — keine Freigabe- oder Zertifizierungsaussage" → konform zu DFSS CROSS-CONTROL-05.
- **Status-Taxonomie:** VORHANDEN · FEHLT · OFFEN · NICHT ERFORDERLICH · FACHLICH PRÜFEN · VORBEREITET + konsolidierte „Offene Punkte"-Ansicht.

### Kern-Lücke (Prio 1) — die verlorene DFSS-Vorarbeit
- **Regel-/Entscheidungsmatrix fehlt.** Wörtlich in der UI: *„Scope-abhängig — keine Matrix in diesem Slice."*
- Folge: **Bedingung leitet nicht automatisch Anforderung/Nachweis ab.** Fast alles steht auf „FACHLICH PRÜFEN/OFFEN" → der Mensch entscheidet noch alles manuell.
- Das ist genau die Norm-Logik aus dem Design-/DFSS-Projekt, die am Ende nicht mehr verdrahtet wurde.
- **Vermutete Stelle:** `modules/03-mitarbeiterakte-tool-2/employee-file/employee-file-requirements.ts` (Anforderungslogik).

### Weitere Beobachtungen
- **Tool 1 (`/model-creator`):** „Loading folders…" hängt — Standard-Models laden nicht. Vermutung: Hetzner-S3 / `.env.local` nicht gesetzt. → prüfen.
- **„Standalone":** Tool 1 + Tool 2 sind **Routen in EINER COS-App** (:3001), keine getrennt laufenden Standalones. Legacy (`bots/legacy_tools/…`) = Fallback, läuft aktuell nicht.

### Empfehlungen (DFSS-Controls + Zwei-Motoren-Modell)
1. **Norm-Regel-Matrix als eigenes „controlled design artefact"** (CROSS-CONTROL-07): Grundrolle + Geltungsbereich (DIN 77200-1/-2) + Bestellungen → welche Nachweise/Unterweisungen *erforderlich / nicht erforderlich / fachlich prüfen*. Claude/Experte entwirft die Matrix, **Cursor verdrahtet** sie in `employee-file-requirements.ts`.
2. **Quelle der Matrix:** DFSS Design-Requirements-/Traceability-Matrix + `knowledge/` (DIN 77200). **Keine erfundenen Pflichten** — nur normseitig ableitbare (CLAUDE.md-Regel).
3. **Zwei-Motoren:** Matrix = deterministische Regeln; Qwen/Validator wenden an; Experten-Review bleibt Pflicht bis Tests Verlässlichkeit zeigen (CROSS-CONTROL-05).
4. **Tool 1:** Storage/`.env.local` fixen, damit Standard-Models laden.
5. **Dashboard-Launcher** (Tool 1 / Tool 2 / Upload Manager) → **erledigt** im HQ-Dashboard (Claude, 2026-06-06).

### Befund-Tabelle
| Datum | Bereich | Befund | Empfehlung | Status |
|-------|---------|--------|------------|--------|
| 2026-06-06 | Akte-Logik | Regel-Matrix fehlt („keine Matrix in diesem Slice") | Matrix als controlled design artefact + verdrahten | offen (Prio 1) |
| 2026-06-06 | Tool 1 `/model-creator` | „Loading folders…" hängt | Hetzner-S3 / `.env.local` prüfen | **behoben 2026-06-07** — Zombie Port 3000; Dev-Port 3001 |
| 2026-06-06 | Architektur | Tool 1+2 = Routen einer App, keine Standalones | für Dashboard via Launcher gelöst | erledigt |
| 2026-06-06 | HQ-Dashboard | Generatoren nicht erreichbar | 3 Launcher-Karten eingebaut | erledigt |
| 2026-06-07 | Stabilisierungs-Slice (Commit `b63043e`) | verifiziert: Port 3001, S3-Prefix-Scoping (standard-models/roles/appointments), DocumentForm 15s-Timeout+Fehlertext, EC-09-Disclaimer intakt, Generator parallelisiert; **tsc --noEmit: 0 Fehler** | abgenommen | **OK** |
| 2026-06-07 | Norm-Matrix (Phase 2) | `employee-file-requirements.ts` Z. 244 „keine Matrix in diesem Slice"; **keine erfundenen UE-Pflichten** hartkodiert (CLAUDE.md-konform) | bleibt Prio 1 / Phase 2 | offen (bewusst) |
| 2026-06-07 | Build-Hygiene | **ESLint: 20 Errors / 11 Warnings** repo-weit (u. a. `set-state-in-effect` in neuem Hydration-Code `EmployeeAutomationPage.tsx` Z.75/90/161/196; `no-explicit-any`). `next.config.ts` ohne `eslint.ignoreDuringBuilds` → **Prod-`next build` würde scheitern**; `npm run dev` unberührt | vor 4-Slice-Umbau: Lint-Errors fixen **oder** `ignoreDuringBuilds` setzen (Cursor) | offen → an Cursor |

---

## 2026-06-07 — Verifikation Stabilisierungs-Slice `b63043e` (Code-Track)

**Methode:** Statisches Review der Commit-Diffs + `tsc --noEmit` + `eslint` im Repo (Sandbox; kein Live-Server, da Sandbox ≠ Marks Rechner). Branch `b3-tool2-migration`.

**Ergebnis:** Cursors HANDOFF-Meldung deckt sich mit dem Code — Slice ist **committed** (nicht mehr „uncommitted", HANDOFF veraltet). Tool 1+2 für Daily Use (`npm run dev` :3001) abgenommen.

- ✅ `package.json`: `dev`/`start` fest auf **3001**.
- ✅ S3-Listing per Prefix (`listTemplateFiles(category)`) in `standard-models/route.ts`, `send-model-entries.ts`, `generate-employee-docs.ts` (letzteres parallel via `Promise.all`).
- ✅ `DocumentForm`: AbortController-Timeout 15s + sichtbarer Fehlertext statt Endlos-„Loading folders…".
- ✅ EC-09 / Disclaimer „…vorgemerkt — keine Freigabe oder Zertifizierungsaussage" vorhanden.
- ✅ `tsc --noEmit` → 0 Fehler.
- ⚠️ **ESLint 20 Errors / 11 Warnings** — Build-Risiko (siehe Befund-Tabelle), an Cursor übergeben.
- ℹ️ Norm-Matrix erwartungsgemäß noch nicht verdrahtet (Phase 2), keine erfundenen Normpflichten.

**Nicht getestet:** Live-ZIP-Export im Browser (lt. Cursor 2026-06-07 manuell verifiziert); Hetzner-S3-Roundtrip (Creds liegen in `.env.local`, Sandbox-Netz nicht genutzt).

---

## 2026-06-07 — Review Slice 0b: Persistente Akte (SQLite/Prisma + S3) — **ABGENOMMEN**

**Methode:** Statisches Code-Review (`schema.prisma`, `employee-file-repository.ts`, `employee-file-actions.ts`, `cea-blob-storage.ts`, `employee-queue-storage.ts`-Adapter, `api-auth.ts`, Routes) + `tsc --noEmit` + git-Check. Branch `main` (Code **uncommitted** im Working Tree).

**Verdikt: passt — Fundament solide, keine Blocker.**
- ✅ **Datenmodell** (Company → CompanyExportSettings → EmployeeFile → EvidenceItem + MigrationRecord) wie 0a freigegeben; IDs werden beibehalten.
- ✅ **EC-09 unangetastet:** `generate-employee-docs.ts` seit Merge nicht geändert (git verifiziert); `employeeFileToEmployee()` rekonstruiert den `Employee`-Typ **1:1** → Generator bekommt identische Objekte.
- ✅ **Migration** idempotent (`MigrationRecord.sourceKey`), Company-Match per Name → Fallback `_legacy_import`; Evidence Base64→S3; localStorage erst nach Erfolg umbenannt (nicht gelöscht).
- ✅ **Logo→S3** (`logoStorageKey`); `getExportSettings` rehydriert zu dataUrl → `GlobalProperties.companyLogo` für Generator erhalten.
- ✅ **Auth** `requireInternalApiKey` timing-safe; `.gitignore` schließt `.env*` + `/prisma/*.db` aus (Secrets/DB nicht im Git).
- ✅ `tsc --noEmit` → **0 Fehler**; Prisma-Client generiert.

**Follow-ups (keine 0b-Blocker):**
1. **Commit** — 0b ist komplett uncommitted. Nach Marks Browser-Smoke committen.
2. **⚠️ Slice-1-Fix `verifyTallySignature`:** nutzt **hex-Digest + Strip `sha256=`**. Tally-Doku-Beispiel nutzt **base64-Digest, Header ohne Prefix** (`createHmac(...).digest('base64')`). → beim Slice-1-Verdrahten Encoding angleichen + raw-body vs. re-stringified testen, sonst werden gültige Webhooks abgelehnt.
3. Migration: Evidence-Einträge ohne `dataUrl` werden still übersprungen (Low-Risk; Legacy speicherte dataUrl).

**Nicht getestet (braucht Marks Rechner):** `npm run db:push` (Tabellen anlegen), Browser-EC-09-Smoke (Person→Generator→ZIP), Kunden-Switcher mit 2 Firmen (getrennte Pools), Migration mit echten Alt-Daten.

---

## 2026-06-07 — Review Slice-1-Nachzug: Beschäftigungsart + Qualifikation + Rolle — **ABGENOMMEN**

**Methode:** Statischer Gegencheck im Repo (schema.prisma, lib/data/tally-employee-slots.json, employee-stammdaten-options.ts) + Cursors Browser-Verifikation (echte Submission rDKJXb2, Wolf Street/blubermann).

**Verdikt: passt, keine Blocker.**
- ✅ `EmployeeFile.employmentType` + `qualification` (String?, optional) im Schema; db:push erfolgt.
- ✅ Mapping über alle 10 Slots: `roleTypeQuestionId`/`employmentTypeQuestionId`/`qualificationQuestionId` getrennt (Bugfix bestätigt — Beschäftigungsart `aBv7BE` ≠ roleType `pLzdKP`). Dropdown-Werte als lesbare Labels.
- ✅ UI-Label „Rolle (Sicherheitsmitarbeiter / Führungskraft)“; volle Taxonomie inkl. Bürokraft/Verwaltung + Geschäftsführung.
- ✅ EC-09 (`generateEmployeeDocs`) unverändert; EC-10 (Nachweise `unchecked`) gewahrt; keine erfundenen UE-Werte.

**Follow-up (KEIN Blocker, → Slice 2):** ZIP-Export braucht `roleId` (Dokumenten-Vorlage); bei reinem Tally-Intake oft leer → Generator läuft für solche Akten erst nach Rollen-/Template-Zuordnung. Das ist genau das „Rolle macht doppelt Dienst“ aus dem Slice-2-Modell (Rolle → Template-Palette **und** Pflicht-Set). In Slice 2 verdrahten.

**Mini-Notiz:** Taxonomie führt „Subunternehmer-SMA“ und „Subunternehmer“ getrennt — bei Slice 2 prüfen, ob beide gewollt (sonst zusammenführen).
