# HQ in Obsidian nutzen — Kurzanleitung

**Ziel:** Eine Lesesicht für dich. Markdown-Rohdateien bleiben für System & Cursor.

---

## 1. Einmal einrichten (5 Minuten)

### Vault
- Ordner: **`cert-expert-ai`** (Repo-Root, nicht nur `knowledge/`)

### Lesbarkeit
1. **Einstellungen → Editor → Standard-Ansicht:** Reading
2. **Einstellungen → Erscheinungsbild → CSS-Code-Schnipsel:** `hq-briefing` aktivieren (liegt unter `.obsidian/snippets/`)
3. **Einstellungen → Dateien & Links → Ausgeschlossene Dateien:**
   - `outputs`
   - `.venv`
   - `venv`
   - `node_modules`

### Lesezeichen (empfohlen)
1. [Tagesbriefing.md](Tagesbriefing.md) — **jeden Morgen**
2. [Kunden_Uebersicht.md](Kunden_Uebersicht.md)
3. [../02_Operations_Board/Operations_Board_Juni_2026.md](../02_Operations_Board/Operations_Board_Juni_2026.md)

---

## 2. Täglicher Ablauf

| Wann | Was |
|------|-----|
| **Morgens** | Briefing neu bauen (siehe unten) → **Tagesbriefing** öffnen |
| **Nach Gespräch** | Update an Cursor/Chat — nicht selbst 6 Dateien editieren |
| **Vor Audit** | `03_Kundenprojekte/{Kunde}/Status.md` + `Audit_2026.md` |
| **Abends (optional)** | Erledigtes in ToDos → Abschnitt Erledigt (oder Chat) |

### Briefing aktualisieren

Im Terminal im Projektordner:

```bash
python3 hq/scripts/build_dashboard.py
```

Dann in Obsidian: **Tagesbriefing.md** neu laden (Datei schließen/öffnen oder Vault reload).

---

## 3. Was du wo liest (nicht alles)

| Frage | Datei |
|-------|--------|
| Was ist heute dran? | `Tagesbriefing.md` |
| Wie steht Kunde X? | `{Kunde}/Status.md` |
| NC / Audit-Details? | `{Kunde}/Audit_2026.md` |
| Was war gesagt? | `{Kunde}/Kommunikation.md` |
| Einzelaufgaben abarbeiten? | `{Kunde}/ToDos.md` |

**Fachseiten** (SecuGuard NC, DIN-Themen): am **Computer** in Obsidian oder OneDrive — nicht auf dem Handy im Detail.

---

## 4. Später: Sprache → Telegram → HQ

Geplant (lokal zuerst, ohne Hetzner):

1. Kurze Sprachnotiz in **Telegram**
2. Bot schreibt in `ToDos.md` / `Kommunikation.md` (Schema in `08_Vorlagen/ToDos_template.md`)
3. Du führst `build_dashboard.py` aus (oder automatisch)
4. **Tagesbriefing** zeigt die neue Zeile

Fachliche Langtexte und NC-Listen: weiter **am Rechner**.

---

## 5. Wenn es „unübersichtlich“ wirkt

- Nur **Tagesbriefing** pinnen, nicht den ganzen `hq/`-Baum durchklicken
- **Status.md** pro Kunde ist die **eine** Übersichtsseite
- Graph-Ansicht ist optional — für HQ erst mal ignorieren
- Nach Updates immer Briefing neu generieren
