# Cert-Expert AI — System Architecture

## Overview

This system builds closed, rule-bound specialist bots for Cert-Expert document generation.
Bots do not produce free chat. They receive structured input and produce structured output
that downstream tools (Tool 1 / Tool 2) can consume to assemble final documents.

---

## Core Design Principles

1. **No hallucination** — bots never invent data, locations, regulations, or dates.
2. **Open-point discipline** — any missing input field is explicitly flagged as `[OFFENER PUNKT]`.
3. **Structured output only** — bots return JSON, not prose. Prose is generated inside JSON values.
4. **Audit-near writing** — all generated text is formulated for regulatory/audit readability.
5. **Blueprint-driven** — every document is based on a predefined blueprint (Schablone). The AI
   only fills structured content blocks. Document structure is defined by the Word template.
6. **Shared rendering layer** — all bots use one Node.js renderer (`shared/renderer/render.js`)
   for DOCX output. No bot duplicates placeholder replacement, logo, or header/footer logic.
7. **Standalone by default** — every bot works independently. Flow mode (document chains) is
   additive and does not break the standalone pipeline.
8. **Clean integration boundary** — this system is the document-generation engine. It accepts
   structured input and returns placeholder JSON + DOCX + QA state. Portal integration
   (projects, approvals, dashboards, storage) is a separate layer that calls this engine.
9. **No framework lock-in** — pure Python + Node.js subprocess, no LangGraph, CrewAI, RAG, or
   MCP in this phase.

---

## Pipeline — Gefährdungsbeurteilung (Master Pipeline)

```
inputs/gefaehrdungsbeurteilung_example.json   (blueprint-specific input)
        │
        ▼
shared/input_loader.py
  • Load and parse JSON
  • Validate required fields per blueprint
  • Missing fields → pre_open_points list
        │
        ▼
bots/01_gefaehrdungsbeurteilung/gb_bot.py
  • Build system prompt (strict bot rules)
  • Build user prompt from validated input
  • Call api_client.ask_qwen()
  • Parse JSON response (retry up to 3×)
  • On 3× failure → RuntimeError + save raw to outputs/
        │
        ▼
shared/quality_checker.py
  • Merge pre_open_points from input_loader
  • Scan all placeholder values for OFFENER PUNKT or empty strings
  • Set qa_status: "ok" | "review_required"
        │
        ├──► outputs/gb_{event}_{date}.json   (structured placeholder map)
        │
        └──► shared/docx_builder.py
               • Merge company data (inputs/company_data.json) + bot placeholders
               • Resolve blueprint template (templates/{blueprint_id}.docx)
               • Write temp context JSON
               • Invoke shared/renderer/render.js via subprocess
               • Parse Node stdout JSON
               • Raise DocxRenderError on failure
               │
               ▼
             outputs/gb_{event}_{date}.docx   (final DOCX; [DRAFT] if qa != ok)
```

### Standalone vs. Flow Mode

The pipeline above describes **standalone mode**: one bot, one document, no upstream dependency.

In **flow mode** (planned — not yet implemented), an upstream context object is injected
between `input_loader.py` and `gb_bot.py`. Upstream documents (e.g., Sicherheitskonzept)
are parsed and merged into the input context. Missing upstream sections propagate into
`pre_open_points` before the bot runs.

See `docs/BLUEPRINT_ARCHITECTURE.md` for the full dependency graph and flow mode specification.

---

## Folder Structure

