# Konzept — Akte ↔ Generator: sauberer Übergang, „Vormerken" & Schulungs-von-bis

> **Status:** ENTWURF zur Freigabe (Mark-Gate offen). Planer-Doku (Spur P), kein Produktivcode.
> **Datum:** 2026-06-20 · **Autor:** Planer (Claude) · **Quelle des Befunds:** Marks Live-Test cos.cert-expert.de (2026-06-20).
> **Gate:** C-10 (UI-/Architekturänderung) + Slice B berührt Norm-Mapping (Spur P). Bau erst nach Freigabe, Slice für Slice, je `tsc`/`next build`/EC-09 grün.

---

## 0. Marks Befund (drei Schmerzpunkte, wörtlich sinngemäß)

1. **Doppelter Generator + unklarer Übergang.** In der Navbar gibt es „Generator" **und** „Dokument-Generator"; im Generator nochmal ein Umschalter; „Mitarbeiter-Dokumente" steht da, „wo eigentlich der Generator sein sollte". → Verwirrend, welcher Einstieg was tut.
2. **„Was ist offen" zeigt an, aber man kann nichts vormerken.** In der Akte (z. B. Schutzritter) sieht man die offenen Punkte mit „intern · erzeugen" — aber es gibt **keinen Knopf**, das Dokument direkt zum Erzeugen vorzumerken.
3. **Generator-Datum: Grundunterlagen ok, Schulungen nicht.** Es gibt ein „Generator-Datum für alle" — passt für Grundunterlagen (alle = Einstellungsdatum). Aber **Schulungen sind von–bis und müssen pro Mitarbeiter einzeln** erfasst werden; das findet Mark im Generator nicht.

**Marks Zielbild (eigene Worte):** „Ich brauche einmal **den Generator** und einmal **die Mitarbeiterakte an sich** — das sind zwei getrennte Sachen, und der Übergang funktioniert noch nicht sauber." Workflow: **Schritt 1** Grundunterlagen wählen (ein Datum = Einstellung). **Schritt 2** je Person Schulungen mit von–bis anlegen. Es braucht „einen einfachen, übersichtlichen Schritt".

---

## 1. Zielbild

> **Akte = Status & Vormerken.** Hier sieht man „was ist offen" und markiert, **was erzeugt werden soll**.
> **Generator = Erzeugen.** Hier wird produziert — mit den passenden Datumsfeldern (Grundunterlagen: ein Datum; Schulungen: von–bis je Person).
> **Übergang:** „Vormerken" in der Akte füllt die Generator-Auswahl der Person. Öffnet man den Generator, stehen genau die vorgemerkten Dokumente da, jedes mit seinem Datumsfeld.

Das ist **keine neue Architektur**, sondern die saubere Verdrahtung bereits vorhandener Bausteine.

---

## 2. Ist-Zustand (im Code verifiziert)

| Baustein | Datei : Zeile | Befund |
|---|---|---|
| Navbar (4 Einträge) | `components/layout/Navbar.tsx:14` | „Generator" → `/generator`, „Dokument-Generator" → `/model-creator` |
| Top-Level-Generator | `app/generator/GeneratorPageClient.tsx` | Umschalter „Firmen-Dokumente" (= `ModelCreatorWorkspace`) ↔ „Mitarbeiter-Dokumente" (Firma→Person → Deep-Link `/employee-automation?id=…&tab=generator`) |
| `/model-creator` | `app/model-creator/page.tsx` | Rendert **nur** `ModelCreatorWorkspace` — **identisch** zu `/generator` Modus „Firmen". **Reines Duplikat.** |
| Akte mit Generator-Tab | `…/EmployeeAutomationPage.tsx:53,989` | Tabs „akte" ↔ „generator"; Generator-Tab = `EmployeeForm displayMode="documents"` (person-spezifisch) |
| „Offene Punkte"-Liste | `…/EmployeeFileDossierView.tsx:714` | Rendert `summary.openIssues` — **nur Text + Status-Badge, kein Knopf** |
| intern/extern-Hinweis | `…/EmployeeFileDossierView.tsx:558` (`resolveActionHint`) | **Text-Heuristik per Regex auf dem Label** — keine Doc-ID-Verknüpfung |
| Offene-Punkte-Quelle | `…/employee-file-requirements.ts:626` (`buildOpenIssues`) | Konsolidiert `RequirementRow{id,label,status}` aus Pflichtangaben/Geltungsbereich/Nachweise/Unterweisung (Status `fehlt`/`offen`/`fachlich prüfen`) |
| Pflicht-Engine | `…/requirement-engine.ts:419` (`deriveRequirements`) | Norm-Set aus roleClasses/appointments/SDL/Qualifikation; liefert `pflichtSet[]` mit Status — **keine Template-Doc-IDs** |
| Generator-Doc-Auswahl | `…/types/employee.ts:61` | `selectedRoleDocIds[]`, `selectedAppointmentDocIds[]` — **echte, bereits persistierte Felder** (treiben den ZIP-Export) |
| Generator-Datum (3 Ebenen) | `…/EmployeeAutomationPage.tsx:1235` | global / pro Doc-Typ / pro Person+Doc; Auflösung Person+Doc → Doc-Typ → global → heute |
| Datums-Datenmodell | `…/types/employee.ts:221` (`GeneratorDates`) | `{ global?, perDocument?, perDocType? }` |
| Schulungs-von-bis | `…/EmployeeFileTrainingPlan.tsx:447` + `…/types/employee.ts:254` | `plannedDate` (von) / `plannedBis` (bis) **pro Schulung/Person**, erfasst in der **Terminplanung** (nicht im Generator) |
| Schulung → .docx | `…/employee-generator/generate-employee-docs.ts:438` | Dokumentdatum = `plannedBis ‖ plannedDate ‖ global` (Commit `7598067`) — **fließt schon korrekt ins Dokument** |

