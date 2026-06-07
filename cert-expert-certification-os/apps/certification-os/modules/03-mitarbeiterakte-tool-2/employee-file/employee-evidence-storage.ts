const STORAGE_KEY = "cert-expert-tool2-employee-evidence-v1";

export interface StoredEvidenceFile {
  evidenceId: string;
  fileName: string;
  mimeType: string;
  uploadedAt: string;
  /** Optional preview for working UI (PDF) */
  dataUrl?: string;
}

export type EmployeeEvidenceMap = Record<string, StoredEvidenceFile>;

type EvidenceStore = Record<string, EmployeeEvidenceMap>;

function loadStore(): EvidenceStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as EvidenceStore;
  } catch {
    return {};
  }
}

function writeStore(store: EvidenceStore): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.error("Failed to persist evidence files:", err);
  }
}

export function loadEmployeeEvidence(employeeId: string): EmployeeEvidenceMap {
  return loadStore()[employeeId] ?? {};
}

export function saveEmployeeEvidenceFile(
  employeeId: string,
  evidenceId: string,
  file: File,
  dataUrl?: string,
): StoredEvidenceFile {
  const store = loadStore();
  const entry: StoredEvidenceFile = {
    evidenceId,
    fileName: file.name,
    mimeType: file.type || "application/pdf",
    uploadedAt: new Date().toISOString(),
    dataUrl,
  };
  store[employeeId] = { ...(store[employeeId] ?? {}), [evidenceId]: entry };
  writeStore(store);
  return entry;
}

export function removeEmployeeEvidenceFile(
  employeeId: string,
  evidenceId: string,
): void {
  const store = loadStore();
  if (!store[employeeId]) return;
  const next = { ...store[employeeId] };
  delete next[evidenceId];
  store[employeeId] = next;
  writeStore(store);
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
