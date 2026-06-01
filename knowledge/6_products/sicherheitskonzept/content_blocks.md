# Produkt: SK — Inhaltsblöcke (`SK_*`-Platzhalter)

Geplanter Referenz-Blueprint: `sk_event_standard` (siehe `docs/BLUEPRINT_ARCHITECTURE.md`).
Welche Blöcke aktiv sind, steht im jeweiligen Blueprint-JSON (`ai_blocks`).

---

## `{SK_SCHUTZZIEL}` — Schutzziel

**Was:** Übergeordnetes Sicherheits- und Schutzziel des Events/Objekts.
**Inhalt:**
- Was geschützt wird (Personen, Ablauf, Infrastruktur — aus Input).
- Rahmen: Veranstaltungstyp, Ort, Zeitraum (nur belegt).
- Abgrenzung: Was der Sicherheitsdienst **nicht** allein verantwortet.

**Stil:** 4–8 Sätze. Keine Maßnahmenliste (gehört in Schutzmaßnahmen).

---

## `{SK_GEFAEHRDUNGSANALYSE}` — Gefährdungsanalyse (Gesamtperspektive)

**Was:** Gefährdungen aus Veranstalter-/Gesamtsicht — breiter als GB (Publikum, Lage, Organisation).
**Inhalt:**
- Kategorien: Publikum, Gelände/Infrastruktur, Organisation, Schnittstellen, besondere Umstände.
- Bezug zu SDL-Subtyp (`3_sdls/veranstaltungsschutz/subtypes/`) — nur plausibel für Input.
- Keine erfundenen Vorfälle oder Statistiken.

**Abgrenzung zu GB:** SK = Gesamtkonzept; GB = arbeitsschutzliche Bewertung für SMA-Tätigkeit.

---

## `{SK_SCHUTZMASSNAHMEN}` — Schutzmaßnahmen (organisatorisch/gesamt)

**Was:** Maßnahmenrahmen auf Konzeptebene (Zonen, Einlass, Crowd, Eskalation, Schnittstellen).
**Inhalt:**
- Organisatorische und ggf. technische Maßnahmen — **ohne** erfundene Kopfzahlen.
- Eskalations- und Meldelogik (Prinzip, nicht erfundene Telefonnummern).
- Verweis auf Behörden/Polizei/Sanität nur als Schnittstelle, wenn Input/Absprache belegt.

**Stil:** Verbindlich formulieren, wo Auftrag/Konzept es hergibt; sonst `[OFFENER PUNKT]`.

---

## `{SK_VERANTWORTLICHE}` — Verantwortliche

**Was:** Rollen und Zuständigkeiten (Veranstalter, Einsatzleitung SD, Schnittstellen).
**Inhalt:**
- Veranstalter / Veranstaltungsleitung.
- Cert-Expert Einsatzleitung (Rolle, nicht erfundene Person).
- Sanität, Polizei, Technik — nur als Rolle/Schnittstelle.

---

## `{SK_KOMMUNIKATION}` — Kommunikation

**Was:** Lage- und Meldestruktur auf Konzeptebene.
**Inhalt:**
- Wer informiert wen bei welcher Lage (Prinzip).
- Funk/Notfallkommunikation — nur wenn im Input oder Konzept.
- Keine erfundeten Kanäle oder Rufnummern.

---

## `{SK_OFFENE_PUNKTE}` — Offene Punkte

**Was:** Konsolidierte Liste offener Planungs- und Freigabepunkte.
**Inhalt:** Nummeriert, mit Relevanz. Pre-open-points + Bot-Befunde.
**Pflicht:** Fehlende AG-Freigabe / unvollständiges Lagebild → `[OFFENER PUNKT]`.

---

## Nicht in jedem Blueprint

Event-spezifische Erweiterungen (Evakuierungsplan als eigener Block, Lagekarten) nur,
wenn im Blueprint als `ai_blocks` definiert. Namespace: ausschließlich `SK_*`.
