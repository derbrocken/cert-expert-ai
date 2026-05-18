# Cert-Expert AI — Knowledge & Context Architecture

Version: 1.1 | Aktualisiert: 2026-05-18 | Status: Planung

---

## Grundprinzipien

### 1. Selektives Laden

Das System lädt **niemals** alle Wissensinhalte gleichzeitig in das Modell.
Jede Dokumentgenerierung folgt einer kontrollierten Sequenz:

```
Blueprint-Auswahl
      ↓
Context Assembly (selektiv, komposit)
      ↓
Relevante Wissensmodule werden zusammengestellt
      ↓
KI-Generierung (Qwen, nur mit assembled context)
      ↓
QA-Prüfung
      ↓
Renderer (Node.js DOCX)
```

### 2. Modulare Komposierbarkeit

Wissen ist **nicht um einzelne Blueprints herum organisiert**.
Jedes Wissensmodul existiert als unabhängige, wiederverwendbare Einheit.

Blueprints **referenzieren** Module — sie besitzen sie nicht.
Mehrere Blueprints können dieselben Module teilen.

**Grundprinzip:**
```
gb_event_kampfsport = product:gb + sdl:veranstaltungsschutz + sdl:kampfsport
                    + standard:vstaettvo + standard:dguv_v1
                    + rules:base + rules:product:gb
                    + guide:risikobewertung + guide:schutzmassnahmen
                    + example:gb_gefaehrdungen:veranstaltungsschutz_kampfsport

gb_event_festival   = product:gb + sdl:veranstaltungsschutz + sdl:festival
                    + standard:vstaettvo + standard:dguv_v1
                    + rules:base + rules:product:gb
                    + guide:risikobewertung + guide:schutzmassnahmen
                    + example:gb_gefaehrdungen:veranstaltungsschutz_festival

gb_object_standard  = product:gb + sdl:objektschutz + sdl:zugang_kontrolle
                    + standard:arbschg + standard:dguv_v1
                    + rules:base + rules:product:gb
                    + guide:risikobewertung
                    + example:gb_gefaehrdungen:objektschutz_standard
```

Dieselben `rules:base`-Module und `guide:risikobewertung` werden von allen drei Blueprints
geteilt. Nur die SDL-Module und Beispiele unterscheiden sich.

### 3. Zwei Wissensschichten

| Schicht | Ordner | Beschreibung |
|---|---|---|
| **Globales Wissen** | `knowledge/` | Wiederverwendbares, kuratiertes Fachwissen. Langlebig, gepflegt von Cert-Expert. Nicht kundenbezogen. |
| **Projektspezifische Arbeitsdaten** | `projects/` | Konkrete Projektinstanzen: Kundendaten, generierte Dokumente, Upstream-Dokumente, QA-Status, Freigaben. |

Diese Trennung ist fundamental. `knowledge/` enthält niemals Kundendaten.
`projects/` enthält kein generisches Fachwissen — nur projektbezogene Instanzen.

Vollständige Spezifikation der `projects/`-Schicht: `docs/PROJECT_ARCHITECTURE.md`.

---

## 1. Wissenskategorien

Das Wissen ist in acht Kategorien unterteilt. Jede Kategorie ist nach ihrem
**intrinsischen Typ** organisiert — nicht danach, welcher Blueprint sie verwendet.

### 1.1 Standards (`knowledge/standards/`)

Rechtliche Regelwerke, Normen und Verordnungen als Orientierungsrahmen.
Gespeichert als **Überblicksdokumente** — kein Volltext, keine zitierfähigen Nummern.

**Organisationsprinzip:** Ein Unterordner pro Regelwerk.
Jeder Ordner enthält `overview.md` und optional thematische Untermodule.

```
standards/
├── arbschg/
│   └── overview.md             ← §5 GB-Pflicht, Grundstruktur
├── dguv_v1/
│   └── overview.md             ← Grundsätze Prävention, TOP-Prinzip
├── vstaettvo/
│   └── overview.md             ← Versammlungsstättenverordnung (Länderüberblick)
├── bewachv/
│   └── overview.md             ← BewachV, §34a GewO, Sachkundeprüfung
├── betrsichv/
│   └── overview.md             ← Betriebssicherheitsverordnung (Objekt/Maschinen)
├── arbstaettv/
│   └── overview.md             ← Arbeitsstättenverordnung
└── din_vde/
    └── overview.md             ← Relevante Normfamilien (Überblick, keine Nummern)
```

**Selektionsregel:** Blueprints referenzieren explizit, welche Standards geladen werden.
VStättVO wird nur für eventbezogene Blueprints geladen. BetrSichV nur für Objekt-Blueprints.

