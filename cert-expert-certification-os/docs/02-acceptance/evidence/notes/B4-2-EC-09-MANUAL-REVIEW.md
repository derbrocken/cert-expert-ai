# B4.2 EC-09 Manual Review — Standardpersonalakte Baseline

**Date:** 2026-06-05  
**Source ZIP:** `docs/02-acceptance/evidence/exports/baseline-employee.zip`  
**Generator run:** B3.5 Round 3 (`Round3 Test Employee`, Hetzner GetObject)  
**Review method:** Extract ZIP + DOCX `document.xml` text extraction (no fake evidence)

---

## Package structure

```
Round3 Test Employee/
  Din 77200 1 Allgemeine/
    01_Jahresweiterbildung_DIN_77200-1_24UE.docx
    02_Jahresweiterbildung_DIN_77200-1_40UE.docx
  Unterweisungen/
    Unterweisungsnachweis_Allgm. Pflichtunterweisung.docx
```

**Assessment:** Usable employee document package layout — employee root folder, role subfolder, appointment subfolder. Matches expected Personalakte grouping for one employee with role + appointment selections.

---

## Template provenance

| Output file | Source template (Hetzner) |
|-------------|---------------------------|
| `01_Jahresweiterbildung_DIN_77200-1_24UE.docx` | `roles/din-77200-1-allgemeine/01_Jahresweiterbildung_DIN_77200-1_24UE.docx` |
| `02_Jahresweiterbildung_DIN_77200-1_40UE.docx` | `roles/din-77200-1-allgemeine/02_Jahresweiterbildung_DIN_77200-1_40UE.docx` |
| `Unterweisungsnachweis_Allgm. Pflichtunterweisung.docx` | `appointments/unterweisungen/Unterweisungsnachweis_Allgm. Pflichtunterweisung.docx` |

Real Cert-Expert DOCX templates from bucket — not synthetic files.

---

## Placeholder replacement

| Check | Result |
|-------|--------|
| Unreplaced `{Placeholder}` tokens in body text | **None found** (all 3 DOCX) |
| `{FullName}` → employee name | **Yes** — `Round3 Test Employee` |
| Birthday / start date | **Yes** — `January 15, 1990`, `January 1, 2026` (en-US long format) |
| Company (appointment doc) | **Yes** — `Cert-Expert Round3 Test`, `test@cert-expert.de`, `Test Address` |

---

## Formatting / completeness observations

| Item | Observation | Severity |
|------|-------------|----------|
| Date locale | en-US long month names (generator `toLocaleDateString`) | Low — known T2-BUG-09 area; carry forward |
| Logo | Baseline run had no `companyLogo`; template embedded images retained | Expected for logo-less run |
| Duplicate content | Single appointment + two role docs — no duplicate-boilerplate issue observed | N/A at this baseline scope |
| Document completeness | Training certificates + Pflichtunterweisung present; readable German content | Acceptable for baseline |

---

## EC-09 conclusion (B4.2)

**PASS WITH OBSERVATIONS** — Real baseline ZIP produces a usable Standardpersonalakte-style employee document package with correct template provenance and placeholder replacement. Formal golden-master visual sign-off against an approved reference PDF/DOCX set was not available in-repo; remaining date-locale preference is a carried-forward generator observation (T2-BUG-09), not a B4.2 blocker.