**Kernerkenntnis:** Die Daten existieren. Es fehlt (a) das Entdoppeln der Navigation, (b) eine **kuratierte Verknüpfung** Offener-Punkt → Vorlage-Doc-ID + ein „Vormerken"-Knopf, (c) die **Sichtbarmachung** der Schulungs-von-bis im Generator (sie liegt heute nur in der Terminplanung).

---

## 3. Slice A — Navigation entdoppeln *(klein, risikoarm)*

**Problem:** Zwei Generator-Einträge, einer davon (`/model-creator`) ein Duplikat.

**Lösung (Mark-Gate 2026-06-20: Route ganz entfernen):**
- „Dokument-Generator" aus `NAV_ITEMS` entfernen (`Navbar.tsx:14`). Es bleibt **ein** Einstieg „Generator" (`/generator`) mit dem Umschalter Firma/Mitarbeiter.
- Route `/model-creator` **ganz entfernen** (Mark-Entscheid) → `/model-creator` ergibt 404. `ModelCreatorWorkspace.tsx` wird nach `app/generator/` **verschoben** (wird weiter von `/generator` genutzt), Import in `GeneratorPageClient.tsx` angepasst.
- Optional (Mark-Entscheid): Labels im Umschalter schärfen, z. B. „Firmen-Dokumente (Vorlagen)" / „Mitarbeiter-Dokumente (pro Person)".

**Betroffen:** `components/layout/Navbar.tsx`, `app/model-creator/` (gelöscht), `app/generator/ModelCreatorWorkspace.tsx` (verschoben), `app/generator/GeneratorPageClient.tsx` (Import).
**DoD:** `tsc` 0 · `next build` grün · Navbar zeigt 3 Einträge (Mitarbeiterakte / Generator / Upload-Manager) · `/model-creator` = 404 · `/generator` Firmen-Bereich erzeugt weiter Dokumente · Mark-Klick-Abnahme.
**Risiko:** minimal. **EC-09 unberührt** (keine Generator-Logik angefasst, nur Einstieg/Redirect).

---

## 4. Slice B — „Vormerken" in der Akte *(Kern; Norm-Arbeit)*

**Problem:** Offene Punkte sind nur Anzeige. Es gibt keinen Weg, einen internen Pflicht-Posten direkt in die Generator-Auswahl der Person zu legen.

**Lösung (Mechanismus):**
1. **Kuratierte Mapping-Tabelle** `requirementId → { templateDocId(s), clauseId, kind }`. Ersetzt die heutige Regex-Heuristik (`resolveActionHint`) durch eine **explizite, norm-belegte** Zuordnung. Geführt über die **stabile `RequirementRow.id`** (nicht über das Label-Textmatching).
   - `kind: "intern"` → es existiert eine erzeugbare Vorlage → **Vormerken-Knopf**.
   - `kind: "extern"` → behördlich/Anbieter-Nachweis → bleibt „anfordern/hochladen", **kein** Vormerken.
   - `kind: "pruefen"` → `legal-input`/`fachlich prüfen` (z. B. CL-73/CL-74) → Hinweis, **kein** Auto-Vormerken (EC-10).
