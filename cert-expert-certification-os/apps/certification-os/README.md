# apps/certification-os

## Purpose

Future application shell for the Cert-Expert Certification OS (web/desktop portal). Holds routing, app bootstrap, and module wiring when the full platform is built.

## What belongs here

- Application entry point (e.g. Next.js app root)
- `modules/` — all Certification OS domain modules (see subfolder READMEs)
- Module registration and navigation shell
- Environment and deployment configuration (later)

## What must not be built here

- Domain logic for Dashboard, Unternehmensakte, Projektakte, or QM modules
- Tool 2 business rules (belong in `apps/certification-os/modules/03-mitarbeiterakte-tool-2/`)
- Final UI design or product chrome

## Status

**Passive** — scaffold placeholder only.

> This module is visible as part of the future Cert-Expert Certification OS structure.
> Do not implement functionality here yet.
> Only create minimal interfaces/placeholders if required by Tool 2.
> Current active build scope: `apps/certification-os/modules/03-mitarbeiterakte-tool-2`.

## Tool 2 connection

When active, Tool 2 routes/pages will mount under this app shell. Until migration is approved, legacy Tool 2 code remains at `bots/legacy_tools/.../document_creater_tool_employee_file_creater_tool1_2/`.
