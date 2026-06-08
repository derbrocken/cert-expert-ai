# CURSOR_NAECHSTE_QUEUE — Bau-Liste für den nächsten Bot (Planer, 2026-06-08)

> **Kontext:** EK/FK-Refinement = ✅ fertig + gepusht (`e1899dd`), Planer-abgenommen (tsc 0 · Engine 27/27 · EC-09-ZIP 200 · Migration live · norm-konform, keine neue CL/UE). Damit ist Queue-Punkt 1 des vorigen Laufs zu. Diese Datei = die nächste Bau-Reihenfolge im neuen Modus (1 Planer-Chat steuert + Subagent baut). Quelle: `CURSOR_SCHULUNGSKATALOG_PLANUNG.md` §5/§6 + die zwei geparkten Lauf-Punkte.
> **Rollen-Kontrakt:** Norm-Mapping/Scope = Planer (Spur P). Bot baut nur den freigegebenen Auftrag, parkt bei Zweifel. Jede UE/Pflicht braucht `clauseId` — keine erfundenen Werte. Guardrails: EC-09 (Generator/ZIP nie brechen), EC-10 (kein Freigabe-/Auditstatus), kein Commit von `.env`/`.db`/`hq/03_Kundenprojekte/**`. Verifikation im echten Browser :3001.

---

## 0. Geparkt / erledigt aus dem letzten Lauf (kein Bot-Bedarf)
- **G4 Phase 2 (Doc-Auswahl → Generator-Tab):** Ziel ist durch die `displayMode="documents"`-Architektur **bereits erfüllt** → bleibt geparkt. Kein Bau ohne von Mark bestätigtes Rest-Delta (A/B/C/D in `CURSOR_G4_PHASE2_AUFTRAG.md` §3).
- **„Grüne UE-Übersicht weg":** diagnostiziert = **kein Rendering-Bug.** Die Karte ist `bewachung`-gegatet (F3, gewollt) und rendert bei EK/FK live. Nur-Klassifikation: betroffene Person ohne Bewachungs-Klasse → jetzt per Mehrfachauswahl EK/FK setzen. Echte Norm-Frage (Karte auch für Nicht-Bewachung?) = Planer-Gate, kein Bot-Fix.

---

## A. PLANER-VORLAUF (meine Arbeit, KEIN Bot) — Norm-Cross-Check §4
**Warum zuerst:** B/C berühren UE-Werte/Engine. Vorher muss jede Katalog-UE (Schulungskatalog §3) einer `clauseId` zugeordnet sein; Abweichung Katalog↔Matrix = „fachlich prüfen", nicht raten.
- Quelle: `NORM_MATRIX_Mitarbeiternachweise_v2.md` + `NORM_KLAUSEL_REGISTER_v1.md`.
- Knackpunkte: DIN-2 FK scope-spezifisch (Asyl 24 / Veranstaltung 16 / ÖPV 16 — **nicht** pauschal 24/64); DIN-2 EK (Asyl 40 / Veranstaltung 16 / ÖPV 40); DIN-1 modular 9×4 UE + FK 8 UE → Summenbildung; DIN-1 Jahres-UE 24 vs. 40 (CL-11).
- **Ergebnis:** CL-Mapping-Tabelle als Planer-Doku + Mark-Freigabe. **Erst danach** dürfen B/C die Engine anfassen.

---

