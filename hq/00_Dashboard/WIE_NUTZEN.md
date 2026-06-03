# HQ in Obsidian nutzen — Kurzanleitung

**Ziel:** Eine **Leseansicht** für dich. Die Roh-Markdown-Dateien bleiben für System & Cursor.

---

## Leseansicht finden (wichtig)

Obsidian hat **zwei Modi** pro Notiz:

| Modus | Was du siehst | So erkennst du es |
|-------|----------------|-------------------|
| **Bearbeiten** | Rohtext, `##`, `**`, Tabellen als Code-Zeilen | Oben steht oft „Bearbeiten“ / Stift-Symbol |
| **Leseansicht** | Formatierter Text, Tabellen als Tabelle | Oben **Buch-Symbol** / „Lesen“ |

### Umschalten (Mac)

1. Öffne z. B. `hq/00_Dashboard/Tagesbriefing.md`
2. **Oben rechts** in der Titelleiste der Note:
   - Klicke das **Buch-Symbol** (Leseansicht), **oder**
   - Tastenkürzel: **Cmd + E** (wechselt Lesen ↔ Bearbeiten)
3. Manche Versionen: **Cmd + Shift + R** = Leseansicht erzwingen

**Hinweis:** In der deutschen Obsidian-Version heißt es **„Leseansicht“**, nicht „Reading View“. Es gibt **keine** separaten „Reading Signs“ — gemeint ist dieser Modus.

### Dauerhaft Lesemodus

**Einstellungen** (Zahnrad links unten) → **Editor**:

- **Standardmodus für neue Tabs:** → **Lesen** (nicht „Bearbeiten“)

---

## CSS-Schnipsel (bessere Tabellen)

Falls Tabellen/Überschriften „flach“ aussehen:

1. **Einstellungen** → **Erscheinungsbild**
2. Nach unten: **CSS-Snippets** (oder „CSS-Code-Schnipsel“)
3. Ordner öffnen (Button) → dort muss liegen: `hq-briefing.css`
4. Schalter **`hq-briefing`** auf **An**

Datei im Repo: `.obsidian/snippets/hq-briefing.css`  
(Wenn der Schalter fehlt: Vault = Ordner `cert-expert-ai`, nicht nur `knowledge/`.)

---

## Datei finden: Tagesbriefing

Im **Dateiexplorer** (links):

```text
cert-expert-ai
  └── hq
        └── 00_Dashboard
              ├── Tagesbriefing.md    ← morgens
              ├── operations_snapshot.md  ← Portfolio / HQ Assistant
              ├── Kunden_Uebersicht.md
              └── WIE_NUTZEN.md       ← diese Anleitung
```

Oder **Cmd + O** → tippe `Tagesbriefing` → Enter.

---

## Keine farbigen Info-Kästen?

Älere Anleitung nutzte `> [!tip]` — das braucht ein **Plugin** (Admonitions).  
Das Briefing nutzt jetzt nur normale **Zitate** (`>`), die in der Leseansicht **ohne Plugin** sichtbar sind.

---

## Lesezeichen (Sidebar)

1. `Tagesbriefing.md` öffnen
2. Rechtsklick auf den Tab **oder** Icon „Lesezeichen“ in der linken Leiste
3. **Lesezeichen hinzufügen**

---

## Täglicher Ablauf

1. Terminal:

```bash
cd /Users/marwanmahra/cert-expert-ai
python3 hq/scripts/build_dashboard.py
```

2. Obsidian: `hq/00_Dashboard/Tagesbriefing.md` öffnen
3. **Leseansicht** (Buch-Symbol / Cmd+E)
4. Fertig — nicht den ganzen `hq/`-Baum durchklicken

**Nicht** morgens öffnen: `01_Master_Dump/Master_Dump_V1_June_2026.md` (zu lang, doppelt mit HQ).

---

## Zwei Briefing-Dateien

| Datei | Wann |
|-------|------|
| `Tagesbriefing.md` | **Jeden Morgen** — kurz: Woche, Top 7 außerhalb Welle 1, Radar |
| `Tagesbriefing_VOLL.md` | **1× pro Woche** — alle urgent, Welle-1-Listen, Querschnitt im Detail |

Welle 1 (TeamFlex, Wolf Street, SecuGuard): im Kurzbriefing nur **eine Tabellenzeile** — Details in `ToDos.md`.

---

## Master Dump

| Datei | Rolle |
|-------|--------|
| `01_Master_Dump/README.md` | Eingang für **neue** unklare Punkte (eine Zeile) |
| `MIGRATION_STATUS.md` | Wöchentliche Checkliste: was aus dem Juni-Dump fehlt noch? |
| `Master_Dump_V1_June_2026.md` | Archiv-Inventar — Referenz, nicht Tagesliste |

---

## Was du wo liest

| Frage | Datei |
|-------|--------|
| Was ist heute dran? | `Tagesbriefing.md` |
| Portfolio / blockiert / Audits / überfällig? | `operations_snapshot.md` + HQ Assistant |
| Alles urgent / Planung? | `Tagesbriefing_VOLL.md` |
| Wie steht Kunde X? | `03_Kundenprojekte/{Kunde}/Status.md` |
| NC / Audit-Details? | `Audit_2026.md` |
| Haben wir Dump-Punkte vergessen? | `01_Master_Dump/MIGRATION_STATUS.md` |
| Kurznotiz (jetzt) | Cursor-Chat → schreibt in HQ |
| To-do aufnehmen | `python3 -m bots.00_hq_assistant.hq_bot "todo TeamFlex: …"` oder HQ-Chat (Regel **HQ Assistant**) |
| Kurznotiz (später) | Telegram → HQ |
