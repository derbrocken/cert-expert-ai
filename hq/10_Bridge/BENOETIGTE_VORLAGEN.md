# Benötigte Dokumentvorlagen (Tool 2 — Set-Mapping + Overlays)

> **✅ ERLEDIGT (2026-06-10, Commit `fe17ad5`, live):** Alle Vorlagen eingespielt + verdrahtet. Mark lieferte: Stellenbeschreibung SMA/FK/BK, Datenschutz/Vertraulichkeit, Dienstausweis, Allgm. Pflichtunterweisung, Arbeitsschutz_DGUV, Jahresweiterbildung 24/40, ODA Einzel/Sammel, Veranstaltung Einzel/Sammel, Bestellung Brandschutzhelfer. Claude erstellte: Bestellung Ersthelfer + SiBe, Kfz-Fahranweisung, Mutterschutz-Merkblatt, Bildschirmarbeitsplatz-Unterweisung (Drafts in `Vorlagen_Bestellung_Betriebsanweisung/generated_drafts/`, Wording „ok" von Mark). 30 Objekte in S3, Set-Mapping auf reale Slugs. **Offen:** alte `appointments/unterweisungen/`-Kopien löschen (gezielt, Mark); modulare-Schulungen-UE-aus-Dateiname für #5 (Folge-Touch). Restliche §-Fragen geklärt (Register belegt).


> **Stand:** 2026-06-09. Diese `.docx`-Vorlagen referenziert das Set-Mapping (#D/Lane K) — heute als **Platzhalter** im Generator (ZIP bricht nicht, EC-09). Sobald die echten Dateien im S3-Vorlagen-Bucket liegen, greift das Mapping automatisch. **Bereits vorhanden:** „DIN 77200 Allgemeine" (aktuelles Core-Set).
> **Konvention je Doc:** Norm-Beleg (`clauseId` / „fachlich prüfen") · unterschriftspflichtig? · Default-Datum.
> **Platzhalter-Felder, die der Generator füllt:** `{CompanyName}`, `{FullName}`, `{Birthday}`, Datum (Default = Arbeitsvertrags-/Einstellungsdatum, sonst angegeben).

## Core-Sets

| # | Vorlage | Set | Norm | Unterschrift | Default-Datum |
|---|---------|-----|------|--------------|---------------|
| 1 | **Allgemeine (Jahres-)Pflichtunterweisung** (enthält Arbeitsschutz) | Basis (alle MA) | CL-75 *(fachlich prüfen — DGUV V1/V2/§4(2) V23, exakte Nr. offen)* | ja | Einstellung (`startDate`) |
| 2 | **Datenschutz- + Verschwiegenheitserklärung** (1 Blatt) | Basis (alle MA) | CL-04 / CL-05 | ja | Einstellung | *(Mark: „wird erstellt")* |
| 3 | **Stellenbeschreibung Sicherheitsmitarbeiter** | Set SMA | — (Org) | nein | Einstellung |
| 4 | **Stellenbeschreibung Führungskraft** | Set FK | — (Org) | nein | Einstellung |
| 5 | **Bildschirmarbeitsplatz-Unterweisung** (Büro-Arbeitsschutz) | Set Bürokraft | CL-75 (Büro-Variante) | ja | Einstellung |

> **Bürokraft:** **keine** allgemeine/sicherheitsrelevante Dienstanweisung — stattdessen #5 (Bildschirmarbeitsplatz) + #2 (Datenschutz/Verschwiegenheit).

## Overlays (positionsunabhängig, bedingt)

| # | Vorlage | Bedingung | Norm | Unterschrift | Default-Datum |
|---|---------|-----------|------|--------------|---------------|
| 6 | **Kfz-/Fahr-Anweisung** (UVV) | Fahrtätigkeit | CL-73 *(fachlich prüfen)* | ja | Einstellung |
| 7 | **Objektbezogene Dienstanweisung** | Objekt zugeordnet | CL-22 | ja | **erster Einsatz am Objekt (manuell)** |
| 8 | **Mutterschutz-Hinweis** (Meldepflicht Schwangerschaft) | weibliche MA, **alle Sets** | CL-77 *(fachlich prüfen — MuSchG)* | Empfangsbestätigung | Einstellung |

## Bestellungen / Ernennungsdokumente (wenn „bestellt als" gesetzt)

| # | Vorlage | Norm | Unterschrift | Default-Datum | Status |
|---|---------|------|--------------|---------------|--------|
| 9 | **Bestellung Ersthelfer** | CL-08 | ja | Bestell-/Einstellungsdatum | prüfen, ob im appointments-Bucket vorhanden |
| 10 | **Bestellung Brandschutzhelfer** | CL-23 | ja | Bestell-/Einstellungsdatum | prüfen |
| 11 | **Bestellung Sicherheitsbeauftragter (SiBe)** | CL-74 | ja | Bestell-/Einstellungsdatum | prüfen |

## 📥 Eingang 2026-06-10 (Mark geliefert)
**✅ erhalten** (OneDrive `…/Template/…` bzw. Repo): Datenschutz und Vertraulichkeit (#2 CL-04/05) · Unterweisungsnachweis_Allgm. Pflichtunterweisung (#1 CL-75) · Unterweisungsnachweis_Arbeitsschutz_DGUV (CL-75) · ODA Einzel- + Sammelunterweisung (#7 CL-22) · Veranstaltung bes. SR Einweisungsnachweis Einzel + Sammel (CL-20/21) · Bestellungsurkunde Brandschutzhelfer (#10 CL-23) · Stellenbeschreibung **BK_Dispo** (= Bürokraft) · Ausgabe Dienstausweis (neu) · Jahresweiterbildung 24UE/40UE (CL-11, für #5).
**❌ fehlen noch:** Stellenbeschreibung **Sicherheitsmitarbeiter** (#3) · Stellenbeschreibung **Führungskraft** (#4) · **Bildschirmarbeitsplatz-Unterweisung** (Büro, #5 — oder bestätigen, dass „Allgm. Pflichtunterweisung" das abdeckt) · **Kfz-/Fahr-Anweisung** (#6 CL-73) · **Mutterschutz-Hinweis** (#8 CL-77) · **Bestellungsurkunde Ersthelfer** (#9 CL-08) · **Bestellungsurkunde SiBe** (#11 CL-74).
**Integration:** Dateien via **Upload-Manager** in den S3-Vorlagen-Bucket → dann wird `vorlagen-set-catalog.ts` auf die realen Dateinamen verdrahtet (`templateMissing` raus). Variantenpaare ODA/Veranstaltung (Einzel vs. Sammel) ggf. als Auswahl modellieren.

## 📥 Eingang 2026-06-10 #2 + Klärungen
**✅ neu erhalten:** Stellenbeschreibung **SMA** (F-20) · Stellenbeschreibung **Führungskraft** (F-20).
**Zugehörigkeit geklärt (Mark):** **FK bekommt Bildschirmarbeitsplatz mit** (arbeiten an PCs) → Bildschirmarbeitsplatz-Unterweisung gehört zu **Bürokraft UND Führungskraft**.
**🔨 Claude erstellt:** **Kfz-/Fahranweisung** (nach Cert-Expert-Stil, Platzhalter `{Automodell}`/`{Kennzeichen}` etc.) · **Mutterschutz-Hinweis** (recherchiert: Merkblatt + Empfangsbestätigung; CL-77 = **MuSchG §10 Gefährdungsbeurteilung / §15 ärztl. Zeugnis / §27 Meldung an Behörde**; Mitteilung der MA freiwillig, keine Form).
**❓ noch offen (Vorlagen):** **Bildschirmarbeitsplatz-Unterweisung** (Template — lieferst du, oder soll ich erstellen?) · **Bestellung Ersthelfer** + **Bestellung SiBe** (lieferst du, oder aus Brandschutzhelfer-Urkunde ableiten?).

## Noch von Mark nachzureichen (separat)
- **Exakte DGUV-Nummern** für die Allgemeine Unterweisung (CL-75).
- Bestätigung **CL-76** (§7 WaffG / §3 Abs.2 AWaffV) und **CL-77** (MuSchG-§).
- Klärung, ob für #9–#11 schon Ernennungs-Vorlagen im S3 liegen oder neu erstellt werden.