### 1.2 SDLs — Sicherheitsdienstleistungs-Wissensmodule (`knowledge/sdls/`)

Fachliches Domänenwissen pro Sicherheitsdienstleistungsbereich.
Jede SDL definiert: typische Gefährdungen, Risikoprofile, Schutzmaßnahmen,
branchenübliche Vorgehensweisen.

**Organisationsprinzip:** Bereichsordner → `base.md` (allgemein) + `subtypes/` (spezifisch).
Subtypes werden **zusätzlich** zu base geladen, nicht anstelle davon.

```
sdls/
├── veranstaltungsschutz/
│   ├── base.md                 ← Basiswissen Veranstaltungsschutz (alle Events)
│   ├── crowd_management.md     ← Menschenmassen, Eskalation, Evakuierung
│   └── subtypes/
│       ├── kampfsport.md       ← K1, MMA, Boxen: Ringbereich, Sportmedizin, Fans
│       ├── festival.md         ← Mehrtages, Camping, Open Air, Infrastruktur
│       ├── konzert.md          ← Bühne, Moshpit, Crowd-Dynamik, Fan-Zonen
│       └── messe.md            ← Ausstellungsfläche, Aussteller, Öffnungszeiten
│
├── objektschutz/
│   ├── base.md                 ← Basiswissen Objektschutz (alle Objekte)
│   ├── zugang_kontrolle.md     ← Zutrittskontrolle, Schlüssel, Ausweise
│   └── subtypes/
│       ├── standard_objekt.md  ← Büro, Gewerbe, Lager
│       ├── sondergebaeude.md   ← Kritische Infrastruktur, besonderer Schutzbedarf
│       └── opv.md              ← Öffentlicher Personenverkehr, Bahnhöfe
│
├── interventionsdienst/
│   ├── base.md                 ← Alarmreaktion, Anfahrt, Lagefeststellung
│   └── subtypes/
│       └── mobile_reaktion.md  ← Mobiler Einsatz, Alleinarbeit
│
├── mobile_sicherheit/
│   ├── base.md                 ← Streifendienst, Fahrzeugkontrolle, Protokollierung
│   └── subtypes/
│       └── alleinarbeit.md     ← Risiken bei Alleinarbeit, Totmannfunktion
│
├── unterkunft/
│   ├── base.md                 ← Gemeinschaftsunterkünfte, Zutrittskontrolle
│   └── subtypes/
│       ├── gefluechtete.md     ← Soziale Risiken, Sprachbarrieren, Konflikte
│       └── wohnheim.md         ← Wohnheimbetrieb, Brandschutz
│
├── empfangsdienst/
│   └── base.md                 ← Besucherempfang, Zutrittsberechtigung, Telefon
│
└── opv/
    └── base.md                 ← ÖPNV-Sicherheitsdienst, Fahrgastkontakt, Eskalation
```

### 1.3 Products (`knowledge/products/`)

Wissen über die Cert-Expert-Dokumentprodukte: Zweck, Aufbau, Inhaltsblöcke und
Abgrenzungen. Auch: Corporate Language, Terminologie und Formulierungsstandards.

**Organisationsprinzip:** Ein Unterordner pro Dokumentprodukt.

```
products/
├── gefaehrdungsbeurteilung/
│   ├── purpose.md              ← Zweck, rechtliche Grundlage, Abgrenzung
│   ├── structure_guide.md      ← Typische Kapitelstruktur, was wo hingehört
│   └── content_blocks.md       ← GB_*-Platzhalter: was jeder Block enthalten muss
│
├── sicherheitskonzept/
│   ├── purpose.md
│   ├── structure_guide.md
│   └── content_blocks.md       ← SK_*-Platzhalter
│
├── einsatzkonzept/
│   ├── purpose.md
│   ├── structure_guide.md
│   └── content_blocks.md       ← EC_*-Platzhalter
│
├── oda/
│   ├── purpose.md
│   └── content_blocks.md       ← ODA_*-Platzhalter
│
└── cert_expert/
    ├── terminology.md           ← Interne Begriffe, bevorzugte Formulierungen
    ├── forbidden_phrases.md     ← Ausdrücke, die Cert-Expert nicht verwendet
    └── services_overview.md     ← Leistungsportfolio (für Kontext, nicht Zitat)
```

### 1.4 Blueprints (`knowledge/blueprints/`)

Maschinenlesbare Konfigurationsdateien. Jede Datei beschreibt einen Blueprint als
**Komposition von Modulen** aus anderen Kategorien. Blueprint-Configs werden von
`shared/blueprint_loader.py` gelesen — sie gelangen **nicht direkt** in den Qwen-Kontext.

