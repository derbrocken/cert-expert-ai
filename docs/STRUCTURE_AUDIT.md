# STRUCTURE_AUDIT — Cert-Expert AI (Ist-Stand)

**Stand:** 2026-06-02  
**Auftrag:** Architektur-Audit (keine Bot-Implementierung)  
**Scope:** Repo `cert-expert-ai` + Abgrenzung zu geplantem „Cert-Expert HQ“

---

## 1. Executive Summary

Das Repo `cert-expert-ai` ist **zweigeteilt**, aber fachlich noch nicht vollständig getrennt dokumentiert:

| Spur | Ist im Repo | Reifegrad |
|------|-------------|-----------|
| **A — Organisation / Second Brain** | kaum vorhanden | Konzept nur in Nutzerbriefing / Certification OS |
| **B — Fachliche Bot-/Dokumentenarchitektur** | **dominant** | Pipeline aktiv (GB/SK/EK), Knowledge kuratiert |

**Kernbefund:** Die Bot-Spur ist weiter als die Organisations-Spur. `knowledge/` und `docs/` sind gut für Dokument-Bots; **Kundenprojekte, To-dos, Fristen und Mobile-Input** fehlen als eigene, maschinenlesbare Struktur.

---

## 2. Top-Level — Was existiert

```
cert-expert-ai/
├── bots/           # 01 GB, 02 SK, 03 EK (aktiv); 04 ODA leer; legacy_tools archiviert
├── docs/           # Architektur, Policy, Specs (~18 MD-Dateien)
├── inputs/         # JSON-Fixtures, PFLICHTANGABEN, raw_standards (PDFs)
├── knowledge/      # CEKS + Bot-Wissen (nummerierte Layer)
├── outputs/        # Generierte JSON/DOCX (lokal, gitignored-Anteile)
├── prompts/        # System/User-Templates (Repo-Root)
├── shared/         # Pipeline (loader, context, QA, docx, pflichten_validator)
├── scripts/        # context_size_report, Anforderungsprofile
├── templates/      # DOCX + Generatoren
└── tests/          # Smoke ohne LLM
```

**Nicht vorhanden (aber in Doku referenziert):**

- `projects/` — projektspezifische Akten (laut `knowledge/README.md` vorgesehen)
- `orchestrator/` — Flow-/Dependency-Orchestrierung
- `Cert-Expert HQ/` — Unternehmensgedächtnis (Nutzer-Zielstruktur, **außerhalb** dieses Repos)

---

## 3. knowledge/ — Nummerierte Layer (Ist)

| Ordner | Dateien (ca.) | Rolle | Bot-relevant |
|--------|---------------|-------|--------------|
| `1_standards/` | ~90 | CEKS, DIN 77200, ISO, Governance | **Nein** (Vault; Cursor/Mensch) |
| `2_regulations/` | 8 | Überblicke ArbSchG, DGUV V1, VStättVO | **Ja** (`standards` in Blueprint) |
| `3_sdls/` | 29 | Veranstaltungsschutz + Subtypen | **Ja** |
| `4_document_types/` | 0 | Platzhalter | Nein |
| `4_sources/` | 13 | DGUV/Behörden/Praxis/DIN-Extrakte | **Ja** (`practice_sources`) |
| `5_processes/` | 0 | Platzhalter | Nein |
| `6_products/` | 11 | GB, SK, EK, ODA purpose/content_blocks | **Ja** |
| `7_blueprint/` | 7 JSON | Allowlists, input_schema, pflichten | **Steuerung** |
| `8_guides/` | 22 | Risiko, Maßnahmen, runtime_summaries | **Ja** (selektiv) |
| `9_concepts/` | 0 | Platzhalter | Nein |
| `10_rules/` | 14 | base + products + blueprints | **Ja** |
| `11_examples/` | 11 | GB-Beispiele; SK/EK/ODA meist leer | Teilweise |

**Zusatz im knowledge-Root (Audit-Hinweis):**

- `BOT_CONTEXT_MAP.md` — menschliche Allowlist-Übersicht ✅
- `_access_test/`, `_diag_input_lean.json`, Outputs/Smoke-Artefakte — **sollten nicht** im Knowledge-Baum liegen (Verschmutzung)

