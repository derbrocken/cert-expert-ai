# Pflichtangaben — SK Kampfsport (`sk_event_kampfsport`)

Vor jedem Bot-Lauf **`inputs/sk_event_kampfsport.json`** (oder Kopie) ausfüllen.  
Leere Pflichtfelder → `[OFFENER PUNKT]` im Dokument.

---

## Pflichtfelder

| Feld | Bedeutung | Beispiel |
|------|-----------|----------|
| `event_name` | Name der Veranstaltung | K1 Amateur Kampfsport Event |
| `event_type` | Typ | Kampfsportveranstaltung |
| `combat_sports_type` | Disziplin | K1, MMA, Boxen |
| `event_date` | Datum (YYYY-MM-DD) | 2026-06-14 |
| `event_location` | Ort **mit Halle/Adresse** | Sporthalle XY, Musterweg 1, Berlin-Reinickendorf |
| `expected_attendees` | erwartete Zuschauer | 100 |
| `venue_capacity` | zulässige Kapazität | 150 |
| `venue_exits` | Anzahl Notausgänge | 4 |
| `medical_service` | Sanität / Ringarzt | Sanitätsdienst Veranstalter, Ringarzt |
| `special_risks` | Liste besonderer Risiken | mindestens 1 Stichpunkt |
| `client_name` | Auftraggeber / Veranstalter | Verein / Firma |
| `created_by` | Ersteller SK | Name |
| `doc_version` | Version | 1.0 |

---

## Empfohlen (reduziert offene Punkte)

| Feld | Bedeutung |
|------|-----------|
| `event_start_time` / `event_end_time` | Beginn / Ende |
| `security_staff_count` | geplante SMA des AN |
| `alcohol_served` | true / false |
| `evacuation_plan_available` | Fluchtwegplan ja/nein |
| `official_requirements` | behördliche Auflagen (Text) |
| `approved_by` | Freigeber (leer = offener Punkt Freigabe) |
| `notes` | Hinweise |

---

## Envelope

```json
{
  "blueprint_id": "sk_event_kampfsport",
  "input_data": { ... }
}
```

---

## Was der Bot **nicht** aus dem Vault raten darf

- Genehmigungen, Mindestkräfte, Paragrafen, konkrete Funkkanäle  
- CEKS / `1_standards/` — nur über **Pflichtlektüre** im Blueprint (Extrakte + Überblicke)

Siehe [`docs/BOT_PFLICHTREGELN.md`](../docs/BOT_PFLICHTREGELN.md).
