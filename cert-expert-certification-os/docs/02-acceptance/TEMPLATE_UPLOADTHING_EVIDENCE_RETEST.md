# Option A — Template / UploadThing Evidence Retest

**Gate:** ACCEPT — Option A opened  
**Status:** Retest **completed** — template-dependent controls remain **BLOCKED / EVIDENCE MISSING**  
**Date:** 2026-06-05  
**B4:** **NOT STARTED**  
**Scope:** Test/evidence gate only — no features, no Tool 1 migration, no passive modules

---

## 1. Test objective

Close or reclassify B2/B3 open controls on the **migrated** Tool 2 app:

| Control | Pre-retest status |
|---------|-------------------|
| Baseline employee ZIP | NOT TESTED / EVIDENCE MISSING |
| EC-09 Standardpersonalakte regression | BLOCKED until baseline ZIP |
| T2-BUG-03 full UI doc-checklist | PENDING — templates / token |
| T2-BUG-08 Select All / Deselect All UI | PENDING — templates / roles |
| T2-BUG-02 add-via-UI without localStorage seed | NOT TESTED |

---

## 2. Environment

| Item | Value |
|------|--------|
| Target app | `cert-expert-certification-os/apps/certification-os/` |
| Dev server | `http://127.0.0.1:3001` (`npx next dev -H 127.0.0.1 -p 3001`) |
| Branch | `b3-tool2-migration` |
| Primary route | `/employee-automation` |
| Build (no config changes) | **PASS** (Next.js 16.1.1, 10 routes) |
| Code/config changed this retest | **No** |

---

## 3. UploadThing / token status

| Check | Result |
|-------|--------|
| `UPLOADTHING_TOKEN` in workspace `.env` / `.env.local` | **NOT FOUND** |
| `UPLOADTHING_TOKEN` in shell environment | **NOT SET** |
| `apps/certification-os/.env.local` | **Absent** |
| Legacy path `.env` | **Absent** (gitignored; not present on disk) |
| Credentials invented for test | **No** (per gate) |

**API probe:**

```http
GET http://127.0.0.1:3001/api/templates
→ 500 {"error":"Failed to list templates"}
```

**Root cause:** `lib/uploadthing.ts` uses `UTApi()` which requires `UPLOADTHING_TOKEN`. Without it, `listTemplateFiles()` throws; template listing fails.

---

## 4. Template availability status

| Source | Status |
|--------|--------|
| UploadThing cloud (roles/appointments DOCX) | **UNAVAILABLE** — API error; token missing |
| Local `templates/` folder in legacy app | **Not present** (gitignored placeholders only) |
| Static demo `roles/employee-config.ts` (`ROLES`, `APPOINTMENTS`) | **Present in codebase** but **not wired** to `EmployeeAutomationPage` — UI loads roles only from `/api/templates` |

**UI observed (migrated app):**

- Role dropdown: **empty** (no options)
- Appointment dropdown: **empty**
- Core Documents panel: placeholder *"Select a role to see associated documents"*
- Overlay Documents panel: placeholder *"Select appointments to see overlay documents"*
- Select All / Deselect All buttons: **not rendered** (no doc lists)

---

## 5. Routes tested

| Route | Result |
|-------|--------|
| `/employee-automation` | Loaded — form renders; templates empty |
| `/api/templates` | **FAIL** — `Failed to list templates` |
| `/api/standard-models` | **404** — route not migrated (Tool 1; out of scope) |
| `/uploads` | Not exercised — depends on same UploadThing APIs |

---

## 6. Test results

| Control | Result | Notes |
|---------|--------|-------|
| **Baseline employee ZIP** | **BLOCKED / EVIDENCE MISSING** | Cannot generate — no templates/token; `generateEmployeeDocs` requires UploadThing file fetch |
| **EC-09** Standardpersonalakte regression | **BLOCKED** | Depends on baseline ZIP |
| **T2-BUG-03** full UI doc-checklist | **BLOCKED / EVIDENCE MISSING** | No role/appointment doc checkboxes without `/api/templates` data |
| **T2-BUG-08** Select All / Deselect All UI | **BLOCKED / EVIDENCE MISSING** | Buttons require loaded doc lists |
| **T2-BUG-02** add-via-UI without localStorage seed | **BLOCKED / EVIDENCE MISSING** | localStorage cleared; role dropdown empty → cannot satisfy `roleId` required field → cannot complete add flow |

### T2-BUG-02 partial observation

