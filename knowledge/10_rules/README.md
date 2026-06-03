# knowledge/10_rules/

Harte Verhaltensregeln für die Fachbots.
Die wichtigste Kategorie für Halluzinationsschutz und OFFENER PUNKT-Logik.

---

## Regeln für diesen Ordner

- **Drei Ebenen, kumulativ.** Regeln werden in der Reihenfolge `base/` → `products/` →
  `blueprints/` geladen. Jede Ebene kann präzisieren, aber nicht die Ebene darunter
  außer Kraft setzen.

- **`base/` immer laden.** Alle vier `base/`-Dateien werden für jeden Bot-Aufruf
  geladen — unabhängig vom Blueprint.

- **Kurz und imperativ.** Regeldateien sind präzise formuliert ("Du darfst niemals...",
  "Wenn X fehlt, schreibe..."). Keine Prosa, keine Erklärungen.

- **Gesamtbudget `base/`: max. 500 Tokens.** Alle vier Basisdateien zusammen müssen
  unter 500 Tokens bleiben.

---

## Ebenen

### `base/` — Universell, immer geladen

| Datei | Inhalt |
|---|---|
| `hallucination_boundaries.md` | Was der Bot unter keinen Umständen erfinden darf |
| `open_points_rules.md` | Wann und wie `[OFFENER PUNKT]` ausgelöst und formuliert wird |
| `citation_rules.md` | Keine Paragrafennummern ohne Quellenangabe im Input |
| `output_format_rules.md` | Immer JSON, immer die definierten Keys, keine freie Prosa |

### `products/` — Pro Dokumentprodukt, geladen wenn dieses Produkt aktiv

| Datei | Gilt für |
|---|---|
| `gb_rules.md` | Alle GB-Blueprints |
| `sk_rules.md` | Alle SK-Blueprints |
| `ec_rules.md` | Alle EC-Blueprints |
| `oda_rules.md` | Alle ODA-Blueprints |

### `blueprints/` — Sonderregeln für spezifische Blueprints oder -familien

| Datei | Gilt für |
|---|---|
| `gb_event.md` | Alle GB-Event-Blueprints (gemeinsame Sonderregeln) |
| `gb_event_kampfsport.md` | Nur Kampfsport-spezifische Sonderregeln |
| `gb_object.md` | Alle GB-Objekt-Blueprints |
| `gb_accommodation.md` | Unterkunfts-Blueprints |

Nur anlegen wenn ein Blueprint tatsächlich Sonderregeln benötigt, die nicht
in `gb_event.md` oder `gb_rules.md` passen.
