# DIN 77200 — Agentenregeln

Regeln für KI-Agenten, Cert-Expert-Bots, Tool 1 (Vorlagen/Steuerung), Tool 2 (Projektakten).

---

## Retrieval-Reihenfolge

1. **Governance** — `din_77200/` nur für Architektur/Meta, nicht für Fachnormtext.
2. **Normteil** — `DIN 77200-1/` oder `DIN 77200-2/` je nach Frage.
3. **Profil-first** — bei Qualifikation zuerst Anforderungsprofil, dann Qualifikationssystem.
4. **Examples last** — `10_examples/` nur für ausgefüllte Referenzfälle, nicht als Normvorlage.

---

## Pfad-Regeln

| Aktion | Regel |
|--------|-------|
| Neue Normvorlage Anhang A | `DIN 77200-1/anforderungsprofile/` |
| Neue Normvorlage Anhang C | `DIN 77200-2/anforderungsprofile/` |
| Qualifikationslogik | `DIN 77200-1/qualifikationssystem/` |
| Governance-Dokument | `din_77200/` |
| **Verboten** | `knowledge/standards/` (Root), `din_77200/<dokumenttyp>/` für Fachinhalte |

---

## Inhaltliche Regeln

- **Anforderungsprofil** = Tätigkeit + Stufe A/B/C + Erbringen/AG-Erhöhung/Bemerkung — **keine** Ersthelfer/Brandschutz/Führerschein.
- **Qualifikationssystem** = Nachweise, Pflichtqualifikationen, SDL-Freigabe — getrennt vom Profil.
- **Keine Mitarbeiter-Gesamtliste** in Knowledge-Standards erzeugen.
- **Primärquelle** — Stufen und Tätigkeitstexte gegen DIN-PDF verifizieren (Hinweis in Vorlagen).

---

## Generator

`scripts/generate_anforderungsprofile.py` schreibt nach:

- `DIN 77200-1/anforderungsprofile/` (77200-1-SDL)
- `DIN 77200-2/anforderungsprofile/` (77200-2-SDL)

Nicht nach `din_77200/`.

---

## Dubletten vermeiden

- Keine Kopie von Vorlagen nach `10_examples/anforderungsprofile/`.
- Keine parallelen Ordner `DIN 77200-1/` und `din_77200/anforderungsprofile/` für dieselben Dateien.
