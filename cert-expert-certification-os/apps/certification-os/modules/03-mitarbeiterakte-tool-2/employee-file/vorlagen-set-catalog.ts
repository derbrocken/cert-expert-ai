/**
 * Vorlagen-Set-Katalog (#D, Dispatch Lane G) — Set-Auswahl je Set-Kategorie +
 * positionsunabhängige Overlays.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * BEGRIFFS-MODELL (verbindlich — Feedback E, NICHT vermischen):
 *  - **Set-Kategorie** (diese Datei) = `Sicherheitsmitarbeiter | Führungskraft |
 *    Bürokraft (Verwaltung)`. EIGENE Achse, die das **Generator-Vorlagen-Set**
 *    (Core-Dokumente) ableitet. Reine Dokument-Steuerung.
 *  - **≠ Norm-Klasse** `roleClasses[]` (`ek/fk/verwaltung/…`): treibt das
 *    Engine-Grundset (Pflicht-Set/UE-Soll). Wird hier NICHT angefasst.
 *  - **≠ Org-Titel** `roleType` (z. B. Schichtleiter): reine Anzeige.
 *  - `standard models` (Upload-Manager) = Tool 1 → hier NICHT importiert/gemischt.
 *
 * EC-10: Dieser Katalog macht KEINE Freigabe-/Auditfähigkeits-/„qualifiziert"-
 * Aussage. Er wählt nur, welche Vorlagen-Dokumente exportiert werden.
 *
 * NORM: Set-Kategorie ist KEINE Norm-Pflicht (keine CL). Einzig das
 * **Fahrtätigkeit-Overlay** trägt eine CL: CL-73 (Fahrer-/UVV-Unterweisung,
 * `legal-input`) → „fachlich prüfen", KEIN erfundener Wert.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ⚠️ GEPARKTE DATEN-/MARK-FRAGE (siehe HANDOFF): Welche konkreten
 * S3-Template-Ordner (`roles/<slug>`) zu welcher Set-Kategorie gehören, ist eine
 * Daten-/Mark-Entscheidung. Heute existiert im Bucket nur „DIN 77200 Allgemeine".
 * Bis Mark die echte Zuordnung liefert, mappt der Katalog jede Set-Kategorie über
 * eine **Default-/Platzhalter-Heuristik** (`DEFAULT_SET_ROLE_SLUGS`) auf einen
 * Rollen-Slug; greift keiner, fällt die Auswahl tolerant auf die erste/vorhandene
 * Rolle zurück (kein Bruch, EC-09). Persistenz reitet auf dem bestehenden
 * `roleId`-Feld → KEIN Schema-/Repo-Eingriff (eigene `setKategorie`-DB-Spalte =
 * geparkter Schema-Slice).
 */

import type { Role } from "@/lib/types/employee";

/** Set-Kategorie = eigene Vorlagen-Achse (NICHT Norm-Klasse, NICHT Org-Titel). */
export type SetKategorie =
  | "sicherheitsmitarbeiter"
  | "fuehrungskraft"
  | "buerokraft";

export interface SetKategorieDef {
  id: SetKategorie;
  /** DE-Label fürs Dropdown/Anzeige. */
  label: string;
  /** Kurzbeschreibung für die UI. */
  description: string;
}

/**
 * Die drei Set-Kategorien (Mark-Feedback D + Q6). Reihenfolge = UI-Reihenfolge.
 * Keine CL — Set-Kategorie ist Doku-Steuerung, keine Norm-Pflicht.
 */
export const SET_KATEGORIE_DEFS: readonly SetKategorieDef[] = [
  {
    id: "sicherheitsmitarbeiter",
    label: "Sicherheitsmitarbeiter",
    description: "Core-Vorlagen-Set für operative Sicherheitskräfte (SMA).",
  },
  {
    id: "fuehrungskraft",
    label: "Führungskraft",
    description: "Core-Vorlagen-Set für Führung / Einsatzleitung.",
  },
  {
    id: "buerokraft",
    label: "Bürokraft (Verwaltung)",
    description: "Core-Vorlagen-Set für Verwaltung / Büro.",
  },
] as const;

const SET_KATEGORIE_BY_ID: Record<SetKategorie, SetKategorieDef> =
  Object.fromEntries(SET_KATEGORIE_DEFS.map((d) => [d.id, d])) as Record<
    SetKategorie,
    SetKategorieDef
  >;

export function setKategorieLabel(id: SetKategorie): string {
  return SET_KATEGORIE_BY_ID[id]?.label ?? id;
}

export function isKnownSetKategorie(id: string): id is SetKategorie {
  return id in SET_KATEGORIE_BY_ID;
}

/**
 * ⚠️ PLATZHALTER-MAPPING (geparkte Mark-Entscheidung): Set-Kategorie →
 * bevorzugte Rollen-Slug-Kandidaten (erster im Bucket vorhandener gewinnt).
 * Die Slugs decken die heutigen Demo-/Legacy-Rollen ab (siehe
 * `ROLE_KATEGORIE_DE` in `employee-display-labels.ts`). Sobald Mark die echten
 * Set-Ordner liefert, werden hier die realen Slugs eingetragen — kein
 * Logik-Umbau nötig.
 */
