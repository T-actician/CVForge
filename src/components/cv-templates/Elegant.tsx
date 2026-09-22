import { CVData } from "@/lib/cvTypes";
import { CVSection, LIGHT_STYLE, splitSections, ContactLine } from "./shared";

export default function Elegant({ cv }: { cv: CVData }) {
  const { main, aside } = splitSections(cv, ["skills", "languages"]);

  return (
    <div className="bg-[#fffdf8] text-[#241a10] p-10 font-sans w-full min-h-full">
      <div className="flex items-end justify-between pb-4 border-b-2 border-[var(--tpl-accent)]">
        <div>
          <p
            className="text-[24px] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {cv.fullName || "Your Name"}
          </p>
          <p className="text-[12px] text-[var(--tpl-accent-dark)] mt-1">{cv.jobTitle}</p>
        </div>
        <div className="text-right text-[9.5px] text-[#6f5a41] leading-relaxed">
          <ContactLine cv={cv} layout="stacked" className="" />
        </div>
      </div>

      <div className="flex gap-8 mt-5">
        <div className="flex-1 min-w-0">
          {main.map((type) => (
            <CVSection key={type} type={type} cv={cv} style={LIGHT_STYLE} />
          ))}
        </div>
        <div className="w-[180px] min-w-0 shrink-0">
          {aside.map((type) => (
            <CVSection key={type} type={type} cv={cv} style={LIGHT_STYLE} />
          ))}
        </div>
      </div>
    </div>
  );
}
