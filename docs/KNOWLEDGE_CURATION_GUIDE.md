# Cert-Expert AI — Knowledge-Curation Guide (Wave 2+)

Version: 1.0 | Stand: 2026-05-18 | Status: governance

This guide defines how domain knowledge for **Veranstaltungsdienst** and related
products is built, structured, and integrated into the Cert-Expert knowledge
layer. It complements `docs/KNOWLEDGE_ARCHITECTURE.md` and
`docs/SDL_STANDARD_TAXONOMY.md` by describing the **curation workflow** and
**governance boundaries**, not the technical pipeline.

---

## Purpose

The objective is not a single bot, but a **modular expertise system** that can
later support multiple document types:

1. Gefährdungsbeurteilung (GB)
2. Sicherheitskonzept (SK)
3. Einsatzkonzept (EC)
4. Objektbezogene Dienstanweisung (ODA)
5. Einweisungen / Unterweisungen
6. Audit- and review-oriented workflows

The knowledge base must be: **auditable**, **reviewer-ready**, **modular**,
**reusable**, **norm-aware**, **practice-oriented**, and **controllable**.

---

## Core principle

The model must **not** autonomously invent security or operational logic.

The system rests on:

- Curated expert knowledge in `knowledge/`
- Modular files with clear separation of **structure** vs **domain**
- Reviewer and QA mechanisms (`docs/REVIEWER_LOGIC.md`, `quality_checker`,
  open-point rules)

The runtime architecture (bots, context assembly, render) is only:
**orchestrator**, **control system**, **render engine**, **QA harness**.

Real domain intelligence lives in the **knowledge modules**.

---

## SDL terminology (binding)

- **Repository path (unchanged):** `knowledge/sdls/veranstaltungsschutz/`
- **Canonical prose name in modules:** **Veranstaltungsdienst (DIN 77200-1)**

The folder name reflects the Cert-Expert domain label; in running text inside
SDL files, use the DIN-aligned term so norms, tenders, and customer language
stay consistent.

### SDL vs event subtype vs cross-cutting interface

| Concept | Meaning | Examples (illustrative) |
|--------|---------|-------------------------|
| **SDL** | Service category per DIN 77200-1 | Veranstaltungsdienst — repo path `knowledge/sdls/veranstaltungsschutz/` |
| **Event subtype** | Genre / format of the event | Kampfsport, Fußball, Festival, Straßenfest — `subtypes/*.md` |
| **Interface / component** | Partner or domain that cuts across event types and **document products** | Sanitätsdienst, Polizei, Feuerwehr, Veranstalter, Hallenbetrieb, Technik — **not** an SDL subtype |

**Sanitätsdienst** is an **interface**, not a subtype of Veranstaltungsdienst. The
same applies to similar partner roles: they appear in GB, SK, EC, ODA, and
briefings. Raw notes for these belong under staging
`projects/_knowledge_raw/schnittstellen/` (global), not under
`sdls/.../subtypes/`. After curation, interface logic may land in SDL `base.md`, product
modules, and/or future dedicated interface knowledge files — never conflated
with `kampfsport.md` et al. as if “Sanität were a genre.”

---

## The five knowledge levels

### Level 1 — Standards / normative foundations

**Path:** `knowledge/standards/`

Contains: normative requirements, legal principles, minimum expectations,
duties, boundaries, prohibitions, typical evidence types.

Must **not** contain: concrete deployment details, fixed wordings for one
event, or customer-specific facts.

Goal: the system knows **what classes of claims are dangerous** and **what must
never be fabricated**.

---

### Level 2 — SDL / service-domain knowledge

**Path:** `knowledge/sdls/veranstaltungsschutz/` (Veranstaltungsdienst)

**Layout:**

- `base.md` — cross-event operational and risk logic (all subtypes load this)
- `subtypes/*.md` — genre-specific patterns (e.g. `kampfsport.md`, later
  `festival.md`)

**`base.md` holds:** general Veranstaltungsdienst logic, audience flow, event
phases, access logic, coordination and escalation patterns at principle level,
typical interfaces, general hazards and measures **as thematic grids** — not
as finished documents.

**Subtypes hold:** genre-specific conflict profiles, typical risks, characteristic
measures, special roles (e.g. ring-adjacent logic for Kampfsport). Partner
interfaces such as **Sanitätsdienst** are **not** subtypes; they are covered at
**base** or **schnittstellen**-curated layers and reused across products.

---

### Level 3 — Product knowledge

**Path:** `knowledge/products/`

Per product (e.g. `gefaehrdungsbeurteilung/`, `sicherheitskonzept/`):
purpose, expected depth, important chapters, language level, mandatory
information, **reviewer-relevant boundaries**.

---

### Level 4 — Guides (method & formulation)

**Path:** `knowledge/guides/`

Method knowledge: assessment logic, formulation rules, writing standards,
anti-hallucination behavior, consistency rules.

These files define **how** to write — not **what** operationally happens on
site unless the “what” is already given by the human expert in SDL/standards
inputs.

---

### Level 5 — Examples / raw-style material

**Path:** `knowledge/examples/`

Style, structure, and depth references only. **Not** a source of facts:
no leaking numbers, paragraphs, channel names, or deployment splits into model
output unless present in **job input**.

---

### Additional layers (already in architecture)

- **`knowledge/rules/`** — hard behavior rules (base / product / blueprint)
- **`knowledge/prompts/`** — templates and injectable instruction fragments

Bot-facing **reviewer handoff** rules:
`knowledge/rules/base/reviewer_handoff.md`.

