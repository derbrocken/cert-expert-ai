# B5.2 Employee File Object Boundary

**Gate:** B5.2 — Functional Employee File object boundary definition only  
**Status:** **OPEN** — boundary document; **does not authorize implementation**  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**Prerequisite commit:** `91c6840` (B5.1 inventory)  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Active module:** `modules/03-mitarbeiterakte-tool-2/`

---

## 0. Control Decision

**B5.2 defines the functional Employee File object boundary only.**

| Decision | Detail |
|----------|--------|
| What B5.2 does | Names the Employee File concept, its minimum functional content, status/evidence/role/training/SDL boundaries, and forward mapping from current Tool 2 |
| What B5.2 does **not** do | Authorize code, UI, routes, technical data model, database, localStorage migration, storage architecture, or implementation |
| Implementation gate | No B5.3+ work until B5.2 is accepted **and** an explicit follow-up gate (e.g. **“Start B5.3”**) is issued |
| Schema rule | Functional groups and concepts only — **no tables, fields types, or persistence design** |

B5.1 confirmed there is no employee-file entity today—only a generator queue. B5.2 defines **what that entity must mean functionally** before any build slice.

---

## 1. Source Basis

| Source | Use in B5.2 |
|--------|-------------|
| `docs/03-controls/B5_0_TOOL_2_FUNCTIONAL_REDESIGN_BOUNDARY.md` | Target identity, 11 functional areas, keep/replace/retire, slice candidates |
| `docs/03-controls/B5_1_EMPLOYEE_FILE_CURRENT_STATE_INVENTORY.md` | Current fields, generator flow, gap analysis, legacy baggage |
| Migrated Tool 2 runtime | `Employee` type, `employee-queue-storage`, `/employee-automation` — **reference only, not modified** |
| `docs/02-acceptance/ACCEPTANCE_BASELINE.md` | EC-01–EC-10 functional anchors |
| `docs/03-controls/HARD_CONTROLS.md` | C-01–C-10 status and release constraints |
| `shared/placeholders/TOOL_2_PLACEHOLDERS.md` | Canonical placeholder / field intent (BewacherId, qualification, training dates) |
| `modules/03-mitarbeiterakte-tool-2/roles/README.md` | SMA / Ersthelfer / Führungskraft as role overlays |
| `modules/03-mitarbeiterakte-tool-2/evidence/README.md` | Evidence status vocabulary (functional alignment) |
| `CERT_EXPERT_MVP_SCOPE_BOUNDARY_V1` | MVP cut line — **external artefact**; in-repo EC/HARD_CONTROLS used as interim boundary until attached |

---

## 2. Definition: Employee File

In the Cert-Expert Certification OS context, an **Employee File** (*Mitarbeiterakte*) is the **controlled, person-level record** used to manage one employee’s certification-relevant state over time.

It is the **unit of work** for Tool 2—not an input row for a ZIP job.

An Employee File functionally holds or references:

- **Identity and employment context** — who the person is and their employment relationship to the operating company
- **Roles and qualifications** — base role, additional/overlay roles, qualification indicators (including SMA-related profile logic)
- **Evidence** — what is required, what is present, what is missing, expired, or under review
- **Instruction/training status** — person-specific requirement and status (not an LMS)
- **SDL/project relevance** — minimal links for release preparation (not a project file)
- **Release preparation and audit-readiness** — controlled status and open issues (no automatic release or audit claims)
- **Output history** — record that a Standardpersonalakte / evidence package was generated (when applicable)—**output is not evidence by itself**

The Employee File exists so an operator can **create, reopen, maintain, and assess** one person’s readiness—not merely batch-generate documents.

---

## 3. Legacy Queue Item vs. Employee File

