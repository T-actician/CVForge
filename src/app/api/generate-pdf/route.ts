import { NextRequest, NextResponse } from "next/server";
import { existsSync } from "node:fs";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import type { PrintPayload } from "@/lib/printPayload";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BODY_BYTES = 2 * 1024 * 1024;
const PAGE_WIDTH_PX = 794 + 19 * 2; // content width + page margins (matches /print)

function siteOrigin(): string {
  if (process.env.VERCEL) {
    const host =
      process.env.VERCEL_ENV === "production"
        ? process.env.VERCEL_PROJECT_PRODUCTION_URL
        : process.env.VERCEL_URL;
    return `https://${host}`;
  }
  return `http://localhost:${process.env.PORT || 3000}`;
}

function localChromePath(): string {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  const found = candidates.find((p) => p && existsSync(p));
  if (!found) throw new Error("Chrome not found. Set CHROME_PATH in .env.local.");
  return found;
}

function validPayload(p: unknown): p is PrintPayload {
  if (!p || typeof p !== "object") return false;
  const o = p as Record<string, unknown>;
  if (typeof o.templateId !== "string") return false;
  if (o.kind === "cv") return !!o.cv && typeof o.cv === "object";
  if (o.kind === "letter") return !!o.letter && typeof o.letter === "object";
  return false;
}

export async function POST(req: NextRequest) {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | undefined;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }
    const payload: unknown = JSON.parse(raw);
    if (!validPayload(payload)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const onVercel = !!process.env.VERCEL;
    browser = await puppeteer.launch({
      args: onVercel ? chromium.args : ["--no-sandbox"],
      executablePath: onVercel ? await chromium.executablePath() : localChromePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.emulateMediaType("screen");
    await page.setViewport({ width: PAGE_WIDTH_PX, height: 1200, deviceScaleFactor: 1 });

    const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    if (bypass) await page.setExtraHTTPHeaders({ "x-vercel-protection-bypass": bypass });

    await page.evaluateOnNewDocument((data) => {
      (window as unknown as { __PRINT_DATA__: unknown }).__PRINT_DATA__ = data;
    }, payload);

    const res = await page.goto(`${siteOrigin()}/print`, { waitUntil: "load", timeout: 30_000 });
    if (!res || !res.ok()) throw new Error(`Render page failed (${res?.status() ?? "no response"}).`);

    await page.waitForSelector('#print-page[data-ready="1"]', { timeout: 25_000 });
    const height = await page.$eval("#print-page", (el) => Math.ceil(el.getBoundingClientRect().height));

    const pdf = await page.pdf({
      width: `${PAGE_WIDTH_PX}px`,
      height: `${height + 1}px`,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      pageRanges: "1",
    });

    return new NextResponse(Buffer.from(pdf), {
      headers: { "Content-Type": "application/pdf", "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("POST /api/generate-pdf failed:", err);
    const message = err instanceof Error ? err.message : "Could not generate the PDF.";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await browser?.close().catch(() => {});
  }
}
