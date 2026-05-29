---
type: standard_module
standard: DIN 77200-1
module: Erforderliche Dokumente
module_id: required_documents
status: active
language: de
source_status: curated
knowledge_standard: CEKS_v1
parent_standard: DIN 77200-1
knowledge_path: knowledge/1_standards/DIN 77200-1/Erforderliche_Dokumente.md
source_documents:
  - inputs/raw_standards/din/DIN_77200_1_2022
  - inputs/raw_standards/din/DIN_77200_2_2020
norm_references:
  - "3.13"
  - "3.18"
  - "3.20"
  - "4.1"
  - "4.2"
  - "4.5"
  - "4.6"
  - "4.8"
  - "4.9"
  - "4.10"
  - "4.11"
  - "4.12"
  - "4.13"
  - "4.14.2"
  - "4.14.5"
  - "4.17"
  - "4.18"
  - "4.19.1"
  - "4.19.2"
  - "4.20"
  - "4.21"
  - "4.22"
  - "4.23"
  - "4.24"
  - "4.25"
  - "Anhang A"
related_modules:
  - leadership_requirements
  - qualification_requirements
  - requirements_profile
  - site_instruction
  - audit_evidence
  - further_training
  - subcontractors
related_processes:
  - auftrags_angebotsprozess
  - personalauswahl_qualifikation
  - einsatzplanung_fuehrung
  - qualitaetsmanagement_audit
  - melde_berichtswesen
  - subunternehmer_steuerung
related_document_types:
  - dienstleistungsvertrag
  - anforderungsprofil
  - dienstanweisung
  - einsatzkonzept
  - angebotsdokumentation
  - einweisungsprotokoll
  - unterweisungsprotokoll
  - einsatzbericht
  - meldeprotokoll
  - qualifikationsnachweis
  - subunternehmer_akte
related_sdls:
  - alarmdienst
  - stationaerer_empfangsdienst
  - stationaerer_kontrolldienst
  - revierdienst
  - interventionsdienst
  - mobiler_kontrolldienst
  - veranstaltungsdienst
tags:
  - din77200_1
  - dokumentation
  - nachweisportfolio
  - dokumentenfluss
  - angebotsdokumentation
created_for: cert_expert_ai
---

# Erforderliche Dokumente

Master-Modul: [[overview]] · Taxonomie: **Audit evidence & Dokumentationsarchitektur**

---

## Zweck

Modellierung der **gesamten Dokumentationslogik** der DIN 77200-1:2022-10 — nicht als flache Checkliste, sondern als **verknüpftes System** aus Vertrags-, Personal-, Einsatz- und Nachweisdokumenten mit klarer Trennung von **Normpflicht**, **Audit-Nachweis** und **Cert-Expert Best Practice**.

Dieses Modul ist der **Hub** für Dokumentenketten, Fehlstellen-Diagnostik (Bot/RAG) und Audit-Portfolio-Fragen. Detailinterpretation je Thema: [[Dienstanweisungen]], [[Qualifikationsanforderungen]], [[Führungsanforderungen]].

---

## Schichtenmodell

| Schicht | Bedeutung | Beispiel |
|---------|-----------|----------|
| **Normpflicht** | Was die DIN **muss**-fordernd verlangt | Schriftlicher Vertrag (4.10); DI Vertragsbestandteil; Einweisung vor erstem Einsatz (4.25) |
| **Audit-Nachweis** | Was Prüfer **nachvollziehbar** erwarten, auch wenn Form offen ist | Freigabeprotokoll AG-DI; Stichprobe Verfügbarkeit am Leistungsort; Qualifikationsmatrix |
| **Cert-Expert Best Practice** | Empfohlene Struktur/Workflow — **keine** Normersetzung | Nachweisregister; Objekt-Akte; digitale DI-Bibliothek; Review-Gates vor Kundenübergabe |

**QMS-Ergänzung** *(Literaturhinweis DIN 77200-1, 4.6 — ISO 9001):* **Interne Freigabe / Lenkung nach QMS** (7.5.2/7.5.3). Ersetzt **nicht** **AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI** bei Vertragsdokumenten.

---

## Dokumentenfluss (Gesamtlogik)

### Basiskette — einfache DIN-77200-1-SDLs *(Standardfall)*

Typisch für stationären Empfangs-, Kontroll-, Revier- oder mobilen Kontrolldienst **ohne** erhöhte Komplexität:

```
Vertrag (4.10)
  → Anforderungsprofil — Absprache AG/AN (4.11)
    → Dienstanweisung — AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI (4.10, 4.12, 4.23)
      → interne Freigabe / Lenkung nach QMS
        → Einweisung je SMA/Objekt (4.14.2, 4.25)
          → Unterweisung DI + Gewerberecht (4.14.5)
            → Leistungserbringung
              → Meldewesen / Einsatzdokumentation (4.20)
```

**Wichtig:** In diesem Standardfall entsteht **kein** automatischer Bedarf an **Sicherheitskonzept (SK)** oder **Einsatzkonzept (EK)** im laufenden Betrieb. Fehlende SK/EK bei einfacher SDL **allein** ist **kein** pauschaler Audit-Befund — Profil → DI ist zulässig (4.12).

*(Separat: Im **Angebot** kann 4.23 ein auftragsbezogenes Einsatzkonzept verlangen — das ist Angebots-/Ausschreibungslogik, nicht pauschale Betriebspflicht je SDL.)*

---

### Kontextvarianten

**A — Veranstaltungssicherungsdienst** *(77200-1 — **nicht** automatisch SK/EK)*

**Grundregel:** Die SDL „Veranstaltungssicherungsdienst“ **allein** löst **weder** SK **noch** EK aus. Entscheidend sind **Vertrag, Ausschreibung, AG-Vorgaben, Gefährdungslage und konkrete Anforderungen** — nicht der SDL-Typ.

*Einfache Veranstaltung (77200-1, ohne Auslöser — ausreichend):*
```
Vertrag / AG-Vorgaben → Anforderungsprofil → Dienstanweisung → Einweisung → Leistung
```

*Mit SK/EK-Auslösern (77200-1 — kontextabhängig / vertraglich / Audit):*
```
Vertrag / Ausschreibung → Sicherheitskonzept (SK) → Anforderungsprofil → Einsatzkonzept (EK) → Dienstanweisung → Einweisung → Leistung
```

**SK/EK-Auslöser** *(mindestens einer — keine Normpflicht durch SDL-Typ allein):*

