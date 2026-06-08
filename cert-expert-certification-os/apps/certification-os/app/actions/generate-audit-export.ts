"use server";

import type {
  Appointment,
  Employee,
  Role,
} from "@/lib/types/employee";
import { loadEmployeeEvidenceDto } from "@/lib/employee-file-repository";
import {
  getEmployeeFileSummary,
  type RequirementRow,
} from "@/modules/03-mitarbeiterakte-tool-2/employee-file/employee-file-requirements";
import {
  resolveRoleClasses,
  sdlScopeLabel,
} from "@/modules/03-mitarbeiterakte-tool-2/employee-file/requirement-engine";
import { roleLabelDe } from "@/modules/03-mitarbeiterakte-tool-2/employee-file/employee-display-labels";
import {
  BEWACHUNG_CLASS_OPTIONS,
  NICHT_BEWACHUNG_CLASS_OPTIONS,
} from "@/modules/03-mitarbeiterakte-tool-2/employee-file/employee-stammdaten-options";
import {
  buildPlanDeadlineRows,
  computeTrainingGaps,
  derivePlanItemStatus,
  planEvidenceId,
  type PlanItemStatus,
} from "@/modules/03-mitarbeiterakte-tool-2/employee-file/training-plan";
import {
  computeComplianceStatus,
  overallLabel,
} from "@/modules/03-mitarbeiterakte-tool-2/employee-file/compliance-status";
import { buildAuditXlsx } from "@/modules/03-mitarbeiterakte-tool-2/employee-file/audit-export-xlsx";
import { buildAuditPdf } from "@/modules/03-mitarbeiterakte-tool-2/employee-file/audit-export-pdf";
import type {
  AuditExportPerson,
  AuditExportRow,
} from "@/modules/03-mitarbeiterakte-tool-2/employee-file/audit-export-data";

export interface GenerateAuditExportState {
  success: boolean;
  xlsxBase64?: string;
  pdfBase64?: string;
  error?: string;
  timestamp?: number;
}

export interface GenerateAuditExportInput {
  employees: Employee[];
  appointments: Appointment[];
  roles: Role[];
  companyName: string;
  companySlug: string;
  format?: "xlsx" | "pdf" | "both";
}

const ROLE_CLASS_LABELS: Record<string, string> = Object.fromEntries(
  [...BEWACHUNG_CLASS_OPTIONS, ...NICHT_BEWACHUNG_CLASS_OPTIONS].map((o) => [
    o.id,
    o.name,
  ]),
);

const PLAN_STATUS_LABEL: Record<PlanItemStatus, string> = {
  geplant: "geplant",
  ueberfaellig: "überfällig",
  "nachweis-vorhanden": "Nachweis vorhanden",
  "ohne-datum": "ohne Datum",
};

function formatDate(value?: string): string {
  if (!value) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : value;
}

function toRow(r: RequirementRow): AuditExportRow {
  return {
    label: r.label,
    value: r.value ? formatDate(r.value) : "",
    clauseId: r.clauseId,
    status: r.status,
  };
}

async function buildPerson(
  emp: Employee,
  input: GenerateAuditExportInput,
): Promise<AuditExportPerson> {
  const { appointments, roles, companyName, companySlug } = input;
  const role = roles.find((r) => r.id === emp.roleId);
  const apiRoleName = role?.name ?? emp.roleId;
  const summary = getEmployeeFileSummary(
    emp,
    appointments,
    companyName,
    roleLabelDe(emp.roleId, apiRoleName),
  );

  // Nachweis-Slots (read-only) für korrekten Plan-Status + Dateinamen.
  let evidence: Record<string, { fileName: string }> = {};
  try {
    evidence = await loadEmployeeEvidenceDto(companySlug, emp.id);
  } catch {
    evidence = {};
  }
  const hasProof = (evidenceId: string) => Boolean(evidence[evidenceId]);

  const planRows = buildPlanDeadlineRows(emp.trainingPlan ?? [], hasProof);
  const mergedFristen = [...summary.fristen, ...planRows];

  const compliance = computeComplianceStatus(
    summary.pflichtSet.map((r) => ({ status: r.status })),
    mergedFristen.map((r) => ({
      label: r.label,
      status: r.status,
      dueDate: r.value,
    })),
  );
  const ampelLabel = overallLabel(compliance.overall).label;

  const gaps = computeTrainingGaps(summary.schulungsSoll, emp);
  const annual = gaps.find((g) => g.id === "jahres-weiterbildung") ?? gaps[0];

  const roleClasses = resolveRoleClasses(emp)
    .map((rc) => ROLE_CLASS_LABELS[rc] ?? rc)
    .join(", ");

  const sdl = (emp.sdlScopes ?? []).map(sdlScopeLabel).join(", ");

  const trainingDetail = (emp.trainingPlan ?? []).map((item) => {
    const eId = planEvidenceId(item.id);
    const status: PlanItemStatus = derivePlanItemStatus(
      item,
      Boolean(evidence[eId]),
    );
    return {
      modul: item.label,
      plannedDate: formatDate(item.plannedDate),
      status: PLAN_STATUS_LABEL[status],
      proofFileName: evidence[eId]?.fileName ?? "",
      clauseId: item.clauseId,
    };
  });

  const schulungSoll: AuditExportRow[] = gaps.map((g) => ({
    label: g.label,
    value: `Soll ${g.soll ?? "fachlich prüfen"} / Ist ${g.ist} / Rest ${
      g.rest ?? "—"
    } UE`,
    clauseId: g.clauseId,
  }));

  return {
    name: emp.fullName || "Unbenannt",
    roleType: emp.roleType ?? "",
    roleName: summary.roleName,
    roleClasses,
    employmentType: emp.employmentType ?? "",
    sdlScopes: sdl,
    ampelLabel,
    ueSoll: annual
      ? annual.soll === null
        ? "fachlich prüfen"
        : String(annual.soll)
      : "—",
    ueIst: annual ? String(annual.ist) : "—",
    ueClauseId: annual?.clauseId,
    nextDeadlineLabel: compliance.nextDeadline?.label ?? "—",
    nextDeadlineDate: formatDate(compliance.nextDeadline?.dueDate),
    openCount: summary.openIssues.length,
    pflichtSet: summary.pflichtSet.map(toRow),
    fristen: mergedFristen.map(toRow),
    schulungSoll,
    trainingDetail,
    openIssues: summary.openIssues.map((r) => ({
      label: r.label,
      value: "",
      status: r.status,
      clauseId: r.clauseId,
    })),
  };
}

export async function generateAuditExport(
  input: GenerateAuditExportInput,
): Promise<GenerateAuditExportState> {
  try {
    const { employees, format = "both" } = input;
    if (!employees || employees.length === 0) {
      return { success: false, error: "Keine Person ausgewählt." };
    }

    const persons: AuditExportPerson[] = [];
    for (const emp of employees) {
      persons.push(await buildPerson(emp, input));
    }

    const result: GenerateAuditExportState = {
      success: true,
      timestamp: Date.now(),
    };

    if (format === "xlsx" || format === "both") {
      const xlsx = await buildAuditXlsx(persons);
      result.xlsxBase64 = xlsx.toString("base64");
    }
    if (format === "pdf" || format === "both") {
      const pdf = await buildAuditPdf(persons);
      result.pdfBase64 = pdf.toString("base64");
    }

    return result;
  } catch (error) {
    console.error("Error generating audit export:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Audit-Export fehlgeschlagen.",
    };
  }
}
