# B5.0 Tool 2 Functional Redesign Boundary

**Gate:** B5.0 — Functional redesign boundary definition only  
**Status:** **OPEN** — boundary document; **does not authorize implementation**  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**Latest prerequisite commit:** `445395e` (B4.5b)  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Active module:** `modules/03-mitarbeiterakte-tool-2/`

---

## 0. Control Decision

**B5.0 opens the controlled functional redesign boundary for Tool 2 only.**

| Decision | Detail |
|----------|--------|
| What B5.0 does | Defines keep / replace / retire boundaries, target functional identity, and planning candidates for later slices |
| What B5.0 does **not** do | Authorize code, UI, data model, storage architecture, or implementation work |
| Implementation gate | No B5.x implementation may start until B5.0 is accepted **and** an explicit follow-up gate (e.g. “Start B5.1”) is issued |
| Evidence rule | No fake templates, fake ZIPs, or fabricated EC evidence in any future slice |

**Prerequisites closed before B5.0:** B2, B3, B3.5, B4.1, B4.2, B4.3, B4.4, B4.5, B4.5a, B4.5b.

---

## 1. Current State

### 1.1 What exists today (migrated Certification OS app)

Tool 2 is restored as a **legacy-style employee document generator** at `/employee-automation`, not yet as a Cert-Expert employee-file workspace.

| Area | Current condition |
|------|-------------------|
| **Entry point** | `/employee-automation` via landing page and navbar |
| **Primary workflow** | Add employees to a queue → select role and appointment/training documents → generate ZIP of DOCX files |
| **Persistence** | `employee-queue-storage` (browser `localStorage`) — queue survives reload; not a workforce/employee-file system |
| **Templates** | Role and appointment DOCX templates from Hetzner Object Storage via `/api/templates` (B3.5 closed) |
| **Upload admin** | `/uploads` — roles, appointments, standard-models CRUD on Hetzner (B4.1 closed) |
| **Generation** | `generate-employee-docs` server action — fetches templates from Hetzner, fills placeholders, returns ZIP (EC-09 working) |
| **Employee data** | Name, birthday, start date, role, selected appointment docs, company globals in sidebar |
| **Evidence** | **Absent** — no upload/mark/status for person-specific Nachweise |
| **Readiness / ampel** | **Absent** — no grün/gelb/rot/grau, no offene Unterlagen list |
| **Project / SDL** | **Absent** — no assignment or release-preparation context |
| **Freigabe / audit claims** | **Absent** — no release workflow; no unchecked audit-ready UI (EC-10 not violated because nothing is claimed) |
| **Scaffold placeholders** | `evidence/`, `readiness-rules/`, `project-link/` — README boundary only |

### 1.2 Legacy mental model (still dominant in UI and code shape)

```
Employee form input
  → pick role
  → pick trainings / appointments (document checkboxes)
  → add to queue
  → generate ZIP
```

The UI language still refers to a **“queue”** and **“generate documents”**, not to maintaining an employee file, checking evidence, or preparing release.

### 1.3 Acceptance baseline gap (EC-01–EC-10)

Per `docs/02-acceptance/ACCEPTANCE_BASELINE.md` (updated by B2–B4 work where noted):

| EC | Function | Migrated status |
|----|----------|-----------------|
| EC-01 | Create and save employee | **Partial** — localStorage queue, not employee-file entity |
| EC-02 | Required fields | **Partial** — Zod on form; no profile-level Pflichtfeld surfacing |
| EC-03 | Evidence upload/mark | **Not started** |
| EC-04 | Open documents list | **Not started** |
| EC-05 | Blocker / rot | **Not started** |
| EC-06 | Primary + overlay roles | **Partial** — Hetzner templates; selection tied to generator, not file maintenance |
| EC-07 | SDL/project release prep | **Not started** |
| EC-08 | Audit-readiness impact | **Not started** |
| EC-09 | Standard employee file output | **Working** — ZIP generation from real Hetzner templates |
| EC-10 | No unchecked release/audit claims | **Not started** (no claims shown) |

