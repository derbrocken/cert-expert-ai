# Benötigte Dokumentvorlagen (Tool 2 — Set-Mapping + Overlays)

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

## Noch von Mark nachzureichen (separat)
- **Exakte DGUV-Nummern** für die Allgemeine Unterweisung (CL-75).
- Bestätigung **CL-76** (§7 WaffG / §3 Abs.2 AWaffV) und **CL-77** (MuSchG-§).
- Klärung, ob für #9–#11 schon Ernennungs-Vorlagen im S3 liegen oder neu erstellt werden.
