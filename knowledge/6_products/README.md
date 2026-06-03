# knowledge/6_products/

Wissen über die Cert-Expert-Dokumentprodukte: Zweck, Aufbau, Inhaltsblöcke,
Platzhalter-Definitionen und Cert-Expert-spezifische Terminologie.

---

## Dokumentenkette (Veranstaltung)

```
SK (Sicherheitskonzept)     — Auftraggeber-/Gesamtperspektive, Schutzziel
        │
        ├──► GB (Gefährdungsbeurteilung)  — arbeitsschutzliche Vertiefung für SMA
        │
        └──► EK (Einsatzkonzept, EC_*)    — operative Umsetzung AN
                    │
                    └──► ODA / Einweisungen (Gerüst 2026-06-02)
```

**Bot-Ladung:** Pro Lauf nur das **Produktmodul** des aktiven Blueprints
(`context_modules.products`) plus SDL/Rules — nie alle Produkte gleichzeitig.
Siehe [[../BOT_CONTEXT_MAP]] und `docs/CONTEXT_ASSEMBLY_POLICY.md`.

| Produkt | Ordner | `purpose.md` | `content_blocks.md` | Bot-Status |
|---------|--------|--------------|---------------------|------------|
| GB | `Gefährdungsbeurteilung/` | ja | ja | **aktiv** (`gb_event_kampfsport`) |
| SK | `sicherheitskonzept/` | ja | ja | geplant |
| EK | `einsatzkonzept/` | ja | ja | geplant |
| ODA | `oda/` | ja | ja | geplant (`oda_event_standard`) |

---

## Regeln

- **Pro Dokumentprodukt ein Unterordner.** `Gefährdungsbeurteilung/`, `sicherheitskonzept/`,
  `einsatzkonzept/`, `oda/` und `cert_expert/` (allgemeine Terminologie).

- **SDL-Layer Schicht 4.** Bot-Kontext wird mit SDL-Modulen kombiniert (Basis → optional Subtyp → optional Kap.-5 → **dieses Produkt**). Siehe [[../3_sdls/README#SDL-Layer für Dokumentenbots (Veranstaltung)]].

- **Immer geladen wenn das Produkt aktiv ist.** `Gefährdungsbeurteilung/content_blocks.md`
  wird für alle GB-Blueprints geladen — unabhängig vom spezifischen Blueprint.

- **Kein SDL-Wissen hier.** Gefährdungsinhalte gehören in `sdls/`.
  `products/` erklärt nur, *was ein Dokument ist* und *was jeder Inhaltsblock enthalten muss*.

---

## Ordner

| Ordner | Inhalt |
|---|---|
| `Gefährdungsbeurteilung/` | Zweck, Kapitelstruktur, GB_*-Platzhalter und ihre Anforderungen |
| `sicherheitskonzept/` | Zweck, Kapitelstruktur, SK_*-Platzhalter | **Gerüst** (2026-06-01) |
| `einsatzkonzept/` | Zweck, Kapitelstruktur, EC_*-Platzhalter | **Gerüst** (2026-06-01) |
| `oda/` | Zweck, Kapitelstruktur, ODA_*-Platzhalter |
| `cert_expert/` | Terminologie, bevorzugte Formulierungen, verbotene Ausdrücke |

---

## Dateien pro Produktordner

| Datei | Inhalt |
|---|---|
| `purpose.md` | Was ist dieses Dokument? Wann wird es erstellt? Was ist der rechtliche Rahmen? |
| `structure_guide.md` | Typische Kapitelstruktur, was gehört wohin |
| `content_blocks.md` | Alle Platzhalter dieses Produkts: Name, Inhalt, Anforderungen, Abgrenzungen |

**Maximale Größe:** `content_blocks.md` ~500 Tokens (präzise Definitionen, keine Prosa)
