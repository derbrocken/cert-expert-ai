# HQ Assistant — Data Model Improvements

**Stand:** 2026-06-03  
**Prinzip:** Markdown bleibt Wahrheit; **keine** neue Datenbank, **kein** neuer Bot — Felder und Vorlagen erweitern, `build_dashboard.py` aggregiert für den vorhandenen Assistant.

---

## 1. Ist-Zustand (Felder)

### `Status.md` (pro Kunde)

| Feld | Vorhanden | Maschinenlesbar | Befüllung 7 Kunden |
|------|-----------|-----------------|---------------------|
| Ampel | ✅ `**Ampel:**` | ✅ Regex in dashboard | 7/7 |
| Blocker | ✅ `**Blocker:**` | ⚠️ Freitext | 7/7 |
| Audit-Termine | ✅ Tabelle § Audit-Termin | ✅ Parser (mit Einschränkungen) | 5/7 stark, ZT/Checkpoint teils |
| Zertifizierungsstelle | ⚠️ | Freitext | TeamFlex, Wolf |
| Letzte Kommunikation | ⚠️ | Freitext | Schutzritter, TeamFlex teils |
| Kritischer Pfad | ⚠️ Tabellen | Teilweise | Schutzritter, Checkpoint, ELC |
| Nächste Schritte (Liste) | ✅ | Nein (Nummernliste) | Welle 1 |
| Verantwortlich (intern) | ❌ | — | — |
| Wartet auf | ❌ | — | nur Prosa |
| Nächste Aktion (singular) | ❌ | — | — |
| Letzte Aktivität (Datum) | ⚠️ `Stand:` | Ja | alle |

### `ToDos.md` (Schema `08_Vorlagen/ToDos_template.md`)

| Feld | Vorhanden | Pflege |
|------|-----------|--------|
| Aufgabe, Projekt, Kategorie, Frist, Status, Priorität | ✅ | gut |
| Verantwortlich | ✅ Feld | **100 % `(unassigned)`** |
| Nächster Schritt | ✅ | gemischt |
| Wartet auf | ❌ | — |
| Blockiert durch | ❌ | — |
| Abhängigkeit von | ❌ | — |

### Querschnitt (`05_Forderungen`, `04_Vertrieb`, …)

Gleiches TODO-Schema — für Forderungen ausreichend; **Betrag / Fälligkeit** nicht als strukturierte Felder.

---

## 2. Soll: Steuerungsblock in `Status.md` (Standard)

**Einheitlicher Abschnitt** direkt unter `## Kurzstatus` — von `build_dashboard` und Assistant geparst:

```markdown
## Steuerung

| Feld | Wert |
|------|------|
| **Projektstatus** | aktiv \| wartend \| eskaliert \| abgeschlossen |
| **Ampel** | 🔴 \| 🟡 \| 🟢 |
| **Verantwortlich (intern)** | Marwan \| (Name) \| unassigned |
| **Wartet auf** | — \| Kunde \| DEKRA \| Auditor \| Zertifizierungsstelle \| Intern |
| **Blocker (Kurz)** | ein Satz |
| **Nächste Aktion** | eine imperativ formulierte Handlung |
| **Letzte Aktivität** | YYYY-MM-DD |
| **Nächster Termin** | YYYY-MM-DD \| — |
```

**Warum Tabelle:** Ein Parser, Obsidian-lesbar, kein YAML-Zwang.

**Migration:** Bestehende `**Blocker:**` und Listen schrittweise in Steuerungstabelle überführen; alte Felder kurzzeitig parallel erlauben.

---

## 3. Soll: ToDo-Schema (Erweiterung)

Zusätzliche optionale Felder (Rückwärtskompatibel):

```markdown
- **Verantwortlich:** Marwan | Kunde | DEKRA | Auditor | (unassigned)
- **Wartet auf:** Intern | Kunde | DEKRA | Auditor | Extern | —
- **Blockiert durch:** (TODO-ID oder Kurztext, optional)
- **Nächster Schritt:** …
```

### Enum-Werte (Pflichtliste in Vorlage)

**Verantwortlich (intern):** `Marwan`, `Team`, `(unassigned)` — erweiterbar  
**Wartet auf:** `Intern`, `Kunde`, `DEKRA`, `Auditor`, `Zertifizierungsstelle`, `Behörde`, `—`

