import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Car, Clock, MapPin, Sparkles } from "lucide-react";

import PageShell from "@/components/PageShell";
import LeadForm from "@/components/LeadForm";
import { CONTACT, PROJECT } from "@/lib/site-config";

const title = "Book a Showhouse Visit — Cedar Homes Lusegetti";
const description =
  "Walk through the completed Cedar Homes showhouse at Lusegetti, Kikuyu. Book a viewing slot with our team and see the finishes, layout and space before you commit.";

export const Route = createFileRoute("/book-a-visit")({
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
  component: BookAVisitPage,
});

const practicalities = [
  { icon: Clock, title: "Viewing hours", desc: "Monday to Saturday, 9:00am – 5:00pm. Sunday viewings by arrangement." },
  { icon: Car, title: "Getting there", desc: `${PROJECT.location}, off Dagoretti Road. Roughly 25 minutes from Westlands via the Southern Bypass.` },
  { icon: Calendar, title: "How long it takes", desc: "Allow 45 minutes for a full walkthrough plus time to talk through pricing and payment plans." },
  { icon: Sparkles, title: "What you'll see", desc: "The finished show house — real finishes, real room sizes, and the gated estate as it stands today." },
];

function BookAVisitPage() {
  return (
    <PageShell
      eyebrow="Showhouse Viewing"
      title={<>See the finished home <span className="text-cedar-gold italic">before you buy</span></>}
      intro="Unit 1 is complete and open for viewing. Nothing removes doubt faster than standing in the space — book a slot and bring your questions."
    >
      <div className="container grid lg:grid-cols-[1fr_460px] gap-14 items-start">
        <div>
          <h2 className="font-serif text-2xl lg:text-3xl text-cedar-forest mb-6">
            What to expect on the day
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {practicalities.map((item) => (
              <div key={item.title} className="bg-white border border-cedar-forest/10 p-6">
                <item.icon size={20} className="text-cedar-terracotta mb-4" />
                <h3 className="font-semibold text-cedar-forest text-[15px] mb-2">{item.title}</h3>
                <p className="text-cedar-charcoal/65 text-[13px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-cedar-forest/[0.04] border-l-2 border-cedar-terracotta p-6">
            <h3 className="font-serif text-lg text-cedar-forest mb-2">Can't make it in person?</h3>
            <p className="text-cedar-charcoal/70 text-[14px] leading-relaxed">
              We run live video walkthroughs for buyers abroad, scheduled around your timezone.
              Choose "Virtual tour" in the form and tell us where you're based.
            </p>
          </div>

          <div className="mt-10 flex items-start gap-3 text-cedar-charcoal/65 text-[14px]">
            <MapPin size={18} className="text-cedar-terracotta shrink-0 mt-0.5" />
            <span>{CONTACT.address}</span>
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <LeadForm
            variant="light"
            defaultInterest="showhouse-visit"
            persona="family"
            source="book-a-visit"
            extended
            title="Request a viewing slot"
            subtitle="Tell us when suits you and we'll confirm by WhatsApp."
            submitLabel="Request My Slot"
          />
        </div>
      </div>
    </PageShell>
  );
}
