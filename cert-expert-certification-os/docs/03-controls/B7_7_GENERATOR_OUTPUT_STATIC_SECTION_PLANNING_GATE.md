# B7.7 — Generator Output / Generated Documents Static Section Planning Gate

**Gate:** B7.7 — Generator output static implementation planning only  
**Status:** **READY FOR B7.8 LIMITED GENERATOR OUTPUT STATIC IMPLEMENTATION WITH CONTROLS**  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**Prerequisite:** B7.6 PASS (`a9128d4`); B7.6a EC-09 smoke PASS — READY FOR B7.7 PLANNING (`34ce93c`)  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Primary route:** `/employee-automation`

---

## 1. Gate Decision

### **READY FOR B7.8 LIMITED GENERATOR OUTPUT STATIC IMPLEMENTATION WITH CONTROLS**

B7.7 plans the **next smallest safe implementation slice** after B7.6: static, read-only **Generator Output / Generated Documents** overview inside the existing B7.2 profile shell. This gate **authorizes planning only**. It **does not authorize** code changes, generator changes, output history, persistence, evidence acceptance, Freigabe logic, or readiness algorithms.

**Next slice (when explicitly prompted):** **B7.8 — Generator Output / Generated Documents Static Section Enhancement**

---

## 2. Purpose

B7.7 defines how to extend the transitional profile shell with **generated-document output context display** aligned to Cert-Expert Tool-2 employee-file design — without changing the actual generator, templates, JSZip, Hetzner/Object Storage, or introducing output history or acceptance workflows.

This document:

1. Confirms the **verified baseline** after B7.6a.
2. Scopes **B7.8** to static generated-document output placeholders in `EmployeeProfileSectionShell.tsx` only.
3. Lists output categories, allowed/forbidden wording, and EC-09 rules.
4. Defines B7.8 acceptance criteria, validation steps, and implementation report structure.
5. States **stop conditions** after B7.8.

B7.7 is a **planning gate document** — not an implementation slice.

---

## 3. Source Artefacts

| Artefact | Commit / ref | Role in B7.7 |
|----------|--------------|--------------|
| **B5.3–B5.5** | B5.7 lineage | Prepared output ≠ accepted evidence; ZIP ≠ release |
| **B6.5** | Design refs | Display-only review/readiness; no post-ZIP mutation |
| **B7.2** Profile shell | `983de00` | Ten sections; `output` read-only stub |
| **B7.4** Evidence static section | `b93f6bb` | Pattern for static overview component |
| **B7.6** Role/SDL assignment static | `a9128d4` | Pattern for category list + disclaimers |
| **B7.6 report** | `a9128d4` | AC template; single-file slice precedent |
| **B7.6a** EC-09 smoke | `34ce93c` | Generator baseline unchanged post–B7.6 |

**Functional anchor (not re-opened):** EC-09 generator path; prepared documents require review; no automatic evidence acceptance.

---

## 4. Current Verified Baseline

| Area | State (post–B7.6a) |
|------|---------------------|
| **B7.2 shell** | Ten sections; mounted on `focusEmployee && templatesLoaded` |
| **B7.4 evidence** | `EvidenceStaticOverview` — 10 read-only category rows |
| **B7.6 roles** | `RoleAssignmentStaticOverview` — 6 rows + role taxonomy glossary |
| **B7.6 sdl-project** | `SdlProjectAssignmentStaticOverview` — 4 rows |
| **`output` section today** | Minimal read-only stub: selected doc counts, `outputStatus`, “Last generated: Not generated (no output history in this slice)” — **primary B7.8 replacement/enhancement target** |
| **EC-09** | PASS (B7.6a); generator/queue/storage untouched |
| **Readiness** | Grey **Not evaluated** only |
| **Build** | `npm run build` PASS (B7.6a) |
| **ZIP baseline** | `employee-documents-*.zip` — 119 837 bytes; 4 DOCX (B7.6a) |

**Runtime output data available (read-only hints only):**

- `employee.selectedRoleDocIds.length` / `employee.selectedAppointmentDocIds.length` — generator selection counts
- `roleId` → resolved `Role.name` from Hetzner template catalog
- `appointmentIds[]` → overlay names
- **No** output history, last-generated timestamp, archived output IDs, or per-document generation status in `Employee` schema
- **No** server-side output registry in this slice

---

