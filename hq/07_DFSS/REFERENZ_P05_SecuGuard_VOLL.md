# DFSS Referenz-Export — P05 SecuGuard (vollständig befüllt)

**Zweck:** Erster **kompletter Pilot-Container** zum Anschauen, für Board, Z-Expert-Tool, Website und DFSS-Vorlage P01–P05.  
**Stand:** 2026-06-05  
**Status:** Inhalt aus HQ zusammengeführt — **operativ noch offen** (7 NCs, 0× DFSS-usable Evidence).  
**Quellen:** `03_Kundenprojekte/SecuGuard/*`, `05_Forderungen/Cert_Expert_Einnahmen.json`, `07_DFSS/DFSS_MEASUREMENT_STATUS.md`

> **Ehrlichkeit:** „Vollständig“ bezieht sich auf **Struktur + dokumentierte Fakten + KPI-Rohwerte**. Geschlossene Nachweise und `DFSS usable: Yes` kommen erst nach NC-Schließung und Verifizierung durch Auditor.

---

## 1. Identität & Verwendung

| Feld | Wert |
|------|------|
| **DFSS Project ID** | P05 |
| **HQ Slug** | `SecuGuard` |
| **Rechtlicher Name** | SecuGuard GmbH |
| **Standort** | Berlin |
| **DFSS Relevance** | Pilot / Baseline (NC closure) |
| **Project type** | Schließung Haupt- und Nebenabweichungen nach Ü1 |
| **Normen** | ISO 45001 (5 Haupt, 1 Neben), ISO 14001 (1 Neben) |
| **Zertifizierungskontext** | Ü1 Abweichungsdokumentation — Schließung |
| **Ampel HQ** | 🔴 |
| **Readiness** | NOT READY — 5 Haupt- + 2 Nebenabweichungen offen |
| **S0 blocker present** | Yes |
| **Nächste kritische Aktion** | EV-SG-001 — Hauptabweichungen M1–M5 (Maßnahmenplan je Punkt) |

### Verwendung (Board / Tool / Website)

| Kanal | Was aus diesem Dokument |
|--------|-------------------------|
| **Board** | KPI-Zeile P05, Frist 30.06., 7 offene NCs, Ampel rot |
| **Z-Expert-Tool** | JSON-Block § 10 (Maschinenlesbar) |
| **Website** | Nur **freigegebene** Kurzfassung (Kunde, Norm, Frist) — keine internen NC-Texte ohne Freigabe |
| **DFSS Registry** | Vorlage für formale P01–P05-Anlage (dfss02) |

---

## 2. Zeitachse (Vergangenheit → Gegenwart → Frist)

| Datum | Ereignis | Quelle |
|-------|----------|--------|
| **28.05.2026** | Audit / Feststellung — **7 Abweichungen** (5 Haupt, 2 Neben) | `Audit_2026.md`, Ü1-Dokument |
| **03.06.2026** | HQ-Import Ü1 + Master Dump; NC-Matrix in `Audit_2026.md` | `Kommunikation.md` |
| **04.06.2026** | To-dos M1–M5 / m1–m2 einzeln im Dashboard | `ToDos.md` |
| **25.06.2026** | Internes Ziel: Ü1-Formulare je NC vervollständigt (sg03) | `ToDos.md` EV-SG-003 |
| **28.06.2026** | Internes Ziel: Haupt- + Neben-NCs geschlossen (sg01/sg02) | `Status.md` |
| **30.06.2026** | **Frist** Nachweis Schließung / Freigabe (alle NCs) | `Status.md`, Ü1 |

**Berechnet (Stand 2026-06-05):**

| Metrik | Wert |
|--------|------|
| Tage seit Audit | **8** (28.05. → 05.06.) |
| Tage bis Frist | **25** (05.06. → 30.06.) |
| Kalenderwoche Audit | KW 22 / 2026 |
| Kalenderwoche Frist | Ende KW 26 / 2026 |

