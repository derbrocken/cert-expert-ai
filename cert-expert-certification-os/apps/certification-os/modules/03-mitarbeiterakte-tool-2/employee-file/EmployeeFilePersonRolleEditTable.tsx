"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Input, Select, MultiSelect, DatePicker } from "@/components/ui";
import { Check, Settings2 } from "lucide-react";
import type { Employee, Role, Appointment } from "@/lib/types/employee";
import {
  appointmentLabelDe,
  roleSelectDescription,
  roleSelectLabel,
  sortAppointmentsForSelect,
  sortRolesForSelect,
} from "./employee-display-labels";
import {
  BESCHAEFTIGUNGSART_OPTIONS,
  DIENSTFAHRZEUG_OPTIONS,
  ORG_TITLE_OPTIONS,
  ROLE_CLASS_OPTIONS,
  ROLE_CLASS_LABEL,
  ROLLE_TYPE_OPTIONS,
  SDL_SCOPE_CATALOG,
  ZUSATZ_BEWACHUNG_OPTIONS,
} from "./employee-stammdaten-options";
import { mapRoleTypeToRoleClass, type RoleClass } from "./requirement-engine";
import {
  joinFullName,
  splitFullName,
  type RequirementRow,
} from "./employee-file-requirements";
import {
  applyEmployeePatchWithDocSync,
} from "./employee-doc-selection-sync";
import { EmployeeFileStatusBadge } from "./EmployeeFileStatusBadge";

const COMPACT_SELECT =
  "[&_button]:rounded-lg [&_button]:py-2 [&_button]:text-sm [&_button]:shadow-none";

const ROLE_CLASS_VALUES = ROLE_CLASS_OPTIONS.map((o) => o.id) as string[];

function asRoleClass(value: string): RoleClass | undefined {
  return ROLE_CLASS_VALUES.includes(value) ? (value as RoleClass) : undefined;
}

export interface EmployeeFilePersonRolleEditTableProps {
  employee: Employee;
  roles: Role[];
  appointments: Appointment[];
  companyName: string;
  rows: RequirementRow[];
  onSave: (employee: Employee) => void;
}

function statusForRow(rows: RequirementRow[], id: string) {
  return rows.find((r) => r.id === id)?.status ?? "offen";
}

export const EmployeeFilePersonRolleEditTable: React.FC<
  EmployeeFilePersonRolleEditTableProps
