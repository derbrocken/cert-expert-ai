# CLAUDE.md — Cert-Expert Certification OS (Code-Track)

> Bedienungsanleitung für Claude Code in Cursor. **Tipp:** In Cursor den **Repo-Root `cert-expert-ai/` öffnen** (nicht nur den App-Unterordner), damit Code **und** `hq/10_Bridge/` **und** `knowledge/` gemeinsam sichtbar sind.

## Arbeitsmodell (Split)
- **Planer/Reviewer (Claude):** plant mit Mark, entwirft Slices, reviewt den Output — fängt blinde Flecken.
- **Executor (Claude):** schreibt Code an der Quelle, startet Dev-Server, prüft `tsc`/Lint/Tests, verifiziert live.
- **Mark entscheidet & gibt frei.** Kein Slice/keine Architekturänderung ohne seine Freigabe.
- **Review-Takt bewusst halten:** Executor-Output wird gegengeprüft (Planer + Mark als Gate), nicht selbst durchgewunken.

## Zwei-Spuren-Betrieb (Planer ↔ Executor)

Jeder Chat hat genau **EINE** Rolle. Mark sagt sie in der ersten Nachricht an; ist sie nicht angesagt → **nachfragen, nicht raten**.

**Spur P — Planer/Reviewer** (schreibt **KEINEN** Produktivcode):
- Plant den nächsten Slice gegen `NORM_MATRIX_…v2` + `KLAUSEL_REGISTER` → schreibt Bauauftrag nach `hq/10_Bridge/CURSOR_SLICEx_AUFTRAG.md` (Was-kann-Mark-am-Ende, DoD, betroffene Dateien, jede Norm-Regel mit `clauseId`).
- Reviewt den Executor-Code: liest letzten Commit/Diff → Befund nach `hq/10_Bridge/CODE_REVIEW.md`.
- Läuft episodisch, brennt wenig Kontext.

**Spur E — Executor** (baut):
- Liest `CLAUDE.md` + `HANDOFF` + den passenden `CURSOR_SLICEx_AUFTRAG.md`.
- Baut den Slice, hält EC-09-Smoke + `tsc --noEmit` grün, committet (mit Marks OK), schreibt Ergebnis + offene Punkte nach `HANDOFF.md`. Faustregel ~1 Slice pro Chat.

**Mark — Gate:** entscheidet, gibt frei, dirigiert; schreibt selbst keinen Code.

Koordination **NUR über Dateien** (Bauauftrag → HANDOFF → CODE_REVIEW), nicht über Kontext-Hin-und-Her. Beide Spuren folgen dem **Übergabe-Takt**.

### 🔒 Rollen-Kontrakt — verbindlich (sonst „bläst der Executor am Ende alles auf")
**Die Planung gehört dauerhaft dem Planer (Spur P). Der Executor plant NICHT — er führt aus und meldet zurück.** Konkret:

**Executor DARF am Übergabepunkt NUR:**
1. Bauen, was im `CURSOR_…_AUFTRAG.md` steht (nicht mehr, nicht weniger).
2. `tsc` + EC-09-Smoke + Browser-Akzeptanz fahren, dann **committen** (mit Marks OK).
3. **EINEN** kurzen, datierten Eintrag unter „**Von Cursor an Claude**" anhängen: *fertig / offen / Commit-Hash*.
4. In der „HIER STARTEN"-Box **nur den Status kippen** (z. B. „Executor baut" → „committet `xyz`") — **nicht den Plan umschreiben**.

**Executor DARF NICHT:**
- Specs/Entscheidungen/Bauaufträge **umschreiben oder neu aufmachen**, Scope erweitern, Architektur ändern, Norm-Werte erfinden.
- Das HANDOFF „neu strukturieren" oder Planungstext verfassen.

**Neue Idee, Scope-Frage, Unklarheit, Norm-Zweifel?** → **als Frage** an den Planer in den HANDOFF schreiben (oder Mark fragen) — **nicht selbst entscheiden, nicht selbst einplanen.** Planung/Review/Norm-Mapping = ausschließlich Spur P. Verstoß = Re-Review + Rückbau.

