# Schulungskatalog + Begriffsmodell + Termin-Planung — Planer-Referenz (Mark-Input 2026-06-08)

> **Status:** Planer-Referenz/-Notiz (noch KEIN Bauauftrag). Hält Marks Domänen-Input fest, damit nichts verloren geht. Vor Engine-Änderungen: **UE-Werte gegen `NORM_MATRIX_…v2` + `NORM_KLAUSEL_REGISTER_v1` gegenprüfen — keine Werte erfinden.**
> **Quelle (OneDrive):** `…/02_QM_und_Wissen/Template/Personalakte Muster_Empleyee File Example/Trainings_Certificates/V1/` — diese `.docx/.pdf` sind zugleich **Generator-Vorlagen** (Tie-in zu „Alt→Neu-Doc-Migration").

## 1. Begriffsmodell (Mark bestätigt 2026-06-08) — drei getrennte Kategorien
- **Beauftragung/Bestellung** = formale *Ernennung* einer Person (z. B. Ersthelfer, Brandschutzhelfer, SiBe, Datenschutz/Vertraulichkeit, Dienstausweis-Ausgabe). Löst Pflichten/Nachweise aus.
- **Schulung** = *Kurs/Ausbildung* mit **Datum + ggf. Gültigkeit**; Cert-Expert bietet sie an (Katalog §3). UE-getrieben.
- **Unterweisung** = wiederkehrende *Belehrung* (Pflichtunterweisung, Arbeitsschutz/DGUV, ODA, objekt-/SDL-bezogen, Wiederholung). Meist jährlich, intern.

## 2. 🔴 Brandschutz-Regel (Mark, präzise) — Muster für dated Nachweise
- **Pflichtfeld nur im Obligations-Kontext:** Brandschutz(helfer)-Gültigkeit ist **Pflichtfeld in der Akte nur, wenn es DIN-Pflicht ist** (scope-gated, z. B. DIN 77200-2 / Teil 2) → entspricht **CL-23** (Brandschutz nur bei DIN 77200-2). Sonst **kein** Pflichtfeld.
- **Gültigkeit trotzdem immer erfassen, wenn hochgeladen:** Sobald ein Brandschutz-Nachweis hochgeladen wird, **muss eine Gültigkeit gesetzt/angezeigt werden** — auch wenn keine DIN-Pflicht besteht (Ablauf darf nie verloren gehen).
- **Prinzip (Erste Hilfe CL-08 analog — mit Mark zu bestätigen):** „Pflichtfeld = nur bei Obligation (scope-gated); Gültigkeit aber immer tracken, sobald Nachweis vorhanden." Engine = Obligation; UX/Datenmodell = Validity-Tracking unabhängig.

## 3. Schulungs-/Unterweisungs-Katalog V1 (vollständig, aus OneDrive)
**DIN 77200-1 Allgemeine — Jahresweiterbildung:**
- 01 Jahresweiterbildung DIN 77200-1 — **24 UE**
- 02 Jahresweiterbildung DIN 77200-1 — **40 UE**
- (+ Bestellungs-/Nachweis-Docs im selben Ordner: „Ausgabe Dienstausweis", „Datenschutz und Vertraulichkeit")

**DIN 77200-1 — modulare Schulungen (je 4 UE, außer FK 8 UE):**
1. Dokumentation/Wachbuch/Meldewesen — 4 UE
2. Datenschutz/Verschwiegenheit/Informationsschutz — 4 UE
3. Kommunikation/Konflikt/Deeskalation — 4 UE
4. Schließmittel/Ausrüstung/Kontrollsysteme — 4 UE
5. Arbeitsschutz/Notfallverhalten/Eigensicherung — 4 UE
6. Stationärer Objektschutz/Empfang/Kontrolldienst — 4 UE
7. Revierdienst/Mobiler Kontrolldienst — 4 UE
8. Veranstaltungsschutz Allgemein — 4 UE
9. **Führungskraft Sicherheitsdienst DIN 77200-1 — 8 UE** (FK-Aufschlag)

**DIN 77200-2 (scope-spezifisch):**
- 01 Flüchtlings-/Asyleinrichtungen — **EK 40 UE**
- 02 Flüchtlings-/Asyleinrichtungen — **FK 24 UE**
- 03 Veranstaltungen — **EK 16 UE**
- 04 Veranstaltungen — **FK 16 UE**
- 05 ÖPV — **EK 40 UE**
- 06 ÖPV — **FK 16 UE**
- 07 Objekte besonderer Sicherheitsrelevanz — **modular**

**Unterweisungen (eigener Ordner „Unterweisungen:Instructions"):**
- Allgemeine Pflichtunterweisung · Arbeitsschutz DGUV · ODA Einzel-/Sammelunterweisung · Einweisungsnachweis (Einzel/Sammelliste) · „Veranstaltung mit besonderer Sicherheitsrelevanz" · interaktive (editierbare) PDF-Varianten.

## 4. ⚠️ Norm-Cross-Check (Planer, VOR Engine-Änderung — keine Erfindung)
Die Katalog-UE sind **scope-differenzierter** als das aktuelle Engine-Modell (heute grob EK 16/40, FK 24/64). Beispiele zum Abgleichen mit Matrix/Register:
- DIN-2 **FK** variiert je Scope: Asyl FK **24**, Veranstaltung FK **16**, ÖPV FK **16** — nicht pauschal 24/64.
- DIN-2 **EK**: Asyl 40, Veranstaltung 16, ÖPV 40.
- DIN-1 Jahresweiterbildung 24 vs. 40 (Teilzeit/Vollzeit? → CL-11).
- Modular 9×4 UE + FK 8 UE → wie summieren sie zu den Jahres-UE?
→ **Aufgabe:** jede Zahl einer **CL-ID** zuordnen; Abweichung Katalog↔Matrix = „fachlich prüfen", **nicht** Engine-Werte raten. Ergebnis dem Planer/Mark vorlegen, bevor die Engine angefasst wird.

## 5. Offene Bau-Stränge (aus Mark-Input, zu planen)
- **(Pt 1) Fertige read-only Akte-Übersicht** (ohne überall-Stifte) — Abschluss-/Vorzeige-Ansicht; eng verwandt mit **Audit-Export** (gleiche Info on-screen + als Datei). *Default-Vorschlag: read-only Ansicht je Person + Audit-Export-Datei; Mark bestätigt Platzierung.*
- **(Pt 3) Termin-Planung Schulungen/Unterweisungen** — pro Person/Posten ein **geplantes Datum**; **Sammel-Datum für alle + einzelne überschreibbar**; verortet im **Generator-/Planungsbereich**. Operative Schicht (kein Norm-Erfinden); speist die Ampel (geplant=gelb, überfällig=rot). *Default-Vorschlag: Bulk + Override; Mark bestätigt Umfang.*
- **(Pt 2) Modell-Sauberkeit** Bestellung/Schulung/Unterweisung klar in Akte trennen (mit CL-Belegen), inkl. Brandschutz-Regel §2.

## 6. Verhältnis zur „Tour"
Diese drei Stränge gehören in die Rest-Tour (interne MVP-Vollendung) **nach** dem Norm-Cross-Check §4. Reihenfolge-Vorschlag: erst §4 (Cross-Check, read-only), dann Pt 2 (Modell), dann Pt 3 (Termin-Planung) + Pt 1 (Übersicht/Export). DEKRA/Legal/Phase 2 bleiben draußen.

## 7. Uploads-Architektur (Ist, verifiziert im Code) — Antwort auf Marks Frage
- **Strukturdaten** (Akte, Evidence-Metadaten, Status) → SQLite (`prisma/prisma/dev.db`). Tabelle `EvidenceItem` (storageKey, fileName, mimeType, **status `unchecked`**, uploadedAt) je `employeeFileId` × `evidenceId` (Nachweis-Slot).
- **Dateien** → **Hetzner S3 (Cloud Object Storage)**, NICHT OneDrive. Schlüssel (`buildEvidenceKey`): **`cea/companies/{Firma}/evidence/{Person}/{Nachweis-Slot}/datei`** → es gibt also **bereits eine Pro-Person-Struktur**, sauber je Firma/Person/Slot.
- **Tally-Uploads** importieren automatisch in dieselbe Struktur (`importEvidenceFiles`).
- **`/uploads` (Upload Manager)** ist NUR für **Vorlagen/Firmendaten/Standard-Models** (`.docx`), nicht für Personen-Nachweise — anderer Pfad.
- **🔎 Lücke (Trainings):** Heute gibt es nur **Sammel-Slots** „Schulungsnachweise" + „Unterweisungsnachweise" (je ein Eimer), **kein** eigener Slot/Ordner **pro einzelner Schulung aus dem Katalog (§3) mit eigenem Datum/Gültigkeit**. Genau das + die Termin-Planung (§5 Pt 3) ist der Bau-Bedarf.

## 8. „Grüne Trainings-Übersicht ist weg" (Mark) — Regression prüfen
- Mark vermisst die Ansicht, die **grün/nicht-grün je nach genug Schulung (UE Soll vs. Ist)** zeigt — vermutlich `EmployeeFileTrainingTargets.tsx` (UE-Anzeige Variante C, Soll/Ist-Balken). **Prüfen, ob G4/Slice 4 sie verdeckt/entfernt hat → wiederherstellen** (read-only Sicht), **ohne UE-Werte zu ändern** (UE-Werte erst nach Cross-Check §4). Gehört zur „fertigen Übersicht" (§5 Pt 1).

---
**Guardrails:** keine erfundene Normpflicht (jede UE/Pflicht CL-belegt), EC-09/EC-10, kein Commit von `.env`/`.db`/Kundendaten. Verifikation im echten Browser.
