# GAP_ANALYSIS — Cert-Expert AI

**Stand:** 2026-06-02  
**Bezug:** `STRUCTURE_AUDIT.md`  
**Zweck:** Lückenliste vor Architekturfreigabe — **keine Implementierung**

---

## 1. Lücken nach Bereich (Übersicht)

| Bereich | Kritisch | Wichtig | Nice-to-have |
|---------|----------|---------|--------------|
| A — Cert-Expert HQ / Ops | ●●● | ●● | ● |
| B — Section-basierte Dokumente | ●●● | ●● | ● |
| C — Input-Checklisten | ●● | ●● | ● |
| D — Dependency / Flow | ●● | ●● | ● |
| E — Knowledge / Mapping | ●● | ● | ● |
| F — Bots / ODA / Unterweisung | ● | ●● | ● |
| G — Doku-Konsistenz | ● | ●● | — |

---

## 2. A — Organisation / Second Brain (Cert-Expert HQ)

### Fehlend (komplett im Repo)

| Artefakt | Beschreibung |
|----------|--------------|
| `Cert-Expert HQ/` oder `hq/` Root | Dashboard, Master Dump, Operations Board |
| `03_Kundenprojekte/{Kunde}/` | TeamFlex, Wolf_Street, SecuGuard, … |
| Standard-MD pro Kunde | `Status.md`, `ToDos.md`, `Kommunikation.md`, `Audit_2026.md`, `Dokumente_und_Nachweise.md`, `Lessons_Learned.md` |
| Einheitliches To-do-Schema | Maschinenlesbare Felder (Projekt, Kategorie, Frist, …) |
| Mobile/Telegram-Ingest | Parser, Zielpfad, Idempotenz — nur Architektur (siehe `MOBILE_INPUT_TODO_ARCHITECTURE.md`) |

### Fehlend (Verknüpfung Bot ↔ HQ)

| Artefakt | Beschreibung |
|----------|--------------|
| `projects/{project_id}/` im Bot-Repo | Projektakte, Inputs, generierte Dokumente, Upstream-JSON |
| Projekt-ID in Input-Envelope | `project_id`, `customer_id`, `event_id` |
| Sync-Regel HQ ↔ projects | Welche Felder HQ führt vs. Bot-Input |

---

## 3. B — Section-basierte Dokumentenerstellung

### Fehlend (pro Dokumenttyp GB, SK, EK, ODA)

Nutzer-Zielstruktur (Beispiel EK):

```
einsatzkonzept/
├── 00_document_structure.md
├── 01_required_inputs.md
├── 02_section_mapping.md
├── 03_knowledge_mapping.md
├── 04_output_rules.md
└── sections/
    ├── 01_allgemeine_angaben.md
    └── …
```

| Datei | GB | SK | EK | ODA |
|-------|----|----|----|-----|
| `00_document_structure.md` | ○ | ○ | ○ | ○ |
| `01_required_inputs.md` | ○ | ○ | ○ | ○ |
| `02_section_mapping.md` | ○ | ○ | ○ | ○ |
| `03_knowledge_mapping.md` | ○ | ○ | ○ | ○ |
| `04_output_rules.md` | ○ | ○ | ○ | ○ |
| `sections/*.md` (8+ Sections) | ○ | ○ | ○ | ○ |

**Heute:** nur `purpose.md` + `content_blocks.md` + Blueprint-`ai_blocks` (flach).

### Fehlend (Querschnitt)

| Artefakt | Beschreibung |
|----------|--------------|
| `SECTION_BASED_DOCUMENT_GENERATION_CONCEPT.md` | ✅ wird in diesem Audit angelegt |
| Section → `ai_block` Registry | 1:1 oder n:1 Mapping |
| Section-Runner (später) | Orchestrator lädt Section-Kontext separat — **nicht jetzt** |

---

## 4. C — Input-Checklisten (Formularstrecke)

### Vorhanden

| Datei | Blueprint |
|-------|-----------|
| `inputs/PFLICHTANGABEN_SK.md` | `sk_event_kampfsport` |
| `inputs/PFLICHTANGABEN_EC.md` | `ec_event_kampfsport` |

### Fehlend (Nutzer-Naming + Vollständigkeit)

| Gewünschte Datei | Entspricht heute | Gap |
|------------------|------------------|-----|
| `GBU_Input_Checkliste.md` | — | fehlt (GB nutzt JSON + Blueprint only) |
| `SK_Input_Checkliste.md` | `PFLICHTANGABEN_SK.md` | Naming + Section-Felder (Publikum etc.) |
| `EK_Input_Checkliste.md` | `PFLICHTANGABEN_EC.md` | Naming + vollständige Feldgruppen |
| `ODA_Input_Checkliste.md` | — | fehlt |

### Fehlend (Input-Logik-Dokumentation pro Typ)

Für jeden Typ sollte dokumentiert sein (Auftrag D):

1. Pflicht vs. optional  
2. Kundeninput vs. Upstream vs. Knowledge  
3. Verbotene Erfindungen  
4. Offene Annahmen  

→ aggregiert in `01_required_inputs.md` je Produkt (fehlt).

### Beispiel-Lücke: Publikumszusammensetzung

