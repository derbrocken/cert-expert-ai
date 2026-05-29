# Cert-Expert AI — Blueprint Architecture

Version: 1.0 | Erstellt: 2026-05-18 | Status: Planung

---

## 1. Kernprinzip: Blueprint-gesteuertes Dokumentsystem

Das Cert-Expert AI System ist **kein freier Dokumentgenerator**. Es ist ein
**blueprint-gesteuertes Fachbot-System**. Jedes Dokument, das das System erzeugt,
basiert auf einer vordefinierten Schablone (Blueprint), die folgendes festlegt:

- Dokumentstruktur und Kapitelreihenfolge
- Pflicht- und optionale Eingabefelder
- Welche Abschnitte von der KI generiert werden
- Welche Abschnitte statisch im Template verbleiben
- Blueprint-spezifische QA-Regeln und OFFENER PUNKT-Logik
- Risikokategorien für diesen Anwendungsfall
- Abhängigkeiten zu vor- und nachgelagerten Dokumenten

**Die KI generiert ausschließlich fachlichen Inhalt für definierte Inhaltsblöcke.**
Dokumentarchitektur, Kapitelstruktur, Layout und statischer Inhalt werden durch das
Word-Template des Blueprints festgelegt — nicht durch die KI.

---

## 2. Blueprint vs. Dokument

| Ebene | Was es ist | Wer es definiert | Wann es entsteht |
|---|---|---|---|
| **Blueprint** | Schablone für einen Dokumenttyp | Cert-Expert (Fachexperte) | Einmalig, gepflegt |
| **Template** | Word-Datei für diesen Blueprint | Cert-Expert (Template-Autor) | Einmalig pro Blueprint |
| **Dokument** | Konkrete Instanz für ein Projekt | KI + Inputs | Bei jedem Auftrag |
| **Input** | Projektdaten für diese Instanz | Nutzer / Portal / Formular | Bei jedem Auftrag |

Ein Blueprint ist langlebig. Ein Dokument ist eine Instanz.

---

## 3. Operationsmodi

### 3.1 Standalone-Modus

Ein einzelnes Fachbot-Dokument wird für einen spezifischen Anwendungsfall erstellt.
Es gibt keine abhängigen Folgedokumente in diesem Workflow.

```
Nutzer wählt Blueprint
        ↓
Eingabeformular / Input-JSON (blueprint-spezifisch)
        ↓
Fachbot generiert strukturierten Inhalt
        ↓
QA-Prüfung
        ↓
DOCX-Output (blueprint-spezifisches Template)
```

**Beispiele:**
- Eine einzelne Gefährdungsbeurteilung für ein Objekt
- Ein einmaliges Sicherheitskonzept für eine Veranstaltung ohne Folgedokumente

### 3.2 Flow-Modus (Dokumentkette)

Ein Dokument ist Teil einer abhängigen Dokumentenkette. Informationen, Risiken,
Maßnahmen und offene Punkte aus übergeordneten Dokumenten fließen in nachgelagerte
Dokumente ein.

```
[Kunden-/Projektkontext]
        ↓
[Sicherheitskonzept]  ← extern (vom Kunden) oder intern generiert
        ↓
[Gefährdungsbeurteilung]  ← objektbezogen, referenziert SK
        ↓
[Einsatzkonzept]  ← übernimmt Risiken + Maßnahmen aus GB
        ↓
[ODA]  ← konsistent mit EC + GB
        ↓
[Einweisungen / Unterweisungen]  ← referenzieren GB + EC
```

**Wichtig:** Das System muss **unvollständige Ausgangszustände** unterstützen.
Ein Sicherheitskonzept kann fehlen, veraltet oder nur teilweise vorhanden sein.
Das System bricht nie ab — es markiert fehlende Upstream-Informationen als
`[OFFENER PUNKT]` und setzt `qa_status: "review_required"`.

---

## 4. Blueprints — Gefährdungsbeurteilung

Die GB ist der erste implementierte Dokumenttyp. Die folgenden Blueprints sind definiert
oder geplant. Jeder Blueprint hat ein eigenes DOCX-Template und eine eigene Input-Schablone.

### 4.1 Übersicht GB-Blueprints

