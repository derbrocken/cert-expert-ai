import employeeSlots from "./data/tally-employee-slots.json";

/** Primary Slice-1 intake form — Mitarbeiterbezogene Unterlagen */
export const TALLY_EMPLOYEE_FORM_ID = "vGNvY0";

export const TALLY_GLOBAL_QUESTIONS = {
  companyName: "ZdDqda",
  companyEmail: "NAdGAW",
  employeeCount: "qbv0bd",
  /** Hidden field questionId when form uses ?company={slug} — set when field exists in Tally */
  companySlug: null as string | null,
} as const;

/**
 * P2 — Company-Tally „Unternehmensbezogene Unterlagen". questionIds via Tally
 * REST API verifiziert (2026-06-12, `GET /forms/Y5Zq80/questions`). P2-A nutzt
 * Name/E-Mail/Logo; die Firmen-Dokument-FILE_UPLOADs = P2-B (eigene Phase).
 */
export const TALLY_COMPANY_FORM_ID = "Y5Zq80";

export const TALLY_COMPANY_QUESTIONS = {
  companyName: "7dM2QA",
  companyEmail: "blvxao",
  logo: "J2MA7d", // „10. Logo des Unternehmens." (FILE_UPLOAD)
} as const;

export interface TallyFileQuestionConfig {
  questionId: string;
  /** Human label from the Tally form (empty for slots 3–10 in the REST export). */
  label: string;
  /**
   * Explicit target slot — overrides the label heuristic. The Tally upload
   * order is identical across all employee slots, so a position-derived
   * evidenceId is deterministic even when the label is empty (slots 3–10
   * previously collapsed every upload onto a single `tally-upload` id and
   * overwrote each other).
   *
   * Convention (Q3, Mark 2026-06-09 — JE SCHULUNG EIN EIGENER SLOT MIT EIGENEM
   * DATUM):
   *  - Dokument/Zertifikat (1 pro Person): fixe evidenceId
   *    (`arbeitsvertrag` CL-03-Beleg / `bundesauszug` / `dienstausweis` /
   *    `sachkunde` CL-01/02).
   *  - Schulung/Training: `training-plan:{trainingId}` — eigener Slot + eigenes
   *    Datum, identisch zur Queue-C-Konvention `planEvidenceId(itemId)`
   *    (`erste-hilfe` CL-08, `brandschutz` CL-23).
   * Reine Zuordnung — KEINE neue Normpflicht.
   */
  evidenceId?: string;
  /**
   * P4 (b, Mark D4) — optionale Tally-Frage-Id eines **Durchführungs-/
   * Zertifikatsdatums** zu DIESEM Schulungsnachweis (DATE-Feld im Tally-
   * Formular). Wird ausgelesen und als `plannedDate` des zugeordneten Plan-
   * Eintrags `training-plan:{id}` übernommen (`applyTrainingDateFromEvidence`).
   *
   * Nur für Schulungs-Slots sinnvoll (`evidenceId` = `training-plan:{id}`).
   * Fehlt die Id ODER kommt kein/ein leeres Datum mit → **kein erfundenes
   * Datum** (No-op). EC-10: der Nachweis bleibt separat `unchecked` (#7); das
   * Datum ist nur das Durchführungsdatum, KEINE Freigabe.
   *
   * Hinweis: Die echten Tally-Frage-Ids für die Datum-Felder trägt Mark im
   * Tally-Formular nach (DATE-Feld je Schulungsnachweis) und ergänzt sie hier
   * bzw. in `data/tally-employee-slots.json`. Bis dahin `undefined` = inaktiv.
   */
  dateQuestionId?: string;
}

export interface TallyEmployeeSlotConfig {
  index: number;
  nameQuestionId: string;
  roleTypeQuestionId: string | null;
  employmentTypeQuestionId: string | null;
  qualificationQuestionId: string | null;
  birthdayQuestionId: string | null;
  guardIdQuestionId: string | null;
  employeeIdQuestionId: string | null;
  fileQuestionIds: TallyFileQuestionConfig[];
}

