import { NextRequest, NextResponse } from "next/server";
import { permanentlyDelete } from "@/lib/trash";
import { requireAdmin } from "@/lib/auth-guard";

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

    const ok = await permanentlyDelete(id);
    if (!ok) return NextResponse.json({ error: "Trash item not found." }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/admin/trash/delete failed:", err);
    const message = err instanceof Error ? err.message : "Delete failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