**Struktur einer Blueprint-Konfiguration:**

```json
{
  "blueprint_id": "gb_event_kampfsport",
  "display_name": "Gefährdungsbeurteilung — Kampfsportveranstaltung",
  "version": "1.0",
  "template_file": "templates/gb_event_kampfsport.docx",
  "modes": ["standalone", "flow"],

  "context_modules": {
    "standards":  ["vstaettvo/overview.md", "dguv_v1/overview.md", "arbschg/overview.md"],
    "sdls":       ["veranstaltungsschutz/base.md", "veranstaltungsschutz/subtypes/kampfsport.md"],
    "products":   ["gefaehrdungsbeurteilung/purpose.md", "gefaehrdungsbeurteilung/content_blocks.md"],
    "rules":      ["base/hallucination_boundaries.md", "base/open_points_rules.md",
                   "base/citation_rules.md", "products/gb_rules.md",
                   "blueprints/gb_event.md"],
    "guides":     ["content_blocks/risikobewertung.md", "content_blocks/schutzmassnahmen.md"],
    "examples":   ["gb_gefaehrdungen/veranstaltungsschutz_kampfsport.md",
                   "gb_schutzmassnahmen/veranstaltungsschutz_kampfsport.md"],
    "prompts":    ["base/system_base.md", "base/hallucination_guard.md",
                   "base/open_point_instruction.md", "products/gb_user_prompt_template.md"]
  },

  "conditional_modules": [
    {
      "condition": "input.live_music == true",
      "add": { "sdls": ["veranstaltungsschutz/subtypes/konzert.md"] }
    },
    {
      "condition": "input.outdoor_area == true",
      "add": { "sdls": ["veranstaltungsschutz/crowd_management.md"] }
    }
  ],

  "input_schema": { "...": "see BLUEPRINT_ARCHITECTURE.md" },
  "ai_blocks": ["GB_TAETIGKEIT", "GB_GEFAEHRDUNGEN", "GB_RISIKOBEWERTUNG",
                "GB_SCHUTZMASSNAHMEN", "GB_VERANTWORTLICHKEITEN", "GB_OFFENE_PUNKTE"],
  "upstream": [],
  "downstream": ["ec_event_kampfsport", "oda_standard"],
  "exports": ["risk_findings", "measures", "open_points"]
}
```

**Kompositions-Prinzip:** `gb_event_festival` teilt alle `base`-Module mit
`gb_event_kampfsport`, tauscht aber `kampfsport.md` gegen `festival.md` und lädt
andere Beispiele. Nur das Unterschiedliche wird neu definiert.

### 1.5 Rules (`knowledge/rules/`)

Harte Regeln für Bot-Verhalten. Die wichtigste Kategorie für Halluzinationsschutz
und OFFENER PUNKT-Logik.

**Organisationsprinzip:** Drei Ebenen — `base/` (universell, immer), `products/`
(per Dokumentprodukt), `blueprints/` (per Blueprint für Sonderregeln).

```
rules/
├── base/                        ← Immer geladen, unabhängig vom Blueprint
│   ├── hallucination_boundaries.md
│   ├── open_points_rules.md
│   ├── citation_rules.md
│   └── output_format_rules.md
│
├── products/                    ← Pro Dokumentprodukt, immer wenn dieses Produkt aktiv
│   ├── gb_rules.md              ← GB-spezifische QA-Regeln (alle GB-Blueprints)
│   ├── sk_rules.md
│   ├── ec_rules.md
│   └── oda_rules.md
│
└── blueprints/                  ← Nur wenn dieser Blueprint aktiv ist (Sonderregeln)
    ├── gb_event.md              ← Gilt für alle GB-Event-Blueprints
    ├── gb_event_kampfsport.md   ← Nur für Kampfsport-spezifische Sonderregeln
    ├── gb_object.md             ← Gilt für alle GB-Objekt-Blueprints
    └── gb_accommodation.md      ← Nur für Unterkunfts-Blueprints
```

**Ladereihenfolge:** `base/*` → `products/{product}.md` → `blueprints/{blueprint}.md`
Jede Ebene kann Regeln der vorherigen Ebene präzisieren, aber nicht außer Kraft setzen.

### 1.6 Examples (`knowledge/examples/`)

Positiv-Beispiele für gut formulierten fachlichen Inhalt pro Inhaltsblock.
Zeigen akzeptierbaren Schreibstil und Detailtiefe ohne Halluzinationen zu provozieren.

