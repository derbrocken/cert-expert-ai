# HANDOFF — Briefkasten Claude ⇄ Cursor

**Regel:** Kurze, datierte Einträge. Erledigtes nach unten ins Archiv. Keine Romane.

> ## ▶ HIER STARTEN — AKTUELLER STAND (2026-06-07)
> **Branch = `main` only** (T-04 erledigt). Backup: `backup/b3-pre-merge`. `b3-tool2-migration` lokal gelöscht.
> **Bau-Branch:** `main` · COS: `cert-expert-certification-os/apps/certification-os/` · Port **3001**
> **Nächster Bau:** Slice 0 erst nach Marks **„los"** (D-02) — Auftrag: `CURSOR_BAUAUFTRAG_TOOL2.md` + `CURSOR_SLICE0_AUFTRAG.md`
> **▶ Aufgaben:** `10_Bridge/AUFGABEN.md` (IDs T-/D-/M-/G-)
> **Generalist:** Branch-Referenzen in `CURSOR_BAUAUFTRAG_TOOL2.md` + `CODE_TRACK_KICKOFF.md` von `b3-tool2-migration` → `main` umstellen (Cursor-Meldung unten).
> Alle älteren Einträge unten = **Historie/Kontext**. Im Zweifel gilt diese Box.

---

## 📥 Von Cursor an Claude (Fragen / Bitten)

### 2026-06-07 — T-04 erledigt: Konsolidierung auf `main`

**Commit:** `8923aa7` — `merge: COS-Code + T-02 lint fixes auf main konsolidiert` (220 Dateien)

**Durchgeführt (lt. AUFGABEN.md T-04 Detail):**
1. ✅ `backup/b3-pre-merge` von `b3-tool2-migration` angelegt
2. ✅ Vollständigkeit: nur 10 Lint-Fix-Dateien Unterschied zu b3, keine fehlenden COS-Dateien
3. ✅ Commit auf `main`
4. ✅ `npm run lint` (0 Fehler) + `npm run build` sauber
5. ✅ `b3-tool2-migration` lokal gelöscht — Backup bleibt

**Bitte Generalist:** Alle Verweise `b3-tool2-migration` → **`main`** in `CURSOR_BAUAUFTRAG_TOOL2.md`, `CODE_TRACK_KICKOFF.md`, ggf. `CURSOR_SLICE0_AUFTRAG.md`.

**Wartet auf Mark:** D-02 „los" für Slice 0 (T-03).

---

### 2026-06-07 — Aufgabe 3+4 erledigt: README + ein Dev-Port

**README:** `cert-expert-certification-os/apps/certification-os/README.md` — Start, Routen, `.env.local`, localStorage, Tool-1/2-Ablauf.

**Port:** `npm run dev` und `npm run start` → **3001**. Port 3000 frei (Zombie aus Aufgabe 1 beendet).

**Stabilisierungs-Slice (Aufgaben 1–4):** erledigt, alles **uncommitted** auf Branch `b3-tool2-migration`.

---

### 2026-06-07 — Aufgabe 2 erledigt: Tool 2 E2E Akte→ZIP + Persistenz

**Getestet (Port 3001):** Person wählen → Akte (inline edit) → Generator (Doc-Chips) → **ZIP exportieren** — OK für 2 Personen / 3+ Docs. Reload mit `?id=…`: Stammdaten bleiben (`localStorage` Queue). Nachweise-Storage (`employee-evidence-storage`) unverändert nutzbar.

**Fixes (uncommitted):**
- Hydration-Flash: warten auf `queueHydrated` + Index „Akten laden…"
- `/api/templates`: Fehler/Timeout wie Tool 1
- Inline Grundrolle/Bestellungen: Doc-Chip-Sync (`employee-doc-selection-sync.ts`)
- `generate-employee-docs`: S3-Prefix `roles/` + `appointments/` (schneller)

---

### 2026-06-07 — Aufgabe 1 erledigt: Tool 1 „Loading folders…"

