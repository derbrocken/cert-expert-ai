"use client";

import React from "react";
import { Badge } from "@/components/ui";
import { FileText } from "lucide-react";
import { formatIsoToInput } from "@/lib/utils/date";
import type { Employee, Role, Appointment } from "@/lib/types/employee";

export interface EmployeeFileDossierHeaderProps {
  employee: Employee;
  roles: Role[];
  appointments: Appointment[];
}

function displayDate(dateStr: string): string {
  if (!dateStr) return "—";
  return formatIsoToInput(dateStr) || dateStr;
}

export const EmployeeFileDossierHeader: React.FC<
  EmployeeFileDossierHeaderProps
> = ({ employee, roles, appointments }) => {
  const role = roles.find((r) => r.id === employee.roleId);
  const overlayNames = appointments
    .filter((a) => employee.appointmentIds.includes(a.id))
    .map((a) => a.name);

  return (
    <header className="border-b border-[#e5e7eb] bg-linear-to-r from-[rgba(227,6,19,0.06)] to-white px-4 py-4 sm:px-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(227,6,19,0.1)] text-[#e30613]">
          <FileText className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#e30613]">
            Mitarbeiterakte
          </p>
          <h2 className="mt-0.5 truncate text-lg font-bold text-[#111827] sm:text-xl">
            {employee.fullName || "Unbenannt"}
          </h2>
          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div>
              <dt className="text-xs text-[#6b7280]">Grundrolle</dt>
              <dd className="font-medium text-[#111827]">
                {(role?.name ?? employee.roleId) || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[#6b7280]">Eintritt</dt>
              <dd className="text-[#111827]">
                {displayDate(employee.startDate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[#6b7280]">Dokumente</dt>
              <dd className="flex flex-wrap gap-1">
                <Badge variant="default" size="sm">
                  {employee.selectedRoleDocIds.length} Rolle
                </Badge>
                {employee.selectedAppointmentDocIds.length > 0 ? (
                  <Badge variant="success" size="sm">
                    {employee.selectedAppointmentDocIds.length} Zusatz
                  </Badge>
                ) : null}
              </dd>
            </div>
            {overlayNames.length > 0 ? (
              <div className="w-full sm:w-auto">
                <dt className="text-xs text-[#6b7280]">Zusatzrollen</dt>
                <dd className="text-[#111827]">{overlayNames.join(", ")}</dd>
              </div>
            ) : null}
          </dl>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex rounded-md border border-[#e5e7eb] bg-[#f1f3f6] px-2 py-0.5 text-[10px] font-medium text-[#6b7280]">
              Nachweise: nicht implementiert
            </span>
            <span className="inline-flex rounded-md border border-[#e5e7eb] bg-[#f1f3f6] px-2 py-0.5 text-[10px] font-medium text-[#6b7280]">
              Readiness: nicht bewertet
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

EmployeeFileDossierHeader.displayName = "EmployeeFileDossierHeader";
