/**
 * Unit-Tests für den Audit-PDF-Builder (Lane B / Pt 2).
 * Lauffähig ohne Browser/Engine:
 *   npx tsx --test modules/03-mitarbeiterakte-tool-2/employee-file/audit-export-pdf.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildAuditPdf } from "./audit-export-pdf";
import type { AuditExportPerson } from "./audit-export-data";

function person(partial: Partial<AuditExportPerson> = {}): AuditExportPerson {
  return {
    name: "Test Person",
    roleType: "Sicherheitsmitarbeiter",
    roleName: "SMA",
    roleClasses: "Einsatzkraft (EK)",
    employmentType: "Vollzeit",
    sdlScopes: "DIN 77200-1 Grunddienste",
    ampelLabel: "In Arbeit — unvollständig",
    ueSoll: "40",
    ueIst: "10",
    ueClauseId: "CL-11",
    nextDeadlineLabel: "Sachkunde",
    nextDeadlineDate: "01.01.2027",
    openCount: 3,
    pflichtSet: [
      { label: "§34a Unterrichtung", value: "", clauseId: "CL-01", status: "fehlt" },
    ],
    fristen: [
      { label: "Erste Hilfe", value: "01.01.2027", clauseId: "CL-08", status: "offen" },
    ],
    schulungSoll: [
      { label: "Jahres-Weiterbildung (DL ≤ 50 %)", value: "Soll 40 / Ist 10 / Rest 30 UE", clauseId: "CL-11" },
    ],
    trainingDetail: [
      {
        modul: "Modul A",
        plannedDate: "01.03.2026",
        status: "geplant",
        proofFileName: "nachweis.pdf",
        clauseId: "CL-11",
      },
    ],
    openIssues: [{ label: "Nachweis: Bundesauszug", value: "", status: "fehlt" }],
    ...partial,
  };
}

function isPdf(buf: Buffer): boolean {
  return buf.subarray(0, 5).toString("latin1") === "%PDF-";
}

test("PDF: %PDF-Header + nicht leer", async () => {
  const buf = await buildAuditPdf([person({ name: "Bob" })]);
  assert.ok(Buffer.isBuffer(buf));
  assert.ok(buf.length > 200, "PDF nicht leer");
  assert.ok(isPdf(buf), "beginnt mit %PDF-");
});

test("PDF: Sonderzeichen (≤, Umlaute, em-dash) brechen nicht", async () => {
  // pdfSafe muss nicht-WinAnsi-Zeichen ersetzen, sonst würde drawText werfen.
  const buf = await buildAuditPdf([
    person({
      name: "Ünal Çağ ≤≥→",
      roleName: "SMA · Übersicht",
    }),
  ]);
  assert.ok(isPdf(buf));
});

test("PDF: mehrere Personen + leere Auswahl bleiben valide", async () => {
  const multi = await buildAuditPdf([person({ name: "A" }), person({ name: "B" })]);
  assert.ok(isPdf(multi));
  const empty = await buildAuditPdf([]);
  assert.ok(isPdf(empty));
});
