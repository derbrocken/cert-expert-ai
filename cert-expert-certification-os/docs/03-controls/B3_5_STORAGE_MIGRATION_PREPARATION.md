# B3.5 Storage Migration Preparation — UploadThing → Hetzner Object Storage

**Gate:** OPEN B3.5 — PREPARATION ONLY  
**Status:** Preparation complete — **no migration executed**  
**Date:** 2026-06-05  
**Reference briefing:** `briefing-file-storage-migration-v3.pdf` (user-provided; not in repo)  
**Prerequisite:** B3 migration closed; Option A UploadThing retest completed with blockers

---

## Scope boundary (this document)

| Allowed in B3.5 preparation | **Not allowed** until separate B3.5 execution gate |
|-----------------------------|-----------------------------------------------------|
| Inventory UploadThing usage | Implement Hetzner client |
| Hetzner env variable plan (placeholders only) | Change `package.json` |
| Replacement map + execution plan | Migrate Tool 1 |
| Post-migration test plan | Start B4 |
| Carry forward open controls | Add Tool 2 features |
| GDPR/compliance rationale (project doc) | Commit secrets / real credentials |
| | Implement passive modules |
| | Fake templates / ZIP / EC-09 evidence |
| | Redesign auth, database, or full storage architecture |

**Target:** Replace UploadThing with **Hetzner Object Storage** (S3-compatible API, AWS SDK v3, presigned URLs) as a **targeted upload/retrieval/template-listing layer replacement only**.

**B3.5 execution is not started by this document.**

---

## Project compliance rationale (not legal advice)

Per `briefing-file-storage-migration-v3.pdf`, UploadThing is classified as **unsuitable for the EU/GDPR target setup** for this Certification OS path. Hetzner Object Storage (EU-hosted, S3-compatible) is the **approved target** because:

- Data residency aligns with EU/Germany infrastructure already purchased (Hetzner server + Object Storage).
- S3-compatible API allows AWS SDK v3 + presigned URLs without proprietary UploadThing coupling.
- Replaces only the file upload/retrieval layer; Tool 2 workflows, B2 fixes, and app structure remain unchanged.

External legacy/developer infrastructure remains a separate fallback path; this Cursor project stays the controlled Certification OS development path.

---

## 1. UploadThing usage inventory (migrated Certification OS app)

**App root:** `cert-expert-certification-os/apps/certification-os/`

### 1.1 Core library — `lib/uploadthing.ts` (runtime)

| Export / symbol | UploadThing API used | Purpose |
|-----------------|---------------------|---------|
| `utapi` | `UTApi()` | Singleton client |
| `listTemplateFiles()` | `utapi.listFiles({ limit: 500 })` | List uploaded templates; filter `status === "Uploaded"` |
| `uploadTemplateFile()` | `UTFile` + `utapi.uploadFiles()` | Server-side DOCX upload with `customId` |
| `fetchTemplateBuffer(ufsUrl)` | `fetch(ufsUrl)` | Download template bytes from CDN URL |
| `buildCustomId()` | — (logic only) | Key: `category/folderName/fileName/{timestamp}` |
| `buildPathPrefix()` | — (logic only) | Prefix: `category/folderName/fileName/` |
| `parseCustomId()` | — (logic only) | Parse roles/appointments/standard-models paths |
| `VALID_CATEGORIES` | — | `roles`, `appointments`, `standard-models` |

**Reference copy (not runtime):** `cert-expert-certification-os/shared/storage/uploadthing.ts` — duplicate of above; B3 Turbopack accommodation.

### 1.2 API routes depending on UploadThing

