# Bot-Bauplan — konkreter Aufbau je Dokumenttyp

**Stand:** 2026-06-02  
**Für:** Projektleitung, Fachkraft, Entwicklung  
**Ergänzt:** [`BOT_PFLICHTREGELN.md`](BOT_PFLICHTREGELN.md), [`CONTEXT_ASSEMBLY_POLICY.md`](CONTEXT_ASSEMBLY_POLICY.md)

---

## Kurzantwort

Ja — an dieser Stelle braucht es **konkrete Angaben**, wer **was** in **welcher Datei** definiert.

| Ebene | Wer legt fest | Ergebnis |
|-------|---------------|----------|
| **Fachlich** | Du / Cert-Expert | Welches Dokument, welche Kapitel, welche Pflichtfelder, welche Norm-Extrakte |
| **Blueprint** | Architekt + Fachkraft | Eine JSON-Datei pro Dokumenttyp — steuert alles |
| **Laufzeit** | Code (fertig) | Lädt Blueprint → Input → Prompt → JSON → DOCX |

Ohne die **fachliche Ebene** kann der Bot technisch laufen, aber nicht verlässlich lenken.

---

## Schichtmodell (von oben nach unten)

```
┌─────────────────────────────────────────────────────────┐
│  ANWENDER: inputs/{blueprint_id}.json  (Pflichtangaben) │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  BLUEPRINT: knowledge/7_blueprint/{id}.json              │
│  • context_modules  (= Pflichtlektüre im Prompt)        │
│  • pflichten        (= Angaben + Form + Lektüre-Check)  │
│  • input_schema     (= required / optional / Trigger)   │
│  • ai_blocks        (= SK_*, GB_*, …)                   │
│  • template_file    (= Pflichtform DOCX)                │
└───────────────────────────┬─────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
  knowledge/           prompts/            templates/
  (Lektüre-Dateien)    (System/User)       (DOCX-Form)
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
              shared/ → context_builder → api_client (Qwen)
                            │
                            ▼
              outputs/{id}_{slug}_{timestamp}.json
              outputs/{id}_{slug}_{timestamp}.docx
```

**LM Studio** steht **außerhalb** dieses Modells: es bekommt nur den fertigen Prompt, keinen Ordnerzugriff.

---

## Datei-Mapping — ein Blueprint = diese Dateien

Referenz: **`sk_event_kampfsport`**

| # | Zweck | Pflicht? | Pfad |
|---|--------|----------|------|
| 1 | **Steuerzentrale** | ja | `knowledge/7_blueprint/sk_event_kampfsport.json` |
| 2 | **Anwender-Input** | ja | `inputs/sk_event_kampfsport.json` |
| 3 | **Input-Checkliste** | ja | `inputs/PFLICHTANGABEN_SK.md` |
| 4 | **DOCX-Form** | ja | `templates/sk_event_kampfsport.docx` |
| 5 | **Template-Generator** | empfohlen | `templates/create_sk_event_kampfsport_template.py` |
| 6 | **Produktwissen** | ja | `knowledge/6_products/sicherheitskonzept/` |
| 7 | **SDL** | ja | `knowledge/3_sdls/veranstaltungsschutz/` |
| 8 | **Extrakte / Praxis** | ja | `knowledge/4_sources/` (DGUV, Praxis, Behörden) |
| 9 | **Regeln** | ja | `knowledge/10_rules/products/sk_rules.md` + `blueprints/sk_event_kampfsport.md` |
| 10 | **Guides (Runtime)** | empfohlen | `knowledge/8_guides/runtime_summaries/` |
| 11 | **User-Prompt** | ja | `prompts/products/sk_user_prompt_template.md` |
| 12 | **Bot-CLI** | ja | `bots/02_sicherheitskonzept/sk_bot.py` |
| 13 | **Smoke ohne LLM** | ja | `tests/smoke_sk_event_kampfsport.py` |
| 14 | **Kontext-Übersicht** | ja | `knowledge/BOT_CONTEXT_MAP.md` |

Neuer Dokumenttyp = **dieselbe Liste**, andere IDs und Inhalte.

---

## Blueprint-JSON — Pflichtblöcke (Schema)

Jede freigegebene Blueprint-Datei **muss** enthalten:

```json
{
  "blueprint_id": "...",
  "display_name": "...",
  "template_file": "templates/....docx",
  "context_modules": { "standards": [], "sdls": [], "...": [] },
  "pflichten": {
    "lektuere": { "...": "gleiche Keys wie context_modules" },
    "form": {
      "template_file": "templates/....docx",
      "ai_blocks": ["SK_SCHUTZZIEL", "..."],
      "input_checklist": "inputs/PFLICHTANGABEN_....md"
    },
    "angaben": {
      "required": ["event_name", "..."],
      "checklist": "inputs/PFLICHTANGABEN_....md"
    }
  },
  "input_schema": {
    "required": [],
    "optional": [],
    "field_labels": {},
    "critical_triggers": []
  },
  "ai_blocks": [],
  "qa_rules": {}
}
```

**Regel:** `pflichten.lektuere` ⊆ `context_modules` (Validator prüft das).

---

## Ablauf: neues Dokument (z. B. EK) anlegen

### Phase A — Fachliche Festlegung (von dir)

Bevor Code/JSON angefasst wird, **schriftlich** klären:

