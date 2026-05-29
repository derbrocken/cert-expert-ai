<!--
Curated operational knowledge file for event-security risk assessment generation.
Use as source material for qualified Gefährdungsbeurteilungen, Sicherheitskonzepte,
Einsatzkonzepte and objekt-/veranstaltungsbezogene Dienstanweisungen.
Language: German. Scope: Veranstaltungsschutz / Event Security.
-->

# crowd_dynamics.md

## Zweck

Diese Datei beschreibt Crowd-Dynamics als eigenes Risikofeld für Gefährdungsbeurteilungen im Veranstaltungsschutz. Ziel ist, dass das Tool nicht nur klassische Einzelgefahren erkennt, sondern auch dynamische Risiken aus Dichte, Bewegung, Informationslage, Raumlayout, Publikumserwartung, Emotion, Wartezeit und Steuerung ableitet.

Crowd-Dynamics bedeutet hier: Wie sich Menschenmengen in bestimmten Räumen, Phasen und Situationen bewegen, verdichten, warten, reagieren, ausweichen, zurückströmen oder kollektiv auf Informationen, Gerüchte, Engstellen, Verzögerungen, Programmpunkte und Notfälle reagieren.

## Grundprinzip

Die Gefährdung entsteht selten nur durch die Anzahl der Menschen. Kritisch wird die Lage, wenn Personenanzahl, verfügbare Fläche, Wegeführung, Informationsdefizite, Gegenströme, Wartezeiten, Attraktionen, Alkohol, schlechte Sicht, Stress oder unklare Zuständigkeiten zusammenkommen.

Das Tool soll deshalb immer phasenbezogen prüfen:

```yaml
crowd_phases:
  ingress: "Anreise, Zugang, Warteschlange, Ticket-/Taschenkontrolle, Einlass, erste Orientierung"
  circulation: "Bewegung innerhalb der Fläche, Bühne/Ring, Bar, Toiletten, Raucherbereich, Merch, VIP, Sanitätsstellen"
  egress: "regulärer Auslass, Abreise, ÖPNV/Parkplatz, Nachlaufkonflikte"
  emergency: "Evakuierung, Teilräumung, Sperrung, Lageunterbrechung, Panik-/Gerüchtelage, Wetter-/Brand-/Gewaltlage"
```

## Aktivierungslogik für das Tool

Aktiviere dieses Pattern bei:

- Veranstaltungen mit erwarteter Personenverdichtung oder wechselnden Besucherströmen.
- Einlass- oder Auslassphasen mit Warteschlangen.
- Bewegungen zwischen Programmpunkten, Bühnen, Ring, Bars, Toiletten, Raucherbereichen oder Parkplätzen.
- Unklarer Besucherzahl, freiem Eintritt, Tageskasse, Sonderaktionen oder nicht-ticketiertem Umfeld.
- Hoher emotionaler Bindung an Programmpunkte oder Performer.
- Publikum, das ortsunkundig ist oder bei Dunkelheit/Schlechtwetter orientierungsschwächer wird.
- Engstellen, Gegenströmen, Kreuzungen, Treppen, Türen, schmalen Fluren, Hindernissen.
- Alkohol-/Drogenbezug, Ermüdung, Hitze, Kälte, Wartezeiten oder Frustration.
- Fehlender Beschilderung, fehlender Kommunikation oder widersprüchlichen Durchsagen.

## Erforderliche Eingabedaten

