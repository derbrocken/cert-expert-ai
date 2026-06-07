# B5.8a — Tool 2 Generator Output Quality Verification Report

**Gate:** B5.8a — Verification only (no code changes)  
**Status:** **PASS WITH CONTROLS**  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**Prerequisite:** B5.7 PASS; EC-09 control closed  
**Scope:** Output-quality inspection of existing Tool 2 generator — **no generator, template, storage, or UI changes**

---

## Summary

Controlled inspection of real Hetzner-backed ZIP output from the unchanged `generateEmployeeDocs` path. **EC-09 ZIP generation passes** (147 069 bytes, 6 DOCX files). **Build passes.**

**Primary findings (all pre-existing / carry-forward — not introduced by B5.7):**

1. **T2-BUG-09a confirmed:** All date fields render in **en-US long format** (e.g. `March 15, 1990`, `June 1, 2024`). **No DD.MM.YYYY** output observed in any inspected document.
2. **T2-BUG-09b partial:** Company/global contact fields populate correctly in **Datenschutz**, **Unterweisung**, and **Dienstausweis** documents when templates include `{CompanyName}` / `{CompanyAddress}` / `{CompanyEmail}`. **Training certificates (Jahresweiterbildung URKUNDE)** do not surface company or footer metadata — templates appear not to include those placeholders.
3. **Footer / standard metadata gap:** Global sidebar values (`documentVersion`, `documentDate`, `createdBy`, `approvedBy`) were supplied in test input but **do not appear** in any generated DOCX — templates inspected do not contain `{DocVersion}`, `{DocDate}`, `{CreatedBy}`, or `{ApprovedBy}` tokens (or `{DocumentDate}` alias).
4. **Template placeholder gaps:** Residual unreplaced tokens `{K}`, `{F}` (training certs) and `{SK}` (Datenschutz) remain in output XML — not mapped in generator `templateData`.
5. **T2-BUG-10:** Two distinct Unterweisung templates share expected employee/company header blocks but **are not duplicate documents** (different body content; low normalized similarity). No harmful combined-instruction duplication observed at this test scope.

**Recommendation:** **PASS WITH CONTROLS** — verification complete; proceed to **B5.8b Minimal Output Quality Fix Slice** only after explicit gate authorization, scoped to bounded items below.

---

## Test environment

| Item | Value |
|------|-------|
| OS | macOS (darwin 25.4.0) |
| App | `cert-expert-certification-os/apps/certification-os` |
| Dev server | `npm run dev -- -p 3001` (running during test) |
| Hetzner templates | Configured `.env.local` present (**not read or modified**) |
| Generator | `modules/03-mitarbeiterakte-tool-2/employee-generator/generate-employee-docs.ts` — **unchanged** |
| Flow | Programmatic call to `generateEmployeeDocs` with catalog from `GET /api/templates` (same path as `/employee-automation` server action) |

### Test input (global properties)

| Field | Value |
|-------|-------|
| Company name | B58a Verify GmbH |
| Company email | verify@b58a-test.local |
| Company address | Musterstraße 12, 10115 Berlin |
| Doc version | v2.1-b58a |
| Doc date | 05.06.2026 |
| Created by | B58a Tester |
| Approved by | B58a Approver |
| Logo | (none) |

### Test input (employee)

| Field | Value |
|-------|-------|
| Full name | B58a Output Quality Employee |
| Birthday | 1990-03-15 |
| Start date | 2024-06-01 |
| Role | `din-77200-1-allgemeine` (all 4 role documents selected) |
| Appointments | `unterweisungen` (both overlay documents selected) |
| Role type / training hours / IDs | Standard / 24 / GRD-B58A-001 / EMP-B58A-001 |

---

## Generated test ZIP / package used

| Artifact | Location |
|----------|----------|
| ZIP | `docs/02-acceptance/evidence/exports/b58a-output-quality-verify.zip` |
| Machine inspection notes | `docs/02-acceptance/evidence/notes/b58a-inspection-results.json` |
| Size | **147 069 bytes** |
| Structure | `B58a Output Quality Employee/` → role folder + `Unterweisungen/` |

