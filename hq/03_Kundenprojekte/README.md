# Kundenprojekte — was welche Datei macht

**Morgens nicht alle Ordner durchklicken.** Tagesarbeit: [`../00_Dashboard/ARBEITSUEBERSICHT.md`](../00_Dashboard/ARBEITSUEBERSICHT.md)

Wenn du **einen Kunden** bearbeitest, reicht meist:

1. [`../00_Dashboard/ARBEITSUEBERSICHT.md`](../00_Dashboard/ARBEITSUEBERSICHT.md) — was ist offen?
2. `{Kunde}/Status.md` — wie kritisch, welcher Termin?
3. `{Kunde}/ToDos.md` — nur wenn du Aufgaben **schreibst** oder den Bot nutzt

---

## Die sechs Dateien pro Kunde

| Datei | Rolle | Nicht verwechseln mit … |
|-------|--------|-------------------------|
| **ToDos.md** | Aufgabenliste (offen / erledigt) | … der Arbeitsübersicht (die ist deine Kurzliste) |
| **Status.md** | Projekt-Ampel, Auditdatum, Blocker | … einer To-do-Liste (keine Checkboxen nötig) |
| **Audit_2026.md** | NCs, Auditdetails, Fristen Norm | … Status (Status = Kurzfassung) |
| **Kommunikation.md** | Protokoll E-Mails / Calls | … ToDos (ToDo = was du tun musst) |
| **Dokumente_und_Nachweise.md** | Index der Dateien | … Audit-Befundtexte |
| **Lessons_Learned.md** | Nachbereitung | … laufender Arbeit |

**Es gibt keine separate „Readiness.md“** — Readiness war Teil des alten Whiteboards. Prüfpunkte gehören in Audit oder ToDos, nicht in ein drittes Listen-Format.

---

## Neue Aufgabe

```bash
python3 -m bots.00_hq_assistant.hq_bot "todo TeamFlex: …"
```

oder Block in `{Kunde}/ToDos.md` nach [`../08_Vorlagen/ToDos_template.md`](../08_Vorlagen/ToDos_template.md)

danach:

```bash
python3 hq/scripts/build_dashboard.py
```

---

## Kundenliste

Siehe [`_registry.json`](_registry.json)
