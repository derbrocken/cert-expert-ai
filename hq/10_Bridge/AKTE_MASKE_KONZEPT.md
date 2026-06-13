# Akte-Eingabe-Maske (SMA / Tool 2) — Neu gedachtes Core- & UI/UX-Konzept

> **Rolle:** Produkt-/UX-Architekt (Spur P, Design-Gate C-10) — **kein Produktivcode**. Read-only-Recherche + Konzept.
> **Stand:** 2026-06-13. **Status: ENTWURF → wartet auf Mark-Abnahme.** Erst danach gegated bauen, Slice für Slice.
> **Rahmen:** Diese Maske ist die **Eingabe-/Bearbeitungs-Schicht** der Sektionen ② (Stammdaten & Rollen) und teilweise ③ (Engine-Inputs) des vertikalen Lebenszyklus aus `MITARBEITERAKTE_ZIELDESIGN.md`. Sie ersetzt **nicht** Engine, Prüfung, Generator oder Audit — sie **füttert** sie korrekt.
> **Grundlage (geprüft):** Original-IA `B6_2…`–`B6_6`, `B5_1`-Inventar, `MITARBEITERAKTE_ZIELDESIGN.md`, echtes Feld-Inventar (`EmployeeForm.tsx`, `EmployeeFilePersonRolleEditTable.tsx`, `types/employee.ts`, `validations/employee-form.ts`), Engine-Inputs (`requirement-engine.ts` `RequirementContext`, `employee-file-requirements.ts`), Tally-Weg (`TALLY_FIELD_MAPPING.md`, `lib/tally-intake-config.ts`), Norm (`NORM_KLAUSEL_REGISTER_v1.md`).

---

## 1. Zweck & Core-Funktion

Die Maske ist die **eine** Stelle, an der die Daten einer Sicherheitskraft (SMA) **erfasst, importiert und korrigiert** werden. Sie muss vier Dinge gleichzeitig leisten: (1) eine SMA **manuell anlegen** (leere Akte → ausfüllen), (2) eine per **Tally-Webhook (`vGNvY0`) überführte** Akte anzeigen, die importierten Werte sichtbar machen und die **Lücken** zum Nachtragen öffnen, (3) die **korrekten Engine-Inputs** liefern (`roleClasses` EK/FK, `employmentType`, `sdlScopes`, `drivesServiceVehicle`, `bestelltAls`, `gender`, `qualifications`, Fristdaten) — exakt die Felder, aus denen `requirement-engine.ts` das Pflicht-Set, Soll-UE und Fristen ableitet — und (4) **prüf-/audit-fähig vorbereiten**, ohne selbst eine Freigabe-/Auditfähigkeits-Aussage zu treffen (EC-10). Die Maske ist eine **Re-Organisation** der heute schon vorhandenen Felder (`EmployeeFilePersonRolleEditTable` + das 68-KB-`EmployeeForm`), kein neues Datenmodell.

---

## 2. Vollständiges Feld-Inventar (gruppiert in Sektionen)

Quellen-Spalte: **M** = manuell · **T** = kommt aus Tally `vGNvY0` (siehe `TALLY_FIELD_MAPPING.md`) · **F** = aus Firmendaten/CompanyExportSettings (read-only) · **abgel.** = abgeleitet/migriert. „Engine?" = steuert das Requirement-Engine-Pflicht-Set/Soll-UE/Fristen (`RequirementContext`). CL = Norm-Bezug aus dem Register, wo das Feld eine Normpflicht *triggert* (nicht: das Feld selbst ist Pflicht).

