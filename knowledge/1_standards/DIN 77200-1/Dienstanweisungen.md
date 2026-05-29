---
type: standard_module
standard: DIN 77200-1
module: Dienstanweisungen
module_id: site_instruction
status: active
language: de
source_status: curated
knowledge_standard: CEKS_v1
parent_standard: DIN 77200-1
knowledge_path: knowledge/1_standards/DIN 77200-1/Dienstanweisungen.md
source_documents:
  - inputs/raw_standards/din/DIN_77200_1_2022
  - inputs/raw_standards/din/DIN_77200_2_2020
norm_references:
  - "3.13"
  - "3.18"
  - "3.20"
  - "4.9"
  - "4.10"
  - "4.11"
  - "4.12"
  - "4.14.5"
  - "4.17"
  - "4.20"
  - "4.23"
  - "4.25"
related_modules:
  - leadership_requirements
  - qualification_requirements
  - requirements_profile
  - required_documents
  - audit_evidence
  - further_training
  - subcontractors
related_processes:
  - einsatzplanung_fuehrung
  - auftrags_angebotsprozess
  - personalauswahl_qualifikation
  - qualitaetsmanagement_audit
related_document_types:
  - dienstanweisung
  - einsatzkonzept
  - anforderungsprofil
  - angebotsdokumentation
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
  - dienstanweisung
  - oda
  - interventionsregelwerk
created_for: cert_expert_ai
---

# Dienstanweisungen

Master-Modul: [[overview]] · Taxonomie: **Operative Anforderungen**

---

## Zweck

Festlegung, wie Cert-Expert **Dienstanweisungen** nach DIN 77200-1:2022-10 interpretiert, erstellt, prüft und **auditierbar bewertet** — als operative Konkretisierung der vertraglich vereinbarten SDL auf Basis des **Anforderungsprofils** (ggf. ergänzt durch ein Einsatzkonzept) bis zur täglichen Leistungserbringung.

---

## Normkontext

| Begriff | Normanker | Rolle |
|---------|-----------|-------|
| Dienstanweisung | 3.13 | Objekt-/aufgabenspezifische Regelung der Dienstdurchführung |
| Einsatzkonzept | 3.20, 4.23 | **Angebots-/komplexer Kontext (4.23)** — *(ggf.)* DI-Ergänzung (4.12); **nicht pauschal** je SDL im Betrieb |
| Einweisung | 3.18 | Objektbezogene Einführung vor Einsatz — ergänzt DI, ersetzt sie nicht |
| Verträge | 4.10 | Schriftlicher Vertrag/Auftragsbestätigung; **DI ist Bestandteil des Vertrages** (explizit 4.10) |
| Anforderungsprofile | 4.11 | **In Absprache AG/AN**; Vertragsbestandteil; Basis für DI |
| Angebotsdokumentation | 4.23 | AG **sollte** u. a. festlegen, **wie die Freigabe der abgestimmten DI** (4.12) dokumentiert wird |
| Dienstanweisungen | 4.12 | Inhalt, Verfügbarkeit, Prüfzyklus, Interventions-Regelwerk |
| Unterweisung | 4.14.5 | Jährliche Unterweisung in DI und Gewerberecht |
| Kommunikationsmittel | 4.17 | Bezug zu DI-Kommunikationsregeln |
| Melde-/Berichtswesen | 4.20 | Bezug zu DI-Meldewesen |
| Einsatzkräfte | 4.25 | Einweisung vor erstem Einsatz; DI muss verfügbar sein |
| Geschäftsräume | 4.9 | Aufbewahrung von DI und Objektdaten |

**Schichtenmodell (Cert-Expert — strikt trennen):**

| Schicht | Quelle | Inhalt |
|---------|--------|--------|
| **Normative Anforderung** | DIN 77200-1 (4.10, 4.11, 4.12, 4.23, …) | Vertragsbestandteil; Abstimmung; **Freigabe der abgestimmten DI** |
| **QMS-Anforderung** | ISO 9001 **7.5.2 / 7.5.3** *(Literaturhinweis DIN 77200-1)* | **Interne Freigabe / Lenkung nach QMS** — **zusätzlich**, kein Ersatz für AG-Logik |
| **Audit- und Nachweislogik** | Norm + Konformitätspraxis + QMS | **AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI** und **interne Freigabe / Lenkung nach QMS** getrennt prüfbar |
| **Cert-Expert Best Practice** | Interne VA, QM-Erfahrung | Empfohlene Verfahren — **keine** Normersetzung |

---

## Rolle der Dienstanweisung im System

Die Dienstanweisung **konkretisiert** die operative Durchführung der vertraglich vereinbarten Sicherheitsdienstleistung. Sie ist weder Anforderungsprofil noch Sicherheitskonzept noch Einsatzkonzept — sie regelt den **Alltagsbetrieb am Leistungsort**. **Zentrale Grundlage** für ihre Erstellung ist das **Anforderungsprofil** (4.11); SK/EK sind **kontextabhängig**, nicht pauschal je SDL.

**Dokumentenkette — drei Kontexte** *(Detail: [[Erforderliche Dokumente]])*

**1. Einfache SDL** *(Standardfall — Empfang, Kontrolle, Revier, mobiler Kontrolldienst)*

