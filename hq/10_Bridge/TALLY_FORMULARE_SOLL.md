# Tally-Formulare — Soll-Feldlisten

> **Zweck:** Klare Soll-Struktur für die Tally-Formulare, die in die App einlaufen. Damit weiß jedes Datei-Feld, **wohin es gehört** (App ordnet per `questionId` zu — keine Rate-Fallbacks mehr).
> **Stand:** 2026-06-13. Planer (Spur P) — kein Code, reine Form-Spezifikation. Mark baut/ändert im Tally-UI.

---

## Form 1 — `Y5Zq80` „Unternehmensunterlagen" (AUFRÄUMEN)

**Problem heute:** Mehrere **unbeschriftete** Datei-Felder (z. B. `lN267B`); das Logo landete im falschen Feld → die App musste „logo" im Dateinamen erraten. **Soll:** jedes Feld klar benannt, 1 Datei-Feld = 1 Dokumenttyp.

**Stammdaten (vorhanden, behalten):**

| Feld | Typ | questionId | → App |
|------|-----|-----------|-------|
| Firmenname | Kurztext | `7dM2QA` | CompanyExportSettings.companyName |
| E-Mail | E-Mail | `blvxao` | companyEmail |
| Logo des Unternehmens | Datei | `J2MA7d` | logoStorageKey (S3) |

**Firmen-Dokumente (P2-B — jeweils EIN beschriftetes Datei-Feld):**

| Soll-Feldbeschriftung | questionId | documentId (App) |
|-----------------------|-----------|------------------|
| Unbedenklichkeitsbescheinigung (1) | `AlyLkk` | `unbedenklichkeit-1` |
| Unbedenklichkeitsbescheinigung (2) | `BG0kvN` | `unbedenklichkeit-2` |
| Gewerbezentralregister-Auszug | `kYv6LM` | `gewerbezentralregister` |
| Handelsregister-Auszug | `vNKyRQ` | `handelsregister` |
| Bewachungserlaubnis (§ 34a GewO) | `KMklX7` | `bewachungserlaubnis` |
| Versicherungsnachweis (Betriebshaftpflicht) | `LdkWl1` | `versicherung` |
| Datenschutz-Nachweis | `pLvBab` | `datenschutz` |
| Verschwiegenheitserklärung | `1r678W` | `verschwiegenheit` |
| Mindestlohn-Nachweis | `MAMzBX` | `mindestlohn` |

**Aufräum-Aufgabe (Mark, Tally-UI):**
1. Jedes der 9 Datei-Felder **klar beschriften** (genau die Soll-Beschriftung oben) — die `questionId` ändert sich beim Umbenennen NICHT, also bleibt das App-Mapping gültig.
2. Das **unbeschriftete Feld `lN267B`** entfernen oder klar zuordnen (es war ein Duplikat-/Streufeld; das Logo gehört in `J2MA7d`).
3. Reihenfolge sinnvoll gruppieren: Stammdaten → Logo → 9 Dokumente.
4. Felder als **Pflicht/optional** markieren wie gewünscht (App ist tolerant: fehlt eins → wird übersprungen, kein Fehler).

> Die App-Seite (Katalog, Intake, Anzeige) ist **schon live** (P2-B, `15cac89`). Nach dem Aufräumen + einer echten Submission siehst du die Dokumente im Upload-Manager unter „Firmen-Dokumente".

---

## Form 2 — NEU: „Projektunterlagen" (Projekt-Setup je Auftrag/Objekt)

**Zweck:** Die **Gründungs-Dokumente eines Projekts/Objekts** einsammeln → später in den **Projektordner** (Projektakte, siehe `GESCHAEFTSMODELL_VINCENT_WOLF_PROJEKTAKTE.md`). Der Projektordner sagt dann selbst, **was zu tun ist** und steuert die **Freigabe**.

