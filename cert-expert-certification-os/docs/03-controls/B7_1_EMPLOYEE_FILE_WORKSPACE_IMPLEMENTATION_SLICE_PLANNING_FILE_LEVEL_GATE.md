# B7.1 — Employee File Workspace Implementation Slice Planning / File-Level Execution Gate

**Gate:** B7.1 — Read-only file inspection and minimal B7.2 slice proposal  
**Status:** **READY FOR B7.2 LIMITED IMPLEMENTATION SLICE WITH CONTROLS**  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**Prerequisite:** B7.0 READY FOR LIMITED IMPLEMENTATION PLANNING (`ef8af2d`)  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Primary route:** `/employee-automation`

---

## 1. Title and Gate Decision

### **READY FOR B7.2 LIMITED IMPLEMENTATION SLICE WITH CONTROLS**

B7.1 inspected the live Tool 2 Employee File workspace tree, documented current runtime behavior, and proposes **one** minimal, reversible implementation slice (B7.2). **No code was modified in B7.1.**

**Blockers found:** None. EC-09 path is intact and isolated from proposed B7.2 UI-only scope.

---

## 2. Purpose

B7.1 fulfills B7.0 §14 entry criteria:

1. Record **actual** file paths (not assumed paths from legacy `bots/` copies).
2. Inventory **current behavior** without changing it.
3. Propose the **smallest safe** B7.2 implementation slice with file allow list, acceptance criteria, and EC-09 regression plan.
4. Authorize **no implementation** in B7.1 — B7.2 requires explicit **"Start B7.2"** gate prompt.

---

## 3. Git State Check (B7.1 Entry)

| Item | Value |
|------|-------|
| **Current branch** | `b3-tool2-migration` (ahead of origin by 21 commits) |
| **Latest Tool 2 gate commit** | `ef8af2d` — B7.0 backlog translation |
| **B7.1 action** | Docs-only; no application files touched |

### Unrelated modified / untracked files (left untouched)

