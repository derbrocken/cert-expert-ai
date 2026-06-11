# P3a — Editierbare Sammlungen: Datenmodell + Admin-CRUD (Bau-Einseiter)

> **Teil von:** `FRAMEWORK_P3_EDITIERBARE_SAMMLUNGEN.md` (Design-Gate locked, 2026-06-11). Dies ist **P3a**, erster von drei Bau-Pässen (P3a Daten+Admin → P3b Formular-Konsum → P3c Quellen-Zusammenführung). Eigenes Gate.
> **Lektion:** Planung zuerst, ein Zug, kein Bug+Umbau-Mischen.
> **Scope P3a:** NUR Datenmodell + Admin-CRUD im Upload-Manager. **Kein** Mitarbeiter-Formular-Konsum (= P3b), **keine** Generator-Änderung.

---

## 1. SOLL (P3a)
- Admin kann im Upload-Manager unter neuem Tab **„Sammlungen"** benannte Sammlungen **anlegen / bearbeiten / löschen**: Templates aus den vorhandenen Kategorien (`roles`/`appointments`/`standard-models`) picken, je Dok **Pflicht / optional-vorausgewählt / optional-aus** flaggen + `dateSource`.
- Die **3 Vordefinierten** erscheinen als **read-only Seeds** mit **„Klonen"** (erzeugt eine editierbare Custom-Kopie).
- **Global** (keine Firmen-Bindung in P3a).
- Mitarbeiter-Formular bleibt **unverändert** (Konsum erst P3b) — P3a ist reine Verwaltung.

## 2. DATENMODELL (additive Migration — Bestandsdaten unberührt)
Zwei neue Tabellen (`prisma/schema.prisma`), keine Änderung an bestehenden:
```prisma
model DocumentCollection {
  id          String   @id @default(cuid())
  name        String
  description String?
  isSeed      Boolean  @default(false)   // die 3 Predefined
  seedKey     String?  @unique           // "sicherheitsmitarbeiter" | "fuehrungskraft" | "buerokraft"
  items       DocumentCollectionItem[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model DocumentCollectionItem {
  id                  String   @id @default(cuid())
  collectionId        String
  collection          DocumentCollection @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  templateLogicalPath String?            // "roles/<slug>/<file>.docx" (null = Seed-Posten ohne Vorlage)
  label               String
  inclusion           String   @default("optional-on")  // "mandatory" | "optional-on" | "optional-off"
  dateSource          String   @default("startDate")     // "startDate" | "manual"
  clauseId            String?            // aus Register, soweit normgestützt
  templateMissing     Boolean  @default(false)
  sortOrder           Int      @default(0)
}
```
- **Migration:** `db push` additiv (nur neue Tabellen) → **kein** Backfill/Datenverlust. DB-Backup beim Deploy wie üblich.
- **Per-Firma-Scope** (DP3.2 später): optionales `companySlug String?` kommt in einer Folgephase — **nicht** P3a.

## 3. SEED DER 3 VORDEFINIERTEN
- Einmaliges, **idempotentes** Seeding (`isSeed=true`, `seedKey`): Items aus dem bestehenden Katalog (`SET_KATEGORIE_DEFS` + `coreDocsForSetKategorie`) ableiten — `label`/`clauseId`/`dateSource`/`templateMissing` übernehmen; `templateLogicalPath` wo bekannt, sonst `null`.
- **Single source bleibt** vorerst `vorlagen-set-catalog.ts` (Seeds spiegeln ihn). Echte Zusammenführung = P3c. **In P3a kein Umschreiben des Katalogs** (kein Verhalten an Tool 2 ändern).
- Seeds sind **read-only** in der UI; „Klonen" erzeugt `isSeed=false`-Kopie.

## 4. BACKEND
- **Repo** (`lib/document-collection-repository.ts`, neu): `listCollections()`, `getCollection(id)`, `createCollection(input)`, `updateCollection(id, input)`, `deleteCollection(id)` (Seeds nicht löschbar), `cloneCollection(id)`, `ensureSeedCollections()` (idempotent, beim Start wie `ensureCompaniesSeeded`).
- **Actions** (`app/actions/collection-actions.ts`, neu): dünne „use server"-Wrapper darüber.
- **Pure Validierung/Logik** (`lib/document-collection-model.ts`, neu, testbar): Input-Normalisierung, `inclusion`/`dateSource`-Whitelist, Seed-Schutz (kein Löschen/Editieren), Klon-Transform. → Unit-Tests.

## 5. ADMIN-UI
- Neuer Tab **„Sammlungen"** in `UploadsPage.tsx` (bestehende Tab-Struktur erweitern): Liste der Sammlungen (Seeds oben, read-only + „Klonen"; Custom editierbar). Editor: Name/Beschreibung + Template-Picker (Baum aus `/api/templates` + `/api/standard-models`, Mehrfachauswahl) + je Dok Inclusion-Stufe + dateSource. Speichern/Löschen über die Actions. Optimistic-UI im Stil der bestehenden Upload-Flows.

## 6. DoD
- `tsc` 0 · `next build` grün · neue Unit-Tests grün (Model-Validierung, Seed-Schutz, Klon) · **Tool-2-Suite 160/160 unberührt**.
- **EC-09:** Mitarbeiter-Generator/Akte-Flow **nicht berührt** (P3a fasst Formular/Generator nicht an). **EC-10:** Sammlungen treffen keine Freigabe-Aussage. **Keine erfundene Normpflicht** (clauseId nur aus Register/Seed).
- **Migration verifiziert** (`db push` additiv, Seeds idempotent, mehrfacher Start = keine Dubletten).
- **Browser-Abnahme Mark:** Tab „Sammlungen" → Seed klonen → Doks picken + flaggen → speichern → neu laden → bleibt; löschen funktioniert; Seed nicht löschbar.

## 7. Gate
→ Mark: P3a-Plan ok? Dann EIN Bau-Pass. (P3b Formular-Konsum + P3c Zusammenführung danach, je eigener Einseiter.)
