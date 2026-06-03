# DOCUMENT_DEPENDENCY_MAP — GBU → SK → EK → ODA → Unterweisung

**Stand:** 2026-06-02  
**Status:** Architektur-Vorgabe (nicht vollständig implementiert)  
**Grundregel:** Upstream ist **Qualitätsbooster**, keine technische Pflicht.

---

## 1. Modi (verbindlich)

### 1.1 Standalone-Modus

| Eigenschaft | Regel |
|-------------|--------|
| Voraussetzung | Kein Upstream-Dokument nötig |
| Input | Vollständiger (oder bewusst lückenhafter) **Projekt-Input** + Pflichtlektüre |
| Lücken | `[OFFENER PUNKT]` — nie stillschweigend raten |
| QA | `review_required` bei offenen Punkten / fehlender Freigabe |
| Beispiel | EK ohne SK: `sk_protection_goals` manuell oder OP |

### 1.2 Dependency-Modus

| Eigenschaft | Regel |
|-------------|--------|
| Voraussetzung | Upstream-Dokument(e) **vorhanden und referenziert** |
| Import | Nur definierte Felder/Abschnitte (siehe Tabellen unten) |
| Konflikt | Upstream widerspricht neuem Input → **Input gewinnt**, Upstream als Hinweis |
| QA | Zusätzlich `dependency_incomplete` wenn referenzierter Upstream fehlt/teilweise |
| Beispiel | EK mit SK-JSON: Schutzziel/Maßnahmen übernehmen wenn EK-Feld leer |

### 1.3 Technische Umsetzung (heute vs. Ziel)

| Stufe | Heute | Ziel |
|-------|-------|------|
| Blueprint `modes` | `standalone`, `flow` deklariert | unverändert |
| Input | `upstream_sk_available`, `upstream_sk_path` (EK) | generisches `upstream_documents[]` |
| Code | EK: minimaler SK-Placeholder-Import | Orchestrator + Section-Import |
| QA | standalone only | + dependency-aware |

---

## 2. Dokumentenkette (fachliche Reihenfolge)

```
GBU (Gefährdungsbeurteilung / GB)
    │
    ├──► SK (Sicherheitskonzept)     ← Veranstalter-/Gesamtperspektive
    │
    └──► (parallel möglich)

SK ──► EK (Einsatzkonzept)           ← operative Umsetzung AN

EK ──► ODA (Objektbezogene Dienstanweisung)  ← SMA-Ebene

ODA ──► Unterweisung / Nachweise     ← Personenbezug, EW-OBJ / EW-EINS
```

**Wichtig:** GBU und SK können **parallel** entstehen; EK soll SK **kennen**, muss es aber nicht.

---

## 3. Informations-Matrix (was fließen darf)

Legende: **Ü** = übernehmen wenn vorhanden · **A** = aktiv abfragen wenn Upstream fehlt · **X** = nie ungeprüft übernehmen · **—** = nicht relevant

### 3.1 GBU → SK

| Information | Ü | A | X | Anmerkung |
|-------------|---|---|---|----------|
| Tätigkeitsbeschreibung SMA am Event | ● | ● | | aus GB `GB_TAETIGKEIT` |
| Gefährdungen (Top-Risiken) | ● | ● | | keine Matrix-Kopie 1:1 ohne Review |
| Schutzmaßnahmen (AN-Arbeitsschutz) | ● | ● | | SK-Maßnahmen Event-Ebene ergänzen |
| Restrisiken / offene Punkte GB | ● | — | | als SK-OP-Hinweis |
| Besucher-/Crowd-Risiken (wenn in GB) | ● | ● | | SK-Publikumslogik |
| Paragrafen / Normzitate | — | — | ● | nur Prinzip aus Extrakten |
| Konkrete Kräftezahl AN | — | ● | ● | SK ≠ Einsatzplanung |

### 3.2 SK → EK

| Information | Ü | A | X | Anmerkung |
|-------------|---|---|---|----------|
| Schutzziel | ● | ● | | `SK_SCHUTZZIEL` |
| Maßnahmenrahmen Event | ● | ● | | `SK_SCHUTZMASSNAHMEN` (Auszug) |
| Verantwortliche / Schnittstellen | ● | ● | | nicht Namen erfinden |
| Einlass-/Besucherlogik | ● | ● | | |
| Notfall / Räumung (Prinzip) | ● | ● | | kein genehmigter Plan ersetzen |
| Sanitätsregelung | ● | ● | | |
| Besondere Risiken / Auflagen | ● | ● | | |
| Offene SK-Punkte | ● | — | | in EK-OP übernehmen markiert |
| Exakte Kräftezahl | — | ● | ● | nur aus Auftrag/Input |
| Funkfrequenzen / Rufnummern | — | ● | ● | |

### 3.3 EK → ODA

