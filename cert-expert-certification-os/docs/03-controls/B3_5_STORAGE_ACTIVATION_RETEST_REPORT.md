# B3.5 Storage Activation / Evidence Retest Report

**Gate:** B3.5 Storage Migration + Activation — **CLOSED**  
**Final decision:** **PASS WITH OPEN CONTROLS**  
**Closure date:** 2026-06-05  
**Date:** 2026-06-05 (Rounds 1–3)  
**Branch:** `b3-tool2-migration`  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Reference:** `B3_5_STORAGE_MIGRATION_EXECUTION_REPORT.md` (section 8)

---

## 1. Activation preconditions

| Prerequisite | Result |
|--------------|--------|
| `.env.local` at `apps/certification-os/.env.local` | **Missing** — file does not exist |
| `HETZNER_S3_KEY` | **Not set** |
| `HETZNER_S3_SECRET` | **Not set** |
| `HETZNER_BUCKET_NAME` | **Not set** |
| `HETZNER_S3_ENDPOINT` | **Not set** |
| `HETZNER_S3_REGION` | **Not set** |
| `.env.local` in `.gitignore` | **Yes** |
| Real credentials in docs / Git | **No** |
| Real DOCX templates in repo (to upload) | **None found** — no fake templates created |

**Blocker:** User must create `.env.local` locally with real Hetzner credentials and ensure the bucket contains real DOCX objects under `roles/` and `appointments/` before activation evidence can pass.

---

## 2. Files changed in this retest step

| Change | Notes |
|--------|-------|
| **No application code changed** | Retest only |
| **Created** | `docs/03-controls/B3_5_STORAGE_ACTIVATION_RETEST_REPORT.md` (this file) |

---

## 3. What was verified (without credentials)

| Check | Result | Evidence |
|-------|--------|----------|
| Branch | `b3-tool2-migration` | `git branch --show-current` |
| `npm run build` | **PASS** | 10 routes; TypeScript clean |
| Missing-env fail-safe | **PASS** | `GET /api/templates` → HTTP **503** with configuration detail |
| `/employee-automation` | **PASS** | HTTP 200 |
| `/uploads` | **PASS** | HTTP 200 |
| Secrets committed | **No** | `.env.local` absent; gitignore covers path |
| Fake templates / ZIP / EC-09 | **None created** | Per gate boundary |

**Test server:** `npm run start -p 3002` (existing post-migration build instance).

---

## 4. Round 1 — Section 8 retest results

| # | Test | Label | Notes |
|---|------|-------|-------|
| 1 | Hetzner env configuration | **BLOCKED / EVIDENCE MISSING** | `.env.local` not present |
| 2 | Bucket access (ListObjectsV2) | **BLOCKED / EVIDENCE MISSING** | Cannot connect without credentials |
| 3 | Real DOCX under `roles/` / `appointments/` | **BLOCKED / EVIDENCE MISSING** | No bucket access; no templates in workspace to upload |
| 4 | `GET /api/templates` returns real data | **BLOCKED / EVIDENCE MISSING** | Returns 503 (not configured), not `{ roles, appointments }` |
| 5 | Role / appointment dropdowns populated | **BLOCKED / EVIDENCE MISSING** | Requires §4 |
| 6 | T2-BUG-03 training selection on update | **BLOCKED / EVIDENCE MISSING** | Requires templates + doc checklists in UI |
| 7 | T2-BUG-08 select-all / deselect-all | **BLOCKED / EVIDENCE MISSING** | Requires templates + roles |
| 8 | T2-BUG-02 employee save / reopen | **BLOCKED / EVIDENCE MISSING** | Role dropdown empty without templates |
| 9 | Baseline employee ZIP (Hetzner GetObject) | **BLOCKED / EVIDENCE MISSING** | No templates; no ZIP generated |
| 10 | EC-09 Standardpersonalakte regression | **BLOCKED / EVIDENCE MISSING** | No baseline ZIP |
| 11 | Uploads admin (upload/list/delete) | **BLOCKED / EVIDENCE MISSING** | Requires Hetzner credentials |
| 12 | `logoFile` persistence | **Carried forward** | Known risk; not retested (out of scope) |
| 13 | `npm run build` | **PASS** | Post-activation retest build |
| 14 | Tool 1 `/api/standard-models` | **Out of scope** | Not tested |

