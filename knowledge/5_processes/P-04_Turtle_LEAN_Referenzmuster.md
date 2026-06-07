# P-04 Erbringung der Sicherheitsdienstleistung — Lean-Turtle (Referenzmuster)

**Stand:** 2026-06-07 · **Owner:** Generalist · **Zweck:** **Das** schlanke Turtle-Muster, an dem sich alle anderen Prozesse ausrichten. Worked example: Wolf Street (ISO 14001-Fall). KPI-Werte = ZKM-Blueprint-Vorgaben (`L-05_ZKM`), kundenspezifische Istwerte = `{fill}`.

> **Die zwei Prinzipien, die das System schlank machen:**
> 1. **Verweisen statt wiederholen.** Der Turtle nennt mitgeltende Dokumente nur als Link. Das IMH wird dadurch dünn (Verweishandbuch, keine 50 Seiten).
> 2. **Umwelt ist kein Silo, sondern ein eingebetteter, *schaltbarer* Block** in jedem Turtle — aktiv nur bei ISO-14001-Scope („Knopfdruck"). Kein doppeltes P-09-Lager mehr.

---

## Turtle P-04 (schlank)

**Zweck (1 Satz):** Sicherheitsdienstleistung am Objekt planmäßig, vollständig besetzt und nachweisbar erbringen.

| | |
|---|---|
| **Input** | freigegebenes Projekt/Anforderungsprofil (P-03), Dienstplan, Dienstanweisung (V-04/F-03), eingewiesenes & freigegebenes Personal (P-06/F-14) |
| **Prozessschritte** | Dienstplanung → Dienstantritt/Kontrolle → Durchführung → Wachbuch/Meldungen (V-07) → Übergabe → Abweichungen/Eskalation |
| **Output** | erbrachte SDL, geführtes Wachbuch, Ereignis-/Schichtberichte, Leistungsnachweis (P-05) |
| **Wer (Rollen)** | Einsatzleitung/Disposition (Steuerung), SMA (Durchführung), Führungskraft (Aufsicht), IMB (Nachweislenkung) |
| **Womit (Ressourcen)** | Dienstplan-Tool, Wachbuch, Ausrüstung/Dienstkleidung (V-09), Schließmittel (V-08) |
| **Mitgeltende Dokumente (nur Verweis)** | V-04 Dienstanweisungen · V-07 Melde-/Berichtswesen · V-08 Schließmittel · V-09 Ausrüstung · F-02 Objekteinweisung · F-14 Einsatzfreigabe |

**Steuergrößen (KPI) — Kern P-04:**

| KPI | Ziel | Warn | Eingriff | Rhythmus |
|---|---|---|---|---|
| Pünktlichkeitsquote | 98 % | 95 % | 92 % | monatlich |
| Besetzungsquote | 100 % | 98 % | 95 % | monatlich |
| Wachbuchvollständigkeit | 100 % | 95 % | 90 % | monatlich |
| Kundenfeedback (QZ-01) | ≥ Soll | — | — | je Rückmeldung |

---

## 🌱 Umwelt-Aspekt-Block — P-04 *(optional · aktiv bei ISO 14001)*

> Wird per Schalter aktiviert (`umwelt_aktiv = true`, gesetzt durch ISO-14001-Scope). Bei reinem DIN-77200/9001-Kunden: Block bleibt aus → Turtle bleibt schlank. **Das ist der „Knopfdruck".**

**Relevante Umweltaspekte *dieses* Prozesses** (P-04 = Einsatz vor Ort, inkl. mobile Dienste):

| Aspekt | KPI / Bezug | Ziel | Verantwortlich | Maßnahme |
|---|---|---|---|---|
| Kraftstoff / Fahrleistung (mobile Dienste) | UK-04 Liter bzw. km/Monat | Datenerhebung aufbauen | Einsatzleitung | M-007: Tank-/Fahrdaten erfassen |
| **Anfahrt SMA zum Objekt** (Emissionen) | anteilig UK-04 | bewusste, effiziente Anfahrt | SMA / Einsatzleitung | Sensibilisierung: Fahrgemeinschaft / ÖPNV / kurze Wege (Inhalt der Umweltunterweisung, P-06) |
| **Abfall am Einsatzort** (Müllmitnahme / Trennung) | Verhaltensbezug UK-05 | Müll mitnehmen, korrekt trennen | SMA | Sensibilisierung; SMA nimmt Abfall mit / entsorgt geordnet |
| Umweltrelevante Ereignisse im Einsatz | UK-07 / UZ-04 Anzahl | 0 (Warn 1, Eingriff 2) | Einsatzleitung / IMB | M-008: über Wachbuch/F-07 melden |

**Kontrolle (im Prozess, nicht im Silo):** Führungskraft / Einsatzleitung prüft das Umweltverhalten (Anfahrt, Müllmitnahme) **bei der Objektbegehung / Stichprobe** → Vermerk als Nachweis (Begehungsprotokoll / Stichproben-Check).

> **Abgrenzung:** *Abfall-Verhalten am Einsatzort* gehört hierher (P-04); *Abfall-Entsorgung & Beschaffung* (Mengen, Entsorger) bleibt P-07. Strom/Wasser → P-01, Papier → P-08.

---

## Verteilungs-Map — Umwelt raus aus dem Silo, rein in die Turtles

> Heute (Ist): alle UK-/UZ-Kennzahlen hängen an **P-09**. Ziel: jeder Aspekt sitzt im Prozess, in dem er entsteht; **P-09 wird zur reinen Aggregations-/Steuerungsebene** (Umweltbericht, Notfallvorsorge), nicht zum Lager.

| Umweltaspekt | gehört in Turtle | KPI |
|---|---|---|
| Papierverbrauch | P-08 Dokumentation / Verwaltung | UK-01 |
| Strom / Wasser (Büro) | P-01 Führung / Verwaltung (Infrastruktur) | UK-02/03 |
| **Kraftstoff / Fahrleistung** | **P-04 (mobile Dienste)** | UK-04 |
| Abfall / Entsorgung | P-07 Beschaffung/Ausrüstung | UK-05 |
| Elektroaltgeräte / Akkus | P-07 Beschaffung/Ausrüstung | UK-06 |
| **Umweltvorfälle** | **P-04 (Einsatz)** + Aggregation P-09 | UK-07 |

---

## Was das fürs schlanke System heißt (Replikation = mechanisch)

1. **Jeder Turtle** bekommt dasselbe Schema: Kern-Felder + optionaler 🌱-Block (Slot, meist leer).
2. **IMH** verweist nur auf die Turtles/Verfahren — keine Wiederholung → das 50-Seiten-Handbuch schrumpft.
3. **Dubletten weg:** Umweltkennzahlen leben **einmal** im jeweiligen Turtle, nicht zusätzlich im P-09-Silo (und nicht doppelt in „9-ISO 14001" + „3-Vorgabedokumente").
4. **Generator/Tool:** `umwelt_aktiv` schaltet die 🌱-Blöcke an/aus — ein Schalter, branchen-/scope-abhängig (= dein „Knopfdruck", später Code-Track).

## Nächster Schritt (nach Freigabe dieses Musters)
- Muster auf die restlichen Turtles (P-01…P-09) anwenden = **nur Slots füllen**, keine neue Denkarbeit.
- Dann: IMH auf Verweis-Niveau eindampfen (Dublette-Cut-Liste).
- Code-Track: `umwelt_aktiv`-Schalter im Generator (Phase 2).
