# B3.5 Storage Migration Execution Report — UploadThing → Hetzner Object Storage

**Gate:** B3.5 Storage Migration Execution  
**Status:** Execution complete — **CLOSED WITH OPEN CONTROLS**  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Reference:** `B3_5_STORAGE_MIGRATION_PREPARATION.md`

---

## 1. Pre-execution checkpoint

| Check | Result |
|-------|--------|
| Current branch | `b3-tool2-migration` |
| B3.5 preparation document exists | **Yes** — `docs/03-controls/B3_5_STORAGE_MIGRATION_PREPARATION.md` |
| Pre-migration `npm run build` | **PASS** (10 routes) |
| `.env.local` present | **No** — all five `HETZNER_*` variables missing |

---

## 2. Files created / updated / removed

### Created

| File | Purpose |
|------|---------|
| `apps/certification-os/lib/hetzner-s3-client.ts` | S3 client from env; `HetznerStorageNotConfiguredError` |
| `apps/certification-os/lib/template-storage.ts` | Hetzner-backed list/upload/get/delete; key helpers |

### Updated

| File | Change |
|------|--------|
| `app/api/templates/route.ts` | Import `template-storage`; 503 when env missing |
| `app/api/uploads/route.ts` | Hetzner upload/delete via `template-storage` |
| `app/api/uploads/folder/route.ts` | Folder placeholder via `uploadFolderPlaceholder` (no `UTFile`) |
| `modules/03-mitarbeiterakte-tool-2/employee-generator/generate-employee-docs.ts` | `buildLatestTemplateKeyMap` + `fetchTemplateBufferByKey` (GetObject) |
| `package.json` | Added AWS SDK; removed `uploadthing` |
| `package-lock.json` | Regenerated after package changes |

### Removed

| File | Notes |
|------|-------|
| `apps/certification-os/lib/uploadthing.ts` | Runtime UploadThing module deleted after Hetzner wiring |

### Not touched (out of scope)

- Tool 1 legacy code and `/api/standard-models`
- `shared/storage/uploadthing.ts` (reference copy only; not runtime)
- Passive modules, B4, excluded bugs T2-BUG-05/06/07/09/10
- Fake templates, ZIP, or EC-09 evidence

---

## 3. Packages changed

### Added

- `@aws-sdk/client-s3` ^3.1062.0
- `@aws-sdk/s3-request-presigner` ^3.1062.0

### Removed

- `uploadthing` ^7.7.4 (and 17 transitive packages)

### Unchanged

`easy-template-x`, `jszip`, `image-size`, Next.js, React — generator pipeline unchanged.

---

## 4. Secrets / env compliance

| Check | Result |
|-------|--------|
| `.env.local` committed | **No** — file does not exist in workspace |
| Real credentials in documentation | **No** — placeholders only |
| `.env.local` in `.gitignore` | **Yes** — `apps/certification-os/.gitignore` |

**Required variables** (user must create `apps/certification-os/.env.local`):

```env
HETZNER_S3_KEY=<user-provided-key>
HETZNER_S3_SECRET=<user-provided-secret>
HETZNER_BUCKET_NAME=<user-provided-bucket>
HETZNER_S3_ENDPOINT=<user-provided-endpoint>
HETZNER_S3_REGION=<selected-region>
```

---

## 5. UploadThing replacement summary

| Area | Before | After |
|------|--------|-------|
| Template list | `utapi.listFiles` | `ListObjectsV2` via `listTemplateFiles()` |
| Template upload | `UTFile` + `utapi.uploadFiles` | `PutObject` via `uploadTemplateFile()` |
| Template delete | `utapi.deleteFiles` | `DeleteObjects` via `deleteTemplateFiles()` |
| Folder placeholder | `UTFile` + upload | `uploadFolderPlaceholder()` PutObject |
| ZIP generation fetch | `utapi.getFileUrls` + HTTP fetch | `GetObject` via `fetchTemplateBufferByKey()` |
| Runtime UploadThing imports | 5 files | **0** — all removed |
| `uploadthing` package | Present | **Removed** |

**Presigned URLs:** `getPresignedGetUrl()` implemented for optional use; ZIP generator uses server-side `GetObject` only.

---

## 6. Hetzner implementation summary

### Module boundary

- `lib/hetzner-s3-client.ts` — config, client singleton, `forcePathStyle: true`
- `lib/template-storage.ts` — template operations + preserved helpers

### Template key convention (unchanged from B3.5 preparation)

```
roles/{folderName}/{fileName}/{timestamp}
appointments/{folderName}/{fileName}/{timestamp}
```

- S3 object key equals `customId` (full path including timestamp).
- `parseCustomId` / `buildCustomId` / `buildPathPrefix` preserved.
- `/api/templates` filters `roles/` and `appointments/` only.
- Latest version per logical path (`category/folder/file.docx`) selected by highest timestamp suffix.

### Empty bucket / missing env behavior

- Missing env → `HetznerStorageNotConfiguredError` → `GET /api/templates` returns **503** with configuration detail (fail-safe).
- Empty bucket → `GET /api/templates` returns `{ roles: [], appointments: [] }` (no fake templates).

**Templates must be uploaded to Hetzner** under `roles/` and `appointments/` prefixes before UI dropdowns and ZIP generation can pass.

---

## 7. Build results

