# Cert-Expert AI — SDL & Standard Taxonomy

Version: 1.0 | Erstellt: 2026-05-18 | Status: Initial

Maschinenlesbares Register: `knowledge/blueprints/sdl_registry.json`

---

## Übersicht

Dieses Dokument beschreibt die Taxonomie der Sicherheitsdienstleistungsgruppen (SDLs)
und normativen Grundlagen, auf die sich die Cert-Expert AI Fachbots stützen.

Die Struktur ist bewusst erweiterbar gehalten. Neue SDLs, Subtypen und Blueprints
können hinzugefügt werden ohne das bestehende System umzustrukturieren.

---

## Normative Grundlagen

### Managementsystem-Normen

Diese Normen beschreiben, wie Cert-Expert als Organisation arbeitet.
Sie sind nicht SDL-spezifisch, sondern gelten organisationsübergreifend.

| Norm | Titel | Relevanz |
|---|---|---|
| **ISO 9001** | Qualitätsmanagementsystem | Prozessqualität, Dokumentenlenkung, Nachweisführung |
| **ISO 14001** | Umweltmanagementsystem | Umweltaspekte in Dienstleistungsverträgen |
| **ISO 45001** | Arbeits- und Gesundheitsschutz | Komplementär zu ArbSchG / DGUV V1 — GB-relevant |

### Dienst- und Sicherheitsrecht

Rechtliche Grundlagen, die für alle SDL-Typen gelten:

| Norm / Gesetz | Kurztitel | Relevanz |
|---|---|---|
| ArbSchG §5 | Arbeitsschutzgesetz | Pflicht zur Gefährdungsbeurteilung |
| DGUV Vorschrift 1 | Grundsätze der Prävention | TOP-Prinzip, Schutzmaßnahmen-Hierarchie |
| BewachV / §34a GewO | Bewachungsverordnung | Anforderungen an Sicherheitspersonal |
| VStättVO (länderspezifisch) | Versammlungsstättenverordnung | Veranstaltungen und Versammlungsstätten |

---

## DIN 77200-1 — Sicherungsdienstleistungen: Anforderungen

Definiert die vier Grundtypen von Sicherungsdienstleistungen.
Jede SDL-Gruppe korrespondiert mit einem Knowledge-Pfad unter `knowledge/sdls/`.

```
DIN 77200-1
├── Stationäre Sicherungsdienstleistungen
├── Mobile Sicherungsdienstleistungen
├── Interventionsdienst
└── Veranstaltungsdienst
```

### Stationäre Sicherungsdienstleistungen

- **Knowledge-Pfad:** `knowledge/sdls/objektschutz/`
- **Subtypen:** Standardobjekt, Sondergebäude, Empfangsdienst
- **Dokumente:** GB, SK, ODA
- **Blueprint-Beispiele:** `gb_object_standard`, `gb_object_sondergebaeude`, `oda_standard`

### Mobile Sicherungsdienstleistungen

- **Knowledge-Pfad:** `knowledge/sdls/mobile_sicherheit/`
- **Subtypen:** Streifendienst, Alleinarbeit
- **Dokumente:** GB, EC, ODA
- **Blueprint-Beispiele:** `gb_mobile_service`, `ec_mobile_service`

### Interventionsdienst

- **Knowledge-Pfad:** `knowledge/sdls/interventionsdienst/`
- **Subtypen:** Alarmreaktion, Mobile Interventionseinheit
- **Dokumente:** GB, EC, ODA
- **Blueprint-Beispiele:** `gb_intervention`, `ec_intervention`

### Veranstaltungsdienst

- **Knowledge-Pfad:** `knowledge/sdls/veranstaltungsschutz/`
- **Subtypen:** Kampfsport *(initial)*, Festival, Konzert, Messe, Standard
- **Dokumente:** GB, SK, EC, ODA
- **Blueprint-Beispiele:** `gb_event_kampfsport` *(aktiv)*, `gb_event_festival`, `sk_event_standard`

**Hinweis:** Der Veranstaltungsdienst ist die erste aktiv implementierte SDL-Gruppe
(Subtyp `kampfsport`). Alle anderen Subtypen sind geplant.

---

## DIN 77200-2 — Besondere Anwendungsgruppen

Zusatzanforderungen für SDL-Gruppen mit erhöhtem Schutzbedarf.
Baut auf DIN 77200-1 auf — erfordert immer auch die Basis-SDL-Module.

```
DIN 77200-2
├── Flüchtlingsunterkünfte
├── Objekte mit besonderer Sicherheitsrelevanz
├── Veranstaltungen mit erhöhter Gefährdung
└── ÖPV (Öffentlicher Personenverkehr)
```

### Flüchtlingsunterkünfte

- **Knowledge-Pfad:** `knowledge/sdls/unterkunft/`
- **Subtypen:** Geflüchtetenunterkunft *(initial)*, Gemeinschaftswohnheim
- **Dokumente:** GB, SK, ODA
- **Blueprint-Beispiele:** `gb_accommodation_gefluechtete`
- **Besonderheiten:** Psychosoziale Risiken, Sprachbarrieren, Schutzbedürftigkeit

