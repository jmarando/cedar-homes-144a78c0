import { createFileRoute } from "@tanstack/react-router";

import PageShell from "@/components/PageShell";
import LeadForm from "@/components/LeadForm";
import { PAYMENT_PLANS, PRICING } from "@/lib/site-config";

const title = "Payment Plans & Schedule — Cedar Homes Lusegetti";
const description = `Cedar Homes payment schedule: show house at ${PRICING.showHousePriceLabel}, cash from ${PRICING.fromPriceLabel}, instalments and mortgage routes with deposits from 10%.`;

export const Route = createFileRoute("/payment-plans")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaymentPlansPage,
});

const rows = [
  { key: "priceLabel" as const, label: "Price" },
  { key: "deposit" as const, label: "Deposit" },
  { key: "plan" as const, label: "Payment plan" },
  { key: "duration" as const, label: "Duration" },
  { key: "onCompletion" as const, label: "On completion" },
];

function PaymentPlansPage() {
  return (
    <PageShell
      eyebrow="Payment Schedule"
      title={<>Flexible options. <span className="text-cedar-gold italic">Built for you.</span></>}
      intro={`The price of your home depends on how you choose to pay. Cash starts at ${PRICING.fromPriceLabel}; the completed show house is ${PRICING.showHousePriceLabel}. Every schedule is documented before any money changes hands.`}
    >
      <div className="container grid lg:grid-cols-[1fr_420px] gap-14 items-start">
        <div>
          {/* Desktop matrix */}
          <div className="hidden md:block overflow-hidden border border-cedar-forest/10 bg-white mb-10">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="w-[150px] bg-cedar-forest" />
                  {PAYMENT_PLANS.map((p) => (
                    <th
                      key={p.id}
                      className={`px-5 py-4 text-[12px] uppercase tracking-[0.14em] font-semibold ${
                        p.featured
                          ? "bg-cedar-terracotta text-white"
                          : "bg-cedar-forest text-white/85"
                      }`}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={row.key} className={ri % 2 ? "bg-cedar-cream/40" : "bg-white"}>
                    <th className="px-5 py-4 text-[11px] uppercase tracking-[0.14em] text-white/70 font-semibold bg-cedar-forest align-middle">
                      {row.label}
                    </th>
                    {PAYMENT_PLANS.map((p) => (
                      <td
                        key={p.id}
                        className={`px-5 py-4 align-middle border-l border-cedar-forest/[0.07] ${
                          row.key === "priceLabel"
                            ? "font-serif text-2xl text-cedar-terracotta tabular-nums"
                            : "text-[13px] text-cedar-charcoal/75 leading-relaxed"
                        }`}
                      >
                        {p[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4 mb-10">
            {PAYMENT_PLANS.map((p) => (
              <div
                key={p.id}
                className={`bg-white border p-6 ${
                  p.featured ? "border-cedar-terracotta/40" : "border-cedar-forest/10"
                }`}
              >
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-[12px] uppercase tracking-[0.14em] font-semibold text-cedar-forest">
                    {p.name}
                  </span>
                  <span className="font-serif text-2xl text-cedar-terracotta tabular-nums">
                    {p.priceLabel}
                  </span>
                </div>
                <dl className="space-y-2.5">
                  {rows.slice(1).map((row) => (
                    <div key={row.key} className="flex justify-between gap-6 text-[13px]">
                      <dt className="text-cedar-warm-gray shrink-0">{row.label}</dt>
                      <dd className="text-cedar-charcoal text-right">{p[row.key]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {PAYMENT_PLANS.map((p) => (
              <div key={p.id} className="border-l-2 border-cedar-gold pl-4 py-1">
                <h2 className="font-serif text-base text-cedar-forest mb-1">{p.name}</h2>
                <p className="text-cedar-charcoal/65 text-[13px] leading-relaxed">{p.note}</p>
              </div>
            ))}
          </div>

          <div className="bg-cedar-forest p-8">
            <h2 className="font-serif text-xl text-white mb-3">How buying works</h2>
            <ol className="space-y-3 text-white/60 text-[14px] leading-relaxed list-decimal list-inside">
              <li>Choose your home after a show house or virtual viewing.</li>
              <li>Pick the payment route that suits you from the schedule above.</li>
              <li>Pay the deposit for that route to secure the home at today's price.</li>
              <li>Receive the sale agreement and payment schedule for legal review.</li>
              <li>Complete payments per the schedule, then transfer and handover.</li>
            </ol>
            <p className="text-white/35 text-[12px] leading-relaxed mt-5">
              Final pricing and terms are confirmed in the sale agreement. Always have your advocate
              review documents before signing.
            </p>
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <LeadForm
            variant="light"
            defaultInterest="payment-plan"
            persona="family"
            source="payment-plans"
            extended
            title="Request a payment schedule"
            subtitle="Tell us which route suits you and we'll send the figures."
            submitLabel="Send Me the Schedule"
          />
        </div>
      </div>
    </PageShell>
  );
}
