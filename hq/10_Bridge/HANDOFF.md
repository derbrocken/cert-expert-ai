# HANDOFF — Briefkasten Claude ⇄ Cursor

**Regel:** Kurze, datierte Einträge. Erledigtes nach unten ins Archiv. Keine Romane.
**📁 Historie:** Ältere Abschluss-Einträge + frühe Reviews/Freigaben (Slice 0/0a/0b, Slice 1 + Nachzug, Tally-Intake/Webhook, Stabilisierung, Overviews, Slice-2-Bau) → **`HANDOFF_ARCHIV.md`** (Schnitt 2026-06-07, nichts gelöscht).

**Rollen-Kontrakt (verbindlich, `CLAUDE.md`):** Planung/Review/Norm-Mapping = **Planer (Spur P)**. Der **Executor** baut nur den Bauauftrag, committet, hängt **EINEN** kurzen Ergebnis-Eintrag an + kippt den HIER-STARTEN-Status — **schreibt keine Specs um, plant nichts neu**. Neue Idee/Scope-Frage → als Frage an den Planer.

**Übergabe-Takt (Agent):** Nach Task/Slice/Commit → Mark erinnern: „✅ stabiler Punkt — Committen/Übergeben (neuer Chat)." Bei ~70–80 % Context → „Übergabe empfohlen." Ablauf: stabil → commit → **Abschluss-Eintrag** (fertig/offen/nächster Schritt/Hashes) → neuer Agent liest `CLAUDE.md` + HANDOFF. Gedächtnis = Repo, nicht Chat.

