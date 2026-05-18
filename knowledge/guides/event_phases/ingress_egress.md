<!--
Curated operational knowledge file for event-security risk assessment generation.
Use as source material for qualified Gefährdungsbeurteilungen, Sicherheitskonzepte,
Einsatzkonzepte and objekt-/veranstaltungsbezogene Dienstanweisungen.
Language: German. Scope: Veranstaltungsschutz / Event Security.
-->

# ingress_egress.md

## Zweck

Diese Datei beschreibt Risiken und Maßnahmen für Einlass, Zugang, Verlassen und Abströmen von Besuchern. Sie ist für Gefährdungsbeurteilungen besonders wichtig, weil viele kritische Situationen nicht während des Programms, sondern an Übergängen entstehen: Ankunft, Warteschlange, Kontrolle, Tür, Treppe, Flur, Ausgang, Parkplatz, ÖPNV und Außenbereich.

## Grundsatz

Einlass und Auslass sind als eigener Prozess zu bewerten, nicht nur als Türsituation. Entscheidend sind die gesamte Kette und ihre schwächsten Punkte:

```yaml
process_chain:
  arrival: "Anreise, Parkplatz, ÖPNV, Fußwege, Vorplatz"
  queue: "Warteschlange, Ticketkontrolle, Taschenkontrolle, Alters-/Zutrittsprüfung"
  threshold: "Tür, Schleuse, Drehkreuz, Treppe, Flur, Rampe"
  post_entry: "Orientierung nach Einlass, Verteilung in Fläche, Garderobe, Bar, Toiletten"
  egress: "Ausgang aus Veranstaltungsfläche, Garderobe, Außenbereich, Parkplatz/ÖPNV"
  exceptional_egress: "Notfall, Teilräumung, Ausfall, Gewaltlage, Brand, Wetter, Sperrung"
```

## Aktivierungslogik für das Tool

Aktiviere dieses Pattern bei:

- Jeder Veranstaltung mit kontrolliertem Einlass, Ticketprüfung, Taschenkontrolle, Gästeliste, Altersprüfung, Akkreditierung oder Sicherheitskontrolle.
- Erwarteten Besucher-Peaks vor Beginn, bei Pausen, nach Programmhöhepunkt oder nach Veranstaltungsende.
- Engen Eingängen, wenigen Ausgängen, Treppen, Fluren, Schleusen, unübersichtlichen Außenbereichen.
- Rückstaugefahr durch Security Search, Garderobe, Bar, Toiletten oder Kasse.
- Zeitdruck: Besucher kommen kurz vor Beginn; Programmbeginn motiviert zum Drängen.
- Unklarem Außenbereich: öffentlicher Raum, Straßenquerung, Parkplatz, ÖPNV, Nachbarschaft.
- Wetter, Dunkelheit, schlechte Beleuchtung, rutschigem Boden.
- Besonderen Besuchergruppen: Minderjährige, mobilitätseingeschränkte Personen, Familien, alkoholisierte Personen.

## Eingabedaten

```yaml
ingress_egress_input_questions:
  entry_points:
    - "Wie viele Eingänge gibt es und welche werden genutzt?"
    - "Wie breit sind Eingänge, Türen, Flure, Treppen, Zugänge?"
    - "Gibt es getrennte Eingänge für VIP, Sportler/Künstler, Personal, Besucher?"
  exit_points:
    - "Wie viele reguläre Ausgänge und Notausgänge gibt es?"
    - "Sind alle Ausgänge frei, sichtbar, beleuchtet und während der Veranstaltung nutzbar?"
    - "Wohin führen Ausgänge im Außenbereich?"
  controls:
    - "Welche Kontrollen finden statt: Ticket, Gästeliste, Alter, Tasche, Glas/Alkohol/Waffen?"
    - "Wie lange dauert eine Kontrolle realistisch pro Person?"
    - "Gibt es genug Platz vor und nach der Kontrolle?"
  timing:
    - "Wann wird geöffnet?"
    - "Wann beginnt der Hauptprogrammpunkt?"
    - "Wann sind Pausen und Ende?"
    - "Wird mit später Ankunft vieler Besucher gerechnet?"
  queue_management:
    - "Wo entstehen Warteschlangen?"
    - "Wer steuert Warteschlangen?"
    - "Blockieren Warteschlangen Rettungswege, Straßen, Nachbareingänge oder Treppen?"
  external_area:
    - "Sind Polizei/Ordnungsamt/Verkehrsbetriebe relevant?"
    - "Gibt es Parkplätze, Haltestellen, Taxizonen, Lieferverkehr, Nachbarschaft?"
  accessibility:
    - "Gibt es barrierefreie Wege, Ausweichrouten, Hilfe für mobilitätseingeschränkte Personen?"
```

