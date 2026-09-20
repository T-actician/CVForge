"use client";

import { useState } from "react";
import { useCVStore } from "@/store/cvStore";
import { runAtsChecks, completenessScore } from "@/lib/ats";
import { CheckCircle2, Circle, Plus, Loader2, AlertTriangle } from "lucide-react";

interface JobMatchResult {
  mode: "job-match";
  profession: string;
  matchScore: number;
  matched: string[];
  missing: string[];
  notes: string;
}

interface ProfessionKeywordsResult {
  mode: "profession-keywords";
  profession: string;
  matched: string[];
  missing: string[];
}

type AnalysisResult = JobMatchResult | ProfessionKeywordsResult;

export default function AtsPanel() {
  const { cv, updateField } = useCVStore();
  const checks = runAtsChecks(cv);
  const score = completenessScore(cv);

  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/ats/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, jobDescription: jobDescription.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed.");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  // Adding a "missing" item is a deliberate choice the candidate makes for
  // themselves — the app never asserts they have it, it just offers a
  // one-click way to add it to their own skills list if it's actually true.
  const addAsSkill = (name: string) => {
    if (cv.skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;
    updateField("skills", [
      ...cv.skills,
      { id: `sk-${Math.random().toString(36).slice(2, 9)}`, name, level: 3 },
    ]);
  };

  return (
    <div className="space-y-7">
      {/* ATS Readiness — structure/parsing, instant, no job needed */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[13px] text-[var(--brown-500)]">
            ATS Readiness <span className="text-[var(--brown-300)]">— parsing &amp; structure</span>
          </p>
          <p className="text-[15px] font-display text-[var(--brown-900)]">{score}%</p>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--ivory)] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] transition-all"
            style={{ width: `${score}%` }}
          />
        </div>

        <ul className="space-y-2 mt-3">
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
      </div>

      <div className="h-px bg-[var(--line)]" />

      {/* Job Match — profession-aware, only meaningful once compared against
          a real posting (or, without one, general profession terminology) */}
      <div>
        <p className="text-[13px] text-[var(--brown-500)] mb-2">
          Job Match <span className="text-[var(--brown-300)]">— how well this CV fits a role</span>
        </p>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here for an exact match against this posting — or leave blank for general keyword suggestions for your profession."
          rows={5}
          className="w-full rounded-md border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-[12.5px] outline-none focus:border-[var(--gold)] resize-none"
        />
        <button
          type="button"
          onClick={analyze}
          disabled={loading}
          className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-[var(--brown-900)] px-4 py-2 text-[13px] text-white hover:brightness-110 transition disabled:opacity-60"
        >
          {loading && <Loader2 size={13} className="animate-spin" />}
          {loading
            ? "Analyzing…"
            : jobDescription.trim()
            ? "Analyze against this job"
            : "Suggest keywords for my profession"}
        </button>

        {error && (
          <div className="mt-2 flex items-start gap-2 rounded-md border border-[#a5473a]/30 bg-[#a5473a]/5 px-3 py-2.5">
            <AlertTriangle size={14} className="text-[#a5473a] shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#a5473a]">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 space-y-3">
            <p className="text-[12.5px] text-[var(--brown-500)]">
              Profession detected: <span className="text-[var(--brown-900)]">{result.profession}</span>
            </p>

            {result.mode === "job-match" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[13px] text-[var(--brown-500)]">Match score</p>
                  <p className="text-[15px] font-display text-[var(--brown-900)]">
                    {result.matchScore}%
                  </p>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--ivory)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] transition-all"
                    style={{ width: `${result.matchScore}%` }}
                  />
                </div>
                {result.notes && (
                  <p className="text-[12px] text-[var(--brown-500)] mt-2">{result.notes}</p>
                )}
              </div>
            )}

            {result.matched.length > 0 && (
              <div>
                <p className="text-[12px] text-[var(--brown-500)] mb-1.5">
                  Already on your CV
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.matched.map((k) => (
                    <span
                      key={k}
                      className="text-[11.5px] px-2.5 py-1 rounded-full border border-[var(--gold)]/50 text-[var(--gold-dark)] bg-[var(--gold)]/5"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.missing.length > 0 && (
              <div>
                <p className="text-[12px] text-[var(--brown-500)] mb-1.5">
                  Not found on your CV — add only if you genuinely have it
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.missing.map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => addAsSkill(k)}
                      className="inline-flex items-center gap-1 text-[11.5px] px-2.5 py-1 rounded-full border border-[var(--line)] text-[var(--brown-500)] hover:border-[var(--gold)] hover:text-[var(--brown-900)] transition-colors"
                    >
                      <Plus size={11} />
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