| Category | Paths (representative) |
|----------|------------------------|
| **bots/legacy_tools/** | Modified: `employee-automation/page.tsx`, `EmployeeForm.tsx`, `DatePicker.tsx`, `lib/utils/date.ts`; untracked: `employee-queue-storage.ts`, `package-lock.json` |
| **hq/** | Multiple dashboard, kundenprojekte, vertrieb, scripts changes |
| **Modified prior report** | `docs/03-controls/B5_7_EMPLOYEE_FILE_MVP_SLICE_1_IMPLEMENTATION_REPORT.md` |
| **Other untracked** | `Unbenannt.canvas`, various hq customer folders |

**Confirmation:** B7.1 did **not** stage, modify, or commit any unrelated working tree changes.

---

## 4. Source Documents Reviewed

| Document | Commit / ref | Use in B7.1 |
|----------|--------------|-------------|
| **B7.0** Implementation preparation backlog | `ef8af2d` | Epics A–H, inspection plan §6, EC-09 checklist §9, slice sequence §12 |
| **B6.7** Design closure gate | `e448d4e` | Carry-forwards §11, EC-09 §7, not-authorized §6 |
| **B6.0** Product design boundary | `569bba3` | Profile hub; generator subordinate |
| **B6.1** IA & navigation design | `2c7bad1` | Overview → profile → sections; transitional queue mapping |
| **B6.2** Employee profile section design | `e91bd8b` | Ten sections; active vs placeholder states |
| **B6.3** Evidence section design | `6a34d73` | Eight categories; no upload in build |
| **B6.4** Role/SDL/project assignment design | `a7c9049` | Assignment ≠ release |
| **B6.5** Readiness/Ampel display boundary | `477dd22` | Grey **Not evaluated** only live |
| **B6.6** Generator output section design | `8262824` | Output blocks A–F; EC-09 wrap; batch generate retained |
| **B5.7** Workspace shell report | `52ca548`, `5ac5520` | Shell components; EC-09 control closed |
| **B5.8a** Output quality verification | `cac9b50` | Template/footer findings |
| **B5.8b** DD.MM.YYYY fix report | `27a284b` | Generator date normalization; EC-09 re-verified |

---

## 5. Actual File Path Inventory (Inspected)

All paths relative to `cert-expert-certification-os/apps/certification-os/` unless noted.

### 5.1 Route entry

| Path | Role | Notes |
|------|------|-------|
| `app/employee-automation/page.tsx` | Next.js route | Re-exports `EmployeeAutomationPage` only (1 line) |
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeAutomationPage.tsx` | Primary page | Client component; owns queue state, generate handler, layout |

**Note:** There is **no** separate `apps/certification-os/components/employee/` directory. `@/components/employee` resolves via `tsconfig.json` path alias to `modules/03-mitarbeiterakte-tool-2/employee-file/index.ts`.

### 5.2 B5.7 workspace shell (UI)

| Path | Role |
|------|------|
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeFileWorkspaceNotice.tsx` | Amber transitional notice (B5.7) |
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeFileSummaryPanel.tsx` | Read-only summary when row selected / editing |
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeForm.tsx` | Employee intake + template doc chip selection |
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeTable.tsx` | Paginated queue table; row select |
| `modules/03-mitarbeiterakte-tool-2/employee-file/GlobalSidebar.tsx` | GlobalProperties + logo (session-only) |
| `modules/03-mitarbeiterakte-tool-2/employee-file/index.ts` | Exports Form, Table, GlobalSidebar |
| `modules/03-mitarbeiterakte-tool-2/employee-file/types/employee.ts` | `Employee`, `Role`, `Appointment`, `GlobalProperties` |
| `modules/03-mitarbeiterakte-tool-2/employee-file/validations/employee-form.ts` | Zod schema for form |
| `modules/03-mitarbeiterakte-tool-2/employee-file/utils/date.ts` | DD.MM.YYYY generator + display helpers (B5.8b) |
| `modules/03-mitarbeiterakte-tool-2/employee-file/employee-queue-storage.ts` | localStorage queue (`cert-expert-tool2-employee-queue-v1`) |
| `modules/03-mitarbeiterakte-tool-2/employee-file/README.md` | Module notes |

### 5.3 EC-09 generator path (read-only — do not modify in B7.2)

| Path | Role |
|------|------|
| `app/actions/generate-employee-docs.ts` | Re-exports server action from module |
| `modules/03-mitarbeiterakte-tool-2/employee-generator/generate-employee-docs.ts` | `"use server"` — DOCX fill + JSZip + base64 return |
| `lib/template-storage.ts` | Hetzner S3 list/fetch; `buildLatestTemplateKeyMap`, `fetchTemplateBufferByKey` |
| `lib/hetzner-s3-client.ts` | S3 client (referenced by template-storage) |
| `app/api/templates/route.ts` | GET — scans Hetzner objects → `{ roles, appointments }` JSON |

### 5.4 Path aliases (`tsconfig.json`)

| Alias | Resolves to |
|-------|-------------|
| `@/components/employee` | `modules/03-mitarbeiterakte-tool-2/employee-file/index.ts` |
| `@/lib/types/employee` | `modules/03-mitarbeiterakte-tool-2/employee-file/types/employee.ts` |
| `@/lib/validations/employee-form` | `modules/03-mitarbeiterakte-tool-2/employee-file/validations/employee-form.ts` |
| `@/lib/employee-queue-storage` | `modules/03-mitarbeiterakte-tool-2/employee-file/employee-queue-storage.ts` |
| `@/lib/utils/date` | `modules/03-mitarbeiterakte-tool-2/employee-file/utils/date.ts` |

### 5.5 Deferred module stubs (read-only)

| Path | State |
|------|-------|
| `modules/03-mitarbeiterakte-tool-2/evidence/README.md` | Placeholder only |
| `modules/03-mitarbeiterakte-tool-2/readiness-rules/README.md` | Placeholder only |
| `modules/03-mitarbeiterakte-tool-2/project-link/README.md` | Placeholder only |
| `modules/03-mitarbeiterakte-tool-2/acceptance-tests/README.md` | Placeholder only |
| `modules/03-mitarbeiterakte-tool-2/document-output/` | Preview components (not on employee-automation path) |
| `modules/03-mitarbeiterakte-tool-2/roles/employee-config.ts` | Static role config reference |

### 5.6 Legacy copy (out of scope — not runtime)

`bots/legacy_tools/existing_tools_systems/document_creater_tool_employee_file_creater_tool1_2/` — separate tree with local modifications; **not** the certification-os runtime path.

---

## 6. Existing Behavior Inventory

### 6.1 Page load and hydration

1. `EmployeeAutomationPage` mounts; `loadEmployeeQueue()` reads `localStorage` key `cert-expert-tool2-employee-queue-v1`.
2. Restores `employees[]` and `globalProps` (company name/email/address); sets `queueHydrated`.
3. On every `employees` / `globalProps` change after hydration, `saveEmployeeQueue()` persists back to localStorage.
4. Parallel fetch: `GET /api/templates` → populates `roles[]` and `appointments[]` from Hetzner object listing.

### 6.2 EmployeeForm / employee input

- React Hook Form + Zod (`employeeFormSchema`).
- Fields: `fullName`, `birthday`, `startDate`, `roleId`, `appointmentIds`, `roleType`, `trainingHours`, `guardIDNumber`, `employeeIDNumber`, `useGuardAsEmployeeId`.
- On submit: creates/updates `Employee` with UUID `id`, `selectedRoleDocIds`, `selectedAppointmentDocIds` from chip toggles.
- **Template chips:** Right column "Core Documents" (role DOCX list) and "Appointment Documents" per selected overlay; select all / deselect all.
- Role change resets role doc selection; appointment change resets appointment doc selection.
- Add → appends to queue, selects row, toast. Update → replaces in queue. Edit → scrolls to form with `formKey` reset.

### 6.3 localStorage queue

- **Storage key:** `cert-expert-tool2-employee-queue-v1`
- **Shape:** `{ employees: Employee[], globalProps: GlobalProperties }`
- **Scope:** Browser session persistence only — not employee-file DB.
- **`logoFile`:** Held in React state only (`useState<File | null>`) — **not** persisted (CF-05 / B4.2).

### 6.4 Workspace shell (B5.7)

| Element | Behavior |
|---------|----------|
| Header | "Employee File Workspace" + transitional subtitle |
| `EmployeeFileWorkspaceNotice` | Amber banner — not release/DIN/certification |
| `EmployeeFileSummaryPanel` | Shown when `focusEmployee` (selected row or editing) **and** `templatesLoaded` |
| Summary content | Name, role, birthday, start date, Bewacher-ID, doc counts, overlay names |
| Summary badges | Grey: "Evidence: not implemented", "Readiness: not evaluated" |
| Summary dates | **`en-US` locale** via local `formatDate()` — **not** DD.MM.YYYY (CF-06) |
| Queue table | Search, pagination (5/page), row click → `selectedEmployeeId`, edit/delete |
| Generate strip | Shown when `employees.length > 0`; batch ZIP for **all** queue employees |

### 6.5 Template / role / appointment selection

- Templates loaded once from Hetzner via `/api/templates`.
- Roles = folders under `roles/`; appointments = folders under `appointments/`.
- Each folder exposes `.docx` documents as selectable chips in `EmployeeForm`.
- Selected doc IDs stored on `Employee` record in queue.

### 6.6 generateEmployeeDocs call path (EC-09)

```
EmployeeAutomationPage.handleGenerate()
  → optional logoFile → base64 merge into globalProps.companyLogo
  → generateEmployeeDocs(employees, finalGlobalProps, roles, appointments)
       [app/actions/generate-employee-docs.ts re-export]
       [modules/.../employee-generator/generate-employee-docs.ts]
  → listTemplateFiles() + buildLatestTemplateKeyMap()
  → per employee: fetchTemplateBufferByKey() from Hetzner
  → easy-template-x TemplateHandler.process(templateData)
  → JSZip folder structure: employeeName/roleName/*.docx, appointmentName/*.docx
  → return { success, zipBase64 }
  → client: atob → Blob → programmatic <a download>
```

**Server action inputs unchanged since B5.7.** Generator uses `formatDocumentOutputDate` / `formatTodayDocumentOutput` from `utils/date.ts` for **DD.MM.YYYY** in DOCX placeholders (`Birthday`, `StartDate`, `currentDate`, `DocDate`).

**Template data includes** `ApprovedBy`, `CreatedBy` as **placeholder fields** from `GlobalProperties` — not UI certification claims.

### 6.7 Hetzner / Object Storage path

- `lib/template-storage.ts` → `@/lib/hetzner-s3-client` (S3-compatible Hetzner).
- `/api/templates` lists objects; generator fetches buffers server-side (no presigned URL in generation path).
- Env vars required (documented in API 503 response): `HETZNER_S3_KEY`, `HETZNER_S3_SECRET`, `HETZNER_BUCKET_NAME`, `HETZNER_S3_ENDPOINT`, `HETZNER_S3_REGION`.

### 6.8 ZIP download behavior

- Filename: `employee-documents-${Date.now()}.zip`
- Trigger: single batch button "Generate & Download ZIP"
- Success toast: count of employees generated
- **No** post-download readiness state change
- **No** output history persisted (CF-07)

### 6.9 Generated date behavior (DD.MM.YYYY)

- **In DOCX (generator):** B5.8b — `formatDocumentOutputDate`, `formatTodayDocumentOutput` → **DD.MM.YYYY** ✓
- **In UI summary panel:** `toLocaleDateString("en-US", …)` → **not** DD.MM.YYYY (CF-06 gap)
- **In form DatePicker display:** uses `@/lib/utils/date` helpers (separate from summary panel)

### 6.10 Readiness / evidence in live UI

- Only static grey badges in summary panel
- No evaluator, no ampel colors, no ZIP-triggered updates
- Aligns with B6.5 B6-live default

### 6.11 What is **not** implemented (confirmed)

- Profile section navigation (B6.1 / B6.2 ten sections)
- Evidence upload / checklist UI
- SDL / project pickers or persistence
- Profile-scoped generate (batch only)
- Output history store
- Dedicated generator output section UI (B6.6 blocks A–F as layout)

---

## 7. Gap Analysis (Design vs Runtime)

| B6 design element | Runtime today | B7.2 relevance |
|-------------------|---------------|----------------|
| Profile section nav (B6.1 §6) | Absent | **Primary B7.2 target** — static shell |
| Ten profile sections (B6.2 §4) | Only summary panel partial | Shell labels + placeholder states |
| Generator output section (B6.6) | Batch strip + summary doc counts | Defer to later slice (Option 3) |
| DD.MM.YYYY profile display (B6.2) | Summary uses en-US | Optional micro-fix in B7.2 if summary touched (CF-06) |
| Evidence / readiness sections | Static badges only | Shell placeholders only |

---

## 8. Minimal Implementation Slice Proposal

### Selected option: **Option 1 — Static section shell inside existing workspace**

**Rationale (smallest safe slice):**

| Criterion | Option 1 (static shell) | Option 2 (profile grouping) | Option 3 (output display) |
|-----------|-------------------------|----------------------------|---------------------------|
| Touches EC-09 upstream (`EmployeeForm`) | **No** | **Yes** — form refactor risk | **No** |
| Touches `handleGenerate` / generator | **No** | **No** | Low — if near generate UI |
| Reversible | **High** — new component + mount | Medium | Medium |
| Maps to B6 backlog | Epic B, B6.1/B6.2 | Epic B | Epic F |
| New persistence | **No** | **No** | **No** |

Option 1 introduces **visible profile IA** without reorganizing the working form/generator flow. Options 2 and 3 are valid **subsequent** slices after the shell exists.

---

## 9. Recommended B7.2 Candidate

### **B7.2 — Employee Profile Static Section Shell (Transitional Layout)**

**Backlog mapping:** BL-B-001 (Epic B), preserves BL-A-001 (Epic A shell)

**Scope (when explicitly authorized):**

1. Add new component `EmployeeProfileSectionShell.tsx` under `employee-file/`.
2. Render when `focusEmployee !== null` (same condition as summary panel), **below** `EmployeeFileSummaryPanel`.
3. Display B6.2 section list in fixed order with B6.1 labels:

   | Section ID | Label | Shell state |
   |------------|-------|-------------|
   | `summary` | Kurzübersicht / Summary | **Active (read-only)** — "See summary above" |
   | `master-data` | Stammdaten / Master data | **Active (transitional)** — "Edit via form above" |
   | `employment` | Beschäftigung / Employment | **Active (transitional)** — "Edit via form above" |
   | `roles` | Rollen & Overlays / Roles | **Active (transitional)** — "Edit via form above" |
   | `evidence` | Nachweise / Evidence | **Placeholder** — "Not implemented" |
   | `instructions` | Unterweisungen / Instructions | **Placeholder** — "Not implemented" |
   | `sdl-project` | SDL & Projekt / SDL & project | **Placeholder** — "Not implemented" |
   | `output` | Dokumente & Pakete / Generated documents | **Read-only stub** — doc counts from `focusEmployee` + "Batch generate below — requires review" |
   | `open-items` | Offene Punkte / Open items | **Read-only stub** — static carry-forward hints (no fake completeness) |
   | `notes` | Notizen / Notes | **Placeholder** — "Not implemented" |

4. Section shell badges: grey **Not evaluated** / **Not implemented** only — no R/Y/G ampel.
5. Optional **CF-06 micro-fix:** change `EmployeeFileSummaryPanel.formatDate` to use `formatIsoToInput` from `utils/date.ts` for DD.MM.YYYY display — **display-only**, no generator impact.

**Explicitly out of B7.2 scope:**

- Form field relocation (Option 2)
- New routes (`/employee-files/[id]`)
- Evidence upload, readiness algorithm, DB, generator/template/Hetzner changes
- Moving or rewriting `handleGenerate`
- Profile-only generate button
- Output history persistence

---

## 10. File-Level Modification Plan for B7.2

### 10.1 Files likely to be modified

| File | Expected change type |
|------|---------------------|
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeProfileSectionShell.tsx` | **NEW** — static section nav + placeholder panels |
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeAutomationPage.tsx` | **Minimal** — import and render shell when `focusEmployee` set |
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeFileSummaryPanel.tsx` | **Optional** — DD.MM.YYYY date display (CF-06) only |

### 10.2 Files read-only protected (must not change logic)

| File | Reason |
|------|--------|
| `employee-file/EmployeeForm.tsx` | EC-09 upstream input |
| `employee-file/employee-queue-storage.ts` | Queue persistence contract |
| `employee-file/EmployeeTable.tsx` | Queue interaction — change only if row-select regression |
| `employee-generator/generate-employee-docs.ts` | EC-09 core |
| `app/actions/generate-employee-docs.ts` | EC-09 entry |
| `lib/template-storage.ts`, `lib/hetzner-s3-client.ts` | Hetzner path |
| `app/api/templates/route.ts` | Template listing |
| `employee-file/utils/date.ts` | B5.8b generator dates — read-only unless CF-06 imports only |
| `employee-file/types/employee.ts` | No schema expansion in B7.2 |
| `employee-file/validations/employee-form.ts` | Form validation unchanged |

### 10.3 Files explicitly forbidden

| Path | Rule |
|------|------|
| `employee-generator/**` (except read) | C-09 / B6.7 N-5 |
| `app/api/**` (templates, uploads, preview) | No Hetzner/API changes |
| `lib/template-storage.ts`, `lib/hetzner-s3-client.ts` | No storage refactor |
| `bots/**`, `hq/**`, Tool 1 paths | Scope wall C-B7-09 |
| `.env.local` | C-B7-08 |
| `package.json`, lockfiles | No dependency changes |

### 10.4 Rollback approach

1. Revert B7.2 commit(s) — shell is additive; page composition returns to B5.7 layout.
2. Delete `EmployeeProfileSectionShell.tsx` if committed in isolation.
3. Verify queue + ZIP manually (EC-09 smoke §12).

### 10.5 Regression checks (B7.2 exit)

Apply B7.0 §9 checklist (R-01–R-10). **EC-09 smoke mandatory** even for UI-only slice (confirm no accidental handler wiring changes).

---

## 11. Acceptance Criteria for Proposed B7.2

| AC | Criterion | Verification method |
|----|-----------|---------------------|
| **AC-B72-01** | Existing employee generator queue remains usable (add, edit, delete, reload) | Manual: localStorage persistence |
| **AC-B72-02** | Existing ZIP generation still works | EC-09 smoke: real Hetzner → ZIP download |
| **AC-B72-03** | Generated DOCX dates remain **DD.MM.YYYY** | Inspect ZIP contents post-generate |
| **AC-B72-04** | No generated package becomes accepted evidence | UI copy: "requires review" / no "Accepted evidence" |
| **AC-B72-05** | No readiness/Ampel changes from ZIP success | Badge state unchanged after generate |
| **AC-B72-06** | Forbidden wording absent: Approved, Accepted evidence, Certified, DIN-compliant, Audit-ready, Certification-ready, Released | Visual + string search on changed files |
| **AC-B72-07** | Grey **Not evaluated** / **Not implemented** only for readiness/evidence in new shell | Visual inspection |
| **AC-B72-08** | No DB/persistence changes | Diff: no new storage keys/schema |
| **AC-B72-09** | No generator/template/Hetzner file diffs | `git diff` path guard |
| **AC-B72-10** | B5.7 notice + summary panel + queue table + batch generate strip preserved | Visual regression |
| **AC-B72-11** | Section shell visible only when employee focused | Select/deselect row behavior |
| **AC-B72-12** | No unrelated files touched | `git status` clean outside allow list |
| **AC-B72-13** | `npm run build` passes | Build command from `apps/certification-os/` |

---

## 12. EC-09 Protection (Restated)

The following chain **must remain stable** through B7.2 and all subsequent slices:

```
EmployeeForm
  → employee-queue-storage (localStorage: cert-expert-tool2-employee-queue-v1)
  → template selection (selectedRoleDocIds / selectedAppointmentDocIds on Employee)
  → generateEmployeeDocs (server action)
  → listTemplateFiles / fetchTemplateBufferByKey (Hetzner Object Storage)
  → easy-template-x process + JSZip
  → zipBase64 → client Blob download
```

| Rule | B7.2 impact |
|------|-------------|
| No client-only DOCX bypass | Shell is display-only — **no impact** |
| ZIP success ≠ readiness change | No new state hooks on generate — **no impact** |
| Generated output = Prepared / Requires review | Shell output stub uses B6.6 wording only |
| Generator files untouched | **Required** — B7.2 allow list excludes generator |

---

## 13. Carry-Forwards (Unchanged — Not B7.2 Scope)

| ID | Item | B7.2 disposition |
|----|------|----------------|
| CF-01 | Footer metadata placeholders (T2-BUG-09b) | Not in B7.2 |
| CF-02 | `{EndDate}` unmapped | Not in B7.2 |
| CF-03 | T2-BUG-10 duplicate content watch | Monitor at EC-09 smoke |
| CF-04 | Template standardization | Not in B7.2 |
| CF-05 | `logoFile` session-only | Unchanged |
| CF-06 | Summary en-US vs DD.MM.YYYY | **Optional** display fix in B7.2 |
| CF-07 | Output history | Deferred — shell stub only |
| CF-08 | Evidence upload | Deferred — placeholder only |
| CF-09 | Readiness evaluator | Deferred |
| CF-10 | SDL/project persistence | Deferred — placeholder only |

---

## 14. Explicitly Not Authorized in B7.1

| # | Not authorized |
|---|----------------|
| N-1 | Code implementation |
| N-2 | Feature build |
| N-3 | Evidence upload implementation |
| N-4 | Readiness algorithm |
| N-5 | Ampel algorithm |
| N-6 | DB schema |
| N-7 | Persistence migration |
| N-8 | Generator refactor |
| N-9 | Template refactor |
| N-10 | Hetzner/storage refactor |
| N-11 | Tool 1 changes |
| N-12 | Customer portal |
| N-13 | Project file / company file implementation |
| N-14 | CEKS or bot expansion |
| N-15 | KPI targets |
| N-16 | Modifying unrelated working tree |

B7.1 **authorizes B7.2 planning only** — implementation requires **"Start B7.2"** with file allow list confirmation.

---

## 15. Proposed Slice Sequence After B7.2 (Planning Only)

| Order | Gate | Scope sketch |
|-------|------|--------------|
| 1 | **B7.2** | Static profile section shell (this document) |
| 2 | B7.3 (TBD) | CF-06 summary date alignment if not in B7.2; shell polish |
| 3 | B7.4 (TBD) | Read-only generator output block (Option 3) — doc list from queue state |
| 4 | B7.5 (TBD) | Controlled profile field grouping (Option 2) — form layout only, no schema |
| 5 | B7.6+ (TBD) | Evidence/SDL placeholders → separate gates per B6.3/B6.4 |

---

## 16. B7.1 Completion Criteria

| AC | Criterion | Met |
|----|-----------|-----|
| AC-1 | Markdown document exists | **Yes** |
| AC-2 | Records actual inspected file paths | **Yes** — §5 |
| AC-3 | Documents current behavior | **Yes** — §6 |
| AC-4 | Proposes one minimal B7.2 slice | **Yes** — §8–§9 (Option 1) |
| AC-5 | Lists modify/protect/forbid files | **Yes** — §10 |
| AC-6 | Includes acceptance criteria | **Yes** — §11 |
| AC-7 | Protects EC-09 | **Yes** — §12 |
| AC-8 | No code or package files changed | **Yes** |
| AC-9 | Unrelated working tree untouched | **Yes** — §3 |
| AC-10 | Clear gate decision | **Yes** — §1 READY FOR B7.2 |

**B7.1 gate:** **CLOSED** upon commit.

---

## 17. Commit

```
docs: plan employee file workspace implementation slice gate (B7.1)
```

---

## 18. Document History

| Version | Date | Event |
|---------|------|-------|
| 1.0 | 2026-06-05 | B7.1 file-level planning gate — READY FOR B7.2 LIMITED IMPLEMENTATION SLICE WITH CONTROLS |
