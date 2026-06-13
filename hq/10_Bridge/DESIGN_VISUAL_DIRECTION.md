# Cert-Expert — Visual Direction (verbindlich für alle UI)

> **Status:** Verbindliche Design-Leitlinie (Mark, 2026-06-14). Gilt für **jede** UI-Arbeit an der App (Tool 1, Tool 2/Mitarbeiterakte, Upload-Manager, künftige Projektakte) — inkl. des Maske-Konzepts (`AKTE_MASKE_KONZEPT.md`).
> **Leitbild:** *Premium Audit File OS* — ein professioneller digitaler Audit-Ordner & Zertifizierungs-Cockpit für Sicherheitsunternehmen. Ruhig, strukturiert, premium, dokument-orientiert, audit-grade.

## Markenfarbe
- **Brand-Accent = Vermillion.** **KEIN** Grün, **kein** Petrol als primärer Marken-Accent.
- Vermillion nur für: **Marken-Emphase, aktive Navigation, primäre Aktionen, kleine Highlights, Fokus-Indikatoren, ausgewählte Zustände.**
- **Vermillion ist NICHT die Default-Fehlerfarbe.**
- **Operative Status-Farben strikt getrennt von der Markenfarbe halten.**
- Implementierungs-Hinweis: Der bestehende Token im Code ist `#e30613` (rot-stichiges Vermillion) als Cert-Expert-Accent (`text-[#e30613]`, `bg-[rgba(227,6,19,…)]`, `#b80510` für Hover). ⚠️ **Achtung Kollision:** Brand-Vermillion und Status-Rot (Fehler/kritisch) dürfen sich nicht verwechseln lassen → beim Visual-Pass eine **eigene, klar unterscheidbare Fehler-Rot-Nuance** definieren (z. B. ein neutraleres/dunkleres Rot für Status), Brand bleibt Vermillion. Exakter Vermillion-Hex bei der Umsetzung final bestätigen.

## Farbsystem
- **Hintergrund:** Weiß / Off-White / sehr helles Grau.
- **Text:** Anthrazit / dunkles Navy.
- **Brand-Accent:** Vermillion (s. o.).

## Status-Logik (getrennt von der Marke)
| Farbe | Bedeutung |
|-------|-----------|
| **Grau** | nicht bewertet / nicht implementiert / nicht erforderlich |
| **Gelb/Amber** | offen / Prüfbedarf / fachlich prüfen |
| **Rot** | fehlt / kritisch / Compliance-Risiko |
| **Grün** | vollständig / vorbereitet / vorhanden |
| **Vermillion** | Marken-Accent / primäre Aktion / aktiver Cert-Expert-Kontext |

## UX-Prinzipien
- **Dossier-/Akten-Logik** statt generischer Datenbank-UI.
- **Cards, Sektionen, Evidence-Blöcke, Status-Chips** statt überladener Tabellen.
- Viel **Whitespace**, **subtile Rahmen**, klare **Dokument-Hierarchie**.
- **Kein** verspielter SaaS-Look. **Kein** Cyberpunk/Dark-Security-Theme. **Kein** überladenes Dashboard.
- **Niemals** automatische Zertifizierung/Freigabe/Compliance/Auditfähigkeit suggerieren (= EC-10, deckungsgleich).

## Emotionale Wirkung (Zielbild)
Ruhige Kontrolle, Premium-Beratungsqualität, Audit-Disziplin, Cert-Expert-Autorität.

---

> **Anwendung:** Jeder UI-Slice prüft sich gegen diese Leitlinie. Insbesondere: Marken-Vermillion ≠ Status-Rot; Status-Palette wie oben; Card-/Dossier-Layout; keine Freigabe-/Auditfähigkeits-Suggestion (EC-10).
