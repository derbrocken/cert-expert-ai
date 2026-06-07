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

export interface TallyEmployeeSlotConfig {
  index: number;
  nameQuestionId: string;
  roleTypeQuestionId: string | null;
  employmentTypeQuestionId: string | null;
  qualificationQuestionId: string | null;
  birthdayQuestionId: string | null;
  guardIdQuestionId: string | null;
  employeeIdQuestionId: string | null;
  fileQuestionIds: { questionId: string; label: string }[];
}

export const TALLY_EMPLOYEE_SLOTS =
  employeeSlots as TallyEmployeeSlotConfig[];

/** Map Tally upload label → EvidenceItem.evidenceId (EC-10: status stays unchecked) */
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
    return "erste-hilfe";
  }
  if (normalized.includes("brandschutz")) return "brandschutz";
  return `tally-${normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "upload"}`;
}

/** Tally webhook keys: `question_{id}` or `question_{id}_{uuid}` */
export function questionIdFromFieldKey(key: string): string | null {
  const withUuid = key.match(/^question_([^_]+)_[^_]/);
  if (withUuid?.[1]) return withUuid[1];
  const short = key.match(/^question_([^_]+)$/);
  return short?.[1] ?? null;
}
