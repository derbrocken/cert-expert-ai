# B6.7 — Employee File Design Closure Gate / Implementation Readiness Review

**Gate:** B6.7 — Design stream closure and implementation-preparation authorization  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Prerequisite:** B6.0–B6.6 PASS (design slices complete)

---

## 1. Title and Gate Decision

### **PASS FOR CONTROLLED IMPLEMENTATION PREPARATION WITH CONTROLS**

The B6 Employee File **product-design stream** (B6.0–B6.6) is **closed** as a coherent design boundary. The project is authorized to proceed **only** to **B7.0 — Employee File Implementation Preparation / Backlog Translation** under the controls in §8.

**Not authorized by B6.7:** Direct feature implementation, evidence upload, readiness algorithms, persistence, generator/template/Hetzner changes, or any slice beyond B7.0 preparation without a subsequent explicit gate prompt.

---

## 2. Purpose

B6.7 closes the **Employee File design boundary** initiated at B6.0 and verifies that B6.1–B6.6 form a **consistent, bounded** design pack before any implementation-preparation work begins.

This gate answers:

1. Are design artefacts complete and mutually aligned?
2. Are forbidden claims (certification, release, audit-ready, DIN compliance) controlled across sections?
3. Is the **EC-09 ZIP generator path** explicitly protected through the design transition?
4. Is the **next step** narrowly scoped to documentation/backlog translation (B7.0), not build?

B6.7 is a **readiness decision document** — not an implementation slice.

---

## 3. Input Artefacts Reviewed

| Artefact | Commit / ref | Summary |
|----------|--------------|---------|
| **B6.0** Product design boundary | `569bba3` | Opens B6 design envelope; defines in/out of scope, profile hub, forbidden implementation actions, proposed B6.1–B6.7 slices |
| **B6.1** IA & navigation design | `2c7bad1` | Overview → profile → sections; queue transitional mapping; disabled evidence/SDL nav; copy rules |
| **B6.2** Employee profile section design | `e91bd8b` | Ten profile sections; master/employment/roles active; evidence/SDL/notes placeholders; output wraps EC-09 |
| **B6.3** Evidence / Nachweise section design | `6a34d73` | Eight evidence categories; status wording; no upload; generated ≠ accepted; open-items linkage |
| **B6.4** Role / SDL / project assignment design | `a7c9049` | Grundrolle catalog, Zusatzrollen, SDL types, project preview; assignment ≠ release |
| **B6.5** Readiness / Ampel display boundary | `477dd22` | Display-only R/Y/G semantics; B6 live = grey **Not evaluated** only; ZIP must not change ampel |
| **B6.6** Generator output section design | `8262824` | Output blocks A–F; batch vs profile generate; EC-09 protection rules; carry-forwards |
| **B5.7** Workspace shell baseline | `52ca548` (+ `5ac5520` addendum) | Transitional Employee File Workspace; summary panel; EC-09 control **closed** |
| **B5.8a** Output quality verification | `cac9b50` | PASS WITH CONTROLS; date/format/template findings documented |
| **B5.8b** DD.MM.YYYY date fix | `27a284b` | Generator date normalization; EC-09 re-verified |
| **EC-09 control verification** | B5.7 addendum, B5.8b evidence | ZIP generation PASS; Hetzner templates; no generator regression from B5.7 UI |

**Functional anchors (not re-opened in B6):** B5.2–B5.5 object, evidence, readiness, output boundaries; `HARD_CONTROLS` C-01–C-10.

---

## 4. Design Closure Assessment

| Design element | Sufficiently defined? | Evidence in B6 pack |
|----------------|----------------------|---------------------|
| **Employee file as controlled profile object** | **Yes** | B6.0 §3, B6.1 queue→profile transition, B6.2 section map; transitional `Employee` / queue acknowledged |
| **Profile sections and navigation** | **Yes** | B6.1 areas A–G; B6.2 §4–§5 per-section specs; L0–L2 route intent documented (not implemented) |
| **Evidence as reviewable upload — not auto-accepted proof** | **Yes** | B6.3 §8–§9; forbidden auto-accept; E8 generated vs uploaded distinction; B5.3 functional anchor |
| **Role / Zusatzrolle / SDL / project as assignment context — not release** | **Yes** | B6.4 §4–§8; forbidden Released/Approved/DIN; overlay ≠ doc checkbox |
| **Readiness / Ampel as display-only boundary** | **Yes** | B6.5 §5 B6 grey default; no algorithms; forbidden certification labels |
| **Generator output as prepared draft — not accepted evidence** | **Yes** | B6.6 §6–§8; Requires review; B5.7 disclaimer lineage |
| **Generator queue and ZIP path remain stable** | **Yes** | B6.1 §8, B6.6 §4 baseline; batch generate retained; no refactor authorized |
| **EC-09 protected** | **Yes** | B6.6 §12; B6.0/B5.5; C-09; B5.7/B5.8b verification PASS |