| Dimension | Legacy generator queue item | Future Employee File | Consequence |
|-----------|----------------------------|----------------------|-------------|
| **Purpose** | Input for next ZIP batch | Ongoing person workspace | UX and navigation change from queue to overview → profile |
| **Identity** | `id` + `fullName` in array | Stable file identity with lifecycle | Reopen same person across sessions as “file,” not “row” |
| **Persistence label** | `employee-queue-storage` snapshot | Employee-file store (TBD in later slice) | B5.2 does not choose storage—only defines object meaning |
| **Primary action** | Add to queue → generate all | Maintain file → assess → generate when justified | Generator becomes subordinate output step |
| **Role semantics** | `roleId` + doc checklists | Base role + overlay roles driving requirements | Appointments/doc IDs are not the role model |
| **Training semantics** | `appointmentIds` + selected doc IDs | Person-specific instruction/training **status** per requirement | Checklist ≠ completed Unterweisung |
| **Evidence** | None | Required checklist + status + uploads/markers | New functional core |
| **Completeness** | Form Zod only | Pflichtfelder + evidence + readiness surfaces | No false “complete” |
| **Company context** | Session `GlobalProperties` for batch | Company **relation** on file; globals not batch-only | Decouple from generator sidebar session |
| **SDL/project** | None | Minimal reference IDs/names | Interface only (C-08) |
| **Release / audit** | None | Preparation status + ampel + open issues | EC-10, C-01–C-06 |
| **Output** | ZIP download = success | Generated package logged; **does not** auto-verify evidence | Generated DOCX ≠ Nachweis |
| **Batch scope** | All queue entries one ZIP | Per-file or controlled batch from file state | Batch may remain but not as center of gravity |

---

## 4. Functional Object Boundary

The Employee File is described as **functional groups** (not a technical schema).

### 4.1 Identity and employment

- Person identity (name, birth date, internal IDs)
- Employment start / relevant dates
- Employment or file **active status** (e.g. active, inactive, archived — functional labels only)
- Link to **employing company context** (which Unternehmen this file belongs to)

### 4.2 Contact / context (if needed for MVP)

- Minimum contact/context fields required by Pflichtfeld rules (MVP set fixed in B5.3)
- Not a full HR contact module

### 4.3 Base role (Grundrolle)

- One primary role assignment per file (e.g. Bewachung, Objektleitung—source: Hetzner role registry)
- Role drives default evidence and document expectations

### 4.4 Additional roles / overlay roles (Zusatzrollen)

- Zero or more overlays (e.g. Ersthelfer, Führungskraft, SMA-related overlays)
- Each overlay may add evidence requirements and instruction requirements
- Overlays are **assignments on the file**, not separate modules

### 4.5 Required evidence

- Derived checklist: base role + overlays + context (minimal SDL/project hook later)
- Each item is a **requirement line**, not a template filename

### 4.6 Uploaded evidence references

- Pointers to person-specific evidence artifacts (upload or external reference)
- Status per item—not the binary file layout (B5.3)

### 4.7 Qualification status

- Person-level indicators tied to role/overlay (e.g. Sachkunde / §34a relevance as **qualification indicators**, not legal auto-interpretation)
- Distinct from “document was generated”

### 4.8 Instruction / training status

- Per-requirement status for this person (required / open / completed / expired / not relevant with justification)
- Optional dates/names at requirement level—not LMS course objects

### 4.9 SDL / project reference

- Minimal links: which SDL(s) and project(s) this employee is relevant for or prepared for
- No project document tree inside the file

### 4.10 Release-preparation status

- Checklist-oriented preparation state for SDL/project release context
- **Never** automatic approval (EC-10, C-05)

### 4.11 Audit-readiness status

- Traffic-light style summary (grün/gelb/rot/grau) with **open issues** list
- Shows **impact** only—no unchecked “auditfähig” (C-06)

### 4.12 Open issues / missing evidence

- Explicit list of blockers and missing items driving gelb/rot
- Traceable to Pflichtfeld, evidence, or instruction gap

### 4.13 Generated employee-file output history (if relevant)

- Record of Standardpersonalakte / ZIP generations: when, which scope, which template set
- **Historical output does not substitute for evidence status**

---

## 5. Minimum MVP Employee File Content

MVP minimum **functional content** that must be representable on an Employee File (not implementation):

