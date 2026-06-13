"use server";

import type { Employee, GlobalProperties } from "@/lib/types/employee";
import {
  createCompany,
  deleteEmployeeFile,
  getEmployeeCountsByCompany,
  getExportSettings,
  listCompanies,
  listEmployeeFiles,
  loadCompanyDocumentsDto,
  loadEmployeeEvidenceDto,
  migrateFromLocalStoragePayload,
  removeCompanyDocumentFile,
  removeEmployeeEvidenceFile,
  replaceEmployeeFilesForCompany,
  saveCompanyDocumentFile,
  saveEmployeeEvidenceFile,
  saveExportSettings,
  setCompanyDocumentChecked,
  upsertEmployeeFile,
  type CompanyDocumentMapDto,
  type EmployeeEvidenceMapDto,
  type LocalStorageMigrationPayload,
  type MigrationResult,
} from "@/lib/employee-file-repository";

export async function fetchCompaniesAction() {
  const companies = await listCompanies();
  console.info("[fetchCompaniesAction]", companies.length);
  return companies.map((company) => ({
    slug: company.slug,
    displayName: company.displayName,
  }));
}

export async function createCompanyAction(displayName: string) {
  const created = await createCompany(displayName);
  console.info("[createCompanyAction]", created.slug);
  return created;
}

export async function fetchEmployeeCountsAction() {
  return getEmployeeCountsByCompany();
}

export async function fetchEmployeeFilesAction(
  companySlug: string,
): Promise<Employee[]> {
  return listEmployeeFiles(companySlug);
}

export async function saveEmployeeFilesAction(
  companySlug: string,
  employees: Employee[],
): Promise<void> {
  await replaceEmployeeFilesForCompany(companySlug, employees);
}

export async function upsertEmployeeFileAction(
  companySlug: string,
  employee: Employee,
): Promise<Employee> {
  return upsertEmployeeFile(companySlug, employee);
}

export async function deleteEmployeeFileAction(
  companySlug: string,
  employeeId: string,
): Promise<void> {
  await deleteEmployeeFile(companySlug, employeeId);
}

export async function fetchExportSettingsAction(
  companySlug: string,
): Promise<GlobalProperties> {
  return getExportSettings(companySlug);
}

export async function saveExportSettingsAction(
  companySlug: string,
  props: GlobalProperties,
  logoFileBase64?: string | null,
): Promise<GlobalProperties> {
  return saveExportSettings(companySlug, props, logoFileBase64);
}

export async function fetchEmployeeEvidenceAction(
  companySlug: string,
  employeeFileId: string,
): Promise<EmployeeEvidenceMapDto> {
  return loadEmployeeEvidenceDto(companySlug, employeeFileId);
}

export async function uploadEmployeeEvidenceAction(
  companySlug: string,
  employeeFileId: string,
  evidenceId: string,
  fileName: string,
  mimeType: string,
  fileBase64: string,
) {
  const buffer = Buffer.from(fileBase64, "base64");
  return saveEmployeeEvidenceFile(
    companySlug,
    employeeFileId,
    evidenceId,
    fileName,
    mimeType,
    buffer,
  );
}

export async function removeEmployeeEvidenceAction(
  companySlug: string,
  employeeFileId: string,
  evidenceId: string,
): Promise<void> {
  await removeEmployeeEvidenceFile(companySlug, employeeFileId, evidenceId);
}

// ── P2-B — firmen-ebene Dokumente (Company-Tally `Y5Zq80` + manueller Upload) ──

export async function fetchCompanyDocumentsAction(
  companySlug: string,
): Promise<CompanyDocumentMapDto> {
  return loadCompanyDocumentsDto(companySlug);
}

export async function uploadCompanyDocumentAction(
  companySlug: string,
  documentId: string,
  fileName: string,
  mimeType: string,
  fileBase64: string,
) {
  const buffer = Buffer.from(fileBase64, "base64");
  return saveCompanyDocumentFile(
    companySlug,
    documentId,
    fileName,
    mimeType,
    buffer,
  );
}

export async function removeCompanyDocumentAction(
  companySlug: string,
  documentId: string,
): Promise<void> {
  await removeCompanyDocumentFile(companySlug, documentId);
}

export async function setCompanyDocumentCheckedAction(
  companySlug: string,
  documentId: string,
  checked: boolean,
  von?: string,
) {
  return setCompanyDocumentChecked(companySlug, documentId, checked, von);
}

export async function migrateLocalStorageAction(
  payload: LocalStorageMigrationPayload,
): Promise<MigrationResult> {
  return migrateFromLocalStoragePayload(payload);
}
