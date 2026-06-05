import { S3Client } from "@aws-sdk/client-s3";

export interface HetznerS3Config {
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  endpoint: string;
  region: string;
}

export class HetznerStorageNotConfiguredError extends Error {
  constructor() {
    super(
      "Hetzner Object Storage is not configured. Set HETZNER_S3_KEY, HETZNER_S3_SECRET, HETZNER_BUCKET_NAME, HETZNER_S3_ENDPOINT, and HETZNER_S3_REGION in .env.local.",
    );
    this.name = "HetznerStorageNotConfiguredError";
  }
}

export function getHetznerS3Config(): HetznerS3Config | null {
  const accessKeyId = process.env.HETZNER_S3_KEY?.trim();
  const secretAccessKey = process.env.HETZNER_S3_SECRET?.trim();
  const bucket = process.env.HETZNER_BUCKET_NAME?.trim();
  const endpoint = process.env.HETZNER_S3_ENDPOINT?.trim();
  const region = process.env.HETZNER_S3_REGION?.trim();

  if (!accessKeyId || !secretAccessKey || !bucket || !endpoint || !region) {
    return null;
  }

  return { accessKeyId, secretAccessKey, bucket, endpoint, region };
}

export function requireHetznerS3Config(): HetznerS3Config {
  const config = getHetznerS3Config();
  if (!config) {
    throw new HetznerStorageNotConfiguredError();
  }
  return config;
}

let cachedClient: S3Client | null = null;

export function getHetznerS3Client(): S3Client {
  if (cachedClient) return cachedClient;
  const config = requireHetznerS3Config();
  cachedClient = new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle: true,
  });
  return cachedClient;
}

export function getHetznerBucketName(): string {
  return requireHetznerS3Config().bucket;
}
