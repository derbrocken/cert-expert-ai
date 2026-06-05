# B3 Migration Preparation — Tool 2 Legacy → Certification OS Module

**Gate:** ACCEPT — B3 PREPARATION ONLY  
**Status:** Preparation complete — **no migration executed**  
**Date:** 2026-06-05  
**Prerequisite:** B2 approved bugfix slice closed with open controls (`docs/02-acceptance/B2_STEP_REPORT.md`)

---

## Scope boundary (this document)

| Allowed in B3 preparation | **Not allowed** until separate B3 execution gate |
|---------------------------|--------------------------------------------------|
| Document move map, import risks, rollback plan | Move files |
| Carry forward B2 open controls | Change imports |
| Define B3 execution rules | Refactor |
| Readiness decision | Migrate code into `apps/certification-os/` |
| | Modify Tool 1 |
| | Implement T2-BUG-05/06/07/09/10 |
| | Implement passive modules (`evidence/`, `readiness-rules/`, `project-link/`) |
| | Final UI, data model, software architecture, storage provider, audit-readiness claims |

**B3 execution is not started by this document.**

---

## Source and target roots

| | Path |
|---|------|
| **Legacy source root** | `bots/legacy_tools/existing_tools_systems/document_creater_tool_employee_file_creater_tool1_2/` |
| **Target module root** | `cert-expert-certification-os/apps/certification-os/modules/03-mitarbeiterakte-tool-2/` |
| **Target app shell (planned)** | `cert-expert-certification-os/apps/certification-os/` |
| **Shared layer (planned)** | `cert-expert-certification-os/shared/` |

The legacy app is a **combined Next.js project** (Tool 1 + Tool 2). B3 execution must move **active Tool 2 code only** and leave Tool 1 separable.

---

## Legacy-to-target move map

Columns: **Legacy path** → **Proposed target path** | Purpose | Active/Passive | Dependency risk | Safe in B3 execution? | Touches Tool 1? | Templates / UploadThing?

### App pages and routing

| Legacy path | Proposed target path | Purpose | Active/Passive | Dependency risk | Safe in B3? | Tool 1? | UploadThing? |
|-------------|---------------------|---------|----------------|-----------------|-------------|---------|--------------|
| `app/employee-automation/page.tsx` | `apps/certification-os/app/employee-automation/page.tsx` (thin route) importing from `modules/03-mitarbeiterakte-tool-2/employee-file/` | Tool 2 main page: queue, generate ZIP, B2 localStorage persistence | **Active** | High — orchestrates employee components, server action, templates fetch | **Yes** — core B3 move; preserve B2 fixes | No | Yes — fetches `/api/templates` |
| `app/page.tsx` | `apps/certification-os/app/page.tsx` | Landing links to Tool 1 + Tool 2 | Passive shell | Medium — links both tools | **Defer or thin shell** — keep Tool 1 link pointing to legacy or passive route | **Yes** — links to model-creator | No |
| `app/layout.tsx` | `apps/certification-os/app/layout.tsx` | Root layout, fonts, globals | Passive shell | Low | **Yes** — app shell | Shared | No |
| `app/globals.css` | `apps/certification-os/app/globals.css` | Global styles | Passive shell | Low | **Yes** | Shared | No |
| `app/model-creator/page.tsx` | **KEEP IN LEGACY** → future `shared/document-templates/legacy/` | Tool 1 standard model workflow | Passive (Tool 1) | High if co-moved | **No** — do not move in B3 | **Yes** | Yes |
| `app/uploads/page.tsx` | `modules/03-mitarbeiterakte-tool-2/roles/admin/UploadsPage.tsx` + route `app/uploads/page.tsx` | Template CRUD (roles, appointments, standard models) | **Active** (Tool 2 roles admin) | High — large client; couples to UploadThing + sanitize | **Yes with care** — Tool 2 needs role/appointment admin; standard-models section is Tool 1 overlap | **Partial** — also manages standard-models | **Yes** |

### Server actions

