# SDL — Veranstaltung mit besonderer Sicherheitsrelevanz (DIN 77200-2 Kap. 5)

**Knowledge-Pfad:** `knowledge/3_sdls/veranstaltung_besondere_sicherheitsrelevanz/`  
**Norm-CEKS:** [[../../1_standards/DIN 77200-2/05_veranstaltungen_besondere_sicherheitsrelevanz]]  
**Profilvorlage:** Anhang C.1 — [[../../1_standards/DIN 77200-2/anforderungsprofile/77200-2_veranstaltung_besondere_sicherheitsrelevanz]]

**Ergänzend (nicht ersetzend):** [[../veranstaltungsschutz/base]] und ggf. Subtyp (z. B. [[../veranstaltungsschutz/subtypes/kampfsport]]) für genrespezifische Risiken.

---

## Wofür dieses Modul

Bot-taugliches SDL-Wissen für Veranstaltungen, die der **Auftraggeber** als **besonders sicherheitsrelevant** einstuft und die nach **77200-2** (nicht nur 77200-1 Anhang A) abgesichert werden.

**Keine Normabschrift.** Keine Paragrafen, Kapazitätszahlen, behördlichen Grenzwerte oder konkreten Kräfteansätze erfinden — nur aus **Input** oder referenzierten Unterlagen (SK, EK, Profil).

---

## Abgrenzung: 77200-2 Kap. 5 vs. 77200-1 Veranstaltung

| Merkmal | 77200-1 Veranstaltungssicherungsdienst | **77200-2 Kap. 5 (dieses Modul)** |
|---------|----------------------------------------|-----------------------------------|
| Auslöser | Reguläre Veranstaltung nach Anhang A | **AG-Einstufung** „besondere Sicherheitsrelevanz“ |
| Planungsgrundlage | Profil, ggf. vereinfachte Planung | **Sicherheitskonzept (SK) des AG** + **Einsatzkonzept (EK) des AN** |
| Dokumentenkette | variabel | **SK + EK Pflicht** |
| Profil | Anhang A | **Anhang C.1** |
| Bot-Hinweis | `veranstaltungsschutz/base` | **dieses Modul** + bei Bedarf Subtyp |

**Agent:** Wenn im Input „besondere Relevanz“, „77200-2“, „Kap. 5“, „Anhang C“ oder SK-Pflicht genannt wird → dieses Modul laden. Nur „Veranstaltung“ ohne Einstufung → **nicht** Kap.-5-Logik anwenden.

---

## Besondere Sicherheitsrelevanz — Schutzbedarfslogik

Die Einstufung bedeutet: Der AG hat eine **Einzelfallbewertung** vorgenommen. Typische **Indikatoren** (nur nennen, wenn im Input belegt):

- hohe oder schwer steuerbare **Personenzahl**
- erhöhte **Konflikt-**, **Randale-** oder **Anschlagsgefahr** (soweit AG/Behörde kommuniziert)
- **komplexe Venue** (mehrere Zonen, temporäre Bauten, Außen-/Innenkombination)
- **hohes Medien- oder politisches Interesse**
- **Vorgeschichte** relevanter Vorfälle am Ort oder bei vergleichbaren Events
- **besondere Schutzgüter** (VIP, kritische Infrastruktur am Rand, sensible Mitwirkende)

**Schutzbedarf** steigt mit: Unübersichtlichkeit der Flächen, Engstellen, fehlender Trennung von Zielgruppen, unklarer Verantwortlichkeit, fehlendem oder veraltetem SK.

Der Bot beschreibt **Schutzbedarf qualitativ** (niedrig/mittel/hoch je Bereich) — **ohne** erfundene Sicherheitsstufen oder Behördenklassifikationen.

---

## Typische Einsatzlagen

| Lage | Merkmale | Typische SMA-Schwerpunkte |
|------|----------|---------------------------|
| **Großkonzert / Festival** | viele Zonen, langer Zeitstrahl, Open-Air möglich | Einlass, Crowd, Backstage, Abschirmung, Nacht |
| **Sport-Topspiel** | Block-/Fan-Trennung, emotionale Spitzen | Einlass, Deeskalation, Observation |
| **Politische / mediale Großveranstaltung** | erhöhte Eskalationsgefahr, VIP | Zugang, VIP-Schutz, Medienabgrenzung |
| **Messe / Kongress mit Sicherheitsstufe** | Lieferantenverkehr, Akkreditierung | Ausweise, Zonen, Nachtbewachung |
| **Kampfsport / Show-Event** (Subtyp) | Ring, Fan-Lager, Athletenrisiko | siehe [[../veranstaltungsschutz/subtypes/kampfsport]] |

