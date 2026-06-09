"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  FormField,
  Input,
  Select,
  MultiSelect,
  DatePicker,
} from "@/components/ui";
import { Check, User, Hash, Settings2 } from "lucide-react";
import type { Employee, Role, Appointment } from "@/lib/types/employee";
import { employeeFormSchema } from "./validations/employee-form";
import {
  appointmentLabelDe,
  BESTELLUNGEN_HINT,
  GRUNDROLLE_HINT,
  roleSelectDescription,
  roleSelectLabel,
  sortRolesForSelect,
  sortAppointmentsForSelect,
} from "./employee-display-labels";
import {
  BESCHAEFTIGUNGSART_OPTIONS,
  ROLE_CLASS_LABEL_MULTI,
  ROLLE_STAMMDATEN_LABEL,
  ROLLE_TYPE_OPTIONS,
} from "./employee-stammdaten-options";
import { joinFullName, splitFullName } from "./employee-file-requirements";
import { resolveRoleClasses } from "./requirement-engine";
import { RoleClassSelector } from "./RoleClassSelector";

const akteEditSchema = employeeFormSchema.extend({
  vorname: z.string().min(1, "Vorname erforderlich"),
  nachname: z.string().min(1, "Nachname erforderlich"),
});

type AkteEditFormData = z.infer<typeof akteEditSchema>;

export interface EmployeeFileAkteInlineEditProps {
  employee: Employee;
  roles: Role[];
  appointments: Appointment[];
  companyName: string;
  onSave: (employee: Employee) => void;
  onCancel: () => void;
}

export const EmployeeFileAkteInlineEdit: React.FC<
  EmployeeFileAkteInlineEditProps
