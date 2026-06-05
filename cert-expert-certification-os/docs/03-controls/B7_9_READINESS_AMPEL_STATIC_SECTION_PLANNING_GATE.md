# B7.9 — Readiness / Ampel Static Section Planning Gate

**Gate:** B7.9 — Readiness / Ampel static implementation planning only  
**Status:** **READY FOR B7.10 LIMITED READINESS / AMPEL STATIC IMPLEMENTATION WITH CONTROLS**  
**Date:** 2026-06-06  
**Branch:** `b3-tool2-migration`  
**Prerequisite:** B7.8 PASS (`1371a50`); B7.8a EC-09 smoke PASS — READY FOR B7.9 PLANNING (`4cf752d`)  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Primary route:** `/employee-automation`

---

## 1. Gate Decision

### **READY FOR B7.10 LIMITED READINESS / AMPEL STATIC IMPLEMENTATION WITH CONTROLS**

B7.9 plans the **next smallest safe implementation slice** after B7.8: static, read-only **Readiness / Ampel display** overview inside the existing B7.2 profile shell. This gate **authorizes planning only**. It **does not authorize** code changes, readiness algorithms, Ampel calculation, scoring, persistence, evidence acceptance, Freigabe logic, or certification claims.

**Next slice (when explicitly prompted):** **B7.10 — Readiness / Ampel Static Section Enhancement**

---

## 2. Purpose

B7.9 defines how to extend the transitional profile shell with **readiness display boundaries** aligned to B6.5 and Cert-Expert Tool-2 employee-file design — without creating a real Ampel algorithm, scoring system, or Freigabe decision engine.

This document:

1. Confirms the **verified baseline** after B7.8a.
2. Scopes **B7.10** to static readiness placeholders in `EmployeeProfileSectionShell.tsx` only.
3. Lists readiness display domains, allowed/forbidden wording, visual rules, and EC-09 rules.
4. Defines B7.10 acceptance criteria, validation steps, and implementation report structure.
5. States **stop conditions** after B7.10.

B7.9 is a **planning gate document** — not an implementation slice.

---

## 3. Source Artefacts

| Artefact | Commit / ref | Role in B7.9 |
|----------|--------------|--------------|
| **B5.3–B5.5** | B5.7 lineage | ZIP ≠ release; prepared output ≠ proof |
| **B6.5** | Design refs | Display-only review/readiness; no post-ZIP mutation |
| **B6.7** | Design closure | Readiness/Ampel algorithm deferred |
| **B7.2** Profile shell | `983de00` | Ten sections; `review` read-only stub |
| **B7.4** Evidence static | `b93f6bb` | Cross-section pattern; evidence ≠ readiness |
| **B7.6** Role/SDL static | `a9128d4` | Domain rows + grey badges |
| **B7.8** Generator output static | `1371a50` | Output ≠ readiness |
| **B7.8a** EC-09 smoke | `4cf752d` | Generator baseline unchanged post–B7.8 |

**Functional anchor (not re-opened):** Readiness is a **static display boundary only** in B7.10; B6.5 forbids live Ampel activation in this transitional shell.

---

## 4. Current Verified Baseline

| Area | State (post–B7.8a) |
|------|---------------------|
| **B7.2 shell** | Ten sections; mounted on `focusEmployee && templatesLoaded` |
| **B7.4 evidence** | `EvidenceStaticOverview` — 10 read-only rows |
| **B7.6 roles / sdl-project** | Assignment static overviews — 6 + 4 rows |
| **B7.8 output** | `GeneratorOutputStaticOverview` — 10 read-only rows |
| **`review` section today** | Minimal stub: grey badges **Readiness: not evaluated**, **Review: open** + B6.5 disclaimer — **primary B7.10 replacement/enhancement target** |
| **Nav label** | `Review / Prüfstatus` (section id: `review`) — content becomes readiness/Ampel **display** overview; nav label may remain unless explicitly changed in B7.10 prompt |
| **EC-09** | PASS (B7.8a); generator/queue/storage untouched |
| **Live readiness** | Grey **Not evaluated** only across all static sections |
| **Build** | `npm run build` PASS (B7.8a) |
| **ZIP baseline** | `employee-documents-1780697200225.zip` — 119 837 bytes; 4 DOCX |

**Runtime data available (read-only hints only — must not drive scoring):**

