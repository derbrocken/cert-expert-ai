# Qualifikationssystem V2 — Systemübersicht

Einstieg: [[README]] · Katalog: [[02_qualification_catalog_v2]] · Hooks: [[03_matrix_release_hooks_v2]]

---

## Zweck des Qualifikationssystems

Das Qualifikationssystem beantwortet für Agenten, Tool 1 und später Tool 2:

1. **Welche Nachweise** braucht eine Person für eine **konkrete Verwendung** (Profil-Tätigkeit, SDL, Objekt)?
2. **Sind** diese Nachweise **vorhanden und gültig**?
3. **Darf** eine **Freigabe** für diese Verwendung erteilt werden?

Es ersetzt **nicht** das Anforderungsprofil — es **prüft** die Personalpassung zum Profil.

---

## Verhältnis DIN 77200-1 und DIN 77200-2

| Ebene | Rolle | Ablage |
|-------|-------|--------|
| **77200-1** | Grundsystem — Stufen A/B/C, §34a, Ersthelfer, WB 4.19.2, Intervention, Freigabelogik | `qualifications/` (V2), `qualifikationssystem/` (V1) |
| **77200-2** | Zusatzschulungen/Einweisungen für besondere SDL (Kap. 5–8) | Wissen: `DIN 77200-2/04_*`, `05`–`08`; **kein** zweites Qualifikationssystem |
| **Anhang A** | Profil 77200-1 | `anforderungsprofile/77200-1_*` |
| **Anhang C** | Profil 77200-2 | `anforderungsprofile/77200-2_*` |

**Agent-Regel:** Bei 77200-2-Auftrag immer **beide** Ebenen prüfen — Basis aus 77200-1, Zusatz aus 77200-2.

---

## Qualifikationstypen (V2-Taxonomie)

| Typ | Code-Präfix | Beschreibung | Beispiel |
|-----|-------------|--------------|----------|
| **Grundqualifikation Stufe** | `GQ-A`, `GQ-B`, `GQ-C` | Mindestqualifikation Anhang A/C | §34a, GSSK, Meister |
| **Pflichtqualifikation** | `PQ-*` | Unabhängig oder ergänzend zur Profilzeile | Ersthelfer, Brandschutz |
| **SDL-Zusatzqualifikation** | `SDL-*` | Norm- oder SDL-spezifische Erstqualifikation | Intervention 24 h |
| **77200-2-Zusatzschulung** | `Z772-*` | Kap. 5–8 Schulung | ÖPNV-Schulung |
| **Weiterbildung** | `WB-*` | 4.19.2 — jährliche UE | WB-40, WB-24 |
| **Einweisung / Unterweisung** | `EW-*` | Keine UE, kein Zeugnis-Stufe | DI-, Objekt-Einweisung |
| **Führungsqualifikation** | `FK-*` | Führungskraft — gesondert von Einsatzkraft | FK nach 4.19.1 |

---

## Nachweisarten

| Nachweisart | Typisch für | Speicherort (Perspektive) |
|-------------|-------------|---------------------------|
| Zeugnis / Zertifikat | GQ-B/C, SDL-Schulung | Personalakte / Tool 2 |
| Register / Bescheid | §34a Sachkunde | Personalakte |
| Teilnehmerliste | Schulung, WB | Personalakte |
| Protokoll | Einweisung, Unterweisung | Objektakte / Tool 2 |
| Praxisliste | 5 Interventionen | Personalakte |
| Gleichwertigkeitsbescheid | Polizei/Zoll-Alternative | Personalakte |
| Freigabeprotokoll | Personalfreigabe | Tool 2 (später) |

---

## Gültigkeiten (Orientierung)

| Qualifikation | Gültigkeit / Zyklus | Verlängerung |
|---------------|---------------------|--------------|
| §34a Sachkunde | unbefristet (Zeugnis) | — |
| §34a Unterrichtung | organisationsintern prüfen | ggf. Neuunterweisung |
| Ersthelfer | **2 Jahre** | Erneuerung |
| Brandschutzhelfer | AG/Objekt-Vorgabe | Schulung |
| WB 4.19.2 | **Kalenderjahr** | UE-Soll erfüllen |
| DI-Unterweisung | **jährlich** (4.14.5) | Unterweisung |
| Objekt-Einweisung | bei Objektwechsel / Änderung | Neue Einweisung |
| 77200-2-Schulung | projekt-/SDL-bezogen | ggf. Auffrischung laut EK |

Exakte Fristen: Primärquelle + VA Kap. 7 V9.

---

## Weiterbildungsbezug