| Blueprint-ID | Anwendungsfall | Status |
|---|---|---|
| `gb_event_standard` | Standardveranstaltung | Geplant |
| `gb_event_kampfsport` | Kampfsportturnier (erste Implementierung) | Aktiv |
| `gb_object_standard` | Standardobjekt / Arbeitsplatz | Geplant |
| `gb_mobile_service` | Mobiler Sicherheitsdienst / Streifendienst | Geplant |
| `gb_intervention` | Interventionsdienst | Geplant |
| `gb_accommodation` | Geflüchtetenunterkunft / Beherbergung | Geplant |
| `gb_object_special` | Objekt mit besonderer Sicherheitsrelevanz | Geplant |
| `gb_opv` | ÖPNV / Öffentlicher Personenverkehr | Geplant |

### 4.2 Blueprint-Struktur: `gb_event_kampfsport`

Dieses Blueprint ist die erste konkrete Implementierung. Es definiert alle Aspekte
für die Durchführung einer GB bei Kampfsportveranstaltungen.

#### Inhaltsverzeichnis (DOCX-Kapitelstruktur)

```
1. Einsatzbeschreibung
   {GB_TAETIGKEIT}

2. Veranstaltungsspezifische Gefährdungsanalyse
   2.1 Publikumsbezogene Gefährdungen
   2.2 Sportspezifische Gefährdungen (Kampfsport)
   2.3 Örtliche und technische Gefährdungen
   {GB_GEFAEHRDUNGEN}

3. Risikobewertung
   {GB_RISIKOBEWERTUNG}

4. Schutzmaßnahmen
   4.1 Technische Maßnahmen
   4.2 Organisatorische Maßnahmen
   4.3 Personenbezogene Maßnahmen
   {GB_SCHUTZMASSNAHMEN}

5. Verantwortlichkeiten
   {GB_VERANTWORTLICHKEITEN}

6. Offene Punkte
   {GB_OFFENE_PUNKTE}
```

#### Blueprint-spezifische Pflichtfelder

```
event_name, event_type, event_date, event_location
expected_attendees, security_staff_count
venue_capacity, venue_exits
special_risks (Liste), client_name, created_by, doc_version
```

#### Blueprint-spezifische optionale Felder

```
approved_by, notes, event_start_time, event_end_time
alcohol_served, outdoor_area, prior_incidents
medical_service, evacuation_plan_available
official_requirements, combat_sports_type (z. B. „K1", „MMA", „Boxen")
```

#### Blueprint-spezifische kritische OFFENER PUNKT-Auslöser

```
venue_exits = 0 oder fehlt → immer OFFENER PUNKT
expected_attendees > venue_capacity → Überbelegung, immer OFFENER PUNKT
security_staff_count < 1 → immer OFFENER PUNKT
approved_by fehlt → immer OFFENER PUNKT (Freigabe)
combat_sports_type fehlt → OFFENER PUNKT (kampfsportartspezifische Risiken unbekannt)
medical_service fehlt → OFFENER PUNKT (bei Kampfsport empfohlen)
```

#### AI-generierte Blöcke

```
GB_TAETIGKEIT, GB_GEFAEHRDUNGEN, GB_RISIKOBEWERTUNG,
GB_SCHUTZMASSNAHMEN, GB_VERANTWORTLICHKEITEN, GB_OFFENE_PUNKTE
```

#### Statische Inhalte (im Word-Template, nicht KI-generiert)

```
Dokumenttitel, Kapitelüberschriften, Bewertungsmatrix-Tabelle (Legende),
STOP-Prinzip-Erklärung, Unterschriftsfelder für Freigabe,
rechtlicher Hinweis (Fußzeile)
```

### 4.3 Blueprint-Struktur: `gb_object_standard` (geplant)

```
1. Objektbeschreibung
   {GB_OBJEKTBESCHREIBUNG}

2. Zugangs- und Zutrittskontrolle
   {GB_ZUGANG}

3. Gefährdungsermittlung
   {GB_GEFAEHRDUNGEN}

4. Risikobewertung
   {GB_RISIKOBEWERTUNG}

5. Schutzmaßnahmen
   {GB_SCHUTZMASSNAHMEN}

6. Verantwortlichkeiten
   {GB_VERANTWORTLICHKEITEN}

7. Wirksamkeitskontrolle
   {GB_WIRKSAMKEITSKONTROLLE}

8. Offene Punkte
   {GB_OFFENE_PUNKTE}
```

*Hinweis: Das Objekt-GB hat mehr Kapitel und andere Inhaltsblöcke als das Event-GB.
Die Blueprint-Struktur steuert, welche `GB_*`-Platzhalter aktiv sind.*

---

## 5. Dokumentabhängigkeiten — Vollständige Kette

