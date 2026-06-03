# Öffentlicher Personenverkehr — ÖPNV (Kap. 6)

Einstieg: [[README]] · Übersicht: [[01_uebersicht]]  
**Profil:** [[anforderungsprofile/77200-2_oepnv]] · Anhang C.2

---

## Beschreibung der SDL

Sicherungs- und Kontrolldienstleistungen im **öffentlichen Personenverkehr**: Bahnhöfe, Bahnsteige, Depots, Betriebshöfe, U-Bahn-Knoten, ggf. Fahrzeug-/Wagenhallen — dort, wo Betreiber und Auftraggeber ÖPV-Infrastruktur mit besonderem Schutzbedarf absichern.

Charakteristik: **Wechselnde Lage**, hohe Frequenz, Schnittstelle **Betreiber – Fahrgäste – Polizei – BOS**, oft **Technik** (Video, Zugang, Gefahrenmelder).

---

## Typische Einsatzszenarien

| Szenario | Tätigkeiten (Profil) |
|----------|----------------------|
| Bahnhofskontrolle | Streifen, Zugangskontrolle, Observation |
| Depot / Betriebshof | Schließmittel, Fahrzeugkontrolle, Perimeter |
| Video-Leitstelle | GMA/VMA-Bedienung, Alarmverifikation |
| Fahrzeugbegleitung im Objekt | Rangier-/Wartungsbereich |
| Personen-/Gepäckkontrolle | Scanner, DMD, bei erhöhter Lage |

---

## Typische Risiken

| Risiko | Hinweis |
|--------|---------|
| **Aggression** gegen SMA / Fahrgäste | Deeskalation, Rückzug, Polizei |
| **Suizid / Gleisereignis** | Betreibervorgaben, psychische Belastung SMA |
| **Diebstahl, Schwarzfahren, Vandalismus** | Observation, Intervention im Rahmen des Auftrags |
| **Gefahr durch Fahrzeugverkehr** | Gleisbereich-Regeln, PSA |
| **Technikfehlalarme** | Alarmverifikation, Dokumentation |
| **Gefahrgut / Ladung** | Nur bei Profil-Tätigkeit — spezielle Qualifikation |

---

## Typische Dokumente

| Dokument | Inhalt (praxisnah) |
|----------|-------------------|
| **SK (Betreiber/AG)** | Bahnhofslayout, Gefährdungen, Schnittstellen |
| **EK (AN)** | Streckenplan, Schichten, Alarmabläufe, Eskalation |
| **Profil Anhang C.2** | Technik, Kontrolle, Schließmittel, Verkehrslenkung, … |
| **DI** | Gleisregeln, Hausrecht, Meldewege, Notfall |
| **Strecken-/Linienplan** | EK-Anhang |
| **Alarm- / GMA-Handbuch** | Bei Bedien-Tätigkeiten |

---

## Typische Schulungen

| Schulung | Inhalt (Kap. 6.4 / Praxis) |
|----------|----------------------------|
| **ÖPNV-Schulung auf Basis EK** | Verkehrswesen, **FEM** (Fahrgast-/Einsatzkontext), **Deeskalation** |
| **Technikschulung** | GMA/VMA, Zugangssysteme — wenn im Profil |
| **Gefahrgut-Basis** | nur wenn Tätigkeit 13 im Profil (Ladung/Gefahrgut) |

Orientierung Umfang: in der Praxis oft **40 UE** als Schulungsmaßnahme diskutiert — **gesondert** von 4.19.2-Weiterbildung.

77200-1-Basis: §34a, Stufen aus C.2 (viele Tätigkeiten Stufe A/B, komplexe bis C).

---

## Typische Einweisungen

- Strecken-/Bahnhofbegehung (Gefahrenstellen, Rückzugswege)
- GMA-/Technikeinweisung am Objekt
- Schichtbriefing (Baustellen, Sonderlagen, Polizeilage)
- Betreiber-Schnittstelle (Ansprechpartner, Stichworte)

---

## Typische Nachweise

| Nachweis | Audit |
|----------|-------|
| ÖPNV-Schulung (Kap. 6) | Teilnehmerliste, Stunden/UE, EK-Bezug |
| Technik-Einweisung | Pro Objekt/Anlage, wenn profilrelevant |
| Profil C.2 | Tätigkeiten mit Stufen |
| Schließmittelprotokoll | Bei Tätigkeit 10/11 |
| Alarmprotokolle | Bei Leitstellen-Tätigkeit |

---

## Profil-Tätigkeiten (Orientierung Anhang C.2)

C.2 umfasst u. a.: Video/GMA-Bedienung, Überwachung, Technik/Notschaltung, Öffnen/Schließen, Zugangskontrolle, Alarmverifikation, Fahrzeug-/Ladungskontrolle, Personen-/Gepäckkontrolle mit Scanner, Verkehrslenkung — je nach Komplexität Stufe A–C.

Vollmatrix: [[anforderungsprofile/77200-2_oepnv]].

---

## Agent / Tool-1

- Slot `sdl_group`: `kap6`
- Bei „Bahnhof“ / „ÖPNV“: Modul 06 + Profil C.2 laden
- Technik-Tätigkeiten im Profil → Technikeinweisung als Pflichtnachweis
- ÖPNV-Schulung und WB-UE **getrennt** ausgeben

---

## Verifikation

Kap. 6.4 Schulungsinhalt und UE-Angabe gegen DIN 77200-2:2020-07 und Anhang B prüfen.
