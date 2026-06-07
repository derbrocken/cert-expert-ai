# T2-BUG-02 Regression — Employee save/reopen persistence

**Bug:** T2-BUG-02  
**Fix:** `lib/employee-queue-storage.ts` + hydrate/persist in `app/employee-automation/page.tsx`  
**Date:** 2026-06-05

## Test steps

1. Seed or add employee with known field values (name, dates, roleId, doc IDs, global props).
2. Reload browser tab (or close/reopen `/employee-automation`).
3. Verify employee appears in queue with same field values.
4. Click Edit — verify form fields match saved employee.

## Results

| Step | Result | Evidence |
|------|--------|----------|
| Reload restores queue | **PASS** | `evidence/screenshots/B2-T2-BUG-02-persistence-after-reload.png` |
| Global props restored | **PASS** | Screenshot shows Test GmbH / test@example.com / Berlin |
| Edit reopens same data | **PASS** | `evidence/screenshots/B2-T2-BUG-02-edit-employee-reopen.png` — Max Mustermann, dates, SMA, IDs |
| End-to-end via Add Employee UI | **NOT TESTED / EVIDENCE MISSING** | No roles from API without UploadThing token |

## Notes

- Persistence uses `localStorage` key `cert-expert-tool2-employee-queue-v1`.
- Logo `File` object is not persisted; `companyLogo` base64 in `globalProps` would persist if set via sidebar flow.
