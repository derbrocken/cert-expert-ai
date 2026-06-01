# Knowledge-Gap-Matrix — Veranstaltungstypen (Schicht 2)

**Stand:** 2026-05-30  
**Katalog:** [[VERANSTALTUNGSTYPEN_KATALOG]] · **Quellenplan:** [[../../4_sources/README]] · **Ausbauplan:** [[AUSBAUPLAN]]

**Legende Relevanz SK/GB/EK/ODA:** Hoch = zentral für Dokumentinhalt · Mittel = ergänzend · Niedrig = selten · — = nicht primär  
**Priorität:** P0 = vor SK-Bot-Welle · P1 = nächste SDL-Welle · P2/P3 = später

**Hinweis Kap. 5:** Spalte „77200-2 Kap. 5“ = kann **zusätzlich** zur Schicht 3 geladen werden — **nie** aus dem Typ allein ableiten.

---

## Übersicht

| ID | Subtyp-MD | Prio | GB | SK | EK | ODA | Kap.5 (optional) |
|----|-----------|------|----|----|----|-----|------------------|
| kampfsport | vorhanden | P0 | Hoch | Hoch | Hoch | Mittel | möglich |
| fussball | Entwurf | P0 | Hoch | Hoch | Hoch | Mittel | möglich |
| konzert | Entwurf | P0 | Hoch | Hoch | Hoch | Mittel | möglich |
| grossveranstaltung | Entwurf | P0 | Hoch | Hoch | Hoch | Mittel | häufig möglich |
| festival | fehlt | P1 | Hoch | Hoch | Hoch | Mittel | möglich |
| demonstration | fehlt | P1 | Hoch | Hoch | Hoch | Hoch | möglich |
| stadtfest | fehlt | P1 | Hoch | Mittel | Mittel | Niedrig | selten |
| messe | fehlt | P1 | Hoch | Mittel | Mittel | Mittel | selten |
| motorsport | fehlt | P2 | Hoch | Hoch | Hoch | Mittel | möglich |
| karneval | fehlt | P2 | Hoch | Mittel | Hoch | Niedrig | selten |
| weihnachtsmarkt | fehlt | P2 | Hoch | Mittel | Mittel | Niedrig | selten |
| nachtclub | fehlt | P2 | Hoch | Mittel | Hoch | Mittel | selten |
| sport_allgemein | fehlt | P2 | Hoch | Mittel | Mittel | Niedrig | selten |
| politisch | fehlt | P3 | Hoch | Hoch | Hoch | Hoch | möglich |
| vip_promi | fehlt | P3 | Mittel | Hoch | Hoch | Mittel | möglich |
| religioes | fehlt | P3 | Mittel | Mittel | Mittel | Niedrig | selten |

---

## Detail je Veranstaltungstyp

### `kampfsport` — Priorität P0

| Feld | Inhalt |
|------|--------|
| **Vorhandenes Wissen** | [[subtypes/kampfsport]]; [[base]] Phasen; GB-Examples (Repo); Normprofil 77200-1 |
| **Fehlendes Wissen** | SK-Kapitelmuster; Crowd-Kapazität aus Praxisquellen; Schnittstellen-Karten Polizei/Sanität; Kap.-5-Felder nur in Schicht 3 |
| **Typische Gefährdungen** | Fan-Lager, Ringeindringen, Athletenverletzung, Eskalation bei Wertung |
| **Typische Schutzmaßnahmen** | Ring-Sicherheit, Ein-/Auslauf, Eskalationsstufen, Sanitäts-Sichtlinie |
| **Schnittstellen** | Sanität, Schiedsrichter, Veranstalter, ggf. Polizei |
| **GB / SK / EK / ODA** | Hoch / Hoch / Hoch / Mittel |
| **Priorität** | P0 — Pflege + SK-Vorbereitung |

---

### `fussball` — Priorität P0

