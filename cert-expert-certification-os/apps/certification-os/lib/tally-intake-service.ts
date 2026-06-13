import {
  LEGACY_IMPORT_SLUG,
  resolveCompanySlug,
} from "@/lib/customer-registry";
import {
  questionIdFromFieldKey,
  resolveTallyFileEvidenceId,
  TALLY_EMPLOYEE_FORM_ID,
  TALLY_EMPLOYEE_SLOTS,
  TALLY_GLOBAL_QUESTIONS,
  TALLY_COMPANY_FORM_ID,
  TALLY_COMPANY_QUESTIONS,
  type TallyEmployeeSlotConfig,
} from "@/lib/tally-intake-config";
import {
  ensureCompaniesSeeded,
  saveCompanyDocumentFile,
  saveEmployeeEvidenceFile,
} from "@/lib/employee-file-repository";
import { buildCompanyLogoKey, putCeaObject } from "@/lib/cea-blob-storage";
import {
  parseCompanyIntake,
  parseCompanyDocuments,
  logoMime,
} from "@/lib/tally-company-intake";
import { COMPANY_DOCUMENT_CATALOG } from "@/lib/company-documents-catalog";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { TrainingPlanItem } from "@/lib/types/employee";
import { applyTrainingDateFromEvidence } from "@/modules/03-mitarbeiterakte-tool-2/employee-file/training-plan";

const LOG = "[tally-intake]";

interface TallyFieldOption {
  id: string;
  text: string;
}

export interface TallyWebhookField {
  key: string;
  label: string;
  type: string;
  value: unknown;
  options?: TallyFieldOption[];
}

export interface TallyWebhookPayload {
  eventType?: string;
  data?: {
    responseId?: string;
    submissionId?: string;
    formId?: string;
    formName?: string;
    fields?: TallyWebhookField[];
  };
}

export interface TallyIntakeResult {
  skipped: boolean;
  responseId: string;
  companySlug: string;
  employeeIds: string[];
  evidenceImported: number;
  reason?: string;
}

interface TallyUploadedFile {
  id?: string;
  name?: string;
  url?: string;
  mimeType?: string;
}

function asString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return asString(value[0]);
  return "";
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asString(item)).filter(Boolean);
}

/** Resolve Tally DROPDOWN/MULTI_SELECT option UUIDs to human-readable labels. */
function resolveTallyDropdownText(field: TallyWebhookField | undefined): string {
  if (!field) return "";
  const raw = field.value;
  const optionIds = Array.isArray(raw)
    ? raw.map((item) => asString(item)).filter(Boolean)
    : asString(raw)
      ? [asString(raw)]
      : [];
  const options = field.options ?? [];
  if (optionIds.length > 0 && options.length > 0) {
    const labels = optionIds
      .map((id) => options.find((opt) => opt.id === id)?.text?.trim())
      .filter((text): text is string => Boolean(text));
    if (labels.length > 0) return labels.join(", ");
  }
  return asString(raw);
}

function buildFieldMap(fields: TallyWebhookField[]): Map<string, TallyWebhookField> {
  const map = new Map<string, TallyWebhookField>();
  for (const field of fields) {
    const questionId = questionIdFromFieldKey(field.key);
    if (questionId) {
      map.set(questionId, field);
    }
  }
  return map;
}

function extractCompanySlugHint(
  fieldMap: Map<string, TallyWebhookField>,
): string {
  const configuredId = TALLY_GLOBAL_QUESTIONS.companySlug;
  if (configuredId) {
    const configured = asString(fieldMap.get(configuredId)?.value);
    if (configured) return configured;
  }
  for (const field of fieldMap.values()) {
    const keyLower = field.key.toLowerCase();
    const labelLower = (field.label || "").toLowerCase();
    if (
      keyLower.includes("company_slug") ||
      keyLower.includes("cea_slug") ||
      keyLower.includes("cea_company") ||
      labelLower.includes("company slug") ||
      labelLower.includes("kunden-slug") ||
      labelLower.includes("cea_company")
    ) {
      const value = asString(field.value);
      if (value) return value;
    }
  }
  return "";
}

function parseEmployeeCount(raw: string): number {
  const match = raw.match(/\d+/);
  if (!match) return 1;
  const count = Number.parseInt(match[0], 10);
  return Number.isFinite(count) ? Math.min(Math.max(count, 1), 10) : 1;
}

function normalizeDate(raw: string): string {
  if (!raw) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  return raw;
}

function isUploadedFile(value: unknown): value is TallyUploadedFile {
  return (
    typeof value === "object" &&
    value !== null &&
    "url" in value &&
    typeof (value as TallyUploadedFile).url === "string"
  );
}

function extractUploadedFiles(value: unknown): TallyUploadedFile[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter(isUploadedFile);
  }
  if (isUploadedFile(value)) return [value];
  return [];
}

