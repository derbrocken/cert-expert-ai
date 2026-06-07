# Bauauftrag — Requirement-Engine · Readiness-Ampel · DEKRA-Assembler (Slice 2–4)

**Stand:** 2026-06-07 · **Autor:** Claude (Generalist) · **Für:** Code-Track + Cursor · **Freigabe:** Mark (Design abgestimmt; Bau erst auf „los")
**Repo:** `cert-expert-certification-os/apps/certification-os/` · Branch **`main`** · Port 3001
**Stand Bau:** Slice 0b (persistente Akte) ✅ · Slice 1 (Tally-Intake) ✅ → jetzt Slice 2–4.

**ZUERST LESEN (kanonisch):**
- `hq/03_Kundenprojekte/_O2C_Prozess_REAL.md` — der echte Prozess (2 Spuren, Zielbild)
- `hq/03_Kundenprojekte/_Pipeline_Checkpoints.md` — Journey-Stages (Spur 1)
- `hq/03_Kundenprojekte/_Pipeline_Readiness.md` — Vorbedingungen + Stichtags-Regeln (Spur 2)
- `hq/00_Dashboard/ARCHITEKTUR.md` — SoR-Regeln, S3+OneDrive-Export, Kunden-Slug

---

## Leitprinzip (NICHT vermischen)
- **Spur 1 = Journey-Stage** (wo steht der Kunde) → lebt im **CRM (Airtable)**, NICHT im Tool nachbauen.
- **Spur 2 = Readiness** (was ist erfüllt/blockiert) → **das baut das Tool** (diese Slices).
- Kunden-Schlüssel = **Slug** aus `_registry.json` (verbindet Tool ↔ Airtable ↔ OneDrive).

## Guardrails (hart)
- **EC-09** (Person → Queue → Doc-Chips → ZIP) **nie brechen**.
- **EC-10:** keine Auto-Freigabe-/Zertifizierungs-Aussage; Generator-Output `status: unchecked`.
- **Keine erfundenen Norm-Pflichten** — Werte nur aus `knowledge/NORM_MATRIX_…v1.md` bzw. Input. Unklar = offen markieren.
- **DSGVO:** Personendaten serverseitig (DB/S3), kein öffentlicher Lesezugriff.

---

## Slice 2 — Requirement-Engine (was ist Pflicht)
**Was Mark am Ende tun kann:** Kunde + Mitarbeiter wählen → das Tool zeigt automatisch, **welche Nachweise Pflicht sind** (ohne manuelles Nachdenken).

- Ableitung pro Akte: **Rolle × Zusatzrolle × SDL × Norm-Scope** → Pflicht-Nachweisliste (Checklisten 1–4, `_O2C_Prozess_REAL.md` §Checklisten).
- Plus **7 Unternehmens-Vorbedingungen** (`_Pipeline_Readiness.md` §A) als Firmen-Level-Requirements.
- Quelle der Werte: `NORM_MATRIX_…v1.md` (UE-Zahlen etc.) — **DIN-Detailwerte bleiben Phase 2**, jetzt nur die Mechanik (Engine baubar, Werte später einhängen).
- **DoD:** Für eine Test-Akte wird die korrekte Pflichtliste angezeigt; keine hartkodierten erfundenen Werte.

## Slice 3 — Readiness-Ampel (was blockiert)
**Was Mark am Ende tun kann:** Auf einen Blick je Kunde/Mitarbeiter eine **Ampel** sehen — grün = fertig, gelb = bald fällig/in Arbeit, rot = fehlt/blockt — und *was* fehlt.

- Entität **Readiness** je Akte/Firma: Requirement → Status (🟢/🟡/🔴) + Datum/Frist + Quelle (Nachweis/Upload/Generator).
- **Stichtags-Logik:** Fristen relativ zum **Audit-Termin** (aus Airtable `Audit Date`): Unbedenklichkeiten ≤6 Mon., Gewerbezentralregister ≤12 Mon.; Versicherung „ausreichend+gültig am Audit". (`_Pipeline_Readiness.md`)
- **Gate:** Übergang Journey Stage 4 (Unterlagen) → 5 (Audit) erst, wenn **alle 7 Vorbedingungen grün**.
- Negativtests N-01…N-07 / Forbidden-Wording (keine Auto-Freigabe) gelten.
- **DoD:** Test-Kunde mit 1 fehlender Versicherung → rotes Readiness-Item + Audit-Gate blockiert; nach Upload → grün.

## Slice 4 — DEKRA-Ordner-Assembler + Export
**Was Mark am Ende tun kann:** Auf einen Klick den **audit-fertigen DEKRA-Ordner** pro Kunde erzeugen — Standarddokumente generiert (Firmenname/Logo drin) + Nachweise einsortiert — landet in OneDrive-Akte, bereit für Teambeam-Upload.

- **Bestehende DEKRA-Ordner-Struktur nutzen** (NICHT neu erfinden) — Skelett aus `OneDrive/02_QM_und_Wissen/Template/5_DIN 77200-1/10_Dekra/` bzw. den vorhandenen Kunden-DEKRA-Ordnern. Code-Track: Struktur einlesen + **Slot-Mapping** definieren (welcher Nachweis/welches generierte Dokument in welchen Slot).
- **Generierte Standarddokumente:** Platzhalter (`{CompanyName}`, `{Logo}`, `{ApprovedBy}` …) füllen — inkl. **Eigenerklärungs-Bundle** (Datenschutz/Verschwiegenheit/Mindestlohn) als ein Dokument.
- **Eingereichte Nachweise:** aus S3 (Tally-Intake) → richtiger Slot.
- **Export (Architektur-Entscheidung 2026-06-07):** S3 = Arbeitsablage + **Auto-Kopie nach OneDrive `01_Kunden/<Kunde>/08_Generated/`** (kein manueller Download).
- **DEKRA-Upload-Routing:** fertiger Ordner → **Teambeam des DEKRA-Kontakts nach Anfangsbuchstabe** (Airtable „DEKRA Contacts": `Alphabet Range` + `Teambeam Link`). DEKRA = aktuell Default-Stelle, nicht exklusiv (Feld `Certification Body`).
- **DoD:** Für 1 Test-Kunde wird ein DEKRA-Ordner befüllt (generierte Docs + Nachweise) und nach OneDrive `08_Generated` gespiegelt; EC-09/EC-10 intakt.

---

## Reihenfolge & Abhängigkeiten
2 (Requirement) → 3 (Readiness, braucht 2) → 4 (Assembler, braucht 2+3 + Intake ✅).

## Bewusst NICHT jetzt (Phase 2)
DIN-Detailwerte (UE 16/24/40/64) · Kundenportal/Gates-Fortschritt für Kunden · Versicherungs-Partner-Vermittlung · Zertifikats-Stammdaten-Pflege.

## Offene Eingaben von Mark (kein Blocker für Start)
- Zertifikats-Daten (Issue/Expiry) der Zertifizierten — später.
- Bestätigung Slot-Mapping, sobald Code-Track die DEKRA-Struktur eingelesen hat.
