# Cursor-Arbeitsauftrag — Slice 1: Tally-Eingang (Intake)

**Freigabe:** Mark, 2026-06-07. **Track:** Code-Track (Claude reviewt, Cursor baut).
**Vorab lesen:** HANDOFF (Slice-0 FINAL + NACHTRAG 2), `CURSOR_BAUAUFTRAG_TOOL2.md` (Slice 1), `hq/10_Bridge/brand/BRAND_SPEC.md`.
**Repo:** `cert-expert-certification-os/apps/certification-os/` · Branch `main` · Port **3001**. Slice 0 = Commit `861f210`.

> **Akzeptanz-Regel (ab jetzt fix): im echten Browser / mit echtem Tally verifizieren — NICHT per Skript.**

## 0. Vorab-Hygiene (zuerst)
- **`/uploads`-Render-Loop beheben** — Log zeigt hunderte `POST /uploads` (vermutlich `set-state-in-effect` auf der Uploads-Seite). Entkoppeln, sodass die Seite nicht in Endlosschleife Server-Actions feuert. EC-09 unberührt.

## Ziel (was Mark am Ende kann)
Der Kunde füllt wie gewohnt das **Tally-Mitarbeiter-Formular**; jede Einreichung + hochgeladene Dateien landen **automatisch** als Akte im richtigen Kunden-Pool — **ohne Make**.

## Build (Definition of Done)
1. **Feld-Mapping zuerst (Vorarbeit):** mit `TALLY_API_KEY` (in `.env.local`) per REST (`https://api.tally.so`) die **4 Formulare** + Feld-`key`/`label`/`type` ziehen → Tabelle nach **`hq/10_Bridge/TALLY_FIELD_MAPPING.md`** (Tally-Feld → `EmployeeFile`/`EvidenceItem`/`CompanyExportSettings`). Unklare Felder als „offen" markieren. **Claude reviewt die Tabelle, bevor verdrahtet wird.**
2. **Webhook fertig verdrahten** (`POST /api/webhooks/tally`, Stub existiert):
   - **Signatur-Fix:** Tally signiert **base64** (`createHmac('sha256',secret).update(rawBody).digest('base64')`), Header `Tally-Signature` **ohne** `sha256=`-Prefix. `verifyTallySignature` entsprechend anpassen, gegen **echten** Tally-Webhook testen. `TALLY_WEBHOOK_SECRET` in `.env.local` setzen (von Tally beim Webhook-Anlegen).
   - **10-Sek-Timeout:** sofort 2XX zurück, Verarbeitung danach/asynchron.
   - **Idempotenz:** `responseId`/`submissionId` als Schlüssel — gleiche Einreichung **nicht doppelt** anlegen.
3. **Mapping anwenden:** Submission → `EmployeeFile` (+ Stammdaten) im **richtigen Kunden-Pool**. Kunden-Zuordnung klären (Formularfeld? eigenes Formular je Kunde? → mit Mark abstimmen).
4. **Dateien:** `FILE_UPLOAD`-URLs **sofort von Tally herunterladen** → **Hetzner S3** (`cea/companies/{slug}/evidence/…`) → `EvidenceItem` (Status `unchecked`). Tally-Links können ablaufen.
5. **Make.com aus dem Pfad nehmen.**

## Guardrails / DSGVO
- Webhook **signiert**; ungültige Signatur → 401.
- **EC-10:** keine automatische Freigabe-/Auditfähigkeits-/Zertifizierungsaussage. Eingehende Nachweise = „unchecked".
- Personendaten zugriffsgeschützt.

## Akzeptanz (Browser/echt)
- Test-Submission via Tally (oder „Resend") → erscheint als Akte im **richtigen** Kunden-Pool, Datei liegt auf Hetzner.
- Falsche Signatur → 401; Doppel-Submit → kein Duplikat.
- **EC-09-Smoke grün** (Person → Generator → ZIP).
→ Ergebnis + offene Punkte in HANDOFF; Claude reviewt (Feld-Mapping + Webhook).
