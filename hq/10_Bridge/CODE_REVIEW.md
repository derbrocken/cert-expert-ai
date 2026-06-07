# CODE_REVIEW — Claude reviewt Cursor-Code

**Zweck:** Hier protokolliert Claude Reviews von Dashboard- / Certification-OS-Änderungen.

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
