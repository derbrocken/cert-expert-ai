import type { Employee, GlobalProperties } from "@/lib/types/employee";
import type { EmployeeFile, EvidenceItem, Prisma } from "@prisma/client";
import {
  buildCompanyLogoKey,
  buildEvidenceKey,
  deleteCeaObject,
  getCeaObjectBuffer,
  getCeaPresignedUrl,
  isS3Configured,
  parseDataUrl,
  putCeaObject,
} from "@/lib/cea-blob-storage";
import {
  LEGACY_IMPORT_SLUG,
  loadCustomerRegistry,
  matchCompanySlugByName,
} from "@/lib/customer-registry";
import { prisma } from "@/lib/prisma";

const QUEUE_MIGRATION_KEY = "cert-expert-tool2-employee-queue-v1";
const EVIDENCE_MIGRATION_KEY = "cert-expert-tool2-employee-evidence-v1";

export interface StoredEvidenceFileDto {
  evidenceId: string;
  fileName: string;
  mimeType: string;
  uploadedAt: string;
  dataUrl?: string;
  previewUrl?: string;
}

export type EmployeeEvidenceMapDto = Record<string, StoredEvidenceFileDto>;

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function asNiveau(value: unknown): "ek" | "fk" | undefined {
  return value === "ek" || value === "fk" ? value : undefined;
}

function asNumberRecord(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
  }
  return out;
}

export function employeeFileToEmployee(record: EmployeeFile): Employee {
  return {
    id: record.id,
    fullName: record.fullName,
    birthday: record.birthday,
    startDate: record.startDate,
    roleId: record.roleId,
    appointmentIds: asStringArray(record.appointmentIds),
    selectedRoleDocIds: asStringArray(record.selectedRoleDocIds),
    selectedAppointmentDocIds: asStringArray(record.selectedAppointmentDocIds),
    roleType: record.roleType ?? undefined,
    employmentType: record.employmentType ?? undefined,
    qualification: record.qualification ?? undefined,
    trainingHours: record.trainingHours ?? undefined,
    guardIDNumber: record.guardIDNumber ?? undefined,
    employeeIDNumber: record.employeeIDNumber ?? undefined,
    useGuardAsEmployeeId: record.useGuardAsEmployeeId ?? undefined,
    zusatzBewachungNiveau: asNiveau(record.zusatzBewachungNiveau),
    sdlScopes: asStringArray(record.sdlScopes),
    drivesServiceVehicle: record.drivesServiceVehicle ?? undefined,
    ersteHilfeGueltigBis: record.ersteHilfeGueltigBis ?? undefined,
    brandschutzGueltigBis: record.brandschutzGueltigBis ?? undefined,
    weiterbildungIstUE: record.weiterbildungIstUE ?? undefined,
    einmaligIstUE: asNumberRecord(record.einmaligIstUE),
  };
}

function employeeToUpsertData(
  companySlug: string,
  employee: Employee,
): Prisma.EmployeeFileCreateInput {
  return {
    id: employee.id,
    company: { connect: { slug: companySlug } },
    fullName: employee.fullName,
    birthday: employee.birthday,
    startDate: employee.startDate,
    roleId: employee.roleId,
    appointmentIds: employee.appointmentIds,
    selectedRoleDocIds: employee.selectedRoleDocIds,
    selectedAppointmentDocIds: employee.selectedAppointmentDocIds,
    roleType: employee.roleType ?? null,
    employmentType: employee.employmentType ?? null,
    qualification: employee.qualification ?? null,
    trainingHours: employee.trainingHours ?? null,
    guardIDNumber: employee.guardIDNumber ?? null,
    employeeIDNumber: employee.employeeIDNumber ?? null,
    useGuardAsEmployeeId: employee.useGuardAsEmployeeId ?? null,
    zusatzBewachungNiveau: employee.zusatzBewachungNiveau ?? null,
    sdlScopes: employee.sdlScopes ?? [],
    drivesServiceVehicle: employee.drivesServiceVehicle ?? null,
    ersteHilfeGueltigBis: employee.ersteHilfeGueltigBis ?? null,
    brandschutzGueltigBis: employee.brandschutzGueltigBis ?? null,
    weiterbildungIstUE: employee.weiterbildungIstUE ?? null,
    einmaligIstUE: employee.einmaligIstUE ?? {},
  };
}

