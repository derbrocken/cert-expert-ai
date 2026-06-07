import {
  fetchEmployeeEvidenceAction,
  removeEmployeeEvidenceAction,
  uploadEmployeeEvidenceAction,
} from "@/app/actions/employee-file-actions";

export interface StoredEvidenceFile {
  evidenceId: string;
  fileName: string;
  mimeType: string;
  uploadedAt: string;
  /** Optional preview for working UI (PDF) */
  dataUrl?: string;
  previewUrl?: string;
}

export type EmployeeEvidenceMap = Record<string, StoredEvidenceFile>;

export async function loadEmployeeEvidence(
  companySlug: string,
  employeeId: string,
): Promise<EmployeeEvidenceMap> {
  return fetchEmployeeEvidenceAction(companySlug, employeeId);
}

export async function saveEmployeeEvidenceFile(
  companySlug: string,
  employeeId: string,
  evidenceId: string,
  file: File,
): Promise<StoredEvidenceFile> {
  const fileBase64 = await fileToBase64(file);
  return uploadEmployeeEvidenceAction(
    companySlug,
    employeeId,
    evidenceId,
    file.name,
    file.type || "application/octet-stream",
    fileBase64,
  );
}

export async function removeEmployeeEvidenceFile(
  companySlug: string,
  employeeId: string,
  evidenceId: string,
): Promise<void> {
  await removeEmployeeEvidenceAction(companySlug, employeeId, evidenceId);
}

async function fileToBase64(file: File): Promise<string> {
  const dataUrl = await readFileAsDataUrl(file);
  const comma = dataUrl.indexOf(",");
  return comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