- AG stellt ein Sicherheitskonzept bereit
- Vertrag / Ausschreibung fordert ein Sicherheitskonzept
- Behördliche Auflagen verlangen entsprechende Planung
- Besondere Gefährdungslage
- Erhöhte Sicherheitsrelevanz
- Mehrere Sicherheitsdienstleister / komplexe Schnittstellen
- Großveranstaltung oder komplexe Veranstaltungsstruktur
- Besondere Schutzgüter oder erhöhte Besuchergefährdung

Liegt **kein** Auslöser vor → **kein** pauschaler Audit-Befund wegen fehlendem SK/EK.

*DIN 77200-2 Kap. 5 — Veranstaltungen mit besonderer Sicherheitsrelevanz (Norm, unverändert):*
```
Vertrag → SK (AG, muss) → Anforderungsprofil (77200-1 + Anhang C) → EK (AN, muss) → Dienstanweisung (aus EK) → Einweisung → Leistung
```
*(Einzelfallbewertung AG nach 5.1 — **≠** jede 77200-1-Veranstaltung.)*

**B — Besondere Lage / erhöhte Komplexität** *(kontextabhängig)*

Beispiele: kritische Infrastruktur, Industrieanlagen, Hochrisiko-Objekte, politische Veranstaltungen, Großbaustellen, Sonderlagen, ausdrückliche AG-Anforderung, erhöhte Gefährdungslage; ergänzend **DIN 77200-2** bei besonderen Anwendungsgruppen.

```
Vertrag
  → (ggf.) Sicherheitskonzept (SK) — vom AG
    → Anforderungsprofil
      → (ggf.) Einsatzkonzept (EK) — AN
        → Dienstanweisung
          → Einweisung
            → Leistungserbringung
```

---

### SK / EK — Einordnung nach SDL-Kontext

| SDL-Kontext | Sicherheitskonzept (SK) | Einsatzkonzept (EK) |
|-------------|-------------------------|---------------------|
| **Einfache SDL** (77200-1, ohne 77200-2) | **Normalerweise nicht erforderlich** | **Normalerweise nicht erforderlich** *(Betrieb)*; im **Angebot** kontextabhängig (77200-1, 4.23) |
| **Veranstaltungssicherungsdienst** (nur 77200-1) | **Normalerweise nicht** — bei **Auslösern** (s. o.) kontextabhängig / vertraglich | **Normalerweise nicht** — folgt typischerweise, wenn SK im Spiel |
| **DIN 77200-2 — alle Kap. 5–8** | **Erforderlich** — AG **muss** bereitstellen | **Erforderlich** — AN **muss** erstellen |
| **77200-2 Kap. 5 — Veranstaltung bes. Relevanz** | **Erforderlich** + Einzelfallbewertung AG (5.1) | **Erforderlich** |
| **Ausdrückliche AG-Vorgabe / Ausschreibung** (77200-1) | **Erforderlich**, wenn vertraglich gefordert | **Erforderlich**, wenn vertraglich gefordert bzw. Angebot (4.23) |

Keine pauschalen Ja/Nein-Aussagen — immer **Vertrag, Profil, SDL-Typ und Lage** prüfen.

**DIN 77200-2-Abgrenzung** *(Primärquelle `source_documents`: DIN_77200_2_2020, Kap. 4 — gilt nur, wenn 77200-2 anwendbar ist):*

| Thema | Normlage |
|-------|----------|
| **SK** | AG **muss** SK im erforderlichen Umfang **zur Angebotserstellung** bereitstellen (4, Satz 1–2). Ohne SK **keine** SDL nach 77200-2. LV **kein** Ersatz. SK ist **Grundlage** für das Einsatzkonzept. |
| **EK** | AN **muss** EK erstellen und dem AG bereitstellen (4, Satz 4–5). Aus EK sind DI nach DIN 77200-1:2017-11, 4.12 zu erstellen. |
| **Vorortbegehung** | AG **muss** Vorortbegehung zur Angebotserstellung ermöglichen (4, ergänzend zu 77200-1, 4.23). |
| **Anwendungsgruppen** | Kap. 5 Veranstaltungen **mit besonderer** Sicherheitsrelevanz · Kap. 6 ÖPV · Kap. 7 Objekte besonderer Relevanz · Kap. 8 Flüchtlings-/Asylunterkünfte — **keine** weiteren Gruppen in dieser Ausgabe. |

**Wichtig:** DIN 77200-1-Veranstaltungssicherungsdienst **ohne** 77200-2-Tatbestand: **einfache Veranstaltung** → Profil → DI (ohne pauschales SK/EK); **mit Auslösern** (s. A) → SK/EK-Kette — **nicht** automatisch 77200-2-Pflicht SK+EK. 77200-2 Kap. 5 setzt **Einzelfallbewertung** des AG voraus (5.1), ob besondere Sicherheitsrelevanz vorliegt.

**AN erstellt das AG-Sicherheitskonzept nicht** — AN leitet Profil (77200-1, 4.11 + Anhang C 77200-2), EK, DI, Einweisungen und Personalplanung **aus** dem SK ab.

#### Cert-Expert Best Practice — Dokumentenbasierte Erstzertifizierung

*(Schicht **B** — Cert-Expert Best Practice; **keine** Normforderung. **Norm:** DIN 77200-2 setzt grundsätzlich ein vom Auftraggeber bereitgestelltes und freigegebenes Sicherheitskonzept voraus.)*

**Sonderfall — dokumentenbasierte Erstzertifizierung:** Bei einer dokumentenbasierten Erstzertifizierung kann Cert-Expert **einmalig** bei der Erstellung eines Sicherheitskonzeptes unterstützen oder eine geeignete Vorlage bereitstellen, wenn noch **kein** verwendbares Sicherheitskonzept vorhanden ist.

Dies dient **ausschließlich** der Herstellung der Zertifizierungsfähigkeit auf Dokumentenbasis und **ersetzt nicht** die Verantwortung des Auftraggebers für Prüfung, Freigabe, Aktualisierung und operative Anwendung des Sicherheitskonzeptes.

**Nach Freigabe durch den Auftraggeber** dient das Sicherheitskonzept als Grundlage für Einsatzkonzept, Dienstanweisungen, Einweisungen und weitere Nachweisdokumente.

---

### Vollständige Kette inkl. Nachweise *(Audit-Perspektive)*

```
Vertrag (4.10)
  → Anforderungsprofil (4.11)
    → (ggf. SK upstream — AG)
      → (ggf. EK — Angebot 4.23 / DI-Ergänzung 4.12)
        → Dienstanweisung
          → interne Freigabe / Lenkung nach QMS
            → Einweisung / Unterweisung
              → Leistungserbringung
                → Meldewesen (4.20)
                  → Archivierung / AG-Übermittlung
                    → Auditnachweise (4.1, 4.6, 4.18)
```

