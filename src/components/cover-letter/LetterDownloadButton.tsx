"use client";

import { useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useCoverLetterStore } from "@/store/coverLetterStore";
import CoverLetterRenderer from "@/components/cover-letter-templates/CoverLetterRenderer";
import { elementToPdf } from "@/lib/pdfExport";

export default function LetterDownloadButton() {
  const { letter, templateId, accent } = useCoverLetterStore();
  const exportRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (!exportRef.current) return;
    setLoading(true);
    setError("");
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    try {
      const pdf = await elementToPdf(exportRef.current);
      const base = (letter.fullName || "cover-letter").replace(/\s+/g, "_");
      pdf.save(`${base}-Cover-Letter.pdf`);
      const form = new FormData();
      form.append("file", pdf.output("blob"), `${base}.pdf`);
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
      <div className="absolute top-0 left-0 h-0 w-0 overflow-hidden" style={{ opacity: 0, pointerEvents: "none" }} aria-hidden>
        <div ref={exportRef} style={{ width: 794 }}>
          <CoverLetterRenderer templateId={templateId} letter={letter} accent={accent} />
        </div>
      </div>
    </div>
  );
}
