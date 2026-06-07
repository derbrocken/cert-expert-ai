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
  roleType?: string;
  employmentType?: string;
  qualification?: string;
  trainingHours?: string;
  guardIDNumber?: string;
  employeeIDNumber?: string;
  /** When true, GuardIDNumber is used as the Employee ID */
  useGuardAsEmployeeId?: boolean;
  // Slice 2 — Requirement-Engine inputs
  /** SDL-Katalog-IDs (Geltungsbereich), in denen die Person eingesetzt ist */
  sdlScopes?: string[];
  /** Fährt Dienstfahrzeug? (true/false/undefined = unbekannt) */
  drivesServiceVehicle?: boolean;
  /** Ablaufdatum Erste Hilfe (ISO) — 2-Jahres-Frist (CL-08) */
  ersteHilfeGueltigBis?: string;
  /** Ablaufdatum Brandschutzhelfer (ISO) — 3-Jahres-Frist (CL-23) */
  brandschutzGueltigBis?: string;
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
