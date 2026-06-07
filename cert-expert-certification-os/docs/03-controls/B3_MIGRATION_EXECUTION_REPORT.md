# B3 Migration Execution Report — Tool 2 → Certification OS

**Gate:** ACCEPT WITH CONDITIONS — B3 MIGRATION **CLOSED WITH OPEN CONTROLS**  
**Status:** Migration closed — pre/post build PASS — B2 regression completed for approved scope  
**Date:** 2026-06-05  
**Closure date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**Pre-move base SHA:** `b5dc35e` (legacy B2-good state on branch creation)

This closure applies **only** to the controlled B3 migration of active Tool 2 code. It does **not** close full Tool 2 acceptance, EC-09, new feature development, Tool 1 migration, or passive module implementation.

---

## Pre-move checkpoint

| Check | Result |
|-------|--------|
| Branch created | `b3-tool2-migration` |
| Legacy pre-move `npm run build` | **PASS** (Next.js 16.1.1, 12 routes) |
| Legacy path | `bots/legacy_tools/.../document_creater_tool_employee_file_creater_tool1_2/` |

---

## Migration approach

Active Tool 2 code was **copied** into `cert-expert-certification-os/apps/certification-os/`. The legacy combined app was **retained unchanged** so Tool 1 continues to run from the legacy path.

No business-logic changes beyond:
- Tool 1 type decoupling in `DocumentPreview`
- Navbar: removed `/model-creator` link (Tool 1 not in this app)
- Landing page: Tool 2–focused home
- Import/path fixes (tsconfig aliases, `lib/` copies for Turbopack)

---

## Files moved (copied to target)

### App shell — `apps/certification-os/`

| File | Notes |
|------|-------|
| `app/layout.tsx` | Root layout (metadata updated) |
| `app/page.tsx` | **New** Tool 2 landing (not legacy marketing page) |
| `app/globals.css` | Global styles |
| `app/employee-automation/page.tsx` | Thin re-export |
| `app/uploads/page.tsx` | Thin re-export |
| `app/actions/generate-employee-docs.ts` | Thin re-export shim |
| `app/api/templates/route.ts` | Roles/appointments API |
| `app/api/uploads/route.ts` | Template upload/delete |
| `app/api/uploads/folder/route.ts` | Folder create |
| `app/api/preview/route.ts` | DOCX preview TTL |
| `components/ui/*` | Shared UI primitives (incl. B2 DatePicker) |
| `components/layout/*` | Navbar (Tool 1 link removed), Footer |
| `lib/utils.ts` | `cn()` |
| `lib/uploadthing.ts` | UploadThing wrapper (copy; Turbopack cannot resolve outside app root) |
| `lib/sanitize.ts` | Filename validation (copy) |
| `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.gitignore` | App config |

### Module — `modules/03-mitarbeiterakte-tool-2/`

| Submodule | Files |
|-----------|-------|
| **employee-file** | `EmployeeAutomationPage.tsx`, `EmployeeForm.tsx`, `EmployeeTable.tsx`, `GlobalSidebar.tsx`, `index.ts`, `employee-queue-storage.ts`, `types/employee.ts`, `validations/employee-form.ts`, `utils/date.ts` |
| **employee-generator** | `generate-employee-docs.ts` |
| **document-output** | `DocxViewer.tsx`, `DocumentPreview.tsx`, `types.ts` (**new** — Tool 1 decouple) |
| **roles** | `employee-config.ts`, `admin/UploadsPage.tsx` |

### Shared (reference copy)

| File | Notes |
|------|-------|
| `shared/storage/uploadthing.ts` | Copy for future `StorageAdapter` wiring; **runtime uses `app/lib/` copy** |

---

## Files not moved (Tool 1 / excluded)

| Legacy path | Reason |
|-------------|--------|
| `app/model-creator/page.tsx` | Tool 1 — not migrated |
| `app/actions/send-model-entries.ts` | Tool 1 |
| `app/api/standard-models/route.ts` | Tool 1 |
| `components/document/DocumentForm.tsx` | Tool 1 |
| `components/document/index.ts` | Tool 1 |
| `lib/validations/model-form.ts` | Tool 1 |
| `components/Input.tsx` | Unused duplicate — ignored |

**Passive modules** (`evidence/`, `readiness-rules/`, `project-link/`): README only — no logic added.

---

## Imports changed

