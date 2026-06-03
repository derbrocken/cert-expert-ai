# Project Container Gap Analysis — Phase 3

**Stand:** 2026-06-03  
**Pflichtdateien pro Kundenprojekt:**  
`Status.md` · `ToDos.md` · `Kommunikation.md` · `Audit_2026.md` · `Dokumente_und_Nachweise.md` · `Lessons_Learned.md`

**Regel dieses Audits:** Es wird **nichts** automatisch angelegt — nur Lückenliste.

---

## 1. Strukturelle Datei-Container (Registry-Kunden)

Alle **7** in `_registry.json` gelisteten Kunden haben **alle 6 Pflichtdateien** auf Branch `cursor/din-77200-1-anforderungsprofile`.

| Kunde | Status | ToDos | Kommunikation | Audit_2026 | Dokumente | Lessons |
|-------|--------|-------|---------------|------------|-----------|---------|
| TeamFlex | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Wolf_Street | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SecuGuard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Schutzritter | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Checkpoint_Regional | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ZT_Security | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| LC_Security | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Struktur-Lücken:** **keine** fehlenden Dateinamen.

---

## 2. Inhaltliche Lücken innerhalb der Container

Struktur ≠ Audit-tauglicher Inhalt. Bewertung Stand 03.06.2026:

| Kunde | Audit_2026 | Status | Kommunikation | Dokumente | Lessons |
|-------|------------|--------|---------------|-----------|---------|
| TeamFlex | 🔴 Template | 🟡 Stub | 🟡 | 🟡 | 🟡 |
| Wolf_Street | 🔴 Template | 🟡 | 🟡 | 🟡 | 🟡 |
| SecuGuard | 🔴 Template | 🟡 | 🟡 | 🟡 | 🟡 |
| Schutzritter | ✅ Termin + Pfad | 🟡 teils gefüllt | 🟡 | 🟡 | 🟡 |
| Checkpoint_Regional | 🔴 Template | 🟡 | 🟡 | 🟡 | 🟡 |
| ZT_Security | 🔴 Template | 🟡 | 🟡 | 🟡 | 🟡 |
| LC_Security | 🔴 Template | 🟡 | 🟡 | 🟡 | 🟡 |

**Schutzritter** ist einziger Kunde mit befülltem `Audit_2026.md` (26.06.2026, kritischer Pfad VK/Formulare).

**TeamFlex / Wolf Street:** Audittermine nur in `ToDos.md`-Header, **nicht** in `Audit_2026.md` übernommen.

---

## 3. Fehlende Kundenprojekt-Ordner (vom Auftraggeber genannt, nicht in Registry)

Diese Themen sind **nicht** als `03_Kundenprojekte/{Kunde}/` mit 6 Dateien angelegt:

| Name | Erwarteter Container | Aktueller Ersatz |
|------|----------------------|------------------|
| **AFAS** (Dump: AVAS) | `03_Kundenprojekte/AFAS/` oder Klärung AVAS | `05_Forderungen/Offene_Juni_2026.md` |
| **Faust** | `03_Kundenprojekte/Faust/` | `05_Forderungen/Offene_Juni_2026.md` |
| **Dennis Kontakt** | optional `03_Kundenprojekte/Dennis/` oder Lead-Ordner | `04_Vertrieb/Angebote_Juni_2026.md` |

**Fehlende Dateien (wenn voller Container gewünscht):** je 6 × obige Kunden = **18 Dateien** (nicht erzeugt).

---

## 4. Vertrieb ohne vollen Kundencontainer

| Name | Status |
|------|--------|
| Miras Protect | Nur TODO in `04_Vertrieb/` — Master Dump: „noch kein HQ-Kundenordner“ |

**Fehlende Dateien bei Miras Protect:** alle 6 Standard-MDs unter `03_Kundenprojekte/Miras_Protect/`.

---

## 5. Zusammenfassung für Entscheidung

| Ebene | Gap |
|-------|-----|
| **Dateinamen** | 0 bei Registry-Kunden |
| **Audit-Inhalt** | 6/7 Kunden `Audit_2026` praktisch leer |
| **Neue Kunden** | AFAS, Faust, Dennis (+ optional Miras) ohne Ordner |
| **Branch `main`** | Gesamter `hq/`-Baum fehlt im Working Tree |

**Empfehlung (nur Planung, nicht ausgeführt):**

1. Nach Klärung AVAS/AFAS: Entscheidung Kundenordner vs. reine Forderung.
2. Audittermine aus `ToDos.md` in jeweilige `Audit_2026.md` spiegeln (manuell).
3. Dennis / Miras: Vertriebs-Lead vs. vollständiger Container festlegen.
