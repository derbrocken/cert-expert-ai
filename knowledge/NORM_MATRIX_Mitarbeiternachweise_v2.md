# Norm-Matrix Mitarbeiternachweise — v2

**Zweck:** Belastbares, auditfähiges Fundament für die Requirement-/Schulungs-Engine (Tool 2, Slice 2/3). Leitet aus Bedingung → Anforderung → Nachweis ab, **ohne erfundene Normpflichten**.
**Stand:** 2026-06-07 · **Erstellt:** Claude (Code-Track), aus DIN-Originalen extrahiert · **Fachlich bestätigt:** Mark (GF Cert-Expert), 2026-06-07.
**Verbindlichkeit:** Werte mit §-Fundstelle sind belegt. Punkte ohne sichere Ableitung sind als **OFFEN / FACHLICH PRÜFEN** markiert (CROSS-CONTROL-05).

## Quellen (Originale)
- **DIN 77200-1:2022-10** — Sicherungsdienstleistungen, Teil 1 (Grundanforderungen).
- **DIN 77200-2:2020-07** — Teil 2 (erweiterte Anforderungen, besondere Leistungsbereiche).
- **DIN 77200-3:2020-07** — Teil 3 (Zertifizierung; Mindestumfang/Quote).
- **§ 34a GewO** — Unterrichtung / Sachkundeprüfung.
> Hinweis: Teil 2/3 verweisen z. T. auf DIN 77200-1:2017-11; die hier genutzten Werte (§4.1 b, §4.19.1/.2) sind in der Fassung 2022-10 inhaltsgleich.

---

## 1. Was bedeutet „qualifiziert"? (§-genaue Definition)

DIN 77200-3, Tabelle 1, definiert „qualifizieren" **per Verweis**: ein SMA gilt als qualifiziert, wenn er **DIN 77200-1 §4.1 b) UND §4.19.1** erfüllt (für besondere Leistungsbereiche zusätzlich die einschlägigen Anforderungen aus DIN 77200-2).

> Wörtlich (Teil 3): „Der Kunde muss für die Zertifizierung **nicht alle** … SMA nach den Anforderungen der DIN 77200-1, 4.1 b) und 4.19.1, qualifizieren."

**Wichtig:** Die **jährliche Weiterbildung (§4.19.2, 40/24 UE)** ist **NICHT** Teil dieser „qualifiziert"-Definition. Sie ist ein **eigenständiger, laufender Nachweis** (Weiterbildungskonzept + Durchführung), der separat zu führen und zu prüfen ist. → Zwei getrennte Ampeln (siehe §6 und §10).

### 1.1 Bestandteile „qualifiziert" (Checkliste je Person)
Aus **§4.1 b)** (Stamm-/Eintrittsnachweise):
- **Sachkunde §34a** — Eintritt mit Unterrichtung möglich, **Sachkunde spätestens zum Ablauf des 6. Monats** durchgehender Beschäftigung (§4.1 b 1+2).
- **Einweisung in die Dienstanweisung** (§4.1 b 3, Verweis §4.12).
- **Datenschutzverpflichtungserklärung** (§4.1 b 4).
- **Verschwiegenheitsverpflichtung** (§4.1 b 5).

Aus **§4.19.1** (Qualifikation):
- **Profil-Mindestqualifikation** nach Tabelle A.1 (Stufe A/B/C, siehe §3) — bzw. bei besonderen Leistungsbereichen die einmalige SDL-Schulung aus Teil 2 (siehe §5).
- **Aktueller Ersthelfer** — Erneuerung **mind. alle 2 Jahre** (§4.19.1).
- **Interventionskräfte zusätzlich:** 24-stündige interventionsbezogene Schulung **+ 5 durchgeführte Interventionen** (§4.19.1).
- **Führungskräfte:** Ausbildung Fachkraft/Servicekraft/geprüfte Schutz- u. Sicherheitskraft/IHK-Werkschutzfachkraft + **2 J. Berufserfahrung** (Stichtags-Ausnahme 13.10.2020, >3 J. Führungsfunktion).

---

## 2. §4.1 b) — 6-Monats-Sachkunde-Frist (zeitabhängig!)

