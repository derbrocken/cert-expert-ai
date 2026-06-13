# HANDOFF — Briefkasten Claude ⇄ Cursor

**Regel:** Kurze, datierte Einträge. Erledigtes nach unten ins Archiv. Keine Romane.
**📁 Historie:** Ältere Abschluss-Einträge + frühe Reviews/Freigaben (Slice 0/0a/0b, Slice 1 + Nachzug, Tally-Intake/Webhook, Stabilisierung, Overviews, Slice-2-Bau) → **`HANDOFF_ARCHIV.md`** (Schnitt 2026-06-07, nichts gelöscht).

**Rollen-Kontrakt (verbindlich, `CLAUDE.md`):** Planung/Review/Norm-Mapping = **Planer (Spur P)**. Der **Executor** baut nur den Bauauftrag, committet, hängt **EINEN** kurzen Ergebnis-Eintrag an + kippt den HIER-STARTEN-Status — **schreibt keine Specs um, plant nichts neu**. Neue Idee/Scope-Frage → als Frage an den Planer.

**Übergabe-Takt (Agent):** Nach Task/Slice/Commit → Mark erinnern: „✅ stabiler Punkt — Committen/Übergeben (neuer Chat)." Bei ~70–80 % Context → „Übergabe empfohlen." Ablauf: stabil → commit → **Abschluss-Eintrag** (fertig/offen/nächster Schritt/Hashes) → neuer Agent liest `CLAUDE.md` + HANDOFF. Gedächtnis = Repo, nicht Chat.

