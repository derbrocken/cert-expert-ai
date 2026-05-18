# Gefährdungsbeurteilungs-Bot — Fachliche Spezifikation

Version: 1.0 | Erstellt: 2026-05-18 | Status: Aktiv

---

## 1. Zweck und Abgrenzung

### 1.1 Zweck

Der Gefährdungsbeurteilungs-Bot (GB-Bot) erzeugt **fachlichen Inhalt** für Gefährdungsbeurteilungen im Sicherheits- und Veranstaltungsdienst. Er übernimmt die regelkonforme, sachliche Formulierung der fachlichen Abschnitte auf Basis strukturierter Projektdaten.

### 1.2 Abgrenzung von Tool 1 (statische Dokumentgenerierung)

| Merkmal | Tool 1 (statisch) | GB-Bot (KI-gestützt) |
|---|---|---|
| Inhaltsquelle | Formularfelder, direkte Nutzereingabe | KI-generierter fachlicher Inhalt aus Projektdaten |
| Platzhalterinhalt | Direkte Werte: Name, Datum, Adresse | Fachprose: Gefährdungsanalyse, Risikobewertung, Maßnahmen |
| Adaptivität | Keine — Template + Eingabe = Output | Hoch — Inhalt variiert je nach Veranstaltungstyp, Risikoprofil, Standort |
| Validierung | Formularvalidierung | OFFENER PUNKT-Logik, QA-Status, fachliche Konsistenzprüfung |
| Freigabepflicht | Nicht zwingend | Immer erforderlich — kein automatisches finales Dokument |

**Der GB-Bot ersetzt nicht den Sachverständigen.** Er erstellt ein vorläufiges, auditnähes Arbeitsdokument, das durch einen Verantwortlichen geprüft und freigegeben werden muss.

---

### 1.3 Operationsmodi

Der GB-Bot unterstützt zwei Betriebsmodi. Der Bot selbst erkennt **nicht automatisch** welcher Modus aktiv ist — der Modus wird durch das aufrufende System (Pipeline / Orchestrator) festgelegt.

#### Standalone-Modus (Standard, aktuell implementiert)

Ein einzelnes GB-Dokument wird für einen spezifischen Anwendungsfall erstellt. Es gibt keine abhängigen Upstream- oder Downstream-Dokumente in diesem Workflow.

- Input: blueprint-spezifisches Input-JSON
- Output: strukturiertes `gb_*.json` + finales `gb_*.docx`
- Upstream-Kontext: keiner
- Open Points: nur aus eigenem Input generiert

#### Flow-Modus (geplant — nicht implementiert)

Das GB ist Teil einer abhängigen Dokumentenkette. Upstream-Dokumente (z. B. Sicherheitskonzept) werden als zusätzlicher Kontext übergeben.

- Input: blueprint-spezifisches Input-JSON **+ upstream_context**
- Output: strukturiertes `gb_*.json` + `gb_*.docx` **+ risk_findings / measures (Exports für Downstream)**
- Upstream-Kontext: Sicherheitskonzept (vollständig / partiell / fehlend)
- Open Points: eigene + aus unvollständigem Upstream-Kontext propagierte

Fehlende oder veraltete Upstream-Dokumente brechen die Pipeline **nicht** ab. Sie erzeugen
OFFENE PUNKTE mit Quelle: `[OFFENER PUNKT] (aus Sicherheitskonzept: Abschnitt X fehlt)`.

Detaillierte Spezifikation: `docs/BLUEPRINT_ARCHITECTURE.md` → Kapitel 5 (Dokumentabhängigkeiten).

---

### 1.4 Blueprint-Auswahl

Standalone-Modus bedeutet **nicht** ein generisches GB-Dokument. Auch im Standalone-Modus
muss der Nutzer zuerst einen **Blueprint (Schablone)** auswählen, weil dieser folgendes bestimmt:

