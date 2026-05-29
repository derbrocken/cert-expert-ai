# Schreibanleitung — Risikobewertung

Block: `{GB_RISIKOBEWERTUNG}` (analoge SK-/EC-Blöcke folgen demselben Muster).

## Bewertungsmatrix (intern)

3×3-Matrix. Jede Gefährdung erhält einen Wert für Eintrittwahrscheinlichkeit
und einen Wert für Schadensschwere. Daraus ergibt sich das Gesamtrisiko.

| Wahrscheinlichkeit | Schwere gering | Schwere mittel | Schwere hoch |
|---|---|---|---|
| Gering             | niedrig | niedrig | mittel |
| Mittel             | niedrig | mittel  | hoch   |
| Hoch               | mittel  | hoch    | hoch   |

## Schreibstruktur pro Gefährdung

Für jede in `{GB_GEFAEHRDUNGEN}` benannte Gefährdung genau **einen** Eintrag
in dieser Form (Plain Text, keine Markdown-Pipe-Tabellen):

```
Gefährdung: <Kurzname>
Kategorie:  <Publikum | Örtlichkeit | Personal | Umstände | …>
Wahrscheinlichkeit: <gering | mittel | hoch>  — <1 Satz Begründung aus Input>
Schwere:           <gering | mittel | hoch>  — <1 Satz Begründung>
Gesamtrisiko:      <niedrig | mittel | hoch>
```

## Pflichten

- **Vollständigkeit ist Pflicht — kein Ermessen.** Jede einzelne in
  `{GB_GEFAEHRDUNGEN}` namentlich aufgeführte Gefährdung **muss** in
  `{GB_RISIKOBEWERTUNG}` mit **identischer Bezeichnung** erneut erscheinen
  und dort vollständig bewertet werden (Kategorie, Wahrscheinlichkeit,
  Schwere, Gesamtrisiko).
  - Reihenfolge: dieselbe Reihenfolge wie in `{GB_GEFAEHRDUNGEN}`.
  - Wortlaut: identische Bezeichnung — kein Umformulieren, kein
    „Zusammenfassen", kein Auslassen aus Platzgründen.
  - Wenn die Bewertung für eine konkrete Gefährdung nicht aus dem Input
    ableitbar ist, wird sie trotzdem in `{GB_RISIKOBEWERTUNG}` aufgeführt;
    die Bewertungsfelder enthalten dann `[OFFENER PUNKT]` mit Begründung.
- **Inputtreue**: Begründungen beziehen sich auf das, was im Input steht
  (z. B. `expected_attendees`, `venue_capacity`, `alcohol_served`).
- **Keine erfundenen Zahlen**: keine Prozentangaben, keine RPZ, keine
  Schätzungen über Anzahl betroffener Personen, wenn Input fehlt.

## Selbstprüfung vor Ausgabe

Vor der Rückgabe der JSON-Antwort muss der Bot prüfen:

1. Liste alle Gefährdungs-Kurznamen, die in `{GB_GEFAEHRDUNGEN}` namentlich
   stehen.
2. Liste alle `Gefährdung:`-Zeilen, die in `{GB_RISIKOBEWERTUNG}` stehen.
3. Wenn (1) ⊄ (2): das ist ein Pflichtfehler — die fehlende Gefährdung muss
   in `{GB_RISIKOBEWERTUNG}` ergänzt werden, bevor die Antwort ausgegeben
   wird.

## Was niemals erlaubt ist

- Eine Gefährdung mit „Wahrscheinlichkeit: nicht bekannt" als bewertet ausgeben
  → in dem Fall: `[OFFENER PUNKT]`.
- Pauschalsätze wie „Restrisiko vernachlässigbar" ohne Begründung.
- Bewertungen, die Maßnahmen schon vorwegnehmen („Risiko hoch, aber durch
  Maßnahmen reduziert auf niedrig") — Restrisiko gehört ggf. separat in
  `{GB_SCHUTZMASSNAHMEN}` als Hinweis, nicht in die Bewertung.
