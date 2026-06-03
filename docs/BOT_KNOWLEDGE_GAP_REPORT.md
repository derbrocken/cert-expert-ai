# Bot-Knowledge-Gap-Report — Dokumentenkette SK → GB → EK → ODA

**Stand:** 2026-05-30  
**Pilot-SDL:** Veranstaltung mit besonderer Sicherheitsrelevanz (DIN 77200-2 Kap. 5)  
**Scope:** Bot-Wissen / Blueprints / Beispiele — **keine** CEKS-Freigabe-Erweiterung, **kein** Portal, **kein** Tool 2

**Abgrenzung:** Qualifikationsfreigabe (`qualifications/04`–`08`) ist für Personalfreigabe relevant, **ersetzt** aber nicht Bot-Wissen für SK/EK/ODA-Inhalte.

---

## Executive Summary

| Bereich | Reifegrad | Kurzbefund |
|---------|-----------|------------|
| **GB (Kampfsport-Event)** | **Hoch** | Blueprint aktiv, SDL/Guides/Examples/Rules/Prompts/Template/Bot |
| **SK / EK / ODA** | **Niedrig** | Nur Registry + Docs; keine Product-MD, keine Blueprints, keine Beispiele |
| **Pilot SDL 77200-2 Kap. 5** | **Mittel (Norm)** / **Niedrig (Bot)** | CEKS-Modul `05_veranstaltungen…` gut; Bot hängt noch an **77200-1** `veranstaltungsschutz` |
| **Dokumentenkette Flow** | **Konzept** | `docs/BLUEPRINT_ARCHITECTURE.md` — **nicht** in Pipeline |

**Empfohlener nächster Schritt:**  
`knowledge/3_sdls/veranstaltung_besondere_sicherheitsrelevanz/base.md` anlegen und GB-Blueprint `gb_event_kap5` (oder Erweiterung `gb_event_kampfsport`) um **77200-2-Kontext + SK-Pflichtfelder** ergänzen — **bevor** SK-Bot-Blueprint.

---

## 1. SDL-Wissen — welche Dateien?

### Pilot: Veranstaltung bes. Sicherheitsrelevanz (77200-2 Kap. 5)

| Datei | Rolle | Bot-relevant? |
|-------|-------|---------------|
| `knowledge/1_standards/DIN 77200-2/05_veranstaltungen_besondere_sicherheitsrelevanz.md` | SDL CEKS: SK/EK-Pflicht, Risiken, Schulungen, Agent-Slots | **Ja** (Normkontext, nicht im Context Builder) |
| `knowledge/1_standards/DIN 77200-2/01_uebersicht.md` | Routing Kap. 5 vs. 77200-1 Veranstaltung | Ja |
| `knowledge/1_standards/DIN 77200-2/03_erforderliche_dokumente.md` | Dokumentenkette, `upstream_sk` | Ja (Flow-Modell) |
| `knowledge/1_standards/DIN 77200-2/04_qualifikationen_und_schulungen.md` | Kap.-5-Schulung 24 UE FK | Grenze Qualifikation/Bot |
| `knowledge/1_standards/DIN 77200-2/anforderungsprofile/77200-2_veranstaltung_besondere_sicherheitsrelevanz.md` | Anhang C.1 Profilvorlage | Input/Profil-Referenz |
| `knowledge/3_sdls/veranstaltung_besondere_sicherheitsrelevanz/README.md` | **Stub** — verweist auf Rohmaterial, **kein** Bot-Modul | **Nein (Lücke)** |

### Aktuell vom GB-Bot geladen (77200-1, nicht Kap. 5)

| Datei | Rolle |
|-------|-------|
| `knowledge/3_sdls/veranstaltungsschutz/base.md` | Phasen, typische Aufgaben Veranstaltungsdienst |
| `knowledge/3_sdls/veranstaltungsschutz/subtypes/kampfsport.md` | Kampfsport-Risiken/Maßnahmen |
| `knowledge/7_blueprint/sdl_registry.json` | `sdl_veranstaltungsdienst` + `sdl_veranstaltung_erhoehte_gefaehrdung` (geplant) |

**Gap:** Kein kuratiertes SDL-Modul unter `3_sdls/` für **77200-2 Kap. 5** (AG-Einstufung, SK+EK-Pflicht, Abgrenzung Anhang A). Registry kennt `sdl_veranstaltung_erhoehte_gefaehrdung`, aber **kein** `context_modules`-Pfad dorthin.

