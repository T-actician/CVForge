import { NextRequest, NextResponse } from "next/server";
import { getSignedGetUrl } from "@/lib/b2";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params;
  const fullKey = key.map(decodeURIComponent).join("/");
  const { searchParams } = new URL(req.url);
  const download = searchParams.get("dl") === "1";
  const name = searchParams.get("name") || fullKey.split("/").pop();

  if (!fullKey) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  try {
    const url = await getSignedGetUrl(fullKey, 3600, download ? { downloadFilename: name } : {});
    // Cache the redirect itself so repeat views skip this function and
    // B2 signed-URL generation entirely.
    return NextResponse.redirect(url, {
      headers: { "Cache-Control": "private, max-age=1800" },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
