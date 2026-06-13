# DGUV / VBG Quellen-Analyse — 2026-06-10

**Zweck:** Übersicht der wichtigsten Materialien von DGUV (publikationen.dguv.de) und VBG (vbg.de) für Cert-Expert Academy — inkl. Download-Status und Einspielung in `knowledge/`.

---

## Wichtigste Neuigkeit (Stand 10.06.2026)

> **⚠️ Sicherheitsbeauftragte: Schwellenwert 50 statt 20 — gilt seit 29. Mai 2026!**
> Die Bestellpflicht greift ab sofort erst ab 50 Beschäftigten (bisher 20). Kunden mit 20–49 MA sind ggf. nicht mehr verpflichtet. Ausnahmen bei besonders gefährdeten Bereichen möglich. → Für Compliance-Checks im Certification OS relevant (Slice 2, Requirement Engine).

---

## Download-Prioritäten

### Priorität 1 — VBG Direct Downloads (kostenlos, sofort verfügbar)

| Dokument | Größe | Download-URL / Weg | Zielort knowledge/ |
|----------|-------|---------------------|-------------------|
| VBG-Fachwissen „Gefährdungsbeurteilung – So geht's" | 7,6 MB | https://www.vbg.de/cms/arbeitsschutz/arbeitsschutz-organisieren/gefaehrdungsbeurteilung | `01_sicherheitsdienstleistungen/vbg/` |
| Gefährdungsbeurteilung psychischer Belastung | 1 MB | (gleiche Seite, zweiter Download) | `01_sicherheitsdienstleistungen/vbg/` |
| Prämienkatalog für Sicherheitsunternehmen | 849,9 KB | https://www.vbg.de/cms/sicherungsdienstleistungen/gewaltpraevention-sicherungsdienstleistungen | `01_sicherheitsdienstleistungen/vbg/` |

### Priorität 2 — DGUV Vorschriften (kostenlos, über VBG beziehen)

| Dokument | Weg | Status |
|----------|-----|--------|
| **DGUV Vorschrift 23** — Wach- und Sicherungsdienste | Kostenlos beim UV-Träger VBG anfordern (kein direkter PDF-Download auf publikationen.dguv.de) | ⬜ ausstehend |
| **DGUV Vorschrift 1** — Grundsätze der Prävention | Wie V23 über UV-Träger | ⬜ ausstehend |

### Priorität 3 — DGUV Informationen (als PDF direkt downloadbar)

| Dokument | Jahr | Relevanz | DGUV-Seite |
|----------|------|----------|------------|
| **DGUV Information 215-310** — Sicherheit bei Veranstaltungen und Produktionen | 2025 | ⭐⭐⭐ Veranstaltungssicherheit / DIN 77200-2 | publikationen.dguv.de/alle/?sSearch=215-310 |
| **DGUV Information 215-461** — Gebäudemanagement, Sicherheit Verwaltungsgebäude | 2026 | ⭐⭐ Objektschutz | publikationen.dguv.de |
| **DGUV Information 206-059** — Sicherheits- und gesundheitsgerechte Führung | 2025 | ⭐⭐ Führungskräfte-Modul | publikationen.dguv.de |

### Priorität 4 — Übersichtsliste (einmalig, strategisch)

| Dokument | URL | Zweck |
|----------|-----|-------|
| **DGUV_Regelwerk.xls** | https://publikationen.dguv.de/files/downloads/DGUV_Regelwerk.xls | Vollständige DGUV-Publikationsliste als Excel — Grundlage für spätere Bot-Suche |

---

## VBG-Assets (kein Download, aber direkt nutzbar)

| Asset | URL | Nutzen |
|-------|-----|--------|
| **GEDOKU** — kostenfreie GBU-Software (bis 50 MA) | https://www.vbg.de/cms/arbeitsschutz/arbeitsschutz-organisieren/gefaehrdungsbeurteilung | Branchenkatalog „Sicherungsdienstleistungen" — Referenz für GBU-Bot-Logik |
| **7-Schritte-GBU-Anleitung** (Web) | gleiche Seite | Prozesslogik für GBU-Modul |
| **Securityreport 2023** | https://www.vbg.de/cms/sicherungsdienstleistungen | Unfallgeschehen-Analyse, alle 5 Jahre |
| **Filmreihe „Sicher im Einsatz"** | (Mediathek VBG) | Unterweisungshilfe speziell für Wach-/Sicherungsdienste |
| **7. VBG-Forum Sicherungsdienstleistungen** | Veranstaltungskalender VBG | 7. Oktober 2026, Zeche Zollverein, Fokus Gewaltprävention, Kooperation BDSW |

---

## Was der Bot kann vs. was Mark machen muss

| Aufgabe | Wer |
|---------|-----|
| VBG-PDFs herunterladen und in OneDrive ablegen | **Mark** (manuell, Browser) |
| DGUV_Regelwerk.xls herunterladen | **Mark** |
| DGUV V23 bei VBG anfordern (kostenlos) | **Mark** |
| `knowledge/`-Stubs befüllen nach Download | Bot (nach Upload/Bereitstellung) |
| GEDOKU-Branchenkatalog-Struktur analysieren (Webseite) | Bot |
| CL-Register um neue Einträge erweitern | Planer-Spur (Spur P mit Mark) |

---

## Einspielung in knowledge/2_regulations/

Nach Download durch Mark:

```
01_sicherheitsdienstleistungen/
├── dguv_v23/overview.md        ← ✅ befüllt (2026-06-10)
├── vbg/overview.md             ← ⬜ stub, wartet auf VBG-Downloads
├── bewachv/overview.md         ← ⬜ stub
└── gewo_34a/overview.md        ← ⬜ stub
```

---

## Hinweis Copyright

- **DGUV Vorschriften / Informationen:** Orientierungswissen = OK. Wörtliche Textzitate oder vollständige Inhaltsübernahmen = nicht zulässig ohne Lizenz.
- **VBG-Fachwissen-PDFs:** Kostenlos downloadbar = für internen Gebrauch OK. Bot nutzt als Wissensquelle für Stubs; keine wörtliche Reproduktion in Kundenoutput.
- **BG BAU-Materialien** (aus Vorkontext): Struktur/Logik = UX-Vorbild OK. Textinhalte = nicht übernehmen.
