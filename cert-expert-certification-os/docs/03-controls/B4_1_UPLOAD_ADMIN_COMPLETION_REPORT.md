# B4.1 Upload Admin Completion — Tool 2 Template Admin Readiness

**Gate:** B4.1 — Upload Admin Completion  
**Status:** **CLOSED**  
**Final decision:** **PASS** — Tool 2 upload admin ready  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Prerequisite:** B3.5 closed (Hetzner storage active)

---

## 1. Problem statement

Upload Admin (`/uploads`) was **PARTIAL / OPEN** after B3.5: Hetzner-backed `/api/templates` worked, but the page showed **"Failed to load templates"** and listed **0 roles / 0 appointments** because `fetchTemplates()` combined Tool 2 and Tool 1 requests in one `try/catch`.

---

## 2. Root cause — `/api/standard-models` 404

| Item | Finding |
|------|---------|
| **Where called** | `modules/03-mitarbeiterakte-tool-2/roles/admin/UploadsPage.tsx` — `fetchTemplates()` |
| **Call pattern (before fix)** | `Promise.all([fetch("/api/templates"), fetch("/api/standard-models")])` then `modelsRes.json()` |
| **Route in migrated app** | **Missing** — no `app/api/standard-models/route.ts` |
| **Legacy Tool 1 route** | `bots/legacy_tools/.../app/api/standard-models/route.ts` (not migrated) |
| **Tool 2 employee generator** | Does **not** use `standard-models` — only `roles/` and `appointments/` |
| **Tool 2 `/api/templates`** | Filters `roles` and `appointments` only |
| **Failure mechanism** | 404 HTML response → `modelsRes.json()` throws → entire catch → toast + empty Tool 2 lists |

**Conclusion:** `/api/standard-models` is **Tool 1-only**. It is **not required** for Tool 2 template upload, listing, or ZIP generation.

---

## 3. Fix applied (decoupling, not Tool 1 migration)

**Approach:** Decouple Tool 2 Upload Admin from Tool 1 — no stub API, no Tool 1 migration.

| Change | Detail |
|--------|--------|
| Split fetches | `/api/templates` and `/api/standard-models` load independently |
| Tool 2 failure | Toast only if `/api/templates` fails |
| Tool 1 404 | `standardModels = []`, `standardModelsApiAvailable = false` — no page-wide error |
| Standard Models UI | Disabled "New Model" when API unavailable; explanatory empty state |
| Hetzner APIs | Unchanged — `/api/uploads`, `/api/uploads/folder`, `template-storage` |

---

## 4. Files changed

| File | Change |
|------|--------|
| `modules/03-mitarbeiterakte-tool-2/roles/admin/UploadsPage.tsx` | Decouple `fetchTemplates`; Tool 1 graceful degradation |
| `docs/03-controls/B4_1_UPLOAD_ADMIN_COMPLETION_REPORT.md` | This report |
| `docs/02-acceptance/evidence/screenshots/B4-1-uploads-admin-list.png` | Upload admin list evidence |
| `tmp-upload-templates/b4-1-upload-admin-test.mjs` | One-off verification script (not runtime) |

**Not changed:** Tool 1 legacy code, storage architecture, passive modules, `.env.local`

---

## 5. Test results

| # | Test | Result | Evidence |
|---|------|--------|----------|
| 1 | `/api/standard-models` root cause | **PASS** | HTTP 404 — route absent in migrated app |
| 2 | Tool 2 not requiring standard-models | **PASS** | Generator + `/api/templates` use roles/appointments only |
| 3 | Upload Admin loads Tool 2 templates | **PASS** | No "Failed to load templates" toast |
| 4 | Roles listed from Hetzner | **PASS** | `Din 77200 1 Allgemeine`, 4 docs |
| 5 | Appointments listed from Hetzner | **PASS** | `Unterweisungen`, 1 doc |
| 6 | Standard Models section degraded | **PASS** | Tool 1 message shown; no blocking error |
| 7 | Upload real DOCX to `roles/` (Hetzner) | **PASS** | POST `/api/uploads` → 200, `1/1 files uploaded` |
| 8 | List after upload | **PASS** | `/api/templates` still lists role folder (4 docs) |
| 9 | Fake templates | **None** | Only existing staged real DOCX used |
| 10 | Secrets printed/committed | **No** | `.env.local` gitignored |
| 11 | `npm run build` | **PASS** | 10 routes |

---

## 6. Evidence

| Artifact | Path |
|----------|------|
| Upload admin screenshot | `docs/02-acceptance/evidence/screenshots/B4-1-uploads-admin-list.png` |

---

## 7. Tool 2 upload admin readiness

| Capability | Status |
|------------|--------|
| List roles templates (Hetzner) | **Ready** |
| List appointments templates (Hetzner) | **Ready** |
| Upload DOCX to roles/appointments | **Ready** |
| Delete files/folders (existing API) | **Ready** (not re-tested in B4.1; unchanged) |
| Standard Models admin | **Not ready** — Tool 1 out of scope; gracefully disabled |

**Verdict:** Upload Admin is **Tool 2-ready** for roles and appointments template administration.

---

## 8. Open controls carried forward

| Control | Status |
|---------|--------|
| Standard Models upload admin | **OPEN** — requires Tool 1 migration or future stub (out of B4.1 scope) |
| EC-09 manual compare | **OPEN** — baseline ZIP exists from B3.5 |
| `logoFile` persistence | **OPEN** — known risk |
| Tool 1 APIs | **Out of scope** |

**Closed by B4.1:**

| Control | Status |
|---------|--------|
| Uploads admin full list (Tool 2 roles/appointments) | **Closed** |

---

## 9. Build result

```
npm run build — PASS (10 routes)
```

---

## 10. Scope compliance

| Boundary | Compliant |
|----------|-----------|
| B4.1 upload admin only | **Yes** |
| No Tool 1 migration | **Yes** |
| No passive modules / full B4 / dashboard | **Yes** |
| No fake templates / ZIP / EC-09 | **Yes** |
| No secrets committed | **Yes** |
| Minimal decoupling only | **Yes** |

---

## 11. Gate recommendation

### **A) Close B4.1 Upload Admin Completion**

Tool 2 Upload Admin is usable for Hetzner-backed roles and appointments template administration. Root cause fixed via decoupling; runtime evidence passes; build passes.

**Not recommended:**

- **B) Keep B4.1 open** — no blocking runtime defect remains for Tool 2 scope.

**Next (separate gate):** B4 continuation (employee file / readiness / other B4 slices) — **not started** by this report.
