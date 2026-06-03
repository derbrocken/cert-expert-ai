# HQ Assistant — Query Expansion (Management-Abfragen)

**Stand:** 2026-06-03  
**Zweck:** Welche Fragen sinnvoll sind, welche HQ-Dateien dafür ausgewertet werden müssen, und wie der **vorhandene** Assistant sie später bedienen kann (ohne neue Bot-Architektur).

---

## 1. Abfrage-Typen (Taxonomie)

| Typ | Beispiel | Antwortformat (Ziel) |
|-----|----------|----------------------|
| **P1 — Projekt** | „Was steht bei Schutzritter an?“ | Ampel, Blocker, 1× nächste Aktion, Top-3 To-dos, Audit-Datum |
| **P2 — Portfolio** | „Welche Kunden sind blockiert?“ | Tabelle: Kunde · Blocker · Wartet auf · Nächster Termin |
| **P3 — Zeit** | „Audits in 30 Tagen?“ | Chronologische Liste mit Norm + Auditor |
| **P4 — Aufgaben** | „Was ist überfällig?“ | Sortiert nach Frist, mit Projekt + Priorität |
| **P5 — Querschnitt** | „Offene Forderungen?“ | Liste aus Forderungen + ggf. LC/AFAS-Verknüpfung |
| **P6 — Steuerung** | „Was blockiert mein Geschäft?“ | Top-5 Blocker über Kunden + Cash + überfällige VK/Audits |
| **P7 — Schreiben** | „todo TeamFlex: …“ | Persistenz in ToDos (bereits implementiert) |

Heute stark: **P1, P7** · schwach: **P2–P6**

---

## 2. Die 10 geforderten Abfragen — Datei-Mapping

| # | Nutzerfrage (Varianten) | Primäre Dateien | Sekundär | Aggregat nötig? |
|---|-------------------------|-----------------|----------|-----------------|
| 1 | blockiert / Blocker / hängt | Alle `03_Kundenprojekte/*/Status.md` | `ToDos.md` (urgent) | **Ja** — Portfolio |
| 2 | wartet auf Kunde / Kundenrücklauf | `Status.md`, `Kommunikation.md`, `Audit_2026.md` | ToDos (Kategorie Kundenkommunikation) | **Ja** |
| 3 | wartet auf DEKRA / Portal / Angebot DEKRA | `Status.md`, `ToDos.md`, `Dokumente_und_Nachweise.md` | Operations Board | **Ja** (Keyword + Feld) |
| 4 | wartet auf Auditor / Bestätigung Auditor | `Status.md`, `LC_Security/*`, `Audit_2026.md` | Kommunikation | **Ja** |
| 5 | Audits 30 Tage / Termine / Kalender | `Status.md` § Audit-Termin, `Audit_2026.md`, `_registry.json` | `Tagesbriefing.md` | **Ja** (Datums-Scan) |
| 6 | überfällig / overdue / verspätet | Alle `ToDos.md`, Querschnitt-ToDos | Status (ASAP/überfällig) | **Ja** (Frist < heute) |
| 7 | urgent / dringend / Priorität | Alle `ToDos.md`, `Tagesbriefing_VOLL.md` | Status-Ampel | **Ja** |
| 8 | Forderungen / offene Rechnungen / Mahnung | `05_Forderungen/Offene_Juni_2026.md` | `LC_Security/Status.md`, ToDos lc05 | Nein (eine Datei) |
| 9 | rote Ampel / kritische Projekte | `Status.md`, `Tagesbriefing.md` Radar | Operations Board Welle 1 | **Ja** (Ampel=🔴) |
| 10 | wichtigste Aufgaben heute / Fokus | `Tagesbriefing.md`, Operations Board „Morgen früh“ | überfällig + urgent + Audit≤7d | **Ja** (Scoring) |

---

## 3. Erweiterte Management-Abfragen (empfohlen)

### Portfolio / Steuerung

- Was blockiert aktuell mein Geschäft?
- Welche Kunden brauchen heute Aufmerksamkeit?
- Welche Projekte sind 🟡 aber werden 🟴? (Trend — **später**, braucht Historie)
- Wo ist der kürzeste Weg zum nächsten Audit?
- Welche Welle-1-Kunden haben die meisten offenen urgent-To-dos?
- Was kann ich delegieren / was wartet auf extern?

