"use client";

import React, { useState } from "react";
import { ChevronDown, GraduationCap, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Employee, Role, Appointment } from "@/lib/types/employee";
import { bestellungLabelDe, getBestelltAls } from "./employee-display-labels";

export interface EmployeeFileDossierZonesProps {
  employee: Employee;
  roles: Role[];
  appointments: Appointment[];
}

function ZoneAccordion({
  title,
  subtitle,
  icon,
  defaultOpen,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#f9fafb]"
        aria-expanded={open}
      >
        <span className="text-[#e30613]">{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-[#111827]">
            {title}
          </span>
          <span className="block text-xs text-[#6b7280]">{subtitle}</span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[#6b7280] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div className="border-t border-[#e5e7eb] px-4 py-4 text-sm text-[#6b7280]">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export const EmployeeFileDossierZones: React.FC<
  EmployeeFileDossierZonesProps
> = ({ employee, roles }) => {
  const role = roles.find((r) => r.id === employee.roleId);
  // #C — Bestellungen (formale Ernennungen) sauber getrennt anzeigen, NICHT mit
  // allen Appointment-Vorlagen vermischen. Quelle = `bestelltAls`-Projektion.
  const bestellungNames = getBestelltAls(employee).map((t) =>
    bestellungLabelDe(t),
  );

  return (
    <div className="space-y-3">
      <ZoneAccordion
        title="Qualifikation & Nachweise"
        subtitle="Rollen, Zusatzrollen, Pflichtnachweise — Vorbereitung"
        icon={<GraduationCap className="h-4 w-4" />}
      >
        <ul className="space-y-2 text-sm">
          <li>
            <span className="font-medium text-[#111827]">Grundrolle:</span>{" "}
            {(role?.name ?? employee.roleId) || "—"}
          </li>
          <li>
            <span className="font-medium text-[#111827]">
              Bestellungen (bestellt als):
            </span>{" "}
            {bestellungNames.length > 0 ? bestellungNames.join(", ") : "Keine"}
          </li>
          <li>
            <span className="font-medium text-[#111827]">
              Nachweis-Checkliste:
            </span>{" "}
            Noch nicht implementiert — Upload und Status folgen in späteren
            Slices.
          </li>
          <li>
            <span className="font-medium text-[#111827]">Schulungen:</span>{" "}
            Eigener Abschnitt „Schulungen" in der Akte/Übersicht
            (Jahresweiterbildung, modulare DIN-1-Schulungen, einmalige
            SDL-Schulungen) — getrennt von Standarddokumenten/Unterweisungen.
          </li>
        </ul>
      </ZoneAccordion>

      <ZoneAccordion
        title="Readiness & Offene Punkte"
        subtitle="Prüfstatus, SDL-Bezug, Export-Hinweise"
        icon={<ClipboardCheck className="h-4 w-4" />}
      >
        <ul className="list-inside list-disc space-y-1.5 text-xs sm:text-sm">
          <li>Evidence upload — not implemented</li>
          <li>SDL / project link — not implemented</li>
          <li>Readiness ampel — not evaluated (grey)</li>
          <li>
            Generiertes ZIP-Paket ist kein freigegebener Nachweis und keine
            Zertifizierungsaussage.
          </li>
        </ul>
        <p className="mt-3 text-xs text-[#6b7280]">
          Ausgewählte Output-Dokumente: {employee.selectedRoleDocIds.length}{" "}
          Rolle, {employee.selectedAppointmentDocIds.length} Zusatzrolle.
        </p>
      </ZoneAccordion>
    </div>
  );
};

EmployeeFileDossierZones.displayName = "EmployeeFileDossierZones";
