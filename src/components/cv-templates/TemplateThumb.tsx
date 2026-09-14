export default function TemplateThumb({ templateId }: { templateId: string }) {
  const gold = "bg-[var(--gold)]";

  if (templateId === "elegant-sidebar") {
    return (
      <div className="flex h-full w-full text-[6px]">
        <div className="w-[34%] bg-[var(--brown-900)] p-2.5 space-y-2.5">
          <div className="h-6 w-6 rounded-full bg-[var(--gold-light)]/40 mx-auto" />
          <div className="space-y-1">
            <span className="block h-1 w-3/4 rounded-full bg-[var(--gold-light)]/60" />
            <span className="block h-1 w-1/2 rounded-full bg-white/20" />
          </div>
          <div className="space-y-1 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className="block h-1 rounded-full bg-white/20" style={{ width: `${70 - i * 8}%` }} />
            ))}
          </div>
        </div>
        <div className="flex-1 p-2.5 space-y-2">
          <span className="block h-1.5 w-2/3 rounded-full bg-[var(--brown-700)]" />
          <div className="space-y-1 pt-1">
            {[1, 2, 3].map((i) => (
              <span key={i} className={i === 1 ? "block h-1 w-full rounded-full bg-[var(--gold)]" : "block h-1 w-full rounded-full bg-[var(--brown-300)]"} />
            ))}
          </div>
          <div className="space-y-1 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className="block h-1 rounded-full bg-[var(--brown-300)]" style={{ width: `${90 - i * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "creative-professional") {
    return (
      <div className="h-full w-full text-[6px]">
        <div className="h-9 bg-[var(--brown-900)] flex items-center gap-2 px-2.5">
          <div className="h-4 w-4 rounded-full bg-[var(--gold-light)]/50" />
          <div className="space-y-1">
            <span className="block h-1 w-10 rounded-full bg-[var(--gold-light)]/70" />
            <span className="block h-1 w-8 rounded-full bg-white/30" />
          </div>
        </div>
        <div className="flex gap-2 p-2.5">
          <div className="flex-1 space-y-1">
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className="block h-1 rounded-full bg-[var(--brown-300)]" style={{ width: `${95 - i * 12}%` }} />
            ))}
          </div>
          <div className="w-[28%] space-y-1">
            {[1, 2, 3].map((i) => (
              <span key={i} className={`block h-1 rounded-full ${gold}`} style={{ width: `${80 - i * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "elegant") {
    return (
      <div className="h-full w-full text-[6px] p-2.5">
        <div className="h-8 border-b border-[var(--gold)] mb-2 flex items-center justify-between">
          <span className="block h-1.5 w-1/2 rounded-full bg-[var(--brown-700)]" />
          <span className="block h-1 w-6 rounded-full bg-[var(--gold)]" />
        </div>
        <div className="flex gap-2">
          <div className="flex-1 space-y-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="block h-1 rounded-full bg-[var(--brown-300)]" style={{ width: `${90 - i * 8}%` }} />
            ))}
          </div>
          <div className="w-[26%] space-y-1">
            {[1, 2, 3].map((i) => (
              <span key={i} className={`block h-1 rounded-full ${gold}`} style={{ width: `${75 - i * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "modern-blue-accent") {
    return (
      <div className="flex h-full w-full text-[6px] p-2.5 gap-2">
        <div className="flex-1 space-y-2">
          <div className="space-y-1">
            <span className="block h-1.5 w-2/3 rounded-full bg-[var(--brown-700)]" />
            <span className="block h-1 w-1/2 rounded-full bg-[var(--brown-300)]" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1 pt-1">
              <span className="block h-1 w-1/3 rounded-full bg-[var(--gold-dark)]" />
              <span className="block h-1 w-full rounded-full bg-[var(--brown-300)]" />
              <span className="block h-1 w-4/5 rounded-full bg-[var(--brown-300)]" />
            </div>
          ))}
        </div>
        <div className="w-[30%] space-y-2 border-l border-[var(--line)] pl-2">
          <div className="h-6 w-6 rounded-full bg-[var(--gold-light)] mx-auto" />
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className={`block h-1 rounded-full ${gold}`} style={{ width: `${85 - i * 12}%`, opacity: 0.8 }} />
          ))}
        </div>
      </div>
    );
  }

  if (templateId === "minimal-clean") {
    return (
      <div className="h-full w-full text-[6px] p-3 space-y-2">
        <div className="text-center space-y-1 pb-2 border-b border-[var(--line)]">
          <span className="block h-1.5 w-1/2 mx-auto rounded-full bg-[var(--brown-700)]" />
          <span className="block h-1 w-1/3 mx-auto rounded-full bg-[var(--brown-300)]" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="block h-1 rounded-full bg-[var(--brown-300)]" style={{ width: `${95 - (i % 3) * 15}%` }} />
        ))}
      </div>
    );
  }

  // modern-classic (default)
  return (
    <div className="h-full w-full text-[6px] p-2.5 space-y-2">
      <div className="flex items-center gap-2 pb-2 border-b border-[var(--line)]">
        <div className="h-6 w-6 rounded-full bg-[var(--ivory)] border border-[var(--line)]" />
        <div className="space-y-1">
          <span className="block h-1.5 w-16 rounded-full bg-[var(--brown-700)]" />
          <span className="block h-1 w-10 rounded-full bg-[var(--brown-300)]" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 space-y-1">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="block h-1 rounded-full bg-[var(--brown-300)]" style={{ width: `${90 - i * 10}%` }} />
          ))}
        </div>
        <div className="w-[26%] space-y-1">
          {[1, 2, 3].map((i) => (
            <span key={i} className={`block h-1 rounded-full ${gold}`} style={{ width: `${80 - i * 12}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
