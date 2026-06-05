# Finanz — Arbeitsgrundlage

**Stand:** 2026-06-05 (Chat + Lexware BWA; Tools ergänzt)  
**Zweck:** Schrittweise Privat + Geschäft erfassen — Lücken bewusst offen.  
**Quelle BWA:** `~/Downloads/2026-6-Jahresrueckschau-BWA.pdf` (Cert Expert, EÜR, Jul 2025 – Jun 2026)

> Regel: **Privat** und **Geschäft** getrennt. Gemischte Posten (z. B. Versicherung) nur mit **einem** Split (%), nie voller Betrag in beiden Spalten.

---

## 1 — Geschäft: erwartete Zahlungen (Pipeline)

> **Dashboard:** Master-Liste → [Cert_Expert_Einnahmen.json](Cert_Expert_Einnahmen.json) (Reiter „Einnahmen“). Tabelle unten wird daraus synchronisiert.

| Kunde / Debitor | Betrag (EUR) | Status | HQ / Lexware |
|-----------------|-------------:|--------|----------------|
| **AFAS** — a.f.a.s. security & service GmbH | 5.950 | Warten | ford01 — ISO 14001; **eigene** Rechnung (nicht Schutzritter) |
| **Bärlin** Security Service GmbH | 833 | Warten | Schreibweise **Bärlin mit R** überall; BWA Apr 2026 Forderungsveränderung **833** |
| **SecuGuard** | 1.750 | Erwartet | `03_Kundenprojekte/SecuGuard/` |
| **Schutzritter** (nicht „Schutznetze“) | 5.950 | Erwartet | `03_Kundenprojekte/Schutzritter/` |
| **Faust Security** | 1.500 | Offen | ford02 |
| **TeamFlex** | ~4.500 | **Rechnung noch anlegen** | Noch kein Konto / keine Rechnung in Lexware |
| **Wolf Street** | ~2.200 | **Rechnung noch anlegen** | Noch kein Konto / keine Rechnung in Lexware |
| **LC / ELC** | 0 | Nicht erwartet | ford03 ggf. schließen / Status anpassen |

| Summe | EUR |
|-------|----:|
| Offen / warten / erwartet (ohne Schätzungen) | **15.983** |
| Noch zu fakturieren (Schätzung) | **~6.700** |
| Maximum wenn alles kommt | **~22.683** |

---

## 2 — Privat: fixe monatliche Kosten

| Posten | EUR/Monat |
|--------|----------:|
| Miete | 534,19 |
| Parkplatz | 40,00 |
| Strom | 55,00 |
| Internet | 33,98 |
| GEZ | 18,36 |
| Handy (privat) | 9,99 |
| Abos | 31,98 |
| Versicherung DE | 375,00 |
| Versicherung CH | 375,00 |
| **Summe fix privat** | **1.473,50** |

### Lücken privat

- [ ] **Strom privat (Ratenzahlung)** — noch nicht eingetragen (≠ Betriebs-Strom 55 € oben)
- [ ] Variables Privat (Lebensmittel, Transport, …)
- [ ] **Einkommen privat — Ziel** (€/Monat netto / Entnahme Firma)
- [ ] Steuer-Rücklage CH/DE (monatlich?)
- [ ] Split-Regel Versicherung DE/CH (% geschäftlich falls relevant)

---

## 3 — Geschäft: Tools & laufende Kosten (monatlich)

> **Dashboard:** Master-Liste → [Cert_Expert_Kosten.json](Cert_Expert_Kosten.json) (Reiter „Cert Expert Kosten“). Tabelle unten wird daraus synchronisiert.

| Posten | Kategorie | Anbieter | EUR/Monat | Notiz |
|--------|-----------|----------|----------:|-------|
| Mitarbeiter | Personal | — | 500,00 |  |
| Mobilfunk (2 Verträge) | Telekommunikation | **Congstar** | 40,99 | ≠ privat Handy 9,99 |
| Domain (min.) | Telekommunikation | **IONOS** | 8,50+ | Gesamt-Hosting ggf. höher |
| Coworking | Büro | — | 155,89 |  |
| MacBook Ratenzahlung | Hardware | — | ~200,00 | Schätzung |
| Adobe Premium | Tools | Adobe | 47,98 |  |
| OneFlow (Angebote online) | Tools | OneFlow | ab 20,00 |  |
| Microsoft Lizenzen | Tools | Microsoft | 42,00 |  |
| Buchhaltung + Steuer | Buchhaltung | **Lexware** | 39,15 | = Steuerprogramm (ein Posten) |
| Cursor Pro | Tools | Cursor | 17,89 |  |
| ChatGPT | Tools | OpenAI | 22,99 | Noch privat (iPhone) → auf Firma umstellen |
| Claude Premium | Tools | Anthropic | 137,99 | Noch privat → auf Firma umstellen |
| Endel | Tools | Endel | 12,99 | Noch privat → auf Firma umstellen |
| **Summe bekannt (monatlich)** | | | **~1.246,37+** | |
### Einmalig (nicht in Monatssumme)

