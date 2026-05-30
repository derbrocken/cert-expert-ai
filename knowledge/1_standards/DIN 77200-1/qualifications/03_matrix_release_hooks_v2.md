# Qualifikationsmatrix, Personalfreigabe & SDL-Freigabe — V2 Hooks

Einstieg: [[README]] · Katalog: [[02_qualification_catalog_v2]] · Matrix: [[04_qualifikationsmatrix_logik]] · V1-Modell: [[../qualifikationssystem/05_sdl_freigabelogik]]

**Status:** CEKS-Vorbereitung — **keine** Tool-2-Implementierung, **keine** Personalnamen im Knowledge-Standard.

---

## Qualifikationsmatrix

**Ausgearbeitet:** [[04_qualifikationsmatrix_logik]] (Revierdienst, ÖPNV — Ableitungsalgorithmus + Beispielzeilen).

### Zweck

Die Matrix bildet **Logik** ab, nicht Personen:

```
Profil-Zeile (Tätigkeit + Stufe + Erbringen=Ja)
  → erforderliche Qualifikationscodes (GQ, PQ, SDL, Z772)
  → optional: EW, WB
  → Prüfstatus (später Tool 2)
```

### Schema (V2)

| Spalte | Inhalt |
|--------|--------|
| `profil_ref` | Anhang A/C Zeile |
| `taetigkeit_kurz` | Textreferenz |
| `stufe_gefordert` | A / B / C |
| `ag_erhoehung` | ja/nein |
| `codes_erforderlich` | z. B. `GQ-B-GSSK; PQ-EH; EW-OBJ` |
| `codes_z772` | nur bei 77200-2 |
| `freigabe_kritisch` | ja — blockiert bei Fehlen |

### Beispiel (logisch)

| Profil | Stufe | Codes |
|--------|-------|-------|
| ÖPNV Zeile 6 Alarmverifikation komplex | C | `GQ-C-*`, `PQ-EH`, `Z772-OEPNV`, `EW-OBJ`, `WB-40` |
| Revier Stufe A | A | `GQ-A-34A-S`, `PQ-EH`, `EW-OBJ`, `WB-40` |

**Agent:** Matrix aus Profil + Katalog **ableiten** — nicht hardcodieren je Person.

---

## Personalfreigabe

### Definition (CEKS)

Dokumentierte Entscheidung: Eine **Person** (Referenz-ID, nicht Name im Knowledge) darf für **Verwendung X** eingesetzt werden.

| Feld | Beschreibung |
|------|--------------|
| `freigabe_id` | eindeutige ID |
| `person_ref` | Tool-2-Personenreferenz |
| `verwendung` | Auftrag / Objekt / Rolle / Schicht |
| `profil_ref` | abgestimmtes Profil |
| `codes_geprueft` | Liste Qualifikationscodes |
| `status` | freigegeben / eingeschränkt / nicht freigegeben |
| `begruendung` | Pflicht bei eingeschränkt/nicht |
| `auflagen` | z. B. „WB bis 31.12.“ |
| `gueltig_bis` | optional |
| `pruefer` | Rolle / Datum |

### Entscheidungsregeln (aus V1/V2 vereinheitlicht)

**freigegeben** — alle relevanten Codes: Gültigkeit ok, Nachweis vorhanden.

**eingeschränkt** — Teiltätigkeiten oder Auflagen dokumentiert.

**nicht freigegeben** — mindestens ein kritischer Code fehlt oder abgelaufen.

Detailregeln: [[../qualifikationssystem/05_sdl_freigabelogik#Entscheidungsregeln (Logik)]]

---

## SDL-Freigabelogik

### SDL-Freigabe vs. Personalfreigabe

| Begriff | Ebene |
|---------|-------|
| **SDL-Freigabe** | SMA + **SDL/Verwendung** (technisch identisch mit Personalfreigabe, Fokus SDL) |
| **FK-Freigabe** | Führungsrolle — `FK-*` Codes |

### Prüfbausteine (Konjunktion)

```
☐ Profil — aktive Tätigkeiten + Stufen
☐ GQ-A/B/C — höchste geforderte Stufe
☐ PQ-* — Ersthelfer, DGUV, DI-U, …
☐ SDL-* / Z772-* — Intervention, ÖPNV, …
☐ WB-* — aktuelles Jahr
☐ EW-OBJ / EW-EINS — Einweisung
═══════════════════════════════
→ Freigabeentscheid
```

### Prioritätsregeln

| Konflikt | Ergebnis |
|----------|----------|
| Profil B, Nachweis nur A | **nicht freigegeben** für B |
| Ersthelfer abgelaufen | **nicht freigegeben** (min.) |
| WB knapp unter Soll | **eingeschränkt** mit Auflage |
| 77200-2 ohne Z772-Code | **nicht freigegeben** |

---

## Tool-2-Anbindung (Perspektive)

| Tool-2-Entität | V2-Hook |
|----------------|---------|
| `Person` | `codes[]` mit Gültigkeit |
| `QualificationEvidence` | `code`, `document_id`, `valid_until` |
| `ReleaseDecision` | Schema Personalfreigabe oben |
| `ProjectProfile` | Link Anhang A/C Vorlage |
| `AuditExport` | Matrix + Freigabe + Nachweise |

Governance später: [[../../Governance/DIN 77200/ROADMAP]]

---

## Tool-1-Slots (Orientierung)

| Slot | Typ |
|------|-----|
| `qualification_code` | string |
| `required_for_profile_line` | ref |
| `evidence_status` | enum: ok / missing / expired |
| `release_status` | enum |
| `release_blockers` | code[] |

---

## Abgrenzung Governance

| Thema | V2 (dieser Ordner) | Governance (später) |
|-------|--------------------|---------------------|
| Katalog & Codes | **ja** | Verweis |
| Freigabe-Workflow UI | nein | geplant |
| Tool-2-API | nein | geplant |
| Agent-Onboarding | nein | [[../../Governance/DIN 77200/AGENT_ONBOARDING]] |

---

## Nächste Schritte (Roadmap)

- [x] Ableitungslogik Profil-Zeile → `codes_erforderlich` — [[04_qualifikationsmatrix_logik]]
- [ ] Vollständiger Tool-1-Export aller Profilzeilen (Generator)
- [ ] VA Kap. 7 V9 in Katalog einpflegen
- [ ] Weitere SDL in 04 ergänzen (Intervention, Veranstaltung, …)
- [ ] Personalfreigabe-Vorlage (Tool 2) — **nicht** im Knowledge-Standard

---

## Verifikation

Freigaberegeln vor produktivem Einsatz gegen [[../Qualifikationsanforderungen]] und Primärquelle abstimmen.
