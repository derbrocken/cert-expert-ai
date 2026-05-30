# Einsatzfreigabe V1 — CEKS-Logik

Einstieg: [[README]] · Personalfreigabe: [[05_personnel_release_v1]] · SDL-Freigabe: [[06_sdl_release_v1]] · Matrix: [[04_qualifikationsmatrix_logik]] · Hooks: [[03_matrix_release_hooks_v2]]

**Status:** CEKS-V1 — **keine** Tool-2-Implementierung · **keine** echten Personennamen · **keine** zweite Matrix

---

## Zweck

Die **Einsatzfreigabe** ist die letzte **fachliche CEKS-Schicht** vor dem konkreten Einsatz. Sie bestätigt, dass für **diesen** Einsatz (Schicht, Datum, Objekt/Auftrag) alle Voraussetzungen erfüllt sind:

```
Personalfreigabe → SDL-Freigabe → Einsatzfreigabe → Einsatz (operativ)
```

**Einsatzfreigabe** beantwortet: Darf die Person **heute / in dieser Schicht / an diesem Ort** mit **dieser Lage** starten?

---

## Abgrenzung

| Schicht | Frage | Dokument |
|---------|-------|----------|
| **Personalfreigabe** | Darf die Person grundsätzlich für diese Verwendung (Profil + Codes)? | [[05_personnel_release_v1]] |
| **SDL-Freigabe** | Ist die SDL-Verwendung fachlich freigegeben (gleiche Logik, SDL-Fokus)? | [[06_sdl_release_v1]] |
| **Einsatzfreigabe** | Darf der **konkrete Einsatz** starten? | diese Datei |

| Nicht verwechseln mit | Hinweis |
|----------------------|---------|
| Schichtplan / Dienstplan | operative Planung — Tool 2 später |
| Personalfreigabe erneuern | Einsatzfreigabe **setzt voraus**, ersetzt nicht `05`/`06` |
| Zweite Qualifikationsmatrix | Codes kommen aus `04` — hier nur **Status** der Vorgänger-Freigaben + Einsatzkontext |

---

## Mindestfelder (Schema V1)

| Feld | Pflicht | Beschreibung |
|------|---------|--------------|
| `einsatz_freigabe_id` | ja | Eindeutige ID dieser Einsatzentscheidung |
| `person_ref` | ja | Abstrakte Personenreferenz (z. B. `P-0042`) — **kein Name** im Knowledge |
| `rolle_ref` | ja | Abstrakte Rollenreferenz (z. B. `R-EINSATZKRAFT`, `R-SCHICHTLEITUNG`) |
| `norm_sdl` | ja | z. B. ÖPNV, Revierdienst, Interventionsdienst |
| `objekt_auftrag_ref` | ja | Objekt- oder Auftragsreferenz |
| `schicht_datum` | ja | Schicht-ID und/oder Einsatzdatum |
| `profil_ref` | ja | Abgestimmtes Profil (`77200-1_*` / `77200-2_*`) |
| `profil_zeilen_aktiv` | ja | Aktive Zeilen (`Erbringen = Ja`) |
| `status_personalfreigabe` | ja | `freigegeben` / `eingeschraenkt` / `nicht_freigegeben` — Verweis auf `05` |
| `freigabe_id_personal` | ja | ID der Personalfreigabe (`05`) |
| `status_sdl_freigabe` | ja | Status der SDL-Freigabe — i. d. R. gleich `05`, dokumentiert über `06` |
| `freigabe_id_sdl` | optional | ID SDL-Freigabe-Protokoll, falls getrennt dokumentiert |
| `ew_obj` | ja | Objektbezogene Einweisung — `vorhanden` / `fehlt` / `veraltet` |
| `ew_eins` | ja | Einsatz-/Schichtbriefing — `vorhanden` / `fehlt` |
| `dokumentkette` | kontext | SK / EK / ODA (DI) — siehe unten |
| `nachweise_abgelaufen` | ja | Liste abgelaufener relevanter Codes — leer = ok |
| `gueltig_bis` | optional | Befristung dieser Einsatzfreigabe |
| `status_einsatz` | ja | `freigegeben` / `eingeschraenkt` / `nicht_freigegeben` |
| `begruendung` | bei eingeschränkt/nicht | Pflicht |
| `auflagen` | optional | z. B. nur Streife Bereich A |
| `pruefer` | ja | Rolle + Datum |

### Dokumentkette SK / EK / ODA (kein Qualifikationscode)

| Feld | Wann prüfen | Wert |
|------|-------------|------|
| `sk_vorhanden` | 77200-2 Kap. 5–8; 77200-1 mit SK-Auslöser | ja / nein / n.a. |
| `ek_vorhanden` | wie oben | ja / nein / n.a. |
| `oda_di_aktuell` | Objekt-DI/ODA versioniert und eingewiesen | ja / nein |

