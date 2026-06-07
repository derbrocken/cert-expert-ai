# Existing Tool 2 Code Mapping

**Legacy root:** `bots/legacy_tools/existing_tools_systems/document_creater_tool_employee_file_creater_tool1_2/`

**Status:** Phase 1 — mapping and baseline only. **No migration, refactor, or bugfix executed.**

The legacy app combines **Tool 2 (employee automation)** and **Tool 1 (standard model creator)** in one Next.js project.

---

## Tool 1 separation (mandatory)

| Rule | Detail |
|------|--------|
| **Do not move** | Tool 1 files stay in legacy path until a separate gate approves split |
| **Do not touch** | No edits to Tool 1 code during Phase 1 or B2 bugfix phase unless explicitly scoped |
| **Do not place in scaffold** | `shared/document-templates/` is passive README only — no Tool 1 code copied there |
| **Dependency** | Tool 2 shares legacy infrastructure only: UploadThing template storage, `/api/templates`, `/api/uploads` (also used for role/appointment template admin) |
| **Tool 1 files (frozen)** | `app/model-creator/`, `app/actions/send-model-entries.ts`, `app/api/standard-models/`, `components/document/DocumentForm.tsx`, `lib/validations/model-form.ts` |

Tool 2 document generation uses **roles** and **appointments** categories in UploadThing — not Tool 1 `standard-models`. Cross-contamination risk is low but the apps share the same Next.js process and upload APIs.

---

## Summary

| Area | Legacy files | Target scaffold | Action |
|------|--------------|-----------------|--------|
| Tool 2 UI + state | ~12 files | `03-mitarbeiterakte-tool-2/employee-file` | **move** + refactor persistence |
| DOCX generation | 2 server actions | `employee-generator` + `document-output` | **move** |
| Roles / overlays | 2 files + API | `roles` | **move** + replace demo data |
| Evidence / readiness | — | `evidence`, `readiness-rules` | **boundary-only** (B4/B6) |
| Project/SDL link | — | `project-link` | **boundary-only** (B7) |
| Storage | `lib/uploadthing.ts` | `shared/storage` | **refactor** behind adapter |
| Tool 1 (model creator) | ~8 files | `shared/document-templates` (passive) | **keep** legacy until split |
| Shared UI | `components/ui/*` | `apps/certification-os` or shared | **move** with app |
| Template admin | `app/uploads/*` | `roles` + `shared/document-templates` | **move** partial |

---

## File-level mapping

### App pages & routing

| Existing file | Current purpose | Target folder | Action | Notes / risks |
|---------------|-----------------|---------------|--------|---------------|
| `app/page.tsx` | Landing links to Tool 1 + Tool 2 | `apps/certification-os/` | move | Passive shell |
| `app/employee-automation/page.tsx` | Tool 2 main page: employee queue, generate ZIP | `employee-file` + `document-output` | move | In-memory state only — **no save across reload** |
| `app/model-creator/page.tsx` | Tool 1 standard model workflow | `shared/document-templates` (legacy) | keep | Out of Tool 2 active scope |
| `app/uploads/page.tsx` | Template CRUD (roles, appointments, standard models) | `roles` + `shared/document-templates` | move | Large client component; couples admin to UploadThing |
| `app/layout.tsx` | Root layout | `apps/certification-os/` | move | |
| `app/globals.css` | Global styles | `apps/certification-os/` | move | |

### Server actions

| Existing file | Current purpose | Target folder | Action | Notes / risks |
|---------------|-----------------|---------------|--------|---------------|
| `app/actions/generate-employee-docs.ts` | Tool 2 DOCX+ZIP generation | `employee-generator` + `document-output` | move | Core pipeline; regression-sensitive (C-09) |
| `app/actions/send-model-entries.ts` | Tool 1 standard model ZIP | `shared/document-templates` | keep | Tool 1 — not Tool 2 scope |

