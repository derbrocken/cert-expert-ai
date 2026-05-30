# DIN 77200 — Governance & Architektur

**Pfad:** `knowledge/1_standards/din_77200/`  
**Rolle:** übergreifende **Steuerung** für DIN 77200 — **keine Fachinhalts-Ablage**

---

## Kernaussage

Die Vault-Architektur ist **normzentriert**. Fachinhalte liegen in:

| Normteil | Pfad |
|----------|------|
| DIN 77200-1 | `knowledge/1_standards/DIN 77200-1/` |
| DIN 77200-2 | `knowledge/1_standards/DIN 77200-2/` |

Der Ordner `din_77200/` dient **ausschließlich** der übergreifenden Steuerung: Architektur, Roadmap, Agentenregeln und Dokumentation verworfener/neuer Strukturentscheidungen.

**Nicht hier ablegen:** Anforderungsprofile, Qualifikationssystem, Dienstanweisungen, Schulungsinhalte, Vorlagen.

---

## Governance-Dokumente

| Datei | Zweck |
|-------|-------|
| [[ARCHITECTURE]] | Schichtenmodell, Ablageregeln, Verweise |
| [[AGENT_RULES]] | Regeln für KI-Agenten, Tool 1, Tool 2 |
| [[ROADMAP]] | Geplante Erweiterungen (ohne Migration) |
| [[MIGRATION]] | Historie — **verworfene** Dokumenttyp-Zentralisierung |

---

## Normzentrierte Fachablage (Ist)

```
knowledge/1_standards/
├── DIN 77200-1/
│   ├── overview.md, *.md (CEKS-Module)
│   ├── anforderungsprofile/     ← Anhang A
│   └── qualifikationssystem/    ← Bausteine 01–05
├── DIN 77200-2/
│   ├── *.md (Kap. 5–8 Module)
│   └── anforderungsprofile/     ← Anhang C
└── din_77200/                   ← nur Governance (dieser Ordner)
```

**Beispiele (ausgefüllt):** `knowledge/10_examples/`  
**SDL-Kontext:** `knowledge/3_sdls/`

---

## Architekturregeln (kurz)

1. **Normteil first** — Inhalte unter `DIN 77200-1/` oder `DIN 77200-2/`.
2. **Keine Parallelstruktur** — kein `knowledge/standards/` auf Root-Ebene.
3. **din_77200 = Meta** — nur README, MIGRATION, ARCHITECTURE, AGENT_RULES, ROADMAP.
4. **Dokumenttyp in der Datei** — z. B. Norm-SDL, Referenz Anhang A/C (nicht über Ordner-Dubletten).
5. **Examples ≠ Standards** — Vorlagen hier, ausgefüllte Akten in `10_examples/`.

Details: [[ARCHITECTURE]] · Agenten: [[AGENT_RULES]]
