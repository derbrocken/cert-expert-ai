# Hetzner VPS — Certification OS Deploy

> Ziel: **stabile HTTPS-URL** für Tally-Webhooks statt wechselndem cloudflared-Tunnel.  
> App: `cert-expert-certification-os/apps/certification-os/` · Port **3001** (intern)

## ✅ LIVE-STAND (Redeploy 2026-06-10 #4, Terminal-Planer auf Marks Anweisung)

**App live: https://cos.cert-expert.de** (HTTPS, HTTP→HTTPS-Redirect). Deployter Commit **`e84e599`** (zuvor `d5c9086`, `2242502`, `fe17ad5`, `03429b2`, `5280d9c`, `404d55d`).

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