**Coherence check:** No B6 document authorizes implementation, persistence, or readiness computation. Terminology (Prepared, Requires review, Not evaluated, Not implemented) is **consistent** across B6.2, B6.3, B6.5, B6.6. Assignment and evidence scopes **align** (B6.3 E6–E7 tags ↔ B6.4 assignments).

**Minor gaps (controls, not blockers):** Output history, profile-only generate UI, evidence checklist UI, SDL/project pickers — all explicitly **deferred** to B7+ with design placeholders. Template/footer/`{EndDate}` carry-forwards documented in B5.8 and B6.6 §11.

**Assessment:** Design closure **sufficient** for controlled implementation **preparation** only.

---

## 5. Explicitly Authorized Next Step

### **B7.0 — Employee File Implementation Preparation / Backlog Translation**

B7.0 **may** produce:

| Deliverable | Allowed in B7.0 |
|-------------|-----------------|
| Implementation backlog / ticket breakdown | Yes — derived from B6 + B5 boundaries |
| Acceptance criteria per future slice | Yes — testable, EC-09 smoke referenced |
| File inspection lists (read-only inventory before any code gate) | Yes |
| Limited execution plan (ordered slices, gate dependencies) | Yes |
| Traceability matrix B5 → B6 → B7 backlog items | Yes |
| Documentation updates in `docs/03-controls/` only | Yes — if B7.0 gate prompt accepts |

B7.0 **must not** ship user-facing feature code unless a **separate** post–B7.0 implementation gate explicitly authorizes a named slice and file allow list.

---

## 6. Explicitly Not Authorized

The following remain **forbidden** after B6.7 until explicit future gates:

| # | Not authorized |
|---|----------------|
| N-1 | Full employee file implementation |
| N-2 | Evidence upload implementation |
| N-3 | Readiness algorithms or ampel computation (beyond existing grey **Not evaluated** badges) |
| N-4 | Automatic approval / release / certification claims in UI |
| N-5 | Generator, template, or Hetzner/storage refactor |
| N-6 | Database or persistence model changes |
| N-7 | Customer-facing portal logic |
| N-8 | KPI target setting / Ziel-Etablierung |
| N-9 | Tool 1 changes |
| N-10 | CEKS / bot-pack expansion |
| N-11 | Full project file (*Projektakte*) or company file (*Unternehmensakte*) implementation |
| N-12 | Fake evidence, templates, ZIPs, or invented readiness metrics |

---

## 7. EC-09 Protection

Restated for all B7+ work originating from this design pack:

| Rule | Detail |
|------|--------|
| **Stable path** | EmployeeForm → `employee-queue-storage` (localStorage) → template selection → `generateEmployeeDocs` server action → Hetzner template fetch → ZIP download **must remain usable** |
| **No alternate fill** | No client-only DOCX generation bypass |
| **Readiness isolation** | ZIP success **must not** change readiness/Ampel (B6.5 D-9) |
| **Output status** | Generated documents: **Prepared** / **Generated — requires review** only |
| **Evidence boundary** | No generated output treated as **accepted evidence** automatically (B5.3, B6.3, B6.6) |
| **Regression** | Any implementation slice touching generation requires EC-09 smoke (real Hetzner, real ZIP) per B5.7/B5.8 method |
| **C-09** | Stabilization protected — generator changes require dedicated gate |

---

## 8. Required Controls for B7.0

