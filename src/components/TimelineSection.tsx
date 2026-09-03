/*
 * TimelineSection — Cedar Homes "Kenyan Earth Modernism"
 * Countdown banner + vertical timeline with unit status
 */
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { CheckCircle2, Clock, HardHat, Hammer, PaintBucket, Key, Eye } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const GARDEN_IMAGE = "https://private-us-east-1.manuscdn.com/sessionFile/uY8owBdGqa0R9hrRGziEvd/sandbox/JuAC9xZ8UtXXeObEka0BWw-img-4_1771587232000_na1fn_Z2FyZGVuLWFlcmlhbA.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdVk4b3dCZEdxYTBSOWhyUkd6aUV2ZC9zYW5kYm94L0p1QUM5eFo4VXRYWGVPYkVrYTBCV3ctaW1nLTRfMTc3MTU4NzIzMjAwMF9uYTFmbl9aMkZ5WkdWdUxXRmxjbWxoYkEuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=VQzE6GA9hP6v4H0YtiVK1jezrJVQEw6sELLZHMT9d0HJqXta~A9L45Zy6TozamxVjPGZepiedgubLALDWSspUeQ5LIDSbpdJ-AlBdr-SKZnhIhsLgCq8UH86uxc0yfKIT8ejgUUo3BRNU0UeYhej0OImzyYyGSW-paN5qlkMYI~4TvVomvpqb9n3h6JSaSKhyY5QGMB02WXr9ulgZ-4som1Wz6C1TxjiHKFDbcWPDixjokyo2BsUJ-cKFCiLVuhHAa2GwC~e3rEFl9jriKZSWHj~Ia4Fab52ouHehGUBpOcsIeFbkGqNEjpGVtKC6dnFI-ZSIzD1SIHGPbsGM2GZUw__";

interface Milestone {
  icon: LucideIcon;
  date: string;
  title: string;
  desc: string;
  status: "complete" | "upcoming";
  unitLabel: string;
}

const milestones: Milestone[] = [
  {
    icon: Eye,
    date: "Now",
    title: "Unit 1 — Showhouse Complete",
    desc: "Fully finished and open for viewing. Walk through every room and experience the quality first-hand.",
    status: "complete",
    unitLabel: "Unit 1",
  },
  {
    icon: HardHat,
    date: "Q3 2026",
    title: "Units 2 & 3 — Foundation & Structure",
    desc: "Construction begins on Units 2 and 3 upon booking confirmation. Foundation, columns, and beams.",
    status: "upcoming",
    unitLabel: "Units 2–3",
  },
  {
    icon: Hammer,
    date: "Q1 2027",
    title: "Units 2 & 3 — Walling, Roofing & Finishes",
    desc: "Block work, roofing, interior finishes, and handover of Units 2 and 3 to owners.",
    status: "upcoming",
    unitLabel: "Units 2–3",
  },
  {
    icon: PaintBucket,
    date: "Q2 2027",
    title: "Units 4 & 5 — Construction & Completion",
    desc: "Full construction cycle for Units 4 and 5, from foundation to handover with premium finishes.",
    status: "upcoming",
    unitLabel: "Units 4–5",
  },
  {
    icon: Key,
    date: "Q3 2027",
    title: "Full Estate Completion",
    desc: "All 5 homes complete, with the perimeter wall, gated compound and communal landscaping finished.",
    status: "upcoming",
    unitLabel: "All Units",
  },
];

