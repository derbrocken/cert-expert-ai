# Wissens-Landkarte — was wir haben & wie wir es verwerten

**Stand:** 2026-06-07 · **Owner:** Generalist · **Zweck:** Nicht aufräumen (ist sortiert) — sondern **verwerten**. Welcher Schatz liegt wo, und was kann er werden.

> Zwei Pools: **Repo `knowledge/`** = das KI-Gehirn (kuratiert, maschinenlesbar, füttert Bots + Tool). **OneDrive `02_QM_und_Wissen`** = das Rohlager (Quellmaterial, Mensch-lesbar). Wertschöpfung = Rohlager → KI-Gehirn → Produkt.

---

## Pool A — Repo `knowledge/` (das Gehirn, schon gebaut)

| Bereich | Inhalt | Reifegrad |
|---|---|---|
| `NORM_MATRIX_v2` + `KLAUSEL_REGISTER` | Norm-Logik (qualifiziert-Def., UE, A/B/C, Fristen) mit CL-IDs | **kanonisch, reif** — füttert die Requirement-Engine |
| `1_standards/` | DIN 77200-1/-2, ISO 9001/14001/45001, AZAV, IES, EFQM (Überblicke) | mittel |
| `2_regulations/` | ArbSchG, DGUV V1, BewachV, VStättVO, BetrSichV | mittel |
| `3_sdls/` | **13 Sicherheitsdienstleistungs-Bereiche** (Objektschutz, Revier, Veranstaltung, Asyl, ÖPNV …) | **nur Event/Kampfsport tief**, Rest dünn |
| `6_products/` | Dokumentprodukt-Wissen: GB · SK · EC · ODA | Event/Kampfsport reif, Rest offen |
| `7_blueprint/` + `10_rules/` + `11_examples/` + `8_guides/` | Bot-Allowlists (JSON), harte Regeln, Positiv-Beispiele, Schreibstil | reif (für Event) |

**Befund:** Das Gehirn ist gut gebaut — aber **nur für einen Anwendungsfall tief** (Veranstaltung/Kampfsport-Bots). Die Struktur ist da, um auf alle DIN-77200-Bereiche zu skalieren.

---

## Pool B — OneDrive `02_QM_und_Wissen` (das Rohlager, ungehoben)

| Schatz | Umfang | Was es werden kann |
|---|---|---|
| **Template/ DEKRA-Ordnerstrukturen** (ISO 9001/14001/45001 Prozessbeschreibungen, QMH, Vorgabedokumente, „Dekra Ordnerstruktur (Vor Audit)", KSA's) | viele Ordner | 🔑 **DEKRA-Assembler-Slot-Map** (Slice 4) — *direkt der offene Input im Bauauftrag* |
| **Schulungen & Kurse** | **252 Dateien** — AZAV Sachkunde 6-Monate (volles Curriculum, Kalkulation, Verträge, TN-Zertifikate), DIN77200-2 Schulungen kompakt, Auditor-Kurse | **Schulungsprodukt / LMS** (Recurring Revenue lt. Vision: „care + employee training built in") |
| **_InnoSecure_QM_alt / Auditpläne** | 25 — echte Auditpläne + -berichte (Faust, Wolf, SafetyManagement, ÜA 2020–2024) | **Audit-Vorlagen + Readiness-Checklisten + Proof** (Website/Vertrieb) |
| **Normen & Standards** | 48 Roh-PDFs (ISO 9001/14001/45001, BewachV, IES, Arbeitsschutz, sogar Halal) | Quelle, um **Pool A `1_standards`/`2_regulations` zu verbreitern** (kuratiert, mit CL-IDs) |
| **Prozesse / O2C** | O2C-Diagramme (PDF/VSDX), Milestones | Bereits rekonstruiert (`_O2C_Prozess_REAL.md`) — als Diagramm verwertbar |
| **Sicherheitskonzepte (Muster)** | 2 Muster | Füttert den **SK-Bot** (`6_products/sicherheitskonzept`) breiter |
| **Strategie & Methoden** + **QM/Strategie** | TRIZ, Cynefin, „Dach der Strategie" · Mission, **Leitbild, Vision 2036, Master-Plan, Roadmap 2026, Taktische Ziele 2026–2028**, Philosophie, Business Architecture, DFSS-Pilot-Doku | **Strategie-Kanon** (Steuerung + Website) → G-02 |
| **QM Audit/Mail-Templates** | S-/Z-Audit-Checklisten (.xlsx), E-Mail-Vorlagen (.oft), Personalakte EN/DE | Standard-Kundenkomm. + Tool-generierte Docs |
| **HR / KPI** | Recruiting-, Branding-, KPI-PDFs | später (HR-Modul) |

---

## Die 4 Verwertungs-Strecken (wie aus Schatz Wert wird)

1. **DEKRA-Assembler-Strecke** 🔑 — DEKRA-Ordnerstrukturen (B) → Slot-Map → Slice 4 baut den audit-fertigen Ordner. *Keystone: macht alle anderen Schätze (Docs + Nachweise) zum Auditprodukt.*
2. **Schulungs-Strecke** 💶 — 252 Kurs-Dateien (B) → Schulungsprodukt/LMS → wiederkehrender Umsatz. Größter strategischer Hebel lt. Vision, aber größerer Bau.
3. **Norm-Breiten-Strecke** — Roh-Normen (B) → kuratierte Module in `knowledge/` (A) → Requirement-Engine deckt *alle* DIN-77200-Bereiche, nicht nur Events.
4. **Strategie-Strecke** — QM/Strategie (B) → kanonischer Kanon (Vision 2036 + taktische Ziele aktuell) → steuert Website (Tarak) + Richtung. = G-02.

---

## Empfehlung — der nächste eine Schritt

**Strecke 1: DEKRA-Ordnerstruktur einlesen → Slot-Map.** Begründung:
- Es ist der **bereits offene Input** im Readiness/DEKRA-Bauauftrag (Code-Track wartet darauf).
- Es ist der **Keystone**: ohne Slot-Map kein Assembler; mit Slot-Map werden generierte Docs + Nachweise automatisch zum DEKRA-Ordner — das eigentliche Produkt.
- **Mini-Schritt (30 Min):** Ich lese *eine* echte DEKRA-Ordnerstruktur aus `Template/` aus und mache daraus eine **Slot-Map-Tabelle** (welches Dokument/welcher Nachweis in welchen Slot) → liegt als Spec für den Code-Track bereit.

**Danach erst** Strecke 2 (Schulungsprodukt) als nächster großer Brocken — das ist der Recurring-Revenue-Hebel, aber bewusst getrennt.
