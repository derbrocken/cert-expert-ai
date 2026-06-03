# HQ Assistant — Gap Analysis (Operations Assistant)

**Stand:** 2026-06-03  
**Scope:** Vorhandener HQ Assistant (`bots/00_hq_assistant/`, `hq/scripts/build_dashboard.py`) — **keine** neue Architektur, keine Telegram-Implementierung, keine neuen Bots.

**Zielbild:** Von „Dateileser + To-do-Liste“ zu **Management- und Steuerungsantworten** (Blocker, Wartestatus, kritischer Pfad, Portfolio-Fragen).

---

## 1. Was der Assistant heute technisch kann

| Fähigkeit | Mechanismus | Grenze |
|-----------|-------------|--------|
| HQ-Dateien lesen | `hq_context.build_context_pack()` lädt Markdown | Max. ~90k Zeichen Kontext; nicht alle 7 Kunden gleichzeitig voll |
| Kunde erkennen | Alias-Tabelle in `_registry.json` + Regex | Querschnitt ohne Kundennamen → nur Briefing/Board |
| Fragen beantworten | LM Studio + `SYSTEM_PROMPT` + Kontext | Synthese qualitativ gut, **keine garantierte Vollständigkeit** |
| To-dos schreiben | `hq_todos.py` → `ToDos.md` / Querschnitt | Schema vorhanden; Steuerungsfelder fehlen |
| Briefing | `build_dashboard.py` (separat) | Aggregiert Ampel, Fristen (14 Tage), urgent — **wird vom Assistant nicht automatisch als Logik genutzt** |

**Kernlücke:** Der Assistant **parst HQ nicht strukturiert**. Er **lädt Text** und lässt das LLM interpretieren. Für Portfolio-Fragen („alle blockierten Kunden“) fehlt eine **vorberechnete Operations-Sicht** oder Query-Routing.

---

## 2. Management-Dimensionen vs. Datenlage

| Frage (Management) | In HQ vorhanden? | Wo? | Assistant heute |
|--------------------|------------------|-----|-----------------|
| Wer ist verantwortlich? | ⚠️ Feld existiert, **Inhalt leer** | ToDos: `Verantwortlich: (unassigned)` überall | ❌ Kann nur „unassigned“ sagen |
| Worauf warten wir? | ⚠️ **Prosa**, kein Standardfeld | Status-Blocker, Tabellen („wartet auf Kunde“), ToDo-Text | ⚠️ Teilweise aus Text ableitbar |
| Was blockiert? | ✅ Narrativ stark | `Status.md` → `**Blocker:**` (7/7 Kunden) | ✅ Pro Kunde gut, wenn `Status.md` geladen |
| Kritischer Pfad? | ⚠️ **uneinheitlich** | Schutzritter/Checkpoint `Audit_2026.md` + Tabellen; TeamFlex/Wolf narrative Listen | ⚠️ Abhängig von Datei-Tiefe |
| Nächste Aktion? | ⚠️ **doppelt** | Status „Nächste Schritte“ + ToDo `Nächster Schritt` | ⚠️ Liste statt eine klare Aktion |
| Projektstatus / Ampel | ✅ | `Status.md` → Ampel 🔴🟡🟢 | ✅ Über Briefing-Radar oder Status |
| Letzte Aktivität | ⚠️ | `Stand:`, `Letzte Kommunikation`, `Erstellt` in ToDos | ⚠️ Kein einheitliches Feld pro Projekt |

---

## 3. Die 10 Abfragen — Bewertung

Legende: **✅** zuverlässig heute · **⚠️** brauchbar aber lückenhaft · **❌** nicht zuverlässig

