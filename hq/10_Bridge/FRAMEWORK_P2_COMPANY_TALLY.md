# P2 — Company-Tally (`Y5Zq80`) → zentrales Firmen-Profil (Plan-Einseiter)

> **Teil von:** `FRAMEWORK_TOOL1_TOOL2_UPLOAD.md` (Schicht 1). Ziel: **Logo + Firmeninfos kommen über das Tally-Formular „Unternehmensunterlagen" automatisch ins zentrale `CompanyExportSettings`** — das Profil, das Tool 1 (P1) und Tool 2 schon nutzen.
> **Status:** Plan + EINE Mark-Abhängigkeit (Tally-Feld-Keys). Kein Blind-Bau gegen die veraltete Entwurfs-Mapping.
> **Stand:** 2026-06-12.

## 1. IST
- Webhook akzeptiert nur das **Mitarbeiter**-Formular `vGNvY0`; `Y5Zq80` wird als `unsupported-form` verworfen (`tally-intake-service.ts:318-335`).
- Zentrales Profil `CompanyExportSettings` existiert + wird beim Mitarbeiter-Intake schon teilbefüllt (`companyName`/`companyEmail`, Zeile 370). Logo-S3-Helfer vorhanden (`buildCompanyLogoKey`, `putCeaObject`, `getCeaObjectBuffer`).
- **Problem:** Die dokumentierte `Y5Zq80`-Mapping (2026-06-07, `TALLY_FIELD_MAPPING.md:90`) ist ein **halbfertiger Entwurf** — `7dM2QA`=Firmenname sauber, aber viele Felder leer-gelabelt, **kein identifizierbares Logo-Feld**. Du hast das Logo-Feld inzwischen angelegt → Mapping veraltet. Der Tally-REST-Key ist 401 (Tech-Debt) → ich kann die Felder **nicht** frisch per API ziehen.

## 2. SOLL — P2-A (jetzt): Firmeninfo + Logo → Profil
- Webhook bekommt einen **`Y5Zq80`-Zweig**: Firma auflösen (`resolveCompanySlug` aus Firmenname) → `CompanyExportSettings` upserten (Name/E-Mail) → **Logo** aus der Tally-Datei-URL laden → `putCeaObject(buildCompanyLogoKey(slug, ext))` → `logoStorageKey` setzen.
- Danach: Logo/Firmeninfo erscheinen **automatisch** in Tool 1 (P1-Auto-Fill) und Tool 2 — ohne Hand.
- **EC-10:** eingehende Daten = reine Stammdaten, keine Freigabe-/Auditaussage.

## 3. BEWUSST SPÄTER — P2-B: Firmen-Dokumente
- Die `FILE_UPLOAD`-Felder (Unbedenklichkeitsbescheinigung etc.) → ein **firmen-ebenes Dokument-/Nachweis-Lager**. **Heute existiert KEIN company-level Evidence-Modell** (EvidenceItem hängt an EmployeeFile) → braucht neues Modell + UI → **eigene Phase**, nicht P2-A.

## 4. UMSETZUNG (P2-A, nach Feld-Keys)
- Config `lib/data/tally-company-fields.json` (analog `tally-employee-slots.json`): `companyNameQuestionId`, `companyEmailQuestionId`, `logoQuestionId`.
- Pure Mapping/Parser (`tally-company-intake.ts`, testbar): Webhook-Payload → `{ companyName, email, logoFileUrl }`. Unit-Tests (Feld-Extraktion, fehlend → tolerant).
- Service: `Y5Zq80`-Zweig in `tally-intake-service.ts` → Profil-Upsert + Logo-Download→S3 (Helfer wiederverwenden). Tolerant: fehlt Logo/Feld → kein Bruch.
- **Keine Schema-Änderung** (Profil-Tabelle existiert). Kein Generator/Engine-Bezug (EC-09 n/a).

## 5a. ✅ FELD-KEYS VERIFIZIERT (2026-06-12, via Tally REST API — Key funktioniert wieder)
`GET /forms/Y5Zq80/questions` (200): **`7dM2QA`** Firmenname · **`blvxao`** E-Mail · **`J2MA7d`** „10. Logo des Unternehmens." (FILE_UPLOAD). Firmen-Dokumente (P2-B) ebenfalls sauber gelabelt: Unbedenklichkeitsbescheinigungen (`AlyLkk`/`BG0kvN`), Gewerbezentralregister `kYv6LM`, Handelsregister `vNKyRQ`, Bewachungserlaubnis `KMklX7`, Versicherung `LdkWl1`, Datenschutz `pLvBab`, Verschwiegenheit `1r678W`, Mindestlohn `MAMzBX`. **→ Keine Test-Submission nötig fürs Bauen.**

**Aktivierung (live, 2 Schritte, Tally-seitig):** (1) `Y5Zq80`-**Webhook** auf `https://cos.cert-expert.de/api/webhooks/tally` setzen, gleicher Signing-Secret (Tally-UI — API-Webhook-Pfad gibt 401, anderer Scope). (2) Eine echte Submission → Profil+Logo verifizieren.

## 5. (historisch) WAS ICH VON DIR BRAUCHTE — durch 5a erledigt
**Eine echte Test-Submission von `Y5Zq80`** (du füllst das Formular einmal mit Firma + Logo + Test-Datei aus, real abschicken). Dann lese ich die **live Field-Keys** aus dem Webhook-Intake-Log (wie bei `vGNvY0` Slice 1) und finalisiere `logoQuestionId` + bestätige `companyName`/`email`. **Alternativ:** du nennst mir direkt die `questionId` des Logo-Feldes.
*(Grund: gegen die veraltete Entwurfs-Mapping zu raten = genau der „auf Annahmen bauen"-Fehler.)*

## 6. DoD
- tsc 0 · Build grün · neue Unit-Tests (Company-Intake-Parser) · bestehende Suite unberührt.
- **Echte Test-Submission verifiziert:** `Y5Zq80` → Profil befüllt + Logo in S3 + sichtbar in Tool 1/Tool 2 (Browser-Abnahme Mark).
- EC-10 gewahrt; Tally-Webhook-Signatur unverändert.

## 7. Gate / Ablauf
1. **Mark:** Test-Submission `Y5Zq80` (oder Logo-questionId nennen).
2. Ich finalisiere die Feld-Map + baue P2-A in einem Pass.
3. P2-B (Firmen-Dokumente) = eigene Phase nach Bedarf.

> **→ Mark:** P2-A-Scope ok? Dann brauche ich Schritt 1 (Test-Submission/Logo-questionId) — danach baue ich.