| Eintrittsstatus | Gilt | Folge für Engine |
|---|---|---|
| **Unterrichtung §34a** | nur **Eintrittsfenster bis Ende 6. Monat** der durchgehenden Beschäftigung | Ampel **gelb** + Frist „Sachkunde fällig bis {startDate + 6 Monate}" |
| **Sachkundeprüfung §34a** | dauerhaft | Ampel **grün** (für diesen Punkt) |
| **Ausnahme:** zum Stichtag **13.10.2020** ≥ 3 J. durchgehende SDL-Tätigkeit | Sachkunde kann entfallen (sofern gesetzlich nicht anders geregelt) | manuell, „fachlich prüfen" |

→ `startDate` + Qualifikationsart erzeugen eine **Frist/Ampel**, nicht pauschal grün.

---

## 3. Qualifikationsstufen A/B/C (DIN 77200-1, Anhang A, Tabelle A.1)

| Stufe | Anforderung (Wortlaut sinngemäß) |
|---|---|
| **A – Grundanforderungen** | Qualifikation nach §4.1 b) 1)+2) (Unterrichtung→Sachkunde §34a); „einfache Aufgabenverrichtung nach schriftlichen Anweisungen". |
| **B – Erweiterte Anforderungen** | Geprüfte Schutz- u. Sicherheitskraft / IHK-Werkschutzfachkraft / Servicekraft für Schutz u. Sicherheit / gleich- oder höherwertig — **oder** ersatzweise **3 Jahre ununterbrochene Tätigkeit** im Sicherheitsgewerbe. |
| **C – Hohe Anforderungen** | Fachkraft für Schutz u. Sicherheit / Meister für Schutz u. Sicherheit / IHK-Werkschutzmeister / gleich- oder höherwertig. |

**Klarstellung:** Die Sachkundeprüfung liegt auf **Stufe A** (nicht B). B ist *über* Sachkunde.

