"use client";

import { useCVStore } from "@/store/cvStore";
import { runAtsChecks, completenessScore, suggestKeywords } from "@/lib/ats";
import { CheckCircle2, Circle } from "lucide-react";

export default function AtsPanel() {
  const { cv } = useCVStore();
  const checks = runAtsChecks(cv);
  const score = completenessScore(cv);
  const keywords = suggestKeywords(cv);

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[13px] text-[var(--brown-500)]">ATS Readiness</p>
          <p className="text-[15px] font-display text-[var(--brown-900)]">{score}%</p>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--ivory)] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] transition-all"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <ul className="space-y-2">
        {checks.map((c) => (
          <li key={c.id} className="flex items-start gap-2 text-[12.5px]">
            {c.passed ? (
              <CheckCircle2 size={15} className="text-[var(--gold-dark)] shrink-0 mt-0.5" />
            ) : (
              <Circle size={15} className="text-[var(--brown-300)] shrink-0 mt-0.5" />
            )}
            <div>
              <p className={c.passed ? "text-[var(--brown-900)]" : "text-[var(--brown-500)]"}>
                {c.label}
              </p>
              {!c.passed && (
                <p className="text-[11.5px] text-[var(--brown-300)] mt-0.5">{c.hint}</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {keywords.length > 0 && (
        <div>
          <p className="text-[13px] text-[var(--brown-500)] mb-2">
            Suggested keywords for &ldquo;{cv.jobTitle || "your role"}&rdquo;
          </p>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((k) => (
              <span
                key={k}
                className="text-[11.5px] px-2.5 py-1 rounded-full border border-[var(--gold)]/50 text-[var(--gold-dark)]"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