**Leitregeln des Flusses**

| Regel | Inhalt |
|-------|--------|
| **Profil first** | Anforderungsprofil ist zentrale **vertragliche** Festlegung — Qualifikation, DI-Inhalt und Einsatzplanung leiten sich daraus ab |
| **DI ≠ Profil** | DI operationalisiert; Profil definiert Tätigkeiten/Stufen — beide Vertragsbestandteil bzw. vertraglich verknüpft |
| **SK = AG-Eingabe** | Sicherheitskonzept ist **Upstream-Grundlage** des AG — AN dokumentiert Bezug, leitet ab, ersetzt SK nicht pauschal durch eigenes Planungsdokument |
| **EK-Kontext** | **Angebot (4.23):** AN muss auftragsbezogenes Einsatzkonzept im **Angebot** liefern, wenn Ausschreibung/Beauftragung es verlangt. **Laufender Betrieb:** EK **nicht pauschal** je SDL — DI kann aus Profil allein (4.12). Siehe [[Dienstanweisungen]] |
| **Kein Einsatz ohne Kette** | Fehlende Upstream-Dokumente → Leistung rechtlich/auditär unsicher — Bot markiert `[OFFENER PUNKT]` |

---

## Dokumentationsarchitektur — zwölf Bereiche

Legende in allen Tabellen: **N** = Normpflicht · **A** = Audit-Nachweis · **B** = Cert-Expert Best Practice

### 1. Vertragsdokumente

| Dokument | Funktion | N | A | B | Normanker |
|----------|----------|---|---|---|-----------|
| Dienstleistungsvertrag / Auftragsbestätigung | Rechtsrahmen, Befugnisse, Ansprechpartner | ✓ | ✓ | | 4.10 |
| Vertragsbestandteil Dienstanweisung | DI ist **Teil des Vertrages** | ✓ | ✓ | | 4.10 |
| Anforderungsprofil als Vertragsbestandteil | Tätigkeiten, SDL-Bezug, Qualifikationsgrundlage | ✓ | ✓ | | 4.11 |
| AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI | Form der Freigabe (4.23) | ○* | ✓ | ✓ | 4.23 |
| Haftungs-/Leistungsklauseln | Vertragliche Abgrenzung | | ✓ | | 4.4 |

*○ = AG **sollte** bei Beauftragung Festlegung treffen (4.23); in der Praxis auditkritisch, wenn fehlend.

**Logik:** Vertrag ohne Profil/DI-Bezug = Papier ohne operative Bindung. DI ohne AG-Abstimmung = kein wirksamer Vertragsbestandteil — siehe [[Dienstanweisungen]].

---

### 2. Anforderungsprofile

| Dokument | Funktion | N | A | B | Normanker |
|----------|----------|---|---|---|-----------|
| Auftragsspezifisches Anforderungsprofil | SDL-Tätigkeiten in Absprache AG/AN | ✓ | ✓ | | 4.11, Anhang A |
| Profil-Prüfprotokoll (jährlich) | Aktualität, Präzisierung | ✓ | ✓ | ✓ | 4.11 |
| Qualifikationsmatrix (Profil → Stufe A/B/C) | Ableitung aus Tabelle A.1 | | ✓ | ✓ | 4.11, Anhang A |
| Profil ↔ Personal-Nachweis | AN muss Passung jederzeit nachweisen | ✓ | ✓ | | 4.11, 4.14.2 |

**Logik:** Profil ist **Startpunkt** jeder dokumentarischen Bewertung — vor Qualifikation, DI, Einsatzplan. Detailmodul: [[Anforderungsprofile]].

---

### 3. Dienstanweisungen

| Dokument | Funktion | N | A | B | Normanker |
|----------|----------|---|---|---|-----------|
| Objekt-/aufgabenspezifische DI | Operative Regeln am Leistungsort | ✓ | ✓ | | 4.12 |
| AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI | **Abgestimmte** DI, dokumentierte Freigabe | ○* | ✓ | ✓ | 4.23, 4.10 |
| Interne Freigabe / Lenkung nach QMS | Ausgabekontrolle, Versionierung (7.5.2/7.5.3) | | ✓ | ✓ | 4.6, ISO 9001 7.5 |
| DI-Prüfprotokoll (12 Monate) | Formelle Prüfung, Aktualisierung | ✓ | ✓ | | 4.12 |
| Verfügbarkeitsnachweis Leistungsort | SMA + Einsatzleitung | ✓ | ✓ | | 4.12, 4.9 |
| Interventions-Regelwerk + Fallanweisungen | Zwei Ebenen bei Interventions-SDL | ✓ | ✓ | | 4.12 |

Detailmodul: [[Dienstanweisungen]].

---

### 4. Sicherheitskonzept und Einsatzkonzepte

| Dokument | Funktion | N | A | B | Normanker | Einordnung |
|----------|----------|---|---|---|-----------|------------|
| Sicherheitskonzept (SK) — **AG** | Planungsgrundlage; **77200-2:** AG **muss** bereitstellen | | A | B | 77200-2, Kap. 4 | **77200-2:** erforderlich · **77200-1 einfach:** normalerweise nicht · **77200-1 Veranstaltung:** nur bei **Auslösern** (s. A) |
| Auftragsbezogenes Einsatzkonzept (EK) *(Angebot/Betrieb)* | **77200-2:** AN **muss**; **77200-1:** Angebot 4.23 kontextabhängig | ✓* | ✓ | | 77200-2, Kap. 4; 77200-1, 4.23 | **77200-2:** erforderlich · **77200-1 einfach:** normalerweise nicht · **77200-1 Veranstaltung:** nur bei **Auslösern** |
| EK als DI-Grundlage *(laufender Betrieb)* | **77200-2:** DI **aus EK** (Kap. 4); **77200-1:** Alternative/Ergänzung zu Profil | ○** | ✓ | | 77200-2, Kap. 4; 77200-1, 4.12 | **77200-2:** erforderlich · **77200-1 einfach:** normalerweise nicht |
| Konformitäts-/Normerklärung (Kurzdoku) | AN-Dokumentation zur Normeinhaltung im Angebot | ✓ | ✓ | | 4.23 | Angebot |

*○* AG sollte EK-Vorgaben in Beauftragung festlegen (4.23).  
**○** DI kann **nach Profil oder EK** erstellt werden — EK nicht pauschal je SDL für laufenden Betrieb.

