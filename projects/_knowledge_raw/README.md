# Raw knowledge staging (`projects/_knowledge_raw/`)

**Global research and intake area** for all future SDLs, products, interfaces,
norms, and reviewer logic. **Not** part of the live knowledge graph.

Nothing here is loaded by blueprints, `context_builder`, or any prompt
assembly. **Curated modules live only under `knowledge/`.**

## Top-level layout

| Branch | Purpose |
|--------|---------|
| **`normen/`** | Raw regulatory and standards material (global). |
| **`sdls/`** | Raw field knowledge per **service domain** (DIN 77200-1 groups, Cert-Expert SDL paths). |
| **`produkte/`** | Raw **document/product** methodology (how to write GB, SK, EK/EC, ODA). |
| **`schnittstellen/`** | Cross-cutting **interfaces** (may apply across several SDLs and products). |
| **`reviewerlogik/`** | Internal QA, approval, and “never auto-finalize” drafts. |

## Rules

- **No** blueprint or loader references to paths under `_knowledge_raw/`.
- Raw files may be customer-specific, informal, or draft; treat as **non-authoritative** until curated.
- **Norms** here do **not** drive document generation until distilled into `knowledge/standards/` (or other live modules).

## Taxonomy reminder

- **SDL** ≠ **Schnittstelle**: e.g. Sanitätsdienst is an **interface**, not an SDL subtype. Stage interface notes under `schnittstellen/`, not under `sdls/.../subtypes/`.

## Workflow

1. Drop material in the matching subtree (or capture in chat, then file here).
2. Curate into `knowledge/` (standards, sdls, products, rules, guides) as reusable, anonymized content.
3. Archive or delete sensitive raw snippets after curation.

See `docs/KNOWLEDGE_CURATION_GUIDE.md`.
