# NEXT_STEPS — Nach Architektur-Audit

**Stand:** 2026-06-02  
**Voraussetzung:** Audit-Dateien 1–6 gelesen und **freigegeben** durch Marwan  
**Explizit ausgeschlossen:** Bot-Implementierung, neue Prompts, Orchestrator-Code — **bis Freigabe**

---

## 1. Sofort (diese Woche) — Fokus „Infos befüllen“

Du hattest entschieden: Pipeline steht, **Daten fehlen**. Das bleibt P0.

| # | Aufgabe | Artefakt | Wer |
|---|---------|----------|-----|
| 1.1 | K1-Event-Stammdaten finalisieren (Halle, Datum, Zeiten, 2 vs. 4 SMA) | `inputs/sk_event_kampfsport.json` | Marwan + Cursor |
| 1.2 | SK Pflichtfelder schließen (Sanität, Ansprechpartner, Auflagen) | `inputs/PFLICHTANGABEN_SK.md` abhaken | Marwan |
| 1.3 | SK-Bot Lauf + Review | `outputs/sk_*.json/docx` | Marwan |
| 1.4 | EK-Input aus gleichen Event-Fakten | `inputs/ec_event_kampfsport.json` | Cursor |
| 1.5 | EK-Bot Lauf + Review | `outputs/ec_*.json/docx` | Marwan |
| 1.6 | Optional: GB lean gleiches Event | `inputs/gb_event_kampfsport_lean.json` | nach SK/EK |

**Exit:** Ein konsistentes Event „K1 Berlin ~100 ZG“ in SK + EK mit möglichst wenigen `[OFFENER PUNKT]`.

---

## 2. Architektur-Freigabe (Gate)

Bevor weiterer Bot-/Section-Code:

| # | Entscheidung | Dokument |
|---|--------------|----------|
| 2.1 | HQ neben Repo vs. `hq/` im Repo | `TARGET_ARCHITECTURE_PROPOSAL.md` §9 |
| 2.2 | Section-Stufe S1 (Prompt) vs. S2 (Multi-Call) | `SECTION_BASED_DOCUMENT_GENERATION_CONCEPT.md` §4 |
| 2.3 | GBU in Checklisten-Dateinamen ja/nein | `GAP_ANALYSIS.md` §4 |
| 2.4 | Referenz-Kräftezahl 2 vs. 4 SMA | Nutzer |
| 2.5 | `approved_by` nur QA vs. input required | Nutzer (Empfehlung: optional im Input, QA-Pflicht) |

**Exit:** Kurze Freigabe-Nachricht („Architektur OK + Entscheidungen 2.x“).

---

## 3. Strukturarbeit (ohne Bots) — Reihenfolge

### Phase A — Projekt-Akten (P0)

| # | Deliverable |
|---|-------------|
| A.1 | `projects/README.md` — Schema |
| A.2 | `projects/k1_berlin_2026/` Beispiel mit `project_meta.json`, Inputs |
| A.3 | Verknüpfung in `inputs/*.json` → `project_id` Feld |

### Phase B — Input-Wahrheit (P0)

| # | Deliverable |
|---|-------------|
| B.1 | `inputs/checklists/GBU_Input_Checkliste.md` |
| B.2 | Rename/Alias SK/EK Checklisten |
| B.3 | `knowledge/6_products/*/01_required_inputs.md` für **EK zuerst** |

### Phase C — Section-Paket EK (P1)

| # | Deliverable |
|---|-------------|
| C.1 | `einsatzkonzept/sections/*.md` (9 Dateien) |
| C.2 | `02_section_mapping.md`, `03_knowledge_mapping.md` |
| C.3 | Publikums-Section inkl. Knowledge-Refs |

### Phase D — HQ Second Brain (P1, parallel möglich)

| # | Deliverable | Status |
|---|-------------|--------|
| D.1 | `hq/` Ordnerbaum (im Repo) | ✅ 2026-06-02 |
| D.2 | 7 Kundenprojekt-Ordner + Standard-MD-Set | ✅ |
| D.3 | `08_Vorlagen/ToDos_template.md` | ✅ |
| D.4 | `_registry.json` | ✅ |
| D.5 | **Marwan:** To-dos in `hq/03_Kundenprojekte/*/ToDos.md` | ⏳ ausstehend |

### Phase E — SK/GB/ODA Sections (P2)

