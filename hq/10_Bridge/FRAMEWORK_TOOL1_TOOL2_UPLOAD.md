# FRAMEWORK — Tool 1 + Tool 2 + Upload-Manager zusammenführen

> **Zweck:** EIN tragendes Architektur-Modell für das interne Tool, bevor gebaut wird. C-10-Planung (Spur P), kein Code.
> **Lektion (verbindlich):** Erst gemeinsam planen → Framework auf Papier festzurren → DANN in **getrennten** Phasen bauen (je eigenes Gate). Bug-Fix und Umbau NICHT mischen.
> **Stand:** 2026-06-11 · Ist-Architektur durch Code-Kartierung belegt (4 parallele Explore-Läufe).

---

## 0. Marks Anliegen (so verstanden)
- Tool 1, Tool 2 und Upload-Manager sollen **ineinandergreifen**, nicht nebeneinander stehen.
- **Mitarbeiter (SMA) ist eine separate Schicht** — daraus folgt eine **vorgespeicherte Sammlung** an Dokumenten, die ein SMA braucht (Pflicht) + **optionale Zusätze**, die voreingestellt in Tool 2 landen.
- **Logo + Firmeninfos** kommen über das **erste Tally-Formular „Unternehmensunterlagen"** rein und sollen zentral überall greifen.

---

## 1. IST — die gute Nachricht: vieles existiert schon

| Baustein | Realität im Code | Belegt |
|----------|------------------|--------|
| **Zentrales Firmen-Profil** | `CompanyExportSettings` (DB): `companyName`, `companyEmail`, `companyAddress`, **`logoStorageKey` (S3)**, `documentVersion/Date`, `createdBy/approvedBy`. **Tool 2 nutzt es zentral** (lädt Profil + Logo aus S3). | `prisma/schema.prisma:20-32`, `employee-file-repository.ts:683-783` |
| **Tool 1 (Document Creator)** | Liegt **schon in derselben App** (`/model-creator`), NICHT separat. Aber: **ignoriert das Firmen-Profil** → tippt Name/Adresse/Logo **jedes Mal neu** ein. | `app/model-creator/`, `send-model-entries.ts:46-130` |
| **Upload-Manager (Backbone)** | 3 Kategorien: **`roles`**, **`appointments`**, **`standard-models`**. S3-Key = `{kategorie}/{ordner}/{datei}/{ts}`. Voll-CRUD über UI. | `lib/template-storage.ts:14-52`, `UploadsPage.tsx` |
| **„Vorgespeicherte Sammlung" (= Marks Idee!)** | Existiert als **`SetKategorie`** (sicherheitsmitarbeiter/fuehrungskraft/buerokraft) → `coreDocsForSetKategorie()` = Pflicht-Basispaket + **Overlays** (Bestellungen, Dienstfahrzeug, Objekt-DA, Mutterschutz). Alle **vorausgewählt + abwählbar**, optionale Zusätze über Appointments. | `vorlagen-set-catalog.ts:47-481`, `EmployeeForm.tsx:255-384` |
| **Tally Form 1 — Mitarbeiter** | `vGNvY0` **aktiv** → erzeugt Mitarbeiterakte + Nachweise (Tool 2). | `tally-intake-service.ts`, `tally-employee-slots.json` |
| **Tally — Firma „Unternehmensunterlagen"** | `Y5Zq80` ist **dokumentiert, aber NICHT verdrahtet** — Webhook markiert es als `unsupported-form`. **Kein Logo-Feld** darin definiert. | `TALLY_FIELD_MAPPING.md:90-119`, `tally-intake-service.ts:319-337` |

**Fazit Ist:** Das Fundament (zentrales Firmen-Profil + Template-Backbone + Set-Sammlungen) **steht bereits**. Es „läuft nicht rund", weil **drei Verdrahtungen fehlen** — nicht weil etwas neu gebaut werden müsste.

---

