/** Shared Stammdaten select options (Slice-1-Nachzug — capture only, no engine). */

export const ROLLE_STAMMDATEN_LABEL =
  "Rolle (Sicherheitsmitarbeiter / Führungskraft)";

/**
 * EK/FK-Refinement — Norm-Klasse als Mehrfachauswahl. Bewachung: EK + FK frei
 * kombinierbar (FK baut auf EK auf; EK+FK = FK-Pflichtset). Nicht-Bewachung:
 * untereinander exklusiv, aber mit EK/FK kombinierbar (Doppelrolle-Fall).
 */
export const ROLE_CLASS_LABEL_MULTI = "Norm-Klasse (steuert das Pflicht-Set — Mehrfachauswahl)";

export const BEWACHUNG_CLASS_OPTIONS = [
  { id: "ek", name: "Einsatzkraft (EK)", hint: "Bewachung (§3.10)" },
  { id: "fk", name: "Führungskraft (FK)", hint: "Bewachung + Führung (§3.11/§4.19.1)" },
] as const;

export const NICHT_BEWACHUNG_CLASS_OPTIONS = [
  { id: "verwaltung", name: "Verwaltung / Geschäftsführung", hint: "keine Bewachung (§4.1 b)" },
  { id: "praktikant", name: "Praktikant / Azubi", hint: "reduziertes Set" },
  { id: "subunternehmer", name: "Subunternehmer", hint: "Bewachung + fachlich prüfen (§4.13)" },
] as const;

/**
 * G4 — Org-Titel (Anzeige/Org-Chart), je mit Default-Mapping auf die Norm-Klasse
 * (überschreibbar; die Norm-Klasse bleibt maßgeblich).
 *
 * **Batch-2 #7 (Mark, C-10-Gate 2026-06-09):** Schichtleitung + Objektleitung
 * sind **ausschließlich Unter-Titel der Führungskraft** → nur sichtbar/wählbar,
 * wenn die Norm-Klasse `fk` gewählt ist (`requiresFk: true`). UI-Gating, KEINE
 * Engine-Änderung (die Norm-Klasse `roleClasses` bleibt maßgeblich; der Org-Titel
 * ist reine Anzeige). Default-Klasse dieser FK-Unter-Titel = `fk`.
 */
export const ORG_TITLE_OPTIONS = [
  { id: "Sicherheitsmitarbeiter", name: "Sicherheitsmitarbeiter (SMA)", defaultClass: "ek" },
  { id: "Einsatzleitung", name: "Einsatzleitung", defaultClass: "fk" },
  { id: "Führungskraft", name: "Führungskraft", defaultClass: "fk" },
  // Batch-2 #7 — FK-Unter-Titel: nur bei gewählter Norm-Klasse `fk` wählbar.
  { id: "Schichtleitung", name: "Schichtleitung", defaultClass: "fk", requiresFk: true },
  { id: "Objektleitung", name: "Objektleitung", defaultClass: "fk", requiresFk: true },
  { id: "Geschäftsführung", name: "Geschäftsführung", defaultClass: "verwaltung" },
  { id: "Bürokraft / Verwaltung", name: "Bürokraft / Verwaltung", defaultClass: "verwaltung" },
  { id: "Subunternehmer-SMA", name: "Subunternehmer-SMA", defaultClass: "subunternehmer" },
  { id: "Praktikant / Azubi", name: "Praktikant / Azubi", defaultClass: "praktikant" },
] as const;

/** Sentinel-Option für freien Org-Titel (Gate a: Dropdown + Freitext). */
export const ORG_TITLE_OTHER_ID = "__other__";

/**
 * Batch-2 #7 — Org-Titel, die NUR bei gewählter Norm-Klasse `fk` sichtbar/
 * wählbar sind (Schichtleitung/Objektleitung = FK-Unter-Titel). Reine
 * Anzeige-Gatung, keine Engine-Wirkung.
 */
