# B7.0 — Employee File Implementation Preparation / Backlog Translation

**Gate:** B7.0 — Implementation preparation and backlog translation only  
**Status:** **READY FOR LIMITED IMPLEMENTATION PLANNING — NOT IMPLEMENTATION**  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**Prerequisite:** B6.7 PASS FOR CONTROLLED IMPLEMENTATION PREPARATION WITH CONTROLS (`e448d4e`)  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Active module:** `modules/03-mitarbeiterakte-tool-2/`  
**Primary route (today):** `/employee-automation`

---

## 1. Title and Gate Status

### **READY FOR LIMITED IMPLEMENTATION PLANNING — NOT IMPLEMENTATION**

B7.0 translates the closed B6 Employee File design stream (B6.0–B6.7) into a **controlled implementation-preparation backlog**. This gate **authorizes documentation and planning only**. It **does not authorize** feature code, generator changes, or any build slice.

**Next authorized gate after B7.0 closure:** **B7.1 — Employee File Workspace Implementation Slice Planning / File-Level Execution Gate** (planning and file inspection only; code changes require explicit approval in a subsequent gate).

---

## 2. Purpose

B7.0 answers: *How do we move from accepted B6 design boundaries to ordered, gated implementation slices without breaking EC-09 or expanding scope?*

This document:

1. **Traces** functional anchors (B5.2–B5.5), runtime baseline (B5.7/B5.8), and B6 design decisions into a single backlog structure.
2. **Defines** implementation-preparation principles and required acceptance criteria for all future build gates.
3. **Lists** files to inspect (read-only) before any code modification.
4. **Organizes** epics A–H with allowed preparation work, forbidden scope, dependencies, and EC-09 regression hooks.
5. **Carries forward** open items from B6.7 §11 without treating them as authorized implementation.
6. **Protects** the existing generator queue and ZIP download path as the runtime baseline.

B7.0 is a **backlog translation document** — not an implementation slice.

---

## 3. Source Artefacts

| Artefact | Commit / ref | Role in B7.0 backlog |
|----------|--------------|----------------------|
| **B5.2** Employee file object boundary | B5 stream | Functional truth: employee file as controlled profile object |
| **B5.3** Evidence and required fields boundary | B5 stream | Evidence ≠ auto-accepted; generated ≠ uploaded |
| **B5.4** Readiness and release preparation rules | B5 stream | Readiness display-only; no release automation |
| **B5.5** Standard employee file output boundary | B5 stream | Output = prepared draft; EC-09 protection lineage |
| **B5.7** Employee File MVP Slice 1 / workspace shell | `52ca548`, `5ac5520` | Transitional workspace; summary panel; queue table; EC-09 control **closed** |
| **B5.7 EC-09** Control verification | B5.7 addendum | ZIP generation PASS; Hetzner templates; regression method |
| **B5.8a** Tool 2 output quality verification | `cac9b50` | PASS WITH CONTROLS; template/date findings |
| **B5.8b** Minimal output quality fix (DD.MM.YYYY) | `27a284b` | Date normalization; EC-09 re-verified |
| **B6.0** Product design boundary | `569bba3` | Design envelope; in/out of scope; profile hub intent |
| **B6.1** IA & navigation design | `2c7bad1` | Overview → profile → sections; queue transitional mapping |
| **B6.2** Employee profile section design | `e91bd8b` | Ten profile sections; master/employment/roles active |
| **B6.3** Evidence / Nachweise section design | `6a34d73` | Eight categories; status wording; no upload in B6 |
| **B6.4** Role / Zusatzrolle / SDL / project assignment design | `a7c9049` | Assignment context; assignment ≠ release |
| **B6.5** Readiness / Ampel display boundary | `477dd22` | Display-only R/Y/G; B6 live = grey **Not evaluated** only |
| **B6.6** Generator output section design | `8262824` | Output blocks A–F; batch vs profile generate; EC-09 rules |
| **B6.7** Design closure gate | `e448d4e` | Authorizes B7.0 only; carry-forwards; controls C-B7-01–C-B7-09 |
| **HARD_CONTROLS** | `docs/` | C-01–C-10; C-09 generator stabilization |
| **ACCEPTANCE_BASELINE** | `docs/` | Cross-gate acceptance vocabulary |

