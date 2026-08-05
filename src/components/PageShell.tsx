/*
 * PageShell — shared chrome for the secondary content pages.
 */
import { lazy, Suspense, type ReactNode } from "react";

import Navbar from "@/components/Navbar";

const Footer = lazy(() => import("@/components/Footer"));
const WhatsAppButton = lazy(() => import("@/components/WhatsAppButton"));

interface PageShellProps {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  children: ReactNode;
}

export default function PageShell({ eyebrow, title, intro, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-cedar-cream">
      <Navbar />

      <header className="bg-cedar-forest pt-16 pb-20 lg:pt-20 lg:pb-24">
        <div className="container max-w-3xl">
          <span className="text-cedar-gold font-semibold text-[12px] tracking-[0.18em] uppercase mb-4 block">
            {eyebrow}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[3rem] text-white leading-[1.12] mb-5">
            {title}
          </h1>
          <p className="text-white/60 text-[16px] lg:text-[17px] leading-relaxed">{intro}</p>
        </div>
      </header>

      <main className="py-16 lg:py-20">{children}</main>

      <Suspense fallback={<div className="min-h-[200px]" />}>
        <Footer />
        <WhatsAppButton />
      </Suspense>
    </div>
  );
}