---

## 3. DFSS-Container (alle Pflichtfelder)

| Feld | Wert | Hinweis |
|------|------|---------|
| **SDLs** | SecuGuard GmbH — Standort Berlin (ein Unternehmen, Verwaltungsstandort nach Umzug in Befunden) | vorher TBD — aus Audit-Text abgeleitet |
| **Service model** | NC closure / Ü1-Nachbearbeitung mit Kunde | |
| **Project start** | **2026-05-28** (Audit-Feststellung = Start Messphase) | vorher TBD |
| **Audit date (Feststellung)** | **2026-05-28** | |
| **Closure deadline** | **2026-06-30** | |
| **Auditor/in** | Dr. Kira Kultus (u. a.; M4 explizit) | |
| **Kunden-Ansprechpartner** | **M. Marquardt** (M1, M2, m2) | |
| **Cert-Expert Owner (intern)** | TBD — sg03 Koordination | |
| **Evidence IDs** | EV-SG-001, EV-SG-002, EV-SG-003 | |
| **DFSS usable (Evidence)** | **0 von 3** → No | bis Schließnachweis |

---

## 4. Messwerte & KPIs (echte Zahlen aus HQ)

### 4.1 Audit / NC (Baseline Pilot)

| KPI-ID | Bezeichnung | Wert | Einheit | Stand |
|--------|-------------|------|-------|-------|
| `nc_major_open` | Offene Hauptabweichungen | **5** | Stück | 05.06.2026 |
| `nc_minor_open` | Offene Nebenabweichungen | **2** | Stück | 05.06.2026 |
| `nc_total_open` | Offene Abweichungen gesamt | **7** | Stück | 05.06.2026 |
| `nc_major_closed` | Geschlossene Hauptabweichungen | **0** | Stück | 05.06.2026 |
| `nc_minor_closed` | Geschlossene Nebenabweichungen | **0** | Stück | 05.06.2026 |
| `nc_closure_rate` | Schließungsquote | **0 %** | % | 0/7 |
| `days_since_audit` | Tage seit Feststellung | **8** | Tage | berechnet |
| `days_to_deadline` | Tage bis Frist | **25** | Tage | berechnet |

### 4.2 Evidence / DFSS Hygiene

| KPI-ID | Bezeichnung | Wert |
|--------|-------------|------|
| `evidence_ids_count` | Evidence-IDs (Rollout) | **3** |
| `evidence_in_review` | Status „in review“ | **3** |
| `evidence_present` | Nachweis vorhanden (auditfähig) | **0** |
| `evidence_dfss_usable_yes` | DFSS usable = Yes | **0** |
| `todos_open_audit` | Offene Audit-To-dos | **9** (sg01–sg08, inkl. Einzel-M + sg03) |
| `s0_blocker` | S0-Blocker aktiv | **Yes** |

### 4.3 Geschäft (Querschnitt — aus Finanz-Pipeline)

| KPI-ID | Bezeichnung | Wert | Quelle |
|--------|-------------|------|--------|
| `pipeline_amount_eur` | Erwartete Zahlung | **1.750** | `Cert_Expert_Einnahmen.json` |
| `pipeline_status` | Status Pipeline | **Erwartet** | §1 Finanz_Arbeitsgrundlage |
| `pipeline_hq_ref` | HQ-Pfad | `03_Kundenprojekte/SecuGuard/` | |

*(Monatliche Fixkosten Cert Expert sind **nicht** kundenspezifisch zugeordnet — bewusst nicht in P05-KPIs gemischt.)*

---

## 5. Abweichungsregister (vollständiger Inhalt)

Quelle: [`../03_Kundenprojekte/SecuGuard/Audit_2026.md`](../03_Kundenprojekte/SecuGuard/Audit_2026.md)

