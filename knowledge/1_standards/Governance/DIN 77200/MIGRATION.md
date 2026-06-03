# DIN 77200 — Migrationshistorie

---

## Aktuelle Entscheidung (2026-05-30)

**Normzentrierte Vault-Architektur — stabil, keine weitere Inhaltsmigration.**

| Bereich | Pfad | Rolle |
|---------|------|-------|
| Fachinhalte 77200-1 | `knowledge/1_standards/DIN 77200-1/` | CEKS, Anhang A, Qualifikationssystem |
| Fachinhalte 77200-2 | `knowledge/1_standards/DIN 77200-2/` | Kap. 5–8, Anhang C |
| Governance | `knowledge/1_standards/Governance/DIN 77200/` | README, CURRENT_STATE, MIGRATION, ARCHITECTURE, AGENT_RULES, ROADMAP |

`Governance/DIN 77200/` ist **keine** Inhaltsablage.

---

## Governance-Umzug (2026-05-30)

Governance-Dateien verschoben von `knowledge/1_standards/din_77200/` nach `knowledge/1_standards/Governance/DIN 77200/`.

**Begründung:** Klare Trennung zwischen fachlichen Standardordnern (`DIN 77200-1/`, `DIN 77200-2/`) und übergreifender Governance.

---

## Verworfene Strukturidee

**Dokumenttyp-first unter `din_77200/`** (Commit `7e15384`, kurz auf `main` als Skeleton):

Geplante, aber **nicht weiterverfolgte** Unterordner:

```
din_77200/                    ← historisch, ersetzt durch Governance/DIN 77200/
├── anforderungsprofile/
├── qualifikationssystem/
├── schulungen/
├── personenfreigaben/
├── dienstanweisungen/
├── gefaehrdungsbeurteilungen/
├── sicherheitskonzepte/
├── einsatzkonzepte/
├── qualifikationsmatrizen/
├── part_1/
└── part_2/
```

**Warum verworfen:** Doppelstruktur neben `DIN 77200-1/` und `DIN 77200-2/`; Retrieval und Agentenlogik bleiben am Normteil orientiert.

**Maßnahme:** Leere Ordner entfernt. Keine Dateien aus 77200-1/77200-2 verschoben.

---

## Bereits umgesetzt (normzentriert)

| Inhalt | Ziel (Ist) |
|--------|------------|
| Anforderungsprofile Anhang A | `DIN 77200-1/anforderungsprofile/` |
| Anforderungsprofile Anhang C | `DIN 77200-2/anforderungsprofile/` |
| Qualifikationssystem | `DIN 77200-1/qualifikationssystem/` |
| CEKS-Module | `DIN 77200-1/*.md`, `DIN 77200-2/*.md` |
| Governance | `Governance/DIN 77200/` |

---

## Bereinigung `10_examples/anforderungsprofile/`

Frühere Kopien mit Präfix `77200-1_*` / `77200-2_*` — **Dubletten** der normzentrierten Vorlagen.

**Status:** Entfernt (Commit `128353d`).

---

## Falsche Pfadvarianten (historisch)

| Falsch | Richtig |
|--------|---------|
| `knowledge/standards/din_77200/...` | `knowledge/1_standards/DIN 77200-1/...` bzw. `DIN 77200-2/...` |
| `knowledge/1_standards/din_77200/` (Governance) | `knowledge/1_standards/Governance/DIN 77200/` |
| Generator → `standards/din_77200/anforderungsprofile` | Split → `1_standards/DIN 77200-{1,2}/anforderungsprofile/` |

---

## Nicht migrieren

- CEKS-Module aus `DIN 77200-1/` / `DIN 77200-2/`
- Fachvorlagen nach `Governance/DIN 77200/`
- Ausgefüllte Beispiele nach `1_standards/` (bleiben in `10_examples/`)

---

## Referenz

Governance: [[README]] · Architektur: [[ARCHITECTURE]] · Agenten: [[AGENT_RULES]]
