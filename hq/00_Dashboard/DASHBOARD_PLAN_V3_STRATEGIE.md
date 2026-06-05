# Dashboard Plan V3 — Strategie & Ziele (intern)

**Status:** **Plan only** — bauen erst nach Doku-Reset ([`DOC_RESET_2026-06.md`](DOC_RESET_2026-06.md))  
**Stand:** 2026-06-05  
**Zweck:** Motivation, Nordsterne, Fortschritt — **experimentell**, nicht Certification OS.

---

## Warum getrennt von V1?

| V1 (Operations) | V3 (Strategie) |
|-----------------|----------------|
| Was muss **heute** erledigt werden? | Wohin gehen wir **2026–2036**? |
| Kunden, Fristen, Pins | Roadmap-Phasen, taktische Ziele |
| Hohe Frequenz, täglich | Niedrige Frequenz, wöchentlich/monatlich |
| `dashboard_data.json` | `strategie_dashboard.json` (neu) |

**Ein Tab in derselben App** — nicht die Pin-Zone überladen.

---

## Zielbild (Mock)

```
┌────────────────────────────────────────────────────────────┐
│  Nordstern 2026                                            │
│  „Certification OS MVP produktiv — echte Kunden aktiv“     │
├────────────────────────────────────────────────────────────┤
│  Roadmap 2026          │  Taktische Ziele 2026–2028        │
│  Phase 1 ████░░ …      │  ○ MVP  ○ Durchsatz  ○ CEKS …     │
│  Phase 2 ██░░░░ …      │                                   │
├────────────────────────┴───────────────────────────────────┤
│  Zwei Stränge:  [Production Engine]  [Certification OS]   │
│  DFSS: controlled dev prep · Live O2C: 2 parallel          │
├────────────────────────────────────────────────────────────┤
│  Bereits gebaut (Motivation)                               │
│  ✓ Dashboard V1  ✓ Finanz-Hub  ✓ DFSS 4 Cases  ✓ Brand …   │
└────────────────────────────────────────────────────────────┘
```

---

## Datenquellen (read-only aus Park)

| Feld | Quelle |
|------|--------|
| Nordsterne | `08_Vorlagen/Strategie/strategie_manifest.json` |
| Phasen 1–9 | `STRATEGIE_PARK.md` § Roadmap |
| 7 taktische Ziele | `STRATEGIE_PARK.md` § Taktik |
| DFSS-Gate | `07_DFSS` Synthesis / `ONEDRIVE_STRATEGIE_INDEX` |
| „Bereits gebaut“ | `HQ_LANDKARTE.md` — manuell pflegbar |

**Fortschritt Phasen/Ziele:** Start mit **manuellen** Status (`not_started` / `in_progress` / `done`) in JSON — keine Schätzungen erfinden.

---

## Technik (wenn Go)

1. `hq/00_Dashboard/strategie_dashboard.json` — Schema v1  
2. `build_dashboard.py` — optional Merge in `/api/data` oder separater `/api/strategie`  
3. `index.html` — Sidebar: **Strategie** (neben Übersicht / Kosten)  
4. `app.js` — read-only zuerst; später Checkboxen für Phasen-Fortschritt  
5. **Kein** Schreiben in OneDrive — nur lokales JSON

---

## Nicht in V3

- Kunden-To-dos (bleiben V1)
- Voller DFSS-Word-Inhalt
- Master Plan Themenkatalog als 50 Checkboxen
- Harte KPI-Ziele / Umsatzprognosen (no invention rule aus DFSS)

---

## Entscheidungen (offen — dein Go)

| # | Frage | Vorschlag |
|---|--------|-----------|
| 1 | Eigener Tab „Strategie“? | Ja |
| 2 | Fortschritt manuell setzen? | Ja, zu Beginn |
| 3 | Roadmap als 9 Karten oder eine Timeline? | 9 kompakte Karten |
| 4 | Link zu OneDrive-Dateien? | Ja, `file://` oder Pfad-Hinweis |
| 5 | Obsidian-Spiegel? | Optional `STRATEGIE_FORTSCHRITT.md` auto aus JSON |

**Nächster Schritt:** Du bestätigst Plan → wir legen `strategie_dashboard.json` an (leere Fortschrittsfelder) → dann HTML.
