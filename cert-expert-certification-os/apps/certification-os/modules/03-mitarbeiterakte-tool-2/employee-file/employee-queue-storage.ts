import type { Employee, GlobalProperties } from "@/lib/types/employee";

const STORAGE_KEY = "cert-expert-tool2-employee-queue-v1";

export interface EmployeeQueueSnapshot {
  employees: Employee[];
  globalProps: GlobalProperties;
}

export function loadEmployeeQueue(): EmployeeQueueSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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

export function saveEmployeeQueue(snapshot: EmployeeQueueSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch (err) {
    console.error("Failed to persist employee queue:", err);
  }
}

export function clearEmployeeQueue(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
