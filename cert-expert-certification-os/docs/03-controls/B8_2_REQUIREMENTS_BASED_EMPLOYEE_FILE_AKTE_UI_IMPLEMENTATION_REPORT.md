# B8.2 — Requirements-Based Employee File Akte UI Implementation Report

**Gate:** B8.2 — Requirements-based Mitarbeiterakte Akte UI (working logic)  
**Status:** **PASS — FROZEN FOR B8.3 ROLE/SCOPE REQUIREMENT MAPPING**  
**Date:** 2026-06-06  
**Branch:** `b3-tool2-migration`  
**Prerequisite:** B8.1 dashboard module overview + Mitarbeiterakte workspace polish  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Primary routes:** `/` (dashboard hub), `/employee-automation` (workspace)

---

## 1. Gate Conclusion

### **PASS — FROZEN**

Requirements-based employee file Akte UI implemented as **visible working logic** with conservative statuses. Build PASS. EC-09 generator path untouched. No evidence upload slice. No DIN 77200-2 rule engine. No new persistence beyond existing `employee-queue-storage`.

**Next gate (not in this commit):** B8.3 — Grundrolle + Zusatzrolle + DIN/SDL/Projektkontext → required fields / evidence / open points mapping (still working UI, not final engine).

---

## 2. What Was Implemented

### 2.1 Dashboard first-level Mitarbeiterakte (`/`)

| Area | Behaviour |
|------|-----------|
| **Left index** | `EmployeeFileIndex` embedded via `EmployeeFileDashboardHub` — Neue Person, search, export checkboxes, employee list, Firmendaten link |
| **Right panel** | `EmployeeFileOverviewIntro` — Personal erfassen copy only; no duplicate employee cards |
| **Removed from overview** | “Aktenstruktur (je Person)” subtopic table on first entry |
| **Navigation** | Card/select → `/employee-automation?id=…`; Neue Person → `/employee-automation?new=1` |

### 2.2 Workspace overview (`/employee-automation`)

| Area | Behaviour |
|------|-----------|
| **Left index** | Search, Neue Person, batch export selection, employee list |
| **Right (no selection)** | Overview intro when employees exist; onboarding when empty |
| **No auto-select** | First employee no longer auto-opens on load |

### 2.3 Selected employee — Akte (requirements UI)

Structured around Tool-2 / B5.2 functional groups:

1. **Summary header** — counts: fehlende Pflichtangaben, offene Nachweise, fachlich prüfen  
2. **Bedingung 1 — Welche Person?** — Grundrolle + catalog reference  
3. **Bedingung 2 — Geltungsbereich** — DIN 77200-1/2, SDL, Projekt, objektbezogene Einweisung  
4. **Zusatzrollen** — overlays that **add** requirements; do not replace Grundrolle  
5. **Pflichtangaben** — Vorname, Nachname, Geburtsdatum, Eintritt, Bewacher-ID, Unternehmen, etc.  
6. **Pflichtnachweise** — 16 evidence groups (Arbeitsvertrag, §34a, Sachkunde, Datenschutz, …)  
7. **Unterweisungen / Schulungen** — person-specific status rows  
8. **Offene Punkte** — derived gaps  
9. **Generator hint** — link to Generator tab; doc count only  

### 2.4 Interaction model

| Before | After |
|--------|-------|
| Tabs: Akte \| Stammdaten bearbeiten \| Generator | Tabs: **Akte \| Generator** |
| Separate full Stammdaten tab | **Inline edit** — pencil / “Bearbeiten” on Akte sections opens compact `EmployeeForm` (`displayMode="master"`) below dossier |

### 2.5 Status vocabulary (conservative)

Allowed: `vorhanden`, `fehlt`, `beantragt`, `unvollständig`, `nicht lesbar`, `abgelaufen`, `nicht erforderlich`, `fachlich prüfen`, `vorbereitet`, `offen`.

Forbidden in UI: audit-ready, certified, DIN-compliant, released, automatically approved, Einsatzfreigabe erteilt.

### 2.6 Requirement derivation (`employee-file-requirements.ts`)

Display-only logic from existing `Employee` fields + role/overlay heuristics:

- Security-ish `roleId` → DIN / §34a / Sachkunde as **fachlich prüfen**  
- Ersthelfer / Brandschutz overlay (from `appointmentIds`) → matching evidence rows  
- `guardIDNumber` present → Bewacher-ID **vorbereitet** (Stammdaten, not upload)  
- `globalProps.companyName` → Unternehmen Pflichtangabe  
- No hard-coded DIN 77200-2 matrix  

