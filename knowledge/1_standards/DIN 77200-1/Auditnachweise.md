---
type: standard_module
standard: DIN 77200-1
module: Auditnachweise
module_id: audit_evidence
status: active
language: de
source_status: curated
knowledge_standard: CEKS_v1
parent_standard: DIN 77200-1
knowledge_path: knowledge/1_standards/DIN 77200-1/Auditnachweise.md
source_documents:
  - inputs/raw_standards/din/DIN_77200_1_2022
  - inputs/raw_standards/din/DIN_77200_2_2020
norm_references:
  - "4.1"
  - "4.3"
  - "4.5"
  - "4.6"
  - "4.7"
  - "4.8"
  - "4.9"
  - "4.18"
  - "4.20"
  - "4.23"
related_modules:
  - required_documents
  - leadership_requirements
  - qualification_requirements
  - site_instruction
  - further_training
  - subcontractors
related_processes:
  - qualitaetsmanagement_audit
  - zertifizierung_konformitaetsbewertung
  - auftrags_angebotsprozess
  - melde_berichtswesen
related_document_types:
  - nachweisregister
  - auditbericht
  - konformitaetserklaerung
  - angebotsdokumentation
  - kontrollprotokoll
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
  - audit
  - nachweise
  - qms
  - zertifizierung
  - konformitaetsbewertung
created_for: cert_expert_ai
---

# Auditnachweise

Master-Modul: [[overview]] · Taxonomie: **Audit evidence & Konformitätsnachweis**

---

## Zweck

Festlegung, wie Cert-Expert **Auditnachweise** nach DIN 77200-1:2022-10 interpretiert, strukturiert und **prüfbar bewertet** — vom **4.1-Nachweisportfolio** über **QMS-Audits (4.6)** und **Kontrollsysteme (4.18)** bis zur **Konformitätsbewertung** (DIN 77200-3).

**Abgrenzung:** [[Erforderliche Dokumente]] modelliert **welche Dokumente** in der Leistungskette existieren. Dieses Modul modelliert **wie Nachweise im Audit überzeugen** — Vollständigkeit, Aktualität, Rückverfolgbarkeit, Stichprobenlogik.

---

## Schichtenmodell

| Schicht | Inhalt | Beispiel |
|---------|--------|----------|
| **Normpflicht** | Was der AN **nachweisen muss** | 4.1-Portfolio; QMS (4.6); GB je Leistungsort (4.8) |
| **Audit-Nachweis** | Wie Prüfer **Überzeugung** gewinnen | Stichprobe Vertrag→Profil→Personal; Kontrollgänge auswertbar |
| **Cert-Expert Best Practice** | Strukturierung ohne Normersatz | Nachweisregister mit Fristen; Audit-Ready-Ordner; NC-Tracking |

**QMS-Ergänzung (4.6 / ISO 9001):** Interne Audits, Managementreview, dokumentierte Informationen lenken — **zusätzliche** Systemspur neben DIN-77200-Auftragsnachweisen.

---

## Auditarten im DIN-77200-Kontext

| Auditart | Prüfer | Schwerpunkt | Normbezug |
|----------|--------|-------------|-----------|
| **Konformitätsbewertung / Zertifizierung** | Zertifizierungsstelle nach DIN 77200-3 | System- und Leistungsfähigkeit des AN | Einleitung; 4.1; 4.6; Stichprobe SDL |
| **Überwachungsaudit** | Zertifizierungsstelle (Zyklus) | Wirksamkeit QMS; Nachweisaktualität | 4.6; 4.1-Fristen |
| **AG-Audit / Besichtigung** | Auftraggeber | Vertragliche Leistung, Profil, DI, Personal vor Ort | 4.10–4.12; 4.11; 4.14.2 |
| **Internes QM-Audit** | AN (QMB) | Prozesskonformität, VA-Umsetzung | 4.6; 4.1 a) 5 (Verfahren) |
| **Operative Stichprobe** | Einsatzleitung / Führung | Tages-Compliance (nicht Ersatz für Zertifizierung) | 4.12; 4.20; 4.24 |