> = ({ employee, roles, appointments, companyName, onSave, onCancel }) => {
  const { vorname, nachname } = splitFullName(employee.fullName);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AkteEditFormData>({
    resolver: zodResolver(akteEditSchema),
    mode: "onChange",
    defaultValues: {
      vorname,
      nachname,
      fullName: employee.fullName,
      birthday: employee.birthday,
      startDate: employee.startDate,
      roleId: employee.roleId,
      appointmentIds: employee.appointmentIds,
      roleClasses: resolveRoleClasses(employee),
      roleType: employee.roleType || "",
      employmentType: employee.employmentType || "",
      qualification: employee.qualification || "",
      guardIDNumber: employee.guardIDNumber || "",
      employeeIDNumber: employee.employeeIDNumber || "",
      useGuardAsEmployeeId: employee.useGuardAsEmployeeId || false,
    },
  });

  const useGuardAsEmployeeId = watch("useGuardAsEmployeeId");
  const guardIDNumber = watch("guardIDNumber");
  const watchVorname = watch("vorname");
  const watchNachname = watch("nachname");

  useEffect(() => {
    setValue("fullName", joinFullName(watchVorname, watchNachname), {
      shouldValidate: true,
    });
  }, [watchVorname, watchNachname, setValue]);

  useEffect(() => {
    if (useGuardAsEmployeeId) {
      setValue("employeeIDNumber", guardIDNumber || "");
    }
  }, [useGuardAsEmployeeId, guardIDNumber, setValue]);

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

  const onSubmit = (data: AkteEditFormData) => {
    const effectiveEmployeeId = data.useGuardAsEmployeeId
      ? data.guardIDNumber || ""
      : data.employeeIDNumber || "";

    onSave({
      ...employee,
      fullName: joinFullName(data.vorname, data.nachname),
      birthday: data.birthday,
      startDate: data.startDate,
      roleId: data.roleId,
      appointmentIds: data.appointmentIds,
      roleClasses: data.roleClasses,
      roleClass: undefined,
      zusatzBewachungNiveau: undefined,
      roleType: data.roleType,
      employmentType: data.employmentType,
      qualification: data.qualification,
      guardIDNumber: data.guardIDNumber,
      employeeIDNumber: effectiveEmployeeId,
      useGuardAsEmployeeId: data.useGuardAsEmployeeId,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input type="hidden" {...register("fullName")} />

      <fieldset className="rounded-lg border border-[#e5e7eb] p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-[#e30613]">
          Person & Rolle
        </legend>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <FormField
            label="Vorname"
            name="vorname"
            required
            error={errors.vorname?.message ?? errors.fullName?.message}
          >
            <Input
              {...register("vorname")}
              placeholder="Vorname"
              leftIcon={<User className="h-4 w-4" />}
              hasError={!!errors.vorname || !!errors.fullName}
            />
          </FormField>
          <FormField
            label="Nachname"
            name="nachname"
            required
            error={errors.nachname?.message}
          >
            <Input
              {...register("nachname")}
              placeholder="Nachname"
              hasError={!!errors.nachname}
            />
          </FormField>
          <FormField
            label={ROLE_CLASS_LABEL_MULTI}
            name="roleClasses"
            error={errors.roleClasses?.message}
          >
            <Controller
              name="roleClasses"
              control={control}
              render={({ field }) => (
                <RoleClassSelector
                  value={field.value ?? []}
                  onChange={field.onChange}
                  hasError={!!errors.roleClasses}
                  compact
                />
              )}
            />
          </FormField>
          <FormField
            label={`${ROLLE_STAMMDATEN_LABEL} (Org-Titel)`}
            name="roleType"
          >
            <Controller
              name="roleType"
              control={control}
              render={({ field }) => (
                <Select
                  options={[...ROLLE_TYPE_OPTIONS]}
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Org-Titel wählen…"
                />
              )}
            />
          </FormField>
          <FormField
            label="Dokumenten-Vorlage"
            name="roleId"
            required
            error={errors.roleId?.message}
          >
            <Controller
              name="roleId"
              control={control}
              render={({ field }) => (
                <Select
                  options={roleOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Vorlagen-Rolle wählen…"
                  hasError={!!errors.roleId}
                />
              )}
            />
            <p className="mt-1 text-[10px] text-[#6b7280]">{GRUNDROLLE_HINT}</p>
          </FormField>
          <FormField label="Bestellungen" name="appointmentIds">
            <Controller
              name="appointmentIds"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={bestellungOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Bestellungen wählen…"
                />
              )}
            />
            <p className="mt-1 text-[10px] text-[#6b7280]">
              {BESTELLUNGEN_HINT}
            </p>
          </FormField>
          <FormField label="Unternehmen" name="unternehmen">
            <Input
              value={companyName || "— nicht hinterlegt"}
              disabled
              className="bg-[#fafbfc]"
            />
            <Link
              href="/uploads"
              className="mt-1 inline-flex items-center gap-1 text-[10px] text-[#e30613] hover:underline"
            >
              <Settings2 className="h-3 w-3" />
              Firmendaten im Upload Manager
            </Link>
          </FormField>
          <FormField label="Aktiver Status" name="aktivStatus">
            <Input value="aktiv" disabled className="bg-[#fafbfc]" />
            <p className="mt-1 text-[10px] text-[#9ca3af]">Working UI</p>
          </FormField>
        </div>
      </fieldset>

      <fieldset className="rounded-lg border border-[#e5e7eb] p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-[#e30613]">
          Pflichtangaben
        </legend>
        <p className="mt-1 text-[10px] text-[#6b7280]">
          Datenfelder der Akte — Vertrag, Beschäftigung und IDs an einem Ort
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <FormField
            label="Geburtsdatum"
            name="birthday"
            required
            error={errors.birthday?.message}
          >
            <Controller
              name="birthday"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="TT.MM.JJJJ oder Kalender"
                  hasError={!!errors.birthday}
                />
              )}
            />
          </FormField>
          <FormField
            label="Eintrittsdatum / Vertragsbeginn"
            name="startDate"
            required
            error={errors.startDate?.message}
          >
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Kalender oder Datum eingeben"
                  hasError={!!errors.startDate}
                />
              )}
            />
          </FormField>
          <FormField label="Beschäftigungsart" name="employmentType">
            <Controller
              name="employmentType"
              control={control}
              render={({ field }) => (
                <Select
                  options={[...BESCHAEFTIGUNGSART_OPTIONS]}
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Beschäftigungsart wählen…"
                />
              )}
            />
          </FormField>
          <FormField label="Qualifikation" name="qualification">
            <Controller
              name="qualification"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="z. B. Sachkunde §34a"
                />
              )}
            />
          </FormField>
          <FormField label="Bewacher-ID" name="guardIDNumber">
            <Input
              {...register("guardIDNumber")}
              placeholder="Security ID"
              leftIcon={<Hash className="h-4 w-4" />}
            />
            <p className="mt-1 text-[10px] text-[#6b7280]">
              Stammdaten — getrennt vom Bundesauszug (Nachweis)
            </p>
          </FormField>
          <FormField label="Dienstausweisnummer" name="employeeIDNumber">
            <Input
              {...register("employeeIDNumber")}
              placeholder="Dienstausweisnummer"
              disabled={useGuardAsEmployeeId}
            />
          </FormField>
          <label className="flex items-center gap-2 text-sm text-[#374151] sm:col-span-2">
            <Controller
              name="useGuardAsEmployeeId"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={field.value}
                  onClick={() => field.onChange(!field.value)}
                  className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                    field.value
                      ? "border-[#e30613] bg-[#e30613]"
                      : "border-[#d1d5db] bg-white"
                  }`}
                >
                  {field.value ? (
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  ) : null}
                </button>
              )}
            />
            Bewacher-ID als Dienstausweisnummer verwenden
          </label>
          <FormField label="Projektzuordnung" name="projektzuordnung">
            <Input
              value=""
              disabled
              placeholder="SDL/Projekt — folgt"
              className="bg-[#fafbfc]"
            />
          </FormField>
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-2 border-t border-[#e5e7eb] pt-4">
        <Button type="submit" variant="primary">
          Akte speichern
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Abbrechen
        </Button>
      </div>
    </form>
  );
};

EmployeeFileAkteInlineEdit.displayName = "EmployeeFileAkteInlineEdit";
