import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import TemplatesPreview from "@/components/landing/TemplatesPreview";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";
import { getSiteConfig } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export default async function Home() {
  const config = await getSiteConfig();

  return (
    <main className="bg-[var(--cream)]">
      <Header />
      <Hero config={config} />
      <TemplatesPreview />
      <Features />
      <HowItWorks config={config} />
      <Pricing />
      <Footer />
    </main>
  );
}
