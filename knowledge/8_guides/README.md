# knowledge/8_guides/

Schreibanleitungen für fachliche Inhaltsblöcke und Cert-Expert-Schreibstil.

Guides sind instruktiv ("Wie schreibt man X?").
Examples sind demonstrativ ("So sieht ein gutes X aus").
Beide ergänzen sich — Guides erklären das Warum, Examples zeigen das Was.

---

## Regeln

- **Instruktiv, nicht deskriptiv.** Guides sagen dem Modell konkret, was ein
  Abschnitt enthalten muss, wie er strukturiert ist und was zu vermeiden ist.

- **Nicht blueprint-spezifisch.** Guides gelten für einen Inhaltsblock-Typ,
  unabhängig vom Blueprint. `risikobewertung.md` gilt für alle GB-Blueprints.

- **Kompakt.** Guides sind keine Essays. Bullet-Listen und klare Strukturvorgaben
  statt langer Prosa.

---

## Unterordner

### `content_blocks/` — Wie wird ein bestimmter Inhaltsblock geschrieben?

| Datei | Inhalt |
|---|---|
| `risikobewertung.md` | Struktur: Gefährdung → Wahrscheinlichkeit → Schwere → Ergebnis |
| `gefährdungsanalyse.md` | Systematische Erfassung, Kategorien, Vollständigkeitsanforderungen |
| `schutzmassnahmen.md` | S-T-O-P-Prinzip, Maßnahmenhierarchie, Formulierungsanforderungen |
| `verantwortlichkeiten.md` | Rollen, Zuständigkeiten, wie Verantwortung klar benannt wird |
| `offene_punkte.md` | Formulierung, Priorisierung, was ein guter OFFENER PUNKT enthält |

### `writing_style/` — Wie schreibt Cert-Expert generell?

| Datei | Inhalt |
|---|---|
| `audit_near_writing.md` | Sachlicher Ton, keine Wertungen, keine Weichformulierungen |
| `open_point_formulation.md` | Wie wird `[OFFENER PUNKT]` korrekt formuliert und eingebettet? |
| `stop_prinzip.md` | S-T-O-P Maßnahmenhierarchie: Substitution → Technisch → Organisatorisch → Persönlich |

---

## Dateiformat

```markdown
# Guide: {Titel}

## Zweck
{1–2 Sätze: Wofür gilt dieser Guide?}

## Struktur / Aufbau
{Was muss der Block enthalten? In welcher Reihenfolge?}

## Anforderungen
- {Konkrete Anforderung 1}
- {Konkrete Anforderung 2}

## Zu vermeiden
- {Was nicht gemacht werden soll}
```

**Maximale Größe:** ~400 Tokens pro Guide-Datei
