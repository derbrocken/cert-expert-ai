# Pipeline-Readiness — Vorbedingungen (Spur 2) — Stand 2026-06-07

**Spur 2 = was blockiert.** Parallel zur Journey (Spur 1, siehe `_Pipeline_Checkpoints.md`). Jedes Item hat eine Ampel (🟢/🟡/🔴). **Alle grün = Voraussetzung für Stage 5 (Audit).** Quelle: Willkommensguide + O2C-Flowchart (`_O2C_Prozess_REAL.md`).

Gehört technisch ins **Tool** (DFSS Readiness-Engine, Slice 3), nicht in den CRM-Stage.

## A) Die 7 Pflicht-Vorbedingungen (Audit-Blocker)

| # | Item | Anforderung / Nachweis | Stichtags-/Sonderregel | Früh-Trigger |
|---|------|------------------------|------------------------|--------------|
| 1 | **Führungskraft DIN 77200-1** | Weg A: Fachkraft/GSSK/Werkschutz + **≥2 J. Erfahrung** (Nachweis: Arbeitszeugnis/AG-Bestätigung) · Weg B (Ausnahme): §34a vor 13.10.2017 **und** FK-Funktion 13.10.2017–13.10.2020 | beide Weg-B-Bedingungen gleichzeitig, sonst Weg A | Welcome-Call |
| 2 | **Auftrag / SDL** | DIN-konforme SDL beschrieben + Subunternehmer-Aussage; jederzeit vorlegbar | — | Welcome-Call |
| 3 | **Prüfung ortsveränderlicher Geräte** | Prüfprotokoll liegt vor oder nachweislich in Erstellung | Cert-Expert vermittelt Prüfer | Welcome-Call (Lead-Zeit!) |
| 4 | **FASI & Betriebsarzt** | <50 MA: DIA-Drei VBG (diadrei.vbg.de) → Zugangsdaten an CE · >50 MA: externer FASI + Betriebsarzt Pflicht; + formale Bestellungen | von MA-Zahl abhängig | Welcome-Call |
| 5 | **Büro-Ausschilderung** | Firmenschild am Eingang (Übergangs-Ausdruck ok) | — | Welcome-Call |
| 6 | **DIN-konforme Versicherung** | Deckung: 2,5 Mio Personen/Sach · je 250k Vermögens-/Abhandenkommen/Schlüssel/Bearbeitungsschäden · 2,5 Mio Umwelt; Höchstersatz min. 2-fach (Umwelt 1-fach) | **muss am Audit gültig/ausreichend sein** | **Welcome-Call — lange Vorlaufzeit (Wechsel!)** ← Schutzritter-Lektion |
| 7 | **Unternehmens-Pflichtdokumente** | Unbedenklichkeit Finanzamt · Unbedenklichkeit Sozialversicherung · Auszug Gewerbezentralregister | **am Audit:** Unbedenklichkeiten ≤6 Mon., Gewerbezentralregister ≤12 Mon. · **intern:** Unbedenklichkeiten ~3 Mon. vor Audit frisch anfordern | je nach Frist |

**Ampel-Logik:** 🔴 fehlt/abgelaufen-am-Audit · 🟡 in Arbeit / läuft bald ab · 🟢 vorhanden + am Audit gültig. Readiness-Engine rechnet Fristen **gegen den geplanten Audit-Termin**.

## B) Nachweis-Bundles (die 4 Checklisten — Pflichtfelder je Formular)

Sind die Sammel-Container; Details in `_O2C_Prozess_REAL.md` (§ Checklisten 1–4):
- **Checkliste 1 Unternehmensdaten** · **2 Personalakte (pro MA)** · **3 SDL/Objekt** · **4 Büro & Arbeitsschutz**
- Personal-Schulung: VZ **40 h/Jahr**, TZ **25 h/Jahr** · Brandschutz **nur bei DIN 77200-2**.

## C) Generierte Eigenerklärungen (Tool-Output, kein Kunden-Upload)
Datenschutz-Verpflichtung · Verschwiegenheit-Eigenerklärung · Mindestlohn-Eigenerklärung → **ein generiertes Sammeldokument** (Slice 4), Platzhalter `{CompanyName}` etc.

## Für den Bau (Code-Track)
- Readiness = eigene Entität je Kunde: Item → Status (🟢/🟡/🔴) + Datum/Frist + Quelle (Nachweis/Upload).
- Übergang Stage 4 → 5 nur wenn alle 7 grün.
- Fristen relativ zum Audit-Termin (aus Airtable `Audit Date`).
