# Cert-Expert AI — Reviewer logic (human governance)

Version: 1.0 | Stand: 2026-05-18 | Status: governance

This document is **human-facing**. It is **not** loaded into model prompts.
Bot-facing operational rules derived from it live in
`knowledge/9_rules/base/reviewer_handoff.md`.

---

## Purpose

Define which outputs may be treated as **draft** only and which items **must**
always pass **human review** before customer-facing or legally sensitive use.

The pipeline may emit `qa_status: "review_required"` even when the JSON schema
is valid. Reviewers treat **`open_points` and inline `[OFFENER PUNKT]` markers**
as the authoritative gap list (`reviewer` JSON is canonical; customer views may
strip inline markers).

---

## What automated generation may do

- Assemble **structured** documents from blueprint + input + curated
  knowledge modules.
- Apply **thematic grids** (typical hazards, phases, interfaces) at **principle**
  level when the input does not contradict them.
- Mark every missing or unverifiable fact as `[OFFENER PUNKT]` and list it in
  `open_points`.
- Enforce **internal consistency** checks implemented in code (e.g. coverage of
  named hazards across blocks).

---

## What must never be auto-finalized without human review

Reviewers **must** verify items in these categories when present or implied:

| Area | Why |
|------|-----|
| **Behördliche Auflagen / Genehmigungen / Anzeigen** | Legal status; model must not assert approval or conditions not in input. |
| **Finale Kräfte- und Qualifikationsentscheidungen** | Contractual and operational commitment; numbers often exceed input fidelity. |
| **Flucht- und Rettungslogik** | Depends on plans, object approval, and on-site verification. |
| **Bestätigte Sanitätsstruktur** | Medical responsibility chain, scope, and interfaces are not inferable from generic knowledge. |
| **Polizei- / Behördenabsprachen** | Contact and operational agreements are external facts. |
| **Definitive Funk- / Kommunikationskanäle** | Naming and allocation are operational secrets and contract-specific. |
| **Freigabe der GB / SK / EC / ODA** | `approved_by` and sign-off roles are human decisions. |

This list is **not exhaustive**. Product-specific rules in
`knowledge/9_rules/products/*.md` and blueprint rules may add mandatory review
triggers.

---

## Reviewer checklist (minimum)

Before external release:

1. **Input alignment** — every concrete number, name, time, channel, paragraph
   reference, and staffing split appears in the **job input** or in an attached
   **verified** upstream document — not only in examples or SDL grids.
2. **Open points** — each `[OFFENER PUNKT]` is acceptable (known gap) or
   resolved with evidence.
3. **Cross-block consistency** — hazards ↔ risk assessment ↔ measures ↔
   responsibilities tell one story; no orphan hazards or measures without
   traceability.
4. **No legal conclusion** — no “rechtskonform”, “genehmigt”, “ausreichend im
   Sinne von …” unless explicitly supplied as cited fact (normally: forbid).
5. **Roles** — `created_by` and similar metadata never substitute for operational
   leadership roles unless input explicitly says so.

---

## Escalation

If generated text introduces **operational or legal specificity** not visible
in input: treat as **defect**, not as convenience — revert to `[OFFENER PUNKT]`
or supply evidence.

---

## Related files

- `knowledge/9_rules/base/reviewer_handoff.md` — condensed model instructions
- `knowledge/9_rules/base/hallucination_boundaries.md` — factual boundaries
- `knowledge/9_rules/base/open_points_rules.md` — open-point discipline
- `knowledge/9_rules/products/gb_rules.md` — GB product rules
