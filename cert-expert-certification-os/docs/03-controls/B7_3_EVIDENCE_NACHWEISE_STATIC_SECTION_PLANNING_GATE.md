# B7.3 — Evidence / Nachweise Static Section Planning Gate

**Gate:** B7.3 — Evidence section static implementation planning only  
**Status:** **READY FOR B7.4 LIMITED EVIDENCE SECTION STATIC IMPLEMENTATION WITH CONTROLS**  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**Prerequisite:** B7.2a EC-09 SMOKE PASS — READY FOR B7.3 PLANNING (`7bdcb7b`)  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Primary route:** `/employee-automation`

---

## 1. Title and Gate Status

### **READY FOR B7.4 LIMITED EVIDENCE SECTION STATIC IMPLEMENTATION WITH CONTROLS**

B7.3 plans the **next smallest safe implementation slice** after B7.2/B7.2a: a **static, read-only Evidence / Nachweise section** inside the existing `EmployeeProfileSectionShell`. This gate **authorizes planning only**. It **does not authorize** code changes, uploads, persistence, acceptance logic, or readiness algorithms.

**Next slice (when explicitly prompted):** **B7.4 — Evidence/Nachweise Static Section Enhancement**

---

## 2. Purpose

B7.3 answers: *How do we move from the B7.2 generic “Not implemented” evidence placeholder to a structured, operator-readable evidence **requirement overview** without breaking EC-09 or implying shipped upload/acceptance functionality?*

This document:

1. Confirms the **verified baseline** after B7.2a manual EC-09 smoke.
2. Defines **one** minimal B7.4 slice — static evidence placeholders only.
3. Maps planned categories to B6.3 design intent (display layer, not data model).
4. Sets **allowed / forbidden** scope, file allow lists, acceptance criteria, and validation steps for B7.4.
5. Protects EC-09 and forbids upload, persistence, acceptance, and readiness computation.

B7.3 is a **planning gate document** — not an implementation slice.

---

## 3. Source Artefacts

| Artefact | Commit / ref | Role in B7.3 |
|----------|--------------|--------------|
| **B6.3** Evidence / Nachweise section design | `6a34d73` | Category model E1–E8; status vocabulary; generated ≠ accepted; no upload in design |
| **B6.7** Design closure gate | `e448d4e` | Carry-forwards; EC-09 protection; evidence UI deferred |
| **B7.0** Backlog translation | `ef8af2d` | Epic C — Evidence preparation; CF-08 upload deferred |
| **B7.1** File-level gate | `5637730` | Slice sequencing; Option 1 shell before evidence enhancement |
| **B7.2** Profile shell implementation report | `983de00` | `EmployeeProfileSectionShell.tsx`; evidence = `PlaceholderPanel` today |
| **B7.2a** Manual EC-09 ZIP smoke | `7bdcb7b` | EC-09 PASS; ZIP 119 837 bytes; DD.MM.YYYY; readiness unchanged |

**Functional anchor (not re-opened):** B5.3 evidence and required-fields boundary.

---

## 4. Current Verified Baseline

Verified in B7.2a (2026-06-05):

| Area | State |
|------|--------|
| **B7.2 shell** | Mounted when employee focused/selected (`focusEmployee && templatesLoaded`) |
| **EC-09 smoke** | **PASS** — UI generate → Hetzner → ZIP download |
| **ZIP artifact** | `employee-documents-1780695479363.zip`, **119 837 bytes**, 4 DOCX |
| **DOCX dates** | **DD.MM.YYYY** (e.g. `15.01.1990`, `01.06.2024`) |
| **Readiness** | Grey **Not evaluated** before and after ZIP |
| **B5.7 shell** | Notice, summary, form, sidebar, generate strip, queue — intact |
| **Generator / templates / storage** | **Unchanged** since B5.8b |
| **Build** | `npm run build` **PASS** |
| **Evidence section today** | `case "evidence":` → `<PlaceholderPanel title="Nachweise / Evidence" />` |

**Runtime path:** `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeProfileSectionShell.tsx` (section id `evidence`).

---

## 5. B7.4 Candidate Slice

### **B7.4 — Evidence/Nachweise Static Section Enhancement**

**Backlog mapping:** BL-C-001 (Epic C — Evidence / Nachweise section preparation)

