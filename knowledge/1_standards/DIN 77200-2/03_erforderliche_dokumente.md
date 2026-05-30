# DIN 77200-2 — Erforderliche Dokumente

Einstieg: [[README]] · Allgemein: [[02_allgemeine_anforderungen]]

**Wissensmodul** — beschreibt **was** dokumentiert werden muss und **wofür** es im Audit dient. Keine Vorlagen.

77200-1-Grundkette: [[../DIN 77200-1/Erforderliche Dokumente|77200-1 Erforderliche Dokumente]].

---

## Dokumentenkette (77200-2-Pflichtverständnis)

```
SK (AG) ──► Anforderungsprofil (4.11 + Anhang C)
                │
                ▼
            EK (AN) ──► Objekt-DI ──► Einweisungen
                │              │
                ▼              ▼
         Schulungsplan    Gefährdungsbezug
                │
                ▼
         Nachweise / Freigaben / Listen
```

**Leitregel:** Jedes Downstream-Dokument muss zum Profil **passen oder höher** planen — nie weniger Leistung/Qualifikation als vereinbart.

---

## Sicherheitskonzept (SK)

| Aspekt | Praxiswissen |
|--------|--------------|
| **Wer** | Auftraggeber / Veranstalter / Betreiber |
| **Wozu** | Planungs- und Ausschreibungsgrundlage; definiert Schutzbedarf |
| **Typische Kapitel** | Lage, Gefährdungen, Kräftebedarf, Kommunikation, Evakuierung, Anforderungen an AN |
| **Audit** | SK-Version im Vertrag/Angebot referenziert; AN kann Ableitung Profil/EK zeigen |
| **Tool-2** | Feld `sk_version`, `sk_date`, `sk_approved_by_ag` |

**Sonderfall Erstzertifizierung:** Siehe [[../DIN 77200-1/Erforderliche Dokumente#Cert-Expert Best Practice — Dokumentenbasierte Erstzertifizierung|77200-1 — dokumentenbasierte SK-Unterstützung]] — ersetzt nicht AG-Verantwortung.

---

## Einsatzkonzept (EK)

| Aspekt | Praxiswissen |
|--------|--------------|
| **Wer** | Auftragnehmer |
| **Wozu** | Operative Umsetzung des Auftrags; Basis für DI und Schichtplan |
| **Typische Kapitel** | Kräfte, Abschnitte, Funk, Störung/Evakuierung, Logistik, Qualifikationszuordnung |
| **Bezug SK** | EK zeigt, **wie** SK-Anforderungen umgesetzt werden |
| **Bezug Profil** | Tätigkeiten aus Anhang C → Rollen im EK |
| **Audit** | EK am Prüftag abrufbar; Abgleich Einsatzrealität ↔ Plan |

**ÖPNV:** EK oft strecken-/linienbezogen. **Veranstaltung:** EK mit Zeitachse (Aufbau, Show, Abbau).

---

## Objektbezogene Dienstanweisung

| Aspekt | Praxiswissen |
|--------|--------------|
| **Funktion** | Alltagsregeln für SMA vor Ort |
| **77200-1** | [[../DIN 77200-1/Dienstanweisungen|DI-Grundlogik]] |
| **77200-2-Zusatz** | Zonen, Hausrecht-Ausübung im Kontext, Technik, Deeskalation, Medienverhalten |
| **Audit** | SMA kann DI-Inhalt nennen; DI widerspricht Profil nicht |

---

## Gefährdungsbeurteilung

| Aspekt | Praxiswissen |
|--------|--------------|
| **Funktion** | Systematische Gefährdungen für SMA am Einsatzort |
| **Typische Gefährdungen** | Gewalt, Sturz, Lärm, Einsamkeit (Revier), Biostoffe, Stress |
| **Verknüpfung** | GB → Schulungsbedarf, PSA, Einweisung |
| **77200-2** | GB oft Teil der AG-Planung oder AN-Ergänzung zum EK |

---

## Anforderungsprofil

| Aspekt | Praxiswissen |
|--------|--------------|
| **Basis** | 77200-1 (4.11) + **Anhang C** |
| **Inhalt** | Konkrete Tätigkeiten, Stufen A/B/C je Tätigkeit, Erbringen Ja/Nein |
| **Vorlagen** | [[anforderungsprofile/README]] |
| **Modul** | [[../DIN 77200-1/Anforderungsprofile]] |
| **Audit** | Profil abgestimmt, datiert, jährlich geprüft |

**Agent:** Profil ist **Steuerungsdokument** — ohne Profil keine belastbare Qualifikationsantwort.

---

## Schulungsnachweise

| Nachweis | Inhalt |
|----------|--------|
| SDL-Zusatzschulung | Kap. 5–8 — z. B. ÖPNV-Schulung, Veranstaltungs-FK-Schulung |
| 77200-1-Basis | §34a, Stufe B/C, Ersthelfer — [[../DIN 77200-1/Qualifikationsanforderungen]] |
| 4.19.2-Weiterbildung | **Separat** — [[../DIN 77200-1/Weiterbildung]] |

**Häufiger Fehler:** Kap.-6-Schulung als Weiterbildungs-UE verbuchen — getrennt führen.

---

## Einweisungsnachweise

| Typ | Nachweisformat (typisch) |
|-----|--------------------------|
| DI-Einweisung | Unterschrift/Liste, Datum, DI-Version |
| Objekteinweisung | Begehungsprotokoll, Checkliste |
| Einsatzbriefing | Schichtprotokoll, Funktest |

---

## Personalfreigaben

Freigabe = dokumentierte Entscheidung: SMA erfüllt Profil + Qualifikation + Schulung + Einweisung für **diese** Verwendung.

Logik: [[../DIN 77200-1/qualifikationssystem/05_sdl_freigabelogik|SDL-Freigabelogik]] — keine Namenslisten im Knowledge-Standard, aber im Projekt **Freigabeprotokoll je Person/Rolle**.

---

## Nachweislisten

Übersicht je Auftrag (Audit-Hilfsmittel):

| Spalte | Beispiel |
|--------|----------|
| Anforderung | „ÖPNV-Schulung Kap. 6“ |
| Quelle | Profil / EK |
| Nachweistyp | Zertifikat, Teilnehmerliste |
| Status | vorhanden / fehlt / abgelaufen |
| Freigabe-relevant | ja/nein |

---

## Typische Auditorfragen

1. Zeigen Sie SK und EK — wann erstellt, wer freigegeben?
2. Wie leiten sich Profil-Tätigkeiten aus SK ab?
3. Welche SMA sind für welche Anhang-C-Tätigkeit freigegeben?
4. Wo ist die SDL-Zusatzschulung nachgewiesen — getrennt von WB-UE?

---

## Tool-1 / Tool-2

| Dokument | Tool-1 Slot | Tool-2 Akte |
|----------|-------------|-------------|
| SK | `upstream_sk` | `documents/sk/` |
| EK | `einsatzkonzept` | `documents/ek/` |
| Profil | `anforderungsprofil` | `documents/profil/` |
| DI | `dienstanweisung` | `documents/di/` |

---

## Verifikation

Dokumentenpflichten Kap. 4 und SDL-spezifische Ergänzungen Kap. 5–8 vor NC-Bewertung gegen Primärquelle prüfen.