**Screenshots:** Not captured — blocked on storage activation.  
**Baseline ZIP path:** Not generated — `docs/02-acceptance/evidence/exports/baseline-employee.zip` does not exist.

---

## 5. Open controls

### Still closed from B3.5 execution

| Control | Status |
|---------|--------|
| UploadThing runtime dependency | **Closed** |
| Hetzner code path implemented | **Closed** (build + fail-safe verified) |

### Carried forward (activation not complete)

| Control | Status |
|---------|--------|
| Hetzner env + bucket templates | **BLOCKED** — user action required |
| Baseline employee ZIP | **BLOCKED** |
| EC-09 | **BLOCKED** |
| T2-BUG-03 full UI | **BLOCKED** |
| T2-BUG-08 UI | **BLOCKED** |
| T2-BUG-02 add-via-UI | **BLOCKED** |
| `logoFile` persistence | Known risk — outside scope |
| Tool 1 APIs | Out of scope |

---

## 6. User activation checklist (required to close B3.5)

1. Create `cert-expert-certification-os/apps/certification-os/.env.local` (never commit):

   ```env
   HETZNER_S3_KEY=<real key>
   HETZNER_S3_SECRET=<real secret>
   HETZNER_BUCKET_NAME=<real bucket>
   HETZNER_S3_ENDPOINT=<real endpoint>
   HETZNER_S3_REGION=<real region>
   ```

2. Ensure bucket contains real DOCX templates, e.g.:

   ```
   roles/{roleId}/{templateName}.docx/{timestamp}
   appointments/{appointmentId}/{templateName}.docx/{timestamp}
   ```

   Or upload via `/uploads` admin after starting the app with env configured.

3. Restart dev server: `npm run dev` (or `npm run build && npm run start`).

4. Re-run section 8 tests manually or request a follow-up Cursor retest pass.

5. On success: save baseline ZIP to `docs/02-acceptance/evidence/exports/baseline-employee.zip` (real generation only).

---

## 7. Scope compliance

| Boundary | Compliant |
|----------|-----------|
| Activation / evidence retest only | **Yes** |
| No B4 / Tool 1 / passive modules | **Yes** |
| No fake templates / ZIP / EC-09 | **Yes** |
| No secrets in docs or Git | **Yes** |
| No new Tool 2 features | **Yes** |

---

## 8. Round 1 gate recommendation

### **B) Keep B3.5 open** — BLOCKED / EVIDENCE MISSING (not a failed migration)

---

## 9. Round 2 — Activation retest (2026-06-05)

**Trigger:** User instructed to add `.env.local` and real bucket templates before Round 2.  
**Migration status:** Code-complete and build-stable — **not treated as failed migration**.

### 9.1 Round 2 preconditions

| Prerequisite | Result |
|--------------|--------|
| `.env.local` present | **No** — file still absent at `apps/certification-os/.env.local` |
| `HETZNER_S3_KEY` at runtime | **Not set** |
| `HETZNER_S3_SECRET` at runtime | **Not set** |
| `HETZNER_BUCKET_NAME` at runtime | **Not set** |
| `HETZNER_S3_ENDPOINT` at runtime | **Not set** |
| `HETZNER_S3_REGION` at runtime | **Not set** |
| Secret values printed | **No** |
| Secrets committed | **No** |
| Application code changed | **No** |

**Root cause:** User-provided secrets and bucket templates were not yet present in the Cursor workspace when Round 2 ran. This is **BLOCKED / EVIDENCE MISSING**, not a storage-migration defect.

