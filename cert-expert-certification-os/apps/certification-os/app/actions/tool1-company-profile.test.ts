/**
 * Unit-Tests P1 — Tool-1 ↔ Firmen-Profil-Brücke.
 *   npx tsx --test app/actions/tool1-company-profile.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mapProfileToTool1Fields,
  resolveTool1LogoSource,
  decodeDataUrl,
} from "./tool1-company-profile";

test("mapProfileToTool1Fields: Profil → Tool-1-Felder (companyAddress → AddressLine)", () => {
  const fields = mapProfileToTool1Fields({
    companyName: "Muster GmbH",
    companyEmail: "info@muster.de",
    companyAddress: "Musterstr. 1, 12345 Berlin",
    documentVersion: "v2.0",
    documentDate: "2026-06-11",
    createdBy: "A. Autor",
    approvedBy: "F. Freigeber",
  });
  assert.deepEqual(fields, {
    companyName: "Muster GmbH",
    companyAddressLine: "Musterstr. 1, 12345 Berlin",
    docVersion: "v2.0",
    docDate: "2026-06-11",
    createdBy: "A. Autor",
    approvedBy: "F. Freigeber",
  });
});

test("mapProfileToTool1Fields: fehlende Optionalfelder → leere Strings (kein undefined)", () => {
  const fields = mapProfileToTool1Fields({
    companyName: "Nur Name",
    companyEmail: "",
    companyAddress: "",
  });
  assert.equal(fields.companyName, "Nur Name");
  assert.equal(fields.companyAddressLine, "");
  assert.equal(fields.docVersion, "");
  assert.equal(fields.docDate, "");
  assert.equal(fields.createdBy, "");
  assert.equal(fields.approvedBy, "");
});

test("resolveTool1LogoSource: manueller Upload gewinnt immer", () => {
  assert.equal(
    resolveTool1LogoSource({ hasManualLogo: true, hasProfileLogo: true }),
    "manual",
  );
  assert.equal(
    resolveTool1LogoSource({ hasManualLogo: true, hasProfileLogo: false }),
    "manual",
  );
});

test("resolveTool1LogoSource: ohne Upload → Profil-Logo, sonst keins", () => {
  assert.equal(
    resolveTool1LogoSource({ hasManualLogo: false, hasProfileLogo: true }),
    "profile",
  );
  assert.equal(
    resolveTool1LogoSource({ hasManualLogo: false, hasProfileLogo: false }),
    "none",
  );
});

test("decodeDataUrl: gültige PNG-data-URL → Buffer + mime", () => {
  // 1x1 transparentes PNG
  const png =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  const decoded = decodeDataUrl(png);
  assert.ok(decoded);
  assert.equal(decoded!.mime, "image/png");
  assert.ok(decoded!.buffer.length > 0);
});

test("decodeDataUrl: jpeg-mime wird übernommen", () => {
  const decoded = decodeDataUrl("data:image/jpeg;base64,/9j/4AAQSkZJRg==");
  assert.ok(decoded);
  assert.equal(decoded!.mime, "image/jpeg");
});

test("decodeDataUrl: null/leer/ungültig → null (kein Wurf)", () => {
  assert.equal(decodeDataUrl(undefined), null);
  assert.equal(decodeDataUrl(null), null);
  assert.equal(decodeDataUrl(""), null);
  assert.equal(decodeDataUrl("nicht-eine-data-url"), null);
  assert.equal(decodeDataUrl("data:image/png;base64,"), null); // leerer Body
});