### API routes

| Existing file | Current purpose | Target folder | Action | Notes / risks |
|---------------|-----------------|---------------|--------|---------------|
| `app/api/templates/route.ts` | List role + appointment folders/docs | `roles` | move | Merges UploadThing listing + static config |
| `app/api/standard-models/route.ts` | List standard-model templates | `shared/document-templates` | keep | Tool 1 |
| `app/api/uploads/route.ts` | Upload/delete DOCX templates | `shared/storage` + `roles` | refactor | Direct UploadThing — needs StorageAdapter |
| `app/api/uploads/folder/route.ts` | Create template folder | `roles` | move | |
| `app/api/preview/route.ts` | In-memory DOCX preview (5 min TTL) | `document-output` | move | Ephemeral Map — not production storage |

### Employee components

| Existing file | Current purpose | Target folder | Action | Notes / risks |
|---------------|-----------------|---------------|--------|---------------|
| `components/employee/EmployeeForm.tsx` | Add/edit employee, role, appointments, doc selection | `employee-file` + `roles` | move + **refactor** | **Bug:** edit mode resets doc selection via `useEffect` on `selectedRole` (lines 120–126) |
| `components/employee/EmployeeTable.tsx` | Employee queue, search, pagination, edit/delete | `employee-file` | move | Delete requires double-click |
| `components/employee/GlobalSidebar.tsx` | Company globals, logo, doc metadata | `employee-file` | move | |
| `components/employee/index.ts` | Barrel export | `employee-file` | move | |

### Document components (Tool 1)

| Existing file | Current purpose | Target folder | Action | Notes / risks |
|---------------|-----------------|---------------|--------|---------------|
| `components/document/DocumentForm.tsx` | Tool 1 metadata + folder selection | `shared/document-templates` | keep | Tool 1 |
| `components/document/DocumentPreview.tsx` | DOCX preview viewer | `document-output` | move | Shared preview utility |
| `components/document/index.ts` | Barrel | — | keep | |

### UI primitives

| Existing file | Current purpose | Target folder | Action | Notes / risks |
|---------------|-----------------|---------------|--------|---------------|
| `components/ui/DatePicker.tsx` | Custom calendar popover | `apps/certification-os` or shared UI | move + **refactor** | **Bug:** no paste handling; timezone edge cases on `new Date(value)` |
| `components/ui/MultiSelect.tsx` | Appointment multi-select | shared UI | move | |
| `components/ui/Select.tsx` | Role select | shared UI | move | |
| `components/ui/Input.tsx`, `Button.tsx`, `Card.tsx`, etc. | Form primitives | shared UI | move | |
| `components/ui/CEBadge.tsx` | Cert-Expert branding badge | `apps/certification-os` | move | |
| `components/ui/FileDropzone.tsx` | Logo/template upload | shared UI | move | |
| `components/ui/Toast.tsx` | Notifications | shared UI | move | |
| `components/layout/Navbar.tsx`, `Footer.tsx` | Chrome | `apps/certification-os` | move | |
| `components/DocxViewer.tsx` | Client DOCX render | `document-output` | move | |
| `components/Input.tsx` | Legacy duplicate input? | — | **remove** | Check if unused duplicate of `ui/Input.tsx` |

### Lib / data / types

| Existing file | Current purpose | Target folder | Action | Notes / risks |
|---------------|-----------------|---------------|--------|---------------|
| `lib/types/employee.ts` | Employee, Role, Appointment, GlobalProperties | `employee-file` + `roles` | move + extend | Missing: FirstName, LastName, training dates, project/SDL, evidence |
| `lib/validations/employee-form.ts` | Zod schema for employee form | `employee-file` | move | |
| `lib/validations/model-form.ts` | Tool 1 form schema | `shared/document-templates` | keep | Tool 1 |
| `lib/data/employee-config.ts` | Static demo ROLES + APPOINTMENTS | `roles` | **refactor** | Demo data (Software Engineer etc.) — replace with SMA/Cert-Expert roles |
| `lib/uploadthing.ts` | UploadThing SDK wrapper | `shared/storage` | **refactor** | Implement `UploadThingStorageAdapter` or migrate to `StorageAdapter` |
| `lib/sanitize.ts` | Filename/folder validation | `shared/storage` | move | |
| `lib/utils/date.ts` | Date helpers | `employee-file` | move + **refactor** | Birthday paste handling |
| `lib/utils.ts` | `cn()` utility | shared | move | |

