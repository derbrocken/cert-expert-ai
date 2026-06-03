# HQ Graph Analysis — Phase 1

**Stand:** 2026-06-03  
**Geprüft:** Git-Branch `cursor/din-77200-1-anforderungsprofile` (62 Dateien unter `hq/`)  
**Arbeitskopie `main`:** `hq/` fehlt physisch (nicht gemergt)

---

## 1. Existiert der HQ-Ordner physisch?

| Ort | Status |
|-----|--------|
| Branch `cursor/din-77200-1-anforderungsprofile` | **Ja** — 62 Dateien, vollständige Struktur `hq/00_*` … `hq/09_*` |
| Branch `main` (aktueller Checkout) | **Nein** — `ls hq/` schlägt fehl |
| iCloud Obsidian (`~/Library/Mobile Documents/iCloud~md~obsidian/Documents`) | **Leer** — kein HQ-Spiegel gefunden |

**Fazit:** HQ wurde im Repo angelegt und befüllt, ist auf `main` aber noch nicht verfügbar. Wenn Obsidian HQ zeigt, stammt die Ansicht sehr wahrscheinlich aus einem anderen Checkout, einem nicht gepushten Stand oder einem lokalen Merge — nicht aus dem aktuellen `main`-Working-Tree.

---

## 2. Ist HQ innerhalb der Vault?

Obsidian-Konfiguration liegt unter:

`cert-expert-ai/knowledge/.obsidian/`

`lastOpenFiles` in `workspace.json` enthält **nur** Pfade unter `knowledge/` (z. B. `1_standards/din_77200/...`). Das spricht stark dafür, dass die **Vault-Wurzel = `knowledge/`** ist, nicht das gesamte Repo.

| Pfad | Relativ zu typischer Vault `knowledge/` |
|------|----------------------------------------|
| `hq/` (Repo-Root) | **Außerhalb** der Vault |
| `docs/`, `bots/`, `inputs/` | Ebenfalls außerhalb |
| `knowledge/**/*.md` | **Innerhalb** der Vault |

**Fazit:** Standard-Setup indexiert HQ **nicht**, solange die Vault auf `knowledge/` zeigt. HQ erscheint im Dateiexplorer nur, wenn die Vault auf `cert-expert-ai/` (Repo-Root) oder ein übergeordnetes Verzeichnis zeigt.

---

## 3. Wird HQ von Obsidian indexiert?

Unter Annahme Vault = `knowledge/`:

- HQ-Markdown wird **nicht** in der Knowledge-Suche/Graph-Indexierung berücksichtigt.
- Selbst bei Vault = Repo-Root: HQ hat **0 Wikilinks** (`[[...]]`) in allen 58 Markdown-Dateien.

Unter Annahme Vault = Repo-Root:

- Dateien werden indexiert.
- Graph-Kanten entstehen trotzdem kaum, weil nur **Markdown-Links** (`[text](../path)`) verwendet werden — die erzeugen **keine** Graph-Kanten in Obsidian (nur Wikilinks und bestimmte Embeds).

---

## 4. Warum erscheint HQ ggf. nicht in der Graphansicht?

| Ursache | Gewicht | Erklärung |
|---------|---------|-----------|
| **Keine Wikilinks in HQ** | Hoch | Gesamter `hq/`-Baum: 0× `[[...]]`. Graph zeigt primär Wikilink-Netzwerk. |
| **Vault nur `knowledge/`** | Hoch | HQ liegt außerhalb → gar nicht im Graph. |
| **Orphan-Knoten** | Mittel | Alle HQ-Notizen sind faktisch isoliert (keine eingehenden Wikilinks von `knowledge/`). `graph.json`: `showOrphans: true` — Orphans sichtbar, aber **ohne Kanten** zum CEKS-Netz. |
| **Nur relative Pfad-Links** | Mittel | Operations Board verlinkt z. B. `` [`../03_Kundenprojekte/TeamFlex/ToDos.md`](../03_Kundenprojekte/TeamFlex/ToDos.md) `` — Navigation ja, Graph nein. |
| **README-only Ordner** | Niedrig | `00_Dashboard`, `09_Archiv` sind dünn; wenig Anker-Inhalt. |
| **Branch nicht ausgecheckt** | Hoch (lokal) | Auf `main` existiert `hq/` nicht → Obsidian zeigt ggf. veralteten Cache oder anderen Pfad. |

**Typisches Nutzerbild:** HQ im Explorer sichtbar (Repo-Vault), in der Graph-Ansicht aber unsichtbar oder als lose Punkte ohne Verbindung zu DIN/CEKS-Notizen.

