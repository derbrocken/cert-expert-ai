# knowledge/2_regulations/

Rechtliche Regelwerke, Normen und Verordnungen als Orientierungsrahmen für
die inhaltliche Generierung.

---

## Prinzip: Basis-Schicht + Branche

- `00_basis/` — gilt für **alle** Branchen. Wird referenziert, nicht kopiert.
- `01_sicherheitsdienstleistungen/` — branchenspezifisches Delta für SDL-Kunden.
- `02_veranstaltungen/` — zusätzliche Regelwerke für Veranstaltungs-Blueprints.
- `03_weitere_branchen/` — Zukunft (Expansion in weitere Verticals).

---

## Regeln

- **Nur Überblick.** Keine Volltexte, keine kopierten Paragrafentexte.
- **Ein Unterordner pro Regelwerk**, darin `overview.md` (~400 Tokens max).
- **Benennung:** alles lowercase, underscores, keine Umlaute (`ae/oe/ue`).
- **Bot-Grenze:** Der Bot darf Regelwerke strukturell kennen, aber niemals
  konkrete Paragrafennummern oder Messzahlen erfinden — außer explizit im Input belegt.

---

## Ordner

### 00_basis — branchenübergreifend

| Ordner | Inhalt | Status |
|--------|--------|--------|
| `arbschg/` | Arbeitsschutzgesetz — GBU-Grundlage | ✅ befüllt |
| `dguv_v1/` | DGUV Vorschrift 1 — TOP-Prinzip, Unterweisungspflicht | ✅ befüllt |
| `dguv_r100-001/` | DGUV Regel 100-001 — Grundsätze der Prävention (116 S., Juni 2025) | ✅ aus PDF |
| `dguv_i211-005/` | DGUV Information 211-005 — Unterweisung (40 S., 2012/2018) | ✅ aus PDF |
| `arbstaettv/` | Arbeitsstättenverordnung (18 S., 2024) — Büro/Leitstelle | ✅ aus PDF |
| `betrsichv/` | Betriebssicherheitsverordnung (60 S., 2025) — Arbeitsmittel/Fahrzeuge | ✅ aus PDF |
| `iso_45001/` | DIN EN ISO 45001:2023-12 — Arbeitsschutzmanagementsystem (111 S.) | ✅ aus PDF |
| `dguv_i215-410/` | DGUV Information 215-410 — Bildschirm-/Büroarbeitsplätze Leitfaden (96 S., 2019) | ✅ aus PDF |
| `asr_a6/` | ASR A6 — Bildschirmarbeit, Konkretisierung ArbStättV (32 S., 2024) | ✅ aus PDF |
| `bdsg/` | DSGVO + BDSG — Datenschutz Personalakten/Videoüberwachung (45 S., 2026) | ✅ aus PDF |
| `iso_9001/` | DIN EN ISO 9001:2015 — QMS Anforderungen (71 S.) | ✅ aus PDF |
| `iso_14001/` | DIN EN ISO 14001:2015 — UMS Anforderungen (83 S.) + Berichtigung | ✅ aus PDF |
| `iso_14001_umsetzung/` | Praxisleitfaden ISO 14001:2015/EMAS — Reimann 2019 (231 S.) | ✅ aus PDF |

> `arbschg/` und `dguv_v1/` = Altbestände aus 2024-Struktur — noch nicht auf Basis+Branche-Format migriert. Bei Gelegenheit vereinheitlichen.

### 01_sicherheitsdienstleistungen — Security-Delta

| Ordner | Inhalt | Status |
|--------|--------|--------|
| `bewachv/` | Bewachungsverordnung (BewachV 2019, 15 S.) | ✅ aus PDF |
| `gewo_34a/` | §34a Gewerbeordnung | ✅ reviewed (Öffentliches Recht) |
| `din_77200_1/` | DIN 77200-1:2022-10 — Allg. Anforderungen SDL (29 S.) | ✅ aus PDF |
| `din_77200_2/` | DIN 77200-2:2020-07 — Erweiterte Anforderungen SDL (36 S.) | ✅ aus PDF |
| `din_77200_3/` | DIN 77200-3:2020-07 — Zertifizierungsverfahren (24 S.) | ✅ aus PDF |
| `laf_berlin_sdl/` | LAF Berlin Sicherheitsdienstleistung — LQB 2018 + 2020 (10+11 S.) | ✅ aus PDF |
| `laf_berlin_betreiber/` | LAF Berlin Betreibervertrag — LQB 2016 (19 S., gescannt) | ✅ aus PDF (OCR) |
| `dguv_v23/` | DGUV Vorschrift 23 — Wach-/Sicherungsdienste (20 S., Fassung 1997) | ✅ aus PDF |
| `dguv_v24/` | DGUV Vorschrift 24 — V23 mit Durchführungsanweisungen (52 S., 2005) | ✅ aus PDF |
| `dguv_r115-001/` | DGUV Regel 115-001 — Geldtransport (14 S., 1998) | ✅ aus PDF |
| `dguv_r115-801/` | DGUV Regel 115-801 — Branche Zeitarbeit (52 S., 2024) | ✅ aus PDF |
| `vbg/` | VBG — UV-Träger + Downloads | ✅ reviewed |

### 02_veranstaltungen

| Ordner | Inhalt | Status |
|--------|--------|--------|
| `vstaettvo/` | Versammlungsstättenverordnung | ✅ befüllt |
| `dguv_i215-310/` | DGUV Information 215-310 — Veranstaltungssicherheit (64 S., Mai 2025) | ✅ aus PDF |

### 03_weitere_branchen
Zukunft — leer bis Expansion.

---

## Dateiformat `overview.md`

```yaml
---
type: regulation
subtype: [dguv-regel | dguv-information | gesetz | verordnung | norm]
number: "..."
title: "..."
publisher: "..."
year: YYYY
pages: N
scope: [all-sectors | sicherheitsdienstleistungen | veranstaltungen]
relevance: [stichworte]
norm_anchors: [CL-xx]
bot_may_cite: false
source_file: inputs/raw_standards/...
last_reviewed: YYYY-MM-DD
status: [stub | reviewed]
---
```

Struktur nach YAML:
1. Zweck (2–3 Sätze)
2. Inhaltsstruktur (Kapitel-Tabelle)
3. Kernaussagen für den Bot
4. Relevanz für Cert-Expert / DIN 77200-2
5. Was der Bot **nicht** darf

**Status-Legende:** `⬜ offen` = kein Inhalt | `⚠️ Stub` = Website-Recherche, PDF ungelesen | `✅ aus PDF` = aus Quelldokument erarbeitet

---

## Quellen (Rohmaterial in OneDrive)

`02_QM_und_Wissen/01_Normen_Gesetze_Verordnungen/` — PDFs und Originaldokumente.
Extraktion in `overview.md` erfolgt manuell oder per Bot nach Download.
