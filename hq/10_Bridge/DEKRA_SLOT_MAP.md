# DEKRA-Slot-Map — Ordnerstruktur „Vor Audit" DIN 77200 (-1.1 / -2)

**Stand:** 2026-06-07 · **Owner:** Generalist · **Für:** Code-Track (Slice 4 DEKRA-Assembler) · **Basis:** echte ELC-Struktur (aktiver Kunde, KSA-Stand Feb 2026)

> **Wichtig:** Die DEKRA-Ordnerstruktur ist **standardisiert** — bei ELC, ZT, Miras, SecuGuard etc. identisch (`Dekra Ordnerstruktur (Vor Audit) DIN77200 -1.1`). Diese Map gilt für **alle** Kunden. Quelle hier: ELC, weil aktuell + vollständig befüllt.
>
> **Quelltyp-Legende** (was der Assembler je Slot tun muss):
> - **[GEN]** = generiertes Standarddokument (Verfahren/Eigenerklärung) → Platzhalter (`{CompanyName}`, `{Logo}`, `{ApprovedBy}` …) füllen
> - **[EVID]** = eingereichter Nachweis → aus S3/Tally-Intake einsortieren; **Stichtags-Regel** beachten (Readiness)
> - **[TOOL]** = Export aus den Tool-Daten (Mitarbeiter/Akte)
> - **[SK]** = kundenindividuelles Sicherheitskonzept (SK-Bot-Produkt)
> - **[INPUT]** = Organisations-/Stammdaten (KSA)

---

## Die Slots

| Slot-Ordner | Inhalt (ELC-Beispiel) | Quelltyp | Readiness / CL-Bezug |
|---|---|---|---|
| **1 – Organisationsdaten** | `KSA_DIN 77200.xlsx`, Ausfüllhilfe, Kalkulation | **[INPUT]** | Stammdaten/KSA (Pflicht-Vorbedingung) |
| **2 – Auflistung der Sicherheitsmitarbeiter** | `C-10P-07 Auflistung SMA und Leistungsorte.xlsx` | **[TOOL]** | aus Akte/Mitarbeiterdaten — = Audit-Export (Slice 4) |
| **3 – Auszug Gewerbezentralregister** | `Auskunft Gewerbezentralregister.pdf` | **[EVID]** | **≤ 12 Monate** zum Audit |
| **4 – Unbedenklichkeit Finanzamt** | `UN_Finanzamt.pdf` | **[EVID]** | **≤ 6 Monate** zum Audit |
| **5 – Unbedenklichkeit Sozialversicherung** | `UN_Sozialversicherung_DAK.pdf` | **[EVID]** | **≤ 6 Monate** ⚠️ *genau Fingers ELC-Nachforderung* |
| **6 – Datenschutzverpflichtung** | Verfahren `Kap.7 V1` + Eigenerklärung (unterschrieben) | **[GEN]** + signiert | Eigenerklärungs-Bundle |
| **7 – Verschwiegenheitserklärung** | Verfahren + Eigenerklärung (unterschrieben) | **[GEN]** + signiert | Eigenerklärungs-Bundle |
| **8 – Mindestlohnerklärung** | Eigenerklärung Liquidation/Tariftreue (unterschrieben) | **[GEN]** + signiert | Eigenerklärungs-Bundle |
| **9 – Beschwerdemanagement** | `Kap.5 V2 – Beschwerdemanagement.docx` | **[GEN]** | Verfahren-Set |
| **10 – Erstellung Dienstanweisungen** | `Kap.7 V6` | **[GEN]** | Verfahren-Set |
| **11 – Erstellung Dienstausweis** | `Kap.7 V7` | **[GEN]** | Verfahren-Set |
| **12 – Planung/Durchführung Unterweisungen** | `Kap.7 V8` | **[GEN]** | Verfahren-Set; verknüpft Unterweisungs-Nachweise |
| **13 – Organisation Qualifikationen** | `Kap.7 V9` | **[GEN]** | Verfahren-Set → koppelt an UE-/Qualifikations-Engine |
| **14 – Organisation Weiterbildung** | `Kap.7 V10` | **[GEN]** | Verfahren-Set → koppelt an UE-Weiterbildung |
| **15 – Dokumentation Melde-/Berichtswesen** | `Kap.8 V2` | **[GEN]** | Verfahren-Set |
| **16 – Verwaltung Schließmittel** | `Kap.8 V1 / L1` | **[GEN]** | Verfahren-Set |
| **17 – Organigramm** | `Kap.5 D2 – Organigramm.docx` | **[GEN]** | Firmen-Stammdaten |
| **18 – DIN 77200-2 Sicherheitskonzept (Asyl)** | `Sicherheitskonzept ….pdf` + Info | **[SK]** | kundenindividuell (SK-Bot); nur DIN 77200-2-Scope |
| **22 – Nachweis QM-System** | Unterordner: Handelsregister, Bewachungserlaubnis, Organigramm, Prozesslandkarte, Unternehmenspolitik | **[EVID]** + **[GEN]** gemischt | Firmen-QM-Basis |

**Root-Dateien (kein Slot):**
- `C-10P-04 … Kundenunterlagen vor Zulassungsaudit.docx` = DEKRAs **Master-Checkliste** (Soll-Liste der Slots) — gegen diese prüft der Assembler die Vollständigkeit.
- `Umgang mit Ordnerstruktur DIN 77200.pptx` = Bedienhinweis.

---

## Was das für Slice 4 (Assembler) heißt

1. **[GEN]-Slots (6–17)** = ein zusammenhängendes **Verfahrens-Set** (Kap. 5/7/8, V1–V10 + Eigenerklärungen). → Ein Generator-Lauf mit Platzhalter-Füllung erzeugt fast den halben Ordner. **Größter Automatisierungs-Hebel.**
2. **[EVID]-Slots (3,4,5,22)** = aus S3/Tally einsortieren, mit **Stichtags-Prüfung** (Readiness-Ampel rot, wenn abgelaufen — z. B. die ELC-Unbedenklichkeit > 6 Mon.).
3. **[TOOL]-Slot (2)** = SMA-Auflistung aus den Akte-Daten (= der Audit-Export, den Slice 4 ohnehin baut).
4. **[SK]-Slot (18)** = nur bei DIN-77200-2-Scope; kundenindividuell.
5. **Vollständigkeit** gegen `C-10P-04`-Checkliste prüfen → speist die Audit-Gate-Ampel.
6. **Output** → OneDrive `01_Kunden/<Kunde>/08_Generated/` (Architektur-Entscheidung) → Upload via **Teambeam des DEKRA-Kontakts** (s. `DEKRA_KONTAKTE.md`).

**Offen / fachlich zu prüfen:** CL-IDs je Verfahren (V1–V10) noch nicht im Klausel-Register gemappt → bei Slice-4-Bau ergänzen. Slot-Nummerierung springt (kein 19/20/21) — historisch; nur 1–18 + 22 belegt.
