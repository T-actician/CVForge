import { CVData } from "@/lib/cvTypes";
import { CVSection, LIGHT_STYLE, splitSections, ContactLine } from "./shared";

const STYLE = {
  ...LIGHT_STYLE,
  titleClass:
    "text-[10px] tracking-[0.16em] uppercase font-semibold text-[#241a10] pb-1 mb-2 border-b border-[#e6dcc6]",
};

export default function MinimalClean({ cv }: { cv: CVData }) {
  const { main } = splitSections(cv, []);

  return (
    <div className="bg-white text-[#241a10] p-10 font-sans w-full h-full overflow-hidden">
      <div className="text-center pb-4 border-b border-[#e6dcc6]">
        <p
          className="text-[24px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {cv.fullName || "Your Name"}
        </p>
        <p className="text-[12px] text-[var(--tpl-accent-dark)] mt-1">{cv.jobTitle}</p>
        <ContactLine cv={cv} layout="inline" className="text-[9.5px] text-[#6f5a41] mt-2" />
      </div>

      <div className="mt-5 max-w-[560px] mx-auto">
        {main.map((type) => (
          <CVSection key={type} type={type} cv={cv} style={STYLE} />
        ))}
      </div>
    </div>
  );
}
