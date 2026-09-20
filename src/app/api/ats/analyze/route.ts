import { NextRequest, NextResponse } from "next/server";
import { analyzeJobMatch, suggestProfessionKeywords } from "@/lib/atsAI";
import { CVData } from "@/lib/cvTypes";

export async function POST(req: NextRequest) {
  try {
    const { cv, jobDescription } = (await req.json()) as {
      cv: CVData;
      jobDescription?: string;
    };

    if (!cv) {
      return NextResponse.json({ error: "Missing CV data." }, { status: 400 });
    }

    if (jobDescription && jobDescription.trim().length > 0) {
      const result = await analyzeJobMatch(cv, jobDescription);
      return NextResponse.json({ mode: "job-match", ...result });
    }

    const result = await suggestProfessionKeywords(cv);
    return NextResponse.json({ mode: "profession-keywords", ...result });
  } catch (err) {
    console.error("POST /api/ats/analyze failed:", err);
    const message = err instanceof Error ? err.message : "Analysis failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
