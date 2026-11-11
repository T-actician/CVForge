"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/playfair-display/latin-500.css";
import "@fontsource/playfair-display/latin-600.css";
import "@fontsource/playfair-display/latin-700.css";
import "@fontsource/lora/latin-400.css";
import "@fontsource/lora/latin-500.css";
import "@fontsource/lora/latin-600.css";
import CVRenderer from "@/components/cv-templates/CVRenderer";
import CoverLetterRenderer from "@/components/cover-letter-templates/CoverLetterRenderer";
import type { PrintPayload } from "@/lib/printPayload";

declare global {
  interface Window {
    __PRINT_DATA__?: PrintPayload;
  }
}

const PAGE_WIDTH_PX = 794; // A4 @ 96dpi
const MARGIN_PX = 19; // ~5mm page margin

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

function preload(url: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    const done = () => resolve();
    img.onload = done;
    img.onerror = done;
    setTimeout(done, 8000);
    img.src = url;
  });
}

// Render target for the server-side PDF export (/api/generate-pdf). The
// payload is injected by headless Chromium before load; `data-ready="1"`
// signals that fonts and the photo have finished loading.
export default function PrintPage() {
  const payload = useSyncExternalStore(
    () => () => {},
    () => window.__PRINT_DATA__ ?? null,
    () => null
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!payload) return;
    (async () => {
      await nextFrame();
      await nextFrame();
      try {
        await document.fonts.ready;
      } catch {}
      if (payload.kind === "cv" && payload.cv.photo) await preload(payload.cv.photo);
      await nextFrame();
      setReady(true);
    })();
  }, [payload]);

  return (
    <>
      <style>{`html,body{margin:0;background:#fff !important;text-rendering:geometricPrecision}`}</style>
      <div
        id="print-page"
        data-ready={ready ? "1" : "0"}
        style={{ width: PAGE_WIDTH_PX + MARGIN_PX * 2, padding: MARGIN_PX, boxSizing: "border-box", background: "#fff" }}
      >
        <div style={{ width: PAGE_WIDTH_PX }}>
          {payload?.kind === "cv" && (
            <CVRenderer templateId={payload.templateId} cv={payload.cv} settings={payload.settings} />
          )}
          {payload?.kind === "letter" && (
            <CoverLetterRenderer templateId={payload.templateId} letter={payload.letter} accent={payload.accent} />
          )}
        </div>
      </div>
    </>
  );
}
