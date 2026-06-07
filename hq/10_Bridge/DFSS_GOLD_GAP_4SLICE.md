# DFSS-Gold vs. 4-Slice — Lückenabgleich (Code-Track)

**Stand:** 2026-06-07 · **Autor:** Claude (Code-Track) · **Für:** Mark + Cursor
**Frage:** Trägt Cursors 4-Slice-Plan („Interne Zentrale") das DFSS-Gold vollständig, oder fällt beim Bau etwas weg?
**Quelle des Golds:** Repo-Controls `cert-expert-certification-os/docs/03-controls/` (B5/B6/B7 — das ins OS übersetzte DFSS-Design, zitiert die DFSS-Gates) + `TOOL2_FAHRPLAN_DFSS.md` + Code-Stand (Commit `b63043e`). Autoritative `.docx` liegen in OneDrive `QM/Strategie/(DFFS/)` (nicht bash-zugänglich) — bei Bedarf gegenprüfbar.

---

## Kurz-Verdict

**Das Gold ist vollständig DESIGNT, aber fast nichts ist GEBAUT.** Von 6 Kernfähigkeiten ist nur **EC-09 / Generator-ZIP live verdrahtet**. Datenmodell, Requirement-Engine, Readiness/Ampel-Evaluator, Pools/SDL/Projekt-Persistenz, Multi-Company, Evidence-Check-Workflow sind als **statische Read-only-Shells** vorhanden („computed at render", „no persistence", „Not evaluated/Not implemented").

**Der 4-Slice-Plan nennt das Gold (Slice C verweist auf `READINESS_RULES` + Pools), aber er ist als Shell/UX/Speicher/Export gerahmt.** Damit besteht genau Marks Risiko: Es entsteht ein **hübscheres Interim-Tool ohne die Gold-Engine**. „Slice C UX glatt" klingt kosmetisch — die Readiness-/Pool-Logik ist aber der eigentliche Wert.

→ **Empfehlung:** Die 4 Slices nicht ersetzen, sondern um **vier explizite Engine-Bausteine** ergänzen, jeweils mit Definition-of-Done. Sonst werden sie als „später" durchgereicht.

---

## Die 4 Gold-Engines (designt, nicht gebaut) — dürfen nicht wegfallen

1. **Persistente Mitarbeiterakte-Entität + per-file Company-Relation.** Heute: nur `localStorage`-Queue + `Employee`-Typ, eine Firma über Session-Globals. Gold (B5.2/B5.3 §4): Akte = „unit of work", **eine Company-Relation pro Akte** (nicht Batch-Sidebar). Voraussetzung für alles Weitere. (EC-01, CF-08/CF-10)
2. **Requirement-Engine:** Grundrolle × Zusatzrolle × SDL × Projekt → Pflichtfelder/Evidence/Offene-Punkte. Heute: nur Heuristik-Stub in `employee-file-requirements.ts` (B8.2), bewusst „FROZEN FOR B8.3". (B5.3 §9)
3. **Readiness-/Ampel-Evaluator:** Grün/Gelb/Rot/Grau mit Hierarchie **Rot > Gelb > Grün**, Rot-Blocker-Katalog, **scoped** („Ready for what?"). Heute: 0 % Logik, **nur Grau** live. (B5.4 §5/§6, CF-09)
4. **Evidence-Upload + Check/Accept-Workflow** (EC-03) und **Generator-Subordination** (Output-History, `generated unchecked`-Verknüpfung) unter EC-09-Schutz. Heute: Upload/History fehlen, Generator = Legacy-Batch über Queue. (CF-07/CF-08)

**Querschnitt (designt, komplett ungebaut):** Negativtests **N-01–N-07** + Forbidden-Wording-Kontrolle (C-01/C-05/C-06, **EC-10**: keine automatische Freigabe-/Auditfähigkeitsaussage). Müssen je Slice mitgeliefert werden.

---

## Slice-für-Slice: Fahrplan vs. Gold vs. Lücke

| Slice | Fahrplan sagt | Gold verlangt zusätzlich | Lücke / Risiko |
|-------|---------------|--------------------------|----------------|
| **A — Shell** | `/intern` + Kunden-Switcher + Tabs | IA/Workspace A–G + Profil-Sektionen (Summary, Stammdaten, Beschäftigung, Rollen, Nachweise, Unterweisungen, SDL/Projekt, Generator, Offene Punkte) (B6.1) | Reine Tab-Shell unterschlägt die **9 Profil-Sektionen** als Zielnavigation. Klein halten ok, aber Sektions-Gerüst als Ziel festschreiben. |
| **B — Multi-Kunde-Speicher** | Kunde → Pool → Employees; Stammdaten persistent; Slugs aus `_registry.json` | **Engine 1:** echte persistente Akte-Entität **+ per-file Company-Relation** statt Session-Global-Firma | **Größte Lücke.** „Stammdaten persistent" ≠ Akte-Objektmodell. Ohne diese Basis hängen Engines 2–4 in der Luft. |
| **C — UX glatt** | Pool-first + Readiness/Ampel/Pools aus `READINESS_RULES`; Akte als einklappbare Qualitätsansicht | **Engine 2 + 3:** Requirement-Ableitung **und** Ampel-Evaluator (Rot-Blocker, scoped Aggregation) — als **Logik**, nicht Anzeige | „UX glatt" framed das Gold als Kosmetik. **Hier muss die eigentliche Engine rein**, sonst bleibt es bei Grau-Badges. |
| **D — HQ + Export** | Deep-Links HQ↔OS; Export in Akte + OneDrive `Clients/{Kunde}/08_Generated/` | **Engine 4 (Teil):** Generator-Output als `generated unchecked` **in die Akte** verknüpfen (Subordination), nicht nur Datei ablegen | Export-Ablage ok; aber Output muss in den Evidence-/Readiness-Status einfließen (CF-07), sonst „ZIP = fertig"-Trugschluss (verletzt EC-10/D-9). |

---

## In-MVP vs. Phase 2 — NICHT über-bauen (DFSS-Grenze halten)

Das Gold selbst zieht die Grenze (MVP_SCOPE_BOUNDARY / Fahrplan) — bewusst beachten, damit wir nicht overengineeren:

- **In dieser Runde (intern):** Akte-Entität, per-file Company, Requirement-Ableitung (Rolle/Overlay/Geltungsbereich), Readiness/Ampel-Evaluator, Evidence-Check, Generator-in-Akte, Negativtests.
- **Bewusst Phase 2 / NICHT jetzt:** Kundenportal/SaaS, **volle DIN-77200-2-Detailmatrix-Verdrahtung** (= die Norm-Matrix-Werte 16/24/40/64 UE aus `NORM_MATRIX_…v1.md`; offene Prüfpunkte + Experten-Review pflicht, CROSS-CONTROL-05), LMS/Schulungskalender, Server-Backend, Preise.

→ Die Readiness-**Mechanik** ist In-MVP; die Norm-**Detailwerte** bleiben Phase 2. Engine bauen, Matrix-Werte später einhängen (eine Quelle: `NORM_MATRIX_…v1.md`).

---

## QFD-Priorisierung — welche Oberfläche zuerst (frühe DFSS-Phasen, 2026-06-07 nachgezogen)

Quelle: VOC, CTS-Tree, KANO, **QFD House of Quality**, Traceability-Matrix (OneDrive `DFFS/`, alle 6 gelesen). Traceability ist **lückenlos** (TM-01…TM-24, jeder VOC-Punkt → HOW → Design Requirement → Reverse-Constraint) — die B5/B6/B7-Engines driften also nicht vom Kundenwert ab.

**Kernerkenntnis:** Der Kunde kauft **nicht Dokumente, sondern sichtbare Zertifizierungsfähigkeit + Entlastung**. Die QFD-Gewichtung sagt eindeutig, welche *Oberfläche* das liefert (Top nach gewichtetem Score):

| Rang | Design-Merkmal (HOW) | Score | KANO | Bezug zu unseren 4 Engines |
|------|----------------------|-------|------|-----------------------------|
| 1 | **Status-/Risiko-/Nächste-Schritte-Ansicht (Dashboard)** | **767** | Leistung | = die *sichtbare Seite* von Engine 3 (Readiness) — der wichtigste Einstieg überhaupt |
| 2 | **Kritische Nachweismatrix + Auditfreigabe-Logik** | 504 | **Basis (S0)** | = Engine 2 (Requirement) + Engine 3 (Rot-Blocker) |
| 3 | ZKM-Maßnahmenlogik (Quelle/Frist/Wirksamkeit) | 423 | Basis (S0) | über Tool-2-Scope hinaus → Phase 2 / eigener Baustein |
| 4 | **Audit-Readiness-Status Unternehmen/SDL/Mitarbeiter** | 384 | Leistung | = Engine 3 über Ebenen (braucht Engine 1 Multi-Company) |
| 5 | **SDL-/Objektakte-Mindeststruktur** | 339 | Basis (S0) | = Engine 2 Kontext (SDL/Projekt) |
| 8 | Mitarbeiter-/SDL-Freigabestatus + Qualifikation | 264 | Basis (S0) | = Engine 2+3 auf Personenebene (Tool-2-Kern) |

**Das ist die Brücke „abstrakt → Oberfläche":** Die 4 Engines aus dem Lückenabgleich sind das Fundament — aber der **#1-Kundenwert ist die Status-/Nächste-Schritte-Ansicht (H21, Score 767)**, die auf diesem Fundament sitzt. Ohne echte Engines bleibt sie grau/leer; mit ihnen wird sie die Oberfläche, „mit der man arbeitet".

**KANO-Leitplanken (nicht verletzen):** Begeisterung später (LMS, voller KI-Agent, Netzwerk, Benchmarking = **nicht** 2026-MVP). Reverse-Faktoren aktiv vermeiden: **keine Normsprache als Kundenaufgabe**, keine Überkomplexität/zu viele Pflichtfelder, **keine ungeprüfte Automatisierung** (Experten-Review-Gate pflicht). Done-for-you + Dashboard-Transparenz sind inzwischen **Leistungs-/Basis**faktoren, nicht Delighter.

---

## Empfehlung an Cursor (Build-Reihenfolge)

1. **B zuerst, nicht A:** Akte-Entität + per-file Company als Fundament (Engine 1).
2. **C = Engine, nicht UX:** Requirement-Ableitung + Ampel-Evaluator als Logik (Engine 2+3), Akte-Qualitätsansicht behalten.
3. **D:** Generator-Output in die Akte subordinieren + OneDrive-Ablage (Engine 4).
4. **A** parallel als Hülle, aber Ziel-Navigation = 9 Sektionen.
5. **Jeder Slice:** EC-09-Smoke + N-01–N-07-Negativtests + Forbidden-Wording-Check (EC-10).
6. **Sichtbarer Payoff = Status-/Nächste-Schritte-Ansicht (QFD H21, Score 767):** sobald Engine 2+3 echt sind, als erste Kunden-/Nutzeroberfläche bauen — pro Mitarbeiter und pro Kunde „Was fehlt, was ist der nächste Schritt, wer ist dran". Das ist die Oberfläche, mit der man arbeitet.

**Offene Entscheidung für Mark:** Soll ich daraus die verbindliche **Build-Contract-Checkliste** (Definition-of-Done je Slice) für Cursor schreiben? (war Option B)
