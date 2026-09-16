import { CVData } from "@/lib/cvTypes";
import {
  TemplateSettings,
  DEFAULT_TEMPLATE_SETTINGS,
  FONT_STACKS,
} from "@/lib/templateSettings";
import { deriveAccentShades } from "@/lib/color";
import ModernClassic from "./ModernClassic";
import ElegantSidebar from "./ElegantSidebar";
import MinimalClean from "./MinimalClean";
import CreativeProfessional from "./CreativeProfessional";
import Elegant from "./Elegant";
import ModernAccent from "./ModernAccent";

export default function CVRenderer({
  templateId,
  cv,
  settings,
}: {
  templateId: string;
  cv: CVData;
  settings?: TemplateSettings;
}) {
  const s = settings ?? DEFAULT_TEMPLATE_SETTINGS;
  const { accent, accentDark, accentLight } = deriveAccentShades(s.accentColor);

  const style: Record<string, string> = {
    "--tpl-accent": accent,
    "--tpl-accent-dark": accentDark,
    "--tpl-accent-light": accentLight,
  };
  if (s.fontFamily !== "default") {
    const stack = FONT_STACKS[s.fontFamily];
    style["--font-display"] = stack;
    style["--font-sans"] = stack;
  }

  let template;
  switch (templateId) {
    case "elegant-sidebar":
      template = <ElegantSidebar cv={cv} />;
      break;
    case "minimal-clean":
      template = <MinimalClean cv={cv} />;
      break;
    case "creative-professional":
      template = <CreativeProfessional cv={cv} />;
      break;
    case "elegant":
      template = <Elegant cv={cv} />;
      break;
    case "modern-blue-accent":
      template = <ModernAccent cv={cv} />;
      break;
    case "modern-classic":
    default:
      template = <ModernClassic cv={cv} />;
  }

  return (
    <div className="h-full w-full" style={style as React.CSSProperties}>
      {template}
    </div>
  );
}
