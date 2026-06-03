# Produkt: Einsatzkonzept (EK / EC) — Zweck

**Hinweis Namensraum:** Im Repo heißt der Ordner `einsatzkonzept/`; Platzhalter nutzen
das Präfix `EC_*` (historisch „Einsatzkonzept“ / deployment concept).

## Wofür dient ein EK?

Das Einsatzkonzept beschreibt **operativ**, wie der Auftragnehmer den
Sicherheitsdienst **umsetzt**: Kräfte, Abschnitte, Ablauf, Kommunikation, Notfall.

Typische Inhalte:

1. **Einsatzbeschreibung** — Was wird wann wo durchgeführt?
2. **Kräfte und Struktur** — Rollen, Abschnitte (ohne erfundene Stärken).
3. **Positionierung / Aufgaben** — Wer übernimmt welche Lageaufgabe?
4. **Ablauf** — Phasen (Anreise, Einlass, Show, Auslass, Abbau).
5. **Kommunikation** — Funk, Meldekette.
6. **Notfall** — Orientierung an SK/Objektlogik; keine erfundenen Pläne.
7. **Offene Punkte**.

## Wer braucht das EK?

- **Cert-Expert (AN)**: interne Einsatzplanung, Briefings, Abgleich mit SK/Profil.
- **Auftraggeber**: Nachweis der Umsetzung der SK-Anforderungen.
- **Audit / Behörde**: bei Kap.-5-Events EK neben SK prüfbar (nur bei belegter Einstufung).

## Was das EK **nicht** ist

- Kein Sicherheitskonzept (SK) — EK setzt SK um, ersetzt es nicht.
- Keine GB — keine arbeitsschutzliche Risikomatrix (kann GB referenzieren).
- Keine Dienstanweisung — ODA ist SMA-Ebene, EK ist Planungsebene AN.
- Keine Freigabe zum Einsatz (CEKS-Freigabe = separates System / Tool 2).

## Verhältnis zu anderen Produkten

```
SK (upstream, optional) ──► EK ──► ODA / Einweisungen
         │
         └── GB (parallel/arbeitsschutz) — Risiken können EK-Ablauf informieren
```

**Flow-Modus (geplant):** EK erbt Schutzziel und Maßnahmenrahmen aus SK;
offene SK-Abschnitte → `[OFFENER PUNKT]` in EK.

## Sprache und Stil

- Operativ, eindeutig, phasenbezogen.
- Keine erfundenen Kräfteanzahlen — nur aus Input oder `[OFFENER PUNKT]`.
- SDL-Subtyp und `base.md`-Phasen als Bezugsrahmen, nicht als Copy-Paste.
