# B6.5 — Employee File Readiness / Ampel Display Boundary Design

**Gate:** B6.5 — Readiness and Ampel **display boundary** design only  
**Status:** **OPEN** — design document; **does not authorize implementation or algorithms**  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**Prerequisite:** B6.4 PASS FOR ROLE SDL PROJECT ASSIGNMENT DESIGN (`a7c9049`)  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Functional anchor:** B5.4 readiness layers; HARD_CONTROLS C-01–C-06

---

## 0. Control Decision

**B6.5 defines how future readiness and Ampel (traffic-light) indicators may be *displayed* in the Tool 2 Employee Profile — not how they are computed.**

| Decision | Detail |
|----------|--------|
| What B6.5 does | Display boundary for status concepts, color semantics, allowed/forbidden labels, relationships to evidence/assignments/output |
| What B6.5 does **not** do | Readiness algorithms, ampel calculation, blocking logic, release automation, or UI implementation |
| Next gate | B6.6 Generator Integration / Output Section Design — **design only**, after B6.5 acceptance |

**B6 rule:** In the B6 design phase, **all live indicators remain `Not evaluated` / `Not implemented`** unless explicitly documented as manual design mock — never computed.

---

## 1. Summary

Tool 2 will eventually show **scoped readiness** and **Ampel colors** to help operators see open points before release preparation (B5.4). **B6.5** specifies the **display contract only**: what colors and labels **mean** when shown, what they **must never** imply, and how they relate to evidence, roles, SDL/project assignments, and generated documents.

No calculation, no aggregation, no automatic blocking, and no release or certification claims appear in this slice. B5.7 static badges (“Evidence: not implemented”, “Readiness: not evaluated”) remain the **only** production-appropriate readiness UI until B7+ implementation gates.

**Expected gate result:** **PASS FOR READINESS AMPEL DISPLAY BOUNDARY DESIGN**

---

## 2. Source Baseline

### 2.1 B6.0 product-design boundary

- Readiness / ampel **presentation** allowed (D-10); **computation** forbidden (O-3, O-4).
- No global audit-ready or certification UI (EC-10).

### 2.2 B6.1 IA and navigation design

- Overview **File status** column: Draft, Open, Not evaluated — not ampel-driven.
- Profile header: scoped ampel **placeholder** (gray / “Not evaluated”).

### 2.3 B6.2 employee profile section design

- Static badges in summary header; open items **without** readiness algorithm.
- Forbidden profile status labels (Certified, Audit-ready, etc.).

### 2.4 B6.3 evidence section design

- Evidence status vocabulary (Not uploaded, Open, Provided, Requires review, …).
- B6.3 §7.3 maps display labels to B5.3 functional statuses — **future backend**.
- No expiry calculation or upload status computation in B6.

### 2.5 B6.4 role / SDL / project assignment design

- Assignment status: Assigned, Not assigned, Prepared, Requires review — **not** Released/Approved.
- Assignments may **later influence** scoped readiness — B6.5 does not calculate this.

### 2.6 B5.7 / B5.8 generator baseline

| Runtime today | Readiness display implication |
|---------------|------------------------------|
| Static “Readiness: not evaluated” badge | **Correct** — retain until evaluator gate |
| ZIP generate success | **Must not** turn ampel green |
| EC-09 PASS | Generator protected (C-09) — readiness UI must not require generator changes |
| Queue-only persistence | No durable readiness state to display |

### 2.7 B5.4 functional readiness (reference only)

B5.4 defines **layers**, rot/gelb/grün/grau **functional meaning**, and blockers — B6.5 **translates** these into **UI display rules** without implementing evaluation.

---

## 3. Readiness Display Objective

Define **how future status indicators may be displayed** so operators can orient without Tool 2 **deciding** release, audit, or certification outcomes.

| Objective | Detail |
|-----------|--------|
| **Inform** | Show scoped summary: “For [context], these areas need attention” |
| **Scope** | Every ampel must answer “ready **for what**?” (C-05) |
| **Honesty** | Default in B6: **Not evaluated** — no fake colors |
| **Separation** | Display layer ≠ decision layer |
| **No algorithm** | B6.5 does not define weights, formulas, or auto-aggregation |

**Explicitly excluded from B6.5:** release decision, DIN judgement, auditor-facing certification, automatic blocking of generate or deploy.

---

## 4. Status Concept Definitions

Six **display status domains** — distinct chips/rows; may appear in profile header, section headers, or open-items list.

### 4.1 Employee file status

