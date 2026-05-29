# Schreibanleitung — Schutzmaßnahmen

Block: `{GB_SCHUTZMASSNAHMEN}`.

## STOP-Prinzip — verbindliche Gliederung

```
S — Substitution
T — Technische Maßnahmen
O — Organisatorische Maßnahmen
P — Persönliche / individuelle Maßnahmen
```

In Sicherheitsdienstleistungen entfällt **Substitution** häufig (eine
Veranstaltung kann man nicht durch eine ungefährlichere ersetzen). In dem
Fall: kurze Notiz „Substitution nicht anwendbar — Veranstaltung selbst ist
Gegenstand der Beurteilung".

## Schreibstruktur

Jede der vier Ebenen erhält einen eigenen Absatz mit klar markierter
Überschrift im Fließtext. Bullet-Punkte oder Aufzählungsstriche sind erlaubt.

Das folgende Schema zeigt **nur die Struktur**. Es enthält **keine konkreten
Werte** (Minuten, Kopfzahlen, Paragraphen, Kanalnamen, Gerätemodelle). Solche
Werte werden ausschließlich aus dem Input des konkreten Auftrags übernommen
— oder, falls dort nicht belegt, als `[OFFENER PUNKT]` markiert.

```
S — Substitution:
- Nicht anwendbar (Tätigkeit ist Gegenstand der Beurteilung).

T — Technische Maßnahmen:
- <technische Maßnahme, abgeleitet aus einem Inputfeld>
  (z. B. Funkkommunikation zwischen den eingesetzten Rollen — konkrete
  Kanaleinteilung nur, wenn im Input belegt; sonst `[OFFENER PUNKT]`).
- <weitere technische Maßnahme, abgeleitet aus einem Inputfeld>
- ...

O — Organisatorische Maßnahmen:
- <organisatorische Maßnahme, abgeleitet aus einem Inputfeld>
  (z. B. Pre-Briefing der eingesetzten Kräfte durch die Einsatzleitung —
  Zeitpunkt und Dauer nur, wenn im Input belegt; sonst `[OFFENER PUNKT]`).
- <Positionierung / Aufgabenverteilung, abgeleitet aus
  `security_staff_count` und ggf. weiteren Rollenfeldern — Kopfzahlen pro
  Bereich nur, wenn im Input belegt; sonst `[OFFENER PUNKT]`>.
- <Eskalationskette: Ansprache → Aufforderung → Hausrechtsdurchsetzung →
  Anforderung Polizei>.
- <Übergabeschnittstelle zu angrenzenden Diensten (z. B. Sanitätsdienst),
  abgeleitet aus `medical_service` und vergleichbaren Inputfeldern>.
- ...

P — Persönliche Maßnahmen:
- <Sachkundeanforderung an das eingesetzte Personal>
  (die maßgebliche Rechtsgrundlage / Paragraphennummer ergibt sich aus
  dem konkreten Auftrag — niemals aus diesem Schema zitieren).
- <Erkennungsmerkmal / Dienstkleidung>.
- <ggf. Erste-Hilfe-Mittel: welche Rollen sie führen, ergibt sich aus dem
  Auftrag; nicht aus diesem Schema>.
- ...
```

Konkrete Stilreferenz (mit voll ausformulierten Sätzen, weiterhin
input-getrieben und ohne Beispielzahlen) steht in
`knowledge/10_examples/gb_schutzmassnahmen/veranstaltungsschutz_kampfsport.md`.

## Pflichten

- **Belegbarkeit**: Jede technische, organisatorische oder persönliche
  Maßnahme muss aus dem Input ableitbar sein. Wird Beleuchtung genannt,
  muss sie als „im Veranstaltungsobjekt vorhanden", „durch Veranstalter
  gestellt" oder als `[OFFENER PUNKT]` markiert sein — keine erfundenen
  Lichtanlagen.
- **Inputtreue bei konkreten Werten**: Konkrete Werte der folgenden
  Kategorien sind **nur** dann erlaubt, wenn sie wortgleich oder
  eindeutig ableitbar im Input des konkreten Auftrags stehen — und sind
  ansonsten als `[OFFENER PUNKT]` zu kennzeichnen:
  - minutengenaue Zeitangaben (Briefing-Zeitpunkte, Vorlaufzeiten,
    Pausenfenster usw.),
  - exakte Kopfzahlen pro Bereich oder Rolle (z. B. Personalverteilung
    auf Einlass, Innenraum, Ringbereich, Außenstreife),
  - benannte Funk- oder Kommunikationskanäle,
  - benannte Geräte- oder Anlagenmodelle,
  - konkrete Paragraphen-, Verordnungs- oder Gesetzeszitate.
  Sind sie nicht belegt, wird die Maßnahme generisch formuliert und der
  fehlende konkrete Wert als `[OFFENER PUNKT]` ausgewiesen.
- **Beispiele und Schemata sind keine Inhaltsquelle**: Werte, die nur in
  dieser Schreibanleitung, in einer anderen Schreibanleitung oder in
  einer Datei unter `knowledge/10_examples/` stehen, dürfen **niemals** als
  Auftragsinhalt übernommen werden. Sie dienen ausschließlich der
  Struktur- und Stilreferenz.
- **Verbindlichkeit**: Formulierungen wie „wird durchgeführt", „ist
  vorgesehen", „ist verbindlich geregelt".
- **Keine Konjunktive**: kein „sollte", „könnte", „wäre sinnvoll",
  „empfiehlt sich".

## Was niemals erlaubt ist

- Maßnahmen, die spezielles Equipment voraussetzen (Metalldetektor,
  Videoanlage, Bodyscanner), ohne dass das Equipment im Input genannt ist.
  → `[OFFENER PUNKT] Einsatz technischer Detektion nicht im Auftrag
  vereinbart.`
- Konkrete Minutenangaben, Kopfzahlen, Funkkanäle, Gerätemodelle oder
  Paragraphenzitate aus diesem Dokument oder aus Beispieldateien in den
  Auftragsoutput übernehmen.
- Aussagen, dass Maßnahmen „den gesetzlichen Anforderungen genügen".
  Das ist eine rechtliche Bewertung, die der GB-Bot nicht trifft.
- Nur PSA-Maßnahmen ohne vorgelagerte technische/organisatorische
  Maßnahmen — das verletzt das STOP-Prinzip.
