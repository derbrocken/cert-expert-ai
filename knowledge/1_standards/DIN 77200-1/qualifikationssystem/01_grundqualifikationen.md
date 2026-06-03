# Grundqualifikationen (Stufen A / B / C)

Bezug: DIN 77200-1 Anhang A (Definitionen A/B/C) · Anhang C (Verweis auf A-Logik) · 4.1 b), 4.19.1

---

## Leitregel

Die **Stufe A/B/C** wird im **Anforderungsprofil** je Tätigkeit festgelegt. Dieses Dokument beschreibt, **welcher Nachweis** in der Personalakte die jeweilige Stufe **erfüllt**.

Profil-first: SDL allein legt keine Stufe fest.

---

## Stufe A — Grundanforderungen

**Normanker:** Anhang A · 4.1 b) 1) und 2)

| Anforderung | Nachweis | Prüfhinweise |
|-------------|----------|--------------|
| §34a-Basis | **Unterrichtung** oder **Sachkundeprüfung** nach §34a GewO | Nachweisart, Datum, Gültigkeit |
| Sachkundeprüfung — Frist | Spätestens zum Ablauf des **6. Monats** durchgehender Beschäftigung, sofern nicht bereits Unterrichtung/Sachkunde | HR-Frist, Einsatzsperre bis Nachweis |
| Übergang Sachkunde | Stichtag **13.10.2020**: **3 Jahre** durchgehende Beschäftigung in SDL-Durchführung — Befreiung Sachkundeprüfung, **soweit gesetzlich zulässig** | Lückenloser Beschäftigungsnachweis |
| Ergänzend (4.1 b)) | DI-Einweisung, Datenschutz/Verschwiegenheit | Nicht mit Stufe B/C verwechseln |

**Interpretation:** Stufe A = gesetzliche Grundqualifikation + normative Basisnachweise. Entspricht „Grundanforderungen“ in Tabelle A.1.

**Primärquelle:** Konkrete Fristen, Befreiungen und Nachweisformen immer gegen **§34a GewO**, **DIN 77200-1** und ggf. **VA Kap. 7 V9** prüfen.

---

## Stufe B — Erweiterte Anforderungen

**Normanker:** Anhang A (Definition B)

Mindestens einer der folgenden Nachweise (gleich- oder höherwertig mit Bezug zum Sicherheitsgewerbe):

| Qualifikation | Typischer Nachweis |
|---------------|-------------------|
| GSSK (Geprüfte Schutz- und Sicherheitskraft) | IHK-/Prüfstellenzeugnis |
| FSSK (Fachkraft für Schutz und Sicherheit) | *Hinweis: in Anhang A unter C geführt — bei VA-Zuordnung prüfen* |
| Servicekraft für Schutz und Sicherheit | Zeugnis |
| IHK-geprüfte Werkschutzfachkraft | Zeugnis |
| Gleich- oder höherwertige Qualifikation | Gleichwertigkeitsprüfung dokumentieren |

**Altfallregelung (Anhang A):** Alternativ zur Qualifikation nach B darf diese ersetzt werden durch **ununterbrochene Tätigkeit im Sicherheitsgewerbe von mindestens 3 Jahren** — Stichtags- und Nachweislogik **normkonform** und gegen **VA Kap. 7 V9** verifizieren (Projektvorgabe: Bezug Stichtag **13.10.2020**).

| Prüffeld | Inhalt |
|----------|--------|
| Zeugnis vorhanden | Ja/Nein, Ausstellungsdatum |
| 3-Jahres-Alternative | Lückenlose Beschäftigungsnachweise Sicherheitsgewerbe |
| Profilbezug | Stufe B nur erforderlich, wenn Anforderungsprofil Tätigkeit mit B vorsieht |

---

## Stufe C — Hohe Anforderungen / höhere Qualifikation

**Normanker:** Anhang A (Definition C)

Mindestens einer der folgenden Nachweise:

| Qualifikation | Typischer Nachweis |
|---------------|-------------------|
| Fachkraft für Schutz und Sicherheit | Meister-/Fachkraftzeugnis |
| Meister für Schutz und Sicherheit | Meisterbrief |
| IHK-geprüfter Werkschutzmeister | Zeugnis |
| Gleich- oder höherwertige Qualifikation | Dokumentierte Gleichwertigkeit |

**Mögliche Gleichwertigkeit (Anhang A, Anmerkung):** z. B. abgeschlossene **Laufbahnprüfung im mittleren Polizei-, Zoll- oder Vollzugsdienst** **zusätzlich** zu B-Qualifikation — nur wenn **nachweisbar** und **normkonform** anerkannt.

| Prüffeld | Inhalt |
|----------|--------|
| Zeugnis / Gleichwertigkeitsentscheidung | Vorhanden, begründet |
| Profilbezug | Stufe C nur bei Profil-Tätigkeit mit C |
| Führungsfunktion | Gesondert [[Führungsanforderungen]] — nicht automatisch Stufe C für jede Führung |

---

## Abgleich Profil ↔ Personalakte

```
Für jede aktivierte Profil-Zeile (Erbringen = Ja):
  geforderte Stufe (A|B|C) aus Profil
    → höchste geforderte Stufe je SDL/Verwendung ermitteln
      → Personalakte: liegt passender Nachweis vor?
        → ja: Baustein Grundqualifikation erfüllt
        → nein: SDL-Freigabe blockiert (siehe 05)
```

**AG-Erhöhung im Profil:** Wenn AG Stufe über Norm-Minimum anhebt, gilt die **erhöhte** Stufe als Mindestnachweis.

---

## Nicht Gegenstand dieses Bausteins

- Ersthelfer, Brandschutzhelfer → [[02_pflichtqualifikationen]]
- 24-h-Interventionsschulung → [[03_sdl_zusatzqualifikationen]]
- Weiterbildung / UE → [[04_weiterbildungslogik]]

---

## Offene Punkte (VA / Schulungsdocs)

- [ ] Feinzuordnung FSSK vs. GSSK vs. Servicekraft in VA Kap. 7 V9
- [ ] Detailcheckliste Gleichwertigkeitsentscheidungen (Polizei/Zoll/Vollzug)
- [ ] Tool-1-Felder: `stufe_gefordert`, `stufe_nachgewiesen`, `nachweis_datum`
