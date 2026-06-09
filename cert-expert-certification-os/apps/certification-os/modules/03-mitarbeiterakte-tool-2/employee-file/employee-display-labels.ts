/** UI labels (DE) — template/API ids unchanged for EC-09 */

import type { BestellungTyp, Employee } from "@/lib/types/employee";

/**
 * BESTELLUNGEN (#C) — die DREI formalen Ernennungs-Typen, sauber von Schulungen/
 * Unterweisungen getrennt (Begriffs-Modell, Feedback E). Jede Bestellung ist
 * **unterschriftspflichtig** (Unterschrifts-Logik). Jeder Typ ist mit seiner
 * Norm-Fundstelle (CL-xx) belegt; keine erfundene Pflicht.
 *
 * **Persistenz-Brücke:** `appointmentId` koppelt den Bestell-Typ an den bereits
 * persistierten `appointmentIds`-Eintrag (Source of Truth, kein neuer DB-Spalt).
 */
export interface BestellungDef {
  typ: BestellungTyp;
  /** DE-Label für Dropdown/Anzeige. */
  label: string;
  /** Norm-Fundstelle (CL-xx) — Bestellung ist Ernennung, nicht Schulung. */
  clauseId: string;
  /** Persistierter `appointmentIds`-Schlüssel (Brücke zur DB). */
  appointmentId: string;
  /** Kurzhinweis zum optionalen Schulungs-Bezug (Bestellung ≠ Schulung). */
  schulungHint: string;
}

export const BESTELLUNG_DEFS: readonly BestellungDef[] = [
  {
    typ: "ersthelfer",
    label: "Ersthelfer",
    clauseId: "CL-08",
    appointmentId: "safety-training",
    schulungHint: "Bestellung ≠ Erste-Hilfe-Schulung (separater Nachweis, CL-08).",
  },
  {
    typ: "brandschutzhelfer",
    label: "Brandschutzhelfer",
    clauseId: "CL-23",
    appointmentId: "fire-safety",
    schulungHint:
      "Bestellung ≠ Brandschutzhelfer-Schulung (separater Nachweis, CL-23).",
  },
  {
    typ: "sibe",
    label: "SiBe / Sicherheitsbeauftragter",
    clauseId: "CL-74",
    appointmentId: "compliance-training",
    schulungHint: "Betriebliche Bestellung (Beauftragung ≠ Schulung, CL-74).",
  },
] as const;

const BESTELLUNG_BY_TYP: Record<BestellungTyp, BestellungDef> =
  Object.fromEntries(BESTELLUNG_DEFS.map((d) => [d.typ, d])) as Record<
    BestellungTyp,
    BestellungDef
  >;

const BESTELLUNG_BY_APPOINTMENT: Record<string, BestellungDef> =
  Object.fromEntries(BESTELLUNG_DEFS.map((d) => [d.appointmentId, d]));

/** Ist die appointmentId eine der drei Bestellungen? (für Filter/Trennung). */
export function isBestellungAppointmentId(appointmentId: string): boolean {
  return appointmentId in BESTELLUNG_BY_APPOINTMENT;
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
 * Lane J (A1) — `bestelltAls` ist jetzt ein **echtes persistiertes Feld** an der
 * Akte (Schema `bestelltAls Json?`), unabhängig vom Dokument. Diese Funktion
 * liefert die Anzeige-/Edit-Quelle: das persistierte Feld hat Vorrang; **fehlt
 * es** (Bestandsakte vor der Migration), wird **tolerant aus `appointmentIds`
 * abgeleitet** (Legacy-Backfill, alte Projektion). Reihenfolge =
 * Katalog-Reihenfolge, dedupliziert. KEIN Auto-Status (EC-10).
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
  // Legacy-Backfill: kein persistiertes Feld → aus `appointmentIds` ableiten.
  const ids = new Set(employee.appointmentIds ?? []);
  return BESTELLUNG_DEFS.filter((d) => ids.has(d.appointmentId)).map(
    (d) => d.typ,
  );
}

/**
 * Lane J (A1) — leitet aus einer Bestandsakte den Backfill-Wert für die neue
 * `bestelltAls`-Spalte ab: persistiertes Feld bevorzugt, sonst aus
 * `appointmentIds` (alte Projektion). Idempotent; für die Read-Normalisierung
 * im Repository (Muster `asTrainingPlan`).
 */
export function backfillBestelltAls(employee: {
  bestelltAls?: unknown;
  appointmentIds?: string[];
}): BestellungTyp[] {
  if (Array.isArray(employee.bestelltAls)) {
    const set = new Set(
      employee.bestelltAls.filter((t): t is BestellungTyp =>
        VALID_BESTELLUNG_TYPEN.has(t as BestellungTyp),
      ),
    );
    return BESTELLUNG_DEFS.filter((d) => set.has(d.typ)).map((d) => d.typ);
  }
  const ids = new Set(employee.appointmentIds ?? []);
  return BESTELLUNG_DEFS.filter((d) => ids.has(d.appointmentId)).map(
    (d) => d.typ,
  );
}

/**
 * Baut den `appointmentIds`-Patch für eine neue Bestell-Auswahl: alle
 * Nicht-Bestell-appointmentIds bleiben unverändert, die drei Bestell-Typen
 * werden exakt auf `typen` gesetzt. **Lane J:** `bestelltAls` ist die echte
 * persistierte Quelle (Edit setzt das Feld direkt) — `appointmentIds` werden
 * über diesen Patch **weiterhin synchron gehalten**, damit der Generator die
 * Bestell-Dokumente unverändert erzeugt (EC-09; Dokument-Auswahl bleibt am
 * `appointmentIds`-Pfad).
 */
export function setBestelltAlsPatch(
  employee: Employee,
  typen: BestellungTyp[],
): string[] {
  const wanted = new Set(typen.map((t) => BESTELLUNG_BY_TYP[t].appointmentId));
  const kept = (employee.appointmentIds ?? []).filter(
    (id) => !isBestellungAppointmentId(id),
  );
  const bestell = BESTELLUNG_DEFS.filter((d) => wanted.has(d.appointmentId)).map(
    (d) => d.appointmentId,
  );
  return [...kept, ...bestell];
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
