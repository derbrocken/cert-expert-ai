# CURRENT_STATE — CEKS / Cert-Expert Knowledge System

**Stand:** 2026-05-30  
**Branch:** `cursor/din-77200-1-anforderungsprofile`  
**Letzter bekannter Commit:** `5fd6660` — *Add Tool 2 domain model and agent CURRENT_STATE snapshot*

---

## Projekt

**CEKS / Cert-Expert Knowledge System** — normzentriertes Wissensmodul für DIN 77200 (Qualifikation, Profile, Freigaben). Kein Tool-2-Code in diesem Repo.

---

## Gültige Architektur

**Normzentriert** unter `knowledge/1_standards/`:

| Bereich | Pfad |
|---------|------|
| DIN 77200-1 (CEKS, Profile, Qualifikation V2+) | `DIN 77200-1/` |
| DIN 77200-2 (besondere SDL) | `DIN 77200-2/` |
| Governance (Meta, Agenten) | `Governance/DIN 77200/` |

Detail: [[ARCHITECTURE]] · Ordner V1/V2 Qualifikation: [[QUALIFICATION_V1_V2]]

**Nicht:** neue Parallelstruktur, Migration ohne Freigabe, `AGENT_ROUTE.yaml`, `DECISIONS.md`, `WORKLOG.md`.

---

## Abgeschlossene Module (aktuell)

| Modul | Pfad |
|-------|------|
| **04** Matrix / Codes | `DIN 77200-1/qualifications/04_qualifikationsmatrix_logik.md` |
| **05** Personalfreigabe V1 | `qualifications/05_personnel_release_v1.md` |
| **06** SDL-Freigabe V1 | `qualifications/06_sdl_release_v1.md` |
| **07** Einsatzfreigabe V1 | `qualifications/07_einsatz_release_v1.md` |
| **08** Tool-2-Domänenmodell V1 (nur fachlich) | `qualifications/08_tool2_data_model_v1.md` |

Ergänzend fertig (nicht neu erfinden): Katalog `02`, System `01`, Hooks `03`, Anforderungsprofile, `qualifikationssystem/` V1 Legacy (01–05).

Einstieg Qualifikation V2+: `DIN 77200-1/qualifications/README.md`

---

## Freigabekette (CEKS)

```
04 Matrix (Codes)
  → 05 Personalfreigabe
  → 06 SDL-Freigabe
  → 07 Einsatzfreigabe
  → 08 Tool-2-Domänenmodell (fachlich)
  → spätere Tool-2-Implementierung (Software/DB/API — bewusst getrennt)
```

---

## Offene nächste Schritte

| Priorität | Thema | Hinweis |
|-----------|-------|---------|
| — | **Keine** weitere Tool-2-Arbeit | Domäne in `08` abgeschlossen; Implementierung erst nach expliziter Freigabe |
| offen | Tool-2-Implementierungsarchitektur | DB/API/UI — **nicht** im Knowledge-Standard |
| offen | VA Kap. 7 V9 | Katalog/Organisation Qualifikation |
| offen | Tool-1-Export aller Profilzeilen | Generator / Slots |

Roadmap-Details: [[ROADMAP]]

---

## Arbeitsregel für neue Agents

1. **Diese Datei** (`CURRENT_STATE.md`) lesen  
2. [[AGENT_ONBOARDING]] lesen  
3. Relevante README/Governance lesen (`ARCHITECTURE`, `AGENT_RULES`, `QUALIFICATION_V1_V2` je nach Aufgabe)  
4. Bestehende Source-Dateien prüfen — **nicht** aus Chat-Historie raten  
5. **Erst dann** ändern  

---

## Abschlussregel

Nach jedem **abgeschlossenen** Arbeitsschritt:

1. **CURRENT_STATE.md** aktualisieren (Stand, Commit, abgeschlossen/offen)  
2. Dem Nutzer eine **Commit-Empfehlung** geben (nicht committen, außer explizit gewünscht)