### 9.2 Round 2 files changed

| File | Change |
|------|--------|
| `docs/03-controls/B3_5_STORAGE_ACTIVATION_RETEST_REPORT.md` | Round 2 section added |
| Application code | **Unchanged** |

### 9.3 Round 2 automated checks (no credentials)

| Check | Result |
|-------|--------|
| `npm run build` | **PASS** (10 routes) |
| Missing-env fail-safe | **PASS** — `GET /api/templates` → HTTP 503, clear message |
| `/employee-automation` | **PASS** — HTTP 200 |
| `/uploads` | **PASS** — HTTP 200 |
| Fake templates / ZIP / EC-09 | **None created** |

### 9.4 Round 2 — full retest table

| # | Test | Label | Notes |
|---|------|-------|-------|
| 1 | Five `HETZNER_*` vars at runtime | **BLOCKED / EVIDENCE MISSING** | `.env.local` absent |
| 2 | Bucket access | **BLOCKED / EVIDENCE MISSING** | No credentials |
| 3 | Real DOCX under `roles/` / `appointments/` | **BLOCKED / EVIDENCE MISSING** | Cannot verify without bucket access |
| 4 | `GET /api/templates` real metadata | **BLOCKED / EVIDENCE MISSING** | HTTP 503, not `{ roles, appointments }` |
| 5 | Role / appointment dropdowns | **BLOCKED / EVIDENCE MISSING** | Requires §4 |
| 6 | Uploads admin (Hetzner) | **BLOCKED / EVIDENCE MISSING** | Requires credentials |
| 7 | Baseline employee ZIP (GetObject) | **BLOCKED / EVIDENCE MISSING** | No templates |
| 8 | T2-BUG-02 save / reopen | **BLOCKED / EVIDENCE MISSING** | Role dropdown empty |
| 9 | T2-BUG-03 training selection on update | **BLOCKED / EVIDENCE MISSING** | No doc checklists without templates |
| 10 | T2-BUG-08 select-all / deselect-all | **BLOCKED / EVIDENCE MISSING** | No doc lists without templates |
| 11 | EC-09 regression | **BLOCKED / EVIDENCE MISSING** | No baseline ZIP |
| 12 | `logoFile` persistence | **Carried forward** | Known risk; not retested |
| 13 | `npm run build` | **PASS** | |
| 14 | Tool 1 `/api/standard-models` | **Out of scope** | |

**Evidence status:** No screenshots, baseline ZIP, or EC-09 artifacts — blocked on activation prerequisites.

### 9.5 Round 2 open controls

Unchanged from Round 1 — all template-dependent controls remain **BLOCKED** until user adds `.env.local` and bucket DOCX templates, then requests Round 3 retest.

### 9.6 Round 2 gate recommendation

### **B) Keep B3.5 open** — BLOCKED / EVIDENCE MISSING

B3.5 **execution** remains valid (build PASS, fail-safe PASS, UploadThing removed). **Activation evidence** cannot close the gate until the user places real credentials in `.env.local` and real DOCX objects in the Hetzner bucket **in this workspace**, then a follow-up retest can run UI/ZIP/EC-09 checks.

**When Round 3 prerequisites are met:**

1. `.env.local` exists locally (gitignored, never committed).
2. Bucket has real DOCX under `roles/` and `appointments/`.
3. App restarted so Next.js loads env.
4. Request **B3.5 Activation Retest Round 3**.

If Round 3 passes template/API/UI/ZIP tests → **A) Close B3.5 with open controls** (`logoFile`, Tool 1) becomes appropriate before B4.

---

## 10. Round 3 — Activation retest (2026-06-05)

**Trigger:** `.env.local` present, bucket populated with 5 real DOCX templates, dev server restarted with env loaded.

### 10.1 Round 3 preconditions