const DEFAULT_SET_ROLE_SLUGS: Record<SetKategorie, readonly string[]> = {
  // Operative Kraft (SMA)
  sicherheitsmitarbeiter: ["software-engineer", "security", "sma"],
  // Führung / Einsatzleitung
  fuehrungskraft: ["project-manager", "fuehrung", "einsatzleitung"],
  // Verwaltung / Büro
  buerokraft: ["hr-specialist", "verwaltung", "buero", "office"],
};

/**
 * Leitet die Core-Vorlagen-Rolle (S3-Rollen-Ordner) aus einer Set-Kategorie ab.
 * Tolerant: erster Slug-Kandidat, der als Rolle vorhanden ist; sonst Fallback
 * auf die erste verfügbare Rolle (verhindert EC-09-Bruch, falls der Bucket nur
 * „DIN 77200 Allgemeine" enthält). Gibt `undefined` zurück, wenn gar keine
 * Rollen geladen sind.
 */
export function resolveSetKategorieRoleId(
  setKategorie: SetKategorie | undefined,
  roles: readonly Role[],
): string | undefined {
  if (roles.length === 0) return undefined;
  if (setKategorie) {
    const candidates = DEFAULT_SET_ROLE_SLUGS[setKategorie] ?? [];
    for (const slug of candidates) {
      const hit = roles.find((r) => r.id === slug);
      if (hit) return hit.id;
    }
  }
  // Fallback: erste verfügbare Rolle (heute „DIN 77200 Allgemeine").
  return roles[0]?.id;
}

/**
 * Projiziert eine bestehende `roleId` (Persistenz-Träger) zurück auf die
 * Set-Kategorie. Gibt `undefined`, wenn die Rolle keiner Set-Kategorie
 * eindeutig zugeordnet ist.
 */
export function projectSetKategorieFromRoleId(
  roleId: string | undefined,
): SetKategorie | undefined {
  if (!roleId) return undefined;
  for (const def of SET_KATEGORIE_DEFS) {
    if (DEFAULT_SET_ROLE_SLUGS[def.id].includes(roleId)) return def.id;
  }
  return undefined;
}

/**
 * Lane J (A2) — `setKategorie` ist jetzt ein **echtes persistiertes Feld** an
 * der Akte (Schema `setKategorie String?`). Diese Funktion ist die
 * Read-Normalisierung / der Default-Resolver:
 *  1. persistiertes, gültiges Feld → Source of Truth (überschreibbar),
 *  2. sonst **Default aus der Rolle** ableiten (Legacy-Backfill aus `roleId`),
 *  3. sonst `undefined` (UI „— bitte wählen —").
 * **Rolle vs. Set-Kategorie entkoppelt:** ein gesetztes Feld gewinnt auch dann,
 * wenn es von der aus `roleId` abgeleiteten Default abweicht. Idempotent.
 */
export function resolveSetKategorie(employee: {
  setKategorie?: string;
  roleId?: string;
}): SetKategorie | undefined {
  if (employee.setKategorie && isKnownSetKategorie(employee.setKategorie)) {
    return employee.setKategorie;
  }
  return projectSetKategorieFromRoleId(employee.roleId);
}

// ════════════════════════════════════════════════════════════════════════════
// OVERLAYS — positionsunabhängig (knüpfen NICHT an die Set-Kategorie)
// ════════════════════════════════════════════════════════════════════════════

/**
 * Overlay-Typ. Positionsunabhängig = unabhängig von der Set-Kategorie wählbar.
 *  - `bestellung`: knüpft an `bestelltAls`/`appointmentIds` (Lane C) — die
 *    formalen Ernennungen (Ersthelfer/Brandschutzhelfer/SiBe). Doku-Quelle =
 *    bestehende Appointment-Dokumente (kein neuer Vorlagen-Slot nötig).
 *  - `fahrtaetigkeit`: Fahr-/UVV-Anweisung bei „fährt Dienstfahrzeug" — CL-73
 *    (`legal-input`, „fachlich prüfen", KEIN erfundener Wert).
 */
export type OverlayTyp = "bestellung" | "fahrtaetigkeit";

export interface OverlayDef {
  typ: OverlayTyp;
  label: string;
  /** Norm-Fundstelle (CL-xx) oder `null` (keine Norm-Pflicht). */
  clauseId: string | null;
  /** Kurzhinweis für die UI. */
  hint: string;
  /** `true` ⇒ nur als „fachlich prüfen" zulässig (legal-input). */
  fachlichPruefen?: boolean;
}

export const OVERLAY_DEFS: readonly OverlayDef[] = [
  {
    typ: "bestellung",
    label: "Bestellungen (Ernennung)",
    clauseId: null,
    hint: "Positionsunabhängig — knüpft an »bestellt als …« (Ersthelfer/Brandschutzhelfer/SiBe). Bestellung ≠ Schulung.",
  },
  {
    typ: "fahrtaetigkeit",
    label: "Fahrtätigkeit → Fahr-/UVV-Anweisung",
    clauseId: "CL-73",
    hint: "Bei »fährt Dienstfahrzeug«: Fahrer-/UVV-Unterweisung — fachlich prüfen (CL-73, legal-input, kein erfundener Wert).",
    fachlichPruefen: true,
  },
] as const;
