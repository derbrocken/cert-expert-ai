# B6.2 — Employee Profile Section Design

**Gate:** B6.2 — Employee profile section design only  
**Status:** **OPEN** — design document; **does not authorize implementation**  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**Prerequisite:** B6.1 PASS FOR EMPLOYEE FILE IA DESIGN (`2c7bad1`)  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Primary route (today):** `/employee-automation`

---

## 0. Control Decision

**B6.2 defines the functional section design for the Employee Profile (*Mitarbeiterprofil*) within Tool 2.**

| Decision | Detail |
|----------|--------|
| What B6.2 does | Specifies purpose, displayed fields, labels, data sources, and activation state for each profile section per B6.1 IA |
| What B6.2 does **not** do | Authorize code, UI build, persistence, evidence upload, readiness algorithms, or generator changes |
| Next gate | B6.3 Evidence / Nachweise Section Design — **design only**, after B6.2 acceptance |

---

## 1. Summary

This document turns the **B6.1 profile shell** into a **section-by-section design specification** for the Tool 2 Employee Profile. Each section defines what the operator sees, which labels are permitted, where data comes from today (B5.7 generator queue + B5.8-stable generator), and what future data sources apply after later implementation gates.

The profile transforms a **queue row** into a **profile-centric employee file view**: one person, ordered sections, clear boundaries between **active transitional data**, **read-only summaries**, and **disabled placeholders**.

**Expected gate result:** **PASS FOR EMPLOYEE PROFILE SECTION DESIGN**

---

## 2. Source Baseline

### 2.1 B6.0 product-design boundary

- Profile is the **hub** (B6.0 §7); generator is **subordinate output** (B6.0 §11).
- Evidence, readiness, SDL automation, and LMS remain **out of scope** for build in B6.x.
- Forbidden implementation actions (B6.0 §12) apply unchanged.

### 2.2 B6.1 IA and navigation design

- Profile contains **10 sections** in fixed order (B6.1 §6).
- Navigation: overview → profile shell → section sub-nav; evidence/instructions/SDL **disabled** until implementation.
- Overview **File status** labels and forbidden certification language (B6.1 §5.3–5.4) apply to profile header badges.
- Route depth L1/L2 is **design target only** — not implemented in B6.2.

### 2.3 B5.7 / B5.8 generator queue baseline

| Runtime element | Profile design mapping |
|-----------------|------------------------|
| `Employee` in `employee-queue-storage` | Transitional **file record** for all active/read-only sections |
| `EmployeeForm` | Source for **master data**, **employment**, **roles** (edit mode) |
| `EmployeeFileSummaryPanel` | Seed for **summary header** (extend, do not contradict) |
| `GlobalProperties` sidebar | **Company context** for generation — session-level, not per-file today |
| `generateEmployeeDocs` / EC-09 | **Generated documents** section — protected path |
| B5.8b DD.MM.YYYY in DOCX | Profile **display dates** must use DD.MM.YYYY (design rule; summary panel en-US display is implementation carry-forward) |

**Current `Employee` fields (reference):** `id`, `fullName`, `birthday`, `startDate`, `roleId`, `appointmentIds`, `selectedRoleDocIds`, `selectedAppointmentDocIds`, `roleType`, `trainingHours`, `guardIDNumber`, `employeeIDNumber`, `useGuardAsEmployeeId`.

**Not in schema today:** contact email/phone, `endDate`, employment status enum, evidence records, instruction status lines, SDL/project IDs, notes, output history.

---

## 3. Employee Profile Objective

**Transform** a generator queue row into a **profile-centric Mitarbeiterakte view** where:

1. The operator **opens one employee** and stays in context across sections.
2. **Stammdaten, Beschäftigung, and Rollen** reflect real queue data (editable where form exists today).
3. **Nachweise, Unterweisungen, SDL** show **designed structure** without implying shipped functionality.
4. **Generated documents** remain the **only EC-09-active** output surface besides overview batch generate.
5. **Open items** surface gaps and carry-forwards **without** computing readiness.

