# CURSOR_TOOL2_SCHULUNGEN_FLOW_AUFTRAG — Live-Test-Feedback Mark (2026-06-10)

> **Quelle:** Marks Live-Test nach Vorlagen-Integration (`fe17ad5`). 7 Beobachtungen, diagnostiziert (Explore-Agent). Rollen-/Guardrail-Kontrakt wie immer: EC-09 (ZIP 200), EC-10 (eingehend = `unchecked`, kein Auto-Freigabe), jede Norm-Regel `clauseId`, kein `.env`/`.db`/Kundendaten-Commit. `next build` = Pflicht-Gate.

## Diagnose + Klassifizierung

| # | Beobachtung | Diagnose | Typ |
|---|---|---|---|
| 1 | Einzelne **Bestellungen** tauchen nicht auf | `bestelltAls`/Multiselect speist aus Appointment-Templates mit IDs `safety-training`/`fire-safety`/`compliance-training` — **die existieren NICHT im S3** (nie angelegt). Neue Vorlagen liegen unter `appointments/bestellungen/` mit anderen Namen. → Multiselect muss direkt an **BESTELLUNG_DEFS** (3 Typen) hängen + auf die neuen Vorlagen mappen. | **Bug/Wiring** |
| 2 | **Schulungen unter „Core Set"**, eigener „Schulungen"-Abschnitt fehlt | Keine separate UI-Gruppe „Schulungen" in `EmployeeFileDossierView`; nur `EmployeeFileTrainingPlan` (Planung) + `EmployeeFileTrainingTargets` (Ist-UE). Dossier-Zone Schulungen = Placeholder (`EmployeeFileDossierZones.tsx:98`). | **Fehlt (UI)** |
| 3 | Wo **Datum** für Schulungen/Unterweisungen? Default Gruppe-1 = Einstellung | Datum nur je Plan-Eintrag (`EmployeeFileTrainingPlan` `plannedDate`) + Bulk; **kein Default = `startDate`** für Erst-Standard; `generatorDates` ist nur Ausgabedatum, nicht Durchführungsdatum. | **Fehlt (Logik+UI)** |
| 4 | Schulungen brauchen **Auswahl** | Auswahl existiert in `EmployeeFileTrainingPlan` (Dropdown Soll-Posten + Katalog), aber nur wenn `onSave` durchgereicht (sonst read-only) → evtl. nicht erreichbar im richtigen Modus. | **Bug/Erreichbarkeit** |
| 5 | Tally-Schulungsnachweise: **Datum auslesen oder im Tally-Formular als Input** | Tally-Mapping speichert nur die Datei, **kein Durchführungs-/Zertifikatsdatum** (`tally-employee-slots.json`). | **Fehlt (Datenfeld)** |
| 6 | **Upload** beim Anlegen/Bearbeiten nicht möglich | Evidence-Upload nur in Dossier-Editor (`handleEvidenceUpload`), **nicht im `EmployeeForm`** (Anlegen/Bearbeiten). | **Fehlt (UI)** |
| 7 | Hochgeladen → in **Live-Akte aktualisiert** + **„geschlossen wenn geprüft"** | Live-State-Update beim Upload JA; aber **kein „geprüft/geschlossen"-Status** (EvidenceMap hat kein Status-Feld; Ampel reagiert nur auf „vorhanden", nicht auf Prüfung). EC-10: eingehend bleibt `unchecked`. | **Fehlt (Status-Modell)** |

## 🔴 Entscheidungen für Mark (vor Bau)
- **D1 (#7 Prüfstatus):** Ein **„geprüft/geschlossen"-Toggle je Nachweis**, den **nur du (Admin)** setzt → erst dann Ampel „erfüllt/grün" (vorher `unchecked` = gelb). Korrekt so? (EC-10-konform: eingehende Nachweise bleiben `unchecked`, bis ein Mensch prüft.)
- **D2 (#6 Upload beim Anlegen):** Upload braucht eine **gespeicherte** Person (companySlug/ID). Beim **Bearbeiten** einer bestehenden Akte: Upload direkt im Formular = machbar. Beim **Neu-Anlegen**: erst speichern, dann Upload-Schritt. Variante: (a) Anlegen → „Speichern & Nachweise hochladen"-Schritt, **oder** (b) Upload nur im Bearbeiten/Dossier (heute). Welche?
- **D3 (#3 Datum-Gruppen):** „Gruppe 1 = Erst-Standardunterweisungen/-dokumente" → Default `startDate` (Einstellung/Unterschrift), überschreibbar. Einzelschulungen = manuelles Datum. Bestätige die Gruppen-Definition (was genau ist „Gruppe 1"?).
- **D4 (#5 Tally-Datum):** Durchführungsdatum (a) **aus dem Zertifikat auslesen** (unsicher, „fachlich prüfen") **oder** (b) **als Feld im Tally-Formular** (zuverlässig) **oder** (c) beim manuellen Upload als Datum-Input abfragen? Empfehlung: (b)+(c).

## Bau-Plan (nach Entscheidungen, sequenziell/disjunkt wo möglich)
- **P1 Bugs/Wiring:** #1 Bestellungen-Multiselect an BESTELLUNG_DEFS + neue `appointments/bestellungen/`-Vorlagen; #4 Schulungs-Auswahl im richtigen Modus erreichbar (`onSave` durchreichen).
- **P2 Schulungen-Sektion (#2) + Datum (#3):** eigener „Schulungen"-Abschnitt in Dossier/Übersicht (getrennt von Core-Dokumenten/Unterweisungen); Default-Datum-Logik Gruppe-1 = `startDate`.
- **P3 Upload-Flow (#6) + Prüfstatus (#7):** Upload beim Bearbeiten/Anlegen (je D2); Evidence-Status-Feld (`unchecked`→`geprüft`) + Admin-Toggle + Ampel-Merge (geprüft → erfüllt).
- **P4 Tally-Datum (#5):** je D4 (Tally-Feld/Upload-Datum-Input/Extraktion-als-fachlich-prüfen).

## Norm-Bezug
Unterweisungen CL-03/04/05/75 · Schulungen CL-11 (40/24) + CL-20/21/24/25/29/30 + CL-27-Anrechnung · Bestellungen CL-08/23/74 · Prüfstatus = EC-10 (kein Auto-Grün, menschliche Prüfung schließt).
