# AUFGABEN — Gemeinsames Register (Bridge)

**Zweck:** Eine Liste, drei Ausführende. Du sagst nur die **ID** ("mach T-02"), der zuständige Assistent liest hier den Kontext und führt aus.

**Stand:** 2026-06-07

---

## So funktioniert's (ADHS-einfach)

- Jede Aufgabe hat eine **ID** + **einen** Owner.
- Du brauchst dir nichts merken — nur die ID nennen.
- Owner-Kürzel:
  - **G-** = Generalist (Claude, dieser Chat) → Architektur, `hq`, `knowledge`, Migration. **Kein Code.**
  - **T-** = Code-Track (dein Bau-Chat) + Cursor → Tool/OS-Code & -Design.
  - **M-** = Mark (du selbst) → Finder, OneDrive, Outlook. Kann keiner für dich machen.
- Status: `OFFEN` · `LÄUFT` · `WARTET` (auf etwas/jemanden) · `FERTIG`

**Befehlsformat an einen Assistenten:**
> "Lies AUFGABEN.md, mach **T-02**." → er liest Zeile + Kontext, fragt nur bei echter Unklarheit, sonst macht er.

---

## Offen

| ID | Aufgabe | Owner | Fertig wenn | Status |
|----|---------|-------|-------------|--------|
| **T-03** | `/intern`-Tool bauen (Slice 0 ff. lt. `CURSOR_BAUAUFTRAG_TOOL2.md`, Branch `main`) — **erst nach „los" (D-02)** | T | nach Freigabe, Bau startet | WARTET (auf D-02) |
| **D-02** | **„los"** geben → Cursor startet Slice 0 (Datenmodell). Bauauftrag steht in `CURSOR_BAUAUFTRAG_TOOL2.md` | M | du sagst „los" im Code-Track-Chat | WARTET (auf dich) |
| **D-03** | Export-Format für Slice 4 festlegen: Audit-Übersicht als **XLSX** oder **PDF** | M | Format gewählt | WARTET (auf dich) |
| **D-04** | **„Client 22" einordnen** — KEIN Junk: 45 echte QM-Dokumente (Prozessbeschreibungen, Vorgabedokumente, ISO 45001). Richtiger Kundenname? Oder Master-Vorlage → nach `Template/`? | M | umbenannt/einsortiert | WARTET (auf dich) |
| **M-11 🔒** | **API-Keys sichern (Sicherheit):** Keys liegen interim in `08_Persönlich/Keys/` (raus aus Software/Team-Bereich). **Noch offen:** in Passwort-Manager übertragen → .docx aus OneDrive löschen (Klartext-in-Cloud bleibt sonst) → Keys rotieren, falls je geteilt. | M | Keys im PW-Manager, Docs aus Cloud weg | OFFEN (interim erledigt) |
| **M-14** | Redundantes `_Import_2026-06_persOneDrive/OneDrive_2026-06-07.zip` (3,9 GB, 2. Kopie von InnoSecure) löschen — Inhalt ist bereits importiert/archiviert | M | Zip weg, Import-Ordner leer | OFFEN |
| **M-04** | Korrupten Wolf-Street-Entwurf in Outlook löschen | M | Entwurf weg | OFFEN |
| **M-05** | Dummy "Max Mustermann" in COS löschen | M | weg | OFFEN |
| **M-06** | Wolf-Street-Mail senden (Text steht in `Mail_Unterlagenliste_2026-06-07.md`) | M | Mail raus | OFFEN |
| **W-01** | **Warten auf Tarak:** Design-Vorschläge (Farbwelt, Typo, Hero) nach Auswertung von Leitbild/Strategie/10-Jahresplan/taktische Ziele. Tarak meldet sich. | extern | Tarak liefert Vorschläge | WARTET (auf Tarak) |
| **D-05** | Website-**Primärclaim/Tagline** festlegen (inkl. Entscheid „PRÄZISION·TIMING·KONTROLLE" vs. dokumentierte Antithesen-Claims) | M | Tagline gewählt | WARTET (auf dich) |
| **G-02** | Vision-Schärfung in kanonische `OneDrive QM/Strategie/Vision 2036.docx` einarbeiten + taktische Ziele auf schnelleren Horizont | G | eingearbeitet | OFFEN |
| **M-16** | Airtable: Checkpoint Regional auf Stage „Angebot & KSA" zurücksetzen (Angebot noch nicht unterschrieben) | M | Stage korrekt | OFFEN |
| **D-06** | Zertifikats-Daten (Issue/Expiry) der zertifizierten/Renewal-Kunden in Airtable nachtragen (= Renewal-Motor) — **später** | M | Daten drin | GEPARKT |
| **M-17** | Code-Track → Claude Code in Cursor migrieren (Abschluss-HANDOFF + Übergabe) | M/T | neuer Bauer aktiv | ✅ erledigt |
| **M-18** | **Kalender konsolidieren.** Ist: Outlook (Kalender ungenutzt) · iPhone (privater Apple-Account, **nicht** mit MacBook verbunden) mit **Google-Kalender** (mit Assistenz geteilt, „alles Audit-Relevante" drin, aber **nicht aktuell**). Ziel: **EINEN führenden Kalender** festlegen + aktualisieren. Audit-Termine kommen künftig aus **Airtable** (`Audit Date`) → kann den Kalender speisen. | M | ein führender, aktueller Kalender | OFFEN |

---

## Erledigt

- **M-15 / Website-Session** (2026-06-07) — Design-Brief an Tarak raus + **Session gehalten**. Mark hat Tarak zusätzlich **Leitbild, Strategie, 10-Jahresplan, taktische Ziele** geschickt. Tarak wertet aus und meldet sich mit Design-Vorschlägen (→ W-01). Nächster Schritt unsererseits: kanonische Strategie-Doku aktuell halten (→ G-02).
- **T-01** (2026-06-07) — Nested-Clone-Löschung. **Ordner existiert nicht mehr → Migration code-seitig abgeschlossen.** Verifiziert: kein zweiter `cert-expert-ai/` im Repo.
- **T-02** (2026-06-07) — ESLint: 20 Fehler → 0. `npm run lint` + `npm run build` sauber (COS, Port 3001). Fixes: lazy localStorage-Hydration, Render-Sync statt setState-in-effect, UploadsPage-Typen, `tmp-upload-templates` ignoriert.
- **D-01** (2026-06-07) — Design abgestimmt. Code-Track hat DFSS-Gold (inkl. VOC/CTS/KANO/QFD) + O2C-Prozess ausgewertet, Lücken + Reihenfolge festgelegt, Bauauftrag geschrieben. Entscheidungen gesperrt in `CURSOR_BAUAUFTRAG_TOOL2.md`.
- **M-03** (2026-06-07) — `inputs/raw_standards/_dups_check/` weg, `raw_standards` sauber (Arbeitsschutz, BewachV, DIN, ISO, dguv).
- **M-01** (2026-06-07) — Dead Vault „Cert-Expert Knowledge System" (leeres Gerüst, 7 Template-Dateien + verschachtelte Dopplung) → OneDrive `_Archiv_2026-06/`. Generalist ausgeführt, verifiziert.
- **M-02 (Teil)** (2026-06-07) — leerer „Neuer Ordner" aus `Clients/` → `_Archiv_2026-06/`. „Client 22" NICHT gelöscht (echte Inhalte → D-04).
- **M-08** (2026-06-07) — `02_QM_und_Wissen` aufgeräumt: Junk archiviert (u.a. 505-MB- + 169-MB-Transfer-Zips → `_Archiv_2026-06/02_QM_Junk/`); „Auditor Ausbildung" (persönl. CV/Zeugnisse) → neuer Root-Ordner `08_Persönlich`; „Inno-SECURE QM" = nur O2C-Prozess (wertvoll) → umbenannt `Order-to-Cash Prozess (O2C)`. „Knowlege base" in 7 Themen-Ordner sortiert (Normen & Standards · Schulungen & Kurse · Prozesse · Sicherheitskonzepte (Muster) · Strategie & Methoden · HR · Dokumente), keine losen Dateien mehr. Dubletten in `Template`/`QM` bereinigt: 6 „- Kopie"-Dateien + verschachtelte `NEW 9001 14001…`-Dopplung → `_Archiv_2026-06/02_QM_Dubletten/` (verschoben, nicht gelöscht; 3×-Norm-Vorlagen bewusst behalten = Norm-Highlevel-Struktur).
- **M-09** (2026-06-07) — `07_Ablage` aufgeräumt: Logo+Taschenkarte → `03_Branding`, `clients compilation.xlsx` → `01_Kunden`, 1 Kopie + 3 leere Ordner → Archiv. Rechnung_2025-0018 + Angebot Checkpoint → `04_Finanzen/Rechnungen & Angebote`. AGB bleibt im Business-Ordner `CertExpert General - Dokumente` (= jetzt einziger Inhalt von `07_Ablage`, allgemeine Business-Ablage).
- **M-10** (2026-06-07) — `05_Meetings_und_Aufnahmen`: Teams-Chat-Dump entwirrt — O2C-Dublette → Archiv, Norm-Kontext → Normen & Standards, Stellenbeschreibung → Knowlege base/Dokumente, 5× Willkommensguide → `03_Branding/Willkommensguide (Versionen)` (du wählst finale), Rest als „Teams-Dateien (Chat-Dump)" gelabelt. Meeting-Notizen (.loop) unberührt.
- **M-11-cleanup** (2026-06-07) — `06_Software_und_Projekte`: Test-Zips (Oussama) + leere `z1.txt` → Archiv. Struktur = 3 kohärente Ordner (Automation Tool, IT, idea hub). ⚠️ API-Keys-Sicherung → offen als M-11 (deine Aktion). Lead-Listen `Germany Physical Security Companies 1/2/3` = Versionen (optional später entdoppeln).
- **M-12** (2026-06-07) — `03_Branding` (Mac-Junk `__MACOSX`, redundantes Zip, „- Kopie"-PNG → Archiv; Logo+Taschenkarte in `Branding/` eingeordnet) + `04_Finanzen` (Bestellbestätigung → Rechnungen & Angebote). API-Keys → `08_Persönlich/Keys` (interim, M-11 offen). `01_Kunden` = echte Kundendaten, bewusst unangetastet (außer D-04 Client 22).
- **PIPELINE-SPEC** (2026-06-07) — Echter O2C-Prozess rekonstruiert (`_O2C_Prozess_REAL.md`) + 2-Spuren-Modell: Journey-Checkpoints (`_Pipeline_Checkpoints.md`) + Readiness/Vorbedingungen (`_Pipeline_Readiness.md`). Bauauftrag für Code-Track: `CURSOR_BAUAUFTRAG_READINESS_DEKRA.md` (Slice 2 Requirement → 3 Readiness-Ampel → 4 DEKRA-Assembler+Export). Zielbild = audit-fertiger DEKRA-Ordner, Upload via Teambeam nach Buchstabe. CRM befüllt: Auditoren verlinkt, Certification Body=DEKRA (12 Kunden).
- **CRM** (2026-06-07) — Airtable bereinigt + nach 5 Checkpoints organisiert. Neues Feld `Checkpoint` (1 Angebot&KSA · 2 Unterlagen-Sammlung · 3 Audit-Vorbereitung · 4 Audit&Zert · 5 Zertifiziert + Renewal/Verloren) + Flag `Achtung`, alle 20 Kunden einsortiert. Widersprüche gelöst (Bellator/Precision/S.A.F.E./SHOWSEC → Verloren), TeamFlex-Audit → 12.06., „copy"-Namen bereinigt. Cockpit (`build_dashboard.py` + `_airtable_cache.json`) zieht jetzt aus Airtable → synchron. **Offen (du, Airtable-UI):** alte Felder `Deal stage` + `Pipeline Status` ausblenden (Checkpoint ist kanonisch; nichts gelöscht).
- **ARCH** (2026-06-07) — Architektur festgeschrieben: `hq/00_Dashboard/ARCHITEKTUR.md` + `WO_IST_WAS.md`. **Verbindliche Entscheidungen:** (1) System-of-Record je Datenart, Kunden-Slug = Klebstoff; (2) Kundendaten → ins Tool (nicht von Hand OneDrive); (3) **Slice 4: generierte Docs → S3 + Auto-Export nach OneDrive `01_Kunden/<Kunde>/08_Generated/`** (kein manueller Download); (4) `hq/03_Kundenprojekte/<slug>/` bleibt metadaten-only; (5) Bots lesen nur Repo, Tool nur DB/S3, OneDrive = mensch-only. → Code-Track: in `CURSOR_BAUAUFTRAG_TOOL2.md` Slice 4 entsprechend verankern.
- **M-13** (2026-06-07) — Pool-2-Migration (pers. OneDrive `onedrive.live.com`) **abgeschlossen**. Dedup-Import: „Tools & Knowledge" → 1 neu (`DEUTSCHE NORM.docx`). „InnoSecure Consulting" (6077 Dateien) → 1868 neue einsortiert: Faust 339 + Sigma 4 → aktive Kundenordner (`_Altfirma_InnoSecure`), Old Clients 1087 → `01_Kunden/Clients/_Old_Clients_InnoSecure`, Templates 362 → `02/Template/_InnoSecure_alt`, QM 25 → Knowlege base, Angebote 12 → Finanzen, Kaffeerösterei 5 → idea hub, Email/lose 29 → 07_Ablage. **4209 Dubletten → `_Archiv/_Import_dupes/`.** Offen: redundantes 3,9-GB-Zip löschen (M-14); lose Wurzel-Dateien + `Persönlicher Tresor` + `MarwanMahra.pfx` bewusst nicht migriert (persönlich).
- **M-07** (2026-06-07) — OneDrive-Aktenschrank fertig. Stufe 1 (ungeteilt) + Stufe 2 (geteilt, Namen behalten, Freigaben erhalten). Root **25 → 8**: 7 Schubladen (01_Kunden … 07_Ablage) + `_Archiv_2026-06`. Reversibel.
- **T-04** (2026-06-07) — Konsolidierung auf `main`. Commit `8923aa7`, Backup `backup/b3-pre-merge`, `b3-tool2-migration` lokal gelöscht. Lint+Build sauber. ✅ Generalist hat Branch-Refs (Bauauftrag, Kickoff, Slice0, Übergabe) auf `main` umgestellt.

---

## T-04 Detail — Auf `main` konsolidieren (für Code-Track)

**Ziel:** Ein Branch (`main`) mit allem — COS-Code + T-02-Lint-Fixes. Doppelung (`main` ⇄ `b3-tool2-migration`) auflösen. Danach nur noch `main`.

**Ausgangslage (verifiziert 2026-06-07):** Branch `main` ausgecheckt, ~228 uncommittete Änderungen = COS-Quellcode (aus b3 „wiederhergestellt") + Lint-Fixes. `b3-tool2-migration` hat den COS-Code committet, aber NICHT die Lint-Fixes. Nichts auf `main` committet → reversibel.

**Schritte (in dieser Reihenfolge, nichts auslassen):**
1. **Sicherheitsnetz zuerst:** `git branch backup/b3-pre-merge b3-tool2-migration` — friert den b3-Stand ein, nichts kann verloren gehen.
2. **Vollständigkeit prüfen:** sicherstellen, dass der Arbeitsbaum von `main` den b3-Code **komplett** enthält (keine b3-Datei fehlt). Z. B. `git diff --stat b3-tool2-migration -- cert-expert-certification-os/` → es dürfen nur die Lint-Fixes als Unterschied auftauchen, keine fehlenden Dateien. Falls doch welche fehlen → erst nachziehen.
3. **Committen:** ein sauberer Commit auf `main`, z. B. `merge: COS-Code + T-02 lint fixes auf main konsolidiert`.
4. **Verifizieren auf `main`:** `npm run lint` **und** `npm run build` müssen sauber sein.
5. **Erst dann b3 entfernen:** `git branch -D b3-tool2-migration`. **Backup-Branch (`backup/b3-pre-merge`) bleibt** vorerst als Netz.
6. **Melden** an Generalist (HANDOFF): erledigt → Generalist stellt die Branch-Referenz in `CURSOR_BAUAUFTRAG_TOOL2.md` + `HANDOFF.md` von `b3-tool2-migration` auf `main` um.

**Guardrail:** Schritt 5 (Löschen) NIE vor erfolgreichem Schritt 4 (Build+Lint sauber).

---

## Hinweis zur Spur-Trennung

- **Tool/OS** (Design + Code) gehört dem **Code-Track + Cursor**. Der Generalist mischt sich da **nicht** ein.
- **Migration/Architektur/`hq`/`knowledge`** gehört dem **Generalist**.
- Braucht eine G-Aufgabe Code → wird als **T-Aufgabe** hier eingetragen, nie selbst gecodet.
