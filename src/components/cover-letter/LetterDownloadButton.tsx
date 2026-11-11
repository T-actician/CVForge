"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useCoverLetterStore } from "@/store/coverLetterStore";
import { generatePdf, savePdf } from "@/lib/pdfExport";

export default function LetterDownloadButton() {
  const { letter, templateId, accent } = useCoverLetterStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    setLoading(true);
    setError("");
    try {
      const blob = await generatePdf({ kind: "letter", templateId, letter, accent });
      const base = (letter.fullName || "cover-letter").replace(/\s+/g, "_");
      savePdf(blob, `${base}-Cover-Letter.pdf`);
      const form = new FormData();
      form.append("file", blob, `${base}.pdf`);
      form.append("name", `${base}-cover-letter`);
      fetch("/api/upload-pdf", { method: "POST", body: form }).catch(() => {});
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
      {error && <p className="text-[12.5px] text-[#a5473a]">{error}</p>}
    </div>
  );
}