```
Queue row (transitional)          Employee profile (target)
─────────────────────────         ───────────────────────────
id, fullName, …                   ┌─ Summary header
selectedRoleDocIds                ├─ Master data      [active/edit]
appointmentIds                    ├─ Employment       [active/edit]
                                  ├─ Roles            [active/edit]
                                  ├─ Evidence         [placeholder]
                                  ├─ Instructions     [placeholder]
                                  ├─ SDL / project    [placeholder]
                                  ├─ Generated docs   [active — EC-09]
                                  ├─ Open items       [read-only display]
                                  └─ Notes            [placeholder]
```

---

## 4. Profile Section Map

| # | Section ID | Label (DE / EN) | B6.1 §6 order | Default state (B6.2) |
|---|------------|-----------------|---------------|----------------------|
| 0 | *(header)* | Profilübersicht / Summary header | Above nav | **Read-only** (+ status badges) |
| 1 | `summary` | Kurzübersicht / Summary | 1 | **Read-only** |
| 2 | `master-data` | Stammdaten / Master data | 2 | **Active** (edit) |
| 3 | `employment` | Beschäftigung / Employment | 3 | **Active** (edit) |
| 4 | `roles` | Rollen / Roles & Zusatzrollen | 4 | **Active** (edit) |
| 5 | `evidence` | Nachweise / Evidence | 5 | **Disabled placeholder** |
| 6 | `instructions` | Unterweisungen & Schulungen | 6 | **Disabled placeholder** |
| 7 | `sdl-project` | SDL & Projekt | 7 | **Disabled placeholder** |
| 8 | `output` | Dokumente & Pakete / Generated documents | 8 | **Active** (EC-09) |
| 9 | `open-items` | Offene Punkte / Open items | 9 | **Read-only display** |
| 10 | `notes` | Notizen / Notes & review | 10 | **Disabled placeholder** |

**Profile chrome (all sections):**

- Breadcrumb: `Employee files › {fullName}`
- Transitional disclaimer strip (B5.7 lineage)
- Section sub-navigation (vertical desktop / horizontal scroll mobile)
- Primary actions: **Save** (edit sections), **Back to overview** — design only

---

## 5. Section Specifications

Each subsection follows: **purpose → displayed information → allowed labels → forbidden claims → MVP data source → future data source → activation state**.

---

### 5.0 Summary header (profile chrome)

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Orient operator; show identity and scoped status at a glance; replace B5.7 floating summary panel as persistent header |
| **Displayed information** | Full name; file status badge; role name; Bewacher-ID / Employee-ID (if set); birthday & start date (DD.MM.YYYY); evidence/readiness placeholder badges; open-item count (“not evaluated” default) |
| **Allowed labels** | Draft, Open, Not evaluated, Prepared, Requires review; “Evidence: not implemented”; “Readiness: not evaluated” |
| **Forbidden claims** | Certified, Approved, DIN-compliant, Audit-ready, Released, Freigegeben |
| **MVP data source** | `Employee` + resolved `roles`/`appointments`; mirrors `EmployeeFileSummaryPanel` |
| **Future data source** | Employee file store; computed open-item count; scoped ampel display (B6.5+) |
| **State** | **Read-only** |

---

### 5.1 Summary (`summary`)

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Compact dashboard for selected file; entry point before drilling into sections |
| **Displayed information** | Duplicate of header facts in grid layout; overlay appointment names; role/overlay doc counts; link chips to **Open items** and **Generated documents**; disclaimer: ZIP ≠ evidence |
| **Allowed labels** | Same as header; “Transitional view — generator queue data” until persistence gate |
| **Forbidden claims** | Same as §13 |
| **MVP data source** | `Employee`, `roles`, `appointments` |
| **Future data source** | Aggregated section summaries from evidence/readiness services |
| **State** | **Read-only** |

---

### 5.2 Master data (`master-data`)

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Identity and person identifiers for EC-01/EC-02 (B5.3 Level 1) |
| **Displayed information** | See §6 |
| **Allowed labels** | Field labels from form; “Required”; “Optional”; validation hints |
| **Forbidden claims** | “Identity verified”, “ID approved” |
| **MVP data source** | `EmployeeForm` fields → `Employee` in queue |
| **Future data source** | Employee file persistence; optional contact fields |
| **State** | **Active — editable** |

---