| Feld | Inhalt |
|------|--------|
| **Vorhandenes Wissen** | [[subtypes/fussball]] (Entwurf); [[base]] generisch; Rohnotizen ggf. `_knowledge_raw/.../fussball/` (Staging) |
| **Fehlendes Wissen** | Review gegen Gap-Matrix; Auswärts-/Heimfankurve-Tiefe; Pyro/Hausrecht; Stadion vs. kleiner Platz |
| **Typische Gefährdungen** | Massenreaktion, Pyrotechnik, Blockübergriffe, Auswärtskonflikte |
| **Typische Schutzmaßnahmen** | Blocktrennung, Einlasskontrolle, Video/Deeskalation, Polizeiabstimmung |
| **Schnittstellen** | Stadionbetrieb, Polizei, Ordner, Veranstalter |
| **GB / SK / EK / ODA** | Hoch / Hoch / Hoch / Mittel |
| **Priorität** | P0 |

---

### `konzert` — Priorität P0

| Feld | Inhalt |
|------|--------|
| **Vorhandenes Wissen** | [[subtypes/konzert]] (Entwurf); [[base]]; VStättVO-Überblick ([[../../2_regulations/VStättVO/overview]]) |
| **Fehlendes Wissen** | Review gegen Gap-Matrix; Moshpit/Front-of-Stage-Tiefe; Akustik/Druck; Indoor vs. Open-Air |
| **Typische Gefährdungen** | Gedränge Front, Sturz aus Höhe, Alkohol, Stage-Diving |
| **Typische Schutzmaßnahmen** | Crowd-Management, Barrieren, Medical-Plan, Einlasswellen |
| **Schnittstellen** | Veranstalter, Technik, Sanität, Feuerwehr |
| **GB / SK / EK / ODA** | Hoch / Hoch / Hoch / Mittel |
| **Priorität** | P0 |

---

### `grossveranstaltung` — Priorität P0

| Feld | Inhalt |
|------|--------|
| **Vorhandenes Wissen** | [[subtypes/grossveranstaltung]] (Entwurf, Meta-Subtyp); [[base]]; Schicht 3 [[../veranstaltung_besondere_sicherheitsrelevanz/base]] (Einstufung, nicht Typ) |
| **Fehlendes Wissen** | Review gegen Gap-Matrix; generische Crowd-Matrix ohne Genre |
| **Typische Gefährdungen** | Massenandrang, Engstellen, Kommunikationsausfall, Wetter |
| **Typische Schutzmaßnahmen** | Einsatzleitung, Sichtachsen, Evakuierungslogik, Kapazitätssteuerung |
| **Schnittstellen** | Behörden, Polizei, Rettungsdienst, Veranstalter |
| **GB / SK / EK / ODA** | Hoch / Hoch / Hoch / Mittel |
| **Priorität** | P0 — Fallback wenn kein Genre-Subtyp |

---

### `festival` — Priorität P1

| Feld | Inhalt |
|------|--------|
| **Vorhandenes Wissen** | [[base]] |
| **Fehlendes Wissen** | `subtypes/festival.md`; Camping, Mehrtageslogistik, Drogenprävention |
| **Typische Gefährdungen** | Übernachtungskonflikte, Drogen/Alkohol, mehrere Bühnen, Diebstahl |
| **Typische Schutzmaßnahmen** | Zonenkonzept, Nachtdienst, Sanitätsnetz, Briefing-Staffelung |
| **Schnittstellen** | Veranstalter, Sanität, Polizei, Technik |
| **GB / SK / EK / ODA** | Hoch / Hoch / Hoch / Mittel |
| **Priorität** | P1 |

---

### `demonstration` — Priorität P1

| Feld | Inhalt |
|------|--------|
| **Vorhandenes Wissen** | [[base]]; Versammlungsrecht nur in `2_regulations` (ausbaubar) |
| **Fehlendes Wissen** | `subtypes/demonstration.md`; Marschroute, Gegenprotest, Deeskalation |
| **Typische Gefährdungen** | Gewaltspirale, Blockade, Medienlage, unklare Verantwortung |
| **Typische Schutzmaßnahmen** | Abstimmung Polizei/Ordnungsamt, Kommunikationsplan, Trennung |
| **Schnittstellen** | Polizei, Ordnungsamt, Veranstalter/Initiative, Presse |
| **GB / SK / EK / ODA** | Hoch / Hoch / Hoch / Hoch |
| **Priorität** | P1 |

