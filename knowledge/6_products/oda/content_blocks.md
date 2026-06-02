# Produkt: ODA — Inhaltsblöcke (`ODA_*`-Platzhalter)

Geplanter Referenz-Blueprint: `oda_event_standard` (noch nicht implementiert).

---

## `{ODA_ZWECK_GELTUNG}` — Zweck und Geltungsbereich

**Was:** Wofür die VA gilt (Posten, Objekt, Zeit).
**Inhalt:** Event/Ort/Zeit aus Input; Bezug EK; Geltungsgrenzen.

---

## `{ODA_AUFGABEN}` — Aufgaben und Verhalten

**Was:** Konkrete Tätigkeiten am Posten.
**Inhalt:** Einlass, Kontrolle, Streife, Beobachtung — nur aus EK/Input.
**Stil:** Kurze, nummerierte Anweisungen.

---

## `{ODA_NOTFALL}` — Notfall und Vorkommnisse

**Was:** Verhalten bei Brand, Verletzung, Gewalt, Evakuierung.
**Inhalt:** Meldeweg an EL; keine erfundenen Sammelplätze.
**Verweis:** Fluchtwege nur wenn im Input/EK.

---

## `{ODA_KOMMUNIKATION}` — Kommunikation und Meldewesen

**Was:** Funk, Telefon, Meldeketten.
**Inhalt:** Kanäle nur wenn benannt; sonst `[OFFENER PUNKT]`.

---

## `{ODA_AUSRUESTUNG}` — Bekleidung und Ausrüstung

**Was:** PSA, Dienstkleidung, Kontrollen.
**Inhalt:** Nur aus Auftrag/Profil.

---

## `{ODA_DIENSTUEBERGABE}` — Dienstübernahme und -übergabe

**Was:** Ort, Zeit, Dokumentation der Übergabe.
**Inhalt:** Kein Dienstende ohne Übergabe (Prinzip).

---

## `{ODA_RECHTLICH}` — Rechtlicher Hinweis

**Was:** Keine hoheitlichen Befugnisse; Hausrecht im Auftrag.
**Inhalt:** Standardhinweis ohne Paragrafenzitat erfinden.

---

## `{ODA_OFFENE_PUNKTE}` — Offene Punkte

**Was:** Fehlende Posteninfos, fehlendes EK, fehlende Unterweisungsnachweise.
