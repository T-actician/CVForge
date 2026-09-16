import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";
import TemplatePreview from "@/components/cv-templates/TemplatePreview";
import { getAllTemplateSettings } from "@/lib/templateSettings";

export default async function TemplatesPreview() {
  const settings = await getAllTemplateSettings();

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-10 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[13px] tracking-[0.12em] text-[var(--gold-dark)] mb-3">
            PROFESSIONAL TEMPLATES
          </p>
          <h2 className="font-display text-4xl text-[var(--brown-900)]">
            Beautiful Templates for Every Career
          </h2>
          <p className="mt-3 max-w-md text-[var(--brown-700)] font-serif-body">
            Modern, clean and professional templates designed to make your
            CV look great and get results.
          </p>
        </div>
        <Link
          href="/templates"
          className="hidden sm:flex items-center gap-2 text-[15px] text-[var(--gold-dark)] hover:text-[var(--brown-900)] transition-colors shrink-0"
        >
          View All Templates <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
        {TEMPLATES.map((t) => (
          <div key={t.id} className="group">
            <div className="rounded-lg overflow-hidden border border-[var(--line)] bg-[var(--paper)] shadow-sm aspect-[3/4] group-hover:shadow-md transition-shadow">
              <TemplatePreview templateId={t.id} settings={settings[t.id]} />
            </div>
            <p className="mt-3 text-[15px] text-[var(--brown-900)] font-medium">
              {t.name}
            </p>
            <Link
              href={`/builder?template=${t.id}`}
              className="mt-2 inline-block rounded-full border border-[var(--gold)] px-4 py-1.5 text-[12.5px] text-[var(--gold-dark)] hover:bg-[var(--gold)] hover:text-[var(--paper)] transition-colors"
            >
              Use Template
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
