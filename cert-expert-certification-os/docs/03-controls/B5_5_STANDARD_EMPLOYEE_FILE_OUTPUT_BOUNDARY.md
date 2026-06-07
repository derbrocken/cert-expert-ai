# B5.5 Standard Employee File Output Boundary

**Gate:** B5.5 — Functional Standard Employee File Output boundary definition only  
**Status:** **OPEN** — boundary document; **does not authorize implementation**  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**Prerequisite commit:** `9c5a49e` (B5.4 readiness and release-preparation)  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Active module:** `modules/03-mitarbeiterakte-tool-2/`

---

## 0. Control Decision

**B5.5 defines the functional Standard Employee File Output boundary only.**

| Decision | Detail |
|----------|--------|
| What B5.5 does | Names output definition, MVP output types, preconditions, draft/prepared/checked states, output history concept, EC-09 protection, readiness impact, and legacy generator transition |
| What B5.5 does **not** do | Authorize code, UI, routes, data model, database, storage changes, generator refactor, template changes, output history implementation, or breaking EC-09 ZIP |
| Implementation gate | No implementation until B5.5 is accepted **and** a separate gate (e.g. **B5.6 Implementation Readiness**) explicitly authorizes a slice |
| Evidence rule | Real Hetzner templates and real ZIP only in regression; no fake EC-09 evidence |

B5.0–B5.4 defined the Employee File, evidence, and readiness rules. B5.5 defines **what Tool 2 may export** and **how exports relate to evidence and readiness**—without changing `generate-employee-docs`.

---

## 1. Source Basis

| Source | Use in B5.5 |
|--------|-------------|
| `docs/03-controls/B5_0_TOOL_2_FUNCTIONAL_REDESIGN_BOUNDARY.md` | Generator as subordinate output; EC-09; functional area 6 |
| `docs/03-controls/B5_1_EMPLOYEE_FILE_CURRENT_STATE_INVENTORY.md` | Current batch ZIP flow, `generate-employee-docs`, doc checklists |
| `docs/03-controls/B5_2_EMPLOYEE_FILE_OBJECT_BOUNDARY.md` | Output history group; generated ≠ evidence |
| `docs/03-controls/B5_3_EVIDENCE_AND_REQUIRED_FIELDS_BOUNDARY.md` | Evidence statuses, generated vs uploaded, blocking rules |
| `docs/03-controls/B5_4_READINESS_AND_RELEASE_PREPARATION_RULES_BOUNDARY.md` | Output impact on readiness; forbidden claims |
| Current Tool 2 generator | `modules/.../employee-generator/generate-employee-docs.ts`, `/employee-automation` |
| `docs/03-controls/B4_2_RESIDUAL_EVIDENCE_CONTROLS_REPORT.md` | EC-09 baseline ZIP closed with observations |
| `docs/03-controls/HARD_CONTROLS.md` | C-09 stabilization; C-06 no audit claims |
| `docs/02-acceptance/ACCEPTANCE_BASELINE.md` | EC-09 Standardpersonalakte |
| `shared/placeholders/TOOL_2_PLACEHOLDERS.md` | Placeholder / document field mapping |

---

## 2. Output Principle

**Generated output is a controlled artifact** produced from Employee File data (or interim queue data during transition) and selected Hetzner DOCX templates.

| Principle | Meaning |
|-----------|---------|
| **Supports preparation** | Output may support audit preparation, release-preparation documentation, and operator workflow |
| **Not source of truth** | Employee File state remains authoritative |
| **Not accepted evidence by default** | Generated DOCX starts as **generated unchecked** (B5.3) unless explicitly checked |
| **Not release** | ZIP download ≠ Freigabe (B5.4 §9) |
| **Not certification / DIN guarantee** | No compliance or certification claims from generation alone (C-06) |
| **EC-09 protected** | Existing working ZIP path remains regression baseline until explicit replacement gate (C-09) |

---

## 3. Standard Employee File Output Definition

