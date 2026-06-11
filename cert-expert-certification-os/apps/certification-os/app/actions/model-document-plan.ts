/**
 * Pure Plan-Logik für Tool 1 (Document Creator) — ohne S3/easy-template-x,
 * damit ID-Match, Excluded-Filter und Leer-/Fehlend-Guards unit-testbar sind.
 *
 * WICHTIG: `buildDocId` MUSS byte-identisch zur Doc-ID in
 * `app/api/standard-models/route.ts` sein (`${folder}-${file ohne .docx}`),
 * sonst greift der Excluded-Filter nicht (still kaputt).
 */

export interface PlannedDoc {
  folderId: string;
  folderName: string;
  fileName: string;
  key: string;
  docId: string;
}

export interface DocumentPlan {
  /** Zu verarbeitende Dokumente (nach Excluded-Filter). */
  items: PlannedDoc[];
  /** Gewählte Ordner, die in der Storage keine `.docx` haben (harter Fehler). */
  missingFolders: string[];
}

/** Doc-ID — IDENTISCH zur API-Route, sonst matcht der Excluded-Filter nicht. */
export function buildDocId(folderId: string, fileName: string): string {
  return `${folderId}-${fileName.replace(".docx", "")}`;
}

/** Slug → Anzeigename (z. B. `objekt-leitung` → `Objekt Leitung`). */
export function formatFolderName(folderId: string): string {
  return folderId
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Plant die Dokument-Generierung aus dem Template-KeyMap.
 * @param keyMapEntries logischer Pfad (`standard-models/<ordner>/<datei>.docx`) → S3-Key
 */
export function planDocuments(
  keyMapEntries: Iterable<[string, string]>,
  selectedFolders: string[],
  excludedDocIds: Set<string>,
): DocumentPlan {
  const entries = [...keyMapEntries];
  const items: PlannedDoc[] = [];
  const missingFolders: string[] = [];

  for (const folderId of selectedFolders) {
    const prefix = `standard-models/${folderId}/`;
    const folderEntries = entries.filter(
      ([logicalPath]) =>
        logicalPath.startsWith(prefix) && logicalPath.endsWith(".docx"),
    );

    if (folderEntries.length === 0) {
      missingFolders.push(folderId);
      continue;
    }

    const folderName = formatFolderName(folderId);
    for (const [logicalPath, key] of folderEntries) {
      const fileName = logicalPath.slice(prefix.length);
      const docId = buildDocId(folderId, fileName);
      if (excludedDocIds.has(docId)) continue;
      items.push({ folderId, folderName, fileName, key, docId });
    }
  }

  return { items, missingFolders };
}
