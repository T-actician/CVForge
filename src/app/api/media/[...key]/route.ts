import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { b2, BUCKET } from "@/lib/b2";

// Every key is `${folder}/${randomUUID()}.ext` — content-addressed, so a
// given key's bytes never change. Admin-uploaded site assets (the landing
// page "Watch how it works" video, hero/marketing images) live under these
// folders and are meant to be shown to every visitor. Anything else
// (visitor CV photos under "photos/", visitor CV PDF exports under
// "pdfs/") is private, per-person content.
const PUBLIC_ASSET_FOLDERS = new Set(["videos", "site-hero", "site-how-it-works"]);

function isPublicAsset(fullKey: string): boolean {
  return PUBLIC_ASSET_FOLDERS.has(fullKey.split("/")[0]);
}

// Proxies the file's bytes through our own origin instead of redirecting to
// B2's URL. A redirect to a cross-origin URL taints any <canvas> that later
// draws this image (e.g. the PDF export), even with useCORS enabled, because
// the browser only sees the redirect target's origin, not the original
// same-origin request. Streaming the bytes back ourselves keeps every image
// truly same-origin, so canvas export never taints on it.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params;
  const fullKey = key.map(decodeURIComponent).join("/");
  const { searchParams } = new URL(req.url);
  const download = searchParams.get("dl") === "1";
  const name = (searchParams.get("name") || fullKey.split("/").pop() || "file").replace(
    /"/g,
    ""
  );

  if (!fullKey) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  // Video playback needs byte-range support for seeking/scrubbing — forward
  // the browser's Range header straight through to B2.
  const range = req.headers.get("range") ?? undefined;

  try {
    const obj = await b2.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: fullKey, ...(range ? { Range: range } : {}) })
    );
    if (!obj.Body) return NextResponse.json({ error: "File not found" }, { status: 404 });

    const stream = obj.Body.transformToWebStream();
    // Every response was "Cache-Control: private, max-age=1800" — "private"
    // stops Vercel's own CDN/edge network from caching it at all, so EVERY
    // visitor's page load re-fetched the full landing-page video straight
    // from B2 through this function, with none of that traffic ever
    // getting served from cache. That's what actually drained the shared
    // B2 daily download-bandwidth cap and took every site on the account
    // down — not CV PDF downloads. Public marketing assets are
    // content-addressed (a new upload gets a new random key) and safe to
    // cache aggressively at the edge; private per-visitor content (CV
    // photos, CV PDFs) keeps the original short-lived, browser-only cache
    // so it's never cached anywhere else.
    const cacheControl = isPublicAsset(fullKey)
      ? "public, max-age=31536000, immutable"
      : "private, max-age=1800";
    const headers: Record<string, string> = {
      "Content-Type": obj.ContentType || "application/octet-stream",
      "Cache-Control": cacheControl,
      "Accept-Ranges": "bytes",
    };
    if (obj.ContentLength != null) headers["Content-Length"] = String(obj.ContentLength);
    if (obj.ContentRange) headers["Content-Range"] = obj.ContentRange;
    if (download) headers["Content-Disposition"] = `attachment; filename="${name}"`;

    return new NextResponse(stream as unknown as ReadableStream, {
      status: obj.ContentRange ? 206 : 200,
      headers,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "NoSuchKey") {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    console.error("GET /api/media failed:", err);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
