# User-Prompt-Template — GB

Dieses Template wird vom Context Builder mit Inputfeldern befüllt. Doppelte
geschweifte Klammern (`{{...}}`) markieren Variablen und werden vor dem
Senden ersetzt. Verwende es nicht 1:1 — Context Builder rendert es.

---

Erstelle eine Gefährdungsbeurteilung für den unten genannten Auftrag.
Halte dich strikt an die Regeln, die im System-Prompt definiert sind.

Aktiver Blueprint:
- blueprint_id:   `{{blueprint_id}}`
- display_name:   `{{display_name}}`
- Pflicht-AI-Blöcke (genaue Schlüssel im Output): {{ai_blocks_csv}}

Projektdaten:
- Veranstaltungsname:       {{event_name}}
- Veranstaltungstyp:        {{event_type}}
- Kampfsportart:            {{combat_sports_type}}
- Datum:                    {{event_date}}
- Beginn / Ende:            {{event_start_time}} / {{event_end_time}}
- Ort:                      {{event_location}}
- Außenbereich:             {{outdoor_area}}
- Erwartete Zuschauer:      {{expected_attendees}}
- Sicherheitsmitarbeiter:   {{security_staff_count}}
- Hallenkapazität:          {{venue_capacity}}
- Notausgänge:              {{venue_exits}}
- Alkoholausschank:         {{alcohol_served}}
- Sanitätsdienst:           {{medical_service}}
- Fluchtwegplan vorhanden:  {{evacuation_plan_available}}
- Behördliche Auflagen:     {{official_requirements}}
- Vorangegangene Vorfälle:  {{prior_incidents}}
- Besondere Risiken:
{{special_risks_block}}
- Auftraggeber:             {{client_name}}
- Erstellt von:             {{created_by}}
- Freigegeben von:          {{approved_by}}
- Dokumentversion:          {{doc_version}}
- Hinweise:                 {{notes}}

Voreingetragene offene Punkte (vom Input-Loader erkannt):
{{pre_open_points_block}}

Aufgabe:
Gib **ausschließlich** ein JSON-Objekt zurück. Schema:

```json
{
  "document_type": "{{blueprint_id}}",
  "placeholders": {
{{placeholder_keys_block}}
  },
  "open_points": ["[OFFENER PUNKT] ..."],
  "qa_status": "ok" | "review_required"
}
```

Befülle jeden Pflicht-AI-Block (`placeholders.*`) gemäß den Regeln aus dem
System-Prompt. Verwende keine Markdown-Codefences in deiner Antwort.
