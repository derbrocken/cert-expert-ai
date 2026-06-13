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

### 3.1 Etabliertes Muster als Anker
Das schon gebaute Muster im `EmployeeFileDossierView` ist **„Ansehen ↔ Bearbeiten" per Stift-Toggle** (`evidenceEditMode`, Pencil-Icon, „Bearbeiten"/„Fertig"). Das ist ein bewährtes Pattern (versehentliches Überschreiben vermeiden). Das neue Konzept **behält die Stift-Affordanz**, verfeinert sie aber von „alles-oder-nichts" zu **sektionsweisem Edit**, und macht **Quelle (Tally/manuell/fehlend)** + **Pflicht-Lücken** sichtbar — das fehlt heute komplett.

### 3.2 Darstellung von Wert-Herkunft (Kern-Neuerung)
Jedes Feld bekommt ein kleines **Herkunfts-/Status-Badge** links der Zeile, konsistent über alle Sektionen:

```
● grün/grau  vorhanden (manuell erfasst)
◆ blau       aus Tally importiert  (Tooltip: „aus Formular vGNvY0, ungeprüft")
○ rot        Pflicht-Lücke (fehlt, blockiert sauberen Lebenszyklus)
◇ grau       optional & leer
▲ amber      importiert, aber fachlich zu prüfen / Konflikt (z. B. Tally-Wert ≠ Katalog)
```

Wichtig (EC-10): „importiert" = **ungeprüft**, niemals „grün/erledigt". Tally-Werte werden angezeigt, sind aber **editierbar/überschreibbar** und tragen das blaue ◆-Badge, bis ein Mensch sie ändert oder (in der Prüf-Sektion) prüft.

### 3.3 Inline-Validierung, Pflicht-Lücken, Ampel
- **Pflichtfelder** (`fullName`, `birthday`, `startDate`, `roleId`): rotes ○-Badge + Inline-Hinweis solange leer; blockieren **nicht** das Tippen, aber zeigen Akte-Status „unvollständig".
- **Engine-relevante Lücken** (kein `roleClasses`, kein `sdlScopes`): **kein** Save-Blocker, aber sichtbarer neutraler Hinweis „Keine Norm-Klasse erfasst → Pflicht-Set unvollständig" (entspricht heutiger Engine-Ausgabe).
- **Ampel:** Die Maske zeigt **pro Sektion** den aggregierten `WorkingItemStatus` aus `employee-file-requirements.ts` (`vorhanden`/`fehlt`/`offen`/`fachlich prüfen` …) als kleine Status-Pille — **rein Anzeige**, keine Auto-Freigabe (EC-10, B6.5: nur Grau live, R/G/G nur wo Engine belegt).

### 3.4 Edit-Affordanz konsistent zum Bestehenden
- Ansehen-Modus: read-only Wert + Herkunfts-Badge, rechts kleiner **Stift** je Sektion → öffnet **nur diese Sektion** zum Editieren (Inline-Controls wie heute: `Input`, `Select`, `MultiSelect`, `DatePicker`, `RoleClassSelector`).
- Bearbeiten-Modus je Sektion: „Speichern" / „Abbrechen". Speichern ruft denselben `onSave(employee)`-Pfad + `applyEmployeePatchWithDocSync` wie heute (Doc-Sync für `roleId`/`appointmentIds` bleibt erhalten).
- Optional global „Alles bearbeiten" (heutiges Verhalten) als Sekundär-Button — Rückwärtskompatibilität.

### 3.5 Mobile/Desktop
- **Desktop:** zweispaltig je Zeile (Label + Hint | Control), Status-Badge in eigener schmaler Spalte — wie heute `rowShell` (`sm:flex-row`).
- **Mobile:** gestapelt (Label oben, Control darunter, Badge inline) — `flex-col` Fallback ist schon im Code vorhanden.

---

## 3.6 Drei Layout-Varianten (Mark entscheidet)

### Variante 1 — „Sektions-Akkordeon" (progressive disclosure)
Sechs zusammenklappbare Sektionen A–F, je mit Sektion-Status-Pille + Stift. Eine Sektion zur Zeit editierbar.

