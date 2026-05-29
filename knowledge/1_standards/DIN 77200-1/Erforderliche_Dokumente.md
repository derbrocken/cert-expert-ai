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

**QMS-Ergänzung** *(Literaturhinweis DIN 77200-1, 4.6 — ISO 9001):* Dokumentierte Informationen zusätzlich **intern freigeben und lenken** (7.5.2/7.5.3). Ersetzt **nicht** vertragliche AG-Abstimmung/Freigabe bei Vertragsdokumenten.

---

## Dokumentenfluss (Gesamtlogik)

```
Vertrag (4.10)
  → Anforderungsprofil — Absprache AG/AN (4.11)
    → (ggf. Einsatzkonzept — Angebot 4.23; DI-Ergänzung 4.12)
      → Dienstanweisung — abgestimmt, freigegeben (4.10, 4.12, 4.23)
        → interne Freigabe / Lenkung (ISO 9001 7.5.2/7.5.3)
          → Einweisung je SMA/Objekt (4.14.2, 4.25)
            → Unterweisung DI + Gewerberecht (4.14.5)
              → Leistungserbringung
                → Meldewesen / Einsatzdokumentation (4.20)
                  → Archivierung / AG-Übermittlung
                    → Auditnachweise (4.1, 4.6, 4.18, Zertifizierung)
```

**Leitregeln des Flusses**

| Regel | Inhalt |
|-------|--------|
| **Profil first** | Anforderungsprofil ist zentrale vertragliche Festlegung — Qualifikation, DI-Inhalt und Einsatzplanung leiten sich daraus ab |
| **DI ≠ Profil** | DI operationalisiert; Profil definiert Tätigkeiten/Stufen — beide Vertragsbestandteil bzw. vertraglich verknüpft |
| **EC-Kontext** | AN **muss** auftragsbezogenes Einsatzkonzept im **Angebot** (4.23); für laufende DI-Erstellung kann Profil allein genügen (4.12) — siehe [[Dienstanweisungen]] |
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
| AG-Freigabe / Abstimmungsnachweis DI | Form der **Freigabe abgestimmter DI** | ○* | ✓ | ✓ | 4.23 |
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

**Logik:** Profil ist **Startpunkt** jeder dokumentarischen Bewertung — vor Qualifikation, DI, Einsatzplan.

---

### 3. Dienstanweisungen

| Dokument | Funktion | N | A | B | Normanker |
|----------|----------|---|---|---|-----------|
| Objekt-/aufgabenspezifische DI | Operative Regeln am Leistungsort | ✓ | ✓ | | 4.12 |
| AG-Abstimmungs-/Freigabenachweis | **Abgestimmte** DI, dokumentierte Freigabe | ○* | ✓ | ✓ | 4.23, 4.10 |
| Interne Freigabe / Versionierung | QMS-Ausgabekontrolle | | ✓ | ✓ | 4.6, ISO 9001 7.5 |
| DI-Prüfprotokoll (12 Monate) | Formelle Prüfung, Aktualisierung | ✓ | ✓ | | 4.12 |
| Verfügbarkeitsnachweis Leistungsort | SMA + Einsatzleitung | ✓ | ✓ | | 4.12, 4.9 |
| Interventions-Regelwerk + Fallanweisungen | Zwei Ebenen bei Interventions-SDL | ✓ | ✓ | | 4.12 |

Detailmodul: [[Dienstanweisungen]].

---

### 4. Einsatzkonzepte *(nur wenn erforderlich / kontextbezogen)*

| Dokument | Funktion | N | A | B | Normanker |
|----------|----------|---|---|---|-----------|
| Auftragsbezogenes Einsatzkonzept (Angebot) | Kräfte, Qualifikation, Planung — **AN muss im Angebot** | ✓ | ✓ | | 4.23 |
| EC als DI-Grundlage | Alternative/Ergänzung zu Profil bei DI-Erstellung | ○** | ✓ | | 4.12 |
| Konformitäts-/Normerklärung (Kurzdoku) | AN-Dokumentation zur Normeinhaltung im Angebot | ✓ | ✓ | | 4.23 |
| Sicherheitskonzept (SK) AG-seitig | Externe Planungsgrundlage — nicht DIN-77200-1-Pflichtdokument des AN | | A | B | — |

