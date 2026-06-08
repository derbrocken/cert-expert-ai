"use client";

import React from "react";
import { Gauge, CalendarClock, ShieldAlert, Info } from "lucide-react";
import { formatIsoToInput } from "@/lib/utils/date";
import type { RequirementRow } from "./employee-file-requirements";
import {
  computeComplianceStatus,
  overallLabel,
  type ComputedOverall,
} from "./compliance-status";

export interface EmployeeFilePflichtStatusPanelProps {
  /** Engine-abgeleitetes Pflicht-Set (clauseId-belegt). */
  pflichtSet: RequirementRow[];
  /** Engine-abgeleitete Fristen (value = dueDate ISO). */
  fristen: RequirementRow[];
}

const TONE_STYLES: Record<
  ReturnType<typeof overallLabel>["tone"],
  { box: string; dot: string }
> = {
  red: { box: "border-red-200 bg-red-50 text-red-900", dot: "bg-red-500" },
  amber: {
    box: "border-amber-200 bg-amber-50 text-amber-900",
    dot: "bg-amber-500",
  },
  green: {
    box: "border-green-200 bg-green-50 text-green-900",
    dot: "bg-green-500",
  },
  neutral: {
    box: "border-gray-200 bg-gray-50 text-gray-600",
    dot: "bg-gray-400",
  },
};

function formatDue(dueDate?: string): string {
  if (!dueDate) return "Datum offen";
  return formatIsoToInput(dueDate) || dueDate;
}

export const EmployeeFilePflichtStatusPanel: React.FC<
  EmployeeFilePflichtStatusPanelProps
> = ({ pflichtSet, fristen }) => {
  const status = computeComplianceStatus(
    pflichtSet.map((r) => ({ status: r.status })),
    fristen.map((r) => ({
      label: r.label,
      status: r.status,
      dueDate: r.value,
    })),
  );

  const overall: ComputedOverall = status.overall;
  const { label, tone } = overallLabel(overall);
  const toneStyle = TONE_STYLES[tone];

  return (
    <section className="border-b border-[#e5e7eb] bg-white px-5 py-4">
      <div className="mb-3 flex items-center gap-2">
        <Gauge className="h-4 w-4 text-[#e30613]" />
        <h3 className="text-sm font-semibold text-[#111827]">
          Pflicht-Status (rechnerisch)
        </h3>
      </div>

      <div className={`rounded-lg border px-3 py-2.5 ${toneStyle.box}`}>
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${toneStyle.dot}`}
            aria-hidden
          />
          <p className="text-sm font-semibold">{label}</p>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
            {status.counts.kritisch} kritisch (fehlt / abgelaufen)
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
            {status.counts.offen} offen / in Prüfung
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
            {status.counts.erfuellt} rechnerisch erfüllt
          </span>
        </div>
      </div>

      {status.nextDeadline ? (
        <p
          className={`mt-2 flex items-center gap-2 text-xs ${
            status.nextDeadline.overdue
              ? "text-orange-800"
              : "text-[#6b7280]"
          }`}
        >
          {status.nextDeadline.overdue ? (
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <CalendarClock className="h-3.5 w-3.5 shrink-0" />
          )}
          <span>
            {status.nextDeadline.overdue ? "Überfällig" : "Nächste Frist"}:{" "}
            <span className="font-medium">{status.nextDeadline.label}</span> ·{" "}
            {formatDue(status.nextDeadline.dueDate)}
          </span>
        </p>
      ) : null}

      <p className="mt-2 flex items-start gap-2 text-[10px] text-[#9ca3af]">
        <Info className="mt-0.5 h-3 w-3 shrink-0" />
        <span>
          Rechnerischer Arbeitsstand aus den erfassten Angaben — keine
          Freigabe-, Auditfähigkeits- oder Zertifizierungsaussage. Eingehende
          Nachweise gelten als ungeprüft.
        </span>
      </p>
    </section>
  );
};

EmployeeFilePflichtStatusPanel.displayName = "EmployeeFilePflichtStatusPanel";