**Scope summary:** Replace the B7.2 generic evidence placeholder with a **read-only evidence requirement overview** — category groups, example requirement rows, and static status chips. **No** upload, **no** persistence, **no** acceptance, **no** readiness impact.

**Why this slice next:**

| Criterion | Rationale |
|-----------|-----------|
| Smallest safe step | Single-file change (`EmployeeProfileSectionShell.tsx`) |
| EC-09 isolation | Display-only; no generator/queue/storage touch |
| B6.3 alignment | Implements planned **structure** without B6.3 forbidden build |
| Reversible | Remove static rows → revert to B7.2 placeholder |

**What B7.4 does not do:** Upload UI, file storage, evidence validation, readiness evaluator, ampel colors, profile generate, output history, DB schema.

---

## 6. Allowed B7.4 Scope

| # | Allowed |
|---|---------|
| A-1 | Modify **`EmployeeProfileSectionShell.tsx`** only (primary) |
| A-2 | Replace `evidence` case content with static **evidence requirement overview** |
| A-3 | Use **existing visible employee context** only: `employee.fullName`, `roleId`, `appointmentIds`, `guardIDNumber`, `selectedRoleDocIds`, `selectedAppointmentDocIds`, resolved role/overlay names from props |
| A-4 | Show **evidence categories** as collapsible or grouped placeholder sections |
| A-5 | Show **per-row static status** using allowed vocabulary only (§10) |
| A-6 | Display disclaimer: evidence **not auto-accepted**; review required before any future readiness use |
| A-7 | Cross-reference **generated documents** as **Prepared / Requires review** — link text to Generator Output section conceptually (no navigation refactor required) |
| A-8 | Keep section-level badge: grey **Not implemented** or **Not evaluated** for section readiness |
| A-9 | Keep all rows **read-only** — no inputs, buttons that mutate state, or file pickers |

---

## 7. Suggested Static Evidence Categories (B7.4 Placeholders)

**Important:** These are **display placeholders** for operator orientation — **not** a final data model, **not** a DIN decision matrix, **not** persisted records.

| # | Category (DE / EN) | B6.3 map (informative) | B7.4 default row status | Data source (read-only hint) |
|---|-------------------|------------------------|-------------------------|------------------------------|
| 1 | Identität / Stammdaten — Identity / personal master data | E1 | **Not provided** | `fullName`, `birthday` from queue (field present ≠ proof) |
| 2 | Beschäftigung / Vertrag — Employment / contract-related | E2 | **Open** | `startDate`, employment context — no contract upload |
| 3 | Bewacherregister — Register evidence | E1/E3 overlap | **Not provided** | `guardIDNumber` if set — **Requires review** label optional hint only |
| 4 | §34a / Sachkunde — Qualification evidence | E4 | **Not evaluated** | Role context from `roleId` — no certificate upload |
| 5 | Datenschutz / Vertraulichkeit — Data protection / confidentiality | E3 | **Open** | Template type exists in generator — generated ≠ accepted |
| 6 | Erste Hilfe / Zusatzqualifikation — First aid / additional qualification | E4 | **Not implemented** | Placeholder row only |
| 7 | Schulung / Unterweisung — Training / instruction evidence | E5 | **Open** | Overlay/training docs selected in form — **Requires review** if doc count > 0 |
| 8 | Rolle / Zusatzrolle — Role / overlay evidence | E6 | **Requires review** | `roleId`, `appointmentIds`, selected doc counts |
| 9 | SDL / projektspezifisch — SDL / project-specific evidence | E7 | **Not implemented** | No SDL/project IDs in schema — placeholder only |
| 10 | Erzeugte Mitarbeiterakte-Dokumente — Generated employee file documents | E8 | **Prepared** / **Requires review** | `selectedRoleDocIds.length` + `selectedAppointmentDocIds.length` — **not** accepted evidence |

**Section header copy (allowed):**

- “Evidence requirement overview (static — B7.4). Upload and acceptance not implemented.”
- “Generated documents require review before any evidence status change.”

---

## 8. Explicitly Forbidden in B7.4

