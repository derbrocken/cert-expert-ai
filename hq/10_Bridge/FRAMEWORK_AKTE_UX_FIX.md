# Akte-UX-Fix — Bestellungen entwirren + Pflicht-Nachweise hochladbar (Plan)

> **Anlass:** Mark-Bugreport (2026-06-12, Screenshot). Mitarbeiter-Formular/Akte. Beide Befunde **pre-existing** (nicht von P1–P3b). EC-09/Akte-nah → vorsichtig.
> **Stand:** 2026-06-12.

## BEFUND 1 — Doppelte „Bestellungen" (Verwechslung)
Im Appointments-Block stehen im Master-Modus **zwei** überlappende Controls:
- **„Bestellt als (formale Ernennung)"** — MultiSelect aus `BESTELLUNG_DEFS` (Ersthelfer CL-08 / Brandschutzhelfer CL-23 / SiBe CL-74). **Richtig.**
- **„Weitere Termine / Overlays (optional)"** — MultiSelect aus `appointmentOptions` = rohe S3-Ordner (**Bestellungen** / Betriebsanweisung / Mutterschutz / Objektbezogen / Veranstaltung). Enthält den Ordner „Bestellungen" nochmal → die falsche Liste, die Mark öffnet.

**Soll:** Im Master-Modus den **„bestellungen"-Ordner aus `appointmentOptions` herausfiltern** (wird schon über „Bestellt als" abgedeckt) + Feld klar umbenennen (z. B. „Weitere Dokumenten-Ordner (optional)"). → keine Doppelung, „Bestellt als" bleibt die eine Bestell-Quelle. Klein, reine UI.

## BEFUND 2 — Pflicht-Nachweise nicht hochladbar (neue Person, an den Zeilen)
Heute: Upload nur als separate Sektion **`FormEvidenceUploadSection`**, gegated auf **gespeicherte Person** (`editingEmployee?.id` + `handleEvidenceUpload` bricht ohne `focusEmployee.id` ab). Mark will: **Upload direkt an den Nachweis-Zeilen, auch bei noch nicht gespeicherter Person.**

**Kern-Hürde:** Evidence landet unter `cea/.../evidence/{employeeFileId}/…` — die ID existiert erst nach Speichern.

**Lösungsweg (Entscheidung):**
- **(A) Puffern → beim Speichern flushen** *(Empfehlung):* Datei-Uploads an den Nachweis-Zeilen werden **client-seitig gepuffert** (pro `evidenceId` ein `File`), sofort als „angehängt" angezeigt. Beim **Speichern** wird die Person angelegt → ihre neue ID → die gepufferten Dateien werden via `saveEmployeeEvidenceFile` persistiert. **UX = „alles ausfüllen inkl. Nachweise, dann einmal speichern".** EC-10: eingehende Nachweise `unchecked`.
- (B) Auto-Save bei erstem Upload (Person sofort anlegen, dann hochladen). Einfacher technisch, aber legt eine evtl. unvollständige Person sofort an (überraschend). 

**Zusätzlich (beide Wege):** Upload-Control **je Pflicht-Nachweis-Zeile** rendern (statt nur generische Sektion), gemappt auf die `evidenceId` der Anforderung.

## UMSETZUNG (nach Entscheidung)
- **B1 (klein):** `appointmentOptions`-Filter (Master) + Label → reine UI, kein Datenmodell.
- **B2 (mittel):** 
  - Pure Mapping Anforderung→`evidenceId`→Upload-Slot (testbar).
  - Per-Zeile Upload-UI an den Nachweis-Zeilen.
  - Puffer-State im Formular (`Map<evidenceId, File>`) + Flush nach `onAdd` (neue ID) → `saveEmployeeEvidenceFile`. Bei bestehender Person: direkt hochladen (heutiger Pfad).
  - **Generator/Engine unberührt (EC-09).** EC-10: `unchecked`.

## DoD
- tsc 0 · Build grün · neue Unit-Tests (Filter; Puffer-Flush-Logik) · Tool-2-Suite unberührt.
- Browser-Abnahme Mark: (1) nur EINE klare Bestell-Auswahl, kein verwirrendes Ordner-Dropdown; (2) bei **neuer** Person Nachweis an der Zeile hochladen → nach Speichern in der Akte persistiert + sichtbar.

## Gate
→ Mark: **Weg A (puffern, Empfehlung) oder B (Auto-Save)?** Und Befund-1-Fix (Filter+Umbenennen) ok? Dann baue ich beides in einem Pass (oder getrennt, falls du #1 schnell zuerst willst).
