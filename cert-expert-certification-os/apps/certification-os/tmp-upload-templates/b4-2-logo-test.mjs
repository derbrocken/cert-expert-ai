import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const KEY = "cert-expert-tool2-employee-queue-v1";

await page.goto("http://127.0.0.1:3001/employee-automation");
await page.evaluate((k) => localStorage.removeItem(k), KEY);
await page.reload();
await page.waitForTimeout(1500);

const input = page.locator('input[type="file"]').first();
await input.setInputFiles("/tmp/b4-2-logo-test.png");
await page.waitForTimeout(500);

const beforeReload = await page.evaluate(() => ({
  dropzoneHasFile: !!document.querySelector('input[type="file"]')?.files?.length,
}));

await page.reload();
await page.waitForTimeout(1500);

const afterReload = await page.evaluate((k) => {
  const raw = localStorage.getItem(k);
  const parsed = raw ? JSON.parse(raw) : null;
  return {
    companyLogoInStorage: !!parsed?.globalProps?.companyLogo,
    storageKeys: parsed?.globalProps ? Object.keys(parsed.globalProps) : [],
  };
}, KEY);

console.log(
  JSON.stringify({
    logoFilePersistence: {
      selectedBeforeReload: beforeReload,
      companyLogoAfterReload: afterReload.companyLogoInStorage,
      persistedInLocalStorage: afterReload.companyLogoInStorage,
      survivesReload: false,
    },
    mvpRequired: false,
    note: "logoFile is React state only; saveEmployeeQueue persists globalProps without syncing logoFile to companyLogo",
  }),
);

await browser.close();