**Pfad-Wahrheit (Code):** `shared/knowledge_paths.py` mappt Blueprint-Key `standards` → `2_regulations/`, **nicht** `1_standards/`.

---

## 4. docs/ — Governance-Kette (Ist)

| Dokument | Funktion |
|----------|----------|
| `CONTEXT_ASSEMBLY_POLICY.md` | Bots laden nur Blueprint-Allowlist |
| `BOT_PFLICHTREGELN.md` | Pflichtangaben / Form / Lektüre |
| `BOT_BAUPPLAN.md` | Bau-Reihenfolge je Bot |
| `BLUEPRINT_ARCHITECTURE.md` | Blueprint-Schema, Flow (geplant) |
| `INPUT_ARCHITECTURE.md` | JSON-Envelope, Quellen |
| `KNOWLEDGE_ARCHITECTURE.md` | Layer (teilweise veraltete Pfade) |
| `CERTIFICATION_OS_ARCHITECTURE.md` | Portal, Tool 1/2, Audit-Readiness |
| `PROJECT_ARCHITECTURE.md` | Bot ↔ Portal-Grenze |
| `GB_BOT_SPEC.md`, `GB_EVENT_KAMPFSPORT_MAPPING.md` | GB-spezifisch |
| `BOT_KNOWLEDGE_GAP_REPORT.md` | Lücken SK/EK/ODA (teilweise überholt) |
| `MILESTONE_PLAN_PARALLEL_AGENTS.md` | Meilensteine |

**Fehlend (vor diesem Audit):** die sieben Dateien aus Auftrag G (STRUCTURE_AUDIT, GAP, TARGET, DEPENDENCY, SECTION, MOBILE, NEXT_STEPS).

---

## 5. bots/ — Dokument-Bots (Ist)

| Bot | Blueprint | Input | Template | Status |
|-----|-----------|-------|----------|--------|
| `gb_bot.py` | `gb_event_kampfsport*` | `inputs/gb_*.json` | `gb_event_kampfsport.docx` | **produktiv** (lean default) |
| `sk_bot.py` | `sk_event_kampfsport` | `inputs/sk_event_kampfsport.json` | `sk_event_kampfsport.docx` | **MVP** |
| `ek_bot.py` | `ec_event_kampfsport` | `inputs/ec_event_kampfsport.json` | `ec_event_kampfsport.docx` | **MVP** |
| `04_oda/` | — | — | — | **leer** |

**Hinweis Namensraum:** Produkt **EK** (Einsatzkonzept), Code **EC** (`ec_*`, `EC_*`), Ordner `03_einsatzkonzept/`, Log `[EK-Bot]`.

---

## 6. inputs/ — Daten vs. Wissen (Ist)

| Typ | Pfad | Zweck |
|-----|------|--------|
| Blueprint-Fixtures | `inputs/*.json` | Test-/Beispiel-Projektdaten |
| Pflicht-Checklisten | `PFLICHTANGABEN_SK.md`, `PFLICHTANGABEN_EC.md` | Mensch + später Formular |
| Firmendaten | `company_data.json` | DOCX Layer 1 |
| Rohnormen | `inputs/raw_standards/` | **Nicht** in Bot-Prompt |
| Praxis-Roh | `inputs/practical_sources/` | Quelle für Extrakte |

**Lücke:** Keine `PFLICHTANGABEN_GB.md`, keine `GBU_Input_Checkliste.md` (Nutzer-Naming), keine projektgebundene Ordnerstruktur pro Kunde.

---

## 7. Generierungsmodell heute (Ist vs. Ziel)

| Aspekt | Heute | Ziel (Nutzerauftrag) |
|--------|-------|----------------------|
| Dokumentstruktur | `ai_blocks` + ein `content_blocks.md` | **Section-Ordner** pro Produkt mit Mapping |
| Generierung | 1 LLM-Call → alle Blöcke JSON | Sectionweise (konzeptionell) |
| Upstream | JSON-Felder + minimaler SK-Import in EK-Bot | Explizites `DOCUMENT_DEPENDENCY_MAP` |
| QA | `quality_checker` standalone | + `dependency_incomplete` (geplant) |
| Projekte | flache `inputs/*.json` | `projects/{kunde}/{event}/` oder HQ-Verknüpfung |

