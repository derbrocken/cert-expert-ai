"use client";

import React from "react";
import { GraduationCap, RefreshCw, CalendarCheck } from "lucide-react";
import type { Employee } from "@/lib/types/employee";
import type { TrainingTarget } from "./requirement-engine";

/**
 * Schulungs-Soll-Anzeige (Slice 2, Punkt 3 — Layout Variante C).
 *
 * LAUFEND (jährlich, mit Ist/Soll-Balken) vs. EINMALIG (ohne Balken).
 * Soll = Engine (CL-belegt). Ist = manuell erfasst (kein Auto-Summe aus
 * Nachweisen — das ist Slice 3/4). EC-10: rein rechnerisch, KEIN Freigabe-,
 * Auditfähigkeits- oder Einsatzbereitschafts-Status.
 */

type SollStatus =
  | "fachlich prüfen"
  | "offen"
  | "unvollständig"
  | "rechnerisch erreicht";

const STATUS_PILL: Record<SollStatus, string> = {
  "fachlich prüfen": "bg-violet-50 text-violet-900 border-violet-200",
  offen: "bg-amber-50 text-amber-800 border-amber-200",
  unvollständig: "bg-amber-50 text-amber-900 border-amber-200",
  "rechnerisch erreicht": "bg-green-50 text-green-800 border-green-200",
};

function deriveStatus(soll: number | null, ist: number): SollStatus {
  if (soll === null) return "fachlich prüfen";
  if (ist <= 0) return "offen";
  if (ist < soll) return "unvollständig";
  return "rechnerisch erreicht";
}

export interface EmployeeFileTrainingTargetsProps {
  targets: TrainingTarget[];
  employee: Employee;
  onSave?: (employee: Employee) => void;
}

function ClausePill({ clauseId }: { clauseId: string | null }) {
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

export const EmployeeFileTrainingTargets: React.FC<
  EmployeeFileTrainingTargetsProps
> = ({ targets, employee, onSave }) => {
  if (targets.length === 0) return null;

  const laufend = targets.filter((t) => t.period === "jaehrlich");
  const einmalig = targets.filter((t) => t.period !== "jaehrlich");

  const istFor = (t: TrainingTarget): number => {
    if (t.id === "jahres-weiterbildung") {
      return employee.weiterbildungIstUE ?? 0;
    }
    return employee.einmaligIstUE?.[t.id] ?? 0;
  };

  const setIst = (t: TrainingTarget, value: number | undefined) => {
    if (!onSave) return;
    if (t.id === "jahres-weiterbildung") {
      onSave({ ...employee, weiterbildungIstUE: value });
      return;
    }
    const map = { ...(employee.einmaligIstUE ?? {}) };
    if (value === undefined) delete map[t.id];
    else map[t.id] = value;
    onSave({ ...employee, einmaligIstUE: map });
  };

  const renderRow = (t: TrainingTarget, withBar: boolean) => {
    const soll = t.ue;
    const ist = istFor(t);
    const rest = soll === null ? null : Math.max(soll - ist, 0);
    const status = deriveStatus(soll, ist);
    const pct =
      soll && soll > 0 ? Math.min(Math.round((ist / soll) * 100), 100) : 0;

    return (
      <li key={t.id} className="px-3 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm text-[#111827]">{t.label}</p>
              <ClausePill clauseId={t.clauseId} />
            </div>
            <p className="mt-0.5 text-[10px] text-[#9ca3af]">
              Bedingung: {t.trigger}
              {typeof t.dlCap === "number" ? ` · DL ≤ ${t.dlCap}%` : ""}
            </p>
            {t.hint ? (
              <p className="mt-0.5 text-[10px] text-[#6b7280]">{t.hint}</p>
            ) : null}
          </div>
          <span
            className={`inline-flex shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${STATUS_PILL[status]}`}
          >
            {status}
          </span>
        </div>

        {soll === null ? (
          <p className="mt-2 text-xs text-[#6b7280]">
            Kein belegter UE-Wert — fachlich prüfen.
          </p>
        ) : (
          <>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <span className="text-[#374151]">
                Soll:{" "}
                <span className="font-semibold text-[#111827]">{soll} UE</span>
              </span>
              <label className="flex items-center gap-1.5 text-[#374151]">
                Ist:
                <input
                  type="number"
                  min={0}
                  value={
                    t.id === "jahres-weiterbildung"
                      ? (employee.weiterbildungIstUE ?? "")
                      : (employee.einmaligIstUE?.[t.id] ?? "")
                  }
                  onChange={(e) => {
                    const raw = e.target.value.trim();
                    setIst(
                      t,
                      raw === "" ? undefined : Math.max(0, Number(raw)),
                    );
                  }}
                  disabled={!onSave}
                  placeholder="0"
                  className="w-16 rounded-md border border-[#e5e7eb] px-2 py-1 text-sm text-[#111827] focus:border-[#e30613] focus:outline-none"
                />
                <span className="text-[10px] text-[#9ca3af]">UE · manuell erfasst</span>
              </label>
              <span className="text-[#374151]">
                Rest:{" "}
                <span className="font-semibold text-[#111827]">{rest} UE</span>
              </span>
            </div>
            {withBar ? (
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#f1f3f5]">
                <div
                  className={
                    status === "rechnerisch erreicht"
                      ? "h-full rounded-full bg-green-500"
                      : "h-full rounded-full bg-amber-400"
                  }
                  style={{ width: `${pct}%` }}
                />
              </div>
            ) : null}
          </>
        )}
      </li>
    );
  };

  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white">
      <div className="flex items-start justify-between gap-2 border-b border-[#e5e7eb] px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9ca3af]">
            Anforderung
          </p>
          <h4 className="mt-0.5 flex items-center gap-2 text-sm font-semibold text-[#111827]">
            <GraduationCap className="h-3.5 w-3.5 text-[#e30613]" />
            Schulungs-Soll
          </h4>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-md border border-[#e5e7eb] bg-[#fafbfc] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#6b7280]">
          rechnerisch · kein Freigabestatus
        </span>
      </div>

      {laufend.length > 0 ? (
        <div className="border-b border-[#e5e7eb]">
          <p className="flex items-center gap-1.5 px-4 pt-3 text-[10px] font-semibold uppercase tracking-wide text-[#6b7280]">
            <RefreshCw className="h-3 w-3" />
            Laufend (jährlich)
          </p>
          <ul className="divide-y divide-[#f1f3f5]">
            {laufend.map((t) => renderRow(t, true))}
          </ul>
        </div>
      ) : null}

      {einmalig.length > 0 ? (
        <div>
          <p className="flex items-center gap-1.5 px-4 pt-3 text-[10px] font-semibold uppercase tracking-wide text-[#6b7280]">
            <CalendarCheck className="h-3 w-3" />
            Einmalig
          </p>
          <ul className="divide-y divide-[#f1f3f5]">
            {einmalig.map((t) => renderRow(t, false))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

EmployeeFileTrainingTargets.displayName = "EmployeeFileTrainingTargets";
