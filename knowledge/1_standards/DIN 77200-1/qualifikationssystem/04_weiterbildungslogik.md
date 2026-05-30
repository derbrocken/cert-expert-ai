# Weiterbildungslogik

Eigene Prüfebene — Ergänzung zu Erstqualifikation (01) und Pflichtqualifikationen (02).

Bezug: 4.19.2 · 4.19.1 (Auffrischung) · [[Weiterbildung]]

---

## Leitregel

Weiterbildung **frischt jährlich** Qualifikationsinhalte auf. Sie ersetzt **nicht**:

- Erstqualifikation (§34a, B/C-Zeugnis, 24-h-Intervention),
- Einweisung (3.18) / Unterweisung (4.14.5) — **keine UE**,
- Ersthelfer-Erneuerung als eigenständigen 4.19.1-Nachweis.

---

## Normative Mindestanforderungen (77200-1)

| Beschäftigung | Mindest-UE/Jahr | UE-Dauer |
|---------------|-----------------|----------|
| **Vollzeit** | **40 UE** | je **45 min** |
| **Nicht Vollzeit** | **24 UE** (reduzierbar) | je **45 min** |

| Regel | Inhalt |
|-------|--------|
| Konzept | Schriftlich, **verwendungsbezogen** (4.19.2) |
| Bedarf | Verwendung, persönliche Voraussetzungen, Entwicklung |
| Form | Empfehlung Präsenz; Distance Learning max. **50 %**, qualitätsgesichert |
| Auffrischung | Inhalte der 4.19.1-Qualifikation **jährlich** im Konzept verankert |

---

## DIN 77200-2 — Ergänzungen

| Aspekt | Status |
|--------|--------|
| Zusatz-UE / WB bei besonderen SDL | **[PLATZHALTER]** — Kap. 7–8, Teil-2-Schulungen |
| Verwendungsbezug über EK | Qualifikation/Schulung „auf Grundlage Einsatzkonzept“ |
| Abgrenzung 77200-1 UE vs. 77200-2 Zusatz | **[PLATZHALTER]** — nach Schulungsdocs |

---

## Prüfebene (pro SMA / Jahr)

| Feld | Werte / Inhalt |
|------|----------------|
| `jahr` | Kalenderjahr |
| `beschaeftigung` | vollzeit / teilzeit |
| `ue_soll` | 40 / 24 / abweichend dokumentiert |
| `ue_ist` | Summe nachgewiesener UE |
| `status_ue` | **aktuell** / **nicht aktuell** |
| `nachweise` | **vorhanden** / **fehlen** / **teilweise** |
| `naechster_termin` | Plantermin / Jahresfrist |
| `qualifikation_auffrischung` | welche 4.19.1-Inhalte adressiert |
| `abgrenzung_einweisung` | bestätigt: keine Doppelzählung |

---

## Statuslogik (vereinfacht)

```
UE-Ist >= UE-Soll UND Nachweise vollständig UND Konzeptbezug dokumentiert
  → Weiterbildungsstatus: aktuell

UE-Ist < UE-Soll ODER Nachweise lückenhaft
  → Weiterbildungsstatus: nicht aktuell
  → SDL-Freigabe: eingeschränkt oder nicht freigegeben (05)
```

---

## Themenmatrix (Orientierung)

| Themenfeld | Bezug | Modul |
|------------|-------|-------|
| Gewerberecht / Bewachungsrecht | Auffrischung 4.19.1 | [[Qualifikationsanforderungen]] |
| Deeskalation | Profil / DI | [[Dienstanweisungen]] |
| Erste Hilfe (Erneuerung) | 2-Jahres-Zyklus — **eigener** Nachweis | [[02_pflichtqualifikationen]] |
| Technik / GMA | wenn Profil Tätigkeit vorsieht | Anhang A |
| 77200-2 Objekt/Unterkunft | **[PLATZHALTER]** Zusatz-UE | [[03_sdl_zusatzqualifikationen]] |

Themen aus **Anforderungsprofil / Verwendung** ableiten — nicht pauschal je SDL.

---

## Platzhalter (Schulungsdokumente)

- [ ] **40 UE** — detaillierte Themenpflichten aus VA Kap. 7 V9
- [ ] **24 UE** — Teilzeit-Reduktionsregeln im Detail
- [ ] **Teil-2-Schulungen** 77200-2 — Zuordnung zu UE vs. Erstqualifikation
- [ ] UE-Anerkennung externer Anbieter / Distance Learning QS-Checkliste

---

## Verwandtes

Detailmodul: [[Weiterbildung]] · Freigabe: [[05_sdl_freigabelogik]]
