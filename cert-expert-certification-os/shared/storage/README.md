# storage

## Purpose

Storage adapter boundary for uploads and generated outputs.

## What belongs here

- `storage-adapter.ts` — TypeScript **interface + throwing stub only**
- Future adapters (not created in Phase 1): local, UploadThing, Hetzner

## What must not be built here

- UploadThing wiring
- Hetzner Object Storage wiring
- Persistence provider implementation
- Full infrastructure architecture or backend decisions
- Calls to `createStorageAdapter()` from application code (stub throws)

## Status

**Passive (interface scaffold — unwired)**
> This module is visible as part of the future Cert-Expert Certification OS structure.
> Do not implement functionality here yet.
> Only create minimal interfaces/placeholders if required by Tool 2.
> Current active build scope: `apps/certification-os/modules/03-mitarbeiterakte-tool-2`.

## Tool 2 connection

Tool 2 uploads and ZIP output use StorageAdapter — not hard-coded paths.
