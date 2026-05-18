# Cursor Briefing — Cert-Expert AI Dokumentenbots

## Ziel

Wir bauen ein lokales AI-Dokumentensystem für Cert-Expert. Es soll keine freien Chatbots erzeugen, sondern geschlossene Fachbots mit Input-/Output-Logik.

Die Bots sollen strukturierte Eingaben erhalten und daraus hochwertige, präzise Fachinhalte für Dokumente erzeugen.

---

# Bestehende Infrastruktur

* LM Studio läuft lokal
* Lokale API: `http://127.0.0.1:1234`
* Modell: `qwen/qwen3-30b-a3b-2507`
* Python-Projekt: `cert-expert-ai`
* Cursor wird als Entwicklungsumgebung genutzt
* GitHub ist verbunden
* Erste API-Anfrage war erfolgreich

---

# Bestehende Tools

Es gibt bereits Tool 1 und Tool 2.

## Tool 1 — Document Creator

Zuständig für:

* Dokumentvorlagen
* Platzhalterersetzung
* Kopfzeile
* Fußzeile
* Logo
* Metadaten

Bekannte Platzhalter:

```text
{CompanyName}
{CompanyStreet}
{CompanyZip}
{CompanyCity}
{CompanyCountry}
{CompanyAddressLine}
{DocVersion}
{CreatedBy}
{ApprovedBy}
{DocDate}
{Logo}
```

## Tool 2 — Employee / Deploy Tool

Zuständig für:

* Mitarbeiterdokumente
* Personalakten
* personenbezogene Platzhalter

Bekannte Platzhalter:

```text
{FullName}
{Birthday}
{StartDate}
{RoleName}
{CompanyName}
{CompanyAddress}
{CompanyEmail}
```

---

# Neue AI-Bots

Wir bauen vier Fachbots:

1. Gefährdungsbeurteilungs-Bot
2. Sicherheitskonzept-Bot
3. Einsatzkonzept-Bot
4. ODA-Bot

Die Bots sollen Tool 1 und Tool 2 nicht ersetzen.

Die Bots erzeugen fachliche Inhalte. Tool 1 übernimmt später die finale Dokumentverarbeitung mit Platzhaltern, Logo, Kopfzeile und Fußzeile.

---

# Architekturprinzip

```text
Input JSON / Formular
↓
Orchestrator
↓
Fachbot
↓
QA-Prüfung
↓
strukturierter Output
↓
Tool-1-kompatibles Mapping
↓
DOCX / später Portal
```

---

# Wichtiges Designprinzip

Die Bots sollen nicht einfach Fließtext ausgeben.

Sie sollen strukturierte Inhalte erzeugen, z. B.:

```json
{
  "document_type": "gefaehrdungsbeurteilung",
  "placeholders": {
    "GB_TAETIGKEIT": "...",
    "GB_GEFAEHRDUNGEN": "...",
    "GB_RISIKOBEWERTUNG": "...",
    "GB_SCHUTZMASSNAHMEN": "...",
    "GB_OFFENE_PUNKTE": "..."
  },
  "open_points": [
    "Zuschauerzahl fehlt",
    "Notausgänge nicht angegeben"
  ],
  "qa_status": "review_required"
}
```

---

# Strenge Bot-Regeln

Die Bots dürfen:

* keine Informationen erfinden
* keine konkreten Daten, Orte, Verbände, Regelwerke oder Termine halluzinieren
* fehlende Informationen nicht auffüllen
* fehlende Informationen immer als `OFFENER PUNKT` markieren
* nur auf Basis der Eingaben und bereitgestellten Wissensbasis arbeiten
* keine finale rechtliche oder sicherheitstechnische Freigabe vortäuschen

Die Bots sollen:

* auditnah schreiben
* präzise formulieren
* Dokumentabschnitte templatefähig ausgeben
* offene Punkte separat sammeln
* Inputs und Outputs klar trennen
* später über Oberfläche oder API nutzbar sein
Der Bot verarbeitet strukturierte Projektdaten. Für den ersten lokalen Test können diese Daten aus einer JSON-Datei kommen. Später können sie aus Formularen, Portal oder API stammen.
---

# Geplante Ordnerstruktur

```text
cert-expert-ai/
├── bots/
│   ├── 01_gefaehrdungsbeurteilung/
│   ├── 02_sicherheitskonzept/
│   ├── 03_einsatzkonzept/
│   └── 04_oda/
├── shared/
│   ├── api_client.py
│   ├── quality_checker.py
│   ├── input_loader.py
│   └── docx_writer.py
├── orchestrator/
│   └── run_pipeline.py
├── inputs/
│   └── gefaehrdungsbeurteilung_example.json
├── outputs/
├── templates/
├── knowledge/
│   ├── rules/
│   ├── norms/
│   ├── examples/
│   └── blueprints/
├── legacy_tools/
│   ├── document_creator/
│   └── deploy_tool/
└── docs/
```

---

# Aktueller Fokus

Nicht alle Bots gleichzeitig bauen.

Zuerst wird eine Master-Pipeline gebaut:

```text
Gefährdungsbeurteilung
↓
Input JSON
↓
Bot
↓
QA
↓
strukturierter Output
↓
DOCX-Testausgabe
```

Wenn diese Pipeline funktioniert, werden Sicherheitskonzept, Einsatzkonzept und ODA daraus abgeleitet.

---

# Ziel der nächsten Umsetzung

Bitte plane und erstelle zuerst:

1. `docs/ARCHITECTURE.md`
2. `inputs/gefaehrdungsbeurteilung_example.json`
3. `shared/input_loader.py`
4. `shared/quality_checker.py`
5. Überarbeitung von `bots/01_gefaehrdungsbeurteilung/gb_bot.py`

Ziel:
Der Gefährdungsbeurteilungs-Bot soll Input aus JSON lesen und strukturierten Output erzeugen, der später Tool-1-kompatibel weiterverarbeitet werden kann.

Noch keine komplexen Frameworks wie LangGraph, CrewAI, MCP oder RAG einbauen. Erst stabile Python-Basis.
