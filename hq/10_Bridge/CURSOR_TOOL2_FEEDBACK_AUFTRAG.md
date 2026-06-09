# CURSOR_TOOL2_FEEDBACK_AUFTRAG — Mark-Feedback Tool 2 (Mitarbeiterakte + Generator)

> **v2 (2026-06-09):** Marks Antworten auf die 10 Rückfragen + Zusatz-Feedback A–E eingearbeitet. **Quelle:** Mark-Feedback 2026-06-09. **Rolle:** Planer hat gemappt; **Executor** baut nur, was hier steht — plant nichts neu, erfindet keine Normwerte. Jede Norm-Regel trägt eine **`clauseId` (CL-xx)** aus `knowledge/NORM_KLAUSEL_REGISTER_v1.md`; ohne CL → „fachlich prüfen", **nicht erfinden**.
> **Norm-Basis:** `NORM_MATRIX_Mitarbeiternachweise_v2.md` + `NORM_KLAUSEL_REGISTER_v1.md` (neu: **CL-75** Arbeitsschutz-Unterweisung DGUV, **CL-76** Waffensachkunde — beide `legal-input`, exakter § von Mark nachzureichen).
> **Guardrails (hart):** EC-09 (Generator/ZIP `POST /employee-automation` 200 nie brechen) · EC-10 (kein Freigabe-/Auditfähigkeits-/Zertifizierungsstatus; eingehende Nachweise = `unchecked`) · keine erfundene Normpflicht · kein `.env`/`.db`/Kundendaten-Commit.

## ⚠️ Stand-Korrektur (vor dem Bau lesen)
Feedback nannte „Slice 2 offen" — **stimmt nicht mehr.** Realer HEAD = `5280d9c` (live): requirement-engine (Slice 2), roleClasses (Slice 3/G4), training-plan (Queue C), ÖPV (CL-29/30), Audit-Export, Firmen-Übersicht. **Gegen diesen HEAD bauen.** Die meisten Punkte sind **Erweiterungen**, keine Neubauten.

---

