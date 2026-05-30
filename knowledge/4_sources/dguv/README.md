# DGUV — Praxisquellen (Extrakte)

**Normative Überblicke (Regelwerk):** [[../../2_regulations/dguv_v1/overview]] — bleibt in `2_regulations/`.  
**Hier:** DGUV **Informationen**, Hinweise, branchenübliche Präventionsinhalte — **extrahiert** nach [[../EXTRACTION_SCHEMA]].

---

## Registry (geplant)

| source_id | Thema | Status | Extrakt-Datei | Subtypen | Produkte |
|-----------|-------|--------|---------------|----------|----------|
| `dguv-v1-praevention` | TOP, Maßnahmenhierarchie | **in 2_regulations** | `dguv_v1/overview.md` | alle | GB, SK |
| `dguv-info-crowd` | Personenansammlungen / Veranstaltung | geplant | `crowd_veranstaltung.md` | konzert, festival, grossveranstaltung | GB, SK |
| `dguv-info-einsatz` | Einsatz-/Arbeitsbelastung Sicherheitskräfte | geplant | `einsatz_belastung.md` | alle Events | GB, EK |
| — | weitere nach Sichtung `inputs/` | backlog | — | — | — |

---

## Rohmaterial-Ablage

| Stufe | Pfad |
|-------|------|
| Eingang | `inputs/raw_standards/` (PDF, falls vorhanden) |
| Staging | `projects/_knowledge_raw/dguv/` (Ordner anlegen bei erster Quelle) |
| Kuratiert | `knowledge/4_sources/dguv/*.md` |

**Nächster Schritt (manuell):** Sichtung vorhandener DGUV-PDFs in `inputs/` → Priorität `dguv-info-crowd` für P0-Subtypen `konzert`, `grossveranstaltung`.

---

## Bot-Referenz (perspektivisch)

```yaml
context_modules:
  practice_sources:
    - 4_sources/dguv/crowd_veranstaltung.md   # nur wenn reviewed + released
```

Noch **kein** Blueprint angepasst — siehe [[../../3_sdls/veranstaltungsschutz/AUSBAUPLAN]].
