# HQ Assistant — Next Steps (Operations Assistant)

**Stand:** 2026-06-03  
**Scope:** Nur Verbesserung des **vorhandenen** HQ Assistant + HQ-Daten + `build_dashboard.py` — keine Telegram, keine neuen Bots, keine Parallel-Architektur.

**Ziel:** Management-Fragen (Blocker, Wartestatus, kritischer Pfad, Portfolio) **zuverlässig** beantworten — nicht nur To-dos vorlesen.

---

## Phase 0 — Ist (erledigt)

- [x] HQ Assistant liest HQ-Dateien  
- [x] To-dos schreiben (`hq_todos.py`)  
- [x] Tagesbriefing (kurz/voll) via `build_dashboard.py`  
- [x] Cursor-Regel `hq-assistant.mdc`  

---

## Phase 1 — Operations-Snapshot ✅ (2026-06-03)

- [x] `hq/00_Dashboard/operations_snapshot.md` via `build_dashboard.py`
- [x] HQ Assistant: Portfolio-Intent → Snapshot + Briefing; Kunden-Intent → Snapshot + Kundenordner
- [ ] Steuerungstabelle in Status.md (Phase 2)

**Inhalt:** Aggregierte Tabellen für Abfragen 1, 5, 6, 7, 8, 9, 10 (siehe Gap Analysis).

**Warum zuerst:** Gleiche Parser-Logik wie Briefing; Assistant wird Portfolio-fähig **ohne** 7× volle Dateien im LLM-Kontext.

**Aufwand:** ~1 Tag Implementierung + Test gegen 10 Abfragen.

**HQ Assistant Änderung (minimal):** `hq_context.py` — bei Portfolio-Keywords Snapshot + Briefing laden; bei Kundenfrage wie bisher.

**Erfolg:** „Welche Kunden sind blockiert?“ / „Audits 30 Tage?“ / „Was urgent?“ deterministisch aus Snapshot.

---

## Phase 2 — Steuerungsblock in Status.md (Daten)

**Was:** Vorlage + Befüllung § `Steuerung` (siehe `HQ_ASSISTANT_DATA_MODEL_IMPROVEMENTS.md`).

**Reihenfolge Befüllung:**

1. TeamFlex, Wolf Street, SecuGuard (Welle 1)  
2. Schutzritter (Audit 26.06., kritischer Pfad vorhanden)  
3. Checkpoint, ZT, ELC  

**Felder minimum:** `Wartet auf`, `Nächste Aktion`, `Verantwortlich (intern)`, `Letzte Aktivität`

**Erfolg:** Antwort auf „Worauf warten wir?“ / „Nächste Aktion?“ pro Kunde ohne To-do-Liste.

**Aufwand:** ~2–3 h Schreibarbeit (Marwan + Cursor), kein Code zwingend.

---

## Phase 3 — ToDo-Schema + Pflege

**Was:** `Wartet auf` + `Verantwortlich` in Vorlage; bestehende urgent-To-dos nachziehen.

**Parser:** `build_dashboard.py` + `hq_todos.py` Felder lesen/schreiben.

**Erfolg:** Abfrage 2, 4, 7, „Aufgaben warten auf andere“.

**Aufwand:** halber Tag Code + schrittweise Pflege.

---

## Phase 4 — Query-Intent im Assistant

**Was:** Leichtes Intent-Routing in `hq_context.py` (Keyword → Snapshot vs. Kunde vs. Querschnitt).

**System-Prompt:** Operations-Antwortschablone (Steuerungstabelle zuerst, dann Top-3 To-dos).

**Kein neuer Bot** — nur Prompt + Kontextauswahl.

**Erfolg:** „Was steht bei Schutzritter an?“ liefert **Steuerung + Pfad**, nicht 8 Bulletpoints.

**Aufwand:** ~0,5–1 Tag.

---

## Phase 5 — Kritischer Pfad vereinheitlichen

**Was:** Tabellen in `Audit_2026.md` für alle Audit-Kunden (Schutzritter als Muster).

**Erfolg:** Abfrage kritischer Pfad + bessere Audit-30-Tage-Liste.

**Aufwand:** Inhaltlich, parallel zu Phase 2.

---

## Phase 6 — Feinschliff Briefing ↔ Assistant

**Was:**

- Briefing-Horizont optional 30 Tage (oder nur Snapshot)  
- `operations_snapshot` Link im Tagesbriefing  
- Nach To-do-Write optional Auto-Refresh Snapshot  

**Erfolg:** Obsidian + Assistant zeigen dieselbe Operations-Wahrheit.

---

## Priorisierte Reihenfolge (kurz)

| Prio | Schritt | Nutzen |
|------|---------|--------|
| **P0** | Phase 1 — `operations_snapshot.md` | Portfolio-Fragen sofort |
| **P0** | Phase 2 — Steuerungstabelle Welle 1 | Pro-Kunde Operations-Antwort |
| **P1** | Phase 4 — Intent + Antwortschablone | Qualität der Formulierung |
| **P1** | Phase 3 — ToDo Wartet auf / Verantwortlich | Externe Abhängigkeiten |
| **P2** | Phase 5 — Kritischer Pfad überall | Audit-Steuerung |
| **P2** | Phase 6 — Briefing-Sync | Einheitliches Ritual |

---

## Abfragen → Phase-Zuordnung

| # | Abfrage | Ab Phase |
|---|---------|----------|
| 1 | Kunden blockiert | 1 (+ Blocker aus Status) |
| 2 | Wartet auf Kunden | 2, 3 |
| 3 | Wartet auf DEKRA | 2 |
| 4 | Wartet auf Auditoren | 2, 3 |
| 5 | Audits 30 Tage | 1 |
| 6 | Überfällig | 1 |
| 7 | urgent | 1 |
| 8 | Forderungen | 1 (bereits gut) |
| 9 | Rote Ampel | 1 |
| 10 | Wichtigste heute | 1 (Scoring) |

---

## Nicht in den nächsten 4 Wochen

- Telegram-Ingest  
- Neuer Bot / Orchestrator  
- YAML/DB/Graph-Datenbank  
- Automatische QM-Ordner-Anbindung  

---

## Definition of Done — „Operations Assistant v1“

Der HQ Assistant gilt als **Operations Assistant v1**, wenn:

1. `operations_snapshot.md` existiert und nach `build_dashboard.py` aktuell ist.  
2. Welle-1-Kunden + Schutzritter haben Steuerungstabelle.  
3. Die **10 Abfragen** aus dem Arbeitsauftrag in einem Testprotokoll **≥8/10** korrekt beantwortet werden (manuell geprüft).  
4. Pro-Kunde-Frage „Was steht an?“ enthält **mindestens:** Ampel, Blocker, Wartet auf, Nächste Aktion, nächster Termin — **vor** der To-do-Liste.

---

## Referenzen

- [`HQ_ASSISTANT_GAP_ANALYSIS.md`](HQ_ASSISTANT_GAP_ANALYSIS.md)  
- [`HQ_ASSISTANT_QUERY_EXPANSION.md`](HQ_ASSISTANT_QUERY_EXPANSION.md)  
- [`HQ_ASSISTANT_DATA_MODEL_IMPROVEMENTS.md`](HQ_ASSISTANT_DATA_MODEL_IMPROVEMENTS.md)  
- [`HQ_USABILITY_PLAN.md`](HQ_USABILITY_PLAN.md)  
- [`MOBILE_INPUT_TODO_ARCHITECTURE.md`](MOBILE_INPUT_TODO_ARCHITECTURE.md)
