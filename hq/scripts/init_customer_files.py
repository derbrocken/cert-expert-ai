#!/usr/bin/env python3
"""Create standard MD files for each customer in hq/03_Kundenprojekte/."""

from __future__ import annotations

import json
from pathlib import Path

HQ = Path(__file__).resolve().parents[1]
KP = HQ / "03_Kundenprojekte"
REGISTRY = KP / "_registry.json"


def _status(slug: str, name: str) -> str:
    return f"""# Status — {name}

**Slug:** `{slug}`  
**Stand:** 2026-06-02  
**Phase:** (eintragen: Akquise | Aktiv | Audit | Pausiert)

## Kurzstatus

- **Ampel:** 🟡 (gelb — eintragen)
- **Letzte Aktivität:** —
- **Blocker:** —

## Nächste Meilensteine

1. (eintragen)

## Verknüpfung Bot-Projekte

- `projects/` im Repo: (noch nicht angelegt oder Pfad eintragen)
"""


def _todos(slug: str, name: str) -> str:
    return f"""# ToDos — {name}

**Projekt-Slug:** `{slug}`  
**Letzte Aktualisierung:** 2026-06-02

> **Hinweis:** Trage hier alle offenen Aufgaben ein (ein Block pro Aufgabe).  
> Schema: siehe `hq/08_Vorlagen/ToDos_template.md` und `docs/MOBILE_INPUT_TODO_ARCHITECTURE.md`.

---

## Offen

<!-- Marwan: To-dos aus deiner Liste hier einfügen -->

---

## In Bearbeitung

---

## Erledigt

---
"""


def _kommunikation(name: str) -> str:
    return f"""# Kommunikation — {name}

Chronologisches Log (neueste Einträge oben).

## Vorlage Eintrag

```markdown
### YYYY-MM-DD — Kanal — Thema
- **Von/An:**
- **Inhalt:**
- **Follow-up:**
```

---

## Log

*(noch leer)*
"""


def _audit(name: str) -> str:
    return f"""# Audit 2026 — {name}

## Audit-Ziel / Norm

- (z. B. DIN 77200, Kunde, Datum)

## Checkliste

| Thema | Status | Nachweis |
|-------|--------|----------|
| | offen | |

## Offene Audit-Punkte

*(noch leer)*
"""


def _dokumente(name: str) -> str:
    return f"""# Dokumente und Nachweise — {name}

| Dokument | Typ | Version | Pfad / Link | Status |
|----------|-----|---------|-------------|--------|
| | SK | | | |

## Bot-Outputs (cert-expert-ai)

| Event | SK | EK | GB | ODA |
|-------|----|----|----|-----|
| | | | | |

Pfade typisch: `outputs/` oder `projects/{{event_id}}/documents/`
"""


def _lessons(name: str) -> str:
    return f"""# Lessons Learned — {name}

## Was lief gut

-

## Was verbessern

-

## Für nächstes Projekt übernehmen

-
"""


FILES = {
    "Status.md": lambda s, n: _status(s, n),
    "ToDos.md": lambda s, n: _todos(s, n),
    "Kommunikation.md": lambda s, n: _kommunikation(n),
    "Audit_2026.md": lambda s, n: _audit(n),
    "Dokumente_und_Nachweise.md": lambda s, n: _dokumente(n),
    "Lessons_Learned.md": lambda s, n: _lessons(n),
}


def main() -> None:
    data = json.loads(REGISTRY.read_text(encoding="utf-8"))
    for p in data["projects"]:
        slug = p["slug"]
        name = p["display_name"]
        folder = KP / slug
        folder.mkdir(parents=True, exist_ok=True)
        for fname, fn in FILES.items():
            path = folder / fname
            if not path.exists():
                path.write_text(fn(slug, name), encoding="utf-8")
                print(f"created {path.relative_to(HQ.parent)}")
            else:
                print(f"skip exists {path.relative_to(HQ.parent)}")


if __name__ == "__main__":
    main()
