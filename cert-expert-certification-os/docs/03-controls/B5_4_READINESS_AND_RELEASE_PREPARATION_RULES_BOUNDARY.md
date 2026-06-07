# B5.4 Readiness and Release-Preparation Rules Boundary

**Gate:** B5.4 — Functional readiness and release-preparation rules boundary only  
**Status:** **OPEN** — boundary document; **does not authorize implementation**  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**Prerequisite commit:** `33d5fa1` (B5.3 evidence and required fields)  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Active module:** `modules/03-mitarbeiterakte-tool-2/`

---

## 0. Control Decision

**B5.4 defines functional readiness and release-preparation rules only.**

| Decision | Detail |
|----------|--------|
| What B5.4 does | Names readiness layers, status vocabulary, traffic-light principles, blocker/warning/information boundaries, release-preparation language, evidence/generated-document impact, and audit-readiness contribution |
| What B5.4 does **not** do | Authorize code, UI, routes, technical data model, database, localStorage migration, readiness implementation, final algorithms, numeric thresholds, or automatic release |
| Implementation gate | No B5.5+ work until B5.4 is accepted **and** an explicit follow-up gate (e.g. **“Start B5.5”**) is issued |
| Rule style | Functional rules and severity classes only—**no formulas, weights, or code** |

B5.3 defined Pflichtfelder, evidence catalog, and status vocabulary. B5.4 defines **how those inputs combine into readiness interpretation**—without building the evaluator.

---

## 1. Source Basis

| Source | Use in B5.4 |
|--------|-------------|
| `docs/03-controls/B5_0_TOOL_2_FUNCTIONAL_REDESIGN_BOUNDARY.md` | Areas 10–11 (release prep, audit ampel); EC-05, EC-08, EC-10 |
| `docs/03-controls/B5_1_EMPLOYEE_FILE_CURRENT_STATE_INVENTORY.md` | Current generator has no readiness; queue/ZIP semantics |
| `docs/03-controls/B5_2_EMPLOYEE_FILE_OBJECT_BOUNDARY.md` | Readiness layers on Employee File; C-01–C-06 alignment |
| `docs/03-controls/B5_3_EVIDENCE_AND_REQUIRED_FIELDS_BOUNDARY.md` | Field levels, evidence statuses, blocker vs warning seed |
| `docs/03-controls/HARD_CONTROLS.md` | C-01–C-10 mandatory constraints |
| `docs/02-acceptance/ACCEPTANCE_BASELINE.md` | EC-05 (blocker/rot), EC-07–EC-08, EC-10 |
| Existing Tool 2 generator state | No readiness today—forward mapping reference only |
| `CERT_EXPERT_MVP_SCOPE_BOUNDARY_V1` | MVP cut line — **external artefact**; EC/HARD_CONTROLS interim boundary |

---

## 2. Readiness Principle

**Readiness is not one single status.**

For an Employee File, readiness is a **controlled interpretation** of:

- Employee file completeness (identity, employment, company relation)
- Required-field status (B5.3 §8)
- Evidence status (B5.3 §7)
- Role and overlay context (base + Zusatzrollen)
- Qualification indicators (§34a, Sachkunde, etc.)
- Person-specific instruction/training status
- SDL and project context (when linked)
- Fachliche Prüfung outcomes (checked accepted / rejected / needs review)

**Core principle:** Tool 2 may **support** and **document** release-preparation—it may show that preparation is complete, blocked, or needs review for a **defined context**. It must **not** assert an unchecked automatic release, certification guarantee, or company-wide auditfähig (EC-10, C-05, C-06).

**Readiness is always scoped:** “Ready for what?” must be answerable (e.g. role X, SDL Y, project Z)—never a global “employee is certified” claim (C-01, C-05).

---

## 3. Readiness Layers

Functional layers—**no aggregation algorithms in B5.4**.

