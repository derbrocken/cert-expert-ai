# B4.2 Residual Evidence Controls — EC-09 + logoFile

**Gate:** B4.2 — Residual Evidence Controls  
**Status:** **CLOSED**  
**Final decision:** **PASS WITH OPEN CONTROLS**  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**Prerequisites:** B3.5 closed, B4.1 closed

---

## 1. Objective

Close or explicitly carry forward remaining Tool 2 evidence controls before the full employee file functional build:

1. EC-09 manual Standardpersonalakte comparison (real baseline ZIP)
2. `logoFile` persistence assessment

---

## 2. EC-09 manual comparison result

**Source:** `docs/02-acceptance/evidence/exports/baseline-employee.zip` (preserved, not modified)

| Check | Result |
|-------|--------|
| Real ZIP used | **Yes** — B3.5 Round 3 Hetzner generation |
| Fake EC-09 evidence | **None** |
| Package structure | **PASS** — employee / role / appointment folders |
| Real DOCX templates used | **PASS** — 3 output files map to Hetzner bucket templates |
| Placeholder replacement | **PASS** — no unreplaced `{Token}` in extracted body text |
| Employee name in output | **PASS** — `Round3 Test Employee` |
| Global props in output | **PASS** — company name/email/address in appointment doc |
| Usable Standardpersonalakte package | **PASS WITH OBSERVATIONS** |

**Observations (carried forward, not B4.2 blockers):**

- Dates rendered in **en-US long format** (`January 15, 1990`) — aligns with known T2-BUG-09 generator locale behavior.
- No in-repo golden-master reference document for pixel-perfect visual diff; review based on extracted text + structure.
- Baseline generated **without logo** — template embedded images preserved; `{Logo}` injection not exercised.

**Detailed notes:** `docs/02-acceptance/evidence/notes/B4-2-EC-09-MANUAL-REVIEW.md`

**EC-09 control status:** **CLOSED WITH OBSERVATIONS**

---

## 3. logoFile persistence result

### What `logoFile` is

| Aspect | Detail |
|--------|--------|
| **UI state** | `logoFile: File \| null` in `EmployeeAutomationPage.tsx` |
| **UI component** | `GlobalSidebar` → `FileDropzone` (optional: "replaces `{Logo}` placeholder") |
| **Generation** | On "Generate ZIP", `logoFile` is read via `FileReader` → `globalProps.companyLogo` base64 for that run only |
| **Persistence** | `saveEmployeeQueue()` persists `employees` + `globalProps` — **does not** sync `logoFile` → `globalProps.companyLogo` |
| **MVP requirement** | **Optional** — logo labeled optional in UI; baseline ZIP valid without logo |

### Runtime test (real, no fake screenshots)

| Test | Result |
|------|--------|
| Select logo via file input (1×1 PNG test asset) | **Works** in session |
| `companyLogo` in localStorage after reload | **No** — `false` |
| Logo survives page reload | **No** |
| Logo survives save/reopen queue flow | **NOT TESTABLE as PASS** — not persisted |

**logoFile control status:** **CARRY FORWARD** — documented known limitation; optional enhancement for post-MVP or B4 functional build.

**Code references:**

- `EmployeeAutomationPage.tsx` — `logoFile` state separate from `saveEmployeeQueue`
- `employee-queue-storage.ts` — no `logoFile` field
- `generate-employee-docs.ts` — uses `globalProps.companyLogo` when present

---

## 4. Files changed

| File | Change |
|------|--------|
| `docs/03-controls/B4_2_RESIDUAL_EVIDENCE_CONTROLS_REPORT.md` | This report |
| `docs/02-acceptance/evidence/notes/B4-2-EC-09-MANUAL-REVIEW.md` | EC-09 review notes |
| `tmp-upload-templates/b4-2-logo-test.mjs` | One-off logo persistence test (not runtime) |

**Unchanged:** application code, `baseline-employee.zip`, no fake screenshots

---

## 5. Evidence created / preserved

| Artifact | Path | Action |
|----------|------|--------|
| Baseline ZIP | `docs/02-acceptance/evidence/exports/baseline-employee.zip` | **Preserved** |
| EC-09 review notes | `docs/02-acceptance/evidence/notes/B4-2-EC-09-MANUAL-REVIEW.md` | **Created** |
| Screenshots | — | **None** (text extraction review sufficient; no fake captures) |

---

## 6. Files reviewed (EC-09)

| File | Role |
|------|------|
| `baseline-employee.zip` (3 DOCX inside) | Generated output |
| `generate-employee-docs.ts` | Placeholder + logo injection logic |
| `EmployeeAutomationPage.tsx` | logoFile state + generate flow |
| `employee-queue-storage.ts` | Persistence boundary |
| `GlobalSidebar.tsx` | Logo UI (optional) |

---

## 7. Build result

```
npm run build — PASS (10 routes)
```

---

## 8. Open controls after B4.2

| Control | Status after B4.2 |
|---------|-------------------|
| EC-09 manual compare | **CLOSED WITH OBSERVATIONS** |
| `logoFile` persistence across reload | **CARRY FORWARD** — optional; not MVP blocker |
| T2-BUG-09 date locale in DOCX | **CARRY FORWARD** — observed in EC-09 review |
| Tool 1 / Standard Models admin | **Out of scope** (B4.1) |
| Full employee file functional build | **Not started** — next B4 slice |

---

## 9. Scope compliance

| Boundary | Compliant |
|----------|-----------|
| Residual evidence only | **Yes** |
| No Tool 1 / passive modules / full B4 build | **Yes** |
| No fake templates / ZIP / EC-09 | **Yes** |
| No application code changes | **Yes** |
| Baseline ZIP preserved | **Yes** |

---

## 10. Gate recommendation

### **A) Close B4.2**

Both scoped controls were addressed with real evidence:

- **EC-09:** Closed with observations — usable Standardpersonalakte package from real Hetzner templates.
- **logoFile:** Explicitly carried forward with runtime confirmation of non-persistence — not falsely marked PASS.

**Not recommended:**

- **B) Keep B4.2 open** — no blocking evidence gap remains for this gate scope.

**Next (separate gate):** B4 employee file functional build — not started by this report.
