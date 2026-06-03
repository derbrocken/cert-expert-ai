# User-Prompt-Template — EK (EC)

Erstellt ein **Einsatzkonzept** (operatives Konzept des Sicherheitsdienstleisters) für den unten genannten Auftrag.
Halte dich strikt an den System-Prompt.

Aktiver Blueprint:
- blueprint_id:   `{{blueprint_id}}`
- display_name:   `{{display_name}}`
- Pflicht-AI-Blöcke: {{ai_blocks_csv}}

Projektdaten:
- Veranstaltungsname:         {{event_name}}
- Veranstaltungstyp:          {{event_type}}
- Datum:                      {{event_date}}
- Objekt/Halle:               {{event_location_name}}
- Einsatzadresse:             {{event_location_address}}
- Einlassbeginn:              {{admission_start_time}}
- Beginn / Ende (Event):      {{event_start_time}} / {{event_end_time}}
- Erwartete Zuschauer:        {{expected_attendance}}
- Auftraggeber / Veranstalter: {{client_name}}
- Sicherheitsdienstleister (AN): {{security_service_provider}}
- Vertrag/LV-Referenz:        {{contract_reference}}
- Kräfte gesamt (AN):         {{security_staff_count}}
- Rollen/Funktionen:          {{security_roles_block}}
- Einsatzabschnitte:          {{sections_block}}
- Ansprechpartner Veranstalter: {{contact_client}}
- Ansprechpartner Einsatzleitung SD: {{contact_security_lead}}
- Sanitätsdienst / Ersthelfer: {{medical_service}}
- Räumung/Fluchtwegregelung:  {{evacuation_route}}
- Sammelpunkt:                {{assembly_point}}
- Kommunikation/Funkprinzip:  {{radio_communication}}
- Notfallkontakte:            {{emergency_contacts_block}}
- Briefingzeit:               {{briefing_time}}

SK-Upstream (optional, flow-ready):
- SK vorhanden:               {{upstream_sk_available}}
- SK-Referenz:                {{upstream_sk_path}}
- Schutzziele (aus SK):       {{sk_protection_goals_block}}
- Maßnahmenrahmen (aus SK):   {{sk_key_measures_block}}

Weitere Hinweise:
- Dokumentation Ereignisse:   {{incident_documentation}}
- Besondere Hinweise:         {{special_instructions}}
- Erstellt von:               {{created_by}}
- Freigegeben von:            {{approved_by}}
- Dokumentversion:            {{doc_version}}
- Hinweise:                   {{notes}}

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
