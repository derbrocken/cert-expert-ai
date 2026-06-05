# B4.5 — Legacy Document Generator Surface Restoration

**Gate:** B4.5 — Minimal Tool 1 UI / entry-point restoration  
**Status:** **CLOSED** (incl. B4.5a logo/body-limit fix)  
**Final decision:** **PASS** — document generator surface restored and logo-robust  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Prerequisites:** B4.3 closed; B4.4 implemented (not yet committed)

---

## 1. What original surface/button was missing

| Missing item | Legacy location | Impact |
|--------------|-----------------|--------|
| **Home CTA — “Start Creating” / Document Creator** | Legacy `app/page.tsx` → `/model-creator` | No entry from landing page |
| **Navbar — “Document Generator” button** | Legacy `components/layout/Navbar.tsx` | No top-nav access |
| **Route `/model-creator`** | Legacy `app/model-creator/page.tsx` | 404 when linked |
| **Document form UI** | Legacy `components/document/DocumentForm.tsx` | No Tool 1 workflow surface |
| **Server action `generateDocument`** | Legacy `app/actions/send-model-entries.ts` | Form submit could not run |
| **Model form validation** | Legacy `lib/validations/model-form.ts` | Form schema absent |

**Post-B4.4 only:** Upload Manager Standard Models tab worked, but users could not reach the **Document Creator / Model Creator** workflow from the migrated app.

---

## 2. Legacy files inspected

| Legacy path | Purpose |
|-------------|---------|
| `app/page.tsx` | Home CTAs including Document Creator |
| `components/layout/Navbar.tsx` | Document Generator nav link |
| `app/model-creator/page.tsx` | Tool 1 page shell + document tree panel |
| `components/document/DocumentForm.tsx` | Folder selection, metadata, generate/download |
| `components/document/index.ts` | Barrel export |
| `app/actions/send-model-entries.ts` | Standard model ZIP generation (UploadThing) |
| `lib/validations/model-form.ts` | Zod schema |
| `app/api/standard-models/route.ts` | Folder list (reference for B4.4) |

**Not migrated (full redesign / later):** legacy marketing home layout, `DocumentPreview` coupling, UploadThing `utapi`.

---

## 3. Minimal files restored/connected

| Restored in Certification OS | Action |
|------------------------------|--------|
| `app/model-creator/page.tsx` | Copied from legacy; import → `@/app/actions/send-model-entries` |
| `components/document/DocumentForm.tsx` | Copied from legacy; removed debug `console.log`; added empty-state copy |
| `components/document/index.ts` | New barrel export |
| `lib/validations/model-form.ts` | Copied from legacy |
| `app/actions/send-model-entries.ts` | **Adapted** — Hetzner `buildLatestTemplateKeyMap` + `fetchTemplateBufferByKey` (no UploadThing) |
| `app/page.tsx` | Added **Document Creator** home button |
| `components/layout/Navbar.tsx` | Restored **Document Generator** nav link |
| `app/api/standard-models/route.ts` | From B4.4 (unchanged in B4.5) |
| `next.config.ts` | B4.5a — `serverActions.bodySizeLimit: "5mb"` |
| `lib/constants/logo-upload.ts` | B4.5a — shared 5 MB logo limit |
| `components/ui/FileDropzone.tsx` | B4.5a — `onReject` for oversize files |

**Logic required for surface to load:** `model-creator` page + `DocumentForm` + `model-form` + `send-model-entries` (compile-time import via `useActionState`). UploadThing version would fail at runtime on Hetzner-only storage — minimal Hetzner adaptation was **required**, not optional.

---

## 4. Files changed (B4.4 + B4.5 — uncommitted)

| File | Gate |
|------|------|
| `app/api/standard-models/route.ts` | B4.4 |
| `docs/03-controls/B4_4_STANDARD_MODELS_API_RESTORATION_REPORT.md` | B4.4 |
| `app/model-creator/page.tsx` | B4.5 |
| `app/actions/send-model-entries.ts` | B4.5 |
| `components/document/DocumentForm.tsx` | B4.5 |
| `components/document/index.ts` | B4.5 |
| `lib/validations/model-form.ts` | B4.5 |
| `app/page.tsx` | B4.5 |
| `components/layout/Navbar.tsx` | B4.5 |
| `docs/03-controls/B4_5_LEGACY_DOCUMENT_GENERATOR_SURFACE_RESTORATION_REPORT.md` | B4.5 |

