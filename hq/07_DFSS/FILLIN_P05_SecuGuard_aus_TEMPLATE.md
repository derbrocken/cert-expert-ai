# DFSS Pilot Measurement Activation — Ausfüllung P05 SecuGuard

**Vorlage (Word):** `QM/Strategie/DFSS_PILOT_MEASUREMENT_ACTIVATION_TEMPLATE_V1_Cert_Expert_BILINGUAL.docx`  
**HQ-Spiegel:** Dieses Dokument — Abschnitte 0–16 wie in der Vorlage.  
**Stand:** 2026-06-05 · **Erster Schwung** (teilweise ausgefüllt, keine erfundenen Pilot-V-Werte)  
**Word (ausgefüllt, Schwung 1):**  
- OneDrive: `QM/Strategie/DFSS_PILOT_MEASUREMENT_ACTIVATION_P05_SecuGuard_FILLED_2026-06-05.docx`  
- HQ-Kopie: [`DFSS_PILOT_MEASUREMENT_ACTIVATION_P05_SecuGuard_FILLED.docx`](DFSS_PILOT_MEASUREMENT_ACTIVATION_P05_SecuGuard_FILLED.docx)  
- Neu generieren: `python3 hq/scripts/fill_dfss_template_p05.py` (venv: `.venv-dfss`)

**HQ Source of Truth:** `03_Kundenprojekte/SecuGuard/` · Lookup: [`REFERENZ_P05_SecuGuard_VOLL.md`](REFERENZ_P05_SecuGuard_VOLL.md)

> **Arbeitsgrenze (Vorlage):** Keine erfundenen Pilotdaten, keine erfundenen Zielwerte. Unbekannt = **TBD**.

---

## Kopfdaten / Header

| Field / Feld | Content / Inhalt |
|--------------|------------------|
| Document / Dokument | DFSS_PILOT_MEASUREMENT_ACTIVATION — **P05 fill-in** |
| Owner / Verantwortlich | TBD (Cert-Expert Koordination sg03) |
| Date / Datum | **2026-06-05** |
| Project ID | **P05** |
| Anonymized project name | P05-NC-closure-2026 *(intern: SecuGuard)* |

---

## 0. Quick Status / Schnellstatus

| Question / Frage | Answer / Antwort |
|------------------|------------------|
| Are real quantitative pilot values already available? | **[ ] Yes** · **[x] No** · **[ ] Partly** — NC-Zähler und Tage ja; V-01–V-10 Stunden/Leadtime **nein** |
| Are projects currently measurable from now on? | **[ ] Yes** · **[ ] No** · **[x] Partly** — ab 28.05. Feststellung messbar (NC-Status, Fristen, Evidence) |
| Can a Pilot Validation Report be created now? | **[ ] Yes** · **[x] No, Data Collection Required** |
| Decision / Entscheidung | **[x] Activate measurement system** · **[ ] Rework template** · **[ ] Report later** |

**Gate (Vorlage):** NOT READY FOR PILOT VALIDATION REPORT — DATA COLLECTION REQUIRED · READY FOR PILOT MEASUREMENT ACTIVATION

---

## 1. Project Portfolio Overview / Projektportfolio-Übersicht

*Nur **P05** ausgefüllt. P01–P04: eigene FILLIN-Dateien folgen (HQ-Rollout).*

| Project ID | Type / Typ | Norms / Normen | SDLs | Service model | Start | Audit date | Main blocker | Readiness |
|------------|------------|----------------|------|---------------|-------|------------|--------------|-----------|
| P01 | *(HQ: Schutzritter — siehe FILLIN P01)* | ISO 9001, DIN 77200-1/2 | TBD | TBD | TBD | 2026-06-26 | VK-Upload | 🔴 |
| P02 | *(nicht im HQ-Rollout)* | — | — | — | TBD | TBD | — | TBD |
| P03 | *(HQ: TeamFlex)* | DIN 77200 | TBD | Continuity | TBD | 2026-06-12 | Wachbuch | 🔴 |
| P04 | *(HQ: Wolf Street)* | ISO 9001, 14001, DIN 77200 | TBD | Continuity | TBD | 2026-06-16 / 17.07. | Rechtskataster | 🔴 |
| **P05** | **Surveillance / NC closure** | **ISO 45001, ISO 14001** | **SecuGuard GmbH, Berlin (1 Standort, Post-Umzug)** | **Continuity / Ü1-Nachbearbeitung** | **2026-05-28** *(Messphase)* | **2026-05-28** *(Feststellung)* · Frist **30.06.2026** | **7 NCs offen; Ü1 unvollständig** | **🔴 Red** |