| Legacy path | Proposed target path | Purpose | Active/Passive | Dependency risk | Safe in B3? | Tool 1? | UploadThing? |
|-------------|---------------------|---------|----------------|-----------------|-------------|---------|--------------|
| `app/actions/generate-employee-docs.ts` | `modules/03-mitarbeiterakte-tool-2/employee-generator/generate-employee-docs.ts` | DOCX+ZIP generation (`easy-template-x`, JSZip) | **Active** | **Critical** — EC-09 regression; UploadThing fetch; B2-unrelated bugs 05/09/10 | **Yes** — move as-is; no generator refactor in B3 | No | **Yes** — `listTemplateFiles`, `fetchTemplateBuffer`, `utapi` |
| `app/actions/send-model-entries.ts` | **KEEP IN LEGACY** | Tool 1 standard model ZIP | Passive (Tool 1) | High | **No** | **Yes** | **Yes** |

### API routes

| Legacy path | Proposed target path | Purpose | Active/Passive | Dependency risk | Safe in B3? | Tool 1? | UploadThing? |
|-------------|---------------------|---------|----------------|-----------------|-------------|---------|--------------|
| `app/api/templates/route.ts` | `apps/certification-os/app/api/templates/route.ts` or `modules/03-mitarbeiterakte-tool-2/roles/api/templates/route.ts` | List role + appointment folders/docs from UploadThing | **Active** | High — blocks T2-BUG-03/08 UI without token | **Yes** — required for Tool 2 | No | **Yes** |
| `app/api/uploads/route.ts` | `apps/certification-os/app/api/uploads/route.ts` | Upload/delete DOCX templates | **Active** | High — shared with Tool 1 standard-models category | **Yes with care** — filter Tool 2 categories only at UI layer | **Partial** | **Yes** |
| `app/api/uploads/folder/route.ts` | `apps/certification-os/app/api/uploads/folder/route.ts` | Create template folder | **Active** | Medium | **Yes** | **Partial** | **Yes** |
| `app/api/preview/route.ts` | `modules/03-mitarbeiterakte-tool-2/document-output/api/preview/route.ts` | In-memory DOCX preview (5 min TTL) | **Active** | Medium — ephemeral Map | **Yes** | No | No |
| `app/api/standard-models/route.ts` | **KEEP IN LEGACY** | List Tool 1 standard-model templates | Passive (Tool 1) | Medium | **No** | **Yes** | **Yes** |

### Employee components (required)

| Legacy path | Proposed target path | Purpose | Active/Passive | Dependency risk | Safe in B3? | Tool 1? | UploadThing? |
|-------------|---------------------|---------|----------------|-----------------|-------------|---------|--------------|
| `components/employee/EmployeeForm.tsx` | `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeForm.tsx` | Add/edit employee, role, appointments, doc selection; B2 fixes 03/08 | **Active** | High — `useEffect` guards, Select All/Deselect All | **Yes** — preserve B2 logic verbatim | No | Yes — loads roles via parent fetch |
| `components/employee/EmployeeTable.tsx` | `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeTable.tsx` | Queue, search, edit/delete | **Active** | Low | **Yes** | No | No |
| `components/employee/GlobalSidebar.tsx` | `modules/03-mitarbeiterakte-tool-2/employee-file/GlobalSidebar.tsx` | Company globals, logo, doc metadata | **Active** | Medium — `logoFile` not persisted (open control) | **Yes** | No | No |
| `components/employee/index.ts` | `modules/03-mitarbeiterakte-tool-2/employee-file/index.ts` | Barrel export | **Active** | Low | **Yes** | No | No |

### UI components (Tool 2 dependencies)