| Route | Imports from `@/lib/uploadthing` | UploadThing operations |
|-------|----------------------------------|------------------------|
| `app/api/templates/route.ts` | `listTemplateFiles`, `parseCustomId` | List + parse for role/appointment JSON |
| `app/api/uploads/route.ts` | `utapi`, `buildPathPrefix`, `listTemplateFiles`, `uploadTemplateFile`, `buildCustomId`, `VALID_CATEGORIES` | POST upload; DELETE file/folder via `utapi.deleteFiles` |
| `app/api/uploads/folder/route.ts` | `utapi`, `buildCustomId`, `listTemplateFiles`, `VALID_CATEGORIES` | Create folder placeholder via `utapi.uploadFiles(UTFile)` |

**Not in migrated app (Tool 1):** `app/api/standard-models/route.ts` — legacy only.

### 1.3 Server actions / generator

| File | UploadThing usage |
|------|-------------------|
| `modules/03-mitarbeiterakte-tool-2/employee-generator/generate-employee-docs.ts` | `listTemplateFiles`, `parseCustomId`, `fetchTemplateBuffer`, `utapi.getFileUrls(keys)` |

### 1.4 UI components (indirect — via API, not UploadThing SDK)

| Component | Dependency |
|-----------|------------|
| `employee-file/EmployeeAutomationPage.tsx` | `fetch("/api/templates")` → roles/appointments dropdowns + doc panels |
| `employee-file/EmployeeForm.tsx` | Renders doc checklists from parent `roles`/`appointments` props |
| `roles/admin/UploadsPage.tsx` | `fetch("/api/templates")`, `fetch("/api/uploads")`, `fetch("/api/uploads/folder")`; also `fetch("/api/standard-models")` (**Tool 1 — out of scope**) |

No `@uploadthing/react` in migrated app. Client uploads use **FormData → `/api/uploads`** (server-side UploadThing upload).

### 1.5 package.json dependency

| Package | Location | Status |
|---------|----------|--------|
| `uploadthing` ^7.7.4 | `apps/certification-os/package.json` | **Present** — only storage SDK in use |
| `@uploadthing/react` | — | **Not installed** in migrated app |

### 1.6 Scaffold (not wired)

| File | Status |
|------|--------|
| `shared/storage/storage-adapter.ts` | Interface + throwing stubs; mentions future Hetzner adapter |
| `shared/storage/README.md` | Placeholder docs |

### 1.7 Legacy path (out of B3.5 execution scope — reference only)

Tool 1 in `bots/legacy_tools/.../` also uses `lib/uploadthing.ts` and `send-model-entries.ts` (`utapi.getFileUrls`). **Do not touch** per gate.

---

## 2. Tool 2 flows currently blocked by UploadThing

| Flow | Blocker | Option A retest result |
|------|---------|------------------------|
| `GET /api/templates` | No `UPLOADTHING_TOKEN`; `listTemplateFiles()` fails | **BLOCKED** |
| Role/appointment DOCX template listing | Same | **BLOCKED** |
| Document checklist rendering (`EmployeeForm`) | Empty `roles`/`appointments` from API | **BLOCKED** |
| T2-BUG-08 Select All / Deselect All UI | No doc lists without templates | **BLOCKED** |
| Baseline employee ZIP (`generateEmployeeDocs`) | Cannot list/fetch templates | **BLOCKED** |
| EC-09 Standardpersonalakte regression | No baseline ZIP | **BLOCKED** |
| T2-BUG-02 add-via-UI | Role dropdown empty (`roleId` required) | **BLOCKED** |

**Note:** Static `roles/employee-config.ts` exists but is **not wired** to `EmployeeAutomationPage`; fixing that would be a feature change — **not in B3.5 scope**. Hetzner replacement should make `/api/templates` work with real bucket objects.

---

## 3. Hetzner replacement map

**Principle:** Replace `lib/uploadthing.ts` with a thin **template storage module** backed by Hetzner S3. Preserve existing **object key / path conventions** so API routes and generator need minimal import changes.

### 3.1 Proposed module layout (execution — not created yet)

