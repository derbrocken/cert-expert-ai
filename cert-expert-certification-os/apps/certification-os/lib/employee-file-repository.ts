import type {
  BestellungTyp,
  Employee,
  EvidenceChecks,
  GeneratorDates,
  Geschlecht,
  GlobalProperties,
  TrainingPlanItem,
} from "@/lib/types/employee";
import type {
  CompanyDocumentItem,
  EmployeeFile,
  EvidenceItem,
} from "@prisma/client";
import { Prisma } from "@prisma/client";
import {
  buildCompanyDocumentKey,
  buildCompanyLogoKey,
  buildEvidenceKey,
  deleteCeaObject,
  getCeaObjectBuffer,
  getCeaPresignedUrl,
  isS3Configured,
  parseDataUrl,
  putCeaObject,
} from "@/lib/cea-blob-storage";
import {
  LEGACY_IMPORT_SLUG,
  loadCustomerRegistry,
  matchCompanySlugByName,
} from "@/lib/customer-registry";
import { prisma } from "@/lib/prisma";
import {
  mapRoleTypeToRoleClass,
  resolveRoleClasses,
  type RoleClass,
} from "@/modules/03-mitarbeiterakte-tool-2/employee-file/requirement-engine";
import {
  parseQualifications,
  serializeQualifications,
} from "@/modules/03-mitarbeiterakte-tool-2/employee-file/qualification-catalog";
import { backfillBestelltAls } from "@/modules/03-mitarbeiterakte-tool-2/employee-file/employee-display-labels";
import { normalizeEvidenceChecks } from "@/modules/03-mitarbeiterakte-tool-2/employee-file/training-plan";
import {
  isKnownSetKategorie,
  projectSetKategorieFromRoleId,
  type SetKategorie,
} from "@/modules/03-mitarbeiterakte-tool-2/employee-file/vorlagen-set-catalog";

const QUEUE_MIGRATION_KEY = "cert-expert-tool2-employee-queue-v1";
const EVIDENCE_MIGRATION_KEY = "cert-expert-tool2-employee-evidence-v1";

export interface StoredEvidenceFileDto {
  evidenceId: string;
  fileName: string;
  mimeType: string;
  uploadedAt: string;
  dataUrl?: string;
  previewUrl?: string;
}

export type EmployeeEvidenceMapDto = Record<string, StoredEvidenceFileDto>;

/** P2-B — firmen-ebenes Dokument für die UI (Map documentId → Dto). */
export interface CompanyDocumentDto {
  documentId: string;
  fileName: string;
  mimeType: string;
  uploadedAt: string;
  /** "unchecked" | "geprueft" — EC-10, kein Auto-Status. */
  status: string;
  /** Komfort-Flag: status === "geprueft". */
  checked: boolean;
  checkedBy?: string;
  checkedAt?: string;
  previewUrl?: string;
  dataUrl?: string;
}

export type CompanyDocumentMapDto = Record<string, CompanyDocumentDto>;

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function asNiveau(value: unknown): "ek" | "fk" | undefined {
  return value === "ek" || value === "fk" ? value : undefined;
}

const ROLE_CLASS_VALUES: readonly RoleClass[] = [
  "ek",
  "fk",
  "verwaltung",
  "praktikant",
  "subunternehmer",
];

function asRoleClass(value: unknown): RoleClass | undefined {
  return typeof value === "string" &&
    (ROLE_CLASS_VALUES as readonly string[]).includes(value)
    ? (value as RoleClass)
    : undefined;
}

function asNumberRecord(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
  }
  return out;
}

/**
 * Queue C — robuste Read-Normalisierung des `trainingPlan`-Json (analog
 * `sdlScopes`/`einmaligIstUE`). Nur valide Plan-Einträge übernehmen, unbekannte
 * Felder verwerfen, `source` auf Enum prüfen. Müll/Legacy/null → []. Idempotent.
 */
function asTrainingPlan(value: unknown): TrainingPlanItem[] {
  if (!Array.isArray(value)) return [];
  const out: TrainingPlanItem[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    if (typeof r.id !== "string" || r.id.length === 0) continue;
    if (r.source !== "katalog" && r.source !== "soll-posten") continue;
    if (typeof r.refId !== "string") continue;
    if (typeof r.label !== "string") continue;
    out.push({
      id: r.id,
      source: r.source,
      refId: r.refId,
      label: r.label,
      ue: typeof r.ue === "number" && Number.isFinite(r.ue) ? r.ue : null,
      clauseId: typeof r.clauseId === "string" ? r.clauseId : null,
      plannedDate: typeof r.plannedDate === "string" ? r.plannedDate : undefined,
      plannedBis: typeof r.plannedBis === "string" ? r.plannedBis : undefined,
      validUntil: typeof r.validUntil === "string" ? r.validUntil : undefined,
      note: typeof r.note === "string" ? r.note : undefined,
      // #5 UE-Anerkennung (Variante C) — im trainingPlan-Json mitgeführt (keine
      // neue DB-Spalte). EC-10: extern bleibt Vorschlag, bis `ueBestaetigt`.
      ueAnerkennung:
        r.ueAnerkennung === "eigen-katalog" || r.ueAnerkennung === "extern"
          ? r.ueAnerkennung
          : undefined,
      ueVorschlag:
        typeof r.ueVorschlag === "number" && Number.isFinite(r.ueVorschlag)
          ? r.ueVorschlag
          : undefined,
      ueVorschlagQuelle:
        typeof r.ueVorschlagQuelle === "string" ? r.ueVorschlagQuelle : undefined,
      ueBestaetigt: r.ueBestaetigt === true ? true : undefined,
    });
  }
  return out;
}

const BESTELLUNG_TYP_VALUES: readonly BestellungTyp[] = [
  "ersthelfer",
  "brandschutzhelfer",
  "sibe",
];

