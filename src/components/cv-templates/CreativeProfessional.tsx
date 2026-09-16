import { CVData } from "@/lib/cvTypes";
import { CVSection, LIGHT_STYLE, splitSections, Avatar } from "./shared";

const ASIDE_STYLE = {
  ...LIGHT_STYLE,
  titleClass:
    "text-[10px] tracking-[0.12em] uppercase font-semibold text-[var(--tpl-accent-dark)] pb-1 mb-2 border-b border-[#e6dcc6]",
};

export default function CreativeProfessional({ cv }: { cv: CVData }) {
  const { main, aside } = splitSections(cv, ["skills", "languages", "certifications"]);

  return (
    <div className="bg-white text-[#241a10] font-sans w-full h-full">
      <div className="bg-[#241a10] text-white px-9 py-6 flex items-center gap-4">
        <Avatar photo={cv.photo} size={56} />
        <div>
          <p
            className="text-[20px] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {cv.fullName || "Your Name"}
          </p>
          <p className="text-[11px] text-[var(--tpl-accent-light)] mt-0.5">{cv.jobTitle}</p>
          <p className="text-[9px] text-white/60 mt-1.5">
            {[cv.email, cv.phone, cv.location, cv.website].filter(Boolean).join("  ·  ")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_180px] gap-8 px-9 py-6">
        <div>
          {main.map((type) => (
            <CVSection key={type} type={type} cv={cv} style={LIGHT_STYLE} />
          ))}
        </div>
        <div>
          {aside.map((type) => (
            <CVSection key={type} type={type} cv={cv} style={ASIDE_STYLE} />
          ))}
        </div>
      </div>
    </div>
  );
}
