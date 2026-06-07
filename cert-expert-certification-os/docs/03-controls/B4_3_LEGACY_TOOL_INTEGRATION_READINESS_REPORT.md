# B4.3 — Legacy Tool Integration Readiness / Tool 1 Upload Manager Assessment

**Gate:** B4.3 — Assessment only (no implementation)  
**Status:** **CLOSED** — assessment complete  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Prerequisites:** B2, B3, B3.5, B4.1, B4.2 closed

---

## 1. Objective

Before the Tool 2 Mitarbeiterakte functional build (B5), assess what is required to make the **legacy Tool 1 / document-upload side** minimally functional inside the Certification OS app — without a full Tool 1 redesign or migration.

**B4.3 scope:** Read-only inspection and boundary definition. **No application code was modified.**

---

## 2. Executive summary

| Finding | Result |
|---------|--------|
| Tool 1 in migrated Certification OS app | **Absent** — no routes, actions, or UI |
| Tool 1 in legacy repo | **Present and complete** — frozen at legacy path |
| `/api/standard-models` in migrated app | **Missing** — sole blocker for Upload Manager Standard Models tab |
| Upload/storage backend for `standard-models/` | **Already Hetzner-ready** — category in `template-storage`, POST/DELETE APIs accept it |
| Tool 1 Model Creator (`/model-creator`) | **Not migrated** — requires separate slice beyond upload admin |
| Required Tool 1 source missing? | **No** — legacy code is in-repo |

**Verdict:** Minimal Tool 1 **upload/list admin** restoration is **low effort** (one list API route). Minimal Tool 1 **document generation** restoration is **medium effort** (migrate `send-model-entries` from UploadThing URLs to Hetzner `GetObject`, plus page/components).

---

## 3. Current Tool 1 presence / absence

### 3.1 Migrated Certification OS app (`cert-expert-certification-os/apps/certification-os/`)

| Artifact | Present? | Notes |
|----------|----------|-------|
| `app/model-creator/page.tsx` | **No** | No Tool 1 workflow route |
| `app/actions/send-model-entries.ts` | **No** | Tool 1 ZIP generator not migrated |
| `app/api/standard-models/route.ts` | **No** | List endpoint missing |
| `components/document/DocumentForm.tsx` | **No** | Tool 1 form not migrated |
| `lib/validations/model-form.ts` | **No** | Tool 1 Zod schema not migrated |
| `app/api/uploads/route.ts` | **Yes** | Accepts `standard-models` category |
| `app/api/uploads/folder/route.ts` | **Yes** | Accepts `standard-models` category |
| `lib/template-storage.ts` | **Yes** | `VALID_CATEGORIES` includes `standard-models` |
| `roles/admin/UploadsPage.tsx` | **Yes** | Full Standard Models UI (degraded when API 404) |
| `app/page.tsx` / `Navbar.tsx` | **Yes** | Tool 2 + Upload Manager only; explicit legacy Tool 1 note |
| UploadThing runtime | **No** | Fully removed; Hetzner only |

### 3.2 Legacy combined app (frozen Tool 1 + Tool 2)

**Root:** `bots/legacy_tools/existing_tools_systems/document_creater_tool_employee_file_creater_tool1_2/`

| Artifact | Path | Purpose |
|----------|------|---------|
| Model Creator page | `app/model-creator/page.tsx` | Tool 1 UI workflow |
| Server action | `app/actions/send-model-entries.ts` | Standard model DOCX + ZIP generation |
| List API | `app/api/standard-models/route.ts` | `GET` folders under `standard-models/` |
| Form component | `components/document/DocumentForm.tsx` | Folder selection + metadata + generate |
| Validation | `lib/validations/model-form.ts` | Zod schema for Tool 1 form |
| Shared uploads | `app/api/uploads/route.ts`, `app/api/uploads/folder/route.ts` | Same 3-category CRUD (UploadThing) |
| Storage lib | `lib/uploadthing.ts` | UploadThing SDK wrapper |
| Upload admin UI | `app/uploads/page.tsx` | Original combined Upload Manager |
| Documentation | `DOCUMENTATION.md` | Full workflow + API reference |

### 3.3 Passive scaffold (no runtime)

| Location | Status |
|----------|--------|
| `cert-expert-certification-os/shared/document-templates/` | README only — Tool 1 explicitly not placed here |
| `cert-expert-certification-os/shared/storage/uploadthing.ts` | Type stub / legacy shape reference only |

---

## 4. Legacy Tool 1 code inventory (authoritative list)

