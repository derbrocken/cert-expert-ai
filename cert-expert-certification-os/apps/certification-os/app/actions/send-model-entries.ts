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

export interface GeneratedDocument {
  modelId: string;
  modelName: string;
  fileBase64: string;
}

export type GenerateState = {
  success: boolean;
  documents?: GeneratedDocument[];
  zipBase64?: string;
  error?: string;
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
        error: "Please select at least one Standard Model folder",
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
        error: `Logo file exceeds ${LOGO_MAX_SIZE_LABEL} limit`,
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

    let logoData = null;
    let imageMimeType = "image/png";
    let finalWidth = 0;
    let finalHeight = 0;

    if (logoFile && logoFile.size > 0) {
      const arrayBuffer = await logoFile.arrayBuffer();
      logoData = Buffer.from(arrayBuffer);

      const supportedMimeTypes = [
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/bmp",
        "image/svg+xml",
      ];
      if (supportedMimeTypes.includes(logoFile.type)) {
        imageMimeType = logoFile.type;
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

    const handler = new TemplateHandler();
    const zip = new JSZip();
    const generatedDocuments: GeneratedDocument[] = [];

    for (const folderId of selectedFolders) {
      const prefix = `standard-models/${folderId}/`;
      const folderEntries = [...templateKeyMap.entries()].filter(
        ([logicalPath]) =>
          logicalPath.startsWith(prefix) && logicalPath.endsWith(".docx"),
      );

      if (folderEntries.length === 0) {
        return {
          success: false,
          error: `Folder "${folderId}" not found or empty`,
        };
      }

      const folderName = folderId
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      const zipFolder = zip.folder(folderName);

      for (const [logicalPath, key] of folderEntries) {
        const fileName = logicalPath.slice(prefix.length);
        const docId = `${folderId}-${fileName.replace(".docx", "")}`;
        if (excludedDocIds.has(docId)) continue;

        try {
          const templateBuffer = await fetchTemplateBufferByKey(key);
          const processedDoc = await handler.process(templateBuffer, templateData);
          zipFolder?.file(fileName, processedDoc);

          generatedDocuments.push({
            modelId: `${folderId}/${fileName}`,
            modelName: `${folderName} - ${fileName.replace(".docx", "")}`,
            fileBase64: Buffer.from(processedDoc).toString("base64"),
          });
        } catch (err) {
          console.error(`Error processing ${fileName}:`, err);
          return {
            success: false,
            error: `Failed to process template "${fileName}" in "${folderName}"`,
          };
        }
      }
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    const zipBase64 = zipBuffer.toString("base64");

    return {
      success: true,
      documents: generatedDocuments,
      zipBase64,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error generating doc:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate document",
    };
  }
}