### Querschnitt SDL (alle Kap. 5–8)

| Datei |
|-------|
| `DIN 77200-2/02_allgemeine_anforderungen.md` |
| `DIN 77200-2/06_oepnv.md`, `07_objekte…`, `08_fluechtlings…` |

---

## 2. Produktwissen SK, GB, EK, ODA

| Produkt | Pfad (Ist) | Inhalt | Status |
|---------|------------|--------|--------|
| **GB** | `knowledge/6_products/Gefährdungsbeurteilung/` | `purpose.md`, `content_blocks.md` | **Vorhanden** |
| **SK** | `knowledge/6_products/sicherheitskonzept/.gitkeep` | — | **Fehlt** |
| **EK (EC)** | `knowledge/6_products/einsatzkonzept/.gitkeep` | — | **Fehlt** |
| **ODA** | `knowledge/6_products/oda/.gitkeep` | — | **Fehlt** |

**Dokumentation (nicht Context Builder):**

| Datei | Inhalt |
|-------|--------|
| `docs/GB_BOT_SPEC.md` | GB vollständig |
| `docs/BLUEPRINT_ARCHITECTURE.md` | SK/EC/ODA geplant, Placeholder-Namespaces |
| `docs/PLACEHOLDER_REGISTRY.md` | SK_*, EC_*, ODA_* (planned) |
| `knowledge/6_products/Gefährdungsbeurteilung/purpose.md` | Beziehung SK → GB → EC → ODA |

**CEKS Norm (Dokumentpflicht, kein Bot-Produktmodul):**

- `DIN 77200-2/05_veranstaltungen…` — SK/EK-Typische Dokumente  
- `DIN 77200-2/03_erforderliche_dokumente.md` — Kette, Slots  
- `DIN 77200-1/Erforderliche_Dokumente.md` — Grundlogik  

**Hinweis Pfad-Inkonsistenz:** `knowledge/README.md` nennt `5_products/` / `6_blueprint/`; Ist-Ordner sind `6_products/` / `7_blueprint/`. Blueprint-JSON und `context_builder` nutzen **6_products** — korrekt für Code.

---

## 3. Beispiel-Dokumente (`knowledge/11_examples/`)

| Ordner / Datei | Produkt | Status |
|----------------|---------|--------|
| `gb_gefährdungen/veranstaltungsschutz_kampfsport.md` | GB | **Vorhanden** |
| `gb_schutzmassnahmen/veranstaltungsschutz_kampfsport.md` | GB | **Vorhanden** |
| `gb_tätigkeit/.gitkeep` | GB | **Fehlt** |
| `gb_risikobewertung/.gitkeep` | GB | **Fehlt** |
| `sk_schutzziel/.gitkeep` | SK | **Fehlt** |
| `ec_einsatzbeschreibung/.gitkeep` | EK | **Fehlt** |
| `sicherheitskonzepte/README.md` | SK | Nur README, kein Beispieltext |
| `einsatzkonzepte/README.md` | EK | Nur README |
| `Gefährdungsbeurteilungen/README.md` | GB | Nur README |
| `dienstanweisungen/README.md` | ODA/DI | Nur README |

**Keine** Beispiele für SK, EK oder ODA-Inhaltsblöcke. **Keine** Kap.-5-spezifischen GB-Beispiele (Crowd/Evakuierung auf SK-Ebene).

---

## 4. Blueprints (`knowledge/7_blueprint/`)

| Blueprint-ID | Produkt | SDL (JSON) | Template | Bot-Code |
|--------------|---------|------------|----------|----------|
| `gb_event_kampfsport` | GB | `sdl_veranstaltungsdienst` / kampfsport | `templates/gb_event_kampfsport.docx` | `bots/01_gefaehrdungsbeurteilung/gb_bot.py` |
| `gb_event_kampfsport_lean` | GB | wie oben | — | Test/Variante |
| `gb_event_kampfsport_micro` | GB | wie oben | — | Test/Variante |
| `sk_event_*` | SK | — | — | **Fehlt** |
| `ec_event_kampfsport` | EK | downstream in GB-JSON | — | **Fehlt** |
| `oda_event_standard` | ODA | downstream in GB-JSON | — | **Fehlt** |

