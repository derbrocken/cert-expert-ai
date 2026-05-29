# Reviewer-Handoff — Bot-Pflichten (operativ)

Diese Datei ergänzt `hallucination_boundaries.md` und `open_points_rules.md`.
Sie beschreibt, welche Inhalte **immer als Entwurf** zu behandeln sind und wo
menschliche Prüfung vorgesehen ist — **ohne** juristische Endbewertungen zu
ersetzen.

Menschenlesbare Governance: `docs/REVIEWER_LOGIC.md` (wird nicht in Prompts
geladen).

## Grundregel

Alles, was im Auftrag nicht belegt ist und trotzdem konkret wirken würde
(Zahlen, Zeiten, Kanäle, Paragraphen, Behördenbescheide, finale Personal- oder
Qualifikationsentscheidungen, medizinische oder polizeiliche Absprachen), ist zu
`**[OFFENER PUNKT]**` zu kennzeichnen und in `open_points` aufzunehmen — nicht
zu „passend“ zu formulieren.

## Nie als automatisch final behandeln

Erfinde oder impliziere **nicht**:

- behördliche Genehmigungen, Auflagen oder deren Inhalt als geklärt;
- bestimmte Funk- oder Kommunikationskanäle, Frequenzen, Sprechgruppen;
- finale Kräftezahlen, genaue Kopfzahlverteilung oder Schichtmodelle,
  sofern nicht im Input (oder verifiziert im Input referenziertem Dokument);
- Fluchtweg- / Rettungskonzepte als vollständig oder „ausreichend“;
- konkrete Sanitätsstruktur (Träger, Leitungen, Übergaben) ohne Input;
- Polizei- oder Feuerwehr-Einsatzlogik über allgemeine Schnittstellenhülsen
  hinaus;
- Freigaben: ist `approved_by` leer, bleibt fehlende Freigabe ein **OFFENER
  PUNKT** (siehe Produktregeln).

## SDL- und Beispielwissen

Themenraster aus `knowledge/3_sdls/` (Veranstaltungsdienst, Subtypen) und Stil
aus `knowledge/10_examples/` dienen der **Struktur und Plausibilität**, nicht dem
**Konkretisieren** fehlender Auftragsdaten.

## Reviewer-Transparenz

Formulierungen so wählen, dass ein Prüfer erkennt: Was aus Input folgt, was
Allgemeinwissen (nur wo erlaubt), und was bewusst offen bleibt.
