import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { COVER_LETTER_TEMPLATES } from "@/lib/coverLetterTemplates";
import CoverLetterPreview from "@/components/cover-letter-templates/CoverLetterPreview";

export default function CoverLettersPage() {
  return (
    <main className="bg-[var(--cream)] min-h-screen">
      <Header />
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
        <p className="text-[13px] tracking-[0.12em] text-[var(--gold-dark)] mb-3">COVER LETTERS</p>
        <h1 className="font-display text-4xl text-[var(--brown-900)] mb-3">Choose Your Cover Letter</h1>
        <p className="max-w-lg text-[var(--brown-700)] font-serif-body mb-10">
          Professionally designed, ATS-friendly and fully editable. Switch templates anytime without
          losing your details.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {COVER_LETTER_TEMPLATES.map((t) => (
            <div key={t.id} className="group">
              <div className="rounded-lg overflow-hidden border border-[var(--line)] bg-[var(--paper)] shadow-sm aspect-[3/4] group-hover:shadow-md group-hover:border-[var(--gold)] transition-all">
                <CoverLetterPreview templateId={t.id} />
              </div>
              <p className="mt-3 text-[16px] text-[var(--brown-900)] font-medium">{t.name}</p>
              <p className="text-[13px] text-[var(--brown-500)] mt-0.5">{t.description}</p>
              <Link
                href={`/cover-letter-builder?template=${t.id}`}
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
