# T2-BUG-03 Regression — Training selection reset on edit

**Bug:** T2-BUG-03  
**Fix:** `components/employee/EmployeeForm.tsx` — preserve doc selections when editing; only auto-select all on new hire or explicit role/appointment change  
**Date:** 2026-06-05

## Test steps (intended)

1. Add employee with role + appointments; deselect subset of core/overlay documents.
2. Save/update employee.
3. Re-open edit without changing role or appointments.
4. Verify only previously selected documents remain checked.
5. Change unrelated field (e.g. fullName) and update — selection unchanged.

## Results

| Step | Result | Evidence |
|------|--------|----------|
| UI checklist verification | **NOT TESTED / EVIDENCE MISSING** | `/api/templates` fails without `UPLOADTHING_TOKEN`; no role/appointment documents rendered |
| Code-level fix review | **PASS (review)** | `initialRoleIdRef` / `initialAppointmentIdsRef` guard effects; `editingEmployee` sync restores saved doc ID sets |

## Code change summary

- On `editingEmployee` change: restore `selectedRoleDocIds` and `selectedAppointmentDocIds` from employee record.
- Skip role auto-select when `selectedRoleId === initialRoleIdRef.current`.
- Skip appointment auto-select when appointment ID set unchanged from edit start.
- When appointments change during edit: add docs for newly added appointments only; remove docs for removed appointments.

## Follow-up required

Re-run full UI protocol when `UPLOADTHING_TOKEN` is available for baseline roles/appointments.
