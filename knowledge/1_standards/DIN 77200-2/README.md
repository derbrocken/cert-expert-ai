# DIN 77200-2 — Wissensbasis besondere Sicherheitsdienstleistungen

**Pfad:** `knowledge/1_standards/DIN 77200-2/`  
**CEKS-Rolle:** Fachwissensbasis für **besondere SDL** — ergänzend zu [[../DIN 77200-1/overview|DIN 77200-1]]

---

## Wofür dieser Bereich da ist

DIN 77200-2 beschreibt Sicherheitsdienstleistungen in **hoch sensiblen Einsatzkontexten**: große Veranstaltungen, ÖPNV, kritische Objekte, Unterkünfte. Cert-Expert nutzt diese Module für:

| Nutzer | Funktion |
|--------|----------|
| **Agenten / RAG** | Routing: „Ist 77200-2 anwendbar?“ → SDL-Modul → Dokumente → Qualifikation |
| **Tool 1** | Slots für SK/EK-Bezug, Profil Anhang C, Zusatzschulung, Freigabe |
| **Tool 2** | Projektakte: welche Nachweise je Auftrag/SDL fehlen |
| **Dokumentenerstellung** | Inhaltliche Leitplanken für EK, DI, Schulungsplan — **keine Vorlagen hier** |

**Grundregel:** Qualifikation, A/B/C, Ersthelfer, Führung, Weiterbildungs-UE → immer [[../DIN 77200-1/overview|77200-1]].  
77200-2 liefert **Zusatzanforderungen** (SK/EK-Pflicht, Anhang C, SDL-Schulungen, Einsatzlogik).

Governance: [[../Governance/DIN 77200/README|Governance DIN 77200]]

---

## Modulstruktur

| Nr | Modul | Agent lädt bei … |
|----|-------|------------------|
| — | [[01_uebersicht\|Übersicht]] | Erstfrage „77200-2?“, SDL-Zuordnung |
| 02 | [[02_allgemeine_anforderungen\|Allgemeine Anforderungen]] | SK/EK, Risiko, Einweisung, Nachweise allgemein |
| 03 | [[03_erforderliche_dokumente\|Erforderliche Dokumente]] | Dokumentenkette, Audit-Spur |
| 04 | [[04_qualifikationen_und_schulungen\|Qualifikationen & Schulungen]] | Zusatzschulung vs. 77200-1-UE |
| 05–08 | SDL-Module | Konkreter Einsatzkontext |

**Vorlagen Profil:** [[anforderungsprofile/README|Anhang C]]

---

## Agent-Routing (Kurz)

```
Frage enthält: Veranstaltung + Massenlage / ÖPNV / Bahnhof / Unterkunft / KRITIS-Objekt?
  → 01_uebersicht: 77200-2 anwendbar?
  → ja: SDL-Modul 05–08 + 03 + 04
  → Profil: Anhang C-Vorlage + 77200-1 Anforderungsprofile-Logik
  → Qualifikation: erst 77200-1, dann Zusatzschulung 77200-2
```

**Veranstaltung ohne 77200-2-Tatbestand:** nur [[../DIN 77200-1/Anforderungsprofile|77200-1 Anhang A]] — kein automatisches SK/EK.

---

## Lesereihenfolge

1. [[01_uebersicht]]
2. [[02_allgemeine_anforderungen]]
3. SDL-Modul (05–08)
4. [[03_erforderliche_dokumente]]
5. [[04_qualifikationen_und_schulungen]] + 77200-1-Qualifikationsmodule
6. [[anforderungsprofile/README|Anforderungsprofil-Vorlage]]

---

## Verifikation

Fachliche Kerne in diesen Modulen sind für Agentenbetrieb **ohne geöffnete Norm** nutzbar. Vor Zertifizierungsentscheidungen oder Vertragsauslegung: Stufen, UE-Zahlen und Tatbestandskriterien gegen `inputs/raw_standards/` (DIN 77200-2:2020-07) prüfen.