## Guardrails (nicht verhandelbar)
- **EC-09:** Person → Akte → Doc-Chips → ZIP-Generator darf NIE brechen. Vor/nach Änderung Smoke grün.
- **EC-10:** keine automatische Freigabe-/Auditfähigkeits-/Zertifizierungsaussage. Eingehende Nachweise = `unchecked`. „grün/qualifiziert" ≠ „einsatzbereit".
- **C-10:** keine Architekturentscheidung ohne Gate (mit Mark).
- **Keine erfundenen Normpflichten.** Jede Norm-Regel trägt eine **`clauseId` (CL-xx)** aus `knowledge/NORM_KLAUSEL_REGISTER_v1.md`. Ohne CL-ID → nicht zulässig (als „fachlich prüfen" markieren).
- **Im Echten verifizieren** (Browser/Tally), **nicht per Skript**. Akzeptanz = reale Submission/echter Klick.
- **DSGVO:** `prisma/**/*.db` (Personendaten) **nie** committen — ist ignoriert. `.env*` nie committen.
- **Nicht in Dateien schreiben, die Mark gerade offen hat** (Save-Konflikt).

## Übergabe-Takt (Agent → Mark, dauerhaft)
**Mark muss nicht dran denken — der Agent erinnert aktiv.**

Nach jedem **abgeschlossenen Task/Slice** und nach jedem **Commit** kurz melden:
> ✅ **Stabiler Punkt** — guter Zeitpunkt zum Committen/Übergeben (neuer Chat).

Wenn der Kontext **~70–80 % voll** ist oder frühe Infos verloren gehen: aktiv vorschlagen:
> **Übergabe empfohlen.**

**Übergabe-Ablauf (immer gleich):**
1. Stabilen Punkt erreicht (Smoke/Lint grün, Scope klar abgeschlossen).
2. **Committen** (nur mit Marks OK — oder Mark committet selbst).
3. **`hq/10_Bridge/HANDOFF.md`** — Abschluss-Eintrag: fertig / offen / nächster Schritt / **Commit-Hashes**.
4. **Neuer Agent** auf `main`: liest **`CLAUDE.md` + HANDOFF (HIER STARTEN + Abschluss)** → macht weiter.

Nicht bis 100 % Context warten. **Dauerhaftes Gedächtnis = Repo-Dateien, nicht der Chat.**

## Source of Truth (zuerst lesen)
- `hq/10_Bridge/HANDOFF.md` — Status, letzter Abschluss-Eintrag, nächster Schritt.
- `hq/10_Bridge/CURSOR_BAUAUFTRAG_TOOL2.md` — Gesamt-Bauplan (Slices 0–5, gesperrte Entscheidungen).
- `knowledge/NORM_MATRIX_Mitarbeiternachweise_v2.md` — Norm-Logik (qualifiziert-Def., UE, A/B/C, Fristen, Quoten, Einstiegswege).
- `knowledge/NORM_KLAUSEL_REGISTER_v1.md` — Traceability (CL-IDs ↔ Fundstelle).
- `hq/10_Bridge/GESCHAEFTSMODELL_VINCENT_WOLF_PROJEKTAKTE.md` — Geschäftsmodell + Projektakte-Architektur.
- `hq/10_Bridge/TALLY_FIELD_MAPPING.md` · `CODE_REVIEW.md` · `HETZNER_DEPLOY.md`.
- Globale `CLAUDE.md` (Nutzer-Ebene): Cert-Expert-Stil — auditfähig, pragmatisch, normnah, Platzhalter `{CompanyName}` etc.

## Repo / Betrieb
- **Ein Repo**, Root = `cert-expert-ai/`. App = `cert-expert-certification-os/apps/certification-os/`.
- Branch `main` · Dev-Port **3001** (`npm run dev`).
- **Prisma:** CLI liest `.env` (nicht `.env.local`) → bei `db:push` `DATABASE_URL` setzen. DB-Doppelpfad `prisma/prisma/dev.db` (Tech-Debt: vereinheitlichen).
- Hetzner S3 für Binärdateien; Tally-Webhook-Intake (EU).

## Build-Stand (2026-06-07)
- **Slice 0** (persistente Akte) = Commit `861f210`. ✅
- **Slice 1** (Tally-Intake) + **Nachzug** (Beschäftigungsart/Qualifikation/Rolle) = Commit `4d9cefe`. ✅ browser-verifiziert (Wolf Street / blubermann).
- **Slice 2** (Requirement-Engine + Schulungsrechner) = **noch nicht gestartet** (separate Freigabe). Gegen Norm-Matrix v2 + Klausel-Register bauen; jede Regel `clauseId`.

## Offene Fäden
- **DEKRA klären** (Norm-Matrix §15 / CL-60–62): Teil-1-Doku-Basis, „Schulungen nur geplant", vergangenes Event als Referenz.
- **Legal-Input von Mark** (CL-70–73): BewachV/Wachbuch/Aufbewahrung, Bewacherregister, NON-DIN-Pflichtangaben, DGUV/Fahrer.
- **Tech-Debt:** Tally-Key rotieren, cloudflared flüchtig → Hetzner-Deploy, Hidden-Slug-Routing exakt, Legacy-Backfill, DB-Doppelpfad vereinheitlichen.
