# HQ Dashboard — Plan V2 (HTML)

**Status:** V1 umgesetzt (HTML + Server) — Feinschliff / Drag später  
**Stand:** 2026-06-04  
**Entscheidungen:** vom Nutzer bestätigt (siehe unten)

---

## Festgelegte Entscheidungen

| # | Frage | Entscheidung |
|---|--------|--------------|
| 1 | Oberfläche | **HTML** im Browser (lokal aus Repo), nicht Obsidian-only |
| 2 | Pins | **Über Nacht persistent** — bleiben, bis bewusst entfernt / unpinned |
| 3 | Gruppen | **Projekt → pro Kunde** · **Thema → pro Thema** (eigene Gruppen-Container) |
| 4 | Privat | **Eigene Kachel** im Kategorien-Bereich **und** privat pinnbar in der Pin-Zone |
| 5 | Pin-Limit | **Kein hartes Maximum** — Pin-Zone darf voll nutzen; Sortierung/Priorität über Gruppen |
| 6 | Kunden-Kacheln | **Jeder Kunde einzeln anpinnbar** (ganze Projekt-Gruppe), nicht nur einzelne To-do-IDs |

---

## Zielbild (eine Seite)

```
┌──────────────────────────────────────────────────────────────────┐
│  PIN-ZONE (groß, ~60–70 % sichtbare Höhe am Morgen)               │
│  ┌─ Gruppe: Projekt · Wolf Street ─────────────────────────────┐ │
│  │  ☐ ws09  ☐ ws03  … (Drag aus Kachel oder Suche)              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│  ┌─ Gruppe: Thema · Vertrieb ──────────────────────────────────┐ │
│  │  ☐ vert02  ☐ bk-5398ca96                                     │ │
│  └──────────────────────────────────────────────────────────────┘ │
│  ┌─ Gruppe: Privat · Life Admin ────────────────────────────────┐ │
│  │  ☐ bk-8730937f  …                                            │ │
│  └──────────────────────────────────────────────────────────────┘ │
│  [+ Thema-Gruppe]  (Kunden kommen per Kachel „Kunde anpinnen“)     │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│ KUNDEN — eine Kachel pro Kunde  [📌 Wolf Street] [📌 TeamFlex] …  │
│ (jede Kachel: Ampel, Audit+Countdown, offen, Top-Aufgaben, Pin)   │
├────────────┬────────────┬────────────┬────────────────────────────┤
│ VERTRIEB   │ FORDERUNGEN│ INTERN     │ PRIVAT (eigene Kachel)      │
├────────────┴────────────┴────────────┴────────────────────────────┤
│ DFSS (kompakt)  ·  Link: BACKLOG Vollliste                        │
└──────────────────────────────────────────────────────────────────┘
```

**Prinzip:** Pin-Zone = Fokus. Kacheln = Panorama + Quelle zum Anpinnen. Vollliste = `BACKLOG.md` + Kunden-`ToDos.md` (nicht alles auf der Startseite).

---

## Source of Truth (unverändert)

| Daten | Datei | Rolle |
|-------|--------|--------|
| Kunden-To-dos | `03_Kundenprojekte/{Kunde}/ToDos.md` | Aufgabe, Frist, Status, ID `ws09` … |
| Querschnitt | `04_Vertrieb/`, `05_Forderungen/`, `06_Software/` | IDs `vert01`, `ford01`, … |
| Privat & Ideen | `BACKLOG.md` → Block **Pflege** | IDs `bk-…` |
| DFSS | `07_DFSS/`, Evidence in Kundenakten | `dfss01`, `EV-WS-*` |
| **Pins & Gruppen** | **neu:** `PINS.md` (siehe Schema) | nur Referenzen, kein Doppeltext |
| Build | `hq/scripts/build_dashboard.py` | MD-Spiegel + später JSON für HTML |

HTML **liest** generierte Daten; **schreibt** nur `PINS.md` (und triggert Build nach Abhaken).

---

## Pin-Modell

### Persistenz

