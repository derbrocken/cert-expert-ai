<!--
Curated operational knowledge file for event-security risk assessment generation.
Use as source material for qualified Gefährdungsbeurteilungen, Sicherheitskonzepte,
Einsatzkonzepte and objekt-/veranstaltungsbezogene Dienstanweisungen.
Language: German. Scope: Veranstaltungsschutz / Event Security.
-->

# bottlenecks.md

## Zweck

Diese Datei beschreibt Engstellen, Rückstaus und Verdichtungen als eigenständiges Risiko für Veranstaltungen. Das Tool soll Engstellen nicht nur baulich erkennen, sondern auch funktional: Eine breite Fläche kann zur Engstelle werden, wenn dort Ticketkontrolle, Taschenkontrolle, Bar, Garderobe, Toiletten, Raucherbereich, Fotopunkt, Merchandise, VIP-Zugang, Bühne/Ring oder Sicherheitsbarrieren den Personenfluss verlangsamen.

## Definition

Eine Engstelle ist jeder räumliche oder organisatorische Punkt, an dem die Nachfrage nach Bewegung, Warten oder Aufenthalt größer ist als die sichere Aufnahmekapazität oder Durchflussfähigkeit. Engstellen entstehen durch:

```yaml
bottleneck_types:
  physical:
    - "schmale Türen, Flure, Treppen, Rampen, Tore, Schleusen"
    - "Barrieren, Zäune, Fahrzeugschutz, Absperrgitter"
    - "Möblierung, Stände, Kabel, technische Aufbauten"
  operational:
    - "Ticketkontrolle, Gästeliste, Taschenkontrolle, Alterskontrolle"
    - "Garderobe, Bar, Pfand-/Bezahlprozesse, Toiletten"
    - "Security-Entscheidung bei Einlassverweigerung"
  behavioral:
    - "Besucher bleiben stehen, warten auf Freunde, filmen, diskutieren"
    - "Rückstrom wegen vergessener Gegenstände oder Programmhöhepunkt"
    - "Gruppen sammeln sich an sozialen Hotspots"
  external:
    - "Parkplatz, ÖPNV-Haltestelle, Taxizone, Straßenquerung, Nachbareingang"
```

## Aktivierungslogik für das Tool

Aktiviere dieses Pattern bei:

- Jeder bekannten räumlichen Verengung.
- Jeder Kontrolle, die Personen einzeln verlangsamt.
- Jeder Stelle, an der Besucher stehen bleiben oder warten.
- Jeder Stelle, an der Gegen- oder Querströme entstehen.
- Sicherheitsbarrieren oder Fahrzeugschutzmaßnahmen im Besucherfluss.
- Unklarer Ausweichfläche vor oder nach einer Kontrolle.
- Engen Zugängen zu Bar, Toilette, Garderobe, Raucherbereich, Bühne/Ring.
- Potenziell blockierten Flucht- und Rettungswegen.
- Hoher Besucherzahl bei geringer Personal- oder Flächenreserve.
- Außenbereich mit öffentlichem Verkehr oder unkontrolliertem Zustrom.

## Eingabedaten

```yaml
bottleneck_input_questions:
  locations:
    - "Wo sind die engsten Stellen im Innen- und Außenbereich?"
    - "Wo stehen Besucher voraussichtlich an?"
    - "Wo kreuzen sich Laufwege?"
    - "Wo befinden sich Bars, Toiletten, Garderobe, Raucherbereich, Bühne/Ring?"
  control_points:
    - "Welche Prozesse verlangsamen Personen?"
    - "Wie viele Kontrolllinien gibt es?"
    - "Gibt es Platz vor und nach der Kontrolle?"
  flow:
    - "Wann entstehen Peaks?"
    - "Welche Wege nutzen Besucher tatsächlich, nicht nur geplant?"
    - "Gibt es alternative Wege?"
  obstruction:
    - "Welche temporären Aufbauten, Kabel, Schilder, Barrieren, Stände oder Möbel stehen in Bewegungsflächen?"
  emergency:
    - "Können Rettungswege durch Warteschlangen oder Sammelpunkte blockiert werden?"
    - "Was passiert, wenn eine Engstelle ausfällt?"
  monitoring:
    - "Wer beobachtet die Engstelle?"
    - "Welche Schwelle löst Eingriff aus?"
```

## Risikotreiber