**Leitregel:** Ein internes Audit ersetzt **keine** fehlenden 4.1-Nachweise. Umgekehrt: vollständiges Papierportfolio ohne Vor-Ort-Wirksamkeit scheitert an der Stichprobe.

---

## Normkontext — Nachweisanker

| Bereich | Normanker | Audit-Rolle |
|---------|-----------|-------------|
| Zu erbringende Nachweise | 4.1 | **Kernportfolio** — Unternehmen + SMA |
| Versicherung | 4.3 | Deckungsnachweis gegenüber AG |
| Beschwerdemanagement | 4.5 | Dokumentiertes Verfahren + Bearbeitung |
| Qualitätsmanagement | 4.6 | QMS-Nachweis; **regelmäßige Audits**; Besprechungen |
| Risikomanagement | 4.7 | Risikoerkennung/-steuerung kritischer Prozesse |
| AGS / GB | 4.8 | GB je Leistungsort; Umsetzungsnachweis |
| Geschäftsräume / Akten | 4.9 | Verfügbarkeit SDL-Akten, DI, Personal, Objektdaten |
| Kontrollsysteme | 4.18 | Nachweis erbrachter SDL; AG-Auswertung |
| Melde-/Berichtswesen | 4.20 | Einsatzdokumentation; Archivierung |
| Angebotsdokumentation | 4.23 | Konformitätskurzdoku; Zertifizierungsvereinbarung |

Detaildokumente (Vertrag, Profil, DI, Qualifikation): [[Erforderliche Dokumente]] — hier **Nachweisqualität** und **Audit-Spur**.

---

## 4.1 — Nachweisportfolio (Systemebene)

### Unternehmensnachweise (4.1 a)

| Nachweis | Frist / Aktualität | Norm | Audit-Prüffrage |
|----------|-------------------|------|-----------------|
| Gewerbezentralregister | **Jährlich** | 4.1 a) 1 | Auszug ≤12 Mon.? |
| Finanzamt-Unbedenklichkeit | **Jährlich** | 4.1 a) 1 | Aktuell? |
| SV-Unbedenklichkeit | **≤6 Mon.** | 4.1 a) 1 | Datum prüfen |
| Datenschutzverpflichtung (Vertretung) | Bei Bedarf erneuern | 4.1 a) 2 | Unterschrift vertretungsberechtigt? |
| Verschwiegenheitsverpflichtung (Vertretung) | Bei Bedarf erneuern | 4.1 a) 3 | Vorhanden? |
| Mindestlohn-Eigenerklärung | Nach Vorgabe / jährlich prüfen | 4.1 a) 4 | Aktuelle Erklärung? |
| **Schriftliche Verfahren (VA)** | Lebendig geführt, versioniert | 4.1 a) 5 | VA existiert **und** wird angewendet? |

**VA-Pflichtthemen (4.1 a) 5 — müssen schriftlich dokumentiert sein:**

| Verfahren | Normverweis | Peer-Modul |
|-----------|-------------|------------|
| Datenschutzverpflichtung SMA | 4.1 a) 5 | [[Qualifikationsanforderungen]] |
| Verschwiegenheit SMA | 4.1 a) 5 | [[Qualifikationsanforderungen]] |
| Beschwerdemanagement | 4.5 | [[Beschwerdemanagement]] *(geplant)* |
| Erstellung Dienstanweisungen | 4.12 | [[Dienstanweisungen]] |
| Dienstausweise | 4.14.4 | [[Erforderliche Dokumente]] |
| Unterweisung | 4.14.5 | [[Qualifikationsanforderungen]] |
| Qualifikation | 4.19.1 | [[Qualifikationsanforderungen]] |
| Weiterbildung | 4.19.2 | [[Weiterbildung]] |
| Melde- und Berichtswesen | 4.20 | [[Erforderliche Dokumente]] |
| Schließmittelverwaltung | 4.21 | [[Erforderliche Dokumente]] |

