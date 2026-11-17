import { getJSON, putJSON } from "@/lib/b2";
import { TEMPLATES } from "@/lib/templates";
import type { SectionLabelOptions, SectionType } from "@/lib/cvTypes";

const SETTINGS_KEY = "content/template-settings.json";

export type TemplateFont = "default" | "serif" | "sans";

export interface TemplateSettings {
  accentColor: string; // hex, e.g. "#c9974a"
  fontFamily: TemplateFont;
  // Admin-defined heading options per section. First option is the default.
  sectionLabels?: SectionLabelOptions;
}

export const FONT_STACKS: Record<Exclude<TemplateFont, "default">, string> = {
  serif: "'Playfair Display', Georgia, 'Times New Roman', serif",
  sans: "'Inter', -apple-system, 'Segoe UI', sans-serif",
};

export const FONT_OPTIONS: { value: TemplateFont; label: string }[] = [
  { value: "default", label: "Default (site font)" },
  { value: "serif", label: "Classic Serif" },
  { value: "sans", label: "Modern Sans" },
];

// The site's existing brand gold — used as the default for every template so
// nothing changes visually until an admin explicitly customizes a template.
export const DEFAULT_TEMPLATE_SETTINGS: TemplateSettings = {
  accentColor: "#c9974a",
  fontFamily: "default",
};

export type AllTemplateSettings = Record<string, TemplateSettings>;

export async function getAllTemplateSettings(): Promise<AllTemplateSettings> {
  const stored = await getJSON<Partial<AllTemplateSettings>>(SETTINGS_KEY, {});
  const all: AllTemplateSettings = {};
  for (const t of TEMPLATES) {
    all[t.id] = { ...DEFAULT_TEMPLATE_SETTINGS, ...stored[t.id] };
  }
  return all;
}

export async function saveTemplateSettings(
  templateId: string,
  settings: TemplateSettings
): Promise<AllTemplateSettings> {
  const current = await getAllTemplateSettings();
  const cleaned: SectionLabelOptions = {};
  for (const [k, v] of Object.entries(settings.sectionLabels ?? {})) {
    const list = Array.from(
      new Set((v ?? []).map((l) => String(l).trim().slice(0, 40)).filter(Boolean))
    );
    if (list.length) cleaned[k as SectionType] = list;
  }
  const next = { ...current, [templateId]: { ...settings, sectionLabels: cleaned } };
  await putJSON(SETTINGS_KEY, next);
  return next;
}
