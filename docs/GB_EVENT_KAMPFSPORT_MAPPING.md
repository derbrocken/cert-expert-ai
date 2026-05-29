# Blueprint Mapping — `gb_event_kampfsport`

> **Scope.** Per-blueprint mapping table for the surgical-refinement pass.
> Source of truth: `knowledge/6_blueprint/gb_event_kampfsport.json` (v1.0,
> status `active`).
>
> **Reading guide.** Every `ai_block` from the blueprint maps to exactly one
> DOCX placeholder of the same name inside `templates/gb_event_kampfsport.docx`.
> Each block draws from the same shared system prompt (all 21 knowledge
> modules below), but is **driven primarily** by the modules listed in the
> table — those are the modules that contain block-specific structure, rules,
> or examples. Generic project-wide modules (base rules, base prompts) apply
> to every block and are not repeated per row.
>
> **Reviewer-only open points** are open points that, by construction, can
> only be detected post-hoc by a human (or by `quality_checker`) and must
> never be invented by the LLM from prose alone.

---

## 1. Knowledge modules referenced by this blueprint (21 total)

Listed in the order they appear in `context_modules`. The system-prompt
ordering is fixed by `shared/context_builder.py`; this list reflects
**inventory**, not prompt position.

| # | Category    | Path (relative to `knowledge/<category>/`)                       |
|--:|-------------|------------------------------------------------------------------|
|  1 | standards   | `arbschg/overview.md`                                            |
|  2 | standards   | `dguv_v1/overview.md`                                            |
|  3 | standards   | `VStättVO/overview.md`                                          |
|  4 | sdls        | `veranstaltungsschutz/base.md`                                   |
|  5 | sdls        | `veranstaltungsschutz/subtypes/kampfsport.md`                    |
|  6 | products    | `Gefährdungsbeurteilung/purpose.md`                             |
|  7 | products    | `Gefährdungsbeurteilung/content_blocks.md`                      |
|  8 | rules       | `base/hallucination_boundaries.md`                               |
|  9 | rules       | `base/open_points_rules.md`                                      |
| 10 | rules       | `base/citation_rules.md`                                         |
| 11 | rules       | `base/output_format_rules.md`                                    |
| 12 | rules       | `products/gb_rules.md`                                           |
| 13 | rules       | `blueprints/gb_event_kampfsport.md`                              |
| 14 | guides      | `content_blocks/risikobewertung.md`                              |
| 15 | guides      | `content_blocks/schutzmassnahmen.md`                             |
| 16 | examples    | `gb_gefährdungen/veranstaltungsschutz_kampfsport.md`            |
| 17 | examples    | `gb_schutzmassnahmen/veranstaltungsschutz_kampfsport.md`         |
| 18 | prompts     | `base/system_base.md`                                            |
| 19 | prompts     | `base/hallucination_guard.md`                                    |
| 20 | prompts     | `base/open_point_instruction.md`                                 |
| 21 | prompts     | `products/gb_user_prompt_template.md`                            |

Modules 8–11, 18–20 apply to **every** ai_block (project-wide guardrails,
output schema, open-point markup). Modules 6, 12, 21 also apply globally
(GB product knowledge, GB product rules, user-prompt template).
The per-block table below only names the **block-specific** modules.

---

## 2. ai_block → placeholder → knowledge → input → reviewer-only open points