### Config / project

| Existing file | Current purpose | Target folder | Action | Notes / risks |
|---------------|-----------------|---------------|--------|---------------|
| `package.json` | Next.js 16, React 19, uploadthing, easy-template-x | `apps/certification-os/` | move | |
| `next.config.ts` | Next config | `apps/certification-os/` | move | |
| `tsconfig.json` | Path alias `@/*` | `apps/certification-os/` | move | Re-map to monorepo paths |
| `DOCUMENTATION.md` | PowerAutomate technical docs | `docs/01-tool-2-handover/` | move | Rename/update for Cert-Expert |
| `README.md` | Generic create-next-app | replace | **refactor** | |

---

## Approved stabilization bugs (T2-BUG-01 – T2-BUG-10)

Full regression mapping for bugfix-only phase B2+ (not executed in Phase 1).

| ID | Legacy file(s) | Affected component / function | Current observed behavior | Suspected root cause | Affected workflow | Allowed fix phase | Minimal acceptance test | Risk if changed incorrectly |
|----|----------------|------------------------------|---------------------------|----------------------|-------------------|-------------------|-------------------------|----------------------------|
| **T2-BUG-01** Birthday copy-paste | `components/ui/DatePicker.tsx`, `lib/utils/date.ts` (unused helper), `components/employee/EmployeeForm.tsx` (`birthday` / `startDate` Controller) | `DatePicker` — `PopoverButton` only; no text input or `onPaste` | User cannot paste `DD.MM.YYYY` or `YYYY-MM-DD` into birthday/start-date fields; must use calendar clicks only | No editable input; no paste/parse handler; `formatDate`/`formatDisplayDate` use local `Date` parsing (timezone-sensitive for ISO strings) | Employee registration; Pflichtfeld capture; placeholder `{Birthday}` / `{StartDate}` in generated docs | **B2** (bugfix-only) | Paste `15.03.1990` into birthday → field shows valid ISO date; generate doc → `{Birthday}` matches pasted date | Wrong date in Personalakte; off-by-one day in docs; EC-09 output regression |
| **T2-BUG-02** Employee save/reopen persistence | `app/employee-automation/page.tsx` (`useState` for `employees`, `globalProps`), `components/employee/EmployeeTable.tsx` | Page-level state — no `localStorage`, API, or file persistence | Employees lost on page reload/navigation; "save" is queue-in-memory only | `handleAddEmployee` / `handleUpdateEmployee` update React state only; no persistence layer | T2-ACC-01 / EC-01 entire workflow | **B2** (bugfix-only) | Add employee → reload page → employee still listed with same fields | Data loss; false sense of "saved"; persistence format lock-in if rushed |
| **T2-BUG-03** Training selection reset on edit | `components/employee/EmployeeForm.tsx` — `useEffect` on `selectedRole` (L120–126), `useEffect` on `selectedAppointments` (L128–133) | `setSelectedRoleDocIds` / `setSelectedAppDocIds` | Opening edit re-selects **all** role/appointment documents, discarding prior deselection; user-reported "not all trainings stay selected" may also mean unwanted auto-select-all on edit | Effects always set full document ID set when role/appointments resolve; no branch for `editingEmployee` or preserved `selectedRoleDocIds` | Edit employee → adjust doc checkboxes → update → re-edit | **B2** (bugfix-only) | Deselect 2 of 5 role docs → update → re-edit → same 3 remain selected | Wrong documents in ZIP; accidental inclusion of unchecked trainings |
| **T2-BUG-04** Calendar layout/size instability | `components/ui/DatePicker.tsx` — `PopoverPanel` `w-80`, grid `h-9 w-9`, `viewDate` state | Calendar popover rendering and month navigation | Calendar month view may not reflect edited value; popover size/position can feel unstable across viewports (fixed `w-80`, `z-[100]`) | `viewDate` initialized from `value` once but **not synced** when `value` prop changes (no `useEffect`); Headless UI `PopoverPanel anchor` behavior | Birthday/start-date selection in form | **B2** (bugfix-only) | Set birthday via edit load → open picker → shows correct month; resize viewport → popover remains usable | Wrong month shown; user selects wrong date; accessibility/layout regressions |
| **T2-BUG-05** Multiple SMA per document | `app/actions/generate-employee-docs.ts` — `templateData` per employee loop; `easy-template-x` `handler.process` | Single `TemplateData` object per employee per document | One DOCX = one employee context; templates cannot emit multiple SMA blocks in one document from batch queue | Generator loops employees into separate folders/files; no multi-record template loop or table expansion | Batch hire documentation; combined SMA listing documents | **B4** (generator — after B2 stable) | Generate doc designed for 2+ SMA → output lists all selected employees | Broken combined docs; C-09 regression on ZIP structure |
| **T2-BUG-06** Groups creation/usage | — (not present in legacy) | No group entity, UI, or generator branch | Cannot create employee groups or generate group-scoped document packages | Feature not implemented; `Employee` type has no `groupId` | Batch onboarding by team/Objekt | **B2+ or backlog** (confirm scope before B2) | Create group → assign 3 employees → generate group package | Scope creep into HR/organisation model; coupling to future Projektakte |
| **T2-BUG-07** Date per training | `lib/types/employee.ts`, `components/employee/EmployeeForm.tsx`, `app/actions/generate-employee-docs.ts` | Only `trainingHours` string; appointments have no date fields | No per-training or per-Unterweisung date; `{TrainingDate}` / `{InstructionDate}` placeholders unsupported | Data model lacks date fields per appointment/training; generator does not inject training dates | Schulungs-/Unterweisungsnachweise in Personalakte | **B4** (with roles model — not B2 unless minimal field add approved) | Set training date on appointment → appears in output placeholder | Schema churn; template mismatch; accidental LMS scope |
| **T2-BUG-08** Select-all / deselect-all trainings | `components/employee/EmployeeForm.tsx` (doc checklists); contrast: `app/model-creator/page.tsx` L165–178 has pattern | Role/overlay document panels — per-doc toggle only | No "Select All" / "Deselect All" for Core or Overlay documents | UI not implemented in EmployeeForm (exists in Tool 1 model-creator only) | Large role packages; appointment overlays | **B2** (bugfix-only) | Click Deselect All on overlay docs → 0 selected; Select All → all selected | UX only in B2 — low regression risk if state logic mirrors T2-BUG-03 fix |
| **T2-BUG-09** Document formatting | `app/actions/generate-employee-docs.ts` (`formatDisplayDate`, logo `image-size` scaling), `app/actions/send-model-entries.ts` (shared logo logic), DOCX templates external | Output DOCX layout, logo size, date format strings | Dates formatted `en-US` long form in docs; logo EMU sizing may not match template expectations; formatting varies vs Cert-Expert standard | `toLocaleDateString("en-US", { month: "long", ... })`; logo max 150×60 px → EMU conversion; template-side styles not controlled in code | EC-09 Standardpersonalakte readability | **B4** (generator — template + code review) | Generate baseline employee ZIP → visual compare DOCX layout vs approved sample | C-09 regression; widespread doc corruption if template handler changes |
| **T2-BUG-10** Duplicate content in combined documents | `app/actions/generate-employee-docs.ts` — appointment loop (L193–230); identical `templateData` for each appointment doc | Each appointment folder gets separate files with same employee/global placeholders | Combined or repeated Unterweisung content appears duplicated when multiple appointment docs share boilerplate | No deduplication; no appointment-specific placeholder keys (`InstructionName`, `InstructionDate`); same `templateData` for every appointment template | Multi-appointment employees; combined instruction exports | **B4** (generator) | Employee with 2 appointments → open both docs → no duplicate boilerplate sections | Removing wrong duplicate merges distinct docs; EC-09/T2-ACC-14 fail |

