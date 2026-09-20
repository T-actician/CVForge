"use client";

import { Plus, X } from "lucide-react";
import type {
  CVData,
  ExperienceItem,
  EducationItem,
  SkillItem,
  LanguageItem,
} from "@/lib/cvTypes";

// Client-safe id generator (crypto.randomUUID from "crypto" is Node-only).
function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

const inputClass =
  "w-full rounded-md border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-[13.5px] outline-none focus:border-[var(--gold)]";
const labelClass = "block text-[12px] text-[var(--brown-500)] mb-1";
const sectionTitleClass =
  "font-display text-[17px] text-[var(--brown-900)] mt-8 mb-3 pb-2 border-b border-[var(--line)]";
const removeBtnClass =
  "shrink-0 h-7 w-7 flex items-center justify-center rounded-full border border-[var(--line)] text-[var(--brown-500)] hover:border-[#a5473a] hover:text-[#a5473a] transition-colors";
const addBtnClass =
  "inline-flex items-center gap-1.5 rounded-md border border-dashed border-[var(--line)] px-3 py-1.5 text-[12.5px] text-[var(--brown-700)] hover:border-[var(--gold)] transition-colors";

export default function HeroCvEditor({
  cv,
  onChange,
}: {
  cv: CVData;
  onChange: (cv: CVData) => void;
}) {
  const set = <K extends keyof CVData>(key: K, value: CVData[K]) =>
    onChange({ ...cv, [key]: value });

  // ---- Experience ----
  const updateExp = (id: string, patch: Partial<ExperienceItem>) =>
    set(
      "experience",
      cv.experience.map((e) => (e.id === id ? { ...e, ...patch } : e))
    );
  const addExp = () =>
    set("experience", [
      ...cv.experience,
      {
        id: newId("exp"),
        role: "",
        company: "",
        location: "",
        start: "",
        end: "",
        current: false,
        bullets: [""],
      },
    ]);
  const removeExp = (id: string) =>
    set("experience", cv.experience.filter((e) => e.id !== id));
  const updateBullet = (expId: string, i: number, value: string) =>
    updateExp(expId, {
      bullets: cv.experience
        .find((e) => e.id === expId)!
        .bullets.map((b, bi) => (bi === i ? value : b)),
    });
  const addBullet = (expId: string) => {
    const exp = cv.experience.find((e) => e.id === expId)!;
    updateExp(expId, { bullets: [...exp.bullets, ""] });
  };
  const removeBullet = (expId: string, i: number) => {
    const exp = cv.experience.find((e) => e.id === expId)!;
    updateExp(expId, { bullets: exp.bullets.filter((_, bi) => bi !== i) });
  };

  // ---- Education ----
  const updateEdu = (id: string, patch: Partial<EducationItem>) =>
    set(
      "education",
      cv.education.map((e) => (e.id === id ? { ...e, ...patch } : e))
    );
  const addEdu = () =>
    set("education", [
      ...cv.education,
      { id: newId("edu"), degree: "", school: "", location: "", start: "", end: "", details: "" },
    ]);
  const removeEdu = (id: string) =>
    set("education", cv.education.filter((e) => e.id !== id));

  // ---- Skills ----
  const updateSkill = (id: string, name: string) =>
    set("skills", cv.skills.map((s) => (s.id === id ? { ...s, name } : s)));
  const addSkill = () =>
    set("skills", [...cv.skills, { id: newId("sk"), name: "", level: 3 } as SkillItem]);
  const removeSkill = (id: string) =>
    set("skills", cv.skills.filter((s) => s.id !== id));

  // ---- Languages ----
  const updateLang = (id: string, patch: Partial<LanguageItem>) =>
    set("languages", cv.languages.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const addLang = () =>
    set("languages", [...cv.languages, { id: newId("lang"), name: "", level: "" }]);
  const removeLang = (id: string) =>
    set("languages", cv.languages.filter((l) => l.id !== id));

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <label>
          <span className={labelClass}>Full name</span>
          <input className={inputClass} value={cv.fullName} onChange={(e) => set("fullName", e.target.value)} />
        </label>
        <label>
          <span className={labelClass}>Job title</span>
          <input className={inputClass} value={cv.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} />
        </label>
        <label>
          <span className={labelClass}>Email</span>
          <input className={inputClass} value={cv.email} onChange={(e) => set("email", e.target.value)} />
        </label>
        <label>
          <span className={labelClass}>Phone</span>
          <input className={inputClass} value={cv.phone} onChange={(e) => set("phone", e.target.value)} />
        </label>
        <label>
          <span className={labelClass}>Location</span>
          <input className={inputClass} value={cv.location} onChange={(e) => set("location", e.target.value)} />
        </label>
        <label>
          <span className={labelClass}>Website / LinkedIn</span>
          <input className={inputClass} value={cv.website} onChange={(e) => set("website", e.target.value)} />
        </label>
        <label>
          <span className={labelClass}>Portfolio (optional)</span>
          <input className={inputClass} value={cv.portfolio} onChange={(e) => set("portfolio", e.target.value)} />
        </label>
      </div>

      <label className="block mt-3">
        <span className={labelClass}>Professional summary</span>
        <textarea
          className={inputClass}
          rows={3}
          value={cv.summary}
          onChange={(e) => set("summary", e.target.value)}
        />
      </label>

      <h3 className={sectionTitleClass}>Work Experience</h3>
      <div className="space-y-4">
        {cv.experience.map((exp) => (
          <div key={exp.id} className="rounded-md border border-[var(--line)] p-3.5">
            <div className="flex items-start gap-2">
              <div className="flex-1 grid grid-cols-2 gap-2.5">
                <label>
                  <span className={labelClass}>Role</span>
                  <input className={inputClass} value={exp.role} onChange={(e) => updateExp(exp.id, { role: e.target.value })} />
                </label>
                <label>
                  <span className={labelClass}>Company</span>
                  <input className={inputClass} value={exp.company} onChange={(e) => updateExp(exp.id, { company: e.target.value })} />
                </label>
                <label>
                  <span className={labelClass}>Start</span>
                  <input className={inputClass} value={exp.start} onChange={(e) => updateExp(exp.id, { start: e.target.value })} />
                </label>
                <label>
                  <span className={labelClass}>End</span>
                  <input
                    className={inputClass}
                    value={exp.end}
                    disabled={exp.current}
                    onChange={(e) => updateExp(exp.id, { end: e.target.value })}
                    placeholder={exp.current ? "Present" : ""}
                  />
                </label>
              </div>
              <button type="button" onClick={() => removeExp(exp.id)} className={removeBtnClass}>
                <X size={13} />
              </button>
            </div>

            <label className="flex items-center gap-1.5 mt-2 text-[12.5px] text-[var(--brown-700)]">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) => updateExp(exp.id, { current: e.target.checked })}
              />
              Currently working here
            </label>

            <div className="mt-2.5 space-y-1.5">
              <span className={labelClass}>Bullet points</span>
              {exp.bullets.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className={inputClass}
                    value={b}
                    onChange={(e) => updateBullet(exp.id, i, e.target.value)}
                  />
                  <button type="button" onClick={() => removeBullet(exp.id, i)} className={removeBtnClass}>
                    <X size={13} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addBullet(exp.id)} className={addBtnClass}>
                <Plus size={13} /> Add bullet
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addExp} className={addBtnClass}>
          <Plus size={13} /> Add job
        </button>
      </div>

      <h3 className={sectionTitleClass}>Education</h3>
      <div className="space-y-3">
        {cv.education.map((ed) => (
          <div key={ed.id} className="flex items-start gap-2 rounded-md border border-[var(--line)] p-3.5">
            <div className="flex-1 grid grid-cols-2 gap-2.5">
              <label className="col-span-2">
                <span className={labelClass}>Degree</span>
                <input className={inputClass} value={ed.degree} onChange={(e) => updateEdu(ed.id, { degree: e.target.value })} />
              </label>
              <label>
                <span className={labelClass}>School</span>
                <input className={inputClass} value={ed.school} onChange={(e) => updateEdu(ed.id, { school: e.target.value })} />
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <label>
                  <span className={labelClass}>Start</span>
                  <input className={inputClass} value={ed.start} onChange={(e) => updateEdu(ed.id, { start: e.target.value })} />
                </label>
                <label>
                  <span className={labelClass}>End</span>
                  <input className={inputClass} value={ed.end} onChange={(e) => updateEdu(ed.id, { end: e.target.value })} />
                </label>
              </div>
            </div>
            <button type="button" onClick={() => removeEdu(ed.id)} className={removeBtnClass}>
              <X size={13} />
            </button>
          </div>
        ))}
        <button type="button" onClick={addEdu} className={addBtnClass}>
          <Plus size={13} /> Add education
        </button>
      </div>

      <h3 className={sectionTitleClass}>Skills</h3>
      <div className="flex flex-wrap gap-2">
        {cv.skills.map((s) => (
          <div key={s.id} className="flex items-center gap-1.5 rounded-full border border-[var(--line)] pl-3 pr-1.5 py-1">
            <input
              className="w-24 bg-transparent text-[12.5px] outline-none"
              value={s.name}
              onChange={(e) => updateSkill(s.id, e.target.value)}
            />
            <button type="button" onClick={() => removeSkill(s.id)} className="h-5 w-5 flex items-center justify-center rounded-full hover:text-[#a5473a]">
              <X size={11} />
            </button>
          </div>
        ))}
        <button type="button" onClick={addSkill} className={addBtnClass}>
          <Plus size={13} /> Add skill
        </button>
      </div>

      <h3 className={sectionTitleClass}>Languages</h3>
      <div className="space-y-2">
        {cv.languages.map((l) => (
          <div key={l.id} className="flex items-center gap-2">
            <input
              className={inputClass}
              placeholder="Language"
              value={l.name}
              onChange={(e) => updateLang(l.id, { name: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Level (e.g. Fluent)"
              value={l.level}
              onChange={(e) => updateLang(l.id, { level: e.target.value })}
            />
            <button type="button" onClick={() => removeLang(l.id)} className={removeBtnClass}>
              <X size={13} />
            </button>
          </div>
        ))}
        <button type="button" onClick={addLang} className={addBtnClass}>
          <Plus size={13} /> Add language
        </button>
      </div>
    </div>
  );
}
