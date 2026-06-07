# Kunden-Verknüpfung — der Klebstoff (Stand 2026-06-07)

Ein Kunde, ein **Slug**, über alle Systeme. Slug-Quelle: `_registry.json`.
Stage/Audit/Kontakt = **Airtable** (System of Record für Kunden-Zustand).

## Aktive Projekte (7) — Slug ↔ Airtable ↔ OneDrive ↔ hq

| Slug | Airtable „Company Name" | OneDrive `01_Kunden/Clients/` | hq `03_Kundenprojekte/` | Stage (Airtable) | Audit |
|---|---|---|---|---|---|
| `TeamFlex` | Teamflex Solutions GmbH | Teamflex | TeamFlex | KSA Submitted | 2026-06-06 |
| `Wolf_Street` | WolfStreet GmbH | Wolf Street *(neu angelegt)* | Wolf_Street | Audit Scheduled | 2026-06-16 |
| `SecuGuard` | SecuGuard GmbH ⚠️„copy" | SecuGuard GmbH | SecuGuard | Audit Scheduled | — |
| `Schutzritter` | Schutzritter Sicherheitsdienste GmbH | Schutzritter Sicherheitsdienste GmbH | Schutzritter | Active – Docs Collection | — |
| `Checkpoint_Regional` | Checkpoint Regional GmbH | Checkpoint Regional GmbH | Checkpoint_Regional | Active – Docs Collection | 2026-06-24 |
| `ZT_Security` | ZT Security & Service GmbH | ZT Security &Service GmbH | ZT_Security | Audit Scheduled | 2026-07-08 |
| `LC_Security` | ELC security & Service GmbH ⚠️„copy" | EL-C Security & Service GmbH | LC_Security | Audit Scheduled | — |

## Offene Inkonsistenzen (zu bereinigen)

- **Wolf_Street:** kein OneDrive-Ordner unter `01_Kunden/Clients/` → anlegen.
- **Airtable „… copy"-Records:** `SecuGuard GmbH copy`, `ELC security & Service GmbH copy`, `Sigma Security Services GmbH copy` → prüfen welcher der echte ist, Dublette entfernen (manuell, mit Vorsicht — evtl. hängen Daten dran).
- **Namens-Varianten** über Systeme (z. B. `WolfStreet` vs `Wolf Street`, `ZT …&Service` ohne Leerzeichen) → über `aliases` in `_registry.json` abgedeckt; OneDrive-Ordnernamen bleiben wie sind (umbenennen = Team-Risiko).

## Nicht-aktive Kunden (nur OneDrive-Akte / Airtable, kein Slug nötig)

Up for Renewal / Fulfilled / Lost: A.F.A.S., Bärlin, Bellator, Faust, Miras, Precision, SPS, Sigma (×2), LionSafe, SHOWSEC, S.A.F.E., PTB, OBEN, VIEL … → bleiben in OneDrive/Airtable, bekommen erst bei Reaktivierung einen Slug.

## CRM-Struktur (Airtable, bereits vorhanden)

Base „Cert Expert CRM & Revenue Pipeline": **Clients** (Pipeline/Stage/Audit/Zertifikat) · **Auditors** · **DEKRA Contacts** · **Form Tracker** (Company/Employee/Supplier-Formulare + Erinnerungen — = das „Gates/Reminder"-Konzept, schon angelegt).
