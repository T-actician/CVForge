"use client";

import { useEffect, useRef, useState } from "react";
import CoverLetterRenderer from "./CoverLetterRenderer";
import { CoverLetterData, sampleLetter } from "@/lib/coverLetterTypes";

const W = 794;
const H = 1123;

export default function CoverLetterPreview({
  templateId,
  letter,
  accent,
}: {
  templateId: string;
  letter?: CoverLetterData;
  accent?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.offsetWidth / W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden bg-white">
      <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <CoverLetterRenderer templateId={templateId} letter={letter ?? sampleLetter()} accent={accent} />
      </div>
    </div>
  );
}