- Pins bleiben in `PINS.md`, bis **Unpin** oder Gruppe gelöscht.
- Optional später: Archiv `<!-- pinned-until: 2026-06-10 -->` — **nicht** V1.
- Tageswechsel: Pin-Zone zeigt **dieselben** Pins; Nutzer räumt manuell auf.

### Kein Pin-Maximum

- **Kein festes Limit** (keine 12/15er Kappe in V1).
- Pin-Zone scrollt bei Bedarf; Fokus entsteht durch **wenige Gruppen**, die du selbst pflegst.
- Performance-Grenze praktisch: Build/JSON-Größe — bei Bedarf später weiche Warnung, kein Hard-Stop.

### Zwei Gruppentypen

| Typ | `group_type` | Beispiel-Titel | Enthält |
|-----|----------------|----------------|---------|
| **Projekt** | `project` | `Wolf Street` | Nur IDs aus diesem Kunden-Slug |
| **Thema** | `theme` | `Vertrieb`, `Privat`, `DFSS`, `Intern` | IDs aus Querschnitt / Pflege / DFSS |

**Regel:** Eine To-do-ID nur **einmal** gepinnt (Build/HTML warnt bei Duplikat).  
**Kunde anpinnen:** legt/aktiviert eine **`project`-Gruppe** für diesen Slug (ein Kunde = eine Gruppe in der Pin-Zone).

### Kunde anpinnen (von der Kachel)

| Aktion | Effekt |
|--------|--------|
| **📌 Kunde anpinnen** auf Kachel | `project`-Gruppe für diesen Slug erscheint oben in der Pin-Zone |
| Gruppe neu | Enthält zunächst **alle offenen** To-dos des Kunden (V1) — in Pin-Zone abhakbar |
| **Kunde lösen** | Ganze Projekt-Gruppe aus `PINS.md` entfernen (To-dos in Quelle bleiben offen) |
| Einzelnes To-do | Zusätzlich/unabhängig: Pin nur `ws09` in bestehende Projekt-Gruppe |

Mehrere Kunden gleichzeitig gepinnt = mehrere Projekt-Gruppen untereinander (z. B. Wolf Street + Schutzritter).

### Pin-Zeile (generiert vs. gespeichert)

**Gespeichert** (minimal):

```yaml
# hq/00_Dashboard/PINS.md (Frontmatter + Body — Schema V1)
groups:
  - id: pin-g-wolf
    type: project
    slug: Wolf_Street
    title: Wolf Street
    items: [ws09, ws03]
  - id: pin-g-vertrieb
    type: theme
    theme: vertrieb
    title: Vertrieb
    items: [vert02, bk-5398ca96]
  - id: pin-g-privat
    type: theme
    theme: privat
    title: Privat · Life Admin
    items: [bk-8730937f]
```

Alternative V1: reines Markdown mit festem Kommentar-JSON — Entscheidung bei Implementierung; **Logik** bleibt gleich.

**Anzeige** (HTML holt aus Build-Cache):

- Checkbox, Aufgabentext, ID (tooltip), bei Projektgruppen **kein** „noch X Tagen“ pro Zeile.
- Countdown **nur** in Kunden-Kachel-Überschrift / Projekt-Gruppenkopf (Audit aus `Status.md`).

---

## Kategorien-Kacheln (untere Zone)

| Kachel | Inhalt | Pin-Quelle |
|--------|--------|------------|
| **Kunden** | **Eine Kachel pro Kunde** (nicht eine Sammelkachel): Ampel, Audit `DD.MM. (noch X Tagen)`, Zahl offen, Aufgabenliste, Button **Kunde anpinnen**, Links Status/ToDos | → erzeugt `type: project` oben |
| **Vertrieb** | Offen, Top 3, Link `04_Vertrieb/` | → Gruppe `type: theme`, `theme: vertrieb` |
| **Forderungen** | analog | `theme: forderungen` |
| **Intern** | analog | `theme: intern` |
| **Privat** | **Eigene Kachel** — Abschnitte aus BACKLOG Pflege (Privat, ggf. Life Admin) | → Gruppe `theme: privat` |
| **DFSS** | Gate-Zeile, Link `DFSS_ARBEIT.md`, Evidence-Kurzliste | → Gruppe `theme: dfss` |

