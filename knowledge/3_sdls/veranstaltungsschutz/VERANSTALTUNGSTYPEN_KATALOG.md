# Veranstaltungstypen-Katalog (SDL Schicht 2)

**Stand:** 2026-06-01  
**SDL-Basis:** [[base]] · **Gap-Matrix:** [[SUBTYPE_GAP_MATRIX]] · **Ausbauplan:** [[AUSBAUPLAN]]

---

## Abgrenzung (verbindlich)

| Konzept | Bedeutung | Pfad |
|---------|-----------|------|
| **Veranstaltungstyp** | Genre/Format des Events | `subtypes/{slug}.md` — **dieser Katalog** |
| **Besondere Sicherheitsrelevanz** | AG-Einstufung nach DIN 77200-2 Kap. 5 | `veranstaltung_besondere_sicherheitsrelevanz/base.md` — **nicht** hier |

**Kein Veranstaltungstyp löst Kap. 5 automatisch aus** — auch nicht „Großveranstaltung“, „Demonstration“ oder „VIP-Event“. Schicht 3 nur bei dokumentierter Einstufung ([[../README#SDL-Layer für Dokumentenbots (Veranstaltung)]]).

---

## Katalog

| ID | Veranstaltungstyp | Datei (`subtypes/`) | Status | Kurzprofil |
|----|-------------------|---------------------|--------|------------|
| `kampfsport` | Kampfsport | [[subtypes/kampfsport]] | **reviewed** | Ring/MMA/Boxen; Fan-Lager; Athletenrisiko |
| `fussball` | Fußball | [[subtypes/fussball]] | **reviewed** | Fan-Kurve, Stadion/Amateur, Pyro-Risiko |
| `konzert` | Konzert | [[subtypes/konzert]] | **reviewed** | Bühnennähe, Moshpit, Indoor/Open-Air |
| `festival` | Festival | `festival.md` | geplant | Mehrtägig, Camping, mehrere Bühnen, Drogen/Alkohol |
| `stadtfest` | Stadtfest | `stadtfest.md` | geplant | Offene Flächen, Mischpublikum, temporäre Gastronomie |
| `messe` | Messe | `messe.md` | geplant | Hallen, Aussteller, Warenwert, Zutrittszonen |
| `demonstration` | Demonstration / Versammlung | `demonstration.md` | geplant | Versammlungsrecht, Gegenversammlung, Dynamik/Marsch |
| `politisch` | Politische Veranstaltung | `politisch.md` | geplant | Redner-/Parteischutz, Störer, Medien |
| `vip_promi` | VIP- / Promi-Event | `vip_promi.md` | geplant | Personenschutz-Schnittstelle, Zugangshierarchien |
| `nachtclub` | Nachtclub / Party | `nachtclub.md` | geplant | Nachtbetrieb, Alkohol, Türsteher-Logik, Kapazität |
| `religioes` | Religiöse Veranstaltung | `religioes.md` | geplant | Prozession, Andacht, große homogene Gruppen |
| `sport_allgemein` | Sportveranstaltung (allgemein) | `sport_allgemein.md` | geplant | Generisches Sport-Event ohne Liga-Spezifik |
| `motorsport` | Motorsport | `motorsport.md` | geplant | Streckenabsicherung, Boxengasse, Lärm/Abstand |
| `weihnachtsmarkt` | Weihnachtsmarkt | `weihnachtsmarkt.md` | geplant | Saisonale Fläche, Glühwein, Engstellen, Wetter |
| `karneval` | Karneval / Umzug | `karneval.md` | geplant | Zug / mobile Route, Kostüme, Alkohol, Straßenraum |
| `grossveranstaltung` | Großveranstaltung (allgemein) | [[subtypes/grossveranstaltung]] | **reviewed** | Meta-Subtyp; Fallback; nicht Kap. 5 |

---

## Bot-Ladung (`context_modules.sdls`)

Immer **Schicht 1** (`veranstaltungsschutz/base.md`) + **optional genau ein** Eintrag aus dieser Tabelle (Schicht 2).  
Schicht 3 (`veranstaltung_besondere_sicherheitsrelevanz/base.md`) **unabhängig** — siehe [[README]].

```yaml
# Beispiel: Fußball-Event (Subtyp reviewed — Blueprint noch anlegen)
sdls:
  - veranstaltungsschutz/base.md
  - veranstaltungsschutz/subtypes/fussball.md
```

**Regel:** Keine kombinierten Ordner (`kampfsport_besonders/`). Kombinationen nur über mehrere `context_modules`-Einträge.

---

## Priorität Ausarbeitung (Überblick)

Siehe Detail in [[SUBTYPE_GAP_MATRIX#Prioritäten-Roadmap]].

| Priorität | Typen (Auszug) |
|-----------|----------------|
| **P0** | `kampfsport` (Pflege), `fussball`, `konzert`, `grossveranstaltung` |
| **P1** | `festival`, `demonstration`, `stadtfest`, `messe` |
| **P2** | `motorsport`, `karneval`, `weihnachtsmarkt`, `nachtclub`, `sport_allgemein` |
| **P3** | `politisch`, `vip_promi`, `religioes` |

---

## Schnittstellen (querschnittlich)

Partnerrollen (Sanität, Polizei, Feuerwehr, Veranstalter, Technik, Rettungsdienst) sind **keine** Veranstaltungstypen — sie gehören in `base.md`, später `knowledge/4_sources/` oder dedizierte Schnittstellen-Module (vgl. `docs/KNOWLEDGE_CURATION_GUIDE.md`).
