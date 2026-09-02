/*
 * UnitAvailability — Cedar Homes "Kenyan Earth Modernism"
 * Showhouse feature card.
 */
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useInView } from "@/hooks/useInView";
import { Eye, CheckCircle2, Home } from "lucide-react";

const KITCHEN_IMAGE = "https://private-us-east-1.manuscdn.com/sessionFile/uY8owBdGqa0R9hrRGziEvd/sandbox/JuAC9xZ8UtXXeObEka0BWw-img-5_1771587242000_na1fn_a2l0Y2hlbi1pbnRlcmlvcg.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdVk4b3dCZEdxYTBSOWhyUkd6aUV2ZC9zYW5kYm94L0p1QUM5eFo4VXRYWGVPYkVrYTBCV3ctaW1nLTVfMTc3MTU4NzI0MjAwMF9uYTFmbl9hMmwwWTJobGJpMXBiblJsY21sdmNnLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Q6IVL44eZyblh1oEIO2kVIJTkH2BBCK~yvbOZqmn4V44fbwKH1kkEN5nXg-Aj6kNfeNyGdjMLL4GWEWS38PKBI9giqq5VEdDmW5iiFGt73GXrGFcOXTQWeO6adruBXhfsgah7TDgMIa7a2yBNZzasQDCdsiveMbgDfZoZcwkzeTD6u-9afqshGIZpwjLMKZ1YONXMGbme7pwAB7hiUSlbK30ahTkzldQ2lJkN4erLoyk8Lxa1jnvS8tzv9B7exur4A8wKzH5gnTlHNvMToWnW86r2Td88HEaMSlcbLeT8wvchHSRsOd4SCDQrLVA2nB-tZXeq-O26J4NmK-x~qiurQ__";


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
            Unit Availability
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] text-cedar-forest leading-tight mb-4">
            See It. Love It.{" "}
            <span className="text-cedar-terracotta">Secure It.</span>
          </h2>
          <p className="text-cedar-warm-gray text-[16px] leading-relaxed">
            Unit 1 is our completed showhouse — walk through, touch the finishes, feel the space.
            Then pre-order your own unit at today's price.
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
                alt="Cedar Homes showhouse interior — premium kitchen finishes"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="bg-cedar-forest text-white text-[11px] font-bold px-3.5 py-1.5 uppercase tracking-wider inline-flex items-center gap-1.5 shadow-lg">
                  <Eye size={11} />
                  Showhouse — Unit 1
                </span>
              </div>
              <div className="absolute bottom-5 left-5">
                <span className="bg-white/90 backdrop-blur-sm text-cedar-forest text-[13px] font-bold px-4 py-2 shadow-lg">
                  Ksh 23.8M
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
                Don't Just Imagine It — Experience It
              </h3>
              <p className="text-cedar-warm-gray text-[15px] leading-relaxed mb-6">
                Walk through every room, inspect the premium finishes, and feel the spacious 266 SQM layout.
                This is the exact standard every pre-order unit will be built to.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {["Fully finished", "Landscaped garden", "Premium fittings", "Move-in ready"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cedar-forest shrink-0" />
                    <span className="text-[13px] text-cedar-charcoal">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <a
                  href="#contact"
                  className="bg-cedar-forest hover:bg-cedar-forest-light text-white px-5 py-2.5 text-[13px] font-semibold tracking-wide transition-colors text-center inline-flex items-center justify-center gap-2"
                >
                  <Eye size={14} />
                  Book a Visit
                </a>
                <a
                  href="#contact"
                  className="border border-cedar-forest/15 text-cedar-forest hover:bg-cedar-forest/[0.04] px-5 py-2.5 text-[13px] font-semibold tracking-wide transition-colors text-center inline-flex items-center justify-center gap-2"
                >
                  <Home size={14} />
                  Buy Showhouse
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pre-order units header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <ShoppingBag size={16} className="text-cedar-terracotta" />
            <h3 className="font-serif text-xl text-cedar-forest">Pre-Order Units 2–5</h3>
            <div className="flex-1 h-px bg-cedar-forest/[0.08]" />
          </div>
          <p className="text-cedar-warm-gray text-[15px] max-w-xl">
            Every pre-order unit is built to the exact same specification as the showhouse.
            Lock in today's price and choose your preferred delivery window.
          </p>
        </motion.div>

        {/* Pre-order cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {units.filter(u => u.status !== "showhouse").map((unit, i) => (
            <motion.div
              key={unit.number}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.4 + i * 0.08 }}
              className="group border border-cedar-terracotta/[0.12] hover:border-cedar-terracotta/30 transition-all duration-300 hover:shadow-lg hover:shadow-cedar-terracotta/[0.06] bg-white"
            >
              {/* Unit image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={EXTERIOR_IMAGE}
                  alt={`Cedar Homes Unit ${unit.number}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="bg-cedar-terracotta/90 text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider backdrop-blur-sm">
                    Pre-Order
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="font-serif text-2xl text-white drop-shadow-lg">0{unit.number}</span>
                </div>
              </div>

              {/* Details */}
              <div className="p-5">
                <div className="space-y-2.5 mb-4">
                  {[
                    { label: "Price", value: unit.price },
                    { label: "Delivery", value: unit.delivery },
                    { label: "Deposit", value: "Ksh 500K" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-[13px]">
                      <span className="text-cedar-warm-gray">{row.label}</span>
                      <span className="text-cedar-charcoal font-semibold">{row.value}</span>
                    </div>
                  ))}
                </div>

                {unit.highlight && (
                  <div className="bg-cedar-gold/[0.08] text-cedar-gold-dark text-[11px] font-semibold px-3 py-1.5 text-center mb-4 tracking-wide uppercase">
                    {unit.highlight}
                  </div>
                )}

                <a
                  href="#contact"
                  className="flex items-center justify-center gap-2 bg-cedar-terracotta/[0.07] hover:bg-cedar-terracotta text-cedar-terracotta hover:text-white text-center py-2.5 text-[13px] font-semibold transition-all duration-200 tracking-wide group/btn"
                >
                  Pre-Order Unit {unit.number}
                  <ArrowRight size={13} className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-10 text-center text-cedar-warm-gray text-[13px] max-w-2xl mx-auto"
        >
          All units are 4-bedroom en-suite maisonettes on 1/8 acre plots with freehold title.
          Prices are subject to change — pre-order now to lock in current rates.
        </motion.p>
      </div>
    </section>
  );
}
