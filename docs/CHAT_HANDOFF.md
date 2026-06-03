# CHAT_HANDOFF — Cert-Expert AI (für neuen Chat)

**Stand:** 2026-06-02  
**Branch:** `cursor/din-77200-1-anforderungsprofile`  
**Zweck:** Nahtloser Wechsel — Organisation **zuerst**, Bots **systematisch** danach.

---

## 1. Was du im neuen Chat zuerst sagen kannst

```
Lies docs/CHAT_HANDOFF.md und hq/README.md.
Priorität: To-dos in hq/03_Kundenprojekte/*/ToDos.md eintragen (ich liefere die Liste).
Bots: erst nach gefüllten Inputs — siehe inputs/ und Pflichtangaben.
Keine neue Bot-Architektur ohne docs/SECTION_* und DOCUMENT_DEPENDENCY_MAP.
```

---

## 2. Zwei Systeme (kurz)

| System | Ordner | Priorität jetzt |
|--------|--------|-----------------|
| **A — Organisation** | `hq/` | **P0** — To-dos eintragen |
| **B — Dokument-Bots** | `bots/`, `knowledge/`, `inputs/`, `projects/` | P1 — nach Inputs |

Architektur-Audit (7 Dateien): siehe [`ARCHITECTURE_INDEX.md`](ARCHITECTURE_INDEX.md).

---

## 3. Organisation (HQ) — erledigt in Struktur

```
hq/
├── 00_Dashboard/
├── 01_Master_Dump/
├── 02_Operations_Board/
├── 03_Kundenprojekte/     ← 7 Kunden, je 6 Standard-MD
├── 04_Vertrieb/ … 09_Archiv/
└── 08_Vorlagen/ToDos_template.md
```

**Kunden:** TeamFlex, Wolf_Street, SecuGuard, Schutzritter, Checkpoint_Regional, ZT_Security, LC_Security

**Registry:** `hq/03_Kundenprojekte/_registry.json`

### To-dos aus Master-DOCX (2026-06-03)

Importiert aus:

- `Cert-Expert_Master_Operations_Board_Juni_2026.docx` → `hq/02_Operations_Board/Operations_Board_Juni_2026.md` + Kunden-`ToDos.md`
- `Cert-Expert_Master_Dump_V1_June_2026.docx` → `hq/01_Master_Dump/Master_Dump_V1_June_2026.md`

**Fokus morgen:** TeamFlex (`TODO-20260603-tf01` … `tf05`).

Weitere Punkte / Korrekturen: einfach ergänzen oder als neue `TODO-…` Blöcke.

**Telegram-Ingest:** noch nicht implementiert — nur Schema (`docs/MOBILE_INPUT_TODO_ARCHITECTURE.md`).

---

## 4. Bots — Ist-Stand (systematisch)

| Bot | Blueprint | Input | Template | Smoke |
|-----|-----------|-------|----------|-------|
| GB | `gb_event_kampfsport_lean` (prod) | `inputs/gb_*.json` | `gb_event_kampfsport.docx` | `tests/smoke_gb_*` |
| SK | `sk_event_kampfsport` | `inputs/sk_event_kampfsport.json` | `sk_event_kampfsport.docx` | `tests/smoke_sk_*` |
| EK | `ec_event_kampfsport` | `inputs/ec_event_kampfsport.json` | `ec_event_kampfsport.docx` | `tests/smoke_ec_*` |
| ODA | — | — | — | — |

**Pflichten-Validator:**

```bash
.venv/bin/python -m shared.pflichten_validator sk_event_kampfsport
.venv/bin/python -m shared.pflichten_validator ec_event_kampfsport
```

**Lauf (LM Studio Port 1234):**

```bash
.venv/bin/python -m bots.02_sicherheitskonzept.sk_bot inputs/sk_event_kampfsport.json --output-mode review
.venv/bin/python -m bots.03_einsatzkonzept.ek_bot inputs/ec_event_kampfsport.json --output-mode review
```

**Outputs:** `outputs/` (gitignored)

### Regeln (nicht brechen)

- Kein Vault-Load (`knowledge/1_standards/` → Bots)
- Nur Blueprint-Allowlist (`docs/CONTEXT_ASSEMBLY_POLICY.md`)
- Drei Pflichten: Angaben, Form, Lektüre (`docs/BOT_PFLICHTREGELN.md`)
- Standalone + optional Flow (`docs/DOCUMENT_DEPENDENCY_MAP.md`)
- Section-Modell geplant, noch nicht in Prompt (`docs/SECTION_BASED_DOCUMENT_GENERATION_CONCEPT.md`)

### Naming

- Fachlich **EK**, Code **EC** (`ec_event_kampfsport`, `EC_*`)

---

## 5. Referenz-Event K1 Berlin

| Was | Pfad |
|-----|------|
| Meta | `projects/k1_berlin_2026/project_meta.json` |
| SK Input | `inputs/sk_event_kampfsport.json` |
| EK Input | `inputs/ec_event_kampfsport.json` |
| Checklisten | `inputs/PFLICHTANGABEN_SK.md`, `PFLICHTANGABEN_EC.md` |

**Offen:** finale Fakten (2 vs. 4 SMA, Ansprechpartner, Sanität, Räumung, Freigabe).

---

## 6. Was bewusst NICHT im letzten Commit ist

| Inhalt | Grund |
|--------|--------|
| `outputs/` | gitignored |
| `inputs/raw_standards/**/*.pdf` | groß, lokal; Extrakte in `knowledge/4_sources/` |
| `shared/__pycache__/` | Build-Artefakt |
| `.venv*` | gitignored |

---

## 7. Roadmap nach To-do-Eintragung

| Phase | Inhalt |
|-------|--------|
| **Jetzt** | To-dos in `hq/03_Kundenprojekte/*/ToDos.md` |
| **Dann** | Inputs SK/EK final → Bot-Läufe |
| **Dann** | EK `sections/` unter `6_products/einsatzkonzept/` |
| **Später** | Flow-Orchestrator, Telegram-Ingest, ODA |

Details: [`NEXT_STEPS.md`](NEXT_STEPS.md)

---

## 8. Wichtige Dateien (Index)

- [`ARCHITECTURE_INDEX.md`](ARCHITECTURE_INDEX.md) — alle Architektur-Docs
- [`TARGET_ARCHITECTURE_PROPOSAL.md`](TARGET_ARCHITECTURE_PROPOSAL.md)
- [`DOCUMENT_DEPENDENCY_MAP.md`](DOCUMENT_DEPENDENCY_MAP.md)
- [`BOT_BAUPPLAN.md`](BOT_BAUPPLAN.md)
- [`knowledge/BOT_CONTEXT_MAP.md`](../knowledge/BOT_CONTEXT_MAP.md)

---

## 9. Git

Nach diesem Handoff: Commit auf Branch `cursor/din-77200-1-anforderungsprofile` mit HQ + Audit + EK/SK Pflichten — push für Chat-Wechsel.

**Neuer Chat:** `git pull` auf diesem Branch, dann `docs/CHAT_HANDOFF.md` lesen.
