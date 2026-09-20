"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Templates", href: "/templates" },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Support", href: "/#pricing" },
];

export default function Header() {
  const pathname = usePathname();

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

      <nav className="hidden md:flex items-center gap-1.5 text-[15px] justify-self-center">
        {NAV.map((item) => {
          // Section anchors (#features etc.) only ever live on "/", so only
          // an exact path match counts as active for them; "/" itself is
          // active only when there's no hash in the URL.
          const isHashLink = item.href.includes("#");
          const isActive = isHashLink
            ? false
            : item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                isActive
                  ? "text-[var(--brown-900)] bg-gradient-to-r from-[var(--gold-dark)]/15 to-[var(--gold)]/15 shadow-[inset_0_0_0_1px_var(--gold)]"
                  : "text-[var(--brown-700)] hover:text-[var(--brown-900)] hover:bg-[var(--brown-900)]/[0.04]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div />
    </header>
  );
}
