import type { Employee, Appointment } from "@/lib/types/employee";
import {
  appointmentLabelDe,
  roleLabelDe,
  ROLE_LABELS_DE,
} from "./employee-display-labels";

/** Conservative working statuses — no audit/release claims */
export type WorkingItemStatus =
  | "vorhanden"
  | "fehlt"
  | "beantragt"
  | "unvollständig"
  | "nicht lesbar"
  | "abgelaufen"
  | "nicht erforderlich"
  | "fachlich prüfen"
  | "vorbereitet"
  | "offen";

export interface RequirementRow {
  id: string;
  label: string;
  value?: string;
  status: WorkingItemStatus;
  hint?: string;
  /** Condition — why this requirement applies */
  trigger?: string;
}

export const GRUNDROLLE_CATALOG = [
  "SMA / Sicherheitsmitarbeiter",
  "Führungskraft",
  "Einsatzleitung",
  "Objektleitung",
  "Schichtleitung",
  "Bürokraft / Verwaltung",
  "Geschäftsführung",
  "Subunternehmer-SMA",
  "Praktikant / Auszubildender",
] as const;

export const ZUSATZROLLEN_CATALOG = [
  "Ersthelfer",
  "Brandschutzhelfer",
  "Fahrzeugführer",
  "Interventionskraft",
  "Schließmittelberechtigter",
  "Objektleiter",
  "Schichtführer",
  "Führungskraft vor Ort",
  "Unterweisender",
  "Ansprechpartner Auftraggeber",
  "Datenschutzkontakt",
] as const;

/** Document evidence groups only — no training detail duplication */
const PFICHTNACHWEIS_EVIDENCE: {
  id: string;
  label: string;
  always?: boolean;
}[] = [
  { id: "arbeitsvertrag", label: "Arbeitsvertrag / Beschäftigungsnachweis", always: true },
  { id: "bundesauszug", label: "Bundesauszug Bewacherregister" },
  { id: "u34a", label: "§34a Unterrichtung" },
  { id: "sachkunde", label: "Sachkundeprüfung" },
  { id: "datenschutz", label: "Datenschutz (Nachweis)" },
  { id: "verschwiegenheit", label: "Verschwiegenheit (Nachweis)" },
  { id: "dienstausweis", label: "Dienstausweis" },
  { id: "erste-hilfe", label: "Erste Hilfe (Nachweis)" },
  { id: "brandschutz", label: "Brandschutzhelfer (Nachweis)" },
  { id: "stellenbeschreibung", label: "Stellenbeschreibung / Rollenbeschreibung" },
  { id: "projekt-nachweis", label: "Projektbezogene Nachweise" },
  { id: "schulungsnachweise", label: "Schulungsnachweise" },
  { id: "unterweisungsnachweise", label: "Unterweisungsnachweise" },
];

const SCHULUNG_UNTERWEISUNG_REQUIREMENTS: {
  id: string;
  label: string;
  scopeSensitive?: boolean;
}[] = [
  { id: "allgemein", label: "Allgemeine Unterweisung / Dienstanweisung" },
  { id: "datenschutz-u", label: "Datenschutzunterweisung" },
  { id: "verschwiegenheit-u", label: "Verschwiegenheitsunterweisung" },
  { id: "objekt-u", label: "Objektbezogene Einweisung", scopeSensitive: true },
  { id: "sdl-u", label: "SDL-bezogene Unterweisung", scopeSensitive: true },
  { id: "wiederholung", label: "Wiederholungsunterweisung" },
  { id: "qualifikation", label: "Schulung / Qualifikationsfortschreibung" },
];

export function splitFullName(fullName: string): {
  vorname: string;
  nachname: string;
} {
  const trimmed = fullName.trim();
  if (!trimmed) return { vorname: "", nachname: "" };
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return { vorname: trimmed, nachname: "" };
  return {
    vorname: trimmed.slice(0, idx),
    nachname: trimmed.slice(idx + 1).trim(),
  };
}

export function joinFullName(vorname: string, nachname: string): string {
  return [vorname.trim(), nachname.trim()].filter(Boolean).join(" ");
}

function splitName(fullName: string): { vorname: string; nachname: string } {
  return splitFullName(fullName);
}

function fieldStatus(
  value: string | undefined | null,
  required = true,
): WorkingItemStatus {
  if (!required) return value?.trim() ? "vorhanden" : "nicht erforderlich";
  if (!value?.trim()) return "fehlt";
  return "vorhanden";
}

function isSecurityRole(roleId: string): boolean {
  return (
    roleId.includes("engineer") ||
    roleId.includes("manager") ||
    roleId.includes("analyst") ||
    roleId === "software-engineer" ||
    roleId === "project-manager"
  );
}