---

### `stadtfest` — Priorität P1

| Feld | Inhalt |
|------|--------|
| **Vorhandenes Wissen** | [[base]] |
| **Fehlendes Wissen** | `subtypes/stadtfest.md`; Mischpublikum, temporäre GASTRONOMIE, offene Flächen |
| **Typische Gefährdungen** | Alkohol, Kinder/Familien, Engstellen Budenstraße |
| **Typische Schutzmaßnahmen** | Streifenkonzept, Einweisung Helfer, Kooperation Kommune |
| **Schnittstellen** | Stadt, Feuerwehr, Polizei, Veranstalter |
| **GB / SK / EK / ODA** | Hoch / Mittel / Mittel / Niedrig |
| **Priorität** | P1 |

---

### `messe` — Priorität P1

| Feld | Inhalt |
|------|--------|
| **Vorhandenes Wissen** | [[base]] |
| **Fehlendes Wissen** | `subtypes/messe.md`; Hallenzonen, Ausstellerzugang, Warenwert |
| **Typische Gefährdungen** | Diebstahl, Brandlasten Standbau, Gedränge Eingang |
| **Typische Schutzmaßnahmen** | Zonen- und Ausweiskonzept, Brandwache Koordination |
| **Schnittstellen** | Messeveranstalter, Hallenbetrieb, Feuerwehr |
| **GB / SK / EK / ODA** | Hoch / Mittel / Mittel / Mittel |
| **Priorität** | P1 |

---

### `motorsport` — Priorität P2

| Feld | Inhalt |
|------|--------|
| **Vorhandenes Wissen** | [[base]] |
| **Fehlendes Wissen** | `subtypes/motorsport.md`; Strecken, Paddock, Lärm |
| **Typische Gefährdungen** | Zuschauernähe Strecke, Fahrzeugverkehr, Hitze/Lärm |
| **Typische Schutzmaßnahmen** | Absperrkonzept, Marshall, Notfallfahrzeugwege |
| **Schnittstellen** | Streckenposten, Sanität, Veranstalter |
| **GB / SK / EK / ODA** | Hoch / Hoch / Hoch / Mittel |
| **Priorität** | P2 |

---

### `karneval` — Priorität P2

| Feld | Inhalt |
|------|--------|
| **Vorhandenes Wissen** | [[base]] |
| **Fehlendes Wissen** | `subtypes/karneval.md`; Umzugsroute, mobile Absperrung |
| **Typische Gefährdungen** | Alkohol, Wurfgegenstände, Straßenbahn/Kreuzungen |
| **Typische Schutzmaßnahmen** | Routenabsicherung, Staffelung, Deeskalation |
| **Schnittstellen** | Kommune, Polizei, Veranstalter |
| **GB / SK / EK / ODA** | Hoch / Mittel / Hoch / Niedrig |
| **Priorität** | P2 |

---

### `weihnachtsmarkt` — Priorität P2

| Feld | Inhalt |
|------|--------|
| **Vorhandenes Wissen** | [[base]] |
| **Fehlendes Wissen** | `subtypes/weihnachtsmarkt.md`; saisonal, Glühwein, Wetter |
| **Typische Gefährdungen** | Engstellen, Brandlasten, Rutschgefahr |
| **Typische Schutzmaßnahmen** | Besucherlenkung, Brandvorsorge, Beleuchtung |
| **Schnittstellen** | Stadt, Feuerwehr, Marktbetreiber |
| **GB / SK / EK / ODA** | Hoch / Mittel / Mittel / Niedrig |
| **Priorität** | P2 |

---

### `nachtclub` — Priorität P2

| Feld | Inhalt |
|------|--------|
| **Vorhandenes Wissen** | [[base]] |
| **Fehlendes Wissen** | `subtypes/nachtclub.md`; Türsteher, Kapazität, Nachtrecht |
| **Typische Gefährdungen** | Überfüllung, Gewalt im Innenbereich, Drogen |
| **Typische Schutzmaßnahmen** | Einlasssteuerung, interne Deeskalation, Notausgänge |
| **Schnittstellen** | Betreiber, Polizei (extern), Sanität |
| **GB / SK / EK / ODA** | Hoch / Mittel / Hoch / Mittel |
| **Priorität** | P2 |