---

## 8. Doppelungen / Unklarheiten / Falsch eingeordnet

### 8.1 Doppelte oder parallele Ablagen

- **Norm-PDFs:** `inputs/raw_standards/` mit mehrfachen DIN-77200-Varianten (DOCX/PDF, unterschiedliche Dateinamen).
- **Virtuelle Umgebungen:** `.venv`, `.venv-pdf`, `.venv_pdf`, `venv` — Betriebschaos, kein Architekturproblem, aber Audit-Hinweis.
- **Dokumentation vs. Code:** ältere Docs nennen `knowledge/9_rules`, `6_blueprint`; live: `10_rules`, `7_blueprint`.

### 8.2 Namens-Inkonsistenzen

| Thema | Varianten |
|-------|-----------|
| Gefährdungsbeurteilung | GB (Code), GBU (Nutzer-Sprache), `Gefährdungsbeurteilung/` (Ordner) |
| Einsatzkonzept | EK (fachlich), EC (Blueprint/Platzhalter), `einsatzkonzept/` (Ordner) |
| Pflichtangaben | `PFLICHTANGABEN_EC.md` vs. geplant `PFLICHTANGABEN_EK.md` |

### 8.3 Leere Platzhalter-Ordner

`4_document_types/`, `5_processes/`, `9_concepts/` — ohne README-Zweckbindung wirken sie wie „vergessene“ Layer.

### 8.4 CEKS vs. Bot-Wissen vermischt (Risiko)

- `knowledge/1_standards/` ist groß und wertvoll für **Mensch/Cursor**, darf aber **nie** automatisch in Bot-Prompts.
- Policy existiert (`CONTEXT_ASSEMBLY_POLICY.md`); Disziplin muss bei Section-Mapping und neuen Ordnern wiederholt werden.

### 8.5 Outputs / Diagnose im Knowledge-Baum

Dateien wie `_diag_input_lean.json`, Smoke-DOCX unter `knowledge/` — gehören nach `outputs/` oder `tests/fixtures/`.

---

## 9. Cert-Expert HQ (Zielstruktur) — Abgrenzung

Die vom Nutzer gewünschte Struktur:

```
Cert-Expert HQ/
├── 00_Dashboard/
├── 01_Master_Dump/
├── 02_Operations_Board/
├── 03_Kundenprojekte/{Kunde}/
├── 04_Vertrieb/ … 09_Archiv/
```

**existiert nicht** in `cert-expert-ai`.

**Empfehlung (siehe TARGET_ARCHITECTURE):**

- HQ als **Schwester-Root** oder Unterordner `hq/` mit klarer Sync-Grenze zu `cert-expert-ai/projects/`.
- Bot-Repo bleibt **generisches** Fachwissen; Kundendaten nur unter HQ/projects.

---

## 10. Was gut funktioniert (beibehalten)

1. **Blueprint-gesteuerte Allowlists** (`7_blueprint/*.json` + `BOT_CONTEXT_MAP.md`)
2. **Drei Pflichten** (Angaben, Form, Lektüre) + `pflichten_validator`
3. **Getrennte Spuren:** `1_standards` (CEKS) vs. `2_regulations` + `4_sources` (Bots)
4. **Produktordner** `6_products/{gb,sk,ek,oda}/`
5. **Einheitliche Pipeline** in `shared/` für alle Dokument-Bots
6. **Smoke-Tests ohne LLM** als Architektur-Gate

---

## 11. Audit-Fazit

| Bereich | Bewertung |
|---------|-----------|
| Bot-/Knowledge-Grundgerüst | **Stark**, erweiterbar |
| Section-basierte Generierung | **Konzeptionell fehlend** |
| Input-Checklisten vollständig | **Teilweise** (SK, EC; GB/ODA fehlen) |
| Dependency/Flow | **Dokumentiert, kaum implementiert** |
| Organisation / HQ / Mobile | **Nicht im Repo** |
| Projekt-Akten | **Nicht implementiert** (`projects/` fehlt) |

**Nächste Lesestücke:** `GAP_ANALYSIS.md`, `TARGET_ARCHITECTURE_PROPOSAL.md`.
