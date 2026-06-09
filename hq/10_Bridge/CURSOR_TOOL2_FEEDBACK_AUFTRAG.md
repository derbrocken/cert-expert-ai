# CURSOR_TOOL2_FEEDBACK_AUFTRAG — Mark-Feedback Tool 2 (Mitarbeiterakte + Generator)

> **Quelle:** Mark-Feedback 2026-06-09 (10 Punkte). **Rolle:** Planer hat gemappt; **Executor** baut nur, was hier steht — plant nichts neu, erfindet keine Normwerte. Jede Norm-Regel trägt eine **`clauseId` (CL-xx)** aus `knowledge/NORM_KLAUSEL_REGISTER_v1.md`; ohne CL-ID → als „fachlich prüfen" markieren, **nicht erfinden**.
> **Norm-Basis:** `NORM_MATRIX_Mitarbeiternachweise_v2.md` + `NORM_KLAUSEL_REGISTER_v1.md`.
> **Guardrails (hart):** EC-09 (Generator/ZIP `POST /employee-automation` 200 nie brechen) · EC-10 (kein Freigabe-/Auditfähigkeits-/Zertifizierungsstatus; eingehende Nachweise = `unchecked`) · keine erfundene Normpflicht · kein `.env`/`.db`/Kundendaten-Commit.

## ⚠️ Stand-Korrektur (vor dem Bau lesen)
Das Feedback nennt „Slice 0+1 fertig (861f210/4d9cefe), Slice 2 offen". **Das stimmt nicht mehr.** Realer HEAD = `5280d9c` (live auf cos.cert-expert.de): requirement-engine (Slice 2, `22e0c7c`, abgenommen), roleClasses (Slice 3/G4), training-plan (Queue C `fbe1980`), ÖPV-Engine (CL-29/30), Audit-Export, Firmen-Übersicht. **Gegen diesen HEAD bauen**, nicht gegen die Annahme. Viele Feedback-Punkte sind deshalb **Erweiterungen vorhandener Module**, keine Neubauten.

## Empfohlenes Phasing (Risiko-getrieben)
- **P1 — UI/Navigation, kein Norm-/Engine-Eingriff (niedrig-Risiko):** #1 Nav-Bug · #8 Generator-Datum · #9 Generator-Gruppen.
- **P2 — Daten/Trennung (mittel):** #7 Bestellungen-Cleanup · #3 Tally-Mapping-Abgleich · #4 Manueller Upload (verifizieren/ausbauen).
- **P3 — Norm/Engine (hoch, berührt abgenommene Engine → Suite-Re-Test Pflicht):** #2 Qualifikation-Dropdown · #6 Rollen-Ausbau · #5 UE-Anerkennung · #10 Datums-Logik/Defaults.
- **Reihenfolge je Phase = eigene Commits**, kein Sammel-Commit. Nach jeder Phase: `tsc` 0 + Engine-Suite grün + EC-09-ZIP 200.

---

## #1 — NAV-BUG: „Zur Übersicht" springt auf Dashboard statt Mitarbeiterakte
**Ziel (Was kann Mark):** In einer Akte „← Zur Übersicht" (oben links) → landet wieder auf der **Firmen-Übersicht** (Mitarbeiterakte-Tab mit Firmenauswahl), **nicht** auf dem Dashboard/ZKM-Tab.
**Norm:** keine (reine Navigation).
**Ist:** `CertificationOsModuleOverview.tsx:205-208` steuert den aktiven Tab über lokalen State `selectedId = useState(CERT_OS_V1_MAIN_AREAS[0].id)` (Default = Dashboard), **kein URL-Param**. `EmployeeAutomationPage.tsx` „Zur Übersicht" + `CompanyHubView.onBack` rufen `router.push("/")` → `/` öffnet immer den Default-Tab (Dashboard).
**Bau:**
- `CertificationOsModuleOverview.tsx`: aktiven Tab aus URL-Param `?area=<id>` lesen (Fallback = Default). Param beim Tab-Wechsel spiegeln (`router.replace`), SSR-stabil (Hydration-Lehre `01f720b`: erster Render = Default, Param erst nach Mount).
- `EmployeeAutomationPage.tsx` + `CompanyHubView`: Zurück-Ziel `"/?area=mitarbeiterakte"` statt `"/"`.
**Betroffene Dateien:** `modules/00-dashboard/CertificationOsModuleOverview.tsx`, `…/employee-file/EmployeeAutomationPage.tsx`, `…/employee-file/CompanyHubView.tsx`.
**DoD:** Akte öffnen → „Zur Übersicht" → Mitarbeiterakte-Tab + Firmenauswahl sichtbar; direkter Aufruf `/?area=mitarbeiterakte` öffnet den Tab; kein Hydration-Mismatch; tsc 0; EC-09-ZIP 200.