| # | Forbidden |
|---|-----------|
| F-1 | Upload component |
| F-2 | File picker |
| F-3 | Drag and drop |
| F-4 | Storage integration (localStorage evidence keys, IndexedDB, files) |
| F-5 | DB or persistence migration |
| F-6 | Evidence acceptance / auto-accept on generate |
| F-7 | Readiness calculation |
| F-8 | Ampel algorithm or R/Y/G activation |
| F-9 | Release decision semantics |
| F-10 | Audit / certification / DIN-compliance claims |
| F-11 | Generator changes (`generateEmployeeDocs`, actions, date utils for output) |
| F-12 | Template changes |
| F-13 | Hetzner / storage changes |
| F-14 | Tool 1 changes |
| F-15 | Project file (*Projektakte*) / company file (*Unternehmensakte*) |
| F-16 | CEKS or bot expansion |
| F-17 | KPI targets |
| F-18 | Modifications to `EmployeeAutomationPage.tsx` unless mounting bug fix — **stop and report first** |
| F-19 | New npm dependencies / package file changes |

---

## 9. EC-09 Protection

The following chain **must remain unchanged** through B7.4:

```
EmployeeForm
  → employee-queue-storage (cert-expert-tool2-employee-queue-v1)
  → doc chip selection (selectedRoleDocIds / selectedAppointmentDocIds)
  → generateEmployeeDocs (server action)
  → template-storage / Hetzner Object Storage
  → JSZip → zipBase64 → client ZIP download
```

| Rule | B7.4 impact |
|------|-------------|
| No generator file diffs | **Required** |
| ZIP success ≠ evidence status change | Evidence rows must remain static placeholders — no post-generate state hooks |
| ZIP success ≠ readiness change | **Not evaluated** only |
| Generated DOCX ≠ accepted Nachweis | E8 rows must say **Prepared** / **Requires review** only |

**B7.4 EC-09 validation:** Zero generator diff expected. Minimum check: **Generate & Download ZIP** button still works; visual smoke on `/employee-automation`. Full ZIP smoke (per B7.2a method) if any non-shell file touched — **not expected** for B7.4 allow list.

---

## 10. Forbidden and Allowed Wording

### Forbidden in B7.4 implementation (must not appear as claims)

- Approved  
- Accepted evidence  
- Certified  
- DIN-compliant  
- Audit-ready  
- Certification-ready  
- Released  

### Allowed status / copy

- Prepared  
- Generated  
- Requires review  
- Not generated  
- Not selected  
- Open  
- Not implemented  
- Not evaluated  
- Not provided  
- Provided by customer — review required  

**Pre-existing negation disclaimers** (B5.7/B7.2 lineage) may remain elsewhere on the page — do not add new forbidden terms in the evidence section.

---

## 11. File-Level Plan for B7.4

### 11.1 Expected to modify

