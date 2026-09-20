import { CVData } from "@/lib/cvTypes";

export default function MiniCVMockup({ cv }: { cv: CVData }) {
  return (
    <div className="bg-[var(--paper)] text-[var(--brown-900)] p-5 text-[9px] leading-tight font-sans h-full w-full overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[var(--ivory)] border border-[var(--line)]" />
          <div>
            <p className="font-display text-[13px] leading-none text-[var(--brown-900)]">
              {cv.fullName}
            </p>
            <p className="text-[9px] text-[var(--brown-500)] mt-1">{cv.jobTitle}</p>
            <div className="mt-1.5 flex gap-3 text-[7.5px] text-[var(--brown-500)]">
              {cv.email && <span>{cv.email}</span>}
              {cv.phone && <span>{cv.phone}</span>}
            </div>
            {(cv.location || cv.website || cv.portfolio) && (
              <p className="text-[7.5px] text-[var(--brown-500)]">
                {[cv.location, cv.website, cv.portfolio].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </div>
        <div className="h-9 w-9 rounded-full bg-[var(--ivory)] border border-[var(--line)] shrink-0" />
      </div>

      <div className="grid grid-cols-[1fr_74px] gap-4 mt-4">
        <div>
          {cv.summary && (
            <>
              <p className="uppercase tracking-wide text-[8px] text-[var(--gold-dark)] font-semibold border-b border-[var(--line)] pb-1 mb-1.5">
                Professional Summary
              </p>
              <p className="text-[7.5px] text-[var(--brown-500)]">{cv.summary}</p>
            </>
          )}

          {cv.experience.length > 0 && (
            <>
              <p className="uppercase tracking-wide text-[8px] text-[var(--gold-dark)] font-semibold border-b border-[var(--line)] pb-1 mb-1.5 mt-3">
                Work Experience
              </p>
              {cv.experience.map((exp) => (
                <div key={exp.id} className="mt-1.5 first:mt-0">
                  <p className="text-[7.5px] font-semibold">
                    {exp.role} | {exp.company}{" "}
                    <span className="float-right font-normal text-[var(--brown-500)]">
                      {exp.start} – {exp.current ? "Present" : exp.end}
                    </span>
                  </p>
                  {exp.bullets.length > 0 && (
                    <ul className="list-disc ml-3 text-[7px] text-[var(--brown-500)] mt-0.5 space-y-0.5">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </>
          )}

          {cv.education.length > 0 && (
            <>
              <p className="uppercase tracking-wide text-[8px] text-[var(--gold-dark)] font-semibold border-b border-[var(--line)] pb-1 mb-1.5 mt-3">
                Education
              </p>
              {cv.education.map((ed) => (
                <div key={ed.id}>
                  <p className="text-[7.5px]">{ed.degree}</p>
                  <p className="text-[7px] text-[var(--brown-500)]">
                    {ed.school}
                    {ed.school && (ed.start || ed.end) ? " | " : ""}
                    {ed.start} {ed.start && ed.end ? "–" : ""} {ed.end}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>

        <div>
          {cv.skills.length > 0 && (
            <>
              <p className="uppercase tracking-wide text-[8px] text-[var(--gold-dark)] font-semibold border-b border-[var(--line)] pb-1 mb-1.5">
                Skills
              </p>
              <ul className="text-[7px] text-[var(--brown-500)] space-y-0.5">
                {cv.skills.map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </>
          )}

          {cv.languages.length > 0 && (
            <>
              <p className="uppercase tracking-wide text-[8px] text-[var(--gold-dark)] font-semibold border-b border-[var(--line)] pb-1 mb-1.5 mt-3">
                Languages
              </p>
              {cv.languages.map((l) => (
                <p key={l.id} className="text-[7px] text-[var(--brown-500)]">
                  {l.name} ({l.level})
                </p>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