export async function ensureCompaniesSeeded(): Promise<void> {
  let registry;
  try {
    registry = loadCustomerRegistry();
  } catch (err) {
    console.error("[ensureCompaniesSeeded] Failed to load customer registry:", err);
    throw err;
  }

  if (registry.length === 0) {
    const message = "[ensureCompaniesSeeded] Registry returned zero active companies";
    console.error(message);
    throw new Error(message);
  }

  for (const project of registry) {
    try {
      await prisma.company.upsert({
        where: { slug: project.slug },
        create: {
          slug: project.slug,
          displayName: project.display_name,
          active: true,
        },
        update: {
          displayName: project.display_name,
          active: true,
        },
      });
    } catch (err) {
      console.error(
        `[ensureCompaniesSeeded] Failed to upsert company "${project.slug}":`,
        err,
      );
      throw err;
    }
  }

  try {
    await prisma.company.upsert({
      where: { slug: LEGACY_IMPORT_SLUG },
      create: {
        slug: LEGACY_IMPORT_SLUG,
        displayName: "Legacy Import (zuweisen)",
        active: true,
      },
      update: {},
    });
  } catch (err) {
    console.error(
      `[ensureCompaniesSeeded] Failed to upsert legacy import company:`,
      err,
    );
    throw err;
  }

  console.info(
    `[ensureCompaniesSeeded] Seeded ${registry.length} registry companies (+ ${LEGACY_IMPORT_SLUG})`,
  );
}

export async function listCompanies() {
  await ensureCompaniesSeeded();
  return prisma.company.findMany({
    where: { active: true, slug: { not: LEGACY_IMPORT_SLUG } },
    orderBy: { displayName: "asc" },
    select: { slug: true, displayName: true },
  });
}

export async function listEmployeeFiles(companySlug: string): Promise<Employee[]> {
  await ensureCompaniesSeeded();
  const rows = await prisma.employeeFile.findMany({
    where: { companySlug },
    orderBy: { fullName: "asc" },
  });
  return rows.map(employeeFileToEmployee);
}

export async function upsertEmployeeFile(
  companySlug: string,
  employee: Employee,
): Promise<Employee> {
  await ensureCompaniesSeeded();
  const data = employeeToUpsertData(companySlug, employee);
  const row = await prisma.employeeFile.upsert({
    where: { id: employee.id },
    create: data,
    update: {
      companySlug,
      fullName: employee.fullName,
      birthday: employee.birthday,
      startDate: employee.startDate,
      roleId: employee.roleId,
      appointmentIds: employee.appointmentIds,
      selectedRoleDocIds: employee.selectedRoleDocIds,
      selectedAppointmentDocIds: employee.selectedAppointmentDocIds,
      roleType: employee.roleType ?? null,
      employmentType: employee.employmentType ?? null,
      qualification: employee.qualification ?? null,
      trainingHours: employee.trainingHours ?? null,
      guardIDNumber: employee.guardIDNumber ?? null,
      employeeIDNumber: employee.employeeIDNumber ?? null,
      useGuardAsEmployeeId: employee.useGuardAsEmployeeId ?? null,
      zusatzBewachungNiveau: employee.zusatzBewachungNiveau ?? null,
      sdlScopes: employee.sdlScopes ?? [],
      drivesServiceVehicle: employee.drivesServiceVehicle ?? null,
      ersteHilfeGueltigBis: employee.ersteHilfeGueltigBis ?? null,
      brandschutzGueltigBis: employee.brandschutzGueltigBis ?? null,
      weiterbildungIstUE: employee.weiterbildungIstUE ?? null,
      einmaligIstUE: employee.einmaligIstUE ?? {},
    },
  });
  return employeeFileToEmployee(row);
}

