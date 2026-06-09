"use server";

import { TemplateData, TemplateHandler } from "easy-template-x";
import JSZip from "jszip";
import sizeOf from "image-size";
import type {
  Employee,
  GlobalProperties,
  Role,
  Appointment,
} from "@/lib/types/employee";
import {
  listTemplateFiles,
  buildLatestTemplateKeyMap,
  fetchTemplateBufferByKey,
} from "@/lib/template-storage";
import {
  formatDocumentOutputDate,
  resolveDocumentDate,
  documentDateKey,
} from "@/modules/03-mitarbeiterakte-tool-2/employee-file/utils/date";
import { isBestellungAppointmentId } from "@/modules/03-mitarbeiterakte-tool-2/employee-file/employee-display-labels";

export interface GenerateEmployeeDocsState {
  success: boolean;
  zipBase64?: string;
  error?: string;
  timestamp?: number;
}

/**
 * #8 — Generator-Ausgabedatum (`{currentDate}`) global + pro Dokument steuerbar.
 * `global` = Default-Datum für alle Dokumente (ISO `YYYY-MM-DD` oder leer = heute).
 * `perDocument` = Override je Dokument, Schlüssel `documentDateKey(employeeId, docId)`.
 * Auflösungsreihenfolge: Per-Doc-Override → global → heute. Rein das
 * Ausgabedatum; berührt weder Engine/Norm-Werte noch die Vorlagen-Verarbeitung.
 */
export interface DocumentDates {
  global?: string;
  perDocument?: Record<string, string>;
}

