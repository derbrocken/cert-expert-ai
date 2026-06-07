# B8.0 — Existing Dashboard Working UI Module Overview Planning

**Gate:** B8.0 — Existing dashboard working UI inspection and module overview planning only  
**Status:** **READY FOR B8.1 EXISTING DASHBOARD MODULE OVERVIEW IMPLEMENTATION WITH CONTROLS**  
**Date:** 2026-06-06  
**Branch:** `b3-tool2-migration`  
**HEAD at gate start:** `d04e962` — `docs: inventory employee profile shell placeholders (B7.11)`  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Primary dashboard route:** `/` (`app/page.tsx`)

---

## 1. Gate Decision

### **READY FOR B8.1 EXISTING DASHBOARD MODULE OVERVIEW IMPLEMENTATION WITH CONTROLS**

B8.0 confirms that a **working dashboard entry UI already exists** at `/` and is the correct visual baseline for a Certification OS module overview extension. B8.1 should **enhance the existing home/dashboard page** with static module cards and a Mitarbeiterakte / Tool 2 subsection overview — not replace the page, not create a parallel dashboard from scratch, and not resume B7 micro-slices inside `EmployeeProfileSectionShell.tsx`.

**Next slice (when explicitly prompted):** **B8.1 — Existing Dashboard Module Overview Implementation**

B8.0 is **documentation/planning only**. No source files were changed.

---

## 2. Reason for Switching from B7 Micro-Slices to Dashboard-Level Overview

The B7 gate chain (B7.4–B7.10a, plus B7.11 placeholder inventory) successfully protected EC-09 while translating Tool 2 design decisions into **visible static structures inside the employee profile shell**. That approach was appropriate for controlled, file-scoped evidence and avoided accidental generator regressions.

By B7.10a, the profile shell contains multiple static overview panels (evidence, roles/SDL, generator output, readiness/Ampel). Continuing with additional micro-slices inside `EmployeeProfileSectionShell.tsx` would:

1. **Fragment system orientation** — operators see section detail but lose sight of how Mitarbeiterakte fits into the broader Certification OS.
2. **Duplicate navigation concepts** — the shell’s vertical section nav is a **detailed working/requirement shell**, not a product-level module map.
3. **Delay the intended IA transition** — B6.1 already positions a top-level Certification OS nav (`Dashboard │ Tool 1 │ Tool 2 │ Uploads`) above the employee workspace; the dashboard layer was never given a matching visual module map.

B8.0 therefore pivots to **dashboard-level visual overview**: extend the existing working UI at `/` with module tabs/cards, with **primary focus on Mitarbeiterakte / Tool 2** and its twelve subsection areas as a static visual map (labels, status badges, links — no new logic).

---

## 3. Current HEAD and Gate Chain Reference

### HEAD at inspection

| Item | Value |
|------|-------|
| Branch | `b3-tool2-migration` |
| HEAD | `d04e962` — `docs: inventory employee profile shell placeholders (B7.11)` |
| Note | User context referenced `7b19d3b` (B7.10a); B7.11 closed after that commit |

### Closed Tool 2 gate chain (B7 profile shell stream)

| Gate | Type | Status |
|------|------|--------|
| B7.4 | Static Evidence Overview | **CLOSED** |
| B7.5 | Role / SDL / Project Planning | **CLOSED** |
| B7.6 | Static Role / SDL / Project Overview | **CLOSED** |
| B7.6a | EC-09 Smoke Verification | **CLOSED** |
| B7.7 | Generator Output Planning Gate | **CLOSED** |
| B7.8 | Static Generator Output Overview | **CLOSED** |
| B7.8a | EC-09 Smoke Verification | **CLOSED** |
| B7.9 | Readiness / Ampel Static Planning Gate | **CLOSED** |
| B7.10 | Static Readiness / Ampel Overview | **CLOSED** |
| B7.10a | EC-09 Smoke Verification | **CLOSED** |
| B7.11 | Employee Profile Placeholder Inventory | **CLOSED** — `d04e962` |
| **B8.0** | **Dashboard module overview planning** | **THIS GATE** |

---

## 4. Existing Dashboard Working UI Inspection Summary

### App routes (Next.js App Router)