### 5.1 Abhängigkeitsgraph

```
[Kunden-/Projektkontext]
  • Auftraggeber
  • Vertragsdaten
  • Standort / Objekt
  • Spezielle Anforderungen
        │
        ▼
[Sicherheitskonzept (SK)]
  Quelle: extern (vom Kunden) ODER intern generiert
  Enthält: Schutzziele, Schutzmaßnahmen, Verantwortliche
  Status: vorhanden / teilweise / fehlend
        │
        ├──────────────────────────────────────────┐
        ▼                                          ▼
[Gefährdungsbeurteilung (GB)]           [weitere GBs für andere
  Referenziert: SK-Maßnahmen             Tätigkeitsbereiche]
  Generiert: Risiken, Maßnahmen
  Exportiert: risk_findings, measures
        │
        ├──────────────────────┐
        ▼                      ▼
[Einsatzkonzept (EC)]    [Einweisungen / Unterweisungen]
  Importiert: GB-Risiken   Referenzieren: GB + EC
  Importiert: GB-Maßnahmen
  Generiert: Ablaufplan, Kräfteplanung, Kommunikation
        │
        ▼
[ODA — Objektdienstanweisung]
  Importiert: EC-Ablaufplan
  Importiert: GB-Maßnahmen (relevant für täglichen Dienst)
  Generiert: Dienstanweisungen, Verhaltensregeln, Meldewege
```

### 5.2 Was von Dokument zu Dokument propagiert

| Von | Nach | Propagiertes Element |
|---|---|---|
| SK | GB | Schutzziele, bekannte Risiken, vorgegebene Maßnahmen |
| SK | EC | Sicherheitsniveau, genehmigte Kräftezahl, Kommunikationsvorgaben |
| GB | EC | Identifizierte Risiken, beschlossene Schutzmaßnahmen |
| GB | Einweisungen | Gefährdungen pro Arbeitsbereich, relevante Schutzmaßnahmen |
| GB + EC | ODA | Dienstaufgaben, Meldewege, Verhaltensregeln bei Ereignissen |
| Jedes Dokument | Nachgelagertes Dokument | Offene Punkte (wenn nicht geschlossen) |

### 5.3 Behandlung unvollständiger Upstream-Dokumente

| Upstream-Zustand | Systemreaktion |
|---|---|
| SK vorhanden und vollständig | SK-Informationen werden als Input für GB verwendet |
| SK vorhanden, aber veraltet | OFFENER PUNKT: „Sicherheitskonzept vom [Datum] — Aktualität prüfen" |
| SK partiell (Abschnitte fehlen) | Fehlende Abschnitte → OFFENER PUNKT je fehlendem Bereich |
| SK fehlt vollständig | OFFENER PUNKT: „Kein Sicherheitskonzept vorhanden oder übergeben" |
| GB hat offene Punkte → EC soll darauf aufbauen | EC erbt GB-OFFENE PUNKTE, markiert sie als upstream |
| EC hat offene Punkte → ODA soll folgen | ODA erbt EC-OFFENE PUNKTE analog |

**Systemregel:** Kein nachgelagertes Dokument täuscht Vollständigkeit vor, wenn
Upstream-Informationen fehlen. Fehlende Eingaben aus übergeordneten Dokumenten werden
immer als `[OFFENER PUNKT] (aus [Dokumenttyp])` weitergegeben.

---

## 6. Blueprint-Registry — Zukünftige Implementierung

Die Blueprint-Registry ist **noch nicht implementiert**. Sie wird als JSON- oder
YAML-Konfigurationsdatei je Blueprint in `knowledge/6_blueprint/` gespeichert.

### 6.1 Geplante Struktur pro Blueprint

```json
{
  "blueprint_id": "gb_event_kampfsport",
  "document_type": "gb_event_kampfsport",
  "display_name": "Gefährdungsbeurteilung — Kampfsportveranstaltung",
  "version": "1.0",
  "template_file": "templates/gb_event_kampfsport.docx",
  "mode": ["standalone", "flow"],

  "input_schema": {
    "required": ["event_name", "event_type", "event_date", "..."],
    "optional": ["combat_sports_type", "medical_service", "..."],
    "critical_triggers": [
      {
        "condition": "venue_exits == 0 or missing",
        "open_point": "Anzahl Notausgänge nicht angegeben oder null"
      }
    ]
  },

  "ai_blocks": [
    "GB_TAETIGKEIT", "GB_GEFAEHRDUNGEN", "GB_RISIKOBEWERTUNG",
    "GB_SCHUTZMASSNAHMEN", "GB_VERANTWORTLICHKEITEN", "GB_OFFENE_PUNKTE"
  ],

  "static_blocks": [
    "Kapitelüberschriften", "Bewertungsmatrix-Legende", "Unterschriftsfeld"
  ],

  "qa_rules": {
    "require_approved_by": true,
    "max_open_points_for_ok": 0,
    "critical_fields": ["venue_exits", "security_staff_count"]
  },

  "upstream": [],
  "downstream": ["ec_event_kampfsport", "oda_standard"],
  "exports": ["risk_findings", "measures", "open_points"]
}
```

