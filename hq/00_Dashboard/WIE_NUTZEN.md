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
              ├── Tagesbriefing.md    ← diese Datei
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

---

## Was du wo liest

| Frage | Datei |
|-------|--------|
| Was ist heute dran? | `Tagesbriefing.md` |
| Wie steht Kunde X? | `03_Kundenprojekte/{Kunde}/Status.md` |
| NC / Audit-Details? | `Audit_2026.md` |
| Kurznotiz (jetzt) | Cursor-Chat → schreibt in HQ |
| Kurznotiz (später) | Telegram → HQ |
