import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { TEMPLATES } from "@/lib/templates";
import TemplatePreview from "@/components/cv-templates/TemplatePreview";
import { getAllTemplateSettings } from "@/lib/templateSettings";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const settings = await getAllTemplateSettings();

  return (
    <main className="bg-[var(--cream)] min-h-screen">
      <Header />
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
        <p className="text-[13px] tracking-[0.12em] text-[var(--gold-dark)] mb-3">
          STEP 1 OF 3
        </p>
        <h1 className="font-display text-4xl text-[var(--brown-900)] mb-3">
          Choose Your Template
        </h1>
        <p className="max-w-lg text-[var(--brown-700)] font-serif-body mb-10">
          Every template is ATS-friendly and fully editable. You can switch
          templates anytime without losing your details.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {TEMPLATES.map((t) => (
            <div key={t.id} className="group">
              <div className="rounded-lg overflow-hidden border border-[var(--line)] bg-[var(--paper)] shadow-sm aspect-[3/4] group-hover:shadow-md group-hover:border-[var(--gold)] transition-all">
                <TemplatePreview templateId={t.id} settings={settings[t.id]} />
              </div>
              <p className="mt-3 text-[16px] text-[var(--brown-900)] font-medium">
                {t.name}
              </p>
              <p className="text-[13px] text-[var(--brown-500)] mt-0.5">
                {t.description}
              </p>
              <Link
                href={`/builder?template=${t.id}`}
                className="mt-3 inline-block rounded-full bg-[var(--brown-900)] px-5 py-2 text-[13px] text-[var(--ivory)] hover:bg-[var(--brown-800)] transition-colors"
              >
                Use This Template
              </Link>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
