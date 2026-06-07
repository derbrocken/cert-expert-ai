# Tool 2 Acceptance Baseline

Source: `TOOL_2_EXECUTION_CONTROL_SHEET_V1` / Developer Handover Brief

## Execution Control functions (EC-01–EC-10)

| ID | Kernfunktion | Pflichttest |
|----|--------------|-------------|
| EC-01 | Mitarbeiter neu anlegen und speichern | T2-AT-01 / T2-ACC-01 |
| EC-02 | Pflichtfelder prüfen | T2-ACC-02 |
| EC-03 | Nachweise hochladen/markieren | T2-ACC-03 |
| EC-04 | Offene-Unterlagen-Liste | T2-ACC-04 |
| EC-05 | Blocker / Rot | T2-ACC-04, N-01–N-02 |
| EC-06 | Grundrolle + Zusatzrolle | T2-ACC-08–09 |
| EC-07 | SDL-/Projektfreigabe vorbereiten | T2-ACC-10–11 |
| EC-08 | Audit-Readiness-Auswirkung | T2-ACC-15 |
| EC-09 | Standardpersonalakte erzeugen | T2-ACC-13–14 |
| EC-10 | Keine ungeprüfte Freigabe/Auditfähigkeit | N-01–N-07, C-01–C-06 |

## Current legacy status (pre-migration)

| EC | Status | Notes |
|----|--------|-------|
| EC-01 | **Failed** | No persistence across reload |
| EC-02 | **Partial** | Zod validates form; no readiness ampel |
| EC-03 | **Not Started** | No evidence module |
| EC-04 | **Not Started** | |
| EC-05 | **Not Started** | |
| EC-06 | **Partial** | Roles/appointments exist; demo data only |
| EC-07 | **Not Started** | |
| EC-08 | **Not Started** | |
| EC-09 | **Implemented** | ZIP generation works |
| EC-10 | **Not Started** | No release/audit claims in UI yet |

Evidence tracking: `apps/certification-os/modules/03-mitarbeiterakte-tool-2/acceptance-tests/` (to be filled during B8).
