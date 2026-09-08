/*
 * WhyKikuyuSection — Cedar Homes "Kenyan Earth Modernism"
 * Split audience: Local Families (left) vs Diaspora Investors (right)
 */
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import {
  TreePine, GraduationCap, Home, FileCheck, Users, Briefcase,
  Leaf, ShieldCheck, Car
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import facadeRender from "@/assets/cedar-render-facade.jpg.asset.json";
import gardenRender from "@/assets/cedar-render-garden.jpg.asset.json";

const EXTERIOR_IMAGE = facadeRender.url;

const LIVING_IMAGE = gardenRender.url;

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const familyFeatures: Feature[] = [
  { icon: TreePine, title: "Spacious Private Gardens", desc: "Lush garden space — perfect for children, pets, or outdoor gatherings." },
  { icon: GraduationCap, title: "Top-Tier Schools", desc: "Easy access to premier schools in Karen, Kikuyu, and Ngong." },
  { icon: Home, title: "From Renting to Owning", desc: "Stop paying KES 150k rent. Build equity in a home with freehold title." },
  { icon: Leaf, title: "Green Living", desc: "Two-thirds of the development is landscaped green areas and mature trees." },
  { icon: ShieldCheck, title: "Secure & Gated", desc: "Controlled access, private parking, and a secure perimeter wall." },
  { icon: Car, title: "City Accessibility", desc: "Minutes from Waiyaki Way and the Southern Bypass to Nairobi CBD." },
];

const investorFeatures: Feature[] = [
  { icon: FileCheck, title: "Freehold Title, In Your Name", desc: "Each home has its own freehold title deed — not a share, not a lease." },
  { icon: TreePine, title: "Land and a Private Garden", desc: "You own the plot and the garden around your home, not just the walls." },
  { icon: Users, title: "Steady Family Demand", desc: "Kikuyu families consistently look for standalone homes in secure, gated compounds." },
  { icon: Briefcase, title: "Managed From Anywhere", desc: "GAP Developers can handle letting and upkeep while you are abroad." },
];

function FeatureItem({ feature, delay, inView }: { feature: Feature; delay: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay }}
      className="group flex items-start gap-3"
    >
      <div className="w-9 h-9 bg-cedar-forest/[0.05] flex items-center justify-center shrink-0 group-hover:bg-cedar-forest/[0.1] transition-colors duration-200">
        <feature.icon size={16} className="text-cedar-forest" />
      </div>
      <div>
        <h4 className="font-sans font-semibold text-cedar-charcoal text-[13px] mb-0.5">{feature.title}</h4>
        <p className="text-cedar-warm-gray text-[12px] leading-relaxed">{feature.desc}</p>
      </div>
    </motion.div>
  );
}

export default function WhyKikuyuSection() {
  const [ref, inView] = useInView({ threshold: 0.08 });

  return (
    <section id="why-kikuyu" className="relative" aria-label="Why Lusegetti">
      {/* Diagonal divider */}
      <div className="relative -mt-px">
        <svg viewBox="0 0 1440 60" className="w-full block" preserveAspectRatio="none">
          <path d="M0,60 L1440,0 L1440,60 L0,60 Z" fill="oklch(0.97 0.01 80)" />
        </svg>
      </div>

      <div className="bg-cedar-cream py-20 lg:py-28" ref={ref}>
        {/* Section header */}
        <div className="container mb-14 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-cedar-terracotta font-semibold text-[12px] tracking-[0.18em] uppercase mb-4 block">
              Why Lusegetti
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] text-cedar-forest leading-tight mb-5">
              Whether You're Building a Home{" "}
              <span className="text-cedar-terracotta">or a Portfolio</span>
            </h2>
            <div className="w-14 h-[2px] bg-cedar-gold" />
          </motion.div>
        </div>

        {/* Two-column split */}
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-0">
            {/* Left: For Local Families */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:pr-12 lg:border-r border-cedar-gold/15"
            >
              <div className="relative mb-8 overflow-hidden group">
                <img
                  src={EXTERIOR_IMAGE}
                  alt="Cedar Homes exterior with private garden"
                  className="w-full h-56 lg:h-72 object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-cedar-forest/90 backdrop-blur-sm text-white px-3.5 py-1.5 text-[12px] font-semibold tracking-wide">
                    For Local Families
                  </span>
                </div>
              </div>

              <h3 className="font-serif text-[1.5rem] text-cedar-forest mb-2">
                Your Dream Home Awaits
              </h3>
              <p className="text-cedar-warm-gray text-[15px] mb-8 leading-relaxed max-w-md">
                Cedar Homes is designed for families who value space, privacy, and a connection to nature —
                all within reach of Nairobi's best amenities.
              </p>

              <div className="grid sm:grid-cols-2 gap-5">
                {familyFeatures.map((f, i) => (
                  <FeatureItem key={i} feature={f} delay={0.25 + i * 0.06} inView={inView} />
                ))}
              </div>
            </motion.div>

            {/* Right: For Diaspora Investors */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:pl-12"
            >
              <div className="relative mb-8 overflow-hidden group">
                <img
                  src={LIVING_IMAGE}
                  alt="Cedar Homes luxury interior living room"
                  className="w-full h-56 lg:h-72 object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-cedar-terracotta/90 backdrop-blur-sm text-white px-3.5 py-1.5 text-[12px] font-semibold tracking-wide">
                    For Diaspora Investors
                  </span>
                </div>
              </div>

              <h3 className="font-serif text-[1.5rem] text-cedar-forest mb-2">
                Smart Investment, Proven Returns
              </h3>
              <p className="text-cedar-warm-gray text-[15px] mb-8 leading-relaxed max-w-md">
                Lusegetti, Kikuyu is one of Nairobi's fastest-growing suburbs. Cedar Homes offers a rare opportunity
                to own freehold property with proven rental demand.
              </p>

              <div className="space-y-5 mb-10">
                {investorFeatures.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.4 + i * 0.08 }}
                    className="group flex items-start gap-4"
                  >
                    <div className="w-11 h-11 bg-cedar-terracotta/[0.08] flex items-center justify-center shrink-0 group-hover:bg-cedar-terracotta/[0.14] transition-colors duration-200">
                      <f.icon size={18} className="text-cedar-terracotta" />
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-cedar-charcoal text-[14px] mb-0.5">{f.title}</h4>
                      <p className="text-cedar-warm-gray text-[13px] leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ROI highlight */}
              <div className="bg-cedar-forest p-7 lg:p-8 relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-28 h-28 bg-cedar-gold/[0.08] rounded-full" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-cedar-gold/[0.05] rounded-full" />
                <div className="relative">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-serif text-[3rem] text-cedar-gold leading-none">9%</span>
                    <span className="text-white/70 text-base font-medium">Projected Rental Yield</span>
                  </div>
                  <p className="text-white/50 text-[13px] leading-relaxed max-w-sm">
                    Based on current local rental market data, Southern Bypass corridor demand,
                    and comparable property performance in the area.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
