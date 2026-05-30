# Veranstaltungsschutz — allgemeine SDL-Basis (77200-1)

**Rolle:** **Schicht 1** der Bot-SDL-Ladereihenfolge für Veranstaltungen (allgemeiner Veranstaltungsdienst).

| Datei | Inhalt |
|-------|--------|
| [[base]] | Phasen, typische Aufgaben, Gefährdungs-/Maßnahmen-Raster, Schnittstellenlogik |
| `subtypes/*.md` | **Schicht 2** — **Veranstaltungstypen** (s. unten), keine Sicherheitsklassen |

**Norm-CEKS (nicht Bot-Kontext):** [[../../1_standards/DIN 77200-1/anforderungsprofile/77200-1_veranstaltungsdienst]]  
Besondere Sicherheitsrelevanz (Kap. 5): separater SDL-Ordner — [[../veranstaltung_besondere_sicherheitsrelevanz/README]]

---

## Ordner `subtypes/` — Veranstaltungstypen

**Veranstaltungstyp** = Genre/Format (Kampfsport, Fußball, Konzert, Festival, Messe, …).  
Beschreibt **was** für ein Event stattfindet — **nicht**, ob der AG es als besonders sicherheitsrelevant einstuft.

| Veranstaltungstyp | Datei | Status |
|-------------------|------|--------|
| Kampfsport | [[subtypes/kampfsport]] | vorhanden |
| Fußball, Konzert, Festival, Messe, … | `subtypes/{name}.md` | bei Bedarf anlegen |

Jeder Subtyp ergänzt genrespezifische Risiken und Maßnahmen (z. B. Ring, Fan-Lager).  
**Kampfsport ≠ besondere Sicherheitsrelevanz.** Ein Kampfsport-Event kann 77200-1 **oder** zusätzlich 77200-2 Kap. 5 sein — das steuert **Schicht 3**, nicht dieser Subtyp.

---

## Bot-Beispiele (`context_modules.sdls`)

```yaml
# Kampfsport normal — Schicht 1 + 2
sdls:
  - veranstaltungsschutz/base.md
  - veranstaltungsschutz/subtypes/kampfsport.md

# Kampfsport + besondere Sicherheitsrelevanz — Schicht 1 + 2 + 3
sdls:
  - veranstaltungsschutz/base.md
  - veranstaltungsschutz/subtypes/kampfsport.md
  - veranstaltung_besondere_sicherheitsrelevanz/base.md   # nur bei AG-Einstufung
```

Schicht 3 nur laden, wenn die **Einstufung** im Auftrag/Blueprint/Input belegt ist — nicht wegen `kampfsport`.

---

## Abgrenzung zu `veranstaltung_besondere_sicherheitsrelevanz/`

| | `veranstaltungsschutz/` (hier) | `veranstaltung_besondere_sicherheitsrelevanz/` |
|--|-------------------------------|-----------------------------------------------|
| Dimension | **Veranstaltungstyp** + allgemeine Event-Logik | **Sicherheitsrelevanz / Einstufung** (Kap. 5) |
| Norm | 77200-1 Veranstaltungsdienst | **77200-2 Kap. 5** |
| Inhalt | Phasen, Crowd, Genre-Risiken | AG-Einstufung, SK+EK-Pflicht, Schutzbedarf |
| Bot | Schicht 1 (+ optional 2) | Schicht 3 **optional**, unabhängig vom Typ |

Vollständige Layer-Logik: [[../README#SDL-Layer für Dokumentenbots (Veranstaltung)]]