### Bug phase summary

| Phase | Bugs |
|-------|------|
| **B2 bugfix-only** | T2-BUG-01, 02, 03, 04, 08 |
| **B2+ / scope confirm** | T2-BUG-06 |
| **B4 generator** | T2-BUG-05, 07, 09, 10 |

---

## Placeholder mapping (legacy → Tool 2 canonical)

Documented in `shared/placeholders/TOOL_2_PLACEHOLDERS.md`.

| Legacy (implemented) | Canonical (target) | Status |
|---------------------|-------------------|--------|
| `{FullName}` | `{FullName}` | OK |
| `{Birthday}`, `{StartDate}` | same | OK |
| `{RoleName}` | `{RoleName}` | OK |
| `{GuardIDNumber}` | `{BewacherId}` | **alias needed** |
| `{RoleType}` | `{QualificationLevel}` | **alias needed** |
| `{DocDate}` | `{DocumentDate}` | **alias needed** |
| `{TrainingHours}` | keep | OK |
| — | `{FirstName}`, `{LastName}` | **missing** |
| — | `{TrainingName}`, `{TrainingDate}` | **missing** |
| — | `{InstructionName}`, `{InstructionDate}` | **missing** |
| — | `{ProjectName}`, `{SDLName}` | **missing** |

**Action:** keep — do not change templates until alias layer is implemented in `employee-generator`.

