# Blueprint-Sonderregeln — `gb_event_kampfsport_lean` (Kontext-reduzierte Variante)

Gilt nur für den Blueprint **`gb_event_kampfsport_lean`**. Ergänzt `rules/products/gb_rules.md`; schließt sich mit den Basisregeln aus `rules/base/` nicht aus.

## Zweck dieses Blueprints

Reduzierte Kontextladung für **kleine bis mittlere Kampfsportveranstaltungen** (z. B. K1-Turnier, wenige Sicherheitskräfte, typischer Einlass und Besucherführung). Die Bewertung soll **schlank** und **verhältnismäßig** bleiben.

## Verhältnismäßigkeit und Szenario-Treue (Pflicht)

- Bewerte **nur** aus den **Projektdaten** und den geladenen Wissensmodulen — keine erfundenen Großlagen.
- **Keine Hochrisiko-Narrative** ohne konkrete Hinweise im Input (z. B. behördliche Auflage, Vorfallhistorie, Auflagen zu Massenlagen, rivalisierende Gruppen).
- **Keine Annahme** von Hooliganismus, organisierten Fangruppenrivalitäten, massenhafter Panik oder alkoholbedingter Gewalt **ohne** entsprechende Angaben im Input (z. B. `special_risks`, `prior_incidents`, `official_requirements`, `alcohol_served`).
- Ist ein Risiko **theoretisch denkbar**, aber für diesen Auftrag **nicht plausibel belegt**, ist es als **geringe Relevanz**, **Restrisiko** oder **Beobachtungs-/Überwachungspunkt** zu behandeln — nicht als dominantes Hauptgefährdungsbild.
- **Personalknappheit** (z. B. nur zwei Einsatzkräfte) darf als **organisatorische Grenze** benannt werden; nicht automatisch „Massenpanik“ oder „Großlage“ unterstellen.

## Sekundärgefahren durch Maßnahmen (Pflicht)

Schutzmaßnahmen sind immer auch auf **Nebenwirkungen** zu prüfen und gegebenenweise kurz zu benennen, z. B.:

- Einlass-/Zutrittskontrolle → **Warteschlangen**, Gedränge, Blockierung von Übergängen.
- Absperrungen / Leitungen → **Engpässe**, verzögerte Evakuierung.
- Unklare Ansagen oder falsch kanalisierte Kommunikation → **Orientierungsverlust**, erhöhte Irritation.
- Funk-/Meldeengpässe bei kleinem Team → **verzögerte Lagemeldung**.

## Besuchertrennung / Zonen (`visitor_separation`)

Die Moduldatei **`visitor_separation`** ist in diesem Lean-Blueprint **nicht** geladen. Erfinde **keine** VIP-/Rivalen-/Backstage-Trennszenarien, wenn der Input sie nicht stützt.

## Ausgabequalität

- Formulierungen: **sachlich-professionelles Deutsch** wie in einer internen Gefährdungsbeurteilung für Veranstaltungsschutz.
- Keine Übertreibung der Eintrittswahrscheinlichkeit „auf gut Deutsch“ — Matrix konsistent halten.
