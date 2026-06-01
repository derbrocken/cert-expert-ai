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
├── 1_standards/     Normen und Standards (CEKS, DIN 77200, ISO — nicht Bot-Volltext)
├── 2_regulations/   Rechtliche Regelwerke (Überblicksebene, Bot: context_modules.standards)
├── 3_sdls/          Fachliches Domänenwissen pro Sicherheitsdienstleistungsbereich
├── 4_sources/       Kuratierte DGUV-/Behörden-/Praxis-Extrakte (keine PDF-Ablage)
├── 6_products/      Dokumentprodukt-Wissen (GB, SK, EC, ODA)
├── 7_blueprint/     Blueprint-Konfigurationen (JSON) — maschinenlesbare Bot-Allowlists
├── 8_guides/        Schreibanleitungen für Inhaltsblöcke und Schreibstil
├── 10_rules/        Harte Bot-Verhaltensregeln (base/, products/, blueprints/)
├── 11_examples/     Positiv-Beispiele für fachlichen Inhalt pro Inhaltsblock
├── BOT_CONTEXT_MAP.md  Übersicht: welcher Blueprint lädt welche Dateien
└── …                (Platzhalter: 4_document_types, 5_processes, 9_concepts — noch leer)

prompts/             Wiederverwendbare Prompt-Bausteine (Repo-Root, nicht unter knowledge/)
```

**Bot-Pfad-Wahrheit (Code):** `shared/knowledge_paths.py` · Policy: `docs/CONTEXT_ASSEMBLY_POLICY.md`

---

## Unterschied: Quelldokument vs. AI-Ready Modul

| Quelldokument | AI-Ready Modul |
|---|---|
| Volltext einer Norm (PDF) | Überblick: Was ist relevant, welche Prinzipien gelten |
| DGUV-Info / Behördenleitfaden (PDF) | Extrakt unter `4_sources/` nach `EXTRACTION_SCHEMA.md` |
| Internes Schulungshandbuch | Destillierte Gefährdungen und Maßnahmen für diesen Bereich |
| Kundenbriefing | Nicht hier — gehört in `projects/` |
| Beispiel aus echtem Kundenprojekt | Anonymisiert und generalisiert, fiktive Daten |

---

## Verwandte Dokumentation

- [`docs/KNOWLEDGE_ARCHITECTURE.md`](../docs/KNOWLEDGE_ARCHITECTURE.md) — Architektur und Lade-Reihenfolge
- [`docs/KNOWLEDGE_CURATION_GUIDE.md`](../docs/KNOWLEDGE_CURATION_GUIDE.md) — Kuratierungsrichtlinien
- [`docs/CONTEXT_ASSEMBLY_POLICY.md`](../docs/CONTEXT_ASSEMBLY_POLICY.md) — Bot-Allowlists, kein Full-Vault-Load
- [`BOT_CONTEXT_MAP.md`](BOT_CONTEXT_MAP.md) — Module je aktivem Blueprint
