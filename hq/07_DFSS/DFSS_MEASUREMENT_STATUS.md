# DFSS Measurement Status – Cert-Expert HQ

> **Abgeleitete Übersicht / Lookup** — nicht Source of Truth.  
> Maßgeblich: `hq/03_Kundenprojekte/{Kunde}/Status.md` und `ToDos.md`.

**Status:** Pilot Measurement Activation  
**Gate:** NOT READY FOR PILOT VALIDATION REPORT — DATA COLLECTION REQUIRED  
**Stand:** 2026-06-03 (HQ-Referenzstand; Evidence Hygiene Phase 2A — alle vier Rollout-Kunden)  
**Source of Truth:** Kundencontainer in `hq/03_Kundenprojekte/`

---

## 1. Portfolio Quick Status

| Kunde | P-ID | DFSS Relevance | Readiness | S0 blocker present | Main blocker | Next critical action |
|---|---|---|---|---|---|---|
| TeamFlex | P03 provisional | Pilot / Baseline | NOT READY — audit-critical gaps open | Yes | Wachbuchauszug fehlt; Monatsplan/-bericht ausstehend; Projektordner offen; Zusatzbeauftragung DIN 77200 | EV-TF-003 Wachbuchauszug nachfassen (Prio 1; siehe Evidence action priority) |
| Schutzritter | P-LIVE-SR-01 + P01 operativ | **Live O2C parallel** (blockiert Design nicht) | Messung läuft — VK/Formulare offen | Yes | VK-Upload; Formular-Kette | Live-Messung: [`LIVE_MESSUNG_INDEX.md`](LIVE_MESSUNG_INDEX.md) |
| Wolf Street | P04 provisional | Pilot / Baseline | NOT READY — Phase 1 audit-critical gaps open | Yes | Rechtskataster / Umweltkennzahlen / KPI ISO 14001; Managementbewertung vor 16.06. | EV-WS-001 Rechtskataster (Prio 1) |
| SecuGuard | P05 provisional (NC closure) | Pilot / Baseline (NC closure) | NOT READY — 5 Haupt- + 2 Nebenabweichungen offen | Yes | NC-Schließung bis 30.06.; Querschnittsthemen in Bearbeitung | EV-SG-001 Hauptabweichungen M1–M5 (Prio 1) |

**Live O2C parallel (nicht blockierend):** Checkpoint Regional **P-LIVE-CR-01** — [`LIVE_MESSUNG_INDEX.md`](LIVE_MESSUNG_INDEX.md)

**Nicht im schweren DFSS-Rollout:** ZT Security, LC Security/ELC — kein `## DFSS / Pilot Measurement`-Block in der Tagesliste.

**Historical archive (DFSS Measure/Analyze — nicht Tagesarbeit):**

| P-ID | Kunde | Master | Gate | Index |
|------|-------|--------|------|-------|
| P-HIST-SC-01 | TeamFlex Fast-Track | `DFSS_PILOT_MEASUREMENT_ACTIVATION_P_HIST_SC_01_TEAMFLEX_FASTTRACK_FILLED_2026-06-05.docx` | ACCEPT special-cause | [`DFSS_HISTORICAL_INDEX.md`](DFSS_HISTORICAL_INDEX.md) |
| P-HIST-01 | LC Security (ELC) | `DFSS_PILOT_MEASUREMENT_ACTIVATION_P_HIST_01_LC_SECURITY_FILLED_2026-06-05.docx` | ACCEPT with controls | [`DFSS_HISTORICAL_INDEX.md`](DFSS_HISTORICAL_INDEX.md) |
| P-HIST-02 | LC Security Extension | `DFSS_PILOT_MEASUREMENT_ACTIVATION_P_HIST_02_LC_SECURITY_EXTENSION_FILLED_2026-06-05.docx` | ACCEPT delta-audit / Tool 2 | [`DFSS_HISTORICAL_INDEX.md`](DFSS_HISTORICAL_INDEX.md) |

---

## 2. S0 Blocker Overview

| S0 | Bedeutung | Vorkommen / Evidence IDs |
|---|---|---|
| S0-01 | Readiness / klassifizierte Blocker | EV-WS-005 (ws07); EV-SR-005 (sr05) |
| S0-02 | Scope nicht SDL/Objekt/Nachweis/Owner zugeordnet | EV-TF-006 (tf08 — Leistungsorte) |
| S0-03 | Kritische Nachweise fehlen | EV-TF-001, EV-TF-003, EV-TF-004, EV-TF-008; EV-WS-001–004; EV-SR-001–003; EV-SG-001–003 (teils kombiniert mit anderen S0) |
| S0-04 | Kritische Dokumente/Scope ohne Fachreview | *(noch nicht vergeben)* |
| S0-05 | Aufgabe ohne Owner/Frist/Zweck/Auditwirkung | EV-TF-001; EV-WS-001, EV-WS-005; EV-SR-001; EV-SG-001 |
| S0-06 | Externe Pflichtpartner ohne Beschaffungspfad | EV-SR-002 (sr07); EV-SR-003 (sr08) |
| S0-07 | SDL-/Objektakte unvollständig | EV-TF-005, EV-TF-006, EV-TF-007; EV-SR-004 |
| S0-08 | Version/Freigabe/Fachreview/Renewal | EV-TF-002, EV-TF-007; EV-WS-004; EV-SR-004; EV-SG-003 |