/**
 * Lane J (A1) — Read-Normalisierung des `bestelltAls Json?` (Muster
 * `asTrainingPlan`). Liefert immer ein valides `BestellungTyp[]`:
 *  - persistiertes, gültiges Array → übernommen (unbekannte Werte verworfen),
 *  - fehlend/Müll (Bestandsakte vor Migration) → **Legacy-Backfill** aus
 *    `appointmentIds` (tolerant, kein P2023). Idempotent.
 */
function asBestelltAls(
  value: unknown,
  appointmentIds: string[],
): BestellungTyp[] {
  if (Array.isArray(value)) {
    return backfillBestelltAls({
      bestelltAls: value.filter((v): v is BestellungTyp =>
        (BESTELLUNG_TYP_VALUES as readonly string[]).includes(v as string),
      ),
      appointmentIds,
    });
  }
  // Kein persistiertes Feld → aus appointmentIds ableiten (Backfill).
  return backfillBestelltAls({ appointmentIds });
}

/**
 * Lane J (A1) — Read-Normalisierung der optionalen Bestellung↔Schulung-
 * Verknüpfung (`bestellungSchulungLink Json?`). Nur bekannte Bestell-Typen mit
 * String-Referenz. Nicht blockierend, KEIN Auto-Status (EC-10). `undefined`,
 * wenn nichts Valides vorliegt.
 */
function asBestellungSchulungLink(
  value: unknown,
): Partial<Record<BestellungTyp, string>> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const out: Partial<Record<BestellungTyp, string>> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (
      (BESTELLUNG_TYP_VALUES as readonly string[]).includes(k) &&
      typeof v === "string" &&
      v.length > 0
    ) {
      out[k as BestellungTyp] = v;
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/**
 * Lane J (A2) — Read-Normalisierung der `setKategorie String?`-Spalte mit
 * Legacy-Backfill: gültiges persistiertes Feld → Source of Truth (entkoppelt
 * von der Rolle); sonst Default aus `roleId` ableiten; sonst `undefined`.
 */
function asSetKategorie(
  value: unknown,
  roleId: string,
): SetKategorie | undefined {
  if (typeof value === "string" && isKnownSetKategorie(value)) {
    return value;
  }
  return projectSetKategorieFromRoleId(roleId);
}

const GESCHLECHT_VALUES: readonly Geschlecht[] = [
  "weiblich",
  "maennlich",
  "divers",
];

/**
 * Lane K — Read-Normalisierung der `gender String?`-Spalte. Nur bekannte Werte
 * werden übernommen; alles andere (null/Müll/Legacy) → `undefined` (kein
 * Mutterschutz-Overlay). Minimale PII, keine Engine-Wirkung (EC-10).
 */
function asGeschlecht(value: unknown): Geschlecht | undefined {
  return typeof value === "string" &&
    (GESCHLECHT_VALUES as readonly string[]).includes(value)
    ? (value as Geschlecht)
    : undefined;
}

/**
 * Lane J (A3) + Q8 — Read-Normalisierung des `generatorDates Json?` (Muster
 * `asTrainingPlan`/`asNumberRecord`). Nur valide `global`/`perDocument`/
 * `perDocType`-Strings; Müll/Legacy/null → `undefined`. **Tolerant:** Bestands-
 * daten ohne `perDocType` bleiben gültig (kein P2023). Reines Ausgabedatum,
 * kein Engine-Eingriff.
 */
function asGeneratorDates(value: unknown): GeneratorDates | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const r = value as Record<string, unknown>;
  const out: GeneratorDates = {};
  if (typeof r.global === "string" && r.global.length > 0) out.global = r.global;
  const sanitizeMap = (raw: unknown): Record<string, string> | undefined => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
    const m: Record<string, string> = {};
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      if (typeof v === "string" && v.length > 0) m[k] = v;
    }
    return Object.keys(m).length > 0 ? m : undefined;
  };
  const per = sanitizeMap(r.perDocument);
  if (per) out.perDocument = per;
  const perType = sanitizeMap(r.perDocType);
  if (perType) out.perDocType = perType;
  return out.global !== undefined ||
    out.perDocument !== undefined ||
    out.perDocType !== undefined
    ? out
    : undefined;
}

/**
 * P3 / #7 — Read-Normalisierung des `evidenceChecks Json?` (Muster
 * `asGeneratorDates`/`asTrainingPlan`). Delegiert an die reine, dependency-freie
 * `normalizeEvidenceChecks` (auch unit-getestet). Map `evidenceId →
 * { geprueft, am?, von? }`; nur `geprueft === true` zählt (EC-10, kein
 * Auto-Status); Müll/Legacy/null/`{}` → `undefined`. P2023-sicher.
 */
function asEvidenceChecks(value: unknown): EvidenceChecks | undefined {
  return normalizeEvidenceChecks(value);
}

