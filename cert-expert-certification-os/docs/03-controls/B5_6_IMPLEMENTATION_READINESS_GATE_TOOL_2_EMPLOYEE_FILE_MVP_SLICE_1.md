# B5.6 Implementation Readiness Gate — Tool 2 Employee File MVP Slice 1

**Gate:** B5.6 — Implementation readiness assessment (not implementation)  
**Status:** **CLOSED** — gate decision recorded  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**Prerequisite commit:** `f74f58b` (B5.5 output boundary)  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Authorized next slice (if PASS):** **B5.7 only** — Employee File MVP Slice 1 workspace shell

---

## 0. Gate Decision

### **PASS FOR LIMITED IMPLEMENTATION SLICE 1 WITH CONTROLS**

| Decision | Detail |
|----------|--------|
| B5.0–B5.5 sufficient? | **Yes** — functional boundaries for object, evidence, readiness, and output are documented; gaps are explicit and deferred |
| What is authorized | **B5.7 — Employee File MVP Slice 1** (workspace shell around existing generator queue) **only** |
| What is **not** authorized | Full B5 implementation, evidence engine, readiness algorithms, persistence migration, generator refactor, storage/template changes, Tool 1 work |
| EC-09 | Must remain protected; Slice 1 failure if batch ZIP regresses |
| Human gate | Implementation starts only after explicit message: **“Start B5.7”** (or equivalent) following acceptance of this document |

**Not selected:** PASS WITH REWORK — B5 docs are complete for a minimal shell slice.  
**Not selected:** NOT READY — inventory and boundaries are sufficient for controlled Slice 1.

---

## 1. Source Basis

| Source | Role in B5.6 |
|--------|--------------|
| `B5_0_TOOL_2_FUNCTIONAL_REDESIGN_BOUNDARY.md` | Redesign scope, keep/replace/retire, slice candidates |
| `B5_1_EMPLOYEE_FILE_CURRENT_STATE_INVENTORY.md` | Current files, generator flow, no readiness today |
| `B5_2_EMPLOYEE_FILE_OBJECT_BOUNDARY.md` | Employee File vs queue; object groups |
| `B5_3_EVIDENCE_AND_REQUIRED_FIELDS_BOUNDARY.md` | Pflichtfelder, evidence catalog, statuses — **deferred implementation** |
| `B5_4_READINESS_AND_RELEASE_PREPARATION_RULES_BOUNDARY.md` | Ampel, blockers, forbidden claims — **deferred implementation** |
| `B5_5_STANDARD_EMPLOYEE_FILE_OUTPUT_BOUNDARY.md` | Output artifact rules; EC-09 protection |
| Current Tool 2 | `/employee-automation`, `EmployeeAutomationPage`, `generate-employee-docs`, `employee-queue-storage` |
| EC-09 | B4.2 baseline ZIP; `ACCEPTANCE_BASELINE.md` EC-09; C-09 HARD_CONTROLS |
| `HARD_CONTROLS.md` | C-01–C-10 for Slice 1 UI copy constraints |

---

## 2. Readiness Assessment

| Control area | Evidence from B5.0–B5.5 | Readiness result | Control required in Slice 1 |
|--------------|-------------------------|------------------|----------------------------|
| **Object boundary** | B5.2 — Employee File defined; queue is transitional | **Ready for shell** | UI terminology + summary framing only; no full object store |
| **Required fields / evidence** | B5.3 — catalogs and statuses defined | **Ready for display placeholders only** | No upload, no checklist engine, no false “complete” |
| **Readiness rules** | B5.4 — layers, blockers, forbidden claims | **Ready for static/disclaimer only** | No ampel algorithms; no green/release/DIN/cert claims |
| **Output boundary** | B5.5 — export ≠ evidence; EC-09 protected | **Ready** | Do not touch generator; ZIP must work post-slice |
| **Legacy generator protection** | B5.1, B5.5 §10 — `generate-employee-docs` + Hetzner | **Ready** | Zero changes to generator, `/api/templates`, storage libs |
| **Out-of-scope discipline** | All B5 out-of-scope sections | **Ready** | Slice 1 scope wall in §4–§5 |
| **Implementation risk** | Queue-only persistence; EC-09 regression-sensitive | **Medium** — mitigated by minimal UI-only slice | Build + manual ZIP smoke; EC-09 compare if generator touched (must not be) |