> ## ▶ HIER STARTEN — AKTUELLER STAND (2026-06-07)
> **✅ STATUS (Executor, 2026-06-08): Read-only Akte-/Vorzeige-Übersicht (Queue B / Pt 1) = FERTIG + committet `ae477e8`** (tsc 0 · Engine 27/27 · EC-09-ZIP 200 + `UEsDBA`-Magic · Browser-Akzeptanz EK-Person). Neue `EmployeeFileOverview.tsx` + Toggle „Bearbeiten ↔ Übersicht". Reine Präsentation, EC-09/EC-10 gewahrt, nichts geparkt. Details unten „Von Cursor an Claude". **Nicht gepusht.**
> **Branch = `main`** · COS: `cert-expert-certification-os/apps/certification-os/` · Port **3001**
> **▶ NEUER ARBEITSMODUS (Mark, 2026-06-08):** EIN dauerhafter Planer/Status-Chat + **Subagent baut alles autonom** (kein separater Planer-Chat mehr). Gedächtnis = Repo. Neuer Chat liest `CLAUDE.md` + diese Box + `CURSOR_AUTONOMOUS_RUN_ORDER.md`.
> **▶ JETZT — RESUME-PUNKT (Planer-Chat, 2026-06-08 ~18:10):** **Bau-Queue = `CURSOR_NAECHSTE_QUEUE.md`.** Stand: **A** Norm-Cross-Check ✅ (`NORM_CROSSCHECK_SCHULUNGSKATALOG.md`, Befunde: 🔴 Veranstaltung-FK 16 vs. 24 CL-20 · 🔴 ÖPV ohne CL · Module=Curriculum; 3 offene Norm-Fragen an Mark, blockieren C **nicht**). **B** read-only Übersicht ✅ **Planer-abgenommen** (`ae477e8`, tsc 0/Engine 27/27/EC-09 200/read-only verifiziert). **EK/FK** `e1899dd` ✅ abgenommen. **Commits (nicht gepusht):** `e1899dd` EK/FK · `ae477e8` Übersicht · `cc39e7f` Planer-Docs. **▶ C — Termin-Planung (lücken-getrieben): ✅ FERTIG + committet `fbe1980` + ✅ PLANER-ABGENOMMEN (2026-06-08, `CODE_REVIEW.md` oben)** — Planer unabhängig re-verifiziert: tsc 0 · 49/49 Tests (training-plan 12 / Engine 27 / compliance 10) · Engine+UE nachweislich unberührt (nicht im Diff) · Repository 4 Mapping-Stellen + tolerante Read-Norm · Plan→Ampel-Merge an Aufrufstelle (compliance-status.ts unverändert) · EC-09-ZIP 200 · norm-neutral (Module=Lehrbausteine, kein Auto-Ist). Einziger offener Minor: Nachweis-Upload-Klick (OS-Dateidialog) nicht harness-automatisierbar → unit-getestet + Evidence-Infra-Reuse, optionale Mark-Klick-Abnahme. **Commits (nicht gepusht):** `fbe1980` Feature · `79f3618` HANDOFF. Details unten „Von Cursor an Claude". Detail-Auftrag = `CURSOR_C_TERMINPLANUNG_AUFTRAG.md` (neues `trainingPlan`-Json-Modell + DIN-1-Modul-Katalog als Lehrbausteine + Gap-Logik Soll−Ist + Plan→Ampel operativ + Nachweis-Slot je Zuweisung über bestehende Evidence-Infra). Norm bleibt CL-11 (Module füllen, ändern nicht; **kein Auto-Ist**; Engine/UE unberührt; EC-09/EC-10). Geschäftslogik = `CURSOR_SCHULUNGSKATALOG_PLANUNG.md` §9. **Bot baut autonom; Planer reviewt nach Bau.** Danach D (Modell-Trennung, erst nach Mark-Klärung der Cross-Check-Fragen).
> **▶ NÄCHSTER BAU — EK/FK-Refinement (Mark entschieden, 2026-06-08):** Norm-Klasse soll **EK + FK FREI KOMBINIERBAR** machen (statt Entweder-oder). Pflicht-Set = **Vereinigung**; da **FK ⊇ EK** → **keine neue Normpflicht erfunden** (EK+FK = FK-Set, CL-10/CL-20/25 nur bei DIN-SDL). **Planer-Empfehlung (Mark: „entscheide du") = ZUSAMMENFÜHREN:** eine saubere **Norm-Klassen-Mehrfachauswahl**, in der das bestehende Feld „Zusätzliche Bewachung (Doppelrolle, EK/FK-Niveau)" **aufgeht** → EIN klarer Mechanismus statt zwei. **Berührt Slice-3-Engine + G4-`roleClass`-Modell** → Engine-Suite erweitern + **idempotente Migration** (Einfachauswahl + altes Doppelrolle-Niveau → neue Mehrfach-Klassen). **EC-09/EC-10 unberührt; Org-Titel bleibt reine Anzeige.** **✅ BAUFERTIG:** Bauauftrag steht → **`hq/10_Bridge/CURSOR_EKFK_REFINEMENT_AUFTRAG.md`** (Modell `roleClasses`-Set, Migration inkl. `zusatzBewachungNiveau`→Set, Engine-Set-Quelle, UI-Mehrfachauswahl, DoD, Kickoff-Prompt; UX-Defaults vom Planer gesetzt + überschreibbar). **▶ Neuer Chat: nur noch Subagent mit dem Kickoff-Prompt starten** (DoD: tsc 0 / Engine-Suite grün+erweitert / EC-09-ZIP 200 / Migration verifiziert).
> **🟢 AUTONOMER BUILD LÄUFT JETZT (2026-06-08 ~15:50):** Executor-Subagent baut autonom in dieser Reihenfolge: **(1) EK/FK-Refinement** (`CURSOR_EKFK_REFINEMENT_AUFTRAG.md`) → **(2) G4-Phase-2-Delta** (`CURSOR_G4_AUFTRAG.md`) → **(3) Regression-Check „grüne UE-Soll/Ist-Übersicht"** (Mark: „weg" — Sichtbarkeit wiederherstellen, **keine UE-Werte ändern**). Er committet selbst + hängt Ergebnis-Einträge unten an. **Neuer Chat: erst dessen Einträge lesen, bevor du EK/FK neu startest.**
> **▶ STATUS (Executor, 2026-06-08) — LAUF DURCH:** **(1) EK/FK-Refinement = FERTIG + committet + gepusht `e1899dd`** (tsc 0 · Engine 27/27 · EC-09-ZIP 200 · Migration live-verifiziert). **(2) G4-Phase-2-Delta** = unabhängig re-verifiziert → Ziel bereits durch `displayMode`-Architektur erfüllt → **geparkt** (offene A/B/C/D-Frage an Mark, kein Generator-Umbau ohne reviewtes Delta). **(3) Regression grüne UE-Soll/Ist-Übersicht** = diagnostiziert → **KEINE Rendering-Regression** (G4 fasst DossierView nicht an; Slice 4 rein additiv; Karte rendert live bei EK/FK). Sichtbarkeit ist bewachung-/norm-logik-gegatet (F3) → nicht ohne Norm-Entscheid „aufdrehbar" → **als präzise Frage geparkt** (welche Person? Norm-Klasse EK/FK setzen). Details + Belege unten „Von Cursor an Claude" (2026-06-08).
> **📋 PRODUKT-INPUT MARK (2026-06-08) → Planungs-Doku `CURSOR_SCHULUNGSKATALOG_PLANUNG.md`:** voller Schulungs-/Unterweisungs-Katalog (V1, OneDrive) + Begriffsmodell Bestellung/Schulung/Unterweisung + Brandschutz-Regel (scope-gated Pflicht, Gültigkeit immer anzeigen) + **fertige read-only Übersicht** + **Termin-Planung pro Schulung** (Bulk + Einzel-Override). **Upload-Architektur (im Code verifiziert):** Dateien → Hetzner S3 `cea/companies/{Firma}/evidence/{Person}/{Slot}/datei` (Pro-Person-Struktur existiert, Status `unchecked`; Tally importiert dorthin). **Lücke:** kein Slot pro Einzelschulung mit eigenem Datum → Bau-Bedarf. **Offen (Planer):** Norm-Cross-Check der Katalog-UE-Werte (FK scope-spezifisch!) vor Engine-Änderung.
> **⏹️ AUTONOMER LAUF — END-OF-RUN (2026-06-08, „Run Everything").** **Erledigt + committet:** G4 Phase 1 `047878c` · Bridge/Self-Review `dcbd0d5` · Slice 4 (Ampel/Status) `2261d26`. Alle Gates grün (tsc 0 / Engine-Suite 24/24 / Slice-4-Suite 10/10 / **EC-09-ZIP 200**). **Geparkt (mit präziser Frage):** G4 Phase 2 (Doc-Auswahl liegt bereits im Generator-Tab → konkretes Rest-Delta klären, `CURSOR_G4_PHASE2_AUFTRAG.md`) · Resttechnik (Ist-UE-Auto-Summe braucht neues Nachweis-UE-Datenmodell; DB-Doppelpfad = riskanter Infra-Refactor → Mark-Gate). **Empfohlen als Nächstes:** unabhängiger Planer-Review von `047878c`+`2261d26`, dann Phase-2-Delta entscheiden. Vollständige End-of-Run-Summary: unten.
> **🤖 AUTONOMER DAUERLAUF AKTIV (Mark-Vollmacht, 2026-06-08, bis Montagnachmittag):** Betriebsanleitung = **`hq/10_Bridge/CURSOR_AUTONOMOUS_RUN_ORDER.md`**. Ein Executor baut die Queue (G4 P1 → P1-Review → G4 P2 → Slice 4 → Resttechnik) **eigenständig**, reviewt sich selbst, **committet autonom** nach grüner Verifikation (tsc 0 / Suite / EC-09-ZIP 200). Harte Grenzen bleiben: EC-09/EC-10/keine erfundene Normpflicht/kein `.env`/`.db`/Kundendaten-Commit. **Frischer Chat: lies zuerst den Run-Order + Kickoff-Prompt dort.** Bug-Fixer läuft parallel (rebase, kein force).
> **Phase = Slice 3 (Doppelrollen, Niveau EK/FK) gebaut + committet (`a276d38`) ✅ — von Planer 6 REVIEWT + ABGENOMMEN ✅.**
> **Arbeitsmodell:** Planer/Claude führt (plant + reviewt) · Executor/Cursor baut · Ping-Pong über Bridge-Dateien (Mark, 2026-06-07). Planer rotiert seltener als Executor.
> **▶ NÄCHSTER PLANER-CHAT: „Planer 7"** (Nachfolger). Folge-Planer fortlaufend nummerieren. *(Planer 4 = Pre-Deploy + Hetzner-Deploy live. Planer 5 = Slice 3 geplant. **Planer 6 = Slice 3 reviewt + abgenommen (`CODE_REVIEW.md`, oben), tsc 0 / Suite 20/20 unabhängig re-verifiziert.**)*
> **▶ Slice 3 (Doppelrollen, Niveau EK/FK) = ABGENOMMEN (Planer 6, 2026-06-07) ✅.** 6/6 Review-Punkte erfüllt, norm-konform/CL-belegt, EC-09/EC-10 gewahrt. Ein Minor-Finding (UI: „fk" auf echter Bewachungsrolle hebt auf FK — vertretbar, optional UI-Hinweis; kein Re-Bau) in `CODE_REVIEW.md`. URL-Fix `17f94cc` gegengecheckt = harmlos.
> **▶ NÄCHSTER SCHRITT (Mark-Gate):** Mark hat **G4 = ja** (Anlege-Formular-Migration als eigener Slice) + **nächster Bau = Slice 3b** (Tally-Feldlücke) gewählt — Slice 3b ist auf Marks Tally-Arbeit gated. **G4-Slice plant Planer 7.**
> **🐛 EXECUTOR-DONE (2026-06-07): Hydration-Mismatch Firmenname GEFIXT + committet (`01f720b`, Bridge-Doku `b76751f`) ✅.** `companySlug` jetzt SSR-stabil (`useState(DEFAULT_COMPANY_SLUG)`; localStorage erst nach Mount im Bootstrap-`useEffect`). DoD grün: `tsc` 0 · Hydration-Warnung weg nach Firmenwechsel+Reload (Index + `?new=1`) · EC-09-ZIP `POST 200` · Switcher-Persistenz hält.
> **▶ G4-SESSION-STATUS (2026-06-08, Chat-Übergabe wegen vollem Kontext) — HIER WEITERMACHEN:** Mark hat live Slice 3 abgenommen (Browser-Demo Doppelrolle EK funktioniert) + Tally-Entscheid: **In-App-Erfassung, Tally entkoppeln, Slice 3b zurückgestellt, G4 zuerst, Slice 4 danach.** **G4-Bauauftrag = `hq/10_Bridge/CURSOR_G4_AUFTRAG.md`** (Anlege-Formular auf Requirement-Modell migrieren). **Marks G4-Gate-Entscheide (verbindlich):** (a) `roleType` (Engine) **und** `roleId` (Doku-Vorlage) **getrennt** erfassen; (b) **Ziel-Architektur**: Doc-Auswahl wandert in den **Generator-Tab** (Anlege-Formular schlank); (c) **Rollenliste vereinfachen** = Norm-Klassen **EK/FK/Verwaltung/Praktikant/Subunternehmer** primär + Org-Titel als Unterfeld; (d) **Einsatzleitung = FK** (Norm §4.2: Einsatzleitung enthält mind. 1 FK); (e) Alt-Felder „Training Hours" + Freitext-„Role Type" **raus**. Norm-Fundierung (DIN 77200-1 §3.10 EK / §3.11+§4.19.1 FK / §3.12 Einsatzleitung=Funktion) steht im Bauauftrag. **✅ `CURSOR_G4_AUFTRAG.md` = FINALISIERT (v2, 2026-06-08, Hintergrund-Agent)** mit allen Marks-Gate-Entscheiden (a–e) eingearbeitet. **⚠️ Scope-Warnung dokumentiert:** Entscheid (c)+(d)+(e) machen aus G4 mehr als Formular-UI → **Rollenmodell-Refactor** (neues `roleClass`-Feld EK/FK/Verwaltung/Praktikant/Sub als Engine-Input, `roleType`→Org-Titel) + **Daten-Migration** (alte roleType-Strings→roleClass) + **Engine-Umbau** (`requirement-engine.ts` klassifiziert nach `roleClass`) → **berührt die in Slice 3 abgenommene Engine → Engine-Suite muss umgestellt + re-getestet werden** (keine neuen CL/UE, nur Klassifikationsquelle). **Empfohlenes Phasing** (Risiko EC-09): Phase 1 = Modell/Engine/Migration/schlankes Formular (Doc-Auswahl bleibt vorerst); Phase 2 = Doc-Auswahl → Generator-Tab (Ziel-Architektur b). **✅ DREI G4-MINI-GATES ENTSCHIEDEN (Planer 7, 2026-06-08)** — `CURSOR_G4_AUFTRAG.md` jetzt **v3, baufertig (Phase 1)**: (a) Org-Titel = **Dropdown + Freitext-Option**; (b) **nur Einsatzleitung = FK** (DIN 77200), Objekt-/Schichtleitung **bleiben EK**; (c) **getrennt** → dieser Bauauftrag = **Phase 1** (Modell `roleClass` + Migration + Engine-Refactor + Tests + schlankes Anlege-Formular; **Doc-Auswahl bleibt vorerst, wo sie ist** → EC-09 minimal berührt). Phase 2 (Doc-Auswahl→Generator-Tab) = eigener Auftrag nach Phase-1-Abnahme. **▶ NÄCHSTER SCHRITT: Mark gibt „los für G4-Phase-1-Bau" → neuer Executor-Chat auf `main` baut `CURSOR_G4_AUFTRAG.md`.** **EC-09-kritisch:** `roleId`/Doc-Palette darf ZIP-Generator nicht brechen; Engine-Refactor berührt die in Slice 3 abgenommene Engine → Suite-Re-Test Pflicht. Slice 4 (Ampel-/Status, QFD #1) bleibt danach offener Faden.
> **Nachtrag (Executor, 2026-06-07):** kleiner URL-Fix `17f94cc` — „Neue Person" setzt jetzt `?new=1` (Anlege-Ansicht teilbar). **+ FRAGE an Planer geloggt** (unten „Von Cursor an Claude"): Anlege-Formular nutzt noch das **alte Tool-1-Modell**; Migration auf das Requirement-Modell wäre ein eigener Slice (Architektur/Scope → Planer + Mark-Gate, vom Executor NICHT eingeplant).
> **Letzte Commits:** `0d92ff2` (UE-Anzeige + Findings F1–F5) · `e81ca2c` (Planer-3-Prompt) · `47dcea1` (Planer-2-Review) · `22e0c7c` (Slice 2)
> **✅ Planer 3: kombinierter Diff `22e0c7c..0d92ff2` FINAL ABGENOMMEN** (`CODE_REVIEW.md`, oben). UE-Anzeige (Variante C, `t.hint`/CL-27/Asyl-64 jetzt gerendert) + Findings F1–F5 norm-konform & CL-belegt. Unabhängig re-verifiziert: **`tsc` 0 · Engine-Suite 13/13 grün**. **Slice 2 komplett abgeschlossen.**
> **✅ HETZNER-DEPLOY LIVE (2026-06-07).** App läuft öffentlich unter **https://cos.cert-expert.de** (HTTPS/Let's Encrypt, HTTP→HTTPS-Redirect). Deploy von Planer 4 **auf Marks Anweisung** durchgeführt (Server-Ops, **kein Produktivcode geändert** — deployter Commit `404d55d`). Server: Hetzner `cert-expert-01` / **167.233.63.98** (Ubuntu 26.04, Node 24, nginx, systemd-Unit `certification-os` auf :3001). **Tally-Webhook live umgestellt + end-to-end verifiziert:** echte Test-Submission (`responseId Eq16BYX`, 145 Felder) → Signatur OK → Akte „Test Person" erstellt. DB-Backup-Cron (täglich 3 Uhr, 14 Tage) aktiv. **EC-09-ZIP live verifiziert** (echter Klick ELC Security and Service: `POST /employee-automation` 200, ~135 KB ZIP, keine 5xx). **Live-Facts + Redeploy-Schritte:** `HETZNER_DEPLOY.md` (Abschnitt „LIVE-STAND") + Post-Deploy-Review in `CODE_REVIEW.md`. **Offen (nice-to-have):** Test-Akte ggf. löschen; Tally-API-Key rotieren (401, Tech-Debt); systemd-User härten.
> **Form:** https://tally.so/r/vGNvY0 · **Aufgaben:** `10_Bridge/AUFGABEN.md`

### ▶ Copy-Paste-Prompt für Planer 6 (REVIEW-Chat)
> **⚠️ Dies ist DEINE Arbeitsanweisung — kein Entwurf zum Kommentieren/Verbessern. Beginne sofort mit der Arbeit; frage nur bei echten Gate-Entscheidungen (Mark) zurück. Schreibe den Prompt NICHT um.**
>
> Du bist **Planer 6** — Nachfolger von Planer 5 (Code-Track, Spur P: Planer/Reviewer, **kein Produktivcode**). Lies zuerst `CLAUDE.md` (Rules) + `hq/10_Bridge/HANDOFF.md` (Box „▶ HIER STARTEN" + Executor-Ergebnis-Eintrag „Slice 3 Doppelrollen `a276d38`" + Executor-FRAGE „Anlege-Formular-Migration") + `hq/10_Bridge/CURSOR_SLICE3_AUFTRAG.md` (der Bauauftrag, gegen den du reviewst) + `CODE_REVIEW.md` (oberste Einträge). Koordination nur über Bridge-Dateien.
>
> **Deine Aufgabe = Slice 3 (Doppelrollen) REVIEWEN** — Diff `0680ca2..a276d38` (Feat) gegen `CURSOR_SLICE3_AUFTRAG.md` + `NORM_MATRIX_…v2` + `NORM_KLAUSEL_REGISTER_v1`. Befund nach `CODE_REVIEW.md` (neuer Eintrag oben) + Abschluss-Eintrag im HANDOFF.
> **Konkrete Review-Punkte (jede Norm-Regel CL-belegt):**
> 1. **Niveau-Modell:** `zusatzBewachungNiveau` „ek"/„fk" korrekt verdrahtet? Effektive `bewachung`/`fuehrung` greift in **allen** Gates (A-Set, C-SDL-Soll, E-Weiterbildung, Fristen)?
> 2. **EK vs. FK:** EK → CL-21/CL-24 (16/40 UE), FK → CL-20/CL-25 (24/64 = 40+24 UE). FK baut auf EK-Basis auf (Asyl).
> 3. **CL-10-Gate:** FK-Quali-Posten nur bei **DIN-SDL** (`din1-*`/`din2-*`), „fachlich prüfen" — für **beide** FK-Wege. Slice-2-Präzisierung (FK ohne SDL → kein CL-10) korrekt umgesetzt + getestet?
> 4. **Reduktion unterdrückt:** Verwaltung/Praktikant + Doppelrolle → kein widersprüchliches `v-34a-na`/`p-reduziert` neben `q-34a`?
> 5. **Keine erfundene Pflicht / EC-10:** keine neuen CL-IDs, keine neuen UE-Werte; keine Freigabe-/Auditfähigkeitsaussage.
> 6. **Repository (5 Mapping-Stellen)** vollständig — Feld geht über Save/Load/Migration nicht verloren.
> **Unabhängig re-verifizieren** (nicht nur Executor-Meldung): `tsc --noEmit` = 0, Engine-Suite (`tsx --test`) **20/20** grün; EC-09 + Doppelrolle-Browser = etabliertes Builder-Browser-Muster übernehmen.
> **Mitnehmen (kein eigener Bau):** kleiner URL-Fix `17f94cc` (nur `?new=1`-Spiegelung — Planer 5 hat ihn als harmlos eingestuft, kurz gegenchecken).
> **Danach (Scope/Planung, NICHT Review):** Executor-FRAGE „**Anlege-Formular auf neues Requirement-Modell migrieren?**" (Legacy `EmployeeForm.tsx`/Tool-1-Modell vs. neues Akte-Modell) als **eigenen Slice** mit Mark abwägen. Plus offene Fäden: **Slice 3b** (Tally-Formular-Feldlücke, gated auf Marks Tally-Arbeit), **Slice 4** (Ampel-/Status-Ansicht, QFD #1), DEKRA (CL-60–62), Legal-Input (CL-70–73), Ist-UE-Auto-Summe.
>
> **Guardrails:** EC-09 (Generator/ZIP nie brechen), EC-10 (kein Freigabe-/Auditfähigkeitsstatus), keine erfundene Normpflicht (jede Regel `clauseId`). Verifikation im echten Browser, nicht per Skript. Mark = Gate. Nach stabilem Punkt: Übergabe-Takt + Abschluss-Eintrag.

---

## 🔚 ABSCHLUSS-EINTRAG — Planer: Queue C (Termin-Planung, lücken-getrieben) — Bauauftrag baufertig + Bot gestartet, 2026-06-08

**Rolle:** Planer/Reviewer (Spur P, kein Produktivcode). Aufgabe: den C-Bauauftrag (Termin-Planung, gap-driven nach `CURSOR_SCHULUNGSKATALOG_PLANUNG.md` §9) schreiben und den Bot dafür starten.

**Fertig (nur Bridge-Doku, kein Code):**
- **`CURSOR_C_TERMINPLANUNG_AUFTRAG.md`** geschrieben — baufertig. Kern: C ist **lücken-getrieben**, nicht nur „Datum setzen": Soll−Ist−Lücke je Person sichtbar + gezielte Modul-Zuweisung (DIN-1-Lehrbausteine §3) zum Lücke-Schließen, je mit Datum (Bulk + Override) + eigenem Nachweis-Slot, speist die Ampel (geplant/überfällig/Nachweis) operativ.
- **Norm-Leitplanken gegen Cross-Check verdrahtet:** Soll bleibt **CL-11 (40/24)**; Module = **Lehrbausteine, kein Norm-Soll** (Cross-Check §2.1); **kein Auto-Ist** (Ist-UE-Auto-Summe ist geparkt = Queue E); ÖPV/Veranstaltung-FK-Konflikte **nicht** angefasst (C ist UE-neutral); EC-09/EC-10 hart.
- **Architektur-Entscheide (Planer, gegen Code verifiziert):** neues `trainingPlan: Json?`-Feld nach `einmaligIstUE`-Muster (SQLite-P2023-sicher, alle 4 Repo-Mapping-Stellen + Read-Normalisierung); Engine **unberührt**; Plan→Ampel via Daten-Merge an der Aufrufstelle (kein `compliance-status.ts`-Logikeingriff); Nachweis-Slot über bestehende Evidence-Infra (`evidenceId = training-plan:{id}`, kein neues Storage-Modell).
- HANDOFF HIER-STARTEN + `CURSOR_NAECHSTE_QUEUE.md` (C-Abschnitt) auf „Bauauftrag steht + Bot gestartet" gekippt.

**Verdict:** **C ist baufertig.** Kein offenes Planer-Gate für C (UE-neutral → Cross-Check blockiert nicht). Bot baut autonom.

**Offen / nächster Schritt:**
1. **Bot:** baut `CURSOR_C_TERMINPLANUNG_AUFTRAG.md` (§3–§7), hält §8-DoD (tsc 0 / neue + bestehende Suiten grün / EC-09-ZIP 200 / Persistenz + Ampel im Browser / Engine+UE unverändert), committet, hängt Ergebnis-Eintrag an.
2. **Planer (nach Bau):** C-Review (besonders: Engine/UE wirklich unberührt? Repository-Mapping vollständig? Ampel-Merge EC-10-konform?).
3. **Danach:** D (Modell-Trennung Bestellung/Schulung/Unterweisung + Brandschutz-Regel) — erst nach Mark-Klärung der Cross-Check-Norm-Fragen (§4: Veranstaltung-FK 16/24, ÖPV-CL, Modul-Bestätigung).

**Commit-Basis:** Produktivcode unverändert (`e1899dd`). Diese Session = nur Bridge-Doku (`CURSOR_C_TERMINPLANUNG_AUFTRAG.md`, `HANDOFF.md`, `CURSOR_NAECHSTE_QUEUE.md`).

✅ **Stabiler Punkt** — C-Bauauftrag steht, Bot läuft; guter Zeitpunkt für Bridge-Doku-Commit. Warten auf Bot-Ergebnis, dann Planer-Review.

---

## 🔚 ABSCHLUSS-EINTRAG — Planer 7: G4 — drei Mini-Gates entschieden, Bauauftrag v3 baufertig (Phase 1), 2026-06-08

**Rolle:** Planer/Reviewer (Spur P, kein Produktivcode). Aufgabe: die drei offenen §7-Mini-Gates des G4-Bauauftrags mit Mark klären und den Auftrag baufertig machen.

**Mark-Entscheide (verbindlich, mit Norm-Stütze):**
- **a) Org-Titel-Feld → Dropdown + Freitext-Option.** Festes Dropdown (bekannte Titel, je mit Default→Norm-Klasse) **+** „andere (Freitext)". Norm-Klasse bleibt maßgeblicher Engine-Input.
- **b) Objektleitung/Schichtleitung → bleiben EK.** Mark: „nur Einsatzleitung = FK nach DIN 77200." Default-Mapping: Einsatzleitung→`fk`, Objekt-/Schichtleitung→`ek`. **Keine titelgebundene FK-Quali-Pflicht erfunden** (FK hängt an §4.19.1-Quali; §3.12/§4.2 stützt nur Einsatzleitung=FK) → „keine erfundene Pflicht" gewahrt.
- **c) Phasen-Schnitt → getrennt.** Dieser Bauauftrag = **Phase 1** (Datenmodell `roleClass` + Migration + Engine-Refactor + Tests + schlankes Anlege-Formular; Doc-Auswahl bleibt vorerst, wo sie ist → EC-09 minimal berührt). **Phase 2** (Doc-Auswahl→Generator-Tab) = eigener Auftrag nach Phase-1-Abnahme.