function overlayFromAppointments(
  appointments: Appointment[],
  ids: string[],
): string[] {
  return appointments
    .filter((a) => ids.includes(a.id))
    .map((a) => appointmentLabelDe(a.id, a.name));
}

function hasOverlayHint(overlays: string[], ...needles: string[]): boolean {
  const lower = overlays.map((o) => o.toLowerCase());
  return needles.some((n) => lower.some((o) => o.includes(n.toLowerCase())));
}

/** Never treat DIN / document scope labels as Grundrolle display */
export function resolveGrundrolleLabel(
  roleId: string,
  apiName: string,
): string {
  const mapped = roleLabelDe(roleId, apiName);
  const looksLikeScope =
    /77200|din\s/i.test(apiName) || /77200|din\s/i.test(mapped);
  if (looksLikeScope && roleId in ROLE_LABELS_DE) {
    return ROLE_LABELS_DE[roleId];
  }
  if (looksLikeScope) {
    return "— (Scope-Label — Grundrolle fachlich zuordnen)";
  }
  return mapped;
}

export function buildPersonUndRolle(
  employee: Employee,
  companyName: string,
  roleName: string,
  overlayLabels: string[],
): RequirementRow[] {
  return [
    {
      id: "name",
      label: "Name",
      value: employee.fullName || undefined,
      status: fieldStatus(employee.fullName),
    },
    {
      id: "aktiv",
      label: "Aktiver Status",
      value: "aktiv",
      status: "vorbereitet",
      hint: "Working UI — kein HR-System",
    },
    {
      id: "unternehmen",
      label: "Unternehmen",
      value: companyName || undefined,
      status: fieldStatus(companyName),
      hint: "Aus Firmendaten (Upload Manager)",
    },
    {
      id: "grundrolle",
      label: "Grundrolle",
      value: roleName,
      status: employee.roleId ? "vorbereitet" : "fehlt",
      hint: "Rollen-Taxonomie — kein DIN-/Dokumentenlabel",
    },
    {
      id: "bestellungen",
      label: "Bestellungen",
      value:
        overlayLabels.length > 0 ? overlayLabels.join(", ") : undefined,
      status:
        overlayLabels.length > 0 ? "vorbereitet" : "nicht erforderlich",
      hint: "Ergänzen Grundrolle — ersetzen sie nicht",
    },
  ];
}

export function buildPersonUndRollePflichtangaben(
  employee: Employee,
  companyName: string,
  roleName: string,
  overlayLabels: string[],
): RequirementRow[] {
  const roleRows = buildPersonUndRolle(
    employee,
    companyName,
    roleName,
    overlayLabels,
  ).filter((r) => r.id === "grundrolle" || r.id === "bestellungen");

  const pflichtRows = buildPflichtangaben(employee, companyName).filter(
    (r) => r.id !== "eintritt",
  );

  return [...roleRows, ...pflichtRows];
}

export function buildGeltungsbereich(employee: Employee): RequirementRow[] {
  const security = isSecurityRole(employee.roleId);

  return [
    {
      id: "din-1",
      label: "DIN 77200-1 Relevanz",
      status: security ? "fachlich prüfen" : "nicht erforderlich",
      hint: "Bedingung — löst Anforderungen aus",
    },
    {
      id: "din-2",
      label: "DIN 77200-2 Relevanz",
      status: "fachlich prüfen",
      hint: "Scope-abhängig — keine Matrix in diesem Slice",
    },
    {
      id: "sdl",
      label: "SDL / Dienstleistung",
      status: "offen",
    },
    {
      id: "projekt",
      label: "Projekt / Objekt",
      status: "offen",
    },
    {
      id: "objekt-einweisung-pflicht",
      label: "Objektbezogene Einweisung erforderlich",
      status: "fachlich prüfen",
      trigger: "Projekt-/Objektkontext",
    },
    {
      id: "qualifikation",
      label: "Erforderliches Qualifikationsniveau",
      status: "fachlich prüfen",
      hint: "Abhängig von Grundrolle und Geltungsbereich",
    },
    {
      id: "zusatz-schulung",
      label: "Zusätzliche Schulungsanforderung",
      value: employee.trainingHours || undefined,
      status: employee.trainingHours?.trim() ? "vorbereitet" : "offen",
    },
  ];
}

