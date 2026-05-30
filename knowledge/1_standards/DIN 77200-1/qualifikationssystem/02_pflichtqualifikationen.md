# Pflichtqualifikationen

Eigene Kategorie — **nicht** im Anforderungsprofil abbilden.

Bezug: 4.19.1 (Ersthelfer) · 4.1 b) · 4.14.5 · organisations-/objektbezogene Anforderungen

---

## Leitregel

Pflichtqualifikationen gelten **unabhängig oder ergänzend** zur Profil-Stufe A/B/C. Sie werden in der **Personalakte / Freigabelogik** geprüft, nicht in der Tätigkeitsmatrix des Anforderungsprofils.

---

## Ersthelferqualifikation

**Normanker:** 4.19.1

| Prüfpunkt | Kriterium |
|-----------|-----------|
| Nachweis vorhanden | Abgeschlossene Ersthelferqualifikation dokumentiert |
| Aktualität | Erneuerung mindestens alle **2 Jahre** |
| Status | **aktuell** / **abgelaufen** |
| Nächster Termin | Frist / Erneuerungsdatum |

**Abgrenzung:** Ersthelfer-Erneuerung kann inhaltlich in Weiterbildung vorkommen, bleibt aber **eigenständiger** 4.19.1-Nachweis → [[04_weiterbildungslogik]]

---

## Brandschutzhelfer

**Modellierung:** organisations- und **objektbezogene** Pflichtqualifikation — **nicht** pauschal als DIN-Anhang-A-Anforderung behandeln.

| Prüfpunkt | Kriterium |
|-----------|-----------|
| Organisationsvorgabe | AN/AG-Vorgabe, GB, Objektregelwerk |
| Objektbezug | Für welches Objekt / welche SDL-Verwendung erforderlich? |
| Nachweis | Schulungs-/Bestellungsnachweis |
| Aktualität | Gemäß interner Vorgabe / ArbSchG-Kontext |

**Platzhalter:** Konkrete Fristen und Mindestbesetzung aus **VA Kap. 7 V9** und objektbezogenen Unterlagen nachreichen.

---

## Gesetzliche / interne Pflichtunterweisungen

| Unterweisung | Zweck | Typischer Nachweis | Statusfelder |
|--------------|-------|-------------------|--------------|
| **DGUV-Unterweisung** | Arbeitssicherheit | Teilnahmeprotokoll | vorhanden / fehlt · aktuell / nicht aktuell |
| **Objektbezogene Einweisung** | 3.18, 4.25 — vor erstem Einsatz am Objekt | Einweisungsliste | Datum, Objekt, Verantwortlicher |
| **Datenschutz / Verschwiegenheit** | 4.1 b) 3–5 | Schulung / Erklärung | Datum, Gültigkeit |
| **Dienstanweisung / ODA-Unterweisung** | 4.14.5 — jährliche Unterweisung DI + Gewerberecht | Unterweisungsprotokoll | Jahr, DI-Version |
| **[PLATZHALTER] Gefahrstoffe** | Falls Objekt/Profil relevant | — | — |
| **[PLATZHALTER] Evakuierung / Brandschutzordnung** | Objektbezogen | — | — |
| **[PLATZHALTER] Weitere AG-Pflichtunterweisungen** | Vertrag / GB | — | — |

**Leitregel:** Einweisung und Unterweisung sind **keine** Weiterbildungs-UE (4.19.2) und **keine** Stufe A/B/C.

---

## Prüfebene (pro SMA)

Für jede Pflichtqualifikation:

| Feld | Werte |
|------|-------|
| `erforderlich` | ja / nein / objektbezogen |
| `nachweis_vorhanden` | ja / nein |
| `status` | aktuell / nicht aktuell / offen |
| `naechster_termin` | Datum |
| `bemerkung` | Freitext |

---

## Einfluss auf SDL-Freigabe

Fehlende oder abgelaufene **Pflichtqualifikation** kann Freigabe auf **eingeschränkt** oder **nicht freigegeben** setzen — auch wenn Profil-Stufe A/B/C erfüllt ist → [[05_sdl_freigabelogik]]

---

## Offene Punkte (VA Kap. 7 V9)

- [ ] Vollständige Liste Pflichtunterweisungen aus VA
- [ ] Mindestbesetzung Ersthelfer je Objekt/SDL
- [ ] Brandschutzhelfer-Trigger (Objekttyp, Behördenauflage)