| Layer | Question answered | Primary inputs |
|-------|-------------------|----------------|
| **Employee-file completeness readiness** | Is the file structurally maintainable? | Level 1–2 Pflichtfelder, active status |
| **Required-field readiness** | Are applicable Pflichtfelder complete or justified N/A? | B5.3 field statuses |
| **Evidence readiness** | Are required Nachweise accepted or justified? | B5.3 evidence statuses |
| **Qualification readiness** | Are qualification proofs (§34a, Sachkunde) satisfied for context? | Qualification indicators + linked evidence |
| **Instruction/training readiness** | Are person-specific Unterweisungen/Schulungen fulfilled? | Instruction status lines + evidence |
| **Role readiness** | Does role + overlay set match declared context? | Base role, Zusatzrollen assignments |
| **SDL readiness** | For linked SDL, are SDL-scoped requirements met? | SDL reference + conditional requirements |
| **Project readiness** | For linked project, are project-scoped requirements met? | Project reference + object instruction |
| **Release-preparation readiness** | Can preparation checklist be marked complete for defined context? | All above in scope + no rot blockers |
| **Audit-readiness contribution** | What is this file’s impact on audit view? | Summary ampel + open issues—for display, not certification |

**Distinctions:**

| Term | Meaning |
|------|---------|
| **Employee-file completeness** | File exists and core identity/employment fields satisfied—not “audit-ready” |
| **Evidence readiness** | Evidence items resolved per §12—not same as “ZIP generated” |
| **Qualification readiness** | External/regulatory proofs for role—not same as `{RoleType}` text field |
| **Instruction/training readiness** | Person-specific fulfillment—not LMS completion |
| **Release-preparation readiness** | Checklist state for human release gate—not release itself |
| **Audit-readiness** | Controlled traffic-light **contribution**—not full company audit certification |

---

## 4. Allowed Status Vocabulary

### 4.1 Primary traffic-light statuses (user-visible)

| Status | Functional meaning | User display |
|--------|-------------------|--------------|
| **Green / ready for defined context** | No rot in scope; required items accepted or N/A; review done where required (C-01) | **Show** — always with context label (e.g. “Grün für Rolle SMA, SDL-123”) |
| **Yellow / usable with open points** | Open items exist; nachzureichen or fachlich zu prüfen; **not passed** (C-03) | **Show** — list open points |
| **Red / blocked for defined context** | Critical blocker present (C-02) | **Show** — list blockers |
| **Gray / not relevant or out of scope** | Requirement N/A with justification (C-04) | **Show** — with reason |

### 4.2 Supporting statuses (user-visible where helpful)

| Status | Meaning | Display |
|--------|---------|---------|
| **Needs review** | Value or evidence present but fachliche clarification pending | **Show** on item and in open list |
| **Unchecked** | Uploaded/generated artifact not yet reviewed | **Show** on evidence lines |
| **Not enough information** | Context undefined (e.g. no SDL selected for SDL-scoped check) | **Show** — prompt to define context |

### 4.3 Internal / diagnostic statuses (optional UI)

| Status | Meaning | Display |
|--------|---------|---------|
| **Layer not evaluated** | Prerequisite layer incomplete | **Internal** or subdued UI hint |
| **Context not selected** | User has not chosen SDL/project scope | **Show** as “not enough information” |

**Never user-visible as standalone claim:** “Certified,” “Audit-ready (company),” “DIN compliant,” “Automatically released.”

---

## 5. Traffic-Light Boundary

Functional **Ampel** principles (C-01–C-04)—no numeric thresholds.

| Rule | Detail |
|------|--------|
| **Red overrules yellow and green** | Any rot blocker in evaluated context forces red summary (C-02) |
| **Yellow overrules green** | Open non-blocker items prevent green; gelb is not “passed” (C-03) |
| **Gray applies only when truly not relevant** | Requires role/SDL/project justification (C-04)—not a shortcut to green |
| **Green only for defined context** | Must state scope: role, SDL, project, or explicit “file maintenance only” view |
| **No global certification claim** | No “employee is certified” or “company audit-ready” from Tool 2 alone (C-05, C-06) |
| **Multiple contexts** | Same file may be green for one SDL scope and red for another—show per context (C-05) |