**Pilot-Gap:** Kein Blueprint `gb_event_kap5` / `sk_event_kap5` mit `sdl_group: kap5`, Verweis auf `77200-2` und `upstream`/`downstream` für Flow.

**Registry:** `knowledge/7_blueprint/sdl_registry.json` listet `sk_event_kampfsport`, `ec_event_kampfsport` als **future_blueprint_examples** only.

---

## 5. Fehlende Input-Felder (Bot-Perspektive)

### GB `gb_event_kampfsport` — vorhanden

Required/optional: Event, Venue, Zuschauer, SMA, `combat_sports_type`, … — siehe `knowledge/7_blueprint/gb_event_kampfsport.json`.

### Für Pilot **77200-2 Kap. 5** fehlen (fachlich / Flow)

| Feld (Vorschlag) | Warum |
|------------------|-------|
| `norm_context` / `sdl_group` | `kap5` vs. `77200-1` Veranstaltung — Routing |
| `ag_einstufung_besondere_relevanz` | Tatbestand Kap. 5.1 |
| `profil_ref` | `77200-2_veranstaltung_besondere_sicherheitsrelevanz` |
| `sk_status` | vorhanden / teilweise / fehlend |
| `sk_reference` oder `sk_summary` | Flow upstream |
| `ek_status` | AN-Einsatzkonzept |
| `zones_plan_available` | SK/EK-Anhang |
| `fk_schulung_documented` | Kap.-5-FK-Schulung |
| `official_requirements` | vorhanden (optional heute) |

### SK / EK / ODA — komplett offen

Keine `input_schema` in Blueprints. Orientierung nur in `docs/BLUEPRINT_ARCHITECTURE.md` (SK/EC-Namespaces). Für EK typisch: Kräfte, Abschnitte, Funk, Einlass, Evakuierung — aus `05_veranstaltungen…` **nicht** als Bot-Felder modelliert.

---

## 6. Fehlende Regeln / Guides

### Regeln (`knowledge/10_rules/`)

| Datei | Status |
|-------|--------|
| `base/*` (5 Dateien) | **Vorhanden** |
| `products/gb_rules.md` | **Vorhanden** |
| `blueprints/gb_event_kampfsport*.md` | **Vorhanden** (3 Varianten) |
| `products/sk_rules.md` | **Fehlt** (in README dokumentiert) |
| `products/ec_rules.md` | **Fehlt** |
| `products/oda_rules.md` | **Fehlt** |
| `blueprints/sk_event_*`, `ec_event_*`, `oda_*` | **Fehlt** |

### Guides (`knowledge/8_guides/`)

| Bereich | Status | GB-Nutzung |
|---------|--------|------------|
| `content_blocks/risikobewertung.md`, `schutzmassnahmen.md` | Vorhanden | GB |
| `risk_patterns/*` (4 Dateien) | Vorhanden | GB |
| `control_measures/*` (6 Dateien) | Vorhanden | GB |
| `event_phases/ingress_egress.md` | Vorhanden | GB |
| **SK-Inhalte** (Schutzziel, Gefährdungsanalyse AG-Perspektive) | **Fehlt** | — |
| **EK-Inhalte** (Kräfteplanung, Abschnitte, Notfall) | **Fehlt** | — |
| **ODA-Inhalte** (Dienstaufgaben, Meldewege, Verhalten) | **Fehlt** | — |

### Prompts (`prompts/` — Repo-Root, korrekt)

| Datei | Status |
|-------|--------|
| `base/system_base.md`, `hallucination_guard.md`, `open_point_instruction.md` | Vorhanden |
| `products/gb_user_prompt_template.md` | Vorhanden |
| `products/sk_*`, `ec_*`, `oda_*` | **Fehlt** |

---

## 7. Fehlende Output-Schemas

| Produkt | JSON-Schema (Bot) | ai_blocks im Blueprint | DOCX-Template |
|---------|-------------------|------------------------|---------------|
| **GB** | In `gb_bot.py` + Blueprint `ai_blocks` | 6 Blöcke aktiv | **Vorhanden** |
| **SK** | — | Nur in `PLACEHOLDER_REGISTRY` / Architektur-Doc | **Fehlt** |
| **EK** | — | `EC_*` geplant | **Fehlt** |
| **ODA** | — | `ODA_*` geplant | **Fehlt** |