*○* AG sollte EC-Vorgaben in Beauftragung festlegen (4.23).  
**○** DI kann **nach Profil oder EC** erstellt werden — EC nicht pauschal je SDL für laufenden Betrieb.

**Wann EC audit-relevant beyond Angebot:** komplexe Lagen, Veranstaltungen, Intervention, mehrstufige Kräfte/Kommunikation — Best-Practice-Entscheidung, nicht pauschale Norm je SDL.

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
| **Angebot / Beauftragung** | Konformitätskurzdoku, EC (AN), Profil-Vorgabe (AG), 4.23-Festlegungen | Angebotsmappe vollständig? |
| **Vertragsschluss** | Vertrag, Profil, DI als Bestandteil, Freigabeform DI | Vertragsmappe je Auftrag |
| **Vorbereitung Einsatz** | DI freigegeben, Qualifikation, Einweisung geplant | Profil ↔ Personal ↔ DI konsistent? |
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
| **AG-Freigabe / Abstimmung DI** | DI nicht wirksam als Vertragsbestandteil | NC-D02 | [[Dienstanweisungen]]; 4.23-Nachweis nachholen |
| **DI nicht am Leistungsort** | SMA ohne Regelwerk; Haftungs-/Auditrisiko | NC-D03 | Verteilung; Verfügbarkeit sicherstellen |
| **DI-Prüfprotokoll >12 Mon.** | Veraltete Regeln im Einsatz | NC-D04 | Formelle Prüfung; ggf. AG informieren |
| **Einsatzkonzept (Angebot)** | Angebots-/Ausschreibungs-NC | NC-E01 | [[Erforderliche Dokumente]] Angebotsprozess |
| **EC fehlt bei komplexer SDL** | Planungslücke — oft Audit-Hinweis, nicht immer Norm-NC | NC-E02* | EC ergänzen; DI angleichen |
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
| **Interne Freigabe DI (7.5.2)** | QMS-Lücken bei zertifiziertem AN | NC-A04 | QMB-Freigabe nachholen |

*NC-E02: Audit-Hinweis bei komplexer SDL ohne EC — Normpflicht primär im **Angebots**kontext (4.23).

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

- Kurzdoku Normeinhaltung; **auftragsbezogenes Einsatzkonzept** mit Qualifikationsdarstellung; auf Wunsch erweiterte Angebotsunterlagen.

### Praxisumsetzung

*(Cert-Expert Best Practice — nicht normativ)*

- **Objekt-Akte** je Vertrag: Vertrag, Profil, DI, EC (falls vorhanden), Einweisungen, Meldeproben, Sub-Akten.
- **Nachweisregister** (4.1-Checkliste) mit Fristen: GZR, SV, DI-Prüfung, Profil, Unterweisung, Ersthelfer, UE.
- **Review-Gates** vor Leistungsstart: Profil ✓ → DI freigegeben ✓ → Personal qualifiziert ✓ → Einweisung ✓.
- Digitale Lenkung: Version, `approved_by`, Verteilungslog — aligned zu ISO 9001 7.5 und Cert-Expert `qa_status`.
- Angebotsmappe als **Template** je Ausschreibung — 4.23-Punkte vorab mit AG abhaken.

---

## Audit-Relevanz