- **Kunde anpinnen** = Hauptaktion auf der Kachel.  
- Optional pro Zeile: **einzelnes To-do** in die Projekt-Gruppe (wenn Kunde schon gepinnt) oder Gruppe anlegen.  
- Abhaken primär in der **Pin-Zone** (nach Anpinnen).

---

## HTML — technische Richtung (V1)

| Aspekt | Vorschlag |
|--------|-----------|
| Ort | `hq/00_Dashboard/html/` — `index.html`, `app.js`, `styles.css` |
| Daten | `python3 hq/scripts/build_dashboard.py` erzeugt zusätzlich `dashboard_data.json` |
| Server | Lokal `python3 -m http.server` oder Datei öffnen (CORS beachten → kleiner static server) |
| Abhaken | UI → PATCH-Logik schreibt Status in Quell-`ToDos.md` / Pflege via bestehende Build-Sync-IDs |
| Pin/Unpin | UI schreibt nur `PINS.md` → Rebuild JSON |
| Drag & Drop | V1.1: Reihenfolge in Gruppe; V1.0: Buttons „Pin“ / „Unpin“ |

**Referenz:** `hq/09_Archiv/2026-06-nicht-im-alltag/00_Dashboard-html-alt/` (nicht 1:1 übernehmen, nur Patterns).

**Nicht V1:** Cloud-Sync, Multi-User, Mobile-App.

---

## Phasen (Umsetzung — erst nach „jetzt bauen“)

### Phase A — Daten

1. `PINS.md`-Schema final + leere Datei  
2. `build_dashboard.py` → `dashboard_data.json` (Kunden, Themen, Privat, offene Items, bestehende Checks)  
3. Regeln: Projekt-ID nur in `project`-Gruppen des passenden `slug`

### Phase B — HTML read-only

1. Pin-Zone rendert Gruppen aus JSON  
2. Kacheln unten, Links zu MD-Quellen  
3. Kein Schreiben

### Phase C — Schreiben

1. Abhaken in Pin-Zone → Build-Sync (wie `ARBEITSUEBERSICHT` heute)  
2. Pin / Unpin / Gruppe anlegen  
3. Persistenz über Nacht testen

### Phase D — UX

1. Drag Pin zwischen Gruppen  
2. Gruppe collapsible, Pin-Zone Höhe / „Fokusmodus“  
3. Optional: Obsidian parallel weiter nur als Backup-Leseansicht

### Phase E — ARBEITSUEBERSICHT

- Entweder deprecaten zugunsten HTML, oder schlank halten (Export/Notfall ohne Browser).

---

## HQ Assistant (später)

- „Pin ws09 in Wolf Street“ → `PINS.md` project group  
- „Pin bk-xxx unter Privat“ → theme group `privat`  
- „Zeig Pin-Zone“ → liest JSON / PINS

---

## Offen (nächste Planungsrunde)

- [x] Max. Pins gesamt? → **kein hartes Maximum**  
- [x] Kunden → **jeder Kunde eigene Kachel, einzeln anpinnbar** (Projekt-Gruppe)  
- [ ] Beim „Kunde anpinnen“: **alle offenen** To-dos in die Gruppe oder nur **urgent/high**? (V1-Vorschlag: alle offenen)  
- [ ] Englische vs. deutsche UI-Labels im HTML (Vorschlag: **Deutsch**)  
- [ ] Ein Entry-Point: Desktop-Verknüpfung / `make hq-dashboard` o. ä.

---

## Verknüpfung

- Tagesbetrieb heute: [START_HIER.md](START_HIER.md), [ARBEITSUEBERSICHT.md](ARBEITSUEBERSICHT.md)  
- UX-Referenz Archiv: [DASHBOARD_UX_SPEC_V1.md](../09_Archiv/2026-06-quellen-import/Operations_Board/00_Design/DASHBOARD_UX_SPEC_V1.md)  
- DFSS interim: [DFSS_ARBEIT.md](../07_DFSS/DFSS_ARBEIT.md)
