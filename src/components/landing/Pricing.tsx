import Link from "next/link";
import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "",
    features: ["1 CV template", "PDF download with watermark", "Basic ATS checks"],
    cta: "Start Free",
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    features: [
      "All 6 templates",
      "Unlimited CVs & downloads",
      "Full ATS scoring & keyword suggestions",
      "No watermark",
    ],
    cta: "Get Pro",
    highlight: true,
  },
  {
    name: "Lifetime",
    price: "$59",
    period: "one-time",
    features: ["Everything in Pro", "Priority template updates", "Lifetime access"],
    cta: "Buy Lifetime",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 sm:px-10 py-20">
      <div className="text-center max-w-xl mx-auto mb-12">
        <p className="text-[13px] tracking-[0.12em] text-[var(--gold-dark)] mb-3">
          PRICING
        </p>
        <h2 className="font-display text-4xl text-[var(--brown-900)]">
          Simple, Honest Pricing
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`rounded-xl p-8 border ${
              p.highlight
                ? "border-[var(--gold)] bg-[var(--paper)] shadow-lg shadow-[var(--gold)]/10 scale-[1.02]"
                : "border-[var(--line)] bg-[var(--paper)]/60"
            }`}
          >
            <p className="font-display text-xl text-[var(--brown-900)]">{p.name}</p>
            <p className="mt-3">
              <span className="font-display text-4xl text-[var(--brown-900)]">
                {p.price}
              </span>
              <span className="text-[var(--brown-500)] text-[14px]"> {p.period}</span>
            </p>
            <ul className="mt-6 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] text-[var(--brown-700)]">
                  <Check size={16} className="text-[var(--gold-dark)] mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/templates"
              className={`mt-8 block text-center rounded-md py-3 text-[14.5px] transition ${
                p.highlight
                  ? "bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] text-[var(--paper)] hover:brightness-105"
                  : "border border-[var(--brown-900)] text-[var(--brown-900)] hover:bg-[var(--brown-900)] hover:text-[var(--ivory)]"
              }`}
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
