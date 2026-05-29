<!--
Curated operational knowledge file for event-security risk assessment generation.
Use as source material for qualified Gefährdungsbeurteilungen, Sicherheitskonzepte,
Einsatzkonzepte and objekt-/veranstaltungsbezogene Dienstanweisungen.
Language: German. Scope: Veranstaltungsschutz / Event Security.
-->

# alcohol_related_conflicts.md

## Zweck

Diese Datei beschreibt alkoholbezogene Konflikt- und Sicherheitsrisiken bei Veranstaltungen. Sie dient nicht der moralischen Bewertung von Alkoholkonsum, sondern der sachlichen Gefährdungsbeurteilung: Alkohol kann Wahrnehmung, Hemmung, Konfliktbereitschaft, Standsicherheit, Orientierung und Kooperationsfähigkeit beeinflussen. In Kombination mit Gedränge, Wartezeit, Emotionalität, Gruppendruck und unklaren Regeln steigt das Risiko für Unfälle, Aggression, Sachbeschädigung und Überforderung des Sicherheitsdienstes.

## Aktivierungslogik für das Tool

Aktiviere dieses Pattern bei:

- Alkoholausschank vor Ort.
- Mitgebrachter Alkohol möglich oder wahrscheinlich.
- Veranstaltung im Abend-/Nachtzeitraum.
- Zielgruppe mit Feier-/Partycharakter.
- Sport-/Kampfsport-/Contest-Event mit emotionalem Ausgang.
- Minderjährige oder junge Zielgruppe mit Jugendschutzrelevanz.
- Frühere Vorfälle mit Alkohol, Streit, Vandalismus, Sanitätsfällen oder Polizeieinsätzen.
- Einlasskontrollen wegen Glas, Flaschen, Alkohol, Drogen oder Altersnachweis.
- Erwartete Nachlaufphase vor Location, Parkplatz, ÖPNV oder Kiosk/Spätkauf.
- Sicherheitsdienst soll erkennbar alkoholisierte Personen ansprechen, ausschließen oder abweisen.

## Eingabedaten

```yaml
alcohol_input_questions:
  alcohol_policy:
    - "Wird Alkohol ausgeschenkt?"
    - "Welche Getränke, welche Ausschankzeiten, welche Ausgabestellen?"
    - "Gibt es Ausschankstopp oder begrenzte Abgabemengen?"
    - "Darf Alkohol mitgebracht werden?"
    - "Sind Glasflaschen oder Dosen verboten?"
  youth_protection:
    - "Sind Minderjährige anwesend?"
    - "Wie wird Alterskontrolle umgesetzt?"
    - "Wer kontrolliert Abgabe und Verzehr?"
  intoxication_management:
    - "Wie wird mit erkennbar alkoholisierten Personen am Einlass umgegangen?"
    - "Wer entscheidet über Einlassverweigerung oder Hausverweis?"
    - "Gibt es sichere Warte-/Übergabepunkte?"
  hotspots:
    - "Wo entstehen alkoholbezogene Hotspots: Bar, Raucherbereich, Toiletten, Ausgang, Parkplatz?"
    - "Gibt es Kioske/Spätkaufs/öffentliche Trinkflächen in der Nähe?"
  medical:
    - "Ist Sanitätsdienst vorhanden?"
    - "Wie werden Sturz, Erbrechen, Bewusstseinsstörung, Unterkühlung, Dehydrierung gemeldet?"
  communication:
    - "Sind Regeln sichtbar kommuniziert?"
    - "Welche Ansprache nutzt Sicherheitsdienst bei intoxikierten Personen?"
```

## Typische Gefährdungen

- Aggression und Enthemmung bei Streit, Wartezeit, Niederlage, Provokation oder Einlassverweigerung.
- Verminderte Kooperationsfähigkeit bei Anweisungen des Sicherheitsdienstes.
- Sturz, Stolpern, Kreislaufprobleme, Erbrechen, Bewusstseinsstörung.
- Fehlende Orientierung beim Auslass, Abdriften in gesperrte Bereiche.
- Glasbruch, Schnittverletzungen, Wurfgegenstände.
- Konflikte an Bar, Toiletten, Raucherbereich oder Ausgang.
- Übergriffiges Verhalten, Belästigung, Grenzüberschreitungen.
- Vandalismus oder Sachbeschädigung.
- Gruppendynamische Eskalation, wenn alkoholisierte Person Unterstützung aus Gruppe erhält.
- Jugendschutzverstöße.
- Nachlaufkonflikte außerhalb des Veranstaltungsbereichs.

## Risikotreiber