**Audit-Logik:** Verfahren **ohne Anwendungsnachweis** (Protokolle, Listen, Stichproben) = Papier-QM — NC-Risiko.

---

### Mitarbeiternachweise (4.1 b)

| Nachweis | Geltung | Norm | Stichprobe |
|----------|---------|------|------------|
| §34a Unterrichtung **oder** Sachkundeprüfung | Jeder SDL-SMA | 4.1 b) 1 | Personalakte |
| Sachkundeprüfung spätestens **6. Monat** | Neueinstellungen | 4.1 b) 2 | HR-Liste + Einsatzplan |
| Übergang Stichtag **2020-10-13** (3 J. SDL) | Einzelfall | 4.1 b) 2 | Dauerbeschäftigungsnachweis |
| Einweisung in DI | Je AG/Objekt vor erstem Einsatz | 4.1 b) 3 | Einweisungsprotokoll |
| Datenschutz SMA | Vor Tätigkeit | 4.1 b) 4 | AV oder Erklärung |
| Verschwiegenheit SMA | Vor Tätigkeit | 4.1 b) 5 | AV oder Erklärung |

**Stichprobenkette (Cert-Expert):** Anforderungsprofil → eingesetzte SMA am Prüftag → Personalakte → Einsatzplan → Vor-Ort-Frage.

Detail: [[Qualifikationsanforderungen]].

---

## 4.6 — Qualitätsmanagement & interne Audits

| Anforderung | Normstärke | Nachweis im Audit |
|-------------|------------|-------------------|
| QMS vorweisen (z. B. ISO 9001) | **muss** | Zertifikat / gleichwertiger Nachweis |
| Regelmäßige Audits | **muss** | Interne Auditberichte, Plan, Maßnahmen |
| Institutionalisierte Besprechungen | **muss** | Protokolle (Qualität der Kommunikation) |

**Was Auditoren typischerweise prüfen:**

- QMS-Scope deckt SDL-Prozesse ab
- Interne Audits **planmäßig** (Intervall im QMS, nicht ad hoc)
- Feststellungen → Korrekturmaßnahmen → Wirksamkeitsprüfung
- Besprechungen nicht nur „Kaffeerunden“ — dokumentierte Inputs/Outputs

**Abgrenzung Norm vs. ISO:** DIN 77200-1 verlangt QMS-Nachweis **ohne** zwingend ISO-9001-Zertifikat — „zum Beispiel auf Grundlage der DIN EN ISO 9001“. Audit prüft **gleichwertige Wirksamkeit**, nicht nur Papierzertifikat.

---

## 4.5 / 4.7 / 4.8 / 4.3 — Ergänzende Systemnachweise

| Bereich | Norm | Typischer Auditnachweis |
|---------|------|-------------------------|
| Beschwerdemanagement | 4.5 | VA + Reklamationsprotokolle + Auswertung |
| Risikomanagement | 4.7 | Risikoregister; Maßnahmen zu kritischen Prozessen |
| AGS | 4.8 | **GB je Leistungsort**; Umsetzung; Unterweisung |
| Versicherung | 4.3 | Police; Mindestsummen; Laufzeit während SDL |
| Geschäftsräume | 4.9 | Besichtigung; Aktenführung DI/Personal/Objekt |

**GB im Audit:** Nicht nur Existenz — Wirksamkeit (Maßnahmen umgesetzt, SMA unterwiesen). Cert-Expert-Produkt GB ist **Arbeitsdokument** bis Freigabe — siehe Produktregeln.

---

## 4.18 — Kontrollsysteme als Leistungsnachweis

| Aspekt | Inhalt |
|--------|--------|
| **Funktion** | Nachweis **realisierter** SDL gegenüber AG |
| **Normstärke** | AN **kann** Systeme einsetzen — bei Einsatz gelten Anforderungen |
| **Typen** | Wächterkontrolle, Video, Leitsysteme, minutengenaue Erfassung |
| **AG-Bezug** | Gesammelte Daten **turnusmäßig zur Auswertung anbieten** |
| **Vertrag** | AG **sollte** Kontrollwunsch bei Beauftragung festlegen (4.23) |

