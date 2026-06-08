# Norm-Cross-Check Schulungskatalog V1 ↔ CL-Register (Planer, 2026-06-08)

> **Zweck:** Jede UE-Zahl aus dem Schulungskatalog V1 (`CURSOR_SCHULUNGSKATALOG_PLANUNG.md` §3) einer **belegten `clauseId`** zuordnen — Voraussetzung, **bevor** die Engine UE-Werte berührt (Queue-Punkt D / Pt 2/3). Quelle: `NORM_MATRIX_Mitarbeiternachweise_v2.md` + `NORM_KLAUSEL_REGISTER_v1.md`. **Keine Werte erfinden:** Abweichung Katalog↔Norm = „fachlich prüfen", Engine behält den belegten Wert.
> **EC-10:** alles rechnerisch/Nachweis, kein Freigabe-/Auditstatus.

## 1. Ergebnis-Tabelle (Katalog → CL)

| Katalog V1 (§3) | UE laut Katalog | CL | Norm-Wert (belegt) | Verdikt |
|---|---|---|---|---|
| DIN-1 Jahresweiterbildung „01" | 24 UE | **CL-11** | 24 UE (Teilzeit), §4.19.2 | ✅ deckt sich |
| DIN-1 Jahresweiterbildung „02" | 40 UE | **CL-11** | 40 UE (Vollzeit), §4.19.2 | ✅ deckt sich |
| DIN-1 modular 1–8 | je 4 UE | **(CL-11)** | kein Norm-UE pro Modul | ⚠️ Curriculum-Bausteine, **kein** Norm-Wert (s. §2.1) |
| DIN-1 modular 9 „FK Sicherheitsdienst" | 8 UE | **(CL-11)** | kein Norm-UE | ⚠️ Curriculum-FK-Aufschlag, kein eigener Norm-Wert |
| DIN-2 Flüchtling/Asyl EK „01" | 40 UE | **CL-24** | 40 UE einmalig, §8.3 | ✅ deckt sich |
| DIN-2 Flüchtling/Asyl FK „02" | 24 UE | **CL-25** | +24 UE (= 64 gesamt), §8.4 | ✅ deckt sich (**24 = Aufschlag**, nicht Gesamt — s. §2.2) |
| DIN-2 Veranstaltung EK „03" | 16 UE | **CL-21** | 16 UE einmalig, §5.4 | ✅ deckt sich |
| DIN-2 Veranstaltung FK „04" | **16 UE** | **CL-20** | **24 UE** einmalig, §5.3 | 🔴 **WIDERSPRUCH** (s. §2.3) |
| DIN-2 ÖPV EK „05" | 40 UE | **— keine CL** | nicht in Matrix/Register | 🔴 **LÜCKE** (s. §2.4) |
| DIN-2 ÖPV FK „06" | 16 UE | **— keine CL** | nicht in Matrix/Register | 🔴 **LÜCKE** (s. §2.4) |
| DIN-2 Objekte bes. SR „07" | „modular" | **CL-22** | +20 UE/Jahr objektspez., DL ≤50 %, §7.3 | ⚠️ wiederkehrend (nicht einmalig), unquantifiziert im Katalog |
| Brandschutzhelfer | 4 UE / 3 J. | **CL-23** | 4 UE, alle 3 J. (nur 77200-2-Kontexte), §7.3 | ✅ scope-gated |
| Erste Hilfe | — / 2 J. | **CL-08** | Erneuerung alle 2 J., §4.19.1 | ✅ |
| Unterweisungen (alle) | keine UE | **—** | §3.18/§4.14.5: zählen **nicht** als Weiterbildung | ✅ operativ, kein Norm-UE |

## 2. Befunde im Detail

### 2.1 Modulare DIN-1-Schulungen (9×4 UE + FK 8 UE) = Curriculum, nicht Norm-Zerlegung
- Matrix/Register kennen **keinen** UE-Wert pro Einzelmodul. CL-11 gibt nur den **Jahres-Sollwert** (40/24).
- Summe der EK-Module 1–8 = **32 UE** ≠ 40 UE Jahres-Soll. → Die Module sind **Cert-Expert-Lehrbausteine zur Füllung** des CL-11-Solls, **keine normative Aufteilung**.
- **Engine-Regel:** Jahres-Soll bleibt **CL-11 (40/24)**. Modul-UE **nicht** automatisch zum Jahres-Soll aufsummieren/als Pflicht setzen. Module = Kurs-Angebot (Termin-Planung Pt 3), nicht Soll-Treiber.

