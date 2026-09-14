import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// B2_ENDPOINT is a bare hostname, e.g. "s3.us-east-005.backblazeb2.com"
// (no protocol) — the region is derived from it automatically.
const REGION = process.env.B2_ENDPOINT?.split(".")[1] ?? "us-east-005";

export const b2 = new S3Client({
  region: REGION,
  endpoint: `https://${process.env.B2_ENDPOINT}`,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APPLICATION_KEY!,
  },
  // Backblaze B2's S3-compatible API doesn't support the AWS SDK v3 default
  // request/response checksum headers — without disabling these, uploads fail.
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

const BUCKET = process.env.B2_BUCKET_NAME!;

// ---- Raw object helpers ----
export async function putObject(
  key: string,
  body: Buffer | string,
  contentType: string
) {
  await b2.send(
    new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType })
  );
  return key;
}

export async function getObjectText(key: string): Promise<string | null> {
  try {
    const res = await b2.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
    const body = await res.Body?.transformToString();
    return body ?? null;
  } catch (err) {
    if (err instanceof Error && err.name === "NoSuchKey") return null;
    throw err;
  }
}

export async function deleteObject(key?: string) {
  if (!key) return;
  await b2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

export async function getSignedGetUrl(
  key: string,
  expiresIn = 3600,
  options: { downloadFilename?: string } = {}
) {
  const { downloadFilename } = options;
  return getSignedUrl(
    b2,
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ...(downloadFilename
        ? { ResponseContentDisposition: `attachment; filename="${downloadFilename.replace(/"/g, "")}"` }
        : {}),
    }),
    { expiresIn }
  );
}

export async function getSignedPutUrl(
  key: string,
  contentType: string,
  expiresIn = 3600
) {
  return getSignedUrl(
    b2,
    new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType }),
    { expiresIn }
  );
}

// ---- JSON content helpers ----
export async function getJSON<T>(key: string, fallback: T): Promise<T> {
  const text = await getObjectText(key);
  if (!text) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export async function putJSON(key: string, data: unknown) {
  await putObject(key, JSON.stringify(data, null, 2), "application/json");
}

export { BUCKET };
