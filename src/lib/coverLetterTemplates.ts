import { TemplateMeta } from "@/lib/templates";

export const COVER_LETTER_TEMPLATES: TemplateMeta[] = [
  {
    id: "classic-formal",
    name: "Classic Formal",
    description: "Traditional business letter with a ruled header.",
    bestFor: "Corporate & Finance",
  },
  {
    id: "modern-band",
    name: "Modern Band",
    description: "Bold header band with a clean, airy body.",
    bestFor: "Marketing & Creative",
  },
  {
    id: "minimal-centered",
    name: "Minimal Centered",
    description: "Centered letterhead, generous white space.",
    bestFor: "Any Profession",
  },
  {
    id: "accent-sidebar",
    name: "Accent Sidebar",
    description: "Slim accent column with contact details.",
    bestFor: "Tech & Design",
  },
];

export const ACCENT_PRESETS = [
  "#c9974a",
  "#2f5d8a",
  "#2e7d5b",
  "#8a3b4f",
  "#4a4a6a",
  "#241a10",
];
