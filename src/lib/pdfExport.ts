// Renders an element to a single continuous A4-width PDF page (same method
// the CV download uses) and returns the jsPDF instance.
export async function elementToPdf(el: HTMLElement) {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);
  const PAGE_WIDTH_PX = 794;
  const height = el.scrollHeight;
  const maxScale = Math.sqrt(50_000_000 / (PAGE_WIDTH_PX * height));
  const SCALE = Math.max(2, Math.min(7, maxScale));

  const canvas = await html2canvas(el, {
    scale: SCALE,
    useCORS: true,
    backgroundColor: "#ffffff",
    width: PAGE_WIDTH_PX,
    windowWidth: PAGE_WIDTH_PX,
    height,
    windowHeight: height,
  });

  const mmWidth = 210;
  const mmHeight = (canvas.height / SCALE / PAGE_WIDTH_PX) * mmWidth;
  const M = 5;
  const w = mmWidth + M * 2;
  const h = mmHeight + M * 2;
  const pdf = new jsPDF({
    unit: "mm",
    format: [w, h],
    orientation: h >= w ? "portrait" : "landscape",
  });
  pdf.addImage(canvas.toDataURL("image/png"), "PNG", M, M, mmWidth, mmHeight, undefined, "FAST");

  const box = el.getBoundingClientRect();
  const k = mmWidth / PAGE_WIDTH_PX;
  el.querySelectorAll<HTMLElement>("[data-pdf-link]").forEach((a) => {
    const url = a.getAttribute("data-pdf-link");
    if (!url) return;
    const r = a.getBoundingClientRect();
    pdf.link(M + (r.left - box.left) * k, M + (r.top - box.top) * k, r.width * k, r.height * k, { url });
  });
  return pdf;
}