2. **Vormerken-Aktion:** Klick fügt die `templateDocId` zu `selectedRoleDocIds` bzw. `selectedAppointmentDocIds` der Person hinzu (bestehende, persistierte Felder) → speichert über den vorhandenen `onSavePerson`-Pfad. Im Generator-Tab ist das Dokument danach sofort ausgewählt.
3. **Rückmeldung + Listenverhalten (Mark-Gate 2026-06-20: verschwindet aus der Liste):** Klick → kurzer Toast „… zum Generator vorgemerkt", und der Posten **verschwindet aus „Offene Punkte"** (er ist jetzt in der Generator-Auswahl der Person). **EC-10-Sicherung:** „verschwindet" heißt **„in Erzeugung", NICHT „erledigt"** — die Compliance-/Ampel-Berechnung (`compliance-status.ts`) zählt das Dokument **weiterhin als nicht-fertig**, bis es real erzeugt/abgelegt ist. Verschwinden betrifft nur die Anzeige der „noch anzulegen"-Liste, nicht den Erfüllungsstatus. (Umsetzung: vorgemerkte interne Posten werden aus `openIssues` ausgeblendet, sobald ihre `templateDocId` in `selectedRoleDocIds/…` liegt; der Pflicht-Posten bleibt im Soll-Set.)

**Draft der internen Posten (mit CL-Beleg — zu bestätigen in Slice B):**

| Offener Punkt (Pflicht) | clauseId | kind | Vorlage vorhanden? |
|---|---|---|---|
| Einweisung in die Dienstanweisung | CL-03 | intern | ja (Standard-Doc) |
| Datenschutzverpflichtungserklärung | CL-04 | intern | ja |
| Verschwiegenheitsverpflichtung | CL-05 | intern | ja |
| Bestellung Ersthelfer / Brandschutzhelfer / SiBe | (Beauftragung) | intern | ja (`appointments/bestellungen/…`) |
| Arbeitsschutz-Grundunterweisung (Erstunterweisung) | CL-75 | intern | ja |
| Mutterschutz-Merkblatt (weibl. MA) | CL-77 | intern | ja |
| §34a / Sachkunde / Unterrichtung, Erste-Hilfe-Nachweis, Brandschutz-Nachweis, Bundesauszug, Bewacherregister, Dienstausweis, Weiterbildung, Studium/Polizei | div. | extern | nein (anfordern) |
| Fahrer-/UVV-Unterweisung | CL-73 (`legal-input`) | pruefen | offen |
| Ausbilder-/Anbieter-Befähigung (BSH/EH-Schulung) | CL-74 (`legal-input`) | pruefen | offen |

**Abhängigkeit (wichtig):** Die konkrete `templateDocId` je Posten kommt aus den Rollen-/Beauftragungs-Vorlagen (`Role.documents[]` / `Appointment.documents[]`). Die **echte Vorlagen↔Rolle-Zuordnung ist teils noch Platzhalter** (`vorlagen-set-catalog.ts` → `DEFAULT_SET_ROLE_SLUGS`, geparkte Daten-/Mark-Frage). Für jeden Posten muss in Slice B die reale Doc-ID bestätigt werden; wo (noch) keine Vorlage existiert, wird der Posten als „extern/prüfen" geführt — **kein erfundener Eintrag**.

**Betroffen:** neue pure Datei `requirement-to-template-map.ts` (+Tests), `EmployeeFileDossierView.tsx` (Knopf je internem Posten), evtl. `employee-doc-selection-sync.ts` (additive Doc-IDs robust mergen). Kein Schema-Change (Felder existieren).
**DoD:** `tsc` 0 · `next build` grün · Unit-Tests fürs Mapping (jeder intern-Eintrag CL-belegt; extern/prüfen erzeugt keinen Knopf) · Vormerken füllt `selectedRoleDocIds/…` nachweislich · **EC-09-ZIP** real grün · Mark-Klick-Abnahme.
**Guardrails:** **Keine erfundene Normpflicht** — jede intern-Zeile trägt `clauseId` oder ist als „prüfen" markiert. **EC-10** — Vormerken erzeugt keine Freigabe-/„erledigt"-Aussage; der Posten bleibt offen, bis das Dokument real erzeugt/abgelegt ist.

---

## 5. Slice C — Schulungs-von-bis im Generator sichtbar/editierbar  ✅ GEBAUT (2026-06-20, noch nicht deployt)

