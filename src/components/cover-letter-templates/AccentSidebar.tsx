import { CoverLetterData } from "@/lib/coverLetterTypes";
import { ContactItems, LetterBody } from "./shared";

export default function AccentSidebar({ l }: { l: CoverLetterData }) {
  return (
    <div className="bg-white font-sans w-full min-h-[1123px] flex">
      <div className="w-[210px] shrink-0 bg-[#241a10] text-white px-6 py-14 min-w-0">
        <p className="text-[22px] leading-tight" style={{ fontFamily: "var(--font-display)" }}>
          {l.fullName || "Your Name"}
        </p>
        <p className="text-[11px] text-[var(--tpl-accent-light)] mt-1.5">{l.jobTitle}</p>
        <div className="h-[3px] w-10 bg-[var(--tpl-accent)] my-6" />
        <p className="text-[9px] tracking-[0.16em] uppercase text-white/50 mb-2">Contact</p>
        <div className="flex flex-col gap-2 text-[10px] text-white/80 leading-snug">
          <ContactItems l={l} />
        </div>
      </div>
      <div className="flex-1 min-w-0 px-10 py-14">
        <LetterBody l={l} />
      </div>
    </div>
  );
}