**Logik SK/EK:** SK **vom AG** — AN **leitet ab** (Profil, EK, DI, Einweisung, Personal). AN erstellt **nicht** das AG-Sicherheitskonzept. **77200-2:** SK+EK **normativ erforderlich** (Kap. 4). **77200-1 ohne 77200-2:** bei einfachen SDLs weder SK noch EK pauschal; **77200-1-Veranstaltung** nur bei **Auslösern** (s. A), nicht automatisch 77200-2-Niveau.

**Wann EK über Angebot hinaus audit-relevant:** wenn **Auslöser** (s. Veranstaltung A) oder vertragliche/AG-Vorgabe — **nicht** allein wegen SDL-Typ „Veranstaltung“.

---

### 5. Qualifikationsnachweise

| Dokument | Funktion | N | A | B | Normanker |
|----------|----------|---|---|---|-----------|
| §34a-Unterrichtung / Sachkundeprüfung | Grundqualifikation je SMA | ✓ | ✓ | | 4.1 b) 1–2 |
| Stufen-B/C-Zeugnisse *(nur wenn Profil)* | Tätigkeitsqualifikation Anhang A | ✓ | ✓ | | 4.19.1, Anhang A |
| Ersthelfer-Nachweis | Wenn Profil/Tätigkeit es erfordert | ✓ | ✓ | | 4.19.1 |
| Interventions-Schulung + 5 Einsätze | Interventions-SMA | ✓ | ✓ | | 4.19.1 |
| Führungsqualifikation | Führungskräfte gesondert | ✓ | ✓ | | 4.19.1, 4.24 |
| Weiterbildungskonzept + UE-Nachweise | Fortführung nach Erstqualifikation | ✓ | ✓ | | 4.19.2 |
| Personalakte / Nachweisregister | Bündelung aller SMA-Nachweise | | ✓ | ✓ | 4.1 b), 4.9 |

Detailmodul: [[Qualifikationsanforderungen]].

---

### 6. Einweisungen

| Dokument | Funktion | N | A | B | Normanker |
|----------|----------|---|---|---|-----------|
| Einweisungsprotokoll DI je AG/Objekt | **Vor erstem Einsatz** beim jeweiligen AG | ✓ | ✓ | | 4.14.2, 4.25, 4.1 b) 3 |
| Einweisungsverantwortung (AN vs. AG) | Vertraglich festgelegt | ○ | ✓ | | 4.23 |
| Objektbezogene Zusatzunterlagen | Schlüssel, Technik, Besonderheiten | | ✓ | ✓ | 4.12, 4.21 |

**Abgrenzung:** Einweisung = **objekt-/auftragsspezifisch**, personalbezogen, **einmalig je AG/Objekt** (vor erstem Einsatz). Ersetzt **nicht** Unterweisung (4.14.5).

---

### 7. Unterweisungen

| Dokument | Funktion | N | A | B | Normanker |
|----------|----------|---|---|---|-----------|
| Unterweisungsprotokoll DI + Gewerberecht | Vor Dienstaufnahme + **jährlich** | ✓ | ✓ | | 4.14.5 |
| Interventions-Unterweisung Regelwerk | Regelwerk-Unterweisung ausreichend (Intervention) | ✓ | ✓ | | 4.14.5, 4.12 |
| AGS-Unterweisung / Belehrung | Ergänzend zu GB (4.8) | ✓ | ✓ | | 4.8 |

**Abgrenzung:** Unterweisung ersetzt **keine** Qualifikationszeugnisse (§34a, B/C) — nur regelmäßige Wissensaktualisierung.

---

### 8. Meldewesen

| Dokument | Funktion | N | A | B | Normanker |
|----------|----------|---|---|---|-----------|
| Schriftliche Verantwortlichkeitsregelung Meldewesen | Wer meldet was, wann, an wen | ✓ | ✓ | | 4.20 |
| Meldeprotokolle / Einsatzaufzeichnungen | Sicherheitsrelevante Ereignisse | ✓ | ✓ | | 4.20, 4.12 |
| AG-Übermittlungsnachweis | Sicherheitsgefährdende Feststellungen an AG | ✓ | ✓ | | 4.20, 4.23 |
| Archivierungskonzept | Aufbewahrung, Zugriff, Verteilung | ✓ | ✓ | ✓ | 4.20, 4.9 |
| Kommunikationsprotokoll Leitstelle | Verbindung, Alarme | ✓ | ✓ | | 4.17 |

**Logik:** DI regelt **Meldewesen-Inhalt** (4.12); 4.20 regelt **System** (Verantwortung, Führung, Archiv, AG-Kommunikation).

---

### 9. Berichte

| Dokument | Funktion | N | A | B | Normanker |
|----------|----------|---|---|---|-----------|
| Einsatzdokumentation / Schichtberichte | Qualitative/quantitative Aufgabenerfüllung | ✓ | ✓ | | 4.20 |
| Kontrollgänge / Revierprotokolle | Nachweis erbrachter SDL (Wächterkontrolle etc.) | ✓ | ✓ | | 4.18 |
| Kontrollsystem-Auswertungen für AG | Wenn vereinbart | ○ | ✓ | | 4.18, 4.23 |
| Vorfall-/Abweichungsberichte | Eskalation, Maßnahmen, Wirksamkeit | ✓ | ✓ | ✓ | 4.20, 4.24 |
| Schließmittel-Quittungen / Revisionsberichte | Übergabe, Prüfung, Revision | ✓ | ✓ | | 4.21 |
| Ausrüstungszustandsnachweise AG-Ausrüstung | Identifikation, Zustand, Schutz | ✓ | ✓ | | 4.22 |

---

### 10. Führungsnachweise

| Dokument | Funktion | N | A | B | Normanker |
|----------|----------|---|---|---|-----------|
| Organigramm SDL-orientiert | Einsatzleitung erkennbar | ✓ | ✓ | | 4.2 |
| Stellenbeschreibungen Führungskräfte | Verantwortlichkeiten, Weisungsgrenzen | ✓ | ✓ | | 4.2 |
| Einsatzplan / Schichtplan mit Führungszuordnung | Benannte Führungskraft je SDL | ✓ | ✓ | | 4.24 |
| Kompetenzrahmen (stationär, AG mitgeteilt) | AG-Kenntnis Führungskompetenz | ✓ | ✓ | | 4.24, 4.23 |
| Abweichungs-/Eskalationsprotokolle | Erkennen, Korrigieren, Eskalieren | ✓ | ✓ | | 4.24 |
| Kommunikations- / Verbindungsprotokoll | Leitstelle, stündliche Verbindung | ✓ | ✓ | | 4.17 |