| Route | Page file | Renders |
|-------|-----------|---------|
| `/` | `app/page.tsx` | **Dashboard / home working UI** — Certification OS landing |
| `/model-creator` | `app/model-creator/page.tsx` | Tool 1 Document Creator |
| `/employee-automation` | `app/employee-automation/page.tsx` → re-export | Tool 2 Employee File Workspace |
| `/uploads` | `app/uploads/page.tsx` → re-export | Upload Manager |

There is **no separate `/dashboard` route**. The Navbar link labeled **“Dashboard”** points to `/`.

### What exists today at `/`

The home page is a **functional working overview**, not a marketing placeholder:

- Shared app chrome: `Navbar` + `Footer`
- Page title: **“Cert-Expert Certification OS”**
- Subtitle describing Document generator and Tool 2 employee automation
- Three primary **CTA link blocks** (gradient buttons with Lucide icons):
  - Document Creator → `/model-creator`
  - Employee Generator → `/employee-automation`
  - Upload Manager → `/uploads`

### What does **not** exist yet

- No module overview grid for the nine Certification OS areas
- No Mitarbeiterakte subsection card/tab map on the dashboard
- No dedicated dashboard components under `modules/00-dashboard/` (only README placeholders)
- No use of `components/ui/Card.tsx` anywhere in the app (component exists but is unused)
- No tabs or module navigation blocks beyond Navbar tool links

### Passive module scaffold (README-only)

Under `apps/certification-os/modules/`:

| Folder | Module area |
|--------|-------------|
| `00-dashboard/` | Dashboard / ZKM / offene Punkte / deadlines / audit-readiness / Prüfvermerke |
| `01-unternehmensakte/` | Unternehmensakte |
| `02-projektakte/` | Projektakte |
| `03-mitarbeiterakte-tool-2/` | **Active** — Tool 2 employee file |
| `04-qm-auditordner/` | QM-Ordner / Auditordner |
| `05-schulungen-unterweisungen/` | Schulung / Unterweisung |

These folders define **future domain boundaries** but contain no dashboard UI implementation.

### Visual baseline patterns to preserve in B8.1

| Pattern | Source | Reuse in B8.1 |
|---------|--------|---------------|
| Full-page gradient background | `app/page.tsx` — `from-gray-50 via-white to-orange-50` | Keep |
| Fixed `Navbar` with CE logo + tool links | `components/layout/Navbar.tsx` | Keep; optional label tweak only |
| `max-w-7xl` centered main column | Home + employee workspace | Keep |
| Gradient CTA buttons with shadow | Home page CTAs | Keep as quick-launch row |
| Rounded-2xl bordered panels with gradient header | `EmployeeFileSummaryPanel`, `EmployeeProfileSectionShell` | Adapt for module/subsection cards |
| Grey status badges | `EmployeeProfileSectionShell` — `greyBadge()` | Static “Passive / Active / Planned” labels |
| Lucide icons per area | Home CTAs, profile section nav | Extend to module cards |

### Related but out-of-scope for B8.1 dashboard target

| Surface | Role | B8.1 action |
|---------|------|-------------|
| `/employee-automation` | Tool 2 workspace with queue, form, profile shell | **Link target only** — do not modify |
| `EmployeeProfileSectionShell.tsx` | Detailed 10-section working shell | **Do not modify** in B8.1 |
| `hq/00_Dashboard/` | Separate HQ HTML dashboard | Unrelated — do not touch |

---

## 5. Identified Dashboard Route / Page / Component

| Role | Path |
|------|------|
| **Route** | `/` |
| **Page component** | `apps/certification-os/app/page.tsx` — default export `Home` |
| **Layout shell** | `apps/certification-os/app/layout.tsx` |
| **Navigation** | `apps/certification-os/components/layout/Navbar.tsx` — “Dashboard” → `/` |
| **Footer** | `apps/certification-os/components/layout/Footer.tsx` |

**Conclusion:** The existing dashboard working UI **is** `app/page.tsx`. B8.1 extends this page; it does not introduce a competing dashboard route.

---

## 6. Existing Visual Structure Found

### Navbar (global)

- Logo link → `/`
- Text link “Dashboard” → `/` (desktop `lg:block` only)
- Three styled tool buttons: Document Generator, Employee Generator, Upload Manager

### Home page (`/`)

- Hero heading + description (centered)
- Horizontal CTA row (responsive stack on mobile)
- **No cards, tabs, or module grid**