- Dokumentstruktur und Kapitelreihenfolge (Inhaltsverzeichnis)
- Pflichtfelder im Input-Schema
- Risikokategorien
- AI-generierte Inhaltsblöcke (`GB_*`-Platzhalter)
- Blueprint-spezifische OFFENER PUNKT-Auslöser
- Blueprint-spezifische QA-Regeln
- Relevanz für nachgelagerte Dokumente
- Zugehöriges DOCX-Template

**Diese Spezifikation beschreibt den Blueprint `gb_event_kampfsport`** (Kampfsportveranstaltung).
Er ist der erste vollständig implementierte GB-Blueprint.

Weitere geplante GB-Blueprints:

| Blueprint-ID | Anwendungsfall |
|---|---|
| `gb_event_kampfsport` | Kampfsportturnier (erste Implementierung, aktiv) |
| `gb_event_standard` | Standardveranstaltung |
| `gb_object_standard` | Standardobjekt / Arbeitsplatz |
| `gb_mobile_service` | Mobiler Sicherheitsdienst / Streife |
| `gb_intervention` | Interventionsdienst |
| `gb_accommodation` | Geflüchtetenunterkunft |
| `gb_object_special` | Objekt mit besonderer Sicherheitsrelevanz |
| `gb_opv` | ÖPNV / Öffentlicher Personenverkehr |

Vollständige Blueprint-Registry-Spezifikation: `docs/BLUEPRINT_ARCHITECTURE.md` → Kapitel 4.

---

## 2. Rechtlicher Kontext (Nicht halluzinieren)

Der Bot darf folgende Regelwerke kennen und strukturell berücksichtigen, ohne konkrete Paragrafen, Grenzwerte oder Anforderungen zu erfinden:

| Regelwerk | Anwendungsbereich |
|---|---|
| ArbSchG §5 | Pflicht zur Gefährdungsbeurteilung für alle Arbeitsplätze |
| DGUV Vorschrift 1 (BGV A1) | Grundsätze der Prävention — Unfallverhütungsvorschrift |
| VStättVO (länderspezifisch) | Versammlungsstättenverordnung — Sicherheit bei Veranstaltungen |
| §34a GewO + BewachV | Bewachungsgewerbe — Anforderungen an Sicherheitspersonal |
| DGUV Information 211-010 | Leitfaden zur Durchführung von Gefährdungsbeurteilungen |

**Kritisch:** Der Bot darf Regelwerke als Kontext nutzen, aber **niemals spezifische Paragrafennummern, Grenzwerte, Personenzahlgrenzen oder behördliche Auflagen zitieren**, sofern diese nicht explizit im Input angegeben sind. Falsch zitierte Vorschriften in einem Sicherheitsdokument sind ein Haftungsrisiko.

---

## 3. Erforderliche Eingaben (Required)

Fehlende Pflichtfelder führen zu `[OFFENER PUNKT]`-Einträgen. Die Pipeline bricht **nicht** ab, setzt aber `qa_status: "review_required"`.

| Feld | Schlüssel | Typ | Beschreibung |
|---|---|---|---|
| Veranstaltungsname | `event_name` | String | Name der Veranstaltung |
| Veranstaltungstyp | `event_type` | String | z. B. „Kampfsportturnier", „Konzert", „Messe" |
| Datum | `event_date` | String | ISO: `YYYY-MM-DD` |
| Veranstaltungsort | `event_location` | String | Adresse / Örtlichkeit |
| Erwartete Zuschauerzahl | `expected_attendees` | Integer | Geplante Besucherzahl |
| Sicherheitsmitarbeiter | `security_staff_count` | Integer | Anzahl eingesetzter Kräfte |
| Hallenkapazität | `venue_capacity` | Integer | Maximale Personenkapazität laut Genehmigung |
| Notausgänge | `venue_exits` | Integer | Anzahl der Notausgänge |
| Besondere Risiken | `special_risks` | Liste | Spezifische, vom Auftraggeber benannte Risiken |
| Auftraggeber | `client_name` | String | Name des Auftraggebers |
| Erstellt von | `created_by` | String | Name des Erstellers |
| Dokumentversion | `doc_version` | String | z. B. `"1.0"` |

---

## 4. Optionale Eingaben

