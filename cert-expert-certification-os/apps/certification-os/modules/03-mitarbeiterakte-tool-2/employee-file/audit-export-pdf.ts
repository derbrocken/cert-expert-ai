/**
 * Audit-PDF-Builder (Lane B / Pt 2) — pure Funktion `AuditExportPerson[] → Buffer`.
 *
 * Reine JS (`pdf-lib`, KEIN Headless-Chromium) — läuft im Hetzner-systemd-Node.
 * UI-/engine-frei, unit-testbar ohne Browser. Tabellarisch/strukturiert (Default
 * §7); pixelgenaue Overview-Optik wäre Pt 3. EC-10: Disclaimer in Kopf + Fuß
 * jeder Seite; Ampel = rechnerischer Status, nie „bestanden/freigegeben".
 */

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import {
  AUDIT_EXPORT_DISCLAIMER,
  clauseSuffix,
  type AuditExportPerson,
  type AuditExportRow,
} from "./audit-export-data";

const A4: [number, number] = [595.28, 841.89];
const MARGIN = 48;
const GRAY = rgb(0.45, 0.45, 0.45);
const INK = rgb(0.1, 0.1, 0.1);

// CP1252-Zusatzzeichen oberhalb von 0xFF, die die WinAnsi-Font kodieren kann.
const CP1252_EXTRA = new Set(
  Array.from("€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ"),
);

/** WinAnsi-sichere Säuberung: nicht kodierbare Zeichen → ASCII/`?`. */
function pdfSafe(input: string): string {
  const pre = input
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=")
    .replace(/→/g, "->")
    .replace(/↔/g, "<->");
  let out = "";
  for (const ch of pre) {
    const code = ch.codePointAt(0) ?? 0;
    if (code <= 0xff || CP1252_EXTRA.has(ch)) out += ch;
    else out += "?";
  }
  return out;
}

function truncate(s: string, max = 105): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

export async function buildAuditPdf(
  persons: AuditExportPerson[],
): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page: PDFPage = doc.addPage(A4);
  let y = A4[1] - MARGIN;

  const drawFooter = (pg: PDFPage) => {
    pg.drawText(pdfSafe(AUDIT_EXPORT_DISCLAIMER), {
      x: MARGIN,
      y: 26,
      size: 7,
      font,
      color: GRAY,
      maxWidth: A4[0] - 2 * MARGIN,
      lineHeight: 9,
    });
  };

  const newPage = () => {
    drawFooter(page);
    page = doc.addPage(A4);
    y = A4[1] - MARGIN;
  };

  const line = (
    s: string,
    opts: { size?: number; f?: PDFFont; color?: ReturnType<typeof rgb>; indent?: number } = {},
  ) => {
    const size = opts.size ?? 9;
    if (y - (size + 4) < MARGIN + 30) newPage();
    page.drawText(pdfSafe(truncate(s)), {
      x: MARGIN + (opts.indent ?? 0),
      y,
      size,
      font: opts.f ?? font,
      color: opts.color ?? INK,
    });
    y -= size + 4;
  };

  const section = (title: string, rows: AuditExportRow[]) => {
    if (rows.length === 0) return;
    y -= 4;
    line(title, { size: 10, f: bold });
    for (const r of rows) {
      const value = r.value ? `: ${r.value}` : r.status ? `: ${r.status}` : "";
      line(`• ${r.label}${value}${clauseSuffix(r.clauseId)}`, {
        size: 8,
        indent: 10,
        color: INK,
      });
    }
  };

  // Kopf
  line("Audit-Export — Mitarbeiterakten (rechnerischer Stand)", {
    size: 14,
    f: bold,
  });
  line(AUDIT_EXPORT_DISCLAIMER, { size: 7, color: GRAY });
  y -= 6;

  if (persons.length === 0) {
    line("Keine Person ausgewählt.", { size: 10, color: GRAY });
  }

  for (const p of persons) {
    if (y - 60 < MARGIN + 30) newPage();
    y -= 8;
    line(p.name || "Unbenannt", { size: 13, f: bold });
    line(`${p.roleName}${p.roleType ? ` · ${p.roleType}` : ""}`, {
      size: 9,
      color: GRAY,
    });
    line(`Norm-Klasse(n): ${p.roleClasses || "—"}`);
    line(`Beschäftigungsart: ${p.employmentType || "—"}`);
    line(`Geltungsbereiche: ${p.sdlScopes || "—"}`);
    line(`Pflicht-Ampel: ${p.ampelLabel}`, { f: bold });
    line(
      `UE-Soll: ${p.ueSoll}${clauseSuffix(p.ueClauseId)} · UE-Ist: ${p.ueIst}`,
    );
    line(`Nächste Frist: ${p.nextDeadlineLabel} · ${p.nextDeadlineDate}`);
    line(`Offene Punkte: ${p.openCount}`);

    section("Pflicht-Set (abgeleitet)", p.pflichtSet);
    section("Fristen / Termine", p.fristen);
    section("Schulungs-Soll", p.schulungSoll);
    section(
      "Schulungen / Nachweise",
      p.trainingDetail.map((t) => ({
        label: t.modul,
        value: `${t.status}${t.plannedDate ? ` (${t.plannedDate})` : ""}${
          t.proofFileName ? ` — Nachweis: ${t.proofFileName}` : ""
        }`,
        clauseId: t.clauseId,
      })),
    );
    section("Offene Punkte / Prüfbedarf", p.openIssues);
  }

  drawFooter(page);

  const bytes = await doc.save();
  return Buffer.from(bytes);
}