## #8 — GENERATOR-DATUM: global UND pro Dokument setzbar
**Ziel:** Beim Generator (Seite unten) ein **globales Datum für alle** Dokumente setzen **und** je Dokument einzeln überschreiben.
**Norm:** keine (Ausgabedatum). *(Inhaltliche Default-Logik der Unterweisungs-Daten = #10.)*
**Ist:** `app/actions/generate-employee-docs.ts:50` `const currentDate = formatTodayDocumentOutput()` — **global, hartkodiert „heute"**, nicht überschreibbar. Template-Platzhalter `{currentDate}` in `templateData.ts:115`.
**Bau:** Generator-Action akzeptiert ein optionales **`documentDates`-Mapping** (global-Default + per-Doc-Override) statt `new Date()`. UI im Generator-Tab: ein globales Datumsfeld („Datum für alle") + je gewähltem Dokument ein Override-Feld (Muster wie Termin-Planung Queue C: Bulk + Einzel-Override).
**Betroffene Dateien:** `app/actions/generate-employee-docs.ts`, `lib/templateData.ts`, Generator-UI im Dossier (`EmployeeFileDossierView` Generator-Tab).
**DoD:** globales Datum wirkt auf alle, Einzel-Override sticht; Default bleibt „heute"; ZIP enthält die gesetzten Daten; tsc 0; EC-09-ZIP 200.

## #9 — GENERATOR-GRUPPEN sauber lösen
**Ziel:** Klare Gruppen-/Stapel-Funktion (heute de facto über Mehrfach-Selektion vorhanden).
**Norm:** keine.
**Ist:** `EmployeeAutomationPage.tsx:85-87` `batchSelectedIds: Set<string>` + Checkboxen im Index; `handleGenerate()` exportiert alle Gewählten als ZIP (Ordner je MA). Funktioniert, ist aber nur „Selektion", kein benanntes Gruppen-Konzept.
**❓ RÜCKFRAGE (siehe unten Q9):** Was genau fehlt an der bestehenden Selektion? (a) nur sauberere UI/Beschriftung „X ausgewählt → als Gruppe exportieren", (b) **benannte/gespeicherte** Gruppen, (c) Gruppen nach Firma/Rolle? **Default-Bau (a)**, falls keine Antwort: Selektion als „Gruppe" klar labeln + „Alle/Keine"-Toggle + sichtbare Auswahl-Leiste. (b)/(c) erst nach Mark-Antwort.
**Betroffene Dateien:** `…/employee-file/EmployeeFileIndex.tsx`, `EmployeeAutomationPage.tsx`.
**DoD:** Auswahl-Stapel klar bedienbar + beschriftet; ZIP-Export der Gruppe 200; tsc 0.

## #7 — BESTELLUNGEN (appointments): falsche Unterweisung raus, Trennung sauber
**Ziel:** „Bestellungen" enthalten **nur** interne **Beauftragungen**: **Ersthelfer-, Brandschutzhelfer-, Sicherheitsbeauftragter-Bestellung** — **keine Schulungen/Unterweisungen**. Die fälschlich abgelegte Unterweisung verschwindet.
**Norm:** **CL-74** (Beauftragung ≠ Schulung — interne Bestellung getrennt vom Schulungs-Nachweis; Status `legal-input`, Trennung von Mark 2026-06-07 bestätigt) + Matrix §11. Erste Hilfe **CL-08**, Brandschutzhelfer **CL-23**, SiBe = betriebliche Bestellung (kein DIN-UE → keine erfundene Pflicht).
**Ist:** Appointment-Katalog wird **dynamisch aus S3 `/appointments/`** gelesen (`app/api/templates/route.ts:20-65`); Labels in `employee-display-labels.ts:39-56` (`safety-training`→Ersthelfer, `fire-safety`→Brandschutzhelfer, `compliance-training`→SiBe, + onboarding/medical-checkup/ergonomics). Eine **fälschlich abgelegte „Unterweisung"** liegt laut Mark im S3-Bestellungs-Ordner.
**Bau:**
- **Daten-Cleanup (S3):** die falsche Unterweisung aus dem `/appointments/`-Ordner entfernen. **❗ exakter Pfad/Datei = Mark muss ihn nennen (Q7)** — nicht raten, keine Kundendaten blind löschen.
- **Modell/Anzeige:** Bestellungen auf die **drei** zulässigen Typen begrenzen (Ersthelfer/Brandschutzhelfer/SiBe); klare Trennung Bestellung (intern) ↔ Schulungsnachweis (Evidence). Schulungs-Doks dürfen **nicht** als Appointment erscheinen.
**Betroffene Dateien:** `…/employee-file/employee-display-labels.ts`, ggf. `app/api/templates/route.ts` (Filter), S3-Ordner `/appointments/` (Daten, durch Mark/explizit).
**DoD:** nur die 3 Bestelltypen sichtbar; keine Schulung/Unterweisung unter Bestellungen; Generator-ZIP unberührt (EC-09); tsc 0.

## #3 — TALLY-MAPPING ↔ Doc-Slots abgleichen
**Ziel:** Von MA über Tally hochgeladene Nachweise landen am **richtigen** Nachweis-Slot der Akte.
**Norm:** Slots referenzieren die Nachweis-Typen — Dienstanweisung **CL-03**, Datenschutz **CL-04**, Verschwiegenheit **CL-05**, Erste Hilfe **CL-08**, Brandschutzhelfer **CL-23**, Sachkunde/Unterrichtung **CL-01/02**. (Reine Zuordnungs-Prüfung, keine neue Pflicht.)
**Ist:** `TALLY_FIELD_MAPPING.md` + `lib/data/tally-employee-slots.json` (10 Slots à ~7 File-Felder) + `tally-intake-service.ts` (`mapTallyUploadToEvidenceId`, evidenceId per Label-Pattern). Vorhanden, aber **Abgleich Slot↔Doc-Slot nicht verifiziert**.
**Bau:** **Audit + Korrektur** (kein Neubau): jeden Tally-File-Slot gegen die `evidenceId`-Konvention der Akte prüfen; Lücken/Fehl-Mappings auflisten + fixen, sodass jeder Tally-Upload an der erwarteten Stelle erscheint. Ergebnis als kurzer Abgleich-Report in `TALLY_FIELD_MAPPING.md` (Tabelle Tally-Feld → evidenceId → Akte-Slot, Status ok/fix).
**Betroffene Dateien:** `hq/10_Bridge/TALLY_FIELD_MAPPING.md`, `lib/data/tally-employee-slots.json`, `lib/tally-intake-service.ts` (+ `mapTallyUploadToEvidenceId`-Quelle).
**❓ RÜCKFRAGE (Q3):** Welche Nachweis-Slots sind verbindlich „pro Schulung/Unterweisung mit eigenem Datum" vs. „ein Slot je Typ"? (hängt mit #5/#10 zusammen).
**DoD:** vollständige Mapping-Tabelle, alle Tally-File-Felder landen am korrekten Slot (an Testsubmission verifiziert); EC-10 (`unchecked`) bleibt; tsc 0.

## #4 — MANUELLER UPLOAD signierter Dokumente
**Ziel:** Mark kann selbst unterschriebene Dokumente (Unterweisungen, eingereichte Schulungen) je MA hochladen.
**Norm:** Nachweis-Typen wie #3; EC-10: Upload-Status bleibt `unchecked`, **keine** Auto-Freigabe.
**Ist:** Evidence-Infra **existiert** (`employee-evidence-storage.ts` `saveEmployeeEvidenceFile`/`removeEmployeeEvidenceFile`/`loadEmployeeEvidence`; `uploadEmployeeEvidenceAction`; UI-Hooks `handleEvidenceUpload`/`handleEvidenceRemove` `EmployeeAutomationPage.tsx:371-405`, im Dossier). S3-Pro-Person-Struktur vorhanden.
**Bau:** **Verifizieren + lückenlos in der UI ausspielen** — sicherstellen, dass für **jeden** relevanten Nachweis-Slot (inkl. Unterweisungen + Einzelschulungen aus #10) ein sichtbarer Upload-/Entfernen-Button existiert. Falls Slots fehlen → ergänzen (gleiche Infra, nur Slot/`evidenceId`). **Kein** neues Storage-Modell.
**Betroffene Dateien:** `…/employee-file/EmployeeFileDossierView.*`, `employee-evidence-storage.ts` (nur falls Slot-Liste erweitert).
**DoD:** Mark lädt in der Akte ein PDF je Slot hoch → erscheint, bleibt nach Reload, Status `unchecked`; Live-Klick-Abnahme durch Mark (OS-Dateidialog nicht harness-automatisierbar); tsc 0; EC-09-ZIP 200.

## #2 — QUALIFIKATION: Dropdown statt Freitext (norm-gezogen, je clauseId)
**Ziel:** Reiter „Qualifikation" = **Auswahl vordefinierter Standardqualifikationen** (kein Freitext), jede mit Norm-Beleg.
**Norm-Mapping (Katalog-Werte → CL + Stufe A/B/C):**
- **Unterrichtung §34a** → **CL-01** (Eintritt; Stufe A-Einstieg; löst 6-Monats-Sachkunde-Frist **CL-02** aus).
- **Sachkundeprüfung §34a** → **CL-01/CL-02** (Stufe A, dauerhaft).
- **Geprüfte Schutz- u. Sicherheitskraft (GSSK)** → **CL-07** (Stufe B) / FK-qualifizierend **CL-10**.
- **Servicekraft für Schutz u. Sicherheit** → **CL-10** (FK-Liste) / Stufe B.
- **Geprüfte Fachkraft für Schutz u. Sicherheit** → **CL-07/CL-10** (Stufe C).
- **Meister für Schutz u. Sicherheit / IHK-Werkschutzmeister** → **CL-07/CL-10** (Stufe C).
- *(Stufe-Definitionen: Matrix §3 / CL-07. „Qualifiziert"-Verknüpfung: CL-40 — bleibt rechnerisch, EC-10.)*
**Ist:** `EmployeeForm.tsx:698-708` Freitext `qualification` (Placeholder „z. B. Sachkunde §34a"); `types/employee.ts:55` `qualification?: string`; Engine matcht den Freitext per Regex `hasSachkunde()`/`hasUnterrichtung()` (`requirement-engine.ts:292-297`).
**Bau:**
- Neuer **Qualifikations-Katalog** (Datei, je Eintrag: `id`, Label, `clauseId`, Stufe A/B/C, Flags `erfuelltSachkunde`/`fkQualifizierend`). **Keine erfundenen Einträge** — nur obige CL-belegte.
- `EmployeeForm` → Dropdown statt Freitext; Engine liest **strukturierten Wert statt Regex** (Migration: bestehende Freitexte tolerant mappen, unbekannt → „fachlich prüfen", nichts verlieren).
- **EC-10:** Auswahl erzeugt **keine** „qualifiziert/auditfähig"-Aussage; nur Eingangsgröße der rechnerischen Ampel.
**Betroffene Dateien:** neuer `…/employee-file/qualification-catalog.ts`, `components/employee/EmployeeForm.tsx`, `validations/employee-form.ts`, `types/employee.ts`, `…/employee-file/requirement-engine.ts` (+ Engine-Suite), Repository (Read-Migration/Persistenz).
**❓ RÜCKFRAGE (Q2):** **single- oder multi-select?** (Eine Person kann real Unterrichtung→Sachkunde **und** zusätzlich GSSK/Meister haben → spräche für multi; aber Engine-Logik „höchste Stufe zählt". Bitte entscheiden.)
**DoD:** Dropdown mit CL-belegten Optionen; Engine nutzt strukturierten Wert; Migration verlustfrei; Engine-Suite erweitert + grün; tsc 0; EC-09/EC-10.

## #6 — ROLLEN ausbauen (mehrere Rollen, saubere Begriffstrennung)
**Ziel:** Mehrere Rollen pro MA; Rolle steuert die Standarddokument-Auswahl. Begriffe sauber: **Organisationstitel** (vorerst irrelevant) · **Einsatzkraft/Führungskraft** (steuert Grundset) · **Unterweisungs-Logik** separat. „standard models" des Upload-Managers = **Tool 1**, **nicht** mit Tool 2 vermischen.
**Norm:** Norm-Klassen EK/FK = **CL-06/CL-10** (FK-Quali), Grundset über die abgenommene Engine. Org-Titel = reine Anzeige (keine Norm-Wirkung).
**Ist:** Modell ist bereits mehrrollig: `roleClasses: RoleClass[]` (`ek|fk|verwaltung|praktikant|subunternehmer`, frei kombinierbar) treibt die Engine; `roleType` = Org-Titel (Anzeige); **`roleId` (Einzahl!)** steuert die **Generator-Dokumentenpalette** (`selectedRoleDocIds`). **Lücke:** Die **Dokument-Auswahl hängt an genau einem `roleId`** — „nur 1 Rolle" bezieht sich darauf.
**Bau:**
- Generator-Dokument-Auswahl von **einem** `roleId` auf **mehrere** Rollen erweitern (Vereinigung der Doc-Sets), analog zur EK/FK-Mehrfachauswahl. Begriffs-Collision auflösen: in der UI klar „Norm-Klasse(n)" (Grundset) vs. „Rolle/Doku-Vorlage(n)" (Generator-Palette) vs. „Org-Titel".
- **Tool-1-`standard models` strikt draußen halten** (kein Import/keine Vermischung).
**Betroffene Dateien:** `components/employee/EmployeeForm.tsx`, `types/employee.ts` (`roleId`→`roleIds`?), Generator-Doc-Auswahl + Repository-Mapping, `app/actions/generate-employee-docs.ts`.
**❓ RÜCKFRAGE (Q6):** Bedeutet „mehrere Rollen" (a) mehrere **Doku-Paletten** (`roleId`→`roleIds`, Doc-Sets vereinigen) **oder** (b) reicht die bereits vorhandene EK/FK-Mehrfachauswahl und es geht nur um die Generator-Palette? Bitte bestätigen, ob `roleId`→`roleIds` migriert werden soll (berührt Generator + Persistenz).
**DoD:** mehrere Rollen wählbar, Doc-Set = Vereinigung, Begriffe in UI getrennt, Tool-1 unvermischt; Migration verlustfrei; tsc 0; EC-09-ZIP 200.

## #5 — UE-ANERKENNUNG beim Schulungs-Upload
**Ziel:** Beim Upload einer Schulung werden deren **UE erkannt/zugeordnet und aufsummiert** (welche Schulung = wie viele UE), Soll/Ist-Ampel reagiert.
**STATUS-ANTWORT auf Marks Rückfrage:** **Nein, wird aktuell NICHT automatisch erkannt.** `weiterbildungIstUE`/`einmaligIstUE` sind **manuell**; `trainingPlan` (Queue C) ist operative Planung **ohne Auto-Ist** (bewusst geparkt — „Ist-UE-Auto-Summe" = Queue E). Upload triggert keine UE-Berechnung.
**Norm:** UE-Werte kommen aus der Engine — Jahres-Weiterbildung **CL-11** (40/24), Einmalschulungen **CL-20/21/24/25/29/30**, **Anrechnung CL-27** (Einmalschulung auf Jahres-WB im Erwerbsjahr). **Keine neuen UE-Werte erfinden** — nur diese.
**Bau (neues Feature, war geparkt):** Beim Schulungs-Upload eine **UE-Zuordnung** ermöglichen → fließt in `einmaligIstUE`/`weiterbildungIstUE` und damit in die Soll/Ist-Ampel. **EC-10:** Upload = `unchecked`; UE-Summe ist „rechnerischer Ist-Stand", **keine** Bestätigung der Schulung.
**❓ RÜCKFRAGE (Q5):** Wie soll die UE je Upload **bestimmt** werden? (a) Mark **gibt die UE beim Upload manuell ein** (einfachste, norm-neutral), (b) **Katalog-Zuordnung** (Schulung wählen → UE aus Katalog, CL-belegt, anrechnungslogik CL-27), (c) **automatische Extraktion** aus dem Dokument (OCR/Heuristik — unsicher, EC-10-heikel, eher nein). **Planer-Empfehlung: (b) Katalog + (a) als Override.**
**Betroffene Dateien:** `…/employee-file/training-plan.ts` + `training-catalog.ts` (Anrechnung), Evidence-Upload-Pfad, Repository (`einmaligIstUE`/`weiterbildungIstUE`), Ampel-Merge-Stelle. **Engine selbst unberührt** (liest nur Ist).
**DoD:** Upload mit UE-Zuordnung → Ist-UE steigt, Ampel reagiert, CL-27-Anrechnung korrekt, `unchecked` bleibt; Suite + tsc grün; EC-09-ZIP 200.

## #10 — DATUMS-LOGIK / DEFAULTS (Generator + fehlende Standarddokumente)
**Ziel:** Sinnvolle Default-Daten für Unterweisungen/Schulungen, überall änderbar:
- **Geburtsdatum:** Tool übernimmt `birthday` → erscheint auf Schulungen. *(Ist: `birthday` existiert; auf Template ziehen.)*
- **Fehlende Erst-Standardunterweisung** (enthält **Datenschutz CL-04**, **Verschwiegenheit CL-05**, **Arbeitsschutz [kein DIN-CL → legal-input, s. Q10a]**) **+ Datenschutz-/Verschwiegenheitserklärung** → **Default-Datum = erster Arbeitstag** (`startDate`/Einstellungs-/Vertragsdatum). Änderbar; MA unterschreibt nach.
- **> 1 Jahr seit Erstunterweisung vergangen** → zusätzlich **Wiederholungsunterweisung** [Arbeitsschutz-jährlich = **kein DIN-CL → legal-input**, s. Q10a]. *(Einweisung Dienstanweisung = **CL-03**.)*
- **Einzelschulungen** → **individuelles Datum** (manuell, je Eintrag — deckt sich mit #8 per-Doc-Override + Queue-C-Einzel-Override).
- **Objektbezogene Unterweisung** → Default = **erster Arbeitstag/erster Einsatz**; **CL-22** (objektspezifisch, SDL bes. SR); später ggf. mit Projektakte verknüpfen.
**Norm:** CL-03 (Dienstanweisung), CL-04 (Datenschutz), CL-05 (Verschwiegenheit), CL-22 (objektbezogen). **Arbeitsschutz-Grundunterweisung + jährliche Wiederholung = NICHT in DIN 77200 → kein CL → „fachlich prüfen"/legal-input** (Guardrail: nicht erfinden). Vgl. CL-73 (Fahrer/UVV, legal-input) als Muster.
**Ist:** `startDate`/`birthday` vorhanden (`types/employee.ts:31-35`); **keine** Default-Datums-Logik für Unterweisungen; Generator-Datum global „heute" (#8). Unterweisungs-Typen über Engine-Regeln, kein eigener Datums-Default.
**Bau:** Default-Datums-Ableitung (startDate → Erstunterweisung/Erklärungen; >1 J. → Wiederholungs-Flag; objektbezogen → startDate/erster Einsatz), überall **überschreibbar** (greift in #8-Per-Doc-Datum). Arbeitsschutz-/Wiederholungs-Posten **als „fachlich prüfen" markieren**, bis Mark die Rechtsgrundlage liefert (Q10a).
**Betroffene Dateien:** `app/actions/generate-employee-docs.ts`, `lib/templateData.ts`, Engine-Fristen-Stelle (nur Default-Daten, **keine** neue UE/CL), Dossier-Generator-UI.
**❓ RÜCKFRAGEN:** Q10a (Arbeitsschutz-/Wiederholungsunterweisung: Rechtsgrundlage/Turnus = Mark legal-input → neue CL), Q10b („erster Einsatz" für objektbezogene Unterweisung: woher kommt das Datum, bis Projektakte existiert — manuell?).
**DoD:** Defaults greifen + überall änderbar; Geburtsdatum auf Schulungen; >1-J.-Wiederholung erscheint; Nicht-DIN-Posten „fachlich prüfen" (kein erfundener Wert); tsc 0; EC-09-ZIP 200.

---

## 📋 OFFENE RÜCKFRAGEN AN MARK (nicht raten — vor P2/P3 klären)
- **Q2 (Qualifikation):** single- oder multi-select im Dropdown?
- **Q3 (Tally/Slots):** Nachweis-Slots „je Schulung mit eigenem Datum" vs. „ein Slot je Typ"?
- **Q5 (UE-Anerkennung):** UE je Upload (a) manuell eingeben, (b) Katalog-Zuordnung [Empfehlung], oder (c) Auto-Extraktion?
- **Q6 (Rollen):** `roleId`→`roleIds` migrieren (mehrere Doku-Paletten), oder reicht die vorhandene EK/FK-Mehrfachauswahl + Generator-Palette?
- **Q7 (Bestellungen):** **exakter S3-Pfad/Dateiname** der fälschlich abgelegten Unterweisung (zum Entfernen — nicht raten, keine Kundendaten blind löschen).
- **Q9 (Gruppen):** reicht die Selektion sauber gelabelt, oder benannte/gespeicherte Gruppen (nach Firma/Rolle)?
- **Q10a (Arbeitsschutz/Wiederholung):** Rechtsgrundlage + Turnus (ArbSchG/DGUV §) → neue CL ins Register.
- **Q10b (objektbezogen):** Datumsquelle „erster Einsatz" bis Projektakte existiert — manuell?

## DoD (gesamt)
- Pro Phase eigener Commit; nach jeder Phase: `tsc --noEmit` 0 · Engine-Suite (`tsx --test`) grün (bei #2/#5/#6/#10 erweitert) · **EC-09-ZIP `POST /employee-automation` 200** · EC-10 (`unchecked`, kein Freigabe-Wording) · keine erfundene Normpflicht (jede Regel CL-belegt oder „fachlich prüfen").
- Browser-Akzeptanz je Punkt im echten `:3001` (bzw. Mark-Klick für OS-Dateidialoge).
- Offene Rückfragen vor P2/P3 von Mark beantwortet; bis dahin **nur P1 baubar**.
