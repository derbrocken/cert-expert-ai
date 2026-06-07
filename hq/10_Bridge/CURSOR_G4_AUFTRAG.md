# CURSOR_G4_AUFTRAG — Anlege-Formular auf Requirement-Modell migrieren (In-App, Tally-entkoppelt) + Rollenmodell-Refactor

> **Status:** v3 — **alle drei §7-Mini-Gates von Mark entschieden (Planer 7, 2026-06-08)**; Bauauftrag baufertig. Empfohlener Bau = **Phase 1** (§9, getrennt). **Bau erst nach Marks finalem „los".** Rollen-Kontrakt: Executor baut nur, was hier steht; echte Weichen = Mark-Gate.
> **Auslöser:** Mark-Entscheid 2026-06-07/08 (Browser-Demo Slice 3): Tally-Erfassung zu aufwändig → **In-App-Erfassung, von Tally entkoppelt**; **Rollenliste überarbeiten**; **G4 zuerst** (vor Slice 4; Slice 3b zurückgestellt).
> **⚠️ Scope-Hinweis:** Marks Gate-Entscheide (unten §0) machen aus G4 **mehr als nur Formular-UI** — es kommt ein **Rollenmodell-Refactor** (Engine-Klassifikation) + **Daten-Migration** + **Ziel-Architektur** (Doc-Auswahl wandert in den Generator) hinzu. Berührt die in Slice 3 abgenommene Engine → **Tests/Re-Review nötig**. Empfehlung: in sicheren Teil-Schritten bauen (§9).

---

