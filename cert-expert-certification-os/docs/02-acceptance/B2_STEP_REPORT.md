# B2 Step Report — Approved Bugfix Scope (T2-BUG-01, 02, 03, 04, 08)

**Gate:** ACCEPT WITH CONDITIONS — B2 approved bugfix slice **CLOSED WITH OPEN CONTROLS**  
**Scope:** Legacy path only — no migration, no Tool 1 changes  
**Date:** 2026-06-05  
**Closure date:** 2026-06-05

---

## B2 closure control

**Final gate status:** B2 approved bugfix slice — **CLOSED WITH OPEN CONTROLS**

This closure applies **only** to the approved B2 bugfix slice (T2-BUG-01, 02, 03, 04, 08). It does **not**:

- close full Tool 2 acceptance
- approve EC-09
- approve full document generation regression
- approve or start migration B3

### Closed / accepted

| ID | Status |
|----|--------|
| **T2-BUG-01** Birthday copy-paste | Fixed and manually verified |
| **T2-BUG-02** Employee save/reopen persistence | Fixed and manually verified for localStorage persistence path |
| **T2-BUG-03** Training/document selection reset on edit | Code fixed; localStorage behavior verified; full UI checkbox verification pending |
| **T2-BUG-04** Calendar layout/size instability | Fixed and manually verified by screenshot |
| **T2-BUG-08** Select-all / Deselect-all trainings | Code fixed; full UI button verification pending |

### Open controls (carried forward)

| Control | Status |
|---------|--------|
| Baseline employee ZIP | **NOT TESTED / EVIDENCE MISSING** |
| EC-09 Standardpersonalakte regression comparison | **BLOCKED** until baseline ZIP exists |
| T2-BUG-03 full UI doc-checklist verification | **PENDING** — requires templates / `UPLOADTHING_TOKEN` |
| T2-BUG-08 Select All / Deselect All UI verification | **PENDING** — requires templates / roles |
| T2-BUG-02 add-via-UI without localStorage seed | **NOT TESTED** |
| `logoFile` persistence | Known risk; **not part of approved B2 scope** |

---

## Baseline ZIP location

| Item | Status |
|------|--------|
| Employee document output ZIP | **NOT TESTED / EVIDENCE MISSING** |
| Reason | No `UPLOADTHING_TOKEN`; `/api/templates` returns error; generate pipeline cannot run |
| Intended path | `docs/02-acceptance/evidence/exports/baseline-employee.zip` |
| EC-09 regression comparison | **BLOCKED** until baseline ZIP exists |

---

## Screenshots captured

| File | Description |
|------|-------------|
| `evidence/screenshots/B2-T2-BUG-01-birthday-paste-persist.png` | Edit form after paste → save → reload; birthday `22.08.1988` |
| `evidence/screenshots/B2-T2-BUG-02-persistence-after-reload.png` | Queue + global props after localStorage reload |
| `evidence/screenshots/B2-T2-BUG-02-edit-employee-reopen.png` | Edit form with persisted employee fields |
| `evidence/screenshots/B2-T2-BUG-04-calendar-open.png` | Birthday calendar open (new employee form) |
| `evidence/screenshots/B2-T2-BUG-04-calendar-open-edit.png` | Birthday calendar open on edit form; fixed grid, no layout shift |

Pre-fix / other bugs: `evidence/notes/B2-PRE-FIX-BEHAVIOR.md`

---

## Files changed (legacy path only)

| File | Change |
|------|--------|
| `lib/employee-queue-storage.ts` | **New** — localStorage load/save for employee queue + global props (T2-BUG-02) |
| `app/employee-automation/page.tsx` | Hydrate on mount; persist on employees/globalProps change (T2-BUG-02) |
| `lib/utils/date.ts` | **New** — `parseDateInput`, `parseIsoDateLocal`, `formatIsoDisplay` (T2-BUG-01, T2-BUG-04) |
| `components/ui/DatePicker.tsx` | Text input + paste/blur/Enter parsing; fixed trigger height; fixed panel width; 6-row calendar grid; local date parsing (T2-BUG-01, T2-BUG-04) |
| `components/employee/EmployeeForm.tsx` | Preserve doc selections on edit; guarded auto-select effects (T2-BUG-03); Select All / Deselect All for role + appointment docs (T2-BUG-08) |

**Documentation (scaffold only):** this report, evidence screenshots, regression protocols

**Tool 1 files touched:** none  
**Passive modules / evidence / readiness / project-link:** documentation placeholders only

---

## Bugs fixed

| ID | Status | Notes |
|----|--------|-------|
| **T2-BUG-01** | **Fixed** | Paste/type `DD.MM.YYYY` or `YYYY-MM-DD`; invalid input reverts on blur without crash; persists via localStorage |
| **T2-BUG-02** | **Fixed** | localStorage persistence; reload + edit reopen verified |
| **T2-BUG-03** | **Fixed (code)** | Doc selections preserved on edit; `selectedAppointmentDocIds` verified in localStorage after field edit. **Full UI doc-checklist test blocked** without templates |
| **T2-BUG-04** | **Fixed** | Calendar open/close uses fixed dimensions; 6-row grid prevents height jump; `viewDate` syncs from value |
| **T2-BUG-08** | **Fixed (code)** | Select All / Deselect All buttons for Core + Overlay documents. **UI interaction NOT TESTED** — buttons require loaded role/appointment doc lists |

