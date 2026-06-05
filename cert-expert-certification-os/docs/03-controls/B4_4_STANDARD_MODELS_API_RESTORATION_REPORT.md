# B4.4 — Standard Models API Restoration

**Gate:** B4.4 — Minimal Tool 1 Upload/Admin Restoration  
**Status:** **CLOSED**  
**Final decision:** **PASS** — `GET /api/standard-models` restored  
**Date:** 2026-06-05  
**Branch:** `b3-tool2-migration`  
**App root:** `cert-expert-certification-os/apps/certification-os/`  
**Prerequisite:** B4.3 closed (`B4_3_LEGACY_TOOL_INTEGRATION_READINESS_REPORT.md`)

---

## 1. Root cause confirmation

| Item | Finding |
|------|---------|
| **Blocker** | `GET /api/standard-models` route absent in migrated Certification OS app |
| **Symptom (pre-B4.4)** | HTTP **404**; Upload Manager set `standardModelsApiAvailable = false`; Standard Models tab disabled |
| **B4.1 mitigation** | Tool 2 roles/appointments decoupled — no page-wide failure |
| **Underlying storage** | Already Hetzner-ready — `VALID_CATEGORIES` includes `standard-models`; POST/DELETE upload APIs accept category |
| **Fix (B4.4)** | Add Hetzner-backed list route mirroring legacy logic with `template-storage` imports |

**Conclusion:** Single missing read API — not a storage or UI architecture defect.

---

## 2. Files changed

| File | Change |
|------|--------|
| `app/api/standard-models/route.ts` | **Added** — `GET` lists `standard-models/` objects from Hetzner via `listTemplateFiles()` + `parseCustomId()` |
| `docs/03-controls/B4_4_STANDARD_MODELS_API_RESTORATION_REPORT.md` | **Added** — this report |

**Not changed (by design):**

- `UploadsPage.tsx` — existing fetch/UI logic sufficient once API returns 200
- `send-model-entries.ts`, `model-creator/` — not migrated
- `.env.local`, secrets, unrelated HQ/legacy files

---

## 3. API response shape

**Endpoint:** `GET /api/standard-models`

**Success (200):**

```json
{
  "folders": [
    {
      "id": "folder-slug",
      "name": "Folder Slug",
      "documents": [
        {
          "id": "folder-slug-document-name",
          "name": "Document Name",
          "fileName": "document-name.docx"
        }
      ]
    }
  ]
}
```

**Matches:** Legacy route + `UploadsPage.tsx` expectation (`modelsData.folders`).

**Storage not configured (503):**

```json
{
  "error": "Template storage not configured",
  "detail": "Set HETZNER_S3_KEY, HETZNER_S3_SECRET, HETZNER_BUCKET_NAME, HETZNER_S3_ENDPOINT, and HETZNER_S3_REGION in .env.local."
}
```

**Server error (500):**

```json
{ "error": "Failed to list standard models" }
```

**Object key filter:** `standard-models/{folderName}/{fileName}.docx/{timestamp}` (and `.folder` placeholders). Same prefix convention as roles/appointments.

---

## 4. Test results

Runtime verification against local app (`127.0.0.1:3001`, Hetzner configured via `.env.local` — credentials not printed).

| # | Test | Result | Evidence |
|---|------|--------|----------|
| 1 | `GET /api/standard-models` not 404 | **PASS** | HTTP **200** |
| 2 | Response shape `{ folders: [] }` | **PASS** | `hasFoldersKey: true`; empty list valid (no `standard-models/` objects in bucket yet) |
| 3 | `GET /api/templates` regression | **PASS** | HTTP **200**; roles: **1**, appointments: **1** |
| 4 | Upload Manager loads without Tool 2 toast | **PASS** | `noFailedToast: true` |
| 5 | Roles section still listed | **PASS** | Din 77200 role visible |
| 6 | Appointments section still listed | **PASS** | Unterweisungen visible |
| 7 | Standard Models tab no longer Tool 1-blocked | **PASS** | `tool1BlockedMessage: false`; `standardModelsApiEnabled: true` |
| 8 | Standard Models empty state (API enabled) | **PASS** | Shows enabled empty state (`No standard models yet…`) — not disabled Tool 1 message |
| 9 | Fake templates / fake models | **None** | List-only test; empty bucket prefix |
| 10 | Secrets printed/committed | **No** | `.env.local` gitignored |
| 11 | `npm run build` | **PASS** | 11 routes; `/api/standard-models` registered |

