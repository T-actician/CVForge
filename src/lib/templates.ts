export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  bestFor: string;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "modern-classic",
    name: "Modern Classic",
    description: "A timeless two-column layout with a clean header.",
    bestFor: "Software Engineer",
  },
  {
    id: "elegant-sidebar",
    name: "Elegant Sidebar",
    description: "Dark sidebar for contact, skills and languages.",
    bestFor: "Data Analyst",
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Single column, ATS-first, no distractions.",
    bestFor: "Project Manager",
  },
  {
    id: "creative-professional",
    name: "Creative Professional",
    description: "Bold header band with a structured two-column body.",
    bestFor: "Marketing Specialist",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Soft ivory tones with a refined masthead.",
    bestFor: "Civil Engineer",
  },
  {
    id: "modern-blue-accent",
    name: "Modern Blue Accent",
    description: "Crisp accent column for skills and languages.",
    bestFor: "UI/UX Designer",
  },
];
