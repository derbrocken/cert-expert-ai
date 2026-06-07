/**
 * Round 3 baseline ZIP test via Hetzner GetObject path.
 * Loads .env.local without printing secrets.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");

function loadEnvLocal() {
  const text = readFileSync(join(appRoot, ".env.local"), "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

loadEnvLocal();

const { generateEmployeeDocs } = await import(
  "../modules/03-mitarbeiterakte-tool-2/employee-generator/generate-employee-docs.ts"
);

const roles = [
  {
    id: "din-77200-1-allgemeine",
    name: "Din 77200 1 Allgemeine",
    documents: [
      {
        id: "din-77200-1-allgemeine-01_Jahresweiterbildung_DIN_77200-1_24UE",
        name: "01 Jahresweiterbildung DIN 77200 1 24UE",
        fileName: "01_Jahresweiterbildung_DIN_77200-1_24UE.docx",
      },
      {
        id: "din-77200-1-allgemeine-02_Jahresweiterbildung_DIN_77200-1_40UE",
        name: "02 Jahresweiterbildung DIN 77200 1 40UE",
        fileName: "02_Jahresweiterbildung_DIN_77200-1_40UE.docx",
      },
    ],
  },
];

const appointments = [
  {
    id: "unterweisungen",
    name: "Unterweisungen",
    documents: [
      {
        id: "unterweisungen-Unterweisungsnachweis_Allgm. Pflichtunterweisung",
        name: "Unterweisungsnachweis Allgm. Pflichtunterweisung",
        fileName: "Unterweisungsnachweis_Allgm. Pflichtunterweisung.docx",
      },
    ],
  },
];

const employees = [
  {
    id: "emp-round3-001",
    fullName: "Round3 Test Employee",
    birthday: "1990-01-15",
    startDate: "2026-01-01",
    roleId: "din-77200-1-allgemeine",
    appointmentIds: ["unterweisungen"],
    selectedRoleDocIds: [
      "din-77200-1-allgemeine-01_Jahresweiterbildung_DIN_77200-1_24UE",
      "din-77200-1-allgemeine-02_Jahresweiterbildung_DIN_77200-1_40UE",
    ],
    selectedAppointmentDocIds: [
      "unterweisungen-Unterweisungsnachweis_Allgm. Pflichtunterweisung",
    ],
  },
];

const globalProps = {
  companyName: "Cert-Expert Round3 Test",
  companyEmail: "test@cert-expert.de",
  companyAddress: "Test Address",
  documentVersion: "v1.0",
  documentDate: "2026-06-05",
  createdBy: "Round3 Retest",
  approvedBy: "Round3 Retest",
};

const result = await generateEmployeeDocs(
  employees,
  globalProps,
  roles,
  appointments,
);

if (!result.success || !result.zipBase64) {
  console.log(
    JSON.stringify({ status: "ZIP_FAILED", error: result.error ?? "unknown" }),
  );
  process.exit(1);
}

const zipBuffer = Buffer.from(result.zipBase64, "base64");
const outDir = join(
  appRoot,
  "../../docs/02-acceptance/evidence/exports",
);
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "baseline-employee.zip");
writeFileSync(outPath, zipBuffer);

console.log(
  JSON.stringify({
    status: "ZIP_SUCCESS",
    zipPath: outPath,
    zipBytes: zipBuffer.length,
    timestamp: result.timestamp,
  }),
);
