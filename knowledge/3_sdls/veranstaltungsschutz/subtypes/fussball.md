# SDL-Subtyp — Fußballveranstaltung

Ergänzungsmodul zu `veranstaltungsschutz/base.md` für Fußball-Events.
Behandelt typische Anwendungsfälle: Ligaspiel, Pokalspiel, Freundschaftsspiel,
vom kleinen Amateurplatz bis zum Stadion. Liga-, verbands- oder
stadionspezifische Vorgaben gelten **nur**, wenn sie im Input belegt sind.

## Was Fußballevents besonders macht

- Ausgeprägte Lagerbildung: Heim- und Auswärtsfans mit Rivalität.
- Hohe Emotionalität, die an Spielverlauf und Schiedsrichterentscheidungen
  gekoppelt ist.
- Häufig wiederkehrende Publika mit eingespielten Verhaltensmustern.
- Übergänge An-/Abreise sind oft sicherheitskritischer als das Spiel selbst.
- Polizei und Ordnungsbehörde sind regelmäßig beteiligte Schnittstellen.

## Stadion vs. Amateur / kleiner Platz

| Ausprägung | Typische Besonderheit | Bot-Hinweis |
|------------|----------------------|-------------|
| **Profistadion / größere Arena** | Blockstruktur, Innenraum, getrennte Fanwege, Video, Polizei im Regelfall relevant | Blocktrennung, An-/Abreise und Innenraum nur mit Input belegen |
| **Amateur / Sportplatz** | Geringere Infrastruktur, oft offenes Umfeld, weniger technische Trennung | Keine Stadionannahmen; Pyro/Hausrecht nur bei Auflage oder Input |
| **Neutraler Platz** | Ausgeglichene Lager, andere Dynamik als Heimspiel | Heim/Auswärts-Logik im Input klären |

Ohne Input **keine** Annahme zu Liga, Kapazität oder polizeilicher Begleitung.

## Risikoschwerpunkte (Themenraster)

### Publikum

- Konflikte und Übergriffe zwischen Heim- und Auswärtslagern.
- Massenreaktion und Gedränge bei Toren, Einlass und Abpfiff.
- Mitgeführte verbotene Gegenstände, Wurfgegenstände, Pyrotechnik.
- Alkohol- oder Drogeneinfluss, sofern Ausschank/Zugang gegeben.

### Spielfeld / Innenraum

- Eindringen von Personen auf das Spielfeld (Flitzer, Platzsturm).
- Übergriffe auf Spieler, Schiedsrichter, Betreuer.
- Pyrotechnik-Einsatz mit Brand-, Rauch- und Verletzungsgefahr.
- Block- und Zaununterführungen als Engstellen.

### An-/Abreise und Umfeld

- Fanmärsche, getrennte Anreisewege, Aufeinandertreffen rivalisierender Gruppen.
- Rückstaus und unkontrollierte Personenströme nach Spielende.
- Schnittstelle zum öffentlichen Raum außerhalb des Hausrechts.

### Sicherheitspersonal

- Übergriffe durch erregte Zuschauer, insbesondere bei Blocktrennung.
- Erschöpfung durch lange Dienste inkl. An-/Abreisephasen.
- Konflikteskalation an Blockgrenzen und Einlässen.

## Typische Schutzmaßnahmen (Themenraster)

- Trennung von Heim- und Auswärtsbereichen (Blöcke, Wege, Einlässe).
- Einlasskontrolle inkl. Taschen-/Gegenstandskontrolle, falls Hausrecht oder
  Auflagen dies vorsehen (nur erwähnen, wenn als Aufgabe im Input).
- Vorab definierte Eskalationsstufen für Crowd- und Lagerkonflikte.
- Abstimmung und klare Aufgabenabgrenzung mit Polizei und Ordnungsbehörde.
- Video-/Beobachtungsunterstützung zur Früherkennung, sofern vorhanden.
- Spielfeldnaher Schutz von Spielfeld, Schiedsrichter und Innenraum.
- Klare Funkkanäle: Einsatzleitung, Blockbereiche, Einlass, Innenraum.

## Schnittstellen-Schwerpunkt (typisch)

Querschnitt: [[../base#Schnittstellenlogik (allgemein)]]. Für Fußball besonders häufig:

- **Stadionbetrieb / Objekt** — Zutritt, Innenraum, Hausrechtsteile.
- **Polizei / Ordnungsbehörde** — Lager, An-/Abreise, Eskalation (nur bei belegter Absprache).
- **Veranstalter / Veranstaltungsleitung** — Programm, Sperrungen, Kommunikation.
- **Sanität** — bei Massenreaktionen und Innenraumvorfällen.

## Bezug Dokumentprodukte (Orientierung)

| Produkt | Typischer Fokus aus diesem Subtyp |
|---------|-----------------------------------|
| **GB** | Gefährdungen/Maßnahmen Publikum, Innenraum, An-/Abreise |
| **SK** | Lagebild, Zonen, Behördenabstimmung, Eskalationslogik |
| **EK** | Kräfte an Blöcken, Einlass, Innenraum, Funk, Phasen An-/Abreise |
| **ODA** | Hausrecht, Meldewege, Verhalten an Blockgrenzen (wenn Objektbezug) |

## Was **nicht** ohne Input behauptet werden darf

- Stadionordnungen, Liga- oder Verbandsauflagen (DFB, DFL, UEFA …) —
  diese variieren je Wettbewerb und Veranstalter.
- Konkrete Kapazitäten, Blockgrößen, Zuschauerzahlen oder Mindestabstände.
- Vorhandensein und Stärke einer polizeilichen Begleitung, sofern nicht im Input.
- Trennung der Verantwortung Hausrecht ↔ Polizei ohne belegte Absprache.
- Vorgaben zu Pyrotechnik-Sanktionen — Sache von Veranstalter/Behörde.