## 2. DAS FRAMEWORK — Unternehmen im Zentrum, 3 Schichten, 2 Generatoren

```
              ┌─────────────────────────────────────────────┐
              │  SCHICHT 1 — UNTERNEHMEN (zentral, 1×)       │
              │  CompanyExportSettings: Name, Adresse,       │
              │  E-Mail, LOGO (S3), Doc-Meta + Firmen-Doks   │
              │  Quelle: Tally „Unternehmensunterlagen" /UI  │
              └───────────────┬─────────────────────────────┘
                              │ speist BEIDE Generatoren
         ┌────────────────────┴────────────────────┐
         ▼                                          ▼
┌──────────────────────┐                ┌──────────────────────────┐
│ GENERATOR A — Tool 1 │                │ GENERATOR B — Tool 2     │
│ Firmen-/Standard-Doks│                │ Mitarbeiter-Doks (SMA)   │
│ aus `standard-models`│                │ aus Set-Sammlung         │
└──────────┬───────────┘                └───────────┬──────────────┘
           │                                         │
           ▼                                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  SCHICHT 2 — VORLAGEN/SAMMLUNGEN (Upload-Manager-Backbone)       │
│  standard-models │ roles │ appointments │ (schulungen)           │
│  + Set-Kategorien = vorgespeicherte SMA-Sammlung + Overlays      │
└─────────────────────────────────────────────────────────────────┘
                              ▲
              ┌───────────────┴─────────────────────────────┐
              │  SCHICHT 3 — MITARBEITER (SMA, separat)      │
              │  Akte erbt Firma (S1) + bekommt Set-Sammlung │
              │  (S2) voreingestellt + optionale Zusätze     │
              │  Quelle: Tally „Mitarbeiterunterlagen"       │
              └─────────────────────────────────────────────┘
```

**Kernidee:** Tool 1 und Tool 2 sind **zwei Generatoren über demselben Fundament** (zentrales Unternehmen + gemeinsamer Vorlagen-Backbone). Der **Mitarbeiter** ist die eigene Schicht 3, die **auf** dem Fundament aufsetzt: erbt Firma, bekommt die Sammlung voreingestellt.

---

## 3. DIE LÜCKEN (was „nicht rund" ist) — und wie groß sie wirklich sind

| # | Lücke | Heute | Soll | Größe |
|---|-------|-------|------|-------|
| **L1** | **Tool 1 nicht ans Firmen-Profil verdrahtet** | Tippt Firma/Logo jedes Mal neu ein | Firma auswählen → Name/Adresse/Logo **auto aus `CompanyExportSettings`** (dasselbe Profil wie Tool 2); manuell nur Override | **Klein** — Profil existiert, nur Tool 1 anzapfen |
| **L2** | **Tally „Unternehmensunterlagen" (`Y5Zq80`) nicht verdrahtet** | Webhook verwirft es; kein Logo-Feld in Tally | Form füllt Schicht 1: Firmeninfos + **Logo** + Firmen-Doks → `CompanyExportSettings` + S3 | **Mittel** — Webhook-Handler + Mark legt Logo-Feld in Tally an + questionIds |
| **L3** | **Set-Sammlungen sind 3 hartcodierte Kategorien** | `sicherheitsmitarbeiter/fuehrungskraft/buerokraft` im Code | (falls gewünscht) **admin-editierbare Sammlungen** im Upload-Manager statt Code | **Größer** — nur wenn Mark Editierbarkeit will |
| **L4** | **Mitarbeiter-Schicht-Trennung** | SetKategorie ⟂ Norm-Klasse ⟂ Org-Titel bereits getrennt | ggf. UI-Klarheit „Firma → Sammlung → Mitarbeiter" als Flow | **Klein** — v. a. UX |

---

## 4. PHASEN-VORSCHLAG (getrennt, je eigenes Gate — Lektion!)

