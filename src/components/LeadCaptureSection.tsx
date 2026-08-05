/*
 * LeadCaptureSection — Cedar Homes "Kenyan Earth Modernism"
 * Contact form with interest options + value propositions
 */
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { Send, CheckCircle2, Eye, ShoppingBag, Video, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FormData {
  firstName: string;
  email: string;
  phone: string;
  interest: string;
}

const initialFormData: FormData = {
  firstName: "",
  email: "",
  phone: "",
  interest: "",
};

const valueProps = [
  {
    icon: Eye,
    title: "Visit the Showhouse",
    desc: "Walk through Unit 1 and see the quality of finishes, layout, and space in person.",
  },
  {
    icon: ShoppingBag,
    title: "Pre-Order at Today's Price",
    desc: "Lock in current pricing with a Ksh 500K deposit. Flexible payment plans available.",
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
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.firstName || !formData.email || !formData.phone || !formData.interest) {
        toast.error("Please fill in all fields");
        return;
      }
      setLoading(true);
      // Simulate submission
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
        toast.success("Thank you! We'll be in touch within 24 hours.");
      }, 800);
    },
    [formData]
  );

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
                Whether you want to walk through the showhouse, pre-order your dream home,
                or explore the investment opportunity — our team is ready to guide you.
              </p>

              <div className="space-y-5">
                {valueProps.map((vp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                    className="flex items-start gap-3.5"
                  >
                    <div className="w-9 h-9 bg-cedar-gold/[0.08] flex items-center justify-center shrink-0">
                      <vp.icon size={16} className="text-cedar-gold" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-[13px] mb-0.5">{vp.title}</h4>
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
              {submitted ? (
                <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] p-8 lg:p-10 text-center">
                  <div className="w-14 h-14 bg-cedar-gold/15 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={28} className="text-cedar-gold" />
                  </div>
                  <h3 className="font-serif text-2xl text-white mb-3">Thank You!</h3>
                  <p className="text-white/60 text-[15px] leading-relaxed max-w-sm mx-auto">
                    Your inquiry has been received. A member of our team will contact you
                    within 24 hours with a personalized information pack.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] p-7 lg:p-8"
                  noValidate
                >
                  <h3 className="font-serif text-xl text-white mb-1.5">Get in Touch</h3>
                  <p className="text-white/40 text-[13px] mb-7">Fill in your details and tell us how we can help.</p>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="firstName" className="text-white/60 text-[13px] mb-1.5 block font-medium">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.1] text-white px-4 py-3 text-[14px] placeholder:text-white/25 focus:border-cedar-gold/50 focus:outline-none focus:ring-1 focus:ring-cedar-gold/20 transition-all duration-200"
                        placeholder="Enter your first name"
                        autoComplete="given-name"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="text-white/60 text-[13px] mb-1.5 block font-medium">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.1] text-white px-4 py-3 text-[14px] placeholder:text-white/25 focus:border-cedar-gold/50 focus:outline-none focus:ring-1 focus:ring-cedar-gold/20 transition-all duration-200"
                        placeholder="your@email.com"
                        autoComplete="email"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="text-white/60 text-[13px] mb-1.5 block font-medium">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.1] text-white px-4 py-3 text-[14px] placeholder:text-white/25 focus:border-cedar-gold/50 focus:outline-none focus:ring-1 focus:ring-cedar-gold/20 transition-all duration-200"
                        placeholder="+254 7XX XXX XXX"
                        autoComplete="tel"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="interest" className="text-white/60 text-[13px] mb-1.5 block font-medium">
                        I am interested in:
                      </label>
                      <select
                        id="interest"
                        value={formData.interest}
                        onChange={(e) => updateField("interest", e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.1] text-white px-4 py-3 text-[14px] focus:border-cedar-gold/50 focus:outline-none focus:ring-1 focus:ring-cedar-gold/20 transition-all duration-200 appearance-none"
                        required
                      >
                        <option value="" className="bg-[#1B3A2D]">Select an option</option>
                        <option value="showhouse-visit" className="bg-[#1B3A2D]">Visiting the showhouse</option>
                        <option value="pre-order" className="bg-[#1B3A2D]">Pre-ordering a unit</option>
                        <option value="buy-showhouse" className="bg-[#1B3A2D]">Buying the showhouse (Unit 1)</option>
                        <option value="virtual-tour" className="bg-[#1B3A2D]">Virtual tour (Diaspora)</option>
                        <option value="investment-info" className="bg-[#1B3A2D]">Investment information</option>
                        <option value="payment-plan" className="bg-[#1B3A2D]">Payment plan details</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-cedar-terracotta hover:bg-cedar-terracotta-light disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cedar-terracotta/15 mt-2 text-[14px]"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          Send My Inquiry
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