**Kontext-/Zuordnungsfelder (damit die App das Projekt der Firma/Objekt zuordnen kann):**

| Soll-Feld | Typ | Zweck |
|-----------|-----|-------|
| Firma / Kunde | Dropdown o. Kurztext | Projekt → Firma (Slug) |
| Projekt-/Objektname | Kurztext | Projektordner-Name |
| Objekt-Adresse | Kurztext | Stammdaten |
| Auftrags-/Projektnummer (falls vorhanden) | Kurztext | Referenz |

**Pflicht-Dokumente (Projekt-Gründung — je 1 Datei-Feld):**

| Soll-Feldbeschriftung | Kürzel (deins) | Interpretation — **bitte bestätigen** |
|-----------------------|----------------|----------------------------------------|
| Dienstleistungsvertrag | Vertrag | Vertrag Kunde ↔ Dienstleister |
| Angebot | Angebot | Angebot/Kalkulation |
| Objekt-Dienstanweisung | **ODA** | ✅ bestätigt (Mark): Objekt-Dienstanweisung |
| Gefährdungsbeurteilung | **GBU** | Gefährdungsbeurteilung (ArbSchG/DGUV) |
| Sicherheitskonzept | **SK** | ✅ bestätigt (Mark): Sicherheitskonzept |
| Subunternehmer-Unterlagen (falls vorhanden) | Subunternehmer | bedingt — nur wenn Sub eingesetzt |

> **Freigabe = STATUS, kein Datei-Feld (Mark bestätigt).** Die „Freigabe" ist **kein** hochzuladendes Dokument, sondern ein **Zustand/Gate im Projektordner** (Projektakte). Sie gehört daher **NICHT** ins Tally-Formular, sondern in die App-Logik der Projektakte (`GESCHAEFTSMODELL_VINCENT_WOLF_PROJEKTAKTE.md`): der Projektordner zeigt selbst, was zu tun ist, und trägt den Freigabe-Status.

**Wiederkehrende Dokumente (periodisch — „falls vorhanden"):**

| Soll-Feldbeschriftung | Kürzel | Hinweis |
|-----------------------|--------|---------|
| Monatsplan / Dienstplan | Monatsplan | ⚠️ **wiederkehrend** (monatlich) — ein einmaliges Tally passt dafür schlecht |
| Wachbuch | Wachbuch | ⚠️ laufend/periodisch |
| Monatsbericht | Monatsbericht | ⚠️ **wiederkehrend** (monatlich) |

> **Wichtige Architektur-Frage (für später, nicht jetzt entscheiden):** Die wiederkehrenden Doks (Monatsplan/Wachbuch/Monatsbericht) sind **periodisch**, nicht einmalig. Ein einmaliges Projekt-Setup-Tally erfasst sie nur als „Erst-Upload, falls vorhanden". Für den laufenden Betrieb braucht der **Projektordner** vermutlich einen eigenen Mechanismus (Upload je Monat / wiederkehrender Slot). → Gehört in die Projektakte-Architektur, nicht in dieses Setup-Formular.

**Bestätigt (Mark, 2026-06-13):**
1. ✅ **ODA** = Objekt-Dienstanweisung.
2. ✅ **SK** = Sicherheitskonzept.
3. ✅ **Freigabe** = **Status** (kein Datei-Feld) → in die Projektakte-Logik, nicht ins Tally.

**Noch offen:**
4. Sollen die 4 Kontextfelder (Firma/Projektname/Adresse/Nr.) so rein? (Vorschlag steht oben.)

> Nach Bestätigung: Du baust das Tally-Formular, schickst eine Test-Submission → ich lese die echten `questionId`s aus dem Webhook-Log und baue den App-Intake (analog Y5Zq80) **gegen die Projektakte** — wenn die Projektakte-Architektur steht (eigener Planungs-Schritt, `GESCHAEFTSMODELL_VINCENT_WOLF_PROJEKTAKTE.md`).