**Organisationsprinzip:** Erster Level = Inhaltsblock (Platzhaltertyp).
Zweiter Level = SDL-Bereich und Subtyp. Mehrere Blueprints können dieselben Beispiele nutzen.

```
examples/
├── gb_taetigkeit/
│   ├── veranstaltungsschutz_kampfsport.md
│   ├── veranstaltungsschutz_festival.md
│   ├── veranstaltungsschutz_konzert.md
│   ├── objektschutz_standard.md
│   └── mobile_sicherheit.md
│
├── gb_gefaehrdungen/
│   ├── veranstaltungsschutz_kampfsport.md
│   ├── veranstaltungsschutz_festival.md
│   ├── objektschutz_standard.md
│   └── unterkunft_gefluechtete.md
│
├── gb_risikobewertung/
│   ├── veranstaltungsschutz_kampfsport.md
│   └── objektschutz_standard.md
│
├── gb_schutzmassnahmen/
│   ├── veranstaltungsschutz_kampfsport.md
│   └── objektschutz_standard.md
│
├── sk_schutzziel/
│   └── veranstaltungsschutz_standard.md
│
└── ec_einsatzbeschreibung/
    └── veranstaltungsschutz_kampfsport.md
```

**Namenskonvention:** `{placeholder_namespace}_{sdl_domain}_{sdl_subtype}.md`
Beispiel: `gb_gefaehrdungen/veranstaltungsschutz_kampfsport.md`
→ Inhaltsblock `GB_GEFAEHRDUNGEN`, SDL-Bereich Veranstaltungsschutz, Subtyp Kampfsport.

### 1.7 Guides (`knowledge/guides/`)

Schreibanleitungen. Erklären, wie ein Abschnitt aufgebaut sein muss, welche
Strukturelemente erwartet werden und welche Formulierungsmuster funktionieren.

**Organisationsprinzip:** `content_blocks/` (wie schreibt man was?),
`writing_style/` (wie schreibt Cert-Expert generell?).

```
guides/
├── content_blocks/
│   ├── risikobewertung.md       ← Wahrscheinlichkeit × Schwere, Ergebnismatrix
│   ├── gefaehrdungsanalyse.md   ← Systematische Erfassung, Kategorien
│   ├── schutzmassnahmen.md      ← S-T-O-P-Prinzip, Maßnahmenhierarchie
│   ├── verantwortlichkeiten.md  ← Rollen, Zuständigkeiten, Befugnisse
│   └── offene_punkte.md         ← Formulierung, Priorisierung, Nachverfolgung
│
└── writing_style/
    ├── audit_near_writing.md    ← Sachlicher Ton, keine Wertungen, keine Weichspüler
    ├── open_point_formulation.md← Wie wird [OFFENER PUNKT] korrekt formuliert?
    └── stop_prinzip.md          ← Substitution → Technisch → Organisatorisch → Persönlich
```

### 1.8 Prompts (`knowledge/prompts/`)

Wiederverwendbare Prompt-Bausteine und User-Prompt-Templates mit Variablen.
Werden vom Context Builder zu vollständigen Prompts assembliert — nicht direkt an Qwen übergeben.

**Organisationsprinzip:** `base/` (universell), `products/` (pro Dokumentprodukt).

```
prompts/
├── base/
│   ├── system_base.md           ← Universelle Bot-Basisregeln (Sprache, Ton, JSON-Format)
│   ├── hallucination_guard.md   ← Injizierbare Halluzinations-Guard-Instruktion
│   └── open_point_instruction.md← [OFFENER PUNKT] Formulierungsanweisung
│
└── products/
    ├── gb_user_prompt_template.md   ← User-Prompt für GB (mit {{input_fields}}-Variablen)
    ├── sk_user_prompt_template.md
    ├── ec_user_prompt_template.md
    └── oda_user_prompt_template.md
```

---

## 2. Vollständige Ordnerstruktur `knowledge/`