| Prerequisite | Result |
|--------------|--------|
| `.env.local` present | **Yes** (gitignored) |
| All five `HETZNER_*` vars | **PRESENT** (values not logged) |
| `HETZNER_BUCKET_NAME` | `cert-expert-files` |
| `HETZNER_S3_ENDPOINT` | `https://` scheme present |
| Bucket DOCX objects | **5** — `roles/` × 4, `appointments/` × 1 |
| Secret values printed | **No** |
| Secrets committed | **No** |
| Application code changed | **No** (retest scripts in `tmp-upload-templates/` only) |

### 10.2 Round 3 files changed

| File | Change |
|------|--------|
| `docs/03-controls/B3_5_STORAGE_ACTIVATION_RETEST_REPORT.md` | Round 3 section (this section) |
| `docs/02-acceptance/evidence/exports/baseline-employee.zip` | **Real** ZIP from Hetzner GetObject (106 517 bytes) |
| `docs/02-acceptance/evidence/screenshots/R3-templates-dropdowns.png` | Role dropdown + core docs screenshot |
| `tmp-upload-templates/round3-zip-test.mjs` | One-off ZIP test script (not runtime) |
| `tmp-upload-templates/round3-ui-test.mjs` | One-off UI test script (not runtime) |

### 10.3 Round 3 — full retest table

| # | Test | Label | Evidence |
|---|------|-------|----------|
| 1 | App loads `.env.local` at runtime | **PASS** | Dev server log: `Environments: .env.local` |
| 2 | Bucket access via app path | **PASS** | `GET /api/templates` → HTTP 200, Hetzner-backed |
| 3 | Real DOCX under `roles/` / `appointments/` | **PASS** | 4 role + 1 appointment objects in bucket |
| 4 | `GET /api/templates` real metadata | **PASS** | 1 role folder (`din-77200-1-allgemeine`, 4 docs), 1 appointment (`unterweisungen`, 1 doc) |
| 5 | Role / appointment dropdowns | **PASS** | Playwright: role options + appointment overlay visible |
| 6 | Uploads admin (Hetzner) | **PARTIAL / OPEN** | Page loads HTTP 200; template list fails because `/api/standard-models` returns 404 (Tool 1 — out of scope). Hetzner list works via `/api/templates`. |
| 7 | Baseline employee ZIP (GetObject) | **PASS** | `baseline-employee.zip` — 3 processed DOCX from real Hetzner templates |
| 8 | T2-BUG-02 save / reopen | **PASS** | Add via UI + localStorage clear; reload persists employee |
| 9 | T2-BUG-03 training selection on update | **PASS** | Deselect doc on update; re-edit shows unchecked state |
| 10 | T2-BUG-08 select-all / deselect-all | **PASS** | Core docs Select All / Deselect All verified |
| 11 | EC-09 regression | **OPEN / MANUAL** | Real baseline ZIP exists; manual Standardpersonalakte visual compare not automated in this retest |
| 12 | `logoFile` persistence | **Carried forward** | `logoInGlobalProps: false` — known risk, not in scope |
| 13 | `npm run build` | **PASS** | 10 routes |
| 14 | Tool 1 `/api/standard-models` | **Out of scope** | 404 — blocks UploadsPage combined fetch |

### 10.4 Baseline ZIP contents (real generation)

```
Round3 Test Employee/
  Din 77200 1 Allgemeine/
    01_Jahresweiterbildung_DIN_77200-1_24UE.docx
    02_Jahresweiterbildung_DIN_77200-1_40UE.docx
  Unterweisungen/
    Unterweisungsnachweis_Allgm. Pflichtunterweisung.docx
```

Path: `docs/02-acceptance/evidence/exports/baseline-employee.zip`

### 10.5 Round 3 open controls carried forward