**Not changed:** Upload Manager logic, Tool 2 employee modules, `.env.local`, unrelated HQ/legacy files.

---

## 4a. B4.5a — Server Action Body Limit / Logo Upload Robustness

### Root cause

| Item | Finding |
|------|---------|
| **Symptom** | User test: generation without logo worked; larger logo → Next.js **"Body exceeded 1 MB limit"**; UI **"An unexpected response was received from the server."** |
| **Path** | `DocumentForm` appends `logo` `File` to `FormData` → `generateDocument` Server Action (`send-model-entries.ts`) |
| **Default limit** | Next.js Server Actions default body size **1 MB** |
| **Gap** | `next.config.ts` had commented `bodySizeLimit`; no client/server logo size guard |

### Files changed (B4.5a)

| File | Change |
|------|--------|
| `next.config.ts` | Enable `experimental.serverActions.bodySizeLimit: "5mb"` |
| `lib/constants/logo-upload.ts` | **New** — `LOGO_MAX_BYTES` (5 MB), error message helpers |
| `components/document/DocumentForm.tsx` | Client validation before submit; `maxSize` on dropzone; error display |
| `components/ui/FileDropzone.tsx` | `onReject` callback when react-dropzone rejects oversize file |
| `app/actions/send-model-entries.ts` | Server-side guard if logo exceeds 5 MB |

### Chosen body size limit

| Setting | Value |
|---------|-------|
| Next.js `bodySizeLimit` | **`5mb`** |
| Client/server logo max | **`5 * 1024 * 1024` bytes** (aligned with dropzone copy) |

Not unbounded; moderate limit for logo + form metadata in one Server Action payload.

### Validation behavior

| Layer | Behavior |
|-------|----------|
| **Dropzone** | Rejects files &gt; 5 MB via `maxSize`; `onReject` shows size message |
| **Submit (client)** | Blocks submit if `logoFile.size` &gt; limit; shows `Logo must be 5 MB or smaller (selected: X MB).` |
| **Server action** | Returns `{ success: false, error: "Logo file exceeds 5 MB limit" }` if bypassed |
| **Oversized logo** | No Server Action call from client when dropzone/submit guard fires → no 1 MB crash |

**Operational note:** Restart dev/production server after `next.config.ts` change so `bodySizeLimit` applies.

### B4.5a test results

| # | Test | Result |
|---|------|--------|
| 1 | Generation path without logo (regression) | **PASS** — unchanged B4.5 behavior |
| 2 | Small logo (~512 KB) accepted in UI | **PASS** — filename shown in dropzone |
| 3 | Oversized logo (~6 MB) | **PASS** — client message; no unexpected server error |
| 4 | `GET /api/templates` | **PASS** — HTTP 200 |
| 5 | `GET /api/standard-models` | **PASS** — HTTP 200 |
| 6 | Upload Manager | **PASS** — no regression |
| 7 | Secrets / `.env.local` committed | **No** |
| 8 | `npm run build` | **PASS** — 12 routes |

### B4.5a build result

Same as §7 — build **PASS** after config + validation changes.

### B4.5a remaining open controls

| Control | Status |
|---------|--------|
| Separate S3 logo upload architecture | **OPEN (future)** — not required for B4.5a |
| Logos &gt; 5 MB | **By design** — rejected with clear message |
| Full E2E generate-with-logo + standard-model DOCX | **Operational** — requires templates in bucket + server restart; body limit no longer blocking for logos ≤ 5 MB |

### B4.5a gate recommendation

**A) Close B4.5 after B4.5a** ✅ — logo handling no longer blocks runtime use for reasonable sizes.

**C) Separate upload architecture slice later** — optional future improvement for very large assets or decoupled logo storage; **not** a B4.5 blocker.

---

## 5. API / storage reuse

| API / layer | Use in B4.5 |
|-------------|-------------|
| `GET /api/standard-models` | `DocumentForm` folder dropdown (B4.4) |
| `lib/template-storage.ts` | `send-model-entries` template fetch via S3 GetObject |
| `GET /api/templates` | Unchanged — Tool 2 only |

**Generator pattern:** Same as Tool 2 `generate-employee-docs.ts` — `buildLatestTemplateKeyMap` on `standard-models/` prefix, no presigned URLs, no UploadThing.

---

## 6. Test results

Runtime verification (`127.0.0.1:3001`, Hetzner via `.env.local` — credentials not printed).

