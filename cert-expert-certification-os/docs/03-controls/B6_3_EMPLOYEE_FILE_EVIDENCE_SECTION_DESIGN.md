# B6.3 — Employee File Evidence / Nachweise Section Design

**Gate:** B6.3 — Evidence section design only  
**Status:** **OPEN** — design document; **does not authorize implementation**  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**Prerequisite:** B6.2 PASS FOR EMPLOYEE PROFILE SECTION DESIGN (`e91bd8b`)  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Profile section ID:** `evidence` (B6.1 §6, B6.2 §5.5)

---

## 0. Control Decision

**B6.3 defines the controlled design for the Evidence / Nachweise section of the Tool 2 Employee Profile.**

| Decision | Detail |
|----------|--------|
| What B6.3 does | Names evidence category model, example items, display labels, status wording, boundaries vs generated documents, and open-items linkage |
| What B6.3 does **not** do | Authorize upload UI, storage, persistence, validation algorithms, readiness, ampel, or release automation |
| Next gate | B6.4 Role / Zusatzrolle / SDL / Project Assignment Design — **design only**, after B6.3 acceptance |

---

## 1. Summary

This document specifies how **employee-related Nachweise** will be **structured and displayed** in the future Evidence section of the Employee Profile. It builds on **B5.3** functional evidence catalog and status vocabulary, **B6.2** section placement (disabled placeholder today), and the **B5.7/B5.8** stable generator baseline.

B6.3 is **design-only**: no upload buttons, no file storage, no automated verification, no expiry calculation, and no readiness or release claims. All checklist rows and status chips in design artefacts must be labeled **“not implemented”** or shown as **gray mock structure** until explicit implementation gates (B7+).

**Expected gate result:** **PASS FOR EVIDENCE SECTION DESIGN**

---

## 2. Source Baseline

### 2.1 B6.0 product-design boundary

- Evidence UX concept allowed (D-5); upload/storage forbidden in B6 (O-2).
- Generated output ≠ evidence (B6.0 §8, B5.3 §5).
- No certification, audit-ready, or release automation language in design.

### 2.2 B6.1 IA and navigation design

- Evidence is profile **section 5** — nav item **visible**, body **disabled** until implementation.
- Overview must not show fake evidence completion counts.

### 2.3 B6.2 employee profile section design

- Evidence section: **disabled placeholder** in MVP; B6.3 replaces empty-state-only spec with **full section design**.
- Open items section lists missing evidence **informationally** — no readiness algorithm (B6.2 §12).
- Generated documents section remains **EC-09 active** — separate from evidence acceptance.

### 2.4 B5.7 / B5.8 generator baseline

| Runtime fact | Evidence design implication |
|--------------|----------------------------|
| No evidence module in code | All evidence rows are **future**; design structure only |
| Hetzner templates include Datenschutz, Unterweisung, Dienstausweis DOCX | **Generated document** category may **reference** these outputs — not auto-accept |
| EC-09 ZIP PASS (B5.8b) | Cross-link from evidence row “prepared output” → Generated documents — no bypass |
| `guardIDNumber` in queue | Maps to **Bewacher-ID** evidence row (field link, not proof) |
| B5.8 template carry-forwards | Listed in open items — not hidden as “complete” |

### 2.5 Functional source (B5.3)

- MVP evidence catalog (B5.3 §6) and evidence status vocabulary (B5.3 §7) are **functional truth** for item types and future backend states.
- B6.3 **display labels** (§7) are a **simplified operator-facing layer** mapped to B5.3 statuses in §7.3 — not a replacement of functional rules.

---

## 3. Evidence Section Objective

**Design how employee-related evidence will be structured and displayed later** — not build it in B6.3.

| Objective | Detail |
|-----------|--------|
| **Structure** | Group Nachweise by category; show role/SDL/project scope per row |
| **Clarity** | Distinguish uploaded proof vs generated draft vs not yet required |
| **Traceability** | Each row links to trigger (Grundrolle, Zusatzrolle, SDL, project) |
| **Honesty** | Default section state: **Not implemented** — mock rows are labeled as design |
| **Boundary** | No upload, storage, validation algorithm, or release decision in this slice |

**Operator questions the section must eventually answer (design target):**

1. *What Nachweise apply to this person?*
2. *What is missing vs provided vs needs review?*
3. *Which items came from generated documents vs external upload?*
4. *What is not applicable for this context?*

---

## 4. Evidence Category Model

