import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { b2, BUCKET } from "@/lib/b2";

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
    const headers: Record<string, string> = {
      "Content-Type": obj.ContentType || "application/octet-stream",
      "Cache-Control": "private, max-age=1800",
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