export function employeeFileToEmployee(record: EmployeeFile): Employee {
  return {
    id: record.id,
    fullName: record.fullName,
    birthday: record.birthday,
    startDate: record.startDate,
    roleId: record.roleId,
    appointmentIds: asStringArray(record.appointmentIds),
    selectedRoleDocIds: asStringArray(record.selectedRoleDocIds),
    selectedAppointmentDocIds: asStringArray(record.selectedAppointmentDocIds),
    // EK/FK-Refinement: idempotente Read-Migration → Norm-Klassen-Set. Gefülltes
    // `roleClasses` hat Vorrang; sonst aus Einfach-`roleClass`/Org-Titel + altem
    // Doppelrolle-Niveau (`zusatzBewachungNiveau`) ableiten.
    roleClasses: resolveRoleClasses({
      roleClasses: asStringArray(record.roleClasses),
      roleClass: record.roleClass,
      zusatzBewachungNiveau: record.zusatzBewachungNiveau,
      roleType: record.roleType ?? undefined,
    }),
    // G4 (Legacy): idempotente Read-Migration der Einfach-Klasse — bleibt für
    // Read/Migration erhalten, ist aber nicht mehr die Primärquelle.
    roleClass:
      asRoleClass(record.roleClass) ??
      mapRoleTypeToRoleClass(record.roleType ?? undefined),
    roleType: record.roleType ?? undefined,
    employmentType: record.employmentType ?? undefined,
    // #2: strukturierte Qualifikation aus der bestehenden `qualification`-Spalte
    // ableiten (keine neue DB-Spalte). Round-trip aus serialisierten Labels bzw.
    // tolerante Legacy-/Tally-Freitext-Migration. Verlustfrei: der Freitext
    // bleibt zusätzlich erhalten (`qualification`), unbekannte Reste gehen nicht
    // verloren und greifen weiter über den Engine-Freitext-Fallback.
    qualifications: parseQualifications(record.qualification).ids,
    qualification: record.qualification ?? undefined,
    trainingHours: record.trainingHours ?? undefined,
    guardIDNumber: record.guardIDNumber ?? undefined,
    employeeIDNumber: record.employeeIDNumber ?? undefined,
    useGuardAsEmployeeId: record.useGuardAsEmployeeId ?? undefined,
    // Lane K — Geschlecht (Mutterschutz-Overlay-Trigger CL-77). Tolerant: nur
    // bekannte Werte; sonst `undefined` (kein Overlay).
    gender: asGeschlecht(record.gender),
    zusatzBewachungNiveau: asNiveau(record.zusatzBewachungNiveau),
    sdlScopes: asStringArray(record.sdlScopes),
    drivesServiceVehicle: record.drivesServiceVehicle ?? undefined,
    ersteHilfeGueltigBis: record.ersteHilfeGueltigBis ?? undefined,
    brandschutzGueltigBis: record.brandschutzGueltigBis ?? undefined,
    // M6 (DM6/DM6b) — Austrittsdatum + Erst-Standardunterweisungs-Datum.
    // Nullable/additiv; fehlend → undefined (kein Auto-Status, EC-10).
    exitDate: record.exitDate ?? undefined,
    erstunterweisungDatum: record.erstunterweisungDatum ?? undefined,
    weiterbildungIstUE: record.weiterbildungIstUE ?? undefined,
    einmaligIstUE: asNumberRecord(record.einmaligIstUE),
    trainingPlan: asTrainingPlan(record.trainingPlan),
    // Lane J (A1) — echtes persistiertes Feld + Legacy-Backfill aus
    // `appointmentIds`, falls die Spalte auf einer Bestandsakte fehlt.
    bestelltAls: asBestelltAls(
      record.bestelltAls,
      asStringArray(record.appointmentIds),
    ),
    bestellungSchulungLink: asBestellungSchulungLink(record.bestellungSchulungLink),
    // Lane J (A2) — echtes persistiertes Feld; fehlend → Default aus `roleId`.
    setKategorie: asSetKategorie(record.setKategorie, record.roleId),
    // P3b — gewählte Sammlung (Vorauswahl-Quelle).
    collectionId: record.collectionId ?? undefined,
    // Lane J (A3) — persistiertes Generator-Datum (global + per-Doc).
    generatorDates: asGeneratorDates(record.generatorDates),
    // P3 / #7 — Prüf-Status je Nachweis (Mark D1). Tolerant: fehlend/Müll →
    // undefined (ungeprüft). EC-10: nur menschlich gesetzte „geprüft"-Vermerke.
    evidenceChecks: asEvidenceChecks(record.evidenceChecks),
    // M6 (◆-Herkunft) — Liste der aus Tally befüllten Feld-Keys. Tolerant:
    // fehlend → undefined (keine bekannte Herkunft). EC-10: nur Anzeige.
    tallyImportedKeys: asTallyImportedKeys(record.tallyImportedKeys),
  };
}

/**
 * M6 (◆-Herkunft) — Read-Normalisierung der `tallyImportedKeys Json?`-Spalte.
 * Tolerant: nur ein nicht-leeres String-Array gilt als bekannte Herkunft; sonst
 * `undefined`. Reine Anzeige (EC-10), keine Norm-/Auto-Status-Wirkung.
 */
function asTallyImportedKeys(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const keys = value.filter((v): v is string => typeof v === "string");
  return keys.length > 0 ? keys : undefined;
}

/**
 * #2: Schreibwert für die bestehende `qualification`-Spalte. Strukturierte
 * Auswahl (`qualifications`) ist Source of Truth → als Label-Liste spiegeln;
 * sonst Legacy-/Tally-Freitext unverändert erhalten (verlustfrei, round-trip).
 */
function qualificationColumnValue(employee: Employee): string | null {
  return employee.qualifications && employee.qualifications.length > 0
    ? serializeQualifications(employee.qualifications)
    : (employee.qualification ?? null);
}

