# DIN 77200-2 — Qualifikationen und Schulungen

Einstieg: [[README]] · Dokumente: [[03_erforderliche_dokumente]]

---

## Grundsatz

**77200-2 = Zusatzschicht.** Alles Grundlegende liegt in 77200-1:

| Thema | Modul |
|-------|-------|
| Stufen A/B/C, §34a | [[../DIN 77200-1/Qualifikationsanforderungen]] |
| Ersthelfer, Führung, Intervention | [[../DIN 77200-1/Qualifikationsanforderungen]] |
| Weiterbildungs-UE (40/24) | [[../DIN 77200-1/Weiterbildung]] |
| Freigabeentscheid | [[../DIN 77200-1/qualifikationssystem/05_sdl_freigabelogik]] |
| Profil-first | [[../DIN 77200-1/Anforderungsprofile]] |
| SDL-übergreifende Zusatzmatrix | [[../DIN 77200-1/qualifikationssystem/03_sdl_zusatzqualifikationen]] |

77200-2-Module (05–08) beschreiben **SDL-spezifische Schulungen und Einweisungen**.

---

## Bewertungslogik (Agent / Tool-1)

```
INPUT: Auftrag + Profil (Anhang C) + SDL-Modul
  │
  ├─► Schritt 1: Tätigkeiten im Profil → Stufe A/B/C (77200-1)
  ├─► Schritt 2: Pflichtnachweise (Ersthelfer, §34a, …)
  ├─► Schritt 3: SDL-Zusatzschulung Kap. 5–8 erforderlich?
  ├─► Schritt 4: Einweisungen (DI, Objekt, Einsatz)
  ├─► Schritt 5: 4.19.2-WB separat (nicht mit Schritt 3 vermischen)
  └─► OUTPUT: Freigabe ja/nein + fehlende Nachweise
```

---

## Drei Kategorien von „Lernleistung“

| Kategorie | Beispiel | Zählt als 4.19.2-UE? |
|-----------|----------|----------------------|
| **Erstqualifikation / Zusatzschulung 77200-2** | ÖPNV-Schulung, 24-h-FK-Veranstaltung | **Nein** — gesonderte Schulung |
| **Weiterbildung 4.19.2** | Jährliche 40/24 UE | **Ja** — [[../DIN 77200-1/Weiterbildung]] |
| **Einweisung / Unterweisung** | DI-Einweisung, Objektbegehung | **Nein** — [[../DIN 77200-1/Dienstanweisungen]] |

**Agent-Antwort:** Immer Kategorie benennen — vermeidet falsche UE-Anrechnung.

---

## SDL-Zusatzschulungen (Übersicht)

| SDL | Schulung (Praxis) | Umfang (Orientierung) | Detail |
|-----|-------------------|------------------------|--------|
| Kap. 5 Veranstaltung | Schulung für Führungskräfte / Einsatzleitung | ca. **24 UE** (FK-Kontext) | [[05_veranstaltungen_besondere_sicherheitsrelevanz#Typische Schulungen]] |
| Kap. 6 ÖPNV | Schulung auf Basis EK: Verkehrswesen, FEM, Deeskalation | **Schulungsmaßnahme** (Kap. 6.4 — oft **40 UE** in Praxisdiskussion) | [[06_oepnv#Typische Schulungen]] |
| Kap. 7 Objekte | Objekt-/Sicherheitsschulung | projektabhängig | [[07_objekte_besondere_sicherheitsrelevanz#Typische Schulungen]] |
| Kap. 8 Unterkünfte | Unterkunftsspezifische Schulung, Deeskalation | projektabhängig | [[08_fluechtlings_und_asylunterkuenfte#Typische Schulungen]] |

Schulungsinhalte orientieren sich am **EK** — nicht generisch „Sicherheitsunterricht“.

---

## SDL-spezifische Unterweisungen

| Typ | Wann | Beispiel |
|-----|------|----------|
| Verfahren | Nach Schulung, vor Einsatz | Störungsablauf Veranstaltung |
| Technik | Bei Anlagen-Tätigkeiten im Profil | GMA, Zugangssystem, Scanner |
| Lage | Bei wechselnder Lage | Tagesbriefing Unterkunft |

---

## Objektunterweisungen

Pflichtpraxis bei 77200-2:

- **Begehung** mit Protokoll (Datum, Führer, Teilnehmer)
- **Schlüssel/Schließplan** wenn Tätigkeit im Profil
- **Notfallwege** und Sammelpunkte
- **Hausordnung / Betretungsregeln** (bes. Unterkünfte, ÖPNV)

Nachweis in Tool-2: `einweisungen/objekt/`.

---

## Einsatzbezogene Schulungen / Briefings

- Veranstaltung: Briefing vor Einlass (Lage, VIP, Risiko des Tages)
- ÖPNV: Linien-/Baustellen-Update
- Objekt: Anlassbezogen (Wartung, Lieferung, Demo)
- Unterkunft: Konfliktlage, neue Bewohnergruppen

**Nicht** Ersatz für Kap.-Schulung — ergänzend.

---

## Typische Nachweise

| Nachweis | Audit |
|----------|-------|
| Teilnehmerliste Schulung | Name, Datum, UE/Stunden, Thema, Trainer |
| Zertifikat / Kompetenznachweis | Gültigkeit, SDL-Bezug |
| EK-Bezug | Schulung deckt EK-Anforderungen ab |
| Freigabeprotokoll | Welche Rolle im EK mit welcher Schulung |

---

## Häufige Fehler (NC-Vorbereitung)

| Fehler | Korrektur |
|--------|-----------|
| Nur §34a, keine Kap.-6-Schulung bei ÖPNV-Profil | Zusatzschulung nachweisen |
| Stufe aus SDL-Name, nicht aus Profil | Profil-first |
| Einweisung als 40 UE WB gebucht | Kategorien trennen |
| Führungskraft ohne FK-Schulung (Kap. 5) | Rolle im EK ↔ Qualifikation |

---

## Verifikation

Exakte UE-Angaben und Schulungsinhalte Kap. 5.3, 6.4, 7, 8 gegen DIN 77200-2:2020-07 und ggf. Anhang B prüfen.
