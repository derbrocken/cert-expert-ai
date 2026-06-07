export type V1AreaStatus = "active" | "planned" | "working";

export type V1SubtopicStatus =
  | "active"
  | "read-only"
  | "placeholder"
  | "planned"
  | "working";

export interface V1Subtopic {
  id: string;
  title: string;
  status: V1SubtopicStatus;
  /** Existing safe route — display link hint only, not a separate main tab */
  href?: string;
}

export interface V1MainArea {
  id: string;
  title: string;
  description: string;
  status: V1AreaStatus;
  /** Only set when a real customer route exists today */
  href?: string;
  /** Mitarbeiterakte: employee file folders (not generator subtopics) */
  employeeFolders?: V1Subtopic[];
  subtopics: V1Subtopic[];
}

export const V1_SUBTOPIC_STATUS_LABELS: Record<V1SubtopicStatus, string> = {
  active: "Active",
  "read-only": "Read-only",
  placeholder: "Placeholder",
  planned: "Planned",
  working: "Working view",
};

export const V1_AREA_STATUS_LABELS: Record<V1AreaStatus, string> = {
  active: "Active",
  planned: "Planned",
  working: "Working view",
};

/**
 * Customer-facing Cert OS V1 — exactly five main areas.
 * Schulung, Generator, Readiness, Template Upload, Admin are integrated as subtopics.
 */
export const CERT_OS_V1_MAIN_AREAS: V1MainArea[] = [
  {
    id: "dashboard-zkm",
    title: "Dashboard + ZKM",
    description:
      "Zentrale Übersicht für Status, offene Maßnahmen und Steuerungskreis (ZKM).",
    status: "working",
    subtopics: [
      { id: "gesamtstatus", title: "Gesamtstatus", status: "planned" },
      {
        id: "offene-massnahmen",
        title: "Offene Maßnahmen",
        status: "planned",
      },
      { id: "zkm", title: "ZKM / Maßnahmen", status: "planned" },
      { id: "pruefvermerke", title: "Prüfvermerke", status: "planned" },
      { id: "fristen", title: "Fristen / Termine", status: "planned" },
      {
        id: "audit-fortschritt",
        title: "Audit- und Projektfortschritt",
        status: "planned",
      },
      {
        id: "ueberwachungsaudit",
        title: "Überwachungsaudit-Vorbereitung",
        status: "planned",
      },
      {
        id: "offene-risiken",
        title: "Offene Risiken / offene Punkte",
        status: "planned",
      },
    ],
  },
  {
    id: "unternehmensprofil",
    title: "Unternehmensprofil / Unternehmensakte",
    description:
      "Unternehmensbezogene Dokumente und Stammdaten auf Unternehmensebene.",
    status: "planned",
    subtopics: [
      {
        id: "stammdaten",
        title: "Unternehmensstammdaten",
        status: "planned",
      },
      { id: "zertifikate", title: "Zertifikate", status: "planned" },
      { id: "versicherungen", title: "Versicherungen", status: "planned" },
      {
        id: "nachweise",
        title: "Zentrale Nachweise",
        status: "planned",
      },
      { id: "rechtskataster", title: "Rechtskataster", status: "planned" },
      {
        id: "ansprechpartner",
        title: "Ansprechpartner / Rollen im Unternehmen",
        status: "planned",
      },
      {
        id: "dokumente",
        title: "Unternehmensdokumente",
        status: "planned",
      },
      {
        id: "ms-grundlagen",
        title: "Managementsystem-Grundlagen",
        status: "planned",
      },
    ],
  },
  {
    id: "projekte",
    title: "Projekte",
    description:
      "Projektordner für Zertifizierungsprojekte, SDLs, Objekte und Audits.",
    status: "planned",
    subtopics: [
      { id: "projektordner", title: "Projektordner", status: "planned" },
      {
        id: "zertifizierungsprojekt",
        title: "Zertifizierungsprojekt",
        status: "planned",
      },
      { id: "sdl", title: "SDL / Dienstleistung", status: "planned" },
      { id: "objekt", title: "Objekt / Auftrag", status: "planned" },
      { id: "auditpaket", title: "Auditpaket", status: "planned" },
      { id: "projektstatus", title: "Projektstatus", status: "planned" },
      {
        id: "projekt-nachweise",
        title: "Projektbezogene Nachweise",
        status: "planned",
      },
      {
        id: "offene-projektpunkte",
        title: "Offene Projektpunkte",
        status: "planned",
      },
    ],
  },
  {
    id: "mitarbeiterakte",
    title: "Mitarbeiterakte",
    description:
      "Eine fertige Akte je Person — Stammdaten, Rollen, Zusatzbestellungen und Nachweise. Personal erfassen ist getrennt vom Generator (Schritt 2).",
    status: "active",
    href: "/employee-automation",
    subtopics: [
      { id: "stammdaten", title: "Stammdaten", status: "active" },
      {
        id: "beschaeftigung",
        title: "Beschäftigung / Vertrag",
        status: "active",
      },
      { id: "pflichtangaben", title: "Pflichtangaben", status: "active" },
      { id: "pflichtnachweise", title: "Pflichtnachweise", status: "read-only" },
      {
        id: "datenschutz",
        title: "Datenschutz & Verschwiegenheit",
        status: "planned",
      },
      {
        id: "qualifikation",
        title: "Qualifikation / §34a / Sachkunde",
        status: "planned",
      },
      {
        id: "schulung",
        title: "Schulung & Unterweisung",
        status: "placeholder",
      },
      { id: "rollen", title: "Rollen / Zusatzrollen", status: "read-only" },
      { id: "sdl-projekt", title: "SDL-/Projektbezug", status: "read-only" },
      {
        id: "output",
        title: "Generierte Mitarbeiterdokumente",
        status: "read-only",
      },
      {
        id: "offene-punkte",
        title: "Offene Punkte / Nachforderungen",
        status: "read-only",
      },
      {
        id: "readiness",
        title: "Prüfstatus / Readiness",
        status: "read-only",
      },
      { id: "historie", title: "Verlauf / Historie", status: "placeholder" },
    ],
  },
  {
    id: "qm-auditordner",
    title: "QM-Ordner / Auditordner",
    description:
      "QM-Dokumentation, Auditordner, Vorlagen und Tool 1 / QM-Ordner-Generator.",
    status: "working",
    subtopics: [
      { id: "qm-handbuch", title: "QM-Handbuch", status: "planned" },
      { id: "vorgaben", title: "Vorgabedokumente", status: "planned" },
      { id: "auditordner", title: "Auditordner", status: "planned" },
      { id: "nachweisordner", title: "Nachweisordner", status: "planned" },
      {
        id: "dokumentenstruktur",
        title: "Dokumentenstruktur",
        status: "planned",
      },
      {
        id: "tool1",
        title: "Tool 1 / QM-Ordner-Generator",
        status: "active",
        href: "/model-creator",
      },
      {
        id: "template-upload",
        title: "Template Upload / Vorlagenverwaltung",
        status: "active",
        href: "/uploads",
      },
      {
        id: "dokumentenerstellung",
        title: "Dokumentenerstellung",
        status: "active",
        href: "/model-creator",
      },
      { id: "versionen", title: "Versionsstände", status: "planned" },
      { id: "pruefvermerke", title: "Prüfvermerke", status: "planned" },
    ],
  },
];
