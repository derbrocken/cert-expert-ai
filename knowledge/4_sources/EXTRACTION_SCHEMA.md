# Extraktionsschema — DGUV / Behörden / Praxisleitfäden

**Ziel:** Bot-taugliche Kuratierung aus Rohdokumenten — **keine** Normabschrift, **keine** wörtlichen Langzitate.

Jede freigegebene Extrakt-Datei unter `knowledge/4_sources/{dguv|behoerden|praxisleitfaeden}/` folgt diesem Schema (als Markdown-Abschnitte).

---

## Metadaten (Kopf)

```yaml
source_id: dguv-info-211-xxx          # interne ID
source_type: dguv | behoerde | praxisleitfaden
title: "Kurztitel (ohne geschützte Vollzitate)"
raw_location: inputs/... oder projects/_knowledge_raw/...
curated_date: YYYY-MM-DD
review_status: draft | reviewed | released
applies_to_sdls: [veranstaltungsschutz]
applies_to_subtypes: [konzert, festival]   # optional
applies_to_products: [gb, sk, ek, oda]    # optional
```

---

## Pflichtabschnitte

### 1. Gefährdungsarten

Thematisches Raster (Stichworte, keine erfundenen Messwerte):

- Welche **Klassen** von Gefährdungen die Quelle für Veranstaltungen adressiert
- Abgrenzung: was **nicht** ohne Projekt-Input behauptet werden darf

### 2. Maßnahmenmuster

- Typische **Maßnahmenkategorien** (organisatorisch, technisch, personenbezogen)
- Bezug zur Maßnahmenhierarchie (vgl. [[../2_regulations/dguv_v1/overview]]) — **ohne** Paragrafenzitate

### 3. Prüffragen (Reviewer / Bot)

- Fragen, die ein Mensch oder Bot stellen soll, **bevor** ein Abschnitt generiert wird
- Beispiel: „Ist die zulässige Personenzahl im Input genannt?“

### 4. Dokumentationsregeln

- Was in GB/SK/EK/ODA **dokumentiert** werden muss (Prinzip)
- Welche **Nachweise** üblich sind (Checkliste, nicht als erledigt behaupten)

### 5. Formulierungsbausteine

- Neutrale, wiederverwendbare Formulierungen (keine Kundennamen, keine festen Zahlen)
- Sprachebene: sachlich, bedingt („sofern im Auftrag …“)

### 6. Offene Punkte / Nicht-erfinden-Regeln

- Explizite **Stopps** für die KI (z. B. keine Mindestkräfte ohne Input)
- Verweis auf `knowledge/9_rules/` wo harte Regeln bereits existieren

---

## Qualitätsgrenzen

| Erlaubt | Verboten |
|---------|----------|
| Prinzipien, Checklisten, Fragen | Volltext Absätze aus DGUV PDF |
| Verweis „Quelle: DGUV Information … (intern)` | Zitierfähige Paragrafen/Grenzwerte ohne Input |
| „Typischerweise …“ mit Input-Bedingung | Konkrete Personenzahl aus Quelle ohne Projekt-Input |

**Max. Größe pro Extrakt:** ~600–800 Tokens (wie SDL-Subtyp) — bei Bedarf in `thema_teil_a.md` / `thema_teil_b.md` splitten.

---

## Registry-Eintrag

Jeder Unterordner hält eine `README.md`-Tabelle: `source_id`, Titel, Status, verlinkte Extrakt-MD, betroffene Subtypen.
