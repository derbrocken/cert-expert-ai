/**
 * P3a — Repository für editierbare Sammlungen (Document Collections).
 * DB-Schicht (Prisma) über dem pure Model. Additiv, global (kein Firmen-Scope).
 *
 * Seeds: die 3 Vordefinierten werden EINMALIG aus dem bestehenden Katalog
 * (`vorlagen-set-catalog.ts`) abgeleitet (create-once, idempotent). Der Katalog
 * bleibt vorerst Single Source — die echte Zusammenführung ist P3c.
 */
import { prisma } from "@/lib/prisma";
import {
  normalizeCollectionInput,
  assertEditable,
  cloneCollectionData,
  type CollectionInput,
} from "./document-collection-model";
import {
  SET_KATEGORIE_DEFS,
  coreDocsForSetKategorie,
} from "@/modules/03-mitarbeiterakte-tool-2/employee-file/vorlagen-set-catalog";

export interface CollectionItemDto {
  id: string;
  templateLogicalPath: string | null;
  label: string;
  inclusion: string;
  dateSource: string;
  clauseId: string | null;
  templateMissing: boolean;
  sortOrder: number;
}

export interface CollectionDto {
  id: string;
  name: string;
  description: string | null;
  isSeed: boolean;
  seedKey: string | null;
  items: CollectionItemDto[];
}

type Row = {
  id: string;
  name: string;
  description: string | null;
  isSeed: boolean;
  seedKey: string | null;
  items: {
    id: string;
    templateLogicalPath: string | null;
    label: string;
    inclusion: string;
    dateSource: string;
    clauseId: string | null;
    templateMissing: boolean;
    sortOrder: number;
  }[];
};

function toDto(row: Row): CollectionDto {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    isSeed: row.isSeed,
    seedKey: row.seedKey,
    items: [...row.items]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((it) => ({
        id: it.id,
        templateLogicalPath: it.templateLogicalPath,
        label: it.label,
        inclusion: it.inclusion,
        dateSource: it.dateSource,
        clauseId: it.clauseId,
        templateMissing: it.templateMissing,
        sortOrder: it.sortOrder,
      })),
  };
}

/** Leitet die 3 Seed-Sammlungen deklarativ aus dem Katalog ab (Core-Doks). */
function buildSeedCollections() {
  return SET_KATEGORIE_DEFS.map((def) => ({
    seedKey: def.id,
    name: def.label,
    description: def.description,
    items: coreDocsForSetKategorie(def.id).map((spec, index) => ({
      templateLogicalPath: spec.templateLogicalPath ?? null,
      label: spec.label,
      // Core-Doks der Vordefinierten = „braucht der MA" → Pflicht.
      inclusion: "mandatory",
      dateSource: spec.dateSource,
      clauseId: spec.clauseId,
      templateMissing: spec.templateMissing ?? false,
      sortOrder: index,
    })),
  }));
}

/** Erzeugt fehlende Seed-Sammlungen einmalig (idempotent, create-once). */
export async function ensureSeedCollections(): Promise<void> {
  for (const seed of buildSeedCollections()) {
    const existing = await prisma.documentCollection.findUnique({
      where: { seedKey: seed.seedKey },
    });
    if (existing) continue;
    await prisma.documentCollection.create({
      data: {
        name: seed.name,
        description: seed.description,
        isSeed: true,
        seedKey: seed.seedKey,
        items: { create: seed.items },
      },
    });
  }
}

export async function listCollections(): Promise<CollectionDto[]> {
  await ensureSeedCollections();
  const rows = await prisma.documentCollection.findMany({
    include: { items: true },
    orderBy: [{ isSeed: "desc" }, { name: "asc" }],
  });
  return rows.map(toDto);
}

export async function getCollection(id: string): Promise<CollectionDto | null> {
  const row = await prisma.documentCollection.findUnique({
    where: { id },
    include: { items: true },
  });
  return row ? toDto(row) : null;
}

export async function createCollection(
  input: CollectionInput,
): Promise<CollectionDto> {
  const norm = normalizeCollectionInput(input);
  const row = await prisma.documentCollection.create({
    data: {
      name: norm.name,
      description: norm.description,
      isSeed: false,
      items: { create: norm.items },
    },
    include: { items: true },
  });
  return toDto(row);
}

export async function updateCollection(
  id: string,
  input: CollectionInput,
): Promise<CollectionDto> {
  const existing = await prisma.documentCollection.findUnique({
    where: { id },
    select: { isSeed: true },
  });
  if (!existing) throw new Error("Sammlung nicht gefunden.");
  assertEditable(existing);
  const norm = normalizeCollectionInput(input);
  // Items vollständig ersetzen (deklarativer Save).
  await prisma.documentCollectionItem.deleteMany({ where: { collectionId: id } });
  const row = await prisma.documentCollection.update({
    where: { id },
    data: {
      name: norm.name,
      description: norm.description,
      items: { create: norm.items },
    },
    include: { items: true },
  });
  return toDto(row);
}

export async function deleteCollection(id: string): Promise<void> {
  const existing = await prisma.documentCollection.findUnique({
    where: { id },
    select: { isSeed: true },
  });
  if (!existing) return;
  assertEditable(existing);
  await prisma.documentCollection.delete({ where: { id } });
}

export async function cloneCollection(id: string): Promise<CollectionDto> {
  const source = await getCollection(id);
  if (!source) throw new Error("Sammlung nicht gefunden.");
  const input = cloneCollectionData({
    name: source.name,
    description: source.description,
    items: source.items.map((it) => ({
      templateLogicalPath: it.templateLogicalPath,
      label: it.label,
      inclusion: it.inclusion,
      dateSource: it.dateSource,
      clauseId: it.clauseId,
      templateMissing: it.templateMissing,
      sortOrder: it.sortOrder,
    })),
  });
  return createCollection(input);
}
