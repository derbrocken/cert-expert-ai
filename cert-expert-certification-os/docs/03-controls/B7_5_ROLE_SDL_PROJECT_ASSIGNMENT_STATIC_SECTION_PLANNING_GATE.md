# B7.5 — Role / Zusatzrolle / SDL / Project Assignment Static Section Planning Gate

**Gate:** B7.5 — Role/SDL/project assignment static implementation planning only  
**Status:** **READY FOR B7.6 LIMITED ROLE / SDL / PROJECT ASSIGNMENT STATIC IMPLEMENTATION WITH CONTROLS**  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**Prerequisite:** B7.4 PASS — READY FOR B7.5 PLANNING (`b93f6bb`); B7.2a EC-09 smoke PASS (`7bdcb7b`)  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Primary route:** `/employee-automation`

---

## 1. Gate Decision

### **READY FOR B7.6 LIMITED ROLE / SDL / PROJECT ASSIGNMENT STATIC IMPLEMENTATION WITH CONTROLS**

B7.5 plans the **next smallest safe implementation slice** after B7.4: static, read-only **Role / Zusatzrolle / SDL / Project assignment** overview inside the existing B7.2 profile shell. This gate **authorizes planning only**. It **does not authorize** code changes, persistence, assignment saving, Freigabe logic, or readiness algorithms.

**Next slice (when explicitly prompted):** **B7.6 — Role / Zusatzrolle / SDL / Project Assignment Static Section Enhancement**

---

## 2. Purpose

B7.5 defines how to extend the transitional profile shell with **assignment context display** aligned to B6.4 — without implementing SDL rule engines, project files, release decisions, or DIN evaluation matrices.

This document:

1. Confirms the **verified baseline** after B7.4.
2. Scopes **B7.6** to static assignment placeholders in `EmployeeProfileSectionShell.tsx` only.
3. Lists assignment categories, role glossary, allowed/forbidden wording, and EC-09 rules.
4. Defines B7.6 acceptance criteria, validation steps, and implementation report structure.
5. States **stop conditions** after B7.6.

B7.5 is a **planning gate document** — not an implementation slice.

---

## 3. Source Artefacts

| Artefact | Commit / ref | Role in B7.5 |
|----------|--------------|--------------|
| **B6.4** Role / SDL / project assignment design | `a7c9049` | Assignment ≠ release; Grundrolle / Zusatzrolle / SDL / project semantics |
| **B6.7** Design closure gate | `e448d4e` | CF-10 SDL/project persistence deferred |
| **B7.0** Backlog translation | `ef8af2d` | Epic D — assignment preparation |
| **B7.2** Profile shell | `983de00` | Ten sections; `roles` active read-only; `sdl-project` placeholder |
| **B7.4** Evidence static section | `b93f6bb` | Pattern for static overview component |
| **B7.4 report** | `b93f6bb` | AC template; single-file slice precedent |
| **B7.2a** EC-09 smoke | `7bdcb7b` | Generator baseline unchanged |

**Functional anchor (not re-opened):** B5.2 object boundary; B6.4 assignment ≠ Freigabe.

---

## 4. Current Verified Baseline

| Area | State (post–B7.4) |
|------|-------------------|
| **B7.2 shell** | Ten sections; mounted on `focusEmployee && templatesLoaded` |
| **B7.4 evidence** | `EvidenceStaticOverview` — 10 read-only category rows |
| **`roles` section today** | Read-only queue fields: Grundrolle, role type, overlays; “assignment context only” note |
| **`sdl-project` section today** | Generic `PlaceholderPanel` — **primary B7.6 replacement target** |
| **EC-09** | PASS (B7.2a); generator/queue/storage untouched |
| **Readiness** | Grey **Not evaluated** only |
| **Build** | `npm run build` PASS |

**Runtime assignment data available (read-only hints only):**

- `employee.roleId` → resolved `Role.name` from Hetzner template catalog
- `employee.appointmentIds[]` → overlay names (transitional Zusatzrolle mapping)
- `employee.selectedRoleDocIds` / `selectedAppointmentDocIds` — generator relevance, not assignment identity
- **No** SDL ID, project ID, or object instruction fields in `Employee` schema

---

## 5. B7.6 Candidate Slice — Scope

### **B7.6 — Role / Zusatzrolle / SDL / Project Assignment Static Section Enhancement**

