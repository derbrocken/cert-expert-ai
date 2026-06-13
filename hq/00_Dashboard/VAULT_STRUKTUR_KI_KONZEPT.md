# Vault-Struktur für KI & Agenten — Konzept (Entwurf, zur Entscheidung)

**Status:** TEILWEISE FREIGEGEBEN (Mark, 2026-06-11): Frontmatter-Schema verbindlich (→ `hq/CONVENTIONS.md`), Pilot an 7 Status.md umgesetzt, Inbox-Regel aktiv. GEPARKT: Bridge-Entrümpelung + Monatsdateien-Konvention (bis Executor-Session stabil), Bases-Entscheidung offen.
**Stand:** 2026-06-09 · **Owner:** Generalist (Claude)
**Abgrenzung:** Dieses Dokument ist ein **Vorschlag**, kein verbindlicher Stand. Verbindlich bleibt `ARCHITEKTUR.md`. Erst wenn Mark einzelne Punkte freigibt, werden sie umgesetzt.

---

## 0. Leitidee (der Kern in einem Satz)

> **Nicht zwei Strukturen bauen (eine für dich, eine für die KI) — sondern EINE Struktur mit einer Metadaten-Schicht, die beide Seiten konsumieren.**

Diese Schicht ist **YAML-Frontmatter** (in Obsidian = „Properties"). Für dich rendert sie als Properties-Panel + als **Bases**-Tabellen (Datenbank-Ansichten). Für Agenten ist sie deterministisch lesbar — kein Raten aus Fließtext. Eine Datei, zwei Ansichten.

---

## 1. Befund (Ist-Zustand)

**Stark (bereits vorhanden):**
- Klares System-of-Record-Modell, ein Zuhause pro Datenart, Kunden-Slug als Klebstoff (`_registry.json`, `_Verknuepfung.md`).
- Nummerierte Ordner `00–10` mit README je Ordner.
- Konsistente Akten-Struktur pro Kunde (Status / Audit_2026 / ToDos / Dokumente_und_Nachweise / Kommunikation / Lessons_Learned).
- Getrenntes Bot-Gehirn `knowledge/` mit Traceability (CL-IDs).
- Bewusste Mensch-Linse (Tagesbriefing, Leseansicht, CSS-Snippet).
- Core-Plugins **Properties** und **Bases** sind bereits aktiv — die Voraussetzung ist da, nur ungenutzt.

**Lücken (das hält „perfekt für KI" auf):**
1. **Metadaten stehen im Fließtext, nicht als Properties.** Beispiel `TeamFlex/Status.md`: Slug, Phase, Ampel, Audit-Datum als **Fettdruck**. Mensch-lesbar, aber für Agenten/Bases nicht abfragbar.
2. **Kein kontrolliertes Vokabular.** Die Trennung aus der globalen CLAUDE.md (Vorlage / Kundendokument / Schulung / Teilnahmebescheinigung / Zertifikat / Auditnachweis / Mitarbeiterakte) ist nirgends maschinenlesbar fixiert.
3. **`08_Vorlagen` ist leer** (00_Checklisten, 01_Auditarten, 02_Normen, 03_Kundenprojekt_Templates). → Vorlagen-Drift: jede neue Akte kann anders aussehen.
4. **`10_Bridge` überladen** (~25 `CURSOR_*_AUFTRAG`-Einmaldateien neben dauerhaften Verträgen). Verwässert die Agenten-Suche.
5. **Kein Agenten-Regelwerk** (`CONVENTIONS.md`): wie ein Agent Notizen liest, schreibt, benennt, taggt.

---

## 2. Soll-Zustand

### 2.1 Frontmatter-Schema je Notiztyp

**Pflichtfelder in JEDER Notiz (gemeinsamer Kern):**

```yaml
---
type:        # kontrolliert, s. 2.2
title:       # Klartext
status:      # kontrolliert, s. 2.2
updated:     # YYYY-MM-DD
tags: []     # kontrolliert, s. 2.3
---
```

**Typ-spezifische Zusatzfelder (Beispiele):**

`type: kundenstatus`
```yaml
slug: TeamFlex            # join key → _registry.json
phase: aktiv
projekttyp: ueberwachungsaudit-din77200
ampel: rot                # gruen | gelb | rot
audit_datum: 2026-06-12
zert_stelle: DEKRA
```

`type: wissen`
```yaml
quelle: "Instagram / BG BAU / DGUV …"
relevanz: strategie       # strategie | schulung | vertrieb | vorlage | audit
scope_status: offen       # offen | in-scope | verworfen
clause_ids: []            # nur wenn Normbezug
```

`type: vorlage`
```yaml
vorlagen_klasse: kundenprojekt   # checkliste | auditart | norm | kundenprojekt
norm_bezug: DIN-77200-2
clause_ids: [CL-..]
```

`type: auftrag` (Bridge)
```yaml
owner: G                  # G | T | M
auftrag_status: offen     # offen | laeuft | wartet | fertig
commit: ""                # Hash bei fertig
```

### 2.2 Kontrolliertes Vokabular

**`type`** (genau diese Werte, sonst nichts):
`dashboard · kundenstatus · kundendokument · auftrag · wissen · vorlage · schulung · teilnahmebescheinigung · zertifikat · auditnachweis · mitarbeiterakte · norm · readme · konzept`

> Spiegelt 1:1 die Daten-Trennung aus der globalen CLAUDE.md — jetzt maschinenlesbar.

**`status`** (generisch): `aktiv · offen · wartet · fertig · archiv · entwurf`

**Eingehende Nachweise** (Guardrail EC-10): immer `pruef_status: unchecked` bis manuell geprüft. Kein Agent setzt „grün/qualifiziert/auditfähig" automatisch.

### 2.3 Tag-Vokabular (flach, klein halten)

`#kunde #audit #norm #schulung #vertrieb #strategie #finanzen #tool #wissen #privat`

Regel: Tags beschreiben **Thema**, `type` beschreibt **Form**. Nicht vermischen.

### 2.4 Naming & Slugs

- **Kunden-Slug** ist und bleibt der Klebstoff über alle Systeme (Repo/Airtable/OneDrive/Tool).
- **Rollende Monatsdateien** (`Operations_Board_Juni_2026`, `Angebote_Juni_2026`, `Offene_Juni_2026`): Konvention festlegen — *eine* aktuelle Datei ohne Monat (`Operations_Board.md`) + datierte Schnappschüsse nur im Archiv. Sonst wächst die Liste monatlich.
- Maschinen-Dateien mit `_`-Präfix (`_registry.json`, `_airtable_cache.json`) bleiben so — gute Konvention.

### 2.5 Deine Ansicht = Bases (statt Build-Skript)

Mit Properties + dem schon aktiven **Bases**-Plugin baust du Datenbank-Ansichten direkt in Obsidian:
- „Alle `kundenstatus` mit `ampel: rot` und `audit_datum` < 14 Tage."
- „Alle `wissen` mit `scope_status: offen`."
- „Alle `auftrag` mit `auftrag_status: offen`, gruppiert nach `owner`."

Das ersetzt schrittweise `build_dashboard.py` — weniger Python-Pflege, dieselbe Quelle.

### 2.6 Agenten-Regelwerk (`CONVENTIONS.md`)

Eine Datei, die jeder Agent zuerst liest: das Frontmatter-Schema, das Vokabular, Schreib-Regeln (immer Frontmatter setzen, `updated` pflegen, nie `type`/`status` außerhalb des Vokabulars, EC-10/CL-ID-Guardrails). = der Unterschied zwischen „ordentlich" und „perfekt für KI".

---

## 3. Hygiene (billig, additiv)

- **`08_Vorlagen` materialisieren:** eine echte Kundenprojekt-Vorlage mit Frontmatter → jede neue Akte identisch.
- **`10_Bridge` entrümpeln:** erledigte `CURSOR_*_AUFTRAG` → `09_Archiv` oder `10_Bridge/_auftraege_erledigt/`. Dauerhafte Verträge (HANDOFF, AUFGABEN, GESCHAEFTSMODELL, TALLY_FIELD_MAPPING, DEKRA_SLOT_MAP) bleiben.
- **`scripts/__pycache__`** (.pyc) per `.gitignore` ausschließen.

---

## 4. Migrationspfad (falls/ wenn freigegeben — gestaffelt, reversibel)

1. `CONVENTIONS.md` + Schema schreiben (Fundament, ändert nichts Bestehendes).
2. Pilot: die 7 `Status.md` mit Properties nachrüsten + 1 Bases-Tabelle als Beleg.
3. Vorlagen in `08_Vorlagen` materialisieren.
4. Bridge entrümpeln.
5. Schrittweise Frontmatter in `wissen`, `auftrag`, Dashboards nachziehen.
6. Optional: `build_dashboard.py` durch Bases-Ansichten ablösen.

**Jeder Schritt einzeln, additiv, jederzeit stoppbar — passt zu „kleine konkrete Schritte, kein Overengineering".**

---

## 5. Caveats (verbindlich beachten)

- **Kundenakten NICHT jetzt umbauen.** Laut `CONTEXT.md` wandern sie in ~2 Monaten ins Certification OS. Frontmatter ist additiv (okay), aber kein Restructure von `03_Kundenprojekte`.
- **Keine erfundenen Normpflichten.** Norm-Felder nur mit CL-ID aus dem Klausel-Register.
- **EC-10:** kein automatischer „auditfähig/qualifiziert"-Status; eingehende Nachweise = `unchecked`.
- **C-10:** Architektur-/Scope-Änderungen nur über Gate mit Mark.

---

## 6. Offene Entscheidungen (für Mark)

1. Frontmatter-Schema verbindlich machen — ja/nein?
2. Bases als deine neue Haupt-Ansicht — testen, oder beim `build_dashboard.py` bleiben?
3. Reihenfolge der Migration (oder bewusst nur Fundament jetzt, Rest später)?
4. Rollende-Monatsdateien-Konvention — übernehmen?

> Pointer in `WISSEN.md` gesetzt. Umsetzung erst nach deiner Freigabe je Punkt.
