# Objekte besonderer Sicherheitsrelevanz (Kap. 7)

Einstieg: [[README]] · Übersicht: [[01_uebersicht]]  
**Profil:** [[anforderungsprofile/77200-2_gebaeude_besondere_sicherheitsrelevanz]] · Anhang C.3

---

## Beschreibung der SDL

**Stationäre oder langfristige** Sicherung von Gebäuden und Anlagen mit **besonderer Sicherheitsrelevanz** — z. B. kritische Infrastruktur, sensible Behörden, Forschung, Rechenzentren, Hochsicherheitsbereiche (Einzelfall nach AG-Bewertung).

Charakteristik: **Dauerbezug zum Objekt**, hohe Anforderungen an Zutrittskontrolle, Technik, Verschwiegenheit, oft **mehrstufige Sicherheitszonen**.

---

## Typische Einsatzszenarien

| Szenario | Tätigkeiten |
|----------|-------------|
| Rechenzentrum / IT-Security-Objekt | Zutrittskontrolle, Video, Alarmverifikation |
| Forschungseinrichtung | Laborsperrbereiche, Lieferantenverkehr |
| Behörde / Hochsicherheitsbau | Ausweiskontrolle, Schließmittel, Revier |
| Industrieanlage (KRITIS-nah) | Perimeter, Technik, Gefahrenmelder |
| Langzeit-Revier mit Technik | GMA, Notschaltungen, Schließmittelverwaltung |

---

## Typische Risiken

| Risiko | Hinweis |
|--------|---------|
| **Unbefugter Zutritt** | Ausweissysteme, Besuchermanagement |
| **Sabotage / Diebstahl** | Sensitive Bereiche, Lieferketten |
| **Brand / Technikausfall** | BMA, Evakuierung, Notfallprozeduren |
| **Insider-Bedrohung** | Protokolldisziplin, Vier-Augen wo vorgesehen |
| **Langeweile / Routine** | Qualitätssicherung bei Revierdienst |
| **Datenschutz / Geheimnisschutz** | DI-Regeln, Kameraführung |

---

## Typische Dokumente

| Dokument | Inhalt (praxisnah) |
|----------|-------------------|
| **SK (AG)** | Schutzbedarf, Zonen, Bedrohungsanalyse |
| **EK (AN)** | Besetzung, Schichten, Alarmabläufe, Eskalation |
| **Profil Anhang C.3** | Tätigkeiten + Stufen — oft höhere Stufen bei komplexen Tätigkeiten |
| **Objekt-DI** | Zonen, Schlüssel, Besucher, Technik, Notfall |
| **GB** | Arbeits- und Anlagengefährdungen |
| **Schließmittelregister** | Bei Schließmittel-Tätigkeiten |
| **Besucherprotokoll** | Bei Empfang/Lenkung |

---

## Typische Schulungen

| Schulung | Zielgruppe |
|----------|------------|
| **Objekt-/Sicherheitsschulung** | alle SMA am Objekt — Gefährdung, Zonen, Technik |
| **Technik (GMA, Zutritt)** | Leitstelle / Technikposten |
| **Branchenspezifisch** | z. B. Laborregeln, IT-Security Awareness |
| **Deeskalation** | Empfang, Zugangskontrolle |

77200-1: Stufen aus C.3 — komplexe Alarmverifikation oder Verkehrslenkung können **Stufe C** erfordern.

Zusatz-WB Kap. 7 ggf. über 4.19.2 — **zusätzlich** zu Objektschulung, siehe [[04_qualifikationen_und_schulungen]].

---

## Typische Einweisungen

- Objektbegehung mit Zonenplan
- Technikeinweisung (GMA, Zutrittsleser, Notschaltung)
- Wechsel-Einweisung bei Objektänderung / Umbau
- Quartals-Briefing bei Langzeiteinsatz

---

## Typische Nachweise

| Nachweis | Audit |
|----------|-------|
| Objektschulung | Thema, Datum, Objekt-ID |
| Schließmittel-Ausgabe | Protokoll, Vollständigkeit |
| Alarm-/Störungsprotokolle | Bei Leitstelle |
| Profil C.3 + Freigabe | Rolle ↔ Tätigkeit ↔ Stufe |
| GB-Bezug | Aktualität bei Änderungen |

---

## Profil-Tätigkeiten (Orientierung Anhang C.3)

Analog C.2-Struktur: Überwachung, Technik, Schließmittel, Zugang, Alarmverifikation, Fahrzeug-/Personenkontrolle — Stufen je nach Einfachheit/Komplexität der Aufgabenverrichtung.

Vollmatrix: [[anforderungsprofile/77200-2_gebaeude_besondere_sicherheitsrelevanz]].

---

## Agent / Tool-1

- Slot `sdl_group`: `kap7`
- Langzeiteinsatz → jährliche Profil-/DI-Review besonders prüfen
- Schließmittel-Tätigkeit → Schließmittelprozess aus 77200-1 mitladen

---

## Verifikation

Tatbestand „besondere Sicherheitsrelevanz“ Kap. 7.1 und objektspezifische Schulungsanforderungen gegen Primärquelle prüfen.