### 3.1 Engine-Leitplanke (Markt-Realität, bestätigt Mark 2026-06-07)
In der Praxis arbeiten SMA nach schriftlicher Vorgabe; die Führungskraft entscheidet → es greift fast immer **Stufe A**.
> **Default = A.** **B/C nur als manueller Sonderfall** („fachlich prüfen"). Die volle Tätigkeit×Position×Stufe-Matrix wird **bewusst nicht** automatisiert (Verirrungsgefahr). Tabelle A.1 / Anhang C bleiben Referenz für den Einzelfall.

---

## 4. Erste Hilfe (Q4, bestätigt Mark)
- **Pflicht** über DIN 77200-1 §4.19.1 (Teil der Qualifikation).
- **Gültigkeit: Erneuerung mind. alle 2 Jahre** (§4.19.1).
- In der Akte beim Unterpunkt „Ersthelfer" mit **„gültig bis / Auffrischung"-Datum** führen (nicht nur „vorhanden ja/nein").

---

## 5. Einmalige SDL-Schulungen (DIN 77200-2, besondere Leistungsbereiche)

| Leistungsbereich | Rolle | UE (à 45 min) | Turnus | Fundstelle |
|---|---|---|---|---|
| Veranstaltungen mit bes. Sicherheitsrelevanz | Führungskraft | **24** | **einmalig** | 77200-2 §5.3 |
| Veranstaltungen mit bes. Sicherheitsrelevanz | Einsatzkraft | **16** | **einmalig** | 77200-2 §5.4 |
| Flüchtlings-/Asyleinrichtungen | Einsatzkraft | **40** | **einmalig** | 77200-2 §8.3 |
| Flüchtlings-/Asyleinrichtungen | Führungskraft | **+24 (= 64 gesamt)** | **einmalig** | 77200-2 §8.4 |
| Objekte mit bes. Sicherheitsrelevanz | Einsatzkraft | **+20** | **pro Jahr** (objektspezifisch, zusätzl. zu §4.19.2; DL max. 50 %) | 77200-2 §7.3 |

**Anrechnung:** Die UE der einmaligen Schulungen nach §5.3/5.4/8.4 sind **auf die Jahres-Weiterbildung (§4.19.2) im Erwerbsjahr anrechenbar** (Wortlaut Teil 2).
**Zusätzliche Inhalte (Teil 2):** Flüchtling = interkulturelle Kompetenz (Anh. A.1 EK / A.2 FK) + Deeskalation (Anh. B) + Brandschutzhelfer. FK Flüchtling **sollte** zusätzliche Fremdsprache haben (Soll/Empfehlung, **keine UE, keine harte Pflicht**, §8.4).

---

## 6. Jährliche Weiterbildung (DIN 77200-1 §4.19.2) — separater Zähler

| Beschäftigung | Soll-UE/Jahr (à 45 min) |
|---|---|
| **Vollzeit** | **mind. 40 UE** |
| **Teilzeit (nicht Vollzeit)** | reduzierbar auf **mind. 24 UE** |

- **Distance Learning:** max. **50 %** der geforderten UE (Rest Präsenz, empfohlen).
- Ein-/Unterweisungen (§3.18, §4.14.5) zählen **nicht** als Weiterbildungszeit.
- **Eigenständige, jährlich wiederkehrende Pflicht** — getrennt von der „qualifiziert"-Ampel (§1).
- Treibt das Feld **Beschäftigungsart** (Vollzeit/Teilzeit) → 40 vs. 24 UE.

---

## 7. Gültigkeiten / Fristen (Übersicht)

| Nachweis | Turnus / Frist | Fundstelle |
|---|---|---|
| Unterrichtung §34a (nur Eintritt) | bis Ende **6. Monat**, dann Sachkunde Pflicht | 77200-1 §4.1 b |
| Sachkundeprüfung §34a | dauerhaft | 77200-1 §4.1 b |
| Erste Hilfe | **alle 2 Jahre** erneuern | 77200-1 §4.19.1 |
| Brandschutzhelfer (ASR A2.2, **nur 77200-2-Kontexte**) | 4 UE, **alle 3 Jahre** erneuern | 77200-2 §7.3 |
| SDL-Einmalschulung (Teil 2) | einmalig, kein Ablauf | 77200-2 §5/§8 |
| Jahres-Weiterbildung §4.19.2 | jährlich rollierend (40/24 UE) | 77200-1 §4.19.2 |

---

## 8. Firmen-/Zertifizierungsebene — Quote (DIN 77200-3, Tabelle 1)

Für die Zertifizierung müssen **nicht alle** SMA qualifiziert sein, sondern nur der **Mindestumfang je SDL**:

| SDL (zertifiziert) | Erstzertifizierung | Rezertifizierung |
|---|---|---|
| Alarmdienst | 35 % | 60 % |
| Empfangsdienst | 35 % | 60 % |
| **Kontrolldienst (stationär)** | **35 %** | **60 %** |
| Kontrolldienst (mobil) | 35 % | 60 % |
| Revierdienst | 35 % | 60 % |
| Interventionsdienst | 35 % | 60 % |
| Veranstaltungssicherungsdienst | 20 % | 40 % |
| SDL Veranstaltungen bes. Sicherheitsrelevanz | 20 % | 40 % |
| SDL öffentlicher Personenverkehr | 30 % | 60 % |
| SDL Objekte bes. Sicherheitsrelevanz | 30 % | 60 % |
| SDL Flüchtlings-/Asyleinrichtungen | 30 % | 60 % |

**Bemessung/Prüfung:**
- % bezieht sich auf die in der jeweiligen SDL eingesetzten SMA → **Mindestumfang (Mmin)**, aufgerundet auf nächsthöhere ganze Zahl.
- Geprüft wird per **Stichprobe** aus Mmin (Teil-3-Formel, z. B. S = 1 + (ln(Mmin))², Smax = 45) — nicht zwingend jeder Einzelne.
- **Subunternehmer-Grenze:** Wird die SDL zu **> 50 % durch Subunternehmer** erbracht → **keine Zertifizierung**.

**Leitplanke:** Die Quote ist eine **Zertifizierungs-Schwelle, kein Freibrief.** Die gesetzliche §34a-Pflicht je Person (Unterrichtung zum Arbeiten, Sachkunde bis Monat 6) bleibt unberührt.

---

## 9. Architektur: getrennte Ebenen (für die Engine)

| Ebene | Logik | Wo im Tool |
|---|---|---|
| **Mitarbeiter (Akte)** | „Qualifiziert"-Ampel (§1.1, 6 Punkte) · 6-Monats-Sachkunde-Frist · Gültigkeiten (EH 2 J., Brandschutz 3 J.) | Slice 2/3 — pro Person |
| **Weiterbildung (Akte)** | Jahres-Zähler §4.19.2: Soll 40/24 UE vs. Ist, DL ≤ 50 % | Slice 2/3 — pro Person, eigener Zähler |
| **Firma / Zertifizierung** | Quote je SDL (Tabelle 1, 35/60 % …), Subunternehmer < 50 %, Stichprobe | **separate Zertifizierungs-Ansicht (Phase 2)** — NICHT in die Einzelakte |

---

## 10. Engine-Regeln Slice 2 (deterministisch)

1. **„Qualifiziert" (Person)** = §4.1 b) ✓ UND §4.19.1 ✓ (Checkliste §1.1). Sachkunde nach 6-Monats-Frist (§2). Default-Stufe **A**; B/C manuell.
2. **Weiterbildung (Person)** = separater Zähler, Soll aus Beschäftigungsart (40/24), DL ≤ 50 %; Einmalschulungen im Erwerbsjahr anrechenbar.
3. **Bedingungs-Dimensionen** (Pflicht-Set): Grundrolle × Geltungsbereich (77200-1/-2/SDL) × Beschäftigungsart × „fährt Dienstfahrzeug?" × Beauftragungen (Ersthelfer/Brandschutz/SiBe).
4. **„fährt Dienstfahrzeug? (ja/nein)"** → Fahrer-/UVV-Unterweisung (DGUV) — **OFFEN, Werte fachlich prüfen** (nicht in DIN 77200 verankert; arbeitsschutzseitig).
5. **Firmen-Quote** wird aus den Personen-Ampeln je SDL aggregiert (separate Ansicht, Phase 2).
6. **EC-10:** „grün/qualifiziert" ist eine Nachweis-Aussage, **keine Freigabe-/Auditfähigkeits-/Einsatzbereit-Aussage.**

---

## 11. Offene Prüfpunkte (vor Produktivschaltung)
- **Beauftragung ≠ Schulung (Brandschutzhelfer + Erste Hilfe)** [CL-74, bestätigt Mark 2026-06-07]: Zu trennen sind (a) die **interne Beauftragung** im Unternehmen (betrieblicher/Arbeitsschutz-Akt, z. B. Brandschutzhelfer bestellen) und (b) die **Schulung/Ausbildung** selbst. Die **Schulung muss von einem befähigten Ausbilder / ermächtigten Anbieter** durchgeführt werden (gilt für **Brandschutzhelfer** und **Ersthelfer-Ausbildung**). → Engine/Modell: Overlay-Beauftragung (intern) vom Schulungs-**Nachweis** trennen; Nachweis trägt zusätzlich das Attribut „Anbieter/Ausbilder befähigt?". Exakte Rechtsgrundlage (DGUV/ASR A2.2) = **legal-input** (Mark liefert §). **Anbieter-Validierung = Slice 3/4**, nicht Slice 2.
- Fahrer-/UVV-Unterweisung: konkrete Pflicht/Turnus (DGUV) — **fachlich prüfen** (nicht DIN 77200).
- B-Stufe per „3 Jahre ununterbrochene Tätigkeit": Nachweisform/Dokumentation festlegen.
- Stichtags-Ausnahme 13.10.2020 (Sachkunde-Befreiung): Erfassung als manuelles Flag.
- Erste-Hilfe: betriebl. DGUV-Auffrischungsintervall (2 J.) vs. abweichende Verträge — bestätigt 2 J. aus §4.19.1.
- Anrechnungs-Mechanik §4.19.2 (Einmalschulung im Erwerbsjahr): genaue Verbuchung im Zähler.

---

## 12. Zertifizierungszyklus (DIN 77200-3)
- Zertifikat **3 Jahre gültig** (§4.4.1).
- **Z (Erstzertifizierung, Jahr 0) → Ü1 (Jahr 1) → Ü2 (Jahr 2) → Rezert (Jahr 3)**.
- **Jährlich ein Überwachungsaudit** (§4.4.6); **Rezert im letzten Jahr, spätestens 3 Monate vor Ablauf** (§4.4.7). Termin gerissen → erneute Erstzertifizierung.
- **Quote** (Tabelle 1) gilt: 35/60, 30/60 bzw. 20/40 je SDL (siehe §14). **Jahres-Weiterbildung (§4.19.2) wird an JEDEM Audit geprüft** (ab Ü1), an der Stichprobe aus dem qualifizierten Pool.

## 13. Erstaudit-Einstiegswege (DIN 77200-3, §4.4.2 + Absatz nach Tab. 1)

| Weg | Norm-Anker | Wofür | Objekt nötig? |
|---|---|---|---|
| **1 — Doku-Basis ohne Objekt** | §4.4.2 Abs. 3 | **DIN 77200-1** (alle SDL) + **DIN 77200-2 §6 ÖPV / §8 Flüchtling** — **NICHT** §5 Veranstaltung, §7 Objekte | Nein, **bis Ü1** (12 Monate) |
| **2 — Doku-Einsicht eines real erbrachten (ggf. vergangenen) Auftrags** | Abs. nach Tab. 1 (§610-Logik) | „besondere Fälle" (z. B. Entfernung, **transiente Veranstaltung**); **einmalig pro 3-Jahres-Zyklus**; Lücke in Doku = **Mangel** | Ja, aber rückblickend per Doku |
| **3 — echte Vor-Ort-Prüfung** | §4.4.2 Abs. 1+2 | Standard | Ja, live |

**Wichtig (Konfliktauflösung):** Weg 2 ist auf **„einmalig pro Zyklus"** begrenzt. Der **Erstaudit-Doku-Pfad (Weg 1, §4.4.2 Abs. 2+3) ist davon ausdrücklich ausgeschlossen** (Wortlaut: „Von dieser Anforderung ist die Regelung für die Erstauditierung nach 4.4.2, Absatz 2 und 3 ausgeschlossen.") → **die beiden Doku-Wege konkurrieren NICHT** um dasselbe „eine pro Zyklus".
**Weg 1 — Bedingungen:** Vertragsprüfung + Objektprüfung spätestens mit Ü1; **Anforderungsprofil** beim Erstaudit mind. als **Mustervorlage** (77200-1 Anh. A, ANMERKUNG 2); stellt der AG kein Sicherheitskonzept, darf das **Einsatzkonzept auf Grundlage des Leistungsverzeichnisses** erstellt werden.

## 14. Quoten-Logik je SDL (DIN 77200-3, Tabelle 1)
- **Pro SDL eigene Basis:** % der in der **jeweiligen eigenständig erbrachten SDL** eingesetzten SMA — **nicht** SDL-übergreifend.
- Werte: Alarm/Empfang/Kontrolldienst(stat./mobil)/Revier/Intervention **35/60** · Veranstaltung(en) **20/40** · ÖPV/Objekte/Flüchtling **30/60** (Erst/Rezert).
- Mindestumfang = **aufgerundet** auf nächsthöhere ganze Zahl; geprüft per **Stichprobe** aus Mmin.
- **„Qualifiziert" ist SDL-spezifisch im Inhalt** (Asyl-SMA braucht 40-UE-Einsatzkräfteschulung; Empfangsdienst-SMA das Empfangsdienst-Profil). Eine Person in mehreren SDLs zählt in **jeder** Basis und braucht **jede** Qualifikation.
- **Subunternehmer >50 %** der SDL → **keine Zertifizierung**.
- **Nicht verwechseln:** Mindestauditzeit (Tabelle 2) nutzt die **Summe aller SMA über alle SDL** — das ist nur die Stundenberechnung, nicht die Quote.

## 15. Offene DEKRA-Prüfpunkte (Zertifizierer-Auslegung, EC-10 — nicht behaupten)
- **Doku-Basis-Entfall auch für Teil-1-SDL** (Empfang/Kontrolldienst): Norm-Wortlaut nennt 77200-1; Mark „ziemlich sicher", **noch nie angewandt** → bestätigen lassen.
- **„Schulungen nur *geplant*" (statt durchgeführt)** beim Doku-Basis-Erstaudit für die im Scope befindlichen Personen: **von Mark NIE so gemacht, unbestätigte Annahme** → strikt offen.
- **„Vergangenes Event als Referenzprojekt"** (Weg 2): Bezeichnung/Anwendung mit DEKRA absichern (real angewandt bei „Schutzritter", Veranstaltungsdienst).

---

*Änderungshistorie:*
- *v2 (2026-06-07) — Erstfassung mit §-genauen Werten aus 77200-1:2022-10 / -2:2020-07 / -3:2020-07, bestätigt durch Mark. Ersetzt die in den Bridge-Docs referenzierte (nicht angelegte) v1.*
- *v2 (2026-06-07, Erg.) — §12 Zyklus, §13 Erstaudit-Einstiegswege (3 Wege + Ausschluss-Klausel), §14 Quoten-Logik je SDL, §15 offene DEKRA-Punkte ergänzt.*
