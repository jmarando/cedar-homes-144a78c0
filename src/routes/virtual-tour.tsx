import { createFileRoute } from "@tanstack/react-router";
import { Video, Globe2, Clock3, FileCheck2, Handshake } from "lucide-react";

import PageShell from "@/components/PageShell";
import LeadForm from "@/components/LeadForm";

const title = "Virtual Tour for Diaspora Buyers — Cedar Homes Lusegetti";
const description =
  "Buying from abroad? Book a live video walkthrough of the Cedar Homes showhouse at Lusegetti, Kikuyu, with a Q&A on title, payments and handover.";

export const Route = createFileRoute("/virtual-tour")({
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
  component: VirtualTourPage,
});

const steps = [
  {
    icon: Globe2,
    title: "Tell us your timezone",
    body: "Send your city and preferred window. We schedule tours early morning or evening Nairobi time to suit the UK, Gulf and North America.",
  },
  {
    icon: Video,
    title: "Live walkthrough, not a video file",
    body: "A member of our team walks the showhouse on a live call. Ask us to open cupboards, measure a wall, or step into the garden — it's your viewing.",
  },
  {
    icon: FileCheck2,
    title: "Documents shared on the call",
    body: "Title details, approved plans, floor plans and the price list are shared during or immediately after the tour, so nothing rests on trust alone.",
  },
  {
    icon: Handshake,
    title: "Appoint someone you trust",
    body: "If you'd rather have family or a lawyer inspect on your behalf, we'll host them at the site and share the same documentation.",
  },
];

function VirtualTourPage() {
  return (
    <PageShell
      eyebrow="For Buyers Abroad"
      title={<>Buy from abroad <span className="text-cedar-gold italic">without guessing</span></>}
      intro="Distance is the main reason diaspora buyers hesitate, and it should be. Here's how we make a remote purchase verifiable rather than a leap of faith."
    >
      <div className="container grid lg:grid-cols-[1fr_440px] gap-14 items-start">
        <div>
          <div className="space-y-6 mb-12">
            {steps.map((s, i) => (
              <div key={s.title} className="flex gap-5 bg-white border border-cedar-forest/10 p-6">
                <div className="shrink-0">
                  <div className="w-10 h-10 bg-cedar-terracotta/10 flex items-center justify-center">
                    <s.icon size={18} className="text-cedar-terracotta" />
                  </div>
                  <span className="block text-center text-cedar-warm-gray text-[11px] mt-2 font-semibold">
                    0{i + 1}
                  </span>
                </div>
                <div>
                  <h2 className="font-serif text-lg text-cedar-forest mb-2">{s.title}</h2>
                  <p className="text-cedar-charcoal/65 text-[14px] leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-cedar-forest/[0.04] border-l-2 border-cedar-gold p-6 flex gap-4">
            <Clock3 size={20} className="text-cedar-gold shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-cedar-forest text-[15px] mb-1.5">
                Tours usually run 30–45 minutes
              </h3>
              <p className="text-cedar-charcoal/65 text-[14px] leading-relaxed">
                Bring your questions and, if you like, a family member on the same call. We record
                nothing — but you're welcome to.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <LeadForm
            variant="light"
            defaultInterest="virtual-tour"
            persona="diaspora-first-time"
            source="virtual-tour"
            extended
            title="Schedule your virtual tour"
            subtitle="Tell us where you're based and we'll propose times that work."
            submitLabel="Schedule My Tour"
          />
        </div>
      </div>
    </PageShell>
  );
}
