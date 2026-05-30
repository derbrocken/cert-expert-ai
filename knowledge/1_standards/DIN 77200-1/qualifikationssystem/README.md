# Qualifikationssystem DIN 77200

Zentraler Knowledge-/Standard-Baustein für **Qualifikationslogik, Nachweisprüfung und SDL-Freigabe** — getrennt vom Anforderungsprofil.

Pfad: `knowledge/1_standards/DIN 77200-1/qualifikationssystem/`

---

## Zweck

Das Qualifikationssystem modelliert **welche Nachweise Mitarbeiter erfüllen müssen** und **ob eine SDL-Freigabe zulässig ist** — ohne operative Einsatzplanung und ohne Mitarbeiter-Gesamtliste.

| Baustein | Gegenstand |
|----------|------------|
| [[01_grundqualifikationen]] | Stufen A / B / C (Anhang A/C-Logik) |
| [[02_pflichtqualifikationen]] | Ersthelfer, Brandschutzhelfer, Pflichtunterweisungen |
| [[03_sdl_zusatzqualifikationen]] | SDL-spezifische Zusatznachweise (z. B. Intervention, 77200-2) |
| [[04_weiterbildungslogik]] | Jährliche Auffrischung, UE-Status |
| [[05_sdl_freigabelogik]] | Entscheidungsmodell SDL-Freigabe |

---

## Abgrenzung zum Anforderungsprofil

| Anforderungsprofil | Qualifikationssystem |
|--------------------|----------------------|
| Tätigkeit (Anhang A/C) | Nachweis, ob SMA die geforderte Stufe **hat** |
| Mindestqualifikation A/B/C je Tätigkeit | Grundqualifikation A/B/C **in der Personalakte** |
| AG-Erhöhung, Bemerkung | Pflichtqualifikationen, Zusatzqualifikationen, WB-Status |
| Vertragliche Steuerung AG/AN | Freigabeentscheidung je SDL / Verwendung |

**Nicht im Anforderungsprofil:** Ersthelfer, Brandschutzhelfer, Führerschein, DGUV-Unterweisungen o. Ä. — siehe [[02_pflichtqualifikationen]].

Vorlagen: `knowledge/1_standards/DIN 77200-1/anforderungsprofile/` · `knowledge/1_standards/DIN 77200-2/anforderungsprofile/`

---

## Quellenbasis

| Quelle | Status |
|--------|--------|
| Verfahrensanweisung **Kap. 7 V9 – Organisation von Qualifikation** | **Noch nicht im Repo** — Regeln vorläufig aus DIN 77200-1/-2, bestehenden Modulen [[Qualifikationsanforderungen]], [[Weiterbildung]] und Projektvorgabe abgeleitet |
| DIN 77200-1:2022-10 (4.1, 4.11, 4.14, 4.19, Anhang A) | Primär normativ |
| DIN 77200-2:2020-07 (Anhang C, Kap. 5–8) | Zusatz-SDL |

Vor produktiver Nutzung: Inhalte gegen **gültige Primärquelle DIN 77200** und die **V9-Verfahrensanweisung** verifizieren, sobald eingearbeitet.

---

## Systemfluss (Überblick)

```
Anforderungsprofil (Tätigkeit + Stufe A/B/C)
        +
Grundqualifikation (01) — erfüllt geforderte Stufe?
        +
Pflichtqualifikationen (02)
        +
SDL-Zusatzqualifikationen (03)
        +
Weiterbildungsstatus (04)
        +
Objektbezogene Unterweisung / Einweisung
        ═══════════════════════════════════
              SDL-Freigabe (05)
```

Detail: [[05_sdl_freigabelogik]]

---

## Verwandte Module

| Modul | Rolle |
|-------|-------|
| [[Anforderungsprofile]] | Vertragliche Tätigkeits- und Stufenfestlegung |
| [[Qualifikationsanforderungen]] | Ausführliches Audit-Modul Stufen A/B/C, §34a |
| [[Weiterbildung]] | Normdetail 4.19.2, UE-Mindestumfang |
| [[Führungsanforderungen]] | Führungsqualifikation (nicht Einsatzkraft-Freigabe) |
| [[Auditnachweise]] | Nachweisregister, Stichprobe |

---

## Offene Einarbeitung

- [ ] VA Kap. 7 V9 vollständig gegenstrukturieren
- [ ] Schulungsdokumente 77200-2 Kap. 5–8 (UE-Inhalte, Teil-2-Schulungen)
- [ ] Operative Tool-1-Mapping-Slots (Personalakte ↔ Prüfbausteine)

---

## Qualifikationssystem V2

Strukturierter Katalog, Matrix- und Freigabe-Hooks:

**Pfad:** `knowledge/1_standards/DIN 77200-1/qualifications/`

Einstieg: [[../qualifications/README|Qualifikationssystem V2]]

V1 (dieser Ordner) bleibt parallel für Bausteine 01–05.