| ID | Typ | Norm | Abschnitt | Kurzthema | Verantwortlich (Kunde) | Frist | Status HQ |
|----|-----|------|-----------|-----------|------------------------|-------|-----------|
| **M1** | Haupt | ISO 45001 | 8.1.2 | Mutterschutz — arbeitsplatzbezogene Unterweisung fehlt | M. Marquardt | 30.06.2026 | offen |
| **M2** | Haupt | ISO 45001 | 5.4 | Konsultation / Beteiligung Beschäftigte — kein Nachweis | M. Marquardt | 30.06.2026 | offen — Korrektur vom Auditor **akzeptiert**, **Verifizierung** offen |
| **M3** | Haupt | ISO 45001 | 6.1.4 | Fasi/Arzt — Grund- und betriebsspezifische Betreuung fehlt; keine Jahresberichte; § 6 DGUV V2 | *(Formular leer)* | 30.06.2026 | offen |
| **M4** | Haupt | ISO 45001 | 9.1 | Einsatzleiter-Überwachung — nur Anwesenheit/Wachbuch, keine Prüfnachweise | *(Formular leer)* | 30.06.2026 | offen |
| **M5** | Haupt | ISO 45001 | 8.1.1 | Vertrag für geprüftes Projekt (Stichprobe) nicht vorgelegt | *(Formular leer)* | 30.06.2026 | offen |
| **m1** | Neben | ISO 45001 | 7.2 | Personalunterlagen Prokuristin fehlen | — | 30.06.2026 | offen |
| **m2** | Neben | ISO 14001 | 10.3 | Umwelt — Basiswerte nach Umzug in Erfassung; keine Nachweise Verbesserung | M. Marquardt | 30.06.2026 | offen |

### Befund-Details (für Tool/Website — intern)

**M1 — Mutterschutz:** Keine arbeitsplatzbezogene Unterweisung; einmalige Unterweisung nicht nachweisbar.  
**M2 — Beteiligung:** Kein Nachweis Konsultation/Beteiligung; Maßnahmenplan im Ü1 noch auszufüllen.  
**M3 — Fasi/Arzt:** Beauftragungen vorhanden, betriebsspezifische Betreuung fehlt (neuer Verwaltungsstandort); Jahresberichte fehlen.  
**M4 — Einsatzleiter:** Keine Nachweise Prüfung DA, GBU, Umweltvorgaben.  
**M5 — Vertrag:** Stichproben-Projekt ohne Vertrag.  
**m1 — Kompetenz:** Keine Personalunterlagen Prokuristin.  
**m2 — Umwelt:** Nach Umzug Basiswerte in Erfassung; fortlaufende Verbesserung nicht belegt.

---

## 6. Evidence Register (vollständig)

| Evidence ID | Thema | S0 | Status | Quelle / Pfad | Owner | Wartet auf | Frist EV | DFSS usable |
|-------------|-------|-----|--------|---------------|-------|------------|----------|-------------|
| EV-SG-001 | M1–M5 Haupt-NCs | S0-03, S0-05 | in review | OneDrive: `Clients/SecuGuard GmbH/8_Unternehmensunterlagen/Ü1 abweichungsdokumentation_14_45_.docx` | TBD | Kunde | 2026-06-28 | **No** |
| EV-SG-002 | m1–m2 Neben-NCs | S0-03 | in review | gleiches Ü1-Dokument | TBD | Kunde | 2026-06-28 | **No** |
| EV-SG-003 | Ü1-Formulare je NC | S0-03, S0-08 | in review | gleiches Ü1-Dokument | TBD | Kunde (M. Marquardt) | 2026-06-25 | **No** |

**OneDrive (Vollpfad lokal):**  
`/Users/marwanmahra/Library/CloudStorage/OneDrive-Cert-Expert/Clients/SecuGuard GmbH/8_Unternehmensunterlagen/Ü1 abweichungsdokumentation_14_45_.docx`

---

## 7. To-do-Mapping (HQ ↔ NC)