| Kategorie | Norm | Abgrenzung |
|-----------|------|------------|
| **Erstqualifikation** | 4.19.1 | §34a, B/C, 24-h-Intervention, Kap.-5–8-Schulung |
| **Weiterbildung** | 4.19.2 | 40/24 UE — [[../Weiterbildung]] |
| **Einweisung** | 3.18, 4.25 | **Keine UE** |
| **Unterweisung DI** | 4.14.5 | **Keine UE** |

V2-Katalog: `WB-40`, `WB-24` in [[02_qualification_catalog_v2]].

---

## Führungsqualifikationen

Führungskräfte (3.11) unterliegen **gesonderten** Anforderungen — nicht automatisch Stufe C für jede Führungsrolle.

| Aspekt | Modul |
|--------|-------|
| Normdetail, Übergang 2020 | [[../Führungsanforderungen]] |
| V2-Katalog | `FK-01`, `FK-02` in [[02_qualification_catalog_v2]] |
| Freigabe | Führungsfreigabe ≠ SDL-Freigabe Einsatzkraft |

---

## SDL-Bezug

| SDL-Kontext | Relevante Qualifikationstypen |
|-------------|-------------------------------|
| 77200-1 allgemein | GQ-A/B/C aus Profil Anhang A |
| Interventionsdienst | GQ + `SDL-INT-24H`, `SDL-INT-5X` |
| 77200-2 Kap. 5 | + `Z772-VER-AN` (SMA), `Z772-VER-FK` + `FK-01` (Führung) |
| 77200-2 Kap. 6 | + `Z772-OEPNV` |
| 77200-2 Kap. 7/8 | + `Z772-OBJ`, `Z772-UNTER` |

Detail: [[02_qualification_catalog_v2#77200-2-Zusatzschulungen]]

---

## Relevanz für Anforderungsprofile

| Anforderungsprofil | Qualifikationssystem |
|------------------|----------------------|
| Tätigkeit + Stufe A/B/C je Zeile | → `GQ-A/B/C` prüfen |
| Erbringen Ja/Nein | → nur aktive Zeilen relevant |
| AG-Erhöhung | → erhöhtes Minimum |
| **Nicht im Profil** | Ersthelfer, Brandschutz, Führerschein → `PQ-*` |

Profil-first: [[../Anforderungsprofile]].

---

## Relevanz für Personalfreigabe

Personalfreigabe = dokumentierte Entscheidung für **eine Verwendung** (Auftrag × Rolle × Objekt).

V2 liefert **Prüffelder**, keine Personenlisten:

```
Profil-Anforderungen (aus Anhang A/C)
  ∩ Katalog-Qualifikationen (GQ, PQ, SDL, Z772)
  ∩ Gültigkeit / Status
  → Freigabe: freigegeben | eingeschränkt | nicht freigegeben
```

Schema: [[03_matrix_release_hooks_v2#Personalfreigabe]]

---

## Relevanz für Tool 2 (Perspektive)

Tool 2 ist **noch nicht implementiert**. V2 bereitet vor:

| Tool-2-Konzept | V2-Bezug |
|----------------|----------|
| Personalakte | Nachweis-Dokumente je `Qualifikationscode` |
| Projektakte | Profil, EK, Einweisungsprotokolle |
| Freigabe-Workflow | Status aus [[03_matrix_release_hooks_v2]] |
| Audit-Export | Katalog-Felder → strukturierte Prüfliste |

Governance: [[../../Governance/DIN 77200/DOCUMENT_TYPES#Personalfreigabe]]

---

## Abgrenzung Normwissen vs. CEKS-/Tool-Logik

| Schicht | Inhalt | Quelle |
|---------|--------|--------|
| **Normwissen** | Was die DIN verlangt (Stufen, 4.19.1/2) | [[../Qualifikationsanforderungen]], Primärquelle |
| **CEKS V2** | Katalog, Codes, Prüffelder, Freigabe-Hooks | dieser Ordner |
| **Tool-Logik** | Implementierung, UI, Akten | später Governance + Code |
| **Projekt** | Ausgefüllte Nachweise | Tool 2 / `10_examples` |

V2 **interpretiert** und **strukturiert** — kopiert keinen Normtext.

---

## Systemfluss (V2)

```
(1) Anforderungsprofil laden
(2) Aktive Tätigkeiten → höchste Stufe A/B/C
(3) Katalog: GQ + PQ + SDL + Z772 + WB + EW prüfen
(4) Gültigkeit / Status je Nachweis
(5) Personalfreigabe / SDL-Freigabe (03)
```

V1-Parallelmodell: [[../qualifikationssystem/05_sdl_freigabelogik]]

---

## Verifikation

Stufen-Definitionen, UE-Zahlen und Kap.-5–8-Schulungsumfänge gegen DIN 77200-1:2022-10 und DIN 77200-2:2020-07 prüfen.