| Priorität | Thema | Normanker |
|----------|-------|-----------|
| Kritisch | Vertragsmappe vollständig (Vertrag, Profil, DI-Bezug) | 4.10, 4.11 |
| Kritisch | DI: Inhalt, Verfügbarkeit, AG-Abstimmung/Freigabe | 4.12, 4.23 |
| Kritisch | Profil ↔ eingesetztes Personal (Qualifikation) | 4.11, 4.14.2, 4.19.1 |
| Kritisch | Einweisung vor erstem Einsatz | 4.25, 4.14.2 |
| Kritisch | 4.1-Nachweisportfolio Unternehmen + SMA | 4.1 |
| Hoch | Melde-/Berichtswesen operativ nachweisbar | 4.20 |
| Hoch | Führungsnachweise (Organigramm, Einsatzplan, Qualifikation) | 4.2, 4.24 |
| Hoch | Unterweisung aktuell (≤12 Mon.) | 4.14.5 |
| Hoch | Angebots-/EC-Dokumentation bei Neuausschreibung | 4.23 |
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
3. Wie ist **Freigabe der abgestimmten DI** dokumentiert (4.23)?
4. Liegt **interne Freigabe** der DI vor (QMS)?
5. Ist die DI am **Leistungsort** verfügbar — Stichprobe?
6. Wann wurde die DI zuletzt **formell geprüft** (12 Mon.)?
7. **Einsatzkonzept:** Wo im Angebot — und Konsistenz zur laufenden DI?
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
| NC-D02 | Keine AG-Abstimmung/Freigabe der DI |
| NC-D03 | DI nicht am Leistungsort verfügbar |
| NC-D04 | DI-Prüfung überfällig |
| NC-E01 | Angebot ohne auftragsbezogenes Einsatzkonzept (4.23) |
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
| Fehlende AG-Freigabe DI | Vertragsbestandteil-DI unwirksam |
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
| Einsatzkonzept (EC) | Angebot; ggf. DI-Ergänzung |
| Dienstanweisung (ODA) | Operative Regeln |
| Gefährdungsbeurteilung (GB) | AGS — parallel zu DI, kein Ersatz |
| Sicherheitskonzept (SK) | Externe AG-Planung — Upstream optional |
| Einweisungs-/Unterweisungsprotokolle | Personalnachweis |
| Einsatzberichte / Meldeprotokolle | 4.20-Laufzeit |

---

## Bot-/RAG-Regeln

**Entscheidungslogik bei fehlendem Dokument**

```
1. Welche Phase?
   ├─ Angebot → EC, Konformitätskurzdoku, 4.23-Checkliste prüfen
   ├─ Vertrag → Vertrag, Profil, DI-Bezug, Freigabeform
   ├─ Vorbereitung → Qualifikation, DI, Einweisung geplant?
   ├─ Laufend → DI verfügbar, Meldeprotokolle, Führung
   └─ Audit → 4.1-Portfolio, QMS, GB, Zyklen

2. Dokument fehlt → Tabelle „Fehlende Dokumente“ (NC + Folgeprozess)
   └─ nie Inhalt erfinden → [OFFENER PUNKT] + betroffenes Modul verlinken

3. Profil vorhanden?
   └─ nein → STOP: Qualifikation/DI/Einsatzplan nicht bewerten
   └─ ja  → Peer-Modul je Dokumenttyp laden

4. DI fehlt aber Profil da?
   └─ DI aus Profil ableitbar — Erstellung an [[Dienstanweisungen]]
   └─ EC nicht pauschal nachfordern bei einfacher SDL

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
- **EC:** Normpflicht im **Angebot** (4.23); im **Betrieb** optional als DI-Vorstufe — nicht vermischen.
- **AG-Freigabe DI** und **interne QMB-Freigabe** getrennt behandeln — siehe [[Dienstanweisungen]].
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
| Veranstaltungsdienst | EC häufig sinnvoll; Meldewesen, GB, Berichte |

---

## Quellen

| Quelle | Typ |
|--------|-----|
| DIN 77200-1:2022-10 — Kap. 3, 4 (insb. 4.1, 4.10–4.14, 4.20, 4.23) | Norm |
| Anhang A — Anforderungsprofile | Norm |
| Literaturhinweis DIN EN ISO 9001 (4.6) | QMS-Referenz |
| [[Dienstanweisungen]], [[Qualifikationsanforderungen]], [[Führungsanforderungen]] | Peer-Module |
| Cert-Expert `reviewer_handoff.md`, `gb_rules.md` — Freigabelogik Produkte | Best Practice |

---

## Offene Punkte

- [x] [[Auditnachweise]]-Detailmodul anlegen und verlinken
- [ ] [[Subunternehmer]]-Detailmodul anlegen
- [ ] [[Weiterbildung]]-Detailmodul — UE-Dokumente vertiefen
- [ ] Nachweisregister als Cert-Expert-Template (optional)
- [ ] SDL-spezifische Dokumenten-Mindestsets je Blueprint prüfen
