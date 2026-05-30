# Qualifikationssystem V2 — DIN 77200-1 (CEKS)

**Pfad:** `knowledge/1_standards/DIN 77200-1/qualifications/`  
**Version:** V2 (CEKS-Wissensbasis)  
**Vorgänger:** [[../qualifikationssystem/README|Qualifikationssystem V1]] — **bleibt erhalten**, nicht löschen

---

## Zweck

V2 ist das **strukturierte Qualifikationswissen** für Cert-Expert AI: Nachweislogik, Gültigkeiten, SDL-Bezug und Vorbereitung für **Qualifikationsmatrix**, **Personalfreigabe** und **SDL-Freigabelogik**.

| V2 liefert | V2 liefert nicht |
|------------|------------------|
| Qualifikationskatalog mit Prüffeldern | Mitarbeiter-Gesamtlisten |
| Logik Profil → Nachweis → Freigabe | Normabschrift |
| CEKS-/Tool-Vorbereitung | Tool-2-Implementierung (später) |
| Abgrenzung 77200-1 / 77200-2 | Eigenes Qualifikationssystem in 77200-2 |

---

## Lesereihenfolge

| Nr | Datei | Inhalt |
|----|-------|--------|
| 1 | [[01_qualification_system_v2]] | System, Typen, Verhältnis Norm/CEKS/Tool 2 |
| 2 | [[02_qualification_catalog_v2]] | Katalog — je Qualifikation mit Standardfeldern |
| 3 | [[03_matrix_release_hooks_v2]] | Matrix, Personalfreigabe, SDL-Freigabe (Hooks) |

**V1-Baustein-Detail:** weiterhin in `qualifikationssystem/01`–`05` für Audit-Tiefe.

---

## Architekturregel

```
Anforderungsprofil (77200-1 / Anhang C über 77200-2)
        ↓
Qualifikationssystem V2 (dieser Ordner)
        ↓
Freigabeentscheid (später Governance + Tool 2)
        ↓
Einsatz (Projektakte — Tool 2, Perspektive)
```

- **77200-1:** Grundqualifikation, Pflichtnachweise, WB, Freigabelogik  
- **77200-2:** nur **Zusatz**-Schulungen/Einweisungen — [[../../DIN 77200-2/04_qualifikationen_und_schulungen|77200-2 Qualifikationen]]  
- **Governance:** Agentenregeln, später erweiterte Freigabelogik — [[../../Governance/DIN 77200/AGENT_RULES]]

---

## Verwandte Module

| Modul | Rolle |
|-------|-------|
| [[../Anforderungsprofile]] | Input: Tätigkeit + Stufe A/B/C |
| [[../Qualifikationsanforderungen]] | Audit-Modul, Normtiefe |
| [[../Weiterbildung]] | 4.19.2 Detail |
| [[../Führungsanforderungen]] | Führungsqualifikation |
| [[../qualifikationssystem/05_sdl_freigabelogik]] | V1-Freigabemodell |

---

## Verifikation

Inhalte sind CEKS-Interpretation auf Basis DIN 77200-1/-2. Vor Zertifizierungsentscheidungen: Primärquelle `inputs/raw_standards/` und künftig VA Kap. 7 V9.
