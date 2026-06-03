# SDL-Zusatzqualifikationen

SDL-spezifische Anforderungen **zusätzlich** zu Stufe A/B/C und Pflichtqualifikationen.

Bezug: 4.19.1 · DIN 77200-2 Kap. 5–8 · Anhang C

---

## Leitregel

Zusatzqualifikationen entstehen aus:

1. **Norm-Sonderregeln** (z. B. Interventionsdienst 4.19.1),
2. **besonderen SDL** nach DIN 77200-2,
3. **vertraglichen / objektbezogenen** Ergänzungen (nicht im Anforderungsprofil-Matrixfeld).

Freigabe erst nach Nachweis → [[05_sdl_freigabelogik]]

---

## Interventionsdienst

**Normanker:** 4.19.1 (zusätzlich zu Profil-Stufe)

| Anforderung | Nachweis | Status |
|-------------|----------|--------|
| Tätigkeitsbezogene Schulung | **24-stündige** interventionsbezogene Schulungsmaßnahme | vorhanden / fehlt |
| Praxisnachweis | **Fünf** durchgeführte Interventionen dokumentiert | Anzahl / Nachweisliste |
| SDL-Zuordnung | Freigabe nur für Verwendung **Interventionsdienst** | siehe 05 |

**Abgrenzung:** 24-h-Schulung = **Erstqualifikation** (4.19.1), nicht Weiterbildungs-UE → [[04_weiterbildungslogik]]

**Profilbezug:** Interventions-Tätigkeiten im Anforderungsprofil aktivieren Stufe A/B/C **und** lösen Zusatznachweis aus.

---

## DIN 77200-2 — besondere SDL (Platzhalter)

Für folgende Anwendungsgruppen sind **besondere Schulungen / Unterweisungen / UE-Nachweise** vorgesehen. Detailinhalte folgen mit Schulungsdokumenten (Kap. 5–8, VA, Teil-2-Unterlagen).

### Veranstaltungen mit besonderer Sicherheitsrelevanz (Kap. 5 / Anhang C.1)

| Feld | Status |
|------|--------|
| Referenz Anhang | C.1 |
| Zusatzschulungen | **[PLATZHALTER]** — Inhalte Kap. 5 |
| UE-Nachweise | **[PLATZHALTER]** |
| Deeskalation / Crowd | **[PLATZHALTER]** — vgl. Anhang B 77200-2 |
| SK/EK-Bezug | Qualifikationsplanung aus Sicherheits-/Einsatzkonzept |

### Öffentlicher Personenverkehr / ÖPNV (Kap. 6 / Anhang C.2)

| Feld | Status |
|------|--------|
| Referenz Anhang | C.2 |
| Zusatzschulungen | **[PLATZHALTER]** — Kap. 6.4 „auf Grundlage EK“ |
| UE-Nachweise | **[PLATZHALTER]** |
| Verkehrs-/Fahrgastkontext | **[PLATZHALTER]** |

### Objekte mit besonderer Sicherheitsrelevanz (Kap. 7 / Anhang C.3)

| Feld | Status |
|------|--------|
| Referenz Anhang | C.3 |
| Zusatzschulungen | **[PLATZHALTER]** — Kap. 7 |
| UE-Nachweise | **[PLATZHALTER]** |
| Objektsicherheitsniveau | häufig höhere Stufen in C.3 — Profil + Nachweis |

### Flüchtlings- und Asylunterkünfte (Kap. 8 / Anhang C.4)

| Feld | Status |
|------|--------|
| Referenz Anhang | C.4 |
| Zusatzschulungen | **[PLATZHALTER]** — Kap. 7–8 WB-Bezug |
| UE-Nachweise | **[PLATZHALTER]** |
| Deeskalation / Hausordnung | **[PLATZHALTER]** — vgl. Anhang B |

---

## Weitere SDL (77200-1) — Orientierung

| SDL | Zusatzqualifikation typisch | Detail |
|-----|----------------------------|--------|
| Alarmdienst | Technik-Einweisung objektbezogen | Einweisung ≠ Zusatzzeugnis, sofern nicht vertraglich |
| Revierdienst / mobil | Mehr-Objekt-Einweisungen | Matrix Objekt × Nachweis |
| Veranstaltungssicherungsdienst (77200-1) | Personen-/Gepäckkontrolle — Stufe aus Profil | Kein 77200-2-Zusatz unless besondere Relevanz |

---

## Prüfebene (pro SMA × SDL)

| Feld | Beschreibung |
|------|--------------|
| `sdl` | Ziel-SDL / Verwendung |
| `zusatz_anforderung` | z. B. „24h Intervention“, „Kap.6 ÖPNV-Schulung“ |
| `nachweis_vorhanden` | ja / nein / teilweise |
| `gueltig_bis` | optional |
| `freigabe_relevant` | ja |

---

## Offene Einarbeitung

- [ ] VA Kap. 7 V9 — SDL-spezifische Schulungsmatrix
- [ ] Schulungsdokumente 77200-2 Teil 2 / Kap. 5–8
- [ ] Mapping Anhang C → konkrete Zusatznachweise je Vorlage in `anforderungsprofile/`