**Objective:** Replace or enhance the current **Role / Zusatzrolle / SDL / Project** placeholders with a **static, read-only assignment overview** — visual/informational preparation only.

**Planned section targets (same file, two nav items):**

| Shell section ID | B7.6 action |
|------------------|-------------|
| `roles` | **Enhance** existing read-only block with structured assignment rows (categories 1, 2, 7–10) + static role glossary |
| `sdl-project` | **Replace** `PlaceholderPanel` with SDL/project assignment rows (categories 3–6) |

**Implementation pattern (mirror B7.4):**

- Add `AssignmentStaticOverview` (or split `RoleAssignmentOverview` + `SdlProjectAssignmentOverview`) **inline in the same file**.
- Derive display hints from existing `employee`, `roles`, `appointments` props only.
- No new React state for assignment persistence.
- No callbacks to queue storage or generator.

**Explicit B7.6 non-goals:**

- Persistence, DB, assignment saving, selection logic, Freigabeentscheidung
- Readiness algorithm, SDL rule engine, DIN decision matrix
- Project file (*Projektakte*), customer portal, Tool 1
- Generator, template, Hetzner/storage changes
- Modifications to B7.4 evidence section content (must remain intact)

---

## 6. Authorized File(s) for B7.6

| File | Allowed change |
|------|----------------|
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeProfileSectionShell.tsx` | **Only** authorized code file |

**New report (B7.6 gate):**

| File | Purpose |
|------|---------|
| `docs/03-controls/B7_6_ROLE_SDL_PROJECT_ASSIGNMENT_STATIC_SECTION_IMPLEMENTATION_REPORT.md` | Implementation evidence |

---

## 7. Forbidden Implementation Areas (B7.6)

| # | Forbidden |
|---|-----------|
| F-1 | Upload / file picker / drag-and-drop |
| F-2 | localStorage / IndexedDB / DB / new `Employee` fields |
| F-3 | Assignment saving, confirmation, or selection persistence |
| F-4 | Freigabeentscheidung / release automation |
| F-5 | Readiness or Ampel computation |
| F-6 | SDL rule engine or requirement calculator |
| F-7 | DIN decision matrix or compliance evaluation |
| F-8 | Project file / company file build |
| F-9 | Customer portal logic |
| F-10 | Tool 1 changes |
| F-11 | `generateEmployeeDocs`, template-storage, Hetzner, API routes |
| F-12 | `EmployeeAutomationPage.tsx`, `EmployeeForm.tsx`, queue storage (unless mounting bug — **stop and report**) |
| F-13 | Changes to B7.4 `EvidenceStaticOverview` behavior |
| F-14 | Package files, `.env.local` |
| F-15 | `hq/`, `bots/`, unrelated reports |

---

## 8. Static Assignment Categories (B7.6 Placeholders)

**Not a final data model. Not a DIN decision matrix.**

| # | Category | Default status (planned) | Data hint source (if any) |
|---|----------|--------------------------|---------------------------|
| 1 | Base role / Grundrolle | **Not evaluated** or **Review required** | `roleId` → `Role.name` |
| 2 | Zusatzrolle / overlay role | **Not assigned** or **Assignment placeholder** | `appointmentIds` → overlay names |
| 3 | DIN 77200-1 SDL pool | **Not implemented** | No SDL pool field — placeholder |
| 4 | DIN 77200-2 special SDL context | **Not implemented** | Placeholder |
| 5 | Project / object assignment | **Not assigned** | No project ID — placeholder |
| 6 | Object-specific instruction requirement | **Open** or **Not applicable** | Placeholder |
| 7 | Qualification relevance | **Not evaluated** | Role name context only |
| 8 | Training / instruction relevance | **Open** | Overlay/doc selection counts (read-only) |
| 9 | Generated document relevance | **Prepared** / **Not selected** | `selectedRoleDocIds` / `selectedAppointmentDocIds` counts |
| 10 | Manual review / decision required | **Review required** | Static — all assignments need human review |

**Section split:**

- **`roles` nav:** categories **1, 2, 7, 8, 9, 10** + role glossary (below)
- **`sdl-project` nav:** categories **3, 4, 5, 6** + cross-note that SDL/project links are not persisted

**Required explanatory notes (both sections):**

- Assignment entries are placeholders only.
- Assignment is **not** a Freigabe or release decision.
- Review is required before any assignment context can affect readiness (future gates).
- ZIP generation does not change assignment, evidence, or readiness status.
- This overview is not a final data model and not a DIN decision matrix.

---

## 9. Static Role Glossary (B7.6 Display Placeholders Only)

**Control:** These labels are **static display placeholders** in B7.6. They must **not** trigger automatic assignment, Freigabe, release, readiness changes, DIN evaluation, or project authorization.

### Base / organizational roles

| Code | Label (DE) |
|------|------------|
| **SMA** | Sicherheitsmitarbeiter / Sicherheitsmitarbeiterin |
| **GF** | Geschäftsführung / Geschäftsführer |
| **BK** | Bürokraft / Verwaltung / Backoffice |

### Leadership / function roles

| Code | Label (DE) |
|------|------------|
| **FK** | Führungskraft |
| **EL** | Einsatzleiter |
| **OL** | Objektleiter |
| **SL** | Schichtleiter |

**Glossary display rules:**

- Show as read-only reference list or muted table — **no** assign/save buttons.
- Do **not** map glossary codes to live `employee.roleId` automatically unless displaying as “catalog reference — not assigned”.
- Hetzner template role (e.g. `din-77200-1-allgemeine`) remains the **actual** queue Grundrolle display; glossary is **supplementary** orientation only.

### Allowed role display wording

- Role placeholder  
- Base role not evaluated  
- Leadership role not evaluated  
- Zusatzrolle not evaluated  
- Review required  

### Forbidden (role/assignment context)

- Freigegeben  
- Einsatzfreigabe erteilt  
- Automatically assigned  
- Automatically released  
- DIN-compliant  
- Audit-ready  
- Certification-ready  

---

## 10. Allowed Status Wording (B7.6)

- Not implemented  
- Not evaluated  
- Open  
- Requires review  
- Not assigned  
- Assignment placeholder  
- Review required  
- Prepared  
- Not selected  
- Not applicable  

---

## 11. Forbidden Wording (B7.6)

Must **not** appear as claims in B7.6 changed files:

- Approved  
- Released  
- Certified  
- DIN-compliant  
- Audit-ready  
- Certification-ready  
- Freigegeben  
- Einsatzfreigabe erteilt  
- Automatisch freigegeben  
- Assignment saved  
- Assignment confirmed  

**Note:** Required negation phrases (e.g. “not a DIN decision matrix”, “not a Freigabe decision”) are **allowed** when negating forbidden claims.

---

## 12. EC-09 Protection Rules

**Stable chain (must remain unchanged through B7.6):**

```
EmployeeForm
  → employee-queue-storage (cert-expert-tool2-employee-queue-v1)
  → doc chip selection
  → generateEmployeeDocs
  → template-storage / Hetzner Object Storage
  → JSZip
  → client ZIP download
