# Briefing für ChatGPT — EK-Bot (`ec_event_kampfsport`) vorbereiten

**Zweck:** Dieses Dokument an ChatGPT geben (mit deinem Unternehmens-/Event-Kontext).  
ChatGPT soll die **Antworten** unten ausfüllen. Die ausgefüllte Version gibst du **Cursor** zurück — dann bauen wir Option **C** (EK-Bot MVP).

**Projekt:** Cert-Expert AI (`cert-expert-ai`) — lokale Dokument-Bots (Qwen via LM Studio), kein Vault-Chat.

**Referenz (bereits live):** Sicherheitskonzept `sk_event_kampfsport` — gleiches Muster für EK.

---

## 1. Was ChatGPT wissen muss (Systemkontext)

### 1.1 Drei Dokumente — Abgrenzung

| Dokument | Perspektive | Frage |
|----------|-------------|--------|
| **SK** (Sicherheitskonzept) | Veranstalter / Gesamtveranstaltung | Was soll geschützt werden, welche Maßnahmen auf Event-Ebene? |
| **GB** (Gefährdungsbeurteilung) | Arbeitgeber AN (Arbeitsschutz) | Welche Risiken haben **unsere** Beschäftigten beim Einsatz? |
| **EK** (Einsatzkonzept) | Auftragnehmer SD (operativ) | **Wie setzen wir** den Einsatz um: Kräfte, Abschnitte, Ablauf, Funk, Notfall? |

**EK ersetzt nicht SK/GB.** EK setzt SK operativ um; Kräftezahlen nur aus Input, sonst `[OFFENER PUNKT]`.

### 1.2 Technischer Aufbau (für EK geplant)

Ein Blueprint steuert alles:

- **Pflichtangaben** → JSON `inputs/ec_event_kampfsport.json`
- **Pflichtform** → Word `templates/ec_event_kampfsport.docx` + Platzhalter `EC_*`
- **Pflichtlektüre** → feste Markdown-Liste im Blueprint (Extrakte, SDL, Regeln — **kein** DIN-Volltext)

Repo-Pfade (bereits teilweise vorbereitet):

- Produktgerüst: `knowledge/6_products/einsatzkonzept/purpose.md`, `content_blocks.md`
- Geplanter Blueprint-ID: **`ec_event_kampfsport`**
- Geplante AI-Blöcke (Vorschlag aus Architektur — **von dir bestätigen oder ändern**):

  `EC_EINSATZBESCHREIBUNG`, `EC_KRAEFTE`, `EC_POSITIONIERUNG`, `EC_ABLAUF`, `EC_KOMMUNIKATION`, `EC_NOTFALLPLAN`, `EC_OFFENE_PUNKTE`

### 1.3 Erster Anwendungsfall (bitte bestätigen)

Wir starten EK für **dieselbe Veranstaltungsklasse wie SK**:

- **K1 Amateur Kampfsport Event**
- ca. **100 Zuschauer**
- **Berlin-Reinickendorf** (Halle mit Adresse)
- SDL-Subtyp: **Kampfsport** (`veranstaltungsschutz/subtypes/kampfsport.md`)

Später: weitere Subtypen (Festival, Messe, …) — **nicht** im ersten MVP.

### 1.4 Was der Bot **nicht** darf

- Keine erfundenen Kräftezahlen, Funkfrequenzen, Rufnummern, Paragrafen
- Kein CEKS/DIN-77200-Volltext — nur freigegebene **Extrakte** in `knowledge/4_sources/`
- Keine Einsatzfreigabe ersetzen (CEKS/Tool 2 bleibt separat)

### 1.5 Bezug zu SK (Flow — gewünscht?)

Geplant: EK kann aus fertigem SK **Schutzziel und Maßnahmenrahmen** übernehmen (`upstream`).

**Frage an dich:** Soll MVP **standalone** (nur EK-Input) oder **Flow** (SK-JSON als Upstream) Priorität haben?

---

## 2. Aufgabe für ChatGPT

Bitte **alle Abschnitte 3–8** ausfüllen. Nutze:

- Dein Wissen über Cert-Expert, DIN 77200, typische EK-Struktur, Kampfsport-Events
- Konkrete Angaben zum **K1 Amateur Event** (falls bekannt)
- Wenn unklar: markiere `[[OFFEN: …]]` statt zu raten

**Ausgabeformat am Ende:** Abschnitt 9 — fertiges Paket für Cursor (kopierbar).

---

## 3. Fachliche Entscheidungen (Pflicht)

### 3.1 Kapitelstruktur EK

Sind diese **7 Blöcke** für `ec_event_kampfsport` ausreichend und in der richtigen Reihenfolge?