| Aspect | Definition |
|--------|------------|
| **What it represents** | Lifecycle and structural maintainability of the file (B5.4 completeness layer) |
| **Examples** | Draft, Open, Inactive (future) |
| **B6 display default** | **Not evaluated** (or **Draft** / **Open** from B6.1 when queue entry exists) |
| **Not the same as** | Audit-readiness, certification, release |

### 4.2 Evidence status

| Aspect | Definition |
|--------|------------|
| **What it represents** | Per-Nachweis state on checklist (B6.3 / B5.3 §7) |
| **Examples** | Not uploaded, Provided, Requires review, Not applicable |
| **B6 display default** | Section **Not implemented**; no per-item colors |
| **Not the same as** | “Evidence complete” or “Verified” |

### 4.3 Role assignment status

| Aspect | Definition |
|--------|------------|
| **What it represents** | Grundrolle + Zusatzrolle assignment on file (B6.4) |
| **Examples** | Assigned, Not assigned, Requires review |
| **B6 display default** | Grundrolle **Assigned** when `roleId` set; overlays transitional |
| **Not the same as** | Role certified or qualification approved |

### 4.4 SDL / project assignment status

| Aspect | Definition |
|--------|------------|
| **What it represents** | Link to Sicherheitsdienstleistung or Projekt/Objekt context |
| **Examples** | Not assigned, Assigned (future), Prepared (manual future) |
| **B6 display default** | **Not assigned** / **Not implemented** |
| **Not the same as** | SDL released or object cleared |

### 4.5 Generated-document status

| Aspect | Definition |
|--------|------------|
| **What it represents** | EC-09 output artifacts as **prepared drafts** (B6.3 E8) |
| **Examples** | Prepared, Requires review, Not generated |
| **B6 display default** | Informational only after generate — **Requires review**, never Accepted |
| **Not the same as** | Accepted evidence or release package |

### 4.6 Review status

| Aspect | Definition |
|--------|------------|
| **What it represents** | Fachliche human review outcome on field, evidence, or generated doc |
| **Examples** | Requires review, Prepared (review pending), Not applicable |
| **B6 display default** | **Not evaluated** — no review workflow |
| **Not the same as** | Approved, Signed off, Automatically verified |

---

## 5. Ampel Color Boundary (Display-Only)

Colors are **semantic hints** for operators when an evaluator exists (B7+). In **B6**, only **Grey** is used in production designs; R/Y/G appear in **documentation mockups** labeled “future — not implemented.”

### 5.1 Grey

| Attribute | Specification |
|-----------|---------------|
| **Display meaning** | Not implemented / not evaluated / not applicable (with justification) |
| **B6 production use** | **Only** allowed live ampel state |
| **Copy examples** | “Not evaluated”, “Readiness not implemented”, “N/A — no SDL linked” |
| **Maps to B5.4** | Gray / not relevant; Layer not evaluated; Context not selected |
| **Forbidden pairing** | Grey labeled “passed” or “OK to deploy” |

### 5.2 Red (future only — design reference)

| Attribute | Specification |
|-----------|---------------|
| **Display meaning** | Blocker or missing **critical** information **in evaluated context** (B5.4 §6) |
| **B6 use** | **Design mock only** — not computed |
| **Copy examples** | “Blocker — §34a proof missing (scope: SMA)” — always list items, not single red dot alone |
| **Maps to B5.4** | Red / blocked (C-02) |
| **Rules** | Red overrules yellow and green in same context; must name scope |

### 5.3 Yellow (future only — design reference)

| Attribute | Specification |
|-----------|---------------|
| **Display meaning** | Open / requires review / incomplete — **not passed** (C-03) |
| **B6 use** | **Design mock only** |
| **Copy examples** | “Open points — Datenschutz unchecked”, “Requires review” |
| **Maps to B5.4** | Yellow / usable with open points |
| **Rules** | Gelb is not bestanden; list open items |

### 5.4 Green (future only — design reference)

| Attribute | Specification |
|-----------|---------------|
| **Display meaning** | **Prepared or reviewed** for **defined context** — no rot in scope; required reviews done (C-01) |
| **B6 use** | **Design mock only** |
| **Copy examples** | “Prepared for SDL: Veranstaltungsdienst (review recorded)” — **never** standalone green |
| **Maps to B5.4** | Green / ready for defined context |
| **Critical rule** | Green = **never** certification, audit-ready, DIN-compliant, or released |
| **Required qualifier** | Always show context label adjacent to green indicator |

### 5.5 B6 mandatory default

| Surface | Required B6 label/color |
|---------|-------------------------|
| Profile header ampel | **Grey** + “Not evaluated” |
| Overview readiness column | **Not evaluated** or “—” |
| Section ampels (evidence, SDL, …) | **Not implemented** |
| Post-ZIP generate | **No ampel change** |

---

