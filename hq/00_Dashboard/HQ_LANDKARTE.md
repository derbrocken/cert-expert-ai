# HQ — Landkarte (nach Reset 2026-06)

**Zweck:** Eine Seite — **was liegt wo**, **was ist Alltag**, **was ist geparkt**, **was kommt ins Strategie-Dashboard**.

> **Regel:** Operations-Dashboard (V1) bleibt für **Tun**. Strategie-Dashboard (V3, geplant) für **Richtung & Motivation**. Nicht vermischen.

---

## Drei Ebenen

```
┌─────────────────────────────────────────────────────────────┐
│  EBENE A — OPERATIONS (heute, täglich)                      │
│  Mein Tag · Kunden · Fristen · Finanzen · Live-Messung      │
│  → 00_Dashboard/ + 03_Kundenprojekte/                       │
├─────────────────────────────────────────────────────────────┤
│  EBENE B — STRATEGIE & ZIELE (geparkt, motivierend)         │
│  Vision · Roadmap · Taktik · Business Architecture          │
│  → 08_Vorlagen/Strategie/ + OneDrive QM/Strategie/         │
│  → später: Dashboard V3 (nur intern, nicht Kunden-Software) │
├─────────────────────────────────────────────────────────────┤
│  EBENE C — DFSS / ENTWICKLUNG (parallel, Messung & Design) │
│  Pilot · Historical · Synthesis · Live O2C                  │
│  → 07_DFSS/ + OneDrive QM/Strategie/DFFS/                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Ebene A — Operations (bleibt wie jetzt)

| Was | Wo | Dashboard V1 |
|-----|-----|----------------|
| Offene Aufgaben | `ARBEITSUEBERSICHT.md`, `ToDos.md` | Übersicht + Auswahl |
| Kunden-Ampeln | `Kunden_Uebersicht.md`, `Status.md` | Auswahl (Projekt-Folds) |
| Pins | `PINS.json` | Übersicht oben |
| Finanzen | `05_Forderungen/*.json` | Cert Expert Kosten |
| Live-Messung O2C | `live_messung.json` (2 Kunden) | Dezentes Panel unter Projekt |
| Vollliste | `BACKLOG.md` | Auswahl / Spiegel |

**Nicht in V1:** Roadmap-Phasen, Vision 2036, DFSS-Gates als Tagesblocker.

---

## Ebene B — Strategie (geparkt, gesetzt)

| Was | OneDrive Master | Git-Park |
|-----|-----------------|----------|
| Vision, Mission, Leitbild, Philosophie | `QM/Strategie/*.docx` | [`STRATEGIE_PARK.md`](../08_Vorlagen/Strategie/STRATEGIE_PARK.md) |
| Business Architecture, Roadmap, Taktik | ↑ + PDF Taktik | [`strategie_manifest.json`](../08_Vorlagen/Strategie/strategie_manifest.json) |
| Master Plan (Themenkatalog) | `CERT_EXPERT_MASTER_PLAN.docx` | Park — **keine** To-dos daraus |

**Brand:** [`08_Vorlagen/Brand/`](../08_Vorlagen/Brand/README.md)

---

## Ebene C — DFSS & Entwicklung

| Spur | Git | Status |
|------|-----|--------|
| Live NC / Audit | P05 SecuGuard, Kunden-To-dos | aktiv |
| Live O2C parallel | P-LIVE-SR-01, P-LIVE-CR-01 | messen, nicht blockieren |
| Historical | P-HIST-01/02, P-HIST-SC-01 | archiviert |
| Cross-Case Synthesis | `07_DFSS/*SYNTHESIS*` | controlled dev prep |
| DMADV-Artefakte | OneDrive `DFFS/` | ChatGPT-Projekt-Phase |

Index: [`07_DFSS/README.md`](../07_DFSS/README.md)

---

## Was wir gebaut haben (Stand Reset)

| Bereich | Erreicht | Nicht ins Produkt später |
|---------|----------|---------------------------|
| HTML-Dashboard V1 | Pins, Auswahl, Abhaken, Fristen, Finanzen-Hub | Gesamtes Pin-Modell |
| HQ-Assistent | To-dos, Briefings, Build | — |
| Kundenstruktur | 7 Akten, Registry, Evidence-Register (Rollout) | — |
| DFSS-Pilot | 4 Cross-Cases + 2 Live-O2C + Synthesis | Word-Template-Füllung als Prozess |
| Strategie-Park | 8 Dokumente gelesen + indexiert | Word-Master in Git |
| Brand | Logo-Master + Dashboard-Ableitung | — |
| Archiv | `09_Archiv/` alte Experimente | — |

---

## Was **nicht** in Kunden-Software (Certification OS) wandert

- Pin-Zone / persönliches „Mein Tag“
- Internes Strategie-Motivations-Dashboard
- Voller BACKLOG-Spiegel
- DFSS-Messfelder (interne Pilot-Metriken)
- Finanz-Arbeitsgrundlage (intern)

**Wandert später (aus Strategie):** Nordsterne, Roadmap-Phasen als **Produkt-Roadmap** — separat modelliert, nicht 1:1 HQ-HTML.

---

## Nächste Schritte (Reihenfolge)

1. **Doku-Reset** — [`DOC_RESET_2026-06.md`](DOC_RESET_2026-06.md) abarbeiten  
2. **Dashboard V3 Plan** — [`DASHBOARD_PLAN_V3_STRATEGIE.md`](DASHBOARD_PLAN_V3_STRATEGIE.md) bestätigen  
3. **Erst dann** HTML bauen (neuer Sidebar-Tab oder eigene Seite)
