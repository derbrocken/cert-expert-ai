/**
 * P2-B — Client-Wrapper für das firmen-ebene Dokumenten-Lager. Spiegelt
 * `employee-evidence-storage.ts` auf Company-Ebene (Server-Actions im Hintergrund).
 */
import {
  fetchCompanyDocumentsAction,
  removeCompanyDocumentAction,
  setCompanyDocumentCheckedAction,
  uploadCompanyDocumentAction,
} from "@/app/actions/employee-file-actions";
import type { CompanyDocumentDto } from "@/lib/employee-file-repository";
import { readFileAsDataUrl } from "./employee-evidence-storage";

export type CompanyDocumentMap = Record<string, CompanyDocumentDto>;

export async function loadCompanyDocuments(
  companySlug: string,
): Promise<CompanyDocumentMap> {
  return fetchCompanyDocumentsAction(companySlug);
}

export async function uploadCompanyDocument(
  companySlug: string,
  documentId: string,
  file: File,
): Promise<CompanyDocumentDto> {
  const dataUrl = await readFileAsDataUrl(file);
  const comma = dataUrl.indexOf(",");
  const base64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  return uploadCompanyDocumentAction(
    companySlug,
    documentId,
    file.name,
    file.type || "application/octet-stream",
    base64,
  );
}

export async function removeCompanyDocument(
  companySlug: string,
  documentId: string,
): Promise<void> {
  await removeCompanyDocumentAction(companySlug, documentId);
}

export async function setCompanyDocumentChecked(
  companySlug: string,
  documentId: string,
  checked: boolean,
  von?: string,
): Promise<CompanyDocumentDto | null> {
  return setCompanyDocumentCheckedAction(companySlug, documentId, checked, von);
}
