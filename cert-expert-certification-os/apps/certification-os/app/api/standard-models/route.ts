import { NextResponse } from "next/server";
import {
  listTemplateFiles,
  parseCustomId,
  HetznerStorageNotConfiguredError,
} from "@/lib/template-storage";

interface ScannedDoc {
  id: string;
  name: string;
  fileName: string;
}

interface ScannedFolder {
  id: string;
  name: string;
  documents: ScannedDoc[];
}

export async function GET() {
  try {
    const files = await listTemplateFiles("standard-models");

    const folderMap = new Map<string, ScannedFolder>();

    for (const file of files) {
      const parsed = parseCustomId(file.customId);
      if (!parsed) continue;
      if (parsed.category !== "standard-models") continue;

      if (!folderMap.has(parsed.folderName)) {
        folderMap.set(parsed.folderName, {
          id: parsed.folderName,
          name: formatName(parsed.folderName),
          documents: [],
        });
      }

      if (parsed.fileName === ".folder") continue;
      if (!parsed.fileName.endsWith(".docx")) continue;

      folderMap.get(parsed.folderName)!.documents.push({
        id: `${parsed.folderName}-${parsed.fileName.replace(".docx", "")}`,
        name: formatName(parsed.fileName.replace(".docx", "")),
        fileName: parsed.fileName,
      });
    }

    const folders = Array.from(folderMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    return NextResponse.json({ folders });
  } catch (error) {
    console.error("Error listing standard models:", error);
    if (error instanceof HetznerStorageNotConfiguredError) {
      return NextResponse.json(
        {
          error: "Template storage not configured",
          detail:
            "Set HETZNER_S3_KEY, HETZNER_S3_SECRET, HETZNER_BUCKET_NAME, HETZNER_S3_ENDPOINT, and HETZNER_S3_REGION in .env.local.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: "Failed to list standard models" },
      { status: 500 },
    );
  }
}

function formatName(slug: string): string {
  return slug
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
