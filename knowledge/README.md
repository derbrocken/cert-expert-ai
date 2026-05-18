# knowledge/

Globales, wiederverwendbares Fachwissen für die Cert-Expert AI Fachbots.

---

## Wichtige Regeln

- **Kein Kundeninhalt.** Dieser Ordner enthält kein Projektmaterial, keine Kundendaten
  und keine generierten Dokumente. Alles Projektspezifische gehört in `projects/`.

- **Selektives Laden.** Wissensmodule werden nie vollständig geladen.
  Jeder Blueprint referenziert genau die Module, die er benötigt.
  Der Context Builder assembliert den Kontext selektiv aus diesen Modulen.

- **Curated Markdown.** Alle Dateien sind kuratiertes Markdown — keine Rohdokumente,
  keine PDFs, keine Word-Dateien. Quelldokumente (Normen, Originalregeln) werden
  als Überblick aufbereitet, nicht 1:1 kopiert.

- **Kein Volltext-Normen.** Regelwerke werden als Überblick beschrieben.
  Keine zitierfähigen Paragrafennummern, Grenzwerte oder Messzahlen, sofern diese
  nicht explizit in den Input-Daten des Projekts angegeben sind.

---

## Ordnerstruktur

```
knowledge/
├── standards/     Rechtliche Regelwerke und Normen (Überblicksebene)
├── sdls/          Fachliches Domänenwissen pro Sicherheitsdienstleistungsbereich
├── products/      Dokumentprodukt-Wissen (GB, SK, EC, ODA) + Cert-Expert-Terminologie
├── blueprints/    Blueprint-Konfigurationsdateien (JSON) — maschinenlesbar
├── rules/         Harte Bot-Verhaltensregeln (base/, products/, blueprints/)
├── examples/      Positiv-Beispiele für fachlichen Inhalt pro Inhaltsblock
├── guides/        Schreibanleitungen für Inhaltsblöcke und Schreibstil
└── prompts/       Wiederverwendbare Prompt-Bausteine und User-Prompt-Templates
```

---

## Unterschied: Quelldokument vs. AI-Ready Modul

| Quelldokument | AI-Ready Modul |
|---|---|
| Volltext einer Norm (PDF) | Überblick: Was ist relevant, welche Prinzipien gelten |
| Internes Schulungshandbuch | Destillierte Gefährdungen und Maßnahmen für diesen Bereich |
| Kundenbriefing | Nicht hier — gehört in `projects/` |
| Beispiel aus echtem Kundenprojekt | Anonymisiert und generalisiert, fiktive Daten |

---

## Namenskonventionen

- Ordnernamen: `snake_case`, Deutsch
- Dateien: `snake_case.md` oder `snake_case.json`
- Beispieldateien: `{block_typ}/{sdl_bereich}_{subtyp}.md`
  z. B. `examples/gb_gefaehrdungen/veranstaltungsschutz_kampfsport.md`
- Blueprint-Configs: `{document_product}_{sdl_bereich}_{subtyp}.json`
  z. B. `blueprints/gb_event_kampfsport.json`