```
B58a Output Quality Employee/
  Din 77200 1 Allgemeine/
    01_Jahresweiterbildung_DIN_77200-1_24UE.docx
    02_Jahresweiterbildung_DIN_77200-1_40UE.docx
    Ausgabe Dienstausweis.docx
    Datenschutz und Vertraulichkeit.docx
  Unterweisungen/
    Unterweisungsnachweis_Allgm. Pflichtunterweisung.docx
    Unterweisungsnachweis_Arbeitsschutz_DGUV.docx
```

**Inspection method:** Extract each DOCX `word/document.xml`; strip XML to plain text; regex scan for en-US long dates, DD.MM.YYYY, unreplaced `{Token}` patterns; field-presence checks against test input.

---

## Documents inspected

| # | Document | Employee fields | Company / contact | Dates (observed) | Footer metadata | Unreplaced tokens |
|---|----------|-----------------|-------------------|------------------|-----------------|-------------------|
| 1 | `01_Jahresweiterbildung … 24UE.docx` | FullName ✓ | Not present in template output | `March 15, 1990`; `June 1, 2024` (×2) | Absent | `{K}` |
| 2 | `02_Jahresweiterbildung … 40UE.docx` | FullName ✓ | Not present | Same pattern | Absent | `{F}`, `{K}` |
| 3 | `Ausgabe Dienstausweis.docx` | FullName ✓ | CompanyName ✓ | `June 1, 2024` | Absent | None |
| 4 | `Datenschutz und Vertraulichkeit.docx` | FullName ✓ | CompanyName, Address, Email ✓ | `June 1, 2024` (×2) | Absent | `{SK}` |
| 5 | `Unterweisungsnachweis_Allgm. Pflichtunterweisung.docx` | FullName ✓ | CompanyName, Address, Email ✓ | `June 1, 2024` | Absent | None |
| 6 | `Unterweisungsnachweis_Arbeitsschutz_DGUV.docx` | FullName ✓ | CompanyName, Address, Email ✓ | `June 1, 2024` | Absent | None |

**Date format summary:** **0 / 6** documents contain DD.MM.YYYY. **6 / 6** contain at least one en-US long-date string where dates appear.

---

## Findings table

| ID | Finding | Severity | Classification | Notes |
|----|---------|----------|----------------|-------|
| F-01 | All rendered dates use en-US long format (`Month D, YYYY`) | **Medium** | **Generator formatting issue** | `formatDisplayDate` + `currentDate` in `generate-employee-docs.ts` L47–51, L98–106; confirms **T2-BUG-09a** + B4.2 baseline |
| F-02 | No DD.MM.YYYY output in any inspected document | **Medium** | **Generator formatting issue** | Target format per carry-forward; requires B5.8b if authorized |
| F-03 | Footer metadata (DocVersion, DocDate, CreatedBy, ApprovedBy) not rendered despite test input | **Low–Medium** | **Template placeholder issue** (primary) | Generator supplies keys; templates do not reference them. Possible secondary **placeholder mapping** review for `{DocumentDate}` alias per `TOOL_2_PLACEHOLDERS.md` |
| F-04 | Training URKUNDE docs omit company name / address / email | **Low** | **Template placeholder issue** | By template design — certs focus on employee + training period; not a B5.7/B5.8a regression |
| F-05 | Datenschutz doc fills employee + company + contact correctly | — | **Pass (partial T2-BUG-09b)** | Production review should still sign off visually |
| F-06 | GuardID / EmployeeID / TrainingHours not visible in inspected text | **Low** | **Template placeholder issue** | Generator maps `{GuardIDNumber}`, `{EmployeeIDNumber}`, `{TrainingHours}`; selected templates may not include tokens |
| F-07 | Unreplaced `{K}`, `{F}` (training), `{SK}` (Datenschutz) in output XML | **Medium** | **Template placeholder issue** | Unknown tokens not in generator `templateData`; may be Word artifacts or missing mapping |
| F-08 | Two Unterweisung docs share employee/company header data | **Info** | **Not a defect at this scope** | Expected per-doc headers; bodies differ (1421 vs 1817 chars) |
| F-09 | T2-BUG-10 duplicate combined instruction content | **Not reproduced** | **Not reproducible** (this package) | Distinct templates; no identical boilerplate duplication beyond shared header fields |