Detailmodul: [[Führungsanforderungen]].

---

### 11. Subunternehmer-Nachweise

| Dokument | Funktion | N | A | B | Normanker |
|----------|----------|---|---|---|-----------|
| Schriftliche AG-Zustimmung Sub-Einsatz | Vor Einsatz Subunternehmer | ✓ | ✓ | | 4.13 |
| Sub-Prüfprotokoll (Normkonformität) | Je Auftragsvergabe; jährlich bei >12 Mon. | ✓ | ✓ | | 4.13 |
| Namentliche Benennung Sub-SMA an AG | Vor Einsatz, schriftlich | ✓ | ✓ | | 4.13 |
| Sub-Qualifikationsakte | Parität zu AN-Personal (Profil, §34a, Einweisung) | ✓ | ✓ | ✓ | 4.13, 4.14.2 |
| Kein Weiter-Subunternehmer | Vertragliche Aussage | ✓ | ✓ | | 4.13 |

Detailmodul: [[Subunternehmer]] *(geplant)*.

---

### 12. Audit-Nachweise (Unternehmens- / Systemebene)

| Dokument | Funktion | N | A | B | Normanker |
|----------|----------|---|---|---|-----------|
| Gewerbezentralregister (jährlich) | Unternehmensnachweis | ✓ | ✓ | | 4.1 a) 1 |
| Finanzamt / SV-Unbedenklichkeit | Jährlich / SV ≤6 Mon. | ✓ | ✓ | | 4.1 a) 1 |
| Datenschutz- / Verschwiegenheitserklärungen (Unternehmen) | Vertretungsberechtigte | ✓ | ✓ | | 4.1 a) 2–3 |
| Mindestlohn-Eigenerklärung | Unternehmensnachweis | ✓ | ✓ | | 4.1 a) 4 |
| Schriftliche Verfahren (VA) | DI, Unterweisung, Qualifikation, Meldewesen, Beschwerde, Schließmittel, … | ✓ | ✓ | ✓ | 4.1 a) 5 |
| QMS-Nachweis (z. B. ISO 9001) | Qualitätsmanagement | ✓ | ✓ | | 4.6 |
| Interne Auditberichte / Besprechungsprotokolle | Regelmäßige QM-Audits | ✓ | ✓ | | 4.6 |
| GB je Leistungsort | AGS-Nachweis | ✓ | ✓ | | 4.8 |
| Betriebshaftpflicht | Deckungsnachweis | ✓ | ✓ | | 4.3 |
| Zertifizierung / Konformitätserklärung | Wenn vereinbart oder Marktstandard | ○ | ✓ | | 4.23, Einleitung |
| Geschäftsräume / Aktenführung | SDL-Akten, DI, Personal, Objektdaten | ✓ | ✓ | | 4.9 |

Detailmodul: [[Auditnachweise]].

---

## Master-Matrix — Dokument × Lebenszyklus

| Phase | Pflichtdokumente (Norm) | Typische Audit-Stichprobe |
|-------|-------------------------|---------------------------|
| **Angebot / Beauftragung** | Konformitätskurzdoku, **Einsatzkonzept (4.23)**, Profil-Vorgabe (AG), 4.23-Festlegungen | Angebotsmappe: EC? |
| **Vertragsschluss** | Vertrag, Profil, DI als Bestandteil, Freigabeform DI | Vertragsmappe je Auftrag |
| **Vorbereitung Einsatz** | DI freigegeben, Qualifikation, Einweisung geplant — **Profil → DI**; *(ggf.)* SK/EK nur bei **Auslösern** / besonderer Lage / 77200-2 | Profil ↔ Personal ↔ DI |
| **Vor erstem Einsatz** | Einweisung, Unterweisung, Sub-Freigabe falls relevant | Einweisung **vor** Schicht stattgefunden? |
| **Laufender Betrieb** | DI verfügbar, Meldeprotokolle, Schichtführung | Vor-Ort-Stichprobe |
| **Zyklisch** | DI-Prüfung 12 Mon., Profil 12 Mon., Unterweisung 12 Mon., UE Weiterbildung | Prüfdaten im Kalender |
| **Audit / Zertifizierung** | 4.1-Portfolio, QMS, GB, interne Audits | Nachweisregister vollständig |

---

## Fehlende Dokumente — Auswirkungen, NC, Folgeprozess

*(Bot-/RAG-Entscheidungslogik — bei fehlendem Dokument nicht raten, sondern Spur zuordnen)*

