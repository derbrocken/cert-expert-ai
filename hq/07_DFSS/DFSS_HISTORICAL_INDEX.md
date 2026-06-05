# DFSS — Historical Measurement Archive

**Stand:** 2026-06-05  
**Zweck:** Abgeschlossene / historische DFSS-Messfälle **aufnehmen**, nicht Tagesarbeit. Output wird später mit dem DFSS-Projekt (u. a. mit Chet Chibitie) und Design-Guidelines **zusammengeführt**.  
**Status:** Archiv — **kein** aktiver Rollout, **keine** neuen HQ-To-dos aus diesen Dateien.

---

## Registry

| P-ID | Kunde | Typ | Master (Word) | JSON | Gate |
|------|-------|-----|---------------|------|------|
| **P-HIST-SC-01** | TeamFlex Solution GmbH | Special Cause / Fast-Track DIN 77200 | [`DFSS_PILOT_MEASUREMENT_ACTIVATION_P_HIST_SC_01_TEAMFLEX_FASTTRACK_FILLED_2026-06-05.docx`](DFSS_PILOT_MEASUREMENT_ACTIVATION_P_HIST_SC_01_TEAMFLEX_FASTTRACK_FILLED_2026-06-05.docx) | [`referenz_p_hist_sc_01_teamflex.json`](referenz_p_hist_sc_01_teamflex.json) | **ACCEPT** — Special-cause input only (not standard lead-time baseline) |
| **P-HIST-01** | LC Security & Service *(HQ-Slug: `LC_Security` / Kunde ELC)* | Historical Erstzertifizierung ISO 9001 + DIN 77200 | [`DFSS_PILOT_MEASUREMENT_ACTIVATION_P_HIST_01_LC_SECURITY_FILLED_2026-06-05.docx`](DFSS_PILOT_MEASUREMENT_ACTIVATION_P_HIST_01_LC_SECURITY_FILLED_2026-06-05.docx) | [`referenz_p_hist_01_lc_security.json`](referenz_p_hist_01_lc_security.json) | **ACCEPT WITH CONTROLS** — historical baseline |
| **P-HIST-02** | LC Security & Service *(gleicher Kunde)* | Delta-Audit / SDL-Erweiterung Veranstaltung | [`DFSS_PILOT_MEASUREMENT_ACTIVATION_P_HIST_02_LC_SECURITY_EXTENSION_FILLED_2026-06-05.docx`](DFSS_PILOT_MEASUREMENT_ACTIVATION_P_HIST_02_LC_SECURITY_EXTENSION_FILLED_2026-06-05.docx) | [`referenz_p_hist_02_lc_security_extension.json`](referenz_p_hist_02_lc_security_extension.json) | **ACCEPT** — delta-audit / Tool-2-transition input |

**Live pilot (separat):** P05 SecuGuard — [`DFSS_PILOT_MEASUREMENT_ACTIVATION_P05_SecuGuard_UPDATED_2026-06-05.docx`](DFSS_PILOT_MEASUREMENT_ACTIVATION_P05_SecuGuard_UPDATED_2026-06-05.docx)

---

## P-HIST-SC-01 — TeamFlex Fast-Track (Kurz)

| Feld | Wert |
|------|------|
| Normen | DIN 77200-1/-2; ISO 9001 via Gruppe/Multi-Site |
| KSA | 2025-05-27 |
| Audit | 2025-06-05/06; **1,375 Tage** (8h vor Ort + 3h remote) |
| Mitarbeiter | 282 gesamt; **8 DIN-relevant** |
| Service model | Emergency / fast-track done-for-you |
| Haupttreiber | Zeitdruck, DEKRA Fast-Track, enger SDL-Scope, tägliche Calls |
| DFSS-Nutzung | Fast-Track-Gates, Reverse Constraints — **nicht** normale Lead-Time-Kalibrierung |
| Evidence IDs | EV-TF-SC-001 … EV-TF-SC-004 (+ EST estimates) |

**Abgrenzung:** Nicht verwechseln mit **P03 TeamFlex** (live Überwachungsaudit 12.06.2026) — anderer Zeitkontext und anderer Messzweck.

---

## P-HIST-01 — LC Security (Kurz)

| Feld | Wert |
|------|------|
| Normen | ISO 9001 + DIN 77200-1/-2 |
| Start / Audit | 2026-01-09 → Audit **2026-02-12** (3 Tage) |
| Ergebnis | Bestanden; **0 Haupt / 0 Neben**; Nachforderungen SK/EK |
| Service model | Done-for-you (historisch, ohne Paket-Split) |
| Hauptblocker | E-Mail/Anforderung fehlgeschlagen → **2-Tage On-Site-Rescue** vor Audit |
| S0-Schwächen | S0-04, S0-05, S0-08 (Falschname SK, fehlende Task-Klarheit, keine Continuity) |
| Evidence IDs | EV-LC-001 … EV-LC-013 (+ TBD) |

**Abgrenzung:** Kundenakte `LC_Security` = laufende Abwicklung 2026; P-HIST-01 = **Erstzertifizierungs-Baseline** für DFSS.

**Folgefall:** P-HIST-02 (Extension) baut auf derselben Kundenbeziehung auf — separater Messzweck (Delta-Audit, nicht Erstzertifizierung).

---

## P-HIST-02 — LC Security Extension (Kurz)

| Feld | Wert |
|------|------|
| Typ | Extension / Delta-Audit / Zusatzbeauftragung |
| SDLs neu | DIN 77200-1 **Veranstaltungsdienst**; DIN 77200-2 **besondere Sicherheitsrelevanz** |
| KSA / Audit | 2026-02-23 → Audit **2026-05-25** |
| Ergebnis | Bestanden; Nachforderungen (keine formalen NCs gemeldet) |
| Tool 2 | **Definitiv genutzt** (MA-Akten, Schulung, Unterweisungspakete) — Bugs/Reibung dokumentiert |
| Haupttreiber | Veranstalter-SK fehlte; SK/EK/DA-Erstellung; Event-Nachweise; Zusatzauftrag nach Audit |
| Aufwand (Schätzung) | ~1 Woche SK-Vorbereitung; ~3 intensive Tage vor Audit; ~2–3h Nachreichung |
| DFSS-Nutzung | Extension-Workflow, Tool-2-Stabilisierung, SK/EK-Bot-Anforderungen, Follow-up-Evidence-Board |
| Evidence IDs | EV-LCEXT-001 … EV-LCEXT-005 (+ EST) |

---

## Merge-Hinweis (später)

- Pilot Validation Report: **keiner** der historischen Fälle allein ausreichend — Kombination mit P05 + weiteren Cases.
- LC-Kette: **P-HIST-01** (Erstzertifizierung) + **P-HIST-02** (Extension) gemeinsam für Continuity- und Tool-2-Lernkurve nutzen.
- Nächster Schritt (wenn DFSS-Projekt aktiv): Evidence-Dateien indexieren, V-01–V-10 quantitativ nachziehen, RC/DR aus allen Fällen in Design-Guidelines überführen.
- Quelle Upload: `Downloads/` + `Desktop/` → HQ `07_DFSS/` am **2026-06-05**.
