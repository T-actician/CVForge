export default function MiniCVMockup({
  name,
  title,
}: {
  name: string;
  title: string;
}) {
  return (
    <div className="bg-[var(--paper)] text-[var(--brown-900)] p-5 text-[9px] leading-tight font-sans h-full w-full overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[var(--ivory)] border border-[var(--line)]" />
          <div>
            <p className="font-display text-[13px] leading-none text-[var(--brown-900)]">
              {name}
            </p>
            <p className="text-[9px] text-[var(--brown-500)] mt-1">{title}</p>
            <div className="mt-1.5 flex gap-3 text-[7.5px] text-[var(--brown-500)]">
              <span>daniel.mwangi@example.com</span>
              <span>+254 712 345 678</span>
            </div>
            <p className="text-[7.5px] text-[var(--brown-500)]">
              Nairobi, Kenya · linkedin.com/in/danielmwangi
            </p>
          </div>
        </div>
        <div className="h-9 w-9 rounded-full bg-[var(--ivory)] border border-[var(--line)] shrink-0" />
      </div>

      <div className="grid grid-cols-[1fr_74px] gap-4 mt-4">
        <div>
          <p className="uppercase tracking-wide text-[8px] text-[var(--gold-dark)] font-semibold border-b border-[var(--line)] pb-1 mb-1.5">
            Professional Summary
          </p>
          <p className="text-[7.5px] text-[var(--brown-500)]">
            Motivated and detail-oriented Software Engineer with 3+ years of
            experience in building scalable web applications. Passionate
            about clean code and continuous learning.
          </p>

          <p className="uppercase tracking-wide text-[8px] text-[var(--gold-dark)] font-semibold border-b border-[var(--line)] pb-1 mb-1.5 mt-3">
            Work Experience
          </p>
          <p className="text-[7.5px] font-semibold">
            Software Engineer | TechSolutions Ltd{" "}
            <span className="float-right font-normal text-[var(--brown-500)]">
              2022 – Present
            </span>
          </p>
          <ul className="list-disc ml-3 text-[7px] text-[var(--brown-500)] mt-0.5 space-y-0.5">
            <li>Developed and maintained applications using React and Node.js</li>
            <li>Collaborated with cross-functional teams to deliver quality code</li>
            <li>Improved application performance by 40% through optimization</li>
          </ul>
          <p className="text-[7.5px] font-semibold mt-1.5">
            Junior Developer | BrightTech Solutions{" "}
            <span className="float-right font-normal text-[var(--brown-500)]">
              2020 – 2021
            </span>
          </p>
          <ul className="list-disc ml-3 text-[7px] text-[var(--brown-500)] mt-0.5 space-y-0.5">
            <li>Built responsive interfaces with HTML, CSS and JavaScript</li>
            <li>Assisted in database design and integration</li>
          </ul>

          <p className="uppercase tracking-wide text-[8px] text-[var(--gold-dark)] font-semibold border-b border-[var(--line)] pb-1 mb-1.5 mt-3">
            Education
          </p>
          <p className="text-[7.5px]">
            BSc. Electrical &amp; Electronics Engineering
          </p>
          <p className="text-[7px] text-[var(--brown-500)]">
            University of Nairobi | 2016 – 2020
          </p>
        </div>

        <div>
          <p className="uppercase tracking-wide text-[8px] text-[var(--gold-dark)] font-semibold border-b border-[var(--line)] pb-1 mb-1.5">
            Skills
          </p>
          <ul className="text-[7px] text-[var(--brown-500)] space-y-0.5">
            <li>JavaScript</li>
            <li>React</li>
            <li>Node.js</li>
            <li>Python</li>
            <li>Project Management</li>
            <li>Problem Solving</li>
          </ul>
          <p className="uppercase tracking-wide text-[8px] text-[var(--gold-dark)] font-semibold border-b border-[var(--line)] pb-1 mb-1.5 mt-3">
            Languages
          </p>
          <p className="text-[7px] text-[var(--brown-500)]">English (Fluent)</p>
          <p className="text-[7px] text-[var(--brown-500)]">Kiswahili (Native)</p>
        </div>
      </div>
    </div>
  );
}
