# Cursor-Arbeitsauftrag — Slice-1-Nachzug: Felder mitspeichern (kein Rechner, keine Logik)

**Freigabe:** Mark, 2026-06-07 („ja“). **Track:** Code-Track (Claude reviewt, Cursor baut).
**Vorab lesen:** HANDOFF-Eintrag „Slice-1-Nachzug + Rollen-/Bedingungs-Modell“ (2026-06-07), `TALLY_FIELD_MAPPING.md`.
**Repo:** `cert-expert-certification-os/apps/certification-os/` · Branch `main` · Port **3001**.

> **Akzeptanz-Regel (fix): im echten Browser / mit echtem Tally verifizieren — NICHT per Skript.**
> **Scope-Disziplin:** NUR erfassen/anzeigen. **Kein Schulungsrechner, keine Pflicht-Ableitung, keine UE-Berechnung** — das ist bewusst Slice 2/3 (Werte noch offen, dürfen nicht erfunden werden).

## Ziel (was Mark am Ende kann)
Eine eingehende Tally-Mitarbeiter-Submission speichert auch **Beschäftigungsart** und **Qualifikation** in die Akte (gehen aktuell verloren), die **Rolle** wird sauber übernommen und in der UI klarer benannt. Damit ist der Eingang feldvollständig.

## Build (Definition of Done)

1. **Datenmodell:** `EmployeeFile` um zwei Felder erweitern (Prisma-Migration):
   - `employmentType` (String?, „Beschäftigungsart“ — Vollzeit/Teilzeit/…).
   - `qualification` (String?, „Qualifikation“).
   *(Reine Stammdaten-Felder, optional; keine Berechnung daran.)*

2. **Tally-Mapping** in `lib/tally-intake-config.ts` / `tally-intake-service.ts`:
   - `aBv7BE` (Dropdown) → `employmentType`.
   - `24o87V` (Dropdown) → `qualification`.
   - `pLzdKP` → `roleType` bleibt; sicherstellen, dass der Wert sauber übernommen wird.
   - Für **alle Slots 2–10** analog (über `EMPLOYEE_FORM_SLOTS`).

3. **UI (Akte):** Felder in den Stammdaten anzeigen. **„Grundrolle“ umbenennen** → **„Rolle (Sicherheitsmitarbeiter / Führungskraft)“**. Rollen-Werteliste = volle Taxonomie (SMA, Führungskraft, **Bürokraft/Verwaltung**, **Geschäftsführung**, Einsatz-/Objekt-/Schichtleitung, Subunternehmer-SMA, Praktikant/Azubi); sichtbar starten mit SMA/Führungskraft.

4. **`TALLY_FIELD_MAPPING.md`** aktualisieren: `aBv7BE` und `24o87V` von „offen“ → gemappt.

## Guardrails
- **EC-09** (Person→Generator→ZIP) unberührt — Smoke grün vor/nach.
- **EC-10:** keine Freigabe-/Auditfähigkeitsaussage; eingehende Nachweise bleiben `unchecked`.
- **Keine erfundenen Normpflichten / keine UE-Werte** in diesem Nachzug.

## Akzeptanz (Browser/echt)
- Echte Tally-Submission mit ausgefüllter Beschäftigungsart + Qualifikation → beide Werte in der Akte sichtbar; Rolle korrekt; Mehrfach-Slots ok.
- EC-09-Smoke grün.
→ Ergebnis + offene Punkte in HANDOFF; Claude reviewt. **Danach Pause** (Slice 2 separat freigeben).

## NICHT in diesem Auftrag (bewusst Slice 2/3)
Schulungsrechner (Soll/Ist UE), Pflicht-Ableitung je Rolle/Geltungsbereich, „fährt Dienstfahrzeug?“ → Unterweisung, Fristen, Ampel. Dimensionen sind im HANDOFF für Slice 2 vorgemerkt.
