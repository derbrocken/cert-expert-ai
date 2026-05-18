<!--
Curated operational knowledge file for event-security risk assessment generation.
Use as source material for qualified Gefährdungsbeurteilungen, Sicherheitskonzepte,
Einsatzkonzepte and objekt-/veranstaltungsbezogene Dienstanweisungen.
Language: German. Scope: Veranstaltungsschutz / Event Security.
-->

# aggressive_groups.md

## Zweck

Diese Datei beschreibt gruppenbezogene Konflikt- und Aggressionslagen bei Veranstaltungen. Sie soll dem Tool helfen, aus unvollständigen Kundeneingaben eine belastbare Gefährdungsbeurteilung abzuleiten, ohne pauschal jede Gruppe als gefährlich einzustufen. Bewertet wird nicht die bloße Existenz einer Gruppe, sondern das Zusammenspiel aus Anlass, Gruppendynamik, Rivalitäten, Alkoholisierung, räumlicher Enge, Wartezeiten, Kontrollsituationen, Emotionalität und vorhandenen Deeskalations-/Interventionsstrukturen.

## Aktivierungslogik für das Tool

Aktiviere dieses Pattern, wenn mindestens einer der folgenden Punkte vorliegt:

- Hinweise auf rivalisierende Besuchergruppen, Fangruppen, Teams, Lager, Szenen, Clans, politische oder weltanschauliche Gegengruppen.
- Veranstaltung mit hoher Emotionalität: Kampfsport, Fußball-/Sportevent, politisierte Veranstaltung, Battle-/Contest-Format, Derby-/Rivalitätsbezug, Siegerehrung mit Konfliktpotenzial.
- Erwartete Gruppenbildung vor Einlass, an Bar, Raucherbereich, Bühne, Umkleiden, VIP-/Backstagebereich, Toiletten, Ausgang oder ÖPNV-Anschluss.
- Frühere Vorfälle bei ähnlichen Veranstaltungen oder mit denselben Gruppen: Beleidigungen, Schubsereien, Bedrohungen, Sachbeschädigung, Abbruch, Polizeieinsatz, Hausverbote.
- Erhöhte Wahrscheinlichkeit von Alkoholisierung, Drogenkonsum, Frustration durch Wartezeiten oder Ausschluss einzelner Personen.
- Sicherheitsdienst soll Hausrecht, Einlassverweigerung, Trennung, Durchsetzung von Regeln oder Schutz bestimmter Personen übernehmen.

Nicht aktivieren allein wegen: junger Zielgruppe, lauter Stimmung, kultureller Zugehörigkeit, äußerem Erscheinungsbild, Kleidung oder Gruppengröße ohne weitere Risikotreiber.

## Erforderliche Eingabedaten

Das Tool soll bei fehlenden Informationen gezielt nachfragen:

```yaml
group_context:
  known_groups: "Welche Gruppen/Lager/Fangruppen/Teams werden erwartet?"
  rivalry_or_history: "Gibt es bekannte Rivalitäten, frühere Vorfälle, Hausverbote, polizeiliche Erkenntnisse?"
  emotional_triggers: "Welche Programmpunkte können emotional eskalieren? Kampf, Urteil, Niederlage, Preis, Provokation?"
  alcohol_drugs: "Gibt es Alkoholausschank, mitgebrachte Getränke, erkennbaren Drogenbezug?"
  spatial_separation: "Können Gruppen räumlich getrennt geführt/platziert werden?"
  hotspots: "Wo treffen Gruppen zwangsläufig aufeinander? Einlass, Bar, Toiletten, Raucherbereich, Bühne/Ring, Ausgang?"
  authority_points: "Wo muss Sicherheitsdienst Regeln aktiv durchsetzen? Taschenkontrolle, Einlassstop, Rauswurf, Bereichssperre?"
  police_interface: "Ist Polizei informiert oder ansprechbar? Gibt es Meldewege?"
  house_rules: "Welche Verbote gelten? Waffen, Pyro, Glas, Alkohol, Vermummung, Banner, diskriminierende Symbole?"
  vulnerable_targets: "Gibt es besonders zu schützende Personen? Kämpfer, Schiedsrichter, Künstler, Minderjährige, VIPs?"
```

