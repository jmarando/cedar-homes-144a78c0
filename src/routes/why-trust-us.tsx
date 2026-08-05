import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, FileText, Eye, Users, Scale, MapPinned } from "lucide-react";

import PageShell from "@/components/PageShell";
import LeadForm from "@/components/LeadForm";
import { PROJECT, CONTACT } from "@/lib/site-config";

const title = "Why Trust Cedar Homes — Developer Credentials & Due Diligence";
const description =
  "Title, approvals, a completed showhouse and a named team. The checks any buyer — especially from the diaspora — should make before paying a deposit in Kenya.";

export const Route = createFileRoute("/why-trust-us")({
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
  component: TrustPage,
});

const proofs = [
  {
    icon: Eye,
    title: "A finished home you can stand in",
    body: "Unit 1 is built, finished and open for viewing. You are not judging a render — you are judging the actual product, on the actual site.",
  },
  {
    icon: FileText,
    title: "Title and approvals on request",
    body: "We share title documentation and approved development plans with serious buyers, before any deposit is discussed.",
  },
  {
    icon: Users,
    title: "A named developer, not an anonymous page",
    body: `${PROJECT.name} is developed by ${PROJECT.developer}, with a physical office and a team you can meet in person.`,
  },
  {
    icon: MapPinned,
    title: "A site you can visit unannounced",
    body: `${CONTACT.address}. Come and see it, bring a surveyor, or send someone on your behalf.`,
  },
  {
    icon: Scale,
    title: "Advocate review encouraged",
    body: "We expect your lawyer to review the sale agreement. Any developer discouraging independent legal review is a warning sign.",
  },
  {
    icon: ShieldCheck,
    title: "Payments to documented accounts only",
    body: "All payments go to the official project account named in your agreement. We will never ask for funds to a personal number or account.",
  },
];

const checklist = [
  "Confirm the title deed and search at the Lands registry",
  "Verify county approvals for the development",
  "Visit the site, or send a trusted representative",
  "Have an advocate review the sale agreement",
  "Pay only into the account named in the agreement",
  "Keep receipts and written confirmation of every payment",
];

function TrustPage() {
  return (
    <PageShell
      eyebrow="Due Diligence"
      title={<>Verify us <span className="text-cedar-gold italic">before you trust us</span></>}
      intro="Property fraud is a real risk in Kenya, and healthy scepticism protects you. Here is exactly what we put on the table, and what you should independently check."
    >
      <div className="container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {proofs.map((p) => (
            <div key={p.title} className="bg-white border border-cedar-forest/10 p-7">
              <p.icon size={22} className="text-cedar-terracotta mb-4" />
              <h2 className="font-serif text-lg text-cedar-forest mb-3 leading-snug">{p.title}</h2>
              <p className="text-cedar-charcoal/65 text-[14px] leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-14 items-start">
          <div className="bg-cedar-forest p-8 lg:p-10">
            <h2 className="font-serif text-2xl text-white mb-3">Your buyer's checklist</h2>
            <p className="text-white/55 text-[15px] leading-relaxed mb-7 max-w-lg">
              Run this against us — and against every other developer you are considering.
            </p>
            <ul className="space-y-3.5">
              {checklist.map((item) => (
                <li key={item} className="flex gap-3 text-white/70 text-[14px] leading-relaxed">
                  <ShieldCheck size={16} className="text-cedar-gold shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:sticky lg:top-24">
            <LeadForm
              variant="light"
              defaultInterest="documentation"
              persona="diaspora-first-time"
              source="why-trust-us"
              extended
              title="Request documentation"
              subtitle="We'll share title details, approvals and floor plans."
              submitLabel="Request Documents"
            />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
