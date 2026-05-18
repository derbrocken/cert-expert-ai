# Blueprint-Sonderregeln — `gb_event_kampfsport`

Diese Regeln gelten **nur**, wenn der Blueprint `gb_event_kampfsport` aktiv ist.
Sie präzisieren die Produktregeln aus `rules/products/gb_rules.md` — sie
ersetzen sie nicht.

## Kampfsport-spezifische Pflichten

- Die Kampfsportart (`combat_sports_type`, z. B. „K1", „MMA", „Boxen",
  „Kickboxen") muss benannt sein. Fehlt sie, ist sie ein OFFENER PUNKT,
  weil Risiko- und Maßnahmenprofile je Disziplin unterschiedlich sind.
- Sanitätsdienst (`medical_service`) ist bei Vollkontaktsportarten
  zwingend zu klären. Fehlt die Angabe, ist sie ein OFFENER PUNKT — egal
  ob das Feld technisch als optional markiert ist.
- Notausgänge (`venue_exits`) müssen ≥ 1 sein. `0` oder fehlend → OFFENER PUNKT.
- `expected_attendees` darf `venue_capacity` nicht überschreiten. Bei
  Überschreitung → OFFENER PUNKT „Überbelegung".

## Risikoschwerpunkte (immer adressieren)

- **Aggressionspotenzial** im Zuschauerbereich bei intensiven Wettkämpfen.
- **Ring-/Kampfflächen-Umgebung**: Sicherheitsabstand, Absturzkanten,
  Übergriffe auf Athleten/Schiedsrichter.
- **Sportverletzungen** mit erhöhter Wahrscheinlichkeit (Sanitätsbereitschaft).
- **Alkohol- und Drogeneinfluss** bei Zuschauern, falls Ausschank stattfindet.
- **Crowd-Dynamik** beim Einlass, in Pausen und nach Hauptkampf.
- **Notfallabläufe**: Evakuierung, Brand, medizinischer Notfall im Ring.

Dies ist eine Themenliste — keine Vorgabe, alle Punkte gleich zu behandeln.
Wenn ein Punkt für den konkreten Input nicht zutrifft, nicht erfinden.

## Verboten in diesem Blueprint

- Erfundene Sicherheitskonzepte „nach K1-Verband"-Vorgabe.
- Konkrete Mindestabstände, Tatami-Maße, Ringgrößen, ohne dass sie im Input
  stehen.
- Annahmen zu Athletenkontrolle, Wiegeprozedur, Anti-Doping, sofern nicht im
  Input.
- Erwähnung spezifischer Versicherungssummen oder Haftungsobergrenzen.

## Ausgabe-Pflicht (AI-Blöcke)

Die folgenden sechs Platzhalter sind alle Pflicht und alle als String zu liefern:

```
GB_TAETIGKEIT
GB_GEFAEHRDUNGEN
GB_RISIKOBEWERTUNG
GB_SCHUTZMASSNAHMEN
GB_VERANTWORTLICHKEITEN
GB_OFFENE_PUNKTE
```
