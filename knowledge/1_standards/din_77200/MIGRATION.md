# DIN 77200 — Inventar & Migrationsplan

Stand: Erstellung Zielstruktur · **noch keine Verschiebung ausgeführt**

---

## 1. Aktuell existierende Dateien (Inventar)

### A) `knowledge/1_standards/DIN 77200-1/` — Norm-Module & Vorlagen

| Datei / Ordner | Art | Anzahl |
|----------------|-----|--------|
| `overview.md` | Master-Index CEKS | 1 |
| `Anforderungsprofile.md` | Norm-Modul (Steuerlogik) | 1 |
| `Qualifikationsanforderungen.md` | Norm-Modul | 1 |
| `Weiterbildung.md` | Norm-Modul | 1 |
| `Dienstanweisungen.md` | Norm-Modul | 1 |
| `Auditnachweise.md` | Norm-Modul | 1 |
| `Erforderliche_Dokumente.md` | Norm-Modul | 1 |
| `Führungsanforderungen.md` | Norm-Modul | 1 |
| `anforderungsprofile/` | **Vorlagen** | 9 Dateien + README + `_master_77200-1` |
| `qualifikationssystem/` | **Logik-Baustein** | 6 Dateien (README + 01–05) |

**anforderungsprofile/ (77200-1-Ordner, Ist-Zustand):**

- `_master_77200-1.md`
- `alarmdienst.md`, `empfangsdienst.md`, `kontrolldienst_stationaer.md`, `kontrolldienst_mobil.md`
- `revierdienst.md`, `interventionsdienst.md`
- `fluechtlings_asylunterkuenfte.md` ⚠️ *fachlich 77200-2 / Anhang C — Fehlablage*

### B) `knowledge/1_standards/DIN 77200-2/` — Norm-Module & Vorlagen

| Datei / Ordner | Art |
|----------------|-----|
| `Übersicht.md` | Platzhalter-Modul |
| `allgemeine_anforderungen.md` | Platzhalter-Modul |
| `Veranstaltungen erhöhte Gefährdung.md` | Platzhalter-Modul (Kap. 5) |
| `ÖPNV.md` | Platzhalter-Modul (Kap. 6) |
| `objekte_besondere_sicherheitsrelevanz.md` | Platzhalter-Modul (Kap. 7) |
| `Flüchtlingsunterkünfte.md` | Platzhalter-Modul (Kap. 8) |
| `anforderungsprofile/` | **Vorlagen** — 6 SDL + README + `_master_77200-2` |

**anforderungsprofile/ (77200-2-Ordner):**

- `_master_77200-2.md`
- `veranstaltung_besondere_sicherheitsrelevanz.md`, `oepnv.md`
- `objekte_besonderer_sicherheitsrelevanz.md`, `fluechtlings_asylunterkuenfte.md`
- `veranstaltungssicherungsdienst.md` ⚠️ *fachlich 77200-1 / Anhang A Spalte 7 — Fehlablage*

### C) Dubletten / Altlasten (nicht löschen — in Migration auflösen)

| Pfad | Befund |
|------|--------|
| `knowledge/10_examples/anforderungsprofile/` | **14 Dateien** — veraltete Kopien der Vorlagen (Altnamen `77200-1_*`, `77200-2_*`) |
| `knowledge/standards/din_77200/` | In Index teils sichtbar — **auf Disk ggf. nicht vorhanden**; nicht neu anlegen außerhalb `1_standards` |

### D) Angrenzend (keine Standards — bleiben vorerst)

| Pfad | Rolle |
|------|-------|
| `knowledge/3_sdls/` | SDL-Fachwissen (21 README/base) |
| `knowledge/10_examples/` | Ausgefüllte GB, EC, SK, DI-Beispiele |
| `knowledge/11_examples/` | Parallele Beispielstruktur |
| `scripts/generate_anforderungsprofile.py` | Generator — Zielpfad nach Migration anpassen |

---

## 2. Klassifikation nach Geltungsbereich

### Normübergreifend (Teil 1 + Teil 2)

