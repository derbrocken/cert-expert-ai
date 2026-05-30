# Tool-2-Datenmodell V1 — fachliche Domäne (CEKS)

Einstieg: [[README]] · Freigabekette: [[05_personnel_release_v1]] → [[06_sdl_release_v1]] → [[07_einsatz_release_v1]] · Hooks: [[03_matrix_release_hooks_v2]] · Matrix: [[04_qualifikationsmatrix_logik]] · Katalog: [[02_qualification_catalog_v2]]

**Status:** CEKS-V1 — **ausschließlich** fachliche Modellierung · **keine** Implementierung · **keine** Datenbank · **kein** Code · **keine** API

---

## 1. Zweck des Datenmodells

### Warum Tool 2 existiert

Tool 2 ist die **geplante** fachliche Schicht zur **Projektakte**: Nachweise, Freigabeentscheidungen und Einsatzfreigaben sollen **nachvollziehbar**, **versioniert** und **auditierbar** an Person, Verwendung und Einsatz gebunden werden — ohne Qualifikationslogik in Tabellenkalkulation oder isolierten Dateien zu verlieren.

CEKS liefert die **Regeln** (Katalog `02`, Matrix `04`, Freigabe `05`–`07`). Tool 2 soll diese Regeln **anwenden und dokumentieren**, nicht neu erfinden.

### Welche Freigaben verwaltet werden

| Freigabe (fachlich) | CEKS-Dokument | Domänenobjekt |
|---------------------|---------------|---------------|
| Personalfreigabe | [[05_personnel_release_v1]] | `PersonnelRelease` |
| SDL-Freigabe | [[06_sdl_release_v1]] | `SDLRelease` (Dokumentationsschicht) |
| Einsatzfreigabe | [[07_einsatz_release_v1]] | `DeploymentRelease` |

Die **Qualifikationsmatrix** (`04`) wird **nicht** als zweite Matrix in Tool 2 abgebildet — nur **abgeleitete Codes** und Prüfergebnisse pro Entscheidung.

### Welche Entscheidungen dokumentiert werden

Jede Freigabeschicht erzeugt eine **ReleaseDecision** (fachliches Muster): Wer hat wann, auf Basis welcher Prüfung, welchen **Status** gesetzt und mit welcher Begründung/Auflagen.

Konkret:

- **Person + Verwendung** (Auftrag, Objekt, Rolle, Schicht/Event) → Personalfreigabe  
- **SDL-Kontext** (Norm-SDL, Anhang) → SDL-Freigabe (gleiche inhaltliche Entscheidung, anderer Protokollfokus)  
- **Konkreter Einsatz** (Schicht, Datum, Lage) → Einsatzfreigabe  

### Welche Nachweise referenziert werden

Tool 2 **speichert keine Normtexte** — es **referenziert** Nachweise:

- Qualifikationsnachweise je **Code** aus [[02_qualification_catalog_v2]] (`GQ`, `PQ`, `SDL`, `Z772`, `WB`, `EW`, `FK`, …)  
- Auftragsdokumente **SK / EK / ODA (DI)** — keine Codes, aber Pflicht auf Auftrags-/Einsatzebene  
- Einweisungen **EW-OBJ** (objektbezogen) und **EW-EINS** (einsatz-/schichtbezogen)  

Verknüpfung über **EvidenceReference** → **QualificationEvidence** (oder vergleichbare Dokumentreferenz für SK/EK/ODA).

---

## 2. Kernobjekte

Gemeinsame Logik aus `03`, `05`, `06`, `07`:

- **Person** ist immer über `person_ref` — **keine** Namen im Knowledge-Standard.  
- **Codes** kommen aus Matrix `04`, nicht aus Freigabe-Dokumenten neu erfunden.  
- **Status** ist auf allen Schichten konsistent (s. Abschnitt 4).  
- **Blocker** verhindern höhere Freigaben, werden nicht „weggerechnet“.  
- **Einsatzfreigabe setzt voraus**, ersetzt nicht Personalfreigabe/SDL-Freigabe.

---

### Person

