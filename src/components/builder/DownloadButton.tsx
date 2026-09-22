"use client";

import { useRef, useState } from "react";
import { Download, Loader2, Check, Coffee, X } from "lucide-react";
import { useCVStore } from "@/store/cvStore";
import CVRenderer from "@/components/cv-templates/CVRenderer";
import { TemplateSettings } from "@/lib/templateSettings";
import MpesaSupportCard from "@/components/shared/MpesaSupportCard";

export default function DownloadButton({ settings }: { settings?: TemplateSettings }) {
  const { cv, templateId } = useCVStore();
  const exportRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [cloudUrl, setCloudUrl] = useState("");
  const [error, setError] = useState("");
  const [showSupport, setShowSupport] = useState(false);

  const handleDownload = async () => {
    if (!exportRef.current) return;
    setLoading(true);
    setCloudUrl("");
    setError("");

    // Let the browser actually paint the "Preparing…" spinner — and let
    // its CSS transform animation start ticking on the compositor thread
    // — before the heavy, mostly-synchronous html2canvas capture blocks
    // the main thread. Without this yield, the loading state and the
    // blocking work landed in the same task, so the spinner never got
    // its first composited frame and looked frozen for the whole export.
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );

    try {
      // html2canvas-pro (not stock html2canvas) — Tailwind v4's opacity
      // modifiers (e.g. "border-white/15") compile to color-mix(in oklab, ...),
      // which stock html2canvas can't parse and aborts the export on.
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);

      // Capture at high pixel density for a crisp result, then embed it as
      // ONE continuous page sized to the CV's actual content — not split
      // across multiple A4 pages. Page size uses "mm" units with the real
      // A4 width (210mm) and a height computed to match the content's true
      // aspect ratio, so it's a valid, normally-scrollable single page in
      // any viewer (the earlier "0 of 0 pages" break came from using
      // jsPDF's "px" unit combined with a hotfix flag — "mm" is the
      // well-tested, reliable path). Embedding html2canvas's own canvas
      // directly (no extra canvas-to-canvas copy) also removes any chance
      // of the rounding-introduced blur from an intermediate copy step.
      //
      // TARGET_SCALE is deliberately high (the more source pixels the PDF
      // viewer has to downsample from at 100% zoom, the sharper the
      // result looks — this is what "blurry at 100%, sharp at 150%" comes
      // from: not enough source resolution above what 100% needs). But a
      // fixed high scale on a long, multi-section CV can push the capture
      // canvas past the pixel limit many phone GPUs impose (exports would
      // silently fail or come back blank), so the scale is capped by a
      // total-pixel budget and backed off for taller documents instead of
      // being a flat constant.
      const TARGET_SCALE = 7;
      const MAX_CANVAS_PIXELS = 50_000_000; // safe headroom on common mobile GPU canvas limits
      const PAGE_WIDTH_PX = 794; // design width used everywhere (A4 @ 96dpi)
      // Must measure and pass an explicit height too — passing only
      // width/windowWidth without a matching height/windowHeight made
      // html2canvas fall back to the browser's own viewport height for its
      // internal render window, silently truncating the capture to
      // whatever the visible window happened to be (this is what produced
      // the "794x689" truncated capture instead of the CV's real height).
      const contentHeightPxUnscaled = exportRef.current.scrollHeight;
      const maxScaleForBudget = Math.sqrt(
        MAX_CANVAS_PIXELS / (PAGE_WIDTH_PX * contentHeightPxUnscaled)
      );
      const SCALE = Math.max(2, Math.min(TARGET_SCALE, maxScaleForBudget));

      // width/windowWidth/height/windowHeight force the capture to exactly
      // this pixel size no matter what the DOM would otherwise report — a
      // hard guarantee against any layout bug making the capture a
      // different size than intended.
      const canvas = await html2canvas(exportRef.current, {
        scale: SCALE,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: PAGE_WIDTH_PX,
        windowWidth: PAGE_WIDTH_PX,
        height: contentHeightPxUnscaled,
        windowHeight: contentHeightPxUnscaled,
      });

      const contentHeightPx = canvas.height / SCALE;
      const mmWidth = 210; // A4 width
      const mmHeight = (contentHeightPx / PAGE_WIDTH_PX) * mmWidth;

      // A page sized exactly to the content (0 margin) rendered content
      // flush against the PDF page edges — fine on desktop, but on mobile
      // PDF viewers (which commonly render the page edge-to-edge at
      // "fit width") that meant the CV touched the phone's screen edges
      // with no breathing room. Padding the page itself by a small margin
      // on every side — independent of the template's own internal
      // padding — guarantees a consistent gap no matter which template or
      // viewer renders it.
      const MARGIN_MM = 5;
      const pageWidth = mmWidth + MARGIN_MM * 2;
      const pageHeight = mmHeight + MARGIN_MM * 2;

      // jsPDF defaults to orientation "portrait" and, for a custom [w, h]
      // format, SILENTLY SWAPS width/height whenever width > height to
      // enforce that. A short CV (mmHeight < 210mm, i.e. shorter than A4 is
      // wide) triggered that swap, turning the page into mmHeight x mmWidth
      // while addImage below still drew the image at mmWidth x mmHeight —
      // wider than the swapped page, clipping the right ~35% of every
      // export. Passing orientation explicitly, matched to the real
      // width/height relationship, stops jsPDF from ever swapping them.
      const orientation = pageHeight >= pageWidth ? "portrait" : "landscape";
      const pdf = new jsPDF({ unit: "mm", format: [pageWidth, pageHeight], orientation });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", MARGIN_MM, MARGIN_MM, mmWidth, mmHeight, undefined, "FAST");

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
          MARGIN_MM + (r.left - containerRect.left) * mmPerPx,
          MARGIN_MM + (r.top - containerRect.top) * mmPerPx,
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

      {/* Hidden full-resolution render used for crisp PDF export. Kept in
          normal document flow at (0,0) — not an extreme negative offset —
          because html2canvas miscalculates its capture region for elements
          positioned far outside the viewport, which was clipping the right
          portion of the page in the downloaded PDF. The 0x0 overflow-hidden
          outer div gives it zero footprint on the visible page. */}
      <div className="absolute top-0 left-0 h-0 w-0 overflow-hidden" style={{ opacity: 0, pointerEvents: "none" }} aria-hidden>
        <div ref={exportRef} style={{ width: 794 }}>
          <CVRenderer templateId={templateId} cv={cv} settings={settings} />
        </div>
      </div>

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
