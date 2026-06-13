# knowledge/2_regulations — Bereinigungsvorschlag

> Vorschlag, noch nichts geändert. Mark gibt frei.
> Stand: 2026-06-10

---

## Bewertung Ist-Zustand

### Was gut ist
- Format der `overview.md` ist solide: Zweck → Kernaussagen → was der Bot NICHT darf → Bezug Security. Dieses Schema beibehalten.
- `arbschg/overview.md` und `dguv_v1/overview.md` sind inhaltlich brauchbar.

### Probleme

| Problem | Detail |
|---------|--------|
| 3 von 6 Ordnern leer | `bewachv/`, `betrsichv/`, `ArbStättV/` = nur `.gitkeep` |
| Inkonsistente Benennung | `ArbStättV`, `arbschg`, `VStättVO`, `betrsichv` — kein Schema |
| README lügt | Referenziert `din_vde/` — existiert nicht |
| Security-Kern fehlt | DGUV V23 (Wachgewerbe), VBG, GewO §34a haben keinen eigenen Ordner |
| DGUV doppelt | `dguv_v1/` hier + DGUV-Inhalte nochmal in `4_sources/dguv/` |
| Basis vs. Branche nicht getrennt | Alles auf einer Ebene, kein Hinweis was branchenübergreifend gilt |

---

## Vorschlag — neue Struktur

Gleiche Logik wie OneDrive: **Basis-Schicht + Branche**.
Benennung: **alles lowercase, underscores, kein Leerzeichen.**

```
2_regulations/
│
├── README.md                        ← aktualisieren (siehe unten)
│
├── 00_basis/                        ← gilt für alle Branchen
│   ├── arbschg/                     ← bereits gut ✓ → verschieben
│   │   └── overview.md
│   ├── arbstaettv/                  ← umbenennen (war ArbStättV)
│   │   └── overview.md              ← INHALT FEHLT — befüllen
│   ├── betrsichv/                   ← umbenennen
│   │   └── overview.md              ← INHALT FEHLT — befüllen
│   ├── dguv_v1/                     ← bereits gut ✓ → verschieben
│   │   └── overview.md
│   └── dsgvo_bdsg/                  ← NEU — fehlt komplett
│       └── overview.md
│
├── 01_sicherheitsdienstleistungen/  ← Security-Kern
│   ├── bewachv/                     ← umbenennen (war bewachv — ok)
│   │   └── overview.md              ← INHALT FEHLT — befüllen
│   ├── gewo_34a/                    ← NEU
│   │   └── overview.md
│   ├── dguv_v23/                    ← NEU — DGUV Vorschrift 23 Wachgewerbe
│   │   └── overview.md
│   └── vbg/                         ← NEU — VBG-spezifische Regelwerke
│       └── overview.md
│
├── 02_veranstaltungen/              ← Veranstaltungs-Blueprints
│   ├── vstaettvo/                   ← umbenennen (war VStättVO)
│   │   └── overview.md              ← bereits vorhanden ✓ → verschieben
│   └── mboev/                       ← NEU (optional: Muster-Beherbergungs-VO)
│       └── overview.md
│
└── 03_weitere_branchen/             ← Zukunft (Expansion)
```

---

## Benennung — neue Regel (verbindlich)

```
alles lowercase
underscores statt Leerzeichen oder Bindestriche
kein Umlaut im Ordnernamen (ae/oe/ue)
```

| Alt | Neu |
|-----|-----|
| `ArbStättV` | `arbstaettv` |
| `VStättVO` | `vstaettvo` |
| `betrsichv` | bleibt (bereits ok) |
| `bewachv` | bleibt |
| `arbschg` | bleibt |
| `dguv_v1` | bleibt |

---

## Priorität beim Befüllen

Reihenfolge nach Relevanz für laufende Projekte + GBU-Bot:

1. `01_sicherheitsdienstleistungen/dguv_v23/` — DGUV V23 Wachgewerbe (direkter CL-75/CL-22-Anker)
2. `01_sicherheitsdienstleistungen/bewachv/` — für alle SDL-Kunden Pflicht
3. `01_sicherheitsdienstleistungen/gewo_34a/` — §34a Grundlage
4. `00_basis/arbstaettv/` — für GBU Büro/Leitstelle
5. `00_basis/dsgvo_bdsg/` — für Personalakten-Kontext
6. `01_sicherheitsdienstleistungen/vbg/` — nach DGUV-Download

---

## Auch im knowledge/ root fixen (separat, niedrige Prio)

| Problem | Fix |
|---------|-----|
| `4_document_types/` + `4_sources/` — doppelte Nummer | `4_sources/` → `5_sources/` (alles ab 4 eins hochzählen) |
| `2026-05-29.md`, `2026-05-30.md` loose an der Wurzel | → `09_archiv/` oder löschen |
| `Unbenannt.canvas` | löschen |
| `1_standards/din_77200/` + `DIN 77200-1/` — Duplikat | aufräumen, einheitlich lowercase |
| `10_rules/`, `11_examples/` — anderes Schema | umbenennen zu `10_rules/`, `11_examples/` (ok wenn bewusst) |

---

## Nächster Schritt

1. Mark gibt Struktur frei
2. Umbenennen + Verschieben (kann ich direkt im Repo ausführen)
3. Leere `overview.md`-Stubs anlegen (nach DGUV-Download befüllen)
4. README aktualisieren
