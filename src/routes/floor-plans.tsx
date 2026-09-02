import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import PageShell from "@/components/PageShell";
import LeadForm from "@/components/LeadForm";
import groundPlan from "@/assets/cedar-ground-floor-plan.jpg.asset.json";
import firstPlan from "@/assets/cedar-first-floor-plan.jpg.asset.json";
import { PRICING } from "@/lib/site-config";

const title = "Floor Plans — 4-Bedroom Maisonette at Cedar Homes, Lusegetti";
const description =
  "Architectural floor plans for the Cedar Homes 4-bedroom maisonette: 140.4 sqm ground floor, 126.3 sqm first floor, 266.7 sqm in total with DSQ, double-volume lobby and two balconies.";

export const Route = createFileRoute("/floor-plans")({
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
  component: FloorPlansPage,
});

const floors = [
  {
    id: "ground",
    label: "Ground Floor",
    area: "140.40 SQM",
    image: groundPlan.url,
    alt: "Ground floor schematic plan of the Cedar Homes maisonette showing lounge, dining, kitchen, guest bedroom and DSQ",
    rooms: [
      "Entry porch and double-volume entry lobby",
      "Open-plan lounge with TV console",
      "Dining opening onto a covered terrace",
      "Fitted kitchen with breakfast counter and double sink",
      "Separate pantry and kitchen porch",
      "Utility room with dhobi sink",
      "Guest bedroom, en-suite with shower cubicle",
      "DSQ with its own bathroom",
    ],
  },
  {
    id: "first",
    label: "First Floor",
    area: "126.30 SQM",
    image: firstPlan.url,
    alt: "First floor schematic plan of the Cedar Homes maisonette showing master bedroom, two further bedrooms and TV room",
    rooms: [
      "Master bedroom with walk-in closet",
      "Master en-suite with double vanity and shower",
      "Bedroom 02, en-suite with in-built wardrobe",
      "Bedroom 03, en-suite with in-built wardrobe",
      "Play area / family TV room",
      "Lobby with book shelving and linen cabinet",
      "Two balconies with non-slip ceramic finish",
      "Void over the entry lobby",
    ],
  },
];

const finishes = [
  "Ceramic floor tiles to architect's specification",
  "Timber floor boards in the lounge and dining",
  "Non-slip ceramic to terraces, balconies and porches",
  "In-built wardrobes to all bedrooms",
  "Vertical timber slats to the first-floor lobby",
  "Choice of a fitted kitchen or fit your own",
];

function FloorPlansPage() {
  return (
    <PageShell
      eyebrow="Floor Plans"
      title={<>266.7 sqm, <span className="text-cedar-gold italic">planned properly</span></>}
      intro={`Every Cedar Homes maisonette is a 4-bedroom, all en-suite home across two floors, with a DSQ, family room and private garden. Homes start ${PRICING.rangeLabel}.`}
    >
      <div className="container">
        {/* Summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-16">
          {[
            { value: "266.7", label: "Total SQM" },
            { value: "4", label: "Bedrooms, all en-suite" },
            { value: "2", label: "Storeys + DSQ" },
            { value: "1/8", label: "Acre plot" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-cedar-forest/10 p-5 text-center">
              <span className="font-serif text-2xl text-cedar-forest block leading-none tabular-nums">
                {s.value}
              </span>
              <span className="text-cedar-warm-gray text-[10px] uppercase tracking-wider mt-2 block">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Floors */}
        <div className="space-y-20">
          {floors.map((floor) => (
            <section key={floor.id} className="grid lg:grid-cols-[1.45fr_1fr] gap-10 items-start">
              <figure className="bg-white border border-cedar-forest/10 p-4">
                <img
                  src={floor.image}
                  alt={floor.alt}
                  loading="lazy"
                  className="w-full h-auto outline outline-1 -outline-offset-1 outline-black/10"
                />
                <figcaption className="text-cedar-warm-gray text-[12px] mt-3 text-center">
                  {floor.label} schematic plan — gross area {floor.area}. Drawing not to scale.
                </figcaption>
              </figure>

              <div>
                <span className="text-cedar-terracotta font-semibold text-[12px] tracking-[0.18em] uppercase mb-3 block">
                  {floor.area}
                </span>
                <h2 className="font-serif text-2xl lg:text-3xl text-cedar-forest mb-6">
                  {floor.label}
                </h2>
                <ul className="space-y-3">
                  {floor.rooms.map((room) => (
                    <li
                      key={room}
                      className="flex items-start gap-3 text-[14px] text-cedar-charcoal/80 border-b border-cedar-forest/[0.05] pb-3 last:border-0"
                    >
                      <span className="w-1.5 h-1.5 bg-cedar-terracotta shrink-0 mt-2" />
                      {room}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>

        {/* Finishes + CTA */}
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-start mt-20">
          <div>
            <h2 className="font-serif text-2xl text-cedar-forest mb-6 flex items-center gap-3">
              <span className="w-5 h-[2px] bg-cedar-gold" />
              Finishes
            </h2>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mb-10">
              {finishes.map((f) => (
                <div
                  key={f}
                  className="flex items-start gap-3 py-2 border-b border-cedar-forest/[0.05] last:border-0 text-[14px] text-cedar-charcoal/80"
                >
                  <span className="w-1.5 h-1.5 bg-cedar-gold shrink-0 mt-2" />
                  {f}
                </div>
              ))}
            </div>

            <div className="bg-cedar-forest p-8">
              <h3 className="font-serif text-xl text-white mb-3">See it in person</h3>
              <p className="text-white/60 text-[14px] leading-relaxed mb-6">
                The show house is complete and furnished — the fastest way to judge the layout is to
                walk it. Based abroad? We run live video walkthroughs instead.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/book-a-visit"
                  className="bg-cedar-terracotta hover:bg-cedar-terracotta-dark text-white px-6 py-3 text-[13px] font-semibold tracking-wide transition-colors duration-200"
                >
                  Book a Show House Visit
                </Link>
                <Link
                  to="/payment-plans"
                  className="border border-white/25 hover:border-white/50 text-white px-6 py-3 text-[13px] font-semibold tracking-wide transition-colors duration-200"
                >
                  View Payment Schedule
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <LeadForm
              variant="light"
              defaultInterest="showhouse-visit"
              persona="family"
              source="floor-plans"
              title="Request the full drawings"
              subtitle="We'll send the complete floor plans and finishes schedule."
              submitLabel="Send Me the Plans"
            />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
