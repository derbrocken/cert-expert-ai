# Produkt: EK — Inhaltsblöcke (`EC_*`-Platzhalter)

Geplanter Referenz-Blueprint: `ec_event_kampfsport` (siehe `docs/BLUEPRINT_ARCHITECTURE.md`).
Kürzere Registry-Variante in `docs/PLACEHOLDER_REGISTRY.md` — Blueprint ist maßgeblich.

---

## `{EC_EINSATZBESCHREIBUNG}` — Einsatzbeschreibung

**Was:** Kurzüberblick des Einsatzes aus AN-Sicht.
**Inhalt:**
- Event, Ort, Zeitraum, Auftraggeber (aus Input).
- Leistungsumfang SD (Einlass, Streife, Ring, … — nur belegt).
- Bezug zum SK, falls `upstream_sk` vorhanden; sonst `[OFFENER PUNKT]` wenn Pflicht.

---

## `{EC_KRAEFTE}` — Einsatzkräfte / Struktur

**Was:** Organisationsstruktur der eingesetzten Kräfte.
**Inhalt:**
- Einsatzleitung, Gruppenführer, Abschnitte (Rollen, nicht erfundene Namen).
- Qualifikationsbezug nur allgemein („FK gemäß Profil“), keine erfundenen Codes.
- Anzahl nur aus Input — sonst `[OFFENER PUNKT]`.

**Alias in Registry:** teils `EC_EINSATZKRAEFTE` — Blueprint-ID festlegen bei Implementierung.

---

## `{EC_POSITIONIERUNG}` — Positionierung / Aufgaben

**Was:** Wer ist wo eingesetzt (Lageaufgaben, nicht GPS-Koordinaten erfinden).
**Inhalt:**
- Abschnitte: Einlass, Innenraum, Ring, Außen — je nach Subtyp/Input.
- Wechsel bei Phasen (Anreise, Spiel/Show, Auslass) nur wenn plausibel/belegt.

---

## `{EC_ABLAUF}` — Ablauf / Phasen

**Was:** Zeitlicher und operativer Ablauf.
**Inhalt:**
- Anknüpfung an `veranstaltungsschutz/base.md`-Phasen (Aufbau → Einlass → Hauptprogramm → Auslass → Abbau).
- Meilensteine aus Input (Anpfiff, Show-Beginn, …).
- Keine erfundenen Uhrzeiten.

---

## `{EC_KOMMUNIKATION}` — Kommunikation

**Was:** Funk, Meldekette, Ansprechlogik während des Einsatzes.
**Inhalt:**
- Kanäle/Rollen (Einsatzleitung ↔ Abschnitte ↔ Sanität) — Prinzip.
- Keine erfundenen Rufnummern oder Frequenzen.

---

## `{EC_NOTFALLPLAN}` — Notfall / Störung

**Was:** Orientierung bei Störung, medizinischem Notfall, Räumung.
**Inhalt:**
- Meldeweg und Eskalation (intern → Sanität/Behörde) — nur belegt.
- Räumungs-/Sammelpunkt-Logik nur mit Objekt-/SK-Input; sonst `[OFFENER PUNKT]`.
- Bot ersetzt keinen genehmigten Evakuierungsplan.

---

## `{EC_OFFENE_PUNKTE}` — Offene Punkte

**Was:** Operative Lücken vor Einsatzfreigabe.
**Inhalt:** Nummeriert; inkl. fehlendes SK, ungeklärte Kräfte, fehlende Absprache Polizei.

---

## Nicht in jedem Blueprint

Zusätzliche Blöcke (Logistik, Fahrzeug, Material) nur per Blueprint-JSON.
Namespace: ausschließlich `EC_*` in EK-Dokumenten.
