# knowledge/sdls/

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

## Ordner

| Ordner | Bereich |
|---|---|
| `veranstaltungsschutz/` | Veranstaltungen aller Art — Basis + Subtypes (kampfsport, festival, konzert, messe) |
| `objektschutz/` | Stationärer Objektschutz — Basis + Subtypes (standard, sondergebaeude, opv) |
| `interventionsdienst/` | Alarmreaktion und Intervention — Basis + Subtypes |
| `mobile_sicherheit/` | Streifendienst, mobile Einsätze — Basis + Subtypes (alleinarbeit) |
| `unterkunft/` | Gemeinschaftsunterkünfte — Basis + Subtypes (gefluechtete, wohnheim) |
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
