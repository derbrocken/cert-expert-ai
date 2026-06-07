# Tool 2 Hard Controls (C-01–C-10)

Source: `TOOL_2_DEVELOPER_HANDOVER_BRIEF_V1` / `TOOL_2_EXECUTION_CONTROL_SHEET_V1`

| ID | Rule |
|----|------|
| C-01 | **Kein ungeprüftes Grün** — green only with defined role, context, evidence status, and review/begründung |
| C-02 | **Rot übersteuert** — critical blockers override yellow and green in affected context |
| C-03 | **Gelb ist nicht bestanden** — yellow means open, nachzureichen, or fachlich zu prüfen |
| C-04 | **Grau nur mit Kontext** — "nicht relevant" requires role/SDL/project justification |
| C-05 | **Freigabe nur kontextbezogen** — no global release from single employee status |
| C-06 | **Keine Auditfähigkeit behaupten** — show impact only; no unchecked global audit-ready claim |
| C-07 | **Schulung nur personenbezogen** — no LMS, no full training calendar |
| C-08 | **Projektakte nur Schnittstelle** — project reference for employee release only |
| C-09 | **Stabilisierung schützen** — regression-test existing generator before/after changes |
| C-10 | **Keine Architektur erzwingen** — no DB/hosting/permission/UI decisions from handover alone |

## Negativtests (N-01–N-07)

Must fail if system shows green/release/audit-ready incorrectly. See Handover Brief section 4.

## Implementation

Enforced in `apps/certification-os/modules/03-mitarbeiterakte-tool-2/readiness-rules/` and `controls/` after migration Phase 6.