**Answer (Q1):** B5.0–B5.5 are **sufficient to authorize Slice 1 only**, not subsequent slices without new gates.

---

## 3. Recommended First Implementation Slice

### Employee File MVP Slice 1 — Workspace Shell Around Existing Generator Queue

**Definition:** Add a controlled **employee-file workspace framing layer** on `/employee-automation` while keeping the existing queue → template selection → batch ZIP flow intact.

**Why this slice first (safer than alternatives):**

| Alternative start | Why deferred |
|-------------------|--------------|
| Database / new persistence | C-10; high lock-in; B5.2 did not authorize schema |
| Evidence upload + Hetzner person keys | Storage + B5.3 implementation; high scope |
| Readiness / ampel evaluator | B5.4 algorithms not defined; risk of false green (C-01) |
| Generator refactor / preconditions | EC-09 regression risk (C-09) |
| Full employee-file data model | B5.2 functional only — implementation gate needed first |

**Slice 1 value:** Operators see **Employee File** language and a **selected-employee summary** without breaking production generator behavior. Validates UX direction before persistence or evidence work.

---

## 4. Slice 1 Allowed Scope

B5.7 **may** (minimal, reversible):

| Allowed change | Constraint |
|----------------|------------|
| **Workspace framing** | Page header/copy: “Employee File Workspace” / transitional generator notice |
| **Terminology layer** | Reframe “Employee Queue” as transitional list (e.g. “Employee files (generator queue)”) |
| **Selected employee summary** | Read-only panel when row selected or editing: name, role, dates, doc counts from existing `Employee` object |
| **Non-final status placeholders** | Static text only, e.g. “Evidence: not implemented (B5.3)” — **no computed ampel** |
| **Control notice** | Link or badge to B5 controls; “Export ≠ accepted evidence” disclaimer |
| **Small component extraction** | e.g. `EmployeeFileSummaryPanel.tsx` in `employee-file/` if it reduces risk |
| **Copy on landing/navbar** | Optional minor label toward “Employee File” if on `/employee-automation` path only |
| **Slice 1 report** | `docs/03-controls/B5_7_*_REPORT.md` after implementation |
| **Preserve generation** | `handleGenerate`, `generateEmployeeDocs` call path unchanged |
| **Preserve route** | `/employee-automation` remains (re-export may stay) |
| **Preserve localStorage** | `employee-queue-storage` behavior unchanged |

---

## 5. Slice 1 Forbidden Scope

B5.7 **must not:**

| Forbidden | Reason |
|-----------|--------|
| Replace or migrate localStorage persistence | Later persistence gate |
| Introduce database / ORM / new store | C-10, B5.2 |
| New storage architecture or Hetzner person-evidence keys | B3.5 closed; B5.3 not implemented |
| Change `lib/template-storage.ts`, `lib/hetzner-s3-client.ts` | Storage redesign |
| Refactor `generate-employee-docs.ts` | C-09 |
| Change DOCX templates in Hetzner or repo | B5.5 |
| Break EC-09 batch ZIP | Slice failure |
| Full Employee File data model / new types beyond display | B5.2 functional only |
| Evidence upload / mark workflows | B5.8+ gate |
| Readiness algorithms / final ampel | B5.4 not implemented |
| Final UI design system | Functional shell only |
| LMS / training calendar | Out of MVP |
| Project file / company file / dashboard | Passive modules |
| Tool 1 routes, actions, templates | Separate tool |
| Automatic release, DIN compliance, certification readiness claims | EC-10, C-06 |
| Touch `.env.local` or secrets | Security |
| Unrelated repo changes (`hq/`, `bots/legacy_tools/`, etc.) | Scope control |

---

## 6. EC-09 Regression Protection

**Regression boundary (must hold after B5.7):**