| Legacy path | Proposed target path | Purpose | Active/Passive | Dependency risk | Safe in B3? | Tool 1? | UploadThing? |
|-------------|---------------------|---------|----------------|-----------------|-------------|---------|--------------|
| `components/ui/DatePicker.tsx` | `apps/certification-os/components/ui/DatePicker.tsx` or `shared/ui/DatePicker.tsx` | Birthday/start-date; B2 fixes 01/04 | **Active** | Medium — used by EmployeeForm + GlobalSidebar | **Yes** — preserve B2 fixes | Shared UI | No |
| `components/ui/MultiSelect.tsx` | `apps/certification-os/components/ui/MultiSelect.tsx` | Appointment multi-select | **Active** | Low | **Yes** | Shared UI | No |
| `components/ui/Select.tsx` | `apps/certification-os/components/ui/Select.tsx` | Role select | **Active** | Low | **Yes** | Shared UI | No |
| `components/ui/Input.tsx` | `apps/certification-os/components/ui/Input.tsx` | Form input | **Active** | Low | **Yes** | Shared UI | No |
| `components/ui/Button.tsx` | `apps/certification-os/components/ui/Button.tsx` | Buttons | **Active** | Low | **Yes** | Shared UI | No |
| `components/ui/Card.tsx` | `apps/certification-os/components/ui/Card.tsx` | Cards | **Active** | Low | **Yes** | Shared UI | No |
| `components/ui/Badge.tsx` | `apps/certification-os/components/ui/Badge.tsx` | Badges | **Active** | Low | **Yes** | Shared UI | No |
| `components/ui/FormField.tsx` | `apps/certification-os/components/ui/FormField.tsx` | Form field wrapper | **Active** | Low | **Yes** | Shared UI | No |
| `components/ui/FileDropzone.tsx` | `apps/certification-os/components/ui/FileDropzone.tsx` | Logo upload | **Active** | Low | **Yes** | Shared UI | No |
| `components/ui/Toast.tsx` | `apps/certification-os/components/ui/Toast.tsx` | Notifications | **Active** | Low | **Yes** | Shared UI | No |
| `components/ui/CEBadge.tsx` | `apps/certification-os/components/ui/CEBadge.tsx` | Cert-Expert branding | Passive chrome | Low | **Yes** | Shared UI | No |
| `components/ui/index.ts` | `apps/certification-os/components/ui/index.ts` | Barrel | **Active** | Medium — export paths | **Yes** | Shared UI | No |
| `components/Input.tsx` | — | Legacy duplicate of `ui/Input.tsx` | Passive | Low — verify unused | **No — delete or ignore** | Unknown | No |

### Layout chrome (shared risk)

| Legacy path | Proposed target path | Purpose | Active/Passive | Dependency risk | Safe in B3? | Tool 1? | UploadThing? |
|-------------|---------------------|---------|----------------|-----------------|-------------|---------|--------------|
| `components/layout/Navbar.tsx` | `apps/certification-os/components/layout/Navbar.tsx` | Nav links to Dashboard, Doc Gen, Employee Gen, Uploads | Passive shell | Medium — links to Tool 1 routes | **Yes** — update links only | **Yes** | No |
| `components/layout/Footer.tsx` | `apps/certification-os/components/layout/Footer.tsx` | Footer | Passive shell | Low | **Yes** | Shared | No |
| `components/layout/index.ts` | `apps/certification-os/components/layout/index.ts` | Barrel | Passive shell | Low | **Yes** | Shared | No |

### Document output

| Legacy path | Proposed target path | Purpose | Active/Passive | Dependency risk | Safe in B3? | Tool 1? | UploadThing? |
|-------------|---------------------|---------|----------------|-----------------|-------------|---------|--------------|
| `components/DocxViewer.tsx` | `modules/03-mitarbeiterakte-tool-2/document-output/DocxViewer.tsx` | Client DOCX render | **Active** | Low | **Yes** | No | No |
| `components/document/DocumentPreview.tsx` | `modules/03-mitarbeiterakte-tool-2/document-output/DocumentPreview.tsx` | DOCX preview viewer | **Active** | Medium — imports `GeneratedDocument` type from Tool 1 action | **Yes with import fix** — decouple type from `send-model-entries` | **Coupling** | No |

### Tool 1 document components (do not move)