**Zeitachse** (für SK/EK/GB phasenbezogen — Details aus [[../veranstaltungsschutz/base#Veranstaltungsphasen — operativer Bezugsrahmen]]):

Aufbau → Einlass → Hauptprogramm → Pausen/Übergänge → Auslass → Abbau.

---

## Typische Rollen und Positionen (Anhang C.1 — Raster)

Aus Profil-Tätigkeiten abgeleitet; **konkrete Besetzung** nur bei Input/SK/EK:

| Rolle / Tätigkeitscluster | Bot-Relevanz |
|---------------------------|--------------|
| **Einlass / Zu- und Ausgangskontrolle** | Personen- und ggf. Gepäckkontrolle (Scanner/DMD) |
| **Lenkung / Lotung / Begleitung** | Besucherströme, Engstellen |
| **Observation / Überwachung** | Präsenz, Früherkennung |
| **Abschirmung / VIP-Nähe** | Schutz von Personen und Bereichen |
| **Verkehrslenkung** | Fahrzeuge, Lieferanten, Notwege freihalten |
| **Technik / GMA-VMA / Alarmverifikation** | Leitstelle, Notschaltungen — wenn im Profil |
| **Schließmittel** | Schlüssel, Zutrittsberechtigungen |
| **Einsatzleitung / Gruppenführer** | Führung, Funk, Eskalation — FK-Schulung relevant (CEKS, nicht Bot-Inhalt) |

Stufen A/B/C je Tätigkeit kommen aus dem **abgestimmten Profil** — der Bot **erfindet** keine Stufen.

---

## Typische Gefährdungen (Themenraster)

Nur übernehmen, was für den **konkreten Input** und ggf. SK plausibel ist.

### Publikum und Crowd

- Gedränge, Engstellen, **Crowd Crush** / Panik
- Gewalt, Randale, Konflikte zwischen Gruppen
- Alkohol-/Drogeneinfluss (falls Ausschank / Input)
- Einlass mit verbotenen Gegenständen (wenn Kontrolle im Profil)

### Ort und Technik

- Verstellte oder unzureichende **Notausgänge** / Fluchtwege
- Temporäre Aufbauten, Stolperstellen, Bühnen-/Zugangsränder
- Beleuchtung, Wetter (Open Air), Strom/Technik

### Organisation und Schnittstellen

- Unklare Verantwortlichkeiten AG ↔ AN ↔ Behörden
- Fehlende oder verspätete **Lageänderungen** (Programm, Sperrungen)
- Medien / Social Media — Verhalten und Eskalation

### Personal (SMA)

- Übergriffe auf Sicherheitskräfte
- Erschöpfung bei langen Events / fehlende Pausenrotation
- Alleinarbeit in unübersichtlichen Bereichen

### Evakuierung und Brand

- Blockierte Wege, unklare Sammelpunkte
- Räumungsszenarien ohne abgestimmtes SK/EK → `[OFFENER PUNKT]`

---

## Typische Schutzmaßnahmen (Themenraster)

Struktur nach **technisch → organisatorisch → personenbezogen** (STOP/TOP in GB-Produktregeln).

- **Kapazitäts- und Einlasssteuerung** — nur mit Zahlen aus Input/SK
- **Zonen- und Besucherlenkung** — Zonenplan nur referenzieren, wenn belegt
- **Deeskalation und Trennung** — vor Polizei-Eskalation
- **Einsatzführung und Funk** — Struktur nennen, Kanäle nicht erfinden
- **Positionierung** an Einlass, Engstellen, Notausgängen, VIP — ohne erfundene Kopfzahlen
- **Evakuierungs- und Notfallorientierung** — nur aus SK/EK; sonst OP
- **Medien- und Verhaltensregeln** — für ODA/DI-Verweis, nicht als Ersatz für EK
- **Wetter-/Open-Air-Plan B** — nur bei `outdoor_area` o. Ä. im Input

Maßnahmen aus dem **SK des AG** haben **Vorrang** vor neu erfundenen Maßnahmen in GB/EK — der Bot **ergänzt** arbeitsschutzbezogen (GB) bzw. **operationalisiert** (EK), widerspricht nicht dem SK.

---

## Schnittstellen: AG, Polizei, Feuerwehr, Sanitätsdienst

Übernimmt Prinzipien aus [[../veranstaltungsschutz/base#Schnittstellenlogik (allgemein)]] — hier Kap.-5-spezifisch:

| Partner | Rolle | Bot-Regel |
|---------|-------|-----------|
| **Auftraggeber (AG)** | SK, Genehmigungen, Veranstaltungsleitung, ggf. Hausrecht | SK-Inhalte **nicht** als AN-Eigenleistung darstellen; AG-Einstufung dokumentiert |
| **Auftragnehmer (AN)** | EK, Personal, Umsetzung SK-Vorgaben | EK beschreibt **operative** Umsetzung |
| **Polizei / Ordnungsbehörde** | öffentliche Sicherheit, hoheitliche Maßnahmen | keine erfundenen Einsatzkräfte, keine Zusagen „Polizei ist vor Ort“ ohne Input |
| **Feuerwehr / Brand** | Brandfall, technische Hilfe | Räumung nur nach SK/Objektlogik; sonst OP |
| **Sanitätsdienst / Rettung** | medizinische Versorgung | Übergabe bei Notlagen; SMA ersetzt **keinen** Sanitäter |
| **Veranstalter / Objekt** | Venue, Betrieb, Fluchtwege | bauliche Angaben nur bei Input/Unterlage |

**Eskalationskette (hausrechtlich):** Ansprache → Aufforderung → Hausrecht → ggf. Polizei — Feinsteuerung aus SK/EK/Auftrag.

---

## Relevanz für Dokumentprodukte (Bot-Kette)

| Produkt | Wer | Typische Inhalte aus diesem SDL | Upstream |
|---------|-----|----------------------------------|----------|
| **SK** | AG | Schutzziele, Gefährdungslage, Zonen, Kräftebedarf, Behörden, Evakuierungsrahmen | Projektkontext |
| **GB** | AN (arbeitsschutz) | Gefährdungen und Maßnahmen für **eingesetzte SMA**; Bezug zu Tätigkeiten aus Profil | **SK** (empfohlen/pflichtlogisch) |
| **EK** | AN | Abschnitte, Funk, Einlassablauf, Störung, Evakuierung, Schichten | **SK** + **GB** (Risiken/Maßnahmen) |
| **ODA / DI** | AN | Verhalten, Meldewege, Hausrecht, Einlass — **täglicher Dienst** | **EK** + relevante GB-Maßnahmen |

**Prüfreihenfolge für Bots (Orientierung):**

```
AG-Einstufung belegt? → SK-Status → Profil C.1 → EK-Bezug → fachliche Generierung (GB/EK/ODA)
```

Qualifikation und Freigabe: **nicht** in diesem Modul — CEKS unter `qualifications/`, nicht duplizieren.

---

## Was der Bot nicht erfinden darf

Immer `[OFFENER PUNKT]`, wenn nicht im **Input** oder **referenziertem SK/EK/Profil**:

| Thema | Grund |
|-------|--------|
| AG-Einstufung „besondere Relevanz“ | Tatbestand Kap. 5 — ohne Beleg unsicher |
| Zuschauerzahl, Kapazität, Notausgänge | sicherheitstechnisch kritisch |
| SK vorhanden / aktuell / vollständig | Pflichtlogik 77200-2 |
| EK-Struktur (Abschnitte, Funk, Kräfte) | operatives Kernstück |
| Zonenplan, Lageplan, Sammelplätze | nur aus Anlagen |
| Polizei- oder Feuerwehrdisposition | hoheitlich |
| Sanitätsstärke, Equipment, Ringarzt | medizinisch/veranstalterisch |
| Konkrete Kopfzahlen SMA je Position | nur aus SK/EK/Input |
| Behördliche Auflagen und Genehmigungen | nur wenn `official_requirements` o. Ä. |
| Genre-/Verbandsregeln (Kampfsport etc.) | Subtyp oder Input |

**Warnung:** Profil **nur** Anhang A bei gleichzeitiger Aussage „besondere Relevanz“ → widersprüchlich; als OP oder Klärungsbedarf markieren.

---

## Kombination mit anderen Modulen

| Situation | Module laden |
|-----------|--------------|
| Kap. 5, allgemeines Event | **dieses `base.md`** |
| Kap. 5 + Kampfsport | **dieses `base.md`** + `veranstaltungsschutz/subtypes/kampfsport.md` |
| Nur 77200-1 Stadtfest | `veranstaltungsschutz/base` — **ohne** dieses Modul |
| Qualifikationscodes / Freigabe | `1_standards/.../qualifications/` — separater Kontext |

---

## Folgearbeiten (nicht in diesem Schritt)

| Prio | Arbeit | Ziel |
|------|--------|------|
| **P1** | `gb_event_kampfsport.json` (oder `gb_event_kap5`) — `context_modules.sdls` um **dieses Modul** ergänzen; `input_schema`: `ag_einstufung`, `sk_status`, `profil_ref` | GB-Bot kennt Kap.-5-Pflicht |
| **P1** | `6_products/sicherheitskonzept/purpose.md` + `content_blocks.md` | SK-Bot-Vorbereitung |
| **P2** | `10_rules/blueprints/gb_event_kap5.md` oder Erweiterung gb_event-Regeln | SK/EK-Pflicht in QA |
| **P2** | Beispiele `11_examples/sk_*`, `ec_*` für Kap. 5 | Stil Kalibrierung |
| **P3** | Blueprints `sk_event_*`, `ec_event_*`, `oda_event_*` | vollständige Kette |

Siehe [[../../../docs/BOT_KNOWLEDGE_GAP_REPORT.md]].

---

## Verifikation (Menschen, nicht Bot)

Tatbestand Kap. 5.1 und Schulungsumfänge vor Auditentscheid gegen Primärquelle DIN 77200-2:2020-07 und abgestimmtes Profil C.1 prüfen — CEKS: [[../../1_standards/DIN 77200-2/05_veranstaltungen_besondere_sicherheitsrelevanz#Verifikation]].