```
knowledge/
│
├── standards/
│   ├── arbschg/
│   │   └── overview.md
│   ├── dguv_v1/
│   │   └── overview.md
│   ├── vstaettvo/
│   │   └── overview.md
│   ├── bewachv/
│   │   └── overview.md
│   ├── betrsichv/
│   │   └── overview.md
│   ├── arbstaettv/
│   │   └── overview.md
│   └── din_vde/
│       └── overview.md
│
├── sdls/
│   ├── veranstaltungsschutz/
│   │   ├── base.md
│   │   ├── crowd_management.md
│   │   └── subtypes/
│   │       ├── kampfsport.md
│   │       ├── festival.md
│   │       ├── konzert.md
│   │       └── messe.md
│   ├── objektschutz/
│   │   ├── base.md
│   │   ├── zugang_kontrolle.md
│   │   └── subtypes/
│   │       ├── standard_objekt.md
│   │       ├── sondergebaeude.md
│   │       └── opv.md
│   ├── interventionsdienst/
│   │   ├── base.md
│   │   └── subtypes/
│   │       └── mobile_reaktion.md
│   ├── mobile_sicherheit/
│   │   ├── base.md
│   │   └── subtypes/
│   │       └── alleinarbeit.md
│   ├── unterkunft/
│   │   ├── base.md
│   │   └── subtypes/
│   │       ├── gefluechtete.md
│   │       └── wohnheim.md
│   ├── empfangsdienst/
│   │   └── base.md
│   └── opv/
│       └── base.md
│
├── products/
│   ├── gefaehrdungsbeurteilung/
│   │   ├── purpose.md
│   │   ├── structure_guide.md
│   │   └── content_blocks.md
│   ├── sicherheitskonzept/
│   │   ├── purpose.md
│   │   ├── structure_guide.md
│   │   └── content_blocks.md
│   ├── einsatzkonzept/
│   │   ├── purpose.md
│   │   ├── structure_guide.md
│   │   └── content_blocks.md
│   ├── oda/
│   │   ├── purpose.md
│   │   └── content_blocks.md
│   └── cert_expert/
│       ├── terminology.md
│       ├── forbidden_phrases.md
│       └── services_overview.md
│
├── blueprints/
│   ├── gb_event_kampfsport.json
│   ├── gb_event_festival.json
│   ├── gb_event_standard.json
│   ├── gb_object_standard.json
│   ├── gb_mobile_service.json
│   ├── gb_intervention.json
│   ├── gb_accommodation.json
│   ├── gb_opv.json
│   ├── sk_event_standard.json
│   ├── ec_event_kampfsport.json
│   └── oda_standard.json
│
├── rules/
│   ├── base/
│   │   ├── hallucination_boundaries.md
│   │   ├── open_points_rules.md
│   │   ├── citation_rules.md
│   │   └── output_format_rules.md
│   ├── products/
│   │   ├── gb_rules.md
│   │   ├── sk_rules.md
│   │   ├── ec_rules.md
│   │   └── oda_rules.md
│   └── blueprints/
│       ├── gb_event.md
│       ├── gb_event_kampfsport.md
│       ├── gb_object.md
│       └── gb_accommodation.md
│
├── guides/
│   ├── content_blocks/
│   │   ├── risikobewertung.md
│   │   ├── gefaehrdungsanalyse.md
│   │   ├── schutzmassnahmen.md
│   │   ├── verantwortlichkeiten.md
│   │   └── offene_punkte.md
│   └── writing_style/
│       ├── audit_near_writing.md
│       ├── open_point_formulation.md
│       └── stop_prinzip.md
│
├── examples/
│   ├── gb_taetigkeit/
│   │   ├── veranstaltungsschutz_kampfsport.md
│   │   ├── veranstaltungsschutz_festival.md
│   │   ├── veranstaltungsschutz_konzert.md
│   │   ├── objektschutz_standard.md
│   │   └── mobile_sicherheit.md
│   ├── gb_gefaehrdungen/
│   │   ├── veranstaltungsschutz_kampfsport.md
│   │   ├── veranstaltungsschutz_festival.md
│   │   ├── objektschutz_standard.md
│   │   └── unterkunft_gefluechtete.md
│   ├── gb_risikobewertung/
│   │   ├── veranstaltungsschutz_kampfsport.md
│   │   └── objektschutz_standard.md
│   ├── gb_schutzmassnahmen/
│   │   ├── veranstaltungsschutz_kampfsport.md
│   │   └── objektschutz_standard.md
│   ├── sk_schutzziel/
│   │   └── veranstaltungsschutz_standard.md
│   └── ec_einsatzbeschreibung/
│       └── veranstaltungsschutz_kampfsport.md
│
└── prompts/
    ├── base/
    │   ├── system_base.md
    │   ├── hallucination_guard.md
    │   └── open_point_instruction.md
    └── products/
        ├── gb_user_prompt_template.md
        ├── sk_user_prompt_template.md
        ├── ec_user_prompt_template.md
        └── oda_user_prompt_template.md
```

---

## 3. Wissenstypen — Unterscheidung

### 3.1 Harte Regeln (`rules/base/`)

Nicht-verhandelbare Verhaltensregeln. Immer geladen, kein Blueprint kann sie deaktivieren.
Kurz, imperativ formuliert (< 500 Tokens gesamt). Direkt in System-Prompt injiziert.