---

## 6. Red Blocker Boundary

Conditions that create **rot** for the evaluated readiness context.

| Blocker condition | Trigger | Affected layer | Effect | Notes |
|-------------------|---------|----------------|--------|-------|
| Mandatory identity field missing | Level 1 incomplete (name, DOB, company relation) | Completeness, required-field | **Red** — file not evaluable for release | Blocks all higher layers |
| Active status unclear | Active/inactive not set or contradictory | Completeness | **Red** | e.g. inactive without exit date |
| Base role missing | No Grundrolle assigned | Role, evidence | **Red** | Cannot derive requirements |
| Required evidence missing | Status `required missing` on checklist item | Evidence | **Red** for release-prep in scope | EC-05 |
| Evidence rejected | Status `checked rejected` | Evidence | **Red** | Must correct or waive via human gate |
| Evidence expired (validity matters) | Status `expired` on active requirement | Evidence, instruction | **Red** | e.g. Erste Hilfe on active Ersthelfer |
| Bewacher-ID missing where required | Role/context requires Bewacher-ID field incomplete | Required-field, qualification | **Red** | Security field roles |
| §34a / Sachkunde missing where required | Qualification proof `required missing` | Qualification | **Red** | External proof—not generated DOCX |
| Datenschutz / Verschwiegenheit missing where required | Declaration/evidence open | Evidence, instruction | **Red** when policy marks mandatory | |
| Required instruction/training missing | Instruction status open for mandatory item | Instruction/training | **Red** | Not doc checkbox alone |
| Object-specific instruction missing | Project linked; Objekt-Unterweisung not fulfilled | Project, instruction | **Red** in project context | |
| Role-dependent proof missing | Overlay-triggered proof absent | Role, evidence | **Red** when triggered | e.g. Führungszeugnis for Führungskraft |
| SDL/project condition unmet | Linked context adds requirement still open | SDL/project | **Red** in that context | C-08 |
| Evidence uploaded but not checked (release-critical) | `uploaded unchecked` on item marked release-critical before prep complete | Evidence, release-prep | **Red** for release-prep | Policy: some orgs block until checked |

**Waivers:** Only via **explicit human gate** outside automated logic—never silent auto-waiver (EC-10).

---

## 7. Yellow Warning Boundary

Conditions that create **gelb**—open points, not necessarily rot (unless escalated by policy to §6).

| Warning condition | Trigger | Affected layer | Effect | Notes |
|-------------------|---------|----------------|--------|-------|
| Evidence uploaded but unchecked (non-immediate blocker) | `uploaded unchecked` / `generated unchecked` | Evidence | **Yellow** | Awaiting review (C-03) |
| Validity unclear | Evidence `validity unclear` | Evidence | **Yellow** | Date/scope ambiguity |
| Optional evidence missing | Item optional per role policy | Evidence | **Yellow** or info-only | Policy-dependent |
| Future expiry risk | Accepted evidence nearing expiry (when dates known) | Evidence, instruction | **Yellow** | No auto-expiry algorithm in B5.4 |
| Role/SDL relevance unclear | `needs review` on qualification or context | Role, SDL | **Yellow** | Fachliche clarification |
| Project assignment incomplete | Project ref partial (name only, ID pending) | Project | **Yellow** | Not rot unless mandatory ID required |
| Generated document not signed/accepted | `generated unchecked` on role appointment doc | Evidence | **Yellow** | Prepared ≠ accepted |
| Audit-relevant note open, non-blocking | Informational fachliche note flagged | Audit contribution | **Yellow** | Visible in open list |
| Stale generated package | Output history does not match current file state | Release-prep | **Yellow** | Regenerate or review |
| Field `needs review` | Pflichtfeld value uncertain | Required-field | **Yellow** | |

