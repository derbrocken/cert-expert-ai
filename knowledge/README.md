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
├── 1_standards/     Normen und Standards (Überblicksebene)
├── 2_regulations/   Rechtliche Regelwerke (Überblicksebene)
├── 3_sdls/          Fachliches Domänenwissen pro Sicherheitsdienstleistungsbereich
├── 5_products/      Dokumentprodukt-Wissen (GB, SK, EC, ODA) + Cert-Expert-Terminologie
├── 6_blueprint/     Blueprint-Konfigurationsdateien (JSON) — maschinenlesbar
├── 7_guides/        Schreibanleitungen für Inhaltsblöcke und Schreibstil
├── 9_rules/         Harte Bot-Verhaltensregeln (base/, products/, blueprints/)
└── 10_examples/     Positiv-Beispiele für fachlichen Inhalt pro Inhaltsblock

prompts/             Wiederverwendbare Prompt-Bausteine (Repo-Root, nicht unter knowledge/)
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

## Verwandte Dokumentation

- [`docs/KNOWLEDGE_ARCHITECTURE.md`](../docs/KNOWLEDGE_ARCHITECTURE.md) — Architektur und Lade-Reihenfolge
- [`docs/KNOWLEDGE_CURATION_GUIDE.md`](../docs/KNOWLEDGE_CURATION_GUIDE.md) — Kuratierungsrichtlinien
- [`docs/BLUEPRINT_ARCHITECTURE.md`](../docs/BLUEPRINT_ARCHITECTURE.md) — Blueprint-System