| Fehlendes Dokument | Auswirkung | Typ. NC | Folgeprozess / Modul |
|--------------------|------------|---------|----------------------|
| **Vertrag / Auftragsbestätigung** | Kein Rechtsrahmen; SDL ohne verbindliche Befugnisse | NC-V01 | Auftragsprozess; Leistung stoppen bis Klärung |
| **Anforderungsprofil** | Keine vertragliche Tätigkeits-/Qualifikationsbasis | NC-P01 | [[Qualifikationsanforderungen]]; Profil mit AG erstellen |
| **Profil veraltet (>12 Mon.)** | Falsche Tätigkeits-/Qualifikationsannahmen | NC-P02 | Profil-Review; DI/Plan anpassen |
| **Dienstanweisung** | Keine operative Leitplanke am Objekt | NC-D01 | [[Dienstanweisungen]]; DI aus Profil erstellen |
| **AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI** | DI nicht wirksam als Vertragsbestandteil | NC-D02 | [[Dienstanweisungen]]; 4.23-Nachweis nachholen |
| **DI nicht am Leistungsort** | SMA ohne Regelwerk; Haftungs-/Auditrisiko | NC-D03 | Verteilung; Verfügbarkeit sicherstellen |
| **DI-Prüfprotokoll >12 Mon.** | Veraltete Regeln im Einsatz | NC-D04 | Formelle Prüfung; ggf. AG informieren |
| **Einsatzkonzept (Angebot/4.23)** | Angebots-/Ausschreibungs-NC — **nicht** automatisch Betriebs-NC | NC-E01 | Angebotsprozess |
| **EK fehlt bei Veranstaltung mit Auslösern / komplexer SDL** | Planungslücke — oft Audit-Hinweis, nicht immer Norm-NC | NC-E02* | EK ergänzen; DI angleichen |
| **SK fehlt bei 77200-2-Auftrag** | **Norm:** keine SDL nach 77200-2 möglich (Kap. 4) | NC-E03 | SK beim AG einfordern; Leistung bis Klärung riskant |
| **EK fehlt bei 77200-2-Auftrag** | **Norm:** AN-Pflicht nicht erfüllt (Kap. 4) | NC-E04 | EK erstellen; DI aus EK ableiten |
| **§34a-Nachweis SMA** | Unzulässiger Einsatz | NC-Q01 | [[Qualifikationsanforderungen]]; Einsatz sperren |
| **Profil fordert B/C — nur §34a** | Qualifikationslücke | NC-Q02 | Personal tauschen oder Profil korrigieren |
| **Einweisung vor erstem Einsatz** | SMA ohne Objektkenntnis | NC-I01 | Einweisung nachholen; Einsatz bis dahin unzulässig |
| **Unterweisung (>12 Mon.)** | Compliance-Lücke Gewerberecht/DI | NC-U01 | Unterweisung planen |
| **Meldewesen-Verfahren** | Unklare Verantwortung bei Vorfällen | NC-M01 | 4.20-VA; DI-Meldewege prüfen |
| **Einsatzdokumentation / Berichte** | Leistung nicht nachweisbar | NC-M02 | Melde-/Berichtswesen; 4.18-Kontrolle |
| **AG-Meldung sicherheitsgef. Feststellung** | Vertrags-/Informationsbruch | NC-M03 | Sofortmeldeprozess; Archiv |
| **Organigramm / Einsatzleitung** | Führungsstruktur nicht nachweisbar | NC-F01 | [[Führungsanforderungen]] |
| **Führungsqualifikation 4.19.1** | Unqualifizierte Führung | NC-F02 | [[Führungsanforderungen]] |
| **Sub AG-Zustimmung** | Rechtswidriges Sub-Deployment | NC-S01 | [[Subunternehmer]]; Einsatz stoppen |
| **Sub-SMA nicht benannt** | AG-Transparenz fehlt | NC-S02 | Benennung nachholen |
| **4.1-Unternehmensnachweise** | Zertifizierungs-/System-NC | NC-A01 | [[Auditnachweise]]; QM |
| **QMS-Nachweis** | 4.6-NC | NC-A02 | ISO-9001-Zertifikat / gleichwertig |
| **GB Leistungsort** | AGS-NC | NC-A03 | GB erstellen/aktualisieren |
| **Interne Freigabe / Lenkung nach QMS** | QMS-Lücken bei zertifiziertem AN | NC-A04 | Interne Freigabe nachholen |

*NC-E02: Audit-Hinweis bei Veranstaltung **mit Auslösern** / komplexer SDL ohne EK — **nicht** bei einfacher 77200-1-Veranstaltung ohne Auslöser; Normpflicht primär im **Angebots**kontext (4.23); im Betrieb **kontextabhängig**.  
*NC-E03: DIN 77200-2, Kap. 4 — ohne SK des AG **keine** SDL nach 77200-2.  
*NC-E04: DIN 77200-2, Kap. 4 — EK **muss** vom AN; DI **aus EK**.

---

## Anforderungsübersicht

### Normative Anforderung

**Unternehmensnachweise (4.1 a)**

- Jährliche Register-/Finanz-/SV-Nachweise; Datenschutz, Verschwiegenheit, Mindestlohn; **schriftlich dokumentierte Verfahren** für DI, Unterweisung, Qualifikation, Weiterbildung, Meldewesen, Beschwerde, Dienstausweise, Schließmittel.

**Mitarbeiternachweise (4.1 b)**

- §34a; Einweisung in DI; Datenschutz/Verschwiegenheit — je eingesetztem SMA.

**Vertrags- und Auftragsdokumente (4.10, 4.11, 4.23)**

- Schriftlicher Vertrag; Profil in Absprache; DI Vertragsbestandteil; AG-Festlegungen bei Beauftragung (Profil, DI-Freigabe, Meldewesen, Sub, Kontrollsysteme, …).

**Einsatzdokumentation (4.20)**

- Schriftliche Verantwortlichkeiten; Aufzeichnungen zu Aufgabenerfüllung, AGS, sicherheitsgefährdenden Feststellungen; Sammlung, Prüfung, Verteilung, AG-Übermittlung, Archivierung.

**Angebot des AN (4.23)**

- Kurzdoku Normeinhaltung; **auftragsbezogenes Einsatzkonzept** (4.23-Angebot) mit Qualifikationsdarstellung; auf Wunsch erweiterte Angebotsunterlagen — **ohne** pauschale EC-Pflicht im laufenden Betrieb.

### Praxisumsetzung

*(Cert-Expert Best Practice — nicht normativ)*

- **Objekt-Akte** je Vertrag: Vertrag, Profil, DI, *(ggf.)* SK (AG), *(ggf.)* EK, Einweisungen, Meldeproben, Sub-Akten.
- **Nachweisregister** (4.1-Checkliste) mit Fristen: GZR, SV, DI-Prüfung, Profil, Unterweisung, Ersthelfer, UE.
- **Review-Gates** vor Leistungsstart: Profil ✓ → DI freigegeben ✓ → Personal qualifiziert ✓ → Einweisung ✓.
- Digitale Lenkung: Version, `approved_by`, Verteilungslog — aligned zu ISO 9001 7.5 und Cert-Expert `qa_status`.
- Angebotsmappe als **Template** je Ausschreibung — 4.23-Punkte vorab mit AG abhaken.

---

## Audit-Relevanz

| Priorität | Thema | Normanker |
|----------|-------|-----------|
| Kritisch | Vertragsmappe vollständig (Vertrag, Profil, DI-Bezug) | 4.10, 4.11 |
| Kritisch | DI: Inhalt, Verfügbarkeit; **AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI** | 4.12, 4.23 |
| Kritisch | Profil ↔ eingesetztes Personal (Qualifikation) | 4.11, 4.14.2, 4.19.1 |
| Kritisch | Einweisung vor erstem Einsatz | 4.25, 4.14.2 |
| Kritisch | 4.1-Nachweisportfolio Unternehmen + SMA | 4.1 |
| Hoch | Melde-/Berichtswesen operativ nachweisbar | 4.20 |
| Hoch | Führungsnachweise (Organigramm, Einsatzplan, Qualifikation) | 4.2, 4.24 |
| Hoch | Unterweisung aktuell (≤12 Mon.) | 4.14.5 |
| Hoch | Angebots-EC (4.23) — **nicht** pauschal EC im laufenden Betrieb | 4.23, 4.12 |
| Hoch | Subunternehmer-Akte vollständig | 4.13 |
| Mittel | QMS, interne Audits, GB je Leistungsort | 4.6, 4.8 |
| Mittel | Kontrollsystem-Nachweise / Auswertungen | 4.18 |
| Mittel | Schließmittel / AG-Ausrüstung | 4.21, 4.22 |