| ai_block                | DOCX placeholder         | Block-specific knowledge modules (in addition to project-wide)                                                                                                  | Driving input fields                                                                                                                                                       | Reviewer-only open points (detected by `quality_checker` or human, never invented from prose)                                                                                                                                                                                                                |
|-------------------------|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GB_TAETIGKEIT`         | `{GB_TAETIGKEIT}`        | products/`Gefährdungsbeurteilung/content_blocks.md`, sdls/`veranstaltungsschutz/base.md`, sdls/`veranstaltungsschutz/subtypes/kampfsport.md`                     | `event_name`, `event_type`, `combat_sports_type`, `event_date`, `event_start_time`, `event_end_time`, `event_location`, `client_name`, `expected_attendees`, `security_staff_count`, `venue_capacity`, `alcohol_served`, `outdoor_area`, `notes` | Required field empty → flagged by `input_loader` (e.g. `event_location` missing). No reviewer-only OPs originate inside this block by design — it is a factual description.                                                                                                                                  |
| `GB_GEFAEHRDUNGEN`      | `{GB_GEFAEHRDUNGEN}`     | sdls/`veranstaltungsschutz/base.md`, sdls/`veranstaltungsschutz/subtypes/kampfsport.md`, examples/`gb_gefährdungen/veranstaltungsschutz_kampfsport.md`, standards/`VStättVO/overview.md`, standards/`dguv_v1/overview.md` | `special_risks`, `alcohol_served`, `outdoor_area`, `expected_attendees`, `venue_exits`, `venue_capacity`, `combat_sports_type`, `prior_incidents`                          | Inline `[OFFENER PUNKT] …` substrings inside the block (e.g. `Vorhandensein und Lage der Notausgangsbeschilderung`, `Pausen- und Ablöseregelung`). **`quality_checker` must auto-extract every inline OP from this block** and merge into the canonical `open_points` array.                                |
| `GB_RISIKOBEWERTUNG`    | `{GB_RISIKOBEWERTUNG}`   | guides/`content_blocks/risikobewertung.md`, products/`Gefährdungsbeurteilung/content_blocks.md`, rules/`products/gb_rules.md`                                   | Derives from `GB_GEFAEHRDUNGEN`; uses `special_risks`, `expected_attendees`, `venue_capacity`, `alcohol_served`, `combat_sports_type` for justifications                  | **Coverage gap = reviewer-only OP**: any Gefährdung named in `GB_GEFAEHRDUNGEN` that does not appear in `GB_RISIKOBEWERTUNG` with the same Bezeichnung. `quality_checker` flags this as `[OFFENER PUNKT] Gefährdung 'X' nicht in Risikobewertung übernommen`.                                              |
| `GB_SCHUTZMASSNAHMEN`   | `{GB_SCHUTZMASSNAHMEN}`  | guides/`content_blocks/schutzmassnahmen.md`, examples/`gb_schutzmassnahmen/veranstaltungsschutz_kampfsport.md`, sdls/`veranstaltungsschutz/subtypes/kampfsport.md`, products/`Gefährdungsbeurteilung/content_blocks.md` | `security_staff_count`, `medical_service`, `evacuation_plan_available`, `venue_exits`, `combat_sports_type`, `alcohol_served`, `outdoor_area`, `official_requirements`     | Inline `[OFFENER PUNKT] …` substrings (e.g. `Pausen- und Ablöseregelung`, `Notausgangsbeschilderung`, `Fluchtwegplan`). Same auto-extraction obligation as `GB_GEFAEHRDUNGEN`. No measure may invent concrete numbers (channel names, briefing minutes, exact role headcount split) that are not in the input. |
| `GB_VERANTWORTLICHKEITEN` | `{GB_VERANTWORTLICHKEITEN}` | rules/`products/gb_rules.md`, rules/`blueprints/gb_event_kampfsport.md`, products/`Gefährdungsbeurteilung/content_blocks.md`                                  | `client_name`, `created_by`, `approved_by`, `medical_service`                                                                                                              | **Role-conflation = reviewer-only OP**: `created_by` must not be silently equated with Einsatzleitung; each role (Auftraggeber, Auftragnehmer, Einsatzleitung, Sanitätsdienst, Ersteller, Freigeber, Behörden) gets its own line and `[OFFENER PUNKT]` if unfilled. Enforced by `gb_rules.md`.              |
| `GB_OFFENE_PUNKTE`      | `{GB_OFFENE_PUNKTE}`     | rules/`base/open_points_rules.md`, prompts/`base/open_point_instruction.md`                                                                                      | None directly — this block consolidates open points from `input_loader.pre_open_points` + LLM-detected inline OPs + `quality_checker` post-hoc OPs                         | This block is **the** consolidation surface. `quality_checker` is authoritative: if any inline `[OFFENER PUNKT]` exists in any other block but is missing here, the canonical `open_points` array still includes it. The DOCX `GB_OFFENE_PUNKTE` text is allowed to lag; the JSON array is the source of truth. |

---

## 3. Reviewer-only vs. inline open points — invariants

1. **JSON `open_points` is reviewer-canonical, always.**
   It is the union of:
   - `pre_open_points` from `input_loader` (missing required fields, critical triggers),
   - explicit entries the LLM returned in `open_points`,
   - inline `[OFFENER PUNKT] …` substrings found inside any placeholder
     (extracted by `quality_checker`),
   - structural QA findings (empty/`[OFFENER PUNKT]`-tagged ai_blocks,
     coverage gap between `GB_GEFAEHRDUNGEN` ↔ `GB_RISIKOBEWERTUNG`).
   After dedup, this list determines `qa_status` (`"ok"` ⇔ list empty).

2. **The reviewer DOCX** (`*_review.docx`) keeps every inline
   `[OFFENER PUNKT] …` substring verbatim — that is its purpose.

3. **The customer DOCX** (`*_final.docx`) is rendered from a derived dict
   where every inline `[OFFENER PUNKT] …` substring has been stripped from
   every placeholder value (`shared/output_modes.to_final_mode`). The
   canonical reviewer JSON is untouched.

4. **Rendering `*_final.docx` while `open_points` is non-empty is allowed**
   but logs a stderr warning naming the count and the first three points.
   This preserves audit integrity: the JSON still says
   `qa_status = "review_required"`.

---

## 4. Input-side anchors (what must be present for this blueprint to behave)

Required (12 fields, from `input_schema.required`):
`event_name`, `event_type`, `event_date`, `event_location`,
`expected_attendees`, `security_staff_count`, `venue_capacity`,
`venue_exits`, `special_risks`, `client_name`, `created_by`, `doc_version`.

Optional (11 fields, from `input_schema.optional`):
`approved_by`, `notes`, `event_start_time`, `event_end_time`,
`alcohol_served`, `outdoor_area`, `prior_incidents`, `medical_service`,
`evacuation_plan_available`, `official_requirements`, `combat_sports_type`.

Critical triggers (fire `pre_open_points` deterministically):
`venue_exits_missing_or_zero`, `overbooking`, `no_security_staff`,
`approval_missing`, `combat_sports_type_missing`, `medical_service_missing`.

---

## 5. Template anchors (what the renderer expects)

Template file: `templates/gb_event_kampfsport.docx`.
Required placeholders inside the template, one per ai_block, identical
spelling: `{GB_TAETIGKEIT}`, `{GB_GEFAEHRDUNGEN}`, `{GB_RISIKOBEWERTUNG}`,
`{GB_SCHUTZMASSNAHMEN}`, `{GB_VERANTWORTLICHKEITEN}`, `{GB_OFFENE_PUNKTE}`.
Company-layer placeholders (Layer 1) and `currentDate` are injected by
`shared/docx_builder.py` and are out of scope for this mapping.
