# OFFENER PUNKT — Regeln

`[OFFENER PUNKT]` ist der einzige zulässige Mechanismus, um fehlende
Informationen zu markieren. Er ist kein Fehlerzustand — er ist Teil der
ordnungsgemäßen Dokumentation.

## Wann ein OFFENER PUNKT zwingend ist

- Ein Pflichtfeld des Blueprints fehlt oder ist leer.
- Ein kritischer Trigger des Blueprints ist erfüllt
  (z. B. `venue_exits == 0`, `expected_attendees > venue_capacity`).
- Eine fachliche Aussage würde Erfindung erfordern.
- Eine Freigabe, ein Sanitätsdienst oder eine sicherheitsrelevante Person
  ist nicht benannt, obwohl das Dokument darüber Aussagen treffen müsste.

## Format

```
[OFFENER PUNKT] <was fehlt> — <warum es relevant ist>
```

Jeder OFFENE PUNKT ist:

- **konkret** — beschreibt genau ein fehlendes Element,
- **begründet** — sagt, warum die Lücke für dieses Dokument relevant ist,
- **handlungsorientiert** — ein Verantwortlicher muss daraus eine Aufgabe
  ableiten können.

## Wo OFFENE PUNKTE erscheinen

- Direkt im betroffenen Abschnitt als Satz oder Listeneintrag.
- Zusammenfassend im AI-Block `*_OFFENE_PUNKTE` als nummerierte Liste.
- Im JSON-Feld `open_points` als Array von Strings.

## Was niemals erlaubt ist

- Eine fehlende Information durch eine plausible Vermutung ersetzen.
- Einen OFFENEN PUNKT im Text setzen, aber im `open_points`-Array auslassen.
- `qa_status: "ok"` zurückgeben, wenn auch nur ein OFFENER PUNKT existiert.
- Mehrere identische OFFENE PUNKTE auflisten — Duplikate sind zu konsolidieren.

## Quellenangabe (Flow-Modus)

Stammt der OFFENE PUNKT aus einem fehlenden Abschnitt eines Upstream-Dokuments,
muss die Quelle benannt werden:

```
[OFFENER PUNKT] (aus Sicherheitskonzept: Abschnitt Schutzmaßnahmen fehlt)
```
