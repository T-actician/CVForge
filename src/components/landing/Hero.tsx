import Link from "next/link";
import MiniCVMockup from "./MiniCVMockup";
import WatchHowItWorksButton from "./WatchHowItWorksButton";
import type { SiteConfig } from "@/lib/siteConfig";

export default function Hero({ config }: { config: SiteConfig }) {
  return (
    <section
      className="relative overflow-hidden"
      style={
        config.heroBackgroundImage
          ? {
              backgroundImage: `url(${config.heroBackgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {!config.heroBackgroundImage && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 100% at 85% 20%, #efe0c0 0%, var(--ivory) 45%, var(--cream) 100%)",
          }}
        />
      )}
      {config.heroBackgroundImage && (
        <div className="absolute inset-0 bg-[var(--cream)]/60" />
      )}

      <div className="relative grid lg:grid-cols-2 gap-14 items-center max-w-7xl mx-auto px-6 sm:px-10 py-16 lg:py-24">
        <div>
          <p className="text-[13px] tracking-[0.15em] text-[var(--brown-500)] mb-5">
            {config.heroEyebrow}
          </p>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.08] text-[var(--brown-900)]">
            {config.heroHeading}
            <br />
            <span className="gold-gradient-text">
              {config.heroHeadingAccent}
            </span>
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[var(--brown-700)] font-serif-body">
            {config.heroSubheading}
          </p>

          <div className="mt-9 flex items-center gap-8">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] px-7 py-3.5 text-[15px] text-[var(--paper)] shadow-sm hover:brightness-105 transition"
            >
              Get Started
              <span aria-hidden>→</span>
            </Link>
            <WatchHowItWorksButton videoUrl={config.howItWorksVideoUrl} />
          </div>
        </div>

        <div className="relative">
          <div className="relative mx-auto max-w-[560px]">
            <div className="rounded-t-xl bg-[#26201a] p-3 pb-0 shadow-2xl">
              <div className="rounded-t-lg bg-[#fbf6ec] aspect-[16/10.3] overflow-hidden">
                <MiniCVMockup cv={config.heroCV} />
              </div>
            </div>
            <div className="h-3 rounded-b-md bg-gradient-to-b from-[#3a2f24] to-[#1c1712] mx-[-6px]" />
            <div className="h-1.5 w-1/3 mx-auto rounded-b-md bg-[#151109]" />
          </div>
        </div>
      </div>
    </section>
  );
}