**Yellow is not “passed”** — release may still proceed to human review, but not as “complete without open points” (C-03).

---

## 8. Information-Only Boundary

Visible but **does not alone** change traffic-light from green (may appear in supplementary lists).

| Case | Rationale |
|------|-----------|
| Out-of-scope notes | e.g. HR comments outside certification scope |
| Non-required evidence | Items with status `not required` |
| Historical generated package | Old ZIP in output history—not current readiness driver |
| Non-active project references | Archived project link on inactive assignment |
| Non-relevant SDL references | Gray with justification (C-04) |
| Archived employee file | No active audit relevance; maintenance/historical view only |
| Optional internal employee ID | When Bewacher-ID suffices |
| Logo / cosmetic generation metadata | B4.2 carry-forward |
| `trainingHours` supplementary text | Not a requirement line |

**Rule:** Information-only items must not be used to imply green for release-prep or audit context.

---

## 9. Release-Preparation Boundary

### 9.1 What Tool 2 **may** say (allowed language)

| Allowed statement | Meaning |
|-------------------|---------|
| **Release-preparation complete for defined role/SDL/project** | Checklist satisfied for stated context; no rot blockers; human release gate still required |
| **Release-preparation blocked** | Rot blocker present for stated context |
| **Release-preparation needs review** | Gelb state; open points documented |
| **Required evidence package prepared** | Artifacts collected/generated; unchecked items listed |
| **Open items controlled** | Offene Unterlagen visible and traceable |

### 9.2 What Tool 2 **must never** say or imply (not allowed)

| Forbidden claim | Reason |
|-----------------|--------|
| Employee **automatically released** without fachliche Prüfung | EC-10 |
| **Certification guaranteed** | C-06 |
| **DIN compliance guaranteed** solely by Tool 2 | No norm engine in MVP |
| **Generated ZIP equals release** | Output ≠ Freigabe |
| **Template generated equals evidence accepted** | B5.3 §5 — unchecked generated status |
| **Company audit-ready** from employee file alone | C-05, C-06 |
| **Green globally** without context label | C-01 |

**“Release-prepared”** means: for a **named context**, preparation checklist is complete, blockers cleared or human-waived, and open yellow items are documented—**ready for human release decision**, not released.

---

## 10. Role-Based Readiness Boundary

Readiness evaluation **uses role + overlays as scope inputs**—no full role matrix in B5.4.

| Role / overlay | Readiness scope effect (functional) |
|----------------|-------------------------------------|
| **SMA / Sicherheitsmitarbeiter** | Stricter evidence/qualification layer; §34a/Sachkunde, Verschwiegenheit, Datenschutz typically in scope |
| **Einsatzkraft** | Field deployment requirements; qualification proofs when applicable |
| **Führungskraft** | Overlay on file—not separate module; may add Führungszeugnis and leadership instruction layers |
| **Bürokraft / Verwaltung** | Lighter field-evidence set; Datenschutz often in scope |
| **Einsatzleitung** | Leadership qualification + instruction layers |
| **Ersthelfer** | Erste Hilfe evidence expiry affects evidence/instruction layers |
| **Brandschutzhelfer** | Conditional fire-safety instruction/evidence when overlay assigned |
| **Objektleiter / Schichtführer** | Object/leadership scope; pairs with project context when linked |

**Rule:** Changing base role or overlay **re-evaluates** applicable layers; may create new open items (B5.3 §9). Readiness is **for the declared role context**, not for all possible roles.

---

## 11. SDL- / Project-Based Readiness Boundary

