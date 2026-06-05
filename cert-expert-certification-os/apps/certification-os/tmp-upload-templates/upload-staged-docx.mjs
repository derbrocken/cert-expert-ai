/**
 * One-off upload script for staged real DOCX templates.
 * Loads .env.local without printing secret values.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const appRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const stagingRoot = join(appRoot, "tmp-upload-templates");

function loadEnvLocal() {
  const envPath = join(appRoot, ".env.local");
  const text = readFileSync(envPath, "utf8");
  const env = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

function requireEnv(env, key) {
  const val = env[key]?.trim();
  if (!val) throw new Error(`Missing required env variable: ${key}`);
  return val;
}

function buildKey(category, folderName, fileName) {
  return `${category}/${folderName}/${fileName}/${Date.now()}`;
}

const ROLE_FOLDER = "din-77200-1-allgemeine";
const APPOINTMENT_FOLDER = "unterweisungen";

function normalizeEndpoint(raw) {
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

const env = loadEnvLocal();
const client = new S3Client({
  region: requireEnv(env, "HETZNER_S3_REGION"),
  endpoint: normalizeEndpoint(requireEnv(env, "HETZNER_S3_ENDPOINT")),
  credentials: {
    accessKeyId: requireEnv(env, "HETZNER_S3_KEY"),
    secretAccessKey: requireEnv(env, "HETZNER_S3_SECRET"),
  },
  forcePathStyle: true,
});
const bucket = requireEnv(env, "HETZNER_BUCKET_NAME");

const DOCX_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const uploads = [];

async function uploadCategory(category, localDir, folderName) {
  const files = readdirSync(localDir).filter((f) => f.endsWith(".docx"));
  for (const fileName of files) {
    const body = readFileSync(join(localDir, fileName));
    const key = buildKey(category, folderName, fileName);
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: DOCX_TYPE,
      }),
    );
    uploads.push({ source: join(category, fileName), key });
  }
  return files;
}

async function listPrefix(prefix) {
  const keys = [];
  let token;
  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: token,
        MaxKeys: 1000,
      }),
    );
    for (const item of res.Contents ?? []) {
      if (item.Key?.endsWith(".docx")) keys.push(item.Key);
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
  return keys.sort();
}

try {
  const roleSources = await uploadCategory(
    "roles",
    join(stagingRoot, "roles"),
    ROLE_FOLDER,
  );
  const appointmentSources = await uploadCategory(
    "appointments",
    join(stagingRoot, "appointments"),
    APPOINTMENT_FOLDER,
  );

  const roleKeys = await listPrefix("roles/");
  const appointmentKeys = await listPrefix("appointments/");

  console.log(JSON.stringify({
    status: "SUCCESS",
    bucket,
    sourceFiles: {
      roles: roleSources,
      appointments: appointmentSources,
    },
    uploadedKeys: uploads.map((u) => u.key),
    verification: {
      roles: roleKeys,
      appointments: appointmentKeys,
    },
  }, null, 2));
} catch (err) {
  console.log(JSON.stringify({
    status: "FAILED",
    error: err instanceof Error ? err.message : String(err),
  }, null, 2));
  process.exit(1);
}
