# Veranstaltung mit besonderer Sicherheitsrelevanz (77200-2 Kap. 5)

**Bot-SDL (kuratiert):** [[base]]  
**Norm-CEKS:** [[../../1_standards/DIN 77200-2/05_veranstaltungen_besondere_sicherheitsrelevanz]]  
**Profil:** [[../../1_standards/DIN 77200-2/anforderungsprofile/77200-2_veranstaltung_besondere_sicherheitsrelevanz]]

---

## SDL-Layer (Schicht 3 von 4) — Sicherheitsrelevanz, nicht Veranstaltungstyp

**Keine Dublette** zu [[../veranstaltungsschutz/README]].  
Dies ist die **optionale Zusatzschicht** für die **Sicherheitsklasse / Einstufung** „besondere Sicherheitsrelevanz“ (DIN 77200-2 Kap. 5) — **orthogonal** zum Veranstaltungstyp in `subtypes/`.

| Dimension | Beispiel | Ordner |
|-----------|----------|--------|
| Veranstaltungstyp | Kampfsport, Konzert, Fußball | `veranstaltungsschutz/subtypes/` — **Schicht 2** |
| Sicherheitsrelevanz | AG stuft Event als besonders sicherheitsrelevant ein | **dieser Ordner** — **Schicht 3** |

**Regel:** **Kampfsport löst Schicht 3 nicht aus.** Ein Kampfsport-Turnier kann Schicht 1+2 ohne diese Datei nutzen. Nur bei dokumentierter **AG-Einstufung** Schicht 3 zusätzlich laden.

Vollständige Layer-Logik: [[../README#SDL-Layer für Dokumentenbots (Veranstaltung)]]

| Schicht | Modul |
|---------|--------|
| 1 | `veranstaltungsschutz/base.md` — Veranstaltungsschutz (Basis) |
| 2 | `veranstaltungsschutz/subtypes/{typ}.md` — **Veranstaltungstyp** (optional) |
| **3** | **`veranstaltung_besondere_sicherheitsrelevanz/base.md`** — **nur** wenn Einstufung/Kap. 5 zutrifft |
| 4 | `6_products/{gb\|sk\|ec\|oda}/` — Produktwissen |

### Wann Schicht 3 laden?

| Ja (laden) | Nein (nicht laden) |
|------------|-------------------|
| Input/ Auftrag: besondere Sicherheitsrelevanz, 77200-2 Kap. 5, Anhang C.1 | Nur `event_type: Kampfsport` / Subtyp kampfsport |
| Profil `77200-2_veranstaltung_besondere_sicherheitsrelevanz` | Norm nur 77200-1 / Anhang A |
| SK+EK-Pflicht im Projekt dokumentiert | „Großes Event“ ohne AG-Einstufung |

**Kein** eigener Ordner `kampfsport_besonders/` o. Ä. — Kombination nur über **mehrere** `context_modules`-Einträge.

## Laden in Blueprints (`context_modules`)

```yaml
sdls:
  - veranstaltungsschutz/base.md
  - veranstaltungsschutz/subtypes/kampfsport.md          # Veranstaltungstyp — optional
  - veranstaltung_besondere_sicherheitsrelevanz/base.md  # nur wenn Einstufung zutrifft
```

| Modul | Wann |
|-------|------|
| `veranstaltung_besondere_sicherheitsrelevanz/base.md` | **Nur** bei Kap.-5-Einstufung |
| `veranstaltungsschutz/base.md` | Bei allen Event-Bots empfohlen |
| `veranstaltungsschutz/subtypes/{typ}.md` | Wenn Veranstaltungstyp bekannt (unabhängig von Schicht 3) |

Rohmaterial (nicht direkt für Context Builder): `projects/_knowledge_raw/sdls/veranstaltung_besondere_sicherheitsrelevanz/`
