# Bauauftrag — Slice 3: Doppelrollen-Modellierung (Code-Track → Cursor)

**Stand:** 2026-06-07 · **Autor:** Planer 5 (Spur P, kein Produktivcode) · **Für:** Executor/Cursor · **Freigabe:** Mark (Gate)
**Lesen vorab:** `CLAUDE.md` (Rollen-Kontrakt) · `HANDOFF.md` (HIER STARTEN + Planer-4-Finding „Doppelrolle" / „Formular-Feldlücke") · `knowledge/NORM_MATRIX_Mitarbeiternachweise_v2.md` (§1, §3.1, §5, §10) · `knowledge/NORM_KLAUSEL_REGISTER_v1.md` (CL-01, CL-40).
**Repo:** `cert-expert-certification-os/apps/certification-os/` · Branch `main` · Port **3001**.

> **Prinzip:** Erst „Was kann Mark am Ende tun", dann bauen. Klein liefern, **EC-09 nie brechen**, **EC-10** wahren, **keine erfundenen Normpflichten**.

---

## ⚠️ Scope-Hinweis an Mark (Gate, vor Bau-Start)

Die HANDOFF-Planung nennt für Slice 3 **zwei** Lücken aus Slice 2 / Deploy:
1. **Doppelrollen-Modellierung** — *dieser Bauauftrag* (code-only, sofort baubar, keine externen Abhängigkeiten).
2. **Tally-Formular-Feldlücke** (Option C Hybrid) — **hängt an Marks Tally-Arbeit** (neue Felder über alle 10 Slots) und ist daher **ein eigener Schritt (Slice 3b)**, sobald Mark die Felder im Formular angelegt hat. Skizze unten in **Abschnitt 7** (nicht Teil der buildbaren DoD).

**Numerierungs-Hinweis (Gate):** Der ursprüngliche `CURSOR_BAUAUFTRAG_TOOL2.md` führt „Slice 3 = Ampel-/Status-Ansicht" (QFD #1). Die HANDOFF-Planung (Planer 4 + Mark) hat **diese Doppelrollen-/Lücken-Konsolidierung** als „Slice 3" davorgezogen. → Die **Ampel-/Status-Ansicht rutscht auf Slice 4**. Bitte bestätigen (Planer hält es so, bis Mark widerspricht).

**Executor: NICHT bauen, bevor Mark „los für Slice-3-Bau" gegeben hat.** (Plan steht; Freigabe = Gate.)

---

## 1. Was kann Mark am Ende tun

Mark kann eine Person mit **Verwaltungs-/Geschäftsführungs-Grundrolle**, die **zusätzlich Bewachungstätigkeit** ausübt (z. B. der GF einer kleinen Firma, der mit auf Schicht geht), als **Doppelrolle** kennzeichnen — und dabei **das Bewachungs-Niveau wählen: Einsatzkraft (EK/SMA) oder Führungskraft (FK)**. Die Engine wendet dann das **volle Bewachungs-Pflichtset** (§34a, Einweisung, Datenschutz, Verschwiegenheit, Profil-Quali, Erste Hilfe, Jahres-Weiterbildung) **und** das **niveau-richtige** SDL-Schulungssoll auf diese Person an — statt sie wie heute fälschlich als reine Verwaltung ohne SDL-Soll zu behandeln.

