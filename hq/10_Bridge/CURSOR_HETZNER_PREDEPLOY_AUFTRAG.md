# CURSOR-BAUAUFTRAG — Hetzner Pre-Deploy-Gates (Executor)

> **Freigegeben:** Mark, 2026-06-07 („los" für Hetzner-Deploy). Geplant: Planer 3.
> **Rolle:** Executor (Spur E) — **nur** das hier Beschriebene bauen/prüfen, committen, EINEN Ergebnis-Eintrag in HANDOFF. **Keine** Architektur-/Pfad-Entscheidungen (sind unten vom Planer entschieden).
> **Ziel:** App ist auf einem frischen VPS sauber deploybar (stabile HTTPS-URL statt cloudflared). Runbook (systemd/nginx/certbot/Webhook-PATCH): `HETZNER_DEPLOY.md`.

## Was-kann-Mark-am-Ende
Mark kann mit grünem Gewissen deployen: `npm run build` läuft lokal grün durch, alle Prod-Env-Variablen sind dokumentiert/vorhanden, der DB-Pfad ist eindeutig, und EC-09 (Generator→ZIP) funktioniert auch im Prod-Build. Der eigentliche Server-Aufbau (DNS/systemd/nginx/Env-auf-VPS/Webhook-PATCH) bleibt Marks Schritt.

## Vom Planer ENTSCHIEDEN (nicht neu aufmachen)
- **Kanonischer DB-Pfad = `file:./prisma/dev.db` → real `prisma/prisma/dev.db`.** Prisma löst `file:`-Pfade relativ zum Schema-Ordner (`prisma/`) auf. `.env`/`.env.local`/`.env.example` sind bereits korrekt. **Nicht** auf `file:./dev.db` ändern, **nicht** die DB verschieben. Die kosmetische Vereinheitlichung auf ein einzelnes `prisma/` ist ein eigener Tech-Debt-Slice (kein Prod-Nutzen, frischer VPS bekommt frische DB via `db:push`). `HETZNER_DEPLOY.md` Env-Tabelle + Backup-Pfad hat Planer 3 bereits korrigiert.
- **Build-Gate-Strategie:** `next.config.ts` hat **kein** `eslint.ignoreDuringBuilds` → `next build` lässt ESLint laufen. **Wenn der Build an Lint-Errors scheitert:** zuerst die Errors fixen (bevorzugt). `ignoreDuringBuilds` nur als Fallback **nach Rückfrage an Planer/Mark** setzen — nicht eigenmächtig den Lint-Gate aushebeln.

## Aufgaben (klein, in Reihenfolge)
1. **`npm run build` lokal grün** (das ist der zentrale Gate — `next build` fährt tsc + ESLint im Prod-Modus). Ergebnis (0 Errors / Liste der Fehler) in HANDOFF melden. Bei Lint-Errors: fixen, erneut bauen.
2. **EC-09-Smoke gegen den Prod-Build:** `npm run start -- -p 3001`, dann im **echten Browser** Person → Akte → Doc-Chips → ZIP-Generator → ZIP lädt (200, kein Fehler). Disclaimer „…vorgemerkt — keine Freigabe-/Zertifizierungsaussage" sichtbar (EC-09/EC-10). Kein Skript-Fake — realer Klick.
3. **Env-Vollständigkeit verifizieren:** `.env.example` deckt alle zur Laufzeit gelesenen Variablen ab (S3×5, `DATABASE_URL`, `INTERNAL_API_KEY`, `TALLY_WEBHOOK_SECRET`, `TALLY_API_KEY`). Falls Code eine weitere `process.env.*` liest, die fehlt → in `.env.example` ergänzen (leer) + in HANDOFF melden. `NODE_ENV=production` wird per systemd gesetzt (siehe Runbook), nicht in `.env.example` nötig.
4. **`db:push` Trockencheck (lokal, ungefährlich):** bestätigen, dass `npm run db:push` ohne Fehler durchläuft und die DB unter `prisma/prisma/dev.db` adressiert (nicht ein zweites `prisma/dev.db` anlegt). Falls ein zweites File entsteht → stoppen + an Planer melden (dann stimmt eine Pfad-Annahme nicht).

## DoD
- `npm run build` = 0 Errors (oder dokumentierte, gefixte Errors).
- EC-09-ZIP im Prod-Build im Browser grün.
- `.env.example` vollständig; Abweichungen gemeldet.
- `db:push` adressiert nur `prisma/prisma/dev.db`.
- **EINEN** datierten Ergebnis-Eintrag unter „Von Cursor an Claude" in HANDOFF (fertig/offen/Commit-Hash, falls Lint-Fixes committet wurden). HIER-STARTEN-Status nur kippen, Plan nicht umschreiben.

## DANACH = Mark (Server, aus `HETZNER_DEPLOY.md` „Offen")
- [ ] Subdomain + DNS (`cos.cert-expert.de` → VPS-IP)
- [ ] `.env.production.local` auf VPS (Werte aus 1Password/Secrets; `DATABASE_URL=file:./prisma/dev.db`, `NODE_ENV=production`)
- [ ] Erster Deploy (`git pull` · `npm ci` · `npm run db:push` · `npm run build` · systemd enable) + nginx/certbot
- [ ] Tally-Webhook PATCH auf `https://cos.cert-expert.de/api/webhooks/tally` + Test-Submission → `deliveryStatus: SUCCEEDED`
- [ ] Backup-Cron auf `prisma/prisma/dev.db`
- [ ] Optional: Tally Hidden Field `cea_company_slug` im Formular `vGNvY0`

## Guardrails
EC-09 (Generator/ZIP nie brechen) · EC-10 (kein Freigabe-/Auditfähigkeitsstatus) · Verifikation im echten Browser, nicht per Skript · Secrets/`.env*`/`*.db` nie committen (DSGVO) · Mark = Gate.