| # | MVP content | Functional meaning |
|---|-------------|-------------------|
| 1 | **Employee identity** | Name, person IDs (incl. Bewacher-ID where applicable), birth date |
| 2 | **Employment / active status** | Whether file is active and employments dates for context |
| 3 | **Company relation** | Which company this file belongs to (reference—not full Unternehmensakte) |
| 4 | **Base role** | Single Grundrolle assignment |
| 5 | **Required evidence checklist** | Items required by role + overlays (+ minimal context later) |
| 6 | **Evidence status** | Per-item status (see §8) |
| 7 | **Missing evidence list** | Offene Unterlagen derived from gaps |
| 8 | **Role / qualification indicators** | Overlay roles + qualification-relevant flags (e.g. SMA profile logic on file) |
| 9 | **Instruction/training status** | Person-specific status per requirement—not LMS |
| 10 | **Minimal SDL/project reference** | Optional IDs/names for linked SDL/project |
| 11 | **Release-preparation status** | Preparation checklist state—not approved release |
| 12 | **Audit-readiness status** | Ampel + open issues—not global audit claim |

**Explicit MVP non-content:** LMS catalog, full project file, company file, customer portal, automatic release decision.

---

## 6. Direct Content vs. References

| Concept | Direct / Reference / Out of scope | Reason | Later slice |
|---------|-----------------------------------|--------|-------------|
| **Employee name, birth date, start date** | **Direct** | Core identity / Pflichtfelder | B5.3 (Pflichtfeld rules) |
| **Bewacher-ID** | **Direct** | Person identification; maps from `guardIDNumber` | B5.3 |
| **Internal employee ID** | **Direct** | HR/internal ID distinct from Bewacher-ID | B5.3 |
| **§34a / Sachkunde** | **Direct** (indicator + evidence items) | Qualification/evidence on file—not legal engine | B5.3 |
| **Datenschutz** | **Direct** (requirement + evidence status) | Typical Nachweis/Unterweisung on file | B5.3 |
| **Verschwiegenheit** | **Direct** (requirement + evidence status) | Typical Nachweis on file | B5.3 |
| **Erste Hilfe** | **Direct** (overlay role + instruction/evidence status) | Often Zusatzrolle + expiry | B5.3 |
| **Dienstausweis** | **Direct** (evidence item) | Person-specific Nachweis | B5.3 |
| **Führungszeugnis / Bundesauszug** | **Direct** (evidence item, if applicable) | Role/context-dependent requirement | B5.3 |
| **Führungskraft** | **Direct** (overlay role + indicators) | Role/status on file, not separate module | B5.3 |
| **SMA** | **Direct** (profile/qualification logic on file) | Employee profile logic, not separate SMA module | B5.3 |
| **Training/instruction records** | **Direct** (status + optional dates per requirement) | Person-specific status only (C-07) | B5.3 |
| **Project assignment** | **Reference** (minimal ID/name on file) | C-08—no Projektakte duplication | B5.4 |
| **SDL pool / SDL reference** | **Reference** (minimal ID/name on file) | Release-preparation context only | B5.4 |
| **Object-specific instruction** | **Direct** (file-level status when linked to project/SDL) | Tracked as employee-file relevance | B5.4 |
| **Generated ZIP / Standardpersonalakte** | **Reference** (output history) | Output artifact pointer—not evidence | B5.5 |
| **Role/appointment DOCX templates** | **Reference** (template registry via Hetzner) | Template admin + generator— not embedded in file | B5.5 |
| **Customer contract** | **Out of scope** | Commercial/legal object—not MVP employee file | — |
| **Project file (Projektakte)** | **Out of scope** | Passive module; interface only | B5.4 ref |
| **Company file (Unternehmensakte)** | **Out of scope** | Company relation reference only | — |
| **LMS course content** | **Out of scope** | C-07; no course catalog on file | — |
| **Full training calendar** | **Out of scope** | Not MVP | — |
| **Dashboard KPIs** | **Out of scope** | Passive module | — |
| **Automatic release decision** | **Out of scope** | EC-10 | B5.4 rules |
| **Global company logo for batch** | **Reference** (generation context) | Session global today; not core file identity | B5.5 optional |

