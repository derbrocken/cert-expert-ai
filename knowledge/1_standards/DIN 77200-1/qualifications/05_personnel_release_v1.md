# Personalfreigabe V1 — CEKS-Logik

Einstieg: [[README]] · Matrix: [[04_qualifikationsmatrix_logik]] · Hooks: [[03_matrix_release_hooks_v2]] · Katalog: [[02_qualification_catalog_v2]] · V1-Detail: [[../qualifikationssystem/05_sdl_freigabelogik]]

**Status:** CEKS-V1 — **keine** Personalnamen im Knowledge-Standard · **keine** Tool-2-Implementierung

---

## Zweck

Die Personalfreigabe ist die **dokumentierte Entscheidung**, ob eine **Person** (Referenz-ID) für eine **konkrete Verwendung** eingesetzt werden darf:

```
Verwendung = Auftrag × Objekt/Leistungsort × Rolle × (Schicht/Event)
```

Sie setzt voraus:

1. Abgestimmtes **Anforderungsprofil** (`77200-1_*` oder `77200-2_*`)  
2. Ableitung **`codes_geprueft`** aus [[04_qualifikationsmatrix_logik]]  
3. Nachweisprüfung je Code (Gültigkeit, Dokument — später Tool 2)

**Nicht:** Schichtplanung, Dienstplan, Mitarbeiter-Gesamtliste.

---

## Abgrenzung

| Begriff | Ebene | Gleich Personalfreigabe? |
|---------|-------|--------------------------|
| **Personalfreigabe** | Person + Verwendung | — (dieses Dokument) |
| **SDL-Freigabe** | Fokus SDL/Tätigkeitskontext | **ja** — gleiche Prüflogik, anderer Dokumentationsfokus |
| **FK-Freigabe** | Führungsrolle | **nein** — zusätzlich `FK-*` / `FK-01` |
| **Auftragsfreigabe** | SK/EK/DI vollständig (77200-2) | **nein** — Dokumentkette, kein Qualifikationscode |

---

## Mindestfelder (Schema V1)

| Feld | Pflicht | Beschreibung |
|------|---------|--------------|
| `freigabe_id` | ja | Eindeutige ID der Entscheidung |
| `person_ref` | ja | Personenreferenz (Tool 2 später) — **kein Name** im Knowledge |
| `verwendung` | ja | Auftrag, Objekt, Rolle, Schicht/Event |
| `profil_ref` | ja | Pfad/ID abgestimmtes Profil (Anhang A/C) |
| `profil_zeilen_aktiv` | ja | Liste aktiver Profilzeilen (`Erbringen = Ja`) |
| `codes_geprueft` | ja | Vereinigungsmenge aus Matrix (ohne Duplikate) |
| `status` | ja | `freigegeben` / `eingeschraenkt` / `nicht_freigegeben` |
| `begruendung` | bei eingeschränkt/nicht | Sachliche Begründung |
| `auflagen` | optional | z. B. „WB-Nachweis bis 31.12.“ |
| `einschraenkung` | bei eingeschränkt | Erlaubte Teiltätigkeiten / Ausschlüsse |
| `gueltig_bis` | optional | Befristete Freigabe |
| `pruefer` | ja | Rolle + Datum |
| `auftrag_dokumentkette_ok` | bei 77200-2 / Auslöser | SK/EK/DI geprüft (ja/nein) |

