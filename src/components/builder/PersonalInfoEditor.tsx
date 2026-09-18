"use client";

import { useState } from "react";
import { useCVStore } from "@/store/cvStore";
import { Field } from "./FormControls";
import { UploadCloud, Loader2, X } from "lucide-react";
import { sanitizePhoneInput, phoneError, emailError } from "@/lib/validators";

export default function PersonalInfoEditor() {
  const { cv, updateField } = useCVStore();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handlePhotoChange = async (file: File | null) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload-photo", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      updateField("photo", data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Full name" value={cv.fullName} onChange={(v) => updateField("fullName", v)} placeholder="Jane Doe" />
        <Field label="Job title" value={cv.jobTitle} onChange={(v) => updateField("jobTitle", v)} placeholder="Product Designer" />
        <Field
          label="Email"
          value={cv.email}
          onChange={(v) => updateField("email", v)}
          placeholder="jane@email.com"
          error={emailError(cv.email)}
        />
        <Field
          label="Phone"
          value={cv.phone}
          onChange={(v) => updateField("phone", sanitizePhoneInput(v))}
          placeholder="0771741600 or +254115774307"
          error={phoneError(cv.phone)}
        />
        <Field label="Location" value={cv.location} onChange={(v) => updateField("location", v)} placeholder="Nairobi, Kenya" />
        <Field label="Website / LinkedIn" value={cv.website} onChange={(v) => updateField("website", v)} placeholder="linkedin.com/in/janedoe" />
      </div>

      <div>
        <span className="block text-[12px] text-[var(--brown-500)] mb-1">Photo</span>
        <div className="flex items-center gap-3">
          {cv.photo ? (
            <div className="relative">
              <img
                src={cv.photo}
                alt="Profile"
                className="h-14 w-14 rounded-full object-cover border border-[var(--line)]"
              />
              <button
                onClick={() => updateField("photo", "")}
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[var(--brown-900)] text-white flex items-center justify-center"
              >
                <X size={11} />
              </button>
            </div>
          ) : (
            <div className="h-14 w-14 rounded-full bg-[var(--ivory)] border border-[var(--line)]" />
          )}

          <label className="inline-flex items-center gap-2 rounded-md border border-[var(--line)] px-3 py-2 text-[13px] text-[var(--brown-700)] cursor-pointer hover:border-[var(--gold)] transition-colors">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
            {uploading ? "Uploading…" : "Upload photo"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)}
              disabled={uploading}
            />
          </label>
        </div>
        {error && <p className="text-[11.5px] text-[#a5473a] mt-1.5">{error}</p>}
      </div>
    </div>
  );
}
