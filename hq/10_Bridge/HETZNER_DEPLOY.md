# Hetzner VPS — Certification OS Deploy

> Ziel: **stabile HTTPS-URL** für Tally-Webhooks statt wechselndem cloudflared-Tunnel.  
> App: `cert-expert-certification-os/apps/certification-os/` · Port **3001** (intern)

## ⏳ NÄCHSTER DEPLOY — VORBEREITET, NOCH NICHT AUSGEFÜHRT (2026-06-20, Login + kumulativer Nachzug)

> **Ziel-Commit `810951e`** (Login/Site-Gate). **⚠️ Das ist KEIN reiner Login-Deploy:** der Live-Stand ist noch `20e6bf9` (2026-06-13), seitdem liegt viel ungedeployter Code auf `main`. `git pull` zieht den GANZEN Bereich `20e6bf9..810951e` mit — verifiziert: Masken **M3–M7** (`f5bee81`/`bf94f40`/`6d22eba`/`29b17b7`/`b17e9aa` + Mockup-Slices), Generator **G1/G1b/G4** (`1d94bcf`/`f8d6f7d`/`b891948`), Nachweis-Upload-Fix (`ff96b12`), Schulungs-Fix von–bis (`7598067`), Qualifikations-Katalog (`8bc16dc`), Visual-Direction-Docs, **Login** (`810951e`).
>
> **⚠️ ZWEI Voraussetzungen vor diesem Deploy:**
> 1. **`db push` + DB-Backup PFLICHT** — `29b17b7` (M6) bringt **3 additive nullable Spalten** an `EmployeeFile` (`exitDate`, `erstunterweisungDatum`, `tallyImportedKeys`; alle `String?`/`Json?`, kein `@default` → P2023-sicher, zerstörungsfrei, gleiches Muster wie frühere Deploys). Diff geprüft = rein additiv, kein Backfill/Datenverlust.
> 2. **Login-Env VOR Build/Restart in `.env.production.local` setzen** — sonst sperrt das `proxy.ts`-Gate ALLE aus (Login antwortet `500 „nicht konfiguriert"`, jede Route → `307 /login`):
>    ```
>    APP_PASSWORD=<echtes Produktiv-Passwort>            # NICHT das Dev-PW
>    AUTH_SECRET=LKOERTZoycpwDW0GHiOGMP2jgJ53iSFDtHH8Pco73WPo/utETcrf+pjSfHEo6x3W
>    ```
>
> **Deploy-Ablauf (Reihenfolge!):**
> ```bash
> ssh root@167.233.63.98
> cd /opt/cert-expert-ai/cert-expert-certification-os/apps/certification-os
> # (a) Login-Env anhängen (siehe oben) — ZUERST:
> nano .env.production.local        # APP_PASSWORD + AUTH_SECRET eintragen
> # (b) DB-Backup (Pflicht wg. Schema-Change):
> /usr/local/bin/cos-backup.sh      # -> /var/backups/certification-os/pre-deploy-2026-06-20-*.db
> # (c) Code + Schema + Build:
> git pull origin main              # erst möglich, wenn 810951e auf origin gepusht ist
> npm ci
> DATABASE_URL="file:./prisma/dev.db" npm run db:push   # additiv (M6), „in sync" erwarten
> npm run build
> systemctl restart certification-os
> ```
> **Verifikation nach Restart:**
> ```bash
> curl -s -o /dev/null -w "/login -> %{http_code}\n" https://cos.cert-expert.de/login   # 200
> curl -s -o /dev/null -w "/ -> %{http_code}\n"      https://cos.cert-expert.de/         # 307 (-> /login)
> curl -s -o /dev/null -w "richtiges PW -> %{http_code}\n" -X POST https://cos.cert-expert.de/api/auth/login \
>   -H 'Content-Type: application/json' -d '{"password":"<echtes Produktiv-Passwort>"}'  # 200
> curl -s -o /dev/null -w "webhook -> %{http_code}\n" https://cos.cert-expert.de/api/webhooks/tally  # 405 (POST-only, NICHT 307 -> Webhook bleibt offen)
> ```
> Danach Browser: Login-Maske → einloggen → **ein ZIP-Export klicken (EC-09)** + db-push-Schema-Akte-Felder sichten. **Nach Erfolg:** unten den LIVE-STAND-Eintrag von „⏳ vorbereitet" auf „✅ deployt `810951e`" umschreiben + Backup-Dateinamen eintragen.

## ✅ LIVE-STAND (Redeploy 2026-06-13 #2, Akte S1a+S1b)