```yaml
risk_drivers:
  event_context:
    - "Abend-/Nachtveranstaltung"
    - "Party-/Feiercharakter"
    - "Kampfsport/Sport mit emotionalem Ergebnis"
    - "hohe Gruppenzugehörigkeit oder Rivalität"
  alcohol_availability:
    - "günstiger Alkohol"
    - "lange Ausschankdauer"
    - "externe Bezugsquellen in der Nähe"
    - "Mitbringen schwer kontrollierbar"
  spatial:
    - "Bar in Engstelle"
    - "Toiletten/Raucherbereich als Konflikthotspot"
    - "Auslass führt in unkontrollierten Außenbereich"
  organizational:
    - "unklare Hausordnung"
    - "keine definierte Einlassverweigerungsschwelle"
    - "kein Ausschankstopp-Konzept"
    - "fehlende Alterskontrolle"
    - "Sicherheitsdienst zu knapp besetzt"
  behavioural:
    - "sichtbare Alkoholisierung"
    - "laut-aggressives Auftreten"
    - "Provozieren, Anrempeln, Belästigung"
    - "fehlende Einsicht bei Ansprache"
```

## Frühindikatoren

```yaml
early_warning_indicators:
  intoxication_signs:
    - "unsicherer Gang"
    - "verwaschene Sprache"
    - "starker Alkoholgeruch"
    - "verlangsamte Reaktion"
    - "enthemmtes Verhalten"
    - "aggressiver Blickkontakt oder Distanzunterschreitung"
  conflict_signs:
    - "Streit an Bar/Toilette/Raucherbereich"
    - "mehrere Personen diskutieren mit Sicherheitsdienst"
    - "Beleidigungen bei Einlassverweigerung"
    - "Gruppen bilden Kreis um Konflikt"
    - "Filmen von Auseinandersetzungen"
  medical_signs:
    - "Erbrechen"
    - "Sturz"
    - "Bewusstseinsstörung"
    - "Unterkühlung im Außenbereich"
    - "Person nicht mehr ansprechbar"
  youth_protection_signs:
    - "Minderjährige mit Alkohol"
    - "Weitergabe von Alkohol durch Erwachsene"
    - "Falscher oder fehlender Altersnachweis"
```

## Präventive Maßnahmen

```yaml
preventive_controls:
  policy:
    - "Alkoholpolitik vor Veranstaltungsbeginn festlegen: Ausschank, Mitbringen, Glas, Dosen, Abgabemenge, Ausschankende."
    - "Hausordnung mit Alkohol-, Glas-, Waffen- und Drogenregeln sichtbar kommunizieren."
    - "Einlasskriterien für erkennbar alkoholisierte Personen definieren."
  youth_protection:
    - "Alterskontrolle und Kennzeichnungssystem festlegen."
    - "Personal zu Jugendschutzregeln und Zuständigkeiten briefen."
    - "Umgang mit Weitergabe von Alkohol an Minderjährige festlegen."
  bar_management:
    - "Bar nicht in Flucht-/Rettungsweg oder Engstelle positionieren."
    - "Barbereich beobachten, Rückstau vermeiden."
    - "Ausschankstopp oder Verweigerung bei erkennbarer starker Alkoholisierung als Option vorsehen."
  security:
    - "Sicherheitskräfte für deeskalierende Kommunikation und Teamintervention briefen."
    - "Alkoholisierte Personen nicht allein in unübersichtlichen Bereichen ansprechen."
    - "Problemfälle aus Hauptstrom/Engstelle herauslösen."
  medical:
    - "Sanitätsdienst/Meldeweg bei Intoxikation, Sturz, Bewusstseinsstörung festlegen."
    - "Wasser/ruhiger Bereich/Übergabe an Begleitperson prüfen, sofern sicher und zulässig."
  external_area:
    - "Außenbereich, Raucherzone, Parkplatz und ÖPNV-Anschluss im Auslass mitdenken."
```

## Dynamische Maßnahmen

- Bei leichter Alkoholisierung: beobachten, klare Ansprache, keine Eskalation durch Bloßstellung.
- Bei starker Alkoholisierung am Einlass: Einlass verweigern, Entscheidung ruhig begründen, Begleitpersonen einbeziehen, Rückstau vermeiden.
- Bei aggressiver Alkoholisierung: Teamintervention, Abstand wahren, Einsatzleitung informieren, Polizei bei Gewalt/Drohung.
- Bei medizinischer Auffälligkeit: Sanitätsdienst hinzuziehen, Person nicht unbeaufsichtigt lassen, Gefahrenbereich räumen.
- Bei Bar-Hotspot: Barbereich entzerren, Ausgabe temporär verlangsamen, zusätzliche Präsenz.
- Bei Jugendschutzverstoß: Verantwortliche Stelle informieren, Abgabe/Verzehr unterbinden, dokumentieren.
- Beim Auslass: alkoholisierte Personen nicht in gefährliche Verkehrssituationen laufen lassen, soweit im Verantwortungsbereich möglich; Außenlage beobachten.

