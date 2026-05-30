# DIN 77200 — Knowledge-Architektur (Dokumenttypen)

**Physischer Pfad:** `knowledge/1_standards/din_77200/`  
**Logische Ebene:** Standards · DIN 77200 · nach **Dokumenttyp** (nicht nach Normteil)

---

## Architekturregel

**Dokumenttyp zuerst. Normteil danach.**

| Ebene | Bedeutung |
|-------|-----------|
| **Dokumenttyp** | z. B. Anforderungsprofil, Qualifikationssystem, Dienstanweisung |
| **Normbezug** | in der Datei: Norm-SDL, Referenz Anhang A / Anhang C, 77200-1 vs. 77200-2 |
| **Beispiele** | ausgefüllte Projektakten → `knowledge/10_examples/` (nicht hier) |

### Entscheidungsregel (Ablage)

| Geltungsbereich | Zielordner |
|-----------------|------------|
| Teil 1 **und** Teil 2 | `din_77200/<dokumenttyp>/` |
| ausschließlich DIN 77200-1 | `din_77200/<dokumenttyp>/part_1/` **oder** Normanker in Datei-Metadaten |
| ausschließlich DIN 77200-2 | `din_77200/<dokumenttyp>/part_2/` **oder** Normanker in Datei-Metadaten |

**Leitplanke:** Keine parallelen Root-Strukturen (`knowledge/standards/` o. Ä.). Alles unter `knowledge/1_standards/`.

---

## Zielstruktur (Dokumenttypen)

```
knowledge/1_standards/din_77200/
├── README.md                    ← dieses Dokument
├── anforderungsprofile/         ← Normvorlagen (leer → Migration)
├── qualifikationssystem/        ← Logik Bausteine 01–05 (leer → Migration)
├── schulungen/                  ← Schulungs-/UE-Logik, VA-Bezug
├── personenfreigaben/           ← SDL-Freigabe, Freigabeentscheidungen (Logik)
├── dienstanweisungen/           ← DI-Vorlagen / DI-Steuerlogik (Standards)
├── gefaehrdungsbeurteilungen/   ← GB-Vorlagen / GB-Logik (Standards)
├── sicherheitskonzepte/         ← SK-Vorlagen / SK-Logik (Standards)
├── einsatzkonzepte/             ← EK-Vorlagen / EK-Logik (Standards)
├── qualifikationsmatrizen/      ← Matrix-Logik Profil ↔ Personal (keine Mitarbeiterliste)
├── part_1/                      ← optional: rein 77200-1-Module (Übergang)
└── part_2/                      ← optional: rein 77200-2-Module (Übergang)
```

### Abgrenzung Schichten

| Schicht | Pfad | Inhalt |
|---------|------|--------|
| **Standards / Vorlagen** | `1_standards/din_77200/` | Wiederverwendbare Dokumenttypen, Logik, Leer-Vorlagen |
| **Norm-Module (Übergang)** | `1_standards/DIN 77200-1/` · `DIN 77200-2/` | CEKS-Detailmodule (overview, Qualifikation, …) — schrittweise entkoppeln |
| **SDL-Fachwissen** | `knowledge/3_sdls/` | SDL-Kontext, keine Normvorlagen duplizieren |
| **Beispiele** | `knowledge/10_examples/` | Ausgefüllte Referenzprojekte |

---

## Dokumenttyp: Anforderungsprofil

Gemeinsame Ablage aller SDL-Vorlagen. Unterscheidung **in der Datei**:

| Feld | Beispiel |
|------|----------|
| Norm-SDL | Empfangsdienst |
| Referenz Anhang | Anhang A Tabelle A.1 Spalte 2 **oder** Anhang C Tabelle C.4 |
| Normteil | 77200-1 / 77200-2 |

**Ziel-SDL-Dateien (nach Migration, dedupliziert):**

77200-1 / Anhang A: Alarmdienst, Empfangsdienst, Kontrolldienst stationär/mobil, Revierdienst, Interventionsdienst, Veranstaltungssicherungsdienst

77200-2 / Anhang C: Veranstaltung besondere Sicherheitsrelevanz, ÖPNV, Objekte besonderer Sicherheitsrelevanz, Flüchtlings- und Asylunterkünfte

---

## Verwandte Systeme

| Consumer | Nutzung |
|----------|---------|
| **KI-Agenten** | Retrieval nach Dokumenttyp (`anforderungsprofile`, `qualifikationssystem`, …) |
| **Tool 1** | Vorlagen + Freigabelogik |
| **Tool 2** | Ausgefüllte Projektdokumente in `10_examples/` |

---

## Status

| Dokumenttyp | Ordner angelegt | Inhalte migriert |
|-------------|-----------------|------------------|
| anforderungsprofile | ja | **nein** — siehe [[MIGRATION]] |
| qualifikationssystem | ja | **nein** |
| schulungen | ja | nein |
| personenfreigaben | ja | nein |
| dienstanweisungen | ja | nein |
| gefaehrdungsbeurteilungen | ja | nein |
| sicherheitskonzepte | ja | nein |
| einsatzkonzepte | ja | nein |
| qualifikationsmatrizen | ja | nein |

**Nächster Schritt:** [[MIGRATION]] — Inventar, Klassifikation, empfohlener Migrationsplan (noch keine automatische Verschiebung).
