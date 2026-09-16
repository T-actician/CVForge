"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2, Trash2, Video } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

export default function VideoUploadField({
  label,
  value,
  fieldKey,
  onChange,
}: {
  label: string;
  value: string;
  fieldKey: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Persists just this one field immediately — delete/replace must not wait
  // for the page's main "Save changes" button, or the old file never makes
  // it into Trash until the admin happens to click Save.
  const persist = async (newValue: string) => {
    await fetch("/api/admin/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [fieldKey]: newValue }),
    });
    onChange(newValue);
  };

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setError("");
    setUploading(true);
    setProgress(0);
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
      // so Vercel's request size limit does not apply. Uses XHR (not fetch)
      // because only XHR exposes upload progress events.
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", presignData.uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error("Video upload to storage failed."));
        };
        xhr.onerror = () => reject(new Error("Video upload to storage failed."));
        xhr.send(file);
      });

      await persist(presignData.url);
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
        </div>
      ) : (
        <div className="mb-2 h-24 rounded-md border border-dashed border-[var(--line)] flex flex-col items-center justify-center gap-1 text-[12.5px] text-[var(--brown-300)]">
          <Video size={18} />
          No video uploaded — button links nowhere yet
        </div>
      )}

      {uploading && (
        <div className="mb-2">
          <div className="h-1.5 w-full rounded-full bg-[var(--line)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--gold)] transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-[11.5px] text-[var(--brown-500)]">Uploading… {progress}%</p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="inline-flex items-center gap-2 rounded-md border border-[var(--line)] px-3.5 py-2 text-[13px] text-[var(--brown-700)] cursor-pointer hover:border-[var(--gold)] transition-colors">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
          {uploading ? "Uploading…" : value ? "Replace video" : "Upload video from device"}
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            disabled={uploading}
          />
        </label>

        {value && !uploading && (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--line)] px-3 py-2 text-[13px] text-[#a5473a] hover:border-[#a5473a] transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </button>
        )}
      </div>

      {error && <p className="text-[11.5px] text-[#a5473a] mt-1.5">{error}</p>}

      <ConfirmModal
        open={confirmDelete}
        title="Move video to Trash?"
        message="The video will be removed from the homepage and moved to Trash, where you can restore it or delete it permanently."
        confirmLabel="Move to Trash"
        danger
        onConfirm={() => {
          persist("");
          setConfirmDelete(false);
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
