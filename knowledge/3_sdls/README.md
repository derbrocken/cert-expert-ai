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

Für **Veranstaltungs-**Dokumente (GB, SK, EK, ODA) werden SDL-Schichten **kombiniert** — Ordner **nicht** zusammenführen, **keine** Umbenennung, **keine** Migration, **keine** kombinierten Ordner wie `kampfsport_besonders/`.

### Veranstaltungstyp vs. Sicherheitsrelevanz (zwei unabhängige Achsen)

| Achse | Was es ist | Wo im Knowledge | Automatisch? |
|-------|------------|-----------------|--------------|
| **Veranstaltungstyp** | Genre/Format des Events (Kampfsport, Fußball, Konzert, Festival, …) | `veranstaltungsschutz/subtypes/{typ}.md` | Aus Blueprint/Input (`event_type`, Subtyp-ID) |
| **Besondere Sicherheitsrelevanz** | **Einstufung/Klassifizierung** durch den AG (DIN 77200-2 Kap. 5) — erhöhter Schutzbedarf, SK+EK-Pflicht | `veranstaltung_besondere_sicherheitsrelevanz/base.md` | **Nur** wenn Einstufung im Auftrag/Input belegt ist |

**Wichtig:** **Kampfsport ist ein Veranstaltungstyp (Schicht 2), keine Sicherheitsklasse.** Ein Kampfsport-Event kann **ohne** besondere Sicherheitsrelevanz (nur 77200-1) oder **mit** AG-Einstufung (zusätzlich Schicht 3) laufen. **Niemals** Schicht 3 allein aus „Kampfsport“ ableiten.

```
Schicht 4 — Produktwissen          knowledge/6_products/{gb|sk|ec|oda}/…
Schicht 3 — Sicherheitsrelevanz      knowledge/3_sdls/veranstaltung_besondere_sicherheitsrelevanz/base.md   # nur bei Einstufung
Schicht 2 — Veranstaltungstyp        knowledge/3_sdls/veranstaltungsschutz/subtypes/{kampfsport|fussball|konzert|…}.md   # optional
Schicht 1 — Veranstaltungsschutz     knowledge/3_sdls/veranstaltungsschutz/base.md
```

| Schicht | Pfad | Rolle |
|---------|------|--------|
| **1 — Veranstaltungsschutz (Basis)** | `veranstaltungsschutz/` | Allgemeine SDL-Basis für Veranstaltungen (77200-1): Phasen, Crowd, Schnittstellen — [[veranstaltungsschutz/base]] |
| **2 — Veranstaltungstyp (optional)** | `veranstaltungsschutz/subtypes/` | **Veranstaltungstypen**, nicht Sicherheitsklassen: Kampfsport, Fußball, Konzert, … — [[veranstaltungsschutz/README#Ordner subtypes/]] |
| **3 — Besondere Sicherheitsrelevanz (optional)** | `veranstaltung_besondere_sicherheitsrelevanz/` | **Zusatzschicht / Sicherheitsklasse** DIN 77200-2 Kap. 5 — nur bei dokumentierter AG-Einstufung — [[veranstaltung_besondere_sicherheitsrelevanz/base]] |
| **4 — Produkt** | `6_products/` | GB, SK, EK, ODA — Inhaltsblöcke und Dokumentlogik |

### Skalierbare Bot-Logik (`context_modules.sdls`)

Der Blueprint (oder Orchestrator) setzt **explizit**, welche SDL-Dateien geladen werden — **keine** automatische Kopplung Typ ↔ Kap. 5.

```yaml
# Beispiel: Kampfsport, ohne besondere Sicherheitsrelevanz (77200-1)
context_modules:
  sdls:
    - veranstaltungsschutz/base.md
    - veranstaltungsschutz/subtypes/kampfsport.md
    # veranstaltung_besondere_sicherheitsrelevanz/base.md  ← NICHT laden

# Beispiel: Kampfsport, mit AG-Einstufung besondere Sicherheitsrelevanz (77200-2 Kap. 5)
context_modules:
  sdls:
    - veranstaltungsschutz/base.md
    - veranstaltungsschutz/subtypes/kampfsport.md
    - veranstaltung_besondere_sicherheitsrelevanz/base.md   # nur wenn Einstufung zutrifft
```

Entscheidung Schicht 3 über Input-Felder (perspektivisch), z. B. `besondere_sicherheitsrelevanz: ja`, `norm_context: 77200-2-kap5`, `profil_ref: 77200-2_veranstaltung_…` — nicht über `combat_sports_type` allein.

### Beispiele (Kombinationen)

| Fall | Schichten | Hinweis |
|------|-----------|---------|
| **Kampfsport normal** (77200-1, kein Kap.-5-Tatbestand) | **1 + 2** + 4 | Subtyp `kampfsport`, **ohne** `veranstaltung_besondere_sicherheitsrelevanz/base` |
| **Kampfsport + besondere Sicherheitsrelevanz** (AG-Einstufung, Kap. 5) | **1 + 2 + 3** + 4 | Gleicher Subtyp + **zusätzlich** Schicht 3 |
| Konzert ohne Einstufung | 1 + 2 `konzert` + 4 | Typ unabhängig von Schicht 3 |
| Großevent Kap. 5, Typ unklar/allgemein | 1 + 3 + 4 | Schicht 3 **ohne** Subtyp möglich |
| Stadtfest 77200-1 | 1 (+ ggf. 2) + 4 | Kein Subtyp nötig |

Weitere SDL-Ordner (Objekt, ÖPNV, …) folgen **Basis + Subtypes** — nur Veranstaltung hat die **orthogonale** Kap.-5-Schicht (Sicherheitsrelevanz ≠ Veranstaltungstyp).

---

## Ordner

| Ordner | Bereich |
|---|---|
| `veranstaltungsschutz/` | Veranstaltungen (77200-1) — Basis + Subtypes; Katalog/Gap/Ausbauplan unter diesem Ordner |
| `4_sources/` (Repo-Root `knowledge/`) | DGUV-/Behörden-/Praxis-Extrakte — siehe [[../4_sources/README]] |
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
