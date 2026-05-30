---
type: standard_module
standard: DIN 77200-1
module: Anforderungsprofile
module_id: requirements_profile
status: active
language: de
source_status: curated
knowledge_standard: CEKS_v1
parent_standard: DIN 77200-1
knowledge_path: knowledge/1_standards/DIN 77200-1/Anforderungsprofile.md
source_documents:
  - inputs/raw_standards/din/DIN_77200_1_2022
  - inputs/raw_standards/din/DIN_77200_2_2020
norm_references:
  - "4.10"
  - "4.11"
  - "4.12"
  - "4.14.2"
  - "4.19.1"
  - "4.19.2"
  - "4.23"
  - "Anhang A"
  - "Anhang C"
related_modules:
  - qualification_requirements
  - site_instruction
  - further_training
  - required_documents
  - audit_evidence
  - leadership_requirements
related_processes:
  - auftrags_angebotsprozess
  - personalauswahl_qualifikation
  - einsatzplanung_fuehrung
  - weiterbildungsplanung
  - qualitaetsmanagement_audit
related_document_types:
  - anforderungsprofil
  - dienstanweisung
  - einsatzkonzept
  - angebotsdokumentation
  - sicherheitskonzept
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
  - anforderungsprofil
  - anhang_a
  - anhang_c
  - profil_first
  - tabelle_a1
created_for: cert_expert_ai
---

# Anforderungsprofile

Master-Modul: [[overview]] · Taxonomie: **Normative Anforderungen**

---

## Zweck

Festlegung, wie Cert-Expert das **Anforderungsprofil** nach DIN 77200-1:2022-10 (4.11) als **zentrales Steuerungsdokument** interpretiert, erstellt, abstimmt, prüft und **auditierbar bewertet** — **profil-first**, nicht SDL-first.

Das Modul verbindet **Vertrag**, **Anhang A** (77200-1), **Anhang C** (77200-2), **Qualifikation**, **Dienstanweisung**, **Weiterbildung**, **Personaleinsatz** und **Angebotsprozess** in einer durchgängigen Logik.

---

## Schichtenmodell

| Schicht | Inhalt |
|---------|--------|
| **Normpflicht** | 4.11 — Absprache AG/AN; Vertragsbestandteil; jährliche Prüfung; Nachweis der Personalpassung |
| **Audit-Nachweis** | Profil vorhanden, aktuell, Tätigkeiten benannt; Abgleich Profil ↔ Personal ↔ DI ↔ Einsatz |
| **Cert-Expert Best Practice** | Qualifikationsmatrix Profil → Tabelle A.1; Profil-Prüfprotokoll; Themenmatrix Profil → Weiterbildung |

---

## Normkontext 4.11

| Anforderung | Norminhalt (interpretiert) | Normanker |
|-------------|---------------------------|-----------|
| **Inhalt** | Im Profil sind **in Absprache zwischen AG und AN** die zu erbringenden SDL mit den **jeweils erforderlichen Tätigkeiten** festzulegen — **wie in Anhang A dargestellt** | 4.11 Satz 1 |
| **Vertragsbezug** | Das erstellte Anforderungsprofil ist **Vertragsbestandteil** | 4.11 Satz 2 |
| **Aus-/Weiterbildung** | Profil bildet Grundlage für Bestimmung des **Einweisungs-, Aus- und Weiterbildungsbedarfs** | 4.11 Satz 2 |
| **Nachweis Personalpassung** | AN muss **jederzeit** nachweisen können, dass eingesetzte SMA dem Profil **entsprechen**; auf Verlangen des AG einschließlich Aus-/Weiterbildungspläne | 4.11 Satz 3; 4.14.2 |
| **Aktualität** | Profil ist hinsichtlich Aktualität **mindestens jährlich** zu überprüfen und **ggf. zu präzisieren** | 4.11 Satz 4 |

**Verwandte Normanker (nicht 4.11, aber profilzentriert):**

