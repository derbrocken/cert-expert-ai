# B6.4 — Employee Role / Zusatzrolle / SDL / Project Assignment Design

**Gate:** B6.4 — Role and assignment design only  
**Status:** **OPEN** — design document; **does not authorize implementation**  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**Prerequisite:** B6.3 PASS FOR EVIDENCE SECTION DESIGN (`6a34d73`)  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Profile sections:** `roles` (B6.2 §5.4), `sdl-project` (B6.2 §5.7)

---

## 0. Control Decision

**B6.4 defines how Grundrolle, Zusatzrolle, SDL, and project/object assignments are represented in the Tool 2 Employee File.**

| Decision | Detail |
|----------|--------|
| What B6.4 does | Concept definitions, role/SDL/project models, display labels, relationships to evidence and generated documents |
| What B6.4 does **not** do | Authorize UI build, persistence, requirement engines, release automation, DIN/audit claims, or generator changes |
| Next gate | B6.5 Readiness / Ampel Display Boundary Design — **design only**, after B6.4 acceptance |

---

## 1. Summary

This document specifies the **controlled assignment design** for the Employee Profile: how an employee relates to a **Grundrolle**, optional **Zusatzrollen** (overlay roles), an **SDL** (*Sicherheitsdienstleistung*), and a **Projekt / Objekt / Auftrag** context. It separates **assignment preview** (what is linked on the file) from **release preparation** (future human-gated checklist — not automated in B6.4).

Today’s runtime maps **Hetzner role templates** → Grundrolle and **appointments** → transitional overlay/doc selections (B5.7 queue). B6.4 defines the **target semantic model** without implementing it.

**Expected gate result:** **PASS FOR ROLE SDL PROJECT ASSIGNMENT DESIGN**

---

## 2. Source Baseline

### 2.1 B6.0 product-design boundary

- Role & overlay presentation (D-7); SDL/project link presentation (D-9).
- No permission system, CEKS matrix, or LMS (roles README alignment).
- Generator subordinate to file state; EC-09 protected.

### 2.2 B6.1 IA and navigation design

- Profile **Roles** section: active/edit (transitional).
- **SDL & Projekt** section: disabled placeholder until implementation.
- Nav labels: Grundrolle, Zusatzrolle, Overlay — not “appointment checkbox” as primary language.

### 2.3 B6.2 employee profile section design

- **Roles (`roles`):** Sub-block A = requirement context; Sub-block B = generator doc picks (separate).
- **SDL/project (`sdl-project`):** Preview cards only — “No SDL linked”.
- Assignment does not auto-change file status to Approved/Released.

### 2.4 B6.3 evidence section design

- Evidence categories E6–E7 scoped by role/SDL/project tags.
- Assignments **may imply** required evidence **later** — B6.4 does **not** calculate requirements.
- Category trigger tags reference Grundrolle / Zusatzrolle / SDL / Projekt.

### 2.5 B5.7 / B5.8 generator baseline

| Runtime today | Assignment design mapping |
|---------------|---------------------------|
| `roleId` → Hetzner role (e.g. `din-77200-1-allgemeine`) | **Grundrolle** display + template package |
| `appointmentIds[]` → e.g. `unterweisungen` | **Transitional overlay** → future **Zusatzrolle** |
| `selectedRoleDocIds` / `selectedAppointmentDocIds` | **Generator relevance** — not role identity |
| No SDL/project fields | SDL/project = **Not assigned** in all design mocks |
| EC-09 ZIP PASS | Template selection stays in Generated documents — protected |

---

## 3. Assignment Design Objective

Show how an employee can be related to **role**, **Zusatzrolle**, **SDL**, and **project/object** context in the profile — for operator orientation and future requirement scoping.

| Goal | Detail |
|------|--------|
| **Clarity** | One primary Grundrolle; overlays listed separately from doc checkboxes |
| **Context** | SDL and project as optional scoping layers — “for which service/object is this file prepared?” |
| **Preview** | Assignment preview = read-only display of links — no operational scheduling |
| **Preparation** | Release preparation = future manual checklist — **no automated release decision** in B6.4 |
| **Traceability** | Each assignment row links to B6.3 evidence categories (informational tags only) |

**Not in scope:** Who may deploy, shift planning, contract pricing, or authority sign-off.

---

## 4. Concept Definitions