export function buildPflichtangaben(
  employee: Employee,
  companyName: string,
): RequirementRow[] {
  const { vorname, nachname } = splitName(employee.fullName);
  const security = isSecurityRole(employee.roleId);

  return [
    {
      id: "vorname",
      label: "Vorname",
      value: vorname || undefined,
      status: fieldStatus(vorname),
    },
    {
      id: "nachname",
      label: "Nachname",
      value: nachname || undefined,
      status: fieldStatus(nachname),
    },
    {
      id: "geburtsdatum",
      label: "Geburtsdatum",
      value: employee.birthday || undefined,
      status: fieldStatus(employee.birthday),
    },
    {
      id: "eintritt",
      label: "Eintrittsdatum",
      value: employee.startDate || undefined,
      status: fieldStatus(employee.startDate),
    },
    {
      id: "austritt",
      label: "Austrittsdatum",
      status: "nicht erforderlich",
      hint: "Nur bei Beendigung erfassen",
    },
    {
      id: "beschaeftigungsart",
      label: "Beschäftigungsart",
      value: employee.roleType || undefined,
      status: employee.roleType?.trim() ? "vorhanden" : "offen",
    },
    {
      id: "aktiv",
      label: "Aktiver Status",
      value: "aktiv",
      status: "vorbereitet",
    },
    {
      id: "unternehmen",
      label: "Unternehmen",
      value: companyName || undefined,
      status: fieldStatus(companyName),
    },
    {
      id: "bewacher-id",
      label: "Bewacher-ID",
      value: employee.guardIDNumber || undefined,
      status: fieldStatus(employee.guardIDNumber, security),
      hint: "Stammdatenfeld — getrennt vom Bundesauszug (Nachweis)",
    },
    {
      id: "dienst-id",
      label: "Dienstausweisnummer",
      value: employee.employeeIDNumber || undefined,
      status: employee.employeeIDNumber?.trim()
        ? "vorhanden"
        : "nicht erforderlich",
    },
    {
      id: "projekte",
      label: "Projektzuordnung",
      status: "offen",
      hint: "SDL/Projekt-Referenz folgt",
    },
    {
      id: "vertragsbeginn",
      label: "Vertragsbeginn",
      value: employee.startDate || undefined,
      status: fieldStatus(employee.startDate),
    },
  ];
}

export function buildSchulungUnterweisung(
  overlayLabels: string[],
  security: boolean,
): RequirementRow[] {
  const ersthelfer = hasOverlayHint(overlayLabels, "ersthelfer", "erste hilfe");
  const brandschutz = hasOverlayHint(overlayLabels, "brand");

  return SCHULUNG_UNTERWEISUNG_REQUIREMENTS.map((item) => {
    let status: WorkingItemStatus = "offen";
    let trigger: string | undefined;

    if (item.id === "datenschutz-u" || item.id === "verschwiegenheit-u") {
      status = security ? "offen" : "nicht erforderlich";
      trigger = security ? "Grundrolle Bewachung" : undefined;
    } else if (item.scopeSensitive) {
      status = "fachlich prüfen";
      trigger = "Geltungsbereich / SDL / Projekt";
    } else if (item.id === "qualifikation" && ersthelfer) {
      status = "offen";
      trigger = "Bestellung Ersthelfer";
    } else if (item.id === "qualifikation" && brandschutz) {
      status = "offen";
      trigger = "Bestellung Brandschutzhelfer";
    }

    return {
      id: item.id,
      label: item.label,
      status,
      trigger,
      hint: "Anforderung — Nachweis unter Pflichtnachweise",
    };
  });
}