### 3.2 Produktregeln (`rules/products/`)

Regeln spezifisch für einen Dokumenttyp (z. B. alle GB-Dokumente müssen eine
Risikobewertung enthalten). Geladen sobald ein Produkt aktiv ist — unabhängig vom
spezifischen Blueprint.

### 3.3 Blueprint-Regeln (`rules/blueprints/`)

Sonderregeln für spezifische Blueprints oder Blueprint-Familien (z. B. bei
Kampfsport-GBs muss `medical_service` immer OFFENER PUNKT sein, wenn nicht angegeben).
Geladen nur wenn dieser Blueprint aktiv ist.

### 3.4 Retrieval- / Referenzwissen (SDLs, Standards)

Fachliches Hintergrundwissen. Blueprint-selektiv. Überblicksebene — kein Volltext.
Gibt dem Modell "Was gibt es hier typischerweise zu beachten?" ohne Faktenerfindung.

### 3.5 Produkt-Kontextwissen (`products/`)

Erklärt dem Modell, was ein Dokument ist und was jeder Inhaltsblock enthalten muss.
Verhindert strukturelle Fehler und corporate-inkongruente Sprache.

### 3.6 Blueprint-Metadaten (`blueprints/`)

Maschinenlesbare Kompositions-Konfiguration. Nicht im Qwen-Kontext — nur für
Python-Logik (`blueprint_loader.py`, `context_builder.py`).

### 3.7 Beispiele und Guides

Stil-Kalibrierung. Selektiv (1–3 Beispiele pro Block). Demonstrativ (Examples) oder
instruktiv (Guides). Kein echter Kundeninhalt.

### 3.8 Prompt-Bausteine

Template-Blöcke mit Variablen. Werden assembliert, nicht direkt gesendet.

---

## 4. Blueprint Composability — Wie Blueprints Module auswählen

### 4.1 Modul-Auswahl-Prinzipien

**Regel 1 — Basis + Subtyp:** SDL-Module werden immer als `base.md` + relevanter
Subtyp geladen. Ein Blueprint lädt nie nur den Subtyp ohne die Basis.

```
gb_event_kampfsport lädt:
  ✓ sdls/veranstaltungsschutz/base.md       ← immer (Basis)
  ✓ sdls/veranstaltungsschutz/subtypes/kampfsport.md  ← spezifisch
  ✗ sdls/veranstaltungsschutz/subtypes/festival.md    ← nicht relevant
```

**Regel 2 — Regeln kumulieren:** Alle drei Regelebenen werden geladen.
`rules/base/*` + `rules/products/gb_rules.md` + `rules/blueprints/gb_event_kampfsport.md`

**Regel 3 — Minimal relevante Standards:** Nur Standards, die für diesen
Anwendungsfall rechtlich relevant sind.

```
gb_event_kampfsport:  vstaettvo + dguv_v1 + arbschg     (Veranstaltung)
gb_object_standard:   betrsichv + dguv_v1 + arbschg     (kein VStättVO)
gb_accommodation:     arbstaettv + dguv_v1 + arbschg    (Unterkunft)
```

**Regel 4 — Beispiele nach SDL + Block:** Beispiele werden nach SDL-Bereich und
Inhaltsblock ausgewählt. Kampfsport-Event → Beispiele aus `veranstaltungsschutz_kampfsport`.

**Regel 5 — Konditionelle Module:** Optionale Module werden nur geladen wenn
spezifische Input-Bedingungen erfüllt sind (z. B. `live_music == true`).

### 4.2 Wie zwei Blueprints Module teilen

```
gb_event_kampfsport          gb_event_festival
        │                           │
        └────────┬──────────────────┘
                 │
        GEMEINSAME MODULE:
        ├── rules/base/*
        ├── rules/products/gb_rules.md
        ├── rules/blueprints/gb_event.md
        ├── sdls/veranstaltungsschutz/base.md
        ├── sdls/veranstaltungsschutz/crowd_management.md
        ├── standards/vstaettvo/overview.md
        ├── standards/dguv_v1/overview.md
        ├── products/gefaehrdungsbeurteilung/purpose.md
        ├── guides/content_blocks/risikobewertung.md
        └── prompts/base/*

        UNTERSCHIEDLICHE MODULE:
        kampfsport:                         festival:
        ├── sdls/.../kampfsport.md          ├── sdls/.../festival.md
        ├── rules/blueprints/               ├── (kein blueprint-spezifischer
        │   gb_event_kampfsport.md          │    rule-override nötig)
        └── examples/.../                  └── examples/.../
            veranstaltungsschutz_              veranstaltungsschutz_
            kampfsport.md                      festival.md
```

