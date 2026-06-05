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
    state: "read-only",
  },
  {
    id: "evidence",
    labelDe: "Nachweise",
    labelEn: "Evidence",
    icon: <FileCheck className="h-4 w-4" />,
    state: "read-only",
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
    state: "read-only",
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

interface CategoryRow {
  id: string;
  labelDe: string;
  labelEn: string;
  status: string;
  hint: string;
}

const ROLE_TAXONOMY_BASE = [
  { code: "SMA", label: "Sicherheitsmitarbeiter / Sicherheitsmitarbeiterin" },
  { code: "GF", label: "Geschäftsführung / Geschäftsführer" },
  { code: "BK", label: "Bürokraft / Verwaltung / Backoffice" },
] as const;

const ROLE_TAXONOMY_LEADERSHIP = [
  { code: "FK", label: "Führungskraft" },
  { code: "EL", label: "Einsatzleiter" },
  { code: "OL", label: "Objektleiter" },
  { code: "SL", label: "Schichtleiter" },
] as const;

function AssignmentCategoryList({ categories }: { categories: CategoryRow[] }) {
  return (
    <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-gray-50/40">
      {categories.map((cat) => (
        <li
          key={cat.id}
          className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {cat.labelDe}{" "}
              <span className="font-normal text-gray-500">/ {cat.labelEn}</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">{cat.hint}</p>
          </div>
          <div className="shrink-0">{greyBadge(cat.status)}</div>
        </li>
      ))}
    </ul>
  );
}

function RoleAssignmentStaticOverview({
  employee,
  roleName,
  overlayNames,
  totalSelectedDocs,
}: {
  employee: Employee;
  roleName: string;
  overlayNames: string[];
  totalSelectedDocs: number;
}) {
  const hasOverlays = overlayNames.length > 0;
  const hasTrainingSelection = employee.selectedAppointmentDocIds.length > 0;

  const categories: CategoryRow[] = [
    {
      id: "grundrolle",
      labelDe: "Grundrolle / Base role",
      labelEn: "Base role",
      status: "Base role not evaluated",
      hint: `Queue template role: ${roleName} (${employee.roleId}). Static placeholder — catalog reference only.`,
    },
    {
      id: "zusatzrolle",
      labelDe: "Zusatzrolle / Overlay role",
      labelEn: "Overlay role",
      status: hasOverlays ? "Zusatzrolle not evaluated" : "Not assigned",
      hint: hasOverlays
        ? `Overlays: ${overlayNames.join(", ")} — assignment placeholder only.`
        : "No overlay appointments selected on queue record.",
    },
    {
      id: "qualification",
      labelDe: "Qualifikationsbezug",
      labelEn: "Qualification relevance",
      status: "Not evaluated",
      hint: `Role context ${roleName} — no qualification engine in this slice.`,
    },
    {
      id: "training",
      labelDe: "Schulung / Unterweisungsbezug",
      labelEn: "Training / instruction relevance",
      status: hasTrainingSelection ? "Requires review" : "Open",
      hint: hasTrainingSelection
        ? `${employee.selectedAppointmentDocIds.length} overlay doc(s) in generator selection — review required later.`
        : "No training overlay documents selected.",
    },
    {
      id: "generated",
      labelDe: "Erzeugte Dokumente Bezug",
      labelEn: "Generated document relevance",
      status:
        totalSelectedDocs === 0 ? "Not selected" : "Prepared — requires review",
      hint: `${employee.selectedRoleDocIds.length} role + ${employee.selectedAppointmentDocIds.length} overlay doc(s) selected — generator relevance only.`,
    },
    {
      id: "manual-review",
      labelDe: "Manuelle Prüfung / Entscheidung",
      labelEn: "Manual review / decision required",
      status: "Review required",
      hint: "Review required later. No Freigabe decision in this slice.",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {greyBadge("Static placeholder")}
        {greyBadge("Readiness: not evaluated")}
      </div>

      <p className="flex items-start gap-2 rounded-lg border border-indigo-100 bg-indigo-50/60 px-3 py-2 text-xs text-gray-600">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
        Role / assignment overview (static — B7.6). Static placeholder only. No
        assignment saving in this slice. No Freigabe decision in this slice. Review
        required later before any assignment can affect readiness. ZIP generation
        does not change assignment, evidence or readiness status. No DIN decision
        matrix in this slice.
      </p>

      <AssignmentCategoryList categories={categories} />

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Cert-Expert Tool 2 role taxonomy (static reference)
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Role placeholder labels only — do not trigger assignment, Freigabe, or
          readiness changes.
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-gray-700">
              Base / organizational roles
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-gray-600">
              {ROLE_TAXONOMY_BASE.map((r) => (
                <li key={r.code}>
                  <span className="font-mono font-medium text-gray-800">
                    {r.code}
                  </span>
                  {" — "}
                  {r.label}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-700">
              Leadership / function roles
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-gray-600">
              {ROLE_TAXONOMY_LEADERSHIP.map((r) => (
                <li key={r.code}>
                  <span className="font-mono font-medium text-gray-800">
                    {r.code}
                  </span>
                  {" — "}
                  {r.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function SdlProjectAssignmentStaticOverview({
  roleName,
}: {
  roleName: string;
}) {
  const categories: CategoryRow[] = [
    {
      id: "sdl-77200-1",
      labelDe: "DIN 77200-1 SDL Pool",
      labelEn: "DIN 77200-1 SDL pool",
      status: "Not implemented",
      hint: "No SDL rule engine in this slice. Static placeholder.",
    },
    {
      id: "sdl-77200-2",
      labelDe: "DIN 77200-2 Sonder-SDL",
      labelEn: "DIN 77200-2 special SDL context",
      status: "Not implemented",
      hint: "Special SDL context not linked — no persistence in this slice.",
    },
    {
      id: "project",
      labelDe: "Projekt / Objektzuordnung",
      labelEn: "Project / object assignment",
      status: "Not assigned",
      hint: "No project or object ID on queue record. Assignment placeholder.",
    },
    {
      id: "object-instruction",
      labelDe: "Objektbezogene Unterweisung",
      labelEn: "Object-specific instruction requirement",
      status: "Not applicable",
      hint: `Role context ${roleName} — object instruction requirement not evaluated.`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {greyBadge("Static placeholder")}
        {greyBadge("Readiness: not evaluated")}
      </div>

      <p className="flex items-start gap-2 rounded-lg border border-teal-100 bg-teal-50/60 px-3 py-2 text-xs text-gray-600">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
        SDL / project assignment overview (static — B7.6). Static placeholder only.
        No SDL rule engine in this slice. No assignment saving in this slice. No
        project authorization in this slice. ZIP generation does not change
        assignment, evidence or readiness status.
      </p>

      <AssignmentCategoryList categories={categories} />
    </div>
  );
}

function GeneratorOutputStaticOverview({
  employee,
  roleName,
  overlayNames,
  totalSelectedDocs,
}: {
  employee: Employee;
  roleName: string;
  overlayNames: string[];
  totalSelectedDocs: number;
}) {
  const hasRoleDocs = employee.selectedRoleDocIds.length > 0;
  const hasTrainingSelection = employee.selectedAppointmentDocIds.length > 0;

  const categories: CategoryRow[] = [
    {
      id: "standardpersonalakte",
      labelDe: "Standardpersonalakte",
      labelEn: "Employee file package",
      status: totalSelectedDocs === 0 ? "Not selected" : "Prepared",
      hint: `${roleName}: ${employee.selectedRoleDocIds.length} role + ${employee.selectedAppointmentDocIds.length} overlay doc(s) in selection — employee file package draft only.`,
    },
    {
      id: "datenschutz",
      labelDe: "Datenschutzerklärung",
      labelEn: "Data protection declaration",
      status: hasRoleDocs ? "Output placeholder" : "Not selected",
      hint: "Role template may include Datenschutz output — prepared draft requires review later.",
    },
    {
      id: "verschwiegenheit",
      labelDe: "Verschwiegenheitserklärung",
      labelEn: "Confidentiality declaration",
      status: hasRoleDocs ? "Output placeholder" : "Not selected",
      hint: "Vertraulichkeit-related template output — static placeholder; not uploaded proof.",
    },
    {
      id: "allgemeine-unterweisung",
      labelDe: "Allgemeine Mitarbeiterunterweisung",
      labelEn: "General employee instruction",
      status: "Open",
      hint: "General instruction output category — no separate output tracking in this slice.",
    },
    {
      id: "objekt-unterweisung",
      labelDe: "Objektbezogene Unterweisung",
      labelEn: "Object-specific instruction",
      status: "Not applicable",
      hint: "No object ID on queue record — object-specific instruction output not evaluated.",
    },
    {
      id: "schulungsnachweis",
      labelDe: "Schulungsnachweis",
      labelEn: "Training evidence output",
      status: hasTrainingSelection ? "Requires review" : "Open",
      hint: hasTrainingSelection
        ? `${employee.selectedAppointmentDocIds.length} overlay doc(s) selected — training output relevance only.`
        : "No overlay documents selected for training-related output.",
    },
    {
      id: "zertifikat",
      labelDe: "Zertifikat",
      labelEn: "Certificate output",
      status: "Not implemented",
      hint: "Certificate output category — no certificate generator branch in this slice.",
    },
    {
      id: "sammelunterweisung",
      labelDe: "Sammelunterweisung",
      labelEn: "Combined instruction package",
      status: "Not implemented",
      hint: "Combined instruction package — static placeholder only.",
    },
    {
      id: "sammeldokument",
      labelDe: "Sammeldokument (Mehrfachmitarbeiter)",
      labelEn: "Multi-employee document package",
      status: "Not implemented",
      hint: "Batch queue supports per-employee ZIP only — multi-employee Sammeldokument not in this slice.",
    },
    {
      id: "zip-ausgabe",
      labelDe: "ZIP-Ausgabe",
      labelEn: "ZIP export package",
      status:
        totalSelectedDocs === 0 ? "Not selected" : "ZIP available",
      hint: `Use batch generate strip below. No output history in this slice. Overlays: ${overlayNames.length > 0 ? overlayNames.join(", ") : "none"}.`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {greyBadge("Static placeholder")}
        {greyBadge("Readiness: not evaluated")}
        {greyBadge("No output history")}
      </div>

      <p className="flex items-start gap-2 rounded-lg border border-orange-100 bg-orange-50/60 px-3 py-2 text-xs text-gray-600">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
        Generator output overview (static — B7.8). Generated outputs are prepared
        documents, not uploaded Nachweise. Review required later. Generated outputs
        do not create Freigabe or readiness. ZIP success does not change evidence,
        role/SDL assignment or readiness status. No generator change in this slice.
        This overview is not output history and not a DIN decision matrix.
      </p>

      <AssignmentCategoryList categories={categories} />
    </div>
  );
}

function ReadinessAmpelStaticOverview({
  employee,
  roleName,
  overlayNames,
  totalSelectedDocs,
}: {
  employee: Employee;
  roleName: string;
  overlayNames: string[];
  totalSelectedDocs: number;
}) {
  const categories: CategoryRow[] = [
    {
      id: "mitarbeiterakte",
      labelDe: "Mitarbeiterakte / Employee file",
      labelEn: "Employee file",
      status: "Not evaluated",
      hint: `Queue record ${employee.fullName || "—"} — no file completeness evaluation in this slice.`,
    },
    {
      id: "evidence",
      labelDe: "Nachweise / Evidence",
      labelEn: "Evidence",
      status: "Not evaluated",
      hint: "Cross-ref B7.4 static overview — no automatic evaluation. Evidence upload not implemented.",
    },
    {
      id: "role",
      labelDe: "Rollenbezug / Role assignment",
      labelEn: "Role assignment",
      status: "Not evaluated",
      hint: `Grundrolle ${roleName}; overlays: ${overlayNames.length > 0 ? overlayNames.join(", ") : "none"} — assignment ≠ readiness.`,
    },
    {
      id: "sdl-project",
      labelDe: "SDL / Projektzuordnung",
      labelEn: "SDL / project assignment",
      status: "Not evaluated",
      hint: "Cross-ref B7.6 SDL/project rows — no SDL readiness engine in this slice.",
    },
    {
      id: "generated",
      labelDe: "Generierte Dokumente",
      labelEn: "Generated documents",
      status: "Not evaluated",
      hint: `${totalSelectedDocs} doc(s) in generator selection — prepared output does not imply readiness.`,
    },
    {
      id: "manual-review",
      labelDe: "Fachliche Prüfung",
      labelEn: "Manual review",
      status: "Manual review required",
      hint: "No readiness decision in this slice. Human review required before any future readiness gate.",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {greyBadge("Static placeholder")}
        {greyBadge("Readiness: not evaluated")}
        {greyBadge("No automatic evaluation")}
      </div>

      <p className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2 text-xs text-gray-600">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-500" />
        Readiness / Ampel display boundary (static — B7.10). Grey display only — no live
        traffic-light evaluation. No readiness calculation in this slice. No Freigabe
        decision in this slice. ZIP success does not change readiness, evidence,
        assignment or generated-output status. This is not a DIN decision matrix.
      </p>

      <AssignmentCategoryList categories={categories} />

      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/60 p-4 text-center">
        <p className="text-xs font-medium text-gray-600">
          Ampel boundary (display only — B7.10)
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Neutral grey state only. No automatic evaluation. No readiness decision.
        </p>
        <div className="mt-3 flex justify-center gap-2">
          {greyBadge("Not evaluated")}
          {greyBadge("Static placeholder")}
        </div>
      </div>
    </div>
  );
}

interface EvidenceCategoryRow {
  id: string;
  labelDe: string;
  labelEn: string;
  status: string;
  hint: string;
}

function EvidenceStaticOverview({
  employee,
  roleName,
  overlayNames,
  totalSelectedDocs,
}: {
  employee: Employee;
  roleName: string;
  overlayNames: string[];
  totalSelectedDocs: number;
}) {
  const hasGuardId = Boolean(employee.guardIDNumber?.trim());
  const hasTrainingSelection = employee.selectedAppointmentDocIds.length > 0;

  const categories: EvidenceCategoryRow[] = [
    {
      id: "identity",
      labelDe: "Identität / Stammdaten",
      labelEn: "Identity / personal master data",
      status: employee.fullName && employee.birthday ? "Not provided" : "Open",
      hint: `Queue fields: ${employee.fullName || "—"}, birthday ${displayDate(employee.birthday)} — field presence is not proof.`,
    },
    {
      id: "employment",
      labelDe: "Beschäftigung / Vertrag",
      labelEn: "Employment / contract-related documents",
      status: "Open",
      hint: `Start date ${displayDate(employee.startDate)} — no contract upload in this slice.`,
    },
    {
      id: "register",
      labelDe: "Bewacherregister",
      labelEn: "Register evidence",
      status: hasGuardId ? "Requires review" : "Not provided",
      hint: hasGuardId
        ? `Bewacher-ID ${employee.guardIDNumber} on file — register copy not uploaded.`
        : "No Bewacher-ID on queue record.",
    },
    {
      id: "qualification",
      labelDe: "§34a / Sachkunde",
      labelEn: "Qualification evidence",
      status: "Not evaluated",
      hint: `Role context: ${roleName} — certificate upload not implemented.`,
    },
    {
      id: "dataprotection",
      labelDe: "Datenschutz / Vertraulichkeit",
      labelEn: "Data protection / confidentiality",
      status: "Open",
      hint: "Generator may produce related drafts — prepared output requires review.",
    },
    {
      id: "firstaid",
      labelDe: "Erste Hilfe / Zusatzqualifikation",
      labelEn: "First aid / additional qualification",
      status: "Not implemented",
      hint: "Placeholder category — no checklist persistence.",
    },
    {
      id: "training",
      labelDe: "Schulung / Unterweisung",
      labelEn: "Training / instruction evidence",
      status: hasTrainingSelection ? "Requires review" : "Open",
      hint: hasTrainingSelection
        ? `${employee.selectedAppointmentDocIds.length} overlay doc(s) selected for generation — not uploaded proof.`
        : "No overlay documents selected.",
    },
    {
      id: "role",
      labelDe: "Rolle / Zusatzrolle",
      labelEn: "Role / overlay evidence",
      status: "Requires review",
      hint: `Grundrolle ${roleName}; overlays: ${overlayNames.length > 0 ? overlayNames.join(", ") : "none"}.`,
    },
    {
      id: "sdl",
      labelDe: "SDL / projektspezifisch",
      labelEn: "SDL / project-specific evidence",
      status: "Not implemented",
      hint: "SDL and project links not persisted in this slice.",
    },
    {
      id: "generated",
      labelDe: "Erzeugte Mitarbeiterakte-Dokumente",
      labelEn: "Generated employee file documents",
      status:
        totalSelectedDocs === 0
          ? "Not selected"
          : "Prepared — requires review",
      hint: `${employee.selectedRoleDocIds.length} role + ${employee.selectedAppointmentDocIds.length} overlay doc(s) in generator selection — not uploaded Nachweise.`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {greyBadge("Section: read-only placeholders")}
        {greyBadge("Readiness: not evaluated")}
      </div>

      <p className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2 text-xs text-gray-600">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
        Evidence requirement overview (static — B7.4). Entries are placeholders
        only. Evidence is not accepted automatically. Review is required before
        any evidence can affect readiness. ZIP generation does not change
        evidence or readiness status. This overview is not a final data model
        and not a DIN decision matrix.
      </p>

      <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-gray-50/40">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {cat.labelDe}{" "}
                <span className="font-normal text-gray-500">/ {cat.labelEn}</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">{cat.hint}</p>
            </div>
            <div className="shrink-0">{greyBadge(cat.status)}</div>
          </li>
        ))}
      </ul>
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
          <RoleAssignmentStaticOverview
            employee={employee}
            roleName={role?.name ?? employee.roleId}
            overlayNames={overlayNames}
            totalSelectedDocs={totalSelectedDocs}
          />
        );

      case "evidence":
        return (
          <EvidenceStaticOverview
            employee={employee}
            roleName={role?.name ?? employee.roleId}
            overlayNames={overlayNames}
            totalSelectedDocs={totalSelectedDocs}
          />
        );

      case "training":
        return <PlaceholderPanel title="Schulung / Unterweisung" />;

      case "sdl-project":
        return (
          <SdlProjectAssignmentStaticOverview
            roleName={role?.name ?? employee.roleId}
          />
        );

      case "output":
        return (
          <GeneratorOutputStaticOverview
            employee={employee}
            roleName={role?.name ?? employee.roleId}
            overlayNames={overlayNames}
            totalSelectedDocs={totalSelectedDocs}
          />
        );

      case "review":
        return (
          <ReadinessAmpelStaticOverview
            employee={employee}
            roleName={role?.name ?? employee.roleId}
            overlayNames={overlayNames}
            totalSelectedDocs={totalSelectedDocs}
          />
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
