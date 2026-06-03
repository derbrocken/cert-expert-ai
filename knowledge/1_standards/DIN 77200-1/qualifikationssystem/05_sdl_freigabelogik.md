# SDL-Freigabelogik

Entscheidungsmodell: Darf ein Mitarbeiter für eine **SDL-Verwendung** (Objekt / Auftrag / Schichtkontext) freigegeben werden?

**Keine** Mitarbeiter-Gesamtliste · **keine** Einsatzplanung.

---

## Prüfbausteine

Freigabe entsteht aus der **Konjunktion** aller relevanten Bausteine:

```
(1) Anforderungsprofil     — Tätigkeiten + Stufe A/B/C (+ AG-Erhöhung)
(2) Grundqualifikation    — [[01_grundqualifikationen]]
(3) Pflichtqualifikationen — [[02_pflichtqualifikationen]]
(4) SDL-Zusatzqualifik.  — [[03_sdl_zusatzqualifikationen]]
(5) Weiterbildungsstatus  — [[04_weiterbildungslogik]]
(6) Objektbez. Unterweisung — Einweisung am Leistungsort (3.18, 4.25)
═══════════════════════════════════════════════════════════════════════
                    SDL-FREIGABE-ENTSCHEIDUNG
```

---

## Eingang: Anforderungsprofil

Aus dem Profil je Verwendung auslesen:

| Profilfeld | Freigabe-Relevanz |
|------------|-------------------|
| Tätigkeit (Erbringen = Ja) | Welche Tätigkeiten sind aktiv? |
| Stufe A/B/C | Mindest-Grundqualifikation → Baustein (2) |
| AG-Erhöhung | Erhöhtes Minimum — nicht unterschreiten |
| Bemerkung | Kontext für Einschränkungen |

**Nicht aus Profil:** Ersthelfer, Brandschutz, Führerschein → Baustein (3).

---

## Entscheidungsstatus

| Status | Bedeutung |
|--------|-----------|
| **freigegeben** | Alle relevanten Bausteine erfüllt; Verwendung für SDL zulässig |
| **eingeschränkt freigegeben** | Teilweise erfüllt; nur definierte Teiltätigkeiten / mit Auflagen |
| **nicht freigegeben** | Mindestens ein kritischer Baustein fehlt |

---

## Entscheidungsregeln (Logik)

### freigegeben

Alle **für diese SDL-Verwendung relevanten** Prüfpunkte:

- [ ] Höchste geforderte Profil-Stufe A/B/C in Personalakte nachgewiesen
- [ ] §34a-Basis (Stufe A) grundsätzlich vorhanden
- [ ] Pflichtqualifikationen (Ersthelfer etc.) **aktuell**, soweit für Verwendung vorgesehen
- [ ] SDL-Zusatzqualifikationen erfüllt (z. B. Intervention: 24 h + 5 Einsätze)
- [ ] Weiterbildungsstatus **aktuell** (UE + Nachweise)
- [ ] Objektbezogene Einweisung für Einsatzort **vorhanden**

### eingeschränkt freigegeben

Beispiele (Begründung **pflicht**):

- Weiterbildung kurz vor Fristende, UE fast vollständig — Auflage: Nachweis bis Datum X
- Nur Teiltätigkeiten des Profils freigegeben (andere Zeilen erfordern höhere Stufe)
- Zusatzqualifikation in Anbahnung (Schulung gebucht, noch kein Zertifikat)

**Pflichtfeld:** `einschraenkung` — welche Tätigkeiten / welche Auflagen

### nicht freigegeben

Mindestens einer:

- Geforderte Stufe B/C nicht nachgewiesen
- §34a / Stufe A fehlt oder Frist überschritten
- Abgelaufene Pflichtqualifikation (Ersthelfer)
- Fehlende SDL-Zusatzqualifikation (Intervention, 77200-2-Schulung)
- Weiterbildungsstatus nicht aktuell (organisationsinterne Sperrregel)
- Fehlende objektbezogene Einweisung vor Ersteinsatz

---

## Entscheidungsdokument (Schema)

Pro Prüfvorgang (nicht operative Schichtplanung):

```markdown
## SDL-Freigabe — [SMA-Referenz] — [SDL / Verwendung]

**Objekt / Auftrag:** [ ]
**Anforderungsprofil-Referenz:** [ ]
**Datum / Prüfer:** [ ]

### Bausteinprüfung

| Baustein | Status | Kurzbegründung |
|----------|--------|----------------|
| Anforderungsprofil | ☐ ok | |
| Grundqualifikation A/B/C | ☐ ok | gefordert: _ / nachgewiesen: _ |
| Pflichtqualifikationen | ☐ ok | |
| SDL-Zusatzqualifikationen | ☐ ok / n.a. | |
| Weiterbildungsstatus | ☐ ok | UE: _/_ |
| Objekt-Einweisung | ☐ ok | |

### Entscheidung

**Status:** ☐ freigegeben · ☐ eingeschränkt · ☐ nicht freigegeben

**Begründung:**

**Nachweisliste:**
- [ ] …
- [ ] …

**Einschränkung / Auflage:**

**Nächste Prüfung:**
```

---

## Priorität bei Konflikten

| Konflikt | Regel |
|----------|-------|
| Profil Stufe A, Personal B | Freigabe für A-Tätigkeiten ok; AG-Erhöhung beachten |
| Profil Stufe B, Personal nur A | **nicht freigegeben** für B-Tätigkeiten |
| Ersthelfer abgelaufen | mindestens **eingeschränkt** / organisationsintern **nicht freigegeben** |
| Intervention ohne 5 Einsätze | **nicht freigegeben** für Interventions-SDL |

---

## Tool-1 / Automatisierung (Ausblick)

Geplante Slots (ohne Implementierung):

- `profil_id`, `sdl_slug`, `sma_id`
- `check_grundqualifikation`, `check_pflicht`, `check_zusatz`, `check_wb`, `check_einweisung`
- `freigabe_status`, `freigabe_begruendung`, `nachweis_ids[]`

---

## Verwandtes

| Modul | Rolle |
|-------|-------|
| [[Anforderungsprofile]] | Input Tätigkeit + Stufe |
| [[Qualifikationsanforderungen]] | Audit-Tiefe Stufen |
| [[Auditnachweise]] | Nachweisregister |
| [[Führungsanforderungen]] | Führungsfreigabe gesondert |
