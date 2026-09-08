/*
 * UnitAvailability — Cedar Homes "Kenyan Earth Modernism"
 * Showhouse feature card.
 */
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useInView } from "@/hooks/useInView";
import { Eye, CheckCircle2, Home } from "lucide-react";

import streetRender from "@/assets/cedar-render-street.jpg.asset.json";

const KITCHEN_IMAGE = streetRender.url;


export default function UnitAvailability() {
  const [ref, inView] = useInView({ threshold: 0.08 });

  return (
    <section id="units" ref={ref} className="bg-white py-20 lg:py-28" aria-label="Unit Availability">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-cedar-terracotta font-semibold text-[12px] tracking-[0.18em] uppercase mb-4 block">
            Availability
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] text-cedar-forest leading-tight mb-4">
            Visit the{" "}
            <span className="text-cedar-terracotta">show house</span>
          </h2>
          <p className="text-cedar-warm-gray text-[16px] leading-relaxed">
            The show house is complete and open daily. Four of the five homes are still
            available.
          </p>
          <div className="w-14 h-[2px] bg-cedar-gold mx-auto mt-6" />
        </motion.div>

        {/* Showhouse feature card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-16"
        >
          <div className="grid lg:grid-cols-5 gap-0 overflow-hidden shadow-xl shadow-cedar-forest/[0.06] border border-cedar-forest/[0.06]">
            {/* Image — 3 cols */}
            <div className="relative lg:col-span-3 h-72 lg:h-auto min-h-[320px]">
              <img
                src={KITCHEN_IMAGE}
                alt="Cedar Homes maisonettes seen from the internal driveway"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="bg-cedar-forest text-white text-[11px] font-bold px-3.5 py-1.5 uppercase tracking-wider inline-flex items-center gap-1.5 shadow-lg">
                  <Eye size={11} />
                  Show House
                </span>
              </div>
              <div className="absolute bottom-5 left-5">
                <span className="bg-white/90 backdrop-blur-sm text-cedar-forest text-[13px] font-bold px-4 py-2 shadow-lg">
                  Starting from Ksh 23.5M
                </span>
              </div>
            </div>

            {/* Content — 2 cols */}
            <div className="lg:col-span-2 bg-cedar-cream p-8 lg:p-10 flex flex-col justify-center">
              <span className="text-cedar-forest font-bold text-[11px] uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                <span className="w-5 h-[2px] bg-cedar-forest" />
                Ready for Viewing
              </span>
              <h3 className="font-serif text-2xl lg:text-[1.75rem] text-cedar-forest mb-4 leading-snug">
                See the Finished Home
              </h3>
              <p className="text-cedar-warm-gray text-[15px] leading-relaxed mb-6">
                Walk through every room and get a feel for the 266 sqm layout and the private
                garden. This is the standard every home is built to.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {["Freehold title", "Private garden", "4 bedrooms en-suite", "DSQ"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cedar-forest shrink-0" />
                    <span className="text-[13px] text-cedar-charcoal">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <Link
                  to="/book-a-visit"
                  className="bg-cedar-forest hover:bg-cedar-forest-light text-white px-5 py-2.5 text-[13px] font-semibold tracking-wide transition-colors text-center inline-flex items-center justify-center gap-2"
                >
                  <Eye size={14} />
                  Book a Visit
                </Link>
                <a
                  href="#contact"
                  className="border border-cedar-forest/15 text-cedar-forest hover:bg-cedar-forest/[0.04] px-5 py-2.5 text-[13px] font-semibold tracking-wide transition-colors text-center inline-flex items-center justify-center gap-2"
                >
                  <Home size={14} />
                  Book Your House
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-cedar-warm-gray text-[13px] max-w-2xl mx-auto"
        >
          All homes are 4-bedroom en-suite maisonettes on plots of approximately 1/8 acre, each with its own freehold title,
          built to the same standard as the show house.
        </motion.p>
      </div>
    </section>
  );
}