| Term | Definition (design) |
|------|---------------------|
| **Grundrolle** | Primary employee function in the security company (e.g. SMA, Einsatzkraft). Drives default evidence set and base Hetzner role template package. **One per file** in MVP design. |
| **Zusatzrolle / Overlay-Rolle** | Additional hat worn by the person (Ersthelfer, Schichtführer). Adds conditional evidence/instruction requirements. **Multiple allowed.** Maps from legacy `appointmentIds` during transition. |
| **SDL / Sicherheitsdienstleistung** | Type of security **service** the employee is being prepared for (stationary guard, mobile patrol, event security, etc.). Scopes instruction/evidence for **release preparation** — not the employee’s Grundrolle alone. |
| **DIN 77200-1 service context** | Regulatory/service framework for **general security services** (Grundqualifikation, Jahresweiterbildung 24/40 UE, etc.). Aligns with current Hetzner role `din-77200-1-allgemeine` — **template context**, not a compliance claim in UI. |
| **DIN 77200-2 special context** | Framework for **special security services** (design placeholder for future SDL/template sets). B6.4 names context only — **no DIN-compliant label**. |
| **Projekt / Objekt / Auftrag** | Concrete customer site, event, or contract object the employee may be assigned to. Triggers **object-specific instruction** (B5.3 §6). **Preview only** in B6.4. |
| **Assignment preview** | Read-only UI showing current Grundrolle, overlays, SDL link, project link — and status chips (§9). No persistence in B6.4. |
| **Release preparation** | Future operator workflow: “prepare employee file for deployment to [SDL X / Projekt Y]” — checklist completion **human-gated**; never automatic **Released** in UI. |

**Legacy mapping (transitional):**

```
appointmentIds + appointment doc selections  →  Zusatzrolle (semantic) + generator picks (technical)
roleId + selectedRoleDocIds                  →  Grundrolle + role template package
(none)                                       →  SDL / Projekt = Not assigned
```

---

## 5. Grundrollen Model

Cert-Expert **Grundrollen** for design catalog. Runtime may expose subset via Hetzner templates; design covers full set.

### 5.1 Summary table

| Grundrolle | Purpose (design) | Evidence relevance (B6.3 cats.) | Generator relevance | Allowed labels | Forbidden claims |
|------------|------------------|--------------------------------|---------------------|----------------|------------------|
| **SMA / Sicherheitsmitarbeiter** | Standard field security worker | E3, E4, E5, E6 — Datenschutz, §34a/Sachkunde, Unterweisungen, Bewacher-ID | DIN 77200-1 role templates, Jahresweiterbildung URKUNDE | Assigned, Open, Prepared | SMA certified, DIN-compliant |
| **Einsatzkraft** | Deployable guard without full SMA qualification path | E4, E5, E3 — §34a/Unterrichtung as applicable | Role templates + instruction docs | Same | Deployment approved |
| **Führungskraft** | Supervisory / leadership function | E6, E1, E4 — Führungszeugnis/Bundesauszug, enhanced instructions | Leadership-related templates (future) | Same | Leadership approved |
| **Bürokraft / Verwaltung** | Admin/office — lighter field set | E3 (Datenschutz), E2 | Lighter doc package | Same | Audit-ready |
| **Einsatzleitung** | Operational incident/assignment leadership | E6, E5, E4 — coordination + instruction set | Event/ops templates (future) | Same | Release authorized |
| **Auszubildender** | Trainee — reduced/deferred requirements | E5, E2 — training focus | Training certificates | Same | Qualification complete |
| **Praktikant** | Intern — time-bounded, scoped requirements | E2, E5 | Minimal package | Same | Employed certified |
| **Subunternehmer-SMA** | Subcontractor guard under prime | E1, E3, E4, E6 — identity + company linkage emphasis | Subcontractor doc set (future) | Same | Subcontract approved |

### 5.2 Per-role design notes

**SMA / Sicherheitsmitarbeiter**  
- **Purpose:** Default Bewachung role; DIN 77200-1 general service context.  
- **Evidence:** Heavy E3/E4/E5/E6 per B5.3 §12.  
- **Generator:** Current bucket role `din-77200-1-allgemeine` maps here transitionally.  
- **Labels:** “Grundrolle: SMA”; status **Assigned** when `roleId` set.  
- **Forbidden:** “DIN 77200-1 compliant employee.”

**Einsatzkraft**  
- **Purpose:** Field deployment with conditional §34a path.  
- **Evidence:** E4/E5 emphasis; may omit some SMA-only items when justified N/A (future).  
- **Generator:** Role-specific Hetzner folder (future).  
- **Forbidden:** “Einsatzbereit freigegeben.”