## 5. B7.8 Candidate Slice — Scope

### **B7.8 — Generator Output / Generated Documents Static Section Enhancement**

**Objective:** Replace or enhance the current **Generator Output** stub with a **static, read-only generated-document output overview** — visual/informational preparation only.

**Planned section target:**

| Shell section ID | B7.8 action |
|------------------|-------------|
| `output` | **Replace/enhance** existing stub with `GeneratorOutputStaticOverview` (or equivalent inline component) — 10 generated-document output category rows |

**Implementation pattern (mirror B7.4 / B7.6):**

- Add `GeneratorOutputStaticOverview` **inline in the same file** (reuse `AssignmentCategoryList` pattern if appropriate).
- Derive display hints from existing `employee`, `roles`, `appointments` props and precomputed `totalSelectedDocs` / `outputStatus` only.
- **No** new React state for output history, last-generated timestamps, or post-ZIP status updates.
- **No** callbacks to queue storage, generator, or download handler from the overview component.

**Explicit B7.8 non-goals:**

- Output history, persistence, DB, document storage changes
- Generated-document acceptance workflow
- Template logic changes, generator changes, JSZip changes, Hetzner/Object Storage changes
- Tool 1 changes
- Readiness algorithm, Freigabe logic, DIN decision matrix
- Modifications to B7.4 evidence, B7.6 role/SDL sections (must remain intact)
- Wiring overview rows to mutate `selectedRoleDocIds` / `selectedAppointmentDocIds`

---

## 6. Authorized File(s) for B7.8

