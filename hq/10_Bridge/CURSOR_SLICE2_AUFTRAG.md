# Cursor-Arbeitsauftrag — Slice 2: Requirement-Engine („was ist Pflicht")

**Freigabe:** ✅ **VOLLSTÄNDIG FREIGEGEBEN** (Mark, 2026-06-07) — alle 4 Entscheidungen geklärt. Executor kann starten.
**Track:** Code-Track (Planer/Claude entwirft + reviewt · Cursor/Executor baut · Mark = Gate).
**Kontext zuerst lesen:** `knowledge/NORM_MATRIX_Mitarbeiternachweise_v2.md` (§1, §5, §6, §9, §10), `knowledge/NORM_KLAUSEL_REGISTER_v1.md` (CL-IDs), `hq/10_Bridge/CURSOR_BAUAUFTRAG_TOOL2.md` (Slice-2-Block), `HANDOFF.md` (HIER STARTEN).
**Repo:** `cert-expert-certification-os/apps/certification-os/` · Branch `main` · Port **3001**.

---

## Ziel (was Mark am Ende tun kann)

Eine Akte öffnen und **automatisch sehen, welche Nachweise + Schulungen für diese Person Pflicht sind** — abgeleitet aus **Rolle × Beauftragung × SDL × Geltungsbereich × Beschäftigungsart × „fährt Dienstfahrzeug"** — statt alles manuell per „fachlich prüfen" zu beurteilen. Jede angezeigte Pflicht trägt ihre **Norm-Fundstelle (CL-xx)**; was die Norm nicht hergibt, bleibt ehrlich „fachlich prüfen / offen".

