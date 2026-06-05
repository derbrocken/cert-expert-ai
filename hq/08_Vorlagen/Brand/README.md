# Cert-Expert — Brand Assets (Master)

**Stand:** 2026-06-05  
**Zweck:** Offizielle Logo-Quellen für **Dokumente, Publikationen, Angebote, DEKRA-Ordner, Website** — nicht nur Dashboard.

> **Source of Truth:** Dateien in **diesem Ordner**. Dashboard und andere Ableitungen sind Kopien/Derivate.

---

## Dateien

| Datei | Inhalt | Wann nutzen |
|-------|--------|-------------|
| [`cert-expert-mark-mantis-circle.png`](cert-expert-mark-mantis-circle.png) | Gottesanbeterin im weißen Kreis (Icon) | Favicon, App-Icon, Briefkopf klein, Wasserzeichen, Social-Avatar |
| [`cert-expert-logo-lockup-horizontal.png`](cert-expert-logo-lockup-horizontal.png) | Icon + **CERT·EXPERT** (horizontal, dunkler Hintergrund) | Titelseiten, Präsentationen, PDF-Cover, breite Header |

**Format:** PNG, 1024×724 px, RGBA.

---

## Markenfarbe (HQ / Dashboard abgestimmt)

| Rolle | Hex | Verwendung |
|-------|-----|------------|
| Cert-Expert Rot | `#e30613` | Mantis, Akzente, CTAs |
| Text dunkel | `#111827` | Wordmark auf hellem Grund *(Variante ggf. später)* |
| Hintergrund Logo-Quelle | Schwarz | Lockup-Master wie geliefert |

---

## Ableitungen (automatisch / Kopien)

| Ziel | Quelle | Befehl / Hinweis |
|------|--------|------------------|
| HQ-Dashboard `cert-expert-logo.png` | Lockup horizontal | `python3 hq/scripts/prepare_dashboard_logo.py` (nach Update der Quelle in `html/assets/cert-expert-logo-source.png`) |
| Dashboard Icon | Mantis-Kreis | Kopie → `hq/00_Dashboard/html/assets/mantis-mark.png` |

Nach Änderung am **Master** hier: Lockup nach `cert-expert-logo-source.png` kopieren, dann `prepare_dashboard_logo.py` ausführen.

---

## Word / PDF / Publikation

1. **Dunkler Hintergrund** → `cert-expert-logo-lockup-horizontal.png` direkt einfügen.
2. **Hell (Word-Briefpapier)** → Lockup einfügen; bei Bedarf Hintergrund in Word auf Weiß setzen oder später helle Export-Variante anlegen (`export/` — noch nicht vorhanden).
3. **Nur Symbol** → `cert-expert-mark-mantis-circle.png`.

Empfohlene Mindestbreite im Dokument: Lockup **≥ 40 mm**, Icon **≥ 12 mm**.

---

## OneDrive (optional)

Spiegel für QM/Vertrieb: `QM/Strategie/` oder `QM/Marke/` — **dieses Repo-Verzeichnis bleibt Git-Master** für Bots und HQ.