async function downloadTallyFile(url: string): Promise<Buffer> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Tally file download failed: HTTP ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * P2-A — Company-Tally-Intake (`Y5Zq80`): Firma auflösen → zentrales
 * `CompanyExportSettings` upserten (Name/E-Mail) + Logo nach S3 laden. Tolerant:
 * fehlt Logo/Feld → kein Bruch. EC-10: reine Stammdaten, kein Freigabe-Status.
 * Firmen-Dokumente (FILE_UPLOADs) = P2-B (eigene Phase), hier NICHT verarbeitet.
 */
async function processCompanyIntake(
  responseId: string,
  formId: string,
  fields: TallyWebhookField[],
): Promise<TallyIntakeResult> {
  await ensureCompaniesSeeded();
  const fieldMap = buildFieldMap(fields);
  const intakeFields = fields.map((f) => ({
    questionId: questionIdFromFieldKey(f.key) ?? "",
    type: f.type,
    label: f.label ?? "",
    value: f.value,
  }));
  const parsed = parseCompanyIntake(intakeFields, TALLY_COMPANY_QUESTIONS);
  const slugHint = extractCompanySlugHint(fieldMap);
  const companySlug = resolveCompanySlug({
    slugHint,
    companyName: parsed.companyName,
  });

  let logoStorageKey: string | undefined;
  if (parsed.logo) {
    try {
      const buffer = await downloadTallyFile(parsed.logo.url);
      const key = buildCompanyLogoKey(companySlug, parsed.logo.ext);
      await putCeaObject(key, buffer, logoMime(parsed.logo.ext));
      logoStorageKey = key;
    } catch (err) {
      console.error(`${LOG} Company logo download/store failed`, err);
      // tolerant — Profil wird trotzdem aktualisiert (ohne Logo).
    }
  }

  await prisma.companyExportSettings.upsert({
    where: { companySlug },
    create: {
      companySlug,
      companyName: parsed.companyName || companySlug,
      companyEmail: parsed.companyEmail,
      ...(logoStorageKey ? { logoStorageKey } : {}),
    },
    update: {
      ...(parsed.companyName ? { companyName: parsed.companyName } : {}),
      ...(parsed.companyEmail ? { companyEmail: parsed.companyEmail } : {}),
      ...(logoStorageKey ? { logoStorageKey } : {}),
    },
  });

  // P2-B — Firmen-Dokumente (FILE_UPLOADs) → company-ebenes Dok-Lager (S3 + DB).
  // Läuft NACH dem Settings-Upsert (Company-Row sicher vorhanden → FK ok).
  // Tolerant: schlägt ein Download/Upload fehl, werden die übrigen weiter
  // verarbeitet. EC-10: jedes Dokument landet als `unchecked` im Lager.
  let documentsImported = 0;
  const documents = parseCompanyDocuments(intakeFields, COMPANY_DOCUMENT_CATALOG);
  for (const doc of documents) {
    try {
      const buffer = await downloadTallyFile(doc.url);
      await saveCompanyDocumentFile(
        companySlug,
        doc.documentId,
        doc.fileName,
        doc.mimeType,
        buffer,
      );
      documentsImported += 1;
    } catch (err) {
      console.error(`${LOG} Company document download/store failed`, {
        documentId: doc.documentId,
        err,
      });
    }
  }

  // upsert statt create: Tally stellt FORM_RESPONSE teils doppelt zu → die
  // Top-Dedup greift bei der Near-Simultan-Zustellung evtl. nicht (Race);
  // idempotenter Upsert verhindert die Unique-Constraint-Verletzung.
  await prisma.tallyIntakeRecord.upsert({
    where: { responseId },
    create: { responseId, formId, companySlug, employeeIds: [] },
    update: {},
  });

  console.info(`${LOG} Company intake processed`, {
    companySlug,
    logo: Boolean(logoStorageKey),
    documents: documentsImported,
  });

  return {
    skipped: false,
    responseId,
    companySlug,
    employeeIds: [],
    evidenceImported: (logoStorageKey ? 1 : 0) + documentsImported,
    reason: "company-intake",
  };
}