---

## 5. Fehlende Verlinkungen

### 5.1 Intern HQ → HQ

- **Strukturell:** Operations Board → Kunden-`ToDos.md` über Markdown-Links (12 Links) — funktional, nicht graph-relevant.
- **Fehlend für Graph/Second Brain:**
  - Kein Hub-Note `[[HQ Dashboard]]` / MOC
  - Kunden-`Status.md` verlinkt nur 2–3 Nachbar-MDs, nicht `[[Audit_2026]]` als Wikilink
  - `Audit_2026.md` fast überall leer und ohne Rückverlinkung zu `ToDos.md`

### 5.2 HQ → Knowledge (CEKS)

- Nur 4 Querverweise nach `docs/` (z. B. `CHAT_HANDOFF.md`, `MOBILE_INPUT_TODO_ARCHITECTURE.md`) — **Pfade außerhalb Vault `knowledge/`**, Wikilinks fehlen.
- Keine Verknüpfung z. B. `[[Qualifikationsanforderungen]]` ↔ Kundenprojekt TeamFlex.

### 5.3 HQ → fehlende Kunden

Master Dump / Forderungen nennen **AVAS, Faust, Dennis** — ohne Ordner unter `03_Kundenprojekte/` und ohne Wikilink-Ziele.

### 5.4 Broken Wikilinks

**0** kaputte `[[...]]`-Ziele innerhalb HQ (weil keine Wikilinks gesetzt).

---

## 6. Leere Ordner ohne Markdown

| Ordner | Markdown | Anmerkung |
|--------|----------|-----------|
| `hq/scripts/` | **Nein** | Nur `init_customer_files.py` — erwartbar |
| `hq/00_Dashboard/` | README (983 Zeichen) | Minimal, keine KPI-Daten |
| `hq/09_Archiv/` | README (136 Zeichen) | Platzhalter |
| `hq/07_DFSS/` | README + 1 To-do-Datei | Keine Unterordner für Validation/Requirements |
| `hq/03_Kundenprojekte/` | 7 Kunden × 6 MDs | Struktur voll; inhaltliche Lücken in `Audit_2026` (siehe Phase 3) |

**Keine** komplett leeren Ordner ohne jegliche Datei — außer ggf. lokale Ordner für nicht angelegte Kunden (AFAS, Faust).

---

## 7. Ordner außerhalb der Vault

| Pfad | Außerhalb `knowledge/`? |
|------|-------------------------|
| `hq/` | **Ja** (bei Standard-Vault) |
| `docs/` (Architektur, Handoff) | **Ja** |
| `projects/` (Bot-Spur, auf Branch) | **Ja** |
| `outputs/` | **Ja** (generiert, gitignored) |

HQ ist bewusst als **System A** am Repo-Root modelliert (`TARGET_ARCHITECTURE_PROPOSAL.md` auf Feature-Branch), parallel zu **System B** `knowledge/`. Das erklärt die Graph-Trennung — kein Bug, sondern **fehlende Brücken-Links**.

---

## 8. Empfohlene Sofort-Diagnose (für dich in Obsidian)

1. **Einstellungen → Über → Vault-Pfad** notieren: `.../knowledge` oder `.../cert-expert-ai`?
2. Falls nur `knowledge/`: Entweder Vault auf Repo-Root umstellen **oder** Symlink/Spiegel `knowledge/00_HQ → ../hq` (später, nicht in diesem Audit umgesetzt).
3. **Graph-Filter** leeren; **Show orphans** ist bereits an.
4. Git: `git checkout cursor/din-77200-1-anforderungsprofile` oder `hq/` nach `main` mergen, damit Dateisystem und Obsidian übereinstimmen.

---

## 9. Zusammenfassung Phase 1

| Prüfpunkt | Ergebnis |
|-----------|----------|
| Physisch vorhanden | Ja (Feature-Branch), Nein (`main`) |
| In Vault | **Nein**, wenn Vault = `knowledge/` |
| Indexiert | Nur bei Repo-Vault; ohne Wikilinks kaum Graph-Relevanz |
| Graph unsichtbar | Hauptursachen: Vault-Grenze + 0 Wikilinks + Branch-Mismatch |
| Verlinkungen | Markdown ja, Wikilinks/CEKS-Brücke fehlen |
| Leere Ordner | Nur `scripts/` ohne MD; viele inhaltliche Stub-Dateien |
| Außerhalb Vault | `hq/` ja (Standard-Setup) |
