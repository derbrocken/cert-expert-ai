# Tally-Feld-Mapping (Slice 1 + Lane D #3)

> Generiert 2026-06-07 via Tally REST API (`GET /forms`, `GET /forms/{id}/questions`). Keine Secrets.
> **Review durch Claude vor Verdrahtung.** Slice-1-Intake fokussiert Formular **Mitarbeiterbezogene Unterlagen** (`vGNvY0`).
> **Lane D #3 (2026-06-09):** Abgleich Tally-Feld → `evidenceId` → Akte-Nachweis-Slot auf **je-Schulung-mit-eigenem-Datum** (Mark-Q3) umgestellt; Lücken/Fehl-Mappings gefixt. Vollständige Abgleich-Tabelle unten (Status `ok`/`fix`). Bezug CL-01/02/03/08/23 — **reine Zuordnung, keine neue Normpflicht.** EC-10: alle eingehenden Nachweise bleiben `unchecked`.

## Formulare (Übersicht)

| formId | Name | Ziel-Entität | Status |
|--------|------|--------------|--------|
| `vGNvY0` | Mitarbeiterbezogene Unterlagen | EmployeeFile + EvidenceItem | **Slice 1 aktiv** |
| `Y5Zq80` | Unternehmensbezogene Unterlagen | CompanyExportSettings + EvidenceItem (offen) | Review / Phase 2 |
| `gD5EZ1` | Lieferanteninformationen | offen — nicht Slice 1 | Review / Phase 2 |
| `Y5oXMd` | Zertifizierungsvorbereitung | offen — nicht Slice 1 | Review / Phase 2 |

## Mitarbeiterbezogene Unterlagen (`vGNvY0`)

### Globale Felder (Submission → Kunde)

| Tally questionId | Feld-Key (Webhook) | Label | Type | → Akte-Feld |
|------------------|-------------------|-------|------|-------------|
| `ZdDqda` | `question_ZdDqda` (Live-Webhook) / `question_ZdDqda_{uuid}` (REST-Replay) | Name des Unternehmens | INPUT_TEXT | **Company.slug** — `resolveCompanySlug({ companyName })` (GmbH-tolerant) |
| *(geplant)* | Hidden `cea_company_slug` | — | HIDDEN_FIELDS | **Company.slug** — exakter Registry-Slug (`?company=Wolf_Street`) |
| `NAdGAW` | `question_NAdGAW_c142be6e-c519-4ce0-a27d-1090de05c39f` | E-Mail-Adresse | INPUT_EMAIL | **CompanyExportSettings.companyEmail** — optional — Update Export-Settings |
| `qbv0bd` | `question_qbv0bd_23349e92-2a5c-455e-95a2-b8e953dd1eca` | Wie viele Mitarbeiter Reichen Sie ein  | DROPDOWN | **—** — Anzahl Mitarbeiter-Slots (1–10) — steuert Parsing |

### Mitarbeiter-Slot 1 (Beispiel — weitere Slots 2–10 analog)

| Tally questionId | Label | Type | → EmployeeFile / EvidenceItem |
|------------------|-------|------|------------------------------|
| `QAkPAA` | 1. Mitarbeiterinformationen | INPUT_TEXT | **EmployeeFile.fullName** |
| `pLzdKP` | `question_pLzdKP` | DROPDOWN | **EmployeeFile.roleType** — Rolle (SMA / Führungskraft / …) |
| `aBv7BE` | `question_aBv7BE` | DROPDOWN | **EmployeeFile.employmentType** — Beschäftigungsart |
| `eBvkBE` |  | INPUT_DATE | **EmployeeFile.birthday (INPUT_DATE)** |
| `jBzDvE` |  | INPUT_NUMBER | **EmployeeFile.guardIDNumber (INPUT_NUMBER)** |
| `1rRklb` | Dienstausweisnummer | INPUT_TEXT | **EmployeeFile.employeeIDNumber** |
| `xdzxvo` | Contracts | FILE_UPLOAD | **EvidenceItem `arbeitsvertrag` (Contracts)** |
| `24WQJe` | BWR (Guard Permit) | FILE_UPLOAD | **EvidenceItem `bundesauszug` (BWR)** |
| `blvbl2` | Dienstausweis GuardCard | FILE_UPLOAD | **EvidenceItem `dienstausweis` (GuardCard)** |
| `24o87V` | Qualifikation | DROPDOWN | **EmployeeFile.qualification** |
| `Aly1lW` | Qualification §34a Sachkunde | FILE_UPLOAD | **EvidenceItem `sachkunde` (§34a, CL-01/02)** |
| `7dM6d9` | Ersthelfer / First Aid Certificate | FILE_UPLOAD | **EvidenceItem `training-plan:erste-hilfe` (Schulung, CL-08)** |
| `5dVbDQ` | Brandschutz | FILE_UPLOAD | **EvidenceItem `training-plan:brandschutz` (Schulung, CL-23)** |
| `YZ1rRd` |  | FILE_UPLOAD | **EvidenceItem `tally-weitere-nachweise` (Sammel-Slot, sonstige Nachweise)** |