**App live: https://cos.cert-expert.de** (HTTPS, HTTP→HTTPS-Redirect). Deployter Commit **`20e6bf9`** (zuvor `15cac89`, `5af2720`, `0ae0a20`, `7cb3915`, `23bd82c`, `dde4f7a`, `0ad7936`, `e84e599`, `d5c9086`, `2242502`, `fe17ad5`, `03429b2`, `5280d9c`, `404d55d`).

> **Redeploy 2026-06-13 #2 (Akte S1a+S1b): `15cac89` → `20e6bf9`.** Mitarbeiterakte-Umbau Schritt 1: **EINE Akte-Ansicht** (Ansehen-Standard + akte-weiter „Bearbeiten"-Stift statt Bearbeiten/Übersicht-Dual; Name/IDs nicht mehr versehentlich löschbar) + **Anlegen inline in der Akte** (Entwurf, expliziter „Person speichern"-Knopf, keine Geister-Akten). **Kein Schema-Change** (kein `db push`). Browser-verifiziert (Mark, lokal). `npm ci` + `next build` grün, Restart aktiv, Endpunkte 200 (`/`, `/employee-automation`, `/uploads`, `/model-creator`). EC-09: Generator/ZIP unberührt. Suite 198/198. Zieldesign: `MITARBEITERAKTE_ZIELDESIGN.md`. Nächster Schritt: Maske-Konzept (`AKTE_MASKE_KONZEPT.md`).
>
> **Redeploy 2026-06-13 (Framework P2-B): `5af2720` → `15cac89`.** Firmen-Dokumenten-Lager (Company-Tally `Y5Zq80` FILE_UPLOADs + manueller Upload). **Neue additive Tabelle `CompanyDocumentItem`** → **DB-Backup `/var/backups/certification-os/pre-deploy-2026-06-13-180038.db` + `db push` additiv** („in sync", kein Datenverlust: 6 Mitarbeiter + 6 CompanyExportSettings unverändert, CompanyDocumentItem=0/frisch). `npm ci` + `next build` grün, Restart aktiv, Endpunkte 200 (`/`, `/uploads`, `/employee-automation`, `/model-creator`), Webhook 405 (POST-only). Tabelle verifiziert vorhanden. Suite 198/198. **Abnahme offen (Mark):** echte `Y5Zq80`-Submission mit Firmen-Dokumenten → Lager + Anzeige im Upload-Manager-Abschnitt „Firmen-Dokumente"; manueller Upload/geprüft-Toggle live klicken. Plan: `FRAMEWORK_P2_COMPANY_TALLY.md` §3.

> **P2-A LIVE + VERIFIZIERT (2026-06-12):** Company-Tally `Y5Zq80` → zentrales Firmen-Profil. **Tally-Webhook `3EQpao` per API angelegt** (`Y5Zq80` → `…/api/webhooks/tally`, eventTypes `FORM_RESPONSE`, signingSecret = `cea-tally-webhook-test-secret-2026` wie Mitarbeiter-Webhook `wMzjM0`). Echte Submission verifiziert: `Wolf Street GmbH` + Logo → DB `CompanyExportSettings.logoStorageKey = cea/companies/Wolf_Street/logo.jpg`, `logo: true`. **Logo-Erkennung robust** (Mark lud das Logo ins unbeschriftete Feld `lN267B`, nicht ins gelabelte `J2MA7d` → Fallback „logo" in Label/Dateiname fängt es). **Race-Fix**: `tallyIntakeRecord` create→upsert (Tally stellt FORM_RESPONSE doppelt zu). **Tally-API-Key wieder gültig** (`GET /forms/{id}/questions` + `/webhooks` ok; `/responses` = 401, anderer Scope). **Offen P2-B:** Firmen-Dokumente (FILE_UPLOADs) → company-level Dok-Lager (eigene Phase). **Form-Hinweis (Mark):** `Y5Zq80` ist ein Entwurf mit vielen unbeschrifteten Datei-Feldern — UX-Aufräumen sinnvoll.

> **Redeploy 2026-06-12 #3 (Framework P2-A): `7cb3915` → `0ae0a20`.** Company-Tally Code (vor Webhook-Aktivierung). Zwischen-Deploys `cf1d09f`/`0a33d69` (temp Logo-Diagnose) → in `5af2720` entfernt.

> **Redeploy 2026-06-12 #3 (Framework P2-A): `7cb3915` → `0ae0a20`.** Company-Tally `Y5Zq80` → zentrales Firmen-Profil (Name/E-Mail/Logo→S3). **Kein Schema-Change.** `next build` grün, Restart aktiv, Endpunkte 200, Webhook-Endpoint 405 (POST-only). **AKTIVIERUNG offen (Mark/Tally-UI):** `Y5Zq80`-Webhook auf `https://cos.cert-expert.de/api/webhooks/tally` (gleicher Signing-Secret) + 1 Test-Submission → Profil+Logo verifizieren. Feld-Keys API-verifiziert (`7dM2QA`/`blvxao`/`J2MA7d`). Plan: `FRAMEWORK_P2_COMPANY_TALLY.md`.

> **Redeploy 2026-06-12 #2 (Framework P3b): `23bd82c` → `7cb3915`.** Mitarbeiter-Formular konsumiert Sammlungen (Selektor „Vorlagen-Sammlung", Pflicht-Lock, unsupported-Hinweis). **Additive Spalte `collectionId` — DB-Backup `pre-deploy-2026-06-11-230623.db` + `db push` additiv**, kein Datenverlust. Generator/Engine unberührt (EC-09). `next build` grün, Restart aktiv, Endpunkte 200. Tests 189/189. Plan: `FRAMEWORK_P3B_FORMULAR_KONSUM.md`. Offen: P3c (Katalog↔Sammlungen zu einer Quelle).

> **Redeploy 2026-06-12 (Framework P3a + Navigation): `dde4f7a` → `23bd82c`.** Enthält: **P3a editierbare Sammlungen** (2 additive Tabellen `DocumentCollection`+`DocumentCollectionItem` — **DB-Backup `pre-deploy-2026-06-11-221127.db` + `db push` additiv**, kein Datenverlust; Admin-Tab „Sammlungen" im Upload-Manager, Seeds der 3 Vordefinierten) **+ Navbar-3er-Leiste** (Mitarbeiterakte/Dokument-Generator/Upload-Manager, Aktiv-State). `npm ci` + `next build` grün, Restart aktiv, Endpunkte 200 (`/`, `/model-creator`, `/employee-automation`, `/uploads`), Navbar live verifiziert. Tool-2-Generator/Akte unberührt (Suite 160/160). Plan: `FRAMEWORK_P3A_DATENMODELL_ADMIN.md`, `FRAMEWORK_NAV_ORIENTIERUNG.md`. Offen: P3b (Formular konsumiert Sammlungen), P3c (Quellen-Zusammenführung).

> **Redeploy 2026-06-11 #2 (Framework P1 — Tool 1 ans zentrale Firmen-Profil):** `0ad7936` → `dde4f7a`. Tool 1 hat jetzt Firmen-Dropdown → zieht Name/Adresse/Logo/Doc-Meta aus demselben `CompanyExportSettings` wie Tool 2 (Logo: manuell>Profil>keins). **Kein Schema-Change** (kein `db push`). `npm ci` + `next build` grün, Restart aktiv, Endpunkte 200, Firma-Section live verifiziert. Tool 2 unberührt (Suite 160/160). Plan: `FRAMEWORK_TOOL1_TOOL2_UPLOAD.md` (P0) + `FRAMEWORK_P1_TOOL1_FIRMENPROFIL.md`. Nächste Phasen: P2 Company-Tally `Y5Zq80`, P3 editierbare Sammlungen.

> **Redeploy 2026-06-11 (Tool-1 Bug-Fix-Pass):** `e84e599` → `0ad7936`. Tool 1 (Document Creator) Bugs #1–#7: Datum-Guard, Leer-Guard (kein leeres ZIP), defektes Template → skip+log statt Abbruch (EC-09), Logo-try/catch, Dead-Payload raus, UI komplett DE, pure Plan-Logik + 8 Unit-Tests. **Kein Schema-Change** (kein `db push`, kein DB-Risiko). `npm ci` + `next build` grün, Restart aktiv, Endpunkte 200 (`/`, `/model-creator`, `/employee-automation`, `/api/standard-models`), DE-Strings live verifiziert. Tool 2 unberührt (Suite 160/160).

> **Redeploys 2026-06-10 #3/#4:** `2242502`→`d5c9086` (Schulung „Durchführung von–bis") →`e84e599` (modulare DIN-1-Schulungen **generierbar**: zugewiesenes Modul → Schulungsnachweis-`.docx` im Export-ZIP unter `Schulungen/`; Generierungs-Smoke bestätigt). + 9 modulare Schulungen serverseitig in S3 (`appointments/schulungen/`). Keine Schema-Changes (Daten im `trainingPlan`-Json). Build grün, Endpunkte 200. Suite 160/160.

> **Redeploy 2026-06-10 #2 (Schulungen/Bestellungen/Upload/Prüfstatus P1–P4):** `fe17ad5` → `2242502`. #1 Bestellungen-Wiring, #2 Schulungen-Abschnitt, #3 Datum-Default, #5 Tally-/Upload-Datum, #6 Upload Anlegen+Bearbeiten, #7 Prüfstatus (`geprüft`-Toggle). **Neue additive Spalte `evidenceChecks Json?`** via `db push` (Backup `pre-deploy-2026-06-10-033629.db`, kein Datenverlust). Build grün, Endpunkte 200, Log sauber. Suite 153/153. **Offen (Mark):** Admin-/Rollen-Gate für „geprüft" (kein Auth-System), reale Tally-date-questionIds, alte `appointments/unterweisungen/`-Kopien löschen.

> **Redeploy 2026-06-10 (Vorlagen-Integration):** `03429b2` → `fe17ad5`. **30 Dokumentvorlagen serverseitig in S3 eingespielt** (`roles/sicherheitsmitarbeiter|fuehrungskraft|buerokraft` mit Basis+Stellenbeschreibung; `appointments/bestellungen|betriebsanweisung|mutterschutz|objektbezogen|veranstaltung`). 5 Dokumente neu erstellt (Ersthelfer-, SiBe-Bestellung, Kfz-Fahranweisung, Mutterschutz-Merkblatt, Bildschirmarbeitsplatz — aus Brandschutzhelfer-Shell, §§ korrekt). `vorlagen-set-catalog.ts` auf echte Slugs verdrahtet (FK inkl. Bildschirm). Kein Schema-Change (kein db push). Build grün, `/api/templates` zeigt 4 Rollen, Endpunkte 200. **Offen:** alte `appointments/unterweisungen/`-Kopien (2) noch im Bucket (Route-Filter blendet aus; Mass-Delete vom Auto-Classifier blockiert → Mark löscht gezielt oder gibt OK).

> **Redeploy 2026-06-09 #2:** `5280d9c` → `03429b2`. Enthält: Tool-2-Feedback komplett (#1/#A/#B/#9, #7/#C, #3, #8, #2, #D, #4, #10, #5 + Q8) inkl. **5 neue additive nullable Spalten** (`bestelltAls`, `bestellungSchulungLink`, `setKategorie`, `generatorDates`, `gender`). DB-Backup vor Deploy (`pre-deploy-2026-06-09-210010.db`), `db push` synchron (additiv, kein Datenverlust/Backfill), `next build` Compiled successfully, Restart grün, Live-Endpunkte 200 (inkl. `/?area=mitarbeiterakte`), Log fehlerfrei. **Offen (Server):** S3-Move `Unterweisungsnachweis_Arbeitsschutz_DGUV.docx` (#9, Route-Filter blendet bis dahin aus).

> **Redeploy 2026-06-09:** `404d55d` → `5280d9c`. Enthält: Slice 3/G4 (roleClasses), Queue C (trainingPlan), Lane A (ÖPV CL-29/30), Lane B (Audit-Export XLSX/PDF), „Neue Firma"-Dialog + Firmen-Übersicht-IA. DB-Backup vor Deploy (`/var/backups/certification-os/pre-deploy-2026-06-08-224457.db`), `db push` additiv (nullable Felder, kein Datenverlust), Build + Restart grün, Live-Endpunkte 200, Log fehlerfrei.

| Sache | Wert |
|-------|------|
| Server | Hetzner `cert-expert-01`, IP **167.233.63.98**, Ubuntu 26.04 |
| Runtime | Node 24 LTS, nginx 1.28, certbot 4.0 |
| App-Pfad | `/opt/cert-expert-ai/cert-expert-certification-os/apps/certification-os` |
| Service | systemd `certification-os` (User root — Härtung = Tech-Debt), Port 3001 |
| Env | `.env.production.local` (chmod 600, **nicht** im Git) |
| DB | `prisma/prisma/dev.db` (kanonisch) |
| HTTPS-Zert | Let's Encrypt, gültig bis 2026-09-05, Auto-Renew (certbot timer) |
| Backup | `/usr/local/bin/cos-backup.sh` → `/var/backups/certification-os/`, cron tägl. 3 Uhr, 14 Tage |
| Repo-Zugang | GitHub Deploy-Key (read-only) `/root/.ssh/github_deploy` |
| Webhook | Tally → `https://cos.cert-expert.de/api/webhooks/tally` (Tally-UI umgestellt, Signing Secret unverändert; end-to-end verifiziert) |

### Redeploy (neuer Code auf main)
```bash
ssh root@167.233.63.98
cd /opt/cert-expert-ai/cert-expert-certification-os/apps/certification-os
git pull origin main
npm ci
DATABASE_URL="file:./prisma/dev.db" npm run db:push   # nur bei Schema-Änderung
npm run build
systemctl restart certification-os
```

### Service-Diagnose
```bash
systemctl status certification-os
journalctl -u certification-os -f          # Live-Logs (Webhook-Intake etc.)
curl -s -o /dev/null -w "%{http_code}\n" https://cos.cert-expert.de/
```

**Offen (nice-to-have):** EC-09-ZIP live mit role-zugeordneter Person klicken · Tally-REST-Key rotieren (401) · systemd-User auf non-root härten · ggf. DB-Doppelpfad-Vereinheitlichung (eigener Tech-Debt-Slice).

---

## (Original-Vorbereitung — Referenz)

## Voraussetzungen (VPS)

- Ubuntu 22.04+ (bestehendes Hetzner-VPS reicht)
- Node.js **20 LTS** (`nodejs` + `npm`)
- nginx + Let's Encrypt (`certbot`)
- Domain/Subdomain z. B. `cos.cert-expert.de` → A-Record auf VPS-IP

## Build auf dem Server

```bash
cd /opt/cert-expert-ai/cert-expert-certification-os/apps/certification-os
git pull origin main
npm ci
cp .env.example .env.production.local   # einmalig — siehe Env-Checkliste
npm run db:push
npm run build
```

## Env-Checkliste (`.env.production.local`, nicht committen)

| Variable | Zweck |
|----------|--------|
| `DATABASE_URL` | **`file:./prisma/dev.db`** — Prisma löst `file:`-Pfade **relativ zum Schema-Ordner** (`prisma/`) auf → reale DB unter **`prisma/prisma/dev.db`** (kanonisch, Stand 2026-06-07, = Dev). NICHT `file:./dev.db` (das ergäbe `prisma/dev.db` → andere/leere DB). Die kosmetische Pfad-Vereinheitlichung auf ein einzelnes `prisma/` ist eigener Tech-Debt-Slice, **nicht** Teil dieses Deploys (frischer VPS bekommt ohnehin frische DB via `db:push`). |
| `HETZNER_S3_*` | Object Storage (Vorlagen + Evidence) |
| `TALLY_API_KEY` | REST / Webhook-Verwaltung |
| `TALLY_WEBHOOK_SECRET` | Signatur-Check Webhook |
| `INTERNAL_API_KEY` | Migration/Admin |
| `NODE_ENV` | `production` |

## systemd-Unit (`/etc/systemd/system/certification-os.service`)

```ini
[Unit]
Description=Certification OS (Next.js)
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/cert-expert-ai/cert-expert-certification-os/apps/certification-os
EnvironmentFile=/opt/cert-expert-ai/cert-expert-certification-os/apps/certification-os/.env.production.local
ExecStart=/usr/bin/npm run start -- -p 3001
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now certification-os
```

## nginx (HTTPS → :3001)

```nginx
server {
    listen 443 ssl http2;
    server_name cos.cert-expert.de;

    ssl_certificate     /etc/letsencrypt/live/cos.cert-expert.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cos.cert-expert.de/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Tally-Webhook nach Deploy

1. PATCH `https://api.tally.so/webhooks/wMzjM0`  
   Body: `{ "url": "https://cos.cert-expert.de/api/webhooks/tally", "isEnabled": true }`
2. `signingSecret` unverändert lassen (gleich wie `.env.production.local`)
3. Test-Submission → `GET /webhooks/wMzjM0/events` → `deliveryStatus: SUCCEEDED`

## Backup

- SQLite: **`prisma/prisma/dev.db`** täglich kopieren (cron → Hetzner Storage Box o. ä.) — **nicht** `prisma/dev.db` (existiert nicht; siehe Env-Checkliste/DB-Pfad).
- S3: Bucket-Lifecycle / Versioning prüfen

## Offen (Mark)

- [ ] Subdomain + DNS
- [ ] `.env.production.local` auf VPS
- [ ] Erster Deploy + Webhook-URL umstellen
- [ ] Optional: Tally Hidden Field `cea_company_slug` im Formular `vGNvY0` anlegen (`?company=Wolf_Street`)
