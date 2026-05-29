# Cert-Expert AI — Input Architecture

Version: 1.0 | Erstellt: 2026-05-18 | Status: Planung

---

## Grundprinzip: UI-agnostischer Engine

Der AI Bot Engine ist **nicht** an eine bestimmte Eingabequelle gebunden.
Er akzeptiert strukturierte Eingabedaten unabhängig davon, woher sie kommen.

Die interne Schnittstelle ist immer:

```
generate_document(blueprint_id, input_data) → result
```

```
result = {
  "placeholder_json": { ... },   ← strukturierter Platzhalter-Output
  "docx_path": "...",            ← Pfad zur generierten DOCX-Datei
  "qa_status": "ok" | "review_required",
  "open_points": [ ... ]
}
```

Woher `input_data` kommt — JSON-Datei, internes Formular, Portal-API — ist der
Engine gleichgültig. **Normalisierung vor dem Engine-Aufruf ist die Verantwortung
der aufrufenden Schicht.**

---

## Phasen

### Phase 1 — JSON-Datei (aktuell, lokale Entwicklung)

Input wird als JSON-Datei in `inputs/` bereitgestellt.
Der Bot wird direkt per Python-Skript aufgerufen.

```
inputs/gb_event_kampfsport.json
        ↓
python bots/01_gefaehrdungsbeurteilung/gb_bot.py
        ↓
outputs/gb_event_kampfsport_2026-05-18.json
outputs/gb_event_kampfsport_2026-05-18.docx
```

**Zweck:** Entwicklung, Tests, Validierung der Pipeline.

**Was nicht nötig ist:** Browser, UI, Server, Auth.

**Beispiel-Input:**
```json
{
  "blueprint_id": "gb_event_kampfsport",
  "input_data": {
    "event_name": "K1-Turnier Stadthallenverband",
    "event_date": "2026-06-15",
    "event_location": "Stadthalle Musterstadt",
    "expected_attendees": 800,
    "security_staff_count": 12,
    "venue_capacity": 1000,
    "venue_exits": 6,
    "special_risks": ["Ringkampf", "Alkoholausschank"],
    "client_name": "KL Sicherheit GmbH",
    "created_by": "M. Mahra",
    "doc_version": "1.0"
  }
}
```

### Phase 2 — Einfaches internes Formular (optional, vor Portal)

Ein minimales, internes Eingabeformular für den praktischen Einsatz,
bevor das Portal verfügbar ist. Ziel: nutzbar für Cert-Expert-Mitarbeiter
ohne technisches JSON-Wissen.

**Optionen (keine Entscheidung jetzt, nur Richtung):**

| Option | Beschreibung | Aufwand |
|---|---|---|
| Streamlit-Formular | Lokale Python-Weboberfläche | Gering |
| Einfaches HTML-Formular | Lokale HTML-Seite, submits JSON | Gering |
| Excel/CSV-Vorlage | Strukturierte Tabelle → JSON-Konverter | Gering |
| CLI mit Prompts | Interaktive Befehlszeile | Mittel |

**Was diese Schicht tut:**
- Zeigt blueprint-spezifische Felder an
- Validiert Pflichtfelder client-seitig
- Baut `{ "blueprint_id": ..., "input_data": { ... } }` zusammen
- Ruft `generate_document()` auf
- Zeigt Ergebnis und Open Points an

**Was diese Schicht nicht tut:** keine Auth, keine Datenbank, kein Projekt-Management.

**Entscheidung wann:** Wenn die JSON-Datei-Methode für praktischen Betrieb nicht
ausreicht und das Portal noch nicht verfügbar ist.

### Phase 3 — Portal-API (Zukunft)

Das Portal sendet einen strukturierten API-Request an den Bot Engine.
Der Engine bleibt unverändert — nur die aufrufende Schicht ändert sich.

```
Portal-Formular (blueprint-spezifisch)
        ↓
Portal-Backend baut input_data aus Formularfeldern
        ↓
POST /api/generate
{
  "blueprint_id": "gb_event_kampfsport",
  "input_data": { ... }
}
        ↓
Bot Engine generate_document()
        ↓
Portal empfängt result (JSON + DOCX-URL)
Portal speichert, versioniert, verwaltet Freigabe
```

**Der Engine-Code bleibt identisch zu Phase 1 und Phase 2.**

---

## Blueprint-gesteuertes Input-Schema

Das Input-Schema ist **nicht universell** — es ist pro Blueprint definiert.
Das Portal (Phase 3) zeigt dem Nutzer ein dynamisches Formular basierend auf
dem gewählten Blueprint.

```
Nutzer wählt: gb_event_kampfsport
        ↓
Portal lädt Blueprint-Config (knowledge/6_blueprint/gb_event_kampfsport.json)
        ↓
Portal zeigt Formularfelder aus input_schema.required + input_schema.optional
        ↓
Nutzer füllt Formular aus
        ↓
Portal baut input_data-Objekt
        ↓
generate_document("gb_event_kampfsport", input_data)
```

Jeder Blueprint definiert:
- `input_schema.required` — Pflichtfelder (fehlend → OFFENER PUNKT)
- `input_schema.optional` — Optionale Felder
- `input_schema.critical_triggers` — Bedingungen die immer OFFENER PUNKT auslösen

Vollständige Blueprint-Schema-Spezifikation: `docs/BLUEPRINT_ARCHITECTURE.md`.

---

## Was der Engine nicht besitzt

| Funktion | Verantwortlich |
|---|---|
| Authentifizierung / Login | Portal |
| Nutzerverwaltung / Rollen | Portal |
| Kundendaten-Datenbank | Portal |
| Projektdossiers / Versionierung | Portal |
| Freigabe-Workflows | Portal |
| Dashboards / Benachrichtigungen | Portal |
| Datei-Storage (S3, Hetzner) | Portal / Infrastruktur |
| Formular-Rendering | Phase-2-Schicht oder Portal |

Der Engine besitzt: Blueprint-Logik, KI-Generierung, QA, DOCX-Rendering.

---

## Normalisierungsregel

Unabhängig von der Eingabequelle muss vor dem Engine-Aufruf normalisiert werden:

```python
# Jede Eingabequelle muss dieses Format liefern:
{
    "blueprint_id": str,      # z. B. "gb_event_kampfsport"
    "input_data": dict        # blueprint-spezifische Felder
}
```

Fehlende Pflichtfelder werden nicht von der Normalisierungsschicht abgelehnt —
sie werden vom `input_loader.py` als `pre_open_points` erfasst und die Pipeline
läuft weiter mit `qa_status: "review_required"`.