| # | Abfrage | Status | Begründung |
|---|---------|--------|------------|
| 1 | Welche Kunden sind aktuell **blockiert**? | ⚠️ | `**Blocker:**` in allen `Status.md` — semantisch ja, aber kein `blocked: true/false`. LLM muss alle Status lesen; Kontextpack lädt nicht automatisch alle 7. |
| 2 | Welche Projekte **warten auf Kunden**? | ⚠️ | Nur ~4 explizite „wartet auf Kunde“-Stellen (Checkpoint, TeamFlex-Blocker, Schutzritter-Audit-Pfad). Rest implizit („vom Kunden einholen“). Kein Feld `Wartet auf: Kunde`. |
| 3 | Welche Projekte **warten auf DEKRA**? | ⚠️ | DEKRA in TeamFlex/Wolf/Checkpoint (Ordner, Angebot, Termine) — **Freitext**. Keine maschinenlesbare DEKRA-Warteschlange. |
| 4 | Welche Projekte **warten auf Auditoren**? | ⚠️ | ELC explizit (Auditor-Bestätigung); Wolf/TeamFlex Auditor **Termin**, nicht Wartestatus. Kein Portfolio-Filter. |
| 5 | Audits in den **nächsten 30 Tagen**? | ⚠️ | Termine in `Status.md` / `Audit_2026.md`; Briefing nur **14 Tage**. Schutzritter 26.06. in Ampel, nicht immer in gleicher Parser-Section wie TeamFlex. |
| 6 | Welche Aufgaben sind **überfällig**? | ⚠️ | ToDos haben `Frist:` (ISO); `build_dashboard` kann vergleichen — **Assistant nutzt das nicht**. LLM sieht nur geladenen Ausschnitt. Schutzritter VK „ASAP/überfällig“ ohne ISO-Frist. |
| 7 | Aufgaben mit Priorität **urgent**? | ⚠️ | Feld `Priorität: urgent` vorhanden; Vollständigkeit nur wenn alle ToDos im Kontext oder `Tagesbriefing_VOLL.md`. |
| 8 | Welche **offenen Forderungen**? | ✅ | `05_Forderungen/Offene_Juni_2026.md` — 3 strukturierte TODO-Blöcke. Lädt bei Querschnitt-Keywords / `--cross`. |
| 9 | Projekte mit **roter Ampel**? | ✅ | Alle 🔴 in Briefing-Radar (TeamFlex, Wolf, SecuGuard, Schutzritter). Zuverlässig **wenn Briefing aktuell**. |
| 10 | **Wichtigste Aufgaben heute**? | ⚠️ | `Tagesbriefing.md` → Top 7 außerhalb Welle 1 + Welle-1-Zeilen — **kein** „heute für Marwan“-Filter, keine Verantwortlichkeit. |

---

## 4. Portfolio-Fragen (Zielbild) — Gap

| Ziel-Frage | Heute | Fehlendes |
|------------|-------|-----------|
| Was blockiert aktuell mein Geschäft? | ⚠️ LLM-Freitext aus Teilkontext | Aggregat Blocker über alle Kunden + Forderungen + überfällige Fristen |
| Welche Kunden brauchen **heute** Aufmerksamkeit? | ⚠️ Briefing-Woche + Top 7 | Regel: Audit ≤7 Tage OR überfällig OR 🔴+Kunde wartet |
| Audits **nächste 14 Tage**? | ✅ Briefing „Diese Woche“ (14d im Script) | — |
| Audits **nächste 30 Tage**? | ❌ | Horizont im Dashboard + Assistant erweitern |
| Offene **Forderungen**? | ✅ | Betrag/Status teils ohne Frist |
| Aufgaben **warten auf andere Personen**? | ❌ | Feld `Wartet auf` / `Verantwortlich` nicht gepflegt |

---

## 5. Stärken der aktuellen HQ-Dateien

- **Status.md** ist für Welle 1 bereits operations-nah: Ampel, Blocker, Audit-Termine, teils kritischer Pfad.
- **ToDos.md** maschinenlesbar (Parser in `build_dashboard.py` bewährt).
- **Tagesbriefing** entlastet morgens; gute Basis für „Was ist heute wichtig?“.
- **Schutzritter / Checkpoint / ELC** zeigen, dass Tabellen für Wartestatus funktionieren — nur **nicht standardisiert**.

---

## 6. Schwächen (systematisch)

1. **Kein Portfolio-Snapshot** — Assistant muss raten oder 7× Dateien laden.
2. **Verantwortlich / Wartet auf** — Schema-Feld ohne Pflege → Operations-Fragen scheitern.
3. **Zwei Wahrheiten für „nächste Aktion“** — Status vs. ToDo → Assistant listet statt zu steuern.
4. **Fristen heterogen** — ISO-Datum, „ASAP“, „bis 11.06.“ in Prosa, leere Fristen.
5. **DEKRA / Auditor / Kunde** — nur implizit in Text, nicht filterbar.
6. **hq_bot lädt nicht `build_dashboard`-Logik** — Duplikat-Intelligenz, Assistant schwächer als Briefing-Generator.
7. **Kontextlimit** — Portfolio-Fragen und „alle urgent“ kollidieren mit 90k-Cap.

---

## 7. Kurzfazit

| Kategorie | Anteil |
|-----------|--------|
| ✅ Bereits brauchbar (mit aktuellem HQ + Briefing) | ~30 % der Management-Abfragen |
| ⚠️ Teilweise (LLM + gute Prosa, unvollständig) | ~55 % |
| ❌ Nicht zuverlässig ohne Erweiterung | ~15 % |

**Hauptursache:** Nicht fehlende Ordnerstruktur, sondern **fehlende standardisierte Steuerungsfelder** und **fehlende voraggregierte Operations-Ansicht** für den vorhandenen Assistant.

Nächste Dokumente: Query-Expansion, Data-Model, Next Steps.