> = ({ employee, roles, appointments, companyName, rows, onSave }) => {
  const { vorname, nachname } = splitFullName(employee.fullName);

  const roleOptions = useMemo(
    () =>
      sortRolesForSelect(roles).map((r) => ({
        id: r.id,
        name: roleSelectLabel(r.id, r.name),
        description: roleSelectDescription(r.id) ?? r.description,
      })),
    [roles],
  );

  const bestellungOptions = useMemo(
    () =>
      sortAppointmentsForSelect(appointments).map((a) => ({
        id: a.id,
        name: appointmentLabelDe(a.id, a.name),
        description: a.description,
      })),
    [appointments],
  );

  const sdlOptions = useMemo(
    () =>
      SDL_SCOPE_CATALOG.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.geltungsbereich,
      })),
    [],
  );

  const dienstfahrzeugValue =
    employee.drivesServiceVehicle === true
      ? "ja"
      : employee.drivesServiceVehicle === false
        ? "nein"
        : "";

  const patch = (partial: Partial<Employee>) => {
    onSave(applyEmployeePatchWithDocSync(employee, partial, roles, appointments));
  };

  const handleNameChange = (part: "vorname" | "nachname", value: string) => {
    const nextVorname = part === "vorname" ? value : vorname;
    const nextNachname = part === "nachname" ? value : nachname;
    patch({ fullName: joinFullName(nextVorname, nextNachname) });
  };

  const handleGuardIdChange = (value: string) => {
    patch({
      guardIDNumber: value,
      ...(employee.useGuardAsEmployeeId
        ? { employeeIDNumber: value }
        : undefined),
    });
  };

  const rowShell = (
    id: string,
    label: string,
    control: React.ReactNode,
    hint?: string,
    statusOverride?: RequirementRow["status"],
  ) => (
    <li
      key={id}
      className="flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3"
    >
      <div className="min-w-0 sm:w-40 shrink-0">
        <p className="text-sm text-[#111827]">{label}</p>
        {hint ? (
          <p className="mt-0.5 text-[10px] text-[#6b7280]">{hint}</p>
        ) : null}
      </div>
      <div className="min-w-0 flex-1">{control}</div>
      <EmployeeFileStatusBadge status={statusOverride ?? statusForRow(rows, id)} />
    </li>
  );

  return (
    <ul className="divide-y divide-[#e5e7eb] rounded-lg border border-[#e5e7eb]">
      {rowShell(
        "norm-klasse",
        ROLE_CLASS_LABEL,
        <div className={COMPACT_SELECT}>
          <Select
            options={[...ROLE_CLASS_OPTIONS]}
            value={
              employee.roleClass ??
              mapRoleTypeToRoleClass(employee.roleType) ??
              ""
            }
            onChange={(v) => patch({ roleClass: asRoleClass(v) })}
            placeholder="Norm-Klasse wählen…"
          />
        </div>,
        "DIN 77200: EK/FK/Verwaltung/Praktikant/Sub — maßgeblich fürs Pflicht-Set (G4).",
        employee.roleClass || mapRoleTypeToRoleClass(employee.roleType)
          ? "vorhanden"
          : "offen",
      )}

      {rowShell(
        "org-titel",
        "Org-Titel (Anzeige)",
        <div className={COMPACT_SELECT}>
          <Select
            options={[...ROLLE_TYPE_OPTIONS]}
            value={employee.roleType || ""}
            onChange={(roleType) => {
              const def = ORG_TITLE_OPTIONS.find(
                (o) => o.id === roleType,
              )?.defaultClass;
              patch({
                roleType,
                // Default-Klasse nur setzen, wenn noch keine Norm-Klasse erfasst
                // ist (Org-Titel überschreibt eine bewusst gewählte Klasse nicht).
                ...(def && !employee.roleClass
                  ? { roleClass: def as RoleClass }
                  : {}),
              });
            }}
            placeholder="Org-Titel wählen…"
          />
        </div>,
        "Org-Chart-Titel — keine direkte Engine-Wirkung (G4).",
      )}

      {rowShell(
        "zusatz-bewachung",
        "Zusätzliche Bewachungstätigkeit (Doppelrolle)",
        <div className={COMPACT_SELECT}>
          <Select
            options={[...ZUSATZ_BEWACHUNG_OPTIONS]}
            value={employee.zusatzBewachungNiveau ?? ""}
            onChange={(v) =>
              patch({
                zusatzBewachungNiveau:
                  v === "ek" || v === "fk" ? v : undefined,
              })
            }
            placeholder="— keine zusätzliche Bewachung"
          />
        </div>,
        "Für Verwaltung/GF, der/die mit auf Schicht geht. Wendet das volle Bewachungs-Pflichtset an (CL-40); FK-Niveau treibt CL-20/25 + FK-Quali CL-10.",
        employee.zusatzBewachungNiveau ? "vorhanden" : "nicht erforderlich",
      )}

      {rowShell(
        "dokumenten-vorlage",
        "Dokumenten-Vorlage",
        <div className={COMPACT_SELECT}>
          <Select
            options={roleOptions}
            value={employee.roleId}
            onChange={(roleId) => patch({ roleId })}
            placeholder="Vorlagen-Rolle wählen…"
          />
        </div>,
        "Steuert die Generator-Dokumentenpalette",
      )}

      {rowShell(
        "bestellungen",
        "Bestellungen",
        <div className={COMPACT_SELECT}>
          <MultiSelect
            options={bestellungOptions}
            value={employee.appointmentIds}
            onChange={(appointmentIds) => patch({ appointmentIds })}
            placeholder="Ersthelfer, Brandschutzhelfer, SiBe …"
          />
        </div>,
        "Mehrfachauswahl — ergänzt die Grundrolle",
      )}

      {rowShell(
        "vorname",
        "Vorname",
        <Input
          value={vorname}
          onChange={(e) => handleNameChange("vorname", e.target.value)}
          placeholder="Vorname"
          className="py-2 text-sm"
        />,
      )}

      {rowShell(
        "nachname",
        "Nachname",
        <Input
          value={nachname}
          onChange={(e) => handleNameChange("nachname", e.target.value)}
          placeholder="Nachname"
          className="py-2 text-sm"
        />,
      )}

      {rowShell(
        "geburtsdatum",
        "Geburtsdatum",
        <DatePicker
          value={employee.birthday}
          onChange={(birthday) => patch({ birthday })}
          placeholder="TT.MM.JJJJ"
          className="text-sm"
        />,
      )}

      {rowShell(
        "vertragsbeginn",
        "Vertragsbeginn",
        <DatePicker
          value={employee.startDate}
          onChange={(startDate) => patch({ startDate })}
          placeholder="Vertragsbeginn"
          className="text-sm"
        />,
      )}

      {rowShell(
        "austritt",
        "Austrittsdatum",
        <Input
          value=""
          disabled
          placeholder="Nur bei Beendigung"
          className="bg-[#fafbfc] py-2 text-sm"
        />,
        "Nur bei Beendigung erfassen",
      )}

      {rowShell(
        "beschaeftigungsart",
        "Beschäftigungsart",
        <div className={COMPACT_SELECT}>
          <Select
            options={[...BESCHAEFTIGUNGSART_OPTIONS]}
            value={employee.employmentType || ""}
            onChange={(employmentType) => patch({ employmentType })}
            placeholder="Beschäftigungsart wählen…"
          />
        </div>,
      )}

      {rowShell(
        "qualifikation",
        "Qualifikation",
        <Input
          value={employee.qualification || ""}
          onChange={(e) => patch({ qualification: e.target.value })}
          placeholder="z. B. Sachkunde §34a"
          className="py-2 text-sm"
        />,
      )}

      {rowShell(
        "sdl-scopes",
        "SDL / Geltungsbereich",
        <div className={COMPACT_SELECT}>
          <MultiSelect
            options={sdlOptions}
            value={employee.sdlScopes ?? []}
            onChange={(sdlScopes) => patch({ sdlScopes })}
            placeholder="DIN 77200-1/-2, Veranstaltung, Objekt, Asyl …"
          />
        </div>,
        "Eingang der Pflicht-Engine — Mehrfachauswahl",
      )}

      {rowShell(
        "dienstfahrzeug",
        "Fährt Dienstfahrzeug?",
        <div className={COMPACT_SELECT}>
          <Select
            options={[...DIENSTFAHRZEUG_OPTIONS]}
            value={dienstfahrzeugValue}
            onChange={(v) =>
              patch({
                drivesServiceVehicle:
                  v === "ja" ? true : v === "nein" ? false : undefined,
              })
            }
            placeholder="unbekannt"
          />
        </div>,
        "Ja → Fahrer-/UVV-Unterweisung (fachlich prüfen, CL-73)",
      )}

      {rowShell(
        "erste-hilfe-frist",
        "Erste Hilfe gültig bis",
        <DatePicker
          value={employee.ersteHilfeGueltigBis || ""}
          onChange={(ersteHilfeGueltigBis) => patch({ ersteHilfeGueltigBis })}
          placeholder="Ablaufdatum Erste Hilfe"
          className="text-sm"
        />,
        "2-Jahres-Frist (CL-08)",
      )}

      {rowShell(
        "brandschutz-frist",
        "Brandschutzhelfer gültig bis",
        <DatePicker
          value={employee.brandschutzGueltigBis || ""}
          onChange={(brandschutzGueltigBis) =>
            patch({ brandschutzGueltigBis })
          }
          placeholder="Ablaufdatum Brandschutzhelfer"
          className="text-sm"
        />,
        "3-Jahres-Frist (CL-23)",
      )}

      {rowShell(
        "unternehmen",
        "Unternehmen",
        <div>
          <Input
            value={companyName || "— nicht hinterlegt"}
            disabled
            className="bg-[#fafbfc] py-2 text-sm"
          />
          <Link
            href="/uploads"
            className="mt-1 inline-flex items-center gap-1 text-[10px] text-[#e30613] hover:underline"
          >
            <Settings2 className="h-3 w-3" />
            Firmendaten im Upload Manager
          </Link>
        </div>,
        "Aus Firmendaten",
      )}

      {rowShell(
        "bewacher-id",
        "Bewacher-ID",
        <Input
          value={employee.guardIDNumber || ""}
          onChange={(e) => handleGuardIdChange(e.target.value)}
          placeholder="Bewacher-ID"
          className="py-2 text-sm"
        />,
        "Stammdaten — getrennt vom Bundesauszug",
      )}

      {rowShell(
        "dienst-id",
        "Dienstausweisnummer",
        <div className="space-y-2">
          <Input
            value={employee.employeeIDNumber || ""}
            onChange={(e) => patch({ employeeIDNumber: e.target.value })}
            placeholder="Dienstausweisnummer"
            disabled={employee.useGuardAsEmployeeId}
            className="py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-xs text-[#374151]">
            <button
              type="button"
              role="checkbox"
              aria-checked={employee.useGuardAsEmployeeId}
              onClick={() => {
                const useGuard = !employee.useGuardAsEmployeeId;
                patch({
                  useGuardAsEmployeeId: useGuard,
                  employeeIDNumber: useGuard
                    ? employee.guardIDNumber || ""
                    : employee.employeeIDNumber,
                });
              }}
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${
                employee.useGuardAsEmployeeId
                  ? "border-[#e30613] bg-[#e30613]"
                  : "border-[#d1d5db] bg-white"
              }`}
            >
              {employee.useGuardAsEmployeeId ? (
                <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
              ) : null}
            </button>
            Bewacher-ID als Dienstausweisnummer verwenden
          </label>
        </div>,
      )}

      {rowShell(
        "aktiv",
        "Aktiver Status",
        <Input value="aktiv" disabled className="bg-[#fafbfc] py-2 text-sm" />,
        "Working UI",
      )}

      {rowShell(
        "projekte",
        "Projektzuordnung",
        <Input
          value=""
          disabled
          placeholder="SDL/Projekt — folgt"
          className="bg-[#fafbfc] py-2 text-sm"
        />,
        "SDL/Projekt-Referenz folgt",
      )}
    </ul>
  );
};

EmployeeFilePersonRolleEditTable.displayName = "EmployeeFilePersonRolleEditTable";
