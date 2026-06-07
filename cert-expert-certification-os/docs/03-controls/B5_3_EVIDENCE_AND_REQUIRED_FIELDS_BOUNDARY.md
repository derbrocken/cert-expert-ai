# B5.3 Evidence and Required Fields Boundary

**Gate:** B5.3 — Functional required-field and evidence boundary definition only  
**Status:** **OPEN** — boundary document; **does not authorize implementation**  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**Prerequisite commit:** `c602c84` (B5.2 object boundary)  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Active module:** `modules/03-mitarbeiterakte-tool-2/`

---

## 0. Control Decision

**B5.3 defines the functional required-field and evidence boundary only.**

| Decision | Detail |
|----------|--------|
| What B5.3 does | Names Pflichtfeld levels, MVP field catalog, MVP evidence catalog, status vocabulary, offene Unterlagen logic, and blocking vs warning boundaries |
| What B5.3 does **not** do | Authorize code, UI, routes, technical data model, database, localStorage migration, evidence upload implementation, storage architecture, or readiness algorithms |
| Implementation gate | No B5.4+ work until B5.3 is accepted **and** an explicit follow-up gate (e.g. **“Start B5.4”**) is issued |
| Evidence rule | No fake evidence, templates, or ZIPs; generated output ≠ verified Nachweis |

B5.2 defined the Employee File object groups. B5.3 defines **which fields and evidence items matter functionally** and **how their status affects open items**—without choosing implementation.

---

## 1. Source Basis

| Source | Use in B5.3 |
|--------|-------------|
| `docs/03-controls/B5_0_TOOL_2_FUNCTIONAL_REDESIGN_BOUNDARY.md` | Functional areas 3–5, 7–8; EC-02–EC-04 anchors |
| `docs/03-controls/B5_1_EMPLOYEE_FILE_CURRENT_STATE_INVENTORY.md` | Current Tool 2 fields, generator vs file gap |
| `docs/03-controls/B5_2_EMPLOYEE_FILE_OBJECT_BOUNDARY.md` | Object groups, direct vs reference, status dimensions |
| Existing Tool 2 generator fields | `fullName`, `birthday`, `startDate`, `roleId`, `appointmentIds`, IDs — mapping reference only |
| `docs/02-acceptance/ACCEPTANCE_BASELINE.md` | EC-02 (Pflichtfelder), EC-03 (Nachweise), EC-04 (offene Unterlagen) |
| `docs/03-controls/HARD_CONTROLS.md` | C-01–C-04 (ampel, not relevant, no auto green) |
| `shared/placeholders/TOOL_2_PLACEHOLDERS.md` | BewacherId, qualification, training/instruction placeholders |
| `modules/03-mitarbeiterakte-tool-2/evidence/README.md` | Evidence status intent (vorhanden/fehlt/abgelaufen/zu prüfen/nicht relevant) |
| `CERT_EXPERT_MVP_SCOPE_BOUNDARY_V1` | MVP cut line — **external artefact**; this document uses EC/HARD_CONTROLS as interim MVP boundary |

---

## 2. Required Field Principle

**Required fields are not just form fields.**

In the Employee File context, a Pflichtfeld is any identity, employment, role, qualification, or context attribute whose presence or valid status is **required before a defined action or evaluation is allowed**.

Required fields determine whether an employee file can:

| Action / evaluation | Field dependency (functional) |
|---------------------|------------------------------|
| **Be created** | Level 1 minimum identity + company relation |
| **Be considered structurally maintained** | Level 2 completeness (employment context, active status) |
| **Derive role/evidence requirements** | Level 3 base role + overlays + qualification indicators |
| **Scope SDL/project release preparation** | Level 4 minimal SDL/project references when context applies |
| **Participate in audit-readiness checks** | Level 5 — all applicable Levels 1–4 complete + evidence statuses resolved per §7–§10 |

A field may be **complete for creation** but **incomplete for audit-relevance**. Missing higher-level fields must surface as open items—not silently ignored (EC-02, C-01).

---

## 3. Required Field Levels

Functional levels only—**no technical schema**.