**Niveau-Logik (Mark, 2026-06-07: „GF kann zusätzlich EK sein und/oder FK"):**
- **EK-Niveau** → einmalige SDL-Schulungen auf Einsatzkraft-Stufe (Veranstaltung 16 UE / CL-21, Asyl 40 UE / CL-24).
- **FK-Niveau** → Führungskraft-Stufe (Veranstaltung 24 UE / CL-20, Asyl 64 UE = 40 + 24 / CL-24+CL-25) **und** FK-Quali-Posten (CL-10, „fachlich prüfen"). FK **baut auf EK auf** (= „EK und/oder FK"); ein eigenes „beides"-Häkchen ist nicht nötig, FK schließt die EK-Basis ein (so rechnet die Engine Asyl bereits: 40 Basis + 24 FK-Aufschlag).

Heute (Slice 2): Engine kennt pro Person **nur eine** `roleType`. Das F3-Gate (SDL-Soll nur bei Bewachungsrolle, Mark bestätigt) lässt deshalb eine GF-Bewachungs-Doppelrolle **durchfallen** (`requirement-engine.ts` Z. 455–464, Modell-Grenz-Kommentar). Slice 3 schließt diese Lücke **und** macht das Niveau wählbar.

---

## 2. Norm-Anker (keine neue Pflicht!)

**Wichtig:** Die Doppelrolle führt **KEINE neue Normpflicht** ein. Sie ändert nur den **Trigger** — *wer* als Bewachungsperson gilt —, nicht den Pflichtkatalog.

| Was | clauseId | Fundstelle |
|---|---|---|
| „Qualifiziert"-Pflichtset gilt für jede Person, die Bewachung ausübt | **CL-40** | DIN 77200-3 Tab. 1 (= §4.1 b) UND §4.19.1) |
| §34a-Unterrichtung/Sachkunde-Pflicht knüpft an die **Bewachungstätigkeit**, nicht an den Job-Titel | **CL-01 / CL-02** | §4.1 b) 1)+2) / §34a GewO |
| Einmalige SDL-Schulung **EK** (Veranstaltung 16 UE / Asyl 40 UE) | **CL-21 / CL-24** | §5.4 / §8.3 |
| Einmalige SDL-Schulung **FK** (Veranstaltung 24 UE / Asyl +24 = 64 UE) | **CL-20 / CL-25** | §5.3 / §8.4 |
| FK-Quali-Nachweis (Fachkraft/Servicekraft/GSSK + 2 J.) bei FK-Niveau **+ DIN-SDL** | **CL-10** | §4.19.1 |

**⚠️ F4-Verfeinerung (Mark-Steuerung 2026-06-07):** F4 lautete „nur `roleType = "Führungskraft"` = FK". Mark präzisiert jetzt: Eine Doppelrolle (GF/Verwaltung + Bewachung) kann **auf FK-Niveau** laufen — also ein **zweiter, expliziter FK-Pfad** über die Doppelrolle-Niveau-Wahl, **nicht** über `roleType`. Das widerspricht F4 nicht (EL/OL/SL bleiben EK), sondern ergänzt es: FK-Niveau wird **bewusst von Mark/Bearbeiter gesetzt**, nicht automatisch abgeleitet.

