import { CVData, SectionType, SECTION_LABELS } from "@/lib/cvTypes";

export function splitSections(
  cv: CVData,
  asideTypes: SectionType[]
): { main: SectionType[]; aside: SectionType[] } {
  const visible = cv.sectionOrder.filter(
    (s) => cv.visibleSections[s] && hasContent(cv, s)
  );
  return {
    main: visible.filter((s) => !asideTypes.includes(s)),
    aside: visible.filter((s) => asideTypes.includes(s)),
  };
}

export function hasContent(cv: CVData, type: SectionType): boolean {
  switch (type) {
    case "summary":
      return cv.summary.trim().length > 0;
    case "experience":
      return cv.experience.length > 0;
    case "education":
      return cv.education.length > 0;
    case "skills":
      return cv.skills.length > 0;
    case "projects":
      return cv.projects.length > 0;
    case "certifications":
      return cv.certifications.length > 0;
    case "languages":
      return cv.languages.length > 0;
    case "references":
      return cv.references.length > 0;
    default:
      return false;
  }
}

// Renders free-text description/details fields (Project description,
// Education details) so that if the user typed multiple lines — with or
// without their own "-"/"•" prefix — each line becomes a real bullet,
// instead of the browser collapsing all newlines into one cramped
// paragraph (the default behavior for plain text in HTML).
export function MultilineText({
  text,
  className,
}: {
  text: string;
  className: string;
}) {
  const lines = text
    .split("\n")
    .map((l) => l.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean);

  if (lines.length === 0) return null;

  if (lines.length === 1) {
    return <p className={className}>{lines[0]}</p>;
  }

  return (
    <ul className={`list-disc ml-4 space-y-0.5 ${className}`}>
      {lines.map((l, i) => (
        <li key={i}>{l}</li>
      ))}
    </ul>
  );
}

interface TitleStyle {
  titleClass: string;
  textClass: string;
  subTextClass: string;
  accentClass: string;
  dividerClass: string;
}

export const LIGHT_STYLE: TitleStyle = {
  titleClass:
    "text-[10.5px] tracking-[0.12em] uppercase font-semibold text-[var(--tpl-accent-dark)] pb-1 mb-2 border-b border-[#e6dcc6]",
  textClass: "text-[#33261a]",
  subTextClass: "text-[#6f5a41]",
  accentClass: "text-[var(--tpl-accent-dark)]",
  dividerClass: "border-[#e6dcc6]",
};

export const DARK_STYLE: TitleStyle = {
  titleClass:
    "text-[10px] tracking-[0.12em] uppercase font-semibold text-[var(--tpl-accent-light)] pb-1 mb-2 border-b border-white/15",
  textClass: "text-white",
  subTextClass: "text-white/65",
  accentClass: "text-[var(--tpl-accent-light)]",
  dividerClass: "border-white/15",
};