| Thema | Bezug zum Profil | Normanker |
|-------|------------------|-----------|
| Vertrag | DI ist Vertragsbestandteil; Profil vertraglich verankert | 4.10 |
| Personalauswahl | Auswahl **auf Grundlage des mit dem AG abgestimmten Anforderungsprofils** | 4.14.2 |
| Dienstanweisung | DI operationalisiert vereinbarte Tätigkeiten — **primär aus Profil** (ggf. EK) | 4.12 |
| Angebot | AG **sollte** u. a. **Vorliegen eines auftragsspezifischen Anforderungsprofils nach 4.11 und Anhang A** festlegen | 4.23 |
| Qualifikation | Mindestqualifikation je Tätigkeit — Ableitung über Anhang A | 4.19.1, Anhang A |
| Weiterbildung | Bedarf aus **Verwendung** (Profil/Tätigkeit) | 4.19.2 |

*Kein Normvolltext in diesem Modul — Primärquelle: `source_documents`.*

---

## Rolle im Gesamtsystem — Profil-first

Das Anforderungsprofil ist der **vertragliche Drehpunkt** zwischen Planung (AG/AN), Personal, Dokumentation und Audit. **Nicht** die SDL-Bezeichnung allein steuert Leistung, Qualifikation oder DI — sondern die **konkret vereinbarten Tätigkeiten** im Profil.

```
Vertrag (4.10)
  → Anforderungsprofil (4.11) — Absprache AG/AN, Anhang A / ggf. Anhang C
    → Qualifikation / Personalauswahl (4.14.2, 4.19.1)
    → Weiterbildungsbedarf (4.19.2)
    → (ggf. SK/EK — kontextabhängig, siehe [[Erforderliche Dokumente]])
    → Dienstanweisung (4.12)
      → Einweisung (4.25)
        → Leistungserbringung
          → Audit: Profil ↔ Personal ↔ DI ↔ Vor-Ort
```

**Profil-first-Regeln (Cert-Expert):**

| Regel | Bedeutung |
|-------|-----------|
| **Profil vor SDL** | Zuerst Tätigkeiten und Stufen im Profil klären — SDL liefert nur **Spaltenkontext** in Tabelle A.1 |
| **Profil vor Qualifikation** | Stufe B/C nur, wenn Profil-Tätigkeit es erfordert — siehe [[Qualifikationsanforderungen]] |
| **Profil vor DI** | DI darf vereinbarte Tätigkeiten nicht unterschreiten — siehe [[Dienstanweisungen]] |
| **Profil vor Einsatzplan** | 4.14.2 — Auswahl SMA nach **abgestimmtem** Profil |
| **Profil vor Weiterbildung** | 4.19.2 Bedarf aus **Verwendung** — Profil-Tätigkeiten, nicht SDL-Slogan |

**Abgrenzung zu anderen Dokumenten:**

| Dokument | Funktion | Verhältnis zum Profil |
|----------|----------|------------------------|
| **Anforderungsprofil** | Vertragliche Tätigkeits- und Qualifikationsfestlegung | **Steuernd** |
| **Sicherheitskonzept (SK)** | AG-Planungsgrundlage (77200-2: **muss**) | **Upstream** — AN leitet Profil ab, ersetzt es nicht |
| **Einsatzkonzept (EK)** | Operative Planung (77200-2: **muss**; 77200-1: kontextabhängig) | **Ergänzung** — DI primär aus Profil möglich |
| **Dienstanweisung** | Operative Alltagsregeln am Objekt | **Downstream** — Konkretisierung |
| **Qualifikationsmatrix** | Profil → Tabelle A.1 → SMA | **Audit-Hilfsmittel** (Best Practice) |

---

## Zusammenhang mit Anhang A (DIN 77200-1)

**Anhang A (normativ)** enthält die **tabellarische Referenz** für Anforderungsprofile: charakteristische **Tätigkeiten** im Kontext der Norm-SDL mit **Qualifikationsstufen A/B/C** (**Tabelle A.1**).