**Audit-Logik:**

```
Kontrollsystem vereinbart/eingesetzt?
  ├─ nein → Nachweis über manuelle Protokolle / Einsatzdokumentation (4.20)
  └─ ja  → System funktionsfähig? Daten vollständig? AG-Auswertung dokumentiert?
```

**NC-Risiko:** System lückenhaft, aber SDL dennoch abgerechnet — schwerwiegender Befund bei Revier/Intervention/Alarm.

---

## 4.20 — Einsatzdokumentation im Audit

4.20 verlangt **Aufzeichnungen** zu:

- vertraglich vereinbarter Aufgabenerfüllung (qualitativ/quantitativ)
- AGS-relevanten Prozessen
- sicherheitsgefährdenden Feststellungen (Sammlung, Prüfung, AG-Übermittlung, Archiv)

**Audit-Spur:** DI (Meldewesen-Inhalt) → Verfahren 4.20 → Schicht-/Einsatzprotokolle → AG-Meldung → Archiv.

Detail: [[Erforderliche Dokumente]] — Meldewesen/Berichte.

---

## Konformitätsbewertung & Zertifizierung

*(DIN 77200-3 — nur Einordnung, kein Normersatz)*

| Thema | Einordnung |
|-------|------------|
| **Zertifizierung** | Nachweis der Leistungsfähigkeit durch unabhängige Stelle (Reihe DIN 77200-3) |
| **Verzicht AG** | AG kann auf zertifizierten AN verzichten — trägt dann Verantwortung für vollständige Normanwendung (4.23) |
| **Angebots-Konformitätskurzdoku** | AN **muss** Kurzdoku zur auftragsbezogenen Normeinhaltung im Angebot liefern (4.23) |
| **Zertifizierungsnachweis im Vertrag** | AG **sollte** festlegen, ob Zertifizierung nachzuweisen ist (4.23) |

**Cert-Expert:** Zertifikat ≠ automatische Konformität aller Aufträge — Stichprobe je Vertrag/Objekt bleibt nötig.

---

## Nachweisregister (Best Practice)

*(Nicht normativ — empfohlene Audit-Vorbereitung)*

| Spalte | Inhalt |
|--------|--------|
| Nachweis-ID | Eindeutige Kennung |
| Normanker | z. B. 4.1 a) 1 |
| Träger | Unternehmen / SMA / Auftrag |
| Gültig bis | Frist |
| Verantwortlich | Rolle |
| Ablageort | physisch/digital |
| Letzte Prüfung | Datum, Ergebnis |

**Fristen-Alarme (typisch):** GZR jährlich; SV 6 Mon.; DI-Prüfung 12 Mon.; Profil 12 Mon.; Unterweisung 12 Mon.; Ersthelfer 24 Mon.; UE 4.19.2.

---

## Audit-Spuren (Trace-Modelle)

### Spur A — Zertifizierung / Systemaudit

```
4.1-Portfolio (Unternehmen)
  → QMS 4.6 (Zertifikat + interne Audits)
  → VA-Register 4.1 a) 5
  → GB 4.8 (Stichprobe Leistungsorte)
  → Beschwerde 4.5 / Risiko 4.7
  → Geschäftsräume 4.9
```

### Spur B — Auftrag / AG-Audit

```
Vertrag 4.10
  → (ggf.) SK — AG-Planungsgrundlage (77200-1: nur bei **Auslösern**; 77200-2: **muss**)
  → Profil 4.11
  → (ggf.) EK — AN (77200-1: Auslöser/Angebot 4.23; 77200-2: **muss**)
  → DI 4.12 (+ AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI 4.23)
  → Personal 4.1 b + 4.14.2
  → Einweisung 4.25
  → Laufzeit: Meldewesen 4.20 / Kontrolle 4.18
  → Führung 4.24
```

*(Einfache SDL / einfache 77200-1-Veranstaltung ohne Auslöser: Profil → DI ohne pauschales SK/EK.)*