---

## Not implemented in legacy (boundary-only — do not build in Phase 1 or B2)

| Capability | EC / T2-ACC | Target folder | Status |
|------------|-------------|---------------|--------|
| Evidence upload/mark | EC-03, T2-ACC-03–07 | `evidence/` | Boundary-only README |
| Offene Unterlagen list | EC-04, T2-ACC-04 | `evidence/` + `document-output/` | Boundary-only |
| Blocker / readiness ampel | EC-05, T2-ACC-02, N-01–06 | `readiness-rules/` | Boundary-only README |
| SDL/project context | EC-07, T2-ACC-10–11 | `project-link/` | Boundary-only README |
| Audit-readiness impact display | EC-08, T2-ACC-15 | `readiness-rules/` | Boundary-only |
| No false release claims | EC-10 | `controls/` + `readiness-rules/` | Documentation only |

---

## Unclear / decision needed

| Item | Question |
|------|----------|
| Tool 1 in same repo | Split to `shared/document-templates` passive or separate package? |
| UploadThing vs Hetzner | Interim: wrap UploadThing as `StorageAdapter`; migrate when Hetzner ready? |
| Electron desktop | `pnpm run electron:dev` in legacy — keep for Certification OS app shell? |
| `employee-config.ts` vs API templates | Single source of truth: API-only or config + API merge? |

---

## Risk register

1. **Regression (C-09):** Moving `generate-employee-docs.ts` can break ZIP output — needs baseline ZIP comparison before/after.
2. **No persistence:** Blocks T2-ACC-01 until addressed — highest priority bugfix in migration B2.
3. **Edit doc selection bug:** Blocks reliable training/document workflow — fix before evidence module.
4. **Scope creep:** Tool 1 model-creator in same app — strict boundary during migration.
5. **Placeholder rename:** Silent template breaks if alias layer skipped.
