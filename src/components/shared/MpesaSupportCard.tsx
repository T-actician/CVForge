"use client";

import { useState } from "react";
import { Smartphone, Check } from "lucide-react";

const MPESA_NUMBER_DISPLAY = "0115 774 307";
const MPESA_NUMBER_RAW = "0115774307";
const MPESA_NAME = "Alex Kariuki";

export default function MpesaSupportCard() {
  const [copied, setCopied] = useState(false);

  const handleTap = async () => {
    // Touch devices (phones) can dial straight into the SIM toolkit /
    // M-Pesa flow via a tel: link. Pointer devices (desktop/laptop) can't
    // "dial" anything, so there the most useful action is copying the
    // number for the person to send it themselves.
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) {
      window.location.href = `tel:${MPESA_NUMBER_RAW}`;
      return;
    }
    try {
      await navigator.clipboard.writeText(MPESA_NUMBER_RAW);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — nothing more we can do silently.
    }
  };

  return (
    <div className="rounded-xl border border-[var(--gold)]/40 bg-[var(--paper)] p-5">
      <p className="flex items-center gap-1.5 text-[11.5px] tracking-wide text-[var(--brown-500)] uppercase mb-4">
        <Smartphone size={13} /> M-Pesa (Kenya)
      </p>
      <button
        type="button"
        onClick={handleTap}
        className="w-full rounded-lg border border-[var(--line)] bg-[var(--ivory)] px-4 py-4 text-center hover:border-[var(--gold)] transition-colors"
      >
        <p className="text-[11px] tracking-wide text-[var(--brown-300)] uppercase mb-1">
          {copied ? "Copied" : "Tap to send via M-Pesa"}
        </p>
        <p className="flex items-center justify-center gap-2 font-display text-2xl text-[var(--brown-900)]">
          {copied ? (
            <>
              <Check size={20} className="text-[var(--gold-dark)]" />
              {MPESA_NUMBER_DISPLAY}
            </>
          ) : (
            MPESA_NUMBER_DISPLAY
          )}
        </p>
        <p className="text-[12px] text-[var(--brown-500)] mt-1">Name: ~{MPESA_NAME}~</p>
      </button>
      <p className="text-[11.5px] text-[var(--brown-300)] text-center mt-3">
        On desktop this copies the number · on mobile it opens your dialer to send directly
      </p>
    </div>
  );
}
