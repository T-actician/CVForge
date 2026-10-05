import { CoverLetterData } from "@/lib/coverLetterTypes";
import { ContactItems, LetterBody } from "./shared";

export default function ModernBand({ l }: { l: CoverLetterData }) {
  return (
    <div className="bg-white font-sans w-full min-h-[1123px]">
      <div className="bg-[#241a10] px-14 py-9 text-white">
        <p className="text-[30px] leading-tight" style={{ fontFamily: "var(--font-display)" }}>
          {l.fullName || "Your Name"}
        </p>
        <p className="text-[12px] tracking-[0.14em] uppercase text-[var(--tpl-accent-light)] mt-1">
          {l.jobTitle}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[10px] text-white/70">
          <ContactItems l={l} />
        </div>
      </div>
      <div className="h-[5px] bg-[var(--tpl-accent)]" />
      <div className="px-14 pt-10 pb-14">
        <LetterBody l={l} subjectClass="text-[var(--tpl-accent-dark)]" />
      </div>
    </div>
  );
}
