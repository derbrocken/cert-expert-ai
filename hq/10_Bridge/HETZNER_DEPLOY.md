# Hetzner VPS — Certification OS Deploy (Vorbereitung)

> Ziel: **stabile HTTPS-URL** für Tally-Webhooks statt wechselndem cloudflared-Tunnel.  
> App: `cert-expert-certification-os/apps/certification-os/` · Port **3001** (intern)

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