**Führungskraft**  
- **Purpose:** Overlay-capable base or standalone Grundrolle depending on company model — design allows **either** Grundrolle or Zusatzrolle per org rule (document as business decision).  
- **Evidence:** Führungszeugnis / Bundesauszug (E1/E4).  
- **Forbidden:** “Führungskraft bestätigt.”

**Bürokraft / Verwaltung**  
- **Purpose:** Non-field staff with Datenschutz focus.  
- **Evidence:** Lighter checklist (E3, E2).  
- **Generator:** Minimal or no field URKUNDE.  
- **Forbidden:** “Field-ready.”

**Einsatzleitung**  
- **Purpose:** Lead on operations/events.  
- **Evidence:** E6/E5 extended instruction set.  
- **Generator:** Event/Intervention SDL-linked docs (future).  
- **Forbidden:** “Einsatz freigegeben.”

**Auszubildender / Praktikant**  
- **Purpose:** Time-limited employment categories.  
- **Evidence:** Training records (E5); some items **Not applicable** with justification (future).  
- **Forbidden:** “Fully qualified guard.”

**Subunternehmer-SMA**  
- **Purpose:** Subcontractor personnel file under prime’s certification context.  
- **Evidence:** Company relation + identity (E1, E2) emphasized.  
- **Forbidden:** “Prime-approved for all objects.”

---

## 6. Zusatzrollen / Overlay-Rollen Model

Overlays **add** requirements; they do **not** replace Grundrolle. **No automatic approval** when an overlay is assigned.

| Zusatzrolle | Purpose | Additional evidence (B6.3) | Generator note | Allowed labels | Forbidden |
|-------------|---------|----------------------------|----------------|----------------|-----------|
| **Ersthelfer** | First aider on site | E5 — Erste Hilfe proof + expiry | Instruction templates | Assigned, Open, Requires review | Ersthelfer certified |
| **Brandschutzhelfer** | Fire safety helper | E5 — fire instruction record | Overlay docs (future) | Same | Brandschutz approved |
| **Objektleiter** | Object/site lead | E6, E7 — object responsibility | Object-specific docs when project linked | Same | Object released |
| **Schichtführer** | Shift lead | E5, E6 — shift briefing records | Instruction overlays | Same | Shift approved |
| **Verantwortlicher / Ansprechpartner** | Designated contact person | E6 — role nomination doc | Rollenbenennung generated doc | Same | Officially appointed (legal) |

### 6.1 Transitional mapping

| Legacy runtime | Target design |
|----------------|---------------|
| `appointments/unterweisungen` | Instruction **overlay package** — not a Zusatzrolle name itself; overlays are **Ersthelfer**, etc. |
| `appointmentIds[]` | List of active **Zusatzrolle** IDs (future schema) |
| Appointment doc checkboxes | **Generator relevance** sub-block — separate from overlay badge |

### 6.2 Design rules

- Display **Zusatzrolle badges** in profile header + Roles section.  
- Each overlay row: name, status chip (§9), “Additional evidence (planned)” link to B6.3 — **disabled**.  
- Assigning overlay **must not** show green readiness or “Approved.”

---

## 7. SDL Assignment Model

SDL = **Sicherheitsdienstleistung** type the employee is being prepared **for** (scoped release preparation). **Optional** — default **Not assigned**.

### 7.1 SDL catalog (design)

| SDL type | DIN context (design) | Typical evidence/instruction scope (B6.3 E7) |
|----------|------------------------|-----------------------------------------------|
| **Stationäre Sicherheitsdienstleistung** | 77200-1 general | Base field instructions + object rules |
| **Empfangsdienst** | 77200-1 | Reception-specific Unterweisung |
| **Revierdienst** | 77200-1 | Patrol/route instruction |
| **Mobiler Kontrolldienst** | 77200-1 | Mobile patrol, vehicle-related (future docs) |
| **Veranstaltungsdienst** | 77200-1 / event context | Event security briefing |
| **Interventions- / Alarmverfolgungsdienst** | 77200-2 **special context** (placeholder) | Intervention-specific requirements |
| **Flüchtlings- / Asylunterkunft** | Special context | Sensitive context instruction (design placeholder) |
| **Veranstaltungen mit besonderer Sicherheitsrelevanz** | 77200-2 special | Enhanced event security |
| **Other SDL (future)** | TBD | Placeholder row “Weitere SDL — catalog TBD” |

