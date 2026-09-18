"use client";

import { useCVStore } from "@/store/cvStore";
import {
  ExperienceItem,
  EducationItem,
  SkillItem,
  ProjectItem,
  CertificationItem,
  LanguageItem,
  ReferenceItem,
} from "@/lib/cvTypes";
import { Field, TextAreaField, SmallButton } from "./FormControls";
import { Plus, Trash2 } from "lucide-react";
import { contactError, sanitizeContactInput } from "@/lib/validators";

const uid = () => Math.random().toString(36).slice(2, 9);

export function SummaryEditor() {
  const { cv, updateField } = useCVStore();
  return (
    <TextAreaField
      label="Professional summary"
      value={cv.summary}
      onChange={(v) => updateField("summary", v)}
      placeholder="A 2–4 sentence overview of your experience and strengths."
      rows={4}
    />
  );
}

export function ExperienceEditor() {
  const { cv, updateField } = useCVStore();
  const items = cv.experience;

  const update = (id: string, patch: Partial<ExperienceItem>) =>
    updateField(
      "experience",
      items.map((it) => (it.id === id ? { ...it, ...patch } : it))
    );
  const remove = (id: string) =>
    updateField("experience", items.filter((it) => it.id !== id));
  const add = () =>
    updateField("experience", [
      ...items,
      {
        id: uid(),
        role: "",
        company: "",
        location: "",
        start: "",
        end: "",
        current: false,
        bullets: [""],
      },
    ]);

  return (
    <div className="space-y-5">
      {items.map((e) => (
        <div key={e.id} className="rounded-lg border border-[var(--line)] p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Job title" value={e.role} onChange={(v) => update(e.id, { role: v })} />
            <Field label="Company" value={e.company} onChange={(v) => update(e.id, { company: v })} />
            <Field label="Location" value={e.location} onChange={(v) => update(e.id, { location: v })} />
            <div className="grid grid-cols-2 gap-2">
              <Field label="Start" value={e.start} onChange={(v) => update(e.id, { start: v })} placeholder="2022" />
              <Field
                label="End"
                value={e.current ? "" : e.end}
                onChange={(v) => update(e.id, { end: v })}
                placeholder={e.current ? "Present" : "2024"}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-[12.5px] text-[var(--brown-500)]">
            <input
              type="checkbox"
              checked={e.current}
              onChange={(ev) => update(e.id, { current: ev.target.checked })}
            />
            I currently work here
          </label>
          <div>
            <span className="block text-[12px] text-[var(--brown-500)] mb-1">
              Achievements / responsibilities
            </span>
            <div className="space-y-2">
              {e.bullets.map((b, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={b}
                    onChange={(ev) => {
                      const bullets = [...e.bullets];
                      bullets[i] = ev.target.value;
                      update(e.id, { bullets });
                    }}
                    placeholder="Led a team of 4 to deliver..."
                    className="flex-1 rounded-md border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-[13px] outline-none focus:border-[var(--gold)]"
                  />
                  <button
                    onClick={() =>
                      update(e.id, { bullets: e.bullets.filter((_, bi) => bi !== i) })
                    }
                    className="text-[var(--brown-300)] hover:text-[#a5473a]"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              <SmallButton onClick={() => update(e.id, { bullets: [...e.bullets, ""] })}>
                <Plus size={13} /> Add bullet
              </SmallButton>
            </div>
          </div>
          <SmallButton variant="danger" onClick={() => remove(e.id)}>
            <Trash2 size={13} /> Remove role
          </SmallButton>
        </div>
      ))}
      <SmallButton variant="gold" onClick={add}>
        <Plus size={14} /> Add experience
      </SmallButton>
    </div>
  );
}

export function EducationEditor() {
  const { cv, updateField } = useCVStore();
  const items = cv.education;
  const update = (id: string, patch: Partial<EducationItem>) =>
    updateField("education", items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const remove = (id: string) => updateField("education", items.filter((it) => it.id !== id));
  const add = () =>
    updateField("education", [
      ...items,
      { id: uid(), degree: "", school: "", location: "", start: "", end: "", details: "" },
    ]);

  return (
    <div className="space-y-5">
      {items.map((ed) => (
        <div key={ed.id} className="rounded-lg border border-[var(--line)] p-4 space-y-3">
          <Field label="Degree / qualification" value={ed.degree} onChange={(v) => update(ed.id, { degree: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="School" value={ed.school} onChange={(v) => update(ed.id, { school: v })} />
            <Field label="Location" value={ed.location} onChange={(v) => update(ed.id, { location: v })} />
            <Field label="Start" value={ed.start} onChange={(v) => update(ed.id, { start: v })} placeholder="2016" />
            <Field label="End" value={ed.end} onChange={(v) => update(ed.id, { end: v })} placeholder="2020" />
          </div>
          <TextAreaField
            label="Details (optional)"
            value={ed.details}
            onChange={(v) => update(ed.id, { details: v })}
            rows={2}
            placeholder={"One line per point — each becomes a bullet.\nOr write one paragraph for plain text."}
          />
          <SmallButton variant="danger" onClick={() => remove(ed.id)}>
            <Trash2 size={13} /> Remove
          </SmallButton>
        </div>
      ))}
      <SmallButton variant="gold" onClick={add}>
        <Plus size={14} /> Add education
      </SmallButton>
    </div>
  );
}

export function SkillsEditor() {
  const { cv, updateField } = useCVStore();
  const items = cv.skills;
  const update = (id: string, patch: Partial<SkillItem>) =>
    updateField("skills", items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const remove = (id: string) => updateField("skills", items.filter((it) => it.id !== id));
  const add = () => updateField("skills", [...items, { id: uid(), name: "", level: 3 }]);

  return (
    <div className="space-y-3">
      {items.map((s) => (
        <div key={s.id} className="flex items-center gap-2">
          <input
            value={s.name}
            onChange={(e) => update(s.id, { name: e.target.value })}
            placeholder="e.g. Figma"
            className="flex-1 rounded-md border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-[13px] outline-none focus:border-[var(--gold)]"
          />
          <button onClick={() => remove(s.id)} className="text-[var(--brown-300)] hover:text-[#a5473a]">
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <SmallButton variant="gold" onClick={add}>
        <Plus size={14} /> Add skill
      </SmallButton>
    </div>
  );
}

export function ProjectsEditor() {
  const { cv, updateField } = useCVStore();
  const items = cv.projects;
  const update = (id: string, patch: Partial<ProjectItem>) =>
    updateField("projects", items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const remove = (id: string) => updateField("projects", items.filter((it) => it.id !== id));
  const add = () => updateField("projects", [...items, { id: uid(), name: "", link: "", description: "" }]);

  return (
    <div className="space-y-5">
      {items.map((p) => (
        <div key={p.id} className="rounded-lg border border-[var(--line)] p-4 space-y-3">
          <Field label="Project name" value={p.name} onChange={(v) => update(p.id, { name: v })} />
          <Field label="Link (optional)" value={p.link} onChange={(v) => update(p.id, { link: v })} />
          <TextAreaField
            label="Description"
            value={p.description}
            onChange={(v) => update(p.id, { description: v })}
            rows={3}
            placeholder={"One line per point — each becomes a bullet.\nOr write one paragraph for plain text."}
          />
          <SmallButton variant="danger" onClick={() => remove(p.id)}>
            <Trash2 size={13} /> Remove
          </SmallButton>
        </div>
      ))}
      <SmallButton variant="gold" onClick={add}>
        <Plus size={14} /> Add project
      </SmallButton>
    </div>
  );
}

export function CertificationsEditor() {
  const { cv, updateField } = useCVStore();
  const items = cv.certifications;
  const update = (id: string, patch: Partial<CertificationItem>) =>
    updateField("certifications", items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const remove = (id: string) => updateField("certifications", items.filter((it) => it.id !== id));
  const add = () => updateField("certifications", [...items, { id: uid(), name: "", issuer: "", date: "" }]);

  return (
    <div className="space-y-5">
      {items.map((c) => (
        <div key={c.id} className="rounded-lg border border-[var(--line)] p-4 space-y-3">
          <Field label="Certification" value={c.name} onChange={(v) => update(c.id, { name: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Issuer" value={c.issuer} onChange={(v) => update(c.id, { issuer: v })} />
            <Field label="Date" value={c.date} onChange={(v) => update(c.id, { date: v })} placeholder="2023" />
          </div>
          <SmallButton variant="danger" onClick={() => remove(c.id)}>
            <Trash2 size={13} /> Remove
          </SmallButton>
        </div>
      ))}
      <SmallButton variant="gold" onClick={add}>
        <Plus size={14} /> Add certification
      </SmallButton>
    </div>
  );
}

export function LanguagesEditor() {
  const { cv, updateField } = useCVStore();
  const items = cv.languages;
  const update = (id: string, patch: Partial<LanguageItem>) =>
    updateField("languages", items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const remove = (id: string) => updateField("languages", items.filter((it) => it.id !== id));
  const add = () => updateField("languages", [...items, { id: uid(), name: "", level: "" }]);

  return (
    <div className="space-y-3">
      {items.map((l) => (
        <div key={l.id} className="flex items-center gap-2">
          <input
            value={l.name}
            onChange={(e) => update(l.id, { name: e.target.value })}
            placeholder="Language"
            className="flex-1 rounded-md border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-[13px] outline-none focus:border-[var(--gold)]"
          />
          <input
            value={l.level}
            onChange={(e) => update(l.id, { level: e.target.value })}
            placeholder="Fluent"
            className="w-28 rounded-md border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-[13px] outline-none focus:border-[var(--gold)]"
          />
          <button onClick={() => remove(l.id)} className="text-[var(--brown-300)] hover:text-[#a5473a]">
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <SmallButton variant="gold" onClick={add}>
        <Plus size={14} /> Add language
      </SmallButton>
    </div>
  );
}

export function ReferencesEditor() {
  const { cv, updateField } = useCVStore();
  const items = cv.references;
  const update = (id: string, patch: Partial<ReferenceItem>) =>
    updateField("references", items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const remove = (id: string) => updateField("references", items.filter((it) => it.id !== id));
  const add = () => updateField("references", [...items, { id: uid(), name: "", role: "", contact: "" }]);

  return (
    <div className="space-y-5">
      {items.map((r) => (
        <div key={r.id} className="rounded-lg border border-[var(--line)] p-4 space-y-3">
          <Field label="Name" value={r.name} onChange={(v) => update(r.id, { name: v })} />
          <Field label="Role / relationship" value={r.role} onChange={(v) => update(r.id, { role: v })} />
          <Field
            label="Contact"
            value={r.contact}
            onChange={(v) => update(r.id, { contact: sanitizeContactInput(v) })}
            placeholder="Phone or email"
            error={contactError(r.contact)}
          />
          <SmallButton variant="danger" onClick={() => remove(r.id)}>
            <Trash2 size={13} /> Remove
          </SmallButton>
        </div>
      ))}
      <SmallButton variant="gold" onClick={add}>
        <Plus size={14} /> Add reference
      </SmallButton>
    </div>
  );
}
