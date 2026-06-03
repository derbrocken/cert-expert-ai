# HQ Usability Plan — Obsidian lokal, Telegram später

**Stand:** 2026-06-03

## Prinzip

| Schicht | Was | Wer nutzt es |
|---------|-----|----------------|
| Wahrheit | `hq/**/*.md` | Git, Cursor, später Bot |
| Lesesicht | `00_Dashboard/Tagesbriefing.md` | Du in Obsidian |
| Eingang (später) | Telegram Sprache/Text | Du mobil |
| Fachdetail | `Audit_2026.md`, OneDrive | Computer |

## Phase 1 — Lokal (umgesetzt)

- `hq/scripts/build_dashboard.py` → `Tagesbriefing.md`, `Kunden_Uebersicht.md`
- `hq/00_Dashboard/WIE_NUTZEN.md` — Obsidian-Setup
- `.obsidian/snippets/hq-briefing.css` — Lesbarkeit (optional aktivieren)

**Ritual:** Nach HQ-Updates → `python3 hq/scripts/build_dashboard.py` → Obsidian Tagesbriefing öffnen.

## Phase 2 — Telegram (noch offen, lokal)

Siehe `docs/MOBILE_INPUT_TODO_ARCHITECTURE.md`:

- Sprachnotiz → strukturierter Block in `ToDos.md` / `Kommunikation.md`
- Bestätigung in Telegram
- Briefing neu bauen

Kein Hetzner bis lokaler Ablauf steht.

## Phase 3 — Komfort

- Whisper lokal für Sprache
- `/heute` in Telegram = Auszug aus Tagesbriefing
- Dataview in Obsidian (optional)
