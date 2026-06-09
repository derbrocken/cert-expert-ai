import { z } from "zod";

export const employeeFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  birthday: z.string().min(1, "Please select a birthday"),
  startDate: z.string().min(1, "Please select a start date"),
  // G4: roleId bleibt Pflicht — steuert die Generator-Dokumentenpalette (EC-09).
  roleId: z.string().min(1, "Bitte eine Dokumenten-Vorlage wählen"),
  appointmentIds: z.array(z.string()),
  // #A: Norm-Klassen-Set = primärer Engine-Input. Mehrfachauswahl, frei
  // kombinierbar, jede Klasse einzeln abwählbar — KEINE Zwangsvorauswahl. Leere
  // Auswahl ist zulässig; Overview/Engine zeigen dann „Keine Norm-Klasse
  // erfasst" (EC-10, bereits behandelt) statt einen Save zu blockieren.
  roleClasses: z.array(
    z.enum(["ek", "fk", "verwaltung", "praktikant", "subunternehmer"]),
  ),
  // Org-Titel (Anzeige/Org-Chart) — optional, keine Engine-Wirkung.
  roleType: z.string().optional(),
  // Requirement-Felder (Engine-Eingang)
  sdlScopes: z.array(z.string()).optional(),
  drivesServiceVehicle: z.boolean().optional(),
  ersteHilfeGueltigBis: z.string().optional(),
  brandschutzGueltigBis: z.string().optional(),
  employmentType: z.string().optional(),
  // #2: Qualifikation als strukturiertes Multiselect (Katalog-IDs). Optional,
  // frei kombinierbar. Freitext `qualification` bleibt als Persistenz-/Legacy-
  // Träger erhalten (round-trip über die bestehende Spalte).
  qualifications: z.array(z.string()).optional(),
  qualification: z.string().optional(),
  guardIDNumber: z.string().optional(),
  employeeIDNumber: z.string().optional(),
  useGuardAsEmployeeId: z.boolean().optional(),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;

export const globalPropertiesSchema = z.object({
  companyName: z.string().optional(),
  companyEmail: z.string().optional(),
  companyAddress: z.string().optional(),
  companyLogo: z.string().optional(),
  documentVersion: z.string().optional(),
  documentDate: z.string().optional(),
  createdBy: z.string().optional(),
  approvedBy: z.string().optional(),
});

export type GlobalPropertiesFormData = z.infer<typeof globalPropertiesSchema>;
