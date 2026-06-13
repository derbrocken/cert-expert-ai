import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  getHetznerBucketName,
  getHetznerS3Client,
  HetznerStorageNotConfiguredError,
} from "@/lib/hetzner-s3-client";

export function buildCompanyLogoKey(companySlug: string, ext: string): string {
  return `cea/companies/${companySlug}/logo.${ext}`;
}

export function buildEvidenceKey(
  companySlug: string,
  employeeFileId: string,
  evidenceId: string,
  fileName: string,
): string {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `cea/companies/${companySlug}/evidence/${employeeFileId}/${evidenceId}/${safeName}`;
}

/** P2-B — S3-Key eines firmen-ebenen Dokuments (analog `buildEvidenceKey`). */
export function buildCompanyDocumentKey(
  companySlug: string,
  documentId: string,
  fileName: string,
): string {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `cea/companies/${companySlug}/documents/${documentId}/${safeName}`;
}

async function streamToBuffer(
  body: AsyncIterable<Uint8Array> | ReadableStream | undefined,
): Promise<Buffer> {
  if (!body) return Buffer.alloc(0);
  const chunks: Uint8Array[] = [];
  for await (const chunk of body as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function putCeaObject(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  const client = getHetznerS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: getHetznerBucketName(),
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}

export async function getCeaObjectBuffer(key: string): Promise<Buffer | null> {
  try {
    const client = getHetznerS3Client();
    const response = await client.send(
      new GetObjectCommand({
        Bucket: getHetznerBucketName(),
        Key: key,
      }),
    );
    return streamToBuffer(response.Body as AsyncIterable<Uint8Array>);
  } catch {
    return null;
  }
}

export async function getCeaPresignedUrl(
  key: string,
  expiresIn = 3600,
): Promise<string | null> {
  try {
    const client = getHetznerS3Client();
    return getSignedUrl(
      client,
      new GetObjectCommand({
        Bucket: getHetznerBucketName(),
        Key: key,
      }),
      { expiresIn },
    );
  } catch {
    return null;
  }
}

export async function deleteCeaObject(key: string): Promise<void> {
  try {
    const client = getHetznerS3Client();
    await client.send(
      new DeleteObjectCommand({
        Bucket: getHetznerBucketName(),
        Key: key,
      }),
    );
  } catch {
    // best-effort
  }
}

export function parseDataUrl(
  dataUrl: string,
): { mimeType: string; buffer: Buffer } | null {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

export function isS3Configured(): boolean {
  try {
    getHetznerS3Client();
    return true;
  } catch (err) {
    return !(err instanceof HetznerStorageNotConfiguredError);
  }
}
