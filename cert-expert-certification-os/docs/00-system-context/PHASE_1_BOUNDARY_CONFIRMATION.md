# Phase 1 — Boundary Confirmation

**Gate decision:** ACCEPT WITH CORRECTIONS  
**Phase:** 1 — Baseline Capture + Regression Mapping only  
**Date:** 2026-06-05  
**No migration, refactor, bugfix, or passive-module implementation in this phase.**

---

## 1. Active module (single)

| Check | Result |
|-------|--------|
| Only `apps/certification-os/modules/03-mitarbeiterakte-tool-2/` is **active** build scope | **Confirmed** |
| All other `apps/certification-os/modules/*` are passive README/scaffold | **Confirmed** |
| `apps/certification-os/` shell is passive (README only) | **Confirmed** |
| `shared/*` is passive except documented boundary stubs | **Confirmed** |
| `docs/*` is documentation only | **Confirmed** |

---

## 2. ZKM placement

| Check | Result |
|-------|--------|
| `zkm-massnahmen/` exists only under `modules/00-dashboard/` | **Confirmed** |
| `pruefvermerke/` exists only under `modules/00-dashboard/` | **Confirmed** |
| No top-level ZKM module | **Confirmed** |
| Related dashboard subfolders (`offene-punkte`, `deadlines`, `audit-readiness-status`) under `00-dashboard/` only | **Confirmed** |

---

## 3. Runtime code in passive areas

| Location | Runtime code? | Notes |
|----------|---------------|-------|
| `modules/00-dashboard/**` | **No** | README only |
| `modules/01-unternehmensakte/` | **No** | README only |
| `modules/02-projektakte/` | **No** | README only |
| `modules/04-qm-auditordner/` | **No** | README only |
| `modules/05-schulungen-unterweisungen/` | **No** | README only |
| `shared/placeholders/` | **No** | Markdown only |
| `shared/document-templates/` | **No** | README only — Tool 1 **not moved here** |
| `shared/audit-log/` | **No** | README only |
| `shared/common-status/` | **No** | README only |
| `shared/storage/storage-adapter.ts` | **Interface stub only** | All methods throw; not wired to UploadThing or Hetzner |
| Legacy Tool 2 code | **Yes** | Remains at `bots/legacy_tools/.../document_creater_tool_employee_file_creater_tool1_2/` — untouched |

**Scope boundary:** No violation detected. Passive modules contain no business logic.

---

## 4. Correction — boundary-only submodules (within active Tool 2)

These folders exist **only** as README boundary placeholders. **No implementation** until a later approved phase.

| Submodule | Status | Allowed now | Not allowed now |
|-----------|--------|-------------|-----------------|
| `evidence/` | **Boundary-only** | README, acceptance references | Upload/mark logic, offene Unterlagen engine |
| `readiness-rules/` | **Boundary-only** | README, control references | Ampel, blocker, readiness evaluator |
| `project-link/` | **Boundary-only** | README, placeholder refs | SDL/project fields, context-scoped release |

**Active implementation submodules** (for future B2+; currently README-only in scaffold):

`employee-file/`, `employee-generator/`, `roles/`, `document-output/`, `acceptance-tests/`, `controls/`

---

## 5. Tool 1 separation

| Rule | Status |
|------|--------|
| Tool 1 code remains in legacy path | **Confirmed — untouched** |
| Tool 1 **not** moved to `shared/document-templates/` | **Confirmed** |
| Tool 2 may **reference** shared templates via legacy UploadThing/API at runtime | Documented dependency only |

See `docs/01-tool-2-handover/EXISTING_CODE_MAPPING.md` § Tool 1 separation.

---

## 6. Storage boundary

| Rule | Status |
|------|--------|
| `storage-adapter.ts` remains minimal interface + throwing stub | **Confirmed** |
| UploadThing not wired in scaffold | **Confirmed** |
| Hetzner not wired | **Confirmed** |
| No persistence provider implemented | **Confirmed** |
| No infrastructure decisions made | **Confirmed** |

Legacy Tool 2 continues to use `lib/uploadthing.ts` directly until a later approved phase.

---

## 7. Phase 1 artefacts

| File | Purpose |
|------|---------|
| `docs/01-tool-2-handover/EXISTING_CODE_MAPPING.md` | Legacy mapping + T2-BUG-01–10 |
| `docs/02-acceptance/TOOL_2_BASELINE_CAPTURE.md` | Baseline evidence template |
| `docs/00-system-context/PHASE_1_BOUNDARY_CONFIRMATION.md` | This document |
