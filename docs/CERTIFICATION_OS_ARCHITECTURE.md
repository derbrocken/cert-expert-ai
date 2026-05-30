# Cert-Expert — Certification OS (Produktvision)

**Version:** 1.0  
**Stand:** 2026-05-30  
**Status:** Strategisches Referenzdokument (Entwicklung) — **kein** Norm-Wissensmodul

**Abgrenzung:** Fachnorm und CEKS-Logik liegen unter `knowledge/1_standards/`. Dieses Dokument beschreibt die **Software-Produktarchitektur** des Zertifizierungsbetriebssystems.

**Verwandte Dokumente:** `docs/PROJECT_ARCHITECTURE.md` (Bot↔Portal-Grenze) · `docs/ARCHITECTURE.md` (Dokumentenbot-Pipeline) · `knowledge/1_standards/Governance/DIN 77200/CURRENT_STATE.md` (CEKS-Ist-Stand)

---

## 1. Zweck

Cert-Expert ist **kein** klassisches QM-Tool und **kein** reiner Dokumentengenerator.

Es ist ein **spezialisiertes Zertifizierungsbetriebssystem** für Sicherheitsunternehmen: Normen, SDLs, Projekte, Personen, Nachweise und Freigaben werden in **einem** geführten Prozess verbunden — von der Vorbereitung bis zur Audit-Readiness und darüber hinaus zur Überwachung.

Die Software macht den Zertifizierungsbetrieb **steuerbar**, nicht nur dokumentierbar.

---

## 2. Produktkern

Die Kernlogik verknüpft Norm, Einsatz und Person über Nachweise und Freigaben:

```
Norm
  → SDL
  → Leistungsort / Projekt
  → Führungskraft
  → SMA (Sicherheitsmitarbeiter)
  → Qualifikation
  → Schulung / Unterweisung
  → Nachweis
  → Frist
  → Freigabe
  → Auditfähigkeit
  → Überwachung
```

Jeder Schritt erzeugt **prüfbare Zustände** (vorhanden, gültig, abgelaufen, blockiert, freigegeben) — nicht nur Dateien in Ordnern.

**CEKS-Bezug (Knowledge, nicht Portal):** Qualifikationsmatrix und Freigabekette (`04` → `05` → `06` → `07`) definieren die fachliche Logik; Tool 2 bildet sie später in der Projektakte ab (`08` Domänenmodell).

---

## 3. Hauptziel

**Audit-Readiness** muss **sichtbar und steuerbar** sein.

Das System zeigt jederzeit:


| Frage                         | Erwartete Antwort im System                         |
| ----------------------------- | --------------------------------------------------- |
| Was fehlt?                    | Lücken zu Norm, Projekt, Person, Nachweis           |
| Was läuft ab?                 | Fristen, Gültigkeiten, WB, Ersthelfer, Einweisungen |
| Was ist auditkritisch?        | Priorisierte Risiken / offene Pflichten             |
| Was blockiert?                | Blocker vor Freigabe oder Audit                     |
| Was ist freigegeben?          | Person-, SDL-, Einsatz- und Dokumentfreigaben       |
| Was muss noch geprüft werden? | Offene QA, Review, menschliche Freigabe             |


Audit-Readiness ist ein **Zustand**, kein einmaliger PDF-Export.

---

## 4. Portalrollen

Das Portal ist **rollenbasiert** — nicht jeder sieht alles.


| Zugang                               | Sicht (typisch)                                                              | Nicht (typisch)                                       |
| ------------------------------------ | ---------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Kundenzugang**                     | eigene Projekte, Aufträge, freigegebene Dokumente, Maßnahmen, Rückfragen     | fremde Kunden, interne SMA-Akten, Admin-Konfiguration |
| **Cert-Expert / Admin**              | Kunden, Normen, SDLs, Vorlagen, Freigaben, Audit-Ordner, KPIs, Bot-Auslösung | uneingeschränkter Ersatz für Auditorentscheidungen    |
| **Auditorenzugang** (perspektivisch) | definierter Auditordner, Nachweispaket, freigegebene Unterlagen              | Bearbeitung von Stammdaten, HR-Details ohne Freigabe  |