### 1.4 Infrastructure already closed (reuse, do not redesign)

- Hetzner Object Storage for templates (`lib/template-storage.ts`) — B3.5
- Upload Manager for template categories — B4.1
- Residual evidence controls and EC-09 baseline method — B4.2
- Tool 1 surface restored separately — B4.4 / B4.5 (out of Tool 2 redesign scope)

---

## 2. Problem Statement

The restored Tool 2 solves **document batch generation** for a list of employees. Cert-Expert operations require **ongoing employee-file management** with evidence, qualification status, and controlled release preparation.

| Old generator model | Cert-Expert target model |
|--------------------|---------------------------|
| One-shot: fill form, pick docs, export ZIP | Continuous: create employee → maintain file over time |
| Success = ZIP downloaded | Success = file complete, evidence tracked, readiness visible, output when justified |
| Role/appointment = checkbox list for templates | Roles + Zusatzrollen drive required evidence and doc sets |
| Trainings = which DOCX to include | Person-specific Schulung/Unterweisung **status** (not an LMS) |
| No gap visibility | Offene Unterlagen, Pflichtfelder, blockers explicit |
| No audit/release semantics | Audit-readiness traffic light + open issues; Freigabe **preparation** only |
| Queue in browser storage | Durable employee file the operator returns to |

**Core gap:** The generator treats the employee as **input to a ZIP job**. Cert-Expert needs the employee as **the unit of work** — a Mitarbeiterakte that accumulates state, evidence, and readiness before document output.

---

## 3. Target Functional Identity

**Tool 2 becomes an employee-file, evidence, qualification, release-preparation, and audit-readiness engine** inside the Certification OS.

It is **not**:

- A general HR system
- An LMS or training calendar
- A full Projektakte or Unternehmensakte
- A company dashboard
- An automatic release or audit-certification authority

It **is**:

- The **person-level** workspace for Cert-Expert certification operations
- The place where Pflichtfelder, Nachweise, Rollen, and person-specific instruction status are maintained
- The place where SDL/project context is **referenced** (minimal) for release preparation
- The place where readiness (ampel) and open issues are shown **without** unchecked green or auditfähig claims (C-01–C-06, EC-10)
- The place where **Standardpersonalakte / evidence package output** is produced from real templates when the file state justifies generation — as **one output action** of a maintained file, not the sole purpose of the tool

**North-star operator flow:**

```
Create employee
  → maintain employee file (profile, Pflichtfelder)
  → assign roles and additional roles
  → track person-specific training/instruction status
  → manage person-specific evidence (upload/mark)
  → see evidence status and offene Unterlagen
  → optionally link minimal SDL/project reference
  → prepare release (checklist, no auto-approve)
  → see audit-readiness traffic light and open issues
  → generate standard employee file / evidence package (when appropriate)
```

---

## 4. Keep / Replace / Retire Boundary

