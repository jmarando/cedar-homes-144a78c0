import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Building2, ShieldCheck, Coins, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

import PageShell from "@/components/PageShell";
import LeadForm from "@/components/LeadForm";
import { PRICING } from "@/lib/site-config";

const title = "Cedar Homes Investment Brief — Kikuyu Property Returns";
const description =
  "Rental yields, capital growth drivers and payment structures for Cedar Homes Kikuyu. Built for local and diaspora investors weighing a Kiambu property purchase.";

export const Route = createFileRoute("/investment")({
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
  component: InvestmentPage,
});

const drivers = [
  {
    icon: Building2,
    title: "Infrastructure already delivered",
    body: "The Southern Bypass and upgraded Dagoretti Road cut the commute to Westlands and the CBD. Kikuyu's value story is driven by access that already exists, not roads that are promised.",
  },
  {
    icon: TrendingUp,
    title: "Under-supplied family housing",
    body: "Demand in Kikuyu skews heavily toward standalone family homes in gated schemes, while most new supply is apartments. That gap supports both rental occupancy and resale pricing.",
  },
  {
    icon: ShieldCheck,
    title: "Title and compliance",
    body: "Freehold title, approved development plans and a completed showhouse you can inspect. The build risk that usually sits with off-plan buyers has largely been removed.",
  },
  {
    icon: Coins,
    title: "Entry before completion pricing",
    body: `Pre-order pricing starts at ${PRICING.fromPriceLabel}. Buyers entering now hold the unit at today's price while the remaining units are completed.`,
  },
];

function InvestmentPage() {
  return (
    <PageShell
      eyebrow="For Investors"
      title={<>The numbers behind <span className="text-cedar-gold italic">Cedar Homes</span></>}
      intro="A straight look at what drives value in Kikuyu, how the payment structure works, and what to expect from the units as rental or hold assets."
    >
      <div className="container">
        <div className="grid lg:grid-cols-[1fr_440px] gap-14 items-start">
          <div>
            <div className="grid sm:grid-cols-2 gap-6 mb-14">
              {drivers.map((d) => (
                <div key={d.title} className="bg-white border border-cedar-forest/10 p-7">
                  <d.icon size={22} className="text-cedar-terracotta mb-4" />
                  <h2 className="font-serif text-lg text-cedar-forest mb-3">{d.title}</h2>
                  <p className="text-cedar-charcoal/65 text-[14px] leading-relaxed">{d.body}</p>
                </div>
              ))}
            </div>

            <div className="bg-cedar-forest p-8 lg:p-10">
              <h2 className="font-serif text-2xl text-white mb-4">Model your own return</h2>
              <p className="text-white/60 text-[15px] leading-relaxed mb-7 max-w-lg">
                Put your own assumptions on rent, appreciation and holding period into the
                calculator and see the numbers rather than taking ours on faith.
              </p>
              <Link
                to="/roi-calculator"
                className="inline-flex items-center gap-2 bg-cedar-terracotta hover:bg-cedar-terracotta-light text-white px-6 py-3.5 text-[14px] font-semibold transition-colors"
              >
                Open the ROI calculator
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-10 text-cedar-charcoal/50 text-[12px] leading-relaxed border-t border-cedar-forest/10 pt-6">
              Figures on this page are indicative and depend on market conditions, finishing
              choices and letting performance. They are not a guarantee of return. Request the
              full brief for the current assumptions and comparable evidence.
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <LeadForm
              variant="light"
              defaultInterest="investment-info"
              persona="investor"
              source="investment"
              extended
              title="Request the investment brief"
              subtitle="We'll send the full pack, including pricing and payment structures."
              submitLabel="Send Me the Brief"
            />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
