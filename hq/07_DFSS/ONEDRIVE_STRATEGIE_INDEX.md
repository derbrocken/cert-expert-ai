# DFSS / Strategie — OneDrive Source of Truth

**Stand:** 2026-06-05  
**Pfad (Mac):** `/Users/marwanmahra/Library/CloudStorage/OneDrive-Cert-Expert/QM/Strategie/`

> **Nicht verschieben.** OneDrive bleibt QM-Master für Word/Excel/PDF.  
> `hq/07_DFSS/` = operative Spiegel + Index + JSON/Handoffs für HQ-Assistent und DFSS-Chatbot.

---

## Ordnerstruktur

| Ort | Inhalt | Rolle |
|-----|--------|-------|
| `QM/Strategie/` | Vision, Mission, Leitbild, Roadmap, Pilot-Templates | Unternehmens- & DFSS-Rahmen |
| `QM/Strategie/DFFS/` | DMADV-Artefakte (VOC, QFD, CTS, Validation, …) | DFSS-Projektordner *(Ordnername „DFFS“ auf OneDrive — Inhalt = DFSS)* |
| `QM/Strategie/DFFS/draft/` | VOC/KANO/CTS/AHP Entwürfe | Archiv V1 |
| `hq/07_DFSS/` | Pilot-Messungen P05, P-HIST-*, Synthesis-Kopie, JSON | Git / AI-Arbeitskopie |

---

## Unternehmen (Vision / Mission / Strategie) — **geparkt**

| Datei | Thema | Git-Park |
|-------|--------|----------|
| `Cert-Expert Vision 2036.docx` | Vision | [`STRATEGIE_PARK.md`](../08_Vorlagen/Strategie/STRATEGIE_PARK.md) |
| `CERT_EXPERT_MISSION.docx` | Mission | ↑ |
| `CERT_EXPERT_LEITBILD.md-2.docx` | Leitbild | ↑ |
| `Cert-Expert Philosophie.docx` | Philosophie (Mantis) | ↑ |
| `Cert-Expert Business Architecture.docx` | Business Architecture | ↑ |
| `CERT_EXPERT_MASTER_PLAN.docx` | Master Plan (Themenkatalog) | ↑ |
| `CERT_EXPERT_ROADMAP_2026.docx` | Roadmap 2026 | ↑ |
| `CERT_EXPERT_TACTICAL_GOALS_2026_2028.pdf` | Taktische Ziele | ↑ |

**Kurzreferenz + Manifest:** [`hq/08_Vorlagen/Strategie/`](../08_Vorlagen/Strategie/README.md) — Inhalte **gelesen 2026-06-05**, OneDrive bleibt Master.

---

## DFSS Framework (`DFFS/`)

| Datei | Phase / Artefakt |
|-------|------------------|
| `DFSS_VOC_V2_FINAL.docx` | Voice of Customer |
| `DFSS_VOC_v2.md.pdf` | VOC (PDF) |
| `DFSS_KANO_V2_FINAL.docx` | Kano |
| `DFSS_CTS_TREE_V2_FINAL.docx` | CTS Tree |
| `DFSS_QFD_HOUSE_OF_QUALITY_V2_Matrix_Cert_Expert.xlsx` | House of Quality |
| `DFSS_QFD_GATE_REVIEW_V1_Cert_Expert.docx` | QFD Gate Review |
| `DFSS_PRODUCT_ARCHITECTURE_MAPPING_V1_Cert_Expert.docx` | Product Architecture |
| `DFSS_PRODUCT_ARCHITECTURE_MAPPING_GATE_REVIEW_V1_Cert_Expert.docx` | PAM Gate Review |
| `DFSS_DESIGN_REQUIREMENTS_MATRIX_V1_Cert_Expert_TRACE_ALIGNED.xlsx` | Design Requirements Matrix |
| `DFSS_DESIGN_REQUIREMENTS_GATE_REVIEW_V1_Cert_Expert.docx` | DR Gate Review |
| `DFSS_TRACEABILITY_MATRIX_V1_Cert_Expert.xlsx` | Traceability |
| `DFSS_VALIDATION_PLAN_V1_Cert_Expert.docx` | Validation Plan |
| `DFSS_VALIDATION_PLAN_GATE_REVIEW_V1_Cert_Expert.docx` | Validation Plan Gate |
| `DFSS_VALIDATION_EXECUTION_PROTOCOL_V1_Cert_Expert.docx` | Validation Execution |
| `DFSS_PILOT_VALIDATION_PACK_V1_Cert_Expert.docx` | Pilot Validation Pack |
| **`DFSS_CROSS_CASE_BASELINE_SYNTHESIS_V1_Cert_Expert_2026-06-05.docx`** | **Cross-Case Synthesis (4 Cases)** |

---

## Pilot Measurement (Strategie-Ebene, OneDrive)

| Datei | Rolle |
|-------|--------|
| `DFSS_PILOT_MEASUREMENT_ACTIVATION_TEMPLATE_V1_Cert_Expert_BILINGUAL.docx` | Word-Vorlage |
| `DFSS_PILOT_MEASUREMENT_ACTIVATION_LOG_V1_Cert_Expert.docx` | Aktivierungs-Log |
| `DFSS_PILOT_EXECUTION_DATA_REQUEST_LIST_V1_Cert_Expert.docx` | Datenanforderungsliste |
| `DFSS_PILOT_MEASUREMENT_ACTIVATION_P05_SecuGuard_UPDATED_2026-06-05.docx` | P05 Master (OneDrive-Kopie) |

**Historische / Live Messungen in Git:** siehe [`DFSS_HISTORICAL_INDEX.md`](DFSS_HISTORICAL_INDEX.md) + P05 in `hq/07_DFSS/`.

---

## Cross-Case Synthesis — Gate (2026-06-05)

**Input:** P05 SecuGuard · P-HIST-01 LC · P-HIST-SC-01 TeamFlex · P-HIST-02 LC Extension

| Frage | Entscheidung |
|-------|--------------|
| Genug Cross-Case-Evidence? | **Ja** — 4 Falltypen abgedeckt |
| Pilot Validation Report jetzt? | **Nein** — noch live O2C/Forms (z. B. Schutzritter) |
| Controlled Development Preparation? | **Ja, mit Controls** |
| Harte Zielwerte setzen? | **Nein** |

**Spiegel in Git:** [`DFSS_CROSS_CASE_BASELINE_SYNTHESIS_V1_Cert_Expert_2026-06-05.docx`](DFSS_CROSS_CASE_BASELINE_SYNTHESIS_V1_Cert_Expert_2026-06-05.docx)

---

## Sync-Regel (empfohlen)

1. **Bearbeiten** → immer OneDrive `QM/Strategie/`
2. **Nach Update** → relevante Dateien nach `hq/07_DFSS/` kopieren (nicht den ganzen Ordner verschieben)
3. **Index** → diese Datei + `README.md` pflegen
4. **Kunden-To-dos** → nur aus live Cases (P05), nicht aus Synthesis
