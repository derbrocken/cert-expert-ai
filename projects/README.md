# projects/ — Kunden- und Event-Akten (Bot-Spur)

**Stand:** 2026-06-02  
**HQ-Spiegel:** `hq/03_Kundenprojekte/` (Organisation, To-dos)  
**Handoff:** [`docs/CHAT_HANDOFF.md`](../docs/CHAT_HANDOFF.md)

---

## Zweck

Alles **projektspezifische** Material für Dokument-Bots — **nicht** in `knowledge/`.

| Inhalt | Hier | Nicht hier |
|--------|------|------------|
| Input-JSON pro Event | ✅ | |
| Generierte JSON/DOCX (Kopie) | ✅ optional | `outputs/` (Laufzeit) |
| Upstream SK → EK | ✅ `upstream/` | |
| Normen / SDL | | `knowledge/` |
| To-dos, Kommunikation | | `hq/` |

---

## Schema

```
projects/
└── {project_slug}/
    └── events/
        └── {event_id}/
            ├── project_meta.json
            ├── input_sk.json          # Kopie oder Symlink-Policy: manuell
            ├── input_ec.json
            ├── upstream/
            │   └── sk_output.json     # nach SK-Lauf
            └── documents/
                ├── sk_*.json
                └── sk_*.docx
```

### `project_meta.json` (Minimum)

```json
{
  "project_id": "k1_berlin_2026",
  "display_name": "K1 Amateur Kampfsport Event",
  "hq_customer_slug": null,
  "blueprints": ["sk_event_kampfsport", "ec_event_kampfsport"],
  "status": "active"
}
```

---

## Referenz-Event (Bots)

`projects/k1_berlin_2026/` — K1 ~100 Zuschauer Berlin (SK/EK Inputs aus `inputs/*.json`).

---

## Verknüpfung HQ

| HQ `03_Kundenprojekte/{Slug}/` | `projects/{bot_project_slug}/` |
|-------------------------------|--------------------------------|
| TeamFlex | `teamflex` |
| … | siehe `hq/03_Kundenprojekte/_registry.json` |

`hq_customer_slug` in `project_meta.json` verknüpft Event mit Kunde.