export function buildPflichtnachweise(
  employee: Employee,
  overlayLabels: string[],
  schulungRows: RequirementRow[],
): RequirementRow[] {
  const security = isSecurityRole(employee.roleId);
  const ersthelfer = hasOverlayHint(overlayLabels, "ersthelfer", "erste hilfe");
  const brandschutz = hasOverlayHint(overlayLabels, "brand");

  const openSchulung = schulungRows.filter(
    (r) => r.status === "offen" || r.status === "fachlich prüfen",
  ).length;

  return PFICHTNACHWEIS_EVIDENCE.map((item) => {
    let status: WorkingItemStatus = "fehlt";
    let trigger: string | undefined;
    let hint: string | undefined;

    switch (item.id) {
      case "arbeitsvertrag":
        status = "fehlt";
        hint = "Dokument-Nachweis — nicht Pflichtangabe";
        break;
      case "bundesauszug":
        status = security ? "fehlt" : "fachlich prüfen";
        trigger = security ? "Grundrolle Bewachung" : undefined;
        hint = "Getrennt von Bewacher-ID (Stammdatenfeld)";
        break;
      case "u34a":
      case "sachkunde":
        status = security ? "fachlich prüfen" : "nicht erforderlich";
        trigger = security ? "Grundrolle / Geltungsbereich" : undefined;
        break;
      case "datenschutz":
      case "verschwiegenheit":
      case "dienstausweis":
        status = security ? "fehlt" : "fachlich prüfen";
        break;
      case "erste-hilfe":
        status = ersthelfer ? "fehlt" : "nicht erforderlich";
        trigger = ersthelfer ? "Bestellung Ersthelfer" : undefined;
        break;
      case "brandschutz":
        status = brandschutz ? "fehlt" : "fachlich prüfen";
        trigger = brandschutz
          ? "Bestellung Brandschutzhelfer"
          : "Geltungsbereich DIN 77200-2 / SDL";
        break;
      case "stellenbeschreibung":
      case "projekt-nachweis":
        status = "fachlich prüfen";
        trigger = "Rolle / Projekt-Kontext";
        break;
      case "schulungsnachweise":
        status =
          openSchulung > 0
            ? "fehlt"
            : schulungRows.some((r) => r.id === "qualifikation")
              ? "offen"
              : "nicht erforderlich";
        hint = "Sammel-Nachweisgruppe für Schulungsanforderungen";
        break;
      case "unterweisungsnachweise":
        status = openSchulung > 0 ? "fehlt" : "offen";
        hint = "Sammel-Nachweisgruppe für Unterweisungsanforderungen";
        break;
      default:
        status = item.always ? "fehlt" : "offen";
    }

    return { id: item.id, label: item.label, status, trigger, hint };
  });
}

export function buildOpenIssues(
  pflichtangaben: RequirementRow[],
  geltungsbereich: RequirementRow[],
  nachweise: RequirementRow[],
  schulung: RequirementRow[],
): RequirementRow[] {
  const issues: RequirementRow[] = [];

  const push = (prefix: string, row: RequirementRow) => {
    if (
      row.status === "fehlt" ||
      row.status === "offen" ||
      row.status === "fachlich prüfen"
    ) {
      issues.push({
        id: `${prefix}-${row.id}`,
        label: `${prefix}: ${row.label}`,
        status: row.status,
        hint: row.trigger ?? row.hint,
      });
    }
  };

  for (const row of pflichtangaben) push("Pflichtangabe", row);
  for (const row of geltungsbereich) {
    if (row.status === "fachlich prüfen" || row.status === "offen") {
      push("Geltungsbereich", row);
    }
  }
  for (const row of nachweise) push("Nachweis", row);
  for (const row of schulung) push("Unterweisung", row);

  return issues;
}

export function getEmployeeFileSummary(
  employee: Employee,
  appointments: Appointment[],
  companyName: string,
  roleNameInput: string,
) {
  const roleName = resolveGrundrolleLabel(
    employee.roleId,
    roleNameInput,
  );
  const overlayLabels = overlayFromAppointments(
    appointments,
    employee.appointmentIds,
  );
  const security = isSecurityRole(employee.roleId);

  const personUndRolle = buildPersonUndRolle(
    employee,
    companyName,
    roleName,
    overlayLabels,
  );
  const geltungsbereich = buildGeltungsbereich(employee);
  const pflichtangaben = buildPflichtangaben(employee, companyName);
  const personUndRollePflichtangaben = buildPersonUndRollePflichtangaben(
    employee,
    companyName,
    roleName,
    overlayLabels,
  );
  const schulungUnterweisung = buildSchulungUnterweisung(
    overlayLabels,
    security,
  );
  const pflichtnachweise = buildPflichtnachweise(
    employee,
    overlayLabels,
    schulungUnterweisung,
  );
  const openIssues = buildOpenIssues(
    pflichtangaben,
    geltungsbereich,
    pflichtnachweise,
    schulungUnterweisung,
  );

  return {
    roleName,
    overlayLabels,
    personUndRolle,
    personUndRollePflichtangaben,
    geltungsbereich,
    pflichtangaben,
    pflichtnachweise,
    schulungUnterweisung,
    openIssues,
    missingPflichtangaben: pflichtangaben.filter((r) => r.status === "fehlt")
      .length,
    missingNachweise: pflichtnachweise.filter(
      (r) => r.status === "fehlt" || r.status === "offen",
    ).length,
    fachlichPruefen: [
      ...geltungsbereich,
      ...pflichtnachweise,
      ...schulungUnterweisung,
    ].filter((r) => r.status === "fachlich prüfen").length,
  };
}

// Back-compat aliases for any external imports
export const buildScopeContext = buildGeltungsbereich;
export const buildUnterweisungen = buildSchulungUnterweisung;
