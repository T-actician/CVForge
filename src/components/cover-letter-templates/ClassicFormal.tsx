import { CoverLetterData } from "@/lib/coverLetterTypes";
import { ContactItems, LetterBody } from "./shared";

export default function ClassicFormal({ l }: { l: CoverLetterData }) {
  return (
    <div className="bg-white font-sans w-full min-h-[1123px] px-14 py-14">
      <div className="pb-4 border-b-2 border-[#241a10] flex items-end justify-between gap-6">
        <div className="min-w-0">
          <p className="text-[28px] leading-tight text-[#241a10]" style={{ fontFamily: "var(--font-display)" }}>
            {l.fullName || "Your Name"}
          </p>
          <p className="text-[12px] text-[var(--tpl-accent-dark)] mt-0.5">{l.jobTitle}</p>
        </div>
        <div className="text-right text-[10px] leading-[1.6] text-[#6f5a41] flex flex-col items-end min-w-0 max-w-[260px]">
          <ContactItems l={l} />
        </div>
      </div>
      <div className="h-[3px] w-16 bg-[var(--tpl-accent)] mt-[3px] mb-9" />
      <LetterBody l={l} />
    </div>
  );
}