## 6. Allowed Status Labels

May appear in UI copy, design mocks, and future implementation **if** paired with scope and without forbidden claims.

| Label | Typical domain | B6 allowed live? |
|-------|----------------|------------------|
| **Draft** | Employee file | Yes (new entries) |
| **Open** | File, evidence item, open items | Yes (informational) |
| **Not evaluated** | Readiness, ampel summary | **Yes — default** |
| **Not implemented** | Evidence, SDL, readiness engine | **Yes — default** |
| **Not uploaded** | Evidence (future) | Mock only |
| **Provided** | Evidence / generated doc | Mock only — not “accepted” |
| **Prepared** | Release prep step (manual future) | Mock only — scoped |
| **Requires review** | Evidence, assignment, generated doc | Mock only |
| **Not applicable** | Evidence, field, overlay | Mock only — needs justification text (future) |

**Scoped green/yellow/red labels (future):** Must include context suffix, e.g. “Yellow — open points for Rolle SMA”, never bare “Yellow” as employee status.

---

## 7. Forbidden Status Labels / Claims

**Never** in Tool 2 UI, design artefacts presented as production, or ampel tooltips:

| Forbidden | Reason |
|-----------|--------|
| **Approved** | Sign-off / Freigabe |
| **Released** | SDL/release automation |
| **Certified** / **Zertifiziert** | Certification authority |
| **DIN-compliant** / **DIN-konform** | Compliance claim |
| **Audit-ready** / **Auditfähig** | C-06, EC-08 |
| **Certification-ready** | Implies external certification |
| **Fully compliant** | Absolute compliance |
| **Automatically verified** | No auto-verification in Tool 2 |
| **Complete** (absolute, file-wide) | Implies total readiness |
| **Passed** / **Bestanden** (readiness) | C-03 — gelb is not passed |
| **Freigegeben** | Release decision |
| **Einsatzbereit** (unqualified) | Deployment clearance |

**B5.7 disclaimer lineage must remain** wherever generate or profile summary appears.

---

## 8. Display-Only Rules

| # | Rule |
|---|------|
| D-1 | **Status may inform, not decide** — UI shows state; humans decide release outside Tool 2 |
| D-2 | **No automated blocking** — ampel must not disable Generate, save, or navigation in B6/B7 without explicit gate |
| D-3 | **No automatic release** — no button “Release to SDL” that completes without human gate |
| D-4 | **No automatic DIN judgement** — DIN 77200 mentioned only as **context tag** (B6.4), never as ampel label |
| D-5 | **No auditor-facing claim** — no “audit package complete” banner |
| D-6 | **Scope mandatory** — any future color requires visible scope string (C-05) |
| D-7 | **Red lists blockers** — red summary must link to open-items rows, not icon alone |
| D-8 | **Green requires review trail (future)** — C-01: no ungeprüftes Grün |
| D-9 | **Generate success ≠ green** — ZIP download does not update ampel |
| D-10 | **Multiple contexts** — separate ampel per SDL/project scope allowed in design; no single global green employee icon |

---

## 9. Relationship to Evidence

| Rule | Detail |
|------|--------|
| **Future feed** | Evidence statuses (B6.3) may **inform** evidence readiness layer display (B5.4) |
| **B6.5 scope** | Does **not** define validation, upload detection, or check workflows |
| **No expiry calculation** | No “expires in 30 days” badges in B6 |
| **No upload calculation** | No “3/5 uploaded” progress bars tied to live data |
| **Generated unchecked** | Maps to **Requires review** / yellow (future) — not Provided-as-accepted |
| **Open items link** | Evidence gaps listed in open-items panel with **Open** label — not rot until evaluator gate |

---

## 10. Relationship to Roles / SDL / Project Assignments

| Rule | Detail |
|------|--------|
| **Future influence** | Grundrolle, Zusatzrolle, SDL, Projekt may **scope** which readiness layers are shown (B6.4) |
| **No calculation** | B6.5 does **not** compute “role readiness” or “SDL readiness” scores |
| **Display-only assignment status** | Assigned / Not assigned chips independent of ampel color in B6 |
| **Context not selected** | Future yellow/grey: “Select SDL to evaluate SDL readiness” — design copy only |
| **No DIN on SDL card** | SDL assignment preview never shows green “SDL OK” |

**Example future header (mock, not live):**

```
Readiness: Not evaluated
Scope: [ not selected ▼ ]   ← B6: disabled, grey
Grundrolle: SMA (Assigned)  ← not green
```

---

## 11. Relationship to Generated Documents