With cleared localStorage, user can type name but **cannot select a role**. Form validation blocks submit (`roleId` required). Blocker is upstream template API failure, not persistence logic.

---

## 7. Screenshots captured

| File | Status |
|------|--------|
| `evidence/screenshots/A-TEMPLATE-UPLOADTHING-templates-unavailable.png` | **Captured** — empty role/docs state after API failure |
| `A-TEMPLATE-UPLOADTHING-template-list-loaded.png` | **NOT CAPTURED** — templates never loaded |
| `A-T2-BUG-03-ui-doc-selection-preserved.png` | **NOT CAPTURED** — no doc checklists |
| `A-T2-BUG-08-select-all-deselect-all.png` | **NOT CAPTURED** — buttons not visible |
| `A-EC09-baseline-zip-generated.png` | **NOT CAPTURED** — ZIP not generated |

---

## 8. Output artifacts

| Artifact | Status |
|----------|--------|
| `evidence/exports/baseline-employee.zip` | **NOT CREATED** — no fake ZIP per gate |

---

## 9. Blockers (exact)

1. **`UPLOADTHING_TOKEN` missing** — required for `UTApi` / `listTemplateFiles()` / template upload/list/generate pipeline.
2. **No role/appointment DOCX templates in UploadThing** — cannot verify without token (unknown whether account has templates).
3. **UI depends on live `/api/templates`** — static `employee-config.ts` demo data not used as fallback (not changed per gate).
4. **T2-BUG-02 add-via-UI blocked** — role selection requires template API success.
5. **`/api/standard-models` not in migrated app** — Tool 1 out of scope; Uploads `standard-models` tab would fail if tested (not required for Tool 2 employee flow).

### Minimal configuration to unblock (next retest — not executed here)

1. Create `apps/certification-os/.env.local` with valid `UPLOADTHING_TOKEN` from UploadThing dashboard.
2. Restart dev server.
3. Confirm `GET /api/templates` returns `{ roles: [...], appointments: [...] }` with `.docx` entries.
4. Re-run this retest protocol.

**Do not** migrate Tool 1 APIs or wire static fallback without explicit gate approval.

---

## 10. Tool 1 boundary

| Dependency | Handling |
|------------|----------|
| `/api/standard-models` | **Not migrated** — documented as Tool 1 / out-of-scope |
| Tool 1 legacy code | **Not touched** |
| Tool 1 API implementation to fix uploads | **Not done** |

---

## 11. Scope compliance

| Rule | Compliant |
|------|-----------|
| B4 not started | **Yes** |
| No new features | **Yes** |
| Tool 1 not touched | **Yes** |
| Passive modules not implemented | **Yes** |
| No fake ZIP / fake EC-09 | **Yes** |
| No storage architecture / UploadThing redesign | **Yes** |
| Excluded bugs not implemented | **Yes** |
| Scope violation | **NONE DETECTED** |

---

## 12. Open controls after retest

| Control | Post-retest status |
|---------|-------------------|
| Baseline employee ZIP | **BLOCKED / EVIDENCE MISSING** |
| EC-09 | **BLOCKED** |
| T2-BUG-03 full UI | **BLOCKED / EVIDENCE MISSING** |
| T2-BUG-08 UI | **BLOCKED / EVIDENCE MISSING** |
| T2-BUG-02 add-via-UI | **BLOCKED / EVIDENCE MISSING** |
| UploadThing/templates availability | **Unresolved** |

---

## 13. Final recommendation

### **B) Rework template/upload test setup**

The evidence retest **ran to completion** but could not close any template-dependent control because `UPLOADTHING_TOKEN` and live templates are unavailable.

**Next step (before B4 Readiness Preparation):**

1. Add `UPLOADTHING_TOKEN` to `apps/certification-os/.env.local` (user-provided; not invented).
2. Verify `/api/templates` returns roles and appointments with DOCX files.
3. Re-run Option A retest to attempt baseline ZIP, EC-09, T2-BUG-03/08 UI, and T2-BUG-02 add-via-UI.

**Not recommended now:**

- **A) Proceed to B4 Readiness Preparation** — EC-09 and all template UI controls remain blocked; evidence infrastructure still missing.
- **C) Stop** — scope not violated.

**B4 remains not started.**

---

## Related documents

- `B3_MIGRATION_EXECUTION_REPORT.md` — B3 closure
- `B2_STEP_REPORT.md` — B2 closure
- `TOOL_2_BASELINE_CAPTURE.md` — baseline capture plan
