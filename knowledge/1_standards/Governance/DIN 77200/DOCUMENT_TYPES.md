# Dokumenttypen — Cert-Expert AI / DIN 77200

**Zweck:** Einheitliches Verständnis der wichtigsten Dokumenttypen — **wo** sie liegen, **wofür** sie dienen, **77200-1 vs. 77200-2**.

Keine Vorlagen in diesem Dokument. Siehe Fachmodule und `anforderungsprofile/`.

---

## Übersicht

| Dokumenttyp | Zweck (kurz) | Ablageort | Normbezug | Status |
|-------------|--------------|-----------|-----------|--------|
| Anforderungsprofil | Vertragliche Tätigkeiten + Stufen | siehe unten | 77200-1 + ggf. 77200-2 | **vorhanden** (V1) |
| Qualifikationssystem | Prüfbausteine, Freigabelogik | `DIN 77200-1/qualifikationssystem/` | 77200-1 | **vorhanden** (V1) |
| Qualifikationsmatrix | Profil → Qualifikation → Nachweis | noch kein eigener Ordner | 77200-1 (+ 77200-2) | **geplant** |
| Personalfreigabe | Freigabe zum Einsatz je Rolle | Logik in qualifikationssystem/ | 77200-1 | **geplant** (Logik teilweise in 05) |
| Dienstanweisung / ODA | Operative Regeln am Objekt | Wissensmodul + Projektakte | 77200-1 (+ 77200-2 DI) | Modul **vorhanden**, ODA **Projekt** |
| Gefährdungsbeurteilung | Gefährdungen am Einsatzort | Wissensmodul / Projekt | 77200-1 / 77200-2 | Modul **vorhanden**, GB **Projekt** |
| Sicherheitskonzept | AG-Planungsgrundlage | Projekt / AG | 77200-2 (Pflicht bei 77200-2) | **Projekt** — Wissen in 77200-2 |
| Einsatzkonzept | AN-Operativplan | Projekt / AN | 77200-2 (Pflicht bei 77200-2) | **Projekt** — Wissen in 77200-2 |
| Schulungsnachweis | Nachweis SDL-/Pflichtschulung | Projektakte (später Tool 2) | 77200-1 + 77200-2 | Wissen **vorhanden**, Akte **später** |
| Einweisungsnachweis | DI-/Objekt-/Einsatz-Einweisung | Projektakte (später Tool 2) | 77200-1 | Wissen **vorhanden**, Akte **später** |
| Auditnachweis | Audit-Spur, NC-Vorbereitung | `DIN 77200-1/Auditnachweise.md` | 77200-1 | **vorhanden** |

---

## Anforderungsprofil

| Aspekt | Inhalt |
|--------|--------|
| **Zweck** | Vertragliche Festlegung: welche Tätigkeiten mit welcher Mindestqualifikation (A/B/C) erbracht werden — **profil-first** |
| **Ablageort Vorlage** | `DIN 77200-1/anforderungsprofile/` (Anhang A), `DIN 77200-2/anforderungsprofile/` (Anhang C) |
| **Ablageort Wissen** | `DIN 77200-1/Anforderungsprofile.md` |
| **77200-1 / 77200-2** | 77200-1: 4.11 + Anhang A; 77200-2: zusätzlich Anhang C bei besonderen SDL |
| **Status** | **vorhanden** — V1, Dateinamen `77200-1_*`, `77200-2_*` |

Ausgefüllte Projektprofile: künftig **Tool 2** (Perspektive) / `10_examples/` — nicht in Standards duplizieren.

---

## Qualifikationssystem

| Aspekt | Inhalt |
|--------|--------|
| **Zweck** | Logik für Grundqualifikation, Pflichtnachweise, SDL-Zusätze, WB, **Freigabeentscheid** — keine Mitarbeiter-Gesamtliste |
| **Ablageort** | `DIN 77200-1/qualifikationssystem/` (README, 01–05) |
| **77200-1 / 77200-2** | **Nur 77200-1** — 77200-2 ergänzt Zusatzschulungen über Fachmodule |
| **Status** | **vorhanden** (V1) — Vertiefung geplant |

---

## Qualifikationsmatrix

| Aspekt | Inhalt |
|--------|--------|
| **Zweck** | Abbildung: Profil-Tätigkeit → Stufe A/B/C → erforderlicher Nachweis → Audit-Hilfe |
| **Ablageort** | Geplant: Erweiterung `qualifikationssystem/` oder eigenes Modul unter `DIN 77200-1/` |
| **77200-1 / 77200-2** | Primär 77200-1; 77200-2-Zusatzschulungen als extra Spalte/Regel |
| **Status** | **geplant** — keine Personalnamen im Knowledge-Standard |

---

## Personalfreigabe