### Spur C — Personal-Stichprobe

```
Profil-Tätigkeit
  → Einsatzplan (wer heute?)
  → §34a + ggf. B/C
  → Einweisung + Unterweisung
  → Vor-Ort: DI-Kenntnis, Dienstausweis
```

---

## Fehlende Nachweise — Auswirkungen, NC, Folgeprozess

| Fehlender Nachweis | Auswirkung | NC | Folgeprozess |
|--------------------|------------|-----|--------------|
| GZR / Finanzamt / SV abgelaufen | System-Compliance bricht | NC-AN-01 | 4.1 aktualisieren; Einsatz bis Klärung riskant |
| VA zu Pflichtprozess fehlt | 4.1 a) 5 — schwerwiegend | NC-AN-02 | VA erstellen; Wirksamkeit nachweisen |
| QMS-Nachweis fehlt | 4.6-NC | NC-AN-03 | ISO 9001 / gleichwertig |
| Keine internen Audits | 4.6-NC | NC-AN-04 | Auditprogramm |
| Keine Besprechungsprotokolle | 4.6-NC | NC-AN-05 | Institutionalisieren |
| GB Leistungsort fehlt | 4.8-NC | NC-AN-06 | GB-Bot / Fachkraft |
| Versicherung unzureichend | 4.3-NC | NC-AN-07 | Police anpassen |
| §34a SMA fehlt | Unzulässiger Einsatz | NC-AN-08 | [[Qualifikationsanforderungen]] |
| Einweisung fehlt | 4.1 b) 3 / 4.25 | NC-AN-09 | Einweisung vor Einsatz |
| Kontrollsystem lückenhaft | SDL nicht nachweisbar | NC-AN-10 | 4.18 / 4.20 |
| Meldearchiv lückenhaft | 4.20-NC | NC-AN-11 | Melde-/Berichtswesen |
| Beschwerdeverfahren fehlt | 4.5-NC | NC-AN-12 | Beschwerdeprozess |
| Risikonachweis fehlt | 4.7-NC | NC-AN-13 | Risikoregister |
| Akten 4.9 nicht verfügbar | Besichtigungs-NC | NC-AN-14 | Geschäftsräume/Ablage |
| Zertifikat abgelaufen | Markt-/Vertragsrisiko | NC-AN-15 | Re-Zertifizierung |

Auftragsbezogene NCs (Vertrag, Profil, DI): [[Erforderliche Dokumente]] — NC-V/P/D/…

---

## Anforderungsübersicht

### Normative Anforderung

- AN **muss** 4.1-Nachweise erbringen (Unternehmen + SMA).
- AN **muss** QMS nachweisen; **regelmäßige Audits** und **institutionalisierte Besprechungen** (4.6).
- AN **muss** Beschwerdeverfahren (4.5), Risikosteuerung (4.7), AGS/GB (4.8), Versicherung (4.3), Geschäftsräume/Akten (4.9) nachweisen.
- Bei Kontrollsystemen: Daten **AG zur Auswertung** anbieten (4.18).
- Einsatzdokumentation und Archivierung (4.20) schriftlich verantwortet.

### Praxisumsetzung

*(Cert-Expert Best Practice)*

- **Audit-Ready-Ordner** je Auftrag + **Systemordner** 4.1/QMS getrennt.
- Vor Zertifizierung: Mock-Audit entlang Spur A + Stichprobe Spur B.
- NC-Register mit Wirksamkeitsprüfung — aligned zu 4.6.
- Digitale Signatur/Freigabe für GB, DI, *(ggf. Einsatzkonzept)* — `approved_by` in Cert-Expert-Produkten.

---

## Audit-Relevanz

