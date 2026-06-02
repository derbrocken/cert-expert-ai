# Behörden — Praxisquellen (Extrakte)

**Zweck:** Strukturiertes Wissen zu **Zuständigkeiten, Meldewegen, typischen Anforderungen** von Ordnungsamt, Polizei, Feuerwehr, Versammlungsbehörde — **ohne** landesspezifische Detailvorgaben ohne Input.

Schema: [[../EXTRACTION_SCHEMA]]

---

## Registry (geplant)

| source_id | Thema | Status | Extrakt-Datei | Subtypen | Produkte |
|-----------|-------|--------|---------------|----------|----------|
| `behoerde-versammlung` | Versammlungen / Demonstrationen | geplant | `versammlungsrecht_praxis.md` | demonstration, politisch | SK, EK |
| `behoerde-grossevent` | Großveranstaltung, Behördenabstimmung | **reviewed** | [[grossevent_abstimmung]] | grossveranstaltung, festival, demonstration, fussball | SK, EK |
| `behoerde-brand` | Brandschutz / Feuerwehr Schnittstelle | geplant | `brandschutz_schnittstelle.md` | messe, stadtfest, weihnachtsmarkt | SK, GB |
| `behoerde-vstaettvo` | Versammlungsstätte (Praxis, nicht Volltext) | geplant | `vstaettvo_praxis.md` | konzert, indoor | SK, GB |

**Verknüpfung Norm-Überblick:** [[../../2_regulations/VStättVO/overview]] — keine Dublette; `4_sources` ergänzt **operative** Abstimmungslogik.

---

## Rohmaterial-Ablage

| Stufe | Pfad |
|-------|------|
| Eingang | `inputs/practical_sources/`, Behörden-PDFs |
| Staging | `projects/_knowledge_raw/behoerden/` |
| Kuratiert | `knowledge/4_sources/behoerden/*.md` |

---

## Nicht-erfinden (Behörden)

- Keine konkreten Fristen, Personenmindestzahlen oder Paragrafen ohne Input
- Keine Behördenentscheidung als erledigt darstellen
- Landesrecht nur erwähnen, wenn `bundesland` im Projekt-Input
