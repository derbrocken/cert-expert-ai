"use client";

import React from "react";
import {
  User,
  FileCheck,
  MapPin,
  AlertCircle,
  GraduationCap,
  ListChecks,
  CalendarClock,
  Info,
  ShieldCheck,
} from "lucide-react";
import { formatIsoToInput } from "@/lib/utils/date";
import type { Employee, Role, Appointment } from "@/lib/types/employee";
import { roleLabelDe } from "./employee-display-labels";
import {
  getEmployeeFileSummary,
  type RequirementRow,
} from "./employee-file-requirements";
import { resolveRoleClasses } from "./requirement-engine";
import {
  BEWACHUNG_CLASS_OPTIONS,
  NICHT_BEWACHUNG_CLASS_OPTIONS,
} from "./employee-stammdaten-options";
import { EmployeeFileStatusBadge } from "./EmployeeFileStatusBadge";
import { EmployeeFilePflichtStatusPanel } from "./EmployeeFilePflichtStatusPanel";
import { EmployeeFileTrainingTargets } from "./EmployeeFileTrainingTargets";

/**
 * Read-only Akte-/Vorzeige-Übersicht (Queue B / Pt 1).
 *
 * Reine Präsentation der bereits berechneten `getEmployeeFileSummary`-Ausgabe —
 * KEINE Engine-/Norm-/UE-Änderung, KEINE Bearbeiten-Affordances (keine Stifte,
 * Edit-Tabellen oder Upload-Knöpfe). Single Source of Truth = dieselbe Summary
 * wie `EmployeeFileDossierView` (nicht neu/parallel berechnen).
 * EC-10: rein rechnerischer Stand, kein Freigabe-/Auditfähigkeitsstatus.
 */

export interface EmployeeFileOverviewProps {
  employee: Employee;
  roles: Role[];
  appointments: Appointment[];
  companyName?: string;
}

function formatValue(value: string | undefined): string {
  if (!value) return "—";
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return formatIsoToInput(value) || value;
  }
  return value;
}