| File | Allowed change |
|------|----------------|
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeProfileSectionShell.tsx` | **Only** authorized code file |

**New report (B7.8 gate):**

| File | Purpose |
|------|---------|
| `docs/03-controls/B7_8_GENERATOR_OUTPUT_STATIC_SECTION_IMPLEMENTATION_REPORT.md` | Implementation evidence |

**Optional follow-on (not part of B7.8 — separate gate):**

| Gate | Purpose |
|------|---------|
| **B7.8a** | EC-09 smoke verification after B7.8 (recommended per B7.2a / B7.6a pattern) |

---

## 7. Forbidden Implementation Areas (B7.8)

| # | Forbidden |
|---|-----------|
| F-1 | Output history, last-generated persistence, archived output registry |
| F-2 | localStorage / IndexedDB / DB / new `Employee` fields for output tracking |
| F-3 | Document storage changes, upload, file picker |
| F-4 | Generated-document acceptance / evidence acceptance workflow |
| F-5 | Freigabeentscheidung / release automation |
| F-6 | Readiness or Ampel computation |
| F-7 | DIN decision matrix or compliance evaluation |
| F-8 | `generateEmployeeDocs`, `generate-employee-docs.ts`, server actions |
| F-9 | `lib/template-storage.ts`, Hetzner, API routes, JSZip logic |
| F-10 | `EmployeeAutomationPage.tsx`, `EmployeeForm.tsx`, `employee-queue-storage.ts` (unless mounting bug — **stop and report**) |
| F-11 | Changes to B7.4 `EvidenceStaticOverview` behavior |
| F-12 | Changes to B7.6 `RoleAssignmentStaticOverview` / `SdlProjectAssignmentStaticOverview` behavior |
| F-13 | Tool 1, `hq/`, `bots/`, unrelated reports |
| F-14 | Package files, `.env.local` |
| F-15 | Claims that generator, template, or output storage was changed |

---

## 8. Static Generated-Document Output Categories (B7.8 Placeholders)

**Not a final data model. Not an output registry. Not a generator specification change.**

| # | Category (DE / EN) | Default status (planned) | Data hint source (if any) |
|---|-------------------|--------------------------|---------------------------|
| 1 | Standardpersonalakte / employee file package | **Prepared** / **Not selected** | `totalSelectedDocs`; role name context |
| 2 | Datenschutz declaration | **Output placeholder** / **Requires review** | Role doc selection; template catalog context |
| 3 | Verschwiegenheit declaration | **Output placeholder** / **Requires review** | Placeholder — no separate output ID |
| 4 | General employee instruction / allgemeine Unterweisung | **Open** / **Not implemented** | Overlay/doc counts (read-only) |
| 5 | Object-specific instruction / objektbezogene Unterweisung | **Not applicable** / **Output placeholder** | No object ID — placeholder |
| 6 | Training evidence / Schulungsnachweis | **Open** / **Requires review** | `selectedAppointmentDocIds` count |
| 7 | Certificate output / Zertifikat | **Not implemented** | Placeholder |
| 8 | Combined instruction package / Sammelunterweisung | **Not implemented** | Placeholder |
| 9 | Multi-employee document package / Sammeldokument | **Not implemented** | Batch context note only — queue strip unchanged |
| 10 | ZIP export package / ZIP-Ausgabe | **ZIP available** / **Not generated** | Static note: batch strip below; no output history |

**Required explanatory notes (output section):**

- Generated outputs are **prepared documents**, not accepted evidence.
- Generated outputs **require later review**.
- Generated outputs do **not** create Freigabe.
- Generated outputs do **not** create readiness.
- ZIP success does **not** change evidence, role/SDL/project assignment, generated-output overview, or readiness status in this slice.
- This overview is **not** output history and **not** a DIN decision matrix.
- B7.8 must **not** change the actual generator.

**Mapping guidance (Tool-2 design language):**

- Use Hetzner template role doc names only as **read-only hint text** where already available from queue selection — do not invent template filenames or ZIP contents not derivable from existing props.
- Row statuses reflect **selection/preparedness placeholders**, not live generation results per row (generator produces batch ZIP only).

---

## 9. Allowed Status Wording (B7.8)

- Not implemented  
- Not evaluated  
- Open  
- Requires review  
- Prepared  
- Generated  
- Not generated  
- Not selected  
- Static placeholder  
- Review required  
- Output placeholder  
- ZIP available  
- No output history  

**Conservative display phrases (recommended in banners):**

- “Static placeholder”  
- “Review required later”  
- “No output history in this slice”  
- “No generator change in this slice”  
- “Prepared documents require review — not accepted evidence”  
- “ZIP generation does not change evidence, assignment or readiness status”  

---

## 10. Forbidden Wording (B7.8)

Must **not** appear as claims in B7.8 changed files:

- Approved  
- Released  
- Certified  
- DIN-compliant  
- Audit-ready  
- Certification-ready  
- Accepted evidence  
- Evidence accepted  
- Freigegeben  
- Einsatzfreigabe erteilt  
- Automatisch freigegeben  
- Automatically accepted  
- Automatically released  
- Generator changed  
- Template changed  
- Output saved  
- Output archived  

**Note:** Required negation phrases (e.g. “not accepted evidence”, “does not create Freigabe”, “no output history in this slice”) are **allowed** when negating forbidden claims.

---

## 11. EC-09 Protection Rules

**Stable chain (must remain unchanged through B7.8):**

```
EmployeeForm
  → employee-queue-storage (cert-expert-tool2-employee-queue-v1)
  → doc chip selection
  → generateEmployeeDocs
  → Hetzner/Object Storage via template-storage
  → JSZip
  → client ZIP download
```

| Rule | B7.8 |
|------|------|
| Zero generator/template/storage/JSZip diffs | **Required** |
| ZIP success ≠ generated-output overview status change | Static render only — no post-generate hooks |
| ZIP success ≠ evidence status change | B7.4 evidence section untouched |
| ZIP success ≠ role/SDL assignment status change | B7.6 sections untouched |
| ZIP success ≠ readiness change | **Not evaluated** only |
| Doc chip selection unchanged | Do not wire output UI to selection mutation |
| Batch generate strip unchanged | Overview describes ZIP context only — does not replace strip |

---

## 12. B7.8 Acceptance Criteria

| AC | Criterion |
|----|-----------|
| **AC-01** | Generator Output / Generated Documents section renders inside existing B7.2 shell |
| **AC-02** | Existing B5.7 shell remains intact |
| **AC-03** | Existing B7.4 evidence section remains intact |
| **AC-04** | Existing B7.6 role / SDL / project sections remain intact |
| **AC-05** | Existing form remains usable |
| **AC-06** | Queue row selection still works |
| **AC-07** | Document chip selection still works |
| **AC-08** | ZIP generation path remains available and unchanged |
| **AC-09** | Generated-document entries are read-only placeholders only |
| **AC-10** | No output history, persistence, DB, storage change or generator change introduced |
| **AC-11** | No automatic evidence acceptance, Freigabe, release or readiness decision introduced |
| **AC-12** | Readiness remains grey / **Not evaluated** only |
| **AC-13** | ZIP success does not change generated-output/evidence/role/SDL/readiness status |
| **AC-14** | No forbidden wording in changed files |
| **AC-15** | `npm run build` passes |
| **AC-16** | Only authorized source file changed, plus required report |
| **AC-17** | Unrelated working tree changes untouched |
| **AC-18** | EC-09 files untouched |

---

## 13. Required B7.8 Build and Smoke Checks

When **Start B7.8** is authorized:

### Before changes

1. `git status --short` — record unrelated changes; do not touch.
2. Confirm branch `b3-tool2-migration`.
3. Confirm B7.7 committed (this document).

### After implementation

1. Forbidden wording grep on changed files (`EmployeeProfileSectionShell.tsx`, B7.8 report).
2. `npm run build` from `apps/certification-os/`.
3. Visual smoke — `http://localhost:3001/employee-automation`:
   - B5.7 notice, summary, form, sidebar, generate strip, queue
   - B7.4 evidence section still shows 10 categories
   - B7.6 role + SDL sections still show assignment overviews
   - **Generator Output** section shows 10 output category rows (not generic stub only)
