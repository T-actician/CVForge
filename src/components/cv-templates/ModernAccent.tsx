import { CVData } from "@/lib/cvTypes";
import { CVSection, LIGHT_STYLE, splitSections, Avatar } from "./shared";

const ASIDE_STYLE = {
  ...LIGHT_STYLE,
  titleClass:
    "text-[10px] tracking-[0.12em] uppercase font-semibold text-[#241a10] pb-1 mb-2 border-b border-[#c9974a]",
};

export default function ModernAccent({ cv }: { cv: CVData }) {
  const { main, aside } = splitSections(cv, ["skills", "languages", "certifications"]);

  return (
    <div className="bg-white text-[#241a10] font-sans w-full h-full flex">
      <div className="flex-1 p-8">
        <p
          className="text-[22px] leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {cv.fullName || "Your Name"}
        </p>
        <p className="text-[12px] text-[#a97c33] mt-1">{cv.jobTitle}</p>
        <p className="text-[9.5px] text-[#6f5a41] mt-1.5 mb-4">
          {[cv.email, cv.phone, cv.location, cv.website].filter(Boolean).join("  ·  ")}
        </p>
        {main.map((type) => (
          <CVSection key={type} type={type} cv={cv} style={LIGHT_STYLE} />
        ))}
      </div>
      <div className="w-[180px] bg-[#f4ecdb] p-6 border-l border-[#e6dcc6]">
        <Avatar photo={cv.photo} size={56} />
        <div className="mt-5">
          {aside.map((type) => (
            <CVSection key={type} type={type} cv={cv} style={ASIDE_STYLE} />
          ))}
        </div>
      </div>
    </div>
  );
}
