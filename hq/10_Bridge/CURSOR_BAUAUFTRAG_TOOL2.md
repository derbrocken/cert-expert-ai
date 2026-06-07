# Bauauftrag Tool 2 — Interne Cert-Expert-Zentrale (Code-Track → Cursor)

**Stand:** 2026-06-07 · **Autor:** Claude (Code-Track) · **Für:** Cursor · **Freigabe:** Mark
**Lesen vorab:** `DFSS_GOLD_GAP_4SLICE.md` (Lücken + QFD-Priorisierung), `TOOL2_FAHRPLAN_DFSS.md`, `knowledge/NORM_MATRIX_Mitarbeiternachweise_v2.md`, `knowledge/NORM_KLAUSEL_REGISTER_v1.md`. Gold-Design: `cert-expert-certification-os/docs/03-controls/` (B5/B6/B7).
**Repo:** `cert-expert-certification-os/apps/certification-os/` · Branch `main` (konsolidiert, T-04) · Port **3001**.

> **Prinzip (für jeden Slice):** Erst beschreiben *„Was kann Mark am Ende tun"*, dann bauen. Kein Technik-Selbstzweck. Klein liefern, EC-09 nie brechen.

---

## Gesperrte Entscheidungen (Mark, 2026-06-07)

1. **Schritt 1 = Tally-Anbindung** (Gratis-Webhook, EU-gehostet). Schnell live. **Make.com aus dem Pfad nehmen.** Eigene Formulare = **Phase 2** (ersetzen Tally später, mehr Branding).
2. **Automatischer Eingang** = Tally-Submission → legt/aktualisiert die Akte + Dateien werden auf Hetzner gesichert.
3. **Audit-Export ist Pflicht-Feature** (ersetzt die „SMA-Daten-Gesamt-Excel").
4. **Norm-Werte aus v2-Matrix + CL-Register** — Engine-Mechanik Slice 2; jede Regel mit `clauseId: CL-xx`. Keine erfundenen Normpflichten (offene CL-IDs = „fachlich prüfen").
5. **Kundenportal (Login/Gates/Fortschritt/Auto-Mails) = Phase 2.** Intern zuerst.
6. **DSGVO-Pflicht** bei allem mit Personendaten: Zugriffsschutz, Einwilligung im Formular, Aufbewahrungs-/Löschregel.

---

## Reihenfolge (QFD-priorisiert) + Definition of Done

### Slice 0 — Fundament: persistente Akte (Datenmodell)
**Was Mark am Ende tun kann:** Einen Kunden öffnen und seine gespeicherten Mitarbeiter sehen — Stammdaten bleiben dauerhaft, nichts doppelt tippen, auch nach Reload/Neustart.
**Cursor baut (DoD):**
- Persistentes Datenmodell **Firma → Mitarbeiter-Akte** (ersetzt `localStorage`-Queue als führenden Speicher). Eine Akte = eine Firma-Relation (per-file, nicht Session-global).
- Migration der bestehenden Queue-Daten ohne Verlust.
- Kunden-Slugs aus `hq/03_Kundenprojekte/_registry.json`.
**Tests:** Anlegen/Bearbeiten/Reload bleibt erhalten; 2 Firmen sauber getrennt.

### Slice 1 — Tally-Anbindung (Intake, schnell live)
**Was Mark am Ende tun kann:** Der Kunde füllt wie gewohnt die Tally-Formulare; jede Einreichung + hochgeladene Dateien landen **automatisch** als Akte im richtigen Kunden-Pool — ohne Make.
**Cursor baut (DoD):**
- **Tally-Webhook-Endpoint** (gratis, EU) empfängt `FORM_RESPONSE` (JSON, POST); **Signaturprüfung** über `Tally-Signature` (SHA256). 10-Sekunden-Timeout beachten → schnell 2XX zurück, Verarbeitung asynchron.
- **Feld-Mapping** Tally → Akte-Datenmodell (Slice 0); Zuordnung Formular/Einreichung → richtiger Kunde.
- **Datei-Felder** (`FILE_UPLOAD`-URLs) **sofort auf Hetzner herunterladen** (Tally-Links können ablaufen) und an die Akte hängen — Daten gehören dauerhaft dir.
- **Make.com aus dem Pfad nehmen.**
**Tests:** Test-Submission (inkl. Datei) erscheint korrekt in der Akte; Signatur-Check greift; Datei liegt auf Hetzner; Retry-Verhalten ok.
**DSGVO:** Webhook signiert, Personendaten zugriffsgeschützt.
*(4 Tally-Formulare existieren: Unternehmensunterlagen · Mitarbeiter-Unterlagen · Projekt · Lieferanten — = O2C-Checklisten 1–4.)*

### Slice 2 — Requirement-Logik („was ist Pflicht")
**Was Mark am Ende tun kann:** Pro Mitarbeiter sehen, **welche Nachweise Pflicht sind** — automatisch je nach Grundrolle, Geltungsbereich (DIN 77200-1/-2/SDL) und Bestellungen, statt alles manuell zu prüfen.
**Cursor baut (DoD):**
- Engine: Bedingung (Grundrolle × Geltungsbereich × Bestellung) → Pflichtset. Inhalte = O2C-Checkliste 2 / `NORM_MATRIX_Mitarbeiternachweise_v2.md` (z. B. „Brandschutz nur bei DIN 77200-2", CL-23).
- **Mechanik deterministisch; UE-Detailwerte als Platzhalter** (Phase 2). Unklares = „fachlich prüfen".
**Guardrail:** Keine erfundenen Pflichten — nur aus Norm-Matrix ableitbar (CROSS-CONTROL-05, Experten-Review).

### Slice 3 — Status-/Ampel-Ansicht (QFD #1, höchster Kundenwert)
**Was Mark am Ende tun kann:** Auf einen Blick sehen, **wer fertig ist und wo was fehlt** — pro Mitarbeiter und pro Kunde, mit „nächster Schritt".
**Cursor baut (DoD):**
- Ampel-Evaluator: **Rot › Gelb › Grün**, scoped („grün für Rolle X / SDL Y"), Rot-Blocker-Katalog (B5.4). Grau = nicht relevant (mit Begründung).
- Pool-/Listenansicht je Kunde mit Ampel + „was fehlt".
**Guardrail:** **EC-10** — keine automatische Freigabe-/Auditfähigkeits-/Zertifizierungsaussage. Grün ≠ „einsatzbereit".

### Slice 4 — Audit-Export (ersetzt die SMA-Excel)
**Was Mark am Ende tun kann:** SMAs auswählen → eine **Audit-Übersichtsdatei** erzeugen (je Mitarbeiter: Schulung, Datum, Datei, Anbieter + alle Felder, die der Auditor mitschreibt) → landet im Kundenordner fürs Audit. Plus: Generator-Dokumente landen direkt in der Akte (kein Download-Suchen).
**Cursor baut (DoD):**
- Auswahl-UI (SMAs) → Export-Datei (Format mit Mark abstimmen: XLSX/PDF) in `OneDrive Clients/{Kunde}/08_Generated/` bzw. Ziel-Ordner.
- Generator-Output (EC-09-ZIP) als `generated unchecked` **in die Akte** verknüpft (nicht nur Datei).
**Guardrail:** EC-09 unangetastet; „erzeugt = Entwurf, kein akzeptierter Nachweis".

### Slice 5 — Shell (parallel, Hülle)
**Was Mark am Ende tun kann:** Alles unter einem Dach: `/intern` Zentrale, oben Kunden-Switcher, Akte mit den Sektionen (Übersicht, Stammdaten, Beschäftigung, Rollen, Nachweise, Unterweisungen, SDL/Projekt, Generator/Export, Offene Punkte).
**Cursor baut (DoD):** Navigation + Kunden-Switcher; bestehende Tool-1/2-Routen eingebettet.

---

## Querschnitt — in JEDEM Slice
- **EC-09-Smoke** (Person → Akte → Doc-Chips → ZIP) vor/nach Änderung grün.
- **Negativtests N-01–N-07** + Forbidden-Wording-Check (keine „freigegeben/zertifiziert/auditfähig"-Behauptung).
- **Build-Hygiene:** ESLint sauber (aktuell 20 Errors) **oder** `eslint.ignoreDuringBuilds` bewusst gesetzt — vor dem Slice-Start klären.

---

## Phase 2 (NICHT jetzt)
**Eigene Formulare** (ersetzen Tally, Make endgültig raus, volles Branding; `react-hook-form`+`zod`+`react-dropzone`→Hetzner, öffentlicher Zugang + Härtung + Einwilligung) · **Kundenportal** mit Login/Magic-Link, Zwischenspeichern, 5-Gate-Fortschrittsbalken, automatische Erinnerungs-Mails · DIN-77200-2-Detailmatrix (UE-Werte verdrahten) · ZKM-Maßnahmenlogik · Audit-Readiness-Netzwerk · LMS.

> Den **internen** Fortschritt (Team sieht, wer geliefert hat) liefert schon Slice 3. Die Erinnerungs-Mails später nutzen dieselbe „was-fehlt"-Engine aus Slice 2/3 — einmal gebaut, zweimal genutzt.

---

## Aufwand (Schätzung, Cursor baut · Claude reviewt)
- Slice 0 Fundament: ~3–5 AT · Slice 1 Tally-Anbindung: ~2–4 AT · Slice 2 Requirement: ~2–4 AT · Slice 3 Ampel/Status: ~3–5 AT · Slice 4 Export: ~2–4 AT · Slice 5 Shell: ~2–3 AT.
- **„Eingang live" (Slice 0 + Tally) ≈ ~1–1,5 Wochen.** Gesamt internes Tool (0–5) grob 3–4 Wochen, abhängig von Review-Runden.
- Phase 2 (eigene Formulare statt Tally): ~1 Woche zusätzlich, wenn ihr Make ganz ablösen wollt.
