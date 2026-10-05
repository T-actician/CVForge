"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileDown } from "lucide-react";
import { useCoverLetterStore } from "@/store/coverLetterStore";
import { useCVStore } from "@/store/cvStore";
import { Field, TextAreaField, SmallButton } from "@/components/builder/FormControls";
import { sanitizePhoneInput, phoneError, emailError } from "@/lib/validators";

function Panel({
  id,
  title,
  open,
  setOpen,
  children,
}: {
  id: string;
  title: string;
  open: string;
  setOpen: (v: string) => void;
  children: React.ReactNode;
}) {
  const isOpen = open === id;
  return (
    <div className="rounded-lg border border-[var(--line)] overflow-hidden">
      <button
        onClick={() => setOpen(isOpen ? "" : id)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[var(--ivory)]/50 text-[14px] text-[var(--brown-900)]"
      >
        {title}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
}

export default function LetterEditor() {
  const { letter, updateField, setLetter } = useCoverLetterStore();
  const [open, setOpen] = useState("you");

  const fillFromCV = async () => {
    await useCVStore.persist.rehydrate();
    const cv = useCVStore.getState().cv;
    setLetter({
      ...letter,
      fullName: cv.fullName || letter.fullName,
      jobTitle: cv.jobTitle || letter.jobTitle,
      email: cv.email || letter.email,
      phone: cv.phone || letter.phone,
      location: cv.location || letter.location,
      website: cv.website || letter.website,
    });
  };

  return (
    <div className="space-y-3">
      <Panel id="you" title="Your Details" open={open} setOpen={setOpen}>
        <SmallButton onClick={fillFromCV}>
          <FileDown size={13} /> Fill from my CV
        </SmallButton>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Full name" value={letter.fullName} onChange={(v) => updateField("fullName", v)} placeholder="Jane Doe" />
          <Field label="Job title" value={letter.jobTitle} onChange={(v) => updateField("jobTitle", v)} placeholder="Product Designer" />
          <Field label="Email" value={letter.email} onChange={(v) => updateField("email", v)} placeholder="jane@email.com" error={emailError(letter.email)} />
          <Field label="Phone" value={letter.phone} onChange={(v) => updateField("phone", sanitizePhoneInput(v))} placeholder="+254115774307" error={phoneError(letter.phone)} />
          <Field label="Location" value={letter.location} onChange={(v) => updateField("location", v)} placeholder="Nairobi, Kenya" />
          <Field label="Website / LinkedIn" value={letter.website} onChange={(v) => updateField("website", v)} placeholder="linkedin.com/in/janedoe" />
        </div>
      </Panel>

      <Panel id="recipient" title="Recipient" open={open} setOpen={setOpen}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Date" value={letter.date} onChange={(v) => updateField("date", v)} placeholder="5 October 2026" />
          <Field label="Hiring manager" value={letter.recipientName} onChange={(v) => updateField("recipientName", v)} placeholder="Grace Wanjiru" />
          <Field label="Their title" value={letter.recipientTitle} onChange={(v) => updateField("recipientTitle", v)} placeholder="Head of Engineering" />
          <Field label="Company" value={letter.company} onChange={(v) => updateField("company", v)} placeholder="Company Ltd" />
        </div>
        <Field label="Company address" value={letter.companyAddress} onChange={(v) => updateField("companyAddress", v)} placeholder="Westlands, Nairobi" />
      </Panel>

      <Panel id="letter" title="Letter" open={open} setOpen={setOpen}>
        <Field label="Subject" value={letter.subject} onChange={(v) => updateField("subject", v)} placeholder="Application for Software Engineer" />
        <Field label="Salutation" value={letter.salutation} onChange={(v) => updateField("salutation", v)} placeholder="Dear Hiring Manager," />
        <TextAreaField
          label="Body (leave a blank line between paragraphs)"
          value={letter.body}
          onChange={(v) => updateField("body", v)}
          rows={12}
          placeholder="Opening, why you're a fit, closing…"
        />
        <Field label="Closing" value={letter.closing} onChange={(v) => updateField("closing", v)} placeholder="Yours sincerely," />
      </Panel>
    </div>
  );
}
