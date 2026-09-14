import { NextRequest, NextResponse } from "next/server";
import { uploadImage, toMediaUrl } from "@/lib/media";
import { requireAdmin } from "@/lib/auth-guard";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = ((formData.get("folder") as string) || "photos").replace(
      /[^a-zA-Z0-9-_]/g,
      ""
    );

    // Uploads to any folder other than "photos" (CV profile pictures, used
    // by any visitor building a CV) are admin site-asset uploads.
    if (folder !== "photos") {
      const admin = await requireAdmin();
      if (!admin) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
      }
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG or WEBP images are allowed." },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Image must be under 10MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = await uploadImage(buffer, folder);

    return NextResponse.json({ key, url: toMediaUrl(key) });
  } catch (err) {
    console.error("POST /api/upload-photo failed:", err);
    const message = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