```
Vertrag → Anforderungsprofil → Dienstanweisung → Einweisung → Leistungserbringung
```

SK/EK: **normalerweise nicht erforderlich** im Betrieb. Kein pauschaler Audit-Eindruck, dass SK/EK fehlen.

**2. Veranstaltungssicherungsdienst** *(77200-1 — SDL-Typ **≠** automatisch SK/EK)*

*Einfache Veranstaltung (77200-1, ohne Auslöser):*
```
Vertrag/AG-Vorgaben → Anforderungsprofil → Dienstanweisung → Einweisung → Leistung
```

*Mit SK/EK-Auslösern (77200-1 — s. [[Erforderliche Dokumente]]):*
```
Vertrag/Ausschreibung → Sicherheitskonzept (SK) → Anforderungsprofil → Einsatzkonzept (EK) → Dienstanweisung → Einweisung → Leistung
```

*DIN 77200-2 Kap. 5 — Veranstaltungen mit besonderer Sicherheitsrelevanz (Norm, unverändert):*
```
Vertrag → SK (AG, muss) → Anforderungsprofil → EK (AN, muss) → Dienstanweisung (aus EK) → Einweisung → Leistung
```

**3. Besondere Lage / erhöhte Komplexität**

```
Vertrag → (ggf.) Sicherheitskonzept (AG) → Anforderungsprofil → (ggf.) Einsatzkonzept (AN) → Dienstanweisung → Einweisung → Leistungserbringung
```

SK/EK: **kontextabhängig** — bei **77200-2-Tatbestand** (Kap. 5–8) **erforderlich** (Kap. 4); sonst z. B. kritische Infrastruktur, AG-Vorgabe, Best Practice.

**Freigabe-Spuren** *(ergänzend zu jeder Kette)*

```
… → Dienstanweisung (AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI)
  → interne Freigabe / Lenkung nach QMS
    → Einweisung / Unterweisung
      → Leistungserbringung
```

| Stufe | Funktion | Bezug zu DI |
|-------|----------|-------------|
| Vertrag | Leistungsrahmen, Befugnisse, Ansprechpartner | DI muss Vertragsinhalt operationalisieren (4.12) |
| Sicherheitskonzept (SK) | **AG-Planungsgrundlage** — Schutzziele, Lagebild | AN **leitet ab**; erstellt SK **nicht** pauschal selbst |
| Anforderungsprofil | **Zentrale vertragliche Grundlage** — SDL-Tätigkeiten, Qualifikationsbezug | DI leitet Kräfte-/Tätigkeitsumfang ab; **kann direkt aus Profil erstellt werden** (4.11, 4.12) |
| Einsatzkonzept (EK) | Operative Umsetzung: Kräfte, Kommunikation, Planung | **77200-2:** erforderlich (AN, muss) · **77200-1 einfach:** normalerweise nicht · **77200-1 Veranstaltung:** nur bei **Auslösern** / vertraglicher Vorgabe |
| Dienstanweisung | Tagesgeschäft, Notfall, Meldewesen | **Dieses Modul** |
| Einweisung | Individuelle objektbezogene Einführung | Vor erstem Einsatz (4.25); Unterweisung jährlich (4.14.5) |
| Leistungserbringung | Ausführung | SMA handelt nach DI; Führung überwacht (4.24) |

**Einordnung SK/EK — Kurzmatrix**

| SDL-Kontext | SK | EK |
|-------------|----|----|
| Einfache SDL (77200-1) | normalerweise nicht erforderlich | normalerweise nicht erforderlich *(Betrieb)* |
| Veranstaltung (nur 77200-1) | normalerweise nicht — bei **Auslösern** ja | folgt typischerweise, wenn SK im Spiel |
| **DIN 77200-2 Kap. 5–8** | **erforderlich** (AG, muss) | **erforderlich** (AN, muss) |

---

## Vertragsbezug und Anforderungsprofil

### Normative Anforderung

**Vertrag (4.10)**

- SDL grundsätzlich auf Basis **schriftlicher Verträge** oder Auftragsbestätigungen (bei kurzfristigen SDL).
- Vertrag enthält Bedingungen, Befugnisse, Verantwortlichkeiten, Ansprechpartner.
- **Die Dienstanweisung ist Bestandteil des Vertrages** — ausdrückliche Normforderung in 4.10 (nicht nur Cert-Expert-Interpretation). Gilt für Verträge über SDL nach DIN 77200-1.

**Anforderungsprofil (4.11)**

- SDL-Tätigkeiten werden **in Absprache zwischen AG und AN** festgelegt (Anhang A).
- Das Anforderungsprofil ist **Vertragsbestandteil** (4.11).
- Jährliche Überprüfung und ggf. Präzisierung (4.11).
- DI regelt die **Einzelheiten der Dienstdurchführung**, die sich **aus dem Vertrag** ergeben (4.12).

**Abstimmung, Information, Freigabe — Normdifferenzierung**

