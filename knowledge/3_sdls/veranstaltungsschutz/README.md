# Veranstaltungsschutz — allgemeine SDL-Basis (77200-1)

**Rolle:** **Schicht 1** der Bot-SDL-Ladereihenfolge für Veranstaltungen (allgemeiner Veranstaltungsdienst).

| Datei | Inhalt |
|-------|--------|
| [[base]] | Phasen, typische Aufgaben, Gefährdungs-/Maßnahmen-Raster, Schnittstellenlogik |
| `subtypes/*.md` | **Schicht 2** — Event-Untertypen (s. unten) |

**Norm-CEKS (nicht Bot-Kontext):** [[../../1_standards/DIN 77200-1/anforderungsprofile/77200-1_veranstaltungsdienst]] · ggf. [[../../1_standards/DIN 77200-2/05_veranstaltungen_besondere_sicherheitsrelevanz]] für Kap. 5

---

## Ordner `subtypes/`

Spezifische **Event-Untertypen** — ergänzen die Basis, ersetzen sie nicht:

| Subtyp (Beispiel) | Datei | Status |
|-------------------|------|--------|
| Kampfsport | [[subtypes/kampfsport]] | vorhanden |
| Festival, Konzert, Messe, Fußball, … | `subtypes/{name}.md` | bei Bedarf anlegen |

Jeder Subtyp beschreibt genrespezifische Risiken und Maßnahmen (z. B. Ring, Fan-Lager, Crowd bei Sport).

---

## Keine Dublette zu `veranstaltung_besondere_sicherheitsrelevanz/`

| | `veranstaltungsschutz/` (hier) | `veranstaltung_besondere_sicherheitsrelevanz/` |
|--|-------------------------------|-----------------------------------------------|
| Norm | 77200-1 Veranstaltungsdienst | **77200-2 Kap. 5** |
| Inhalt | allgemeine Veranstaltungslogik | AG-Einstufung, SK+EK-Pflicht, Schutzbedarf |
| Bot | immer bei Event-Blueprints sinnvoll | **zusätzlich**, wenn Kap. 5 / besondere Relevanz |

Ladereihenfolge: [[../README#SDL-Layer für Dokumentenbots (Veranstaltung)]]