Human-facing reviewer governance: `docs/REVIEWER_LOGIC.md`.

---

## Raw expert material — staging (**not** in `knowledge/`)

**Path:** `projects/_knowledge_raw/` — **global** intake for all SDLs, products,
interfaces, norms, and reviewer logic. **Never** referenced by blueprints or
loaders. **Norms and raw extracts do not drive document generation** until
curated into `knowledge/standards/` (or other live modules).

**Layout:**

```text
projects/_knowledge_raw/
├── README.md
├── normen/
│   ├── din_77200_1/
│   ├── din_77200_2/
│   ├── iso_9001/
│   ├── iso_14001/
│   ├── iso_45001/
│   ├── arbSchG/
│   ├── dguv/
│   └── vstaettvo/
├── sdls/
│   ├── veranstaltungsschutz/
│   │   ├── veranstaltungsphasen/
│   │   ├── subtypes/
│   │   │   ├── kampfsport/
│   │   │   ├── fussball/
│   │   │   ├── festival/
│   │   │   └── strassenfest/
│   │   ├── sicherheitskonzepte_specific/
│   │   ├── einsatzkonzepte_specific/
│   │   └── gefaehrdungsbeurteilungen_specific/
│   ├── stationaerer_dienst/
│   ├── mobiler_dienst/
│   └── interventionsdienst/
├── produkte/
│   ├── gefaehrdungsbeurteilung/
│   ├── sicherheitskonzept/
│   ├── einsatzkonzept/
│   └── oda/
├── schnittstellen/
│   ├── sanitaetsdienst/
│   ├── polizei/
│   ├── feuerwehr/
│   └── kunde_auftraggeber/
└── reviewerlogik/
```

| Branch | Purpose |
|--------|---------|
| **`normen/`** | Global raw regulatory and standards material. |
| **`sdls/`** | Raw field knowledge per service domain (map to `knowledge/sdls/` when curating). |
| **`produkte/`** | Raw **document/product** methodology (GB, SK, EK/EC, ODA). |
| **`schnittstellen/`** | Cross-cutting interfaces (several SDLs and products). **Sanitätsdienst** lives here, not under `subtypes/`. |
| **`reviewerlogik/`** | Internal QA, approval, and “never auto-finalize” drafts. |

Use it for: expert notes, operational concepts, checklists, extracted document
snippets, lessons learned.

**Curation workflow:** human drops material → assistant or editor **abstracts
and generalizes** into the correct `knowledge/` module → raw snippets are not
copied verbatim if they contain customer-specific or non-reusable facts.

---

## Curation workflow (human + assistant)

### Phase 1 — Collect raw knowledge

Drop under `projects/_knowledge_raw/` in the branch that matches the material
(`normen/`, `sdls/`, `produkte/`, `schnittstellen/`, `reviewerlogik/` — or chat
first, then file here). No modular perfection required yet.

### Phase 2 — Categorize

For each chunk, decide: norm / SDL / product / guide / example / rule?

### Phase 3 — Modularize

Abstract to reusable patterns:

- Not: “Guard 2 stands left of ring 2.”
- Prefer: “At full-contact events, ring-adjacent positioning may be required
  for rapid intervention — **only state concretely when the input proves it.**”

### Phase 4 — Reviewer / QA alignment

Define what may be auto-generated vs what **must** pass human review. See
`docs/REVIEWER_LOGIC.md` and product-specific rules.

---

## Document chain (intent)

1. **GB** — risks, measures, open points, structural baseline  
2. **SK** — overall layout, protection goals, force concept, comms structure,
   evacuation / rescue interfaces, authority / medical structure  
3. **EC** — shifts, positions, concrete procedures, escalation detail  
4. **ODA** — object/area rules, contacts, reporting chains, access logic  

Knowledge modules should stay **composable** so downstream products can reuse
SDL `base` + subtype without duplicating monoliths.

---

## Architecture rules for curation

- Prefer **many small modules** over one giant file.
- **No hidden rules** — critical expectations must be explicit and reviewable.
- **No autonomous factual fill-in** — use `[OFFENER PUNKT]` when data is
  missing.
- **Examples are stylistic** — never factual sources.
- **Base vs subtype:** base = cross-event; subtype = genre-specific overlays.

---

## First-content priority (agreed)

Initial **fachliche** expansion for all event blueprints:

1. **Veranstaltungsphasen** and **general interface logic** in  
   `knowledge/sdls/veranstaltungsschutz/base.md`

2. Genre-specific depth (e.g. Kampfsport vs Festival) follows from **explicit
   expert input** staged under `projects/_knowledge_raw/sdls/veranstaltungsschutz/subtypes/`, then curation into `knowledge/sdls/.../subtypes/`.
   **Interface** topics (Sanitätsdienst, Behörden, Auftraggeber) follow from
   `projects/_knowledge_raw/schnittstellen/`; **normative** raw material from
   `projects/_knowledge_raw/normen/`. After curation: `base.md`,
   `knowledge/standards/`, and product rules — not from autonomous model
   invention.

---

## Relation to frozen architecture docs

This file is **governance for curation**. It does not replace
`docs/KNOWLEDGE_ARCHITECTURE.md`, `docs/ARCHITECTURE.md`, or blueprint specs.
When in conflict with a frozen technical spec, the frozen spec wins unless the
team explicitly updates it.

---

## Summary

The technical pipeline is stable; the bottleneck is **structured domain
knowledge**, **reviewer logic**, and **modular curation**. The goal is a
controlled, auditable Cert-Expert expertise system — not undifferentiated
AI prose.
