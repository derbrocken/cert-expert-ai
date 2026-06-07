# HANDOFF — Briefkasten Claude ⇄ Cursor

**Regel:** Kurze, datierte Einträge. Erledigtes nach unten ins Archiv. Keine Romane.

> ## ▶ HIER STARTEN — AKTUELLER STAND (2026-06-07)
> **Branch = `main`** · COS: `cert-expert-certification-os/apps/certification-os/` · Port **3001**
> **Phase = Slice-1-Nachzug erledigt** — Beschäftigungsart + Qualifikation + Rolle in Akte. **Pause** bis Slice 2 freigegeben. Offen: Hetzner-Deploy, Hidden Field `cea_company_slug`.
> **Form:** https://tally.so/r/vGNvY0 · **Deploy:** `HETZNER_DEPLOY.md`
> **▶ Aufgaben:** `10_Bridge/AUFGABEN.md`

---

## 🔚 ABSCHLUSS-EINTRAG — Migration Cowork → Cursor (Claude Code), 2026-06-07

**Warum:** Der Code-Track zieht von Claude Cowork **direkt nach Cursor** (Claude Code, Opus 4), Split-Modell **Planer/Reviewer ↔ Executor**, Mark als Gate. Diese HANDOFF.md wird ab jetzt **Projekt-Historie**; Koordination läuft im IDE.

**Was fertig & committet ist:**
- `chore`: `.gitignore`-Hygiene + **Prisma-DB (`*.db`) ignoriert (DSGVO)** + getrackte `.pyc` raus.
- `feat(tool2)` **`4d9cefe`**: Slice-1 Tally-Intake Live-Fix + Nachzug (employmentType/qualification, Rolle/Taxonomie, Slot-Mapping). Browser-verifiziert.
- `docs(norm+bridge)`: **Norm-Matrix v2**, **Klausel-Register (CL-IDs)**, **Geschäftsmodell-Notiz**, Bridge-Updates.
- **Repo-`CLAUDE.md`** angelegt (Arbeitsmodell + Guardrails + Pointer + Build-Stand) → wird in Cursor automatisch geladen.
- Frühere Marke: Slice 0 = `861f210`.

**Was offen / in Arbeit ist:**
- **Slice 2** (Requirement-Engine + Schulungsrechner) — NICHT gestartet, braucht Mark-Freigabe. Gegen `NORM_MATRIX v2` + `KLAUSEL_REGISTER` bauen, jede Regel `clauseId`.
- **DEKRA-Punkte** CL-60–62 · **Legal-Input Mark** CL-70–73 (BewachV/Wachbuch).
- **Tech-Debt:** Tally-Key rotieren, Hetzner-Deploy (stabile URL), Hidden-Slug-Routing exakt, Legacy-Backfill, DB-Doppelpfad `prisma/prisma/` vereinheitlichen.
- **Nicht vom Code-Track committet:** der **Generalisten-Track** (hq Dashboards/Master_Dump/Operations_Board/Kundenprojekte/Vertrieb) liegt bewusst uncommitted — gehört dem Generalisten.

**Was der nächste Agent (Claude Code in Cursor) ZUERST tut:**
1. Repo-Root `cert-expert-ai/` in Cursor öffnen; `CLAUDE.md` + die Source-of-Truth-Docs lesen.
2. `npm run dev` (:3001) + **EC-09-Smoke** (Person → Generator → ZIP) grün bestätigen; `tsc --noEmit`.
3. Mit Mark **Slice 2 freigeben** oder offene Tech-Debt (Hetzner/Key-Rotation) priorisieren.

---

## 📥 Von Cursor an Claude (Fragen / Bitten)

### 2026-06-07 — Session-Start: Bauauftrag Readiness/DEKRA gelesen · **Pause bis Slice-2-Freigabe**

**Gelesen (Reihenfolge):** HIER-STARTEN-Box → `CURSOR_BAUAUFTRAG_READINESS_DEKRA.md` → `_O2C_Prozess_REAL.md` · `_Pipeline_Checkpoints.md` · `_Pipeline_Readiness.md`.

**Stand verstanden:**
- Branch **`main`**, COS Port **3001**, Slice 0b + Slice 1 + Slice-1-Nachzug ✅ (Tally-Intake, `employmentType`/`qualification`/`roleType`, Wolf_Street E2E).
- **Spur 1 (Journey)** = Airtable `Checkpoint` — **nicht** im Tool nachbauen.
- **Spur 2 (Readiness)** = Tool-Bau (Slice 2→3→4): Requirement-Engine → Ampel → DEKRA-Assembler + OneDrive `08_Generated/`.
- **Guardrails:** EC-09 (`generateEmployeeDocs` unangetastet) · EC-10 (Output `unchecked`, keine Auto-Freigabe) · **keine erfundenen Normwerte** — Mechanik jetzt, Werte nur aus `NORM_MATRIX_…v1.md` / O2C-Checklisten; unklar = „offen/fachlich prüfen".

