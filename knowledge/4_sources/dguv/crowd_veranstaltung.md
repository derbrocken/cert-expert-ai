---
source_id: dguv-info-crowd
source_type: dguv
title: Personenansammlungen und Veranstaltungen (Praxisextrakt)
raw_location: pending — siehe inputs/raw_standards/ (DGUV-Info noch nicht abgelegt)
curated_date: 2026-06-01
review_status: draft
applies_to_sdls: [veranstaltungsschutz]
applies_to_subtypes: [konzert, festival, grossveranstaltung, fussball]
applies_to_products: [gb, sk, ek]
---

# Crowd / Personenansammlungen — Praxisextrakt (Draft)

**Abgrenzung:** Kein Ersatz für `2_regulations/dguv_v1/overview.md` (TOP/Prävention).
Kein Ersatz für `8_guides/risk_patterns/crowd_dynamics.md` (detailliertes Pattern).
Dieses Modul ist **kurz** für Blueprint-Ladung unter `4_sources/dguv/`.

**Primärquelle:** Noch **nicht** aus DGUV-PDF extrahiert — Inhalt aus intern kuratierten
Veranstaltungsprinzipien; vor `released` gegen DGUV Information (Crowd/Veranstaltung) prüfen.

---

## 1. Gefährdungsarten

Thematisches Raster für Veranstaltungen mit Personenansammlung:

| Klasse | Typische Effekte (ohne Zahlen) |
|--------|--------------------------------|
| **Dichte / Druck** | Gedränge, Sturz, Erstickungsgefahr an Engstellen, Front-of-Stage |
| **Strömung** | Gegenströme, Rückstau an Ein-/Ausgang, Kreuzungspunkte |
| **Information** | Unklare Wege, fehlende Durchsagen, widersprüchliche Signale → Panik |
| **Emotion / Anlass** | Tore, Show-Peak, Konflikte zwischen Lagern, Alkohol |
| **Infrastruktur** | Engstellen, Treppen, temporäre Bauten, Wetter (Open-Air) |
| **Organisation** | Unklare Zuständigkeit, Kommunikationsausfall, ungeplante Kapazitätsänderung |

**Nicht ohne Input behaupten:** zulässige Personenzahl, Flächenmaße, konkrete Grenzwerte,
behördliche Auflagen.

---

## 2. Maßnahmenmuster

An Maßnahmenhierarchie orientiert (organisatorisch vor personenbezogen):

- **Steuerung Zugang:** gestaffelter Einlass, Schleusen, Stop-and-Go an Engstellen.
- **Beobachtung:** definierte Beobachtungspunkte für Dichte und Stimmung (nicht erfundene Kopfzahlen).
- **Lenkung:** Beschilderung, Personal an Kreuzungen, Trennung entgegengesetzter Ströme.
- **Front / Bühnennähe:** Barriere, Medical-Schnittstelle, Dichtesteuerung — nur wenn Konzept/Input.
- **Notfall:** Meldekette, Übergabe an Sanität/Behörde; Räumung nur mit Objekt-/SK-Logik.
- **Personal SD:** Schichten, Pausen, Funk — arbeitsschutzbezogen in GB, operativ in EK.

---

## 3. Prüffragen (Reviewer / Bot)

Vor Generierung GB/SK/EK-Abschnitte zu Crowd:

1. Ist **maximale erwartete** Besucherzahl im Input? Sonst `[OFFENER PUNKT]`.
2. Sind **Einlass-, Haupt- und Auslassphase** grob beschrieben?
3. Sind **Engstellen** (Einlass, Front, Treppen, Ausgang) benannt oder als offen markiert?
4. Gibt es **Sanitäts-** und **Kommunikations**-Schnittstelle (ja/nein/offen)?
5. Open-Air: **Wetter** als Risiko erwähnt oder explizit ausgeschlossen?
6. Genre-Subtyp geladen? (Fußball/Konzert ≠ nur Meta-Subtyp `grossveranstaltung`.)

---

## 4. Dokumentationsregeln

| Produkt | Was dokumentieren (Prinzip) |
|---------|----------------------------|
| **SK** | Crowd-Rahmen, Zonen, Eskalation, Schnittstellen Behörde/Sanität |
| **GB** | Gefährdungen/Maßnahmen für **SMA-Tätigkeit** in Crowd-Lagen |
| **EK** | Kräfte an Einlass/Front/Abschnitten, Phasen, Funk, Notfallmeldung |

Nachweise (Checkliste, nicht als erledigt behaupten): Lagebesprechung, Einweisung Crowd-Punkte,
Abstimmung mit Veranstalter zu Kapazität/Stopps.

---

## 5. Formulierungsbausteine

- „Sofern im Auftrag eine maximale Besucherzahl genannt ist, werden Engstellen an … gesondert betrachtet.“
- „Die Dichte vor der Bühne / am Einlass wird durch … beobachtet; bei Erreichen definierter Schwellen …“
  → Schwellen **nur** aus Input/Konzept, sonst `[OFFENER PUNKT]`.
- „Der Sanitätsdienst wird bei gesundheitlichen Notlagen in der Menge über … informiert.“
- „Eine Räumung erfolgt nach Vorgabe des Veranstalters / der Objektlogik; ohne Vorlage `[OFFENER PUNKT]`.“

---

## 6. Offene Punkte / Nicht-erfinden-Regeln

- **Keine** Personenzahl, Fläche m², „Max. X Personen/m²“ ohne Input.
- **Keine** DGUV-Informationsnummern oder Paragrafen erfinden.
- **Keine** Mindestanzahl Ordner/SMA aus dieser Quelle.
- Harte Bot-Regeln: `knowledge/10_rules/base/hallucination_boundaries.md`,
  `open_points_rules.md`.

---

## Freigabe

| Status | Bedingung |
|--------|-----------|
| `draft` | **aktuell** — intern kuratiert, PDF-Abgleich ausstehend |
| `reviewed` | Abgleich mit DGUV-Primärquelle + Fachfreigabe |
| `released` | Blueprint darf `4_sources/dguv/crowd_veranstaltung.md` laden |
