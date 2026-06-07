# Tool 2 Baseline Capture

**Phase:** 1 — Baseline Capture + Regression Mapping  
**Gate:** ACCEPT WITH CORRECTIONS  
**Status:** Evidence template — **no test execution results recorded** (not invented)

---

## 1. Legacy root

```
bots/legacy_tools/existing_tools_systems/document_creater_tool_employee_file_creater_tool1_2/
```

---

## 2. Files reviewed (Phase 1 static analysis)

### Tool 2 — employee automation

| File | Reviewed |
|------|----------|
| `app/employee-automation/page.tsx` | Yes |
| `app/actions/generate-employee-docs.ts` | Yes |
| `components/employee/EmployeeForm.tsx` | Yes |
| `components/employee/EmployeeTable.tsx` | Yes |
| `components/employee/GlobalSidebar.tsx` | Yes |
| `components/ui/DatePicker.tsx` | Yes |
| `lib/types/employee.ts` | Yes |
| `lib/validations/employee-form.ts` | Yes |
| `lib/data/employee-config.ts` | Yes |
| `lib/utils/date.ts` | Yes |
| `app/api/templates/route.ts` | Yes |
| `lib/uploadthing.ts` | Yes (dependency — not scaffold) |

### Shared legacy infrastructure (Tool 2 dependency)

| File | Reviewed | Tool 2 dependency |
|------|----------|-------------------|
| `app/api/uploads/route.ts` | Yes | Template upload for roles/appointments |
| `app/api/uploads/folder/route.ts` | Yes | Template folders |
| `app/api/preview/route.ts` | Yes | Optional DOCX preview |
| `app/uploads/page.tsx` | Yes | Template admin UI |

### Tool 1 — frozen (not modified; not baseline-tested here)

| File | Note |
|------|------|
| `app/model-creator/page.tsx` | Tool 1 — untouched |
| `app/actions/send-model-entries.ts` | Tool 1 — untouched |
| `app/api/standard-models/route.ts` | Tool 1 — untouched |
| `components/document/DocumentForm.tsx` | Tool 1 — untouched |

### Scaffold (Certification OS)

| File | Reviewed |
|------|----------|
| `cert-expert-certification-os/docs/01-tool-2-handover/EXISTING_CODE_MAPPING.md` | Yes |
| `cert-expert-certification-os/docs/00-system-context/PHASE_1_BOUNDARY_CONFIRMATION.md` | Yes |
| `cert-expert-certification-os/shared/storage/storage-adapter.ts` | Yes (stub only) |

---

## 3. Runnable status

| Check | Result | Evidence |
|-------|--------|----------|
| `node_modules` present in legacy path | **No** | Filesystem check 2026-06-05 |
| `.env` / `UPLOADTHING_TOKEN` present | **No** | Filesystem check 2026-06-05 |
| `pnpm dev` executed in Phase 1 | **No** | Not run — dependencies not installed |
| `pnpm build` executed in Phase 1 | **No** | Not run |
| Prior DOCUMENTATION.md claims app runs with token | **Documented** | Legacy `DOCUMENTATION.md` — unverified this session |

**Conclusion:** Runnable status is **unknown in this session**. Code structure review confirms a standard Next.js 16 App Router project. Template listing and generation require `UPLOADTHING_TOKEN` per legacy docs.

---

## 4. Working / broken / unknown (code-review basis only)

