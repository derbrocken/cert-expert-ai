# Dashboard — Link, Dateien, Anpassen

**Stand:** 2026-06-04

---

## Dein Link (Lesezeichen)

| Was | Wert |
|-----|------|
| **URL** | **http://127.0.0.1:8765/** |
| **Voraussetzung** | Server läuft (siehe unten) |

Im Browser als Lesezeichen speichern — z. B. „HQ Dashboard“.

---

## Server starten (jedes Mal)

```bash
cd /Users/marwanmahra/cert-expert-ai
python3 hq/scripts/build_dashboard.py   # optional, nach manuellen .md-Änderungen
python3 hq/scripts/serve_dashboard.py
```

Terminal **offen lassen**. Beenden: **Ctrl+C** → Link funktioniert erst nach erneutem Start.

---

## Wo liegen die Dateien?

### Übersicht im Finder / Cursor

```
cert-expert-ai/
└── hq/
    └── 00_Dashboard/
        ├── PINS.json              ← Auswahl „Übersicht“ (IDs)
        ├── PINS.md                ← Spiegel (lesbar)
        ├── ARBEITSUEBERSICHT.md   ← Mein Tag (Markdown)
        ├── BACKLOG.md             ← Vollliste
        ├── DASHBOARD_ALLTAG.md    ← diese Seite
        ├── DASHBOARD_PLAN_V2.md   ← Konzept / Architektur
        ├── START_HIER.md          ← HQ-Einstieg gesamt
        └── html/                  ← Web-Oberfläche (Ordner!)
            ├── index.html         ← Layout
            ├── app.js             ← Logik
            ├── styles.css         ← Design / Farben
            ├── dashboard_data.json← Build-Ausgabe (nicht von Hand editieren)
            └── README.md          ← Technik Kurz

**Reiter „Cert Expert Kosten“:** Oberpunkt Finanzen — **Übersicht** (beide Kuchendiagramme), Unter-Reiter **Einnahmen** (`Cert_Expert_Einnahmen.json`, §1) und **Ausgaben** (`Cert_Expert_Kosten.json`, §3).

**DFSS Pilot (täglich):** Word-Vorlage `QM/Strategie/DFSS_PILOT_MEASUREMENT_ACTIVATION_TEMPLATE_V1_…docx` — HQ-Spiegel P05: `07_DFSS/FILLIN_P05_SecuGuard_aus_TEMPLATE.md`.
```

**Obsidian:** Oft siehst du vor allem `.md`-Dateien. Der Ordner **`html`** ist trotzdem da — in Obsidian `00_Dashboard` aufklappen oder im Finder **Cmd+Shift+G** → Pfad einfügen:

`/Users/marwanmahra/cert-expert-ai/hq/00_Dashboard/html`

(`PINS` ist eine **Datei**, kein Ordner.)

---

## Verbindung Dashboard ↔ Dateien (schon eingebaut)

Du musst **nichts extra bauen** — Klicks im Dashboard schreiben in die HQ-Dateien:

| Aktion im Dashboard | Gespeichert in |
|---------------------|----------------|
| ☑ Aufgabe erledigt / wieder offen | `03_Kundenprojekte/<Kunde>/ToDos.md` (`Status: done/open`) + Spiegel in `ARBEITSUEBERSICHT.md` / `BACKLOG.md` |
| „Übersicht“ / Gruppe zur Übersicht | `PINS.json` (`selected`: Liste von IDs) |
| Frist-Datum ändern | `ToDos.md` (`Frist`, `Due date`) |
| **+ Hinzufügen** (unter Projekt) | neuer Block in `ToDos.md` + `PINS.json` (Übersicht) + Build-Spiegel |
| „Daten neu laden“ | führt `build_dashboard.py` aus → aktualisiert `dashboard_data.json` |

**Quelle der Wahrheit** für Aufgaben: **ToDos.md** pro Kunde (und Querschnitt-`.md`).  
Das Dashboard ist die **bedienbare Oberfläche** dazu.

---

## Design anpassen (visuell schöner)

| Ziel | Datei bearbeiten |
|------|------------------|
| Farben, Abstände, Schrift | `html/styles.css` |
| Texte, Bereiche, Buttons | `html/index.html` |
| Verhalten (Klicks, Listen) | `html/app.js` |

Nach Änderung: Browser **Hard-Reload** (Cmd+Shift+R). Server neu starten nur bei Python-Änderungen an `serve_dashboard.py`.

Ideen / UX-Regeln: [DASHBOARD_PLAN_V2.md](DASHBOARD_PLAN_V2.md)

---

## Dokumentation (Architektur & Nutzung)

| Datei | Inhalt |
|-------|--------|
| [START_HIER.md](START_HIER.md) | Gesamtes HQ, Morgenroutine |
| [DASHBOARD_ALLTAG.md](DASHBOARD_ALLTAG.md) | Diese Seite — Link & Alltag |
| [DASHBOARD_PLAN_V2.md](DASHBOARD_PLAN_V2.md) | Plan Pins, Übersicht, Backlog |
| [WIE_NUTZEN.md](WIE_NUTZEN.md) | Obsidian Leseansicht |
| [html/README.md](html/README.md) | Technischer Kurzstart HTML |

---

## Kurz-Workflow

1. Server starten → Lesezeichen öffnen  
2. Unten **Projekte** → **Alle zur Übersicht**  
3. Oben arbeiten (abhaken, Frist, erledigt bleibt sichtbar bis „Entfernen“)  
4. Optional parallel: `ARBEITSUEBERSICHT.md` in Obsidian