export async function generateEmployeeDocs(
  employees: Employee[],
  globalProps: GlobalProperties,
  roles: Role[],
  appointments: Appointment[],
  documentDates?: DocumentDates,
): Promise<GenerateEmployeeDocsState> {
  try {
    if (!employees || employees.length === 0) {
      return { success: false, error: "No employees provided" };
    }

    // Build S3 key map for role + appointment templates (scoped list, not full bucket)
    const [roleFiles, appointmentFiles] = await Promise.all([
      listTemplateFiles("roles"),
      listTemplateFiles("appointments"),
    ]);
    const templateFiles = [...roleFiles, ...appointmentFiles];
    const templateKeyMap = buildLatestTemplateKeyMap(templateFiles);

    const zip = new JSZip();
    const handler = new TemplateHandler();
    // #8 — globaler Default („Datum für alle"); leer → heute. Per-Doc-Override
    // sticht weiter unten je Dokument.
    const globalDate = resolveDocumentDate(documentDates?.global);
    const perDocDates = documentDates?.perDocument ?? {};
    const resolveDocDate = (employeeId: string, docId: string): string => {
      const override = perDocDates[documentDateKey(employeeId, docId)];
      return override ? formatDocumentOutputDate(override) || globalDate : globalDate;
    };

    let logoData = null;
    let imageMimeType = "image/png";
    let finalWidth = 0;
    let finalHeight = 0;

    if (globalProps.companyLogo) {
      // "data:image/png;base64,..."
      const [prefix, base64] = globalProps.companyLogo.split(",");
      if (prefix && base64) {
        const match = prefix.match(/data:(image\/\w+);base64/);
        if (match) {
          imageMimeType = match[1];
        }
        logoData = Buffer.from(base64, "base64");

        try {
          const dimensions = sizeOf(logoData);
          const originalWidth = dimensions.width || 100;
          const originalHeight = dimensions.height || 100;
          const MAX_WIDTH = 150;
          const MAX_HEIGHT = 60;
          const scale = Math.min(
            MAX_WIDTH / originalWidth,
            MAX_HEIGHT / originalHeight,
          );
          finalWidth = Math.round(originalWidth * scale);
          finalHeight = Math.round(originalHeight * scale);
        } catch (err) {
          console.error("Error sizing logo:", err);
        }
      }
    }

    for (const employee of employees) {
      const role = roles.find((r) => r.id === employee.roleId);
      if (!role) {
        return {
          success: false,
          error: `Role "${employee.roleId}" not found for employee "${employee.fullName}"`,
        };
      }

      const employeeFolder = zip.folder(employee.fullName);
      if (!employeeFolder) continue;

      const templateData: TemplateData = {
        Logo: logoData
          ? {
              _type: "image",
              source: logoData,
              format: imageMimeType,
              width: finalWidth,
              height: finalHeight,
            }
          : "",
        FullName: employee.fullName,
        Birthday: formatDocumentOutputDate(employee.birthday),
        StartDate: formatDocumentOutputDate(employee.startDate),
        RoleName: role.name,
        RoleType: employee.roleType || "",
        TrainingHours: employee.trainingHours || "",
        GuardIDNumber: employee.guardIDNumber || "",
        EmployeeIDNumber: employee.employeeIDNumber || "",
        // Default = globaler Generator-Datum-Wert; je Dokument unten überschrieben.
        currentDate: globalDate,
        CompanyName: globalProps.companyName || "",
        CompanyEmail: globalProps.companyEmail || "",
        CompanyAddress: globalProps.companyAddress || "",
        DocVersion: globalProps.documentVersion || "",
        DocDate: formatDocumentOutputDate(globalProps.documentDate || ""),
        CreatedBy: globalProps.createdBy || "",
        ApprovedBy: globalProps.approvedBy || "",
      };

      // Process selected role documents
      const roleFolder = employeeFolder.folder(role.name);
      if (roleFolder) {
        const selectedRoleDocs = role.documents.filter((doc) =>
          employee.selectedRoleDocIds.includes(doc.id),
        );
        for (const doc of selectedRoleDocs) {
          const logicalPath = `roles/${role.id}/${doc.fileName}`;
          const objectKey = templateKeyMap.get(logicalPath);
          if (!objectKey) {
            return {
              success: false,
              error: `Template not found: ${logicalPath}`,
            };
          }
          try {
            const templateBuffer = await fetchTemplateBufferByKey(objectKey);
            // #8 — Per-Doc-Datum sticht über den globalen Default.
            const docDate = resolveDocDate(employee.id, doc.id);
            const processedDoc = await handler.process(templateBuffer, {
              ...templateData,
              currentDate: docDate,
            });
            roleFolder.file(doc.fileName, processedDoc);
          } catch (err) {
            console.error(
              `Error processing role template ${doc.fileName}:`,
              err,
            );
            return {
              success: false,
              error: `Failed to process template "${doc.fileName}" for role "${role.name}"`,
            };
          }
        }
      }

      // Process selected appointment documents
      for (const appointmentId of employee.appointmentIds) {
        const appointment = appointments.find((a) => a.id === appointmentId);
        if (!appointment) continue;

        const appointmentFolder = employeeFolder.folder(appointment.name);
        if (!appointmentFolder) continue;

        // #C — Bestellung „aus Vorlage generieren": eine Bestellung
        // (Ersthelfer/Brandschutzhelfer/SiBe) ist unterschriftspflichtig und
        // trägt als Default das Einstellungs-/Bestelldatum (`startDate`); der MA
        // unterschreibt nach. Fällt auf den globalen Generator-Datum-Wert zurück,
        // wenn kein startDate. Additive Platzhalter → Templates ohne diese Felder
        // bleiben unberührt (EC-09). EC-10: kein Freigabe-/Auditfähigkeits-Wording.
        const isBestellung = isBestellungAppointmentId(appointment.id);
        const bestellDefaultDate = employee.startDate
          ? formatDocumentOutputDate(employee.startDate)
          : globalDate;

        const selectedAppDocs = appointment.documents.filter((doc) =>
          employee.selectedAppointmentDocIds.includes(doc.id),
        );
        for (const doc of selectedAppDocs) {
          const logicalPath = `appointments/${appointment.id}/${doc.fileName}`;
          const objectKey = templateKeyMap.get(logicalPath);
          if (!objectKey) {
            return {
              success: false,
              error: `Template not found: ${logicalPath}`,
            };
          }
          // #8 — Per-Doc-Override sticht; sonst Bestell-Default (startDate) bei
          // Bestellungen, ansonsten der globale Generator-Datum-Wert.
          const override = perDocDates[documentDateKey(employee.id, doc.id)];
          const docDate = override
            ? formatDocumentOutputDate(override) || globalDate
            : isBestellung
              ? bestellDefaultDate
              : globalDate;
          const appointmentTemplateData: TemplateData = isBestellung
            ? {
                ...templateData,
                currentDate: docDate,
                BestellDatum: docDate,
                Unterschriftspflichtig: "Ja",
              }
            : {
                ...templateData,
                currentDate: docDate,
              };
          try {
            const templateBuffer = await fetchTemplateBufferByKey(objectKey);
            const processedDoc = await handler.process(
              templateBuffer,
              appointmentTemplateData,
            );
            appointmentFolder.file(doc.fileName, processedDoc);
          } catch (err) {
            console.error(
              `Error processing appointment template ${doc.fileName}:`,
              err,
            );
            return {
              success: false,
              error: `Failed to process template "${doc.fileName}" for appointment "${appointment.name}"`,
            };
          }
        }
      }
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    const zipBase64 = zipBuffer.toString("base64");

    return { success: true, zipBase64, timestamp: Date.now() };
  } catch (error) {
    console.error("Error generating employee docs:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate employee documents",
    };
  }
}
