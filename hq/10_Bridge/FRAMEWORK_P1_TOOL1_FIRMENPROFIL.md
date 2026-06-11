# P1 — Tool 1 ans zentrale Firmen-Profil (Plan-Einseiter)

> **Teil von:** `FRAMEWORK_TOOL1_TOOL2_UPLOAD.md` (P0 locked, 2026-06-11). Dies ist **P1**, eigener Bau-Pass, eigenes Gate.
> **Ziel (D2):** Tool 1 (Document Creator) zieht Firma/Adresse/Logo/Doc-Meta **automatisch aus demselben zentralen Profil wie Tool 2** (`CompanyExportSettings`) — manueller Override bleibt. Macht Tool 1 + Tool 2 über die Firma deckungsgleich.
> **Lektion:** Planung zuerst. Kein Bug-Fix + Umbau mischen. Reines additives Wiring.

---

## 1. IST (P1-relevant)
- Tool 1 (`/model-creator`, `DocumentForm.tsx`) tippt **Firma/Adresse/Logo jedes Mal manuell** neu ein; nichts wird gespeichert (`send-model-entries.ts` liest Logo als File aus FormData).
- Tool 2 nutzt das **zentrale Profil** `CompanyExportSettings` (DB) — geladen via `fetchExportSettingsAction(slug)` → `GlobalProperties` (inkl. `companyLogo` base64 aus S3). Firmenliste via `fetchCompaniesAction()`.
- **Beide Profile sind dasselbe Konzept — Tool 1 zapft es nur nicht an.**

## 2. SOLL (P1)
- Tool 1 bekommt oben einen **Firmen-Auswahl-Dropdown** (Quelle: `fetchCompaniesAction()`).
- Firma gewählt → Felder **vorausgefüllt** aus dem Profil, **sichtbar + überschreibbar**:
  - `companyName` → Firmenname
  - `companyAddress` → Vollständige Adresszeile (`companyAddressLine`)
  - `documentVersion` → Dokumentversion · `documentDate` → Dokumentdatum
  - `createdBy` → Erstellt von · `approvedBy` → Freigegeben von
  - `companyLogo` (base64) → **Logo-Vorschau** (Profil-Logo wird verwendet, sofern kein neues hochgeladen)
- **Manueller Override bleibt überall:** geänderte Felder gewinnen; Logo-Upload überschreibt Profil-Logo für diesen Lauf.
- Split-Felder Straße/PLZ/Stadt/Land (in Tool 1, **nicht** im zentralen Profil) bleiben **manuell** — kein erfundenes Mapping. *(Strukturierte Adresse = späteres optionales Profil-Delta, NICHT P1.)*

## 3. UMSETZUNG (additiv, Write-Set klein)
- **`DocumentForm.tsx`:** Firmen-Dropdown + `onChange` → `fetchExportSettingsAction(slug)` (bzw. Client-Helper `loadGlobalExportSettings`) → `setValue(...)` für die o. g. Felder; `selectedCompanySlug` im State; Logo-Vorschau aus Profil. Override = normales Tippen/Upload.
- **`send-model-entries.ts`:** akzeptiert zusätzlich `companySlug` aus FormData. **Logo-Auflösung:** (a) manueller Upload vorhanden → den nehmen; (b) sonst `companySlug` gesetzt → `getExportSettings(slug).companyLogo` (base64) → Buffer dekodieren → wie bisher einbetten; (c) sonst kein Logo. **Textfelder bleiben Formularwerte** (schon aus Profil vorbefüllt, überschreibbar) — keine Server-Doppelung.
- **Keine neue Action, kein Schema-Change** — nur bestehende `fetchCompaniesAction`/`fetchExportSettingsAction`/`getExportSettings` wiederverwenden.
- Pure Logik (Profil→Tool-1-Feld-Mapping, Logo-Auflösungs-Reihenfolge) in kleinen testbaren Helper ziehen.

## 4. DoD
- `tsc` 0 · `next build` grün · neue Unit-Tests grün (Mapping + Logo-Auflösungs-Reihenfolge a/b/c) · Tool-2-Suite 160/160 unberührt.
- **EC-09:** Tool-2-Generator/Employee-Flow nicht berührt (Write-Set = nur Tool-1-Dateien + ggf. Helper). EC-10: keine Freigabe-Aussage. Keine erfundene Normpflicht (reines Doc-Wiring).
- **Browser-Abnahme Mark:** Firma wählen → Felder + Logo vorausgefüllt → generieren → ZIP-Doks tragen Firmenname/Adresse/Logo aus dem Profil. Override testen (Feld ändern, eigenes Logo hochladen).

## 5. Gate
→ Mark: P1-Plan ok? Dann EIN Bau-Pass. (P2 Company-Tally + P3 editierbare Sammlungen danach, je eigener Plan.)