| Level | Name | Purpose |
|-------|------|---------|
| **Level 1** | Minimum creation fields | Minimum to open a new Employee File record |
| **Level 2** | Employee file completeness fields | Employment lifecycle and file maintenance minimum |
| **Level 3** | Role / qualification fields | Drive evidence and instruction requirements |
| **Level 4** | SDL / project relevance fields | Context for object-specific requirements and release prep |
| **Level 5** | Audit-readiness fields | All applicable prior levels + evidence check states for assessment |

**Progression rule:** Higher levels assume lower levels. Level 5 is **evaluation readiness**, not automatic release or auditfähig (EC-10, C-06).

---

## 4. MVP Required Field Catalog

| Field / concept | Level | Required for MVP? | Reason | Current Tool 2 mapping | Notes |
|-----------------|-------|-------------------|--------|------------------------|-------|
| **First name** | 1 | **Yes** | Minimum identity; audit-relevant | Partial — only `fullName` combined | Split from `fullName` in future implementation |
| **Last name** | 1 | **Yes** | Minimum identity; audit-relevant | Partial — only `fullName` | Same |
| **Date of birth** | 1 | **Yes** | Identity Pflichtfeld; placeholders | `birthday` | Required in form today |
| **Start date** | 2 | **Yes** | Employment context | `startDate` | Required in form today |
| **Exit date** | 2 | **Conditional** | Required when file **inactive** / employment ended | **None** | Optional while active |
| **Active / inactive status** | 2 | **Yes** | File lifecycle; drives conditional rules | **None** | New on Employee File |
| **Company relation** | 1 | **Yes** | Which Unternehmen owns the file | Partial — session `GlobalProperties.companyName` | Must become per-file reference, not batch sidebar |
| **Base role (Grundrolle)** | 3 | **Yes** | Drives default evidence set | `roleId` | Required in form today |
| **Additional roles (Zusatzrollen)** | 3 | **Conditional** | Required when overlays apply to person | `appointmentIds[]` | Legacy “appointments” → overlay roles |
| **Bewacher-ID** | 3 | **Conditional** | Required for Bewachung / field roles | `guardIDNumber` | Maps to `{BewacherId}` |
| **§34a / Unterrichtung** | 3 | **Conditional** | Qualification indicator for applicable security roles | **None** (only doc templates) | Status + evidence in §6—not checkbox |
| **Sachkunde** | 3 | **Conditional** | Qualification level indicator | Partial — `roleType` / `{QualificationLevel}` | Semantic confirm with templates |
| **Datenschutz** | 3 | **Conditional** | Instruction/evidence requirement | **None** | Person-specific status + evidence |
| **Verschwiegenheit** | 3 | **Conditional** | Declaration / evidence requirement | **None** | Typical for security roles |
| **Dienstausweis** | 3 | **Conditional** | Evidence when role/context requires | **None** | Upload + check |
| **Erste Hilfe** | 3 | **Conditional** | Overlay role + validity | **None** | Often Ersthelfer overlay |
| **Führungszeugnis / Bundesauszug** | 3 | **Conditional** | When role/regulatory context requires | **None** | e.g. Führungskraft, certain assignments |
| **Instruction / training status** | 3 | **Conditional** | Per-requirement status on file | Partial — `trainingHours` string only | Not LMS; status per §7 |
| **SDL reference** | 4 | **Conditional** | When employee linked for SDL release prep | **None** | Minimal ID/name only |
| **Project reference** | 4 | **Conditional** | When employee assigned to Objekt/project | **None** | Minimal ID/name only |
| **Object-specific instruction status** | 4 | **Conditional** | When project/SDL triggers Objekt-Unterweisung | **None** | File-level status |
| **Evidence check status** | 5 | **Yes** (when evidence required) | Audit-relevance requires checked or justified N/A | **None** | Per evidence item |
| **Missing items / offene Unterlagen** | 5 | **Derived** | Not a field—computed list | **None** | EC-04 |

### 4.1 Answers to mandatory-field questions