**Projekt-Ebene:** alle vier Rollout-Kunden → `S0 blocker present: Yes` (inferred).

---

## 3. Evidence Lookup

| Evidence ID | Kunde | To-do / Thema | S0 relation | Evidence status | DFSS usable | Owner | Wartet auf | Due date | Audit impact | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| EV-TF-001 | TeamFlex | Zusatzbeauftragung DIN 77200 (tf02) | S0-03, S0-05 | missing | No | TBD | Kunde | 2026-06-11 | Scope-/Vertragsnachweis DIN 77200 unvollständig | open |
| EV-TF-002 | TeamFlex | ADA Stand prüfen / erstellen (tf04) | S0-08 | internal to create | No | TBD | TBD | 2026-06-11 | Dienstanweisung — Prüfpunkt Audit-Checkliste | open |
| EV-TF-003 | TeamFlex | Wachbuchauszug einfordern (tf05) | S0-03 | requested | No | TBD | Kunde | 2026-06-11 | Betriebsdokumentation (Wachbuch) fehlt | open |
| EV-TF-004 | TeamFlex | Monatsplan einholen (tf06) | S0-03 | missing | No | TBD | Kunde | 2026-06-11 | Monatsplan als Betriebs-/Planungsnachweis offen | open |
| EV-TF-005 | TeamFlex | Projektordner DEKRA fertigstellen (tf07) | S0-07 | internal to create | No | TBD | Intern (Cert-Expert) | 2026-06-11 | DEKRA-/Auditmappe nicht auditfähig | open |
| EV-TF-006 | TeamFlex | Leistungsorte dokumentieren (tf08) | S0-02, S0-07 | missing | No | TBD | TBD | 2026-06-11 | Leistungsorte / Scope-Dokumentation offen | open |
| EV-TF-007 | TeamFlex | Personalakten / Schulung Stichprobe (tf09) | S0-07, S0-08 | missing | No | TBD | TBD | 2026-06-11 | Personalakten / Schulungsnachweise — Stichprobe | open |
| EV-TF-008 | TeamFlex | Monatsbericht einholen (tf10) | S0-03 | missing | No | TBD | Kunde | 2026-06-11 | Monatsbericht als Betriebsnachweis offen | open |
| EV-WS-001 | Wolf Street | Rechtskataster (ws03) | S0-03, S0-05 | missing | No | TBD | TBD | 2026-06-14 | Rechtskataster — Phase 1 ISO 9001 / 14001 | open |
| EV-WS-002 | Wolf Street | Umweltkennzahlen ISO 14001 (ws04) | S0-03 | missing | No | TBD | TBD | 2026-06-14 | Umweltkennzahlen — Nachweis vor Audit 16.06. | open |
| EV-WS-003 | Wolf Street | KPI-Liste ISO 14001 (ws05) | S0-03 | missing | No | TBD | TBD | 2026-06-14 | KPI-Liste — Voraussetzung Managementbewertung | open |
| EV-WS-004 | Wolf Street | Managementbewertung (ws06) | S0-03, S0-08 | missing | No | TBD | TBD | 2026-06-15 | Managementbewertung — Pflichtnachweis Phase 1 | open |
| EV-WS-005 | Wolf Street | Auditvorbereitung gesamt (ws07) | S0-01, S0-05 | internal to create | No | TBD | TBD | 2026-06-15 | Gesamt-Auditvorbereitung Phase 1 + Phase 2 | open |
| EV-SR-001 | Schutzritter | VK-Datei uploaden (sr06) | S0-03, S0-05 | missing | No | TBD | Intern (Cert-Expert) | 2026-06-04 | VK-Datei fehlt — Blocker kritischer Pfad | open |
| EV-SR-002 | Schutzritter | Unternehmensformulare prüfen (sr07) | S0-03, S0-06 | missing | No | TBD | Kunde | 2026-06-05 | Unternehmensformulare — Basisnachweis | open |
| EV-SR-003 | Schutzritter | Mitarbeiterformulare senden (sr08) | S0-03, S0-06 | missing | No | TBD | Intern (Cert-Expert) | 2026-06-07 | MA-Formulare — Voraussetzung Personalnachweis | open |
| EV-SR-004 | Schutzritter | Personalakten prüfen (sr04) | S0-07, S0-08 | missing | No | TBD | Kunde | 2026-06-20 | Personalakten — Stichprobe Audit-Checkliste | open |
| EV-SR-005 | Schutzritter | Audit-Checkliste abarbeiten (sr05) | S0-01 | internal to create | No | TBD | TBD | 2026-06-24 | Audit-Checkliste ISO 9001 + DIN 77200-1/2 | open |
| EV-SG-001 | SecuGuard | Hauptabweichungen M1–M5 (sg01) | S0-03, S0-05 | in review | No | TBD | Kunde | 2026-06-28 | 5 Hauptabweichungen ISO 45001 — Schließung bis 30.06. | open |
| EV-SG-002 | SecuGuard | Nebenabweichungen m1–m2 (sg02) | S0-03 | in review | No | TBD | Kunde | 2026-06-28 | 2 Nebenabweichungen — Schließung bis 30.06. | open |
| EV-SG-003 | SecuGuard | Ü1-Formulare je NC (sg03) | S0-03, S0-08 | in review | No | TBD | Kunde (M. Marquardt) | 2026-06-25 | Ü1-Formulare — Nachweisdokumentation Verifizierung | open |

