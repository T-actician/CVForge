import { NextRequest, NextResponse } from "next/server";
import {
  getAllTemplateSettings,
  saveTemplateSettings,
  TemplateSettings,
} from "@/lib/templateSettings";
import { requireAdmin } from "@/lib/auth-guard";

// Public: the templates gallery and the CV builder both need this to render
// templates with their current customization, for any visitor.
export async function GET() {
  try {
    const settings = await getAllTemplateSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.error("GET /api/admin/template-settings failed:", err);
    return NextResponse.json({ error: "Failed to load template settings." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const { templateId, settings } = (await req.json()) as {
      templateId: string;
      settings: TemplateSettings;
    };
    if (!templateId || !settings) {
      return NextResponse.json({ error: "Missing templateId or settings." }, { status: 400 });
    }
    const all = await saveTemplateSettings(templateId, settings);
    return NextResponse.json(all);
  } catch (err) {
    console.error("POST /api/admin/template-settings failed:", err);
    const message = err instanceof Error ? err.message : "Save failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
