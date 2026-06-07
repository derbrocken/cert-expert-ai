"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { EmployeeFileIndex } from "@/modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeFileIndex";
import { EmployeeFileOverviewIntro } from "@/modules/03-mitarbeiterakte-tool-2/employee-file/EmployeeFileOverviewIntro";
import {
  loadEmployeeQueue,
  saveEmployeeQueue,
} from "@/lib/employee-queue-storage";
import type { Employee, Role } from "@/lib/types/employee";

function getInitialHubState() {
  const saved = loadEmployeeQueue();
  if (saved) {
    return {
      employees: saved.employees,
      batchSelectedIds: new Set(saved.employees.map((e) => e.id)),
    };
  }
  return {
    employees: [] as Employee[],
    batchSelectedIds: new Set<string>(),
  };
}

export function EmployeeFileDashboardHub() {
  const router = useRouter();
  const initial = getInitialHubState();
  const [employees, setEmployees] = useState<Employee[]>(initial.employees);
  const [roles, setRoles] = useState<Role[]>([]);
  const [batchSelectedIds, setBatchSelectedIds] = useState<Set<string>>(
    initial.batchSelectedIds,
  );
  const [templatesLoaded, setTemplatesLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadTemplates() {
      try {
        const response = await fetch("/api/templates");
        const data = await response.json();
        if (!cancelled) {
          setRoles(data.roles ?? []);
        }
      } catch {
        if (!cancelled) {
          setRoles([]);
        }
      } finally {
        if (!cancelled) {
          setTemplatesLoaded(true);
        }
      }
    }

    void loadTemplates();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!templatesLoaded) return;
    const snap = loadEmployeeQueue();
    saveEmployeeQueue({
      employees,
      globalProps: snap?.globalProps ?? {
        companyName: "",
        companyEmail: "",
        companyAddress: "",
      },
    });
  }, [employees, templatesLoaded]);

  const openWorkspace = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router],
  );

  const handleSelectEmployee = useCallback(
    (employeeId: string) => {
      openWorkspace(`/employee-automation?id=${employeeId}`);
    },
    [openWorkspace],
  );

  const handleCreateNew = useCallback(() => {
    openWorkspace("/employee-automation?new=1");
  }, [openWorkspace]);

  const handleBackToOverview = useCallback(() => {
    /* Dashboard embed is always overview — no-op */
  }, []);

  const handleDeleteEmployee = useCallback((employeeId: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== employeeId));
    setBatchSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(employeeId);
      return next;
    });
  }, []);

  const handleToggleBatch = useCallback((employeeId: string) => {
    setBatchSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(employeeId)) next.delete(employeeId);
      else next.add(employeeId);
      return next;
    });
  }, []);

  const handleToggleAllBatch = useCallback(
    (selected: boolean) => {
      setBatchSelectedIds(
        selected ? new Set(employees.map((e) => e.id)) : new Set(),
      );
    },
    [employees],
  );

  if (!templatesLoaded) {
    return (
      <p className="p-6 text-sm text-[#6b7280]">Mitarbeiterakten laden…</p>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <aside className="flex min-h-[360px] w-full flex-col border-b border-[#e5e7eb] bg-white lg:min-h-0 lg:w-[min(100%,280px)] lg:shrink-0 lg:border-b-0 lg:border-r">
        <EmployeeFileIndex
          embedded
          employees={employees}
          roles={roles}
          selectedEmployeeId={null}
          isCreatingNew={false}
          batchSelectedIds={batchSelectedIds}
          onSelectEmployee={handleSelectEmployee}
          onCreateNew={handleCreateNew}
          onBackToOverview={handleBackToOverview}
          onDeleteEmployee={handleDeleteEmployee}
          onToggleBatch={handleToggleBatch}
          onToggleAllBatch={handleToggleAllBatch}
        />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-end border-b border-[#e5e7eb] bg-[#fafbfc] px-4 py-2">
          <Link
            href="/employee-automation"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#e30613] hover:underline"
          >
            Workspace öffnen
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
        <main className="flex-1 overflow-auto bg-[#f4f5f7]">
          <EmployeeFileOverviewIntro
            employeeCount={employees.length}
            onCreateNew={handleCreateNew}
          />
        </main>
      </div>
    </div>
  );
}
