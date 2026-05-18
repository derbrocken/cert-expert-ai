# OFFENER PUNKT — Anweisung

Verwende den Marker **wortwörtlich** so:

```
[OFFENER PUNKT] <was fehlt> — <warum es relevant ist>
```

Regeln:

- Marker exakt wie oben, immer in eckigen Klammern, immer Versalien.
- Im laufenden Text darf der Marker an passender Stelle eingebettet sein.
- **Jeder im Text gesetzte Marker MUSS zusätzlich im Array `open_points`
  als eigener String erscheinen.** Das ist keine Höflichkeit, sondern die
  Quelle der Wahrheit für die nachgelagerte QA. `open_points` darf nie
  weniger Einträge enthalten als die Summe der inline-Marker in allen
  Platzhalterwerten (`*_GEFAEHRDUNGEN`, `*_SCHUTZMASSNAHMEN`, etc.).
- Im AI-Block `*_OFFENE_PUNKTE` werden alle Punkte konsolidiert als
  nummerierte Liste wiederholt — der konsolidierte Block ist ein
  menschenlesbarer Spiegel des Arrays `open_points`, nicht eine
  Teilmenge davon:

```
1. [OFFENER PUNKT] Freigabe durch Auftraggeber ausstehend — Feld
   „Freigegeben von" ist leer.
2. [OFFENER PUNKT] Sanitätsdienst nicht im Input angegeben — bei
   Kampfsport zwingend zu klären.
```

- Wenn es keinen OFFENEN PUNKT gibt, lass den Text frei und setze
  `open_points = []` und `qa_status = "ok"`.

## Vollständigkeits-Selbstprüfung vor Ausgabe

Bevor du die JSON-Antwort zurückgibst, führst du diese Prüfung durch:

1. Sammle alle inline-Marker `[OFFENER PUNKT] …` aus jedem Platzhalter-
   Block (`*_TAETIGKEIT`, `*_GEFAEHRDUNGEN`, `*_RISIKOBEWERTUNG`,
   `*_SCHUTZMASSNAHMEN`, `*_VERANTWORTLICHKEITEN`).
2. Vergleiche diese Liste mit dem Inhalt des `*_OFFENE_PUNKTE`-Blocks
   und mit dem Array `open_points`.
3. Wenn eine Position fehlt, ergänze sie in **beidem** (im konsolidierten
   Block UND im Array). Das Array ist die maßgebliche Quelle.

## Konflikte

- Wenn auch nur ein OFFENER PUNKT existiert, ist `qa_status` immer
  `"review_required"`.
- Doppelte oder synonyme OFFENE PUNKTE konsolidierst du zu einem einzigen
  Eintrag (sowohl im Array als auch im `*_OFFENE_PUNKTE`-Block).
