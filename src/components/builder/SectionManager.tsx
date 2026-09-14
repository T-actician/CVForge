"use client";

import { useState } from "react";
import { useCVStore } from "@/store/cvStore";
import { SECTION_LABELS, SectionType } from "@/lib/cvTypes";
import { ChevronDown, ChevronUp, Eye, EyeOff, User } from "lucide-react";
import PersonalInfoEditor from "./PersonalInfoEditor";
import {
  SummaryEditor,
  ExperienceEditor,
  EducationEditor,
  SkillsEditor,
  ProjectsEditor,
  CertificationsEditor,
  LanguagesEditor,
  ReferencesEditor,
} from "./SectionForms";

const EDITORS: Record<SectionType, React.ComponentType> = {
  summary: SummaryEditor,
  experience: ExperienceEditor,
  education: EducationEditor,
  skills: SkillsEditor,
  projects: ProjectsEditor,
  certifications: CertificationsEditor,
  languages: LanguagesEditor,
  references: ReferencesEditor,
};

export default function SectionManager() {
  const { cv, toggleSection, moveSection } = useCVStore();
  const [open, setOpen] = useState<string>("personal");

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-[var(--line)] overflow-hidden">
        <button
          onClick={() => setOpen(open === "personal" ? "" : "personal")}
          className="w-full flex items-center justify-between px-4 py-3 bg-[var(--ivory)]/50"
        >
          <span className="flex items-center gap-2 text-[14px] text-[var(--brown-900)]">
            <User size={15} /> Personal Details
          </span>
          {open === "personal" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {open === "personal" && (
          <div className="p-4">
            <PersonalInfoEditor />
          </div>
        )}
      </div>

      {cv.sectionOrder.map((type, idx) => {
        const Editor = EDITORS[type];
        const visible = cv.visibleSections[type];
        return (
          <div key={type} className="rounded-lg border border-[var(--line)] overflow-hidden">
            <div className="w-full flex items-center justify-between px-4 py-3 bg-[var(--ivory)]/50">
              <button
                onClick={() => setOpen(open === type ? "" : type)}
                className={`flex items-center gap-2 text-[14px] flex-1 text-left ${
                  visible ? "text-[var(--brown-900)]" : "text-[var(--brown-300)]"
                }`}
              >
                {SECTION_LABELS[type]}
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveSection(type, "up")}
                  disabled={idx === 0}
                  className="p-1 text-[var(--brown-500)] disabled:opacity-30 hover:text-[var(--brown-900)]"
                  title="Move up"
                >
                  <ChevronUp size={15} />
                </button>
                <button
                  onClick={() => moveSection(type, "down")}
                  disabled={idx === cv.sectionOrder.length - 1}
                  className="p-1 text-[var(--brown-500)] disabled:opacity-30 hover:text-[var(--brown-900)]"
                  title="Move down"
                >
                  <ChevronDown size={15} />
                </button>
                <button
                  onClick={() => toggleSection(type)}
                  className="p-1 text-[var(--brown-500)] hover:text-[var(--gold-dark)]"
                  title={visible ? "Hide section" : "Show section"}
                >
                  {visible ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  onClick={() => setOpen(open === type ? "" : type)}
                  className="p-1 text-[var(--brown-500)]"
                >
                  {open === type ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>
            {open === type && (
              <div className="p-4">
                <Editor />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
