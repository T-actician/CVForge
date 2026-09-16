"use client";

import { useCVStore } from "@/store/cvStore";
import { TEMPLATES } from "@/lib/templates";
import TemplatePreview from "@/components/cv-templates/TemplatePreview";
import { AllTemplateSettings } from "@/lib/templateSettings";

export default function TemplateSwitcher({
  settings,
}: {
  settings?: AllTemplateSettings;
}) {
  const { templateId, setTemplateId } = useCVStore();

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => setTemplateId(t.id)}
          className={`shrink-0 w-16 aspect-[3/4] rounded-md overflow-hidden border-2 transition-colors ${
            templateId === t.id
              ? "border-[var(--gold)]"
              : "border-[var(--line)] hover:border-[var(--brown-300)]"
          }`}
          title={t.name}
        >
          <TemplatePreview templateId={t.id} settings={settings?.[t.id]} />
        </button>
      ))}
    </div>
  );
}
