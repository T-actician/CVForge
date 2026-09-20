"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Menu, X } from "lucide-react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Templates", href: "/templates" },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Support", href: "/#pricing" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLinkActive = (href: string) => {
    const isHashLink = href.includes("#");
    if (isHashLink) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <header className="relative z-20 flex md:grid md:grid-cols-[1fr_auto_1fr] items-center justify-between px-6 sm:px-10 py-5 border-b border-[var(--line)]/70">
      <Link href="/" className="flex items-center gap-2.5 justify-self-start">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--brown-900)] text-[var(--gold-light)]">
          <FileText size={18} strokeWidth={1.75} />
        </span>
        <span className="font-display text-xl tracking-tight text-[var(--brown-900)]">
          Vitae
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-1.5 text-[15px] justify-self-center">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`relative px-3.5 py-1.5 rounded-full transition-all duration-200 ${
              isLinkActive(item.href)
                ? "text-[var(--brown-900)] bg-gradient-to-r from-[var(--gold-dark)]/15 to-[var(--gold)]/15 shadow-[inset_0_0_0_1px_var(--gold)]"
                : "text-[var(--brown-700)] hover:text-[var(--brown-900)] hover:bg-[var(--brown-900)]/[0.04]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
        className="md:hidden justify-self-end flex h-9 w-9 items-center justify-center rounded-md text-[var(--brown-900)] hover:bg-[var(--brown-900)]/[0.06] transition-colors"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {menuOpen && (
        <nav className="md:hidden absolute top-full left-0 right-0 flex flex-col border-b border-[var(--line)]/70 bg-[var(--cream)] px-6 py-3 shadow-lg">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`px-2 py-2.5 text-[15px] rounded-md transition-colors ${
                isLinkActive(item.href)
                  ? "text-[var(--brown-900)] bg-[var(--gold)]/10 font-medium"
                  : "text-[var(--brown-700)] hover:bg-[var(--brown-900)]/[0.04]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