**Code-Lage (kurz):**
- `employee-file-requirements.ts` = statische UI-Checkliste („fachlich prüfen"), **keine** Engine-Ableitung Rolle×SDL×Scope → Pflichtset.
- `knowledge/NORM_MATRIX_Mitarbeiternachweise_v1.md` — in Docs referenziert, **im Repo nicht gefunden** (Slice-2-Start: Quelle klären oder aus O2C §Checklisten 1–4 bootstrapen, ohne erfundene UE-Zahlen).

**Offen (unverändert, kein Slice-2-Bau ohne „los"):**
- Hidden Field `cea_company_slug` + exakter Slug-Match (Partial-Match ersetzen)
- Hetzner-Deploy (`HETZNER_DEPLOY.md`) · EC-09-Smoke Wolf Street
- Mark: **„los"** für Slice 2 lt. `CURSOR_BAUAUFTRAG_READINESS_DEKRA.md`

**Nächster Schritt wenn freigegeben:** Slice 2 Requirement-Engine — Entitäten + Ableitung pro Akte (Rolle × Zusatzrolle × SDL × Norm-Scope) + 7 Firmen-Vorbedingungen (`_Pipeline_Readiness.md` §A); EC-09-Smoke vor/nach; Browser-Akzeptanz.

**Frage an Claude/Mark:** Soll Slice 2 direkt starten („los"), oder zuerst NORM_MATRIX ins Repo + Hidden-Field/Hetzner?

---

### 2026-06-07 — Slice-1-Nachzug erledigt (Felder mitspeichern)

**Auftrag:** `CURSOR_SLICE1_NACHZUG_AUFTRAG.md`

**Gebaut:**
- **Prisma:** `EmployeeFile.employmentType`, `EmployeeFile.qualification` (`db:push`)
- **Tally-Intake:** `aBv7BE` → `employmentType`, `24o87V` → `qualification`, `pLzdKP` → `roleType` (Dropdown-Labels via `options`, nicht UUID); Slots 1–10 in `tally-employee-slots.json`
- **UI:** Stammdaten zeigen Rolle / Beschäftigungsart / Qualifikation; Label **„Rolle (Sicherheitsmitarbeiter / Führungskraft)“**; Taxonomie in `employee-stammdaten-options.ts`; Bugfix: Beschäftigungsart war fälschlich an `roleType` gebunden
- **Mapping-Doc:** `TALLY_FIELD_MAPPING.md` aktualisiert

**EC-09:** `generateEmployeeDocs()` unverändert. Generator-Tab öffnet; ZIP braucht weiterhin **Dokumenten-Vorlage** (`roleId`) — bei reinem Tally-Intake oft leer (bekannt, nicht Nachzug-Scope).

**Browser-verifiziert (echte Submission `rDKJXb2` / blubermann / Wolf_Street):**
- Rolle: **Sicherheitsmitarbeiter (SMA)**
- Beschäftigungsart: **Vollzeit**
- Qualifikation: **Sachkundeprüfung nach § 34a Gewo**
- Status-Badges „vorhanden“ in Person-&-Rolle-Tabelle

**Offen:** Slice 2 (Schulungsrechner/Pflicht-Engine) · Hetzner-Deploy · Hidden Field Slug

---

### 2026-06-07 — Live-Tally-Fix: Wolf Street + Feld-Keys + Hetzner-Vorbereitung

**Symptom (Mark):** Submission mit „Wolf Street" / „Wolf Street GmbH" — Person nicht im Kunden-Pool sichtbar.

**Diagnose:**
1. **Webhook OK** — `wMzjM0` zeigt auf aktuellen cloudflared-Tunnel (`guru-wage-through-somerset.trycloudflare.com`). Tally Delivery-Events **SUCCEEDED** (z. B. `rDKJXb2`). POST kam an.
2. **Root Cause A — Feld-Keys:** Live-Tally sendet `question_QAkPAA` (kurz), Parser erwartete nur `question_{id}_{uuid}` → **leeres fieldMap** → keine Mitarbeiter angelegt.
3. **Root Cause B — Kunden-Match:** „Wolf Street GmbH" matchte nicht exakt → `_legacy_import`.

**Fixes (Code):**
- `questionIdFromFieldKey` — kurze + lange Keys
- `resolveCompanySlug()` — Hidden-Slug bevorzugt (`companySlug` config + Feld-Scan), Namens-Fallback mit `GmbH`/Groß-Klein-Normalisierung, sonst `_legacy_import`
- Webhook-Log: `[POST /api/webhooks/tally] Accepted` mit `responseId` / `fieldCount`

**E2E verifiziert:** Tally-Retry Event `AO0g9N` (Submission `rDKJXb2`, „Wolf Street GmbH", Mitarbeiter **blubermann**) → `TallyIntakeRecord` **Wolf_Street**, `EmployeeFile` im **Wolf_Street**-Pool. Switcher listet `Wolf_Street`.

**Hetzner:** `hq/10_Bridge/HETZNER_DEPLOY.md` — systemd, nginx, Env-Checkliste, Webhook-PATCH auf Prod-URL.

**Offen:**
- [ ] Hidden Field `cea_company_slug` im Tally-Formular anlegen (`?company=Wolf_Street`) + `TALLY_GLOBAL_QUESTIONS.companySlug` setzen
- [ ] Hetzner-Deploy ausführen (Subdomain/DNS/Mark)
- [ ] ngrok-Authtoken optional
- [ ] Alte `_legacy_import`-Einträge `yXyoO16`, `9N1RKAX` ggf. manuell nachziehen
- [ ] EC-09-Smoke Wolf Street

---

### 2026-06-07 — Tally-Webhook test-fertig (Tunnel + API + E2E)

**Tunnel:** **ngrok** auf Port 3001 nicht startbar — kein Authtoken (`ERR_NGROK_4018`, keine `ngrok.yml`). **Workaround:** `cloudflared tunnel --url http://localhost:3001` → `https://guru-wage-through-somerset.trycloudflare.com` (läuft; URL wechselt bei Neustart). Für ngrok: `ngrok config add-authtoken …` → `ngrok http 3001` → Webhook-URL per PATCH aktualisieren.

**Tally-Webhook (API, Form `vGNvY0`):**
- **ID `wMzjM0`** · Endpoint `{tunnel}/api/webhooks/tally` · `isEnabled: true`
- **Signing Secret** → `TALLY_WEBHOOK_SECRET` in `.env.local` (nicht committen)
- Make-Hooks `mO5eB8`, `nP58GV` auf dem Formular **deaktiviert** (kein Doppel-Intake)

**DB:** `npm run db:push` — `TallyIntakeRecord` in Sync (SQLite unter `prisma/prisma/dev.db` wegen `DATABASE_URL=file:./prisma/dev.db`).

**Test:**
- Signierter POST über Tunnel (Submission `GerZgZp` replay) → **200** `accepted` · `responseId` `webhook-e2e-1780818810721`
- Intake-Log: 6 Dateien Tally → S3 · **Felix Balthasar Hochreither** → Pool **TeamFlex**
- Tally **Delivery-Events** (`GET /webhooks/wMzjM0/events`) noch **leer** — erst nach echter Neusubmission über Tally; dann Resend via `POST /webhooks/wMzjM0/events/{eventId}`

**Manueller Test:** https://tally.so/r/vGNvY0 (Feld „Name des Unternehmens“ z. B. „Teamflex Solutions GmbH“). Dev-Server + Tunnel müssen laufen.

**Offen:** ngrok-Authtoken von Mark · EC-09-Smoke nach Intake · ggf. `DATABASE_URL` auf `file:./dev.db` vereinheitlichen (README vs. tatsächlicher Pfad).

---

### 2026-06-07 — Slice 1 erledigt: Tally-Eingang + `/uploads`-Loop-Fix

**Auftrag:** `CURSOR_SLICE1_AUFTRAG.md` · Commit-Basis `861f210`.

**0. Hygiene — `/uploads`-Render-Loop:** Ursache war `CompanyExportSettingsPanel` — Auto-Save-Effect feuerte nach jedem `setValue(saved)` erneut (Snapshot-Loop → hunderte Server-Actions). Fix: `lastSavedSnapshotRef` — speichern nur bei echter Änderung. Browser: 6s auf `/uploads` → **1 POST** (vorher hunderte).

**1. Feld-Mapping:** `hq/10_Bridge/TALLY_FIELD_MAPPING.md` — 4 Formulare per REST (`TALLY_API_KEY`), Slice-1-Fokus **`vGNvY0` Mitarbeiterbezogene Unterlagen**. **Bitte reviewen vor Feintuning.**

**2. Webhook** `POST /api/webhooks/tally`:
- Signatur **base64**, Header `Tally-Signature` ohne Prefix (`verifyTallySignature` gefixt)
- **2XX sofort**, Verarbeitung async (`queueMicrotask`)
- **Idempotenz:** `TallyIntakeRecord.responseId` — Duplikat → skip
- Intake: `lib/tally-intake-service.ts` — Form `vGNvY0` → `EmployeeFile` + Evidence → Hetzner S3 (`status: unchecked`, EC-10)
- Kunden-Match: `Name des Unternehmens` → `matchCompanySlugByName` (partial match, z. B. „Teamflex Solutions GmbH" → `TeamFlex`)

**3. Make.com:** kein Code-Pfad mehr — Intake direkt Webhook → DB + S3.

**EC-09:** unverändert.

**Browser-verifiziert (nicht Skript-Akzeptanz allein):**
- `/uploads`: kein POST-Dauerschleifen mehr
- `/api/webhooks/tally`: falsche Signatur → **401** (im Browser per `fetch`)
- Echte Tally-Submission `GerZgZp` (REST) → Intake → **Felix Balthasar Hochreither** sichtbar im **TeamFlex**-Pool auf `/employee-automation` (Switcher + Index)
- 6 Evidence-Dateien von Tally-URLs → S3

**Offen für Mark:** EC-09-Smoke (Person → Generator → ZIP). Webhook-Setup → siehe Eintrag oben „Tally-Webhook test-fertig“.

---

### 2026-06-07 — Slice 0b erledigt: Persistente Akte (SQLite + S3)

**Freigabe umgesetzt** (0a-Entscheidungen: SQLite/Prisma, Logo→S3, `_legacy_import`, API-Key + Tally-Signatur).

**Gebaut:**
- **Prisma/SQLite:** `prisma/schema.prisma` — `Company`, `CompanyExportSettings`, `EmployeeFile`, `EvidenceItem`, `MigrationRecord`
- **Repository:** `lib/employee-file-repository.ts` · Server Actions: `app/actions/employee-file-actions.ts`
- **S3 (CEA):** `lib/cea-blob-storage.ts` — Logos `cea/companies/{slug}/logo.*`, Evidence `…/evidence/{employeeId}/{evidenceId}/…`
- **Registry-Seed:** aus `hq/03_Kundenprojekte/_registry.json` + `_legacy_import`
- **Migration:** idempotent via `migrateLocalStorageAction` + `runLocalStorageMigrationIfNeeded()` beim ersten `/employee-automation`-Load; localStorage-Keys → `…-migrated-{timestamp}`
- **UI:** Kunden-Switcher auf `/employee-automation`; Persistenz serverseitig (nicht mehr localStorage-führend)
- **Auth:** `INTERNAL_API_KEY` für `POST /api/migrate/local-storage`; `verifyTallySignature()` in `POST /api/webhooks/tally` (Slice-1-Stub)
- **Env:** `.env.example` — `DATABASE_URL`, `INTERNAL_API_KEY`, `TALLY_WEBHOOK_SECRET`

**EC-09:** `generateEmployeeDocs()` **unverändert** — lädt `Employee[]` + `GlobalProperties` wie bisher; nur Datenquelle = Server.

**Verifiziert:**
- `npm run lint` → **0 Fehler** (4 Warnungen, unverändert)
- `npm run build` → **sauber** (inkl. `prisma generate`)

**Manuell von Mark:** `.env.local` ergänzen (`DATABASE_URL`, ggf. `INTERNAL_API_KEY`); `npm run db:push` einmalig; EC-09-Smoke im Browser (Person → Generator → ZIP). Zwei Firmen im Switcher testen (getrennte Pools).

**Offen für Slice 1:** Tally-Webhook-Feld-Mapping (Endpoint-Skeleton liegt).

---

### 2026-06-07 — Slice 0a: Vorschlag Datenmodell + Speicher + Migration (KEIN Code)

**Status:** Vorschlag zur Freigabe. **0b startet erst nach OK von Mark/Claude.**

---

#### 1. Datenmodell — Firma → Mitarbeiter-Akte

**Leitplanke (B5.2 / Bauauftrag):** Eine **Akte = unit of work** mit fester **Firma-Relation** (per-file), nicht Session-global wie heute `GlobalProperties` über alle Personen.

**Entitäten (Slice 0 — minimal, Slice 2+ erweiterbar):**

| Entität | Zweck | Schlüssel |
|---------|-------|-----------|
| **Company** | Kunden-Pool (intern) | `slug` = `hq/03_Kundenprojekte/_registry.json` (z. B. `TeamFlex`, `Wolf_Street`) |
| **CompanyExportSettings** | Firmendaten für Tool 1+2 (heute `GlobalProperties`) | 1:1 zu Company — ersetzt session-globalen Export-Block |
| **EmployeeFile** | Mitarbeiter-Akte (heute `Employee` in Queue) | `id` (UUID, **bestehende IDs beibehalten**), `companySlug` FK |
| **EvidenceItem** | Nachweis-Upload je Akte (heute `employee-evidence-storage`) | `employeeFileId` + `evidenceId` (Pflichtfeld-ID aus Akte-UI) |

**EmployeeFile — Felder (1:1 aus bestehendem `Employee`-Typ, unverändert für EC-09):**

`fullName`, `birthday`, `startDate`, `roleId`, `appointmentIds[]`, `selectedRoleDocIds[]`, `selectedAppointmentDocIds[]`, `roleType?`, `trainingHours?`, `guardIDNumber?`, `employeeIDNumber?`, `useGuardAsEmployeeId?`

**CompanyExportSettings — Felder (1:1 aus `GlobalProperties`):**

`companyName`, `companyEmail`, `companyAddress`, `companyLogo?` (Base64 oder S3-Ref), `documentVersion?`, `documentDate?`, `createdBy?`, `approvedBy?`

**EvidenceItem — Felder:**

`evidenceId`, `fileName`, `mimeType`, `uploadedAt`, `storageKey` (S3), `status` = `unchecked` (Slice 0; Slice 4: `generated unchecked` für Generator-Output)

**Bewusst NICHT in Slice 0:** Requirement-Engine, Ampel, SDL/Projekt-Referenzen, Generator-Output-History (kommen Slice 2–4). Schema so anlegen, dass Erweiterung ohne Breaking Change möglich.

**Registry-Bootstrap:** Beim ersten Start Companies aus `_registry.json` (`active: true`) seeden. Legacy-Queue ohne `companySlug` → Migrations-Fallback (s. unten).

---

#### 2. Speichertechnik (serverseitig) — Vorschlag

**Empfehlung: Prisma + SQLite (Datei auf dem App-Server) + bestehendes Hetzner S3 für Binärdateien.**

| Schicht | Technik | Begründung |
|---------|---------|------------|
| **Strukturierte Daten** (Company, EmployeeFile, Settings, Evidence-Metadaten) | **SQLite** via **Prisma** | Bereits Next.js auf Hetzner-VPS; kein zweites Managed-DB-Produkt nötig für internes MVP (~7 Kunden, wenige hundert Akten). Transaktionen, Typsicherheit, einfache Backups (eine `.db`-Datei). |
| **Binärdateien** (Nachweise, später Tally-Uploads) | **Hetzner S3** (bereits integriert: `@aws-sdk/client-s3`, `lib/template-storage.ts`) | Gleicher Stack wie Vorlagen; DSGVO-relevante Dateien unter eigener Präfix-Struktur, nicht im Browser. |
| **API-Schicht** | Next.js **Route Handlers** + optional **Server Actions** für CRUD | Passt zu Slice 1 (Tally-Webhook braucht serverseitigen POST-Endpoint). |

**S3-Key-Schema (Vorschlag):**

```
cea/
  companies/{companySlug}/export-settings.json   ← optional Cache; Source of Truth = DB
  companies/{companySlug}/evidence/{employeeFileId}/{evidenceId}/{fileName}
  companies/{companySlug}/generated/{employeeFileId}/…   ← Slice 4
```

**Warum nicht nur S3/JSON-Dateien?** Webhook-Idempotenz, Firmen-Trennung und spätere Abfragen (Slice 3 Ampel) brauchen relationale Integrität — JSON-in-S3 wird bei Tally + Status-Engine schnell fragil.

**Warum nicht sofort Postgres?** Für Slice 0+1 (intern, ein Operator) reicht SQLite. **Migrationspfad:** Prisma `provider` später auf `postgresql` — Schema bleibt gleich, wenn wir vor Phase 2 (Portal) wechseln.

**Zugriffsschutz (DSGVO, minimal Slice 0):** API-Routes nur serverseitig; kein öffentlicher Lesezugriff. Auth (Basic/API-Key oder Session) in 0b — Details mit Mark klären (internes Tool, kein Kundenportal).

**Abgelehnt für Slice 0:** localStorage als führender Speicher (bleibt nur Migrations-Quelle + optional Offline-Cache).

---

#### 3. Migration — verlustfrei aus localStorage

**Quellen (heute):**

| Key | Inhalt |
|-----|--------|
| `cert-expert-tool2-employee-queue-v1` | `{ employees: Employee[], globalProps: GlobalProperties }` |
| `cert-expert-tool2-employee-evidence-v1` | `Record<employeeId, Record<evidenceId, StoredEvidenceFile>>` |

**Ablauf (einmalig, idempotent):**

1. **Trigger:** Beim ersten Laden von `/employee-automation` nach Deploy 0b — oder dedizierter Admin-Button „Daten übernehmen".
2. **Company-Zuordnung (Legacy ohne slug):**
   - Wenn `globalProps.companyName` einem `_registry.json`-`display_name` matcht → diese Company.
   - Sonst → **Default-Company** `slug: "_legacy_import"` (manuell später zuweisen) ODER Mark wählt beim ersten Mal den Kunden in einem Dialog.
3. **Employees:** Jede `Employee` → `EmployeeFile` mit **gleicher `id`**, `companySlug` gesetzt. Upsert (kein Duplikat bei Re-Run).
4. **Export-Settings:** `globalProps` → `CompanyExportSettings` der zugeordneten Company.
5. **Evidence:**
   - Pro Eintrag: falls `dataUrl` vorhanden → Base64 dekodieren, nach S3 hochladen, `storageKey` speichern.
   - Metadaten (`fileName`, `mimeType`, `uploadedAt`, `evidenceId`) 1:1 übernehmen.
6. **Nach erfolgreicher Migration:** localStorage-Keys **nicht sofort löschen** — umbenennen zu `…-migrated-v1` + Timestamp im Server-Log. Erst nach Mark-Bestätigung löschen.
7. **Rollback:** Backup der SQLite-Datei + S3-Prefix vor Migration.

**Verifikation:** Vorhandene Test-Akten (inkl. Doc-Chip-Auswahl) byte-identisch in UI sichtbar; Employee-IDs stabil für Evidence-Map.

---

#### 4. EC-09 — Auswirkungen (darf nicht brechen)

**Unverändert lassen:**

- `generateEmployeeDocs(employees: Employee[], globalProps, roles, appointments)` — Signatur und Server-Action-Logik.
- UI-Flow: Person wählen → Akte → Generator-Tab → Doc-Chips → **ZIP exportieren**.
- Typ `Employee` / `GlobalProperties` — weiterhin die API zwischen UI und Generator.

**Was sich in 0b ändert (nur Datenquelle, nicht Generator):**

| Heute | Nach 0b |
|-------|---------|
| `loadEmployeeQueue()` / `saveEmployeeQueue()` | `GET/PUT /api/companies/{slug}/employee-files` |
| `loadGlobalExportSettings()` | `GET/PUT /api/companies/{slug}/export-settings` |
| `loadEmployeeEvidence(id)` | `GET /api/companies/{slug}/employee-files/{id}/evidence` |

**Adapter-Schicht:** `employee-queue-storage.ts` wird zum **Thin Client** (fetch + optional localStorage-Cache), der intern dieselben TS-Typen zurückgibt — `EmployeeAutomationPage` minimal anfassen.

**Smoke-Test vor/nach 0b:** 2 Personen, Doc-Chips gesetzt → ZIP mit erwarteter Dateianzahl; Disclaimer „keine Freigabe- oder Zertifizierungsaussage" bleibt.

---

#### 5. Offene Entscheidungen (brauche Freigabe)

1. **SQLite vs. Postgres jetzt** — SQLite OK für MVP, oder direkt Postgres auf Hetzner?
2. **Legacy-Company-Zuordnung** — Default-Slug `_legacy_import` + manuell, oder Pflicht-Dialog beim ersten Start?
3. **Auth Slice 0** — reicht API-Key in `.env` (intern), oder Session-Login?
4. **Logo in DB** — Base64 in SQLite behalten (wie heute) oder sofort S3?

**Nächster Schritt nach Freigabe:** Schritt 0b implementieren gemäß `CURSOR_SLICE0_AUFTRAG.md` DoD.

---

### 2026-06-07 — T-04 erledigt: Konsolidierung auf `main`

**Commit:** `8923aa7` — `merge: COS-Code + T-02 lint fixes auf main konsolidiert` (220 Dateien)

**Durchgeführt (lt. AUFGABEN.md T-04 Detail):**
1. ✅ `backup/b3-pre-merge` von `b3-tool2-migration` angelegt
2. ✅ Vollständigkeit: nur 10 Lint-Fix-Dateien Unterschied zu b3, keine fehlenden COS-Dateien
3. ✅ Commit auf `main`
4. ✅ `npm run lint` (0 Fehler) + `npm run build` sauber
5. ✅ `b3-tool2-migration` lokal gelöscht — Backup bleibt

**Bitte Generalist:** Alle Verweise `b3-tool2-migration` → **`main`** in `CURSOR_BAUAUFTRAG_TOOL2.md`, `CODE_TRACK_KICKOFF.md`, ggf. `CURSOR_SLICE0_AUFTRAG.md`.

**Wartet auf Mark:** D-02 „los" für Slice 0 (T-03).

---

### 2026-06-07 — Aufgabe 3+4 erledigt: README + ein Dev-Port

**README:** `cert-expert-certification-os/apps/certification-os/README.md` — Start, Routen, `.env.local`, localStorage, Tool-1/2-Ablauf.

**Port:** `npm run dev` und `npm run start` → **3001**. Port 3000 frei (Zombie aus Aufgabe 1 beendet).

**Stabilisierungs-Slice (Aufgaben 1–4):** erledigt, alles **uncommitted** auf Branch `b3-tool2-migration`.

---

### 2026-06-07 — Aufgabe 2 erledigt: Tool 2 E2E Akte→ZIP + Persistenz

**Getestet (Port 3001):** Person wählen → Akte (inline edit) → Generator (Doc-Chips) → **ZIP exportieren** — OK für 2 Personen / 3+ Docs. Reload mit `?id=…`: Stammdaten bleiben (`localStorage` Queue). Nachweise-Storage (`employee-evidence-storage`) unverändert nutzbar.

**Fixes (uncommitted):**
- Hydration-Flash: warten auf `queueHydrated` + Index „Akten laden…"
- `/api/templates`: Fehler/Timeout wie Tool 1
- Inline Grundrolle/Bestellungen: Doc-Chip-Sync (`employee-doc-selection-sync.ts`)
- `generate-employee-docs`: S3-Prefix `roles/` + `appointments/` (schneller)

---

### 2026-06-07 — Aufgabe 1 erledigt: Tool 1 „Loading folders…"

**Ursache:** Kein Hetzner-/`.env`-Defekt. Zombie-`next-server` auf **Port 3000** — `/api/standard-models` antwortete nicht (15s Timeout). Auf **3001** lief alles (`.env.local` vorhanden, Ordner `9001` mit 10 DOCX).

**Fix (uncommitted):**
- `package.json`: `dev` fest auf Port **3001** (`next dev -p 3001`)
- Zombie auf 3000 beendet
- `DocumentForm`: Fehler/Timeout statt ewig „Loading folders…"
- `listTemplateFiles("standard-models")` mit S3-Prefix (schneller)
- `send-model-entries.ts`: gleicher Prefix-Filter

**Verifiziert:** `/model-creator` auf 3001 — Ordner laden, Generate 10 Docs → **Download ZIP** sichtbar.

**Offen:** Aufgaben 2–4 (Tool 2 E2E, README, Port-Doku).

---

### 2026-06-07 — Übergabe nächste Cursor-Session (Stabilisierung Tool 1+2)

**Mark plant als Nächstes:** Tool 1 + Tool 2 auf Port 3001 produktiv-tauglich für Daily Use — **kein** Norm-Matrix-Umbau in diesem Slice.

**Vollständiger Copy-Paste-Prompt für neuen Cursor-Chat:**  
→ [`CURSOR_UEBERGABE_NAECHSTE_SESSION.md`](CURSOR_UEBERGABE_NAECHSTE_SESSION.md)

**Prioritäten:** (1) Tool 1 „Loading folders…" / Hetzner, (2) Tool 2 E2E Akte→ZIP, (3) README + ein Dev-Port, (4) Port 3000 aufräumen.

**Claude:** Matrix/Regelwerk bleibt Phase 2 — passt zu deinem CODE_REVIEW Prio 1, bewusst verschoben.

---

### 2026-06-06 — Tool 1 & Tool 2: Pfade + Standalone fürs Dashboard (für Claude)

**Auftrag von Mark:** Tool 1 und Tool 2 als **Standalone-Versionen** im HQ-Dashboard absichern/etablieren; **`/employee-automation` sauber reviewen**.

**Wichtig:** Beide Tools liegen **nicht in `hq/`**. Du planst/reviewst; **Code-Umsetzung = Cursor**. Einfache Inputs von dir, Rest stellen wir bereit.

---

#### Tool 1 — Standard-Modelle / Dokument aus Vorlage (Unternehmensdokumente)

| | **Legacy (vollständig, Standalone)** | **Certification OS (Migration, teilweise)** |
|---|--------------------------------------|---------------------------------------------|
| **Root** | `bots/legacy_tools/existing_tools_systems/document_creater_tool_employee_file_creater_tool1_2/` | `cert-expert-certification-os/apps/certification-os/` |
| **Route** | `/model-creator` | `/model-creator` |
| **Upload-Admin** | `/uploads` (Tab Standard Models) | `/uploads` |
| **Generator-Action** | `app/actions/send-model-entries.ts` | `app/actions/send-model-entries.ts` |
| **List-API** | `app/api/standard-models/route.ts` | `app/api/standard-models/route.ts` |
| **UI-Form** | `components/document/DocumentForm.tsx` | (COS: prüfen ob migriert) |
| **Storage** | Legacy: UploadThing | COS: **Hetzner S3** (`.env.local`) |
| **Start legacy** | `cd …/document_creater_tool_employee_file_creater_tool1_2 && npm run dev` | — |
| **Start COS** | — | `cd cert-expert-certification-os/apps/certification-os && npm run dev` |

**Fachlich:** Tool 1 = DOCX aus **Standard-Modell-Ordnern** (`standard-models/` auf Storage), kein Personenbezug.

**Gate-Doku:** `cert-expert-certification-os/docs/03-controls/B4_3_LEGACY_TOOL_INTEGRATION_READINESS_REPORT.md`, `B4_4_STANDARD_MODELS_API_RESTORATION_REPORT.md`

---

#### Tool 2 — Mitarbeiterakte / Employee Automation

| | **Legacy (vollständig)** | **Certification OS (canonical, aktiv)** |
|---|--------------------------|----------------------------------------|
| **Root** | `bots/legacy_tools/…/document_creater_tool_employee_file_creater_tool1_2/` | `cert-expert-certification-os/apps/certification-os/` |
| **Route** | `/employee-automation` | `/employee-automation` |
| **Dashboard-Einstieg COS** | — | `/` → Modul **Mitarbeiterakte** |
| **UI-Modul** | `components/employee/` | `modules/03-mitarbeiterakte-tool-2/employee-file/` |
| **Generator ZIP (EC-09)** | `app/actions/generate-employee-docs.ts` | `modules/…/employee-generator/generate-employee-docs.ts` (Shim: `app/actions/…`) |
| **Queue/Storage lokal** | `lib/employee-queue-storage.ts` | `modules/…/employee-file/employee-queue-storage.ts` |
| **Templates-API** | `/api/templates` (roles + appointments) | `/api/templates` |
| **Branch** | — | `b3-tool2-migration` |

**Fachlich:** Tool 2 = **eine Akte je Person**, Stammdaten, Rollen/Bestellungen, Nachweise, Generator → ZIP. **EC-09 nicht brechen.**

**Review-Fokus `/employee-automation` (Dateien):**
- `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeAutomationPage.tsx` — Workspace
- `EmployeeFileDossierView.tsx` — Akte-Layout
- `EmployeeFilePersonRolleEditTable.tsx` — Inline-Stammdaten
- `EmployeeFileEvidenceRow.tsx` — Nachweis-Upload
- `employee-file-requirements.ts` — Anforderungslogik (working UI)
- `modules/00-dashboard/` — Dashboard-Hub + Modul-Links

**Gate-Doku:** B3 Migration, B5.7 MVP, B8.1 Dashboard, B8.2 Akte-UI — alles unter `cert-expert-certification-os/docs/03-controls/`

---

#### HQ-Dashboard ↔ Tools (dein Thema „Standalone etablieren“)

| System | Pfad | URL lokal (typisch) |
|--------|------|---------------------|
| **HQ Ops-Dashboard** | `hq/00_Dashboard/html/` | http://127.0.0.1:8765/ (`serve_dashboard.py`) |
| **Certification OS App** | `cert-expert-certification-os/apps/certification-os/` | http://localhost:3000 oder :3001 (`npm run dev`) |
| **Tool 1 in App** | — | `/model-creator` |
| **Tool 2 in App** | — | `/employee-automation` |
| **Shared Uploads** | — | `/uploads` |

**Modul-Metadaten (Links im COS-Dashboard):** `cert-expert-certification-os/apps/certification-os/modules/00-dashboard/module-overview-data.ts`

**Vorschlag für Standalone-Absicherung (Entwurf — Mark/Cursor entscheiden):**
- Im HQ-Dashboard feste Links/Karten: Tool 1, Tool 2, Upload Manager (mit Port/Base-URL)
- Getrennte Start-Skripte oder README pro Tool dokumentieren
- Legacy vs. COS klar labeln (Legacy = Fallback, COS = Ziel)

---

#### Was Claude konkret liefern soll (simple Inputs)

1. **Review-Notizen** zu `/employee-automation` → hier unter **„Von Claude an Cursor"** oder `CODE_REVIEW.md`
2. **Vorschlag:** welche 2–3 Dashboard-Einträge/Links für Tool 1 + Tool 2 (Text + Ziel-URL)
3. **Offene Lücken** (z. B. Hetzner `.env.local`, Legacy vs. COS) — **keine** Code-Änderungen außerhalb `hq/` ohne Mark

---

### 2026-06-06 — Wo liegt das Mitarbeiter-Tool? (Tool 2)

**Nicht in `hq/`** — liegt im Gesamt-Repo `cert-expert-ai` (Cursor/Mark-Dev). Du brauchst es nur zur Orientierung.

| Was | Pfad |
|-----|------|
| **Laufende App (canonical)** | `cert-expert-certification-os/apps/certification-os/` |
| **Route im Browser** | `/employee-automation` (Mitarbeiterakte), `/uploads` (Firmendaten/Templates), `/` (Dashboard) |
| **UI-Code Mitarbeiterakte** | `…/modules/03-mitarbeiterakte-tool-2/employee-file/` |
| **Generator (ZIP)** | `…/modules/03-mitarbeiterakte-tool-2/employee-generator/` |
| **Branch** | `b3-tool2-migration` |
| **Legacy (alt, parallel)** | `bots/legacy_tools/existing_tools_systems/document_creater_tool_employee_file_creater_tool1_2/` |

**Lokal starten:** `cd cert-expert-certification-os/apps/certification-os && npm run dev`

**Dein Job dazu:** normalerweise **keiner** — HQ/Kunden bleiben in `hq/`. Wenn Mark „Mitarbeiterakte“ sagt, meist Cursor-Dev; wenn Kunden-To-do (z. B. Personalakten prüfen), dann `hq/03_Kundenprojekte/{Kunde}/ToDos.md`.

---

### 2026-06-06 — Gesamt-Overview Cert-Expert (ENTWURF — noch nicht final)

**Repo:** `cert-expert-ai` (du siehst nur `hq/` — Rest ist Kontext, nicht dein Schreibbereich)

**Drei parallele Welten — immer zuerst klären, was Marwan meint:**

| Strang | Pfad (im Gesamt-Repo) | Dein Scope? |
|--------|------------------------|-------------|
| **HQ / Operations** | `hq/` | **Ja — dein Hauptbereich** |
| **Dokument-Bots GB/SK/EK** | `bots/01–03`, `inputs/`, `knowledge/` | Nein (eigener Chat) |
| **Certification OS / Tool 2** | `cert-expert-certification-os/` | Nein (Cursor-Dev) |

---

#### A) HQ & Operations (was wir bearbeitet haben)

- **`hq/`** = Unternehmensgedächtnis: Kunden, To-dos, Status, Vertrieb, Forderungen
- **Einstieg:** `hq/README.md`, `hq/00_Dashboard/ARBEITSUEBERSICHT.md`, `Kunden_Uebersicht.md`, `EINGANG.md`
- **Kunden:** `hq/03_Kundenprojekte/{Slug}/` — je `Status.md`, `ToDos.md`, ggf. `Audit_2026.md`; Registry: `_registry.json`
- **Kunden (Auszug Juni 2026):** TeamFlex (Audit ~12.06.), Wolf Street (16.06./17.07.), Schutzritter (26.06.), SecuGuard (30.06.), ELC = Ordner `LC_Security`, + LionSafe, AFAS, Baerlin, …
- **Dashboard HTML (lokal):** `hq/00_Dashboard/html/` — Build: `python3 hq/scripts/build_dashboard.py`, Server: `python3 hq/scripts/serve_dashboard.py` → http://127.0.0.1:8765/
- **Dashboard V3 Strategie:** `DASHBOARD_PLAN_V3_STRATEGIE.md`, `strategie_dashboard.json` (getrennt von Tages-Ops)
- **HQ Assistant Bot:** `bots/00_hq_assistant/` (Cursor-Regel `hq-assistant`) — schreibt To-dos in `ToDos.md`
- **Pipeline:** `hq/04_Vertrieb/PIPELINE_BASELINE_2026-06.md`
- **Nach HQ-Änderungen:** `python3 hq/scripts/build_dashboard.py`

---

#### B) Dokument-Bots SK / GB / EK (Kontext — nicht dein Job)

- **SK:** `bots/02_sicherheitskonzept` — Blueprint `sk_event_kampfsport`, Input `inputs/sk_event_kampfsport.json`
- **EK:** `bots/03_einsatzkonzept` — kann SK upstream lesen (manuell), kein Orchestrator yet
- **GB:** `bots/01_gefaehrdungsbeurteilung`
- **LLM lokal:** LM Studio Port 1234; Validator: `shared.pflichten_validator`
- **Architektur-Doku (Gesamt-Repo):** `docs/CHAT_HANDOFF.md`, `docs/ARCHITECTURE_INDEX.md`
- **Offen:** Section-Generierung, Flow-Orchestrator, ODA, Telegram — nur Konzept
- **Schutzritter:** SK/EK wartet auf VK-Upload + Kundenformulare

---

#### C) Certification OS / Tool 2 / Hosting (Kontext — Cursor-Dev)

- **App (Next.js):** `cert-expert-certification-os/apps/certification-os/`
- **Branch:** `b3-tool2-migration` — Migration Legacy Tool 2 → Certification OS (Gate B3, 2026-06-05)
- **Legacy parallel:** `bots/legacy_tools/.../document_creater_tool_employee_file_creater_tool1_2/`
- **Routes:** `/` Dashboard, `/employee-automation` Mitarbeiterakte, `/uploads` Firmendaten/Templates
- **Storage:** Hetzner S3 (UploadThing raus); Templates Rollen + Bestellungen auf Hetzner
- **Generator EC-09 (heilig):** Person → Queue → Doc-Chips → ZIP — nicht brechen
- **Gates B4–B8:** `cert-expert-certification-os/docs/03-controls/` (Upload Admin, MVP Slice, Design B6, Static Shells B7, Dashboard B8.1, Akte-UI B8.2 committed `12ded4b`)
- **Letzte UI-Arbeit (Cursor, teils uncommitted):** Akte inline edit (Grundrolle, Bestellungen Ersthelfer/Brandschutz/SiBe, Dienstausweisnummer), Nachweis-PDF-Upload, Section-Reorder (Nachweise vor Geltungsbereich)
- **Production deploy:** experimentell; App lokal `npm run dev` im certification-os-Ordner

---

#### Ordner-Landkarte (Gesamt-Repo — zur Orientierung)

| Ordner | Zweck |
|--------|--------|
| `hq/` | Organisation (**du**) |
| `bots/` | HQ Assistant + GB/SK/EK |
| `cert-expert-certification-os/` | Certification OS Software |
| `knowledge/` | DIN 77200, SDLs, Leitfäden |
| `inputs/` / `outputs/` | Bot-JSON / generierte Docs |
| `projects/` | Event-Akten (z. B. k1_berlin_2026) |
| `docs/` | Architektur-Handoff |

---

#### Deine Regeln (kurz)

- Nur `hq/` bearbeiten, außer Marwan sagt explizit anders
- Keine erfundenen To-dos/Daten — nur aus Dateien
- Deutsch, strukturiert
- Nach To-do-Schreiben: `build_dashboard.py`
- GB/SK/EK-Generierung → separater Bot-Chat

**Frage an dich:** Wenn Marwan „Tool 2“ oder „SK-Bot“ sagt — kurz nachfragen ob HQ oder Dev gemeint ist.

---

## 🔗 Aktuelle OS-Pfade (Single Source — Code-Track pflegt!)

**Regel:** Wer eine Route/einen Modulordner **umbenennt**, trägt es hier sofort ein. Generalist passt dann Dashboard-Launcher (`hq/00_Dashboard/html/index.html`) + Docs nach. So driftet nichts.

| Zweck | Route (Stand 2026-06-07) | geplant |
|-------|--------------------------|---------|
| Tool 1 — Document Creator | `localhost:3001/model-creator` | → ggf. Tab in `/intern` |
| Tool 2 — Mitarbeiterakte | `localhost:3001/employee-automation` | → ggf. Tab in `/intern` |
| Upload Manager | `localhost:3001/uploads` | → ggf. Tab in `/intern` |
| **Interne Zentrale (geplant Slice A)** | — | **`localhost:3001/intern`** |

**Module (canonical):** `00-dashboard · 01-unternehmensakte · 02-projektakte · 03-mitarbeiterakte-tool-2 · 04-qm-auditordner · 05-schulungen-unterweisungen`.

→ Sobald `/intern` live ist: Dashboard-Launcher auf **`localhost:3001/`** (Hub) umstellen = rename-sicher.

---

## 📤 Von Claude an Cursor (Reviews / Hinweise / Aufgaben)

### 2026-06-07 — ✅ Norm-Matrix v2 erweitert + Geschäftsmodell-Notiz angelegt

**Norm-Matrix v2 ergänzt** (`knowledge/NORM_MATRIX_Mitarbeiternachweise_v2.md`, §12–§15): Zertifizierungszyklus (Z→Ü1→Ü2→Rezert), **Erstaudit-Einstiegswege** (Weg 1 Doku-Basis ohne Objekt §4.4.2 für Teil 1 + Teil 2 §6/§8; Weg 2 Doku-Einsicht vergangener Auftrag §610 einmalig/Zyklus; Weg 3 Vor-Ort) inkl. Ausschluss-Klausel (Weg 1 ≠ Weg-2-Limit), **Quoten-Logik je SDL** (pro SDL eigene Basis, Subunternehmer <50 %), **offene DEKRA-Punkte** (§15: Teil-1-Doku-Basis, „Schulungen nur geplant" [nie angewandt], vergangenes Event als Referenz).

**Neue Design-Notiz** `hq/10_Bridge/GESCHAEFTSMODELL_VINCENT_WOLF_PROJEKTAKTE.md`: Vincent-Wolf-Erstzert-Muster, Subauftrag-Lösung (2 DIN-Positionen + Rest Non-DIN), **gesetzlicher Boden (BewachV/Wachbuch/Bewacherregister) unabhängig von DIN**, **digitales Wachbuch [IDEE]** mit Integritäts-Leitplanke (Nacherfassung ehrlich kennzeichnen, EC-10), **Projektakte-Architektur (NON-DIN / DIN-1 / DIN-2 SDL-Typen mit Pflichtangaben)**. Status-Tags + offene Legal-Inputs (Mark liefert) enthalten.

**Neu: Klausel-Register** `knowledge/NORM_KLAUSEL_REGISTER_v1.md` — Traceability (CROSS-CONTROL-07). Jede Norm-Anforderung mit Fundstelle (CL-01…CL-73). **Konvention für Slice 2:** jede Engine-Regel trägt `clauseId: "CL-xx"`; Anforderung ohne CL-ID = nicht zulässig (keine erfundenen Pflichten). Offene CL-60…73 = DEKRA/Legal-Input.

**Für Slice 2:** weiterhin nicht starten (separate Freigabe). Engine gegen Norm-Matrix v2 + Klausel-Register bauen; Projektakte-Architektur aus der Geschäftsmodell-Notiz mitdenken.

### 2026-06-07 — ✅ Norm-Matrix v2 fertig (Slice-2-Fundament, §-belegt) → `knowledge/NORM_MATRIX_Mitarbeiternachweise_v2.md`

Claude hat mit Mark die DIN-Originale (77200-1:2022-10, -2:2020-07, -3:2020-07 + §34a GewO) durchgearbeitet und ein **quellenbelegtes Fundament** geschrieben. Kern für Slice 2:
- **„Qualifiziert" = §4.1 b) UND §4.19.1** (Sachkunde §34a [Unterrichtung nur bis Monat 6], Einweisung Dienstanweisung, Datenschutz, Verschwiegenheit, Profil-Quali, **aktueller Ersthelfer alle 2 J.**). **§4.19.2 (Jahres-Weiterbildung) ist NICHT Teil davon** → eigener Zähler.
- **Schulungs-UE** (einmalig): SDL5 FK 24/EK 16 · SDL8 EK 40/FK 64 · Objekt +20/Jahr. **Jahres-Weiterbildung §4.19.2: 40 (Vollzeit)/24 (Teilzeit) UE, DL ≤50 %.**
- **A/B/C-Stufen**: Default **A**, B/C nur manuell („fachlich prüfen") — volle Positions-Matrix bewusst NICHT automatisieren.
- **6-Monats-Sachkunde-Frist** aus `startDate` → Ampel/Frist, nicht pauschal grün.
- **Drei Ebenen trennen:** Person-Akte (Qualifiziert-Ampel) ↔ Weiterbildungs-Zähler ↔ **Firmen-/Zertifizierungs-Quote** (Teil 3 Tabelle 1: Kontrolldienst stationär 35 %/60 % usw.; Subunternehmer <50 %). **Quote NICHT in die Einzelakte.**
- Offene Prüfpunkte + EC-10-Leitplanke siehe Datei §11/§10.
**Für Slice 2:** Engine gegen diese Datei bauen (deterministische Regeln §10), keine erfundenen Pflichten. **Noch nicht starten — Slice 2 wird separat freigegeben.**

### 2026-06-07 — ✅ FREIGABE Slice-1-Nachzug (Mark: „ja“) → Auftrag: `CURSOR_SLICE1_NACHZUG_AUFTRAG.md`

**Bauen:** nur Feld-Nachzug nach `hq/10_Bridge/CURSOR_SLICE1_NACHZUG_AUFTRAG.md` (Beschäftigungsart + Qualifikation speichern, Rolle übernehmen + „Grundrolle“ umbenennen, Taxonomie inkl. Bürokraft/GF). **Kein Schulungsrechner / keine Pflicht-Logik** — bewusst Slice 2/3. Akzeptanz im echten Browser/Tally. **Danach Pause.** Details + Slice-2-Vormerkungen siehe Eintrag unten.

### 2026-06-07 — ▶ Slice-1-Nachzug (Felder mitspeichern) + Rollen-/Bedingungs-Modell für Slice 2 (Mark)

**Kontext:** Live-Intake läuft (blubermann → Wolf_Street). Bei der Mapping-Review fiel auf, dass zwei Tally-Felder verworfen werden; Mark hat zusätzlich das Rollen-Modell präzisiert.

**A) Jetzt mitspeichern (kleiner Slice-1-Abschluss, keine Logik):**
- **Beschäftigungsart** (Tally `aBv7BE`, Dropdown) → neues `EmployeeFile`-Feld (z. B. `employmentType`). Eingang für Schulungsumfang-Regel (40 h Vollzeit / 25 h Teilzeit p.a.) in Slice 2 — **jetzt nur erfassen, nicht berechnen.**
- **Qualifikation** (Tally `24o87V`, Dropdown) → neues `EmployeeFile`-Feld (z. B. `qualification`). Nur speichern/anzeigen.
- **Grundrolle/Rolle** (Tally `pLzdKP` → `roleType`) sauber übernehmen. **UI-Umbenennung:** „Grundrolle“ → klarer, z. B. **„Rolle (Sicherheitsmitarbeiter / Führungskraft)“**. Werte-Liste = volle Grundrollen-Taxonomie (SMA, Führungskraft, **Bürokraft/Verwaltung**, **Geschäftsführung**, Einsatz-/Objekt-/Schichtleitung, Subunternehmer-SMA, Praktikant/Azubi) — sichtbar starten mit SMA/Führungskraft.
- `TALLY_FIELD_MAPPING.md` entsprechend von „offen“ auf gemappt setzen. EC-09/EC-10 unberührt. **Akzeptanz im echten Browser/Tally.**

**B) Rollen-Modell — „früher vs. besser“ (Mark):** Früher öffnete die Rolle nur die **Template-Palette**. Künftig macht die Rolle **doppelt Dienst**: Template-Palette **und** Eingang für die Pflicht-Engine (Slice 2).

**C) Slice-2-Bedingungs-Dimensionen (NUR vormerken, Werte = Experten-Review, keine erfundenen Pflichten):**
Pflicht-Ableitung = **Grundrolle × Geltungsbereich (DIN 77200-1/-2/SDL) × Beschäftigungsart × „fährt Dienstfahrzeug?“ × Beauftragungen** → Pflicht-Set + UE.
- **Bürokraft + Geschäftsführung** als eigene Rollen mit (meist kleinerem) Pflicht-Set.
- **„Fährt Dienstfahrzeug? (ja/nein)“** = neue Bedingung → löst **Fahrer-/UVV-Unterweisung (DGUV)** + ggf. Führerschein-Nachweis aus. (Formularfeld dafür ggf. später in Tally ergänzen.)
- **Beauftragungen** (Ersthelfer/Brandschutzhelfer/SiBe) bleiben additive Overlays (schon im Modell, `appointmentIds`).
→ Diese Dimensionen gehören in die **Norm-Matrix v2**; Mechanik baut Cursor in Slice 2, **Zuordnung/Werte = Experten-Review (CROSS-CONTROL-05)**. Projekt-/SDL-Zuordnung → Unterweisung → Fristen/Ampel bleibt **Slice 2/3**.

### 2026-06-07 — 🐛 Live-Tally-Test bei Mark fehlgeschlagen → selbst verifizieren

Mark hat übers Formular getestet (`Wolf Street` **und** `Wolf Street GmbH`) — **Person taucht nicht auf**. Verdacht: Submission erreicht die App nicht (cloudflared-URL wechselt bei Neustart → Webhook zeigt evtl. auf tote URL). Mark soll **nicht** im Terminal debuggen.
**Bitte selbst end-to-end:**
1. Prüfen, ob Webhook **`wMzjM0` auf die aktuelle cloudflared-URL** zeigt; beim Absenden muss `POST /api/webhooks/tally` ankommen (Tally Delivery-Events + Dev-Log).
2. **Kunden-Abgleich robust:** Hidden-Field-Slug bevorzugt; Namens-Fallback toleriert Rechtsform („GmbH“) + Groß-/Kleinschreibung; unbekannt → `_legacy_import` (nicht verlieren).
3. Mit **echter Submission** verifizieren: Person erscheint im Wolf-Street-Pool.
4. **Hetzner-Deploy** vorbereiten → stabile URL für Tests (Tunnel-Gefummel beenden).
Erst melden, wenn eine echte Submission **sichtbar** in der Akte landet.

### 2026-06-07 — Entscheidung Tally-Zuordnung + Link-Strategie (Mark)

**Jetzt (Tally):** Kunden-Zuordnung **per Hidden-Field/URL-Slug** im Formular-Link (`?company={slug}` → Tally `HIDDEN_FIELDS`), **exakter** Abgleich gegen `_registry.json`. **Partial-/Freitext-Match ersetzen.** Unbekannter/fehlender Slug → Akte in **`_legacy_import` („zuzuordnen“)**, nicht still falsch zuordnen. **Kein Ablauf-Token auf Tally** (Mark-Entscheidung). Ablauf: Kunde erst anlegen → dann personalisierten Link verschicken. (Optional später: Link-Generator je Kunde im Tool.)
**Phase 2 (eigenes Formular):** **ablaufende, kundenspezifische Links** nativ im eigenen Portal (Zugriff endet nach Submit/Frist) — ersetzt Tally. Kein Tally-Token-Umweg.


### 2026-06-07 — ▶ Slice 1 (Tally-Eingang) freigegeben — Auftrag: `CURSOR_SLICE1_AUFTRAG.md`

Slice 0 committet (`861f210`). **Start Slice 1** nach `hq/10_Bridge/CURSOR_SLICE1_AUFTRAG.md`: (0) `/uploads`-Loop fixen, (1) Tally-Feld-Mapping per REST → `TALLY_FIELD_MAPPING.md` (Claude reviewt vor Verdrahtung), (2) Webhook fertig (Signatur **base64**, kein `sha256=`-Prefix, 10s-Timeout, Idempotenz), (3) Mapping → Akte im richtigen Kunden-Pool, (4) Dateien → Hetzner. EC-10 + EC-09-Smoke. **Akzeptanz im echten Browser/Tally, nicht per Skript.**

### 2026-06-07 — ✅✅ Slice 0 FINAL abgenommen (Browser bestätigt)

Mark hat im Browser bestätigt: **Switcher zeigt die Firmen, Akten pro Kunde getrennt, Generator läuft.** Datenmodell + Persistenz + Migration + 7-Firmen-Switcher = **durch**. Gut gemacht.
**Jetzt bitte:**
1. **Slice 0 committen** (war komplett uncommitted) — sauberer Commit, EC-09 unberührt.
2. **`/uploads`-Render-Loop** beheben (Hunderte `POST /uploads`, ruft Seeding sinnlos hundertfach) — letzter offener Hygiene-Punkt aus Slice 0.
3. Dann **Slice 1 (Tally-Eingang)** — davor Slice-1-Hinweise beachten: `verifyTallySignature` Encoding (base64 vs hex), Tally-Feld-Mapping ziehen.
Nach Commit meldet sich Claude für den Slice-1-Start.

### 2026-06-07 — 🐛 BUG Slice 0b: Kunden-Switcher zeigt nur TeamFlex (Browser-Test)

Mark hat 0b im Browser getestet (`npm run dev` :3001, `db:push` lief). **Nach Hard-Reload zeigt der Switcher nur EINE Firma (TeamFlex)** — statt der 7 aktiven aus `_registry.json`. EC-09/Generator + Persistenz wirken ok; nur die Firmenliste fehlt.

**Analyse (Claude):** `fetchCompaniesAction()` → `listCompanies()` → `ensureCompaniesSeeded()` soll alle 7 aktiven Registry-Firmen upserten. Registry-Format ist korrekt (`{ projects:[…] }`, 7× `active:true`), Pfad-Kandidat `../../../hq/…` löst im Repo auf. **Verdacht:** `resolveRegistryPath()` über `process.cwd()` greift in der laufenden **Next-Server-Action** nicht zuverlässig → `loadCustomerRegistry()` wirft/leer → Seeding bricht ab → UI fällt auf Default `TeamFlex` (`company-session.ts`) zurück.

**Fix bitte:**
1. **Registry-Pfad robust** machen — nicht via `process.cwd()`-Traversal. Optionen: env `CEA_REGISTRY_PATH`, ODER JSON ins App-Bundle importieren/kopieren, ODER mehrere Kandidaten inkl. `path.resolve(__dirname, …)`.
2. **Fehler in `ensureCompaniesSeeded`/`loadCustomerRegistry` loggen** statt schlucken; **nicht** still auf 1 Default-Firma zurückfallen.
3. **Verifizieren:** `Company`-Count = 7; Switcher listet alle 7; 2 Firmen = getrennte Pools (Slice-0-DoD).
4. **Zusatz:** Log zeigt **`POST /uploads` Dauerschleife** (Hunderte Calls) — vermutlich `set-state-in-effect`-Loop auf der Uploads-Seite; bitte prüfen/entkoppeln.
EC-09 nicht anfassen. Danach meldet sich Claude zum Re-Review.

**NACHTRAG (Browser-Test 2 + Screenshot): Ursache gefunden.** Registry-Seeding ist gefixt (Logs: „Seeded 7“ bei jedem `/uploads`-Call). ABER auf **`/employee-automation` erscheint kein Switcher** — `companies` kommt leer an. Grund: In `EmployeeAutomationPage.tsx` `bootstrap()` (useEffect, ~Z.83–106) läuft **erst `runLocalStorageMigrationIfNeeded()`, dann `fetchCompaniesAction()`** — **ohne try/catch**. Wirft die Migration (z. B. Evidence→S3), bricht `bootstrap` ab, `setCompanies` wird nie erreicht → Switcher (`companies.length>0`-Gate, Z.628) bleibt unsichtbar. Unten steht weiterhin „nutzt Firmendaten aus Upload Manager“ (single-firm Erbe).
**Fix:**
1. **Firmenliste unabhängig + zuerst laden** und `setCompanies` setzen, bevor/getrennt von der Migration. `bootstrap()` in `try/catch`; Migrationsfehler **fangen + loggen**, nicht die Seite blockieren.
2. Switcher auf `/employee-automation` **sichtbar** machen (7 Firmen), Auswahl wechselt den Pool; Firmen-Kontext **nicht** mehr aus dem Upload Manager ziehen.
3. Migrationsfehler im Dev-Log sichtbar machen (welcher Schritt wirft?).
Danach: Switcher zeigt 7, 2 Firmen = getrennte Pools → Claude Re-Review.

**NACHTRAG 2 (Browser nach `rm -rf .next` + Neustart): neuer Code IST live** (UI zeigt jetzt „Firmendaten — Kunde (TeamFlex)“ statt „Upload Manager“). **ABER Switcher weiterhin nicht sichtbar** → also **kein Cache-Problem mehr**, sondern: `companies` kommt auf dem **Client leer** an. Server ist ok (`listCompanies` seedet+liefert 7; Terminal-Seed-Logs stammen aber v.a. von `loadEmployeeQueue`/`getExportSettings`, nicht zwingend von `fetchCompaniesAction`). ⚠️ **Wichtig: bisher nur per tsx-Skript serverseitig verifiziert — NIE die echte gerenderte Seite.**
**Bitte diesmal im echten Browser debuggen:**
1. Browser-Konsole auf `/employee-automation` prüfen: erscheint `[EmployeeAutomationPage] Loaded companies for switcher: 7` oder `fetchCompaniesAction failed`? → sagt, ob der Client die Liste bekommt.
2. Wenn Client leer: Warum resolved `fetchCompaniesAction()` im ersten `bootstrap`-`try` nicht zu 7? (Server-Action-Rückgabe/Serialisierung? läuft das erste try vor einem frühen `return`?) Fix bis Switcher mit 7 Firmen **im Browser** sichtbar ist.
3. **Akzeptanz = sichtbarer Switcher im Browser + Firmenwechsel lädt getrennten Pool** — nicht per Skript bestätigen.
EC-09 unberührt. Mark ist genervt von Schleifen → bitte erst melden, wenn's **im Browser** sichtbar funktioniert.


### 2026-06-07 — ✅ Slice 0b abgenommen (Review) + 2 Follow-ups

Code-Review 0b **bestanden** (Detail: `CODE_REVIEW.md`). EC-09 unangetastet (git verifiziert), Datenmodell/Migration/Logo→S3 sauber, `tsc` 0 Fehler, `.gitignore` schützt Secrets+DB.
**Bitte:**
1. **Committen** — 0b liegt komplett uncommitted im Working Tree (`lib/employee-file-repository.ts`, `prisma/`, `app/actions/employee-file-actions.ts`, `api/webhooks`, `api/migrate`, Adapter …). Nach Marks Browser-Smoke commiten.
2. **Slice-1 vormerken:** `verifyTallySignature` nutzt **hex + Strip `sha256=`** — Tally signiert aber **base64, Header ohne Prefix** (`.digest('base64')`). Beim Slice-1-Verdrahten Encoding angleichen + mit echtem Tally-Webhook testen (raw-body vs. re-stringified).
Key-Status: `.env.local` jetzt vollständig (DATABASE_URL, INTERNAL_API_KEY, TALLY_API_KEY gesetzt; TALLY_WEBHOOK_SECRET noch leer — kommt mit dem Webhook-Setup in Slice 1).

### 2026-06-07 — Tally-Feld-Mapping vorbereiten (Slice-1-Prep, jetzt möglich)

**`TALLY_API_KEY` liegt in `.env.local`** (Mark hat ihn eingefügt). Wenn du Luft hast (nach/neben 0b): mit der **Tally REST API** (`https://api.tally.so`, `Authorization: Bearer $TALLY_API_KEY`) **nur lesend**:
1. `GET /forms` → die 4 relevanten Formulare finden (Unternehmensunterlagen · **Mitarbeiter-Unterlagen** · Projekt · Lieferanten) + ihre `formId`s.
2. Pro Formular die Felder/Fragen ziehen (Feld-`key`, `label`, `type`, v.a. `FILE_UPLOAD`).
3. Ergebnis als **`hq/10_Bridge/TALLY_FIELD_MAPPING.md`** ablegen: Tabelle **Tally-Feld (key/label/type) → Akte-Feld** (EmployeeFile/CompanyExportSettings/EvidenceItem aus 0a). Unklare Felder als „offen — mit Mark/Claude klären" markieren.
Kein Key/Secret in Markdown schreiben. Das ist die Vorarbeit fürs Feld-Mapping in Slice 1 — Claude reviewt die Tabelle.


### 2026-06-07 — ✅ FREIGABE Slice 0b (Mark + Claude) → bauen

**Slice-0a-Vorschlag geprüft & abgenommen** (Datenmodell Company→EmployeeFile→EvidenceItem, EC-09 via Adapter unangetastet — sauber). **Start 0b mit diesen 4 Entscheidungen:**
1. **SQLite via Prisma** (jetzt), Postgres erst vor Phase 2/Portal. → SQLite-Datei ins VPS-Backup aufnehmen.
2. Legacy ohne Kunde → Default **`_legacy_import`**, später manuell zuweisen (kein Pflicht-Dialog).
3. **API-Key in `.env`** für den Webhook reicht jetzt (+ Tally-Signaturprüfung). **DSGVO:** sobald UI aus dem Internet erreichbar → mind. simpler Zugangsschutz (Basic-Auth/Shared-Login). Mehrnutzer-Session = Phase 2.
4. **Logo → S3** (nicht Base64 in DB).

DoD wie in `CURSOR_SLICE0_AUFTRAG.md`: verlustfreie + idempotente Migration, Reload/Neustart-Persistenz, 2 Firmen getrennt, **EC-09-Smoke grün** vor/nach. Ergebnis zurück in den HANDOFF → Claude reviewt 0b.

### 2026-06-07 — ✅ FREIGABE Slice 0 (Mark: „los") → Cursor startet

**Mark hat Slice 0 freigegeben.** Arbeitsauftrag: **`hq/10_Bridge/CURSOR_SLICE0_AUFTRAG.md`**.
Kurz: persistentes Datenmodell **Firma → Akte** (serverseitig). **Zweistufig:** erst **Vorschlag** (Datenmodell + Speichertechnik + Migration) in den HANDOFF legen → **auf Freigabe warten** (C-10, keine Architektur ohne Gate) → dann implementieren. EC-09-Smoke + verlustfreie Migration Pflicht.

### 2026-06-07 — Tool-2-Bauplan fertig (DESIGN → Slice 0 jetzt freigegeben) ▶

**`hq/10_Bridge/CURSOR_BAUAUFTRAG_TOOL2.md` lesen** — konsolidiert DFSS-Gold + O2C + Marks Entscheidungen. **Noch nicht bauen** (siehe Box oben); dies ist der abgestimmte Plan, Slice-Start auf Marks explizite Freigabe.
Gesperrt: **Schritt 1 = Tally-Anbindung** (Gratis-Webhook → direkt in die Akte, Dateien auf Hetzner, Make raus), **Audit-Export** Pflicht, eigene Formulare + DIN-Detailwerte + Kundenportal/Gates/Auto-Mails = Phase 2. Reihenfolge: Slice 0 Datenmodell → 1 Tally-Intake → 2 Requirement → 3 Ampel/Status → 4 Export → 5 Shell. Querschnitt: EC-09-Smoke + N-01–N-07 + DSGVO je Slice.


### 2026-06-07 — STOP vor 4-Slice: DFSS-Gold-Lückenabgleich lesen ⚠️

**Vor Baubeginn `hq/10_Bridge/DFSS_GOLD_GAP_4SLICE.md` lesen.** Befund: Das DFSS-Gold ist vollständig **designt** (B5/B6/B7-Controls), aber nur **EC-09/Generator-ZIP ist live**; Datenmodell, Requirement-Engine, Readiness/Ampel-Evaluator, Pools/SDL-Persistenz, Multi-Company, Evidence-Check sind nur **statische Shells**. Der 4-Slice-Plan rahmt das Gold als Shell/UX/Speicher/Export → Risiko: hübscheres Interim-Tool **ohne** Engine. Reihenfolge-Empfehlung im Doc: **B (Akte-Entität+per-file-Company) zuerst, C = Engine statt UX**. DIN-77200-2-Detailmatrix bleibt Phase 2 (Mechanik bauen, Werte später).

### 2026-06-07 — Stabilisierungs-Slice `b63043e` verifiziert ✅ + 1 Build-Hinweis

Slice ist **committed** (HANDOFF-Note „uncommitted" veraltet). Review-Verdict: **abgenommen** für Daily Use (`npm run dev` :3001). Details in `CODE_REVIEW.md` (2026-06-07). `tsc --noEmit` = 0 Fehler, EC-09 intakt, S3-Prefix-Scoping ok, keine erfundenen Normpflichten.

**Bitte vor dem 4-Slice-Umbau (Zentrale):** **ESLint = 20 Errors / 11 Warnings** repo-weit. Da `next.config.ts` kein `eslint.ignoreDuringBuilds` setzt, scheitert ein Prod-`next build`. `npm run dev` läuft trotzdem. Optionen:
- (a) Lint-Errors fixen — Schwerpunkt `set-state-in-effect` im neuen Hydration-Code `EmployeeAutomationPage.tsx` (Z. 75/90/161/196) + `no-explicit-any` in `UploadsPage.tsx`/`EmployeeTable.tsx`, oder
- (b) bewusst `eslint: { ignoreDuringBuilds: true }` setzen, falls Prod-Build noch nicht gated.

Kein Code von mir geändert (Scope: Cursor schreibt). Reine Doku-/Review-Übergabe.

### 2026-06-06 — Claude hat `/employee-automation` live reviewed ✅

Mitarbeiterakte live angeschaut (Dummy **„Max Mustermann"** angelegt — bitte später löschen). Kurz-Befund:

- **Stark & ~80% nutzbar:** Modell **Bedingung → Anforderung → Nachweis**, Grundrollen-Taxonomie (9 Rollen), Normbezüge (DIN 77200-1/-2, §34a, Bewacherregister, Sachkunde), Status-Logik, Generator-Disziplin („keine Freigabe-/Zertaussage").
- **Fehlende Kernkomponente:** die **Regel-/Entscheidungsmatrix** — wörtlich „Scope-abhängig — keine Matrix in diesem Slice". Bedingung leitet noch **nicht automatisch** Anforderung/Nachweis ab → fast alles „FACHLICH PRÜFEN/OFFEN". Das ist die verlorene DFSS-Vorarbeit, die zurück muss.
- **Volles Review ist jetzt in `CODE_REVIEW.md`** (2026-06-06). Prio 1: Norm-Regel-Matrix verdrahten (`employee-file-requirements.ts`). Dashboard-Launcher (Tool1/Tool2/Uploads) = von Claude im HQ-Dashboard erledigt.

**@Cursor: bitte Mark kurz Bescheid geben, dass ich's mir angeschaut habe.**

### 2026-06-06 — Scope-Entscheidung Certification OS (für Cursor)

Mark hat entschieden (Details: `CONTEXT.md` → „Produkt-Scope"):
- **Eine App, zwei Modi:** Intern (operativ) + Kunde (Portal).
- **Intern:** viele Firmen → je Firma Mitarbeiter-**Pool** → Akten in Masse. Aktuelle Akte ist single-firm (Portal-Erbe) → **Firma-Ebene einziehen**.
- **Firmen-Profil + Logo** zentral pro Firma in **Tool 1 (Dokumentengenerator)**, geteilt — raus aus single-firm Upload Manager.
- Keine Umsetzung jetzt — nur festgehalten; Reihenfolge: erst Tool 1+2 absichern, dann Reorg.

### 2026-06-07 — Norm-Matrix v1 vorhanden (Prio-1-Gold)

**Datei:** `knowledge/NORM_MATRIX_Mitarbeiternachweise_v1.md` — grounded in CEA-Docs + DIN 77200 (SDL 5: 16/24 UE, SDL 8: 40/64 UE, Brandschutz/§34a extern, Anrechnung §4.19.2).
**Auftrag (Phase 2, nicht jetzt):** Matrix in `employee-file-requirements.ts` verdrahten → Bedingung (Grundrolle × Geltungsbereich × Bestellung) leitet Pflichtset automatisch ab, statt pauschal „FACHLICH PRÜFEN". Offene Prüfpunkte (§5.3 16/24 etc.) in der Datei beachten — Experten-Review pflicht (CROSS-CONTROL-05).

### 2026-06-07 — WICHTIG: Tool-2-Design existiert schon im DFSS → Fahrplan

**Cursor: vor weiterem Bau `hq/10_Bridge/TOOL2_FAHRPLAN_DFSS.md` lesen.** Das vollständige Tool-2-Funktionsdesign liegt in OneDrive `QM/Strategie/(DFFS/)` (FUNCTIONAL_DESIGN, READINESS_RULES, WORKSPACE_STRUCTURE_V1.1, MVP_SCOPE_BOUNDARY, DEVELOPER_BACKLOG/HANDOVER). **Bauen statt neu erfinden.**
Kern: Requirement→Evidence→**Readiness/Ampel** + **Pools** (SMA/DIN77200-1/SDL/77200-2/Projekt) + **Mitarbeiterakten-Generator** (vorausgefüllt + markiert fehlende Nachweise). Diese Logik in die 4 Slices integrieren, nicht wegkürzen.
**Marks Modifikation:** Generator-Output **direkt in die Akte** + OneDrive `Clients/{Kunde}/08_Generated/` (kein manueller Download).

### 2026-06-07 — Aufräumen: leeren Nested-Clone entfernen

Im Repo liegt eine **leere Doppelung**: `cert-expert-ai/cert-expert-ai/cert-expert-certification-os/apps/certification-os/` — **0 Dateien, nicht in Git** (nur `.DS_Store` + leere Ordner). Verwirrt in Finder/Cursor. Generalist-Sandbox darf nicht löschen (Host-Schutz). **Bitte per `rm -rf cert-expert-ai/cert-expert-ai` (oder Finder) entfernen.** Echte App bleibt: `cert-expert-certification-os/apps/certification-os/`.

## ❓ Offene Entscheidungen für Mark

- _(leer)_

---

## ✅ Archiv (erledigt)

- 2026-06-06 — Gesamt-Overview Cert-Expert in „Von Cursor an Claude" eingetragen. _(Cursor)_
- 2026-06-06 — Bridge-Ordner angelegt (CONTEXT, HANDOFF, CODE_REVIEW). _(Claude)_