| Inhalt | Aktueller Ort | Ziel-Dokumenttyp |
|--------|---------------|------------------|
| Qualifikationssystem 01–05 | `DIN 77200-1/qualifikationssystem/` | `din_77200/qualifikationssystem/` |
| Anforderungsprofil-Konzept (Modul) | `Anforderungsprofile.md` | bleibt Modul → Verweis; Vorlagen → `anforderungsprofile/` |
| Qualifikationsanforderungen (A/B/C, §34a) | `Qualifikationsanforderungen.md` | `qualifikationssystem/` + Modul-Verweis |
| Weiterbildung / UE-Logik | `Weiterbildung.md` | `schulungen/` + Modul-Verweis |
| SDL-Freigabelogik | `qualifikationssystem/05_sdl_freigabelogik.md` | `personenfreigaben/` **oder** `qualifikationssystem/` |
| Dienstanweisungen (Normlogik) | `Dienstanweisungen.md` | `dienstanweisungen/` (Logik) + Modul |
| Erforderliche Dokumente (SK/EK/GB-Kette) | `Erforderliche_Dokumente.md` | Querverweis in SK/EK/GB-Ordner |
| Auditnachweise | `Auditnachweise.md` | übergreifend — Modul in `part_1/` oder Root `din_77200` Meta |

### Ausschließlich DIN 77200-1 (Teil 1)

| Inhalt | Aktueller Ort |
|--------|---------------|
| `overview.md` (Master CEKS 77200-1) | `DIN 77200-1/` |
| Anforderungsprofil-Vorlagen Anhang A (7 SDL) | `DIN 77200-1/anforderungsprofile/` (6 korrekt + 1 Fehlablage) |
| `_master_77200-1.md` | `DIN 77200-1/anforderungsprofile/` |
| Führungsanforderungen | `DIN 77200-1/Führungsanforderungen.md` |

### Ausschließlich DIN 77200-2 (Teil 2)

| Inhalt | Aktueller Ort |
|--------|---------------|
| `Übersicht.md`, `allgemeine_anforderungen.md` | `DIN 77200-2/` |
| Kap. 5–8 Platzhalter-Module | `DIN 77200-2/*.md` (4 SDL-Module) |
| Anforderungsprofil-Vorlagen Anhang C (4 SDL) | `DIN 77200-2/anforderungsprofile/` (4 korrekt + 1 Fehlablage) |
| `_master_77200-2.md` | `DIN 77200-2/anforderungsprofile/` |

### Noch nicht als Standard angelegt (Zielordner leer)

| Dokumenttyp | Quellen-Hinweis |
|-------------|-----------------|
| `schulungen/` | `Weiterbildung.md`, VA Kap. 7 V9 (noch nicht im Repo), 77200-2 Kap. 5–8 |
| `personenfreigaben/` | `05_sdl_freigabelogik.md`, Tool-1-Felder |
| `dienstanweisungen/` | `Dienstanweisungen.md`; VA Kap. 7 V6 in `inputs/practical_sources/` |
| `gefaehrdungsbeurteilungen/` | `Erforderliche_Dokumente.md`, `10_examples/gb_*` |
| `sicherheitskonzepte/` | `10_examples/sicherheitskonzepte/`, 77200-2 AG-Pflicht |
| `einsatzkonzepte/` | `10_examples/einsatzkonzepte/`, 77200-2 AN-Pflicht |
| `qualifikationsmatrizen/` | Konzept in `Qualifikationsanforderungen.md` — keine operative Liste |

---

## 3. Bekannte Dubletten (Auflösung in Migration)

| Dateiname | Vorkommen | Empfehlung |
|-----------|-----------|------------|
| `fluechtlings_asylunterkuenfte.md` | 77200-1 **und** 77200-2 `anforderungsprofile/` | **Eine** Datei unter `din_77200/anforderungsprofile/` (Anhang C.4) |
| `veranstaltungssicherungsdienst.md` | nur 77200-2 (falsch) | nach `din_77200/anforderungsprofile/` (Anhang A.7) |
| Anforderungsprofile gesamt | 77200-1 + 77200-2 + `10_examples/` | Zentral + Examples löschen/umbenennen zu Referenzprojekt |
| GB Kampfsport | `10_examples/` + `11_examples/` | Examples konsolidieren (separater Schritt) |