| Current | Proposed target | Action |
|---------|-----------------|--------|
| `lib/uploadthing.ts` | `lib/template-storage.ts` (or `lib/hetzner-s3.ts` + `lib/template-storage.ts`) | Replace UploadThing impl; keep exported helpers |
| `shared/storage/uploadthing.ts` | `shared/storage/hetzner-s3-client.ts` (optional reference) | Update reference copy after execution |
| `shared/storage/storage-adapter.ts` | Unchanged in B3.5 execution | Optional later: `HetznerObjectStorageAdapter` implements interface |

### 3.2 Function-level replacement

| Current function | Hetzner equivalent (AWS SDK v3) |
|------------------|--------------------------------|
| `listTemplateFiles()` | `ListObjectsV2` on bucket with prefix filter; map S3 keys → same shape `{ key, customId, status }` |
| `uploadTemplateFile(buffer, fileName, customId)` | `PutObject` **or** presigned PUT URL (client/server); key = S3 object key derived from `customId` |
| `fetchTemplateBuffer(url)` | `GetObject` by key **or** presigned GET URL + `fetch` |
| `utapi.getFileUrls(keys)` | `getSignedUrl` (`GetObjectCommand`) per key — presigned download URLs |
| `utapi.deleteFiles(keys)` | `DeleteObject` (batch via `DeleteObjects`) |
| Folder placeholder upload | `PutObject` zero-byte or `.folder` marker object at `category/folderName/.folder/` |
| `parseCustomId` / `buildCustomId` / `buildPathPrefix` | **Keep unchanged** — logical path convention preserved |

### 3.3 S3 object key convention (preserve UploadThing customId semantics)

Retain existing logical paths for Tool 2 compatibility:

```
roles/{folderName}/{fileName}/{timestamp}     → S3 key (with .docx suffix on fileName)
appointments/{folderName}/{fileName}/{timestamp}
standard-models/...                           → Tool 1 only; do not migrate API
```

`/api/templates` continues to filter `roles/` and `appointments/` only.

### 3.4 API route changes (execution — minimal)

| Route | Expected change |
|-------|-----------------|
| `app/api/templates/route.ts` | Import from `lib/template-storage` instead of `lib/uploadthing` |
| `app/api/uploads/route.ts` | Same; delete/upload via S3 |
| `app/api/uploads/folder/route.ts` | Replace `UTFile` placeholder with S3 PutObject |
| `generate-employee-docs.ts` | Replace `utapi.getFileUrls` with presigned GET helper; `listTemplateFiles`/`fetchTemplateBuffer` from new module |

### 3.5 UI changes (execution)

| Area | Change |
|------|--------|
| `UploadsPage.tsx` | **None expected** if `/api/uploads` contract unchanged |
| `EmployeeAutomationPage.tsx` | **None** — still `fetch("/api/templates")` |
| `EmployeeForm.tsx` | **None** |

Optional later: presigned **client-direct upload** to reduce server memory — only if needed; initial execution can keep FormData → server → S3 PutObject to match current behavior.

---

## 4. Hetzner environment variables

**Local env path (execution):**  
`cert-expert-certification-os/apps/certification-os/.env.local`

**Placeholders only — do not commit; do not store real values in documentation:**

```env
HETZNER_S3_KEY=<user-provided-key>
HETZNER_S3_SECRET=<user-provided-secret>
HETZNER_BUCKET_NAME=<user-provided-bucket>
HETZNER_S3_ENDPOINT=<user-provided-endpoint>
HETZNER_S3_REGION=<selected-region>
```

| Variable | Purpose |
|----------|---------|
| `HETZNER_S3_KEY` | S3 access key ID |
| `HETZNER_S3_SECRET` | S3 secret access key |
| `HETZNER_BUCKET_NAME` | Target bucket for template objects |
| `HETZNER_S3_ENDPOINT` | Hetzner Object Storage endpoint URL (S3-compatible) |
| `HETZNER_S3_REGION` | Region string required by AWS SDK (e.g. `eu-central` per Hetzner docs) |