---

## 7. Status Concepts

Functional status dimensions on an Employee File. **No algorithms, thresholds, or ampel rules in B5.2**—those belong in B5.4.

### 7.1 Employee file completeness

- **Incomplete** — Pflichtfelder or mandatory identity/context missing
- **Structurally complete** — minimum identity + role present; evidence may still be open
- **Not equivalent to “ready” or “audit-ready”**

### 7.2 Evidence status (per item and summary)

- Per-item states per §8; summary reflects worst relevant item (detail in B5.4)

### 7.3 Qualification status

- **Open** — qualification evidence or review pending
- **Indicated complete** — required qualification Nachweise marked present/checked (with review flag if needed)
- **Not relevant** — with role/context justification (C-04)
- **Does not auto-assert legal compliance**

### 7.4 Instruction / training status (per requirement)

- **Required** — applies to this person via role/overlay/context
- **Open / due** — not yet fulfilled or renewal due
- **Completed** — fulfilled with evidence or controlled manual mark
- **Expired** — past validity where applicable
- **Not relevant** — justified (C-04)

### 7.5 Release-preparation status

- **Not started** / **In preparation** / **Blocked** / **Ready for human review**
- **Never** “Released” or “Approved” without explicit human gate outside automatic logic (EC-10)

### 7.6 Audit-readiness status (traffic light)

Functional labels aligned with HARD_CONTROLS:

| Label | Meaning (functional) |
|-------|----------------------|
| **Grün** | No open rot items in scope; evidence complete per declared rules; review done where required (C-01) |
| **Gelb** | Open items, nachzureichen, or fachlich zu prüfen (C-03) |
| **Rot** | Critical blocker present (C-02) |
| **Grau** | Not relevant in current role/SDL/project context—with justification (C-04) |

**Rule:** Rot overrides gelb/grün; gelb is not “passed”; no unchecked global auditfähig (C-06).

---

## 8. Evidence Concepts

Evidence at **functional level** only—no storage keys, buckets, or upload API in B5.2.

| Concept | Meaning |
|---------|---------|
| **Evidence required** | Item appears on checklist because of role, overlay, or context rule |
| **Evidence uploaded** | Artifact attached or referenced for this person |
| **Evidence missing** | Required, not present, not waived |
| **Evidence expired / validity unclear** | Present but date/expiry requires renewal or review |
| **Evidence checked** | Fachliche or operational review recorded (human gate) |
| **Evidence rejected / needs correction** | Present but not accepted; remains open |
| **Evidence not relevant** | Excluded for this person with documented reason (C-04) |

**Derived lists:**

- **Offene Unterlagen** — missing + expired + rejected + unchecked required items
- **Generated DOCX in ZIP** — **not** automatically “evidence uploaded”

---

## 9. Role and Qualification Concepts

### 9.1 Base roles (Grundrollen)

- One primary role per Employee File at a time (MVP)
- Sourced from Cert-Expert role registry (Hetzner `roles/` templates today—reference only)
- Drives default document and evidence expectations

### 9.2 Additional roles / overlay roles (Zusatzrollen)

- Zero or more overlays (appointments in legacy UI vocabulary)
- Examples: Ersthelfer, Führungskraft, object-specific overlays
- Each overlay **adds** requirements—it does not replace base role

### 9.3 Qualification indicators

- Person-level flags or levels tied to role (e.g. Sachkunde level, SMA qualification profile)
- Maps conceptually from `{QualificationLevel}` / legacy `{RoleType}`—semantic confirmation in B5.3
- **Indicator + evidence**, not automated norm engine

### 9.4 Führungskraft

- **Overlay role + status on the Employee File**—not a separate Führungskraft module
- May trigger additional evidence (e.g. Führungszeugnis where applicable)

### 9.5 SMA

- **Employee profile / qualification logic on the file**—not a standalone SMA module
- SMA-related requirements appear as evidence/instruction items and qualification indicators
- Multiple SMA in one DOCX (T2-BUG-05) remains generator concern, not file object core

