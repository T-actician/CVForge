"use client";

import { useState } from "react";
import { Download, Loader2, Check, Coffee, X } from "lucide-react";
import { useCVStore } from "@/store/cvStore";
import { generatePdf, savePdf } from "@/lib/pdfExport";
import { TemplateSettings } from "@/lib/templateSettings";
import MpesaSupportCard from "@/components/shared/MpesaSupportCard";

export default function DownloadButton({ settings }: { settings?: TemplateSettings }) {
  const { cv, templateId } = useCVStore();
  const [loading, setLoading] = useState(false);
  const [cloudUrl, setCloudUrl] = useState("");
  const [error, setError] = useState("");
  const [showSupport, setShowSupport] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    setCloudUrl("");
    setError("");

    try {
      const blob = await generatePdf({ kind: "cv", templateId, cv, settings });
      const fileBaseName = (cv.fullName || "cv").replace(/\s+/g, "_");
      savePdf(blob, `${fileBaseName}-Vitae.pdf`);

      setLoading(false);

      // Also save a copy to cloud storage (Backblaze B2), without blocking
      const formData = new FormData();
      formData.append("file", blob, `${fileBaseName}.pdf`);
      formData.append("name", fileBaseName);
      fetch("/api/upload-pdf", { method: "POST", body: formData })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => data && setCloudUrl(data.url))
        .catch(() => {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate the PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] px-3 sm:px-3.5 py-2 text-[13px] text-white hover:brightness-105 transition disabled:opacity-60"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        <span className="hidden sm:inline">{loading ? "Preparing…" : "Download PDF"}</span>
        <span className="sm:hidden">{loading ? "…" : "PDF"}</span>
      </button>

      <button
        type="button"
        onClick={() => setShowSupport(true)}
        title="Support Vitae"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--line)] text-[var(--gold-dark)] hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 transition-colors"
      >
        <Coffee size={15} />
      </button>

      {cloudUrl && (
        <a
          href={cloudUrl}
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-[12.5px] text-[var(--gold-dark)] hover:text-[var(--brown-900)]"
        >
          <Check size={14} /> Saved to cloud
        </a>
      )}
      {error && <p className="text-[12.5px] text-[#a5473a]">{error}</p>}

      {showSupport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setShowSupport(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-[var(--paper)] border border-[var(--line)] shadow-xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowSupport(false)}
              className="absolute top-4 right-4 text-[var(--brown-300)] hover:text-[var(--brown-900)]"
            >
              <X size={16} />
            </button>
            <p className="font-display text-[19px] text-[var(--brown-900)] mb-1.5">
              Enjoying Vitae?
            </p>
            <p className="text-[13px] text-[var(--brown-500)] mb-4">
              Vitae is free to use. If it's helping you land your next role,
              a coffee goes a long way — then grab your PDF below.
            </p>

            <MpesaSupportCard />

            <button
              onClick={handleDownload}
              disabled={loading}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] px-4 py-2.5 text-[14px] text-white hover:brightness-105 transition disabled:opacity-60"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
              {loading ? "Preparing PDF…" : "Download PDF"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