**Prinzip:** Sichtbarkeit folgt Rolle, Projekt und Freigabestatus — nicht „ein Login für alles“.

---

## 5. Kernmodule

Übergreifende fachliche Module des Certification OS (ohne technische Zerlegung):


| Modul                                    | Funktion                                                  |
| ---------------------------------------- | --------------------------------------------------------- |
| **Kunden**                               | Mandanten, Verträge, Zugänge                              |
| **Projekte**                             | Leistungsorte, Aufträge, Leistungsumfang                  |
| **Normen**                               | Referenzrahmen (z. B. DIN 77200, ISO, branchenspezifisch) |
| **SDLs**                                 | Sicherheitsdienstleistungen, Anforderungsprofile          |
| **Mitarbeiter / SMA**                    | Einsatzkräfte, Rollen, Verfügbarkeit (ohne HR-Kern)       |
| **Führungskräfte**                       | Einsatz-/Objekt-/Schichtleitung, FK-Anforderungen         |
| **Qualifikationen**                      | Codes, Matrix, Stufen, Zusatzanforderungen                |
| **Schulungen**                           | Pflicht- und SDL-Schulungen, Termine, Nachweise           |
| **Unterweisungen**                       | objekt- und einsatzbezogen (EW-OBJ, EW-EINS)              |
| **Nachweise**                            | Zertifikate, Listen, Protokolle, Gültigkeit               |
| **Projektakten**                         | zusammengehörige Unterlagen je Projekt/Auftrag            |
| **Dokumente**                            | erzeugte und freigegebene QM-/Einsatzdokumente            |
| **Maßnahmen**                            | Korrektur, Verbesserung, Nachverfolgung                   |
| **Interne Audits**                       | Planung, Feststellungen, Umsetzung                        |
| **Managementbericht**                    | Auswertung, KPIs, Management-Review                       |
| **Auditordner / DEKRA-Ordner**           | strukturiertes Paket für externes Audit                   |
| **Audit-Readiness**                      | aggregierter Status, Lücken, Ampeln                       |
| **Überwachungsaudit / Rezertifizierung** | Zyklus nach Erstzertifizierung                            |


Module hängen am **Produktkern** (Abschnitt 2) zusammen — Daten und Dokumente sind Instanzen, Logik ist Prozess.

---

## 6. Tool-1-Rolle

**Tool 1** erzeugt und standardisiert **QM-/IMS-Dokumentation** auf Firmen- und Systemebene.


| Leistung                   | Beschreibung                        |
| -------------------------- | ----------------------------------- |
| Blueprint-Dokumente        | Vorlagen nach Dokumenttyp           |
| Platzhalterersetzung       | Firmen- und Metadaten               |
| Layout                     | Kopf-/Fußzeile, Logo, Versionierung |
| Dokumentenstandardisierung | einheitliches Erscheinungsbild      |


Tool 1 ist ein **Modul** im Gesamtprozess — **nicht** das Gesamtprodukt. Es liefert dokumentierte Systemgrundlagen; Projekt- und Personenlogik liegen in Tool 2 und den Bots.

**Technischer Ist-Stand (Repo):** Legacy-Referenz `legacy_tools/document creater`; neue Pipeline nutzt `shared/renderer/` und Blueprints — siehe `docs/ARCHITECTURE.md`.

---

## 7. Tool-2-Rolle

**Tool 2** ist das **Mitarbeiter-, Nachweis- und Freigabemodul** innerhalb des Certification OS.