## Typische Gefährdungen im Einlass

- Gedränge vor Tür, Treppe oder Schleuse.
- Rückstau durch zu langsame Ticket-/Taschenkontrolle.
- Drängen kurz vor Programmbeginn.
- Unruhe bei Einlassverweigerung, fehlendem Ticket, falscher Gästeliste, Alterskontrolle oder verbotenen Gegenständen.
- Warteschlange blockiert Flucht-/Rettungswege, öffentliche Verkehrsflächen oder Nachbareingänge.
- Besucher weichen unkontrolliert auf andere Zugänge aus.
- Sturz durch Dunkelheit, Nässe, Kabel, Kanten oder unklare Wegeführung.
- Aggression gegen Einlasspersonal durch Wartezeit, Regelunklarheit oder Alkoholisierung.
- Trennung von Gruppen/Familien und anschließende Suchbewegungen gegen den Fluss.

## Typische Gefährdungen im Auslass

- Gleichzeitiger Abstrom vieler Personen unmittelbar nach Ende.
- Engpass an Garderobe, Ausgang, Treppe, Tür oder Außenbereich.
- Begegnung gegnerischer Gruppen nach emotionalem Programmpunkt.
- Alkoholisierte oder ermüdete Besucher mit geringerer Aufmerksamkeit.
- Nachlaufende Konflikte vor der Location, am Parkplatz, an Haltestellen oder bei Imbissständen.
- Rückstrom wegen vergessener Gegenstände, Musikzugabe, Streit, Sanitätsfall, Freundessuche.
- Blockierte Ausgänge durch Raucher, wartende Freunde, Taxiwartende oder Abholer.
- Unklare Ausleitung bei Notfall oder Teilsperrung.

## Präventive Maßnahmen Einlass

```yaml
preventive_controls_ingress:
  before_opening:
    - "Vor Öffnung prüfen: alle Ausgänge frei, Rettungswege frei, Beleuchtung vorhanden, Personal in Position."
    - "Einlassbereich, Warteschlange und Nachbereich klar definieren."
    - "Hausregeln und verbotene Gegenstände sichtbar kommunizieren."
  queue_design:
    - "Warteschlange so führen, dass keine Rettungswege, Straßen, Treppen oder Nachbarzugänge blockiert werden."
    - "Rückstaufläche hinter der Kontrolle einplanen."
    - "Wenn nötig mehrere Kontrolllinien oder Vorsortierung einrichten."
  phased_arrival:
    - "Frühere Öffnung, Vorprogramm oder gestaffelte Kommunikation nutzen, um Peak zu entzerren."
    - "Ticket-/Gästelistenprobleme separat klären, damit Hauptlinie nicht blockiert."
  search_controls:
    - "Taschenkontrolle nur mit ausreichendem Personal und Stauraum durchführen."
    - "Surrender-/Abgabemöglichkeit für verbotene Gegenstände festlegen."
    - "Sicherheitskontrollen dürfen keine gefährliche Überfüllung erzeugen."
  staff_positioning:
    - "Eine Kraft steuert Linie, eine kontrolliert, eine beobachtet Umfeld und Stimmung."
    - "Einsatzleiter erreichbar und entscheidungsbefugt."
```

## Präventive Maßnahmen Auslass

```yaml
preventive_controls_egress:
  before_end:
    - "Ausgangsbereiche vor Ende räumen und freihalten."
    - "Garderobe, Treppen, Türen und Außenbereich besetzen."
    - "Konfliktparteien oder Gruppen mit Risiko zeitlich/räumlich entzerren."
  information:
    - "Durchsagen/Personalhinweise: Ausgänge, Garderobe, ÖPNV, Parkplatz."
    - "Bei Verzögerung klare Information geben, um Druck und Frustration zu vermeiden."
  flow_management:
    - "Keine stehenden Gruppen direkt im Ausgang zulassen."
    - "Außenbereich mitdenken: Abholer, Taxi, Raucher, Imbiss, Nachbarschaft."
    - "Bei Überfüllung Abstrom drosseln und alternative Wege öffnen, wenn sicher."
  post_event:
    - "Nachlaufende Konflikte beobachten."
    - "Sicherheitsdienst erst nach Entspannung der Außenlage reduzieren."
```

## Exceptional Egress / Notfallauslass

Das Tool soll zwischen regulärem Auslass und außergewöhnlichem Auslass unterscheiden. Außergewöhnlicher Auslass liegt vor bei Brand, Gewaltlage, Bombendrohung, Wetterlage, Stromausfall, technischer Störung, Panik-/Gerüchtelage, Ausfall eines Ausgangs oder polizeilicher Lage.