### 4.3 Context Assembly Flow (Phase 2)

```
blueprint_id = "gb_event_kampfsport"
        │
        ▼
blueprint_loader.py
  → liest knowledge/blueprints/gb_event_kampfsport.json
  → gibt context_modules dict zurück
        │
        ▼
context_builder.py
  → lädt rules/base/* (immer zuerst)
  → lädt rules/products/gb_rules.md
  → lädt rules/blueprints/gb_event_kampfsport.md
  → lädt standards nach context_modules.standards
  → lädt sdls nach context_modules.sdls
  → lädt products nach context_modules.products
  → lädt guides nach context_modules.guides
  → lädt examples (max 3, blueprint-selektiv)
  → prüft conditional_modules gegen input-Felder
  → im Flow-Modus: lädt upstream context aus projects/{id}/upstream/
  → assembliert system_prompt (token-budgetiert)
  → assembliert user_prompt aus prompts/products/gb_user_prompt_template.md
        │
        ▼
gb_bot.py → ask_qwen(system_prompt, user_prompt)
```

---

## 5. Halluzinationsreduktion durch selektives Context Loading

### 5.1 Drei Halluzinationstypen und Gegenmaßnahmen

| Typ | Beschreibung | Gegenmaßnahme |
|---|---|---|
| Faktenerfindung | Bot erfindet Zahlen, Normen, Daten | `rules/base/hallucination_boundaries.md` |
| Kontextvermischung | Kampfsport-Regeln auf Objektschutz angewendet | Blueprint-selektives SDL-Loading |
| Plausibilitätsfüllung | Fehlende Felder mit plausiblen Werten gefüllt | `[OFFENER PUNKT]`-Pflicht in Regeln + Prompt |
| Normfälschung | Falsche Paragrafennummern | Standards als Überblick, kein Volltext |
| Stilbruch | Nicht-corporate-konforme Sprache | `products/cert_expert/terminology.md` |

### 5.2 Token-Budget pro Modul

| Kategorie | Max. Tokens/Modul | Max. Summe | Priorität |
|---|---|---|---|
| `rules/base/*` | 150 | 500 | Kritisch — immer |
| `rules/products/` | 200 | 200 | Hoch |
| `rules/blueprints/` | 200 | 200 | Hoch |
| SDL base | 800 | 800 | Mittel |
| SDL subtype | 600 | 600 | Mittel |
| Standard overview | 400 | 1.000 (max 3) | Mittel |
| Product context | 500 | 500 | Mittel |
| Guides | 400 | 800 (max 2) | Niedrig |
| Examples | 600 | 1.200 (max 2) | Niedrig |
| Prompts/base | 300 | 600 | Kritisch |

**Gesamtbudget System-Prompt:** ~ 6.000–7.500 Tokens
**User-Prompt (Input-Daten):** ~ 500–1.500 Tokens
**Gesamt-Kontextfenster:** < 10.000 Tokens

---

## 6. Zwei Kontextwelten — Entwicklung vs. Betrieb

| Kontext | System | Inhalte |
|---|---|---|
| **Entwicklungskontext** | Cursor / Claude | `docs/*.md`, Quellcode, Blueprint-Specs, diese Datei |
| **Operativer Kontext** | Qwen (Laufzeit) | `knowledge/rules/`, `knowledge/sdls/`, `knowledge/standards/`, `knowledge/examples/`, `knowledge/guides/`, `knowledge/prompts/` |

**Trennungsregel:** `docs/`-Dateien gelangen **niemals** in Qwen-Prompts.
`knowledge/`-Dateien enthalten **keine** technischen Architektur-Informationen.

---

## 7. Zukünftige Retrieval-Architektur (Phase 2+)

### 7.1 Ausgangslage

Phase 1: manuelle Dateiauswahl im Bot-Code (~20–30 Module).
Phase 2: `context_builder.py` liest Blueprint-Config, lädt Module automatisch.
Phase 3: lokales semantisches Retrieval wenn Knowledge Base weiter wächst.

### 7.2 Lokales Retrieval (Offline-First)

Das System bleibt offline-fähig. Kein Cloud-Retrieval, keine externen API-Dienste.

**Geplanter Stack:**
- Embedding-Modell: lokal (z. B. `nomic-embed-text` via LM Studio oder `sentence-transformers`)
- Vector Store: lokal, dateibasiert (ChromaDB oder FAISS mit lokalem Index)
- Retrieval-Trigger: Context Builder für nicht-immer-geladene Module