### Employee workspace (`/employee-automation`) — reference only

- Page header with `CEBadge` + “Employee File Workspace”
- `EmployeeFileWorkspaceNotice` (amber transitional banner)
- `EmployeeFileSummaryPanel` (blue gradient summary card)
- `EmployeeProfileSectionShell` (violet-bordered shell with **vertical section nav** + content panel)
- Queue table + form + global sidebar (generator workflow)

The profile shell’s section nav is the **detailed Mitarbeiterakte map** already built in B7 — B8.1 should **reflect** this structure at dashboard level without duplicating or modifying the shell.

### Reusable UI primitives available

- `components/ui/Card.tsx` (+ CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- `components/ui/Badge.tsx`
- `components/ui/CEBadge.tsx`
- Lucide React icons (already used across app)

---

## 7. Recommended B8.1 Implementation Target

**Primary approach: enhance the existing dashboard page (`app/page.tsx`) with a new module overview section.**

### B8.1 should

1. **Retain** the current hero title, subtitle, and three quick-launch CTAs unchanged in behavior (links and routes).
2. **Add below the CTA row** a static **Certification OS Module Overview** section:
   - Nine module area cards in a responsive grid
   - Each card: German label, short description, status badge (`Active` / `Passive` / `Planned`), optional link where a route exists
3. **Expand the Mitarbeiterakte / Tool 2 card** (or adjacent subsection panel) with the twelve Mitarbeiterakte subsection labels as a **static visual list or mini-card grid** — mirroring B7 shell + B6 IA, not implementing section content.
4. **Link** Mitarbeiterakte module card → `/employee-automation` (existing route).
5. Use existing visual language (gradients, rounded-2xl, grey badges, Lucide icons) — optionally introduce `Card` component for consistency.
6. Keep all content **static** — no API calls, no persistence, no readiness/Ampel logic.

### B8.1 should **not**

- Create a new `/dashboard` route unless aliasing is explicitly requested later (not required — `/` already serves this role).
- Replace or remove existing home CTAs.
- Modify `EmployeeProfileSectionShell.tsx` or employee generator workflow.
- Implement passive modules (Unternehmensakte, Projektakte, etc.) beyond placeholder cards.

---

## 8. Files Likely to Change in B8.1

| File | Change |
|------|--------|
| `apps/certification-os/app/page.tsx` | Add module overview section; import new overview component |
| `apps/certification-os/modules/00-dashboard/CertificationOsModuleOverview.tsx` *(proposed new)* | Static module grid + Mitarbeiterakte subsection map |
| `apps/certification-os/modules/00-dashboard/module-overview-data.ts` *(proposed new, optional)* | Static labels, statuses, links — keeps page.tsx thin |

**Optional (minimal, only if needed for consistency):**

| File | Change |
|------|--------|
| `apps/certification-os/components/layout/Navbar.tsx` | Wording only (e.g. “Dashboard” visibility) — **defer unless explicitly scoped** |

**New file location rationale:** `modules/00-dashboard/` aligns with passive module scaffold and keeps `app/page.tsx` as a thin composition layer — matching existing pattern where Tool 2 pages re-export from `modules/03-mitarbeiterakte-tool-2/`.

---

## 9. Files Explicitly Not to Touch

### EC-09 protected chain

| File | Reason |
|------|--------|
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeForm.tsx` | Form + doc chip selection |
| `modules/03-mitarbeiterakte-tool-2/employee-file/employee-queue-storage.ts` | Queue persistence |
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeAutomationPage.tsx` | Generator orchestration |
| `modules/03-mitarbeiterakte-tool-2/employee-generator/generate-employee-docs.ts` | Generator core |
| `app/actions/generate-employee-docs.ts` | Action shim |
| `app/api/templates/route.ts` | Template API |
| JSZip / template-storage / Hetzner paths | Storage chain |

### B7 profile shell (frozen for B8 stream)

| File | Reason |
|------|--------|
| `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeProfileSectionShell.tsx` | Detailed working shell — do not extend in B8.1 |

### Tool 1 / uploads / unrelated trees

| Path | Reason |
|------|--------|
| `app/model-creator/**` | Tool 1 |
| `app/uploads/**`, `modules/.../roles/admin/UploadsPage.tsx` | Upload admin |
| `bots/legacy_tools/**` | Legacy copy — unrelated local changes |
| `hq/**` | HQ dashboard — separate system |
| `.env.local` | Secrets |
| `cert-expert-certification-os/docs/03-controls/B5_7_EMPLOYEE_FILE_MVP_SLICE_1_IMPLEMENTATION_REPORT.md` | Unrelated local modification |

---

## 10. Proposed Module Areas (Dashboard / Gesamtübersicht)

Static visual cards — **display and navigation hints only**:

| # | Module area | Folder scaffold | Suggested status badge | Route / link (B8.1) |
|---|-------------|-----------------|------------------------|---------------------|
| 1 | **Dashboard / Gesamtübersicht** | `00-dashboard/` | Active (this page) | `/` — current page anchor |
| 2 | **Unternehmensakte** | `01-unternehmensakte/` | Passive | No route — “Planned” |
| 3 | **Projektakte** | `02-projektakte/` | Passive | No route — “Planned” |
| 4 | **Mitarbeiterakte / Tool 2** | `03-mitarbeiterakte-tool-2/` | **Active** | `/employee-automation` |
| 5 | **Schulung / Unterweisung** | `05-schulungen-unterweisungen/` | Passive | No route — “Planned” |
| 6 | **QM-Ordner / Auditordner** | `04-qm-auditordner/` | Passive | No route — “Planned” |
| 7 | **ZKM / Maßnahmen / Prüfvermerke** | `00-dashboard/zkm-massnahmen/`, `pruefvermerke/` | Passive | No route — sub-areas listed on card |
| 8 | **Generator / Dokumente** | Tool 1 surface | Active | `/model-creator` + reference Tool 2 output |
| 9 | **Readiness / Auditvorbereitung** | `00-dashboard/audit-readiness-status/` | Passive (display) | No route — static “not evaluated” |

**Layout suggestion for B8.1:** 3-column grid on `lg`, 2-column on `sm`, single column on mobile — consistent with employee workspace grids.

---

## 11. Proposed Mitarbeiterakte Visual Structure

Static subsection map under the **Mitarbeiterakte / Tool 2** module card — **labels and status only**, aligned to B7 shell + product IA:

| # | Subsection (DE) | B7 shell mapping | Suggested static status |
|---|-----------------|------------------|-------------------------|
| 1 | Stammdaten | `master-data` | Active — edit via form |
| 2 | Beschäftigung / Vertrag | `employment` | Active — edit via form |
| 3 | Pflichtnachweise | `evidence` (Nachweise) | Read-only static overview (B7.4) |
| 4 | Datenschutz & Verschwiegenheit | *(no dedicated shell section — evidence/domain row in B7.4)* | Planned — static label only |
| 5 | Qualifikation / §34a / Sachkunde | *(partially in evidence categories)* | Planned — static label only |
| 6 | Schulung & Unterweisung | `training` | Placeholder (B7.11) |
| 7 | Rollen / Zusatzrollen | `roles` | Read-only static overview (B7.6) |
| 8 | SDL-/Projektbezug | `sdl-project` | Read-only static overview (B7.6) |
| 9 | Generierte Dokumente | `output` | Read-only static overview (B7.8) |
| 10 | Offene Punkte / Nachforderungen | `notes-open` | Read-only hint list |
| 11 | Prüfstatus / Readiness | `review` | Read-only static overview (B7.10) |
| 12 | Verlauf / Historie | `history` | Placeholder (B7.11) |

**Design note:** Items 4–5 are **IA labels** for dashboard orientation; they were not given separate B7 shell sections. B8.1 shows them as planned sub-areas without implementing content. Deep detail remains in `/employee-automation` profile shell when an employee is selected.

**Visual treatment:** Compact list or 2×6 mini-grid inside the Mitarbeiterakte card; grey badges matching shell (`Active`, `Read-only`, `Placeholder`, `Planned`); optional “Open workspace →” link to `/employee-automation`.

---

## 12. Out-of-Scope Boundaries

B8.1 and subsequent B8 dashboard slices remain **working overview only**. Explicitly excluded:

| Boundary | Notes |
|----------|-------|
| Final product UI | Transitional working chrome only |
| Persistence / database | No new storage |
| Upload / evidence acceptance | No file handling |
| Assignment saving | No SDL/project write path |
| Freigabe logic | Display labels only |
| Readiness algorithm | No scoring |
| Ampel calculation | Grey/static badges only |
| Scoring | None |
| Output history | No generator history store |
| Generator / template changes | EC-09 chain frozen |
| Hetzner / Object Storage changes | Frozen |
| JSZip changes | Frozen |
| Tool 1 changes | `/model-creator` links only |
| Customer portal | Not in scope |
| HQ dashboard (`hq/`) | Separate system |

---

## 13. EC-09 Protection Statement

The protected Tool 2 generator chain **does not require modification** for B8.0 or B8.1 dashboard module overview work:

```
EmployeeForm
  → employee-queue-storage (cert-expert-tool2-employee-queue-v1)
  → doc chip selection
  → generateEmployeeDocs
  → Hetzner/Object Storage via template-storage
  → JSZip
  → client ZIP download
```

B8.1 targets **`app/page.tsx`** and new static components under **`modules/00-dashboard/`** only. No files in the chain above are in the B8.1 change set. EC-09 smoke verification should be re-run after B8.1 only if an unexpected touch occurs — **not expected** for dashboard-only static UI.

---

## 14. Unrelated Working Tree Protection Statement

At B8.0 inspection, unrelated local modifications existed and were **not read for implementation, not staged, not modified, and not committed**:

| Area | Examples |
|------|----------|
| `hq/` | Dashboard HTML, kundenprojekte, vertrieb, scripts |
| `bots/legacy_tools/` | Employee automation, DatePicker, queue storage |
| `cert-expert-certification-os/docs/03-controls/B5_7_*.md` | Local doc edit |
| `Unbenannt.canvas` | Untracked canvas |

B8.0 created **only** this planning document under `cert-expert-certification-os/docs/03-controls/`.

---

## 15. B8.1 Route Strategy Recommendation

| Option | Assessment |
|--------|------------|
| **A. Enhance existing dashboard working UI page (`/`)** | **Recommended** — page exists, Navbar already labels it Dashboard, CTAs already provide tool entry |
| B. Add module overview section to existing dashboard | **Same as A** — implement as new section component on `app/page.tsx` |
| C. Create new route only if no suitable dashboard page | **Not needed** — suitable page exists at `/` |

**Decision:** B8.1 implements **Option A/B** — extend `app/page.tsx` with a static module overview component; **do not** add a parallel `/dashboard` route in B8.1.

---

## 16. B8.1 Acceptance Criteria (Preview)

When B8.1 is executed:

1. `/` renders nine module area cards plus Mitarbeiterakte twelve-subsection static map.
2. Existing three CTA buttons still link to `/model-creator`, `/employee-automation`, `/uploads`.
3. Mitarbeiterakte card links to `/employee-automation`.
4. No changes to EC-09 chain files.
5. No changes to `EmployeeProfileSectionShell.tsx`.
6. `npm run build` PASS.
7. Unrelated working tree files remain untouched.
8. B8.1 implementation report created in `docs/03-controls/`.

---

## 17. Validation Record (B8.0)

| Step | Result |
|------|--------|
| 1. `git status --short` (pre) | Unrelated changes in `hq/`, `bots/legacy_tools/`, etc.; no cert-os app source staged |
| 2. Inspect existing dashboard files | `/` = `app/page.tsx`; Navbar Dashboard link; no module grid yet |
| 3. Create B8.0 planning document only | **This file** |
| 4. `git status --short` (post) | Only new doc under `cert-expert-certification-os/docs/03-controls/` |
| 5. Confirm no source files changed | **Confirmed** — no `.tsx`/`.ts` app changes |
| 6. Confirm unrelated local changes untouched | **Confirmed** |
| 7. Commit | **Not performed** — awaiting explicit instruction |

---

## 18. Summary

| Item | Finding |
|------|---------|
| Dashboard target | `apps/certification-os/app/page.tsx` at route `/` |
| B8.1 primary files | `app/page.tsx` + new `modules/00-dashboard/CertificationOsModuleOverview.tsx` |
| Approach | Extend existing working UI — not replace |
| Mitarbeiterakte focus | Static 12-subsection map on dashboard; deep detail stays in profile shell |
| EC-09 | Untouched by B8.0/B8.1 scope |
| Gate | **READY FOR B8.1 EXISTING DASHBOARD MODULE OVERVIEW IMPLEMENTATION WITH CONTROLS** |