> ## ▶ HIER STARTEN — AKTUELLER STAND (2026-06-13) · ÜBERGABE an neuen Planer
> **▶ JETZT — AKTE-UMBAU S1a+S1b LIVE (2026-06-13): EINE Akte-Ansicht + Inline-Anlegen.** Marks Befund „Akte aus Tool-2-Queue gewachsen, drei Sichten, Name roh löschbar" → **Zieldesign** `MITARBEITERAKTE_ZIELDESIGN.md` (vertikaler Lebenszyklus Anlegen→Tally→Ausrechnung→Prüfung→Audit; DA1=inline, DA3=Audit nach Projektakte, DA4=S1→S2→S3). **S1a:** Bearbeiten/Übersicht-Umschalter weg → EINE Akte (Ansehen-Standard + akte-weiter „Bearbeiten"-Stift); Person&Rolle nur im Bearbeiten-Modus editierbar (Name/IDs nicht mehr versehentlich löschbar); Bestellungen edit-gegated. **S1b:** „Neue Person" öffnet leeren Akte-Entwurf inline; **kein** Auto-Speichern beim Tippen → expliziter „Person speichern"-Knopf (Name Pflicht) + „Verwerfen"; bleibt danach im Bearbeiten-Modus; keine Geister-Akten. **Browser-verifiziert (Mark, lokal)** inkl. Speichern-Fix. Live `20e6bf9` (kein Schema-Change). Gates: tsc 0 · Suite 198/198 · build grün. EC-09: Generator/ZIP unberührt. **Nächster Schritt: Maske-Konzept** — Sub-Agent erstellt `AKTE_MASKE_KONZEPT.md` (neu gedachte Eingabe-Maske mit allen Anforderungen, Varianten + Empfehlung) → Mark-Gate, dann gebaut. Offene Fäden: S2 (Status-Band), S3 (Prüf-Sektion), DA2 (Generator/Doc-Auswahl-Sektion, wartet auf Marks Input), Tally-Aufräumen `Y5Zq80` + neue Form „Projektunterlagen" (`TALLY_FORMULARE_SOLL.md`, Mark bestätigt ODA/SK/Freigabe).
> **▶ FRAMEWORK P2-B LIVE: Firmen-Dokumenten-Lager (2026-06-13).** Deployt `5af2720`→**`15cac89`** auf cos.cert-expert.de (DB-Backup `pre-deploy-2026-06-13-180038.db` + `db push` additiv, kein Datenverlust: 6 MA + 6 Settings intakt; Endpunkte 200, Tabelle verifiziert). **Abnahme offen (Mark):** echte `Y5Zq80`-Submission mit Firmen-Dokumenten + manueller Upload/„geprüft"-Toggle im Upload-Manager-Abschnitt „Firmen-Dokumente" live klicken. — Volle vertikale Slice (C-10-Gate von Mark erteilt): **neue additive Tabelle `CompanyDocumentItem`** (+ Back-Relation an `Company`, `@@unique([companySlug, documentId])`) — spiegelt `EvidenceItem` auf Firmen-Ebene. **Katalog** `lib/company-documents-catalog.ts` = 9 Slots mit verifizierten `Y5Zq80`-Keys (Unbedenklichkeit 1+2 `AlyLkk`/`BG0kvN`, Gewerbezentralregister `kYv6LM`, Handelsregister `vNKyRQ`, Bewachungserlaubnis `KMklX7`, Versicherung `LdkWl1`, Datenschutz `pLvBab`, Verschwiegenheit `1r678W`, Mindestlohn `MAMzBX`). Pure Parser `parseCompanyDocuments` (tolerant). `processCompanyIntake` lädt nach Logo jedes Firmen-Dokument → S3 (`cea/companies/{slug}/documents/{documentId}/…`) → `CompanyDocumentItem` (`status:"unchecked"`). Repo load/save/remove/setChecked (neue Datei resettet Status = EC-10). UI `CompanyDocumentsPanel` als neuer Abschnitt „Firmen-Dokumente" im Upload-Manager (`/uploads`): 9 Slots, Preview (presigned), Upload/Ersetzen/Entfernen, „geprüft"-Toggle (kein Auto-Grün). **Gates: tsc 0 · `next build` grün · Suite 198/198** (+3: Katalog+Parser). EC-09 n/a, EC-10 gewahrt. **⚠️ DEPLOY braucht `db push`** (additive Tabelle) + DB-Backup. **Abnahme offen:** echte `Y5Zq80`-Submission mit Firmen-Dokumenten → Lager + Anzeige (Mark, nach Deploy). Commit-Hash siehe unten. Plan: `FRAMEWORK_P2_COMPANY_TALLY.md` §3.
> **▶ FRAMEWORK P2-A LIVE + VERIFIZIERT (2026-06-12): Company-Tally → Firmen-Profil + Logo.** Echte `Y5Zq80`-Submission verifiziert: `Wolf Street GmbH` + Logo → DB `logoStorageKey=cea/companies/Wolf_Street/logo.jpg`, `logo:true`. **Webhook `3EQpao` per API angelegt** (Y5Zq80→`/api/webhooks/tally`, Secret wie `wMzjM0`). Tally hatte vorher nur (deaktivierte) make.com-Webhooks auf `Y5Zq80` → kein direkter zu uns → deshalb kam nichts an; jetzt gefixt. **Logo-Erkennung robust** (Mark lud Logo in unbeschriftetes Feld `lN267B`, nicht gelabeltes `J2MA7d` → Fallback „logo" in Label/Dateiname). **Race-Fix** create→upsert (Tally-Doppel-Zustellung). Live `5af2720`, Suite 195/195. **Tally-Key wieder gültig** (questions+webhooks ok, responses 401). **Offen P2-B:** Firmen-Dokumente (FILE_UPLOADs `AlyLkk`/`BG0kvN`/`kYv6LM`/`vNKyRQ`/`KMklX7`/`LdkWl1`/`pLvBab`/`1r678W`/`MAMzBX`) → company-level Dok-Lager (eigene Phase). **Form-UX (Mark):** `Y5Zq80` = Entwurf mit vielen unbeschrifteten Datei-Feldern → aufräumen sinnvoll. Plan: `FRAMEWORK_P2_COMPANY_TALLY.md`.
> **▶ FRAMEWORK P2-A GEBAUT: Company-Tally → zentrales Firmen-Profil (2026-06-12, davor):** (P3c bewusst zurückgestellt — Mark wählte P2.) Tally-Formular „Unternehmensunterlagen" (`Y5Zq80`) füllt jetzt `CompanyExportSettings` (Name+E-Mail+**Logo**→S3). **Feld-Keys via Tally REST API verifiziert** (Key wieder gültig): `7dM2QA`/`blvxao`/**`J2MA7d`** (Logo). Webhook-`Y5Zq80`-Zweig in `tally-intake-service.ts` (`processCompanyIntake`) + pure Parser `tally-company-intake.ts` (+5 Tests) + Config. Tolerant, EC-10, kein Schema-Change. Firmen-Dokumente (FILE_UPLOADs) = **P2-B** (eigene Phase, braucht company-level Evidence-Modell). Gates: tsc 0 · Tests **194/194** · Build grün. **⚠️ AKTIVIERUNG (Mark/Tally-UI, 2 Schritte):** (1) `Y5Zq80`-Webhook auf `…/api/webhooks/tally` setzen (gleicher Signing-Secret; API-Webhook-Pfad 401 → UI), (2) echte Submission → Profil+Logo verifizieren. Plan: `FRAMEWORK_P2_COMPANY_TALLY.md`. Commit-Hash siehe unten.
> **▶ FRAMEWORK P3b FERTIG: Mitarbeiter-Formular konsumiert Sammlungen (2026-06-12, davor):** Design-Gate locked (`FRAMEWORK_P3B_FORMULAR_KONSUM.md`: Safe-Map Ein-Rollen-Modell · Selektor ersetzt setKategorie-Dropdown · Pflicht-Lock · `collectionId`-Persistenz). **Gebaut + Mark-abgenommen.** Pure `collection-employee-mapping.ts` (+6 Tests: Pfad→Doc-ID, Seed=bisheriges Verhalten, Custom-Inclusion, cross-role→unsupported). Formular: „Set-Kategorie"-Dropdown → **„Vorlagen-Sammlung"** (Vordefinierte+Custom), Apply via nachgelagertem Effekt (kein Effect-Fighting), Pflicht-Doks gesperrt+Badge, unsupported-Hinweis (amber). Additive Spalte `collectionId String?` (Akte). **Generator/Engine NICHT angefasst (EC-09).** Gates: tsc 0 · Tests **189/189** · `next build` grün. **⚠️ DEPLOY braucht `db push`** (additiv `collectionId`) + Backup. **Nächste Phase:** P3c (Katalog ↔ Sammlungen zu EINER Quelle + ggf. voll ordnerübergreifend). Commit-Hash siehe unten.
> **▶ NAVIGATION/ORIENTIERUNG FERTIG (2026-06-12, davor):** `Navbar.tsx` umgebaut (`FRAMEWORK_NAV_ORIENTIERUNG.md`): aus dem einen „Upload Manager"-Button wurde eine **gleichwertige 3er-Leiste** Mitarbeiterakte (Tool 2 `/employee-automation`) · Dokument-Generator (Tool 1 `/model-creator`) · Upload-Manager (`/uploads`), mit **Aktiv-Markierung** (`usePathname`, rote Cert-Expert-Akzentfarbe). Behebt Marks „Tool 1 vergraben / läuft nicht rund". Reine Anzeige — 1 Datei, keine Logik/Daten. Logo → Modul-Übersicht `/` (unverändert). Gates: tsc 0 · `next build` grün. Mark-abgenommen (localhost). Commit-Hash siehe unten.
> **▶ FRAMEWORK P3a FERTIG: editierbare Sammlungen (Datenmodell + Admin, 2026-06-11, davor):** Design-Gate P3 locked (`FRAMEWORK_P3_EDITIERBARE_SAMMLUNGEN.md`: frei zusammenstellbar · global · 3 Inclusion-Stufen · 3 Vordefinierte read-only+klonbar · DB · Tab im Upload-Manager). **P3a gebaut + Mark-Browser-abgenommen** (`FRAMEWORK_P3A_DATENMODELL_ADMIN.md`): **2 additive Tabellen** `DocumentCollection`+`DocumentCollectionItem` (Bestandsdaten unberührt); pure Model `document-collection-model.ts` (+8 Tests: Whitelists/Seed-Schutz/Klon) + Repo + Actions; **Seeds** der 3 Vordefinierten idempotent aus `vorlagen-set-catalog.ts` abgeleitet (Katalog NICHT umgeschrieben → Tool 2 unverändert); Admin-UI `CollectionsManager.tsx` als neuer „Sammlungen"-Abschnitt in `UploadsPage.tsx` (Liste + Editor mit Template-Picker + Pflicht/Optional/Datumsquelle + Klonen/Löschen, Seed-Löschschutz). Gates: tsc 0 · Unit 23/23 · Tool-2-Suite **160/160** unberührt · `next build` grün · **DB-Seed-Smoke** (3 Seeds, idempotent, create/clone/seed-protect/delete ✓). **EC-09:** Generator/Akte/Formular nicht berührt (P3a = reine Verwaltung). **⚠️ DEPLOY braucht `db push`** (additiv) + DB-Backup. **Nächste Phasen:** P3b = Mitarbeiter-Formular konsumiert Sammlungen · P3c = die zwei Ebenen (Katalog ↔ Sammlungen) zu EINER Quelle. **UX-Faden (Mark gemeldet):** Tool 1 tief im QM-Modul vergraben, Upload-Manager-Button separat, Firma-Profil-Box oben auf `/uploads` verwirrt → Navigation/Orientierung als eigener kleiner Schritt offen. Commit-Hash: siehe unten.
> **▶ FRAMEWORK P1 FERTIG: Tool 1 ans zentrale Firmen-Profil (2026-06-11, davor):** Architektur-Framework Tool1+Tool2+Upload-Manager geplant (`FRAMEWORK_TOOL1_TOOL2_UPLOAD.md`, P0 locked: Unternehmen im Zentrum, 3 Schichten, 2 Generatoren; Erkenntnis: zentrales Profil `CompanyExportSettings` + Set-Sammlungen `SetKategorie` existieren bereits — nur nicht verdrahtet). **P1 gebaut + Mark-Browser-abgenommen** (`FRAMEWORK_P1_TOOL1_FIRMENPROFIL.md`): Tool 1 hat jetzt **Firmen-Dropdown** (`fetchCompaniesAction`) → wählt Firma → Name/Adresse/Doc-Meta vorausgefüllt (überschreibbar) + **Logo-Vorschau** aus `CompanyExportSettings`; Logo-Auflösung manuell>Profil>keins (`getExportSettings(slug).companyLogo`). Pure Helper `tool1-company-profile.ts` + **7 Tests**. Straße/PLZ/Stadt/Land bewusst manuell (im Profil nicht vorhanden, kein erfundenes Mapping). Gates: tsc 0 · P1-Tests 7/7 · Tool-2-Suite 160/160 unberührt · `next build` grün. Kein Schema-Change, Write-Set nur Tool-1 (`DocumentForm.tsx`, `send-model-entries.ts` + Helper). **D4 (Mark): vordefinierte Set-Kategorien BLEIBEN + editierbare Sammlungen gewünscht (P3).** **Nächste Phasen:** P2 = Company-Tally `Y5Zq80` verdrahten (Logo-Feld in Tally existiert schon) · P3 = editierbare Sammlungen. Commit-Hash: siehe unten.
> **▶ TOOL 1 BUG-FIX-PASS FERTIG (2026-06-11, davor):** Geplant zuerst (Einseiter `TOOL1_PLAN_DOCUMENT_CREATOR.md`, Mark abgenommen) → DANN EIN sauberer Bau-Pass (#1–#7). **Browser-Abnahme durch Mark = bestanden.** Fixes: #1 `docDate`-`.min(1)`-Guard · #2 Leer-Guard (kein leeres „Erfolgs"-ZIP) · #3 defektes Template → skip+log statt Abbruch (EC-09, amber UI-Hinweis) · #4 Logo-try/catch → klare Meldung · #5 Dead-Payload `documents[]`/`GeneratedDocument` raus · #6 UI+Fehlertexte komplett DE · #7 pure Plan-Logik `model-document-plan.ts` + **8 Unit-Tests** (u. a. Doc-ID-Parität API↔Server). **#8 (zentrales Firmenprofil/Logo, `CONTEXT.md`) bewusst NICHT angefasst** — separater Plan + C-10-Gate. Gates: tsc 0 · neue Tests 8/8 · Tool-2-Suite **160/160 unberührt** · `next build` grün. Write-Set NUR Tool-1-Dateien (`send-model-entries.ts`, `model-document-plan.ts`(+test), `model-creator/page.tsx`, `DocumentForm.tsx`, `api/standard-models/route.ts`, `validations/model-form.ts`). **Commit `0ad7936` gepusht + DEPLOYT (2026-06-11):** `cos.cert-expert.de` live auf `0ad7936`, kein Schema-Change, Endpunkte 200, DE-Strings live verifiziert (`HETZNER_DEPLOY.md` LIVE-STAND). **Lektion umgesetzt (Mark):** Bug-Fix und Umbau NICHT vermischen — erst gemeinsam planen, dann ein Zug.
> **▶ STAND DAVOR: `main` = `9b8c0b9`, LIVE auf cos.cert-expert.de = Code `e84e599`.** Suite **160/160**, next build grün. Diese Session (langer Terminal-Planer-Lauf) hat erledigt + deployt: **Tool-2-Feedback (10 Pkt + A–E + Q8)** · **Vorlagen-Integration** (30 Vorlagen in S3 + 5 selbst erstellte Dok. aus Brandschutzhelfer-Shell + Set-Mapping verdrahtet) · **Schulungen/Bestellungen/Upload/Prüfstatus-Flow (P1–P4)** · **Schulung „Durchführung von–bis"** · **modulare DIN-1-Schulungen generierbar** (zugewiesenes Modul → `.docx` im ZIP unter `Schulungen/`, Smoke bestätigt). Register CL-75/76/77 = belegt.
> **▶ TALLY-KLÄRUNGEN (Mark, 2026-06-10) — für den Tally-Ausbau:** (a) **EH/Brandschutz „gültig bis"** aus Erteilungsdatum ableiten (EH +2 J. CL-08, Brandschutz +3 J. CL-23) — **Datum ist in Tally** (EH+Brandschutz-Schulung). (b) **Norm-Klasse** = Tally-Feld **„1.b Position Rolle"** (roleType). (c) **Geltungsbereich (SDL)** = bewusst **manuell in der App** (Kunde versteht's nicht) — NICHT in Tally. (d) **„Fährt Dienstfahrzeug"** = in Tally hinzugefügt. **OFFEN (Tally-Wiring, Mark liefert questionIds/Test-Submission):** Schulungs-Durchführungsdatum (P4 `dateQuestionId`), Dienstfahrzeug-Feld, EH/Brandschutz-Erteilungsdatum→gültig-bis-Ableitung, Einstellungsdatum (`startDate`) — fehlt noch in Tally-Mapping.
> **▶ OFFENE FÄDEN (Mark terminiert, kein Blocker):** 1. Login/Rollen-Gate für „geprüft"-Toggle (heute Edit-Modus-gegated, „von"=Admin fix). 2. Tally-questionIds mappen (s. o.) — Mark macht Test-Submission, neuer Planer liest IDs aus Webhook-Log + trägt in `tally-employee-slots.json`. 3. Alte `appointments/unterweisungen/`-Kopien (2 Keys) löschen — **Auto-Classifier blockt agent-Delete**, Mark gezielt/Settings. 4. EmployeeForm-Master-Edit-Pfad (#6 wörtlich im Formular). 5. Modul-Dateinamen 2–8 = verifiziert = echte S3-Namen (ok). Quellen: `CODE_REVIEW.md` (Dispatch v1–v6, Lane J–S, P1–P4), `BENOETIGTE_VORLAGEN.md`, `CURSOR_TOOL2_FEEDBACK_AUFTRAG.md`, `CURSOR_TOOL2_SCHULUNGEN_FLOW_AUFTRAG.md`, `HETZNER_DEPLOY.md` (LIVE-STAND).
> **▶ ARBEITSMODUS (Mark):** EIN Terminal-Planer plant + baut (Guardrail entfernt). In-Chat-Subagenten (worktree-isoliert) statt Cursor-Chats; Custom-Agents `.claude/agents/executor-a|b.md` (greifen nach Session-Reload). Pro Lane: review (tsc/Suite/next build/Disjunktheit) → merge → push → cleanup → Mark-Go für Deploy. **Deploy NUR auf explizites „deploy" (Classifier-Gate). S3-Deletes blockt der Classifier.** Memory `arbeitsmodus-mehr-kontrolle`.
> **▶ VORHER — Schulungen/Flow P1–P4 + Vorlagen (2026-06-10):** Marks 7 Live-Test-Punkte gebaut, reviewt, gemergt UND live (4 sequenzielle Lanes P1–P4, worktree-isoliert, je Planer-Merge-Gate): #1 Bestellungen-Wiring · #2 eigener Schulungen-Abschnitt · #3 Datum-Default startDate · #4 verifiziert · #5 Tally-/Upload-Datum · #6 Upload Anlegen+Bearbeiten · #7 Prüfstatus („geprüft"-Toggle → Ampel grün, EC-10 kein Auto-Grün). Neue additive Spalte `evidenceChecks Json?` (db push beim Deploy, Backup). Suite **153/153**, next build grün, Endpunkte 200. Register CL-75/76/77 belegt. **Offen (Mark, kein Blocker):** Admin-/Rollen-Gate für „geprüft" (kein Auth-System), reale Tally-date-questionIds (Tally-Feld anlegen), alte `appointments/unterweisungen/`-Kopien löschen (Classifier blockt), EmployeeForm-Master-Edit-Pfad. Review: `CODE_REVIEW.md` (P1–P4), Bauauftrag `CURSOR_TOOL2_SCHULUNGEN_FLOW_AUFTRAG.md`.
> **▶ VORHER — Vorlagen-Integration live (2026-06-10): `main` war `fe17ad5`** (30 Vorlagen in S3, Set-Mapping verdrahtet).
> **▶ EXECUTOR-STATUS (2026-06-10): Lane O P2 (Schulungen-Abschnitt #2 + Datum-Default startDate #3) = FERTIG + committet `a2fe6b9` auf Branch `lane-o-p2-schulungen` (ab `origin/main` `205595a`), NICHT gepusht/gemergt.** Gates grün: tsc 0 · Suite 137/137 (6 neue #3-Tests) · `next build` Compiled successfully. Details + geparkte Fragen → unten „Von Cursor an Claude". **Wartet auf Planer-Review + Mark-Merge-Gate.**
> **▶ JETZT — VORLAGEN-INTEGRATION KOMPLETT + LIVE (Terminal-Planer, 2026-06-10): `main` = `fe17ad5`, DEPLOYT.** 30 Dokumentvorlagen serverseitig in S3 eingespielt (`roles/sicherheitsmitarbeiter|fuehrungskraft|buerokraft` = Basis+Stellenbeschreibung; `appointments/bestellungen|betriebsanweisung|mutterschutz|objektbezogen|veranstaltung`). **5 Dokumente neu erstellt** (Bestellung Ersthelfer+SiBe, Kfz-Fahranweisung, Mutterschutz-Merkblatt, Bildschirmarbeitsplatz — aus Brandschutzhelfer-Shell, §§ korrekt, Mark-„Wording ok"). `vorlagen-set-catalog.ts` auf **reale Slugs** verdrahtet (FK inkl. Bildschirm), templateMissing-Flags gelöst. Suite **127/127**, next build grün, `/api/templates` zeigt 4 Rollen, kein Schema-Change. Register CL-75/76/77 = **belegt**. **Offen (Mark, gezielt):** alte `appointments/unterweisungen/`-Kopien löschen (Route-Filter blendet aus; Mass-Delete vom Auto-Classifier blockiert); modulare-Schulungen-UE-aus-Dateiname (#5-Folge-Touch). Doku: `BENOETIGTE_VORLAGEN.md`, `HETZNER_DEPLOY.md`.
> **▶ VORHER — TOOL-2-FEEDBACK KOMPLETT + LIVE (2026-06-09): `main` war `03429b2`.** Alle 10 Feedback-Punkte + A–E + Q8 gebaut, reviewt, gemergt UND live (In-Chat-Subagenten `executor-a/b` bzw. generisch, worktree-isoliert, je Planer-Merge-Gate). Reihenfolge: #1/#A/#B/#9 · #7/#C · #3 · #8 · #2 · #D · #4 · #10 · #5 · Persistenz-Migration (A1/A2/A3: `bestelltAls`/`bestellungSchulungLink`/`setKategorie`/`generatorDates`) · Set-Mapping+Org-Titel+Mutterschutz (`gender`) · Q8 (`perDocType`). **5 neue additive nullable Spalten** beim Deploy via `db push` (Backup `pre-deploy-2026-06-09-210010.db`, kein Datenverlust). Suite **127/127**, **`next build` grün** (= jetzt fester Review-Gate, nachdem Lane I einen sync-Export aus „use server" eingeschleust hatte → gefixt `36c4509`, hätte sonst den Deploy gebrochen). **Offen (Mark liefert):** fehlende Vorlagen-`.docx` (`BENOETIGTE_VORLAGEN.md`), exakte DGUV-Nummern (CL-75), CL-76/77-§-Bestätigung, **S3-Move** `appointments/unterweisungen/Unterweisungsnachweis_Arbeitsschutz_DGUV.docx` (#9, Route-Filter blendet bis dahin aus). Review-Details: `CODE_REVIEW.md` (Dispatch v1–v6 + Lane J–M).
> **▶ VORHER — FIRMEN-IA + MANUELLE FIRMA-ANLAGE (2026-06-09): `main` = `3cf0fc1`.** Drei UI-Features gebaut+gemergt: (1) **„Neue Firma"-Dialog** — manuelle Company-Anlage über UI (`createCompany`, ASCII-Slug; bisher nur per `_registry.json`-Edit möglich). (2) **Firmen-Übersicht als Einstieg** in `/employee-automation` (`CompanyHubView` — Karten m. MA-Zahl, Klick→Pool, „← Alle Firmen"); schließt die fehlende IA-Ebene „welche Firma" (Marks Befund: Akte war direkt im Pool einer Firma, Firmenauswahl fehlte). (3) `/`-Dashboard: alter Einzelfirma-`EmployeeFileDashboardHub` → CTA „Mitarbeiterakte öffnen" (Hub jetzt **ungenutzt** → optionale Löschung). **tsc 0, EC-09/Engine unberührt.** **⚠️ Planer-Guardrail entfernt** (`.claude/settings.json` Deny weg, `8a32018`) — neuer Modus: EIN Terminal plant **und** baut; harte Guardrails bleiben. Browser-Klick-Abnahme durch Mark erfolgt. **+ Nav-Fix (`5280d9c`):** Firmen-Übersicht jetzt direkt im Haupt-Dashboard-Panel eingebettet (`CompanyHubPanel`, Klick → `?company`-Deep-Link in den Pool) + „← Zur Übersicht" auf der Mitarbeiterakte-Seite (fehlender Rückweg behoben). **✅ HETZNER-REDEPLOY DURCH (2026-06-09):** cos.cert-expert.de live auf **`5280d9c`** (DB-Backup vor Deploy, `db push` additiv, Build/Restart/Live-Endpunkte 200, Log fehlerfrei) — alle neuen Features jetzt öffentlich live. Details: `HETZNER_DEPLOY.md` LIVE-STAND.
> **▶ Lane-Dispatch-Stand (2026-06-08):** **PARALLEL-DISPATCH DURCH (Terminal-Planer, 2026-06-08): Lane A (ÖPV-Engine CL-29/30) + Lane B (Audit-Export XLSX/PDF + Batch-Vorzeige-Ansicht) REVIEWT → beide ABGENOMMEN → nach `main` GEMERGT + GEPUSHT.** `main` = **`d9615f0`** (origin/main aktuell). **Kombiniert verifiziert** (nach beiden Merges): `tsc` 0 · Engine-Suite **30/30** · Export-Tests **6/6**. Merges konfliktfrei (disjunkte Write-Sets). Beide Lane-Branches **gelöscht** (lokal+remote, merge-verifiziert). Review-Befund = `CODE_REVIEW.md` (oberster Eintrag). **Mark-Hinweise:** ÖPV-Norm-Lesart **bereits** im Cross-Check §2.4 freigegeben (kein To-do); verbleibend nicht-blockierend: (i) Verwaltung+ÖPV erzeugt keine sichtbare Pflicht-Zeile mehr (F3-Gate, gewollt), (ii) XLSX/PDF-Download-Live-Klick optional von Mark abzunehmen. **Offene Fäden:** ① **Hetzner-Redeploy** (cos.cert-expert.de läuft noch auf altem Commit — neue Features erst nach Redeploy live, Runbook `HETZNER_DEPLOY.md`) · ② `cursor/din-77200-1-anforderungsprofile` hat **1 Müll-Checkpoint** (`1f3a7bd`, ~40 MB Binaries + `.pyc` → **NICHT pushen**, verwerfen oder ignorieren) · ③ Kundenprojekt-Mails (TeamFlex/Wolf Street Audit) committet `6d30d8b`. **Arbeitsmodus ab jetzt (Mark, 2026-06-08): Terminal-Planer übernimmt mehr Kontrolle — proaktiver/autonomer im Rahmen der Guardrails (EC-09/EC-10/keine erfundene Normpflicht/kein .env/.db-Commit).**
> **✅ STATUS (Executor, 2026-06-08): Read-only Akte-/Vorzeige-Übersicht (Queue B / Pt 1) = FERTIG + committet `ae477e8`** (tsc 0 · Engine 27/27 · EC-09-ZIP 200 + `UEsDBA`-Magic · Browser-Akzeptanz EK-Person). Neue `EmployeeFileOverview.tsx` + Toggle „Bearbeiten ↔ Übersicht". Reine Präsentation, EC-09/EC-10 gewahrt, nichts geparkt. Details unten „Von Cursor an Claude". **Nicht gepusht.**
> **Branch = `main`** · COS: `cert-expert-certification-os/apps/certification-os/` · Port **3001**
> **▶ NEUER ARBEITSMODUS (Mark, 2026-06-08):** EIN dauerhafter Planer/Status-Chat + **Subagent baut alles autonom** (kein separater Planer-Chat mehr). Gedächtnis = Repo. Neuer Chat liest `CLAUDE.md` + diese Box + `CURSOR_AUTONOMOUS_RUN_ORDER.md`.
> **▶ JETZT — RESUME-PUNKT (Planer-Chat, 2026-06-08 ~18:10):** **Bau-Queue = `CURSOR_NAECHSTE_QUEUE.md`.** Stand: **A** Norm-Cross-Check ✅ (`NORM_CROSSCHECK_SCHULUNGSKATALOG.md`, Befunde: 🔴 Veranstaltung-FK 16 vs. 24 CL-20 · 🔴 ÖPV ohne CL · Module=Curriculum; 3 offene Norm-Fragen an Mark, blockieren C **nicht**). **B** read-only Übersicht ✅ **Planer-abgenommen** (`ae477e8`, tsc 0/Engine 27/27/EC-09 200/read-only verifiziert). **EK/FK** `e1899dd` ✅ abgenommen. **Commits (nicht gepusht):** `e1899dd` EK/FK · `ae477e8` Übersicht · `cc39e7f` Planer-Docs. **▶ C — Termin-Planung (lücken-getrieben): ✅ FERTIG + committet `fbe1980` + ✅ PLANER-ABGENOMMEN (2026-06-08, `CODE_REVIEW.md` oben)** — Planer unabhängig re-verifiziert: tsc 0 · 49/49 Tests (training-plan 12 / Engine 27 / compliance 10) · Engine+UE nachweislich unberührt (nicht im Diff) · Repository 4 Mapping-Stellen + tolerante Read-Norm · Plan→Ampel-Merge an Aufrufstelle (compliance-status.ts unverändert) · EC-09-ZIP 200 · norm-neutral (Module=Lehrbausteine, kein Auto-Ist). Einziger offener Minor: Nachweis-Upload-Klick (OS-Dateidialog) nicht harness-automatisierbar → unit-getestet + Evidence-Infra-Reuse, optionale Mark-Klick-Abnahme. **Commits (nicht gepusht):** `fbe1980` Feature · `79f3618` HANDOFF. Details unten „Von Cursor an Claude". Detail-Auftrag = `CURSOR_C_TERMINPLANUNG_AUFTRAG.md` (neues `trainingPlan`-Json-Modell + DIN-1-Modul-Katalog als Lehrbausteine + Gap-Logik Soll−Ist + Plan→Ampel operativ + Nachweis-Slot je Zuweisung über bestehende Evidence-Infra). Norm bleibt CL-11 (Module füllen, ändern nicht; **kein Auto-Ist**; Engine/UE unberührt; EC-09/EC-10). Geschäftslogik = `CURSOR_SCHULUNGSKATALOG_PLANUNG.md` §9. **Bot baut autonom; Planer reviewt nach Bau.** Danach D (Modell-Trennung, erst nach Mark-Klärung der Cross-Check-Fragen).
> **▶ NÄCHSTER BAU — EK/FK-Refinement (Mark entschieden, 2026-06-08):** Norm-Klasse soll **EK + FK FREI KOMBINIERBAR** machen (statt Entweder-oder). Pflicht-Set = **Vereinigung**; da **FK ⊇ EK** → **keine neue Normpflicht erfunden** (EK+FK = FK-Set, CL-10/CL-20/25 nur bei DIN-SDL). **Planer-Empfehlung (Mark: „entscheide du") = ZUSAMMENFÜHREN:** eine saubere **Norm-Klassen-Mehrfachauswahl**, in der das bestehende Feld „Zusätzliche Bewachung (Doppelrolle, EK/FK-Niveau)" **aufgeht** → EIN klarer Mechanismus statt zwei. **Berührt Slice-3-Engine + G4-`roleClass`-Modell** → Engine-Suite erweitern + **idempotente Migration** (Einfachauswahl + altes Doppelrolle-Niveau → neue Mehrfach-Klassen). **EC-09/EC-10 unberührt; Org-Titel bleibt reine Anzeige.** **✅ BAUFERTIG:** Bauauftrag steht → **`hq/10_Bridge/CURSOR_EKFK_REFINEMENT_AUFTRAG.md`** (Modell `roleClasses`-Set, Migration inkl. `zusatzBewachungNiveau`→Set, Engine-Set-Quelle, UI-Mehrfachauswahl, DoD, Kickoff-Prompt; UX-Defaults vom Planer gesetzt + überschreibbar). **▶ Neuer Chat: nur noch Subagent mit dem Kickoff-Prompt starten** (DoD: tsc 0 / Engine-Suite grün+erweitert / EC-09-ZIP 200 / Migration verifiziert).
> **🟢 AUTONOMER BUILD LÄUFT JETZT (2026-06-08 ~15:50):** Executor-Subagent baut autonom in dieser Reihenfolge: **(1) EK/FK-Refinement** (`CURSOR_EKFK_REFINEMENT_AUFTRAG.md`) → **(2) G4-Phase-2-Delta** (`CURSOR_G4_AUFTRAG.md`) → **(3) Regression-Check „grüne UE-Soll/Ist-Übersicht"** (Mark: „weg" — Sichtbarkeit wiederherstellen, **keine UE-Werte ändern**). Er committet selbst + hängt Ergebnis-Einträge unten an. **Neuer Chat: erst dessen Einträge lesen, bevor du EK/FK neu startest.**
> **▶ STATUS (Executor, 2026-06-08) — LAUF DURCH:** **(1) EK/FK-Refinement = FERTIG + committet + gepusht `e1899dd`** (tsc 0 · Engine 27/27 · EC-09-ZIP 200 · Migration live-verifiziert). **(2) G4-Phase-2-Delta** = unabhängig re-verifiziert → Ziel bereits durch `displayMode`-Architektur erfüllt → **geparkt** (offene A/B/C/D-Frage an Mark, kein Generator-Umbau ohne reviewtes Delta). **(3) Regression grüne UE-Soll/Ist-Übersicht** = diagnostiziert → **KEINE Rendering-Regression** (G4 fasst DossierView nicht an; Slice 4 rein additiv; Karte rendert live bei EK/FK). Sichtbarkeit ist bewachung-/norm-logik-gegatet (F3) → nicht ohne Norm-Entscheid „aufdrehbar" → **als präzise Frage geparkt** (welche Person? Norm-Klasse EK/FK setzen). Details + Belege unten „Von Cursor an Claude" (2026-06-08).
> **📋 PRODUKT-INPUT MARK (2026-06-08) → Planungs-Doku `CURSOR_SCHULUNGSKATALOG_PLANUNG.md`:** voller Schulungs-/Unterweisungs-Katalog (V1, OneDrive) + Begriffsmodell Bestellung/Schulung/Unterweisung + Brandschutz-Regel (scope-gated Pflicht, Gültigkeit immer anzeigen) + **fertige read-only Übersicht** + **Termin-Planung pro Schulung** (Bulk + Einzel-Override). **Upload-Architektur (im Code verifiziert):** Dateien → Hetzner S3 `cea/companies/{Firma}/evidence/{Person}/{Slot}/datei` (Pro-Person-Struktur existiert, Status `unchecked`; Tally importiert dorthin). **Lücke:** kein Slot pro Einzelschulung mit eigenem Datum → Bau-Bedarf. **Offen (Planer):** Norm-Cross-Check der Katalog-UE-Werte (FK scope-spezifisch!) vor Engine-Änderung.
> **⏹️ AUTONOMER LAUF — END-OF-RUN (2026-06-08, „Run Everything").** **Erledigt + committet:** G4 Phase 1 `047878c` · Bridge/Self-Review `dcbd0d5` · Slice 4 (Ampel/Status) `2261d26`. Alle Gates grün (tsc 0 / Engine-Suite 24/24 / Slice-4-Suite 10/10 / **EC-09-ZIP 200**). **Geparkt (mit präziser Frage):** G4 Phase 2 (Doc-Auswahl liegt bereits im Generator-Tab → konkretes Rest-Delta klären, `CURSOR_G4_PHASE2_AUFTRAG.md`) · Resttechnik (Ist-UE-Auto-Summe braucht neues Nachweis-UE-Datenmodell; DB-Doppelpfad = riskanter Infra-Refactor → Mark-Gate). **Empfohlen als Nächstes:** unabhängiger Planer-Review von `047878c`+`2261d26`, dann Phase-2-Delta entscheiden. Vollständige End-of-Run-Summary: unten.
> **🤖 AUTONOMER DAUERLAUF AKTIV (Mark-Vollmacht, 2026-06-08, bis Montagnachmittag):** Betriebsanleitung = **`hq/10_Bridge/CURSOR_AUTONOMOUS_RUN_ORDER.md`**. Ein Executor baut die Queue (G4 P1 → P1-Review → G4 P2 → Slice 4 → Resttechnik) **eigenständig**, reviewt sich selbst, **committet autonom** nach grüner Verifikation (tsc 0 / Suite / EC-09-ZIP 200). Harte Grenzen bleiben: EC-09/EC-10/keine erfundene Normpflicht/kein `.env`/`.db`/Kundendaten-Commit. **Frischer Chat: lies zuerst den Run-Order + Kickoff-Prompt dort.** Bug-Fixer läuft parallel (rebase, kein force).
> **Phase = Slice 3 (Doppelrollen, Niveau EK/FK) gebaut + committet (`a276d38`) ✅ — von Planer 6 REVIEWT + ABGENOMMEN ✅.**
> **Arbeitsmodell:** Planer/Claude führt (plant + reviewt) · Executor/Cursor baut · Ping-Pong über Bridge-Dateien (Mark, 2026-06-07). Planer rotiert seltener als Executor.
> **▶ NÄCHSTER PLANER-CHAT: „Planer 7"** (Nachfolger). Folge-Planer fortlaufend nummerieren. *(Planer 4 = Pre-Deploy + Hetzner-Deploy live. Planer 5 = Slice 3 geplant. **Planer 6 = Slice 3 reviewt + abgenommen (`CODE_REVIEW.md`, oben), tsc 0 / Suite 20/20 unabhängig re-verifiziert.**)*
> **▶ Slice 3 (Doppelrollen, Niveau EK/FK) = ABGENOMMEN (Planer 6, 2026-06-07) ✅.** 6/6 Review-Punkte erfüllt, norm-konform/CL-belegt, EC-09/EC-10 gewahrt. Ein Minor-Finding (UI: „fk" auf echter Bewachungsrolle hebt auf FK — vertretbar, optional UI-Hinweis; kein Re-Bau) in `CODE_REVIEW.md`. URL-Fix `17f94cc` gegengecheckt = harmlos.
> **▶ NÄCHSTER SCHRITT (Mark-Gate):** Mark hat **G4 = ja** (Anlege-Formular-Migration als eigener Slice) + **nächster Bau = Slice 3b** (Tally-Feldlücke) gewählt — Slice 3b ist auf Marks Tally-Arbeit gated. **G4-Slice plant Planer 7.**
> **🐛 EXECUTOR-DONE (2026-06-07): Hydration-Mismatch Firmenname GEFIXT + committet (`01f720b`, Bridge-Doku `b76751f`) ✅.** `companySlug` jetzt SSR-stabil (`useState(DEFAULT_COMPANY_SLUG)`; localStorage erst nach Mount im Bootstrap-`useEffect`). DoD grün: `tsc` 0 · Hydration-Warnung weg nach Firmenwechsel+Reload (Index + `?new=1`) · EC-09-ZIP `POST 200` · Switcher-Persistenz hält.
> **▶ G4-SESSION-STATUS (2026-06-08, Chat-Übergabe wegen vollem Kontext) — HIER WEITERMACHEN:** Mark hat live Slice 3 abgenommen (Browser-Demo Doppelrolle EK funktioniert) + Tally-Entscheid: **In-App-Erfassung, Tally entkoppeln, Slice 3b zurückgestellt, G4 zuerst, Slice 4 danach.** **G4-Bauauftrag = `hq/10_Bridge/CURSOR_G4_AUFTRAG.md`** (Anlege-Formular auf Requirement-Modell migrieren). **Marks G4-Gate-Entscheide (verbindlich):** (a) `roleType` (Engine) **und** `roleId` (Doku-Vorlage) **getrennt** erfassen; (b) **Ziel-Architektur**: Doc-Auswahl wandert in den **Generator-Tab** (Anlege-Formular schlank); (c) **Rollenliste vereinfachen** = Norm-Klassen **EK/FK/Verwaltung/Praktikant/Subunternehmer** primär + Org-Titel als Unterfeld; (d) **Einsatzleitung = FK** (Norm §4.2: Einsatzleitung enthält mind. 1 FK); (e) Alt-Felder „Training Hours" + Freitext-„Role Type" **raus**. Norm-Fundierung (DIN 77200-1 §3.10 EK / §3.11+§4.19.1 FK / §3.12 Einsatzleitung=Funktion) steht im Bauauftrag. **✅ `CURSOR_G4_AUFTRAG.md` = FINALISIERT (v2, 2026-06-08, Hintergrund-Agent)** mit allen Marks-Gate-Entscheiden (a–e) eingearbeitet. **⚠️ Scope-Warnung dokumentiert:** Entscheid (c)+(d)+(e) machen aus G4 mehr als Formular-UI → **Rollenmodell-Refactor** (neues `roleClass`-Feld EK/FK/Verwaltung/Praktikant/Sub als Engine-Input, `roleType`→Org-Titel) + **Daten-Migration** (alte roleType-Strings→roleClass) + **Engine-Umbau** (`requirement-engine.ts` klassifiziert nach `roleClass`) → **berührt die in Slice 3 abgenommene Engine → Engine-Suite muss umgestellt + re-getestet werden** (keine neuen CL/UE, nur Klassifikationsquelle). **Empfohlenes Phasing** (Risiko EC-09): Phase 1 = Modell/Engine/Migration/schlankes Formular (Doc-Auswahl bleibt vorerst); Phase 2 = Doc-Auswahl → Generator-Tab (Ziel-Architektur b). **✅ DREI G4-MINI-GATES ENTSCHIEDEN (Planer 7, 2026-06-08)** — `CURSOR_G4_AUFTRAG.md` jetzt **v3, baufertig (Phase 1)**: (a) Org-Titel = **Dropdown + Freitext-Option**; (b) **nur Einsatzleitung = FK** (DIN 77200), Objekt-/Schichtleitung **bleiben EK**; (c) **getrennt** → dieser Bauauftrag = **Phase 1** (Modell `roleClass` + Migration + Engine-Refactor + Tests + schlankes Anlege-Formular; **Doc-Auswahl bleibt vorerst, wo sie ist** → EC-09 minimal berührt). Phase 2 (Doc-Auswahl→Generator-Tab) = eigener Auftrag nach Phase-1-Abnahme. **▶ NÄCHSTER SCHRITT: Mark gibt „los für G4-Phase-1-Bau" → neuer Executor-Chat auf `main` baut `CURSOR_G4_AUFTRAG.md`.** **EC-09-kritisch:** `roleId`/Doc-Palette darf ZIP-Generator nicht brechen; Engine-Refactor berührt die in Slice 3 abgenommene Engine → Suite-Re-Test Pflicht. Slice 4 (Ampel-/Status, QFD #1) bleibt danach offener Faden.
> **Nachtrag (Executor, 2026-06-07):** kleiner URL-Fix `17f94cc` — „Neue Person" setzt jetzt `?new=1` (Anlege-Ansicht teilbar). **+ FRAGE an Planer geloggt** (unten „Von Cursor an Claude"): Anlege-Formular nutzt noch das **alte Tool-1-Modell**; Migration auf das Requirement-Modell wäre ein eigener Slice (Architektur/Scope → Planer + Mark-Gate, vom Executor NICHT eingeplant).
> **Letzte Commits:** `0d92ff2` (UE-Anzeige + Findings F1–F5) · `e81ca2c` (Planer-3-Prompt) · `47dcea1` (Planer-2-Review) · `22e0c7c` (Slice 2)
> **✅ Planer 3: kombinierter Diff `22e0c7c..0d92ff2` FINAL ABGENOMMEN** (`CODE_REVIEW.md`, oben). UE-Anzeige (Variante C, `t.hint`/CL-27/Asyl-64 jetzt gerendert) + Findings F1–F5 norm-konform & CL-belegt. Unabhängig re-verifiziert: **`tsc` 0 · Engine-Suite 13/13 grün**. **Slice 2 komplett abgeschlossen.**
> **✅ HETZNER-DEPLOY LIVE (2026-06-07).** App läuft öffentlich unter **https://cos.cert-expert.de** (HTTPS/Let's Encrypt, HTTP→HTTPS-Redirect). Deploy von Planer 4 **auf Marks Anweisung** durchgeführt (Server-Ops, **kein Produktivcode geändert** — deployter Commit `404d55d`). Server: Hetzner `cert-expert-01` / **167.233.63.98** (Ubuntu 26.04, Node 24, nginx, systemd-Unit `certification-os` auf :3001). **Tally-Webhook live umgestellt + end-to-end verifiziert:** echte Test-Submission (`responseId Eq16BYX`, 145 Felder) → Signatur OK → Akte „Test Person" erstellt. DB-Backup-Cron (täglich 3 Uhr, 14 Tage) aktiv. **EC-09-ZIP live verifiziert** (echter Klick ELC Security and Service: `POST /employee-automation` 200, ~135 KB ZIP, keine 5xx). **Live-Facts + Redeploy-Schritte:** `HETZNER_DEPLOY.md` (Abschnitt „LIVE-STAND") + Post-Deploy-Review in `CODE_REVIEW.md`. **Offen (nice-to-have):** Test-Akte ggf. löschen; Tally-API-Key rotieren (401, Tech-Debt); systemd-User härten.
> **Form:** https://tally.so/r/vGNvY0 · **Aufgaben:** `10_Bridge/AUFGABEN.md`

### ▶ Copy-Paste-Prompt für Planer 6 (REVIEW-Chat)
> **⚠️ Dies ist DEINE Arbeitsanweisung — kein Entwurf zum Kommentieren/Verbessern. Beginne sofort mit der Arbeit; frage nur bei echten Gate-Entscheidungen (Mark) zurück. Schreibe den Prompt NICHT um.**
>
> Du bist **Planer 6** — Nachfolger von Planer 5 (Code-Track, Spur P: Planer/Reviewer, **kein Produktivcode**). Lies zuerst `CLAUDE.md` (Rules) + `hq/10_Bridge/HANDOFF.md` (Box „▶ HIER STARTEN" + Executor-Ergebnis-Eintrag „Slice 3 Doppelrollen `a276d38`" + Executor-FRAGE „Anlege-Formular-Migration") + `hq/10_Bridge/CURSOR_SLICE3_AUFTRAG.md` (der Bauauftrag, gegen den du reviewst) + `CODE_REVIEW.md` (oberste Einträge). Koordination nur über Bridge-Dateien.
>
> **Deine Aufgabe = Slice 3 (Doppelrollen) REVIEWEN** — Diff `0680ca2..a276d38` (Feat) gegen `CURSOR_SLICE3_AUFTRAG.md` + `NORM_MATRIX_…v2` + `NORM_KLAUSEL_REGISTER_v1`. Befund nach `CODE_REVIEW.md` (neuer Eintrag oben) + Abschluss-Eintrag im HANDOFF.
> **Konkrete Review-Punkte (jede Norm-Regel CL-belegt):**
> 1. **Niveau-Modell:** `zusatzBewachungNiveau` „ek"/„fk" korrekt verdrahtet? Effektive `bewachung`/`fuehrung` greift in **allen** Gates (A-Set, C-SDL-Soll, E-Weiterbildung, Fristen)?
> 2. **EK vs. FK:** EK → CL-21/CL-24 (16/40 UE), FK → CL-20/CL-25 (24/64 = 40+24 UE). FK baut auf EK-Basis auf (Asyl).
> 3. **CL-10-Gate:** FK-Quali-Posten nur bei **DIN-SDL** (`din1-*`/`din2-*`), „fachlich prüfen" — für **beide** FK-Wege. Slice-2-Präzisierung (FK ohne SDL → kein CL-10) korrekt umgesetzt + getestet?
> 4. **Reduktion unterdrückt:** Verwaltung/Praktikant + Doppelrolle → kein widersprüchliches `v-34a-na`/`p-reduziert` neben `q-34a`?
> 5. **Keine erfundene Pflicht / EC-10:** keine neuen CL-IDs, keine neuen UE-Werte; keine Freigabe-/Auditfähigkeitsaussage.
> 6. **Repository (5 Mapping-Stellen)** vollständig — Feld geht über Save/Load/Migration nicht verloren.
> **Unabhängig re-verifizieren** (nicht nur Executor-Meldung): `tsc --noEmit` = 0, Engine-Suite (`tsx --test`) **20/20** grün; EC-09 + Doppelrolle-Browser = etabliertes Builder-Browser-Muster übernehmen.
> **Mitnehmen (kein eigener Bau):** kleiner URL-Fix `17f94cc` (nur `?new=1`-Spiegelung — Planer 5 hat ihn als harmlos eingestuft, kurz gegenchecken).
> **Danach (Scope/Planung, NICHT Review):** Executor-FRAGE „**Anlege-Formular auf neues Requirement-Modell migrieren?**" (Legacy `EmployeeForm.tsx`/Tool-1-Modell vs. neues Akte-Modell) als **eigenen Slice** mit Mark abwägen. Plus offene Fäden: **Slice 3b** (Tally-Formular-Feldlücke, gated auf Marks Tally-Arbeit), **Slice 4** (Ampel-/Status-Ansicht, QFD #1), DEKRA (CL-60–62), Legal-Input (CL-70–73), Ist-UE-Auto-Summe.
>
> **Guardrails:** EC-09 (Generator/ZIP nie brechen), EC-10 (kein Freigabe-/Auditfähigkeitsstatus), keine erfundene Normpflicht (jede Regel `clauseId`). Verifikation im echten Browser, nicht per Skript. Mark = Gate. Nach stabilem Punkt: Übergabe-Takt + Abschluss-Eintrag.

---

## 📚 Wissensmanagement-Session (Cowork, 2026-06-11) — Knowledge-Lücken geschlossen

**Rolle:** Wissensaufbau (kein Produktivcode). Session 2 nach der 2026-06-10-Session.

**Neu erstellt (alle `status: reviewed`):**

| Ordner | Quelle | Bemerkung |
|--------|--------|-----------|
| `00_basis/iso_45001/` | OneDrive: ISO 45001 mit Anleitung.pdf | PDF nicht in inputs/ — aus Struktur/Training |
| `00_basis/arbstaettv/` | OneDrive: DGUV/ArbStättV.pdf (hochgeladen 2026-06-11) | Öffentliches Recht + OneDrive |
| `00_basis/betrsichv/` | OneDrive: DGUV/BetrSichV.pdf (hochgeladen 2026-06-11) | Öffentliches Recht + OneDrive |
| `01_sdl/gewo_34a/` | Öffentliches Recht (gesetze-im-internet.de) | Kein PDF nötig — öffentliches Recht |
| `01_sdl/dguv_v23/` | OneDrive: DGUV Vorschrift 23.pdf (bereits Stub) | Stub → reviewed |
| `01_sdl/vbg/` | OneDrive: VBG-PDFs (bereits Stub) | Stub → reviewed |

**README `knowledge/2_regulations/README.md`** aktualisiert — alle 6 Einträge auf `✅ reviewed` gesetzt + `iso_45001` als neue Zeile ergänzt.

**Status nach dieser Session:**
- `⬜ offen` (1): `dsgvo_bdsg/` — kein PDF vorhanden, noch nicht geschrieben
- `⚠️ Stub` (0) — alle Stubs sind jetzt reviewed
- Alle anderen = ✅ (reviewed oder aus PDF)

**Noch ausstehend:** PDFs von ArbStättV/BetrSichV/ISO45001 in `inputs/raw_standards/` kopieren für spätere tiefere PyMuPDF-Extraktion (Mark-Task). §34a-PDF in OneDrive-Gesetze-Ordner (für Vollständigkeit, overview.md ist fertig).

---

## 📚 Wissensmanagement-Session (Cowork, 2026-06-10)

**Rolle:** Wissensaufbau (kein Produktivcode). Alle verfügbaren PDFs in `inputs/raw_standards/` wurden via PyMuPDF (+ OCR für LAF-Betreiber-Scan) extrahiert und in strukturierte `knowledge/2_regulations/`-MDs mit YAML-Frontmatter überführt.

**Neu erstellt / befüllt (alle `status: reviewed`):**

| Ordner | Quelle | Seiten |
|--------|--------|--------|
| `01_sdl/din_77200_3/` | DIN 77200-3:2020-07 | 24 |
| `01_sdl/laf_berlin_sdl/` | LAF-LQB-SDL 2018+2020 | 10+11 |
| `01_sdl/laf_berlin_betreiber/` | LAF-Betreibervertrag 2016 (Scan+OCR) | 19 |
| `00_basis/iso_9001/` | DIN EN ISO 9001:2015 | 71 |
| `00_basis/iso_14001/` | DIN EN ISO 14001:2015 + Berichtigung | 83 |
| `00_basis/iso_14001_umsetzung/` | Praxisleitfaden Reimann 2019 | 231 |

**README `knowledge/2_regulations/README.md`** aktualisiert (alle neuen Ordner eingetragen).

**Aktueller Gesamt-Status `2_regulations/`:**
- `✅ aus PDF` (14 Ordner): bewachv, din_77200_1/-2/-3, dguv_r100-001, dguv_i211-005, dguv_r115-001, dguv_i215-310, laf_berlin_sdl, laf_berlin_betreiber, iso_9001, iso_14001, iso_14001_umsetzung
- `⚠️ Stub` (2): dguv_v23, vbg
- `⬜ offen` (4 — keine PDFs vorhanden): gewo_34a, arbstaettv, betrsichv, dsgvo_bdsg
- `Altbestand` (4 — altes Format, kein YAML): arbschg/, dguv_v1/ + Doppelgänger VStättVO/ + arbschg/ im Root → Mark löscht bei Gelegenheit

**Noch ausstehend:** VBG-PDFs (OneDrive, noch nicht im Repo) · dguv_v23-PDF (nicht vorhanden).

---

## 🔚 Von Cursor an Claude — Executor (Spur E): Lane S (modulare DIN-1-Schulungen generierbar), 2026-06-10

**Rolle:** Executor. Gebaut wurde NUR der Lane-S-Auftrag (modulare DIN-1-Schulungen generierbar machen). Branch `lane-s-schulungen-generierbar` ab `main`.

**Fertig:**
- **Katalog↔Vorlage-Mapping (`training-catalog.ts`, single source):** je Modul ein `templateFileName` ergänzt (din1-modul-1 → `01_Dokumentation_Wachbuch_Meldewesen_4UE.docx` … din1-modul-9 → `09_Fuehrungskraft_Sicherheitsdienst_DIN_77200-1_8UE.docx`). Neue Konstante `SCHULUNG_TEMPLATE_FOLDER = "appointments/schulungen"` + Helper `schulungTemplateLogicalPath(moduleId)` → `appointments/schulungen/<file>` bzw. `null` (kein erfundener Pfad).
- **Generator (`generate-employee-docs.ts`):** für jeden zugewiesenen Schulungs-Plan-Eintrag (`employee.trainingPlan`, `source:"katalog"`, refId = bekanntes Katalog-Modul) wird die zugehörige `appointments/schulungen/`-`.docx` in den Unterordner `Schulungen/` des MA generiert. Templates kommen über das bestehende `listTemplateFiles("appointments")` + `buildLatestTemplateKeyMap` (Schulungen-Ordner ist im Generator-Pfad erreichbar; kein Route-Filter). Datum = `plannedDate` (Durchführung von) bzw. globaler Generator-Default. Platzhalter wie üblich (`{FullName}`/`{CompanyName}`/…) plus `ParticipantName`/`SchulungDatum`. **EC-09:** fehlt eine Vorlage (kein Key im Map) oder wirft die Verarbeitung → übersprungen + geloggt, KEIN ZIP-Bruch.
- **Reiner Resolver `resolveAssignedSchulungDocs(trainingPlan)` in `training-plan.ts`** (unit-bar, kein S3): liefert nur `source:"katalog"`-Einträge mit bekanntem Katalog-Modul → Soll-Posten + Tally-Snapshots (`erste-hilfe`/`brandschutz`) werden übersprungen (kein erfundener Pfad).
- **UI-Hinweis (`EmployeeFileTrainingPlan.tsx`):** je zugewiesener Katalog-Schulung Zeile „wird beim Generieren als Schulungs-Dokument mit ausgegeben" (reiner Hinweis, EC-10 — keine Freigabe-/Auditaussage).
- **CL-11 (informativ):** Module bleiben Lehrbausteine; Lane S erzeugt nur Dokumente — kein neues Norm-Soll, kein Auto-Ist (Engine/UE unberührt).

**Gates (im Worktree, nach `npm install` + `prisma generate`):** `tsc --noEmit` = **0** · `npx tsx --test modules/03-mitarbeiterakte-tool-2/employee-file/*.test.ts` = **160/160** (7 neue Lane-S-Tests: NN_-Präfix je Modul, exakte Namen Modul 1/9, logicalPath/`null`, zugewiesene Schulung→Doc-Kandidat mit Datum, nur Katalog-Module, leerer Plan→No-op, Mehrfachzuweisung) · `npm run build` = **Compiled successfully**.

**Geparkte Fragen an Planer (nicht selbst entschieden):**
1. **Exakte S3-Dateinamen Modul 2–8:** der Auftrag bestätigte wörtlich nur Modul 01 und 09. Die Namen 02–08 sind aus den Labels abgeleitet (`02_Datenschutz_…` … `08_Veranstaltungsschutz_Allgemein_4UE.docx`). Stimmen sie nicht 1:1 mit den S3-Objektnamen überein, greift sauber der EC-09-Skip (Modul-Doc fehlt dann still). **Bitte Dateinamen 02–08 gegen S3 abgleichen** (`appointments/schulungen/`-Listing) und ggf. in `training-catalog.ts` korrigieren — Single source ist dort.
2. **S3-Generierungs-Smoke offen:** das lokale `.env.local` enthält nur `HETZNER_BUCKET_NAME`, NICHT `HETZNER_S3_KEY/SECRET/ENDPOINT/REGION` → ein realer „Modul-Doc landet im ZIP"-Lauf gegen S3 war von hier nicht möglich. Mapping + Resolver sind voll unit-getestet, Generator-Pfad tsc/`next build`-verifiziert. Marks Live-Klick (echte Person mit zugewiesenem din1-modul, Generator auslösen, ZIP öffnen) steht als Abnahme aus.

**Commit:** HEAD von Branch `lane-s-schulungen-generierbar` (NICHT gepusht/gemergt). Write-Set eingehalten (`training-catalog.ts`, `generate-employee-docs.ts`, `EmployeeFileTrainingPlan.tsx`, `training-plan.ts` Helper + Test); kein `.env`/`.db`/Kundendaten committet.

✅ **Stabiler Punkt** — Lane S fertig + Gates grün. Wartet auf Planer-Review + Marks Merge-Gate.

---

## 🔚 Von Cursor an Claude — Executor (Spur E): Lane Q P4 (Tally-Durchführungsdatum #5, D4 = b+c), 2026-06-10

**Rolle:** Executor. Gebaut wurde NUR der Auftrag (`CURSOR_TOOL2_SCHULUNGEN_FLOW_AUFTRAG.md` #5, P4, D4 = b+c). Branch `lane-q-p4-tally-datum` ab `origin/main` `f6e89b1`.

**Fertig:**
- **(b) Tally-Datum:** Neues optionales `dateQuestionId` je Schulungs-Datei-Slot (`TallyFileQuestionConfig`, `lib/tally-intake-config.ts`). Der Intake (`lib/tally-intake-service.ts`) liest je Schulungsnachweis (`training-plan:{id}`) das Durchführungs-/Zertifikatsdatum aus und setzt es als `plannedDate` des zugeordneten Plan-Eintrags (`applyTrainingDateFromEvidence`, neue reine Funktion in `training-plan.ts`). **Kein erfundenes Datum:** fehlt `dateQuestionId`/kommt kein/ungültiges Datum → No-op. Reiner Daten-Merge im bestehenden `trainingPlan`-Json — **kein Schema-Change**.
- **(c) Upload-Datum-Input:** Termin-Planung (`EmployeeFileTrainingPlan.tsx`) bietet beim manuellen Nachweis-Upload das `plannedDate`-Feld als „Durchführung / geplant" an (+ Hinweis „Durchführungsdatum eintragen", wenn Nachweis ohne Datum). Zusätzlich optionales Durchführungsdatum-Feld in `EmployeeFileEvidenceRow.tsx` (neue optionale Props `evidenceDate`/`onDateChange`) — additiv, nur sichtbar wenn ein Handler durchgereicht wird.
- **EC-10 gewahrt:** importierte Nachweise bleiben `unchecked` (Prüfstatus #7 unverändert); das Datum ist nur Durchführungsdatum, KEINE Freigabe. Die erzeugten Plan-Einträge tragen KEINE `ueAnerkennung` → kein Auto-Ist (Engine/UE unberührt). CL-Snapshot informativ (Ersthelfer CL-08, Brandschutz CL-23).
- **Bonus (Datums-Pfad):** der bisher in `TALLY_FIELD_MAPPING.md` geparkte `tp-…` vs. stabile-Id-Konflikt ist für den Datums-Pfad gelöst (P4 legt bei Bedarf einen Plan-Eintrag mit stabiler Id `erste-hilfe`/`brandschutz` an).
- Doku: `TALLY_FIELD_MAPPING.md` um das neue Feld + Beispiel ergänzt.

**Gates (im Worktree, nach `npm install` + `prisma generate`):** `tsc --noEmit` = **0** · `npx tsx --test modules/03-mitarbeiterakte-tool-2/employee-file/*.test.ts` = **153/153** (6 neue P4-Tests: Datum übernommen, bestehender Eintrag aktualisiert, fehlend→leer/No-op, Nicht-Schulungs-evidenceId→No-op, idempotent, Helper) · `npm run build` = **Compiled successfully** (Exit 0). EC-09: Generator/Build-Pfad grün; ZIP-Live-Klick (OS/Browser) nicht harness-automatisierbar → optionale Mark-Abnahme.

**Geparkte Fragen an Planer (nicht selbst entschieden):**
1. **Reale Tally-DATE-questionIds:** das Datum-Feld je Schulungsnachweis muss Mark im Tally-Formular anlegen; dann `dateQuestionId` in `data/tally-employee-slots.json` nachtragen. Bis dahin inaktiv (kein erfundenes Datum, JSON daher NICHT verändert).
2. **(c) Unterweisungs-Datum end-to-end:** Das optionale Datum-Feld in `EmployeeFileEvidenceRow` ist verdrahtbar, aber die Persistenz für generische Unterweisungs-Slots berührt `EmployeeFileDossierView`/`types/employee.ts`/Repository (außerhalb des Write-Sets, z. T. VERBOTEN) → als Frage geparkt. Schulungs-/Plan-Datum (c) ist über `plannedDate` voll funktionsfähig.
3. **Akte-Aufräumung:** manuelle `tp-…`-Plan-Items vs. stabile Import-Items konsolidieren (optional, außerhalb Write-Set).

**Commit:** HEAD von Branch `lane-q-p4-tally-datum` (NICHT gepusht/gemergt). Write-Set eingehalten; kein `.env`/`.db`/Kundendaten committet.

✅ **Stabiler Punkt** — Lane Q P4 fertig + Gates grün. Wartet auf Planer-Review + Marks Merge-Gate.

---

## 🔚 ABSCHLUSS-EINTRAG — Terminal-Planer: Parallel-Dispatch Lane A + Lane B reviewt, gemergt, gepusht, 2026-06-08

**Rolle:** Planer/Reviewer (Spur P) im Terminal — übernommen, nachdem der vorherige Planer-Chat in einem Read-only-Befehl einfror (kein Schaden; die Executor-Bots hatten ihre `cursor/*`-Branches sauber committet+gepusht).

**Fertig:**
- **Lane A** (`cursor/oepv-engine-schulungssoll`, `aff20ea`) + **Lane B** (`cursor/audit-export-lane-b`, `45ea375`+`d0f7154`) unabhängig reviewt (je Branch eigene Re-Verifikation) → **beide abgenommen**, Befund in `CODE_REVIEW.md` (oberster Eintrag).
- Beide nach `main` **gemergt** (`--no-ff`, konfliktfrei — Write-Sets disjunkt): `1033728` (Lane A) + `d9615f0` (Lane B). **Kombiniert auf main verifiziert:** `tsc` 0 · Engine 30/30 · Export 6/6.
- `main` **gepusht** (`7b9f795..d9615f0`). Review-Doku committet `86ee067`.
- Beide Lane-Branches **gelöscht** (lokal+remote, `git branch -d` merge-verifiziert).
- Orphaned Kundenprojekt-Mails (TeamFlex/Wolf Street Audit) gesichert `6d30d8b`.

**Offen / nächster Schritt:**
1. **Hetzner-Redeploy** (cos.cert-expert.de auf `d9615f0` heben — ÖPV-Soll + Audit-Export erst danach live). Server-Ops, nur auf Marks Anweisung. Runbook `HETZNER_DEPLOY.md`.
2. `cursor/din-77200-1-anforderungsprofile`: 1 Müll-Checkpoint (`1f3a7bd`, 40 MB Binaries + `.pyc`) — **nicht pushen**; verwerfen/ignorieren entscheiden.
3. Optionale Mark-Abnahmen: XLSX/PDF-Download-Live-Klick; Verwaltung+ÖPV-Sichtbarkeits-Wunsch (kein Defekt).

**Commit-Basis:** `main = d9615f0`. Diese Session: `86ee067` (Review-Doku) · `1033728`+`d9615f0` (Merges) · `6d30d8b` (Kundenprojekt-Mails) · HANDOFF-Update.

✅ **Stabiler Punkt** — Dispatch vollständig integriert, main gepusht, Branches aufgeräumt.

---

## 🔚 ABSCHLUSS-EINTRAG — Planer: Queue C (Termin-Planung, lücken-getrieben) — Bauauftrag baufertig + Bot gestartet, 2026-06-08

**Rolle:** Planer/Reviewer (Spur P, kein Produktivcode). Aufgabe: den C-Bauauftrag (Termin-Planung, gap-driven nach `CURSOR_SCHULUNGSKATALOG_PLANUNG.md` §9) schreiben und den Bot dafür starten.

**Fertig (nur Bridge-Doku, kein Code):**
- **`CURSOR_C_TERMINPLANUNG_AUFTRAG.md`** geschrieben — baufertig. Kern: C ist **lücken-getrieben**, nicht nur „Datum setzen": Soll−Ist−Lücke je Person sichtbar + gezielte Modul-Zuweisung (DIN-1-Lehrbausteine §3) zum Lücke-Schließen, je mit Datum (Bulk + Override) + eigenem Nachweis-Slot, speist die Ampel (geplant/überfällig/Nachweis) operativ.
- **Norm-Leitplanken gegen Cross-Check verdrahtet:** Soll bleibt **CL-11 (40/24)**; Module = **Lehrbausteine, kein Norm-Soll** (Cross-Check §2.1); **kein Auto-Ist** (Ist-UE-Auto-Summe ist geparkt = Queue E); ÖPV/Veranstaltung-FK-Konflikte **nicht** angefasst (C ist UE-neutral); EC-09/EC-10 hart.
- **Architektur-Entscheide (Planer, gegen Code verifiziert):** neues `trainingPlan: Json?`-Feld nach `einmaligIstUE`-Muster (SQLite-P2023-sicher, alle 4 Repo-Mapping-Stellen + Read-Normalisierung); Engine **unberührt**; Plan→Ampel via Daten-Merge an der Aufrufstelle (kein `compliance-status.ts`-Logikeingriff); Nachweis-Slot über bestehende Evidence-Infra (`evidenceId = training-plan:{id}`, kein neues Storage-Modell).
- HANDOFF HIER-STARTEN + `CURSOR_NAECHSTE_QUEUE.md` (C-Abschnitt) auf „Bauauftrag steht + Bot gestartet" gekippt.

**Verdict:** **C ist baufertig.** Kein offenes Planer-Gate für C (UE-neutral → Cross-Check blockiert nicht). Bot baut autonom.

**Offen / nächster Schritt:**
1. **Bot:** baut `CURSOR_C_TERMINPLANUNG_AUFTRAG.md` (§3–§7), hält §8-DoD (tsc 0 / neue + bestehende Suiten grün / EC-09-ZIP 200 / Persistenz + Ampel im Browser / Engine+UE unverändert), committet, hängt Ergebnis-Eintrag an.
2. **Planer (nach Bau):** C-Review (besonders: Engine/UE wirklich unberührt? Repository-Mapping vollständig? Ampel-Merge EC-10-konform?).
3. **Danach:** D (Modell-Trennung Bestellung/Schulung/Unterweisung + Brandschutz-Regel) — erst nach Mark-Klärung der Cross-Check-Norm-Fragen (§4: Veranstaltung-FK 16/24, ÖPV-CL, Modul-Bestätigung).

**Commit-Basis:** Produktivcode unverändert (`e1899dd`). Diese Session = nur Bridge-Doku (`CURSOR_C_TERMINPLANUNG_AUFTRAG.md`, `HANDOFF.md`, `CURSOR_NAECHSTE_QUEUE.md`).

✅ **Stabiler Punkt** — C-Bauauftrag steht, Bot läuft; guter Zeitpunkt für Bridge-Doku-Commit. Warten auf Bot-Ergebnis, dann Planer-Review.

---

## 🔚 ABSCHLUSS-EINTRAG — Planer 7: G4 — drei Mini-Gates entschieden, Bauauftrag v3 baufertig (Phase 1), 2026-06-08

**Rolle:** Planer/Reviewer (Spur P, kein Produktivcode). Aufgabe: die drei offenen §7-Mini-Gates des G4-Bauauftrags mit Mark klären und den Auftrag baufertig machen.

**Mark-Entscheide (verbindlich, mit Norm-Stütze):**
- **a) Org-Titel-Feld → Dropdown + Freitext-Option.** Festes Dropdown (bekannte Titel, je mit Default→Norm-Klasse) **+** „andere (Freitext)". Norm-Klasse bleibt maßgeblicher Engine-Input.
- **b) Objektleitung/Schichtleitung → bleiben EK.** Mark: „nur Einsatzleitung = FK nach DIN 77200." Default-Mapping: Einsatzleitung→`fk`, Objekt-/Schichtleitung→`ek`. **Keine titelgebundene FK-Quali-Pflicht erfunden** (FK hängt an §4.19.1-Quali; §3.12/§4.2 stützt nur Einsatzleitung=FK) → „keine erfundene Pflicht" gewahrt.
- **c) Phasen-Schnitt → getrennt.** Dieser Bauauftrag = **Phase 1** (Datenmodell `roleClass` + Migration + Engine-Refactor + Tests + schlankes Anlege-Formular; Doc-Auswahl bleibt vorerst, wo sie ist → EC-09 minimal berührt). **Phase 2** (Doc-Auswahl→Generator-Tab) = eigener Auftrag nach Phase-1-Abnahme.

**Fertig (nur Bridge-Doku, kein Code):**
- `CURSOR_G4_AUFTRAG.md` auf **v3** gehoben: §7 von „offen" → „entschieden"; §0/§3/§4.4/§4.5/§6/§9 phasen- und gate-konsistent (Phase 1 = Erfassung, Doc-Auswahl bleibt; Phase 2 markiert). EC-09-DoD auf Phase 1 präzisiert.
- HANDOFF HIER-STARTEN-Box: Gate-Status gekippt + nächster Schritt = Marks „los für G4-Phase-1-Bau".

**Verdict:** **G4-Phase 1 ist baufertig.** Kein offenes Planer-Gate mehr für Phase 1.

**Offen / nächster Schritt:**
1. **Mark-Gate:** „los für G4-Phase-1-Bau" → neuer **Executor-Chat** auf `main` liest `CLAUDE.md` + HANDOFF (HIER STARTEN) + `CURSOR_G4_AUFTRAG.md`, baut Phase 1, hält `tsc`/Engine-Suite/EC-09 grün, committet mit Marks OK.
2. **Planer (nach Bau):** G4-Phase-1-Review (Engine-Refactor + Migration besonders prüfen, Suite-Re-Test ggü. Slice 3).
3. **Danach:** G4-Phase 2 planen (Doc-Auswahl→Generator-Tab); offene Fäden Slice 4 (Ampel/Status), DEKRA (CL-60–62), Legal-Input (CL-70–73).

**Commit-Basis:** Produktivcode unverändert (`01f720b`). Diese Session = nur Bridge-Doku (`CURSOR_G4_AUFTRAG.md`, `HANDOFF.md`).

✅ **Stabiler Punkt** — Gates geklärt, Bauauftrag v3 baufertig; guter Zeitpunkt für Bridge-Doku-Commit / Übergabe an Executor-Chat. Warten auf Marks „los für den Bau".

---

## 🔚 ABSCHLUSS-EINTRAG — Planer 6: Slice-3-Abnahme (Doppelrollen, Niveau EK/FK), 2026-06-07

**Rolle:** Planer/Reviewer (kein Produktivcode). Review des Feat-Diffs `0680ca2..a276d38` gegen `CURSOR_SLICE3_AUFTRAG.md` + Norm-Matrix v2 + Klausel-Register.

**Fertig (alles in Bridge-Dateien, kein Code geändert):**
- **Slice 3 ABGENOMMEN** → `CODE_REVIEW.md` (neuer Eintrag oben). Verdict: grün, alle **6 Review-Punkte** erfüllt, CL-belegt.
  1. Niveau-Modell in **allen** Gates verdrahtet (A-Set/C-SDL/E-Weiterbildung/Fristen nutzen effektive `bewachung`+`fuehrung`). 2. EK→CL-21/24 (16/40), FK→CL-20/25 (24/64), FK baut auf EK-Basis auf. 3. CL-10 nur bei DIN-SDL für beide FK-Wege (D7), Slice-2-Präzisierung umgesetzt+getestet. 4. Verwaltungs-/Praktikanten-Reduktion bei Doppelrolle unterdrückt (kein Widerspruch zu q-34a). 5. Keine neue CL/UE, EC-10 gewahrt, Invariante grün. 6. Repository 5 Mapping-Stellen + Read-Normalisierung (`asNiveau`), Schema `String?` SQLite-sicher.
- **Unabhängig re-verifiziert** (read-only, nicht nur Executor-Meldung): **`tsc --noEmit` = 0**, **Engine-Suite `tsx --test` = 20/20 grün** (13 alt + 7 neu D1–D7 + Invariante). EC-09 + Doppelrolle-Browser = Executor-Verifikation nach etabliertem Muster übernommen.
- **URL-Fix `17f94cc` gegengecheckt** = harmlos (`?new=1`-Spiegelung, beim Laden in Z. 235/256 ausgewertet; keine Engine-/Architekturänderung).

**Minor-Finding (kein Blocker, Beobachtung):** „No-op für echte Bewachungsrollen" (Auftrag §6) gilt nur für „ek"; bei einer EK-Rolle (SMA) + „fk" wird auf FK-Niveau gehoben — fachlich vertretbar (bewusste FK-Wahl), bricht keine Norm/Guardrail. Optionaler UI-Hinweis/Ausblenden, **kein Re-Bau**. Detail in `CODE_REVIEW.md`.

**Verdict:** **Slice 3 abgeschlossen.** Keine Blocker, keine offenen Code-Tasks aus Slice 3.

**Offen / nächster Schritt:**
1. **Mark-Gate G4:** Anlege-Formular-Migration als eigener Slice? (s. „Offene Entscheidungen für Mark"). 
2. **Planer 7 (nach Marks Richtungsentscheid):** Slice 3b (Tally-Feldlücke, gated auf Marks Tally-Arbeit) **oder** Slice 4 (Ampel-/Status-Ansicht, QFD #1) planen.
3. Offene Fäden: DEKRA (CL-60–62), Legal-Input (CL-70–73), Ist-UE-Auto-Summe.

**Commit-Basis:** Produktivcode unverändert `a276d38` (+ `17f94cc` URL-Fix). Diese Session = nur Bridge-Doku (`CODE_REVIEW.md`, `HANDOFF.md`).

✅ **Stabiler Punkt** — Slice 3 abgenommen; guter Zeitpunkt für Bridge-Doku-Commit / Übergabe (neuer Chat). **Übergabe empfohlen** nach Marks G4-Entscheid.

---

## 🔚 ABSCHLUSS-EINTRAG — Planer 4: Pre-Deploy-Abnahme + Hetzner-Deploy LIVE, 2026-06-07

**Rolle:** Planer/Reviewer (kein Produktivcode). Review des Executor-Pre-Deploy-Ergebnisses gegen `CURSOR_HETZNER_PREDEPLOY_AUFTRAG.md`.

**Fertig (alles in Bridge-Dateien, kein Code geändert):**
- **Pre-Deploy-Gates ABGENOMMEN** → `CODE_REVIEW.md` (neuer Eintrag oben). Verdict: grün, **Mark kann deployen**.
- **3 von 4 Gates unabhängig re-verifiziert** (read-only, nicht nur Builder-Meldung):
  - **`next build` selbst gefahren** → **Exit 0**, „Compiled successfully" + „Running TypeScript" ohne Fehler, alle 15 Seiten/Routen generiert. `next.config.ts` ohne `ignoreDuringBuilds`/`ignoreBuildErrors` → echter Gate.
  - **`.env.example` vs. alle `process.env.*`-Reads** gegengecheckt → vollständig. Befund (kein Blocker): `TALLY_API_KEY` dokumentiert, aber aktuell nirgends per `process.env` gelesen — harmloser Überschuss.
  - **DB-Pfad Filesystem-Check** → genau **ein** File `prisma/prisma/dev.db`, kein zweites `prisma/dev.db`.
- **EC-09-Prod-ZIP** = Builder-Browser-Verifikation (200 / `PK`-ZIP-Magic / 132,8 KB / EC-10-Disclaimer) — nach etabliertem Muster (Planer 3 ↔ Builder 2) übernommen.

**Verdict:** **Pre-Deploy abgeschlossen.** Keine Blocker, kein Code-Commit nötig.

**▶ DANACH (selbe Session): Hetzner-Deploy LIVE durchgeführt** (Planer 4 auf Marks ausdrückliche Anweisung „kannst du das machen / führ mich durch"). Server-Ops, **kein Produktivcode geändert** — deployter Stand = Commit `404d55d` (origin/main). Schritte:
- **Server eingerichtet:** Hetzner `cert-expert-01` (167.233.63.98, Ubuntu 26.04). Node 24 LTS + npm + nginx 1.28 + certbot 4.0 installiert. ufw (22/80/443). SSH-Key-Login (Marks Mac → Server) + GitHub-**Deploy-Key** (read-only) für privates Repo `derbrocken/cert-expert-ai`.
- **App ausgerollt:** Repo nach `/opt/cert-expert-ai` geklont; `.env.production.local` (chmod 600, alle Keys aus Dev-`.env.local`, `DATABASE_URL=file:./prisma/dev.db`, `NODE_ENV=production`); `npm ci`; `db:push` (explizit `DATABASE_URL`, da Prisma-CLI `.env` liest) → DB unter `prisma/prisma/dev.db` (kanonisch, kein zweites File); `npm run build` = Exit 0.
- **Dauerbetrieb:** systemd-Unit `certification-os` (User root — Härtung auf non-root = Tech-Debt) auf :3001, `enable --now`; nginx-Reverse-Proxy + **certbot HTTPS** (`cos.cert-expert.de`, Zert. bis 2026-09-05, Auto-Renew) + HTTP→HTTPS-Redirect. DB-Backup-Cron (`/usr/local/bin/cos-backup.sh`, täglich 3 Uhr, 14 Tage Retention).
- **DNS (Mark/IONOS):** A `cos` → 167.233.63.98 (IONOS-Parkseite + AAAA deaktiviert; propagiert).
- **Tally-Webhook (Mark/Tally-UI):** bestehenden App-Webhook auf `https://cos.cert-expert.de/api/webhooks/tally` umgestellt (Signing Secret unverändert). **End-to-end verifiziert:** echte Submission `responseId Eq16BYX` (145 Felder) → `[POST /api/webhooks/tally] Accepted` → Signatur OK → Akte „Test Person"/SMA erstellt (`tally-Eq16BYX-emp-1`, Firma „Test Deploy" → Legacy-Pool, kein Slug = erwartet).

**Live-Verifikation:** `https://cos.cert-expert.de/` + `/employee-automation` = HTTP 200; HTTP→HTTPS 301; Webhook-Endpoint lehnt GET mit 405 ab (POST-only, kein 502). Webhook-Intake real grün. **EC-09-ZIP live verifiziert** (echter Klick, ELC Security and Service: `POST /employee-automation` 200, Body ~135 KB ZIP, keine 5xx im nginx-Log). **UX-Beobachtung Mark:** Anlege-Maske schlank — Slice-2-Felder (SDL/Dienstfahrzeug/Fristen/UE) erscheinen erst in der Akte/Dossier, nicht im Create-Form (by design, deckt sich mit Formular-Feldlücke).

**Offen / nächster Schritt:**
1. **Tally-API-Key rotieren** (REST-Key gibt 401 — Webhook-Verwaltung lief über Tally-UI; Tech-Debt aus CLAUDE.md). Test-Akte „Test Person" ggf. löschen. systemd-User auf non-root härten (Tech-Debt).
2. **Slice 3 (Planer 5, nach Marks „weiter"):** Doppelrollen-Modellierung **+ Formular-Feldlücke** (s. Planer-4-Finding „Von Claude an Cursor", C-Empfehlung) gegen Norm-Matrix v2 + Klausel-Register, jede Regel `clauseId`, Bauauftrag nach Bridge.

**Commit-Basis:** Produktivcode unverändert `404d55d`/`0d92ff2`. Diese Session = Bridge-Doku (`CODE_REVIEW.md`, `HANDOFF.md`, `HETZNER_DEPLOY.md`) + Server-Setup. **DSGVO:** `.env.production.local` nur auf Server (nicht im Git); `.env.local` bleibt gitignored.

✅ **Stabiler Punkt** — App ist live unter HTTPS, Webhook end-to-end grün; guter Zeitpunkt für Bridge-Doku-Commit / Übergabe (neuer Chat).

---

## 🔚 ABSCHLUSS-EINTRAG — Planer 3: Slice-2-Final-Abnahme (kombinierter Diff), 2026-06-07

**Rolle:** Planer/Reviewer (kein Produktivcode). Review des kombinierten Builder-2-Diffs.

**Fertig (alles in Bridge-Dateien, kein Code geändert):**
- **Kombinierten Diff `git diff 22e0c7c 0d92ff2` final abgenommen** → `CODE_REVIEW.md` (neuer Eintrag oben, „Final-Abnahme"). Beide Teile (UE-Anzeige Variante C + Findings F1–F5) in einem Review. Kein separater UE-Commit gesucht (gibt es nicht).
- **Offener Pre-Commit-Punkt (Planer 2) geschlossen:** `t.hint` wird jetzt gerendert (`EmployeeFileTrainingTargets.tsx`). Dadurch erscheinen **CL-27-Anrechnungszeile** (Engine-Hint auf `jahres-weiterbildung`/CL-11, Z. 629) **und** Asyl-„Gesamt 64 UE"-Hinweis (`sdl-asyl-fk`/CL-25). Bestätigt.
- **Findings F1–F5 gegen Norm-Matrix v2 + Klausel-Register geprüft — jede `clauseId` belegt:** F1 §34a-Unterrichtung→`unvollständig` (Matrix §2 „gelb+Frist"); F2 Presenter-Dedup nach `clauseId` (Engine unverändert, `null` nie dedupt, nur CL-08/CL-23-Kollisionen = gleiches Thema); F3 SDL-UE-Soll an `bewachung` gegatet (Brandschutz-Pflichtnachweis bleibt ungated) + Doppelrollen-Kommentar drin; F4 nur „Führungskraft"=FK 24 UE/EL·OL·SL=EK 16 UE (Matrix §5.3/5.4 + §8.3/8.4), bleiben Bewachung — Mark-Variante-B, Gate-konform; F5 Asyl-Label rollen-neutral.
- **F4 roleType-String-Matching gegengecheckt** (nicht neu aufgerollt): gespeicherte `roleType` aus `ROLLE_TYPE_OPTIONS` matcht Engine-Sets; `GRUNDROLLE_CATALOG` nur Anzeige → kein Write-Path-Bug (wie Builder 2 gemeldet).
- **Unabhängig re-verifiziert** (read-only, nicht nur Builder-Meldung): **`tsc --noEmit` = 0 Fehler**, **Engine-Suite `tsx --test` = 13/13 grün** (inkl. neue Szenarien 3c/4c/5b + Invariante). EC-09-ZIP + F4-live = Builder-2-Browser-Verifikation.

**Verdict:** **Slice 2 komplett abgeschlossen.** Keine Blocker, keine offenen Code-Tasks aus Slice 2.

**Danach (selbe Session): Mark gab „los" für Hetzner-Deploy** → Pre-Deploy als Bauauftrag gerahmt:
- **`CURSOR_HETZNER_PREDEPLOY_AUFTRAG.md`** geschrieben (Executor-Gates: `next build` grün · EC-09-Prod-Smoke · Env-Check · `db:push`-Trockencheck). Keine Architektur drin — vom Planer entschieden.
- **DB-Doppelpfad faktisch geklärt + entschieden:** nur eine DB (`prisma/prisma/dev.db`), kanonisch so belassen; Vereinheitlichung = eigener Slice. **`HETZNER_DEPLOY.md` Doku-Bugs gefixt** (Env-Tabelle nannte `file:./dev.db`, Backup zeigte auf `prisma/dev.db` — beides falsch).
- **Build-Gate verifiziert:** `next.config.ts` ohne `eslint.ignoreDuringBuilds` → `next build` ist der echte Gate.

**Offen / nächster Schritt:**
1. **Executor/Builder:** `CURSOR_HETZNER_PREDEPLOY_AUFTRAG.md` bauen (Gates grün, Ergebnis in HANDOFF).
2. **Mark (Server):** nach grünen Gates deployen (DNS/systemd/nginx/Webhook-PATCH/Backup) — Runbook `HETZNER_DEPLOY.md`.
3. **Planer 4:** Pre-Deploy-Ergebnis reviewen; Slice 3 (Doppelrollen) parkt bis nach Deploy.

**Commit-Basis:** unverändert `0d92ff2` — diese Session = nur Bridge-Doku (`CODE_REVIEW.md`, `HANDOFF.md`, `HETZNER_DEPLOY.md`, neuer `CURSOR_HETZNER_PREDEPLOY_AUFTRAG.md`), kein Produktivcode.

✅ **Stabiler Punkt** — Slice 2 abgeschlossen + Deploy-Bauauftrag steht; guter Zeitpunkt für Bridge-Doku-Commit / Übergabe (neuer Chat). **Übergabe empfohlen.**

---

## 🔚 ABSCHLUSS-EINTRAG — Planer 2 (17:24): UE-Anzeige-Review + Findings verteilt, 2026-06-07

**Rolle:** Planer/Reviewer (kein Produktivcode). Offene Fäden des Vorgängers abgearbeitet.

**Fertig (alles in Bridge-Dateien, kein Code geändert):**
- **UE-Anzeige (Variante C) statisch reviewt** → `CODE_REVIEW.md` (neuer Eintrag oben). Working Tree: `EmployeeFileTrainingTargets.tsx` + Verdrahtung + Persistenz (`weiterbildungIstUE`/`einmaligIstUE`) vollständig & konsistent (Schema/Repo/Komponente). Verifiziert: **`tsc --noEmit` = 0**, **ReadLints 4 Dateien = 0**, Variante C + EC-10-Wording korrekt. Verdict: **Pre-Commit-Review besteht**; Browser-Abnahme + Commit = Executor-Gate.
- **Findings 1–5 an Executor** → `CURSOR_FINDINGS_1_2_AUFTRAG.md` (F1 `q-34a` `unvollständig`; F2 CL-08/CL-23 Doppelzeilen im Presenter dedupen; F3 SDL-Soll gaten; F4 Leitungsrollen=EK; F5 Asyl-Label kosmetisch). Mit DoD + EC-09/tsc/Test-Anforderung.
- **Findings 3+4 mit Mark entschieden** → „Offene Entscheidungen für Mark" (F4 Variante B + Upgrade-Pfad; F3 gaten bestätigt) + Design-Lücke Doppelrolle.
- **Hetzner-Deploy als eigener Schritt gerahmt** → „Von Claude an Cursor"-Eintrag: Pre-Deploy-Checkliste (DB-Doppelpfad vereinheitlichen, `next build`-Gate, Env-Vollständigkeit) + Mark-Aktionen (DNS/Subdomain/Env/Webhook-PATCH). Runbook steht in `HETZNER_DEPLOY.md`.
- **Rollen-Kontrakt in `CLAUDE.md`** verankert (`a09461f`): Executor plant nicht, führt aus.
- **HANDOFF aufgeräumt:** Historie → `HANDOFF_ARCHIV.md` (nichts gelöscht), aktiver Briefkasten schlank.

**Anmerkung Verifikation:** Engine-Test-Suite (`tsx --test`) im Planer-Environment **nicht** re-run-bar (`tsx` nicht installiert). Engine-Logik durch die UE-Arbeit unverändert → Executor bestätigt 10/10 beim Findings-Commit (F1/F3/F4 ändern die Suite ohnehin).

**Offen / nächster Schritt:**
1. **Executor:** Browser-Akzeptanz UE-Anzeige + Commit; danach `CURSOR_FINDINGS_1_2_AUFTRAG.md` bauen (F1–F5).
2. **Mark:** ggf. „los" für Hetzner-Deploy.
3. **Planer 3:** Final-Abnahme UE-Anzeige + Findings-Commit reviewen.

**Commit-Basis:** unverändert `22e0c7c` (Slice 2) — diese Session = nur Bridge-Doku + `CLAUDE.md`. Code-Working-Tree weiter beim Executor (uncommitted).

✅ **Stabiler Punkt** — Bridge-Stand sauber; guter Zeitpunkt für Executor-Commit / Übergabe.

---

## 🔚 ABSCHLUSS-EINTRAG — Slice 2 Requirement-Engine gebaut + committet, 2026-06-07

**Fertig (Commit `22e0c7c`):**
- **Requirement-Engine** (`requirement-engine.ts`, UI-unabhängig, reine TS-Logik): `deriveRequirements(ctx)` → Pflicht-Set + Schulungs-Soll + Fristen aus Rolle × Beauftragung × SDL × Geltungsbereich × Beschäftigungsart × „fährt Dienstfahrzeug". Jede Regel mit `clauseId` (CL-01..CL-27); ohne belegte CL → „fachlich prüfen". Tests **10/10** grün.
- **Presenter** `employee-file-requirements.ts` auf `roleType` umgestellt (Legacy `isSecurityRole` raus).
- **Neue Felder** (Employee + Prisma + Repository): `sdlScopes`, `drivesServiceVehicle`, `ersteHilfeGueltigBis`, `brandschutzGueltigBis` (`db push` gelaufen).
- **UI** Erfassung (SDL-Mehrfachauswahl, Dienstfahrzeug, Fristdaten) + Anzeige (Pflicht-Set mit CL-Badge, Fristen, Schulungs-Soll-Vorschau **ohne** UE-Zahlen).
- Bauauftrag `CURSOR_SLICE2_AUFTRAG.md` (vollständig freigegeben, Variante C für UE-Anzeige).
- Guardrails: **EC-09-Smoke grün**, `tsc` 0 Fehler, **EC-10** gewahrt (rechnerisch, kein Freigabe-/Auditfähigkeitsstatus).

**Commit-Basis:** `22e0c7c` · `feat(tool2): Slice 2 Requirement-Engine (Pflicht-Set + Schulungs-Soll, CL-traceable)`

---

## 📥 Von Cursor an Claude (Fragen / Bitten)

### 2026-06-10 — ✅ Executor Lane P P3 (Upload beim Anlegen/Bearbeiten #6 + „geprüft/geschlossen"-Status #7): FERTIG + committet (Branch `lane-p-p3-upload-pruefstatus`, NICHT gepusht/gemergt)

**Branch:** `lane-p-p3-upload-pruefstatus` (ab `main` HEAD `1253c2c`). **`main` unberührt, nicht gepusht/gemergt.** Commit = **HEAD von `lane-p-p3-upload-pruefstatus`** (`git log -1` auf dem Branch; ein einzelner Commit mit allen P3-Änderungen + diesem HANDOFF-Eintrag).
**Gates (alle grün, im Worktree mit echten node_modules + frischer Worktree-DB `prisma/worktree-dev.db`):** `tsc --noEmit` = **0** · employee-file-Suite **147/147** (137 Basis + 10 neue #7-Tests: `derivePlanItemStatus` geprüft/ungeprüft, `planStatusToWorkingItemStatus`-Mapping, `isEvidenceChecked`, `buildPlanDeadlineRows` geprüft→erfüllt/ungeprüft→in-Arbeit, `normalizeEvidenceChecks`-Backfill) · **`next build` = „Compiled successfully"** (15 Routen, TS-Check ok). `prisma generate` + `db push` gegen frische Worktree-DB grün (additiv). **Kein `.env`/`.db`/node_modules/Kundendaten committet** (alles gitignored; node_modules nur lokal zum Build).

**⚠️ NEUE SCHEMA-SPALTE → Prod-`db push` beim Deploy nötig:** `EmployeeFile.evidenceChecks Json?` (nullable/additiv, P2023-sicher, kein `@default`). Read-Norm tolerant (fehlt → ungeprüft). Backup vor Prod-push wie üblich.

**Gebaut (Bounded Write-Set + nötige Verdrahtungs-Touches):**
- **#7 Prüf-/„geschlossen"-Status (Mark D1, EC-10 HART — kein Auto-Grün):**
  - Datenmodell: `EvidenceCheck`/`EvidenceChecks` in `types/employee.ts` (`evidenceId → { geprueft, am?, von? }`); additive nullable Spalte `evidenceChecks Json?` in `schema.prisma`; Repository (`employee-file-repository.ts`) Read (`asEvidenceChecks` → delegiert an reine `normalizeEvidenceChecks`) + Write (create + DRY `laneJUpdateFields` → alle upsert/replace/migrate-Stellen).
  - Logik (`training-plan.ts`): neuer Plan-Status `vorhanden-ungeprueft`; `derivePlanItemStatus(item, hasProof, ref?, isChecked=false)` → vorhanden+geprüft = `nachweis-vorhanden` (erfüllt), vorhanden+ungeprüft = `vorhanden-ungeprueft` (→ `beantragt`/severity „offen" = gelb); `buildPlanDeadlineRows` nimmt optionalen `isChecked`-Prädikat (Default = nie geprüft → EC-10-sicher); Helfer `isEvidenceChecked` + pure `normalizeEvidenceChecks`.
  - Ampel-Merge an der Aufrufstelle (compliance-status.ts **unverändert**, wie Queue C): `EmployeeFileDossierView` + `EmployeeFileOverview` + `app/actions/generate-audit-export.ts` reichen `isChecked` in `buildPlanDeadlineRows`/`derivePlanItemStatus`.
  - Admin-Toggle „Als geprüft markieren" (nur wenn Handler gesetzt = Admin/Mark): `EmployeeFileEvidenceRow` (Pflichtnachweise + Schulung/Unterweisung via DossierView) + `EmployeeFileTrainingPlan` (Plan-Slots). Toggle persistiert additiv über `employee.evidenceChecks` im bestehenden Akten-Auto-Save (Debounce → `saveEmployeeQueue`/`replaceEmployeeFilesForCompany`) — **kein neuer Server-Action/Storage-Pfad**. Live-Akte aktualisiert sofort (State-Update) + Ampel reagiert.
- **#6 Upload beim Anlegen/Bearbeiten (Mark D2 = beides):**
  - (b) Neu-Anlegen: nach `onAdd` springt die Akte direkt in den „Nachweise hochladen"-Schritt (`akteViewMode=bearbeiten` + `evidenceEditMode=true` + Toast) — Person ist da persistiert (ID/companySlug).
  - (a) Bearbeiten: Upload läuft im Akte-Bearbeiten-Modus (DossierView Evidence-Rows, bestehende Infra) inkl. neuem Prüf-Toggle. Zusätzlich `EmployeeForm` (master) um optionalen, kompakten Nachweis-Upload-Block erweitert (`FormEvidenceUploadSection`, nur bei persistierter Person + Handlern), der die bestehende Evidence-Infra (`onEvidenceUpload`/`saveEmployeeEvidenceFile`) nutzt — **kein neues Storage-Modell**.

**Verdrahtungs-Touches außerhalb des Bounded-Write-Sets (nötig, da einziger Render-/Konsum-Pfad; requirement-engine.ts + lib/tally-* UNBERÜHRT):** `EmployeeFileDossierView.tsx`, `EmployeeFileOverview.tsx`, `EmployeeFileTrainingPlan.tsx`, `app/actions/generate-audit-export.ts` (neuer Plan-Status zwingt dort die exhaustive `PLAN_STATUS_LABEL`-Map zu ergänzen + isChecked durchreichen). Reines Prop-/Predicate-Threading + Label, keine Norm-/Engine-Logik.

**Geparkte Fragen an Planer/Mark:**
1. **Admin-Gate für „geprüft":** Es gibt (noch) kein Auth-/Rollensystem. Der Prüf-Toggle ist derzeit gegated über „Handler vorhanden" (= Akte-Bearbeiten-Modus). `von` wird hart auf „Admin" gesetzt. Ist das als Admin/Mark-Gate ausreichend, oder soll ein echtes Rollen-/Login-Gate her? (Architektur → C-10-Gate.)
2. **#6a wörtlich im `EmployeeForm`:** Der reale Bearbeiten-Pfad ist die DossierView-„Bearbeiten"-Ansicht (Upload + Toggle dort funktional). Der EmployeeForm-Upload-Block ist verdrahtet, rendert aber nur in master-Modus mit persistierter Person — derzeit kein master-Edit-Render-Pfad in der App (Create = master/ohne ID, Generator = documents). Soll ein eigener „Akte im Formular bearbeiten"-Render-Pfad aufgemacht werden? (Scope → Planer.)

**Übergabe-Takt:** ✅ Stabiler Punkt — Gates grün, Scope (#6+#7/P3) abgeschlossen. Wartet auf Planer-Review + Mark-Merge-Gate. NICHT gemergt/gepusht.

### 2026-06-10 — ✅ Executor Lane O P2 (Schulungen-Abschnitt #2 + Datum-Default #3): FERTIG + committet (Branch `lane-o-p2-schulungen`, NICHT gepusht/gemergt)

**Branch:** `lane-o-p2-schulungen` (ab `origin/main` HEAD `205595a` = inkl. Lane-N P1). **`main` unberührt, nicht gepusht/gemergt.** Commit: **`a2fe6b9`**.
**Gates (alle grün, im Worktree mit echten node_modules):** `tsc --noEmit` = **0** · employee-file-Suite **137/137** (131 Basis + 6 neue #3-Tests: `isErstStandardGruppe1`, `defaultPlannedDateForNewItem` — Gruppe-1=startDate, Einzelschulung=manuell, kein startDate→undefined, Überschreibbarkeit) · **`next build` = „Compiled successfully"** (15 Routen, TS-Check ok, `/employee-automation` EC-09-Pfad compiled). Engine/UE untouched (requirement-engine.ts NICHT im Diff). **Kein `.env`/`.db`/node_modules committet** (node_modules nur lokal im Worktree zum Build; gitignored).

**Gebaut (Bounded Write-Set, 6 Dateien):**
- **#2 Eigener „Schulungen"-Abschnitt:** `EmployeeFileTrainingTargets` (Soll/Ist) + `EmployeeFileTrainingPlan` (Termin-Planung) aus dem „Pflicht-Set (abgeleitet)"-Block **herausgelöst** und als eigener, sichtbar getrennter `<section>` „Schulungen" platziert — in `EmployeeFileDossierView.tsx` (Bearbeiten) UND `EmployeeFileOverview.tsx` (read-only). (a) Standarddokumente/Unterweisungen bleiben im Akte-Kern oben („Schulung & Unterweisung" + „Pflichtnachweise"); (b) Schulungen (Jahresweiterbildung, modulare DIN-1-Schulungen, einmalige SDL-Schulungen) im neuen Abschnitt. Stalen „Placeholder — kein LMS" in `EmployeeFileDossierZones.tsx` (Z. ~98, ungenutzte Legacy-Komponente) auf den realen Abschnitt-Hinweis umgestellt.
- **#3 Datum-Default (Mark D3):** Neue reine Helper in `training-plan.ts`: `isErstStandardGruppe1(item)` (Gruppe 1 = Engine-Soll-Posten) + `defaultPlannedDateForNewItem(item, employee)` (Gruppe-1-Eintrag → Default `plannedDate = startDate`; Einzel-/Katalog-Schulung → kein Default; kein erfundenes Datum, wenn `startDate` leer). In `EmployeeFileTrainingPlan.handleAdd` verdrahtet — der Default wird nur beim NEU-Erzeugen gesetzt; das Datum-Feld bleibt **überall + immer editierbar** (überschreibbar). UI-Fußnote ergänzt.

**Norm/Guardrails:** keine erfundene Normpflicht (CL-Werte/Engine unberührt, nur Anzeige-Restrukturierung + Datum-Default); EC-10 (rechnerisch, kein Auto-Freigabe); EC-09 (Generator/`selected*DocIds`-Pfad unverändert, Build-Route compiled). **Reine Display-Trennung + additiver Datum-Default — keine Modell-/Persistenz-Änderung.**

**Geparkte Fragen (an Planer, NICHT selbst entschieden):**
- **Gruppe-1-Definition (#3/D3):** „Gruppe 1 = Erst-Standardunterweisungen + -erklärungen" → im `trainingPlan`-Kontext als **Engine-Soll-Posten** (`source:"soll-posten"`) interpretiert (= Default `startDate`), Katalog-Module (`source:"katalog"`) = Einzelschulung (manuell). Falls Mark eine andere Gruppe-1-Abgrenzung meint (z. B. konkrete Standarddokumente/Unterweisungen im Akte-Kern statt der Soll-Posten), bitte präzisieren — der Helper ist 1-zeilig umstellbar.
- **`EmployeeFileDossierZones.tsx`** ist im Code **nirgends importiert/gerendert** (tote Legacy-Komponente). Placeholder nur kosmetisch aktualisiert; ggf. Kandidat zur Löschung (Planer-Gate).

### 2026-06-10 — ✅ Executor Lane N P1 (Bugs #1 Bestellungen + #4 Schulungs-Auswahl): FERTIG + committet (Branch `lane-n-p1-bugs`, NICHT gepusht/gemergt)

**Branch:** `lane-n-p1-bugs` (ab `main` HEAD `26690af`). **`main` unberührt, nicht gepusht/gemergt.** Commit: **siehe `git log -1` auf `lane-n-p1-bugs`** (zum Zeitpunkt des Schreibens `053460d`; finale Hash nach evtl. Amend mit `git log` prüfen).
**Gates (alle grün):** `npx tsc --noEmit` = **0** · employee-file-Suite **131/131** (127 Basis + 4 neue: 3 Lane-N-Bestellungen-Persistenz/Patch + 1 Overlay-Logical-Path) · **`next build` = „Compiled successfully"** (17 Worker, 15 Routen, TS-Check ok, `/employee-automation` = EC-09-Pfad compiled). Engine/Suite-untouched: requirement-engine/compliance/training-plan-Tests unverändert grün. **Kein `.env`/`.db`/node_modules committet** (node_modules nur als APFS-Clone in den Worktree zum Build; gitignored).

**Root-Cause #1 (Bestellungen tauchten nicht auf):** `BESTELLUNG_DEFS.appointmentId` zeigte auf die Einzel-Appointment-IDs `safety-training`/`fire-safety`/`compliance-training` — die existierten **NIE im S3-Bucket** (nur in der Legacy-Demo-`employee-config.ts`). Die real eingespielten Vorlagen liegen ALLE in EINEM Ordner `appointments/bestellungen/` als drei `.docx`. → Der `appointmentIds`-basierte Generator-Pfad fand nie eine Vorlage, also kam nie eine Bestellung im ZIP/in der Anzeige an.

**Gebaut (Bounded Write-Set eingehalten — 7 Dateien):**
- **`employee-display-labels.ts`:** `BestellungDef` von `appointmentId` → `appointmentFolderId` (`"bestellungen"` für alle drei) + `docFileName` (reale `.docx`). Neuer Helfer `bestellungDocId(typ)` = `${folder}-${name}` exakt wie `/api/templates` Doc-IDs vergibt. `getBestelltAls`/`backfillBestelltAls` leiten Backfill jetzt aus den realen Bestell-Doc-Chips (`selectedAppointmentDocIds`) ab (alte tote appointmentIds liefern korrekt **nichts**). `setBestelltAlsPatch` gibt jetzt `{ appointmentIds, selectedAppointmentDocIds }` zurück (Ordner-Sync + genaue Doc-Chips, übrige Auswahl bleibt).
- **`vorlagen-set-catalog.ts`:** `SetDocumentSpec.templateLogicalPath` (neu, optional); `BESTELLUNG_OVERLAY_DOCS` zeigen jetzt auf `appointments/bestellungen/Bestellungsurkunde_{Ersthelfer|Brandschutzhelfer|Sicherheitsbeauftragter}.docx` (single-source aus `BESTELLUNG_DEFS`).
- **`EmployeeForm.tsx`:** dedizierter **„Bestellt als (formale Ernennung)"-Multiselect** direkt aus `BESTELLUNG_DEFS` (CL-08/CL-23/CL-74), persistiert nach `bestelltAls`; Submit reconcilet appointmentIds + Bestell-Doc-Chips über `setBestelltAlsPatch`. Der generische Appointment-Multiselect bleibt als „Weitere Termine / Overlays".
- **`validations/employee-form.ts`:** `bestelltAls`-Feld (enum-Array, optional).
- **`EmployeeFileDossierView.tsx`:** `BestellungenPanel.toggle` nutzt den neuen Doc-aware Patch (kein appointmentId-basiertes Doc-Sync mehr für die 3-in-1-Ordner-Struktur). „Bestellungen (bestellt als)"-Anzeige in DossierZones unverändert (las schon `getBestelltAls`).
- **Tests:** `persistence-backfill.test.ts` auf das neue Modell umgestellt + neue Fälle (Doc-Chip-Backfill, tote Legacy-IDs → leer, Patch-Sync, leere Auswahl entfernt Ordner, `bestellungDocId`-Schema); `vorlagen-set-mapping.test.ts` + Overlay-Logical-Path-Test.

**#4 (Schulungs-Auswahl nicht erreichbar):** Diagnose „evtl. read-only" → bei Inspektion ist die `onSave`-Kette **bereits intakt**: `EmployeeAutomationPage` reicht im **Bearbeiten-Modus** `onSavePerson={handleSavePerson}` an `EmployeeFileDossierView`, das `onSave={onSavePerson}` an `EmployeeFileTrainingPlan` durchreicht → `editable = Boolean(onSave)` = true → Schulungs-/Modul-Dropdown bedienbar; `handleSavePerson` → `setEmployees` → debounced Auto-Save (`saveEmployeeQueue`). Read-only ist nur die **Übersicht** (`EmployeeFileOverview`, by design). **Kein Code-Change nötig** — verifiziert, nichts erfunden (EC-10/Rollen-Kontrakt). Browser-Klick-Abnahme durch Mark optional.

**Geparkte Fragen (an Planer/Mark, NICHT selbst entschieden):**
1. **Inline-Edit-Tabelle** (`EmployeeFilePersonRolleEditTable.tsx`, Zeile „Bestellungen") nutzt weiter einen **generischen Appointment-Multiselect** auf `appointmentIds` — NICHT im P1-Write-Set, daher unangetastet. Soll diese Zeile ebenfalls auf das `bestelltAls`-Modell umgestellt werden? (eigener kleiner Touch, Planer-Gate.)
2. **Legacy-`employee-config.ts`** (Demo-Appointments `safety-training` etc.) ist VERBOTEN/außerhalb Write-Set — bleibt als Demo-Fixture; in der Live-App kommen Appointments aus `/api/templates`. Kein Handlungsbedarf, nur Hinweis.
3. **Repository-Read-Norm** (`lib/employee-file-repository.ts`, VERBOTEN) ruft `backfillBestelltAls` ohne `selectedAppointmentDocIds` — Signatur blieb rückwärtskompatibel; Bestandsakten ohne persistiertes `bestelltAls` liefern jetzt `[]` statt aus toten appointmentIds (korrekt, da diese nie reale Bestellungen waren). Falls ein DB-Backfill der `bestelltAls`-Spalte aus Doc-Chips gewünscht ist → Planer/Schema-Slice.

### 2026-06-09 — ✅ Executor Lane M (Q8 Generator-Datum-Granularität, „sowohl als auch"): FERTIG + committet (Branch `lane-m-datum-granularitaet`, NICHT gepusht/gemergt)

**Branch:** `lane-m-datum-granularitaet` (ab `main` HEAD `7254ab5`). **`main` unberührt, nicht gepusht/gemergt.** Commit: **`7d4f1f3`**.
**Gates (alle grün):** `npx tsc --noEmit` = **0** · employee-file-Suite **127/127** (120 Basis unverändert + **7 neue** Auflösungs-Tests in `date.test.ts`) · **`npm run build` = „Compiled successfully"** (kein „Build error"/„must be async" — der frühere Async-Build-Befund aus Lane L ist durch `36c4509` bereits behoben; verifiziert). **Kein `.env`/`.db`/node_modules committet** (node_modules nur lokal in den Worktree kopiert zum Build; gitignored).

**Gebaut (Bounded Write-Set eingehalten — 6 Dateien):**
- **Zweite Override-Ebene `perDocType`** (Datum pro Dokument-Typ, gilt für ALLE gewählten Personen) neben der bestehenden `perDocument`-Ebene (Person+Dokument). **Auflösung je Dokument (spezifischer sticht): `perDocument` → `perDocType` → #10/#C-Default bzw. `global` → heute.**
- **Doc-Typ-Schlüssel = Vorlagen-`docId`** (gleiches Dokument über mehrere Personen = gleicher Typ), gekapselt in `documentTypeKey(docId)`; neuer Auflösungs-Helfer `resolveDocDateOverride` (`utils/date.ts`) für beide Generator-Stellen (Rolle + Bestellung).
- **Persistenz:** `generatorDates`-Json (Lane J A3) um `perDocType` erweitert; cross-person → in jede Akte gespiegelt (`applyBatchDatesToEmployees`), Read-Norm `asGeneratorDates` **tolerant** (Bestandsdaten ohne `perDocType` → ok, kein P2023). **KEINE neue Schema-Spalte.**
- **UI:** Abschnitt „Datum pro Dokument-Typ" (ein Feld je Typ, für alle gewählten Personen) NEBEN den Per-Person+Dokument-Overrides; Toggle-Buttons + Auflösungs-Hinweis. Leer = nächste Ebene greift.
- **EC-09:** Default „heute" unverändert, wenn nichts gesetzt (`resolveDocDateOverride` → `undefined` → bisherige Default-/Global-Logik); Generator-Action-Signatur additiv (`DocumentDates.perDocType?`). **EC-10:** reines Ausgabedatum, kein Engine-/Norm-/UE-Eingriff.

**Dateien:** `…/employee-generator/generate-employee-docs.ts` · `…/employee-file/utils/date.ts` (+ `date.test.ts`) · `…/employee-file/EmployeeAutomationPage.tsx` · `…/employee-file/types/employee.ts` · `lib/employee-file-repository.ts`. **Engine/`requirement-engine.ts`, `lib/tally-*`, `vorlagen-set-catalog.ts`, training-* NICHT angefasst.**

**Geparkt / offen für Planer-Review:**
1. **EC-09-ZIP Live-Klick (`POST /employee-automation` 200) nicht im Worktree fahrbar** (kein `.env`/DB im Worktree, DSGVO — Realdaten nicht kopiert). **Struktureller Beleg:** ZIP-Generator-Pfad fasst nur die additive `perDocType`-Auflösung an; ohne gesetztes Datum identisch zum Vorzustand. `next build` der Route lief durch. → Live-ZIP-Klick = Mark-Gate.

### 2026-06-09 — ✅ Executor Lane L (#5 UE-Anerkennung beim Schulungs-Upload, Variante C): FERTIG + committet (Branch `lane-l-ue`, NICHT gepusht/gemergt)

**Branch:** `lane-l-ue` (ab `main` HEAD `3a5cf49`). **`main` unberührt, nicht gepusht/gemergt.** Commit: **`d7d6493`** (Feature + 14 neue #5-Tests). HANDOFF-Eintrag separat.
**Gates (alle grün):** `npx tsc --noEmit` = **0** · employee-file-Suite **120/120** (106 Basis unverändert + **14 neue** #5-Tests in `training-plan.test.ts`) · **Engine-Suite 52/52 unberührt** (`requirement-engine.ts` nicht im Diff) · `lib/tally-*` unberührt. **Kein `.env`/`.db`/node_modules committet** (node_modules nur lokal in den Worktree gelinkt/kopiert, vor Commit entfernt).

**Gebaut (Bounded Write-Set eingehalten — 6 Dateien):**
- **Eigene Cert-Expert-Schulungen (Variante C):** beim Anhängen eines Katalog-Moduls (`source:"katalog"`) wird der Eintrag automatisch `ueAnerkennung:"eigen-katalog"` markiert (UE bekannt) → fließt über `recognizedUe`/`computeRecognizedIstContribution` in das Ist (**CL-27-Anrechnung** auf Jahres-Weiterbildung **CL-11**; ein `source:"soll-posten"`-Eintrag zusätzlich in seinen eigenen Einmal-Posten). **`computeTrainingGaps`** rechnet jetzt mit effektivem Ist (manuell + anerkannt) → **Soll/Ist-Lücke reagiert**, Engine unberührt. **Keine Unterschrift** (Schulungsnachweis ≠ Unterweisung).
- **Externe Uploads — Best-Effort-Extraktion MIT Pflicht-Bestätigung:** Upload an einem Plan-Eintrag (kein Eigen-Katalog) extrahiert UE best-effort aus dem Dateinamen (`extractUeFromText`, Heuristik „… UE"/„Unterrichtseinheiten") → `ueVorschlag` bleibt **`unchecked`** (`ueBestaetigt:false`), zählt **0** zum Ist; erst nach **fachlichem Klick** „Fachlich bestätigen" (`setUeBestaetigt`) fließt der bestätigte Wert ein. **Keine Auto-Anerkennung (EC-10).** UI (`UeAnerkennungInfo` in `EmployeeFileTrainingPlan.tsx`) zeigt Eigen-Katalog (grün, automatisch angerechnet) bzw. Vorschlag (violett, „fachlich prüfen") + Bestätigungs-Toggle.
- **Persistenz:** Status (`ueAnerkennung`/`ueVorschlag`/`ueVorschlagQuelle`/`ueBestaetigt`) im **bestehenden `trainingPlan`-Json** mitgeführt (`TrainingPlanItem` erweitert + `asTrainingPlan`-Read-Norm in `employee-file-repository.ts`) — **KEINE neue DB-Spalte/Schema-Migration.** Ist-Werte weiterhin über die bestehenden Felder `weiterbildungIstUE`/`einmaligIstUE` (effektives Ist = Merge an der Rechen-Stelle, nicht persistiert doppelt → kein Doppelzählen).
- **Norm:** UE nur CL-belegt (CL-11/20/21/24/25/29/30, Anrechnung CL-27) bzw. Katalog-Eigen-UE; Extraktion = „fachlich prüfen" bis Bestätigung — **keine erfundenen UE.**

**Dateien:** `lib/employee-file-repository.ts` · `…/employee-file/training-catalog.ts` · `…/training-plan.ts` · `…/EmployeeFileTrainingPlan.tsx` · `…/types/employee.ts` · `…/training-plan.test.ts`. **`requirement-engine.ts`/`EmployeeFileTrainingTargets.tsx`/Generator/`tally-*` NICHT angefasst.**

**Geparkt / offen für Planer-Review:**
1. **EC-09-ZIP Live-Klick (`POST /employee-automation` 200) nicht im Worktree fahrbar:** kein `.env`/DB im Worktree (DSGVO — Realdaten nicht kopieren); `next build` läuft hier nicht durch (Turbopack lehnt symlinked node_modules ab; bei kopiertem node_modules **vorbestehender** Build-Fehler in `generate-employee-docs.ts` „Server Actions must be async" — **nicht im Lane-L-Diff**, latente Build-Config-Sache der bestehenden Codebasis). **Struktureller EC-09-Beleg:** Generator/ZIP-Action importiert **kein** #5-Code; einzige geteilte Änderung ist additiv/type-only an `TrainingPlanItem`. → **Live-ZIP-Klick = Mark-Gate**; bitte beim Review beachten + ggf. der vorbestehende `generate-employee-docs.ts`-Async-Build-Befund separat verifizieren.
2. **Externe Extraktion = Dateiname-Heuristik** (kein PDF-Text-Parsing in Browser-Evidence-Pfad ohne neue Lib/Architektur → Scope-/Gate-Frage). Reicht Best-Effort-aus-Dateiname (Q5' „Best-Effort mit Pflicht-Bestätigung" = bestätigt) oder soll echtes PDF-Parsing als eigener Slice folgen? → Planer/Mark.



**Branch:** `lane-k-set-mapping` (ab `main` HEAD `43e8875`). **`main` unberührt, nicht gepusht/gemergt.** Commit: **`e3d2458`** (Feature) + HANDOFF-Commit.
**Gates (alle grün):** `prisma generate` + `db push` (neue `gender`-Spalte) gegen **frische Worktree-DB** erfolgreich (additive nullable Spalte, P2023-sicher) · `npx tsc --noEmit` = **0** · employee-file-Suite **106/106** (90 alt unverändert + **16 neue** `vorlagen-set-mapping.test.ts`) · **Engine-Suite 52/52 unberührt** (requirement-engine.ts nicht im Diff) · `lib/tally-*` unberührt. **Kein `.env`/`.db`/node_modules committet** (gitignore verifiziert; node_modules nur lokal in den Worktree symverlinkt).

**Gebaut (Bounded Write-Set eingehalten):**
- **Set→Dokument-Mapping (B)** in `vorlagen-set-catalog.ts` (deklarativ, `buildSetDocumentPlan`/`coreDocsForSetKategorie`/`overlayDocsForEmployee`): Core-Set je Set-Kategorie — Basis (Arbeitsschutz **CL-75** „fachlich prüfen" + Datenschutz/Verschwiegenheit **CL-04/05**); SMA/FK + jeweilige Stellenbeschreibung; **Bürokraft** = Bildschirmarbeitsplatz-Unterweisung (CL-75 Büro) statt SR-DA + Datenschutz/Verschwiegenheit. **Overlays positionsunabhängig:** Bestellungen (**CL-08/23/74** aus `bestelltAls`), Kfz-/Fahr-Anweisung (**CL-73**, fachlich prüfen), objektbezogene DA (**CL-22**, Datum = erster Einsatz **manuell**), Mutterschutz-Hinweis (**CL-77**, MuSchG, **weiblich, ALLE Sets**). Default-Datum aller Standarddoku = `startDate`; Ausnahme Objekt-DA = manuell.
- **Generator** (`generate-employee-docs.ts`): je MA ein `_Dokumenten-Plan.txt`-Manifest (Core + Overlays + fehlende Vorlagen als Platzhalter, CL/„fachlich prüfen"-markiert); **try/catch-gewrappt → bricht den ZIP nie (EC-09)**. Physische Vorlagen-Verarbeitung (S3-Pfad) unberührt.
- **#7 Org-Titel-Gating:** Schichtleitung/Objektleitung = **FK-Unter-Titel** (`requiresFk`), nur sichtbar/wählbar wenn Norm-Klasse `fk` gewählt; bei `fk`-Abwahl wird ein gesetzter FK-Unter-Titel zurückgesetzt. Reine Anzeige — **KEINE Engine-Änderung** (`roleClasses` bleibt maßgeblich). In `employee-stammdaten-options.ts` (`visibleOrgTitleOptions`/`isOrgTitleGatedOut`/`FK_ONLY_ORG_TITLE_IDS`) + `EmployeeForm.tsx`.
- **Geschlechts-Feld:** additive **nullable** Spalte `gender String?` (`schema.prisma` + `employee-file-repository.ts` Read-Norm `asGeschlecht` + DRY-Write über `employeeToUpsertData`/`laneJUpdateFields`, Muster Lane J) + `types/employee.ts` (`Geschlecht`) + Validierung + Form-Feld (`GESCHLECHT_OPTIONS`). Nur „weiblich" triggert das Mutterschutz-Overlay. PII minimal, **kein Auto-Status (EC-10)**.

**⚠️ Fehlende Vorlagen (Platzhalter + Hinweis im Manifest, NICHT erfunden):**
1. Allgemeine Arbeitsschutz-Grundunterweisung (CL-75) — VORLAGE FEHLT.
2. Bildschirmarbeitsplatz-Unterweisung Büro (CL-75) — VORLAGE FEHLT.
3. Stellenbeschreibung Sicherheitsmitarbeiter — VORLAGE FEHLT.
4. Stellenbeschreibung Führungskraft — VORLAGE FEHLT.
5. Kfz-/Fahr-Anweisung (CL-73) — VORLAGE FEHLT (bereits in Auftrag genannt).
6. Mutterschutz-Hinweis (CL-77, MuSchG) — VORLAGE FEHLT.

**Prod-Deploy-Hinweis:** Neue Spalte `gender String?` → **`db push` auf Prod-DB beim Deploy nötig** (additiv/nullable, keine Datenmigration). Macht der Planer/Mark beim Hetzner-Redeploy.

**Geparkte Fragen / offene Punkte (NICHT selbst entschieden):**
- **CL-75/CL-77 exakter §** (DGUV-Nummern / MuSchG-§) noch offen (Register `legal-input`) → alle betroffenen Posten als „fachlich prüfen" geführt, kein erfundener Wert.
- **Objekt-Overlay-Trigger:** mangels Projektakte als Heuristik an `sdlScopes` (nicht leer) gekoppelt — bis die Projektakte existiert (Q10b: manuell). Falls ein anderer Trigger gewünscht ist → Planer-Entscheid.
- **EC-09-ZIP-Live-Klick** (`POST /employee-automation` 200) im echten Browser durch Mark abzunehmen; Generator-Änderung ist rein additiv (manifest, try/catch) — kein Bruch zu erwarten. Set-Mapping-Logik ist unit-getestet (16 Tests).
- **Stellenbeschreibung-/Set-Slugs:** Set-Kategorie→`roleId`-Auflösung nutzt weiterhin die Lane-J-Default-Heuristik; echte S3-Set-Ordner = Daten-/Mark-Entscheidung (bereits in `vorlagen-set-catalog.ts` dokumentiert).

✅ **Stabiler Punkt** — Lane K fertig, Gates grün, nicht gemergt/gepusht. Bereit für Planer-Review + Merge.

---

### 2026-06-09 — ✅ Executor Lane J (Persistenz-Migration A1+A2+A3): FERTIG + committet (Branch `lane-j-persistenz`, NICHT gepusht/gemergt)

**Branch:** `lane-j-persistenz` (ab `main` HEAD `03a5334`). **`main` unberührt, nicht gepusht/gemergt.** Commit: **`74650ef`**.
**Gates (alle grün):** `npx tsc --noEmit` = **0** · employee-file-Suite **90/90** (80 alt unverändert + **10 neue** Backfill-Tests `persistence-backfill.test.ts`) · **Engine-Suite unberührt** (requirement-engine.ts nicht im Diff) · **`db push` gegen frische Worktree-DB erfolgreich** (4 neue Spalten verifiziert: alle `notnull=0`, `dflt_value=NULL` → P2023-sicher). **⚠️ Prod-DB-Migration (`db push`) steht beim Deploy noch aus** — Realdaten liegen NICHT im Worktree (additive nullable Spalten → keine Datenmigration nötig, nur Schema-Sync; macht der Planer beim Deploy). **Kein `.env`/`.db`/node_modules committet** (gitignore verifiziert).

**Schema-Diff (`EmployeeFile`, alle nullable/additiv, kein `@default`):**
- `bestelltAls Json?` (A1) — persistierter Bestell-Status, dokument-unabhängig.
- `bestellungSchulungLink Json?` (A1) — optionale, nicht blockierende Verknüpfung Bestellung↔Schulung, **KEIN Auto-Status** (EC-10).
- `setKategorie String?` (A2) — von der Rolle entkoppelt, Default aus `roleId`, überschreibbar.
- `generatorDates Json?` (A3) — `{ global?, perDocument? }`, ersetzt Session-State.

**Gebaut (echte persistierte Felder statt Projektion + Legacy-Backfill):**
- **A1 `bestelltAls`:** `getBestelltAls` liest jetzt das echte Feld (Source of Truth); fehlt es auf einer Bestandsakte → tolerant aus `appointmentIds` ableiten (`backfillBestelltAls`). Dossier-Toggle (`EmployeeFileDossierView.tsx`) setzt das Feld direkt; `appointmentIds` bleiben über `setBestelltAlsPatch` synchron, damit der Generator die Bestell-Dokumente unverändert erzeugt (**EC-09**). Optionales `bestellungSchulungLink` (nullable, KEIN Pflicht-Gate, KEIN Auto-Status).
- **A2 `setKategorie`:** neuer Resolver `resolveSetKategorie()` (persistiertes Feld > Default aus `roleId` > undefined). EmployeeForm liest/schreibt das Feld; Backfill aus `roleId`. Rolle vs. Set-Kategorie entkoppelt.
- **A3 Generator-Datum:** `EmployeeAutomationPage` lädt die Batch-Ansicht (globaler Default + Per-Doc-Map) aus den persistierten `generatorDates` der Akten (`extractBatchDatesFromEmployees`) und merged Änderungen beim Debounce-Save zurück (`applyBatchDatesToEmployees`) — **kein** `set-state-in-effect` (Lint-sauber bzgl. neuer Effekte; einzige verbleibende `set-state-in-effect`-Meldung ist **pre-existing** auf main, Z. ~566). Reines Ausgabedatum, kein Engine-/Norm-Eingriff (EC-10).
- **Repository:** Read-Normalisierung `asBestelltAls`/`asBestellungSchulungLink`/`asSetKategorie`/`asGeneratorDates` (Muster `asTrainingPlan`, Müll/Legacy/null tolerant) + **alle 4 Write-Mapping-Stellen** (create `employeeToUpsertData` / upsert-update / replace-update / migrate-update) über gemeinsamen `laneJUpdateFields`-Helfer (`Prisma.JsonNull` für „nicht gesetzt", P2023-sicher).

**FRAGE / Hinweis für Planer-Review:**
1. **Write-Set-Erweiterung (bewusst, minimal):** `EmployeeFileDossierView.tsx` war NICHT im gelisteten Bounded-Write-Set, ist aber der **einzige** Editor für `bestelltAls` (Toggle). Ohne diese 1-Zeile (`bestelltAls: [...next]` im Patch) würde das neue persistierte Feld aus der UI nie geschrieben → A1 wäre nur read-/backfill-seitig korrekt. Habe den Toggle minimal erweitert (Feld direkt setzen, `appointmentIds` bleiben synchron). **Bitte im Review gegenchecken** (EC-09: Generator-Doc-Auswahl unverändert; EC-10: kein Auto-Status).
2. **`generate-employee-docs.ts`** (im Write-Set gelistet) **nicht** geändert — A3 fließt über den bestehenden `documentDates`-Parameter + die neue Page-Persistenz; der Generator löst Daten bereits korrekt auf. Keine Generator-Logik-Änderung nötig.
3. **DB-Doppelpfad** beim `db push` bestätigt (`prisma/prisma/dev.db` ist die reale DB) — bekanntes Tech-Debt, nicht in dieser Lane angefasst.

✅ **Stabiler Punkt** — Lane J abgeschlossen, committet (`74650ef`), nicht gepusht/gemergt. Warten auf Planer-Review + Merge-Gate; Prod-`db push` beim nächsten Deploy.

---

### 2026-06-09 — ✅ Executor Lane I (Dispatch v6 #10 Datums-Logik/Defaults): FERTIG + committet (Branch `lane-i-datums-defaults`, NICHT gepusht/gemergt)

**Branch:** `lane-i-datums-defaults` (ab `main` HEAD `8e0dd8f`). **`main` unberührt, nicht gepusht/gemergt.** Commit: **`0ec3de6`**.
**Write-Set eingehalten** — geändert: `…/employee-file/requirement-engine.ts` + `requirement-engine.test.ts` · `…/employee-generator/generate-employee-docs.ts`. **Nicht berührt:** `employee-file-requirements.ts` (nicht nötig — Wiederholungs-Frist fließt über die bestehende `summary.fristen`→`mergedFristen`-Verdrahtung der DossierView automatisch in die Ampel) · `EmployeeFileDossierView.tsx` (keine Änderung nötig, optionaler Write). VERBOTEN (`lib/tally-*`, `vorlagen-set-catalog.ts`, `EmployeeForm.tsx`) nicht angefasst; keine neuen UE/CL erfunden.

**Gebaut (exakt #10) — Default-Daten überall überschreibbar:**
- **Geburtsdatum:** `{Birthday}` lag bereits im Generator-`templateData` und wird in **alle** Rollen- **und** Bestell-/Appointment-Dokumente gespreadet → erscheint bereits auf Schulungs-/Unterweisungs-Dokumenten. Keine Änderung nötig (verifiziert).
- **Erst-Standardunterweisung + Erklärungen → Default = erster Arbeitstag (`startDate`):** Generator klassifiziert per Dateiname (`isErstunterweisungDoc`) Datenschutz **CL-04**, Verschwiegenheit **CL-05**, Dienstanweisung **CL-03**, Arbeitsschutz **CL-75** („fachlich prüfen") + Erklärungen und setzt deren Default-Ausgabedatum auf `startDate`; **Per-Doc-Override (#8) sticht** weiter, fehlt `startDate` → globaler Generator-Datum-Wert. MA unterschreibt nach.
- **>1 Jahr seit Erstunterweisung → Wiederholungs-Unterweisung** als Engine-`Deadline` `frist-wiederholung-unterweisung`, **CL-75 „fachlich prüfen"** (Basis DGUV V23 §4(2) „regelmäßig, lt. DA mind. jährlich" — KEIN Turnus darüber hinaus erfunden). Bezug = `startDate` bzw. optionaler `erstunterweisungDatum`-Override. Bewusst **kein** Auto-„abgelaufen" (EC-10), Status bleibt „fachlich prüfen", auch wenn fällig (nur Trigger-Text wechselt von „beobachten" → „prüfen"). Nur bei erfasster Norm-Klasse (kein schwebender Eintrag).
- **Einzelschulungen → individuelles Datum:** deckt sich mit #8-Per-Doc-Override + Queue-C (kein neuer Mechanismus).
- **Objektbezogene Unterweisung (CL-22):** rechnerischer Default = erster Arbeitstag; bewusst **NICHT** auf `startDate` im Generator gezwungen → läuft manuell (Q10b), bis Projektakte existiert. Bestehende CL-22-Ableitung unverändert.
- **Engine-Helfer (exportiert, deterministisch/UTC):** `defaultErstunterweisungDatum(startDate)`, `isWiederholungUnterweisungFaellig(basis, ref)`; neuer optionaler `RequirementContext.erstunterweisungDatum`.

**Gates:** `npx tsc --noEmit` = **0**. `npx tsx --test employee-file/*.test.ts` = **80/80** grün (71 Bestand + **10 neue #10-Szenarien**: Default-Datum aus `startDate`, >1J fällig/nicht fällig/genau-1J, `erstunterweisungDatum`-Override, kein `startDate`/keine Klasse → kein Eintrag, Verwaltung greift CL-75, CL-22-Default). **Bestehende Engine-Regeln/UE/CL unverändert** (CL-02/11/20/21/24/25/29/30 etc. nicht im Diff der Engine-Logik berührt — nur additive Wiederholungs-Frist + Helfer). **EC-09:** `generateEmployeeDocs`-Action-Signatur unverändert, rein additive Datums-Auflösung → ZIP-Pfad unberührt (Live-Klick-Abnahme optional Mark). **EC-10** gewahrt.
**Hinweis Infra:** Worktree hatte kein eigenes `node_modules` → für tsc/tsx das `node_modules` der Haupt-Checkout symlinkt (gitignored, nicht committet); danach laufen audit-export-Tests (exceljs) ebenfalls grün mit.

**Geparkt (keine eigene Entscheidung):** keine offenen Fragen aus #10 — CL-75/CL-76 exakter § bleibt der bereits gelistete offene Faden (Mark reicht §; bis dahin „fachlich prüfen", wie umgesetzt).

---

### 2026-06-09 — ✅ Executor Lane H (Dispatch v5 #4 Manueller Upload signierter Dokumente): FERTIG + committet (Branch `lane-h-upload`, NICHT gepusht/gemergt)

**Branch:** `lane-h-upload` (ab `main` HEAD `f009481`). **`main` unberührt, nicht gepusht/gemergt.** Commit: **`6669fcb`**.
**Write-Set eingehalten** — geändert: `…/employee-file/EmployeeFileDossierView.tsx` · `…/employee-file/EmployeeFileEvidenceRow.tsx` · `…/employee-file/EmployeeFileTrainingPlan.tsx`. **Nicht berührt** (nicht nötig): `employee-evidence-storage.ts` (Slot-Liste **nicht** erweitert — neue Slots sind String-Konvention `unterweisung:{id}`, kein festes Slot-Modell nötig), `EmployeeFileDossierZones.tsx` (Legacy-Placeholder-Accordion, nicht im aktiven Upload-Flow). VERBOTENE Dateien (`requirement-engine.ts`/Engine, `lib/tally-*`, `generate-employee-docs.ts`, `EmployeeForm.tsx`, `vorlagen-set-catalog.ts`) **nicht angefasst**.

**Gebaut (exakt #4) — gleiche bestehende Evidence-Infra, kein neues Storage-Modell:**
- **Schulung-&-Unterweisung-Sektion** (DossierView): war read-only `RequirementTable` → jetzt **uploadbare `EmployeeFileEvidenceRow` je Position** (Slot-Konvention `unterweisung:{id}`), Upload-/Entfernen-Button im Edit-Modus, nutzt die vorhandenen Hooks `onEvidenceUpload`/`onEvidenceRemove` → `saveEmployeeEvidenceFile`/`removeEmployeeEvidenceFile`/`uploadEmployeeEvidenceAction` (unverändert).
- **Unterschrifts-Logik sichtbar gemacht:** Badge **„unterschriftspflichtig"** auf Unterweisungen/Standarddokumenten (Allgemeine Unterweisung/Dienstanweisung **CL-03**, Datenschutzunterweisung **CL-04**, Verschwiegenheitsunterweisung **CL-05**, objekt-/SDL-bezogene Unterweisung, Wiederholungs-/Arbeitsschutzunterweisung **CL-75 „fachlich prüfen"**); Badge **„nur anhängen"** auf reinen Schulungs-/Qualifikationsnachweisen (Qualifikationsfortschreibung + Training-Plan-Einträge). Werte = nur Anzeige/Slot-Zuordnung, **keine erfundene Normpflicht**, Engine unberührt.
- **`EmployeeFileEvidenceRow`** um optionalen `signatureRequired`-Prop erweitert (rendert das Unterschrifts-Badge) + **`unchecked`-Badge** an der hochgeladenen Datei (EC-10).
- **Pflichtnachweis-Standarddokumente** (Datenschutz CL-04, Verschwiegenheit CL-05) bekommen das Unterschrifts-Badge; **Bestellungen-Panel** (#C) hatte Upload/Entfernen + „unterschriftspflichtig"-Badge bereits → unverändert. **Training-Plan-Slots** (`training-plan:{id}`) hatten Upload/Entfernen bereits → „nur anhängen"-Badge ergänzt.

**Gates:** `npx tsc --noEmit` = **0** · `npx tsx --test modules/03-mitarbeiterakte-tool-2/employee-file/*.test.ts` = **71/71 grün** (Engine nicht angefasst). **EC-09** (Generator/ZIP `POST /employee-automation`): unberührt — keine Generator-/Action-Datei geändert, Upload reused bestehende, EC-09-grüne Action. **EC-10:** hochgeladene Nachweise bleiben `unchecked`, keine Auto-Freigabe.
**Statisch belegt (OS-Dateidialog im Sandbox nicht klickbar):** Upload-Verdrahtung = exakter Reuse der bereits live-verifizierten Evidence-Action (gleicher Pfad wie Pflichtnachweise/Bestellungen/Training-Plan); tsc + Suite grün. **Live-Klick-Abnahme (Datei wählen → erscheint/bleibt/entfernbar) = Mark.**
**Geparkt:** nichts Blockierendes. *(Hinweis Sandbox: in diesem Worktree fehlte `node_modules` → für tsc/Suite per Symlink auf das `node_modules` des Haupt-Checkouts gezeigt; gitignored, nicht committet.)*

**Nächster Schritt:** Planer-Review Diff `f009481..6669fcb` (besonders: Engine/Generator wirklich unberührt? Slot-Konvention konsistent? Unterschrifts-Mapping CL-belegt?), dann ggf. Merge nach `main`.

### 2026-06-09 — ✅ Executor Lane G (Dispatch v4 #D Dokumentenvorlage / Set-Auswahl): FERTIG + committet (Branch `lane-g-vorlagen-set`, NICHT gepusht/gemergt)

**Branch:** `lane-g-vorlagen-set` (ab `main` HEAD `7673735`). **`main` unberührt, nicht gepusht/gemergt.** Commit-Hash: siehe unten.
**Write-Set eingehalten** — geändert: NEU `…/employee-file/vorlagen-set-catalog.ts` · `…/employee-file/EmployeeForm.tsx` · `…/employee-file/validations/employee-form.ts` · `…/employee-file/types/employee.ts` · `…/employee-generator/generate-employee-docs.ts`. **Nicht berührt** (nicht nötig): `app/actions/generate-employee-docs.ts` (reiner Re-Export, keine Signaturänderung), `EmployeeAutomationPage.tsx` (Set-/Overlay-UI lebt in `EmployeeForm` im `documents`-Modus, den die Page bereits hostet), `lib/employee-file-repository.ts` (KEINE Set-Persistenz-Spalte gebaut → s. geparkte Frage). VERBOTENE Dateien (`requirement-engine.ts`/Engine, `lib/tally-*`, `lib/data/tally-*`) **nicht angefasst**.

**Gebaut (exakt #D):**
- **Set-Kategorie-Achse** (`vorlagen-set-catalog.ts`): 3 Kategorien `Sicherheitsmitarbeiter | Führungskraft | Bürokraft` → leiten über `resolveSetKategorieRoleId()` die Core-Vorlagen-Rolle (`roleId`) ab. **Begriffs-Modell strikt:** eigene Achse, KEINE Norm-Klasse (`roleClasses`/Engine unberührt), KEIN Org-Titel (`roleType`); `standard models` (Tool 1) nicht importiert.
- **Selektion**: Set-Kategorie-Dropdown im Anlege-Formular (master-Modus, vor der Grundrolle) **und** direkt im Generator-Tab (documents-Modus, über den Core-Documents) — „Set + Core/Overlay direkt im Generator auswählbar".
- **Overlays positionsunabhängig** (`OVERLAY_DEFS`): (a) **Bestellungen** knüpfen an `bestelltAls`/`appointmentIds` (Lane C) — bestehende Appointment-Doku, kein neuer Slot; (b) **Fahrtätigkeit → Fahr-/UVV-Anweisung** = **CL-73 „fachlich prüfen"** (legal-input, KEIN erfundener Wert), im Generator als additiver Template-Platzhalter (`Fahrtaetigkeit`/`FahrAnweisungHinweis`) bei `drivesServiceVehicle === true`.
- **Persistenz ohne Schema-Eingriff:** `setKategorie` reitet auf dem bestehenden `roleId` (Set → Core-Rolle); beim Laden Projektion `projectSetKategorieFromRoleId(roleId)`. Optionales Modell-Feld `setKategorie?` nur für UI-Komfort; Source of Truth = `roleId`.

**Gates (Worktree, node_modules vom Haupt-Checkout verlinkt):** `npx tsc --noEmit` = **0** · `npx tsx --test …/employee-file/*.test.ts` = **71/71** grün (Engine + Tests nicht angefasst). **EC-09:** Generator-Pfad nur additiv erweitert (zwei zusätzliche `templateData`-Platzhalter; easy-template-x ignoriert nicht vorhandene Felder → Vorlagen ohne diese Felder unberührt) + bestehende `roleId`/Doc-Auswahl unverändert → strukturell intakt; **Live-ZIP-POST-Klick durch Mark abzunehmen** (S3-Creds im Sandbox nicht verfügbar, Muster wie frühere Lanes). **EC-10** gewahrt (kein Freigabe-Wording). Kein `.env`/`.db`/Kundendaten-Commit.

**🅿️ GEPARKTE FRAGEN an Planer/Mark (nicht geraten, nicht gebaut):**
1. **S3-Template → Set-Kategorie-Mapping** ist eine Daten-/Mark-Entscheidung (heute nur „DIN 77200 Allgemeine" im Bucket). Katalog baut die Struktur + ein **Platzhalter-Mapping** (`DEFAULT_SET_ROLE_SLUGS`, Default-Slugs aus den Demo-/Legacy-Rollen) mit toleranter Fallback-Auflösung auf die erste vorhandene Rolle (kein EC-09-Bruch). Sobald Mark die echten Set-Ordner liefert → reale Slugs eintragen, kein Logik-Umbau nötig.
2. **Eigene persistierte `setKategorie`-DB-Spalte** (statt Projektion über `roleId`) = Schema/Repo-Slice (wie Lane C bei `bestelltAls`) — bewusst **nicht** gebaut (Write-Set/Scope). Falls explizite Persistenz gewünscht (z. B. Set ≠ abgeleitete Rolle), bitte als eigenen Schema-Slice freigeben.

### 2026-06-09 — ✅ Executor Lane E (Generator-Datum): #8 FERTIG + committet (Branch `lane-e-generator-datum`, NICHT gepusht/gemergt)

**Branch:** `lane-e-generator-datum` (ab `main` HEAD `40bd1d2`). **`main` unberührt, nicht gepusht.**
**Write-Set eingehalten** — 4 der 6 gelisteten Dateien geändert: `…/employee-file/EmployeeAutomationPage.tsx` · `…/employee-generator/generate-employee-docs.ts` · `app/actions/generate-employee-docs.ts` (Re-Export um `DocumentDates`-Typ erweitert) · `…/employee-file/utils/date.ts`. **Nicht angefasst:** `…/employee-file/EmployeeFileDossierView.tsx` (enthält keine Datums-/`new Date()`-Logik — verlinkt nur den Generator-Tab; Datum-UI lebt in `EmployeeAutomationPage`) · `…/employee-generator/templateData.ts` (**existiert nicht** — `{currentDate}`-Logik liegt real in `generate-employee-docs.ts`; Auftrags-Zeilenverweis war gegen eine ältere Struktur). Keine verbotene Datei (Engine/`EmployeeForm.tsx`/`lib/*`/Lane-F) berührt.

**Gebaut (exakt #8 — Generator-Datum global + pro Dokument):**
- **Action-Signatur:** `generateEmployeeDocs(..., documentDates?: DocumentDates)` mit `DocumentDates = { global?: string; perDocument?: Record<string,string> }`. Optional → **Default-Verhalten unverändert** (alle Aufrufe ohne das Argument erzeugen weiterhin „heute").
- **Auflösungsreihenfolge je Dokument:** Per-Doc-Override → globaler Default → **heute** (`resolveDocumentDate` in `date.ts`, neuer Helfer + `documentDateKey(employeeId, docId)`). Per-Doc sticht.
- **Bestellungen (#C-Pfad gewahrt):** Per-Doc-Override sticht weiterhin über den Bestell-Default (`startDate`); ohne Override bleibt der Bestell-Default bei Bestellungen, sonst der globale Wert. `BestellDatum`/`Unterschriftspflichtig`-Platzhalter unverändert.
- **UI (Generator-Bar):** globales Datumsfeld („Generator-Datum, Default für alle"; leer = heute) + „Datum für alle übernehmen" (Bulk, Muster Queue C) + ausklappbare Per-Doc-Liste (je ausgewähltem Einzeldokument aller Export-Personen, Schlüssel = `documentDateKey`) mit eigenem Datum-Input (Override). EC-10-Disclaimer im Panel.

**Gates:** `tsc --noEmit` = **0** · Test-Suite `tsx --test …/employee-file/*.test.ts` = **58/58** grün (Engine nicht angefasst; `npm install` in diesem Worktree nötig, da `pdf-lib`/`exceljs` für die 2 Audit-Tests fehlten — nur Dependency-Install, kein Code) · EC-09-Generator-Flow strukturell intakt (nur Datum-Auflösung geändert, Default „heute" identisch zu vorher) — Live-ZIP-POST-Klick durch Mark optional abzunehmen (S3-Creds im Sandbox nicht verfügbar) · EC-10 gewahrt (kein Freigabe-Wording) · kein `.env`/`.db`/Kundendaten-Commit.

**Geparkt (NICHT gebaut, da außerhalb Scope/Write-Set):** Persistenz des gesetzten Generator-Datums (global + per-Doc) über localStorage/Repo — aktuell Session-State (zurückgesetzt bei Reload). War im Auftrag nicht gefordert (Default „heute" bleibt); falls gewünscht → eigener Auftrag (berührt `lib/*`/Repository = Lane F). **Frage an Planer:** soll das gesetzte Datum persistieren?
### 2026-06-09 — ✅ Executor Lane F (Dispatch v3 / #2 Qualifikation-Multiselect): FERTIG + committet (Branch `lane-f-qualifikation`, NICHT gepusht/gemergt)

**Branch:** `lane-f-qualifikation` (ab `main` = `40bd1d2`). **`main` unberührt, nicht gepusht, nicht gemergt.**
**Write-Set eingehalten** (genau diese 7 Dateien, keine verbotene): NEU `…/employee-file/qualification-catalog.ts` · `…/employee-file/EmployeeForm.tsx` · `…/employee-file/validations/employee-form.ts` · `…/employee-file/types/employee.ts` · `…/employee-file/requirement-engine.ts` + `requirement-engine.test.ts` · `lib/employee-file-repository.ts`. Generator-/Dossier-Dateien + `EmployeeAutomationPage.tsx` NICHT berührt.

**Gebaut (exakt #2):**
- **Katalog `qualification-catalog.ts`:** 8 CL-belegte Optionen — Unterrichtung §34a (CL-01, Stufe A), Sachkunde §34a (CL-01, Stufe A), GSSK (CL-07, Stufe B, FK-qual.), Servicekraft (CL-10, Stufe B, FK-qual.), Geprüfte Fachkraft/Meister/IHK-Werkschutzmeister (CL-07, Stufe C, FK-qual.), Waffensachkunde (CL-76, **Zusatz/additiv, „fachlich prüfen"**). Plus `deriveQualificationFlags` (höchste Stufe A<B<C + additive Flags) und verlustfreie Migration `parseQualifications`/`serializeQualifications`.
- **Feld `qualifications: string[]`** (Multiselect) in `types/employee.ts` + Zod-Schema; UI = `MultiSelect` statt Freitext-`Input` in `EmployeeForm`.
- **Engine liest STRUKTURIERT statt Regex:** `resolveQualification(ctx)` nutzt `ctx.qualifications` primär (Stufe→`q-profil`-Label, Sachkunde/Unterrichtung→`q-34a`+CL-02-Frist, FK-qual., Zusatz-Zeile `quali-zusatz-*` CL-76 „fachlich prüfen"); Freitext-`qualification` bleibt **Fallback** (Legacy/Tally). Zusatz ändert Stufe NICHT, erzeugt keine neue DIN-Pflicht (EC-10).
- **Migration verlustfrei (keine neue DB-Spalte):** strukturierte Auswahl wird über die bestehende `qualification`-String-Spalte als „ · "-Label-Liste round-trip-stabil ge-/entladen; Legacy-/Tally-Freitext wird beim Read tolerant in Katalog-IDs gemappt, Unbekanntes bleibt als Freitext erhalten (Engine-Fallback greift weiter). Repository: 1 Read-Stelle + 4 Write-Stellen (Helfer `qualificationColumnValue`).

**Gates (im Worktree, node_modules vom Haupt-Checkout verlinkt):** `npx tsc --noEmit` = **0** (app-weit) · `npx tsx --test …/employee-file/*.test.ts` = **71/71** grün (58 alt unverändert + **13 neu**: Stufen A/B/C-Aggregation, mehrere Qualifikationen, Waffensachkunde additiv, strukturiert-vor-Freitext, Freitext-Fallback, unbekannte ID → „fachlich prüfen", Migration tolerant + round-trip).

**EC-09:** Generator-/Template-Dateien nicht angefasst, tsc app-weit grün → statisch unverändert. **Live-ZIP-Klick** im Worktree nicht fahrbar (keine isolierte DB/.env; Personendaten nicht committable) → **optionale Mark-Klick-Abnahme** empfohlen (Muster wie frühere Lanes).

**🅿️ GEPARKTE FRAGE an Planer (1 Zeile, außerhalb Write-Set):** Der einzige Engine-Aufrufpfad der UI ist `buildRequirementContext` in `employee-file-requirements.ts` (NICHT im Write-Set) — er übergibt `qualification` (Freitext), aber noch nicht `qualifications`. Dadurch laufen §34a/Sachkunde/Unterrichtung live korrekt (über die serialisierten Labels im Freitext-Fallback), aber die NEUEN strukturierten Signale (höchste Stufe im `q-profil`-Label, Waffensachkunde-Zusatzzeile, FK-qual.) erscheinen im Dossier erst nach **einer additiven Zeile** dort: `qualifications: employee.qualifications`. Bitte als Mini-Folge-Edit freigeben/mergen (kein Scope-Eingriff, rein additiv).

---

### 2026-06-09 — ✅ Executor Lane C (Bestellungen): #7 + #C FERTIG + committet (`daea75d`, Branch `lane-c-bestellungen`, NICHT gepusht/gemergt)

**Branch:** `lane-c-bestellungen` (ab `main`). **`main` unberührt, nicht gepusht.**
**Write-Set eingehalten** (nur diese 6 Dateien geändert): `…/employee-file/employee-display-labels.ts` · `…/employee-file/EmployeeFileDossierView.tsx` · `…/employee-file/EmployeeFileDossierZones.tsx` · `…/employee-file/types/employee.ts` (= das `@/lib/types/employee`-Alias-Ziel; ein separates `lib/types/employee.ts` existiert nicht) · `app/api/templates/route.ts` · `…/employee-generator/generate-employee-docs.ts`. (`app/actions/generate-employee-docs.ts` = nur 4-Zeilen-Re-Export → keine Änderung nötig.) Keine verbotene Datei (`lib/tally-*`, `EmployeeAutomationPage.tsx`, Engine) berührt.

**Gebaut (exakt #7 + #C):**
- **Begriffs-Trennung Bestellung ≠ Schulung:** neuer Typ `BestellungTyp = ersthelfer|brandschutzhelfer|sibe` + `BESTELLUNG_DEFS` (CL-08/CL-23/CL-74, je unterschriftspflichtig) in `employee-display-labels.ts`. Bestellungen = NUR diese 3 formalen Ernennungen, keine Schulungen/Unterweisungen.
- **Akte-Flag `bestelltAls` (Multiselect):** neues Feld in `types/employee.ts`. **Persistenz ohne Repo-/Schema-Eingriff:** `bestelltAls` ist eine Projektion über die bereits persistierten `appointmentIds` (Helfer `getBestelltAls` / `setBestelltAlsPatch`, gekoppelt an die 3 Bestell-appointmentIds `safety-training`/`fire-safety`/`compliance-training`). Round-trip-stabil über den bestehenden `appointmentIds`-Pfad (Repo + Prisma lagen außerhalb des Write-Sets → bewusst NICHT angefasst).
- **Generator 2 Wege:** (a) **aus Vorlage generieren** — Bestellungs-Appointments erhalten als Default das Einstellungs-/Bestelldatum (`startDate`, sonst `currentDate`) + additive Platzhalter `BestellDatum`/`Unterschriftspflichtig` (Templates ohne diese Felder unberührt → EC-09); (b) **hochladen** — Upload je Bestellung über bestehende Evidence-Infra (`evidenceId = bestellung:{typ}`, bleibt `unchecked`, EC-10).
- **UI:** Bestellungen-Panel in `EmployeeFileDossierView` (Multiselect-Chips m. CL-Badge, „unterschriftspflichtig"-Badge, „Aus Vorlage generieren" / „Bestellung hochladen"); read-only Zone in `EmployeeFileDossierZones` zeigt jetzt saubere „Bestellungen (bestellt als)" statt vermischter „Zusatzrollen".
- **`app/api/templates/route.ts`:** filtert Unterweisungs-/Schulungs-Ordner (Name enthält „unterweisung/schulung/unterrichtung") aus der `appointments`-Liste → die fälschlich abgelegte Unterweisung erscheint nicht mehr unter Bestellungen. Generator (EC-09) liest Vorlagen über `listTemplateFiles`, nicht über diese Route → unberührt.

**Gates:** `tsc --noEmit` = **0** · Test-Suite `tsx --test …/employee-file/*.test.ts` = **58/58** grün (Engine nicht angefasst) · ESLint geänderte Dateien = 0 · EC-09-Generator-Flow strukturell unverändert (nur additive Bestellungs-Platzhalter) — Live-ZIP-POST-Klick durch Mark optional abzunehmen (S3-Creds im Sandbox nicht verfügbar) · EC-10 gewahrt (`unchecked`, keine Freigabe-Aussage) · kein `.env`/`.db`/Kundendaten-Commit.

**Geparkt (NICHT selbst gemacht — kein S3-Schreibzugriff in Cursor):**
- **S3-Move:** `appointments/unterweisungen/Unterweisungsnachweis_Arbeitsschutz_DGUV.docx` → Unterweisungen/Schulungen (CL-75) = **Server/Mark**. Bis zum Move blendet der Route-Filter den Ordner defensiv aus; nach dem Move greift der Filter weiterhin korrekt (keine Doppelarbeit).

**Frage an Planer (Architektur, NICHT selbst entschieden):**
- `bestelltAls` ist bewusst als Projektion über `appointmentIds` gebaut (Write-Set schließt Repo/Schema aus). Falls eine **eigene persistierte DB-Spalte** `bestelltAls` gewünscht ist (echte Trennung der Achsen Bestellung vs. Appointment-Vorlagen), wäre ein Repo-/Schema-Slice nötig (`schema.prisma` + `employee-file-repository.ts`, 1 Read + 3 Write-Mappings) — als eigener Dispatch.
- Optionale **Verknüpfung Bestellung↔Schulung** (auftrag „optional"): als reine UI-Verknüpfung nicht persistierbar ohne Feld → **geparkt** (gleicher Repo-/Schema-Slice). Aktuell nicht gebaut.
### 2026-06-09 — ✅ Executor Lane D (Tally-Mapping #3): FERTIG + COMMITTET (`lane-d-tally` HEAD), nicht gepusht

**Branch:** `lane-d-tally` (ab `origin/main`). **`main` unberührt; nicht gepusht** (auftragsgemäß).
**Write-Set eingehalten** (nur diese): `lib/tally-intake-service.ts` · `lib/tally-intake-config.ts` (Quelle von `mapTallyUploadToEvidenceId`, separat → vom Auftrag zugelassen) · `lib/data/tally-employee-slots.json` · `hq/10_Bridge/TALLY_FIELD_MAPPING.md`. Keine verbotene Datei (`lib/types/employee.ts`, `modules/03-…/**`, Engine) berührt.

- **#3 Q3 umgesetzt:** Schulungen → **je-Schulung-eigener-Slot** via `training-plan:{id}`-Konvention (Ersthelfer→`training-plan:erste-hilfe` CL-08, Brandschutz→`training-plan:brandschutz` CL-23), statt fixem Slot-je-Typ. Dokumente/Zertifikate (Arbeitsvertrag/Bundesauszug/Dienstausweis/Sachkunde CL-01/02) behalten ihre feste evidenceId.
- **Fehl-Mapping gefixt (Bug):** Datei-Felder ohne Label (Slots 3–10) gaben über die alte Label-Heuristik **alle** dieselbe `tally-upload`-evidenceId → spätere Uploads überschrieben frühere. Jetzt **positionsbasiert eindeutig** (`TALLY_FILE_POSITION_EVIDENCE_IDS` + explizite `evidenceId` je Eintrag in der JSON; neuer `resolveTallyFileEvidenceId`: explizit → Position → Label-Rückfall). Slot-10-Extras (`tally-weitere-nachweise-2/-3/-4`) ebenfalls entkollidiert.
- **Abgleich-Tabelle** (Tally-Feld → evidenceId → Akte-Slot, Status ok/fix) vollständig in `TALLY_FIELD_MAPPING.md` (neuer Abschnitt „Lane D #3"). Reine Zuordnung, **keine neue Normpflicht**; EC-10: Import bleibt `unchecked`.

**Gates:** `tsc --noEmit` = **0** · `tsx --test modules/03-…/employee-file/*.test.ts` = **58/58** grün (keine Engine-/Akte-Datei berührt) · JSON ohne Intra-Slot-Kollisionen verifiziert. EC-09 unberührt (Tally-Service nicht im ZIP-Pfad).

**Geparkte Frage an Planer:** Die Akte legt `training-plan:{id}`-Slots heute mit **benutzergenerierten** Item-Ids (`tp-…`, Queue C) an; der Tally-Import nutzt **stabile** Ids (`erste-hilfe`/`brandschutz`). Damit ein importierter Schulungsnachweis automatisch an einem vorhandenen Plan-Eintrag erscheint, müssten Plan-Items dieselbe stabile Id tragen **oder** ein Lookup ergänzt werden — das berührt `modules/03-mitarbeiterakte-tool-2/**` (Lane C/Akte, außerhalb Lane-D-Write-Set). **Nicht selbst entschieden/gebaut.**

### 2026-06-09 — ✅ Executor Lane A (Shell-Nav): P1 #1/#B/#9 FERTIG + COMMITTET + GEPUSHT (`38bc341`)

**Branch:** `cursor/tool2-shell-nav` (ab `main@db84837`) → gepusht zu `origin`. **`main` unberührt.**
**Write-Set eingehalten** (nur Lane-A-Shell-Dateien): `modules/00-dashboard/CertificationOsModuleOverview.tsx` · `…/employee-file/EmployeeAutomationPage.tsx` · `…/EmployeeFileIndex.tsx` · `…/EmployeeFileWorkspaceLayout.tsx`. (`CompanyHubView.tsx` nicht nötig → nicht angefasst.) Keine verbotene/Engine-/Generator-Datei berührt.

- **#1 Nav:** Dashboard liest den aktiven Tab aus `?area=<id>` (SSR-stabil: erster Render = Default == Server-HTML, URL erst nach Mount via `useEffect` → kein Hydration-Mismatch); Tab-Klick spiegelt den Tiefen-Link via `history.replaceState` (kein Re-Mount). „Zur Übersicht" in der Akte (Toolbar + Hub `onBack`) zielt jetzt auf `/?area=mitarbeiterakte` statt `/` → landet auf dem Mitarbeiterakte-Tab/Firmen-Übersicht.
- **#B Layout:** Ursache gefunden — der **fixe Navbar** ist `h-14`/`sm:h-16`, der Workspace versetzte aber nur `pt-14` → ab ≥640px **8px Überlappung** (Inhalt „abgeschnitten"). Fix: `pt-14 sm:pt-16`. Zusätzlich ab `lg` Viewport-Höhen-Shell (`lg:h-screen` + `min-h-0`): Index + Hauptbereich scrollen **intern**, Toolbar/Notice/Generate-Bar bleiben fixiert → kein Seiten-Scroll-Sprung beim Öffnen; `min-w-0`-Guards gegen Horizontal-Overflow. Unter `lg` natürlicher Fluss (`min-h-[calc(100dvh-…)]`).
- **#9 Selektion:** sichtbare Auswahl-Leiste im Index mit **Alle/Keine-Toggle** + Zähler („X ausgewählt"); Generate-Bar-Label „→ als Gruppe exportieren". **Keine** benannten/gespeicherten Gruppen (wie Mark Q9). Bestehende `batchSelectedIds`-Mechanik unverändert.

**Gates:** `tsc --noEmit` = 0 · Test-Suite **58/58** unverändert grün (keine Engine-Datei berührt) · Routes `GET /`, `/?area=mitarbeiterakte`, `/employee-automation` = **200** (EC-09-Generator unberührt im Diff → nicht-regressiv) · EC-10 unverändert · keine `.env`/`.db`/`hq/03_Kundenprojekte/**` committet.

**Offen / Hinweis an Planer:** `components/layout/Navbar.tsx` setzt `style={{ width: "100vw" }}` — `100vw` schließt die Scrollbar-Breite ein und kann minimal horizontalen Overflow/Shift erzeugen. Datei liegt **außerhalb** des Lane-A-Write-Sets → **nicht editiert, als Frage geparkt** (eigener kleiner Fix-Dispatch sinnvoll). Browser-Live-Klick-Abnahme (Fensterbreiten-Durchklick + ZIP-POST-Klick) durch Mark optional; hier via tsc/Suite/Route-200/Diff belegt.
### 2026-06-09 — ✅ Executor (Lane B / Agent 2): #A Rollen-Eingabe-Bug FERTIG + committet + gepusht (`0929d94`, Branch `cursor/tool2-rollen-eingabe`)

**Gebaut (exakt #A, kein Scope-Zusatz; Engine NICHT angefasst — nur Eingabe entsperrt):**
- `validations/employee-form.ts`: `roleClasses` `.min(1)` entfernt → **leere Auswahl zulässig** (Overview/Engine zeigen „Keine Norm-Klasse erfasst", EC-10) statt Save zu blockieren. Keine Zwangsvorauswahl.
- `EmployeeForm.tsx`: Org-Titel-Wechsel setzt Default-Norm-Klasse **nur noch, wenn noch keine erfasst ist** (überschreibt bewusst gewählte/geleerte Auswahl nicht); `roleClasses`-Feld nicht mehr `required`. Spiegelt das bereits korrekte Muster aus `EmployeeFilePersonRolleEditTable.tsx`.
- `EmployeeFileAkteInlineEdit.tsx`: `roleClasses`-Feld nicht mehr `required`.
- **Nicht angefasst (bereits korrekt / vollständig):** `EmployeeFilePersonRolleEditTable.tsx` (Org-Titel schon non-destruktiv) · `employee-stammdaten-options.ts` (alle 5 Klassen inkl. sichtbarer „Verwaltung / Geschäftsführung" bereits da).

**Ergebnis:** EK/FK/Verwaltung frei kombinierbar, jede Klasse einzeln an-/abwählbar, „nur Verwaltung" wählbar, leere Auswahl ok (kein Crash).

**Gates (DoD):** `tsc --noEmit` = **0** · Engine-Suite (`tsx --test`) **30/30 unverändert grün** (Engine nicht im Diff; Szenario 9 belegt „Keine Norm-Klasse"-Hinweis) · EC-09-Generatorpfad nicht berührt. **EC-09-ZIP-tsx-Smoke im Sandbox nicht durchführbar (kein S3-Netz in der Shell)** → Live-`:3001` + Browser-Klick-Abnahme = Mark.

**❓ FRAGE an Planer (geparkt — nicht selbst entschieden, Datei außerhalb Lane-B-Write-Set):** „alle 5 Klassen **frei** kombinierbar" — die Multiselect-UI lebt in `RoleClassSelector.tsx` (NICHT im Write-Set). Dort sind `verwaltung`/`praktikant`/`subunternehmer` **untereinander exklusiv** (bewusstes Bestandsdesign; mit EK/FK kombinierbar). Mit dem Fix oben sind EK abwählbar, „nur Verwaltung", Kombination mit EK/FK und leere Auswahl erfüllt. **Soll die gegenseitige Exklusivität der Nicht-Bewachungs-Klassen ZUSÄTZLICH aufgehoben werden?** → bräuchte Edit an `RoleClassSelector.tsx` (außerhalb Write-Set) → Planer-/Mark-Entscheid, von mir nicht eingeplant.

### 2026-06-08 — ✅ Executor: Queue C — lücken-getriebene Termin-Planung Schulungen FERTIG + COMMITTET (`fbe1980`)

**Gebaut (exakt nach `CURSOR_C_TERMINPLANUNG_AUFTRAG.md` §3–§7, kein Scope-Zusatz):**
- **§3 Datenmodell:** `trainingPlan Json?` am `EmployeeFile` (Prisma) + `TrainingPlanItem`-Typ (`types/employee.ts`). Repository liest/schreibt tolerant (`asTrainingPlan` normalisiert; Bestandsakten ohne Feld → `[]`, **kein P2023**) an allen 4 Write-Stellen.
- **§4 `training-catalog.ts`:** DIN-1-Module als **Lehrbausteine** (CL-11, UE rein informativ — **kein eigener Norm-UE/Soll**). `findCatalogModule`-Helper.
- **§5 `training-plan.ts`:** Gap-Logik `computeTrainingGaps` (Soll−Ist=Rest, nie negativ, null→null), `derivePlanItemStatus` (nachweis-vorhanden > ueberfaellig > geplant > ohne-datum), `planStatusToWorkingItemStatus`, `planEvidenceId` (`training-plan:{id}`), `buildPlanDeadlineRows`. **+ `training-plan.test.ts` 12/12 grün.**
- **§6 Plan→Ampel operativ:** Plan-Fristen in DossierView **und** read-only Übersicht in `summary.fristen` gemergt → Ampel reagiert. **Engine/UE/Pflicht-Set unberührt** (kein Import-/Logik-Eingriff in `requirement-engine.ts`).
- **§7 UI `EmployeeFileTrainingPlan.tsx`:** gap-getrieben (Lücke je Soll-Posten), Zuweisung Katalog-Modul + Soll-Posten, **Bulk-Datum + Einzel-Override**, **Nachweis-Slot je Eintrag** über bestehende Evidence-Infra (Upload/Entfernen, `evidenceId=training-plan:{id}`). Read-only-Modus ohne `onSave` (Inputs disabled).

**Gates (DoD §8):**
- `tsc --noEmit` = **0**.
- Tests: training-plan **12/12** · requirement-engine **27/27** · compliance-status **10/10** (alle via `npx tsx --test`).
- **Browser :3001 verifiziert** (Wolf Street / Peter BOnd): Katalog-Modul + Soll-Posten zuweisen, Einzel-Override → „geplant", Bulk-Datum „Datum für alle" → beide „geplant", Vergangenheitsdatum → „überfällig" + Ampel „Nächste Frist/Überfällig" rot. **Persistenz über Reload erhalten** (`trainingPlan` in DB). Read-only Übersicht zeigt Plan + Lücke + Status (Inputs disabled), Ampel identisch, EC-10-Disclaimer da.
- **EC-09-Smoke:** realer „ZIP exportieren"-Klick → `POST /employee-automation` **200** (~800 ms echte Generierung, kein 5xx). Generator-Code unangetastet.
- Prisma `generate` + `db push` mit `DATABASE_URL=file:./prisma/dev.db`. **DB nicht committet.**
- Commit `fbe1980` = genau 10 Dateien (8 Code + `prisma/schema.prisma` + `types/employee.ts`); **kein** `.env`/`.db`/`hq/03_Kundenprojekte/**`.

**1 Verifikations-Hinweis (kein Defekt, kein geparkter Scope):** Der **Nachweis-Upload-Klick** öffnet einen **OS-Dateidialog**, der vom Browser-Automations-Harness nicht bedienbar ist (Input/File-Input-CDP gesperrt). Die „Nachweis-vorhanden → grün"-Logik ist **unit-getestet** (`derivePlanItemStatus` + Mapping) und nutzt die **identische, in früheren Slices browser-verifizierte Evidence-Infra** (gleiche S3-Action, nur `evidenceId`-Konvention neu). Slot/Buttons live sichtbar + verdrahtet. Falls Mark eine Live-Klick-Abnahme des Uploads will → manuell oder anderes Harness.

**Geparkt (Norm/Scope):** nichts — §3–§7 vollständig, keine Norm-Zweifel aufgetreten.

### 2026-06-08 — ✅ Executor: Read-only Akte-/Vorzeige-Übersicht (Queue B / Pt 1) FERTIG + COMMITTET (`ae477e8`)

**Fertig (exakt nach `CURSOR_UEBERSICHT_READONLY_AUFTRAG.md`, kein Scope-Zusatz, 2 Code-Dateien):**
- **Neu `EmployeeFileOverview.tsx`** (read-only): ruft `getEmployeeFileSummary(...)` **exakt wie DossierView** (Single Source of Truth, keine Parallel-/Neuberechnung). Rendert Kopf (Name/Org-Titel/Norm-Klassen via `resolveRoleClasses` + `BEWACHUNG/NICHT_BEWACHUNG_CLASS_OPTIONS`-Labels, Kennzahlen) + `EmployeeFilePflichtStatusPanel` (Ampel, unverändert wiederverwendet) + Pflicht-Set/Person&Rolle/Pflichtnachweise/Schulung/Geltungsbereich/Fristen/offene Punkte als read-only `RequirementTable` + UE-Soll/Ist via `EmployeeFileTrainingTargets` **ohne `onSave`** (Ist-Inputs `disabled+readonly`) + EC-10-Footer. **Keine** Stifte/Upload/Edit-Felder.
- **`RequirementTable`/`ClauseBadge` lokal dupliziert** (DossierView exportiert sie nicht; reine Präsentation, keine Logikänderung — Park-Option §5 gewählt).
- **Toggle „Bearbeiten ↔ Übersicht"** in `EmployeeAutomationPage.tsx` an der Akte-Render-Stelle. Default = Bearbeiten (kein Verhaltensbruch). State `useState("bearbeiten")` SSR-stabil, **kein** localStorage im ersten Render (Hydration-Lehre `01f720b`).

**Leitplanken gewahrt:** KEINE Engine-/Norm-/UE-Datei geändert (nur 2 Präsentations-Dateien). EC-09 Generator/ZIP unberührt. EC-10-Disclaimer „rechnerisch · kein Freigabestatus" + Footer sichtbar. Keine neue CL — Werte 1:1 aus der Summary.

**Gate (alles grün, echter Browser :3001):** `tsc --noEmit` = **0** · Engine-Suite `tsx --test requirement-engine.test.ts` = **27/27** (unverändert) · **EC-09-ZIP** `POST /employee-automation` **200**, Body 355 KB enthält `UEsDBA` (base64 `PK`-ZIP-Magic), kein 5xx · **Browser-Akzeptanz** (Wolf Street / Peter BOnd, EK-Bewachung): Toggle schaltet; Übersicht zeigt Ampel + Pflicht-Set (CL-01/03/04/05/06/08) + Schulungs-Soll (CL-11, Soll 40 UE, Ist-Input disabled/readonly) + Fristen + offene Punkte; keine Edit-Affordances; Werte identisch zur Bearbeiten-Ansicht (gleiche Summary).

**Commit:** `ae477e8` (2 Code-Dateien, enge Pathspecs — **kein** `.env`/`.db`/`hq/03_Kundenprojekte/**`). Bridge-Doku separat.

**Offen / geparkt:** nichts geparkt — Auftrag Pt 1 vollständig. Nicht gepusht (Mark pusht selbst).

### 2026-06-08 — Executor: Queue-Punkt 2 (G4 Phase 2) re-verifiziert + 3 (Regression Trainings-Übersicht) diagnostiziert — KEIN Code-Bau

**(2) G4-Phase-2-Delta — unabhängig am aktuellen HEAD (`e1899dd`) re-verifiziert → Ziel bereits erfüllt, bleibt geparkt (kein Bau).** `EmployeeAutomationPage.tsx`: Anlege-Formular = `displayMode="master"` (Z. 559, keine Doc-Chips), Generator-Tab = `displayMode="documents"` (Z. 624, rendert die Doc-Chips). `EmployeeForm.tsx`: `showDocuments = displayMode "full"|"documents"` (Z. 393). → **Doc-Auswahl liegt bereits im Generator-Tab** (Gate b erfüllt, deckt sich mit dem Park-Befund in `CURSOR_G4_PHASE2_AUFTRAG.md` §2). **Offene Frage an Mark bleibt** (§3 dort, A/B/C/D): welches konkrete Rest-Delta? Ohne bestätigtes, reviewtes Ziel **kein Umbau am EC-09-kritischen Generator** (Run-Order-Parken-Regel + Scope-Guardrail).

**(3) Regression „grüne UE-Soll/Ist-Übersicht" — diagnostiziert: KEINE Rendering-/Sichtbarkeits-Regression. Kein versehentliches Verdecken durch G4/Slice 4.** Belege:
- `EmployeeFileTrainingTargets.tsx` (grün „rechnerisch erreicht" bei Ist ≥ Soll) ist unverändert vorhanden; in `EmployeeFileDossierView.tsx` Z. 462 weiterhin gerendert, sobald `schulungsSoll.length > 0`.
- Diff-Check: **G4 (`047878c`) fasst DossierView nicht an**; **Slice 4 (`2261d26`) ist rein additiv** (fügt `EmployeeFilePflichtStatusPanel`/Ampel oberhalb ein, entfernt/verschiebt/verdeckt die Trainings-Übersicht NICHT).
- **Live verifiziert (:3001):** bei einer EK/FK-Person rendert die grüne Schulungs-Soll-Karte korrekt (Jahres-Weiterbildung CL-11, Soll/Ist/Rest, Balken).
- **Ursache der „weg"-Wahrnehmung = Klassifikation, nicht Rendering:** Das `jahres-weiterbildung`-Soll (CL-11) wird nur bei `bewachung` (EK/FK/Subunternehmer) erzeugt (Slice-2-Finding F3, gewollt). Personen ohne Bewachungs-Klasse zeigen die Karte nicht — das war **vor** G4 genauso. DB-Stichprobe: EK/FK-Personen (Peter BOnd, joe, Felix=fk, blubermann) → Karte sichtbar; Legacy-Personen ganz **ohne Rolle** (Markus Mahatma, peter Marquardt → `roleType`/`roleClass`/`roleClasses` leer) → keine Karte (kein Bewachungs-Basis-Set, unverändert).
- **⚠️ Bewusst NICHT geändert:** Die Sichtbarkeit „aufzudrehen" hieße, das `bewachung`-Gate / die UE-Norm-Logik zu ändern — laut Auftrag verboten („KEINE UE-Werte/Norm-Logik ändern. Nur Rendering/Sichtbarkeit."). Da es **kein** Rendering-Defekt ist, gibt es nichts zu „reparieren", ohne Norm-Logik zu berühren.
- **❓ Frage/Empfehlung an Mark/Planer:** Bei welcher **konkreten Person** ist die Karte „weg"? Falls eine Person sie zeigen *soll*, ist sie ohne Bewachungs-Klasse erfasst → **Norm-Klasse EK/FK setzen** (jetzt per neuer Mehrfachauswahl trivial). Soll die Karte künftig auch für Nicht-Bewachungs-Rollen erscheinen, ist das eine **Norm-Logik-Entscheidung** (Cross-Check §4 / Planer-Gate), kein Executor-Rendering-Fix.

### 2026-06-08 — ✅ Executor: EK/FK-Refinement FERTIG + COMMITTET + GEPUSHT (`e1899dd`)

**Fertig (Queue-Punkt 1, `CURSOR_EKFK_REFINEMENT_AUFTRAG.md`):** Norm-Klasse = **Mehrfachauswahl** (`roleClasses: RoleClass[]`, Prisma `Json?`). EK + FK frei kombinierbar (FK ⊇ EK → EK+FK = FK-Set, keine neue Pflicht); Verwaltung/Praktikant/Subunternehmer mit EK/FK kombinierbar (Doppelrolle geht im Set auf). Altes Feld `zusatzBewachungNiveau` aus der UI **entfernt** (Spalte bleibt read-only fürs Migrieren). **Idempotente Read-Migration** (`resolveRoleClasses`): gefülltes Set hat Vorrang, sonst aus `roleClass`/Org-Titel + altem Niveau ableiten. Engine derived `hasEK/hasFK/bewachung/fuehrung` aus dem Set. Neuer `RoleClassSelector` (Checkbox-Gruppen Bewachung / Keine-andere). Jede Regel behält `clauseId` (EC-10 unverändert).

**Gate (alles grün):** `tsc --noEmit` = 0 · Engine-Suite **27/27** (Set-Szenarien EK/FK/EK+FK + Doppelrolle D1–D7 + Migrations-Tests) · **EC-09-ZIP** browser-verifiziert auf :3001 (Neuanlage EK+FK → DB persistiert `roleClasses=["ek","fk"]`, legacy-Felder leer; Read-Migration: Bestandspersonen + Inline-Edit zeigen Set korrekt; ZIP-Export `POST 200`, ~1 s render, kein Fehler). Test-Person nach Verifikation wieder entfernt. EC-10-UI-Texte („kein Freigabestatus") unverändert.

**Commit:** `e1899dd` (12 Dateien, enge Pathspecs — nur Code, keine `.env`/`.db`/`hq`-Dateien des Parallel-Agents). Rebase auf `origin/main` (autostash), gepusht.

**Offen:** weiter mit Queue-Punkt 2 (G4-Phase-2-Delta) + 3 (Regression grüne UE-Soll/Ist-Übersicht). **Beobachtung zur Regression:** Bei der EK/FK-Akzeptanz war die grüne **Schulungs-Soll-Ansicht (Jahres-Weiterbildung, UE Soll/Ist/Rest, CL-11) sichtbar** für eine Bewachungsrolle — sie ist also nicht generell „weg". Genaue Ursache (welcher Fall verdeckt?) wird in Punkt 3 geprüft.

### 2026-06-08 — ⏹️ END-OF-RUN-SUMMARY (Executor autonomer Lauf, §7 Run-Order)

**Lauf-Bilanz:** 3 Slices gebaut/verifiziert/committet, 2 Punkte sauber geparkt. Alle Commits = nur Code + Bridge-Doku, explizite Pathspecs, **keine** `.env`/`.db`/Kundendaten (jeweils via `git show --name-only` geprüft). Nicht gepusht (Mark pusht/deployt selbst).

**Commits (chronologisch):**
| Hash | Was | Gate |
|---|---|---|
| `047878c` | **G4 Phase 1** — `roleClass`-Norm-Klasse-Modell (ek/fk/verwaltung/praktikant/sub) als primärer Engine-Input; Org-Titel (`roleType`) = Anzeige; idempotente Read-Migration; Engine-Refactor; schlankes Anlege-Formular; 11 Code-Dateien. | tsc 0 · Engine 24/24 · EC-09-ZIP 200 · Migration live (blubermann→verwaltung, Neuanlage FK persistiert) |
| `dcbd0d5` | **Bridge** — HANDOFF-Abschluss + Executor-Selbst-Review G4 P1 in `CODE_REVIEW.md`. | docs |
| `2261d26` | **Slice 4** — rechnerischer Pflicht-Status (Ampel) im Dossier: aggregiert Engine-Stati (pflichtSet+fristen) → offen/in-arbeit/rechnerisch-vollständig + Severitäts-Zähler + nächste/überfällige Frist; reine `compliance-status.ts` + 10 Tests; EC-10-Disclaimer. 4 Dateien. | tsc 0 · Slice-4-Suite 10/10 · Engine 24/24 · EC-09-ZIP 200 (Generator unberührt) |

**Pro Queue-Punkt:**
1. **G4 Phase 1 — ✅ fertig** (`047878c`). Browser-verifiziert (FK-Neuanlage + Verwaltung-Migration + Dossier-Recompute); restliche Klassen/Doppelrolle durch 24-Test-Suite gedeckt.
2. **G4-Phase-1-Selbst-Review — ✅ fertig** (`CODE_REVIEW.md`, `dcbd0d5`). **Empfehlung: unabhängiger Planer-Review** (Engine-Refactor + Migration) — bisher nur Executor-Selbst-Review.
3. **G4 Phase 2 — ⏸️ GEPARKT** (`CURSOR_G4_PHASE2_AUFTRAG.md`). **Befund:** Doc-Auswahl liegt durch die `displayMode="documents"`-Architektur **bereits im Generator-Tab** (nicht mehr im Anlege-Schritt) → Phase-2-Ziel (Gate b) scheint erfüllt. **Präzise Frage an Mark/Planer:** welches konkrete Rest-Delta soll Phase 2 liefern (Batch-Export-Doc-Auswahl? globaler Generator? UX-Feinheit?)? Nicht ins EC-09-kritische Generator gebaut ohne klares, reviewtes Ziel.
4. **Slice 4 (Ampel/Status) — ✅ fertig** (`2261d26`). EC-10 hart eingehalten (nie „freigegeben/auditfähig").
5. **Resttechnik — ⏸️ GEPARKT.** **(a) Ist-UE-Auto-Summe:** braucht ein **neues strukturiertes Nachweis-mit-UE-Datenmodell** (Nachweise sind heute nur Datei-Uploads ohne UE-Wert; Ist-UE wird manuell erfasst) → eigener norm-sensibler Slice, kein kleiner Refactor. **(b) DB-Doppelpfad** (`prisma/prisma/dev.db` vs `prisma/dev.db`): riskanter Infra-/Config-Refactor (`DATABASE_URL`), EC-09-Risiko → **Mark-Gate** empfohlen, nicht unbeaufsichtigt.

**Offene Fragen für Mark (gebündelt):**
- **F1 (Phase 2):** Konkretes Rest-Delta bestätigen — siehe `CURSOR_G4_PHASE2_AUFTRAG.md` §3 (A/B/C/D).
- **F2 (Review):** Unabhängigen Planer-Review von `047878c` (+ `2261d26`) vor weiterer Bautätigkeit?
- **F3 (Resttechnik):** Ist-UE-Auto-Summe = eigenen Slice mit Nachweis-UE-Datenmodell aufsetzen? DB-Doppelpfad-Vereinheitlichung freigeben (eigenes Fenster, EC-09-Smoke davor/danach)?

**Nächster empfohlener Schritt:** (1) Planer-Review G4 P1 + Slice 4 → (2) Phase-2-Delta entscheiden (F1) → (3) ggf. Nachweis-UE-Datenmodell-Slice. Dev-DB-Hinweis: Test-Akte „G4 Testperson" wurde entfernt; blubermann trägt jetzt persistiert `roleClass=verwaltung` (legitime Migration).

**Tech-Stand:** HEAD = `2261d26`. Untracked Bridge-Doku noch zu committen: `CURSOR_G4_PHASE2_AUFTRAG.md` (mit diesem Bridge-Commit). Fremd-gestaged/untracked (NICHT von mir): `hq/03_Kundenprojekte/**` (Kundendaten), `hq/10_Bridge/AUTONOMER_BAU_AUSBLICK.md` (Generalist).

---

### 2026-06-08 — ✅ Executor: G4 Phase 1 FERTIG + COMMITTET `047878c` + Selbst-Review (autonomer Lauf, „Run Everything")

**Erledigt (Queue 1 + 2):** roleClass-Norm-Klasse-Modell + idempotente Read-Migration + Engine-Refactor + schlankes Anlege-Formular + Tests. **Commit `047878c`** (11 Code-Dateien, explizite Pathspecs — `.db`/`.env`/`hq/03_Kundenprojekte/**` ausgeschlossen, via `git show --name-only` verifiziert). **Selbst-Review:** `CODE_REVIEW.md` (oberster Eintrag).

**Verifikations-Gate — alle grün:**
- `tsc --noEmit` = **0**.
- Engine-Suite `tsx --test` = **24/24** (20 alt umgestellt + Org-Titel→Klasse-Mapping + Einsatzleitung=FK (4c) + Subunternehmer (7) + Praktikant (8) + „keine Norm-Klasse" (9)).
- **EC-09 echter Browser :3001:** ZIP `POST /employee-automation` **200** (mehrfach, kein 5xx, 490 ms reale Generierung mit aktiver Migration). Neuanlage über neues Formular (FK + Vorlage) → DB `roleClass=fk`. Read-Migration live: blubermann (`Bürokraft / Verwaltung`) → DB `roleClass=verwaltung` persistiert. Dossier-Edit-Tabelle zeigt Norm-Klasse + recomputed.
- Test-Akte „G4 Testperson" nach Verifikation aus Dev-DB entfernt (Hygiene; DB ist gitignored).

**Selbst-Review-Befund:** norm-konform, jede Regel CL-belegt, **keine neue CL/UE**, EC-09/EC-10 gewahrt. Minor (kein Blocker): (1) Live-Browser-Matrix nur teilweise gefahren (FK-Neuanlage + Verwaltung-Migration) — restliche Klassen/Doppelrolle deterministisch durch die 24-Test-Suite abgedeckt; (2) Legacy-Akten ganz ohne Rolle behalten „Keine Norm-Klasse" (korrekt). `EmployeeFileAkteInlineEdit.tsx` ist Alt-Form (nur DossierView nutzt die Tabelle) → nur lauffähig gehalten.

**❓ FRAGE an Planer (Rollenkontrakt):** Dies ist ein **Executor-Selbst-Review** unter Marks autonomer Vollmacht, kein unabhängiger Planer-Review. **Empfehlung:** Planer reviewt `047878c` unabhängig (Engine-Refactor + Migration besonders) bevor Phase 2 abgenommen wird.

**Prisma-Hinweis:** `prisma generate` + `db push` gelaufen (`DATABASE_URL=file:./prisma/dev.db` → Runtime-DB `prisma/prisma/dev.db` hat `roleClass`-Spalte). Schema-Migration committet; DB selbst nicht (gitignored).

**▶ NÄCHSTER SCHRITT (laufender Lauf):** Queue 3 = **G4 Phase 2** (Doc-Auswahl Core/Overlay-Chips → Generator-Tab, `displayMode="documents"` wiederverwenden, EC-09 = Hauptrisiko) → Queue 4 Slice 4 (Ampel/Status, **EC-10 hart: nur rechnerischer Status, kein Freigabestatus**) → Queue 5 Resttechnik. End-of-Run-Summary folgt am Ende.

---

### 2026-06-07 — ❓ Executor relais an Planer 7: Mark-Richtungsentscheid „Tally entkoppeln, In-App-Erfassung priorisieren, Rollenliste revidieren"

**Kontext:** Mark wurde live demonstriert (Browser :3001), dass Slice 3 funktioniert (Doppelrolle-Select recomputed das Pflicht-Set inkl. CL-01/03/04/05 live). Dabei Mark-Feedback (mündlich, hier protokolliert — vom Executor NICHT eigenmächtig eingeplant, gehört Spur P + Mark-Gate):

**Mark-Aussage (sinngemäß, bitte mit Mark gegenprüfen):**
1. **Tally als Erfassungsweg ist zu aufwändig / nicht praktikabel.** Mark will Daten **nicht** zwingend übers Tally-Formular eingeben müssen.
2. **Die Rollenliste/Taxonomie muss ohnehin überarbeitet werden.**
3. **„Ohne Tally-Anbindung" lösen** — Erfassung direkt in der App, von Tally entkoppelt.

**Auswirkung auf die Planung (Einordnung, KEINE Executor-Entscheidung):**
- **Slice 3b (Tally-Formular-Feldlücke, Option C Hybrid)** war genau der Weg „Felder im Tally-Formular `vGNvY0` anlegen" — den Mark jetzt als zu aufwändig ablehnt. → Slice 3b vermutlich **zurückstellen/neu denken**, nicht als nächstes bauen.
- **G4 (Anlege-Formular auf Requirement-Modell migrieren)** rückt damit nach vorn = der In-App-Erfassungsweg ohne Tally-Abhängigkeit. Mark hatte G4 bereits „ja, eigener Slice".
- **Rollenliste-Revision** als zusätzlicher Scope-Punkt (Taxonomie `ROLLE_TYPE_OPTIONS`/`GRUNDROLLE_CATALOG`) — Norm-Mapping/clauseId beachten, keine erfundene Pflicht.

**Mark hat in dieser Session zusätzlich „dann mach das" zur nächsten sichtbaren Arbeit gesagt** (Auswahl stand zwischen Slice 4 Ampel-/Status-Ansicht und G4). Mit obigem Tally-Feedback tendiert die Richtung zu **G4 (In-App-Erfassung) + Rollenliste**. → **Planer 7 bitte: Reihenfolge G4 / Slice 4 / (3b zurückgestellt) mit Mark final klären und G4-Slice + Rollenliste-Revision als Bauauftrag planen** (Architektur/Scope/clauseId). Executor wartet auf Bauauftrag, baut nicht ungeplant.

---

### 2026-06-07 — ✅ Executor: Hydration-Fix Firmenname gebaut + committet (`01f720b`)

**Fertig (exakt nach Planer-6-Bugfix-Auftrag „Von Claude an Cursor", kein Scope-Zusatz, 2 Dateien):**
- `lib/company-session.ts`: `DEFAULT_COMPANY_SLUG` exportiert.
- `EmployeeAutomationPage.tsx`: Initializer `useState(getActiveCompanySlug)` → `useState(DEFAULT_COMPANY_SLUG)` (SSR == erster Client-Render). Der Bootstrap-`useEffect` liest nach Mount `getActiveCompanySlug()` (localStorage) und setzt `setCompanySlug(slug)` → kein erster-Render-Divergenz, Switcher-Persistenz erhalten (zeitversetzt nach Mount).

**Verifiziert (echter Browser, nicht Skript):** `tsc --noEmit` 0 · **Hydration-Warnung weg** nach Firmenwechsel (Wolf Street) + Reload — **Index UND `?new=1`** (Next-Dev-Overlay kein Issue mehr) · **EC-09 unberührt** (Person → Akte → Doc-Chips → ZIP `POST /employee-automation` 200, kein 5xx) · **Switcher** zeigt nach Reload weiterhin Wolf Street. **EC-10** unberührt.
**Commit-Hash:** `01f720b` (2 Code-Dateien; DB/.env nicht committet, DSGVO). Bridge-Doku separat.
**Hinweis (kein Eingriff):** Render-Stelle ist faktisch `EmployeeFileIndex.tsx:273` (Auftrag nannte :271 — minimal verschoben, identische Codestelle).

---

### 2026-06-07 — ❓ Executor-FRAGE an Planer: Anlege-Formular auf neues Requirement-Modell migrieren? (+ kleiner URL-Fix `17f94cc` erledigt)

**Mark-Beobachtung (Browser):** Beim Klick auf „Neue Person" erscheint zuerst das **alte Tool-1-Eingabeformular** (`EmployeeForm.tsx`, `displayMode="master"`, englische Labels „Full Name/Role Type/Training Hours/Guard ID", Modell `roleId`/`appointmentIds`/Freitext-`roleType`). Die **neuen Requirement-Felder** (Grundrolle-Dropdown, Doppelrolle, SDL/Geltungsbereich, Beschäftigungsart, Fristen, UE) existieren erst **danach** in der Akte/Dossier (`EmployeeFilePersonRolleEditTable.tsx` + Engine). Deckt sich mit Planer-4-UX-Notiz („Anlege-Maske schlank … Slice-2-Felder erst in der Akte, by design").

**Was ich (Executor) bereits gefixt habe — klein, contained, kein Scope-Zusatz (Commit `17f94cc`):** Der „Neue Person"-Button leerte die URL; der `?new=1`-Deep-Link wurde aber beim Laden bereits ausgewertet. Jetzt setzt `handleCreateNew` `?new=1` → Anlege-Ansicht ist teilbar/bookmarkbar. `tsc` 0, im Browser verifiziert (`window.location.href` = `…?new=1`; Deep-Link öffnet Anlege-Form). Reine URL-Spiegelung, **keine** Engine-/Architekturänderung.

**FRAGE / Scope-Entscheidung (gehört dem Planer + Mark-Gate, C-10 — ich plane das NICHT selbst):** Soll das Anlege-Formular auf das neue Requirement-Modell vereinheitlicht werden (statt Legacy-Tool-1-Form)? Das wäre eine **Architektur-/Scope-Änderung** und ein **eigener Slice**, nicht in Slice 3 enthalten. Grobe Berührungspunkte (read-only beobachtet, ohne Vorentscheidung):
- `EmployeeForm.tsx` (master mode) + `lib/validations/employee-form.ts` (Zod-Schema) tragen das Altmodell (`roleId`/Dokument-Template-Auswahl für den Generator, Freitext-`roleType`, `trainingHours`).
- Die Akte-Erfassung (`EmployeeFilePersonRolleEditTable.tsx`) trägt das Neumodell (`roleType` als Enum, `zusatzBewachungNiveau`, `sdlScopes`, `beschaeftigungsart`, Fristen …).
- Offene Planer-Fragen: bleibt die Doc-Template-Auswahl (Core/Overlay) im Anlege-Schritt oder wandert sie ganz in den Generator? Soll „Neue Person" direkt die Akte-Edit-Fläche für eine leere Person zeigen? Verhältnis zur Tally-Feldlücke (Slice 3b)?

→ Bitte als eigenen Slice einplanen/entscheiden (Mark-Gate). Ich habe **nichts** am Anlege-Formular/Modell geändert außer dem URL-Fix oben.

---

### 2026-06-07 — ✅ Executor: Slice 3 Doppelrollen (Niveau EK/FK) gebaut + committet (`a276d38`)

**Fertig (exakt nach `CURSOR_SLICE3_AUFTRAG.md`, kein Scope-Zusatz):**
- **Datenmodell:** `EmployeeFile.zusatzBewachungNiveau String?` (Prisma, `db:push`+`generate`, nur `prisma/prisma/dev.db`) · `Employee.zusatzBewachungNiveau?: "ek"|"fk"` · Repository alle 5 Mapping-Stellen + Read-Normalisierung (`asNiveau`).
- **Engine (4.1–4.5):** effektive `bewachung`/`fuehrung` (Doppelrolle hebt F3-Gate, „fk" treibt FK-Zweig) · CL-10 (`q-fk-quali`) jetzt DIN-SDL-gegatet (`hasDinSdl`) · Verwaltungs-/Praktikanten-Reduktion bei Doppelrolle unterdrückt · `bewTrigger`-Transparenztext + Doppelrollen-Hinweis. Keine neue CL/UE.
- **Presenter:** `buildRequirementContext` reicht Feld durch · `isSecurityRole` doppelrollen-aware.
- **UI:** Select „Zusätzliche Bewachungstätigkeit (Doppelrolle)" unter der Rolle-Zeile (`ZUSATZ_BEWACHUNG_OPTIONS`); inkl. Leer-Option „— keine zusätzliche Bewachung" (nötig, damit Headless-`Select` zurücksetzbar ist — die DoD-Forderung „Checkbox aus → Reduktion").
- **Tests:** Engine-Suite **20/20** (13 alt grün + 7 neu D1–D7, inkl. CL-10-Gate D7).

**Verifiziert:** `tsc --noEmit` 0 · `tsx --test` 20/20 · **EC-09-Smoke** im echten Browser (Person→Akte→Doc-Chips→ZIP `POST /employee-automation` 200, kein 5xx) · **Doppelrolle-Akzeptanz** live (Testperson GF+EK → volles Bewachungs-Set mit „Doppelrolle (Geschäftsführung + Bewachung, EK-Niveau)"-Trigger + UE-Soll + Hinweis; auf „keine" → zurück auf Verwaltungs-Reduktion; **Persistenz über Reload** bestätigt). **EC-10** gewahrt.

**Offen / Frage an Planer:** (1) Slice-3-Review (Diff `a276d38`) gegen Norm-Matrix v2 + Klausel-Register. (2) FK-Niveau wurde im Browser nicht separat durchgeklickt — durch Unit-Tests D4/D7 abgedeckt; bei Bedarf live nachstellen. (3) Slice 3b (Tally-Feldlücke) bleibt gated auf Marks Tally-Arbeit.
**Commit-Hash:** `a276d38` (8 Dateien). DB/.env nicht committet (DSGVO).

---

### 2026-06-07 — ✅ Executor: Hetzner Pre-Deploy-Gates alle grün (kein Code-Commit nötig)

**Bauauftrag `CURSOR_HETZNER_PREDEPLOY_AUFTRAG.md` abgearbeitet — alle 4 Gates grün:**
1. **`npm run build` = 0 Errors.** `prisma generate` + `next build` (Next 16.1.1/Turbopack) sauber durch, TypeScript ok. ESLint zusätzlich separat (`npm run lint`): **0 Errors / 5 Warnings** (react-hooks/incompatible-library `watch()` ×2, exhaustive-deps ×1, unused `_appointments` ×1 — alle nicht blockierend). Keine Lint-Fixes nötig → **kein `ignoreDuringBuilds`**, kein Code-Commit.
2. **EC-09-Smoke gegen Prod-Build (`npm run start -- -p 3001`) im echten Browser grün.** Person → Akte → Doc-Chips (Generator-Palette Core 4/4 + Overlay) → ZIP exportieren. Server-Action **200**, RSC-Body beginnt mit `UEsDBA…` (= `PK\x03\x04` ZIP-Magic), Client erzeugt **`application/zip`-Blob 132,8 KB** + Download-`a.click()`. **EC-10-Disclaimer** „…kein automatischer Freigabe- oder Zertifizierungsstatus" sichtbar. *(Hinweis: die zwei Test-Datensätze „Felix Balthasar Hochreither" haben keine Rolle → Engine liefert korrekt `{success:false, error:"Role \"\" not found…"}`. Reines Test-Daten-Artefakt, kein Build-/Code-Problem. Export mit valider Person „joe" = grün.)*
3. **`.env.example` vollständig.** Alle zur Laufzeit gelesenen `process.env.*` abgedeckt: `HETZNER_S3_KEY/SECRET`, `HETZNER_BUCKET_NAME`, `HETZNER_S3_ENDPOINT/REGION` (S3×5), `INTERNAL_API_KEY`, `TALLY_WEBHOOK_SECRET`, `TALLY_API_KEY`, `DATABASE_URL`, optional `CEA_REGISTRY_PATH` (auskommentiert). `NODE_ENV` per systemd. **Keine fehlende Variable → keine Ergänzung nötig.**
4. **`db:push`-Trockencheck grün.** `DATABASE_URL=file:./prisma/dev.db npm run db:push` → „database is already in sync", adressiert `dev.db at file:./prisma/dev.db` = real `prisma/prisma/dev.db`. **Kein zweites `prisma/dev.db` angelegt** (vorher/nachher nur das eine File, Größe/Timestamp unverändert).

**Verifikation:** real im Browser (CDP-Netz-/Blob-Hooks zur Beweissicherung des ZIP-Streams), nicht per Skript-Fake.
**Offen:** Mark deployt (DNS/`.env.production.local`/systemd/nginx/certbot/Webhook-PATCH/Backup-Cron) — Runbook `HETZNER_DEPLOY.md` + Bauauftrag „DANACH". Dann Planer 4 reviewt Pre-Deploy-Ergebnis.
**Commit-Hash:** keiner — **kein Produktivcode geändert** (alle Gates ohne Fix grün); Basis bleibt `0d92ff2`. Diese HANDOFF-Notiz = Bridge-Doku.

---

### 2026-06-07 — ✅ Builder 2: UE-Anzeige + Findings F1–F5 committet (`0d92ff2`)

**Fertig (Commit `0d92ff2`, Basis `22e0c7c` — kombiniert UE-Anzeige + Findings, kein separater UE-Commit):**
- **F1** q-34a bei reiner Unterrichtung (ohne Sachkunde) → `unvollständig`. **F2** Pflicht-Set-Dedup nach `clauseId` (Presenter-only, Engine unverändert; CL-08/CL-23; Trigger gemerged, strengerer Status; null-CL nie dedupt). **F3** SDL-Schulungssoll nur bei Bewachung (Brandschutz-Pflichtnachweis ungated; Doppelrollen-Modellgrenze als Kommentar). **F4** nur `Führungskraft`=FK (24 UE + CL-10); EL/OL/SL=EK (16 UE), bleiben Bewachung (Basis-Set). **F5** Asyl-Basis-Label rollen-neutral.
- **F4-Naming-Check (erledigt, kein Bug):** gespeicherte `roleType`-Werte kommen aus `ROLLE_TYPE_OPTIONS` (`Sicherheitsmitarbeiter`, `Praktikant / Azubi`, …) und matchen **exakt** die Engine-Sets. `GRUNDROLLE_CATALOG` (`SMA / Sicherheitsmitarbeiter`) ist nur Anzeige-Chip-Liste → **kein** Write-Path-Bug. *(Hinweis: Tally-Intake schreibt rohen Dropdown-Text — separater Alt-Thread, nicht in diesem Scope.)*
- **Verifiziert:** `tsc --noEmit` = 0 · Engine-Suite **13/13** grün · Presenter-Integration `getEmployeeFileSummary` Szenarien a–d grün (inkl. F2-Dedup mit gemergtem Trigger) · Browser: **EC-09-ZIP-Export 200/kein Fehler**, Akte rendert, **F4 live** (Schichtleitung → 16 UE EK, kein FK-Quali); Testperson „joe" danach auf SMA/ohne-SDL zurückgesetzt.

**Offen:** Planer 3 — Final-Abnahme (kombinierter Diff gegen `22e0c7c`) gegen Norm-Matrix v2 + Klausel-Register.
**Commit-Hash:** `0d92ff2`.

---

### 2026-06-07 — Stabiler Punkt → Übergabe Builder 2 (F1–F5)

**Fertig:** UE-Anzeige (Variante C) + P2023-Fix im Working Tree; Planer-2-Pre-Commit (`CODE_REVIEW.md`, `tsc`/Lints 0). Auftrag `CURSOR_FINDINGS_1_2_AUFTRAG.md` F1–F5 freigegeben (F3/F4 Mark entschieden).
**Offen:** UE Commit + Browser final + EC-09 · Builder 2 implementiert F1–F5.
**Commit-Hash:** UE-Code **uncommitted** (Basis `9cad207`); HANDOFF-Update committed.

---

### 2026-06-07 — ▶ Builder 1: UE-Anzeige (Punkt 3) gebaut + P2023-DB-Crash gefixt — UNCOMMITTED, Verify offen

**Was Builder 1 gemacht hat (auf Freigabe Variante C + §E.1):**

**A) UE-Anzeige verdrahtet (Punkt 3 / Layout Variante C):**
- **Neu:** `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeFileTrainingTargets.tsx` — zwei Blöcke **LAUFEND** (jährlich, mit Ist/Soll-Fortschrittsbalken) / **EINMALIG** (ohne Balken). Pro Posten: **Soll** (aus Engine, CL-belegt) / **Ist** (manuell erfasst, Zahl-Input, Label „UE · manuell erfasst") / **Rest** + Status-Pill (`offen` · `unvollständig` · `rechnerisch erreicht` · `fachlich prüfen`). Karten-Header dauerhaft **„rechnerisch · kein Freigabestatus"** (EC-10). **Keine** „erfüllt/auditfähig/einsatzbereit"-Aussage.
- **Neue Felder** für Ist-Erfassung: `Employee.weiterbildungIstUE?: number` + `Employee.einmaligIstUE?: Record<string,number>` (Posten-ID→UE). Prisma `EmployeeFile.weiterbildungIstUE Int?` + `einmaligIstUE Json?` (NICHT `@default("{}")` — SQLite lehnt `{` ab; Repository liefert `{}`). Repository-Mapping in allen Upsert-Pfaden ergänzt (`asNumberRecord`-Helper). `db push` + `prisma generate` gelaufen.
- **Geändert:** `EmployeeFileDossierView.tsx` — „Schulungs-Soll (Vorschau)" ersetzt durch `<EmployeeFileTrainingTargets … onSave={onSavePerson} />`.
- Ist = **rein manuell** (kein Auto-Summe aus Nachweisen — bewusst Slice 3/4).

**B) 🐛 Crash gefixt — Akten-Liste lud nicht (Prisma P2023):**
- **Symptom:** `prisma.employeeFile.findMany()` warf **P2023 „Inconsistent column data"**; Liste/Akte crashte (500 auf POST /employee-automation).
- **Ursache:** Beim Tabellen-Rebuild durch `db push` (RedefineTables, generiert `DEFAULT []`/`{}` **ohne Quotes**) bekamen bestehende Zeilen in der non-null Json-Spalte **`sdlScopes` einen leeren String `''`** statt gültigem JSON → Prisma kann ihn nicht deserialisieren. (KEIN „no such column" — alle Spalten existierten; KEIN DB-Doppelpfad-Problem: es gibt nur **eine** DB `prisma/prisma/dev.db`, `file:./prisma/dev.db` löst relativ zum Schema-Ordner dorthin auf.)
- **Fix:** `sqlite3 prisma/prisma/dev.db` — alle Json-Spalten normalisiert: `UPDATE … SET sdlScopes='[]' WHERE … json_valid(sdlScopes)=0` (analog appointmentIds/selectedRoleDocIds/selectedAppointmentDocIds/einmaligIstUE). Danach `findMany` grün.
- **Lehre für Build:** Neue non-null Json-Spalte → Prisma-`@default` ist in SQLite unzuverlässig; Repository schreibt ohnehin immer valide Werte (`?? []`/`?? {}`). Bei künftigem Schema-Rebuild bestehende Json-Zeilen prüfen/normalisieren.

**Verifiziert:** `tsc --noEmit` 0 Fehler (vor UE-Increment; nach Increment letzter Lauf vom User unterbrochen — **Planer 2 hat den Working Tree statisch geprüft: `tsc` 0, Lints 0**) · ESLint geänderte Dateien 0 Errors · **Browser TEIL A:** Liste lädt, **joe sichtbar, kein 500/P2023 mehr** ✅ · **Browser TEIL B:** Schulungs-Soll-Block rendert korrekt (EC-10-Header, CL-11, Soll 40 UE, Balken) ✅.

**OFFEN / Builder (vor Übergabe an Builder 2):**
1. **`tsc --noEmit` final selbst bestätigen** + **EC-09-Smoke** (Generator → ZIP) erneut grün.
2. **Ist-UE-Interaktivität manuell im Browser bestätigen:** Automations-Test konnte das Zahl-Input nicht zuverlässig triggern (React-controlled-input-Artefakt — programmatisches `input.value` feuert `onChange` nicht). Code-Pfad korrekt (Input → `onChange` → `setIst` → `onSavePerson`/`handleSavePerson` → `setEmployees` → `getEmployeeFileSummary` rechnet Rest=Soll−Ist neu). **Echter manueller Tipp-Test** ausstehend: 20 → „unvollständig"/Rest 20/Balken 50 %; 40 → „rechnerisch erreicht"/Rest 0.
3. **Persistenz** Ist-UE nach Reload prüfen (debounced `saveEmployeeQueue` 400ms + Server).
4. **Commit** (alles uncommitted) nach Marks OK → danach Übergabe an Builder 2 für `CURSOR_FINDINGS_1_2_AUFTRAG.md`.

**Uncommitted (Working Tree):** `M` `lib/employee-file-repository.ts`, `EmployeeFileDossierView.tsx`, `types/employee.ts`, `prisma/schema.prisma` · `??` `EmployeeFileTrainingTargets.tsx`. (`hq/01_Master_Dump/`, `hq/02_Operations_Board/`, `AUFGABEN.md` = Generalist/Planer, NICHT Code-Track committen.)

**Dev-Server:** läuft auf :3001 (Hintergrund, **außerhalb Sandbox** starten — sonst `uv_interface_addresses`-Fehler). Genau EINEN: `lsof -ti:3001 | xargs kill -9` vor Neustart. *(Planer 2 hat am 2026-06-07 doppelte Dev-Server/Zombie-tsx-Prozesse aufgeräumt — nur noch ein `next dev` auf 3001.)*

---

## 🔗 Aktuelle OS-Pfade (Single Source — Code-Track pflegt!)

**Regel:** Wer eine Route/einen Modulordner **umbenennt**, trägt es hier sofort ein. Generalist passt dann Dashboard-Launcher (`hq/00_Dashboard/html/index.html`) + Docs nach. So driftet nichts.

| Zweck | Route (Stand 2026-06-07) | geplant |
|-------|--------------------------|---------|
| Tool 1 — Document Creator | `localhost:3001/model-creator` | → ggf. Tab in `/intern` |
| Tool 2 — Mitarbeiterakte | `localhost:3001/employee-automation` | → ggf. Tab in `/intern` |
| Upload Manager | `localhost:3001/uploads` | → ggf. Tab in `/intern` |
| **Interne Zentrale (geplant Slice A)** | — | **`localhost:3001/intern`** |

**Module (canonical):** `00-dashboard · 01-unternehmensakte · 02-projektakte · 03-mitarbeiterakte-tool-2 · 04-qm-auditordner · 05-schulungen-unterweisungen`.

→ Sobald `/intern` live ist: Dashboard-Launcher auf **`localhost:3001/`** (Hub) umstellen = rename-sicher.

---

## 📤 Von Claude an Cursor (Reviews / Hinweise / Aufgaben)

### 2026-06-08 — 🚦 PARALLEL-DISPATCH (Planer): File-Ownership-Grenzen + BOTS READY

**Zweck:** Zwei Executor-Bots parallel, **garantiert kollisionsfrei**, weil ihre Schreib-Mengen **disjunkt** sind. Jeder Bot schreibt **nur** die Dateien seiner Zeile, sonst **nichts**. Baseline-Commit = **`e7ed92e`** (Watcher-Anker; weckt bei neuem main-Commit oder CODE_REVIEW/HANDOFF-Änderung).

#### Dispatch-Tabelle (verbindlich — „touch nothing else")

| Lane | Bot | Bauauftrag(e) | DARF schreiben (nur diese) | NUR LESEN / nie schreiben |
|------|-----|---------------|----------------------------|---------------------------|
| **A — Engine (ÖPV)** | Bot A | `CURSOR_OEPV_ENGINE_AUFTRAG.md` | `…/employee-file/requirement-engine.ts` · `…/employee-file/requirement-engine.test.ts` | alles andere |
| **B — Audit-Export** | Bot B (1 Bot, **sequenziell**: Pt 1 → Pt 2) | `CURSOR_AUDIT_EXPORT_AUFTRAG.md` **dann** `CURSOR_AUDIT_EXPORT_PT2_AUFTRAG.md` | `…/employee-file/EmployeeAutomationPage.tsx` (Export-Toggle + `handleAuditExport` + Download; **ZIP-`handleGenerate` nicht umschreiben**) · `…/employee-file/EmployeeFileOverview.tsx` (CopyButton) · **NEU** `…/employee-file/CopyButton.tsx` · **NEU** `app/actions/generate-audit-export.ts` · **NEU** `…/employee-file/audit-export-xlsx.ts` · **NEU** `…/employee-file/audit-export-pdf.ts` · **NEU** `…/employee-file/audit-export-*.test.ts` · `package.json` + `package-lock.json` (Pt 2: `exceljs`, `pdf-lib`) · optional NEU Print-Route/-Hülle | `requirement-engine.ts` · `employee-file-requirements.ts` (`getEmployeeFileSummary` = Single Source) · `generate-employee-docs.ts` (ZIP-Generator) · `EmployeeForm.tsx` |

**Disjunktheit belegt (am HEAD geprüft):** A-Schreibmenge `{requirement-engine.ts, requirement-engine.test.ts}` ∩ B-Schreibmenge `{EmployeeAutomationPage.tsx, EmployeeFileOverview.tsx, CopyButton.tsx, generate-audit-export.ts, audit-export-*.ts, package.json, package-lock.json}` = **∅**. B liest `requirement-engine.ts` nur transitiv (über `getEmployeeFileSummary`), schreibt sie nie → bei Rebase beider auf `main` **kein Datei-Merge-Konflikt**.
**Pt-1↔Pt-2 = derselbe Export-View → EIN Bot, sequenziell** (NICHT zwei parallele B-Bots — das ist die einzige Stelle, wo B mit sich selbst kollidieren würde).

#### Koordinations-Modell (Ordner/Branches — Planer-Entscheid 2026-06-08)
**Cursor-Background-Agents isolieren sich selbst** (eigener Checkout + eigener `cursor/*`-Branch je Bot) → **keine geteilten Working Trees, keine manuellen Worktrees nötig.**
- **Planer** bleibt im Main-Checkout auf `main`.
- **Jeder Bot** branched ab **`main@c5eb583`** (= aktuelles `main == origin/main`; der ältere Wert `5263a04` ist überholt — `c5eb583` ist nur ein Bridge-Doku-Commit drüber, kein Produktivcode, und trägt diese Dispatch-Tabelle live), baut auf seinem `cursor/*`-Branch, committet, pusht **seinen Branch** (NICHT direkt auf `main`).
- **Merge-Gate = Planer:** Planer pullt den Branch, reviewt den Diff gegen diese Dispatch-Tabelle (disjunkt eingehalten? EC-09/EC-10? CL-belegt?), **mergt dann nach `main`**. Disjunkte Write-Sets → Lane A + Lane B mergen **konfliktfrei** in beliebiger Reihenfolge.
- **Laufzeit-Dateien:** `.env.local` + Dev-DB sind gitignored (nicht im Branch). Build/Test: `DATABASE_URL=file:./prisma/dev.db` (CLAUDE.md; DB-Doppelpfad `prisma/dev.db` + `prisma/prisma/dev.db` = bekanntes Tech-Debt, kanonisch `prisma/dev.db`).

#### ▶ BOTS READY
1. **Lane A** → `CURSOR_OEPV_ENGINE_AUFTRAG.md` → schreibt **nur** `requirement-engine.ts` + `requirement-engine.test.ts`.
2. **Lane B** → `CURSOR_AUDIT_EXPORT_AUFTRAG.md` → dann `…PT2_AUFTRAG.md` (1 Bot, sequenziell) → `EmployeeAutomationPage.tsx` + `EmployeeFileOverview.tsx` + neue `audit-export-*`/`CopyButton`/Action + `package.json`.
3. **Gates intakt:** C-10 (Mark) · EC-09 (ZIP 200) · EC-10 (kein Freigabe-Wording) · jede Norm-Regel `clauseId` · keine Personendaten/`.env`/`.db` auf Git. Watcher-Baseline `e7ed92e`, disjunkte Write-Sets ✓.

#### ⚠️ BEGRIFFS-KLÄRUNG „ZWEI BOTS" (Planer 8, 2026-06-08) — verbindlich für den Dispatch-Agent

**„Zwei Bots" = zwei Lanes (A + B), NICHT zwei Bots pro Lane.** Wer den Dispatch-Prompt ausführt, startet **genau zwei** Cursor-Background-Agents:

| Bot | = Lane | Bauauftrag (in dieser Reihenfolge) | Branch ab `main@c5eb583` | schreibt NUR (Dispatch-Tabelle) |
|-----|--------|-----------------------------------|--------------------------|---------------------------------|
| **Bot A** | A — ÖPV-Engine | `CURSOR_OEPV_ENGINE_AUFTRAG.md` | eigener `cursor/*` | `requirement-engine.ts` + `requirement-engine.test.ts` |
| **Bot B** | B — Audit-Export | `CURSOR_AUDIT_EXPORT_AUFTRAG.md` **DANN** `CURSOR_AUDIT_EXPORT_PT2_AUFTRAG.md` | eigener `cursor/*` | `EmployeeAutomationPage.tsx` · `EmployeeFileOverview.tsx` · NEU `CopyButton`/`generate-audit-export`/`audit-export-{xlsx,pdf}` (+Tests) · `package.json/-lock` |

- **Bot B ist EIN Bot, sequenziell** (Pt 1 committen → dann Pt 2). **NICHT** in zwei parallele B-Bots aufsplitten — Pt 1 und Pt 2 bearbeiten denselben Export-View und würden mit sich selbst kollidieren (s. Disjunktheits-Notiz oben).
- **Also: A = 1 Bot, B = 1 Bot → 2 Bots total.** Nicht 3, nicht 4.
- **Branch-Basis = `c5eb583`** (aktuelles `main`), nicht `5263a04`.
- Jeder Bot pusht **seinen** `cursor/*`-Branch (nie direkt `main`). **Planer = Merge-Gate** (pullt, reviewt gegen Dispatch-Tabelle + Norm/Klausel-Register, re-verifiziert `tsc`/Suite, mergt nach `main` mit Marks OK).

> **Status (Planer 8, 2026-06-08):** Bridge-Doku ist **committet** (`main == origin/main == c5eb583`, gepusht) → Dispatch-Tabelle steht live, Watcher feuert. Alle drei Bauaufträge liegen baufrei vor. **Bisher kein Lane-Branch gepusht** (vorhandene `cursor/din-77200-…` + `cursor/hq-*` = alte HQ/DFSS-Arbeit, berühren keine Lane-Datei). Planer pollt jetzt per `git fetch`; meldet sich, sobald ein Lane-Branch eintrifft.

### 2026-06-08 — ✅ Planer: G4-P1-Review (`047878c`) ABGENOMMEN + Sanity-Check ÖPV-/Audit-Export-Bauaufträge

**1) G4 Phase 1 (`047878c`) reviewt → ABGENOMMEN** (Detail: `CODE_REVIEW.md`, oberster Eintrag). Unabhängig re-verifiziert am HEAD: `tsc` 0 · Engine-Suite 27/27. roleClass-Klassifikationsquelle sauber, keine neue CL/UE, Migration idempotent, EC-09/EC-10 gewahrt. **1 Mark-Hinweis** (kein Re-Bau): Die Read-Migration klassifiziert **bestehende „Einsatzleitung"-Akten EK→FK** um → höheres Soll + CL-10-Prüfhinweis bei DIN-SDL. Gewollt (Marks Gate „nur Einsatzleitung = FK"), kein Datenverlust; explizit gesetztes `roleClass`/`roleClasses` hat Vorrang. **Hinweis für künftige Aufträge:** `047878c` (Einfachfeld `roleClass`) ist durch `e1899dd` auf **`roleClasses`-Set** generalisiert — HEAD-Stand = Mehrfach-Klasse.

**2) Sanity-Check der zwei noch-nicht-gebauten Bauaufträge (vor Bau):**

**🟢 `CURSOR_OEPV_ENGINE_AUFTRAG.md` (Lane A) — BAUFREI, keine Norm-/Scope-Blocker.**
- **Cross-Check-Flag „🔴 ÖPV ohne CL" ist AUFGELÖST:** CL-29 (EK 40 UE, §6.4) + CL-30 (FK +16 = 56, §6.3) stehen als **„belegt"** im `NORM_KLAUSEL_REGISTER_v1.md` (Z. 36/37). Der Auftrag zitiert sie korrekt; UE-Werte exakt = Register. Mechanik (additiv auf EK-Basis, F3-`bewachung`-gegatet) = Asyl-Muster CL-24/25 — konsistent.
- **Anker gegen aktuellen HEAD geprüft (nicht stale):** Block `if (sdl.has("din2-oepv"))` liegt real bei Z. 650 (Auftrag sagt ~650–659 ✅); `SDL_SCOPE_CATALOG`-Eintrag bei Z. 168 (~167–172 ✅); abgeleitete Vars `bewachung`/`fuehrung` existieren (Z. 349/350). §4-Tests nutzen bereits `roleClasses`-Plural (post-`e1899dd`) — passt. **Eine Mini-Korrektur für den Bot:** der Auftrag spricht in §2/§3 noch von „FK/Führungskraft" als ob Einfach-Trigger; im HEAD ist `fuehrung = hasFK` über das `roleClasses`-Set — Logik identisch, nur Wording. Kein Blocker.

**🟡 `CURSOR_AUDIT_EXPORT_AUFTRAG.md` (Lane B) — BAUFREI, aber 1 Scope-Bestätigung für Mark offen.**
- **EC-09/EC-10 sauber:** Lane B fasst Engine/`EmployeeForm`/ZIP-Generator **nicht** an, reused `EmployeeFileOverview` (Single Source), EC-10-Disclaimer drin → parallel-safe zu Lane A. ✅
- **✅ Scope-Frage von Mark entschieden (2026-06-08): zusätzlich XLSX + PDF, Browser-Download.** Lane B Pt 1 (In-App-Batch + Feld-Kopieren) bleibt wie es ist; **zusätzlich** ein herunterladbares Datei-Artefakt. **→ Neuer Folgeauftrag geschrieben: `CURSOR_AUDIT_EXPORT_PT2_AUFTRAG.md`** (Lane B Pt 2). Gates eingearbeitet: Format **XLSX + PDF**, Auslieferung **Browser-Download** (Server schreibt NICHT in OneDrive — Mark legt selbst ab; bestehendes `handleGenerate`-Download-Muster wiederverwenden), Engines `exceljs` + `pdf-lib` (kein Puppeteer), Datenquelle `getEmployeeFileSummary` (Single Source), EC-09/EC-10/DSGVO hart, keine Engine-Datei berührt. **Reihenfolge:** Pt 1 zuerst committen, dann Pt 2. Offene Mark-Mini-Punkte (PDF-Pixel-Optik vs. tabellarisch, Spaltenumfang, ein File vs. je Person) als §7-Defaults gesetzt + überschreibbar.
- **Label-Drift (nur Hygiene, kein Bau-Impact):** Master-Plan nennt Ampel/Status = Slice 3 und Audit-Export = Slice 4; gebaut wurde „Slice 4 = Ampel" (`2261d26`). Funktional kein Konflikt, aber die Slice-Nummern im Master-Plan vs. Build divergieren — bei Gelegenheit im Master-Plan nachziehen.

### 2026-06-07 — 🐛 BUGFIX-AUFTRAG (Planer 6): Hydration-Mismatch Firmenname (`EmployeeFileIndex` Z. 271)

**Symptom (Mark, Browser):** „1 Issue" im Next-Dev-Overlay = **React-Hydration-Error**. Server rendert `(TeamFlex)`, Client `(Wolf_Street)` an `EmployeeFileIndex.tsx:271` (`{companyDisplayName ? \` (${companyDisplayName})\` : ""}`). Kein Crash, aber Hydration-Warnung + potenziell verworfenes Client-DOM.

**Root Cause (belegt):** `company-session.ts` `getActiveCompanySlug()` ist **nicht SSR-stabil** — Server liefert `DEFAULT_COMPANY_SLUG="TeamFlex"`, Client liest `localStorage` (`"Wolf_Street"`). Verwendet als **lazy `useState`-Initializer** in `EmployeeAutomationPage.tsx` Z. 50 (`useState(getActiveCompanySlug)`). Damit divergiert der **erste** Client-Render von der SSR-HTML, sobald localStorage einen Nicht-Default-Slug hält (= nachdem Mark einmal die Firma gewechselt hat). `activeCompanyName` (Z. 519, companies noch leer → Fallback auf rohen Slug) fließt in `EmployeeFileIndex` → Mismatch.

**Scope-Einordnung (Planer):** **Pre-existing**, **unabhängig von Slice 3** (Doppelrolle hat company-Logik nicht angefasst) und vom URL-Fix `17f94cc`. Klein + contained, eigener Mini-Fix (kein Architektur-Gate nötig; C-10 unberührt).

**Empfohlener Fix (minimal, SSR-sicher) — Executor:**
- `companySlug`-State mit dem **konstanten Default** initialisieren (SSR == erster Client-Render): `useState(DEFAULT_COMPANY_SLUG)` statt `useState(getActiveCompanySlug)`. Den `localStorage`-Lesezugriff erst **nach Mount** (in einem `useEffect`) durchführen und per `setCompanySlug` setzen. (Der bestehende Bootstrap-Effekt Z. 93–113 setzt den Slug ohnehin schon — ggf. reicht es, den Initializer auf den Default zu ziehen, sodass der erste Render deterministisch ist.)
- Optional defensiv: `DEFAULT_COMPANY_SLUG` aus `company-session.ts` exportieren (statt erneut hartzucodieren).
- **Gegencheck:** kein weiterer `localStorage`-Lesezugriff im Render-Pfad, der die SSR-HTML beeinflusst (Stacktrace zeigt nur diese eine Stelle).

**DoD:** `tsc --noEmit` 0 · **Hydration-Warnung weg** im Browser nach Firmenwechsel + Reload (`?new=1`-Ansicht **und** Index-Ansicht) · EC-09-Smoke unberührt (Generator/ZIP nicht angefasst) · Firmen-Switcher zeigt nach Reload weiterhin die zuletzt gewählte Firma (localStorage-Persistenz bleibt, nur zeitversetzt nach Mount). **Plan nicht umschreiben** — bei Norm-/Scope-Zweifel Frage an Planer.

**Gate:** Mark, ob als kleiner Sofort-Fix vor Slice 3b oder gebündelt. Planer-Empfehlung: **Sofort-Fix** (1 Datei-Logik, behebt sichtbare Dev-Warnung; blockt nichts).

### 2026-06-07 — ▶ Planer 5: Slice 3 geplant (Doppelrollen) → Bauauftrag steht, Bau gated auf Mark

**Bauauftrag an Executor:** `hq/10_Bridge/CURSOR_SLICE3_AUFTRAG.md` (Doppelrollen-Modellierung, code-only, sofort baubar). Schließt die Slice-2-Modell-Grenze (Engine kennt pro Person nur **eine** `roleType`; Verwaltung/GF-mit-Schicht fällt durchs F3-Gate).

- **Lösung (geschärft nach Mark 2026-06-07 „GF kann zusätzlich EK und/oder FK"):** additives **Niveau-Feld** `Employee.zusatzBewachungNiveau` (`"ek"`|`"fk"`, leer = keine Doppelrolle) → Engine-Context hebt das F3-Gate (effektive Bewachung) **und** wählt das SDL-Niveau. **Keine neue Normpflicht** — nur Trigger/Niveau auf bestehenden Regeln. **Anker: CL-40 / CL-01** (qualifiziert-Def. + §34a knüpft an Tätigkeit). **EK** → CL-21/CL-24 (16/40 UE); **FK** → CL-20/CL-25 (24/64 UE) + FK-Quali CL-10 („fachlich prüfen"). FK = EK-Basis + Aufschlag (deckt „und/oder" ab).
- **⚠️ F4-Verfeinerung (Mark bestätigt):** F4 („nur `roleType=Führungskraft`=FK") bleibt für Grundrollen; die Doppelrolle bekommt einen **expliziten, manuell gewählten** FK-Pfad (nicht automatisch). Kein Widerspruch zu F4 (EL/OL/SL bleiben EK).
- **⚠️ CL-10-Gate (Mark bestätigt):** FK-Quali-Posten (CL-10, „fachlich prüfen") nur **bei DIN-SDL/Auftrag** (`din1-*`/`din2-*`) — gilt für beide FK-Wege. **Bewusste Slice-2-Präzisierung** (vorher feuerte CL-10 für jede FK ohne SDL); bestehende Suite bricht nicht (gegengeprüft). Im Bauauftrag §2/§4.2 dokumentiert.
- **Umfang:** schema (`String?`) + types (`"ek"|"fk"`) + repository (5 Mapping-Stellen, Read normalisiert) + engine (effektive `bewachung`+`fuehrung`, Verwaltungs-/Praktikanten-Reduktion bei Doppelrolle unterdrücken) + presenter (`buildRequirementContext` + `isSecurityRole` doppelrollen-aware) + UI-Select (EK/FK) + 6 neue Engine-Tests. DoD/Tests im Bauauftrag.
- **EC-09/EC-10/keine-erfundene-Pflicht** gewahrt; Browser-Verifikation Pflicht.

**Executor: erst bauen nach Marks „los für Slice-3-Bau".** Zwei Gate-Punkte für Mark unten („Offene Entscheidungen").

### 2026-06-07 — ⚠️ Planer-4-Finding (Slice 3): Tally-Formular `vGNvY0` deckt Engine-Eingaben nur teilweise ab

**Kontext (Marks Frage beim Deploy):** Fragt das Live-Formular alle Felder ab, die die Slice-2-Engine (`RequirementContext`) braucht? **Antwort: nein — Teil-Abdeckung.** Soll-Ist gegen `requirement-engine.ts` (Z. 77–93) + `TALLY_FIELD_MAPPING.md`:

| Engine-Eingabe | im Formular? | CL (für künftige Felder) |
|---|---|---|
| `roleType` / `employmentType` / `qualification` + Dok-Uploads (§34a/BWR/EH/Brandschutz/Vertrag/Ausweis) | ✅ vorhanden | — |
| `sdlScopes` (Veranstaltung/Asyl/Objekt-Geltungsbereich) | ❌ fehlt | CL-20/21/22/24/25 |
| `drivesServiceVehicle` (Dienstfahrzeug ja/nein) | ❌ fehlt | CL-73 (heute „fachlich prüfen") |
| `ersteHilfeGueltigBis` / `brandschutzGueltigBis` (Ablaufdaten, nicht nur Datei) | ❌ fehlt | CL-08 (2 J.) / CL-23 (3 J.) |
| `appointmentLabels` (Beauftragungen/Bestellungen) | ❌ fehlt | appt-* (CL-08/23 u. a.) |
| `startDate` (Eintrittsdatum, treibt Fristen) | ❌ fehlt (nur Geburtsdatum) | CL-02 (6-Mon-Sachkunde) |

**Kein Deploy-Blocker:** Intake legt die Basis-Akte korrekt an; die fehlenden Treiber werden heute **manuell in der App** nachgepflegt (Slice-2-Erfassungsfelder: SDL-Mehrfachauswahl, Dienstfahrzeug, Fristdaten). Webhook-Umstellung bleibt richtig.

**Slice-3-Scope-Notiz (Planung gehört Planer):** Wenn der **Kunde** diese Angaben selbst im Formular liefern soll → Formular erweitern + Webhook-Mapping (`tally-employee-slots.json`) + Engine-Verdrahtung. Jede neue norm-getriebene Frage braucht eine `clauseId` (keine erfundene Pflicht). **Reiht sich neben die Doppelrollen-Lücke ein** (s. „Offene Entscheidungen für Mark") → beide zusammen in Slice-3-Planung abwägen. Mark: „Slice-3-Finding festhalten + Deploy weiter" entschieden (2026-06-07).

**Aufwands-Einordnung (präzisiert nach Mark-Rückfrage 2026-06-07):** Der Aufwand liegt **nicht beim Kunden** (pro MA nur wenige Klicks: SDL-Scope/Dienstfahrzeug/Eintrittsdatum = trivial; Gültig-bis-Daten = vom Zertifikat ablesen; Beauftragungen = erklärungsbedürftig). Der eigentliche Aufwand ist (1) **Bauarbeit**: jedes Feld über **alle 10 MA-Slots** mappen + Engine verdrahten; (2) **Norm-Mapping** mit `clauseId`; (3) **Daten-Qualität**: erklärungsbedürftige Felder (z. B. „was zählt als Objektschutz") brauchen Erklärtext, sonst falsche Kundenantworten. **Trade-off:** Erfassung an der Quelle (weniger manuelle Nachpflege/weniger Lücken) vs. längeres Formular (Abbruchquote, norm-richtige Fragestellung). **Planer-Empfehlung = Option C (Hybrid):** eindeutige Felder (SDL-Scope, Dienstfahrzeug, Eintrittsdatum) ins Formular; erklärungsbedürftige (Beauftragungen) zunächst manuell. **Entscheidung übers Gate (Mark), nicht allein Planer.**

### 2026-06-07 — ▶ Findings 1+2 (+5) zum Verdrahten + UE-Anzeige Pre-Commit-Review (Planer 2)

**1) UE-Anzeige (Variante C) — statisches Pre-Commit-Review besteht** (`CODE_REVIEW.md`, oben). `EmployeeFileTrainingTargets.tsx` + Verdrahtung + Persistenz vollständig, `tsc` 0, Lints 0. **Offen vor Final-Abnahme:** Browser-Akzeptanz (Karte rendert, Ist persistiert über Reload, EC-09-Smoke grün) + **Commit**. Kleines Anzeige-Finding: `t.hint` wird nicht gerendert → **CL-27-Anrechnungs-Zeile** + Asyl-„64 UE"-Hinweis fehlen (Variante-C-Vorlage zeigt die Anrechnungszeile). Bitte mit Findings 1+2 mitnehmen.

**2) Findings 1+2 (+5) — Bauauftrag:** `hq/10_Bridge/CURSOR_FINDINGS_1_2_AUFTRAG.md`.
- **F1:** `q-34a` bei reiner Unterrichtung → `status: "unvollständig"` statt `"vorhanden"` (Engine + Test).
- **F2:** Pflicht-Set-Doppelzeilen CL-08 (Erste Hilfe) + CL-23 (Brandschutz) im **Presenter** dedupen (Trigger mergen; `null`-CL nie dedupen; exklusive CL-04/05/09 prüfen).
- **F5 (kosmetisch):** Asyl-Basis-Label rollen-neutral.
- DoD: `tsc` 0, EC-09-Smoke grün, Browser-Akzeptanz, Suite grün.

### 2026-06-07 — ✅ Findings 3+4 entschieden (Mark) → in Engine-Auftrag verdrahtet (Planer 2)

- **F4 = Variante B + Upgrade-Pfad:** nur `roleType = "Führungskraft"` = FK (24 UE + CL-10); Einsatz-/Objekt-/Schichtleitung = EK/SMA (16 UE), bleiben Bewachung; FK-Upgrade über Distance-Learning = Phase 2.
- **F3 = gaten:** SDL-Schulungssoll nur bei Bewachungsrolle. Doppelrolle (Verwaltung+Bewachung) = Design-Lücke für Slice 3+.
- Beide in `CURSOR_FINDINGS_1_2_AUFTRAG.md` als Engine-Auftrag (F3/F4) ergänzt.

### 2026-06-07 — ✅ Mark: „los" für Hetzner-Deploy → Pre-Deploy-Bauauftrag (Planer 3)

**Bauauftrag an Executor:** `CURSOR_HETZNER_PREDEPLOY_AUFTRAG.md` (klein, keine Architektur). Gates: `npm run build` grün (zentral — `next build` fährt tsc+ESLint, **kein** `ignoreDuringBuilds`) · EC-09-Smoke gegen Prod-Build im Browser · `.env.example`-Vollständigkeit · `db:push`-Trockencheck (nur `prisma/prisma/dev.db`).

**Planer-Entscheidung DB-Pfad (Checklisten-Punkt 1 „klären" = erledigt):** Es gibt **nur eine** DB, live `prisma/prisma/dev.db` (Prisma löst `file:./prisma/dev.db` relativ zum Schema-Ordner auf). **Kanonisch bleibt genau das** — kein Pfad-Churn vor Deploy; frischer VPS bekommt frische DB via `db:push`. Kosmetische Vereinheitlichung auf ein einzelnes `prisma/` = eigener Tech-Debt-Slice. `HETZNER_DEPLOY.md` Env-Tabelle + Backup-Pfad (zeigten fälschlich auf `prisma/dev.db`) **gefixt**.

**Build-Gate-Hinweis:** Lint-Errors bei `next build` → erst fixen; `ignoreDuringBuilds` nur nach Rückfrage (Lint-Gate nicht eigenmächtig aushebeln). T-02 hatte ESLint mal auf 0 — Executor bestätigt per echtem Build.

**Danach Mark (Server):** DNS/Subdomain · `.env.production.local` auf VPS · erster Deploy (systemd/nginx/certbot) · Webhook-PATCH auf Prod-URL · Backup-Cron auf `prisma/prisma/dev.db`. Details: `HETZNER_DEPLOY.md` + Bauauftrag.

### 2026-06-07 — ▶ Hetzner-Deploy = eigener Schritt NACH Slice 2 (nicht vermischen) — Planer 2

**Rahmung (kein Bau-Start jetzt — erst nach Slice-2-Stabilität + Marks „los"):** Deploy-Runbook steht vollständig in `HETZNER_DEPLOY.md` (systemd, nginx/Let's Encrypt, Env-Checkliste, Webhook-PATCH auf Prod-URL). Ziel: **stabile HTTPS-URL** statt flüchtigem cloudflared-Tunnel.

**Pre-Deploy-Checkliste (Executor, klein — bevor Mark deployt):**
1. **DB-Doppelpfad vereinheitlichen** (`prisma/prisma/dev.db` vs. `prisma/dev.db`, Tech-Debt aus CLAUDE.md) — sonst zeigt der Server auf eine andere DB als Dev. Vor Deploy klären, welcher Pfad kanonisch ist.
2. **Prod-Build-Gate prüfen:** `next build` muss durchlaufen (ESLint war repo-weit mal blockierend; T-02 hat auf 0 gefixt — vor Deploy `npm run build` lokal grün bestätigen).
3. `.env.production.local` Env-Vollständigkeit (DATABASE_URL, HETZNER_S3_*, TALLY_API_KEY, TALLY_WEBHOOK_SECRET, INTERNAL_API_KEY, NODE_ENV).

**Mark-Aktionen (aus `HETZNER_DEPLOY.md` „Offen"):** Subdomain + DNS (`cos.cert-expert.de` → VPS-IP), `.env.production.local` auf VPS, erster Deploy + Webhook-URL umstellen, optional Tally Hidden Field `cea_company_slug`.

> Ältere „Von Claude an Cursor"-Einträge (Norm-Matrix v2, Slice-Freigaben, frühe Reviews, 2026-06-06-Overviews, Scope-Entscheidungen) → **`HANDOFF_ARCHIV.md`**.

---

## ❓ Offene Entscheidungen für Mark

**G4 — Phase-1-Mini-Gates (Planer 7, 2026-06-08) — ✅ ENTSCHIEDEN:** (a) Org-Titel = Dropdown + Freitext-Option; (b) nur Einsatzleitung = FK (DIN 77200), Objekt-/Schichtleitung bleiben EK; (c) getrennt → dieser Bauauftrag = Phase 1 (Doc-Auswahl bleibt vorerst, Phase 2 separat). `CURSOR_G4_AUFTRAG.md` v3 baufertig. **Nächstes Gate: Marks „los für G4-Phase-1-Bau".** *(Richtungs-/Architektur-Entscheide a–e von Mark wurden bereits in v2 eingearbeitet; G4 als eigener Slice = ja.)*

**G4 — Anlege-Formular-Migration (Planer 6, 2026-06-07) — ✅ Richtung entschieden (eigener Slice, In-App, Tally-entkoppelt); Phase-1-Gates s. o.:**
- **Kontext:** „Neue Person" zeigt zuerst das **alte Tool-1-Form** (`EmployeeForm.tsx`, `displayMode="master"`, engl. Labels, Altmodell `roleId`/`appointmentIds`/Freitext-`roleType` + Doc-Template-Auswahl für den Generator). Die **neuen Requirement-Felder** (Grundrolle-Enum, Doppelrolle, SDL/Geltungsbereich, Beschäftigungsart, Fristen, UE) leben erst **danach** in der Akte (`EmployeeFilePersonRolleEditTable.tsx` + Engine). Deckt sich mit Planer-4-UX-Notiz + Executor-FRAGE.
- **Planer-6-Einordnung (Spur P, keine Eigenentscheidung):** Das ist eine **Architektur-/Scope-Änderung = eigener Slice** (C-10, Mark-Gate) — **nicht** in Slice 3 enthalten, vom Executor korrekt NICHT eingeplant. Berührt `EmployeeForm.tsx` (master) + `lib/validations/employee-form.ts` (Zod) + Verhältnis zur Doc-Template-Auswahl (bleibt im Anlege-Schritt oder wandert in den Generator?) + Verhältnis zur Tally-Feldlücke (Slice 3b).
- **Frage an Mark (Gate):** (a) Anlege-Formular auf das neue Requirement-Modell **vereinheitlichen** (eigener Slice), oder (b) **vorerst belassen** (Legacy-Create + Nachpflege in der Akte, by design) und Slice 3b/4 vorziehen? → Planer 7 plant den Slice erst nach Marks Entscheid (Reihenfolge ggü. 3b/4).

**Slice-3-Planung (Planer 5, 2026-06-07) — ✅ G1/G2/G3 ENTSCHIEDEN (Mark) → ✅ GEBAUT (`a276d38`) → ✅ ABGENOMMEN (Planer 6):**
- **G1 — Slice-3-Scope ✅ Mark: ja.** Slice 3 = **nur Doppelrollen-Modellierung** (`CURSOR_SLICE3_AUFTRAG.md`). **Tally-Formular-Feldlücke** (Option C Hybrid) = **Slice 3b**, gated darauf, dass Mark die Felder zuerst im Tally-Formular anlegt.
- **G2 — Numerierung ✅ Mark: bestätigt.** Doppelrolle = **Slice 3**, Ampel-/Status-Ansicht = **Slice 4** (verschoben gegenüber dem Original-`CURSOR_BAUAUFTRAG_TOOL2.md`).
- **G3 — Niveau-Modell ✅ Mark: ja** (2026-06-07): Doppelrolle = **Niveau-Selektor EK/FK** (statt Boolean). FK manuell wählbar, baut auf EK auf. FK-Quali (CL-10) **nur bei DIN-SDL**. Bauauftrag entsprechend geschärft (§1/§2/§3/§4/§6/§8).
- **✅ BAU FREIGEGEBEN (Mark, 2026-06-07, 22:14):** Executor darf `CURSOR_SLICE3_AUFTRAG.md` (Doppelrolle, Niveau EK/FK) bauen. **Neuer Executor-Chat auf `main`** → liest `CLAUDE.md` + HANDOFF (HIER STARTEN) + `CURSOR_SLICE3_AUFTRAG.md`, baut den Slice, hält EC-09-Smoke + `tsc` grün, committet mit Marks OK, hängt EINEN Ergebnis-Eintrag an. **Plan nicht umschreiben.** Form-Feldlücke = Slice 3b (separat, gated auf Marks Tally-Arbeit).

**Slice-2-Review Findings 3+4 — ✅ ENTSCHIEDEN (Mark, 2026-06-07):**
- **Finding 4 = Variante B + Upgrade-Pfad:** Nur `roleType = "Führungskraft"` zählt als **FK** (24 UE + FK-Quali CL-10). **Einsatzleitung, Objektleitung, Schichtleitung = EK/SMA-Niveau (16 UE), kein Auto-FK.** Sie bleiben **Bewachungsrollen** (volles Basis-Pflichtset). **Zusatz (Phase 2):** Upgrade-Pfad auf FK, wenn die Person die FK-Schulung absolviert (künftig über Cert-Expert Distance-Learning direkt im Portal) — Design-Notiz, nicht Slice-2-Engine.
- **Finding 3 = gaten, BESTÄTIGT (Mark):** SDL-Schulungssoll nur bei Bewachungsrolle. Beispiel akzeptiert: reine Bürokraft ohne Bewachung → kein SDL-Soll. Korrekt für den Normalfall (eine Rolle).
- **🟡 Design-Lücke „Doppelrolle" (Mark-Feedback, Phase 2 — NICHT Slice 2):** Die Engine kennt pro Person nur **eine** `roleType`. Eine Person mit **Verwaltung/Geschäftsführung + zusätzlich Bewachung** (z. B. GF, der mit auf Schicht geht — bei kleinen Firmen real) kann heute **nicht** abgebildet werden → bekäme fälschlich kein Bewachungs-Set/SDL-Soll. Lösung später: Doppelrolle modellieren (z. B. Flag „übt zusätzlich Bewachungstätigkeit aus" oder Mehrfach-`roleType`). **Bis dahin Workaround:** solche Personen als Bewachungsrolle erfassen. → als Design-Notiz für Slice 3+ vorgemerkt.

→ F3/F4 in **`CURSOR_FINDINGS_1_2_AUFTRAG.md`** als Engine-Auftrag verdrahtet. *(Finding 1+2 = Presenter/Engine-Feinschliff; Finding 5 kosmetisch.)*

---

## ✅ Archiv (erledigt)

Vollständige Historie (erledigte Aufgaben, alte Abschlüsse, frühe Reviews) → **`HANDOFF_ARCHIV.md`**.