| Priorität | Thema | Normanker |
|----------|-------|-----------|
| Kritisch | 4.1-Portfolio vollständig und fristgerecht | 4.1 |
| Kritisch | QMS-Nachweis + regelmäßige interne Audits | 4.6 |
| Kritisch | GB je Leistungsort + Umsetzung | 4.8 |
| Kritisch | Stichprobe Profil ↔ Personal ↔ Einsatz | 4.11, 4.1 b, 4.14.2 |
| Hoch | Schriftliche Verfahren zu allen 4.1 a) 5-Themen | 4.1, 4.5, 4.12, 4.20, … |
| Hoch | Beschwerde- und Risikonachweis | 4.5, 4.7 |
| Hoch | Versicherungsdeckung | 4.3 |
| Hoch | Einsatzdokumentation / Meldewesen wirksam | 4.20 |
| Hoch | Kontrollsysteme — wenn eingesetzt | 4.18 |
| Mittel | Geschäftsräume / Aktenführung | 4.9 |
| Mittel | Konformitätskurzdoku / Zertifizierungsstatus | 4.23 |
| Mittel | Institutionalisierte Besprechungen | 4.6 |

---

## Audit-Nachweise (Meta-Ebene)

| Nachweisart | Inhalt | Schicht |
|-------------|--------|---------|
| Nachweisregister 4.1 | Alle Pflichtnachweise mit Fristen | Audit/Best Practice |
| QMS-Zertifikat / QMB-Nachweis | 4.6 Systembasis | Norm |
| Interne Auditberichte + Maßnahmenplan | 4.6 Wirksamkeit | Norm |
| Besprechungsprotokolle QM | 4.6 Kommunikation | Norm |
| VA-Bibliothek | 4.1 a) 5 Prozesse | Norm |
| GB + Umsetzungsnachweise | 4.8 | Norm |
| Beschwerde- / Risikoregister | 4.5, 4.7 | Norm |
| Versicherungspolice | 4.3 | Norm |
| Kontrollsystem-Auswertungen | 4.18 | Norm/Audit |
| Zertifikat DIN 77200 / Konformitätserklärung | 77200-3 / 4.23 | Audit |
| Mock-Audit / NC-Register | Vorbereitung | Best Practice |

---

## Typische Auditorfragen

1. Zeigen Sie Ihr **4.1-Nachweisregister** — welche Nachweise sind abgelaufen?
2. **GZR, Finanzamt, SV** — Daten der letzten Auszüge?
3. Wo sind die **schriftlichen Verfahren** zu DI, Unterweisung, Qualifikation, Meldewesen?
4. **QMS-Nachweis** — Zertifikat, Scope, Gültigkeit?
5. Wann war das letzte **interne Audit** — Feststellungen, Maßnahmen, Wirksamkeit?
6. **Institutionalisierte Besprechungen** — Protokolle der letzten 12 Monate?
7. **GB** für den heute besichtigten Leistungsort — Maßnahmen umgesetzt?
8. **Versicherung** — Deckungssummen, Laufzeit, SDL-Bezug?
9. Stichprobe: **Profil → Personal → Einsatzplan** am Prüftag?
10. **Kontrollsystem** — funktioniert es? Werden Auswertungen dem AG angeboten?
11. **Schichtprotokolle / Meldewesen** — lückenlos? Archivierung?
12. **Beschwerden** im letzten Jahr — Verfahren, Bearbeitung, Auswertung?
13. **Risikoregister** — kritische Prozesse, Maßnahmen?
14. **Geschäftsräume** — wo liegen DI, Personalakten, Objektdaten?
15. **Zertifizierung** — gültig? Scope passt zu SDL des Auftrags?

---

## Typische Abweichungen

| NC | Typischer Befund |
|----|------------------|
| NC-AN-01 | Register-/Finanz-/SV-Nachweise abgelaufen |
| NC-AN-02 | Fehlende VA zu 4.1-Pflichtprozessen |
| NC-AN-03 | Kein QMS-Nachweis |
| NC-AN-04 | Keine dokumentierten internen Audits |
| NC-AN-05 | Keine institutionalisierten Besprechungen |
| NC-AN-06 | GB fehlt am Leistungsort oder Maßnahmen nicht umgesetzt |
| NC-AN-07 | Versicherungssumme/-laufzeit unzureichend |
| NC-AN-08 | SMA ohne §34a in Stichprobe |
| NC-AN-09 | Einweisung fehlt in Stichprobe |
| NC-AN-10 | Kontrollsystem mit Datenlücken |
| NC-AN-11 | Einsatzdokumentation unvollständig |
| NC-AN-12 | Beschwerdeverfahren nicht nachweisbar |
| NC-AN-13 | Risikomanagement Papier ohne Anwendung |
| NC-AN-14 | Akten/DI nicht auffindbar (4.9) |
| NC-AN-15 | Zertifikat abgelaufen trotz Vertragszusage |