| # | Block-ID | Dein OK? (ja/nein/ändern) | Änderungsvorschlag |
|---|----------|---------------------------|-------------------|
| 1 | `EC_EINSATZBESCHREIBUNG` | | |
| 2 | `EC_KRAEFTE` | | |
| 3 | `EC_POSITIONIERUNG` | | |
| 4 | `EC_ABLAUF` | | |
| 5 | `EC_KOMMUNIKATION` | | |
| 6 | `EC_NOTFALLPLAN` | | |
| 7 | `EC_OFFENE_PUNKTE` | | |

Fehlen Kapitel? (z. B. Logistik/Fahrzeuge/Material/Briefing) → Liste:

```
…
```

### 3.2 Pflichtangaben — Input-Felder

Welche Felder **muss** der Nutzer vor dem EK-Lauf liefern?

**Vorschlag zum Start** (SK-Felder + EK-spezifisch) — bitte ergänzen/streichen:

| Feld (technischer Key) | Pflicht? | Bedeutung / Beispiel |
|------------------------|----------|----------------------|
| `event_name` | ja | |
| `event_date` | ja | |
| `event_location` | ja | Halle + Adresse |
| `event_start_time` / `event_end_time` | ? | |
| `client_name` | ja | Auftraggeber |
| `contract_reference` | ? | Auftrags-/LV-Referenz |
| `security_staff_count` | ja? | geplante SMA gesamt |
| `security_roles` | ? | z. B. EL, GF Einlass, Ring, Streife |
| `sections` | ? | Abschnitte mit Aufgaben |
| `radio_communication` | ? | Funk ja/nein, Prinzip |
| `coordination_police` | ? | Polizei/Ordnungsamt abgestimmt? |
| `coordination_venue` | ? | Hausmeister / Veranstalter |
| `medical_service` | ? | wie SK |
| `upstream_sk_available` | ? | SK liegt vor ja/nein |
| `upstream_sk_path` | ? | Pfad/Referenz wenn Flow |
| `special_instructions` | ? | |
| `created_by` | ja | |
| `doc_version` | ja | |

**Deine finale Pflichtliste** (nur Keys, kommagetrennt):

```
…
```

**Empfohlene optionale Felder:**

```
…
```

### 3.3 Kritische OFFENER-PUNKT-Trigger

Wann muss das EK **zwingend** offene Punkte haben (vor Freigabe)?

Beispiele (bitte bestätigen/ergänzen):

- [ ] `security_staff_count` fehlt oder 0  
- [ ] kein SK / `upstream_sk_available` = false  
- [ ] Funk geplant aber `radio_communication` leer  
- [ ] `approved_by` leer  
- [ ] Räumung/Sammelpunkt unbekannt  

**Deine Trigger-Liste** (Klartext + Bedingung):

```
…
```

### 3.4 QA-Schwelle

Wann ist Bot-Output `review_required` vs. `ok`?

- Max. offene Punkte für `ok`: `0` / `3` / andere: ___
- `approved_by` Pflicht für `ok`: ja / nein

---

## 4. Pflichtlektüre — was der EK-Bot lesen soll

Nur **Markdown-Extrakte** — keine PDFs direkt im Prompt.

**Vorschlag MVP-Allowlist** (bitte ja/nein + Ergänzungen):

| Kategorie | Modul (relativ zu knowledge/) | Nutzen für EK |
|-----------|-------------------------------|---------------|
| SDL | `3_sdls/veranstaltungsschutz/base.md` | Phasen Ablauf |
| SDL | `3_sdls/veranstaltungsschutz/subtypes/kampfsport.md` | Ring, Einlass |
| Produkt | `6_products/einsatzkonzept/purpose.md` + `content_blocks.md` | EC_*-Semantik |
| Quelle | `4_sources/dguv/crowd_veranstaltung.md` | Crowd |
| Quelle | `4_sources/dguv/veranstaltungen_organisation.md` | Organisation |
| Quelle | `4_sources/praxisleitfaeden/…` | **welche?** |
| Quelle | `4_sources/behoerden/grossevent_abstimmung.md` | Behörde |
| Regeln | `10_rules/base/*` (Halluzination, OP, Zitat, Format) | ja |
| Regeln | **neu:** `10_rules/products/ec_rules.md` | EK-spezifisch |
| Guide | `8_guides/runtime_summaries/kampfsport_sdl_small_event_summary.md` | kleines Event |
| Guide | **neu?** `ek_kraefteplanung.md` | ja/nein |
| Regulations | `2_regulations/dguv_v1/overview.md` | ja/nein |

**Module streichen** (zu viel Kontext / nicht EK-relevant):

```
…
```

**Module hinzufügen** (mit Kurzbegründung):

```
…
```

**Ziel-Promptgröße:** unter ___ Zeichen (SK ist ~51k).

---

## 5. Sprache, Stil, Zielgruppe