Eight **future evidence groups** organize the checklist UI. Categories are **display containers** — an item appears in one primary category; cross-tags show role/SDL scope.

```
┌─────────────────────────────────────────────────────────────┐
│  Nachweise / Evidence                    [Not implemented]  │
├─────────────────────────────────────────────────────────────┤
│  ▼ Personal master evidence                                 │
│  ▼ Employment evidence                                      │
│  ▼ Legal / security evidence                                │
│  ▼ Qualification evidence                                   │
│  ▼ Training / instruction evidence                          │
│  ▼ Role-specific evidence                                   │
│  ▼ SDL / project-specific evidence                          │
│  ▼ Generated documents (prepared outputs)                   │
└─────────────────────────────────────────────────────────────┘
```

| Cat. ID | Group name (DE / EN) | Primary B5.3 anchor |
|---------|----------------------|---------------------|
| **E1** | Persönliche Stammdaten-Nachweise / Personal master evidence | Identity, Bewacher-ID proof |
| **E2** | Beschäftigungsnachweise / Employment evidence | Contract reference, employment context |
| **E3** | Recht & Sicherheit / Legal / security evidence | Datenschutz, Verschwiegenheit, Dienstausweis |
| **E4** | Qualifikationsnachweise / Qualification evidence | §34a, Sachkunde, certificates |
| **E5** | Schulung & Unterweisung / Training / instruction evidence | Instruction records, Jahresweiterbildung proof |
| **E6** | Rollenbezogene Nachweise / Role-specific evidence | Role appointment, Rollenbenennung, overlay-specific |
| **E7** | SDL- & projektbezogene Nachweise / SDL / project-specific | Object instruction, SDL-scoped items |
| **E8** | Erzeugte Dokumente / Generated documents | Generated unchecked outputs, package history |

---

## 5. Category Specifications

For each category: **purpose → examples → employee-file relevance → role/SDL/project relevance → allowed labels → forbidden claims → MVP state → future data source**.

---

### E1 — Personal master evidence

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Identity and official ID proofs tied to the person |
| **Examples** | Bewacher-ID (field + register proof); Bundesauszug Bewacherregister; ID/passport copy; photo |
| **Employee-file relevance** | Core to file identity (EC-03); links to master data §6 |
| **Role/SDL/project** | Bewacherregister often triggered by **field/security roles**; ID copy by company policy |
| **Allowed display labels** | Not implemented, Not uploaded, Open, Provided, Requires review, Not applicable |
| **Forbidden claims** | Identity verified, Approved, Certified |
| **MVP state** | **Disabled placeholder** (mock rows grayed) |
| **Future data source** | Evidence store + `guardIDNumber` / future ID fields; B5.3 §6 rows |

---

### E2 — Employment evidence

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Employment relationship proof (not full HR system) |
| **Examples** | Employment contract reference; start-date confirmation; exit documentation when inactive |
| **Employee-file relevance** | B5.3 Level 2 completeness |
| **Role/SDL/project** | Generally **employee-wide**; not SDL-scoped unless contract is object-specific |
| **Allowed labels** | Same as §7.1 |
| **Forbidden claims** | Contract approved, Employment certified |
| **MVP state** | **Disabled placeholder** |
| **Future data source** | Evidence store; employment section fields |

---

### E3 — Legal / security evidence

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Legal declarations and security-role compliance artefacts |
| **Examples** | **Datenschutz** (declaration + signed proof); **Verschwiegenheit**; **Dienstausweis** (card/issuance proof); general **Dienstanweisung** acknowledgement |
| **Employee-file relevance** | Conditional Level 3 requirements (B5.3 §4) |
| **Role/SDL/project** | Heavy default for **Bewachung / security Grundrolle**; Dienstausweis when role/context requires |
| **Allowed labels** | Same as §7.1; “Prepared output available” for linked generated DOCX |
| **Forbidden claims** | DIN-compliant, Legally approved, Audit-ready |
| **MVP state** | **Disabled placeholder** |
| **Future data source** | B5.3 §6 Datenschutz/Verschwiegenheit/Dienstausweis; generated DOCX cross-ref |

---

### E4 — Qualification evidence

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Regulatory qualification proofs distinct from instruction attendance |
| **Examples** | **§34a Unterrichtung / proof**; **Sachkunde** certificate; qualification level documentation |
| **Employee-file relevance** | Level 3 qualification indicators |
| **Role/SDL/project** | Triggered by **SMA, Einsatzkraft**, applicable Bewachung roles |
| **Allowed labels** | Same as §7.1 |
| **Forbidden claims** | §34a certified, Qualification approved |
| **MVP state** | **Disabled placeholder** |
| **Future data source** | Upload store; **not** from generator checkbox alone |

