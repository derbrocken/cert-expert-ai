# B6.0 — Tool 2 Employee File Product Design Boundary

**Gate:** B6.0 — Product design boundary definition only  
**Status:** **OPEN** — boundary document; **does not authorize implementation**  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**Prerequisite commits:** B5.7 (`52ca548` + control addendum `5ac5520`), B5.8a (`cac9b50`), B5.8b (`27a284b`)  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Active module:** `modules/03-mitarbeiterakte-tool-2/`  
**Primary route (today):** `/employee-automation`

---

## 0. Control Decision

**B6.0 opens the controlled product-design boundary for the Tool 2 Employee File / Mitarbeiterakte.**

| Decision | Detail |
|----------|--------|
| What B6.0 does | Defines what **product design** may and may not include in subsequent B6.x **design slices** (IA, journeys, screen concepts, interaction rules, copy boundaries) |
| What B6.0 does **not** do | Authorize code, database, storage, evidence upload, readiness algorithms, ampel logic, SDL automation, template/generator changes, or KPI/target establishment |
| Design vs implementation | B6.x = **design artefacts and boundaries**; B7+ (or explicitly gated B6 implementation gates) = build slices **only after** design acceptance |
| Evidence rule | No fake templates, ZIPs, Nachweise, or fabricated readiness states in design mockups used as gate evidence |

**Functional prerequisites (closed or stable):** B5.0–B5.6 functional boundaries; B5.7 workspace shell; B5.8 generator output quality verified and date format normalized.

---

## 1. Summary

Tool 2 has a **stable generator** (EC-09 PASS, DD.MM.YYYY dates per B5.8b) and a **transitional Employee File Workspace** shell (B5.7) around the legacy generator queue. The **functional** meaning of an Employee File is defined in B5.2–B5.5 (object, evidence, readiness, output). **B6.0** defines the **product-design envelope** for turning those functional boundaries into operator-facing design without slipping into implementation.

The Employee File product design must move the operator mental model from **“batch ZIP job”** to **“maintain one person’s Mitarbeiterakte over time”**, while keeping the existing generator as a **subordinate, protected output step** until explicitly replaced or wrapped by later implementation gates.

**Expected gate result for B6.0 acceptance:** **PASS FOR CONTROLLED PRODUCT DESIGN PREPARATION**

---

## 2. Current Baseline from B5.7 / B5.8

### 2.1 Runtime baseline (as of B5.8b)

| Area | State |
|------|--------|
| **Route** | `/employee-automation` — “Employee File Workspace” framing |
| **Primary UX** | Employee form → generator queue table → row summary panel → batch ZIP generate |
| **Persistence** | `employee-queue-storage` (`localStorage`) — queue survives reload; **not** a durable employee-file system |
| **Templates** | Hetzner role/appointment DOCX via `/api/templates` |
| **Generation** | `generateEmployeeDocs` — real DOCX/ZIP; dates **DD.MM.YYYY** (B5.8b) |
| **Workspace shell** | Transitional notice, read-only summary, static “Evidence / Readiness: not implemented” badges |
| **Claims** | Explicit disclaimers — no release, DIN compliance, certification, or audit-ready claims |

### 2.2 Quality / carry-forward baseline

| Item | Status |
|------|--------|
| T2-BUG-09a (date format) | **Closed** (B5.8b) for generator-controlled dates |
| T2-BUG-09b (footer/global placeholders) | **Open** — template audit carry-forward |
| `{EndDate}` template token | **Open** — business/schema decision |
| T2-BUG-10 (duplicate content) | **Not reproduced** at current scope |
| EC-09 ZIP regression | **PASS** (B5.7 control + B5.8b re-verify) |
| Evidence / readiness / ampel | **Not implemented** — by design |

### 2.3 Functional design already fixed (B5.x — reference, do not redesign in B6)

B5.2–B5.5 remain the **functional truth source**. B6 product design **must align** with them; it **must not contradict** them or invent new business rules without a new functional gate.

---

## 3. Product-Design Objective

Design the Tool 2 Employee File so a Cert-Expert operator can:

1. **Find and reopen** a person’s file as the unit of work (not a disposable queue row).
2. **See** identity, role context, open requirements, and evidence gaps in one coherent profile-oriented layout.
3. **Understand** what is missing, blocked, or needs review **before** generating documents.
4. **Generate** Standardpersonalakte / document packages **when justified** — without the UI implying automatic release or audit certification.
5. **Navigate** toward SDL/project-scoped preparation **without** building a Projektakte or LMS.

**Product-design success criteria (design slices only):**

- Journeys and screen concepts are **traceable** to B5.2–B5.5 functional groups.
- Generator queue semantics are **explicitly transitional** in design docs until implementation replaces them.
- No design artefact shows green “audit ready,” “freigegeben,” “DIN-konform,” or “zertifiziert” without HARD_CONTROLS-compliant qualification (EC-10, C-01–C-06).

---

## 4. In-Scope Design Areas

The following may be addressed in **B6.1+ design slices** (wireframes, flows, IA, copy decks, component intent — not code):

| # | Design area | Design deliverable intent |
|---|-------------|---------------------------|
| D-1 | **Information architecture** | Employee list/overview → profile → sections (identity, roles, evidence, instructions, output) |
| D-2 | **Navigation model** | How operator moves between files, sections, and generator output; relationship to Certification OS shell |
| D-3 | **Employee profile layout** | Section order, primary/secondary actions, empty states, “transitional queue” deprecation path |
| D-4 | **Create / edit employee journey** | Onboarding flow vs in-profile edit; Pflichtfeld surfacing (visual only — rules from B5.3) |
| D-5 | **Evidence (Nachweis) UX concept** | Checklist presentation, status chips, upload/mark affordances (**UI concept only** — no storage design) |
| D-6 | **Open documents list (offene Unterlagen)** | How missing items appear; blocker vs warning visual language (from B5.3/B5.4 severity classes) |
| D-7 | **Role & overlay presentation** | Base role + Zusatzrollen display; difference from “document checkbox list” |
| D-8 | **Instruction/training status presentation** | Person-specific status lines (not LMS calendar) |
| D-9 | **SDL / project link presentation** | Minimal reference display and scoped context banner |
| D-10 | **Readiness / ampel presentation** | Scoped traffic-light + open-issues panel (**display rules only** — no algorithms) |
| D-11 | **Generator integration UX** | When/where “Generate package” lives; preconditions messaging; output history **concept** |
| D-12 | **Copy & disclaimer system** | Consistent language: draft/prepared/unchecked; ZIP ≠ evidence |
| D-13 | **Transitional compatibility** | How B5.7 workspace maps forward to target IA without breaking current operators |
| D-14 | **Accessibility & density** | Operator-grade tables, forms, status at a glance (design guidelines) |

---

## 5. Out-of-Scope Areas

The following are **explicitly excluded** from B6 product design and from any B6.x slice unless a **new gate** expands scope:

| # | Out of scope | Reason |
|---|--------------|--------|
| O-1 | Database schema, ORM, migrations | Implementation / data architecture gate |
| O-2 | Evidence file storage, upload pipelines, virus scan, retention | Implementation + infra gate |
| O-3 | Readiness evaluator, scoring, weights, auto-aggregation | B5.4 functional rules exist; algorithms = later implementation gate |
| O-4 | Ampel computation logic | Design may show **mock states**; not define formulas |
| O-5 | SDL release automation, signed Freigabe, audit certification | EC-10 / HARD_CONTROLS |
| O-6 | LMS, training calendar, course catalog | B5.0 exclusion |
| O-7 | Tool 1 (Document Generator / model creator) redesign | Separate product surface |
| O-8 | Hetzner / template storage / Upload Manager redesign | Closed infrastructure (B3.5, B4.1) |
| O-9 | Template content or placeholder redesign | Template audit gate (B5.8 carry-forwards) |
| O-10 | Generator algorithm / placeholder mapping changes | EC-09 protected; change only via explicit generator gate |
| O-11 | KPI dashboards, target establishment (Ziel-Etablierung) | HQ/strategy — not Tool 2 employee file |
| O-12 | Company-wide Unternehmensakte / Projektakte | Person-level scope only |
| O-13 | Multi-tenant auth, permissions model (beyond “operator tool” assumption) | Security architecture gate |
| O-14 | Mobile-native app design | Web-first Certification OS only unless gate says otherwise |