### Sektion A — Stammdaten (Identität)
| Feld | Modell-Key | Pflicht | Quelle | Engine? | CL / Hinweis |
|------|-----------|---------|--------|---------|--------------|
| Vorname | `fullName` (split) | **Pflicht** (≥2 Zeichen gesamt) | M / T (`QAkPAA`) | nein | Pflichtangabe Akte |
| Nachname | `fullName` (split) | **Pflicht** | M / T (`QAkPAA`) | nein | `splitFullName`/`joinFullName` |
| Geburtsdatum | `birthday` | **Pflicht** | M / T (`eBvkBE`, DATE) | nein | Anzeige TT.MM.JJJJ |
| Geschlecht | `gender` | optional (nullable PII) | M | **nein** (kein Engine-Eingriff) | **CL-77** — nur `weiblich` triggert Mutterschutz-Hinweis-Overlay („fachlich prüfen") |
| Bewacher-ID | `guardIDNumber` | optional (empfohlen bei Bewachung) | M / T (`jBzDvE`, NUMBER) | nein | Stammdatum — getrennt vom Bundesauszug-Nachweis |
| Dienstausweisnummer | `employeeIDNumber` | optional | M / T (`1rRklb`) | nein | — |
| Bewacher-ID als Dienstausweis-Nr. nutzen | `useGuardAsEmployeeId` | optional | M | nein | UX-Helfer (spiegelt Wert) |

### Sektion B — Beschäftigung
| Feld | Modell-Key | Pflicht | Quelle | Engine? | CL / Hinweis |
|------|-----------|---------|--------|---------|--------------|
| Vertragsbeginn | `startDate` | **Pflicht** | M / T | nein | Default-Bezug für Fristen (Sachkunde-6-Monats-Frist, Erstunterweisung) |
| Austrittsdatum | *(nicht im Modell)* | optional | M | nein | heute disabled „Nur bei Beendigung" — **Soll: echtes Feld** (siehe DM6) |
| Beschäftigungsart | `employmentType` | optional | M / T (`aBv7BE`, DROPDOWN) | **ja** | Engine-Input (`RequirementContext.employmentType`) |
| Aktiver Status | *(nicht im Modell)* | — | abgel. | nein | heute Platzhalter „aktiv" (Working UI) |
| Unternehmen | `GlobalProperties.companyName` | read-only | F | nein | Aus Firmendaten (Upload Manager / CompanyExportSettings) |

### Sektion C — Rolle & Norm-Klasse (primärer Engine-Treiber)
| Feld | Modell-Key | Pflicht | Quelle | Engine? | CL / Hinweis |
|------|-----------|---------|--------|---------|--------------|
| Norm-Klassen-Set (EK / FK / Verwaltung / Praktikant / Subunternehmer) | `roleClasses[]` | optional* (leer = „Keine Norm-Klasse erfasst") | M / abgel. (aus `roleType`/Legacy) | **ja — primär** | **CL-40** (qualifiziert = §4.1b ∧ §4.19.1), **CL-06/07** (A/B/C-Profile), **CL-42** (Subunternehmer >50 %). EK+FK frei kombinierbar |
| Org-Titel (Anzeige) | `roleType` | optional | M / T (`pLzdKP`, DROPDOWN) | nein (nur Trigger-Klartext) | Default-Klasse-Vorschlag via `ORG_TITLE_TO_ROLE_CLASS` (überschreibt gewählte Klasse nicht) |
| Set-Kategorie (Vorlagen-Achse: SiMa / FK / Bürokraft) | `setKategorie` | optional | M / abgel. (aus `roleId`) | nein | Steuert **nur** Generator-Core-Vorlagen-Set — ≠ Norm-Klasse, ≠ Org-Titel |
| Dokumenten-Vorlage (Rolle) | `roleId` | **Pflicht** (Zod) | M / abgel. | nein (Generator) | Steuert Generator-Dokumentenpalette (EC-09). Nicht = Norm-Identität |

\* Engine-relevant, aber **kein Save-Blocker** — leere Klasse ist zulässig (`validations/employee-form.ts`).

### Sektion D — Geltungsbereich (SDL)
| Feld | Modell-Key | Pflicht | Quelle | Engine? | CL / Hinweis |
|------|-----------|---------|--------|---------|--------------|
| SDL / Geltungsbereich (Multiselect aus `SDL_SCOPE_CATALOG`) | `sdlScopes[]` | optional | M | **ja — primär** | je Scope eigene CL: Intervention **CL-09**, Veranstaltung **CL-20/21**, Objekte **CL-22/23**, Asyl **CL-24/25/26**, ÖPV **CL-29/30**, NON-DIN **CL-72** (legal-input). Quote je SDL **CL-41** |
| Fährt Dienstfahrzeug? | `drivesServiceVehicle` | optional (true/false/undefined) | M | **ja** | **CL-73** (Fahrer-/UVV-Unterweisung, legal-input, „fachlich prüfen") |
| Projektzuordnung | *(nicht im Modell)* | — | — | nein | heute disabled „SDL/Projekt folgt" — Projektakte-Anbindung später |

### Sektion E — Bestellungen (formale Ernennungen)
| Feld | Modell-Key | Pflicht | Quelle | Engine? | CL / Hinweis |
|------|-----------|---------|--------|---------|--------------|
| Bestellt als … (Ersthelfer / Brandschutzhelfer / SiBe) | `bestelltAls[]` | optional | M / abgel. (aus `appointmentIds`) | indirekt (löst Fristfelder/Doc-Chips aus) | Ersthelfer **CL-08**, Brandschutzhelfer **CL-23**, SiBe **CL-74**. Bestellung ≠ Schulung; unterschriftspflichtig; **kein Auto-Status** (EC-10) |
| Bestell-Doc-Chips (Generator-Ordner `bestellungen`) | `appointmentIds[]` | optional | M / abgel. | nein (Generator) | Legacy-Achse, treibt Generator-Ordner; Bestellung↔Schulung-Link `bestellungSchulungLink` (nicht blockierend) |

### Sektion F — Qualifikationen & Fristen
| Feld | Modell-Key | Pflicht | Quelle | Engine? | CL / Hinweis |
|------|-----------|---------|--------|---------|--------------|
| Qualifikation (strukturiert, Multiselect aus `qualification-catalog`) | `qualifications[]` | optional | M | **ja — primär** | **CL-01/02** (§34a Unterrichtung/Sachkunde), **CL-76** (Waffensachkunde additiv) |
| Qualifikation (Freitext, Legacy) | `qualification` | optional | T (`24o87V`, DROPDOWN) | ja (Fallback wenn `qualifications` leer) | Persistenz-/Round-trip-Träger |
| Erste Hilfe gültig bis | `ersteHilfeGueltigBis` | optional | M | **ja (Frist)** | **CL-08** — 2-Jahres-Frist |
| Brandschutzhelfer gültig bis | `brandschutzGueltigBis` | optional | M | **ja (Frist)** | **CL-23** — 3-Jahres-Frist |
| Ist-UE Jahres-Weiterbildung | `weiterbildungIstUE` | optional | M | **ja (Soll−Ist)** | §4.19.2-Bezug (Soll aus Engine, Ist hier) |
| Ist-UE je SDL-Posten | `einmaligIstUE{}` | optional | M | **ja (Soll−Ist)** | je einmaligem/laufendem SDL-Posten |
| Datum Erst-Standardunterweisung | *(NICHT im Modell — Planer-Korrektur 2026-06-13)* | optional | M | (wäre Frist-Bezug) | **CL-75** real, aber **kein DB-Feld vorhanden** → wie Austrittsdatum ein **neues additives Feld** (eigene Entscheidung DM6b), NICHT bestehend. Default-Idee = `startDate` |

### Sektion G — Nachweise (NICHT Teil dieser Eingabe-Maske — Verweis)
Uploads/Prüf-Status (`evidenceChecks`, Tally-Files → `EvidenceItem` `unchecked`) leben in der **Nachweise & Prüfung-Sektion** (④) der Akte, nicht in dieser Stammdaten-Maske. Die Maske zeigt sie nur **referenzierend** (z. B. „Bundesauszug: importiert, ungeprüft") und verlinkt dorthin. **Grund:** EC-10 (Prüfung ist ein eigener menschlicher Schritt) + saubere Lebenszyklus-Trennung.

### Sektion H — Dokumente & Generator (NICHT Teil dieser Maske — EC-09-Verweis)
Doc-Auswahl (`selectedRoleDocIds`, `selectedAppointmentDocIds`, `setKategorie`-Wahl, `collectionId`, `generatorDates`) + ZIP bleiben **eigener Generator-Tab/-Sektion** (⑤, B6.1 §6 / DM-DA2). **Grund:** EC-09 — Doc-Auswahl-Pipeline darf nicht in der Eingabe-Maske vermengt werden.

**Zusammenfassung:** ~7+5+4+3+2+7 = **28 erfassbare Felder** in **6 Eingabe-Sektionen** (A–F), plus 2 Verweis-Sektionen (G, H) die bewusst ausgelagert sind. 4 Felder sind Zod-Pflicht (`fullName`, `birthday`, `startDate`, `roleId`).

---

## 3. UI/UX-Konzept (das „neu Gedachte")

> **Visual-Direction (verbindlich, `DESIGN_VISUAL_DIRECTION.md`):** „Premium Audit File OS" — Dossier-/Akten-Logik, Cards/Sektionen/Status-Chips, viel Whitespace, BG weiß/hellgrau, Text anthrazit/navy. **Brand-Accent = Vermillion** nur für aktive Nav/primäre Aktionen/Selected/Fokus — **nicht** als Fehlerfarbe. **Status-Farben getrennt vom Brand:** Grau=nicht bewertet · Amber=offen/prüfen · Rot=fehlt/kritisch · Grün=vollständig. Das Herkunfts-Badge (◆ importiert) ist eine **neutrale** Herkunft-Markierung (nicht Brand-Vermillion, nicht Status-Rot) — im Visual-Pass eine neutrale Nuance (blau/grau) festlegen. ⚠️ Brand-Vermillion (`#e30613`) und Status-Rot (fehlt/kritisch) müssen unterscheidbar sein.

### 3.1 Kern-Entscheidung: zwei Modi (Mark, 2026-06-14)

**Eingabe ≠ Ansicht.** Die Akte hat zwei klar getrennte Modi, die unterschiedliche Aufgaben haben:

| Modus | Form | Wofür |
|-------|------|-------|
| **ANSICHT** | **horizontal, Kapitel-Reiter** (Dossier-Cockpit) | Lesen/Auditieren/schnell springen: Übersicht · Stammdaten · Rolle · Geltungsbereich · Bestellungen · Qualifikationen · Nachweise |
| **EINGABE / ANLEGEN** | **vertikal, geführter Fluss** | Erfassen ohne etwas zu vergessen (Pflicht- + Norm-Felder), Lücken nachtragen |

So liest sich die Akte wie ein **Audit-Ordner mit Kapiteln** (premium, ruhig), während das Erfassen ein **geführter vertikaler Fluss** ist. Das ersetzt das heutige „eine lange vertikale Liste"-Verhalten (S1a) durch eine kapitelbasierte Ansicht — die schon gebaute **vertikale Inline-Eingabe (S1b)** wird zum vertikalen Eingabe-Fluss ausgebaut.

### 3.2 ANSICHT-Modus — horizontale Kapitel (Dossier-Cockpit)

Kopf der Akte: Person (Name, Org-Titel, Norm-Klasse-Chips, Gesamt-Status-Chip). Darunter eine **horizontale Kapitel-Navigation** (Reiter/Segmented), **Vermillion-Akzent nur am aktiven Reiter** (Visual-Direction). Jedes Kapitel = fokussiertes Panel aus **Cards + Status-Chips**, viel Whitespace, subtile Rahmen — keine überladene Tabelle.

```
┌ Max Mustermann · SMA · [EK][FK]                   ● offen ┐
│ ‹Übersicht›  Stammdaten  Rolle  SDL  Bestellungen  Quali  Nachweise │   ← aktiver Reiter Vermillion
├───────────────────────────────────────────────────────────┤
│  PFLICHT-SET (abgeleitet)                offene Punkte: 3   │
│  ┌ Sachkunde §34a  ● vorhanden ┐  ┌ Erste Hilfe  ○ fehlt ┐ │
│  └──────────────────────────────┘  └────────────────────┘ │
│  Fristen:  Brandschutz gültig bis 03/2026  ▲ läuft ab      │
│  Was fehlt:  Norm-Klasse ok · SDL leer · 2 Nachweise offen │
└───────────────────────────────────────────────────────────┘
```

- **Übersicht** (Default-Kapitel) = das Cockpit: Pflicht-Set-Ampel, offene Punkte, Fristen, „was fehlt". Rein informativ (EC-10, kein Auto-Grün).
- **Stammdaten / Rolle / SDL / Bestellungen / Quali** = die Erfassungs-Kapitel (read-only Cards + Stift → vertikale Edit-Form).
- **Nachweise** = Uploads + Prüfstatus (Lebenszyklus ④, menschlicher „geprüft"-Schritt).
- **Audit** = später (nach Projektakte, DA3).
- **Generator** bleibt **außerhalb** (eigener Tab, EC-09).

### 3.3 EINGABE / ANLEGEN — vertikaler geführter Fluss

„Neue Person" (und das Nachtragen vieler Lücken) läuft als **vertikale, geführte Sequenz** durch die Kapitel in sinnvoller Reihenfolge — mit vertikalem Fortschritt + Herkunfts-/Lücken-Badges, sodass Pflicht- und Norm-Felder nicht vergessen werden. Persistenz erst per **„Speichern"** (S1b-Muster, kein Auto-Speichern).

```
┌ Neue Person anlegen ───────────────────────────────────────┐
│ ① Stammdaten        ●  vollständig                          │
│ ② Beschäftigung     ○  ← hier                               │
│      Vertragsbeginn   [ 01.03.2024 ]   ◆ aus Tally          │
│      Beschäftigungsart[ Vollzeit ▼ ]   ○ Pflicht (Engine)   │
│ ③ Rolle & Norm-Klasse ◇                                     │
│ ④ Geltungsbereich     ◇                                     │
│ ⑤ Bestellungen        ◇                                     │
│ ⑥ Qualifik./Fristen   ◇                                     │
│                              [Verwerfen]  [Person speichern] │
└────────────────────────────────────────────────────────────┘
```

Nach „Speichern" → landet in der **Ansicht** (Kapitel „Übersicht"). Beim **Import aus Tally** entsteht die Akte direkt in der Ansicht; ein deutlicher Hinweis „X Pflicht-Lücken nachtragen" führt per Klick in den vertikalen Fluss, der nur die offenen Kapitel zeigt.

### 3.4 Bearbeiten in der Ansicht (Stift je Kapitel)

In der Ansicht ist alles **read-only** (Standard). Pro Kapitel ein **Stift „Bearbeiten"** → öffnet die **vertikale Edit-Form genau dieses Kapitels** (gleiche Controls wie der Anlege-Fluss) → „Speichern"/„Abbrechen" → zurück zur Ansicht. So ist schnelles Lücken-Nachtragen (Kapitel anspringen → Stift → speichern) und versehentliches Überschreiben ausgeschlossen.

### 3.5 Herkunft & Status (Visual-Direction-konform)
Jedes Feld bekommt ein kleines **Herkunfts-/Status-Badge** links der Zeile, konsistent über alle Sektionen:

```
● grün/grau  vorhanden (manuell erfasst)
◆ blau       aus Tally importiert  (Tooltip: „aus Formular vGNvY0, ungeprüft")
○ rot        Pflicht-Lücke (fehlt, blockiert sauberen Lebenszyklus)
◇ grau       optional & leer
▲ amber      importiert, aber fachlich zu prüfen / Konflikt (z. B. Tally-Wert ≠ Katalog)
```

Wichtig (EC-10): „importiert" = **ungeprüft**, niemals „grün/erledigt". Tally-Werte werden angezeigt, sind aber **editierbar/überschreibbar** und tragen das blaue ◆-Badge, bis ein Mensch sie ändert oder (in der Prüf-Sektion) prüft.

### 3.6 Inline-Validierung, Pflicht-Lücken, Ampel
- **Pflichtfelder** (`fullName`, `birthday`, `startDate`, `roleId`): rotes ○-Badge + Inline-Hinweis solange leer; blockieren **nicht** das Tippen, aber zeigen Akte-Status „unvollständig".
- **Engine-relevante Lücken** (kein `roleClasses`, kein `sdlScopes`): **kein** Save-Blocker, aber sichtbarer neutraler Hinweis „Keine Norm-Klasse erfasst → Pflicht-Set unvollständig" (entspricht heutiger Engine-Ausgabe).
- **Ampel:** je Kapitel ein aggregierter `WorkingItemStatus` aus `employee-file-requirements.ts` (`vorhanden`/`fehlt`/`offen`/`fachlich prüfen` …) als Status-Chip am Reiter — **rein Anzeige**, keine Auto-Freigabe (EC-10, B6.5: nur Grau live, R/G/G nur wo Engine belegt).

### 3.7 Edit-Technik (Speichern-Pfad, unverändert)
- Bearbeiten je Kapitel → „Speichern"/„Abbrechen". Speichern ruft denselben `onSave(employee)`-Pfad + `applyEmployeePatchWithDocSync` wie heute (Doc-Sync für `roleId`/`appointmentIds` bleibt erhalten, EC-09).
- Kein Auto-Speichern beim Tippen (S1b-Lehre): Eingaben werden gepuffert, erst „Speichern" persistiert.
- Controls bleiben die bestehenden: `Input`, `Select`, `MultiSelect`, `DatePicker`, `RoleClassSelector`.

### 3.8 Mobile/Desktop
- **Desktop:** Kapitel-Reiter horizontal; im Kapitel zweispaltige Card-Zeilen (Label + Hint | Control), Status-Chip eigene Spalte.
- **Mobile:** Kapitel-Reiter als scrollbare Segmented/Dropdown; im Kapitel gestapelt (Label oben, Control darunter, Badge inline) — `flex-col`-Fallback ist im Code vorhanden.

### 3.9 Alternativen kurz erwogen (verworfen zugunsten des Mode-Splits)
- **Akkordeon (alle Kapitel auf einer Seite, aufklappbar):** ok, aber liest sich weniger wie ein Audit-Ordner mit Kapiteln; verworfen zugunsten horizontaler Kapitel-Reiter.
- **Reine flache Liste (heutiges S1a):** voller Überblick, aber lange Seite/viel Scroll, mobil zäh.
- **Reiner Stepper für alles:** gut fürs Anlegen, umständlich fürs schnelle Nachtragen → daher Stepper-Idee **nur** im Eingabe-Modus (3.3), nicht in der Ansicht.
> Der gewählte **Mode-Split** (Ansicht = horizontale Kapitel · Eingabe = vertikal geführt, 3.1–3.4) nimmt von jeder Alternative das Beste.

---

## 4. Anlegen- vs. Bearbeiten- vs. Import-Fluss (3 Wege, eine Maske)

| Fluss | Einstieg | Verhalten der Maske |
|-------|----------|---------------------|
| **Anlegen (manuell)** | Index „Neue Person" → **vertikaler geführter Fluss** (3.3) | Felder leer mit ◇/○-Badges, Pflicht-Lücken rot, vertikaler Fortschritt durch die Kapitel. „Person speichern" legt Akte an (`onSave` → Repository, S1b schon gebaut) → danach **Ansicht** (Kapitel Übersicht). DA1: leere Akte inline, `EmployeeForm` abschmelzen. |
| **Bearbeiten (bestehend)** | Index/Klick → Akte in der **Ansicht** (horizontale Kapitel) | Read-only Cards + Herkunfts-Badges. Stift am Kapitel → vertikale Edit-Form dieses Kapitels → Speichern (`applyEmployeePatchWithDocSync`). Doc-Sync bleibt. |
| **Import (Tally `vGNvY0`)** | Webhook → `tally-intake-service` legt Akte + `EvidenceItem`s (`unchecked`) an | Ansicht zeigt importierte Felder mit ◆-Badge „aus Tally, ungeprüft". **Lücken** (was Tally nicht liefert: `roleClasses`, `sdlScopes`, `drivesServiceVehicle`, `gender`, Fristdaten, `qualifications`-Struktur) tragen ○/◇-Badges; Hinweis „X Pflicht-Lücken nachtragen" → vertikaler Fluss nur über die offenen Kapitel. Engine läuft sofort auf dem Teil-Stand. |

**Tally-Lücken-Hinweis (konkret, aus `TALLY_FIELD_MAPPING.md`):** Tally liefert `fullName`, `birthday`, `roleType` (Org-Titel), `employmentType`, `qualification` (Freitext), `guardIDNumber`, `employeeIDNumber` + Datei-Nachweise. **Nicht** geliefert und damit immer Nachtrag-Lücke: `roleClasses` (Norm-Klasse — wird höchstens aus `roleType` *vorgeschlagen*), `sdlScopes`, `drivesServiceVehicle`, `gender`, `setKategorie`, strukturierte `qualifications[]`, `ersteHilfeGueltigBis`/`brandschutzGueltigBis`, `bestelltAls`. Diese Lücken **prominent** zu machen ist eine Hauptaufgabe der Maske.

---

## 5. Guardrails (verbindlich)

- **EC-09:** Doc-Auswahl + ZIP-Generator bleiben **separater Generator-Tab/-Sektion** (⑤), **nicht** Teil dieser Eingabe-Maske. `selectedRoleDocIds`/`selectedAppointmentDocIds`/`generateEmployeeDocs` werden nicht angefasst; der bestehende `applyEmployeePatchWithDocSync` (Sync bei `roleId`/`appointmentIds`-Änderung) bleibt der einzige Berührungspunkt. Vor/nach jedem Slice ZIP-Smoke grün.
- **EC-10:** Kein Auto-Freigabe-/Auditfähigkeits-/Zertifizierungs-Status. Importierte Werte = **ungeprüft** (blaues ◆-Badge), nie „grün/erledigt". Prüfung (`evidenceChecks` → `geprueft: true`) bleibt menschlicher Schritt in der Prüf-Sektion (④).
- **Keine erfundene Normpflicht:** Jedes norm-getriebene Feld trägt eine CL-ID aus dem Register (siehe §2). Felder ohne belegte CL (z. B. `drivesServiceVehicle` → CL-73 legal-input, `sdlScopes`=NON-DIN → CL-72 legal-input) werden als **„fachlich prüfen"** dargestellt, nicht als harte Pflicht.
- **Engine unberührt:** `requirement-engine.ts` + UE-Werte + CL-IDs werden **nicht** verändert — die Maske liefert nur die `RequirementContext`-Inputs sauberer. Reiner IA-/Eingabe-Umbau.
- Nicht in Dateien schreiben, die Mark gerade offen hat.

---

## 6. Abgleich Ist → Soll

**Was die heutige Maske (`EmployeeFilePersonRolleEditTable`) gut macht:**
- Alle relevanten Felder sind schon da (Norm-Klasse via `RoleClassSelector`, SDL-Multiselect, Bestellungen, Fristen, Dienstfahrzeug, Guard-/Dienst-ID mit Spiegelung).
- Konsistente `rowShell`-Zeilen (Label + Hint + Control + Status-Badge `EmployeeFileStatusBadge`) — desktop/mobile responsiv.
- Engine-korrekte Patches über `applyEmployeePatchWithDocSync` (Doc-Sync erhalten, EC-09-sicher).
- Status-Pille je Zeile bereits vorhanden (aus `RequirementRow.status`).
- Hints mit CL-Bezug stehen schon dran (CL-08, CL-23, CL-73).

**Was fehlt / Soll-Neuerung:**
- **Keine Herkunfts-Unterscheidung** (Tally vs. manuell vs. fehlend) — heute sieht alles gleich aus. → ◆/●/○/◇/▲-Badge-System (§3.5).
- **Keine Kapitel-Gruppierung** — heute eine flache 22-Zeilen-Liste. → 6 Kapitel A–F (§2) + horizontale Kapitel-Ansicht (§3.2).
- **`gender` (CL-77) fehlt in der Inline-Maske** (im Schema vorhanden, im Edit-Table nicht gerendert) → Sektion A aufnehmen, Mutterschutz-Hinweis-Overlay nur bei `weiblich`.
- **`qualifications[]` (strukturiert) fehlt** — heute nur Freitext `qualification`. → strukturiertes Multiselect (Sektion F), Freitext als Legacy-Fallback.
- **`setKategorie` nicht editierbar in der Maske** (nur im Generator) → optional in Sektion C anzeigen.
- **`weiterbildungIstUE` / `einmaligIstUE` / `erstunterweisungDatum` fehlen** in der Inline-Maske → Sektion F (Soll−Ist & Frist-Bezug).
- **Austrittsdatum** ist disabled-Platzhalter ohne Modell-Feld → echtes Feld (DM6).
- **Kein Anlege-Fluss** in dieser Maske (heute via `EmployeeForm`) → leere Akte inline (DA1).
- **Kein sektionsweiser Edit** — heute global `evidenceEditMode` alles-oder-nichts → Stift je Sektion (§3.4).

---

## 7. Offene Design-Entscheidungen für Mark

- **DM1 — Layout:** ✅ **ENTSCHIEDEN (Mark, 2026-06-14): Mode-Split** — Ansicht = horizontale Kapitel-Reiter (Dossier-Cockpit), Eingabe/Anlegen = vertikaler geführter Fluss (§3.1–3.4). Visual-Direction angewandt.
- **DM2 — Herkunfts-Badge:** ◆/●/○/◇/▲-System (§3.5) einführen? Empfehlung **ja** — größter UX-Gewinn (Tally-Lücken sichtbar). ◆ neutral (nicht Brand-Vermillion). → ok?
- **DM3 — Edit je Kapitel vs. global:** Empfehlung **Stift je Kapitel** (öffnet vertikale Edit-Form des Kapitels). Alternative: heutiges globales Toggle behalten. → ok?
- **DM4 — `gender` (CL-77) aufnehmen:** Empfehlung **ja**, Sektion A, nur `weiblich` triggert Mutterschutz-Hinweis-Overlay („fachlich prüfen", EC-10, kein Engine-Eingriff). → ok?
- **DM5 — strukturierte `qualifications[]` in der Maske:** Empfehlung **ja** (besserer Engine-Input als Freitext), Freitext bleibt Round-trip-/Legacy-Träger. → ok?
- **DM6 — Austrittsdatum als echtes Feld:** Heute disabled-Platzhalter, kein Modell-Feld (additive nullable Spalte nötig). Empfehlung **als echtes optionales Feld** (Lebenszyklus „inaktiv"). → jetzt oder später?
- **DM6b — Erstunterweisungs-Datum (CL-75) als echtes Feld:** existiert **nicht** im Modell (Planer-Korrektur). Additive nullable Spalte nötig, Default = `startDate`. Empfehlung **später** zusammen mit DM6. → ok?
- **DM7 — Tally-Wert vs. manueller Wert bei Konflikt:** Wenn ein Mensch einen importierten Wert überschreibt — Badge auf ● (manuell) kippen und Tally-Original im Tooltip behalten? Empfehlung **ja** (Audit-Spur). → ok?
- **DM8 — `setKategorie` editierbar in der Maske (Sektion C) oder nur im Generator?** Empfehlung **read-only-Anzeige in C mit Sprung zum Generator** (vermeidet Doppel-Editier-Stellen). → ok?
- **DM9 — Anlege-Fluss:** Empfehlung **leere Akte inline (DA1)** → `EmployeeForm` abschmelzen. Alternative: separates Anlege-Formular behalten. → ok?

---

## 8. Umsetzungs-Slices (klein, EC-09-sicher, je gegated)

> Reihenfolge so, dass sichtbarer Nutzen früh kommt; jeder Slice: `tsc --noEmit` 0 · Test-Suite grün · `next build` grün · **EC-09-ZIP-Smoke** · Mark-Abnahme. **Kein** Slice ohne Mark-Freigabe.

> Baut auf dem schon Gebauten auf: S1a (EINE Akte-Ansicht + Stift) und S1b (Inline-Anlegen, „Person speichern", keine Geister-Akten) sind live (`20e6bf9`).

| Slice | Inhalt | Risiko | EC-09 |
|-------|--------|--------|-------|
| **M0** | **Dieses Konzept abnehmen** (DM1 entschieden) + DM2–DM9 (Mark-Gate) | — | — |
| **M1** | **Kapitel-Gruppierung:** die heutige flache `EmployeeFilePersonRolleEditTable` in die 6 Kapitel A–F gliedern (reine Reorganisation der `rowShell`-Zeilen, keine neuen Felder, kein Datenmodell). | gering | unberührt, Smoke |
| **M2** | **Ansicht = horizontale Kapitel-Reiter** (Dossier-Cockpit) statt langem Vertikal-Scroll; aktiver Reiter Vermillion, Status-Chip je Reiter. Kapitel „Übersicht" als Cockpit. Reine IA/Anzeige. | mittel | unberührt |
| **M3** | **Herkunfts-Badge-System** (◆/●/○/◇/▲) — Quellen-Flag „aus Tally" je Feld aus dem Intake + Rendering. Reine Anzeige (EC-10). | gering–mittel | unberührt |
| **M4** | **Edit je Kapitel** (Stift am Kapitel → vertikale Edit-Form) + **vertikaler geführter Anlege-Fluss** (S1b-Basis ausbauen: Fortschritt durch Kapitel). `onSave`/Doc-Sync unverändert. | mittel | Smoke (Doc-Sync) |
| **M5** | **Fehlende Felder:** `gender` (DM4, Overlay-Trigger), strukturierte `qualifications[]` (DM5), `weiterbildungIstUE`/`einmaligIstUE`, `setKategorie`-Anzeige (DM8). Additive Felder, alle schon im Modell. | mittel | unberührt |
| **M6** | (falls DM6 ja) **Austrittsdatum** + (DM6b) **Erstunterweisungs-Datum** als echte nullable Spalten + Felder. Schema-Migration nach Lane-J-Muster (additiv, `db push`). | mittel | unberührt |
| **M7** | (falls DM9 ja) `EmployeeForm` (68 KB) final abschmelzen, sobald M1–M4 die Maske vollständig tragen. | mittel | Smoke (Generator-Pfad bleibt) |

---

> **→ Mark:** Konzept so ok (DM1 = Mode-Split steht)? DM2–DM9 entscheiden → dann baue ich (Spur E) **M1** als ersten gegateten Slice (Kapitel-Gruppierung, kein EC-09-Risiko, Engine + Modell unberührt).
