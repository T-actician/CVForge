import type { PrintPayload } from "@/lib/printPayload";

// Asks the server to render the real template in headless Chromium and
// return a text-based PDF (selectable text, working links, ATS-readable).
export async function generatePdf(payload: PrintPayload): Promise<Blob> {
  const res = await fetch("/api/generate-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Could not generate the PDF.");
  }
  return res.blob();
}

export function savePdf(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
