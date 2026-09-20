import { CVData } from "@/lib/cvTypes";

const MODEL = "gemini-2.0-flash";

function cvToText(cv: CVData): string {
  const parts: string[] = [];
  if (cv.jobTitle) parts.push(`Target role / current title: ${cv.jobTitle}`);
  if (cv.summary) parts.push(`Summary: ${cv.summary}`);

  if (cv.experience.length) {
    parts.push("Experience:");
    for (const e of cv.experience) {
      parts.push(`- ${e.role} at ${e.company}${e.location ? `, ${e.location}` : ""}`);
      for (const b of e.bullets) parts.push(`  • ${b}`);
    }
  }

  if (cv.education.length) {
    parts.push("Education:");
    for (const ed of cv.education) {
      parts.push(`- ${ed.degree}, ${ed.school}${ed.details ? ` — ${ed.details}` : ""}`);
    }
  }

  if (cv.skills.length) {
    parts.push(`Listed skills: ${cv.skills.map((s) => s.name).join(", ")}`);
  }

  if (cv.projects.length) {
    parts.push("Projects:");
    for (const p of cv.projects) {
      parts.push(`- ${p.name}: ${p.description}`);
    }
  }

  if (cv.certifications.length) {
    parts.push(
      `Certifications: ${cv.certifications.map((c) => c.name).join(", ")}`
    );
  }

  return parts.join("\n");
}

async function callGemini(system: string, user: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ parts: [{ text: user }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Gemini API error (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!text) throw new Error("Gemini returned an empty response.");
  return text;
}

function parseJSON<T>(raw: string): T {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  return JSON.parse(cleaned) as T;
}

export interface JobMatchResult {
  profession: string;
  matchScore: number;
  matched: string[];
  missing: string[];
  notes: string;
}

// Analyzes the CV against an actual job description: identifies the
// profession the JD is for, extracts what IT specifically asks for (its own
// terminology, tools, qualifications, responsibilities), then checks each
// requirement against the CV for genuine textual evidence — never inferring
// or assuming a skill the CV doesn't actually show.
export async function analyzeJobMatch(
  cv: CVData,
  jobDescription: string
): Promise<JobMatchResult> {
  const system = `You are a strict, evidence-based ATS (Applicant Tracking System) job-matching engine, not a generic keyword checklist. Given a candidate's CV content and a real job description, you:

1. Identify the profession/role the job description is for.
2. Extract the concrete requirements FROM THE JOB DESCRIPTION ITSELF — required skills, tools, technologies, qualifications, responsibilities, and domain terminology — prioritizing the employer's own wording over generic assumptions about the profession.
3. Compare each extracted requirement against the CV content. Mark a requirement "matched" ONLY when the CV text gives clear, genuine, explicit evidence for it (an actual skill listed, a tool named, or a bullet point that directly demonstrates it). Do NOT mark something matched by inference, similarity, or "this role probably involves X" — evidence must be explicit in the CV text given.
4. Everything the job description requires that the CV does not explicitly evidence goes in "missing" — these are suggestions for the candidate to consider ONLY if they genuinely have that skill; never assert the candidate has them.
5. matchScore = round(matched.length / (matched.length + missing.length) * 100). If there are zero requirements found, matchScore is 0.
6. Never invent, assume, or exaggerate the candidate's experience.

Respond with ONLY valid JSON (no markdown fences, no commentary) in exactly this shape:
{"profession": string, "matchScore": number, "matched": string[], "missing": string[], "notes": string}
"notes" is one short, concrete sentence of guidance.`;

  const user = `CANDIDATE CV:\n${cvToText(cv)}\n\nJOB DESCRIPTION:\n${jobDescription.trim()}`;

  const raw = await callGemini(system, user);
  return parseJSON<JobMatchResult>(raw);
}

export interface ProfessionKeywords {
  profession: string;
  matched: string[];
  missing: string[];
}

// No job description available yet — still profession-aware (any
// profession, not a fixed hardcoded list), built from the CV's own title,
// summary and experience, so at least general field-relevant terminology can
// be suggested (e.g. ETAP / IEC / PLC for an Electrical Engineer) without
// ever claiming the candidate already has skills the CV doesn't evidence.
export async function suggestProfessionKeywords(
  cv: CVData
): Promise<ProfessionKeywords> {
  const system = `You are a career-advisory assistant building a profession-specific ATS keyword knowledge base. Given a candidate's job title, summary, and experience, identify their profession precisely (e.g. "Electrical Engineer", not just "Engineer"), then produce a realistic list of 10-15 skills, tools, technologies, methodologies, or standards that real job postings in that exact profession commonly require (mirroring genuine industry terminology — for an Electrical Engineer this looks like ETAP, Load Flow Analysis, PLC, SCADA, IEC, IEEE; for a different profession use that field's own real terms instead).

Then, based ONLY on the CV content given, split that list into:
- "matched": items the CV already explicitly evidences (an actual skill, tool, or clear demonstration in a bullet)
- "missing": relevant items commonly expected in this profession that the CV does not evidence

Never claim the candidate has a skill the CV text doesn't actually show.

Respond with ONLY valid JSON (no markdown fences, no commentary) in exactly this shape:
{"profession": string, "matched": string[], "missing": string[]}`;

  const user = cvToText(cv);

  const raw = await callGemini(system, user);
  return parseJSON<ProfessionKeywords>(raw);
}