---

## 10. Training / Instruction Boundary

Person-specific **instruction/training** on the Employee File:

**In scope (functional):**

- Which Unterweisungen/Schulungen apply to **this person** (from role + overlays + optional project/SDL context)
- Status per item: required, open, completed, expired, not relevant
- Optional date/name fields per requirement for placeholders (`{TrainingName}`, `{InstructionDate}`, etc.)
- Link to evidence where Nachweis is required
- Missing-item contribution to offene Unterlagen and ampel

**Explicitly out of scope:**

- Full LMS, course catalog, customer course creation
- Full training calendar and scheduling system
- Automated “certificate valid” claims without evidence
- Norm interpretation without Fachreview

**Clarification:** Legacy `appointmentIds` + document checklists selected **templates for ZIP**—future instruction status is **requirement fulfillment tracking**, not DOCX inclusion checkboxes alone.

---

## 11. Minimal SDL / Project Reference Boundary

| Rule | Detail |
|------|--------|
| **Employee may be relevant for one or more SDLs** | Store minimal SDL reference (ID and/or display name) on file |
| **Employee may be assigned/prepared for one or more projects** | Store minimal project reference—not Projektakte contents |
| **Object-specific instruction** | When project/SDL linked, additional instruction items may apply **as file-level requirements** |
| **Readiness scoping** | Release preparation and ampel may consider linked SDL/project context (B5.4)—not in B5.2 |
| **Full project file** | **Out of scope** — `02-projektakte/` remains passive (C-08) |
| **No duplication** | Project documents, SDL pools, and company policies are **references**, not copied into file |

---

## 12. Forward Mapping from Current Tool 2

From B5.1 inventory and `types/employee.ts`:

| Current field / concept | Map forward? | Future Employee File concept | Notes |
|-------------------------|--------------|------------------------------|-------|
| `Employee.id` | **Yes** | File identity key | Stable UUID concept carries forward |
| `fullName` | **Yes** | Identity | May split to first/last in B5.3 if Pflichtfeld requires |
| `birthday` | **Yes** | Identity / Pflichtfeld | Required today |
| `startDate` | **Yes** | Employment context | Required today |
| `roleId` | **Yes** | Base role (Grundrolle) | Links to role registry |
| `appointmentIds[]` | **Partial** | Additional roles / overlays | IDs map to overlay assignments—not “appointments” UI label |
| `selectedRoleDocIds[]` | **Partial** | Output scope / template selection | Becomes subordinate to file state + generator (B5.5)—not evidence status |
| `selectedAppointmentDocIds[]` | **Partial** | Output scope for overlay docs | Same as above |
| `roleType` | **Partial** | Qualification indicator | Align with `{QualificationLevel}` semantics in B5.3 |
| `trainingHours` | **Partial** | Supplementary text only | Not instruction status; may remain for placeholder |
| `guardIDNumber` | **Yes** | Bewacher-ID | Canonical `{BewacherId}` |
| `employeeIDNumber` | **Yes** | Internal employee ID | Distinct from Bewacher-ID |
| `useGuardAsEmployeeId` | **No** (UI only) | — | Form UX helper; not stored on file long-term |
| `GlobalProperties` (session) | **Partial** | Company relation + generation context | Not batch-global session; company ref on file |
| `companyLogo` / `logoFile` | **Partial** | Generation context | Optional; carry-forward persistence gap (B4.2) |
| Queue array semantics | **No** | — | Replaced by employee file collection |
| “Employee Queue” UI copy | **No** | Overview + profile | Replaced |
| Batch “Generate all” | **Partial** | Output action from file(s) | May exist but not define file |
| Zod form validation | **Partial** | Input validation layer | Subordinate to Pflichtfeld + evidence rules |
| `employee-queue-storage` | **No** (as model) | Employee file persistence | Interim only; not object definition |
| `roles/employee-config.ts` demo data | **No** | — | Retire; runtime uses Hetzner API |
| Evidence / readiness / project | **N/A (new)** | Core new groups | No current mapping |

