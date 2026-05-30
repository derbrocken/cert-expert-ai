# Qualifikationssystem V1 (Legacy) — DIN 77200-1

**Pfad:** `knowledge/1_standards/DIN 77200-1/qualifikationssystem/`  
**Status:** **V1 / Legacy** — deutschsprachige Bausteine 01–05, **bleibt erhalten**  
**Aktueller Arbeitsstand:** [[../qualifications/README|qualifications/ (V2+)]]

---

## Ordnerentscheidung (kurz)

| | V1 (dieser Ordner) | V2+ (`qualifications/`) |
|--|-------------------|-------------------------|
| **Rolle** | Audit-Tiefe, Bausteine, Freigabe-Detail DE | Katalog-Codes, Matrix, Freigabe-Hooks |
| **Migration** | **nein** — nicht verschieben, nicht löschen | neue Inhalte **nur hier** |
| **Agent Einstieg Freigabe/Matrix** | ergänzend | **zuerst** |

Dokumentation: [[../../Governance/DIN 77200/QUALIFICATION_V1_V2]]

---

## Zweck (V1)

Modelliert **welche Nachweise** erfüllt sein müssen und **wie die SDL-Freigabe** fachlich begründet wird — getrennt vom Anforderungsprofil, ohne Mitarbeiter-Gesamtliste.

| Baustein | Datei | Gegenstand |
|----------|-------|------------|
| Grundqualifikationen | [[01_grundqualifikationen]] | Stufen A / B / C |
| Pflichtqualifikationen | [[02_pflichtqualifikationen]] | Ersthelfer, DGUV, DI-U, … |
| SDL-Zusatzqualifikationen | [[03_sdl_zusatzqualifikationen]] | Intervention, 77200-2-Verweise |
| Weiterbildungslogik | [[04_weiterbildungslogik]] | 4.19.2, UE-Status |
| SDL-Freigabelogik | [[05_sdl_freigabelogik]] | Entscheidungsmodell Freigabe |

---

## Abgrenzung zum Anforderungsprofil

| Anforderungsprofil | Qualifikationssystem |
|--------------------|----------------------|
| Tätigkeit + Stufe A/B/C | Nachweis der Stufe + Pflichtnachweise |
| Vertragliche Steuerung | Freigabeentscheid je Verwendung |

Vorlagen: `anforderungsprofile/` (77200-1 und 77200-2).

---

## Systemfluss (V1)

```
Anforderungsprofil → 01 → 02 → 03 → 04 → Einweisung → 05 SDL-Freigabe
```

Operative Code-Matrix und Profil-Ableitung: **V2** — [[../qualifications/04_qualifikationsmatrix_logik]].

---

## Quellenbasis

DIN 77200-1/-2, [[Qualifikationsanforderungen]], [[Weiterbildung]]; VA Kap. 7 V9 — noch nicht vollständig im Repo.

---

## Verwandte Module

[[Anforderungsprofile]] · [[Qualifikationsanforderungen]] · [[Weiterbildung]] · [[Führungsanforderungen]] · [[Auditnachweise]]

---

## Nicht in diesem Ordner anlegen

- Keine neuen `*_v2.md`-Dateien  
- Keine Qualifikationsmatrix (liegt in V2)  
- Keinen Qualifikationskatalog mit Codes (liegt in V2)  
- Keine Personalfreigabe V1-Dublette — geplant in `qualifications/`
