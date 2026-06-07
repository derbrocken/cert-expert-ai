# CURSOR_AUTONOMOUS_RUN_ORDER — Unbeaufsichtigter Dauerlauf (Mark-Vollmacht)

> **Status:** AKTIV ab 2026-06-08. **Mark-Vollmacht (verbindlich, diese Session):** „alles, ich lasse alles an, er soll das Projekt fertig machen … absolute Vollmacht. A (autonom committen). Zeitbegrenzung: heute Nachmittag, Montag."
> **Das heißt:** Ein **einzelner Executor-Agent** baut die Arbeits-Queue unten **eigenständig** ab — plant den nächsten Schritt selbst, baut, **reviewt sich selbst gegen Norm-Matrix + Klausel-Register**, **committet autonom** nach grüner Verifikation, schreibt Abschluss-Eintrag, nimmt den nächsten Punkt. Kein Warten auf Marks Gate **innerhalb** dieser Queue.
> **Zeitfenster:** läuft bis **Montag (2026-06-08) Nachmittag**. Danach: End-of-Run-Summary für Mark, stoppen.
> **Parallel:** Der **Bug-Fixer** läuft im Hintergrund. Du bist nicht allein im Repo (s. §6 Koordination).

---

## 0a. Verhältnis zu `AUTONOMER_BAU_AUSBLICK.md` (Generalist, Spur P)
- Der Generalist hat einen **breiteren Roadmap-Ausblick** (`AUTONOMER_BAU_AUSBLICK.md`: Readiness-Ampel, DEKRA-Assembler, Alt→Neu-Doc-Migration, Hetzner) + die **gestaffelte Review-Kadenz** (inline pro Commit + tieferer Norm-Batch-Review *später* durch den Generalist). **Das gilt weiter** — lies es als Roadmap-/Norm-Kontext.
- **Dieses Dokument ist die Autoritäts-/Betriebsebene für Marks frischen 2026-06-08-Grant** (absolute Bau-/Commit-Vollmacht, autonom committen). Es **überholt** den älteren „Commit nur mit Marks OK / Mark = Gate"-Stand **nur für diesen Lauf** und nur innerhalb der Queue (§4).
- **Wo die Queues divergieren:** der **unmittelbar bestätigte** nächste Schritt = **G4 (heute Nacht von Mark gegated)**. Die DEKRA-/Readiness-Punkte des Generalisten sind die weitere Roadmap — aber alles, was **DEKRA (CL-60–62)/Legal (CL-70–73)** berührt, ist **STOP** (§5): nicht ohne externen Input bauen.
- **Review-Kadenz:** Mark hat „Selbst-Review pro Commit" gewählt (§2.4). Der **tiefere Norm-Batch-Review** des Generalisten bleibt zusätzlich möglich, wenn Mark ihn reinholt — kein Widerspruch.

## 0. Vollmacht — was JETZT erlaubt ist (sonst Gate)
Mark hat das übliche Pro-Schritt-Gate für diesen Lauf **delegiert**. Innerhalb der Queue darfst du eigenständig:
- **Architektur-/Scope-Entscheidungen** für die gequeueten Slices treffen (C-10-Gate ist für diesen Lauf an dich delegiert).
- **Bauen** (Produktivcode), **`db:push`** auf der lokalen Dev-DB, Tests schreiben/umstellen.
- **Autonom committen** (`feat`/`fix`/`refactor`/`chore`, conventional) **nach** vollständig grüner Verifikation (§2).
- Den **nächsten Slice selbst planen** (Bauauftrag schreiben), wenn die Queue es verlangt — du bist hier Planer **und** Executor in einem.

## 1. 🔴 HART — bleibt auch unter Vollmacht unverhandelbar
Diese Grenzen sind **fachlich/rechtlich**, nicht Marks Geschmack. Verletzung zerstört das Produkt (Auditfähigkeit) → niemals brechen:
1. **EC-09:** Person → Akte → Doc-Chips → ZIP-Generator darf **nie** brechen. Vor **jedem** Commit EC-09-Smoke **im echten Browser** grün (ZIP `POST /employee-automation` 200, kein 5xx). Geht EC-09 nicht grün → **Change zurücknehmen, NICHT committen**, Punkt in HANDOFF parken, nächster Queue-Punkt.
2. **EC-10:** keine automatische Freigabe-/Auditfähigkeits-/Zertifizierungsaussage. Eingehende Nachweise = `unchecked`. „rechnerisch erreicht" ≠ „auditfähig/einsatzbereit".
3. **Keine erfundene Normpflicht.** Jede Norm-Regel trägt eine **`clauseId` (CL-xx)** aus `knowledge/NORM_KLAUSEL_REGISTER_v1.md`. **Kein CL → nicht zulässig** → als „fachlich prüfen" markieren + in HANDOFF loggen. **Niemals** UE-Werte/Fristen/Pflichten erfinden.
4. **DSGVO:** **nie** committen: `prisma/**/*.db`, `.env*`, Kundendaten (`hq/03_Kundenprojekte/**`). Nur Code + Bridge-Doku.
5. **Verifikation im Echten** (Browser/Tally), nicht per Skript-Fake.
6. **Keine destruktiven/irreversiblen Ops** ohne Not: kein `push --force`, kein Hard-Reset auf fremde Commits, kein DB-Wipe, kein Löschen von Kundendaten/Akten.

