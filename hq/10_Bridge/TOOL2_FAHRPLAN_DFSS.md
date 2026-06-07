# Tool-2-Fahrplan (DFSS-informiert) — für Cursor / Code-Track

**Stand:** 2026-06-07 · **Kernbotschaft:** Das vollständige Tool-2-Design **existiert bereits im DFSS** — bauen, **nicht neu erfinden**. Cursors 4-Slice-Plan damit anreichern.

> ⚠️ **Diese Runde = INTERNES Tool zuerst** (Cert-Expert nutzt es selbst: viele Kunden, Pools, Massenarbeit). **NICHT** das Kundenportal-V1. Gut: Der DFSS-MVP war ohnehin „intern zuerst, Kundensicht später" entworfen (MVP_SCOPE_BOUNDARY: kein SaaS/kein Portal; FUNCTIONAL_DESIGN: interne Nutzung im MVP). **Modus „Kunde"/Portal = Phase 2, jetzt nicht bauen.**

## Existierende Spec-Docs ZUERST lesen (OneDrive `QM/Strategie/` + `…/DFFS/`)
- `DFFS/TOOL_2_EMPLOYEE_FILE_FUNCTIONAL_DESIGN_V1` — fachliches Funktionsbild (Hauptquelle)
- `EMPLOYEE_FILE_READINESS_RULES_V1` — Ampel-/Readiness-Regeln (MVP-Regelsatz)
- `EMPLOYEE_FILE_WORKSPACE_STRUCTURE_V1_1` — die 9 Bereiche der Akte + Generator
- `DFFS/CERT_EXPERT_MVP_SCOPE_BOUNDARY_V1` — was rein/raus
- `EMPLOYEE_FILE_GENERATOR_REQUIREMENTS_V1`, `TOOL_2_EMPLOYEE_FILE_REQUIREMENTS_V1`, `DFFS/TOOL_2_EMPLOYEE_FILE_DEVELOPER_BACKLOG`/`…DEVELOPER_HANDOVER_BRIEF`/`…BUILD_SCAFFOLD_AND_MODULE_BOUNDARY`
- Norm-Logik: `knowledge/NORM_MATRIX_Mitarbeiternachweise_v2.md` · Traceability: `knowledge/NORM_KLAUSEL_REGISTER_v1.md`

## Leitprinzipien (dürfen NICHT verloren gehen)
1. **Requirement → Evidence → Readiness.** Status entsteht aus Rolle + Nachweis + Zusatzrolle + SDL/Projekt + fachlicher Prüfung. Kein Freigabestatus ohne nachvollziehbaren Bezug.
2. **Ampel** Grün/Gelb/Rot/Grau, Hierarchie **Rot > Gelb > Grün**, Grau nur wenn nicht relevant. Fachlich, nicht dekorativ.
3. **Pools:** SMA-Grundfreigabe · DIN-77200-1 · SDL-Pools · DIN-77200-2-Zusatzpools · Projektfreigaben.
4. **Mitarbeiterakten-Generator = Kernbaustein:** erzeugt vorausgefüllte Standard-Personalakte **und markiert fehlende Nachweise**. Keine freie Schulungs-/Zertifikatserstellung. Keine ungeprüfte Zert-/Einsatzfreigabe-Behauptung (CROSS-CONTROL-05).
5. **MVP = intern, bestehende Kunden auditfähig & wiederkehrend betreubar** — kein Portal, kein SaaS, kein LMS, keine volle Norm-Detailmatrix (Phase 2).

## Marks Modifikation (jetzt einplanen)
- **Generator-Output direkt in die Mitarbeiterakte** (Bereich Nachweise/Uploads des aktiven Kunden-Pools) — **kein manueller Download → Einsortieren**.
- **Physische Ablage:** OneDrive `Clients/{Kunde}/08_Generated/` (FSA API „Ordner merken"; Voll-Automatik = späteres Mini-Tool/HQ-Skript).

## Mapping auf Cursors 4 Slices
- **A Shell:** `/intern` Zentrale + Kunden-Switcher + Tabs (Tool 1 / Tool 2 / Einstellungen). ✔ wie geplant.
- **B Multi-Kunde-Speicher:** Kunde → Pool → Employees; Stammdaten persistent. **Slugs = `hq/03_Kundenprojekte/_registry.json`.**
- **C UX glatt:** Pool-first **+ Readiness/Ampel/Pools aus READINESS_RULES** (Akte = einklappbare Qualitätsansicht behalten, da steckt die Norm-Logik). Generator als Bereich 3.
- **D HQ + Export:** Deep-Links HQ↔OS; **Export direkt in Akte + OneDrive `Clients/{Kunde}/08_Generated/`** (Marks Modifikation).

## Bewusst NICHT jetzt
Kundenportal · volle DIN-77200-2-Detailmatrix-Verdrahtung · Server-Backend · LMS · Preise.
