/** UI labels (DE) — template/API ids unchanged for EC-09 */

export const GRUNDROLLE_HINT =
  "Eine Grundrolle pro Person — operative Kraft (z. B. SMA) oder Führung (z. B. Einsatzleitung). Nicht beides als Grundrolle.";

export const BESTELLUNGEN_HINT =
  "Bestellungen ergänzen die Grundrolle (z. B. Ersthelfer, Brandschutzhelfer) — steuern Nachweise und Unterweisungen. Ersetzen die Grundrolle nicht.";

/** @deprecated Use BESTELLUNGEN_HINT */
export const ZUSATZBESTELLUNGEN_HINT = BESTELLUNGEN_HINT;

export type GrundrolleKategorie =
  | "operative"
  | "fuehrung"
  | "verwaltung"
  | "sonstige";

export const KATEGORIE_LABEL_DE: Record<GrundrolleKategorie, string> = {
  operative: "Operative Kraft",
  fuehrung: "Führung",
  verwaltung: "Verwaltung",
  sonstige: "Sonstige",
};

export const ROLE_KATEGORIE_DE: Record<string, GrundrolleKategorie> = {
  "software-engineer": "operative",
  "project-manager": "fuehrung",
  "hr-specialist": "verwaltung",
  "data-analyst": "sonstige",
};

const KATEGORIE_SORT: Record<GrundrolleKategorie, number> = {
  fuehrung: 0,
  operative: 1,
  verwaltung: 2,
  sonstige: 3,
};

export const APPOINTMENT_LABELS_DE: Record<string, string> = {
  "safety-training": "Ersthelfer",
  onboarding: "Einarbeitung",
  "medical-checkup": "Arbeitsmedizinische Untersuchung",
  "fire-safety": "Brandschutzhelfer",
  "compliance-training": "SiBe / Sicherheitsbeauftragter",
  "ergonomics-assessment": "Ergonomie",
};

/** Bestellungen dropdown: Ersthelfer, Brandschutz, SiBe zuerst */
const BESTELLUNG_SORT_PRIORITY: Record<string, number> = {
  "safety-training": 0,
  "fire-safety": 1,
  "compliance-training": 2,
  onboarding: 10,
  "medical-checkup": 11,
  "ergonomics-assessment": 12,
};

export function appointmentLabelDe(id: string, fallbackName: string): string {
  return APPOINTMENT_LABELS_DE[id] ?? fallbackName;
}

export const ROLE_LABELS_DE: Record<string, string> = {
  "software-engineer": "Sicherheitsmitarbeiter (SMA)",
  "project-manager": "Führungskraft / Einsatzleitung",
  "hr-specialist": "Verwaltung / Personal",
  "data-analyst": "Spezialfunktion",
};

export function roleLabelDe(id: string, fallbackName: string): string {
  return ROLE_LABELS_DE[id] ?? fallbackName;
}

export function roleSelectLabel(id: string, fallbackName: string): string {
  const label = roleLabelDe(id, fallbackName);
  const kat = ROLE_KATEGORIE_DE[id];
  if (!kat) return label;
  return `${KATEGORIE_LABEL_DE[kat]} — ${label}`;
}

export function roleSelectDescription(id: string): string | undefined {
  const kat = ROLE_KATEGORIE_DE[id];
  if (kat === "operative") return "Operative Tätigkeit im Einsatz";
  if (kat === "fuehrung") return "Leitung / Einsatzführung";
  if (kat === "verwaltung") return "Verwaltung, keine operative Kraft";
  return undefined;
}

export function sortRolesForSelect<T extends { id: string }>(roles: T[]): T[] {
  return [...roles].sort((a, b) => {
    const ka = ROLE_KATEGORIE_DE[a.id] ?? "sonstige";
    const kb = ROLE_KATEGORIE_DE[b.id] ?? "sonstige";
    return KATEGORIE_SORT[ka] - KATEGORIE_SORT[kb];
  });
}

export function sortAppointmentsForSelect<T extends { id: string }>(
  appointments: T[],
): T[] {
  return [...appointments].sort((a, b) => {
    const pa = BESTELLUNG_SORT_PRIORITY[a.id] ?? 50;
    const pb = BESTELLUNG_SORT_PRIORITY[b.id] ?? 50;
    if (pa !== pb) return pa - pb;
    return appointmentLabelDe(a.id, a.id).localeCompare(
      appointmentLabelDe(b.id, b.id),
    );
  });
}
