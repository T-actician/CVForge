import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSignedPutUrl } from "@/lib/b2";
import { toMediaUrl } from "@/lib/mediaUrls";
import { requireAdmin } from "@/lib/auth-guard";

// Videos go straight from the browser to B2 via a presigned URL. This is
// required, not optional: Vercel enforces a hard 4.5MB request body limit
// on every function (Node AND Edge runtime) — routing the file through our
// own server, streamed or not, cannot bypass it.
const ALLOWED: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { folder, contentType } = await req.json();
    const ext = ALLOWED[contentType];
    if (!ext) {
      return NextResponse.json(
        { error: "Only MP4, WEBM or MOV videos are allowed." },
        { status: 400 }
      );
    }

    const key = `${folder || "videos"}/${randomUUID()}.${ext}`;
    const uploadUrl = await getSignedPutUrl(key, contentType, 3600);

    return NextResponse.json({ uploadUrl, key, url: toMediaUrl(key) });
  } catch (err) {
    console.error("POST /api/admin/presign-upload failed:", err);
    const message = err instanceof Error ? err.message : "Failed to prepare upload.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
