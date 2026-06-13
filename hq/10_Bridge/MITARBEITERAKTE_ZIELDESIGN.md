# Mitarbeiterakte — Zieldesign (sauber, vertikal) + Ist→Soll + Umbaupfad

> **Rolle:** Planer (Spur P) — **kein Code**. Design-Gate (C-10). Grundlage: Marks Befund (2026-06-13) „Akte aus Tool-2-Generator-Queue gewachsen statt sauber" + Code-Lesung + die Original-IA `docs/03-controls/B6_1…`–`B6_7…`.
> **Stand:** 2026-06-13. **Status: ENTWURF → wartet auf Mark-Abnahme.** Erst danach bauen wir gegated, Slice für Slice.

---

## 0. Warum dieses Dokument

Das saubere vertikale Akte-Design **existiert** (B6.1 IA + B6.2 Profil-Sektionen + B6.3 Evidence + B6.4 Rollen/SDL + B6.5 Ampel + B6.6 Generator-Output). Es wurde **vor** der Implementierung geschrieben (Akte war damals noch eine `localStorage`-Generator-Queue). Danach wurde **viel gebaut** (DB-Persistenz, Evidence-Upload, Training-Plan, Requirement-Engine, Audit-Export) — aber **teils am Design vorbei**, weil jeder Slice an die bestehende Queue-Mechanik „drangeflanscht" wurde.

