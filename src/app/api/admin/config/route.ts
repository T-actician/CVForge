import { NextRequest, NextResponse } from "next/server";
import { getSiteConfig, saveSiteConfig } from "@/lib/siteConfig";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET() {
  return NextResponse.json(await getSiteConfig());
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const body = await req.json();
    const updated = await saveSiteConfig(body);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("POST /api/admin/config failed:", err);
    const message = err instanceof Error ? err.message : "Save failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
