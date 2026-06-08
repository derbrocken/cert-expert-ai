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
  // G4: Norm-Klasse = primärer Engine-Input (Pflicht).
  roleClass: z.enum(["ek", "fk", "verwaltung", "praktikant", "subunternehmer"], {
    message: "Bitte eine Norm-Klasse wählen",
  }),
  // Org-Titel (Anzeige/Org-Chart) — optional, keine Engine-Wirkung.
  roleType: z.string().optional(),
  // Requirement-Felder (Engine-Eingang)
  zusatzBewachungNiveau: z.enum(["", "ek", "fk"]).optional(),
  sdlScopes: z.array(z.string()).optional(),
  drivesServiceVehicle: z.boolean().optional(),
  ersteHilfeGueltigBis: z.string().optional(),
  brandschutzGueltigBis: z.string().optional(),
  employmentType: z.string().optional(),
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
