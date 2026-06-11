# TOOL 1 — Document Creator · Plan-Einseiter (Ist → Soll → Bugs → DoD)

> **Zweck:** Gemeinsame Planung VOR jedem Code (Lektion aus Tool 2: nicht Bug-Fix und Umbau vermischen, nicht Bugs einzeln im Bauen nachschieben). Mark nimmt diese Seite ab → DANN ein sauberer Bau-Pass.
> **Rolle:** Planung. Kein Produktivcode in diesem Schritt.
> **Stand:** 2026-06-11 · `main` = `9b8c0b9` · live `e84e599` · Suite 160/160 · tsc 0.

---

## 1. IST — was Tool 1 heute ist
**Eine Sache, klein und live:** Platzhalter in `.docx`-Vorlagen ersetzen → als ZIP herunterladen.

**Ablauf (verifiziert im Code):**
1. `/model-creator` (Page) lädt Ordner via `GET /api/standard-models` (liest S3 `standard-models/<ordner>/*.docx`).
2. `DocumentForm` — Nutzer wählt Ordner (MultiSelect), kann je Ordner einzelne Docs im Tree abwählen, füllt Kopf-/Fuß-Felder (Version, Datum, Created/Approved By) + Firmendaten + optional Logo.
3. Server-Action `generateDocument` (`app/actions/send-model-entries.ts`): pro gewähltem Ordner alle nicht-abgewählten `.docx` über `easy-template-x` mit `templateData` befüllen → JSZip → base64 zurück → Browser lädt ZIP.

**Platzhalter:** `{Logo}`, `{DocVersion}`, `{CreatedBy}`, `{ApprovedBy}`, `{DocDate}`, `{CompanyName}`, `{CompanyStreet}`, `{CompanyZip}`, `{CompanyCity}`, `{CompanyCountry}`, `{CompanyAddressLine}`.

**Berührte Dateien:** `app/model-creator/page.tsx` · `components/document/DocumentForm.tsx` · `app/actions/send-model-entries.ts` · `app/api/standard-models/route.ts` · `lib/validations/model-form.ts` · (genutzt: `lib/template-storage.ts`, `lib/constants/logo-upload.ts`).
**Tests:** **0** (Tool 2 hat 160).

---

## 2. SOLL — wo Tool 1 nach diesem Pass steht
Dasselbe Tool, aber **robust + konsistent + getestet** — ohne neue Features, ohne Architektur-Umbau:
- Pflichtfelder werden wirklich erzwungen (kein kaputtes/leeres Datum im Dokument).
- Kein „erfolgreiches" leeres ZIP.
- Ein defektes Template bricht **nicht** den ganzen Lauf (EC-09-Konsistenz mit Tool-2-Generator: skip + log).
- Klare Fehlermeldung bei ungültigem Logo.
- Keine doppelte Response-Payload.
- Einheitliche Sprache (DE).
- Kern-Logik (ID-Match API↔Server, Excluded-Filter, Leer-Guard) unit-getestet.

**Bewusst NICHT in diesem Pass** (→ separater Plan + C-10-Gate): zentrales Firmenprofil/Logo (#8).

---

## 3. BUG- / VERBESSERUNGS-LISTE (vollständig — das ist der „eine Zug")

| # | Typ | Befund | Fix-Skizze |
|---|-----|--------|-----------|
| 1 | 🐛 Bug | `docDate` im Zod-Schema ohne `.min(1)` → leeres Datum läuft in `format("")` → kaputtes Datum / geworfener Resolver-Fehler ohne saubere Meldung | `.min(1, "Datum erforderlich")` vor `transform`; Action: leeres Datum defensiv abfangen |
| 2 | 🐛 Bug | Alle Docs eines Ordners abgewählt → `success:true` mit ZIP, das nur einen leeren Ordner enthält, kein Hinweis | Server: wenn 0 inkludierte Docs über alle Ordner → `error: "Keine Dokumente ausgewählt"` |
| 3 | ⚠️ Robust | Ein kaputtes Template → `return success:false` bricht GESAMTEN Lauf (Tool-2-Generator macht skip+log) | Pro-Doc try/catch: fehlerhaftes Doc überspringen + sammeln, ZIP mit Rest erzeugen; abschließend übersprungene melden. **EC-09-Muster** |
| 4 | ⚠️ Robust | `sizeOf(logo)` kann werfen (SVG/korrupt) → generischer „Failed to generate" | Logo-Verarbeitung in eigenes try/catch → Meldung „Logo ungültig/nicht lesbar"; `width/height`-Fallback prüfen |
| 5 | 🚀 Effizienz | Action gibt `generatedDocuments[]` mit je vollem base64 **zusätzlich** zum ZIP zurück — Page nutzt `state.documents` NIE → Payload verdoppelt | `documents` aus Rückgabe entfernen (nur `success` + `zipBase64` + `error`) |
| 6 | 🎨 UX | Sprach-Mix EN-UI / DE-Fehlertexte | Auf **DE** vereinheitlichen (kundenseitig) |
| 7 | 🧪 Test | 0 Tests | Unit: ID-Match API↔Server (`folderId-fileName`), Excluded-Filter, Leer-Guard (#2), Skip-Verhalten (#3) |
| 8 | 🏗️ Architektur | Firmendaten/Logo bei jedem Lauf neu eintippen; laut `CONTEXT.md` zentral pro Firma, von Tool 1 **und** Tool 2 nutzbar | **SEPARAT** — eigener Plan, C-10-Gate mit Mark, NACH #1–#7 |

---

## 4. DoD (für den Bau-Pass #1–#7)
- `tsc --noEmit` = 0.
- `next build` = Compiled successfully.
- Neue Tests grün (#7); bestehende Suite 160/160 unberührt.
- **EC-09:** ZIP-Generator (Tool 2) nicht berührt — Write-Set bleibt in den Tool-1-Dateien aus §1.
- **EC-10:** keine Freigabe-/Auditfähigkeitsaussage; Tool 1 erzeugt nur Dokumente.
- **Keine erfundene Normpflicht** — Tool 1 ersetzt nur Platzhalter, kein Norm-Soll.
- Browser-Abnahme durch Mark: echter Lauf (Ordner wählen → generieren → ZIP öffnen → Platzhalter ersetzt).

---

## 5. ENTSCHEIDUNG: patch vs. rebuild
**Empfehlung: ÜBERNEHMEN + in EINEM geplanten Pass fixen (#1–#7). Nicht neu bauen.**
- Kern (~50 Z. `easy-template-x` + JSZip) + S3-Storage + API + Doc-Tree-UI + Logo-Skalierung sind **live-verifiziert** → Rebuild würde Funktionierendes wegwerfen ohne Gewinn.
- Fläche ist so klein, dass ein Fix-Pass nicht eskalieren kann (≠ Tool-2-Komplexität).
- #8 (Umbau) bleibt strikt getrennt → genau die Vermischung, die bei Tool 2 wehtat, wird vermieden.

→ **Mark-Gate:** Diese Seite ok? Streichen/ergänzen? Dann ein Bau-Pass gegen §3 #1–#7.