| Control ID | Requirement |
|------------|-------------|
| **C-B7-01** | **Inspect before modify** — no code changes without prior file inventory |
| **C-B7-02** | **Inspection list mandatory** — B7.0 must list all files to be read before any future implementation slice |
| **C-B7-03** | **No implementation before B7.0 gate prompt accepted** — this document alone does not authorize code |
| **C-B7-04** | **Separate docs from code** — B7.0 commits must not mix backlog docs with feature implementation in same gate unless explicitly approved |
| **C-B7-05** | **Acceptance tests before implementation** — B7.0 defines tests (incl. EC-09 smoke criteria) per backlog item before any build gate |
| **C-B7-06** | **Preserve B5.7 shell** — workspace notice, summary panel, queue flow remain until replacement slice says otherwise |
| **C-B7-07** | **Carry-forwards explicit** — B7.0 backlog must include: footer metadata gaps (T2-BUG-09b), `{EndDate}` unmapped, T2-BUG-10 watch, template standardization deferred, `logoFile` session persistence |
| **C-B7-08** | **No secrets** — do not touch `.env.local` or commit credentials |
| **C-B7-09** | **Scope wall** — unrelated repo changes (hq/, bots/, Tool 1) out of B7 Tool 2 stream |

---

## 9. Gate Checklist

| # | Check | Result |
|---|-------|--------|
| G-1 | B6 design artifacts complete (B6.0–B6.6) | **PASS** |
| G-2 | Design boundaries consistent across slices | **PASS** |
| G-3 | Forbidden wording controlled (certified, audit-ready, DIN, released) | **PASS** |
| G-4 | EC-09 protected in design and baseline verification | **PASS** |
| G-5 | Implementation scope limited to B7.0 preparation | **PASS** |
| G-6 | No UI overreach (placeholders/disabled states explicit) | **PASS** |
| G-7 | No data model / persistence design in B6 | **PASS** |
| G-8 | No readiness/release automation authorized | **PASS** |
| G-9 | Generator output = draft/prepared, not accepted evidence | **PASS** |
| G-10 | Next slice (B7.0) clearly bounded | **PASS** |
| G-11 | B5.7/B5.8 generator quality baseline acknowledged | **PASS** |
| G-12 | Carry-forwards listed for B7.0 | **CONTROL** — must appear in B7.0 backlog |
| G-13 | Profile-only generate / output history / evidence UI | **DEFERRED** — B7+ implementation gates |

---

## 10. Acceptance Criteria for B6.7

| AC | Criterion | Met |
|----|-----------|-----|
| AC-1 | This markdown document exists | **Yes** |
| AC-2 | References B6.0–B6.6 | **Yes** — §3, §4 |
| AC-3 | Clear gate decision | **Yes** — §1 PASS WITH CONTROLS |
| AC-4 | Authorizes only B7.0 implementation preparation | **Yes** — §5 |
| AC-5 | Forbids direct feature implementation | **Yes** — §6 |
| AC-6 | Protects EC-09 | **Yes** — §7 |
| AC-7 | Includes required controls and carry-forwards | **Yes** — §8, §9 G-12 |
| AC-8 | No code or package changes in B6.7 slice | **Yes** — docs only |

**B6.7 gate:** **CLOSED** — subject to controls in §8 when entering B7.0.

---

## 11. Carry-Forwards into B7.0 Backlog

| ID | Item | Source |
|----|------|--------|
| CF-01 | Footer/global metadata placeholders not rendered when templates omit tokens | B5.8a/b, B6.6 §11 |
| CF-02 | `{EndDate}` in training templates — not mapped in generator | B5.8b |
| CF-03 | T2-BUG-10 duplicate content — watch, not reproduced | B5.8a |
| CF-04 | Template standardization / placeholder audit | B5.8, B6.3 |
| CF-05 | `logoFile` session-only persistence | B4.2 |
| CF-06 | Summary panel en-US date display vs DD.MM.YYYY profile design rule | B6.2 §6.2 |
| CF-07 | Output history store | B6.6 §13 |
| CF-08 | Evidence upload and checklist persistence | B6.3 |
| CF-09 | Readiness evaluator and ampel colors (post-grey) | B6.5 |
| CF-10 | SDL/project link persistence | B6.4 |

---

## 12. Proposed B7.0 Scope Sketch (not authorized until B7.0 gate)

For B7.0 document planning only:

1. Traceability matrix: B5.2–B5.5 functional → B6 design → proposed implementation slices  
2. Backlog items with gate IDs (e.g. B7.1 UI shell, B7.2 profile routes — **names TBD in B7.0**)  
3. EC-09 regression checklist template  
4. File inspection list for `/employee-automation` module tree  
5. Explicit **out of scope** repeat from §6  

---

## 13. Commit

`docs: close employee file design gate for implementation preparation (B6.7)`

---

## 14. Document History

| Version | Date | Event |
|---------|------|-------|
| 1.0 | 2026-06-05 | B6.7 design closure gate — PASS FOR CONTROLLED IMPLEMENTATION PREPARATION WITH CONTROLS |
