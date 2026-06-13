# OneDrive — Bereinigungsvorschlag `02_QM_und_Wissen`

> Vorschlag, noch nichts verschoben. Mark prüft und gibt frei.
> Stand: 2026-06-10

---

## Problem

Aktuell drei Parallelstrukturen ohne klare Trennung:

| Ordner | Inhalt | Problem |
|--------|--------|---------|
| `Knowlege base/` | Normen, Prozesse, Strategie, Schulungen | Tippfehler, zu breit |
| `Template/` (_InnoSecure_alt) | QMH, DIN 77200-1/-2, Personalakte, DEKRA | Gold, aber versteckt + altes Branding |
| `QM/` | Drafts, E-Mail-Templates, Strategie, Betriebsdateien | Alles gemischt, keine Logik |

---

## Vorschlag — neue Struktur

```
02_QM_und_Wissen/
  01_Normen/
      DGUV/                 ← bereits gut befüllt
        bg_bau_handlungsh_gb/
        215-410.pdf
        Arbeitsschutz.pdf
        ASR-A6.pdf
        VBG/                ← neu (wenn VBG-Material kommt)
      ISO/
      DIN_77200/
      AZAV/
  02_Vorlagen/              ← alles was mit Kunden rausgeht
      QMH/
      Prozesse_ISO_9001/
      DIN_77200-1/
      DIN_77200-2_Asyl/
      Arbeitsschutz_GBU/    ← GBU-Modul kommt hier rein
      Personalakte/
      DEKRA/
      Sicherheitskonzepte/
  03_Schulungen/
  04_Operativ/              ← eigene laufende Arbeit
      Drafts/
      E-Mail_Templates/
      Strategie/
  _Archiv/                  ← bereits da, bleibt
```

---

## Was verschoben werden müsste

| Von | Nach | Priorität |
|-----|------|-----------|
| `Template/_InnoSecure_alt/*` | `02_Vorlagen/` (je Unterordner) | Hoch — das ist das Kern-Gold |
| `Knowlege base/Normen & Standards/` | `01_Normen/` | Hoch |
| `QM/drafts/` | `04_Operativ/Drafts/` | Mittel |
| `QM/E-Mail Template/` | `04_Operativ/E-Mail_Templates/` | Mittel |
| `QM/Strategie/` | `04_Operativ/Strategie/` | Mittel |
| `QM/` (lose Dateien) | `04_Operativ/` | Mittel |
| `Knowlege base/Prozesse/` | bleibt oder → `04_Operativ/` | Niedrig |
| `Knowlege base/Schulungen & Kurse/` | `03_Schulungen/` | Niedrig |
| `Knowlege base/Strategie & Methoden/` | `04_Operativ/Strategie/` | Niedrig |
| `Knowlege base/Sicherheitskonzepte (Muster)/` | `02_Vorlagen/Sicherheitskonzepte/` | Niedrig |
| `Knowlege base/_InnoSecure_QM_alt/` | `_Archiv/` | Niedrig |

---

## Nicht anfassen

- `_Archiv_2026-06/` — bleibt, ist Migrations-Müll, schadet nicht
- Alles in `01_Kundenprojekte/` bis `07_` — andere Ordner, kein Thema hier

---

## Nächster Schritt

Mark gibt Struktur frei → ich dokumentiere Schritt-für-Schritt-Anleitung zum Verschieben
(OneDrive selbst kann ich nicht direkt umstrukturieren — muss manuell oder per Power Automate)
