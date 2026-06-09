import type { RoleClass } from "../requirement-engine";
import type { SetKategorie } from "../vorlagen-set-catalog";

export type { RoleClass };
export type { SetKategorie };

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

/**
 * Bestellung (Overlay-Achse, #C / Feedback E) — formale Ernennung, NUR die drei
 * Typen Ersthelfer / Brandschutzhelfer / SiBe. **Begriffs-Modell:** Bestellung
 * (Ernennung) ≠ Schulung (Qualifikationsnachweis). Eine Bestellung ist
 * unterschriftspflichtig (Unterschrifts-Logik). KEINE Schulungen/Unterweisungen
 * unter dieser Achse.
 * - Ersthelfer → CL-08 (Erste Hilfe, 2-Jahres-Frist)
 * - Brandschutzhelfer → CL-23 (Brandschutz, 3-Jahres-Frist)
 * - SiBe → CL-74 (betriebliche Bestellung, Beauftragung ≠ Schulung)
 */
export type BestellungTyp = "ersthelfer" | "brandschutzhelfer" | "sibe";

/**
 * Geschlecht (Lane K) — minimale, **nullable** PII-Angabe, ausschließlich zum
 * bedingten Auslösen des Mutterschutz-Hinweis-Overlays (CL-77, MuSchG,
 * „fachlich prüfen"). Nur `weiblich` triggert das Overlay; keine Engine-/
 * Norm-Wirkung (EC-10). `undefined` = nicht erfasst (kein Overlay).
 */
export type Geschlecht = "weiblich" | "maennlich" | "divers";

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
  /**
   * Set-Kategorie (#D) — eigene **Vorlagen-Achse** (Sicherheitsmitarbeiter /
   * Führungskraft / Bürokraft), leitet das Generator-Core-Vorlagen-Set ab.
   * **≠ Norm-Klasse** `roleClasses` (Engine-Grundset bleibt unberührt) und
   * **≠ Org-Titel** `roleType`.
   *
   * **Persistenz (Lane J A2):** echte persistierte DB-Spalte
   * `setKategorie String?`, **von der Rolle entkoppelt**. Default wird aus
   * `roleId` abgeleitet (`resolveSetKategorie`/`projectSetKategorieFromRoleId`),
   * ist aber manuell überschreibbar + im Generator wählbar. Legacy-Backfill:
   * fehlt die Spalte auf einer Bestandsakte → aus `roleId` ableiten.
   */
  setKategorie?: SetKategorie;
  employmentType?: string;
  /**
   * Qualifikation als strukturiertes Multiselect (#2) — Katalog-IDs aus
   * `qualification-catalog.ts` (höchste Stufe zählt, Zusätze additiv). **Primär**
   * für die Engine. **Persistenz:** keine eigene DB-Spalte — wird über die
   * bestehende `qualification`-String-Spalte als „ · "-Label-Liste round-trip-
   * stabil ge-/entladen (siehe `serializeQualifications`/`parseQualifications` +
   * Repository). Source of Truth im Formular/Modell ist `qualifications`.
   */
  qualifications?: string[];
  /** @deprecated Freitext-Qualifikation — Legacy-/Persistenz-Träger + Anzeige. */
  qualification?: string;
  trainingHours?: string;
  guardIDNumber?: string;
  employeeIDNumber?: string;
  /** When true, GuardIDNumber is used as the Employee ID */
  useGuardAsEmployeeId?: boolean;
  /**
   * Geschlecht (Lane K) — minimale, nullable PII-Angabe. **Einziger Zweck:** das
   * Mutterschutz-Hinweis-Overlay (CL-77, MuSchG, „fachlich prüfen") für
   * **weibliche** MA über ALLE Sets auslösen. Nur `weiblich` triggert das
   * Overlay. Keine Engine-/Norm-Wirkung, kein Auto-Status (EC-10).
   * **Persistenz (Lane K):** echte additive **nullable** DB-Spalte
   * `gender String?` (Muster Lane J). `undefined` = nicht erfasst.
   */
  gender?: Geschlecht;
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
  /** Termin-Planung Schulungen (Queue C) — gezielte gap-fill-Zuweisungen. */
  trainingPlan?: TrainingPlanItem[];
  /**
   * Bestellt als … (#C / Lane J A1) — Multiselect-Akte-Flag der formalen
   * Ernennungen (Ersthelfer/Brandschutzhelfer/SiBe). **Persistenz (A1):** echte
   * persistierte DB-Spalte `bestelltAls Json?`, **unabhängig vom Dokument**
   * (Status oft VOR dem Doc setzbar). Legacy-Backfill: fehlt die Spalte auf einer
   * Bestandsakte, wird tolerant aus `appointmentIds` abgeleitet
   * (`getBestelltAls` in `employee-display-labels.ts`). Unterschriftspflichtig
   * (Unterschrifts-Logik). Bestellung ≠ Schulung. KEIN Auto-Status (EC-10).
   */
  bestelltAls?: BestellungTyp[];
  /**
   * Optionale Verknüpfung Bestellung↔zugrundeliegende Schulung (Lane J A1) —
   * Map BestellungTyp → Referenz (evidenceId/refId des Schulungs-Nachweises).
   * **Nicht blockierend, KEIN Auto-Status** (EC-10): eine gesetzte Verknüpfung
   * erzeugt keinerlei „erfüllt"/„qualifiziert"-Aussage. Nullable/optional.
   */
  bestellungSchulungLink?: Partial<Record<BestellungTyp, string>>;
  /**
   * Persistiertes Generator-Ausgabedatum je Akte (Lane J A3) — globaler Default
   * + Per-Dokument-Overrides (Schlüssel = Vorlagen-`docId`). Ersetzt den
   * bisherigen Session-State in `EmployeeAutomationPage`. Reines Ausgabedatum;
   * KEIN Engine-/Norm-/UE-Eingriff (EC-10). Leeres `global` → „heute".
   */
  generatorDates?: GeneratorDates;
}

