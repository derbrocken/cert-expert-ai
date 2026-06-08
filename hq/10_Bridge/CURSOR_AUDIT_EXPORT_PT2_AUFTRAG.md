# CURSOR_AUDIT_EXPORT_PT2_AUFTRAG — Audit-Datei-Export (XLSX + PDF, Browser-Download) — Lane B Pt 2

> **Folgeauftrag zu `CURSOR_AUDIT_EXPORT_AUFTRAG.md` (Lane B Pt 1).** Pt 1 = In-App-Batch-Ansicht + Feld-Kopieren über `EmployeeFileOverview`. **Pt 2 baut additiv darauf auf:** über dieselbe Personen-Batch-Auswahl ein **herunterladbares XLSX + PDF** erzeugen. Mark-Gate (2026-06-08): **Format = XLSX + PDF**, **Auslieferung = Browser-Download** (Server schreibt NICHT direkt in OneDrive; Mark legt die Datei selbst in `OneDrive Clients/{Kunde}/08_Generated/` ab).
> **Reihenfolge:** **Pt 1 zuerst** (Batch-Auswahl + Overview-Reuse müssen stehen). Pt 2 nur starten, wenn Pt 1 committet ist.
> **Rollen-Kontrakt:** Bot baut nur diesen Auftrag, committet mit Marks OK, hängt EINEN Ergebnis-Eintrag in HANDOFF an, parkt Zweifel als Frage. Plant nicht neu, erfindet keine Normwerte.

## 1. Was kann Mark am Ende
In der Batch-/Vorzeige-Ansicht (Pt 1) mehrere SMAs auswählen → **„Audit-Datei erzeugen"** →
- **XLSX** lädt herunter: eine **Übersichts-Tabelle** (1 Zeile je Person) + ein **Schulungs-/Nachweis-Detailblatt** (je geplante/erfasste Schulung: Datum, Modul, Status, Nachweis-Dateiname). Ersetzt die bisherige „SMA-Daten-Gesamt-Excel".
- **PDF** lädt herunter: je gewählter Person die read-only Audit-Übersicht (Pflicht-Set + CL-Badges, Ampel, UE-Soll/Ist, Fristen, offene Punkte) mit EC-10-Disclaimer — auditfest zum Mitnehmen/Abheften.

## 2. Default-Entscheide (Planer, überschreibbar von Mark)
- **Auslieferung = Browser-Download** beider Dateien (Gate gesetzt). **Bestehendes Download-Muster wiederverwenden:** Server-Action liefert `base64`, Client decodiert `atob → Blob → URL.createObjectURL → <a download>` — **identisch zu `handleGenerate` in `EmployeeAutomationPage.tsx` (Z. 470–500)**. Kein neuer Infra-Teil, **kein** OneDrive-/S3-Schreibpfad.
- **XLSX-Engine = `exceljs`** (neue Dependency; etablierter Standard, kein nativer Binär-Build). **PDF-Engine = `pdf-lib`** (neue Dependency, reine JS, läuft im Hetzner-systemd-Node ohne Headless-Chromium). **KEIN Puppeteer/Headless-Chrome** (zu schwer für die Server-Unit).
  - *Sub-Default PDF-Layout:* tabellarisch/strukturiert über `pdf-lib` (gleiche Felder wie XLSX-Übersicht). Falls Mark die **pixelgenaue** Overview-Optik als PDF will → das ist ein größerer Lift (HTML→PDF/Print-Route) und wäre **Pt 3**, nicht hier. **Nicht raten — bei Zweifel parken (§5).**
- **Datenquelle = `getEmployeeFileSummary(...)`** (`employee-file-requirements.ts:651`) — **Single Source, NICHT neu berechnen.** XLSX und PDF lesen exakt dieselbe Summary wie `EmployeeFileOverview`/Dossier. Schulungs-Detail = `employee.trainingPlan` (Queue C) + Evidence-Dateinamen (`training-plan:{id}`-Konvention).

