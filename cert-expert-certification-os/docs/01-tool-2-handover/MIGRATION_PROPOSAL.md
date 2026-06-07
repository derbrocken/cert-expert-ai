# Tool 2 Migration Proposal

**Prerequisite:** Scaffold and `EXISTING_CODE_MAPPING.md` reviewed and approved.

**Principle:** Stabilize before extend (Handover Brief, Build Scaffold B1–B8). No major refactor until B1 baseline is captured.

---

## Phase 0 — Scaffold (complete)

- [x] `cert-expert-certification-os/` folder map
- [x] README per folder (active/passive marked)
- [x] ZKM/Maßnahmen/Prüfvermerke under `00-dashboard/` only
- [x] Placeholder documentation (`shared/placeholders/TOOL_2_PLACEHOLDERS.md`)
- [x] Storage adapter interface (`shared/storage/storage-adapter.ts`)
- [x] Code mapping (this pack)

**Gate:** User review of scaffold + mapping → approve Phase 1.

---

## Phase 1 — B1: Secure baseline (no structure move yet)

**Status:** **Documentation complete** — manual runtime capture pending (see `docs/02-acceptance/TOOL_2_BASELINE_CAPTURE.md`).

| Step | Action | Output |
|------|--------|--------|
| 1.1 | Run `pnpm install && pnpm dev` in legacy path | _Pending — no node_modules in workspace_ |
| 1.2 | Generate ZIP with 1 test employee + 2 appointments | _Pending — needs UPLOADTHING_TOKEN_ |
| 1.3 | Document current placeholder output in baseline employee | _Pending screenshot_ |
| 1.4 | List failing T2-ACC tests against current code | **Done** — `ACCEPTANCE_BASELINE.md`, T2-BUG-01–10 table |

**Completed in Phase 1 (static):** boundary confirmation, legacy mapping, T2-BUG regression table, Tool 1 separation note.

**Do not:** Move files yet.

---

## Phase 2 — B2: Employee file stabilization (bugfixes only)

**Goal:** T2-ACC-01, T2-ACC-02 path clear.

| Step | Target | Change |
|------|--------|--------|
| 2.1 | `employee-file` | Add persistence (minimum: `localStorage` or file-backed JSON via storage adapter) |
| 2.2 | `employee-file` | Fix edit-mode doc selection reset in `EmployeeForm` |
| 2.3 | `employee-file` | Fix `DatePicker`: paste handling, sync `viewDate` when `value` changes |
| 2.4 | `roles` | Add select-all / deselect-all for role + appointment documents |

**Location:** Still in legacy path OR copy to scaffold with symlink — team choice at gate.

**Approved bugs only** — no new features beyond persistence fix.

---

## Phase 3 — B3: Physical migration shell

**Goal:** Tool 2 code lives under scaffold; app still runs.

```
cert-expert-certification-os/
  apps/certification-os/                    ← Next.js app (moved from legacy root)
    modules/03-mitarbeiterakte-tool-2/
      employee-file/                        ← components + types + validations
      employee-generator/                   ← generate-employee-docs
      document-output/                      ← preview API, DocxViewer
      roles/                                ← employee-config, templates API
  shared/                                   ← storage, placeholders
  docs/                                     ← handover, acceptance, controls
```

| Step | Action |
|------|--------|
| 3.1 | Move Next.js app to `apps/certification-os/` |
| 3.2 | Move Tool 2 modules per mapping table |
| 3.3 | Leave Tool 1 (`model-creator`, `send-model-entries`) in `shared/document-templates/legacy/` or keep in app as passive route |
| 3.4 | Update `@/*` imports and `tsconfig` paths |
| 3.5 | Regression: baseline ZIP must match Phase 1 output |

---

## Phase 4 — B3 continued: Generator + placeholders

| Step | Action |
|------|--------|
| 4.1 | Implement placeholder alias map (`GuardIDNumber` → `BewacherId`, etc.) |
| 4.2 | Document formatting fixes (logo EMU scaling — keep existing logic first) |
| 4.3 | Fix duplicate content in combined instruction documents |
| 4.4 | Design for multiple SMA in one document (template loop or section repeat) |

---

## Phase 5 — B4: Evidence module (new)

| Step | Action |
|------|--------|
| 5.1 | Define evidence types per role/overlay in `roles/` |
| 5.2 | UI: mark vorhanden/fehlt/abgelaufen/fachlich zu prüfen/nicht relevant |
| 5.3 | Generate offene Unterlagen list with cause |
| 5.4 | Wire uploads through `StorageAdapter` (UploadThing adapter first) |

**Tests:** T2-ACC-03–07, EC-03, EC-04.

---

## Phase 6 — B5 + B6: Roles + readiness

| Step | Action |
|------|--------|
| 6.1 | Replace demo roles with SMA/Cert-Expert role set |
| 6.2 | Individual `TrainingDate` / `InstructionDate` fields |
| 6.3 | Implement `readiness-rules/` evaluator |
| 6.4 | Surface ampel + blockers in employee-file UI |
| 6.5 | Enforce C-01–C-06 (no green without evidence/review) |

**Tests:** T2-ACC-08–09, N-01–06, EC-05, EC-08, EC-10.

---

## Phase 7 — B7: Project link (minimal)

| Step | Action |
|------|--------|
| 7.1 | Add optional Projekt-ID / SDL reference fields |
| 7.2 | Context-scoped readiness evaluation |
| 7.3 | Placeholders `{ProjectName}`, `{SDLName}` in generator |

**Tests:** T2-ACC-10–12, EC-07.

---

## Phase 8 — B8: Acceptance + controls

| Step | Action |
|------|--------|
| 8.1 | Fill `acceptance-tests/` with T2-ACC evidence |
| 8.2 | Complete Execution Control Sheet EC-01–EC-10 |
| 8.3 | `controls/` sign-off against C-01–C-10 |

**Gate:** ACCEPTED / ACCEPTED WITH CONTROLS / REWORK per `TOOL_2_EXECUTION_CONTROL_SHEET_V1`.

---

## Storage migration path

```
Now:     UploadThing (legacy lib/uploadthing.ts)
Step 1:  UploadThingStorageAdapter implements StorageAdapter
Step 2:  LocalStorageAdapter for dev/offline
Later:   HetznerObjectStorageAdapter (S3-compatible)
```

Tool 2 domain code depends only on `StorageAdapter` interface.

---

## What we explicitly defer

- Dashboard, Unternehmensakte, Projektakte implementation
- QM-/Auditordner assembly
- LMS / full Schulungskalender
- CEKS, Bot-Packs, pricing
- Final UI design
- Deep database schema
- Employee groups (unless approved in backlog after B2)

---

## Recommended review questions

1. Approve Phase 1 baseline capture before any file moves?
2. Persistence: `localStorage` acceptable for B2 interim, or storage adapter immediately?
3. Tool 1: keep in same app (passive route) or split package?
4. UploadThing: wrap as adapter interim OK?
5. Priority order among known bugs after persistence + edit selection fix?

**Awaiting approval before executing Phase 1.**