## Risikotreiber

Bewerte die Lage höher, wenn mehrere Treiber zusammenfallen:

- Emotionaler Anlass plus räumliche Nähe gegnerischer Gruppen.
- Kontrolle oder Zurückweisung durch Sicherheitsdienst unter Publikumsbeobachtung.
- Unklare Regeln oder widersprüchliche Kommunikation.
- Langer, enger Einlass mit Taschenkontrolle.
- Alkohol-/Drogenkonsum vor oder während der Veranstaltung.
- Gruppenführer oder Meinungsführer heizen sichtbar Stimmung an.
- Beschimpfungen, Drohgebärden, Provokationen, Abfilmen von Konflikten.
- Fehlende Rückzugsmöglichkeiten für Sicherheitspersonal.
- Fehlende Trennlinien zwischen Publikum, Sportlern/Künstlern und Verantwortlichen.
- Unklare Schwelle, wann Polizei, Veranstalter oder Einsatzleitung hinzugezogen wird.

## Typische Gefährdungen

- Verbale Eskalation, Bedrohung, Beleidigung, diskriminierende oder sexualisierte Belästigung.
- Körperliche Auseinandersetzung zwischen Einzelpersonen, die von Gruppen unterstützt wird.
- Gruppendruck gegen Sicherheitskräfte bei Einlassverweigerung oder Ausschluss.
- Spontane Solidarisierung mit einer sanktionierten Person.
- Versuche, abgesperrte Bereiche zu stürmen oder Personen im Backstage-/Athletenbereich zu erreichen.
- Wurfgegenstände, Glas, Flaschen, Stühle, Absperrelemente.
- Tumultartige Bewegung durch Gerüchte, Streit, Kampfende, Fehlentscheidung, Provokation oder Panikreaktion.
- Abdrängen unbeteiligter Besucher, Stolpern, Stürzen, sekundäre Verletzungen.
- Nachlaufende Konflikte beim Auslass, an Parkplätzen, ÖPNV-Haltestellen oder vor der Location.

## Frühindikatoren für die dynamische Lagebewertung

Das Tool soll diese Beobachtungen als dynamische Indikatoren verwenden:

```yaml
early_warning_indicators:
  verbal:
    - "laute Beschimpfungen"
    - "Drohungen"
    - "wiederholtes Provozieren"
    - "diskriminierende Aussagen"
    - "Sprechchöre gegen Person/Gruppe"
  behavioral:
    - "Personen bewegen sich geschlossen auf andere Gruppe zu"
    - "Umstellen einzelner Personen"
    - "Anrempeln/Schubsen"
    - "aggressives Filmen aus nächster Nähe"
    - "Vordrängen trotz Ansprache"
    - "mehrere Personen folgen einer entfernten Person"
  spatial:
    - "Gruppen verdichten sich an Bar, Toiletten, Ring/Bühne, Ausgang"
    - "Flucht-/Rettungswege werden durch Diskussionen blockiert"
    - "Sicherheitskräfte stehen ohne Rückzugsweg"
  substance_related:
    - "erkennbar alkoholisierte Personen"
    - "stark enthemmtes Verhalten"
    - "Koordinationsprobleme"
    - "sinkende Hemmschwelle bei Ansprache"
  escalation_markers:
    - "Jacken werden ausgezogen"
    - "Gürtel/Flaschen/Stühle werden ergriffen"
    - "Personen werden von Dritten zurückgehalten"
    - "Sicherheitsdienst wird umringt"
    - "Unbeteiligte entfernen sich sichtbar"
```

## Präventive Kontrollmaßnahmen