A **Standard Employee File Output** (*Standardpersonalakte-Output* / evidence package export) is a **structured output package** for one or more employees containing:

| Component (functional) | Purpose |
|------------------------|---------|
| **Generated standard documents** | Role/overlay DOCX from Hetzner templates with placeholders filled |
| **Employee-file summary** | Identity, role, key dates (when included in package design) |
| **Missing-items overview** | Offene Unterlagen / open points at time of generation (when B5.3+ rules exist) |
| **Evidence checklist references** | List or summary of required evidence lines and status at generation time (optional in MVP package) |

**Clarifications:**

| Statement | Detail |
|-----------|--------|
| **Not the employee file itself** | Export is a snapshot artifact; file state lives in Employee File store |
| **Not the source of truth** | Edits to file after export do not retroactively change the export |
| **Not proof that uploaded evidence is accepted** | External Nachweise require upload + check (B5.3) |
| **Export / preparation artifact** | Used for download, handoff, audit sample, or human review |

Current implementation produces **ZIP of DOCX folders only**—summary/checklist components are **future package enrichments**, not present today (B5.1).

---

## 4. Legacy Batch ZIP vs Future Standard Employee File Output

| Dimension | Current batch ZIP | Future Standard Employee File Output | Consequence |
|-----------|-------------------|-------------------------------------|-------------|
| **Source of truth** | React queue + localStorage | Employee File record | Generate reads file state, not anonymous queue row |
| **Employee context** | All queued employees one action | Per-file or controlled multi-file from file selection | No implicit “generate everyone in queue” as primary UX |
| **Evidence status** | Ignored | Preconditions + snapshot in package optional | Incomplete evidence may warn or block per §6 |
| **Readiness effect** | None | May set **prepared** / `generated unchecked`; never auto-green (B5.4 §13) | Output downstream of readiness rules |
| **Output history** | None | Conceptual history record per §9 | Audit trail of what was generated when |
| **Audit use** | Ad-hoc download | Audit sample package with open-item snapshot | Supports EC-08 **contribution**, not certification |
| **Limitations** | No preconditions; no metadata | Draft/prepared labeling; explicit warnings | Safer operator semantics |
| **Technical engine** | `generate-employee-docs` + JSZip | Same engine **transitionally** (§10) | C-09—no break without gate |
| **Template selection** | `selectedRoleDocIds` / `selectedAppointmentDocIds` checklists | Derived from file role/overlays + output policy | Checklists reframed, not proof of training |

---

## 5. MVP Output Types

Functional catalog—**MVP** = first Employee File output slice after implementation gate, not current runtime.

| Output type | MVP? | Generated from | Preconditions | Readiness effect | Notes |
|-------------|------|----------------|---------------|------------------|-------|
| **Single employee standard file package** | **Yes** | One Employee File + role/overlay template set | §6 minimum or warning tier | `generated unchecked` on doc lines; no auto-green | Primary MVP target |
| **Multi-employee package** | **Conditional** | Selected files or legacy batch | Same per employee | Per-employee prepared status | May retain transitional batch |
| **Missing-items / offene Unterlagen list** | **Conditional** | File state at generate time | File evaluable | Visibility only; may accompany ZIP | PDF/Markdown/DOCX—format TBD at implementation |
| **Evidence checklist summary** | **Conditional** | B5.3 evidence lines snapshot | Evidence module exists | Informational in package | Not substitute for evidence store |
| **Datenschutz declaration** | **Yes** (if template exists) | Role/overlay DOCX template | Template in Hetzner | `generated unchecked` | Generated ≠ signed proof |
| **Verschwiegenheit declaration** | **Yes** (if template exists) | Same | Same | Same | |
| **Role/function appointment document** | **Yes** | Role template selection | Base role assigned | `generated unchecked` | Maps from core role docs |
| **Instruction/training record document** | **Conditional** | Appointment/overlay templates | Overlays selected | `generated unchecked`; not instruction **completed** | Legacy appointment docs |
| **Dienstausweis-related document** | **Conditional** | Template if in bucket | Role/context requires | `generated unchecked` | Upload proof separate |
| **ZIP bundle** | **Yes** | JSZip wrapper | EC-09 compatible structure | Output history entry | Current format preserved transitionally |
| **Audit sample package** | **Conditional** | Single/multi file + open-item snapshot | Operator initiates | Supports audit prep only | No “audit passed” label |
| **Historical output record** | **Yes** (concept) | Metadata of past generation | After any generate | Archived; stale warning if file changed (B5.4) | §9—no DB in B5.5 |