**GB-Lücke im Blueprint vs. Architektur-Doc:** `BLUEPRINT_ARCHITECTURE` nennt `GB_WIRKSAMKEITSKONTROLLE`; aktiv in `gb_event_kampfsport.json` **nicht** (nur 6 ai_blocks). `content_blocks.md` dokumentiert optionalen Block.

**Flow-Exports:** Blueprint definiert `exports: ["risk_findings", "measures", "open_points"]` — **kein** formales JSON-Schema für Downstream (EC/ODA).

---

## 8. Abhängigkeiten SK → GB → EK → ODA (zu modellieren)

Quelle: `docs/BLUEPRINT_ARCHITECTURE.md` Kap. 5 + `DIN 77200-2/03` + `05_veranstaltungen…`.

### Soll-Kette (Kap. 5 Pilot)

```
[Projektkontext / AG]
        ↓
[Sicherheitskonzept SK]     ← AG, Pflicht 77200-2 Kap. 5
  → Schutzziele, Zonen, Kräftebedarf, Behörden/Polizei
        ↓
[Gefährdungsbeurteilung GB]  ← AN, arbeitsschutzbezogen; referenziert SK
  → export: risk_findings, measures, open_points
        ↓
[Einsatzkonzept EK]          ← AN, operativ; importiert GB (+ SK-Niveau)
  → Abschnitte, Funk, Einlass, Evakuierung, Schicht
        ↓
[ODA / DI]                   ← täglicher Dienst; konsistent mit EK + GB-Maßnahmen
        ↓
[Einweisungen EW-EINS]       ← CEKS, nicht Bot-Kern (Tool 2 später)
```

### Propagation (fachlich)

| Von | Nach | Was fließt |
|-----|------|------------|
| SK | GB | Schutzziele, bekannte Risiken, vorgegebene Maßnahmen, Zonen |
| SK | EK | Sicherheitsniveau, Kräfterahmen, Kommunikation |
| GB | EK | Risiken, Maßnahmen, offene Punkte |
| GB + EK | ODA | Dienstaufgaben, Meldewege, Verhalten bei Störung |
| * | * | Offene Punkte upstream → downstream mit Quelle |

### Zustände (Pflicht für Flow-Modus)

| SK/EK-Zustand | Bot-Reaktion |
|---------------|--------------|
| vollständig | Kontext übernehmen |
| veraltet | OP mit Datum |
| partiell | OP je fehlendem Abschnitt |
| fehlend | OP „kein SK/EK“ — **kein** Abbruch |

### Modellierungs-Lücken im Repo

| Thema | Status |
|-------|--------|
| Graph in Blueprint-JSON (`upstream`/`downstream`) | Nur GB → EC/ODA **deklariert**, SK upstream **leer** |
| `upstream_context` in Pipeline | **Nicht implementiert** (`docs/ARCHITECTURE.md`) |
| SK-Abschnitts-Mapping (welche SK-Felder → welche GB-Blöcke) | **Fehlt** |
| EK-Import aus `risk_findings` / `measures` | **Fehlt** |
| ODA-Import aus EK-Ablauf | **Fehlt** |
| Projektordner `projects/.../upstream/` | Konzept in Docs, **kein** Knowledge-Schema |

### Abgrenzung 77200-1 vs. 77200-2 im Flow

| Situation | SK/EK | Profil | Bot-SDL-Module |
|-----------|-------|--------|----------------|
| Veranstaltung **ohne** bes. Relevanz | optional | 77200-1 Anhang A | `veranstaltungsschutz` |
| Veranstaltung **mit** bes. Relevanz (Pilot) | **Pflicht** | 77200-2 Anhang C.1 | **Kap.-5-Modul fehlt** + ggf. kampfsport-Subtyp |

---

## Vergleich Reifegrad: DIN 77200-1-Module vs. Bot-Stack

| Dimension | 77200-1 (CEKS) | Bot-Wissen (Pilot Event) |
|-----------|----------------|---------------------------|
| Norm-Overview | `overview.md` (sehr groß) | `2_regulations/*` Überblicke |
| SDL-Module `3_sdls/` | Teilweise README-only | **veranstaltungsschutz** ausgebaut |
| Dokumentprodukte `6_products/` | GB only | SK/EK/ODA leer |
| Qualifikation | `qualifications/` voll | **bewusst** out of scope |
| Freigabe | `05`–`07` | nicht Bot |
| Blueprints | 1 aktiv (GB) | 3 SK/EC/ODA fehlen |
| Beispiele | 2 GB-Dateien | 0 SK/EK/ODA |
| Implementierung | Knowledge-only | `gb_bot.py` + Template |

