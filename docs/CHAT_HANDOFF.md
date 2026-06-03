# CHAT_HANDOFF — Cert-Expert AI (Übergabe neuer Chat)

**Stand:** 2026-06-03  
**Branch:** `cursor/din-77200-1-anforderungsprofile` (remote aktuell)  
**Letzte Commits:** `4cb4e06` Schutzritter · `64585ba` HQ-Import · `e9052d4` Audit + EK/SK MVP

---

## 0. Copy-Paste für den neuen Chat (Startbefehl)

```
Repo: cert-expert-ai
Branch: cursor/din-77200-1-anforderungsprofile — zuerst: git pull

Lies vollständig:
1) docs/CHAT_HANDOFF.md (diese Datei)
2) docs/ARCHITECTURE_INDEX.md
3) hq/README.md

Kontext:
- Drei Einstiege: (A) hq/ Organisation — (B) **HQ Assistant** `bots/00_hq_assistant/` oder Cursor-Regel `hq-assistant` — (C) Dokument-Bots GB/SK/EK in `bots/01–03` + `knowledge/`
- Architektur-Audit ist dokumentiert; Section-basierte Generierung und Flow-Orchestrator sind NOCH NICHT implementiert.
- Kein neuer Bot-Code ohne Abgleich mit DOCUMENT_DEPENDENCY_MAP und SECTION_BASED_DOCUMENT_GENERATION_CONCEPT.

Aktuelle Prioritäten (Marwan):
1) HQ/Operations: TeamFlex (Audit 12.06.), Wolf Street (16.06.), SecuGuard (30.06.)
2) Schutzritter: VK-Datei ASAP uploaden; morgen Unternehmensformulare vom Kunden; dann MA-Formulare senden; Audit 26.06.2026
3) Bots später: Inputs finalisieren, SK/EK-Läufe — Schutzritter-Referenz SK/EK

Regeln:
- knowledge/1_standards/ nie in Bot-Prompts
- Nur Blueprint-Allowlist (CONTEXT_ASSEMBLY_POLICY)
- Pflichten: BOT_PFLICHTREGELN + pflichten_validator

Was soll der Agent als Erstes tun? → Marwan fragt explizit (HQ vs. Bots vs. Schutzritter).
```

---

## 1. Architektur-Status (Gesamtbild)

| Bereich | Fortschritt | Kurz |
|---------|-------------|------|
| **Doku / Zielarchitektur** | ~90 % | 7 Audit-Dateien + Index + Policy-Kette |
| **HQ Organisation** | ~75 % | Struktur + Import + Schutzritter-Update; Inhalt laufend |
| **Bot-Laufzeit (GB/SK/EK)** | ~55 % | MVP läuft; Sections + Flow + ODA fehlen |
| **Telegram / Orchestrator** | 0 % | nur Konzept |

### Erledigt (Architektur)

- [`STRUCTURE_AUDIT.md`](STRUCTURE_AUDIT.md) — Ist-Analyse Repo
- [`GAP_ANALYSIS.md`](GAP_ANALYSIS.md) — Lücken
- [`TARGET_ARCHITECTURE_PROPOSAL.md`](TARGET_ARCHITECTURE_PROPOSAL.md) — Zielbild zwei Systeme
- [`DOCUMENT_DEPENDENCY_MAP.md`](DOCUMENT_DEPENDENCY_MAP.md) — GBU→SK→EK→ODA, Standalone + Dependency
- [`SECTION_BASED_DOCUMENT_GENERATION_CONCEPT.md`](SECTION_BASED_DOCUMENT_GENERATION_CONCEPT.md) — Konzept only
- [`MOBILE_INPUT_TODO_ARCHITECTURE.md`](MOBILE_INPUT_TODO_ARCHITECTURE.md) — To-do-Schema Telegram
- [`NEXT_STEPS.md`](NEXT_STEPS.md) — Phasenplan
- [`BOT_PFLICHTREGELN.md`](BOT_PFLICHTREGELN.md) · [`BOT_BAUPPLAN.md`](BOT_BAUPPLAN.md)
- [`ARCHITECTURE_INDEX.md`](ARCHITECTURE_INDEX.md) — Einstieg

### Noch offen (Architektur-Umsetzung)

| # | Baustein |
|---|----------|
| 1 | `knowledge/6_products/*/sections/` + `01_required_inputs.md` |
| 2 | Prompt-Assembly Stufe **S1** (ein Call, nach Sections strukturiert) |
| 3 | `orchestrator/` Flow (SK-JSON → EK) vollständig |
| 4 | `projects/{kunde}/` pro Kunde (nur `k1_berlin_2026` Beispiel) |
| 5 | ODA-Bot + Blueprint |
| 6 | GB lean `pflichten`-Block |
| 7 | Telegram-Ingest |