---

## 4. Empfohlener Migrationsplan (Phasen)

### Phase 0 — Erledigt

- [x] Zielstruktur `knowledge/1_standards/din_77200/` angelegt
- [x] README + MIGRATION dokumentiert
- [x] Keine automatische Verschiebung

### Phase 1 — Anforderungsprofile (deduplizieren)

1. Alle Vorlagen aus `DIN 77200-1/anforderungsprofile/` und `DIN 77200-2/anforderungsprofile/` nach `din_77200/anforderungsprofile/` **verschieben** (nicht kopieren)
2. Fehlablagen korrigieren (`fluechtlings_*` nur C.4; `veranstaltungssicherungsdienst` nur A.7)
3. `_master_77200-1.md` + `_master_77200-2.md` zentral; ein README
4. `10_examples/anforderungsprofile/` — prüfen: löschen oder in ausgefülltes Beispiel umwandeln
5. `generate_anforderungsprofile.py` → Ausgabe `din_77200/anforderungsprofile/`
6. Stub-Verweise in `DIN 77200-1/Anforderungsprofile.md` aktualisieren

### Phase 2 — Qualifikationssystem & Personenfreigaben

1. `DIN 77200-1/qualifikationssystem/*` → `din_77200/qualifikationssystem/`
2. `05_sdl_freigabelogik.md` → optional zusätzlich unter `personenfreigaben/` (Symlink oder Kurzverweis)
3. Module `Qualifikationsanforderungen.md` / `Weiterbildung.md` — Pfad-Updates, Inhalt bleibt als CEKS-Modul bis Phase 4

### Phase 3 — Weitere Dokumenttypen (Inhalte nachreichen)

1. `schulungen/` — aus `Weiterbildung.md` + VA V9 extrahieren
2. `dienstanweisungen/` — DI-Steuerlogik aus Modul; Vorlagen später
3. `gefaehrdungsbeurteilungen/`, `sicherheitskonzepte/`, `einsatzkonzepte/` — Standard-README + Platzhalter
4. `qualifikationsmatrizen/` — Matrix-**Logik** (keine Personalzeilen)

### Phase 4 — Norm-Module entkoppeln (optional, später)

- `DIN 77200-1/overview.md` → Verweis-Hub auf `din_77200/`
- Reine 77200-2-Platzhalter → `din_77200/part_2/` oder in SDL-Module in `3_sdls/`
- `part_1/` / `part_2/` nur wenn Datei **ausschließlich** einem Normteil dient und nicht dokumenttypübergreifend ist

### Phase 5 — Tool- & Agent-Anbindung

- Retrieval-Registry: Dokumenttyp-Slots für Tool 1 / Tool 2
- Keine zweite Ablage in `knowledge/standards/` (Root)

---

## 5. Entscheidungshilfe (Checkliste vor jeder Verschiebung)

```
[ ] Dokumenttyp eindeutig? (anforderungsprofil | qualifikation | schulung | …)
[ ] Gilt für 77200-1 UND 77200-2? → din_77200/<typ>/
[ ] Nur Teil 1? → part_1/ oder Normanker in YAML
[ ] Nur Teil 2? → part_2/ oder Normanker in YAML
[ ] Ist es ein ausgefülltes Projekt? → 10_examples/ (nicht hier)
[ ] Existiert bereits unter anderem Dokumenttyp? → deduplizieren, nicht kopieren
[ ] Links in overview, Generator, Modulen aktualisiert?
```

---

## 6. Offene Punkte

- [ ] VA Kap. 7 V9 Organisation Qualifikation einarbeiten → `schulungen/`, `qualifikationssystem/`
- [ ] Einheitliche YAML-Metadaten: `document_type`, `norm_part`, `annex_reference`
- [ ] Obsidian/Wikilinks nach Migration testen
- [ ] Klärung: bleiben CEKS-Module (`DIN 77200-1/*.md`) dauerhaft parallel als Audit-Module?