| Control | Status |
|---------|--------|
| Uploads admin full UI list | **OPEN** — blocked by missing Tool 1 `/api/standard-models` (not Hetzner defect) |
| EC-09 manual regression compare | **OPEN** — baseline ZIP available; user visual sign-off pending |
| `logoFile` persistence | Known risk — outside B3.5 scope |
| Tool 1 APIs | Out of scope |

### 10.6 Round 3 gate recommendation (superseded by §11)

Round 3 result supported closure — see **§11 B3.5 closure** for final gate decision.

---

## 11. B3.5 closure — PASS WITH OPEN CONTROLS

**Gate decision:** **PASS WITH OPEN CONTROLS**  
**B4:** **Not started**  
**Closure authority:** Round 3 activation evidence + user gate confirmation (2026-06-05)

### 11.1 Closure summary

B3.5 is **closed**. UploadThing runtime usage was removed from the migrated Certification OS app and replaced with Hetzner Object Storage (S3-compatible API, `@aws-sdk/client-s3`). Activation Round 3 confirmed the replacement works end-to-end with real credentials, real bucket templates, and real runtime evidence.

| Phase | Result |
|-------|--------|
| B3.5 execution (code migration) | **PASS** — build stable, UploadThing removed |
| B3.5 activation Round 3 | **PASS** — Hetzner env, templates, UI, ZIP |
| Secrets / fake evidence | **Compliant** — no secrets committed; no fake templates/ZIP/EC-09 |

**Key evidence:**

- `.env.local` loads at runtime (gitignored, not committed)
- `GET /api/templates` → real Hetzner metadata (1 role / 4 docs, 1 appointment / 1 doc)
- Bucket: `roles/` × 4 DOCX, `appointments/` × 1 DOCX
- Role and appointment dropdowns populate from Hetzner templates
- Baseline ZIP via Hetzner GetObject: `docs/02-acceptance/evidence/exports/baseline-employee.zip`
- Screenshot: `docs/02-acceptance/evidence/screenshots/R3-templates-dropdowns.png`
- T2-BUG-02, T2-BUG-03, T2-BUG-08: **PASS**
- `npm run build`: **PASS**

**Not in scope for B3.5 closure:** B4, Tool 1 migration, passive modules, application code changes at closure.

### 11.2 Final open controls (carried forward)

| # | Control | Status | Notes |
|---|---------|--------|-------|
| 1 | Uploads admin full list | **OPEN** | **PARTIAL** — `/api/standard-models` 404 (Tool 1 coupling). Hetzner path works via `/api/templates`. Tool 1 out of scope. |
| 2 | EC-09 manual Standardpersonalakte compare | **OPEN** | Baseline ZIP exists; visual comparison / sign-off pending |
| 3 | `logoFile` persistence | **OPEN** | Known carried-forward risk; not part of B3.5 |
| 4 | Tool 1 APIs | **Out of scope** | Not migrated; not a B3.5 blocker |

### 11.3 Compliance confirmation (closure)

| Check | Result |
|-------|--------|
| `.env.local` committed | **No** |
| Secret values in docs / Git | **No** |
| Fake templates / ZIP / EC-09 | **None** |
| Evidence files removed | **No** |
| Application code modified at closure | **No** |
| B4 started | **No** |

### 11.4 Files changed at closure (this step)

| File | Change |
|------|--------|
| `docs/03-controls/B3_5_STORAGE_ACTIVATION_RETEST_REPORT.md` | B3.5 closure section (§11) + final gate decision |

**Preserved evidence (unchanged):**

- `docs/02-acceptance/evidence/exports/baseline-employee.zip`
- `docs/02-acceptance/evidence/screenshots/R3-templates-dropdowns.png`
- `docs/03-controls/B3_5_STORAGE_MIGRATION_EXECUTION_REPORT.md` (execution record)

### 11.5 Next step (not started)

**B4 Readiness Preparation** — separate gate. Optional before B4: EC-09 manual compare; optional UploadsPage decouple from Tool 1 API (separate change, not B3.5).
