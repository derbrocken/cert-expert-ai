# Veranstaltungen mit besonderer Sicherheitsrelevanz (Kap. 5)

Einstieg: [[README]] · Übersicht: [[01_uebersicht]]  
**Profil:** [[anforderungsprofile/77200-2_veranstaltung_besondere_sicherheitsrelevanz]] · Anhang C.1

---

## Beschreibung der SDL

Sicherheitsdienst bei **Veranstaltungen**, die der Auftraggeber als **besonders sicherheitsrelevant** einstuft — typisch bei hoher Personenzahl, erhöhter Konflikt- oder Anschlagsgefahr, komplexer Venue oder hohem Medieninteresse.

**Nicht** jede Veranstaltung: Stadtfest ohne Einstufung → [[../DIN 77200-1/Anforderungsprofile|77200-1 Veranstaltungssicherungsdienst, Anhang A]].

**Auslöser (Praxis):** AG führt Einzelfallbewertung durch (Menschenmenge, Art der Veranstaltung, Lage, Vorgeschichte, Bedrohungslage) und beauftragt nach 77200-2.

---

## Typische Einsatzszenarien

| Szenario | SMA-Rollen (typisch) |
|----------|----------------------|
| Großkonzert / Festival | Einlass, Zonen, Backstage-Schutz, Crowd, Abschirmung |
| Sport-Topspiel | Einlasskontrolle, Blocktrennung, Deeskalation |
| Politische Großveranstaltung | Zugangskontrolle, VIP-Schutz, Medienabgrenzung |
| Messe mit Sicherheitsstufe | Ausweiskontrolle, Lieferantenverkehr, Nachtbewachung |

Planung über **Zeitachse**: Aufbau → Einlass → Veranstaltung → Abbau.

---

## Typische Risiken

| Risiko | Maßnahme (Planung) |
|--------|-------------------|
| **Crowd Crush** / Enge | Kapazitätsgrenzen, Einlasssteuerung, Fluchtwege im SK/EK |
| **Gewalt / Randale** | Deeskalation, Trennung, Polizei-Schnittstelle |
| **Einlasswaffen / Gegenstände** | Personen- und Gepäckkontrolle (wenn im Profil) |
| **Evakuierung** | Szenarien, Sammelpunkte, Kommunikation |
| **Medien / Social Media** | Verhaltenregeln in DI |
| **Wetter / Open Air** | Plan B, Versorgung, Abbau |

---

## Typische Dokumente

| Dokument | Inhalt (praxisnah) |
|----------|-------------------|
| **SK (AG)** | Gefährdung, Zonenplan, Kräftebedarf, Polizei/Rettung |
| **EK (AN)** | Abschnitte, Funk, Einlassablauf, Störung, Evakuierung |
| **Profil Anhang C** | Tätigkeiten: Kontrolle, Lenkung, Abschirmung, … + Stufen |
| **DI** | Verhalten, Hausrecht, Einlassregeln, Meldewege |
| **Lageplan / Zonenplan** | Anhang zu EK/DI |
| **Schichtplan** | Rollen, Qualifikation, Freigabe |

SK + EK **Pflicht** bei 77200-2 Kap. 5.

---

## Typische Schulungen

| Schulung | Zielgruppe | Inhalt (typisch) |
|----------|------------|------------------|
| **FK-/Leitungsschulung Kap. 5** | Einsatzleiter, Gruppenführer | Lageführung, Kommunikation, Recht, Crowd — ca. **24 UE** |
| **Veranstaltungsschulung AN** | alle relevanten SMA | Ablauf, Deeskalation, Einlass, Teamarbeit |
| **Deeskalation** | Einlass, Publikumsnähe | Kommunikation, Recht, Gewaltvermeidung |

Zusätzlich 77200-1: §34a, Stufe B/C aus Profil, Ersthelfer wenn vorgesehen.

**Abgrenzung:** Kap.-5-Schulung ≠ 4.19.2-WB-UE — [[04_qualifikationen_und_schulungen]].

---

## Typische Einweisungen

- Venue-Begehung (Fluchtwege, Einlass, Backstage)
- Tagesbriefing (Lage, VIP, Risiko des Tages)
- Funk- und Meldetest
- DI-Einweisung mit Unterschrift

---

## Typische Nachweise

| Nachweis | Audit |
|----------|-------|
| AG-Einstufung „besondere Relevanz“ | SK oder Vertragsanlage |
| Profil Anhang C, abgestimmt | Version, Datum |
| FK-Schulung (24 UE) | Zertifikat/Lehrgangsnachweis Führungskraft |
| Einweisungslisten Eventtag | Schichtprotokolle |
| Personalfreigabe je Rolle | Freigabeprotokoll |

---

## Profil-Tätigkeiten (Orientierung Anhang C)

Häufige Tätigkeitsgruppen in C.1: Personen-/Gepäckkontrolle, Lenkung/Lotung, Observation, Abschirmung, Zugangskontrolle, Verkehrslenkung — je mit Stufen A/B/C nach Komplexität.

Detailmatrix: [[anforderungsprofile/77200-2_veranstaltung_besondere_sicherheitsrelevanz]].

---

## Agent / Tool-1

- Slot `sdl_group`: `kap5`
- Prüfreihenfolge: SK → Profil C.1 → EK → Qualifikation 77200-1 → FK-Schulung → Freigabe
- Warnung wenn nur Anhang A ohne C bei „besondere Relevanz“-Aussage

---

## Verifikation

Einzelfallkriterien Kap. 5.1 und exakter Umfang FK-Schulung Kap. 5.3 gegen DIN 77200-2:2020-07 prüfen.
