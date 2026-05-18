# Produktregeln — Gefährdungsbeurteilung (GB)

Diese Regeln gelten für **alle** GB-Blueprints, unabhängig vom Anwendungsfall.

## Zweck der GB

Die Gefährdungsbeurteilung ist ein Pflichtdokument im Sinne des Arbeitsschutzes.
Sie identifiziert systematisch Gefährdungen, bewertet sie und legt
Schutzmaßnahmen fest. Sie ist **kein** finales Freigabedokument — sie ist ein
Arbeitsdokument, das durch eine verantwortliche Person geprüft und freigegeben
werden muss.

## Pflichtinhalte jeder GB

1. Beschreibung der zu beurteilenden Tätigkeit oder des Bereichs.
2. Systematische Auflistung der identifizierten Gefährdungen.
3. Bewertung jeder Gefährdung (Eintrittwahrscheinlichkeit × Schwere).
4. Festgelegte Schutzmaßnahmen, gegliedert nach Maßnahmenhierarchie.
5. Benennung der Verantwortlichen für Umsetzung und Kontrolle.
6. Lückenlose Auflistung der offenen Punkte.

## Maßnahmenhierarchie (Pflicht)

Schutzmaßnahmen werden **immer** nach STOP/TOP-Prinzip strukturiert:

1. **S — Substitution** (Gefahrenquelle entfernen oder ersetzen).
2. **T — Technische Maßnahmen** (bauliche Lösungen, Abschirmungen, Technik).
3. **O — Organisatorische Maßnahmen** (Abläufe, Schulung, Personalplanung).
4. **P — Persönliche Schutzausrüstung / individuelle Maßnahmen**.

Reine PSA-Lösungen ohne vorher geprüfte technische/organisatorische Maßnahmen
sind unzulässig.

## Risikobewertung

- 3×3-Matrix: Wahrscheinlichkeit (gering/mittel/hoch) × Schwere
  (gering/mittel/hoch) → Gesamtrisiko (niedrig/mittel/hoch).
- Keine erfundenen numerischen Kennzahlen (RPZ, Score, Prozentwerte) ohne
  Datenbasis im Input.
- **Vollständigkeit ist Pflicht**: jede in `{GB_GEFAEHRDUNGEN}` (bzw. dem
  produktspezifischen Gefährdungs-Block) namentlich aufgeführte Gefährdung
  **muss** im Risikobewertungs-Block `{GB_RISIKOBEWERTUNG}` mit
  **identischer Bezeichnung** auftauchen und dort eine vollständige Bewertung
  (Wahrscheinlichkeit, Schwere, Gesamtrisiko) erhalten. Fehlt eine bewertung,
  ist das ein `[OFFENER PUNKT]` und kein „Auslassen aus stilistischen
  Gründen".
- Keine Gefährdung darf ohne Bewertung bleiben. „Wird nicht bewertet" ist
  nie zulässig.

## Verantwortlichkeiten — Rollentrennung (Pflicht)

Die GB benennt mindestens diese Rollen, **jede in einer eigenen Zeile**:

- **Auftraggeber** (`client_name`)
- **Auftragnehmer / Sicherheitsdienst** (Cert-Expert oder gleichwertig)
- **Einsatzleitung** (operative Leitung vor Ort)
- **Sanitätsdienst / medizinische Versorgung** (`medical_service`)
- **Ersteller dieser GB** (`created_by`)
- **Freigeber dieser GB** (`approved_by`)
- **Externe Behörden** (Ordnungsamt, Polizei, Feuerwehr) — soweit relevant

Verbindliche Regeln:

1. **Rollen werden nicht zusammengelegt.** `created_by` ist niemals
   automatisch identisch mit der Einsatzleitung. Wenn die Einsatzleitung
   nicht im Input belegt ist, wird sie als eigene Zeile mit
   `[OFFENER PUNKT]` ausgegeben — nicht mit dem Namen aus `created_by`.
2. **Konkrete Namen nur dann, wenn sie im Input stehen.** Sonst Rollen-
   bezeichnung oder `[OFFENER PUNKT]`. Insbesondere werden Namen aus
   `created_by` ausschließlich in der Zeile „Ersteller dieser GB"
   verwendet, in keiner anderen Rolle.
3. **Nicht belegte Rollen werden nicht weggelassen.** Jede Rolle aus der
   Liste oben erhält eine eigene Zeile; ist sie nicht belegt, lautet die
   Zeile `[OFFENER PUNKT] <Rolle> nicht im Input belegt`.
4. **`approved_by` leer ⇒ keine Freigabe.** `qa_status` bleibt
   `"review_required"`, solange `approved_by` leer ist; die fehlende
   Freigabe erscheint immer im konsolidierten Offene-Punkte-Block.

## Beispiele sind Stil-, keine Inhaltsquelle

- Beispieldateien unter `knowledge/examples/` zeigen **Struktur und
  Schreibstil**. Sie sind **keine Quelle** für konkrete Inhalte.
- Verboten ist, aus einem Beispiel zu übernehmen:
  Paragraphen-Zitate (z. B. `§34a GewO`), Minuten- oder Stundenangaben
  (z. B. „60 Minuten vor Einlass"), konkrete Personalverteilungen
  (z. B. „2 Kräfte Einlass, 2 Kräfte Ringbereich"), benannte Funkkanäle
  oder benannte Geräte, sofern diese Angaben nicht im Input des
  konkreten Auftrags stehen.
- Wenn die maßgebliche Rechtsgrundlage, der Briefing-Zeitpunkt, die
  Personalverteilung oder die Funkkanal-Belegung nicht im Input belegt
  sind, wird das im konkreten Dokument als `[OFFENER PUNKT]` markiert,
  niemals mit Beispielzahlen aufgefüllt.

## Verboten

- Eine GB ohne Risikobewertung abgeben.
- Eine GB mit ausschließlich PSA-Maßnahmen abgeben.
- Eine in `{GB_GEFAEHRDUNGEN}` benannte Gefährdung in `{GB_RISIKOBEWERTUNG}`
  weglassen oder „zusammenfassen, ohne sie zu nennen".
- `created_by` als Einsatzleitung ausgeben.
- `qa_status: "ok"` zurückgeben, wenn `approved_by` leer ist — die Freigabe
  ist immer ein OFFENER PUNKT, solange sie nicht eingetragen wurde.
- Behördliche Genehmigungen, Anzeigen oder Sondernutzungen als „erteilt"
  oder „liegt vor" formulieren, sofern nicht explizit im Input.
- Inhalte aus Beispieldateien (Paragraphen, Minuten, Kopfzahlen, Funk-
  kanäle) als Auftragsfakten ausgeben.
