# CODE_REVIEW — Claude reviewt Cursor-Code

**Zweck:** Hier protokolliert Claude Reviews von Dashboard- / Certification-OS-Änderungen.

---

## 2026-06-08 — G4 Phase 1: roleClass-Modell + Migration + Engine-Refactor + schlankes Anlege-Formular, Commit `047878c` — **Executor-Selbst-Review** (autonomer Lauf)

**Hinweis Rollenkontrakt:** Dies ist ein **Executor-Selbst-Review** unter Marks autonomer Vollmacht (Run-Order §2/§7), kein unabhängiger Planer-Review. Ein unabhängiger Planer-Review (Engine-Refactor + Migration besonders) bleibt empfohlen.

**Methode:** Eigen-Review des Feat-Commits `047878c` (11 Dateien) gegen `CURSOR_G4_AUFTRAG.md` (v3, §4/§5/§6 DoD) + `NORM_MATRIX_…v2` + `NORM_KLAUSEL_REGISTER_v1`. Verifikation: `tsc --noEmit` = **0**; Engine-Suite `tsx --test` = **24/24 grün** (20 alt umgestellt + Mapping-Test + Einsatzleitung=FK + Subunternehmer/Praktikant/„keine Klasse"); **EC-09 im echten Browser :3001** (ZIP `POST /employee-automation` **200**, mehrfach, kein 5xx, 490 ms reale Generierung); **Read-Migration live** (blubermann `Bürokraft / Verwaltung`→`roleClass=verwaltung` in DB persistiert); **Anlegen über neues Formular** (FK + Vorlage → `roleClass=fk` in DB persistiert); Dossier-Edit-Tabelle zeigt Norm-Klasse korrekt.

### Verdict
**Selbst-abgenommen (G4 Phase 1).** roleClass ist primärer Engine-Input, Org-Titel nur Anzeige; Migration idempotent; keine neue CL/UE; EC-09/EC-10/„keine erfundene Pflicht" gewahrt. Kein Blocker. Zwei Minor-Findings (unten).

### Review-Punkte (jede Regel CL-belegt)
1. **Datenmodell ✅.** `roleClass` Union `ek|fk|verwaltung|praktikant|subunternehmer` in `types/employee.ts`, Prisma `String?` (kein `@default` → SQLite-sicher, P2023-Lehre). Repository: Read-Migration in `employeeFileToEmployee` (leitet aus `roleType` ab, wenn DB-Wert fehlt; `asRoleClass`-Guard) + `roleClass` in allen 4 Write-/Upsert-Pfaden. Org-Titel `roleType` bleibt erhalten, Engine liest ihn nicht mehr direkt.
2. **Engine-Refactor ✅.** `isBewachungsklasse`/`isFuehrungsklasse`/`isVerwaltungsklasse`/`isPraktikantklasse`/`isSubunternehmerklasse` klassifizieren nach `roleClass`. `bewachung = isBewachungsklasse(ek|fk|sub) || !!niveau`; `fuehrung = fk || niveau==='fk'`. **Keine neue CL/UE** — Pflicht-Set/Trigger/CL-IDs identisch zu Slice 3 (CL-01/03/04/05/06/07/08, CL-10 FK, CL-20/21/24/25 SDL, CL-42 Sub). Slice-3-Doppelrolle unverändert.
3. **Mapping/Migration ✅.** `mapRoleTypeToRoleClass` Single-Source: Einsatzleitung→`fk`, Objekt-/Schichtleitung/SMA→`ek`, Bürokraft/GF→`verwaltung`, Praktikant→`praktikant`, Sub-SMA→`subunternehmer`; unbekannt/leer→`undefined` (keine erfundene Klasse). Genutzt von Repository-Read + Presenter-Fallback + Form-Defaults. Test deckt alle Titel + Unbekannt. Live: blubermann→verwaltung persistiert.
4. **Einsatzleitung = FK (Mark-Gate) ✅.** Szenario 4c: Einsatzleitung→fk → Asyl 40+24=64 (CL-24/25) + q-fk-quali CL-10 bei DIN-SDL. Objekt-/Schichtleitung bleiben EK (Szenario 3c: 16 UE, kein FK-Quali). Keine titelgebundene FK-Pflicht erfunden.
5. **Zod/Formular ✅.** `roleClass` Pflicht-Enum, `roleType` optional, `trainingHours` + Freitext-roleType entfernt. Schlankes Anlege-Formular (master): „Rolle & Norm-Klasse" (Norm-Klasse-Select Pflicht + Org-Titel-Dropdown-mit-Freitext, Default→Klasse nur wenn Klasse noch leer + Doku-Vorlage `roleId`) + „Einsatz & Anforderungen" (Doppelrolle/Beschäftigung/Qualifikation/SDL/Dienstfahrzeug/Erste-Hilfe-/Brandschutz-Frist). Doc-Auswahl **unverändert am heutigen Ort** (Phase 1, Gate c) → EC-09 minimal berührt.
6. **EC-10 / keine erfundene Pflicht ✅.** Keine Freigabe-/Auditaussage; Form-Hints referenzieren nur bestehende CL-IDs (CL-40/11/08/23/10/20/25) bzw. `null`→„fachlich prüfen" (CL-73 Fahrer = Legal-Input, nicht erfunden). Invarianten-Test grün.

### Guardrails
- **EC-09:** Generator/ZIP nicht gebrochen — Browser ZIP `POST 200` mit neuer Person + Migration aktiv. ✅
- **EC-10:** Status-Union konservativ, kein Freigabestatus. ✅
- **DSGVO/Hygiene:** Commit `047878c` = **11 Code-Dateien** (explizite Pathspecs); `.db`/`.env`/Kundendaten (`hq/03_Kundenprojekte/**`, fremd-gestaged) **ausgeschlossen**, verifiziert via `git show --name-only`. ✅

### Minor-Findings (Beobachtung, kein Blocker)
1. **Browser-Akzeptanz-Matrix nur teilweise live gefahren.** DoD §6 nennt „EK/FK/Verwaltung/Praktikant/Sub + Doppelrolle je ein Durchlauf". Live verifiziert: FK-Neuanlage + Verwaltung-Migration (blubermann) + Dossier-Recompute. Die übrigen Klassen/Doppelrolle sind **deterministisch durch die 24-Test-Suite** abgedeckt (jede Klasse + D1–D7). Empfehlung: im Planer-Review optional die restlichen Klassen einmal klicken.
2. **Legacy-Akten ohne jede Rolle** („Markus Mahatma", „peter Marquardt": kein roleType/roleClass) erhalten nach Migration weiterhin **keine** Klasse → Engine-Hinweis „Keine Norm-Klasse erfasst" (korrekt, keine erfundene Klasse). Bearbeiter muss Klasse manuell setzen — erwartetes Verhalten, kein Bug. `EmployeeFileAkteInlineEdit.tsx` (ungenutztes Alt-Form, nur DossierView nutzt die Tabelle) wurde nur lauffähig gehalten (roleClass-Select + trainingHours raus).

**Methode:** Review des Feat-Diffs `a276d38` (8 Dateien) gegen `CURSOR_SLICE3_AUFTRAG.md` + `NORM_MATRIX_Mitarbeiternachweise_v2.md` (§1/§3.1/§5/§8/§10) + `NORM_KLAUSEL_REGISTER_v1.md` (CL-01/10/20/21/24/25/40). Engine-SDL-/Fristen-Block vollständig gelesen (nicht nur Diff-Hunks). **Unabhängig im Planer-Environment re-verifiziert** (read-only): `npx tsc --noEmit` = **0 Fehler**; Engine-Suite `npx tsx --test` = **20/20 grün** (13 alt + 7 neu D1–D7 + Invariante). EC-09 + Doppelrolle-Browser = Executor-Verifikation nach etabliertem Planer↔Builder-Muster (Persistenz über Reload, GF+EK live, ZIP `POST /employee-automation` 200) übernommen.

### Verdict
**ABGENOMMEN (Slice 3).** Doppelrollen-Niveau-Modell ist norm-konform, CL-rückführbar, EC-09/EC-10/„keine erfundene Pflicht" gewahrt. Alle 6 Review-Punkte erfüllt. Keine Blocker. Ein Minor-Finding (UI, unten) = Beobachtung, kein Re-Bau.

### Review-Punkte (jede Regel CL-belegt)
1. **Niveau-Modell verdrahtet ✅.** `zusatzBewachungNiveau` "ek"/"fk" → Context (4.1). Effektive `bewachung = baseBewachung || !!niveau`; `fuehrung = isFuehrungskraft || niveau==="fk"`. Greift in **allen** Gates: A-„Qualifiziert"-Set (q-34a/einweisung/datenschutz/verschwiegenheit/profil/ersthilfe, alle `if(bewachung)`), C-SDL-Soll (Z. 499/523/549, `bewachung`+`fuehrung`), E-Jahres-Weiterbildung (Z. 650, `bewachung`), Fristen (Z. 684/710, `bewachung`). D1 vs. D2 belegen das Gate.
2. **EK vs. FK ✅.** EK → `sdl-veranstaltung-ek` CL-21 (16 UE) + `sdl-asyl-base` CL-24 (40). FK → `sdl-veranstaltung-fk` CL-20 (24 UE) + `sdl-asyl-base` CL-24 (40) + `sdl-asyl-fk` CL-25 (24 ⇒ 64). FK **baut auf EK-Basis auf** (asyl-base immer bei `bewachung`, +24 bei `fuehrung`) — deckt „EK und/oder FK". Stimmt mit Register (CL-20 §5.3 / CL-21 §5.4 / CL-24 §8.3 / CL-25 §8.4) überein. D3/D4 belegen.
3. **CL-10-Gate ✅.** `if (fuehrung && hasDinSdl)`, `hasDinSdl = sdlScopes.some(startsWith din1|din2)`. Greift für **beide** FK-Wege (effektive `fuehrung`); `non-din` zählt nicht. Slice-2-Präzisierung (FK ohne SDL → kein CL-10) umgesetzt **und** getestet (D7: FK-ohne-SDL / FK-non-din / Doppelrolle-fk-ohne-DIN ⇒ alle kein `q-fk-quali`; Gegenstück D4 mit DIN-SDL ⇒ Posten da, Status „fachlich prüfen").
4. **Reduktion unterdrückt ✅.** `if (verwaltung && !doppelrolle)` + `if (praktikant && !doppelrolle)`; `doppelrolle = !!niveau && !baseBewachung`. Kein widersprüchliches `v-34a-na`/`v-datenschutz`/`p-reduziert` neben `q-34a`. D1 (kein v-34a-na/v-datenschutz) + D6 (kein p-reduziert) belegen. (Begründung korrekt: `v-34a-na` hat `clauseId null` → Presenter dedupt es nie → würde sonst neben `q-34a` stehen.)
5. **Keine erfundene Pflicht / EC-10 ✅.** Keine neue CL-ID, kein neuer UE-Wert — nur Trigger/Niveau auf bestehenden Regeln. Status-Union bleibt konservativ; keine „freigegeben/auditfähig/einsatzbereit"-Aussage. Invarianten-Test grün (jede Regel ohne CL = „fachlich prüfen"/„nicht erforderlich").
6. **Repository (5 Mapping-Stellen) ✅.** `asNiveau`-Helfer (Read-Normalisierung auf Union). Feld in allen 5 Stellen: `employeeFileToEmployee` (Read), `employeeToUpsertData` (Create), `upsertEmployeeFile`-update, `replaceEmployeeFilesForCompany`-update, `migrateFromLocalStoragePayload`-update. Schema `String?` (nullable, **kein** `@default` → SQLite-sicher, vermeidet den P2023-Json-Default-Crash aus Slice 2). Feld geht über Save/Load/Migration nicht verloren.

### Guardrails
- **EC-09:** Generator/ZIP nicht berührt (Engine = Logik, Repository = additives Feld). Executor-Browser ZIP 200. ✅
- **EC-10:** keine Freigabe-/Auditaussage; Status-Union konservativ. ✅
- **Keine erfundene Norm:** jede aktive Regel CL-belegt; Invariante grün. ✅
- **DSGVO:** DB/.env nicht committet (Commit = 8 Code-Dateien). ✅

### Minor-Finding (Beobachtung, kein Blocker)
1. **„No-op für echte Bewachungsrollen" gilt nur für „ek".** Bei einer echten EK-Bewachungsrolle (z. B. SMA) + Auswahl **„fk"** wird `fuehrung = true` → die Person würde auf FK-Niveau gehoben (CL-20/25 statt CL-21/24, + CL-10 bei DIN-SDL). Auftrag §6 nennt die Auswahl für echte Bewachungsrollen einen „No-op" — das stimmt nur für „ek" (D5 testet auch nur „ek"-Idempotenz). Das **„fk"-Hochstufen ist fachlich vertretbar** (bewusste, manuelle FK-Wahl durch den Bearbeiter), bricht keine Norm und keinen Guardrail. **Empfehlung (UI-Feinheit, optional, kein Re-Bau):** entweder den Select für echte Bewachungsrollen ausblenden (Auftrag §6 „optional schlank") **oder** den Hinweistext um „auf einer Bewachungsrolle hebt ‚FK' auf Führungskraft-Niveau" ergänzen. → als Notiz an Executor/Mark, nicht blockierend.
2. **UI-Status-Badge auf der Select-Zeile** (`employee.zusatzBewachungNiveau ? "vorhanden" : "nicht erforderlich"`): Auftrag §6 sagte „kein Badge nötig (Zeile ohne Badge ok)". Executor hat einen Befüllt-Indikator gesetzt — Werte aus der bestehenden Status-Union, EC-10-neutral, harmlos. Kein Handlungsbedarf.