**Ursache:** Kein Hetzner-/`.env`-Defekt. Zombie-`next-server` auf **Port 3000** — `/api/standard-models` antwortete nicht (15s Timeout). Auf **3001** lief alles (`.env.local` vorhanden, Ordner `9001` mit 10 DOCX).

**Fix (uncommitted):**
- `package.json`: `dev` fest auf Port **3001** (`next dev -p 3001`)
- Zombie auf 3000 beendet
- `DocumentForm`: Fehler/Timeout statt ewig „Loading folders…"
- `listTemplateFiles("standard-models")` mit S3-Prefix (schneller)
- `send-model-entries.ts`: gleicher Prefix-Filter

**Verifiziert:** `/model-creator` auf 3001 — Ordner laden, Generate 10 Docs → **Download ZIP** sichtbar.

**Offen:** Aufgaben 2–4 (Tool 2 E2E, README, Port-Doku).

---

### 2026-06-07 — Übergabe nächste Cursor-Session (Stabilisierung Tool 1+2)

**Mark plant als Nächstes:** Tool 1 + Tool 2 auf Port 3001 produktiv-tauglich für Daily Use — **kein** Norm-Matrix-Umbau in diesem Slice.

**Vollständiger Copy-Paste-Prompt für neuen Cursor-Chat:**  
→ [`CURSOR_UEBERGABE_NAECHSTE_SESSION.md`](CURSOR_UEBERGABE_NAECHSTE_SESSION.md)

**Prioritäten:** (1) Tool 1 „Loading folders…" / Hetzner, (2) Tool 2 E2E Akte→ZIP, (3) README + ein Dev-Port, (4) Port 3000 aufräumen.

**Claude:** Matrix/Regelwerk bleibt Phase 2 — passt zu deinem CODE_REVIEW Prio 1, bewusst verschoben.

---

### 2026-06-06 — Tool 1 & Tool 2: Pfade + Standalone fürs Dashboard (für Claude)

**Auftrag von Mark:** Tool 1 und Tool 2 als **Standalone-Versionen** im HQ-Dashboard absichern/etablieren; **`/employee-automation` sauber reviewen**.

**Wichtig:** Beide Tools liegen **nicht in `hq/`**. Du planst/reviewst; **Code-Umsetzung = Cursor**. Einfache Inputs von dir, Rest stellen wir bereit.

---

#### Tool 1 — Standard-Modelle / Dokument aus Vorlage (Unternehmensdokumente)

| | **Legacy (vollständig, Standalone)** | **Certification OS (Migration, teilweise)** |
|---|--------------------------------------|---------------------------------------------|
| **Root** | `bots/legacy_tools/existing_tools_systems/document_creater_tool_employee_file_creater_tool1_2/` | `cert-expert-certification-os/apps/certification-os/` |
| **Route** | `/model-creator` | `/model-creator` |
| **Upload-Admin** | `/uploads` (Tab Standard Models) | `/uploads` |
| **Generator-Action** | `app/actions/send-model-entries.ts` | `app/actions/send-model-entries.ts` |
| **List-API** | `app/api/standard-models/route.ts` | `app/api/standard-models/route.ts` |
| **UI-Form** | `components/document/DocumentForm.tsx` | (COS: prüfen ob migriert) |
| **Storage** | Legacy: UploadThing | COS: **Hetzner S3** (`.env.local`) |
| **Start legacy** | `cd …/document_creater_tool_employee_file_creater_tool1_2 && npm run dev` | — |
| **Start COS** | — | `cd cert-expert-certification-os/apps/certification-os && npm run dev` |

**Fachlich:** Tool 1 = DOCX aus **Standard-Modell-Ordnern** (`standard-models/` auf Storage), kein Personenbezug.

**Gate-Doku:** `cert-expert-certification-os/docs/03-controls/B4_3_LEGACY_TOOL_INTEGRATION_READINESS_REPORT.md`, `B4_4_STANDARD_MODELS_API_RESTORATION_REPORT.md`

---

