# DIN 77200 — Architektur

---

## Schichtenmodell

| Schicht | Pfad | Inhalt |
|---------|------|--------|
| **Governance** | `1_standards/Governance/DIN 77200/` | Architektur, Roadmap, Agentenregeln — **kein Fachwissen** |
| **Norm 77200-1** | `1_standards/DIN 77200-1/` | CEKS-Module, Anhang-A-Vorlagen, Qualifikationssystem |
| **Norm 77200-2** | `1_standards/DIN 77200-2/` | Kap.-5–8-Module, Anhang-C-Vorlagen |
| **SDL** | `3_sdls/<slug>/` | Einsatzkontext, keine Normvorlagen duplizieren |
| **Examples** | `10_examples/` | Ausgefüllte Referenzprojekte |
| **Inputs** | `inputs/raw_standards/` | Primärquellen (PDF) — nicht RAG-Kern |

---

## Entscheidung: Wo liegt neuer Inhalt?

```
Neuer DIN-77200-Inhalt?
  ├─ Governance / Meta / Roadmap?     → Governance/DIN 77200/
  ├─ Nur DIN 77200-1?                 → DIN 77200-1/ (+ Unterordner)
  ├─ Nur DIN 77200-2?                 → DIN 77200-2/ (+ Unterordner)
  ├─ Ausgefülltes Projekt?            → 10_examples/
  └─ SDL-spezifischer Kontext?        → 3_sdls/
```

---

## Dokumenttypen (normzentriert)

| Dokumenttyp | Ablage 77200-1 | Ablage 77200-2 |
|-------------|----------------|----------------|
| Anforderungsprofil (Vorlage) | `anforderungsprofile/` (Anhang A) | `anforderungsprofile/` (Anhang C) |
| Qualifikationssystem V1 (Legacy) | `qualifikationssystem/` | Bausteine 01–05 |
| Qualifikationssystem V2+ | `qualifications/` | Katalog, Matrix — **aktueller Arbeitsstand** |
| CEKS-Modul | `*.md` (overview, Qualifikation, …) | `*.md` (Übersicht, Kap. 5–8) |
| Dienstanweisung (Standard) | `Dienstanweisungen.md` | objektbezogen über 77200-2-Module |
| Weiterbildung | `Weiterbildung.md` | Kap.-5–8-Ergänzungen in Modulen |

Unterscheidung **innerhalb der Datei:** `Norm-SDL`, `Referenz Anhang A/C`, YAML-Metadaten.

---

## Verworfene Strukturidee (2026-05)

Zentralisierung aller Dokumenttypen unter `din_77200/<dokumenttyp>/` — **nicht umgesetzt**.  
Begründung: Vault bleibt normzentriert; Governance liegt unter `Governance/DIN 77200/`.

Details: [[MIGRATION#Verworfene Strukturidee]]

---

## Verknüpfungen

- Master-Index 77200-1: [[../../DIN 77200-1/overview|overview]]
- Anforderungsprofil-Modul: [[../../DIN 77200-1/Anforderungsprofile|Anforderungsprofile]]
- Qualifikationssystem V2+: [[../../DIN 77200-1/qualifications/README|qualifications]]
- Qualifikationssystem V1: [[../../DIN 77200-1/qualifikationssystem/README|qualifikationssystem]]
- Ordnerentscheidung: [[QUALIFICATION_V1_V2]]