| Question | Answer (MVP functional) |
|----------|-------------------------|
| **Minimal creation (Level 1)** | First name, last name, date of birth, company relation |
| **Audit-relevant minimum** | Levels 1–2 complete + base role + all **conditional** Level 3–4 fields that apply to this person resolved + required evidence not in `required missing`, `uploaded unchecked`, `rejected`, or `expired` without review |
| **Optional or later** | Exit date (until inactive), SDL/project refs (until release context), some overlays, internal HR ID if Bewacher-ID suffices for role |

---

## 5. Evidence Principle

**Evidence is not the same as a generated document.**

| Rule | Meaning |
|------|---------|
| **Required** | Evidence appears on checklist because role, overlay, qualification, or SDL/project context demands it |
| **Present** | Uploaded artifact, external reference, or Tool-2-generated document **recorded on the evidence item** |
| **Checked** | Human or controlled fachliche review before item counts toward readiness (C-01) |
| **Accepted / rejected / not relevant** | Explicit outcome; rejected and missing block; not relevant needs justification (C-04) |
| **Influence readiness** | Only after status is `checked accepted` or justified `not applicable`—never from generation alone |

Generated Standardpersonalakte documents may **populate output slots** but do **not** automatically prove external Nachweise (e.g. §34a certificate scan, Führungszeugnis).

---

## 6. MVP Evidence Catalog

| Evidence type | Generated / uploaded / both | Required by default? | Trigger | Blocks release-prep? | Creates open issue? | Notes |
|---------------|----------------------------|----------------------|---------|----------------------|---------------------|-------|
| **Datenschutz declaration** | Both | **Conditional** | Base role + company policy | **Conditional** — yes if required and open | **Yes** if missing/unchecked/rejected | Generated doc ≠ signed proof unless checked |
| **Verschwiegenheit declaration** | Both | **Conditional** | Security / Bewachung roles | **Conditional** | **Yes** if open | Same as Datenschutz |
| **§34a proof (Unterrichtung / qualification)** | Uploaded | **Conditional** | SMA, Einsatzkraft, applicable Bewachung roles | **Yes** when required | **Yes** if missing/unchecked/expired | External certificate—not auto from DOCX |
| **Sachkunde proof** | Uploaded | **Conditional** | Role requires Sachkunde level | **Yes** when required | **Yes** if open | Distinct from §34a where both apply |
| **Bewacherregister / Bewacher-ID proof** | Uploaded | **Conditional** | Field/security roles with Bewacher-ID | **Conditional** | **Yes** if open | Links to Bewacher-ID field |
| **ID / passport copy** | Uploaded | **Conditional** | Company/role policy | **Conditional** | **Yes** if open | Identity verification |
| **Employment contract reference** | Uploaded / reference | **Conditional** | HR policy / role | **Warning** default; **block** if policy marks critical | **Yes** if open | Reference to contract, not full HR file |
| **First aid proof (Erste Hilfe)** | Uploaded | **Conditional** | Ersthelfer overlay or role rule | **Conditional** | **Yes** if expired/missing | Validity date matters |
| **Role appointment / function assignment** | Generated | **Conditional** | Base role documents | **Conditional** | **Yes** if unchecked generated | Generated → `generated unchecked` until review |
| **Instruction records (Unterweisung)** | Both | **Conditional** | Role overlays + mandatory instructions | **Conditional** | **Yes** if open | Person-specific, not LMS |
| **Object-specific instruction** | Both | **Conditional** | Project/SDL link | **Yes** when Objekt context active | **Yes** if open | DIN-related detail deferred §13 |
| **Dienstausweis proof** | Uploaded | **Conditional** | Role/context requires Ausweis | **Conditional** | **Yes** if open | Photo/card scan |
| **Führungszeugnis / Bundesauszug** | Uploaded | **Conditional** | Führungskraft / sensitive assignment | **Yes** when required | **Yes** if open | Regulatory sensitivity |
| **Training certificate / qualification proof** | Uploaded | **Conditional** | Qualification indicators | **Conditional** | **Yes** if open | External certificates |
| **Generated standard employee file package** | Generated | **Conditional** | Output action when file state allows | **No** alone | **Warning** if stale/missing when output expected | Output history ≠ evidence completeness |

**Default rule:** Nothing is “required by default” for all employees—requirements **derive from base role + overlays + SDL/project context**. Security-field roles carry a heavier default set (Datenschutz, Verschwiegenheit, §34a/Sachkunde as applicable).

