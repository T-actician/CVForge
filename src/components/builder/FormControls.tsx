export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[12px] text-[var(--brown-500)] mb-1">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-md border bg-[var(--paper)] px-3 py-2 text-[13.5px] text-[var(--brown-900)] outline-none transition-colors ${
          error
            ? "border-[#a5473a] focus:border-[#a5473a]"
            : "border-[var(--line)] focus:border-[var(--gold)]"
        }`}
      />
      {error && <span className="block text-[11px] text-[#a5473a] mt-1">{error}</span>}
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="block text-[12px] text-[var(--brown-500)] mb-1">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-md border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-[13.5px] text-[var(--brown-900)] outline-none focus:border-[var(--gold)] transition-colors resize-none"
      />
    </label>
  );
}

export function SmallButton({
  children,
  onClick,
  variant = "ghost",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "ghost" | "danger" | "gold";
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] transition-colors";
  const styles = {
    ghost:
      "border border-[var(--line)] text-[var(--brown-700)] hover:border-[var(--brown-500)]",
    danger: "text-[#a5473a] hover:bg-[#a5473a]/10",
    gold: "bg-[var(--gold)] text-white hover:brightness-105",
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  );
}