| Function | Assessment | Basis | EC / bug link |
|----------|------------|-------|---------------|
| Add employee to in-session queue | **Working** (in-session) | State append in page | — |
| Employee persistence across reload | **Broken** | No storage | EC-01, T2-BUG-02 |
| Edit employee | **Partial** | Form loads; doc selection resets | T2-BUG-03 |
| Birthday/start date via calendar | **Working** (click path) | DatePicker click handler | — |
| Birthday/start date via paste | **Broken** | No paste handler | T2-BUG-01 |
| Calendar month sync on edit load | **Broken / unstable** | `viewDate` not synced to `value` | T2-BUG-04 |
| Role/appointment template list API | **Unknown** | Needs UploadThing + running server | — |
| Generate employee ZIP | **Unknown** | Needs templates + token | EC-09 |
| Select-all / deselect-all docs | **Missing** | No UI in EmployeeForm | T2-BUG-08 |
| Per-training dates | **Missing** | No data fields | T2-BUG-07 |
| Employee groups | **Missing** | Not implemented | T2-BUG-06 |
| Multiple SMA in one DOCX | **Missing** | Single-employee templateData | T2-BUG-05 |
| Document formatting quality | **Unknown** | Needs generated sample | T2-BUG-09 |
| Duplicate combined instruction content | **Suspected** | Code path analysis | T2-BUG-10 |
| Evidence / readiness / project-link | **Not implemented** | No legacy code | EC-03–08, EC-10 |
| Pflichtfeld validation (form) | **Working** | Zod in `employee-form.ts` | EC-02 partial |
| Readiness ampel / blockers | **Not implemented** | — | EC-05, EC-10 |

---

## 5. Acceptance evidence — available / missing

| Evidence item | Status | Location / note |
|---------------|--------|-----------------|
| Legacy file mapping | **Available** | `EXISTING_CODE_MAPPING.md` |
| T2-BUG-01–10 regression table | **Available** | `EXISTING_CODE_MAPPING.md` |
| Boundary confirmation | **Available** | `PHASE_1_BOUNDARY_CONFIRMATION.md` |
| Baseline ZIP export | **Missing** | Requires install + token + manual generate |
| Screenshot — employee form | **Missing** | Placeholder: `evidence/screenshots/T2-BASE-01-employee-form.png` |
| Screenshot — generated DOCX | **Missing** | Placeholder: `evidence/screenshots/T2-BASE-02-docx-output.png` |
| Screenshot — edit doc selection bug | **Missing** | Placeholder: `evidence/screenshots/T2-BASE-03-edit-selection-reset.png` |
| Test protocol T2-ACC-01 | **Missing** | Placeholder: `evidence/protocols/T2-ACC-01.md` |
| Baseline ZIP hash | **Missing** | Placeholder: `evidence/exports/baseline-employee.zip` + SHA256 note |
| EC-01–EC-10 filled status | **Partial** | `ACCEPTANCE_BASELINE.md` — code-review only |

---

## 6. Manual capture checklist (next human step — not done in Phase 1)

Execute after `pnpm install`, `.env` with `UPLOADTHING_TOKEN`, and `pnpm dev`:

- [ ] **T2-BASE-R01** — Start dev server; confirm `/employee-automation` loads
- [ ] **T2-BASE-R02** — Add one test employee; capture screenshot
- [ ] **T2-BASE-R03** — Generate ZIP; save as `evidence/exports/baseline-employee.zip`
- [ ] **T2-BASE-R04** — Record SHA256 of baseline ZIP
- [ ] **T2-BASE-R05** — Reload page; confirm employee lost (documents T2-BUG-02)
- [ ] **T2-BASE-R06** — Edit employee with deselected docs; confirm reset (documents T2-BUG-03)
- [ ] **T2-BASE-R07** — Paste date into birthday; confirm failure (documents T2-BUG-01)

**Results:** _Not recorded — awaiting manual execution._

---

## 7. Regression baseline for future B2

Before any bugfix, capture:

1. Baseline ZIP from checklist above
2. Field values used for test employee (name, dates, role, appointments, selected doc IDs)
3. List of selected `selectedRoleDocIds` / `selectedAppointmentDocIds` before edit

After B2 bugfixes, re-run same inputs and compare ZIP + field persistence.

---

## 8. Phase 1 completion statement

| Item | Done |
|------|------|
| Scaffold boundaries confirmed | Yes |
| Boundary-only submodules corrected | Yes |
| T2-BUG-01–10 mapped | Yes |
| Tool 1 separation documented | Yes |
| Storage stub unchanged / unwired | Yes |
| Invented test results | **None** |