---

## 3. Files Changed

### New — dashboard (`modules/00-dashboard/`)

| File | Purpose |
|------|---------|
| `CertificationOsModuleOverview.tsx` | Customer-facing V1 module overview; Mitarbeiterakte hub embed |
| `EmployeeFileDashboardHub.tsx` | Index + intro split for dashboard Mitarbeiterakte |
| `module-overview-data.ts` | Static V1 main areas and subtopic metadata |

### New — employee file (`modules/03-mitarbeiterakte-tool-2/employee-file/`)

| File | Purpose |
|------|---------|
| `employee-file-requirements.ts` | Pflichtangaben, scope, Nachweise, Unterweisungen, open issues derivation |
| `EmployeeFileDossierView.tsx` | Requirements-based Akte read UI |
| `EmployeeFileStatusBadge.tsx` | Conservative status chips |
| `EmployeeFileIndex.tsx` | Left sidebar index (search, export, list) |
| `EmployeeFileOverviewIntro.tsx` | Right-panel overview intro (no duplicate list) |
| `EmployeeFileOnboardingPanel.tsx` | Empty-state Personal erfassen |
| `EmployeeFileWorkspaceLayout.tsx` | Master-detail workspace shell |
| `employee-display-labels.ts` | DE labels for roles / Zusatzbestellungen |
| `CompanyExportSettingsPanel.tsx` | Firmendaten on `/uploads` |
| `EmployeeFileDossierHeader.tsx` | Alternate dossier header (unused in main flow) |
| `EmployeeFileDossierZones.tsx` | Accordion zones prototype (unused in main flow) |

### Modified — employee file / app shell

| File | Change |
|------|--------|
| `EmployeeAutomationPage.tsx` | Master-detail, overview vs person, Akte/Generator tabs, inline edit |
| `EmployeeForm.tsx` | `displayMode` master/documents; DE labels (EC-09 field mapping unchanged) |
| `employee-queue-storage.ts` | Global export settings helpers (existing persistence pattern) |
| `EmployeeFileWorkspaceNotice.tsx` | Transitional notice copy |
| `index.ts` | Barrel exports |
| `roles/admin/UploadsPage.tsx` | CompanyExportSettingsPanel mount |
| `app/page.tsx` | Certification OS dashboard |
| `app/globals.css` | Dashboard styling |
| `components/layout/Navbar.tsx` | Nav alignment |
| `public/assets/*` | Logo assets |

### Documentation

| File | Purpose |
|------|---------|
| `docs/03-controls/B8_2_REQUIREMENTS_BASED_EMPLOYEE_FILE_AKTE_UI_IMPLEMENTATION_REPORT.md` | This report |

---

## 4. Confirmations

| Requirement | Confirmed |
|-------------|-----------|
| Build PASS | **Yes** — `npm run build` in `apps/certification-os` |
| EC-09 generator untouched | **Yes** — no diff on `app/actions/generate-employee-docs.ts`, `employee-generator/generate-employee-docs.ts` |
| `EmployeeProfileSectionShell.tsx` untouched | **Yes** |
| No evidence upload slice | **Yes** — Nachweise display-only |
| No DIN rule engine | **Yes** — heuristics + **fachlich prüfen** only |
| No new DB / persistence model | **Yes** — `employee-queue-storage` only |
| Generator tab preserved | **Yes** — `EmployeeForm` `displayMode="documents"` unchanged |

---

## 5. Manual Smoke Checklist

- [ ] `/` → Mitarbeiterakte → left index visible; no Aktenstruktur table on overview  
- [ ] Select employee → `/employee-automation?id=…` → Akte shows Bedingung 1/2, Pflichtangaben, Nachweise  
- [ ] Pencil / Bearbeiten → inline Stammdaten form; save updates Akte counts  
- [ ] Generator tab → doc chips + ZIP export still works (EC-09)  
- [ ] `/uploads` → Firmendaten panel saves to localStorage  

---

## 6. Next Focus (B8.3 — not started)

**Role/scope requirement mapping:**

```
Grundrolle + Zusatzrolle + DIN/SDL/Projektkontext
  → required fields
  → required evidence
  → open points
```

Constraints carry forward: working UI, conservative statuses, no final DIN engine, no upload slice yet.

---

## 7. Related Controls

- B5.2 Employee File Object Boundary — functional groups source  
- B8.0 / B8.1 — dashboard module overview prerequisite  
- EC-09 — generator regression gate (unchanged)