---

## 6. Relationship to Existing Generator Queue

### 6.1 Design stance

| Aspect | Today (B5.7) | Target product design |
|--------|--------------|------------------------|
| **Primary collection** | Generator queue (`localStorage`) | Employee file index / registry |
| **Row semantics** | Input to batch ZIP | Persistent file entry with lifecycle |
| **Selection** | Row click → summary panel | Profile open → section navigation |
| **Generate action** | Prominent batch button | Subordinate action with preconditions + scope |
| **Success metaphor** | “Documents generated” | “Package prepared” + history entry; file still “open” |

### 6.2 Transitional design rules

1. **Do not design away the queue abruptly** — show migration path: queue table → file list → profile.
2. **Preserve EC-09 path in design** until implementation gate replaces it — design may **wrap** generate, not **bypass** Hetzner templates.
3. **One employee = one file** in target IA; batch ZIP may remain as **secondary** operator action in design docs, not as homepage hero.
4. B5.7 summary panel content informs **profile header** design — do not invent conflicting fields.

### 6.3 Generator queue in B6 artefacts

Design documents may **reference** current components (`EmployeeForm`, `EmployeeTable`, `EmployeeFileSummaryPanel`) as **legacy anchors**. Mockups should label queue-based flows **“transitional (B5.7)”** until an implementation slice replaces storage.

---

## 7. Employee Profile Design Boundary

### 7.1 Profile is the hub

The **Employee Profile** is the primary design surface — not the registration form alone.

**Profile sections (design order recommendation):**

| Section | Design content | Functional anchor |
|---------|----------------|-------------------|
| **Header** | Name, IDs, active status, scoped ampel summary | B5.2 §4.1 |
| **Identity & employment** | Core fields, dates (DD.MM.YYYY display) | B5.3 Level 1–2 |
| **Roles & qualifications** | Grundrolle, overlays, qualification indicators | B5.2 §4.3–4.4, B5.3 Level 3 |
| **Evidence** | Required list + statuses + upload/mark affordance | B5.3 §7–§10 |
| **Instructions / trainings** | Person-specific status rows | B5.2 §4.5 |
| **SDL / project context** | Linked references, scoped banners | B5.2 §4.6, B5.3 Level 4 |
| **Readiness & open issues** | Layered summary, blockers vs warnings | B5.4 |
| **Output / packages** | Generate action, history list, download links | B5.5, EC-09 |

### 7.2 Profile design constraints

- **Pflichtfelder** must be visible as missing/complete — not hidden in advanced tabs only.
- **Edit vs view** modes may be designed; persistence mechanism is **not** chosen in B6.
- **Archive / inactive** states must be designable without delete-only semantics.
- Profile must **not** imply HR payroll, time tracking, or contract management.

### 7.3 Out of profile design scope

- Field-level validation rules (already functional in B5.3) — design **reflects**, does not redefine.
- Bewacher-ID / Employee-ID merge rules — follow existing form behavior until functional gate changes it.

---

## 8. Evidence / Nachweis Design Boundary

### 8.1 Design may include

- Checklist layout per required Nachweis (from B5.3 MVP catalog).
- Status chip vocabulary aligned with B5.3: *vorhanden*, *fehlt*, *abgelaufen*, *zu prüfen*, *nicht relevant*.
- Upload / attach / mark-reviewed **affordances** (buttons, dropzones, row actions).
- Expiry and “needs review” visual treatment.
- Clear separation: **uploaded evidence** vs **generated DOCX** (generated ≠ verified).

### 8.2 Design must not include

- Storage backend choice (S3 path, DB blob, local folder).
- OCR, auto-classification, or AI verification.
- Automatic “evidence accepted” on ZIP download.
- Fake PDF thumbnails presented as real uploads in gate evidence.

### 8.3 Open documents list (EC-04)

