# HQ Assistant

**Nur Organisation** (`hq/`) — getrennt von GB / SK / EK (Dokumente + `knowledge/`).

## Wofür

**Fragen**

- „Was steht bei TeamFlex an?“
- „Welche Audits diese Woche?“

**To-dos aufnehmen** (schreibt in `hq/.../ToDos.md` oder Querschnitt-Datei)

- `todo TeamFlex: Wachbuch bis 11.06. dringend`
- `TeamFlex: Kunde anrufen wegen Monatsplan`
- `--add -c SecuGuard --task "NC M3 Korrektur einreichen" --prioritaet urgent`

Antworten basieren auf **`operations_snapshot.md`** (Portfolio) bzw. Kundenordner + Snapshot.

---

## Variante A — Terminal (LM Studio)

Voraussetzung: LM Studio läuft (`shared/api_client.py`).

```bash
cd /Users/marwanmahra/cert-expert-ai

# Kontext prüfen ohne LLM
python3 -m bots.00_hq_assistant.hq_bot --dry-run "Was steht bei TeamFlex an?"

# Frage stellen
python3 -m bots.00_hq_assistant.hq_bot "Was steht bei TeamFlex an?"

# To-do (Regel-Parser, ohne LM Studio)
python3 -m bots.00_hq_assistant.hq_bot "todo TeamFlex: Wachbuch nachfassen bis morgen dringend"
python3 -m bots.00_hq_assistant.hq_bot --add -c TeamFlex --task "DEKRA-Ordner prüfen" --prioritaet high --refresh

# To-do nur anzeigen
python3 -m bots.00_hq_assistant.hq_bot --dry-run "todo Schutzritter: VK upload urgent"

# Kunde explizit laden (Frage)
python3 -m bots.00_hq_assistant.hq_bot -c SecuGuard "Welche NCs sind offen?"

# Briefing neu bauen, dann fragen
python3 -m bots.00_hq_assistant.hq_bot --refresh "Überblick heute"

# Chat-Schleife
python3 -m bots.00_hq_assistant.hq_bot -i
```

| Flag | Bedeutung |
|------|-----------|
| `--refresh` | `hq/scripts/build_dashboard.py` vorher |
| `--full-briefing` | auch `Tagesbriefing_VOLL.md` |
| `--cross` | Forderungen, Vertrieb, Software, DFSS |
| `--dry-run` | Kontext + Modus (`portfolio` / `customer`) anzeigen |

Nach HQ-Updates immer zuerst:

```bash
python3 hq/scripts/build_dashboard.py
```

Portfolio-Fragen nutzen `hq/00_Dashboard/operations_snapshot.md` (Abschnitt **Portfolio-Auswertungen**).
| `--add` / `todo …` | To-do erfassen |
| `--task` | Aufgabentext (mit `--add`) |
| `--no-llm` | Freitext nur regelbasiert |

---

## Variante B — Cursor (empfohlen ohne LM Studio)

1. **Neuer Chat** (nicht der GB/SK/EK-Chat).
2. Regel aktivieren: **HQ Assistant** (`.cursor/rules/hq-assistant.mdc`) — im Regel-Picker oder `@hq-assistant`.
3. Fragen stellen; der Agent liest `hq/` direkt.

Startbefehl zum Einfügen:

```
HQ Assistant only — lies hq/README.md und 00_Dashboard/Tagesbriefing.md.
Keine Dokumenten-Bots (GB/SK/EK), kein knowledge/ für Normen.
Antworte nur aus hq/-Dateien.
```

---

## Was wird geladen?

Immer: `Tagesbriefing.md`, `Kunden_Uebersicht.md`, Operations Board, `_registry.json`.

Bei Kundennamen in der Frage (oder `-c`): `Status.md`, `ToDos.md`, `Audit_2026.md`.

Bei Querschnitt-Stichwörtern oder `--cross`: `05_Forderungen`, `04_Vertrieb`, `06_Software`, `07_DFSS`.

---

## Pflege

Nach HQ-Updates:

```bash
python3 hq/scripts/build_dashboard.py
```

Dann HQ Assistant erneut fragen (oder `--refresh`).
