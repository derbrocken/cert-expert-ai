# Produkt: Sicherheitskonzept (SK) — Zweck

## Wofür dient ein SK?

Das Sicherheitskonzept beschreibt auf **Veranstalter-/Auftraggeber-Ebene** (bzw. als
AN-Ableitung bei beauftragter Planung), **welches Schutzziel** verfolgt wird und **wie**
Gefährdungen und Maßnahmen **gesamt** organisiert werden — bevor GB und EK die
arbeitsschutz- bzw. operative Ebene ausformulieren.

Typische Inhalte:

1. **Schutzziel** und Rahmen (Was soll abgesichert werden?).
2. **Gefährdungsanalyse** aus Veranstalter-/Gesamtperspektive (nicht nur SMA-Arbeitsschutz).
3. **Schutzmaßnahmen** und organisatorischer Rahmen (Zonen, Schnittstellen, Eskalation).
4. **Verantwortliche** und Kommunikationsstruktur.
5. **Offene Punkte** vor Freigabe.

## Wer braucht das SK?

- **Auftraggeber / Veranstalter**: Planungs- und Ausschreibungsgrundlage (77200-2-Logik).
- **Cert-Expert als AN**: Ableitung aus Profil und SK-Vorgaben für GB, EK, DI.
- **Behörden**: bei Prüfung besonders sicherheitsrelevanter Veranstaltungen (Kap. 5 — nur bei belegter Einstufung).

## Was das SK **nicht** ist

- Keine Gefährdungsbeurteilung (GB) — GB ist arbeitsschutzbezogen für eingesetzte Kräfte.
- Kein Einsatzkonzept (EK) — EK operationalisiert Kräfte, Abschnitte, Ablauf.
- Keine Dienstanweisung (ODA) — ODA regelt Aufgaben vor Ort für SMA.
- Keine Genehmigung oder Freigabe durch den Bot.

## Verhältnis zu anderen Cert-Expert-Produkten

```
Sicherheitskonzept (SK)
        │
        ├──► Gefährdungsbeurteilung (GB)   ← arbeitsschutzliche Vertiefung
        │
        └──► Einsatzkonzept (EK)           ← operative Umsetzung
                    │
                    └──► ODA / Einweisungen (downstream)
```

**Flow-Modus (geplant):** GB und EK können Kontext aus einem vorhandenen SK erben
(`upstream_sk`). Maßnahmen aus dem SK haben **Vorrang** — Bots ergänzen, widersprechen nicht.

**Standalone:** SK-Bot später möglich ohne GB; GB ohne SK erzeugt `[OFFENER PUNKT]` bei
fehlendem Upstream, wenn der Blueprint Flow vorsieht.

## Sprache und Stil

- Sachlich, auditnah, Veranstalter-/Gesamtperspektive.
- Keine erfundenen Behörden, Kapazitäten, Paragrafen.
- Offenes als `[OFFENER PUNKT]`.

## Normbezug (Orientierung, kein Volltext)

- Veranstaltung allgemein: DIN 77200-1 Veranstaltungsdienst.
- Besondere Sicherheitsrelevanz: SK-Pflicht nur bei dokumentierter Kap.-5-Einstufung
  (Schicht 3 — nicht aus Veranstaltungstyp allein ableiten).
