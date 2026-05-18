# Beispiel — `{GB_GEFAEHRDUNGEN}` für Kampfsportveranstaltung

> Fiktives Beispiel. Alle Daten sind ausgedacht. Dient nur als Stil- und
> Strukturreferenz für den Bot.

---

**Beispiel-Input (gekürzt):**

- event_name: „Berlin Open K1 Cup"
- event_type: „Kampfsportveranstaltung"
- combat_sports_type: „K1"
- expected_attendees: 350
- security_staff_count: 6
- venue_capacity: 500
- venue_exits: 4
- alcohol_served: true
- outdoor_area: false
- special_risks: [„erhöhtes Aggressionspotenzial unter Zuschauern"]

---

**Beispiel-Ausgabe für `{GB_GEFAEHRDUNGEN}`:**

Publikumsbezogene Gefährdungen:
- Erhöhtes Aggressionspotenzial im Zuschauerbereich bei intensiven
  Kämpfen und unklaren Wertungen, vom Auftraggeber als besonderes Risiko
  benannt.
- Konflikte zwischen unterschiedlichen Fan-Lagern erfahrungsgemäß möglich.
- Alkoholbedingte Konflikte: Ausschank ist vorgesehen
  (`alcohol_served = true`).
- Stauungs- und Gedrängesituationen am Einlass und in den Pausen bei
  350 Zuschauern in einem Objekt mit 500 Personen Kapazität.

Sportspezifische Gefährdungen (Kampfsport K1):
- Verletzung von Athleten durch Vollkontakttechniken; medizinische
  Erstversorgung muss sofort erreichbar sein.
- Übergriffe auf Schiedsrichter und Ringrichter bei strittigen
  Entscheidungen.
- Eindringen von Personen auf die Kampffläche während oder unmittelbar
  nach einem Kampf.

Örtliche und technische Gefährdungen:
- 4 Notausgänge bei 350 erwarteten Personen in einer Sporthalle:
  Lage und Beschilderung müssen vor Veranstaltungsbeginn geprüft werden.
- [OFFENER PUNKT] Vorhandensein eines Fluchtwegplans für diese
  Veranstaltung nicht im Input belegt.

Gefährdungen für das Sicherheitspersonal:
- Übergriffe durch erregte Zuschauer, insbesondere im Einlassbereich.
- Erschöpfung bei Mehrstundeneinsatz ohne fest geplante Pausen.
- [OFFENER PUNKT] Pausen- und Ablöseregelung nicht im Input geregelt.

---

**Warum das gut ist:**

- Jede Aussage stützt sich auf ein Inputfeld oder ist klar als
  Erfahrungswissen gekennzeichnet.
- Fehlende Informationen werden konsequent als `[OFFENER PUNKT]` markiert.
- Keine Behörden, keine Paragrafen, keine erfundenen Zahlen.
- Kategorisiert nach Publikum / Sport / Örtlichkeit / Personal — gleiche
  Struktur findet sich in `{GB_RISIKOBEWERTUNG}` und
  `{GB_SCHUTZMASSNAHMEN}` wieder.
