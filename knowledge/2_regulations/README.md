# knowledge/2_regulations/

Rechtliche Regelwerke, Normen und Verordnungen als Orientierungsrahmen für
die inhaltliche Generierung.

---

## Regeln

- **Nur Überblick.** Keine Volltexte, keine kopierten Paragrafentexte.
  Der Bot soll Regelwerke strukturell kennen, aber niemals konkrete Paragrafennummern,
  Grenzwerte oder Messzahlen zitieren — außer diese stehen explizit im Input.

- **Ein Unterordner pro Regelwerk.** Jeder Ordner enthält `overview.md` als Basisdatei.
  Thematische Untermodule können bei Bedarf hinzugefügt werden.

- **Blueprint-selektiv.** Nicht alle Standards werden für jeden Blueprint geladen.
  Welche Standards ein Blueprint benötigt, ist in der Blueprint-Config definiert.

---

## Ordner

| Ordner | Inhalt |
|---|---|
| `arbschg/` | Arbeitsschutzgesetz — §5 Pflicht zur Gefährdungsbeurteilung |
| `dguv_v1/` | DGUV Vorschrift 1 — Grundsätze der Prävention, TOP-Prinzip |
| `VStättVO/` | Versammlungsstättenverordnung — relevant für Veranstaltungs-Blueprints |
| `bewachv/` | Bewachungsverordnung / §34a GewO — Sicherheitsgewerbe |
| `betrsichv/` | Betriebssicherheitsverordnung — relevant für Objekt-Blueprints |
| `ArbStättV/` | Arbeitsstättenverordnung — relevant für Unterkunfts-Blueprints |
| `din_vde/` | Relevante DIN/VDE-Normfamilien (Überblick, keine Nummern) |

---

## Dateiformat

Jede `overview.md` enthält:
1. Kurzbeschreibung des Regelwerks (2–3 Sätze)
2. Relevanz für Cert-Expert (warum ist es für GB/SK/EC wichtig?)
3. Strukturelle Kernaussagen (keine Paragrafenzitate)
4. Was der Bot daraus ableiten darf — und was nicht

**Maximale Größe:** ~400 Tokens pro `overview.md`
