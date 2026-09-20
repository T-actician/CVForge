import MpesaSupportCard from "@/components/shared/MpesaSupportCard";

export default function Pricing() {
  return (
    <section id="pricing" className="max-w-2xl mx-auto px-6 sm:px-10 py-20 text-center">
      <span className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brown-900)] text-[var(--gold-light)]">
        <img src="/icon.svg" alt="" className="h-6 w-6" />
      </span>
      <h2 className="font-display text-3xl text-[var(--brown-900)] mb-3">
        Support Vitae
      </h2>
      <p className="text-[14.5px] text-[var(--brown-500)] mb-8">
        Vitae is built and maintained by Tactician, a developer in Kenya, and
        is free to use. If it helped you land your next role, consider
        buying a coffee to help keep it free for everyone.
      </p>

      <MpesaSupportCard />

      <p className="text-[13px] text-[var(--brown-300)] mt-6">
        Every contribution goes toward keeping Vitae free, fast, and
        continuously improved. Thank you 🤍
      </p>
    </section>
  );
}