| Legacy path | Proposed target path | Purpose | Active/Passive | Dependency risk | Safe in B3? | Tool 1? | UploadThing? |
|-------------|---------------------|---------|----------------|-----------------|-------------|---------|--------------|
| `components/document/DocumentForm.tsx` | **KEEP IN LEGACY** | Tool 1 metadata + folder selection | Passive (Tool 1) | High | **No** | **Yes** | Yes |
| `components/document/index.ts` | **KEEP IN LEGACY** | Tool 1 barrel | Passive (Tool 1) | Low | **No** | **Yes** | No |

### Lib — employee / B2 fixes (required)

| Legacy path | Proposed target path | Purpose | Active/Passive | Dependency risk | Safe in B3? | Tool 1? | UploadThing? |
|-------------|---------------------|---------|----------------|-----------------|-------------|---------|--------------|
| `lib/employee-queue-storage.ts` | `modules/03-mitarbeiterakte-tool-2/employee-file/employee-queue-storage.ts` | B2 localStorage persistence (`cert-expert-tool2-employee-queue-v1`) | **Active** | Medium — key name must survive move | **Yes** — move verbatim | No | No |
| `lib/utils/date.ts` | `modules/03-mitarbeiterakte-tool-2/employee-file/utils/date.ts` | B2 date parse/format (`parseDateInput`, etc.) | **Active** | Low | **Yes** | No | No |
| `lib/types/employee.ts` | `modules/03-mitarbeiterakte-tool-2/employee-file/types/employee.ts` | Employee, Role, Appointment, GlobalProperties | **Active** | Medium — future schema extension deferred | **Yes** | No | No |
| `lib/validations/employee-form.ts` | `modules/03-mitarbeiterakte-tool-2/employee-file/validations/employee-form.ts` | Zod schema | **Active** | Low | **Yes** | No | No |
| `lib/data/employee-config.ts` | `modules/03-mitarbeiterakte-tool-2/roles/employee-config.ts` | Static demo ROLES + APPOINTMENTS fallback | **Active** | Medium — demo data; API merge at runtime | **Yes** — move as-is; no SMA replacement in B3 | No | No (fallback when API empty) |

### Lib — shared / storage / UploadThing

| Legacy path | Proposed target path | Purpose | Active/Passive | Dependency risk | Safe in B3? | Tool 1? | UploadThing? |
|-------------|---------------------|---------|----------------|-----------------|-------------|---------|--------------|
| `lib/uploadthing.ts` | `shared/storage/uploadthing-legacy.ts` (interim) | UploadThing SDK wrapper (`utapi`, `listTemplateFiles`, etc.) | **Active** | **Critical** — env `UPLOADTHING_TOKEN`; shared by Tool 1 + Tool 2 | **Yes** — move as-is; **no StorageAdapter refactor in B3** | **Yes** | **Yes** |
| `lib/sanitize.ts` | `shared/storage/sanitize.ts` | Filename/folder validation | **Active** | Low | **Yes** | Shared | No |
| `lib/utils.ts` | `shared/utils/cn.ts` or `apps/certification-os/lib/utils.ts` | `cn()` utility | **Active** | Low — used everywhere | **Yes** | Shared | No |
| `lib/validations/model-form.ts` | **KEEP IN LEGACY** | Tool 1 form schema | Passive (Tool 1) | Low | **No** | **Yes** | No |

### Passive module placeholders (README only — no code move)

| Scaffold path | Status in B3 |
|---------------|--------------|
| `modules/03-mitarbeiterakte-tool-2/evidence/` | **Passive** — README only; no logic |
| `modules/03-mitarbeiterakte-tool-2/readiness-rules/` | **Passive** — README only; no logic |
| `modules/03-mitarbeiterakte-tool-2/project-link/` | **Passive** — README only; no logic |
| `shared/storage/storage-adapter.ts` | **Passive** — throwing stub; do not wire in B3 |

### Project config (app shell)