Files that constitute **Tool 1-only** functionality (per `EXISTING_CODE_MAPPING.md` and B3 gate decisions):

| # | Legacy path | Role |
|---|-------------|------|
| 1 | `app/model-creator/page.tsx` | Tool 1 landing workflow |
| 2 | `app/actions/send-model-entries.ts` | Generate standard-model ZIP |
| 3 | `app/api/standard-models/route.ts` | List standard-model template folders |
| 4 | `components/document/DocumentForm.tsx` | Folder picker + company metadata form |
| 5 | `components/document/index.ts` | Barrel export |
| 6 | `lib/validations/model-form.ts` | Form validation schema |
| 7 | `app/page.tsx` (partial) | Link to `/model-creator` |
| 8 | `components/layout/Navbar.tsx` (partial) | Link to `/model-creator` |

**Shared with Tool 2 (already migrated or duplicated):**

| Legacy path | Migrated equivalent | Tool 1 coupling |
|-------------|---------------------|-----------------|
| `app/uploads/page.tsx` | `modules/.../roles/admin/UploadsPage.tsx` | `standard-models` tab |
| `app/api/uploads/*` | `app/api/uploads/*` | `standard-models` category |
| `app/api/preview/route.ts` | `app/api/preview/route.ts` | Used by both preview flows |
| `components/document/DocumentPreview.tsx` | `document-output/DocumentPreview.tsx` | Type decoupled in B3 |

---

## 5. `/api/standard-models` dependency map

### 5.1 Callers

| Consumer | Location | Behavior when 404 |
|----------|----------|-------------------|
| **Upload Manager** | `modules/03-mitarbeiterakte-tool-2/roles/admin/UploadsPage.tsx` | `standardModelsApiAvailable = false`; Standard Models tab empty; "New Model" disabled; Tool 2 tabs unaffected (B4.1 fix) |
| **Model Creator** | Legacy `components/document/DocumentForm.tsx` | Folder dropdown empty; generation blocked |
| **Legacy Upload Manager** | Legacy `app/uploads/page.tsx` | Combined fetch fails (pre-B4.1 pattern) |
| **Verification script** | `tmp-upload-templates/b4-1-upload-admin-test.mjs` | Expects 404 in migrated app |

### 5.2 Not dependent on `/api/standard-models`

| Consumer | Uses instead |
|----------|--------------|
| Tool 2 employee generator | `/api/templates` (roles + appointments only) + Hetzner `GetObject` |
| `generate-employee-docs.ts` | `listTemplateFiles()` filtered to `roles/` and `appointments/` |
| `GET /api/templates` | Explicitly excludes `standard-models` category |
| Tool 2 employee form | `/api/templates` for role/appointment dropdowns |

### 5.3 Legacy route implementation (reference for B4.4)

```text
GET /api/standard-models
  → listTemplateFiles()
  → parseCustomId() filter category === "standard-models"
  → group by folderName, skip .folder placeholders, .docx only
  → JSON { folders: FolderWithDocs[] }
```

Legacy uses `@/lib/uploadthing`; migrated equivalent would use `@/lib/template-storage` (same `listTemplateFiles` / `parseCustomId` API shape).

---

## 6. Upload Manager dependency map

### 6.1 Migrated Upload Manager (`/uploads`)

| Section | List source | Create folder | Upload file | Delete | Current status |
|---------|-------------|---------------|-------------|--------|----------------|
| **Roles** | `GET /api/templates` | `POST /api/uploads/folder` | `POST /api/uploads` | `DELETE /api/uploads` | **Working** (B4.1) |
| **Appointments** | `GET /api/templates` | same | same | same | **Working** (B4.1) |
| **Standard Models** | `GET /api/standard-models` | `POST /api/uploads/folder` * | `POST /api/uploads` * | `DELETE /api/uploads` * | **UI blocked** — list API missing |

\* Backend routes accept `category: "standard-models"` today, but the UI disables create/upload when `standardModelsApiAvailable === false`.

### 6.2 UI gating logic (UploadsPage.tsx)

| State | Effect |
|-------|--------|
| `standardModelsApiAvailable === true` | Standard Models tab fully interactive |
| `standardModelsApiAvailable === false` | Empty state message; "New Model" button `disabled` |
| `/api/templates` failure | Toast error; roles/appointments empty |
| `/api/standard-models` failure | Silent degradation; Tool 2 unaffected |

### 6.3 Structural readiness for Tool 1 standard model uploads