**Rules:**

- Add `.env.local` to `.gitignore` (already covered by `.env*` in app `.gitignore`).
- User provides credentials outside documentation.
- Do **not** purchase or configure UploadThing for this path.

**Deprecate (after execution):** `UPLOADTHING_TOKEN` — remove dependency once Hetzner path verified.

---

## 5. Minimal Hetzner storage boundary

| In scope (B3.5 execution) | Out of scope |
|---------------------------|--------------|
| S3 client via `@aws-sdk/client-s3` | Database redesign |
| Presigned URLs via `@aws-sdk/s3-request-presigner` | Auth redesign |
| Template list from Hetzner bucket | Tool 1 migration / `standard-models` API |
| File get/put/delete for template paths | Full `StorageAdapter` wiring (optional later) |
| Keep `parseCustomId` / category conventions | Passive modules |
| Server-side upload via existing `/api/uploads` contract | EC-09 legal/sign-off claims |

---

## 6. Package change plan (execution gate — not applied yet)

### 6.1 Add (later)

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 6.2 Remove (later — only after build + tests pass)

```bash
npm uninstall uploadthing
```

`@uploadthing/react` — not present; no removal needed.

### 6.3 Unchanged

`easy-template-x`, `jszip`, `image-size`, Next.js, React — generator pipeline unchanged.

---

## 7. Migration execution plan (do not execute yet)

### Phase 0 — Preconditions

1. User provides Hetzner S3 credentials in `.env.local` (not committed).
2. Bucket exists with test DOCX objects under `roles/` and `appointments/` prefixes (or migrate objects from legacy/external path).
3. Branch from `b3-tool2-migration` (e.g. `b3.5-hetzner-storage`).

### Phase 1 — Hetzner client (minimal)

1. Create `lib/hetzner-s3-client.ts` — `S3Client` configured from env vars.
2. Create `lib/template-storage.ts` — implement:
   - `listTemplateFiles()`
   - `uploadTemplateFile()`
   - `fetchTemplateBuffer()` / `getPresignedGetUrl()`
   - `deleteTemplateFiles()`
   - Re-export `buildCustomId`, `parseCustomId`, `buildPathPrefix`, `VALID_CATEGORIES`
3. Map UploadThing `key` / `customId` fields to S3 object keys consistently.

### Phase 2 — Wire consumers (import fixes only)

1. Update imports in:
   - `app/api/templates/route.ts`
   - `app/api/uploads/route.ts`
   - `app/api/uploads/folder/route.ts`
   - `employee-generator/generate-employee-docs.ts`
2. Remove `import { UTFile } from "uploadthing/server"` from folder route.
3. Keep API JSON response shapes stable for UI.

### Phase 3 — Verify and remove UploadThing

1. `npm run build` — must PASS.
2. Run post-migration test plan (section 8).
3. `npm uninstall uploadthing`.
4. Delete or archive `lib/uploadthing.ts` and `shared/storage/uploadthing.ts`.

### Phase 4 — Rollback

| Step | Action |
|------|--------|
| Git | Revert branch or restore `lib/uploadthing.ts` + `package.json` |
| Env | Swap `.env.local` back to `UPLOADTHING_TOKEN` only if legacy fallback needed |
| Build | Must PASS before declaring execution complete |

---

## 8. Post-migration test plan (after B3.5 execution)

Run on `http://127.0.0.1:3001/employee-automation` (or configured port) with Hetzner env configured.