| Thema | Normanker | Normstärke | Inhalt |
|-------|-----------|------------|--------|
| Vertragsbestandteil DI | 4.10 | **muss** (explizit) | DI ist Bestandteil des Vertrages |
| Vertragsbestandteil Profil | 4.11 | **muss** (explizit) | Anforderungsprofil ist Vertragsbestandteil |
| Abstimmung Profil | 4.11 | **muss** (Absprache AG/AN) | Tätigkeiten gemeinsam festlegen |
| AG-Information für DI-Erstellung | 4.12 | **sollte** | AG stellt erforderliche Informationen bereit |
| Abgestimmte DI / Freigabe-Nachweis | 4.23 | **sollte** (AG bei Beauftragung) | AG legt fest, **in welcher Art und Weise die Freigabe der abgestimmten Dienstanweisung** nach 4.12 **dokumentiert** wird — setzt **Abstimmung + Freigabe** voraus, nicht nur interne Lenkung |
| Interne Freigabe / Lenkung nach QMS | ISO 9001 **7.5.2 / 7.5.3** | **muss** *(QMS des AN)* | Vor Ausgabe durch befugte Personen — **zusätzlich** zur AG-Logik, **kein Ersatz** |

**Norminterpretation (Primärquelle) — AG-Abstimmung / Freigabe der abgestimmten DI:**

- **Vertragsbestandteil:** Ja — 4.10 wörtlich: „Die Dienstanweisung ist Bestandteil des Vertrages.“ Ohne **AG-seitige Einbindung** ist die DI faktisch **kein** wirksamer Vertragsbestandteil — einseitig intern freigegebene ODA genügt normativ nicht.
- **Wortlaut „Genehmigung“ / „Zustimmung“ zur DI:** In 4.10–4.12 **nicht** wie bei Subunternehmern (4.13: *schriftliche Zustimmung*) — dort ist die Pflicht **explizit**. Für die DI nutzt die Norm **Abstimmung** (4.11) und **Freigabe der abgestimmten DI** (4.23).
- **Abstimmung:** **Ja, normativ zwingend im System:** Profil *in Absprache zwischen AG und AN* (4.11); DI *abgestimmt* (4.23); Auswahl nach *mit dem AG abgestimmtem* Profil (4.14.2). Eine DI ohne AG-Abstimmung ist **nicht** „abgestimmt“ im Sinne der Norm.
- **Freigabe:** **Ja, normativ angelegt:** 4.23 verlangt bei Beauftragung die Festlegung, **wie die Freigabe der abgestimmten Dienstanweisung dokumentiert** wird. **Interne Freigabe / Lenkung nach QMS allein erfüllt diese Logik nicht.**
- **AG-Abstimmung / dokumentierte Freigabe im Zusammenspiel:** Vertragsbestandteil (4.10) + abgestimmtes Profil (4.11) + **Freigabe der abgestimmten DI** (4.23) ergeben ein **Zweiparteiensystem** — Form vertraglich festlegen, **nicht** durch internes QM ersetzen.

**ISO 9001 — Auditpraxis (Literaturhinweis DIN 77200-1; QMS des AN):**

- **7.5.2 / 7.5.3:** **Interne Freigabe / Lenkung nach QMS** — typisch QMB/Einsatzleitung.
- **Audit-Folge:** **AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI** und **interne Freigabe / Lenkung nach QMS** — **beide Spuren**, nicht vermischen.

**Cert-Expert-Abgrenzung (keine Über- oder Unterdehnung)**

- **Nicht** jede Cert-Expert-ODA-Vorlage ist automatisch die vertragliche DI — maßgeblich ist die **mit dem AG abgestimmte und freigegebene** Dienstanweisung je Auftrag/Objekt (4.10, 4.23).
- **Interne Freigabe / Lenkung nach QMS** (VA-Workflow, QMB) = **Organisationspflicht** — **zusätzlich** erforderlich, **ersetzt keine** AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI.
- **Kopie/Unterschrift AG** (VA-Praxis): typische Umsetzung der 4.23-Freigabedokumentation — **sinnvoller Nachweis**, wenn vertraglich so vereinbart.

---

## Anforderungsübersicht

### Normative Anforderung

**Gestaltung (4.12)**

- DI **objekt- und/oder aufgabenspezifisch**.
- Regelung der Einzelheiten der Dienstdurchführung aus dem **jeweiligen AG-Vertrag**.
- Erstellung **nach** dem Anforderungsprofil; **alternativ oder ergänzend** nach *(ggf.)* Einsatzkonzept, sofern vorhanden (4.12). DI **kann direkt aus Profil** abgeleitet werden — Einsatzkonzept **nicht pauschal** Voraussetzung.
- Der AG **sollte** dem AN die zur DI-Erstellung **erforderlichen Informationen** bereitstellen (4.12 — **sollte**, nicht „muss“).

**Pflichtinhalt (4.12 — Mindestthemen normativ)**

| Themenfeld | Normanker |
|------------|-----------|
| Kräfteeinsatz | 4.12 |
| Arbeitsinhalt | 4.12 |
| Dauer der SDL | 4.12 |
| Notfallverfahren | 4.12 |
| Kommunikationsregeln (inkl. Behörden/Organisationen mit Sicherheitsaufgaben) | 4.12, 4.17 |
| Ausrüstung der SMA | 4.12, 4.15 |
| Meldewesen | 4.12, 4.20 |
| Arbeits- und Gesundheitsschutz (z. B. Pausen-/Ablöseregelungen) | 4.12, 4.8 |

**Verfügbarkeit und Führungsbezug (4.12)**