export async function replaceEmployeeFilesForCompany(
  companySlug: string,
  employees: Employee[],
): Promise<void> {
  await ensureCompaniesSeeded();
  const ids = employees.map((e) => e.id);
  await prisma.$transaction(async (tx) => {
    if (ids.length === 0) {
      await tx.employeeFile.deleteMany({ where: { companySlug } });
      return;
    }
    await tx.employeeFile.deleteMany({
      where: {
        companySlug,
        id: { notIn: ids },
      },
    });
    for (const employee of employees) {
      await tx.employeeFile.upsert({
        where: { id: employee.id },
        create: employeeToUpsertData(companySlug, employee),
        update: {
          companySlug,
          fullName: employee.fullName,
          birthday: employee.birthday,
          startDate: employee.startDate,
          roleId: employee.roleId,
          appointmentIds: employee.appointmentIds,
          selectedRoleDocIds: employee.selectedRoleDocIds,
          selectedAppointmentDocIds: employee.selectedAppointmentDocIds,
          roleType: employee.roleType ?? null,
          employmentType: employee.employmentType ?? null,
          qualification: employee.qualification ?? null,
          trainingHours: employee.trainingHours ?? null,
          guardIDNumber: employee.guardIDNumber ?? null,
          employeeIDNumber: employee.employeeIDNumber ?? null,
          useGuardAsEmployeeId: employee.useGuardAsEmployeeId ?? null,
          zusatzBewachungNiveau: employee.zusatzBewachungNiveau ?? null,
          sdlScopes: employee.sdlScopes ?? [],
          drivesServiceVehicle: employee.drivesServiceVehicle ?? null,
          ersteHilfeGueltigBis: employee.ersteHilfeGueltigBis ?? null,
          brandschutzGueltigBis: employee.brandschutzGueltigBis ?? null,
          weiterbildungIstUE: employee.weiterbildungIstUE ?? null,
          einmaligIstUE: employee.einmaligIstUE ?? {},
        },
      });
    }
  });
}

export async function deleteEmployeeFile(
  companySlug: string,
  employeeId: string,
): Promise<void> {
  const evidence = await prisma.evidenceItem.findMany({
    where: { employeeFileId: employeeId },
  });
  for (const item of evidence) {
    await deleteCeaObject(item.storageKey);
  }
  await prisma.employeeFile.deleteMany({
    where: { id: employeeId, companySlug },
  });
}

