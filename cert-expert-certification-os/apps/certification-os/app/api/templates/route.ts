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

/**
 * #C — Bestellungen sauber von Schulungen/Unterweisungen trennen. Bestellungen
 * sind NUR formale Ernennungen (Ersthelfer/Brandschutzhelfer/SiBe). Eine
 * fälschlich unter `appointments/unterweisungen/` abgelegte Unterweisung
 * (`Unterweisungsnachweis_Arbeitsschutz_DGUV.docx`, CL-75) gehört NICHT in die
 * Bestellungen-Liste. Der eigentliche S3-Move (Datei nach Unterweisungen/
 * Schulungen) ist Server/Mark (kein S3-Schreibzugriff hier, geparkt) — bis dahin
 * filtert dieser Read-Pfad solche Unterweisungs-/Schulungs-Ordner defensiv aus,
 * damit die Akte-/Generator-UI keine Unterweisung unter Bestellungen zeigt.
 * EC-09 unberührt: der Generator liest Vorlagen über `listTemplateFiles`, nicht
 * über diese Route.
 */
function isUnterweisungOrSchulungFolder(folderName: string): boolean {
  const n = folderName.toLowerCase();
  return (
    n.includes("unterweisung") ||
    n.includes("schulung") ||
    n.includes("unterrichtung")
  );
}

export async function GET() {
  try {
    const files = await listTemplateFiles();

    const folderMap = new Map<string, ScannedFolder>();

    for (const file of files) {
      const parsed = parseCustomId(file.customId);
      if (!parsed) continue;
      if (parsed.category !== "roles" && parsed.category !== "appointments") continue;

      // #C — Unterweisungs-/Schulungs-Ordner nicht als Bestellung listen.
      if (
        parsed.category === "appointments" &&
        isUnterweisungOrSchulungFolder(parsed.folderName)
      ) {
        continue;
      }

      const mapKey = `${parsed.category}/${parsed.folderName}`;

      // Ensure the folder entry exists (even for .folder placeholders)
      if (!folderMap.has(mapKey)) {
        folderMap.set(mapKey, {
          id: parsed.folderName,
          name: formatName(parsed.folderName),
          documents: [],
        });
      }

      if (parsed.fileName === ".folder") continue;
      if (!parsed.fileName.endsWith(".docx")) continue;

      folderMap.get(mapKey)!.documents.push({
        id: `${parsed.folderName}-${parsed.fileName.replace(".docx", "")}`,
        name: formatName(parsed.fileName.replace(".docx", "")),
        fileName: parsed.fileName,
      });
    }

    const roles: ScannedFolder[] = [];
    const appointments: ScannedFolder[] = [];

    for (const [key, folder] of folderMap) {
      const category = key.split("/")[0];
      if (category === "roles") roles.push(folder);
      else appointments.push(folder);
    }

    roles.sort((a, b) => a.name.localeCompare(b.name));
    appointments.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ roles, appointments });
  } catch (error) {
    console.error("Error listing templates:", error);
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
      { error: "Failed to list templates" },
      { status: 500 },
    );
  }
}

function formatName(slug: string): string {
  return slug
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}