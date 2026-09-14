"use client";

import { useState } from "react";
import { UploadCloud, Loader2, X, Video } from "lucide-react";

export default function VideoUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      // 1. Ask our server for a short-lived signed upload URL.
      const presignRes = await fetch("/api/admin/presign-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "videos", contentType: file.type }),
      });
      const presignData = await presignRes.json();
      if (!presignRes.ok) throw new Error(presignData.error || "Could not start upload.");

      // 2. Upload straight from the browser to B2 — never touches our server,
      // so Vercel's request size limit does not apply.
      const putRes = await fetch(presignData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Video upload to storage failed.");

      onChange(presignData.url);
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
        <div className="relative mb-2 rounded-md overflow-hidden border border-[var(--line)] bg-black">
          <video src={value} controls className="w-full h-40 object-contain bg-black" />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 h-6 w-6 rounded-full bg-[var(--brown-900)] text-white flex items-center justify-center"
            type="button"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <div className="mb-2 h-24 rounded-md border border-dashed border-[var(--line)] flex flex-col items-center justify-center gap-1 text-[12.5px] text-[var(--brown-300)]">
          <Video size={18} />
          No video uploaded — button links nowhere yet
        </div>
      )}

      <label className="inline-flex items-center gap-2 rounded-md border border-[var(--line)] px-3.5 py-2 text-[13px] text-[var(--brown-700)] cursor-pointer hover:border-[var(--gold)] transition-colors">
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
        {uploading ? "Uploading…" : "Upload video from device"}
        <input
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          disabled={uploading}
        />
      </label>
      {error && <p className="text-[11.5px] text-[#a5473a] mt-1.5">{error}</p>}
    </div>
  );
}