| Rule | Detail |
|------|--------|
| **Context required** | SDL/project readiness layers evaluate only when reference present and scope selected (C-05) |
| **SDL reference** | May trigger additional requirements; SDL readiness ≠ employee global readiness |
| **Project reference** | May trigger object-specific instruction layer; project readiness ≠ employee readiness alone |
| **DIN 77200-2** | Special contexts acknowledged; **full detail matrix not MVP**—functional hooks only |
| **Full project file** | **Out of scope** — reference IDs/names only (C-08) |
| **Project readiness ≠ employee readiness** | Employee may be green for file maintenance but red for project X |

**Display:** Always pair ampel with context label: “Für Projekt P-123” / “Für SDL S-456” / “Akte allgemein”.

---

## 12. Evidence Impact Rules

How B5.3 evidence statuses affect readiness layers (**functional mapping, no formulas**).

| Evidence status | Typical readiness impact |
|-----------------|---------------------------|
| **not required** | No impact on evaluated layers; information-only if shown |
| **required missing** | **Red** blocker for release-prep in scope |
| **uploaded unchecked** | **Yellow** default; **Red** if release-critical per §6 |
| **generated unchecked** | **Yellow**; prepared output, not accepted proof |
| **checked accepted** | Satisfies that evidence line for readiness; contributes to green **if** no other open items |
| **checked rejected** | **Red** blocker until resolved |
| **expired** | **Red** when validity required for active role/context |
| **validity unclear** | **Yellow** |
| **not applicable** | **Gray** with justification; removes item from blocker set (C-04) |

**Aggregation (principle only):** Worst applicable severity in scope wins for summary ampel (red > yellow > green; gray excluded from “positive” green).

---

## 13. Generated Document Impact Rules

| Rule | Detail |
|------|--------|
| **May support standard employee file output** | EC-09 generator produces Standardpersonalakte package (B5.5) |
| **May create “prepared” status** | Evidence line → `generated unchecked`; visible in open list |
| **Do not prove external qualification** | §34a/Sachkunde/Führungszeugnis require uploaded proof + check |
| **ZIP ≠ completeness** | Batch/single ZIP download does not set green on any layer |
| **Check/signature where relevant** | Role appointment docs may need `checked accepted` before release-prep green |
| **Legacy doc checklists** | `selectedRoleDocIds` / `selectedAppointmentDocIds` = output scope only—not readiness green |

**Principle:** Generation is **downstream** of file state; it does not **upstream** validate evidence.

---

## 14. Audit-Readiness Contribution Boundary

**Tool 2 contributes** to audit-readiness by exposing on the Employee File:

- Completeness of identity, employment, and role context
- Open evidence and offene Unterlagen
- Role-, SDL-, and project-scoped readiness summaries
- Review needs (`needs review`, unchecked items)
- Release-preparation status for defined context

**Tool 2 alone does not claim** full company audit-readiness because:

| Separate scope | Reason |
|----------------|--------|
| **Projektakte** | Project-level documents and status (passive module) |
| **Unternehmensakte** | Company-level policies and records |
| **QM / audit folder** | System-wide audit artifacts |
| **ZKM / Maßnahmen** | Dashboard workflow (passive) |
| **Multi-employee / multi-project aggregation** | Dashboard scope (C-05, C-06) |

**Allowed UI pattern:** “Diese Akte trägt bei: gelb — 2 offene Nachweise für SDL X” (impact display).  
**Forbidden UI pattern:** “Betrieb auditfähig” / “Zertifizierung abgeschlossen” from Tool 2 alone.

Aligns with EC-08 (audit-readiness **impact**) and EC-10 (no unchecked Freigabe/Auditfähigkeit).

---

## 15. Forward Mapping from Current Tool 2