| Leistung                              | Beschreibung                                    |
| ------------------------------------- | ----------------------------------------------- |
| Mitarbeiterakten                      | Personenbezogene Dokumente und Historie         |
| Qualifikationsnachweise               | Codes, Gültigkeit, Portfolio                    |
| Schulungs- und Unterweisungsnachweise | inkl. EW-OBJ / EW-EINS                          |
| Freigaben                             | Personalfreigabe, SDL-Freigabe, Einsatzfreigabe |
| Fristen und Gültigkeiten              | Ablauf, Erinnerung, Blocker                     |


Tool 2 setzt die **CEKS-Freigabelogik** um (Knowledge `05`–`07`, Domäne `08`) — ohne die Norm im Portal neu zu definieren.

**Technischer Ist-Stand (Repo):** Legacy-Referenz `legacy_tools/employee file creater`; **keine** Implementierung im Knowledge-Standard — bewusst nach Domänenmodell.

---

## 8. Dokumentenbots

**Fachbots** erzeugen **individuelle, auditnahe** Dokumenteninhalte — strukturiert, nicht als freier Chat.


| Bot / Produkt          | Output (Beispiele)                         |
| ---------------------- | ------------------------------------------ |
| Gefährdungsbeurteilung | GB-Abschnitte, Platzhalter-JSON            |
| Sicherheitskonzept     | SK-Inhalte                                 |
| Einsatzkonzept         | EK-Inhalte                                 |
| ODA                    | Objektdienstanweisung                      |
| Anforderungsprofile    | profilbezogene Struktur (Generator / CEKS) |


**Ablauf:**

```
Strukturierter Input (+ optional Upstream)
  → CEKS / knowledge als Regel- und Kontextbasis
  → Bot (Qwen, regelgebunden)
  → QA (offene Punkte, qa_status)
  → strukturierter Output → Tool 1 / Projektakte
```

Bots **ersetzen** weder menschliche Freigabe noch Tool 2. Siehe `docs/CURSOR_BRIEFING.md`, `docs/BLUEPRINT_ARCHITECTURE.md`.

---

## 9. Audit-Garantie / menschliche Freigabe

Die Software **ersetzt nicht** das Cert-Expert-Fachurteil.

Menschliche Freigabe bleibt **pflichtig** bei:

- finalem **Audit-Ready-Status**
- **Scope-Entscheidungen** (Norm, SDL, Projektumfang)
- **Sonderfällen** und dokumentierten Abweichungen
- **DEKRA- / Auditorenkommunikation** und Freigabe des Auditordners
- **finaler Dokumentenfreigabe** (Bot-Output mit `review_required`)
- **kritischen Mitarbeiter- und Projektfreigaben** (Person, SDL, Einsatz)

Das System **unterstützt** Entscheidungen (Nachweise, Blocker, Status) — es **trifft** sie nicht autonom.

---

## 10. Produktstrategie und Ausbaulogik

Cert-Expert wird **schrittweise** entwickelt. Ziel ist nicht, sofort das vollständige Zielsystem zu bauen.

Die Entwicklung folgt dem **Pareto-Prinzip**: Zuerst werden Funktionen umgesetzt, die den größten Einfluss auf **Zertifizierungsfähigkeit**, **Audit-Readiness** und **Überwachungsaudits** haben.

| Prinzip | Bedeutung |
|---------|-----------|
| **Phase 1 ≠ Endprodukt** | Viele Module sind bewusst **nicht** Teil von Phase 1 — können aber **langfristig** zum Certification OS gehören |
| **Kern bleibt** | Zertifizierungsbetrieb, Nachweise, Freigaben, Audit-Readiness — unabhängig vom Ausbau |
| **Bots** | Geschlossene Fachbots (kein freier Chat) — über alle Phasen, siehe Abschnitt 8 |
| **Fachurteil** | Software ersetzt nicht Cert-Expert-Entscheidungen — dauerhaft, siehe Abschnitt 9 |

Was in Phase 1 **zurückgestellt** wird (z. B. vollständige Einsatzplanung, Wachbuch als Kern, Lohn/HR-Tiefe), ist **Priorisierung**, kein generelles Verbot.

---

## 11. Phase-1-Fokus