| Capability | Ready? | Evidence |
|------------|--------|----------|
| Three-tab UI layout | **Yes** | Roles / Appointments / Standard Models sections present |
| Category type union | **Yes** | `"roles" \| "appointments" \| "standard-models"` |
| Hetzner key format | **Yes** | `standard-models/{folder}/{file}.docx/{timestamp}` |
| POST upload with validation | **Yes** | DOCX magic bytes, sanitize, dedupe by prefix |
| Folder placeholder creation | **Yes** | `.folder` marker objects |
| List/group for UI | **No** | Missing `GET /api/standard-models` |

**Conclusion:** Upload Manager has **sufficient structure** for Tool 1 standard model admin. The **only missing runtime piece** for minimal upload/list behavior is the list API route.

---

## 7. Minimum required API/routes/storage for Tool 1 upload/list

### 7.1 Minimal restoration (upload admin only)

| # | Requirement | Exists today? | B4.4 action |
|---|-------------|---------------|-------------|
| 1 | `GET /api/standard-models` | **No** | Add route — adapt legacy logic to `template-storage` |
| 2 | `POST /api/uploads` (`standard-models`) | **Yes** | None |
| 3 | `POST /api/uploads/folder` (`standard-models`) | **Yes** | None |
| 4 | `DELETE /api/uploads` (`standard-models`) | **Yes** | None |
| 5 | Hetzner env configured | **Yes** (B3.5) | None — reuse existing bucket |
| 6 | Real DOCX templates in bucket | **Unknown without live list** | Use existing admin upload; no fake templates |

**Estimated implementation surface (B4.4 minimal):** ~1 new route file (~50 lines), mirror of legacy `standard-models/route.ts` with Hetzner import swap. No storage architecture change.

### 7.2 Minimum for Tool 1 document generation (NOT upload-admin minimal)

Additional requirements beyond upload/list:

| # | Requirement | Exists in migrated app? |
|---|-------------|-------------------------|
| 1 | `app/model-creator/page.tsx` route | **No** |
| 2 | `send-model-entries.ts` server action | **No** |
| 3 | `DocumentForm.tsx` + `model-form.ts` | **No** |
| 4 | Hetzner fetch in generator | **No** — legacy uses `utapi.getFileUrls()` + CDN fetch |
| 5 | `GET /api/standard-models` | **No** (shared with upload admin) |
| 6 | `POST /api/preview` | **Yes** — in-memory preview (shared) |
| 7 | Nav/home link to Model Creator | **No** |

**Generator migration pattern (reference):** Tool 2 `generate-employee-docs.ts` already demonstrates the Hetzner pattern:

```text
listTemplateFiles() → buildLatestTemplateKeyMap() → fetchTemplateBufferByKey()
```

Legacy `send-model-entries.ts` must drop `utapi.getFileUrls` and adopt the same pattern for `standard-models/` keys.

---

## 8. Hetzner S3 reuse safety assessment

| Check | Result |
|-------|--------|
| `standard-models` in `VALID_CATEGORIES` | **Yes** — `lib/template-storage.ts` |
| Key format compatible with legacy | **Yes** — `category/folder/file.docx/timestamp` |
| `parseCustomId` handles 3- and 4-segment keys | **Yes** |
| Same bucket as Tool 2 templates | **Yes** — single bucket, prefix isolation by category |
| Upload validation (DOCX magic bytes) | **Yes** — shared `/api/uploads` |
| Generator server-side fetch | **Proven for Tool 2** — safe to extend to `standard-models/` |
| UploadThing dependency in migrated app | **None** — no dual-write risk |
| Cross-category delete risk | **Low** — deletes scoped by `category/folderName/` prefix |

**Risks:**

| Risk | Severity | Control |
|------|----------|---------|
| Accidental delete across categories | Low | API requires explicit `category` param; prefix-scoped |
| No `standard-models/` objects in bucket yet | Medium | Empty list is valid; upload via admin once API exists |
| Legacy Tool 1 still on UploadThing if run separately | Medium | Operational — two storage backends if legacy app deployed alongside COS; not a code defect |
| Bucket credentials in `.env.local` | N/A | Not printed; gitignored |

**Verdict:** Tool 1 standard model upload/list **can safely reuse** the existing Hetzner storage layer. No new storage architecture required.

---

## 9. Minimal restoration vs later Tool 1 redesign

### 9.1 Proposed B4.4 — Minimal Tool 1 Upload/Admin Restoration

**Goal:** Enable Standard Models tab in Certification OS Upload Manager (list, create folder, upload, delete) using Hetzner.

