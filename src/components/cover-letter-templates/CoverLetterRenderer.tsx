import { CoverLetterData } from "@/lib/coverLetterTypes";
import { deriveAccentShades } from "@/lib/color";
import ClassicFormal from "./ClassicFormal";
import ModernBand from "./ModernBand";
import MinimalCentered from "./MinimalCentered";
import AccentSidebar from "./AccentSidebar";

export default function CoverLetterRenderer({
  templateId,
  letter,
  accent = "#c9974a",
}: {
  templateId: string;
  letter: CoverLetterData;
  accent?: string;
}) {
  const { accentDark, accentLight } = deriveAccentShades(accent);
  const style = {
    "--tpl-accent": accent,
    "--tpl-accent-dark": accentDark,
    "--tpl-accent-light": accentLight,
  } as React.CSSProperties;

  let t;
  switch (templateId) {
    case "modern-band":
      t = <ModernBand l={letter} />;
      break;
    case "minimal-centered":
      t = <MinimalCentered l={letter} />;
      break;
    case "accent-sidebar":
      t = <AccentSidebar l={letter} />;
      break;
    default:
      t = <ClassicFormal l={letter} />;
  }
  return (
    <div className="w-full" style={style}>
      {t}
    </div>
  );
}
