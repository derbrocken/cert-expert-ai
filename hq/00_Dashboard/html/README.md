# HQ Dashboard (HTML)

Deutsche Oberfläche — **Übersicht** oben, **Auswahl** unten.

**Alltag & Link:** [../DASHBOARD_ALLTAG.md](../DASHBOARD_ALLTAG.md)

## Start

```bash
cd /Users/marwanmahra/cert-expert-ai
python3 hq/scripts/build_dashboard.py
python3 hq/scripts/serve_dashboard.py
```

Browser-Lesezeichen: **http://127.0.0.1:8765/**

## Dateien hier

| Datei | Rolle |
|-------|--------|
| `index.html` | Seitenaufbau |
| `styles.css` | Design anpassen |
| `app.js` | Logik (API, Listen) |
| `dashboard_data.json` | vom Build erzeugt — nicht von Hand editieren |

Pins: [`../PINS.json`](../PINS.json)

## Sync

Abhaken und Fristen → `ToDos.md` (siehe DASHBOARD_ALLTAG.md). Nicht `index.html` per Doppelklick öffnen — Server nötig.