---

### E5 — Training / instruction evidence

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Person-specific Schulung and Unterweisung **proof** (not LMS) |
| **Examples** | **Schulungs-/Unterweisungsnachweise**; Jahresweiterbildung certificate; Pflichtunterweisung record; **Erste Hilfe** proof |
| **Employee-file relevance** | Instruction status lines (B5.2 §4.5) |
| **Role/SDL/project** | Overlays (e.g. Ersthelfer → Erste Hilfe); base role training requirements |
| **Allowed labels** | Same as §7.1; “See generated documents” cross-link |
| **Forbidden claims** | Training complete, UE fulfilled, LMS enrolled |
| **MVP state** | **Disabled placeholder** |
| **Future data source** | Instruction status + evidence store; appointment template names as **reference only** today |

---

### E6 — Role-specific evidence

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Artefacts tied to role assignment and **Rollenbenennung** |
| **Examples** | Role appointment document; function assignment; **Rollenbenennungen**; overlay-specific proofs |
| **Employee-file relevance** | Driven by `roleId` + Zusatzrollen |
| **Role/SDL/project** | **Primary category for Grundrolle/Zusatzrolle triggers** |
| **Allowed labels** | Same as §7.1 |
| **Forbidden claims** | Role certified, Appointment approved |
| **MVP state** | **Disabled placeholder** |
| **Future data source** | Role rules engine (display) + generated role docs |

---

### E7 — SDL / project-specific evidence

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Evidence required only when SDL or project context is linked |
| **Examples** | **Objektbezogene Unterweisung**; project-scoped instruction proof; SDL release-prep checklist items |
| **Employee-file relevance** | Level 4 conditional (B5.3 §4) |
| **Role/SDL/project** | **Only when SDL/project reference present** — hide or N/A otherwise |
| **Allowed labels** | Same as §7.1; “No SDL linked — not applicable” |
| **Forbidden claims** | SDL approved, Release authorized, Project cleared |
| **MVP state** | **Disabled placeholder** |
| **Future data source** | SDL/project link + conditional requirement rules |

---

### E8 — Generated documents (prepared outputs)

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Tool 2 **generated DOCX/ZIP outputs** recorded as evidence **candidates** — never auto-accepted |
| **Examples** | Role/appointment **generated documents** from EC-09; Datenschutz generated draft; Unterweisungsnachweis export; full Standardpersonalakte package |
| **Employee-file relevance** | Output history (B5.5); links to profile **Generated documents** section |
| **Role/SDL/project** | Scoped by what was included in generation selection |
| **Allowed labels** | Prepared output, Requires review, Not uploaded (external proof still needed), Open |
| **Forbidden claims** | Accepted evidence, Verified, Submitted to authority |
| **MVP state** | **Read-only reference** — list selected template names / “last export” mock only; **no live link** in B6.3 |
| **Future data source** | Output history store + `generated unchecked` status (B5.3 §7) |

---

## 6. Minimum Evidence Examples (Design Catalog)

Design checklist **must consider** these items (mapped to categories). All rows **disabled/mock** in B6.3.

| Evidence item | Category | Typical trigger | Upload / generated / both | B6.3 MVP state |
|---------------|----------|-----------------|---------------------------|----------------|
| **Bewacher-ID** (field) | E1 | Field/security role | Field link — proof uploaded | Placeholder row |
| **Bundesauszug Bewacherregister** | E1 | Bewachung roles | Uploaded | Placeholder row |
| **§34a Unterrichtung / Sachkunde** | E4 | SMA, Einsatzkraft | Uploaded | Placeholder row |
| **Datenschutz** | E3 | Base security role | Both | Placeholder + “prepared output” note |
| **Verschwiegenheit** | E3 | Security roles | Both | Placeholder row |
| **Dienstausweis** | E3 | Role/context | Both | Placeholder row |
| **Erste Hilfe** | E5 | Ersthelfer overlay | Uploaded | Placeholder row |
| **Rollenbenennungen** | E6 | Role assignment | Generated / uploaded | Placeholder row |
| **Schulungs-/Unterweisungsnachweise** | E5 | Role + overlays | Both | Placeholder row |
| **Objektbezogene Unterweisung** | E7 | Project/SDL link | Both | Placeholder row |
| **Allgemeine Dienstanweisung acknowledgement** | E3/E5 | Company policy | Uploaded / generated | Placeholder row |
| **Role/appointment generated documents** | E8 | Generator selections | Generated | **Read-only reference** to Output section |

