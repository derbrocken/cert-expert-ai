# Namenskonventionen — Cert-Expert AI / DIN 77200

**Zweck:** Einheitliche Benennung von Ordnern und Dateien — verhindert Parallelstrukturen und gebrochene Links.

---

## Ordner (stabil)

| Regel | Beispiel |
|-------|----------|
| **Nicht ohne Freigabe umbenennen** | `DIN 77200-1`, `DIN 77200-2`, `Governance` |
| **Exakte Schreibweise** | `DIN 77200-1` und `DIN 77200-2` — mit Leerzeichen, Bindestrich, Großbuchstaben wie bestehend |
| **Governance-Pfad** | `knowledge/1_standards/Governance/DIN 77200/` |
| **Keine neuen Root-Ordner** unter `knowledge/` ohne Freigabe (z. B. kein `knowledge/standards/`) |
| **Keine Parallel-Governance** | kein `din_77200/` als Inhaltsablage |

---

## Fachordner DIN 77200-1

| Muster | Beispiel |
|--------|----------|
| CEKS-Module | Unicode-Dateinamen: `Qualifikationsanforderungen.md`, `Führungsanforderungen.md` |
| Master-Index | `overview.md` (klein) |
| Unterordner | `anforderungsprofile/`, `qualifikationssystem/` (klein) |
| Qualifikationssystem | nummeriert: `01_grundqualifikationen.md` … `05_sdl_freigabelogik.md` |

---

## Fachordner DIN 77200-2

| Muster | Beispiel |
|--------|----------|
| Einstieg | `README.md` |
| Module | nummeriert: `01_uebersicht.md` … `08_fluechtlings_und_asylunterkuenfte.md` |
| Unterordner | `anforderungsprofile/` (klein) |

---

## Anforderungsprofile (V1 — nicht ändern ohne Freigabe)

| Normteil | Dateiname |
|----------|-----------|
| DIN 77200-1 | `77200-1_<sdl_slug>.md` — z. B. `77200-1_alarmdienst.md` |
| DIN 77200-2 | `77200-2_<sdl_slug>.md` — z. B. `77200-2_oepnv.md` |
| Master | `_master_77200-1.md`, `_master_77200-2.md` |

**Verboten ohne Freigabe:** unprefixed Namen (`alarmdienst.md`), Duplikate in beiden Normordnern, Kopien nach `10_examples/anforderungsprofile/`.

---

## Governance-Dateien

| Muster | Beispiel |
|--------|----------|
| Meta-Dokumente | **GROSSBUCHSTABEN** + `.md` erlaubt: `AGENT_ONBOARDING.md`, `CURRENT_STATE.md` |
| Wikilinks | Obsidian-Stil: `[[CURRENT_STATE]]`, `[[../DIN 77200-1/overview]]` |

---

## Generator

| Regel | Wert |
|-------|------|
| Script | `scripts/generate_anforderungsprofile.py` |
| Output 77200-1 | `knowledge/1_standards/DIN 77200-1/anforderungsprofile/` |
| Output 77200-2 | `knowledge/1_standards/DIN 77200-2/anforderungsprofile/` |

Pfadänderung nur mit expliziter Freigabe und Anpassung aller Verweise.

---

## Groß-/Kleinschreibung

- Bestehende Dateien: **Schreibweise beibehalten** (macOS/Linux: Pfade case-sensitive beachten).
- Neue Dateien in 77200-2: **snake_case** mit Nummerpräfix (`05_veranstaltungen_...`).
- Neue Dateien in 77200-1 CEKS: **Konvention des Ordners** (Unicode-Modulnamen oder `01_`-Präfix in qualifikationssystem).

---

## Agent-Stopps

1. Ordner `DIN 77200-1` → `din_77200_1` umbenennen — **nein**
2. Governance nach `DIN 77200-1/governance/` — **nein**
3. Neue Dokumenttyp-Ordner unter Governance — **nein** (siehe [[MIGRATION]])
4. Wikilinks ohne Pfadprüfung massenhaft ändern — **nein**

Siehe [[AGENT_RULES]], [[ARCHITECTURE]].