**Functional anchors (not re-opened in B7.0):** B5.2–B5.5 object, evidence, readiness, output boundaries.

---

## 4. Traceability: B5 → B6 → B7 Backlog

| B5 functional anchor | B6 design slice | B7 epic (preparation) | Future implementation gate (TBD name) |
|----------------------|-----------------|----------------------|----------------------------------------|
| B5.2 Object boundary | B6.0, B6.1, B6.2 | Epic B — Profile | B7.x profile slice (post–B7.1 planning) |
| B5.3 Evidence boundary | B6.3 | Epic C — Evidence | B7.x evidence UI slice (deferred; upload gated separately) |
| B5.4 Readiness boundary | B6.5 | Epic E — Readiness/Ampel | B7.x display-only slice (no algorithm) |
| B5.5 Output boundary | B6.6 | Epic F — Generator output | B7.x output section slice (wrap EC-09) |
| B5.7 Workspace shell | B6.1 | Epic A — Preserve shell | B7.x shell evolution (explicit gate only) |
| B6.4 Assignments | B6.4 | Epic D — Role/SDL/Project | B7.x assignment UI slice (no persistence) |
| EC-09 generator path | B6.6 §12, B6.7 §7 | Epic G — Regression | Every generator-touching slice |
| B6.7 carry-forwards | B6.6 §11, B6.7 §11 | Epic H — Carry-forward controls | Separate template/generator gates only |

---

## 5. Implementation-Preparation Principles

These principles apply to **all** future implementation gates derived from this backlog:

| ID | Principle |
|----|-----------|
| **P-01** | **Inspect before modify** — no code changes without prior file inventory (C-B7-01). |
| **P-02** | **Backlog before code** — every build slice must map to a backlog ID and gate authorization. |
| **P-03** | **Acceptance criteria before implementation** — tests defined in planning gate before any code gate (C-B7-05). |
| **P-04** | **EC-09 must remain protected** — EmployeeForm → `employee-queue-storage` → template selection → `generateEmployeeDocs` → Hetzner → ZIP. |
| **P-05** | **Existing generator queue and ZIP download remain baseline** — batch generate retained until replacement slice explicitly authorized. |
| **P-06** | **Generated documents remain Prepared / Requires review only** — never accepted evidence, never released, never certified. |
| **P-07** | **Evidence is not auto-accepted** — upload, checklist, and persistence require separate gates. |
| **P-08** | **Assignments are not release decisions** — role/SDL/project UI is context only (B6.4). |
| **P-09** | **Readiness/Ampel remains display-only** unless separately gated — no evaluator, no color change from ZIP success (B6.5 D-9). |
| **P-10** | **ZIP success must not change readiness/Ampel** — generation outcome isolated from readiness display. |
| **P-11** | **Separate docs from code** — backlog/planning commits must not mix with feature implementation in the same gate unless explicitly approved (C-B7-04). |
| **P-12** | **Preserve B5.7 shell** — workspace notice, summary panel, queue flow until replacement slice says otherwise (C-B7-06). |
| **P-13** | **No secrets** — do not touch `.env.local` or commit credentials (C-B7-08). |
| **P-14** | **Scope wall** — unrelated repo changes (hq/, bots/, Tool 1) out of Tool 2 stream (C-B7-09). |

---

## 6. File Inspection Plan

Before **any** future implementation slice modifies code, inspect and record the **actual** state of these paths (read-only in B7.0; update inventory in B7.1):

### 6.1 Route and page entry