| Stage | Command | Result |
|-------|---------|--------|
| Pre-migration | `npm run build` | **PASS** |
| Post-migration (after SDK install + wiring) | `npm run build` | **PASS** (10 routes) |
| Post UploadThing removal | `npm install` + `npm run build` | **PASS** |

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/preview
├ ƒ /api/templates
├ ƒ /api/uploads
├ ƒ /api/uploads/folder
├ ○ /employee-automation
└ ○ /uploads
```

---

## 8. Post-migration retest

**Server:** `npm run start -p 3002` (fresh post-migration build)  
**Env:** No `.env.local` — runtime template tests blocked by design.

| # | Test | Label | Evidence |
|---|------|-------|----------|
| 1 | `GET /api/templates` | **BLOCKED / EVIDENCE MISSING** | HTTP 503 — `{"error":"Template storage not configured",...}` |
| 2 | `/employee-automation` loads | **PASS** | HTTP 200 |
| 3 | `/uploads` loads | **PASS** | HTTP 200 |
| 4 | Role/appointment dropdowns populate | **BLOCKED / EVIDENCE MISSING** | No Hetzner env / no bucket templates |
| 5 | T2-BUG-03 full UI doc-checklist | **BLOCKED / EVIDENCE MISSING** | Requires templates in bucket |
| 6 | T2-BUG-08 Select All / Deselect All UI | **BLOCKED / EVIDENCE MISSING** | Requires templates/roles |
| 7 | T2-BUG-02 add-via-UI (no localStorage seed) | **BLOCKED / EVIDENCE MISSING** | Role dropdown empty without templates |
| 8 | Baseline employee ZIP generation | **BLOCKED / EVIDENCE MISSING** | No templates; no ZIP produced |
| 9 | EC-09 Standardpersonalakte regression | **BLOCKED / EVIDENCE MISSING** | No baseline ZIP |
| 10 | `npm run build` | **PASS** | See section 7 |
| 11 | Uploads admin (upload/list/delete) | **BLOCKED / EVIDENCE MISSING** | Requires Hetzner credentials + bucket |

**Screenshots:** Not captured — blocked on storage configuration.  
**Baseline ZIP path:** Not generated — `docs/02-acceptance/evidence/exports/baseline-employee.zip` does not exist.

---

## 9. Open controls

### Closed by this execution

| Control | Status |
|---------|--------|
| UploadThing as Tool 2 runtime storage | **Closed** — replaced with Hetzner S3 module |
| UploadThing token dependency | **Closed** — package removed; no runtime imports |
| Storage architecture beyond Hetzner replacement | **N/A** — stayed within approved boundary |

### Carried forward (blocked on Hetzner env + bucket templates)

| Control | Status |
|---------|--------|
| Baseline employee ZIP | **BLOCKED** until Hetzner templates work |
| EC-09 | **BLOCKED** until baseline ZIP exists |
| T2-BUG-03 full UI | **BLOCKED** until templates load |
| T2-BUG-08 UI | **BLOCKED** until templates/roles load |
| T2-BUG-02 add-via-UI | **BLOCKED** while role dropdown empty |
| `logoFile` persistence | Known risk — outside scope |
| Tool 1 APIs (`/api/standard-models`) | Out of scope |

---

## 10. Known risks

| Risk | Status |
|------|--------|
| No `.env.local` in workspace | User must provide credentials before runtime pass |
| Empty Hetzner bucket | Listing returns empty roles/appointments; upload via `/uploads` admin |
| `shared/storage/uploadthing.ts` reference copy stale | Non-runtime; optional cleanup later |
| Port 3001 may serve pre-migration instance | Use fresh `npm run start` after build (tested on 3002) |
| UploadsPage `standard-models` tab | Still depends on Tool 1 API — out of scope |

---

## 11. Rollback notes

1. Restore `lib/uploadthing.ts` from git history.
2. Revert imports in API routes and `generate-employee-docs.ts` to `@/lib/uploadthing`.
3. `npm install uploadthing@^7.7.4`
4. Set `UPLOADTHING_TOKEN` in `.env.local` (legacy path only).
5. `npm run build` must PASS before declaring rollback complete.

---

## 12. Scope compliance

| Boundary | Compliant |
|----------|-----------|
| B3.5 storage migration execution only | **Yes** |
| No B4 / passive modules / Tool 1 / excluded bugs | **Yes** |
| No fake templates / ZIP / EC-09 evidence | **Yes** |
| No secrets committed | **Yes** |
| Minimal API/UI contract preservation | **Yes** |
| Hetzner S3 + AWS SDK only | **Yes** |

---

## 13. Recommendation

### **A) Close B3.5 Storage Migration with open controls**

Code migration from UploadThing to Hetzner Object Storage is complete. Build passes. Runtime evidence tests remain **BLOCKED / EVIDENCE MISSING** until the user adds `.env.local` with the five `HETZNER_*` variables and uploads real DOCX templates to the bucket under `roles/` and `appointments/` prefixes.

**Next step for user:** Create `apps/certification-os/.env.local`, upload templates, re-run section 8 tests (Option A evidence retest on Hetzner path), then proceed toward B4 only after template-dependent controls pass.

**Not recommended:**

- **B) Rework storage migration** — implementation matches preparation plan; no scope violation detected.
- **C) Rollback** — not required unless Hetzner endpoint/credentials prove incompatible.