## 0. Mark-Gate-Entscheide (verbindlich, diese Session)
- **a) `roleType` ↔ `roleId`:** ~~beide getrennt~~ → durch (c) überholt: **Norm-Klasse ist primärer Engine-Input**, `roleId` (Doku-Template) bleibt separat fürs Generieren.
- **b) Doc-Template-Auswahl:** **Ziel-Architektur bauen** → Doc-Auswahl (Core/Overlay) **wandert in den Generator-Tab**; das Anlege-Formular wird schlank (nur Person + Norm-Klasse + Requirement-Felder).
- **c) Rollenliste:** **VEREINFACHEN** → primäres Feld = **Norm-Klassifikation** (`EK` / `FK` / `Verwaltung` / `Praktikant` / `Subunternehmer`); **Org-Titel** (SMA, Schichtleitung, Objektleitung, Einsatzleitung, Geschäftsführung, Bürokraft …) als **optionales Unterfeld** (Anzeige/Org-Chart, mit Default-Mapping auf die Norm-Klasse).
- **d) Alt-Felder:** **„Training Hours" + Freitext-„Role Type" raus.**
- **e) Einsatzleitung = FK** (Mark: „nimm FK") — **ändert die bisherige Variante-B-Zuordnung** (EL war EK). Norm-Stütze: §3.12 Einsatzleitung führt operativ; §4.2 verlangt mind. **eine FK** in der Einsatzleitung. **Objektleitung/Schichtleitung:** Mark hat nur Einsatzleitung explizit auf FK gesetzt → Default für OL/SL **bleibt EK** (Minor-Gate §7.b, falls Mark auch die anheben will).

## 1. Was kann Mark am Ende (Nutzerergebnis)
- „Neue Person" in einem **schlanken** Formular anlegen: Name/Geburtsdatum/Vertragsbeginn · **Norm-Klasse** (EK/FK/Verwaltung/Praktikant/Sub) · optional **Org-Titel** · Doppelrolle EK/FK · Beschäftigungsart · Qualifikation · SDL/Geltungsbereich · Fristen (EH/Brandschutz) · Dienstfahrzeug — **ohne Tally**.
- Direkt danach zeigt die Akte ein gefülltes, CL-belegtes Pflicht-Set (Engine).
- **Dokument-Auswahl** für den ZIP-Export passiert im **Generator-Tab** (nicht mehr im Anlege-Schritt).
- **Generator/ZIP funktioniert unverändert** (EC-09, §3).

## 2. Ausgangslage (read-only verifiziert, Code-Stand `01f720b`)
- **Legacy-Anlege-Formular:** `EmployeeForm.tsx` (`displayMode="master"`). Alt-Modell: `roleId` (Pflicht), `appointmentIds[]`, **Freitext-`roleType`**, `trainingHours`, IDs. Labels teils englisch. **Doc-Auswahl** (Core aus `roleId`→`selectedRole.documents`, Overlay aus `appointmentIds`) sitzt **im selben Formular** (`displayMode` `documents`/`full`).
- **Zod-Schema** `validations/employee-form.ts`: `roleId`/`fullName`/`birthday`/`startDate` Pflicht; `roleType`/`employmentType`/`qualification`/`trainingHours` `optional()`.
- **Neu-Modell (heute nur Akte):** `EmployeeFilePersonRolleEditTable.tsx` + `requirement-engine.ts`.
- **Engine-Rollenklassifikation (Ist):** String-Matching auf 9 Org-Rollen — `FUEHRUNG_ROLES={Führungskraft}`, `LEITUNG_BEWACHUNG_ROLES={Einsatzleitung, Objektleitung, Schichtleitung}` (=EK), `VERWALTUNG_ROLES={Bürokraft / Verwaltung, Geschäftsführung}`, Praktikant, `Subunternehmer-SMA`. `isBewachungsrolle()` + `isFuehrungskraft()` etc. lesen `ctx.roleType`.

## 3. 🔴 EC-09-KRITISCH — Generator/ZIP darf NICHT brechen
- Der Generator zieht **Core-Dokumente** aus `selectedRoleDocIds` (aus `roleId`→`selectedRole.documents`) und **Overlay** aus `selectedAppointmentDocIds`.
- **Da die Doc-Auswahl in den Generator-Tab wandert (b):** Der Generator-Tab muss `roleId`/`appointmentIds` weiterhin kennen und die Doc-IDs **dort** auswählbar machen — mit **sinnvollem Default** (alle Core-Docs der Rolle vorausgewählt, wie heute beim Rollenwechsel). Das Anlege-Formular setzt `roleId` (ggf. Default aus Norm-Klasse/Org-Titel, §4.4) + `appointmentIds`, aber **nicht mehr** die Doc-Chip-Auswahl.
- **DoD-Gate (Phase 1):** EC-09-Smoke = Person über das **neue** schlanke Formular anlegen → Doc-Auswahl **am heutigen Ort** (unverändert) → ZIP `POST /employee-automation` 200, kein 5xx. (Doc-Auswahl-Verlagerung in den Generator-Tab = Phase 2.)
- **Risiko-Minimierung:** Gate c = getrennt → **Phase 1 baut nur die Erfassung, lässt die Doc-Auswahl, wo sie ist** (EC-09 minimal berührt); Generator-Umbau = Phase 2 (§9, §4.5).

## 4. Vorgeschlagener Umbau (Executor)
### 4.1 Datenmodell — neues `roleClass`-Feld (Norm-Klasse)
- Neues Feld **`roleClass`**: Union `"ek" | "fk" | "verwaltung" | "praktikant" | "subunternehmer"` (Engine-Primär-Input). `Employee` + Prisma (`String?`, **kein** `@default` → SQLite-sicher, vgl. Slice-2-P2023-Lehre) + Repository **alle Mapping-Stellen** + Read-Normalisierung.
- **`roleType`** wird zum **Org-Titel-Anzeigefeld** (Freitext/Dropdown, ohne Engine-Wirkung) — Wert bleibt erhalten, aber Engine liest ihn nicht mehr direkt.
- **Migration (kritisch):** bestehende `roleType`-Strings → `roleClass` mappen: `Führungskraft`/`Einsatzleitung`→`fk`; `Objektleitung`/`Schichtleitung`/`Sicherheitsmitarbeiter`→`ek`; `Bürokraft / Verwaltung`/`Geschäftsführung`→`verwaltung`; `Praktikant / Azubi`→`praktikant`; `Subunternehmer-SMA`→`subunternehmer`. (Einmalige Backfill-Logik beim Read, idempotent.)

### 4.2 Engine (`requirement-engine.ts`) — klassifiziert nach `roleClass`
- `isBewachungsrolle`/`isFuehrungskraft`/`isVerwaltung`/`isPraktikant`/`isSubunternehmer` auf **`roleClass`** umstellen (statt String-Set auf Org-Titel). Mapping: `fk`→Bewachung+Führung; `ek`→Bewachung; `verwaltung`→keine Bewachung; `praktikant`→reduziert; `subunternehmer`→Bewachung+„fachlich prüfen".
- **Keine neue CL/UE** — nur Klassifikations-Quelle ändert sich; Pflicht-Set/Trigger/CL-IDs bleiben identisch (CL-01/03/04/05/06/07/08, CL-10 FK, CL-20/21/24/25 SDL, CL-42/§4.13 Sub).
- **Slice-3-Doppelrolle bleibt** (`zusatzBewachungNiveau` ek/fk hebt Bewachung/treibt FK) — unverändert.
- **Tests:** Engine-Suite (20/20) auf das neue Modell umstellen + Migration-Mapping testen; **Einsatzleitung=FK** als Szenario (FK-Set + CL-10 bei DIN-SDL). Invariante (keine erfundene Pflicht) bleibt grün.

### 4.3 Zod-Schema (`validations/employee-form.ts`)
- `roleClass` (enum, **Pflicht**), `roleType`/Org-Titel optional, `zusatzBewachungNiveau` (`""|"ek"|"fk"`), `sdlScopes string[]`, `drivesServiceVehicle`, `ersteHilfeGueltigBis`/`brandschutzGueltigBis`, `beschaeftigungsart`, `qualification`. **`trainingHours` + Freitext-`roleType` entfernen.**

### 4.4 `EmployeeForm.tsx` (master) — schlank, In-App
- Primär-Select **Norm-Klasse** (EK/FK/Verwaltung/Praktikant/Sub, deutsche Labels mit Erklärtext). Optionales **Org-Titel**-Feld als **Dropdown mit den bekannten Titeln + Option „andere (Freitext)"** (Gate a), jeder Titel mit Default-Mapping (**Einsatzleitung→fk**; Objektleitung→ek; Schichtleitung→ek; SMA→ek; Geschäftsführung→verwaltung; Bürokraft→verwaltung; …). Default ist überschreibbar — die Norm-Klasse ist maßgeblich.
- Requirement-Felder einbauen (Doppelrolle/SDL/Beschäftigung/Qualifikation/Fristen/Dienstfahrzeug) — Komponenten/Options aus `employee-stammdaten-options.ts` + `EmployeeFilePersonRolleEditTable.tsx` **wiederverwenden**.
- **Doc-Auswahl raus** aus dem Anlege-Formular (→ Generator-Tab, §3). `roleId` weiterhin setzen (Default aus Norm-Klasse/Org-Titel ableiten oder kleine Auswahl), damit der Generator die Template-Palette hat.
- Alt-Felder (`trainingHours`, Freitext-roleType) entfernen.

### 4.5 Generator-Tab — übernimmt Doc-Auswahl — ⏭️ PHASE 2 (nicht in diesem Bauauftrag)
- Gate c = getrennt → **Doc-Auswahl bleibt in Phase 1 dort, wo sie heute ist** (EC-09 minimal berührt). Das Anlege-Formular setzt `roleId`/`appointmentIds` weiterhin so, dass der Generator die Doc-Palette unverändert bekommt.
- **Phase 2 (eigener Auftrag):** Core/Overlay-Doc-Chips + Select-All/Deselect in den Generator-Tab verlagern (vorhandene `displayMode="documents"`-Logik wiederverwenden), mit Default-Vorauswahl. **EC-09-Gate** (§3) dort verifizieren.

## 5. Rollenliste-Soll (vereinfacht, CL-belegt)
**Primär (Engine, `roleClass`):**
| Klasse | Norm | Engine-Wirkung |
|---|---|---|
| **EK** — Einsatzkraft (Bewachung) | §3.10 | §34a-Set Stufe A (CL-01/03/04/05/06/07/08), SDL 16/40 UE (CL-21/24) |
| **FK** — Führungskraft (Bewachung) | §3.11 / §4.19.1 | + FK-Quali CL-10 (bei DIN-SDL), SDL 24/64 UE (CL-20/25) |
| **Verwaltung** — keine Bewachung | §4.1 b | nur CL-04/05; §34a „nicht erforderlich"; Doppelrolle möglich |
| **Praktikant** | — | reduziertes Set (keine erfundene Pflicht) |
| **Subunternehmer** | §4.13 / CL-42 | Bewachung + „fachlich prüfen"; Firmen-Quote separat |

**Sekundär (Anzeige, Org-Titel, Default→Klasse):** Sicherheitsmitarbeiter→ek · Schichtleitung→ek · Objektleitung→ek · **Einsatzleitung→fk** · Führungskraft→fk · Geschäftsführung→verwaltung · Bürokraft/Verwaltung→verwaltung · Praktikant/Azubi→praktikant · Subunternehmer-SMA→subunternehmer. (Der Default ist überschreibbar; die Klasse ist maßgeblich.)

**Norm-Begründung:** DIN 77200 kennt als Qualifikationsachse nur **EK (§3.10)** vs. **FK (§3.11/§4.19.1)**; „Einsatzleitung" (§3.12) ist eine Funktion, die mind. eine FK enthalten muss (§4.2). Org-Titel sind Business-Schicht. **Keine erfundene Pflicht** — Klassen-Mapping nutzt nur bestehende CL-IDs.

## 6. DoD (Executor)
- `tsc --noEmit` = 0.
- **Engine-Suite** grün, **auf neues `roleClass`-Modell umgestellt** + Migration-Mapping-Test + Einsatzleitung=FK-Szenario + Invariante.
- **EC-09-Smoke** (echter Browser :3001, **Phase 1**): Neue Person über neues schlankes Formular → Doc-Auswahl am heutigen Ort (unverändert) → ZIP `POST /employee-automation` 200, kein 5xx. (Generator-Tab-Verlagerung erst Phase 2.)
- **EC-10:** kein Freigabe-/Auditstatus.
- **Migration:** bestehende Akten (z. B. blubermann/Verwaltung, joe) behalten korrekte Klassifikation nach Backfill; Persistenz über Reload.
- **Browser-Akzeptanz:** EK/FK/Verwaltung/Praktikant/Sub + Doppelrolle je ein Durchlauf; Pflicht-Set CL-belegt wie erwartet.
- **Betroffene Dateien (Erwartung):** `EmployeeForm.tsx`, `validations/employee-form.ts`, `employee-stammdaten-options.ts`, `requirement-engine.ts` (+Tests), `employee-file-requirements.ts`/`buildRequirementContext`, `lib/employee-file-repository.ts` (Mapping+Migration), `types/employee.ts`, `prisma/schema.prisma`, Generator-Tab-Komponente.

## 7. ✅ Mark-Gate-/Klärpunkte — ENTSCHIEDEN (Planer 7, 2026-06-08)
- **a) Org-Titel-Feld → Dropdown + Freitext.** Festes Dropdown mit den bekannten Titeln (jeder mit Default→Norm-Klasse) **plus** Option „andere (Freitext)". Norm-Klasse bleibt der maßgebliche Engine-Input; Org-Titel nur Anzeige/Org-Chart.
- **b) Objektleitung / Schichtleitung → bleiben EK.** Mark: **„nur Einsatzleitung = FK nach DIN 77200".** Default-Mapping: Einsatzleitung→`fk`, Objektleitung→`ek`, Schichtleitung→`ek`. FK für OL/SL nur per bewusster Klassen-Wahl/Doppelrollen-FK-Pfad — **keine titelgebundene FK-Quali-Pflicht erfinden** (FK hängt an §4.19.1-Quali). Norm: §3.12/§4.2 (Einsatzleitung enthält mind. 1 FK).
- **c) Phasen-Schnitt → getrennt.** **Phase 1 zuerst** (Datenmodell `roleClass` + Migration + Engine-Refactor + Tests + schlankes Anlege-Formular; Doc-Auswahl bleibt vorerst, wo sie ist), **Phase 2 separat** (Doc-Auswahl → Generator-Tab, eigener EC-09-fokussierter Schritt). → **Dieser Bauauftrag = Phase 1.**

