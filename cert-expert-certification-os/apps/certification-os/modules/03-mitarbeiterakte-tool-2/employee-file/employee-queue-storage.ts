import type { Employee, GlobalProperties } from "@/lib/types/employee";
import {
  fetchEmployeeFilesAction,
  fetchExportSettingsAction,
  migrateLocalStorageAction,
  saveEmployeeFilesAction,
  saveExportSettingsAction,
} from "@/app/actions/employee-file-actions";

export const QUEUE_STORAGE_KEY = "cert-expert-tool2-employee-queue-v1";
export const EVIDENCE_STORAGE_KEY = "cert-expert-tool2-employee-evidence-v1";

export interface EmployeeQueueSnapshot {
  employees: Employee[];
  globalProps: GlobalProperties;
}

/** Legacy read — migration source only. */
export function loadEmployeeQueueLegacy(): EmployeeQueueSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as EmployeeQueueSnapshot;
    if (!Array.isArray(parsed.employees)) return null;
    return {
      employees: parsed.employees,
      globalProps: parsed.globalProps ?? {
        companyName: "",
        companyEmail: "",
        companyAddress: "",
      },
    };
  } catch {
    return null;
  }
}

function loadEvidenceLegacy(): Record<
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
> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(EVIDENCE_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<
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
  } catch {
    return {};
  }
}

function markLocalStorageMigrated(): void {
  if (typeof window === "undefined") return;
  const stamp = new Date().toISOString();
  const queue = localStorage.getItem(QUEUE_STORAGE_KEY);
  if (queue) {
    localStorage.setItem(`${QUEUE_STORAGE_KEY}-migrated-${stamp}`, queue);
    localStorage.removeItem(QUEUE_STORAGE_KEY);
  }
  const evidence = localStorage.getItem(EVIDENCE_STORAGE_KEY);
  if (evidence) {
    localStorage.setItem(`${EVIDENCE_STORAGE_KEY}-migrated-${stamp}`, evidence);
    localStorage.removeItem(EVIDENCE_STORAGE_KEY);
  }
}

export async function runLocalStorageMigrationIfNeeded(): Promise<{
  companySlug?: string;
  skipped: boolean;
} | null> {
  const LOG = "[localStorage-migration]";

  try {
    console.info(`${LOG} Step 1/4: Reading legacy queue from localStorage…`);
    const queue = loadEmployeeQueueLegacy();

    console.info(`${LOG} Step 2/4: Reading legacy evidence from localStorage…`);
    const evidence = loadEvidenceLegacy();

    if (!queue && Object.keys(evidence).length === 0) {
      console.info(`${LOG} No legacy data found — skipping migration`);
      return null;
    }

    console.info(`${LOG} Step 3/4: Calling migrateLocalStorageAction…`, {
      hasQueue: Boolean(queue),
      employeeCount: queue?.employees.length ?? 0,
      evidenceEmployeeCount: Object.keys(evidence).length,
    });
    const result = await migrateLocalStorageAction({
      queue,
      evidence,
    });
    console.info(`${LOG} Step 3/4: Server migration result:`, result);

    if (!result.skipped) {
      console.info(`${LOG} Step 4/4: Marking localStorage as migrated…`);
      markLocalStorageMigrated();
      console.info(`${LOG} Migration complete`);
    } else {
      console.info(`${LOG} Step 4/4: Skipped — already migrated on server`);
    }

    return { companySlug: result.companySlug, skipped: result.skipped };
  } catch (err) {
    console.error(`${LOG} Migration failed (see step above):`, err);
    throw err;
  }
}

export async function loadEmployeeQueue(
  companySlug: string,
): Promise<EmployeeQueueSnapshot> {
  const [employees, globalProps] = await Promise.all([
    fetchEmployeeFilesAction(companySlug),
    fetchExportSettingsAction(companySlug),
  ]);
  return { employees, globalProps };
}

export async function saveEmployeeQueue(
  companySlug: string,
  snapshot: EmployeeQueueSnapshot,
): Promise<void> {
  await saveEmployeeFilesAction(companySlug, snapshot.employees);
  await saveExportSettingsAction(companySlug, snapshot.globalProps);
}

export async function loadGlobalExportSettings(
  companySlug: string,
): Promise<GlobalProperties> {
  return fetchExportSettingsAction(companySlug);
}

export async function saveGlobalExportSettings(
  companySlug: string,
  globalProps: GlobalProperties,
  logoFileBase64?: string | null,
): Promise<GlobalProperties> {
  return saveExportSettingsAction(companySlug, globalProps, logoFileBase64);
}