---

## 2. System A — HQ (Organisation)

**Pfad:** `hq/` (im Repo, mit Git)

```
hq/
├── 00_Dashboard/          ← Übersicht + To-do-Zähler
├── 01_Master_Dump/        ← Master_Dump_V1_June_2026.md
├── 02_Operations_Board/   ← Operations_Board_Juni_2026.md
├── 03_Kundenprojekte/     ← 7 Kunden × 6 Dateien
├── 04_Vertrieb/           ← Angebote_Juni_2026.md
├── 05_Forderungen/        ← Offene_Juni_2026.md
├── 06_Software/           ← Intern + Software_Backlog
├── 07_DFSS/
├── 08_Vorlagen/           ← ToDos_template.md
└── 09_Archiv/
```

**Registry:** `hq/03_Kundenprojekte/_registry.json`

### Kunden — Ampel (Juni 2026)

| Kunde | Fokus | ToDos-Datei |
|-------|--------|-------------|
| **TeamFlex** | 🔴 Audit **12.06.** — morgen Kunde/ Wachbuch | [`TeamFlex/ToDos.md`](../hq/03_Kundenprojekte/TeamFlex/ToDos.md) |
| **Wolf Street** | 🔴 Audit **16.06.** | [`Wolf_Street/ToDos.md`](../hq/03_Kundenprojekte/Wolf_Street/ToDos.md) |
| **SecuGuard** | 🔴 Frist **30.06.** Abweichungen | [`SecuGuard/ToDos.md`](../hq/03_Kundenprojekte/SecuGuard/ToDos.md) |
| **Schutzritter** | 🔴 Audit **26.06.** VK ASAP, Formulare | [`Schutzritter/ToDos.md`](../hq/03_Kundenprojekte/Schutzritter/ToDos.md) |
| Checkpoint Regional | 🟠 Welle 2 | `Checkpoint_Regional/ToDos.md` |
| ZT Security | 🟠 Scope | `ZT_Security/ToDos.md` |
| LC Security | 🟠 NA + AZAV | `LC_Security/ToDos.md` |

### Schutzritter — letzter Stand (Gespräch 03.06.2026)

**Reihenfolge:**

1. **VK-Datei uploaden** — überfällig (~2 Wochen), **ASAP** (`TODO-20260603-sr06`)
2. Kunde lädt **Unternehmensformulare** hoch (vereinbart: Tag nach Gespräch) (`sr07`)
3. **Mitarbeiterformulare** an Kunden senden (`sr08`)
4. Personal / Audit bis **26.06.2026**
5. SK/EK (Bots) — nach Basis-Nachweisen

Details: [`hq/03_Kundenprojekte/Schutzritter/Kommunikation.md`](../hq/03_Kundenprojekte/Schutzritter/Kommunikation.md), [`Audit_2026.md`](../hq/03_Kundenprojekte/Schutzritter/Audit_2026.md)

### Import-Quellen (bereits verarbeitet)

- `Cert-Expert_Master_Operations_Board_Juni_2026.docx`
- `Cert-Expert_Master_Dump_V1_June_2026.docx`

Weitere Gespräche/To-dos: neue `TODO-YYYYMMDD-…` Blöcke unter **## Offen** in `ToDos.md`.

---

## 3. System B — Dokument-Bots

### Aktive Bots

| Bot | Blueprint | Input | Befehl |
|-----|-----------|-------|--------|
| GB | `gb_event_kampfsport_lean` | `inputs/gb_*.json` | `python -m bots.01_gefaehrdungsbeurteilung.gb_bot …` |
| SK | `sk_event_kampfsport` | `inputs/sk_event_kampfsport.json` | `python -m bots.02_sicherheitskonzept.sk_bot …` |
| EK | `ec_event_kampfsport` | `inputs/ec_event_kampfsport.json` | `python -m bots.03_einsatzkonzept.ek_bot …` |

**Voraussetzung:** `.venv` + LM Studio Port **1234** (`shared/api_client.py`)

### Qualitäts-Gates (ohne LLM)

```bash
cd cert-expert-ai
.venv/bin/python -m shared.pflichten_validator sk_event_kampfsport
.venv/bin/python -m shared.pflichten_validator ec_event_kampfsport
.venv/bin/python tests/smoke_sk_event_kampfsport.py
.venv/bin/python tests/smoke_ec_event_kampfsport.py
```