Auditor-Traces: **4.1-Register** → Stichprobe Vertrag/Profil → DI vor Ort → Personalakte → Einweisung → Schichtprotokoll → Rückverfolgung Meldewesen.

---

## Audit-Nachweise

| Nachweisart | Inhalt | Schicht |
|-------------|--------|---------|
| Vertragsmappe je Auftrag | Vertrag, Profil, DI-Referenz, Freigaben | Norm/Audit |
| Angebotsmappe | EC, Konformitätskurzdoku, 4.23-Vorgaben | Norm/Audit |
| Nachweisregister 4.1 | Unternehmen + SMA, Fristen | Audit |
| Qualifikationsmatrix | Profil-Tätigkeit ↔ SMA ↔ Nachweis | Audit |
| Einweisungs-/Unterweisungsprotokolle | Personalbezogen, datiert | Norm |
| Einsatz-/Schicht-/Meldeprotokolle | Laufender Betrieb | Norm/Audit |
| DI-Prüf- / Profil-Prüfprotokolle | Zyklisch | Norm |
| Führungsakte | Organigramm, Stellenbeschreibung, Einsatzplan | Norm |
| Sub-Akte | Zustimmung, Prüfung, Benennung | Norm |
| QMS-Zertifikat, interne Audits | Systemebene | Norm |
| GB je Leistungsort | AGS | Norm |
| Archiv abgelöster Versionen | Lenkung | Audit/Best Practice |

---

## Typische Auditorfragen

1. Zeigen Sie die **Vertragsmappe** zu diesem Auftrag: Vertrag, Profil, DI-Einbindung?
2. Wo ist das **Anforderungsprofil** — wann zuletzt geprüft?
3. Wie ist **AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI** umgesetzt (4.23)?
4. Liegt **interne Freigabe / Lenkung nach QMS** der DI vor?
5. Ist die DI am **Leistungsort** verfügbar — Stichprobe?
6. Wann wurde die DI zuletzt **formell geprüft** (12 Mon.)?
7. **Einsatzkonzept (Angebot/4.23):** Wo im Angebot — Konsistenz zur DI? *(Fehlendes EC im Betrieb ≠ pauschal NC.)*
8. Zeigen Sie **§34a** und ggf. B/C-Nachweise für die heute eingesetzten SMA.
9. **Einweisung** vor erstem Einsatz — wo dokumentiert?
10. **Unterweisung** aktuell (≤12 Mon.)?
11. Wie funktioniert **Meldewesen** — Verantwortlichkeit, AG-Übermittlung, Archiv?
12. Schicht-/Einsatzberichte der letzten Wochen — Vollständigkeit?
13. Wer ist **Führungskraft** heute — Qualifikation, Einsatzplan?
14. **Subunternehmer:** AG-Zustimmung, Benennung, Qualifikationsparität?
15. **4.1-Portfolio:** GZR, Finanzamt, SV, Verfahrensanweisungen?
16. **QMS / interne Audits** — letzter Zyklus?
17. **GB** für diesen Leistungsort?

---

## Typische Abweichungen

| NC | Typischer Befund |
|----|------------------|
| NC-V01 | Kein schriftlicher Vertrag / Auftragsbestätigung |
| NC-V02 | DI nicht als Vertragsbestandteil eingeordnet |
| NC-P01 | Anforderungsprofil fehlt oder ohne AG-Absprache |
| NC-P02 | Profil >12 Mon. nicht überprüft |
| NC-D01 | DI fehlt je Objekt/Auftrag |
| NC-D02 | Keine **AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI** |
| NC-D03 | DI nicht am Leistungsort verfügbar |
| NC-D04 | DI-Prüfung überfällig |
| NC-E01 | Angebot ohne auftragsbezogenes Einsatzkonzept **(4.23-Angebotskontext)** |
| NC-Q01 | SMA ohne §34a im Einsatz |
| NC-Q02 | Profil B/C — Personal nur Stufe A |
| NC-I01 | Einweisung nach erstem Einsatz oder fehlend |
| NC-U01 | Unterweisung überfällig |
| NC-M01 | Meldewesen-Verfahren undurchsichtig / fehlend |
| NC-M02 | Einsatzdokumentation lückenhaft |
| NC-F01 | Einsatzleitung / Führungszuordnung nicht nachweisbar |
| NC-S01 | Sub ohne schriftliche AG-Zustimmung |
| NC-A01 | 4.1-Nachweise unvollständig oder abgelaufen |
| NC-A02 | QMS-Nachweis fehlt (4.6) |
| NC-A03 | GB am Leistungsort fehlt (4.8) |

---

## Risiken

| Risiko | Auswirkung |
|--------|------------|
| Dokumentenkette unterbrochen | Leistung ohne vertragliche/auditäre Absicherung |
| Profil ≠ Personal ≠ DI | Falsche Tätigkeit; Qualifikations-/Haftungsrisiko |
| Fehlende AG-Abstimmung / Freigabe der abgestimmten DI | Vertragsbestandteil-DI unwirksam |
| Fehlende Einweisung | SMA handeln ohne Objektkenntnis |
| Meldelücke | AG erfährt Vorfälle zu spät; 4.20-NC |
| Unvollständiges 4.1-Portfolio | Zertifizierungsverlust; AG-Auditversagen |
| Papier-Compliance ohne Vor-Ort-DI | Stichprobe entlarvt Schein-Dokumentation |
| Sub-Akte lückenhaft | Mitverantwortung AN; AG-Streit |

---

## Cert-Expert-Anwendung

**Routing:** Modul laden bei Fragen zu **Nachweisportfolio, Dokumentenfluss, fehlenden Unterlagen, Angebotsmappe, Vertragsmappe, Audit-Vorbereitung** — Detailthemen in Peer-Modulen.

**Dokumentprodukte im Cert-Expert-Ökosystem**

| Produkt | Rolle in der Kette |
|---------|-------------------|
| Anforderungsprofil | Vertragliche Basis |
| Sicherheitskonzept (SK) | **AG-Eingabe** — AN leitet Profil/EK/DI ab; **nicht** pauschal AN-Pflichtdokument |
| Einsatzkonzept (EK) | **Angebot (4.23)**; *(ggf.)* DI-Ergänzung im Betrieb — kontextabhängig |
| Dienstanweisung (ODA) | Operative Regeln |
| Gefährdungsbeurteilung (GB) | AGS — parallel zu DI, kein Ersatz |
| Einweisungs-/Unterweisungsprotokolle | Personalnachweis |
| Einsatzberichte / Meldeprotokolle | 4.20-Laufzeit |