### 6.2 Blueprint-Registry Dateipfade (geplant)

```
knowledge/
└── blueprints/
    ├── gb_event_kampfsport.json
    ├── gb_event_standard.json
    ├── gb_object_standard.json
    ├── gb_mobile_service.json
    ├── sk_event_standard.json
    ├── ec_event_kampfsport.json
    └── oda_standard.json
```

---

## 7. Placeholder-Namespaces pro Dokumenttyp

Jeder Dokumenttyp hat einen eigenen Namespace. Die `GB_*`-Blöcke sind
**nicht universal** — ein `gb_object_standard` hat andere Blöcke als ein
`gb_event_kampfsport`, obwohl beide GB-Dokumente sind.

### 7.1 GB-Namespaces nach Blueprint

| Blueprint | AI-Blöcke |
|---|---|
| `gb_event_kampfsport` | `GB_TAETIGKEIT`, `GB_GEFAEHRDUNGEN`, `GB_RISIKOBEWERTUNG`, `GB_SCHUTZMASSNAHMEN`, `GB_VERANTWORTLICHKEITEN`, `GB_OFFENE_PUNKTE` |
| `gb_object_standard` | `GB_OBJEKTBESCHREIBUNG`, `GB_ZUGANG`, `GB_GEFAEHRDUNGEN`, `GB_RISIKOBEWERTUNG`, `GB_SCHUTZMASSNAHMEN`, `GB_VERANTWORTLICHKEITEN`, `GB_WIRKSAMKEITSKONTROLLE`, `GB_OFFENE_PUNKTE` |
| `gb_mobile_service` | `GB_TAETIGKEIT`, `GB_STRECKENBESCHREIBUNG`, `GB_GEFAEHRDUNGEN`, `GB_RISIKOBEWERTUNG`, `GB_SCHUTZMASSNAHMEN`, `GB_KOMMUNIKATION`, `GB_OFFENE_PUNKTE` |

### 7.2 SK-Namespaces (geplant)

| Blueprint | AI-Blöcke |
|---|---|
| `sk_event_standard` | `SK_SCHUTZZIEL`, `SK_GEFAEHRDUNGSANALYSE`, `SK_SCHUTZMASSNAHMEN`, `SK_VERANTWORTLICHE`, `SK_KOMMUNIKATION`, `SK_OFFENE_PUNKTE` |

### 7.3 EC-Namespaces (geplant)

| Blueprint | AI-Blöcke |
|---|---|
| `ec_event_kampfsport` | `EC_EINSATZBESCHREIBUNG`, `EC_KRAEFTE`, `EC_POSITIONIERUNG`, `EC_ABLAUF`, `EC_KOMMUNIKATION`, `EC_NOTFALLPLAN`, `EC_OFFENE_PUNKTE` |

### 7.4 ODA-Namespaces (geplant)

| Blueprint | AI-Blöcke |
|---|---|
| `oda_standard` | `ODA_AUFGABE`, `ODA_VERHALTEN`, `ODA_MELDEWEGE`, `ODA_VERBOTENES`, `ODA_NOTFALL`, `ODA_OFFENE_PUNKTE` |

---

## 8. Abhängigkeitsbewusste QA-Logik

### 8.1 Standalone-QA (aktuell implementiert)

Die aktuelle `quality_checker.py` führt standalone QA durch:
- Leere Platzhalter → OFFENER PUNKT
- `[OFFENER PUNKT]` im Text → in `open_points` aufgenommen
- Fehlende Pflichtfelder aus Input-Loader → in `open_points`

### 8.2 Dependency-QA (geplant, nicht implementiert)

Wenn ein Dokument im Flow-Modus ausgeführt wird:

```
Input: upstream_context = {
  "sk": { "status": "partial", "missing_sections": ["Maßnahmen", "Verantwortliche"] },
  "prior_gb": null
}
```