### 5.3 Employment (`employment`)

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Employment context and lifecycle (B5.3 Level 2) |
| **Displayed information** | See §7 |
| **Allowed labels** | Start date; employment status placeholders; “End date not recorded” |
| **Forbidden claims** | “Active employment confirmed”, “Contract valid” |
| **MVP data source** | `startDate`; company from `GlobalProperties` (session) |
| **Future data source** | Per-file company relation; `endDate`; status enum |
| **State** | **Active — editable** (partial fields only today) |

---

### 5.4 Roles & Zusatzrolle (`roles`)

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Grundrolle and overlay context (B5.2 §4.3–4.4); separate **requirement context** from **generator doc picks** |
| **Displayed information** | Primary role name + description; `roleType`, `trainingHours`; selected appointments (overlay names); **Sub-block A:** role requirements (design copy); **Sub-block B:** selected core/overlay documents (links to Output section) |
| **Allowed labels** | Grundrolle, Zusatzrolle, Overlay, Qualification level (for `roleType`) |
| **Forbidden claims** | “Role certified”, “Qualification complete” |
| **MVP data source** | `roleId`, `appointmentIds`, `roleType`, `trainingHours`, doc ID selections |
| **Future data source** | Overlay role assignments; requirement rules engine (display only until B7) |
| **State** | **Active — editable** |

---

### 5.5 Evidence / Nachweise (`evidence`)

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Future home for EC-03 evidence checklist (B5.3 §7) |
| **Displayed information** | Empty state only in B6.2 — see §8 |
| **Allowed labels** | “Not implemented”, “Requires later evidence upload”, “Open”, “Planned — B6.3+” |
| **Forbidden claims** | “Evidence complete”, “Nachweis akzeptiert”, upload success states |
| **MVP data source** | None |
| **Future data source** | B5.3 MVP evidence catalog + upload/mark store |
| **State** | **Disabled placeholder** (nav visible, body blocked) |

---

### 5.6 Training & instruction status (`instructions`)

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Person-specific Unterweisung/Schulung **status** (not LMS) |
| **Displayed information** | See §9 |
| **Allowed labels** | “Reference: generated documents only”; “Status not tracked”; “Not implemented” |
| **Forbidden claims** | “Training complete”, “UE fulfilled”, calendar due dates |
| **MVP data source** | Indirect: names of selected appointment docs only |
| **Future data source** | Instruction status lines per B5.2 §4.5 |
| **State** | **Disabled placeholder** |

---

### 5.7 SDL & project assignment preview (`sdl-project`)

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Minimal SDL/project context for release **preparation** display (B5.2 §4.6) |
| **Displayed information** | See §10 |
| **Allowed labels** | “No SDL linked”, “No project linked”, “Preview — not implemented” |
| **Forbidden claims** | “SDL approved”, “Release authorized”, DIN compliance |
| **MVP data source** | None |
| **Future data source** | SDL/project reference IDs on employee file |
| **State** | **Disabled placeholder** |

---

### 5.8 Generated documents (`output`)

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | EC-09 document package generation; template selection; download |
| **Displayed information** | See §11 |
| **Allowed labels** | “Generate package”, “ZIP export”, “Generated (unchecked draft)”, “Role documents”, “Overlay documents” |
| **Forbidden claims** | “Standardpersonalakte approved”, “Release package”, “Official submission” |
| **MVP data source** | `selectedRoleDocIds`, `selectedAppointmentDocIds`, `GlobalProperties`, `generateEmployeeDocs` |
| **Future data source** | Output history store; preconditions from B5.5 |
| **State** | **Active** (EC-09 protected) |

---

### 5.9 Open items (`open-items`)

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Surface gaps and carry-forwards without readiness algorithm |
| **Displayed information** | See §12 |
| **Allowed labels** | “Open”, “Carry-forward”, “Not evaluated”, “Template audit”, “Field missing” (manual/static lists only) |
| **Forbidden claims** | “All blockers resolved”, “Ready for audit”, rot/gelb/grün ampel as computed |
| **MVP data source** | Static carry-forward list (B5.8, B5.7); optional manual missing-field hints from form validation concepts |
| **Future data source** | EC-04 offene Unterlagen aggregation |
| **State** | **Read-only display** |

---