---

## 2. Project Setup Record / Projekt-Steckbrief (P05)

| Field / Feld | Input / Eingabe | Notes / Hinweise |
|--------------|-----------------|------------------|
| Project ID | **P05** | HQ Slug `SecuGuard` |
| Anonymized project name | P05-NC-closure-2026 | Kein Kundenname in externen Reports |
| Project type | **[ ] Initial cert** · **[x] Surveillance audit** · **[x] Other:** NC closure after Ü1 | |
| Norms | **[ ] ISO 9001** · **[ ] DIN 77200-1/2** · **[x] ISO 14001** · **[x] ISO 45001** | 5 Major 45001, 1 Minor je Norm |
| SDLs / Security service lines | Unternehmensweit Berlin; Verwaltungsstandort nach Umzug (m2 Umwelt) | Detail SDL-Liste: **TBD** |
| Special DIN 77200-2 scope | **n/a** (kein 77200-2 in diesem Projekt) | |
| Service model | **[ ] Documentation basis** · **[ ] Done-for-you** · **[ ] Done-with-you** · **[x] Continuity / Betreuung** | Ü1-Schließphase mit Kunde |
| Project start | **2026-05-28** | Start **Messphase** = Audit-Feststellung |
| Audit date | **2026-05-28** (Feststellung) | Schließfrist **2026-06-30** |
| Zertifizierungsstelle / Auditor | Dr. Kira Kultus (u. a.) | M4 explizit |
| Customer contact | **M. Marquardt** | M1, M2, m2 |
| Cert-Expert owner | **TBD** | sg03 Koordination |
| Pipeline (Geschäft) | **1.750 EUR** erwartet | `Cert_Expert_Einnahmen.json` |

---

## 3. Timeline Capture / Zeitpunkterfassung

*Nur Spalte **P05**. Unbekannt = TBD.*

| Timepoint / Zeitpunkt | P05 | Comment / Kommentar |
|-----------------------|-----|---------------------|
| Offer accepted / Angebot angenommen | TBD | Nicht in HQ |
| Kickoff / Projektstart | **2026-05-28** | Messphase / NC-Start |
| Forms or company list sent | TBD | |
| First client documents received | **2026-05-28** | Ü1-Abweichungsdokument vom Audit |
| Complete start dataset received | TBD | |
| Critical evidence complete | **Nein** | 0/7 NC geschlossen |
| Documents drafted / erstellt | **2026-06-03** | HQ-Import `Audit_2026.md` |
| Technical review completed | **Teilweise** | Ü1 in review, keine Verifizierung |
| Audit package ready | **n/a** | Phase = NC-Schließung, kein neues Auditpaket |
| Audit date / Audittermin | **2026-05-28** | Feststellung |
| Audit result / Auditergebnis | **7 Abweichungen offen** (5+2) | Schließung bis 30.06. |

---

## 4. Blocker and Rework Log / Blocker- und Nacharbeitslog

| ID | Project | Blocker or issue | S0 | Owner | Due | Status | Evidence ID |
|----|---------|------------------|-----|-------|-----|--------|-------------|
| B-01 | P05 | M1 Mutterschutz-Unterweisung fehlt | S0-03, S0-05 | M. Marquardt | 30.06. | **[x] Open** | EV-SG-001 |
| B-02 | P05 | M2 Beteiligung Beschäftigte — Verifizierung offen | S0-03, S0-05 | M. Marquardt | 30.06. | **[x] Open** | EV-SG-001 |
| B-03 | P05 | M3 Fasi/Arzt betriebsspezifisch + Jahresberichte | S0-03 | TBD | 30.06. | **[x] Open** | EV-SG-001 |
| B-04 | P05 | M4 Einsatzleiter-Überwachung ohne Prüfnachweis | S0-03 | TBD | 30.06. | **[x] Open** | EV-SG-001 |
| B-05 | P05 | M5 Vertrag Stichproben-Projekt fehlt | S0-03 | TBD | 30.06. | **[x] Open** | EV-SG-001 |
| B-06 | P05 | m1 Personalunterlagen Prokuristin | S0-03 | TBD | 30.06. | **[x] Open** | EV-SG-002 |
| B-07 | P05 | m2 Umwelt Basiswerte nach Umzug | S0-03 | M. Marquardt | 30.06. | **[x] Open** | EV-SG-002 |
| B-08 | P05 | Ü1-Formulare je NC unvollständig | S0-03, S0-08 | TBD / Kunde | **25.06.** | **[x] Open** | EV-SG-003 |
| B-09 | P05 | *(reserve)* | | | | [ ] Open | |
| B-10 | P05 | *(reserve)* | | | | [ ] Open | |

