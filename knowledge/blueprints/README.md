# knowledge/blueprints/

Maschinenlesbare Blueprint-Konfigurationsdateien (JSON).
Jede Datei beschreibt einen Blueprint als Komposition von Wissensmodulen
aus den anderen `knowledge/`-Kategorien.

---

## Regeln

- **Maschinenlesbar, nicht für Qwen.** Blueprint-Configs werden von `shared/blueprint_loader.py`
  gelesen. Sie gelangen **nicht** in den Qwen-Kontext — sie steuern den Context Builder.

- **Blueprints besitzen keine Module.** Sie referenzieren Module aus `standards/`, `sdls/`,
  `products/`, `rules/`, `guides/`, `examples/` und `prompts/`.
  Mehrere Blueprints können dieselben Module teilen.

- **Ein Blueprint = eine Komposition.** `gb_event_kampfsport.json` und `gb_event_festival.json`
  teilen `sdls/veranstaltungsschutz/base.md`, laden aber verschiedene Subtypes.

---

## Namenskonvention

```
{document_product}_{sdl_bereich}_{subtyp}.json
```

Beispiele:
- `gb_event_kampfsport.json`
- `gb_event_festival.json`
- `gb_object_standard.json`
- `sk_event_standard.json`
- `ec_event_kampfsport.json`
- `oda_standard.json`

---

## Pflichtfelder einer Blueprint-Config

```json
{
  "blueprint_id":   "gb_event_kampfsport",
  "display_name":   "Gefährdungsbeurteilung — Kampfsportveranstaltung",
  "version":        "1.0",
  "template_file":  "templates/gb_event_kampfsport.docx",
  "modes":          ["standalone", "flow"],

  "context_modules": {
    "standards":  [ ... ],
    "sdls":       [ ... ],
    "products":   [ ... ],
    "rules":      [ ... ],
    "guides":     [ ... ],
    "examples":   [ ... ],
    "prompts":    [ ... ]
  },

  "conditional_modules": [ ... ],

  "input_schema": {
    "required": [ ... ],
    "optional": [ ... ],
    "critical_triggers": [ ... ]
  },

  "ai_blocks":  [ ... ],
  "upstream":   [ ... ],
  "downstream": [ ... ],
  "exports":    [ ... ]
}
```

Vollständige Schema-Spezifikation: `docs/BLUEPRINT_ARCHITECTURE.md`.