| Element | Rolle |
|---------|-------|
| **Einleitung / Kap. 1** | SDL-Begriffe; Anhang A als Basis zur Festlegung des Leistungsumfangs in Absprache mit dem AG oder für Ausschreibungen |
| **Tabelle A.1** | Zeilen = Tätigkeitsgruppen (Nr. 1–21); Spalten = SDL-Typen (Alarm, Empfang, Kontrolle stationär, Revier, Intervention, Kontrolle mobil, Veranstaltung) |
| **Stufen A/B/C** | Mindestqualifikation **je Tätigkeit** in der jeweiligen SDL-Spalte — **nicht** pauschal je SDL |

**SDL-Spalten ↔ Cert-Expert-SDL** — vollständiger Index: [[overview#Anhang A (normativ) — Anforderungsprofile]].

**Praxis der Profil-Erstellung (77200-1):**

1. **SDL-Kontext** benennen (welche Spalte(n) in Tabelle A.1 relevant sind).
2. **Tätigkeiten** auswählen, die vertraglich erbracht werden (Zeilen-Nr. 1–21).
3. **Stufen A/B/C** je ausgewählter Tätigkeit aus Tabelle A.1 übernehmen oder — soweit Anhang A es zulässt — **individuell erhöhen** (AG-Sonderanforderung).
4. Ergebnis im **auftragsspezifischen Profil** dokumentieren (nicht nur „Kontrolldienst“ ohne Tätigkeitsliste).

**Wichtig:** Anhang A ist **Normreferenz und Planungshilfe** — das **vertragliche** Profil ist das **auftragsspezifische** Dokument nach 4.11. Ein SDL-Name ohne Tätigkeitsbezug genügt **nicht**.

---

## AG/AN-Abstimmung

| Aspekt | Normlage | Cert-Expert-Interpretation |
|--------|----------|----------------------------|
| **Wer** | AG und AN gemeinsam | Beide Parteien — Profil ist kein einseitiges AN-Dokument |
| **Wie** | **In Absprache** (4.11) | Schriftliche Festlegung empfohlen; Form kann Vertrag/Ausschreibung regeln (4.23) |
| **Was** | SDL + **erforderliche Tätigkeiten** nach Anhang A | Konkrete Tätigkeitsliste, nicht nur Leistungsbezeichnung |
| **Wirkung** | **Vertragsbestandteil** | Ohne Profil keine belastbare Qualifikations- und DI-Basis |
| **Nachweis** | AN muss Personalpassung **jederzeit** belegen; AG kann Aus-/WB-Pläne verlangen | Audit-Stichprobe: Profil → Personalakte → Einsatzplan |

**Typischer Ablauf:**

```
Ausschreibung / Bedarf AG
  → Vorlage Anhang A / Tabelle A.1 (Planung)
  → AN erstellt Profilentwurf (Tätigkeiten, Stufen, SDL-Bezug)
  → Abstimmung AG ↔ AN (ggf. Iteration)
  → Profil als Vertragsbestandteil (4.10, 4.11)
  → Ableitung DI, Personalplan, Angebot (4.23)
```

**Abgrenzung zur DI-Freigabe:** Profil-**Absprache** (4.11) ist **nicht** identisch mit **Freigabe der abgestimmten DI** (4.23) — beides ist erforderlich, getrennt prüfbar. Siehe [[Dienstanweisungen]].

---

## Jährliche Überprüfung

| Pflicht | Inhalt | Nachweis (Audit) |
|---------|--------|------------------|
| **Mindestens jährlich** prüfen (4.11) | Aktualität, Vollständigkeit, Passung zur tatsächlichen Leistung | Profil-Prüfprotokoll mit Datum, Verantwortlichem, Ergebnis |
| **Ggf. präzisieren** | Neue Tätigkeiten, Technik, AG-Vorgaben, geänderte Gefährdung | Versionierte Profiländerung; ggf. DI-/Personal-Anpassung |
| **Kettenwirkung** | Profiländerung kann DI (4.12), Qualifikation (4.19.1), WB (4.19.2), Einsatzplan auslösen | Change-Log Profil → Folge dokumente |

**Best Practice:** Profil-Review **vor** oder **gemeinsam mit** DI-Jahresprüfung (4.12) — aber **eigenständiger** Nachweis für 4.11.

---

## Downstream-Bezüge — warum alles vom Profil ausgeht

### Qualifikation (4.19.1, 4.14.2)

- Profil definiert **welche Tätigkeiten** mit **welcher Mindeststufe** (Anhang A) erbracht werden.
- Auswahl der SMA **auf Grundlage des abgestimmten Profils** (4.14.2).
- Detail: [[Qualifikationsanforderungen]] — **immer Profil lesen, dann Tabelle A.1**.

### Dienstanweisung (4.12)

- DI **konkretisiert** die im Profil vereinbarten Tätigkeiten am Leistungsort.
- DI **kann direkt aus Profil** erstellt werden — EK nicht pauschal Voraussetzung (77200-1).
- Detail: [[Dienstanweisungen]].

### Weiterbildung (4.19.2)

- Profil liefert **Verwendungs-/Tätigkeitsbezug** für Bedarfsermittlung (4.19.2).
- Einweisung/Unterweisung zählen **nicht** als UE — Profil steuert **inhaltlichen** WB-Bedarf.
- Detail: [[Weiterbildung]].

### Personaleinsatz und Audit

- **Einsatzplan ↔ Profil ↔ Personalakte** — Stichprobe am Prüftag.
- Fehlende Passung = Vertrags- und Normthema (4.11, 4.14.2), nicht nur „Personalfrage“.
- Detail: [[Auditnachweise]] — Spur B (Auftrag/AG-Audit).

### Angebotsprozess (4.23)

AG **sollte** bei Beauftragung festlegen:

- **Vorliegen eines auftragsspezifischen Anforderungsprofils nach 4.11 und Anhang A**
- Art der Dokumentation von DI-Freigabe, Weiterbildungskonzept, Meldewesen u. a.

AN liefert im Angebot u. a. **Profilentwurf** bzw. Bezug auf abgestimmtes Profil, Qualifikationszusage und *(kontextabhängig)* Einsatzkonzept (4.23).

Detail-Dokumentenkette: [[Erforderliche Dokumente]].

---

## Abgrenzung DIN 77200-1 ↔ DIN 77200-2

| Aspekt | DIN 77200-1 | DIN 77200-2 (Kap. 5–8) |
|--------|-------------|-------------------------|
| **Profil-Referenz** | **Anhang A** — allgemeine SDL | **Anhang C** — besondere SDL (Veranstaltung bes. Relevanz, ÖPNV, Objekte, Unterkünfte) |
| **Anwendung** | Jede SDL nach Teil 1 | Nur wenn **77200-2-Tatbestand** (Einzelfallbewertung z. B. 5.1) |
| **SK/EK** | Kontextabhängig (77200-1) | SK **muss** (AG), EK **muss** (AN) — Kap. 4 |
| **Profil-Erstellung** | 4.11 + Anhang A | 4.11 **plus** profilspezifische Anforderungen **Anhang C**; AN leitet aus AG-SK ab |

**77200-2 Anhang C (normativ):**

- Enthält **eigene Anforderungsprofile** für besondere Sicherheitsdienstleistungen (Tabellen C.1–C.4 je Anwendungsgruppe).
- Ergänzt/ersetzt **nicht** die Grundlogik von 4.11 — bei 77200-2-Aufträgen sind **beide Ebenen** zu betrachten: **77200-1 (4.11, Anhang A)** und **77200-2 (Anhang C, Kap. 5–8)**.
- Zusatzqualifikationen/Schulungen in Kap. 5–8 (z. B. ÖPNV 40 UE) sind **zusätzlich** zu 4.19.2-UE — siehe [[Qualifikationsanforderungen]].

**Veranstaltung — dreifache Einordnung:**

| Kontext | Profil-Basis | SK/EK |
|---------|--------------|-------|
| **77200-1 Veranstaltungssicherungsdienst** | Anhang A, Spalte Veranstaltung | **Nicht** automatisch — Auslöser prüfen ([[Erforderliche Dokumente]]) |
| **77200-2 Kap. 5** (besondere Sicherheitsrelevanz) | Anhang C + 4.11 | SK+EK **erforderlich** |

---

## Auditnachweise

| Nachweis | Inhalt | Schicht | Normanker |
|----------|--------|---------|-----------|
| **Auftragsspezifisches Profil** | SDL, Tätigkeiten (Anhang-A-Bezug), Stufen, Sprache | N, A | 4.11 |
| **Profil-Prüfprotokoll** | Jährliche Review, ggf. Präzisierung | N, A, B | 4.11 |
| **Qualifikationsmatrix** | Profil-Tätigkeit → A/B/C → SMA | A, B | 4.11, Anhang A |
| **Personalpassungsnachweis** | Akte ↔ Profil je eingesetztem SMA | N, A | 4.11, 4.14.2 |
| **Vertragsbezug** | Profil als Vertragsbestandteil erkennbar | N, A | 4.10, 4.11 |
| **Angebots-/Ausschreibungsbezug** | AG-Festlegung Profil nach 4.11/Anhang A | A | 4.23 |
| **77200-2: Anhang-C-Profil** | Zusatz bei besonderen SDL | N, A | 77200-2 Anhang C |

**Auditor-Trace (Cert-Expert):**

```
Anforderungsprofil (aktuell?)
  → Tätigkeiten / Anhang-A-Nr. / SDL-Spalte
  → Stufen A/B/C (nur wenn relevant)
  → Personalakte der Stichprobe
  → Einsatzplan am Prüftag
  → DI-Konsistenz
  → (77200-2?) Anhang C + SK/EK
```

---

## Typische Auditorfragen

1. Zeigen Sie das **auftragsspezifische Anforderungsprofil** — wann erstellt, wann zuletzt geprüft?
2. Wie wurde das Profil **mit dem AG abgestimmt** — schriftlich, Vertragsbestandteil?
3. Welche **Tätigkeiten** (Anhang A / Tabelle A.1) sind vereinbart — nicht nur SDL-Name?
4. Welche **Qualifikationsstufen** ergeben sich daraus — und **welche SMA** weisen sie nach?
5. Wie stellen Sie sicher, dass der **Einsatzplan** zum Profil passt (4.14.2)?
6. Wie leiten sich **DI-Inhalte** aus dem Profil ab — Widersprüche?
7. Wie ermitteln Sie **Weiterbildungsbedarf** aus der Verwendung im Profil (4.19.2)?
8. Liegt **DIN 77200-2** vor — **Anhang C**, SK vom AG, EK vom AN?
9. Was passiert bei **Profiländerung** — DI, Personal, Einweisung?
10. Können Sie auf **Verlangen des AG** Personalpassung inkl. Aus-/WB-Pläne vorlegen (4.14.2)?

---

## Typische NCs

| NC | Typischer Befund | Normanker |
|----|------------------|-----------|
| NC-P01 | Anforderungsprofil **fehlt** | 4.11 |
| NC-P02 | Profil **nicht jährlich** geprüft / ohne Protokoll | 4.11 |
| NC-P03 | Profil **ohne AG-Absprache** / nicht Vertragsbestandteil | 4.11, 4.10 |
| NC-P04 | Profil nennt nur SDL — **keine Tätigkeiten** (Anhang A) | 4.11, Anhang A |
| NC-P05 | Profil **veraltet** — DI/Einsatz widersprechen Profil | 4.11, 4.12 |
| NC-P06 | Eingesetztes Personal **entspricht nicht** Profil (Stufe/Tätigkeit) | 4.11, 4.14.2 |
| NC-P07 | **77200-2** — Anhang-C-Anforderungen im Profil **nicht** abgebildet | 77200-2 Anhang C |
| NC-P08 | Stufe B/C aus **SDL-Annahme** — ohne Profilbezug | 4.11 (Cert-Expert: SDL-first-Fehler) |
| NC-P09 | Qualifikationsmatrix fehlt bei **komplexem** Profil — Audit-Hinweis | A (Best Practice) |

*NC-P01/P02 aligniert mit [[Erforderliche Dokumente]] und [[Qualifikationsanforderungen]] (NC-04).*

---

## Risiken

| Risiko | Auswirkung |
|--------|------------|
| SDL-first statt Profil-first | Falsche Qualifikation, falsche DI, falsches Angebot |
| Profil ohne Tätigkeitsliste | Nicht auditierbar; 4.11 nicht erfüllt |
| Fehlende Jahresprüfung | Veraltete Leistungszusage; Kaskaden-NC zu DI/Personal |
| 77200-2 ohne Anhang C | Unvollständige besondere SDL; Kap.-4-SK/EK-Lücke |
| Profil ≠ Einsatzrealität | Vertragsbruch; Stichprobe entlarvt Papier-Compliance |

---

## Cert-Expert-Anwendung

**Routing:** Modul **primär** laden bei Fragen zu **Anforderungsprofil, 4.11, Anhang A, Anhang C, Profil-first, Vertragsprofil, Tabelle A.1** — **vor** [[Qualifikationsanforderungen]] und [[Dienstanweisungen]], wenn der Profilinhalt noch unklar ist.

**Dokumentprodukte**

| Produkt | Nutzung dieses Moduls |
|---------|----------------------|
| **Anforderungsprofil** | Kernprodukt — Tätigkeiten, SDL-Bezug, Stufen |
| **Vorlagen (Schicht B)** | `DIN 77200-1/anforderungsprofile/` (Anhang A) · `DIN 77200-2/anforderungsprofile/` (Anhang C) |
| **Qualifikationsmatrix** | Ableitung Tabelle A.1 aus Profil |
| **Angebotsdokumentation** | Profilentwurf, 4.23-Bezug |
| **Dienstanweisung** | Downstream — Tätigkeitsumfang |
| **Weiterbildungsplan** | Bedarf aus Profil-Verwendung |
| **Einsatzplan** | SMA-Zuordnung nach Profil |

**Reviewer-Fokus:** Profil vorhanden, abgestimmt, jährlich geprüft, Tätigkeiten benannt, Downstream-Konsistenz.

---

## Bot-/RAG-Regeln

**Entscheidungslogik**

```
1. Anforderungsprofil im Kontext vorhanden?
   └─ nein → [OFFENER PUNKT]; keine Stufen/DI-Inhalte erfinden
   └─ ja  → weiter

2. 77200-2 anwendbar (Kap. 5–8)?
   └─ ja  → Anhang C + SK (AG) + EK (AN) prüfen; Anhang A ergänzend
   └─ nein → 77200-1: 4.11 + Anhang A

3. Profil enthält konkrete Tätigkeiten (Anhang-A-Bezug)?
   └─ nein → nur SDL-Name → Hinweis: unvollständig nach 4.11
   └─ ja  → Tabelle A.1 zuordnen (Spalte = SDL-Kontext)

4. Qualifikationsfrage?
   └─ Profil-Tätigkeit → Stufe A/B/C → [[Qualifikationsanforderungen]]
   └─ nie Stufe aus SDL-Typ allein

5. DI-/Einsatzfrage?
   └─ Profil-Tätigkeiten → [[Dienstanweisungen]]
   └─ SK/EK nur nach Kontext ([[Erforderliche Dokumente]])

6. Weiterbildungsfrage?
   └─ Verwendung aus Profil → [[Weiterbildung]]

7. Jahresprüfung / Aktualität?
   └─ Profil-Prüfdatum vs. DI/Personaländerungen
```

**Verbindliche Regeln**

- **Profil-first:** Immer Anforderungsprofil vor SDL, Qualifikation, DI, WB.
- **Kein Normtext** kopieren — Struktur und Anker nennen, Details `[OFFENER PUNKT]` wenn Projektinput fehlt.
- **Anhang A** = Referenzmatrix; **vertragliches Profil** = 4.11-Dokument — nicht verwechseln.
- **77200-2:** Anhang C **zusätzlich** — nicht mit 77200-1-Veranstaltung pauschal gleichsetzen.
- **SK/EK:** Profil steht in der Kette **nach** SK (wenn vorhanden), **vor** EK/DI — siehe [[Erforderliche Dokumente]].
- Bei fehlendem Profil: **Qualifikations- und DI-Bewertung aussetzen** — `[OFFENER PUNKT]`.
- Tabelle A.1 Nr. 1–21: Index in [[overview]] — nicht vollständig duplizieren.

---

## Verwandte Module

| Modul | Beziehung |
|-------|-----------|
| [[overview]] | Master-Index, Tabelle A.1-Index, CEKS-Governance |
| [[Qualifikationsanforderungen]] | Stufen A/B/C, §34a — **nach** Profil |
| [[Dienstanweisungen]] | DI aus Profil; Abstimmung/Freigabe getrennt |
| [[Weiterbildung]] | 4.19.2 Bedarf aus Profil-Verwendung |
| [[Erforderliche Dokumente]] | Dokumentenkette, SK/EK, Bot-Hub |
| [[Auditnachweise]] | Spur B, Personal-Stichprobe |
| [[Führungsanforderungen]] | Führung ≠ Profil — ergänzend 4.19.1 |

---

## Verwandte Prozesse

| Prozess | Bezug |
|---------|-------|
| Auftrags- / Angebotsprozess | Profil in Ausschreibung, Angebot, Vertrag (4.23, 4.10) |
| Personalauswahl & Qualifikation | 4.14.2 — Auswahl nach Profil |
| Einsatzplanung & Führung | Einsatzplan ↔ Profil |
| Weiterbildungsplanung | 4.19.2 — Verwendungsbezug |
| Qualitätsmanagement & Audit | Profil-Review, NC-P01 ff. |

---

## Quellen

| Quelle | Referenz |
|--------|----------|
| DIN 77200-1:2022-10 | 4.11, 4.10, 4.14.2, 4.23, Anhang A, Tabelle A.1 (`source_documents`) |
| DIN 77200-2:2020-07 | Kap. 4 (SK/EK); Kap. 5–8; **Anhang C** (`source_documents`) |
| Cert-Expert | [[overview]] — CEKS v1, Modultaxonomie |

*Kein Normvolltext. Vor Zertifizierungsentscheidungen gegen Primärquelle und vertragliches Anforderungsprofil prüfen.*

---

## Vorlagen (Cert-Expert Best Practice)

SDL-spezifische Normvorlagen (normzentriert):

| Referenz | Pfad | Master |
|----------|------|--------|
| DIN 77200-1 Anhang A | `knowledge/1_standards/DIN 77200-1/anforderungsprofile/` | `_master_77200-1.md` |
| DIN 77200-2 Anhang C | `knowledge/1_standards/DIN 77200-2/anforderungsprofile/` | `_master_77200-2.md` |

Governance/Architektur: `knowledge/1_standards/Governance/DIN 77200/`

Stufen A/B/C und Tätigkeitstexte sind in den SDL-Vorlagen **vorbelegt** (vollständiger Anhang-A- bzw. Anhang-C-Extrakt je SDL). Projektspezifisch auszufüllen: Erbringen, AG-Erhöhung, Bemerkung. Regenerierung: `scripts/generate_anforderungsprofile.py`.

Vor produktiver Nutzung sind Tätigkeitstexte und Stufen A/B/C gegen die gültige Primärquelle der DIN 77200 zu verifizieren.

---

## Offene Punkte

- [x] Cert-Expert-Vorlage Anforderungsprofil (77200-1 / 77200-2-Anhang-C-Felder) → normzentriert unter `DIN 77200-1/anforderungsprofile/` und `DIN 77200-2/anforderungsprofile/`
- [ ] Profil-Prüfprotokoll-Vorlage (jährlich, 4.11)
- [ ] Mapping Profil-Feld → Blueprint/RAG-Slots je SDL-Spalte
- [ ] Querverweis [[Subunternehmer]] — Profilparität Sub-SMA