| Legacy item | Keep / Replace / Retire | Reason | Later slice (candidate) |
|-------------|-------------------------|--------|-------------------------|
| Hetzner template storage + `/api/templates` | **Keep** | Closed, working; roles/appointments drive doc sets | Reuse in all generator slices |
| `generate-employee-docs` DOCX/ZIP pipeline | **Keep** (harden) | EC-09 working; regression-sensitive (C-09) | B5.5 (output boundary) |
| Upload Manager (`/uploads`) for template admin | **Keep** | B4.1 closed; separate from employee evidence | Out of B5 employee-file scope |
| Employee form fields (name, dates, role, appointments) | **Keep** (extend) | Valid input capture; insufficient alone for employee file | B5.2 (object boundary) |
| Zod employee form validation | **Keep** (align) | Form validation exists; must align with Pflichtfeld rules | B5.3 |
| `EmployeeTable` queue list | **Replace** | Queue UX ≠ Mitarbeiterübersicht / employee overview | B5.1 |
| “Add to queue” / queue-centric copy | **Replace** | Wrong mental model for employee file | B5.1 |
| `employee-queue-storage` (localStorage queue) | **Replace** (interim upgrade) | Interim persistence only; not employee-file store | B5.2 |
| Role/appointment checkbox → generate flow | **Replace** | Becomes profile sections + readiness-gated output | B5.3, B5.5 |
| `GlobalSidebar` company globals + session logo | **Keep** (carry forward) | Used in generation; logo persistence optional (B4.2 carry-forward) | B5.5 |
| Static/demo role config (`employee-config` pattern) | **Retire** | Replaced by Hetzner `/api/templates` in migrated app | Done (B3.5) |
| UploadThing runtime | **Retire** | Replaced by Hetzner (B3.5) | Closed |
| In-memory-only employee state | **Retire** | B2 addressed via localStorage; still not employee file | B5.2 |
| Generator-as-home-page workflow | **Replace** | Home becomes overview → profile → readiness → output | B5.1+ |
| Evidence module | **Replace** (new) | Did not exist in legacy generator | B5.3 |
| Readiness / ampel / blockers | **Replace** (new) | Did not exist | B5.4 |
| Project/SDL link | **Replace** (new, minimal) | Did not exist | B5.4 |
| Freigabe preparation workflow | **Replace** (new) | Did not exist; must not auto-approve | B5.4 |
| Tool 1 model creator / standard-models generator | **Keep separate** | Different tool; B4.4–B4.5 restored; not Tool 2 | Out of scope |
| `/api/preview` ephemeral DOCX preview | **Keep** (optional) | Utility; not core employee file | As needed |
| Date locale in generated DOCX (T2-BUG-09) | **Keep** (carry forward) | Known observation; not blocking boundary | Optional B5.5 |

---

## 5. Functional Areas

Each area below is **in scope for the Tool 2 redesign** at a functional level. B5.0 defines boundaries only; implementation is deferred to B5.1+.

### 5.1 Employee overview (Mitarbeiterübersicht)

**Need:** List all employee files with enough summary to choose whom to work on (name, role, readiness summary, open issue count).

**Not:** A company-wide dashboard, KPI board, or cross-module analytics.

### 5.2 Employee profile (Mitarbeiterprofil)

**Need:** Single place to open, edit, and revisit one employee’s file — the primary workspace replacing “edit row in queue.”

**Not:** Full HR record (payroll, contracts archive, performance management).

### 5.3 Required fields (Pflichtfelder)

**Need:** Declared mandatory fields per MVP rules; visible missing fields on profile/overview; no false “complete” when gaps remain (EC-02).

**Not:** Deep configurable field engine or norm auto-interpretation.

### 5.4 Evidence status (Nachweisstatus)

**Need:** Per-employee status for required evidence items (e.g. vorhanden / fehlt / abgelaufen / zu prüfen / nicht relevant with justification per C-04).

**Not:** Automated norm compliance engine or fake/demo evidence.

### 5.5 Upload/storage for person-specific evidence

**Need:** Employee-scoped evidence upload or status marking using **existing** Hetzner patterns (controlled key prefix); real files only.

**Not:** New storage architecture (B3.5 closed); not template admin (Upload Manager).

### 5.6 Standard employee file output (Standardpersonalakte)

**Need:** Retain and harden ZIP/DOCX generation from Hetzner role/appointment templates; triggered from employee file when selections and rules allow (EC-09, C-09).

**Not:** One-off generator page as the main entry point; not output without traceable employee state.

### 5.7 Roles and additional roles (Grundrolle + Zusatzrollen)

**Need:** Primary role and overlay roles from Hetzner templates drive required docs and evidence expectations (EC-06).

**Not:** Org-chart management or permission system.

### 5.8 Person-specific training/instruction status (no LMS)

**Need:** Track which Schulungen/Unterweisungen apply to **this person** and their status (e.g. due, completed, open) as inputs to readiness and doc selection (C-07).

**Not:** Full LMS, course catalog, or training calendar (`05-schulungen-unterweisungen/` remains passive).

### 5.9 Minimal SDL/project assignment interface