## 🧭 BEGRIFFS-MODELL (verbindlich — Feedback E, Collision auflösen)
Vier getrennte Achsen, in UI + Code **nicht** vermischen:
1. **Norm-Klasse / Rolle** = `roleClasses[]` (`ek | fk | verwaltung | praktikant | subunternehmer`). Treibt das **Engine-Grundset** (Pflicht-Set, UE-Soll). Norm: EK/FK §4.19.1 **CL-06**, FK-Quali **CL-10**.
2. **Set-Kategorie (Dokumentvorlagen-Set)** = `Sicherheitsmitarbeiter | Führungskraft | Bürokraft (Verwaltung)`. Leitet das **Generator-Vorlagen-Set** (Core-Dokumente) ab — siehe **#D**. **≠ Norm-Klasse.**
3. **Organisationstitel** = `roleType` (z. B. Schichtleiter, Objektleiter). Reine **Anzeige**, keine Engine-Wirkung. *(Ob diese FK-Titel „FK nach DIN" sind = **offen/fachlich prüfen**, Q6.)*
4. **Bestellung (Overlay)** = formale Ernennung (Ersthelfer/Brandschutzhelfer/SiBe), **positionsunabhängig** — siehe **#C**. Norm **CL-74** (Beauftragung ≠ Schulung).
> **`standard models`** im Upload-Manager = **Tool 1** (später). **Nicht** mit Tool 2 mischen. Nicht importieren.

## ✍️ UNTERSCHRIFTS-LOGIK (verbindlich — quer über #4/#5/#C/#10)
- **Unterschriftspflichtig:** Unterweisungen (Datenschutz **CL-04**, Verschwiegenheit **CL-05**, Dienstanweisung **CL-03**, Arbeitsschutz **CL-75**) + Standarddokumente + **Bestellungen** (#C).
- **NICHT unterschriftspflichtig:** Schulungs-/Qualifikationsnachweise. Bei **eigenen Cert-Expert-Schulungen** sind die UE bekannt → nur an die Schulung **anhängen**, keine Unterschrift (#5).

## Phasing (Risiko-getrieben)
- **P1 — UI/Nav, kein Norm-Eingriff:** #1 Nav-Bug · **#A Rollen-Bug (EK fix/abwählbar)** · **#B Visual-/Responsive-Bug** · #8 Generator-Datum · #9 Gruppen (nur Selektion).
- **P2 — Daten/Trennung:** #7+#C Bestellungen sauber trennen (inkl. S3-Cleanup) · #3 Tally-Mapping (je Schulung mit Datum) · #4 Manueller Upload.
- **P3 — Norm/Engine (berührt abgenommene Engine → Suite-Re-Test Pflicht):** #2 Qualifikation-Multiselect · #D Vorlagen-Set · #5 UE-Anerkennung · #10 Datums-Logik/Defaults.
- Pro Punkt eigener Commit; nach jeder Phase `tsc` 0 + Engine-Suite grün + EC-09-ZIP 200.

---

## P1

### #1 — NAV-BUG: „Zur Übersicht" → Mitarbeiterakte-Tab statt Dashboard
**Ziel:** „← Zur Übersicht" in der Akte → Firmen-Übersicht (Mitarbeiterakte-Tab), nicht Dashboard/ZKM.
**Norm:** keine.
**Ist:** `CertificationOsModuleOverview.tsx:205-208` Tab über lokalen State (Default Dashboard), kein URL-Param; Zurück ruft `router.push("/")`.
**Bau:** Tab aus `?area=<id>` lesen (Fallback Default, SSR-stabil); Zurück-Ziel `"/?area=mitarbeiterakte"`.
**Dateien:** `modules/00-dashboard/CertificationOsModuleOverview.tsx`, `…/employee-file/EmployeeAutomationPage.tsx`, `…/employee-file/CompanyHubView.tsx`.
**DoD:** Zurück landet auf Mitarbeiterakte-Tab + Firmenauswahl; `/?area=mitarbeiterakte` öffnet den Tab; kein Hydration-Mismatch; tsc 0; EC-09-ZIP 200.

### #A — ROLLEN-BUG: „Einsatzkraft" fix vorausgewählt + nicht abwählbar
**Ziel:** Alle Norm-Klassen **frei kombinierbar UND einzeln abwählbar** (z. B. nur Verwaltung). „Verwaltungsmitarbeiter" als eigene, sichtbare Rolle.
**Norm:** `roleClasses` treiben Engine (CL-06/CL-10). Verwaltung ohne Bewachung → kein §34a-Set (Matrix §5). Leere Auswahl → „Keine Norm-Klasse erfasst" (EC-10, bereits behandelt).
**Ist:** EK ist im `EmployeeForm` faktisch erzwungen/nicht abwählbar; `verwaltung` als Klasse existiert in der Engine, aber als UI-Rolle nicht sauber wählbar. (EK+Subunternehmer geht laut Mark schon.)
**Bau:** Mehrfachauswahl aller 5 Klassen (`ek/fk/verwaltung/praktikant/subunternehmer`) **ohne Zwangsvorauswahl**, jede einzeln an-/abwählbar; „Verwaltung" als eigene Option. **Keine** Engine-Werte ändern — nur Eingabe entsperren.
**Dateien:** `components/employee/EmployeeForm.tsx` (+ ggf. `validations/employee-form.ts`).
**DoD:** „nur Verwaltung" wählbar, EK abwählbar, alle Klassen frei kombinierbar; leere Auswahl → korrekter Hinweis; Engine-Suite unverändert grün; tsc 0.

### #B — VISUAL-BUG: Layout verschiebt sich / Übersicht abgeschnitten
**Ziel:** Beim Öffnen einer Seite kein Layout-Sprung; Inhalt passt sich der Fenstergröße an (kein Abschneiden).
**Norm:** keine.
**Ist:** Responsive-/Overflow-Problem (vermutlich Workspace-Layout/Grid). Genaue Stelle vom Executor reproduzieren.
**Bau:** Overflow/Responsive im `EmployeeFileWorkspaceLayout` (+ betroffene Container) fixen — `overflow-auto`/`min-w-0`/Breakpoints prüfen; kein Layout-Shift beim Mount.
**Dateien:** `…/employee-file/EmployeeFileWorkspaceLayout.tsx` (+ betroffene Views).
**DoD:** kein Sprung/Abschnitt bei verschiedenen Fensterbreiten; tsc 0.

### #8 — GENERATOR-DATUM: global UND pro Dokument
**Ziel:** Generator-Datum global für alle setzen **und** je Dokument überschreiben.
**Norm:** keine (Ausgabedatum; inhaltliche Defaults = #10).
**Ist:** `app/actions/generate-employee-docs.ts:50` global hartkodiert „heute"; `{currentDate}` in `templateData.ts:115`.
**Bau:** Action akzeptiert `documentDates` (global-Default + per-Doc-Override) statt `new Date()`; UI: globales Datumsfeld + Per-Doc-Override (Muster Queue C Bulk+Einzel).
**Dateien:** `app/actions/generate-employee-docs.ts`, `lib/templateData.ts`, Generator-UI.
**DoD:** global wirkt, Override sticht, Default „heute"; ZIP enthält Daten; tsc 0; EC-09-ZIP 200.

### #9 — GENERATOR-GRUPPEN: vorerst nur saubere Selektion
**Mark-Antwort:** Erst mal **nur saubere Selektion**; benannte/gespeicherte Gruppen **später**.
**Bau:** Auswahl-Stapel klar labeln („X ausgewählt → als Gruppe exportieren"), „Alle/Keine"-Toggle, sichtbare Auswahl-Leiste. **Keine** benannten/gespeicherten Gruppen jetzt.
**Dateien:** `…/employee-file/EmployeeFileIndex.tsx`, `EmployeeAutomationPage.tsx`.
**DoD:** Selektion klar bedienbar/beschriftet; ZIP-Export 200; tsc 0.

---

## P2

### #7 + #C — BESTELLUNGEN sauber trennen (Bestellung ≠ Schulung)
**Ziel:**
- Die fälschlich abgelegte Unterweisung verlässt die Bestellungen.
- **Bestellung = formales Ernennungsdokument** (Ersthelfer/Brandschutzhelfer/SiBe), **unterschriftspflichtig** — **≠** zugehörige **Schulung** (Qualifikationsnachweis).
- **Mechanik:** Akte-Flag **Multiselect „bestellt als …"**; Generator **zwei Wege**: (a) **aus Vorlage generieren** (Default-Datum = Einstellungs-/Bestelldatum, MA unterschreibt nach) **oder** (b) **bestehende Bestellung hochladen**. **Optional:** Bestellung ↔ zugrundeliegende Schulung verknüpfen.
**Norm:** **CL-74** (Beauftragung ≠ Schulung, `legal-input`, Trennung Mark bestätigt). Erste Hilfe **CL-08**, Brandschutzhelfer **CL-23**, SiBe = betriebliche Bestellung (kein DIN-UE).
**Ist:** Appointments dynamisch aus S3 `/appointments/` (`app/api/templates/route.ts:20-65`), Labels `employee-display-labels.ts:39-56`. **Fehlplatzierte Datei (Mark, Q7):** `appointments/unterweisungen/Unterweisungsnachweis_Arbeitsschutz_DGUV.docx` — ist ein **Unterweisungsnachweis** → gehört **raus aus appointments → in Unterweisungen/Schulungen**.
**Bau:**
- **S3-Cleanup:** `Unterweisungsnachweis_Arbeitsschutz_DGUV.docx` aus `appointments/unterweisungen/` entfernen und nach Unterweisungen/Schulungen verschieben (Arbeitsschutz **CL-75**, s. #10). *(Datei ist benannt → kein Raten; vor dem Move Backup/Bestätigung wie üblich bei S3.)*
- **Modell:** Bestellungen auf die **3** Typen begrenzen; Akte-Flag `bestelltAls[]` (Multiselect Ersthelfer/Brandschutzhelfer/SiBe).
- **Generator:** zwei Wege (Vorlage generieren | hochladen); Bestellung ist **unterschriftspflichtig** (Unterschrifts-Logik oben); optionale Verknüpfung Bestellung↔Schulung.
**Dateien:** `…/employee-file/employee-display-labels.ts`, `app/api/templates/route.ts` (Filter), Akte-Modell (`types/employee.ts` `bestelltAls`), Generator-Action/UI, S3 `/appointments/` (Daten, explizit).
**DoD:** nur 3 Bestelltypen, keine Schulung/Unterweisung darunter; Multiselect „bestellt als" persistent; Generator beide Wege; falsche Datei verschoben; EC-09-ZIP 200; tsc 0.

### #3 — TALLY-MAPPING ↔ Nachweis-Slots (je Schulung mit eigenem Datum)
**Mark-Antwort (Q3):** **Je Schulung ein eigener Slot mit eigenem Datum** — **NICHT** ein Slot je Typ.
**Ziel:** Tally-Uploads landen am richtigen, **pro-Schulung-granularen** Nachweis-Slot.
**Norm:** Slots referenzieren CL-03/04/05/08/23, Sachkunde CL-01/02 (Zuordnung, keine neue Pflicht).
**Ist:** `TALLY_FIELD_MAPPING.md` + `lib/data/tally-employee-slots.json` (10 Slots à ~7 File-Felder) + `tally-intake-service.ts` (`mapTallyUploadToEvidenceId`). Heute eher „Slot je Typ".
**Bau:** Abgleich Tally-Feld → `evidenceId` → Akte-Slot; auf **pro-Schulung-Granularität** (eigene `evidenceId` + Datum je Schulung, Muster `training-plan:{id}` aus Queue C) umstellen; Lücken/Fehl-Mappings fixen; Abgleich-Tabelle in `TALLY_FIELD_MAPPING.md` (Status ok/fix).
**Dateien:** `hq/10_Bridge/TALLY_FIELD_MAPPING.md`, `lib/data/tally-employee-slots.json`, `lib/tally-intake-service.ts` (+ `mapTallyUploadToEvidenceId`).
**DoD:** vollständige Mapping-Tabelle; Tally-Upload landet pro Schulung korrekt (Testsubmission); `unchecked` bleibt; tsc 0.

### #4 — MANUELLER UPLOAD signierter Dokumente
**Ziel:** Mark lädt unterschriebene Dokumente (Unterweisungen, Standarddokumente, Bestellungen) je MA hoch.
**Norm:** Typen wie #3/#C; EC-10 `unchecked`, keine Auto-Freigabe. **Unterschrifts-Logik** (oben) sichtbar machen: unterschriftspflichtige vs. nur-anhängen-Slots.
**Ist:** Evidence-Infra **existiert** (`employee-evidence-storage.ts`, `uploadEmployeeEvidenceAction`, Dossier-Hooks `EmployeeAutomationPage.tsx:371-405`). Pro-Person-S3-Struktur vorhanden.
**Bau:** Upload-/Entfernen-Button für **jeden** relevanten Slot ausspielen (inkl. Einzelschulungen #10, Bestellungen #C). Fehlende Slots ergänzen (gleiche Infra). **Kein** neues Storage-Modell.
**Dateien:** `…/employee-file/EmployeeFileDossierView.*`, ggf. `employee-evidence-storage.ts` (Slot-Liste).
**DoD:** Upload je Slot → erscheint, bleibt, `unchecked`; Live-Klick-Abnahme Mark (OS-Dialog); tsc 0; EC-09-ZIP 200.

---

## P3 (berührt abgenommene Engine → Suite-Re-Test Pflicht)

### #2 — QUALIFIKATION: Multiselect-Dropdown (höchste + Zusätze), je clauseId
**Mark-Antwort (Q2):** **Multiselect.** Höchste Qualifikation **+ Zusätze kombinierbar** (z. B. **Waffensachkunde** kommt obendrauf).
**Norm-Mapping (Katalog-Werte → CL + Stufe):**
- Unterrichtung §34a → **CL-01** (Stufe A-Einstieg; löst 6-Monats-Frist **CL-02**).
- Sachkundeprüfung §34a → **CL-01/CL-02** (Stufe A).
- GSSK (Geprüfte Schutz- u. Sicherheitskraft) → **CL-07** (Stufe B) / FK-qualifizierend **CL-10**.
- Servicekraft → **CL-10** / Stufe B.
- Geprüfte Fachkraft / Meister / IHK-Werkschutzmeister → **CL-07/CL-10** (Stufe C).
- **Zusatz: Waffensachkunde → CL-76** (`legal-input`, §7 WaffG — **additiv**, ersetzt §34a nicht; „fachlich prüfen" bis Mark § bestätigt).
**Engine-Logik bei Multiselect:** **höchste Stufe** (A<B<C) bestimmt die Qualifikationsstufe; **Zusätze** (Waffensachkunde) sind additive Flags, **ändern die Stufe nicht** und erzeugen **keine** neue DIN-Pflicht.
**Ist:** Freitext `qualification` (`EmployeeForm.tsx:698-708`, `types/employee.ts:55`); Engine Regex `hasSachkunde`/`hasUnterrichtung` (`requirement-engine.ts:292-297`).
**Bau:** Katalog `qualification-catalog.ts` (id/Label/`clauseId`/Stufe/Flags `erfuelltSachkunde`/`fkQualifizierend`/`zusatz`); Feld `qualifications: string[]` (Multiselect); Engine liest strukturierte Werte statt Regex (Migration: Freitext tolerant mappen, unbekannt → „fachlich prüfen"). **EC-10:** keine „qualifiziert"-Aussage.
**Dateien:** neuer `…/employee-file/qualification-catalog.ts`, `components/employee/EmployeeForm.tsx`, `validations/employee-form.ts`, `types/employee.ts`, `requirement-engine.ts` (+ Suite), Repository (Migration/Persistenz).
**DoD:** Multiselect mit CL-belegten Optionen + Waffensachkunde-Zusatz; höchste Stufe zählt; Migration verlustfrei; Suite erweitert + grün; tsc 0; EC-09/EC-10.

### #D — DOKUMENTENVORLAGE: Set-Auswahl je Kategorie + Bestellungs-Overlay
**Mark-Feedback D + Q6:** Aktuell nur „DIN 77200 Allgemeine". Soll **Set-Auswahl** nach **Set-Kategorie**: **Sicherheitsmitarbeiter / Führungskraft / Bürokraft (Verwaltung)** → leitet das **Vorlagen-Set** ab. **Bestellungen = positionsunabhängiges Overlay** (inkl. **Fahrtätigkeit → Anweisung**, **CL-73** Fahrer/UVV `legal-input`). Set **auch direkt im Generator** (Core/Overlay Documents) wählbar. **Q6: `roleId`→`roleIds` RAUSNEHMEN** — keine Mehrfach-Doku-Paletten; das löst die **Set-Kategorie**, nicht mehrere roleIds.
**Norm:** Set-Kategorie = Doku-Steuerung, **keine** Norm-Pflicht (Engine-Grundset bleibt `roleClasses`). Fahr-Overlay → CL-73 (`legal-input`).
**Ist:** Generator nutzt **ein** `roleId` → `selectedRoleDocIds` (`EmployeeForm.tsx:630-641`). Nur ein „Allgemeine"-Set.
**Bau:** Set-Kategorie-Auswahl (3 Sets) → Core-Vorlagen-Set; Bestellungen als Overlay (positionsunabhängig) + Fahr-Anweisung-Overlay; im Generator Core/Overlay getrennt wählbar. **`roleId`→`roleIds`-Migration NICHT bauen.** **Begriffe** strikt nach Begriffs-Modell trennen; **`standard models` (Tool 1) draußen.**
**Dateien:** Generator-Doc-Auswahl + Action (`generate-employee-docs.ts`), `EmployeeForm.tsx`/Generator-UI, Vorlagen-Set-Definition (Datei/Katalog).
**DoD:** 3 Set-Kategorien wählbar → korrektes Core-Set; Bestellungs-/Fahr-Overlay positionsunabhängig; im Generator Core/Overlay wählbar; EC-09-ZIP 200; tsc 0.

### #5 — UE-ANERKENNUNG beim Schulungs-Upload (Variante C + Eigen-Katalog)
**Mark-Antwort (Q5):** **Variante C — Autoextraktion.** Bei **eigenen Cert-Expert-Schulungen UE bereits bekannt** → nur an die Schulung **anhängen, KEINE Unterschrift**. Unterschriftspflicht nur bei Unterweisungen + Standarddokumenten.
**STATUS (Marks frühere Frage):** Auto-Ist wird heute **nicht** gebildet (bewusst geparkt) — wird mit diesem Punkt gebaut.
**Norm:** UE nur aus **CL-11** (40/24), Einmalschulungen **CL-20/21/24/25/29/30**, Anrechnung **CL-27**. **Keine** erfundenen UE.
**Bau:**
- **Eigene Cert-Expert-Schulungen:** UE aus Schulungs-Katalog (bekannt) → automatisch an die Schulung anhängen + in `einmaligIstUE`/`weiterbildungIstUE` (CL-27-Anrechnung) → Soll/Ist-Ampel reagiert. **Keine Unterschrift.**
- **Autoextraktion (extern):** UE-Wert aus dem hochgeladenen Dokument extrahieren. **⚠️ EC-10:** extrahierter Wert = **„fachlich prüfen"** (Heuristik, `unchecked`, **keine** Bestätigung) — vor Übernahme bestätigbar, kein Auto-Grün.
**Dateien:** `…/employee-file/training-catalog.ts` (Eigen-UE), `training-plan.ts` (Anrechnung), Evidence-Upload-Pfad (Extraktion), Repository (`einmaligIstUE`/`weiterbildungIstUE`), Ampel-Merge. **Engine unberührt** (liest nur Ist).
**DoD:** eigene Schulung → UE automatisch angehängt (ohne Unterschrift), Ist steigt, CL-27 korrekt; externe Extraktion → „fachlich prüfen", `unchecked`; Suite + tsc grün; EC-09-ZIP 200.
**Rest-Rückfrage (Q5'):** Auto**extraktion** aus beliebigen PDFs ist technisch unsicher (Layout-abhängig). Vorschlag: **Eigen-Katalog zuverlässig** bauen + Extraktion als **Best-Effort mit Pflicht-Bestätigung**. (Reicht das, oder soll Extraktion hart sein? — siehe offene Punkte.)

### #10 — DATUMS-LOGIK / DEFAULTS
**Ziel + Mark-Antworten:**
- **Geburtsdatum:** `birthday` → auf Schulungen drucken.
- **Erst-Standardunterweisung** (Datenschutz **CL-04**, Verschwiegenheit **CL-05**, **Arbeitsschutz CL-75**) **+** Datenschutz-/Verschwiegenheitserklärung → **Default = erster Arbeitstag** (`startDate`/Einstellungs-/Vertragsdatum), änderbar, MA unterschreibt nach. Dienstanweisung = **CL-03**.
- **>1 Jahr vergangen → Wiederholungsunterweisung** (Arbeitsschutz **CL-75**: DGUV V23 §4(2) „regelmäßig, lt. DA mind. jährlich" + DGUV V1/V2; **Bürotätigkeit abweichend**; `legal-input` → als **„fachlich prüfen"** führen, exakter § Mark nachreichen).
- **Einzelschulungen → individuelles Datum** (manuell, je Eintrag; deckt sich mit #8 + Queue-C-Override).
- **Objektbezogene Unterweisung (CL-22)** → **Mark-Antwort (Q10b): manuell** laufen lassen, bis Projektakte da ist.
**Ist:** `startDate`/`birthday` vorhanden; keine Default-Datums-Logik; Generator-Datum global „heute".
**Bau:** Default-Ableitung (startDate → Erstunterweisung/Erklärungen; >1 J. → Wiederholungs-Flag **CL-75 „fachlich prüfen"**; objektbezogen + Einzelschulung → manuell), überall überschreibbar (greift in #8). Nicht-DIN-Posten klar als „fachlich prüfen" markieren.
**Dateien:** `app/actions/generate-employee-docs.ts`, `lib/templateData.ts`, Engine-Fristen (nur Default-Daten, **keine** neue UE/CL), Generator-UI.
**DoD:** Defaults greifen + änderbar; Geburtsdatum auf Schulungen; >1-J.-Wiederholung (als „fachlich prüfen"); objektbezogen/Einzel manuell; tsc 0; EC-09-ZIP 200.

---

## ✅ RÜCKFRAGEN — Status nach Mark-Antworten (2026-06-09)
| # | Status |
|---|---|
| Q2 Qualifikation | ✅ **Multiselect**, höchste + Zusätze (Waffensachkunde CL-76) |
| Q3 Slots | ✅ **je Schulung mit eigenem Datum** |
| Q5 UE-Upload | ✅ **Variante C**: Eigen-Katalog (UE bekannt, ohne Unterschrift) + Extraktion (fachlich prüfen) |
| Q6 Rollen/Paletten | ✅ **roleId→roleIds RAUS**; Doku via Set-Kategorie (#D); FK-Org-Titel „FK nach DIN?" = offen |
| Q7 Pfad | ✅ `appointments/unterweisungen/Unterweisungsnachweis_Arbeitsschutz_DGUV.docx` → raus/verschieben |
| Q9 Gruppen | ✅ nur **saubere Selektion**, benannte Gruppen später |
| Q10a Arbeitsschutz | ✅ **CL-75** (DGUV V23 §4(2)/V1/V2, Büro abweichend), `legal-input` — exakter § nachzureichen |
| Q10b objektbezogen | ✅ **manuell** bis Projektakte |

## 🔴 NOCH OFFEN (Mark)
- **CL-75 / CL-76 exakter Paragraf:** DGUV-V23-/WaffG-§ verbindlich nachreichen (bis dahin „fachlich prüfen"). 
- **FK-Org-Titel (Schichtleiter/Objektleiter):** „FK nach DIN" ja/nein? (betrifft #6/#D Org-Titel-Mapping) — **fachlich prüfen.**
- **Q5' Autoextraktion-Tiefe:** Eigen-Katalog + Best-Effort-Extraktion mit Pflicht-Bestätigung ok, oder härtere Extraktion gewünscht?
- **„Q8" aus deiner Antwort:** #8 (Generator-Datum) hatte keine offene Rückfrage — war als spezifiziert gemeint? Falls du etwas anderes meintest, bitte präzisieren.

## 🚦 DISPATCH v1 (2026-06-09) — zwei parallele Executor-Lanes (disjunkte Write-Sets)
**Modell (wie c5eb583):** jeder Cursor-Agent auf **eigenem `cursor/*`-Branch**, **disjunkte** Datei-Mengen → konfliktfreier Merge; Planer reviewt + merged nach `main`. **Branch-Basis = `main` (HEAD `5638374`).** Beide bauen **nur P1**.

### Lane A — Akte-Shell: Navigation + Layout + Selektion → Punkte **#1, #B, #9**
- **Branch:** `cursor/tool2-shell-nav`
- **Write-Set (NUR diese Dateien):** `modules/00-dashboard/CertificationOsModuleOverview.tsx` · `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeAutomationPage.tsx` · `…/CompanyHubView.tsx` · `…/EmployeeFileWorkspaceLayout.tsx` · `…/EmployeeFileIndex.tsx`
- **VERBOTEN:** `EmployeeForm.tsx`, `EmployeeFilePersonRolleEditTable.tsx`, `EmployeeFileAkteInlineEdit.tsx`, `employee-stammdaten-options.ts`, `requirement-engine.ts`, Generator-/Engine-Dateien. Bei Bedarf an einer fremden Datei → **als Frage parken**, nicht editieren.

### Lane B — Rollen-Eingabe-Bug → Punkt **#A**
- **Branch:** `cursor/tool2-rollen-eingabe`
- **Write-Set (NUR diese Dateien):** `components/employee/EmployeeForm.tsx` *(falls Rollen-UI dort)* · `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeForm.tsx` · `…/EmployeeFilePersonRolleEditTable.tsx` · `…/EmployeeFileAkteInlineEdit.tsx` · `…/employee-stammdaten-options.ts` · `…/validations/employee-form.ts`
- **VERBOTEN:** `EmployeeAutomationPage.tsx`, Shell-/Layout-/Index-Dateien (Lane A), `requirement-engine.ts` (Engine — `roleClasses` werden dort schon korrekt verarbeitet; **nur Eingabe entsperren, keine Engine-Werte ändern**). Bei Bedarf → parken.

**Beide:** EC-09 (ZIP 200), EC-10, keine erfundene Normpflicht; `tsc --noEmit` 0; Engine-Suite **unverändert grün** (kein Engine-Edit); Browser-Akzeptanz `:3001`; committen auf eigenem Branch + **pushen**; **EINEN** Ergebnis-Eintrag unter „Von Cursor an Claude" im HANDOFF; Zweifel als Frage parken (Plan nicht umschreiben). **#8 Generator-Datum = nächster Dispatch** (teilt `EmployeeAutomationPage` mit Lane A).

## 🚦 DISPATCH v2 (2026-06-09) — zwei parallele Lanes (disjunkt)
**Branch-Basis = `main` (HEAD `c436125`).** **Hinweis:** #8 (Generator-Datum) und #7/#C (Bestellungen) **überlappen** auf `EmployeeFileDossierView.tsx` + `generate-employee-docs.ts` → **nicht parallel**. Daher #7/#C + #3 (disjunkt) jetzt; **#8 = Dispatch v3 nach #7/#C-Merge**. Dispatch v1 (#1/#B/#9/#A) ist gemergt.

### Lane C — Bestellungen sauber trennen → **#7 + #C**
- **Branch:** `cursor/tool2-bestellungen`
- **Write-Set (NUR):** `…/employee-file/employee-display-labels.ts` · `…/employee-file/EmployeeFileDossierView.tsx` · `…/employee-file/EmployeeFileDossierZones.tsx` · `lib/types/employee.ts` (Feld `bestelltAls`) · `app/api/templates/route.ts` (Filter) · `modules/03-mitarbeiterakte-tool-2/employee-generator/generate-employee-docs.ts` + `app/actions/generate-employee-docs.ts` (Bestellung-aus-Vorlage)
- **Inhalt:** Bestellungen = nur Ersthelfer/Brandschutzhelfer/SiBe (**CL-08/CL-23/CL-74**); Akte-Flag Multiselect `bestelltAls`; Generator 2 Wege (Vorlage generieren mit Default-Datum Einstellung/Bestellung **ODER** hochladen); Bestellung = unterschriftspflichtig (Unterschrifts-Logik); optionale Verknüpfung Bestellung↔Schulung.
- **PARKEN (nicht im Sandbox machbar):** S3-Move von `appointments/unterweisungen/Unterweisungsnachweis_Arbeitsschutz_DGUV.docx` → Unterweisungen/Schulungen = **Server/Mark** (kein S3-Schreibzugriff in Cursor). Als Hinweis im HANDOFF.
- **VERBOTEN:** `lib/tally-*` (Lane D), `EmployeeAutomationPage.tsx`, Engine, `requirement-engine.ts`. Bei Bedarf → parken.

### Lane D — Tally-Mapping ↔ Nachweis-Slots → **#3**
- **Branch:** `cursor/tool2-tally-mapping`
- **Write-Set (NUR):** `lib/tally-intake-service.ts` (+ `mapTallyUploadToEvidenceId`-Quelle) · `lib/data/tally-employee-slots.json` · `hq/10_Bridge/TALLY_FIELD_MAPPING.md` (anlegen, falls fehlt)
- **Inhalt:** Abgleich Tally-Feld → `evidenceId` → Akte-Slot auf **je-Schulung-mit-eigenem-Datum** (Q3, Muster `training-plan:{id}`); Lücken/Fehl-Mappings fixen; Abgleich-Tabelle (ok/fix) in `TALLY_FIELD_MAPPING.md`. Bezug CL-03/04/05/08/23, Sachkunde CL-01/02 (nur Zuordnung, keine neue Pflicht).
- **VERBOTEN:** `lib/types/employee.ts` (Lane C besitzt es), `modules/03-mitarbeiterakte-tool-2/**` (Lane C/Akte), Engine. Bei Bedarf → parken.

**Beide:** EC-09/EC-10, keine erfundene Normpflicht; `tsc` 0; Engine-Suite unverändert grün; eigener `cursor/*`-Branch; committen + pushen; EINEN HANDOFF-Ergebnis-Eintrag; Zweifel parken.

## DoD (gesamt)
Pro Phase eigener Commit; je Phase `tsc --noEmit` 0 · Engine-Suite (`tsx --test`) grün (bei #2/#5/#10/#D erweitert) · **EC-09-ZIP `POST /employee-automation` 200** · EC-10 (`unchecked`, kein Freigabe-Wording) · jede Regel CL-belegt oder „fachlich prüfen" · Browser-Akzeptanz `:3001` (Mark-Klick für OS-Dialoge). **P1 sofort baubar; P2/P3 laufen, offene Punkte oben blockieren nur die jeweils betroffenen Teil-Posten, nicht die Phase.**