**Note:** Bucket currently has **zero** `standard-models/` objects. Empty `folders: []` is expected and correct. Upload/folder-create for `standard-models` was already implemented in B3.5/B4.1 storage layer — not re-tested in B4.4 (list API was the sole blocker).

---

## 5. Build result

```
Route (app)
├ ƒ /api/standard-models    ← new
├ ƒ /api/templates
├ ƒ /api/uploads
├ ƒ /api/uploads/folder
…
```

| Check | Result |
|-------|--------|
| TypeScript | **PASS** |
| Route count | **11** (was 10 pre-B4.4) |
| Build errors | **None** |

---

## 6. Upload Manager readiness (post-B4.4)

| Capability | Status |
|------------|--------|
| List roles (Hetzner) | **Ready** (B4.1) |
| List appointments (Hetzner) | **Ready** (B4.1) |
| List standard models (Hetzner) | **Ready** (B4.4) |
| Create standard-model folder | **Ready** (API existed; UI enabled when list API 200) |
| Upload DOCX to standard-models | **Ready** (API existed; UI enabled) |
| Tool 1 Model Creator `/model-creator` | **Not ready** — out of B4.4 scope |
| Tool 1 ZIP generation | **Not ready** — requires B4.5 (`send-model-entries` Hetzner migration) |

---

## 7. Open controls carried forward

| Control | Status |
|---------|--------|
| Tool 1 Model Creator workflow | **OPEN** — B4.5 optional slice |
| `send-model-entries` on UploadThing URLs | **OPEN** — legacy only |
| Empty `standard-models/` bucket prefix | **OPEN (operational)** — upload real DOCX via Upload Manager when needed |
| B5 Tool 2 Mitarbeiterakte redesign | **OPEN** — separate gate |
| EC-09 / T2-BUG-09 / `logoFile` | **Unchanged** — carried from B4.2 |
| Upload Manager empty-state copy (legacy Tool 1 message when API down) | **Acceptable** — fallback only on 503/404 |

**Closed by B4.4:**

| Control | Status |
|---------|--------|
| `GET /api/standard-models` missing | **Closed** |
| Standard Models Upload Manager tab API-blocked | **Closed** |
| B4.1 open control: Standard Models upload admin | **Closed** (list path) |

---

## 8. B4.4 gate compliance

| Check | Result |
|-------|--------|
| Minimal GET route only | **Yes** |
| Hetzner `template-storage` pattern | **Yes** |
| No Tool 1 model-creator migration | **Yes** |
| No `send-model-entries` migration | **Yes** |
| No fake templates/models | **Yes** |
| No secrets committed | **Yes** |
| Tool 2 regression checked | **Yes** |

---

## 9. Gate recommendation

### **A) Close B4.4** ✅ Recommended

**Rationale:** List API restored; Upload Manager Standard Models section loads with API enabled; Tool 2 roles/appointments unaffected; build passes.

**Optional follow-up (not required to close B4.4):**

- **B4.5** — Minimal Tool 1 Model Creator restoration (`model-creator` + Hetzner `send-model-entries`)
- **B5.1** — Tool 2 Mitarbeiterakte core (independent track)

---

### B) Keep B4.4 open

**Not recommended.** No blocking runtime defect observed in scoped tests.

---

## 10. Related gates

| Gate | Report |
|------|--------|
| B4.3 | `B4_3_LEGACY_TOOL_INTEGRATION_READINESS_REPORT.md` |
| B4.1 | `B4_1_UPLOAD_ADMIN_COMPLETION_REPORT.md` |
| B3.5 | `B3_5_STORAGE_ACTIVATION_RETEST_REPORT.md` |
