import { CVData } from "./cvTypes";

export interface AtsCheck {
  id: string;
  label: string;
  passed: boolean;
  hint: string;
}

const ACTION_VERBS = [
  "led",
  "built",
  "developed",
  "managed",
  "created",
  "designed",
  "improved",
  "launched",
  "increased",
  "reduced",
  "delivered",
  "implemented",
  "coordinated",
  "achieved",
  "optimized",
];

export function runAtsChecks(cv: CVData): AtsCheck[] {
  const wordCount = cv.summary.trim().split(/\s+/).filter(Boolean).length;
  const bulletsFlat = cv.experience.flatMap((e) => e.bullets);
  const hasActionVerbs = bulletsFlat.some((b) =>
    ACTION_VERBS.some((v) => b.toLowerCase().trim().startsWith(v))
  );
  const hasNumbers = bulletsFlat.some((b) => /\d/.test(b));
  const bulletsTooLong = bulletsFlat.some((b) => b.split(/\s+/).length > 28);

  return [
    {
      id: "contact",
      label: "Contact details complete",
      passed: Boolean(cv.email && cv.phone && cv.location),
      hint: "Add your email, phone and location so recruiters and ATS parsers can find them.",
    },
    {
      id: "summary",
      label: "Summary is 2–4 sentences",
      passed: wordCount >= 25 && wordCount <= 80,
      hint: "Aim for a concise 25–80 word summary that states your role and top strengths.",
    },
    {
      id: "experience",
      label: "At least one experience entry",
      passed: cv.experience.length > 0,
      hint: "Add your most recent role — ATS systems weigh work history heavily.",
    },
    {
      id: "verbs",
      label: "Bullets start with action verbs",
      passed: hasActionVerbs,
      hint: "Start bullet points with verbs like Led, Built, Improved, Increased.",
    },
    {
      id: "numbers",
      label: "Achievements are quantified",
      passed: hasNumbers,
      hint: "Add numbers or percentages to show impact, e.g. 'reduced load time by 40%'.",
    },
    {
      id: "length",
      label: "Bullets are concise",
      passed: !bulletsTooLong,
      hint: "Keep each bullet under ~28 words for readability and ATS parsing.",
    },
    {
      id: "skills",
      label: "At least 5 skills listed",
      passed: cv.skills.length >= 5,
      hint: "List 5 or more relevant skills, matching keywords from the job description.",
    },
    {
      id: "education",
      label: "Education included",
      passed: cv.education.length > 0,
      hint: "Add your highest qualification — most ATS filters look for this field.",
    },
  ];
}

export function completenessScore(cv: CVData): number {
  const checks = runAtsChecks(cv);
  const passed = checks.filter((c) => c.passed).length;
  return Math.round((passed / checks.length) * 100);
}

const KEYWORD_BANK: Record<string, string[]> = {
  "software engineer": [
    "API",
    "CI/CD",
    "Agile",
    "Cloud",
    "Testing",
    "Version Control",
    "System Design",
  ],
  "data analyst": [
    "SQL",
    "Data Visualization",
    "Excel",
    "Python",
    "Dashboards",
    "Statistical Analysis",
  ],
  "project manager": [
    "Stakeholder Management",
    "Budgeting",
    "Scrum",
    "Risk Management",
    "Roadmapping",
  ],
  "marketing": [
    "SEO",
    "Campaign Strategy",
    "Content Marketing",
    "Analytics",
    "Brand Positioning",
  ],
  "designer": [
    "Figma",
    "User Research",
    "Wireframing",
    "Prototyping",
    "Design Systems",
  ],
  "civil engineer": [
    "AutoCAD",
    "Site Supervision",
    "Structural Design",
    "Project Costing",
  ],
};

export function suggestKeywords(cv: CVData): string[] {
  const title = cv.jobTitle.toLowerCase();
  const existing = new Set(cv.skills.map((s) => s.name.toLowerCase()));
  let bucket: string[] = [];
  for (const key of Object.keys(KEYWORD_BANK)) {
    if (title.includes(key.split(" ")[0])) {
      bucket = KEYWORD_BANK[key];
      break;
    }
  }
  if (bucket.length === 0) {
    bucket = ["Communication", "Leadership", "Problem Solving", "Teamwork"];
  }
  return bucket.filter((k) => !existing.has(k.toLowerCase()));
}
