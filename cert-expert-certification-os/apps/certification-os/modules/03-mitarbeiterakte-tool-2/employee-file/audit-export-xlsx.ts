/**
 * Audit-XLSX-Builder (Lane B / Pt 2) — pure Funktion `AuditExportPerson[] → Buffer`.
 *
 * UI-frei, engine-frei, unit-testbar ohne Browser. Liest ausschließlich die
 * bereits aufbereiteten `AuditExportPerson`-Daten (Single Source = Summary in der
 * Server-Action). Erzeugt zwei Blätter:
 *  1. „Übersicht"          — 1 Zeile je Person
 *  2. „Schulungen-Nachweise" — 1 Zeile je Plan-Eintrag
 * EC-10: Disclaimer in Kopf beider Blätter; Ampel = rechnerischer Status.
 */

import ExcelJS from "exceljs";
import {
  AUDIT_EXPORT_DISCLAIMER,
  clauseSuffix,
  type AuditExportPerson,
} from "./audit-export-data";

const UEBERSICHT_HEADER = [
  "Name",
  "Org-Titel",
  "Norm-Klasse(n)",
  "Beschäftigungsart",
  "Geltungsbereiche (SDL)",
  "Pflicht-Ampel (rechnerisch)",
  "UE-Soll (Norm-CL)",
  "UE-Ist",
  "Nächste Frist",
  "Frist-Datum",
  "Offene Punkte",
];

const DETAIL_HEADER = [
  "Person",
  "Modul / Soll-Posten",
  "Geplantes Datum",
  "Status",
  "Nachweis-Dateiname",
  "Norm-CL",
];

function styleHeaderRow(row: ExcelJS.Row): void {
  row.font = { bold: true };
}

export async function buildAuditXlsx(
  persons: AuditExportPerson[],
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Cert-Expert Certification OS";
  wb.created = new Date();

  // --- Blatt 1: Übersicht ---
  const ws1 = wb.addWorksheet("Übersicht");
  ws1.addRow(["Audit-Export — Übersicht (rechnerischer Stand)"]);
  ws1.addRow([AUDIT_EXPORT_DISCLAIMER]);
  ws1.addRow([]);
  styleHeaderRow(ws1.addRow(UEBERSICHT_HEADER));

  for (const p of persons) {
    ws1.addRow([
      p.name,
      p.roleType,
      p.roleClasses,
      p.employmentType,
      p.sdlScopes,
      p.ampelLabel,
      `${p.ueSoll}${clauseSuffix(p.ueClauseId)}`,
      p.ueIst,
      p.nextDeadlineLabel,
      p.nextDeadlineDate,
      p.openCount,
    ]);
  }

  ws1.columns.forEach((col) => {
    col.width = 22;
  });

  // --- Blatt 2: Schulungen / Nachweise ---
  const ws2 = wb.addWorksheet("Schulungen-Nachweise");
  ws2.addRow(["Audit-Export — Schulungen / Nachweise (rechnerischer Stand)"]);
  ws2.addRow([AUDIT_EXPORT_DISCLAIMER]);
  ws2.addRow([]);
  styleHeaderRow(ws2.addRow(DETAIL_HEADER));

  for (const p of persons) {
    for (const t of p.trainingDetail) {
      ws2.addRow([
        p.name,
        t.modul,
        t.plannedDate,
        t.status,
        t.proofFileName,
        t.clauseId ?? "",
      ]);
    }
  }

  ws2.columns.forEach((col) => {
    col.width = 26;
  });

  const arrayBuffer = await wb.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer as ArrayBuffer);
}
