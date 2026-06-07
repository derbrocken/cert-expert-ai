/**
 * B4.1 Upload Admin verification — no secrets.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:3001";
const appRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const stagingDocx = join(
  appRoot,
  "tmp-upload-templates/roles/01_Jahresweiterbildung_DIN_77200-1_24UE.docx",
);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const results = {};

try {
  const modelsRes = await page.request.get(`${BASE}/api/standard-models`);
  results.standardModelsApi = {
    status: modelsRes.status(),
    tool1Only: modelsRes.status() === 404,
  };

  const templatesRes = await page.request.get(`${BASE}/api/templates`);
  const templates = await templatesRes.json();
  results.templatesApi = {
    ok: templatesRes.ok(),
    roles: templates.roles?.length ?? 0,
    appointments: templates.appointments?.length ?? 0,
  };

  await page.goto(`${BASE}/uploads`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(4000);
  const body = await page.locator("body").innerText();
  results.uploadsPage = {
    noFailedToast: !body.includes("Failed to load templates"),
    rolesListed: body.includes("Din 77200") || body.includes("din-77200"),
    appointmentsListed: body.includes("Unterweisungen"),
    docxListed: body.includes("Jahresweiterbildung"),
    standardModelsMessage: body.includes("Tool 1"),
    roleCount: (body.match(/\d+ role/g) || [])[0] ?? null,
  };

  await page.screenshot({
    path: join(
      appRoot,
      "../../docs/02-acceptance/evidence/screenshots/B4-1-uploads-admin-list.png",
    ),
    fullPage: true,
  });

  // Upload real DOCX to existing role folder via API (Hetzner)
  const buf = readFileSync(stagingDocx);
  const uploadRes = await page.request.post(`${BASE}/api/uploads`, {
    multipart: {
      category: "roles",
      folderName: "din-77200-1-allgemeine",
      files: {
        name: "01_Jahresweiterbildung_DIN_77200-1_24UE.docx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        buffer: buf,
      },
    },
  });
  let uploadJson = {};
  try {
    uploadJson = await uploadRes.json();
  } catch {
    uploadJson = {};
  }
  results.uploadPost = {
    status: uploadRes.status(),
    ok: uploadRes.ok(),
    message: uploadJson.message ?? uploadJson.error ?? null,
  };

  const templatesAfter = await (
    await page.request.get(`${BASE}/api/templates`)
  ).json();
  const roleFolder = templatesAfter.roles?.find(
    (r) => r.id === "din-77200-1-allgemeine",
  );
  results.listAfterUpload = {
    roleDocCount: roleFolder?.documents?.length ?? 0,
    stillListsRole: !!roleFolder,
  };

  console.log(JSON.stringify({ status: "B4_1_TESTS_DONE", results }, null, 2));
} catch (err) {
  console.log(
    JSON.stringify({
      status: "B4_1_TESTS_FAILED",
      error: err instanceof Error ? err.message : String(err),
      results,
    }),
  );
  process.exit(1);
} finally {
  await browser.close();
}
