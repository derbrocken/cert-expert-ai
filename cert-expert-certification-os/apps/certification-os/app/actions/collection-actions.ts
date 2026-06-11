"use server";

/**
 * P3a — Server-Actions für editierbare Sammlungen. Dünne Wrapper über dem Repo.
 */
import {
  listCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
  cloneCollection,
  type CollectionDto,
} from "@/lib/document-collection-repository";
import type { CollectionInput } from "@/lib/document-collection-model";

export async function fetchCollectionsAction(): Promise<CollectionDto[]> {
  return listCollections();
}

export async function fetchCollectionAction(
  id: string,
): Promise<CollectionDto | null> {
  return getCollection(id);
}

export async function createCollectionAction(
  input: CollectionInput,
): Promise<CollectionDto> {
  return createCollection(input);
}

export async function updateCollectionAction(
  id: string,
  input: CollectionInput,
): Promise<CollectionDto> {
  return updateCollection(id, input);
}

export async function deleteCollectionAction(id: string): Promise<void> {
  await deleteCollection(id);
}

export async function cloneCollectionAction(id: string): Promise<CollectionDto> {
  return cloneCollection(id);
}