---

## Bot-/RAG-Regeln

**Entscheidungslogik bei fehlendem Dokument**

```
1. Welche Phase?
   ├─ Angebot → EK (4.23), Konformitätskurzdoku, 4.23-Checkliste prüfen
   ├─ Vertrag → Vertrag, Profil, DI-Bezug, Freigabeform
   ├─ Vorbereitung → SDL-Kontext klären (einfach / Veranstaltung 77200-1 / 77200-2)
   │    ├─ einfach → Profil → DI; SK/EK nicht pauschal nachfordern
   │    ├─ Veranstaltung 77200-1 → Auslöser prüfen (SK/EK?); ohne Auslöser: Profil → DI
   │    ├─ Veranstaltung + Auslöser → SK → Profil → EK → DI
   │    └─ 77200-2 Kap. 5–8 → SK (AG, muss) → Profil → EK (AN, muss) → DI
   ├─ Laufend → DI verfügbar, Meldeprotokolle, Führung
   └─ Audit → 4.1-Portfolio, QMS, GB, Zyklen

2. Dokument fehlt → Tabelle „Fehlende Dokumente“ (NC + Folgeprozess)
   └─ nie Inhalt erfinden → [OFFENER PUNKT] + betroffenes Modul verlinken

3. Profil vorhanden?
   └─ nein → STOP: Qualifikation/DI/Einsatzplan nicht bewerten
   └─ ja  → Peer-Modul je Dokumenttyp laden

4. DI fehlt aber Profil da?
   └─ DI aus Profil ableitbar — Erstellung an [[Dienstanweisungen]]
   └─ EK/SK nicht pauschal nachfordern bei einfacher SDL

5. Qualifikation fehlt?
   └─ [[Qualifikationsanforderungen]] — Profil first, dann Stufe

6. Einweisung fehlt?
   └─ Einsatz unzulässig bis Nachweis — NC-I01

7. Meldeprotokoll fehlt?
   └─ Auswirkung auf 4.20 — nicht mit DI-Inhalt verwechseln
```

**Verbindliche Regeln**

- **Norm / Audit / Best Practice** in jeder Antwort trennen.
- **Keine Normtexte** wörtlich reproduzieren.
- Dokumentenfluss **immer** Profil-zentriert darstellen — nicht SDL-typ-zentriert.
- Fehlendes Dokument → **Auswirkung + NC + Folgeprozess** aus Tabelle oben — nicht nur „fehlt“.
- **EK:** Normpflicht im **Angebot** (4.23); im **Betrieb** kontextabhängig als DI-Vorstufe — nicht vermischen.
- **SK:** **AG-Dokument** — AN leitet ab; nicht pauschal AN-Pflicht bei einfacher SDL.
- **AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI** und **interne Freigabe / Lenkung nach QMS** getrennt behandeln — siehe [[Dienstanweisungen]].
- `approved_by` leer ⇒ **keine Freigabe** — `[OFFENER PUNKT]` (Cert-Expert-Produktlogik).
- Bei Unsicherheit über vertragliche Form: Vertrag/4.23-Vorgabe erfragen — nicht Default erfinden.

**Reviewer-Fokus:** Kette Vertrag → Profil → DI → Personal → Laufzeitnachweis schließt? Lücken mit NC-Code benennen.

---

## Verwandte Module

| Modul | Beziehung |
|-------|-----------|
| [[overview]] | Master-Index; Kapitel-4-Index |
| [[Dienstanweisungen]] | DI-Inhalt, Freigabe, Verfügbarkeit |
| [[Qualifikationsanforderungen]] | Profil, §34a, Anhang A |
| [[Führungsanforderungen]] | Organigramm, Einsatzleitung, 4.24 |
| [[Weiterbildung]] | 4.19.2 — UE-Nachweise |
| [[Subunternehmer]] | 4.13 — Sub-Akte |
| [[Auditnachweise]] | 4.1, 4.6 — Systemnachweise |

---

## Verwandte Prozesse

| Prozess | Dokumente |
|---------|-----------|
| Auftrags- / Angebotsprozess | Angebotsmappe, EC, Konformitätskurzdoku, Vertrag, Profil |
| Personalauswahl & Qualifikation | §34a, B/C, Einweisung, Unterweisung |
| Einsatzplanung & Führung | Einsatzplan, DI, Führungsakte |
| Melde- & Berichtswesen | Meldeprotokolle, Einsatzberichte, AG-Übermittlung |
| Qualitätsmanagement & Audit | 4.1-Register, QMS, interne Audits, GB |
| Subunternehmer-Steuerung | Zustimmung, Prüfung, Benennung |

---

## Verwandte SDLs

Alle DIN-77200-1-SDL teilen dieselbe **Dokumentenlogik**; Schwerpunkt variiert:

| SDL | Dokumentenschwerpunkt |
|-----|----------------------|
| Stationäre SDL | Vertragsmappe, DI vor Ort, Führung vor Ort (4.24) |
| Revier / mobil | Schematisches Regelwerk + Objekt-DI; Kontrollprotokolle (4.18) |
| Interventionsdienst | Regelwerk + Fallanweisungen; Interventionsnachweise (4.19.1) |
| Veranstaltungsdienst | **77200-1:** Profil → DI ohne Auslöser · **mit Auslösern:** SK → EK-Kette · **77200-2 Kap. 5:** SK+EK **erforderlich** |

---

## Quellen

| Quelle | Typ |
|--------|-----|
| DIN 77200-1:2022-10 — Kap. 3, 4 (insb. 4.1, 4.10–4.14, 4.20, 4.23) | Norm |
| DIN 77200-2:2020-07 — Kap. 4 (SK/EK), Kap. 5–8 (`source_documents`) | Norm |
| Anhang A — Anforderungsprofile | Norm |
| Literaturhinweis DIN EN ISO 9001 (4.6) | QMS-Referenz |
| [[Dienstanweisungen]], [[Qualifikationsanforderungen]], [[Führungsanforderungen]] | Peer-Module |
| Cert-Expert `reviewer_handoff.md`, `gb_rules.md` — Freigabelogik Produkte | Best Practice |

---

## Offene Punkte

- [x] [[Auditnachweise]]-Detailmodul anlegen und verlinken
- [ ] [[Subunternehmer]]-Detailmodul anlegen
- [x] [[Weiterbildung]]-Detailmodul — UE-Dokumente vertiefen
- [ ] Nachweisregister als Cert-Expert-Template (optional)
- [ ] SDL-spezifische Dokumenten-Mindestsets je Blueprint prüfen