function CountdownBanner() {
  const target = useMemo(() => new Date("2027-09-01T00:00:00+03:00").getTime(), []);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, target - Date.now());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [target]);

  const segments = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  return (
    <div className="flex gap-2.5 sm:gap-3" aria-label="Countdown to estate completion">
      {segments.map((s, i) => (
        <div key={i} className="text-center">
          <div className="bg-cedar-forest/80 backdrop-blur-sm w-14 h-14 sm:w-[4.5rem] sm:h-[4.5rem] flex items-center justify-center border border-cedar-gold/10">
            <span className="font-serif text-xl sm:text-2xl text-cedar-gold tabular-nums">
              {String(s.value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-wider mt-1.5 block font-medium">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

const unitStatuses = [
  { unit: "Unit 1", status: "Showhouse", active: true },
  { unit: "Unit 2", status: "Available", active: false },
  { unit: "Unit 3", status: "Available", active: false },
  { unit: "Unit 4", status: "Available", active: false },
  { unit: "Unit 5", status: "Available", active: false },
];

export default function TimelineSection() {
  const [ref, inView] = useInView({ threshold: 0.04 });

  return (
    <section id="timeline" ref={ref} className="relative" aria-label="Construction Timeline">
      {/* Background image band */}
      <div className="relative h-64 lg:h-80 overflow-hidden">
        <img
          src={GARDEN_IMAGE}
          alt="Cedar Homes aerial view of gated community"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cedar-forest/80 to-cedar-forest/90" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="text-cedar-gold font-semibold text-[12px] tracking-[0.18em] uppercase mb-3 block">
                Development Timeline
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] text-white leading-tight mb-3 max-w-xl">
                Showhouse Ready.{" "}
                <span className="text-cedar-gold">Remaining Homes Building.</span>
              </h2>
              <p className="text-white/60 text-[15px] mb-6 max-w-md">
                Full estate completion by Q3 2027. Pre-order now to secure your preferred unit.
              </p>
              <CountdownBanner />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Timeline content */}
      <div className="bg-cedar-cream py-20 lg:py-28">
        <div className="container">
          {/* Unit status pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap justify-center gap-2 mb-14 max-w-3xl mx-auto"
          >
            {unitStatuses.map((u, i) => (
              <div
                key={i}
                className={`px-4 py-2.5 text-center text-[11px] font-bold uppercase tracking-wider ${
                  u.active
                    ? "bg-cedar-forest text-white"
                    : "bg-cedar-terracotta/[0.08] text-cedar-terracotta border border-cedar-terracotta/15"
                }`}
              >
                <span className="font-serif text-base normal-case block leading-tight">{u.unit}</span>
                {u.status}
              </div>
            ))}
          </motion.div>

          {/* Vertical timeline */}
          <div className="max-w-2xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-5 lg:left-6 top-0 bottom-0 w-[1.5px] bg-cedar-forest/[0.08]" />
            <motion.div
              initial={{ height: 0 }}
              animate={inView ? { height: "20%" } : {}}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="absolute left-5 lg:left-6 top-0 w-[1.5px] bg-cedar-forest origin-top"
            />

            <div className="space-y-10">
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.3 + i * 0.12 }}
                  className="relative pl-14 lg:pl-16"
                >
                  {/* Node */}
                  <div
                    className={`absolute left-0 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center ${
                      m.status === "complete"
                        ? "bg-cedar-forest"
                        : "bg-cedar-forest/[0.07]"
                    }`}
                  >
                    {m.status === "complete" ? (
                      <CheckCircle2 size={18} className="text-white" />
                    ) : (
                      <Clock size={18} className="text-cedar-warm-gray" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`p-5 lg:p-6 ${
                    m.status === "complete"
                      ? "bg-white border-l-[3px] border-cedar-forest shadow-sm"
                      : "bg-white/60"
                  }`}>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-[11px] font-bold tracking-wider uppercase ${
                        m.status === "complete" ? "text-cedar-forest" : "text-cedar-warm-gray"
                      }`}>
                        {m.date}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${
                        m.status === "complete"
                          ? "bg-cedar-forest/[0.08] text-cedar-forest"
                          : "bg-cedar-terracotta/[0.08] text-cedar-terracotta"
                      }`}>
                        {m.unitLabel}
                      </span>
                      {m.status === "complete" && (
                        <span className="bg-cedar-gold/10 text-cedar-gold-dark text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                          Complete
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-base lg:text-lg text-cedar-charcoal mb-1">{m.title}</h4>
                    <p className="text-cedar-warm-gray text-[13px] leading-relaxed">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