| File | Change type |
|------|-------------|
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeProfileSectionShell.tsx` | Replace `evidence` case: static category overview component (inline or local helper in same file) |

**Prefer:** Keep all B7.4 evidence UI in the same file to minimize scope (no new module folder until separately gated).

### 11.2 Read-only protected

| File | Reason |
|------|--------|
| `EmployeeAutomationPage.tsx` | Mounting unchanged |
| `EmployeeFileSummaryPanel.tsx` | Summary badges unchanged |
| `EmployeeForm.tsx` | EC-09 upstream |
| `employee-queue-storage.ts` | Queue contract |
| `EmployeeTable.tsx` | Queue interaction |
| `generate-employee-docs.ts`, `app/actions/generate-employee-docs.ts` | EC-09 |
| `lib/template-storage.ts`, `app/api/templates/route.ts` | Hetzner path |
| `employee-file/types/employee.ts` | No schema expansion |

### 11.3 Explicitly forbidden

| Path | Rule |
|------|------|
| `employee-generator/**` | C-09 |
| `app/api/**` (except read-only inspection) | No API changes |
| `evidence/` module stub | Do not implement upload module |
| `readiness-rules/` | No algorithm |
| `package.json`, lockfiles | No deps |
| `.env.local` | No secrets |
| `hq/`, `bots/`, Tool 1 | Scope wall |
| Unrelated control reports | Do not modify |

### 11.4 Rollback

Revert B7.4 commit → evidence section returns to B7.2 `PlaceholderPanel`.

---

## 12. B7.4 Acceptance Criteria

| AC | Criterion | Verification |
|----|-----------|--------------|
| **AC-01** | Evidence section renders inside existing B7.2 shell | Select queue row → Nachweise section shows category overview |
| **AC-02** | Existing B5.7 shell remains intact | Notice, summary, form, sidebar, generate strip, queue visible |
| **AC-03** | Existing form remains usable | Add/edit employee still works |
| **AC-04** | Queue row selection still works | Summary + shell on select |
| **AC-05** | ZIP generation still works | UI generate or B7.2a-equivalent smoke |
| **AC-06** | Evidence entries are read-only placeholders only | No inputs/file pickers on evidence rows |
| **AC-07** | No upload/storage/persistence introduced | Diff + manual inspect; no new storage keys |
| **AC-08** | No evidence is accepted automatically | No “Accepted” status; E8 = Requires review |
| **AC-09** | Readiness remains grey / **Not evaluated** only | Summary + Review section unchanged |
| **AC-10** | ZIP success does not change evidence/readiness status | Generate before/after row status identical |
| **AC-11** | No forbidden wording in changed files | Grep on `EmployeeProfileSectionShell.tsx` |
| **AC-12** | `npm run build` passes | Build from `apps/certification-os/` |
| **AC-13** | Only authorized file(s) changed | `git diff --stat` |
| **AC-14** | Unrelated working tree untouched | `git status` |

---

## 13. Required B7.4 Validation (Future Gate)

When **Start B7.4** is authorized:

1. **Before:** `git status`; confirm branch `b3-tool2-migration`; record unrelated changes untouched.
2. **Implement:** Only `EmployeeProfileSectionShell.tsx` (per §11).
3. **Forbidden wording grep** on changed file(s).
4. **`npm run build`**
5. **Visual smoke:** `http://localhost:3001/employee-automation` — select employee → Nachweise section → verify categories and statuses.
6. **EC-09 check:** Generator button availability + one ZIP generate (recommended repeat of B7.2a minimal path); document zero generator diff rationale if only shell changed.
7. **Report:** `docs/03-controls/B7_4_EVIDENCE_NACHWEISE_STATIC_SECTION_IMPLEMENTATION_REPORT.md`
8. **Commit:** Only authorized files + report; message: `feat: add static evidence section overview (B7.4)`

---

## 14. Carry-Forwards (Unchanged by B7.3/B7.4 Plan)

| ID | Item | B7.4 disposition |
|----|------|----------------|
| CF-01 | Footer metadata gaps | Not in B7.4 |
| CF-02 | `{EndDate}` unmapped | Not in B7.4 |
| CF-03 | T2-BUG-10 watch | Monitor at ZIP smoke |
| CF-04 | Template standardization | Not in B7.4 |
| CF-08 | Evidence upload implementation | **Still deferred** after B7.4 |
| CF-09 | Readiness/Ampel algorithm | **Still deferred** |
| CF-10 | SDL/project persistence | Placeholder rows only in B7.4 |

---

## 15. Gate Decision

### **READY FOR B7.4 LIMITED EVIDENCE SECTION STATIC IMPLEMENTATION WITH CONTROLS**

**Blockers:** None. B7.2a EC-09 smoke PASS. B7.2 shell stable. Evidence placeholder ready for static enhancement.

**B7.3 authorizes:** B7.4 planning consumption only — **no code** until explicit **Start B7.4** prompt.

---

## 16. B7.3 Completion Criteria

| AC | Criterion | Met |
|----|-----------|-----|
| AC-1 | B7.3 markdown document exists | **Yes** |
| AC-2 | Plans exactly one small B7.4 slice | **Yes** — §5 |
| AC-3 | Authorizes no code in B7.3 | **Yes** |
| AC-4 | Limits B7.4 to static read-only placeholders | **Yes** — §6–§7 |
| AC-5 | Forbids upload/persistence/acceptance/readiness | **Yes** — §8 |
| AC-6 | Protects EC-09 | **Yes** — §9 |
| AC-7 | File allow/protect/forbid lists | **Yes** — §11 |
| AC-8 | B7.4 acceptance criteria defined | **Yes** — §12 |
| AC-9 | Unrelated working tree untouched | **Yes** — docs only |

**B7.3 gate:** **CLOSED** upon commit.

---

## 17. Commit

```
docs: plan evidence section static implementation gate (B7.3)
```

---

## 18. Document History

| Version | Date | Event |
|---------|------|-------|
| 1.0 | 2026-06-05 | B7.3 evidence static section planning — READY FOR B7.4 WITH CONTROLS |
