# HQ — Dokumentations-Reset (Juni 2026)

**Ziel:** Saubere Basis **bevor** Strategie-/Ziele-Dashboard V3 gebaut wird.  
**Prinzip:** *Reset = Klarheit, nicht alles löschen.* Archive bleiben; Alltag bleibt schlank.

---

## Phase 1 — Inventar (erledigt / referenz)

| Kategorie | Ort | Aktion Reset |
|-----------|-----|--------------|
| Tagesarbeit | `ARBEITSUEBERSICHT`, `ToDos`, HTML V1 | **Behalten** — Source of Truth |
| Strategie gesetzt | OneDrive + `08_Vorlagen/Strategie/` | **Geparkt** — nur Kurzreferenz in Git |
| DFSS | `07_DFSS/` | **Behalten** — Indexe aktuell halten |
| Brand | `08_Vorlagen/Brand/` | **Behalten** |
| Alte Experimente | `09_Archiv/` | **Behalten** — nicht im Alltag verlinken |
| OneDrive DFFS | extern | **Master** — nicht nach Git verschieben |

---

## Phase 2 — Konsolidieren (du + Assistant)

- [ ] `START_HIER.md` + `HQ_LANDKARTE.md` als einziger Navigationseinstieg
- [ ] `WIE_NUTZEN.md` / `README.md` in `00_Dashboard/` — auf Landkarte verweisen, Dopplungen streichen
- [ ] `07_DFSS/DFSS_ARBEIT.md` — nur *aktive* Pilot-Notizen, Rest in Indexe
- [ ] `BACKLOG.md` Pflege-Block — veraltete Juni-Experimente nach Archiv oder streichen
- [ ] `EINGANG.md` — leer halten oder einmalig abarbeiten
- [ ] Kunden `Status.md` — Ampel/Blocker aktuell (kein Strategie-Text)

---

## Phase 3 — Festlegen was V3 zeigen soll (noch nicht bauen)

Aus [`STRATEGIE_PARK.md`](../08_Vorlagen/Strategie/STRATEGIE_PARK.md) und Roadmap:

| Widget (Vorschlag) | Quelle | Motivation |
|--------------------|--------|------------|
| Nordstern 2026 | strategie_manifest | Ein Satz oben |
| Roadmap-Phasen 1–9 | Roadmap 2026 | Fortschritt % (manuell oder Checkbox) |
| 7 taktische Ziele | PDF/Kurzref | Ampel pro Ziel |
| Zwei Stränge 2026 | Business Architecture | Production Engine vs Certification OS |
| DFSS-Gate (1 Zeile) | Synthesis | „controlled dev prep“ — nicht blockierend |
| Meilensteine gebaut | `HQ_LANDKARTE` § gebaut | Was schon da ist (Motivation) |

**Datenformat (geplant):** `00_Dashboard/strategie_dashboard.json` — manuell oder halbauto aus Manifest, **getrennt** von `dashboard_data.json`.

---

## Phase 4 — Build V3 (nach deinem Go)

Siehe [`DASHBOARD_PLAN_V3_STRATEGIE.md`](DASHBOARD_PLAN_V3_STRATEGIE.md).

---

## Abgrenzung Reset vs. Produkt

| Intern HQ | Certification OS (später) |
|-----------|----------------------------|
| Motivations-Dashboard, volle Strategie | Kunden-Dashboard (Audit, MA, Projekte) |
| Pins, persönlicher Fokus | Rollenbasierter Kundenportal |
| DFSS-Pilot-Metriken | Produkt-KPIs aus echtem Betrieb |
| Finanz intern | — |

---

## Sync-Regeln nach Reset

1. **Strategie ändern** → OneDrive Word → dann „Strategie-Park aktualisieren“ im Chat  
2. **Operativ ändern** → `ToDos.md` / Dashboard → `build_dashboard.py`  
3. **DFSS-Phase zu Ende** → Handoff-Docx nach `07_DFSS/` + Index  
4. **V3-Fortschritt** → nur `strategie_dashboard.json` (wenn angelegt)