| Rule | Detail |
|------|--------|
| **Prepared label** | After EC-09 generate, design allows chip **“Prepared — requires review”** on output history row |
| **Not accepted evidence** | Generated Datenschutz DOCX ≠ Nachweis akzeptiert |
| **No ampel boost** | Successful ZIP must not flip profile ampel to yellow/green |
| **EC-09 protected** | Readiness UI must not add generate preconditions in B6 |
| **Output history (future)** | Each row: timestamp, scope, **Generated-document status** = Prepared / Requires review |

---

## 12. Risk Controls

| Risk | Control |
|------|---------|
| **Misleading green** | B6: grey only live; green mock requires context qualifier + “design only” |
| **ZIP → green** | D-9; B5.7 disclaimer |
| **Certification creep** | §7 forbidden list; EC-10 review at B6.7 |
| **Fake progress bars** | No upload/evidence counts in B6 |
| **Global employee traffic light** | C-05 — per-context ampels only in design |
| **Auto-block generate** | D-2 — explicit B7 gate for any blocking |
| **Auditor misuse** | D-5 — no audit-ready banner |
| **Generator regression** | C-09 — readiness work must not touch `generate-employee-docs` in B6 |
| **B5.7 badge removal** | Keep “Readiness: not evaluated” until evaluator ships |

---

## 13. MVP State and Future State

### 13.1 Current / B6 state (design phase)

| Element | State |
|---------|--------|
| Profile ampel | **Grey — Not evaluated** |
| Evidence readiness | **Not implemented** |
| Assignment readiness | Display assignment chips only — **no ampel** |
| SDL/project readiness | **Not assigned / Not implemented** |
| Open items | Informational **Open** rows — no rot/gelb/grün |
| Algorithms | **None** |
| B5.7 badges | **Retain** |

### 13.2 Future / B7+ state (separate gates)

| Capability | Requirement |
|------------|-------------|
| Readiness evaluator | B7 implementation gate + B5.4 alignment tests |
| Ampel colors (R/Y/G) | Only after evaluator; C-01–C-04 enforced |
| Manual override / Prepared | Human-recorded, scoped — audit trail |
| Blocking generate on rot | Optional policy — **explicit gate**, not B6.5 default |
| Audit contribution view | Display impact only (C-06) |

**Rule:** Algorithm-supported status **only after separate gate** — B6.5 does not authorize it.

---

## 14. Out-of-Scope List

- Code, components, readiness-rules module implementation  
- Database persistence of readiness snapshots  
- Evidence upload, storage, expiry engines  
- Ampel calculation, scoring, weights, cron jobs  
- Release automation, SDL freigabe workflows  
- DIN compliance, audit certification, KPI/target establishment  
- LMS, training calendar  
- Tool 1, Hetzner, templates, generator, `.env.local`  
- Negativtest automation (N-01–N-07) — B7+ QA gate

---

## 15. Proposed Next Slice

**B6.6 — Generator Integration / Output Section Design**

| Deliverable | Content |
|-------------|---------|
| Output section layout | Company context, doc picks, generate, history |
| Preconditions messaging | Display-only “open items may affect preparation” — no block |
| Post-generate copy | Prepared / Requires review chips |
| EC-09 protection rules | Same path as B5.7/B5.8 |
| Cross-links | Roles section, evidence E8, readiness disclaimers |

---

## 16. Gate Recommendation

### **PASS FOR READINESS AMPEL DISPLAY BOUNDARY DESIGN**

| Criterion | Result |
|-----------|--------|
| Readiness display objective | **Yes** (§3) |
| Status concept definitions | **Yes** (§4) |
| Ampel color boundary (G/R/Y/G + B6 grey default) | **Yes** (§5) |
| Allowed / forbidden labels | **Yes** (§6–§7) |
| Display-only rules | **Yes** (§8) |
| Evidence / assignment / output relationships | **Yes** (§9–§11) |
| Risk controls | **Yes** (§12) |
| MVP vs future state | **Yes** (§13) |
| No algorithm or implementation | **Yes** |

**Acceptance of B6.5** authorizes **B6.6 Generator Integration / Output Section Design** only.

---

## 17. Source Basis

| Document | Use |
|----------|-----|
| `B6_0` – `B6_4` | Design envelope, sections, assignments, evidence |
| `B5_4_READINESS_AND_RELEASE_PREPARATION_RULES_BOUNDARY.md` | Functional layers, rot/gelb/grün |
| `docs/03-controls/HARD_CONTROLS.md` | C-01–C-06 |
| `docs/02-acceptance/ACCEPTANCE_BASELINE.md` | EC-05, EC-08, EC-10 |
| `B5_7` / `B5_8B` | Current badges, EC-09 |

---

## 18. Commit

Suggested: `docs: define employee file readiness ampel display boundary (B6.5)`
