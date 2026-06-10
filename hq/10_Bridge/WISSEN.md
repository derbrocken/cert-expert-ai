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