export const TALLY_EMPLOYEE_SLOTS =
  employeeSlots as TallyEmployeeSlotConfig[];

/**
 * Tally-Upload-Reihenfolge je Mitarbeiter-Slot (positionsgleich über alle
 * Slots). Quelle für die positionsbasierte evidenceId, wenn das Label leer ist.
 * Index = Reihenfolge in `fileQuestionIds`. Positionen jenseits dieser Liste
 * (z. B. die „Erforderliche Dokumente"-Extras in Slot 10) → generischer
 * Sammel-Slot `tally-weitere-nachweise` (positionsstabil pro Person).
 */
export const TALLY_FILE_POSITION_EVIDENCE_IDS: readonly string[] = [
  "arbeitsvertrag", // 0 — Contracts (Arbeitsvertrag / Beschäftigungsnachweis)
  "bundesauszug", // 1 — BWR (Bewacherregister-Auszug)
  "dienstausweis", // 2 — Dienstausweis / GuardCard
  "sachkunde", // 3 — Qualifikation §34a / Sachkunde (CL-01/02)
  "training-plan:erste-hilfe", // 4 — Ersthelfer / First Aid (Schulung, CL-08)
  "training-plan:brandschutz", // 5 — Brandschutz (Schulung, CL-23)
  "tally-weitere-nachweise", // 6 — weitere/sonstige Nachweise (unbeschriftet)
];

/** Sammel-Slot für Upload-Positionen ohne dedizierte Zuordnung. */
export const TALLY_FALLBACK_EVIDENCE_ID = "tally-weitere-nachweise";

/**
 * evidenceId einer Datei-Frage auflösen — Reihenfolge der Quellen:
 *  1. explizite `evidenceId` aus der Slot-Konfiguration (höchste Priorität),
 *  2. positionsbasierte Tabelle (deterministisch, label-unabhängig),
 *  3. Label-Heuristik (`mapTallyUploadToEvidenceId`) als Rückfall.
 * EC-10: Status des erzeugten EvidenceItem bleibt `unchecked` (im Service).
 */
export function resolveTallyFileEvidenceId(
  fileField: TallyFileQuestionConfig,
  position: number,
): string {
  if (fileField.evidenceId?.trim()) return fileField.evidenceId.trim();
  const byPosition = TALLY_FILE_POSITION_EVIDENCE_IDS[position];
  if (byPosition) return byPosition;
  if (fileField.label?.trim()) return mapTallyUploadToEvidenceId(fileField.label);
  return TALLY_FALLBACK_EVIDENCE_ID;
}

/**
 * Map Tally upload label → EvidenceItem.evidenceId (EC-10: status stays
 * unchecked). Label-Rückfall, wenn weder explizite noch positionsbasierte
 * evidenceId greift. Schulungen folgen der Q3-Konvention `training-plan:{id}`.
 */
export function mapTallyUploadToEvidenceId(label: string): string {
  const normalized = label.toLowerCase();
  if (normalized.includes("contract")) return "arbeitsvertrag";
  if (normalized.includes("bwr")) return "bundesauszug";
  if (normalized.includes("guardcard") || normalized.includes("dienstausweis")) {
    return "dienstausweis";
  }
  if (normalized.includes("§34a") || normalized.includes("sachkunde")) {
    return "sachkunde";
  }
  if (normalized.includes("ersthelfer") || normalized.includes("first aid")) {
    return "training-plan:erste-hilfe";
  }
  if (normalized.includes("brandschutz")) return "training-plan:brandschutz";
  return `tally-${normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "upload"}`;
}

/** Tally webhook keys: `question_{id}` or `question_{id}_{uuid}` */
export function questionIdFromFieldKey(key: string): string | null {
  const withUuid = key.match(/^question_([^_]+)_[^_]/);
  if (withUuid?.[1]) return withUuid[1];
  const short = key.match(/^question_([^_]+)$/);
  return short?.[1] ?? null;
}
