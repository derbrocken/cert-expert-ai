# HQ — Start hier

**Landkarte (Reset):** [**HQ_LANDKARTE.md**](HQ_LANDKARTE.md) — Operations vs. Strategie vs. DFSS  
**Doku-Reset:** [**DOC_RESET_2026-06.md**](DOC_RESET_2026-06.md) · **Dashboard V3 (geplant):** [**DASHBOARD_PLAN_V3_STRATEGIE.md**](DASHBOARD_PLAN_V3_STRATEGIE.md)

---

## Reihenfolge (Operations — täglich)

1. **[ARBEITSUEBERSICHT.md](ARBEITSUEBERSICHT.md)** — **Mein Tag** (Pins) + **Kunden** (volle Liste, 4 Spalten) + **Sonstiges** (kurz)
2. Abhaken → speichern → `python3 hq/scripts/build_dashboard.py` (sync in `ToDos.md` / Querschnitt)
3. Optional: wichtige Zeilen zusätzlich in **Mein Tag** pinnen
4. **[BACKLOG.md](BACKLOG.md)** — **Vollliste** (Privat, Ideen, Spiegel aller To-dos)
5. **Dashboard HTML:** [DASHBOARD_ALLTAG.md](DASHBOARD_ALLTAG.md) — Link **http://127.0.0.1:8765/**, Dateien, Sync, Design — Plan: [DASHBOARD_PLAN_V2.md](DASHBOARD_PLAN_V2.md)
5. **[EINGANG.md](EINGANG.md)** — Rohnotiz → *„Bitte ins Backlog“*

Alles Tagesrelevante liegt in **`00_Dashboard/`**.

---

## Dateien hier

| Datei | Rolle |
|-------|--------|
| [DASHBOARD_ALLTAG.md](DASHBOARD_ALLTAG.md) | **Dashboard:** Link, `html/`, `PINS.json`, Sync zu ToDos |
| ARBEITSUEBERSICHT.md | **Mein Tag** + Kunden (voll, abhakbar) + Sonstiges |
| BACKLOG.md | **Vollliste** — alles; Pflege-Block + Build-Spiegel |
| PINS.json | Auswahl für Dashboard-**Übersicht** (nicht Ordner) |
| EINGANG.md | Parkplatz (leer nach Übernahme) |
| Kunden_Uebersicht.md | Ampeln & Termine (Überblick) |

HQ-Chat nutzt dieselben Dateien — kein separates Portfolio-Dokument.

**Terminal-Bot (Chat):** `.venv/bin/python -m bots.00_hq_assistant.hq_bot -i` — Kunde + nummerierte Liste → ToDos, EINGANG, Build.

---

## Strategie & Ziele (geparkt — nicht Tagesliste)

| Ort | Rolle |
|-----|--------|
| [`08_Vorlagen/Strategie/`](../08_Vorlagen/Strategie/STRATEGIE_PARK.md) | Vision, Roadmap, Taktik — **Kurzreferenz** |
| OneDrive `QM/Strategie/` | Word/PDF **Master** |
| Dashboard V3 | **Noch nicht gebaut** — Plan siehe oben |

## Rest von `hq/`

| Ordner | Rolle |
|--------|--------|
| `03_Kundenprojekte/` | Kundenakten |
| `07_DFSS/` | Pilot, Historical, Live-Messung Index |
| `04_` · `05_` · `06_` | Vertrieb, [Forderungen](../05_Forderungen/Finanz_Arbeitsgrundlage.md), Intern |
| `08_Vorlagen/Brand/` | Logo-Master |
| `09_Archiv/` | Nicht im Alltag |

`01_Notizblock/` und `html_dashboard/` — entfernt (alles in `00_Dashboard`).