```

| Rule | B7.6 |
|------|------|
| Zero generator/template/storage diffs | **Required** |
| ZIP success ≠ assignment status change | Static render only — no post-generate hooks |
| ZIP success ≠ evidence status change | B7.4 evidence section untouched |
| ZIP success ≠ readiness change | **Not evaluated** only |
| Doc chip selection unchanged | Do not wire assignment UI to `selectedRoleDocIds` mutation |

---

## 13. B7.6 Acceptance Criteria

| AC | Criterion |
|----|-----------|
| **AC-01** | Role / assignment section renders inside existing B7.2 shell |
| **AC-02** | Existing B5.7 shell remains intact |
| **AC-03** | Existing B7.4 evidence section remains intact |
| **AC-04** | Existing form remains usable |
| **AC-05** | Queue row selection still works |
| **AC-06** | ZIP generation path remains available and unchanged |
| **AC-07** | Assignment entries are read-only placeholders only |
| **AC-08** | No persistence, DB, assignment saving or selection logic |
| **AC-09** | No automatic Freigabe, release or readiness decision |
| **AC-10** | Readiness remains grey / **Not evaluated** only |
| **AC-11** | ZIP success does not change assignment/evidence/readiness status |
| **AC-12** | No forbidden wording in changed files |
| **AC-13** | `npm run build` passes |
| **AC-14** | Only authorized file(s) changed |
| **AC-15** | Unrelated working tree changes untouched |
| **AC-16** | EC-09 files untouched |

---

## 14. Required B7.6 Build and Smoke Checks

When **Start B7.6** is authorized:

### Before changes

1. `git status --short` — record unrelated changes; do not touch.
2. Confirm branch `b3-tool2-migration`.

### After implementation

1. Forbidden wording grep on `EmployeeProfileSectionShell.tsx`.
2. `npm run build` from `apps/certification-os/`.
3. Visual smoke — `http://localhost:3001/employee-automation`:
   - B5.7 notice, summary, form, sidebar, generate strip, queue
   - B7.4 evidence section still shows 10 categories
   - **Rolle / Zusatzrolle** section shows assignment overview + glossary
   - **SDL / Projektzuordnung** section shows SDL/project placeholders (not generic dashed panel)
