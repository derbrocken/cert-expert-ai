# cert-expert-ai

DIN 77200 / Cert-Expert — **Dokument-Bots** (GB, SK, EK) und **Knowledge-Layer**.

## Neuer Chat?

1. [`docs/CHAT_HANDOFF.md`](docs/CHAT_HANDOFF.md)
2. [`hq/README.md`](hq/README.md) — Organisation & To-dos

## Organisation (HQ)

`hq/` — Kundenprojekte, ToDos, Status (7 Kunden angelegt, **Inhalte von dir**).

## Bots (Kurz)

```bash
.venv/bin/python -m shared.pflichten_validator sk_event_kampfsport
.venv/bin/python -m bots.02_sicherheitskonzept.sk_bot inputs/sk_event_kampfsport.json --output-mode review
```

Architektur: [`docs/ARCHITECTURE_INDEX.md`](docs/ARCHITECTURE_INDEX.md)

## Ordner

| Ordner | Zweck |
|--------|--------|
| `hq/` | Unternehmensgedächtnis |
| `knowledge/` | Fachwissen (Bots: Allowlist only) |
| `bots/` | GB, SK, EK |
| `inputs/` | Projekt-JSON + Checklisten |
| `projects/` | Event-Akten |
| `docs/` | Architektur & Handoff |
