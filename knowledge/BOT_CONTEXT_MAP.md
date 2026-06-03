# Bot Context Map — Allowlists je Blueprint

**Stand:** 2026-06-01  
**Policy:** [`docs/CONTEXT_ASSEMBLY_POLICY.md`](../docs/CONTEXT_ASSEMBLY_POLICY.md) · **Pflichten:** [`docs/BOT_PFLICHTREGELN.md`](../docs/BOT_PFLICHTREGELN.md)  
**Pfad-Wahrheit (Code):** `shared/knowledge_paths.py`

Diese Datei ist die **menschliche Übersicht**, welche Dateien Qwen pro Blueprint sieht.  
Maschinenlesbare Quelle: `knowledge/7_blueprint/{blueprint_id}.json` → `context_modules`.

---

## Aktive Blueprints

| Blueprint | Status | Bot-Code | Template |
|-----------|--------|----------|----------|
| `gb_event_kampfsport` | **active** (full) | `bots/01_gefaehrdungsbeurteilung/gb_bot.py` | `templates/gb_event_kampfsport.docx` |
| `gb_event_kampfsport_lean` | **production default** | gleicher Bot, Blueprint-ID wählen | ~58k Zeichen + DGUV |
| `gb_event_kampfsport_micro` | LM Studio / klein | — | ~40k Zeichen |
| `sk_event_kampfsport` | **active (MVP)** | `bots/02_sicherheitskonzept/sk_bot.py` | `templates/sk_event_kampfsport.docx` (~51k Prompt) |

| `ec_event_kampfsport` | **active (MVP)** | `bots/03_einsatzkonzept/ek_bot.py` | `templates/ec_event_kampfsport.docx` |

Geplant: `oda_event_*`

---

## `gb_event_kampfsport` — Module (32 Dateien)

Prüfen: `python -m shared.blueprint_loader gb_event_kampfsport`

### standards → `2_regulations/`

- `arbschg/overview.md`
- `dguv_v1/overview.md`
- `VStättVO/overview.md`

### sdls → `3_sdls/`

- `veranstaltungsschutz/base.md`
- `veranstaltungsschutz/subtypes/kampfsport.md`

### products → `6_products/`

- `Gefährdungsbeurteilung/purpose.md`
- `Gefährdungsbeurteilung/content_blocks.md`

### rules → `10_rules/`

- `base/hallucination_boundaries.md`
- `base/open_points_rules.md`
- `base/citation_rules.md`
- `base/output_format_rules.md`
- `base/reviewer_handoff.md`
- `products/gb_rules.md`
- `blueprints/gb_event_kampfsport.md`

### guides → `8_guides/`

- `content_blocks/risikobewertung.md`
- `content_blocks/schutzmassnahmen.md`
- `risk_patterns/aggressive_groups.md`
- `risk_patterns/crowd_dynamics.md`
- `risk_patterns/bottlenecks.md`
- `risk_patterns/alcohol_related_conflicts.md`
- `control_measures/access_control.md`
- `control_measures/deescalation.md`
- `control_measures/visitor_separation.md`
- `control_measures/evacuation_management.md`
- `control_measures/radio_communication.md`
- `event_phases/ingress_egress.md`

### examples → `11_examples/`

- `gb_gefährdungen/veranstaltungsschutz_kampfsport.md`
- `gb_schutzmassnahmen/veranstaltungsschutz_kampfsport.md`

### prompts → `prompts/`

- `base/system_base.md`
- `base/hallucination_guard.md`
- `base/open_point_instruction.md`
- `products/gb_user_prompt_template.md`

---

## `sk_event_kampfsport` — SK-Allowlist (~23 Module)

**Pflichten:** Angaben → [`inputs/PFLICHTANGABEN_SK.md`](../inputs/PFLICHTANGABEN_SK.md) · Form → `templates/sk_event_kampfsport.docx` · Lektüre → Blueprint `pflichten.lektuere`

Prüfen: `python3 -m shared.pflichten_validator sk_event_kampfsport`  
Größe: `python3 scripts/context_size_report.py sk_event_kampfsport`  
Smoke: `python3 tests/smoke_sk_event_kampfsport.py`  
Lauf: `python -m bots.02_sicherheitskonzept.sk_bot inputs/sk_event_kampfsport.json`