function employeeToUpsertData(
  companySlug: string,
  employee: Employee,
): Prisma.EmployeeFileCreateInput {
  return {
    id: employee.id,
    company: { connect: { slug: companySlug } },
    fullName: employee.fullName,
    birthday: employee.birthday,
    startDate: employee.startDate,
    roleId: employee.roleId,
    appointmentIds: employee.appointmentIds,
    selectedRoleDocIds: employee.selectedRoleDocIds,
    selectedAppointmentDocIds: employee.selectedAppointmentDocIds,
    roleClasses: employee.roleClasses ?? [],
    roleClass: employee.roleClass ?? null,
    roleType: employee.roleType ?? null,
    employmentType: employee.employmentType ?? null,
    qualification: qualificationColumnValue(employee),
    trainingHours: employee.trainingHours ?? null,
    guardIDNumber: employee.guardIDNumber ?? null,
    employeeIDNumber: employee.employeeIDNumber ?? null,
    useGuardAsEmployeeId: employee.useGuardAsEmployeeId ?? null,
    // Lane K — Geschlecht (Mutterschutz-Overlay-Trigger). Nullable/additiv.
    gender: employee.gender ?? null,
    zusatzBewachungNiveau: employee.zusatzBewachungNiveau ?? null,
    sdlScopes: employee.sdlScopes ?? [],
    drivesServiceVehicle: employee.drivesServiceVehicle ?? null,
    ersteHilfeGueltigBis: employee.ersteHilfeGueltigBis ?? null,
    brandschutzGueltigBis: employee.brandschutzGueltigBis ?? null,
    // M6 (DM6/DM6b) — Austrittsdatum + Erst-Standardunterweisungs-Datum.
    exitDate: employee.exitDate ?? null,
    erstunterweisungDatum: employee.erstunterweisungDatum ?? null,
    weiterbildungIstUE: employee.weiterbildungIstUE ?? null,
    einmaligIstUE: employee.einmaligIstUE ?? {},
    trainingPlan: (employee.trainingPlan ?? []) as unknown as Prisma.InputJsonValue,
    // Lane J (A1/A2/A3) — neue persistierte Felder (nullable/additiv).
    bestelltAls: (employee.bestelltAls ?? []) as unknown as Prisma.InputJsonValue,
    bestellungSchulungLink: employee.bestellungSchulungLink
      ? (employee.bestellungSchulungLink as unknown as Prisma.InputJsonValue)
      : Prisma.JsonNull,
    setKategorie: employee.setKategorie ?? null,
    collectionId: employee.collectionId ?? null,
    generatorDates: employee.generatorDates
      ? (employee.generatorDates as unknown as Prisma.InputJsonValue)
      : Prisma.JsonNull,
    // P3 / #7 — Prüf-Status je Nachweis (nullable/additiv, P2023-sicher).
    evidenceChecks: employee.evidenceChecks
      ? (employee.evidenceChecks as unknown as Prisma.InputJsonValue)
      : Prisma.JsonNull,
    // M6 (◆-Herkunft) — aus Tally befüllte Feld-Keys (nullable/additiv, EC-10).
    tallyImportedKeys: employee.tallyImportedKeys
      ? (employee.tallyImportedKeys as unknown as Prisma.InputJsonValue)
      : Prisma.JsonNull,
  };
}

/**
 * Lane J (A1/A2/A3) — gemeinsamer Update-Patch für die neuen persistierten
 * Felder (DRY über alle Write-Mapping-Stellen: upsert/replace/migrate).
 * Nullable/additiv; `Prisma.JsonNull` für „nicht gesetzt" (P2023-sicher).
 */
function laneJUpdateFields(employee: Employee) {
  return {
    // Lane K — Geschlecht (Mutterschutz-Overlay-Trigger). Nullable/additiv;
    // über alle Write-Mapping-Stellen (upsert/replace/migrate) DRY mitgeschrieben.
    gender: employee.gender ?? null,
    bestelltAls: (employee.bestelltAls ?? []) as unknown as Prisma.InputJsonValue,
    bestellungSchulungLink: employee.bestellungSchulungLink
      ? (employee.bestellungSchulungLink as unknown as Prisma.InputJsonValue)
      : Prisma.JsonNull,
    setKategorie: employee.setKategorie ?? null,
    collectionId: employee.collectionId ?? null,
    generatorDates: employee.generatorDates
      ? (employee.generatorDates as unknown as Prisma.InputJsonValue)
      : Prisma.JsonNull,
    // P3 / #7 — Prüf-Status je Nachweis, DRY über alle Update-Mapping-Stellen
    // (upsert/replace/migrate). Nullable/additiv (P2023-sicher); EC-10.
    evidenceChecks: employee.evidenceChecks
      ? (employee.evidenceChecks as unknown as Prisma.InputJsonValue)
      : Prisma.JsonNull,
    // M6 (DM6/DM6b) — Austrittsdatum + Erst-Standardunterweisungs-Datum, DRY
    // über alle Update-Mapping-Stellen. Nullable/additiv (P2023-sicher).
    exitDate: employee.exitDate ?? null,
    erstunterweisungDatum: employee.erstunterweisungDatum ?? null,
    // M6 (◆-Herkunft) — Liste der aus Tally befüllten Feld-Keys (String-Array),
    // DRY über alle Update-Pfade. Nullable/additiv; reine Anzeige (EC-10).
    tallyImportedKeys: employee.tallyImportedKeys
      ? (employee.tallyImportedKeys as unknown as Prisma.InputJsonValue)
      : Prisma.JsonNull,
  };
}

export async function ensureCompaniesSeeded(): Promise<void> {
  let registry;
  try {
    registry = loadCustomerRegistry();
  } catch (err) {
    console.error("[ensureCompaniesSeeded] Failed to load customer registry:", err);
    throw err;
  }

  if (registry.length === 0) {
    const message = "[ensureCompaniesSeeded] Registry returned zero active companies";
    console.error(message);
    throw new Error(message);
  }

  for (const project of registry) {
    try {
      await prisma.company.upsert({
        where: { slug: project.slug },
        create: {
          slug: project.slug,
          displayName: project.display_name,
          active: true,
        },
        update: {
          displayName: project.display_name,
          active: true,
        },
      });
    } catch (err) {
      console.error(
        `[ensureCompaniesSeeded] Failed to upsert company "${project.slug}":`,
        err,
      );
      throw err;
    }
  }

  try {
    await prisma.company.upsert({
      where: { slug: LEGACY_IMPORT_SLUG },
      create: {
        slug: LEGACY_IMPORT_SLUG,
        displayName: "Legacy Import (zuweisen)",
        active: true,
      },
      update: {},
    });
  } catch (err) {
    console.error(
      `[ensureCompaniesSeeded] Failed to upsert legacy import company:`,
      err,
    );
    throw err;
  }

  console.info(
    `[ensureCompaniesSeeded] Seeded ${registry.length} registry companies (+ ${LEGACY_IMPORT_SLUG})`,
  );
}

