# B2 Pre-Fix Behavior Notes (code review — not runtime-invented)

Captured before / independent of B2 fixes. No fabricated pass/fail results.

## T2-BUG-01 Birthday copy-paste

- **Observed (code):** `DatePicker` is a `PopoverButton` only — no text input, no `onPaste`.
- **Runtime UI test:** NOT TESTED / EVIDENCE MISSING (deferred to B2 step 5).

## T2-BUG-02 Employee save/reopen persistence

- **Observed (code):** `app/employee-automation/page.tsx` held employees in `useState` only; reload cleared queue.
- **Expected pre-fix runtime:** Add employee → reload → queue empty.
- **Post-fix test:** See `evidence/protocols/T2-BUG-02-regression.md`.

## T2-BUG-03 Training selection reset on edit

- **Observed (code):** `EmployeeForm` `useEffect` on `selectedRole` reset all `selectedRoleDocIds`; appointment effect reset all overlay docs.
- **Expected pre-fix runtime:** Edit employee with partial doc selection → all docs re-selected on form open.
- **Post-fix UI test with doc checklists:** NOT TESTED / EVIDENCE MISSING — `/api/templates` returns error without `UPLOADTHING_TOKEN`; roles list empty in UI.

## T2-BUG-04 Calendar layout/size instability

- **Observed (code):** `viewDate` not synced when `value` prop changes after edit load.
- **Runtime UI test:** NOT TESTED / EVIDENCE MISSING (deferred to B2 step 5).

## T2-BUG-08 Select-all / deselect-all

- **Observed (code):** No toggle-all in `EmployeeForm`; pattern exists only in Tool 1 `model-creator/page.tsx`.
- **Runtime UI test:** NOT TESTED / EVIDENCE MISSING (deferred to B2 step 5).

## Baseline ZIP (employee document output)

- **Status:** NOT TESTED / EVIDENCE MISSING
- **Reason:** `UPLOADTHING_TOKEN` not configured; `GET /api/templates` → `{"error":"Failed to list templates"}`; generation cannot run.