### 7.2 SDL assignment preview (UI design)

| Field | Content |
|-------|---------|
| SDL name | e.g. “Veranstaltungsdienst” |
| SDL ID | Future reference key |
| DIN context tag | “77200-1 general” / “77200-2 special (context)” — **informational only** |
| Status | §9 — default **Not assigned** or **Not implemented** |
| Scoped banner | “Requirements shown for SDL: [name] — preview only” |
| Actions | Disabled “Link SDL (planned)” / “Change SDL (planned)” |

### 7.3 Rules

- One **primary SDL link** per preparation context in MVP design (multi-SDL = future).  
- SDL link **does not** imply employee is cleared for service.  
- **No DIN compliance statement** on SDL card.  
- Changing SDL may **future** create open evidence items — B6.4 does not simulate this.

---

## 8. Project / Object Assignment Model

### 8.1 Purpose

**Projekt / Objekt / Auftrag** = concrete deployment target (customer site, event name, contract object). Triggers **objektbezogene Unterweisung** (B6.3 E7).

### 8.2 Assignment preview (future only)

| Field | Design content |
|-------|----------------|
| Project / object name | Text reference |
| Project / object ID | External key (future) |
| Customer / site | Optional subtitle |
| Status | **Not assigned** (default) |
| Object instruction row | Link to B6.3 “Objektbezogene Unterweisung” — **Open** mock |

### 8.3 Design rules

| Rule | Detail |
|------|--------|
| **Preview only** | No project picker persistence in B6.4 |
| **Object-specific instruction** | Informational tag — not auto-generated |
| **Project-specific generated docs** | May appear in E8 when generated with project scope (future) |
| **No release decision** | No “Cleared for object” label |
| **No operational scheduling** | No shifts, rosters, or calendar |
| **No Projektakte** | Link reference only — not a project file editor |

---

## 9. Assignment Status Wording

### 9.1 Allowed labels

| Label | Use |
|-------|-----|
| **Not assigned** | No Grundrolle/SDL/project/overlays where applicable |
| **Assigned** | Link recorded on file (role or overlay) |
| **Prepared** | Operator marked preparation step (future manual) — scoped |
| **Requires review** | Assignment present but fachlich unchecked |
| **Open** | Assignment incomplete or pending action |
| **Not applicable** | Overlay/SDL/project does not apply — justified |
| **Not implemented** | SDL/project/overlays beyond transitional queue |

### 9.2 Forbidden labels

| Forbidden | Reason |
|-----------|--------|
| **Released** | SDL/release automation |
| **Approved** | Sign-off authority |
| **DIN-compliant** | Compliance claim |
| **Audit-ready** | EC-08 |
| **Certified** | Certification claim |
| **Freigegeben** | German release equivalent |
| **Einsatzbereit** (absolute) | Deployment clearance |

---

## 10. Relationship to Evidence Section

| Rule | Detail |
|------|--------|
| **Implication only** | Grundrolle / Zusatzrolle / SDL / Projekt tags **suggest** which B6.3 categories apply — design tags on evidence rows |
| **No calculation** | B6.4 does **not** derive checklist rows from assignments |
| **No blocker logic** | No rot/blocker when overlay added — deferred to future readiness gate (B6.5 display / B7 implementation) |
| **Display pattern** | Evidence row: `Scope: Grundrolle SMA · Zusatzrolle Ersthelfer · SDL Veranstaltung` |
| **Not assigned** | Categories E7 hidden or **Not applicable** when no SDL/project |

---

## 11. Relationship to Generated Documents

| Rule | Detail |
|------|--------|
| **Context-driven selection** | Design intent: template picks **may** be suggested by Grundrolle + overlays + SDL — **not implemented** |
| **Transitional** | Today: manual checkbox selection in EmployeeForm / Output section |
| **Prepared outputs** | Generated DOCX remain **unchecked drafts** (B6.3 E8) |
| **EC-09 protected** | No new generate path; Hetzner templates unchanged |
| **DIN 77200-1 templates** | Current role folder docs map to SMA general context — generation ≠ qualification proof |

**Roles section layout (design):**

```
┌─ Roles & assignments ─────────────────────────────────────┐
│ Grundrolle: SMA (din-77200-1-allgemeine)    [Assigned]    │
│ Zusatzrollen: Ersthelfer [Not assigned]                   │
│ SDL: Not assigned          Projekt: Not assigned          │
├─ Requirement context (preview) ───────────────────────────│
│  Planned evidence tags → B6.3 (not calculated)            │
├─ Generator document selection (transitional) ─────────────│
│  → link to Generated documents section                    │
└───────────────────────────────────────────────────────────┘
```