---

## Bugs not touched (per gate)

| ID | Status |
|----|--------|
| T2-BUG-05 | Excluded — multiple SMA per document |
| T2-BUG-06 | Excluded — groups creation/usage |
| T2-BUG-07 | Excluded — date per training |
| T2-BUG-09 | Excluded — document formatting |
| T2-BUG-10 | Excluded — duplicate content in combined documents |

---

## Manual test results

| Test | Result |
|------|--------|
| **T2-BUG-01** paste `22.08.1988` → Update → localStorage `birthday: 1988-08-22` | **PASS** |
| **T2-BUG-01** reload → edit reopen shows `22.08.1988` | **PASS** |
| **T2-BUG-01** invalid date `99.99.9999` on blur reverts without crash | **PASS** |
| **T2-BUG-01** `parseDateInput` unit check (tsx) | **PASS** |
| **T2-BUG-02** reload persistence | **PASS** |
| **T2-BUG-02** edit reopen fields | **PASS** |
| **T2-BUG-02** add-via-UI full flow | **NOT TESTED / EVIDENCE MISSING** |
| **T2-BUG-03** `selectedAppointmentDocIds` preserved after editing another field (localStorage) | **PASS** |
| **T2-BUG-03** doc-checklist UI on edit (checkboxes visible) | **NOT TESTED / EVIDENCE MISSING** — no templates |
| **T2-BUG-04** calendar open on birthday field; no layout shift observed | **PASS** (screenshot) |
| **T2-BUG-04** month navigation / day select stability | **PASS** (visual + a11y snapshot) |
| **T2-BUG-08** Select All / Deselect All button click | **NOT TESTED / EVIDENCE MISSING** — no role/appointment doc lists without UploadThing |
| **T2-BUG-08** code review — buttons only affect doc sets; edit guards unchanged | **PASS** |
| Baseline ZIP generation | **NOT TESTED / EVIDENCE MISSING** |
| `npm run build` | **PASS** (Next.js 16.1.1, 2026-06-05) |
| Dev server `http://127.0.0.1:3000/employee-automation` | **PASS** (`npx next dev -H 127.0.0.1 -p 3000`) |

Protocols: `evidence/protocols/T2-BUG-02-regression.md`, `evidence/protocols/T2-BUG-03-regression.md`

---

## Build result

```
npm run build — PASS
Next.js 16.1.1 (Turbopack)
Compiled successfully; TypeScript OK; 12 routes generated
```

---

## Evidence still missing

| Control | Status |
|---------|--------|
| Baseline employee ZIP | **NOT TESTED / EVIDENCE MISSING** |
| EC-09 regression comparison | **BLOCKED** (depends on baseline ZIP) |
| T2-BUG-03 full UI doc-checklist verification | **PENDING** — requires `UPLOADTHING_TOKEN` + templates |
| T2-BUG-08 Select All / Deselect All UI verification | **PENDING** — requires templates/roles loaded |
| T2-BUG-02 add-via-UI end-to-end (without localStorage seed) | **NOT TESTED** |

---

## Known remaining risks

1. **localStorage only** — not cross-browser/sync; acceptable minimal B2 fix per gate; not `StorageAdapter`.
2. **T2-BUG-03 / T2-BUG-08 UI unverified** — needs UploadThing + roles/appointments to exercise checklists and bulk-select buttons.
3. **Baseline ZIP missing** — EC-09 regression comparison not possible until token + templates available.
4. **Logo file** — `logoFile` state not persisted separately from `globalProps.companyLogo`.
5. **Date paste via native clipboard** — handler supports paste event; automation used synthetic `input` event; manual clipboard paste not separately recorded.

---

## Scope compliance

| Rule | Compliant |
|------|-----------|
| Legacy path only | Yes |
| No migration to `apps/certification-os/` | Yes |
| No Tool 1 changes | Yes |
| No evidence/readiness/project-link logic | Yes |
| No passive module implementation | Yes |
| No final UI design / data model / architecture | Yes |
| No storage architecture change beyond minimal localStorage | Yes |
| No audit-readiness or freigabe claims | Yes |

**Scope violated?** No

---

## Next gate recommendation

B2 approved bugfix slice is closed. Choose the next gate:

| Option | Description |
|--------|-------------|
| **A)** | Run Template/UploadThing evidence retest before B3 |
| **B)** | Open B3 migration preparation with open controls carried forward |
| **C)** | Rework B2 only if T2-BUG-03 or T2-BUG-08 UI retest fails later |

### Recommended: **B) Open B3 migration preparation with open controls carried forward**

Proceed with B3 **preparation only** (planning, mapping, controls documentation). Do **not** migrate code until a separate B3 prompt is explicitly approved.

Option A remains valuable in parallel or before B3 execution to close open controls (baseline ZIP, T2-BUG-03/08 UI, EC-09). Option C applies only if a later template-enabled UI retest fails.
