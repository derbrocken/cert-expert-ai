# Veranstaltung mit besonderer Sicherheitsrelevanz (77200-2 Kap. 5)

**Bot-SDL (kuratiert):** [[base]]  
**Norm-CEKS:** [[../../1_standards/DIN 77200-2/05_veranstaltungen_besondere_sicherheitsrelevanz]]  
**Profil:** [[../../1_standards/DIN 77200-2/anforderungsprofile/77200-2_veranstaltung_besondere_sicherheitsrelevanz]]

---

## SDL-Layer (Schicht 3 von 4)

**Keine Dublette** zu [[../veranstaltungsschutz/README]] — dies ist die **DIN-77200-2-Kap.-5-Zusatzschicht** für Veranstaltungen mit besonderer Sicherheitsrelevanz.

Vollständige Ladereihenfolge für Bots: [[../README#SDL-Layer für Dokumentenbots (Veranstaltung)]]

| Schicht | Modul |
|---------|--------|
| 1 | `veranstaltungsschutz/base.md` — allgemeine Basis |
| 2 | `veranstaltungsschutz/subtypes/{…}.md` — optional (Kampfsport, Konzert, …) |
| **3** | **`veranstaltung_besondere_sicherheitsrelevanz/base.md`** — wenn Kap. 5 / besondere Relevanz |
| 4 | `6_products/{gb\|sk\|ec\|oda}/` — Produktwissen |

## Laden in Blueprints

| Kontext | Module |
|---------|--------|
| **77200-2 Kap. 5** | `veranstaltung_besondere_sicherheitsrelevanz/base.md` |
| Immer empfohlen bei Events | `veranstaltungsschutz/base.md` |
| Genre | `veranstaltungsschutz/subtypes/{subtyp}.md` |

Rohmaterial (nicht direkt für Context Builder): `projects/_knowledge_raw/sdls/veranstaltung_besondere_sicherheitsrelevanz/`
