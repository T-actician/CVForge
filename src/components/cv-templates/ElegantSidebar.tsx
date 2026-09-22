import { CVData } from "@/lib/cvTypes";
import { CVSection, DARK_STYLE, LIGHT_STYLE, splitSections, Avatar, ContactLine } from "./shared";

export default function ElegantSidebar({ cv }: { cv: CVData }) {
  const { main, aside } = splitSections(cv, ["skills", "languages", "certifications"]);

  return (
    <div className="bg-white text-[#241a10] font-sans w-full h-full flex">
      <div className="w-[34%] min-w-0 bg-[#241a10] text-white p-6">
        <Avatar photo={cv.photo} size={68} />
        <p
          className="mt-4 text-[18px] leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {cv.fullName || "Your Name"}
        </p>
        <p className="text-[11px] text-[var(--tpl-accent-light)] mt-1">{cv.jobTitle}</p>

        <div className="mt-5 text-[9.5px] text-white/70">
          <ContactLine cv={cv} layout="stacked" className="space-y-1" />
        </div>

        <div className="mt-6">
          {aside.map((type) => (
            <CVSection key={type} type={type} cv={cv} style={DARK_STYLE} />
          ))}
        </div>
      </div>

      <div className="flex-1 p-7 min-w-0">
        {main.map((type) => (
          <CVSection key={type} type={type} cv={cv} style={LIGHT_STYLE} />
        ))}
      </div>
    </div>
  );
}
