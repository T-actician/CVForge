import type { CVData } from "@/lib/cvTypes";
import type { CoverLetterData } from "@/lib/coverLetterTypes";
import type { TemplateSettings } from "@/lib/templateSettings";

export type PrintPayload =
  | { kind: "cv"; templateId: string; cv: CVData; settings?: TemplateSettings }
  | { kind: "letter"; templateId: string; letter: CoverLetterData; accent: string };