```
┌ AKTE: Max Mustermann ──────────────── Status: unvollständig ┐
│ ▸ A Stammdaten            ● 6/7    [✎]                       │
│ ▾ B Beschäftigung         ○ Lücke  [✎ aktiv]                 │
│     Vertragsbeginn  ◆ 01.03.2024  (aus Tally)               │
│     Beschäftigungsart ○ [Vollzeit ▼]   ← Pflicht-Engine     │
│     Austrittsdatum  ◇ —                                     │
│     [Speichern] [Abbrechen]                                  │
│ ▸ C Rolle & Norm-Klasse   ▲ prüfen [✎]                      │
│ ▸ D Geltungsbereich (SDL) ◇ leer   [✎]                      │
│ ▸ E Bestellungen          ● 1      [✎]                       │
│ ▸ F Qualifikationen/Frist ○ Lücke  [✎]                      │
└─────────────────────────────────────────────────────────────┘
```
**Pro:** wenig Scroll, klare Fokussierung, skaliert mit künftigen Feldern. **Contra:** Überblick „was fehlt insgesamt" erst nach Aufklappen (gemildert durch Status-Pillen in den Kopfzeilen).

### Variante 2 — „Vertikale Liste, sektionsweise editierbar" (nah am Ist)
Alle Sektionen offen untereinander (wie heute `rowShell`-Liste), aber gruppiert mit Zwischenüberschriften + je Sektion ein Stift. Kein Akkordeon.

```
┌ AKTE: Max Mustermann ──────────────── Status: unvollständig ┐
│ A · STAMMDATEN                                   [✎]         │
│   Vorname     ● Max                                          │
│   Geburtsdatum● 12.05.1990                                  │
│   Geschlecht  ◇ —      (weiblich → Mutterschutz-Hinweis)   │
│ B · BESCHÄFTIGUNG                                 [✎]         │
│   Vertragsbeginn ◆ 01.03.2024 (Tally)                       │
│   Beschäftigungsart ○ —   ← Pflicht-Engine                  │
│ C · ROLLE & NORM-KLASSE                           [✎]        │
│   Norm-Klasse ● EK + FK                                      │
│   Org-Titel   ◆ SMA (Tally)                                 │
│ … D SDL · E Bestellungen · F Qualifikationen/Fristen …      │
└─────────────────────────────────────────────────────────────┘
```
**Pro:** voller Überblick auf einen Blick, minimaler Umbau (näher an `EmployeeFilePersonRolleEditTable`). **Contra:** lange Seite, viel Scroll; auf Mobile zäh.

### Variante 3 — „Geführter Lebenszyklus-Stepper" (Anlege-zentriert)
Horizontaler Stepper A→F oben, eine Sektion füllt den Hauptbereich; „Weiter/Zurück". Beim **Anlegen** geführt, beim **Bearbeiten** direkt zur Sektion springbar.

```
┌ Neue SMA anlegen ──────────────────────────────────────────┐
│ [A Stamm]→[B Besch.]→[C Rolle]→[D SDL]→[E Best.]→[F Qual.]  │
│ ─────────────────────  C Rolle & Norm-Klasse  ───────────── │
│   Norm-Klasse  [ EK ✓ ] [ FK ✓ ] [ Verw. ] [ Prakt. ] …    │
│   Org-Titel    [ SMA ▼ ]                                    │
│   Set-Kategorie[ Sicherheitsmitarbeiter ▼ ]                 │
│   Dok-Vorlage  [ DIN 77200-1 allgemein ▼ ]  ← Pflicht       │
│                              [Zurück]  [Weiter →]           │
└─────────────────────────────────────────────────────────────┘
```
**Pro:** ideal fürs **manuelle Anlegen** (führt durch alle Engine-Inputs, nichts vergessen). **Contra:** für schnelles Nachtragen einer Lücke umständlich; passt schlechter zum „Akte ist eine durchscrollbare Sicht"-Bild des Zieldesigns.