## 2. Verifikations-Gate vor JEDEM Commit (alle vier grün)
1. **`tsc --noEmit` = 0** im COS-Ordner.
2. **Engine-Suite grün** (`tsx --test`, aktuell 20/20 — nach Refactor entsprechend umgestellt + grün).
3. **EC-09-Smoke im echten Browser** (:3001): valide Person → Generator → ZIP 200, kein 5xx.
4. **Selbst-Review gegen Norm:** jede berührte Regel hat eine CL-ID; keine neue erfundene Pflicht; EC-10 gewahrt; Befund kurz im Abschluss-Eintrag.

Erst wenn alle vier grün → committen.

## 3. Betriebs-Loop (pro Queue-Punkt, immer gleich)
1. **Lesen:** `CLAUDE.md` + `HANDOFF.md` (HIER STARTEN + letzte Einträge) + den relevanten Bauauftrag + `NORM_MATRIX_…v2` + `NORM_KLAUSEL_REGISTER_v1`.
2. **(falls nötig) Planen:** Bauauftrag für den Punkt schreiben/aktualisieren (Was-kann-Mark-am-Ende, DoD, betroffene Dateien, jede Regel mit CL-ID).
3. **Bauen:** exakt den Scope des Punkts (nicht mehr).
4. **Verifizieren:** §2 (alle vier grün). Browser-Akzeptanz für die neuen Pfade durchklicken.
5. **Committen:** conventional message; **nur** Code + Bridge-Doku (kein `.env`/`.db`/Kundendaten).
6. **Abschluss-Eintrag** in `HANDOFF.md` (unter „Von Cursor an Claude"): fertig / offen / **Commit-Hash** / Selbst-Review-Befund. HIER-STARTEN-Status kippen.
7. **Nächster Punkt.** Bei ~70–80 % Kontext → diesen Run-Order + HANDOFF-Stand zusammenfassen und in **frischem Chat** weiterlaufen (Gedächtnis = Repo, nicht Chat).

## 4. Arbeits-Queue (der Reihe nach, bis Montagnachmittag)
> Reihenfolge = Risiko-sicher (Mark: „volle Kette, Projekt fertig machen").

1. **G4 Phase 1** — `CURSOR_G4_AUFTRAG.md` v3 bauen: Datenmodell `roleClass` (EK/FK/Verwaltung/Praktikant/Sub) + **idempotente Read-Migration** (alte `roleType`-Strings→`roleClass`) + **Engine-Refactor** (`requirement-engine.ts` klassifiziert nach `roleClass`, keine neue CL/UE) + **Engine-Suite umstellen** (20/20 + Migration-Mapping-Test + „Einsatzleitung=FK"-Szenario + Invariante) + **schlankes Anlege-Formular** (`EmployeeForm.tsx` master: Norm-Klasse-Select + Org-Titel-Dropdown-mit-Freitext + Requirement-Felder; Alt-Felder `trainingHours`/Freitext-`roleType` raus) + Zod-Schema. **Doc-Auswahl bleibt vorerst, wo sie ist** (Phase 2!). → verifizieren §2 (inkl. Migration: blubermann/joe behalten korrekte Klasse über Reload) → committen → Abschluss-Eintrag.
2. **G4 Phase 1 Selbst-Review** — Diff gegen `CURSOR_G4_AUFTRAG.md` §6-DoD + Norm-Matrix: alle 5 Klassen + Doppelrolle je ein Durchlauf, CL-belegt; Slice-3-Doppelrolle unverändert grün; Befund in `CODE_REVIEW.md`.
3. **G4 Phase 2 planen + bauen** — Bauauftrag `CURSOR_G4_PHASE2_AUFTRAG.md` schreiben (Doc-Auswahl Core/Overlay → **Generator-Tab** verlagern, `displayMode="documents"`-Logik wiederverwenden, Default-Vorauswahl), dann bauen. **EC-09 = Hauptrisiko** → besonders gründlich verifizieren (neues Formular → Generator-Tab → Doc-Chips → ZIP 200). Committen + Abschluss + Mini-Review.
4. **Slice 4 (Ampel-/Status-Ansicht, QFD #1)** planen + bauen — Status pro Pflicht-Posten/Person aggregiert anzeigen. **EC-10 hart:** Ampel = **rechnerischer** Status („offen/unvollständig/rechnerisch erreicht/fachlich prüfen"), **niemals** „auditfähig/freigegeben". Keine neue Normpflicht; nutzt die bestehenden Engine-Stati. Bauauftrag → bauen → verifizieren → committen → Abschluss.
5. **Resttechnik, wenn Zeit:** Ist-UE-Auto-Summe (aus erfassten Nachweisen, sauber CL-belegt), DB-Doppelpfad-Vereinheitlichung (eigener kleiner refactor, EC-09 grün halten). Nur, wenn 1–4 stabil committet sind.

## 5. STOP / parken-statt-entscheiden (Frage in HANDOFF, nächster Punkt)
- **Norm-Zweifel / fehlende CL-ID:** nicht erfinden → „fachlich prüfen" + Frage loggen. **DEKRA-Themen (CL-60–62)** und **Legal-Input (CL-70–73, BewachV/Wachbuch/Bewacherregister/DGUV)** brauchen externen Input → **STOP**, nur Frage parken, NICHT bauen.
- **EC-09 lässt sich nicht grün bekommen:** Change zurücknehmen, parken, nächster Punkt. Lieber ein Slice weniger als ein kaputter Generator.
- **Echte Architektur-Sackgasse / >3 Fehlversuche am selben Problem:** aufhören zu hämmern, sauberen Zwischenstand committen (falls grün) oder zurücknehmen, präzise Frage in HANDOFF, nächster Queue-Punkt.
- **Etwas würde `.env`/`.db`/Kundendaten committen oder eine destruktive Op verlangen:** niemals — überspringen + loggen.

## 6. Koordination mit dem Bug-Fixer (parallel im Hintergrund)
- **Vor Start und vor jedem Commit:** `git status`/`git log` prüfen; falls der Bug-Fixer committet hat, **rebase/pull** sauber, nicht überschreiben. **Niemals `--force` auf `main`.**
- Conventional Commits + ein Abschluss-Eintrag pro Slice → Historie bleibt für beide lesbar.
- Bei Konflikt im selben File: Bug-Fixer-Änderung respektieren, eigene sauber darauf aufsetzen. Im Zweifel kleiner committen.
- Nicht in Dateien schreiben, die gerade ein anderer Agent offen hält (Save-Konflikt) — kurz prüfen.

## 7. End-of-Run (Montagnachmittag oder Queue leer)
- **Summary-Eintrag** in `HANDOFF.md`: jeder Commit-Hash + was er tut, aktueller Stand pro Queue-Punkt (fertig/teilweise/geparkt), **alle geparkten Fragen für Mark** gebündelt, nächster empfohlener Schritt.
- HIER-STARTEN-Box auf den realen Endstand setzen.
- Stoppen. Nicht über das Zeitfenster hinaus weiterbauen.

---

## ▶ Copy-Paste-Kickoff-Prompt (frischer Executor-Chat auf `main`)
> Du bist der **autonome Executor** für den Dauerlauf bis **Montagnachmittag (2026-06-08)**. Mark hat **absolute Bau-/Commit-Vollmacht** erteilt (autonom committen nach grüner Verifikation; volle Kette, Projekt fertig machen; du planst + baust + reviewst dich selbst). Lies **zuerst** `CLAUDE.md` + `hq/10_Bridge/HANDOFF.md` (HIER STARTEN + letzte Einträge) + **`hq/10_Bridge/CURSOR_AUTONOMOUS_RUN_ORDER.md`** (deine Betriebsanleitung) + `hq/10_Bridge/CURSOR_G4_AUFTRAG.md` (v3, erster Queue-Punkt) + `knowledge/NORM_MATRIX_Mitarbeiternachweise_v2.md` + `knowledge/NORM_KLAUSEL_REGISTER_v1.md`.
> Arbeite die **Arbeits-Queue (§4)** der Reihe nach ab, im **Betriebs-Loop (§3)**, mit dem **Verifikations-Gate (§2)** vor **jedem** Commit. Halte die **harten Grenzen (§1)** unbedingt: EC-09 (Generator nie brechen), EC-10 (kein Freigabestatus), keine erfundene Normpflicht (jede Regel CL-belegt — im Zweifel „fachlich prüfen" + loggen, niemals erfinden), kein Commit von `.env`/`.db`/Kundendaten. **Parke (§5)** statt zu raten bei Norm-Zweifel/DEKRA/Legal/EC-09-rot/Sackgasse und geh zum nächsten Punkt. **Koordiniere (§6)** mit dem parallelen Bug-Fixer (rebase, kein force). Am Ende: **End-of-Run-Summary (§7)** für Mark. Verifiziere im **echten Browser** (:3001), nicht per Skript. Leg los mit Queue-Punkt 1 (G4 Phase 1).