| Change | Purpose |
|--------|---------|
| `tsconfig.json` path aliases | Map `@/lib/types/employee`, `@/lib/employee-queue-storage`, `@/lib/utils/date`, `@/lib/validations/employee-form`, `@/lib/data/employee-config`, `@/components/employee` → module paths |
| `app/employee-automation/page.tsx` | Re-export from `employee-file/EmployeeAutomationPage` |
| `app/uploads/page.tsx` | Re-export from `roles/admin/UploadsPage` |
| `app/actions/generate-employee-docs.ts` | Re-export from `employee-generator/generate-employee-docs` |
| `document-output/DocumentPreview.tsx` | `GeneratedDocument` from `./types` instead of Tool 1 `send-model-entries` |
| `components/layout/Navbar.tsx` | Removed Tool 1 `/model-creator` nav link |
| `lib/uploadthing.ts`, `lib/sanitize.ts` | Placed under `app/lib/` (Turbopack cannot bundle `../../shared/` via alias) |

**localStorage key unchanged:** `cert-expert-tool2-employee-queue-v1`

---

## Confirmations

| Rule | Compliant |
|------|-----------|
| Tool 1 files not touched in legacy | **Yes** |
| Tool 1 files not migrated | **Yes** |
| Passive modules not implemented | **Yes** |
| B2 bugfix logic preserved (verbatim copy) | **Yes** |
| No new features | **Yes** |
| No evidence/readiness/project-link logic | **Yes** |
| No StorageAdapter / UploadThing refactor | **Yes** |
| Scope boundary violated | **No** |

---

## Post-migration build

| Check | Result |
|-------|--------|
| `npm install` (certification-os app) | **PASS** |
| `npm run build` | **PASS** (Next.js 16.1.1, 10 routes) |

Routes:

```
○ /
○ /employee-automation
○ /uploads
ƒ /api/templates
ƒ /api/uploads
ƒ /api/uploads/folder
ƒ /api/preview
```

(No `/model-creator`, no `/api/standard-models` — by design.)

---

## Post-migration B2 regression

Tested on `http://127.0.0.1:3001/employee-automation` (migrated app).

| Bug | Result | Notes |
|-----|--------|-------|
| **T2-BUG-01** Birthday copy-paste | **PASS** | Edit reopen shows `22.08.1988`; paste `15.03.1990` parses on blur |
| **T2-BUG-02** Persistence | **PASS** | localStorage seed → reload → queue + global props restored |
| **T2-BUG-03** Selection on edit | **PASS** | `selectedAppointmentDocIds: ['st-safety-guidelines']` preserved in localStorage after edit open |
| **T2-BUG-03** Full UI doc-checklist | **NOT TESTED / EVIDENCE MISSING** | No `UPLOADTHING_TOKEN`; `/api/templates` empty |
| **T2-BUG-04** Calendar stability | **PASS** | Calendar opens on edit form; screenshot captured |
| **T2-BUG-08** Select All / Deselect All UI | **NOT TESTED / EVIDENCE MISSING** | Buttons in code; no role/appointment doc lists without templates |
| **T2-BUG-08** Code present | **PASS** | `EmployeeForm.tsx` lines 597–691 |

Screenshot: `docs/02-acceptance/evidence/screenshots/B3-T2-BUG-04-calendar-post-migration.png`

---

## Open controls carried forward

| Control | Status |
|---------|--------|
| Baseline employee ZIP | **NOT TESTED / EVIDENCE MISSING** |
| EC-09 Standardpersonalakte regression comparison | **BLOCKED** until baseline ZIP exists |
| T2-BUG-03 full UI doc-checklist verification | **PENDING** — requires templates / `UPLOADTHING_TOKEN` |
| T2-BUG-08 Select All / Deselect All UI verification | **PENDING** — requires templates / roles |
| T2-BUG-02 add-via-UI without localStorage seed | **NOT TESTED** |
| `logoFile` persistence | Known risk; outside B2/B3 scope |
| Uploads page `standard-models` tab | **Runtime gap** — `/api/standard-models` not migrated (Tool 1); roles/appointments tabs depend on UploadThing token |

---

## Known risks