Fehlende optionale Felder erzeugen **keine** automatischen OFFENEN PUNKTE, sofern sie für den jeweiligen Veranstaltungstyp nicht kritisch sind.

| Feld | Schlüssel | Beschreibung |
|---|---|---|
| Freigegeben von | `approved_by` | Freigabeinstanz — leer bis zur Freigabe |
| Hinweise | `notes` | Freitext für besondere Umstände, Vorgeschichte |
| Veranstaltungsbeginn | `event_start_time` | Uhrzeit Einlass / Beginn |
| Veranstaltungsende | `event_end_time` | Planmäßiges Ende |
| Bühne / Ringfläche | `stage_area` | Vorhanden ja/nein, Abmessungen |
| Alkoholausschank | `alcohol_served` | Boolean |
| Außenbereich | `outdoor_area` | Boolean — erweitert Risikoprofil |
| Vorangegangene Vorfälle | `prior_incidents` | Frühere sicherheitsrelevante Ereignisse am Ort |
| Behördliche Auflagen | `official_requirements` | Vom Auftraggeber kommunizierte Behördenauflagen |
| Fluchtwegplan vorhanden | `evacuation_plan_available` | Boolean |
| Sanitätsdienst | `medical_service` | Art und Umfang des Sanitätsdienstes |

---

## 5. Kritische fehlende Informationen

Die folgenden Situationen erzwingen zwingend einen `[OFFENER PUNKT]`, auch wenn das Feld technisch optional ist:

| Situation | Begründung |
|---|---|
| `venue_exits` = 0 oder fehlt | Notausgänge sind sicherheitstechnisch nicht verhandelbar |
| `expected_attendees` > `venue_capacity` | Überbelegung — rechtlich kritisch, immer als OFFENER PUNKT |
| `security_staff_count` < 1 | Kein Personal angegeben — GB nicht sinnvoll |
| `event_type` fehlt | Ohne Veranstaltungstyp kann keine sachgerechte Gefährdungsermittlung erfolgen |
| `approved_by` fehlt | Dokument ist nicht freigegeben — immer OFFENER PUNKT im Freigabefeld |

---

## 6. Halluzinationsgrenzen — Was der Bot niemals erfinden darf

### 6.1 Absolut verboten

- Konkrete Paragrafennummern oder Grenzwerte aus Regelwerken
- Namen von Behörden, Prüfstellen, Verbänden
- Veranstaltungsorte, Raumgrößen, Fluchtwegpläne, Grundrissdaten
- Konkrete Personenzahlen, die nicht im Input stehen
- Angaben zu Alkohol, Drogen, Waffenkontrolle ohne Input
- Angaben über vergangene Vorfälle ohne Input
- Behördliche Auflagen oder Genehmigungen
- Zertifizierungen, Qualifikationen des Personals
- Vertragsdetails oder Haftungsregelungen

### 6.2 Erlaubte vorsichtige Inferenz

Der Bot darf **allgemeine, typische** Aussagen für bekannte Veranstaltungstypen treffen, sofern er diese klar als solche kennzeichnet und nicht als verbindliche Fakten darstellt. Akzeptable Inferenz:

| Situation | Erlaubte Inferenz | Kennzeichnung |
|---|---|---|
| Kampfsportturnier | Erhöhtes Aggressionspotenzial typisch bei intensiven Wettkämpfen | „erfahrungsgemäß", „typischerweise" |
| Großveranstaltung > 500 PAX | Erhöhter Koordinationsbedarf, Staubildung an Eingängen | Nur wenn Zuschauerzahl im Input |
| Alkoholausschank = true | Erhöhtes Risiko alkoholbedingter Konflikte | Nur wenn Feld explizit gesetzt |

**Der Bot darf nie allgemeine Inferenz als spezifische Tatsache formulieren.**

### 6.3 Grenzfälle — immer OFFENER PUNKT

- Spezifische Einsatzkräftezahlen über das Input hinaus vorschlagen
- Schutzmaßnahmen nennen, die spezifische Equipment-Typen voraussetzen (Metalldetektor, Videoanlage) ohne Input
- Flucht- oder Evakuierungswege beschreiben ohne Grundriss/Input
- Rechtliche Anforderungen als „erfüllt" markieren

