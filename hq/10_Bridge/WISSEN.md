# WISSEN — Lern- & Notizspeicher (Bridge)

**Zweck:** Dinge, die hängenbleiben — aus Videos, Artikeln, Gesprächen, Ideen. **Kein To-do, keine Aktion.** Dauerhaft, aber noch nicht kuratiert.

**Abgrenzung:**
- Aktion nötig? → als Aufgabe nach `AUFGABEN.md`.
- Wird kanonisches Fachwissen? → nach `knowledge/`.
- Reiner Wegwerf-Schnipsel? → `01_Master_Dump/`.
- Hier bleibt: aufgenommenes Wissen. **Kein Zwang zum Leeren.**

**Eintragsformat:**
> ### {Datum} — {Kurztitel}
> **Quelle:** {wo}  ·  **Tag:** {Schulung / Vertrieb / Vorlage / Audit / Strategie}
> - Stichpunkt
> - Stichpunkt
>
> **Relevanz für Cert-Expert:** {1–2 Sätze}
> **Mögliche Aktion:** {falls etwas Umsetzbares — sonst „—"}

---

## Einträge

### 2026-06-09 — Startup-Strategie-Konzepte (Instagram)
**Quelle:** Instagram (Startup-/Strategie-Video, Account offen)  ·  **Tag:** Strategie

Themen-Liste aus dem Video + sofortige Übersetzung auf Cert-Expert:

- **TAM / SAM / SOM** (Gesamt- / bedienbarer / realistisch erreichbarer Markt) → TAM = alle Sicherheitsdienstleister in DE mit Zertifizierungs-/QM-Bedarf; SAM = die mit DIN-77200-2- / DEKRA-Bedarf; SOM = das, was wir jetzt real bedienen (≈ die ~20 in der Airtable-Pipeline). *Nützlich, um Ziele realistisch zu rahmen statt „der ganze Markt".*
- **Beachhead-Market** (ein enger Erstmarkt, den man dominiert, bevor man verbreitert) → unser Brückenkopf ist da, wo das Wissen tief ist: **Veranstaltung/Kampfsport + Asyl/Flüchtlingsunterkünfte unter DIN 77200-2**. Erst dort gewinnen, dann auf die übrigen 13 SDL-Bereiche skalieren (deckt sich mit Wissens-Landkarte: „nur Event tief, Rest dünn").
- **Network Effects** (Wert steigt mit mehr Nutzern) → für uns nur indirekt: mehr zertifizierte Kunden = mehr Referenz/Proof = mehr Vertrauen; perspektivisch Auditoren-/DEKRA-Netzwerk + Schulungs-Kohorten. *Kein starker direkter Netzwerkeffekt — ehrlich bleiben.*
- **Switching Costs** (Wechselkosten) → 🔑 unser stärkster Retention-Hebel: liegt erst die komplette Auditdoku + Mitarbeiterakten im Certification OS, ist ein Wechsel teuer → Renewal-Umsatz. Bewusst hohe (faire) Wechselkosten einbauen.
- **Competitive Advantage / Moat** → kuratiertes Norm-Wissen (`NORM_MATRIX_v2` + Klausel-Register mit CL-IDs), audit-fertige Automatisierung (DEKRA-Assembler), DEKRA-Beziehung. Schwer zu kopieren.
- **Barriers to Entry** → Regulatorik-Expertise, DEKRA-Zugang, kuratierte Wissensbasis, spezialisierte SaaS. = unsere Eintrittsbarrieren gegen Nachahmer.
- **Market Timing** („Warum jetzt?") → wiederkehrender Auditdruck, DIN 77200-2 als Treiber. Für Pitch/Website: das „Warum jetzt" sauber benennen.
- **Category Creation** (eigene Kategorie schaffen statt im bestehenden Markt kämpfen) → Chance: nicht „noch eine QM-Beratung", sondern **„audit-fertige Zertifizierung als Service / Certification OS für die Sicherheitsbranche"**. Verknüpft mit offener Aufgabe **D-05 (Website-Primärclaim/Tagline)**.
- **Vertical SaaS vs. Horizontal SaaS** → wir sind klar **Vertical SaaS** (tief für eine Branche: Sicherheitsdienstleister-Zertifizierung), nicht horizontal/generisch. Das ist unsere Positionierung — tiefer Wert in der Nische statt Breite.
- **Red Ocean vs. Blue Ocean** → generische QM-/ISO-Beratung = **Red Ocean** (überfüllt, Preiskampf). Audit-Automatisierung + Schulungsprodukt für die **DIN-77200-2-Sicherheitsnische** = **Blue Ocean**. Dorthin steuern.

**Relevanz für Cert-Expert:** Bestätigt und schärft die bestehende Richtung — Vertical-SaaS in einer Blue-Ocean-Nische, Beachhead = Event/Asyl, Moat = kuratiertes Normwissen + Tool, Retention über Switching Costs/Renewals. Gute Vokabeln für Website-Claim, Pitch und Vision-Doku.

**Mögliche Aktion:** Bei **D-05 (Tagline)** und **G-02 (Vision 2036)** die Begriffe Category Creation / Blue Ocean / Vertical SaaS / Beachhead bewusst einarbeiten — als gemeinsame Strategie-Sprache. (Noch keine eigene neue Aufgabe nötig; erst wenn du willst.)

---

### 2026-06-09 — DGUV-Leitfaden Bildschirm-/Büroarbeitsplätze (offener Faden)
**Quelle:** DGUV (Leitfaden Bildschirmarbeitsplätze)  ·  **Tag:** Audit / Strategie  ·  **Status:** OFFEN — fachlich prüfen

- Allgemeiner **Arbeitsschutz/Ergonomie** (ArbSchG / ArbStättV / DGUV) — **keine** DIN-77200-2-Bewachungspflicht.
- Für uns relevant nur am eigenen Büro-/Leitstellen-Arbeitsplatz der Sicherheitsfirma → **ISO-45001-/Arbeitsschutz-Winkel**, nicht Qualifikation der Einsatzkräfte.
- **Kommt NICHT direkt ins Cert OS** (OS = Kundendaten + generierte Docs). Bot-Wissen lebt in `knowledge/`.

**Dateien (OneDrive, neuer DGUV-Ordner — idealerweise unter `Normen & Standards/` hängen):**
- `215-410.pdf` — DGUV Information 215-410 „Bildschirm- und Büroarbeitsplätze" (Leitfaden).
- `ASR-A6.pdf` — Technische Regel für Arbeitsstätten ASR A6 „Bildschirmarbeitsplätze" (ArbStättV). Gleiches Thema wie 215-410.
- `Umwelt-Online Kataster_Quickstart.pdf` — Quickstart/Auszug aus dem Umwelt-Online-Kataster, **inhaltlich ebenfalls Bildschirm- und Büroarbeitsplätze** (Umwelt-Online = Quell-Plattform/Rechtskataster, dieses PDF behandelt aber dasselbe Thema).

**Ablage-Regel:**
- Dateien → OneDrive `02_QM_und_Wissen/Knowlege base/Normen & Standards` (Rohlager, **Mark legt ab**).
- Ins `knowledge/2_regulations/` **nur**, wenn bewusst in Scope entschieden → dann kuratiert **mit CL-ID** im Klausel-Register. Bis dahin keine Normpflicht behaupten.

**Einordnung:** Bildschirmarbeitsplätze (215-410 + ASR A6) = Kandidat für **Strecke 3 (Norm-Breiten-Strecke)** — bewusst, separat, nicht automatisch. Gezielt holen, wenn ISO 45001 / eigener Arbeitsschutz angegangen wird.

**Mögliche Aktion:** — (geparkt, bis Scope-Entscheidung)

> Randnotiz: Quell-Plattform **Umwelt-Online** ist generell ein Rechtskataster-Tool (Pflichten → Nachweis → Audit-Beleg — dasselbe Muster wie unser Readiness-Motor). Hier nur als Quelle erwähnt; falls das Kataster-Muster mal als Vorbild/Erweiterung interessant wird, eigener Faden.

---

### 2026-06-09 — Vision: Arbeitsschutz-/GBU-Modul als Multi-Branchen-Produkt (Strategie)
**Quelle:** Mark (im Anschluss an BG-BAU-Handlungshilfe `kmu.htm`)  ·  **Tag:** Strategie / Produkt  ·  **Status:** OFFEN — Vision, **nicht eingeplant** (Gate mit Mark)

**Kernidee:**
- **Multi-Branchen-Expansion** ist langfristiges Ziel. **Baubranche = guter zweiter Vertical:** gleiches Klientel-Muster (einfache Leute, brauchen Zertifikate, hohe Komplexität — v.a. Arbeitsschutz — muss einfach gemacht werden). Gleiche Value Prop „Komplexität → einfach + auditfähig", anderer Vertical.
- **BG-BAU-Handlungshilfe = UX-Blaupause.** Arbeitsschutz-/GBU-Eingabe im selben geführten Aufbau nachbauen — nur mit **besserer UI/UX**.
- **Workflow:** Nutzer legt **Projekt** an → GBU im **Projektkontext** → wiederverwendbar.
- **Reframe des geplanten GBU-Bots** (`knowledge/6_products` „GB"): bisher eng = GBUs für Sicherheitskonzepte / **SDLs (Sicherheitsdienstleistungen)** — vgl. die 13 SDL-Bereiche in `knowledge/3_sdls`. **Neue Sicht:** vollwertiges geführtes Arbeitsschutz-/GBU-Modul, das den **gesamten Arbeitsschutz eines Unternehmens** abdecken kann (GBUs für alle Büros/Standorte), projektbezogen + umfangreicher. Mark: „fast besser als ein GBU-Bot".

**Einordnung / offene Punkte (Gate — nicht selbst entscheiden):**
- **C-10 (Architektur):** eigenes Produkt-/Modul vs. Feature im OS → Gate mit Mark, **nicht im laufenden Build**.
- **Reihenfolge:** Beachhead (DIN 77200-2 Security) zuerst sichern; Bau = **zweiter** Vertical später (sonst Verzettelung, vgl. Scope-Disziplin in CLAUDE.md).
- **Inhalte je Branche** aus den richtigen Quellen: Security → **VBG**; Bau → **BG BAU**; + `knowledge/` mit **CL-IDs**. BG-BAU-Seite = nur Struktur-Vorbild (**Copyright** beachten).
- Gehört in **Vision 2036 / Roadmap (G-02)**, nicht in einen aktuellen Slice.

**Mögliche Aktion:** bei nächster Strategie-/Vision-Runde (G-02) als **Multi-Vertical-These + GBU-Modul-Scope** aufnehmen.

---

### 2026-06-09 — Konzept: Vault-Struktur für KI & Agenten (offener Faden)
**Quelle:** Mark-Frage „perfekte Struktur für KI/Agenten + für mich"  ·  **Tag:** Strategie / Tool  ·  **Status:** ENTWURF — zur Entscheidung

- Vollständiges Konzept liegt in `hq/00_Dashboard/VAULT_STRUKTUR_KI_KONZEPT.md` (nichts umgebaut, nur Vorschlag).
- **Kern:** eine Struktur + Metadaten-Schicht (YAML-Frontmatter/Properties) → eine Datei, zwei Ansichten (du = Properties + Bases; Agenten = deterministisch lesbar).
- **Größter Hebel:** Metadaten raus aus dem Fließtext, rein in Frontmatter + kontrolliertes Vokabular (`type`/`status`/Tags, gespiegelt aus globaler CLAUDE.md).
- **Hygiene:** `08_Vorlagen` leer → materialisieren; `10_Bridge` überladen → erledigte Aufträge archivieren.

**Mögliche Aktion:** Mark entscheidet je Punkt (siehe Abschnitt 6 im Konzept). Bis dahin geparkt, nichts umgesetzt.

---

### 2026-06-10 — GBU-/Unterweisungs-Modul für die Sicherheitsbranche (OS-Modul, CL-verankert)
**Quelle:** Mark (Gespräch, im Anschluss an BG-BAU-Handlungshilfe https://www.bgbau-medien.de/handlungshilfen_gb/daten/ga/kmu.htm)  ·  **Tag:** Produkt / Strategie  ·  **Status:** OFFEN — Idee, **nicht eingeplant** (C-10-Gate)

- **Schärfung** der Vision vom 2026-06-09 („Arbeitsschutz-/GBU-Modul als Multi-Branchen-Produkt", siehe Eintrag oben): hier **erster Vertical = Sicherheitsbranche** (nicht Bau). Modul direkt ins **Cert-Expert OS** integrieren — geführte GBU-/Unterweisungs-Eingabe im **Projektkontext**, wiederverwendbar.
- **BG-BAU `kmu.htm` = reines UX-/Struktur-Vorbild** (geführter Aufbau), eigene bessere UI/UX. Inhalte security-spezifisch aus **VBG / DGUV** — BG-BAU-Texte **nicht** übernehmen (**Copyright**).
- **Norm-Anker (2026-06-10 verifiziert, siehe Klausel-Register):** knüpft an **CL-75** (Arbeitsschutz-Grundunterweisung: §12 Abs.1 ArbSchG · §4 DGUV V1, mind. jährlich + Doku · Wach-/Sicherung zusätzlich §4 Abs.2 DGUV V23; Auslegung DGUV Information 211-005; Büro: ArbStättV Anhang Nr.6 + DGUV Information 215-410) **und CL-22** (objektbezogene/einsatzbezogene Unterweisung). **Wichtig:** CL-75 = Grundunterweisung, CL-22 = objektbezogen — im Modul sauber **trennen**, nicht verschmelzen.
- Verknüpft mit dem geplanten **GBU-Bot-Reframe** (`knowledge/6_products` „GB") und den 13 SDL-Bereichen (`knowledge/3_sdls`).

**Relevanz für Cert-Expert:** Macht aus dem geplanten GBU-Bot ein vollwertiges, projektbezogenes **Arbeitsschutz-/Unterweisungs-Modul** für Security-Kunden — direkter Mehrwert im OS, anschlussfähig an die bereits belegten CL-75/CL-22-Grundlagen.

**Mögliche Aktion:** Bei nächster Planer-/Vision-Runde (G-02) als Modul-Scope gegen CL-75/CL-22 schneiden. Architektur (eigenes Modul vs. Feature im OS) = **C-10-Gate mit Mark**. Keine Bau-Aktion jetzt.

---

### 2026-06-10 — Sicherheitsbeauftragte: Schwellenwert 50 statt 20 (seit 29.05.2026)
**Quelle:** VBG.de Startseite (https://www.vbg.de/cms/)  ·  **Tag:** Audit / Norm / Recht  ·  **Status:** AKTUELL — normenrelevante Änderung

- Seit **29. Mai 2026** gilt neuer Schwellenwert: Bestellpflicht für Sicherheitsbeauftragte greift erst ab **50 Beschäftigten** (bisher: ab 20).
- Gilt allgemein (§22 SGB VII + DGUV V1 §20 i.V.m. DGUV Regel 100-001) — betrifft alle VBG-Mitglieder, also auch Sicherheitsdienstleister.
- **Auswirkung auf Cert-Expert:** Kunden mit 20–49 MA hatten bisher Bestellpflicht → haben sie jetzt ggf. nicht mehr. Bei Auditvorbereitungen und Beratung darauf hinweisen; die 20er-Grenze ist veraltet.
- Ausnahmen (besonders gefährdete Bereiche) weiterhin möglich — fachlich prüfen.

**Relevanz für Cert-Expert:** Direkt relevant für Compliance-Checks im Certification OS — wenn wir Soll-/Ist-Abgleich für Sicherheitsbeauftragte automatisieren, neue Grenze = 50 MA.

**Mögliche Aktion:** CL-Register prüfen, ob CL für Sicherheitsbeauftragte existiert (vermutl. im Basis-Bereich). Slice-2-Baupauftrag: Schwellenwert 50 statt 20 als Norm-Eingabe. → Fachlich prüfen; keine CL-ID ohne Registereintrag.

---

### 2026-06-10 — VBG Sicherungsdienstleistungen: GBU-Downloads + GEDOKU
**Quelle:** VBG.de — https://www.vbg.de/cms/sicherungsdienstleistungen + GBU-Seite  ·  **Tag:** Produkt / GBU / Audit  ·  **Status:** OFFEN — Downloads ausstehend

Direkt downloadbare PDFs (kostenlos, kein Login):
- **VBG-Fachwissen „Gefährdungsbeurteilung – So geht's"** — 7-Schritte-Leitfaden, PDF 7,6 MB. → Zielort: `knowledge/2_regulations/01_sicherheitsdienstleistungen/vbg/` und OneDrive DGUV-Ordner.
- **Gefährdungsbeurteilung psychischer Belastung** — PDF 1 MB. Wichtig wegen Gewaltexposition im Sicherheitsdienst.
- **Prämienkatalog für Sicherheitsunternehmen** — PDF 849,9 KB. Listet VBG-Zuschüsse (PSA, Bodycams, Deeskalations-Seminare).

**GEDOKU** (VBG-Software, kostenlos bis 50 MA):
- Enthält **Branchenkatalog Sicherungsdienstleistungen** mit typischen Gefährdungen + Maßnahmenvorschlägen.
- KI-Funktion zur GBU-Erstellung integriert.
- **Für GBU-Bot-Modul:** GEDOKU = Referenz-Logik (Basis-/Themen-/Branchenkataloge = gleiche Struktur wie unser geplantes Modul). GEDOKU-Katalog-Struktur ansehen bevor Modul-Scope definiert wird.
- URL: https://www.vbg.de/cms/arbeitsschutz/arbeitsschutz-organisieren/gefaehrdungsbeurteilung

Weitere VBG-Assets:
- **Securityreport 2023** — Unfallgeschehen Sicherungsdienstleistungen, alle 5 Jahre. Strategisch + für Kundengespräche.
- **Filmreihe „Sicher im Einsatz"** — Unterweisungshilfe speziell für Wach-/Sicherungsdienste.
- **Bodycam-Leitfaden** — Einsatz im öffentlichen Raum (VBG).

**Gewaltprävention-Seite:** 1/3 aller Unfälle in der Branche = gewaltsame Konfrontationen. VBG nennt explizit als Hochrisiko-Bereiche: Einrichtungen für Geflüchtete, Veranstaltungen, Öffentliche Plätze, Kaufhäuser, ÖPNV — **deckt direkt DIN 77200-2 Anwendungsfälle ab**.

**Mögliche Aktion:** Mark lädt die 3 PDFs herunter und legt sie in OneDrive `Normen & Standards/01_Sicherheitsdienstleistungen/VBG/`. Dann als `knowledge/`-Stub befüllen.

---

### 2026-06-10 — DGUV Publikationen: Kerntreffer für Sicherheitsbranche
**Quelle:** publikationen.dguv.de  ·  **Tag:** Norm / Audit / Regelwerk  ·  **Status:** OFFEN — Downloads ausstehend

**Direkt beziehbar (kostenlos via UV-Träger VBG oder DGUV):**
- **DGUV Vorschrift 23** — Wach- und Sicherungsdienste (UVV, VBG) — verbindliche Unfallverhütungsvorschrift. Bezug: kostenlos beim UV-Träger VBG.
- **DGUV Vorschrift 24** — Wach- und Sicherungsdienste (Ost-Fassung) — wie V23.
- **DGUV Vorschrift 1** — Grundsätze der Prävention — Basis für alle Branchen.

**Direkt als PDF downloadbar (publikationen.dguv.de):**
- **DGUV Information 215-310** (2025) — „Sicherheit bei Veranstaltungen und Produktionen" → HIGH VALUE für Veranstaltungssicherheit / DIN 77200-2.
- **DGUV Information 215-461** (2026) — „Gebäudemanagement – Sicherheit und Gesundheit beim Betrieb von Verwaltungsgebäuden" → relevant für Objektschutz.
- **DGUV Information 206-059** (2025) — „Sicherheits- und gesundheitsgerechte Führung – Reflexion für das eigene Unternehmen" → für Führungskräfte-Modul.
- **DGUV_Regelwerk.xls** — Komplettübersicht aller DGUV-Publikationen als Excel. Download: https://publikationen.dguv.de/files/downloads/DGUV_Regelwerk.xls

**Mögliche Aktion:**
1. Mark: DGUV_Regelwerk.xls herunterladen → Grundlage für spätere automatisierte Suche.
2. Mark: DGUV V23 direkt bei VBG anfragen (kostenlos).
3. Bot kann 215-310 + 215-461 direkt von publikationen.dguv.de fetchen (Produktseite erst prüfen, ob PDF-Link direkt ist).
4. Stubs in `knowledge/2_regulations/01_sicherheitsdienstleistungen/dguv_v23/` befüllen.