```
cert-expert-ai/
├── bots/
│   ├── 01_gefaehrdungsbeurteilung/
│   │   └── gb_bot.py                    ← Master pipeline bot
│   ├── 02_sicherheitskonzept/           ← Future bot
│   ├── 03_einsatzkonzept/               ← Future bot
│   └── 04_oda/                          ← Future bot
├── shared/
│   ├── api_client.py                    ← LM Studio HTTP client
│   ├── input_loader.py                  ← JSON input validation + open-point detection
│   ├── quality_checker.py               ← QA layer: placeholder scan + qa_status
│   ├── docx_builder.py                  ← Python ↔ Node subprocess bridge
│   ├── docx_writer.py                   ← Legacy DOCX writer (test output)
│   └── renderer/
│       ├── render.js                    ← Node.js DOCX renderer (easy-template-x)
│       ├── package.json
│       └── node_modules/                ← gitignored
├── orchestrator/
│   └── run_pipeline.py                  ← Future: multi-bot / flow orchestration
├── inputs/
│   ├── gefaehrdungsbeurteilung_example.json
│   └── company_data.json                ← Company metadata + LogoPath config
├── assets/
│   └── cert_expert_logo.png             ← Logo file for {Logo} placeholder
├── outputs/                             ← Generated JSON + DOCX files (gitignored)
├── templates/
│   ├── test_render.docx                 ← Long-term regression template
│   ├── create_test_template.py          ← Script to regenerate test_render.docx
│   └── gb_event_kampfsport.docx         ← Production template (to be created)
├── knowledge/                           ← Global, reusable curated knowledge (gittracked)
│   ├── standards/                       ← Norm/regulation overviews (per standard subfolder)
│   ├── sdls/                            ← Domain knowledge per service type + subtypes/
│   ├── products/                        ← Document product knowledge (GB, SK, EC, ODA)
│   ├── blueprints/                      ← Blueprint config JSON files (Phase 2)
│   ├── rules/                           ← base/ + products/ + blueprints/ rule layers
│   ├── guides/                          ← content_blocks/ + writing_style/ guides
│   ├── examples/                        ← {block_type}/{sdl_domain}_{subtype}.md
│   └── prompts/                         ← base/ + products/ prompt templates
├── legacy_tools/
│   ├── document creater                 ← Tool 1 (reference only — not called)
│   └── employee file creater            ← Tool 2 (reference only — not called)
└── docs/
    ├── ARCHITECTURE.md                  ← This file
    ├── BLUEPRINT_ARCHITECTURE.md        ← Blueprint logic, composability, dependency chains
    ├── KNOWLEDGE_ARCHITECTURE.md        ← Modular knowledge structure, context assembly
    ├── PROJECT_ARCHITECTURE.md          ← Lightweight portal integration concept
    ├── INPUT_ARCHITECTURE.md            ← Input strategy: Phase 1 JSON → Phase 3 portal API
    ├── GB_BOT_SPEC.md                   ← GB bot fachliche specification
    ├── PLACEHOLDER_REGISTRY.md          ← All placeholder tokens, naming conventions
    └── CURSOR_BRIEFING.md               ← Project briefing
```

---

## Bot Output JSON Schema

All bots return a JSON object with this structure. The `GB_` namespace is specific to
Gefährdungsbeurteilung. Future bots will use their own placeholder namespaces.

```json
{
  "document_type": "gefaehrdungsbeurteilung",
  "meta": {
    "created_at": "2026-05-18T00:00:00",
    "input_file": "inputs/gefaehrdungsbeurteilung_example.json",
    "pipeline_version": "1.0"
  },
  "placeholders": {
    "GB_TAETIGKEIT": "Beschreibung der sicherheitsrelevanten Tätigkeit...",
    "GB_GEFAEHRDUNGEN": "Identifizierte Gefährdungen...",
    "GB_RISIKOBEWERTUNG": "Bewertung des Risikos nach Wahrscheinlichkeit und Schwere...",
    "GB_SCHUTZMASSNAHMEN": "Technische und organisatorische Schutzmaßnahmen...",
    "GB_OFFENE_PUNKTE": "Zusammenfassung aller offenen Punkte..."
  },
  "open_points": [
    "[OFFENER PUNKT] Zuschauerzahl nicht angegeben",
    "[OFFENER PUNKT] Notausgänge nicht angegeben"
  ],
  "qa_status": "review_required"
}
```

### GB_ Placeholder Definitions