| To-do ID | NC | Aufgabe | Owner | Frist | Evidence |
|----------|-----|---------|-------|-------|----------|
| sg01 | M1 | Mutterschutz-Unterweisung nachweisen | Kunde (M. Marquardt) | 30.06. | EV-SG-001 |
| sg04 | M2 | Beteiligung Beschäftigte | Kunde (M. Marquardt) | 30.06. | EV-SG-001 |
| sg05 | M3 | Fasi/Betriebsarzt + Jahresberichte | Kunde | 30.06. | EV-SG-001 |
| sg06 | M4 | Einsatzleiter-Überwachung | Kunde | 30.06. | EV-SG-001 |
| sg07 | M5 | Vertrag Stichproben-Projekt | Kunde | 30.06. | EV-SG-001 |
| sg02 | m1 | Personalunterlagen Prokuristin | Kunde | 30.06. | EV-SG-002 |
| sg08 | m2 | Umwelt Basiswerte / Verbesserung | Kunde (M. Marquardt) | 30.06. | EV-SG-002 |
| sg03 | alle | Ü1-Formulare vervollständigen | TBD | **25.06.** | EV-SG-003 |

---

## 8. Querschnittsthemen (aus Dump + Audit)

| Thema | NC-Bezug | Status |
|-------|----------|--------|
| Mutterschutz | M1 | offen |
| Worker participation / Beteiligung | M2 | offen |
| FASI / Betriebsarzt | M3 | offen |
| Supervisor controls / Einsatzleiter | M4 | offen |
| Vertrag / Projektnachweis | M5 | offen |
| Personal Prokuristin | m1 | offen |
| Umwelt nach Umzug | m2 | offen |

---

## 9. Was fehlt für „grün“ (Pilot Validation Report)

- [ ] Mindestens **1 NC** mit Nachweis + Auditor-Verifizierung → dann `DFSS usable: Yes` für betroffene EV-ID
- [ ] Ü1 vollständig (Korrektur, Ursache, Maßnahme, Anlagen) je Punkt
- [ ] Owner intern (Cert-Expert) für sg03 und Gesamtkoordination
- [ ] Nach Frist 30.06.: Ergebnis in `Audit_2026.md` § Nach Frist
- [ ] Optional: historische KPI **vor** Audit (z. B. Vorjahres-NC-Anzahl) — **nicht in HQ**; nur aus Lexware/Kundenakte nachziehen

---

## 10. JSON-Export (Z-Expert-Tool / API)

Datei: [`referenz_p05_secuguard.json`](referenz_p05_secuguard.json)

---

## 11. Verknüpfungen HQ

| Datei | Rolle |
|-------|--------|
| [`../03_Kundenprojekte/SecuGuard/Status.md`](../03_Kundenprojekte/SecuGuard/Status.md) | Source of Truth Status |
| [`../03_Kundenprojekte/SecuGuard/Audit_2026.md`](../03_Kundenprojekte/SecuGuard/Audit_2026.md) | NC-Volltext |
| [`../03_Kundenprojekte/SecuGuard/ToDos.md`](../03_Kundenprojekte/SecuGuard/ToDos.md) | Aufgaben |
| [`../03_Kundenprojekte/SecuGuard/Dokumente_und_Nachweise.md`](../03_Kundenprojekte/SecuGuard/Dokumente_und_Nachweise.md) | Evidence Register |
| [`DFSS_MEASUREMENT_STATUS.md`](DFSS_MEASUREMENT_STATUS.md) | Portfolio-Lookup |
| [`DFSS_ARBEIT.md`](DFSS_ARBEIT.md) | Laufende DFSS-Arbeit |

---

*Dieses Dokument ist der erste **Referenz-Export** mit Inhalt. Bei Schließung der NCs: KPI `nc_*_closed` und `evidence_dfss_usable_yes` aktualisieren, dann als Vorlage für P01–P04 nutzen.*