**CL-10-Gate (Mark-Steuerung 2026-06-07):** Der FK-Quali-Posten (CL-10, „fachlich prüfen") wird **nur erzeugt, wenn ein DIN-SDL/Auftrag vorliegt** (`din1-*`/`din2-*`; `non-din` zählt nicht). Gilt für **beide** FK-Wege. Das ist eine **bewusste Slice-2-Präzisierung** (vorher feuerte CL-10 für jede FK ohne SDL) — Detail + Test-Gegencheck in §4.2.

---

## 3. Datenmodell (neues Feld)

Neues, optionales **Niveau-Feld** **`zusatzBewachungNiveau`** (Doppelrolle + gewähltes Bewachungs-Niveau). Wertebereich: `"ek"` | `"fk"`; **leer/undefined = keine Doppelrolle**. Ein Boolean reicht nicht (EK vs. FK muss unterscheidbar sein, s. §1/§2).

- **`prisma/schema.prisma`** (`model EmployeeFile`, neben `useGuardAsEmployeeId`):
  `zusatzBewachungNiveau String?`
  → `String?` (nullable, kein `@default`) ist SQLite-sicher — **NICHT** das Json-`@default`-Muster, das in Slice 2 den P2023-Crash auslöste (HANDOFF, Builder-1-Lehre). Bestehende Zeilen bekommen NULL = keine Doppelrolle.
- **`modules/03-mitarbeiterakte-tool-2/employee-file/types/employee.ts`** (`interface Employee`):
  `/** Doppelrolle: Person übt zusätzlich Bewachung aus, auf gewähltem Niveau. "ek" = Einsatzkraft/SMA, "fk" = Führungskraft. undefined = keine Doppelrolle. Trigger für CL-40-Pflichtset. */ zusatzBewachungNiveau?: "ek" | "fk";`
- **`lib/employee-file-repository.ts`** — Feld in **allen 5 Mapping-Stellen** ergänzen (sonst geht es beim Speichern/Laden verloren). Read defensiv auf die Union normalisieren (alles außer `"ek"`/`"fk"` → `undefined`), z. B. kleiner Helfer `asNiveau(record.zusatzBewachungNiveau)`:
  1. `employeeFileToEmployee` (Read): `zusatzBewachungNiveau: asNiveau(record.zusatzBewachungNiveau),`
  2. `employeeToUpsertData` (Create): `zusatzBewachungNiveau: employee.zusatzBewachungNiveau ?? null,`
  3. `upsertEmployeeFile` → `update`-Block: `zusatzBewachungNiveau: employee.zusatzBewachungNiveau ?? null,`
  4. `replaceEmployeeFilesForCompany` → `update`-Block: dito
  5. `migrateFromLocalStoragePayload` → `update`-Block: dito
- Nach Schema-Änderung: `DATABASE_URL=file:./prisma/dev.db npm run db:push` + `prisma generate` (Prisma-CLI liest `.env`, nicht `.env.local` — CLAUDE.md). **Genau eine DB** `prisma/prisma/dev.db` — kein zweites File anlegen.

---

## 4. Engine (`requirement-engine.ts`) — die eigentliche Logik

**4.1 Context erweitern** (`interface RequirementContext`):
`/** Doppelrolle-Bewachungs-Niveau: "ek" | "fk". undefined = keine Doppelrolle. Hebt das F3-Gate; "fk" treibt zusätzlich den FK-Zweig (CL-10/CL-20/CL-25). */ zusatzBewachungNiveau?: "ek" | "fk";`

**4.2 Effektive Bewachung + effektives FK-Niveau berechnen** (in `deriveRequirements`, ersetzt die heutige `bewachung`/`fuehrung`-Verwendung in den Gates):
```
const baseBewachung = isBewachungsrolle(ctx.roleType);
const doppelrolle = !!ctx.zusatzBewachungNiveau && !baseBewachung;
const bewachung = baseBewachung || !!ctx.zusatzBewachungNiveau; // effektiv
// FK-Niveau: entweder echte Grundrolle Führungskraft (F4) ODER Doppelrolle "fk".
const fuehrung = isFuehrungskraft(ctx.roleType) || ctx.zusatzBewachungNiveau === "fk";
```
- **Alle** bisherigen `bewachung`-Gates (Abschnitt A „Qualifiziert"-Set, Abschnitt C SDL-Soll-Gates, Abschnitt E Jahres-Weiterbildung, Fristen-Block) nutzen ab jetzt die **effektive** `bewachung`.
- Die SDL-Schulungs-Gates in Abschnitt C (`sdl-veranstaltung-fk`/`-ek`, `sdl-asyl-fk`) nutzen die **effektive** `fuehrung` → Doppelrolle-„fk" landet korrekt im 24/64-UE-Zweig, Doppelrolle-„ek" im 16/40-UE-Zweig.
- **q-fk-quali (CL-10) — jetzt DIN-SDL-gegatet (Mark 2026-06-07: „FK-Quali nur bei DIN-SDLs / Aufträgen"):** der bestehende `if (fuehrung)`-Block (Z. 371–381) wird zu `if (fuehrung && hasDinSdl)`, mit
  `const hasDinSdl = ctx.sdlScopes.some((s) => s.startsWith("din1") || s.startsWith("din2"));`
  → CL-10 erscheint als **„fachlich prüfen"** nur, wenn die Person mindestens ein DIN-SDL/Auftrag hat (`non-din` zählt nicht). Greift für **beide** FK-Wege (echte Grundrolle Führungskraft + Doppelrolle-„fk", da effektive `fuehrung`). Trigger-Text bei Doppelrolle: `"Doppelrolle FK-Niveau · DIN-SDL"`.
  - **⚠️ Slice-2-Präzisierung (Mark-autorisiert):** Das ändert das Verhalten für `roleType="Führungskraft"` **ohne** SDL-Scope (bekam bisher CL-10 bedingungslos → jetzt nicht mehr). Bestehende Suite bricht **nicht** (Szenario 3b hat `din2-veranstaltung`; kein Test erwartet CL-10 für FK ohne SDL — Planer hat gegengeprüft). Bewusste Norm-Korrektur, kein Versehen.

**4.3 Verwaltungs-/Praktikanten-Reduktion unterdrücken bei Doppelrolle** (Abschnitt B):
- `if (verwaltung && !doppelrolle) { … v-datenschutz / v-verschwiegenheit / v-34a-na … }`
- `if (praktikant && !doppelrolle) { … p-reduziert … }`
- **Grund:** Bei Doppelrolle liefert Abschnitt A bereits Datenschutz (CL-04) + Verschwiegenheit (CL-05) + §34a (CL-01) als **Pflicht**. Die Reduktions-Notiz `v-34a-na` (clauseId `null`, Status „nicht erforderlich") würde **nicht** dedupt (Presenter dedupt nur non-null CL) und stünde widersprüchlich neben `q-34a`. → Deshalb hart unterdrücken.

**4.4 Transparenz-Trigger + Hinweis:**
- Wo `doppelrolle === true`, soll der `trigger`-Text der A-Regeln lesbar machen, **warum** das Set greift, z. B. Helfer
  `const bewTrigger = doppelrolle ? \`Doppelrolle (${ctx.roleType} + Bewachung, ${ctx.zusatzBewachungNiveau?.toUpperCase()}-Niveau)\` : "Bewachungsrolle";`
  und in den A-Regeln statt der festen „Bewachungsrolle"-Trigger verwenden.
- Zusätzlich `hinweise.push(...)`, wenn `doppelrolle`:
  `"Doppelrolle erfasst: Grundrolle „{roleType}" + zusätzliche Bewachung auf {EK|FK}-Niveau → volles Bewachungs-Pflichtset (CL-40) und niveau-richtiges SDL-Schulungssoll angewandt." ` — bei FK-Niveau ergänzen: `"FK-Quali (CL-10) ist als „fachlich prüfen" zu belegen."`

**4.5 Keine neuen CL-IDs, keine neuen UE-Werte.** Nur Trigger-/Niveau-Logik auf bestehenden Regeln. Jede aktive Regel behält ihre bestehende `clauseId` (CL-20/21/24/25/10 wie in Slice 2).

---

## 5. Presenter / Context-Verdrahtung

- **`employee-file-requirements.ts` → `buildRequirementContext`**: neues Feld durchreichen:
  `zusatzBewachungNiveau: employee.zusatzBewachungNiveau,`
- `isSecurityRole(employee)` (Z. 127) wird im Presenter für mehrere Anzeige-Rows genutzt (Bundesauszug, Datenschutz-Unterweisung etc.). **Entscheidung Planer:** Damit die Doppelrolle auch in den *Presenter-Anzeige-Rows* (nicht nur Engine-Pflichtset) konsistent als Bewachung erscheint, soll `isSecurityRole` die Doppelrolle berücksichtigen:
  `return isBewachungsrolle(employee.roleType) || !!employee.zusatzBewachungNiveau;`
  → So zeigen `buildPflichtnachweise` / `buildSchulungUnterweisung` für die Doppelrolle dieselben „Bewachung"-Trigger wie das Engine-Pflichtset. (Sonst Inkonsistenz: Engine sagt Pflicht, Anzeige-Row sagt „nicht erforderlich".) Signatur von `isSecurityRole` ggf. von `Pick<Employee,"roleType">` auf `Pick<Employee,"roleType"|"zusatzBewachungNiveau">` erweitern.

---

## 6. UI-Erfassung (`EmployeeFilePersonRolleEditTable.tsx`)

- Neue **Select-Zeile** **direkt unter der „Rolle"-Zeile** (`rowShell("rolle", …)`), Muster wie die bestehenden `Select`-Zeilen (z. B. Beschäftigungsart, `COMPACT_SELECT`):
  - Label: **„Zusätzliche Bewachungstätigkeit (Doppelrolle)"**
  - Optionen (Konstante z. B. `ZUSATZ_BEWACHUNG_OPTIONS` in `employee-stammdaten-options.ts`):
    `[{ id: "ek", name: "Ja — als Einsatzkraft / SMA (EK)" }, { id: "fk", name: "Ja — als Führungskraft (FK)" }]`
    Leerwert/Placeholder = „— keine zusätzliche Bewachung".
  - `value={employee.zusatzBewachungNiveau ?? ""}`; `onChange={(v) => patch({ zusatzBewachungNiveau: v === "ek" || v === "fk" ? v : undefined })}`
  - Hint: **„Für Verwaltung/GF, der/die mit auf Schicht geht. Wendet das volle Bewachungs-Pflichtset an (CL-40); FK-Niveau treibt CL-20/25 + FK-Quali CL-10."**
- **Sichtbarkeit:** immer rendern. Für echte Bewachungsrollen (SMA/FK/…) ist die Auswahl ein **No-op** (effektive Bewachung schon true) — korrekt und ungefährlich. (Optional schlank: nur anzeigen, wenn `roleType` ∈ {Bürokraft / Verwaltung, Geschäftsführung, Praktikant / Azubi} — UI-Feinheit dem Executor überlassen, beides akzeptabel.)
- Kein neuer Status-Badge nötig (Zeile ohne Badge ok).

Anzeige der Auswirkung passiert automatisch über das bestehende Engine-Pflichtset + `engineHinweise`-Rendering in der Dossier-Ansicht (kein neuer Anzeige-Code).

---

## 7. (Slice 3b — NICHT in dieser DoD) Tally-Formular-Feldlücke, Option C Hybrid

> **Blockiert auf Mark:** erfordert, dass Mark die Felder **zuerst im Tally-Formular `vGNvY0` anlegt** (über alle 10 MA-Slots). Erst danach kann der Executor mappen. Bis dahin werden diese Treiber **manuell in der Akte** gepflegt (Slice-2-Felder existieren bereits). Hier nur die Planungs-Skizze:

**Eindeutige Felder ins Formular (Empfehlung C):** SDL-Scope (CL-20/21/22/24/25), „fährt Dienstfahrzeug?" (CL-73), Eintrittsdatum/`startDate` (CL-02). **Erklärungsbedürftig → vorerst manuell:** Beauftragungen/Bestellungen, Gültig-bis-Daten (vom Zertifikat ablesbar, aber fehleranfällig).

**Bauarbeit (wenn freigegeben):** je neues Feld als `*QuestionId` über alle 10 Slots in `lib/data/tally-employee-slots.json` ergänzen → Mapping in `lib/tally-intake-service.ts` → Akte-Feld (`sdlScopes` / `drivesServiceVehicle` / `startDate`). Mapping-Tabelle in `TALLY_FIELD_MAPPING.md` nachziehen. **Datenqualität:** erklärungsbedürftige Felder brauchen Erklärtext im Formular (sonst falsche Kundenantworten). Jede norm-getriebene Frage trägt eine clauseId.

→ **Eigener Bauauftrag**, sobald Mark die Tally-Felder angelegt + den Scope freigegeben hat.

---

## 8. Tests (`requirement-engine.test.ts`, `tsx --test`)

Bestehende 13 müssen grün bleiben. Neu (mind. diese 7):

1. **GF + `zusatzBewachungNiveau: "ek"`** → `pflichtSet` enthält `q-34a` (CL-01), `q-einweisung` (CL-03), `q-datenschutz` (CL-04), `q-verschwiegenheit` (CL-05), `q-profil` (CL-06), `q-ersthilfe` (CL-08); `schulungsSoll` enthält `jahres-weiterbildung` (CL-11); **kein** `v-34a-na`, **kein** `v-datenschutz`, **kein** `q-fk-quali`. `hinweise` enthält den Doppelrollen-Hinweis.
2. **GF ohne Niveau** (Regression) → nur `v-datenschutz`/`v-verschwiegenheit`/`v-34a-na`, **kein** q-34a/jahres-weiterbildung. (unverändert)
3. **Bürokraft + `zusatzBewachungNiveau: "ek"` + `sdlScopes: ["din2-veranstaltung"]`** → `schulungsSoll` enthält `sdl-veranstaltung-ek` (CL-21, 16 UE), **nicht** `sdl-veranstaltung-fk`. Kein `q-fk-quali`.
4. **Bürokraft + `zusatzBewachungNiveau: "fk"` + `sdlScopes: ["din2-veranstaltung","din2-fluechtling-asyl"]`** → `schulungsSoll` enthält `sdl-veranstaltung-fk` (CL-20, 24 UE) **und** `sdl-asyl-base` (CL-24, 40) **und** `sdl-asyl-fk` (CL-25, 24 → gesamt 64); `pflichtSet` enthält `q-fk-quali` (CL-10, „fachlich prüfen"). **Kein** `sdl-veranstaltung-ek`.
5. **SMA + `zusatzBewachungNiveau: "ek"`** → identisches Ergebnis wie SMA ohne Niveau (Idempotenz, kein doppeltes Set).
6. **Praktikant + `zusatzBewachungNiveau: "ek"`** → volles Bewachungs-Set, **kein** `p-reduziert`.
7. **CL-10-Gate:** (a) `roleType: "Führungskraft"` **ohne** `sdlScopes` (bzw. nur `["non-din"]`) → **kein** `q-fk-quali` (neue Gate-Regel). (b) Doppelrolle-„fk" **ohne** DIN-SDL → ebenfalls **kein** `q-fk-quali`. (Gegenstück zu Szenario 4, das mit DIN-SDL den Posten erwartet.)

---

## 9. Definition of Done (Executor)

- [ ] Schema + Typ + Repository (5 Stellen) + `db:push`/`generate`; nur `prisma/prisma/dev.db`.
- [ ] Engine-Logik (4.1–4.5) + Presenter-Verdrahtung (5) + UI-Checkbox (6).
- [ ] `tsc --noEmit` = **0 Fehler**.
- [ ] Engine-Suite **grün** (13 alt + 7 neu).
- [ ] **EC-09-Smoke** im echten Browser grün (Person → Akte → Doc-Chips → ZIP exportiert, 200, kein 5xx) — Generator unangetastet.
- [ ] **Browser-Akzeptanz Doppelrolle:** GF/Verwaltung-Person → Checkbox „übt zusätzlich Bewachung aus" an → Pflichtset + SDL-Soll + Doppelrollen-Hinweis erscheinen; Checkbox aus → zurück auf Verwaltungs-Reduktion. **Persistenz** über Reload (debounced Save).
- [ ] **EC-10** gewahrt: keine „freigegeben/auditfähig/einsatzbereit"-Aussage; Statuswerte bleiben in der konservativen Union.
- [ ] **Keine erfundene Pflicht** — kein neues CL, keine neuen UE-Werte; jede aktive Regel CL-belegt.
- [ ] Commit (mit Marks OK) + **EINEN** Ergebnis-Eintrag in `HANDOFF.md` („Von Cursor an Claude": fertig / offen / Commit-Hash) + HIER-STARTEN-Status kippen. **Plan nicht umschreiben** (Rollen-Kontrakt).

---

## 10. Guardrails (nicht verhandelbar)

- **EC-09** (Generator/ZIP) nie brechen — vor/nach Änderung Smoke grün.
- **EC-10** — kein Freigabe-/Auditfähigkeitsstatus.
- **C-10** — keine Architekturänderung ohne Gate (Mark). Doppelrolle = additives Flag, keine Architekturänderung.
- **Verifikation im echten Browser**, nicht per Skript.
- **DSGVO** — `prisma/**/*.db` / `.env*` nie committen.
- **Bei Norm-Zweifel / Scope-Frage** → **Frage an den Planer** in den HANDOFF, nicht selbst entscheiden.