### 5.10 Notes / review comments (`notes`)

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Operator free-text and review comments |
| **Displayed information** | Empty state: “Notes not implemented” |
| **Allowed labels** | “Add note (planned)”, “Requires review — manual flag (future)” |
| **Forbidden claims** | “Review approved”, “Signed off” |
| **MVP data source** | None |
| **Future data source** | Notes store on employee file |
| **State** | **Disabled placeholder** |

---

## 6. Master Data Section

### 6.1 Fields

| Field | Display label | MVP source | Editable | Notes |
|-------|---------------|------------|----------|-------|
| **Full name** | Name / Full Name | `employee.fullName` | Yes | Required; `{FullName}` |
| **Birthday** | Geburtstag / Birthday | `employee.birthday` (ISO stored) | Yes | Display **DD.MM.YYYY**; `{Birthday}` |
| **Bewacher-ID** | Bewacher-ID / Guard ID | `employee.guardIDNumber` | Yes | Optional; `{GuardIDNumber}` |
| **Employee ID** | Mitarbeiter-ID / Employee ID | `employee.employeeIDNumber` | Yes | Optional; may mirror Guard ID |
| **Use Guard ID as Employee ID** | Checkbox | `employee.useGuardAsEmployeeId` | Yes | Existing form behavior |
| **Contact email** | — | *Not in schema* | — | **Design placeholder** — show “Not available in MVP” |
| **Contact phone** | — | *Not in schema* | — | **Design placeholder** |

### 6.2 Current limitations

- No `FirstName` / `LastName` split (TOOL_2_PLACEHOLDERS — future).
- No contact fields in `Employee` type — section shows identity only.
- Summary panel uses en-US short date display today — **implementation carry-forward**; profile design mandates DD.MM.YYYY on build.
- All data lost only in sense of **queue scope** — same `localStorage` limits as B5.7; design does not claim durability.

---

## 7. Employment Section

### 7.1 Fields

| Field | Display label | MVP source | Editable | Notes |
|-------|---------------|------------|----------|-------|
| **Start date** | Eintrittsdatum / Start date | `employee.startDate` | Yes | DD.MM.YYYY display; `{StartDate}` |
| **End date** | Austrittsdatum / End date | *Not mapped* | No | **Carry-forward** — show “Not recorded”; template `{EndDate}` exists (B5.8b audit) |
| **Employment status** | Beschäftigungsstatus | *Design placeholder* | No | Enum design: Active / Inactive / Archived — default **“Not evaluated”** |
| **Employing company** | Unternehmen | `GlobalProperties.companyName` | Read-only (session) | Not per-file until persistence gate |
| **Role baseline** | Grundrolle (reference) | Resolved role name | Read-only link | Links to **Roles** section |

### 7.2 Design rules

- **End date** must not be inferred from `startDate` or generator output.
- Employment status is **visual placeholder only** — no dropdown persistence in B6.2.
- Company fields (email, address) shown as **read-only footer** from global sidebar context with label “Session company context (transitional)”.

---

## 8. Evidence Section

### 8.1 B6.2 scope

**No upload. No checklist persistence. No status chips with real state.**

### 8.2 Empty state (required copy)

> **Nachweise — not implemented**  
> Evidence upload and status tracking require a later implementation gate (B6.3+ / B7).  
> Generated documents in **Dokumente & Pakete** are not accepted Nachweise.

### 8.3 Allowed wording

| Phrase | Use |
|--------|-----|
| Not implemented | Section title badge |
| Requires later evidence upload | Helper text |
| Open | Generic future item state label in spec tables only |
| Planned — evidence catalog per B5.3 | Design footnote |

### 8.4 Forbidden in evidence section

- Upload dropzone (functional)
- “Uploaded”, “Accepted”, “Verified”
- File thumbnails presented as real evidence
- Counts like “3/5 complete”

**B6.3** will expand this section’s **design** (layout, checklist mock, status chip vocabulary) — still no implementation in B6.3 unless gate says otherwise.

---

## 9. Training / Instruction Section

### 9.1 Design content (placeholder body)

| Block | Content |
|-------|---------|
| **Status table (mock)** | Grayed rows: “Unterweisung — status not tracked” |
| **Reference block** | Link to **Generated documents**: lists selected appointment template names from `appointmentIds` / doc selections |
| **Disclaimer** | “Document generation ≠ completed instruction. No LMS. No training calendar.” |

