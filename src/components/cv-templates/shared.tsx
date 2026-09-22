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
// Education details). A line becomes a bullet ONLY if it's explicitly
// marked as one — starts with "-", "*", "•", or "1."/"1)" — never by its
// position in the text. Any line without a marker stays part of the
// flowing paragraph exactly as typed, even if it comes after some bullets,
// and even if the user's paragraph itself wraps across several physical
// lines (those get rejoined into one paragraph, not scattered into bullets).
const BULLET_MARKER_RE = /^\s*(?:[-•*]|\d+[.)])\s+/;

export function MultilineText({
  text,
  className,
}: {
  text: string;
  className: string;
}) {
  type Block = { type: "p" | "ul"; lines: string[] };
  const blocks: Block[] = [];
  let forceNewBlock = false;

  const push = (type: Block["type"], line: string) => {
    const last = blocks[blocks.length - 1];
    if (!forceNewBlock && last && last.type === type) {
      last.lines.push(line);
    } else {
      blocks.push({ type, lines: [line] });
    }
    forceNewBlock = false;
  };

  if (text.includes("\n")) {
    for (const raw of text.split("\n")) {
      const line = raw.trim();
      if (!line) {
        forceNewBlock = true;
        continue;
      }
      const m = line.match(BULLET_MARKER_RE);
      if (m) push("ul", line.slice(m[0].length).trim());
      else push("p", line);
    }
  } else {
    // No real line breaks — legacy data where "•" was typed as an inline
    // separator between bullet points rather than a real newline. Anything
    // before the first "•" is prose; each part after it is a bullet.
    const parts = text.split("•").map((p) => p.trim()).filter(Boolean);
    parts.forEach((part, i) => {
      const m = part.match(BULLET_MARKER_RE);
      if (m) push("ul", part.slice(m[0].length).trim());
      else if (i === 0) push("p", part);
      else push("ul", part);
    });
  }

  if (blocks.length === 0) return null;

  return (
    <>
      {blocks.map((b, i) =>
        b.type === "p" ? (
          <p key={i} className={`${className} ${i > 0 ? "mt-1" : ""}`}>
            {b.lines.join(" ")}
          </p>
        ) : (
          <ul key={i} className={`list-disc ml-4 space-y-0.5 mt-1 ${className}`}>
            {b.lines.map((l, j) => (
              <li key={j}>{l}</li>
            ))}
          </ul>
        )
      )}
    </>
  );
}

// Ensures a project link always has a protocol, so it opens correctly both
// as a clickable link in the live preview and as a PDF link annotation.
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

// Renders the candidate's contact line (email, phone, location, website,
// portfolio) consistently across every template. Website and portfolio are
// real clickable links (data-pdf-link makes them clickable in the exported
// PDF too, see DownloadButton) — email/phone/location stay plain text.
// "inline" joins everything on one line with "·" separators; "stacked"
// gives each field its own line.
export function ContactLine({
  cv,
  layout,
  className,
  style = LIGHT_STYLE,
  centered = false,
}: {
  cv: CVData;
  layout: "inline" | "stacked";
  className: string;
  style?: TitleStyle;
  centered?: boolean;
}) {
  const items: { text: string; href?: string }[] = [
    { text: cv.email },
    { text: cv.phone },
    { text: cv.location },
    cv.website ? { text: cv.website, href: normalizeUrl(cv.website) } : null,
    cv.portfolio ? { text: cv.portfolio, href: normalizeUrl(cv.portfolio) } : null,
  ].filter((i): i is { text: string; href?: string } => Boolean(i && i.text));

  if (items.length === 0) return null;

  // Website/portfolio links get the same rounded-pill treatment as project
  // links (see the "projects" case below) so they read as clickable chips
  // rather than plain underlined text.
  const renderItem = (item: (typeof items)[number], i: number) =>
    item.href ? (
      <a
        key={i}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        data-pdf-link={item.href}
        className={`inline-block max-w-full break-words px-2 py-0.5 rounded-full border hover:underline ${style.dividerClass} ${style.subTextClass}`}
      >
        {item.text}
      </a>
    ) : (
      <span key={i}>{item.text}</span>
    );

  if (layout === "stacked") {
    return (
      <div className={className}>
        {items.map((item, i) => (
          <p key={i} className={item.href ? "mt-1" : undefined}>
            {renderItem(item, i)}
          </p>
        ))}
      </div>
    );
  }

  return (
    <p className={`${className} flex flex-wrap items-center gap-x-1 gap-y-1${centered ? " justify-center" : ""}`}>
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          {i > 0 && !item.href && !items[i - 1].href && "·"}
          {renderItem(item, i)}
        </span>
      ))}
    </p>
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
              className={`max-w-full break-words text-[9.5px] px-2 py-1 rounded-full border ${s.dividerClass} ${s.subTextClass}`}
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
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`text-[11px] font-semibold ${s.textClass}`}>{p.name}</p>
                {p.link && (
                  <a
                    href={normalizeUrl(p.link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-pdf-link={normalizeUrl(p.link)}
                    className={`max-w-full break-words text-[8.5px] px-2 py-0.5 rounded-full border hover:underline ${s.dividerClass} ${s.subTextClass}`}
                  >
                    {p.link}
                  </a>
                )}
              </div>
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
