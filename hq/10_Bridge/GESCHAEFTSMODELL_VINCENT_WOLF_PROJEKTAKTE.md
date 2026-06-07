# Geschäftsmodell (Vincent-Wolf) + Projektakte-Architektur

**Stand:** 2026-06-07 · **Quelle:** Mark (GF Cert-Expert), Braindump · **Festgehalten:** Claude (Code-Track).
**Zweck:** Reales Erstzertifizierungs-/Verkaufsmodell + Produkt-Architektur (Projektakte, SDL-Typen, digitales Wachbuch) als Design-Input für Tool 2 / Slice 2+5. **Norm-Fakten dazu:** `knowledge/NORM_MATRIX_Mitarbeiternachweise_v2.md` (§13/§14).
**Status-Tags:** [ERPROBT] real angewandt · [IDEE] noch Konzept · [OFFEN-DEKRA] Zertifizierer-Auslegung, nicht behaupten (EC-10) · [LEGAL-INPUT] Mark liefert exakte Paragraphen.

---

## 1. Vincent-Wolf — Erstzertifizierungs-Muster [ERPROBT]
- **Neues Unternehmen:** Cert-Expert berät, wen es einstellen soll, und empfiehlt ein **kleines Vorzeige-Projekt** (Café-/Restaurant-Auftrag) als Zertifizierungs-Referenz.
- Minimal-Setup: oft **2 Tage am Wochenende**, manchmal **nur 1 EK + 1 FK**; Extremfall **GF = qualifizierte FK** in Personalunion.
- Weil **Dokumentenbasis-Erstaudit** (kein echtes Objekt nötig, siehe Norm-Matrix §13 Weg 1): **kein großer Pool** vorzuzeigen — **2 exemplarisch saubere Geschulte (FK + EK) genügen**.
- Quoten-Mathe: bei 2 SMA im Teil-1-SDL → 35 % = 0,7 → **1 SMA** geschult genügt (Norm-Matrix §14).
- **Verkaufsargument:** beim Erstaudit **noch kein echtes Objekt** nötig → echtes Projekt erst zu **Ü1 (12 Monate)**, dann mit Einsatzkonzept → **größere Folgeberatung**.
- **USP: saubere Schulungen.** EK bekommt Einsatzkräfteschulung (deckt Teil-1-Anforderung), FK zusätzlich FK-Schulung.

## 2. Subauftrag / zu großer, teils unqualifizierter Pool [ERPROBT]
- Problem: Auftrag ist oft **Subauftrag**; es arbeiten bereits **nicht qualifizierte** Leute, Pool evtl. zu groß → komplex.
- Lösungsweg (heutiges Wissen): AG bittet, **2 Positionen als DIN-Positionen** auszuschreiben; **Rest läuft als allgemeine (Non-DIN-)SDL** mit sauberen Verträgen. Eine **Zusatzvereinbarung zum bestehenden Auftrag** reicht — „kriegen viele hin".
- Damit greift DIN nur auf dem abgegrenzten Scope; der Rest muss „nur" den gesetzlichen Boden halten (siehe §3).

## 3. Gesetzlicher Boden — gilt unabhängig von DIN [LEGAL-INPUT]
- **Wachbuch + Aufbewahrungspflichten** stützen sich auf die **BewachV** → der Betrieb muss sie **auch ohne Zertifizierung** führen. Fehlendes Wachbuch = echter Compliance-Fehler, den saubere Doku im Audit sichtbar macht.
- **Bewacherregister + §34a GewO**: bestimmen mit der Qualifikation, **wer was darf** (Unterrichtung vs. Sachkunde).
- **DIN fordert ein QM**; Gesetzesbrüche schlagen über **Rechtskataster / interessierte Parteien** ins QM zurück.
- **Auch NON-DIN-SDL muss den gesetzlichen Mindeststandard erfüllen** (BewachV, Bewacherregister, §34a).
- **Mark liefert:** exakte BewachV-Paragraphen (Wachbuch, Aufbewahrungsfristen), Bewacherregister-Bezug, Non-DIN-Pflichtangaben.

## 4. Digitales Wachbuch [IDEE — Phase 2+]
- Generiert, lückenlos, jederzeit vorzeigbar — würde Compliance + Audit massiv erleichtern („king").
- **Integritäts-Leitplanke (EC-10):** Nacherfassen/Digitalisieren **tatsächlich erbrachter** Dienste ist ok — mit **ehrlichem Erstell-Zeitstempel/Audit-Trail** und Kennzeichnung „Nacherfassung". **Keine** erfundenen Einträge, die nie erbrachte Leistung als konform tarnen → das wäre genau der Bruch, den das Tool eigentlich heilt.

## 5. Projektakte-Architektur [IDEE/DESIGN]
Drei SDL-Typen, jeweils mit eigenen **Pflichtangaben**:
- **NON-DIN-SDL** — gesetzlicher Mindeststandard (BewachV, Bewacherregister, §34a Unterrichtung/Sachkunde).
- **DIN-77200-1-SDL** — Empfangsdienst, Kontrolldienst (stat./mobil), Revier, Intervention, Alarm, Veranstaltung … + Anforderungsprofil (Anh. A), GBU, ODA.
- **DIN-77200-2-SDL** — Veranstaltung bes. SR, ÖPV, Objekte bes. SR, Flüchtling/Asyl + zugehörige Schulungen (Norm-Matrix §5) + Quote (§14).
- Querschnitt: jede SDL trägt ihre Pflichtangaben; Engine rechnet Qualifiziert-Ampel + Quote **je SDL** (Norm-Matrix §9/§14).

## 6. Zukunftskonzept
Mark: das **Zukunftskonzept ist wahrscheinlich anders** als das heutige Modell — die obige Kombination ist aber **aktuell die häufigste** und damit der erste Bau-Bezug.

---

## Offene Punkte
- [OFFEN-DEKRA] Doku-Basis-Entfall auch für Teil-1-SDL; „Schulungen nur geplant" beim Doku-Basis-Erstaudit; „vergangenes Event als Referenzprojekt" — siehe Norm-Matrix §15.
- [LEGAL-INPUT] BewachV/Wachbuch/Aufbewahrung, Bewacherregister, Non-DIN-Pflichtangaben, DGUV/Fahrer-Unterweisung — Mark liefert „bei Zeiten".