---

## Risiken

| Risiko | Auswirkung |
|--------|------------|
| Abgelaufene 4.1-Nachweise | Zertifizierungsverlust; AG-Kündigung |
| VA ohne Praxis | Papier-QM — schwerwiegende 4.6/4.1-NC |
| Keine internen Audits | Systemfehler unentdeckt bis externer Audit |
| GB-Lücke | AGS-Haftung; Personenschaden |
| Kontrollsystem-Blindflug | SDL nicht belegbar — Abrechnungsstreit |
| Zertifikat ohne Auftrags-Spur | Falsche Sicherheit — Stichprobe scheitert |
| Nachweis-Chaos | Auditversagen trotz faktischer Compliance |

---

## Cert-Expert-Anwendung

**Routing:** Modul laden bei **Zertifizierung, DEKRA/TÜV-Vorbereitung, 4.1-Portfolio, QMS-Audit, Kontrollsystem-Nachweis, Mock-Audit** — Dokumentenliste: [[Erforderliche Dokumente]].

**Produktbezug**

| Cert-Expert-Produkt | Audit-Relevanz |
|--------------------|----------------|
| GB | 4.8 — bis Freigabe kein Konformitätsnachweis |
| Sicherheitskonzept (SK) | **77200-2:** AG **muss** — ohne SK keine SDL nach 77200-2; **77200-1 einfach / Veranstaltung ohne Auslöser:** fehlendes SK ≠ pauschal NC |
| Einsatzkonzept (EK) | **77200-2:** AN **muss**, DI aus EK; **77200-1:** Angebot 4.23 + nur bei **Auslösern** audit-relevant |
| ODA / DI | 4.12 — Verfügbarkeit + **AG-Abstimmung / dokumentierte Freigabe der abgestimmten DI** + **interne Freigabe / Lenkung nach QMS** |
| Angebotsmappe | 4.23 + Konformitätskurzdoku |

---

## Bot-/RAG-Regeln

**Entscheidungslogik**

```
1. Auditart klären (Zertifizierung / AG / intern / Stichprobe)?
   └─ bestimmt Spur A vs. B vs. C

2. System- vs. Auftragsnachweis?
   ├─ System → 4.1 a, 4.6, 4.5, 4.7, 4.8, 4.3, 4.9
   └─ Auftrag → [[Erforderliche Dokumente]] + Stichprobe Personal

3. Nachweis fehlt?
   └─ Tabelle „Fehlende Nachweise“ → NC-AN-xx + Folgeprozess
   └─ nie „konform“ behaupten ohne Nachweisreferenz

4. Frist prüfen (GZR, SV, DI, Profil, Unterweisung)?
   └─ abgelaufen → NC-AN-01 oder spezifische NC

5. Kontrollsystem?
   └─ wenn Projektinput „Wächterkontrolle/Video“ → 4.18 prüfen
   └─ sonst → 4.20 manuelle Protokolle

6. Zertifikat erwähnt?
   └─ Scope/Gültigkeit [OFFENER PUNKT] wenn unbekannt
   └─ ersetzt nicht Auftrags-Stichprobe
```

**Verbindliche Regeln**

