/*
 * TrustSection — Cedar Homes "Kenyan Earth Modernism"
 * Directors, partners, due diligence checklist, and download pack
 */
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import {
  Scale, Building2, Landmark, FileCheck, Download, UserCircle,
  CheckCircle2, Award
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const KITCHEN_IMAGE = "https://private-us-east-1.manuscdn.com/sessionFile/uY8owBdGqa0R9hrRGziEvd/sandbox/JuAC9xZ8UtXXeObEka0BWw-img-5_1771587242000_na1fn_a2l0Y2hlbi1pbnRlcmlvcg.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdVk4b3dCZEdxYTBSOWhyUkd6aUV2ZC9zYW5kYm94L0p1QUM5eFo4VXRYWGVPYkVrYTBCV3ctaW1nLTVfMTc3MTU4NzI0MjAwMF9uYTFmbl9hMmwwWTJobGJpMXBiblJsY21sdmNnLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Q6IVL44eZyblh1oEIO2kVIJTkH2BBCK~yvbOZqmn4V44fbwKH1kkEN5nXg-Aj6kNfeNyGdjMLL4GWEWS38PKBI9giqq5VEdDmW5iiFGt73GXrGFcOXTQWeO6adruBXhfsgah7TDgMIa7a2yBNZzasQDCdsiveMbgDfZoZcwkzeTD6u-9afqshGIZpwjLMKZ1YONXMGbme7pwAB7hiUSlbK30ahTkzldQ2lJkN4erLoyk8Lxa1jnvS8tzv9B7exur4A8wKzH5gnTlHNvMToWnW86r2Td88HEaMSlcbLeT8wvchHSRsOd4SCDQrLVA2nB-tZXeq-O26J4NmK-x~qiurQ__";

interface Director {
  name: string;
  role: string;
  desc: string;
}

interface Partner {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const directors: Director[] = [
  {
    name: "Director 1",
    role: "Managing Director",
    desc: "Over 15 years in Kenyan real estate development with a track record of delivering premium residential projects on time.",
  },
  {
    name: "Director 2",
    role: "Technical Director",
    desc: "Registered architect with extensive experience in contemporary residential design across East Africa.",
  },
];

const partners: Partner[] = [
  { icon: Scale, title: "Legal Team", desc: "Licensed advocates handling all conveyancing, title verification, and sale agreements." },
  { icon: Building2, title: "Architects", desc: "NCA-registered architects ensuring structural integrity and modern design." },
  { icon: Landmark, title: "Banking Partners", desc: "Mortgage-ready with leading Kenyan banks for flexible financing." },
  { icon: FileCheck, title: "Land Surveyors", desc: "Registered surveyors confirming plot boundaries and freehold title." },
];

const trustSignals = [
  "Freehold title deed — verified and clean",
  "County-approved drawings",
  "NEMA approval",
  "NCA approval",
  "Architect drawings and certifications",
  "Sample sale agreement for your advocate to review",
];

export default function TrustSection() {
  const [ref, inView] = useInView({ threshold: 0.04 });

  return (
    <section id="trust" className="relative" ref={ref} aria-label="Trust and Transparency">
      {/* Full-width image band */}
      <div className="relative h-56 lg:h-72 overflow-hidden">
        <img
          src={KITCHEN_IMAGE}
          alt="Cedar Homes premium fitted kitchen interior"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-cedar-forest/75" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="text-cedar-gold font-semibold text-[12px] tracking-[0.18em] uppercase mb-3 block">
                Radical Transparency
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] text-white leading-tight max-w-xl">
                Built on Trust,{" "}
                <span className="text-cedar-gold">Backed by Evidence</span>
              </h2>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="bg-white py-20 lg:py-28">
        <div className="container">
          {/* Directors */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-20"
          >
            <h3 className="font-serif text-2xl lg:text-[1.75rem] text-cedar-forest mb-2 flex items-center gap-3">
              <span className="w-5 h-[2px] bg-cedar-gold" />
              Meet the Directors
            </h3>
            <p className="text-cedar-warm-gray text-[15px] max-w-lg mb-8 leading-relaxed">
              Real people, real accountability. The leadership behind Cedar Homes brings decades of combined
              experience in Kenyan real estate.
            </p>

            <div className="grid md:grid-cols-2 gap-5">
              {directors.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.2 + i * 0.1 }}
                  className="flex gap-5 p-5 lg:p-6 bg-cedar-cream/40 border border-cedar-gold/[0.08] hover:border-cedar-gold/20 transition-colors duration-200 group"
                >
                  <div className="w-14 h-14 bg-cedar-forest/[0.06] flex items-center justify-center shrink-0 group-hover:bg-cedar-forest/[0.1] transition-colors duration-200">
                    <UserCircle size={28} className="text-cedar-forest" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-cedar-charcoal text-[15px]">{d.name}</h4>
                    <span className="text-cedar-terracotta text-[13px] font-medium">{d.role}</span>
                    <p className="text-cedar-warm-gray text-[13px] mt-2 leading-relaxed">{d.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Partners */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-20"
          >
            <h3 className="font-serif text-2xl lg:text-[1.75rem] text-cedar-forest mb-2 flex items-center gap-3">
              <span className="w-5 h-[2px] bg-cedar-gold" />
              Professional Partners
            </h3>
            <p className="text-cedar-warm-gray text-[15px] max-w-lg mb-8">
              Every aspect of Cedar Homes is handled by licensed, vetted professionals.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {partners.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.35 + i * 0.07 }}
                  className="p-5 bg-cedar-cream/30 border border-cedar-forest/[0.04] hover:border-cedar-terracotta/15 transition-all duration-200 group text-center"
                >
                  <div className="w-12 h-12 mx-auto bg-cedar-forest/[0.05] flex items-center justify-center mb-3 group-hover:bg-cedar-terracotta/[0.08] transition-colors duration-200">
                    <p.icon size={22} className="text-cedar-forest group-hover:text-cedar-terracotta transition-colors duration-200" strokeWidth={1.8} />
                  </div>
                  <h4 className="font-sans font-bold text-cedar-charcoal text-[13px] mb-1.5">{p.title}</h4>
                  <p className="text-cedar-warm-gray text-[12px] leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Due Diligence */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-start"
          >
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3 mb-4">
                <Award size={20} className="text-cedar-gold" />
                <h3 className="font-serif text-xl lg:text-2xl text-cedar-forest">Due Diligence Checklist</h3>
              </div>
              <p className="text-cedar-warm-gray text-[15px] mb-8 max-w-md leading-relaxed">
                We believe in radical transparency. Every document you need to make an informed decision
                is available for your review.
              </p>

              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                {trustSignals.map((signal, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.35, delay: 0.55 + i * 0.06 }}
                    className="flex items-start gap-2.5 py-2"
                  >
                    <CheckCircle2 size={15} className="text-cedar-forest mt-0.5 shrink-0" />
                    <span className="text-cedar-charcoal text-[13px] leading-relaxed">{signal}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-cedar-forest p-7 lg:p-8 text-center relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-cedar-gold/[0.06] rounded-full" />
                <div className="relative">
                  <Download size={36} className="text-cedar-gold mx-auto mb-4" strokeWidth={1.5} />
                  <h4 className="font-serif text-xl text-white mb-2">Due Diligence Pack</h4>
                  <p className="text-white/60 text-[13px] mb-6 leading-relaxed max-w-xs mx-auto">
                    Download our comprehensive pack containing sample sale agreements,
                    title deed proofs, architect certifications, and project financials.
                  </p>
                  <a
                    href="#contact"
                    className="inline-block bg-cedar-terracotta hover:bg-cedar-terracotta-light text-white px-6 py-3 font-semibold tracking-wide transition-colors duration-200 w-full text-[13px]"
                  >
                    Download Due Diligence Pack
                  </a>
                  <p className="text-white/30 text-[11px] mt-3">Free — No obligation required</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
