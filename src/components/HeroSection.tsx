/*
 * HeroSection — Cedar Homes "Kenyan Earth Modernism"
 * Full-bleed hero with gradient overlay, benefit-focused headline, dual CTAs, stats bar
 */
import { motion } from "framer-motion";
import { ArrowDown, Home, Eye, ShoppingBag, MapPin, Ruler } from "lucide-react";

const HERO_IMAGE = "https://private-us-east-1.manuscdn.com/sessionFile/uY8owBdGqa0R9hrRGziEvd/sandbox/JuAC9xZ8UtXXeObEka0BWw-img-1_1771587240000_na1fn_aGVyby1lc3RhdGU.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdVk4b3dCZEdxYTBSOWhyUkd6aUV2ZC9zYW5kYm94L0p1QUM5eFo4VXRYWGVPYkVrYTBCV3ctaW1nLTFfMTc3MTU4NzI0MDAwMF9uYTFmbl9hR1Z5YnkxbGMzUmhkR1UuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=tfqWvfTlxuTIay7wHR2VjtAiTBFsOIZ1aaWcKfDRVYL98VCbyNBsmeSfYYM0pG~VYb8TuyunSxzmHLjk7ZL8KEO5FB89b7Akg8GoDfCCtcBRKWLjy5PLr7oUFJcull~oyn4RRfmL4~dUf0RzDzeziKzJ9IfWVZCTiO4tDstFidDUOGbBrxkl4ghOsJjO3hDpShW5fxQiFndNvxvitUI5fTF8e~y~mtmW6~Nt7hhqIGp2dVhm1~nQyOB3Fc81kcSi2La8dCOAUd8wYfLs5qIKbisUgCjrGnTYibhrI2RkGv3bTE5DrLDRCanAFw0qaTRUMlGqx4~XYWZzrxklcGGqTQ__";

const stats = [
  { icon: Eye, value: "1", label: "Showhouse Ready" },
  { icon: Home, value: "5", label: "Units Only Available" },
  { icon: Ruler, value: "266", label: "SQM Per Home" },
  { icon: MapPin, value: "Lusegetti", label: "Off Dagoretti Rd" },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[92vh] lg:min-h-screen overflow-hidden" aria-label="Hero">
      {/* Background image with gradient overlays */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Cedar Homes gated estate at Lusegetti, Kikuyu, Kenya"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        {/* Layered gradients for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B3A2D]/90 via-[#1B3A2D]/55 to-[#1B3A2D]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B3A2D]/70 via-transparent to-[#1B3A2D]/25" />
        {/* Subtle noise texture for depth */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
      </div>

      {/* Content */}
      <div className="relative container flex flex-col justify-center min-h-[92vh] lg:min-h-screen pt-24 pb-36 lg:pt-0 lg:pb-32">
        <div className="max-w-[620px]">
          {/* Status badge */}
          <motion.div {...fadeUp(0.15)} className="mb-8">
            <span className="inline-flex items-center gap-2.5 bg-white/[0.08] backdrop-blur-sm border border-white/[0.12] px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C4703F] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C4703F]" />
              </span>
              <span className="text-white/85 text-[13px] font-medium tracking-wide">
                Show House Ready
              </span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.3)}
            className="font-serif text-[2.5rem] sm:text-5xl lg:text-[3.6rem] text-white leading-[1.08] mb-6 tracking-tight"
          >
            Walk Through Your Future Home{" "}
            <span className="text-[#B8944F] italic">Today</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            {...fadeUp(0.45)}
            className="text-white/75 text-[17px] lg:text-lg leading-[1.7] mb-10 max-w-[540px]"
          >
            Our showhouse is complete and ready for viewing. Experience the quality first-hand,
            then secure one of only 4 remaining homes — starting from{" "}
            <span className="text-[#B8944F] font-semibold">Ksh 23.5 Million</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.6)} className="flex flex-col sm:flex-row gap-3.5">
            <a
              href="#contact"
              className="group bg-[#C4703F] text-white px-7 py-3.5 text-center font-semibold tracking-wide transition-all duration-200 hover:bg-[#B8944F] shadow-lg shadow-[#C4703F]/25 hover:shadow-xl hover:shadow-[#B8944F]/25 text-[15px] flex items-center justify-center gap-2.5"
            >
              <Eye size={17} />
              Book a Showhouse Visit
            </a>
            <a
              href="#units"
              className="border border-white/25 hover:border-white/50 text-white px-7 py-3.5 text-center font-semibold tracking-wide transition-all duration-200 backdrop-blur-sm hover:bg-white/[0.06] text-[15px] flex items-center justify-center gap-2.5"
            >
              <ShoppingBag size={17} />
              Book Your House
            </a>
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="absolute bottom-0 left-0 right-0"
      >
        <div className="container">
          <div className="bg-white/[0.07] backdrop-blur-md border-t border-white/[0.1] grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-5 py-4 lg:px-6 lg:py-5 ${
                  i < stats.length - 1 ? "border-r border-white/[0.06]" : ""
                } ${i === 1 ? "border-r-0 lg:border-r" : ""}`}
              >
                <stat.icon className="text-[#B8944F] shrink-0" size={18} strokeWidth={2} />
                <div>
                  <span className="font-serif text-xl lg:text-2xl text-white leading-none">{stat.value}</span>
                  <span className="block text-white/50 text-[10px] lg:text-[11px] tracking-wider uppercase mt-0.5">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-28 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase font-medium">Explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="text-white/30" size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
