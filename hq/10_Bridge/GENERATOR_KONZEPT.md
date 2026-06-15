# Dokument-Generator — Vereinheitlichung (Core- & UI/UX-Konzept)

> **Rolle:** Produkt-/UX-Architekt (Spur P, Design-Gate C-10) — **kein Produktivcode**. Read-only-Recherche + Konzept.
> **Stand:** 2026-06-15. **Status: ABGENOMMEN (Mark, 2026-06-15)** — DM1+DM2 entschieden; DM3–DM9-Empfehlungspaket abgenommen (DM8 = vorerst Tool-1-Firmenvorlagen, echte Firmen-Generierung später). **G1 baufertig.** Bau Slice für Slice, je eigenes Mark-Abnahme-Gate.
> **Auslöser (Mark, 2026-06-15):** „Es muss einmal **einen** Generator geben, wo wir alle firmen- und mitarbeiterbezogenen Dokumente erstellen können, und dann einmal die Möglichkeit, ein bestimmtes **Set vorzumerken, das sich aus den Lücken** in der Mitarbeiterakte ergibt. Jetzt haben wir aber ein Mischmasch — wir kommen nicht zu einem sauberen Generator und können auch nicht bestimmte Sachen frei auswählen, nur die vordefinierten. Und wie man dorthin kommt, ist fragwürdig."
> **Grundlage (im Code verifiziert, 2026-06-15):** `app/model-creator/page.tsx`, `app/actions/send-model-entries.ts`, `EmployeeForm.tsx` (`displayMode="documents"`), `EmployeeAutomationPage.tsx` (`handleGenerate`/`generateEmployeeDocs`), `vorlagen-set-catalog.ts`, `DocumentCollection`/`DocumentCollectionItem` (P3a), `collection-employee-mapping.ts` (P3b), `requirement-engine.ts`/`employee-file-requirements.ts`, `company-documents-catalog.ts`/`CompanyDocumentsPanel.tsx`, `components/layout/Navbar.tsx`.

---

## 1. Zielbild (Mark) — zwei Modi, ein Generator

Es gibt **einen** Generator-Ort. Dort erzeugt man **alle** Dokumente — firmen- **und** mitarbeiterbezogen. Die Auswahl ist immer dieselbe freie Einzelauswahl aus dem vollen Vorlagen-Katalog; sie kann auf **drei Wegen** vorbefüllt werden, die alle in **denselben frei nachjustierbaren Auswahl-Zustand** münden:

1. **Frei** — leer starten, einzelne Dokumente selbst zusammenklicken.
2. **Schnellstart-Set** — ein vordefiniertes/eigenes Set (SiMa / FK / Bürokraft …) als Vorauswahl laden, dann frei anpassen.
3. **Aus Akte-Lücken** (lücken-getrieben) — die zu den **offenen Pflicht-Punkten** der Norm-Engine gehörenden, **CL-belegten** Dokumente werden vorausgewählt (nur die **fehlenden**, DM2). Danach frei ergänzen/abwählen → generieren.

Output bleibt das **ZIP** wie heute. **EC-10:** „vorgemerkt/ausgewählt" ist **nie** „erstellt/erledigt/auditfähig".

---

## 2. Ist-Stand — wo der „Mischmasch" sitzt (Befund 2026-06-15)

