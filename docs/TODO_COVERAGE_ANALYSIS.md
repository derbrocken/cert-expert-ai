# TODO Coverage Analysis — Phase 2

**Stand:** 2026-06-03  
**Quelle:** `hq/` auf Branch `cursor/din-77200-1-anforderungsprofile`  
**Import:** Master Dump + Operations Board (03.06.2026)

Legende: ✅ erfasst mit konkreten To-dos/Terminen · 🟡 nur erwähnt / Stub · ❌ fehlt oder nicht auffindbar

---

## A) Kundenprojekte

| Thema | Status | Wo / Anmerkung |
|-------|--------|----------------|
| TeamFlex | ✅ | Ordner + 9 strukturierte To-dos, Audit 12.06. in `ToDos.md` |
| Wolf Street | ✅ | Ordner + 8 To-dos, Audit 16.06. in `ToDos.md` |
| SecuGuard | ✅ | Ordner + NC-To-dos, Frist 30.06. |
| Schutzritter | ✅ | Ordner + 8 To-dos, Audit **26.06.** in `ToDos.md` + `Audit_2026.md` |
| Checkpoint Regional | ✅ | Ordner + 4 To-dos (Unbedenklichkeit, Upload, DEKRA, Termin) |
| ZT Security | 🟡 | Ordner + 1 To-do (Scope); **kein Audittermin 08.07.** |
| LC | ✅ | `LC_Security` — To-dos + Forderung verknüpft |
| AFAS | 🟡 | Als **„AVAS“** in `05_Forderungen/Offene_Juni_2026.md` (TODO ford01) — **kein** Kundenordner, Schreibweise prüfen |
| Faust | 🟡 | Forderung 1.500 € in `05_Forderungen/` — **kein** Kundenordner |
| Dennis Kontakt | 🟡 | `04_Vertrieb/Angebote_Juni_2026.md` (TODO vert03 Referral) — kein Kundenordner |

**Registry** (`_registry.json`): 7 aktive Kunden — **ohne** AFAS/Faust/Dennis.

**Zusatz:** Miras Protect nur als Vertriebs-To-do (vert04), kein HQ-Kundenordner (laut Master Dump Absicht).

---

## B) Überwachungsaudits

| Termin | Status | Wo / Anmerkung |
|--------|--------|----------------|
| TeamFlex 12.06 | ✅ | `TeamFlex/ToDos.md` Header + Operations Board Welle 1 |
| Wolf Street 16.06 | ✅ | `Wolf_Street/ToDos.md` + Operations Board |
| Wolf Street 17.07 | ❌ | Nicht in HQ-Dateien gefunden (nur 16.06. dokumentiert) |
| ZT Security 08.07 | ❌ | Nicht dokumentiert; nur „Surveillance audit / Scope“ ohne Datum |

**Lücke:** `Audit_2026.md` bei TeamFlex, Wolf Street, ZT (und den meisten anderen) noch **Template** — Termine stehen primär in `ToDos.md`, nicht in der Audit-Datei.

SecuGuard: Überwachung/Frist **30.06.** in ToDos, nicht als klassisches Audit-Datum.

---

## C) Erstzertifizierungen

| Projekt | Status | Anmerkung |
|---------|--------|-----------|
| Schutzritter | 🟡 | Viele Erstzert-Themen (SK, EK, Formulare, 26.06.) — Label **„Erstzertifizierung“** fehlt |
| Checkpoint Regional | 🟡 | To-dos passen zu Erstzert (Unbedenklichkeit, DEKRA, Audittermin cr04) — nicht explizit benannt |

---

## D) Offene Forderungen

| Thema | Status | Wo |
|-------|--------|-----|
| AFAS | 🟡 | **AVAS** — `05_Forderungen/Offene_Juni_2026.md` TODO-20260603-ford01 |
| Faust | ✅ | TODO-20260603-ford02 (1.500 €) |
| LC | ✅ | TODO-20260603-ford03 + Kundenprojekt LC_Security |

---

## E) Software

