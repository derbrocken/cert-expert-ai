# P3 — Editierbare Sammlungen (Design + Entscheidungen)

> **Teil von:** `FRAMEWORK_TOOL1_TOOL2_UPLOAD.md` (P0 locked). D4: **vordefinierte Set-Kategorien bleiben + zusätzlich editierbare Sammlungen.**
> **Status:** DESIGN-GATE (Spur P). Noch KEIN Bau-Einseiter — P3 hat echte Gabelungen, die Mark entscheidet, BEVOR gebaut wird. (Lektion: nicht auf Annahmen bauen.)
> **Stand:** 2026-06-11. Grundlage: Code-Lesung `vorlagen-set-catalog.ts`, `EmployeeForm.tsx`, `generate-employee-docs.ts`.

---

## 1. IST — wie „Sammlungen" heute funktionieren (zwei Ebenen!)
1. **Deklarativer Katalog** (`vorlagen-set-catalog.ts`): 3 **hartcodierte** `SetKategorie` (sicherheitsmitarbeiter / fuehrungskraft / buerokraft). `coreDocsForSetKategorie()` liefert je Kategorie eine `SetDocumentSpec[]`-Liste (Basis-Doks + Stellenbeschreibung) + bedingte **Overlays** (Bestellungen, Fahrtätigkeit, Objekt-DA, Mutterschutz). **Steuert Anzeige + Generator-Manifest.**
2. **Echte Generierung** (`generate-employee-docs.ts`): verarbeitet die **S3-Templates** aus `role.documents` (`roles/<slug>/*.docx`) + `appointment.documents`, gefiltert über `selectedRoleDocIds`/`selectedAppointmentDocIds`. **Die Vorauswahl** kommt heute aus der gewählten **Rolle** (`roleId`), nicht direkt aus dem Katalog.

**Der Bruch, den Mark spürt:** Katalog (Ebene 1) und echte Template-Auswahl (Ebene 2) sind **parallel**, nicht EINE Quelle. „Sammlung" = heute faktisch der `roles/<slug>`-Ordner + die 3 Code-Kategorien. Nicht editierbar ohne Code.

## 2. SOLL — eine editierbare „Sammlung" als EINE Quelle
Eine **Sammlung** = benannte Liste von **Template-Referenzen** (`roles/…`, `appointments/…`, `standard-models/…`), jede mit Flag **Pflicht / optional-vorausgewählt / optional-aus**. Admin pflegt sie in einer UI. Im Mitarbeiter-Formular wählbar → die referenzierten Doks werden **vorausgewählt** (mappt auf die echte `selectedRoleDocIds`/`selectedAppointmentDocIds`). **Predefined (3) bleiben** als eingebaute Seed-Sammlungen.

## 3. ZIELBILD (Vorschlag, je nach Entscheidungen)
- **Daten:** additive DB-Tabellen `DocumentCollection` (id, name, scope, …) + `DocumentCollectionItem` (collectionId, templateLogicalPath, pflicht/optional, dateSource). Additive Migration (wie die bisherigen nullable-Spalten — kein Datenverlust).
- **Admin-UI:** neuer Tab **„Sammlungen"** im Upload-Manager — Templates aus den vorhandenen Kategorien picken, Pflicht/Optional flaggen, benennen, speichern. (Die 3 Predefined erscheinen als read-only Seeds, **klonbar** zum Anpassen.)
- **Mitarbeiter-Formular:** Sammlungs-Dropdown listet **Predefined + Custom**; Auswahl setzt die Doc-Vorauswahl (Pflicht = an+gesperrt, optional-vorausgewählt = an+abwählbar, optional-aus = aus+zuwählbar).
- **Generator:** unverändert — verarbeitet weiter die selektierten S3-Doks (EC-09). Sammlung steuert nur die **Vorauswahl**, nicht die Verarbeitung.

## 4. ENTSCHEIDUNGEN FÜR MARK (Design-Gate — vor Bau)

- **DP3.1 — Was ist eine Sammlung?**
  (a) **Frei zusammenstellbares Bündel** aus vorhandenen Template-Doks (picken → benennen → speichern). *(Empfehlung — deckt „Sammlung + optionale Zusätze")*
  (b) Nur die **3 vorhandenen Kategorien editierbar** machen (deren Doks ändern), kein freies Anlegen.
- **DP3.2 — Geltung (Scope):** Sammlungen **global** (für alle Firmen, agenturweiter SMA-Standard) oder **pro Firma** anpassbar? *(Empfehlung: global mit optionalem Per-Firma-Override später — global zuerst.)*
- **DP3.3 — Pflicht vs. optional:** Drei Stufen je Dok — **Pflicht (gesperrt an)** / **optional-vorausgewählt** / **optional-aus**? Oder reicht zwei (Pflicht / optional)? *(Empfehlung: drei Stufen — entspricht „braucht + kann hinzufügen".)*
- **DP3.4 — Predefined-Verhältnis:** Die 3 bleiben als **read-only Seeds + klonbar** (Original als Fallback unverändert)? Oder sollen die 3 selbst **direkt editierbar** werden? *(Empfehlung: read-only + klonbar — Fallback bleibt stabil.)*
- **DP3.5 — Speicherort:** **DB-Tabellen** (additive Migration, sauber & abfragbar) ok? *(Empfehlung: ja — wie die bisherigen additiven Schema-Erweiterungen, mit Backup beim Deploy.)*
- **DP3.6 — Admin-UI-Ort:** Sammlungen-Pflege als **neuer Tab im Upload-Manager** (dort liegen die Templates schon)? *(Empfehlung: ja.)*

## 5. PHASING (nach Entscheidungen — je eigener Bau-Einseiter + Gate)
- **P3a** — Datenmodell + Admin-CRUD (Tabellen, „Sammlungen"-Tab, Seeds der 3 Predefined).
- **P3b** — Mitarbeiter-Formular konsumiert Sammlungen (Dropdown Predefined+Custom → Doc-Vorauswahl, Pflicht/Optional-Stufen).
- **P3c** — Aufräumen: deklarativen Katalog (`vorlagen-set-catalog.ts`) und Sammlungen als EINE Quelle zusammenführen (Doppelpflege beenden).

> **→ Mark:** DP3.1–DP3.6 entscheiden (oder „Empfehlungen ok"). Dann schreibe ich den **P3a-Bau-Einseiter** — erst danach Code.

---

## 6. ENTSCHEIDUNGEN LOCKED (Mark „ok" = alle Empfehlungen, 2026-06-11)
- **DP3.1 ✅ (a)** frei zusammenstellbares Bündel aus vorhandenen Template-Doks.
- **DP3.2 ✅ global** zuerst (Per-Firma-Override = spätere Phase).
- **DP3.3 ✅ drei Stufen:** Pflicht (gesperrt an) / optional-vorausgewählt / optional-aus.
- **DP3.4 ✅** die 3 Vordefinierten bleiben **read-only Seeds + klonbar**.
- **DP3.5 ✅ DB-Tabellen** (additive Migration + Backup beim Deploy).
- **DP3.6 ✅** Admin-UI = **neuer Tab im Upload-Manager**.

**→ Aktiver Plan: `FRAMEWORK_P3A_DATENMODELL_ADMIN.md`.**