| Information | Ü | A | X | Anmerkung |
|-------------|---|---|---|----------|
| Einsatzort / Zeiten | ● | ● | | |
| Rollen (EL, Einlass, Ring, …) | ● | ● | | ODA = Verhalten je Rolle |
| Abschnitte / Lageaufgaben | ● | ● | | |
| Melde- und Eskalationswege | ● | ● | | |
| Verbotenes / Hausrecht | ● | ● | | aus EK + Veranstalter |
| Notfallverhalten SMA | ● | ● | | |
| Dokumentationspflicht | ● | ● | | |
| Offene EK-Punkte | ● | — | ● | **nicht** in finale ODA |
| Strategische Schutzziele (lang) | — | — | ● | ODA operativ kurz |

### 3.4 ODA → Unterweisung / Nachweise

| Information | Ü | A | X | Anmerkung |
|-------------|---|---|---|----------|
| Aufgabe / Verhalten | ● | ● | | |
| Meldewege | ● | ● | | |
| Notfall / Eigensicherung | ● | ● | | |
| Ort-/Objektbezug | ● | ● | | |
| Offene ODA-Punkte | — | — | ● | Unterweisung nur bei `ok` |
| Personalqualifikation (CEKS) | — | ● | ● | Tool 2 / Akte, nicht Bot |

---

## 4. Fehlender Upstream — Pflicht-Abfrage (Standalone)

Wenn Dokumenttyp **D** ohne Upstream **U** erstellt wird, müssen diese **Mindestinformationen** im Input oder als OP existieren:

### EK ohne SK

| Feldgruppe | Mindestinhalt |
|------------|---------------|
| Schutzziel | `sk_protection_goals` manuell |
| Maßnahmenrahmen | `sk_key_measures` manuell |
| Einlass / Publikum | `entry_policy`, `expected_attendance`, … |
| Notfall | `evacuation_route`, `assembly_point`, `emergency_contacts` |
| Sanität | `medical_service` |

### ODA ohne EK

| Feldgruppe | Mindestinhalt |
|------------|---------------|
| Einsatzort/Zeiten | aus Projekt |
| Rollen/Abschnitte | explizit |
| Meldewege | explizit |
| Verhaltensregeln Einlass/Ring | explizit |

### SK ohne GBU

| Feldgruppe | Mindestinhalt |
|------------|---------------|
| Besondere Risiken | `special_risks` o. ä. |
| Crowd / Kapazität | Zuschauer, Exits, Kapazität |
| Maßnahmen Event-Ebene | manuell |

---

## 5. Nie ungeprüft übernehmen (alle Kanten)

| Kategorie | Beispiele |
|-----------|-----------|
| Zahlen ohne Quelle | Kräfte, Frequenzen, Telefonnummern, Kapazitätsgrenzen |
| Rechtliches | Paragrafen, Genehmigungen, behördliche Anordnungen |
| Freigaben | `approved_by`, Einsatzfreigabe CEKS |
| Volltext-Normen | DIN/CEKS-Abschnitte |
| Veraltete Upstreams | ohne Datum/Version → OP „Upstream veraltet“ |

---

## 6. Downstream-Exports (Blueprint `exports`)

Heute in JSON deklariert, semantisch zu nutzen:

| Blueprint | exports (Ist) | Nutzen |
|-----------|-----------------|--------|
| `sk_event_kampfsport` | measures, open_points, responsibilities | EK, GB |
| `ec_event_kampfsport` | roles, sections, open_points, measures | ODA |
| `gb_event_kampfsport_lean` | (siehe JSON) | SK-Informationsinput |

**Ziel:** standardisiertes `exports`-Schema pro Dokumenttyp in Section-Mapping.

---

## 7. Beispiel: Publikumszusammensetzung (Querschnitt)

| Stufe | SK | EK | ODA |
|-------|----|----|-----|
| Input-Felder | expected_attendees, alcohol, special_risks, … | + audience_profile, entry_policy | Verhalten Einlass, Deeskalation |
| Knowledge | crowd_veranstaltung, risk_patterns (GB-lean) | kampfsport_small_hall_event | oda + EW-Extrakt |
| Upstream | GBU-Risiko „Crowd“ → SK Maßnahme | SK Maßnahme → EK Abschnitt Einlass | EK Meldeweg → ODA |
| Fehlend | Section-Datei „Publikum“ | Section-Datei | Section-Datei |

Bot-Logik (Ziel): Section-Engine prüft Input → lädt Knowledge → schreibt Output-Felder → markiert Downstream-Pflichtfelder.

---

## 8. Implementierungs-Reife (Snapshot)

| Kante | Standalone | Dependency |
|-------|------------|------------|
| GBU → SK | manuell | nicht automatisiert |
| SK → EK | ✅ Input-Felder | ✅ minimal (2 Platzhalter) |
| EK → ODA | — | — |
| ODA → UW | — | — |

---

## 9. Verwandte Dokumente

- `SECTION_BASED_DOCUMENT_GENERATION_CONCEPT.md`
- `TARGET_ARCHITECTURE_PROPOSAL.md`
- `docs/BOT_PFLICHTREGELN.md`
- `knowledge/6_products/README.md`
