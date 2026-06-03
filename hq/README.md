# Cert-Expert HQ — Unternehmensgedächtnis

**Stand:** 2026-06-02  
**Ort im Repo:** `cert-expert-ai/hq/` (gleicher Git-Stand wie Bots & Doku)

Dieser Ordner ist **System A** (Organisation). Die Bot-Pipeline lebt in `bots/`, `knowledge/`, `projects/`.

---

## Struktur

| Ordner | Zweck |
|--------|--------|
| `00_Dashboard/` | Übersicht, KPIs, Links, **operations_snapshot.md** |
| `01_Master_Dump/` | Unsortiertes, zu klären |
| `02_Operations_Board/` | Tagesgeschäft, Ingest-Log (später) |
| `03_Kundenprojekte/` | **Kunden** — Status, ToDos, Kommunikation, … |
| `04_Vertrieb/` | Angebote, Pipeline |
| `05_Forderungen/` | Mahnungen, offene Posten |
| `06_Software/` | cert-expert-ai, Portal, DFSS |
| `07_DFSS/` | DFSS-Themen |
| `08_Vorlagen/` | Templates (ToDos, neues Kundenprojekt) |
| `09_Archiv/` | Abgeschlossenes |

---

## Kundenprojekte

Siehe `03_Kundenprojekte/_registry.json` und je Kunde:

- `Status.md`
- `ToDos.md` — **maschinenlesbar** (Telegram-Ziel)
- `Kommunikation.md`
- `Audit_2026.md`
- `Dokumente_und_Nachweise.md`
- `Lessons_Learned.md`

**Obsidian (lokal):** Morgens [`00_Dashboard/Tagesbriefing.md`](00_Dashboard/Tagesbriefing.md) — erzeugen mit `python3 hq/scripts/build_dashboard.py` (legt auch [`operations_snapshot.md`](00_Dashboard/operations_snapshot.md) an).

**Fragen-Bot (nur HQ):** [`bots/00_hq_assistant/README.md`](../bots/00_hq_assistant/README.md) — Terminal oder Cursor-Regel **HQ Assistant** (getrennt von GB/SK/EK).

**Nächster Schritt von dir:** Updates per Chat/Cursor (später Telegram) — Schema in `08_Vorlagen/ToDos_template.md`.

---

## Verknüpfung Bots

| HQ | Bot-Repo |
|----|----------|
| `03_Kundenprojekte/TeamFlex/` | `projects/teamflex/` (wenn Event angelegt) |
| Dokumente in `Dokumente_und_Nachweise.md` | `outputs/` + `projects/.../documents/` |

Handoff für Chat-Wechsel: [`docs/CHAT_HANDOFF.md`](../docs/CHAT_HANDOFF.md)

Architektur: [`docs/TARGET_ARCHITECTURE_PROPOSAL.md`](../docs/TARGET_ARCHITECTURE_PROPOSAL.md)
