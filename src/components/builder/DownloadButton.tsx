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

      // Capture at high pixel density (SCALE) for a crisp result, then embed
      // it as ONE continuous page sized to the CV's actual content — not
      // split across multiple A4 pages. Page size uses "mm" units with the
      // real A4 width (210mm) and a height computed to match the content's
      // true aspect ratio, so it's a valid, normally-scrollable single page
      // in any viewer (the earlier "0 of 0 pages" break came from using
      // jsPDF's "px" unit combined with a hotfix flag — "mm" is the
      // well-tested, reliable path). Embedding html2canvas's own canvas
      // directly (no extra canvas-to-canvas copy) also removes any chance
      // of the rounding-introduced blur from an intermediate copy step.
      const SCALE = 4;
      const PAGE_WIDTH_PX = 794; // design width used everywhere (A4 @ 96dpi)

      const canvas = await html2canvas(exportRef.current, {
        scale: SCALE,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const contentHeightPx = canvas.height / SCALE;
      const mmWidth = 210; // A4 width
      const mmHeight = (contentHeightPx / PAGE_WIDTH_PX) * mmWidth;

      const pdf = new jsPDF({ unit: "mm", format: [mmWidth, mmHeight] });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, mmWidth, mmHeight, undefined, "FAST");

      // Overlay real clickable link annotations on top of the flattened
      // image, at the exact position of each project link pill, so
      // employers can actually open the link from the PDF (a raster image
      // can't have selectable text, but it can have a clickable hotspot).
      const containerRect = exportRef.current.getBoundingClientRect();
      const mmPerPx = mmWidth / PAGE_WIDTH_PX;
      exportRef.current.querySelectorAll<HTMLElement>("[data-pdf-link]").forEach((el) => {
        const url = el.getAttribute("data-pdf-link");
        if (!url) return;
        const r = el.getBoundingClientRect();
        pdf.link(
          (r.left - containerRect.left) * mmPerPx,
          (r.top - containerRect.top) * mmPerPx,
          r.width * mmPerPx,
          r.height * mmPerPx,
          { url }
        );
      });

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