**Folge (Marks „passt nicht"):** Es gibt heute **drei überlappende Sichten auf dieselbe Person**, die Akte hat **kein sichtbares Rückgrat** (Lebenszyklus), „Prüfung" ist **verstreut**, und „Audit" ist ein **Export-Anhängsel** statt integriert.

Dieses Doc definiert: **das Rückgrat (Lebenszyklus) · Ist→Soll · was bleibt/was Chaos ist · EC-09-sicherer Umbaupfad.**

---

## 1. Das Rückgrat — SMA-Lebenszyklus (vertikal)

Die Akte ist EIN Objekt mit EINEM klaren Verlauf von oben nach unten:

```
  ① ANLEGEN ───────────────────────────────────────────────┐
     ├─ manuell (in der Akte ausfüllen)                     │
     └─ Überführung aus Tally vGNvY0 (Webhook → Akte)       │
                                                            ▼
  ② STAMMDATEN & ROLLEN  (wer? Grund­rolle/Norm-Klasse EK/FK,
     Beschäftigungsart, Bestellungen, Geltungsbereich/SDL)
                                                            ▼
  ③ AUSRECHNUNG (automatisch)  Requirement-Engine →
     Pflicht-Set + Soll-UE + Fristen (jede Regel CL-belegt)
     + Schulungs-/Terminplan (Soll−Ist-Lücken)
                                                            ▼
  ④ PRÜFUNG (menschlich, EC-10)  je Nachweis „geprüft" →
     Akte-Status: offen → bereit zur Überprüfung → geprüft
                                                            ▼
  ⑤ AUDIT  integrierter Audit-Blick + Export (XLSX/PDF)
     + (später) Projektordner-/Freigabe-Anbindung
```

**Jede Phase ist eine Sektion in EINER Akte-Ansicht** — kein Wechsel zwischen drei Views. Die Person „wandert" sichtbar durch die Phasen (Status-Band oben).

---

## 2. Ist → Soll (ehrlich)

| Lebenszyklus | Heute (Ist) — wo im Code | Bewertung |
|--------------|---------------------------|-----------|
| ① Anlegen (manuell) | `EmployeeForm.tsx` (**68 KB**) — vermengt Stammdaten + Rollen + Doc-Auswahl in EINEM Riesen-Formular | ⚠️ **Chaos** — zu groß, vermischt Phase ②+⑤ |
| ① Anlegen (Tally) | `tally-intake-service.ts` (`vGNvY0`) → EmployeeFile + Evidence | ✅ **behalten** (funktioniert) |
| Übersicht/Index | `EmployeeFileOverview.tsx` (read-only) **+** `EmployeeFileDossierView.tsx` (Sektionen) **+** `EmployeeForm.tsx` | 🔴 **Kern-Chaos: 3 Sichten auf 1 Person** |
| ② Stammdaten & Rollen | in `EmployeeForm` + Sektionen in `DossierView` (Person&Rolle, Geltungsbereich) | 🟡 teils gut (DossierView ist schon vertikal), aber doppelt zum Formular |
| ③ Ausrechnung | `requirement-engine.ts` (37 Tests), `employee-file-requirements.ts`, `training-plan.ts` (22 Tests) | ✅ **solide — behalten, nicht anfassen** |
| ④ Prüfung | `evidenceChecks`-Toggle verstreut in `EvidenceRow` + `TrainingPlan`; kein zentraler Prüf-Schritt | ⚠️ **fehlt als Schritt** (Logik da, aber nicht gebündelt) |
| ⑤ Audit | `audit-export-xlsx.ts` / `audit-export-pdf.ts` (Batch-Download) | ⚠️ **Anhängsel** — kein integrierter Audit-Blick/Status-Gate; kein Projektordner-Link |

**Single Source der Berechnung** ist sauber: `getEmployeeFileSummary(...)` speist Overview, Dossier UND Audit-Export. Das ist gut — darauf bauen wir.

---

## 3. Das Chaos konkret benannt

1. **Drei Sichten auf eine Person** (Overview ↔ DossierView ↔ EmployeeForm). Der Operator weiß nie, „wo" die Akte ist. → Soll: **EINE Akte-Ansicht**, Overview nur noch **Index**.
2. **Riesen-Formular** (`EmployeeForm`, 68 KB) als separater Modus statt als Sektionen der Akte. → Soll: in die Akte-Sektionen **aufgehen** lassen, inline editierbar.
3. **Kein Lebenszyklus sichtbar** — man sieht nicht, ob eine Person „angelegt", „durchgerechnet", „geprüft" oder „audit-fertig" ist. → Soll: **Status-Band** oben.
4. **Prüfung verstreut** — „geprüft"-Klicks an drei Stellen, kein Akte-Gesamt-Prüfstatus als Schritt. → Soll: **Prüf-Sektion** bündelt alles (EC-10, kein Auto-Grün).
5. **Audit = Export** statt integrierter Schritt mit Anbindung an Projektordner/Freigabe. → Soll: **Audit-Sektion** in der Akte.

---

## 4. Zielbild — EINE vertikale Akte

```
/employee-automation
  ┌─────────────────────────────────────────────┐
  │ AREA A — Mitarbeiter-INDEX (nur Liste)       │   ← Overview wird reiner Index
  │  Name · Rolle · Status · offene Punkte       │
  └───────────────┬─────────────────────────────┘
                  │ Klick / „Neu" → öffnet EINE Akte
                  ▼
  ┌─────────────────────────────────────────────┐
  │ AKTE — Statusband (① anlegen → ⑤ audit)      │   ← zeigt Phase
  ├─────────────────────────────────────────────┤
  │ § Stammdaten        (②)  inline editierbar    │
  │ § Rollen & SDL      (②)  Norm-Klasse, Bestell.│
  │ § Pflicht-Set       (③)  abgeleitet, CL-belegt│
  │ § Schulung/Termine  (③)  Soll−Ist, Plan       │
  │ § Nachweise & PRÜFUNG (④) Upload + geprüft     │   ← Prüfung als klarer Schritt
  │ § Dokumente & Pakete (⑤) Doc-Auswahl + ZIP    │   ← Generator-Output, EC-09
  │ § AUDIT             (⑤)  Audit-Blick + Export  │   ← integriert, + Projektordner (später)
  │ § Offene Punkte / Notizen                     │
  └─────────────────────────────────────────────┘
```

**Was die Akte leistet (deine Worte, sortiert):**
- **Anlegen** der SMA (manuell **und** Überführung aus Tally) → EINE Akte.
- **Automatische Ausrechnung** (Pflicht-Set, Soll-UE, Fristen) — schon da, bleibt.
- **Sinnvolle Prüfung** — neu als klarer Schritt gebündelt.
- **Audit-Technik** — neu integriert (statt nur Export).

---

## 5. Was NICHT angefasst wird (Guardrails)

- **EC-09:** Der ZIP-Generator (`generate-employee-docs.ts`) + Doc-Auswahl-Pipeline bleiben funktional unberührt; vor/nach jedem Slice ZIP-Smoke grün.
- **EC-10:** Keine Auto-Freigabe/-Auditfähigkeit; eingehende Nachweise `unchecked`; „geprüft"/„audit" nur menschlich.
- **Engine/Norm:** `requirement-engine.ts` + UE-Werte + CL-IDs **nicht** verändern (reiner IA-/Anzeige-/Bündelungs-Umbau). Keine erfundene Normpflicht.
- Der Umbau ist **Re-Organisation bestehender Bausteine**, kein Neuschreiben der Logik.

---

## 6. EC-09-sicherer Umbaupfad (kleine Slices, je gegated)

| Slice | Inhalt | Risiko | EC-09 |
|-------|--------|--------|-------|
| **S0** | **Dieses Zieldesign abnehmen** (Mark-Gate) | — | — |
| **S1** | **Eine Akte-Ansicht:** Overview = reiner Index; ein Klick → DossierView als „Heimat" der Person; das Riesen-`EmployeeForm` schrittweise in die Sektionen integrieren (inline). Reine IA/Navigation. | mittel | Generator/ZIP unberührt, Smoke |
| **S2** | **Status-Band** (Lebenszyklus ①–⑤) oben in der Akte — reine Anzeige aus `getEmployeeFileSummary`. | gering | n/a |
| **S3** | **Prüf-Sektion:** alle „geprüft"-Toggles + Akte-Prüfstatus bündeln (EC-10). Nutzt vorhandene `evidenceChecks`. | gering | n/a |
| **S4** | **Audit-Sektion** in der Akte (statt nur Batch-Export); Export bleibt. Vorbereitung Projektordner-/Freigabe-Link. | gering | n/a |
| **S5** | (optional) Create-Flow vereinheitlichen: „Neue Person" → leere Akte inline ausfüllen, `EmployeeForm` final abschmelzen. | mittel | Smoke |

Jeder Slice: `tsc` 0 · Suite grün · `next build` grün · **EC-09-ZIP-Smoke** · Mark-Abnahme. Reihenfolge so, dass der größte sichtbare Nutzen (eine Ansicht + Statusband + Prüfung) früh kommt.

---

## 7. Offene Entscheidungen für Mark

- **DA1 — Create-Flow:** „Neue Person" → **leere Akte inline ausfüllen** (Empfehlung, killt das Riesen-Formular) ODER weiter ein separates Anlege-Formular?
- **DA2 — Doc-Auswahl:** eigene Sektion „Dokumente & Pakete" (③/⑤), **getrennt** von „Rollen" (Empfehlung, B6.1 §6)? 
- **DA3 — Audit-Tiefe jetzt:** Audit-Sektion **schon jetzt** integrieren ODER erst **nach** der Projektakte (weil Freigabe/Projektordner dranhängt)?
- **DA4 — Reihenfolge:** Empfehlung S1→S2→S3 zuerst (eine Ansicht + Statusband + Prüfung = sofort spürbar), S4/S5 danach. Einverstanden?

> **→ Mark:** Zieldesign so ok? DA1–DA4 entscheiden → dann baue ich S1 als ersten gegateten Slice (kein EC-09-Risiko, Engine unberührt).
