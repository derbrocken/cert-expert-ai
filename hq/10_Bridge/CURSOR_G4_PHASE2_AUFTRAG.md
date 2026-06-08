# CURSOR_G4_PHASE2_AUFTRAG — Doc-Auswahl → Generator-Tab (Phase 2)

> **Status (2026-06-08, Executor autonomer Lauf):** ⏸️ **GEPARKT — Befund: Ziel scheint bereits erfüllt.** Vor einem Bau in den EC-09-kritischen Generator braucht es eine Mark-/Planer-Bestätigung des konkreten Rest-Deltas (unten). Kein Bau ohne klares, reviewtes Ziel (EC-09 = Hauptrisiko).

## 1. Auftrag laut Run-Order §4.3
Doc-Auswahl (Core aus `roleId`→`selectedRole.documents`, Overlay aus `appointmentIds`) **in den Generator-Tab verlagern**, `displayMode="documents"`-Logik wiederverwenden, Default-Vorauswahl, Select-All/Deselect. EC-09 = Hauptrisiko.

## 2. Befund (read-only verifiziert, Code-Stand nach G4 P1 `047878c`)
**Die Doc-Auswahl liegt bereits im Generator-Tab — das Phase-2-Ziel (Gate b) scheint durch die bestehende `displayMode`-Architektur + G4 Phase 1 bereits erreicht:**

- `EmployeeAutomationPage.tsx` (Z. 621–632): der **Generator-Tab** rendert `EmployeeForm displayMode="documents"` → **nur die Doc-Chips** (Core-Rollen-Docs + Overlay-Beauftragungs-Docs).
- `EmployeeForm.tsx`: `showDocuments = displayMode === "full" || "documents"`, `showMaster = "full" || "master"`. Das **Anlege-Formular** läuft als `displayMode="master"` → **`showDocuments=false`** → **keine Doc-Chips im Anlege-Schritt** (nach G4 P1 ist master = nur Stammdaten/Norm-Klasse).
- Doc-Chip-Mechanik im `documents`-Mode bereits vorhanden: Default-Vorauswahl beim Rollenwechsel (`setSelectedRoleDocIds(new Set(selectedRole.documents.map(d=>d.id)))`), `selectAllRoleDocs`/`deselectAllRoleDocs`/`deselectAllAppDocs`, Overlay-Toggle.
- Anlege-Formular setzt `roleId` (Doku-Vorlage, Pflicht) + `appointmentIds` → der Generator-Tab/Generator hat die Doc-Palette unverändert. EC-09-ZIP `POST /employee-automation` 200 browser-verifiziert nach G4 P1.

→ **„Doc-Auswahl passiert im Generator-Tab (nicht mehr im Anlege-Schritt)" (CURSOR_G4_AUFTRAG.md §1) ist erfüllt.**

## 3. Präzise OFFENE FRAGE an Mark/Planer (vor jedem Bau)
Welches **konkrete Rest-Delta** soll Phase 2 liefern, da das Verlagern bereits erledigt scheint? Optionen, die ich sehe (bitte auswählen/präzisieren):
- **(A) Nichts mehr — Phase 2 = bereits erledigt** → nur formell abnehmen, Queue auf Slice 4.
- **(B) Batch-Export-Doc-Auswahl:** Der untere ZIP-Export-Balken (`generateBar` + `handleGenerate`) exportiert alle batch-gewählten Personen mit deren je gespeicherter `selectedRoleDocIds`. Soll es dort eine **sammel-/sichtbare Doc-Auswahl** geben (statt nur per Person im Generator-Tab)?
- **(C) Eigenständiger Generator-Tab außerhalb der Person-Akte** (globaler Generator statt per-Person-Dossier-Tab)?
- **(D) Default-Vorauswahl-/UX-Feinheiten** (z. B. Persistenz der Abwahl, Sichtbarkeit der Core/Overlay-Zähler) — konkrete UX-Wünsche?

## 4. Warum geparkt statt gebaut
- **EC-09 = Hauptrisiko** (Generator/ZIP). Ohne klares, von Mark/Planer bestätigtes Rest-Delta würde ein Umbau am Generator Risiko ohne belegten Nutzen erzeugen.
- **Sequencing (Gate c / §9):** Phase 2 erst **nach unabhängigem Planer-Review von Phase 1** (`047878c`). Bisher liegt nur ein **Executor-Selbst-Review** vor.
- Run-Order-Parken-Regel (§5): Architektur-/Scope-Unklarheit → präzise Frage parken, nächster Queue-Punkt (Slice 4).

## 5. Wenn bestätigt wird, dass etwas zu bauen ist
DoD bleibt: `tsc` 0 · Engine-Suite grün · **EC-09 echter Browser** (neues Formular → Generator-Tab → Doc-Chips → ZIP 200, kein 5xx) · EC-10-Wording · keine erfundene Normpflicht. Dann Bau + Commit + Abschluss + Mini-Review.
