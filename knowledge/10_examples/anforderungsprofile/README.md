# Anforderungsprofile — Cert-Expert Vorlagen

Strukturierte **Formularvorlagen** für auftragsspezifische Anforderungsprofile nach DIN 77200-1 (4.11, Anhang A) und DIN 77200-2 (Anhang C).

**Schicht:** Cert-Expert Best Practice (B) — **keine** Normersetzung.

**Modul:** [[Anforderungsprofile]] (`knowledge/1_standards/DIN 77200-1/Anforderungsprofile.md`)

---

## Regeln

- **Kein echter Kundeninhalt** — Platzhalter `[OFFENER PUNKT]`, fiktive Metadaten.
- **Stufen A/B/C** immer aus **Primärquelle** Tabelle A.1 / Anhang C übernehmen — Vorlagen raten nicht.
- **Profil-first** — Tätigkeiten vor SDL-Label; ☑-Vorschläge sind Orientierung, mit AG abstimmen.
- **77200-2:** SK+EK Pflicht; Anhang-C-Block aus Norm-PDF ergänzen.

---

## Dateien

| Datei | Inhalt |
|-------|--------|
| `_master_77200-1.md` | Index + Tätigkeitsliste Nr. 1–21 |
| `_master_77200-2.md` | Index Kap. 5–8 + Anhang C |
| `77200-1_<sdl>.md` | Vorlage je Norm-SDL (7 Dateien) |
| `77200-2_<sdl>.md` | Vorlage je 77200-2-Anwendungsgruppe (4 Dateien) |

---

## Namenskonvention

```
77200-{1|2}_{sdl_slug}.md
```

`sdl_slug` entspricht `knowledge/3_sdls/<slug>/` wo vorhanden.

---

## Primärquellen

- DIN 77200-1: `inputs/raw_standards/DIN/DIN 77200-1.docx` / `DIN_77200-1_202211.PDF`
- DIN 77200-2: `inputs/raw_standards/DIN/Beuth-Verlag Teil 2DIN 77200-22020-07.pdf`
