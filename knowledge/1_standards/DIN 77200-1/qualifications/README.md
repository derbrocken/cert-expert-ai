# Qualifikationssystem V2+ — DIN 77200-1 (CEKS)

**Pfad:** `knowledge/1_standards/DIN 77200-1/qualifications/`  
**Status:** **aktueller Arbeitsstand** (V2+) — Katalog, Matrix, Freigabe-Vorbereitung  
**Legacy V1:** [[../qualifikationssystem/README|qualifikationssystem/]] — **parallel, nicht migrieren**

---

## Ordnerentscheidung (kurz)

| | `qualifications/` (hier) | `qualifikationssystem/` (V1) |
|--|--------------------------|------------------------------|
| **Sprache Dateinamen** | Englisch (`*_v2.md`) | Deutsch (`01_`–`05_`) |
| **Neue CEKS-Arbeit** | **ja** | **nein** (nur Pflege 01–05) |
| **Matrix / Codes** | **ja** | Verweis nur |
| **Migration** | **verboten** ohne Architekturentscheidung | Ordner bleibt |

Dokumentation: [[../../Governance/DIN 77200/QUALIFICATION_V1_V2]]

**Alle V2-Dateien liegen ausschließlich in diesem Ordner** (keine V2-Kopien unter `qualifikationssystem/`).

---

## Dateien (V2 — vollständige Liste)

| Nr | Datei | Inhalt |
|----|-------|--------|
| 1 | [[01_qualification_system_v2]] | System, Typen, 77200-1 / 77200-2 |
| 2 | [[02_qualification_catalog_v2]] | Qualifikationscodes (GQ, PQ, SDL, Z772, WB, EW, FK) |
| 3 | [[03_matrix_release_hooks_v2]] | Personalfreigabe-Schema, SDL-Freigabe-Hooks |
| 4 | [[04_qualifikationsmatrix_logik]] | Profil → Codes — 77200-1 + 77200-2 Kap. 5–8 |
| 5 | [[05_personnel_release_v1]] | Personalfreigabe V1 — Schema, Prüfablauf, Status |
| 6 | [[06_sdl_release_v1]] | SDL-Freigabe V1 — dünne Zusatzschicht (gleiche Logik wie 05) |
| 7 | [[07_einsatz_release_v1]] | Einsatzfreigabe V1 — Schicht/Einsatz, letzte CEKS-Schicht |
| — | **README.md** | dieser Einstieg |

---

## Lesereihenfolge (Agenten)

1. [[01_qualification_system_v2]]  
2. [[02_qualification_catalog_v2]]  
3. [[04_qualifikationsmatrix_logik]] — bei SDL-/Profil-Freigabe  
4. [[05_personnel_release_v1]] — bei Freigabeentscheid Person + Verwendung  
5. [[06_sdl_release_v1]] — SDL-Dokumentationsfokus (optional, gleiche Entscheidung)  
6. [[07_einsatz_release_v1]] — vor konkretem Einsatz/Schicht  
7. [[03_matrix_release_hooks_v2]] — Tool-2-Felder, Kurz-Hooks (Datenmodell später)  
8. Bei Audit-Tiefe: [[../qualifikationssystem/05_sdl_freigabelogik]] (V1)

---

## Architekturregel

```
Anforderungsprofil → qualifications/ (V2) → Freigabeentscheid → Projektakte (Tool 2, später)
```

- **77200-2:** Zusatz nur über `Z772-*` im Katalog — kein zweites Qualifikationssystem in 77200-2  
- **Governance:** [[../../Governance/DIN 77200/AGENT_RULES]]

---

## Abgrenzung zu V1 (keine Dublette)

| Inhalt | V2 | V1 |
|--------|----|----|
| Qualifikationsmatrix alle SDL | **04** | — |
| Code-Katalog | **02** | — |
| Freigabe-Detailprosa DE | Verweis | **05** |
| Grundqualifikation Narrativ | Verweis | **01** |

V2 **ersetzt** V1 nicht — beide Ordner bleiben. Inhalte widersprechen sich nicht: V2 = operative Ableitung; V1 = vertiefende Bausteine.

---

## Geplant / offen

- [x] Personalfreigabe V1 CEKS — [[05_personnel_release_v1]]
- [ ] VA Kap. 7 V9 im Katalog  
- [ ] Tool 2 — **keine** Implementierung im Knowledge-Standard

---

## Verifikation

CEKS-Interpretation — Primärquelle `inputs/raw_standards/`, Modul [[../Qualifikationsanforderungen]].