| Legacy path | Proposed target path | Purpose | Active/Passive | Dependency risk | Safe in B3? | Tool 1? | UploadThing? |
|-------------|---------------------|---------|----------------|-----------------|-------------|---------|--------------|
| `package.json` | `apps/certification-os/package.json` | Dependencies (Next 16, uploadthing, easy-template-x, etc.) | App shell | High — monorepo/workspace setup | **Yes** — new app package; Tool 2 deps only where possible | Partial | Yes (uploadthing pkg) |
| `next.config.ts` | `apps/certification-os/next.config.ts` | Next config | App shell | Low | **Yes** | Shared | No |
| `tsconfig.json` | `apps/certification-os/tsconfig.json` | Path aliases | App shell | **Critical** — `@/*` remap | **Yes** — must redefine paths for module imports | Shared | No |
| `postcss.config.mjs`, `eslint.config.mjs` | `apps/certification-os/` | Build tooling | App shell | Low | **Yes** | Shared | No |

---

## Import risk list

### Relative and alias imports likely to break

| Risk | Legacy pattern | Break trigger | Mitigation in B3 execution |
|------|----------------|---------------|------------------------------|
| `@/*` root alias | `@/components/employee`, `@/lib/types/employee`, `@/app/actions/...` | Files split across `modules/`, `app/`, `shared/` | Redefine `tsconfig` paths: `@/modules/*`, `@/shared/*`, or use relative imports within module; **one coordinated pass** |
| Deep component imports | `@/components/ui/Toast` (direct file) vs `@/components/ui` (barrel) | Barrel path change | Preserve barrel exports; grep all `@/components` after move |
| Cross-module type import | `DocumentPreview` imports `GeneratedDocument` from `@/app/actions/send-model-entries` | Tool 1 action stays in legacy | Extract shared type to `document-output/types.ts` — **minimal type-only decouple, not refactor** |
| Server action import | `employee-automation/page.tsx` → `@/app/actions/generate-employee-docs` | Action moves to module folder | Re-export from `app/actions/` shim or update import to module path |
| Date helper path | `DatePicker` → `@/lib/utils/date` | File moves to `employee-file/utils/date` | Shared UI may import from module — consider `shared/utils/date.ts` copy or path alias |

### App router path risks

| Route | Risk | Notes |
|-------|------|-------|
| `/employee-automation` | **High** | Must remain functional after move; primary B2 regression surface |
| `/api/templates` | **High** | EmployeeForm depends on roles/appointments JSON |
| `/api/uploads`, `/api/uploads/folder` | **High** | Template admin; env token required |
| `/api/preview` | Medium | Preview TTL Map is in-process only |
| `/model-creator` | **Tool 1** | Do not migrate; legacy link or 404 until split |
| `/api/standard-models` | **Tool 1** | Stay in legacy |

### Next.js route and server action risks

| Risk | Detail |
|------|--------|
| `"use server"` action location | `generate-employee-docs.ts` must remain invocable from client page; Next.js 16 requires actions under `app/` or configured path |
| `"use client"` boundary | `EmployeeForm`, `DatePicker`, page — client boundaries must not import server-only modules |
| Static generation | Routes currently static (`○` in build); moving pages should preserve SSG compatibility |
| Turbopack / path resolution | Re-run `npm run build` after every import path change |

### Shared component risks

| Component | Shared with Tool 1? | Risk |
|-----------|---------------------|------|
| `components/ui/*` | Yes (model-creator, uploads) | Breaking UI breaks both tools if Tool 1 co-located |
| `components/layout/*` | Yes | Nav links must not break Tool 2-only deployment |
| `lib/uploadthing.ts` | Yes | Token/env must be present in new app `.env` |
| `lib/utils.ts` (`cn`) | Yes | Low risk |

### Template path risks

| Risk | Detail |
|------|--------|
| UploadThing `customId` convention | `roles/{folder}/{file}/{timestamp}` and `appointments/...` — must not change in B3 |
| Static fallback `employee-config.ts` | Used when `/api/templates` fails; demo IDs (`software-engineer`, `safety-training`) must match stored employee records |
| Template admin `app/uploads/page.tsx` | Manages three categories including `standard-models` (Tool 1) — UI scope bleed |

