# HQ Next Steps — Phase 4

**Stand:** 2026-06-03  
**Basis:** Phasen 1–3 (`HQ_GRAPH_ANALYSIS`, `TODO_COVERAGE_ANALYSIS`, `PROJECT_CONTAINER_GAP_ANALYSIS`)  
**Scope:** Nur Cert-Expert HQ — **keine** Bots, CEKS, Tool 2, Telegram, Dokumentenlogik.

---

## 1. Sofortmaßnahmen (heute)

1. **Git-Stand klären:** `hq/` liegt auf `cursor/din-77200-1-anforderungsprofile`, nicht auf `main`. Entweder Branch auschecken oder `hq/` nach `main` mergen — sonst Obsidian und Repo laufen auseinander.
2. **Obsidian Vault-Pfad prüfen** (Einstellungen → Über). Wenn Vault = `knowledge/`: entscheiden, ob Vault auf **Repo-Root** `cert-expert-ai` umgestellt wird (einfachste Graph-Sicht auf HQ).
3. **TeamFlex:** Operations Board „Morgen früh“ — Anruf, Wachbuch, Zusatzbeauftragung, DEKRA (To-dos tf01–tf07 bereits strukturiert).
4. **Schutzritter:** VK-Upload (sr06) — Blocker für Formularpfad; Frist ASAP.
5. **Naming:** AVAS vs. AFAS in Forderungen klären und einheitlich benennen.
6. **Fehlende Audit-Termine eintragen** (manuell, keine Auto-Generierung):
   - ZT Security **08.07.** in `ZT_Security/ToDos.md` + `Audit_2026.md`
   - Wolf Street **17.07.** falls bestätigt — sonst als offenen Punkt markieren

---

## 2. Diese Woche

| Priorität | Aktion |
|-----------|--------|
| P0 | Wolf Street Audit-Vorbereitung (16.06.) — To-dos ws01–ws07 |
| P0 | TeamFlex Audit 12.06. — Restpunkte tf02–tf09 |
| P0 | SecuGuard NCs bis 30.06. |
| P1 | Schutzritter Pfad bis 26.06. (Formulare → Personal → Audit-Check sr05) |
| P1 | Forderungen: Faust 1.500 €, LC Betrag, AVAS/AFAS Rechnung |
| P1 | `Audit_2026.md` für TeamFlex + Wolf Street aus ToDo-Header befüllen |
| P2 | Master Dump Dedup (Checkliste in `01_Master_Dump/`) |
| P2 | Miras Protect: Kundenordner ja/nein entscheiden |

---

## 3. Vor nächstem Audit

| Kunde | Nächster Termin (HQ-Stand) | Kritischer Pfad |
|-------|----------------------------|-----------------|
| TeamFlex | **12.06.2026** | Kundengespräch, Wachbuch, DEKRA-Ordner, Subunternehmer, ADA |
| Wolf Street | **16.06.2026** (+ 17.07. unbestätigt) | Auditorwechsel, ISO 14001 KPIs, Managementbewertung |
| Schutzritter | **26.06.2026** | VK → Unternehmensformulare → MA-Formulare → Audit-Checkliste |
| SecuGuard | **30.06.2026** | 5 major + 2 minor NCs |
| ZT Security | **08.07. fehlt in HQ** | Scope ISO 9001 + DIN 77200-1 dokumentieren |
| Checkpoint Regional | Termin offen | Unbedenklichkeit, Upload, DEKRA-Angebot |

**Checkpoint / ZT:** Erstzert- bzw. Überwachungs-Label und Termine in `Status.md` + `Audit_2026.md` vereinheitlichen.

---

## 4. Architekturarbeiten (HQ + Repo, ohne Bot-Bau)

1. **Vault-Strategie festlegen:** eine Obsidian-Wurzel für Organisation + Knowledge (Repo-Root) vs. getrennte Vaults mit Hub-Note.
2. **Wikilink-Minimum** für Graph (Vorschlag, erst nach Freigabe):
   - `00_Dashboard` → `[[TeamFlex]]` … oder `[[03_Kundenprojekte/TeamFlex/Status]]`
   - Je Kunde: `Status` ↔ `ToDos` ↔ `Audit_2026` als `[[...]]`
3. **`_registry.json` erweitern** um AFAS/Faust/Dennis oder bewusst als `internal_only` / `receivables_only` markieren.
4. **DFSS:** Datei für Softwareprojekt-Anforderungen + Historik-Validierung unter `07_DFSS/` planen.
5. **Employee Generator:** eigenes Software-TODO (sw06) aus Master Dump ableiten.
6. **`projects/` ↔ `hq/03_Kundenprojekte/`** Verknüpfung laut Handoff — nur Verweise, keine Bot-Pipeline ändern.
7. **Dashboard** (`00_Dashboard`): KPI-Zeile Audit-Welle, Links zu Operations Board + offene Forderungen.

---

## 5. Spätere Telegram-Integration (nur Vorbereitung)

Bereits vorbereitet auf Feature-Branch:

- Maschinenlesbares To-do-Schema in `08_Vorlagen/ToDos_template.md`
- `docs/MOBILE_INPUT_TODO_ARCHITECTURE.md` (Konzept)
- `_registry.json` mit Slugs/Aliases für Kundenerkennung

**Vor Telegram:**

- [ ] `hq/` auf `main` stabil
- [ ] Registry vollständig + Naming konsistent
- [ ] Wikilinks oder IDs für automatische Zuordnung
- [ ] Policy: unbekannter Kunde → `01_Master_Dump/` vs. reject

**Explizit nicht jetzt:** Bot, Webhook, Obsidian-Plugin, CEKS-Änderungen.

---

## 6. Entscheidungen für gemeinsames Review

| # | Frage | Optionen |
|---|--------|----------|
| 1 | Obsidian Vault | `knowledge/` vs. `cert-expert-ai/` |
| 2 | AFAS vs. AVAS | Umbenennung Forderung + ggf. Kundenordner |
| 3 | Wolf 17.07. | Eintragen oder verwerfen |
| 4 | ZT 08.07. | In HQ nachpflegen |
| 5 | Miras / Dennis / Faust | Voller 6-Datei-Container oder Querschnitt |
| 6 | `main` merge | Wann `hq/`-Branch in Produktions-Branch |

---

## Anhang — Analyse-Dateien

| Datei | Pfad |
|-------|------|
| Graph / Vault | `docs/HQ_GRAPH_ANALYSIS.md` |
| To-do-Abdeckung | `docs/TODO_COVERAGE_ANALYSIS.md` |
| Projekt-Container | `docs/PROJECT_CONTAINER_GAP_ANALYSIS.md` |
| Dieses Dokument | `docs/HQ_NEXT_STEPS.md` |