| Placeholder | Content |
|---|---|
| `GB_TAETIGKEIT` | Description of the activity/event being assessed |
| `GB_GEFAEHRDUNGEN` | Identified hazards per work area or activity |
| `GB_RISIKOBEWERTUNG` | Risk assessment: probability × severity per hazard |
| `GB_SCHUTZMASSNAHMEN` | Protective measures (technical, organizational, personal) |
| `GB_OFFENE_PUNKTE` | Summarized open points for document section |

### QA Status Values

| Value | Meaning |
|---|---|
| `ok` | All placeholders filled, no open points detected |
| `review_required` | One or more open points exist — document must be reviewed before use |
| `parse_error` | LLM returned non-parseable output after 3 retries (logged separately) |

---

## Rendering Layer Boundary

The shared rendering layer (`shared/renderer/render.js`) is responsible for:
- DOCX template loading
- All placeholder replacement (body, tables, headers, footers)
- Logo insertion via `{Logo}` placeholder (proportional, non-distorting)
- Final DOCX file export

`shared/docx_builder.py` is the Python-facing bridge to the renderer. It:
- Loads `inputs/company_data.json` (company-level placeholders + `LogoPath`)
- Merges company data with bot-generated placeholders
- Injects `{currentDate}` automatically
- Resolves the correct template for the given `document_type`
- Calls `render.js` via subprocess and parses the JSON result

**No bot duplicates rendering logic.** All DOCX output goes through `docx_builder.py`.

---

## Tool 1 / Tool 2 Legacy Boundary

The legacy tools (`legacy_tools/`) are reference implementations only. They are not
called by the new pipeline. Their rendering logic has been extracted into
`shared/renderer/render.js` (using the same `easy-template-x` library).

Tool 2 handles personnel documents and is not relevant to the current GB pipeline.
Future bots producing personnel documents will output a `tool2_mapping` block in their
JSON for future portal/Tool-2 integration.

---

## LM Studio Configuration

| Setting | Value |
|---|---|
| API endpoint | `http://127.0.0.1:1234/v1/chat/completions` |
| Model | `qwen/qwen3-30b-a3b-2507` |
| Temperature | `0.3` (deterministic, audit-near output) |
| Timeout | `300s` |

---

## Integration Boundary — Portal / External Systems

This system is the **document-generation engine**. Its responsibility ends at the output
files. Everything related to project management, approvals, storage, dashboards, and
order-to-cash workflows is handled by the separate portal layer.

**What this system exposes (now and future):**

```
Input:   blueprint_id + structured input JSON (+ optional upstream context)
Output:  placeholder JSON + final DOCX + qa_status + open_points list
```

Input source in Phase 1: local JSON file. Phase 2: optional internal form.
Phase 3: portal API. The engine is identical across all phases — only the calling
layer changes. See `docs/INPUT_ARCHITECTURE.md` for the full input strategy.

**What this system does NOT handle:**
- User authentication or sessions
- Project dossiers or document versioning
- Approval workflows or human review queues
- File storage backends (Hetzner, AWS S3, etc.)
- Portal dashboards or notifications

The portal calls this engine. The engine does not call the portal.

For the integration concept and future portal touchpoints see `docs/PROJECT_ARCHITECTURE.md`.

---

## Adding Future Bots

Each new bot follows the same pattern as `gb_bot.py`:

1. Create `bots/0N_<name>/` folder with the bot script
2. Define a blueprint in `knowledge/6_blueprint/{blueprint_id}.json` (Phase 2)
3. Create the DOCX template in `templates/{blueprint_id}.docx`
4. Define the placeholder namespace (`SK_*`, `EC_*`, `ODA_*`) — register in
   `docs/PLACEHOLDER_REGISTRY.md`
5. Follow the structure: `load_input → build_prompts → call_llm → parse_json → qa → docx_builder`
6. Add blueprint-specific QA rules to `shared/quality_checker.py` if needed
7. Document the new placeholder schema in `docs/PLACEHOLDER_REGISTRY.md`
8. For Flow mode: define `upstream` and `downstream` in the blueprint config

See `docs/BLUEPRINT_ARCHITECTURE.md` for the full blueprint specification and
namespace conventions per document type.