export function CVSection({
  type,
  cv,
  style,
}: {
  type: SectionType;
  cv: CVData;
  style: TitleStyle;
}) {
  const s = style;
  const label = SECTION_LABELS[type];

  if (type === "summary") {
    return (
      <div className="mb-4">
        <p className={s.titleClass}>{label}</p>
        <p className={`text-[10.5px] leading-relaxed ${s.subTextClass}`}>
          {cv.summary}
        </p>
      </div>
    );
  }

  if (type === "experience") {
    return (
      <div className="mb-4">
        <p className={s.titleClass}>{label}</p>
        <div className="space-y-3">
          {cv.experience.map((e) => (
            <div key={e.id}>
              <div className="flex items-baseline justify-between gap-2">
                <p className={`text-[11.5px] font-semibold ${s.textClass}`}>
                  {e.role}
                  {e.company ? ` · ${e.company}` : ""}
                </p>
                <p className={`text-[9.5px] shrink-0 ${s.subTextClass}`}>
                  {e.start} – {e.current ? "Present" : e.end}
                </p>
              </div>
              {e.location && (
                <p className={`text-[9.5px] ${s.subTextClass}`}>{e.location}</p>
              )}
              {e.bullets.filter(Boolean).length > 0 && (
                <ul
                  className={`list-disc ml-4 mt-1 space-y-0.5 text-[10px] ${s.subTextClass}`}
                >
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "education") {
    return (
      <div className="mb-4">
        <p className={s.titleClass}>{label}</p>
        <div className="space-y-2.5">
          {cv.education.map((ed) => (
            <div key={ed.id}>
              <div className="flex items-baseline justify-between gap-2">
                <p className={`text-[11px] font-semibold ${s.textClass}`}>
                  {ed.degree}
                </p>
                <p className={`text-[9.5px] shrink-0 ${s.subTextClass}`}>
                  {ed.start} – {ed.end}
                </p>
              </div>
              <p className={`text-[10px] ${s.subTextClass}`}>
                {ed.school}
                {ed.location ? ` · ${ed.location}` : ""}
              </p>
              {ed.details && (
                <MultilineText text={ed.details} className={`text-[10px] mt-0.5 ${s.subTextClass}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "skills") {
    return (
      <div className="mb-4">
        <p className={s.titleClass}>{label}</p>
        <div className="flex flex-wrap gap-1.5">
          {cv.skills.map((sk) => (
            <span
              key={sk.id}
              className={`text-[9.5px] px-2 py-1 rounded-full border ${s.dividerClass} ${s.subTextClass}`}
            >
              {sk.name}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (type === "projects") {
    return (
      <div className="mb-4">
        <p className={s.titleClass}>{label}</p>
        <div className="space-y-2.5">
          {cv.projects.map((p) => (
            <div key={p.id}>
              <p className={`text-[11px] font-semibold ${s.textClass}`}>
                {p.name}
                {p.link && (
                  <span className={`font-normal text-[9.5px] ${s.subTextClass}`}>
                    {" "}
                    · {p.link}
                  </span>
                )}
              </p>
              {p.description && (
                <MultilineText text={p.description} className={`text-[10px] mt-0.5 ${s.subTextClass}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "certifications") {
    return (
      <div className="mb-4">
        <p className={s.titleClass}>{label}</p>
        <div className="space-y-1.5">
          {cv.certifications.map((c) => (
            <div key={c.id} className="flex items-baseline justify-between gap-2">
              <p className={`text-[10.5px] ${s.textClass}`}>
                {c.name}
                {c.issuer ? ` — ${c.issuer}` : ""}
              </p>
              <p className={`text-[9.5px] shrink-0 ${s.subTextClass}`}>{c.date}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "languages") {
    return (
      <div className="mb-4">
        <p className={s.titleClass}>{label}</p>
        <div className="space-y-1">
          {cv.languages.map((l) => (
            <p key={l.id} className={`text-[10.5px] ${s.subTextClass}`}>
              {l.name}
              {l.level ? ` (${l.level})` : ""}
            </p>
          ))}
        </div>
      </div>
    );
  }

  if (type === "references") {
    return (
      <div className="mb-4">
        <p className={s.titleClass}>{label}</p>
        <div className="space-y-2">
          {cv.references.map((r) => (
            <div key={r.id}>
              <p className={`text-[10.5px] font-semibold ${s.textClass}`}>
                {r.name}
              </p>
              <p className={`text-[9.5px] ${s.subTextClass}`}>
                {r.role}
                {r.contact ? ` · ${r.contact}` : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export function Avatar({ photo, size = 56 }: { photo: string; size?: number }) {
  return (
    <div
      className="rounded-full bg-[#f4ecdb] border border-[#e6dcc6] overflow-hidden shrink-0 bg-cover bg-center"
      style={{
        width: size,
        height: size,
        backgroundImage: photo ? `url(${photo})` : undefined,
      }}
    />
  );
}