- Queue employee fields, role name, overlay names, doc selection counts
- **No** readiness score, Ampel state vector, review decision ID, or Freigabe flag in `Employee` schema
- **No** server-side readiness engine in this slice

---

## 5. B7.10 Candidate Slice — Scope

### **B7.10 — Readiness / Ampel Static Section Enhancement**

**Objective:** Replace or enhance the current **Review / Prüfstatus** readiness stub with a **static, read-only readiness / Ampel display overview** — visual/informational boundary only.

**Planned section target:**

| Shell section ID | B7.10 action |
|------------------|--------------|
| `review` | **Replace/enhance** stub with `ReadinessAmpelStaticOverview` (or equivalent inline component) — 6 readiness display domain rows + grey-only Ampel boundary banner |

**Implementation pattern (mirror B7.4 / B7.6 / B7.8):**

- Add `ReadinessAmpelStaticOverview` **inline in the same file** (reuse `AssignmentCategoryList` / `CategoryRow` if appropriate).
- Optional cross-reference hints from existing props (employee name, role, doc counts) — **must not** compute scores or color states from them.
- **No** new React state for readiness, Ampel color, or post-ZIP updates.
- **No** callbacks to queue storage, generator, or review workflow.

**Explicit B7.10 non-goals:**

- Readiness algorithm, Ampel calculation, scoring, weighting
- Red / yellow / green live traffic-light states
- Persistence, DB, readiness history
- Evidence acceptance, assignment saving, Freigabe decision
- DIN decision matrix, audit-readiness, certification-readiness claims
- Generator, template, JSZip, Hetzner/Object Storage, Tool 1 changes
- Modifications to B7.4, B7.6, B7.8 section content (must remain intact)

---

## 6. Authorized File(s) for B7.10