---

## 5. Evidence Register / Evidenzregister (P05)

| Evidence ID | To-do / Thema | S0 | Status | Source / location | Date received | Owner | Wartet auf | DFSS usable? |
|-------------|---------------|-----|--------|-------------------|---------------|-------|------------|--------------|
| **EV-SG-001** | Haupt-NCs M1–M5 | S0-03, S0-05 | **in review** | OneDrive Ü1 `.docx` | TBD | TBD | Kunde | **No** |
| **EV-SG-002** | Neben-NCs m1–m2 | S0-03 | **in review** | OneDrive Ü1 | TBD | TBD | Kunde | **No** |
| **EV-SG-003** | Ü1-Formulare je NC | S0-03, S0-08 | **in review** | OneDrive Ü1 | TBD | TBD | Kunde (M. Marquardt) | **No** |

**OneDrive:**  
`/Users/marwanmahra/Library/CloudStorage/OneDrive-Cert-Expert/Clients/SecuGuard GmbH/8_Unternehmensunterlagen/Ü1 abweichungsdokumentation_14_45_.docx`

*Weitere EV-Zeilen (DR/S0/RC/V) in Vorlage: erst bei DR-/RC-Durchlauf — **TBD**.*

---

## 6. Baseline Data Sheet / Baseline-Datenblatt (Spalte P05)

| Baseline area | Metric / observation | P05 | Evidence ID |
|---------------|---------------------|-----|-------------|
| Lead time | Days from full dataset to readiness | **TBD** *(Startdatensatz unvollständig)* | EV- |
| Client effort | Hours, interactions, open tasks | **TBD** | EV- |
| Evidence completeness | Missing critical evidence | **7 NCs + unvollständiges Ü1** | EV-SG-001/002/003 |
| Audit package | Ready / incomplete / rework | **Rework** (NC-Schließung) | EV-SG-001 |
| Audit questions | Follow-up evidence | **7 offene Punkte** | EV-SG-001 |
| Support load | Support cases / confusion | **TBD** | EV- |
| Continuity | Deadlines, ZKM, renewal | Frist **30.06.**; intern **25./28.06.** | EV-SG-003 |

---

## 7. S0 Gate Checklist / S0-Muss-Gate-Checkliste (P05)

| Gate | Status | Evidence ID | Comment |
|------|--------|-------------|---------|
| S0-01 Readiness + classified blockers | **[x] Fail** | EV-SG-001 | 7 NCs, NOT READY |
| S0-02 Scope → SDL/object/evidence/owner | **[x] Fail** | — | SDL-Detail TBD |
| S0-03 Critical evidence complete | **[x] Fail** | EV-SG-001/002/003 | 0× closure verified |
| S0-04 Technical review before release | **[ ] TBD** | — | Ü1 nicht freigegeben |
| S0-05 Tasks with owner/due/impact | **[x] Fail** | EV-SG-001 | viele Owner TBD |
| S0-06 External partners path | **[ ] TBD** | — | Fasi/Arzt in M3 |
| S0-07 SDL/object file minimum | **[x] Fail** | EV-SG-001 | Nachweise fehlen |
| S0-08 Version / review / renewal | **[x] Fail** | EV-SG-003 | Ü1-Formulare offen |

---

## 8. Readiness Status / Audit-Readiness-Ampel (P05)

| Project | Green | Yellow | Red | Reason | Next critical action |
|---------|-------|--------|-----|--------|----------------------|
| P05 | [ ] | [ ] | **[x]** | 7 NCs offen; 0 % Schließung; S0 Fail | EV-SG-001 — Maßnahmenplan M1–M5 |

---

## 9. Pilot Data Collection V-01 to V-10 (P05)

