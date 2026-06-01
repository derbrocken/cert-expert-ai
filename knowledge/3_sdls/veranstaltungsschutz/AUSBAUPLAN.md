# Ausbauplan — Veranstaltungs-Knowledge (vor SK/GB/EK/ODA-Bots)

**Stand:** 2026-05-30  
**Scope:** Knowledge only — **kein** GB-Blueprint, **kein** SK-Bot, **keine** Migration, **keine** Tool-Implementierung

---

## Zielbild

Die Knowledge-Basis für Veranstaltungen soll **vollständig genug** sein, damit SK → GB → EK → ODA-Bots später **selektiv** laden können, ohne Genre mit Kap.-5-Einstufung zu verwechseln.

| Schicht | Inhalt | Status |
|---------|--------|--------|
| 1 | `base.md` | vorhanden |
| 2 | `subtypes/*.md` | 4/16 (`kampfsport`; `fussball`, `konzert`, `grossveranstaltung` — Entwurf) |
| 3 | `veranstaltung_besondere_sicherheitsrelevanz/base.md` | vorhanden (orthogonal) |
| 4 | `6_products/{gb,sk,ek,oda}/` | GB teilweise; SK/EK/ODA fehlen |
| Quellen | `4_sources/` Extrakte | Struktur angelegt, Inhalte backlog |

---

## Deliverables (diese Aufgabe)

| Artefakt | Pfad | Status |
|----------|------|--------|
| Veranstaltungstypen-Katalog | [[VERANSTALTUNGSTYPEN_KATALOG]] | erstellt |
| Gap-Matrix je Typ | [[SUBTYPE_GAP_MATRIX]] | erstellt |
| Quellenstruktur | [[../../4_sources/README]] | erstellt |
| Extraktionsschema | [[../../4_sources/EXTRACTION_SCHEMA]] | erstellt |
| DGUV/Behörden/Praxis-Registry | `4_sources/*/README.md` | erstellt |

---

## Phasenplan

### Phase A — SDL Subtypen (P0)

| # | Aufgabe | Output | Abnehmer |
|---|---------|--------|----------|
| A1 | Review `kampfsport.md` gegen Gap-Matrix | aktualisiertes Subtyp-MD | GB (bestehend) |
| A2 | Neu: `fussball.md`, `konzert.md`, `grossveranstaltung.md` | je ~600 Tokens | GB, SK |
| A3 | Schnittstellen-Abschnitt in `base.md` erweitern (Sanität, Polizei, …) | base.md Delta | SK, EK |

**Status A2:** Entwürfe erstellt (2026-05-30) — Review gegen Gap-Matrix noch offen.

**Exit-Kriterium Phase A:** Drei neue Subtypen `reviewed`; Katalog-Status auf „ausgearbeitet“.

### Phase B — Produktwissen SK/EK (vor Bot)

| # | Aufgabe | Output |
|---|---------|--------|
| B1 | `6_products/sicherheitskonzept/purpose.md` + `content_blocks.md` | SK-Gerüst |
| B2 | `6_products/einsatzkonzept/purpose.md` + `content_blocks.md` | EK-Gerüst |
| B3 | Kette SK→GB→EK in `6_products/README.md` präzisieren | Docs |

**Exit-Kriterium:** SK/EC-Module referenzierbar in Gap-Matrix als „vorhanden“.

### Phase C — Praxisquellen extrahieren

| # | Quelle (Staging) | Extrakt-Ziel | Priorität |
|---|------------------|--------------|-----------|
| C1 | DGUV Crowd/Veranstaltung | `4_sources/dguv/crowd_veranstaltung.md` | P0 |
| C2 | Behörde Großevent | `4_sources/behoerden/grossevent_abstimmung.md` | P1 |
| C3 | Praxis SK-Veranstaltung | `4_sources/praxisleitfaeden/sk_veranstaltung_geruest.md` | P0 |
| C4 | VA Kap. 7 DOCX → Extrakt | `4_sources/praxisleitfaeden/va_erstellung_hinweise.md` | P2 (ODA) |

**Workflow:** `inputs/` → `_knowledge_raw` → [[../../4_sources/EXTRACTION_SCHEMA]] → Review → `released`

### Phase D — Kap. 5 (optional, getrennt)

| # | Aufgabe | Hinweis |
|---|---------|---------|
| D1 | Blueprint **nicht** in dieser Phase ändern | Nutzer-Vorgabe |
| D2 | Input-Felder in Doku festhalten (`ag_einstufung`, `profil_ref`) | `veranstaltung_besondere_sicherheitsrelevanz/base.md` Folgearbeit |

---

## Bot-Ladereihenfolge (Zielzustand, unverändert)

```yaml
# Kampfsport, 77200-1 — Schicht 1+2 (+ Produkt 4)
sdls:
  - veranstaltungsschutz/base.md
  - veranstaltungsschutz/subtypes/kampfsport.md
practice_sources: []   # optional nach Phase C

# Kampfsport + Kap.-5-Einstufung — + Schicht 3
sdls:
  - veranstaltungsschutz/base.md
  - veranstaltungsschutz/subtypes/kampfsport.md
  - veranstaltung_besondere_sicherheitsrelevanz/base.md
```

---

## Abhängigkeiten zu anderen Reports

| Report | Bezug |
|--------|-------|
| `docs/BOT_KNOWLEDGE_GAP_REPORT.md` | Dokumentenkette SK/GB/EK/ODA |
| `knowledge/3_sdls/README.md` | Layer-Logik Typ vs. Kap. 5 |
| `docs/KNOWLEDGE_CURATION_GUIDE.md` | `_knowledge_raw` Staging |

---

## Nicht im Scope

- `knowledge/7_blueprint/gb_event_kampfsport.json` ändern
- SK-/EK-/ODA-Blueprints anlegen
- Portal, Tool 2, Qualifikationsfreigabe erweitern
- Kombi-Ordner `kampfsport_besonders/`

---

## Nächster konkreter Schritt (empfohlen)

1. `subtypes/fussball.md` als P0-Entwurf (nach `kampfsport.md`-Vorlage)  
2. Parallel: `4_sources/dguv/crowd_veranstaltung.md` als **draft** aus erster DGUV-Quelle in `inputs/`  
3. `6_products/sicherheitskonzept/purpose.md` — SK-Gerüst (Phase B1)