## 3. Scope / Dateien
- **NEU `app/actions/generate-audit-export.ts`** (Server-Action): Input = `{ employeeIds: string[], format: "xlsx" | "pdf" | "both" }`. Lädt die Akten (bestehendes Repository), ruft je Person `getEmployeeFileSummary(...)`, baut die Datei(en), gibt `{ success, xlsxBase64?, pdfBase64?, error? }` zurück. **Reine Server-Logik, keine Engine-Datei anfassen.**
- **NEU `modules/03-mitarbeiterakte-tool-2/employee-file/audit-export-xlsx.ts`** + **`audit-export-pdf.ts`**: pure Builder (Summary[] → Buffer), UI-frei, **unit-testbar** ohne Browser.
- **Verdrahtung in der Pt-1-Export-Ansicht:** Button „Audit-Datei erzeugen" über der bestehenden Batch-Auswahl; nutzt die **gewählte Personen-Menge** (nicht den ZIP-Generator-Action). Download-Trigger = das `handleGenerate`-Muster (kopieren, nicht den ZIP-Action umbauen).
- **Dependencies:** `exceljs` + `pdf-lib` in `package.json` ergänzen (`npm i`), `package-lock.json` mitcommitten.
- **KEINE Änderung an:** `requirement-engine.ts`, `employee-file-requirements.ts` (nur lesen via `getEmployeeFileSummary`), `EmployeeForm.tsx`, dem EC-09-ZIP-Generator (`generate-employee-docs.ts` / `handleGenerate`-Action selbst).

## 4. Inhalt der Dateien (aus der Summary — keine neuen Norm-Werte)
**XLSX Blatt 1 „Übersicht" (1 Zeile/Person):** Name · Org-Titel (`roleType`) · Norm-Klasse(n) (`roleClasses`) · Beschäftigungsart · Geltungsbereiche (SDL) · Pflicht-Ampel (rechnerischer Status) · UE-Soll/Ist · nächste Frist + Datum · Anzahl offene Punkte. **Jede normbezogene Spalte trägt die `clauseId` aus der Summary** (z. B. Soll-Spalte → CL-11/CL-20…), keine erfundenen Werte.
**XLSX Blatt 2 „Schulungen/Nachweise" (1 Zeile/Plan-Eintrag):** Person · Modul/Soll-Posten · geplantes Datum · Status (geplant/überfällig/Nachweis vorhanden) · Nachweis-Dateiname (falls vorhanden). Aus `trainingPlan` + Evidence — Status `unchecked` bleibt sichtbar.
**PDF:** je Person eine Sektion mit denselben Feldern (Pflicht-Set mit CL-Badges, Ampel, Fristen, UE-Soll/Ist, offene Punkte).

## 5. EC-10 / Guardrails (hart)
- **EC-10:** Kopf/Fuß beider Dateien tragen den Disclaimer **„Rechnerischer Stand · eingehende Nachweise gelten als ungeprüft (`unchecked`) · keine Freigabe-/Auditfähigkeits-/Zertifizierungsaussage."** Verboten: „freigegeben/auditfähig/zertifiziert/einsatzbereit" als Statuswort. Ampel = rechnerischer Status, **nicht** „bestanden".
- **EC-09:** ZIP-Generator/Action unberührt — nur gegenprüfen, dass `POST /employee-automation` **200** bleibt.
- **DSGVO:** Die Datei enthält Personendaten → **nur** als Download an Mark, **nichts** auf S3/Git. `.env`/`.db`/`hq/03_Kundenprojekte/**` nicht committen. Test-Fixtures mit Dummy-Personen.

## 6. DoD (alle grün)
- `tsc --noEmit` = 0.
- **Unit-Tests** für `audit-export-xlsx.ts` + `audit-export-pdf.ts` (Summary-Fixture → Buffer ist nicht leer, enthält erwartete Felder/Disclaimer; XLSX via `exceljs`-Reload gegenlesen, PDF-Bytes-Header `%PDF`). Engine-Suite **27/27** unverändert (keine Engine-Datei berührt).
- **EC-09-ZIP** `POST /employee-automation` **200** unberührt.
- **Browser :3001:** Personen wählen → „Audit-Datei erzeugen" → XLSX **und** PDF laden herunter; XLSX öffnet in Excel mit beiden Blättern + korrekten Werten = identisch zur Overview-Summary; PDF zeigt je Person die Übersicht; **EC-10-Disclaimer in beiden** sichtbar.
- **Keine** Engine-/Norm-/UE-Datei geändert; keine neue CL/UE.