| In scope (B4.4) | Out of scope (B4.4) |
|-----------------|---------------------|
| `GET /api/standard-models` route (Hetzner) | `app/model-creator` page |
| Enable existing UploadsPage Standard Models UI | `send-model-entries` migration |
| Acceptance: list + upload real DOCX to `standard-models/` | Tool 1 ZIP generation workflow |
| `npm run build` PASS | Navbar/home Model Creator link |
| `B4_4_*_REPORT.md` + screenshot evidence | Full `shared/document-templates` module |
| | Fake templates or stub folders |

**Acceptance criteria (draft):**

| AC | Criterion |
|----|-----------|
| AC-1 | `GET /api/standard-models` returns `{ folders: [...] }` from Hetzner |
| AC-2 | Upload Manager Standard Models tab lists folders when objects exist |
| AC-3 | Create folder + upload DOCX to `standard-models/` works end-to-end |
| AC-4 | Tool 2 roles/appointments admin not regressed |
| AC-5 | No UploadThing reintroduction; no secrets committed |

### 9.2 Proposed B4.5 (optional, post-B4.4) — Minimal Tool 1 Model Creator Restoration

**Goal:** Restore `/model-creator` document generation in Certification OS (not a redesign).

| In scope (B4.5) | Out of scope (B4.5) |
|-----------------|---------------------|
| Migrate `model-creator/page.tsx`, `DocumentForm.tsx`, `model-form.ts` | QM/LMS integration |
| Adapt `send-model-entries.ts` to Hetzner `fetchTemplateBufferByKey` | New placeholder system |
| Home/nav link to Model Creator | Projektakte / Unternehmensakte |
| Generate ZIP from real `standard-models/` templates | Pricing, portal, deep data model |
| EC-style smoke test with real DOCX | Full Tool 1 product redesign |

**Dependency:** B4.4 (list API + templates in bucket).

### 9.3 Later Tool 1 redesign (explicitly not B4.x)

- Move Tool 1 into `shared/document-templates/` as first-class module
- Integrate with Certification OS dashboard, audit log, common status
- Align placeholders with `docs/PLACEHOLDER_REGISTRY.md` and Fachbot conventions
- Split Upload Manager into Tool-1-specific vs Tool-2-specific admin surfaces
- Deprecate legacy combined app entirely

---

## 10. Can the document upload tool be minimally restored?

| Restoration level | Feasible? | Effort | Blockers |
|-------------------|-----------|--------|----------|
| **Upload Manager — Standard Models admin** | **Yes** | **Low** | None — source in legacy + Hetzner layer ready |
| **Model Creator — ZIP generation** | **Yes** | **Medium** | Requires action + UI migration + Hetzner generator refactor |
| **Deployable combined Tool 1+2 in COS** | **Partial** | B4.4 + B4.5 | B4.4 alone leaves Model Creator unavailable in COS |
| **Full legacy parity without legacy app** | **No (in B4.x)** | Large | Equals full Tool 1 migration — out of scope |

---

## 11. Explicitly out of scope (B4.3 and recommended B4.4)

| Exclusion | Rationale |
|-----------|-----------|
| Full Tool 1 migration / redesign | Separate product gate |
| Tool 2 Mitarbeiterakte redesign (B5) | Different objective |
| Full dashboard, Projektakte, Unternehmensakte | Passive modules |
| Full LMS / Schulungskalender | MVP boundary |
| Deep relational data model / new DB | Not required for upload admin |
| New storage architecture | B3.5 closed Hetzner boundary |
| Fake templates, fake standard models, stub evidence | Hard controls |
| Tool 1 changes in legacy path (unless B4.5 explicitly scopes) | Frozen per B3 |
| Pricing, customer portal, partner portal | Product scope |

---

## 12. Risks and controls

| Risk | Impact | Mitigation |
|------|--------|------------|
| B5 started before Tool 1 upload admin restored | Upload Manager remains partially disabled; strategic deploy goal unmet | Complete B4.4 first if deployability is priority |
| B4.4 conflated with full Tool 1 migration | Scope creep, delays B5 | Strict B4.4 AC — list API + upload admin only |
| `send-model-entries` migrated with UploadThing assumptions | Generator fails on Hetzner-only bucket | Follow `generate-employee-docs.ts` key-map pattern; no `utapi` |
| Empty `standard-models/` prefix in bucket | UI shows empty state (valid) | Upload real DOCX via B4.4 acceptance test |
| Shared Upload Manager UI ownership | Tool 1 tab lives in Tool 2 module path | Acceptable for minimal slice; split UI in later redesign |
| T2-BUG-09 date locale | Affects Tool 1 output if B4.5 proceeds | Carry forward; same `en-US` pattern in legacy `send-model-entries` |
| Operational dual-app deployment | Legacy Tool 1 on UploadThing vs COS on Hetzner | Document deployment choice; migrate templates to Hetzner once |