4. EC-09 minimum: **Generate & Download ZIP** button available; invoke generate — no error toast.
5. Full ZIP smoke optional if zero generator diff (document rationale per B7.4).
6. `git diff --stat` — only authorized files.
7. Create `B7_6_ROLE_SDL_PROJECT_ASSIGNMENT_STATIC_SECTION_IMPLEMENTATION_REPORT.md`.

### B7.6 commit (when instructed)

```
feat: add static role SDL project assignment overview (B7.6)
```

Stage only:

- `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeProfileSectionShell.tsx`
- `docs/03-controls/B7_6_ROLE_SDL_PROJECT_ASSIGNMENT_STATIC_SECTION_IMPLEMENTATION_REPORT.md`

---

## 15. Required B7.6 Implementation Report Structure

`docs/03-controls/B7_6_ROLE_SDL_PROJECT_ASSIGNMENT_STATIC_SECTION_IMPLEMENTATION_REPORT.md` must include:

1. Gate conclusion (PASS — READY FOR B7.7 PLANNING / PASS WITH CONTROLS / REWORK / BLOCKED)  
2. Scope implemented  
3. Files changed / protected  
4. Assignment section behavior (`roles` + `sdl-project`)  
5. Role glossary display confirmation  
6. EC-09 protection result  
7. B7.4 evidence section regression check  
8. Visual smoke result  
9. Generator / ZIP smoke result  
10. Forbidden wording check  
11. Build result  
12. Acceptance criteria AC-01–AC-16 table  
13. Deviations and defects  
14. Carry-forwards  
15. Commit reference  

---

## 16. Stop Condition After B7.6

**Stop immediately after B7.6** unless a **new explicit gate prompt** authorizes further work.

B7.6 **does not** authorize:

- B7.7 implementation without a separate planning or implementation gate document  
- Evidence upload  
- SDL/project persistence (CF-10)  
- Readiness/Ampel algorithm  
- Profile-level generate  
- Output history  
- Generator/template/Hetzner changes  

**Suggested next planning slice (names only — not authorized):** **B7.7 — Generator Output / Review Section Static Enhancement Planning Gate** or **Training/Unterweisung static section** — to be chosen in a future gate prompt.

---

## 17. B7.5 Validation Record

| Step | Result |
|------|--------|
| 1. `git status --short` (before) | Unrelated changes in `hq/`, `bots/`, `B5_7_*` report — **not touched** |
| 2. B7.5 document created | **Yes** — this file |
| 3. `git status --short` (after) | **One new untracked doc only** — no source files modified |
| 4. Source files unchanged | **Confirmed** — `EmployeeProfileSectionShell.tsx` not modified in B7.5 |
| 5. Implementation | **None** |
| 6. Commit | **Not performed** — awaiting explicit user instruction |

---

## 18. B7.5 Completion Criteria

| AC | Criterion | Met |
|----|-----------|-----|
| AC-1 | B7.5 markdown exists | **Yes** |
| AC-2 | Plans exactly one B7.6 slice | **Yes** — §5 |
| AC-3 | No code in B7.5 | **Yes** |
| AC-4 | Static read-only assignment scope | **Yes** — §5, §8 |
| AC-5 | Forbids upload/persistence/Freigabe/readiness | **Yes** — §7 |
| AC-6 | EC-09 protected | **Yes** — §12 |
| AC-7 | File allow/forbid lists | **Yes** — §6–§7 |
| AC-8 | B7.6 acceptance criteria | **Yes** — §13 |
| AC-9 | Role glossary included | **Yes** — §9 |
| AC-10 | Gate decision wording | **Yes** — §1 |

**B7.5 gate:** **CLOSED** (document created; commit pending user instruction).

---

## 19. Document History

| Version | Date | Event |
|---------|------|-------|
| 1.0 | 2026-06-05 | B7.5 assignment static section planning — READY FOR B7.6 WITH CONTROLS |
