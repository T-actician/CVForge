import Link from "next/link";
import type { SiteConfig } from "@/lib/siteConfig";

const STEPS = [
  {
    n: "1",
    title: "Choose a Template",
    text: "Pick from a variety of professional designs.",
  },
  {
    n: "2",
    title: "Fill in Your Details",
    text: "Add your personal information, experience, education and more.",
  },
  {
    n: "3",
    title: "Customize (Optional)",
    text: "Add or remove sections and make it your own.",
  },
  {
    n: "4",
    title: "Download & Apply",
    text: "Get your ATS-friendly CV in PDF format.",
  },
];

export default function HowItWorks({ config }: { config: SiteConfig }) {
  const hasImage = Boolean(config.howItWorksBackgroundImage);

  return (
    <section
      id="how-it-works"
      className="relative text-[var(--ivory)] bg-[var(--brown-900)] bg-cover bg-center"
      style={
        hasImage
          ? { backgroundImage: `url(${config.howItWorksBackgroundImage})` }
          : undefined
      }
    >
      {hasImage && (
        <div className="absolute inset-0 bg-[var(--brown-900)]/80" />
      )}

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-16 grid lg:grid-cols-[280px_1fr] gap-12 items-start">
        <div>
          <p className="text-[13px] tracking-[0.12em] text-[var(--gold-light)] mb-3">
            SIMPLE STEPS
          </p>
          <h2 className="font-display text-4xl mb-3">How It Works</h2>
          <p className="text-[var(--brown-300)] mb-7 max-w-xs font-serif-body">
            Get your professional CV in just a few easy steps.
          </p>
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] px-6 py-3 text-[15px] text-[var(--paper)] hover:brightness-105 transition"
          >
            Get Started <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((s) => (
            <div key={s.n}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold)]/60 text-[var(--gold-light)] text-[14px] font-display">
                {s.n}
              </span>
              <p className="mt-4 text-[16px]">{s.title}</p>
              <p className="mt-1.5 text-[13.5px] text-[var(--brown-300)] leading-relaxed">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
