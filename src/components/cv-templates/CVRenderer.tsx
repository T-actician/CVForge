import { CVData } from "@/lib/cvTypes";
import ModernClassic from "./ModernClassic";
import ElegantSidebar from "./ElegantSidebar";
import MinimalClean from "./MinimalClean";
import CreativeProfessional from "./CreativeProfessional";
import Elegant from "./Elegant";
import ModernAccent from "./ModernAccent";

export default function CVRenderer({
  templateId,
  cv,
}: {
  templateId: string;
  cv: CVData;
}) {
  switch (templateId) {
    case "elegant-sidebar":
      return <ElegantSidebar cv={cv} />;
    case "minimal-clean":
      return <MinimalClean cv={cv} />;
    case "creative-professional":
      return <CreativeProfessional cv={cv} />;
    case "elegant":
      return <Elegant cv={cv} />;
    case "modern-blue-accent":
      return <ModernAccent cv={cv} />;
    case "modern-classic":
    default:
      return <ModernClassic cv={cv} />;
  }
}