**Fertig (nur Bridge-Doku, kein Code):**
- `CURSOR_G4_AUFTRAG.md` auf **v3** gehoben: §7 von „offen" → „entschieden"; §0/§3/§4.4/§4.5/§6/§9 phasen- und gate-konsistent (Phase 1 = Erfassung, Doc-Auswahl bleibt; Phase 2 markiert). EC-09-DoD auf Phase 1 präzisiert.
- HANDOFF HIER-STARTEN-Box: Gate-Status gekippt + nächster Schritt = Marks „los für G4-Phase-1-Bau".

**Verdict:** **G4-Phase 1 ist baufertig.** Kein offenes Planer-Gate mehr für Phase 1.

**Offen / nächster Schritt:**
1. **Mark-Gate:** „los für G4-Phase-1-Bau" → neuer **Executor-Chat** auf `main` liest `CLAUDE.md` + HANDOFF (HIER STARTEN) + `CURSOR_G4_AUFTRAG.md`, baut Phase 1, hält `tsc`/Engine-Suite/EC-09 grün, committet mit Marks OK.
2. **Planer (nach Bau):** G4-Phase-1-Review (Engine-Refactor + Migration besonders prüfen, Suite-Re-Test ggü. Slice 3).
3. **Danach:** G4-Phase 2 planen (Doc-Auswahl→Generator-Tab); offene Fäden Slice 4 (Ampel/Status), DEKRA (CL-60–62), Legal-Input (CL-70–73).

**Commit-Basis:** Produktivcode unverändert (`01f720b`). Diese Session = nur Bridge-Doku (`CURSOR_G4_AUFTRAG.md`, `HANDOFF.md`).

✅ **Stabiler Punkt** — Gates geklärt, Bauauftrag v3 baufertig; guter Zeitpunkt für Bridge-Doku-Commit / Übergabe an Executor-Chat. Warten auf Marks „los für den Bau".

---

## 🔚 ABSCHLUSS-EINTRAG — Planer 6: Slice-3-Abnahme (Doppelrollen, Niveau EK/FK), 2026-06-07

**Rolle:** Planer/Reviewer (kein Produktivcode). Review des Feat-Diffs `0680ca2..a276d38` gegen `CURSOR_SLICE3_AUFTRAG.md` + Norm-Matrix v2 + Klausel-Register.

**Fertig (alles in Bridge-Dateien, kein Code geändert):**
- **Slice 3 ABGENOMMEN** → `CODE_REVIEW.md` (neuer Eintrag oben). Verdict: grün, alle **6 Review-Punkte** erfüllt, CL-belegt.
  1. Niveau-Modell in **allen** Gates verdrahtet (A-Set/C-SDL/E-Weiterbildung/Fristen nutzen effektive `bewachung`+`fuehrung`). 2. EK→CL-21/24 (16/40), FK→CL-20/25 (24/64), FK baut auf EK-Basis auf. 3. CL-10 nur bei DIN-SDL für beide FK-Wege (D7), Slice-2-Präzisierung umgesetzt+getestet. 4. Verwaltungs-/Praktikanten-Reduktion bei Doppelrolle unterdrückt (kein Widerspruch zu q-34a). 5. Keine neue CL/UE, EC-10 gewahrt, Invariante grün. 6. Repository 5 Mapping-Stellen + Read-Normalisierung (`asNiveau`), Schema `String?` SQLite-sicher.
- **Unabhängig re-verifiziert** (read-only, nicht nur Executor-Meldung): **`tsc --noEmit` = 0**, **Engine-Suite `tsx --test` = 20/20 grün** (13 alt + 7 neu D1–D7 + Invariante). EC-09 + Doppelrolle-Browser = Executor-Verifikation nach etabliertem Muster übernommen.
- **URL-Fix `17f94cc` gegengecheckt** = harmlos (`?new=1`-Spiegelung, beim Laden in Z. 235/256 ausgewertet; keine Engine-/Architekturänderung).

**Minor-Finding (kein Blocker, Beobachtung):** „No-op für echte Bewachungsrollen" (Auftrag §6) gilt nur für „ek"; bei einer EK-Rolle (SMA) + „fk" wird auf FK-Niveau gehoben — fachlich vertretbar (bewusste FK-Wahl), bricht keine Norm/Guardrail. Optionaler UI-Hinweis/Ausblenden, **kein Re-Bau**. Detail in `CODE_REVIEW.md`.

**Verdict:** **Slice 3 abgeschlossen.** Keine Blocker, keine offenen Code-Tasks aus Slice 3.

