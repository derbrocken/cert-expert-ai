# DIN 77200-2 — Übersicht

Einstieg: [[README]] · Grundsystem: [[../DIN 77200-1/overview|DIN 77200-1]]

---

## Was DIN 77200-2 fachlich abdeckt

DIN 77200-2 regelt vier **Anwendungsgruppen** besonderer Sicherheitsdienstleistungen. Gemeinsam ist: erhöhter Schutzbedarf, **objekt- oder einsatzbezogene Planung**, verpflichtende Dokumentenkette SK → Profil → EK → DI, und **Anhang C** statt (bzw. zusätzlich zu) Anhang A.

| Merkmal | 77200-1 (allgemein) | 77200-2 (besonders) |
|---------|---------------------|---------------------|
| Profilreferenz | Anhang A | **Anhang C** |
| SK vom AG | oft optional / vertraglich | **in der Regel Pflicht** |
| EK vom AN | oft optional / Angebot | **in der Regel Pflicht** |
| Zusatzschulungen | SDL-spezifisch in 77200-1 | **Kap. 5–8 Schulungen** zusätzlich |
| Typische Einsätze | Revier, Empfang, normale Veranstaltung | Großveranstaltung, ÖPNV-Knoten, sensible Objekte, Unterkünfte |

---

## Die vier SDL-Gruppen

| Kap. | SDL | Modul | Profil | Typischer Auslöser (Praxis) |
|------|-----|-------|--------|------------------------------|
| 5 | Veranstaltungen bes. Relevanz | [[05_veranstaltungen_besondere_sicherheitsrelevanz]] | [[anforderungsprofile/77200-2_veranstaltung_besondere_sicherheitsrelevanz]] | AG stuft Veranstaltung als besonders sicherheitsrelevant ein (Menschenmenge, Lage, Gefährdung) |
| 6 | ÖPNV | [[06_oepnv]] | [[anforderungsprofile/77200-2_oepnv]] | Sicherung in/ an Bahnhöfen, Depots, Linien, Betriebshöfen — nicht „irgendein Busobjekt“ ohne ÖPV-Bezug |
| 7 | Objekte bes. Relevanz | [[07_objekte_besondere_sicherheitsrelevanz]] | [[anforderungsprofile/77200-2_gebaeude_besondere_sicherheitsrelevanz]] | Kritische Infrastruktur, Hochsicherheitsobjekte, sensible Einrichtungen |
| 8 | Flüchtlings-/Asylunterkünfte | [[08_fluechtlings_und_asylunterkuenfte]] | [[anforderungsprofile/77200-2_fluechtlings_asylunterkuenfte]] | Bewachung/Sicherung in Gemeinschaftsunterkünften unter 77200-2-Tatbestand |

Master Anhang C: [[anforderungsprofile/_master_77200-2]]

---

## Zusammenhang mit DIN 77200-1 (Pflichtverständnis)

Bei **jedem** 77200-2-Auftrag parallel denken:

1. **77200-1** — Vertrag, 4.11 Profil-Logik, DI, Personalpassung, 4.19.2 Weiterbildung, Audit
2. **77200-2** — SK/EK, Anhang C, SDL-Schulung, Einsatzbesonderheiten

| Thema | Wo |
|-------|-----|
| Profil-first, AG/AN-Abstimmung | [[../DIN 77200-1/Anforderungsprofile]] |
| A/B/C, §34a, Ersthelfer | [[../DIN 77200-1/Qualifikationsanforderungen]] |
| Weiterbildungs-UE (40/24) | [[../DIN 77200-1/Weiterbildung]] — **getrennt** von Kap.-5–8-Schulungen |
| Freigabeentscheid | [[../DIN 77200-1/qualifikationssystem/05_sdl_freigabelogik]] |
| Dokumentenkette allgemein | [[../DIN 77200-1/Erforderliche Dokumente]] + [[03_erforderliche_dokumente]] |

---

## Veranstaltung — häufigste Verwechslung

| Situation | Normpfad | SK/EK |
|-----------|----------|-------|
| Stadtfest, Clubkonzert, Messe ohne besondere Einstufung | 77200-1 Veranstaltungssicherungsdienst, Anhang A | vertraglich / kontextabhängig |
| Großevent, erhöhte Gefährdung, AG-Einstufung „besondere Relevanz“ | **77200-2 Kap. 5**, Anhang C | **SK + EK** |

**Agent-Regel:** „Veranstaltung“ allein → nicht automatisch 77200-2. Nachfragen: AG-Einstufung? SK vorhanden? Anhang C im Profil?

---

## Typische Einsatzszenarien (Querschnitt)

- Großkonzert mit Einlasskontrolle, Einlasszonen, Crowd-Management → Kap. 5
- Sicherung Bahnhofknoten mit Video, Zugangskontrolle, Fahrzeugkontrolle → Kap. 6
- Dauerbewachung Forschungseinrichtung / Rechenzentrum → Kap. 7
- Sicherheitsdienst in Gemeinschaftsunterkunft mit Konfliktlage → Kap. 8

Detail je SDL in Modulen 05–08.

---

## Tool-1-Slots (Orientierung)

| Slot | Inhalt |
|------|--------|
| `norm_part` | `77200-2` |
| `sdl_group` | `kap5` / `kap6` / `kap7` / `kap8` |
| `annex` | `C.1` … `C.4` |
| `sk_ek_required` | in der Regel `true` |
| `profile_template` | Pfad `anforderungsprofile/77200-2_*` |

---

## Verifikation

Tatbestandskriterien je Kap. 5.1, 6.1, 7.1, 8.1 und exakte Schulungsumfänge vor Auditentscheid gegen DIN 77200-2:2020-07 prüfen.