| Current field / concept | Readiness impact now | Future readiness concept | Map forward? | Notes |
|-------------------------|---------------------|--------------------------|--------------|-------|
| Employee queue row | **None** | Employee File scoped evaluation | **No** (as model) | Queue ≠ file |
| `fullName`, `birthday`, `startDate` | **None** (form only) | Level 1–2 field readiness | **Partial** | No ampel today |
| `roleId` | **None** | Role readiness layer | **Yes** | Drives scope |
| `appointmentIds` | **None** | Overlay role scope | **Partial** | Renamed conceptually |
| Appointment/training doc checklists | **None** | Output scope only—not instruction readiness | **Partial** | Legacy confusion |
| Generated role documents | **None** | `generated unchecked` evidence lines | **Partial** | After B5.5 integration |
| Generated appointment documents | **None** | Same | **Partial** | T2-BUG-10 carry-forward |
| Batch ZIP | **None** | Output history; no ampel change | **Partial** | Download ≠ green |
| localStorage persistence | **None** | Persists queue, not readiness | **No** (as model) | |
| Zod validation errors | **Implicit** (blocks submit only) | Required-field incomplete | **Partial** | Not profile ampel |
| Global session sidebar | **None** | Company relation on file | **Partial** | |

**Today:** Tool 2 exhibits **no readiness layers**—inventory confirmed in B5.1.

---

## 16. B5.4 Out of Scope

- No code changes
- No UI or routes
- No technical data model, database tables, or evaluator implementation
- No software architecture or localStorage migration
- No storage redesign
- No Tool 1 redesign
- No full LMS or training calendar
- No full project file, company file, or dashboard
- No customer or partner portal
- No automatic release decisions
- No certification or DIN compliance guarantee
- No final **DIN 77200-2** detail matrix
- No final **algorithms, thresholds, weights, or code formulas**
- No fake evidence, templates, or ZIPs

---

## 17. Gate Criteria for Leaving B5.4

| # | Criterion |
|---|-----------|
| G-1 | This document reviewed and **accepted** (or corrected and re-accepted) |
| G-2 | Readiness layers (§3) and principle (§2) accepted |
| G-3 | Status vocabulary (§4) and traffic-light boundary (§5) accepted |
| G-4 | Red blocker (§6) and yellow warning (§7) boundaries accepted |
| G-5 | Information-only boundary (§8) accepted |
| G-6 | Release-preparation allowed/forbidden language (§9) accepted |
| G-7 | Role-based (§10) and SDL/project-based (§11) boundaries accepted |
| G-8 | Evidence (§12) and generated document (§13) impact rules accepted |
| G-9 | Audit-readiness contribution (§14) accepted |
| G-10 | Forward mapping (§15) and out-of-scope (§16) accepted |
| G-11 | Explicit authorization before B5.5 (e.g. **“Start B5.5”**) |
| G-12 | No application code changed under B5.4 commit |

---

## 18. Recommendation for B5.5

**Open B5.5 — Standard Employee File Output Boundary** as the next controlled slice.

### B5.5 should define (functional / planning only unless gate expands)

1. **Generator integration with Employee File** — when generate is allowed relative to readiness (preconditions, not auto-green)
2. **Output scope** — mapping from file state + role/overlays to template selection (successor to doc checklists)
3. **Output history** — functional record of generated packages vs evidence acceptance
4. **EC-09 regression boundary** — C-09 protection for `generate-employee-docs` pipeline
5. **Generated vs accepted** — how output artifacts attach to `generated unchecked` evidence lines (B5.3 §12)

### B5.5 must not assume

- Readiness evaluator implementation (unless separate gate)
- Evidence upload storage layout (unless separate gate)
- Full UI redesign

### Dependency

B5.5 closes the loop from **file state → output** defined in B5.0–B5.4. Without B5.4, output preconditions would lack controlled readiness rules.

---

## Related documents

| Document | Relationship |
|----------|--------------|
| `B5_3_EVIDENCE_AND_REQUIRED_FIELDS_BOUNDARY.md` | Input statuses and blocker seeds |
| `B5_2_EMPLOYEE_FILE_OBJECT_BOUNDARY.md` | Object layers |
| `HARD_CONTROLS.md` | C-01–C-10 enforcement |
| `ACCEPTANCE_BASELINE.md` | EC-05, EC-08, EC-10 |