Analog Phase C für andere Produkte.

### Phase F — Flow & Orchestrator (P2, nach gefüllten Inputs)

| # | Deliverable |
|---|-------------|
| F.1 | `orchestrator/flow_runner.py` minimal |
| F.2 | SK-JSON → EK enrichment (vollständiges Mapping aus `DOCUMENT_DEPENDENCY_MAP`) |
| F.3 | QA `dependency_incomplete` |

### Phase G — Mobile Ingest (P3)

| # | Deliverable |
|---|-------------|
| G.1 | `MOBILE_INPUT_TODO_ARCHITECTURE` umsetzen |
| G.2 | Telegram Webhook + Append Writer |

### Phase H — ODA + Unterweisung (P3)

Blueprint, Sections, Bot — nach EK stabil.

---

## 4. Was **nicht** als Nächstes tun

- Keinen weiteren Dokument-Bot-Typ ohne Section + Input-Wahrheit
- Kein CEKS-Vault in Bot-Prompts
- Keine Telegram-Implementierung vor ToDo-Schema + HQ-Ordner
- Keine Portal-Entwicklung in diesem Repo (siehe `CERTIFICATION_OS_ARCHITECTURE.md`)
- Keine Doc-Überarbeitung aller Legacy-Pfade (nur bei Berührung)

---

## 5. Audit-Deliverables (dieser Auftrag)

| # | Datei | Status |
|---|-------|--------|
| 1 | `docs/STRUCTURE_AUDIT.md` | ✅ |
| 2 | `docs/GAP_ANALYSIS.md` | ✅ |
| 3 | `docs/TARGET_ARCHITECTURE_PROPOSAL.md` | ✅ |
| 4 | `docs/DOCUMENT_DEPENDENCY_MAP.md` | ✅ |
| 5 | `docs/SECTION_BASED_DOCUMENT_GENERATION_CONCEPT.md` | ✅ |
| 6 | `docs/MOBILE_INPUT_TODO_ARCHITECTURE.md` | ✅ |
| 7 | `docs/NEXT_STEPS.md` | ✅ |

---

## 6. Empfohlene Lesereihenfolge für Marwan

1. `STRUCTURE_AUDIT.md` — Ist-Bild (10 Min)
2. `TARGET_ARCHITECTURE_PROPOSAL.md` — wohin (15 Min)
3. `DOCUMENT_DEPENDENCY_MAP.md` — GBU→SK→EK→ODA (10 Min)
4. `SECTION_BASED_DOCUMENT_GENERATION_CONCEPT.md` — Section-Modell (15 Min)
5. `GAP_ANALYSIS.md` + `NEXT_STEPS.md` — was fehlt / was tun (10 Min)
6. `MOBILE_INPUT_TODO_ARCHITECTURE.md` — wenn HQ Priorität hat

---

## 7. Nach Freigabe — ein Satz an Cursor

> „Architektur freigegeben. Start Phase A+B, dann EK Sections (C). HQ (D) parallel wenn gewünscht. Kein neuer Bot-Code bis S1-Prompt aus Sections.“

Oder bei Fokus Daten:

> „Architektur zur Kenntnis. Nur Phase 1 (Inputs befüllen + SK/EK Lauf).“

---

## 8. Index — Audit-Paket

Alle Dateien unter `docs/`:

- [`STRUCTURE_AUDIT.md`](STRUCTURE_AUDIT.md)
- [`GAP_ANALYSIS.md`](GAP_ANALYSIS.md)
- [`TARGET_ARCHITECTURE_PROPOSAL.md`](TARGET_ARCHITECTURE_PROPOSAL.md)
- [`DOCUMENT_DEPENDENCY_MAP.md`](DOCUMENT_DEPENDENCY_MAP.md)
- [`SECTION_BASED_DOCUMENT_GENERATION_CONCEPT.md`](SECTION_BASED_DOCUMENT_GENERATION_CONCEPT.md)
- [`MOBILE_INPUT_TODO_ARCHITECTURE.md`](MOBILE_INPUT_TODO_ARCHITECTURE.md)
- [`NEXT_STEPS.md`](NEXT_STEPS.md)

Bestehende Policy-Kette bleibt gültig: `BOT_PFLICHTREGELN.md`, `CONTEXT_ASSEMBLY_POLICY.md`, `BOT_BAUPPLAN.md`.