---

## 7. Evidence Status Vocabulary

Allowed **functional** evidence statuses (per item). No algorithms or auto-transitions in B5.3.

| Status | Meaning |
|--------|---------|
| **not required** | Item not on checklist for this person/context (may become required if role/SDL changes) |
| **required missing** | On checklist; no artifact recorded |
| **uploaded unchecked** | Upload present; not yet reviewed |
| **generated unchecked** | Tool 2 generated document recorded; not yet reviewed |
| **checked accepted** | Reviewed and accepted—counts toward readiness (C-01) |
| **checked rejected** | Reviewed and rejected—treated as open |
| **expired** | Was accepted; validity period ended |
| **validity unclear** | Date or scope uncertain—needs review (gelb) |
| **not applicable** | Excluded with documented justification (C-04) |

**Legacy alignment:** Maps to evidence README intent (vorhanden → checked accepted; fehlt → required missing; abgelaufen → expired; zu prüfen → uploaded/generated unchecked or validity unclear; nicht relevant → not applicable).

---

## 8. Required Field Status Vocabulary

Allowed **functional** field statuses (per Pflichtfeld). Distinct from evidence status.

| Status | Meaning |
|--------|---------|
| **complete** | Value present and valid for current context |
| **incomplete** | Required but empty or invalid |
| **conditionally required** | Applies only when role/status/context triggers (e.g. exit date when inactive) |
| **not applicable** | Field does not apply—justified (C-04) |
| **needs review** | Value present but fachlich uncertain (e.g. qualification level mismatch) |

---

## 9. Open Items / Offene Unterlagen Logic

An **open item** (offene Unterlage / offener Punkt) is created when:

| Condition | Open item type |
|-----------|----------------|
| Required field **incomplete** | Pflichtfeld gap |
| Required evidence **required missing** | Missing Nachweis |
| Evidence **uploaded unchecked** or **generated unchecked** | Awaiting review |
| Evidence **checked rejected** | Correction required |
| Evidence **expired** | Renewal required |
| Evidence **validity unclear** | Review required |
| Role / overlay assignment changes | New conditional requirements appear as open until resolved |
| SDL / project reference added or changed | Object-specific requirements triggered as open until resolved |

**Derivation:** Offene Unterlagen list = union of open field gaps + open evidence items + unresolved instruction/training status items (where instruction status is modeled as requirement lines).

**Not an open item by itself:** Information-only gaps (§10) unless escalated by policy in B5.4.

**Do not implement** in B5.3—logic specification only.

---

## 10. Blocking vs Warning Boundary

Functional severity—**no automatic release decisions** (EC-10).

### 10.1 Blockers for release-preparation

When SDL/project release preparation is in scope, these **block** preparation completion until resolved or explicitly waived by human gate outside automation:

| Blocker source | Examples |
|----------------|----------|
| Level 1–2 Pflichtfeld **incomplete** | No company relation, inactive without exit date |
| Level 3 **incomplete** when triggered | Missing base role, missing Bewacher-ID for applicable role |
| Evidence **required missing** | §34a proof, Sachkunde when required |
| Evidence **checked rejected** | Rejected Führungszeugnis |
| Evidence **expired** | Erste Hilfe expired on active Ersthelfer |
| Critical instruction **open** | Mandatory Objekt-Unterweisung not completed when project linked |
| **Rot** readiness condition | Per B5.4—any declared critical blocker (C-02) |

### 10.2 Warnings for audit-readiness

Contribute to **gelb** (C-03)—open but not necessarily rot:

| Warning source | Examples |
|----------------|----------|
| **uploaded/generated unchecked** | Documents awaiting review |
| **validity unclear** | Date ambiguity on certificate |
| **needs review** field status | Qualification level uncertain |
| **Stale generated package** | Output history old vs current file state |
| Non-critical **employment contract reference** open | Policy-dependent |

### 10.3 Information-only gaps

Do **not** alone block release-prep or force rot (may appear in UI informational list):

