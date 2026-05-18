# knowledge/prompts/

Wiederverwendbare Prompt-Bausteine und User-Prompt-Templates.
Werden vom Context Builder zu vollständigen Prompts assembliert.

---

## Wichtig

**Diese Dateien werden nicht direkt an Qwen gesendet.**
Sie sind Template-Blöcke mit `{{variablen}}`-Platzhaltern, die der Context Builder
mit blueprint- und input-spezifischen Werten befüllt bevor der Prompt assembliert wird.

---

## Regeln

- **`base/` immer geladen.** `system_base.md`, `hallucination_guard.md` und
  `open_point_instruction.md` sind Teil jedes Bot-Aufrufs.

- **`products/` blueprint-selektiv.** Das User-Prompt-Template für GB wird nur
  bei GB-Blueprints geladen. SK-, EC- und ODA-Templates nur für ihre jeweiligen Produkte.

- **Variablen in `{{doppelten_klammern}}`.** Variablen werden vom Context Builder
  ersetzt bevor der Text in den Prompt einfließt.

---

## Unterordner

### `base/` — Universell, immer geladen

| Datei | Inhalt |
|---|---|
| `system_base.md` | Universelle Basisregeln: Sprache (Deutsch), Ton (sachlich), Format (JSON) |
| `hallucination_guard.md` | Kompakte Halluzinations-Guard-Instruktion für System-Prompt |
| `open_point_instruction.md` | Anweisung wie `[OFFENER PUNKT]` korrekt zu formulieren und einzusetzen ist |

### `products/` — Pro Dokumentprodukt

| Datei | Inhalt |
|---|---|
| `gb_user_prompt_template.md` | User-Prompt für alle GB-Blueprints mit `{{input_fields}}`-Variablen |
| `sk_user_prompt_template.md` | User-Prompt für SK-Blueprints |
| `ec_user_prompt_template.md` | User-Prompt für EC-Blueprints |
| `oda_user_prompt_template.md` | User-Prompt für ODA-Blueprints |

---

## Dateiformat

System-Prompt-Bausteine (`base/`):
```
Du bist ein Fachbot für {{document_type}}-Dokumente bei Cert-Expert.
Antworte ausschließlich auf Deutsch.
...
```

User-Prompt-Templates (`products/`):
```
Erstelle eine Gefährdungsbeurteilung für folgendes Einsatzszenario:

Veranstaltung: {{event_name}}
Datum: {{event_date}}
...

Antworte ausschließlich als JSON-Objekt mit folgenden Keys:
{{ai_blocks_list}}
```

**Maximale Größe:** `base/`-Dateien ~200 Tokens, User-Prompt-Templates ~400 Tokens