| Posten | EUR | Notiz |
|--------|----:|-------|
| ~~a.saily / Saily~~ | ~~27,64~~ | **Einmalig — wieder entfernt** |

### Noch ohne Betrag / Klärung

*(auch in `Cert_Expert_Kosten.json` → `pending`)*

- [ ] WordPress — Betrag noch offen
- [ ] **StudyFetch** — **kündigen**
- [ ] Sonstiges (Nutzer ergänzt nach und nach)

### Aktionen Geschäft

- [ ] **ChatGPT 22,99** — Abo vom **privaten iPhone** auf **Geschäftskonto** umstellen
- [ ] **Claude 137,99** — von **Privat** auf **Geschäftskonto** umstellen
- [ ] **Endel 12,99** — von **Privat** auf **Geschäftskonto** umstellen  
  *(Alle drei: in Fixkosten **Cert Expert** geplant — bis Umstellung nicht zusätzlich unter Privat zählen)*
- [ ] StudyFetch kündigen
- [ ] Rechnungen **TeamFlex**, **Wolf Street** in Lexware anlegen
- [ ] AFAS 5.950 € in ford01 / Lexware als offener Posten verknüpfen

---

## 4 — Lexware BWA (Kurzüberblick)

**Zeitraum:** Juli 2025 – Juni 2026 · **Firma:** Cert Expert, Berlin · **EÜR**

### Umsatz (Summe der Erlöse, Auszug)

| Monat | Erlöse |
|-------|-------:|
| Aug / Okt 2025 | je 6.250 |
| Jan 2026 | 9.521 |
| Feb 2026 | 21.500 |
| Mär – Mai 2026 | 5.001 / 5.000 / 5.700 |
| **Jun 2026** | **−3.000** ← in Lexware klären (Gutschrift/Korrektur?) |

**12 Monate Erlöse (Summe Zeile):** ~59.222 €

### Betriebseinnahmen (cash-nah, Auszug)

Apr / Mai 2026: je **5.950** · Jun 2026: **0** (wartende Posten ggf. noch nicht gebucht)

### Kosten (Kategorien, Jahressumme „Summe der Kosten“)

| Kategorie | ca. Summe |
|-----------|----------:|
| Fremdleistungen | ~8.172 |
| Werbe- und Reisekosten | ~6.508 |
| Verschiedene Kosten | ~7.306 |
| Raumkosten | ~1.405 |

### Vorläufiges Ergebnis

Starke Monate z. B. Feb **+21.217**, Jan **+6.863**; schwach Apr **−3.215**, Dez **−6.034**.  
*Hinweis PDF:* Stand Buchhaltung zum Export — spätere Buchungen ändern Werte.

---

## 5 — Grobvergleich (unvollständig)

| | EUR |
|--|-----|
| Privat fix / Monat | 1.473,50 |
| Geschäft Tools+Fix / Monat (bekannt) | ~1.246,37+ |
| Offene Forderungen (Liste §1) | 15.983 |
| Noch zu fakturieren (Schätzung) | ~6.700 |

**Privat 1.474 €/Monat** ≈ **~11 Monate** nur Fixkosten, wenn einmalig **15.983 €** Geschäftseingang käme — ohne Steuer, Variable, Entnahme-Planung.

---

## 6 — Nächste Schritte (für dich)

1. Fehlende Tool-Beträge nachreichen (`Name 12,34` im Chat oder hier eintragen).
2. Lücken in §2 und §3 abhaken.
3. Juni **−3.000 €** in Lexware prüfen.
4. Optional: Kontoblatt „Verschiedene Kosten“ → Tools zuordnen.

**Pflege:** Diese Datei direkt bearbeiten oder im HQ-Chat aktualisieren lassen. Kein automatischer Build-Spiegel.

---

→ Offene Posten-Tasks: [Offene_Juni_2026.md](Offene_Juni_2026.md)  
→ Kunden: [../00_Dashboard/Kunden_Uebersicht.md](../00_Dashboard/Kunden_Uebersicht.md)