---

## 13. Non-Mapping / Legacy Baggage

These **must not drive** the future Employee File design:

| Legacy baggage | Why excluded |
|----------------|--------------|
| **ZIP-first thinking** | Success ≠ download; file state is primary |
| **Appointment checklist = training status** | Doc selection ≠ Unterweisung completed |
| **localStorage queue as source of truth** | Queue snapshot ≠ Mitarbeiterakte |
| **Generated document = verified evidence** | EC-09 output ≠ EC-03 Nachweis |
| **Role template selection = employee readiness** | Template pick ≠ ampel grün |
| **Batch global sidebar** | Company/logo session for all rows ≠ per-file company relation |
| **“Add to queue” lifecycle** | No queue metaphor in file UX |
| **Software-engineer demo roles** | Dead config; not Cert-Expert domain |
| **Standard-models / Tool 1** | Separate tool; not employee file content |

---

## 14. B5.2 Out of Scope

- No code changes
- No UI or routes
- No technical data model, database tables, or TypeScript interfaces
- No software architecture or persistence design
- No localStorage migration
- No storage redesign (Hetzner template boundary closed B3.5)
- No Tool 1 redesign
- No full LMS or training calendar
- No full project file, company file, or dashboard
- No customer or partner portal
- No automatic release or audit-fähig decisions
- No fake evidence, templates, or ZIPs
- No implementation of employee files

---

## 15. Gate Criteria for Leaving B5.2

| # | Criterion |
|---|-----------|
| G-1 | This document reviewed and **accepted** (or corrected and re-accepted) |
| G-2 | Employee File definition agreed vs legacy queue item |
| G-3 | Minimum MVP content list (§5) accepted |
| G-4 | Direct vs reference vs out-of-scope table (§6) accepted |
| G-5 | Status concepts (§7) and evidence concepts (§8) accepted without implementing rules |
| G-6 | Role, training/instruction, and SDL/project boundaries (§9–§11) accepted |
| G-7 | Forward mapping (§12) and non-mapping baggage (§13) accepted |
| G-8 | Explicit authorization before B5.3 (e.g. **“Start B5.3”**) |
| G-9 | No application code changed under B5.2 commit |

---

## 16. Recommendation for B5.3

**Open B5.3 — Evidence and Required Fields Boundary** as the next controlled slice.

### B5.3 should define (functional / planning only unless gate expands)

1. **Pflichtfeld set** for MVP Employee File (identity, employment, company relation minimum)
2. **Evidence type catalog** at functional level—how role + overlays derive required items (§34a, Datenschutz, Erste Hilfe, Dienstausweis, etc.)
3. **Evidence status enum** alignment with §8 and offene Unterlagen derivation rules (still no storage architecture unless gate authorizes)
4. **Qualification indicator rules** vs `{RoleType}` / `{QualificationLevel}` mapping
5. **What remains reference-only** vs direct on file (confirm §6)

### B5.3 must not assume

- Final UI or persistence implementation (unless explicit implementation gate)
- Readiness ampel algorithms (B5.4)
- SDL/project scoping rules (B5.4)
- Generator changes (B5.5)

### Dependency

B5.3 builds on B5.2 object groups §4–§6. Without accepted Employee File boundary, evidence rules would attach to the wrong conceptual object (queue row / template checklist).

---

## Related documents

| Document | Relationship |
|----------|--------------|
| `B5_0_TOOL_2_FUNCTIONAL_REDESIGN_BOUNDARY.md` | Parent redesign boundary |
| `B5_1_EMPLOYEE_FILE_CURRENT_STATE_INVENTORY.md` | Current-state source |
| `HARD_CONTROLS.md` | C-01–C-10 enforcement intent |
| `shared/placeholders/TOOL_2_PLACEHOLDERS.md` | Field/placeholder naming |
| `B5_0_EMPLOYEE_FILE_FUNCTIONAL_BUILD_BOUNDARY.md` | Alternate slice numbering (backlog) |