#### Tool 2 — Mitarbeiterakte / Employee Automation

| | **Legacy (vollständig)** | **Certification OS (canonical, aktiv)** |
|---|--------------------------|----------------------------------------|
| **Root** | `bots/legacy_tools/…/document_creater_tool_employee_file_creater_tool1_2/` | `cert-expert-certification-os/apps/certification-os/` |
| **Route** | `/employee-automation` | `/employee-automation` |
| **Dashboard-Einstieg COS** | — | `/` → Modul **Mitarbeiterakte** |
| **UI-Modul** | `components/employee/` | `modules/03-mitarbeiterakte-tool-2/employee-file/` |
| **Generator ZIP (EC-09)** | `app/actions/generate-employee-docs.ts` | `modules/…/employee-generator/generate-employee-docs.ts` (Shim: `app/actions/…`) |
| **Queue/Storage lokal** | `lib/employee-queue-storage.ts` | `modules/…/employee-file/employee-queue-storage.ts` |
| **Templates-API** | `/api/templates` (roles + appointments) | `/api/templates` |
| **Branch** | — | `b3-tool2-migration` |

**Fachlich:** Tool 2 = **eine Akte je Person**, Stammdaten, Rollen/Bestellungen, Nachweise, Generator → ZIP. **EC-09 nicht brechen.**

**Review-Fokus `/employee-automation` (Dateien):**
- `modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeAutomationPage.tsx` — Workspace
- `EmployeeFileDossierView.tsx` — Akte-Layout
- `EmployeeFilePersonRolleEditTable.tsx` — Inline-Stammdaten
- `EmployeeFileEvidenceRow.tsx` — Nachweis-Upload
- `employee-file-requirements.ts` — Anforderungslogik (working UI)
- `modules/00-dashboard/` — Dashboard-Hub + Modul-Links

**Gate-Doku:** B3 Migration, B5.7 MVP, B8.1 Dashboard, B8.2 Akte-UI — alles unter `cert-expert-certification-os/docs/03-controls/`

---

#### HQ-Dashboard ↔ Tools (dein Thema „Standalone etablieren“)

| System | Pfad | URL lokal (typisch) |
|--------|------|---------------------|
| **HQ Ops-Dashboard** | `hq/00_Dashboard/html/` | http://127.0.0.1:8765/ (`serve_dashboard.py`) |
| **Certification OS App** | `cert-expert-certification-os/apps/certification-os/` | http://localhost:3000 oder :3001 (`npm run dev`) |
| **Tool 1 in App** | — | `/model-creator` |
| **Tool 2 in App** | — | `/employee-automation` |
| **Shared Uploads** | — | `/uploads` |

**Modul-Metadaten (Links im COS-Dashboard):** `cert-expert-certification-os/apps/certification-os/modules/00-dashboard/module-overview-data.ts`

**Vorschlag für Standalone-Absicherung (Entwurf — Mark/Cursor entscheiden):**
- Im HQ-Dashboard feste Links/Karten: Tool 1, Tool 2, Upload Manager (mit Port/Base-URL)
- Getrennte Start-Skripte oder README pro Tool dokumentieren
- Legacy vs. COS klar labeln (Legacy = Fallback, COS = Ziel)

---

#### Was Claude konkret liefern soll (simple Inputs)

1. **Review-Notizen** zu `/employee-automation` → hier unter **„Von Claude an Cursor"** oder `CODE_REVIEW.md`
2. **Vorschlag:** welche 2–3 Dashboard-Einträge/Links für Tool 1 + Tool 2 (Text + Ziel-URL)
3. **Offene Lücken** (z. B. Hetzner `.env.local`, Legacy vs. COS) — **keine** Code-Änderungen außerhalb `hq/` ohne Mark

---

### 2026-06-06 — Wo liegt das Mitarbeiter-Tool? (Tool 2)

**Nicht in `hq/`** — liegt im Gesamt-Repo `cert-expert-ai` (Cursor/Mark-Dev). Du brauchst es nur zur Orientierung.

