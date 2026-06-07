# Kickoff — Code-Track (zweiter Cowork-Chat)

**Zweck:** Dieser Cowork-Chat ist der **Code-Track** für die Certification OS (Tool 1, Tool 2, `/intern`, Upload Manager). Er **prüft/testet Code und koordiniert Cursor**. Der andere Cowork-Chat („Generalist") macht Architektur/HQ/Wissen — **nicht doppeln**.

## Zuerst lesen (Bridge = gemeinsamer Stand)
- ⭐ **`hq/10_Bridge/TOOL2_FAHRPLAN_DFSS.md` — DFSS-GOLD, der Bauplan. ZUERST.** Internes Tool, DFSS-Design als Bauquelle, Marks Direkt-in-die-Akte-Modifikation.
- `hq/10_Bridge/CONTEXT.md` — Endarchitektur + Entscheidungen
- `hq/10_Bridge/CODE_REVIEW.md` — bisheriges OS-Review
- `hq/10_Bridge/HANDOFF.md` — Briefkasten mit Cursor (inkl. DFSS-Hinweis)
- `knowledge/NORM_MATRIX_Mitarbeiternachweise_v2.md` + `knowledge/NORM_KLAUSEL_REGISTER_v1.md` — Norm-Logik (Slice 2 verdrahten)
- `hq/00_Dashboard/Master_Ordnungsplan.md`

## Das DFSS-Gold (existierende Spec — bauen, nicht neu erfinden)
Vollständiges Tool-2-Design liegt in OneDrive `QM/Strategie/` + `…/DFFS/`:
`TOOL_2_EMPLOYEE_FILE_FUNCTIONAL_DESIGN_V1`, `EMPLOYEE_FILE_READINESS_RULES_V1`, `EMPLOYEE_FILE_WORKSPACE_STRUCTURE_V1_1`, `CERT_EXPERT_MVP_SCOPE_BOUNDARY_V1`, `…DEVELOPER_BACKLOG/HANDOVER/BUILD_SCAFFOLD`. → Kern: Requirement→Evidence→**Readiness/Ampel** + **Pools** + **Mitarbeiterakten-Generator** (vorausgefüllt, markiert Fehlendes). **Intern zuerst, kein Portal.**

## Dein Scope
- **Repo:** `cert-expert-certification-os/apps/certification-os/` (Branch `main` — konsolidiert T-04, Port 3001).
- Tool 1 `/model-creator` · Tool 2 `/employee-automation` · neue Zentrale `/intern` · `/uploads`.
- **Du reviewst/testest**; **Cursor schreibt den Code**. Feedback an Cursor → `HANDOFF.md` („Von Claude an Cursor").
- **Nicht** `hq/` bearbeiten (gehört dem Generalist-Track).

## Guardrails
- **EC-09** (Person → Queue → Doc-Chips → ZIP) nicht brechen.
- Transitional: keine Freigabe-/Zertifizierungsaussage.
- Keine erfundenen Norm-Pflichten (Quelle = Norm-Matrix).
- Merge-Konflikte vermeiden: Code = Cursor; du prüfst + dokumentierst.

## Aktueller Plan (Cursor) + Marks Entscheidungen
Cursors 4-Slice-Plan „Interne Cert-Expert-Zentrale" (Kunde → Pool → Tools):
- **Route:** `/` = die Zentrale (`/intern` als Alias).
- **Erste Kunden:** Import aus `hq/03_Kundenprojekte/_registry.json` (gleiche Slugs).
- **Tool-2-Akte:** als einklappbare „Qualität"-Ansicht **behalten** (da steckt die Norm-Matrix) — Pool+Generator = Hauptflow.
- **Export:** Slice 1 = smarte Dateinamen `{Kunde}_{Person}_{Datum}.zip`; „Ordner merken" (FSA API) später.
- **Stammdaten pro Kunde gespeichert** (kein erneutes Bday/Eintritt-Tippen) = Kern-Win.

## Slices (ADHS-tauglich)
A Shell (`/intern` + Kunden-Switcher + 3 Tabs) · B Multi-Kunde-Speicher + Migration · C UX glatt (Pool-first) · D HQ-Links + Export-Ordner. **Nicht** jetzt: Kundenportal, Norm-Matrix-Verdrahtung, Server-Backend.

## Voraussetzung
Im neuen Cowork-Chat denselben Ordner freigeben: `/Users/marwanmahra/cert-expert-ai`.