export async function listCompanies() {
  await ensureCompaniesSeeded();
  return prisma.company.findMany({
    where: { active: true, slug: { not: LEGACY_IMPORT_SLUG } },
    orderBy: { displayName: "asc" },
    select: { slug: true, displayName: true },
  });
}

/**
 * ASCII-sicherer Slug aus einem Firmen-Anzeigenamen. Der Slug wird als DB-`@id`
 * UND als S3-Schlüssel-Präfix (`cea/companies/{slug}/…`) verwendet → keine
 * Umlaute/Leerzeichen/Sonderzeichen. „Müller Security GmbH" → „Muller_Security_GmbH".
 */
function slugifyCompanyName(name: string): string {
  const slug = name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug || "Firma";
}

/**
 * Legt eine neue Firma manuell an (UI „Firma anlegen"). Erzeugt einen
 * eindeutigen Slug und eine aktive `Company`-Row. Keine Registry-/Tally-Kopplung:
 * Mitarbeiter werden manuell oder — bei passendem Registry-Alias — per Tally
 * zugeordnet. Idempotent über die Eindeutigkeits-Schleife.
 */
export async function createCompany(
  displayName: string,
): Promise<{ slug: string; displayName: string }> {
  const name = displayName.trim();
  if (!name) {
    throw new Error("Firmenname darf nicht leer sein");
  }
  await ensureCompaniesSeeded();

  const baseSlug = slugifyCompanyName(name);
  let slug = baseSlug;
  let suffix = 2;
  while (await prisma.company.findUnique({ where: { slug } })) {
    slug = `${baseSlug}_${suffix++}`;
  }

  const row = await prisma.company.create({
    data: { slug, displayName: name, active: true },
  });
  return { slug: row.slug, displayName: row.displayName };
}

/**
 * Mitarbeiterzahl je Firma (für die Firmen-Übersicht). Eine `groupBy`-Query
 * statt N Einzelabfragen. Firmen ohne Mitarbeiter fehlen im Ergebnis → der
 * Aufrufer defaultet auf 0.
 */
export async function getEmployeeCountsByCompany(): Promise<
  Record<string, number>
> {
  const groups = await prisma.employeeFile.groupBy({
    by: ["companySlug"],
    _count: { _all: true },
  });
  const counts: Record<string, number> = {};
  for (const g of groups) {
    counts[g.companySlug] = g._count._all;
  }
  return counts;
}

export async function listEmployeeFiles(companySlug: string): Promise<Employee[]> {
  await ensureCompaniesSeeded();
  const rows = await prisma.employeeFile.findMany({
    where: { companySlug },
    orderBy: { fullName: "asc" },
  });
  return rows.map(employeeFileToEmployee);
}

export async function upsertEmployeeFile(
  companySlug: string,
  employee: Employee,
): Promise<Employee> {
  await ensureCompaniesSeeded();
  const data = employeeToUpsertData(companySlug, employee);
  const row = await prisma.employeeFile.upsert({
    where: { id: employee.id },
    create: data,
    update: {
      companySlug,
      fullName: employee.fullName,
      birthday: employee.birthday,
      startDate: employee.startDate,
      roleId: employee.roleId,
      appointmentIds: employee.appointmentIds,
      selectedRoleDocIds: employee.selectedRoleDocIds,
      selectedAppointmentDocIds: employee.selectedAppointmentDocIds,
      roleClasses: employee.roleClasses ?? [],
      roleClass: employee.roleClass ?? null,
      roleType: employee.roleType ?? null,
      employmentType: employee.employmentType ?? null,
      qualification: qualificationColumnValue(employee),
      trainingHours: employee.trainingHours ?? null,
      guardIDNumber: employee.guardIDNumber ?? null,
      employeeIDNumber: employee.employeeIDNumber ?? null,
      useGuardAsEmployeeId: employee.useGuardAsEmployeeId ?? null,
      zusatzBewachungNiveau: employee.zusatzBewachungNiveau ?? null,
      sdlScopes: employee.sdlScopes ?? [],
      drivesServiceVehicle: employee.drivesServiceVehicle ?? null,
      ersteHilfeGueltigBis: employee.ersteHilfeGueltigBis ?? null,
      brandschutzGueltigBis: employee.brandschutzGueltigBis ?? null,
      weiterbildungIstUE: employee.weiterbildungIstUE ?? null,
      einmaligIstUE: employee.einmaligIstUE ?? {},
      trainingPlan: (employee.trainingPlan ?? []) as unknown as Prisma.InputJsonValue,
      ...laneJUpdateFields(employee),
    },
  });
  return employeeFileToEmployee(row);
}

export async function replaceEmployeeFilesForCompany(
  companySlug: string,
  employees: Employee[],
): Promise<void> {
  await ensureCompaniesSeeded();
  const ids = employees.map((e) => e.id);
  await prisma.$transaction(async (tx) => {
    if (ids.length === 0) {
      await tx.employeeFile.deleteMany({ where: { companySlug } });
      return;
    }
    await tx.employeeFile.deleteMany({
      where: {
        companySlug,
        id: { notIn: ids },
      },
    });
    for (const employee of employees) {
      await tx.employeeFile.upsert({
        where: { id: employee.id },
        create: employeeToUpsertData(companySlug, employee),
        update: {
          companySlug,
          fullName: employee.fullName,
          birthday: employee.birthday,
          startDate: employee.startDate,
          roleId: employee.roleId,
          appointmentIds: employee.appointmentIds,
          selectedRoleDocIds: employee.selectedRoleDocIds,
          selectedAppointmentDocIds: employee.selectedAppointmentDocIds,
          roleClasses: employee.roleClasses ?? [],
          roleClass: employee.roleClass ?? null,
          roleType: employee.roleType ?? null,
          employmentType: employee.employmentType ?? null,
          qualification: qualificationColumnValue(employee),
          trainingHours: employee.trainingHours ?? null,
          guardIDNumber: employee.guardIDNumber ?? null,
          employeeIDNumber: employee.employeeIDNumber ?? null,
          useGuardAsEmployeeId: employee.useGuardAsEmployeeId ?? null,
          zusatzBewachungNiveau: employee.zusatzBewachungNiveau ?? null,
          sdlScopes: employee.sdlScopes ?? [],
          drivesServiceVehicle: employee.drivesServiceVehicle ?? null,
          ersteHilfeGueltigBis: employee.ersteHilfeGueltigBis ?? null,
          brandschutzGueltigBis: employee.brandschutzGueltigBis ?? null,
          weiterbildungIstUE: employee.weiterbildungIstUE ?? null,
          einmaligIstUE: employee.einmaligIstUE ?? {},
          trainingPlan: (employee.trainingPlan ?? []) as unknown as Prisma.InputJsonValue,
          ...laneJUpdateFields(employee),
        },
      });
    }
  });
}

