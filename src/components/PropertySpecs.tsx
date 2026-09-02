/*
 * PropertySpecs — Cedar Homes "Kenyan Earth Modernism"
 * Spec grid + room list + pricing card
 */
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useInView } from "@/hooks/useInView";
import {
  Maximize2, BedDouble, Bath, Car, Layers, TreePine,
  Zap, Lock
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Spec {
  icon: LucideIcon;
  label: string;
  value: string;
}

const specs: Spec[] = [
  { icon: Maximize2, label: "Built-Up Area", value: "266.7 SQM" },
  { icon: BedDouble, label: "Bedrooms", value: "4 All En-Suite" },
  { icon: Bath, label: "Bathrooms", value: "4 + Guest WC" },
  { icon: Car, label: "Parking", value: "Parking for 2" },
  { icon: Layers, label: "Floors", value: "2 Storeys" },
  { icon: TreePine, label: "Plot Size", value: "1/8 Acre" },
  { icon: Zap, label: "Power", value: "KPLC + Solar Ready" },
  { icon: Lock, label: "Security", value: "Gated Community" },
];

const rooms = [
  "Open-plan living & dining",
  "Fitted kitchen with pantry",
  "Master bedroom with walk-in closet",
  "Family room / TV lounge upstairs",
  "Separate laundry area",
  "DSQ with its own bathroom",
  "Private garden per home",
];


export default function PropertySpecs() {
  const [ref, inView] = useInView({ threshold: 0.08 });

  return (
    <section id="specs" ref={ref} className="bg-white py-20 lg:py-28" aria-label="Property Specifications">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-xl mx-auto mb-14"
        >
          <span className="text-cedar-terracotta font-semibold text-[12px] tracking-[0.18em] uppercase mb-4 block">
            Property Details
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] text-cedar-forest leading-tight mb-4">
            Every Detail, <span className="text-cedar-terracotta">Considered</span>
          </h2>
          <p className="text-cedar-warm-gray text-[15px] leading-relaxed">
            Each of the five maisonettes is designed for spacious, modern living with premium finishes throughout.
          </p>
          <div className="w-14 h-[2px] bg-cedar-gold mx-auto mt-6" />
        </motion.div>

        {/* Specs grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-16">
          {specs.map((spec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: 0.08 + i * 0.04 }}
              className="bg-cedar-cream/40 border border-cedar-gold/[0.08] p-4 lg:p-5 text-center group hover:border-cedar-terracotta/15 hover:bg-cedar-cream/60 transition-all duration-200"
            >
              <spec.icon
                size={20}
                className="text-cedar-forest mx-auto mb-2.5 group-hover:text-cedar-terracotta transition-colors duration-200"
                strokeWidth={1.8}
              />
              <span className="font-serif text-base lg:text-lg text-cedar-charcoal block leading-tight">{spec.value}</span>
              <span className="text-cedar-warm-gray text-[10px] uppercase tracking-wider mt-0.5 block">{spec.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Room list + Price card */}
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-start">
          {/* Room list — 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <h3 className="font-serif text-xl text-cedar-forest mb-6 flex items-center gap-3">
              <span className="w-5 h-[2px] bg-cedar-gold" />
              What's Included
            </h3>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {rooms.map((room, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.35 + i * 0.04 }}
                  className="flex items-center gap-3 py-2 border-b border-cedar-forest/[0.04] last:border-0"
                >
                  <div className="w-1.5 h-1.5 bg-cedar-terracotta shrink-0" />
                  <span className="text-cedar-charcoal text-[14px]">{room}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pricing card — 2 cols */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-cedar-cream border border-cedar-gold/15 p-7 lg:p-8">
              <span className="text-cedar-warm-gray text-[11px] uppercase tracking-[0.15em] font-semibold block mb-2">
                Starting From
              </span>
              <span className="font-serif text-[2.5rem] lg:text-[2.75rem] text-cedar-forest block leading-none mb-1">
                Ksh 23.5M
              </span>
              <span className="text-cedar-warm-gray text-[13px] block mb-6">
                Flexible payment schedule available
              </span>

              <div className="w-10 h-[1px] bg-cedar-gold mb-6" />

              <div className="space-y-3">
                {[
                  { label: "Cash Price", value: "Ksh 23.5M" },
                  { label: "Title Type", value: "Freehold" },
                  { label: "Show House", value: "Ksh 23.8M" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-[13px]">
                    <span className="text-cedar-warm-gray">{row.label}</span>
                    <span className="text-cedar-charcoal font-semibold">{row.value}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/payment-plans"
                className="block bg-cedar-terracotta hover:bg-cedar-terracotta-dark text-white px-6 py-3 font-semibold tracking-wide transition-colors duration-200 w-full text-[13px] text-center mt-8"
              >
                View Flexible Payment Schedule
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
