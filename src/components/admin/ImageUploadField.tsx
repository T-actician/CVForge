"use client";

import { useState } from "react";
import { UploadCloud, Loader2, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  fieldKey,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  fieldKey: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

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
      const data = await new Promise<{ url: string; error?: string }>((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        // XHR (not fetch) so we get real upload progress events.
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/upload-photo");
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          try {
            const parsed = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) resolve(parsed);
            else reject(new Error(parsed.error || "Upload failed."));
          } catch {
            reject(new Error("Upload failed."));
          }
        };
        xhr.onerror = () => reject(new Error("Upload failed."));
        xhr.send(formData);
      });
      await persist(data.url);
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
        </div>
      ) : (
        <div className="mb-2 h-24 rounded-md border border-dashed border-[var(--line)] flex items-center justify-center text-[12.5px] text-[var(--brown-300)]">
          No image set — using default
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
          {uploading ? "Uploading…" : value ? "Replace image" : "Upload from device"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
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
        title="Move image to Trash?"
        message="The image will be removed from the homepage and moved to Trash, where you can restore it or delete it permanently."
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