**Need:** Store optional Projekt-ID / SDL reference on the employee file for scoped release preparation (EC-07, C-08).

**Not:** Build Projektakte, project document tree, or SDL workflow engine (`02-projektakte/` passive).

### 5.10 Release preparation (no unchecked automatic release)

**Need:** Checklist-style **preparation** capturing what is ready vs blocked; explicit human gate; never auto-approve Freigabe or auditfähig (EC-10, C-05, C-06).

**Not:** Automatic release, digital signature workflow, or customer-facing portal.

### 5.11 Audit-readiness traffic light and open issues

**Need:** Employee-level grün/gelb/rot/grau from declared rules; rot overrides; open issues list; show audit **impact** only (EC-08, C-01–C-04).

**Not:** Global “company audit-ready” claim or dashboard module (`00-dashboard/` passive).

---

## 6. Generator-to-Employee-File Transformation

### 6.1 Conceptual shift

| Dimension | Document generator (today) | Employee-file engine (target) |
|-----------|---------------------------|------------------------------|
| **Primary object** | Queue entry | Employee file |
| **Primary action** | Generate ZIP | Maintain file; generate when justified |
| **Navigation** | Single page: form + table + generate | Overview → profile → sections (evidence, roles, readiness) |
| **Role/appointments** | Checkboxes for template inclusion | Drive requirements, evidence, and output set |
| **Persistence** | localStorage snapshot of queue | Durable file record (minimal store first; no deep DB in early slices) |
| **Success signal** | Download started | Readiness visible; blockers explicit; output optional step |
| **Training** | Implicit via appointment doc names | Explicit person-specific status fields |

### 6.2 What the generator becomes

The existing **`generate-employee-docs` pipeline remains the output engine** but is **subordinate** to the employee file:

1. **Input** comes from employee profile state (fields, role, overlays, selected docs, globals) — not from a detached one-off form session.
2. ** Preconditions** (future slices) may require minimum Pflichtfelder or evidence status before generate is enabled — without fabricating green.
3. **Output** remains real DOCX/ZIP from Hetzner templates (EC-09); no fake packages.
4. **UI** moves “Generate Standardpersonalakte” to a profile/output action, not the center of the landing experience.

### 6.3 Submodule mapping (scaffold, no implementation in B5.0)

| Target concern | Scaffold path |
|----------------|---------------|
| Overview + profile + Pflichtfelder | `employee-file/` |
| DOCX/ZIP generation | `employee-generator/` + `document-output/` |
| Role template binding | `roles/` |
| Evidence | `evidence/` (boundary until B5.3) |
| Readiness rules | `readiness-rules/` (boundary until B5.4) |
| SDL/project reference | `project-link/` (boundary until B5.4) |
| Freigabe prep + hard controls | `controls/` |

---

## 7. Controlled Slice Proposal After B5.0

**Planning candidates only.** Names, acceptance criteria, and evidence requirements will be fixed in slice-open gates. **Do not implement until explicitly authorized.**

| Slice | Purpose | Depends on |
|-------|---------|------------|
| **B5.1 — Employee File Current-State Inventory** | Document migrated vs legacy files, EC gap matrix, and generator touchpoints; confirm inventory before structural changes | B5.0 accepted |
| **B5.2 — Employee File Object Boundary** | Define minimal employee-file entity (fields, identity, persistence strategy) replacing queue model; overview + profile shell | B5.1 |
| **B5.3 — Evidence and Required Fields Boundary** | Pflichtfeld rules + minimal evidence types, status enum, offene Unterlagen derivation; Hetzner key convention for person evidence | B5.2 |
| **B5.4 — Readiness / Release Preparation Rules** | Minimal ampel rules, blockers, SDL/project ID fields, Freigabe preparation checklist (no auto-approve) | B5.3 |
| **B5.5 — Standard Employee File Output Boundary** | Harden generator integration with employee file state; EC-09 regression; output preconditions | B5.2 (parallel with B5.3–B5.4 only if gate approves) |