**Design row template (mock):**

| Column | Content |
|--------|---------|
| Item name | e.g. Datenschutz |
| Category | E3 |
| Scope tag | Grundrolle: Din 77200 … |
| Status chip | **Not implemented** (default) |
| Source hint | Upload (future) / Prepared output (future) |
| Action column | Disabled “Upload (planned)” / “Mark reviewed (planned)” |

---

## 7. Status Wording Model

### 7.1 Allowed display labels (B6.3 operator-facing)

For **design mockups and future UI copy** — simplified from B5.3 for operator clarity:

| Display label | Design meaning |
|---------------|----------------|
| **Not implemented** | Section or row type not yet built |
| **Not uploaded** | Required item; no artefact recorded |
| **Open** | Item applies and is unresolved (missing or pending review) |
| **Provided** | Artefact recorded (upload or generated) — **not** same as accepted |
| **Requires review** | Present but needs fachliche check |
| **Not applicable** | Justified exclusion for this person/context |

**Default for entire section in transitional phase:** **Not implemented** (banner) + per-row **Open** or **Not uploaded** in gray mock tables only.

### 7.2 Forbidden display labels

| Forbidden | Reason |
|-----------|--------|
| **Approved** | Implies release/sign-off authority |
| **Certified** | Certification claim |
| **Audit-ready** | EC-08 / C-06 |
| **DIN-compliant** | Compliance claim |
| **Released** | SDL/release automation |
| **Accepted** (without “review” qualifier) | Use **Provided** + **Requires review** instead in design phase |
| **Complete** (absolute) | Implies readiness |

### 7.3 Mapping to B5.3 functional statuses (future implementation)

| B6.3 display label | B5.3 functional status (target backend) |
|--------------------|----------------------------------------|
| Not uploaded | `required missing` |
| Open | `required missing`, `checked rejected`, or `expired` |
| Provided | `uploaded unchecked` or `generated unchecked` |
| Requires review | `uploaded unchecked`, `generated unchecked`, `validity unclear` |
| Not applicable | `not applicable` |
| *(hidden)* | `not required` |
| *(future)* | `checked accepted`, `expired` — show **Provided** + validity sub-label, not “Approved” |

---

## 8. Evidence Display Boundaries

| Boundary | Rule |
|----------|------|
| **No upload button** | Design shows disabled “Upload (planned)” or no action column — **no functional upload** |
| **No file storage** | No S3 path, DB blob, or local folder in design spec |
| **No automated verification** | No OCR, auto-accept, or “green check on upload” |
| **No expiry calculation** | May show **“Validity (future)”** column empty — no date math in B6.3 |
| **No release decision** | No “Ready for SDL release” on evidence section |
| **No DIN conformity statement** | No DIN badge on evidence rows |
| **No fake files** | Design mockups in docs must not use real PDFs as gate evidence |
| **No readiness count** | No “5/12 complete” progress bar tied to algorithm |
| **Section banner** | Required: “Evidence tracking — not implemented. Design specification only (B6.3).” |

---

## 9. Relationship to Generated Documents

| Rule | Detail |
|------|------|
| **Separate sections** | Profile **Generated documents** (`output`) = EC-09 actions; **Evidence** (`evidence`) = Nachweis checklist |
| **Prepared outputs** | E8 rows may show “Prepared output available” linking to last/generated DOCX name — **read-only** |
| **Not accepted evidence** | Copy: “Generated documents are **unchecked drafts**. They do **not** count as accepted Nachweise until reviewed (B5.3 §5).” |
| **Datenschutz / Unterweisung** | Template-generated DOCX appears under E8 **and** may be referenced in E3/E5 — status still **Requires review**, never auto-**Provided** as accepted |
| **EC-09 protected** | ZIP generation stays in Output section; evidence design **must not** add alternate generate path |
| **Queue selections** | `selectedRoleDocIds` / `selectedAppointmentDocIds` inform **which E8 rows could exist** — design reference only |

```
  Generated documents (EC-09)          Evidence section (future)
  ───────────────────────────          ──────────────────────────
  User clicks Generate package    →    E8 row: "Package generated"
  ZIP downloads                        Status: Provided / Requires review
                                       NOT: Accepted / Approved
```

