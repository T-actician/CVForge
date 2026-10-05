import { CoverLetterData, splitParagraphs } from "@/lib/coverLetterTypes";
import { normalizeUrl } from "@/components/cv-templates/shared";

export function contactItems(l: CoverLetterData) {
  return [
    { text: l.email },
    { text: l.phone },
    { text: l.location },
    l.website ? { text: l.website, href: normalizeUrl(l.website) } : null,
  ].filter((i): i is { text: string; href?: string } => Boolean(i && i.text));
}

export function ContactItems({
  l,
  className = "",
  linkClass = "",
}: {
  l: CoverLetterData;
  className?: string;
  linkClass?: string;
}) {
  return (
    <>
      {contactItems(l).map((i, k) =>
        i.href ? (
          <a
            key={k}
            href={i.href}
            target="_blank"
            rel="noopener noreferrer"
            data-pdf-link={i.href}
            className={`${className} ${linkClass} break-words`}
          >
            {i.text}
          </a>
        ) : (
          <span key={k} className={`${className} break-words`}>
            {i.text}
          </span>
        )
      )}
    </>
  );
}

// Date, recipient block, subject, salutation, body, sign-off.
export function LetterBody({
  l,
  subjectClass = "",
}: {
  l: CoverLetterData;
  subjectClass?: string;
}) {
  const paras = splitParagraphs(l.body);
  const recipient = [l.recipientName, l.recipientTitle, l.company, l.companyAddress].filter(Boolean);

  return (
    <div className="text-[12px] leading-[1.75] text-[#241a10]">
      {l.date && <p className="mb-5 text-[#6f5a41]">{l.date}</p>}
      {recipient.length > 0 && (
        <div className="mb-6">
          {recipient.map((r, i) => (
            <p key={i} className={i === 0 ? "font-semibold" : ""}>
              {r}
            </p>
          ))}
        </div>
      )}
      {l.subject && (
        <p className={`mb-4 font-semibold ${subjectClass}`}>Re: {l.subject}</p>
      )}
      {l.salutation && <p className="mb-3">{l.salutation}</p>}
      {paras.length > 0 ? (
        paras.map((p, i) => (
          <p key={i} className="mb-3 text-justify break-words">
            {p}
          </p>
        ))
      ) : (
        <p className="mb-3 text-[#9c8869]">Your letter will appear here…</p>
      )}
      {l.closing && <p className="mt-6">{l.closing}</p>}
      <p
        className="mt-8 text-[17px] text-[var(--tpl-accent-dark)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {l.fullName || "Your Name"}
      </p>
    </div>
  );
}