## B. NÄCHSTER BOT-BAU (Empfehlung #1) — read-only Akte-/Vorzeige-Übersicht (Pt 1)
**Sicherster, wertvoller Einstieg: additiv, keine Engine-/UE-Änderung, kein EC-09-Risiko.**
- **Was kann Mark am Ende:** je Person eine **read-only Abschluss-/Vorzeige-Ansicht** (ohne überall-Stifte) — aggregiert die bereits berechneten Daten (Pflicht-Set + CL-Badges, Fristen, Ampel/Slice-4-Status, UE-Soll/Ist-Übersicht) in einer sauberen Sicht.
- **Scope:** reine Präsentations-Komponente über vorhandene Presenter/Engine-Ausgaben; **keine** neuen Norm-Regeln, **keine** UE-Werte berühren. EC-10-Disclaimer („rechnerisch · kein Freigabestatus") prominent.
- **DoD:** `tsc` 0 · EC-09-ZIP 200 unberührt · Browser: Ansicht rendert je Person korrekt (Bewachung + Verwaltung) · keine Engine-Datei geändert.
- **Tie-in (später, eigener Punkt):** dieselbe Info als Audit-Export-Datei.

## C. DANACH (Empfehlung #2) — Termin-Planung Schulungen/Unterweisungen (Pt 3) — ✅ FERTIG + PLANER-ABGENOMMEN
**▶ Detail-Bauauftrag = `CURSOR_C_TERMINPLANUNG_AUFTRAG.md` — gebaut `fbe1980`, Planer-abgenommen (`CODE_REVIEW.md`, unabhängig re-verifiziert: tsc 0 / 49 Tests / Engine+UE unberührt / EC-09 200). Offener Minor: Live-Klick-Abnahme Upload (optional, Mark).**
**Füllt die echte Lücke (§7): heute nur Sammel-Slots, kein Datum pro Einzelschulung.**
- **Was kann Mark am Ende:** pro Person/Schulungs-Posten ein **geplantes Datum**; **Sammel-Datum für alle + einzeln überschreibbar**; verortet im Generator-/Planungsbereich. Speist die Ampel: geplant = gelb, überfällig = rot.
- **Scope:** operative Schicht (Datums-/Planungsdaten), **kein Norm-Erfinden**. Neues Datenmodell: Slot/Feld je Katalog-Schulung mit `plannedDate` (+ später Gültigkeit). Bulk-Set + Per-Item-Override.
- **Abhängigkeit:** profitiert vom §4-Cross-Check (welche Schulungen/UE existieren), aber Termine selbst sind norm-neutral → teilweise parallel möglich.
- **DoD:** `tsc` 0 · neue Felder über Repository persistent (Save/Load/Migration) · Ampel zeigt geplant/überfällig · EC-09 unberührt.

## D. DANACH (Empfehlung #3) — Modell-Sauberkeit Bestellung/Schulung/Unterweisung (Pt 2) + Brandschutz-Regel
- **Was:** die drei Kategorien (Beauftragung/Bestellung · Schulung · Unterweisung) in der Akte klar trennen, jede mit CL-Beleg. Brandschutz-Regel (§2): Pflichtfeld nur bei DIN-Pflicht (CL-23, scope-gated), **Gültigkeit aber immer tracken, sobald Nachweis hochgeladen** (Erste-Hilfe-CL-08-Muster).
- **Abhängigkeit:** berührt Norm-Logik → **erst nach §4-Cross-Check + Planer/Mark-Freigabe** der UE-Zuordnung.
- **DoD:** jede Pflicht CL-belegt · Engine-Suite erweitert/grün · EC-09/EC-10 gewahrt.

---

## E. Offene Fäden (nicht in dieser Queue, eigenes Gate)
- **Ist-UE-Auto-Summe:** braucht neues strukturiertes „Nachweis-mit-UE"-Datenmodell → eigener norm-sensibler Slice.
- **DB-Doppelpfad** (`prisma/prisma/dev.db` vs `prisma/dev.db`): riskanter Infra-Refactor → Mark-Gate, eigenes Fenster.
- **DEKRA** (CL-60–62), **Legal-Input** (CL-70–73): warten auf Mark/DEKRA-Input.

---

## ▶ Empfohlene Reihenfolge
1. **A** (Planer-Cross-Check §4 — ich) — Gate für C/D.
2. **B** (read-only Übersicht, Bot) — sofort baubar, kein Norm-Risiko, kann parallel zu A laufen.
3. **C** (Termin-Planung, Bot).
4. **D** (Modell-Trennung + Brandschutz, Bot) — nach A.

**Mark-Gate:** Reihenfolge/Scope bestätigen oder umsortieren, dann starte ich den ersten Bot mit dem passenden Detail-Bauauftrag.