function guessMimeType(fileName: string, declared?: string): string {
  if (declared?.trim()) return declared;
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

/**
 * P4 (b, Mark D4) — Durchführungs-/Zertifikatsdaten je Schulungsnachweis aus der
 * Tally-Submission einsammeln. Liefert eine Map `evidenceId → ISO-Datum` nur für
 * Schulungs-Slots (`training-plan:{id}`) mit konfiguriertem `dateQuestionId` UND
 * mitgeliefertem, validem Datum. **Kein erfundenes Datum:** fehlt `dateQuestionId`
 * oder kommt kein/ein leeres/ungültiges Datum → der Slot wird NICHT aufgenommen.
 */
function collectTrainingDates(
  slot: TallyEmployeeSlotConfig,
  fieldMap: Map<string, TallyWebhookField>,
): Map<string, string> {
  const out = new Map<string, string>();
  for (let position = 0; position < slot.fileQuestionIds.length; position += 1) {
    const fileField = slot.fileQuestionIds[position];
    if (!fileField.dateQuestionId) continue;
    const evidenceId = resolveTallyFileEvidenceId(fileField, position);
    if (!evidenceId.startsWith("training-plan:")) continue;
    const date = normalizeDate(
      asString(fieldMap.get(fileField.dateQuestionId)?.value),
    );
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue; // kein erfundenes Datum
    out.set(evidenceId, date);
  }
  return out;
}

/** Tolerant: persistiertes `trainingPlan`-Json → Array (Müll/null → []). */
function asTrainingPlanArray(value: Prisma.JsonValue | null): TrainingPlanItem[] {
  return Array.isArray(value) ? (value as unknown as TrainingPlanItem[]) : [];
}

/**
 * P4 (b) — die eingesammelten Durchführungsdaten als `plannedDate` in den
 * `trainingPlan` der Akte übernehmen (`applyTrainingDateFromEvidence`). Reiner
 * Daten-Merge im bestehenden `trainingPlan`-Json (kein Schema-Change). EC-10: der
 * importierte Nachweis bleibt separat `unchecked` (#7), kein Auto-Ist.
 */
async function applyTrainingDates(
  employeeFileId: string,
  dates: Map<string, string>,
): Promise<void> {
  if (dates.size === 0) return;
  const record = await prisma.employeeFile.findUnique({
    where: { id: employeeFileId },
    select: { trainingPlan: true },
  });
  let plan = asTrainingPlanArray(record?.trainingPlan ?? null);
  for (const [evidenceId, date] of dates) {
    plan = applyTrainingDateFromEvidence(plan, evidenceId, date);
  }
  await prisma.employeeFile.update({
    where: { id: employeeFileId },
    data: { trainingPlan: plan as unknown as Prisma.InputJsonValue },
  });
}

async function importEvidenceFiles(
  companySlug: string,
  employeeFileId: string,
  slot: TallyEmployeeSlotConfig,
  fieldMap: Map<string, TallyWebhookField>,
): Promise<number> {
  let imported = 0;
  for (let position = 0; position < slot.fileQuestionIds.length; position += 1) {
    const fileField = slot.fileQuestionIds[position];
    const field = fieldMap.get(fileField.questionId);
    if (!field) continue;
    const uploads = extractUploadedFiles(field.value);
    if (uploads.length === 0) continue;

    // Position-/Config-getriebene Zuordnung (label-unabhängig, Q3-Konvention
    // `training-plan:{id}` für Schulungen); Label-Heuristik nur als Rückfall.
    const evidenceId = resolveTallyFileEvidenceId(fileField, position);

    for (const upload of uploads) {
      if (!upload.url) continue;
      const fileName = upload.name || `${evidenceId}.pdf`;
      console.info(`${LOG} Downloading Tally file → S3`, {
        employeeFileId,
        evidenceId,
        fileName,
      });
      const buffer = await downloadTallyFile(upload.url);
      try {
        await saveEmployeeEvidenceFile(
          companySlug,
          employeeFileId,
          evidenceId,
          fileName,
          guessMimeType(fileName, upload.mimeType),
          buffer,
        );
        imported += 1;
      } catch (err) {
        console.error(`${LOG} Evidence upload failed`, {
          employeeFileId,
          evidenceId,
          fileName,
          err,
        });
      }
    }
  }
  return imported;
}

export async function processTallyWebhookPayload(
  payload: TallyWebhookPayload,
): Promise<TallyIntakeResult> {
  await ensureCompaniesSeeded();

  const data = payload.data;
  if (!data) {
    throw new Error("Missing Tally webhook data");
  }

  const responseId = data.responseId || data.submissionId;
  if (!responseId) {
    throw new Error("Missing Tally responseId/submissionId");
  }

  const existing = await prisma.tallyIntakeRecord.findUnique({
    where: { responseId },
  });
  if (existing) {
    console.info(`${LOG} Duplicate response skipped`, { responseId });
    return {
      skipped: true,
      responseId,
      companySlug: existing.companySlug,
      employeeIds: asStringArray(existing.employeeIds),
      evidenceImported: 0,
      reason: "duplicate",
    };
  }

  const formId = data.formId ?? "";
  // P2-A — Company-Tally „Unternehmensunterlagen" → zentrales Firmen-Profil.
  if (formId === TALLY_COMPANY_FORM_ID) {
    return processCompanyIntake(responseId, formId, data.fields ?? []);
  }
  if (formId !== TALLY_EMPLOYEE_FORM_ID) {
    console.warn(`${LOG} Unsupported form — stored as skipped`, { formId });
    await prisma.tallyIntakeRecord.create({
      data: {
        responseId,
        formId,
        companySlug: LEGACY_IMPORT_SLUG,
        employeeIds: [],
      },
    });
    return {
      skipped: true,
      responseId,
      companySlug: LEGACY_IMPORT_SLUG,
      employeeIds: [],
      evidenceImported: 0,
      reason: `unsupported-form:${formId}`,
    };
  }

  const fields = data.fields ?? [];
  const fieldMap = buildFieldMap(fields);

  const companyName = asString(
    fieldMap.get(TALLY_GLOBAL_QUESTIONS.companyName)?.value,
  );
  const companyEmail = asString(
    fieldMap.get(TALLY_GLOBAL_QUESTIONS.companyEmail)?.value,
  );
  const slugHint = extractCompanySlugHint(fieldMap);
  const companySlug = resolveCompanySlug({ slugHint, companyName });

  if (companySlug === LEGACY_IMPORT_SLUG) {
    console.warn(`${LOG} Company not matched — legacy import pool`, {
      companyName,
      slugHint: slugHint || undefined,
    });
  } else {
    console.info(`${LOG} Company resolved`, {
      companySlug,
      companyName: companyName || undefined,
      slugHint: slugHint || undefined,
    });
  }

  const employeeCountRaw = asStringArray(
    fieldMap.get(TALLY_GLOBAL_QUESTIONS.employeeCount)?.value,
  ).join(" ");
  const employeeCount = parseEmployeeCount(employeeCountRaw);

  if (companyEmail) {
    await prisma.companyExportSettings.upsert({
      where: { companySlug },
      create: {
        companySlug,
        companyName: companyName || companySlug,
        companyEmail,
      },
      update: {
        companyEmail,
        ...(companyName ? { companyName } : {}),
      },
    });
  }

  const employeeIds: string[] = [];
  let evidenceImported = 0;

  for (const slot of TALLY_EMPLOYEE_SLOTS) {
    if (slot.index > employeeCount) break;

    const fullName = asString(fieldMap.get(slot.nameQuestionId)?.value);
    if (!fullName) continue;

    const roleType = resolveTallyDropdownText(
      fieldMap.get(slot.roleTypeQuestionId ?? ""),
    );
    const employmentType = resolveTallyDropdownText(
      fieldMap.get(slot.employmentTypeQuestionId ?? ""),
    );
    const qualification = resolveTallyDropdownText(
      fieldMap.get(slot.qualificationQuestionId ?? ""),
    );
    const birthday = normalizeDate(
      asString(fieldMap.get(slot.birthdayQuestionId ?? "")?.value),
    );
    const guardIDNumber = asString(
      fieldMap.get(slot.guardIdQuestionId ?? "")?.value,
    );
    const employeeIDNumber = asString(
      fieldMap.get(slot.employeeIdQuestionId ?? "")?.value,
    );

    const employeeFileId = `tally-${responseId}-emp-${slot.index}`;

    await prisma.employeeFile.upsert({
      where: { id: employeeFileId },
      create: {
        id: employeeFileId,
        companySlug,
        fullName,
        birthday,
        startDate: "",
        roleId: "",
        roleType: roleType || null,
        employmentType: employmentType || null,
        qualification: qualification || null,
        guardIDNumber: guardIDNumber || null,
        employeeIDNumber: employeeIDNumber || null,
        appointmentIds: [],
        selectedRoleDocIds: [],
        selectedAppointmentDocIds: [],
      },
      update: {
        companySlug,
        fullName,
        birthday,
        roleType: roleType || null,
        employmentType: employmentType || null,
        qualification: qualification || null,
        guardIDNumber: guardIDNumber || null,
        employeeIDNumber: employeeIDNumber || null,
      },
    });

    employeeIds.push(employeeFileId);
    evidenceImported += await importEvidenceFiles(
      companySlug,
      employeeFileId,
      slot,
      fieldMap,
    );

    // P4 (b, Mark D4) — Durchführungs-/Zertifikatsdatum je Schulungsnachweis aus
    // der Submission in das `plannedDate` des Plan-Eintrags übernehmen. Kein
    // erfundenes Datum (fehlend → übersprungen); Nachweis bleibt `unchecked`.
    await applyTrainingDates(
      employeeFileId,
      collectTrainingDates(slot, fieldMap),
    );
  }

  await prisma.tallyIntakeRecord.create({
    data: {
      responseId,
      formId,
      companySlug,
      employeeIds,
    },
  });

  console.info(`${LOG} Intake complete`, {
    responseId,
    companySlug,
    employeeIds,
    evidenceImported,
  });

  return {
    skipped: false,
    responseId,
    companySlug,
    employeeIds,
    evidenceImported,
  };
}