- **Norm / Audit / Best Practice** trennen; **keine Normtexte** kopieren.
- [[Erforderliche Dokumente]] für **Dokumentenketten**; dieses Modul für **Nachweisqualität & Audit-Spuren**.
- SDL-Kontext vor SK/EK-Bewertung: **77200-1 einfach** / **77200-1 Veranstaltung** (Auslöser prüfen) / **77200-2 Kap. 5–8** — bei 77200-2 fehlendes SK oder EK **normrelevant** (Kap. 4); bei 77200-1-Veranstaltung **ohne Auslöser** fehlendes SK/EK **≠** pauschal NC.
- `approved_by` leer bei GB/DI/(ggf. Einsatzkonzept) ⇒ **kein Audit-Nachweis der Freigabe** — `[OFFENER PUNKT]`.
- Internes Audit-Protokoll **belegt nicht** fehlende §34a-Nachweise.
- **77200-3** nur einordnen — kein Zertifizierungsverfahren erfinden.
- Fristenangaben nur mit Datum aus Projektinput — sonst `[OFFENER PUNKT]`.

**Reviewer-Fokus:** Spur schließt? Fristen grün? Stichprobe Profil→Personal→Ort konsistent?

---

## Verwandte Module

| Modul | Beziehung |
|-------|-----------|
| [[overview]] | Master-Index; Auditierung-Themenbereich |
| [[Erforderliche Dokumente]] | Dokumentenlogik & Auftragskette |
| [[Qualifikationsanforderungen]] | 4.1 b; Personal-Stichprobe |
| [[Dienstanweisungen]] | DI-Verfügbarkeit, Prüfzyklus, AG-Abstimmung / dokumentierte Freigabe, interne Freigabe / Lenkung nach QMS |
| [[Führungsanforderungen]] | 4.2, 4.24 — Führungsnachweise |
| [[Weiterbildung]] | 4.19.2 — UE-Nachweise |
| [[Subunternehmer]] | 4.13 — Sub-Audit |
| [[Beschwerdemanagement]] | 4.5 *(geplant)* |

---

## Verwandte Prozesse

| Prozess | Nachweisfokus |
|---------|---------------|
| Zertifizierung / Konformitätsbewertung | 4.1, 4.6, 77200-3 |
| Qualitätsmanagement & Audit | Interne Audits, NC, Besprechungen |
| Auftrags- / Angebotsprozess | Konformitätskurzdoku, Zertifizierungsklausel |
| Melde- & Berichtswesen | 4.20-Archive |
| Gefährdungsbeurteilung (AGS) | GB je Leistungsort |

---

## Verwandte SDLs

| SDL | Besonderer Nachweisschwerpunkt |
|-----|--------------------------------|
| Revier / mobiler Kontrolldienst | 4.18 Kontrollgänge; Revierprotokolle |
| Interventionsdienst | Alarm-/Interventionsprotokolle; 4.19.1 |
| Stationäre SDL | GB Objekt; Führung vor Ort; DI-Verfügbarkeit |
| Veranstaltungsdienst | **77200-1:** Profil → DI ohne Auslöser · **mit Auslösern:** SK/EK prüfen · **77200-2 Kap. 5:** SK+EK **erforderlich** (5.1) |

---

## Quellen

| Quelle | Typ |
|--------|-----|
| DIN 77200-1:2022-10 — 4.1, 4.3, 4.5–4.9, 4.18, 4.20, 4.23 | Norm |
| DIN 77200-2:2020-07 — Kap. 4 SK/EK (`source_documents`) | Norm |
| DIN 77200-3 (Konformitätsbewertung) | Normreihe — Einordnung |
| Literaturhinweis DIN EN ISO 9001 (4.6, 4.5, 4.7) | QMS-Referenz |
| [[Erforderliche Dokumente]] | Peer — Dokumentenkette |
| Cert-Expert `reviewer_handoff.md`, `gb_rules.md` | Freigabe-/Review-Logik |

---

## Offene Punkte

- [ ] Nachweisregister-Template als Cert-Expert-Artefakt
- [ ] [[Beschwerdemanagement]]-Modul — 4.5 vertiefen
- [ ] Mock-Audit-Checkliste DEKRA-aligned
- [ ] Schnittstelle DIN 77200-3 Detailmodul (Parent `overview` reserviert)
- [ ] Blueprint-Regel: welche `qa_status`-Werte audit-relevant sind
