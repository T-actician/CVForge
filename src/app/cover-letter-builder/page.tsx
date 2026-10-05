"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FileText, ArrowLeft, Sparkles } from "lucide-react";
import { useCoverLetterStore } from "@/store/coverLetterStore";
import { sampleLetter, todayString } from "@/lib/coverLetterTypes";
import { COVER_LETTER_TEMPLATES, ACCENT_PRESETS } from "@/lib/coverLetterTemplates";
import LetterEditor from "@/components/cover-letter/LetterEditor";
import LetterDownloadButton from "@/components/cover-letter/LetterDownloadButton";
import CoverLetterRenderer from "@/components/cover-letter-templates/CoverLetterRenderer";
import CoverLetterPreview from "@/components/cover-letter-templates/CoverLetterPreview";

function BuilderInner() {
  const params = useSearchParams();
  const { letter, templateId, accent, setTemplateId, setAccent, setLetter, updateField } =
    useCoverLetterStore();
  const [tab, setTab] = useState<"content" | "design">("content");
  const [hydrated, setHydrated] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.62);
  const [innerH, setInnerH] = useState(1123);

  useEffect(() => {
    const el = wrapRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    const update = () => {
      const available = Math.min(el.offsetWidth, window.innerWidth - 32);
      setScale(Math.min(0.62, available / 794));
      setInnerH(inner.offsetHeight);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    ro.observe(inner);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [tab]);

  useEffect(() => {
    useCoverLetterStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const t = params.get("template");
    if (t && COVER_LETTER_TEMPLATES.some((x) => x.id === t)) setTemplateId(t);
    if (!useCoverLetterStore.getState().letter.date) updateField("date", todayString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const templateName = COVER_LETTER_TEMPLATES.find((t) => t.id === templateId)?.name;

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col overflow-x-hidden">
      <header className="flex items-center justify-between gap-2 px-3 sm:px-6 py-4 border-b border-[var(--line)] bg-[var(--paper)]">
        <div className="flex items-center gap-2 sm:gap-5 min-w-0">
          <Link href="/cover-letters" className="flex items-center gap-1.5 text-[13.5px] text-[var(--brown-500)] hover:text-[var(--brown-900)]">
            <ArrowLeft size={15} /> Cover Letters
          </Link>
          <span className="flex items-center gap-2">
            <FileText size={16} className="text-[var(--gold-dark)]" />
            <span className="font-display text-[16px] text-[var(--brown-900)]">Vitae</span>
          </span>
          <span className="hidden sm:block text-[13px] text-[var(--brown-300)]">{templateName}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <span className="hidden md:block text-[11.5px] text-[var(--brown-300)]">Auto-saved on this device</span>
          <button
            onClick={() => setLetter(sampleLetter())}
            aria-label="Load sample data"
            className="flex items-center gap-1.5 text-[13px] text-[var(--brown-500)] hover:text-[var(--gold-dark)]"
          >
            <Sparkles size={14} />
            <span className="hidden sm:inline">Load sample data</span>
          </button>
          <LetterDownloadButton />
        </div>
      </header>

      <div className="flex-1 min-w-0 grid md:grid-cols-[440px_1fr]">
        <div className="min-w-0 border-r border-[var(--line)] bg-[var(--paper)] flex flex-col">
          <div className="flex border-b border-[var(--line)]">
            {(["content", "design"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-[13.5px] capitalize transition-colors ${
                  tab === t ? "text-[var(--brown-900)] border-b-2 border-[var(--gold)]" : "text-[var(--brown-500)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="p-5 md:overflow-y-auto md:max-h-[calc(100vh-140px)]">
            {tab === "content" && <LetterEditor />}
            {tab === "design" && (
              <div className="space-y-5">
                <div>
                  <p className="text-[13px] text-[var(--brown-500)] mb-3">
                    Switch templates anytime — your details stay intact.
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {COVER_LETTER_TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTemplateId(t.id)}
                        title={t.name}
                        className={`shrink-0 w-16 aspect-[3/4] rounded-md overflow-hidden border-2 transition-colors ${
                          templateId === t.id ? "border-[var(--gold)]" : "border-[var(--line)] hover:border-[var(--brown-300)]"
                        }`}
                      >
                        <CoverLetterPreview templateId={t.id} accent={accent} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[12px] text-[var(--brown-500)] mb-2">Accent colour</p>
                  <div className="flex flex-wrap gap-2.5">
                    {ACCENT_PRESETS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setAccent(c)}
                        aria-label={`Accent ${c}`}
                        className={`h-8 w-8 rounded-full border-2 ${accent === c ? "border-[var(--brown-900)]" : "border-[var(--line)]"}`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0 flex items-start justify-center p-4 sm:p-8 md:overflow-auto bg-[var(--ivory)]/40">
          <div ref={wrapRef} className="w-full max-w-[794px] flex justify-center">
            <div
              className="shadow-xl overflow-hidden"
              style={{ width: 794 * scale, height: innerH * scale, maxWidth: "100%" }}
            >
              <div
                ref={innerRef}
                style={{ width: 794, transform: `scale(${scale})`, transformOrigin: "top left" }}
              >
                <CoverLetterRenderer templateId={templateId} letter={letter} accent={accent} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoverLetterBuilderPage() {
  return (
    <Suspense fallback={null}>
      <BuilderInner />
    </Suspense>
  );
}
