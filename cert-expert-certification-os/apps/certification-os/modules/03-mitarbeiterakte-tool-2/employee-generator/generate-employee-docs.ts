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
  resolveDocDateOverride,
} from "@/modules/03-mitarbeiterakte-tool-2/employee-file/utils/date";
import { isBestellungAppointmentId } from "@/modules/03-mitarbeiterakte-tool-2/employee-file/employee-display-labels";
import {
  buildSetDocumentPlan,
  setKategorieLabel,
  resolveSetKategorie,
  type SetDocumentSpec,
} from "@/modules/03-mitarbeiterakte-tool-2/employee-file/vorlagen-set-catalog";
import { resolveAssignedSchulungDocs } from "@/modules/03-mitarbeiterakte-tool-2/employee-file/training-plan";
import {
  resolveExportRoleIds,
  resolveRoleFolderName,
} from "@/modules/03-mitarbeiterakte-tool-2/employee-file/cross-role-export";

/**
 * Lane K (Batch-2 B) — baut den Set→Dokument-Plan-Manifest-Text für einen MA.
 * Listet Core-Set (aus Set-Kategorie) + bedingte Overlays mit CL/„fachlich
 * prüfen"-Markierung und macht **fehlende Vorlagen** sichtbar (Platzhalter),
 * ohne den ZIP zu brechen (EC-09). Reiner Hinweistext; KEIN Freigabe-/
 * Auditfähigkeits-Wording (EC-10).
 */
function buildSetPlanManifest(
  employee: Employee,
  defaultDateLabel: string,
): string {
  const plan = buildSetDocumentPlan(employee);
  const kategorie = resolveSetKategorie(employee);
  const lines: string[] = [];
  lines.push("Dokumenten-Plan (Set-Kategorie + Overlays)");
  lines.push("================================================");
  lines.push(`Mitarbeiter:in: ${employee.fullName}`);
  lines.push(
    `Set-Kategorie: ${kategorie ? setKategorieLabel(kategorie) : "— nicht gewählt (nur allgemeine Basis) —"}`,
  );
  lines.push(`Default-Datum Standarddokumente: ${defaultDateLabel}`);
  lines.push("");
  const fmt = (d: SetDocumentSpec): string => {
    const flags: string[] = [];
    if (d.clauseId) flags.push(d.clauseId);
    if (d.fachlichPruefen) flags.push("fachlich prüfen");
    if (d.dateSource === "manual") flags.push("Datum: erster Einsatz (manuell)");
    if (d.templateMissing) flags.push("VORLAGE FEHLT → Platzhalter");
    const suffix = flags.length > 0 ? ` [${flags.join(" · ")}]` : "";
    return `  - ${d.label}${suffix}`;
  };
  const core = plan.filter((d) => d.kind === "core");
  const overlay = plan.filter((d) => d.kind === "overlay");
  lines.push("Core-Dokumente (aus Set-Kategorie):");
  for (const d of core) lines.push(fmt(d));
  lines.push("");
  lines.push("Overlays (positionsunabhängig, bedingt):");
  if (overlay.length === 0) lines.push("  (keine)");
  for (const d of overlay) lines.push(fmt(d));
  lines.push("");
  lines.push(
    "Hinweis: Mit »VORLAGE FEHLT« markierte Dokumente liegen noch nicht als",
  );
  lines.push(
    "Vorlage im Generator vor (Platzhalter). Keine Freigabe-/Auditaussage (EC-10).",
  );
  return lines.join("\n");
}

export interface GenerateEmployeeDocsState {
  success: boolean;
  zipBase64?: string;
  error?: string;
  timestamp?: number;
}

/**
 * #10 — Erst-Standardunterweisungen + Erklärungen, deren Default-Ausgabedatum
 * der **erste Arbeitstag** (`startDate`) ist (der MA unterschreibt nach):
 * Datenschutz-Unterweisung/-Erklärung (CL-04), Verschwiegenheits-Unterweisung/
 * -Erklärung (CL-05), Einweisung in die Dienstanweisung (CL-03) und die
 * Arbeitsschutz-Grundunterweisung (CL-75, „fachlich prüfen"). Objektbezogene
 * Unterweisung (CL-22) läuft laut Mark (Q10b) manuell, bis die Projektakte
 * existiert → hier bewusst NICHT auf startDate defaulten.
 * Klassifikation rein über den Dateinamen (Vorlagen liegen in S3, keine festen
 * IDs zur Build-Zeit). Reiner Datums-Default, überschreibbar je Dokument (#8) —
 * keine UE/CL-Wirkung, EC-10: kein Freigabe-/Auditfähigkeits-Wording.
 */
// Nicht exportieren: „use server"-Module dürfen nur async Server-Actions exportieren
// (Next-Build-Regel). Rein modulintern genutzt.
function isErstunterweisungDoc(fileName: string): boolean {
  const f = fileName.toLowerCase();
  return (
    /datenschutz/.test(f) ||
    /verschwiegenheit/.test(f) ||
    /dienstanweisung/.test(f) ||
    /arbeitsschutz/.test(f) ||
    /erstunterweisung/.test(f)
  );
}

