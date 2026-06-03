# DIN 77200 — Agentenregeln

Regeln für KI-Agenten, Cert-Expert-Bots, Tool 1 (Vorlagen/Steuerung), Tool 2 (Projektakten).

---

## Retrieval-Reihenfolge

1. **Governance** — `Governance/DIN 77200/` nur für Architektur/Meta, nicht für Fachnormtext.
2. **Normteil** — `DIN 77200-1/` oder `DIN 77200-2/` je nach Frage.
3. **Profil-first** — bei Qualifikation zuerst Anforderungsprofil, dann **`qualifications/` (V2+)**.
4. **V1 ergänzend** — `qualifikationssystem/01`–`05` nur für Baustein-Tiefe, nicht für neue Matrix/Codes.
5. **Examples last** — `10_examples/` nur für ausgefüllte Referenzfälle, nicht als Normvorlage.

Ordner V1/V2: [[QUALIFICATION_V1_V2]]

---

## Pfad-Regeln

| Aktion | Regel |
|--------|-------|
| Neue Normvorlage Anhang A | `knowledge/1_standards/DIN 77200-1/anforderungsprofile/` |
| Neue Normvorlage Anhang C | `knowledge/1_standards/DIN 77200-2/anforderungsprofile/` |
| Qualifikationslogik (V2+, Matrix, Katalog) | `knowledge/1_standards/DIN 77200-1/qualifications/` |
| Qualifikationslogik (V1, Bausteine 01–05) | `knowledge/1_standards/DIN 77200-1/qualifikationssystem/` — Legacy, parallel |
| Governance-Dokument | `knowledge/1_standards/Governance/DIN 77200/` |
| **Verboten** | `knowledge/standards/` (Root), Fachinhalte unter `Governance/` |

---

## Inhaltliche Regeln

- **Anforderungsprofil** = Tätigkeit + Stufe A/B/C + Erbringen/AG-Erhöhung/Bemerkung — **keine** Ersthelfer/Brandschutz/Führerschein.
- **Qualifikationssystem** = Nachweise, Pflichtqualifikationen, SDL-Freigabe — getrennt vom Profil.
- **Keine Mitarbeiter-Gesamtliste** in Knowledge-Standards erzeugen.
- **Primärquelle** — Stufen und Tätigkeitstexte gegen DIN-PDF verifizieren (Hinweis in Vorlagen).

---

## Generator

`scripts/generate_anforderungsprofile.py` schreibt nach:

- `knowledge/1_standards/DIN 77200-1/anforderungsprofile/` (77200-1-SDL)
- `knowledge/1_standards/DIN 77200-2/anforderungsprofile/` (77200-2-SDL)

Nicht nach `Governance/DIN 77200/`.

---

## Dubletten vermeiden

- Keine Kopie von Vorlagen nach `10_examples/anforderungsprofile/`.
- Keine parallelen Ordner für dieselben Anforderungsprofile außerhalb der normzentrierten Pfade.
