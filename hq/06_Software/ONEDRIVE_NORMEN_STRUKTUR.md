# OneDrive — Normen, Gesetze & Verordnungen — Ablagestruktur

> Zielstruktur für `02_QM_und_Wissen/01_Normen_Gesetze_Verordnungen/`
> Gilt sofort als Ablage-Regel beim Herunterladen.
> Stand: 2026-06-10

---

## Prinzip: Basis-Schicht + Branchen-Schicht

> `00_Basis` gilt für ALLE Branchen — wird nicht kopiert, sondern referenziert.
> Branchen-Ordner enthalten nur das branchenspezifische Delta.

```
01_Normen_Gesetze_Verordnungen/
│
├── 00_Basis_gilt_fuer_alle/            ← Fundament — jede Branche baut darauf
│   ├── Gesetze/
│   │   ├── ArbSchG/                    ← Arbeitsschutzgesetz (Pflicht überall)
│   │   ├── ArbStaettV/                 ← Arbeitsstättenverordnung
│   │   ├── ASR/                        ← Technische Regeln Arbeitsstätten
│   │   └── DSGVO_BDSG/                 ← Datenschutz
│   ├── Normen/
│   │   └── ISO_45001/                  ← Arbeitsschutzmanagement
│   └── DGUV_Allgemein/
│       ├── Vorschriften/               ← DGUV V1 (Grundpflichten)
│       ├── Regeln/
│       ├── Informationen/              ← I 211-005 (Unterweisungen), I 215-410 (Büro)
│       └── Grundsaetze/
│
├── 01_Sicherheitsdienstleistungen/     ← Kernbranche — Delta zu 00_Basis
│   ├── Normen/
│   │   ├── DIN_77200-1/
│   │   └── DIN_77200-2/                ← Asyl, Veranstaltungen, besondere Objekte
│   ├── Gesetze/
│   │   ├── BewachV/
│   │   └── GewO_34a/
│   └── VBG/                        ← zuständige BG für Sicherheitsbranche
│       ├── Vorschriften/               ← VBG V23 (Wachgewerbe)
│       ├── Regeln/
│       └── Informationen/
│
├── 02_QM_Umwelt/                       ← Zertifizierungsgrundlagen (alle Branchen)
│   ├── ISO_9001/
│   ├── ISO_14001/
│   └── AZAV/
│
├── 03_Bau_Handwerk/                    ← Referenz für GBU-UX, nicht Kernbranche
│   └── BG_BAU/
│       └── bg_bau_handlungsh_gb/       ← bereits abgelegt ✓
│
└── 04_Sonstige_Branchen/               ← Zukunft (Expansion)
```

---

## Ablage-Regel beim Download

| Was du downloadest | Wohin |
|--------------------|-------|
| DGUV Vorschrift X (z.B. V1, V23) | `DGUV/Vorschriften/` |
| DGUV Information X (z.B. 215-410, 211-005) | `DGUV/Informationen/` |
| DGUV Regel X | `DGUV/Regeln/` |
| VBG-Material | `VBG/` (je Typ) |
| Gesetzestext (ArbSchG, BewachV...) | `Gesetze_Verordnungen/` je Ordner |
| Norm-PDF (DIN, ISO) | `Normen/` je Norm |
| BG BAU Handlungshilfen | `DGUV/BG_BAU/` |

---

## DGUV-Nummernlogik (Orientierung)

| Präfix | Typ | Beispiele |
|--------|-----|-----------|
| DGUV Vorschrift 1 | Unfallverhütungsvorschrift (verbindlich) | V1 = Grundsätze, V23 = Wachgewerbe |
| DGUV Regel 100-xxx | Handlungshilfen (empfohlen) | R 100-001 allg. Pflichten |
| DGUV Information 2xx-xxx | Erläuterungen, Leitfäden | I 211-005 = Unterweisungen, I 215-410 = Büroarbeitsplätze |
| DGUV Grundsatz 3xx-xxx | Prüfgrundsätze | |

---

## Für den GBU-Bot relevant (Priorität beim Einlesen)

1. **DGUV Vorschrift 1** — Grundpflichten Arbeitgeber (Basis jeder GBU)
2. **DGUV Vorschrift 23** — spezifisch Wachgewerbe
3. **DGUV Information 211-005** — Unterweisungen (direkt CL-75-relevant)
4. **VBG Vorschriften** — sicherheitsbranchenspezifisch
5. **BG BAU Handlungshilfen** — UX-Vorbild Struktur (bereits da ✓)

---

> Wissensextraktion in MDs (für `knowledge/`) — separater Schritt, nach Tool-Stabilisierung.