### Pro Kunde (Operations-Antwort statt Liste)

- Wer ist verantwortlich bei {Kunde}?
- Worauf warten wir bei {Kunde}?
- Was ist der kritische Pfad bis {Audit-Datum}?
- Was ist die **eine** nächste Aktion bei {Kunde}?
- Wann war die letzte Kundenkommunikation?
- Welche NCs / Abweichungen sind offen? → `Audit_2026.md`

### Zeit & Compliance

- Welche Fristen laufen diese Woche aus?
- Welche Audits ohne bestätigten Auditor?
- Welche Erstzert-Projekte ohne Termin? → Checkpoint

### Finanzen & Vertrieb

- Summe offener Forderungen (Betrag — **Daten lückenhaft**, nur Text)
- Welche Angebote hängen an Audits? → `04_Vertrieb/Angebote_Juni_2026.md`

---

## 4. Intent → Kontext-Pack (für vorhandenen Assistant)

**Ohne neuen Bot:** `hq_context.py` um **Query-Intents** erweitern (später), die festlegen, was geladen wird:

| Intent-Keywords (DE) | Zusätzlich laden |
|----------------------|------------------|
| blockiert, blocker, hängt | `operations_snapshot` + alle `Status.md` (gekürzt: Kurzstatus only) |
| wartet auf kunde | snapshot + Filter ToDos/Status |
| dekra | snapshot + Status mit Zertifizierungsstelle DEKRA |
| auditor | snapshot + Audit-Tabellen |
| audit, termin, kalender | snapshot + 30-Tage-Horizont |
| überfällig, frist | snapshot + alle ToDos (Felder Frist/Priorität) |
| urgent, dringend | snapshot + urgent-Liste |
| forderung, rechnung | `05_Forderungen/` |
| ampel, rot, kritisch | snapshot Ampel |
| heute, fokus, wichtigste | `Tagesbriefing.md` + Scoring-Liste |
| {Kundenname} | wie heute: Status + ToDos + Audit |

**operations_snapshot** = neue **generierte** Datei aus `build_dashboard.py` (kein neuer Service — Erweiterung bestehendes Script). Siehe `HQ_ASSISTANT_NEXT_STEPS.md`.

---

## 5. Antwort-Schablone (Operations statt Liste)

Für **P1 Projektfragen** soll der Assistant strukturieren:

```markdown
## {Kunde} — Steuerung

| | |
|--|--|
| Ampel | 🔴 |
| Nächster Termin | 26.06.2026 Audit |
| Blocker | VK-Upload überfällig |
| Wartet auf | Kunde (Unternehmensformulare) |
| Verantwortlich (intern) | … |
| **Nächste Aktion** | VK uploaden, dann Kunde an Formulare erinnern |

### Offene To-dos (Top 3)
…
```

Dafür reichen **bestehende Dateien + wenige neue Felder** — keine neue Architektur.

---

## 6. Priorität der Abfragen (Nutzen × Machbarkeit)

| Prio | Abfrage | Warum |
|------|---------|-------|
| P0 | Was steht bei {Kunde} an? **+ Steuerungsblock** | Täglich, Basis vorhanden |
| P0 | Rote Ampel / Kunden heute Aufmerksamkeit | Morgen-Briefing-Ergänzung |
| P0 | Audits 14/30 Tage | Kalendersteuerung |
| P1 | Überfällig + urgent (portfolio) | Eskalation |
| P1 | Wartet auf Kunde / DEKRA / Auditor | Klärt Verantwortung extern |
| P2 | Was blockiert mein Geschäft? | Synthese aus P0/P1 |
| P2 | Forderungen | Daten schon strukturiert |
| P3 | Verantwortlich intern | Erst nach Feldpflege |

---

## 7. Abgrenzung (bewusst nicht)

- Keine Telegram-/Sprach-Intents in diesem Dokument.
- Keine GB/SK/EK- oder Norm-Fragen im HQ Assistant.
- Keine QM-Ordner-Inhalte — nur HQ-Register (`Dokumente_und_Nachweise.md`).
