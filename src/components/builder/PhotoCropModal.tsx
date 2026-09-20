"use client";

import { useRef, useState } from "react";
import { Check, X, ZoomIn } from "lucide-react";

const VIEWPORT = 280;
const OUTPUT = 600;

export default function PhotoCropModal({
  imageSrc,
  onCancel,
  onConfirm,
}: {
  imageSrc: string;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; startOffset: { x: number; y: number } } | null>(
    null
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current = { x: e.clientX, y: e.clientY, startOffset: offset };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    setOffset({ x: dragRef.current.startOffset.x + dx, y: dragRef.current.startOffset.y + dy });
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  const handleConfirm = () => {
    const img = imgRef.current;
    if (!img) return;
    const baseScale = VIEWPORT / Math.min(img.naturalWidth, img.naturalHeight);
    const factor = OUTPUT / VIEWPORT;
    const destWidth = img.naturalWidth * baseScale * zoom * factor;
    const destHeight = img.naturalHeight * baseScale * zoom * factor;
    const destX = OUTPUT / 2 - destWidth / 2 + offset.x * factor;
    const destY = OUTPUT / 2 - destHeight / 2 + offset.y * factor;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, OUTPUT, OUTPUT);
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, destX, destY, destWidth, destHeight);

    canvas.toBlob(
      (blob) => {
        if (blob) onConfirm(blob);
      },
      "image/jpeg",
      0.92
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-[var(--paper)] border border-[var(--line)] shadow-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="font-display text-[16px] text-[var(--brown-900)]">Position your photo</p>
          <button type="button" onClick={onCancel} className="text-[var(--brown-300)] hover:text-[var(--brown-900)]">
            <X size={16} />
          </button>
        </div>

        <div
          className="relative mx-auto rounded-md overflow-hidden bg-[var(--ivory)] touch-none cursor-move select-none"
          style={{ width: VIEWPORT, height: VIEWPORT }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <img
            ref={imgRef}
            src={imageSrc}
            alt=""
            draggable={false}
            className="absolute top-1/2 left-1/2 max-w-none pointer-events-none"
            style={{
              transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            }}
          />
          {/* Circular guide showing exactly what will appear on the CV */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)",
              borderRadius: "9999px",
            }}
          />
        </div>

        <div className="flex items-center gap-2.5 mt-4">
          <ZoomIn size={15} className="text-[var(--brown-500)] shrink-0" />
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full accent-[var(--gold)]"
          />
        </div>
        <p className="text-[11.5px] text-[var(--brown-300)] text-center mt-1">
          Drag to reposition · slide to zoom
        </p>

        <div className="flex justify-end gap-2.5 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-[var(--line)] px-4 py-2 text-[13.5px] text-[var(--brown-700)] hover:border-[var(--brown-300)] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--brown-900)] px-4 py-2 text-[13.5px] text-white hover:brightness-110 transition-colors"
          >
            <Check size={14} /> Use photo
          </button>
        </div>
      </div>
    </div>
  );
}
