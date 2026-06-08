/**
 * Unit-Tests für den Audit-XLSX-Builder (Lane B / Pt 2).
 * Lauffähig ohne Browser/Engine:
 *   npx tsx --test modules/03-mitarbeiterakte-tool-2/employee-file/audit-export-xlsx.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import ExcelJS from "exceljs";
import { buildAuditXlsx } from "./audit-export-xlsx";
import {
  AUDIT_EXPORT_DISCLAIMER,
  type AuditExportPerson,
} from "./audit-export-data";

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
      { label: "Jahres-Weiterbildung", value: "Soll 40 / Ist 10 / Rest 30 UE", clauseId: "CL-11" },
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
    openIssues: [
      { label: "Nachweis: Bundesauszug", value: "", status: "fehlt" },
    ],
    ...partial,
  };
}

test("XLSX: zwei Blätter, Disclaimer, Werte + clauseId, Detailzeile", async () => {
  const buf = await buildAuditXlsx([person({ name: "Alice" })]);
  assert.ok(Buffer.isBuffer(buf));
  assert.ok(buf.length > 0, "Buffer nicht leer");

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buf as unknown as ArrayBuffer);

  const ws1 = wb.getWorksheet("Übersicht");
  const ws2 = wb.getWorksheet("Schulungen-Nachweise");
  assert.ok(ws1, "Blatt 'Übersicht' vorhanden");
  assert.ok(ws2, "Blatt 'Schulungen-Nachweise' vorhanden");

  // EC-10-Disclaimer in Zeile 2 beider Blätter.
  assert.equal(ws1!.getCell("A2").value, AUDIT_EXPORT_DISCLAIMER);
  assert.equal(ws2!.getCell("A2").value, AUDIT_EXPORT_DISCLAIMER);

  // Datenzeile (Zeile 5: Titel/Disclaimer/Leer/Header davor).
  assert.equal(ws1!.getCell("A5").value, "Alice");
  // UE-Soll-Spalte (G) trägt die clauseId.
  assert.match(String(ws1!.getCell("G5").value), /CL-11/);

  // Detailblatt: Modul + Nachweis-Dateiname.
  assert.equal(ws2!.getCell("B5").value, "Modul A");
  assert.equal(ws2!.getCell("E5").value, "nachweis.pdf");
});

test("XLSX: mehrere Personen → je eine Übersichtszeile", async () => {
  const buf = await buildAuditXlsx([
    person({ name: "Alice" }),
    person({ name: "Bob", trainingDetail: [] }),
  ]);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buf as unknown as ArrayBuffer);
  const ws1 = wb.getWorksheet("Übersicht");
  assert.equal(ws1!.getCell("A5").value, "Alice");
  assert.equal(ws1!.getCell("A6").value, "Bob");
});

test("XLSX: leere Auswahl liefert valide Datei mit Kopf", async () => {
  const buf = await buildAuditXlsx([]);
  assert.ok(buf.length > 0);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buf as unknown as ArrayBuffer);
  assert.ok(wb.getWorksheet("Übersicht"));
});