| Frage | Antwort |
|-------|---------|
| Adressat des EK-DOCX | intern AN / Auftraggeber / beides |
| Sprache | Deutsch, Sie / wir |
| Detaillierungsgrad Kräfte | nur Rollen / Rollen + Anzahl wenn im Input |
| DIN 77200-Bezug im Text | explizit nennen ja/nein |
| Verweis auf SK/GB im EK | wie formulieren |

---

## 6. Beispiel-Event (für `inputs/ec_event_kampfsport.json`)

Bitte **ein vollständiges Beispiel** als JSON `input_data` (realistisch für K1 Berlin, ~100 Zuschauer, 4 SMA o. ä. — Zahlen nur wenn du sie kennst, sonst leer + Kommentar).

```json
{
  "blueprint_id": "ec_event_kampfsport",
  "input_data": {
    
  }
}
```

---

## 7. Abgrenzung & Abhängigkeiten

| Frage | Antwort |
|-------|---------|
| EK vor oder nach SK im Prozess? | |
| Gleiche Person erstellt SK und EK? | |
| Welche SK-Abschnitte müssen in EK zwingend referenziert werden? | |
| Braucht EK Mindestinhalte aus GB (Arbeitsschutz)? | |
| ODA später — welche Felder aus EK übernehmen? | |

---

## 8. Nicht-Ziele (MVP-Grenze)

Was soll **bewusst nicht** in Version 1?

Beispiele zum Ankreuzen/Ergänzen:

- [ ] Mehrere Events / Tournee in einem Lauf  
- [ ] Automatische Kräfteoptimierung  
- [ ] PDF-Import aus Auftraggeber  
- [ ] CEKS-Freigabe-Workflow  
- [ ] Mobile App / Portal  
- [ ] Andere: ___

---

## 9. Lieferpaket für Cursor (von ChatGPT ausfüllen)

**Kopiere diesen Block ausgefüllt zurück an Cursor:**

```markdown
## EK-M4 Lieferpaket für Cursor

### Entscheidung MVP-Scope
- Event-Typ: ec_event_kampfsport / Kampfsport K1 / ~100 Zuschauer
- Modus: standalone | flow (SK upstream)
- Blueprint-ID bestätigt: ec_event_kampfsport

### AI-Blöcke (finale Reihenfolge)
1. …
2. …

### Pflichtfelder input_schema.required
- …

### Optional + field_labels (Stichworte DE)
- …

### critical_triggers (Klartext)
- …

### qa_rules
- max_open_points_for_ok: …
- require_approved_by: …

### Pflichtlektüre (Liste category/path)
- standards: …
- sdls: …
- practice_sources: …
- products: …
- rules: …
- guides: …
- prompts: (system_base, ec_user_prompt_template, …)

### Neue Dateien/Inhalte die Fachseite liefern muss
- ec_rules.md: Kernregeln in 5–10 Bulletpoints
- Praxisextrakt: …
- Sonstiges: …

### Beispiel-input_data (JSON)
{ … }

### Offene Punkte für Marwan
- [[OFFEN: …]]
```

---

## 10. Referenz — was im Repo schon steht (nicht neu erfinden)

ChatGPT soll **nicht** widersprechen, außer du willst bewusst ändern:

| Thema | Stand im Repo |
|-------|----------------|
| EK-Zweck | `knowledge/6_products/einsatzkonzept/purpose.md` |
| EC_*-Semantik | `knowledge/6_products/einsatzkonzept/content_blocks.md` |
| SK-Referenz-Bot | `sk_event_kampfsport` — fertig |
| Bauanleitung | `docs/BOT_BAUPPLAN.md`, `docs/BOT_PFLICHTREGELN.md` |
| Architektur EC-Blöcke | `docs/BLUEPRINT_ARCHITECTURE.md` §7.3 |
| Milestone | `docs/MILESTONE_PLAN_PARALLEL_AGENTS.md` — M4 EK-Bot MVP |

---

## 11. Kurzanweisung an ChatGPT (Copy-Paste)

```
Du bist Fachberater für Sicherheitsdienst-Dokumente (DIN 77200, SK/GB/EK).
Lies das angehängte Briefing (BRIEFING_CHATGPT_EK_M4.md) vollständig.
Nutze meinen bisherigen Kontext über Cert-Expert und unser K1-Event.
Fülle Abschnitte 3–9 aus. Keine erfundenen Gesetzesparagrafen oder Kräftezahlen —
wenn unbekannt: [[OFFEN: …]].
Am Ende nur Abschnitt 9 als sauberes Lieferpaket für einen Entwickler-Agenten (Cursor).
```

---

*Erstellt für Option C — EK-Bot MVP. Nach Rücklieferung: Cursor implementiert Blueprint, Template, Bot, Smoke, Validator.*