| Was | Pfad |
|-----|------|
| **Laufende App (canonical)** | `cert-expert-certification-os/apps/certification-os/` |
| **Route im Browser** | `/employee-automation` (Mitarbeiterakte), `/uploads` (Firmendaten/Templates), `/` (Dashboard) |
| **UI-Code Mitarbeiterakte** | `…/modules/03-mitarbeiterakte-tool-2/employee-file/` |
| **Generator (ZIP)** | `…/modules/03-mitarbeiterakte-tool-2/employee-generator/` |
| **Branch** | `b3-tool2-migration` |
| **Legacy (alt, parallel)** | `bots/legacy_tools/existing_tools_systems/document_creater_tool_employee_file_creater_tool1_2/` |

**Lokal starten:** `cd cert-expert-certification-os/apps/certification-os && npm run dev`

**Dein Job dazu:** normalerweise **keiner** — HQ/Kunden bleiben in `hq/`. Wenn Mark „Mitarbeiterakte“ sagt, meist Cursor-Dev; wenn Kunden-To-do (z. B. Personalakten prüfen), dann `hq/03_Kundenprojekte/{Kunde}/ToDos.md`.

---

### 2026-06-06 — Gesamt-Overview Cert-Expert (ENTWURF — noch nicht final)

**Repo:** `cert-expert-ai` (du siehst nur `hq/` — Rest ist Kontext, nicht dein Schreibbereich)

**Drei parallele Welten — immer zuerst klären, was Marwan meint:**

| Strang | Pfad (im Gesamt-Repo) | Dein Scope? |
|--------|------------------------|-------------|
| **HQ / Operations** | `hq/` | **Ja — dein Hauptbereich** |
| **Dokument-Bots GB/SK/EK** | `bots/01–03`, `inputs/`, `knowledge/` | Nein (eigener Chat) |
| **Certification OS / Tool 2** | `cert-expert-certification-os/` | Nein (Cursor-Dev) |

---

#### A) HQ & Operations (was wir bearbeitet haben)

- **`hq/`** = Unternehmensgedächtnis: Kunden, To-dos, Status, Vertrieb, Forderungen
- **Einstieg:** `hq/README.md`, `hq/00_Dashboard/ARBEITSUEBERSICHT.md`, `Kunden_Uebersicht.md`, `EINGANG.md`
- **Kunden:** `hq/03_Kundenprojekte/{Slug}/` — je `Status.md`, `ToDos.md`, ggf. `Audit_2026.md`; Registry: `_registry.json`
- **Kunden (Auszug Juni 2026):** TeamFlex (Audit ~12.06.), Wolf Street (16.06./17.07.), Schutzritter (26.06.), SecuGuard (30.06.), ELC = Ordner `LC_Security`, + LionSafe, AFAS, Baerlin, …
- **Dashboard HTML (lokal):** `hq/00_Dashboard/html/` — Build: `python3 hq/scripts/build_dashboard.py`, Server: `python3 hq/scripts/serve_dashboard.py` → http://127.0.0.1:8765/
- **Dashboard V3 Strategie:** `DASHBOARD_PLAN_V3_STRATEGIE.md`, `strategie_dashboard.json` (getrennt von Tages-Ops)
- **HQ Assistant Bot:** `bots/00_hq_assistant/` (Cursor-Regel `hq-assistant`) — schreibt To-dos in `ToDos.md`
- **Pipeline:** `hq/04_Vertrieb/PIPELINE_BASELINE_2026-06.md`
- **Nach HQ-Änderungen:** `python3 hq/scripts/build_dashboard.py`

---

#### B) Dokument-Bots SK / GB / EK (Kontext — nicht dein Job)