---

## 12. MVP State and Future State

### 12.1 Current MVP (B6.4 design / B5.7 runtime)

| Assignment type | MVP state | Data source today |
|-----------------|-----------|-------------------|
| **Grundrolle** | **Active display/edit** | `roleId` + Hetzner `/api/templates` |
| **Zusatzrolle** | **Transitional** — appointment names as overlay proxy | `appointmentIds[]` |
| **SDL** | **Not implemented** — preview card disabled | None |
| **Projekt / Objekt** | **Not implemented** — preview card disabled | None |
| **Release preparation** | **Not implemented** | None |

### 12.2 Future state (post–implementation gates)

| Capability | Gate type |
|------------|-----------|
| Zusatzrolle registry (not appointment IDs) | Schema + UI implementation |
| SDL link on employee file | Persistence + B7 |
| Project/object link | Persistence + B7 |
| Requirement derivation (evidence checklist) | Rules engine — **not B6.4** |
| **Controlled release-preparation engine** | Human-gated checklist; scoped to SDL/project |
| Ampel scoped to assignment | B6.5 design → B7 implementation |

---

## 13. Risks and Controls

| Risk | Control |
|------|---------|
| Appointment checkboxes confused with Zusatzrolle | Separate sub-blocks in Roles section (§11 diagram) |
| SDL card implies deployment clearance | Forbidden labels §9.2; “preview only” banner |
| DIN 77200 mentioned → compliance claim | Tag as “context (informational)” only |
| Single Hetzner role limits design review | Full Grundrolle catalog in doc — runtime catch-up via templates gate |
| Auto evidence rows on role select | B6.4 §10 — no calculation |
| EC-09 bypass via assignment UI | Generate stays in Output section |
| Subunternehmer legal liability implied | No “approved subcontractor” copy |

---

## 14. Out-of-Scope List

- Code, components, routes, persistence  
- Evidence upload, storage, Hetzner changes  
- Readiness algorithms, ampel computation, release automation  
- LMS, training calendar, shift scheduling  
- Tool 1, generator, templates, `.env.local`  
- KPI / Ziel-Etablierung  
- Permission/rechte system, full CEKS matrix  
- DIN conformity or audit certification claims  
- Operational project management (staffing, billing)

---

## 15. Proposed Next Slice

**B6.5 — Readiness / Ampel Display Boundary Design**

| Deliverable | Content |
|-------------|---------|
| Scoped ampel mockups | Per Grundrolle / SDL / project scope |
| Open-issues panel | Severity display without algorithms |
| Relationship to assignments | How assignment context appears in ampel **labels** only |
| Forbidden claim audit | EC-10 / HARD_CONTROLS alignment |
| Copy deck | rot/gelb/grün/grau semantics — display rules only |

---

## 16. Gate Recommendation

### **PASS FOR ROLE SDL PROJECT ASSIGNMENT DESIGN**

| Criterion | Result |
|-----------|--------|
| Concept definitions | **Yes** (§4) |
| Grundrollen model (8 roles) | **Yes** (§5) |
| Zusatzrollen examples | **Yes** (§6) |
| SDL assignment model | **Yes** (§7) |
| Project/object model | **Yes** (§8) |
| Status wording | **Yes** (§9) |
| Evidence & generated doc relationships | **Yes** (§10–§11) |
| MVP vs future state | **Yes** (§12) |
| No implementation authorized | **Yes** |

**Acceptance of B6.4** authorizes **B6.5 Readiness / Ampel Display Boundary Design** only.

---

## 17. Source Basis

| Document | Use |
|----------|-----|
| `B6_0` – `B6_3` | Design envelope, sections, evidence tags |
| `B5_3_EVIDENCE_AND_REQUIRED_FIELDS_BOUNDARY.md` | §12 role-dependent evidence |
| `B5_2_EMPLOYEE_FILE_OBJECT_BOUNDARY.md` | Role/SDL object groups |
| `modules/03-mitarbeiterakte-tool-2/roles/README.md` | Module intent |
| `B5_7` / `B5_8B` | Queue + generator baseline |

---

## 18. Commit

Suggested: `docs: define employee role SDL project assignment design (B6.4)`
