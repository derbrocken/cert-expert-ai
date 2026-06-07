# HANDOFF — Briefkasten Claude ⇄ Cursor

**Regel:** Kurze, datierte Einträge. Erledigtes nach unten ins Archiv. Keine Romane.
**📁 Historie:** Ältere Abschluss-Einträge + frühe Reviews/Freigaben (Slice 0/0a/0b, Slice 1 + Nachzug, Tally-Intake/Webhook, Stabilisierung, Overviews, Slice-2-Bau) → **`HANDOFF_ARCHIV.md`** (Schnitt 2026-06-07, nichts gelöscht).

**Rollen-Kontrakt (verbindlich, `CLAUDE.md`):** Planung/Review/Norm-Mapping = **Planer (Spur P)**. Der **Executor** baut nur den Bauauftrag, committet, hängt **EINEN** kurzen Ergebnis-Eintrag an + kippt den HIER-STARTEN-Status — **schreibt keine Specs um, plant nichts neu**. Neue Idee/Scope-Frage → als Frage an den Planer.

**Übergabe-Takt (Agent):** Nach Task/Slice/Commit → Mark erinnern: „✅ stabiler Punkt — Committen/Übergeben (neuer Chat)." Bei ~70–80 % Context → „Übergabe empfohlen." Ablauf: stabil → commit → **Abschluss-Eintrag** (fertig/offen/nächster Schritt/Hashes) → neuer Agent liest `CLAUDE.md` + HANDOFF. Gedächtnis = Repo, nicht Chat.