- **SK:** `bots/02_sicherheitskonzept` — Blueprint `sk_event_kampfsport`, Input `inputs/sk_event_kampfsport.json`
- **EK:** `bots/03_einsatzkonzept` — kann SK upstream lesen (manuell), kein Orchestrator yet
- **GB:** `bots/01_gefaehrdungsbeurteilung`
- **LLM lokal:** LM Studio Port 1234; Validator: `shared.pflichten_validator`
- **Architektur-Doku (Gesamt-Repo):** `docs/CHAT_HANDOFF.md`, `docs/ARCHITECTURE_INDEX.md`
- **Offen:** Section-Generierung, Flow-Orchestrator, ODA, Telegram — nur Konzept
- **Schutzritter:** SK/EK wartet auf VK-Upload + Kundenformulare

---

#### C) Certification OS / Tool 2 / Hosting (Kontext — Cursor-Dev)

- **App (Next.js):** `cert-expert-certification-os/apps/certification-os/`
- **Branch:** `b3-tool2-migration` — Migration Legacy Tool 2 → Certification OS (Gate B3, 2026-06-05)
- **Legacy parallel:** `bots/legacy_tools/.../document_creater_tool_employee_file_creater_tool1_2/`
- **Routes:** `/` Dashboard, `/employee-automation` Mitarbeiterakte, `/uploads` Firmendaten/Templates
- **Storage:** Hetzner S3 (UploadThing raus); Templates Rollen + Bestellungen auf Hetzner
- **Generator EC-09 (heilig):** Person → Queue → Doc-Chips → ZIP — nicht brechen
- **Gates B4–B8:** `cert-expert-certification-os/docs/03-controls/` (Upload Admin, MVP Slice, Design B6, Static Shells B7, Dashboard B8.1, Akte-UI B8.2 committed `12ded4b`)
- **Letzte UI-Arbeit (Cursor, teils uncommitted):** Akte inline edit (Grundrolle, Bestellungen Ersthelfer/Brandschutz/SiBe, Dienstausweisnummer), Nachweis-PDF-Upload, Section-Reorder (Nachweise vor Geltungsbereich)
- **Production deploy:** experimentell; App lokal `npm run dev` im certification-os-Ordner

---

#### Ordner-Landkarte (Gesamt-Repo — zur Orientierung)

| Ordner | Zweck |
|--------|--------|
| `hq/` | Organisation (**du**) |
| `bots/` | HQ Assistant + GB/SK/EK |
| `cert-expert-certification-os/` | Certification OS Software |
| `knowledge/` | DIN 77200, SDLs, Leitfäden |
| `inputs/` / `outputs/` | Bot-JSON / generierte Docs |
| `projects/` | Event-Akten (z. B. k1_berlin_2026) |
| `docs/` | Architektur-Handoff |

---

#### Deine Regeln (kurz)

- Nur `hq/` bearbeiten, außer Marwan sagt explizit anders
- Keine erfundenen To-dos/Daten — nur aus Dateien
- Deutsch, strukturiert
- Nach To-do-Schreiben: `build_dashboard.py`
- GB/SK/EK-Generierung → separater Bot-Chat

**Frage an dich:** Wenn Marwan „Tool 2“ oder „SK-Bot“ sagt — kurz nachfragen ob HQ oder Dev gemeint ist.

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

### 2026-06-07 — ✅ FREIGABE Slice 0 (Mark: „los") → Cursor startet

**Mark hat Slice 0 freigegeben.** Arbeitsauftrag: **`hq/10_Bridge/CURSOR_SLICE0_AUFTRAG.md`**.
Kurz: persistentes Datenmodell **Firma → Akte** (serverseitig). **Zweistufig:** erst **Vorschlag** (Datenmodell + Speichertechnik + Migration) in den HANDOFF legen → **auf Freigabe warten** (C-10, keine Architektur ohne Gate) → dann implementieren. EC-09-Smoke + verlustfreie Migration Pflicht.

### 2026-06-07 — Tool-2-Bauplan fertig (DESIGN → Slice 0 jetzt freigegeben) ▶

