import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calculator, TrendingUp, Wallet, PiggyBank } from "lucide-react";

import PageShell from "@/components/PageShell";
import LeadForm from "@/components/LeadForm";
import { PRICING, PROJECT } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

const title = "Cedar Homes ROI Calculator — Rental Yield & Growth";
const description =
  "Estimate rental yield, capital appreciation and total return on a Cedar Homes home at Lusegetti, Kikuyu. Adjust price, rent and holding period to model your own numbers.";

export const Route = createFileRoute("/roi-calculator")({
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
  component: RoiCalculatorPage,
});

const ksh = (value: number) =>
  new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(
    Math.round(value)
  );

function RoiCalculatorPage() {
  const [price, setPrice] = useState<number>(PRICING.fromPrice);
  const [monthlyRent, setMonthlyRent] = useState(150_000);
  const [appreciation, setAppreciation] = useState(12);
  const [years, setYears] = useState(5);
  const [occupancy, setOccupancy] = useState(92);
  const [costs, setCosts] = useState(15);

  const results = useMemo(() => {
    const grossAnnualRent = monthlyRent * 12 * (occupancy / 100);
    const netAnnualRent = grossAnnualRent * (1 - costs / 100);
    const grossYield = (grossAnnualRent / price) * 100;
    const netYield = (netAnnualRent / price) * 100;
    const futureValue = price * Math.pow(1 + appreciation / 100, years);
    const capitalGain = futureValue - price;
    const rentalIncome = netAnnualRent * years;
    const totalReturn = capitalGain + rentalIncome;
    const totalReturnPct = (totalReturn / price) * 100;
    return {
      grossAnnualRent,
      netAnnualRent,
      grossYield,
      netYield,
      futureValue,
      capitalGain,
      rentalIncome,
      totalReturn,
      totalReturnPct,
    };
  }, [price, monthlyRent, appreciation, years, occupancy, costs]);

  return (
    <PageShell
      eyebrow="Investor Tools"
      title={<>Run the numbers <span className="text-cedar-gold italic">yourself</span></>}
      intro={`Adjust the assumptions to match your view of the market. Defaults reflect current asking rents around ${PROJECT.location} for comparable four-bedroom homes.`}
    >
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Inputs */}
          <div className="bg-white border border-cedar-forest/10 p-7 lg:p-8">
            <div className="flex items-center gap-2.5 mb-7">
              <Calculator size={20} className="text-cedar-terracotta" />
              <h2 className="font-serif text-xl text-cedar-forest">Your assumptions</h2>
            </div>

            <div className="space-y-7">
              <Slider
                label="Purchase price"
                value={price}
                display={ksh(price)}
                min={20_000_000}
                max={35_000_000}
                step={100_000}
                onChange={setPrice}
              />
              <Slider
                label="Expected monthly rent"
                value={monthlyRent}
                display={ksh(monthlyRent)}
                min={60_000}
                max={350_000}
                step={5_000}
                onChange={setMonthlyRent}
              />
              <Slider
                label="Annual appreciation"
                value={appreciation}
                display={`${appreciation}%`}
                min={0}
                max={25}
                step={1}
                onChange={setAppreciation}
              />
              <Slider
                label="Holding period"
                value={years}
                display={`${years} year${years === 1 ? "" : "s"}`}
                min={1}
                max={20}
                step={1}
                onChange={setYears}
              />
              <Slider
                label="Occupancy rate"
                value={occupancy}
                display={`${occupancy}%`}
                min={50}
                max={100}
                step={1}
                onChange={setOccupancy}
              />
              <Slider
                label="Running costs (management, levies, maintenance)"
                value={costs}
                display={`${costs}% of rent`}
                min={0}
                max={40}
                step={1}
                onChange={setCosts}
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="bg-cedar-forest p-7 lg:p-8">
              <h2 className="font-serif text-xl text-white mb-6">Projected outcome</h2>
              <div className="grid grid-cols-2 gap-5 mb-7">
                <Metric icon={Wallet} label="Net annual rent" value={ksh(results.netAnnualRent)} />
                <Metric icon={PiggyBank} label="Net rental yield" value={`${results.netYield.toFixed(1)}%`} />
                <Metric icon={TrendingUp} label={`Value after ${years}y`} value={ksh(results.futureValue)} />
                <Metric icon={TrendingUp} label="Capital gain" value={ksh(results.capitalGain)} />
              </div>

              <div className="border-t border-white/10 pt-6">
                <span className="text-white/40 text-[11px] tracking-[0.16em] uppercase block mb-2">
                  Total return over {years} year{years === 1 ? "" : "s"}
                </span>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="font-serif text-3xl lg:text-4xl text-cedar-gold">
                    {ksh(results.totalReturn)}
                  </span>
                  <span className="text-white/50 text-[14px]">
                    ({results.totalReturnPct.toFixed(0)}% of purchase price)
                  </span>
                </div>
                <p className="text-white/35 text-[11px] leading-relaxed mt-4">
                  Rental income {ksh(results.rentalIncome)} + capital gain {ksh(results.capitalGain)}.
                  Estimates only — actual returns depend on market conditions and letting performance.
                </p>
              </div>
            </div>

            <LeadForm
              variant="light"
              defaultInterest="roi-calculator"
              persona="diaspora-investor"
              source="roi-calculator"
              extended
              title="Discuss these numbers with us"
              subtitle="We'll send comparable rental evidence and the full investment brief."
              submitLabel="Send Me the Evidence"
            />
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2.5 gap-3">
        <label className="text-cedar-charcoal/70 text-[13px] font-medium">{label}</label>
        <span className="text-cedar-forest font-semibold text-[14px] tabular-nums">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerUp={() => trackEvent("roi_calculated", { field: label })}
        aria-label={label}
        className="w-full accent-cedar-terracotta cursor-pointer"
      />
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
}) {
  return (
    <div>
      <Icon size={16} className="text-cedar-gold mb-2" />
      <span className="block text-white/40 text-[11px] tracking-wide uppercase mb-1">{label}</span>
      <span className="font-serif text-lg text-white leading-tight">{value}</span>
    </div>
  );
}