---

## 6. Output Preconditions

Precondition **levels** (functional)—no algorithms or numeric thresholds.

| Level | Name | Meaning | Typical MVP behavior |
|-------|------|---------|----------------------|
| **P0** | Minimum generation allowed | Level 1 Pflichtfelder + base role sufficient to fill templates | Allow generate with **warnings** if evidence incomplete |
| **P1** | Generation with warnings | Gelb open items present | Generate; label package **prepared** with warning manifest |
| **P2** | Generation blocked | Rot blockers for selected context (B5.4 §6) | Block or require explicit override via human gate (EC-10) |
| **P3** | Draft / prepared only | Evidence incomplete or unchecked | Output state **draft** or **prepared**; not “accepted package” |
| **P4** | Generation after evidence accepted | Release-critical items `checked accepted` | Allow **preparation complete** labeling for context—not auto-release |

**Answers to precondition questions:**

| Question | B5.5 functional answer |
|----------|-------------------------|
| Which preconditions for generate? | At minimum P0; policy may require P4 for labeled “release-prep package” |
| Generate if evidence incomplete? | **Yes** at P0/P1 with warnings (transitional parity with today’s ZIP); stricter policy in P2+ slices |
| Must mark draft/unchecked? | **Yes** — any generate with unchecked evidence → **prepared** / **generated unchecked** (§7) |

**Current runtime:** No preconditions—all queue entries batch-generate (B5.1). Transition must not break EC-09 path until gate approves precondition enforcement.

---

## 7. Draft / Prepared / Checked / Accepted Boundary

Functional **output states** (artifact lifecycle)—distinct from but mappable to evidence status (B5.3 §7).

| Output state | Meaning |
|--------------|---------|
| **draft** | Incomplete input or explicit draft mode; not for external handoff |
| **prepared** | Generated for review; open items documented; **default after MVP generate** when evidence incomplete |
| **generated unchecked** | DOCX in package; mirrors evidence line before review |
| **signed / returned** | Physical or digital signature recorded (human process; optional future) |
| **checked accepted** | Fachliche review of output artifact accepted—may align evidence line |
| **checked rejected** | Output rejected; regen or correction required |
| **archived / historical** | Superseded by newer output; retained in output history |

**Connection rule:** Output state **≠** evidence status, but implementation may **link** a generated DOCX line to evidence item with matching status. Changing evidence to `checked accepted` does not retroactively change archived output state without new generation record.

**Must be clearly marked draft/prepared/unchecked:** All MVP generates where external proof or signature still required (Datenschutz, Verschwiegenheit, role appointment, instruction records, qualification-related templates).

---

## 8. Generated vs Uploaded vs Accepted Boundary

| Concept | Boundary |
|---------|----------|
| **Generated documents** | Internal preparation artifacts from Tool 2 templates; default **generated unchecked** |
| **Uploaded documents** | Incoming scans/certificates from customer or Cert-Expert; **uploaded unchecked** until review |
| **Accepted evidence** | Requires **checked accepted** (or justified **not applicable**) before readiness green (B5.3, B5.4) |
| **Generated ZIP** | Container artifact; **does not equal** employee-file completeness |
| **Template output** | Does **not** prove §34a, Sachkunde, Führungszeugnis, or external qualification |

---

## 9. Output History Concept

Conceptual **output history** (no database or schema in B5.5):

Each generation event may record:

