# knowledge/10_examples/

Positiv-Beispiele für gut formulierten fachlichen Inhalt pro Inhaltsblock.
Dienen als Stil-Kalibrierung — nicht als Inhaltsvorgabe.

---

## Regeln

- **Kein echter Kundeninhalt.** Alle Beispiele sind fiktiv und anonymisiert.
  Keine echten Firmennamen, Adressen, Daten oder Personennamen.

- **1–3 Beispiele pro Block, nie mehr.** Zu viele Beispiele erhöhen den Kontext
  ohne Mehrwert. Qualität über Quantität.

- **Blueprint-selektiv.** Ein Kampfsport-Blueprint lädt
  `gb_gefährdungen/veranstaltungsschutz_kampfsport.md`.
  Ein Objektschutz-Blueprint lädt `gb_gefährdungen/objektschutz_standard.md`.
  Beide Dateien sind unabhängig und können mit verschiedenen Blueprints geteilt werden.

- **Stil zeigen, nicht Inhalt vorschreiben.** Beispiele demonstrieren Länge, Ton,
  Struktur und Detailtiefe — das Modell soll den Stil übernehmen, nicht den Inhalt.

---

## Namenskonvention

```
{block_typ}/{sdl_bereich}_{subtyp}.md
```

- `{block_typ}` = Platzhalter-Namespace in Kleinschreibung, z. B. `gb_tätigkeit`, `gb_gefährdungen`
- `{sdl_bereich}` = SDL-Ordnername, z. B. `veranstaltungsschutz`, `objektschutz`
- `{subtyp}` = SDL-Subtyp, z. B. `kampfsport`, `standard`, `festival`

Beispiele:
- `gb_gefährdungen/veranstaltungsschutz_kampfsport.md`
- `gb_gefährdungen/objektschutz_standard.md`
- `gb_risikobewertung/veranstaltungsschutz_kampfsport.md`

---

## Ordner (Inhaltsblöcke)

| Ordner | Block | Gilt für |
|---|---|---|
| `gb_tätigkeit/` | `{GB_TAETIGKEIT}` | Alle GB-Blueprints |
| `gb_gefährdungen/` | `{GB_GEFAEHRDUNGEN}` | Alle GB-Blueprints |
| `gb_risikobewertung/` | `{GB_RISIKOBEWERTUNG}` | Alle GB-Blueprints |
| `gb_schutzmassnahmen/` | `{GB_SCHUTZMASSNAHMEN}` | Alle GB-Blueprints |
| `sk_schutzziel/` | `{SK_SCHUTZZIEL}` | SK-Blueprints |
| `ec_einsatzbeschreibung/` | `{EC_EINSATZBESCHREIBUNG}` | EC-Blueprints |

Neue Ordner werden hinzugefügt, wenn neue Inhaltsblöcke oder Blueprints implementiert werden.

---

## Dateiformat

```markdown
# Beispiel: {Block} — {SDL-Bereich} / {Subtyp}

<!-- Kurze Beschreibung wofür dieses Beispiel steht -->

---

{Beispieltext hier — fiktiv, fachlich korrekt, ohne echte Kundendaten}
```

**Maximale Größe:** ~600 Tokens pro Beispieldatei