```yaml
exceptional_egress_controls:
  - "Vorab festlegen, wer Evakuierung/Teilräumung anordnet."
  - "Notausgänge frei, sichtbar, nutzbar und nicht zugestellt halten."
  - "Alternative Routen und Sammel-/Ausweichflächen festlegen."
  - "Sicherheitskräfte kennen ihre Positionen und Aufgaben."
  - "Kommunikation ruhig, eindeutig, handlungsorientiert."
  - "Keine Räumung in unklare oder gefährliche Außenlage ohne Lageabgleich, sofern zeitlich möglich."
```

## Dynamische Schwellwerte

```yaml
trigger_points:
  ingress_slowdown:
    - "Rückstau hinter Kontrolle"
    - "Warteschlange erreicht Rettungsweg/Straße/Treppe"
    - "sichtbarer Druck von hinten"
  ingress_stop:
    - "Nachbereich voll"
    - "Kontrollstelle verliert Übersicht"
    - "Gefahr für Personen durch Drücken oder Gedränge"
  open_additional_route:
    - "Hauptweg überlastet"
    - "alternative Route geprüft, beleuchtet, besetzt und sicher"
  call_event_lead:
    - "Gästelisten-/Ticketproblem blockiert Ablauf"
    - "Einlassverweigerung erzeugt Gruppe gegen Personal"
  call_police:
    - "akute Gewalt, Drohung, Waffe, Kontrollverlust, gefährliche Außenlage"
```

## Tool-Regeln

```yaml
generation_rules:
  - "Einlass und Auslass als eigene Prozessphasen ausgeben."
  - "Wenn Taschen-/Sicherheitskontrolle vorhanden ist, immer Rückstaurisiko prüfen."
  - "Wenn Außenbereich unbekannt ist, fehlende Information als offene Frage und Restrisiko aufnehmen."
  - "Wenn nur zwei Sicherheitsmitarbeiter geplant sind, kritisch prüfen, ob gleichzeitig Einlass, Innenraum, Konflikte und Auslass abgedeckt werden können."
  - "Bei K1/Kampfsport zusätzlich aggressive_groups und crowd_dynamics referenzieren."
```

## Mindestoutput in der Gefährdungsbeurteilung

- Einlassbeschreibung mit Kontrollpunkten und Wartebereichen.
- Auslassbeschreibung inklusive Außenbereich.
- Identifizierte Engstellen.
- Maßnahmen zur Steuerung.
- Zuständigkeiten.
- Schwellwerte für Nachsteuerung.
- Notfall-/Exceptional-Egress-Betrachtung.

## Beispieltextbaustein

Der Einlass ist als kritische Phase zu bewerten, da Ticket-/Taschenkontrolle und zeitgleiche Ankunft zu Rückstau und Drucksituationen führen können. Warteschlangen werden so geführt, dass Rettungswege frei bleiben. Vor Öffnung werden Ausgänge, Beleuchtung, Wege und Personalpositionen geprüft. Bei sichtbarer Verdichtung wird der Einlass verlangsamt oder temporär gestoppt. Der Auslass wird durch Sicherheitskräfte begleitet, damit Ausgangsbereiche freibleiben und mögliche Nachlaufkonflikte im Außenbereich frühzeitig erkannt werden.

## Quellen und Leitlinien

- HSE: Put crowd controls in place; Managing crowds safely.
- HSE: Assess crowd safety risks and identify hazards.
- SGSA: Green Guide; SG03 Event Safety Management.
- DGUV Information 215-310.
- Hessen/NRW Leitfäden Großveranstaltungen.

URLs:
- DGUV Information 215-310: https://publikationen.dguv.de/regelwerk/dguv-informationen/596/sicherheit-bei-veranstaltungen-und-produktion
- HSE Managing Crowds Safely: https://www.hse.gov.uk/event-safety/crowd-management.htm
- HSE Crowd Controls: https://www.hse.gov.uk/event-safety/crowd-management-controls.htm
- HSE Assess Crowd Safety Risks: https://www.hse.gov.uk/event-safety/crowd-management-assess.htm
- SGSA Green Guide: https://sgsa.org.uk/document/greenguide/
- SGSA SG03 Event Safety Management: https://sgsa.org.uk/wp-content/uploads/2021/09/SG03-Event-Safety-Management-Digital-Edition.pdf
- Orientierungsrahmen NRW Großveranstaltungen: https://www.im.nrw/sites/default/files/documents/2017-11/grossveranstaltungen_orientierungsrahmen_druckversion.pdf
- Hessen Leitfaden Sicherheit bei Großveranstaltungen: https://innen.hessen.de/sites/innen.hessen.de/files/2021-08/leitfaden_sicherheit_bei_grossveranstaltungen.pdf