> **Slots 2–10:** alle `*QuestionId`-Felder + `fileQuestionIds` (mit expliziter `evidenceId`) je Slot in `lib/data/tally-employee-slots.json` (per Tally-Formular-Reihenfolge abgeleitet). Datei-Reihenfolge ist über alle Slots positionsgleich.

---

## Lane D #3 — Abgleich Tally-Datei-Slot → evidenceId → Akte-Nachweis-Slot

> **Mark-Q3 (2026-06-09):** *JE SCHULUNG EIN EIGENER SLOT MIT EIGENEM DATUM* — nicht ein Slot je Typ. Schulungen folgen daher der Queue-C-Konvention **`training-plan:{id}`** (`planEvidenceId(itemId)`), eigener Slot + eigenes Datum. Dokumente/Zertifikate (1 pro Person) behalten ihre feste `evidenceId`.

### evidenceId-Konvention (verbindlich)
- **Dokument/Zertifikat** (genau 1 pro Person, kein eigenes Schulungsdatum): feste `evidenceId` = Akte-Slot-Id aus `PFICHTNACHWEIS_EVIDENCE` (`arbeitsvertrag`, `bundesauszug`, `dienstausweis`, `sachkunde`).
- **Schulung/Training** (eigener Termin/Nachweis je Schulung): `training-plan:{id}` (z. B. `training-plan:erste-hilfe`, `training-plan:brandschutz`) — identisch zur Akte-Termin-Planung (Queue C). Eigener Slot, eigenes Datum.
- **Sonstige/unbeschriftete Uploads:** `tally-weitere-nachweise` (positionsstabiler Sammel-Slot pro Person; Mehrfach-Positionen `-2/-3/-4` in Slot 10).

### Auflösungsreihenfolge (`resolveTallyFileEvidenceId`, `lib/tally-intake-config.ts`)
1. explizite `evidenceId` aus `tally-employee-slots.json` (höchste Priorität),
2. positionsbasierte Tabelle `TALLY_FILE_POSITION_EVIDENCE_IDS` (label-unabhängig, deterministisch),
3. Label-Heuristik `mapTallyUploadToEvidenceId` (Rückfall).

### Abgleich-Tabelle (Datei-Position je Mitarbeiter-Slot → evidenceId → Akte-Slot)

