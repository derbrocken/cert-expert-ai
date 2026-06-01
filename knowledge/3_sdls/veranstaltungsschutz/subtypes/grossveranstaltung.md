# SDL-Subtyp — Großveranstaltung (Meta-Subtyp)

Ergänzungsmodul zu `veranstaltungsschutz/base.md`. **Fallback- und Meta-Subtyp**,
wenn **kein** genrespezifischer Subtyp passt oder die Veranstaltung
genreübergreifend ist. Liefert eine **genre­neutrale** Crowd- und
Koordinationslogik.

**Abgrenzung wichtig:** „Großveranstaltung" ist hier ein **Typ-Fallback**, **nicht**
die Einstufung nach DIN 77200-2 Kap. 5. Eine besondere Sicherheitsrelevanz wird
**ausschließlich** über Schicht 3 abgebildet
([[../veranstaltung_besondere_sicherheitsrelevanz/base]]) und **nie** allein aus
„groß" abgeleitet.

## Was Großveranstaltungen besonders macht

- Hohe absolute Personenzahl und ausgedehnte oder verteilte Flächen.
- Mehrere parallele Bereiche/Zonen mit eigener Lagedynamik.
- Lange Betriebsdauer und gestaffelte Personenströme.
- Erhöhte Abhängigkeit von Einsatzführung und Kommunikation.
- Regelmäßige Einbindung von Behörden und Rettungsdiensten.

## Wann diesen Subtyp laden

| Situation | Laden |
|-----------|--------|
| Genre unklar oder gemischt (z. B. „City-Event“, Sport + Show) | **Ja** — dieses Modul |
| Genre klar (Fußball, Konzert, …) | **Genre-Subtyp** + `base.md`; dieses Modul **nur** bei zusätzlich sehr großer, zonenreicher Lage |
| Nur hohe Zuschauerzahl, sonst klares Genre | Genre-Subtyp reicht; Größe im Input, nicht als Ersatz für Genre |

**Kombination:** `base.md` + **ein** Genre-Subtyp + optional dieses Modul — **nie** Genre durch „groß“ ersetzen.

## Risikoschwerpunkte (Themenraster)

### Publikum / Personenströme

- Massenandrang, Engstellen und Rückstaus an Zu- und Ausgängen.
- Crowd-Crush-Gefahr an Übergängen und Sichtpunkten.
- Orientierungsverlust auf großen oder verteilten Flächen.
- Ungleichmäßige Verteilung mit lokaler Überlastung einzelner Zonen.

### Fläche / Infrastruktur

- Lange Flucht- und Rettungswege, mehrere Sammelpunkte.
- Mehrere Zonen mit unterschiedlicher Nutzung und Zutrittslogik.
- Wetterexposition bei Open-Air-Flächen.
- Versorgungs- und Andienungsverkehr im laufenden Betrieb.

### Organisation / Kommunikation

- Risiko von Kommunikationsausfall über große Distanzen.
- Unklare Verantwortlichkeiten an Zonen- und Schnittstellengrenzen.
- Koordinationsbedarf zwischen mehreren Teileinsatzleitungen.

### Sicherheitspersonal

- Lange Dienstzeiten, Ermüdung, Konzentrationsabfall.
- Alleinarbeit in entfernten oder unübersichtlichen Zonen.
- Erschwerte Nachsteuerung bei plötzlichen Lageänderungen.

## Typische Schutzmaßnahmen (Themenraster)

- Klar benennbare Einsatzleitung / Koordinationsstelle mit Zonenstruktur.
- Kapazitäts- und Zugangssteuerung, Sichtachsen, Lenkung an Engstellen.
- Evakuierungslogik mit Sammelpunkten — nur mit vorliegender Objekt-/Eventlogik.
- Redundante Kommunikationswege und definierte Meldekette.
- Schnittstellen zu Behörden, Polizei und Rettungsdienst nach klärbarem Muster.
- Schicht- und Pausenregelung wegen langer Betriebsdauer.
- Falls Genre erkennbar: zusätzlich passenden Genre-Subtyp laden, statt nur
  diesen Meta-Subtyp.

## Schnittstellen-Schwerpunkt (typisch)

Querschnitt: [[../base#Schnittstellenlogik (allgemein)]]. Bei Großlagen besonders:

- **Einsatzleitung / Zonenführung** — Koordination über Distanzen.
- **Behörden / Polizei / Rettungsdienst** — Lagebild, Kapazität (nur belegt).
- **Veranstalter** — Zonen, Programm, Sperrungen.
- **Objekt / Arealbetrieb** — Wege, Sammelpunkte, Infrastruktur.

## Bezug Dokumentprodukte (Orientierung)

| Produkt | Typischer Fokus aus diesem Subtyp |
|---------|-----------------------------------|
| **GB** | Engstellen, Massenandrang, Kommunikationsausfall |
| **SK** | Zonenkonzept, Einsatzführung, Behörden, Evakuierungsrahmen |
| **EK** | Zonen, Meldekette, Kapazitätssteuerung, Schichten |
| **ODA** | nur bei dauerhaftem Objekt-/Arealbezug |

## Was **nicht** ohne Input behauptet werden darf

- Konkrete Kapazitäten, Personenzahlen, Flächen- oder Wegemaße.
- Eine Einstufung nach 77200-2 Kap. 5 (nur über Schicht 3 und AG-Einstufung).
- Anzahl und Aufstellung von Einsatzkräften, Sanität oder Polizei.
- Räumungsreihenfolgen oder Sammelplätze ohne belegte Objekt-/Eventunterlage.
- Genrespezifische Risiken — dafür den jeweiligen Subtyp verwenden.
