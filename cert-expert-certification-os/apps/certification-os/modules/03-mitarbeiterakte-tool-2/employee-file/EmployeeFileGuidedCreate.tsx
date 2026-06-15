"use client";

import React from "react";
import { Check, Circle, CircleDot } from "lucide-react";
import type { Employee, Role, Appointment } from "@/lib/types/employee";
import {
  EmployeeFilePersonRolleEditTable,
  type PersonRolleChapterId,
} from "./EmployeeFilePersonRolleEditTable";
import {
  getEmployeeFileSummary,
  splitFullName,
} from "./employee-file-requirements";
import { roleLabelDe } from "./employee-display-labels";

/**
 * M4 / §3.3 — Vertikaler, geführter Anlege-Fluss für „Neue Person".
 *
 * Baut auf der bestehenden S1b-Inline-Anlegen-Basis auf: derselbe Draft
 * (`employee` = `editingEmployee`), derselbe gepufferte Speicher-Pfad
 * (`onSavePerson` = `handleSavePerson` puffert im Creating-Modus nur),
 * dieselben Persistenz-Knöpfe (`onCommit` = `handleCommitDraft`,
 * `onDiscard` = `handleBackToOverview`). KEINE neue Anlege-Maschinerie —
 * nur eine geführte vertikale Hülle um die schon vorhandene kapitelfähige
 * Edit-Form (`EmployeeFilePersonRolleEditTable`).
 *
 * Sichtbarer Fortschritt durch die 6 Kapitel (① Stammdaten → ② Beschäftigung
 * → ③ Rolle & Norm → ④ SDL → ⑤ Bestellungen → ⑥ Quali), damit Pflicht-
 * (fullName/birthday/startDate/roleId) und Norm-Felder nicht vergessen werden.
 * Persistenz erst per „Person speichern" (kein Auto-Speichern beim Tippen,
 * S1b-Lehre). EC-09/EC-10 unberührt: reine Interaktions-/Anzeige-Schicht.
 */
export interface EmployeeFileGuidedCreateProps {
  employee: Employee;
  roles: Role[];
  appointments: Appointment[];
  companyName: string;
  onSavePerson: (employee: Employee) => void;
  onCommit: () => void;
  onDiscard: () => void;
}

interface GuidedStep {
  key: PersonRolleChapterId;
  no: string;
  label: string;
  /** Erfüllt, wenn alle Pflicht-/Leitfelder dieses Kapitels gesetzt sind. */
  isComplete: (employee: Employee) => boolean;
  /** True = dieses Kapitel enthält ein Zod-Pflichtfeld (rot, wenn leer). */
  hasRequired: boolean;
}

const STEPS: GuidedStep[] = [
  {
    key: "stammdaten",
    no: "①",
    label: "Stammdaten",
    hasRequired: true,
    isComplete: (e) => {
      const { vorname, nachname } = splitFullName(e.fullName);
      return Boolean(vorname.trim() && nachname.trim() && e.birthday?.trim());
    },
  },
  {
    key: "beschaeftigung",
    no: "②",
    label: "Beschäftigung",
    hasRequired: true,
    isComplete: (e) => Boolean(e.startDate?.trim()),
  },
  {
    key: "rolle-norm",
    no: "③",
    label: "Rolle & Norm-Klasse",
    hasRequired: true,
    isComplete: (e) => Boolean(e.roleId?.trim()),
  },
  {
    key: "sdl",
    no: "④",
    label: "Geltungsbereich (SDL)",
    hasRequired: false,
    isComplete: (e) => (e.sdlScopes ?? []).length > 0,
  },
  {
    key: "bestellungen",
    no: "⑤",
    label: "Bestellungen",
    hasRequired: false,
    isComplete: (e) => (e.appointmentIds ?? []).length > 0,
  },
  {
    key: "quali",
    no: "⑥",
    label: "Qualifikationen & Fristen",
    hasRequired: false,
    isComplete: (e) =>
      (e.qualifications ?? []).length > 0 || Boolean(e.qualification?.trim()),
  },
];

export const EmployeeFileGuidedCreate: React.FC<
  EmployeeFileGuidedCreateProps
