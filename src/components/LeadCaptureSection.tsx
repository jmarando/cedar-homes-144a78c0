/*
 * LeadCaptureSection — Cedar Homes "Kenyan Earth Modernism"
 * Value propositions plus the real, database-backed lead form.
 */
import { motion } from "framer-motion";
import { CheckCircle2, Eye, ShoppingBag, Video } from "lucide-react";

import { useInView } from "@/hooks/useInView";
import LeadForm from "@/components/LeadForm";
import { PRICING } from "@/lib/site-config";

const valueProps = [
  {
    icon: Eye,
    title: "Visit the Showhouse",
    desc: "Walk through the show house and see the quality of finishes, layout, and space in person.",
  },
  {
    icon: ShoppingBag,
    title: "Start Your Purchase Journey",
    desc: `Reserve your home with a ${PRICING.reservationDepositLabel} deposit and a flexible payment schedule.`,
  },
  {
    icon: Video,
    title: "Virtual Tour for Diaspora",
    desc: "Can't visit in person? We offer live video walkthroughs of the showhouse.",
  },
  {
    icon: CheckCircle2,
    title: "Response Within 24 Hours",
    desc: "Our team will reach out with a personalized information pack and next steps.",
  },
];

export default function LeadCaptureSection() {
  const [ref, inView] = useInView({ threshold: 0.08 });

  return (
    <section id="contact" ref={ref} className="relative" aria-label="Contact Form">
      {/* Diagonal divider */}
      <div className="relative -mb-px">
        <svg viewBox="0 0 1440 60" className="w-full block" preserveAspectRatio="none">
          <path d="M0,0 L1440,60 L0,60 L0,0 Z" fill="#1B3A2D" />
        </svg>
      </div>

      <div className="bg-cedar-forest py-20 lg:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-start">
            {/* Left: Copy */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="text-cedar-gold font-semibold text-[12px] tracking-[0.18em] uppercase mb-4 block">
                Get Started
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] text-white leading-tight mb-5">
                See It for Yourself,{" "}
                <span className="text-cedar-gold italic">Then Decide</span>
              </h2>
              <p className="text-white/60 text-[16px] leading-relaxed mb-10 max-w-md">
                Whether you want to walk through the show house, book your home,
                or explore the investment opportunity — our team is ready to guide you.
              </p>

              <div className="space-y-5">
                {valueProps.map((vp, i) => (
                  <motion.div
                    key={vp.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                    className="flex items-start gap-3.5"
                  >
                    <div className="w-9 h-9 bg-cedar-gold/[0.08] flex items-center justify-center shrink-0">
                      <vp.icon size={16} className="text-cedar-gold" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-[13px] mb-0.5">{vp.title}</h3>
                      <p className="text-white/40 text-[12px] leading-relaxed">{vp.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <LeadForm variant="dark" source="home-contact" extended />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
