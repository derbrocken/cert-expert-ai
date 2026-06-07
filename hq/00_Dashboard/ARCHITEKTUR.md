# Architektur — Cert-Expert (Stand 2026-06-07)

Endzustand der „drei Pools → eine Architektur"-Migration. **Verbindlich** für dich und jeden neuen Chat/Agenten.

---

## Grundprinzip

> Jede Datenart hat genau **EIN Zuhause** (System of Record). Andere Systeme **verweisen** darauf, duplizieren nicht.
> Gemeinsamer Schlüssel über alle Systeme: der **Kunden-Slug** aus `hq/03_Kundenprojekte/_registry.json`.

---

## System of Record — wer besitzt was

| System | Einziger Job | Inhalt | Maschinen-Zugriff |
|---|---|---|---|
| **Repo `/hq`** | Arbeits-Organisation | To-dos, Dashboards, Bridge, Koordination | Mensch + dieser KI-Chat |
| **Repo `/knowledge` + `bots/`** | Bot-Wissen + Generator-Engine | AI-ready Norm-/Fachmodule, Blueprints | Bots |
| **Airtable (CRM)** | Kunden-Zustand | Pipeline/Stage, Kontakte, Audit-Termine | Mensch |
| **OneDrive (Cert-Expert)** | Aktenschrank | echte Dokumente (Word/PDF/Excel) | **nur Mensch** |
| **Certification OS + Hetzner S3** | SoR für strukturierte Kundendaten + generierte Docs | Akten, Nachweise, Generator-Output | Tool/Bot |

---

## Das eine Gehirn (Repo `cert-expert-ai`)

Ein Repo, zwei Hälften:

- **`hq/`** = Mensch-Kanzel → **Obsidian-Vault: `hq` (+ `knowledge`) öffnen, NICHT das ganze Repo.**
- **`knowledge/`, `bots/`, `prompts/`, `shared/`, `cert-expert-certification-os/`** = Maschine (Bot-Wissen + Code).

Beide versioniert im selben Repo = ein zusammenhängendes Gehirn.

---

## Kundendaten-Fluss (verbindlich — Mark-Entscheidung 2026-06-07)

1. Kundendaten kommen **ins Tool** (Tally/Formular → Slice 1) — **nicht mehr von Hand in OneDrive.**
2. Tool speichert: strukturierte Daten in **DB** (SQLite/Prisma), Dateien in **S3** (`cea/companies/{slug}/…`).
3. Generierte Docs: Tool **exportiert automatisch** eine Kopie in OneDrive `01_Kunden/<Kunde>/08_Generated/` (kein manueller Download) — **Slice 4**.

**Ergebnis:** Bot nutzt S3, Mensch/Auditor blättert OneDrive — **eine Quelle, zwei Sichten.**

---

## Zugriffs-Grenzen (wichtig)

- **Bots** lesen NUR das Repo (`knowledge/`). Kein OneDrive.
- **Das Tool** liest/schreibt NUR seine DB + S3 (Ausnahme: der Auto-Export-Schritt nach OneDrive).
- **OneDrive** = mensch-only Aktenschrank. Was eine Maschine braucht, gehört **ins Tool**, nicht in OneDrive.

---

## Befüllung — wo kommt Neues hin

| Neues … | … geht nach |
|---|---|
| Denken / Planen / To-dos | `hq` (`10_Bridge/AUFGABEN.md`, Dashboards) |
| Wissen/Normen (AI-ready) | `knowledge/` |
| Norm-Quelldokumente | OneDrive `02_QM_und_Wissen` |
| Kundendaten | **Tool** (Tally) → spiegelt nach OneDrive `01_Kunden` |
| Kunden-Pipeline/Kontakte | Airtable |
| `hq/03_Kundenprojekte/<slug>/` | **nur** Status/Metadaten/Links — **nie** Dokumenten-Dump |

---

## OneDrive-Schubladen (Aktenschrank)

`01_Kunden` · `02_QM_und_Wissen` · `03_Branding` · `04_Finanzen` · `05_Meetings_und_Aufnahmen` · `06_Software_und_Projekte` · `07_Ablage` · `08_Persönlich` · `_Archiv_2026-06`

---

## Persönlich getrennt

Private Daten (pers. `onedrive.live.com`: Persönlicher Tresor, lose Wurzel-Dateien, `MarwanMahra.pfx`) bleiben **getrennt** — kein Teil der Business-Architektur.

---

## Verwandte Dateien
- `hq/00_Dashboard/WO_IST_WAS.md` — Schnell-Nachschlag
- `hq/03_Kundenprojekte/_registry.json` — Kunden-Slugs (der Klebstoff)
- `hq/03_Kundenprojekte/_Verknuepfung.md` — Slug ↔ Firma ↔ OneDrive ↔ CRM ↔ Audit
- `hq/10_Bridge/AUFGABEN.md` — Aufgaben-Register