| File | Allowed change |
|------|----------------|
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeProfileSectionShell.tsx` | **Only** authorized code file |

**New report (B7.10 gate):**

| File | Purpose |
|------|---------|
| `docs/03-controls/B7_10_READINESS_AMPEL_STATIC_SECTION_IMPLEMENTATION_REPORT.md` | Implementation evidence |

**Optional follow-on (not part of B7.10 — separate gate):**

| Gate | Purpose |
|------|---------|
| **B7.10a** | EC-09 smoke verification after B7.10 (recommended per B7.6a / B7.8a pattern) |

---

## 7. Forbidden Implementation Areas (B7.10)

| # | Forbidden |
|---|-----------|
| F-1 | Readiness algorithm, Ampel calculation, scoring, weighting |
| F-2 | Red / yellow / green live status colors or traffic-light UI |
| F-3 | Readiness score display, compliance score, pass/fail evaluation |
| F-4 | Persistence, DB, readiness history, review decision storage |
| F-5 | Evidence acceptance workflow |
| F-6 | Assignment saving, Freigabeentscheidung, release automation |
| F-7 | DIN decision matrix or compliance evaluation |
| F-8 | `generateEmployeeDocs`, template-storage, Hetzner, JSZip, API routes |
| F-9 | `EmployeeAutomationPage.tsx`, `EmployeeForm.tsx`, `employee-queue-storage.ts` (unless mounting bug — **stop and report**) |
| F-10 | Changes to B7.4 `EvidenceStaticOverview` behavior |
| F-11 | Changes to B7.6 role/SDL overview behavior |
| F-12 | Changes to B7.8 `GeneratorOutputStaticOverview` behavior |
| F-13 | Tool 1, `hq/`, `bots/`, unrelated reports |
| F-14 | Package files, `.env.local` |
| F-15 | Audit-ready / certification-ready / fully compliant claims |

---

## 8. Static Readiness / Ampel Display Domains (B7.10 Placeholders)

**Not a readiness engine. Not an Ampel algorithm. Not a scoring model.**

| # | Domain (DE / EN) | Default status (planned) | Hint source (display only) |
|---|------------------|--------------------------|----------------------------|
| 1 | Mitarbeiterakte / Employee file | **Not evaluated** | Queue employee present — no file completeness engine |
| 2 | Nachweise / Evidence | **Not evaluated** | Cross-ref B7.4 static overview — no automatic evaluation |
| 3 | Rollenbezug / Role assignment | **Not evaluated** | Cross-ref B7.6 — assignment ≠ readiness |
| 4 | SDL / Projektzuordnung | **Not evaluated** | Cross-ref B7.6 SDL rows — no SDL readiness engine |
| 5 | Generierte Dokumente / Generated documents | **Not evaluated** | Cross-ref B7.8 — prepared output ≠ readiness |
| 6 | Fachliche Prüfung / Manual review | **Manual review required** | Static — all domains require human review (future gates) |

**Required explanatory notes (readiness section):**

- Readiness display is **static placeholder only** — no automatic evaluation.
- **Grey / Not evaluated** is the only live readiness state in B7.10.
- No Ampel calculation, scoring, or Freigabe decision in this slice.
- ZIP success does **not** change readiness, evidence, assignment, or generated-output status.
- Prepared generator output does **not** imply readiness.
- This overview is **not** audit-readiness, certification-readiness, or a DIN decision matrix.

**Visual rules (B7.10):**

- Use existing `greyBadge` pattern only — **no** red, yellow, or green badges for live readiness.
- Optional muted “Ampel boundary (display only)” label permitted — must not imply active traffic-light evaluation.
- Section-level badges: **Static placeholder**, **Readiness: not evaluated**, **No automatic evaluation**.

---

## 9. Allowed Status Wording (B7.10)

**Live status values (domain rows and section badges):**

- Not evaluated  
- Not implemented  
- Static placeholder  
- Review required  
- No automatic evaluation  
- No readiness decision  
- Manual review required  

**Conservative display phrases (recommended in banners):**

- “Static readiness display boundary only”  
- “Grey display only — no live Ampel”  
- “No readiness algorithm in this slice”  
- “No scoring in this slice”  
- “ZIP generation does not change readiness status”  

**Note:** “Review: open” from the current stub may be retained only if it remains a **static placeholder** — not a computed review outcome. Prefer aligning to allowed list above.

---

## 10. Forbidden Wording (B7.10)

Must **not** appear as claims in B7.10 changed files:

- Approved  
- Released  
- Certified  
- DIN-compliant  
- Audit-ready  
- Certification-ready  
- Fully compliant  
- Freigegeben  
- Einsatzfreigabe erteilt  
- Automatisch freigegeben  
- Automatically accepted  
- Automatically released  
- Passed  
- Failed  
- Green  
- Yellow  
- Red  
- Score  
- Scoring  
- Readiness score  
- Compliance score  

**Note:** Required negation phrases (e.g. “not audit-ready”, “no scoring in this slice”, “does not create Freigabe”) are **allowed** when negating forbidden claims.

---

## 11. EC-09 Protection Rules

**Stable chain (must remain unchanged through B7.10):**

```
EmployeeForm
  → employee-queue-storage (cert-expert-tool2-employee-queue-v1)
  → doc chip selection
  → generateEmployeeDocs
  → Hetzner/Object Storage via template-storage
  → JSZip
  → client ZIP download
```

| Rule | B7.10 |
|------|-------|
| Zero generator/template/storage/JSZip diffs | **Required** |
| ZIP success ≠ readiness status change | Static render only — no post-generate hooks |
| ZIP success ≠ evidence status change | B7.4 untouched |
| ZIP success ≠ role/SDL assignment change | B7.6 untouched |
| ZIP success ≠ generated-output status change | B7.8 untouched |
| Doc chip selection unchanged | Do not wire readiness UI to selection mutation |
| Live readiness color | **Grey / Not evaluated only** |

---

## 12. B7.10 Acceptance Criteria

| AC | Criterion |
|----|-----------|
| **AC-01** | Readiness / Ampel section renders inside existing B7.2 shell |
| **AC-02** | Existing B5.7 shell remains intact |
| **AC-03** | Existing B7.4 Evidence section remains intact |
| **AC-04** | Existing B7.6 Role / SDL / Project sections remain intact |
| **AC-05** | Existing B7.8 Generator Output section remains intact |
| **AC-06** | Existing form remains usable |
| **AC-07** | Queue row selection still works |
| **AC-08** | Document chip selection still works |
| **AC-09** | ZIP generation path remains available and unchanged |
| **AC-10** | Readiness entries are read-only placeholders only |
| **AC-11** | Readiness remains grey / **Not evaluated** only |
| **AC-12** | No readiness algorithm, Ampel calculation, scoring or persistence introduced |
| **AC-13** | No automatic evidence acceptance, Freigabe, release or certification decision introduced |
| **AC-14** | ZIP success does not change readiness, generated-output, evidence, role or SDL/project status |
| **AC-15** | No forbidden wording in changed files |
| **AC-16** | `npm run build` passes |
| **AC-17** | Only authorized source file changed, plus required report |
| **AC-18** | Unrelated working tree changes untouched |
| **AC-19** | EC-09 files untouched |

---

## 13. Required B7.10 Build and Smoke Checks

When **Start B7.10** is authorized:

### Before changes

1. `git status --short` — record unrelated changes; do not touch.
2. Confirm branch `b3-tool2-migration`.
3. Confirm B7.9 committed (this document).

### After implementation

1. Forbidden wording grep on changed files (`EmployeeProfileSectionShell.tsx`, B7.10 report).
2. Confirm **no** red/yellow/green readiness color classes introduced (grep / visual).
3. `npm run build` from `apps/certification-os/`.
4. Visual smoke — `http://localhost:3001/employee-automation`:
   - B5.7 notice, summary, form, sidebar, generate strip, queue
   - B7.4, B7.6, B7.8 sections still intact
   - **Review / Prüfstatus** section shows 6 readiness domain rows + grey-only boundary