## 8. Verhältnis zu anderen Slices
- **Slice 3 (Doppelrolle):** bleibt; Engine-Refactor stellt nur die Klassifikations-Quelle um (Doppelrolle-Logik unverändert) — **Re-Test der Suite Pflicht** (Slice 3 war abgenommen).
- **Slice 3b (Tally-Feldlücke):** **zurückgestellt** (Marks Tally-Entscheid).
- **Slice 4 (Ampel-/Status):** danach; profitiert von vollständigerer Erfassung.

## 9. Empfohlenes Phasing (Risiko-Minimierung)
- **Phase 1 (sicher, sichtbarer Gewinn):** Datenmodell `roleClass` + Migration + Engine-Refactor + Tests + schlankes Anlege-Formular mit Norm-Klasse/Requirement-Feldern + Alt-Felder raus. Doc-Auswahl **vorerst** dort lassen, wo sie ist → **EC-09 minimal berührt**.
- **Phase 2:** Doc-Auswahl in den Generator-Tab verlagern (Ziel-Architektur b) — eigener EC-09-fokussierter Schritt.
- **✅ Mark-Entscheid (2026-06-08): GETRENNT.** Dieser Bauauftrag = **Phase 1**. Phase 2 wird nach Phase-1-Abnahme als eigener Auftrag geplant.

---

**Guardrails:** EC-09 (Generator/ZIP nie brechen), EC-10 (kein Freigabe-/Auditstatus), keine erfundene Normpflicht (jede Regel `clauseId`). Verifikation im echten Browser, nicht per Skript. Bei Norm-/Scope-Zweifel Frage an Planer/Mark — Plan nicht eigenmächtig umschreiben.
