# Certification OS — Daily Start (Tool 1 + Tool 2)

Operative Next.js-App für **Standard-Modelle (Tool 1)** und **Mitarbeiterakte (Tool 2)**.  
Branch für Migration: `b3-tool2-migration`.

## Schnellstart

```bash
cd cert-expert-certification-os/apps/certification-os
npm install          # einmalig
npm run dev          # Dev-Server → http://localhost:3001
```

**Wichtig:** Immer **Port 3001** nutzen. Port 3000 ist in der Praxis oft blockiert oder hängt — dann laden APIs (`/api/standard-models`, `/api/templates`) nicht und die UI bleibt bei „Loading folders…" / „Vorlagen laden…".

## Routen

| URL | Zweck |
|-----|--------|
| http://localhost:3001/ | Dashboard-Hub (Einstieg) |
| http://localhost:3001/model-creator | **Tool 1** — Standard-Modelle → ZIP |
| http://localhost:3001/employee-automation | **Tool 2** — Mitarbeiterakte → Generator → ZIP |
| http://localhost:3001/uploads | Upload Manager (Vorlagen, Firmendaten, Standard Models) |

## Hetzner Object Storage (`.env.local`)

Vorlagen liegen auf Hetzner S3. Ohne Konfiguration antworten die APIs mit **503**.

Datei anlegen: `apps/certification-os/.env.local` (nicht committen):

```env
HETZNER_S3_KEY=…
HETZNER_S3_SECRET=…
HETZNER_BUCKET_NAME=…
HETZNER_S3_ENDPOINT=https://…
HETZNER_S3_REGION=…
```

Nach Änderung Dev-Server neu starten.

## Lokale Daten (Tool 2)

| Speicher | Key / Ort | Inhalt |
|----------|-----------|--------|
| Personen-Queue | `localStorage` → `cert-expert-tool2-employee-queue-v1` | Personen, Export-Auswahl, Firmendaten-Spiegel |
| Nachweise | `localStorage` → `cert-expert-tool2-employee-evidence-v1` | PDF-Metadaten pro Person/Nachweiszeile |

Browser-Reload behält Daten. Leeren = DevTools → Application → Local Storage löschen.

## Typischer Ablauf

**Tool 1:** `/model-creator` → Ordner wählen → Platzhalter füllen → Generate → Download ZIP.

**Tool 2:** `/employee-automation` → Person anlegen → Akte pflegen → Tab Generator → Doc-Chips → **ZIP exportieren** (Fußleiste).

Firmenlogo/Adresse/Footer: **Upload Manager** (`/uploads`).

## Build / Production lokal

```bash
npm run build
npm run start -- -p 3001
```

Ohne `.env.local` schlägt der Start bzw. Storage-Zugriff fehl.

## Guardrails

- EC-09 Generator (Person → Queue → Doc-Chips → ZIP) nicht umbauen.
- Transitional UI — keine Freigabe-/Zertifizierungsaussage.
- Norm-Matrix / Firma→Pool = nächste Phase (nicht dieser Slice).

## Legacy-Fallback

Vollständiger Legacy-Stand (UploadThing):  
`bots/legacy_tools/existing_tools_systems/document_creater_tool_employee_file_creater_tool1_2/`

Canonical für Daily Use: **diese App** auf Port **3001**.