| Pos | Tally-Label (Slot 1) | evidenceId (neu) | Akte-Nachweis-Slot | Typ | CL | Status |
|-----|----------------------|------------------|--------------------|-----|----|--------|
| 0 | Contracts | `arbeitsvertrag` | Pflichtnachweis „Arbeitsvertrag / Beschäftigungsnachweis" | Dokument | CL-03 (Bezug) | **ok** |
| 1 | BWR (Guard Permit) | `bundesauszug` | Pflichtnachweis „Bundesauszug Bewacherregister" | Dokument | — | **ok** |
| 2 | Dienstausweis GuardCard | `dienstausweis` | Pflichtnachweis „Dienstausweis" | Dokument | — | **ok** |
| 3 | Qualification §34a Sachkunde | `sachkunde` | Pflichtnachweis „Sachkundeprüfung" | Zertifikat | CL-01/02 | **ok** |
| 4 | Ersthelfer / First Aid | `training-plan:erste-hilfe` | Schulungs-Slot (Termin-Planung, eigenes Datum) | **Schulung** | CL-08 | **fix** (war `erste-hilfe`, Slot-je-Typ → je-Schulung) |
| 5 | Brandschutz | `training-plan:brandschutz` | Schulungs-Slot (Termin-Planung, eigenes Datum) | **Schulung** | CL-23 | **fix** (war `brandschutz`, Slot-je-Typ → je-Schulung) |
| 6 | *(leer)* | `tally-weitere-nachweise` | Sammel-Slot „weitere Nachweise" | sonstige | — | **fix** (war `tally-upload` → Kollision, jetzt eindeutig) |
| 7–9 | *(nur Slot 10: „Erforderliche Dokumente" + leer)* | `tally-weitere-nachweise-2/-3/-4` | Sammel-Slots (eindeutig) | sonstige | — | **fix** (Mehrfach-Kollision je leerem Upload behoben) |

**Behobene Fehl-Mappings (Status `fix`):**
1. **Slot-je-Typ → je-Schulung (Q3):** Ersthelfer/Brandschutz landeten auf den fixen Dokument-Slots `erste-hilfe`/`brandschutz`; jetzt `training-plan:{id}` → eigener Slot mit eigenem Datum (Akte-Termin-Planung, Queue C).
2. **Empty-Label-Kollision (Slots 3–10):** Datei-Felder ohne Label gaben über `mapTallyUploadToEvidenceId("")` alle dieselbe `tally-upload`-evidenceId zurück → spätere Uploads **überschrieben** frühere. Jetzt positionsbasiert eindeutig (`TALLY_FILE_POSITION_EVIDENCE_IDS` + explizite `evidenceId` je Eintrag in der JSON).
3. **Slot-10-Extras (Pos 7–9):** drei zusätzliche Upload-Felder kollidierten ebenfalls auf `tally-upload`; jetzt `-2/-3/-4`.

**EC-10:** Der Intake setzt jede importierte Datei als `EvidenceItem` mit Status **`unchecked`** (`saveEmployeeEvidenceFile`); keine Auto-Freigabe-/Auditaussage. **Keine neue Normpflicht** — reine Zuordnung bestehender Slots.

**Offen / Hinweis (nicht im Lane-D-Write-Set):** Die `training-plan:{id}`-Slots der Akte werden heute mit **benutzergenerierten** Item-Ids (`tp-…`) angelegt (Queue C). Der Tally-Import nutzt **stabile** Ids (`erste-hilfe`/`brandschutz`). Damit der importierte Nachweis automatisch an einem vorhandenen Plan-Eintrag erscheint, müssten Plan-Items dieselbe stabile Id tragen bzw. ein Lookup ergänzt werden — das berührt `modules/03-mitarbeiterakte-tool-2/**` (Lane C/Akte, **außerhalb dieses Write-Sets**) → als Frage an den Planer geparkt.

## Unternehmensbezogene Unterlagen (`Y5Zq80`) — Auszug

| questionId | Label | Type | → Ziel |
|------------|-------|------|--------|
| `7dM2QA` | Name des Unternehmens | INPUT_TEXT | CompanyExportSettings.companyName |
| `blvxao` | E-Mail-Adresse | INPUT_EMAIL | offen — mit Mark klären |
| `AlyLkk` | 1. Unbedenklichkeitsbescheinigung der Sozialversicherung (ni | FILE_UPLOAD | EvidenceItem / S3 (offen) |
| `XeA4Yj` |  | FILE_UPLOAD | EvidenceItem / S3 (offen) |
| `8dDZ8O` |  | FILE_UPLOAD | EvidenceItem / S3 (offen) |
| `0E0evN` |  | FILE_UPLOAD | EvidenceItem / S3 (offen) |
| `zKB7Ja` |  | FILE_UPLOAD | EvidenceItem / S3 (offen) |
| `5d0Zv6` |  | FILE_UPLOAD | EvidenceItem / S3 (offen) |
| `DVO7Jq` |  | FILE_UPLOAD | EvidenceItem / S3 (offen) |
| `rEBzkv` |  | FILE_UPLOAD | EvidenceItem / S3 (offen) |
| `lN267B` |  | FILE_UPLOAD | EvidenceItem / S3 (offen) |
| `Q0Mbj8` |  | FILE_UPLOAD | EvidenceItem / S3 (offen) |
| `WA1Bqk` | Wie viele Leistungsorte hat Ihr Unternehmen? | DROPDOWN | offen — mit Mark klären |
| `blvyz1` | K1 sssss | INPUT_TEXT | offen — mit Mark klären |
| `EPMylN` |  | INPUT_TEXT | offen — mit Mark klären |
| `rlvzOv` |  | INPUT_TEXT | offen — mit Mark klären |
| `42ze7O` |  | DROPDOWN | offen — mit Mark klären |
| `ylz9L4` | Name 2 | INPUT_TEXT | offen — mit Mark klären |
| `jBv1oE` |  | INPUT_TEXT | offen — mit Mark klären |
| `247QAV` |  | INPUT_TEXT | offen — mit Mark klären |
| `xdvODo` |  | DROPDOWN | offen — mit Mark klären |
| `ZdDqOy` | Name 3 | INPUT_TEXT | offen — mit Mark klären |
| `NAdGXQ` |  | INPUT_TEXT | offen — mit Mark klären |
| `qbv0G7` |  | INPUT_TEXT | offen — mit Mark klären |
| `QAkPRp` |  | DROPDOWN | offen — mit Mark klären |
| … | *20 weitere Felder* | | siehe Tally |

## Lieferanteninformationen (`gD5EZ1`) — Auszug

| questionId | Label | Type | → Ziel |
|------------|-------|------|--------|
| `OAVA8Y` | Name des Unternehmens | INPUT_TEXT | offen — mit Mark klären |
| `VZxZoM` | E-Mail-Adresse | INPUT_EMAIL | offen — mit Mark klären |
| `PAPA8B` | Wie viele Lieferanten hat Ihr Unternehmen? | DROPDOWN | offen — mit Mark klären |
| `EPaP8B` | Name der Lieferanten | TEXTAREA | offen — mit Mark klären |
| `RzgE4J` |  | FILE_UPLOAD | EvidenceItem / S3 (offen) |
| `dYO02V` |  | FILE_UPLOAD | EvidenceItem / S3 (offen) |
| `jBEBGJ` |  | FILE_UPLOAD | EvidenceItem / S3 (offen) |
| `24R4OD` |  | FILE_UPLOAD | EvidenceItem / S3 (offen) |
| `xd6d9v` | Unterschrift | SIGNATURE | offen — mit Mark klären |
| `42G2PA` | Mindestens 2 Rechnungen hochladen | FILE_UPLOAD | EvidenceItem / S3 (offen) |

## Zertifizierungsvorbereitung (`Y5oXMd`) — Auszug

| questionId | Label | Type | → Ziel |
|------------|-------|------|--------|
| `xQGMry` | Offizieller Unternehmensname (laut Handelsregister) | INPUT_TEXT | offen — mit Mark klären |
| `ZVxE8z` | Rechtsform | INPUT_TEXT | offen — mit Mark klären |
| `NVzlrB` | Ansprechpartner (Name und Position) | INPUT_TEXT | offen — mit Mark klären |
| `qByDLY` | E-Mail-Adresse | INPUT_EMAIL | offen — mit Mark klären |
| `QrGe18` | Telefonnummer | INPUT_PHONE_NUMBER | offen — mit Mark klären |
| `91e9Bp` | Adresse des zu zertifizierenden Leistungsortes | INPUT_TEXT | offen — mit Mark klären |
| `eAbQM0` | Unternehmenswebsite | INPUT_TEXT | offen — mit Mark klären |
| `Wo4E2j` | Anzahl der Mitarbeiter am Leistungsort | INPUT_NUMBER | offen — mit Mark klären |
| `axW59v` | Auftragsbestaetigung | CHECKBOXES | offen — mit Mark klären |
| `6kqjLP` |  | TEXTAREA | offen — mit Mark klären |
| `7DQLqP` | Wurde eine geeignete Fuehrungskraft fuer diesen Leistungsort | DROPDOWN | offen — mit Mark klären |
| `bkajqg` | Name der Fuehrungskraft | INPUT_TEXT | offen — mit Mark klären |
| `AJk2z0` | Nachweis der Qualifikation (bitte alles Zutreffende auswaehl | MULTI_SELECT | offen — mit Mark klären |
| `B1vda5` | Art des Nachweisdokuments | MULTI_SELECT | offen — mit Mark klären |
| `kALel1` | Nachweisdokument hochladen | FILE_UPLOAD | EvidenceItem / S3 (offen) |
| `vBReMv` | Datum des Nachweisdokuments | INPUT_DATE | offen — mit Mark klären |
| `KoX5zA` | Es wurde noch keine Fuehrungskraft festgelegt. Bitte beschre | TEXTAREA | offen — mit Mark klären |
| `LG879j` | Status der Geraetepruefung | CHECKBOXES | offen — mit Mark klären |
| `pAgyrq` | Pruefprotokoll hochladen (falls vorhanden) | FILE_UPLOAD | EvidenceItem / S3 (offen) |
| `1KjdXQ` | Ist das Firmenschild am Buero sichtbar angebracht? | CHECKBOXES | offen — mit Mark klären |
| `MO0NXp` | Bitte beschreiben Sie die geplante Lösung und den voraussich | INPUT_TEXT | offen — mit Mark klären |
| `JRypq4` | Wie würden Sie Ihren aktuellen Vorbereitungsstand einschätze | CHECKBOXES | offen — mit Mark klären |
| `gABdal` | Bitte listen Sie alle noch offenen Punkte auf und nennen Sie | TEXTAREA | offen — mit Mark klären |
| `yyO2MB` | HINWEIS !!
Dieser Abschnitt ist rechtlich verbindlich. Er mu | SIGNATURE | offen — mit Mark klären |
| `XGjJLj` |  | CHECKBOXES | offen — mit Mark klären |
