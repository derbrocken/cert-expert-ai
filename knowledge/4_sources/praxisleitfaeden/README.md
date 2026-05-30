# Praxisleitfäden — Extrakte

**Zweck:** Branchenleitfäden, Veranstalter-Handbücher, interne Cert-Expert-Best-Practice — destilliert für Bots.

Schema: [[../EXTRACTION_SCHEMA]]

---

## Registry (geplant)

| source_id | Thema | Status | Extrakt-Datei | Subtypen | Produkte |
|-----------|-------|--------|---------------|----------|----------|
| `praxis-sk-veranstaltung` | SK-Aufbau Veranstaltung (generisch) | geplant | `sk_veranstaltung_geruest.md` | alle | SK |
| `praxis-ek-staffelung` | EK Personalstaffelung (Prinzip) | geplant | `ek_staffelung_prinzip.md` | alle | EK |
| `praxis-kampfsport` | Verbands-/Ringpraxis (ohne Normzitat) | geplant | `kampfsport_praxis.md` | kampfsport | GB, EK |
| `praxis-va-din77200` | VA-Erstellung (Kap. 7 Stil) | Roh in `inputs/practical_sources/` | `va_erstellung_hinweise.md` | — | ODA |

**Hinweis:** `inputs/practical_sources/DIN77200-2_10_Kap. 7…docx` ist **Best Practice**, keine Norm — Extrakt nach Schema, nicht 1:1.

---

## Rohmaterial-Ablage

| Stufe | Pfad |
|-------|------|
| Eingang | `inputs/practical_sources/` |
| Staging | `projects/_knowledge_raw/praxisleitfaeden/` oder thematisch unter `_knowledge_raw/sdls/veranstaltungsschutz/` |
| Kuratiert | `knowledge/4_sources/praxisleitfaeden/*.md` |

---

## Verknüpfung SDL

Extrakte werden in Subtyp-MDs **referenziert** (Wiki-Link), nicht kopiert:

```markdown
## Praxisbezug
Siehe [[../../4_sources/praxisleitfaeden/sk_veranstaltung_geruest]] — nur Maßnahmenmuster, keine Zahlen ohne Input.
```
