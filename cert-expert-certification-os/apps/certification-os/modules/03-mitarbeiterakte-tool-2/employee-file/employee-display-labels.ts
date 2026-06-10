/** UI labels (DE) — template/API ids unchanged for EC-09 */

import type { BestellungTyp, Employee } from "@/lib/types/employee";

/**
 * BESTELLUNGEN (#C / Lane N P1) — die DREI formalen Ernennungs-Typen, sauber von
 * Schulungen/Unterweisungen getrennt (Begriffs-Modell, Feedback E). Jede
 * Bestellung ist **unterschriftspflichtig** (Unterschrifts-Logik). Jeder Typ ist
 * mit seiner Norm-Fundstelle (CL-xx) belegt; keine erfundene Pflicht.
 *
 * **Persistenz:** `bestelltAls Json?` ist die echte persistierte Quelle (Lane J).
 *
 * **Generator-Brücke (Lane N P1, 2026-06-10):** Die real eingespielten Vorlagen
 * liegen ALLE in EINEM S3-Ordner `appointments/bestellungen/` als drei separate
 * `.docx`-Dateien (Diagnose #1: die alten Einzel-Appointment-IDs
 * `safety-training`/`fire-safety`/`compliance-training` existierten NIE im
 * Bucket → es kam nie eine Bestellung an). Darum koppelt jeder Bestell-Typ jetzt
 * an
 *  - `appointmentFolderId` = `"bestellungen"` (der reale S3-/`/api/templates`-
 *    Ordner; für ALLE drei gleich), und
 *  - `docFileName` = die konkrete `.docx`-Vorlage in diesem Ordner.
 * Die `/api/templates`-Route vergibt je Datei die Doc-ID `${folderName}-${name}`
 * (siehe `bestellungDocId`) → so wird im Generator genau die richtige Datei
 * gewählt (`appointments/bestellungen/<docFileName>`), nicht der ganze Ordner.
 */
const BESTELLUNG_APPOINTMENT_FOLDER = "bestellungen";

export interface BestellungDef {
  typ: BestellungTyp;
  /** DE-Label für Dropdown/Anzeige. */
  label: string;
  /** Norm-Fundstelle (CL-xx) — Bestellung ist Ernennung, nicht Schulung. */
  clauseId: string;
  /**
   * Realer S3-/`/api/templates`-Ordner. Für ALLE drei Bestellungen identisch
   * (`bestellungen`) — die Unterscheidung läuft über `docFileName`.
   */
  appointmentFolderId: string;
  /** Reale `.docx`-Vorlage in `appointments/bestellungen/`. */
  docFileName: string;
  /** Kurzhinweis zum optionalen Schulungs-Bezug (Bestellung ≠ Schulung). */
  schulungHint: string;
}

export const BESTELLUNG_DEFS: readonly BestellungDef[] = [
  {
    typ: "ersthelfer",
    label: "Ersthelfer",
    clauseId: "CL-08",
    appointmentFolderId: BESTELLUNG_APPOINTMENT_FOLDER,
    docFileName: "Bestellungsurkunde_Ersthelfer.docx",
    schulungHint: "Bestellung ≠ Erste-Hilfe-Schulung (separater Nachweis, CL-08).",
  },
  {
    typ: "brandschutzhelfer",
    label: "Brandschutzhelfer",
    clauseId: "CL-23",
    appointmentFolderId: BESTELLUNG_APPOINTMENT_FOLDER,
    docFileName: "Bestellungsurkunde_Brandschutzhelfer.docx",
    schulungHint:
      "Bestellung ≠ Brandschutzhelfer-Schulung (separater Nachweis, CL-23).",
  },
  {
    typ: "sibe",
    label: "SiBe / Sicherheitsbeauftragter",
    clauseId: "CL-74",
    appointmentFolderId: BESTELLUNG_APPOINTMENT_FOLDER,
    docFileName: "Bestellungsurkunde_Sicherheitsbeauftragter.docx",
    schulungHint: "Betriebliche Bestellung (Beauftragung ≠ Schulung, CL-74).",
  },
] as const;

const BESTELLUNG_BY_TYP: Record<BestellungTyp, BestellungDef> =
  Object.fromEntries(BESTELLUNG_DEFS.map((d) => [d.typ, d])) as Record<
    BestellungTyp,
    BestellungDef
  >;

/**
 * Doc-ID einer Bestell-Vorlage, exakt wie `/api/templates` sie vergibt:
 * `${folderName}-${fileName ohne .docx}`. Wird in `selectedAppointmentDocIds`
 * eingetragen, damit der Generator genau diese eine Datei wählt.
 */
export function bestellungDocId(typ: BestellungTyp): string {
  const def = BESTELLUNG_BY_TYP[typ];
  return `${def.appointmentFolderId}-${def.docFileName.replace(/\.docx$/, "")}`;
}

/** Ist der Ordner der reale Bestellungen-Ordner? (für Filter/Trennung). */
export function isBestellungAppointmentId(appointmentId: string): boolean {
  return appointmentId === BESTELLUNG_APPOINTMENT_FOLDER;
}

export function bestellungLabelDe(typ: BestellungTyp): string {
  return BESTELLUNG_BY_TYP[typ].label;
}

export function bestellungClauseId(typ: BestellungTyp): string {
  return BESTELLUNG_BY_TYP[typ].clauseId;
}

