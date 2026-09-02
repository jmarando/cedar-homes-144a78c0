import { createFileRoute } from "@tanstack/react-router";
import { Banknote, CalendarClock, Landmark, KeyRound } from "lucide-react";

import PageShell from "@/components/PageShell";
import LeadForm from "@/components/LeadForm";
import { PRICING } from "@/lib/site-config";

const title = "Payment Plans & Reservation — Cedar Homes Lusegetti";
const description = `Reserve a Cedar Homes house from ${PRICING.reservationDepositLabel}. Instalment plans, mortgage routes and cash terms for the remaining Cedar Homes units explained.`;

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

const routes = [
  {
    icon: Banknote,
    name: "Cash purchase",
    summary: "Best pricing available",
    points: [
      "Full payment on signing, with the strongest negotiated price",
      "Fastest route to title transfer and handover",
      "Suited to buyers with funds already in place",
    ],
  },
  {
    icon: CalendarClock,
    name: "Instalment plan",
    summary: `From ${PRICING.reservationDepositLabel} reservation`,
    points: [
      `${PRICING.reservationDepositLabel} reservation holds your home at today's price`,
      "Balance spread across staged payments through to completion",
      "Schedule agreed in writing before any funds move",
    ],
  },
  {
    icon: Landmark,
    name: "Mortgage",
    summary: "Bank or SACCO financing",
    points: [
      "We share valuation and title documents banks require",
      "Introductions to lenders active in Kiambu County",
      "Diaspora mortgage products available through several Kenyan banks",
    ],
  },
  {
    icon: KeyRound,
    name: "Show house purchase",
    summary: "Move in immediately",
    points: [
      "The show house is complete, furnished and available to buy",
      "No construction wait — handover on completion of transfer",
      "Ideal for buyers who need occupancy now",
    ],
  },
];

function PaymentPlansPage() {
  return (
    <PageShell
      eyebrow="Payment & Reservation"
      title={<>Four ways to <span className="text-cedar-gold italic">secure a unit</span></>}
      intro={`Units are priced ${PRICING.rangeLabel}. Whichever route you take, the reservation and payment schedule is documented before any money changes hands.`}
    >
      <div className="container grid lg:grid-cols-[1fr_420px] gap-14 items-start">
        <div>
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {routes.map((r) => (
              <div key={r.name} className="bg-white border border-cedar-forest/10 p-7 flex flex-col">
                <r.icon size={22} className="text-cedar-terracotta mb-4" />
                <h2 className="font-serif text-lg text-cedar-forest mb-1">{r.name}</h2>
                <span className="text-cedar-gold text-[12px] font-semibold tracking-wide uppercase mb-4">
                  {r.summary}
                </span>
                <ul className="space-y-2.5 mt-auto">
                  {r.points.map((p) => (
                    <li key={p} className="text-cedar-charcoal/65 text-[13px] leading-relaxed flex gap-2.5">
                      <span className="w-1 h-1 rounded-full bg-cedar-terracotta shrink-0 mt-2" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-cedar-forest p-8">
            <h2 className="font-serif text-xl text-white mb-3">How reservation works</h2>
            <ol className="space-y-3 text-white/60 text-[14px] leading-relaxed list-decimal list-inside">
              <li>Choose your unit after a showhouse or virtual viewing.</li>
              <li>Pay the {PRICING.reservationDepositLabel} reservation to hold it at today's price.</li>
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
