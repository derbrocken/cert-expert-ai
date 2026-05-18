# SDL-Rohwissen — Architektur (`projects/_knowledge_raw/sdls/`)

Langfristige Rohstruktur für **sicherheitsdienstliche SDLs** (deutsche
Bezeichner). Inhalt unter `knowledge/sdls/` entsteht erst durch Kuratierung.

## Regeln (Kurz)

- **Szenarien** = operative Overlays **ohne** automatische DIN-Aktivierung.
- **DIN 77200-1 / -2** = nur wirksam bei **vertraglich oder zertifizierungsseitig**
  aktiviertem Regelungsumfang (`modes/`).
- Gemeinsame **Veranstaltungs-Szenarien**: `_shared/scenarios/veranstaltungsdienst/`.
- Frühere Rohordner liegen unter `_archive_previous_structure/` (unverändert).

## SDL-Ordner (je Ordner Standardstruktur)

Siehe jeweiliges `README.md`, `base.md`, `modes/`, `anforderungsprofile/`,
`requirements.md`, `scenarios/`, `references.md`.

## DIN-Zuordnung (Überblick)

| DIN 77200-1 | DIN 77200-2 |
|-------------|-------------|
| alarmdienst, stationaerer_empfangsdienst, stationaerer_kontrolldienst, revierdienst, interventionsdienst, mobiler_kontrolldienst, veranstaltungsdienst | veranstaltung_besondere_sicherheitsrelevanz, gebaeude_besondere_sicherheitsrelevanz, fluechtlings_asylunterkuenfte, oepnv |

## Geteilte Dokumenttypen (Stub)

`_shared/common_documents/` — typische Schriftstücke (ohne SDL-Fachfüllung).