```yaml
preventive_controls:
  intelligence_and_briefing:
    - "Vorabfrage früherer Vorfälle und bekannter Konfliktgruppen beim Veranstalter."
    - "Kurzes Einsatzbriefing mit Rollen, Hotspots, Meldewegen und Eskalationsschwellen."
    - "Benennung eines Einsatzleiters Sicherheitsdienst und einer eindeutigen Kontaktperson Veranstalter."
  rules_and_communication:
    - "Klare Hausordnung vor Einlass und vor Ort sichtbar kommunizieren."
    - "Einheitliche Ansprache: freundlich, klar, regelbezogen, nicht provozierend."
    - "Regeln zu Alkohol, Glas, Waffen, Pyrotechnik, Taschenkontrolle, Wiedereinlass und Hausverweis festlegen."
  spatial_design:
    - "Rivalisierende Gruppen nach Möglichkeit räumlich trennen."
    - "Hotspots entzerren: Bar, Toiletten, Raucherbereich, Einlass, Ausgang, Ring-/Bühnenrand."
    - "Sicherheitspositionen so planen, dass Sicht, Rückzug und gegenseitige Unterstützung möglich sind."
  staffing:
    - "Erfahrene Kräfte an Einlass, Konflikthotspots und Bereichsgrenzen einsetzen."
    - "Keine Einzelintervention bei erkennbar gruppenbezogener Dynamik."
    - "Teamweise Ansprache, eine Person spricht, zweite Person beobachtet Umfeld."
  coordination:
    - "Meldeweg an Veranstalter, Sanitätsdienst, ggf. Polizei festlegen."
    - "Entscheidungskompetenz für Ausschluss, Veranstaltungsunterbrechung, Einlassstop und Polizeiruf festlegen."
  documentation:
    - "Vorfälle zeitnah mit Uhrzeit, Ort, beteiligten Gruppen, Maßnahmen und Zeugen dokumentieren."
```

## Dynamische Maßnahmen während der Veranstaltung

- Bei ersten Provokationen: Präsenz erhöhen, Gruppen räumlich entflechten, neutrale Ansprache, keine Bloßstellung.
- Bei aggressiver Einzelperson mit Gruppenrückhalt: nicht allein einschreiten; Einsatzleiter hinzuziehen; Gruppe nicht pauschal adressieren, sondern konkrete Person und konkretes Verhalten benennen.
- Bei drohender körperlicher Auseinandersetzung: Abstand schaffen, Barrieren/Personal als Trennlinie nutzen, Umfeld räumen, Sanitäts-/Polizeimeldeweg vorbereiten.
- Bei Tumult oder Gruppe gegen Sicherheitsdienst: Rückzug und Raumgewinn vor Durchsetzung; keine unkoordinierte körperliche Intervention; Polizei bei akuter Eigen-/Fremdgefährdung.
- Bei Ausschluss/Hausverweis: diskrete, sichere Entfernung über festgelegten Weg; Begleitung bis Übergabepunkt; Gruppe nicht hinterherziehen lassen.
- Beim Auslass: Konfliktparteien zeitlich oder räumlich entzerren, Hotspots außerhalb der Location beobachten, Abstrom steuern.

## Bewertungslogik für Risikoausgabe

```yaml
risk_rating_hints:
  low:
    conditions:
      - "keine bekannten Rivalitäten"
      - "überschaubare Besucherzahl"
      - "klare Regeln"
      - "geringe Alkoholisierung"
      - "gute Flächen und Ausweichmöglichkeiten"
  medium:
    conditions:
      - "emotionale Veranstaltung"
      - "mögliche Gruppenbildung"
      - "Alkoholausschank"
      - "enge Hotspots oder Wartezeiten"
  high:
    conditions:
      - "bekannte Rivalitäten oder Vorfälle"
      - "mehrere Eskalationstreiber gleichzeitig"
      - "räumliche Trennung schwierig"
      - "Sicherheitsdienst muss Regeln aktiv gegen Gruppen durchsetzen"
  critical:
    conditions:
      - "akute Drohungen oder Gewaltankündigungen"
      - "bewaffnete oder deutlich gewaltbereite Personen"
      - "Sicherheitsdienst personell/organisatorisch nicht handlungsfähig"
      - "keine Polizei-/Veranstaltererreichbarkeit trotz hoher Gefährdung"
```