| Komponente | Status |
|------------|--------|
| Felder im Blueprint (`audience_profile`, `alcohol_served`, …) | EK: teilweise optional |
| Knowledge „Publikum/Crowd“ | `dguv/crowd_veranstaltung.md`, risk_patterns teils nur GB-lean |
| Section „Publikumszusammensetzung“ | **fehlt** |
| Downstream-Mapping (SK→EK→ODA) | **fehlt** in `DOCUMENT_DEPENDENCY_MAP` (wird angelegt) |

---

## 5. D — Dependency / Flow

### Dokumentiert, nicht implementiert

| Feature | Doku | Code |
|---------|------|------|
| `modes: ["standalone", "flow"]` in Blueprint | ja | Flow-Orchestrator **fehlt** |
| `upstream` / `downstream` in JSON | ja | nur EK: minimaler SK-Import |
| `dependency_incomplete` QA | `BLUEPRINT_ARCHITECTURE.md` | **nein** |
| `upstream_context` im Input | geplant | **nein** |
| `DOCUMENT_DEPENDENCY_MAP.md` | — | ✅ wird angelegt |

### Fehlend (Informationsobjekte)

| Mapping | Beschreibung |
|---------|--------------|
| GBU → SK | Risiken, Maßnahmen, Besucherlogik |
| SK → EK | Schutzziel, Maßnahmenrahmen, Einlass, Notfall |
| EK → ODA | Rollen, Abschnitte, Meldewege, Verhalten |
| ODA → Unterweisung | Pflichtinhalte, Nachweise |

---

## 6. E — Knowledge / Mapping

### Fehlend oder dünn

| Modul | Gap |
|-------|-----|
| `11_examples/` SK, EK, ODA | fast nur README/.gitkeep |
| `6_products/*/structure_guide.md` | in README erwähnt, **nicht** angelegt |
| ODA Blueprint + Bot | `oda_event_standard` nur in Registry-Beispielen |
| Unterweisungs-Bot | nur Extrakt `dguv/unterweisung_veranstaltung.md` |
| Publikums-Section-Knowledge | kein dediziertes `sections/…` oder `guides/audience_*` |
| `4_document_types/` | leer — könnte Dokumenttyp-Taxonomie halten |
| `5_processes/` | leer — könnte Freigabe-/Review-Prozesse halten |

### Veraltete Gap-Reports

`docs/BOT_KNOWLEDGE_GAP_REPORT.md` listet SK/EK-Produktgerüst als „fehlend“ — **überholt** (purpose/content_blocks existieren).

---

## 7. F — Bots & Templates

| Komponente | Status |
|------------|--------|
| GB Bot + lean/micro | ✅ |
| SK Bot | ✅ MVP |
| EK Bot | ✅ MVP |
| ODA Bot | ❌ |
| Unterweisungs-Bot | ❌ |
| GB `pflichten`-Block im Blueprint | ❌ (SK/EK haben `pflichten`) |
| Sectionweise Generierung | ❌ |
| Orchestrator | ❌ |

---

## 8. G — Dokumentations- und Repo-Hygiene

| Gap | Maßnahme (später) |
|-----|-------------------|
| `KNOWLEDGE_ARCHITECTURE.md` Pfade 5/6/9 vs. 6/7/10 | Harmonisieren |
| `REVIEWER_LOGIC.md` → `9_rules` | auf `10_rules` korrigieren |
| `sdl_registry.json` Pfad in Taxonomie-Doc | auf `7_blueprint/` korrigieren |
| Knowledge-Root: Diagnose/Smoke-Dateien | nach `outputs/` oder `tests/` |
| `README.md` Root | Stub — Projekt-README fehlt |
| EC/EK Naming Guide | ein MD „Namensraum EC/EK“ |

---

## 9. Priorisierte Gap-Liste (für Freigabe)

### P0 — vor Section-Bots / vor HQ-Automation

1. `DOCUMENT_DEPENDENCY_MAP.md` + Standalone/Dependency-Regeln ✅ (dieser Audit)
2. Section-Struktur-Konzept + Zielordner unter `6_products/` (Konzept, dann Dateien)
3. Vollständige Input-Checklisten GB, SK, EK, ODA (ein Naming-Schema)
4. Entscheidung: HQ **neben** vs. **in** Repo + `projects/` Schema
5. `01_required_inputs.md` je Produkt (Quelle der Wahrheit für Formulare)

### P1 — nach Architekturfreigabe

6. `pflichten` für GB lean  
7. Flow-Orchestrator (minimal: SK-JSON → EK Input enrichment)  
8. ODA Produkt-Sections + Blueprint  
9. Beispiele `11_examples/` pro Produkt  
10. Bereinigung Knowledge-Root

### P2 — später

11. Portal / Certification OS Anbindung  
12. Telegram-Ingest Implementierung  
13. Section-Runner (multi-call oder structured single-call)  
14. `dependency_incomplete` in QA

---

## 10. Bezug zu Nutzer-Entscheidung „Inputs befüllen“

Technische Pipeline (GB/SK/EK) ist **nicht** die Hauptlücke mehr.

**Hauptlücke:** fachlich vollständige, projektgebundene Inputs + Section-/Mapping-Wahrheit, damit Generierung **auditierbar** wird statt `[OFFENER PUNKT]`-Last.

Siehe `NEXT_STEPS.md`.
