import type { Employee, Role, Appointment } from "@/lib/types/employee";

/** Keep generator doc chip IDs aligned when role or appointments change inline. */
export function applyEmployeePatchWithDocSync(
  employee: Employee,
  partial: Partial<Employee>,
  roles: Role[],
  appointments: Appointment[],
): Employee {
  const next: Employee = { ...employee, ...partial };

  if (partial.roleId !== undefined && partial.roleId !== employee.roleId) {
    const role = roles.find((r) => r.id === partial.roleId);
    next.selectedRoleDocIds = role
      ? role.documents.map((d) => d.id)
      : [];
  }

  if (partial.appointmentIds !== undefined) {
    const prevIds = new Set(employee.appointmentIds);
    const nextIds = new Set(partial.appointmentIds);
    const selected = new Set(employee.selectedAppointmentDocIds);

    for (const id of employee.appointmentIds) {
      if (!nextIds.has(id)) {
        appointments
          .find((a) => a.id === id)
          ?.documents.forEach((d) => selected.delete(d.id));
      }
    }
    for (const id of partial.appointmentIds) {
      if (!prevIds.has(id)) {
        appointments
          .find((a) => a.id === id)
          ?.documents.forEach((d) => selected.add(d.id));
      }
    }
    next.selectedAppointmentDocIds = Array.from(selected);
  }

  return next;
}