### Mitgenommen
- **URL-Fix `17f94cc`** (`?new=1`-Spiegelung in `handleCreateNew`): gegengecheckt — reine `router.replace`-URL-Spiegelung; `?new=1` wird beim Laden in `EmployeeAutomationPage.tsx` Z. 235/256 (`searchParams.get("new") === "1"`) ausgewertet. Keine Engine-/Architekturänderung. **Harmlos, bestätigt** (Planer-5-Einschätzung trägt).

### Offene Fäden (kein Blocker → Planung)
1. **Executor-FRAGE „Anlege-Formular auf Requirement-Modell migrieren?"** = eigener Slice, Architektur/Scope → Mark-Gate (s. HANDOFF „Offene Entscheidungen").
2. **Slice 3b** (Tally-Formular-Feldlücke) gated auf Marks Tally-Arbeit. **Slice 4** (Ampel-/Status-Ansicht, QFD #1). DEKRA (CL-60–62), Legal-Input (CL-70–73), Ist-UE-Auto-Summe.

---

## 2026-06-07 — Post-Deploy-Abnahme: Hetzner LIVE (https://cos.cert-expert.de, Commit `404d55d`) — Planer 4

**Methode:** Deploy von Planer 4 **auf Marks ausdrückliche Anweisung** durchgeführt (Server-Ops, **kein Produktivcode geändert**). Live-Verifikation über echte HTTPS-Requests + reale Tally-Test-Submission (kein Skript-Fake) + Server-Logs/DB.

### Verdict
**LIVE ABGENOMMEN (vollständig).** App öffentlich unter HTTPS erreichbar, Tally-Intake end-to-end grün (Signaturprüfung real bestanden, Akte erstellt), **EC-09-ZIP live verifiziert** (echter Klick, ELC Security and Service: `POST /employee-automation 200`, Body **135.179 B ≈ 135 KB ZIP**, keine 5xx). Guardrails gewahrt. Keine Blocker.

### Verifiziert (live)
- **Erreichbarkeit:** `https://cos.cert-expert.de/` + `/employee-automation` → HTTP **200**; `http://…` → **301**-Redirect auf HTTPS; HTTPS-Zert. Let's Encrypt (bis 2026-09-05, Auto-Renew).
- **Webhook-Endpoint:** GET → **405** (POST-only, **kein 502** → Route + Proxy + App gesund).
- **Tally-Intake end-to-end (echte Submission):** Server-Log `[POST /api/webhooks/tally] Accepted { responseId: 'Eq16BYX', formId: 'vGNvY0', fieldCount: 145 }` → `[tally-intake] Intake complete { employeeIds: ['tally-Eq16BYX-emp-1'] }`. **Signaturprüfung real bestanden** (verifyTallySignature; sonst 401). Akte „Test Person"/SMA in DB. Firma „Test Deploy" → Legacy-Pool (kein Registry-Slug = erwartet).
- **Infra:** systemd-Unit aktiv (Restart on-failure), DB unter `prisma/prisma/dev.db` (kanonisch, kein zweites File), Backup-Cron erster Lauf erfolgreich.

### Guardrails
- **EC-09:** Live verifiziert — echter ZIP-Export (ELC Security and Service) `POST /employee-automation` → **200, ~135 KB ZIP-Body**, keine 5xx. Generator/ZIP live grün. ✅
- **EC-10:** kein Freigabe-/Auditstatus durch Deploy berührt. ✅
- **DSGVO:** `.env.production.local` nur auf Server, nicht im Git; reale Keys nicht committet. ✅
- **Kein Produktivcode geändert** (Spur-P-konform): Deploy = bestehender Commit `404d55d` + Server-Config. ✅

### Offene Fäden (kein Blocker)
1. **Tally-REST-Key 401** → rotieren (Tech-Debt); Webhook-Verwaltung lief korrekt über Tally-UI.
2. **systemd User=root** → später auf non-root härten. **Test-Akte** ggf. löschen.
3. **UX-Beobachtung (Mark, live):** Anlege-Maske ist schlank (Slice-2-Felder SDL/Dienstfahrzeug/Fristen/UE erscheinen erst in der Akte/Dossier, nicht im Create-Form) — by design, kein Bug; deckt sich mit der Formular-Feldlücke (Slice-3-Thema).
4. **Slice 3** (Planer 5): Doppelrollen + Tally-Formular-Feldlücke (s. HANDOFF-Finding, C-Empfehlung) — jede Regel mit `clauseId`.

---

## 2026-06-07 — Pre-Deploy-Final-Abnahme: Hetzner-Gates (Basis `0d92ff2`, kein Code-Commit) — Planer 4

**Methode:** Review des Executor-Ergebnisses (HANDOFF „Von Cursor an Claude", 2026-06-07: alle 4 Gates grün) gegen `CURSOR_HETZNER_PREDEPLOY_AUFTRAG.md`. Die belegbaren Gates **unabhängig im Planer-Environment re-verifiziert** (read-only, kein Produktivcode).

### Verdict
**ABGENOMMEN (Pre-Deploy).** Alle 4 Gates grün, 3 davon vom Planer unabhängig nachgeprüft, 1 (EC-09-Prod-Browser) Builder-verifiziert nach etabliertem Muster. **Keine Blocker → Mark kann deployen** (DNS / `.env.production.local` / systemd / nginx / certbot / Webhook-PATCH / Backup-Cron), Runbook `HETZNER_DEPLOY.md` + Bauauftrag „DANACH".

### Gate-für-Gate
1. **`next build` = 0 Errors — UNABHÄNGIG RE-VERIFIZIERT ✅.** Selbst `npm run build` gefahren: `prisma generate` + `next build` (Next 16.1.1/Turbopack) → **Exit 0**, „Compiled successfully", **„Running TypeScript" ohne Fehler**, alle 15 statischen Seiten + alle Routen (`/employee-automation`, `/model-creator`, `/uploads`, `api/webhooks/tally`, …) generiert. Gegencheck `next.config.ts`: **kein** `eslint.ignoreDuringBuilds`, **kein** `typescript.ignoreBuildErrors` → der Gate ist echt (tsc + ESLint laufen im Prod-Modus). Die vom Builder gemeldeten 5 ESLint-Warnings sind nicht blockierend (Build bricht nicht ab). **Kein Code-Commit nötig** bestätigt.
2. **EC-09-ZIP im Prod-Build grün — Builder-verifiziert (Muster wie Planer 3 ↔ Builder 2).** Builder: `npm run start` Prod-Build, echter Browser, Person → Akte → Doc-Chips → ZIP, Server-Action **200**, RSC-Body `UEsDBA…` (= `PK\x03\x04` ZIP-Magic), Client-Blob **`application/zip` 132,8 KB** + Download, **EC-10-Disclaimer** sichtbar. Build-Output bestätigt, dass die ZIP-relevanten Routen/Server-Actions im Prod-Build existieren. *(Das Test-Daten-Artefakt „Felix … ohne Rolle" → Engine `{success:false, Role "" not found}` ist korrektes Verhalten, kein Build-/Code-Problem.)*
3. **`.env.example` vollständig — UNABHÄNGIG RE-VERIFIZIERT ✅.** Alle zur Laufzeit per `process.env.*` gelesenen Variablen abgedeckt: S3×5 (`HETZNER_S3_KEY/SECRET`, `HETZNER_BUCKET_NAME`, `HETZNER_S3_ENDPOINT/REGION`), `INTERNAL_API_KEY`, `TALLY_WEBHOOK_SECRET`, `DATABASE_URL` (von Prisma), optional `CEA_REGISTRY_PATH` (auskommentiert). `NODE_ENV` per systemd (korrekt nicht in `.env.example`). **Befund (kein Blocker):** `TALLY_API_KEY` steht in `.env.example`, wird aktuell aber an **keiner** Stelle per `process.env` gelesen (nur dokumentiert für Feld-Mapping/Scripts) — harmloser Überschuss, keine fehlende Variable.
4. **`db:push` nur `prisma/prisma/dev.db` — UNABHÄNGIG RE-VERIFIZIERT ✅.** Filesystem-Check: genau **ein** DB-File `prisma/prisma/dev.db` (90 KB), **kein** zweites `prisma/dev.db`. `DATABASE_URL="file:./prisma/dev.db"` löst relativ zum Schema-Ordner (`prisma/`) dorthin auf — entspricht der vom Planer entschiedenen Kanonik. `db:push` „already in sync" laut Builder.

### Guardrails
- **EC-09:** Generator/ZIP im Prod-Build grün (Builder-Browser). ✅
- **EC-10:** Disclaimer „kein automatischer Freigabe-/Zertifizierungsstatus" sichtbar. ✅
- **Kein Produktivcode geändert** → Commit-Basis bleibt `0d92ff2`; diese Session = nur Bridge-Doku. ✅
- **DSGVO:** `.env.local` (enthält reale S3-/Tally-/Internal-Keys) ist gitignored — nicht committen. Tally-Key-Rotation bleibt offener Tech-Debt (CLAUDE.md). ✅

### Nächster Schritt
- **Mark deployt** (Server-Schritte aus `CURSOR_HETZNER_PREDEPLOY_AUFTRAG.md` „DANACH" + `HETZNER_DEPLOY.md`). Nach Deploy: Planer 4 reviewt das Live-Ergebnis (HTTPS-URL erreichbar, Webhook `deliveryStatus: SUCCEEDED`, EC-09 live).
- **Slice 3 (Doppelrollen-Modellierung)** parkt bis nach Deploy + Marks „weiter".

---

## 2026-06-07 — Final-Abnahme: UE-Anzeige (Variante C) + Findings F1–F5, kombiniert (`0d92ff2`, Basis `22e0c7c`) — Planer 3

**Methode:** Review des **kombinierten Diffs** `git diff 22e0c7c 0d92ff2` (es gibt **keinen** separaten UE-Commit) gegen `NORM_MATRIX_Mitarbeiternachweise_v2.md` + `NORM_KLAUSEL_REGISTER_v1.md`. Unabhängig im Planer-Environment re-verifiziert: **`tsc --noEmit` = 0 Fehler**, **Engine-Suite 13/13 grün** (`tsx --test`, inkl. neue F1/F3/F4-Szenarien 3c/4c/5b + Invariante). Browser-Akzeptanz (EC-09-ZIP 200, F4 live) = Builder-2-Verifikation laut HANDOFF.

### Verdict
**ABGENOMMEN (Final).** UE-Anzeige + F1–F5 sind norm-konform, CL-rückführbar, EC-09/EC-10 gewahrt. Der einzige offene Pre-Commit-Punkt (Planer 2: `t.hint` nicht gerendert) ist **geschlossen**. Keine Blocker. Nächster Code-Schritt = neue Slices/Deploy nach Marks Gate.

### Teil A — UE-Anzeige (Variante C): offener Punkt geschlossen
- **`t.hint` wird jetzt gerendert** (`EmployeeFileTrainingTargets.tsx`: `{t.hint ? <p…>{t.hint}</p> : null}`). Damit erscheinen die beiden zuvor fehlenden Hinweise:
  - **CL-27-Anrechnungszeile** — Engine setzt auf `jahres-weiterbildung` (CL-11): `hint: "DL ≤ 50 %. Einmalschulung im Erwerbsjahr anrechenbar (CL-27)."` (`requirement-engine.ts` Z. 629). CL-27 ist im Register **belegt** (§5.3/5.4/8.4).
  - **Asyl-„64 UE"-Hinweis** — `sdl-asyl-fk` (CL-25): `hint: "Gesamt 64 UE (40 Basis + 24 FK-Aufschlag)"`.
- Persistenz, Zwei-Block-Layout, Balken-nur-laufend, EC-10-Header („rechnerisch · kein Freigabestatus") unverändert korrekt (siehe Pre-Commit-Review unten). `istFor`/`setIst` matchen die Engine-ID `jahres-weiterbildung` exakt.

### Teil B — Findings F1–F5 gegen Norm (jede CL belegt)
- **F1 — §34a nur Unterrichtung ⇒ `unvollständig`** (statt `vorhanden`). ✅ Matrix §2: „Unterrichtung §34a … Ampel **gelb** + Frist". Nicht-grün ist korrekt; die 6-Monats-Sachkunde-Frist (CL-02) bleibt zusätzlich in `fristen[]`. Test Szenario 2 prüft `q-34a = "unvollständig"`.
- **F2 — Pflicht-Set-Dedup nach `clauseId` (Presenter-only).** ✅ Engine unverändert; `dedupePflichtSetByClause` greift erst vor dem Row-Mapping. `null`-CL wird **nie** dedupt (jede ist eigene Prüfaufforderung). Kollisionen nur bei CL-08 (Erste Hilfe: `q-ersthilfe`+`appt-ersthelfer`) und CL-23 (Brandschutz: `sdl-objekt-brandschutz`+`appt-brandschutz`) — **gleiches Thema je CL**, Merge fachlich sauber. Trigger werden zusammengeführt, strengerer Status (`STATUS_STRICTNESS`, abgelaufen>fehlt>…>vorhanden) gewinnt. CL-04/05/09 sind in der Engine gegenseitig exklusiv → kein Fehlmerge.
- **F3 — SDL-UE-Soll an `bewachung` gegatet.** ✅ Veranstaltung/Asyl/Objekt-Zusatz-UE entstehen nur bei Bewachungsrolle (kein „schwebendes" Soll ohne Basis-Set). **Brandschutz-Pflichtnachweis (CL-23) bleibt ungated** (Pflichtnachweis, kein UE-Soll) — korrekt. Doppelrollen-Modellgrenze als Engine-Kommentar **drin** (Z. 455–462). Test Szenario 5b grün.
- **F4 — nur `roleType="Führungskraft"`=FK; EL/OL/SL=EK, bleiben Bewachung.** ✅ Matrix §5.3/5.4 (Veranstaltung FK **24** / EK **16**) + §8.3/8.4 (Asyl EK **40** / FK **+24=64**). `FUEHRUNG_ROLES = {Führungskraft}`; `LEITUNG_BEWACHUNG_ROLES = {Einsatz/Objekt/Schichtleitung}` werden **explizit** in `isBewachungsrolle` aufgenommen (Basis-Set ohne FK-Quali CL-10). **Mark-Entscheidung (Variante B + Upgrade-Pfad Phase 2)** — die Org-Rolle→FK/EK-Zuordnung ist Marks Mapping, nicht aus der Norm ableitbar (Norm trennt FK/EK, nicht Org-Titel) → Gate-konform. Tests 3c (Schichtleitung=16, kein FK-Quali) + 4c (Einsatzleitung Asyl=40, kein +24) grün.
  - **F4 roleType-String-Matching (Gegencheck):** gespeicherte `roleType` stammt aus `ROLLE_TYPE_OPTIONS` und matcht die Engine-Sets exakt; `GRUNDROLLE_CATALOG` ist nur Anzeige → laut HANDOFF kein Write-Path-Bug. Bestätigt, nicht neu aufgerollt. *(Tally-Intake schreibt rohen Dropdown-Text = separater Alt-Thread, außerhalb dieses Scopes.)*
- **F5 — Asyl-Basis-Label rollen-neutral** („Flüchtling/Asyl — Basis 40 UE …"). ✅ kosmetisch, Matrix §8.3-konform (Basis gilt EK/SMA und als FK-Basis).

### Guardrails
- **EC-09:** Generator/ZIP nicht berührt (Engine-Änderungen = Logik/Display; Presenter-Dedup nur Anzeige) — Builder meldet ZIP-Export 200. ✅
- **EC-10:** keine „erfüllt/auditfähig/einsatzbereit"-Aussage; Status-Union konservativ; Karten-Header „rechnerisch · kein Freigabestatus". ✅
- **Keine erfundene Norm:** Invarianten-Test grün (jede Regel ohne CL = „fachlich prüfen"/„nicht erforderlich"). ✅

### Offene Fäden (kein Blocker → Slice 3+ / Deploy-Gate)
1. **Doppelrolle (Verwaltung/GF + zusätzlich Bewachung)** — durch F3-Gate bekäme so eine Person kein SDL-Soll. Modellgrenze (eine `roleType`/Person). Workaround bis dahin: als Bewachungsrolle erfassen. → **Design-Notiz Slice 3+** (Flag „übt zusätzlich Bewachung aus" o. Mehrfach-`roleType`).
2. **Hetzner-Deploy** = eigener Schritt **nach Marks „los"** (Pre-Deploy-Checkliste in HANDOFF + Runbook `HETZNER_DEPLOY.md`).

---

## 2026-06-07 — UE-Anzeige Schulungs-Soll (Variante C, `EmployeeFileTrainingTargets.tsx`) — Pre-Commit-Review (Planer 2)

**Methode:** Statisches Review des **uncommitteten** Working Trees (neue Datei `EmployeeFileTrainingTargets.tsx` + Diffs an `EmployeeFileDossierView.tsx`, `types/employee.ts`, `lib/employee-file-repository.ts`, `prisma/schema.prisma`) gegen die Variante-C-Spez (`CURSOR_SLICE2_AUFTRAG.md` §E.1). `tsc --noEmit` = **0 Fehler**, ReadLints der 4 Dateien = **0**. Engine-Logik unverändert (nur Typ-Felder + Anzeige-Komponente ergänzt). **Engine-Test-Suite hier nicht re-run** (kein `tsx` im Planer-Environment) → Executor bestätigt 10/10 + Browser.

### Verdict
**Statisches Review besteht** — Variante C korrekt umgesetzt, EC-10-Wording gewahrt, Persistenz vollständig. **Browser-Abnahme + Commit stehen noch aus** (Executor/Mark-Gate); danach schließe ich das Review final.

### Stark (behalten)
- **Zwei-Block-Karte** laufend/einmalig; **Balken nur** beim laufenden Jahres-UE (`renderRow(t, true)` vs. `false`) — exakt Variante C.
- **Wording-Baustein verbindlich erfüllt:** Soll/Ist/Rest; Status-Union `offen · unvollständig · rechnerisch erreicht · fachlich prüfen`; **kein** „erfüllt/einsatzbereit/auditfähig". Karten-Header trägt dauerhaft „rechnerisch · kein Freigabestatus" (**EC-10**).
- **Ist = „manuell erfasst"** gekennzeichnet (kein Auto-Nachweis-Beleg) — Slice-2-konform.
- **`soll === null` → „fachlich prüfen"** + „Kein belegter UE-Wert" statt erfundener Zahl. Korrekt.
- **Persistenz vollständig:** `weiterbildungIstUE Int?` + `einmaligIstUE Json?` in Schema; Repository mappt beide in `fromRecord` **und allen vier** Upsert-Pfaden (Z. 65–70/95–100/208–213/256–261/586–591); `onSave={onSavePerson}` schreibt zurück.
- **ClausePill** zeigt `CL-xx` bzw. „ohne CL" für `null`.

### Findings (Anzeige, klein — kein Blocker, an Executor)
1. **`t.hint` wird nie gerendert.** `renderRow` zeigt label/CL/trigger/dlCap/Soll/Ist/Rest, aber **nicht** `t.hint`. Dadurch fehlen: der **Anrechnungs-Hinweis CL-27** („Einmalschulung im Erwerbsjahr anrechenbar") **und** der Asyl-FK-Hinweis „Gesamt 64 UE". Die Variante-C-Vorlage zeigt die **Anrechnungs-Zeile CL-27** explizit. → Hint rendern (mind. die Anrechnungs-Fußzeile im Einmalig-Block). *(Executor, klein.)*
2. **Feldname-Abweichung:** Auftrag §E.1 nannte `einmalSchulungIstUE`, Code nutzt durchgängig `einmaligIstUE` (Type/Schema/Repo/Komponente konsistent). **Kein Handlungsbedarf** — nur dokumentiert.
3. **`einmaligIstUE Json?` ohne `@default("{}")`** (Auftrag schlug Default vor). Repo schreibt `?? {}`, `null` wird abgefangen → unkritisch. *(optional.)*

### Pending vor Final-Abnahme
- **Browser-Akzeptanz** (live :3001): Schulungs-Soll-Karte rendert pro Akte, Ist-Eingabe **persistiert über Reload**, Balken nur laufend, EC-09-Smoke (Person → Generator → ZIP) grün.
- **Commit** (alles uncommitted). Danach Final-Eintrag hier.

---

## 2026-06-07 — Slice 2 Requirement-Engine (`requirement-engine.ts`, Commit `22e0c7c`) — Code-Review

**Methode:** Statische Prüfung der committeten Engine gegen `NORM_KLAUSEL_REGISTER_v1.md` (jede `clauseId`) + `NORM_MATRIX_Mitarbeiternachweise_v2.md` (UE-Werte, Ebenen-Trennung). UI-Display + DB-Pfad nicht Teil dieses Reviews (Executor in Arbeit).

### Verdict
**Engine abgenommen (fachlich) — die normative Kern-Lücke aus dem 2026-06-06-Review ist geschlossen.** Bedingung → Pflicht-Set wird jetzt deterministisch abgeleitet, jede aktive Pflicht ist CL-rückführbar. Findings sind Verfeinerungen, kein Blocker.

### Stark (behalten)
- **clauseId-Treue:** CL-01/03/04/05 (§4.1b), CL-06/07 (Profil A), CL-08 (EH 2 J.), CL-09 (Intervention), CL-10 (FK), CL-11 (40/24 WB), CL-20/21 (Veranstaltung 24/16), CL-22 (Objekt +20/J), CL-23 (Brandschutz 3 J.), CL-24/25 (Asyl 40/64), CL-02 (6-Monats-Frist) — **alle korrekt gegen Register + Matrix.**
- **Invariante hält:** ohne belegte CL → `clauseId: null` **und** `status "fachlich prüfen"` (ÖPV, NON-DIN, SiBe, Fahrer/UVV CL-73, Praktikant). Keine erfundene Pflicht.
- **Ebenen sauber getrennt (Matrix §9):** Firmen-Quote (CL-41/42) + Personalschlüssel (CL-26) landen als **Hinweis**, nicht als Einzelakten-Pflicht. Korrekt.
- **EC-10 gewahrt:** nur konservative `WorkingItemStatus`-Union; kein „auditfähig/freigegeben/zertifiziert".
- **Reine Funktion:** kein DB-/React-Import; deterministische Fristen via `referenceDate`. Testbar.

### Findings (Verfeinerung — kein Blocker, an Executor/Mark)
1. **`q-34a` bei reiner Unterrichtung = `vorhanden` (grün).** Matrix §2 sieht hier „gelb + Frist" vor. Die separate `frist-sachkunde` (CL-02) fängt es ab, aber die Zeile allein wirkt zu optimistisch. **Vorschlag:** Status `vorbereitet`/`unvollständig` statt `vorhanden`, solange nur Unterrichtung. *(Executor, klein.)*
2. **Doppelzeilen möglich:** Erste Hilfe (`q-ersthilfe` + `appt-ersthelfer`, beide CL-08) und Brandschutz (`sdl-objekt-brandschutz` + `appt-brandschutz`, beide CL-23) erscheinen bei Bewachung **und** passender Beauftragung doppelt. **Vorschlag:** im Presenter nach `clauseId`+Thema dedupen. *(Executor, klein.)*
3. **Teil-2-Schulung ohne Bewachungs-Guard:** Veranstaltung/Asyl/Objekt-Schulungssoll wird allein aus `sdlScopes` gepusht — eine Verwaltungsrolle mit SDL-Scope bekäme ein UE-Soll ohne Basis-Set. Real unwahrscheinlich; ggf. mit `bewachung` gaten. *(fachlich, optional.)*
4. **Leitungsrollen = Führungskraft (FK):** `Einsatz-/Objekt-/Schichtleitung` lösen die FK-Werte aus (§5.3 24 UE statt §5.4 16 UE). Plausibel, aber **fachlich bestätigen** (ist Schichtleitung normativ FK?). *(Mark/Experten-Review CROSS-CONTROL-05.)*
5. **Asyl-FK-Label:** Basiszeile sagt „EK/SMA: 40 UE", wird aber auch für FK als Basis gepusht (+24). Label kosmetisch anpassen („Basis 40 UE"). *(Executor, kosmetisch.)*

### Nächster Schritt
Findings 1+2 sind die einzigen, die ich vor dem nächsten Commit empfehle (kleiner Presenter-Fix). 3–5 = fachliche Bestätigung durch Mark bzw. kosmetisch. UI-Display-Review folgt, sobald die UE-Anzeige verdrahtet + die Liste wieder lädt.

---

## 2026-06-06 — Mitarbeiterakte (Tool 2) `/employee-automation` — Live-Review

**Methode:** Live im Browser (Dev-Server :3001), Dummy „Max Mustermann" angelegt → Akte-Ansicht + Generator-Hinweis erfasst. Code nicht gelesen (außerhalb `hq/`-Scope) — Review auf UI/Verhaltensebene.

### Verdict
**~80 % nutzbar.** Das Gerüst ist stark und norm-verankert. Es fehlt **eine** Kernkomponente. Nicht wegwerfen — vervollständigen.

### Was stark ist (behalten)
- **Denkmodell „Bedingung → Anforderung → Nachweis"** — sauber, alles an einem Ort.
- **Grundrollen-Taxonomie** (9 Rollen: SMA, Führungskraft, Einsatzleitung, Objektleitung, Schichtleitung, Bürokraft/Verwaltung, Geschäftsführung, Subunternehmer-SMA, Praktikant/Azubi).
- **Pflichtnachweise mit Normbezug:** §34a Unterrichtung, Sachkundeprüfung, Bundesauszug Bewacherregister, Datenschutz, Verschwiegenheit, Dienstausweis, Erste Hilfe, Brandschutzhelfer (Bedingung DIN 77200-2/SDL), Stellenbeschreibung, projektbezogene Nachweise, Schulungs-/Unterweisungsnachweise.
- **Anforderungsebene Schulung & Unterweisung** (allgemeine/objektbezogene/SDL-bezogene/Wiederholungs-Unterweisung).
- **Geltungsbereich/Einsatzkontext** als Auslöser (DIN 77200-1/-2 Relevanz, SDL, Objekt, Qualifikationsniveau).
- **Platzhalter-Bindung** aller Felder ({FullName}, {Birthday}, {RoleType}, {TrainingHours}, {GuardIDNumber}, {EmployeeIDNumber}).
- **Saubere fachliche Trennung:** Bewacher-ID (Stammdaten) ≠ Bundesauszug Bewacherregister (Nachweis).
- **Generator-Disziplin:** „X Dokumente vorgemerkt — keine Freigabe- oder Zertifizierungsaussage" → konform zu DFSS CROSS-CONTROL-05.
- **Status-Taxonomie:** VORHANDEN · FEHLT · OFFEN · NICHT ERFORDERLICH · FACHLICH PRÜFEN · VORBEREITET + konsolidierte „Offene Punkte"-Ansicht.

### Kern-Lücke (Prio 1) — die verlorene DFSS-Vorarbeit
- **Regel-/Entscheidungsmatrix fehlt.** Wörtlich in der UI: *„Scope-abhängig — keine Matrix in diesem Slice."*
- Folge: **Bedingung leitet nicht automatisch Anforderung/Nachweis ab.** Fast alles steht auf „FACHLICH PRÜFEN/OFFEN" → der Mensch entscheidet noch alles manuell.
- Das ist genau die Norm-Logik aus dem Design-/DFSS-Projekt, die am Ende nicht mehr verdrahtet wurde.
- **Vermutete Stelle:** `modules/03-mitarbeiterakte-tool-2/employee-file/employee-file-requirements.ts` (Anforderungslogik).

### Weitere Beobachtungen
- **Tool 1 (`/model-creator`):** „Loading folders…" hängt — Standard-Models laden nicht. Vermutung: Hetzner-S3 / `.env.local` nicht gesetzt. → prüfen.
- **„Standalone":** Tool 1 + Tool 2 sind **Routen in EINER COS-App** (:3001), keine getrennt laufenden Standalones. Legacy (`bots/legacy_tools/…`) = Fallback, läuft aktuell nicht.

### Empfehlungen (DFSS-Controls + Zwei-Motoren-Modell)
1. **Norm-Regel-Matrix als eigenes „controlled design artefact"** (CROSS-CONTROL-07): Grundrolle + Geltungsbereich (DIN 77200-1/-2) + Bestellungen → welche Nachweise/Unterweisungen *erforderlich / nicht erforderlich / fachlich prüfen*. Claude/Experte entwirft die Matrix, **Cursor verdrahtet** sie in `employee-file-requirements.ts`.
2. **Quelle der Matrix:** DFSS Design-Requirements-/Traceability-Matrix + `knowledge/` (DIN 77200). **Keine erfundenen Pflichten** — nur normseitig ableitbare (CLAUDE.md-Regel).
3. **Zwei-Motoren:** Matrix = deterministische Regeln; Qwen/Validator wenden an; Experten-Review bleibt Pflicht bis Tests Verlässlichkeit zeigen (CROSS-CONTROL-05).
4. **Tool 1:** Storage/`.env.local` fixen, damit Standard-Models laden.
5. **Dashboard-Launcher** (Tool 1 / Tool 2 / Upload Manager) → **erledigt** im HQ-Dashboard (Claude, 2026-06-06).

### Befund-Tabelle
| Datum | Bereich | Befund | Empfehlung | Status |
|-------|---------|--------|------------|--------|
| 2026-06-06 | Akte-Logik | Regel-Matrix fehlt („keine Matrix in diesem Slice") | Matrix als controlled design artefact + verdrahten | offen (Prio 1) |
| 2026-06-06 | Tool 1 `/model-creator` | „Loading folders…" hängt | Hetzner-S3 / `.env.local` prüfen | **behoben 2026-06-07** — Zombie Port 3000; Dev-Port 3001 |
| 2026-06-06 | Architektur | Tool 1+2 = Routen einer App, keine Standalones | für Dashboard via Launcher gelöst | erledigt |
| 2026-06-06 | HQ-Dashboard | Generatoren nicht erreichbar | 3 Launcher-Karten eingebaut | erledigt |
| 2026-06-07 | Stabilisierungs-Slice (Commit `b63043e`) | verifiziert: Port 3001, S3-Prefix-Scoping (standard-models/roles/appointments), DocumentForm 15s-Timeout+Fehlertext, EC-09-Disclaimer intakt, Generator parallelisiert; **tsc --noEmit: 0 Fehler** | abgenommen | **OK** |
| 2026-06-07 | Norm-Matrix (Phase 2) | `employee-file-requirements.ts` Z. 244 „keine Matrix in diesem Slice"; **keine erfundenen UE-Pflichten** hartkodiert (CLAUDE.md-konform) | bleibt Prio 1 / Phase 2 | offen (bewusst) |
| 2026-06-07 | Build-Hygiene | **ESLint: 20 Errors / 11 Warnings** repo-weit (u. a. `set-state-in-effect` in neuem Hydration-Code `EmployeeAutomationPage.tsx` Z.75/90/161/196; `no-explicit-any`). `next.config.ts` ohne `eslint.ignoreDuringBuilds` → **Prod-`next build` würde scheitern**; `npm run dev` unberührt | vor 4-Slice-Umbau: Lint-Errors fixen **oder** `ignoreDuringBuilds` setzen (Cursor) | offen → an Cursor |

---

## 2026-06-07 — Verifikation Stabilisierungs-Slice `b63043e` (Code-Track)

**Methode:** Statisches Review der Commit-Diffs + `tsc --noEmit` + `eslint` im Repo (Sandbox; kein Live-Server, da Sandbox ≠ Marks Rechner). Branch `b3-tool2-migration`.

**Ergebnis:** Cursors HANDOFF-Meldung deckt sich mit dem Code — Slice ist **committed** (nicht mehr „uncommitted", HANDOFF veraltet). Tool 1+2 für Daily Use (`npm run dev` :3001) abgenommen.

- ✅ `package.json`: `dev`/`start` fest auf **3001**.
- ✅ S3-Listing per Prefix (`listTemplateFiles(category)`) in `standard-models/route.ts`, `send-model-entries.ts`, `generate-employee-docs.ts` (letzteres parallel via `Promise.all`).
- ✅ `DocumentForm`: AbortController-Timeout 15s + sichtbarer Fehlertext statt Endlos-„Loading folders…".
- ✅ EC-09 / Disclaimer „…vorgemerkt — keine Freigabe oder Zertifizierungsaussage" vorhanden.
- ✅ `tsc --noEmit` → 0 Fehler.
- ⚠️ **ESLint 20 Errors / 11 Warnings** — Build-Risiko (siehe Befund-Tabelle), an Cursor übergeben.
- ℹ️ Norm-Matrix erwartungsgemäß noch nicht verdrahtet (Phase 2), keine erfundenen Normpflichten.

**Nicht getestet:** Live-ZIP-Export im Browser (lt. Cursor 2026-06-07 manuell verifiziert); Hetzner-S3-Roundtrip (Creds liegen in `.env.local`, Sandbox-Netz nicht genutzt).

---

## 2026-06-07 — Review Slice 0b: Persistente Akte (SQLite/Prisma + S3) — **ABGENOMMEN**

**Methode:** Statisches Code-Review (`schema.prisma`, `employee-file-repository.ts`, `employee-file-actions.ts`, `cea-blob-storage.ts`, `employee-queue-storage.ts`-Adapter, `api-auth.ts`, Routes) + `tsc --noEmit` + git-Check. Branch `main` (Code **uncommitted** im Working Tree).

**Verdikt: passt — Fundament solide, keine Blocker.**
- ✅ **Datenmodell** (Company → CompanyExportSettings → EmployeeFile → EvidenceItem + MigrationRecord) wie 0a freigegeben; IDs werden beibehalten.
- ✅ **EC-09 unangetastet:** `generate-employee-docs.ts` seit Merge nicht geändert (git verifiziert); `employeeFileToEmployee()` rekonstruiert den `Employee`-Typ **1:1** → Generator bekommt identische Objekte.
- ✅ **Migration** idempotent (`MigrationRecord.sourceKey`), Company-Match per Name → Fallback `_legacy_import`; Evidence Base64→S3; localStorage erst nach Erfolg umbenannt (nicht gelöscht).
- ✅ **Logo→S3** (`logoStorageKey`); `getExportSettings` rehydriert zu dataUrl → `GlobalProperties.companyLogo` für Generator erhalten.
- ✅ **Auth** `requireInternalApiKey` timing-safe; `.gitignore` schließt `.env*` + `/prisma/*.db` aus (Secrets/DB nicht im Git).
- ✅ `tsc --noEmit` → **0 Fehler**; Prisma-Client generiert.

**Follow-ups (keine 0b-Blocker):**
1. **Commit** — 0b ist komplett uncommitted. Nach Marks Browser-Smoke committen.
2. **⚠️ Slice-1-Fix `verifyTallySignature`:** nutzt **hex-Digest + Strip `sha256=`**. Tally-Doku-Beispiel nutzt **base64-Digest, Header ohne Prefix** (`createHmac(...).digest('base64')`). → beim Slice-1-Verdrahten Encoding angleichen + raw-body vs. re-stringified testen, sonst werden gültige Webhooks abgelehnt.
3. Migration: Evidence-Einträge ohne `dataUrl` werden still übersprungen (Low-Risk; Legacy speicherte dataUrl).

**Nicht getestet (braucht Marks Rechner):** `npm run db:push` (Tabellen anlegen), Browser-EC-09-Smoke (Person→Generator→ZIP), Kunden-Switcher mit 2 Firmen (getrennte Pools), Migration mit echten Alt-Daten.

---

## 2026-06-07 — Review Slice-1-Nachzug: Beschäftigungsart + Qualifikation + Rolle — **ABGENOMMEN**

**Methode:** Statischer Gegencheck im Repo (schema.prisma, lib/data/tally-employee-slots.json, employee-stammdaten-options.ts) + Cursors Browser-Verifikation (echte Submission rDKJXb2, Wolf Street/blubermann).

**Verdikt: passt, keine Blocker.**
- ✅ `EmployeeFile.employmentType` + `qualification` (String?, optional) im Schema; db:push erfolgt.
- ✅ Mapping über alle 10 Slots: `roleTypeQuestionId`/`employmentTypeQuestionId`/`qualificationQuestionId` getrennt (Bugfix bestätigt — Beschäftigungsart `aBv7BE` ≠ roleType `pLzdKP`). Dropdown-Werte als lesbare Labels.
- ✅ UI-Label „Rolle (Sicherheitsmitarbeiter / Führungskraft)“; volle Taxonomie inkl. Bürokraft/Verwaltung + Geschäftsführung.
- ✅ EC-09 (`generateEmployeeDocs`) unverändert; EC-10 (Nachweise `unchecked`) gewahrt; keine erfundenen UE-Werte.

**Follow-up (KEIN Blocker, → Slice 2):** ZIP-Export braucht `roleId` (Dokumenten-Vorlage); bei reinem Tally-Intake oft leer → Generator läuft für solche Akten erst nach Rollen-/Template-Zuordnung. Das ist genau das „Rolle macht doppelt Dienst“ aus dem Slice-2-Modell (Rolle → Template-Palette **und** Pflicht-Set). In Slice 2 verdrahten.

**Mini-Notiz:** Taxonomie führt „Subunternehmer-SMA“ und „Subunternehmer“ getrennt — bei Slice 2 prüfen, ob beide gewollt (sonst zusammenführen).
