/**
 * Unit-Tests P2-A — Company-Tally-Parser.
 *   npx tsx --test lib/tally-company-intake.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseCompanyIntake,
  parseCompanyDocuments,
  firstUploadedFile,
  findLogoFile,
  logoExt,
  logoMime,
  type IntakeField,
} from "./tally-company-intake";
import {
  COMPANY_DOCUMENT_CATALOG,
  COMPANY_DOCUMENT_IDS,
  isKnownCompanyDocumentId,
} from "./company-documents-catalog";

const Q = { companyName: "7dM2QA", companyEmail: "blvxao", logo: "J2MA7d" };

function f(
  questionId: string,
  type: string,
  value: unknown,
  label = "",
): IntakeField {
  return { questionId, type, label, value };
}

test("parseCompanyIntake: Name + E-Mail + Logo im konfigurierten Feld", () => {
  const r = parseCompanyIntake(
    [
      f("7dM2QA", "INPUT_TEXT", "  Muster GmbH "),
      f("blvxao", "INPUT_EMAIL", "info@muster.de"),
      f("J2MA7d", "FILE_UPLOAD", [{ url: "u/logo.png", name: "logo.PNG" }], "10. Logo"),
    ],
    Q,
  );
  assert.equal(r.companyName, "Muster GmbH");
  assert.equal(r.companyEmail, "info@muster.de");
  assert.deepEqual(r.logo, { url: "u/logo.png", ext: "png" });
});

test("findLogoFile-Fallback: Logo in unbeschriftetem Feld via Dateiname (realer Fall lN267B)", () => {
  const fields = [
    f("AlyLkk", "FILE_UPLOAD", [{ url: "u/p.pdf", name: "Prämienzahlung.pdf" }], "1. Unbedenklichkeit"),
    f("lN267B", "FILE_UPLOAD", [{ url: "u/weiss-Logo.jpg", name: "weiss Logo.jpg" }], ""),
    f("J2MA7d", "FILE_UPLOAD", [], "10. Logo des Unternehmens."), // leer
  ];
  const r = parseCompanyIntake(fields, Q);
  assert.deepEqual(r.logo, { url: "u/weiss-Logo.jpg", ext: "jpg" });
});

test("findLogoFile-Fallback: Logo via Label-Treffer wenn Dateiname neutral", () => {
  const file = findLogoFile(
    [f("xx", "FILE_UPLOAD", [{ url: "u/datei.png", name: "datei.png" }], "Firmen-Logo hochladen")],
    "J2MA7d",
  );
  assert.equal(file?.url, "u/datei.png");
});

test("parseCompanyIntake: kein Logo → null; Pdf ohne Logo-Name wird nicht genommen", () => {
  const r = parseCompanyIntake(
    [
      f("7dM2QA", "INPUT_TEXT", "Firma"),
      f("AlyLkk", "FILE_UPLOAD", [{ url: "u/vertrag.pdf", name: "vertrag.pdf" }], "1. Unbedenklichkeit"),
    ],
    Q,
  );
  assert.equal(r.companyName, "Firma");
  assert.equal(r.logo, null);
});

test("firstUploadedFile: Array, Einzelobjekt, leer", () => {
  assert.equal(firstUploadedFile([{ url: "u1" }])?.url, "u1");
  assert.equal(firstUploadedFile({ url: "x" })?.url, "x");
  assert.equal(firstUploadedFile(null), null);
  assert.equal(firstUploadedFile([{ foo: 1 }]), null);
});

// ── P2-B — Firmen-Dokumente ──────────────────────────────────────────────────

test("Katalog: 9 Slots, eindeutige documentId + questionId, alle erwarteten Keys", () => {
  assert.equal(COMPANY_DOCUMENT_CATALOG.length, 9);
  const ids = new Set(COMPANY_DOCUMENT_IDS);
  assert.equal(ids.size, 9, "documentId eindeutig");
  const qids = new Set(COMPANY_DOCUMENT_CATALOG.map((d) => d.questionId));
  assert.equal(qids.size, 9, "questionId eindeutig");
  for (const key of [
    "AlyLkk",
    "BG0kvN",
    "kYv6LM",
    "vNKyRQ",
    "KMklX7",
    "LdkWl1",
    "pLvBab",
    "1r678W",
    "MAMzBX",
  ]) {
    assert.ok(qids.has(key), `questionId ${key} im Katalog`);
  }
  assert.ok(isKnownCompanyDocumentId("handelsregister"));
  assert.ok(!isKnownCompanyDocumentId("nope"));
});

test("parseCompanyDocuments: extrahiert vorhandene Dokumente, überspringt fehlende", () => {
  const docs = parseCompanyDocuments(
    [
      f("AlyLkk", "FILE_UPLOAD", [{ url: "u/unb.pdf", name: "Unbedenklich.pdf" }], "1. Unbedenklichkeit"),
      f("vNKyRQ", "FILE_UPLOAD", [{ url: "u/hr.pdf", name: "HR-Auszug.pdf", mimeType: "application/pdf" }], "Handelsregister"),
      f("KMklX7", "FILE_UPLOAD", [], "Bewachungserlaubnis"), // leer → übersprungen
    ],
    COMPANY_DOCUMENT_CATALOG,
  );
  assert.equal(docs.length, 2);
  const unb = docs.find((d) => d.documentId === "unbedenklichkeit-1");
  assert.equal(unb?.url, "u/unb.pdf");
  assert.equal(unb?.fileName, "Unbedenklich.pdf");
  assert.equal(unb?.mimeType, "application/pdf");
  assert.ok(docs.find((d) => d.documentId === "handelsregister"));
  assert.ok(!docs.find((d) => d.documentId === "bewachungserlaubnis"));
});

test("parseCompanyDocuments: leeres Formular → []; Fallback-Dateiname + MIME aus Endung", () => {
  assert.deepEqual(parseCompanyDocuments([], COMPANY_DOCUMENT_CATALOG), []);
  const docs = parseCompanyDocuments(
    [f("LdkWl1", "FILE_UPLOAD", [{ url: "u/x" }], "Versicherung")], // kein name/mime
    COMPANY_DOCUMENT_CATALOG,
  );
  assert.equal(docs.length, 1);
  assert.equal(docs[0].fileName, "versicherung.pdf");
  assert.equal(docs[0].mimeType, "application/pdf");
});

test("logoExt + logoMime", () => {
  assert.equal(logoExt("logo.png"), "png");
  assert.equal(logoExt("LOGO.JPEG"), "jpg");
  assert.equal(logoExt(undefined, "image/svg+xml"), "svg");
  assert.equal(logoExt("x"), "png");
  assert.equal(logoMime("jpg"), "image/jpeg");
  assert.equal(logoMime("svg"), "image/svg+xml");
  assert.equal(logoMime("png"), "image/png");
});