| Aspekt | Beschreibung |
|--------|--------------|
| **Zweck** | Fachlicher Anker für alle Nachweise und Freigaben einer einsetzbaren Person (Referenz-ID). |
| **Verantwortlichkeit** | Stammdaten und Nachweisportfolio werden in Tool 2 geführt; CEKS definiert nur Referenzregeln (`person_ref`, keine Namen im Knowledge). |
| **Beziehungen** | Hat viele `QualificationEvidence` (über `EvidenceReference`); ist Subjekt von `PersonnelRelease`, `SDLRelease`, `DeploymentRelease`; `ReleaseDecision` bezieht sich immer auf eine Person. |

Abgeleitet aus: `person_ref` in [[05_personnel_release_v1#Mindestfelder (Schema V1)]], [[07_einsatz_release_v1#Mindestfelder (Schema V1)]].

---

### QualificationEvidence

| Aspekt | Beschreibung |
|--------|--------------|
| **Zweck** | Ein konkreter Nachweis zu einem Qualifikationscode (Zertifikat, Einweisungsprotokoll, Schulungsnachweis) mit Gültigkeit. |
| **Verantwortlichkeit** | Nachweiserfassung und Aktualisierung (Wer liefert Dokument — organisatorisch, nicht technisch hier). |
| **Beziehungen** | Gehört zu `Person`; wird von `EvidenceReference` in Freigabeentscheidungen zitiert; Prüfung gegen `codes_geprueft` aus Matrix `04`. |

Fachliche Prüffrage (aus `05` Schritt C): Nachweis **vorhanden**? Gültigkeit **ok**?

Orientierung Hooks: [[03_matrix_release_hooks_v2#Tool-2-Anbindung (Perspektive)]] (`code`, Dokumentbezug, Gültigkeit — **ohne** technisches Feldschema).

---

### EvidenceReference

| Aspekt | Beschreibung |
|--------|--------------|
| **Zweck** | Verknüpft eine Freigabeentscheidung oder Prüfsituation mit einem oder mehreren Nachweisen — ohne den Nachweis zu duplizieren. |
| **Verantwortlichkeit** | Wird bei Freigabe dokumentiert („welcher Nachweis hat diese Prüfung gestützt“). |
| **Beziehungen** | Verweist auf `QualificationEvidence` (oder auf SK/EK/ODA-Dokument in der Projektakte); hängt an `ReleaseDecision` / `PersonnelRelease` / `DeploymentRelease`. |

Trennung: **Nachweis** (Bestand) vs. **Referenz** (Verwendung in einer konkreten Prüfung).

---

### ReleaseDecision

| Aspekt | Beschreibung |
|--------|--------------|
| **Zweck** | Abstraktes Muster: **dokumentierte Freigabeentscheidung** mit Status, Begründung, Auflagen, Prüfer, Gültigkeit. |
| **Verantwortlichkeit** | Fachlich verantwortliche Rolle (SMA, Schichtleitung, Qualität — je Schicht) trägt die Entscheidung; Tool 2 hält den Audit-Trail. |
| **Beziehungen** | Spezialisiert als `PersonnelRelease`, `SDLRelease` (Protokoll), `DeploymentRelease`; enthält `Blocker`-Liste; referenziert `EvidenceReference` und Ergebnis der Code-Prüfung aus `04`. |

Gemeinsame Felder (fachlich, aus `03`/`05`): Entscheidungs-ID, `person_ref`, Status, Begründung, Auflagen, `gueltig_bis`, Prüfer/Datum.

**Hinweis:** `SDLRelease` und `PersonnelRelease` können **dieselbe** inhaltliche `ReleaseDecision` sein — zwei Sichten, eine Wahrheit ([[06_sdl_release_v1#Beziehung Personalfreigabe ↔ SDL-Freigabe]]).

---

### PersonnelRelease

| Aspekt | Beschreibung |
|--------|--------------|
| **Zweck** | Entscheidung: Darf diese **Person** für diese **Verwendung** (Auftrag × Objekt × Rolle × Schicht/Event) eingesetzt werden? |
| **Verantwortlichkeit** | Qualitäts-/Freigabeprozess auf Verwendungsebene; dokumentiert in Projektakte. |
| **Beziehungen** | `Person` + abgestimmtes Profil (`profil_ref`, aktive Zeilen); `codes_geprueft` aus `04`; ist Voraussetzung für `DeploymentRelease`; Basis für `SDLRelease`. |

Vollständige Logik: [[05_personnel_release_v1]].

---

### SDLRelease

| Aspekt | Beschreibung |
|--------|--------------|
| **Zweck** | **Dokumentations- und Audit-Sicht** auf dieselbe Freigabe mit Fokus Norm-SDL, Anhang, Profilvorlage — **keine** zweite Entscheidungslogik. |
| **Verantwortlichkeit** | Gleiche wie Personalfreigabe; Protokolltitel und SDL-Kontext für Audit ([[06_sdl_release_v1#Protokoll-Titel (Empfehlung)]]). |
| **Beziehungen** | Verweist auf dieselbe `ReleaseDecision` / `PersonnelRelease`; ergänzt `norm_sdl`, `anhang_ref`; Voraussetzung für `DeploymentRelease` (`status_sdl_freigabe`). |

**Agent-Regel:** Nicht zwei widersprüchliche Entscheidungen für dieselbe Verwendung.

---

### DeploymentRelease

| Aspekt | Beschreibung |
|--------|--------------|
| **Zweck** | Letzte CEKS-Schicht: Darf der **konkrete Einsatz** (Schicht, Datum, Objekt/Auftrag, Lage) starten? |
| **Verantwortlichkeit** | Einsatz-/Schichtfreigabe vor operativem Start; eng mit Schichtleitung/Qualität vor Ort. |
| **Beziehungen** | `Person` + `rolle_ref`; **erbt** Status aus `PersonnelRelease` / `SDLRelease` (Referenz-IDs); prüft EW-OBJ, EW-EINS, Dokumentkette, abgelaufene Nachweise; Ergebnis `status_einsatz`. |

Vollständige Logik: [[07_einsatz_release_v1]].

---

### Blocker

| Aspekt | Beschreibung |
|--------|--------------|
| **Zweck** | Fachlicher Grund, warum keine (volle) Freigabe möglich ist — explizit, nicht implizit. |
| **Verantwortlichkeit** | Wird bei Prüfung identifiziert und an der betroffenen `ReleaseDecision` dokumentiert. |
| **Beziehungen** | Gehört zu `PersonnelRelease` oder `DeploymentRelease`; kann Code-bezogen (`PQ-EH` abgelaufen), strukturell (Stufe B, Nachweis A) oder dokumentkette-bezogen (SK fehlt) sein. |

Quellen: [[04_qualifikationsmatrix_logik#Typische Blocker (alle Referenz-SDL)]], [[05_personnel_release_v1#Typische Blocker → nicht_freigegeben]], [[07_einsatz_release_v1#Blocker (Einsatzebene)]].

---

### Verwandtes Objekt (nicht Kern, aber Anbindung)

| Objekt | Zweck | Bezug |
|--------|-------|-------|
| **Profil / ProjectProfile** | Abgestimmtes Anforderungsprofil (Anhang A/C) | `profil_ref` in `05`/`07`; Ableitung Codes über `04` — Tool 2 verlinkt, dupliziert keine Matrix |

---

## 3. Freigabekette und Vererbungslogik

### Übersicht

```
04 Qualifikationsmatrix (Logik, keine Person)
        ↓ codes_geprueft
Person
        ↓
PersonnelRelease  ←── ReleaseDecision (Person + Verwendung)
        ↓ (gleiche Entscheidung, SDL-Fokus)
SDLRelease        ←── ReleaseDecision (Protokoll, norm_sdl)
        ↓ (setzt voraus, prüft Einsatzkontext)
DeploymentRelease ←── ReleaseDecision (Schicht/Einsatz)
        ↓
Operativer Einsatz (außerhalb dieses Domänenmodells)
```

### Vererbungslogik (fachlich)

| Von | Nach | Regel |
|-----|------|-------|
| Matrix `04` | `PersonnelRelease` | `codes_geprueft` = Vereinigungsmenge aktiver Profilzeilen; Nachweise werden gegen diese Codes geprüft |
| `PersonnelRelease` | `SDLRelease` | **Keine neue** Code-Menge; Status und `codes_geprueft` **übernommen**; nur SDL-/Anhang-Kontext ergänzt |
| `PersonnelRelease` + `SDLRelease` | `DeploymentRelease` | `freigabe_id_personal` / optional `freigabe_id_sdl` **Pflicht**; `status_personalfreigabe` und `status_sdl_freigabe` müssen Einsatz abdecken |
| `PersonnelRelease` | `DeploymentRelease` | Bei `nicht_freigegeben` → Einsatz **immer** `nicht_freigegeben` (Abbruch Schritt 1 in `07`) |
| `PersonnelRelease` `eingeschraenkt` | `DeploymentRelease` | Einsatz nur freigegeben, wenn `einschraenkung` den **konkreten** Einsatz abdeckt — sonst Blocker |
| Nachweise `Person` | `DeploymentRelease` | Abgelaufene kritische Codes aus Personalfreigabe → erneute Prüfung auf Einsatzebene (`nachweise_abgelaufen`) |
| EW-OBJ / EW-EINS | `DeploymentRelease` | Zusätzlich zu Personalfreigabe — **einsatzspezifisch** erneut bestätigt |

**Nicht vererbt / nicht ersetzt:**

- Einsatzfreigabe **ersetzt** keine fehlende Personalfreigabe.  
- Gültige Personalfreigabe **ersetzt** kein fehlendes EW-EINS für diese Schicht.  
- SK/EK auf Auftragsebene (`05`) und Einsatzprüfung (`07`) — beide Ebenen können relevant sein.

---

## 4. Entscheidungslogik

### Statuswerte (Domäne Tool 2)

| Status | Bedeutung |
|--------|-----------|
| **freigegeben** | Alle relevanten Prüfungen erfüllt; keine offenen kritischen Blocker; ggf. dokumentierte Auflagen erfüllt |
| **eingeschraenkt_freigegeben** | Einsatz/Verwendung **unter dokumentierten Auflagen oder Teiltätigkeiten** zulässig; Begründung und Einschränkung **Pflicht** |
| **nicht_freigegeben** | Mindestens ein kritischer Blocker oder fehlende Pflicht (Dokumentkette, Code, Einweisung) |

**Abgleich CEKS V1:** In `05`–`07` heißt der mittlere Status fachlich **`eingeschraenkt`** — inhaltlich identisch mit **`eingeschraenkt_freigegeben`** in diesem Domänenmodell.

### Anwendung je Schicht

| Schicht | Typische freigegeben | Typische eingeschraenkt_freigegeben | Typische nicht_freigegeben |
|---------|----------------------|-------------------------------------|----------------------------|
| Personalfreigabe | Alle Codes gültig; Dokumentkette ok | WB-Auflage; nur Teiltätigkeiten des Profils | Stufe unterschritten; PQ-EH abgelaufen; Z772 fehlt |
| SDL-Freigabe | (= Personalfreigabe, SDL-Protokoll) | (= eingeschränkt, SDL-Kontext) | (= nicht freigegeben) |
| Einsatzfreigabe | Schritte 1–6 in `07` erfüllt | EW-EINS mit Auflage „vor Schichtbeginn“; Auflagen decken Einsatz | Keine gültige `05`; Einsatz außerhalb Einschränkung; SK/EK fehlt; EW-OBJ fehlt |

### Typische Blocker (übergreifend)

| Kategorie | Beispiel | Betroffene Schicht |
|-----------|----------|-------------------|
| Stufe | Profil B, Nachweis nur A | Personalfreigabe |
| Pflichtcode | `PQ-EH` abgelaufen | Personalfreigabe, Einsatz (erneut) |
| 77200-2 / Z772 | `Z772-OEPNV` fehlt | Personalfreigabe |
| Intervention | `SDL-INT-24H` fehlt | Personalfreigabe |
| Einweisung | `EW-OBJ` fehlt | Personalfreigabe, Einsatz |
| Auftrag | SK oder EK fehlt | Personalfreigabe (`auftrag_dokumentkette_ok`), Einsatz |
| Einsatzkontext | `EW-EINS` fehlt für Schicht | Einsatzfreigabe |
| Vererbung | Personalfreigabe `nicht_freigegeben` | Einsatzfreigabe (automatisch) |
| Einschränkung | Einsatz außerhalb `einschraenkung` | Einsatzfreigabe |

Detail: [[05_personnel_release_v1#Entscheidungsstatus]] · [[07_einsatz_release_v1#Prüfablauf (V1)]].

### Prüfkonjunktion (Personalfreigabe / SDL)

Aus `03`/`06` — in Tool 2 als **Prüfprotokoll**, nicht als zweite Matrix:

```
Profil (aktive Zeilen + höchste Stufe)
∧ GQ-* (Mindeststufe)
∧ PQ-* + WB-* (Baseline)
∧ EW-OBJ (+ EW-EINS wenn Event/mobil)
∧ SDL-* / Z772-* (nur wenn Profil/SDL es verlangt)
∧ Auftrags-Dokumentkette (wenn 77200-2 / SK-EK-Auslöser)
⇒ ReleaseDecision.status
```

Prioritäten bei Konflikt: [[03_matrix_release_hooks_v2#Prioritätsregeln]].

---

## 5. Governance

| Regel | Festlegung |
|-------|------------|
| **Tool 2** | Spätere **technische** Umsetzung (Software, Speicher, UI) — **nicht** Gegenstand dieses Dokuments |
| **Dieses Dokument** | Beschreibt **ausschließlich** die fachliche Domäne und Objektbeziehungen für CEKS |
| **Implementierung** | Datenbank, JSON, API, Frameworks — **bewusst getrennt**; eigene Architekturentscheidung nach Freigabe der Domäne |
| **Knowledge-Standard** | Keine Personennamen; keine Normauszüge; keine zweite Qualifikationsmatrix |
| **CEKS-Quelle** | Logik bleibt in `02`, `04`, `05`–`07` — Tool 2 **implementiert** nicht neu |

Ordner V1/V2: [[../../Governance/DIN 77200/QUALIFICATION_V1_V2]] · Roadmap: [[../../Governance/DIN 77200/ROADMAP]]

---

## Abgrenzung (was dieses Modell nicht ist)

| Nicht enthalten | Wo stattdessen |
|---------------|----------------|
| Datenbanktabellen, Spalten, Indizes | spätere Implementierung |
| JSON-Schemas, API-Endpunkte | spätere Implementierung |
| Schichtplan / Dienstplan | operative Systeme |
| Tool-1-Profil-Export | [[03_matrix_release_hooks_v2#Tool-1-Slots (Orientierung)]] |
| FK-Freigabe Detail | [[05_personnel_release_v1#Führungsrolle (FK-Freigabe)]] |

---

## Lesereihenfolge (Domänenmodell)

1. [[04_qualifikationsmatrix_logik]] — Codes ableiten  
2. [[05_personnel_release_v1]] — Personalfreigabe  
3. [[06_sdl_release_v1]] — SDL-Protokollschicht  
4. [[07_einsatz_release_v1]] — Einsatzfreigabe  
5. **Diese Datei** — Objekte und Vererbung für Tool 2  
6. [[03_matrix_release_hooks_v2]] — historische Hooks (werden durch `08` präzisiert)

---

## Agent-Regeln

- Domänenmodell **nur** aus `05`–`07` ableiten — nicht aus Gedächtnis oder parallelen V1-Dubletten ohne Verweis.  
- **Keine** technischen Artefakte in Knowledge-Dateien unter `qualifications/`.  
- Neue Tool-2-Fachlogik **nur** in `08` — **nicht** in `qualifikationssystem/` duplizieren.  
- Bei Widerspruch: `05`–`07` > diese Datei > `03` Hooks-Abschnitt.

---

## Verifikation

Vor Implementierung Tool 2: Abgleich mit [[05_personnel_release_v1]], [[07_einsatz_release_v1]], Primärquelle `inputs/raw_standards/`, [[../Qualifikationsanforderungen]].
