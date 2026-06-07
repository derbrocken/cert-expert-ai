# roles

## Purpose

Grundrollen and Zusatzrollen (overlay roles / appointments): role definitions, triggered evidence requirements, SMA/Ersthelfer/Führungskraft etc.

## What belongs here

- Role and overlay role registry (replacing demo `software-engineer` roles with Cert-Expert SMA roles)
- Per-role document packages
- Zusatzrolle → additional evidence/prüf requirements

## What must not be built here

- Permission/rechte system
- Full CEKS qualification matrix implementation
- LMS training catalog

## Status

**Active**

## Tool 2 connection

Maps from legacy: `lib/data/employee-config.ts` (static demo data), dynamic roles from `app/api/templates/route.ts`, appointments as overlay roles.

**Known issues:** training select-all/deselect-all; auto-select resets on edit; individual training dates not modeled.