## Mindestoutput in der Gefährdungsbeurteilung

Die generierte Gefährdungsbeurteilung muss mindestens enthalten:

- Beschreibung der möglichen gruppenbezogenen Konfliktlage.
- Betroffene Personen: Besucher, Sicherheitsdienst, Veranstalter, Sportler/Künstler, unbeteiligte Dritte.
- Ursachen/Risikotreiber.
- Präventive Maßnahmen vor Veranstaltungsbeginn.
- Dynamische Maßnahmen während der Veranstaltung.
- Eskalations- und Meldewege.
- Dokumentationspflicht.
- Restrisiko mit Begründung.

## Beispieltextbaustein

Bei der Veranstaltung können gruppenbezogene Konfliktlagen nicht ausgeschlossen werden, insbesondere wenn emotionale Programmpunkte, Alkoholkonsum, Wartezeiten oder räumliche Enge zusammentreffen. Zur Risikoreduzierung werden klare Hausregeln kommuniziert, Hotspots durch Sicherheitskräfte beobachtet, Konfliktparteien frühzeitig räumlich entzerrt und Interventionen grundsätzlich teamweise durchgeführt. Bei konkreten Drohungen, körperlichen Auseinandersetzungen oder Kontrollverlust wird unverzüglich die Einsatzleitung informiert und abhängig von der Lage Polizei und Sanitätsdienst eingebunden.

## Quellen und Leitlinien

- Polizei Berlin: Umgang mit Aggression und Gewalt. Schwerpunkt: Wahrnehmung, Kommunikation, Dynamik von Gewaltprozessen, Vermeidung von Selbst- und Fremdgefährdung.
- HSE: Assess crowd safety risks and identify hazards. Schwerpunkt: gefährliches Verhalten, Aggression bei Unzufriedenheit, Verstärkung durch Intoxikation.
- GOV.UK / Cabinet Office: Understanding Crowd Behaviours. Schwerpunkt: crowd behaviour, group dynamics, emergency planning.
- SGSA SG03: Event Safety Management. Schwerpunkt: event-specific and dynamic risk assessments, crowd disorder and anti-social behaviour plans.
- Hessen/NRW Leitfäden Großveranstaltungen. Schwerpunkt: Sicherheitskonzept, Verantwortlichkeiten, Kommunikation und behördliche Schnittstellen.

URLs:
- HSE Assess Crowd Safety Risks: https://www.hse.gov.uk/event-safety/crowd-management-assess.htm
- SGSA SG03 Event Safety Management: https://sgsa.org.uk/wp-content/uploads/2021/09/SG03-Event-Safety-Management-Digital-Edition.pdf
- GOV.UK Understanding Crowd Behaviours: https://www.gov.uk/government/publications/understanding-crowd-behaviours-documents
- Cabinet Office Understanding Crowd Behaviours Supporting Evidence: https://assets.publishing.service.gov.uk/media/5a7b2883e5274a34770e9d1d/understanding_crowd_behaviour-supporting-evidence.pdf
- Orientierungsrahmen NRW Großveranstaltungen: https://www.im.nrw/sites/default/files/documents/2017-11/grossveranstaltungen_orientierungsrahmen_druckversion.pdf
- Hessen Leitfaden Sicherheit bei Großveranstaltungen: https://innen.hessen.de/sites/innen.hessen.de/files/2021-08/leitfaden_sicherheit_bei_grossveranstaltungen.pdf
- Polizei Berlin Umgang mit Aggression und Gewalt: https://www.berlin.de/polizei/_assets/aufgaben/praevention/umgang_aggression_gewalt_veranstaltung.pdf