| Path | Purpose |
|------|---------|
| `apps/certification-os/app/employee-automation/page.tsx` | Next.js route entry for `/employee-automation` |
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeAutomationPage.tsx` | Primary workspace page composition |

### 6.2 Employee file / workspace UI (B5.7 shell)

| Path | Purpose |
|------|---------|
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeForm.tsx` | Employee intake form; queue input |
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeTable.tsx` | Generator queue table |
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeFileSummaryPanel.tsx` | Row summary panel |
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeFileWorkspaceNotice.tsx` | Transitional workspace notice |
| `modules/03-mitarbeiterakte-tool-2/employee-file/GlobalSidebar.tsx` | Sidebar navigation (if active) |
| `modules/03-mitarbeiterakte-tool-2/employee-file/index.ts` | Module exports |
| `modules/03-mitarbeiterakte-tool-2/employee-file/types/employee.ts` | Employee / queue types |
| `modules/03-mitarbeiterakte-tool-2/employee-file/validations/employee-form.ts` | Form validation |
| `modules/03-mitarbeiterakte-tool-2/employee-file/utils/date.ts` | DD.MM.YYYY helpers (B5.8b) |
| `modules/03-mitarbeiterakte-tool-2/employee-file/employee-queue-storage.ts` | localStorage queue persistence (EC-09 upstream) |
| `modules/03-mitarbeiterakte-tool-2/employee-file/README.md` | Module notes |

### 6.3 EC-09 generator path (read-only reference only)

| Path | Purpose |
|------|---------|
| `modules/03-mitarbeiterakte-tool-2/employee-generator/generate-employee-docs.ts` | Core DOCX/ZIP generation logic |
| `modules/03-mitarbeiterakte-tool-2/employee-generator/README.md` | Generator documentation |
| `app/actions/generate-employee-docs.ts` | Server action entry (if wired from UI) |

**EC-09 chain to verify on inspection:** `EmployeeForm` → `employee-queue-storage` → template selection → `generateEmployeeDocs` → Hetzner fetch → ZIP download.

### 6.4 API / template / storage (read-only reference only)

| Path | Purpose |
|------|---------|
| `app/api/templates/route.ts` | Hetzner template fetch |
| `app/api/preview/route.ts` | Document preview (if used) |
| `app/api/uploads/route.ts` | Upload API (admin; not employee-file MVP) |
| `app/api/uploads/folder/route.ts` | Upload folder API |
| `modules/03-mitarbeiterakte-tool-2/document-output/` | Document preview/output components |
| `modules/03-mitarbeiterakte-tool-2/roles/employee-config.ts` | Role configuration |
| `modules/03-mitarbeiterakte-tool-2/roles/admin/UploadsPage.tsx` | Admin uploads (out of B7 employee-file scope) |

### 6.5 Placeholder / deferred module stubs (read-only)

| Path | Purpose |
|------|---------|
| `modules/03-mitarbeiterakte-tool-2/evidence/README.md` | Evidence module placeholder |
| `modules/03-mitarbeiterakte-tool-2/readiness-rules/README.md` | Readiness rules placeholder |
| `modules/03-mitarbeiterakte-tool-2/project-link/README.md` | Project link placeholder |
| `modules/03-mitarbeiterakte-tool-2/acceptance-tests/README.md` | Acceptance test placeholder |
| `modules/03-mitarbeiterakte-tool-2/controls/README.md` | Controls module notes |
| `modules/03-mitarbeiterakte-tool-2/README.md` | Tool 2 module overview |

### 6.6 Control documentation (read-only)

| Path | Purpose |
|------|---------|
| `docs/03-controls/B5_7_EMPLOYEE_FILE_MVP_SLICE_1_IMPLEMENTATION_REPORT.md` | B5.7 workspace shell evidence |
| `docs/03-controls/B5_8A_TOOL_2_OUTPUT_QUALITY_VERIFICATION_REPORT.md` | Output quality baseline |
| `docs/03-controls/B5_8B_TOOL_2_MINIMAL_OUTPUT_QUALITY_FIX_REPORT.md` | DD.MM.YYYY fix evidence |
| `docs/03-controls/B6_0_EMPLOYEE_FILE_PRODUCT_DESIGN_BOUNDARY.md` through `B6_7_...md` | B6 design pack |
| `docs/03-controls/B7_0_EMPLOYEE_FILE_IMPLEMENTATION_PREPARATION_BACKLOG_TRANSLATION.md` | This document |

**Instruction for B7.1+:** If exact file names differ from this list, inspect the module tree, record actual paths in the B7.1 gate document, and do not assume paths from legacy `bots/` copies.

---

## 7. Backlog Structure (Epics A–H)

Epics define **preparation scope only**. No epic authorizes implementation in B7.0.

| Epic | Name | B6 source | B7.0 role |
|------|------|-----------|-----------|
| **A** | Preserve existing B5.7 workspace shell | B6.1 §8, B5.7 | Regression anchor; shell must survive all slices until explicitly replaced |
| **B** | Employee profile section preparation | B6.2 | Backlog for profile layout, sections, copy boundaries |
| **C** | Evidence / Nachweise section preparation | B6.3 | Backlog for categories, status wording, disabled/upload-deferred states |
| **D** | Role / Zusatzrolle / SDL / project assignment preparation | B6.4 | Backlog for assignment UI context; no release semantics |
| **E** | Readiness / Ampel display preparation | B6.5 | Backlog for grey default badges; no evaluator |
| **F** | Generator output section preparation | B6.6 | Backlog for output blocks wrapping EC-09; batch generate retained |
| **G** | Acceptance tests and regression checks | B5.7, B5.8, B6.7 §7 | EC-09 smoke template; forbidden wording checks |
| **H** | Carry-forward controls | B6.7 §11 | Track open bugs/deferred items; no silent implementation |

---

## 8. Backlog Table

### Epic A — Preserve existing B5.7 workspace shell

| Field | Detail |
|-------|--------|
| **Backlog ID** | BL-A-001 |
| **Purpose** | Ensure all future slices preserve transitional workspace: notice, summary panel, queue table, batch ZIP flow |
| **Allowed preparation work** | Document shell components; define regression checklist; map B6.1 transitional IA to current routes |
| **Not allowed** | Removing queue table without replacement gate; breaking `/employee-automation` route; mixing Tool 1 patterns |
| **Dependencies** | B5.7 PASS; B6.1 design |
| **Acceptance criteria (future implementation)** | Notice visible; summary panel on row select; queue add/remove works; disclaimers present; no forbidden claims |
| **Risk / control** | Shell regression breaks EC-09 operator path — **EC-09 smoke required** if shell composition changes |

### Epic B — Employee profile section preparation

| Field | Detail |
|-------|--------|
| **Backlog ID** | BL-B-001 |
| **Purpose** | Translate B6.2 ten-section profile design into implementable slice boundaries (master, employment, roles active; others placeholder) |
| **Allowed preparation work** | Section map; copy list; route intent L0–L2 documentation; date display rule (DD.MM.YYYY vs summary panel en-US — CF-06) |
| **Not allowed** | DB persistence; profile-only generate without separate gate; deep data model |
| **Dependencies** | Epic A; B6.2; B5.2 object boundary |
| **Acceptance criteria (future implementation)** | Active sections match B6.2; placeholders labeled **Not implemented**; dates follow agreed rule; no certification claims |
| **Risk / control** | Profile UI may imply completeness — use B6.2 forbidden wording list |

### Epic C — Evidence / Nachweise section preparation

| Field | Detail |
|-------|--------|
| **Backlog ID** | BL-C-001 |
| **Purpose** | Prepare evidence category structure, status vocabulary, and disabled/upload-deferred UI per B6.3 |
| **Allowed preparation work** | Category list E1–E8; status labels; open-items linkage design; generated vs uploaded distinction in copy |
| **Not allowed** | Evidence upload implementation; checklist persistence; auto-accept on generate |
| **Dependencies** | Epic B; B6.3; B5.3 |
| **Acceptance criteria (future implementation)** | Eight categories visible or stubbed; **Requires review** / **Not uploaded** wording; generated docs never shown as **Accepted evidence** |
| **Risk / control** | Highest scope-creep risk — upload/persistence explicitly deferred (CF-08) |

### Epic D — Role / Zusatzrolle / SDL / project assignment preparation

| Field | Detail |
|-------|--------|
| **Backlog ID** | BL-D-001 |
| **Purpose** | Prepare assignment context UI: Grundrolle catalog, Zusatzrollen, SDL types, project preview per B6.4 |
| **Allowed preparation work** | Catalog references; overlay vs doc checkbox rules; assignment copy; disabled picker placeholders |
| **Not allowed** | SDL/project link persistence (CF-10); release/approval semantics; DIN-compliance claims |
| **Dependencies** | Epic B; B6.4; `roles/employee-config.ts` read-only review |
| **Acceptance criteria (future implementation)** | Assignments displayed as context; **Not evaluated** default; no **Released** / **Approved** labels |
| **Risk / control** | Assignment UI mistaken for release decision — B6.4 §8 forbidden list enforced |

### Epic E — Readiness / Ampel display preparation

| Field | Detail |
|-------|--------|
| **Backlog ID** | BL-E-001 |
| **Purpose** | Prepare display-only readiness badges; grey **Not evaluated** / **Not implemented** as sole live default per B6.5 |
| **Allowed preparation work** | Badge copy; placement map; R/Y/G semantics documentation for future (disabled) states |
| **Not allowed** | Readiness evaluator; ampel color activation; ZIP-triggered state changes |
| **Dependencies** | Epic A; B6.5; B5.4 |
| **Acceptance criteria (future implementation)** | Only grey badges live; ZIP success does not change badge; no **Certified** / **Audit-ready** labels |
| **Risk / control** | CF-09 — algorithm deferred to B7+ separate gate |

### Epic F — Generator output section preparation

| Field | Detail |
|-------|--------|
| **Backlog ID** | BL-F-001 |
| **Purpose** | Prepare output blocks A–F wrapping existing EC-09 batch generate; profile-only generate remains design-only |
| **Allowed preparation work** | Output block spec; **Prepared** / **Generated — requires review** copy; batch vs profile generate boundary doc |
| **Not allowed** | Generator refactor; template changes; Hetzner changes; output history store (CF-07); client-only DOCX bypass |
| **Dependencies** | Epic A; B6.6; EC-09 path |
| **Acceptance criteria (future implementation)** | Batch ZIP works; output labeled draft; EC-09 smoke PASS; DD.MM.YYYY dates intact |
| **Risk / control** | **Mandatory EC-09 regression** on any slice touching Epic F |

### Epic G — Acceptance tests and regression checks

| Field | Detail |
|-------|--------|
| **Backlog ID** | BL-G-001 |
| **Purpose** | Define repeatable acceptance and EC-09 smoke checklist for all future implementation slices |
| **Allowed preparation work** | Test case templates; forbidden wording scan list; manual smoke steps from B5.7/B5.8 method |
| **Not allowed** | Fake ZIP evidence; mocked Hetzner in gate sign-off; automated readiness metrics |
| **Dependencies** | B5.7 EC-09 method; B5.8b date verification |
| **Acceptance criteria (future implementation)** | Checklist exists per slice before code gate opens |
| **Risk / control** | Skipping EC-09 smoke — **blocker** for any generator-touching slice |

### Epic H — Carry-forward controls

| Field | Detail |
|-------|--------|
| **Backlog ID** | BL-H-001 |
| **Purpose** | Track open items from B6.7 §11 without implementing them in profile/evidence slices |
| **Allowed preparation work** | Link carry-forwards to future dedicated gates (template, generator, persistence) |
| **Not allowed** | Silent fixes to footer/`{EndDate}`/templates during UI slices |
| **Dependencies** | B6.7 §11; B5.8 findings |
| **Acceptance criteria (future implementation)** | Carry-forward ID referenced in slice plan; no scope bleed |
| **Risk / control** | Template bugs (CF-01, CF-02) must not be "fixed opportunistically" during UI work |

---

## 9. EC-09 Regression Checklist Template

Use this checklist for **every future slice** that touches Epic A, F, or the generator path:

| # | Check | Pass criterion |
|---|-------|----------------|
| R-01 | Queue persistence | Add employee → reload → row still in queue (`employee-queue-storage`) |
| R-02 | Template selection | Role/templates load via `/api/templates` (real Hetzner) |
| R-03 | Generation invoke | `generateEmployeeDocs` completes without error |
| R-04 | ZIP download | ZIP file downloads and opens; contains expected DOCX set |
| R-05 | Date format | Generated dates are **DD.MM.YYYY** (B5.8b) |
| R-06 | Readiness isolation | ZIP success does **not** change readiness/Ampel badge |
| R-07 | Output labeling | UI shows **Prepared** / **Requires review** — not **Accepted** / **Approved** |
| R-08 | No bypass | No client-only DOCX generation path introduced |
| R-09 | Shell intact | Workspace notice and summary panel still functional (if slice touches shell) |
| R-10 | Forbidden wording | No **Approved**, **Released**, **Certified**, **DIN-compliant**, **Audit-ready**, **Certification-ready** in UI |

---

## 10. Required Acceptance Criteria for Future Implementation

All future implementation gates **must** satisfy:

| AC | Criterion |
|----|-----------|
| **AC-FUT-01** | Existing employee generator queue remains usable (add, select, remove, reload persistence). |
| **AC-FUT-02** | Existing ZIP generation still works (real Hetzner, real ZIP — EC-09 smoke). |
| **AC-FUT-03** | Existing DD.MM.YYYY generated date fix remains intact (B5.8b). |
| **AC-FUT-04** | No generated package becomes accepted evidence automatically. |
| **AC-FUT-05** | No readiness/Ampel changes from ZIP success. |
| **AC-FUT-06** | No forbidden wording: **Approved**, **Accepted evidence**, **Certified**, **DIN-compliant**, **Audit-ready**, **Certification-ready**, **Released**. |
| **AC-FUT-07** | Grey **Not evaluated** / **Not implemented** remains the only allowed live readiness default unless separately authorized. |
| **AC-FUT-08** | Profile, evidence, assignment, output, and history sections may be prepared only within B6 boundaries. |
| **AC-FUT-09** | No DB/persistence changes unless separately gated. |
| **AC-FUT-10** | Slice maps to backlog ID and explicit gate authorization with file allow list. |

---

## 11. Carry-Forwards from B6.7

These items **must appear in the backlog** but are **not authorized for implementation** in B7.0 or implied UI slices:

| ID | Item | Source | B7.0 disposition |
|----|------|--------|------------------|
| **CF-01** | Footer/global metadata placeholders not rendered when templates omit tokens (T2-BUG-09b) | B5.8a/b, B6.6 §11 | Epic H — separate template gate required |
| **CF-02** | `{EndDate}` in training templates — not mapped in generator | B5.8b | Epic H — separate generator/template gate |
| **CF-03** | T2-BUG-10 duplicate content — watch, not reproduced | B5.8a | Epic H — monitor during EC-09 smoke |
| **CF-04** | Template standardization / placeholder audit | B5.8, B6.3 | Epic H — deferred |
| **CF-05** | `logoFile` session-only persistence | B4.2 | Epic H — deferred persistence gate |
| **CF-06** | Summary panel en-US date display vs DD.MM.YYYY profile design rule | B6.2 §6.2 | Epic B — resolve in profile slice planning |
| **CF-07** | Output history store | B6.6 §13 | Epic F — **design-only** unless separately gated |
| **CF-08** | Evidence upload and checklist persistence | B6.3 | Epic C — **deferred** unless separately gated |
| **CF-09** | Readiness evaluator and ampel colors (post-grey) | B6.5 | Epic E — **deferred** to B7+ separate gate |
| **CF-10** | SDL/project link persistence | B6.4 | Epic D — **deferred** unless separately gated |

**Explicit deferrals restated:**

- **Profile-level generate** remains design-only unless separately gated (B6.6, B6.7 G-13).
- **Output history** remains design-only unless separately gated (CF-07).
- **Evidence UI / upload implementation** deferred unless separately gated (CF-08).

---

## 12. Proposed Implementation Slice Sequence (Names TBD — Planning Only)

Ordered **candidate** gates for post–B7.0 planning. **Not authorized until explicit gate prompt per slice.**

| Order | Proposed gate ID | Epic | Scope sketch | EC-09 smoke |
|-------|------------------|------|--------------|-------------|
| 1 | **B7.1** | G, A | File-level execution planning; inspect actual files; propose minimal first code slice | No (read-only) |
| 2 | B7.2 (TBD) | A | Shell preservation verification / minor layout prep | If shell touches generator wiring |
| 3 | B7.3 (TBD) | B | Profile section placeholders and active sections | If date/copy touches generator display |
| 4 | B7.4 (TBD) | E | Readiness badge display (grey only) | Required |
| 5 | B7.5 (TBD) | F | Generator output section UI wrap | **Required** |
| 6 | B7.6 (TBD) | C | Evidence section stubs (no upload) | If linked to output labels |
| 7 | B7.7 (TBD) | D | Assignment section stubs (no persistence) | If linked to role config |
| 8 | B7.8+ (TBD) | H | Dedicated carry-forward gates (template, `{EndDate}`, etc.) | **Required** per generator change |

Gate IDs and ordering **may be refined in B7.1** after file inspection. No slice may skip Epic G acceptance definition.

---

## 13. Explicitly Not Authorized in B7.0

| # | Not authorized |
|---|----------------|
| N-1 | **No code implementation** |
| N-2 | **No feature build** |
| N-3 | Evidence upload implementation |
| N-4 | Readiness algorithm |
| N-5 | Ampel algorithm (beyond documenting grey default) |
| N-6 | DB schema |
| N-7 | Persistence migration |
| N-8 | Generator refactor |
| N-9 | Template refactor |
| N-10 | Hetzner/storage refactor |
| N-11 | Tool 1 changes |
| N-12 | Customer portal |
| N-13 | Project file (*Projektakte*) or company file (*Unternehmensakte*) implementation |
| N-14 | CEKS or bot-pack expansion |
| N-15 | KPI targets / Ziel-Etablierung |
| N-16 | Fake evidence, templates, ZIPs, or invented readiness metrics |
| N-17 | Modifying unrelated working tree (hq/, bots/, prior reports) |
| N-18 | Touching `.env.local` or secrets |

*(Aligned with B6.7 §6; B7.0 adds explicit no-code restatement.)*

---

## 14. Proposed Next Slice: B7.1

### **B7.1 — Employee File Workspace Implementation Slice Planning / File-Level Execution Gate**

**May (when explicitly prompted):**

- Inspect all files listed in §6 and record actual paths, exports, and wiring.
- Propose a **minimal** first implementation slice with file allow list and diff scope estimate.
- Refine ordered gate sequence from §12 based on inspection findings.
- Draft slice-specific acceptance criteria using §9–§10 templates.

**Must not (without subsequent code gate):**

- Modify application code, generator, templates, Hetzner logic, or package files.
- Begin Epic B–F implementation.

**B7.1 entry criterion:** B7.0 document committed; user prompt **"Start B7.1"** (or equivalent explicit authorization).

---

## 15. B7.0 Controls (Inherited from B6.7 §8)

| Control ID | Requirement | B7.0 compliance |
|------------|-------------|-----------------|
| **C-B7-01** | Inspect before modify | §6 inspection plan defined |
| **C-B7-02** | Inspection list mandatory | §6 complete with actual paths |
| **C-B7-03** | No implementation in B7.0 | §13; docs only |
| **C-B7-04** | Separate docs from code | This commit is docs-only |
| **C-B7-05** | Acceptance tests before implementation | §9, §10 defined |
| **C-B7-06** | Preserve B5.7 shell | Epic A, AC-FUT-01 |
| **C-B7-07** | Carry-forwards explicit | §11 |
| **C-B7-08** | No secrets | No `.env.local` touch |
| **C-B7-09** | Scope wall | hq/, bots/, Tool 1 untouched |

---

## 16. Completion Criteria for B7.0

| AC | Criterion | Met |
|----|-----------|-----|
| AC-1 | Markdown document exists at `docs/03-controls/B7_0_EMPLOYEE_FILE_IMPLEMENTATION_PREPARATION_BACKLOG_TRANSLATION.md` | **Yes** |
| AC-2 | Contains backlog epics A–H | **Yes** — §7–§8 |
| AC-3 | Contains file inspection plan | **Yes** — §6 |
| AC-4 | Contains acceptance criteria and EC-09 regression checklist | **Yes** — §9–§10 |
| AC-5 | Contains forbidden scope and carry-forwards | **Yes** — §11, §13 |
| AC-6 | Authorizes no code changes | **Yes** — §1, §13 |
| AC-7 | Protects EC-09 | **Yes** — §5 P-04, §9 |
| AC-8 | Leaves unrelated working tree untouched | **Yes** — docs-only gate |
| AC-9 | Provides clear next-step recommendation | **Yes** — §14 B7.1 |

**B7.0 gate:** **CLOSED** upon commit — authorizes **B7.1 planning only**, not implementation.

---

## 17. Commit

```
docs: translate employee file design into implementation preparation backlog (B7.0)
```

---

## 18. Document History

| Version | Date | Event |
|---------|------|-------|
| 1.0 | 2026-06-05 | B7.0 backlog translation — READY FOR LIMITED IMPLEMENTATION PLANNING — NOT IMPLEMENTATION |