export const FK_ONLY_ORG_TITLE_IDS: readonly string[] = ORG_TITLE_OPTIONS.filter(
  (o) => "requiresFk" in o && o.requiresFk,
).map((o) => o.id);

/**
 * Batch-2 #7 — sichtbare Org-Titel je gewählter Norm-Klassen-Auswahl: FK-Unter-
 * Titel (Schichtleitung/Objektleitung) erscheinen nur, wenn `fk` enthalten ist.
 * Alle übrigen Titel bleiben immer wählbar.
 */
export function visibleOrgTitleOptions(
  roleClasses: readonly string[] | undefined,
): typeof ORG_TITLE_OPTIONS[number][] {
  const hasFk = (roleClasses ?? []).includes("fk");
  return ORG_TITLE_OPTIONS.filter(
    (o) => !("requiresFk" in o && o.requiresFk) || hasFk,
  );
}

/**
 * Batch-2 #7 — `true`, wenn ein Org-Titel angesichts der gewählten Norm-Klassen
 * NICHT (mehr) zulässig ist (FK-Unter-Titel ohne `fk`). Für UI-Reset, wenn `fk`
 * abgewählt wird.
 */
export function isOrgTitleGatedOut(
  orgTitleId: string | undefined,
  roleClasses: readonly string[] | undefined,
): boolean {
  if (!orgTitleId) return false;
  if (!FK_ONLY_ORG_TITLE_IDS.includes(orgTitleId)) return false;
  return !(roleClasses ?? []).includes("fk");
}

export const ROLLE_TYPE_OPTIONS = [
  { id: "Sicherheitsmitarbeiter", name: "Sicherheitsmitarbeiter (SMA)" },
  { id: "Führungskraft", name: "Führungskraft" },
  { id: "Bürokraft / Verwaltung", name: "Bürokraft / Verwaltung" },
  { id: "Geschäftsführung", name: "Geschäftsführung" },
  { id: "Einsatzleitung", name: "Einsatzleitung" },
  { id: "Objektleitung", name: "Objektleitung" },
  { id: "Schichtleitung", name: "Schichtleitung" },
  { id: "Subunternehmer-SMA", name: "Subunternehmer-SMA" },
  { id: "Praktikant / Azubi", name: "Praktikant / Azubi" },
] as const;

/**
 * Lane K — Geschlecht (minimale, optionale PII). Einziger Zweck: das
 * Mutterschutz-Hinweis-Overlay (CL-77, MuSchG, „fachlich prüfen") für
 * **weibliche** MA auslösen. Leer = nicht erfasst (kein Overlay). Keine
 * Engine-/Auto-Status-Wirkung (EC-10).
 */
export const GESCHLECHT_OPTIONS = [
  { id: "weiblich", name: "weiblich" },
  { id: "maennlich", name: "männlich" },
  { id: "divers", name: "divers" },
] as const;

export const BESCHAEFTIGUNGSART_OPTIONS = [
  { id: "Vollzeit", name: "Vollzeit" },
  { id: "Teilzeit", name: "Teilzeit" },
  { id: "Minijob", name: "Minijob" },
  { id: "Subunternehmer", name: "Subunternehmer" },
  { id: "Praktikum / Ausbildung", name: "Praktikum / Ausbildung" },
  { id: "Freelance / Honorar", name: "Freelance / Honorar" },
] as const;

/** SDL / Geltungsbereich (Slice 2 — Engine-Eingang). Quelle: requirement-engine SDL_SCOPE_CATALOG. */
export { SDL_SCOPE_CATALOG, sdlScopeLabel } from "./requirement-engine";
export type { SdlScopeId, SdlScopeOption } from "./requirement-engine";

/** "fährt Dienstfahrzeug?" — Tri-State über Select (unbekannt = leer). */
export const DIENSTFAHRZEUG_OPTIONS = [
  { id: "ja", name: "Ja — fährt Dienstfahrzeug" },
  { id: "nein", name: "Nein" },
] as const;
