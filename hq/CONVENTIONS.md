---
type: konzept
title: CONVENTIONS — Agenten-Regelwerk
status: aktiv
updated: 2026-06-11
tags: [wissen]
---

# CONVENTIONS.md — Regelwerk für alle Agenten & Chats

**Verbindlich. Jeder Agent liest diese Datei zuerst** (nach `CLAUDE.md`). Freigegeben durch Mark am 2026-06-11 (Basis: `00_Dashboard/VAULT_STRUKTUR_KI_KONZEPT.md`).

## 1. Frontmatter — Pflicht in jeder neuen/angefassten Notiz

```yaml
---
type:        # s. Vokabular unten
title:       # Klartext
status:      # aktiv | offen | wartet | fertig | archiv | entwurf
updated:     # YYYY-MM-DD — bei JEDER Änderung pflegen
tags: []     # s. Tag-Vokabular
---
```

Typ-spezifische Zusatzfelder: s. `00_Dashboard/VAULT_STRUKTUR_KI_KONZEPT.md` §2.1 (kundenstatus: `slug, phase, projekttyp, ampel, audit_datum, zert_stelle` · wissen: `quelle, relevanz, scope_status, clause_ids` · vorlage: `vorlagen_klasse, norm_bezug, clause_ids` · auftrag: `owner, auftrag_status, commit`).

## 2. Kontrolliertes Vokabular

**`type`** (genau diese Werte, sonst nichts):
`dashboard · kundenstatus · kundendokument · auftrag · wissen · vorlage · schulung · teilnahmebescheinigung · zertifikat · auditnachweis · mitarbeiterakte · norm · readme · konzept`

**`tags`** (Thema, nicht Form): `#kunde #audit #norm #schulung #vertrieb #strategie #finanzen #tool #wissen #privat`

Regel: `type` = Form, Tags = Thema. Nicht vermischen. Kein Agent erfindet neue Werte.

## 3. Inbox-Regel (Capture) — gegen das Verstreuen

> **Jeder neue Input (Idee, Software-Gedanke, Link, Fundstück) landet ZUERST in `00_Dashboard/EINGANG.md` — nie direkt in Themenordnern.**

- Eine Zeile reicht: `- YYYY-MM-DD <Stichpunkt>`. Kein Formatzwang beim Capturen.
- Triage macht der HQ-Chat (täglich): Eingang → `BACKLOG.md`, `06_Software/PRODUKT_IDEEN.md`, Kundenakte oder Papierkorb.
- Agenten, die von Mark neue Ideen hören, schreiben sie in den EINGANG — nicht in neue Dateien.

## 4. Schreib-Regeln für Agenten

1. Eine Datenart = **ein Zuhause** (`00_Dashboard/ARCHITEKTUR.md` ist verbindlich). Verweisen statt duplizieren.
2. **Kein neues Konzept-/Strukturdokument**, wenn ein bestehendes den Zweck erfüllt — erst `WO_IST_WAS.md` prüfen.
3. Kunden-Slug aus `03_Kundenprojekte/_registry.json` ist der Schlüssel über alle Systeme.
4. Maschinen-Dateien mit `_`-Präfix nicht umbenennen.
5. Nicht in Dateien schreiben, die Mark gerade offen hat (Save-Konflikt). Bridge-Dateien nicht anfassen, solange eine Executor-Session läuft.
6. Erledigte Einmal-Aufträge (`CURSOR_*_AUFTRAG.md`) gehören nach `09_Archiv` — Aufräumen nur an stabilen Punkten.

## 5. Guardrails (aus CLAUDE.md, hier wiederholt weil notiz-relevant)

- **EC-10:** Eingehende Nachweise immer `pruef_status: unchecked`. Kein Agent setzt „grün / qualifiziert / auditfähig" automatisch.
- **Keine erfundenen Normpflichten:** Norm-Felder nur mit `clauseId` (CL-xx) aus `knowledge/NORM_KLAUSEL_REGISTER_v1.md`, sonst als „fachlich prüfen" markieren.
- **C-10:** Architektur-/Scope-Änderungen nur über Gate mit Mark.
- **DSGVO:** keine Personendaten ins Repo committen.

## 6. ADHS-Arbeitsregeln (für jeden Chat mit Mark)

- Vision / Projekt / heutige Aufgabe klar trennen. Bei Abschweifen fragen: „Umsetzung, Planung oder Parkplatz?"
- Max. 1 Hauptaufgabe + 2 Nebenaufgaben + 1 Admin pro Tag empfehlen.
- Aufgaben in 10–30-Minuten-Schritte zerlegen, mit konkretem Startpunkt.
- Immer benennen, was heute bewusst NICHT gemacht wird.
