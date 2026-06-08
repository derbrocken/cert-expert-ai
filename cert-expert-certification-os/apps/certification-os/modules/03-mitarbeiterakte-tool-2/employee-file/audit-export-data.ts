/**
 * Audit-Datei-Export (Lane B / Pt 2) — plain Datenshape + Konstanten.
 *
 * Bewusst **engine-frei**: dieses Modul importiert KEINE Engine-/Summary-Datei,
 * damit die Builder (`audit-export-xlsx.ts`/`audit-export-pdf.ts`) und ihre
 * Unit-Tests ohne Browser und ohne Engine-Graph laufen. Die Abbildung
 * `getEmployeeFileSummary → AuditExportPerson` lebt in der Server-Action
 * (`generate-audit-export.ts`), die ohnehin die Single Source liest.
 *
 * EC-10 (hart): Der Disclaimer steht in Kopf/Fuß beider Dateien. Es werden KEINE
 * neuen Norm-Werte erzeugt — alle Werte stammen aus der bereits berechneten
 * Summary; jede normbezogene Zeile trägt ihre `clauseId`.
 */

export const AUDIT_EXPORT_DISCLAIMER =
  "Rechnerischer Stand · eingehende Nachweise gelten als ungeprüft (unchecked) · keine Freigabe-/Auditfähigkeits-/Zertifizierungsaussage.";

/** Eine Label/Wert-Zeile (Pflicht-Set, Fristen, offene Punkte …). */
export interface AuditExportRow {
  label: string;
  value: string;
  /** Norm-Fundstelle (CL-xx) — direkt aus der Summary, nicht neu abgeleitet. */
  clauseId?: string | null;
  /** Anzeige-Status (WorkingItemStatus als Text). */
  status?: string;
}

/** Eine Zeile des Schulungs-/Nachweis-Detailblatts (je Plan-Eintrag). */
export interface AuditExportTrainingRow {
  modul: string;
  plannedDate: string;
  /** Operativer Plan-Status (geplant/überfällig/Nachweis vorhanden/ohne Datum). */
  status: string;
  /** Dateiname des Nachweis-Slots (`training-plan:{id}`) oder leer. */
  proofFileName: string;
  clauseId?: string | null;
}

/** Aufbereitete Akte für XLSX/PDF — alles bereits aus der Summary gerechnet. */
export interface AuditExportPerson {
  name: string;
  /** Org-Titel (`roleType`) — reine Anzeige. */
  roleType: string;
  /** Grundrolle (Summary `roleName`). */
  roleName: string;
  /** Norm-Klasse(n) als Labels, kommasepariert. */
  roleClasses: string;
  employmentType: string;
  /** Geltungsbereiche / SDL als Labels, kommasepariert. */
  sdlScopes: string;
  /** Rechnerischer Ampel-Status (EC-10-sicher — nie „bestanden/freigegeben"). */
  ampelLabel: string;
  /** Jahres-Weiterbildung Soll (CL-belegt) als Text, „—" wenn keins. */
  ueSoll: string;
  ueIst: string;
  /** CL der UE-Soll-Spalte (z. B. CL-11) — für die Spaltenfußnote. */
  ueClauseId?: string | null;
  nextDeadlineLabel: string;
  nextDeadlineDate: string;
  openCount: number;
  // Detail-Sektionen (PDF + XLSX-Detailblatt)
  pflichtSet: AuditExportRow[];
  fristen: AuditExportRow[];
  schulungSoll: AuditExportRow[];
  trainingDetail: AuditExportTrainingRow[];
  openIssues: AuditExportRow[];
}

/** Format-Helfer: CL-Suffix für eine Zeile (z. B. „ [CL-11]"). */
export function clauseSuffix(clauseId?: string | null): string {
  if (clauseId === undefined || clauseId === null) return "";
  return ` [${clauseId}]`;
}
