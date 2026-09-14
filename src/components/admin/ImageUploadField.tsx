"use client";

import { useState } from "react";
import { UploadCloud, Loader2, X } from "lucide-react";

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/upload-photo", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className="block text-[13px] text-[var(--brown-700)] mb-1.5">{label}</span>

      {value ? (
        <div className="relative mb-2 rounded-md overflow-hidden border border-[var(--line)]">
          <img src={value} alt={label} className="w-full h-32 object-cover" />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 h-6 w-6 rounded-full bg-[var(--brown-900)] text-white flex items-center justify-center"
            type="button"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <div className="mb-2 h-24 rounded-md border border-dashed border-[var(--line)] flex items-center justify-center text-[12.5px] text-[var(--brown-300)]">
          No image set — using default
        </div>
      )}

      <label className="inline-flex items-center gap-2 rounded-md border border-[var(--line)] px-3.5 py-2 text-[13px] text-[var(--brown-700)] cursor-pointer hover:border-[var(--gold)] transition-colors">
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
        {uploading ? "Uploading…" : "Upload from device"}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          disabled={uploading}
        />
      </label>
      {error && <p className="text-[11.5px] text-[#a5473a] mt-1.5">{error}</p>}
    </div>
  );
}