### 9.2 Rules

- **No LMS** — no course catalog, no enrollment, no UE accounting.
- **No training calendar** — no due dates, no recurring schedule UI.
- **No automatic completion** — selecting overlay docs in Roles/Output does **not** show “complete” in this section.
- **Generated output reference only** — e.g. “Overlay documents selected for export: Unterweisungsnachweis …” (read-only list from queue).

---

## 10. SDL / Project Assignment Preview

### 10.1 Preview cards (disabled)

| Card | MVP content |
|------|-------------|
| **SDL** | Title: “SDL assignment”; Body: “No SDL linked”; CTA: disabled “Link SDL (planned)” |
| **Project** | Title: “Project assignment”; Body: “No project linked”; CTA: disabled “Link project (planned)” |

### 10.2 Rules

- **Design preview only** — no picker, no API, no persistence.
- **No release decision** — no “Prepare release”, “SDL freigeben”, or checklist completion.
- **No DIN compliance claim** — no badge or copy referencing DIN conformity.
- Scoped banner (future): “Requirements shown for SDL X” — **gray mock text only** in B6.2 spec.

---

## 11. Generated Documents Section

### 11.1 Purpose

Primary **EC-09** surface within the profile; wraps existing generator behavior without redesigning pipeline.

### 11.2 Layout blocks

| Block | Content | MVP behavior |
|-------|---------|--------------|
| **A. Company context reminder** | Read-only: company name, address, email from `GlobalProperties` | Session sidebar data |
| **B. Core documents** | Role document chips (selected/unselected) | Same as EmployeeForm core docs |
| **C. Overlay documents** | Appointment document chips | Same as overlay docs |
| **D. Generate action** | “Generate package (ZIP)” | Calls `generateEmployeeDocs` — **EC-09 protected** |
| **E. Result / disclaimer** | Success toast + download; static disclaimer | B5.7 copy lineage |
| **F. Output history** | Empty: “No generation history recorded” | Future store |

### 11.3 EC-09 protection rules

- Do not add alternate generation path or client-only template fill.
- Do not change placeholder map or Hetzner fetch in profile design.
- **Queue-based batch generate** on overview (B6.1) **remains allowed** alongside per-profile generate.
- Per-profile generate uses **this employee’s** queue entry only (design intent).

### 11.4 Labels

| Use | Label |
|-----|-------|
| Primary button | Generate package (ZIP) |
| Success | Documents generated — unchecked draft |
| Helper | Export does not create accepted evidence |

---

## 12. Open Items and Notes

### 12.1 Open items (`open-items`) — read-only

**Purpose:** Show **known gaps** without implying readiness evaluation.

| Item type | Example entries (static in MVP design) | Label |
|-----------|----------------------------------------|-------|
| **Template audit carry-forward** | `{EndDate}` not mapped; footer metadata tokens absent in templates (B5.8b) | Carry-forward |
| **Feature not implemented** | Evidence tracking; Readiness evaluation; SDL link | Open — planned |
| **Field completeness (informational)** | Optional IDs empty | Optional field empty |
| **Pflichtfeld (future)** | — | Reserved for B5.3 rules — do not auto-compute in B6.2 |

**Display rules:**

- Section title: **Offene Punkte** with badge **“Not evaluated”** (default).
- No rot/gelb/grün colors tied to computed severity.
- Each row: title, type tag (`Carry-forward` | `Planned` | `Informational`), one-line description.
- Footer: “This list does not determine release or audit readiness.”

### 12.2 Notes (`notes`) — disabled placeholder

- Single empty state: “Notes and review comments — not implemented.”
- Future: timestamped operator notes, manual “Requires review” flag — **no automatic approval**.

---

## 13. Status and Copy Rules

### 13.1 Allowed status labels (profile header + overview)

| Label | Meaning |
|-------|---------|
| **Draft** | New file; minimal data |
| **Open** | Under active maintenance |
| **Not evaluated** | Default — readiness/evidence not implemented |
| **Prepared** | Manual operator marker (future) — scoped preparation only |
| **Requires review** | Manual or fachliche review flag (future) |

