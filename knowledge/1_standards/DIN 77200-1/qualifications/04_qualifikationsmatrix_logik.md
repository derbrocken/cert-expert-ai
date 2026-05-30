# Qualifikationsmatrix — Ableitungslogik (V2)

Einstieg: [[README]] · Katalog: [[02_qualification_catalog_v2]] · Hooks: [[03_matrix_release_hooks_v2]] · Profile: [[../anforderungsprofile/77200-1_revierdienst]], [[../anforderungsprofile/77200-1_interventionsdienst]], [[../../DIN 77200-2/anforderungsprofile/77200-2_oepnv]]

**Status:** CEKS-Referenzlogik für **Revierdienst** (77200-1) und **ÖPNV** (77200-2) — **keine** Personalzeilen, **keine** Normabschrift.

---

## Zweck

Die Matrix beantwortet pro **aktivierter Profil-Zeile** (`Erbringen = Ja`):

```
Profil-Zeile → codes_erforderlich (+ codes_z772 bei 77200-2)
             → Freigabe-Prüfung je Code (später Tool 2)
             → Personalfreigabe / SDL-Freigabe (Konjunktion aller aktiven Zeilen)
```

**Agent:** Codes aus diesem Dokument und dem Katalog **ableiten** — nicht pro Person hardcodieren.

---

## Ableitungsalgorithmus (allgemein)

### Schritt 1 — Profil-Zeile lesen

| Feld im Profil | Matrix-Feld |
|--------------|-------------|
| Nr + Tätigkeitstext | `profil_ref`, `taetigkeit_kurz` |
| Stufe A/B/C | `stufe_gefordert` |
| AG-Erhöhung ☐ | `ag_erhoehung` — wenn Ja: **Mindeststufe** mindestens eine Stufe **über** Profilfeld (AG/AN dokumentieren) |
| Erbringen ☐ | nur Zeilen mit **Ja** in die Freigabe einbeziehen |

### Schritt 2 — Grundqualifikation (GQ) aus Stufe

| `stufe_gefordert` | `codes_erforderlich` (GQ — eine passende Variante reicht) | `freigabe_kritisch` |
|-------------------|-----------------------------------------------------------|---------------------|
| **A** | `GQ-A-34A-S` **oder** `GQ-A-34A-T` **oder** `GQ-A-34A-U` (nur wenn Profil/AG das zulässt) | ja |
| **B** | `GQ-B-GSSK` **oder** `GQ-B-3J` **oder** `GQ-B-SVC` **oder** `GQ-B-WSF` | ja |
| **C** | `GQ-C-MS` **oder** `GQ-C-FSSK` **oder** `GQ-C-GW` (+ schriftliche Gleichwertigkeit bei GW) | ja |

**Regel:** Personalnachweis muss **mindestens** die geforderte Stufe abdecken. Profil B + Nachweis nur A → **nicht freigegeben** für diese Zeile.

### Schritt 3 — Pflichtqualifikationen (PQ) — SDL-/Vertragsbaseline

Unabhängig von der Einzelzeile — für **Einsatzkraft** am Objekt/auf dem Auftrag typisch:

| Code | Wann | `freigabe_kritisch` |
|------|------|---------------------|
| `PQ-EH` | Ersthelfer vorgesehen (Standard Einsatz) | ja |
| `PQ-DGUV` | organisationsintern Pflicht | ja |
| `PQ-DS` | vor Ersteinsatz | ja |
| `PQ-DI-U` | jährliche DI-Unterweisung | ja |
| `PQ-BSH` | nur wenn GB/Objekt/Vertrag Brandschutzhelfer verlangt | kontext |

**Nicht aus Profil ableiten:** Ersthelfer steht **nicht** in der Profil-Tabelle — trotzdem Pflicht laut 4.19.1 / Organisation.

### Schritt 4 — Weiterbildung und Einweisung

| Code | Regel |
|------|-------|
| `WB-40` / `WB-24` | Kalenderjahr — Beschäftigungsart wählen; Unter Soll → **eingeschränkt** |
| `EW-OBJ` | vor Ersteinsatz am Leistungsort; bei 77200-2 **Pflicht** |
| `EW-EINS` | Schicht/Event (bes. ÖPNV, Veranstaltung) — ergänzend |

### Schritt 5 — 77200-2-Zusatz (`codes_z772`)

Nur wenn Profil aus **Anhang C** / Vorlage `77200-2_*`:

| SDL | `codes_z772` (gesamt SDL, sobald eine Zeile aktiv) |
|-----|---------------------------------------------------|
| ÖPNV | `Z772-OEPNV` |
| Veranstaltung Kap. 5 | `Z772-VER-FK` (nur FK-Rollen) |
| Objekt Kap. 7 | `Z772-OBJ` |
| Unterkunft Kap. 8 | `Z772-UNTER` |

**Revierdienst (77200-1):** `codes_z772` = **leer**, sofern kein paralleles 77200-2-Profil.

### Schritt 6 — SDL-spezifische 77200-1-Zusätze

| SDL | Zusatz nur wenn Tätigkeit im Profil aktiv |
|-----|-------------------------------------------|
| Interventionsdienst | `SDL-INT-24H`, `SDL-INT-5X` — **Pflicht** sobald Profil `77200-1_interventionsdienst` und ≥1 Zeile aktiv (siehe Referenz-SDL unten) |
| Revier / sonstige Standard-77200-1 | keine SDL-*-Codes |

### Schritt 7 — Verwendungs-Freigabe (Aggregation)

Für **eine Person** und **eine Verwendung** (Auftrag × Objekt × Rolle):

1. Alle Zeilen mit `Erbringen = Ja` sammeln.
2. **Höchste** geforderte Stufe A/B/C → GQ muss diese Stufe abdecken (nicht nur die schwächste Zeile).
3. **Vereinigungsmenge** aller `codes_erforderlich` + `codes_z772` (ohne Duplikate).
4. PQ-Baseline + WB + EW-OBJ immer prüfen.
5. Entscheidung: [[03_matrix_release_hooks_v2#Personalfreigabe]] · Detail V1: [[../qualifikationssystem/05_sdl_freigabelogik]]

---

## Referenz-SDL: Revierdienst (77200-1)

**Profilvorlage:** `anforderungsprofile/77200-1_revierdienst.md` · Anhang A Tabelle A.1 Spalte 4  
**Normteil:** nur 77200-1 · `codes_z772`: —

### SDL-Baseline (jede aktive Zeile)

```
PQ-EH; PQ-DGUV; PQ-DS; PQ-DI-U; WB-40; EW-OBJ
```

(`WB-24` bei Teilzeitbeschäftigung laut Organisation.)

### Beispiel-Matrix (Auszug)

| profil_ref | taetigkeit_kurz | stufe | ag_erh. | codes_erforderlich | codes_z772 | kritisch |
|------------|-----------------|-------|---------|-------------------|------------|----------|
| A.1-2-einfach | Überwachung sicherheitsrelevanter Vorgänge — einfach | A | nein | `GQ-A-34A-S; PQ-EH; PQ-DGUV; PQ-DS; PQ-DI-U; WB-40; EW-OBJ` | — | ja |
| A.1-2-komplex | Überwachung — komplex | B | nein | `GQ-B-GSSK; PQ-EH; PQ-DGUV; PQ-DS; PQ-DI-U; WB-40; EW-OBJ` | — | ja |
| A.1-7-komplex | Arbeitsstättenverordnung — komplex | C | nein | `GQ-C-MS; PQ-EH; PQ-DGUV; PQ-DS; PQ-DI-U; WB-40; EW-OBJ` | — | ja |
| A.1-8-einfach | Alarmverifikation — einfach | A | nein | `GQ-A-34A-S; PQ-EH; …` | — | ja |
| A.1-8-komplex | Alarmverifikation — komplex | B | nein | `GQ-B-GSSK; PQ-EH; …` | — | ja |
| A.1-20-komplex | Verkehrslenkung im Objekt — komplex | B | nein | `GQ-B-GSSK; PQ-EH; …` | — | ja |

**Praxis:** Revier-Verträge aktivieren oft mehrere Zeilen Stufe A und einzelne B — Freigabe erfordert dann **mindestens GQ-B** plus alle PQ/EW/WB.

---

## Referenz-SDL: ÖPNV (77200-2)

**Profilvorlage:** `77200-2/anforderungsprofile/77200-2_oepnv.md` · Anhang C Tabelle C.2  
**Normteil:** 77200-1-Basis **und** 77200-2 Kap. 6

### SDL-Baseline (77200-2 — zusätzlich zu 77200-1)

```
codes_z772: Z772-OEPNV
codes_erforderlich (zusätzlich zur Zeile): PQ-EH; PQ-DGUV; PQ-DS; PQ-DI-U; WB-40; EW-OBJ; EW-EINS
```

`Z772-OEPNV` gilt für **jede** aktive ÖPNV-Profilzeile — nicht nur für komplexe Tätigkeiten.

### Beispiel-Matrix (Auszug — kritische Stufen)

| profil_ref | taetigkeit_kurz | stufe | ag_erh. | codes_erforderlich | codes_z772 | kritisch |
|------------|-----------------|-------|---------|-------------------|------------|----------|
| C.2-2-einfach | Überwachung — einfach | A | nein | `GQ-A-34A-S; PQ-EH; PQ-DGUV; PQ-DS; PQ-DI-U; WB-40; EW-OBJ; EW-EINS` | `Z772-OEPNV` | ja |
| C.2-6-komplex | Alarmverifikation — komplex | C | nein | `GQ-C-MS; PQ-EH; PQ-DGUV; PQ-DS; PQ-DI-U; WB-40; EW-OBJ; EW-EINS` | `Z772-OEPNV` | ja |
| C.2-5-komplex | Auflagen/Erlaubnisse — komplex | C | nein | `GQ-C-MS; …` | `Z772-OEPNV` | ja |
| C.2-13-komplex | Fahrzeugkontrolle Gefahrgut/Ladung — komplex | C | nein | `GQ-C-MS; …` | `Z772-OEPNV` | ja |
| C.2-14-komplex | Fahrzeugbegleitung — komplex | C | nein | `GQ-C-MS; …` | `Z772-OEPNV` | ja |
| C.2-18-komplex | Verkehrslenkung im Objekt — komplex | C | nein | `GQ-C-MS; …` | `Z772-OEPNV` | ja |
| C.2-1-erweitert | Video-/Gefahrenmeldeanlagen — erweitert | B | nein | `GQ-B-GSSK; …` | `Z772-OEPNV` | ja |

**Hinweis:** Zeile C.2-6-komplex entspricht dem Hook-Beispiel in [[03_matrix_release_hooks_v2#Beispiel (logisch)]].

---

## Referenz-SDL: Interventionsdienst (77200-1)

**Profilvorlage:** `anforderungsprofile/77200-1_interventionsdienst.md` · Anhang A Tabelle A.1 Spalte 5  
**Normteil:** nur 77200-1 · `codes_z772`: —

### SDL-Zusatz (gesamtes Profil)

Sobald **mindestens eine** Profilzeile `Erbringen = Ja` hat, gelten **zusätzlich** zu jeder Zeilen-Matrix:

```
SDL-INT-24H; SDL-INT-5X
```

| Code | Freigabe-Hinweis | `freigabe_kritisch` |
|------|------------------|---------------------|
| `SDL-INT-24H` | Interventionsbezogene Erstschulung (24 h) — fehlt → **nicht freigegeben** für Interventionsdienst | ja |
| `SDL-INT-5X` | Fünf dokumentierte Interventionen — < 5 → **nicht freigegeben** | ja |

**Abgrenzung:** `SDL-*` ersetzt **nicht** die aus der Profilzeile abgeleitete Stufe A/B/C (`GQ-*`). Beides ist Konjunktion.

### SDL-Baseline (jede aktive Zeile — wie Revier)

```
PQ-EH; PQ-DGUV; PQ-DS; PQ-DI-U; WB-40; EW-OBJ
```

(`WB-24` bei Teilzeitbeschäftigung laut Organisation.)

### Beispiel-Matrix (Auszug)

| profil_ref | taetigkeit_kurz | stufe | ag_erh. | codes_erforderlich | codes_z772 | kritisch |
|------------|-----------------|-------|---------|-------------------|------------|----------|
| A.1-Sp5-2-einfach | Überwachung — einfach | A | nein | `GQ-A-34A-S; PQ-EH; PQ-DGUV; PQ-DS; PQ-DI-U; WB-40; EW-OBJ; SDL-INT-24H; SDL-INT-5X` | — | ja |
| A.1-Sp5-8-komplex | Alarmverifikation — komplex | B | nein | `GQ-B-GSSK; PQ-EH; PQ-DGUV; PQ-DS; PQ-DI-U; WB-40; EW-OBJ; SDL-INT-24H; SDL-INT-5X` | — | ja |
| A.1-Sp5-7-komplex | Arbeitsstättenverordnung — komplex | C | nein | `GQ-C-MS; PQ-EH; PQ-DGUV; PQ-DS; PQ-DI-U; WB-40; EW-OBJ; SDL-INT-24H; SDL-INT-5X` | — | ja |
| A.1-Sp5-21-erweitert | Schadensmeldung/Verkehrsunfall — erweitert | B | nein | `GQ-B-GSSK; PQ-EH; PQ-DGUV; PQ-DS; PQ-DI-U; WB-40; EW-OBJ; SDL-INT-24H; SDL-INT-5X` | — | ja |
| A.1-Sp5-21-komplex | Schadensmeldung — komplex | B | nein | `GQ-B-GSSK; …; SDL-INT-24H; SDL-INT-5X` | — | ja |

**Praxis:** Interventionsaufträge aktivieren oft Zeilen 8 (Alarm) und 21 (Schadensmeldung) — Freigabe verlangt dann **höchste** Profil-Stufe (hier bis B oder C) **plus** beide SDL-Codes.

### Freigabe-Hinweise (Intervention)

| Situation | Ergebnis |
|-----------|----------|
| Profil Stufe B, Nachweis nur A | **nicht freigegeben** für B-Zeilen |
| `SDL-INT-24H` fehlt | **nicht freigegeben** (gesamter Interventionsdienst) |
| `SDL-INT-5X` unvollständig | **nicht freigegeben** |
| Nur Teiltätigkeiten freigegeben | **eingeschränkt** — `einschraenkung` + ggf. ohne Interventionseinsätze |
| WB unter Soll | **eingeschränkt** mit Auflage bis Datum |

Detail V1: [[../qualifikationssystem/03_sdl_zusatzqualifikationen]] · Katalog: [[02_qualification_catalog_v2#Intervention — 24-Stunden-Schulung]]

---

## Personalfreigabe — Anwendung der Matrix

### Prüfablauf (logisch)

```
1. profil_ref laden (77200-1_* oder 77200-2_*)
2. aktive Zeilen → Matrix-Zeilen (dieses Dokument + Algorithmus)
3. codes_geprueft = Vereinigung aller Codes
4. je Code: Nachweis + valid_until (Tool 2 später)
5. status + begruendung + auflagen → ReleaseDecision
```

### Minimalfelder (CEKS)

Siehe [[03_matrix_release_hooks_v2#Personalfreigabe]] — `freigabe_id`, `person_ref`, `verwendung`, `profil_ref`, `codes_geprueft`, `status`.

### Typische Blocker (Revier, Intervention, ÖPNV)

| Blocker | Code | SDL |
|---------|------|-----|
| Stufe zu niedrig | `GQ-*` | alle |
| Ersthelfer abgelaufen | `PQ-EH` | alle |
| Intervention ohne 24-h-Schulung | `SDL-INT-24H` | Interventionsdienst |
| Intervention ohne 5 Einsätze | `SDL-INT-5X` | Interventionsdienst |
| ÖPNV ohne Schulung | `Z772-OEPNV` | ÖPNV |
| Keine Objekteinweisung | `EW-OBJ` | alle |
| WB-Jahr unvollständig | `WB-40` / `WB-24` | alle |
| DI-Unterweisung > 1 Jahr | `PQ-DI-U` | alle |

---

## Tool-1 / Tool-2 (Vorbereitung)

| Artefakt | Bezug |
|----------|-------|
| `required_for_profile_line` | `profil_ref` aus Tabelle oben |
| `qualification_code` | Eintrag aus `codes_erforderlich` / `codes_z772` |
| `release_blockers` | kritische Codes mit `evidence_status != ok` |

Tool-2-Entitäten: [[03_matrix_release_hooks_v2#Tool-2-Anbindung (Perspektive)]]

---

## Erweiterung auf weitere SDL

Gleicher Algorithmus — Profilvorlage aus `anforderungsprofile/` lesen, `codes_z772` aus Schritt 5, SDL-* aus Schritt 6.

| SDL | Vorlage | Zusatzcodes | Status in 04 |
|-----|---------|-------------|--------------|
| Revierdienst | `77200-1_revierdienst` | — | **ausgearbeitet** |
| Interventionsdienst | `77200-1_interventionsdienst` | `SDL-INT-24H; SDL-INT-5X` | **ausgearbeitet** |
| ÖPNV | `77200-2_oepnv` | `Z772-OEPNV` | **ausgearbeitet** |
| Veranstaltung bes. Relevanz | `77200-2_veranstaltung_*` | `Z772-VER-FK` (FK) | geplant |
| Flüchtlingsunterkunft | `77200-2_fluechtlings_*` | `Z772-UNTER` | geplant |

---

## Offen / Verifikation

- [ ] Weitere Profil-Zeilen als Vollmatrix exportieren (Tool 1) — nicht manuell im Knowledge duplizieren
- [ ] VA Kap. 7 V9 — PQ-/WB-Fristen gegen Organisation abstimmen
- [ ] AG-Erhöhung: organisationsinterne Mindeststufen-Regel schriftlich fixieren

Vor Zertifizierungsentscheid: Primärquelle `inputs/raw_standards/` + [[../Qualifikationsanforderungen]].