> Reihenfolge nach „Fundament zuerst, dann Generatoren, dann Komfort". Jede Phase = eigener Plan + eigener Bau-Pass + eigene Abnahme. **Nicht mischen.**

- **P0 — Framework festzurren (dieses Dokument).** Mark entscheidet D1–D4 → Modell steht.
- **P1 — Tool 1 ans zentrale Firmen-Profil (L1).** Tool 1: Firma wählen → Auto-Fill aus `CompanyExportSettings` (Logo aus S3), manueller Override bleibt. **Macht Tool 1 + Tool 2 über die Firma deckungsgleich.** Klein, hoher Effekt. *(= das alte „#8", jetzt als Wiring statt Neubau)*
- **P2 — Company-Tally-Intake (L2).** Mark legt in `Y5Zq80` ein **Logo-Feld** + Firmenfelder an, liefert questionIds → Webhook-Handler füllt Schicht 1 automatisch. Danach: Logo/Firmeninfo kommen **ohne Hand** rein.
- **P3 — (optional) Editierbare Sammlungen (L3).** Nur wenn Mark mehr als die 3 Kategorien will: Sets im Upload-Manager pflegbar machen.
- **P4 — (optional) Flow-/UX-Politur (L4).** „Firma → Sammlung → Mitarbeiter" als geführter Einstieg.

---

## 5. ENTSCHEIDUNGEN FÜR MARK (P0 — gate)

- **D1 — Modell bestätigen:** Unternehmen im Zentrum, 3 Schichten, 2 Generatoren über gemeinsamem Backbone — passt das als tragendes Framework? (ja / anpassen)
- **D2 — Tool 1 ↔ Firmen-Profil (P1):** Tool 1 soll Firma auswählen + Firma/Adresse/**Logo automatisch** aus dem zentralen Profil ziehen (manueller Override bleibt)? (ja / nein)
- **D3 — Company-Tally (P2):** „Unternehmensunterlagen" (`Y5Zq80`) als **die** Quelle für Schicht 1 verdrahten — inkl. **neuem Logo-Feld in Tally** (legst du an)? (ja / später)
- **D4 — Sammlungen (L3):** Reichen die **3 vordefinierten** Set-Kategorien (Code), oder willst du **admin-editierbare** Sammlungen im Upload-Manager? (reicht / editierbar)
- **D5 — Startphase:** Womit zuerst — **P1** (Tool-1-Wiring, kleinster/schnellster Effekt) oder **P2** (Company-Tally, mehr Automatik, mehr Vorarbeit deinerseits in Tally)?

---

## 6. P0 — ENTSCHEIDUNGEN LOCKED (Mark, 2026-06-11)
- **D1 ✅ go** — Framework bestätigt: Unternehmen im Zentrum, 3 Schichten, 2 Generatoren über gemeinsamem Backbone.
- **D2 ✅ go** — Tool 1 zieht Firma/Adresse/**Logo** automatisch aus dem zentralen `CompanyExportSettings`; manueller Override bleibt.
- **D3 ✅ go** — Company-Tally `Y5Zq80` als Quelle für Schicht 1 verdrahten. **Tally hat das Logo-Feld bereits** → „kein Logo-Feld"-Blocker aus L2 entfällt; offen bleibt nur questionId-Mapping + Webhook-Handler.
- **D4 ✅ beides** — die **3 vordefinierten** Set-Kategorien BLEIBEN (Code-Defaults) **+ zusätzlich admin-editierbare** Sammlungen (L3 ist gewollt). Vordefinierte = Startpunkt/Fallback, editierbare = Erweiterung darüber. **Kein Ersetzen, additive Architektur.**
- **D5 ✅ Start = P1** (Tool 1 ans zentrale Firmen-Profil). Danach P2 (Company-Tally inkl. Logo), dann P3 (editierbare Sammlungen).

**→ Aktiver Plan: `FRAMEWORK_P1_TOOL1_FIRMENPROFIL.md` (P1-Einseiter).**