| Kategorie | Module |
|-----------|--------|
| standards | `dguv_v1`, `VStättVO` Überblicke (`2_regulations/`) |
| sdls | `base.md`, `kampfsport.md` |
| practice_sources | crowd, veranstaltungen_organisation, sk_veranstaltung_geruest, grossevent_abstimmung |
| products | `sicherheitskonzept/` |
| rules | base + `sk_rules` + blueprint rules |
| guides | 2× runtime_summaries |

**Kein** `1_standards/`. Downstream: `gb_event_kampfsport_lean`, `ec_event_kampfsport`.

---

## `ec_event_kampfsport` — EK-Allowlist (MVP)

**Pflichten:** Angaben → [`inputs/PFLICHTANGABEN_EC.md`](../inputs/PFLICHTANGABEN_EC.md) · Form → `templates/ec_event_kampfsport.docx` · Lektüre → Blueprint `pflichten.lektuere`

Prüfen: `python3 -m shared.pflichten_validator ec_event_kampfsport`  
Smoke: `python3 tests/smoke_ec_event_kampfsport.py`  
Lauf: `python -m bots.03_einsatzkonzept.ek_bot inputs/ec_event_kampfsport.json`

| Kategorie | Module |
|-----------|--------|
| standards | `dguv_v1`, `VStättVO` Überblicke (`2_regulations/`) |
| sdls | `base.md`, `kampfsport.md` |
| practice_sources | crowd, veranstaltungen_organisation, grossevent_abstimmung, kampfsport_small_hall_event, din77200-operativ-extrakt |
| products | `einsatzkonzept/` |
| rules | base + `ec_rules` + blueprint rules |
| guides | `kampfsport_sdl_small_event_summary`, `ek_kraefteplanung_small_event` |
| prompts | system_base, guards, ec_user_template |

**Kein** `1_standards/`. Upstream: `sk_event_kampfsport`. Downstream: `oda_event_standard` (geplant).

---

## `gb_event_kampfsport_lean` — Production-Allowlist (~22 Module)

Prüfen: `python3 scripts/context_size_report.py gb_event_kampfsport_lean`  
Smoke: `python3 tests/smoke_gb_event_kampfsport_lean.py`

| Kategorie | Module |
|-----------|--------|
| sdls | `base.md`, `subtypes/kampfsport.md` |
| practice_sources | `dguv/crowd_veranstaltung.md` |
| products | GB purpose + content_blocks |
| rules | base + `gb_rules` + `gb_event_kampfsport_lean` |
| guides | content_blocks + **runtime_summaries** (keine Voll-risk_patterns) |
| prompts | system_base, guards, gb_user_template |

**Zielgröße:** ≤ 80 000 Zeichen System-Prompt (Stand 2026-06-02: ~58k).

---

## Bewusst **nicht** geladen (GB full)

| Bereich | Grund |
|---------|--------|
| `knowledge/1_standards/` (CEKS, DIN 77200, ISO) | Normzentriert — nicht Bot-Volltext |
| `knowledge/4_sources/` (full) | Nur explizit in Blueprint (`practice_sources`) |
| `knowledge/7_blueprint/*.json` | Steuerung, kein Prompt-Inhalt |
| Andere SDL-Subtypen | Nur `kampfsport` für Kampfsport-Blueprint |
| `veranstaltung_besondere_sicherheitsrelevanz/` | Kap.-5-Overlay — eigener Blueprint geplant |

---

## Größen-Hinweis

| Blueprint | System-Prompt (ca.) |
|-----------|---------------------|
| `gb_event_kampfsport` | ~147k — **OVER** (Voll-guides + examples) |
| `gb_event_kampfsport_lean` | ~58k — **OK** + DGUV |
| `gb_event_kampfsport_micro` | ~40k — **OK**, ohne SDL |

Report: `python3 scripts/context_size_report.py`

---

## Neuen Blueprint anlegen

1. JSON unter `knowledge/7_blueprint/{id}.json` mit vollständigem `context_modules`
2. `python -m shared.blueprint_loader {id}` — muss ohne Fehler laufen
3. Eintrag in dieser Datei
4. Smoke-Test ergänzen oder erweitern
5. Siehe Gate in `CONTEXT_ASSEMBLY_POLICY.md`
