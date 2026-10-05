import { CoverLetterData } from "@/lib/coverLetterTypes";
import { ContactItems, LetterBody } from "./shared";

export default function MinimalCentered({ l }: { l: CoverLetterData }) {
  return (
    <div className="bg-white font-sans w-full min-h-[1123px] px-16 py-14">
      <div className="text-center">
        <p
          className="text-[26px] tracking-[0.16em] uppercase text-[#241a10]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {l.fullName || "Your Name"}
        </p>
        <p className="text-[11px] tracking-[0.2em] uppercase text-[var(--tpl-accent-dark)] mt-1.5">
          {l.jobTitle}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-[10px] text-[#6f5a41]">
          <ContactItems l={l} />
        </div>
        <div className="mx-auto mt-6 mb-10 h-px w-24 bg-[var(--tpl-accent)]" />
      </div>
      <LetterBody l={l} />
    </div>
  );
}
