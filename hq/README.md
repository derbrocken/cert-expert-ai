# Cert-Expert HQ — Unternehmensgedächtnis

**Stand:** 2026-06-05 (Doku-Reset)

**Einstieg:** [`00_Dashboard/START_HIER.md`](00_Dashboard/START_HIER.md) · **Landkarte:** [`00_Dashboard/HQ_LANDKARTE.md`](00_Dashboard/HQ_LANDKARTE.md)

---

## Im Alltag sichtbar

| Ordner | Zweck |
|--------|--------|
| `00_Dashboard/` | Operations (V1 HTML), Arbeitsübersicht, Backlog — **V3 Strategie geplant** |
| `03_Kundenprojekte/` | Kundenakten (ToDos, Status, Audit, …) |
| `04_Vertrieb/` · `05_Forderungen/` · `06_Software/` | Querschnitt-Aufgaben |
| `08_Vorlagen/` | Templates (nicht täglich) · **Brand:** [`08_Vorlagen/Brand/`](08_Vorlagen/Brand/README.md) · **Strategie-Park:** [`08_Vorlagen/Strategie/`](08_Vorlagen/Strategie/README.md) |

## Selten / Archiv / Parallel

| Ordner | Zweck |
|--------|--------|
| `07_DFSS/` | Pilot (nicht Tagesliste) |
| `09_Archiv/` | Alte Dashboards, Juni-Dump, Operations-Board-Import |

`02_Operations_Board/` — **entfernt** → `09_Archiv/2026-06-quellen-import/Operations_Board_Struktur/` (leere Views/Rollups/Templates).

---

## Morgens

```bash
python3 hq/scripts/build_dashboard.py
```

Obsidian: [`00_Dashboard/ARBEITSUEBERSICHT.md`](00_Dashboard/ARBEITSUEBERSICHT.md)

HQ-Chat: [`bots/00_hq_assistant/`](../bots/00_hq_assistant/README.md)