### 13.2 Forbidden status labels

| Forbidden | Reason |
|-----------|--------|
| Certified / Zertifiziert | EC-10 |
| Approved / Freigegeben | Release authority |
| DIN-compliant / DIN-konform | Compliance claim |
| Audit-ready / Auditfähig | EC-08, C-06 |
| Released / Freigegeben für Einsatz | SDL/release automation |

### 13.3 Section-level copy patterns

| Pattern | Example |
|---------|---------|
| Not implemented | “Evidence — not implemented” |
| Transitional | “Data source: generator queue (transitional)” |
| Reference only | “See Generated documents for export selections” |
| Draft output | “Generated package — unchecked draft” |

---

## 14. Out-of-Scope List

- Code, React components, routes  
- Database / API persistence  
- Evidence upload, storage, virus scan  
- Readiness evaluator, ampel algorithms  
- SDL/project API integration  
- LMS, training calendar, UE tracking  
- Tool 1, Hetzner, templates, generator logic  
- `.env.local`  
- KPI / Ziel-Etablierung  
- Figma/wireframe pixels (optional attachment — not required for B6.2 PASS)  
- B6.3 evidence **detailed** checklist layout (next slice)

---

## 15. Risks and Controls

| Risk | Control |
|------|---------|
| Placeholder sections look “done” | Disabled nav + explicit “not implemented” empty states |
| Open items imply readiness | Default “Not evaluated”; no ampel colors; disclaimer footer |
| Generated docs imply evidence | Repeat B5.7 disclaimer in Output + Summary |
| End date confusion | Explicit “Not recorded” — link to carry-forward item |
| Contact fields expected but missing | “Not available in MVP” in master data spec |
| EC-09 bypass in future build | §11.3 protection rules; regression smoke required at implementation gate |
| en-US dates in current summary panel | Document as implementation debt; B6.2 mandates DD.MM.YYYY on profile build |

---

## 16. Proposed Next Slice

**B6.3 — Evidence / Nachweise Section Design**

| Deliverable | Content |
|-------------|---------|
| Evidence checklist layout | Rows from B5.3 MVP catalog (design mock) |
| Status chip vocabulary | vorhanden / fehlt / abgelaufen / zu prüfen / nicht relevant — **display spec only** |
| Upload/mark affordances | Wireframe-level buttons — disabled in implementation until B7 |
| Empty vs populated mock states | For design review only — no fake files in repo as “evidence” |
| Traceability | B5.3 field/evidence rules → B6.3 UI |

---

## 17. Gate Recommendation

### **PASS FOR EMPLOYEE PROFILE SECTION DESIGN**

| Criterion | Result |
|-----------|--------|
| All B6.1 profile sections specified | **Yes** (§4–§5, §6–§12) |
| Per-section purpose, data source, state | **Yes** |
| Master data & employment detailed | **Yes** (§6–§7) |
| Evidence/training/SDL placeholders bounded | **Yes** (§8–§10) |
| Generated documents EC-09 linked | **Yes** (§11) |
| Open items without false readiness | **Yes** (§12) |
| Status/copy rules | **Yes** (§13) |
| No implementation authorized | **Yes** |

**Acceptance of B6.2** authorizes **B6.3 Evidence / Nachweise Section Design** only.

---

## 18. Source Basis

| Document | Use |
|----------|-----|
| `B6_0_EMPLOYEE_FILE_PRODUCT_DESIGN_BOUNDARY.md` | Profile hub, forbidden actions |
| `B6_1_EMPLOYEE_FILE_IA_NAVIGATION_DESIGN.md` | Section order, nav, labels |
| `B5_7_EMPLOYEE_FILE_MVP_SLICE_1_IMPLEMENTATION_REPORT.md` | Summary panel, queue baseline |
| `B5_8B_TOOL_2_MINIMAL_OUTPUT_QUALITY_FIX_REPORT.md` | Dates, carry-forwards |
| `B5_2` – `B5_5` | Functional section content |
| `modules/…/employee-file/types/employee.ts` | Current field inventory |
| `shared/placeholders/TOOL_2_PLACEHOLDERS.md` | Placeholder intent |

---

## 19. Commit

Suggested: `docs: define employee profile section design (B6.2)`