| Check | Requirement |
|-------|-------------|
| Batch ZIP generation | `generateEmployeeDocs` succeeds; browser download works |
| `/api/templates` | GET returns roles + appointments from Hetzner (or 503 if unconfigured — unchanged behavior) |
| Hetzner template loading | `listTemplateFiles`, `buildLatestTemplateKeyMap`, `fetchTemplateBufferByKey` path untouched |
| Template categories | `roles/`, `appointments/` used as today |
| User flow | Add employee → select role/appointments/docs → Generate & Download ZIP **still usable** |
| Baseline compare | If generator accidentally touched: re-run EC-09 method vs `docs/02-acceptance/evidence/exports/baseline-employee.zip` — **Slice 1 must not require this if generator untouched** |

**Failure rule:** If EC-09 flow breaks, **B5.7 fails** — revert or fix before close.

**Slice 1 expectation:** Generator files **not modified** → EC-09 protected by scope wall.

---

## 7. Files / Areas Allowed to Inspect

B5.7 may **read** (non-exhaustive):

| Path | Purpose |
|------|---------|
| `app/employee-automation/page.tsx` | Route entry |
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeAutomationPage.tsx` | Main orchestration |
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeForm.tsx` | Form behavior |
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeTable.tsx` | List/selection |
| `modules/03-mitarbeiterakte-tool-2/employee-file/GlobalSidebar.tsx` | Globals (read-only for Slice 1) |
| `modules/03-mitarbeiterakte-tool-2/employee-file/employee-queue-storage.ts` | Persistence contract |
| `modules/03-mitarbeiterakte-tool-2/employee-file/types/employee.ts` | Display fields |
| `app/actions/generate-employee-docs.ts` | Re-export — verify no change needed |
| `modules/03-mitarbeiterakte-tool-2/employee-generator/generate-employee-docs.ts` | Verify untouched |
| `app/api/templates/route.ts` | Verify untouched |
| `docs/03-controls/B5_*.md` | Control alignment |
| `docs/02-acceptance/ACCEPTANCE_BASELINE.md` | EC-09 reference |

---

## 8. Files / Areas Allowed to Modify in Slice 1

**Authorized modify set (cautious):**

| File | Allowed changes |
|------|-----------------|
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeAutomationPage.tsx` | Layout, workspace header, summary panel integration, disclaimers |
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeTable.tsx` | Labels, selection highlight for summary, copy only |
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeForm.tsx` | **Copy/labels only** — no schema or submit logic change unless required for summary sync (avoid if possible) |
| `modules/03-mitarbeiterakte-tool-2/employee-file/GlobalSidebar.tsx` | **Copy only** if needed |
| **New** `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeFileSummaryPanel.tsx` (or similar) | Read-only summary component |
| `modules/03-mitarbeiterakte-tool-2/employee-file/index.ts` | Export new component if added |
| `app/page.tsx` / `components/layout/Navbar.tsx` | **Optional** — minimal Employee File wording for Tool 2 link only |
| `docs/03-controls/B5_7_EMPLOYEE_FILE_MVP_SLICE_1_REPORT.md` | Post-implementation report |

**Explicitly not authorized to modify:**

- `employee-generator/generate-employee-docs.ts`
- `app/actions/generate-employee-docs.ts` (unless re-export path unchanged — prefer no touch)
- `app/api/templates/route.ts`, `app/api/uploads/**`
- `lib/template-storage.ts`, `lib/hetzner-s3-client.ts`, `lib/sanitize.ts`
- `employee-queue-storage.ts` (unless comment-only — prefer no touch)
- `types/employee.ts`, `validations/employee-form.ts` (prefer no touch)
- Tool 1: `app/model-creator/**`, `send-model-entries.ts`, `standard-models/**`

---

## 9. Required Checks for Slice 1

| # | Check | Pass criterion |
|---|-------|----------------|
| C-1 | `npm run build` | Exit 0 |
| C-2 | `/employee-automation` loads | HTTP 200; no runtime crash |
| C-3 | Queue flow | Add/edit/delete employee; reload persists (localStorage unchanged) |
| C-4 | Template loading | Roles/appointments populate from `/api/templates` |
| C-5 | ZIP generation | Generate & Download ZIP succeeds with ≥1 employee (real Hetzner env) |
| C-6 | Secrets | `.env.local` not committed or modified in commit |
| C-7 | Scope | No unrelated files in commit |
| C-8 | Tool 1 | No Tool 1 file changes |
| C-9 | Forbidden UI | No automatic release / DIN / certification / audit-ready claims |
| C-10 | Generator diff | `generate-employee-docs.ts` unchanged (git diff empty) |