**Evidence IDs gesamt:** 21 (auditkritische To-dos in Rollout-Kunden).  
**Detailregister:** TeamFlex · Wolf Street · Schutzritter · SecuGuard — jeweils `Dokumente_und_Nachweise.md` § DFSS Evidence Register + Evidence action priority.

---

## 4. Missing Pilot Data

### Quantitative / DFSS report data

- Keine echten Pilotwerte / Baseline-KPIs gepflegt.
- Keine kalibrierten Metriken pro P-ID.
- Kein Pilot Validation Report.
- Keine Zielwerte.

### Missing container fields

- **SDLs:** TBD (alle vier Rollout-Kunden)
- **Service model:** TBD (alle vier Rollout-Kunden)
- **Project start:** TBD (alle vier Rollout-Kunden)
- **Owner:** TBD bei allen 21 auditkritischen To-dos
- **Wartet auf:** TBD bei Wolf Street ws03–ws07; Schutzritter sr05; TeamFlex tf04, tf08, tf09
- **Formale P01–P05 Registry:** fehlt (P-IDs provisional)

### Operational evidence still needed

- **TeamFlex:** 8 EV-IDs — 0× present, 0× DFSS usable: Yes  
- **Wolf Street:** 5 EV-IDs — 0× present, 0× DFSS usable: Yes  
- **Schutzritter:** 5 EV-IDs — 0× present, 0× DFSS usable: Yes  
- **SecuGuard:** 3 EV-IDs — Ü1 in review, Schließnachweise offen, 0× DFSS usable: Yes
- Nachweise hinter EV-IDs müssen sukzessive gesammelt werden (Wachbuch, VK, NC-Schließung, KPI 14001, …).
- Wolf Street Phase 2 / DIN 77200 **17.07.2026** — in `Audit_2026.md` noch nicht detailliert befüllt.
- Schutzritter **sr01–sr03** (SK/EK/Referenzprojekt) — ohne Evidence IDs (nicht als auditkritisch markiert).
- Wolf Street **ws08** (Folgeangebot Vertrieb) — ohne Evidence ID (nicht auditkritisch).

---

## 5. Next DFSS Actions

| ID | Action | Owner | Status |
|---|---|---|---|
| dfss01 | KPI/Metriken pro Kunde definieren (siehe `Pilot_Measurement_Juni_2026.md`) | TBD | Open |
| dfss02 | Formale P01–P05 Registry anlegen | TBD | Open |
| dfss03 | Evidence-Nachweise hinter EV-IDs sammeln | TBD | Open — Register für alle 4 Rollout-Kunden (21 EV-IDs, 0× usable Yes) |
| dfss04 | Pilot/Baseline-Messwerte erfassen (nur echte Werte, keine Schätzungen) | TBD | Open |

---

## Verknüpfung

- TeamFlex: [`../03_Kundenprojekte/TeamFlex/Status.md`](../03_Kundenprojekte/TeamFlex/Status.md)
- Schutzritter: [`../03_Kundenprojekte/Schutzritter/Status.md`](../03_Kundenprojekte/Schutzritter/Status.md)
- Wolf Street: [`../03_Kundenprojekte/Wolf_Street/Status.md`](../03_Kundenprojekte/Wolf_Street/Status.md)
- SecuGuard: [`../03_Kundenprojekte/SecuGuard/Status.md`](../03_Kundenprojekte/SecuGuard/Status.md)
- Internes To-do: [`Pilot_Measurement_Juni_2026.md`](Pilot_Measurement_Juni_2026.md)