| Attribute (functional) | Purpose |
|------------------------|---------|
| **What was generated** | Package type, included DOCX list / template categories |
| **For whom** | Employee File identity (one or many) |
| **When** | Timestamp |
| **Template category** | roles / appointments paths used |
| **Warning / open-item status** | Snapshot of offene Unterlagen at generate time |
| **Who generated** | Operator identity (when auth available—future) |
| **Returned / signed / checked** | Optional lifecycle flags |

**Use:** Stale detection (B5.4 yellow), audit trail, repeat generation comparison—not legal record of evidence acceptance alone.

**Current state:** No history; browser download only (B5.1).

---

## 10. EC-09 / Current ZIP Protection Boundary

**Current working batch ZIP generation is the EC-09 regression boundary** (B4.2 closed with observations).

| Protection rule | Detail |
|-----------------|--------|
| **No breaking ZIP without gate** | `generate-employee-docs` + Hetzner GetObject path must remain functional until explicit replacement slice (C-09) |
| **Preserve Hetzner template loading** | `/api/templates`, `listTemplateFiles`, `buildLatestTemplateKeyMap`, `fetchTemplateBufferByKey` unchanged in B5.5 |
| **Preserve role/appointment DOCX generation** | Template loop, placeholder map, JSZip folder structure |
| **Transitional output engine** | Current generator may serve MVP Slice 1 until employee-file-wrapped output is implemented |
| **EC-09 evidence** | `docs/02-acceptance/evidence/exports/baseline-employee.zip` + B4.2 review remain baseline; compare method for future changes |
| **Known carry-forwards** | T2-BUG-09 en-US dates; logoFile session persistence; T2-BUG-10 duplicate appointment content—document, do not “fix” in B5.5 |

**Regression trigger (future):** Any change to ZIP structure, placeholder set, or template resolution requires EC-09 re-compare with **real** Hetzner templates—no fake ZIPs.

---

## 11. Output Impact on Readiness

| Effect | Allowed? | Detail |
|--------|----------|--------|
| Support **prepared** status | **Yes** | Evidence/output lines → `generated unchecked` / package **prepared** |
| Trigger **missing-item visibility** | **Yes** | Package may embed open-item snapshot |
| Support **audit package preparation** | **Yes** | EC-08 contribution; labeled context |
| Create **green readiness alone** | **No** | B5.4 §13 — output ≠ green |
| **Signed/checked/accepted** influences evidence readiness | **Yes, later** | When human marks output or linked evidence **checked accepted** (B5.3) |

**Summary:** Output **feeds** preparation workflow; it does **not** short-circuit evidence or release rules.

### 11.1 What generated outputs must not claim

Forbidden labels or implications on or from generated packages:

| Forbidden claim | Reason |
|-----------------|--------|
| Automatic release / Freigabe | EC-10, B5.4 §9 |
| Certification guarantee | C-06 |
| DIN / legal compliance guarantee | No norm engine |
| Employee audit-ready (company-wide) | C-05, C-06 |
| All evidence accepted | Unchecked generated/uploaded items may remain |
| Training/instruction completed | Doc generation ≠ Unterweisung fulfilled |
| Bewacherregister / §34a proved | External upload + check required |

---

## 12. Legacy Generator Behavior

| Legacy behavior | Keep temporarily / Replace later / Retire later | Reason | Candidate slice |
|-----------------|------------------------------------------------|--------|-----------------|
| localStorage queue as generator input | **Keep temporarily** | EC-09 path; no file object yet | B5.6 Slice 1 wrap |
| Role template selection (`selectedRoleDocIds`) | **Keep temporarily** → **Replace later** | Works for ZIP; reframe as output scope from file | Post–Slice 1 |
| Appointment template selection (`selectedAppointmentDocIds`) | **Keep temporarily** → **Replace later** | Same | Post–Slice 1 |
| Batch ZIP (all queue employees) | **Keep temporarily** → **Replace later** | EC-09; primary UX today | Slice 1 optional retain |
| DOCX template generation (`easy-template-x`) | **Keep temporarily** | C-09 core | Until explicit engine gate |
| Generated checklist as training proxy | **Retire later** | Wrong semantics (B5.0 §7) | With file UX |
| Output without employee-file object | **Keep temporarily** → **Replace later** | Transition | B5.6 Slice 1 |
| Output without evidence status | **Keep temporarily** → **Replace later** | No evidence module | Evidence slice |
| Output without output history | **Keep temporarily** → **Replace later** | No history today | After Slice 1 |
| Session `GlobalProperties` + logoFile | **Keep temporarily** | Generation context; logo carry-forward | Per-file company ref later |
| `/employee-automation` single-page UX | **Replace later** | Generator-centric | File workspace slices |