| V-ID | Value or observation | Evidence ID | Status |
|------|---------------------|-------------|--------|
| V-01 Days start dataset → readiness | TBD | EV- | **[x] Open** |
| V-02 Days before audit → package ready | **n/a** (closure phase) | — | **TBD** |
| V-03 Client effort by service model | TBD | EV- | **[x] Open** |
| V-04 Audit-readiness gaps by severity | **5 Major + 2 Minor** offen | EV-SG-001 | **[x] Captured** *(count only)* |
| V-05 Segment fit documentation basis | TBD | EV- | **[x] Open** |
| V-06 CEKS/knowledge coverage | TBD | EV- | **[x] Open** |
| V-07 Auditor/expert review package | Ü1 importiert, **Verifizierung ausstehend** | EV-SG-003 | **[ ] Partly** |
| V-08 SDL/object file completeness | **Unvollständig** | EV-SG-001 | **[x] Captured** |
| V-09 Continuity ZKM/deadlines | Frist 30.06.; Tage seit Audit **8** | EV-SG-003 | **[x] Captured** |
| V-10 Reverse factors | TBD (Umzug, Querschnitt) | EV- | **[x] Open** |

---

## 10. DR Execution Log DR-01 to DR-24

**Status P05:** *[ ] Not started in Schwung 1* — bei täglicher Arbeit DR-Bezug zu To-dos ergänzen.

| Comment |
|---------|
| Nächster Schritt: DRs aus Vorlage mit sg01–sg08 und NC-Maßnahmen verknüpfen (Schwung 2). |

---

## 11. Reverse Constraint Test RC-01 to RC-10

**Status P05:** *[ ] Not started* — Kandidaten: Umzug (m2), Überforderung Querschnitt (M1–M5), falsches Modell **TBD**.

---

## 12. Auditor / Expert Review Record

| Field | P05 |
|-------|-----|
| Review type | Ü1 Abweichungsdokumentation post-audit |
| Date | **2026-05-28** |
| Reviewer | Dr. Kira Kultus (Feststellung) |
| Result | **7 NCs** — keine Schließung verifiziert |
| Evidence matrix | EV-SG-001, EV-SG-002, EV-SG-003 |
| M2 note | Korrektur vom Auditor **akzeptiert**, **Verifizierung offen** |

---

## 13. Data Quality Memo / Datenqualitätsmemo

| Topic | P05 |
|-------|-----|
| Source | HQ Kundenakte + OneDrive Ü1 (nicht Volltext im Repo) |
| Invented data? | **Nein** — nur dokumentierte Fakten |
| Gaps | Keine Stunden/Zähler V-01–V-03; Owner intern TBD |
| Next capture | Stunden Kunde/CE bei sg03-Meetings; erste NC-Schließung → `DFSS usable: Yes` |

---

## 14. Calibration Memo / Kalibrierungsmemo

**Status:** TBD — nach erstem geschlossenen NC und Abgleich mit Auditor.

---

## 15. Gate Decision Record / Gate-Entscheidungsprotokoll

| Gate question | Decision | Evidence | Comment |
|---------------|----------|----------|---------|
| Pilot Validation Report allowed now? | **[x] No** | EV-SG-001 | 0/7 NC closed |
| S0 gates sufficiently evidenced? | **[x] No** | §7 | Mehrheit Fail |
| Reverse constraints tested? | **[x] No** | — | RC offen |
| Data quality acceptable? | **[ ] Partly** | §13 | Struktur ja, V-Werte nein |
| **Overall** | **[x] DATA COLLECTION REQUIRED** | — | Messsystem aktiv, Report später |

---

## 16. Status Values — angewendet auf P05

| Value | Wo |
|-------|-----|
| **Fail** | S0-01, 02, 03, 05, 07, 08 |
| **TBD** | S0-04, 06; V-01, 02, 03, 05, 06, 10 |
| **Red** | Readiness §8 |
| **Pass** | — *(noch keiner)* |

---

## Nächste Schritte (tägliche Arbeit → Vorlage)

1. **Word:** Ausgefüllte Datei oben prüfen; bei HQ-Änderungen Skript erneut laufen.  
2. **Bei Fortschritt:** NC geschlossen → B-0x auf Closed, Baseline + V-04/V-08 aktualisieren.  
3. **Owner sg03** in HQ + hier eintragen.  
4. **Schwung 2:** DR-01–24 und RC-01–10 mindestens für P05 skizzieren.  
5. **Andere Piloten:** [`FILLIN_TEMPLATE_LEER.md`](FILLIN_TEMPLATE_LEER.md) kopieren → P01, P03, P04.

---

*Erstellt aus Vorlage V1.0 + HQ Stand 2026-06-05. Bei Abweichung gilt Kundenakte `03_Kundenprojekte/SecuGuard/`.*