| # | Test | Pass criteria |
|---|------|---------------|
| 1 | `GET /api/templates` | Returns `{ roles: [...], appointments: [...] }` with DOCX entries from Hetzner bucket |
| 2 | Role/appointment dropdowns | Populate in UI |
| 3 | T2-BUG-03 full UI | Edit employee → doc checkboxes visible → deselect subset → update → re-edit → selections preserved |
| 4 | T2-BUG-08 UI | Select All / Deselect All on Core + Overlay docs; T2-BUG-03 not regressed |
| 5 | T2-BUG-02 add-via-UI | Add employee without localStorage seed → reload → fields persist |
| 6 | Baseline employee ZIP | Generate real ZIP via UI; save to `docs/02-acceptance/evidence/exports/baseline-employee.zip` |
| 7 | EC-09 | Compare baseline ZIP DOCX output vs expected Standardpersonalakte behavior (manual/visual; no fake evidence) |
| 8 | `npm run build` | PASS |
| 9 | Uploads admin (roles/appointments tabs) | Upload/list/delete works against Hetzner |

**Out of scope for pass/fail:** Uploads `standard-models` tab (Tool 1 API missing).

---

## 9. Open controls carried forward

| Control | Status until Hetzner execution |
|---------|-------------------------------|
| Baseline employee ZIP | **BLOCKED** until storage/templates work |
| EC-09 | **BLOCKED** until baseline ZIP exists |
| T2-BUG-03 full UI | **BLOCKED** until templates load from Hetzner |
| T2-BUG-08 UI | **BLOCKED** until templates/roles load |
| T2-BUG-02 add-via-UI | **BLOCKED** while role dropdown empty |
| `logoFile` persistence | Known risk; outside scope unless explicitly approved |
| Tool 1 APIs (`/api/standard-models`) | **Out of scope** |
| UploadThing token/templates | **Superseded** by Hetzner target — do not purchase UploadThing |

---

## 10. Migration risks

| Risk | Mitigation |
|------|------------|
| S3 key convention mismatch | Preserve `category/folderName/fileName/timestamp` mapping; test `/api/templates` first |
| Presigned URL expiry during ZIP gen | Use server-side `GetObject` for generator; presigned URLs for optional client paths |
| Turbopack / monorepo path limits | Keep Hetzner client under `app/lib/` (same as B3 `uploadthing.ts` placement) |
| Object migration from UploadThing | User/external dev may migrate objects to Hetzner bucket separately; document prefix layout |
| Dual `uploadthing.ts` copies | Remove both app and shared copies after cutover |
| UploadsPage `standard-models` failures | Document Tool 1 dependency; do not fix via Tool 1 migration |
| Generator regression (EC-09) | Baseline ZIP only after real generation; compare manually |
| Secrets in repo | `.env.local` only; never commit; placeholders in docs only |

---

## 11. Confirmation (B3.5 preparation step)

| Check | Status |
|-------|--------|
| B3.5 preparation document created | **Yes** — this file |
| Code changed | **No** |
| `package.json` changed | **No** |
| Secrets committed | **No** |
| B3.5 execution started | **No** |
| B4 started | **No** |
| Tool 1 touched | **No** |
| Scope violation | **None detected** |

---

## 12. Final recommendation

### **A) Open B3.5 Storage Migration Execution**

Preparation is complete. UploadThing inventory, Hetzner replacement map, env plan, package plan, execution steps, test plan, and risks are documented. Open controls are infrastructure-blocked, not architecture-blocked. Execution can proceed once user provides Hetzner credentials in `.env.local` and bucket contains (or will receive) `roles/` / `appointments/` template objects.

**Not recommended now:**

- **B) Rework preparation** — unless Hetzner endpoint/key schema differs from briefing
- **C) Stop** — scope not violated

**After B3.5 execution passes:** re-run evidence retest (Option A controls) before B4 Readiness Preparation.

---

## Related documents

- `briefing-file-storage-migration-v3.pdf` — user briefing (external)
- `TEMPLATE_UPLOADTHING_EVIDENCE_RETEST.md` — Option A blockers
- `B3_MIGRATION_EXECUTION_REPORT.md` — B3 closure
- `shared/storage/storage-adapter.ts` — future adapter interface (not wired)
- `B3_MIGRATION_PREPARATION.md` — original move map
