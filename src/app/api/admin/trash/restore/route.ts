import { NextRequest, NextResponse } from "next/server";
import { restoreFromTrash } from "@/lib/trash";
import { saveSiteConfig, MEDIA_FIELDS } from "@/lib/siteConfig";
import { toMediaUrl } from "@/lib/mediaUrls";
import { requireAdmin } from "@/lib/auth-guard";

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

    const item = await restoreFromTrash(id);
    if (!item) return NextResponse.json({ error: "Trash item not found." }, { status: 404 });

    // Restoring reinstates this file as the live value for the field it came
    // from. If that field has since been replaced by something newer, this
    // intentionally overwrites it back to the restored version — the newer
    // file itself was already moved to Trash by saveSiteConfig when it was
    // set, so nothing is lost.
    if (item.field in MEDIA_FIELDS) {
      await saveSiteConfig({ [item.field]: toMediaUrl(item.key) });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/admin/trash/restore failed:", err);
    const message = err instanceof Error ? err.message : "Restore failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
