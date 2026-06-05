# employee-file

## Purpose

Mitarbeiterakte core: employee profile, Pflichtfelder, create/edit/save/reopen, and employee queue management.

## What belongs here

- Employee entity and validation (name, birthday, start date, IDs, role selection)
- Pflichtfeld checks and missing-field visibility
- Persistent employee storage (not session-only)
- Employee table / list and edit flow
- Employee groups (when approved in backlog)

## What must not be built here

- Document generation (→ `employee-generator/`, `document-output/`)
- Readiness ampel logic (→ `readiness-rules/`)
- Full HR/payroll suite
- Project/SDL assignment logic (→ `project-link/`)

## Status

**Active**

## Tool 2 connection

Maps from legacy: `components/employee/EmployeeForm.tsx`, `EmployeeTable.tsx`, `lib/types/employee.ts`, `lib/validations/employee-form.ts`, `app/employee-automation/page.tsx` (state).

**Known gaps:** employees currently live in React state only — no persistence (blocks T2-ACC-01).