- DI für jeden SMA **in Vorbereitung auf den Dienst und während des Dienstes** jederzeit **am Leistungsort** verfügbar.
- **Einsatzleitung** muss jederzeit **Zugriff** haben und mit betrieblicher Praxis **vertraut** sein — siehe [[Führungsanforderungen]].

**Prüfzyklus (4.12)**

- DI mindestens alle **12 Monate** **nachweislich formell prüfen** und bei Bedarf aktualisieren.

**Interventionsdienst (4.12 — Sonderfall normativ)**

- DI als **schematisches Regelwerk**; für den Einzelfall durch **konkrete Interventionsanweisungen** spezifizieren.

**Unterweisung (4.14.5)**

- Unterweisung in DI und Gewerberecht; Wiederholung mindestens **jährlich** — ergänzt DI, ersetzt keine formelle DI-Prüfung.

### Praxisumsetzung

*(Cert-Expert Best Practice — nicht normativ; orientiert an interner VA „Erstellung Dienstanweisungen“)*

Typischer QM-Workflow: Bedarfsermittlung → Entwurf (Einsatzleitung) → **AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI** → **interne Freigabe / Lenkung nach QMS** → Versionierung → Verteilung → Unterweisung → Archivierung. Details: [Erstellung und Pflege](#erstellung-und-pflege).

---

## Mindestinhalte einer Dienstanweisung

### Normative Mindestthemen (4.12)

Siehe [Anforderungsübersicht](#anforderungsübersicht). Audit prüft **Vollständigkeit dieser Themenfelder** am konkreten Auftrag — nicht ein starres Cert-Expert-Inhaltsverzeichnis.

### Ergänzende Best-Practice-Inhalte (VA — optional, empfohlen)

*(Nicht normativ — aus Cert-Expert-Praxisquelle; nur wenn projekt-/QM-seitig vorgesehen)*

| Block | Inhalt (Praxis) |
|-------|-----------------|
| Kopfdaten | Titel, Zweck, Geltungsbereich, Version, Datum |
| Verantwortlichkeiten | Rollen im DI-Bezug (Einsatzleitung, SMA) |
| Bekleidung/Ausrüstung | Postenbezogene Ausrüstung, Funktionsprüfung |
| Dienstübergabe/-übernahme | Ort, Zeit, Art; Dokumentation; kein Dienstende ohne Übergabe |
| Verhalten am Arbeitsplatz | Auftreten, Essen/Rauchen, Alkoholverbot, Verschwiegenheit |
| Vorkommnisse | Definition, Sofortmaßnahmen, Ansprechpartner |
| Formulare/Meldewege | Dienstunterlagen, besondere Vorkommnisse, Statusmeldungen |
| Datenschutz | Bezug zu gültigem Datenschutzrecht |
| BewachV-Hinweis | Keine Polizeibefugnisse (§17 BewachV — in VA empfohlen) |

Best Practice ersetzt **keine** normativen Mindestthemen und darf **keine** zusätzlichen Pflichten als Norm ausgeben.

---

## Erstellung und Pflege

### Normative Anforderung

- Erstellung **primär nach** Anforderungsprofil (4.11, 4.12); **ggf. ergänzend** nach Einsatzkonzept.
- Bezug auf **jeweiligen Vertrag** und Schutzobjekt/Auftrag.
- AG **sollte** erforderliche Informationen bereitstellen (4.12).
- Bei Beauftragung **sollte** der AG festlegen, wie die **Freigabe der abgestimmten DI** dokumentiert wird (4.23).
- Formelle Prüfung **mindestens alle 12 Monate**; Aktualisierung bei Bedarf (4.12).
- Anforderungsprofil selbst **jährlich** prüfen (4.11) — DI-Prüfung kann aber Anlass aus Profiländerung haben.

### Cert-Expert Best Practice (VA)

*(Quelle: `inputs/practical_sources/DIN77200-2_10_Kap. 7, V6 –VA Erstellung Dienstanweisungen.docx`)*

| Phase | Empfohlene Schritte | Ebene |
|-------|---------------------|-------|
| Bedarfsermittlung | Einsatzleitung identifiziert Bedarf bei Sicherheitslage, Rechtsänderung, Audit-Feststellungen | Best Practice |
| Entwurf | Einsatzleitung erstellt objekt-/aufgabenspezifischen Entwurf **primär entlang Profil**; ggf. unter Bezug auf *(ggf.)* vorhandenes Einsatzkonzept | Best Practice |
| Abstimmung AG | Inhalt mit AG abstimmen (Profil-/Vertragsbezug) | **Norm (4.11, 4.23)** |
| Freigabe AG | **AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI** (4.23) | **Norm / Audit** |
| Freigabe intern | **Interne Freigabe / Lenkung nach QMS** — vor Ausgabe | **QMS-Pflicht / Audit** |
| Versionierung | Versionsnummer, Freigabedatum, Verantwortliche (AG + intern) | QMS + Audit |
| Verteilung | Betroffene SMA und ggf. Subunternehmer; Ausgabe dokumentieren (7.5.3) | QMS |
| Unterweisung | Neue/geänderte DI vor Einsatz unterweisen; Teilnahme dokumentieren | Norm (4.14.5) |
| Änderungslenkung | Bei wesentlicher Änderung **erneute AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI** | Norm + QMS |
| Archivierung | Freigegebene DI, Nachweis **AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI**, Prüf- und Unterweisungsnachweise (VA: min. 3 Jahre) | Audit |

---

## Verfügbarkeit und Zugriff

### Normative Anforderung (4.12)

| Anforderung | Adressat | Prüffrage |
|-------------|----------|-----------|
| DI am **Leistungsort** verfügbar | Jeder SMA | Kann Schichtkraft DI vor/während Dienst einsehen? |
| **Zugriff** Einsatzleitung | Einsatzleitung | Hat Führung jederzeit Zugriff — auch mobil/zentral? |
| **Vertrautheit** mit Objektpraxis | Einsatzleitung | Kann Führung DI-Inhalt am Objekt anwenden? (4.12, 4.24) |

### Audit- und Nachweislogik

- Stichprobe vor Ort: physisch (Ordner, Terminal) **oder** digital (gesichertes Endgerät) — Medium offen, **Verfügbarkeit** entscheidend.
- Mobile SDL: DI pro Objekt oder schematisches Regelwerk + Objektanweisung muss am **jeweiligen Leistungsort** erreichbar sein (4.25 Einweisungsbezug).

### Cert-Expert Best Practice

- Zentrale DI-Bibliothek plus objektbezogene Arbeitskopie am Leistungsort.
- Änderungsstand in Schichtübergabe kommunizieren.
- Subunternehmer: DI-Zugang vor Einsatz nachweisen — siehe [[Subunternehmer]].

---

## Interventionsdienst als Sonderfall

### Normative Anforderung (4.12)

| Ebene | Inhalt |
|-------|--------|
| **Schematisches Regelwerk** | Generelle Interventionsabläufe, Rollen, Kommunikation, Eskalation |
| **Konkrete Interventionsanweisungen** | Fall-/objekt-/alarmbezogene Spezifikation für den Einzelfall |

Audit prüft **beide Ebenen**: Regelwerk allein ohne Fallanweisung ist unvollständig; Fallanweisung ohne Regelwerk ist nicht skalierbar.

### Zusatzqualifikation (4.19.1)

Interventionskräfte benötigen **zusätzlich** zur DI 24-h-Interventionsschulung und fünf dokumentierte Interventionen — Modul [[Qualifikationsanforderungen]].

### Cert-Expert Best Practice

- Regelwerk versionieren; Fallanweisungen mit Alarm-ID/Objekt-Referenz verknüpfen.
- Nach jedem Einsatz: Rückkopplung in Regelwerk-Prüfung (kontinuierliche Verbesserung — VA).

---

## Audit-Relevanz

| Priorität | Thema | Normanker |
|----------|-------|-----------|
| Kritisch | DI existiert je Vertrag/Objekt/Auftrag | 4.12 |
| Kritisch | DI als Vertragsbestandteil; **AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI** (4.10, 4.11, 4.23) | 4.10, 4.11, 4.23 |
| Kritisch | Pflichtinhalte (Kräfte, Inhalt, Dauer, Notfall, Kommunikation, Ausrüstung, Meldewesen, AGS) | 4.12 |
| Kritisch | Verfügbarkeit am Leistungsort (SMA) | 4.12 |
| Kritisch | Zugriff und Vertrautheit Einsatzleitung | 4.12, 4.24 |
| Kritisch | Formelle Prüfung alle 12 Monate nachweisbar | 4.12 |
| Hoch | Bezug zu Anforderungsprofil und Vertrag | 4.11, 4.12 |
| Hoch | **Interne Freigabe / Lenkung nach QMS** | QMS / Literaturhinweis |
| Hoch | Unterweisung in DI (jährlich) | 4.14.5 |
| Hoch | Einweisung vor erstem Einsatz | 4.25 |
| Hoch | Interventions-Regelwerk + Fallanweisungen | 4.12 |
| Mittel | Konsistenz DI ↔ *(ggf.)* Einsatzkonzept *(nur wenn vorhanden)* | 3.20, 4.12 |
| Mittel | Meldewesen in DI ↔ 4.20 | 4.20 |

Auditor-Traces: Vertrag → **Profil (Absprache AG/AN)** → *(ggf. Einsatzkonzept)* → DI (Inhalt) → **AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI** → **interne Freigabe / Lenkung nach QMS** → Verfügbarkeit vor Ort → Prüfprotokoll (12 Mon.) → Unterweisungsnachweis → Schichtstichprobe.

---

## Audit-Nachweise

| Nachweisart | Inhalt | Schicht |
|-------------|--------|---------|
| Dienstanweisung (freigegebene Version) | Vollständigkeit Pflichtthemen 4.12 | Norm |
| Vertrags-/Profilbezug | DI referenziert Vertrag, Profil, Objekt; **Vertragsbestandteil** (4.10) | Norm |
| AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI | Dokumentation gemäß Vertrag oder 4.23 | **Norm/Audit** |
| Interne Freigabe / Lenkung nach QMS | Freigabe, Versionsstand, Verteilungsnachweis | **QMS / Audit** |
| Prüfprotokoll DI | Formelle Prüfung ≤ 12 Monate; Prüfer, Datum, Ergebnis | Audit |
| Verfügbarkeitsnachweis | Foto/Stichprobe/IT-Nachweis am Leistungsort | Audit |
| Unterweisungsprotokolle | DI + Gewerberecht, jährlich | Norm (4.14.5) |
| Einweisungsprotokolle | Vor erstem Einsatz je Objekt | Norm (4.25) |
| Versionshistorie / Änderungslog | Version, Datum, Grund | Best Practice |
| Interventions-Regelwerk + Fallanweisungen | Beide Ebenen dokumentiert | Norm (4.12) |
| Archiv abgelöster Versionen | Nachweis Änderungslenkung | Best Practice |

---

## Erforderliche Dokumente

| Dokument | Zweck | Verknüpftes Modul |
|----------|-------|-------------------|
| Dienstanweisung / ODA | Operative Regeln am Leistungsort | — |
| Anforderungsprofil | **Zentrale Grundlage** — Tätigkeiten und SDL-Bezug | [[Erforderliche Dokumente]] |
| Einsatzkonzept *(Angebots-/komplexer Kontext)* | Planungs-/Strukturdokument bei komplexeren SDL, **Veranstaltungen mit Auslösern**, Intervention — **nicht pauschal je SDL im Betrieb** | [[Erforderliche Dokumente]] |
| Dienstleistungsvertrag | Vertragsrahmen; DI als Bestandteil (4.10) | [[Erforderliche Dokumente]] |
| DI-Prüfprotokoll | 12-Monats-Nachweis | [[Auditnachweise]] |
| Unterweisungs-/Einweisungsnachweise | Personalbezug | [[Qualifikationsanforderungen]] |
| Interventionsanweisungen | Fallbezug zum Regelwerk | — |
| Schicht-/Übergabeprotokoll | DI-Stand kommuniziert | [[Führungsanforderungen]] |

---

## Typische Auditorfragen

1. Zeigen Sie die **aktuelle Dienstanweisung** zu diesem Vertrag/Objekt — Version und Prüfdatum?
2. Wann wurde die DI zuletzt **formell geprüft** (12-Monats-Zyklus)?
3. Enthält die DI **Kräfteeinsatz, Arbeitsinhalt, Dauer, Notfall, Kommunikation, Ausrüstung, Meldewesen, AGS**?
4. Ist die DI für diese Schichtkraft **am Leistungsort verfügbar** — zeigen Sie es vor Ort.
5. Hat die **Einsatzleitung Zugriff** und kann sie DI-Praxis am Objekt nachweisen?
6. Wie leitet sich die DI aus **Anforderungsprofil** (Absprache AG/AN) und **Vertrag** ab?
7. Ist die DI **Vertragsbestandteil** (4.10) und wie ist **AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI** dokumentiert (4.23)?
8. Liegt **interne Freigabe / Lenkung nach QMS** vor?
9. Liegt ein **Einsatzkonzept** *(Angebots-/komplexer Kontext)* vor — und wenn ja, ist die DI damit konsistent? *(Kein NC allein wegen fehlendem EC bei einfacher SDL im Betrieb.)*
10. Wo sind **Unterweisungen** in die DI dokumentiert (jährlich)?
11. Wo ist die **Einweisung** vor erstem Einsatz an diesem Objekt?
12. **Interventionsdienst:** Regelwerk **und** konkrete Fallanweisung vorhanden?
13. Wie werden **DI-Änderungen** versioniert und an SMA/sub ausgerollt?
14. Stimmen DI, **Anforderungsprofil** und **tatsächliche Schichtpraxis** überein?
15. Subunternehmer: DI-Kenntnis und Verfügbarkeit nachgewiesen?

---

## Typische Abweichungen

| NC | Typischer Befund |
|----|------------------|
| NC-01 | Keine DI zum Vertrag/Objekt |
| NC-02 | DI fehlt normative Pflichtthemen (4.12) |
| NC-03 | DI am Leistungsort nicht verfügbar (Stichprobe) |
| NC-04 | Formelle Prüfung > 12 Monate oder ohne Protokoll |
| NC-05 | Einsatzleitung ohne nachweisbaren DI-Zugriff/Vertrautheit |
| NC-06 | DI widerspricht Anforderungsprofil oder Vertrag |
| NC-07 | Unterweisung in DI fehlt oder > 12 Monate |
| NC-08 | Einweisung vor erstem Objekteinsatz nicht dokumentiert |
| NC-09 | Interventionsdienst: nur Regelwerk ohne Fallanweisung (oder umgekehrt) |
| NC-10 | Veraltete DI-Version im Einsatz (Versionsbruch) |
| NC-11 | Subunternehmer-SMA ohne DI-Kenntnis/-zugang |
| NC-12 | Fehlendes EC bei einfacher SDL fälschlich als Abweichung gewertet — Profil→DI ohne EC ist zulässig |
| NC-13 | DI nicht als Vertragsbestandteil / **keine AG-Abstimmung oder -freigabe** trotz 4.10, 4.11, 4.23 |
| NC-14 | Freigabe der abgestimmten DI **nicht dokumentiert** (4.23) oder Form widerspricht Vertrag |
| NC-15 | Nur **interne Freigabe / Lenkung nach QMS** — **keine** AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI |
| NC-16 | DI im Einsatz ohne **interne Freigabe / Lenkung nach QMS** bei zertifiziertem AN |

---

## Risiken

| Risiko | Auswirkung |
|--------|------------|
| Fehlende oder unvollständige DI | Unsichere Ausführung; Auditversagen; Vertragsbruch |
| DI nicht am Leistungsort | SMA handeln ohne Leitplanke; Haftungs-/NC-Risiko |
| Überfällige Prüfung | Veraltete Regeln (Technik, Notfall, Ansprechpartner) |
| DI ohne AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI | Vertragsbruch; Haftung; Auditversagen (4.10, 4.23) |
| Nur interne Freigabe / Lenkung nach QMS, kein AG-Nachweis | DI nicht wirksam als Vertragsbestandteil |
| Fehlende interne Lenkung nach QMS | QMS-NC bei ISO-9001-zertifiziertem AN |
| Interventions-Regelwerk lückenhaft | Fehlreaktion bei Alarm; 4.12-NC |
| Unterweisung vernachlässigt | Formale Compliance-Lücke trotz vorhandener DI |
| EC fälschlich als Pflicht je SDL | Überdokumentation; falsche Audit-Erwartungen |
| Best Practice als Norm verkauft | Überforderung in Ausschreibungen; falsche AG-Erwartungen |

---

## Cert-Expert-Anwendung

**Routing:** Modul laden bei Blueprints/Audits zu **ODA/Dienstanweisung, Objektregeln, Notfall, Meldewesen, Interventions-Regelwerk, DI-Verfügbarkeit** — nach [[overview]] für Kontext.

**Dokumentprodukte**

| Produkt | Nutzung dieses Moduls |
|---------|----------------------|
| Dienstanweisung (ODA) | Kernprodukt — operative Regeln je Objekt/Auftrag; **primär aus Profil** |
| Einsatzkonzept (EC) | **Angebots-/komplexer Kontext (4.23)** — *(ggf.)* DI-Ergänzung; **nicht** pauschal je SDL im Betrieb |
| Anforderungsprofil | **Zentrale Tätigkeitsgrundlage** — DI darf Profil nicht unterschreiten |
| Gefährdungsbeurteilung (GB) | AGS-Bezug in DI (Pausen, Gefährdungen) — Querverweis, kein DI-Ersatz |

**Reviewer-Fokus:** Pflichtthemen 4.12 vorhanden; Verfügbarkeit und 12-Monats-Prüfung nachweisbar; keine Best-Practice-Pflichten als Norm deklariert.

---

## Bot-/RAG-Regeln

**Entscheidungslogik**

```
1. SDL-Kontext klären: einfach / Veranstaltung 77200-1 / 77200-2 Kap. 5–8?
   ├─ einfach → Vertrag → Profil → DI; SK/EK normalerweise nicht erforderlich
   ├─ Veranstaltung 77200-1 → **Auslöser** prüfen ([[Erforderliche Dokumente]]); ohne Auslöser: Profil → DI
   ├─ Veranstaltung + Auslöser → SK → Profil → EK → DI
   └─ 77200-2 Kap. 5–8 → SK (AG, muss) → Profil → EK (AN, muss) → DI

2. Vertrag + Anforderungsprofil im Projektkontext?
   └─ fehlt → [OFFENER PUNKT]; DI-Inhalt nicht erfinden

3. Vertragsbezug: DI Vertragsbestandteil (4.10)? Profil in Absprache AG/AN (4.11)?

4. **AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI** (4.23)? **Interne Freigabe / Lenkung nach QMS**?

5. SK/EK vorhanden oder verlangt?
   └─ ja  → DI-Konsistenz mit SK/EK prüfen
   └─ nein bei einfacher SDL → DI direkt aus Profil — kein SK/EK pauschal nachfordern

6. SDL-Typ / Objekt / Aufgabe bekannt?
   └─ ja → DI objekt-/aufgabenspezifisch; Interventions-Sonderfall prüfen

7. Rolle = Führungskraft / Einsatzleitung?
   └─ ja → [[Führungsanforderungen]] (DI-Zugriff, Vertrautheit)

8. Qualifikationsbezug?
   └─ DI regelt Tätigkeiten — [[Qualifikationsanforderungen]] für Stufen A/B/C

9. Interventionsdienst?
   └─ Regelwerk + Fallanweisung; 4.19.1-Sondernachweise zusätzlich
```

**Verbindliche Regeln**

- Keine erfundenen Notfallnummern, Schichtpläne, Objektdetails — Projektinput oder `[OFFENER PUNKT]`.
- **Norm / Audit / Best Practice** in Antworten trennen; VA-Inhalte nie als „DIN fordert“ ausgeben.
- **4.10 wörtlich:** DI ist **Vertragsbestandteil** — nicht relativieren oder abschwächen.
- **AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI** (4.10, 4.11, 4.23) — **nicht** durch interne Freigabe / Lenkung nach QMS ersetzen.
- **Interne Freigabe / Lenkung nach QMS** = **zusätzliche** Pflicht des AN — **getrennt** darstellen.
- **Nicht** pauschal SK/EK nur wegen SDL-Typ „Veranstaltung“ — **Auslöser** prüfen (77200-1) vs. **77200-2 Kap. 5** (Norm).
- **SK vom AG** — AN leitet Profil, EK, DI ab; AN erstellt **nicht** pauschal das AG-Sicherheitskonzept.
- **Nicht** behaupten, jede ODA-Vorlage sei automatisch Vertragsbestandteil — Bezug 4.10 auf **vertragliche DI** beziehen.
- DI ersetzt **keine** Qualifikationsnachweise und **keine** GB.
- [[Dienstanweisungen]] vs. **Einweisung/Unterweisung**: DI = Dokument; Einweisung = personalbezogener Nachweis.
- Interventions-Regelwerk: zwei Ebenen (schematisch + konkret) immer prüfen.

---

## Verwandte Module

| Modul | Beziehung |
|-------|-----------|
| [[overview]] | Master-Index; 4.12-Index |
| [[Anforderungsprofile]] | 4.11 — zentrale Tätigkeitsgrundlage für DI |
| [[Führungsanforderungen]] | DI-Zugriff Einsatzleitung; Vertrautheit; Aufsicht |
| [[Qualifikationsanforderungen]] | DI-Tätigkeiten ↔ Stufe A/B/C; Unterweisung |
| [[Erforderliche Dokumente]] | 4.10, 4.11, 4.23 — Vertrag, Profil, Angebot |
| [[Auditnachweise]] | 4.1 Nachweisportfolio |
| [[Weiterbildung]] | Abgrenzung zu DI-Unterweisung (4.19.2) |
| [[Subunternehmer]] | 4.13 — DI für Sub-SMA |

---

## Verwandte Prozesse

| Prozess | Bezug |
|---------|-------|
| Auftrags- / Angebotsprozess | Profil → *(ggf. Einsatzkonzept)* → DI vor Leistungsstart |
| Einsatzplanung & Führung | DI-Verfügbarkeit; Schichtübergabe |
| Personalauswahl & Qualifikation | Einweisung/Unterweisung in DI |
| Qualitätsmanagement & Audit | 12-Monats-Prüfung; Versionslenkung |

---

## Verwandte SDLs

DI ist **immer auftrag-/objektbezogen** — SDL liefert Kontext, nicht pauschalen DI-Inhalt:

| SDL | DI-Schwerpunkt (Profil abhängig) |
|-----|----------------------------------|
| [[alarmdienst]] | Technische Überwachung, Alarmabläufe, Kommunikation Leitstelle |
| [[stationärer_empfangsdienst]] | Zutritt, Besucher, Schließmittel, Repräsentation |
| [[stationärer_kontrolldienst]] | Kontrollgänge, Übergaben, Objektbesonderheiten |
| [[revierdienst]] / [[mobiler_kontrolldienst]] | Mehr-Objekt-DI oder Regelwerk + Objektblätter |
| [[interventionsdienst]] | **Schematisches Regelwerk** + Fallanweisungen (4.12); EC häufig sinnvoll, nicht pauschal normpflichtig |
| [[veranstaltungsdienst]] | **77200-1:** Profil → DI ohne Auslöser · **mit Auslösern:** SK → EK → DI · **77200-2 Kap. 5:** SK+EK **erforderlich** |

SDL-Pfade: `knowledge/3_sdls/<sdl_slug>/`

---

## Quellen

| Quelle | Referenz | Schicht |
|--------|----------|---------|
| DIN 77200-1:2022-10 | Primärnorm (`source_documents`) | Norm |
| DIN 77200-2:2020-07 | Kap. 4 SK/EK; Abgrenzung 77200-1 vs. 77200-2 (`source_documents`) | Norm |
| Begriff Dienstanweisung | 3.13 | Norm |
| Verträge / DI als Vertragsbestandteil | 4.10 — wörtlich | Norm |
| Anforderungsprofile / Absprache AG-AN | 4.11 | Norm |
| Angebotsdokumentation / Freigabe abgestimmter DI | 4.23 | Norm |
| ISO 9001 — Lenkung dokumentierter Information | 7.5.2, 7.5.3 | QMS / Literaturhinweis |
| Anforderungsprofile | 4.11 | Norm |
| Dienstanweisungen | 4.12 | Norm |
| Unterweisung | 4.14.5 | Norm |
| Einsatzkräfte / Einweisung | 4.25 | Norm |
| Cert-Expert | [[overview]] — CEKS v1 | Governance |
| VA Erstellung Dienstanweisungen | `inputs/practical_sources/DIN77200-2_10_Kap. 7, V6 –VA Erstellung Dienstanweisungen.docx` | **Best Practice — keine Normquelle** |

*Kein Normvolltext. Pflichtinhalte und Schwellen vor Zertifizierungsentscheidungen gegen Primärquelle und Vertragsunterlagen prüfen.*

---

## Offene Punkte

- [ ] Cert-Expert-ODA-Vorlage aligned zu 4.12-Pflichtthemen (Checkliste)
- [ ] Blueprint-Regel: wann EC vs. ODA vs. kombinierte DI-Struktur
- [ ] Mapping DI-Blöcke → Platzhalter in ODA-Produkt-Templates
- [ ] Querverweis [[Subunternehmer]] vertiefen sobald Modul existiert
- [ ] Digitale DI-Verfügbarkeit: Mindestanforderungen für Audit-Stichprobe definieren
- [ ] Abstimmung 12-Monats-DI-Prüfung vs. 12-Monats-Profilprüfung (4.11) in QM-Kalender
