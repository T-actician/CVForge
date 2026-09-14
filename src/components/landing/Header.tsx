import Link from "next/link";
import { FileText } from "lucide-react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Templates", href: "/templates" },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
];

export default function Header() {
  return (
    <header className="relative z-20 grid grid-cols-[1fr_auto_1fr] items-center px-6 sm:px-10 py-5 border-b border-[var(--line)]/70">
      <Link href="/" className="flex items-center gap-2.5 justify-self-start">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--brown-900)] text-[var(--gold-light)]">
          <FileText size={18} strokeWidth={1.75} />
        </span>
        <span className="font-display text-xl tracking-tight text-[var(--brown-900)]">
          Vitae
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-9 text-[15px] text-[var(--brown-700)] justify-self-center">
        {NAV.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              i === 0
                ? "text-[var(--gold-dark)] border-b border-[var(--gold-dark)] pb-1"
                : "hover:text-[var(--brown-900)] transition-colors"
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div />
    </header>
  );
}
