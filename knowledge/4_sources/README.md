# knowledge/4_sources/ — Praxis- und Fachquellen (kuratiert)

**Stand:** 2026-05-30  
**Zweck:** Ablageort für **destillierte** DGUV-, Behörden- und Praxisleitfaden-Inhalte — **keine** PDF-Ablage, **keine** Normabschrift.

---

## Abgrenzung zu bestehenden Layern

| Layer | Pfad | Inhalt | Bot geladen? |
|-------|------|--------|--------------|
| **Normative Überblicke** | `knowledge/2_regulations/` | ArbSchG, DGUV V1, VStättVO — strukturelle Prinzipien | Ja (Blueprint-selektiv) |
| **SDL Domäne** | `knowledge/3_sdls/` | Gefährdungen/Maßnahmen pro Dienst/Subtyp | Ja |
| **Praxisquellen (hier)** | `knowledge/4_sources/` | Extrakte aus DGUV-Infos, Behörden, Leitfäden | Ja, wenn im Blueprint referenziert |
| **Rohmaterial** | `inputs/` · `projects/_knowledge_raw/` | PDF/DOCX, Notizen, ungeprüft | **Nein** |
| **DIN CEKS** | `knowledge/1_standards/` | Norm-Module, Anforderungsprofile | Normkontext, nicht Volltext |

**Nummerierung:** `4_sources` füllt die Lücke zwischen `3_sdls` und `6_products` in der Repo-Struktur — bewusst **nicht** in `2_regulations` (dort nur Regelwerk-Überblicke).

---

## Unterordner

| Ordner | Quellentyp | Zielnutzung |
|--------|------------|-------------|
| [[dguv/README]] | DGUV Regeln, Informationen, Hinweise | GB/SK: Gefährdungsarten, Maßnahmenhierarchie, Crowd |
| [[behoerden/README]] | Ordnungsamt, Polizei, Feuerwehr, Versammlungsbehörde | SK/EK: Zuständigkeiten, Meldewege (ohne Landesdetail ohne Input) |
| [[praxisleitfaeden/README]] | Branchen-/Veranstalter-Leitfäden, interne Best Practice | Formulierung, Checklisten, typische Schnittstellen |

---

## Pipeline (keine blinde Ablage)

```text
inputs/raw_standards/  oder  inputs/practical_sources/
        │
        ▼  (Sichtung, Rechte, Relevanz)
projects/_knowledge_raw/{dguv|behoerden|praxis}/…
        │
        ▼  Extraktion nach Schema (s. EXTRACTION_SCHEMA.md)
knowledge/4_sources/{dguv|behoerden|praxisleitfaeden}/*.md
        │
        ▼  Verknüpfung
knowledge/3_sdls/…/subtypes/*.md  ·  knowledge/6_products/…
```

**Regel:** Ein PDF im `inputs/`-Ordner erzeugt **automatisch kein** Bot-Modul. Erst nach Extraktion und Freigabe unter `4_sources/`.

---

## Dateien in diesem Ordner

| Datei | Rolle |
|-------|--------|
| [[EXTRACTION_SCHEMA]] | Pflichtfelder je Extrakt (Gefährdungsarten, Maßnahmenmuster, …) |
| `dguv/`, `behoerden/`, `praxisleitfaeden/` | Thematische Registries + kuratierte Module |

---

## Verwandt

- `docs/KNOWLEDGE_CURATION_GUIDE.md` — Staging `_knowledge_raw`
- `knowledge/3_sdls/veranstaltungsschutz/AUSBAUPLAN.md` — Veranstaltungs-Ausbau inkl. Quellenbezug