> **Umsetzung:** Im Generator-Datumsblock (`EmployeeAutomationPage.tsx`) neue Sektion „Schulungen — Durchführung von–bis (je Person)" (Toggle-Button + Liste). Quelle = `resolveAssignedSchulungDocs(emp.trainingPlan)` (nur Schulungen, die wirklich exportiert werden). von/bis-Felder schreiben direkt in `trainingPlan.plannedDate`/`plannedBis` der Person → **EINE Quelle** mit der Terminplanung, Persistenz über den vorhandenen Debounce-Save. Dokumentdatum bleibt `plannedBis` (letzter Tag). Gates: `tsc` 0 · `next build` grün. EC-09 unberührt (keine Änderung am ZIP-/Generierungspfad), EC-10 gewahrt (nur Ausgabedaten, kein UE/CL/Status).



**Problem:** Das von–bis liegt nur in der Terminplanung; im Generator-Datumsblock taucht es nicht auf → Mark „findet" es nicht. (Technisch fließt es schon korrekt ins .docx.)

**Lösung (Zwei-Schritt-Klarheit im Generator):**
- **Schritt 1 — Grundunterlagen:** „Generator-Datum für alle" wie heute (= Einstellungsdatum), 3-Ebenen-Override bleibt.
- **Schritt 2 — Schulungen:** Für jede **vorgemerkte/zugewiesene Schulung** ein **von–bis-Feldpaar direkt im Generator**, das dieselben `plannedDate`/`plannedBis` der Terminplanung liest **und** schreibt (eine Wahrheit, kein zweites Datenfeld). Dokumentdatum bleibt `plannedBis` (letzter Tag, Commit `7598067`).
- So ist je Person an **einer** Stelle: ein Datum für die Grundunterlagen + von–bis je Schulung.

**Betroffen:** `EmployeeAutomationPage.tsx` (Generator-Datumsblock erweitern um Schulungs-Sektion), Lese-/Schreib-Bindung an `trainingPlan` (vorhanden), `EmployeeFileTrainingPlan.tsx` (gemeinsame Bindung, keine Doppel-Edit-Quelle). Kein Schema-Change.
**DoD:** `tsc` 0 · `next build` grün · von–bis im Generator editierbar, Wert identisch mit Terminplanung (eine Quelle) · erzeugtes Schulungs-.docx trägt `plannedBis` · **EC-09-ZIP** real grün · Mark-Klick-Abnahme.
**Guardrails:** EC-09 (Schulungs-Export-Pfad nicht brechen), EC-10 (kein Auto-Ist/keine Freigabe), CL-11/CL-75 unberührt (Module = Lehrbausteine, keine UE-/Norm-Änderung).

---

## 6. Reihenfolge & offene Gate-Fragen für Mark

**Stand 2026-06-21:** Slice **A ✅** + Slice **C ✅** gebaut **und LIVE deployt** (`cb8313d` auf cos.cert-expert.de). Slice **B** wartet auf Marks Vorlagen↔Rolle-Mapping. Browser-Klick-Abnahme A/C offen (Mark).

**Empfohlene Reihenfolge:** A (Quick-Win) → C (Schulungen, datenunabhängig) → B (Kern, wartet auf Marks Mapping-Daten).

**Gate-Entscheidungen (Mark, 2026-06-20) — GESETZT:**
1. **Labels** im Umschalter — Schärfung „Firmen-Dokumente (Vorlagen)" / „Mitarbeiter-Dokumente (pro Person)" als Default übernommen (Mark kann beim Klick-Abnahme nachjustieren).
2. **`/model-creator`** — **Route ganz entfernen** (404), Komponente nach `app/generator/` verschoben.
3. **Vormerken-Verhalten** — vorgemerkter Posten **verschwindet** aus „Offene Punkte" (mit EC-10-Sicherung, §4).
4. **Vorlagen↔Rolle-Daten** — **Mark liefert die volle Zuordnung.** → **Slice-B-Bau wartet** auf diese Daten. Slice A + C sind unabhängig und werden zuerst gebaut. (Bis die Daten da sind, könnte Slice B notfalls auf die belegten CL-03/04/05/75/77 + Bestellungen reduziert starten — Mark wählte aber die volle Zuordnung.)

---

## 7. Guardrails (für alle Slices)

- **EC-09:** Person → Akte → Doc-Chips → ZIP-Generator nie brechen; vor/nach jedem Slice realer ZIP-Smoke grün.
- **EC-10:** kein Auto-Freigabe-/Auditfähigkeits-/„qualifiziert"-Status; Vormerken ≠ erledigt.
- **Keine erfundene Normpflicht:** jede intern-Mapping-Zeile trägt `clauseId` (CL-xx) aus `NORM_KLAUSEL_REGISTER_v1.md` oder ist „fachlich prüfen".
- **Verifikation im echten Browser** (Mark-Klick), nicht per Skript.
- **Mark = Gate** je Slice; Übergabe-Takt + HANDOFF-Abschlusseintrag nach jedem Slice.