// Read-only Variante der DossierView-Helfer (lokal dupliziert — keine
// Logikänderung, nur Präsentation; DossierView exportiert sie nicht).
function ClauseBadge({ clauseId }: { clauseId?: string | null }) {
  if (clauseId === undefined) return null;
  if (clauseId === null) {
    return (
      <span className="inline-flex shrink-0 rounded border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-violet-800">
        ohne CL
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 rounded border border-[#e5e7eb] bg-[#f9fafb] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#6b7280]">
      {clauseId}
    </span>
  );
}

function RequirementTable({ rows }: { rows: RequirementRow[] }) {
  return (
    <ul className="divide-y divide-[#e5e7eb] rounded-lg border border-[#e5e7eb]">
      {rows.map((row) => (
        <li
          key={row.id}
          className="flex flex-col gap-1 px-3 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm text-[#111827]">{row.label}</p>
              <ClauseBadge clauseId={row.clauseId} />
            </div>
            {row.value ? (
              <p className="mt-0.5 text-xs text-[#374151]">
                {formatValue(row.value)}
              </p>
            ) : null}
            {row.trigger ? (
              <p className="mt-0.5 text-[10px] text-[#9ca3af]">
                Bedingung: {row.trigger}
              </p>
            ) : null}
            {row.hint ? (
              <p className="mt-0.5 text-[10px] text-[#6b7280]">{row.hint}</p>
            ) : null}
          </div>
          <EmployeeFileStatusBadge status={row.status} />
        </li>
      ))}
    </ul>
  );
}

function ReadOnlySectionHeader({
  icon,
  title,
  subtitle,
  level,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  level?: "bedingung" | "anforderung" | "nachweis";
}) {
  const levelLabel =
    level === "bedingung"
      ? "Bedingung"
      : level === "anforderung"
        ? "Anforderung"
        : level === "nachweis"
          ? "Nachweis"
          : null;

  return (
    <div className="mb-3">
      {levelLabel ? (
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9ca3af]">
          {levelLabel}
        </p>
      ) : null}
      <h3 className="flex items-center gap-2 text-sm font-semibold text-[#111827]">
        {icon}
        {title}
      </h3>
      {subtitle ? (
        <p className="mt-1 text-xs text-[#6b7280]">{subtitle}</p>
      ) : null}
    </div>
  );
}

const ROLE_CLASS_LABELS: Record<string, string> = Object.fromEntries(
  [...BEWACHUNG_CLASS_OPTIONS, ...NICHT_BEWACHUNG_CLASS_OPTIONS].map((o) => [
    o.id,
    o.name,
  ]),
);

export const EmployeeFileOverview: React.FC<EmployeeFileOverviewProps> = ({
  employee,
  roles,
  appointments,
  companyName = "",
}) => {
  const role = roles.find((r) => r.id === employee.roleId);
  const apiRoleName = role?.name ?? employee.roleId;

  // Single Source of Truth — exakt wie DossierView (Z. 238–243).
  const summary = getEmployeeFileSummary(
    employee,
    appointments,
    companyName,
    roleLabelDe(employee.roleId, apiRoleName),
  );

  const roleClasses = resolveRoleClasses({
    roleClasses: employee.roleClasses,
    roleClass: employee.roleClass,
    zusatzBewachungNiveau: employee.zusatzBewachungNiveau,
    roleType: employee.roleType,
  });

  return (
    <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
      <div className="border-b border-[#e5e7eb] bg-linear-to-r from-[rgba(227,6,19,0.06)] to-white px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#e30613]">
              Mitarbeiterakte · Übersicht
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#111827]">
              {employee.fullName || "Unbenannt"}
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              {summary.roleName}
              {employee.roleType ? ` · ${employee.roleType}` : ""}
            </p>
            {roleClasses.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {roleClasses.map((rc) => (
                  <span
                    key={rc}
                    className="inline-flex items-center rounded-md border border-[rgba(227,6,19,0.35)] bg-[rgba(227,6,19,0.06)] px-2 py-0.5 text-[10px] font-medium text-[#b80510]"
                  >
                    {ROLE_CLASS_LABELS[rc] ?? rc}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#e5e7eb] bg-[#fafbfc] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-[#6b7280]">
            <ShieldCheck className="h-3.5 w-3.5" />
            rechnerisch · kein Freigabestatus
          </span>
        </div>
        <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6b7280]">
          <div>
            <span className="font-medium text-[#374151]">
              {summary.missingPflichtangaben}
            </span>{" "}
            fehlende Pflichtangaben
          </div>
          <div>
            <span className="font-medium text-[#374151]">
              {summary.missingNachweise}
            </span>{" "}
            offene Nachweise
          </div>
          <div>
            <span className="font-medium text-[#374151]">
              {summary.fachlichPruefen}
            </span>{" "}
            fachlich prüfen
          </div>
        </dl>
      </div>

      <EmployeeFilePflichtStatusPanel
        pflichtSet={summary.pflichtSet}
        fristen={summary.fristen}
      />

      <div className="grid gap-0 divide-y divide-[#e5e7eb]">
        {/* Person & Rolle (read-only) */}
        <section className="p-5">
          <ReadOnlySectionHeader
            icon={<User className="h-4 w-4 text-[#e30613]" />}
            title="Person & Rolle"
            subtitle="Erfasste Pflichtangaben — Anzeige"
            level="bedingung"
          />
          <RequirementTable rows={summary.personUndRollePflichtangaben} />
        </section>

        {/* Pflichtnachweise (read-only Status) */}
        <section className="p-5">
          <ReadOnlySectionHeader
            icon={<FileCheck className="h-4 w-4 text-[#e30613]" />}
            title="Pflichtnachweise"
            subtitle="Dokumente / Nachweisgruppen — Status (Anzeige). Eingehende Nachweise gelten als ungeprüft."
            level="nachweis"
          />
          {summary.pflichtnachweise.length > 0 ? (
            <RequirementTable rows={summary.pflichtnachweise} />
          ) : (
            <p className="rounded-lg border border-dashed border-[#e5e7eb] px-3 py-4 text-sm text-[#6b7280]">
              Keine Pflichtnachweise abgeleitet.
            </p>
          )}
        </section>

        {/* Schulung & Unterweisung (read-only) */}
        <section className="p-5">
          <ReadOnlySectionHeader
            icon={<GraduationCap className="h-4 w-4 text-[#e30613]" />}
            title="Schulung & Unterweisung"
            subtitle="Verpflichtende Qualifikationen und Anforderungen"
            level="anforderung"
          />
          <RequirementTable rows={summary.schulungUnterweisung} />
        </section>

        {/* Geltungsbereich (read-only) */}
        <section className="p-5">
          <ReadOnlySectionHeader
            icon={<MapPin className="h-4 w-4 text-[#e30613]" />}
            title="Geltungsbereich / Einsatzkontext"
            subtitle="Anwendung und Einsatzkontext"
            level="bedingung"
          />
          <RequirementTable rows={summary.geltungsbereich} />
        </section>

        {/* Pflicht-Set + UE-Soll/Ist + Fristen (read-only) */}
        <section className="p-5">
          <ReadOnlySectionHeader
            icon={<ListChecks className="h-4 w-4 text-[#e30613]" />}
            title="Pflicht-Set (abgeleitet)"
            subtitle="Automatisch aus Rolle × Beauftragung × SDL × Beschäftigungsart × Dienstfahrzeug — jede Pflicht mit Norm-Fundstelle (CL-xx)"
            level="anforderung"
          />
          {summary.pflichtSet.length > 0 ? (
            <RequirementTable rows={summary.pflichtSet} />
          ) : (
            <p className="rounded-lg border border-dashed border-[#e5e7eb] px-3 py-4 text-sm text-[#6b7280]">
              Kein Pflicht-Set ableitbar.
            </p>
          )}

          {summary.schulungsSoll.length > 0 ? (
            <div className="mt-6">
              {/* onSave NICHT übergeben → Ist-Eingaben disabled (read-only). */}
              <EmployeeFileTrainingTargets
                targets={summary.schulungsSoll}
                employee={employee}
              />
            </div>
          ) : null}

          {summary.fristen.length > 0 ? (
            <div className="mt-6">
              <ReadOnlySectionHeader
                icon={<CalendarClock className="h-3.5 w-3.5 text-[#e30613]" />}
                title="Fristen / Termine"
                subtitle="Sachkunde 6 Monate, Erste Hilfe 2 J., Brandschutz 3 J."
                level="anforderung"
              />
              <RequirementTable rows={summary.fristen} />
            </div>
          ) : null}

          {summary.engineHinweise.length > 0 ? (
            <ul className="mt-4 space-y-1.5">
              {summary.engineHinweise.map((h, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-md border border-[#e5e7eb] bg-[#fafbfc] px-2.5 py-2 text-[11px] text-[#6b7280]"
                >
                  <Info className="mt-0.5 h-3 w-3 shrink-0 text-[#9ca3af]" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        {/* Offene Punkte (read-only) */}
        <section className="bg-[#fafbfc] p-5">
          <ReadOnlySectionHeader
            icon={<AlertCircle className="h-4 w-4 text-amber-600" />}
            title="Offene Punkte / Prüfbedarf"
            subtitle="Konsolidiert — fehlende Angaben, Nachweise, Unterweisungen, scope-abhängige Prüfung"
          />
          {summary.openIssues.length === 0 ? (
            <p className="text-sm text-[#6b7280]">
              Keine offenen Punkte aus den erfassten Stammdaten abgeleitet.
            </p>
          ) : (
            <ul className="max-h-56 space-y-1.5 overflow-auto">
              {summary.openIssues.map((issue) => (
                <li
                  key={issue.id}
                  className="flex items-start justify-between gap-2 rounded-md border border-[#e5e7eb] bg-white px-2.5 py-2"
                >
                  <span className="text-xs text-[#111827]">{issue.label}</span>
                  <EmployeeFileStatusBadge status={issue.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Footer: EC-10-Disclaimer */}
        <section className="border-t border-[#e5e7eb] bg-white px-5 py-3">
          <p className="flex items-start gap-2 text-xs text-[#6b7280]">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              Rechnerischer Stand aus den erfassten Angaben — kein Freigabe-,
              Auditfähigkeits- oder Zertifizierungsstatus. Eingehende Nachweise
              gelten als ungeprüft.
            </span>
          </p>
        </section>
      </div>
    </div>
  );
};

EmployeeFileOverview.displayName = "EmployeeFileOverview";