---

## 7. Output-Struktur — Inhaltsverzeichnis des generierten Dokuments

Die fünf `GB_*`-Platzhalter entsprechen fünf Dokumentabschnitten:

### 7.1 `{GB_TAETIGKEIT}` — Tätigkeit / Einsatzbeschreibung

**Inhalt:**
- Art der Veranstaltung und der sicherheitsrelevanten Tätigkeit
- Einsatzumfang: Datum, Ort, Dauer (soweit im Input vorhanden)
- Kurze Beschreibung der einzusetzenden Sicherheitskräfte und ihrer Aufgaben
- Abgrenzung des Einsatzbereichs

**Stil:** Sachlich, dritte Person, auditnah. Keine Bewertung, nur Beschreibung.

**Länge:** 3–6 Sätze oder 2–3 strukturierte Abschnitte.

**Beispiel (Kampfturnier):**
> Die Sicherheitsmaßnahme betrifft die Absicherung des K1-Kampfturniers „Berlin Open" am 14.06.2026 in der Sporthalle Musterstraße 12, 10115 Berlin. Eingesetzt werden 6 Sicherheitsmitarbeiter des Auftragnehmers Cert-Expert GmbH. Aufgaben umfassen Einlasskontrolle, Personenbegleitung im Veranstaltungsbereich und Unterstützung bei der Evakuierung. [OFFENER PUNKT] Genaue Schichtplanung und Positionierung der Kräfte noch nicht festgelegt.

---

### 7.2 `{GB_GEFAEHRDUNGEN}` — Identifizierte Gefährdungen

