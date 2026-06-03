# Pflichtangaben — EK Kampfsport (`ec_event_kampfsport`)

Vor jedem Bot-Lauf **`inputs/ec_event_kampfsport.json`** (oder Kopie) ausfüllen.  
Leere Pflichtfelder → `[OFFENER PUNKT]` im Dokument.

---

## Pflichtfelder (MVP)

| Feld | Bedeutung |
|------|-----------|
| `event_name` | Veranstaltungsname |
| `event_type` | Veranstaltungstyp |
| `event_date` | Datum (YYYY-MM-DD) |
| `event_location_name` | Objekt/Halle |
| `event_location_address` | vollständige Einsatzadresse |
| `admission_start_time` | Einlassbeginn |
| `event_start_time` / `event_end_time` | Beginn / Ende |
| `expected_attendance` | erwartete Zuschauer |
| `client_name` | Auftraggeber/Veranstalter |
| `security_service_provider` | Sicherheitsdienstleister (AN) |
| `security_staff_count` | Kräftezahl gesamt (aus Auftrag) |
| `security_roles` | Rollenliste (mit count + Aufgaben) |
| `sections` | Einsatzabschnitte (Einlass, Zuschauer, Ring …) |
| `contact_client` | Ansprechpartner Veranstalter |
| `contact_security_lead` | Ansprechpartner Einsatzleitung SD |
| `medical_service` | Sanitäts-/Ersthelferregelung |
| `radio_communication` | Kommunikationsprinzip (keine Frequenzen erfinden) |
| `evacuation_route` | Räumungs-/Fluchtwegregelung |
| `assembly_point` | Sammelpunkt |
| `emergency_contacts` | Notfallkontakte (ohne erfundene Nummern) |
| `briefing_time` | Einsatzbesprechung |
| `created_by` | Ersteller |
| `doc_version` | Version |

---

## Optional (reduziert offene Punkte)

| Feld | Bedeutung |
|------|-----------|
| `upstream_sk_available` / `upstream_sk_path` | SK als Upstream (flow-ready) |
| `sk_protection_goals` / `sk_key_measures` | Schutzziele/Maßnahmenrahmen (wenn kein SK) |
| `contract_reference` | Vertrags-/LV-Referenz |
| `incident_documentation` | Wachbuch/Ereignismeldung/Abschlussbericht |
| `material_equipment` | Ausrüstung |
| `approved_by` | Freigabe (Pflicht für Status ok) |

---

## Envelope

```json
{
  "blueprint_id": "ec_event_kampfsport",
  "input_data": { ... }
}
```