---

## 13. B5.5 Out of Scope

- No code changes
- No UI or routes
- No technical data model or database tables
- No software architecture design
- No storage redesign
- No Tool 1 redesign
- No template changes in Hetzner or repo
- No generator refactor (`generate-employee-docs.ts` untouched)
- No output history implementation
- No full LMS or training calendar
- No full project file, company file, or dashboard
- No customer portal
- No automatic release decisions
- No certification guarantee
- No final DIN 77200-2 detail matrix
- No final algorithms or thresholds

---

## 14. Gate Criteria for Leaving B5.5

| # | Criterion |
|---|-----------|
| G-1 | This document reviewed and **accepted** (or corrected and re-accepted) |
| G-2 | Standard Employee File Output definition (§3) accepted |
| G-3 | Legacy ZIP vs future output comparison (§4) accepted |
| G-4 | MVP output types (§5) accepted |
| G-5 | Output preconditions (§6) and output states (§7) accepted |
| G-6 | Generated vs uploaded vs accepted (§8) and output history concept (§9) accepted |
| G-7 | EC-09 / ZIP protection boundary (§10) accepted |
| G-8 | Output impact on readiness (§11) and forbidden claims (§11.1) accepted |
| G-9 | Legacy generator transition table (§12) accepted |
| G-10 | Explicit **B5.6** or implementation gate message before any code |
| G-11 | No application code changed under B5.5 commit |

---

## 15. Recommendation After B5.5

**Open B5.6 — Implementation Readiness Gate for Tool 2 Employee File MVP Slice 1.**

B5.6 should **decide whether implementation may start** and **define the first authorized implementation slice**—B5.5 does not authorize coding.

### B5.6 should cover

| Topic | Purpose |
|-------|---------|
| **Go / no-go** | All B5.0–B5.5 boundaries accepted; open carry-forwards acknowledged |
| **First slice scope** | Likely candidate: **Employee File MVP Slice 1** — employee-file workspace shell around existing queue **without breaking** EC-09 ZIP |
| **Explicit in-slice / out-of-slice** | What Slice 1 may touch vs defer (evidence upload, ampel evaluator, output history) |
| **EC-09 regression requirement** | Mandatory compare before/after Slice 1 if generator touched |
| **Branch / commit protocol** | Controlled commits; no `.env.local` |

### Likely first implementation candidate (not authorized in B5.5)

**Employee File MVP Slice 1:** Introduce employee-file identity and overview/profile shell; retain `generate-employee-docs` and batch ZIP as transitional output; localStorage evolution path defined in gate doc—not in B5.5.

### B5.6 must not assume

- Full evidence module
- Readiness evaluator implementation
- Output history storage design
- Generator rewrite

---

## Related documents

| Document | Relationship |
|----------|--------------|
| `B5_4_READINESS_AND_RELEASE_PREPARATION_RULES_BOUNDARY.md` | Readiness impact, forbidden claims |
| `B5_3_EVIDENCE_AND_REQUIRED_FIELDS_BOUNDARY.md` | Evidence statuses |
| `B4_2_RESIDUAL_EVIDENCE_CONTROLS_REPORT.md` | EC-09 baseline |
| `B5_1_EMPLOYEE_FILE_CURRENT_STATE_INVENTORY.md` | Current generator flow |
| `HARD_CONTROLS.md` | C-09 |