async function logoBufferToDataUrl(
  logoStorageKey: string | null | undefined,
): Promise<string | undefined> {
  if (!logoStorageKey || !isS3Configured()) return undefined;
  const buffer = await getCeaObjectBuffer(logoStorageKey);
  if (!buffer || buffer.length === 0) return undefined;
  const ext = logoStorageKey.split(".").pop()?.toLowerCase();
  const mime =
    ext === "png"
      ? "image/png"
      : ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : ext === "webp"
          ? "image/webp"
          : "image/png";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

export async function getExportSettings(
  companySlug: string,
): Promise<GlobalProperties> {
  await ensureCompaniesSeeded();
  const row = await prisma.companyExportSettings.findUnique({
    where: { companySlug },
  });
  if (!row) {
    const company = await prisma.company.findUnique({
      where: { slug: companySlug },
    });
    return {
      companyName: company?.displayName ?? "",
      companyEmail: "",
      companyAddress: "",
    };
  }
  const companyLogo = await logoBufferToDataUrl(row.logoStorageKey);
  return {
    companyName: row.companyName,
    companyEmail: row.companyEmail,
    companyAddress: row.companyAddress,
    companyLogo,
    documentVersion: row.documentVersion ?? undefined,
    documentDate: row.documentDate ?? undefined,
    createdBy: row.createdBy ?? undefined,
    approvedBy: row.approvedBy ?? undefined,
  };
}

export async function saveExportSettings(
  companySlug: string,
  props: GlobalProperties,
  logoFileBase64?: string | null,
): Promise<GlobalProperties> {
  await ensureCompaniesSeeded();
  let logoStorageKey: string | null | undefined;

  const existing = await prisma.companyExportSettings.findUnique({
    where: { companySlug },
  });
  logoStorageKey = existing?.logoStorageKey ?? null;

  if (logoFileBase64) {
    const parsed = parseDataUrl(logoFileBase64);
    if (parsed && isS3Configured()) {
      const ext =
        parsed.mimeType === "image/jpeg"
          ? "jpg"
          : parsed.mimeType === "image/webp"
            ? "webp"
            : "png";
      const key = buildCompanyLogoKey(companySlug, ext);
      await putCeaObject(key, parsed.buffer, parsed.mimeType);
      if (existing?.logoStorageKey && existing.logoStorageKey !== key) {
        await deleteCeaObject(existing.logoStorageKey);
      }
      logoStorageKey = key;
    }
  } else if (props.companyLogo && isS3Configured()) {
    const parsed = parseDataUrl(props.companyLogo);
    if (parsed) {
      const ext =
        parsed.mimeType === "image/jpeg"
          ? "jpg"
          : parsed.mimeType === "image/webp"
            ? "webp"
            : "png";
      const key = buildCompanyLogoKey(companySlug, ext);
      await putCeaObject(key, parsed.buffer, parsed.mimeType);
      logoStorageKey = key;
    }
  }

  await prisma.companyExportSettings.upsert({
    where: { companySlug },
    create: {
      companySlug,
      companyName: props.companyName,
      companyEmail: props.companyEmail,
      companyAddress: props.companyAddress,
      logoStorageKey,
      documentVersion: props.documentVersion ?? null,
      documentDate: props.documentDate ?? null,
      createdBy: props.createdBy ?? null,
      approvedBy: props.approvedBy ?? null,
    },
    update: {
      companyName: props.companyName,
      companyEmail: props.companyEmail,
      companyAddress: props.companyAddress,
      logoStorageKey,
      documentVersion: props.documentVersion ?? null,
      documentDate: props.documentDate ?? null,
      createdBy: props.createdBy ?? null,
      approvedBy: props.approvedBy ?? null,
    },
  });

  return getExportSettings(companySlug);
}

async function evidenceToDto(item: EvidenceItem): Promise<StoredEvidenceFileDto> {
  const previewUrl = await getCeaPresignedUrl(item.storageKey);
  return {
    evidenceId: item.evidenceId,
    fileName: item.fileName,
    mimeType: item.mimeType,
    uploadedAt: item.uploadedAt.toISOString(),
    previewUrl: previewUrl ?? undefined,
    dataUrl: previewUrl ?? undefined,
  };
}

export async function loadEmployeeEvidenceDto(
  companySlug: string,
  employeeFileId: string,
): Promise<EmployeeEvidenceMapDto> {
  const items = await prisma.evidenceItem.findMany({
    where: {
      employeeFileId,
      employeeFile: { companySlug },
    },
  });
  const map: EmployeeEvidenceMapDto = {};
  for (const item of items) {
    map[item.evidenceId] = await evidenceToDto(item);
  }
  return map;
}

export async function saveEmployeeEvidenceFile(
  companySlug: string,
  employeeFileId: string,
  evidenceId: string,
  fileName: string,
  mimeType: string,
  buffer: Buffer,
): Promise<StoredEvidenceFileDto> {
  if (!isS3Configured()) {
    throw new Error("Hetzner S3 is not configured for evidence storage");
  }
  const storageKey = buildEvidenceKey(
    companySlug,
    employeeFileId,
    evidenceId,
    fileName,
  );
  await putCeaObject(storageKey, buffer, mimeType || "application/octet-stream");

  const existing = await prisma.evidenceItem.findUnique({
    where: {
      employeeFileId_evidenceId: { employeeFileId, evidenceId },
    },
  });
  if (existing?.storageKey && existing.storageKey !== storageKey) {
    await deleteCeaObject(existing.storageKey);
  }

  const row = await prisma.evidenceItem.upsert({
    where: {
      employeeFileId_evidenceId: { employeeFileId, evidenceId },
    },
    create: {
      employeeFileId,
      evidenceId,
      fileName,
      mimeType: mimeType || "application/octet-stream",
      storageKey,
      status: "unchecked",
      uploadedAt: new Date(),
    },
    update: {
      fileName,
      mimeType: mimeType || "application/octet-stream",
      storageKey,
      uploadedAt: new Date(),
    },
  });

  return await evidenceToDto(row);
}

export async function removeEmployeeEvidenceFile(
  companySlug: string,
  employeeFileId: string,
  evidenceId: string,
): Promise<void> {
  const row = await prisma.evidenceItem.findFirst({
    where: {
      employeeFileId,
      evidenceId,
      employeeFile: { companySlug },
    },
  });
  if (!row) return;
  await deleteCeaObject(row.storageKey);
  await prisma.evidenceItem.delete({ where: { id: row.id } });
}

export interface LocalStorageMigrationPayload {
  queue: {
    employees: Employee[];
    globalProps: GlobalProperties;
  } | null;
  evidence: Record<
    string,
    Record<
      string,
      {
        evidenceId: string;
        fileName: string;
        mimeType: string;
        uploadedAt: string;
        dataUrl?: string;
      }
    >
  >;
}

export interface MigrationResult {
  companySlug: string;
  employeesImported: number;
  evidenceImported: number;
  skipped: boolean;
}

export async function migrateFromLocalStoragePayload(
  payload: LocalStorageMigrationPayload,
): Promise<MigrationResult> {
  const LOG = "[migrateFromLocalStorage]";

  try {
    console.info(`${LOG} Step: ensureCompaniesSeeded`);
    await ensureCompaniesSeeded();

    console.info(`${LOG} Step: check existing migration record`);
    const existing = await prisma.migrationRecord.findUnique({
      where: { sourceKey: QUEUE_MIGRATION_KEY },
    });
    if (existing) {
      console.info(`${LOG} Step: already migrated → skip`, {
        companySlug: existing.companySlug,
      });
      return {
        companySlug: existing.companySlug,
        employeesImported: 0,
        evidenceImported: 0,
        skipped: true,
      };
    }

    const companySlug =
      matchCompanySlugByName(payload.queue?.globalProps.companyName ?? "") ??
      LEGACY_IMPORT_SLUG;
    console.info(`${LOG} Step: resolved company slug`, { companySlug });

    let employeesImported = 0;
    if (payload.queue?.employees?.length) {
      console.info(`${LOG} Step: import employees`, {
        count: payload.queue.employees.length,
      });
      for (const employee of payload.queue.employees) {
        await prisma.employeeFile.upsert({
          where: { id: employee.id },
          create: {
            ...employeeToUpsertData(companySlug, employee),
            migratedFromLocalStorageAt: new Date(),
          },
          update: {
            companySlug,
            fullName: employee.fullName,
            birthday: employee.birthday,
            startDate: employee.startDate,
            roleId: employee.roleId,
            appointmentIds: employee.appointmentIds,
            selectedRoleDocIds: employee.selectedRoleDocIds,
            selectedAppointmentDocIds: employee.selectedAppointmentDocIds,
            roleType: employee.roleType ?? null,
            employmentType: employee.employmentType ?? null,
            qualification: employee.qualification ?? null,
            trainingHours: employee.trainingHours ?? null,
            guardIDNumber: employee.guardIDNumber ?? null,
            employeeIDNumber: employee.employeeIDNumber ?? null,
            useGuardAsEmployeeId: employee.useGuardAsEmployeeId ?? null,
            zusatzBewachungNiveau: employee.zusatzBewachungNiveau ?? null,
            sdlScopes: employee.sdlScopes ?? [],
            drivesServiceVehicle: employee.drivesServiceVehicle ?? null,
            ersteHilfeGueltigBis: employee.ersteHilfeGueltigBis ?? null,
            brandschutzGueltigBis: employee.brandschutzGueltigBis ?? null,
            weiterbildungIstUE: employee.weiterbildungIstUE ?? null,
            einmaligIstUE: employee.einmaligIstUE ?? {},
            migratedFromLocalStorageAt: new Date(),
          },
        });
        employeesImported += 1;
      }
    }

    if (payload.queue?.globalProps) {
      console.info(`${LOG} Step: save export settings`);
      await saveExportSettings(companySlug, payload.queue.globalProps);
    }

    let evidenceImported = 0;
    const evidenceEntries = Object.entries(payload.evidence);
    if (evidenceEntries.length > 0) {
      console.info(`${LOG} Step: import evidence to S3`, {
        employeeCount: evidenceEntries.length,
      });
    }
    for (const [employeeId, evidenceMap] of evidenceEntries) {
      const file = await prisma.employeeFile.findUnique({
        where: { id: employeeId },
      });
      if (!file) continue;

      for (const entry of Object.values(evidenceMap)) {
        let buffer: Buffer | null = null;
        if (entry.dataUrl) {
          const parsed = parseDataUrl(entry.dataUrl);
          buffer = parsed?.buffer ?? null;
        }
        if (!buffer) continue;

        await saveEmployeeEvidenceFile(
          file.companySlug,
          employeeId,
          entry.evidenceId,
          entry.fileName,
          entry.mimeType,
          buffer,
        );
        evidenceImported += 1;
      }
    }

    console.info(`${LOG} Step: create migration record`);
    await prisma.migrationRecord.create({
      data: {
        sourceKey: QUEUE_MIGRATION_KEY,
        companySlug,
      },
    });

    if (Object.keys(payload.evidence).length > 0) {
      await prisma.migrationRecord.upsert({
        where: { sourceKey: EVIDENCE_MIGRATION_KEY },
        create: {
          sourceKey: EVIDENCE_MIGRATION_KEY,
          companySlug,
        },
        update: { companySlug },
      });
    }

    console.info(`${LOG} Migration complete`, {
      companySlug,
      employeesImported,
      evidenceImported,
    });
    return { companySlug, employeesImported, evidenceImported, skipped: false };
  } catch (err) {
    console.error(`${LOG} Migration failed:`, err);
    throw err;
  }
}