> ## ▶ HIER STARTEN — AKTUELLER STAND (2026-06-07)
> **Branch = `main`** · COS: `cert-expert-certification-os/apps/certification-os/` · Port **3001**
> **Phase = Slice 2 (Requirement-Engine) gebaut + committet (`22e0c7c`) + Engine fachlich abgenommen (`96e9341`) ✅**
> **Arbeitsmodell:** Planer/Claude führt (plant + reviewt) · Executor/Cursor baut · Ping-Pong über Bridge-Dateien (Mark, 2026-06-07). Planer rotiert seltener als Executor.
> **▶ NÄCHSTER PLANER-CHAT: „Planer 3"** (Nachfolger). Folge-Planer fortlaufend nummerieren. *(Planer 2 (17:24) hat diese Session gemacht — Abschluss-Eintrag unten.)*
> **Letzte Commits:** `a09461f` (Rollen-Kontrakt) · `92bb8d6` (Planer-3-Prompt) · `47dcea1` (Planer-2-Review) · `22e0c7c` (Slice 2)
> **⏳ Executor-Working-Tree (uncommitted):** UE-Anzeige (Variante C, `EmployeeFileTrainingTargets.tsx`) + DB-Pfad-Fix + Ist-UE-Felder (`weiterbildungIstUE`/`einmaligIstUE` in type/schema/repo). **Planer 2 hat den Tree statisch reviewt: `tsc` 0, Lints 0, Variante C korrekt** (`CODE_REVIEW.md`). **Executor offen:** Browser-Akzeptanz + Commit + 1 Anzeige-Finding (`t.hint` rendern → CL-27-Anrechnungszeile).
> **▶ Offen (Stand Planer 2):** (1) **UE-Anzeige Final-Abnahme** nach Executor-Commit + Browser. (2) **Findings 1+2 (+3/4/5)** → Auftrag liegt: `CURSOR_FINDINGS_1_2_AUFTRAG.md` (F1 q-34a `unvollständig`; F2 CL-08/CL-23-Doppelzeilen dedupen; F3 SDL-Soll gaten; F4 Leitungsrollen=EK/nur „Führungskraft"=FK; F5 Asyl-Label). **F3+F4 von Mark entschieden** (siehe „Offene Entscheidungen für Mark"). (3) **CL-74** (Beauftragung≠Schulung, Ausbilder-Befähigung) → Anbieter-Validierung = Slice 3/4. (4) Bulk-Gruppen-Scope (freigegeben, offen). (5) **Hetzner-Deploy** = eigener Schritt NACH Slice 2 (eigener „Von Claude an Cursor"-Eintrag + `HETZNER_DEPLOY.md`).
> **Form:** https://tally.so/r/vGNvY0 · **Aufgaben:** `10_Bridge/AUFGABEN.md`

### ▶ Copy-Paste-Prompt für Planer 3
> Du bist **Planer 3** — Nachfolger von Planer 2 (Code-Track, Spur P: Planer/Reviewer, **kein Produktivcode**). Lies zuerst `CLAUDE.md` (Rules) + `hq/10_Bridge/HANDOFF.md` (Box „▶ HIER STARTEN" + Abschluss-Eintrag „Planer 2"). Koordination nur über Bridge-Dateien.
>
> **Stand (committet + gepusht, `47dcea1`):** Slice-2-Engine abgenommen (`22e0c7c`). UE-Anzeige (Variante C) von Planer 2 **statisch** abgenommen (`CODE_REVIEW.md`): `tsc` 0, Lints 0 — Code liegt **uncommitted** im Working Tree beim Executor. Findings 1–5 alle entschieden + in `hq/10_Bridge/CURSOR_FINDINGS_1_2_AUFTRAG.md` (F1 q-34a `unvollständig`, F2 CL-08/CL-23 Doppelzeilen-Dedup, F3 SDL-Soll gaten, F4 Leitungsrollen=EK/nur „Führungskraft"=FK, F5 Asyl-Label).
>
> **Aufgaben (in Reihenfolge):**
> 1. **Prüfen, was der Executor gemacht hat** (`git log`, Working Tree): UE-Anzeige committet? Findings 1–5 gebaut?
> 2. **Final-Abnahme UE-Anzeige** nach Executor-Commit + dessen Browser-Verifikation → `CODE_REVIEW.md` (offen war: `t.hint` rendern → CL-27-Anrechnungszeile + Asyl-„64 UE"-Hinweis).
> 3. **Review Findings 1–5** gegen `knowledge/NORM_MATRIX_Mitarbeiternachweise_v2.md` + `NORM_KLAUSEL_REGISTER_v1.md`: jede `clauseId` belegt; F4 korrekt (SL=16 UE, kein Auto-FK-Quali; EL/OL/SL bleiben Bewachung); **F4 roleType-String-Matching** Katalog (`"SMA / Sicherheitsmitarbeiter"`) vs. Engine (`"Sicherheitsmitarbeiter"`) — möglicher realer Bug, explizit verifizieren; F3 gaten + Doppelrollen-Kommentar drin.
> 4. **Offene Fäden:** Doppelrollen-Design-Lücke (Verwaltung+Bewachung) → Slice 3+. **Hetzner-Deploy** als eigener Schritt (Pre-Deploy-Checkliste in HANDOFF + `HETZNER_DEPLOY.md`) — erst nach Marks „los".
>
> **Guardrails:** EC-09 (Generator/ZIP nie brechen), EC-10 (kein Freigabe-/Auditfähigkeitsstatus), jede Norm-Regel mit CL-ID. Verifikation im echten Browser, nicht per Skript. Mark = Gate. Nach stabilem Punkt: Übergabe-Takt + Abschluss-Eintrag.

---

## 🔚 ABSCHLUSS-EINTRAG — Planer 2 (17:24): UE-Anzeige-Review + Findings verteilt, 2026-06-07

**Rolle:** Planer/Reviewer (kein Produktivcode). Offene Fäden des Vorgängers abgearbeitet.

**Fertig (alles in Bridge-Dateien, kein Code geändert):**
- **UE-Anzeige (Variante C) statisch reviewt** → `CODE_REVIEW.md` (neuer Eintrag oben). Working Tree: `EmployeeFileTrainingTargets.tsx` + Verdrahtung + Persistenz (`weiterbildungIstUE`/`einmaligIstUE`) vollständig & konsistent (Schema/Repo/Komponente). Verifiziert: **`tsc --noEmit` = 0**, **ReadLints 4 Dateien = 0**, Variante C + EC-10-Wording korrekt. Verdict: **Pre-Commit-Review besteht**; Browser-Abnahme + Commit = Executor-Gate.
- **Findings 1–5 an Executor** → `CURSOR_FINDINGS_1_2_AUFTRAG.md` (F1 `q-34a` `unvollständig`; F2 CL-08/CL-23 Doppelzeilen im Presenter dedupen; F3 SDL-Soll gaten; F4 Leitungsrollen=EK; F5 Asyl-Label kosmetisch). Mit DoD + EC-09/tsc/Test-Anforderung.
- **Findings 3+4 mit Mark entschieden** → „Offene Entscheidungen für Mark" (F4 Variante B + Upgrade-Pfad; F3 gaten bestätigt) + Design-Lücke Doppelrolle.
- **Hetzner-Deploy als eigener Schritt gerahmt** → „Von Claude an Cursor"-Eintrag: Pre-Deploy-Checkliste (DB-Doppelpfad vereinheitlichen, `next build`-Gate, Env-Vollständigkeit) + Mark-Aktionen (DNS/Subdomain/Env/Webhook-PATCH). Runbook steht in `HETZNER_DEPLOY.md`.
- **Rollen-Kontrakt in `CLAUDE.md`** verankert (`a09461f`): Executor plant nicht, führt aus.
- **HANDOFF aufgeräumt:** Historie → `HANDOFF_ARCHIV.md` (nichts gelöscht), aktiver Briefkasten schlank.

**Anmerkung Verifikation:** Engine-Test-Suite (`tsx --test`) im Planer-Environment **nicht** re-run-bar (`tsx` nicht installiert). Engine-Logik durch die UE-Arbeit unverändert → Executor bestätigt 10/10 beim Findings-Commit (F1/F3/F4 ändern die Suite ohnehin).

**Offen / nächster Schritt:**
1. **Executor:** Browser-Akzeptanz UE-Anzeige + Commit; danach `CURSOR_FINDINGS_1_2_AUFTRAG.md` bauen (F1–F5).
2. **Mark:** ggf. „los" für Hetzner-Deploy.
3. **Planer 3:** Final-Abnahme UE-Anzeige + Findings-Commit reviewen.

**Commit-Basis:** unverändert `22e0c7c` (Slice 2) — diese Session = nur Bridge-Doku + `CLAUDE.md`. Code-Working-Tree weiter beim Executor (uncommitted).

✅ **Stabiler Punkt** — Bridge-Stand sauber; guter Zeitpunkt für Executor-Commit / Übergabe.

---

## 🔚 ABSCHLUSS-EINTRAG — Slice 2 Requirement-Engine gebaut + committet, 2026-06-07

**Fertig (Commit `22e0c7c`):**
- **Requirement-Engine** (`requirement-engine.ts`, UI-unabhängig, reine TS-Logik): `deriveRequirements(ctx)` → Pflicht-Set + Schulungs-Soll + Fristen aus Rolle × Beauftragung × SDL × Geltungsbereich × Beschäftigungsart × „fährt Dienstfahrzeug". Jede Regel mit `clauseId` (CL-01..CL-27); ohne belegte CL → „fachlich prüfen". Tests **10/10** grün.
- **Presenter** `employee-file-requirements.ts` auf `roleType` umgestellt (Legacy `isSecurityRole` raus).
- **Neue Felder** (Employee + Prisma + Repository): `sdlScopes`, `drivesServiceVehicle`, `ersteHilfeGueltigBis`, `brandschutzGueltigBis` (`db push` gelaufen).
- **UI** Erfassung (SDL-Mehrfachauswahl, Dienstfahrzeug, Fristdaten) + Anzeige (Pflicht-Set mit CL-Badge, Fristen, Schulungs-Soll-Vorschau **ohne** UE-Zahlen).
- Bauauftrag `CURSOR_SLICE2_AUFTRAG.md` (vollständig freigegeben, Variante C für UE-Anzeige).
- Guardrails: **EC-09-Smoke grün**, `tsc` 0 Fehler, **EC-10** gewahrt (rechnerisch, kein Freigabe-/Auditfähigkeitsstatus).

**Commit-Basis:** `22e0c7c` · `feat(tool2): Slice 2 Requirement-Engine (Pflicht-Set + Schulungs-Soll, CL-traceable)`

---

## 📥 Von Cursor an Claude (Fragen / Bitten)

### 2026-06-07 — ▶ Builder 1: UE-Anzeige (Punkt 3) gebaut + P2023-DB-Crash gefixt — UNCOMMITTED, Verify offen

**Was Builder 1 gemacht hat (auf Freigabe Variante C + §E.1):**

**A) UE-Anzeige verdrahtet (Punkt 3 / Layout Variante C):**
- **Neu:** `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeFileTrainingTargets.tsx` — zwei Blöcke **LAUFEND** (jährlich, mit Ist/Soll-Fortschrittsbalken) / **EINMALIG** (ohne Balken). Pro Posten: **Soll** (aus Engine, CL-belegt) / **Ist** (manuell erfasst, Zahl-Input, Label „UE · manuell erfasst") / **Rest** + Status-Pill (`offen` · `unvollständig` · `rechnerisch erreicht` · `fachlich prüfen`). Karten-Header dauerhaft **„rechnerisch · kein Freigabestatus"** (EC-10). **Keine** „erfüllt/auditfähig/einsatzbereit"-Aussage.
- **Neue Felder** für Ist-Erfassung: `Employee.weiterbildungIstUE?: number` + `Employee.einmaligIstUE?: Record<string,number>` (Posten-ID→UE). Prisma `EmployeeFile.weiterbildungIstUE Int?` + `einmaligIstUE Json?` (NICHT `@default("{}")` — SQLite lehnt `{` ab; Repository liefert `{}`). Repository-Mapping in allen Upsert-Pfaden ergänzt (`asNumberRecord`-Helper). `db push` + `prisma generate` gelaufen.
- **Geändert:** `EmployeeFileDossierView.tsx` — „Schulungs-Soll (Vorschau)" ersetzt durch `<EmployeeFileTrainingTargets … onSave={onSavePerson} />`.
- Ist = **rein manuell** (kein Auto-Summe aus Nachweisen — bewusst Slice 3/4).

**B) 🐛 Crash gefixt — Akten-Liste lud nicht (Prisma P2023):**
- **Symptom:** `prisma.employeeFile.findMany()` warf **P2023 „Inconsistent column data"**; Liste/Akte crashte (500 auf POST /employee-automation).
- **Ursache:** Beim Tabellen-Rebuild durch `db push` (RedefineTables, generiert `DEFAULT []`/`{}` **ohne Quotes**) bekamen bestehende Zeilen in der non-null Json-Spalte **`sdlScopes` einen leeren String `''`** statt gültigem JSON → Prisma kann ihn nicht deserialisieren. (KEIN „no such column" — alle Spalten existierten; KEIN DB-Doppelpfad-Problem: es gibt nur **eine** DB `prisma/prisma/dev.db`, `file:./prisma/dev.db` löst relativ zum Schema-Ordner dorthin auf.)
- **Fix:** `sqlite3 prisma/prisma/dev.db` — alle Json-Spalten normalisiert: `UPDATE … SET sdlScopes='[]' WHERE … json_valid(sdlScopes)=0` (analog appointmentIds/selectedRoleDocIds/selectedAppointmentDocIds/einmaligIstUE). Danach `findMany` grün.
- **Lehre für Build:** Neue non-null Json-Spalte → Prisma-`@default` ist in SQLite unzuverlässig; Repository schreibt ohnehin immer valide Werte (`?? []`/`?? {}`). Bei künftigem Schema-Rebuild bestehende Json-Zeilen prüfen/normalisieren.

**Verifiziert:** `tsc --noEmit` 0 Fehler (vor UE-Increment; nach Increment letzter Lauf vom User unterbrochen — **Planer 2 hat den Working Tree statisch geprüft: `tsc` 0, Lints 0**) · ESLint geänderte Dateien 0 Errors · **Browser TEIL A:** Liste lädt, **joe sichtbar, kein 500/P2023 mehr** ✅ · **Browser TEIL B:** Schulungs-Soll-Block rendert korrekt (EC-10-Header, CL-11, Soll 40 UE, Balken) ✅.

**OFFEN / Builder (vor Übergabe an Builder 2):**
1. **`tsc --noEmit` final selbst bestätigen** + **EC-09-Smoke** (Generator → ZIP) erneut grün.
2. **Ist-UE-Interaktivität manuell im Browser bestätigen:** Automations-Test konnte das Zahl-Input nicht zuverlässig triggern (React-controlled-input-Artefakt — programmatisches `input.value` feuert `onChange` nicht). Code-Pfad korrekt (Input → `onChange` → `setIst` → `onSavePerson`/`handleSavePerson` → `setEmployees` → `getEmployeeFileSummary` rechnet Rest=Soll−Ist neu). **Echter manueller Tipp-Test** ausstehend: 20 → „unvollständig"/Rest 20/Balken 50 %; 40 → „rechnerisch erreicht"/Rest 0.
3. **Persistenz** Ist-UE nach Reload prüfen (debounced `saveEmployeeQueue` 400ms + Server).
4. **Commit** (alles uncommitted) nach Marks OK → danach Übergabe an Builder 2 für `CURSOR_FINDINGS_1_2_AUFTRAG.md`.

**Uncommitted (Working Tree):** `M` `lib/employee-file-repository.ts`, `EmployeeFileDossierView.tsx`, `types/employee.ts`, `prisma/schema.prisma` · `??` `EmployeeFileTrainingTargets.tsx`. (`hq/01_Master_Dump/`, `hq/02_Operations_Board/`, `AUFGABEN.md` = Generalist/Planer, NICHT Code-Track committen.)

**Dev-Server:** läuft auf :3001 (Hintergrund, **außerhalb Sandbox** starten — sonst `uv_interface_addresses`-Fehler). Genau EINEN: `lsof -ti:3001 | xargs kill -9` vor Neustart. *(Planer 2 hat am 2026-06-07 doppelte Dev-Server/Zombie-tsx-Prozesse aufgeräumt — nur noch ein `next dev` auf 3001.)*

---

## 🔗 Aktuelle OS-Pfade (Single Source — Code-Track pflegt!)

**Regel:** Wer eine Route/einen Modulordner **umbenennt**, trägt es hier sofort ein. Generalist passt dann Dashboard-Launcher (`hq/00_Dashboard/html/index.html`) + Docs nach. So driftet nichts.

| Zweck | Route (Stand 2026-06-07) | geplant |
|-------|--------------------------|---------|
| Tool 1 — Document Creator | `localhost:3001/model-creator` | → ggf. Tab in `/intern` |
| Tool 2 — Mitarbeiterakte | `localhost:3001/employee-automation` | → ggf. Tab in `/intern` |
| Upload Manager | `localhost:3001/uploads` | → ggf. Tab in `/intern` |
| **Interne Zentrale (geplant Slice A)** | — | **`localhost:3001/intern`** |

**Module (canonical):** `00-dashboard · 01-unternehmensakte · 02-projektakte · 03-mitarbeiterakte-tool-2 · 04-qm-auditordner · 05-schulungen-unterweisungen`.

→ Sobald `/intern` live ist: Dashboard-Launcher auf **`localhost:3001/`** (Hub) umstellen = rename-sicher.

---

## 📤 Von Claude an Cursor (Reviews / Hinweise / Aufgaben)

### 2026-06-07 — ▶ Findings 1+2 (+5) zum Verdrahten + UE-Anzeige Pre-Commit-Review (Planer 2)

**1) UE-Anzeige (Variante C) — statisches Pre-Commit-Review besteht** (`CODE_REVIEW.md`, oben). `EmployeeFileTrainingTargets.tsx` + Verdrahtung + Persistenz vollständig, `tsc` 0, Lints 0. **Offen vor Final-Abnahme:** Browser-Akzeptanz (Karte rendert, Ist persistiert über Reload, EC-09-Smoke grün) + **Commit**. Kleines Anzeige-Finding: `t.hint` wird nicht gerendert → **CL-27-Anrechnungs-Zeile** + Asyl-„64 UE"-Hinweis fehlen (Variante-C-Vorlage zeigt die Anrechnungszeile). Bitte mit Findings 1+2 mitnehmen.

**2) Findings 1+2 (+5) — Bauauftrag:** `hq/10_Bridge/CURSOR_FINDINGS_1_2_AUFTRAG.md`.
- **F1:** `q-34a` bei reiner Unterrichtung → `status: "unvollständig"` statt `"vorhanden"` (Engine + Test).
- **F2:** Pflicht-Set-Doppelzeilen CL-08 (Erste Hilfe) + CL-23 (Brandschutz) im **Presenter** dedupen (Trigger mergen; `null`-CL nie dedupen; exklusive CL-04/05/09 prüfen).
- **F5 (kosmetisch):** Asyl-Basis-Label rollen-neutral.
- DoD: `tsc` 0, EC-09-Smoke grün, Browser-Akzeptanz, Suite grün.

### 2026-06-07 — ✅ Findings 3+4 entschieden (Mark) → in Engine-Auftrag verdrahtet (Planer 2)

- **F4 = Variante B + Upgrade-Pfad:** nur `roleType = "Führungskraft"` = FK (24 UE + CL-10); Einsatz-/Objekt-/Schichtleitung = EK/SMA (16 UE), bleiben Bewachung; FK-Upgrade über Distance-Learning = Phase 2.
- **F3 = gaten:** SDL-Schulungssoll nur bei Bewachungsrolle. Doppelrolle (Verwaltung+Bewachung) = Design-Lücke für Slice 3+.
- Beide in `CURSOR_FINDINGS_1_2_AUFTRAG.md` als Engine-Auftrag (F3/F4) ergänzt.

### 2026-06-07 — ▶ Hetzner-Deploy = eigener Schritt NACH Slice 2 (nicht vermischen) — Planer 2

**Rahmung (kein Bau-Start jetzt — erst nach Slice-2-Stabilität + Marks „los"):** Deploy-Runbook steht vollständig in `HETZNER_DEPLOY.md` (systemd, nginx/Let's Encrypt, Env-Checkliste, Webhook-PATCH auf Prod-URL). Ziel: **stabile HTTPS-URL** statt flüchtigem cloudflared-Tunnel.

**Pre-Deploy-Checkliste (Executor, klein — bevor Mark deployt):**
1. **DB-Doppelpfad vereinheitlichen** (`prisma/prisma/dev.db` vs. `prisma/dev.db`, Tech-Debt aus CLAUDE.md) — sonst zeigt der Server auf eine andere DB als Dev. Vor Deploy klären, welcher Pfad kanonisch ist.
2. **Prod-Build-Gate prüfen:** `next build` muss durchlaufen (ESLint war repo-weit mal blockierend; T-02 hat auf 0 gefixt — vor Deploy `npm run build` lokal grün bestätigen).
3. `.env.production.local` Env-Vollständigkeit (DATABASE_URL, HETZNER_S3_*, TALLY_API_KEY, TALLY_WEBHOOK_SECRET, INTERNAL_API_KEY, NODE_ENV).

**Mark-Aktionen (aus `HETZNER_DEPLOY.md` „Offen"):** Subdomain + DNS (`cos.cert-expert.de` → VPS-IP), `.env.production.local` auf VPS, erster Deploy + Webhook-URL umstellen, optional Tally Hidden Field `cea_company_slug`.

> Ältere „Von Claude an Cursor"-Einträge (Norm-Matrix v2, Slice-Freigaben, frühe Reviews, 2026-06-06-Overviews, Scope-Entscheidungen) → **`HANDOFF_ARCHIV.md`**.

---

## ❓ Offene Entscheidungen für Mark

**Slice-2-Review Findings 3+4 — ✅ ENTSCHIEDEN (Mark, 2026-06-07):**
- **Finding 4 = Variante B + Upgrade-Pfad:** Nur `roleType = "Führungskraft"` zählt als **FK** (24 UE + FK-Quali CL-10). **Einsatzleitung, Objektleitung, Schichtleitung = EK/SMA-Niveau (16 UE), kein Auto-FK.** Sie bleiben **Bewachungsrollen** (volles Basis-Pflichtset). **Zusatz (Phase 2):** Upgrade-Pfad auf FK, wenn die Person die FK-Schulung absolviert (künftig über Cert-Expert Distance-Learning direkt im Portal) — Design-Notiz, nicht Slice-2-Engine.
- **Finding 3 = gaten, BESTÄTIGT (Mark):** SDL-Schulungssoll nur bei Bewachungsrolle. Beispiel akzeptiert: reine Bürokraft ohne Bewachung → kein SDL-Soll. Korrekt für den Normalfall (eine Rolle).
- **🟡 Design-Lücke „Doppelrolle" (Mark-Feedback, Phase 2 — NICHT Slice 2):** Die Engine kennt pro Person nur **eine** `roleType`. Eine Person mit **Verwaltung/Geschäftsführung + zusätzlich Bewachung** (z. B. GF, der mit auf Schicht geht — bei kleinen Firmen real) kann heute **nicht** abgebildet werden → bekäme fälschlich kein Bewachungs-Set/SDL-Soll. Lösung später: Doppelrolle modellieren (z. B. Flag „übt zusätzlich Bewachungstätigkeit aus" oder Mehrfach-`roleType`). **Bis dahin Workaround:** solche Personen als Bewachungsrolle erfassen. → als Design-Notiz für Slice 3+ vorgemerkt.

→ F3/F4 in **`CURSOR_FINDINGS_1_2_AUFTRAG.md`** als Engine-Auftrag verdrahtet. *(Finding 1+2 = Presenter/Engine-Feinschliff; Finding 5 kosmetisch.)*

---

## ✅ Archiv (erledigt)

Vollständige Historie (erledigte Aufgaben, alte Abschlüsse, frühe Reviews) → **`HANDOFF_ARCHIV.md`**.