- Engstelle direkt nach Einlass oder vor Programmbeginn.
- Engstelle kombiniert mit Kontroll-/Suchprozess.
- Engstelle in Flucht-/Rettungsweg oder nahe Notausgang.
- Gegenströme: Personen wollen gleichzeitig hinein und hinaus.
- Querströme: Bar/Toilette/Garderobe schneidet Hauptbewegungsachse.
- Sichtbehinderung oder Dunkelheit.
- Alkoholisierte oder ungeduldige Besucher.
- Sicherheitsbarrieren werden ohne Personenflussbetrachtung gesetzt.
- Engstelle liegt im öffentlichen Raum und ist nicht vollständig durch Veranstalter steuerbar.
- Engstelle ist zugleich Konflikthotspot, zum Beispiel Einlassverweigerung an Tür.

## Typische Gefährdungen

- Druck auf Personen, Türen, Gitter oder feste Strukturen.
- Sturz und Nachdrängen.
- Panikreaktionen oder Unruhe bei wahrgenommenem Feststecken.
- Blockierte Rettungswege.
- Verzögerte Intervention von Sicherheitsdienst/Sanitätsdienst.
- Aggression gegen Personal wegen Wartezeit.
- Ausweichbewegungen in gefährliche Bereiche.
- Unkontrollierte Nutzung von Notausgängen.
- Rückstau bis in Verkehrsflächen, Treppen oder öffentliche Straßen.
- Erhöhtes Verletzungsrisiko bei Brand, Gewaltlage oder technischer Störung.

## Frühindikatoren

```yaml
early_warning_indicators:
  visible:
    - "Warteschlange wächst über geplante Markierung hinaus"
    - "Personen stehen in Durchgängen"
    - "Stop-and-go-Bewegung"
    - "Personen drücken gegen Absperrungen"
    - "Besucher weichen auf nicht vorgesehene Wege aus"
  verbal:
    - "Beschwerden über Wartezeit"
    - "Rufe nach Öffnung weiterer Türen/Schleusen"
    - "Unruhe, Pfiffe, aggressive Kommentare"
  operational:
    - "Kontrolle dauert länger als erwartet"
    - "Einlasspersonal diskutiert Einzelfälle an Hauptlinie"
    - "Garderobe/Bar/Toilette erzeugt Rückstau"
    - "Sicherheitskräfte können Hotspot nicht mehr überblicken"
  emergency:
    - "Rettungsweg teilweise blockiert"
    - "Sanitätsdienst kommt schwer durch"
    - "Notausgang wird als Abkürzung benutzt"
```

## Präventive Maßnahmen

```yaml
preventive_controls:
  layout:
    - "Engstellen im Lageplan markieren."
    - "Hindernisse aus Bewegungsflächen entfernen."
    - "Stände, Bar, Garderobe und Toiletten so positionieren, dass keine Hauptwege blockiert werden."
    - "Warteschlangen in dafür vorgesehene Flächen lenken."
    - "Rückstauflächen vor und nach Kontrollpunkten einplanen."
  separation:
    - "Ein- und Ausgangsströme trennen, wo möglich."
    - "Gegenströme durch Einbahnführung, Absperrband oder Personal vermeiden."
    - "Konfliktgruppen bei Bedarf getrennt führen."
  control_process:
    - "Problemfälle aus Hauptkontrolllinie herausnehmen."
    - "Vorsortierung: Ticket bereit, Tasche offen, Altersnachweis bereit."
    - "Zusätzliche Kontrolllinie bei Peak vorbereiten."
  staffing:
    - "Engstellen aktiv besetzen, nicht nur passiv beobachten."
    - "Eine Kraft beobachtet Dichte und Stimmung, eine steuert Bewegung."
    - "Einsatzleiter entscheidet über Öffnen/Schließen/Umleiten."
  communication:
    - "Wartezeit und Grund für Verzögerung kommunizieren."
    - "Alternative Wege sichtbar und durch Personal bestätigt kommunizieren."
  safety:
    - "Rettungswege dauerhaft freihalten."
    - "Notausgänge nicht durch Wartende, Stände oder Material blockieren."
```

## Dynamische Maßnahmen

```yaml
dynamic_controls:
  if_queue_exceeds_area:
    - "Einlass verlangsamen oder stoppen."
    - "Warteschlange neu führen."
    - "Zusätzliche Kontrollstelle öffnen, sofern sicher."
  if_pressure_visible:
    - "Druck von hinten reduzieren."
    - "Kommunikation an wartende Personen."
    - "Nachbereich entlasten, bevor weitere Personen eingelassen werden."
  if_crossflow:
    - "Temporäre Einbahnführung."
    - "Bar/Toilette/Garderobe kurzzeitig regulieren."
    - "Personal als weiche Lenkung einsetzen."
  if_escape_route_blocked:
    - "Sofort räumen."
    - "Ursache entfernen."
    - "Einsatzleitung informieren."
  if_conflict_at_bottleneck:
    - "Problemfall aus Hauptstrom lösen."
    - "Teamintervention."
    - "Nicht im Engpass diskutieren."
```