Detail-Schema: [[03_matrix_release_hooks_v2#Personalfreigabe]]

---

## Prüfablauf (V1)

### Schritt A — Verwendung und Profil

1. `verwendung` und `profil_ref` festlegen.  
2. Alle Profilzeilen mit `Erbringen = Ja` erfassen.  
3. **Höchste** geforderte Stufe A/B/C aus aktiven Zeilen bestimmen.

### Schritt B — Codes ableiten

4. Pro aktive Zeile: Matrix aus [[04_qualifikationsmatrix_logik]] (Algorithmus Schritte 1–6).  
5. `codes_geprueft` = Vereinigungsmenge aller `codes_erforderlich` + `codes_z772` + SDL-* (Intervention).  
6. PQ-Baseline und `EW-OBJ` immer einbeziehen, sofern für Verwendung relevant.

### Schritt C — Nachweise (logisch)

7. Je Code in `codes_geprueft`: Nachweis vorhanden? Gültigkeit ok?  
8. Kritische Codes mit Fehlen → mindestens **eingeschränkt** oder **nicht freigegeben** (s. Regeln).

### Schritt D — Auftragsebene (77200-2 / Auslöser)

9. Bei 77200-2 Kap. 5–8 oder 77200-1-Veranstaltung mit SK/EK-Auslöser: Dokumentkette prüfen (nicht durch Personencode ersetzbar).  
10. `auftrag_dokumentkette_ok = nein` → **nicht freigegeben** für den Auftrag (unabhängig von Einzelnachweisen).

### Schritt E — Entscheidung

11. `status` setzen + `begruendung` / `auflagen` / `einschraenkung` pflegen.  
12. Entscheidung dokumentieren — **Projektakte** (Tool 2 später), nicht als Namensliste im Knowledge.

---

## Entscheidungsstatus

| `status` | Bedingung |
|----------|-----------|
| **freigegeben** | Alle relevanten Codes erfüllt und gültig; Auftrags-Dokumentkette ok (falls erforderlich); keine offenen kritischen Blocker |
| **eingeschraenkt** | Teiltätigkeiten oder zeitliche Auflagen; Begründung + `einschraenkung` **Pflicht** |
| **nicht_freigegeben** | Mindestens ein kritischer Blocker oder fehlende Auftrags-Dokumentkette |

### Typische Blocker → nicht_freigegeben

Siehe [[04_qualifikationsmatrix_logik#Typische Blocker (alle Referenz-SDL)]] und V1-Detail [[../qualifikationssystem/05_sdl_freigabelogik#nicht freigegeben]].

| Kategorie | Beispiel |
|-----------|----------|
| Stufe | Profil B, Nachweis nur A |
| Pflicht | `PQ-EH` abgelaufen |
| 77200-2 | `Z772-OEPNV`, `Z772-VER-AN`, `Z772-UNTER`, `Z772-OBJ` fehlt |
| 77200-1 Intervention | `SDL-INT-24H` / `SDL-INT-5X` fehlt |
| Einweisung | `EW-OBJ` fehlt |
| Auftrag | SK oder EK fehlt (77200-2) |

### Typische eingeschraenkt

| Situation | Auflage |
|-----------|---------|
| WB knapp unter Soll | Nachweis bis Datum X |
| Nur Teiltätigkeiten des Profils | `einschraenkung` mit erlaubten Zeilen |
| Zusatzschulung gebucht, Zertifikat ausstehend | Termin + Tätigkeitsausschluss bis Nachweis |

---

## Führungsrolle (FK-Freigabe)

Wenn `verwendung` eine **Führungsrolle** enthält (Einsatzleitung, Objektleitung, Schichtleitung):

- Zusätzlich `FK-01` (und ggf. `Z772-VER-FK` bei Veranstaltung Kap. 5) in `codes_geprueft`.  
- **Einsatzkraft-Freigabe ersetzt nicht** FK-Freigabe — beide getrennt dokumentieren, wenn Rolle wechselt.

---

## Beispiel (logisch, ohne Personennamen)

```markdown
freigabe_id: FR-2026-00123
person_ref: P-0042
verwendung: Auftrag ÖPNV-Linie-12 / Schicht 2026-06-01
profil_ref: 77200-2_oepnv.md
profil_zeilen_aktiv: [C.2-6-komplex, C.2-2-einfach]
codes_geprueft: [GQ-C-MS, PQ-EH, PQ-DGUV, PQ-DS, PQ-DI-U, WB-40, EW-OBJ, EW-EINS, Z772-OEPNV]
status: freigegeben
auftrag_dokumentkette_ok: ja
pruefer: Schichtleitung Qualität / 2026-05-28
```

---

## Tool-2-Perspektive (nicht implementiert)

| Entität | V1-Bezug |
|---------|----------|
| `ReleaseDecision` | Felder dieses Schemas |
| `Person` | `person_ref` |
| `QualificationEvidence` | Prüfung je `codes_geprueft` |
| `ProjectProfile` | `profil_ref` |

Hooks: [[03_matrix_release_hooks_v2#Tool-2-Anbindung (Perspektive)]]

---

## Agent-Regeln

- Personalfreigabe **nur** nach Matrix `04` — nicht aus Gedächtnis oder Einzelfall ohne Codes.  
- **Keine** Personennamen in Knowledge-Dateien.  
- Neue Personalfreigabe-Logik **nur** unter `qualifications/` — **nicht** in `qualifikationssystem/` duplizieren.  
- Ordner V1/V2: [[../../Governance/DIN 77200/QUALIFICATION_V1_V2]]

---

## Verifikation

Vor produktiver Zertifizierungsentscheid: Primärquelle, [[../Qualifikationsanforderungen]], VA Kap. 7 V9 (wenn eingearbeitet).
