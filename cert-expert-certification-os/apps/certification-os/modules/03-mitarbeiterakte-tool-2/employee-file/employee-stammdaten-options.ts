/** Shared Stammdaten select options (Slice-1-Nachzug — capture only, no engine). */

export const ROLLE_STAMMDATEN_LABEL =
  "Rolle (Sicherheitsmitarbeiter / Führungskraft)";

/**
 * G4 — Norm-Klasse (primärer Engine-Input). DIN 77200 kennt EK (§3.10) vs.
 * FK (§3.11/§4.19.1); Verwaltung/Praktikant/Subunternehmer ergänzen die
 * Markt-Realität. Quelle der Klassifikation: requirement-engine `RoleClass`.
 */
export const ROLE_CLASS_LABEL = "Norm-Klasse (steuert das Pflicht-Set)";

export const ROLE_CLASS_OPTIONS = [
  { id: "ek", name: "Einsatzkraft (EK) — Bewachung" },
  { id: "fk", name: "Führungskraft (FK) — Bewachung + Führung" },
  { id: "verwaltung", name: "Verwaltung / Geschäftsführung — keine Bewachung" },
  { id: "praktikant", name: "Praktikant / Azubi" },
  { id: "subunternehmer", name: "Subunternehmer" },
] as const;

/**
 * G4 — Org-Titel (Anzeige/Org-Chart), je mit Default-Mapping auf die Norm-Klasse
 * (überschreibbar; die Norm-Klasse bleibt maßgeblich). Mark-Gate: Einsatzleitung
 * → FK (DIN 77200-1 §3.12/§4.2); Objekt-/Schichtleitung bleiben EK.
 */
export const ORG_TITLE_OPTIONS = [
  { id: "Sicherheitsmitarbeiter", name: "Sicherheitsmitarbeiter (SMA)", defaultClass: "ek" },
  { id: "Schichtleitung", name: "Schichtleitung", defaultClass: "ek" },
  { id: "Objektleitung", name: "Objektleitung", defaultClass: "ek" },
  { id: "Einsatzleitung", name: "Einsatzleitung", defaultClass: "fk" },
  { id: "Führungskraft", name: "Führungskraft", defaultClass: "fk" },
  { id: "Geschäftsführung", name: "Geschäftsführung", defaultClass: "verwaltung" },
  { id: "Bürokraft / Verwaltung", name: "Bürokraft / Verwaltung", defaultClass: "verwaltung" },
  { id: "Subunternehmer-SMA", name: "Subunternehmer-SMA", defaultClass: "subunternehmer" },
  { id: "Praktikant / Azubi", name: "Praktikant / Azubi", defaultClass: "praktikant" },
] as const;

/** Sentinel-Option für freien Org-Titel (Gate a: Dropdown + Freitext). */
export const ORG_TITLE_OTHER_ID = "__other__";

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

/** Slice 3 — Doppelrolle: zusätzliche Bewachungstätigkeit auf Niveau EK/FK.
 * Leer-Option (id "") erlaubt das Zurücksetzen auf „keine Doppelrolle". */
export const ZUSATZ_BEWACHUNG_OPTIONS = [
  { id: "", name: "— keine zusätzliche Bewachung" },
  { id: "ek", name: "Ja — als Einsatzkraft / SMA (EK)" },
  { id: "fk", name: "Ja — als Führungskraft (FK)" },
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
