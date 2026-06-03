# DGUV — Praxisquellen (Extrakte)

**Normative Überblicke (Regelwerk):** [[../../2_regulations/dguv_v1/overview]] — bleibt in `2_regulations/`.  
**Hier:** DGUV **Informationen**, Hinweise, branchenübliche Präventionsinhalte — **extrahiert** nach [[../EXTRACTION_SCHEMA]].

**Roh-PDFs:** `inputs/raw_standards/dguv/README.md` (Inventar der vier hochgeladenen Dateien).

---

## Registry

| source_id | Thema | Status | Extrakt-Datei | Subtypen | Produkte |
|-----------|-------|--------|---------------|----------|----------|
| `dguv-v1-praevention` | TOP, Maßnahmenhierarchie | **in 2_regulations** | `dguv_v1/overview.md` | alle | GB, SK |
| `dguv-info-215-310` | Veranstaltungsorganisation, Rollen, Planung | **reviewed** | [[veranstaltungen_organisation]] | konzert, festival, grossveranstaltung, fussball, kampfsport | SK, EK, GB |
| `dguv-info-crowd` | Crowd, SK-Kriterien, Gewalt, Fluchtwege | **reviewed** | [[crowd_veranstaltung]] | wie oben | GB, SK, EK |
| `dguv-info-211-005` | Unterweisung | **reviewed** | [[unterweisung_veranstaltung]] | alle Events | ODA, GB, EK |
| `dguv-info-einsatz` | Einsatz-/Arbeitsbelastung Sicherheitskräfte | geplant | `einsatz_belastung.md` | alle Events | GB, EK |
| — | `115-001` Geldtransport | **out of scope** | — | — | — |

**Primärquelle P0:** DGUV Information **215-310** (Mai 2025), 64 S. — `inputs/raw_standards/dguv/215-310.pdf`.

---

## Rohmaterial-Ablage

| Stufe | Pfad |
|-------|------|
| Eingang | `inputs/raw_standards/dguv/` |
| Staging | `projects/_knowledge_raw/dguv/` (optional) |
| Kuratiert | `knowledge/4_sources/dguv/*.md` |

---

## Bot-Referenz (perspektivisch)

```yaml
context_modules:
  practice_sources:
    - 4_sources/dguv/crowd_veranstaltung.md
    - 4_sources/dguv/veranstaltungen_organisation.md
    # unterweisung_veranstaltung.md → ODA-Blueprint
```

Noch **kein** GB-Blueprint angepasst — Freigabe `released` + Token-Budget vor Eintrag in `7_blueprint/`. Siehe [[../../3_sdls/veranstaltungsschutz/AUSBAUPLAN]].
