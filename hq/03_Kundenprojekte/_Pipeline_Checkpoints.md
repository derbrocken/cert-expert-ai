# Pipeline-Checkpoints — Journey-Stages (Spur 1) — Stand 2026-06-07

Kanonische Definition der Kunden-Journey. **Spur 1 = wo steht der Kunde** (CRM-Stage). Readiness/Blocker = separat (siehe `_Pipeline_Readiness.md`, in Arbeit). Quelle des echten Ablaufs: `_O2C_Prozess_REAL.md`.

Airtable-Feld: `Checkpoint` (Tabelle Clients). Flag `Achtung` = braucht-jetzt-Aufmerksamkeit.

| # | Stage | Eintritt (ab wann hier) | Call(s) | Gate raus (weiter wenn) | Kundensichtbarer Meilenstein |
|---|-------|--------------------------|---------|--------------------------|------------------------------|
| **1** | **Sales Call** | Anfrage rein → Termin vereinbart | Erstgespräch/Bedarfsanalyse | Bedarf klar, Machbarkeit geprüft | „Erstgespräch terminiert/gehabt" |
| **2** | **Angebot & KSA** | nach Erstgespräch | — | **Zusage** (Unterschrift) · sonst → Verloren | „Angebot erhalten" |
| **3** | **Onboarding** | nach Zusage | **Willkommenscall** | **Anzahlung erhalten** + Willkommensmail+Guide raus | „Willkommen, Guide erhalten" |
| **4** | **Unterlagen-Sammlung** | nach Anzahlung/Welcome | 4 Gespräche: Unternehmen · Mitarbeiter · Lieferanten · Projekte (+ Büro/Arbeitsschutz) | alle Formulare fristgerecht + unterschr. Docs zurück | „Unterlagen-Fortschritt X/4" |
| **5** | **Audit** | Unterlagen vollständig + Readiness grün | internes/Vor-Audit, DEKRA-Audit-Tag | Audit bestanden (ggf. Nacharbeit) | „Audit-Termin / Audit läuft" |
| **6** | **Zertifiziert – Aktiv** | nach bestandenem Audit | — | → Renewal-Zyklus | „Zertifiziert ✅" |
| ↻ | **Renewal fällig** | jährliches Überwachungsaudit / Re-Zert (J3) | Überwachungs-Call | Überwachung terminiert | „Überwachungsaudit fällig" |
| ✗ | **Verloren** | abgelehnt / nicht zustande / beendet | — | (ggf. reaktivierbar) | — |

## Wichtig
- **Readiness (Spur 2)** — die 7 Pflicht-Vorbedingungen — gaten den Übergang **4 → 5** (Audit erst, wenn alle grün). Sie sind KEINE Stage.
- **Gates** leben innerhalb der Stages (Zusage, Anzahlung, Formular-Fristen, Audit-Bestehen) — nicht als eigene Stages, sonst zu granular.
- **DEKRA-Upload:** fertiger DEKRA-Ordner → Teambeam des DEKRA-Kontakts **nach Anfangsbuchstabe** (Airtable-Tabelle „DEKRA Contacts", Feld Teambeam Link + Alphabet Range).

## Airtable-Status (Umsetzung)
- Feld `Checkpoint` hat aktuell die Kern-Stufen (Angebot&KSA · Unterlagen-Sammlung · Audit-Vorbereitung · Audit&Zert · Zertifiziert + Renewal/Verloren) + Flag `Achtung`, alle 20 Kunden einsortiert.
- **Feinschliff offen:** Labels `1 Sales Call` + `3 Onboarding` ergänzen + Audit-Stufen zusammenführen — in der Airtable-Oberfläche (Feld „Checkpoint" → Optionen) in ~1 Min. machbar; diese Doc-Definition ist maßgeblich.

## Aktuelle Zuordnung (aktive Kunden)
| Kunde | Stage | Audit |
|---|---|---|
| TeamFlex | 5 Audit | 12.06. |
| Wolf Street | 5 Audit | 16.06. |
| SecuGuard | 5 Audit | — |
| ZT Security | 5 Audit | 08.07. |
| ELC Security | 5 Audit | — |
| Schutzritter | 4 Unterlagen-Sammlung | — |
| Checkpoint Regional | 4 Unterlagen-Sammlung | 24.06. |
