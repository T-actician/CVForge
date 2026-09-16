"use client";

import { useRef, useState } from "react";
import { Download, Loader2, Cloud, Check } from "lucide-react";
import { useCVStore } from "@/store/cvStore";
import CVRenderer from "@/components/cv-templates/CVRenderer";
import { TemplateSettings } from "@/lib/templateSettings";

export default function DownloadButton({ settings }: { settings?: TemplateSettings }) {
  const { cv, templateId } = useCVStore();
  const exportRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [cloudUrl, setCloudUrl] = useState("");
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (!exportRef.current) return;
    setLoading(true);
    setCloudUrl("");
    setError("");
    try {
      // html2canvas-pro (not stock html2canvas) — Tailwind v4's opacity
      // modifiers (e.g. "border-white/15") compile to color-mix(in oklab, ...),
      // which stock html2canvas can't parse and aborts the export on.
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "px", format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

      const fileBaseName = (cv.fullName || "cv").replace(/\s+/g, "_");
      pdf.save(`${fileBaseName}-Vitae.pdf`);

      // Also save a copy to cloud storage (Backblaze B2)
      const blob = pdf.output("blob");
      const formData = new FormData();
      formData.append("file", blob, `${fileBaseName}.pdf`);
      formData.append("name", fileBaseName);
      const res = await fetch("/api/upload-pdf", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setCloudUrl(data.url);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate the PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] px-5 py-2.5 text-[14px] text-white hover:brightness-105 transition disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        {loading ? "Preparing PDF…" : "Download PDF"}
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
      {loading && (
        <span className="hidden sm:flex items-center gap-1.5 text-[12.5px] text-[var(--brown-300)]">
          <Cloud size={14} />
        </span>
      )}
      {error && <p className="text-[12.5px] text-[#a5473a]">{error}</p>}

      {/* Hidden full-resolution render used for crisp PDF export */}
      <div className="fixed top-0 left-[-99999px]" aria-hidden>
        <div ref={exportRef} style={{ width: 794 }}>
          <CVRenderer templateId={templateId} cv={cv} settings={settings} />
        </div>
      </div>
    </div>
  );
}
