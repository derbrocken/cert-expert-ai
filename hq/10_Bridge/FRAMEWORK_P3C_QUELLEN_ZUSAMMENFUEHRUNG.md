# P3c — Quellen zusammenführen (Design-Gate, ehrliche ROI-Abwägung)

> **Teil von:** `FRAMEWORK_P3_EDITIERBARE_SAMMLUNGEN.md`. P3a (Daten+Admin) + P3b (Formular-Konsum) sind **live**. P3c sollte „die zwei Ebenen zu einer Quelle" machen.
> **Status:** DESIGN-GATE (Spur P). **Wichtig:** P3c zerfällt in einen **kleinen, sicheren** und einen **großen, EC-09-kritischen** Teil — Mark entscheidet, ob/welcher.
> **Stand:** 2026-06-12. Grundlage: Code-Lesung Generator + Katalog-Konsumenten.

## 1. IST — es sind real DREI Sichten auf „das Bündel" (die driften können)
1. **Katalog-Definition** (`vorlagen-set-catalog.ts` `coreDocsForSetKategorie`) — wurde **einmalig** als Seed der 3 Sammlungen verwendet (P3a, create-once). Ändert sich der Code-Katalog, ändern sich die DB-Seeds NICHT (Drift).
2. **Manifest** im ZIP — der Generator erzeugt einen **Text-„Dokumenten-Plan"** aus `buildSetDocumentPlan` (Katalog: Core + bedingte Overlays). Unabhängig davon, was tatsächlich ausgewählt/generiert wurde.
3. **Tatsächliche Doks** — aus der Sammlungs-/Formular-**Auswahl** (P3b) → `selectedRoleDocIds` (genau **eine** Rolle) + Appointments.

→ Manifest (Sicht 2) kann der echten Auswahl (Sicht 3) widersprechen; Seeds (Sicht 1) können vom Katalog driften.

## 2. P3c = zwei sehr ungleiche Teile

### Teil A — Manifest/Autorität aufräumen (KLEIN, EC-09-sicher)
- **Manifest aus der echten Auswahl/Sammlung** erzeugen statt aus `buildSetDocumentPlan` → Sicht 2 == Sicht 3, kein Widerspruch mehr.
- Katalog bleibt Seed-Quelle; bedingte Overlays (Bestellung/Fahr/Mutterschutz) bleiben **attribut-getrieben** (hängen an der Person, nicht am Bündel).
- **Berührt NICHT** den Generator-Kern (Doc-Verarbeitung), NICHT das Auswahl-Modell. Reiner Manifest-/Anzeige-Schnitt.
- **Nutzen:** Konsistenz (interne Sauberkeit). **Risiko:** gering.

### Teil B — Voll ordnerübergreifend (GROSS, EC-09-kritisch)
- Auswahl-Modell von „**eine** Rolle + Appointments" → **flache Liste selektierter Template-Logical-Paths** (beliebige Ordner). Damit generieren Sammlungen über mehrere Rollen/Standard-Models hinweg.
- **Reichweite:** `selectedRoleDocIds`/`selectedAppointmentDocIds` werden in **~14 Dateien** konsumiert (Akte, Dossier-Views, Tabelle, Summary, Tally-Intake, Repo, Generator) → Modell-Umbau **+ Daten-Migration** aller Bestandsakten **+ Generator-Kern-Umbau**.
- **Nutzen:** nur wenn Sammlungen real **mehrere Rollen-Ordner** bündeln sollen. **Risiko:** hoch (EC-09, Migration, breite Fläche).

## 3. EHRLICHE EINSCHÄTZUNG (Planer)
- **Teil A** ist sauber, aber **niedriger sichtbarer Nutzen** (ein Text-Manifest wird konsistent).
- **Teil B** ist der eigentliche „Vollausbau", aber **teuer + riskant** und nur nötig, wenn du **rollenübergreifende Sammlungen** wirklich brauchst. Heute deckt das Ein-Rollen-Modell (Rolle + Overlays) die realen Sammlungen ab.
- **P2 (Company-Tally)** liefert vermutlich **mehr greifbaren Nutzen** als P3c-Teil-A (Logo/Firmeninfo automatisch rein) — bei geringerem Risiko als Teil B.

## 4. ENTSCHEIDUNG FÜR MARK
- **DPc.1 — Machen wir P3c überhaupt jetzt?** Optionen:
  - **(i) Nur Teil A** *(klein, sicher)* — Manifest aus echter Auswahl, Drift beenden.
  - **(ii) Teil A jetzt + Teil B als eigenes Epic gegated** (nur wenn rollenübergreifende Sammlungen gebraucht).
  - **(iii) P3c zurückstellen, stattdessen P2 (Company-Tally)** *(Planer-Empfehlung — bester Nutzen/Risiko jetzt)*.
- **DPc.2 — Brauchst du rollenübergreifende Sammlungen** (eine Sammlung zieht Doks aus mehreren Rollen-Ordnern)? Wenn **nein** → Teil B entfällt dauerhaft; das Ein-Rollen-Modell reicht.

> **→ Mark:** (i)/(ii)/(iii)? Und brauchst du rollenübergreifende Sammlungen (ja/nein)? Danach plane/baue ich gezielt — kein Code vor dieser Entscheidung (Teil B ist EC-09-kritisch).
