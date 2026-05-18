# knowledge/products/

Wissen über die Cert-Expert-Dokumentprodukte: Zweck, Aufbau, Inhaltsblöcke,
Platzhalter-Definitionen und Cert-Expert-spezifische Terminologie.

---

## Regeln

- **Pro Dokumentprodukt ein Unterordner.** `gefaehrdungsbeurteilung/`, `sicherheitskonzept/`,
  `einsatzkonzept/`, `oda/` und `cert_expert/` (allgemeine Terminologie).

- **Immer geladen wenn das Produkt aktiv ist.** `gefaehrdungsbeurteilung/content_blocks.md`
  wird für alle GB-Blueprints geladen — unabhängig vom spezifischen Blueprint.

- **Kein SDL-Wissen hier.** Gefährdungsinhalte gehören in `sdls/`.
  `products/` erklärt nur, *was ein Dokument ist* und *was jeder Inhaltsblock enthalten muss*.

---

## Ordner

| Ordner | Inhalt |
|---|---|
| `gefaehrdungsbeurteilung/` | Zweck, Kapitelstruktur, GB_*-Platzhalter und ihre Anforderungen |
| `sicherheitskonzept/` | Zweck, Kapitelstruktur, SK_*-Platzhalter |
| `einsatzkonzept/` | Zweck, Kapitelstruktur, EC_*-Platzhalter |
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
