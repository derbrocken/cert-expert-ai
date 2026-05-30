# knowledge/3_sdls/

Fachliches Domänenwissen pro Sicherheitsdienstleistungsbereich (SDL).
SDLs definieren typische Gefährdungen, Risikoprofile, Schutzmaßnahmen und
branchenübliche Vorgehensweisen für einen bestimmten Tätigkeitsbereich.

---

## Regeln

- **Basis + Subtyp.** Jeder SDL-Ordner enthält `base.md` (allgemeines Basiswissen
  für diesen Bereich) und einen `subtypes/`-Unterordner für spezifische Anwendungsfälle.
  Ein Blueprint lädt immer `base.md` **und** den relevanten Subtyp — nie nur einen von beiden.

- **Blueprint-selektiv.** Ein Kampfsport-Blueprint lädt `veranstaltungsschutz/base.md`
  und `subtypes/kampfsport.md`. Ein Objektschutz-Blueprint lädt `objektschutz/base.md`
  und keinen Veranstaltungsschutz-Inhalt.

- **Kein Kundeninhalt.** SDL-Module beschreiben typische, generische Gefährdungen —
  keine konkreten Kundenprojekte oder Standortdaten.

- **Fachlich, nicht rechtlich.** SDL-Module beschreiben Praxis-Wissen.
  Rechtliche Grundlagen gehören in `standards/`.

---

## SDL-Layer für Dokumentenbots (Veranstaltung)

Für **Veranstaltungs-**Dokumente (GB, SK, EK, ODA) werden SDL-Schichten **kombiniert** — Ordner **nicht** zusammenführen, **keine** Umbenennung, **keine** Migration.

```
Schicht 4 — Produktwissen     knowledge/6_products/{Gefährdungsbeurteilung|sicherheitskonzept|einsatzkonzept|oda}/
Schicht 3 — 77200-2 Kap. 5    knowledge/3_sdls/veranstaltung_besondere_sicherheitsrelevanz/base.md   (optional, wenn zutreffend)
Schicht 2 — Event-Subtyp      knowledge/3_sdls/veranstaltungsschutz/subtypes/{kampfsport|fussball|konzert|…}.md   (optional)
Schicht 1 — SDL-Basis        knowledge/3_sdls/veranstaltungsschutz/base.md
```

| Schicht | Pfad | Rolle |
|---------|------|--------|
| **1 — Allgemeine SDL-Basis** | `veranstaltungsschutz/` | Veranstaltungsschutz allgemein (77200-1): Phasen, Crowd, Schnittstellen — [[veranstaltungsschutz/base]] |
| **2 — Subtype (optional)** | `veranstaltungsschutz/subtypes/` | Spezifische Event-Untertypen: Kampfsport, Fußball, Konzert, Festival, Messe, … — [[veranstaltungsschutz/README#Ordner subtypes/]] |
| **3 — Besondere Sicherheitsrelevanz (optional)** | `veranstaltung_besondere_sicherheitsrelevanz/` | **Keine Dublette** — **Zusatzschicht** DIN 77200-2 Kap. 5: AG-Einstufung, SK+EK-Pflicht, Schutzbedarf — [[veranstaltung_besondere_sicherheitsrelevanz/base]] |
| **4 — Produkt** | `6_products/` | Dokumenttyp: GB, SK, EK, ODA — Platzhalter, Kapitellogik, Abhängigkeiten SK→GB→EK→ODA |

**Blueprint** listet in `context_modules` explizit, welche Pfade geladen werden (s. `knowledge/7_blueprint/*.json`).

**Beispiele:**

| Fall | Schichten laden |
|------|-----------------|
| Stadtfest, 77200-1 | 1 (+ ggf. 2) + 4 |
| Kampfsport-Event, 77200-1 | 1 + 2 `kampfsport` + 4 |
| Großevent **besondere Relevanz**, 77200-2 Kap. 5 | **1 + 2 + 3** + 4 |
| Kap. 5 ohne Genre-Subtyp | 1 + 3 + 4 |

Weitere SDL-Ordner (Objekt, ÖPNV, …) folgen dem Muster **Basis + Subtypes** — nur Veranstaltung hat die **zusätzliche** Kap.-5-Schicht.

---

## Ordner

| Ordner | Bereich |
|---|---|
| `veranstaltungsschutz/` | Veranstaltungen aller Art (77200-1) — Basis + Subtypes (kampfsport, festival, konzert, messe) |
| `veranstaltung_besondere_sicherheitsrelevanz/` | **77200-2 Kap. 5** — besondere Relevanz, SK+EK-Pflicht — [[veranstaltung_besondere_sicherheitsrelevanz/base]] |
| `objektschutz/` | Stationärer Objektschutz — Basis + Subtypes (standard, sondergebäude, opv) |
| `interventionsdienst/` | Alarmreaktion und Intervention — Basis + Subtypes |
| `mobile_sicherheit/` | Streifendienst, mobile Einsätze — Basis + Subtypes (alleinarbeit) |
| `unterkunft/` | Gemeinschaftsunterkünfte — Basis + Subtypes (geflüchtete, wohnheim) |
| `empfangsdienst/` | Empfang und Besucherkontrolle |
| `opv/` | ÖPNV / Öffentlicher Personennahverkehr |

---

## Dateiformat

Jede `base.md` enthält:
1. Beschreibung des Tätigkeitsbereichs (2–3 Sätze)
2. Typische Gefährdungskategorien für diesen Bereich
3. Übliche Schutzmaßnahmen (allgemein)
4. Besonderheiten dieses Bereichs (was unterscheidet ihn von anderen?)

Jede `subtypes/{name}.md` enthält:
1. Was diesen Subtyp von der Basis unterscheidet
2. Subtyp-spezifische Gefährdungen (ergänzend zu base)
3. Subtyp-spezifische Maßnahmen oder Anforderungen

**Maximale Größe:** `base.md` ~800 Tokens, Subtyp ~600 Tokens
