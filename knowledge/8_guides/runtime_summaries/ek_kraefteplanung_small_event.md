# Runtime Summary — EK Kräfteplanung (kleines Event)

**Ziel:** Für kleine Hallen-Events eine **Rollenlogik** liefern, ohne automatische Kräfteoptimierung.

## Prinzipien

- Der Bot **berechnet** keine Kräftezahl. Er übernimmt nur `security_staff_count` aus Input.
- Fehlt die Kräftezahl: `[OFFENER PUNKT] Kräftezahl fehlt`.
- Rollen-/Abschnittslogik muss zur Kräftezahl passen. Bei Widerspruch: `[OFFENER PUNKT]`.

## Minimal-Rollenlogik (Beispiel, nur wenn Input passt)

- **1 Kraft:** nur Basissicht (Ansprechpartner + Rundgang) → Grenzen klar benennen.
- **2 Kräfte:** 1× Einsatzleitung/Koordination, 1× Einlass/Innenraum/Rundgang (sequenziell, nicht parallel).
- **3–4 Kräfte:** Einlass (2), Innenraum/Ringnähe (1), EL/Koordination (1) — je nach Ablaufphasen.

## Offene Punkte, die typischerweise auftauchen

- Einlassbeginn/Briefingzeit fehlen.
- Ring-/Backstage-Zutrittsregeln fehlen.
- Sammelpunkt/Räumungsweg fehlen.
- Sanitätsdienst/Ersthelferregelung unklar.