| Thema | Status | Wo |
|-------|--------|-----|
| Hetzner Ticket | ✅ | `06_Software/Software_Backlog_Juni_2026.md` sw02 (Migration, Passwort, Support) |
| Tool-2 Bugs | ✅ | sw01 |
| Architekturprobleme | ✅ | sw03 (+ Verweis Certification OS) |
| Employee Generator | 🟡 | Nur in Master-Dump-Zeile erwähnt, **kein** eigenes TODO-Sw-Item |

---

## F) DFSS

| Thema | Status | Wo |
|-------|--------|-----|
| Validierung historischer Projektdaten | 🟡 | Master Dump + dfss01 „Pilot Measurement“ — nicht als Historik-Validierung ausformuliert |
| Anforderungen Softwareprojekt | ❌ | `07_DFSS/README.md` nur Platzhalter; keine Requirements-Datei |

---

## G) Strategie

| Thema | Status | Wo |
|-------|--------|-----|
| Website | ✅ | `Cert-Expert_Intern_Juni_2026.md` int02 |
| Steuerberater CH-DE | 🟡 | Nur unter **„Geparkt“** in Operations Board (Privat/Querschnitt) |
| Preisstrategie | ✅ | int05 |
| Salesstrategie | 🟡 | Operations Board „Geparkt“ — Vertrieb (Branchenverbände, Wettbewerb) |
| Lieferantenliste | ❌ | Nicht als To-do oder Abschnitt |
| Social Media | 🟡 | Geparkt im Operations Board |
| Fotoshooting | 🟡 | Geparkt (Privat-Hinweis) + Master Dump |

---

## H) Persönliche Themen

| Thema | Status | Wo |
|-------|--------|-----|
| Finanzen | 🟡 | „Finanzplanung“ nur geparkt im Operations Board |
| Wohnung | 🟡 | Geparkt |
| Apple Headset | 🟡 | Geparkt |
| Schlafzimmer | ❌ | Nicht gefunden |
| Coworking Schweiz | ❌ | Nicht gefunden |

**Hinweis:** Bewusste Policy im Operations Board: *„Privat nicht in HQ-ToDos“* — nur Referenz unter Geparkt.

---

## Master-Dump vs. operative Übernahme

| Bereich | Dump erfasst? | In operative HQ-Dateien überführt? |
|---------|---------------|----------------------------------|
| Kunden 7/7 Registry | ✅ Tabelle | ✅ To-dos für Welle 1/2 |
| Forderungen | ✅ | ✅ 3 TODOs |
| Software | ✅ | ✅ Backlog (5 Items) |
| DFSS | ✅ | 🟡 1 Pilot-TODO |
| Strategie / OS | ✅ | 🟡 Teilweise intern, Rest geparkt |
| Karriere / Privat | ✅ | 🟡 Nur geparkt, nicht aufgesplittet |
| Miras Protect | ✅ | 🟡 Vertrieb only |
| AVAS/AFAS Schreibweise | ✅ als AVAS | 🟡 Klärung nötig |

**Dedup-Checkliste** aus Master Dump (offen):

- [ ] Miras Protect: Kundenordner vs. Vertrieb
- [ ] Dump vs. Operations Board deduplizieren
- [ ] Erledigtes nach `09_Archiv/`

---

## Gesamtbewertung Phase 2

| Kategorie | Abdeckung |
|-----------|-----------|
| A Kundenprojekte | **7/10** voll als Ordner; 3 nur Querschnitt/Forderung/Vertrieb |
| B Überwachungsaudits | **2/4** Termine vollständig; 2 fehlende Daten |
| C Erstzertifizierungen | **inhaltlich** teils da, **label** fehlt |
| D Forderungen | **3/3** als TODOs (AFAS-Naming prüfen) |
| E Software | **3/4** explizit; Employee Generator nur Dump |
| F DFSS | **schwach** — Pilot only |
| G Strategie | **gemischt** — Kern teils intern, viel geparkt |
| H Persönlich | **bewusst zurückgestellt** |

**Kernbefund:** Operative **Audit-Welle 1** (TeamFlex, Wolf Street, SecuGuard) und **Schutzritter 26.06.** sind gut in strukturierte To-dos überführt. Lücken: **ZT 08.07., Wolf 17.07., AFAS-Kundenordner, DFSS-Softwareanforderungen, Erstzert-Label, Graph-relevante Verknüpfung**, sowie **Merge von `hq/` nach `main`**.
