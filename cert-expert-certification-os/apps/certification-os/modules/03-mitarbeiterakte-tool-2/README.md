# 03-mitarbeiterakte-tool-2

## Purpose

**Active build scope** for Tool 2: employee file (Mitarbeiterakte), generator, evidence, readiness, roles, project/SDL preparation, document output, acceptance tests, and controls.

Tool 2 is the person-level Nachweis- and Freigabevorbereitungs-Engine inside the future Certification OS.

## What belongs here

- Employee create / edit / save / reopen
- Standardpersonalakte and controlled document generation
- Evidence status and open document list (offene Unterlagen)
- Blocker and readiness rules (grün/gelb/rot/grau)
- Primary roles and overlay roles (Zusatzrollen)
- Minimal project/SDL reference for release preparation
- Document output packages
- Acceptance tests and hard controls

## What must not be built here

- Dashboard, Unternehmensakte, full Projektakte, QM-/Auditordner, LMS
- CEKS, Bot-Packs, pricing
- Automatic employee/project/SDL release or audit readiness without evidence
- Final UI design or deep database architecture
- Unchecked green status or hidden assumptions

## Status

**Active** — sole implementation scope for current development phase.

In Phase 1 the entire tree is **scaffold + README only** (no migrated code). Legacy runtime remains in `bots/legacy_tools/...`.

## Submodule classification

| Submodule | Classification | Phase 1 |
|-----------|----------------|---------|
| `employee-file/` | Active implementation area | README only |
| `employee-generator/` | Active implementation area | README only |
| `roles/` | Active implementation area | README only |
| `document-output/` | Active implementation area | README only |
| `acceptance-tests/` | Active documentation area | README only |
| `controls/` | Active documentation area | README only |
| `evidence/` | **Boundary-only placeholder** | README only — no logic |
| `readiness-rules/` | **Boundary-only placeholder** | README only — no logic |
| `project-link/` | **Boundary-only placeholder** | README only — no logic |

## Tool 2 connection

This module is Tool 2. Boundary-only submodules define future integration points only; they must not receive business logic until their approved build phase (B4/B6/B7).

## Legacy source

Existing implementation: `bots/legacy_tools/existing_tools_systems/document_creater_tool_employee_file_creater_tool1_2/`

See `docs/01-tool-2-handover/EXISTING_CODE_MAPPING.md` before migration.