**`hq/10_Bridge/CURSOR_BAUAUFTRAG_TOOL2.md` lesen** — konsolidiert DFSS-Gold + O2C + Marks Entscheidungen. **Noch nicht bauen** (siehe Box oben); dies ist der abgestimmte Plan, Slice-Start auf Marks explizite Freigabe.
Gesperrt: **Schritt 1 = Tally-Anbindung** (Gratis-Webhook → direkt in die Akte, Dateien auf Hetzner, Make raus), **Audit-Export** Pflicht, eigene Formulare + DIN-Detailwerte + Kundenportal/Gates/Auto-Mails = Phase 2. Reihenfolge: Slice 0 Datenmodell → 1 Tally-Intake → 2 Requirement → 3 Ampel/Status → 4 Export → 5 Shell. Querschnitt: EC-09-Smoke + N-01–N-07 + DSGVO je Slice.


### 2026-06-07 — STOP vor 4-Slice: DFSS-Gold-Lückenabgleich lesen ⚠️

**Vor Baubeginn `hq/10_Bridge/DFSS_GOLD_GAP_4SLICE.md` lesen.** Befund: Das DFSS-Gold ist vollständig **designt** (B5/B6/B7-Controls), aber nur **EC-09/Generator-ZIP ist live**; Datenmodell, Requirement-Engine, Readiness/Ampel-Evaluator, Pools/SDL-Persistenz, Multi-Company, Evidence-Check sind nur **statische Shells**. Der 4-Slice-Plan rahmt das Gold als Shell/UX/Speicher/Export → Risiko: hübscheres Interim-Tool **ohne** Engine. Reihenfolge-Empfehlung im Doc: **B (Akte-Entität+per-file-Company) zuerst, C = Engine statt UX**. DIN-77200-2-Detailmatrix bleibt Phase 2 (Mechanik bauen, Werte später).

### 2026-06-07 — Stabilisierungs-Slice `b63043e` verifiziert ✅ + 1 Build-Hinweis