| Gap | Example |
|-----|---------|
| Optional internal employee ID when Bewacher-ID present | HR convenience |
| `trainingHours` supplementary text | Placeholder helper only |
| Logo / generation cosmetic metadata | B4.2 carry-forward |
| Fields marked **not applicable** with justification | C-04 |

**B5.4** will define ampel aggregation rules; B5.3 only names severity classes.

---

## 11. Generated vs Uploaded Evidence Boundary

| Concept | Boundary |
|---------|----------|
| **Generated documents** | Tool 2 fills role/appointment DOCX templates into Standardpersonalakte; status starts as **generated unchecked** |
| **Uploaded evidence** | Customer or Cert-Expert uploads scans/certificates; status starts as **uploaded unchecked** |
| **External proof** | §34a, Sachkunde, Führungszeugnis, ID copies—typically **uploaded**; never assumed from ZIP |
| **Check before accept** | Both generated and uploaded must reach **checked accepted** (or **not applicable**) before influencing readiness |
| **Generated ZIP** | Batch or single-file output artifact; **does not equal** employee file completeness or audit-ready |
| **Template inclusion ≠ instruction complete** | Legacy `selectedRoleDocIds` / `selectedAppointmentDocIds` map to **output scope**, not fulfilled Unterweisung |

---

## 12. Role-Dependent Evidence Boundary

Requirements **derive from base role + overlays**—not from template checkbox alone.

| Role / overlay (functional) | Typical additional evidence / instruction (conditional) |
|----------------------------|--------------------------------------------------------|
| **SMA / Sicherheitsmitarbeiter** | §34a/Sachkunde proofs, Verschwiegenheit, Datenschutz, Bewacher-ID proof, role appointment docs, instruction records |
| **Einsatzkraft** | §34a/Unterrichtung as applicable, identity/qualification proofs, base instructions |
| **Führungskraft** | Overlay on file—not separate module; Führungszeugnis/Bundesauszug when required, enhanced instruction set |
| **Bürokraft / Verwaltung** | Datenschutz, employment reference; typically lighter field-evidence set |
| **Einsatzleitung** | Qualification proofs, leadership-related instructions, possibly Führungszeugnis |
| **Ersthelfer** | Erste Hilfe proof with expiry, instruction record |
| **Brandschutzhelfer** | Conditional overlay—fire safety instruction + proof if assigned |
| **Objektleiter / Schichtführer** | Object/leadership instructions, possibly Objekt-specific items when project linked |

**Rule:** Role registry (Hetzner `roles/` + overlay definitions) **triggers** checklist lines in B5.3 vocabulary—exact matrix per role is **operational configuration**, not built as full DIN engine in MVP.

**SMA logic** stays on Employee File as profile/qualification indicators (B5.2)—not a separate SMA module.

---

## 13. SDL- / Project-Dependent Evidence Boundary

| Rule | Detail |
|------|--------|
| **SDL reference** | When present, may add SDL-scoped instruction/evidence requirements for release preparation |
| **Project reference** | When present, may trigger **object-specific instruction** and related evidence |
| **DIN 77200-2** | Detailed norm matrix **not** fully built in MVP—only minimal hooks and object-instruction concept |
| **Full project file** | **Out of scope** — references only (C-08) |
| **Trigger behavior** | Adding/changing SDL/project may create new open items; removing may mark items **not applicable** with justification |

---

## 14. Forward Mapping from Current Tool 2