/**
 * Persistiertes Generator-Ausgabedatum (Lane J A3). `global` = Default-Datum
 * für alle Dokumente dieser Akte (ISO `YYYY-MM-DD` oder leer = heute).
 * `perDocument` = Override je Dokument, Schlüssel = Vorlagen-`docId`. Reine
 * Ausgabesteuerung; verändert weder Norm-Werte noch die Vorlagen-Verarbeitung.
 */
export interface GeneratorDates {
  global?: string;
  perDocument?: Record<string, string>;
}

/**
 * Termin-Planung Schulungen (Queue C) — ein gezielt zugewiesener Plan-Eintrag
 * (gap-filler). Operative Planungsschicht: KEIN Norm-Soll, kein Auto-Ist. Der
 * `ue`-Wert ist informativ (Katalog-Lehrbaustein bzw. Soll-Posten-Snapshot) und
 * wird NIE automatisch zum Jahres-Soll/Ist aufsummiert.
 */
export interface TrainingPlanItem {
  /** Stabile UID (crypto.randomUUID() bzw. `tp-${Date.now()}-${i}`). */
  id: string;
  /** Herkunft: Katalog-Modul (Gap-Filler) oder Referenz auf einen Engine-Soll-Posten. */
  source: "katalog" | "soll-posten";
  /** Katalog-Modul-ID (bei "katalog") bzw. Soll-Posten-ID (bei "soll-posten"). */
  refId: string;
  /** Snapshot-Label für Anzeige (vom Katalog/Posten übernommen). */
  label: string;
  /** Informativer UE-Wert — KEIN Norm-Soll, nur Anzeige. `null` erlaubt. */
  ue: number | null;
  /** Snapshot der CL (informativ). */
  clauseId: string | null;
  /** Geplantes Datum (ISO YYYY-MM-DD). */
  plannedDate?: string;
  /** Optionale Gültigkeit (ISO) — Zukunfts-Hook (Brandschutz/EH-Muster). */
  validUntil?: string;
  /** Freitext-Notiz (optional). */
  note?: string;
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