| # | Test | Result | Notes |
|---|------|--------|-------|
| 1 | App starts / pages reachable | **PASS** | Home, uploads, model-creator HTTP 200 |
| 2 | Upload Manager loads | **PASS** | No “Failed to load templates” toast |
| 3 | Standard Models tab functional | **PASS** | API enabled; not Tool 1-blocked |
| 4 | Home Document Creator button visible | **PASS** | `documentCreatorButton: true` |
| 5 | Navbar Document Generator link | **PASS** | `href="/model-creator"` present |
| 6 | Click `/model-creator` opens surface | **PASS** | Page title “Document Creator”; form renders |
| 7 | Empty / sparse standard-models — no crash | **PASS** | Empty-state copy or folder selector; no application error |
| 8 | `GET /api/templates` | **PASS** | roles: 1, appointments: 1 |
| 9 | `GET /api/standard-models` | **PASS** | HTTP 200 |
| 10 | Tool 2 roles/appointments in Upload Manager | **PASS** | Unchanged |
| 11 | Fake templates / models | **None** | List-only / existing bucket objects |
| 12 | Secrets committed | **No** | `.env.local` gitignored |
| 13 | `npm run build` | **PASS** | 12 routes |

**Note:** At test time bucket had **1** standard-model folder (operational data). Empty bucket behavior verified via UI copy and API `{ folders: [] }` shape (B4.4).

---

## 7. Build result

```
Route (app)
├ ○ /model-creator          ← new (B4.5)
├ ƒ /api/standard-models    ← new (B4.4)
├ ○ /uploads
├ ○ /employee-automation
…
Total routes: 12 (was 10 pre-B4.4)
```

| Check | Result |
|-------|--------|
| TypeScript | **PASS** |
| Server actions | **PASS** (`send-model-entries`) |
| Build errors | **None** |

---

## 8. Open controls carried forward

| Control | Status |
|---------|--------|
| Full Tool 1 redesign / `shared/document-templates` module | **OPEN** — out of scope |
| T2-BUG-09 date locale in Tool 1 output | **OPEN** — same `en-US` pattern as legacy |
| `logoFile` / generator persistence | **OPEN** — unchanged |
| B5 Tool 2 Mitarbeiterakte redesign | **OPEN** — separate gate |
| End-to-end ZIP generation with real standard-model DOCX | **OPEN (operational)** — requires uploaded templates in `standard-models/`; Hetzner path implemented, not re-tested with new upload in B4.5 |
| Upload Manager empty-state copy when API down | **Acceptable** — fallback only |

**Closed by B4.5:**

| Control | Status |
|---------|--------|
| Missing Document Creator home/nav entry | **Closed** |
| Missing `/model-creator` route | **Closed** |
| Tool 1 UI surface inaccessible in COS | **Closed** |

---

## 9. B4.5 gate compliance

| Check | Result |
|-------|--------|
| Minimal surface restored (not full Tool 1 redesign) | **Yes** |
| No B5 / Mitarbeiterakte changes | **Yes** |
| No fake templates | **Yes** |
| Hetzner reuse | **Yes** |
| Tool 2 Upload Manager regression checked | **Yes** |
| Unrelated files untouched | **Yes** |

---

## 10. Gate recommendation

### **A) Close B4.5 and commit B4.4 + B4.5 + B4.5a together** ✅ Recommended

**Rationale:** Entry points restored; `/model-creator` loads; B4.5a fixes Server Action body limit and logo validation; APIs and Tool 2 paths regression-free; build passes.

**Suggested commit scope (awaiting approval):**

- All B4.4 + B4.5 + B4.5a files (see §4 + §4a)
- Suggested message: `feat: restore Tool 1 API, document generator surface, and logo upload limits (B4.4–B4.5a)`

---

### B) Keep B4.5 open

**Not recommended.** B4.5a resolved the reported logo/body-limit runtime defect.

---

### C) Stop — require fuller Tool 1 migration

**Not recommended.** Required logic was limited to list API + UI surface + Hetzner-adapted server action; no full module migration needed.

---

## 11. Related gates

| Gate | Report |
|------|--------|
| B4.3 | `B4_3_LEGACY_TOOL_INTEGRATION_READINESS_REPORT.md` |
| B4.4 | `B4_4_STANDARD_MODELS_API_RESTORATION_REPORT.md` |
| B4.1 | `B4_1_UPLOAD_ADMIN_COMPLETION_REPORT.md` |
