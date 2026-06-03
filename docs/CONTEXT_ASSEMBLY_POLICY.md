# Context Assembly Policy — Cert-Expert Document Bots

**Version:** 1.0  
**Stand:** 2026-06-01  
**Status:** Verbindlich für alle Bot- und Agent-Arbeit

---

## Problem (Anfangsphase)

Frühe Bot-Gerüste (GB, SK, EK) litten darunter, dass zu viel aus `knowledge/` geladen wurde — per Ordner-Scan, Wikilink-Ketten oder „ganze Library“, bis das Kontextfenster voll war. Das erzeugte **Kontextvermischung** (CEKS-Norm + SDL + leere READMEs) und **Plausibilitätsfüllung** statt `[OFFENER PUNKT]`.

---

## Grundregel

> **Bots laden niemals den Vault. Bots laden nur die Allowlist eines Blueprints.**

| Erlaubt | Verboten |
|---------|----------|
| Dateien in `context_modules` des aktiven Blueprints (`knowledge/7_blueprint/{id}.json`) | Rekursives Lesen von `knowledge/1_standards/` |
| `shared/blueprint_loader` + `shared/context_builder` | Obsidian-Graph traversieren |
| Projekt-Upstream in Flow-Modus (`projects/{id}/upstream/`, später) | PDFs aus `inputs/raw_standards/` direkt in den Prompt |
| Explizit gelistete `prompts/` | „Alles was zu Veranstaltung passt“ heuristisch |

---

## Zwei Arbeitsmodi

| Modus | Wer | Wissen |
|-------|-----|--------|
| **CEKS / Norm** | Mensch, Cursor-Agent (Governance) | `knowledge/1_standards/`, Wikilinks, Profile, Qualifikation |
| **Dokument-Bot** | Qwen-Pipeline (`gb_bot.py`, später SK/EK) | Nur Blueprint-`context_modules` |

CEKS-Inhalte gehören **nicht** automatisch in GB/SK/EK-Prompts. Ausnahme: ein Modul ist **explizit** im Blueprint (z. B. SDL unter `3_sdls/`, nicht DIN-Volltext).

---

## Pfad-Wahrheit (Code)

Single source of truth: `shared/knowledge_paths.py`

| `context_modules`-Key | Ordner |
|------------------------|--------|
| `standards` | `knowledge/2_regulations/` |
| `sdls` | `knowledge/3_sdls/` |
| `products` | `knowledge/6_products/` |
| `rules` | `knowledge/10_rules/` |
| `practice_sources` | `knowledge/4_sources/` |
| `guides` | `knowledge/8_guides/` |
| `examples` | `knowledge/11_examples/` |
| `prompts` | `prompts/` (Repo-Root) |

Blueprint-JSON: `knowledge/7_blueprint/{blueprint_id}.json`

---

## Gate: Neuer Bot / neues Blueprint

Ein neuer Bot oder Blueprint ist nur zulässig, wenn:

1. `context_modules` vollständig definiert und alle Pfade existieren (`python -m shared.blueprint_loader <id>`).
2. Block **`pflichten`** (Angaben, Form, Lektüre) gesetzt und grün: `python3 -m shared.pflichten_validator <id>`.
3. Produktwissen unter `6_products/{produkt}/` mindestens `purpose.md` + `content_blocks.md` hat (SK/EK/ODA).
4. SDL-`base.md` + relevanter `subtypes/*.md` reviewed (siehe Gap-Matrix).
5. Smoke-Test für den Blueprint grün (ohne LLM).
6. Eintrag in `knowledge/BOT_CONTEXT_MAP.md`.

**Kein** paralleles Bauen von vier Bots mit leerem Wissen.

---

## Cursor / Claude Code (IDE)

Agents in Cursor **dürfen** den Vault breit lesen — das ist Entwicklung, nicht Qwen-Laufzeit.

Empfohlen:

- Bei Bot-Arbeit zuerst `knowledge/BOT_CONTEXT_MAP.md` und Blueprint-JSON lesen.
- Nicht aus `AGENT_ONBOARDING` in den CEKS-Hairball folgen, wenn die Aufgabe GB/SK-Inhalt ist.
- Obsidian-Graph-Filter „Bot-Insel“: `path:3_sdls OR path:6_products OR path:8_guides OR path:10_rules OR path:11_examples`.

---

## Verwandte Dokumente

- `docs/BOT_PFLICHTREGELN.md` — Pflichtangaben, Pflichtform, Pflichtlektüre je Blueprint
- `docs/KNOWLEDGE_ARCHITECTURE.md` — Token-Budgets, Modulkategorien
- `knowledge/BOT_CONTEXT_MAP.md` — Allowlist je aktivem Blueprint
- `docs/BOT_KNOWLEDGE_GAP_REPORT.md` — SK/EK/ODA-Lücken
