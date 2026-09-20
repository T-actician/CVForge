"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FileText, ArrowLeft, Sparkles } from "lucide-react";
import { useCVStore } from "@/store/cvStore";
import { sampleCV } from "@/lib/cvTypes";
import { completenessScore } from "@/lib/ats";
import { TEMPLATES } from "@/lib/templates";
import SectionManager from "@/components/builder/SectionManager";
import TemplateSwitcher from "@/components/builder/TemplateSwitcher";
import AtsPanel from "@/components/builder/AtsPanel";
import DownloadButton from "@/components/builder/DownloadButton";
import CVRenderer from "@/components/cv-templates/CVRenderer";
import { AllTemplateSettings } from "@/lib/templateSettings";

function BuilderInner() {
  const params = useSearchParams();
  const { cv, templateId, setTemplateId, setCV } = useCVStore();
  const [tab, setTab] = useState<"content" | "design" | "ats">("content");
  const [templateSettings, setTemplateSettings] = useState<AllTemplateSettings>({});
  const [hydrated, setHydrated] = useState(false);
  const previewWrapRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.62);

  useEffect(() => {
    const el = previewWrapRef.current;
    if (!el) return;
    // Same 0.62 desktop scale as before, but never wider than the actual
    // space available — on a narrow phone the fixed 0.62 made the 794px
    // design width overflow, forcing the browser to shrink it further and
    // leaving the CV looking squeezed into a thin column.
    const update = () => setPreviewScale(Math.min(0.62, el.offsetWidth / 794));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    useCVStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  useEffect(() => {
    fetch("/api/admin/template-settings")
      .then((r) => r.json())
      .then(setTemplateSettings)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const t = params.get("template");
    if (t) setTemplateId(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const templateName = TEMPLATES.find((t) => t.id === templateId)?.name;
  const score = completenessScore(cv);

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[var(--paper)]">
        <div className="flex items-center gap-5">
          <Link href="/templates" className="flex items-center gap-1.5 text-[13.5px] text-[var(--brown-500)] hover:text-[var(--brown-900)]">
            <ArrowLeft size={15} /> Templates
          </Link>
          <span className="flex items-center gap-2">
            <FileText size={16} className="text-[var(--gold-dark)]" />
            <span className="font-display text-[16px] text-[var(--brown-900)]">Vitae</span>
          </span>
          <span className="hidden sm:block text-[13px] text-[var(--brown-300)]">
            {templateName}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-[11.5px] text-[var(--brown-300)]">
            Auto-saved on this device
          </span>
          <button
            onClick={() => setCV(sampleCV())}
            className="hidden sm:flex items-center gap-1.5 text-[13px] text-[var(--brown-500)] hover:text-[var(--gold-dark)]"
          >
            <Sparkles size={14} /> Load sample data
          </button>
          <DownloadButton settings={templateSettings[templateId]} />
        </div>
      </header>

      <div className="flex-1 grid lg:grid-cols-[440px_1fr]">
        <div className="border-r border-[var(--line)] bg-[var(--paper)] flex flex-col">
          <div className="flex border-b border-[var(--line)]">
            {(["content", "design", "ats"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-[13.5px] capitalize transition-colors ${
                  tab === t
                    ? "text-[var(--brown-900)] border-b-2 border-[var(--gold)]"
                    : "text-[var(--brown-500)]"
                }`}
              >
                {t === "ats" ? `ATS (${score}%)` : t}
              </button>
            ))}
          </div>
          <div className="p-5 overflow-y-auto max-h-[calc(100vh-140px)]">
            {tab === "content" && <SectionManager />}
            {tab === "design" && (
              <div>
                <p className="text-[13px] text-[var(--brown-500)] mb-3">
                  Switch templates anytime — your details stay intact.
                </p>
                <TemplateSwitcher settings={templateSettings} />
              </div>
            )}
            {tab === "ats" && <AtsPanel />}
          </div>
        </div>

        <div className="flex items-start justify-center p-4 sm:p-8 overflow-auto bg-[var(--ivory)]/40">
          <div ref={previewWrapRef} className="w-full max-w-[794px] flex justify-center">
            <div
              className="shadow-xl"
              style={{
                width: 794 * previewScale,
                marginBottom: -1123 * (1 - previewScale),
              }}
            >
              <div
                style={{
                  width: 794,
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top left",
                }}
              >
                <CVRenderer templateId={templateId} cv={cv} settings={templateSettings[templateId]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={null}>
      <BuilderInner />
    </Suspense>
  );
}