### 7.3 Chunking-Konzepte

| Modul-Typ | Chunk-Größe | Overlap | Chunking-Art |
|---|---|---|---|
| Harte Regeln | Kein Chunking (< 200 Tokens) | — | Vollständig |
| SDL-Module | 512 Tokens | 64 Tokens | Fest |
| Norm-Overviews | 512 Tokens | 64 Tokens | Fest |
| Beispiele | Satzgrenzen | 1–2 Sätze | Semantisch |
| Upstream-Summaries | 512–1.024 Tokens | 64 Tokens | Fest |

### 7.4 Context Windows

| Modell | Fenster | Empfehlung System-Prompt |
|---|---|---|
| Qwen 30B (Phase 1) | 32.768 Tokens | < 8.000 Tokens |
| Größere Modelle (Phase 2+) | 64K–128K | Mehr Examples, vollständigere Module |

---

## 8. Phase-Trennung

### Phase 1 — Manuell, dateibasiert (aktuell)

| Merkmal | Umsetzung |
|---|---|
| Context Assembly | Im Bot-Code (`gb_bot.py` → `build_system_prompt()`) |
| Selektion | Hardkodiert per Blueprint-ID |
| Upstream Context | Manuell in `projects/{id}/upstream/` abgelegt |
| Retrieval | Keines — `pathlib.read_text()` |

**Implementierungsreihenfolge für erste Knowledge-Dateien:**
1. `rules/base/hallucination_boundaries.md`
2. `rules/base/open_points_rules.md`
3. `rules/base/citation_rules.md`
4. `rules/products/gb_rules.md`
5. `sdls/veranstaltungsschutz/base.md`
6. `sdls/veranstaltungsschutz/subtypes/kampfsport.md`
7. `standards/vstaettvo/overview.md`
8. `examples/gb_gefaehrdungen/veranstaltungsschutz_kampfsport.md`

### Phase 2 — Automatisiert, blueprint-gesteuert (geplant)

| Merkmal | Umsetzung |
|---|---|
| Context Assembly | `shared/context_builder.py` via Blueprint-Config |
| Selektion | Automatisch via `context_modules` + `conditional_modules` |
| Upstream Context | Preprocessing-Pipeline + `projects/{id}/upstream/` |
| Retrieval | Lokal, optional semantisch (ChromaDB/FAISS) |

Neue Module: `shared/blueprint_loader.py`, `shared/context_builder.py`, `shared/retriever.py`

### Phase 3 — Portal-Integration (Zukunft)

Context Assembly als API-Service. Blueprints über UI wählbar.
Input-Formulare dynamisch per Blueprint. Upstream-Dokumente über Portal hochladbar.

---

## 9. Upstream-Dokumente als Kontext (Flow-Modus)

Upstream-Dokumente gehören zum **Projekt** (in `projects/{id}/upstream/`),
nicht zum globalen Wissen (`knowledge/`).

Vollständige Spezifikation des Lifecycle, der Preprocessing-Pipeline und der
Zustandstabelle (vollständig / partiell / veraltet / fehlend): `docs/PROJECT_ARCHITECTURE.md`.

**Zusammenfassung:**
- PDF/DOCX → Text-Extraktion → strukturiertes Markdown → `metadata.json`
- `metadata.json` steuert welche Upstream-Abschnitte als Kontext geladen werden
- Fehlende Abschnitte → `pre_open_points` (nicht als Kontext, sondern als OFFENER PUNKT)
- Upstream-Open-Points propagieren mit Quellenangabe: `(aus Sicherheitskonzept: ...)`

---

## Zusammenfassung — Architekturprinzipien Knowledge Layer

| Prinzip | Umsetzung |
|---|---|
| Selektiv, nicht vollständig | Kontextbudget kontrolliert, blueprint-komposit |
| Modular und wiederverwendbar | Wissen nach intrinsischem Typ, nicht nach Blueprint |
| Offline-First | Kein Cloud-Retrieval im Betrieb |
| Trennung Dev/Betrieb | `docs/` für Cursor/Claude, `knowledge/` für Qwen |
| Harte Regeln zuerst | `rules/base/*` immer im Kontext, an erster Stelle |
| Keine Volltext-Normen | Überblicksebene, keine zitierfähigen Nummern |
| Upstream bleibt im Projekt | `projects/{id}/upstream/` — nicht in `knowledge/` |
| Phase 1 einfach halten | Manuelle Datei-Assembly reicht für erste Implementierung |
| Phase 2 erweiterbar | Context Builder + Blueprint Loader entkoppeln Assembly vom Bot-Code |