**Regel:** Wenn `Wartet auf: Kunde` → erscheint in Portfolio-Abfrage „wartet auf Kunden“.

---

## 4. Kritischer Pfad — Mini-Standard

In `Status.md` **oder** `Audit_2026.md` (bei Audit-Projekten):

```markdown
## Kritischer Pfad

| # | Schritt | Status | Wartet auf | Frist |
|---|---------|--------|------------|-------|
| 1 | VK-Upload | 🔴 offen | Intern | 2026-06-03 |
| 2 | Unternehmensformulare | 🟡 erwartet | Kunde | 2026-06-04 |
```

Schutzritter `Audit_2026.md` ist **Referenzimplementierung** — auf alle Audit-Kunden übertragen.

---

## 5. Generierte Datei: `operations_snapshot.md` (Dashboard)

**Ort:** `hq/00_Dashboard/operations_snapshot.md`  
**Erzeuger:** Erweiterung `build_dashboard.py` (bestehende Parser wiederverwenden)

Inhalt (maschinen- + menschenlesbar):

1. **Ampel 🔴** — alle Kunden mit Blocker-Kurz + Wartet auf + Nächste Aktion  
2. **Warteschlangen** — Tabellen: Kunde | DEKRA | Auditor | Kunde  
3. **Audits** — 30-Tage-Horizont  
4. **Überfällig** — ToDos mit `Frist < heute`  
5. **Urgent** — alle urgent offen  
6. **Forderungen** — Kurzliste aus `05_Forderungen`  
7. **Heute Fokus** — Scoring (siehe unten)

**HQ Assistant** lädt bei Portfolio-Intents **immer zuerst** diese Datei → kein Kontext-Overflow durch 7× volle ToDos.

---

## 6. Scoring „Wichtigste Aufgaben heute“ (Regeln)

Punkte (Vorschlag für Snapshot-Generator):

| Signal | Punkte |
|--------|--------|
| Audit in ≤7 Tagen | +10 |
| Ampel 🔴 | +8 |
| ToDo urgent | +6 |
| Frist überfällig | +8 |
| Wartet auf Kunde + Frist ≤3 Tage | +5 |
| Blocker enthält „überfällig“ | +7 |

Top-N nach Summe pro Kunde + Top-ToDos — **deterministisch**, LLM nur für Formulierung optional.

---

## 7. Beispiel-Zielzustand (Schutzritter)

**Heute (Assistant):** Liste aller To-dos.

**Ziel (Assistant):**

| | |
|--|--|
| Ampel | 🔴 |
| Blocker | VK-Upload überfällig |
| Wartet auf | Kunde (Unternehmensformulare ab morgen) |
| Verantwortlich | Marwan (intern) |
| Nächste Aktion | VK-Datei uploaden |
| Kritischer Pfad | Schritt 1 → 2 → 3 (Audit 26.06.) |

---

## 8. Was bewusst **nicht** ins Datenmodell

- Vollständige QM-Dokumente — bleiben OneDrive/Portal; HQ nur Index in `Dokumente_und_Nachweise.md`.
- Telegram-Metadaten — später gleiches Schema, andere `Quelle:`.
- Doppelte Wahrheit Operations Board — Board bleibt Narrativ + Links, Snapshot ersetzt nicht Status/ToDos.

---

## 9. Vorlagen anpassen (Dateien)

| Datei | Änderung |
|-------|----------|
| `hq/08_Vorlagen/Kundenprojekt/Status.md` (neu aus README) | Steuerungstabelle + Kritischer Pfad |
| `hq/08_Vorlagen/ToDos_template.md` | Felder Wartet auf, Verantwortlich-Enums |
| `docs/MOBILE_INPUT_TODO_ARCHITECTURE.md` | Später sync — Felder referenzieren |

**Keine Pflicht:** Alle 7 Kunden sofort voll befüllen — **Steuerungstabelle zuerst Welle 1 + Schutzritter**.

---

## 10. Datenqualitäts-Checkliste (manuell, einmalig)

Pro aktivem Kunden (~10 Min):

- [ ] Steuerungstabelle ausgefüllt  
- [ ] `Wartet auf` gesetzt wenn extern  
- [ ] Eine **Nächste Aktion** (nicht nur Liste)  
- [ ] Top-3 urgent-To-dos mit Frist ISO  
- [ ] Audit-Datum in § Audit-Termin (nicht nur Ampel-Text)
