export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--ivory)]/60">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-8 text-center">
        <p className="text-[13.5px] text-[var(--brown-500)]">
          © {new Date().getFullYear()} Vitae. Your future, well presented.
        </p>
      </div>
    </footer>
  );
}
