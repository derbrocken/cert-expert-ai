import {
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  getHetznerBucketName,
  getHetznerS3Client,
  HetznerStorageNotConfiguredError,
} from "@/lib/hetzner-s3-client";

export type TemplateCategory = "roles" | "appointments" | "standard-models";

export const VALID_CATEGORIES: TemplateCategory[] = [
  "roles",
  "appointments",
  "standard-models",
];

/** Compatible with legacy UploadThing list item shape used by API routes. */
export interface TemplateFileRecord {
  key: string;
  customId: string | null;
  status: "Uploaded";
}

const DOCX_CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/**
 * Build a unique object key / customId: "category/folderName/fileName/{timestamp}"
 */
export function buildCustomId(
  category: string,
  folderName: string,
  fileName: string,
): string {
  return `${category}/${folderName}/${fileName}/${Date.now()}`;
}

/**
 * The 3-segment logical path prefix used to find all versions of a file:
 * "category/folderName/fileName/"
 */
export function buildPathPrefix(
  category: string,
  folderName: string,
  fileName: string,
): string {
  return `${category}/${folderName}/${fileName}/`;
}

/**
 * Parse a customId / S3 key back to its parts.
 * Handles both 3-segment (legacy) and 4-segment (timestamped) formats.
 */
export function parseCustomId(customId: string | null) {
  if (!customId) return null;
  const parts = customId.split("/");
  if (parts.length < 3) return null;
  const [category, folderName, fileName] = parts;
  if (!VALID_CATEGORIES.includes(category as TemplateCategory)) return null;
  return { category: category as TemplateCategory, folderName, fileName };
}

function timestampFromCustomId(customId: string): number {
  const parts = customId.split("/");
  if (parts.length < 4) return 0;
  const ts = Number(parts[parts.length - 1]);
  return Number.isFinite(ts) ? ts : 0;
}

function isTemplateObjectKey(key: string): boolean {
  const parsed = parseCustomId(key);
  if (!parsed) return false;
  if (parsed.fileName === ".folder") return true;
  return parsed.fileName.endsWith(".docx");
}

/**
 * List template objects from the Hetzner bucket (roles, appointments, standard-models).
 * @param category When set, only list objects under `{category}/` (faster for Tool 1).
 */
export async function listTemplateFiles(
  category?: TemplateCategory,
): Promise<TemplateFileRecord[]> {
  const client = getHetznerS3Client();
  const bucket = getHetznerBucketName();
  const records: TemplateFileRecord[] = [];
  let continuationToken: string | undefined;
  const prefix = category ? `${category}/` : undefined;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
        MaxKeys: 1000,
      }),
    );

    for (const item of response.Contents ?? []) {
      if (!item.Key || !isTemplateObjectKey(item.Key)) continue;
      records.push({
        key: item.Key,
        customId: item.Key,
        status: "Uploaded",
      });
    }

    continuationToken = response.IsTruncated
      ? response.NextContinuationToken
      : undefined;
  } while (continuationToken);

  return records;
}

/**
 * Map logical path (category/folder/file.docx) → latest S3 object key.
 */
export function buildLatestTemplateKeyMap(
  files: TemplateFileRecord[],
): Map<string, string> {
  const latest = new Map<string, { key: string; ts: number }>();

  for (const file of files) {
    const parsed = parseCustomId(file.customId);
    if (!parsed || !file.key || parsed.fileName === ".folder") continue;
    const logical = `${parsed.category}/${parsed.folderName}/${parsed.fileName}`;
    const ts = timestampFromCustomId(file.customId ?? file.key);
    const current = latest.get(logical);
    if (!current || ts >= current.ts) {
      latest.set(logical, { key: file.key, ts });
    }
  }

  return new Map(
    [...latest.entries()].map(([logical, { key }]) => [logical, key]),
  );
}

/**
 * Upload a DOCX buffer to Hetzner. Object key equals customId.
 */
export async function uploadTemplateFile(
  buffer: ArrayBuffer,
  fileName: string,
  customId: string,
): Promise<string> {
  void fileName;
  const client = getHetznerS3Client();
  const bucket = getHetznerBucketName();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: customId,
      Body: Buffer.from(buffer),
      ContentType: DOCX_CONTENT_TYPE,
    }),
  );

  return customId;
}

/**
 * Upload a folder placeholder marker object.
 */
export async function uploadFolderPlaceholder(
  category: string,
  folderName: string,
): Promise<string> {
  const customId = buildCustomId(category, folderName, ".folder");
  const client = getHetznerS3Client();
  const bucket = getHetznerBucketName();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: customId,
      Body: " ",
      ContentType: "text/plain",
    }),
  );

  return customId;
}

/**
 * Fetch template bytes server-side via GetObject (preferred for ZIP generation).
 */
export async function fetchTemplateBufferByKey(key: string): Promise<Buffer> {
  const client = getHetznerS3Client();
  const bucket = getHetznerBucketName();

  const response = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );

  if (!response.Body) {
    throw new Error(`Empty object body for key: ${key}`);
  }

  const bytes = await response.Body.transformToByteArray();
  return Buffer.from(bytes);
}

/**
 * Legacy-compatible fetch by URL or S3 key. Keys are used by the generator.
 */
export async function fetchTemplateBuffer(urlOrKey: string): Promise<Buffer> {
  if (urlOrKey.startsWith("http://") || urlOrKey.startsWith("https://")) {
    const res = await fetch(urlOrKey);
    if (!res.ok) throw new Error(`Failed to fetch template (${res.status})`);
    return Buffer.from(await res.arrayBuffer());
  }
  return fetchTemplateBufferByKey(urlOrKey);
}

/**
 * Delete objects by S3 key.
 */
export async function deleteTemplateFiles(keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  const client = getHetznerS3Client();
  const bucket = getHetznerBucketName();

  await client.send(
    new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects: keys.map((Key) => ({ Key })),
        Quiet: true,
      },
    }),
  );
}

/**
 * Optional presigned GET URL (not used by ZIP generator).
 */
export async function getPresignedGetUrl(
  key: string,
  expiresInSeconds = 3600,
): Promise<string> {
  const client = getHetznerS3Client();
  const bucket = getHetznerBucketName();
  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: expiresInSeconds },
  );
}

export { HetznerStorageNotConfiguredError };
