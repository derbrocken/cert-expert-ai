# employee-generator

## Purpose

Mitarbeiterakten-Generator: Standardpersonalakte and vorausgefüllte Pflichtdokumente from DOCX templates with controlled placeholder substitution.

## What belongs here

- Template fetch and placeholder mapping
- Role and appointment (overlay) document selection
- `easy-template-x` processing pipeline
- Legacy→canonical placeholder alias layer (see `shared/placeholders/TOOL_2_PLACEHOLDERS.md`)

## What must not be built here

- Evidence upload/status (→ `evidence/`)
- Template admin UI for unrelated Tool 1 standard models (legacy only until split)
- Free customer certificate/training creation outside defined packages

## Status

**Active**

## Tool 2 connection

Maps from legacy: `app/actions/generate-employee-docs.ts`, template APIs, `lib/data/employee-config.ts`.

**Known issues:** duplicate content in combined instruction documents; multiple SMA in one document; document formatting.