### Pflichten je Blueprint

| Säule | SK | EK | GB lean |
|-------|----|----|---------|
| Angaben | `inputs/PFLICHTANGABEN_SK.md` | `PFLICHTANGABEN_EC.md` | nur JSON |
| Form | `templates/sk_*.docx` | `templates/ec_*.docx` | `gb_*.docx` |
| Lektüre | `7_blueprint/sk_*.json` | `ec_*.json` | lean JSON |

### Referenz-Event (Test)

- `projects/k1_berlin_2026/`
- Inputs: `inputs/sk_event_kampfsport.json`, `inputs/ec_event_kampfsport.json`
- **Offen:** finale Event-Fakten (2 vs. 4 SMA, Kontakte, Sanität, Freigabe)

### EK Flow-ready (minimal)

- Felder: `upstream_sk_available`, `upstream_sk_path`
- Code: `ek_bot.py` importiert `SK_SCHUTZZIEL` + `SK_SCHUTZMASSNAHMEN` wenn SK-JSON vorhanden
- **Kein** Orchestrator — manuell Pfad setzen

### Naming

- **EK** (fachlich) = **EC** (Code: `ec_*`, `EC_*`)

---

## 4. Entscheidungsbaum für neuen Agent

```
Marwan will …
│
├─ HQ / Kunden / Fristen / To-dos
│   → hq/03_Kundenprojekte/{Kunde}/
│   → Schema: hq/08_Vorlagen/ToDos_template.md
│
├─ Schutzritter operativ
│   → sr06 VK → sr07 Unternehmensformulare → sr08 MA-Formulare
│   → KEIN Bot bis VK/Formulare geklärt (außer Marwan sagt anders)
│
├─ SK/EK Dokumente generieren
│   → inputs/ finalisieren → Bot-Lauf → outputs/
│   → DOCUMENT_DEPENDENCY_MAP + BOT_PFLICHTREGELN
│
└─ Architektur weiterbauen (Sections, Flow, ODA)
│   → SECTION_BASED_* + TARGET_ARCHITECTURE
│   → KEIN blindes Prompt-Tuning
```

---

## 5. Repo-Setup (neuer Chat)

```bash
cd /Users/marwanmahra/cert-expert-ai
git pull origin cursor/din-77200-1-anforderungsprofile
```

**Nicht committen:** `outputs/`, `inputs/raw_standards/*.pdf` (groß, lokal), `__pycache__`

**Handoff-Datei:** immer diese Datei zuerst aktualisieren bei größeren Schritten, dann commit.

---

## 6. Was der vorherige Chat erledigt hat

| Thema | Status |
|-------|--------|
| Architektur-Audit (7 Docs) | ✅ |
| HQ-Struktur + 7 Kunden | ✅ |
| Master Board/Dump → HQ To-dos | ✅ |
| SK Pflichten + Template + Bot MVP | ✅ |
| EK Blueprint + Bot MVP + Pflichten | ✅ |
| Schutzritter Gespräch → HQ | ✅ |
| Section-Implementierung | ❌ |
| Inputs K1 final | ❌ |
| Telegram | ❌ |

---

## 7. Empfohlene nächste Schritte (für Marwan)

| Priorität | Aktion |
|-----------|--------|
| P0 | TeamFlex: tf01–tf05 (Audit 12.06.) |
| P0 | Schutzritter: VK-Upload (sr06) |
| P1 | Schutzritter: MA-Formulare nach Unternehmens-Upload (sr07→sr08) |
| P1 | Wolf Street / SecuGuard Fristen |
| P2 | Inputs SK/EK → Bot-Läufe (K1 oder Schutzritter-Event) |
| P3 | EK Sections unter `6_products/einsatzkonzept/` |

---

## 8. Index

| Datei | Inhalt |
|-------|--------|
| [`ARCHITECTURE_INDEX.md`](ARCHITECTURE_INDEX.md) | Alle Architektur-Docs |
| [`hq/README.md`](../hq/README.md) | HQ-Einstieg |
| [`knowledge/BOT_CONTEXT_MAP.md`](../knowledge/BOT_CONTEXT_MAP.md) | Bot-Allowlists |
| [`inputs/checklists/README.md`](../inputs/checklists/README.md) | Input-Checklisten |
| [`BRIEFING_CHATGPT_EK_M4.md`](BRIEFING_CHATGPT_EK_M4.md) | EK-Fachpaket (ChatGPT) |

---

*Ende Handoff — bei Übergabe diese Datei mit aktuellem Datum oben pflegen.*
