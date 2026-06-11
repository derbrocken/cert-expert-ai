# Navigation / Orientierung — Plan-Einseiter

> **Teil von:** `FRAMEWORK_TOOL1_TOOL2_UPLOAD.md`. Marks Befund: Tool 1 tief im QM-Modul vergraben, Upload-Manager separater Button, Firma-Box auf `/uploads` verwirrt → „läuft nicht rund". Reine UX/Orientierung, keine Logik.
> **Stand:** 2026-06-11.

## IST
- Gemeinsamer `Navbar` auf allen Seiten = Logo (→ `/`) + **nur** „Upload Manager"-Button (→ `/uploads`).
- Tool 1 (`/model-creator`) nur über QM-Modul-Unterpunkt erreichbar (vergraben).
- Tool 2 (`/employee-automation`) = prominenter Bereich, aber nicht im Navbar.
- Drei Werkzeuge **uneinheitlich** erreichbar → Orientierungslücke.

## SOLL
Die **drei Werkzeuge gleichwertig + immer erreichbar** im Navbar, mit Aktiv-Markierung (welche Seite gerade offen):
```
[ Cert-Expert-Logo ]      Mitarbeiterakte   Dokument-Generator   Upload-Manager
        → /                → /employee-automation  → /model-creator   → /uploads
```
- **Mitarbeiterakte** = Tool 2 · **Dokument-Generator** = Tool 1 · **Upload-Manager** = Vorlagen/Sammlungen.
- Aktive Seite hervorgehoben (rote Cert-Expert-Akzentfarbe), Rest neutral.
- Logo bleibt der Weg zurück zur Modul-Übersicht (`/`).
- Mobil: kompakt (Icons / Kurzlabels), kein Menü-Umbau.

## UMSETZUNG (klein, 1 Datei)
- `components/layout/Navbar.tsx`: `"use client"` + `usePathname()` für Aktiv-State; die drei Links als konsistente Leiste (statt Einzel-Button). Icons (lucide): Users (Mitarbeiterakte), FileText (Dokument-Generator), Upload (Upload-Manager).
- **Kein** Eingriff in Seiten-Logik, Generatoren, Daten. Reiner Navbar-Umbau.

## DoD
- `tsc` 0 · `next build` grün · Tool-2-Suite 160/160 unberührt.
- Von jeder Seite sind alle drei Werkzeuge mit einem Klick erreichbar; aktive Seite markiert.
- EC-09/EC-10 unberührt (reine Navigation).
- Browser-Abnahme Mark: durch alle drei klicken, Aktiv-State stimmt.

## Gate
→ Mark: so bauen? Optional danach: Tool-1-Unterpunkt im QM-Modul behalten/aufräumen (separat).
