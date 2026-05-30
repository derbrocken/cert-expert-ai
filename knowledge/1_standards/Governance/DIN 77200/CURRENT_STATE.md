# DIN 77200 — Current State

**Stand:** 2026-05-30  
**Branch:** `cursor/din-77200-1-anforderungsprofile`  
**Letzte Commits:** `1040c25` Governance · `128353d` Anforderungsprofile

---

## Architekturentscheidung (stabil)

| Bereich | Pfad | Status |
|---------|------|--------|
| Fachinhalte 77200-1 | `knowledge/1_standards/DIN 77200-1/` | **aktiv** |
| Fachinhalte 77200-2 | `knowledge/1_standards/DIN 77200-2/` | **aktiv** |
| Governance | `knowledge/1_standards/Governance/DIN 77200/` | **aktiv** — nur Meta, kein Fachwissen |

**Verworfen:** Dokumenttyp-Zentralisierung unter `din_77200/<typ>/` und Pfad `knowledge/standards/` — siehe [[MIGRATION]].

---

## Implementiert

### CEKS-Module (77200-1)

| Modul | Datei | Status |
|-------|-------|--------|
| Master-Index | `overview.md` | aktiv |
| Anforderungsprofile | `Anforderungsprofile.md` | aktiv |
| Qualifikationsanforderungen | `Qualifikationsanforderungen.md` | aktiv |
| Dienstanweisungen | `Dienstanweisungen.md` | aktiv |
| Weiterbildung | `Weiterbildung.md` | aktiv |
| Erforderliche Dokumente | `Erforderliche_Dokumente.md` | aktiv |
| Auditnachweise | `Auditnachweise.md` | aktiv |
| Führungsanforderungen | `Führungsanforderungen.md` | aktiv |

### Qualifikationssystem V1 (77200-1, Legacy)

Pfad: `knowledge/1_standards/DIN 77200-1/qualifikationssystem/` — **parallel zu V2, nicht migrieren**

| Datei | Inhalt |
|-------|--------|
| `README.md` | V1/Legacy, Verweis V2 |
| `01_grundqualifikationen.md` | Stufen A/B/C |
| `02_pflichtqualifikationen.md` | Ersthelfer, Brandschutz, §34a, … |
| `03_sdl_zusatzqualifikationen.md` | SDL-spezifische Zusätze |
| `04_weiterbildungslogik.md` | 4.19.2-Logik |
| `05_sdl_freigabelogik.md` | Freigabeentscheid (Detail DE) |

### Qualifikationssystem V2+ (77200-1, aktuell)

Pfad: `knowledge/1_standards/DIN 77200-1/qualifications/` — siehe [[QUALIFICATION_V1_V2]]

| Datei | Inhalt |
|-------|--------|
| `README.md` | Einstieg V2+ |
| `01_qualification_system_v2.md` | Systemübersicht |
| `02_qualification_catalog_v2.md` | Qualifikationscodes |
| `03_matrix_release_hooks_v2.md` | Freigabe-Hooks, Personalfreigabe-Schema |
| `04_qualifikationsmatrix_logik.md` | Matrix 77200-1 + 77200-2 Kap. 5–8 |

### Anforderungsprofil-Vorlagen

**DIN 77200-1** — `anforderungsprofile/` (Anhang A, 9 Dateien):

- `77200-1_alarmdienst.md`
- `77200-1_stationaerer_empfangsdienst.md`
- `77200-1_stationaerer_kontrolldienst.md`
- `77200-1_revierdienst.md`
- `77200-1_interventionsdienst.md`
- `77200-1_mobiler_kontrolldienst.md`
- `77200-1_veranstaltungsdienst.md`
- `_master_77200-1.md`
- `README.md`

**DIN 77200-2** — `anforderungsprofile/` (Anhang C, 6 Dateien):

- `77200-2_veranstaltung_besondere_sicherheitsrelevanz.md`
- `77200-2_oepnv.md`
- `77200-2_gebaeude_besondere_sicherheitsrelevanz.md`
- `77200-2_fluechtlings_asylunterkuenfte.md`
- `_master_77200-2.md`
- `README.md`

Regenerierung: `python3 scripts/generate_anforderungsprofile.py` → schreibt in beide normzentrierten Ordner.

### CEKS-Module (77200-2)

| Modul | Datei | Status |
|-------|-------|--------|
| Übersicht | `Übersicht.md` | aktiv |
| Allgemeine Anforderungen | `allgemeine_anforderungen.md` | aktiv |
| Veranstaltungen | `Veranstaltungen erhöhte Gefährdung.md` | aktiv |
| ÖPNV | `ÖPNV.md` | aktiv |
| Objekte | `objekte_besondere_sicherheitsrelevanz.md` | aktiv |
| Flüchtlingsunterkünfte | `Flüchtlingsunterkünfte.md` | aktiv |

### Governance

Pfad: `knowledge/1_standards/Governance/DIN 77200/`

| Datei | Zweck |
|-------|-------|
| [[README]] | Einstieg |
| [[ARCHITECTURE]] | Schichtenmodell |
| [[AGENT_RULES]] | Agenten-/Tool-Regeln |
| [[ROADMAP]] | Geplante Erweiterungen |
| [[MIGRATION]] | Verworfene Strukturideen |
| **CURRENT_STATE.md** | Dieser Snapshot |

---

## Bereinigt (2026-05-30)

- [x] `knowledge/standards/` gelöscht (untracked Generator-Artefakt)
- [x] Dubletten in `anforderungsprofile/` → kanonische `77200-*`-Dateinamen
- [x] Fehlablagen: `fluechtlings_*` nur 77200-2; `veranstaltungssicherungsdienst` nur 77200-1
- [x] `knowledge/10_examples/anforderungsprofile/` entfernt
- [x] Leere Dokumenttyp-Ordner unter `din_77200/` entfernt
- [x] Generator-Pfade normzentriert
- [x] Governance nach `Governance/DIN 77200/` verschoben

---

## Offen (siehe [[ROADMAP]])

- [ ] VA Kap. 7 V9 Organisation Qualifikation einarbeiten
- [ ] Qualifikationsmatrizen-**Logik** (ohne Personalzeilen)
- [ ] 77200-2 Kap. 5–8 Module vertiefen
- [ ] Tool-1-Slots: Profil → Qualifikationssystem → Freigabe
- [ ] Einheitliche YAML: `document_type`, `norm_part`, `annex_reference`
- [ ] Profil-Prüfprotokoll-Vorlage (jährlich, 4.11)

---

## Schnellreferenz für Agenten

```
Profil-Vorlage 77200-1?  → knowledge/1_standards/DIN 77200-1/anforderungsprofile/77200-1_<sdl>.md
Profil-Vorlage 77200-2?  → knowledge/1_standards/DIN 77200-2/anforderungsprofile/77200-2_<sdl>.md
Qualifikationslogik V2+? → knowledge/1_standards/DIN 77200-1/qualifications/
Qualifikationslogik V1?  → knowledge/1_standards/DIN 77200-1/qualifikationssystem/
Normmodul / CEKS?        → knowledge/1_standards/DIN 77200-1/*.md oder DIN 77200-2/*.md
Governance / Meta?       → knowledge/1_standards/Governance/DIN 77200/
Ausgefülltes Projekt?    → 10_examples/
SDL-Kontext?             → 3_sdls/
```