/**
 * #8 / Q8 — Generator-Ausgabedatum (`{currentDate}`) auf drei Override-Ebenen
 * steuerbar, plus globaler Default.
 * `global` = Default-Datum für alle Dokumente (ISO `YYYY-MM-DD` oder leer = heute).
 * `perDocument` = Override je **Person+Dokument**, Schlüssel
 *   `documentDateKey(employeeId, docId)`.
 * `perDocType` = Override je **Dokument-Typ** (`documentTypeKey(docId)`), gilt für
 *   ALLE gewählten Personen.
 * Auflösungsreihenfolge (spezifischer sticht): `perDocument` → `perDocType` →
 * (#10/#C-Default bzw.) `global` → heute. Rein das Ausgabedatum; berührt weder
 * Engine/Norm-Werte noch die Vorlagen-Verarbeitung.
 */
export interface DocumentDates {
  global?: string;
  perDocument?: Record<string, string>;
  perDocType?: Record<string, string>;
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
    // Q8 — Datum pro Dokument-Typ (für alle gewählten Personen gleich). Sticht
    // unter dem Person+Doc-Override, aber über #10/#C-Default + global.
    const perDocTypeDates = documentDates?.perDocType ?? {};

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

      // #10 — Default-Datum der Erst-Standardunterweisung/-Erklärung = erster
      // Arbeitstag (`startDate`); fehlt er, der globale Generator-Datum-Wert.
      const erstunterweisungDefaultDate = employee.startDate
        ? formatDocumentOutputDate(employee.startDate)
        : globalDate;

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
        // #D — Fahrtätigkeit-Overlay (positionsunabhängig): Wenn die Person ein
        // Dienstfahrzeug fährt, additiver Platzhalter für die Fahr-/UVV-Anweisung
        // (CL-73, legal-input → „fachlich prüfen", KEIN erfundener Wert).
        // Rein additiv: Vorlagen ohne diese Felder bleiben unberührt (EC-09).
        // EC-10: kein Freigabe-/Auditfähigkeits-Wording.
        Fahrtaetigkeit: employee.drivesServiceVehicle === true ? "Ja" : "",
        FahrAnweisungHinweis:
          employee.drivesServiceVehicle === true
            ? "Fahr-/UVV-Anweisung erforderlich (CL-73, fachlich prüfen)"
            : "",
      };

      // Cross-Rollen-Mix — Rollen-Dokumente werden NICHT mehr nur für die eine
      // primäre Export-Rolle (`employee.roleId`) erzeugt, sondern für **alle**
      // Rollen, deren Dokumente in `employee.selectedRoleDocIds` referenziert
      // sind. So lassen sich Doks aus mehreren Rollen (z. B. SiMa + FK bei einer
      // Doppelrolle-Person) in EINEM Export mischen.
      //
      // ADDITIV/EC-09: Sind nur Doks der primären Rolle gewählt, ist das
      // Ergebnis exakt wie bisher (gleicher `role.name`-Unterordner, gleiche
      // Dateinamen, gleiche Datums-/Vorlagen-Logik). `employee.roleId` bleibt
      // die primäre/Pflicht-Rolle (`RoleType`-Platzhalter unten) — unverändert.
      //
      // Kollisionsfrei: jede Rolle bekommt ihren eigenen Unterordner über
      // `role.name`. Tragen zwei Rollen denselben Namen, wird der Ordnername
      // einmalig um die `role.id` ergänzt (Sicherheitsnetz, kein Normalfall).
      const selectedDocIds = new Set(employee.selectedRoleDocIds);
      // Reihenfolge: primäre Rolle zuerst (stabile, unveränderte Struktur),
      // danach weitere Rollen in Katalog-Reihenfolge — jeweils nur, wenn sie
      // mindestens ein gewähltes Dokument beitragen (reine Auflösung, getestet).
      const exportRoleIds = resolveExportRoleIds(
        roles,
        role.id,
        employee.selectedRoleDocIds,
      );
      const usedRoleFolderNames = new Set<string>();
      for (const exportRoleId of exportRoleIds) {
        const exportRole = roles.find((r) => r.id === exportRoleId);
        if (!exportRole) continue;

        // Kollisionsfreier Ordnername (Normalfall = `role.name`).
        const roleFolderName = resolveRoleFolderName(
          exportRole,
          usedRoleFolderNames,
        );

        const roleFolder = employeeFolder.folder(roleFolderName);
        if (!roleFolder) continue;

        const selectedRoleDocs = exportRole.documents.filter((doc) =>
          selectedDocIds.has(doc.id),
        );
        for (const doc of selectedRoleDocs) {
          const logicalPath = `roles/${exportRole.id}/${doc.fileName}`;
          const objectKey = templateKeyMap.get(logicalPath);
          if (!objectKey) {
            return {
              success: false,
              error: `Template not found: ${logicalPath}`,
            };
          }
          try {
            const templateBuffer = await fetchTemplateBufferByKey(objectKey);
            // #8/#10/Q8 — Auflösung (spezifischer sticht): Person+Doc-Override →
            // Doc-Typ-Override (Q8); sonst bei einer Erst-Standardunterweisung/
            // -Erklärung der erste Arbeitstag (#10), ansonsten der globale
            // Generator-Datum-Wert.
            const roleOverride = resolveDocDateOverride(
              perDocDates,
              perDocTypeDates,
              employee.id,
              doc.id,
            );
            const docDate = roleOverride
              ? formatDocumentOutputDate(roleOverride) || globalDate
              : isErstunterweisungDoc(doc.fileName)
                ? erstunterweisungDefaultDate
                : globalDate;
            const processedDoc = await handler.process(templateBuffer, {
              ...templateData,
              // RoleName bezieht sich auf die jeweils erzeugte Rolle (das Dokument
              // gehört zu `exportRole`), nicht zwingend zur primären Rolle.
              RoleName: exportRole.name,
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
              error: `Failed to process template "${doc.fileName}" for role "${exportRole.name}"`,
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
          // #8/Q8 — Person+Doc-Override → Doc-Typ-Override (Q8) sticht; sonst
          // Bestell-Default (startDate) bei Bestellungen, ansonsten der globale
          // Generator-Datum-Wert.
          const override = resolveDocDateOverride(
            perDocDates,
            perDocTypeDates,
            employee.id,
            doc.id,
          );
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

      // Lane S — zugewiesene DIN-1-Schulungen mitgenerieren: für jeden
      // zugewiesenen Schulungs-Plan-Eintrag (`trainingPlan`, `source:"katalog"`)
      // die zugehörige `appointments/schulungen/`-`.docx` ins ZIP. Datum =
      // `plannedDate` (Durchführung von) bzw. der globale Generator-Datum-Wert.
      // EC-09: fehlt eine Vorlage in S3 (kein Key im Map), wird der Eintrag
      // ÜBERSPRUNGEN (kein ZIP-Bruch). EC-10/CL-11: rein dokumentenerzeugend,
      // kein Auto-Ist, keine Freigabe-/Auditaussage.
      const assignedSchulungen = resolveAssignedSchulungDocs(
        employee.trainingPlan,
      );
      if (assignedSchulungen.length > 0) {
        const schulungenFolder = employeeFolder.folder("Schulungen");
        for (const sch of assignedSchulungen) {
          const objectKey = templateKeyMap.get(sch.logicalPath);
          if (!objectKey) {
            // Vorlage fehlt in S3 → überspringen (EC-09), nicht abbrechen.
            console.warn(
              `Schulungs-Vorlage nicht gefunden, übersprungen: ${sch.logicalPath} (MA: ${employee.fullName})`,
            );
            continue;
          }
          // Dokumentdatum = LETZTER Tag des Durchführungszeitraums
          // (`plannedBis`), falls gesetzt; sonst Durchführung von
          // (`plannedDate`); sonst globaler Default (Mark 2026-06-15).
          // EC-10: reines Durchführungs-/Dokumentdatum, keine Freigabe.
          const effSchulungDate = sch.plannedBis || sch.plannedDate;
          const schulungDate = effSchulungDate
            ? formatDocumentOutputDate(effSchulungDate) || globalDate
            : globalDate;
          try {
            const templateBuffer = await fetchTemplateBufferByKey(objectKey);
            const processedDoc = await handler.process(templateBuffer, {
              ...templateData,
              // Platzhalter wie üblich; ParticipantName als Schulungs-Alias.
              ParticipantName: employee.fullName,
              currentDate: schulungDate,
              SchulungDatum: schulungDate,
            });
            schulungenFolder?.file(sch.fileName, processedDoc);
          } catch (err) {
            // EC-09: ein Fehler an einer Schulungs-Vorlage darf den ZIP NIE
            // brechen — loggen, überspringen, weiter.
            console.error(
              `Error processing Schulungs-Vorlage ${sch.fileName} for ${employee.fullName}:`,
              err,
            );
          }
        }
      }

      // Lane K (Batch-2 B) — Set→Dokument-Plan-Manifest je MA ablegen: macht das
      // Core-Set (aus Set-Kategorie) + bedingte Overlays + fehlende Vorlagen
      // (Platzhalter) sichtbar, ohne die physische Vorlagen-Verarbeitung
      // anzufassen (EC-09). Default-Datum-Label = erster Arbeitstag (startDate)
      // bzw. globaler Generator-Datum-Wert. Reiner Hinweistext (EC-10).
      try {
        employeeFolder.file(
          "_Dokumenten-Plan.txt",
          buildSetPlanManifest(employee, erstunterweisungDefaultDate),
        );
      } catch (err) {
        // Manifest ist additiv/optional — ein Fehler hier darf den ZIP NIE
        // brechen (EC-09). Nur loggen, weiter.
        console.error(
          `Error building set-document manifest for ${employee.fullName}:`,
          err,
        );
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