---

## 10. Slice 1 Acceptance Criteria

| AC | Criterion |
|----|-----------|
| AC-1 | Employee File workspace framing visible (header and/or summary panel) |
| AC-2 | Transitional nature documented in UI (queue ≠ full file system yet) |
| AC-3 | Existing generator fully functional — add, edit, generate ZIP |
| AC-4 | No EC-09 regression (C-5, C-10 pass) |
| AC-5 | No forbidden readiness/release/certification claims (C-9) |
| AC-6 | No persistence, storage, generator, or template architecture expansion |
| AC-7 | `npm run build` passes (C-1) |
| AC-8 | Commit limited to §8 authorized files + B5.7 report |
| AC-9 | `B5_7_*_REPORT.md` documents what changed, checks run, EC-09 result |

**Rollback / regression (Q10):** If EC-09 breaks, build fails, scope creep, or forbidden UI appears — revert Slice 1 commit(s) via `git revert` before any later gate. Generator changes require EC-09 re-compare; generator must remain untouched in Slice 1.

---

## 11. Deferred to Later Slices

| Gate / slice | Topic |
|--------------|-------|
| **B5.7** | Employee File MVP Slice 1 — workspace shell (**authorized by this gate**) |
| **B5.8** | Evidence status display or implementation gate |
| **B5.9** | Required fields / checklist implementation gate |
| **B5.10** | Output history implementation gate |
| **Later** | Persistence migration (localStorage → approved store) |
| **Later** | Person-evidence upload (Hetzner keys per B5.3) |
| **Later** | Readiness evaluator / ampel (B5.4 rules) |
| **Later** | Generator preconditions / output history |
| **Later** | Overview/profile route split beyond single page |

---

## 12. Exact Cursor Instruction If Gate Passes

**Do not run this in B5.6.** Use only after **“Start B5.7”** and acceptance of this document.

```text
We continue in Cert-Expert Certification OS.
Branch: b3-tool2-migration
Gate: B5.7 — Employee File MVP Slice 1 ONLY (authorized by B5_6_IMPLEMENTATION_READINESS_GATE).

Read first:
- docs/03-controls/B5_6_IMPLEMENTATION_READINESS_GATE_TOOL_2_EMPLOYEE_FILE_MVP_SLICE_1.md
- docs/03-controls/B5_2 through B5_5 as needed

Task:
Implement minimal Employee File workspace shell on /employee-automation WITHOUT breaking EC-09 ZIP.

Allowed:
- EmployeeAutomationPage layout/framing, read-only EmployeeFileSummaryPanel
- EmployeeTable copy/selection for summary
- Static disclaimers (no ampel algorithms)
- B5_7_EMPLOYEE_FILE_MVP_SLICE_1_REPORT.md

Forbidden:
- generate-employee-docs, template-storage, api/templates, employee-queue-storage logic changes
- database, evidence upload, readiness algorithms, Tool 1, .env.local

Required checks:
- npm run build
- /employee-automation loads; queue + ZIP generation work
- git diff shows no generator/storage/template files changed

Commit only approved files. Suggested message:
feat: add employee file workspace shell slice 1 (B5.7)
```

---

## 13. B5.6 Out of Scope

- No code changes in B5.6
- No UI implementation
- No routes (beyond documenting existing `/employee-automation`)
- No data model or database
- No storage redesign
- No generator changes
- No template changes
- No Tool 1 redesign
- No full LMS
- No project/company/dashboard expansion

---

## Related documents

| Document | Relationship |
|----------|--------------|
| `B5_5_STANDARD_EMPLOYEE_FILE_OUTPUT_BOUNDARY.md` | EC-09 protection |
| `B5_1_EMPLOYEE_FILE_CURRENT_STATE_INVENTORY.md` | File map |
| `B4_2_RESIDUAL_EVIDENCE_CONTROLS_REPORT.md` | EC-09 baseline |
| `HARD_CONTROLS.md` | C-01–C-10 |
