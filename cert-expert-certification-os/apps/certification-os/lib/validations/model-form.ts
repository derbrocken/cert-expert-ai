import { format } from "@formkit/tempo";
import { z } from "zod";

export const modelFormSchema = z.object({
  folders: z
    .array(z.string())
    .min(1, "Bitte mindestens einen Standard-Model-Ordner auswählen"),
  docVersion: z
    .string()
    .min(1, "Dokumentversion ist erforderlich")
    .max(50, "Version zu lang"),
  createdBy: z
    .string()
    .min(2, "Erstellt von muss mindestens 2 Zeichen haben")
    .max(100, "Erstellt von zu lang"),
  approvedBy: z
    .string()
    .min(2, "Freigegeben von muss mindestens 2 Zeichen haben")
    .max(100, "Freigegeben von zu lang"),
  docDate: z
    .string()
    .min(1, "Dokumentdatum ist erforderlich")
    .transform((val) => {
      return format(val, "DD.MM.YYYY");
    }),
  companyName: z
    .string()
    .min(1, "Firmenname ist erforderlich")
    .max(200, "Firmenname zu lang"),
  companyStreet: z.string().optional(),
  companyZip: z.string().optional(),
  companyCity: z.string().optional(),
  companyCountry: z.string().optional(),
  companyAddressLine: z.string().optional(),
});

export type ModelFormData = z.infer<typeof modelFormSchema>;
