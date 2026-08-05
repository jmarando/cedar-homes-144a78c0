/*
 * PersonaSelector — routes each buyer type to the page that answers their
 * actual question, instead of funnelling everyone into one generic form.
 */
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Home, TrendingUp, Globe2, Coins } from "lucide-react";

import { useInView } from "@/hooks/useInView";
import { trackEvent } from "@/lib/analytics";

const personas = [
  {
    id: "family",
    icon: Home,
    label: "A home for my family",
    blurb: "Space, a garden and a short school run. See the finished house before you decide.",
    cta: "Book a showhouse visit",
    to: "/book-a-visit" as const,
  },
  {
    id: "local-investor",
    icon: TrendingUp,
    label: "An investment in Kenya",
    blurb: "Appreciation drivers, rental demand and clean title — the brief investors ask for.",
    cta: "Get the investment brief",
    to: "/investment" as const,
  },
  {
    id: "diaspora-first-time",
    icon: Globe2,
    label: "My first home, from abroad",
    blurb: "A live walkthrough plus the documents that let you verify us from anywhere.",
    cta: "Schedule a virtual tour",
    to: "/virtual-tour" as const,
  },
  {
    id: "diaspora-investor",
    icon: Coins,
    label: "Rental income while I'm away",
    blurb: "Model yield, appreciation and total return with your own assumptions.",
    cta: "Run the ROI numbers",
    to: "/roi-calculator" as const,
  },
];

export default function PersonaSelector() {
  const [ref, inView] = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} id="personas" className="bg-cedar-cream py-20 lg:py-24" aria-label="Choose your path">
      <div className="container">
        <div className="max-w-2xl mb-12">
          <span className="text-cedar-terracotta font-semibold text-[12px] tracking-[0.18em] uppercase mb-4 block">
            Start Here
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-cedar-forest leading-tight mb-4">
            What brings you to <span className="text-cedar-terracotta italic">Cedar Homes?</span>
          </h2>
          <p className="text-cedar-charcoal/65 text-[16px] leading-relaxed">
            Buyers arrive with very different questions. Pick the one closest to yours and we'll
            take you straight to the answer.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {personas.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Link
                to={p.to}
                onClick={() => trackEvent("persona_selected", { persona: p.id })}
                className="group h-full flex flex-col bg-white border border-cedar-forest/10 p-7 hover:border-cedar-terracotta/40 hover:shadow-lg hover:shadow-cedar-forest/5 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-cedar-terracotta/10 flex items-center justify-center mb-5 group-hover:bg-cedar-terracotta transition-colors">
                  <p.icon size={18} className="text-cedar-terracotta group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-serif text-lg text-cedar-forest mb-2.5 leading-snug">{p.label}</h3>
                <p className="text-cedar-charcoal/60 text-[13px] leading-relaxed mb-6">{p.blurb}</p>
                <span className="mt-auto inline-flex items-center gap-2 text-cedar-terracotta text-[13px] font-semibold">
                  {p.cta}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