## Bewertungslogik

```yaml
risk_rating_hints:
  low:
    - "kein Alkohol oder geringe Relevanz, klare Regeln, keine Minderjährigen, keine Vorfälle"
  medium:
    - "Alkoholausschank vorhanden, überschaubare Besucherzahl, Sicherheitsdienst und Regeln vorhanden"
  high:
    - "Alkohol plus emotionale Veranstaltung, Gruppenbildung, Engstellen oder Minderjährige"
  critical:
    - "stark alkoholisierte aggressive Personen, Gewalt, medizinische Notfälle, fehlender Sanitäts-/Polizei-Meldeweg"
```

## Tool-Regeln

```yaml
generation_rules:
  - "Alkohol nie isoliert bewerten; immer Kombination mit Emotion, Crowd-Dynamics, Engstellen und Gruppenlage prüfen."
  - "Wenn Minderjährige möglich sind, Jugendschutz als eigenes Prüffeld aufnehmen."
  - "Wenn Alkohol mitgebracht werden kann, Einlasskontrolle und Abgaberegelung prüfen."
  - "Bei Glasflaschen immer Schnitt-, Wurf- und Reinigungsrisiko bewerten."
  - "Bei aggressiver Alkoholisierung keine Einzelintervention empfehlen."
  - "Bei medizinischen Zeichen Sanitätsdienst/Meldeweg aufnehmen."
```

## Mindestoutput in der Gefährdungsbeurteilung

- Alkoholpolitik und Rahmenbedingungen.
- Betroffene Personen und Hotspots.
- Konflikt-, Unfall-, medizinische und Jugendschutzrisiken.
- Maßnahmen vor und während der Veranstaltung.
- Zuständigkeiten für Ausschank, Einlass, Hausrecht, Sanitätsdienst und Polizei.
- Restrisiko.

## Beispieltextbaustein

Alkoholbezogene Risiken bestehen insbesondere an Einlass, Bar, Toiletten, Raucherbereich und Auslass. Alkoholisierung kann die Kooperationsfähigkeit senken und Konflikte verstärken. Zur Risikoreduzierung werden klare Alkohol- und Glasregeln kommuniziert, erkennbare starke Alkoholisierung am Einlass bewertet, Bar- und Außenbereiche beobachtet und Interventionen grundsätzlich deeskalierend und teamweise durchgeführt. Bei medizinischen Auffälligkeiten wird der Sanitätsdienst hinzugezogen; bei Gewalt, Drohung oder Kontrollverlust erfolgt die Information der Einsatzleitung und erforderlichenfalls der Polizei.

## Quellen und Leitlinien

- HSE: Assess crowd safety risks and identify hazards; crowd behaviour can be affected by dissatisfaction, intoxication and drugs.
- HSE/SGSA: Search procedures and alcohol policies must be planned so they do not create overcrowding or unmanaged queues.
- Polizeiliche Kriminalprävention: Jugendschutz-Checkliste für Festveranstalter; Schwerpunkt Exzess, Gewalt, Vandalismus und Jugendschutz.
- Polizei Berlin: Umgang mit Aggression und Gewalt.
- DGUV Information 215-310: sichere Organisation und Durchführung von Veranstaltungen.

URLs:
- DGUV Information 215-310: https://publikationen.dguv.de/regelwerk/dguv-informationen/596/sicherheit-bei-veranstaltungen-und-produktion
- HSE Crowd Controls: https://www.hse.gov.uk/event-safety/crowd-management-controls.htm
- HSE Assess Crowd Safety Risks: https://www.hse.gov.uk/event-safety/crowd-management-assess.htm
- SGSA SG03 Event Safety Management: https://sgsa.org.uk/wp-content/uploads/2021/09/SG03-Event-Safety-Management-Digital-Edition.pdf
- Polizei Berlin Umgang mit Aggression und Gewalt: https://www.berlin.de/polizei/_assets/aufgaben/praevention/umgang_aggression_gewalt_veranstaltung.pdf
- Polizeiliche Kriminalprävention Jugendschutz-Checkliste: https://www.polizei-beratung.de/medienangebot/detail/48-jugendschutz-checkliste/
