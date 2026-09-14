"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";

export default function WatchHowItWorksButton({ videoUrl }: { videoUrl: string }) {
  const [open, setOpen] = useState(false);

  if (!videoUrl) return null;

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-3 text-[var(--brown-700)] group">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--brown-300)] group-hover:border-[var(--brown-700)] transition">
          <Play size={14} fill="currentColor" strokeWidth={0} />
        </span>
        <span className="text-left leading-tight">
          <span className="block text-[15px]">Watch How It Works</span>
          <span className="block text-[12px] text-[var(--brown-500)]">Quick 1-min guide</span>
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full rounded-lg shadow-2xl bg-black aspect-video"
            />
          </div>
        </div>
      )}
    </>
  );
}
