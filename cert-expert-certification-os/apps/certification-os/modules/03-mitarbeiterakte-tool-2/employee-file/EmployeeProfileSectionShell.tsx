"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui";
import { formatIsoToInput } from "@/lib/utils/date";
import type { Employee, Role, Appointment } from "@/lib/types/employee";
import {
  User,
  Briefcase,
  Shield,
  FileCheck,
  GraduationCap,
  FolderKanban,
  FileOutput,
  ClipboardCheck,
  StickyNote,
  History,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmployeeProfileSectionShellProps {
  employee: Employee;
  roles: Role[];
  appointments: Appointment[];
}

type SectionId =
  | "master-data"
  | "employment"
  | "roles"
  | "evidence"
  | "training"
  | "sdl-project"
  | "output"
  | "review"
  | "notes-open"
  | "history";

interface SectionDef {
  id: SectionId;
  labelDe: string;
  labelEn: string;
  icon: React.ReactNode;
  state: "active" | "placeholder" | "read-only";
}

const SECTIONS: SectionDef[] = [
  {
    id: "master-data",
    labelDe: "Stammdaten",
    labelEn: "Profile",
    icon: <User className="h-4 w-4" />,
    state: "active",
  },
  {
    id: "employment",
    labelDe: "Beschäftigung",
    labelEn: "Employment",
    icon: <Briefcase className="h-4 w-4" />,
    state: "active",
  },
  {
    id: "roles",
    labelDe: "Rolle / Zusatzrolle",
    labelEn: "Role & overlay",
    icon: <Shield className="h-4 w-4" />,
    state: "active",
  },
  {
    id: "evidence",
    labelDe: "Nachweise",
    labelEn: "Evidence",
    icon: <FileCheck className="h-4 w-4" />,
    state: "placeholder",
  },
  {
    id: "training",
    labelDe: "Schulung / Unterweisung",
    labelEn: "Training",
    icon: <GraduationCap className="h-4 w-4" />,
    state: "placeholder",
  },
  {
    id: "sdl-project",
    labelDe: "SDL / Projektzuordnung",
    labelEn: "SDL & project",
    icon: <FolderKanban className="h-4 w-4" />,
    state: "placeholder",
  },
  {
    id: "output",
    labelDe: "Generator Output",
    labelEn: "Generator output",
    icon: <FileOutput className="h-4 w-4" />,
    state: "read-only",
  },
  {
    id: "review",
    labelDe: "Review / Prüfstatus",
    labelEn: "Review status",
    icon: <ClipboardCheck className="h-4 w-4" />,
    state: "read-only",
  },
  {
    id: "notes-open",
    labelDe: "Notizen / Offene Punkte",
    labelEn: "Notes & open items",
    icon: <StickyNote className="h-4 w-4" />,
    state: "read-only",
  },
  {
    id: "history",
    labelDe: "Verlauf / History",
    labelEn: "History",
    icon: <History className="h-4 w-4" />,
    state: "placeholder",
  },
];

function displayDate(iso: string): string {
  if (!iso) return "—";
  const formatted = formatIsoToInput(iso);
  return formatted || iso;
}

function greyBadge(label: string) {
  return (
    <Badge variant="default" size="sm" className="!bg-gray-100 !text-gray-600">
      {label}
    </Badge>
  );
}

function PlaceholderPanel({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/80 p-6 text-center">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="mt-2 text-xs text-gray-500">Not implemented</p>
      <div className="mt-3 flex justify-center">
        {greyBadge("Not evaluated")}
      </div>
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-gray-900">{value}</dd>
    </div>
  );
}

export const EmployeeProfileSectionShell: React.FC<
  EmployeeProfileSectionShellProps
> = ({ employee, roles, appointments }) => {
  const [activeSection, setActiveSection] = useState<SectionId>("master-data");

  const role = roles.find((r) => r.id === employee.roleId);
  const overlayNames = appointments
    .filter((a) => employee.appointmentIds.includes(a.id))
    .map((a) => a.name);

  const totalSelectedDocs =
    employee.selectedRoleDocIds.length +
    employee.selectedAppointmentDocIds.length;

  const outputStatus =
    totalSelectedDocs === 0
      ? "Not selected"
      : "Prepared — requires review";

  const activeDef = SECTIONS.find((s) => s.id === activeSection)!;

  function renderSectionContent() {
    switch (activeSection) {
      case "master-data":
        return (
          <dl className="grid gap-4 sm:grid-cols-2">
            <FieldRow label="Full name" value={employee.fullName} />
            <FieldRow label="Birthday" value={displayDate(employee.birthday)} />
            <FieldRow
              label="Bewacher-ID"
              value={employee.guardIDNumber || "—"}
            />
            <FieldRow
              label="Employee ID"
              value={
                employee.useGuardAsEmployeeId
                  ? `${employee.guardIDNumber || "—"} (from Bewacher-ID)`
                  : employee.employeeIDNumber || "—"
              }
            />
          </dl>
        );

      case "employment":
        return (
          <dl className="grid gap-4 sm:grid-cols-2">
            <FieldRow
              label="Start date"
              value={displayDate(employee.startDate)}
            />
            <FieldRow
              label="Training hours"
              value={employee.trainingHours || "—"}
            />
            <div className="sm:col-span-2">
              <p className="text-xs text-gray-500">
                Edit employment fields via the form above (transitional B7.2
                shell).
              </p>
            </div>
          </dl>
        );

      case "roles":
        return (
          <dl className="grid gap-4 sm:grid-cols-2">
            <FieldRow label="Grundrolle" value={role?.name ?? employee.roleId} />
            <FieldRow label="Role type" value={employee.roleType || "—"} />
            <FieldRow
              label="Zusatzrollen / overlays"
              value={
                overlayNames.length > 0 ? overlayNames.join(", ") : "None selected"
              }
            />
            <div className="sm:col-span-2">
              <p className="text-xs text-gray-500">
                Role and overlay document selection is managed in the form above.
                Assignment context only — not a release decision.
              </p>
            </div>
          </dl>
        );

      case "evidence":
        return <PlaceholderPanel title="Nachweise / Evidence" />;

      case "training":
        return <PlaceholderPanel title="Schulung / Unterweisung" />;

      case "sdl-project":
        return <PlaceholderPanel title="SDL / Projektzuordnung" />;

      case "output":
        return (
          <div className="space-y-4">
            <dl className="grid gap-4 sm:grid-cols-2">
              <FieldRow
                label="Selected role documents"
                value={employee.selectedRoleDocIds.length}
              />
              <FieldRow
                label="Selected overlay documents"
                value={employee.selectedAppointmentDocIds.length}
              />
              <FieldRow label="Package draft status" value={outputStatus} />
              <FieldRow
                label="Last generated"
                value="Not generated (no output history in this slice)"
              />
            </dl>
            <p className="flex items-start gap-2 rounded-lg border border-orange-100 bg-orange-50/60 px-3 py-2 text-xs text-gray-600">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
              Batch ZIP generation uses the queue strip below. Generated documents
              are prepared drafts and require review — not uploaded Nachweise.
            </p>
          </div>
        );

      case "review":
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {greyBadge("Readiness: not evaluated")}
              {greyBadge("Review: open")}
            </div>
            <p className="text-xs text-gray-500">
              Display-only review status (B6.5). ZIP success does not change
              readiness or review badges in this transitional shell.
            </p>
          </div>
        );

      case "notes-open":
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-700">Open items (read-only hints)</p>
            <ul className="list-inside list-disc space-y-1.5 text-xs text-gray-600">
              <li>Evidence upload and checklist — not implemented</li>
              <li>Output history store — not implemented</li>
              <li>SDL / project link persistence — not implemented</li>
              <li>Template footer metadata audit — deferred</li>
            </ul>
            <p className="text-xs text-gray-500">
              Notes editing is not available in this slice.
            </p>
          </div>
        );

      case "history":
        return <PlaceholderPanel title="Verlauf / History" />;

      default:
        return null;
    }
  }

  return (
    <div
      className="mb-8 rounded-2xl border border-violet-200 bg-white shadow-sm"
      role="region"
      aria-label="Employee profile section shell"
    >
      <div className="border-b border-violet-100 bg-linear-to-r from-violet-50/80 to-purple-50/40 px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
          Employee profile sections (B7.2 transitional)
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Static section shell for{" "}
          <span className="font-medium text-gray-900">{employee.fullName}</span>{" "}
          — generator queue data only.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row">
        <nav
          className="flex gap-1 overflow-x-auto border-b border-gray-100 p-2 lg:w-56 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r lg:overflow-x-visible"
          aria-label="Profile sections"
        >
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition-colors sm:text-sm",
                activeSection === section.id
                  ? "bg-violet-100 font-medium text-violet-900"
                  : "text-gray-600 hover:bg-gray-50",
              )}
            >
              <span className="text-violet-500">{section.icon}</span>
              <span>
                <span className="block font-medium">{section.labelDe}</span>
                <span className="block text-[10px] text-gray-500 sm:text-xs">
                  {section.labelEn}
                </span>
              </span>
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1 p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-gray-900">
              {activeDef.labelDe}{" "}
              <span className="font-normal text-gray-500">
                / {activeDef.labelEn}
              </span>
            </h3>
            {activeDef.state === "active" && greyBadge("Active — edit via form")}
            {activeDef.state === "placeholder" && greyBadge("Not implemented")}
            {activeDef.state === "read-only" && greyBadge("Read-only")}
          </div>
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
};

EmployeeProfileSectionShell.displayName = "EmployeeProfileSectionShell";