---

## 13. Relationship to B5 (Tool 2 Mitarbeiterakte redesign)

| Dimension | Tool 2 (B5) | Tool 1 (B4.4/B4.5) |
|-----------|-------------|---------------------|
| Runtime dependency | **Independent** — decoupled in B4.1 | Optional for Tool 2 |
| Upload Manager | Roles/appointments **ready** | Standard Models **blocked** |
| Strategic coupling | Low for employee file build | High for "deployable old tool complex" |
| Parallel execution | B5.1 can start after B5.0 accept | B4.4 can run in parallel with B5 if resourced |

B5.0 boundary explicitly excludes Tool 1 migration. B4.3 does **not** invalidate B5 — it clarifies that Tool 1 restoration is a **parallel track**, not a B5 prerequisite, unless the product gate requires a single deployable COS app with upload admin completeness.

---

## 14. B4.3 gate compliance

| Check | Result |
|-------|--------|
| Assessment only — no code changes | **Yes** |
| No fake templates / evidence | **Yes** |
| No secrets printed | **Yes** |
| No Tool 2 Mitarbeiterakte features built | **Yes** |
| No full Tool 1 migration | **Yes** |
| `npm run build` run | **Not required** — no code changes |

---

## 15. Gate recommendation

### **A) Proceed to B4.4 — Minimal Tool 1 Upload/Admin Restoration** ✅ Recommended

**Rationale:**

1. Strategic correction acknowledged: the original combined tool included Tool 1; Upload Manager still exposes a Standard Models section that is **structurally complete but API-blocked**.
2. Restoration cost is **minimal** — one Hetzner-backed list route; upload/delete/folder APIs already accept `standard-models`.
3. Legacy Tool 1 source is **in-repo and mapped** — not option C.
4. Hetzner reuse is **safe and proven** (B3.5/B4.1).
5. B4.4 does not block B5 — but closes the open control from B4.1 ("Standard Models upload admin OPEN").

**B4.4 entry checklist:**

1. Explicit gate message: **"Start B4.4"**
2. Implement `app/api/standard-models/route.ts` only (Hetzner `template-storage`)
3. Verify Upload Manager Standard Models tab with real DOCX
4. Confirm Tool 2 roles/appointments regression-free
5. `B4_4_*_REPORT.md` + evidence

---

### B) Skip Tool 1 for now → proceed to B5 Tool 2 Redesign

**When to choose:** Product priority is Mitarbeiterakte workforce block only; Tool 1 remains on legacy path or is deprioritized; acceptable to leave Standard Models tab disabled in COS Upload Manager.

**Trade-off:** "Deployable Certification OS" claim is **Tool 2-only** until B4.4/B4.5.

---

### C) Stop — required Tool 1 source is missing

**Not applicable.** Legacy Tool 1 code exists at:

`bots/legacy_tools/existing_tools_systems/document_creater_tool_employee_file_creater_tool1_2/`

External fachliche `*_V1` artefacts (requirements, functional design) may live outside the repo — same note as B5.0 — but **implementation source for minimal restoration is present**.

---

## 16. Related closed gates

| Gate | Report |
|------|--------|
| B4.1 | `B4_1_UPLOAD_ADMIN_COMPLETION_REPORT.md` — Tool 2 decoupled; Standard Models OPEN |
| B4.2 | `B4_2_RESIDUAL_EVIDENCE_CONTROLS_REPORT.md` |
| B5.0 | `B5_0_EMPLOYEE_FILE_FUNCTIONAL_BUILD_BOUNDARY.md` — Tool 1 out of B5 scope |
| B3 | `B3_MIGRATION_EXECUTION_REPORT.md` — Tool 1 kept in legacy |

---

## 17. Inspection references

| Document | Use |
|----------|-----|
| `docs/01-tool-2-handover/EXISTING_CODE_MAPPING.md` | Tool 1 file freeze list |
| `docs/03-controls/B4_1_UPLOAD_ADMIN_COMPLETION_REPORT.md` | `/api/standard-models` root cause |
| `docs/03-controls/B3_5_STORAGE_MIGRATION_PREPARATION.md` | Hetzner category map |
| `bots/legacy_tools/.../DOCUMENTATION.md` | Legacy API + workflow reference |
