# Agent Onboarding — Cert-Expert AI / DIN 77200

**Zweck:** Ein neuer Cursor-Agent (oder ein Agent nach Kontext-Reset) soll sich **innerhalb weniger Minuten** im Projekt orientieren — ohne Fachnorm neu zu erfinden und ohne die Vault-Struktur umzubauen.

**Das ist:** Governance und Orientierung.  
**Das ist nicht:** Tool-2-Implementierung, DIN-Facherweiterung, Migration.

---

## Lesereihenfolge (Pflicht)

| Nr | Datei | Warum |
|----|-------|-------|
| 1 | **AGENT_ONBOARDING.md** (diese Datei) | Einstieg, Regeln, Stopps |
| 2 | [[CURRENT_STATE]] | Was existiert heute — Ist-Stand |
| 3 | [[ARCHITECTURE]] | Wo gehört welcher Inhalt hin |
| 4 | [[ROADMAP]] | Was geplant ist — ohne selbst umz planen |
| 5 | [[AGENT_RULES]] | Retrieval, Pfade, inhaltliche Grenzen |

**Ergänzend bei Arbeit:**

- [[DOCUMENT_TYPES]] — Dokumenttypen und Ablage
- [[NAMING_CONVENTIONS]] — Namens- und Ordnerregeln
- [[AGENT_WORKFLOW]] — Standardablauf vor/nach Änderungen

---

## Hauptstruktur (stabil — nicht umbauen)

```
knowledge/1_standards/
├── DIN 77200-1/          ← Fachlich: CEKS, Anhang A, Qualifikationssystem
├── DIN 77200-2/          ← Fachlich: besondere SDL Kap. 5–8, Anhang C
└── Governance/
    └── DIN 77200/        ← Meta: Architektur, Agenten, Roadmap (dieser Ordner)
```

| Ordner | Rolle |
|--------|-------|
| `DIN 77200-1/` | **Grundsystem** — Qualifikation, Profil (Anhang A), CEKS-Module, Qualifikationssystem V1 |
| `DIN 77200-2/` | **Besondere SDL** — Zusatzanforderungen, Anhang C, **kein** eigenes Qualifikationssystem |
| `Governance/DIN 77200/` | **Steuerung** — keine Fachvorlagen, keine Normtexte |

**Klare Regel:** Fachinhalte bleiben in `DIN 77200-1/` und `DIN 77200-2/`. Governance liegt **nur** unter `Governance/DIN 77200/`. **Keine neue Parallelstruktur** (z. B. `knowledge/standards/`, `din_77200/` als Inhaltsablage).

Weitere Schichten (nur lesen, nicht verschieben):

- `knowledge/3_sdls/` — SDL-Kontext
- `knowledge/10_examples/` — ausgefüllte Projektbeispiele
- `inputs/raw_standards/` — Primärquellen (PDF)

---

## Was bereits fertig ist (nicht neu erfinden)

| Bereich | Status | Pfad |
|---------|--------|------|
| Anforderungsprofile V1 | **fertig** | `DIN 77200-1/anforderungsprofile/`, `DIN 77200-2/anforderungsprofile/` |
| Generator Anforderungsprofile | **fertig** | `scripts/generate_anforderungsprofile.py` |
| DIN 77200-1 Wissensmodule | **fertig** | `DIN 77200-1/*.md`, `overview.md` |
| DIN 77200-2 Wissensmodule | **fertig** | `DIN 77200-2/README.md`, `01_`–`08_*.md` |
| Qualifikationssystem V1 | **fertig** | `DIN 77200-1/qualifikationssystem/` (01–05) |
| Governance-Grundstruktur | **fertig** | `Governance/DIN 77200/` |

Details: [[CURRENT_STATE]]

---

## Was nicht mehr umgebaut werden soll

Ohne **explizite Freigabe** des Nutzers:

- Ordnerstruktur `DIN 77200-1` / `DIN 77200-2` / `Governance/DIN 77200`
- Anforderungsprofile V1 (Dateinamen `77200-1_*`, `77200-2_*`)
- Generator-Ausgabepfade
- Verschieben von Fachmodulen in Governance
- Dokumenttyp-first-Zentralisierung unter Governance (verworfen — [[MIGRATION]])

---

## Was als Nächstes kommt (Roadmap — nicht vorausimplementieren)

| Thema | Status | Hinweis |
|-------|--------|---------|
| Qualifikationssystem vertiefen | geplant | Erweiterung in `qualifikationssystem/`, nicht Parallelordner |
| Qualifikationsmatrix | **V2-Logik** (Revier, Intervention, ÖPNV) | `qualifications/04_qualifikationsmatrix_logik.md` — keine Personalzeilen |
| Personalfreigabe | geplant | Prozess + Nachweislogik |
| SDL-Freigabelogik | **V1 vorhanden** | `qualifikationssystem/05_sdl_freigabelogik.md` — vertiefen |
| Tool-2-Anbindung | **spätere Perspektive** | Projektakten — **noch nicht implementiert** |

Siehe [[ROADMAP]]. Tool 2 ist **Zielbild**, keine bestehende Codebasis in diesem Repo.

---

## Schnell-Routing (Fachfrage)

| Frage | Erst laden |
|-------|------------|
| Profil, Anhang A, 4.11 | `DIN 77200-1/Anforderungsprofile.md` |
| A/B/C, §34a, Ersthelfer | `DIN 77200-1/Qualifikationsanforderungen.md` |
| Besondere SDL, SK/EK | `DIN 77200-2/README.md` → Modul 05–08 |
| Profil-Vorlage | `DIN 77200-*/anforderungsprofile/77200-*_*.md` |
| Freigabeentscheid | `DIN 77200-1/qualifikationssystem/05_sdl_freigabelogik.md` |

---

## Erste Aktion bei Unklarheit

1. [[CURRENT_STATE]] lesen  
2. [[AGENT_RULES]] prüfen  
3. Nutzer fragen — **nicht** strukturell improvisieren  

Verifikation gegen Norm: `inputs/raw_standards/` — nur vor produktiven Entscheidungen, nicht als Ersatz für CEKS-Module.
