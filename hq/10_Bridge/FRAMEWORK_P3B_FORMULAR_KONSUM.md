# P3b — Mitarbeiter-Formular konsumiert Sammlungen (Design + Bau-Plan)

> **Teil von:** `FRAMEWORK_P3_EDITIERBARE_SAMMLUNGEN.md` (P3a live). P3b = zweiter Bau-Pass: das Mitarbeiter-Formular wählt Doks anhand einer **Sammlung** vor (Vordefinierte + Custom).
> **Status:** DESIGN-GATE — 1 echte Gabelung (ordnerübergreifend vs. Ein-Rollen-Modell). Mark entscheidet, dann Bau. (Formular-/Generator-nah → kein Bauen auf Annahmen.)
> **Stand:** 2026-06-12.

## 1. IST (P3b-relevant)
- Formular wählt Doks über **eine** `setKategorie` → `roleId` → `selectedRoleDocIds` (Doc-Chips genau **einer** Rolle) + `appointmentIds`/`selectedAppointmentDocIds`. Generator (`generate-employee-docs.ts`) verarbeitet **diese eine Rolle** + Appointments.
- Doc-ID = `${ordner}-${datei ohne .docx}`. Sammlungs-Item trägt `templateLogicalPath` = `${kategorie}/${ordner}/${datei}.docx` → mappt eindeutig auf eine Doc-ID.
- **Spannung:** Sammlung = ordnerübergreifendes Bündel; Formular/Generator = **Ein-Rollen-Modell**.

## 2. SOLL (P3b)
- Im Formular ein **Sammlungs-Selektor** (Vordefinierte + Custom aus `fetchCollectionsAction`).
- Auswahl → Doks vorausgewählt nach Inclusion-Stufe: **Pflicht = an+gesperrt**, **optional-vorausgewählt = an+abwählbar**, **optional-aus = aus+zuwählbar**.
- Mappt auf die **bestehende** Auswahl-Mechanik (`roleId` aus dem Rollen-Item der Sammlung, `selectedRoleDocIds`, `appointmentIds`, `selectedAppointmentDocIds`). **Generator bleibt unverändert** (EC-09).

## 3. ENTSCHEIDUNGEN (Gate)

- **DPb.1 — Ordnerübergreifend?** (DIE Gabel)
  - **(a) Safe-Map im Ein-Rollen-Modell** *(Empfehlung)*: Sammlung setzt **eine** Rolle (aus ihren `roles/<slug>`-Items) + deren Doks + Appointments. Items aus **weiteren** Rollen-Ordnern werden **angezeigt mit Hinweis „erst nach P3c generierbar"**, nicht stillschweigend verschluckt. Realistisch deckt das die meisten Sammlungen (eine Rolle + Overlays). **Kein Generator-Umbau, EC-09 sicher.**
  - (b) Voll ordnerübergreifend jetzt = Generator/Modell-Umbau (selektierte Doks als flache Logical-Path-Liste statt Ein-Rollen). Das ist **P3c** (größer, EC-09-kritisch) — nicht P3b.
- **DPb.2 — Verhältnis zu `setKategorie`-Dropdown:** Sammlungs-Selektor **ersetzt** das heutige „Set-Kategorie"-Dropdown (die 3 Seeds = genau die 3 setKategorien → Superset). Bei Seed-Auswahl wird `setKategorie` weiter gesetzt (Kontinuität/Default). *(Empfehlung: ersetzen → EINE Auswahl statt zwei.)*
- **DPb.3 — Pflicht-Sperre:** Pflicht-Doks im Chip-UI **vorausgewählt + Toggle deaktiviert** (nicht abwählbar). *(Empfehlung: ja.)*
- **DPb.4 — Persistenz:** additives Feld `collectionId String?` an der Akte (merkt die gewählte Sammlung; additive Migration wie `setKategorie`). *(Empfehlung: ja.)*

## 4. UMSETZUNG (nach Entscheidungen)
- Pure Mapping-Logik (`collection → {roleId, selectedRoleDocIds, appointmentIds, selectedAppointmentDocIds, lockedDocIds, unsupportedItems}`) in testbares Modul → Unit-Tests (Logical-Path→Doc-ID, Inclusion-Stufen, cross-role-Hinweis).
- `EmployeeForm.tsx`: Sammlungs-Selektor + Apply-Handler; Chip-UI um Pflicht-Sperre erweitern.
- Additive Migration `collectionId` (db push, Backup).
- **Generator NICHT anfassen** (EC-09). Engine/Norm-Klasse unberührt (EC-10).

## 5. DoD
- tsc 0 · `next build` grün · neue Unit-Tests · Tool-2-Suite unberührt/erweitert grün · additive Migration verifiziert.
- Browser-Abnahme Mark: Sammlung wählen → Doks vorausgewählt korrekt (Pflicht gesperrt, optional umschaltbar) → generieren → richtige Doks im ZIP. cross-role-Hinweis sichtbar.

## 6. Gate
→ Mark: DPb.1–DPb.4 (oder „Empfehlungen ok"). Dann baue ich P3b in einem Pass. (Voll ordnerübergreifend = P3c danach.)

---

## 7. ENTSCHEIDUNGEN LOCKED (Mark „Empfehlungen ok", 2026-06-12)
- **DPb.1 ✅ (a)** Safe-Map im Ein-Rollen-Modell; cross-role/standard-models/ohne-Vorlage-Items → **als Hinweis** („erst nach P3c generierbar"), nicht verschluckt.
- **DPb.2 ✅** Sammlungs-Selektor **ersetzt** das setKategorie-Dropdown; **Seed-Auswahl = bisheriges Verhalten** (seedKey→setKategorie→roleId→alle Rollen-Doks, kein Lock — keine Regression), **Custom = Pfad-Mapping** mit Inclusion.
- **DPb.3 ✅** Pflicht-Doks (custom) vorausgewählt + Toggle **gesperrt** (`lockedDocIds`).
- **DPb.4 ✅** additives Feld `collectionId String?` an der Akte.

**Bau-Reihenfolge:** pure `collection-employee-mapping.ts`(+Tests) → Schema `collectionId` (db push) → `EmployeeForm.tsx` (Selektor + Apply + Lock + Hinweis) + Typ/Repo.