export async function deleteEmployeeFile(
  companySlug: string,
  employeeId: string,
): Promise<void> {
  const evidence = await prisma.evidenceItem.findMany({
    where: { employeeFileId: employeeId },
  });
  for (const item of evidence) {
    await deleteCeaObject(item.storageKey);
  }
  await prisma.employeeFile.deleteMany({
    where: { id: employeeId, companySlug },
  });
}

async function logoBufferToDataUrl(
  logoStorageKey: string | null | undefined,
): Promise<string | undefined> {
  if (!logoStorageKey || !isS3Configured()) return undefined;
  const buffer = await getCeaObjectBuffer(logoStorageKey);
  if (!buffer || buffer.length === 0) return undefined;
  const ext = logoStorageKey.split(".").pop()?.toLowerCase();
  const mime =
    ext === "png"
      ? "image/png"
      : ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : ext === "webp"
          ? "image/webp"
          : "image/png";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

export async function getExportSettings(
  companySlug: string,
): Promise<GlobalProperties> {
  await ensureCompaniesSeeded();
  const row = await prisma.companyExportSettings.findUnique({
    where: { companySlug },
  });
  if (!row) {
    const company = await prisma.company.findUnique({
      where: { slug: companySlug },
    });
    return {
      companyName: company?.displayName ?? "",
      companyEmail: "",
      companyAddress: "",
    };
  }
  const companyLogo = await logoBufferToDataUrl(row.logoStorageKey);
  return {
    companyName: row.companyName,
    companyEmail: row.companyEmail,
    companyAddress: row.companyAddress,
    companyLogo,
    documentVersion: row.documentVersion ?? undefined,
    documentDate: row.documentDate ?? undefined,
    createdBy: row.createdBy ?? undefined,
    approvedBy: row.approvedBy ?? undefined,
  };
}

export async function saveExportSettings(
  companySlug: string,
  props: GlobalProperties,
  logoFileBase64?: string | null,
): Promise<GlobalProperties> {
  await ensureCompaniesSeeded();
  let logoStorageKey: string | null | undefined;

  const existing = await prisma.companyExportSettings.findUnique({
    where: { companySlug },
  });
  logoStorageKey = existing?.logoStorageKey ?? null;

  if (logoFileBase64) {
    const parsed = parseDataUrl(logoFileBase64);
    if (parsed && isS3Configured()) {
      const ext =
        parsed.mimeType === "image/jpeg"
          ? "jpg"
          : parsed.mimeType === "image/webp"
            ? "webp"
            : "png";
      const key = buildCompanyLogoKey(companySlug, ext);
      await putCeaObject(key, parsed.buffer, parsed.mimeType);
      if (existing?.logoStorageKey && existing.logoStorageKey !== key) {
        await deleteCeaObject(existing.logoStorageKey);
      }
      logoStorageKey = key;
    }
  } else if (props.companyLogo && isS3Configured()) {
    const parsed = parseDataUrl(props.companyLogo);
    if (parsed) {
      const ext =
        parsed.mimeType === "image/jpeg"
          ? "jpg"
          : parsed.mimeType === "image/webp"
            ? "webp"
            : "png";
      const key = buildCompanyLogoKey(companySlug, ext);
      await putCeaObject(key, parsed.buffer, parsed.mimeType);
      logoStorageKey = key;
    }
  }

  await prisma.companyExportSettings.upsert({
    where: { companySlug },
    create: {
      companySlug,
      companyName: props.companyName,
      companyEmail: props.companyEmail,
      companyAddress: props.companyAddress,
      logoStorageKey,
      documentVersion: props.documentVersion ?? null,
      documentDate: props.documentDate ?? null,
      createdBy: props.createdBy ?? null,
      approvedBy: props.approvedBy ?? null,
    },
    update: {
      companyName: props.companyName,
      companyEmail: props.companyEmail,
      companyAddress: props.companyAddress,
      logoStorageKey,
      documentVersion: props.documentVersion ?? null,
      documentDate: props.documentDate ?? null,
      createdBy: props.createdBy ?? null,
      approvedBy: props.approvedBy ?? null,
    },
  });

  return getExportSettings(companySlug);
}

// ─────────────────────────────────────────────────────────────────────────────
// P2-B — firmen-ebenes Dokumenten-Lager (Company-Tally `Y5Zq80` + manuell).
// Spiegelt das Employee-Evidence-Muster auf Company-Ebene. EC-10: eingehend
// „unchecked"; nur ein bewusster „geprüft"-Klick (setCompanyDocumentChecked)
// macht den Status erfüllt. Ein neuer Upload setzt den Status wieder zurück.
// ─────────────────────────────────────────────────────────────────────────────

async function companyDocumentToDto(
  item: CompanyDocumentItem,
): Promise<CompanyDocumentDto> {
  const previewUrl = await getCeaPresignedUrl(item.storageKey);
  return {
    documentId: item.documentId,
    fileName: item.fileName,
    mimeType: item.mimeType,
    uploadedAt: item.uploadedAt.toISOString(),
    status: item.status,
    checked: item.status === "geprueft",
    checkedBy: item.checkedBy ?? undefined,
    checkedAt: item.checkedAt?.toISOString(),
    previewUrl: previewUrl ?? undefined,
    dataUrl: previewUrl ?? undefined,
  };
}

export async function loadCompanyDocumentsDto(
  companySlug: string,
): Promise<CompanyDocumentMapDto> {
  await ensureCompaniesSeeded();
  const items = await prisma.companyDocumentItem.findMany({
    where: { companySlug },
  });
  const map: CompanyDocumentMapDto = {};
  for (const item of items) {
    map[item.documentId] = await companyDocumentToDto(item);
  }
  return map;
}

export async function saveCompanyDocumentFile(
  companySlug: string,
  documentId: string,
  fileName: string,
  mimeType: string,
  buffer: Buffer,
): Promise<CompanyDocumentDto> {
  if (!isS3Configured()) {
    throw new Error("Hetzner S3 is not configured for company document storage");
  }
  await ensureCompaniesSeeded();
  const storageKey = buildCompanyDocumentKey(companySlug, documentId, fileName);
  await putCeaObject(storageKey, buffer, mimeType || "application/octet-stream");

  const existing = await prisma.companyDocumentItem.findUnique({
    where: { companySlug_documentId: { companySlug, documentId } },
  });
  if (existing?.storageKey && existing.storageKey !== storageKey) {
    await deleteCeaObject(existing.storageKey);
  }

  const row = await prisma.companyDocumentItem.upsert({
    where: { companySlug_documentId: { companySlug, documentId } },
    create: {
      companySlug,
      documentId,
      fileName,
      mimeType: mimeType || "application/octet-stream",
      storageKey,
      status: "unchecked",
      uploadedAt: new Date(),
    },
    // EC-10: neue Datei = neu prüfen → Status zurücksetzen, alte Prüfung löschen.
    update: {
      fileName,
      mimeType: mimeType || "application/octet-stream",
      storageKey,
      status: "unchecked",
      checkedBy: null,
      checkedAt: null,
      uploadedAt: new Date(),
    },
  });

  return companyDocumentToDto(row);
}

export async function removeCompanyDocumentFile(
  companySlug: string,
  documentId: string,
): Promise<void> {
  const row = await prisma.companyDocumentItem.findUnique({
    where: { companySlug_documentId: { companySlug, documentId } },
  });
  if (!row) return;
  await deleteCeaObject(row.storageKey);
  await prisma.companyDocumentItem.delete({
    where: { companySlug_documentId: { companySlug, documentId } },
  });
}

/**
 * P2-B — Prüf-Status eines Firmen-Dokuments setzen (EC-10: bewusster Klick).
 * `checked=true` → status "geprueft" + checkedAt/checkedBy; `false` → zurück auf
 * "unchecked". No-op, wenn kein Dokument vorhanden (man kann nichts Leeres prüfen).
 */
export async function setCompanyDocumentChecked(
  companySlug: string,
  documentId: string,
  checked: boolean,
  von?: string,
): Promise<CompanyDocumentDto | null> {
  const row = await prisma.companyDocumentItem.findUnique({
    where: { companySlug_documentId: { companySlug, documentId } },
  });
  if (!row) return null;
  const updated = await prisma.companyDocumentItem.update({
    where: { companySlug_documentId: { companySlug, documentId } },
    data: checked
      ? { status: "geprueft", checkedAt: new Date(), checkedBy: von ?? null }
      : { status: "unchecked", checkedAt: null, checkedBy: null },
  });
  return companyDocumentToDto(updated);
}

async function evidenceToDto(item: EvidenceItem): Promise<StoredEvidenceFileDto> {
  const previewUrl = await getCeaPresignedUrl(item.storageKey);
  return {
    evidenceId: item.evidenceId,
    fileName: item.fileName,
    mimeType: item.mimeType,
    uploadedAt: item.uploadedAt.toISOString(),
    previewUrl: previewUrl ?? undefined,
    dataUrl: previewUrl ?? undefined,
  };
}

export async function loadEmployeeEvidenceDto(
  companySlug: string,
  employeeFileId: string,
): Promise<EmployeeEvidenceMapDto> {
  const items = await prisma.evidenceItem.findMany({
    where: {
      employeeFileId,
      employeeFile: { companySlug },
    },
  });
  const map: EmployeeEvidenceMapDto = {};
  for (const item of items) {
    map[item.evidenceId] = await evidenceToDto(item);
  }
  return map;
}

export async function saveEmployeeEvidenceFile(
  companySlug: string,
  employeeFileId: string,
  evidenceId: string,
  fileName: string,
  mimeType: string,
  buffer: Buffer,
): Promise<StoredEvidenceFileDto> {
  if (!isS3Configured()) {
    throw new Error("Hetzner S3 is not configured for evidence storage");
  }
  const storageKey = buildEvidenceKey(
    companySlug,
    employeeFileId,
    evidenceId,
    fileName,
  );
  await putCeaObject(storageKey, buffer, mimeType || "application/octet-stream");

  const existing = await prisma.evidenceItem.findUnique({
    where: {
      employeeFileId_evidenceId: { employeeFileId, evidenceId },
    },
  });
  if (existing?.storageKey && existing.storageKey !== storageKey) {
    await deleteCeaObject(existing.storageKey);
  }

  const row = await prisma.evidenceItem.upsert({
    where: {
      employeeFileId_evidenceId: { employeeFileId, evidenceId },
    },
    create: {
      employeeFileId,
      evidenceId,
      fileName,
      mimeType: mimeType || "application/octet-stream",
      storageKey,
      status: "unchecked",
      uploadedAt: new Date(),
    },
    update: {
      fileName,
      mimeType: mimeType || "application/octet-stream",
      storageKey,
      uploadedAt: new Date(),
    },
  });

  return await evidenceToDto(row);
}

export async function removeEmployeeEvidenceFile(
  companySlug: string,
  employeeFileId: string,
  evidenceId: string,
): Promise<void> {
  const row = await prisma.evidenceItem.findFirst({
    where: {
      employeeFileId,
      evidenceId,
      employeeFile: { companySlug },
    },
  });
  if (!row) return;
  await deleteCeaObject(row.storageKey);
  await prisma.evidenceItem.delete({ where: { id: row.id } });
}

export interface LocalStorageMigrationPayload {
  queue: {
    employees: Employee[];
    globalProps: GlobalProperties;
  } | null;
  evidence: Record<
    string,
    Record<
      string,
      {
        evidenceId: string;
        fileName: string;
        mimeType: string;
        uploadedAt: string;
        dataUrl?: string;
      }
    >
  >;
}

export interface MigrationResult {
  companySlug: string;
  employeesImported: number;
  evidenceImported: number;
  skipped: boolean;
}

export async function migrateFromLocalStoragePayload(
  payload: LocalStorageMigrationPayload,
): Promise<MigrationResult> {
  const LOG = "[migrateFromLocalStorage]";

  try {
    console.info(`${LOG} Step: ensureCompaniesSeeded`);
    await ensureCompaniesSeeded();

    console.info(`${LOG} Step: check existing migration record`);
    const existing = await prisma.migrationRecord.findUnique({
      where: { sourceKey: QUEUE_MIGRATION_KEY },
    });
    if (existing) {
      console.info(`${LOG} Step: already migrated → skip`, {
        companySlug: existing.companySlug,
      });
      return {
        companySlug: existing.companySlug,
        employeesImported: 0,
        evidenceImported: 0,
        skipped: true,
      };
    }

    const companySlug =
      matchCompanySlugByName(payload.queue?.globalProps.companyName ?? "") ??
      LEGACY_IMPORT_SLUG;
    console.info(`${LOG} Step: resolved company slug`, { companySlug });

    let employeesImported = 0;
    if (payload.queue?.employees?.length) {
      console.info(`${LOG} Step: import employees`, {
        count: payload.queue.employees.length,
      });
      for (const employee of payload.queue.employees) {
        await prisma.employeeFile.upsert({
          where: { id: employee.id },
          create: {
            ...employeeToUpsertData(companySlug, employee),
            migratedFromLocalStorageAt: new Date(),
          },
          update: {
            companySlug,
            fullName: employee.fullName,
            birthday: employee.birthday,
            startDate: employee.startDate,
            roleId: employee.roleId,
            appointmentIds: employee.appointmentIds,
            selectedRoleDocIds: employee.selectedRoleDocIds,
            selectedAppointmentDocIds: employee.selectedAppointmentDocIds,
            roleClasses: employee.roleClasses ?? [],
            roleClass: employee.roleClass ?? null,
            roleType: employee.roleType ?? null,
            employmentType: employee.employmentType ?? null,
            qualification: qualificationColumnValue(employee),
            trainingHours: employee.trainingHours ?? null,
            guardIDNumber: employee.guardIDNumber ?? null,
            employeeIDNumber: employee.employeeIDNumber ?? null,
            useGuardAsEmployeeId: employee.useGuardAsEmployeeId ?? null,
            zusatzBewachungNiveau: employee.zusatzBewachungNiveau ?? null,
            sdlScopes: employee.sdlScopes ?? [],
            drivesServiceVehicle: employee.drivesServiceVehicle ?? null,
            ersteHilfeGueltigBis: employee.ersteHilfeGueltigBis ?? null,
            brandschutzGueltigBis: employee.brandschutzGueltigBis ?? null,
            weiterbildungIstUE: employee.weiterbildungIstUE ?? null,
            einmaligIstUE: employee.einmaligIstUE ?? {},
            trainingPlan: (employee.trainingPlan ?? []) as unknown as Prisma.InputJsonValue,
            ...laneJUpdateFields(employee),
            migratedFromLocalStorageAt: new Date(),
          },
        });
        employeesImported += 1;
      }
    }

    if (payload.queue?.globalProps) {
      console.info(`${LOG} Step: save export settings`);
      await saveExportSettings(companySlug, payload.queue.globalProps);
    }

    let evidenceImported = 0;
    const evidenceEntries = Object.entries(payload.evidence);
    if (evidenceEntries.length > 0) {
      console.info(`${LOG} Step: import evidence to S3`, {
        employeeCount: evidenceEntries.length,
      });
    }
    for (const [employeeId, evidenceMap] of evidenceEntries) {
      const file = await prisma.employeeFile.findUnique({
        where: { id: employeeId },
      });
      if (!file) continue;

      for (const entry of Object.values(evidenceMap)) {
        let buffer: Buffer | null = null;
        if (entry.dataUrl) {
          const parsed = parseDataUrl(entry.dataUrl);
          buffer = parsed?.buffer ?? null;
        }
        if (!buffer) continue;

        await saveEmployeeEvidenceFile(
          file.companySlug,
          employeeId,
          entry.evidenceId,
          entry.fileName,
          entry.mimeType,
          buffer,
        );
        evidenceImported += 1;
      }
    }

    console.info(`${LOG} Step: create migration record`);
    await prisma.migrationRecord.create({
      data: {
        sourceKey: QUEUE_MIGRATION_KEY,
        companySlug,
      },
    });

    if (Object.keys(payload.evidence).length > 0) {
      await prisma.migrationRecord.upsert({
        where: { sourceKey: EVIDENCE_MIGRATION_KEY },
        create: {
          sourceKey: EVIDENCE_MIGRATION_KEY,
          companySlug,
        },
        update: { companySlug },
      });
    }

    console.info(`${LOG} Migration complete`, {
      companySlug,
      employeesImported,
      evidenceImported,
    });
    return { companySlug, employeesImported, evidenceImported, skipped: false };
  } catch (err) {
    console.error(`${LOG} Migration failed:`, err);
    throw err;
  }
}
