# 00-dashboard

## Purpose

Future central control surface for audit status, open points, deadlines, measures, and readiness.

## What belongs here

ZKM/Maßnahmen, Prüfvermerke, audit-readiness status, offene Punkte, deadlines — as dashboard-controlled management logic.

## What must not be built here

Implement dashboard UI, KPIs, or ZKM workflow now. Do not create a separate top-level ZKM module.

## Status

**Passive**
> This module is visible as part of the future Cert-Expert Certification OS structure.
> Do not implement functionality here yet.
> Only create minimal interfaces/placeholders if required by Tool 2.
> Current active build scope: `apps/certification-os/modules/03-mitarbeiterakte-tool-2`.

## Tool 2 connection

Tool 2 will later supply per-employee status, blockers, and open evidence lists for dashboard aggregation.