## 7. Offen für Mark (nicht raten — parken falls unklar)
- **PDF-Optik:** strukturiert/tabellarisch via `pdf-lib` (Default) **oder** pixelgenaue Overview-Optik (HTML→PDF, größerer Lift = Pt 3)? Default bauen, Wunsch nach Pixel-Optik als Frage parken.
- **XLSX-Spaltenumfang:** reicht §4, oder braucht der Auditor zusätzliche Spalten (Anbieter/Teilnehmerliste o. Ä.)? Default = §4; Erweiterung als Frage.
- **Ein File je Auswahl** (alle gewählten Personen in einer XLSX/PDF, Default) **oder** ein File je Person (ZIP)? Default = ein gemeinsames File.

## 8. Kickoff-Prompt (neuer Bot, `main`)
> Du bist Executor (Spur E). Lies `CLAUDE.md` + `hq/10_Bridge/HANDOFF.md` (HIER STARTEN) + `CURSOR_AUDIT_EXPORT_AUFTRAG.md` (Pt 1, muss committet sein) + **diesen Auftrag**. Baue **nur** §3–§4: Server-Action `generate-audit-export.ts` + Builder `audit-export-xlsx.ts`/`audit-export-pdf.ts` aus `getEmployeeFileSummary` (Single Source), Download über das `handleGenerate`-Muster, `exceljs` + `pdf-lib` als Deps. Halte §5/§6 hart (EC-10-Disclaimer in beiden Dateien, EC-09-ZIP 200 unberührt, Engine-Suite 27/27, Unit-Tests grün, keine neue CL/UE, keine Personendaten auf Git/S3). Committe mit Marks OK, hänge EINEN Ergebnis-Eintrag in HANDOFF an. Bei PDF-Optik-/Spalten-Zweifel (§7) parken + Frage an Mark/Planer; Plan nicht umschreiben.

## 9. Code-Fakten (verifiziert am HEAD, 2026-06-08 — Planer; nicht raten, das ist der reale Stand)

**(a) Single Source — `getEmployeeFileSummary(...)`** in `modules/03-mitarbeiterakte-tool-2/employee-file/employee-file-requirements.ts:651`.
- Signatur: `(employee: Employee, appointments: Appointment[], companyName: string, roleNameInput: string, …)`.
- Liefert u. a. `pflichtSet: RequirementRow[]` (F2-dedupliziert) + `fristen: RequirementRow[]`. **`RequirementRow` = `{ id, label, value?, status: WorkingItemStatus, hint?, trigger?, clauseId?: string | null }`** (Felder bei Z. 21–29). Die `clauseId` je Row ist die Norm-Belegung für die XLSX-/PDF-Spalte — **direkt übernehmen, nichts neu ableiten.**
- UE-Soll/Ist + Schulungs-Soll kommen aus demselben Summary-Aufruf (Engine-`RequirementResult`). **B berechnet nichts selbst.**

**(b) Download-Muster — `handleGenerate`** in `EmployeeAutomationPage.tsx:470–510`. Exakt wiederverwenden:
`Server-Action gibt base64 → Client: const byteChars = atob(result.xlsxBase64); … new Blob([...]) ; const url = URL.createObjectURL(blob); <a download>` (Z. 492–500). Genau dieses Muster für XLSX **und** PDF — kein neues Download-Konstrukt.

**(c) Selection-Model — `batchSelectedIds: Set<string>`** in `EmployeeAutomationPage.tsx:73`; die gewählte Menge = **`const exportList = employees.filter((e) => batchSelectedIds.has(e.id))`** (Z. 471, heute vom ZIP-Generator genutzt). **Audit-Export nutzt DIESELBE `batchSelectedIds`-Menge** — keine zweite Auswahl-Logik bauen. `exportCount = batchSelectedIds.size` (Z. 694) für die Button-Beschriftung. Wird an `EmployeeFileIndex.tsx` durchgereicht (Props `batchSelectedIds`, Z. 25).

**⚠️ Datei-Konsequenz (für Dispatch-Tabelle):** Weil Selection + Download in `EmployeeAutomationPage.tsx` leben, schreibt Lane B **diese Datei** (Button „Audit-Datei erzeugen" + Action-Aufruf + Download-Handler). Das ist erwartet und kollidiert NICHT mit Lane A (Engine). Den ZIP-`handleGenerate` selbst **nicht umschreiben** — danebenlegen (`handleAuditExport`).
