# readiness-rules

## Purpose

Ampel-, Blocker- and Freigabevorbereitungslogik: derive grün/gelb/rot/grau from Pflichtfelder, evidence, roles, and project/SDL context. No unchecked green.

## What belongs here

- Readiness evaluation per employee (and per SDL/project context when linked)
- Blocker rules (rot overrides gelb/grün)
- `review_required` flag when fachliche Prüfung pending
- Audit-readiness **impact** (person-level only — not global auditfähig)

## What must not be built here

- Automatic employee/project/SDL release
- Global audit readiness claim
- Dashboard aggregation

## Status

**Boundary-only placeholder** — README and folder map only. **No business logic, no runtime code, no ampel UI.**

Implementation is deferred to a later approved phase (target: B6). Legacy Tool 2 has no readiness evaluator today.

## What is allowed now

- This README and control references (`docs/03-controls/HARD_CONTROLS.md`)
- Mapping entries in handover docs

## What is not allowed now

- Readiness/ampel evaluation code
- Blocker engine
- Audit-readiness impact UI
- Any TypeScript/React implementation in this folder

## Tool 2 connection

Governed by `TOOL_2_EXECUTION_CONTROL_SHEET_V1` EC-05, EC-08, EC-10 and C-01–C-06 — **future**. Do not implement until explicit B6 gate.