1. **Dual codebase** — Tool 2 now lives in certification-os app; legacy combined app still exists. Drift risk until legacy Tool 2 path is deprecated.
2. **Turbopack path limit** — `uploadthing.ts` / `sanitize.ts` duplicated in `app/lib/` and `shared/storage/`; not wired to `StorageAdapter`.
3. **UploadThing env** — Without `UPLOADTHING_TOKEN`, templates API fails; T2-BUG-03/08 UI and ZIP generation untested end-to-end.
4. **Uploads admin** — `standard-models` section calls missing API in migrated app (Tool 1 coupling documented, not fixed).
5. **Origin/port** — localStorage is per-origin; testers on `:3001` vs legacy `:3000` have separate queues.

---

## Rollback notes

| Step | Action |
|------|--------|
| Revert branch | `git checkout main` (or prior branch); delete `b3-tool2-migration` if needed |
| Remove migrated app | Delete `cert-expert-certification-os/apps/certification-os/app/`, `components/`, `lib/`, `modules/.../employee-*`, etc. (keep README scaffolds) |
| Restore runtime | Continue using legacy path `bots/legacy_tools/.../document_creater_tool_employee_file_creater_tool1_2/` — unchanged |

Pre-move legacy build PASS at SHA `b5dc35e` on branch `b3-tool2-migration`.

---

## B3 closure control

### 1. Final B3 status

| Item | Status |
|------|--------|
| B3 migration | **CLOSED WITH OPEN CONTROLS** |
| Pre-move build | **PASS** |
| Post-migration build | **PASS** |
| B2 regression after migration | **Completed** for approved scope (T2-BUG-01, 02, 03, 04, 08) |
| Tool 1 migration | **NOT PERFORMED** |
| Passive modules | **NOT IMPLEMENTED** |
| Scope violation | **NONE DETECTED** |

### 2. Accepted migration results

| Result | Status |
|--------|--------|
| Tool 2 runtime under `cert-expert-certification-os/apps/certification-os/` | **Accepted** |
| Active Tool 2 files in `modules/03-mitarbeiterakte-tool-2/` | **Accepted** |
| B2 fixes preserved | **Accepted** |
| localStorage key unchanged: `cert-expert-tool2-employee-queue-v1` | **Accepted** |
| `DocumentPreview` type decoupled from Tool 1 | **Accepted** |
| Legacy source retained | **Accepted** |

### 3. Open controls carried forward

| Control | Status |
|---------|--------|
| Baseline employee ZIP | **NOT TESTED / EVIDENCE MISSING** |
| EC-09 Standardpersonalakte regression comparison | **BLOCKED** until baseline ZIP exists |
| T2-BUG-03 full UI doc-checklist verification | **PENDING** — requires templates / `UPLOADTHING_TOKEN` |
| T2-BUG-08 Select All / Deselect All UI verification | **PENDING** — requires templates / roles |
| T2-BUG-02 add-via-UI without localStorage seed | **NOT TESTED** |
| `logoFile` persistence | Known risk |
| UploadThing / templates availability | **Unresolved** |
| Uploads `standard-models` tab/API | **Not migrated** — Tool 1 remains out of scope |

### 4. Temporary technical controls

| Control | Rule |
|---------|------|
| `uploadthing.ts` and `sanitize.ts` reference copies | Temporary B3 migration accommodations only |
| Storage architecture | **Not final** — do not treat `app/lib/` or `shared/storage/` copies as storage provider design |
| Storage provider expansion | Do **not** expand into a storage provider without a later explicit gate |
| Tool 1 API migration | Do **not** migrate Tool 1 APIs to solve template/upload issues unless explicitly approved |

### 5. Next gate recommendation

| Option | Purpose |
|--------|---------|
| **A — Template / UploadThing Evidence Retest** | Close Baseline ZIP, EC-09, T2-BUG-03 UI, T2-BUG-08 UI controls |
| **B — B4 Readiness Preparation** | Prepare next functional integration planning for Tool 2 / Mitarbeiterakte **without coding** |
| **C — Stop / Rework** | Only if post-migration regression later fails or scope violation is detected |

**Recommended: A first, then B.**

The main remaining blockers are evidence and test infrastructure, not new feature scope. Before starting any B4 planning or development, the migrated app should be tested with templates/UploadThing so EC-09 and UI controls can be closed or clearly reclassified.

**B4 is not started by this closure.**

---

## Related documents

- `B3_MIGRATION_PREPARATION.md` — pre-execution move map
- `B2_STEP_REPORT.md` — B2 closure + open controls
- `EXISTING_CODE_MAPPING.md` — legacy mapping