const VALID_BESTELLUNG_TYPEN = new Set<BestellungTyp>(
  BESTELLUNG_DEFS.map((d) => d.typ),
);

/**
 * Lane J (A1) / Lane N P1 — `bestelltAls` ist ein **echtes persistiertes Feld** an
 * der Akte (Schema `bestelltAls Json?`), unabhängig vom Dokument. Diese Funktion
 * liefert die Anzeige-/Edit-Quelle: das persistierte Feld hat Vorrang; **fehlt
 * es** (Bestandsakte vor der Migration), wird **tolerant abgeleitet** — primär aus
 * den realen Bestell-Doc-Chips (`selectedAppointmentDocIds`, neuer
 * `bestellungen`-Ordner), sonst aus den alten `appointmentIds` (Legacy-Backfill,
 * vor-Migrations-Projektion). Reihenfolge = Katalog-Reihenfolge, dedupliziert.
 * KEIN Auto-Status (EC-10).
 */
export function getBestelltAls(employee: Employee): BestellungTyp[] {
  if (Array.isArray(employee.bestelltAls)) {
    // Persistiertes Feld vorhanden → Source of Truth. Defensive Validierung:
    // nur bekannte Typen, in Katalog-Reihenfolge, dedupliziert.
    const set = new Set(
      employee.bestelltAls.filter((t) => VALID_BESTELLUNG_TYPEN.has(t)),
    );
    return BESTELLUNG_DEFS.filter((d) => set.has(d.typ)).map((d) => d.typ);
  }
  return backfillBestelltAls(employee);
}

/**
 * Lane J (A1) / Lane N P1 — leitet aus einer Bestandsakte den Backfill-Wert für
 * die `bestelltAls`-Spalte ab: persistiertes Feld bevorzugt; sonst zuerst aus den
 * realen Bestell-Doc-Chips (`selectedAppointmentDocIds`, neuer `bestellungen`-
 * Ordner), dann aus den alten `appointmentIds` (vor-Migrations-Projektion).
 * Idempotent; für die Read-Normalisierung im Repository (Muster `asTrainingPlan`).
 */
export function backfillBestelltAls(employee: {
  bestelltAls?: unknown;
  appointmentIds?: string[];
  selectedAppointmentDocIds?: string[];
}): BestellungTyp[] {
  if (Array.isArray(employee.bestelltAls)) {
    const set = new Set(
      employee.bestelltAls.filter((t): t is BestellungTyp =>
        VALID_BESTELLUNG_TYPEN.has(t as BestellungTyp),
      ),
    );
    return BESTELLUNG_DEFS.filter((d) => set.has(d.typ)).map((d) => d.typ);
  }
  // Bevorzugt: reale Bestell-Doc-Chips (neuer `bestellungen`-Ordner).
  const docIds = new Set(employee.selectedAppointmentDocIds ?? []);
  const fromDocs = BESTELLUNG_DEFS.filter((d) =>
    docIds.has(bestellungDocId(d.typ)),
  ).map((d) => d.typ);
  if (fromDocs.length > 0) return fromDocs;
  return [];
}

/**
 * Lane N P1 — Patch für eine neue Bestell-Auswahl. Da alle drei Bestellungen in
 * EINEM realen S3-Ordner `bestellungen` liegen (drei Dateien), steuert die
 * Auswahl die konkreten **Doc-Chips** (`selectedAppointmentDocIds`), und der
 * Ordner `bestellungen` ist in `appointmentIds` genau dann gesetzt, wenn ≥1
 * Bestellung gewählt ist. Nicht-Bestell-Einträge bleiben unverändert. `bestelltAls`
 * ist die persistierte Source of Truth (Edit setzt das Feld direkt); dieser Patch
 * hält die Generator-Auswahl synchron, damit der ZIP genau die gewählten
 * Bestell-`.docx` erzeugt (EC-09). KEIN Auto-Status (EC-10).
 */
export function setBestelltAlsPatch(
  employee: Employee,
  typen: BestellungTyp[],
): { appointmentIds: string[]; selectedAppointmentDocIds: string[] } {
  const wanted = new Set(typen.filter((t) => VALID_BESTELLUNG_TYPEN.has(t)));

  // appointmentIds: Nicht-Bestell-Einträge behalten; `bestellungen`-Ordner nur,
  // wenn ≥1 Bestellung gewählt ist.
  const keptAppointments = (employee.appointmentIds ?? []).filter(
    (id) => !isBestellungAppointmentId(id),
  );
  const appointmentIds =
    wanted.size > 0
      ? [...keptAppointments, BESTELLUNG_APPOINTMENT_FOLDER]
      : keptAppointments;

  // selectedAppointmentDocIds: Bestell-Doc-Chips ersetzen; alle übrigen behalten.
  const bestellDocIds = new Set(BESTELLUNG_DEFS.map((d) => bestellungDocId(d.typ)));
  const keptDocs = (employee.selectedAppointmentDocIds ?? []).filter(
    (id) => !bestellDocIds.has(id),
  );
  const nextBestellDocs = BESTELLUNG_DEFS.filter((d) => wanted.has(d.typ)).map(
    (d) => bestellungDocId(d.typ),
  );

  return {
    appointmentIds,
    selectedAppointmentDocIds: [...keptDocs, ...nextBestellDocs],
  };
}

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
