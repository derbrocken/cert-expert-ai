# DFSS — Parallele Live-Messung (O2C / Forms)

**Stand:** 2026-06-05  
**Zweck:** Schutzritter + Checkpoint Regional **parallel** messen — **blockiert Design nicht**, füllt später Pilot Validation Report.

| P-ID | Kunde (rechtlich) | Slug | Daten |
|------|-------------------|------|-------|
| P-LIVE-SR-01 | Schutzritter Security Services GmbH | `Schutzritter` | [`live_messung.json`](../03_Kundenprojekte/Schutzritter/live_messung.json) · [`Live_Messung.md`](../03_Kundenprojekte/Schutzritter/Live_Messung.md) |
| P-LIVE-CR-01 | Checkpoint Regional GmbH | `Checkpoint_Regional` | [`live_messung.json`](../03_Kundenprojekte/Checkpoint_Regional/live_messung.json) · [`Live_Messung.md`](../03_Kundenprojekte/Checkpoint_Regional/Live_Messung.md) |

## Felder (V-03 / O2C)

| Feld | Bedeutung |
|------|-----------|
| `willkommens_mail` | Wann Willkommens-Mail raus? |
| `unternehmensunterlagen_link` | Wann Link zu Unternehmensunterlagen? |
| `formular_begonnen` | Wann Formular begonnen? |
| `blockiert_seit` | Wann blockiert + Grund |
| `fehlender_nachweis` | Welcher Nachweis fehlt? |
| `rueckfragen_anzahl` | Wie viele Rückfragen? |
| `started_at` → `milestone_1_at` | Tage bis Meilenstein 1 |

**Dashboard:** dezentes Panel unter Projekt-Auswahl (nicht in Tages-Übersicht-Pins).
