import { NextRequest, NextResponse } from "next/server";
import { uploadRaw, toDownloadUrl } from "@/lib/media";

const MAX_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const name = (formData.get("name") as string) || "cv";

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed." }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "PDF must be under 15MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = name.replace(/[^a-zA-Z0-9-_]/g, "_");
    const key = await uploadRaw(buffer, "pdfs", "pdf", "application/pdf");

    return NextResponse.json({ url: toDownloadUrl(key, `${safeName}.pdf`) });
  } catch (err) {
    console.error("POST /api/upload-pdf failed:", err);
    const message = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
