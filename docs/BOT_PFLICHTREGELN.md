# Bot-Pflichtregeln — Angaben, Form, Lektüre

**Stand:** 2026-06-02  
**Gilt für:** alle Dokument-Bots (GB, SK, EK, ODA)  
**Ergänzt:** [`CONTEXT_ASSEMBLY_POLICY.md`](CONTEXT_ASSEMBLY_POLICY.md), [`knowledge/BOT_CONTEXT_MAP.md`](../knowledge/BOT_CONTEXT_MAP.md), [`BOT_BAUPPLAN.md`](BOT_BAUPPLAN.md)

---

## Drei Säulen (verbindlich)

Jeder **freigegebene** Blueprint definiert drei Pflichten. Der Bot darf ohne sie nicht produktiv laufen.

| Säule | Was | Wo definiert | Prüfung |
|-------|-----|--------------|---------|
| **1. Pflichtangaben** | Felder, die der Mensch/ das Portal liefern muss | Blueprint `input_schema` + `pflichten.angaben` | `input_loader` → `[OFFENER PUNKT]` |
| **2. Pflichtform** | DOCX-Template + AI-Blöcke (`SK_*`, `GB_*`, …) | `template_file` + `ai_blocks` + `pflichten.form` | Datei existiert; Renderer/Smoke |
| **3. Pflichtlektüre** | Knowledge-Dateien, die **immer** im Prompt sind | `context_modules` ⊇ `pflichten.lektuere` | `shared.pflichten_validator` |

**Nicht erlaubt:** Vault-Scan, `1_standards/` ohne Extrakt, Module aus Pflichtlektüre entfernen ohne Blueprint-Review.

---

## Wer trägt was ein?

| Rolle | Pflichtangaben | Pflichtform | Pflichtlektüre |
|-------|----------------|-------------|----------------|
| **Projektleitung / Architekt** | Felder im Blueprint festlegen | Template + Kapitelstruktur | Allowlist in Blueprint |
| **Fachkraft** | Extrakte in `4_sources/` pflegen | Text in Template (Cert-Expert) | Module freigeben (`reviewed`/`released`) |
| **Anwender** | `inputs/*.json` ausfüllen | — | — |
| **Bot-Lauf** | lädt nur Blueprint-Allowlist | rendert Template | baut Prompt aus Lektüre |

---

## SK — `sk_event_kampfsport` (Referenz)

### Pflichtangaben (Minimum)

Siehe [`inputs/PFLICHTANGABEN_SK.md`](../inputs/PFLICHTANGABEN_SK.md).

Pflichtfelder im Blueprint: Event, Ort/Halle, Datum, Zuschauer, Kapazität, Notausgänge, Kampfsportart, **Sanitätsdienst**, Auftraggeber, Ersteller, Version.

Leer oder fehlend → `[OFFENER PUNKT]` **vor** dem LLM-Call.

### Pflichtform

- Template: `templates/sk_event_kampfsport.docx`
- AI-Blöcke: `SK_SCHUTZZIEL`, `SK_GEFAEHRDUNGSANALYSE`, `SK_SCHUTZMASSNAHMEN`, `SK_VERANTWORTLICHE`, `SK_KOMMUNIKATION`, `SK_OFFENE_PUNKTE`

Erzeugen: `python3 templates/create_sk_event_kampfsport_template.py`

### Pflichtlektüre (Bot muss lesen)

Maschinenlesbar in `knowledge/7_blueprint/sk_event_kampfsport.json` → `pflichten.lektuere`.

Kategorien:

- **Normüberblick:** `2_regulations/` (DGUV V1, VStättVO) — **kein** CEKS-Volltext
- **SDL:** Veranstaltung + Subtyp Kampfsport
- **Produkt:** `6_products/sicherheitskonzept/`
- **Quellen:** DGUV Crowd + Organisation, SK-Gerüst, Behördenabstimmung
- **Regeln:** Basis + `sk_rules` + Blueprint-Regeln
- **Guides:** 2× Runtime-Summaries (kleines Event)

Prüfen: `python3 -m shared.pflichten_validator sk_event_kampfsport`

---

## GB lean — Kurz

| Säule | Referenz |
|-------|----------|
| Angaben | `inputs/gb_event_kampfsport.json`, Blueprint `gb_event_kampfsport_lean` |
| Form | `templates/gb_event_kampfsport.docx`, `GB_*` |
| Lektüre | siehe `BOT_CONTEXT_MAP.md` → lean-Allowlist |

Pflichtlektüre-Validator für GB lean: geplant (gleiches Muster wie SK).

---

## Gate: Blueprint „released“

Ein Blueprint ist **released**, wenn:

1. `pflichten`-Block vollständig im JSON
2. `pflichten_validator` grün
3. Smoke-Test grün
4. Pflichtlektüre-Module Status mindestens `reviewed` in `4_sources/*/README.md`
5. Eintrag in `BOT_CONTEXT_MAP.md`

---

## Was das **nicht** ist

- Kein Chat-Bot über den ganzen Vault
- Keine Pflicht, PDFs in `inputs/raw_standards/` zu laden
- Keine automatische CEKS-Norm (`1_standards/`) — nur **Extrakte** in `4_sources/` oder `2_regulations/overview`

Neue CEKS-Inhalte → Extrakt anlegen → in `pflichten.lektuere` eintragen → Validator erneut laufen lassen.