---

### `sport_allgemein` — Priorität P2

| Feld | Inhalt |
|------|--------|
| **Vorhandenes Wissen** | [[base]]; Spezifik in `fussball` / `kampfsport` geplant |
| **Fehlendes Wissen** | `subtypes/sport_allgemein.md` als generischer Sport ohne Liga |
| **Typische Gefährdungen** | Publikumsreaktion, Sportflächenzugang |
| **Typische Schutzmaßnahmen** | Absperrung Spielfeld, Einlass |
| **Schnittstellen** | Veranstalter, Sanität |
| **GB / SK / EK / ODA** | Hoch / Mittel / Mittel / Niedrig |
| **Priorität** | P2 — nach `fussball`/`kampfsport` |

---

### `politisch` — Priorität P3

| Feld | Inhalt |
|------|--------|
| **Vorhandenes Wissen** | [[base]]; Überschneidung `demonstration` |
| **Fehlendes Wissen** | `subtypes/politisch.md`; Redner-/VIP-Schutz, Störer |
| **Typische Gefährdungen** | Störaktionen, Medien, Bedrohung |
| **Typische Schutzmaßnahmen** | Zonen, Zugangskontrolle, Abstimmung Ordnungskräfte |
| **Schnittstellen** | Polizei, Veranstalter, Personenschutz |
| **GB / SK / EK / ODA** | Hoch / Hoch / Hoch / Hoch |
| **Priorität** | P3 |

---

### `vip_promi` — Priorität P3

| Feld | Inhalt |
|------|--------|
| **Vorhandenes Wissen** | [[base]] |
| **Fehlendes Wissen** | `subtypes/vip_promi.md`; Personenschutz vs. Veranstaltungsschutz |
| **Typische Gefährdungen** | Übergriffe, Paparazzi, ungeplante Zugänge |
| **Typische Schutzmaßnahmen** | Backstage, Begleitung, Zugangsstufen |
| **Schnittstellen** | Personenschutz, Veranstalter |
| **GB / SK / EK / ODA** | Mittel / Hoch / Hoch / Mittel |
| **Priorität** | P3 |

---

### `religioes` — Priorität P3

| Feld | Inhalt |
|------|--------|
| **Vorhandenes Wissen** | [[base]] |
| **Fehlendes Wissen** | `subtypes/religioes.md`; Prozession, große Gruppen |
| **Typische Gefährdungen** | Gedränge, Konflikte mit Gegengruppen, Wegstrecken |
| **Typische Schutzmaßnahmen** | Routenbegleitung, Deeskalation |
| **Schnittstellen** | Gemeinden, Polizei |
| **GB / SK / EK / ODA** | Mittel / Mittel / Mittel / Niedrig |
| **Priorität** | P3 |

---

## Prioritäten-Roadmap (Ausarbeitung `subtypes/*.md`)

| Welle | Subtypen | Abhängigkeiten |
|-------|----------|----------------|
| **Welle 0** | `kampfsport` (Review) | — |
| **Welle 1 (P0)** | `fussball`, `konzert`, `grossveranstaltung` | `6_products/sicherheitskonzept/` Grundgerüst; DGUV-Crowd-Extrakte ([[../../4_sources/dguv/README]]) |
| **Welle 2 (P1)** | `festival`, `demonstration`, `stadtfest`, `messe` | Behörden-Leitfäden ([[../../4_sources/behoerden/README]]) |
| **Welle 3 (P2–P3)** | übrige Katalog-Einträge | nach Pilotkundenbedarf |

**Produktkette (unverändert):** SK → GB → EK → ODA — Subtyp-Wissen speist vor allem **GB** und **SK**; **EK** braucht Einsatzlogik aus Subtyp + SK; **ODA** nur bei Objekt-/Dauerbezug.
