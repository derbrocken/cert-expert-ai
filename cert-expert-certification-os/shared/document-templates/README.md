# document-templates

## Purpose

Shared DOCX/blueprint template storage metadata.

## What belongs here

- Future: template category definitions, shared standard models metadata
- **Phase 1:** README only — no code copied here

## What must not be built here

- Tool 2 employee-specific generator logic
- **Tool 1 legacy code** — must remain in `bots/legacy_tools/.../document_creater_tool_employee_file_creater_tool1_2/` until a separate split gate

## Tool 1 separation (Phase 1)

Tool 1 (`model-creator`, `send-model-entries`, `standard-models` API) is **not moved** into this folder. Document dependency only: Tool 2 uses the same legacy UploadThing instance for `roles/` and `appointments/` templates via `/api/templates` and `/api/uploads`.

## Status

**Passive**
> This module is visible as part of the future Cert-Expert Certification OS structure.
> Do not implement functionality here yet.
> Only create minimal interfaces/placeholders if required by Tool 2.
> Current active build scope: `apps/certification-os/modules/03-mitarbeiterakte-tool-2`.

## Tool 2 connection

Tool 2 role/appointment templates may live here or in module storage.
