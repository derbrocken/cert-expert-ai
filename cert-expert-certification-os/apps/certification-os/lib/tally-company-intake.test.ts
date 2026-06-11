/**
 * Unit-Tests P2-A — Company-Tally-Parser.
 *   npx tsx --test lib/tally-company-intake.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseCompanyIntake,
  firstUploadedFile,
  logoExt,
  logoMime,
} from "./tally-company-intake";

const Q = { companyName: "7dM2QA", companyEmail: "blvxao", logo: "J2MA7d" };

function getter(map: Record<string, unknown>) {
  return (id: string) => map[id];
}

test("parseCompanyIntake: Name + E-Mail + Logo-Datei", () => {
  const r = parseCompanyIntake(
    getter({
      "7dM2QA": "  Muster Security GmbH ",
      blvxao: "info@muster.de",
      J2MA7d: [{ url: "https://tally/upload/logo.png", name: "logo.PNG", mimeType: "image/png" }],
    }),
    Q,
  );
  assert.equal(r.companyName, "Muster Security GmbH");
  assert.equal(r.companyEmail, "info@muster.de");
  assert.deepEqual(r.logo, { url: "https://tally/upload/logo.png", ext: "png" });
});

test("parseCompanyIntake: kein Logo → logo null (tolerant)", () => {
  const r = parseCompanyIntake(
    getter({ "7dM2QA": "Firma", blvxao: "", J2MA7d: undefined }),
    Q,
  );
  assert.equal(r.companyName, "Firma");
  assert.equal(r.companyEmail, "");
  assert.equal(r.logo, null);
});

test("firstUploadedFile: Array, Einzelobjekt, leer", () => {
  assert.deepEqual(firstUploadedFile([{ url: "u1" }, { url: "u2" }]), {
    url: "u1",
    name: undefined,
    mimeType: undefined,
  });
  assert.deepEqual(firstUploadedFile({ url: "x", name: "a.jpg" }), {
    url: "x",
    name: "a.jpg",
    mimeType: undefined,
  });
  assert.equal(firstUploadedFile(null), null);
  assert.equal(firstUploadedFile([{ foo: 1 }]), null);
});

test("logoExt: aus Dateiname, aus MIME, Fallback; jpeg→jpg, svg+xml→svg", () => {
  assert.equal(logoExt("logo.png"), "png");
  assert.equal(logoExt("LOGO.JPEG"), "jpg");
  assert.equal(logoExt(undefined, "image/jpeg"), "jpg");
  assert.equal(logoExt(undefined, "image/svg+xml"), "svg");
  assert.equal(logoExt("datei-ohne-endung"), "png");
  assert.equal(logoExt(undefined, undefined), "png");
});

test("logoMime: ContentType-Ableitung", () => {
  assert.equal(logoMime("png"), "image/png");
  assert.equal(logoMime("jpg"), "image/jpeg");
  assert.equal(logoMime("svg"), "image/svg+xml");
  assert.equal(logoMime("webp"), "image/webp");
});