| Current field / concept | Map forward? | Future required field / evidence concept | Notes |
|-------------------------|--------------|------------------------------------------|-------|
| Employee queue row | **No** | Employee File entity | Queue ≠ file |
| `fullName` | **Partial** | First name + last name (Level 1) | Split required |
| `birthday` | **Yes** | Date of birth (Level 1) | |
| `startDate` | **Yes** | Start date (Level 2) | |
| Date handling (`utils/date.ts`) | **Yes** | Input validation layer | Subordinate to field status |
| `roleId` | **Yes** | Base role (Level 3) + evidence triggers | |
| `appointmentIds` | **Partial** | Additional roles (Level 3) | Renamed conceptually |
| Appointment/training **doc checklists** | **Partial** | Output scope + some **generated unchecked** evidence lines | Not instruction status |
| `selectedRoleDocIds` | **Partial** | Generator output selection | B5.5; not evidence acceptance |
| `selectedAppointmentDocIds` | **Partial** | Generator output selection | Same |
| Generated role documents | **Partial** | **generated unchecked** evidence items | After review → accepted |
| Generated appointment documents | **Partial** | Same | T2-BUG-10 duplicate risk carry-forward |
| Batch ZIP | **Partial** | Output history reference | ≠ completeness |
| `employee-queue-storage` | **No** (as model) | Employee file persistence | Interim only |
| `guardIDNumber` | **Yes** | Bewacher-ID (conditional Level 3) | |
| `employeeIDNumber` | **Partial** | Internal ID (optional Level 2/3) | |
| `roleType` | **Partial** | Sachkunde / qualification indicator | |
| `trainingHours` | **Partial** | Supplementary only | Not evidence |
| Session `GlobalProperties` | **Partial** | Company relation + generation metadata | Per-file company ref |
| Evidence module (absent) | **N/A** | Full §6 catalog | New |

---

## 15. B5.3 Out of Scope

- No code changes
- No UI or routes
- No technical data model, database tables, or TypeScript types
- No software architecture or persistence design
- No localStorage migration
- No evidence upload implementation or Hetzner key layout
- No storage redesign (template storage closed B3.5)
- No Tool 1 redesign
- No full LMS or training calendar
- No full project file, company file, or dashboard
- No customer or partner portal
- No automatic release or auditfähig decisions
- No final **DIN 77200-2** detail matrix or norm auto-interpretation
- No final **algorithms, thresholds, or ampel rules** (B5.4)
- No fake evidence, templates, or ZIPs

---

## 16. Gate Criteria for Leaving B5.3

| # | Criterion |
|---|-----------|
| G-1 | This document reviewed and **accepted** (or corrected and re-accepted) |
| G-2 | Required field levels (§3) and MVP catalog (§4) accepted |
| G-3 | Evidence principle (§5) and MVP evidence catalog (§6) accepted |
| G-4 | Evidence status (§7) and field status (§8) vocabulary accepted |
| G-5 | Offene Unterlagen logic (§9) accepted |
| G-6 | Blocking vs warning boundary (§10) accepted |
| G-7 | Generated vs uploaded boundary (§11) accepted |
| G-8 | Role-dependent (§12) and SDL/project-dependent (§13) boundaries accepted |
| G-9 | Forward mapping (§14) and out-of-scope (§15) accepted |
| G-10 | Explicit authorization before B5.4 (e.g. **“Start B5.4”**) |
| G-11 | No application code changed under B5.3 commit |

---

## 17. Recommendation for B5.4

**Open B5.4 — Readiness and Release-Preparation Rules Boundary** as the next controlled slice.

### B5.4 should define (functional / planning only unless gate expands)

1. **Ampel rules** — how field + evidence statuses aggregate to grün/gelb/rot/grau (C-01–C-04)
2. **Rot blocker catalog** — which open items force rot vs gelb
3. **Release-preparation checklist** — functional steps; human gate; no auto-approve (EC-10)
4. **SDL/project scoping** — how linked context narrows/widens readiness evaluation (C-05, C-08)
5. **Audit-readiness display rules** — impact only; no unchecked auditfähig (C-06)

### B5.4 must not assume

- Evidence upload UI or storage (unless separate implementation gate)
- Generator output changes (B5.5)
- Final DIN 77200-2 compliance engine

### Dependency

B5.4 requires accepted Pflichtfeld levels, evidence catalog, and status vocabulary from B5.3. Without B5.3, readiness rules would lack a controlled input model.

---

## Related documents

| Document | Relationship |
|----------|--------------|
| `B5_2_EMPLOYEE_FILE_OBJECT_BOUNDARY.md` | Parent object boundary |
| `B5_1_EMPLOYEE_FILE_CURRENT_STATE_INVENTORY.md` | Current Tool 2 state |
| `HARD_CONTROLS.md` | C-01–C-10 |
| `ACCEPTANCE_BASELINE.md` | EC-02–EC-04 |
| `shared/placeholders/TOOL_2_PLACEHOLDERS.md` | Placeholder / field naming |
