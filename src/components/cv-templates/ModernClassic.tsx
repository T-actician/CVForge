import { CVData } from "@/lib/cvTypes";
import { CVSection, LIGHT_STYLE, splitSections, Avatar, ContactLine } from "./shared";

export default function ModernClassic({ cv }: { cv: CVData }) {
  const { main, aside } = splitSections(cv, ["skills", "languages"]);

  return (
    <div className="bg-white text-[#241a10] p-10 font-sans w-full h-full overflow-hidden">
      <div className="flex items-center gap-4 pb-4 border-b-2 border-[#241a10]">
        <Avatar photo={cv.photo} size={60} />
        <div>
          <p className="font-display text-[22px] leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            {cv.fullName || "Your Name"}
          </p>
          <p className="text-[12px] text-[var(--tpl-accent-dark)]">{cv.jobTitle}</p>
          <ContactLine cv={cv} layout="inline" className="text-[9.5px] text-[#6f5a41] mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_190px] gap-8 mt-5">
        <div className="min-w-0">
          {main.map((type) => (
            <CVSection key={type} type={type} cv={cv} style={LIGHT_STYLE} />
          ))}
        </div>
        <div className="min-w-0">
          {aside.map((type) => (
            <CVSection key={type} type={type} cv={cv} style={LIGHT_STYLE} />
          ))}
        </div>
      </div>
    </div>
  );
}