---

## VA Kap. 7 vs. `04`–`08` (Kurz)

**Nicht verwechseln:** DIN 77200-2 **Kap. 7** (Objekte) ≠ **VA Kap. 7 V9** (Organisation Qualifikation).

| Thema | Abgedeckt durch `04`–`08`? |
|-------|---------------------------|
| Profil → Codes, Z772, Freigabe | **Ja** |
| SK/EK/ODA **Dokumentinhalt** für Bots | **Nein** |
| VA Organisations-Pflichten (Fristen, Mindestbesetzung EH, WB-Themen) | **Nein** — weiterhin offen |

Für **Dokumentenbots** ist VA Kap. 7 **nicht** durch Freigabelogik ersetzt; höchstens indirekt über spätere Input-Felder (Fristen in GB unwahrscheinlich). Optional: `Dienstanweisungen.md` (VA Erstellung DI) für **ODA**-Bot, separates Thema.

---

## Empfehlungen — Priorität

### P0 — Nächste Datei (eine)

**Anlegen:** `knowledge/3_sdls/veranstaltung_besondere_sicherheitsrelevanz/base.md`

Inhalt (Bot-tauglich, kompakt):

- Abgrenzung Kap. 5 vs. 77200-1 Veranstaltung  
- SK + EK Pflicht; typische SK/EK-Inhalte für Bots  
- Verweis Anhang C.1; keine Normzitate  
- Trigger-Felder für Input (AG-Einstufung)  
- Verknüpfung zu `05_veranstaltungen…` (CEKS, nicht duplizieren)

**Danach** in `gb_event_kampfsport.json` (oder neuer `gb_event_kap5.json`):

- `sdls` um `veranstaltung_besondere_sicherheitsrelevanz/base.md` ergänzen  
- `input_schema`: Kap.-5-Felder + `sk_status`  
- `upstream`: `["sk_event_kap5"]` wenn SK-Blueprint existiert  

### P1 — Dokumentenkette von oben

| Nr | Datei | Zweck |
|----|-------|-------|
| 1 | `6_products/sicherheitskonzept/purpose.md` + `content_blocks.md` | SK-Produktkern |
| 2 | `10_rules/products/sk_rules.md` | SK-Verhalten |
| 3 | `7_blueprint/sk_event_kap5.json` (oder `sk_event_kampfsport`) | SK-Blueprint + input_schema |
| 4 | `11_examples/sk_schutzziel/veranstaltung_besondere_sicherheitsrelevanz.md` | Stil |

### P2 — EK dann ODA

Gleiches Muster für `einsatzkonzept/`, `ec_event_*`, `oda_*`; Guides `ek_kraefteplanung.md`, `oda_meldewege.md`.

### P3 — Flow-Technik (ohne Portal)

- `docs/FLOW_UPSTREAM_SCHEMA.md` oder Erweiterung `BLUEPRINT_ARCHITECTURE` — JSON-Form von `upstream_context`  
- `shared/flow_context.py` — später, nicht Knowledge  

### Bewusst nicht jetzt

- Migration `5_products` ↔ `6_products` Umbenennung in README  
- Tool 2 / Freigabe-Erweiterung  
- VA Kap. 7 V9 Vollintegration (Qualifikation, nicht SK-Bot)  
- Zweite GB-Matrix / qualifications/04 duplizieren  

---

## Anhang — Inventar Schnellreferenz

**SDL Kap. 5 CEKS:** `DIN 77200-2/05_veranstaltungen_besondere_sicherheitsrelevanz.md`  
**SDL Bot (Ist):** `3_sdls/veranstaltungsschutz/base.md`, `subtypes/kampfsport.md`  
**GB Blueprint:** `7_blueprint/gb_event_kampfsport.json`  
**Mapping-Doc:** `docs/GB_EVENT_KAMPFSPORT_MAPPING.md`  
**Architektur Kette:** `docs/BLUEPRINT_ARCHITECTURE.md` §5  

---

*Erstellt als Analyse-Artefakt — keine Architekturänderung, keine Migration.*