---

## Root-cause classification (aggregate)

| Category | Count | Findings |
|----------|-------|----------|
| **Generator formatting issue** | 2 | F-01, F-02 |
| **Placeholder mapping issue** | 0 (primary) | F-03 secondary review only |
| **Template placeholder issue** | 4 | F-03, F-04, F-06, F-07 |
| **Test-data / configuration issue** | 0 | Full test input supplied |
| **Not reproducible** | 1 | F-09 (T2-BUG-10 at this scope) |

---

## EC-09 regression result

| Check | Result |
|-------|--------|
| ZIP generation | **PASS** — `success: true`, 147 069 bytes |
| Hetzner template fetch + process | **PASS** — 6/6 DOCX generated |
| Package structure | **PASS** — employee / role / appointment folders |
| Unreplaced canonical placeholders (`{FullName}`, `{CompanyName}`, etc.) | **PASS** — none in body text for mapped tokens |
| EC-09 vs B5.7 baseline | **PASS** — no regression; same generator path |

---

## Build result

**Command:** `npm run build` (from `apps/certification-os/`)  
**Result:** **PASS** (exit 0)  
**Next.js:** 16.1.1 — TypeScript OK; `/employee-automation` static route present

---

## Scope compliance

| Constraint | Result |
|------------|--------|
| Generator logic modified | **No** |
| Templates modified | **No** |
| Storage / Tool 1 / `.env.local` modified | **No** |
| Persistence / evidence / readiness introduced | **No** |
| B6 / target establishment started | **No** |
| Fixes applied | **No** — verification only |

---

## Recommendation

### **PASS WITH CONTROLS**

B5.8a verification objectives met. Output-quality gaps are **bounded, classified, and pre-existing** (aligned with B5.7 carry-forwards). EC-09 remains healthy.

**Controls / carry-forwards into B5.8b (if authorized):**

1. Normalize generator date output to **DD.MM.YYYY** (F-01, F-02) — generator-only, regression-test EC-09.
2. Audit template ↔ generator placeholder map for `{SK}`, `{K}`, `{F}` and footer tokens (F-03, F-07).
3. Confirm per-document-type requirements for company/footer blocks on training certs (F-04) — may be template updates, not generator.
4. Re-run T2-BUG-10 check with multi-appointment scenarios if scope expands.

---

## Proposed next slice

**B5.8b — Minimal Output Quality Fix Slice** (gate not opened here)

| In scope (if authorized) | Out of scope |
|--------------------------|--------------|
| `formatDisplayDate` / `currentDate` → DD.MM.YYYY | Employee file persistence / evidence / readiness |
| Placeholder alias audit (minimal mapping only) | Template content redesign |
| EC-09 re-smoke after each change | Tool 1 |
| Document which footer tokens templates actually use | B6 |

Proceed only after explicit B5.8b gate authorization with file-level allow list.

---

## Evidence artifacts

| File | Purpose |
|------|---------|
| `docs/02-acceptance/evidence/exports/b58a-output-quality-verify.zip` | Real generated package under test |
| `docs/02-acceptance/evidence/notes/b58a-inspection-results.json` | Structured inspection output |
| `docs/03-controls/B5_8A_TOOL_2_OUTPUT_QUALITY_VERIFICATION_REPORT.md` | This report |

---

## Commit

Suggested: `docs: add B5.8a Tool 2 output quality verification report`
