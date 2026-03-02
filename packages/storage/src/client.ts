import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as s3GetSignedUrl } from "@aws-sdk/s3-request-presigner";

let client: S3Client | null = null;

const BUCKET = process.env.S3_BUCKET || "acve-assets";
const REGION = process.env.S3_REGION || "us-east-1";
const ENDPOINT = process.env.S3_ENDPOINT; // e.g. http://localhost:9000 for MinIO
const PUBLIC_URL = process.env.S3_PUBLIC_URL; // e.g. http://localhost:9000/acve-assets

export function getStorageClient(): S3Client {
  if (!client) {
    client = new S3Client({
      region: REGION,
      ...(ENDPOINT && {
        endpoint: ENDPOINT,
        forcePathStyle: true, // Required for MinIO
      }),
      ...(process.env.S3_ACCESS_KEY_ID && {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
        },
      }),
    });
  }
  return client;
}

/**
 * Upload a buffer to S3/MinIO.
 * Returns the public URL and storage key.
 */
export async function uploadAsset(
  buffer: Buffer,
  key: string,
  contentType: string,
): Promise<{ url: string; key: string }> {
  const s3 = getStorageClient();

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );

  // Build the public URL
  const url = PUBLIC_URL
    ? `${PUBLIC_URL}/${key}`
    : `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

  return { url, key };
}

/**
 * Generate a pre-signed URL for temporary access.
 */
export async function getSignedUrl(
  key: string,
  expiresIn: number = 3600,
): Promise<string> {
  const s3 = getStorageClient();

  return await s3GetSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }),
    { expiresIn },
  );
}

/**
 * Delete an asset from storage.
 */
export async function deleteAsset(key: string): Promise<void> {
  const s3 = getStorageClient();

  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }),
  );
}