### → Empfehlung: **Variante 1 (Sektions-Akkordeon)**
Begründung: (a) Sie behält das etablierte Stift-/„Ansehen↔Bearbeiten"-Muster, verfeinert es aber sinnvoll auf Sektions-Ebene. (b) Status-Pillen in den Sektion-Kopfzeilen geben den geforderten „was fehlt"-Überblick **ohne** die ganze Seite scrollen zu müssen — passt zum Lebenszyklus-Statusband (②). (c) Skaliert mit den vielen Feldern (28+) und künftigen Erweiterungen, ohne die Akte zu einer endlosen Liste zu machen. (d) Mobile-tauglich (eine Sektion offen). Für den **Anlege-Fall** (DM/DA1) wird das Akkordeon initial mit der ersten unvollständigen Sektion aufgeklappt geöffnet — so bekommt man 80 % des Stepper-Vorteils ohne dessen Nachteil beim Nachtragen.

---

## 4. Anlegen- vs. Bearbeiten- vs. Import-Fluss (3 Wege, eine Maske)

| Fluss | Einstieg | Verhalten der Maske |
|-------|----------|---------------------|
| **Anlegen (manuell)** | Index „Neue Person" → leere Akte | Akkordeon öffnet erste unvollständige Sektion (A). Alle Felder leer mit ◇/○-Badges. Pflicht-Lücken rot. Speichern legt Akte an (`onSave` → Repository). Empfehlung DA1: **leere Akte inline**, killt das 68-KB-`EmployeeForm`. |
| **Bearbeiten (bestehend)** | Index/Klick → Akte im Ansehen-Modus | Read-only + Herkunfts-Badges. Stift je Sektion → inline editieren → Speichern (`applyEmployeePatchWithDocSync`). Doc-Sync für `roleId`/`appointmentIds` bleibt. |
| **Import (Tally `vGNvY0`)** | Webhook → `tally-intake-service` legt Akte + `EvidenceItem`s (`unchecked`) an | Maske zeigt importierte Felder mit blauem ◆-Badge + Tooltip „aus Tally, ungeprüft". **Lücken** (was Tally nicht liefert: `roleClasses`, `sdlScopes`, `drivesServiceVehicle`, `gender`, Fristdaten, `qualifications`-Struktur) tragen ○/◇-Badges → klar als „manuell nachtragen" markiert. Engine läuft sofort auf dem Teil-Stand. |

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
- **Keine Herkunfts-Unterscheidung** (Tally vs. manuell vs. fehlend) — heute sieht alles gleich aus. → ◆/●/○/◇/▲-Badge-System (§3.2).
- **Keine Sektions-Gruppierung** — heute eine flache 22-Zeilen-Liste. → 6 Sektionen A–F (§2), Akkordeon (Variante 1).
- **`gender` (CL-77) fehlt in der Inline-Maske** (im Schema vorhanden, im Edit-Table nicht gerendert) → Sektion A aufnehmen, Mutterschutz-Hinweis-Overlay nur bei `weiblich`.
- **`qualifications[]` (strukturiert) fehlt** — heute nur Freitext `qualification`. → strukturiertes Multiselect (Sektion F), Freitext als Legacy-Fallback.
- **`setKategorie` nicht editierbar in der Maske** (nur im Generator) → optional in Sektion C anzeigen.
- **`weiterbildungIstUE` / `einmaligIstUE` / `erstunterweisungDatum` fehlen** in der Inline-Maske → Sektion F (Soll−Ist & Frist-Bezug).
- **Austrittsdatum** ist disabled-Platzhalter ohne Modell-Feld → echtes Feld (DM6).
- **Kein Anlege-Fluss** in dieser Maske (heute via `EmployeeForm`) → leere Akte inline (DA1).
- **Kein sektionsweiser Edit** — heute global `evidenceEditMode` alles-oder-nichts → Stift je Sektion (§3.4).

---

## 7. Offene Design-Entscheidungen für Mark

