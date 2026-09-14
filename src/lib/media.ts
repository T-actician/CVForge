import { randomUUID } from "crypto";
import sharp from "sharp";
import { putObject } from "@/lib/b2";

export { toMediaUrl, toDownloadUrl } from "@/lib/mediaUrls";

export async function uploadImage(buffer: Buffer, folder: string): Promise<string> {
  const optimized = await sharp(buffer)
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  const key = `${folder}/${randomUUID()}.webp`;
  await putObject(key, optimized, "image/webp");
  return key;
}

export async function uploadRaw(
  buffer: Buffer,
  folder: string,
  ext: string,
  contentType: string
): Promise<string> {
  const key = `${folder}/${randomUUID()}.${ext}`;
  await putObject(key, buffer, contentType);
  return key;
}