**Konkret sichtbar pro Akte:**
1. **Pflicht-Set** — welche Nachweise/Unterweisungen erforderlich sind, je mit Auslöser („weil Rolle X / SDL Y / Beauftragung Z") + `clauseId`.
2. **Schulungs-Soll** — Jahres-Weiterbildung (40/24 UE) + ggf. einmalige SDL-Schulung (UE-Wert) + Brandschutz, mit Anrechnungs- und DL-Hinweis.
3. **Fristen/Ampel-Vorstufe** — 6-Monats-Sachkunde aus `startDate`, Erste-Hilfe (2 J.), Brandschutz (3 J.) als Termin, nicht pauschal grün. *(Volle Ampel = Slice 3.)*

---

## Scope-Abgrenzung (bewusst)

**IN Slice 2:**
- Deterministische **Requirement-Engine** als eigenes, testbares Modul (reine Funktion).
- Ableitung **Pflicht-Set + Schulungs-Soll** je Person aus dem Bedingungs-Vektor; jede Regel mit `clauseId`.
- **Minimale neue Inputs**, ohne die die Engine nichts ableiten kann: **SDL/Geltungsbereich** + **„fährt Dienstfahrzeug"** (Schema + kleine UI-Erfassung). *(Tally-Capture dieser Felder = später, hier nur internes Erfassen.)*
- Ablösung der **Platzhalter-Logik** `isSecurityRole(roleId)` (prüft heute `engineer/manager/analyst` — Legacy-Schrott) durch die echte **`roleType`-Stammdatenrolle**.

**OUT (nicht jetzt):**
- **Ampel Rot/Gelb/Grün + Pool-Listenansicht** → Slice 3.
- **Firmen-/Zertifizierungs-Quote** je SDL (Tab. 1, 35/60 % …), Subunternehmer-<50 %, Stichprobe → **separate Zertifizierungsansicht, Phase 2** (CL-41/42/48). **NICHT in die Einzelakte** (Norm-Matrix §9).
- **A/B/C-Vollmatrix** (Tab. A.1 / Anh. C). Default **Stufe A**; B/C nur manueller Sonderfall „fachlich prüfen" (CL-07, Matrix §3.1).
- Audit-Export → Slice 4. Shell/`intern` → Slice 5.

---

## Engine-Architektur (Vorschlag)

**Neues Modul, reine Funktion, keine Seiteneffekte** — separat vom EC-09-Generator:

```
modules/03-mitarbeiterakte-tool-2/employee-file/requirement-engine.ts
```

Signatur (Vorschlag — Cursor finalisiert Typen):

```
deriveRequirements(ctx: RequirementContext): RequirementResult
```

- **`RequirementContext`** = normalisierter Bedingungs-Vektor (s. u.), gebaut aus `Employee` + `Appointment[]` (+ neue Felder). Engine kennt **nur** dieses Context-Objekt, nicht das DB-/UI-Modell → testbar.
- **`RequirementResult`** = `{ pflichtSet: EngineRule[], schulungsSoll: TrainingTarget[], fristen: Deadline[], hinweise: string[] }`.
- **`EngineRule`** trägt zwingend: `id`, `label`, `clauseId` (`"CL-xx"` | `null`), `status` (`WorkingItemStatus`, bestehende Union), `trigger` (Klartext-Bedingung), `quelle?` (z. B. „DIN 77200-2 §8.3").
- **Regel ohne `clauseId` ist nur zulässig als `status: "fachlich prüfen"`** (keine erfundene Pflicht — Klausel-Register-Konvention).

`employee-file-requirements.ts` wird zum **Presenter**: ruft `deriveRequirements()` und mappt das Ergebnis in die bestehenden `RequirementRow`-Sektionen (Geltungsbereich, Pflichtnachweise, Schulung/Unterweisung, Offene Punkte). **Keine Änderung an `getEmployeeFileSummary`-Signatur nach außen**, nur Innenleben.

### Harte Architektur-Leitplanke — Engine UI-unabhängig (nicht verhandelbar)
**Die Requirement-/Readiness-Engine (`requirement-engine.ts`) MUSS ein eigenständiges, UI-unabhängiges Modul sein: reine TS-Logik, framework-agnostisch.**
- **Keine React-Komponenten, kein JSX, keine UI-Imports** im Engine-Modul (kein `react`, kein `next/*`, keine Komponenten/Hooks, kein DOM/Browser-API). Erlaubt sind nur reine TS-Typen + die Norm-/Katalog-Konstanten.
- **Jede UI ist nur Konsument der Engine** — die interne Akte-Ansicht (jetzt) **und** die spätere kundenseitige Ansicht (Kundenportal, Phase 2) sitzen **auf derselben Engine, ohne Engine-Umbau**.
- Ein-/Ausgabe ausschließlich über serialisierbare Plain-Objekte (`RequirementContext` → `RequirementResult`); keine versteckte Kopplung an UI-State, Server-Action-Kontext oder DB-Client.
- **Begründung:** Wiederverwendbarkeit über die UI-Grenze hinweg + Testbarkeit (reine Funktion). Verstoß (UI-Abhängigkeit in der Engine) = Architektur-Bruch → Re-Review.
- Bleibt konsistent mit EC-09 (Generator unangetastet) und EC-10 (Engine liefert nur Nachweis-Status, keine Freigabe-/Auditfähigkeitsaussage — das gilt für jeden Konsumenten gleichermaßen).

---

## Bedingungs-Vektor (Inputs)

| Dimension | Quelle heute | Aktion Slice 2 |
|---|---|---|
| **Rolle** | `Employee.roleType` (`ROLLE_TYPE_OPTIONS`) | nutzen statt `roleId`-Heuristik |
| **Beauftragungen** | `Employee.appointmentIds` → Overlay-Labels | nutzen (Ersthelfer/Brandschutz/Interventionskraft/Fahrzeugführer …) |
| **Beschäftigungsart** | `Employee.employmentType` | nutzen (Vollzeit/Teilzeit → 40/24 UE) |
| **Qualifikation** | `Employee.qualification` | nutzen (Unterrichtung vs. Sachkunde → 6-Monats-Frist) |
| **Eintritt** | `Employee.startDate` | nutzen (Frist-Berechnung) |
| **SDL / Geltungsbereich** | **fehlt** | **NEU:** `sdlScopes: string[]` (Mehrfachauswahl aus SDL-Katalog) |
| **fährt Dienstfahrzeug** | **fehlt** | **NEU:** `drivesServiceVehicle?: boolean` |

**Neue Felder** (Prisma `EmployeeFile` + Typ `Employee` + Repository-Mapping) — **freigegeben (Mark, 2026-06-07):**
- `sdlScopes Json @default("[]")` — Liste der SDL, in denen die Person eingesetzt ist.
- `drivesServiceVehicle Boolean?` — ja/nein/unbekannt.
- `ersteHilfeGueltigBis String?` — Ablaufdatum Erste Hilfe (für 2-J.-Frist, CL-08). **freigegeben.**
- `brandschutzGueltigBis String?` — Ablaufdatum Brandschutzhelfer (für 3-J.-Frist, CL-23). **freigegeben.**
- `weiterbildungIstUE Int?` — **manuell** erfasste Ist-UE der laufenden Jahres-Weiterbildung (Entscheidung 3). **freigegeben.**
- `einmalSchulungIstUE Json @default("{}")` — optional, manuell erfasste Ist-UE je einmaligem Posten (Posten-Key → UE). **freigegeben.**

### Gruppen-Scope-Zuweisung (Bulk) — **freigegeben (Mark, 2026-06-07)**
Neben der Einzel-Zuweisung pro Akte: **eine SDL einer ganzen Gruppe von Mitarbeitern auf einmal zuweisen** (Mark: „ganze Gruppen in einen Scope packen"). Vorschlag:
- Im Kunden-Pool Mehrfach-Auswahl (Checkboxen) → Aktion „SDL zu Auswahl hinzufügen/entfernen".
- Engine bleibt **pro Person** identisch (Bulk schreibt nur `sdlScopes` mehrerer Akten) — keine Sonderlogik in der Engine.
- **Scope-Risiko:** Wenn die Pool-Mehrfachauswahl-UI größer wird, gehört sie eher zur Listenansicht (Slice 3). **Minimal-Variante in Slice 2**: einfache Bulk-Zuweisung auf der bestehenden Pool-/Index-Liste; ausufernde Pool-UX → Slice 3. Cursor meldet, falls es wächst.

**SDL-Katalog (Vorschlag, mappt auf Geltungsbereich):**

| SDL | Geltungsbereich | Treibt |
|---|---|---|
| Alarm-, Empfangs-, Kontrolldienst (stat./mobil), Revier-, Interventionsdienst | DIN 77200-**1** | Grund-Pflichtset; Intervention → CL-09 |
| Veranstaltung bes. Sicherheitsrelevanz | DIN 77200-**2** §5 | einmalige Schulung CL-20/21 |
| Objekte bes. Sicherheitsrelevanz | DIN 77200-**2** §7 | +20 UE/J CL-22 · Brandschutz CL-23 |
| Flüchtlings-/Asyleinrichtungen | DIN 77200-**2** §8 | 40/64 UE CL-24/25 |
| Öffentlicher Personenverkehr (ÖPV) | DIN 77200-**2** §6 | Scope-Nachweis; **UE = fachlich prüfen** (kein belegter UE-Wert in v2) |
| NON-DIN (gesetzl. Mindeststandard) | außerhalb DIN | nur gesetzl. Boden → **fachlich prüfen** (CL-70/71/72 legal-input) |

---

## Regelwerk (jede Zeile = eine Engine-Regel mit `clauseId`)

### A. „Qualifiziert"-Pflichtset (Person mit Bewachungsrolle: SMA, Führungskraft, Subunternehmer-SMA)
Definition „qualifiziert" = **§4.1 b) UND §4.19.1** (CL-40, Matrix §1).

| Regel-ID | Anforderung | Bedingung | clauseId | Default-Status |
|---|---|---|---|---|
| `q-34a` | Unterrichtung **oder** Sachkunde §34a vorhanden | Bewachungsrolle | **CL-01** | aus `qualification` ableiten |
| `q-sachkunde-frist` | Sachkunde spätestens Ende **6. Monat** ab `startDate` | Bewachungsrolle **und** Eintritt = Unterrichtung | **CL-02** | „beantragt/offen" + Frist (s. Fristen) |
| `q-einweisung` | Einweisung Dienstanweisung | Bewachungsrolle | **CL-03** | „fehlt" bis Nachweis |
| `q-datenschutz` | Datenschutzverpflichtungserklärung | Bewachungsrolle | **CL-04** | „fehlt" |
| `q-verschwiegenheit` | Verschwiegenheitsverpflichtung | Bewachungsrolle | **CL-05** | „fehlt" |
| `q-profil` | Profil-Mindestqualifikation **Stufe A** | Bewachungsrolle | **CL-06 / CL-07** | „vorbereitet" (A); B/C = „fachlich prüfen" |
| `q-ersthilfe` | Erste Hilfe aktuell (Erneuerung **alle 2 J.**) | Bewachungsrolle | **CL-08** | „fehlt" + Frist |
| `q-intervention` | 24-h-Schulung **+ 5 Interventionen** | SDL Interventionsdienst **oder** Beauftragung Interventionskraft | **CL-09** | „fehlt" |
| `q-fk-quali` | Fachkraft/Servicekraft/GSSK/Werkschutzfachkraft **+ 2 J. Erfahrung** | Rolle = Führungskraft | **CL-10** | „fachlich prüfen" |

### B. Rollenabhängige Reduktion
| Rolle | Verhalten | clauseId |
|---|---|---|
| **Bürokraft / Verwaltung**, **Geschäftsführung** | **Kein** §34a-Bewachungs-Pflichtset. Aktiv nur: Arbeitsvertrag, Datenschutz, Verschwiegenheit. §34a/Sachkunde = „nicht erforderlich" (sofern keine Bewachungstätigkeit). | CL-04/05 (Bewachungs-CLs = n/a) |
| **Praktikant / Azubi** | Reduziert; alles Bewachungsspezifische = „fachlich prüfen" | — (kein CL → nur „fachlich prüfen") |
| **Subunternehmer-SMA** | **Gleiches Personen-Pflichtset wie SMA.** Hinweis-Text: „zählt in Firmen-Quote (CL-42), Subunternehmer-<50 % = **Firmenebene, Phase 2**, nicht diese Akte." | CL-40 (Person), CL-42 (nur Hinweis) |

### C. SDL / Geltungsbereich → Scope-Nachweise + einmalige Schulung
| Bedingung | Anforderung | clauseId | Status |
|---|---|---|---|
| SDL = Veranstaltung bes. SR · Rolle FK | **24 UE einmalig** | **CL-20** | Schulungs-Soll |
| SDL = Veranstaltung bes. SR · Rolle EK/SMA | **16 UE einmalig** | **CL-21** | Schulungs-Soll |
| SDL = Objekte bes. SR · EK/SMA | **+20 UE/Jahr** objektspezifisch | **CL-22** | Schulungs-Soll (jährlich) |
| SDL = Objekte bes. SR (77200-2-Kontext) | **Brandschutzhelfer 4 UE, alle 3 J.** | **CL-23** | „fehlt" + Frist 3 J. |
| SDL = Flüchtling/Asyl · EK/SMA | **40 UE einmalig** (interkult. + Deeskalation + Brandschutz) | **CL-24** | Schulungs-Soll |
| SDL = Flüchtling/Asyl · FK | **+24 UE (= 64) einmalig** | **CL-25** | Schulungs-Soll |
| SDL = Flüchtling/Asyl | Personalschlüssel (2 SMA/Schicht …) | **CL-26** | **Hinweis-Text** (Schicht-/Firmenebene, **keine Einzelakten-Pflicht**) |
| SDL = ÖPV (§6) | Scope-bezogene Unterweisung | — | „fachlich prüfen" (kein belegter UE-Wert) |
| SDL = NON-DIN | gesetzl. Mindeststandard (BewachV) | CL-70/71/72 (legal-input) | „fachlich prüfen" |
| objektbezogene Einweisung | erforderlich bei Projekt/Objekt-Kontext | — | „fachlich prüfen" |

### D. Beauftragungen (additive Overlays — ergänzen, ersetzen nie die Grundrolle)
| Beauftragung | Anforderung | clauseId | Status |
|---|---|---|---|
| Ersthelfer | Erste-Hilfe-Nachweis (2 J.) | **CL-08** | „fehlt" + Frist |
| Brandschutzhelfer | 4 UE, alle 3 J. | **CL-23** | „fehlt" + Frist |
| Interventionskraft | 24 h + 5 Interventionen | **CL-09** | „fehlt" |
| SiBe / sonstige | additiver Nachweis | — | „fachlich prüfen" |

### E. Schulungs-Soll (Zähler — getrennt von „qualifiziert"-Ampel, Matrix §6/§9)
| Posten | Wert | clauseId |
|---|---|---|
| **Jahres-Weiterbildung** | **40 UE** (Vollzeit) / **24 UE** (Teilzeit/nicht-Vollzeit); **DL ≤ 50 %** | **CL-11** |
| **Einmalige SDL-Schulung** | je SDL aus Abschnitt C (24/16/40/64 UE …) | CL-20/21/24/25 |
| **Objekt-Zusatz** | +20 UE/Jahr | CL-22 |
| **Anrechnung** | Einmalschulung im **Erwerbsjahr** auf Jahres-WB anrechenbar | **CL-27** |

> **UE-Werte sind §-belegt (v2-Matrix)** → Engine berechnet sie als echte Zahlen mit `clauseId`. **Anzeige festgelegt (Entscheidung 3, s. u.).** Wo kein belegter Wert existiert (ÖPV, Fahrer/UVV, B/C-Stufe) → „fachlich prüfen", **kein Wert erfunden.**

### E.1 Anzeige-Spezifikation Schulungs-Soll (Entscheidung 3 — Mark, 2026-06-07)
**Layout = Variante C (Zwei-Block-Karte), laufend/einmalig getrennt.** Balken (aus Variante B) **NUR** beim laufenden Jahres-UE; einmalige Posten **ohne** Balken.

```
┌─ Schulungs-Soll ──────────────────────── rechnerisch · kein Freigabestatus ─┐
│                                                                              │
│  LAUFEND — Jahres-Weiterbildung (§4.19.2)                          CL-11     │
│  ▓▓▓▓▓▓░░░░░░░░░░░░░░░░  12 / 40 UE  ·  Rest 28      Status: unvollständig    │
│  Vollzeit · DL ≤ 50 % (online max. 20 UE)                                    │
│                                                                              │
│  EINMALIG — SDL-bezogene Schulung (Teil 2)                                   │
│  • Veranstaltung bes. SR · EK        Soll 16 UE · Ist 0 · Rest 16  offen      CL-21 │
│  • Objekt-Zusatz (jährl.)            Soll 20 UE                  fachlich prüfen  CL-22 │
│  Anrechnung einmaliger UE auf Jahres-WB im Erwerbsjahr möglich   CL-27       │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────┘
```

**Wording-Baustein (verbindlich):**
- **Soll** = Norm-Vorgabe (mit `CL-xx`) · **Ist** = erfasste UE · **Rest** = Soll − Ist.
- Status-Wörter: `offen` · `unvollständig` · `rechnerisch erreicht` · `fachlich prüfen`. **Nie „erfüllt = einsatzbereit"** und kein „auditfähig/freigegeben/zertifiziert" (EC-10).
- Karten-Header trägt dauerhaft den Hinweis „rechnerisch · kein Freigabestatus".

**Ist-Quelle (Entscheidung 3):**
- **Slice 2 = manuell** erfasste Ist-UE pro Posten, im UI **als „manuell erfasst" gekennzeichnet** (kein automatischer Nachweis-Beleg).
- **Auto-Summe aus Schulungs-/Unterweisungsnachweisen → Slice 3/4** (nicht jetzt).
- Neues Feld dafür: `weiterbildungIstUE Int?` (laufendes Jahr) am `EmployeeFile`; einmalige Posten-Ist optional als kleines Json-Map `einmalSchulungIstUE Json @default("{}")` (Posten-Key → UE) — Cursor finalisiert die genaue Form, Kennzeichnung „manuell" Pflicht.

### F. „fährt Dienstfahrzeug?"
| Bedingung | Anforderung | clauseId | Status |
|---|---|---|---|
| `drivesServiceVehicle = true` | Fahrer-/UVV-Unterweisung (DGUV) + ggf. Führerschein-Nachweis | **CL-73** (legal-input) | **„fachlich prüfen"** — Werte/Turnus noch offen (Matrix §10.4/§11) |

---

## Status-/Fristen-Logik (deterministisch)
- **6-Monats-Sachkunde (CL-02):** Eintritt = Unterrichtung → Frist = `startDate + 6 Monate`. Heute < Frist → „beantragt/gelb-Vorstufe"; überschritten → „abgelaufen/rot-Vorstufe". Sachkunde vorhanden → dieser Punkt erfüllt.
- **Erste Hilfe (CL-08):** Erneuerung alle **2 Jahre** → Frist aus letztem Nachweisdatum (Feld noch nicht vorhanden → bis dahin „fehlt/Frist offen").
- **Brandschutz (CL-23):** alle **3 Jahre**.
- Frist-Felder, die noch nicht erfasst werden, ehrlich als „Frist offen" markieren — keine grüne Behauptung.

---

## Betroffene Dateien (Erwartung — Cursor finalisiert)
**Neu:**
- `modules/03-mitarbeiterakte-tool-2/employee-file/requirement-engine.ts` — Engine (reine Funktion + Typen + SDL-Katalog).
- (Empfohlen) `…/requirement-engine.test.ts` — Unit-Tests für Kern-Szenarien (s. DoD).

**Geändert:**
- `…/employee-file/employee-file-requirements.ts` — `isSecurityRole(roleId)` raus, Presenter ruft Engine; `roleType`-basiert.
- `…/employee-file/employee-stammdaten-options.ts` — SDL-Katalog-Optionen + „fährt Dienstfahrzeug".
- `…/employee-file/types/employee.ts` — `sdlScopes`, `drivesServiceVehicle`.
- `prisma/schema.prisma` — `EmployeeFile.sdlScopes`, `.drivesServiceVehicle` (+ `db:push`).
- `lib/employee-file-repository.ts` — Mapping neuer Felder.
- `…/EmployeeFilePersonRolleEditTable.tsx` (o. ä. Stammdaten-Edit) — SDL-Mehrfachauswahl + Dienstfahrzeug-Toggle.
- `…/EmployeeFileDossierView.tsx` — Pflicht-Set + Schulungs-Soll anzeigen (mit `clauseId`-Badge + Trigger).

**Tabu (EC-09):** `employee-generator/generate-employee-docs.ts` + `app/actions/…`-Shim **nicht anfassen**.

---

## Definition of Done
- Engine ist **reine, getestete Funktion**: gleicher Input → gleicher Output; jede Pflicht trägt `clauseId` oder ist `fachlich prüfen`.
- Akte zeigt **Pflicht-Set + Schulungs-Soll** mit sichtbarem Auslöser + Norm-Fundstelle.
- **Mind. 5 Szenarien** korrekt (Unit-Test + Browser):
  1. SMA Vollzeit, Sachkunde, DIN 77200-1 → §4.1b/§4.19.1-Set, **40 UE** WB, keine Teil-2-Schulung.
  2. SMA Teilzeit, **Unterrichtung**, Eintritt vor 5 Mt. → **6-Monats-Frist gelb**, **24 UE** WB.
  3. EK Veranstaltung bes. SR → **16 UE einmalig (CL-21)** + WB.
  4. EK Flüchtling/Asyl → **40 UE (CL-24)** + Brandschutz-Hinweis.
  5. Bürokraft → **kein** §34a-Set; Datenschutz/Verschwiegenheit aktiv.
  6. `drivesServiceVehicle = true` → Fahrer-/UVV-Zeile als **„fachlich prüfen" (CL-73)**.
- **Keine erfundene Pflicht:** jede aktive Pflicht im Code rückführbar auf eine CL-ID des Registers.
- **EC-09-Smoke grün** (Person → Akte → Doc-Chips → ZIP) vor/nach.
- **EC-10 gewahrt:** kein „freigegeben/auditfähig/zertifiziert/einsatzbereit"; Status bleiben in der konservativen `WorkingItemStatus`-Union. „Qualifiziert" wird als **Nachweis-Aussage** dargestellt, nicht als Freigabe.
- `npx tsc --noEmit` = 0 Fehler; keine **neuen** ESLint-Errors.
- **Browser-Akzeptanz** (nicht nur Skript): Felder erfassbar, Pflicht-Set ändert sich live mit SDL/Rolle/Dienstfahrzeug.

---

## Entscheidungen (Mark, 2026-06-07)
1. ✅ **Neue Felder jetzt** — `sdlScopes` + `drivesServiceVehicle` ins Schema/UI (Empfehlung angenommen).
2. ✅ **SDL-Mehrfachauswahl je Person** — ja. **Zusätzlich: Bulk-Zuweisung ganzer Gruppen** in einen Scope (s. „Gruppen-Scope-Zuweisung").
3. ✅ **Schulungs-Soll-Anzeige festgelegt** — **Variante C** (laufend/einmalig getrennt), **Balken nur** beim laufenden Jahres-UE, einmalige Posten ohne Balken. Wording-Baustein verbindlich (Soll/Ist/Rest + offen/unvollständig/rechnerisch erreicht/fachlich prüfen, nie „erfüllt = einsatzbereit"). **Ist-Quelle Slice 2 = manuell + gekennzeichnet**, Auto-Summe aus Nachweisen = Slice 3/4. Vollständige Spez: **§E.1**.
4. ✅ **Erste-Hilfe-/Brandschutz-Ablaufdatum jetzt** als Akte-Felder (`ersteHilfeGueltigBis`, `brandschutzGueltigBis`) für die Fristen-Logik.

**Slice 2 ist damit vollständig freigegeben** — alle 4 Entscheidungen geklärt, kein offener Blocker. Executor baubereit.

---

## Rückmeldung
Nach Freigabe: Bau gemäß DoD; Ergebnis + offene Punkte + Commit-Hashes in `HANDOFF.md` („Von Cursor an Claude"). Planer/Claude reviewt gegen Norm-Matrix v2 + Klausel-Register (jede Regel-`clauseId` prüfen) → `CODE_REVIEW.md`. **Faustregel: 1 Slice / Chat.**