- **DM1 — Layout-Variante:** Empfehlung **Variante 1 (Sektions-Akkordeon)**. Alternativ V2 (flache Liste, minimaler Umbau) oder V3 (Stepper, anlege-stark). → Welche?
- **DM2 — Herkunfts-Badge:** ◆/●/○/◇/▲-System (§3.2) einführen? Empfehlung **ja** — das ist der größte UX-Gewinn (Tally-Lücken sichtbar). Alternative: nur 2-stufig (importiert/manuell). → ok?
- **DM3 — Sektionsweiser Edit vs. global:** Empfehlung **Stift je Sektion** + optional „Alles bearbeiten". Alternative: heutiges globales Toggle behalten. → ok?
- **DM4 — `gender` (CL-77) aufnehmen:** Empfehlung **ja**, Sektion A, nur `weiblich` triggert Mutterschutz-Hinweis-Overlay („fachlich prüfen", EC-10, kein Engine-Eingriff). → ok?
- **DM5 — strukturierte `qualifications[]` in der Maske:** Empfehlung **ja** (besserer Engine-Input als Freitext), Freitext bleibt Round-trip-/Legacy-Träger. → ok?
- **DM6 — Austrittsdatum als echtes Feld:** Heute disabled-Platzhalter, kein Modell-Feld (additive nullable Spalte nötig). Empfehlung **als echtes optionales Feld** (Lebenszyklus „inaktiv"). → jetzt oder später?
- **DM7 — Tally-Wert vs. manueller Wert bei Konflikt:** Wenn ein Mensch einen importierten Wert überschreibt — Badge auf ● (manuell) kippen und Tally-Original im Tooltip behalten? Empfehlung **ja** (Audit-Spur). → ok?
- **DM8 — `setKategorie` editierbar in der Maske (Sektion C) oder nur im Generator?** Empfehlung **read-only-Anzeige in C mit Sprung zum Generator** (vermeidet Doppel-Editier-Stellen). → ok?
- **DM9 — Anlege-Fluss:** Empfehlung **leere Akte inline (DA1)** → `EmployeeForm` abschmelzen. Alternative: separates Anlege-Formular behalten. → ok?

---

## 8. Umsetzungs-Slices (klein, EC-09-sicher, je gegated)

> Reihenfolge so, dass sichtbarer Nutzen früh kommt; jeder Slice: `tsc --noEmit` 0 · Test-Suite grün · `next build` grün · **EC-09-ZIP-Smoke** · Mark-Abnahme. **Kein** Slice ohne Mark-Freigabe.

| Slice | Inhalt | Risiko | EC-09 |
|-------|--------|--------|-------|
| **M0** | **Dieses Konzept abnehmen** + DM1–DM9 entscheiden (Mark-Gate) | — | — |
| **M1** | **Sektions-Gruppierung** der bestehenden `EmployeeFilePersonRolleEditTable` in A–F (reine Reorganisation der `rowShell`-Zeilen, keine neuen Felder, kein Datenmodell). | gering | unberührt, Smoke |
| **M2** | **Herkunfts-Badge-System** (◆/●/○/◇/▲) — braucht Quellen-Info aus dem Intake (Flag „aus Tally" je Feld) + Rendering. Reine Anzeige. | gering–mittel | unberührt |
| **M3** | **Sektionsweiser Edit** (Stift je Sektion statt globalem Toggle); `onSave`/Doc-Sync-Pfad unverändert. | mittel | Smoke (Doc-Sync) |
| **M4** | **Fehlende Felder aufnehmen:** `gender` (DM4, Overlay-Trigger), strukturierte `qualifications[]` (DM5), `weiterbildungIstUE`/`einmaligIstUE`/`erstunterweisungDatum`, `setKategorie`-Anzeige (DM8). Additive Felder, alle schon im Modell außer Austritt. | mittel | unberührt |
| **M5** | (falls DM6 ja) **Austrittsdatum** als echte nullable Spalte + Feld. Schema-Migration nach Lane-J-Muster. | mittel | unberührt |
| **M6** | (falls DM9 ja) **Anlege-Fluss = leere Akte inline**; `EmployeeForm` (68 KB) final abschmelzen. | mittel | Smoke (Generator-Pfad bleibt) |

---

> **→ Mark:** Konzept so ok? DM1–DM9 entscheiden → dann baue ich (Spur E) M1 als ersten gegateten Slice (reine Sektions-Reorganisation, kein EC-09-Risiko, Engine + Modell unberührt).
