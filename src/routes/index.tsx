import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PersonaSelector from "@/components/PersonaSelector";
import UnitAvailability from "@/components/UnitAvailability";

const WhyKikuyuSection = lazy(() => import("@/components/WhyKikuyuSection"));
const PropertySpecs = lazy(() => import("@/components/PropertySpecs"));
const TrustSection = lazy(() => import("@/components/TrustSection"));
const TimelineSection = lazy(() => import("@/components/TimelineSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const LeadCaptureSection = lazy(() => import("@/components/LeadCaptureSection"));
const Footer = lazy(() => import("@/components/Footer"));
const FloatingCTA = lazy(() => import("@/components/FloatingCTA"));
const WhatsAppButton = lazy(() => import("@/components/WhatsAppButton"));

const title = "Cedar Homes Kikuyu — Modern 4-Bedroom Homes";
const description =
  "Five modern family homes in Kikuyu, Kiambu. Tour the completed showhouse or pre-order one of the remaining units.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

function SectionFallback() {
  return <div className="min-h-[200px]" />;
}

function Index() {
  return (
    <div className="min-h-screen bg-cedar-cream">
      <Navbar />
      <HeroSection />
      <PersonaSelector />
      <UnitAvailability />
      <Suspense fallback={<SectionFallback />}>
        <WhyKikuyuSection />
        <PropertySpecs />
        <TrustSection />
        <TimelineSection />
        <TestimonialsSection />
        <LeadCaptureSection />
        <Footer />
        <FloatingCTA />
        <WhatsAppButton />
      </Suspense>
    </div>
  );
}