### UploadThing / API dependency risks

| Dependency | Env / API | Impact if missing |
|------------|-----------|-------------------|
| `UPLOADTHING_TOKEN` | `.env` | `/api/templates` fails; T2-BUG-03/08 UI blocked; ZIP generation fails |
| `lib/uploadthing.ts` → `utapi`, `listTemplateFiles`, `fetchTemplateBuffer` | UploadThing API | `generate-employee-docs` returns error |
| `easy-template-x`, `jszip`, `image-size` | npm packages | Build/runtime failure if not in new `package.json` |

### localStorage persistence path risks

| Risk | Detail |
|------|--------|
| Storage key | `cert-expert-tool2-employee-queue-v1` — **must not rename** in B3 or existing saved queues break |
| Hydration timing | `queueHydrated` gate in page — preserve B2 mount logic |
| `logoFile` | Not in localStorage (open control) — move must not accidentally drop sidebar state |
| Origin change | If dev URL/port changes, localStorage is per-origin — document for testers |

### Tool 1 coupling risks

| Coupling point | Severity | B3 rule |
|----------------|----------|---------|
| Same Next.js process | High | Tool 1 routes stay in legacy OR passive legacy mount — not in `03-mitarbeiterakte-tool-2/` |
| `lib/uploadthing.ts` shared | High | Move to `shared/storage/`; Tool 1 legacy imports legacy copy until split |
| `DocumentPreview` → `send-model-entries` type | Medium | Decouple type only |
| `app/uploads` standard-models section | Medium | Do not expand; Tool 2 roles/appointments only in acceptance tests |
| `components/document/*` | High | Do not move |

---

## Open controls carried forward from B2

These remain **open** during B3 preparation and must be tracked through B3 execution:

| Control | Status |
|---------|--------|
| Baseline employee ZIP | **NOT TESTED / EVIDENCE MISSING** |
| EC-09 Standardpersonalakte regression comparison | **BLOCKED** until baseline ZIP exists |
| T2-BUG-03 full UI doc-checklist verification | **PENDING** — requires templates / `UPLOADTHING_TOKEN` |
| T2-BUG-08 Select All / Deselect All UI verification | **PENDING** — requires templates / roles |
| T2-BUG-02 add-via-UI without localStorage seed | **NOT TESTED** |
| `logoFile` persistence | Known risk; **not part of B2 scope** |

**Implication for B3:** Migration may proceed with these controls open, but **B3 closure requires B2 fixed behaviors still pass after move** — not full EC-09 or template UI closure.

---

## B3 execution rules

When a separate **B3 EXECUTION** gate is approved:

1. **Move only active Tool 2 code** per move map; Tool 1 files remain in legacy.
2. **Keep passive modules README/scaffold only** — no logic in `evidence/`, `readiness-rules/`, `project-link/`.
3. **Preserve B2 bugfixes verbatim** — especially `employee-queue-storage.ts`, `DatePicker.tsx`, `EmployeeForm.tsx` selection guards and Select All/Deselect All.
4. **Keep Tool 1 separate** — no edits to Tool 1 files; no migration of `model-creator`, `send-model-entries`, `standard-models` API, `DocumentForm`.
5. **No new features** — physical move + import/path fixes only.
6. **No evidence/readiness/project-link logic.**
7. **Do not solve UploadThing broadly** — move `lib/uploadthing.ts` as-is; do not implement `StorageAdapter` unless explicitly approved.
8. **Do not implement T2-BUG-05/06/07/09/10.**
9. **Run `npm run build`** after migration; **no partial migration accepted without passing build.**
10. **Re-run approved B2 regression checks** after migration:
    - T2-BUG-01 birthday paste + persist
    - T2-BUG-02 localStorage reload + edit reopen
    - T2-BUG-03 localStorage doc-selection preservation
    - T2-BUG-04 calendar stability (screenshot)
    - T2-BUG-08 code present; UI test when templates available
