# SDL-Freigabelogik V1 — dünne Zusatzschicht (CEKS)

Einstieg: [[README]] · Personalfreigabe: [[05_personnel_release_v1]] · Matrix: [[04_qualifikationsmatrix_logik]] · V1-Detail: [[../qualifikationssystem/05_sdl_freigabelogik]]

**Status:** CEKS-V1 — **kein** paralleles System · **keine** Tool-Implementierung

---

## Zweck dieser Datei

Die **SDL-Freigabe** nutzt **dieselbe Prüflogik** wie die Personalfreigabe ([[05_personnel_release_v1]]). Diese Datei ist nur die **SDL-spezifische Dokumentationsschicht**:

- Fokus auf **Norm-SDL** und **Verwendung** (nicht Personenakte allgemein)
- Verweis auf Profilvorlage und Matrix — **keine** zweite Entscheidungsmatrix
- Kurz-Checkliste für Audit und Agenten

**Nicht:** Ersetzung von `qualifikationssystem/05_sdl_freigabelogik.md` (V1-Detail DE bleibt dort).

---

## Beziehung Personalfreigabe ↔ SDL-Freigabe

| Aspekt | Personalfreigabe (`05`) | SDL-Freigabe (diese Datei) |
|--------|-------------------------|----------------------------|
| Prüflogik | vollständig | **identisch** — Verweis auf `05` |
| Schema-Felder | `freigabe_id`, `person_ref`, … | **gleiche Felder** |
| Dokumentationsfokus | Person + Verwendung | **SDL-Name** + Objekt/Auftrag |
| Codes | `codes_geprueft` aus `04` | **gleich** |

**Agent:** Eine Entscheidung dokumentieren — nicht zwei widersprüchliche Freigaben für dieselbe Verwendung.

---

## SDL-Freigabe — Mindestkontext (zusätzlich im Protokoll)

| Feld | Beschreibung |
|------|--------------|
| `norm_sdl` | z. B. ÖPNV, Revierdienst, Interventionsdienst |
| `profil_vorlage` | `77200-1_*` oder `77200-2_*` |
| `anhang_ref` | Anhang A Spalte X / Anhang C Tabelle C.Y |

Alle übrigen Felder: [[05_personnel_release_v1#Mindestfelder (Schema V1)]]

---

## Prüfablauf (SDL-Fokus, verkürzt)

```
1. Norm-SDL + Profilvorlage festlegen
2. Aktive Profilzeilen → 04_qualifikationsmatrix_logik
3. codes_geprueft bilden
4. Auftrag: SK/EK ok? (77200-2 / Auslöser) — siehe 04 Dokumentkette
5. Entscheidung wie 05 (freigegeben / eingeschraenkt / nicht_freigegeben)
```

Vollständig: [[05_personnel_release_v1#Prüfablauf (V1)]]

---

## SDL-Checkliste (Konjunktion — keine Duplikat-Matrix)

```
☐ Profil — aktive Zeilen + höchste Stufe
☐ GQ-* — Mindeststufe abgedeckt
☐ PQ-* + WB-* — Baseline
☐ EW-OBJ (+ EW-EINS wenn Event/mobil)
☐ SDL-* / Z772-* — nur wenn SDL/Profil es verlangt
☐ Auftrags-Dokumentkette — wenn 77200-2 oder SK/EK-Auslöser
═══════════════════════════════
→ SDL-Freigabeentscheid (= status in 05)
```

Prioritäten: [[03_matrix_release_hooks_v2#Prioritätsregeln]] · Blocker: [[04_qualifikationsmatrix_logik#Typische Blocker (alle Referenz-SDL)]]

---

## Entscheidungsstatus

| Status | SDL-Bedeutung |
|--------|---------------|
| **freigegeben** | SMA darf für **diese SDL-Verwendung** eingesetzt werden |
| **eingeschraenkt** | Nur definierte Tätigkeiten/Auflagen — `einschraenkung` Pflicht |
| **nicht_freigegeben** | Einsatz für diese SDL-Verwendung unzulässig |

Detailregeln und Beispiele: [[../qualifikationssystem/05_sdl_freigabelogik#Entscheidungsregeln (Logik)]]

---

## Protokoll-Titel (Empfehlung)

```markdown
## SDL-Freigabe — [person_ref] — [norm_sdl] — [verwendung]
```

Inhalt = Felder aus `05` + `norm_sdl` / `anhang_ref` oben.

**Nächste Schicht:** [[07_einsatz_release_v1]] — konkreter Einsatz/Schicht.

---

## Agent-Regeln

- **Kein** zweites Qualifikationssystem anlegen — nur `qualifications/` V2+ und V1-`05` Detail.  
- SDL-Freigabe **immer** über `05` + `04` — diese Datei ist **Orientierung**, nicht Ersatz.  
- Ordner: [[../../Governance/DIN 77200/QUALIFICATION_V1_V2]]

---

## Verifikation

[[../qualifikationssystem/05_sdl_freigabelogik]] · Primärquelle `inputs/raw_standards/`
