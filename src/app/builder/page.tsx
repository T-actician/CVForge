"use client";

import { useEffect, useState, Suspense } from "react";
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

  useEffect(() => {
    fetch("/api/admin/template-settings")
      .then((r) => r.json())
      .then(setTemplateSettings)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = params.get("template");
    if (t) setTemplateId(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <button
            onClick={() => setCV(sampleCV())}
            className="hidden sm:flex items-center gap-1.5 text-[13px] text-[var(--brown-500)] hover:text-[var(--gold-dark)]"
          >
            <Sparkles size={14} /> Load sample data
          </button>
          <DownloadButton />
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

        <div className="flex items-start justify-center p-8 overflow-auto bg-[var(--ivory)]/40">
          <div
            className="shadow-xl origin-top"
            style={{
              width: 794,
              transform: "scale(0.62)",
              marginBottom: -1123 * 0.38,
            }}
          >
            <CVRenderer templateId={templateId} cv={cv} settings={templateSettings[templateId]} />
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
