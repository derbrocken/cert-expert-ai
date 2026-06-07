# CONTEXT — Schnellorientierung (Claude ⇄ Cursor ⇄ Mark)

**Zweck:** Diese Datei zuerst lesen. Sie bringt jede Sitzung in 2 Minuten auf Stand.
**Stand:** 2026-06-06

---

## Wer / Was

- **Mark (Marwan Mahra)** — Geschäftsführer **Cert-Expert Academy** (mahra@cert-expert.de).
- Beratung für Zertifizierungen, QM, Auditvorbereitung Sicherheitsbranche; Schwerpunkt **DIN 77200-2**.
- **Arbeitsweise:** ADHS — direkt, kleine konkrete Schritte, klare Prioritäten, Stop-Regeln, kein Overengineering. Trennung Vision / Projekt / heutige Aufgabe.

## Rollenverteilung

- **Claude (Cowork):** Generalist / Chief of Staff. HQ-Pflege, Recherche, Connectoren (Outlook, Airtable), Code-Review, Entwürfe. Ersetzt zunehmend ChatGPT als Generalist.
- **Cursor:** Code-Umsetzung (Dashboard, Certification OS / Tool-2).
- **Mark:** Entscheidungen, Versand, Freigaben.

## Delivery-Prinzip — Kundenarbeit (WICHTIG)

**„Low-Effort für den Kunden."** Cert-Expert nimmt dem Kunden die Arbeit ab. Der Kunde liefert nur **einfache Inputs** (Rohdaten wie Verbrauchszahlen, Mitarbeiterliste, Unterschriften, einzelne Nachweise). **Den Rest erstellt Cert-Expert selbst:** Managementbericht/-bewertung, Rechtskataster-Aktualisierung, KPI-/ZKM-Listen, Konzepte.

→ Konsequenz für Kundenmails: **Nicht** ganze Dokumente (Rechtskataster, KPI-Liste, Managementbewertung) beim Kunden anfordern. Nur die wenigen simplen Inputs erfragen, die Cert-Expert nicht selbst hat. Mails kurz und niederschwellig halten.

> Offen: Wolf-Street-Mail (Entwurf in Outlook) verstößt noch gegen dieses Prinzip → nach diesem Modell überarbeiten (nur simple Inputs anfragen).

## Endarchitektur — Entscheidung 2026-06-07 (verbindlich)

**Drei Häuser nach Datentyp — nichts doppeln:**

1. **Git-Repo = das Gehirn** (bot-navigierbar, versioniert, einheitlich): Wissen (1 konsolidierte Basis), Org/`hq`, Nebenprojekte + Privat (als Linsen), Code, **Blueprints & Template-Quelle** (= Einheitlichkeit). Obsidian = Linse. Bots/Qwen lesen hier.
2. **Software (Certification OS) + Hetzner-S3 = System of Record für Kundendaten** (Firmen/Mitarbeiter/Akten/Dokumente). **Zukunft** — übernimmt in ~2 Monaten. Firmenordner werden *online in der Software*.
3. **OneDrive = reiner Aktenschrank** (Binär/Admin/Branding/Aufnahmen + **Interim-Kundendateien**, bis Software übernimmt). **Kein zweites Gehirn, kein Wissensmanagement.**

**Konsequenzen:**
- Kundenordner **nicht** jetzt neu strukturieren → pro Kunde in die Software überführen, sobald live. OneDrive `Clients/` bis dahin so lassen.
- Wissen 3-fach → **eine** Basis in `knowledge/` (Repo). OneDrive-Wissensbasen abernten + archivieren.
- Blueprints/Templates: **eine Standardquelle im Repo**, von Bots UND Software gelesen.

## Quellen der Wahrheit (nicht doppeln!)

- **HQ-Ordner** (`hq/`) = Wissensbunker + Backlog. Aufgaben: `ToDos.md` pro Kunde + `00_Dashboard/BACKLOG.md`.
- **Airtable** „Cert Expert CRM & Revenue Pipeline" = Kunden, Deal-Stage, Audit-Daten, Kontakte (lese-/schreibbar).
- **Fachwissen (Bots) = lokale `knowledge/`** im Repo: kuratiertes Markdown, AI-ready, Blueprint-Allowlists (`BOT_CONTEXT_MAP.md`), speist Qwen-Bots GB/SK/EK. **Kanonische Wissensbasis.** OneDrive-„Knowledge System"-Vault = sekundär → abernten + archivieren. ⚠️ Mehrere Obsidian-Vaults aktiv (Repo-Root, `knowledge/`, OneDrive) → auf EINEN reduzieren (Repo-Root).
- **Outlook / M365** = Mail & Kalender (nur lesend über Connector).
- **Kontaktliste:** `00_Dashboard/Kontakte.md` (+ Outlook-Import-CSV).

## Produkt-Scope — Certification OS (Entscheidung 2026-06-06)

- **Eine App, zwei Modi:** **Intern** (Cert-Expert operativ) + **Kunde** (Kundenportal).
- **Intern:** viele Firmen → je Firma ein **Mitarbeiter-Pool** → Akten in Masse (Automatisierung). = dein operatives Tool.
- **Kunde:** pro Kunde organisiert, andere Logik (extern, später).
- **Firmen-Profil + Logo:** zentral **pro Firma**, gehört in den **Dokumentengenerator (Tool 1)**, von beiden Generatoren nutzbar — NICHT single-firm im Upload Manager (das ist Erbe aus dem Portal-Entwurf).
- **Aufräum-Richtung:** Firma-Ebene einziehen (Firma → Pool → Akten); Modi intern/Kunde trennen; zentrale Firmen-/Logo-Verwaltung.

## Solopreneur — Dashboard

- HQ-Dashboard = **ein Arbeitsplatz**; Business + Privat hängen aktuell zusammen (Solopreneur-Realität). Prinzip: **ein Gehirn, klare Linsen** (Business/Privat als Bereiche), kein zweites System.

## Tech (Dashboard)

- `00_Dashboard/html/` → `index.html` (Layout), `styles.css` (Design), `app.js` (Logik), `dashboard_data.json` (Build-Ausgabe, NICHT von Hand ändern).
- `scripts/build_dashboard.py` (baut JSON aus Markdown), `scripts/serve_dashboard.py` (Server 127.0.0.1:8765).

## Aktuelle Hauptbaustellen (Fristen)

- TeamFlex Audit 12.06. · Wolf Street 16.06. + 17.07. · Schutzritter 26.06. (wartet auf Kunden-Upload) · ZT 08.07. · SecuGuard Ende Juni.
- Offene Forderungen: ELC, Faust (1.500 €), AFAS.

## Laufende Automatik

- Tagesbriefing 09:00 + 17:00 (geplante Aufgaben, nur Nachricht).

> Details & offene Punkte: siehe [`HANDOFF.md`](HANDOFF.md). Code-Reviews: [`CODE_REVIEW.md`](CODE_REVIEW.md).