```yaml
crowd_input_questions:
  attendance:
    - "Wie viele Besucher werden maximal erwartet?"
    - "Wie viele sind gleichzeitig vor Ort?"
    - "Gibt es Ticketverkauf, Gästeliste, Tageskasse, freie Zugänglichkeit oder Begleitpersonen?"
  audience_profile:
    - "Altersspanne, Ortskundigkeit, Familien/Minderjährige, mobilitätseingeschränkte Personen?"
    - "Wie emotional/enthusiastisch ist das Publikum?"
    - "Gibt es bekannte Szenen, Fangruppen oder Rivalitäten?"
  event_timeline:
    - "Wann sind Peak-Arrival, Programmhöhepunkt, Pausen, Ausschankspitzen, Auslass?"
    - "Gibt es mehrere gleichzeitige Programmpunkte oder Wechsel?"
  site_layout:
    - "Wo sind Eingänge, Ausgänge, Notausgänge, Flucht-/Rettungswege?"
    - "Wo entstehen natürliche Sammelpunkte?"
    - "Gibt es tote Enden, Sackgassen, Gegenströme, Kreuzungen?"
  facilities:
    - "Wo befinden sich Toiletten, Bar, Raucherbereich, Garderobe, Merch, Sanitätsdienst?"
    - "Reichen diese für Besucherzahl und Spitzenzeiten aus?"
  information:
    - "Welche Beschilderung, Durchsagen, Social-Media-/Ticketinformationen gibt es?"
    - "Sind Regeln, Wege, Wartebereiche und Ausgänge klar erkennbar?"
  controls:
    - "Welche Absperrungen, Schleusen, Ordnerpositionen, Einlassstopps und Notfallrouten sind geplant?"
  monitoring:
    - "Wer beobachtet Dichte, Warteschlangen, Stimmung und kritische Punkte?"
```

## Zentrale Risikofaktoren

```yaml
risk_factors:
  design:
    - "zu kleine Eingänge/Ausgänge"
    - "schmale Flure, Türen oder Treppen"
    - "Sackgassen und unklare Wegeführung"
    - "Attraktionen direkt an Engstellen"
    - "Bar/Toilette/Garderobe erzeugt Querströme"
    - "Hindernisse in Bewegungsflächen"
    - "unzureichende Beleuchtung"
  information:
    - "unklare oder fehlende Beschilderung"
    - "widersprüchliche Anweisungen"
    - "fehlende Vorabinformation zu Einlass, Verboten, Wartezeiten, Taschenkontrolle"
    - "keine Echtzeitkommunikation bei Verzögerungen"
  management:
    - "keine klare Verantwortlichkeit"
    - "zu wenig Sicherheits-/Ordnerpersonal an Hotspots"
    - "kein Einlass-/Auslassmonitoring"
    - "keine definierten Schwellwerte für Einlassstop, Umleitung, Nachsteuerung"
    - "keine abgestimmten Meldewege"
  behaviour:
    - "Vordrängen bei Öffnung"
    - "plötzlicher Richtungswechsel bei Programmhöhepunkt"
    - "Menschen warten auf Freunde an Ein-/Ausgängen"
    - "Klettern auf Strukturen für bessere Sicht"
    - "Rückstrom wegen Zugabe, Streit, Gerücht, Verlustgegenstand"
```

## Typische Gefährdungen

- Gedränge und Druck an festen Strukturen, Türen, Absperrungen, Bars oder Bühnen-/Ringnähe.
- Sturz und Überlaufen/Übertreten von Personen bei Dichte und Bewegung.
- Gegenströme und Kreuzströme in schmalen Bereichen.
- Stau nach Kontrollpunkten, wenn der Nachbereich zu klein ist.
- Blockierte Flucht- und Rettungswege durch Warteschlangen oder Treffpunkte.
- Verzögerte Reaktion in Notfällen wegen schlechter Orientierung oder mangelnder Information.
- Frustration und Aggression durch lange Wartezeiten, unklare Regeln oder gefühlte Ungerechtigkeit.
- Überforderung des Sicherheitsdienstes durch gleichzeitige Besuchersteuerung und Konfliktbearbeitung.
- Fehlgeleitete Bewegung durch falsche Beschilderung, schlechte Durchsagen oder Gerüchte.

## Frühindikatoren

