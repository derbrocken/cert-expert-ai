# document-output

## Purpose

Prüfbare Ausgabe: Standardpersonalakte, Nachweisübersicht, offene Unterlagen, ZIP bundles for internal use and future audit folder handoff.

## What belongs here

- ZIP structure per employee (`Name/Role/docs`, `Name/Appointment/docs`)
- Output storage via `shared/storage/` adapter (not hard-coded paths)
- Combined document deduplication checks

## What must not be built here

- Final DMS or QM-Auditordner
- Automatic audit package assembly

## Status

**Active**

## Tool 2 connection

Maps from legacy: `generate-employee-docs.ts` JSZip output, `app/api/preview/route.ts` (temporary preview).

**Known issues:** duplicate content in combined instruction documents; formatting inconsistencies.
