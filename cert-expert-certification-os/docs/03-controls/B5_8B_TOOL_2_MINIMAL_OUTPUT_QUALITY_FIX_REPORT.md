# B5.8b — Tool 2 Minimal Output Quality Fix Report

**Gate:** B5.8b — Minimal output-quality fix slice  
**Status:** **PASS**  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**Prerequisite:** B5.8a PASS WITH CONTROLS (`cac9b50`)

---

## Summary

Implemented the **authorized primary fix**: all Tool 2 generator-injected date placeholder values now output **DD.MM.YYYY** via a shared helper (`formatDocumentOutputDate` / `formatTodayDocumentOutput`). Removed en-US long-date formatting from `generateEmployeeDocs`.

**Secondary investigation ({K}, {F}, {SK}):** Reclassified as **B5.8a inspection false positives** — tokens do not appear in `word/document.xml` plain text of generated or source templates; no mapping fix applied.

**EC-09:** PASS (147 055 bytes, 6 DOCX). **Build:** PASS. No duplicate content introduced. T2-BUG-09a **closed** for generator-controlled dates.

---

## Files changed

| File | Change |
|------|--------|
| `modules/03-mitarbeiterakte-tool-2/employee-file/utils/date.ts` | Added `formatDocumentOutputDate`, `formatTodayDocumentOutput` |
| `modules/03-mitarbeiterakte-tool-2/employee-generator/generate-employee-docs.ts` | Use DD.MM.YYYY helpers for `Birthday`, `StartDate`, `currentDate`, `DocDate` |
| `docs/02-acceptance/evidence/exports/b58b-output-quality-verify.zip` | Post-fix verification package |
| `docs/02-acceptance/evidence/notes/b58b-inspection-results.json` | Structured inspection output |
| `docs/03-controls/B5_8B_TOOL_2_MINIMAL_OUTPUT_QUALITY_FIX_REPORT.md` | This report |

**Not changed:** templates, storage/Hetzner, Tool 1, `.env.local`, UI, persistence, evidence/readiness.

---

## Fixes implemented

### 1. Date formatting (T2-BUG-09a) — **FIXED**

| Placeholder | Before (B5.8a) | After (B5.8b) |
|-------------|----------------|---------------|
| `{Birthday}` | `March 15, 1990` | `15.03.1990` |
| `{StartDate}` | `June 1, 2024` | `01.06.2024` |
| `{currentDate}` | en-US long (generation date) | DD.MM.YYYY (local today) |
| `{DocDate}` | passthrough only | normalized via `formatDocumentOutputDate` when parseable |

**Implementation:** Reused `parseDateInput` / `parseIsoDateLocal` (timezone-safe) from existing employee-file date utils; single output formatter avoids UTC midnight shift on ISO dates.

---

## Findings not fixed (and why)

| Item | Classification | Reason not fixed in B5.8b |
|------|----------------|---------------------------|
| **{K}, {F}, {SK}** | **Not reproducible / false positive** | B5.8a scanned entire DOCX binary; `document.xml` plain text has **no** `{K}`, `{F}`, or `{SK}`. Source templates use canonical placeholders only (e.g. `{Birthday}`, `{StartDate}`). **No mapping change.** |
| **{EndDate}** in training templates | **Template audit carry-forward** | Present in Hetzner training DOCX templates but **not mapped** in generator; no `endDate` in employee schema. Requires business rule + gate — not authorized here. |
| **Footer metadata** (`DocVersion`, `CreatedBy`, etc.) | **Template audit carry-forward** (T2-BUG-09b) | Templates do not reference these tokens; footer standardization not authorized. |
| **Training URKUNDE company block** | **Template audit carry-forward** | Templates omit `{CompanyName}` etc.; not a generator date issue. |
| **T2-BUG-10 duplicate content** | **Not reproduced** | Unchanged; two Unterweisung docs remain distinct. |

---

## Date formatting verification result

**Package:** `docs/02-acceptance/evidence/exports/b58b-output-quality-verify.zip`  
**Method:** Same B5.8a representative input (1 employee, all role + appointment docs).

| Document | en-US long dates | DD.MM.YYYY dates |
|----------|------------------|------------------|
| `01_Jahresweiterbildung … 24UE.docx` | **None** | `15.03.1990`, `01.06.2024` (×2) |
| `02_Jahresweiterbildung … 40UE.docx` | **None** | `15.03.1990`, `01.06.2024` (×2) |
| `Ausgabe Dienstausweis.docx` | **None** | `01.06.2024` |
| `Datenschutz und Vertraulichkeit.docx` | **None** | `01.06.2024` (×2) |
| Both Unterweisung docs | **None** | `01.06.2024` |

**Aggregate:** `anyEnUsLong: false`, `anyDdMmYyyy: true`, `allDocsHaveDdWhereDatesExpected: true`.

**T2-BUG-09a:** **CLOSED** (generator-controlled date outputs).

---

## {K} / {F} / {SK} classification / result

| Token | B5.8a report | B5.8b investigation | Result |
|-------|--------------|----------------------|--------|
| `{K}` | Unreplaced in training output | Not in `document.xml` plain text (generated or template source) | **False positive** — binary scan artifact |
| `{F}` | Unreplaced in 40UE training | Same | **False positive** |
| `{SK}` | Unreplaced in Datenschutz | Same | **False positive** |

**Template source placeholders (Hetzner, sample):**

- Training 24UE/40UE: `{Birthday}`, `{EndDate}`, `{FullName}`, `{StartDate}`
- Datenschutz: `{CompanyAddress}`, `{CompanyEmail}`, `{CompanyName}`, `{FullName}`, `{StartDate}`

**Action taken:** None (correct — not missing mappings for K/F/SK).

---

## EC-09 regression result

| Check | Result |
|-------|--------|
| ZIP generation | **PASS** — `success: true`, 147 055 bytes |
| All 6 DOCX processed | **PASS** |
| Package structure | **PASS** |
| Canonical placeholder replacement | **PASS** — no unreplaced `{Token}` in document body text |
| vs B5.8a baseline | **PASS** — same doc count/structure; date format improved only |

---

## Build result

**Command:** `npm run build`  
**Result:** **PASS** (exit 0, Next.js 16.1.1)

---

## Remaining carry-forwards

| Item | Notes |
|------|-------|
| **T2-BUG-09b** | Footer/global metadata + per-doc-type company blocks — template audit |
| **{EndDate}** | Template expects token; generator/schema lack field — business decision |
| **T2-BUG-10** | Not reproduced at current scope |
| `logoFile` persistence | B4.2 — unchanged |
| Evidence / readiness / ampel | B5.8+ employee file model — out of scope |

---

## Recommendation

### **PASS**

Primary authorized fix complete with EC-09 and build green. Secondary token investigation closed without code change. Template-audit items remain for a future gate if footer/`{EndDate}` standardization is authorized.

---

## Commit

See git log after commit: `fix: normalize Tool 2 generated date output format (B5.8b)`
