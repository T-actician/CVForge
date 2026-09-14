import { ShieldCheck, LayoutGrid, PenLine, Download } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "100% ATS Friendly",
    text: "Optimized for applicant tracking systems (ATS).",
  },
  {
    icon: LayoutGrid,
    title: "Multiple Templates",
    text: "Modern, clean and professional designs.",
  },
  {
    icon: PenLine,
    title: "Easy Customization",
    text: "Add, remove and reorder sections with simple controls.",
  },
  {
    icon: Download,
    title: "Instant Download",
    text: "Get your CV in PDF format, ready to apply.",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-y border-[var(--line)] bg-[var(--ivory)]/60">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex items-start gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[var(--gold)]/50 text-[var(--gold-dark)]">
              <f.icon size={18} strokeWidth={1.6} />
            </span>
            <div>
              <p className="text-[15px] text-[var(--brown-900)]">{f.title}</p>
              <p className="text-[13.5px] text-[var(--brown-500)] mt-1 leading-snug">
                {f.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