Regeln: [[04_qualifikationsmatrix_logik#Dokumentkette]] · Veranstaltung/77200-2: SK+EK Pflicht auf Auftragsebene.

### Einweisungen (Codes)

| Code | Einsatzfreigabe |
|------|-----------------|
| `EW-OBJ` | muss **vorhanden** und aktuell sein (Objektwechsel/Umbau → erneuern) |
| `EW-EINS` | muss für **diese Schicht/Lage** vorhanden sein — bes. Veranstaltung, ÖPNV, mobil, Unterkunft |

Katalog: [[02_qualification_catalog_v2#Objekt-Einweisung]] · [[02_qualification_catalog_v2#Einsatz-Briefing]]

---

## Prüfablauf (V1)

### 1. Personalfreigabe vorhanden?

- `freigabe_id_personal` referenziert gültige Entscheidung aus [[05_personnel_release_v1]].  
- `status_personalfreigabe` = `freigegeben` oder `eingeschraenkt` (mit dokumentierter `einschraenkung`, die den Einsatz abdeckt).  
- Bei `nicht_freigegeben` → **Einsatzfreigabe: nicht_freigegeben** (Abbruch).

### 2. SDL-Freigabe vorhanden?

- SDL-Kontext dokumentiert ([[06_sdl_release_v1]]).  
- `status_sdl_freigabe` konsistent mit Personalfreigabe (technisch dieselbe Entscheidung, SDL-Fokus).  
- Bei Widerspruch → **nicht_freigegeben**.

### 3. Objekt-/auftragsspezifische Dokumente vorhanden?

- `dokumentkette`: SK, EK, ODA/DI je nach SDL (s. `04`).  
- 77200-2 ohne SK/EK → **nicht_freigegeben** auf Einsatzebene.

### 4. EW-OBJ vorhanden?

- Objektbezogene Einweisung dokumentiert und nicht veraltet.  
- Fehlt → **nicht_freigegeben**.

### 5. EW-EINS für konkrete Lage/Schicht vorhanden?

- Schichtbriefing / Tageslage für **diesen** Einsatz.  
- Fehlt bei SDL mit Schicht/Event-Pflicht → **nicht_freigegeben** oder **eingeschraenkt** mit Auflage „Briefing vor Schichtbeginn“.

### 6. Keine abgelaufenen Nachweise?

- `nachweise_abgelaufen` aus `codes_geprueft` der Personalfreigabe prüfen (Ersthelfer, DI-U, …).  
- Kritischer Code abgelaufen → **nicht_freigegeben**.

### 7. Ergebnis

| Ergebnis | Bedingung |
|----------|-----------|
| **freigegeben** | Schritte 1–6 erfüllt; Auflagen der Personalfreigabe decken Einsatz ab |
| **eingeschraenkt** | Einsatz mit dokumentierten Auflagen/Einschränkungen startbar |
| **nicht_freigegeben** | Mindestens ein Blocker |

---

## Blocker (Einsatzebene)

| Blocker | Folge |
|---------|--------|
| Keine gültige Personalfreigabe | `nicht_freigegeben` |
| Personalfreigabe `eingeschraenkt`, Einsatz außerhalb `einschraenkung` | `nicht_freigegeben` |
| SK/EK fehlt (77200-2 / Auslöser) | `nicht_freigegeben` |
| `EW-OBJ` fehlt oder veraltet | `nicht_freigegeben` |
| `EW-EINS` fehlt (wenn erforderlich) | `nicht_freigegeben` oder `eingeschraenkt` mit Auflage |
| Abgelaufener kritischer Nachweis | `nicht_freigegeben` |
| ODA/DI veraltet | `nicht_freigegeben` bis Einweisung |

Matrix-Blocker: [[04_qualifikationsmatrix_logik#Typische Blocker (alle Referenz-SDL)]]

---

## Beispiel (logisch, ohne Personennamen)

```markdown
einsatz_freigabe_id: EF-2026-00456
person_ref: P-0042
rolle_ref: R-EINSATZKRAFT
norm_sdl: ÖPNV
objekt_auftrag_ref: AUF-ÖPNV-L12-2026
schicht_datum: SCH-2026-06-01-Früh
profil_ref: 77200-2_oepnv.md
status_personalfreigabe: freigegeben
freigabe_id_personal: FR-2026-00123
status_sdl_freigabe: freigegeben
ew_obj: vorhanden
ew_eins: vorhanden
sk_vorhanden: ja
ek_vorhanden: ja
oda_di_aktuell: ja
nachweise_abgelaufen: []
status_einsatz: freigegeben
pruefer: Schichtleitung / 2026-06-01 05:45
```

---

## Freigabekette (Übersicht)

```
04 Matrix → codes_geprueft
     ↓
05 Personalfreigabe (Entscheidung Person + Verwendung)
     ↓
06 SDL-Freigabe (Dokumentationsfokus, gleiche Entscheidung)
     ↓
07 Einsatzfreigabe (konkreter Einsatz/Schicht)  ← diese Datei
     ↓
Operativer Einsatz (Tool 2 / Projektakte — später)
```

---

## Tool 2 — Perspektive

Fachliches Domänenmodell (Objekte, Vererbung): [[08_tool2_data_model_v1]].

| Entität | Bezug Einsatzfreigabe |
|---------|----------------------|
| `DeploymentRelease` | Felder dieses Schemas (`07`) |
| `PersonnelRelease` / `SDLRelease` | Voraussetzung (`freigabe_id_personal`, `status_sdl_freigabe`) |
| `QualificationEvidence` | Prüfung vor Einsatz (`nachweise_abgelaufen`) |

**Keine** Implementierung (Software/DB/API) in `07` oder `08`.

---

## Agent-Regeln

- Einsatzfreigabe **ohne** gültige `05` nicht erteilen.  
- **Keine** zweite Matrix — nur Status und Einsatzkontext.  
- Neue Freigabe-Logik **nur** unter `qualifications/` — nicht in `qualifikationssystem/` duplizieren.  
- Ordner V1/V2: [[../../Governance/DIN 77200/QUALIFICATION_V1_V2]]

---

## Verifikation

[[05_personnel_release_v1]] · [[06_sdl_release_v1]] · [[../qualifikationssystem/05_sdl_freigabelogik]] · Primärquelle `inputs/raw_standards/`
