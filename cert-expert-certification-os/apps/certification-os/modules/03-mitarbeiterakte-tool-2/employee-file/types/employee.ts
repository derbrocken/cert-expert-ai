import type { RoleClass } from "../requirement-engine";

export type { RoleClass };

export interface RoleDocument {
  id: string;
  name: string;
  fileName: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  documents: RoleDocument[];
}

export interface AppointmentDocument {
  id: string;
  name: string;
  fileName: string;
}

export interface Appointment {
  id: string;
  name: string;
  description?: string;
  documents: AppointmentDocument[];
}

export interface Employee {
  id: string;
  fullName: string;
  birthday: string;
  startDate: string;
  roleId: string;
  appointmentIds: string[];
  /** IDs of role docs to include (filtered by user) */
  selectedRoleDocIds: string[];
  /** IDs of appointment docs to include (filtered by user) */
  selectedAppointmentDocIds: string[];
  // New fields
  /**
   * Norm-Klassen-Set (EK/FK-Refinement) — primärer Engine-Input. EK + FK frei
   * kombinierbar; Verwaltung/Praktikant/Subunternehmer mit EK/FK kombinierbar
   * (früherer Doppelrolle-Fall). Ersetzt das Einfachfeld `roleClass` + das
   * Doppelrolle-Niveau `zusatzBewachungNiveau` (beide bleiben für Read/Migration).
   */
  roleClasses?: RoleClass[];
  /** @deprecated Einfach-Norm-Klasse (G4) — durch `roleClasses` abgelöst; nur noch Read/Migration. */
  roleClass?: RoleClass;
  /** Org-Titel (Anzeige/Org-Chart) — z. B. SMA, Einsatzleitung. Keine direkte Engine-Wirkung mehr (G4). */
  roleType?: string;
  employmentType?: string;
  qualification?: string;
  trainingHours?: string;
  guardIDNumber?: string;
  employeeIDNumber?: string;
  /** When true, GuardIDNumber is used as the Employee ID */
  useGuardAsEmployeeId?: boolean;
  /** @deprecated Slice-3-Doppelrolle-Niveau — durch `roleClasses` (EK/FK im Set) abgelöst; nur noch Read/Migration. */
  zusatzBewachungNiveau?: "ek" | "fk";
  // Slice 2 — Requirement-Engine inputs
  /** SDL-Katalog-IDs (Geltungsbereich), in denen die Person eingesetzt ist */
  sdlScopes?: string[];
  /** Fährt Dienstfahrzeug? (true/false/undefined = unbekannt) */
  drivesServiceVehicle?: boolean;
  /** Ablaufdatum Erste Hilfe (ISO) — 2-Jahres-Frist (CL-08) */
  ersteHilfeGueltigBis?: string;
  /** Ablaufdatum Brandschutzhelfer (ISO) — 3-Jahres-Frist (CL-23) */
  brandschutzGueltigBis?: string;
  /** Manuell erfasste Ist-UE Jahres-Weiterbildung (laufendes Jahr, §4.19.2) */
  weiterbildungIstUE?: number;
  /** Manuell erfasste Ist-UE je einmaligem/laufendem SDL-Posten (Posten-ID → UE) */
  einmaligIstUE?: Record<string, number>;
}

export interface GlobalProperties {
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  companyLogo?: string; // Base64 string for logo
  documentVersion?: string;
  documentDate?: string;
  createdBy?: string;
  approvedBy?: string;
}

export interface ScannedTemplates {
  roles: Role[];
  appointments: Appointment[];
}
