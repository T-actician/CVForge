import { NextResponse } from "next/server";
import { getTrash } from "@/lib/trash";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const trash = await getTrash();
    return NextResponse.json(trash);
  } catch (err) {
    console.error("GET /api/admin/trash failed:", err);
    return NextResponse.json({ error: "Failed to load trash." }, { status: 500 });
  }
}
