import { CVData } from "@/lib/cvTypes";
import { CVSection, LIGHT_STYLE, splitSections } from "./shared";

export default function Elegant({ cv }: { cv: CVData }) {
  const { main, aside } = splitSections(cv, ["skills", "languages"]);

  return (
    <div className="bg-[#fffdf8] text-[#241a10] p-10 font-sans w-full h-full">
      <div className="flex items-end justify-between pb-4 border-b-2 border-[#c9974a]">
        <div>
          <p
            className="text-[24px] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {cv.fullName || "Your Name"}
          </p>
          <p className="text-[12px] text-[#a97c33] mt-1">{cv.jobTitle}</p>
        </div>
        <div className="text-right text-[9.5px] text-[#6f5a41] leading-relaxed">
          {cv.email && <p>{cv.email}</p>}
          {cv.phone && <p>{cv.phone}</p>}
          {cv.location && <p>{cv.location}</p>}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_180px] gap-8 mt-5">
        <div>
          {main.map((type) => (
            <CVSection key={type} type={type} cv={cv} style={LIGHT_STYLE} />
          ))}
        </div>
        <div>
          {aside.map((type) => (
            <CVSection key={type} type={type} cv={cv} style={LIGHT_STYLE} />
          ))}
        </div>
      </div>
    </div>
  );
}