### 2.2 Asyl-FK „24" ist der Aufschlag (= 64 gesamt)
- Katalog „02 = 24 UE" meint den **FK-Aufschlag** auf die EK-Basis 40 (CL-24) → **64 gesamt** (CL-25, §8.4). Engine bildet das bereits so ab (`sdl-asyl-base` 40 + `sdl-asyl-fk` +24). **Nicht** als eigenständige 24-UE-Schulung doppeln.

### 2.3 🔴 WIDERSPRUCH: Veranstaltung FK — Katalog 16 vs. Norm 24
- **Norm (belegt):** CL-20 / DIN 77200-2 §5.3 = **24 UE** für FK Veranstaltung bes. Sicherheitsrelevanz. Engine nutzt aktuell **24** (Test `sdl-veranstaltung-fk = 24` grün).
- **Katalog V1 (OneDrive):** „04 Veranstaltungen FK = 16 UE".
- **Verdikt: fachlich prüfen — Engine behält 24 (CL-20).** Den Katalogwert 16 **nicht** in die Engine übernehmen. Mögliche Erklärungen (mit Mark/Quelle zu klären): Katalog-Tippfehler, anderer Kurszuschnitt, oder „16" = Präsenzanteil. **Bis geklärt: Norm gilt.**

### 2.4 🔴 LÜCKE: ÖPV (öffentlicher Personenverkehr) hat keine CL
- ÖPV = DIN 77200-2 §6. **Weder Matrix §5-Tabelle noch Register** führen ÖPV-UE-Werte (Register hat CL-20..CL-28, ÖPV fehlt).
- Katalog nennt EK 40 / FK 16 — **ohne belegte CL nicht verwendbar** (keine erfundene Pflicht).
- **Aufgabe (Planer/Norm):** §6 DIN 77200-2 im Original prüfen → ggf. **neue CL-IDs** (z. B. CL-29/CL-30 ÖPV EK/FK) ins Register aufnehmen, **dann** Engine. Bis dahin: ÖPV-Scope = „fachlich prüfen", kein UE-Soll.

### 2.5 Objekte bes. SR (CL-22) ist wiederkehrend
- CL-22/§7.3 = **+20 UE pro Jahr** objektspezifisch (DL ≤50 %), **zusätzlich** zur Jahres-Weiterbildung — **nicht einmalig**. Katalog „07 modular" ist unquantifiziert. Bei Modellierung als jährlich wiederkehrend führen, nicht als Einmalschulung.

## 3. Konsequenzen für die Bau-Queue
- **Engine-UE-Werte aktuell norm-konform** für das Abgedeckte (Veranstaltung EK 16 / FK 24, Asyl EK 40 / FK 64) — **keine Änderung nötig/zulässig** aufgrund des Katalogs.
- **Vor Pt 2/Pt 3 (D/C), falls UE/Scope berührt:** (a) ÖPV-CL erst belegen (§2.4), (b) Veranstaltung-FK-Widerspruch mit Mark klären (§2.3) — Norm gewinnt.
- **Termin-Planung (Pt 3 / C):** rein operativ (Datum pro Kurs) → **norm-neutral**, vom Cross-Check **nicht** blockiert. Module/Kurse aus dem Katalog dürfen als planbare Termine erscheinen, ohne UE-Soll zu verändern.
- **Read-only Übersicht (Pt 1 / B):** zeigt nur bereits berechnete Engine-Werte → **kein** Cross-Check-Risiko.

## 4. Offene Norm-Fragen an Mark (gebündelt)
1. **Veranstaltung FK:** Katalog 16 vs. Norm 24 (CL-20/§5.3) — welcher Wert ist real? (Engine bleibt bis dahin bei 24.)
2. **ÖPV:** Quelle/§ für EK 40 / FK 16 bestätigen → dann neue CL ins Register, dann Engine.
3. **Modulare DIN-1-Schulungen:** Bestätigung, dass die 9×4 (+FK 8) reine Lehrbausteine sind und der Jahres-Soll CL-11 (40/24) maßgeblich bleibt.