**Explicit:** These are not started in B5.0. A separate document (`B5_0_EMPLOYEE_FILE_FUNCTIONAL_BUILD_BOUNDARY.md`) may contain alternate slice numbering for backlog reference; **this document’s slice list is the B5.0 planning candidate set** until reconciled in a slice-open gate.

---

## 8. Out of Scope

The following are **hard exclusions** for Tool 2 redesign and all B5.x slices unless a new boundary gate says otherwise:

| Exclusion | Notes |
|-----------|-------|
| Tool 1 redesign | Model creator, standard-models generator — separate gates (B4.4–B4.5 closed) |
| Full LMS | Module `05-schulungen-unterweisungen/` passive |
| Full training calendar | C-07 — person-specific status only |
| Full project file (Projektakte) | Module `02-projektakte/` passive; IDs/reference only |
| Full company file (Unternehmensakte) | Module `01-unternehmensakte/` passive |
| Full dashboard / ZKM / audit folder UI | Module `00-dashboard/` passive |
| Deep data model / new database architecture | Minimal persistence extensions only; C-10 |
| Final UI design / design system | Functional flows only |
| Pricing, customer portal, partner portal | Product/commercial scope |
| New storage architecture | Hetzner boundary closed (B3.5) |
| Fake evidence, fake templates, fake ZIPs | Hard controls and evidence gates |
| Unchecked automatic Freigabe or auditfähig claims | EC-10, C-01, C-06 |
| Implementation in B5.0 | This gate is documentation-only |

---

## 9. Gate Criteria for Leaving B5.0

All must be true before **any** B5 implementation slice (B5.1+) starts:

| # | Criterion |
|---|-----------|
| G-1 | This document reviewed and **accepted** (or corrected and re-accepted) |
| G-2 | Keep / replace / retire table agreed — no ambiguity on generator vs employee-file center of gravity |
| G-3 | Eleven functional areas acknowledged as in-scope **functionally**, with §8 exclusions acknowledged |
| G-4 | Fachliche `*_V1` artefacts attached or traceability path confirmed (`ACCEPTANCE_BASELINE.md`, `HARD_CONTROLS.md`, handover briefs) |
| G-5 | Explicit authorization message issued (e.g. **“Start B5.1”**) — not implied by merging this doc |
| G-6 | B2–B4.5b remain closed; no parallel storage or Tool 1 work required as blocker |
| G-7 | No code, UI, or data-model changes landed under B5.0 commit |

---

## 10. Cursor / Developer Instruction

```
B5.0 = DOCUMENTATION ONLY

DO:
  - Create / update docs/03-controls/B5_0_TOOL_2_FUNCTIONAL_REDESIGN_BOUNDARY.md
  - Reference closed gates B2–B4.5b and in-repo acceptance/control docs
  - Commit only this document when requested

DO NOT:
  - Change application code, UI, API routes, or storage logic
  - Design or implement data models
  - Run npm run build unless documentation tooling requires it
  - Start B5.1 or any implementation slice
  - Touch Tool 1, hq/, bots/legacy_tools/, or unrelated local changes
  - Commit .env.local or secrets
  - Create fake evidence or templates
```

**Suggested commit message:** `docs: define Tool 2 functional redesign boundary (B5.0)`

---

## Related documents

| Document | Role |
|----------|------|
| `docs/02-acceptance/ACCEPTANCE_BASELINE.md` | EC-01–EC-10 |
| `docs/03-controls/HARD_CONTROLS.md` | C-01–C-10, N-01–N-07 |
| `docs/01-tool-2-handover/EXISTING_CODE_MAPPING.md` | Legacy file map |
| `docs/03-controls/B4_3_LEGACY_TOOL_INTEGRATION_READINESS_REPORT.md` | Pre-B5 assessment |
| `docs/03-controls/B5_0_EMPLOYEE_FILE_FUNCTIONAL_BUILD_BOUNDARY.md` | Alternate slice detail (backlog reference) |
| `modules/03-mitarbeiterakte-tool-2/README.md` | Module scaffold boundaries |
