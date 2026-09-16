"use client";

import { useEffect, useRef, useState } from "react";
import CVRenderer from "@/components/cv-templates/CVRenderer";
import { CVData, sampleCV } from "@/lib/cvTypes";
import { TemplateSettings } from "@/lib/templateSettings";

// Intrinsic design size the templates are built for (A4 @ 96dpi), scaled
// down to whatever size the parent container actually is.
const DESIGN_WIDTH = 794;
const DESIGN_HEIGHT = 1123;

export default function TemplatePreview({
  templateId,
  cv,
  settings,
}: {
  templateId: string;
  cv?: CVData;
  settings?: TemplateSettings;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setScale(el.offsetWidth / DESIGN_WIDTH);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-white">
      <div
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <CVRenderer templateId={templateId} cv={cv ?? sampleCV()} settings={settings} />
      </div>
    </div>
  );
}