**Offen / nächster Schritt:**
1. **Mark-Gate G4:** Anlege-Formular-Migration als eigener Slice? (s. „Offene Entscheidungen für Mark"). 
2. **Planer 7 (nach Marks Richtungsentscheid):** Slice 3b (Tally-Feldlücke, gated auf Marks Tally-Arbeit) **oder** Slice 4 (Ampel-/Status-Ansicht, QFD #1) planen.
3. Offene Fäden: DEKRA (CL-60–62), Legal-Input (CL-70–73), Ist-UE-Auto-Summe.

**Commit-Basis:** Produktivcode unverändert `a276d38` (+ `17f94cc` URL-Fix). Diese Session = nur Bridge-Doku (`CODE_REVIEW.md`, `HANDOFF.md`).

✅ **Stabiler Punkt** — Slice 3 abgenommen; guter Zeitpunkt für Bridge-Doku-Commit / Übergabe (neuer Chat). **Übergabe empfohlen** nach Marks G4-Entscheid.

---

## 🔚 ABSCHLUSS-EINTRAG — Planer 4: Pre-Deploy-Abnahme + Hetzner-Deploy LIVE, 2026-06-07

**Rolle:** Planer/Reviewer (kein Produktivcode). Review des Executor-Pre-Deploy-Ergebnisses gegen `CURSOR_HETZNER_PREDEPLOY_AUFTRAG.md`.

**Fertig (alles in Bridge-Dateien, kein Code geändert):**
- **Pre-Deploy-Gates ABGENOMMEN** → `CODE_REVIEW.md` (neuer Eintrag oben). Verdict: grün, **Mark kann deployen**.
- **3 von 4 Gates unabhängig re-verifiziert** (read-only, nicht nur Builder-Meldung):
  - **`next build` selbst gefahren** → **Exit 0**, „Compiled successfully" + „Running TypeScript" ohne Fehler, alle 15 Seiten/Routen generiert. `next.config.ts` ohne `ignoreDuringBuilds`/`ignoreBuildErrors` → echter Gate.
  - **`.env.example` vs. alle `process.env.*`-Reads** gegengecheckt → vollständig. Befund (kein Blocker): `TALLY_API_KEY` dokumentiert, aber aktuell nirgends per `process.env` gelesen — harmloser Überschuss.
  - **DB-Pfad Filesystem-Check** → genau **ein** File `prisma/prisma/dev.db`, kein zweites `prisma/dev.db`.
- **EC-09-Prod-ZIP** = Builder-Browser-Verifikation (200 / `PK`-ZIP-Magic / 132,8 KB / EC-10-Disclaimer) — nach etabliertem Muster (Planer 3 ↔ Builder 2) übernommen.

**Verdict:** **Pre-Deploy abgeschlossen.** Keine Blocker, kein Code-Commit nötig.

**▶ DANACH (selbe Session): Hetzner-Deploy LIVE durchgeführt** (Planer 4 auf Marks ausdrückliche Anweisung „kannst du das machen / führ mich durch"). Server-Ops, **kein Produktivcode geändert** — deployter Stand = Commit `404d55d` (origin/main). Schritte:
- **Server eingerichtet:** Hetzner `cert-expert-01` (167.233.63.98, Ubuntu 26.04). Node 24 LTS + npm + nginx 1.28 + certbot 4.0 installiert. ufw (22/80/443). SSH-Key-Login (Marks Mac → Server) + GitHub-**Deploy-Key** (read-only) für privates Repo `derbrocken/cert-expert-ai`.
- **App ausgerollt:** Repo nach `/opt/cert-expert-ai` geklont; `.env.production.local` (chmod 600, alle Keys aus Dev-`.env.local`, `DATABASE_URL=file:./prisma/dev.db`, `NODE_ENV=production`); `npm ci`; `db:push` (explizit `DATABASE_URL`, da Prisma-CLI `.env` liest) → DB unter `prisma/prisma/dev.db` (kanonisch, kein zweites File); `npm run build` = Exit 0.
- **Dauerbetrieb:** systemd-Unit `certification-os` (User root — Härtung auf non-root = Tech-Debt) auf :3001, `enable --now`; nginx-Reverse-Proxy + **certbot HTTPS** (`cos.cert-expert.de`, Zert. bis 2026-09-05, Auto-Renew) + HTTP→HTTPS-Redirect. DB-Backup-Cron (`/usr/local/bin/cos-backup.sh`, täglich 3 Uhr, 14 Tage Retention).
- **DNS (Mark/IONOS):** A `cos` → 167.233.63.98 (IONOS-Parkseite + AAAA deaktiviert; propagiert).
- **Tally-Webhook (Mark/Tally-UI):** bestehenden App-Webhook auf `https://cos.cert-expert.de/api/webhooks/tally` umgestellt (Signing Secret unverändert). **End-to-end verifiziert:** echte Submission `responseId Eq16BYX` (145 Felder) → `[POST /api/webhooks/tally] Accepted` → Signatur OK → Akte „Test Person"/SMA erstellt (`tally-Eq16BYX-emp-1`, Firma „Test Deploy" → Legacy-Pool, kein Slug = erwartet).

**Live-Verifikation:** `https://cos.cert-expert.de/` + `/employee-automation` = HTTP 200; HTTP→HTTPS 301; Webhook-Endpoint lehnt GET mit 405 ab (POST-only, kein 502). Webhook-Intake real grün. **EC-09-ZIP live verifiziert** (echter Klick, ELC Security and Service: `POST /employee-automation` 200, Body ~135 KB ZIP, keine 5xx im nginx-Log). **UX-Beobachtung Mark:** Anlege-Maske schlank — Slice-2-Felder (SDL/Dienstfahrzeug/Fristen/UE) erscheinen erst in der Akte/Dossier, nicht im Create-Form (by design, deckt sich mit Formular-Feldlücke).

**Offen / nächster Schritt:**
1. **Tally-API-Key rotieren** (REST-Key gibt 401 — Webhook-Verwaltung lief über Tally-UI; Tech-Debt aus CLAUDE.md). Test-Akte „Test Person" ggf. löschen. systemd-User auf non-root härten (Tech-Debt).
2. **Slice 3 (Planer 5, nach Marks „weiter"):** Doppelrollen-Modellierung **+ Formular-Feldlücke** (s. Planer-4-Finding „Von Claude an Cursor", C-Empfehlung) gegen Norm-Matrix v2 + Klausel-Register, jede Regel `clauseId`, Bauauftrag nach Bridge.

**Commit-Basis:** Produktivcode unverändert `404d55d`/`0d92ff2`. Diese Session = Bridge-Doku (`CODE_REVIEW.md`, `HANDOFF.md`, `HETZNER_DEPLOY.md`) + Server-Setup. **DSGVO:** `.env.production.local` nur auf Server (nicht im Git); `.env.local` bleibt gitignored.

✅ **Stabiler Punkt** — App ist live unter HTTPS, Webhook end-to-end grün; guter Zeitpunkt für Bridge-Doku-Commit / Übergabe (neuer Chat).

---

## 🔚 ABSCHLUSS-EINTRAG — Planer 3: Slice-2-Final-Abnahme (kombinierter Diff), 2026-06-07

**Rolle:** Planer/Reviewer (kein Produktivcode). Review des kombinierten Builder-2-Diffs.

**Fertig (alles in Bridge-Dateien, kein Code geändert):**
- **Kombinierten Diff `git diff 22e0c7c 0d92ff2` final abgenommen** → `CODE_REVIEW.md` (neuer Eintrag oben, „Final-Abnahme"). Beide Teile (UE-Anzeige Variante C + Findings F1–F5) in einem Review. Kein separater UE-Commit gesucht (gibt es nicht).
- **Offener Pre-Commit-Punkt (Planer 2) geschlossen:** `t.hint` wird jetzt gerendert (`EmployeeFileTrainingTargets.tsx`). Dadurch erscheinen **CL-27-Anrechnungszeile** (Engine-Hint auf `jahres-weiterbildung`/CL-11, Z. 629) **und** Asyl-„Gesamt 64 UE"-Hinweis (`sdl-asyl-fk`/CL-25). Bestätigt.
- **Findings F1–F5 gegen Norm-Matrix v2 + Klausel-Register geprüft — jede `clauseId` belegt:** F1 §34a-Unterrichtung→`unvollständig` (Matrix §2 „gelb+Frist"); F2 Presenter-Dedup nach `clauseId` (Engine unverändert, `null` nie dedupt, nur CL-08/CL-23-Kollisionen = gleiches Thema); F3 SDL-UE-Soll an `bewachung` gegatet (Brandschutz-Pflichtnachweis bleibt ungated) + Doppelrollen-Kommentar drin; F4 nur „Führungskraft"=FK 24 UE/EL·OL·SL=EK 16 UE (Matrix §5.3/5.4 + §8.3/8.4), bleiben Bewachung — Mark-Variante-B, Gate-konform; F5 Asyl-Label rollen-neutral.
- **F4 roleType-String-Matching gegengecheckt** (nicht neu aufgerollt): gespeicherte `roleType` aus `ROLLE_TYPE_OPTIONS` matcht Engine-Sets; `GRUNDROLLE_CATALOG` nur Anzeige → kein Write-Path-Bug (wie Builder 2 gemeldet).
- **Unabhängig re-verifiziert** (read-only, nicht nur Builder-Meldung): **`tsc --noEmit` = 0 Fehler**, **Engine-Suite `tsx --test` = 13/13 grün** (inkl. neue Szenarien 3c/4c/5b + Invariante). EC-09-ZIP + F4-live = Builder-2-Browser-Verifikation.

**Verdict:** **Slice 2 komplett abgeschlossen.** Keine Blocker, keine offenen Code-Tasks aus Slice 2.

**Danach (selbe Session): Mark gab „los" für Hetzner-Deploy** → Pre-Deploy als Bauauftrag gerahmt:
- **`CURSOR_HETZNER_PREDEPLOY_AUFTRAG.md`** geschrieben (Executor-Gates: `next build` grün · EC-09-Prod-Smoke · Env-Check · `db:push`-Trockencheck). Keine Architektur drin — vom Planer entschieden.
- **DB-Doppelpfad faktisch geklärt + entschieden:** nur eine DB (`prisma/prisma/dev.db`), kanonisch so belassen; Vereinheitlichung = eigener Slice. **`HETZNER_DEPLOY.md` Doku-Bugs gefixt** (Env-Tabelle nannte `file:./dev.db`, Backup zeigte auf `prisma/dev.db` — beides falsch).
- **Build-Gate verifiziert:** `next.config.ts` ohne `eslint.ignoreDuringBuilds` → `next build` ist der echte Gate.

**Offen / nächster Schritt:**
1. **Executor/Builder:** `CURSOR_HETZNER_PREDEPLOY_AUFTRAG.md` bauen (Gates grün, Ergebnis in HANDOFF).
2. **Mark (Server):** nach grünen Gates deployen (DNS/systemd/nginx/Webhook-PATCH/Backup) — Runbook `HETZNER_DEPLOY.md`.
3. **Planer 4:** Pre-Deploy-Ergebnis reviewen; Slice 3 (Doppelrollen) parkt bis nach Deploy.

**Commit-Basis:** unverändert `0d92ff2` — diese Session = nur Bridge-Doku (`CODE_REVIEW.md`, `HANDOFF.md`, `HETZNER_DEPLOY.md`, neuer `CURSOR_HETZNER_PREDEPLOY_AUFTRAG.md`), kein Produktivcode.

✅ **Stabiler Punkt** — Slice 2 abgeschlossen + Deploy-Bauauftrag steht; guter Zeitpunkt für Bridge-Doku-Commit / Übergabe (neuer Chat). **Übergabe empfohlen.**

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

### 2026-06-08 — ✅ Executor: Queue C — lücken-getriebene Termin-Planung Schulungen FERTIG + COMMITTET (`fbe1980`)

**Gebaut (exakt nach `CURSOR_C_TERMINPLANUNG_AUFTRAG.md` §3–§7, kein Scope-Zusatz):**
- **§3 Datenmodell:** `trainingPlan Json?` am `EmployeeFile` (Prisma) + `TrainingPlanItem`-Typ (`types/employee.ts`). Repository liest/schreibt tolerant (`asTrainingPlan` normalisiert; Bestandsakten ohne Feld → `[]`, **kein P2023**) an allen 4 Write-Stellen.
- **§4 `training-catalog.ts`:** DIN-1-Module als **Lehrbausteine** (CL-11, UE rein informativ — **kein eigener Norm-UE/Soll**). `findCatalogModule`-Helper.
- **§5 `training-plan.ts`:** Gap-Logik `computeTrainingGaps` (Soll−Ist=Rest, nie negativ, null→null), `derivePlanItemStatus` (nachweis-vorhanden > ueberfaellig > geplant > ohne-datum), `planStatusToWorkingItemStatus`, `planEvidenceId` (`training-plan:{id}`), `buildPlanDeadlineRows`. **+ `training-plan.test.ts` 12/12 grün.**
- **§6 Plan→Ampel operativ:** Plan-Fristen in DossierView **und** read-only Übersicht in `summary.fristen` gemergt → Ampel reagiert. **Engine/UE/Pflicht-Set unberührt** (kein Import-/Logik-Eingriff in `requirement-engine.ts`).
- **§7 UI `EmployeeFileTrainingPlan.tsx`:** gap-getrieben (Lücke je Soll-Posten), Zuweisung Katalog-Modul + Soll-Posten, **Bulk-Datum + Einzel-Override**, **Nachweis-Slot je Eintrag** über bestehende Evidence-Infra (Upload/Entfernen, `evidenceId=training-plan:{id}`). Read-only-Modus ohne `onSave` (Inputs disabled).

**Gates (DoD §8):**
- `tsc --noEmit` = **0**.
- Tests: training-plan **12/12** · requirement-engine **27/27** · compliance-status **10/10** (alle via `npx tsx --test`).
- **Browser :3001 verifiziert** (Wolf Street / Peter BOnd): Katalog-Modul + Soll-Posten zuweisen, Einzel-Override → „geplant", Bulk-Datum „Datum für alle" → beide „geplant", Vergangenheitsdatum → „überfällig" + Ampel „Nächste Frist/Überfällig" rot. **Persistenz über Reload erhalten** (`trainingPlan` in DB). Read-only Übersicht zeigt Plan + Lücke + Status (Inputs disabled), Ampel identisch, EC-10-Disclaimer da.
- **EC-09-Smoke:** realer „ZIP exportieren"-Klick → `POST /employee-automation` **200** (~800 ms echte Generierung, kein 5xx). Generator-Code unangetastet.
- Prisma `generate` + `db push` mit `DATABASE_URL=file:./prisma/dev.db`. **DB nicht committet.**
- Commit `fbe1980` = genau 10 Dateien (8 Code + `prisma/schema.prisma` + `types/employee.ts`); **kein** `.env`/`.db`/`hq/03_Kundenprojekte/**`.

**1 Verifikations-Hinweis (kein Defekt, kein geparkter Scope):** Der **Nachweis-Upload-Klick** öffnet einen **OS-Dateidialog**, der vom Browser-Automations-Harness nicht bedienbar ist (Input/File-Input-CDP gesperrt). Die „Nachweis-vorhanden → grün"-Logik ist **unit-getestet** (`derivePlanItemStatus` + Mapping) und nutzt die **identische, in früheren Slices browser-verifizierte Evidence-Infra** (gleiche S3-Action, nur `evidenceId`-Konvention neu). Slot/Buttons live sichtbar + verdrahtet. Falls Mark eine Live-Klick-Abnahme des Uploads will → manuell oder anderes Harness.

**Geparkt (Norm/Scope):** nichts — §3–§7 vollständig, keine Norm-Zweifel aufgetreten.

### 2026-06-08 — ✅ Executor: Read-only Akte-/Vorzeige-Übersicht (Queue B / Pt 1) FERTIG + COMMITTET (`ae477e8`)

**Fertig (exakt nach `CURSOR_UEBERSICHT_READONLY_AUFTRAG.md`, kein Scope-Zusatz, 2 Code-Dateien):**
- **Neu `EmployeeFileOverview.tsx`** (read-only): ruft `getEmployeeFileSummary(...)` **exakt wie DossierView** (Single Source of Truth, keine Parallel-/Neuberechnung). Rendert Kopf (Name/Org-Titel/Norm-Klassen via `resolveRoleClasses` + `BEWACHUNG/NICHT_BEWACHUNG_CLASS_OPTIONS`-Labels, Kennzahlen) + `EmployeeFilePflichtStatusPanel` (Ampel, unverändert wiederverwendet) + Pflicht-Set/Person&Rolle/Pflichtnachweise/Schulung/Geltungsbereich/Fristen/offene Punkte als read-only `RequirementTable` + UE-Soll/Ist via `EmployeeFileTrainingTargets` **ohne `onSave`** (Ist-Inputs `disabled+readonly`) + EC-10-Footer. **Keine** Stifte/Upload/Edit-Felder.
- **`RequirementTable`/`ClauseBadge` lokal dupliziert** (DossierView exportiert sie nicht; reine Präsentation, keine Logikänderung — Park-Option §5 gewählt).
- **Toggle „Bearbeiten ↔ Übersicht"** in `EmployeeAutomationPage.tsx` an der Akte-Render-Stelle. Default = Bearbeiten (kein Verhaltensbruch). State `useState("bearbeiten")` SSR-stabil, **kein** localStorage im ersten Render (Hydration-Lehre `01f720b`).

**Leitplanken gewahrt:** KEINE Engine-/Norm-/UE-Datei geändert (nur 2 Präsentations-Dateien). EC-09 Generator/ZIP unberührt. EC-10-Disclaimer „rechnerisch · kein Freigabestatus" + Footer sichtbar. Keine neue CL — Werte 1:1 aus der Summary.

**Gate (alles grün, echter Browser :3001):** `tsc --noEmit` = **0** · Engine-Suite `tsx --test requirement-engine.test.ts` = **27/27** (unverändert) · **EC-09-ZIP** `POST /employee-automation` **200**, Body 355 KB enthält `UEsDBA` (base64 `PK`-ZIP-Magic), kein 5xx · **Browser-Akzeptanz** (Wolf Street / Peter BOnd, EK-Bewachung): Toggle schaltet; Übersicht zeigt Ampel + Pflicht-Set (CL-01/03/04/05/06/08) + Schulungs-Soll (CL-11, Soll 40 UE, Ist-Input disabled/readonly) + Fristen + offene Punkte; keine Edit-Affordances; Werte identisch zur Bearbeiten-Ansicht (gleiche Summary).

**Commit:** `ae477e8` (2 Code-Dateien, enge Pathspecs — **kein** `.env`/`.db`/`hq/03_Kundenprojekte/**`). Bridge-Doku separat.

**Offen / geparkt:** nichts geparkt — Auftrag Pt 1 vollständig. Nicht gepusht (Mark pusht selbst).

### 2026-06-08 — Executor: Queue-Punkt 2 (G4 Phase 2) re-verifiziert + 3 (Regression Trainings-Übersicht) diagnostiziert — KEIN Code-Bau

**(2) G4-Phase-2-Delta — unabhängig am aktuellen HEAD (`e1899dd`) re-verifiziert → Ziel bereits erfüllt, bleibt geparkt (kein Bau).** `EmployeeAutomationPage.tsx`: Anlege-Formular = `displayMode="master"` (Z. 559, keine Doc-Chips), Generator-Tab = `displayMode="documents"` (Z. 624, rendert die Doc-Chips). `EmployeeForm.tsx`: `showDocuments = displayMode "full"|"documents"` (Z. 393). → **Doc-Auswahl liegt bereits im Generator-Tab** (Gate b erfüllt, deckt sich mit dem Park-Befund in `CURSOR_G4_PHASE2_AUFTRAG.md` §2). **Offene Frage an Mark bleibt** (§3 dort, A/B/C/D): welches konkrete Rest-Delta? Ohne bestätigtes, reviewtes Ziel **kein Umbau am EC-09-kritischen Generator** (Run-Order-Parken-Regel + Scope-Guardrail).

**(3) Regression „grüne UE-Soll/Ist-Übersicht" — diagnostiziert: KEINE Rendering-/Sichtbarkeits-Regression. Kein versehentliches Verdecken durch G4/Slice 4.** Belege:
- `EmployeeFileTrainingTargets.tsx` (grün „rechnerisch erreicht" bei Ist ≥ Soll) ist unverändert vorhanden; in `EmployeeFileDossierView.tsx` Z. 462 weiterhin gerendert, sobald `schulungsSoll.length > 0`.
- Diff-Check: **G4 (`047878c`) fasst DossierView nicht an**; **Slice 4 (`2261d26`) ist rein additiv** (fügt `EmployeeFilePflichtStatusPanel`/Ampel oberhalb ein, entfernt/verschiebt/verdeckt die Trainings-Übersicht NICHT).
- **Live verifiziert (:3001):** bei einer EK/FK-Person rendert die grüne Schulungs-Soll-Karte korrekt (Jahres-Weiterbildung CL-11, Soll/Ist/Rest, Balken).
- **Ursache der „weg"-Wahrnehmung = Klassifikation, nicht Rendering:** Das `jahres-weiterbildung`-Soll (CL-11) wird nur bei `bewachung` (EK/FK/Subunternehmer) erzeugt (Slice-2-Finding F3, gewollt). Personen ohne Bewachungs-Klasse zeigen die Karte nicht — das war **vor** G4 genauso. DB-Stichprobe: EK/FK-Personen (Peter BOnd, joe, Felix=fk, blubermann) → Karte sichtbar; Legacy-Personen ganz **ohne Rolle** (Markus Mahatma, peter Marquardt → `roleType`/`roleClass`/`roleClasses` leer) → keine Karte (kein Bewachungs-Basis-Set, unverändert).
- **⚠️ Bewusst NICHT geändert:** Die Sichtbarkeit „aufzudrehen" hieße, das `bewachung`-Gate / die UE-Norm-Logik zu ändern — laut Auftrag verboten („KEINE UE-Werte/Norm-Logik ändern. Nur Rendering/Sichtbarkeit."). Da es **kein** Rendering-Defekt ist, gibt es nichts zu „reparieren", ohne Norm-Logik zu berühren.
- **❓ Frage/Empfehlung an Mark/Planer:** Bei welcher **konkreten Person** ist die Karte „weg"? Falls eine Person sie zeigen *soll*, ist sie ohne Bewachungs-Klasse erfasst → **Norm-Klasse EK/FK setzen** (jetzt per neuer Mehrfachauswahl trivial). Soll die Karte künftig auch für Nicht-Bewachungs-Rollen erscheinen, ist das eine **Norm-Logik-Entscheidung** (Cross-Check §4 / Planer-Gate), kein Executor-Rendering-Fix.

### 2026-06-08 — ✅ Executor: EK/FK-Refinement FERTIG + COMMITTET + GEPUSHT (`e1899dd`)

**Fertig (Queue-Punkt 1, `CURSOR_EKFK_REFINEMENT_AUFTRAG.md`):** Norm-Klasse = **Mehrfachauswahl** (`roleClasses: RoleClass[]`, Prisma `Json?`). EK + FK frei kombinierbar (FK ⊇ EK → EK+FK = FK-Set, keine neue Pflicht); Verwaltung/Praktikant/Subunternehmer mit EK/FK kombinierbar (Doppelrolle geht im Set auf). Altes Feld `zusatzBewachungNiveau` aus der UI **entfernt** (Spalte bleibt read-only fürs Migrieren). **Idempotente Read-Migration** (`resolveRoleClasses`): gefülltes Set hat Vorrang, sonst aus `roleClass`/Org-Titel + altem Niveau ableiten. Engine derived `hasEK/hasFK/bewachung/fuehrung` aus dem Set. Neuer `RoleClassSelector` (Checkbox-Gruppen Bewachung / Keine-andere). Jede Regel behält `clauseId` (EC-10 unverändert).

**Gate (alles grün):** `tsc --noEmit` = 0 · Engine-Suite **27/27** (Set-Szenarien EK/FK/EK+FK + Doppelrolle D1–D7 + Migrations-Tests) · **EC-09-ZIP** browser-verifiziert auf :3001 (Neuanlage EK+FK → DB persistiert `roleClasses=["ek","fk"]`, legacy-Felder leer; Read-Migration: Bestandspersonen + Inline-Edit zeigen Set korrekt; ZIP-Export `POST 200`, ~1 s render, kein Fehler). Test-Person nach Verifikation wieder entfernt. EC-10-UI-Texte („kein Freigabestatus") unverändert.

**Commit:** `e1899dd` (12 Dateien, enge Pathspecs — nur Code, keine `.env`/`.db`/`hq`-Dateien des Parallel-Agents). Rebase auf `origin/main` (autostash), gepusht.

**Offen:** weiter mit Queue-Punkt 2 (G4-Phase-2-Delta) + 3 (Regression grüne UE-Soll/Ist-Übersicht). **Beobachtung zur Regression:** Bei der EK/FK-Akzeptanz war die grüne **Schulungs-Soll-Ansicht (Jahres-Weiterbildung, UE Soll/Ist/Rest, CL-11) sichtbar** für eine Bewachungsrolle — sie ist also nicht generell „weg". Genaue Ursache (welcher Fall verdeckt?) wird in Punkt 3 geprüft.

### 2026-06-08 — ⏹️ END-OF-RUN-SUMMARY (Executor autonomer Lauf, §7 Run-Order)

**Lauf-Bilanz:** 3 Slices gebaut/verifiziert/committet, 2 Punkte sauber geparkt. Alle Commits = nur Code + Bridge-Doku, explizite Pathspecs, **keine** `.env`/`.db`/Kundendaten (jeweils via `git show --name-only` geprüft). Nicht gepusht (Mark pusht/deployt selbst).

**Commits (chronologisch):**
| Hash | Was | Gate |
|---|---|---|
| `047878c` | **G4 Phase 1** — `roleClass`-Norm-Klasse-Modell (ek/fk/verwaltung/praktikant/sub) als primärer Engine-Input; Org-Titel (`roleType`) = Anzeige; idempotente Read-Migration; Engine-Refactor; schlankes Anlege-Formular; 11 Code-Dateien. | tsc 0 · Engine 24/24 · EC-09-ZIP 200 · Migration live (blubermann→verwaltung, Neuanlage FK persistiert) |
| `dcbd0d5` | **Bridge** — HANDOFF-Abschluss + Executor-Selbst-Review G4 P1 in `CODE_REVIEW.md`. | docs |
| `2261d26` | **Slice 4** — rechnerischer Pflicht-Status (Ampel) im Dossier: aggregiert Engine-Stati (pflichtSet+fristen) → offen/in-arbeit/rechnerisch-vollständig + Severitäts-Zähler + nächste/überfällige Frist; reine `compliance-status.ts` + 10 Tests; EC-10-Disclaimer. 4 Dateien. | tsc 0 · Slice-4-Suite 10/10 · Engine 24/24 · EC-09-ZIP 200 (Generator unberührt) |

**Pro Queue-Punkt:**
1. **G4 Phase 1 — ✅ fertig** (`047878c`). Browser-verifiziert (FK-Neuanlage + Verwaltung-Migration + Dossier-Recompute); restliche Klassen/Doppelrolle durch 24-Test-Suite gedeckt.
2. **G4-Phase-1-Selbst-Review — ✅ fertig** (`CODE_REVIEW.md`, `dcbd0d5`). **Empfehlung: unabhängiger Planer-Review** (Engine-Refactor + Migration) — bisher nur Executor-Selbst-Review.
3. **G4 Phase 2 — ⏸️ GEPARKT** (`CURSOR_G4_PHASE2_AUFTRAG.md`). **Befund:** Doc-Auswahl liegt durch die `displayMode="documents"`-Architektur **bereits im Generator-Tab** (nicht mehr im Anlege-Schritt) → Phase-2-Ziel (Gate b) scheint erfüllt. **Präzise Frage an Mark/Planer:** welches konkrete Rest-Delta soll Phase 2 liefern (Batch-Export-Doc-Auswahl? globaler Generator? UX-Feinheit?)? Nicht ins EC-09-kritische Generator gebaut ohne klares, reviewtes Ziel.
4. **Slice 4 (Ampel/Status) — ✅ fertig** (`2261d26`). EC-10 hart eingehalten (nie „freigegeben/auditfähig").
5. **Resttechnik — ⏸️ GEPARKT.** **(a) Ist-UE-Auto-Summe:** braucht ein **neues strukturiertes Nachweis-mit-UE-Datenmodell** (Nachweise sind heute nur Datei-Uploads ohne UE-Wert; Ist-UE wird manuell erfasst) → eigener norm-sensibler Slice, kein kleiner Refactor. **(b) DB-Doppelpfad** (`prisma/prisma/dev.db` vs `prisma/dev.db`): riskanter Infra-/Config-Refactor (`DATABASE_URL`), EC-09-Risiko → **Mark-Gate** empfohlen, nicht unbeaufsichtigt.

**Offene Fragen für Mark (gebündelt):**
- **F1 (Phase 2):** Konkretes Rest-Delta bestätigen — siehe `CURSOR_G4_PHASE2_AUFTRAG.md` §3 (A/B/C/D).
- **F2 (Review):** Unabhängigen Planer-Review von `047878c` (+ `2261d26`) vor weiterer Bautätigkeit?
- **F3 (Resttechnik):** Ist-UE-Auto-Summe = eigenen Slice mit Nachweis-UE-Datenmodell aufsetzen? DB-Doppelpfad-Vereinheitlichung freigeben (eigenes Fenster, EC-09-Smoke davor/danach)?

**Nächster empfohlener Schritt:** (1) Planer-Review G4 P1 + Slice 4 → (2) Phase-2-Delta entscheiden (F1) → (3) ggf. Nachweis-UE-Datenmodell-Slice. Dev-DB-Hinweis: Test-Akte „G4 Testperson" wurde entfernt; blubermann trägt jetzt persistiert `roleClass=verwaltung` (legitime Migration).

**Tech-Stand:** HEAD = `2261d26`. Untracked Bridge-Doku noch zu committen: `CURSOR_G4_PHASE2_AUFTRAG.md` (mit diesem Bridge-Commit). Fremd-gestaged/untracked (NICHT von mir): `hq/03_Kundenprojekte/**` (Kundendaten), `hq/10_Bridge/AUTONOMER_BAU_AUSBLICK.md` (Generalist).

---

### 2026-06-08 — ✅ Executor: G4 Phase 1 FERTIG + COMMITTET `047878c` + Selbst-Review (autonomer Lauf, „Run Everything")

**Erledigt (Queue 1 + 2):** roleClass-Norm-Klasse-Modell + idempotente Read-Migration + Engine-Refactor + schlankes Anlege-Formular + Tests. **Commit `047878c`** (11 Code-Dateien, explizite Pathspecs — `.db`/`.env`/`hq/03_Kundenprojekte/**` ausgeschlossen, via `git show --name-only` verifiziert). **Selbst-Review:** `CODE_REVIEW.md` (oberster Eintrag).

**Verifikations-Gate — alle grün:**
- `tsc --noEmit` = **0**.
- Engine-Suite `tsx --test` = **24/24** (20 alt umgestellt + Org-Titel→Klasse-Mapping + Einsatzleitung=FK (4c) + Subunternehmer (7) + Praktikant (8) + „keine Norm-Klasse" (9)).
- **EC-09 echter Browser :3001:** ZIP `POST /employee-automation` **200** (mehrfach, kein 5xx, 490 ms reale Generierung mit aktiver Migration). Neuanlage über neues Formular (FK + Vorlage) → DB `roleClass=fk`. Read-Migration live: blubermann (`Bürokraft / Verwaltung`) → DB `roleClass=verwaltung` persistiert. Dossier-Edit-Tabelle zeigt Norm-Klasse + recomputed.
- Test-Akte „G4 Testperson" nach Verifikation aus Dev-DB entfernt (Hygiene; DB ist gitignored).

**Selbst-Review-Befund:** norm-konform, jede Regel CL-belegt, **keine neue CL/UE**, EC-09/EC-10 gewahrt. Minor (kein Blocker): (1) Live-Browser-Matrix nur teilweise gefahren (FK-Neuanlage + Verwaltung-Migration) — restliche Klassen/Doppelrolle deterministisch durch die 24-Test-Suite abgedeckt; (2) Legacy-Akten ganz ohne Rolle behalten „Keine Norm-Klasse" (korrekt). `EmployeeFileAkteInlineEdit.tsx` ist Alt-Form (nur DossierView nutzt die Tabelle) → nur lauffähig gehalten.

**❓ FRAGE an Planer (Rollenkontrakt):** Dies ist ein **Executor-Selbst-Review** unter Marks autonomer Vollmacht, kein unabhängiger Planer-Review. **Empfehlung:** Planer reviewt `047878c` unabhängig (Engine-Refactor + Migration besonders) bevor Phase 2 abgenommen wird.

**Prisma-Hinweis:** `prisma generate` + `db push` gelaufen (`DATABASE_URL=file:./prisma/dev.db` → Runtime-DB `prisma/prisma/dev.db` hat `roleClass`-Spalte). Schema-Migration committet; DB selbst nicht (gitignored).

**▶ NÄCHSTER SCHRITT (laufender Lauf):** Queue 3 = **G4 Phase 2** (Doc-Auswahl Core/Overlay-Chips → Generator-Tab, `displayMode="documents"` wiederverwenden, EC-09 = Hauptrisiko) → Queue 4 Slice 4 (Ampel/Status, **EC-10 hart: nur rechnerischer Status, kein Freigabestatus**) → Queue 5 Resttechnik. End-of-Run-Summary folgt am Ende.

---

### 2026-06-07 — ❓ Executor relais an Planer 7: Mark-Richtungsentscheid „Tally entkoppeln, In-App-Erfassung priorisieren, Rollenliste revidieren"

**Kontext:** Mark wurde live demonstriert (Browser :3001), dass Slice 3 funktioniert (Doppelrolle-Select recomputed das Pflicht-Set inkl. CL-01/03/04/05 live). Dabei Mark-Feedback (mündlich, hier protokolliert — vom Executor NICHT eigenmächtig eingeplant, gehört Spur P + Mark-Gate):

**Mark-Aussage (sinngemäß, bitte mit Mark gegenprüfen):**
1. **Tally als Erfassungsweg ist zu aufwändig / nicht praktikabel.** Mark will Daten **nicht** zwingend übers Tally-Formular eingeben müssen.
2. **Die Rollenliste/Taxonomie muss ohnehin überarbeitet werden.**
3. **„Ohne Tally-Anbindung" lösen** — Erfassung direkt in der App, von Tally entkoppelt.

**Auswirkung auf die Planung (Einordnung, KEINE Executor-Entscheidung):**
- **Slice 3b (Tally-Formular-Feldlücke, Option C Hybrid)** war genau der Weg „Felder im Tally-Formular `vGNvY0` anlegen" — den Mark jetzt als zu aufwändig ablehnt. → Slice 3b vermutlich **zurückstellen/neu denken**, nicht als nächstes bauen.
- **G4 (Anlege-Formular auf Requirement-Modell migrieren)** rückt damit nach vorn = der In-App-Erfassungsweg ohne Tally-Abhängigkeit. Mark hatte G4 bereits „ja, eigener Slice".
- **Rollenliste-Revision** als zusätzlicher Scope-Punkt (Taxonomie `ROLLE_TYPE_OPTIONS`/`GRUNDROLLE_CATALOG`) — Norm-Mapping/clauseId beachten, keine erfundene Pflicht.

**Mark hat in dieser Session zusätzlich „dann mach das" zur nächsten sichtbaren Arbeit gesagt** (Auswahl stand zwischen Slice 4 Ampel-/Status-Ansicht und G4). Mit obigem Tally-Feedback tendiert die Richtung zu **G4 (In-App-Erfassung) + Rollenliste**. → **Planer 7 bitte: Reihenfolge G4 / Slice 4 / (3b zurückgestellt) mit Mark final klären und G4-Slice + Rollenliste-Revision als Bauauftrag planen** (Architektur/Scope/clauseId). Executor wartet auf Bauauftrag, baut nicht ungeplant.

---

### 2026-06-07 — ✅ Executor: Hydration-Fix Firmenname gebaut + committet (`01f720b`)

**Fertig (exakt nach Planer-6-Bugfix-Auftrag „Von Claude an Cursor", kein Scope-Zusatz, 2 Dateien):**
- `lib/company-session.ts`: `DEFAULT_COMPANY_SLUG` exportiert.
- `EmployeeAutomationPage.tsx`: Initializer `useState(getActiveCompanySlug)` → `useState(DEFAULT_COMPANY_SLUG)` (SSR == erster Client-Render). Der Bootstrap-`useEffect` liest nach Mount `getActiveCompanySlug()` (localStorage) und setzt `setCompanySlug(slug)` → kein erster-Render-Divergenz, Switcher-Persistenz erhalten (zeitversetzt nach Mount).

**Verifiziert (echter Browser, nicht Skript):** `tsc --noEmit` 0 · **Hydration-Warnung weg** nach Firmenwechsel (Wolf Street) + Reload — **Index UND `?new=1`** (Next-Dev-Overlay kein Issue mehr) · **EC-09 unberührt** (Person → Akte → Doc-Chips → ZIP `POST /employee-automation` 200, kein 5xx) · **Switcher** zeigt nach Reload weiterhin Wolf Street. **EC-10** unberührt.
**Commit-Hash:** `01f720b` (2 Code-Dateien; DB/.env nicht committet, DSGVO). Bridge-Doku separat.
**Hinweis (kein Eingriff):** Render-Stelle ist faktisch `EmployeeFileIndex.tsx:273` (Auftrag nannte :271 — minimal verschoben, identische Codestelle).

---

### 2026-06-07 — ❓ Executor-FRAGE an Planer: Anlege-Formular auf neues Requirement-Modell migrieren? (+ kleiner URL-Fix `17f94cc` erledigt)

**Mark-Beobachtung (Browser):** Beim Klick auf „Neue Person" erscheint zuerst das **alte Tool-1-Eingabeformular** (`EmployeeForm.tsx`, `displayMode="master"`, englische Labels „Full Name/Role Type/Training Hours/Guard ID", Modell `roleId`/`appointmentIds`/Freitext-`roleType`). Die **neuen Requirement-Felder** (Grundrolle-Dropdown, Doppelrolle, SDL/Geltungsbereich, Beschäftigungsart, Fristen, UE) existieren erst **danach** in der Akte/Dossier (`EmployeeFilePersonRolleEditTable.tsx` + Engine). Deckt sich mit Planer-4-UX-Notiz („Anlege-Maske schlank … Slice-2-Felder erst in der Akte, by design").

**Was ich (Executor) bereits gefixt habe — klein, contained, kein Scope-Zusatz (Commit `17f94cc`):** Der „Neue Person"-Button leerte die URL; der `?new=1`-Deep-Link wurde aber beim Laden bereits ausgewertet. Jetzt setzt `handleCreateNew` `?new=1` → Anlege-Ansicht ist teilbar/bookmarkbar. `tsc` 0, im Browser verifiziert (`window.location.href` = `…?new=1`; Deep-Link öffnet Anlege-Form). Reine URL-Spiegelung, **keine** Engine-/Architekturänderung.

**FRAGE / Scope-Entscheidung (gehört dem Planer + Mark-Gate, C-10 — ich plane das NICHT selbst):** Soll das Anlege-Formular auf das neue Requirement-Modell vereinheitlicht werden (statt Legacy-Tool-1-Form)? Das wäre eine **Architektur-/Scope-Änderung** und ein **eigener Slice**, nicht in Slice 3 enthalten. Grobe Berührungspunkte (read-only beobachtet, ohne Vorentscheidung):
- `EmployeeForm.tsx` (master mode) + `lib/validations/employee-form.ts` (Zod-Schema) tragen das Altmodell (`roleId`/Dokument-Template-Auswahl für den Generator, Freitext-`roleType`, `trainingHours`).
- Die Akte-Erfassung (`EmployeeFilePersonRolleEditTable.tsx`) trägt das Neumodell (`roleType` als Enum, `zusatzBewachungNiveau`, `sdlScopes`, `beschaeftigungsart`, Fristen …).
- Offene Planer-Fragen: bleibt die Doc-Template-Auswahl (Core/Overlay) im Anlege-Schritt oder wandert sie ganz in den Generator? Soll „Neue Person" direkt die Akte-Edit-Fläche für eine leere Person zeigen? Verhältnis zur Tally-Feldlücke (Slice 3b)?

→ Bitte als eigenen Slice einplanen/entscheiden (Mark-Gate). Ich habe **nichts** am Anlege-Formular/Modell geändert außer dem URL-Fix oben.

---

### 2026-06-07 — ✅ Executor: Slice 3 Doppelrollen (Niveau EK/FK) gebaut + committet (`a276d38`)

**Fertig (exakt nach `CURSOR_SLICE3_AUFTRAG.md`, kein Scope-Zusatz):**
- **Datenmodell:** `EmployeeFile.zusatzBewachungNiveau String?` (Prisma, `db:push`+`generate`, nur `prisma/prisma/dev.db`) · `Employee.zusatzBewachungNiveau?: "ek"|"fk"` · Repository alle 5 Mapping-Stellen + Read-Normalisierung (`asNiveau`).
- **Engine (4.1–4.5):** effektive `bewachung`/`fuehrung` (Doppelrolle hebt F3-Gate, „fk" treibt FK-Zweig) · CL-10 (`q-fk-quali`) jetzt DIN-SDL-gegatet (`hasDinSdl`) · Verwaltungs-/Praktikanten-Reduktion bei Doppelrolle unterdrückt · `bewTrigger`-Transparenztext + Doppelrollen-Hinweis. Keine neue CL/UE.
- **Presenter:** `buildRequirementContext` reicht Feld durch · `isSecurityRole` doppelrollen-aware.
- **UI:** Select „Zusätzliche Bewachungstätigkeit (Doppelrolle)" unter der Rolle-Zeile (`ZUSATZ_BEWACHUNG_OPTIONS`); inkl. Leer-Option „— keine zusätzliche Bewachung" (nötig, damit Headless-`Select` zurücksetzbar ist — die DoD-Forderung „Checkbox aus → Reduktion").
- **Tests:** Engine-Suite **20/20** (13 alt grün + 7 neu D1–D7, inkl. CL-10-Gate D7).

**Verifiziert:** `tsc --noEmit` 0 · `tsx --test` 20/20 · **EC-09-Smoke** im echten Browser (Person→Akte→Doc-Chips→ZIP `POST /employee-automation` 200, kein 5xx) · **Doppelrolle-Akzeptanz** live (Testperson GF+EK → volles Bewachungs-Set mit „Doppelrolle (Geschäftsführung + Bewachung, EK-Niveau)"-Trigger + UE-Soll + Hinweis; auf „keine" → zurück auf Verwaltungs-Reduktion; **Persistenz über Reload** bestätigt). **EC-10** gewahrt.

**Offen / Frage an Planer:** (1) Slice-3-Review (Diff `a276d38`) gegen Norm-Matrix v2 + Klausel-Register. (2) FK-Niveau wurde im Browser nicht separat durchgeklickt — durch Unit-Tests D4/D7 abgedeckt; bei Bedarf live nachstellen. (3) Slice 3b (Tally-Feldlücke) bleibt gated auf Marks Tally-Arbeit.
**Commit-Hash:** `a276d38` (8 Dateien). DB/.env nicht committet (DSGVO).

---

### 2026-06-07 — ✅ Executor: Hetzner Pre-Deploy-Gates alle grün (kein Code-Commit nötig)

**Bauauftrag `CURSOR_HETZNER_PREDEPLOY_AUFTRAG.md` abgearbeitet — alle 4 Gates grün:**
1. **`npm run build` = 0 Errors.** `prisma generate` + `next build` (Next 16.1.1/Turbopack) sauber durch, TypeScript ok. ESLint zusätzlich separat (`npm run lint`): **0 Errors / 5 Warnings** (react-hooks/incompatible-library `watch()` ×2, exhaustive-deps ×1, unused `_appointments` ×1 — alle nicht blockierend). Keine Lint-Fixes nötig → **kein `ignoreDuringBuilds`**, kein Code-Commit.
2. **EC-09-Smoke gegen Prod-Build (`npm run start -- -p 3001`) im echten Browser grün.** Person → Akte → Doc-Chips (Generator-Palette Core 4/4 + Overlay) → ZIP exportieren. Server-Action **200**, RSC-Body beginnt mit `UEsDBA…` (= `PK\x03\x04` ZIP-Magic), Client erzeugt **`application/zip`-Blob 132,8 KB** + Download-`a.click()`. **EC-10-Disclaimer** „…kein automatischer Freigabe- oder Zertifizierungsstatus" sichtbar. *(Hinweis: die zwei Test-Datensätze „Felix Balthasar Hochreither" haben keine Rolle → Engine liefert korrekt `{success:false, error:"Role \"\" not found…"}`. Reines Test-Daten-Artefakt, kein Build-/Code-Problem. Export mit valider Person „joe" = grün.)*
3. **`.env.example` vollständig.** Alle zur Laufzeit gelesenen `process.env.*` abgedeckt: `HETZNER_S3_KEY/SECRET`, `HETZNER_BUCKET_NAME`, `HETZNER_S3_ENDPOINT/REGION` (S3×5), `INTERNAL_API_KEY`, `TALLY_WEBHOOK_SECRET`, `TALLY_API_KEY`, `DATABASE_URL`, optional `CEA_REGISTRY_PATH` (auskommentiert). `NODE_ENV` per systemd. **Keine fehlende Variable → keine Ergänzung nötig.**
4. **`db:push`-Trockencheck grün.** `DATABASE_URL=file:./prisma/dev.db npm run db:push` → „database is already in sync", adressiert `dev.db at file:./prisma/dev.db` = real `prisma/prisma/dev.db`. **Kein zweites `prisma/dev.db` angelegt** (vorher/nachher nur das eine File, Größe/Timestamp unverändert).

**Verifikation:** real im Browser (CDP-Netz-/Blob-Hooks zur Beweissicherung des ZIP-Streams), nicht per Skript-Fake.
**Offen:** Mark deployt (DNS/`.env.production.local`/systemd/nginx/certbot/Webhook-PATCH/Backup-Cron) — Runbook `HETZNER_DEPLOY.md` + Bauauftrag „DANACH". Dann Planer 4 reviewt Pre-Deploy-Ergebnis.
**Commit-Hash:** keiner — **kein Produktivcode geändert** (alle Gates ohne Fix grün); Basis bleibt `0d92ff2`. Diese HANDOFF-Notiz = Bridge-Doku.

---

### 2026-06-07 — ✅ Builder 2: UE-Anzeige + Findings F1–F5 committet (`0d92ff2`)

**Fertig (Commit `0d92ff2`, Basis `22e0c7c` — kombiniert UE-Anzeige + Findings, kein separater UE-Commit):**
- **F1** q-34a bei reiner Unterrichtung (ohne Sachkunde) → `unvollständig`. **F2** Pflicht-Set-Dedup nach `clauseId` (Presenter-only, Engine unverändert; CL-08/CL-23; Trigger gemerged, strengerer Status; null-CL nie dedupt). **F3** SDL-Schulungssoll nur bei Bewachung (Brandschutz-Pflichtnachweis ungated; Doppelrollen-Modellgrenze als Kommentar). **F4** nur `Führungskraft`=FK (24 UE + CL-10); EL/OL/SL=EK (16 UE), bleiben Bewachung (Basis-Set). **F5** Asyl-Basis-Label rollen-neutral.
- **F4-Naming-Check (erledigt, kein Bug):** gespeicherte `roleType`-Werte kommen aus `ROLLE_TYPE_OPTIONS` (`Sicherheitsmitarbeiter`, `Praktikant / Azubi`, …) und matchen **exakt** die Engine-Sets. `GRUNDROLLE_CATALOG` (`SMA / Sicherheitsmitarbeiter`) ist nur Anzeige-Chip-Liste → **kein** Write-Path-Bug. *(Hinweis: Tally-Intake schreibt rohen Dropdown-Text — separater Alt-Thread, nicht in diesem Scope.)*
- **Verifiziert:** `tsc --noEmit` = 0 · Engine-Suite **13/13** grün · Presenter-Integration `getEmployeeFileSummary` Szenarien a–d grün (inkl. F2-Dedup mit gemergtem Trigger) · Browser: **EC-09-ZIP-Export 200/kein Fehler**, Akte rendert, **F4 live** (Schichtleitung → 16 UE EK, kein FK-Quali); Testperson „joe" danach auf SMA/ohne-SDL zurückgesetzt.

**Offen:** Planer 3 — Final-Abnahme (kombinierter Diff gegen `22e0c7c`) gegen Norm-Matrix v2 + Klausel-Register.
**Commit-Hash:** `0d92ff2`.

---

### 2026-06-07 — Stabiler Punkt → Übergabe Builder 2 (F1–F5)

**Fertig:** UE-Anzeige (Variante C) + P2023-Fix im Working Tree; Planer-2-Pre-Commit (`CODE_REVIEW.md`, `tsc`/Lints 0). Auftrag `CURSOR_FINDINGS_1_2_AUFTRAG.md` F1–F5 freigegeben (F3/F4 Mark entschieden).
**Offen:** UE Commit + Browser final + EC-09 · Builder 2 implementiert F1–F5.
**Commit-Hash:** UE-Code **uncommitted** (Basis `9cad207`); HANDOFF-Update committed.

---

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

### 2026-06-08 — 🚦 PARALLEL-DISPATCH (Planer): File-Ownership-Grenzen + BOTS READY

**Zweck:** Zwei Executor-Bots parallel, **garantiert kollisionsfrei**, weil ihre Schreib-Mengen **disjunkt** sind. Jeder Bot schreibt **nur** die Dateien seiner Zeile, sonst **nichts**. Baseline-Commit = **`e7ed92e`** (Watcher-Anker; weckt bei neuem main-Commit oder CODE_REVIEW/HANDOFF-Änderung).

#### Dispatch-Tabelle (verbindlich — „touch nothing else")

| Lane | Bot | Bauauftrag(e) | DARF schreiben (nur diese) | NUR LESEN / nie schreiben |
|------|-----|---------------|----------------------------|---------------------------|
| **A — Engine (ÖPV)** | Bot A | `CURSOR_OEPV_ENGINE_AUFTRAG.md` | `…/employee-file/requirement-engine.ts` · `…/employee-file/requirement-engine.test.ts` | alles andere |
| **B — Audit-Export** | Bot B (1 Bot, **sequenziell**: Pt 1 → Pt 2) | `CURSOR_AUDIT_EXPORT_AUFTRAG.md` **dann** `CURSOR_AUDIT_EXPORT_PT2_AUFTRAG.md` | `…/employee-file/EmployeeAutomationPage.tsx` (Export-Toggle + `handleAuditExport` + Download; **ZIP-`handleGenerate` nicht umschreiben**) · `…/employee-file/EmployeeFileOverview.tsx` (CopyButton) · **NEU** `…/employee-file/CopyButton.tsx` · **NEU** `app/actions/generate-audit-export.ts` · **NEU** `…/employee-file/audit-export-xlsx.ts` · **NEU** `…/employee-file/audit-export-pdf.ts` · **NEU** `…/employee-file/audit-export-*.test.ts` · `package.json` + `package-lock.json` (Pt 2: `exceljs`, `pdf-lib`) · optional NEU Print-Route/-Hülle | `requirement-engine.ts` · `employee-file-requirements.ts` (`getEmployeeFileSummary` = Single Source) · `generate-employee-docs.ts` (ZIP-Generator) · `EmployeeForm.tsx` |

**Disjunktheit belegt (am HEAD geprüft):** A-Schreibmenge `{requirement-engine.ts, requirement-engine.test.ts}` ∩ B-Schreibmenge `{EmployeeAutomationPage.tsx, EmployeeFileOverview.tsx, CopyButton.tsx, generate-audit-export.ts, audit-export-*.ts, package.json, package-lock.json}` = **∅**. B liest `requirement-engine.ts` nur transitiv (über `getEmployeeFileSummary`), schreibt sie nie → bei Rebase beider auf `main` **kein Datei-Merge-Konflikt**.
**Pt-1↔Pt-2 = derselbe Export-View → EIN Bot, sequenziell** (NICHT zwei parallele B-Bots — das ist die einzige Stelle, wo B mit sich selbst kollidieren würde).

#### Koordinations-Modell (Ordner/Branches — Planer-Entscheid 2026-06-08)
**Cursor-Background-Agents isolieren sich selbst** (eigener Checkout + eigener `cursor/*`-Branch je Bot) → **keine geteilten Working Trees, keine manuellen Worktrees nötig.**
- **Planer** bleibt im Main-Checkout auf `main`.
- **Jeder Bot** branched ab **`main@c5eb583`** (= aktuelles `main == origin/main`; der ältere Wert `5263a04` ist überholt — `c5eb583` ist nur ein Bridge-Doku-Commit drüber, kein Produktivcode, und trägt diese Dispatch-Tabelle live), baut auf seinem `cursor/*`-Branch, committet, pusht **seinen Branch** (NICHT direkt auf `main`).
- **Merge-Gate = Planer:** Planer pullt den Branch, reviewt den Diff gegen diese Dispatch-Tabelle (disjunkt eingehalten? EC-09/EC-10? CL-belegt?), **mergt dann nach `main`**. Disjunkte Write-Sets → Lane A + Lane B mergen **konfliktfrei** in beliebiger Reihenfolge.
- **Laufzeit-Dateien:** `.env.local` + Dev-DB sind gitignored (nicht im Branch). Build/Test: `DATABASE_URL=file:./prisma/dev.db` (CLAUDE.md; DB-Doppelpfad `prisma/dev.db` + `prisma/prisma/dev.db` = bekanntes Tech-Debt, kanonisch `prisma/dev.db`).

#### ▶ BOTS READY
1. **Lane A** → `CURSOR_OEPV_ENGINE_AUFTRAG.md` → schreibt **nur** `requirement-engine.ts` + `requirement-engine.test.ts`.
2. **Lane B** → `CURSOR_AUDIT_EXPORT_AUFTRAG.md` → dann `…PT2_AUFTRAG.md` (1 Bot, sequenziell) → `EmployeeAutomationPage.tsx` + `EmployeeFileOverview.tsx` + neue `audit-export-*`/`CopyButton`/Action + `package.json`.
3. **Gates intakt:** C-10 (Mark) · EC-09 (ZIP 200) · EC-10 (kein Freigabe-Wording) · jede Norm-Regel `clauseId` · keine Personendaten/`.env`/`.db` auf Git. Watcher-Baseline `e7ed92e`, disjunkte Write-Sets ✓.

#### ⚠️ BEGRIFFS-KLÄRUNG „ZWEI BOTS" (Planer 8, 2026-06-08) — verbindlich für den Dispatch-Agent

**„Zwei Bots" = zwei Lanes (A + B), NICHT zwei Bots pro Lane.** Wer den Dispatch-Prompt ausführt, startet **genau zwei** Cursor-Background-Agents:

| Bot | = Lane | Bauauftrag (in dieser Reihenfolge) | Branch ab `main@c5eb583` | schreibt NUR (Dispatch-Tabelle) |
|-----|--------|-----------------------------------|--------------------------|---------------------------------|
| **Bot A** | A — ÖPV-Engine | `CURSOR_OEPV_ENGINE_AUFTRAG.md` | eigener `cursor/*` | `requirement-engine.ts` + `requirement-engine.test.ts` |
| **Bot B** | B — Audit-Export | `CURSOR_AUDIT_EXPORT_AUFTRAG.md` **DANN** `CURSOR_AUDIT_EXPORT_PT2_AUFTRAG.md` | eigener `cursor/*` | `EmployeeAutomationPage.tsx` · `EmployeeFileOverview.tsx` · NEU `CopyButton`/`generate-audit-export`/`audit-export-{xlsx,pdf}` (+Tests) · `package.json/-lock` |

- **Bot B ist EIN Bot, sequenziell** (Pt 1 committen → dann Pt 2). **NICHT** in zwei parallele B-Bots aufsplitten — Pt 1 und Pt 2 bearbeiten denselben Export-View und würden mit sich selbst kollidieren (s. Disjunktheits-Notiz oben).
- **Also: A = 1 Bot, B = 1 Bot → 2 Bots total.** Nicht 3, nicht 4.
- **Branch-Basis = `c5eb583`** (aktuelles `main`), nicht `5263a04`.
- Jeder Bot pusht **seinen** `cursor/*`-Branch (nie direkt `main`). **Planer = Merge-Gate** (pullt, reviewt gegen Dispatch-Tabelle + Norm/Klausel-Register, re-verifiziert `tsc`/Suite, mergt nach `main` mit Marks OK).

> **Status (Planer 8, 2026-06-08):** Bridge-Doku ist **committet** (`main == origin/main == c5eb583`, gepusht) → Dispatch-Tabelle steht live, Watcher feuert. Alle drei Bauaufträge liegen baufrei vor. **Bisher kein Lane-Branch gepusht** (vorhandene `cursor/din-77200-…` + `cursor/hq-*` = alte HQ/DFSS-Arbeit, berühren keine Lane-Datei). Planer pollt jetzt per `git fetch`; meldet sich, sobald ein Lane-Branch eintrifft.

### 2026-06-08 — ✅ Planer: G4-P1-Review (`047878c`) ABGENOMMEN + Sanity-Check ÖPV-/Audit-Export-Bauaufträge

**1) G4 Phase 1 (`047878c`) reviewt → ABGENOMMEN** (Detail: `CODE_REVIEW.md`, oberster Eintrag). Unabhängig re-verifiziert am HEAD: `tsc` 0 · Engine-Suite 27/27. roleClass-Klassifikationsquelle sauber, keine neue CL/UE, Migration idempotent, EC-09/EC-10 gewahrt. **1 Mark-Hinweis** (kein Re-Bau): Die Read-Migration klassifiziert **bestehende „Einsatzleitung"-Akten EK→FK** um → höheres Soll + CL-10-Prüfhinweis bei DIN-SDL. Gewollt (Marks Gate „nur Einsatzleitung = FK"), kein Datenverlust; explizit gesetztes `roleClass`/`roleClasses` hat Vorrang. **Hinweis für künftige Aufträge:** `047878c` (Einfachfeld `roleClass`) ist durch `e1899dd` auf **`roleClasses`-Set** generalisiert — HEAD-Stand = Mehrfach-Klasse.

**2) Sanity-Check der zwei noch-nicht-gebauten Bauaufträge (vor Bau):**

**🟢 `CURSOR_OEPV_ENGINE_AUFTRAG.md` (Lane A) — BAUFREI, keine Norm-/Scope-Blocker.**
- **Cross-Check-Flag „🔴 ÖPV ohne CL" ist AUFGELÖST:** CL-29 (EK 40 UE, §6.4) + CL-30 (FK +16 = 56, §6.3) stehen als **„belegt"** im `NORM_KLAUSEL_REGISTER_v1.md` (Z. 36/37). Der Auftrag zitiert sie korrekt; UE-Werte exakt = Register. Mechanik (additiv auf EK-Basis, F3-`bewachung`-gegatet) = Asyl-Muster CL-24/25 — konsistent.
- **Anker gegen aktuellen HEAD geprüft (nicht stale):** Block `if (sdl.has("din2-oepv"))` liegt real bei Z. 650 (Auftrag sagt ~650–659 ✅); `SDL_SCOPE_CATALOG`-Eintrag bei Z. 168 (~167–172 ✅); abgeleitete Vars `bewachung`/`fuehrung` existieren (Z. 349/350). §4-Tests nutzen bereits `roleClasses`-Plural (post-`e1899dd`) — passt. **Eine Mini-Korrektur für den Bot:** der Auftrag spricht in §2/§3 noch von „FK/Führungskraft" als ob Einfach-Trigger; im HEAD ist `fuehrung = hasFK` über das `roleClasses`-Set — Logik identisch, nur Wording. Kein Blocker.

**🟡 `CURSOR_AUDIT_EXPORT_AUFTRAG.md` (Lane B) — BAUFREI, aber 1 Scope-Bestätigung für Mark offen.**
- **EC-09/EC-10 sauber:** Lane B fasst Engine/`EmployeeForm`/ZIP-Generator **nicht** an, reused `EmployeeFileOverview` (Single Source), EC-10-Disclaimer drin → parallel-safe zu Lane A. ✅
- **✅ Scope-Frage von Mark entschieden (2026-06-08): zusätzlich XLSX + PDF, Browser-Download.** Lane B Pt 1 (In-App-Batch + Feld-Kopieren) bleibt wie es ist; **zusätzlich** ein herunterladbares Datei-Artefakt. **→ Neuer Folgeauftrag geschrieben: `CURSOR_AUDIT_EXPORT_PT2_AUFTRAG.md`** (Lane B Pt 2). Gates eingearbeitet: Format **XLSX + PDF**, Auslieferung **Browser-Download** (Server schreibt NICHT in OneDrive — Mark legt selbst ab; bestehendes `handleGenerate`-Download-Muster wiederverwenden), Engines `exceljs` + `pdf-lib` (kein Puppeteer), Datenquelle `getEmployeeFileSummary` (Single Source), EC-09/EC-10/DSGVO hart, keine Engine-Datei berührt. **Reihenfolge:** Pt 1 zuerst committen, dann Pt 2. Offene Mark-Mini-Punkte (PDF-Pixel-Optik vs. tabellarisch, Spaltenumfang, ein File vs. je Person) als §7-Defaults gesetzt + überschreibbar.
- **Label-Drift (nur Hygiene, kein Bau-Impact):** Master-Plan nennt Ampel/Status = Slice 3 und Audit-Export = Slice 4; gebaut wurde „Slice 4 = Ampel" (`2261d26`). Funktional kein Konflikt, aber die Slice-Nummern im Master-Plan vs. Build divergieren — bei Gelegenheit im Master-Plan nachziehen.

### 2026-06-07 — 🐛 BUGFIX-AUFTRAG (Planer 6): Hydration-Mismatch Firmenname (`EmployeeFileIndex` Z. 271)

**Symptom (Mark, Browser):** „1 Issue" im Next-Dev-Overlay = **React-Hydration-Error**. Server rendert `(TeamFlex)`, Client `(Wolf_Street)` an `EmployeeFileIndex.tsx:271` (`{companyDisplayName ? \` (${companyDisplayName})\` : ""}`). Kein Crash, aber Hydration-Warnung + potenziell verworfenes Client-DOM.

**Root Cause (belegt):** `company-session.ts` `getActiveCompanySlug()` ist **nicht SSR-stabil** — Server liefert `DEFAULT_COMPANY_SLUG="TeamFlex"`, Client liest `localStorage` (`"Wolf_Street"`). Verwendet als **lazy `useState`-Initializer** in `EmployeeAutomationPage.tsx` Z. 50 (`useState(getActiveCompanySlug)`). Damit divergiert der **erste** Client-Render von der SSR-HTML, sobald localStorage einen Nicht-Default-Slug hält (= nachdem Mark einmal die Firma gewechselt hat). `activeCompanyName` (Z. 519, companies noch leer → Fallback auf rohen Slug) fließt in `EmployeeFileIndex` → Mismatch.

**Scope-Einordnung (Planer):** **Pre-existing**, **unabhängig von Slice 3** (Doppelrolle hat company-Logik nicht angefasst) und vom URL-Fix `17f94cc`. Klein + contained, eigener Mini-Fix (kein Architektur-Gate nötig; C-10 unberührt).

**Empfohlener Fix (minimal, SSR-sicher) — Executor:**
- `companySlug`-State mit dem **konstanten Default** initialisieren (SSR == erster Client-Render): `useState(DEFAULT_COMPANY_SLUG)` statt `useState(getActiveCompanySlug)`. Den `localStorage`-Lesezugriff erst **nach Mount** (in einem `useEffect`) durchführen und per `setCompanySlug` setzen. (Der bestehende Bootstrap-Effekt Z. 93–113 setzt den Slug ohnehin schon — ggf. reicht es, den Initializer auf den Default zu ziehen, sodass der erste Render deterministisch ist.)
- Optional defensiv: `DEFAULT_COMPANY_SLUG` aus `company-session.ts` exportieren (statt erneut hartzucodieren).
- **Gegencheck:** kein weiterer `localStorage`-Lesezugriff im Render-Pfad, der die SSR-HTML beeinflusst (Stacktrace zeigt nur diese eine Stelle).

**DoD:** `tsc --noEmit` 0 · **Hydration-Warnung weg** im Browser nach Firmenwechsel + Reload (`?new=1`-Ansicht **und** Index-Ansicht) · EC-09-Smoke unberührt (Generator/ZIP nicht angefasst) · Firmen-Switcher zeigt nach Reload weiterhin die zuletzt gewählte Firma (localStorage-Persistenz bleibt, nur zeitversetzt nach Mount). **Plan nicht umschreiben** — bei Norm-/Scope-Zweifel Frage an Planer.

**Gate:** Mark, ob als kleiner Sofort-Fix vor Slice 3b oder gebündelt. Planer-Empfehlung: **Sofort-Fix** (1 Datei-Logik, behebt sichtbare Dev-Warnung; blockt nichts).

### 2026-06-07 — ▶ Planer 5: Slice 3 geplant (Doppelrollen) → Bauauftrag steht, Bau gated auf Mark

**Bauauftrag an Executor:** `hq/10_Bridge/CURSOR_SLICE3_AUFTRAG.md` (Doppelrollen-Modellierung, code-only, sofort baubar). Schließt die Slice-2-Modell-Grenze (Engine kennt pro Person nur **eine** `roleType`; Verwaltung/GF-mit-Schicht fällt durchs F3-Gate).

- **Lösung (geschärft nach Mark 2026-06-07 „GF kann zusätzlich EK und/oder FK"):** additives **Niveau-Feld** `Employee.zusatzBewachungNiveau` (`"ek"`|`"fk"`, leer = keine Doppelrolle) → Engine-Context hebt das F3-Gate (effektive Bewachung) **und** wählt das SDL-Niveau. **Keine neue Normpflicht** — nur Trigger/Niveau auf bestehenden Regeln. **Anker: CL-40 / CL-01** (qualifiziert-Def. + §34a knüpft an Tätigkeit). **EK** → CL-21/CL-24 (16/40 UE); **FK** → CL-20/CL-25 (24/64 UE) + FK-Quali CL-10 („fachlich prüfen"). FK = EK-Basis + Aufschlag (deckt „und/oder" ab).
- **⚠️ F4-Verfeinerung (Mark bestätigt):** F4 („nur `roleType=Führungskraft`=FK") bleibt für Grundrollen; die Doppelrolle bekommt einen **expliziten, manuell gewählten** FK-Pfad (nicht automatisch). Kein Widerspruch zu F4 (EL/OL/SL bleiben EK).
- **⚠️ CL-10-Gate (Mark bestätigt):** FK-Quali-Posten (CL-10, „fachlich prüfen") nur **bei DIN-SDL/Auftrag** (`din1-*`/`din2-*`) — gilt für beide FK-Wege. **Bewusste Slice-2-Präzisierung** (vorher feuerte CL-10 für jede FK ohne SDL); bestehende Suite bricht nicht (gegengeprüft). Im Bauauftrag §2/§4.2 dokumentiert.
- **Umfang:** schema (`String?`) + types (`"ek"|"fk"`) + repository (5 Mapping-Stellen, Read normalisiert) + engine (effektive `bewachung`+`fuehrung`, Verwaltungs-/Praktikanten-Reduktion bei Doppelrolle unterdrücken) + presenter (`buildRequirementContext` + `isSecurityRole` doppelrollen-aware) + UI-Select (EK/FK) + 6 neue Engine-Tests. DoD/Tests im Bauauftrag.
- **EC-09/EC-10/keine-erfundene-Pflicht** gewahrt; Browser-Verifikation Pflicht.

**Executor: erst bauen nach Marks „los für Slice-3-Bau".** Zwei Gate-Punkte für Mark unten („Offene Entscheidungen").

### 2026-06-07 — ⚠️ Planer-4-Finding (Slice 3): Tally-Formular `vGNvY0` deckt Engine-Eingaben nur teilweise ab

**Kontext (Marks Frage beim Deploy):** Fragt das Live-Formular alle Felder ab, die die Slice-2-Engine (`RequirementContext`) braucht? **Antwort: nein — Teil-Abdeckung.** Soll-Ist gegen `requirement-engine.ts` (Z. 77–93) + `TALLY_FIELD_MAPPING.md`:

| Engine-Eingabe | im Formular? | CL (für künftige Felder) |
|---|---|---|
| `roleType` / `employmentType` / `qualification` + Dok-Uploads (§34a/BWR/EH/Brandschutz/Vertrag/Ausweis) | ✅ vorhanden | — |
| `sdlScopes` (Veranstaltung/Asyl/Objekt-Geltungsbereich) | ❌ fehlt | CL-20/21/22/24/25 |
| `drivesServiceVehicle` (Dienstfahrzeug ja/nein) | ❌ fehlt | CL-73 (heute „fachlich prüfen") |
| `ersteHilfeGueltigBis` / `brandschutzGueltigBis` (Ablaufdaten, nicht nur Datei) | ❌ fehlt | CL-08 (2 J.) / CL-23 (3 J.) |
| `appointmentLabels` (Beauftragungen/Bestellungen) | ❌ fehlt | appt-* (CL-08/23 u. a.) |
| `startDate` (Eintrittsdatum, treibt Fristen) | ❌ fehlt (nur Geburtsdatum) | CL-02 (6-Mon-Sachkunde) |

**Kein Deploy-Blocker:** Intake legt die Basis-Akte korrekt an; die fehlenden Treiber werden heute **manuell in der App** nachgepflegt (Slice-2-Erfassungsfelder: SDL-Mehrfachauswahl, Dienstfahrzeug, Fristdaten). Webhook-Umstellung bleibt richtig.

**Slice-3-Scope-Notiz (Planung gehört Planer):** Wenn der **Kunde** diese Angaben selbst im Formular liefern soll → Formular erweitern + Webhook-Mapping (`tally-employee-slots.json`) + Engine-Verdrahtung. Jede neue norm-getriebene Frage braucht eine `clauseId` (keine erfundene Pflicht). **Reiht sich neben die Doppelrollen-Lücke ein** (s. „Offene Entscheidungen für Mark") → beide zusammen in Slice-3-Planung abwägen. Mark: „Slice-3-Finding festhalten + Deploy weiter" entschieden (2026-06-07).

**Aufwands-Einordnung (präzisiert nach Mark-Rückfrage 2026-06-07):** Der Aufwand liegt **nicht beim Kunden** (pro MA nur wenige Klicks: SDL-Scope/Dienstfahrzeug/Eintrittsdatum = trivial; Gültig-bis-Daten = vom Zertifikat ablesen; Beauftragungen = erklärungsbedürftig). Der eigentliche Aufwand ist (1) **Bauarbeit**: jedes Feld über **alle 10 MA-Slots** mappen + Engine verdrahten; (2) **Norm-Mapping** mit `clauseId`; (3) **Daten-Qualität**: erklärungsbedürftige Felder (z. B. „was zählt als Objektschutz") brauchen Erklärtext, sonst falsche Kundenantworten. **Trade-off:** Erfassung an der Quelle (weniger manuelle Nachpflege/weniger Lücken) vs. längeres Formular (Abbruchquote, norm-richtige Fragestellung). **Planer-Empfehlung = Option C (Hybrid):** eindeutige Felder (SDL-Scope, Dienstfahrzeug, Eintrittsdatum) ins Formular; erklärungsbedürftige (Beauftragungen) zunächst manuell. **Entscheidung übers Gate (Mark), nicht allein Planer.**

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

### 2026-06-07 — ✅ Mark: „los" für Hetzner-Deploy → Pre-Deploy-Bauauftrag (Planer 3)

**Bauauftrag an Executor:** `CURSOR_HETZNER_PREDEPLOY_AUFTRAG.md` (klein, keine Architektur). Gates: `npm run build` grün (zentral — `next build` fährt tsc+ESLint, **kein** `ignoreDuringBuilds`) · EC-09-Smoke gegen Prod-Build im Browser · `.env.example`-Vollständigkeit · `db:push`-Trockencheck (nur `prisma/prisma/dev.db`).

**Planer-Entscheidung DB-Pfad (Checklisten-Punkt 1 „klären" = erledigt):** Es gibt **nur eine** DB, live `prisma/prisma/dev.db` (Prisma löst `file:./prisma/dev.db` relativ zum Schema-Ordner auf). **Kanonisch bleibt genau das** — kein Pfad-Churn vor Deploy; frischer VPS bekommt frische DB via `db:push`. Kosmetische Vereinheitlichung auf ein einzelnes `prisma/` = eigener Tech-Debt-Slice. `HETZNER_DEPLOY.md` Env-Tabelle + Backup-Pfad (zeigten fälschlich auf `prisma/dev.db`) **gefixt**.

**Build-Gate-Hinweis:** Lint-Errors bei `next build` → erst fixen; `ignoreDuringBuilds` nur nach Rückfrage (Lint-Gate nicht eigenmächtig aushebeln). T-02 hatte ESLint mal auf 0 — Executor bestätigt per echtem Build.

**Danach Mark (Server):** DNS/Subdomain · `.env.production.local` auf VPS · erster Deploy (systemd/nginx/certbot) · Webhook-PATCH auf Prod-URL · Backup-Cron auf `prisma/prisma/dev.db`. Details: `HETZNER_DEPLOY.md` + Bauauftrag.

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

**G4 — Phase-1-Mini-Gates (Planer 7, 2026-06-08) — ✅ ENTSCHIEDEN:** (a) Org-Titel = Dropdown + Freitext-Option; (b) nur Einsatzleitung = FK (DIN 77200), Objekt-/Schichtleitung bleiben EK; (c) getrennt → dieser Bauauftrag = Phase 1 (Doc-Auswahl bleibt vorerst, Phase 2 separat). `CURSOR_G4_AUFTRAG.md` v3 baufertig. **Nächstes Gate: Marks „los für G4-Phase-1-Bau".** *(Richtungs-/Architektur-Entscheide a–e von Mark wurden bereits in v2 eingearbeitet; G4 als eigener Slice = ja.)*

**G4 — Anlege-Formular-Migration (Planer 6, 2026-06-07) — ✅ Richtung entschieden (eigener Slice, In-App, Tally-entkoppelt); Phase-1-Gates s. o.:**
- **Kontext:** „Neue Person" zeigt zuerst das **alte Tool-1-Form** (`EmployeeForm.tsx`, `displayMode="master"`, engl. Labels, Altmodell `roleId`/`appointmentIds`/Freitext-`roleType` + Doc-Template-Auswahl für den Generator). Die **neuen Requirement-Felder** (Grundrolle-Enum, Doppelrolle, SDL/Geltungsbereich, Beschäftigungsart, Fristen, UE) leben erst **danach** in der Akte (`EmployeeFilePersonRolleEditTable.tsx` + Engine). Deckt sich mit Planer-4-UX-Notiz + Executor-FRAGE.
- **Planer-6-Einordnung (Spur P, keine Eigenentscheidung):** Das ist eine **Architektur-/Scope-Änderung = eigener Slice** (C-10, Mark-Gate) — **nicht** in Slice 3 enthalten, vom Executor korrekt NICHT eingeplant. Berührt `EmployeeForm.tsx` (master) + `lib/validations/employee-form.ts` (Zod) + Verhältnis zur Doc-Template-Auswahl (bleibt im Anlege-Schritt oder wandert in den Generator?) + Verhältnis zur Tally-Feldlücke (Slice 3b).
- **Frage an Mark (Gate):** (a) Anlege-Formular auf das neue Requirement-Modell **vereinheitlichen** (eigener Slice), oder (b) **vorerst belassen** (Legacy-Create + Nachpflege in der Akte, by design) und Slice 3b/4 vorziehen? → Planer 7 plant den Slice erst nach Marks Entscheid (Reihenfolge ggü. 3b/4).

**Slice-3-Planung (Planer 5, 2026-06-07) — ✅ G1/G2/G3 ENTSCHIEDEN (Mark) → ✅ GEBAUT (`a276d38`) → ✅ ABGENOMMEN (Planer 6):**
- **G1 — Slice-3-Scope ✅ Mark: ja.** Slice 3 = **nur Doppelrollen-Modellierung** (`CURSOR_SLICE3_AUFTRAG.md`). **Tally-Formular-Feldlücke** (Option C Hybrid) = **Slice 3b**, gated darauf, dass Mark die Felder zuerst im Tally-Formular anlegt.
- **G2 — Numerierung ✅ Mark: bestätigt.** Doppelrolle = **Slice 3**, Ampel-/Status-Ansicht = **Slice 4** (verschoben gegenüber dem Original-`CURSOR_BAUAUFTRAG_TOOL2.md`).
- **G3 — Niveau-Modell ✅ Mark: ja** (2026-06-07): Doppelrolle = **Niveau-Selektor EK/FK** (statt Boolean). FK manuell wählbar, baut auf EK auf. FK-Quali (CL-10) **nur bei DIN-SDL**. Bauauftrag entsprechend geschärft (§1/§2/§3/§4/§6/§8).
- **✅ BAU FREIGEGEBEN (Mark, 2026-06-07, 22:14):** Executor darf `CURSOR_SLICE3_AUFTRAG.md` (Doppelrolle, Niveau EK/FK) bauen. **Neuer Executor-Chat auf `main`** → liest `CLAUDE.md` + HANDOFF (HIER STARTEN) + `CURSOR_SLICE3_AUFTRAG.md`, baut den Slice, hält EC-09-Smoke + `tsc` grün, committet mit Marks OK, hängt EINEN Ergebnis-Eintrag an. **Plan nicht umschreiben.** Form-Feldlücke = Slice 3b (separat, gated auf Marks Tally-Arbeit).

**Slice-2-Review Findings 3+4 — ✅ ENTSCHIEDEN (Mark, 2026-06-07):**
- **Finding 4 = Variante B + Upgrade-Pfad:** Nur `roleType = "Führungskraft"` zählt als **FK** (24 UE + FK-Quali CL-10). **Einsatzleitung, Objektleitung, Schichtleitung = EK/SMA-Niveau (16 UE), kein Auto-FK.** Sie bleiben **Bewachungsrollen** (volles Basis-Pflichtset). **Zusatz (Phase 2):** Upgrade-Pfad auf FK, wenn die Person die FK-Schulung absolviert (künftig über Cert-Expert Distance-Learning direkt im Portal) — Design-Notiz, nicht Slice-2-Engine.
- **Finding 3 = gaten, BESTÄTIGT (Mark):** SDL-Schulungssoll nur bei Bewachungsrolle. Beispiel akzeptiert: reine Bürokraft ohne Bewachung → kein SDL-Soll. Korrekt für den Normalfall (eine Rolle).
- **🟡 Design-Lücke „Doppelrolle" (Mark-Feedback, Phase 2 — NICHT Slice 2):** Die Engine kennt pro Person nur **eine** `roleType`. Eine Person mit **Verwaltung/Geschäftsführung + zusätzlich Bewachung** (z. B. GF, der mit auf Schicht geht — bei kleinen Firmen real) kann heute **nicht** abgebildet werden → bekäme fälschlich kein Bewachungs-Set/SDL-Soll. Lösung später: Doppelrolle modellieren (z. B. Flag „übt zusätzlich Bewachungstätigkeit aus" oder Mehrfach-`roleType`). **Bis dahin Workaround:** solche Personen als Bewachungsrolle erfassen. → als Design-Notiz für Slice 3+ vorgemerkt.

→ F3/F4 in **`CURSOR_FINDINGS_1_2_AUFTRAG.md`** als Engine-Auftrag verdrahtet. *(Finding 1+2 = Presenter/Engine-Feinschliff; Finding 5 kosmetisch.)*

---

## ✅ Archiv (erledigt)

Vollständige Historie (erledigte Aufgaben, alte Abschlüsse, frühe Reviews) → **`HANDOFF_ARCHIV.md`**.