| Ebene | Heute | Problem |
|------|-------|---------|
| **Tool 1** (`/model-creator`) | Freie Einzelauswahl ✓, aber **nur Firmen-/Standard-Models** (S3 via `/api/standard-models`); ZIP via `generateDocument`. | Freie Auswahl existiert — aber nur für Firma. |
| **Tool 2** (Akte-Tab „Generator", `EmployeeForm displayMode="documents"`) | **Nur Mitarbeiter-Docs**, Auswahl **immer an Rolle / `setKategorie` / Sammlung / Bestellung gebunden**; ZIP via `generateEmployeeDocs`. | **Keine freie Einzelauswahl** — genau Marks „nur die Vordefinierten". |
| **Sets doppelt** | Statischer **Katalog** `vorlagen-set-catalog.ts` (Core+Overlays) **vs.** DB **`DocumentCollection`** (Seeds einmalig kopiert). | Zwei Quellen, **nicht synchron** → offenes „P3c". |
| **Lücken-getrieben** | Engine liefert Pflicht-Set/offene Punkte (CL-belegt), wird in der Akte **nur angezeigt**. | **Komplett entkoppelt** vom Generator — „aus Lücken vormerken" existiert **gar nicht**. |
| **Firmen-Docs** | Nur **Upload/Lager** (`CompanyDocumentItem`, 9 Slots). | Kein Firmen-**Generator** außer Tool-1-Standard-Models. |
| **Navigation** | Zwei Orte: Top-Level `/model-creator` **+** versteckter Tab tief in der Akte; keine Querverweise. | Marks „wie man dorthin kommt, ist fragwürdig". |

**Kernlücken:** (a) MA-Docs **nicht** frei wählbar, (b) Sets **doppelt** statt einer Quelle, (c) Engine-Lücken **nicht** mit dem Generator verbunden, (d) **zwei** getrennte Generator-Orte.

---

## 3. Architektur-Entscheidungen

- **DM1 — Struktur:** ✅ **ENTSCHIEDEN (Mark, 2026-06-15): EIN vereinter Generator.** Ein Ort, zwei Bereiche (Firmen-Dokumente + Mitarbeiter-Dokumente), beide mit freier Einzelauswahl; vordefinierte Sets + Akte-Lücken = Schnellstart-Vorauswahlen; **Tool 1 geht darin auf**.
- **DM2 — Lücken-Set:** ✅ **ENTSCHIEDEN (Mark, 2026-06-15): nur die fehlenden Pflicht-Dokumente** (zu offenen/fehlenden Engine-Pflicht-Punkten, CL-belegt), vorausgewählt + frei nachjustierbar.

### Offene Design-Entscheidungen für Mark (Empfehlung je überschreibbar)
- **DM3 — Ort des Generators:** Empfehlung **eigener Top-Level-Bereich `/generator`** (Navbar), der `/model-creator` **ablöst**. Aus der Akte heraus per Deep-Link mit vorausgewählter **Person + Lücken-Set**. Behebt „zwei Orte / versteckt". → ok?
- **DM4 — Kontext Firma vs. Mitarbeiter:** Empfehlung im Generator oben **Bereich-Umschalter**: „Firmen-Dokumente" (Firma immer aus zentralem Profil `CompanyExportSettings`, keine Person nötig) **/** „Mitarbeiter-Dokumente" (Person wählen). → ok?
- **DM5 — Freie Einzelauswahl für MA-Docs:** Empfehlung das **Tool-1-Baum-/Toggle-Muster** (das schon frei funktioniert, `page.tsx`) auf den **vollen MA-Katalog** (`/api/templates`: `roles/*` + `appointments/*`) übertragen → durchsuchbare, einzeln togglebare Liste, schreibt in die bestehenden `selectedRoleDocIds`/`selectedAppointmentDocIds`. → ok?
- **DM6 — Sets/Sammlungen zu EINER Quelle (P3c lösen):** Empfehlung **DB-`DocumentCollection` wird die eine Laufzeit-Quelle**; die 3 Vordefinierten bleiben **Seeds** (read-only + klonbar); der statische `vorlagen-set-catalog.ts` wird nur noch **Seed-Quelle** (nicht parallele Laufzeit-Quelle). Im Generator sind Sets „Schnellstart-Vorauswahl", danach frei editierbar. → ok?
- **DM7 — Lücken→Doc-Mapping:** Empfehlung ein **pures Mapping `RequirementRow(status fehlt/offen) → Doc-IDs`** (nutzt vorhandene `overlayDocsForEmployee`/`coreDocsForSetKategorie` + Doc-ID-Parität), das die **fehlenden** Dokumente in den Auswahl-Zustand vorbelegt. **Nur CL-belegte** Pflichten → keine erfundene Normpflicht. EC-10: vorgemerkt ≠ erledigt. → ok?
- **DM8 — Firmen-Dokumente generieren?** Heute nur Upload/Lager (kein Firmen-Generator außer Standard-Models). Empfehlung **vorerst**: Firmen-Bereich des Generators = die bestehenden **Tool-1-Standard-Models** (schon freie Auswahl). Echte Vorlagen-Generierung weiterer Firmen-Dokumente = **eigener späterer Slice** (braucht Firmen-Vorlagen). → so ok, oder Firmen-Doc-Generierung gleich mit?
- **DM9 — EC-09-Migration:** Empfehlung **bestehende ZIP-Pfade unverändert lassen** (`generateEmployeeDocs` + `generateDocument`); der Umbau ist reine **Auswahl-/IA-Schicht + Zusammenführung**. Je Slice ZIP-Smoke (echter `POST`, `UEsDBA`-Magic). → ok?

---

## 4. Umsetzungs-Slices (G-Serie, klein, EC-09-sicher, je gegated)

> Reihenfolge so, dass der größte Schmerz zuerst weicht (freie MA-Auswahl + Lücken), die riskante Zusammenführung zuletzt. Jeder Slice: `tsc` 0 · Suite grün · `next build` grün · **EC-09-ZIP-Smoke** · Mark-Abnahme. **Kein Slice ohne Freigabe.**

| Slice | Inhalt | Risiko | EC-09 |
|------|--------|--------|-------|
| **G0** | **Dieses Konzept abnehmen** (DM3–DM9) | — | — |
| **G1** | **Freie Einzelauswahl für MA-Docs** im Tool-2-Generator: voller Katalog-Browser (roles/* + appointments/*), einzeln togglebar, schreibt in bestehende `selected…DocIds`. Behebt die größte Lücke. | mittel | ZIP-Pfad unberührt, Smoke |
| **G2** | **Lücken-Einstieg:** pures `RequirementRow→Doc-IDs`-Mapping (DM7) + „Aus Akte-Lücken generieren"-Aktion in der Akte → öffnet Generator mit fehlenden Pflicht-Docs vorausgewählt (nur CL-belegt, EC-10). | mittel | Smoke |
| **G3** | **Sets zu EINER Quelle (P3c, DM6):** DB-Sammlung als Laufzeit-Quelle, Katalog nur Seed; Sets als Schnellstart-Vorauswahl im Generator (danach frei editierbar). | mittel–hoch | Smoke |
| **G4** | **Zusammenführung (DM3/DM4):** ein Top-Level-Generator `/generator` mit Bereichs-Umschalter Firma/MA; `/model-creator` integrieren/ablösen; Navigation + Deep-Links aufräumen. | hoch | ZIP beider Pfade-Smoke |
| **G5** | (falls DM8) **Firmen-Doc-Generierung** über Vorlagen erweitern. | mittel | Smoke |

---

## 5. Guardrails (verbindlich)

- **EC-09:** Person → Akte → Doc-Chips → ZIP darf NIE brechen. Bestehende ZIP-Pfade (`generateEmployeeDocs`, `generateDocument`) bleiben funktional; Umbau = Auswahl-/IA-Schicht. Je Slice echter ZIP-Smoke (`POST`, `UEsDBA`/`PK`-Magic).
- **EC-10:** „ausgewählt/vorgemerkt" ≠ „erstellt/erledigt/auditfähig". Lücken-Vormerkung ist ein Vorschlag, kein Status.
- **Keine erfundene Normpflicht:** Das Lücken→Doc-Mapping nutzt **nur CL-belegte** Engine-Pflichten (Register `NORM_KLAUSEL_REGISTER_v1`). Ohne CL → nicht vormerken.
- **Engine unberührt:** `requirement-engine.ts` + UE-Werte + CL-IDs werden **nicht** verändert — der Generator **liest** den Engine-Output, ändert ihn nicht.
- **C-10:** Architektur (DM1/DM2 entschieden; DM3–DM9 offen) erst nach Mark-Gate bauen.

---

> **→ Mark:** DM1 (ein Generator) + DM2 (nur fehlende Pflicht-Docs) stehen. **Bitte DM3–DM9 entscheiden** (Empfehlungen sind gesetzt, überschreibbar) → dann baue ich **G1** (freie MA-Einzelauswahl) als ersten gegateten Slice — das nimmt sofort den größten Schmerz (frei wählen statt nur Vordefinierte).
