# evidence

## Purpose

Nachweislogik: evidence upload/mark, status (vorhanden/fehlt/abgelaufen/fachlich zu prüfen/nicht relevant), and offene Unterlagen list generation.

## What belongs here

- Evidence types per role and overlay role
- Upload or manual status marking
- Open document list with traceable cause
- Validity/expiry awareness

## What must not be built here

- Automatic norm interpretation without Fachreview
- ZKM/Maßnahmen workflow (→ future `00-dashboard/zkm-massnahmen/`)
- LMS or full training calendar

## Status

**Boundary-only placeholder** — README and folder map only. **No business logic, no runtime code, no UI.**

Implementation is deferred to a later approved phase (target: B4). Legacy Tool 2 has no evidence module today.

## What is allowed now

- This README and acceptance/control references
- Mapping entries in `docs/01-tool-2-handover/EXISTING_CODE_MAPPING.md`

## What is not allowed now

- Evidence upload or mark workflows
- Offene Unterlagen generation logic
- Any TypeScript/React implementation in this folder

## Tool 2 connection

Required for T2-ACC-03 through T2-ACC-07, EC-03, EC-04 — **future**. Do not implement until after Phase 1 review and explicit B4 gate.