---

## 10. Open-Items Logic

Missing evidence surfaces in **Open items** (`open-items` profile section) **without readiness claims** (B6.2 §12).

| Mechanism | B6.3 design rule |
|-----------|------------------|
| **Static catalog** | Until implementation, open items list **example** missing Nachweise as “Planned — see B6.3 catalog” |
| **No auto-derivation** | Do not compute missing set from role in B6.3 or B6 implementation without gate |
| **Row format** | Title + category tag + label **Open** or **Not uploaded** + “Evidence section not implemented” |
| **Severity** | No rot/gelb/grün; use neutral **Open** only |
| **Footer disclaimer** | “Listing open items does not evaluate audit or release readiness.” |
| **Carry-forwards** | B5.8 template items (e.g. `{EndDate}`) stay **informational** — separate from Nachweis rows |
| **Future** | Union of open evidence + open fields per B5.3 §9 — **implementation gate** |

**Example open-item rows (design-time static):**

- Datenschutz — Open — *Evidence tracking not implemented*
- §34a proof — Not uploaded — *Planned requirement for applicable roles*
- Generated Datenschutz DOCX — Requires review — *See Generated documents; not accepted Nachweis*

---

## 11. Risks and Controls

| Risk | Control |
|------|---------|
| Mock checklist looks production-ready | Section banner + all rows default **Not implemented** |
| Generated DOCX shown as green “complete” | E8 uses **Requires review** only; disclaimer in §9 |
| Upload affordance implemented early | B6.3 forbids functional upload; B6.0 §12 F-2 |
| Fake evidence in repo | No sample PDFs committed as proof |
| DIN/compliance language in mockups | §7.2 forbidden list + design review at B6.7 |
| Evidence count on overview | B6.1 — show “—” or “Not evaluated” only |
| B5.3 vocabulary bypassed | §7.3 mapping table for implementation gate |
| EC-09 regression via evidence UI | §9 — generate stays in Output section only |

---

## 12. Proposed Next Slice

**B6.4 — Role / Zusatzrolle / SDL / Project Assignment Design**

| Deliverable | Content |
|-------------|---------|
| Grundrolle vs Zusatzrolle presentation | Distinct from appointment doc checkboxes |
| Overlay badges (SMA, Ersthelfer, Führungskraft) | Visual + requirement hints |
| SDL/project link preview | Interaction design — still no API |
| Evidence trigger tags | Which categories activate per role/SDL (display rules) |
| Traceability | B5.2 roles → B6.4 → B6.3 category scopes |

---

## 13. Gate Recommendation

### **PASS FOR EVIDENCE SECTION DESIGN**

| Criterion | Result |
|-----------|--------|
| Evidence section objective defined | **Yes** (§3) |
| Category model (8 groups) | **Yes** (§4–§5) |
| Minimum evidence examples catalog | **Yes** (§6) |
| Status wording allowed/forbidden | **Yes** (§7) |
| Display boundaries | **Yes** (§8) |
| Generated documents relationship | **Yes** (§9) |
| Open-items logic without readiness | **Yes** (§10) |
| No implementation authorized | **Yes** |
| Aligned with B5.3, B6.0–B6.2 | **Yes** |

**Acceptance of B6.3** authorizes **B6.4 Role / Zusatzrolle / SDL / Project Assignment Design** only.

---

## 14. Source Basis

| Document | Use |
|----------|-----|
| `B6_0_EMPLOYEE_FILE_PRODUCT_DESIGN_BOUNDARY.md` | D-5 evidence UX envelope |
| `B6_1_EMPLOYEE_FILE_IA_NAVIGATION_DESIGN.md` | Section nav, disabled state |
| `B6_2_EMPLOYEE_PROFILE_SECTION_DESIGN.md` | §5.5 evidence placeholder |
| `B5_3_EVIDENCE_AND_REQUIRED_FIELDS_BOUNDARY.md` | Catalog, statuses, open items |
| `B5_5_STANDARD_EMPLOYEE_FILE_OUTPUT_BOUNDARY.md` | Generated vs evidence |
| `modules/03-mitarbeiterakte-tool-2/evidence/README.md` | Module intent |
| `B5_7` / `B5_8B` | Generator baseline |

---

## 15. Commit

Suggested: `docs: define employee file evidence section design (B6.3)`
