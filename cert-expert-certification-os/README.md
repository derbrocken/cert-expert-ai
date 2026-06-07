# Cert-Expert Certification OS

High-level scaffold for the future Cert-Expert Certification OS. This repository area defines **module boundaries and folder map** — not a full product implementation.

## Purpose

Provide a visible, reviewable structure so **Tool 2 (Mitarbeiterakte)** can be developed as the first active module inside the future Certification OS without becoming an integration dead end.

## Structure

```
cert-expert-certification-os/
├── apps/certification-os/              # Application shell + modules
│   └── modules/                        # Domain modules
├── shared/                             # Cross-module shared boundaries
└── docs/                               # System context, handover, acceptance, controls
```

## Active vs passive

| Area | Status |
|------|--------|
| `apps/certification-os/apps/certification-os/modules/03-mitarbeiterakte-tool-2/` | **Active** — only current build scope |
| All other `apps/certification-os/modules/*` | **Passive** — placeholders for future integration |
| `shared/*` | **Passive** — minimal interfaces only where Tool 2 requires them |
| `apps/certification-os/` | **Passive** — application shell placeholder |

## What must not be built here (yet)

- Full Dashboard, Unternehmensakte, Projektakte, QM-/Auditordner, LMS
- CEKS, Bot-Packs, pricing logic
- Final UI/product design
- Deep database model or final software architecture
- Separate top-level ZKM module (ZKM/Maßnahmen/Prüfvermerke live under `00-dashboard`)

## Tool 2 connection

Tool 2 focuses on employee file, generator, evidence, readiness, roles, project/SDL preparation, document output, acceptance tests, and controls. Outputs must remain connectable later to Dashboard, Projektakte, shared storage, audit log, and common status — without building those modules now.

## Next steps (after scaffold review)

1. Review `docs/01-tool-2-handover/EXISTING_CODE_MAPPING.md`
2. Review `docs/01-tool-2-handover/MIGRATION_PROPOSAL.md`
3. Approve migration before moving legacy Tool 2 code into this scaffold

## Reference documents

Source artefacts (OneDrive / DFSS):

- `CERTIFICATION_OS_CONTEXT_AND_TOOL_2_INTEGRATION_BOUNDARY_V1`
- `TOOL_2_BUILD_SCAFFOLD_AND_MODULE_BOUNDARY_V1`
- `TOOL_2_DEVELOPER_HANDOVER_BRIEF_V1`
- `TOOL_2_EXECUTION_CONTROL_SHEET_V1`
- `TOOL_2_DEVELOPER_ACCEPTANCE_PREPARATION_PACK_V1`