QA-Erweiterungen:
- Fehlende SK-Abschnitte → OFFENER PUNKT in GB (`aus SK: Abschnitt X fehlt`)
- Veraltetes SK (> N Monate) → OFFENER PUNKT mit Datum
- Offene Punkte aus Upstream-Dokumenten → im aktuellen Dokument als `(übernommen aus [Typ])` markiert

### 8.3 QA-Status-Werte (erweitert)

| Wert | Bedeutung |
|---|---|
| `ok` | Keine offenen Punkte, alle Pflichtfelder gefüllt, alle AI-Blöcke vollständig |
| `review_required` | Mindestens ein OFFENER PUNKT — manuelle Prüfung erforderlich |
| `dependency_incomplete` | Upstream-Dokument fehlt oder unvollständig (Flow-Modus) |
| `parse_error` | LLM hat nach 3 Versuchen kein valides JSON geliefert |

---

## 9. Wissensstruktur (Knowledge Layer)

Die `knowledge/`-Ordnerstruktur ist die Grundlage für spätere kontextbewusste Generierung.
Sie ist **noch nicht aktiv** — sie wird relevant sobald das Modell Zugriff auf
blueprintspezifisches Fachwissen erhalten soll.

```
knowledge/
├── blueprints/       ← Blueprint-Konfigurationsdateien (JSON/YAML)
├── rules/            ← Fachliche Regeln pro Anwendungsfall
│   ├── gb_event.md       ← Typische Gefährdungen bei Veranstaltungen
│   ├── gb_object.md      ← Typische Gefährdungen bei Objekten
│   └── kampfsport.md     ← Kampfsportspezifische Risiken
├── norms/            ← Anwendbare Normen und Regelwerke (als Kontext, nicht zitiert)
│   ├── arbschg_overview.md
│   ├── dguv_v1_overview.md
│   └── vstaettvo_overview.md
├── examples/         ← Referenzbeispiele für gut formulierte Abschnitte
│   ├── gb_taetigkeit_examples.md
│   └── gb_massnahmen_examples.md
└── upstream/         ← Upstream-Dokumente für Flow-Modus
    └── (extern übergebene SK, Bestandspläne etc.)
```

---

## 10. Modularer Aufbau — Systemkomponenten

### 10.1 Aktuelle Implementierung (Phase 1)

```
shared/
├── api_client.py         ← LLM-Kommunikation
├── input_loader.py       ← Input-Validierung + pre_open_points
├── quality_checker.py    ← Standalone-QA
├── docx_builder.py       ← Python ↔ Node Renderer Bridge
└── renderer/
    ├── render.js         ← Node.js DOCX Rendering
    └── package.json
```

### 10.2 Geplante Erweiterungen (Phase 2)

```
shared/
├── blueprint_loader.py   ← Lädt Blueprint-Konfiguration aus knowledge/6_blueprint/
├── dependency_resolver.py← Löst Upstream-Abhängigkeiten auf
└── context_builder.py    ← Baut Kontext aus Blueprint + Upstream + Input

orchestrator/
└── run_pipeline.py       ← Multi-Bot-Orchestrierung, Flow-Modus-Steuerung
```

### 10.3 Geplante Erweiterungen (Phase 3 — Portal)

```
api/
├── generate.py           ← REST-Endpunkte für Bot-Generierung
├── blueprints.py         ← Endpunkte für Blueprint-Listing
└── documents.py          ← Endpunkte für Dokumentenverwaltung
```

---

## 11. Entscheidungsregeln für die aktuelle Implementierungsphase

Die folgenden Regeln gelten für alle Entwicklungsentscheidungen bis zum Abschluss
von Phase 1:

| Entscheidung | Begründung |
|---|---|
| Kein Blueprint-Registry-Code jetzt | Stable Python-Basis zuerst — Registry in Phase 2 |
| Nur `gb_event_kampfsport` implementiert | Vollständige End-to-End-Pipeline mit einem Blueprint beweist das System |
| Flow-Modus nicht implementiert | Dependency-Resolver erfordert orchestrator — Phase 2 |
| Kein RAG / Wissensdatenbank | Knowledge-Layer-Integration in Phase 2 nach stabilem Core |
| Blueprint-ID ist `document_type` | Vorübergehend — Registry entkoppelt diese in Phase 2 |
| Standalone-Modus ist Default | Jeder Bot funktioniert unabhängig, Flow-Modus ist additiv |
