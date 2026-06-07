# project-link

## Purpose

Minimal Schnittstelle zur Projektakte: Projekt-ID, SDL-Bezug, Objekt-/Auftragsbezug as reference context for employee release preparation.

## What belongs here

- Project/SDL assignment fields on employee or batch
- Context-scoped readiness (freigabe only for defined SDL/project)
- Reference IDs only — no Projektakte data duplication

## What must not be built here

- Full Projektakte
- ODA/EK/SK/GBU generation
- SDL management system

## Status

**Boundary-only placeholder** — README and folder map only. **No business logic, no runtime code, no SDL/project fields.**

Implementation is deferred to a later approved phase (target: B7). Legacy Tool 2 has no project/SDL link today.

## What is allowed now

- This README
- Placeholder names reserved in `shared/placeholders/TOOL_2_PLACEHOLDERS.md` (documentation only)

## What is not allowed now

- Projekt-ID / SDL input fields
- Context-scoped readiness
- Projektakte integration
- Any TypeScript/React implementation in this folder

## Tool 2 connection

Required for T2-ACC-10, T2-ACC-11, EC-07 — **future**. Do not implement until explicit B7 gate.
