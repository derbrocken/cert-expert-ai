"use client";

import React from "react";
import { UserPlus, FolderOpen } from "lucide-react";

export interface EmployeeFileOverviewIntroProps {
  employeeCount: number;
  onCreateNew?: () => void;
}

export const EmployeeFileOverviewIntro: React.FC<
  EmployeeFileOverviewIntroProps
> = ({ employeeCount, onCreateNew }) => {
  return (
    <div className="mx-auto max-w-lg space-y-6 p-6 sm:p-8">
      <section className="rounded-xl border border-[rgba(227,6,19,0.25)] bg-[rgba(227,6,19,0.04)] px-5 py-5">
        <h2 className="text-sm font-semibold text-[#111827]">
          Personal erfassen
        </h2>
        <p className="mt-1 text-sm font-medium text-[#374151]">
          Neue Person anlegen
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
          Pro Person eine eigene Mitarbeiterakte — Stammdaten, Rollen und
          Nachweise getrennt je Mitarbeiter. Nutzen Sie links{" "}
          <strong className="font-medium text-[#111827]">Neue Person</strong>{" "}
          oder wählen Sie eine bestehende Akte aus der Liste.
        </p>
        {onCreateNew ? (
          <button
            type="button"
            onClick={onCreateNew}
            className="mt-4 text-sm font-semibold text-[#e30613] hover:underline"
          >
            Neue Person anlegen →
          </button>
        ) : null}
      </section>

      {employeeCount === 0 ? (
        <div className="flex flex-col items-center rounded-lg border border-dashed border-[#e5e7eb] py-10 text-center">
          <UserPlus className="mb-2 h-8 w-8 text-[#d1d5db]" />
          <p className="text-sm font-medium text-[#111827]">
            Noch keine Mitarbeiterakte
          </p>
          <p className="mt-1 max-w-xs text-xs text-[#6b7280]">
            Links „Neue Person“ klicken — danach erscheint die Akte in der
            Liste.
          </p>
        </div>
      ) : (
        <div className="flex gap-3 rounded-lg border border-[#e5e7eb] bg-white px-4 py-4">
          <FolderOpen className="mt-0.5 h-5 w-5 shrink-0 text-[#e30613]" />
          <div>
            <p className="text-sm font-medium text-[#111827]">
              {employeeCount}{" "}
              {employeeCount === 1
                ? "Mitarbeiterakte angelegt"
                : "Mitarbeiterakten angelegt"}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[#6b7280]">
              Person in der Liste links anklicken, um die Akte zu öffnen.
              Export-Auswahl über die Checkboxen neben dem Namen.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

EmployeeFileOverviewIntro.displayName = "EmployeeFileOverviewIntro";
