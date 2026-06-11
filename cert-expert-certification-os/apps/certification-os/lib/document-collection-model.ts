/**
 * P3a — Pure Model/Validierung für editierbare Sammlungen (Document Collections).
 * Kein DB/IO → unit-testbar. Repo + Actions bauen darauf auf.
 *
 * EC-10: Sammlungen treffen KEINE Freigabe-/Auditfähigkeitsaussage.
 * NORM: `clauseId` nur aus Register/Seed übernommen — hier wird keine erfunden.
 */

export type InclusionLevel = "mandatory" | "optional-on" | "optional-off";
export type CollectionDateSource = "startDate" | "manual";

export const INCLUSION_LEVELS: readonly InclusionLevel[] = [
  "mandatory",
  "optional-on",
  "optional-off",
] as const;

export const COLLECTION_DATE_SOURCES: readonly CollectionDateSource[] = [
  "startDate",
  "manual",
] as const;

export function isInclusionLevel(v: unknown): v is InclusionLevel {
  return typeof v === "string" && (INCLUSION_LEVELS as readonly string[]).includes(v);
}

export function isCollectionDateSource(v: unknown): v is CollectionDateSource {
  return (
    typeof v === "string" &&
    (COLLECTION_DATE_SOURCES as readonly string[]).includes(v)
  );
}

export interface CollectionItemInput {
  templateLogicalPath?: string | null;
  label: string;
  inclusion: string;
  dateSource: string;
  clauseId?: string | null;
  templateMissing?: boolean;
  sortOrder?: number;
}

export interface CollectionInput {
  name: string;
  description?: string | null;
  items: CollectionItemInput[];
}

export interface NormalizedItem {
  templateLogicalPath: string | null;
  label: string;
  inclusion: InclusionLevel;
  dateSource: CollectionDateSource;
  clauseId: string | null;
  templateMissing: boolean;
  sortOrder: number;
}

export interface NormalizedCollection {
  name: string;
  description: string | null;
  items: NormalizedItem[];
}

function cleanStr(v: string | null | undefined): string | null {
  const t = (v ?? "").trim();
  return t.length > 0 ? t : null;
}

/**
 * Validiert + normalisiert einen Sammlungs-Input. Wirft `Error` mit
 * verständlicher Meldung bei ungültigen Werten (Whitelist für inclusion/
 * dateSource, Pflicht-Name, Pflicht-Label je Posten). `sortOrder` wird stabil
 * aus der Reihenfolge gesetzt.
 */
export function normalizeCollectionInput(
  input: CollectionInput,
): NormalizedCollection {
  const name = cleanStr(input.name);
  if (!name) throw new Error("Name der Sammlung ist erforderlich.");

  const items: NormalizedItem[] = (input.items ?? []).map((raw, index) => {
    const label = cleanStr(raw.label);
    if (!label) {
      throw new Error(`Posten ${index + 1}: Bezeichnung ist erforderlich.`);
    }
    if (!isInclusionLevel(raw.inclusion)) {
      throw new Error(
        `Posten "${label}": ungültige Einstufung "${raw.inclusion}".`,
      );
    }
    if (!isCollectionDateSource(raw.dateSource)) {
      throw new Error(
        `Posten "${label}": ungültige Datumsquelle "${raw.dateSource}".`,
      );
    }
    return {
      templateLogicalPath: cleanStr(raw.templateLogicalPath),
      label,
      inclusion: raw.inclusion,
      dateSource: raw.dateSource,
      clauseId: cleanStr(raw.clauseId),
      templateMissing: raw.templateMissing === true,
      sortOrder: index,
    };
  });

  return { name, description: cleanStr(input.description), items };
}

/** Seed-Schutz: die 3 Vordefinierten dürfen nicht editiert/gelöscht werden. */
export function assertEditable(collection: { isSeed: boolean }): void {
  if (collection.isSeed) {
    throw new Error(
      "Vordefinierte Sammlung ist schreibgeschützt. Bitte klonen und die Kopie bearbeiten.",
    );
  }
}

/**
 * Klon-Transform: erzeugt aus einer (Seed- oder Custom-)Sammlung einen
 * editierbaren Custom-Input (`isSeed=false`, „(Kopie)"-Suffix, Items 1:1).
 */
export function cloneCollectionData(source: {
  name: string;
  description?: string | null;
  items: CollectionItemInput[];
}): CollectionInput {
  return {
    name: `${source.name} (Kopie)`,
    description: source.description ?? null,
    items: source.items.map((it) => ({ ...it })),
  };
}
