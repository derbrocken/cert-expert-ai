# DGUV — Praxisquellen (Extrakte)

**Normative Überblicke (Regelwerk):** [[../../2_regulations/dguv_v1/overview]] — bleibt in `2_regulations/`.  
**Hier:** DGUV **Informationen**, Hinweise, branchenübliche Präventionsinhalte — **extrahiert** nach [[../EXTRACTION_SCHEMA]].

---

## Registry (geplant)

| source_id | Thema | Status | Extrakt-Datei | Subtypen | Produkte |
|-----------|-------|--------|---------------|----------|----------|
| `dguv-v1-praevention` | TOP, Maßnahmenhierarchie | **in 2_regulations** | `dguv_v1/overview.md` | alle | GB, SK |
| `dguv-info-crowd` | Personenansammlungen / Veranstaltung | **draft** | [[crowd_veranstaltung]] | konzert, festival, grossveranstaltung, fussball | GB, SK |
| `dguv-info-einsatz` | Einsatz-/Arbeitsbelastung Sicherheitskräfte | geplant | `einsatz_belastung.md` | alle Events | GB, EK |
| — | weitere nach Sichtung `inputs/` | backlog | — | — | — |

---

## Rohmaterial-Ablage

| Stufe | Pfad |
|-------|------|
| Eingang | `inputs/raw_standards/` (PDF, falls vorhanden) |
| Staging | `projects/_knowledge_raw/dguv/` (Ordner anlegen bei erster Quelle) |
| Kuratiert | `knowledge/4_sources/dguv/*.md` |

**Nächster Schritt:** DGUV-Info-PDF(s) in `inputs/raw_standards/dguv/` ablegen → Extrakt auf `reviewed`/`released` heben. Siehe Wunschliste unten.

### PDF-Wunschliste (Priorität)

| Prio | Thema | Typische DGUV-Bezeichnung | Nutzen für |
|------|--------|----------------------------|------------|
| **P0** | Personenansammlungen / Veranstaltungen / Events | DGUV Information (Crowd, Veranstaltungssicherheit) | `crowd_veranstaltung.md` verifizieren |
| **P1** | Einsatzbelastung / psychische Belastung SD | DGUV Information Arbeitsschutz SD | `einsatz_belastung.md` (geplant) |
| **P2** | Einweisung / Unterweisung | DGUV Information Unterweisung | ODA / EW |
| — | Bereits in `inputs/`: DIN 77200, LAF Berlin, Arbeitsschutz.pdf | — | CEKS / Norm, nicht Crowd-Extrakt |

Ohne P0-PDF bleibt `crowd_veranstaltung.md` bewusst **`draft`** — Bot-Blueprints laden es noch nicht.

---

## Bot-Referenz (perspektivisch)

```yaml
context_modules:
  practice_sources:
    - 4_sources/dguv/crowd_veranstaltung.md   # nur wenn reviewed + released
```

Noch **kein** Blueprint angepasst — siehe [[../../3_sdls/veranstaltungsschutz/AUSBAUPLAN]].
