/**
 * Round 3 UI evidence tests (T2-BUG-02/03/08) via Playwright.
 * No secrets used.
 */
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:3001";
const KEY = "cert-expert-tool2-employee-queue-v1";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const results = {};

try {
  await page.goto(`${BASE}/employee-automation`, { waitUntil: "networkidle" });
  await page.evaluate((k) => localStorage.removeItem(k), KEY);

  await page.fill("#fullName", "Round3 UI Employee");
  await page.fill("#roleType", "Allgemein");
  await page.fill("#trainingHours", "24");
  await page.fill("#guardIDNumber", "GRD-R3-001");

  // Role dropdown
  await page.getByRole("button", { name: "Select role" }).click();
  await page.getByRole("option", { name: "Din 77200 1 Allgemeine" }).click();
  await page.waitForTimeout(500);

  results.dropdowns = {
    roleOptionsVisible: await page
      .getByText("01 Jahresweiterbildung DIN 77200 1 24UE")
      .isVisible(),
    coreSelectAll: await page
      .getByRole("button", { name: "Select All" })
      .first()
      .isVisible(),
    coreDeselectAll: await page
      .getByRole("button", { name: "Deselect All" })
      .first()
      .isVisible(),
  };

  // T2-BUG-08: Deselect All then Select All on core docs
  await page.getByRole("button", { name: "Deselect All" }).first().click();
  await page.waitForTimeout(300);
  const struckAfterDeselect = await page
    .locator("button")
    .filter({ hasText: "01 Jahresweiterbildung" })
    .first()
    .evaluate((el) => !!el.querySelector(".line-through"));
  await page.getByRole("button", { name: "Select All" }).first().click();
  await page.waitForTimeout(300);
  const notStruckAfterSelect = await page
    .locator("button")
    .filter({ hasText: "01 Jahresweiterbildung" })
    .first()
    .evaluate((el) => !el.querySelector(".line-through"));

  results.t2bug08 = {
    deselectAllWorked: struckAfterDeselect,
    selectAllWorked: notStruckAfterSelect,
  };

  // Appointment
  await page.getByRole("button", { name: "Select appointment type" }).click();
  await page.getByRole("option", { name: "Unterweisungen" }).click();
  await page.waitForTimeout(400);
  results.appointmentDropdown = await page
    .getByText("Unterweisungsnachweis Allgm. Pflichtunterweisung")
    .isVisible();

  // Birthday / start date via DatePicker text inputs (paste DD.MM.YYYY)
  const dateInputs = page.locator('input[placeholder="Select birthday"], input[placeholder="Select start date"]');
  await dateInputs.nth(0).fill("15.01.1990");
  await dateInputs.nth(0).blur();
  await dateInputs.nth(1).fill("01.01.2026");
  await dateInputs.nth(1).blur();
  await page.waitForTimeout(300);

  // T2-BUG-03 prep: deselect one doc before add
  await page
    .locator("button")
    .filter({ hasText: "01 Jahresweiterbildung DIN 77200 1 24UE" })
    .first()
    .click();
  await page.waitForTimeout(200);

  await page.getByRole("button", { name: "Add Employee" }).click();
  await page.waitForTimeout(800);

  const afterAdd = await page.evaluate((k) => {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : null;
  }, KEY);
  results.t2bug02_add = {
    persisted: !!afterAdd?.employees?.length,
    fullName: afterAdd?.employees?.[0]?.fullName,
    roleId: afterAdd?.employees?.[0]?.roleId,
    docCount: afterAdd?.employees?.[0]?.selectedRoleDocIds?.length,
    excludes24UE: !afterAdd?.employees?.[0]?.selectedRoleDocIds?.some((id) =>
      id.includes("24UE"),
    ),
  };

  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const afterReload = await page.evaluate((k) => {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : null;
  }, KEY);
  results.t2bug02_reload = {
    persisted: afterReload?.employees?.[0]?.fullName === "Round3 UI Employee",
    tableVisible: await page.getByText("Round3 UI Employee").isVisible(),
  };

  // T2-BUG-03: edit, toggle doc, update, reopen
  await page.getByRole("button", { name: "Edit" }).first().click();
  await page.waitForTimeout(800);
  await page
    .locator("button")
    .filter({ hasText: "02 Jahresweiterbildung DIN 77200 1 40UE" })
    .first()
    .click();
  await page.waitForTimeout(200);
  await page.getByRole("button", { name: "Update Employee" }).click();
  await page.waitForTimeout(800);

  const afterUpdate = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), KEY);
  const emp = afterUpdate?.employees?.[0];
  results.t2bug03_update = {
    excludes40UE: !emp?.selectedRoleDocIds?.some((id) => id.includes("40UE")),
    docCount: emp?.selectedRoleDocIds?.length,
  };

  await page.getByRole("button", { name: "Edit" }).first().click();
  await page.waitForTimeout(800);
  const fortyStruck = await page
    .locator("button")
    .filter({ hasText: "02 Jahresweiterbildung" })
    .first()
    .evaluate((el) => !!el.querySelector(".line-through"));
  results.t2bug03_reopen = { doc40UncheckedOnReopen: fortyStruck };

  results.logoFileRisk = {
    logoInGlobalProps: !!afterUpdate?.globalProps?.companyLogo,
  };

  // Uploads page
  await page.goto(`${BASE}/uploads`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  results.uploadsAdmin = {
    rolesFolderVisible: await page.getByText("Din 77200 1 Allgemeine").isVisible(),
    appointmentsFolderVisible: await page.getByText("Unterweisungen").isVisible(),
    docxListed: await page.getByText("01 Jahresweiterbildung").isVisible(),
  };

  console.log(JSON.stringify({ status: "UI_TESTS_DONE", results }, null, 2));
} catch (err) {
  console.log(
    JSON.stringify({
      status: "UI_TESTS_FAILED",
      error: err instanceof Error ? err.message : String(err),
      results,
    }),
  );
  process.exit(1);
} finally {
  await browser.close();
}