```yaml
early_warning_indicators:
  density:
    - "Personen können Bewegungsrichtung kaum selbst wählen"
    - "Stop-and-go-Bewegung"
    - "sichtbares Drücken gegen Barriere/Tür"
    - "Besucher weichen auf Rettungswege aus"
  flow:
    - "Gegenströme entstehen"
    - "Querströme an Bar/Toilette/Garderobe"
    - "Warteschlange wächst über definierten Bereich hinaus"
    - "Einlassbereich füllt sich schneller als Abfluss in Veranstaltungsfläche"
  behaviour:
    - "Vordrängen"
    - "Klettern"
    - "Unruhe wegen Wartezeit"
    - "Besucher fragen wiederholt nach Wegen"
    - "Personen bleiben in Durchgängen stehen"
  information:
    - "widersprüchliche Aussagen verschiedener Kräfte"
    - "Durchsagen nicht hörbar"
    - "Beschilderung wird ignoriert oder nicht verstanden"
  environment:
    - "Dunkelheit, Regen, Kälte, Hitze, rutschiger Boden"
    - "technische Ausfälle bei Licht, Einlasssystem, Beschallung"
```

## Präventive Maßnahmen

```yaml
preventive_controls:
  planning:
    - "Besucherzahl, zeitliche Peaks und Bewegungsphasen vorab abschätzen."
    - "Lageplan mit Eingängen, Ausgängen, Notausgängen, Kontrollstellen, Hotspots und Personalpositionen erstellen."
    - "Bereiche in Zonen gliedern: Ankunft, Einlass, Veranstaltungsfläche, Versorgung, Sanitär, Auslass, Außenbereich."
    - "Kritische Punkte vor Veranstaltungsbeginn begehen."
  design:
    - "Wege freihalten und Hindernisse aus Bewegungsflächen entfernen."
    - "Warteschlangen so anlegen, dass Flucht-/Rettungswege frei bleiben."
    - "Bar, Toiletten, Raucherbereiche und Garderobe nicht als Engstellen wirken lassen."
    - "Rückstauflächen hinter Kontrollpunkten einplanen."
  information:
    - "Klare Beschilderung zu Eingang, Ausgang, Toiletten, Bar, Sanitätsdienst und Notausgängen."
    - "Vorabkommunikation zu Einlasszeiten, verbotenen Gegenständen, Taschenkontrolle und Ticketpflicht."
    - "Einheitliche Durchsagen und einheitliche Sprache der Sicherheitskräfte."
  management:
    - "Schwellwerte definieren: Wann wird Einlass verlangsamt/gestoppt? Wann wird umgeleitet? Wer entscheidet?"
    - "Sicherheitskräfte an Hotspots positionieren und mit klarer Aufgabe briefen."
    - "Dichte und Warteschlangen aktiv beobachten."
    - "Eskalationsweg an Veranstalter, Sanitätsdienst, Polizei festlegen."
  contingency:
    - "Alternative Wege, Ausweichflächen und Sammelpunkte festlegen."
    - "Notfallkommunikation vorbereiten."
    - "Ausfall von Licht, Einlasssystem oder Barriereplanung mitdenken."
```

## Dynamische Maßnahmen

- Einlass verlangsamen oder temporär stoppen, wenn Nachbereich überlastet.
- Besucher aktiv weiterleiten, damit Eingangs-/Ausgangsbereiche frei bleiben.
- Warteschlangen umlenken, öffnen oder teilen.
- Gegenströme vermeiden: temporäre Einbahnführung oder getrennte Wege.
- Bar/Toilette/Raucherbereich bei Überfüllung temporär regulieren.
- Bei Programmhöhepunkten zusätzliche Kräfte an erwarteten Bewegungsachsen positionieren.
- Bei Auslass nicht nur Türbereich, sondern Außenbereich, Parkplatz und ÖPNV-Anschluss mitdenken.
- Bei Unruhe wegen Wartezeit sofort kommunizieren: Grund, erwartete Dauer, alternative Wege, Verhaltenserwartung.

