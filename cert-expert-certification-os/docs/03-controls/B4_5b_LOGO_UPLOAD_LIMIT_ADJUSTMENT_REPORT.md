# B4.5b — Logo Upload Limit Adjustment

**Gate:** B4.5b — Practical logo handling (limit increase)  
**Status:** **CLOSED**  
**Decision:** **PASS** — logo upload limit raised from 5 MB to 10 MB consistently  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Prerequisite:** B4.5a (5 MB limit + bodySizeLimit)

---

## 1. Context

B4.5a introduced a shared 5 MB logo limit with client/server validation and `serverActions.bodySizeLimit: "5mb"`. Local smoke test passed; practical use showed 5 MB is too low for some real logo/image files.

**Decision:** Increase practical limit to **10 MB** without changing upload architecture.

---

## 2. Files changed

| File | Change |
|------|--------|
| `lib/constants/logo-upload.ts` | `LOGO_MAX_BYTES` → `10 * 1024 * 1024`; `LOGO_MAX_SIZE_LABEL` → `"10 MB"` |
| `next.config.ts` | `serverActions.bodySizeLimit` → `"10mb"` |

**Unchanged (consume shared constants):**

- `components/document/DocumentForm.tsx` — client validation, dropzone `maxSize`, UI copy
- `app/actions/send-model-entries.ts` — server-side guard and error message
- `components/ui/FileDropzone.tsx` — generic; limit passed via prop

---

## 3. Validation alignment

| Layer | Message / behavior |
|-------|-------------------|
| Dropzone | Rejects via `maxSize={LOGO_MAX_BYTES}`; reject copy uses computed MB |
| Client submit | `logoSizeErrorMessage()` → `Logo must be 10 MB or smaller (selected: X MB).` |
| Server action | `Logo file exceeds 10 MB limit` if bypassed |
| Next.js body | `bodySizeLimit: "10mb"` |

---

## 4. Build result

**Command:** `npm run build` (from `apps/certification-os/`)  
**Result:** **PASS** (exit 0)  
**Next.js:** 16.1.1 (Turbopack)  
**Notes:** TypeScript check and static generation completed; `serverActions.bodySizeLimit` experiment active.

---

## 5. Observations

- No compression, resizing, background jobs, or new storage logic added.
- B5 not started.
- Server restart required after deploy for `next.config.ts` change to take effect.
- Logos &gt; 10 MB remain rejected by design with aligned messages.

---

## 6. Out of scope (explicit)

- Tool 1 / Tool 2 functional redesign
- Image compression or upload architecture changes
- B5 work
