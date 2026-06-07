# Cursor-Arbeitsauftrag — Slice 0: Persistente Akte (Datenmodell)

**Freigabe:** Mark, 2026-06-07 („los"). **Track:** Code-Track (Claude reviewt, Cursor baut).
**Kontext zuerst lesen:** `hq/10_Bridge/CURSOR_BAUAUFTRAG_TOOL2.md` (Gesamtplan), `DFSS_GOLD_GAP_4SLICE.md`, `TOOL2_FAHRPLAN_DFSS.md`.
**Repo:** `cert-expert-certification-os/apps/certification-os/` · Branch `b3-tool2-migration` · Port **3001**.

---

## Ziel (was Mark am Ende kann)
Einen Kunden öffnen und seine gespeicherten Mitarbeiter sehen — **Stammdaten bleiben dauerhaft**, nichts doppelt tippen, auch nach Reload/Neustart und **serverseitig** (Voraussetzung für den Tally-Webhook in Slice 1, der serverseitig schreibt).

## WICHTIG — zweistufig, wegen Architektur-Guardrail (C-10)
Slice 0 führt **erstmals serverseitige Persistenz** ein. Das ist eine Architekturentscheidung → **nicht still selbst wählen.**

**Schritt 0a — Vorschlag (kein Code):** Cursor legt einen kurzen Vorschlag in `HANDOFF.md` („Von Cursor an Claude") vor:
- **Datenmodell:** Entitäten **Firma → Mitarbeiter-Akte** (1 Akte = 1 Firma-Relation, per-file; nicht Session-global), Felder gemäß O2C-Checkliste 2 / `NORM_MATRIX_…v1.md` + bestehende Akte-Felder.
- **Speichertechnik (serverseitig):** konkreter Vorschlag + kurze Begründung (z. B. Postgres/SQLite via Prisma auf Hetzner, oder bestehende Hetzner-S3-Struktur). Was passt zum vorhandenen Stack/Hosting?
- **Migration:** wie die bestehenden `localStorage`-Queue-Daten (`employee-queue-storage.ts`) + Nachweise (`employee-evidence-storage.ts`) übernommen werden (verlustfrei).
- **Auswirkungen** auf EC-09-Generator (darf nicht brechen).
→ **Stopp. Auf Freigabe von Mark/Claude warten.**

**Schritt 0b — Implementierung (nach Freigabe):**
- Persistentes Datenmodell + Speicher serverseitig anlegen; localStorage-Queue als **führender Speicher abgelöst** (UI darf Cache bleiben).
- Verlustfreie Migration bestehender Daten.
- Kunden-Slugs aus `hq/03_Kundenprojekte/_registry.json`.

## Definition of Done
- Akte anlegen/bearbeiten → bleibt nach Reload **und** Server-Neustart erhalten.
- 2 Firmen sauber getrennt (keine Vermischung der Pools).
- Migration: vorhandene Test-Akten unverändert sichtbar.
- **EC-09-Smoke grün** (Person → Akte → Doc-Chips → ZIP) vor/nach Änderung.
- Keine Forbidden-Wording-/Freigabe-Aussagen neu eingeführt (EC-10).
- ESLint: keine **neuen** Errors (bestehende 20 separat klären, siehe Bauauftrag).

## Rückmeldung
Ergebnis + offene Fragen in `HANDOFF.md` („Von Cursor an Claude"). Claude reviewt Vorschlag (0a) und Implementierung (0b).