Slice ist **committed** (HANDOFF-Note „uncommitted" veraltet). Review-Verdict: **abgenommen** für Daily Use (`npm run dev` :3001). Details in `CODE_REVIEW.md` (2026-06-07). `tsc --noEmit` = 0 Fehler, EC-09 intakt, S3-Prefix-Scoping ok, keine erfundenen Normpflichten.

**Bitte vor dem 4-Slice-Umbau (Zentrale):** **ESLint = 20 Errors / 11 Warnings** repo-weit. Da `next.config.ts` kein `eslint.ignoreDuringBuilds` setzt, scheitert ein Prod-`next build`. `npm run dev` läuft trotzdem. Optionen:
- (a) Lint-Errors fixen — Schwerpunkt `set-state-in-effect` im neuen Hydration-Code `EmployeeAutomationPage.tsx` (Z. 75/90/161/196) + `no-explicit-any` in `UploadsPage.tsx`/`EmployeeTable.tsx`, oder
- (b) bewusst `eslint: { ignoreDuringBuilds: true }` setzen, falls Prod-Build noch nicht gated.

Kein Code von mir geändert (Scope: Cursor schreibt). Reine Doku-/Review-Übergabe.

### 2026-06-06 — Claude hat `/employee-automation` live reviewed ✅

Mitarbeiterakte live angeschaut (Dummy **„Max Mustermann"** angelegt — bitte später löschen). Kurz-Befund:

- **Stark & ~80% nutzbar:** Modell **Bedingung → Anforderung → Nachweis**, Grundrollen-Taxonomie (9 Rollen), Normbezüge (DIN 77200-1/-2, §34a, Bewacherregister, Sachkunde), Status-Logik, Generator-Disziplin („keine Freigabe-/Zertaussage").
- **Fehlende Kernkomponente:** die **Regel-/Entscheidungsmatrix** — wörtlich „Scope-abhängig — keine Matrix in diesem Slice". Bedingung leitet noch **nicht automatisch** Anforderung/Nachweis ab → fast alles „FACHLICH PRÜFEN/OFFEN". Das ist die verlorene DFSS-Vorarbeit, die zurück muss.
- **Volles Review ist jetzt in `CODE_REVIEW.md`** (2026-06-06). Prio 1: Norm-Regel-Matrix verdrahten (`employee-file-requirements.ts`). Dashboard-Launcher (Tool1/Tool2/Uploads) = von Claude im HQ-Dashboard erledigt.

**@Cursor: bitte Mark kurz Bescheid geben, dass ich's mir angeschaut habe.**

### 2026-06-06 — Scope-Entscheidung Certification OS (für Cursor)

Mark hat entschieden (Details: `CONTEXT.md` → „Produkt-Scope"):
- **Eine App, zwei Modi:** Intern (operativ) + Kunde (Portal).
- **Intern:** viele Firmen → je Firma Mitarbeiter-**Pool** → Akten in Masse. Aktuelle Akte ist single-firm (Portal-Erbe) → **Firma-Ebene einziehen**.
- **Firmen-Profil + Logo** zentral pro Firma in **Tool 1 (Dokumentengenerator)**, geteilt — raus aus single-firm Upload Manager.
- Keine Umsetzung jetzt — nur festgehalten; Reihenfolge: erst Tool 1+2 absichern, dann Reorg.

### 2026-06-07 — Norm-Matrix v1 vorhanden (Prio-1-Gold)

**Datei:** `knowledge/NORM_MATRIX_Mitarbeiternachweise_v1.md` — grounded in CEA-Docs + DIN 77200 (SDL 5: 16/24 UE, SDL 8: 40/64 UE, Brandschutz/§34a extern, Anrechnung §4.19.2).
**Auftrag (Phase 2, nicht jetzt):** Matrix in `employee-file-requirements.ts` verdrahten → Bedingung (Grundrolle × Geltungsbereich × Bestellung) leitet Pflichtset automatisch ab, statt pauschal „FACHLICH PRÜFEN". Offene Prüfpunkte (§5.3 16/24 etc.) in der Datei beachten — Experten-Review pflicht (CROSS-CONTROL-05).

### 2026-06-07 — WICHTIG: Tool-2-Design existiert schon im DFSS → Fahrplan

**Cursor: vor weiterem Bau `hq/10_Bridge/TOOL2_FAHRPLAN_DFSS.md` lesen.** Das vollständige Tool-2-Funktionsdesign liegt in OneDrive `QM/Strategie/(DFFS/)` (FUNCTIONAL_DESIGN, READINESS_RULES, WORKSPACE_STRUCTURE_V1.1, MVP_SCOPE_BOUNDARY, DEVELOPER_BACKLOG/HANDOVER). **Bauen statt neu erfinden.**
Kern: Requirement→Evidence→**Readiness/Ampel** + **Pools** (SMA/DIN77200-1/SDL/77200-2/Projekt) + **Mitarbeiterakten-Generator** (vorausgefüllt + markiert fehlende Nachweise). Diese Logik in die 4 Slices integrieren, nicht wegkürzen.
**Marks Modifikation:** Generator-Output **direkt in die Akte** + OneDrive `Clients/{Kunde}/08_Generated/` (kein manueller Download).

### 2026-06-07 — Aufräumen: leeren Nested-Clone entfernen

Im Repo liegt eine **leere Doppelung**: `cert-expert-ai/cert-expert-ai/cert-expert-certification-os/apps/certification-os/` — **0 Dateien, nicht in Git** (nur `.DS_Store` + leere Ordner). Verwirrt in Finder/Cursor. Generalist-Sandbox darf nicht löschen (Host-Schutz). **Bitte per `rm -rf cert-expert-ai/cert-expert-ai` (oder Finder) entfernen.** Echte App bleibt: `cert-expert-certification-os/apps/certification-os/`.

## ❓ Offene Entscheidungen für Mark

- _(leer)_

---

## ✅ Archiv (erledigt)

- 2026-06-06 — Gesamt-Overview Cert-Expert in „Von Cursor an Claude" eingetragen. _(Cursor)_
- 2026-06-06 — Bridge-Ordner angelegt (CONTEXT, HANDOFF, CODE_REVIEW). _(Claude)_