Phase 1 konzentriert sich auf:

- **Erstzertifizierungen**
- **Erweiterungsaudits**
- **Überwachungsaudits**
- **Rezertifizierungen**
- **Audit-Readiness** (sichtbar, steuerbar)
- **Mitarbeiter- / Nachweis- / Freigabelogik** (Tool 2, CEKS `05`–`07`)
- **Dokumentenerstellung** (Tool 1, Dokumentenbots)
- **Projekt- und SDL-bezogene Anforderungen** (Profile, SK/EK/ODA, Projektakten)

**Besonders gut in Phase 1:**

1. Audit-Readiness sichtbar machen — Lücken, Fristen, Blocker, Freigabestatus
2. Mitarbeiterakten ordnen — Nachweise, Schulungen, Unterweisungen, Qualifikationen
3. Tool 1, Tool 2 und Dokumentenbots in einen **geführten Zertifizierungsprozess** einbinden (`docs/PROJECT_ARCHITECTURE.md`)

Phase 1 ist **kein** vollständiges Branchen-ERP — sondern ein belastbares **Zertifizierungsbetriebssystem** mit klarem Audit-Fokus.

---

## 12. Langfristige Vision

Langfristig kann Cert-Expert zu einem **umfassenderen Betriebssystem für Sicherheitsunternehmen** ausgebaut werden — auf Basis des Zertifizierungskerns (Abschnitt 2).

Nach der Erstzertifizierung läuft das Portal weiter: Überwachungsaudits, Fristen, neue Mitarbeiter und Projekte, Schulungen, Unterweisungen, Maßnahmen, KPIs, Managementbericht, durchgängige Auditfähigkeit.

**Perspektivisch** können zusätzlich dazugehören (Auswahl, nicht abschließend):

- digitales **Wachbuch**
- **Melde- und Berichtswesen**
- **Schulungs- und E-Learning-Plattform**
- **Lieferantenmanagement**
- **Dienstkleidung**
- **Funkgeräteverwaltung**
- **Einsatz- und Objektmanagement** (inkl. Planungsanbindung)
- **Partnerintegration**
- **FASI- und Betriebsarztprozesse**
- **Versicherungsmanagement**
- weitere **branchenspezifische Module**
- Anbindung **allgemeiner QM-/IMS-Funktionen**, wo audit- und kundenrelevant

**Umsetzung:** Nicht alles muss selbst entwickelt werden. Ein Teil entsteht als **eigene Module**, ein Teil als **Integration** bestehender Systeme (z. B. HR, Einsatzplanung).

**Priorisierung** für spätere Phasen:

| Kriterium | Frage |
|-----------|--------|
| Kundennutzen | Entlastet der Kunde den Zertifizierungs- und Betriebsalltag messbar? |
| Audit-Relevanz | Verbessert es Nachweisführung oder Audit-Readiness? |
| Skalierungspotenzial | Trägt es viele Kunden / SDLs ohne Sonderlogik? |
| Order-to-Cash-Relevanz | Unterstützt es Akquise, Vertrag, Abrechnung? |

Das Produkt bleibt ein **Betriebssystem für den Zertifizierungs- und Betriebszyklus** — Phase 1 legt den auditfesten Kern, der Ausbau erweitert die operative Tiefe.

---

## Implementierungsgrenze (dieses Dokument)


| Enthalten                                    | Nicht enthalten              |
| -------------------------------------------- | ---------------------------- |
| Produktvision, Module, Rollen, Tool-1/2/Bots | Datenbankschema, Tabellen    |
| Audit-Readiness als Zielbild                 | API-Spezifikation            |
| Abgrenzung zu CEKS `knowledge/`              | Code, Migration, neue Ordner |


**Nächste technische Schichten** (separat zu planen): Portal-UI, Storage, Service-Grenzen Bot-Engine — `docs/PROJECT_ARCHITECTURE.md`, `docs/INPUT_ARCHITECTURE.md`.