11. **No B3 closure** unless B2 fixed behaviors still pass after move.
12. **No audit-readiness or freigabe claims.**

---

## Rollback plan

### Before any file move

| Step | Requirement |
|------|-------------|
| 1 | Create dedicated git branch (e.g. `b3-tool2-migration`) from known-good B2 state |
| 2 | Tag or record commit SHA of last passing B2 build |
| 3 | Document `npm run build` PASS on legacy path pre-move |

### Files to restore if migration breaks

Restore entire legacy tree from branch/tag:

```
bots/legacy_tools/existing_tools_systems/document_creater_tool_employee_file_creater_tool1_2/
```

Priority files if selective restore needed:

| File | Reason |
|------|--------|
| `app/employee-automation/page.tsx` | B2 persistence orchestration |
| `components/employee/EmployeeForm.tsx` | B2 fixes 03, 08 |
| `components/ui/DatePicker.tsx` | B2 fixes 01, 04 |
| `lib/employee-queue-storage.ts` | B2 fix 02 |
| `lib/utils/date.ts` | B2 fix 01 |
| `app/actions/generate-employee-docs.ts` | Generator pipeline |
| `lib/uploadthing.ts` | Template fetch |
| `app/api/templates/route.ts` | Roles/appointments API |
| `tsconfig.json`, `package.json`, `next.config.ts` | Build recovery |

If scaffold moves are partial, delete or revert:

```
cert-expert-certification-os/apps/certification-os/
```

(only directories created during failed B3 execution — module READMEs from Phase 0 remain).

### Rollback acceptance criteria

| Rule | Detail |
|------|--------|
| No partial migration without build | If build fails post-move, **revert entire B3 execution commit**, not piecemeal fixes |
| B2 behaviors must pass for B3 closure | Rollback required if post-move B2 regression fails and cannot be fixed with import-only patches |
| Legacy remains runnable | Legacy path must stay intact until B3 execution explicitly cuts over |

---

## B3 execution readiness decision

| Option | Assessment |
|--------|------------|
| **A) Ready to open B3 execution with controls** | **Selected** — move map complete, import risks documented, rollback defined, B2 closed; open controls are explicit and do not block execution gate |
| **B) Rework B3 preparation** | Not needed — unless target path convention changes (e.g. monorepo tool choice) |
| **C) Stop — scope boundary violated** | **No** — preparation only; no code moved |

### Recommended next gate

**Open B3 EXECUTION** when approved, with open B2 controls carried forward:

1. Create branch + pre-move build checkpoint.
2. Stand up `apps/certification-os/` Next.js shell.
3. Move Tool 2 files per map (Tool 1 stays in legacy).
4. Fix imports only — no refactor.
5. `npm run build` → B2 regression suite.

Optionally run **Template/UploadThing evidence retest** in parallel to close baseline ZIP and T2-BUG-03/08 UI controls before or after B3 execution — does not block B3 execution gate.

---

## Related documents

| Document | Purpose |
|----------|---------|
| `docs/02-acceptance/B2_STEP_REPORT.md` | B2 closure + open controls |
| `docs/01-tool-2-handover/EXISTING_CODE_MAPPING.md` | Full legacy mapping + bug table |
| `docs/01-tool-2-handover/MIGRATION_PROPOSAL.md` | Phase B1–B8 overview |
| `docs/03-controls/HARD_CONTROLS.md` | C-01–C-10 boundaries |
| `apps/certification-os/modules/03-mitarbeiterakte-tool-2/README.md` | Module scaffold classification |

---

## Confirmation (B3 preparation step)

| Check | Status |
|-------|--------|
| B3 preparation document created | **Yes** — this file |
| Code moved | **No** |
| Imports changed | **No** |
| Tool 1 touched | **No** |
| B3 execution started | **No** |
| Scope boundary violated | **No** |