## Besondere Prüfregel: Sicherheitsmaßnahme darf kein neues Risiko erzeugen

Das Tool soll Schutzmaßnahmen prüfen, die selbst Engstellen erzeugen können:

```yaml
control_side_effect_check:
  vehicle_barriers:
    - "Beeinträchtigen Barrieren den sicheren Personenfluss?"
    - "Entsteht zwischen Barrieren ein Flaschenhals?"
    - "Sind Barrieren für Rollstuhl, Kinderwagen, Sanitätsdienst und Evakuierung berücksichtigt?"
  search_points:
    - "Erzeugen Taschenkontrollen Rückstau?"
    - "Gibt es Abgabe-/Entsorgungsmöglichkeiten für verbotene Gegenstände?"
  fencing:
    - "Führt Zaunsetzung zu Sackgassen oder Gegenströmen?"
  signage:
    - "Lenkt Beschilderung Personen in eine überlastete Richtung?"
```

## Risikobewertung

```yaml
risk_rating_hints:
  low:
    - "Engstelle bekannt, ausreichend Fläche, Personal und Ausweichweg vorhanden"
  medium:
    - "Engstelle mit Wartezeit, aber steuerbar und überwacht"
  high:
    - "Engstelle plus Peak, Kontrolle, Alkohol, Gegenstrom oder Rettungswegbezug"
  critical:
    - "sichtbarer Druck, blockierter Rettungsweg, Kontrollverlust, keine Ausweichfläche"
```

## Tool-Regeln

```yaml
generation_rules:
  - "Bottlenecks immer mit Ort, Ursache, Phase und Maßnahme ausgeben."
  - "Nicht nur bauliche Engstellen erfassen; auch organisatorische Kontrollpunkte als Engstelle bewerten."
  - "Wenn eine Maßnahme Barriere/Security Search/Zaun enthält, side_effect_check durchführen."
  - "Diskussionen, Ausschlüsse und Konflikte niemals im Engpass lösen; immer herauslösen."
  - "Bei Flucht-/Rettungswegbezug Maßnahme als verpflichtend formulieren."
```

## Mindestoutput in der Gefährdungsbeurteilung

- Tabelle oder Liste der Engstellen.
- Ursache: baulich, organisatorisch, verhaltensbezogen, extern.
- Betroffene Phase: Einlass, Zirkulation, Pause, Auslass, Notfall.
- Gefährdung.
- Präventive Maßnahme.
- Dynamische Maßnahme.
- Verantwortliche Rolle.
- Restrisiko.

## Beispieltextbaustein

Als kritische Engstellen gelten insbesondere Einlass, Bar-/Toilettenbereich und Ausgänge. Rückstau kann entstehen, wenn Kontroll- oder Versorgungsprozesse langsamer sind als der Besucherzustrom. Warteschlangen werden außerhalb von Rettungswegen geführt, Problemfälle werden aus dem Hauptstrom herausgelöst und die Engstellen werden durch Sicherheitskräfte aktiv beobachtet. Bei sichtbarer Verdichtung, Gegenstrom oder blockierten Rettungswegen wird der Personenfluss sofort angepasst, der Einlass verlangsamt oder temporär gestoppt und die Einsatzleitung informiert.

## Quellen und Leitlinien

- HSE: Managing crowds safely; Put crowd controls in place; Assess crowd safety risks.
- SGSA/NPSA: Vehicle security barriers at event venues.
- SGSA SG03: Zone Ex, queue management, ingress/egress, dynamic risk assessment.
- SGSA Green Guide: safe movement, circulation, ingress/egress.
- DGUV Information 215-310.

URLs:
- DGUV Information 215-310: https://publikationen.dguv.de/regelwerk/dguv-informationen/596/sicherheit-bei-veranstaltungen-und-produktion
- HSE Crowd Controls: https://www.hse.gov.uk/event-safety/crowd-management-controls.htm
- HSE Assess Crowd Safety Risks: https://www.hse.gov.uk/event-safety/crowd-management-assess.htm
- HSE Managing Crowds Safely publication: https://www.hse.gov.uk/pubns/indg142.htm
- SGSA Green Guide: https://sgsa.org.uk/document/greenguide/
- SGSA SG03 Event Safety Management: https://sgsa.org.uk/wp-content/uploads/2021/09/SG03-Event-Safety-Management-Digital-Edition.pdf
- SGSA/NPSA Vehicle Security Barriers: https://sgsa.org.uk/document/vehicle-security-barriers-at-event-venues/