**Inhalt:**
- Systematische Auflistung aller identifizierten Gefährdungen
- Gegliedert nach Gefährdungsarten (psychisch, physisch, Umgebung, Dritte)
- Quellenangaben nur wenn im Input (z. B. „laut Auftraggeber")
- OFFENER PUNKT für Bereiche ohne ausreichende Informationen

**Gliederungsempfehlung:**
1. Gefährdungen durch das Publikum (Aggressionen, Gedränge, Panik)
2. Gefährdungen durch die Örtlichkeit (Ausgänge, Sichtachsen, Bausubstanz)
3. Gefährdungen durch besondere Umstände (Alkohol, extreme Sportarten, Wetter)
4. Gefährdungen für das Sicherheitspersonal selbst (Übergriffe, Erschöpfung)

**Stil:** Aufzählungsform oder kurze Absätze je Gefährdungsbereich. Keine Relativierungen.

---

### 7.3 `{GB_RISIKOBEWERTUNG}` — Risikobewertung

**Inhalt:**
- Bewertung jeder identifizierten Gefährdung nach Eintrittwahrscheinlichkeit und Schwere
- Gesamtrisiko je Gefährdung (hoch / mittel / niedrig)
- Nur auf Basis der im Input gegebenen Fakten — keine Schätzung ohne Datenbasis

**Bewertungsmatrix (intern — nicht halluzinieren, nur anwenden):**

| Wahrscheinlichkeit | Schwere gering | Schwere mittel | Schwere hoch |
|---|---|---|---|
| Gering | Niedrig | Niedrig | Mittel |
| Mittel | Niedrig | Mittel | Hoch |
| Hoch | Mittel | Hoch | Hoch |

**Wichtig:** Der Bot darf diese Struktur anwenden, aber keine numerischen Risikokennzahlen (z. B. RPZ nach FMEA) erfinden.

**Stil:** Tabellarisch oder strukturierte Absätze je Gefährdung.

---

### 7.4 `{GB_SCHUTZMASSNAHMEN}` — Schutzmaßnahmen

**Inhalt:**
- Maßnahmen gegliedert nach STOP-Prinzip: Substitution → Technisch → Organisatorisch → Persönlich
- Nur Maßnahmen nennen, die auf Basis der Inputs begründbar sind
- Konkrete Maßnahmen (z. B. „Taschenkontrollen am Einlass") nur wenn Eingangskontrolle als Aufgabe im Input steht

**STOP-Prinzip im Veranstaltungskontext:**
- **S — Substitution:** Entfällt meist (Art der Veranstaltung nicht substituierbar)
- **T — Technisch:** Absperrungen, Beleuchtung, Kommunikationstechnik (nur wenn im Input)
- **O — Organisatorisch:** Personalaufstellung, Kommunikationsketten, Lageplanning
- **P — Persönlich:** PSA (sofern zutreffend), Schulung, Einsatzbriefing

**Stil:** Strukturierte Liste, verbindliche Formulierungen. Keine Konjunktive wie „sollte" oder „könnte" — stattdessen „wird durchgeführt", „ist vorgesehen".

---

### 7.5 `{GB_OFFENE_PUNKTE}` — Offene Punkte (Dokumentabschnitt)

**Inhalt:**
- Lesbare, vollständige Auflistung aller offenen Punkte
- Jeder Punkt mit Begründung, warum er offen ist
- Keine Redundanz — Konsolidierung ähnlicher Punkte

**Zweck:** Dieser Abschnitt ist der primäre Handlungsauftrag für den Verantwortlichen. Er muss abgearbeitet werden, bevor das Dokument freigegeben werden kann.

**Format:**
```
1. [OFFENER PUNKT] Freigabe durch Auftraggeber ausstehend — kein Eintrag im Feld "Freigegeben von".
2. [OFFENER PUNKT] Anzahl Notausgänge nicht bestätigt — Angabe aus Vorgespräch, nicht aus Hallenplan.
3. [OFFENER PUNKT] Sanitätsdienst nicht im Input angegeben — Art und Umfang unbekannt.
```

---

## 8. QA-Regeln (Qualitätsprüfung nach Generierung)

Die folgenden Regeln werden von `shared/quality_checker.py` automatisch geprüft. Darüber hinaus gelten inhaltliche QA-Regeln, die zukünftig durch erweiterte Prüflogik erfasst werden können.

### 8.1 Automatisierte QA (aktuell implementiert)

| Regel | Prüfung | Auswirkung |
|---|---|---|
| Leere Platzhalter | `GB_*` = `""` | OFFENER PUNKT automatisch hinzugefügt |
| OFFENER PUNKT im Text | Platzhalter enthält `[OFFENER PUNKT]` | In `open_points` übernommen |
| `approved_by` fehlt | Aus Input-Loader | OFFENER PUNKT im `pre_open_points` |
| Pflichtfelder fehlen | Alle Required-Felder | OFFENER PUNKT pro fehlendem Feld |
| `qa_status` | Aus Bot-Output | `"ok"` oder `"review_required"` |

### 8.2 Inhaltliche QA-Regeln (manuell zu prüfen, zukünftig erweiterbar)

| Regel | Beschreibung |
|---|---|
| Konsistenz Personen | `security_staff_count` aus Input muss in `GB_TAETIGKEIT` erscheinen |
| Konsistenz Ort | `event_location` muss in `GB_TAETIGKEIT` erscheinen |
| Keine fiktiven Zahlen | Keine Zahlen in `GB_RISIKOBEWERTUNG`, die nicht aus Input ableitbar sind |
| Kein Konjunktiv in Maßnahmen | `GB_SCHUTZMASSNAHMEN` darf keine unverbindlichen Formulierungen enthalten |
| OFFENER PUNKT korrekt notiert | Alle im Text gesetzten `[OFFENER PUNKT]` müssen auch in `open_points` stehen |

### 8.3 `qa_status`-Werte

| Wert | Bedeutung |
|---|---|
| `"ok"` | Kein einziger offener Punkt — vollständige Eingaben, vollständige Ausgabe |
| `"review_required"` | Ein oder mehrere offene Punkte — Pflicht zur manuellen Prüfung |
| `"parse_error"` | LLM hat nach 3 Versuchen kein valides JSON geliefert |

---

## 9. Mapping: Generierter Inhalt → DOCX-Template

| Bot-Ausgabe | DOCX-Token | Template-Position |
|---|---|---|
| `GB_TAETIGKEIT` | `{GB_TAETIGKEIT}` | Abschnitt 1 des Dokuments — Einsatzbeschreibung |
| `GB_GEFAEHRDUNGEN` | `{GB_GEFAEHRDUNGEN}` | Abschnitt 2 — Gefährdungsermittlung |
| `GB_RISIKOBEWERTUNG` | `{GB_RISIKOBEWERTUNG}` | Abschnitt 3 — Risikobewertung |
| `GB_SCHUTZMASSNAHMEN` | `{GB_SCHUTZMASSNAHMEN}` | Abschnitt 4 — Schutzmaßnahmen |
| `GB_OFFENE_PUNKTE` | `{GB_OFFENE_PUNKTE}` | Abschnitt 5 / Anhang — Offene Punkte |

**Alle Layer-1-Platzhalter** (`{CompanyName}`, `{CreatedBy}`, `{DocDate}`, `{Logo}` etc.) kommen aus `inputs/company_data.json` und werden durch `shared/docx_builder.py` vor dem Render-Aufruf gemergt. Der Bot kennt diese Felder nicht und befüllt sie nicht.

---

## 10. Portal-/Formular-Integration (Zukünftige Schnittstelle)

Für die spätere Integration über ein Web-Portal oder eine API sind folgende Input-Felder als Formularfelder vorgesehen:

### 10.1 Pflichtfelder im Formular

```
Veranstaltungsname       → event_name
Veranstaltungstyp        → event_type        (Dropdown: Konzert, Sport, Messe, ...)
Datum                    → event_date        (Datepicker)
Veranstaltungsort        → event_location    (Freitext + optional Geocodierung)
Erwartete Zuschauer      → expected_attendees (Zahl)
Sicherheitsmitarbeiter   → security_staff_count (Zahl)
Hallenkapazität          → venue_capacity    (Zahl)
Notausgänge              → venue_exits       (Zahl)
Auftraggeber             → client_name
Erstellt von             → created_by
Dokumentversion          → doc_version
```

### 10.2 Optionale Felder im Formular

```
Besondere Risiken        → special_risks     (Mehrfachauswahl + Freitext)
Freigegeben von          → approved_by       (leer bis Freigabe)
Hinweise                 → notes             (Freitext)
Alkoholausschank         → alcohol_served    (Checkbox)
Außenbereich             → outdoor_area      (Checkbox)
Sanitätsdienst           → medical_service   (Freitext)
Fluchtwegplan vorhanden  → evacuation_plan_available (Checkbox)
Behördliche Auflagen     → official_requirements (Freitext)
```

### 10.3 Zukünftiger Datenfluss

```
Portal-Formular
↓
POST /api/generate/gefaehrdungsbeurteilung
  Body: { event_name, event_type, ... }
↓
gb_bot.py:run(input_data)
↓
LLM-Generierung + QA
↓
{ document_type, placeholders, open_points, qa_status }
↓
docx_builder.render_docx()
↓
Node.js Renderer → templates/gefaehrdungsbeurteilung.docx
↓
GET /api/download/{job_id}.docx
```

---

## 11. Wichtige Designentscheidungen

| Entscheidung | Begründung |
|---|---|
| Bot gibt nur 5 Platzhalter aus | Einfaches, templatefähiges Output-Schema — erweiterbar |
| Bot setzt nie `qa_status: "ok"` selbst wenn er OFFENE PUNKTE hat | `quality_checker.py` überschreibt immer basierend auf tatsächlichem Inhalt |
| Kein finales Freigabedokument aus dem Bot | Das generierte Dokument ist immer ein Arbeitsdokument — finale Freigabe durch Menschen |
| Temperatur 0.3 | Niedrige Temperatur für deterministische, reproduzierbare Fachaussagen |
| 3 Retry-Versuche bei JSON-Parse-Fehler | Qwen3 kann gelegentlich Markdown-Blöcke hinzufügen — robuste Bereinigung + Retry |
| Kein RAG / keine Wissensdatenbank jetzt | Stabile Python-Basis zuerst — Wissensbasis-Integration in späterer Phase |
