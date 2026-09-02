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

const title = "Cedar Homes Lusegetti — Modern 4-Bedroom Homes";
const description =
  "Five modern 4-bedroom family homes at Lusegetti, Kikuyu. Tour the completed show house and book one of the remaining homes from Ksh 23.5M.";

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
