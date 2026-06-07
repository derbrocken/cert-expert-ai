# Cursor-Übergabe — nächste Session (Tool 1 + Tool 2 stabilisieren)

**Stand:** 2026-06-07 · **Branch:** `main` (konsolidiert, T-04)  
**Vorherige Session:** Mitarbeiterakte UI polish (inline edit, Nachweise, Section-Reorder) — teils **uncommitted**

---

## Copy-Paste für neuen Cursor-Chat

```
Lies zuerst:
1) hq/10_Bridge/CONTEXT.md
2) hq/10_Bridge/CODE_REVIEW.md
3) hq/10_Bridge/CURSOR_UEBERGABE_NAECHSTE_SESSION.md (diese Datei)

ZIEL: Tool 1 (/model-creator) und Tool 2 (/employee-automation) in der
Certification OS (apps/certification-os, Port 3001) so stabilisieren, dass
ich sie ab morgen für die tägliche Arbeit nutzen kann.
KEIN großer Umbau (Firma→Pool, Norm-Matrix) — das ist die nächste Phase.

GUARDRAILS:
- EC-09 Generator (Person → Queue → Doc-Chips → ZIP) NICHT brechen.
- Transitional: keine Freigabe-/Zertifizierungsaussage.
- Keine erfundenen Norm-Pflichten.
- Branch main (konsolidiert, T-04).
- Keine Commits ohne explizite Anweisung von Mark.

APP-PFAD:
cert-expert-certification-os/apps/certification-os/

ROUTEN:
- /              Dashboard-Hub
- /model-creator Tool 1 (Standard-Modelle → ZIP)
- /employee-automation Tool 2 (Mitarbeiterakte → Generator → ZIP)
- /uploads       Upload Manager + Firmendaten

AUFGABEN:
1. Tool 1 /model-creator: „Loading folders…" hängt — Standard-Models laden
   nicht. Ursache finden (Hetzner-S3 / .env.local / GET /api/standard-models)
   und fixen: Ordner laden + ZIP-Generierung (send-model-entries) funktioniert.
2. Tool 2 /employee-automation: End-to-end testen (Person → Akte → Generator
   → ZIP), Persistenz prüfen (employee-queue-storage localStorage + optional
   employee-evidence-storage), Hakeln beseitigen.
3. Beide vom Dashboard-Hub (/) erreichbar; sauberen Start dokumentieren
   (ein definierter Port, npm run dev) als kurzes README im OS-Ordner.
4. Hängenden Node-Prozess auf Port 3000 aufräumen → ein definierter Dev-Port.

DONE-KRITERIEN:
- Tool 1: Standard-Model-Ordner laden, Platzhalter füllbar, ZIP kommt raus.
- Tool 2: kompletter Akte→ZIP-Flow fehlerfrei, Daten bleiben nach Reload.
- Klarer Start (ein Port) + README.

BEKANNTE HINWEISE (aus letzter Session):
- Dev-Server lief auf http://localhost:3001 (3000 blockiert/hängt).
- production start auf 3002 warf HetznerStorageNotConfiguredError ohne .env.local.
- Claude Review (CODE_REVIEW.md): Norm-Matrix bewusst NICHT in diesem Slice.
- Wichtige Tool-2-Dateien: EmployeeAutomationPage, EmployeeFileDossierView,
  EmployeeFilePersonRolleEditTable, employee-queue-storage, generate-employee-docs.
- Tool-1-Dateien: app/model-creator, app/api/standard-models/route.ts,
  app/actions/send-model-entries.ts, roles/admin/UploadsPage (Standard Models Tab).

RÜCKMELDUNG: kurzer Eintrag in hq/10_Bridge/HANDOFF.md unter
„Von Cursor an Claude" — was gefixt, was offen.
```

---

## Kontext aus vorheriger Cursor-Session (kurz)

### Erledigt (UI, evtl. uncommitted)
- Person & Rolle + Pflichtangaben = eine Sektion, inline editierbar
- Grundrolle Dropdown, Bestellungen (Ersthelfer/Brandschutz/SiBe zuerst)
- Dienstausweisnummer (Label)
- Pflichtnachweise: PDF-Upload pro Zeile (localStorage)
- Reihenfolge Akte: Nachweise + Schulung vor Geltungsbereich
- Letzter Commit: B8.2 requirements-based Akte UI (`12ded4b`)

### Nicht anfassen (explizit)
- `EmployeeProfileSectionShell.tsx` (Legacy B7)
- EC-09 Generator-Logik unless bugfix
- Norm-Regel-Matrix / B8.3 (nächste Phase)

### Offene Infra
- Port 3000: Node-Prozess blockiert, antwortet nicht zuverlässig
- Port 3001: aktiver `npm run dev`
- Hetzner: `HETZNER_S3_KEY`, `HETZNER_S3_SECRET`, `HETZNER_BUCKET_NAME`,
  `HETZNER_S3_ENDPOINT`, `HETZNER_S3_REGION` in `.env.local`

---

## Repo-Landkarte (1 Zeile je Tool)

| Tool | Canonical-Pfad | Legacy-Fallback |
|------|----------------|-----------------|
| Tool 1 | `cert-expert-certification-os/apps/certification-os/` → `/model-creator` | `bots/legacy_tools/.../document_creater_tool_employee_file_creater_tool1_2/` |
| Tool 2 | gleiche App → `/employee-automation` | gleicher Legacy-Ordner |
