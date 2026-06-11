"use server";

import sizeOf from "image-size";
import { TemplateData, TemplateHandler } from "easy-template-x";
import JSZip from "jszip";
import {
  listTemplateFiles,
  buildLatestTemplateKeyMap,
  fetchTemplateBufferByKey,
} from "@/lib/template-storage";
import {
  LOGO_MAX_BYTES,
  LOGO_MAX_SIZE_LABEL,
} from "@/lib/constants/logo-upload";
import { getExportSettings } from "@/lib/employee-file-repository";
import { planDocuments } from "./model-document-plan";
import { resolveTool1LogoSource, decodeDataUrl } from "./tool1-company-profile";

export type GenerateState = {
  success: boolean;
  zipBase64?: string;
  error?: string;
  /** Übersprungene Vorlagen (defekt/nicht verarbeitbar) — ZIP enthält den Rest. */
  skipped?: string[];
  timestamp?: string | number;
};

export async function generateDocument(
  prevState: GenerateState,
  formData: FormData,
): Promise<GenerateState> {
  try {
    const foldersJson = formData.get("folders") as string;
    const selectedFolders: string[] = foldersJson ? JSON.parse(foldersJson) : [];

    if (!selectedFolders || selectedFolders.length === 0) {
      return {
        success: false,
        error: "Bitte mindestens einen Standard-Model-Ordner auswählen.",
      };
    }

    const excludedJson = formData.get("excludedDocIds") as string;
    const excludedDocIds: Set<string> = new Set(
      excludedJson ? JSON.parse(excludedJson) : [],
    );

    const logoFile = formData.get("logo") as File | null;

    if (logoFile && logoFile.size > 0 && logoFile.size > LOGO_MAX_BYTES) {
      return {
        success: false,
        error: `Logo überschreitet das Limit von ${LOGO_MAX_SIZE_LABEL}.`,
      };
    }

    const docVersion = (formData.get("docVersion") as string) || "";
    const createdBy = (formData.get("createdBy") as string) || "";
    const approvedBy = (formData.get("approvedBy") as string) || "";
    const docDate = (formData.get("docDate") as string) || "";
    const companyName = (formData.get("companyName") as string) || "";
    const companyStreet = (formData.get("companyStreet") as string) || "";
    const companyZip = (formData.get("companyZip") as string) || "";
    const companyCity = (formData.get("companyCity") as string) || "";
    const companyCountry = (formData.get("companyCountry") as string) || "";
    const companyAddressLine =
      (formData.get("companyAddressLine") as string) || "";
    // P1: gewählte Firma → Logo (und Felder, client-seitig vorbefüllt) aus dem
    // zentralen Profil (CompanyExportSettings), sofern kein manuelles Logo da ist.
    const companySlug = (formData.get("companySlug") as string) || "";

    // ── Logo-Quelle auflösen: manueller Upload gewinnt → sonst Firmen-Profil → sonst keins ──
    const hasManualLogo = !!(logoFile && logoFile.size > 0);
    let profileLogoDataUrl: string | undefined;
    if (!hasManualLogo && companySlug) {
      try {
        profileLogoDataUrl = (await getExportSettings(companySlug)).companyLogo;
      } catch (err) {
        console.error("Firmen-Profil konnte nicht geladen werden:", err);
        // kein harter Fehler — ohne Profil-Logo wird einfach keins eingebettet
      }
    }
    const logoSource = resolveTool1LogoSource({
      hasManualLogo,
      hasProfileLogo: !!profileLogoDataUrl,
    });

    // ── Logo (#4: eigenes try/catch → klare Meldung statt generischem Fehler) ──
    let logoData: Buffer | null = null;
    let imageMimeType = "image/png";
    let finalWidth = 0;
    let finalHeight = 0;

    if (logoSource !== "none") {
      try {
        let mime: string;
        if (logoSource === "manual") {
          const arrayBuffer = await logoFile!.arrayBuffer();
          logoData = Buffer.from(arrayBuffer);
          mime = logoFile!.type;
        } else {
          const decoded = decodeDataUrl(profileLogoDataUrl);
          if (!decoded) throw new Error("Profil-Logo nicht dekodierbar");
          logoData = decoded.buffer;
          mime = decoded.mime;
        }

        const supportedMimeTypes = [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/bmp",
          "image/svg+xml",
        ];
        if (supportedMimeTypes.includes(mime)) {
          imageMimeType = mime;
        }

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
        console.error("Logo konnte nicht gelesen werden:", err);
        return {
          success: false,
          error:
            "Logo konnte nicht gelesen werden. Bitte eine gültige PNG/JPG/SVG-Datei verwenden.",
        };
      }
    }

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
      DocVersion: docVersion,
      CreatedBy: createdBy,
      ApprovedBy: approvedBy,
      DocDate: docDate,
      CompanyName: companyName,
      CompanyStreet: companyStreet,
      CompanyZip: companyZip,
      CompanyCity: companyCity,
      CompanyCountry: companyCountry,
      CompanyAddressLine: companyAddressLine,
    };

    const standardModelFiles = await listTemplateFiles("standard-models");
    const templateKeyMap = buildLatestTemplateKeyMap(standardModelFiles);

    const plan = planDocuments(
      templateKeyMap.entries(),
      selectedFolders,
      excludedDocIds,
    );

    // Gewählter Ordner existiert nicht / ist leer in der Storage → harter Fehler.
    if (plan.missingFolders.length > 0) {
      return {
        success: false,
        error: `Ordner nicht gefunden oder leer: ${plan.missingFolders.join(", ")}`,
      };
    }

    // #2: alles abgewählt → kein leeres "Erfolgs"-ZIP, sondern klare Meldung.
    if (plan.items.length === 0) {
      return {
        success: false,
        error: "Keine Dokumente ausgewählt. Bitte mindestens ein Dokument behalten.",
      };
    }

    const handler = new TemplateHandler();
    const zip = new JSZip();
    const skipped: string[] = [];
    const folderHandles = new Map<string, JSZip>();

    // #3: pro Dokument verarbeiten — ein defektes Template wird übersprungen
    // (skip + log), NICHT der ganze Lauf abgebrochen (EC-09-Konsistenz mit Tool-2-Generator).
    for (const item of plan.items) {
      try {
        const templateBuffer = await fetchTemplateBufferByKey(item.key);
        const processedDoc = await handler.process(templateBuffer, templateData);
        let zipFolder = folderHandles.get(item.folderName);
        if (!zipFolder) {
          zipFolder = zip.folder(item.folderName) ?? zip;
          folderHandles.set(item.folderName, zipFolder);
        }
        zipFolder.file(item.fileName, processedDoc);
      } catch (err) {
        console.error(`Vorlage übersprungen: ${item.folderName}/${item.fileName}`, err);
        skipped.push(`${item.folderName}/${item.fileName}`);
      }
    }

    // Alle Dokumente fehlgeschlagen → kein leeres ZIP ausliefern.
    if (skipped.length === plan.items.length) {
      return {
        success: false,
        error: "Keine der ausgewählten Vorlagen konnte verarbeitet werden.",
        skipped,
      };
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    const zipBase64 = zipBuffer.toString("base64");

    return {
      success: true,
      zipBase64,
      skipped: skipped.length > 0 ? skipped : undefined,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Fehler bei der Dokumentgenerierung:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Dokumente konnten nicht generiert werden.",
    };
  }
}