1. **Dokumenttyp** — z. B. Einsatzkonzept Kampfsport  
2. **Zielgruppe / Abgrenzung** — SK vs. GB vs. EK (was darf der Bot nicht mischen?)  
3. **Kapitelstruktur** — Liste der AI-Blöcke (`EK_*`) = später DOCX-Überschriften  
4. **Pflichtangaben** — welche Felder muss der Veranstalter liefern?  
5. **Pflichtlektüre** — welche Extrakte/Überblicke reichen (kein CEKS-Volltext)?  
6. **QA-Schwellen** — wann `review_required` vs. `ok`?

→ Ergebnis: 1–2 Seiten Fachkonzept oder ausgefüllte Checkliste unten.

### Phase B — Artefakte anlegen (Reihenfolge)

| Schritt | Aktion | Befehl / Datei |
|---------|--------|----------------|
| B1 | Produktordner | `knowledge/6_products/einsatzkonzept/purpose.md` + `content_blocks.md` |
| B2 | SDL-Subtyp (falls fehlt) | `knowledge/3_sdls/.../subtypes/` |
| B3 | Extrakte in `4_sources/` | nur reviewed Markdown |
| B4 | Regeln | `knowledge/10_rules/products/ek_rules.md` |
| B5 | Blueprint-JSON | `knowledge/7_blueprint/ec_event_kampfsport.json` |
| B6 | Input-Checkliste | `inputs/PFLICHTANGABEN_EK.md` |
| B7 | Beispiel-Input | `inputs/ec_event_kampfsport.json` |
| B8 | DOCX-Template | `templates/create_ec_....py` → `.docx` |
| B9 | User-Prompt | `prompts/products/ek_user_prompt_template.md` |
| B10 | Bot (Kopie SK/GB) | `bots/03_einsatzkonzept/ek_bot.py` |
| B11 | Smoke + Validator | `tests/smoke_ec_....py` |
| B12 | BOT_CONTEXT_MAP | Eintrag + Pflichten-Link |

### Phase C — Freigabe

```bash
python3 -m shared.pflichten_validator <blueprint_id>
python3 tests/smoke_<blueprint_id>.py
python3 scripts/context_size_report.py <blueprint_id>
```

Alle grün → Blueprint-Status `released` in JSON + Eintrag in `BOT_PFLICHTREGELN.md`.

---

## Laufzeit — was passiert beim Bot-Start

1. `sk_bot.py` liest `inputs/sk_event_kampfsport.json`  
2. `input_loader` prüft Pflichtfelder → leere Werte → `[OFFENER PUNKT]`  
3. `blueprint_loader` lädt nur `context_modules`  
4. `context_builder` baut System- + User-Prompt (~51k Zeichen SK)  
5. `api_client` → LM Studio (HTTP, Port 1234)  
6. Antwort → JSON mit `SK_*`-Feldern  
7. `docx_builder` füllt `templates/sk_event_kampfsport.docx`  
8. Ausgabe unter `outputs/`

**Lenkhebel für dich:** Schritte 1 (Input) und 3–4 (Blueprint-Lektüre + Regeln). Nicht der Chat in LM Studio.

---

## Entscheidungs-Checkliste (das brauchen wir von dir)

Für **jeden** Dokument-Bot einmal ausfüllen:

### SK Kampfsport — Status

| Frage | Entscheidung nötig? | Aktueller Stand |
|-------|---------------------|-----------------|
| Pflichtfelder vollständig? | teilweise | `medical_service`, Halle — jetzt im Input, Sanität noch „beauftragen“ |
| Kapitelstruktur SK final? | ja | 6 Blöcke MVP — reicht das für Behörde/Auftraggeber? |
| Welche DGUV/Behörden-Extrakte? | ja | 4 Module — reicht für K1 ~100 Zuschauer? |
| Freigabe-Workflow | ja | `approved_by` leer → immer `review_required` — gewollt? |
| SK → GB Vererbung (Flow) | später | `downstream` definiert, Pipeline noch nicht |

### GB lean — offen

| Frage | Status |
|-------|--------|
| `pflichten`-Block im Blueprint | **fehlt noch** |
| Gleicher Input wie SK-Event | **nicht synchronisiert** |

### EK — offen

| Frage | Status |
|-------|--------|
| Blueprint | **nicht angelegt** |
| AI-Blöcke / Kapitel | **von dir festzulegen** |

---

## Was du **nicht** bauen musst

- Kein eigener Vault-Chatbot für Qwen  
- Kein Ordner-Scan in `knowledge/`  
- Keine manuelle Prompt-Zusammenstellung in LM Studio  
- Keine parallelen Blueprints ohne Pflichten-Block

---

## Nächster sinnvoller Schritt

**Option 1 — SK produktiv machen (empfohlen)**  
Du lieferst: finale Pflichtfeld-Liste + ob 6 Kapitel reichen + Sanitäts-/Behörden-Minimum.  
Wir: Input finalisieren, SK-Lauf, DOCX prüfen.

**Option 2 — GB lean Pflichten nachziehen**  
Gleiches Muster wie SK → ein Event, zwei Dokumente (SK + GB lean).

**Option 3 — EK starten**  
Du lieferst: Kapitelüberschrift-Liste + Pflichtfelder EK → dann Phase B.

---

## Verwandte Dateien

- Regeln (3 Säulen): [`BOT_PFLICHTREGELN.md`](BOT_PFLICHTREGELN.md)  
- Allowlist-Übersicht: [`knowledge/BOT_CONTEXT_MAP.md`](../knowledge/BOT_CONTEXT_MAP.md)  
- SK-Input-Checkliste: [`inputs/PFLICHTANGABEN_SK.md`](../inputs/PFLICHTANGABEN_SK.md)  
- Referenz-Blueprint: [`knowledge/7_blueprint/sk_event_kampfsport.json`](../knowledge/7_blueprint/sk_event_kampfsport.json)
