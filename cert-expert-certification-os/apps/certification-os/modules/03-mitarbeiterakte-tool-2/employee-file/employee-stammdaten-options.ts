/** Shared Stammdaten select options (Slice-1-Nachzug — capture only, no engine). */

export const ROLLE_STAMMDATEN_LABEL =
  "Rolle (Sicherheitsmitarbeiter / Führungskraft)";

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

export const BESCHAEFTIGUNGSART_OPTIONS = [
  { id: "Vollzeit", name: "Vollzeit" },
  { id: "Teilzeit", name: "Teilzeit" },
  { id: "Minijob", name: "Minijob" },
  { id: "Subunternehmer", name: "Subunternehmer" },
  { id: "Praktikum / Ausbildung", name: "Praktikum / Ausbildung" },
  { id: "Freelance / Honorar", name: "Freelance / Honorar" },
] as const;
