"use client";

import React from "react";
import { Badge } from "@/components/ui";
import { FileText, User, Info } from "lucide-react";
import type { Employee, Role, Appointment } from "@/lib/types/employee";

export interface EmployeeFileSummaryPanelProps {
  employee: Employee;
  roles: Role[];
  appointments: Appointment[];
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const EmployeeFileSummaryPanel: React.FC<EmployeeFileSummaryPanelProps> = ({
  employee,
  roles,
  appointments,
}) => {
  const role = roles.find((r) => r.id === employee.roleId);
  const overlayNames = appointments
    .filter((a) => employee.appointmentIds.includes(a.id))
    .map((a) => a.name);

  return (
    <div className="mb-6 rounded-2xl border border-blue-200 bg-linear-to-r from-blue-50/80 to-indigo-50/50 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
            Employee file summary
          </p>
          <h2 className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">
            {employee.fullName}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Transitional view — generator queue data (B5.7). Not a full
            Mitarbeiterakte yet.
          </p>

          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-xs font-medium text-gray-500">Role</dt>
              <dd className="font-medium text-gray-900">
                {role?.name ?? employee.roleId}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Birthday</dt>
              <dd className="text-gray-900">{formatDate(employee.birthday)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Start date</dt>
              <dd className="text-gray-900">{formatDate(employee.startDate)}</dd>
            </div>
            {employee.guardIDNumber ? (
              <div>
                <dt className="text-xs font-medium text-gray-500">Bewacher-ID</dt>
                <dd className="text-gray-900">{employee.guardIDNumber}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-xs font-medium text-gray-500">Output docs</dt>
              <dd className="flex flex-wrap gap-1.5">
                <Badge variant="default" size="sm">
                  {employee.selectedRoleDocIds.length} role
                </Badge>
                {employee.selectedAppointmentDocIds.length > 0 && (
                  <Badge variant="success" size="sm">
                    {employee.selectedAppointmentDocIds.length} overlay
                  </Badge>
                )}
              </dd>
            </div>
            {overlayNames.length > 0 ? (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-gray-500">Overlays</dt>
                <dd className="text-gray-900">{overlayNames.join(", ")}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-blue-200/60 pt-4">
            <Badge variant="default" size="sm" className="!bg-gray-100 !text-gray-600">
              Evidence: not implemented
            </Badge>
            <Badge variant="default" size="sm" className="!bg-gray-100 !text-gray-600">
              Readiness: not evaluated
            </Badge>
          </div>

          <p className="mt-3 flex items-start gap-2 text-xs text-gray-500">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Generated ZIP output does not equal accepted evidence or release
            readiness (B5.3–B5.5).
          </p>
        </div>
        <User className="hidden h-8 w-8 text-blue-200 sm:block" aria-hidden />
      </div>
    </div>
  );
};

EmployeeFileSummaryPanel.displayName = "EmployeeFileSummaryPanel";
