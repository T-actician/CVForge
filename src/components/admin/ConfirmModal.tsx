"use client";

import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-lg bg-[var(--paper)] border border-[var(--line)] shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-4">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              danger ? "bg-[#a5473a]/10 text-[#a5473a]" : "bg-[var(--gold)]/15 text-[var(--gold-dark)]"
            }`}
          >
            <AlertTriangle size={17} />
          </span>
          <div>
            <h2 className="font-display text-[17px] text-[var(--brown-900)] mb-1">{title}</h2>
            <p className="text-[13.5px] text-[var(--brown-500)] leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-[var(--line)] px-4 py-2 text-[13.5px] text-[var(--brown-700)] hover:border-[var(--brown-300)] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-md px-4 py-2 text-[13.5px] text-white transition-colors ${
              danger ? "bg-[#a5473a] hover:brightness-110" : "bg-[var(--brown-900)] hover:brightness-110"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
