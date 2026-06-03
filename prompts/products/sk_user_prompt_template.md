# User-Prompt-Template — SK

Erstellt ein **Sicherheitskonzept** für den unten genannten Auftrag.
Halte dich strikt an den System-Prompt.

Aktiver Blueprint:
- blueprint_id:   `{{blueprint_id}}`
- display_name:   `{{display_name}}`
- Pflicht-AI-Blöcke: {{ai_blocks_csv}}

Projektdaten:
- Veranstaltungsname:       {{event_name}}
- Veranstaltungstyp:        {{event_type}}
- Kampfsportart:            {{combat_sports_type}}
- Datum:                    {{event_date}}
- Beginn / Ende:            {{event_start_time}} / {{event_end_time}}
- Ort:                      {{event_location}}
- Außenbereich:             {{outdoor_area}}
- Erwartete Zuschauer:      {{expected_attendees}}
- Sicherheitsmitarbeiter (AN): {{security_staff_count}}
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

Voreingetragene offene Punkte (Input-Loader):
{{pre_open_points_block}}

Aufgabe:
Gib **ausschließlich** ein JSON-Objekt zurück:

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

Keine Markdown-Codefences in der Antwort.