## Tool-Regeln für die Generierung

```yaml
generation_rules:
  - "Crowd-Risiko immer phasenbezogen ausgeben: ingress, circulation, egress, emergency."
  - "Nicht nur Besucherzahl bewerten; immer Raum, Fluss, Information und Management einbeziehen."
  - "Bei fehlenden Kapazitätsangaben keine Scheingenauigkeit erzeugen; stattdessen Nachforderung und konservative Maßnahme."
  - "Wenn Kontrollprozesse geplant sind, immer Rückstau- und Überfüllungsrisiko prüfen."
  - "Wenn Alkohol, Emotion oder Rivalität vorliegt, crowd_dynamics mit aggressive_groups und alcohol_related_conflicts verknüpfen."
  - "Bei unklaren Zuständigkeiten immer Kommunikations- und Entscheidungsstruktur als Maßnahme aufnehmen."
```

## Mindestoutput in der Gefährdungsbeurteilung

- Beschreibung der erwarteten Personenströme nach Phase.
- Gefährdungen aus Dichte, Bewegung, Gegenstrom, Wartezeit, Orientierung und Informationslage.
- Betroffene Personengruppen.
- Bestehende Maßnahmen.
- Zusätzliche Maßnahmen.
- Zuständigkeiten und Schwellwerte.
- Restrisiko und dynamische Nachsteuerung.

## Beispieltextbaustein

Die Besucherbewegungen sind phasenbezogen zu betrachten. Kritische Phasen sind insbesondere Einlass, Pausen, Bewegungen zu Bar/Toiletten sowie der Auslass nach Veranstaltungsende. Zur Risikoreduzierung werden Wege freigehalten, Warteschlangen so geführt, dass Rettungswege nicht blockiert werden, und kritische Punkte durch Sicherheitskräfte überwacht. Bei zunehmender Verdichtung oder Rückstau wird der Einlass verlangsamt oder temporär gestoppt und Besucher werden aktiv umgeleitet.

## Quellen und Leitlinien

- HSE: Managing crowds safely; Assess crowd safety risks; Put crowd controls in place.
- SGSA: Green Guide und SG03 Event Safety Management.
- GOV.UK / Cabinet Office: Understanding Crowd Behaviours.
- DGUV Information 215-310: Sicherheit bei Veranstaltungen und Produktionen.
- NRW Orientierungsrahmen: Sicherheitskonzept basiert auf individueller Gefährdungs- und Risikoanalyse.

URLs:
- DGUV Information 215-310: https://publikationen.dguv.de/regelwerk/dguv-informationen/596/sicherheit-bei-veranstaltungen-und-produktion
- HSE Managing Crowds Safely: https://www.hse.gov.uk/event-safety/crowd-management.htm
- HSE Crowd Controls: https://www.hse.gov.uk/event-safety/crowd-management-controls.htm
- HSE Assess Crowd Safety Risks: https://www.hse.gov.uk/event-safety/crowd-management-assess.htm
- HSE Managing Crowds Safely publication: https://www.hse.gov.uk/pubns/indg142.htm
- SGSA Green Guide: https://sgsa.org.uk/document/greenguide/
- SGSA SG03 Event Safety Management: https://sgsa.org.uk/wp-content/uploads/2021/09/SG03-Event-Safety-Management-Digital-Edition.pdf
- GOV.UK Understanding Crowd Behaviours: https://www.gov.uk/government/publications/understanding-crowd-behaviours-documents
- Cabinet Office Understanding Crowd Behaviours Supporting Evidence: https://assets.publishing.service.gov.uk/media/5a7b2883e5274a34770e9d1d/understanding_crowd_behaviour-supporting-evidence.pdf
- Orientierungsrahmen NRW Großveranstaltungen: https://www.im.nrw/sites/default/files/documents/2017-11/grossveranstaltungen_orientierungsrahmen_druckversion.pdf
