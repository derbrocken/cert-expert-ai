# Qualifikationssystem — Ordnerentscheidung V1 / V2

**Stand:** 2026-05-30  
**Status:** **stabil** — keine Migration ohne explizite Architekturentscheidung

---

## Ist-Zustand (zwei parallele Ordner)

| Ordner | Pfad | Rolle | Sprache Dateinamen |
|--------|------|-------|-------------------|
| **V1 (Legacy)** | `DIN 77200-1/qualifikationssystem/` | Bausteine 01–05, Audit-Tiefe, deutsche Modulstruktur | `01_grundqualifikationen.md` … |
| **V2+ (aktuell)** | `DIN 77200-1/qualifications/` | Katalog, Codes, Matrix, Freigabe-Hooks | `01_qualification_system_v2.md` … |

**Keine dritte Ablage** unter `din_77200/`, `knowledge/standards/` oder Governance für Fachinhalte.

---

## Entscheidung

1. **V2 ist der aktuelle Arbeitsstand** für Agenten, Matrixlogik, Katalog-Codes und Tool-Vorbereitung.
2. **V1 bleibt** als Referenz für ausführliche Bausteine (Grundqualifikation, Pflicht, WB, Freigabe-Detail auf Deutsch).
3. **Keine Dateiverschiebung** — V1-Dateien werden **nicht** nach `qualifications/` kopiert oder umbenannt.
4. **Keine Zusammenlegung** ohne Nutzer-Freigabe (Migration verworfen — [[MIGRATION]]).

---

## Agenten-Routing

| Frage | Zuerst | Ergänzend V1 |
|-------|--------|--------------|
| Profil → Codes → Freigabe | `qualifications/04_qualifikationsmatrix_logik.md` | `qualifikationssystem/05` |
| Qualifikationscode, Gültigkeit | `qualifications/02_qualification_catalog_v2.md` | `01`–`04` in V1 |
| Freigabeentscheid-Detailregeln | `qualifications/03` + `04` | `05_sdl_freigabelogik.md` |
| Normtiefe Stufen A/B/C | `Qualifikationsanforderungen.md` | `01_grundqualifikationen.md` |

**Verboten:** Neue V2-Inhalte unter `qualifikationssystem/` anlegen · V1-Inhalte nach `qualifications/` duplizieren ohne Entscheidung.

---

## Inhaltliche Beziehung (kein Widerspruch)

| Thema | V1 | V2 |
|-------|----|----|
| Stufen A/B/C | ja (01) | ja (Katalog GQ-*) |
| Pflichtqualifikationen | ja (02) | ja (Katalog PQ-*) |
| SDL-Zusätze / 77200-2 | ja (03) | ja (Katalog Z772-*, SDL-*) |
| Weiterbildung | ja (04) | ja (WB-*) |
| Freigabelogik | ja (05) | ja (03 Hooks + 04 Matrix) |
| Qualifikationsmatrix SDL | nein | ja (04) — **nur V2** |
| Personalfreigabe-Schema | teilw. in 05 | ja (03) — **V2 führt** |

V2 **strukturiert und codiert**; V1 **erklärt und vertieft**. Bei Abweichung: V2-Matrix/Katalog für operative Freigabe; V1/Primärquelle für Audit-Klärung.

---

## Prüfliste (Wartung)

- [x] Alle V2-Dateien nur unter `qualifications/` (5 Dateien + README)
- [x] `qualifikationssystem/` nur V1 (01–05 + README)
- [ ] Personalfreigabe V1-Dokument — geplant unter `qualifications/`, **nicht** in V1-Ordner duplizieren
- [ ] VA Kap. 7 V9 — Katalog/V1 abgleichen, wenn eingearbeitet

---

## Verknüpfungen

- V1: [[../../DIN 77200-1/qualifikationssystem/README]]
- V2: [[../../DIN 77200-1/qualifications/README]]
- Architektur: [[ARCHITECTURE]]
- Agenten: [[AGENT_RULES]]