> = ({
  employee,
  roles,
  appointments,
  companyName,
  onSavePerson,
  onCommit,
  onDiscard,
}) => {
  const apiRoleName =
    roles.find((r) => r.id === employee.roleId)?.name ?? employee.roleId;
  const summary = getEmployeeFileSummary(
    employee,
    appointments,
    companyName,
    roleLabelDe(employee.roleId, apiRoleName),
  );

  const completedCount = STEPS.filter((s) => s.isComplete(employee)).length;
  const nameSet = Boolean(employee.fullName.trim());

  return (
    <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
      {/* Kopf — Fortschritt durch die Kapitel */}
      <div className="border-b border-[#e5e7eb] bg-linear-to-r from-[rgba(227,6,19,0.06)] to-white px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#e30613]">
              Neue Person anlegen — geführt
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#111827]">
              {employee.fullName || "Unbenannt"}
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Schritt für Schritt durch die Kapitel — Pflicht- und Norm-Felder
              nicht vergessen. Gespeichert wird erst mit „Person speichern“.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-[#fafbfc] px-2.5 py-1 text-xs font-semibold text-[#374151]">
            {completedCount} / {STEPS.length} Kapitel
          </span>
        </div>

        {/* Vertikaler Fortschritts-Index der Kapitel */}
        <ol className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
          {STEPS.map((step) => {
            const done = step.isComplete(employee);
            const open = step.hasRequired && !done;
            return (
              <li
                key={step.key}
                className="inline-flex items-center gap-1.5 text-xs"
              >
                {done ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : open ? (
                  <CircleDot className="h-3.5 w-3.5 text-amber-500" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-[#9ca3af]" />
                )}
                <span
                  className={
                    done
                      ? "font-medium text-[#111827]"
                      : open
                        ? "font-medium text-amber-700"
                        : "text-[#6b7280]"
                  }
                >
                  {step.no} {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Vertikale Kapitel-Sequenz — je Kapitel ein Block mit der bestehenden
          kapitelgefilterten Edit-Form. Eingaben puffern (onSavePerson im
          Creating-Modus = handleSavePerson puffert nur). */}
      <div className="divide-y divide-[#e5e7eb]">
        {STEPS.map((step) => {
          const done = step.isComplete(employee);
          const open = step.hasRequired && !done;
          return (
            <section key={step.key} className="px-5 py-5">
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={
                    done
                      ? "inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700"
                      : open
                        ? "inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-700"
                        : "inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f1f3f6] text-xs font-semibold text-[#6b7280]"
                  }
                >
                  {step.no}
                </span>
                <h3 className="text-sm font-semibold text-[#111827]">
                  {step.label}
                </h3>
                {step.hasRequired && !done ? (
                  <span className="rounded border border-red-200 bg-red-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-red-700">
                    Pflicht offen
                  </span>
                ) : null}
              </div>
              <EmployeeFilePersonRolleEditTable
                employee={employee}
                roles={roles}
                appointments={appointments}
                companyName={companyName}
                rows={summary.personUndRollePflichtangaben}
                onSave={onSavePerson}
                chapters={[step.key]}
              />
            </section>
          );
        })}
      </div>

      {/* Footer — Persistenz erst hier (S1b-Muster). */}
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#e5e7eb] bg-[#fafbfc] px-5 py-3">
        <button
          type="button"
          onClick={onDiscard}
          className="rounded-lg border border-[#e5e7eb] px-3 py-2 text-xs font-semibold text-[#6b7280] hover:border-[rgba(227,6,19,0.35)] hover:text-[#e30613]"
        >
          Verwerfen
        </button>
        <button
          type="button"
          onClick={onCommit}
          disabled={!nameSet}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#e30613] bg-[#e30613] px-3 py-2 text-xs font-semibold text-white hover:bg-[#b80510] disabled:cursor-not-allowed disabled:opacity-50"
          title={
            nameSet ? "Person speichern" : "Bitte zuerst einen Namen eintragen"
          }
        >
          Person speichern
        </button>
      </div>
    </div>
  );
};

EmployeeFileGuidedCreate.displayName = "EmployeeFileGuidedCreate";