5. EC-09 minimum: **Generate & Download ZIP** available; invoke generate — no error toast.
6. Confirm readiness overview statuses **unchanged** after ZIP (static render).
7. `git diff --stat` — only authorized files.
8. Create `B7_10_READINESS_AMPEL_STATIC_SECTION_IMPLEMENTATION_REPORT.md`.

### B7.10 commit (when instructed)

```
feat: add static readiness Ampel section overview (B7.10)
```

Stage only:

- `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeProfileSectionShell.tsx`
- `docs/03-controls/B7_10_READINESS_AMPEL_STATIC_SECTION_IMPLEMENTATION_REPORT.md`

---

## 14. Required B7.10 Implementation Report Structure

`docs/03-controls/B7_10_READINESS_AMPEL_STATIC_SECTION_IMPLEMENTATION_REPORT.md` must include:

1. **Title:** B7.10 Readiness / Ampel Static Section Implementation Report  
2. **Gate source:** B7.9  
3. **Implementation summary**  
4. **Files changed**  
5. **Explicit confirmation that EC-09 was not modified**  
6. **Explicit confirmation** that no readiness algorithm, Ampel calculation, scoring, persistence, evidence acceptance, Freigabe logic, generator change, template change, JSZip change, Hetzner/Object Storage change or DIN decision matrix was introduced  
7. **Static readiness display domains implemented** (table)  
8. **Confirmation that grey / Not evaluated remains the only live readiness state**  
9. **Acceptance criteria checklist AC-01 to AC-19**  
10. **Build result**  
11. **Forbidden wording check result**  
12. **Visual/manual smoke result** (if performed)  
13. **Open issues / next gate recommendation**  

Gate conclusion options: **PASS — READY FOR B7.10a EC-09 SMOKE** / PASS WITH CONTROLS / REWORK / BLOCKED.

---

## 15. Stop Condition After B7.10

**Stop immediately after B7.10** unless a **new explicit gate prompt** authorizes further work.

B7.10 **does not** authorize:

- B7.10a smoke without explicit prompt (recommended but gated separately)  
- B7.11+ implementation without a separate planning gate  
- Readiness algorithm or live Ampel activation  
- Scoring, weighting, or pass/fail evaluation  
- Evidence upload, Freigabe workflow, output history  
- Generator/template/Hetzner/JSZip changes  
- Training/Unterweisung static section (separate future gate)  

**Suggested next slices (names only — not authorized):**

- **B7.10a** — EC-09 smoke verification after readiness static overview  
- **B7.11** — Training / Unterweisung static section planning  
- **B7.12** — Notes / open items static section planning  

---

## 16. B7.9 Validation Record

| Check | Result |
|-------|--------|
| B7.8 commit present | **Yes** — `1371a50` |
| B7.8a commit present | **Yes** — `4cf752d` |
| `git status --short` (pre) | Unrelated changes present; Tool-2 employee-file module clean at `4cf752d` |
| B7.9 document created | **Yes** — this file only |
| Source files modified | **No** |
| Implementation run | **No** — planning only |
| Commit | **Deferred** — await explicit instruction |

---

## 17. Document History

| Version | Date | Event |
|---------|------|-------|
| 1.0 | 2026-06-06 | B7.9 planning gate — **READY FOR B7.10 LIMITED READINESS / AMPEL STATIC IMPLEMENTATION WITH CONTROLS** |