4. EC-09 minimum: **Generate & Download ZIP** available; invoke generate — no error toast.
5. Confirm output overview statuses **unchanged** after ZIP (static render).
6. Full ZIP smoke recommended for B7.8a follow-on (record filename + byte size).
7. `git diff --stat` — only authorized files.
8. Create `B7_8_GENERATOR_OUTPUT_STATIC_SECTION_IMPLEMENTATION_REPORT.md`.

### B7.8 commit (when instructed)

```
feat: add static generator output section overview (B7.8)
```

Stage only:

- `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeProfileSectionShell.tsx`
- `docs/03-controls/B7_8_GENERATOR_OUTPUT_STATIC_SECTION_IMPLEMENTATION_REPORT.md`

---

## 14. Required B7.8 Implementation Report Structure

`docs/03-controls/B7_8_GENERATOR_OUTPUT_STATIC_SECTION_IMPLEMENTATION_REPORT.md` must include:

1. **Title:** B7.8 Generator Output / Generated Documents Static Section Implementation Report  
2. **Gate source:** B7.7  
3. **Implementation summary**  
4. **Files changed**  
5. **Explicit confirmation that EC-09 was not modified**  
6. **Explicit confirmation** that no generator, template, JSZip, Hetzner/Object Storage, persistence, output history, evidence acceptance, Freigabe logic, readiness algorithm or DIN decision matrix was introduced  
7. **Static generated-document output categories implemented** (table)  
8. **Acceptance criteria checklist AC-01 to AC-18**  
9. **Build result**  
10. **Forbidden wording check result**  
11. **Visual/manual smoke result** (if performed)  
12. **Open issues / next gate recommendation**  

Gate conclusion options: **PASS — READY FOR B7.8a EC-09 SMOKE** / PASS WITH CONTROLS / REWORK / BLOCKED.

---

## 15. Stop Condition After B7.8

**Stop immediately after B7.8** unless a **new explicit gate prompt** authorizes further work.

B7.8 **does not** authorize:

- B7.8a smoke without explicit prompt (recommended but gated separately)  
- B7.9+ implementation without a separate planning gate  
- Output history or archived output registry  
- Evidence upload  
- Generator/template/Hetzner/JSZip changes  
- Readiness/Ampel algorithm  
- Profile-level generate behavior change  
- Training/Unterweisung static section (separate future gate)  

**Suggested next slices (names only — not authorized):**

- **B7.8a** — EC-09 smoke verification after generator output static overview  
- **B7.9** — Training / Unterweisung static section planning or Review section polish  

---

## 16. B7.7 Validation Record

| Check | Result |
|-------|--------|
| `git status --short` (pre) | Unrelated changes present; Tool-2 employee-file module clean at `34ce93c` |
| B7.7 document created | **Yes** — this file only |
| Source files modified | **No** |
| Implementation run | **No** — planning only |
| Commit | **Deferred** — await explicit instruction |

---

## 17. Document History

| Version | Date | Event |
|---------|------|-------|
| 1.0 | 2026-06-05 | B7.7 planning gate — **READY FOR B7.8 LIMITED GENERATOR OUTPUT STATIC IMPLEMENTATION WITH CONTROLS** |