Design the **offene Unterlagen** surface as a first-class panel — aggregated from missing Pflichtfelder, missing evidence, expired items, and unresolved instruction lines (per B5.3/B5.4). **Severity styling only** — rot/gelb/grau informational classes per B5.4, not computed in B6.

---

## 9. Role, SDL and Project Assignment Boundary

### 9.1 Role design

| Design topic | Boundary |
|--------------|----------|
| **Grundrolle** | Single primary role selector with clear display name (maps to Hetzner role templates) |
| **Zusatzrollen / overlays** | Separate from “appointment document checkboxes”; SMA / Ersthelfer / Führungskraft as overlay badges |
| **Legacy appointment checkboxes** | Design must show **deprecation path** — doc selection remains generator input until output rules gate refactors it |
| **Requirements derivation** | Design **shows** “because role X, evidence Y required” — does not implement rule engine |

### 9.2 SDL / project design

| Design topic | Boundary |
|--------------|----------|
| **SDL link** | Minimal: SDL name/ID reference on profile; scoped readiness banner |
| **Project link** | Minimal: project name/ID; object-specific instruction context |
| **Release preparation** | Checklist UI “preparation complete for [SDL X]” — **never** “SDL freigegeben” without explicit human sign-off design |
| **Projektakte** | No project file editor, Gantt, or staffing planner |

### 9.3 Design forbidden claims

- “SDL approved,” “audit passed,” “deployment authorized” as automatic UI states.
- Role assignment alone must not show green ampel (C-01, C-04).

---

## 10. Readiness / Ampel Boundary

### 10.1 What product design defines

- **Scoped ampel** placement (profile header, SDL banner, audit summary strip).
- **Color semantics** aligned with B5.4 / HARD_CONTROLS: rot = blocker, gelb = warning/review, grün = scoped preparation complete (not certification), grau = not relevant / out of scope.
- **Open issues list** layout: title, severity, link to section, dismiss rules (**conceptual** — “operator acknowledged” not “system cleared”).
- **Layer labels** from B5.4 §3 (completeness, evidence, qualification, etc.) as expandable sections or tooltips.

### 10.2 What product design must not define

- Numeric scores, weights, or composite index formulas.
- Auto-green when all fields filled (C-04).
- Company-wide audit dashboard (person-file scope only).
- Automatic Freigabe enablement.

### 10.3 B5.7 placeholder badges

Current static badges (“Evidence: not implemented”, “Readiness: not evaluated”) are **design placeholders**. B6 mockups replace them with **realistic layout shells** still labeled **“non-functional — design only”** until implementation gates.

---

## 11. Generator Integration Boundary

### 11.1 Design principles

1. **Generator is output, not identity** — profile maintains the person; generate produces a package.
2. **Preconditions visible** — design shows disabled generate + reason when evidence/fields missing (messaging from B5.5 output preconditions concept).
3. **EC-09 protected** — design assumes existing Hetzner template path; no “custom template editor” in employee profile.
4. **Output history** — design includes list of past generations (timestamp, scope, operator) — storage TBD in implementation gate.
5. **Download ≠ acceptance** — post-download copy matches B5.7/B5.5 disclaimers.

### 11.2 Generate flow (target design)

```
Profile → review open items → (optional) resolve blockers →
  Generate package [scoped: role / full file / selected docs] →
  Download ZIP → history entry → file remains open for further work
```

### 11.3 Generator integration out of scope for B6

- Changing ZIP structure, folder naming, or template loops.
- Adding `{EndDate}` or footer tokens without generator gate.
- Replacing `easy-template-x` or Hetzner fetch path.

---

## 12. Forbidden Implementation Actions

No B6.x slice may **implement** (including “small” PRs) any of the following under the B6 design gate:

| # | Forbidden action |
|---|------------------|
| F-1 | Database tables, Prisma/Drizzle models, server persistence for employee files |
| F-2 | Evidence upload API, file storage, or Nachweis binary handling |
| F-3 | Readiness evaluation functions, ampel calculators, cron jobs |
| F-4 | SDL/project API integrations beyond static reference fields |
| F-5 | Changes to `generate-employee-docs.ts` or template storage |
| F-6 | Hetzner bucket structure or Upload Manager behavior changes |
| F-7 | Tool 1 routes, components, or `send-model-entries` |
| F-8 | `.env.local` or committed secrets |
| F-9 | Removing B5.7 disclaimers or adding forbidden certification/release claims |
| F-10 | KPI widgets, target establishment, HQ dashboard coupling |
| F-11 | “Stub” persistence that looks real in production (fake DB, mock API wired to UI) |

**Allowed in B6:** Markdown design docs, Figma links (external), mermaid flows, wireframe descriptions, copy decks, IA diagrams, design review checklists — **in `docs/` or linked artefacts**, not production code paths.

---

## 13. Proposed Next Design Slices

Sequential **design-only** gates recommended after B6.0 acceptance:

| Gate | Title | Deliverable | Depends on |
|------|-------|-------------|------------|
| **B6.1** | Employee File IA & navigation | Site map, primary journeys (create → maintain → generate), transitional queue mapping | B6.0 |
| **B6.2** | Employee profile & section design | Profile wireframe spec, section contracts, empty/error states | B6.1 |
| **B6.3** | Evidence & offene Unterlagen UX | Checklist layouts, status chips, open-items panel design | B6.2, B5.3 |
| **B6.4** | Role, SDL & project presentation | Role/overlay UI, SDL/project banner patterns | B6.2, B5.2 |
| **B6.5** | Readiness & ampel display design | Scoped ampel mockups, open-issues list, disclaimer copy deck | B6.3, B6.4, B5.4 |
| **B6.6** | Generator & output integration UX | Generate placement, preconditions messaging, output history concept | B6.2, B5.5 |
| **B6.7** | Design readiness gate | Consolidated design pack, traceability matrix B5→B6, implementation slice proposal | B6.1–B6.6 |

**Implementation** (persistence, evidence, readiness code) begins only after **B6.7 PASS** and explicit **B7.0 / B7.1** implementation readiness gates — not under B6.

---

## 14. Gate Recommendation

### **PASS FOR CONTROLLED PRODUCT DESIGN PREPARATION**

| Criterion | Result |
|-----------|--------|
| B5.7 workspace shell stable | **Yes** |
| B5.8 generator output quality verified | **Yes** (B5.8a + B5.8b) |
| EC-09 regression baseline | **PASS** |
| Functional boundaries B5.2–B5.5 available | **Yes** |
| B6.0 defines clear design vs implementation wall | **Yes** |
| Forbidden actions enumerated | **Yes** |
| Next design slices proposed | **Yes** |

**Acceptance of B6.0** authorizes **B6.1 Employee File IA & navigation** design work only — **not** code, persistence, or evidence implementation.

---

## 15. Source Basis

| Document | Role |
|----------|------|
| `B5_0_TOOL_2_FUNCTIONAL_REDESIGN_BOUNDARY.md` | Target identity, functional areas |
| `B5_2_EMPLOYEE_FILE_OBJECT_BOUNDARY.md` | Employee File object groups |
| `B5_3_EVIDENCE_AND_REQUIRED_FIELDS_BOUNDARY.md` | Pflichtfelder, evidence catalog |
| `B5_4_READINESS_AND_RELEASE_PREPARATION_RULES_BOUNDARY.md` | Readiness layers, ampel principles |
| `B5_5_STANDARD_EMPLOYEE_FILE_OUTPUT_BOUNDARY.md` | Output preconditions, EC-09 protection |
| `B5_7_EMPLOYEE_FILE_MVP_SLICE_1_IMPLEMENTATION_REPORT.md` | Current workspace baseline |
| `B5_8A_*` / `B5_8B_*` | Generator quality baseline |
| `docs/02-acceptance/ACCEPTANCE_BASELINE.md` | EC-01–EC-10 |
| `docs/03-controls/HARD_CONTROLS.md` | C-01–C-10 |
| `shared/placeholders/TOOL_2_PLACEHOLDERS.md` | Field/placeholder intent |

---

## 16. Commit

Suggested: `docs: define employee file product design boundary (B6.0)`