### Objekte mit besonderer Sicherheitsrelevanz

- **Knowledge-Pfad:** `knowledge/sdls/objektschutz/` (Subtyp `sondergebaeude`)
- **Subtypen:** Kritische Infrastruktur, Behörden / öffentliche Einrichtungen
- **Dokumente:** GB, SK, EC, ODA
- **Blueprint-Beispiele:** `gb_object_special`, `sk_object_special`
- **Besonderheiten:** Erhöhte Schutzziele, ggf. behördliche Auflagen

### Veranstaltungen mit erhöhter Gefährdung

- **Knowledge-Pfad:** `knowledge/sdls/veranstaltungsschutz/` (Subtypen kampfsport, hochrisiko)
- **Subtypen:** Kampfsportveranstaltung *(initial)*, Hochrisiko-Event
- **Dokumente:** GB, SK, EC
- **Blueprint-Beispiele:** `gb_event_kampfsport`, `sk_event_kampfsport`
- **Besonderheiten:** DIN 77200-2-Zusatzanforderungen aktiv, erhöhtes Eskalationspotenzial
- **Hinweis:** Subtyp `kampfsport` teilt Knowledge-Module mit `sdl_veranstaltungsdienst/kampfsport`

### ÖPV — Öffentlicher Personenverkehr

- **Knowledge-Pfad:** `knowledge/sdls/opv/`
- **Subtypen:** Bahnhof / ÖPNV-Knotenpunkt, Fahrzeug-Begleitung
- **Dokumente:** GB, SK, EC, ODA
- **Blueprint-Beispiele:** `gb_opv_standard`, `ec_opv_standard`
- **Besonderheiten:** Öffentlicher Raum, Fahrgastkontakt, Eskalationsprävention

---

## Beziehungsmatrix: Standards × SDLs × Dokumente

| SDL-Gruppe | ArbSchG | DGUV V1 | BewachV | VStättVO | DIN 77200-1 | DIN 77200-2 | ISO 45001 | Dokumente |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| Stationär | ✓ | ✓ | ✓ | — | ✓ | — | ✓ | GB, SK, ODA |
| Mobil | ✓ | ✓ | ✓ | — | ✓ | — | ✓ | GB, EC, ODA |
| Intervention | ✓ | ✓ | ✓ | — | ✓ | — | ✓ | GB, EC, ODA |
| Veranstaltung | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | GB, SK, EC, ODA |
| Unterkunft | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | GB, SK, ODA |
| Objekt besonder | ✓ | ✓ | ✓ | (✓) | ✓ | ✓ | ✓ | GB, SK, EC, ODA |
| Veranstaltung erhöht | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | GB, SK, EC |
| ÖPV | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | GB, SK, EC, ODA |

---

## Wie Blueprints aus dieser Taxonomie entstehen

Ein Blueprint kombiniert immer:
1. **Ein Dokumentprodukt** (GB, SK, EC oder ODA)
2. **Eine SDL-Gruppe** (z. B. Veranstaltungsdienst)
3. **Optional einen Subtyp** (z. B. Kampfsport)

```
Blueprint "gb_event_kampfsport"
  = Produkt:    GB (Gefährdungsbeurteilung)
  + SDL:        Veranstaltungsdienst (DIN 77200-1)
  + Subtyp:     Kampfsport
  + Sonderregel: DIN 77200-2 "Veranstaltungen mit erhöhter Gefährdung" (aktiv)
  + Standards:   VStättVO, DGUV V1, ArbSchG
```

Dieses Kompositionsprinzip bleibt für alle zukünftigen Blueprints identisch.
Das Register (`sdl_registry.json`) ist die Grundlage für die Blueprint-Komposition.

---

## Status-Legende

| Status | Bedeutung |
|---|---|
| `initial` | Struktur definiert, Knowledge-Ordner angelegt, kein Inhalt |
| `planned` | Inhalt ist priorisiert und als nächstes zu befüllen |
| `needs_detailing` | Wird benötigt, aber Anforderungen noch unklar |
| `active` | Knowledge-Modul ist inhaltlich gefüllt und wird vom Bot geladen |

---

## Erweiterungsregeln

1. **Neue SDL:** Eintrag in `sdl_registry.json` → `sdl_groups`. Knowledge-Ordner anlegen. Status `needs_detailing`.
2. **Neuer Subtyp:** In `possible_subtypes` des Eltern-SDL ergänzen. Knowledge-Datei anlegen.
3. **Neues Blueprint:** Blueprint-Config-JSON erstellen. Module aus dieser Taxonomie referenzieren.
4. **Neue Norm:** In `normative_standards` ergänzen. In relevante SDL-Gruppen via `related_standards` eintragen.
5. **Subtypen teilen:** Wenn zwei SDL-Gruppen denselben Subtyp haben (z. B. Kampfsport in DIN 77200-1 und DIN 77200-2), verweisen beide auf dieselbe `knowledge_path`-Datei.