| Aspekt | Inhalt |
|--------|--------|
| **Zweck** | Dokumentierte Entscheidung: Person erfüllt Profil + Qualifikation + Schulung + Einweisung für **diese** Verwendung |
| **Ablageort Wissen** | `qualifikationssystem/05_sdl_freigabelogik.md`; Vertiefung geplant |
| **Ablageort Projekt** | Später Tool 2 — **noch nicht implementiert** |
| **77200-1 / 77200-2** | 77200-1-Logik; 77200-2-Zusatzfreigabe nach SDL-Schulung |
| **Status** | **geplant** (Logik V1 in 05) |

---

## Dienstanweisung / ODA (objektbezogene Dienstanweisung)

| Aspekt | Inhalt |
|--------|--------|
| **Zweck** | Operative Alltagsregeln am Leistungsort; ODA = objekt-/einsatzbezogene Ausprägung |
| **Ablageort Wissen** | `DIN 77200-1/Dienstanweisungen.md`; 77200-2: `03_erforderliche_dokumente.md` |
| **Ablageort Projekt** | Ausgefüllte DI/ODA in Projektakte (später Tool 2) |
| **77200-1 / 77200-2** | Grundlogik 77200-1; 77200-2: objektbezogene Ergänzungen |
| **Status** | Wissensmodul **vorhanden**; Projekt-DI **später** (Tool 2) |

---

## Gefährdungsbeurteilung

| Aspekt | Inhalt |
|--------|--------|
| **Zweck** | Systematische Erfassung von Gefährdungen für SMA am Einsatzort |
| **Ablageort Wissen** | `DIN 77200-1/Erforderliche_Dokumente.md`; 77200-2: `03_erforderliche_dokumente.md` |
| **Ablageort Projekt** | Objekt-/auftragsspezifische GB (Tool 2 später) |
| **77200-1 / 77200-2** | Beide Kontexte; bei 77200-2 oft Bezug zu SK/EK |
| **Status** | Wissen **vorhanden**; GB-Dokument **Projekt** |

---

## Sicherheitskonzept (SK)

| Aspekt | Inhalt |
|--------|--------|
| **Zweck** | AG-Planungsgrundlage: Schutzbedarf, Organisation, Anforderungen an AN |
| **Ablageort Wissen** | `DIN 77200-2/03_erforderliche_dokumente.md`, `77200-1/Erforderliche_Dokumente.md` |
| **Ablageort Projekt** | AG-Dokument je Auftrag (Tool 2 später) |
| **77200-1 / 77200-2** | Bei 77200-2 **Pflicht** (AG); 77200-1 kontextabhängig |
| **Status** | Wissen **vorhanden**; SK **Projekt** |

---

## Einsatzkonzept (EK)

| Aspekt | Inhalt |
|--------|--------|
| **Zweck** | AN-Operativplan: Kräfte, Abläufe, Kommunikation, Eskalation |
| **Ablageort Wissen** | `DIN 77200-2/03_erforderliche_dokumente.md` |
| **Ablageort Projekt** | AN-Dokument je Auftrag (Tool 2 später) |
| **77200-1 / 77200-2** | Bei 77200-2 **Pflicht** (AN) |
| **Status** | Wissen **vorhanden**; EK **Projekt** |

---

## Schulungsnachweis

| Aspekt | Inhalt |
|--------|--------|
| **Zweck** | Nachweis absolvierter Schulung (§34a, SDL-Zusatz, Kap. 5–8, …) |
| **Ablageort Wissen** | `Qualifikationsanforderungen.md`, `qualifikationssystem/`, `77200-2/04_qualifikationen_und_schulungen.md` |
| **Ablageort Projekt** | Zertifikate, Teilnehmerlisten (Tool 2 später) |
| **77200-1 / 77200-2** | Basis 77200-1; Zusatzschulungen 77200-2 |
| **Status** | Wissen **vorhanden**; Nachweisakte **später** |

---

## Einweisungsnachweis

| Aspekt | Inhalt |
|--------|--------|
| **Zweck** | Nachweis DI-, Objekt- oder Einsatz-Einweisung (≠ Schulung, ≠ WB-UE) |
| **Ablageort Wissen** | `Dienstanweisungen.md`, `77200-2/02_allgemeine_anforderungen.md` |
| **Ablageort Projekt** | Listen, Protokolle (Tool 2 später) |
| **77200-1 / 77200-2** | Primär 77200-1; 77200-2 Objekt-/Einsatz-Einweisung |
| **Status** | Wissen **vorhanden**; Nachweisakte **später** |

---

## Auditnachweis

| Aspekt | Inhalt |
|--------|--------|
| **Zweck** | Struktur für Audit-Spur: Profil, Personalpassung, DI, Dokumentenkette |
| **Ablageort** | `DIN 77200-1/Auditnachweise.md` |
| **77200-1 / 77200-2** | 77200-1-Modul; 77200-2 ergänzt SK/EK/Anhang C |
| **Status** | **vorhanden** |

---

## Agent-Regel

Neuen Dokumenttyp **nicht** als Root-Ordner unter `Governance/` anlegen. Wissen in CEKS-Modulen; Vorlagen normzentriert; Projektinhalte später Tool 2.

Siehe [[ARCHITECTURE]], [[AGENT_RULES]], [[NAMING_CONVENTIONS]].
